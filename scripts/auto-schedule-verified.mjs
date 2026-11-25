#!/usr/bin/env node
// scripts/auto-schedule-verified.mjs
// After re-capture + audit, finds newly verified states/cities and appends them
// to docs/publish-schedule.md at 1 per day after the last scheduled date.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const taxes = JSON.parse(fs.readFileSync(path.join(root, 'data/state-taxes.json'), 'utf8'));
const cities = JSON.parse(fs.readFileSync(path.join(root, 'data/cities.json'), 'utf8'));
const schedule = fs.readFileSync(path.join(root, 'docs/publish-schedule.md'), 'utf8');

const verifiedStates = taxes.filter(s => s.status === 'verified' && !schedule.includes(s.slug));
const verifiedCities = cities.filter(c => c.status === 'verified' && !schedule.includes(c.slug));

if (verifiedStates.length === 0 && verifiedCities.length === 0) {
  console.log('No newly verified pages to schedule.');
  process.exit(0);
}

// Find the last date in the schedule
const dateRe = /\d{4}-\d{2}-\d{2}/g;
const dates = [...schedule.matchAll(dateRe)].map(m => m[0]).sort();
let lastDate = dates.length ? new Date(dates[dates.length - 1]) : new Date();

const lines = [];
for (const item of [...verifiedStates, ...verifiedCities]) {
  lastDate.setDate(lastDate.getDate() + 1);
  // Skip weekends
  while (lastDate.getDay() === 0 || lastDate.getDay() === 6) {
    lastDate.setDate(lastDate.getDate() + 1);
  }
  const dateStr = lastDate.toISOString().slice(0, 10);
  const type = item.brackets ? 'State paycheck' : 'City min-wage';
  lines.push(`| ${dateStr} | ${type} | ${item.name || item.slug} | auto-scheduled |`);
}

if (lines.length > 0) {
  fs.appendFileSync(path.join(root, 'docs/publish-schedule.md'), '\n' + lines.join('\n') + '\n');
  console.log(`Auto-scheduled ${lines.length} newly verified pages.`);
}
