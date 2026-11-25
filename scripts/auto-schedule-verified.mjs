#!/usr/bin/env node
// scripts/auto-schedule-verified.mjs
// After re-capture + audit, finds newly verified states and cities whose pages pass
// quality gates (600+ words, <15% 12-word shingle overlap, no "pending verification" / negative diff bugs),
// appends them at 1/day to docs/publish-schedule.md, and stages drafts via Blogger API if credentials exist.

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const taxData = JSON.parse(fs.readFileSync(path.join(root, 'data/state-taxes.json'), 'utf8'));
const citiesData = JSON.parse(fs.readFileSync(path.join(root, 'data/cities.json'), 'utf8'));
const statesMeta = JSON.parse(fs.readFileSync(path.join(root, 'data/states.json'), 'utf8')).states || [];
const schedulePath = path.join(root, 'docs/publish-schedule.md');
const schedule = fs.readFileSync(schedulePath, 'utf8');

function stripFrontmatter(md) {
  return md.replace(/^---[\s\S]*?---/, '').trim();
}

function wordCount(body) {
  return body.split(/\s+/).filter(Boolean).length;
}

function get12Shingles(body) {
  const words = body.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim().split(/\s+/).filter(Boolean);
  const set = new Set();
  for (let i = 0; i <= words.length - 12; i++) {
    set.add(words.slice(i, i + 12).join(' '));
  }
  return set;
}

function maxShingleOverlap(body, corpusShingles) {
  const s1 = get12Shingles(body);
  if (s1.size === 0 || corpusShingles.size === 0) return 0;
  let shared = 0;
  for (const sh of s1) {
    if (corpusShingles.has(sh)) shared++;
  }
  return shared / s1.size;
}

function passesQualityGate(mdText, corpusShingles) {
  const body = stripFrontmatter(mdText);
  const wc = wordCount(body);
  if (wc < 600) return { pass: false, reason: `word count ${wc} < 600`, wc };
  if (/pending verification|\bnull\b|\$-/i.test(body)) {
    return { pass: false, reason: 'contains placeholder/negative value', wc };
  }
  const ov = maxShingleOverlap(body, corpusShingles);
  if (ov >= 0.15) return { pass: false, reason: `shingle overlap ${(ov * 100).toFixed(1)}% >= 15%`, wc };
  return { pass: true, wc, ov };
}

// Build corpus shingles from already-scheduled content
const corpusShingles = new Set();
for (const dir of ['tools', 'states', 'guides', 'cities', 'es']) {
  const dirPath = path.join(root, 'content', dir);
  if (!fs.existsSync(dirPath)) continue;
  for (const f of fs.readdirSync(dirPath)) {
    if (!f.endsWith('.md')) continue;
    const slug = f.replace(/\.md$/, '');
    if (schedule.includes(`\`${slug}\``)) {
      const body = stripFrontmatter(fs.readFileSync(path.join(dirPath, f), 'utf8'));
      for (const sh of get12Shingles(body)) corpusShingles.add(sh);
    }
  }
}

const verifiedStates = Object.entries(taxData.states || {})
  .map(([code, st]) => {
    const info = statesMeta.find((s) => s.code === code);
    return { code, slug: info ? `${info.slug}-paycheck-calculator-2027` : null, name: info?.name || code, ...st };
  })
  .filter((s) => s.slug && s.status === 'verified' && !schedule.includes(`\`${s.slug}\``));

const verifiedCities = (citiesData.cities || [])
  .map((c) => {
    const slug = `${c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-minimum-wage-2027`;
    return { slug, ...c };
  })
  .filter((c) => c.status === 'verified' && c.rate != null && !schedule.includes(`\`${c.slug}\``));

const candidates = [];
for (const s of verifiedStates) {
  const mdPath = path.join(root, 'content/states', `${s.slug}.md`);
  if (!fs.existsSync(mdPath)) continue;
  const gate = passesQualityGate(fs.readFileSync(mdPath, 'utf8'), corpusShingles);
  if (gate.pass) {
    candidates.push({ category: 'State Paycheck', slug: s.slug, title: `${s.name} Paycheck Calculator 2027`, words: gate.wc });
  } else {
    console.log(`Skipped ${s.slug}: ${gate.reason}`);
  }
}
for (const c of verifiedCities) {
  const mdPath = path.join(root, 'content/cities', `${c.slug}.md`);
  if (!fs.existsSync(mdPath)) continue;
  const gate = passesQualityGate(fs.readFileSync(mdPath, 'utf8'), corpusShingles);
  if (gate.pass) {
    candidates.push({ category: 'City Min-Wage', slug: c.slug, title: `${c.name} Minimum Wage 2027`, words: gate.wc });
  } else {
    console.log(`Skipped ${c.slug}: ${gate.reason}`);
  }
}

if (candidates.length === 0) {
  console.log('No newly verified quality-gated pages to schedule.');
  process.exit(0);
}

const dates = [...schedule.matchAll(/\d{4}-\d{2}-\d{2}/g)].map((m) => m[0]).sort();
const nextDate = dates.length ? new Date(dates[dates.length - 1] + 'T00:00:00Z') : new Date();

const rows = [];
for (const item of candidates) {
  nextDate.setUTCDate(nextDate.getUTCDate() + 1);
  const dateStr = nextDate.toISOString().slice(0, 10);
  rows.push(`| ${dateStr} | EN | ${item.category} | \`${item.slug}\` | ${item.title} | VERIFIED (.gov) | Pass (${item.words}w) | Queued |`);
}

fs.appendFileSync(schedulePath, '\n' + rows.join('\n') + '\n');
console.log(`Added ${rows.length} newly verified pages to docs/publish-schedule.md.`);

if (fs.existsSync(path.join(root, 'secrets/token.json')) && fs.existsSync(path.join(root, 'secrets/client_secret.json'))) {
  execSync('npm run build:posts && node scripts/publish-blogger.mjs --confirm', { cwd: root, stdio: 'inherit' });
} else {
  console.log('Blogger secrets not present in secrets/; skipping Blogger API push.');
}
