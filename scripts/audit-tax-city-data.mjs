// scripts/audit-tax-city-data.mjs
// Verbatim-match audit of data/state-taxes.json and data/cities.json against captured Playwright snapshots.
// Unverified values are set to null with status: 'pending verification'.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const rawDir = path.join(rootDir, 'data/raw');
const snapshotsDir = path.join(rawDir, 'snapshots');
const taxPath = path.join(rootDir, 'data/state-taxes.json');
const citiesPath = path.join(rootDir, 'data/cities.json');

const taxData = JSON.parse(fs.readFileSync(taxPath, 'utf8'));
const citiesData = JSON.parse(fs.readFileSync(citiesPath, 'utf8'));

// Load all text snapshots
const snapshotTexts = {};
if (fs.existsSync(snapshotsDir)) {
  for (const f of fs.readdirSync(snapshotsDir)) {
    if (f.endsWith('.txt')) {
      snapshotTexts[f] = fs.readFileSync(path.join(snapshotsDir, f), 'utf8');
    }
  }
}

console.log(`Loaded ${Object.keys(snapshotTexts).length} text snapshots for verbatim audit.`);

// 1. Audit State Taxes (51 Jurisdictions)
let verifiedStates = 0;
const stateAuditResults = [];

for (const [code, state] of Object.entries(taxData.states)) {
  const rawStateFile = path.join(rawDir, `tax-${code.toLowerCase()}.json`);
  let rawRecord = null;
  if (fs.existsSync(rawStateFile)) {
    try { rawRecord = JSON.parse(fs.readFileSync(rawStateFile, 'utf8')); } catch (e) {}
  }

  const quote = rawRecord?.quote || state.quote;
  const url = rawRecord?.url || state.sourceUrl;
  let sourceMatch = false;

  if (quote && url && url.includes('.gov')) {
    // Check verbatim match in snapshots
    for (const [sName, sText] of Object.entries(snapshotTexts)) {
      if (sText.includes(quote.trim())) {
        sourceMatch = true;
        break;
      }
    }
  }

  if (sourceMatch) {
    verifiedStates++;
    state.status = 'verified';
    state.verified = true;
    state.verifiedOn = new Date().toISOString().split('T')[0];
    state.sourceUrl = url;
    state.quote = quote;
    stateAuditResults.push({ code, status: 'VERIFIED' });
  } else {
    // Null unverified rate/bracket fields per instruction
    state.status = 'pending verification';
    state.verified = false;
    state.verifiedOn = null;
    state.unverifiedReason = 'Awaiting official Department of Revenue .gov Playwright snapshot verbatim match.';
    if (state.type !== 'none') {
      state.flatRate = null;
      state.standardDeduction = null;
      state.brackets = null;
    }
    stateAuditResults.push({ code, status: 'PENDING_VERIFICATION' });
  }
}

taxData.meta.auditTimestamp = new Date().toISOString();
taxData.meta.verifiedCount = verifiedStates;
taxData.meta.totalCount = Object.keys(taxData.states).length;
fs.writeFileSync(taxPath, JSON.stringify(taxData, null, 2));

// 2. Audit Cities (40 Municipalities)
let verifiedCities = 0;
const cityAuditResults = [];

for (const city of citiesData.cities) {
  // Check if city has raw record
  const slug = city.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const rawCityFile = path.join(rawDir, `city-${slug}.json`);
  let rawRecord = null;
  if (fs.existsSync(rawCityFile)) {
    try { rawRecord = JSON.parse(fs.readFileSync(rawCityFile, 'utf8')); } catch (e) {}
  } else {
    // try short name or search
    const files = fs.readdirSync(rawDir).filter(f => f.startsWith('city-') && f.endsWith('.json'));
    for (const f of files) {
      try {
        const c = JSON.parse(fs.readFileSync(path.join(rawDir, f), 'utf8'));
        if (c.name.toLowerCase() === city.name.toLowerCase()) {
          rawRecord = c;
          break;
        }
      } catch (e) {}
    }
  }

  const quote = rawRecord?.quote || city.quote;
  const url = rawRecord?.url || city.url;
  let sourceMatch = false;

  if (quote && url && url.includes('.gov')) {
    for (const [sName, sText] of Object.entries(snapshotTexts)) {
      if (sText.includes(quote.trim())) {
        sourceMatch = true;
        break;
      }
    }
  }

  if (sourceMatch) {
    verifiedCities++;
    city.status = 'verified';
    city.verified = true;
    city.verifiedOn = new Date().toISOString().split('T')[0];
    if (rawRecord?.rate) city.rate = rawRecord.rate;
    city.sourceUrl = url;
    city.quote = quote;
    cityAuditResults.push({ name: city.name, status: 'VERIFIED' });
  } else {
    city.status = 'pending verification';
    city.verified = false;
    city.rate = null;
    city.unverifiedReason = 'Awaiting official municipal labor standards .gov Playwright snapshot verbatim match.';
    cityAuditResults.push({ name: city.name, status: 'PENDING_VERIFICATION' });
  }
}

citiesData.meta.auditTimestamp = new Date().toISOString();
citiesData.meta.verifiedCount = verifiedCities;
citiesData.meta.totalCount = citiesData.cities.length;
fs.writeFileSync(citiesPath, JSON.stringify(citiesData, null, 2));

console.log('=== DATA AUDIT RESULTS ===');
console.log(`State Income Taxes: ${verifiedStates} / ${Object.keys(taxData.states).length} verified.`);
console.log(`City Minimum Wages: ${verifiedCities} / ${citiesData.cities.length} verified.`);
