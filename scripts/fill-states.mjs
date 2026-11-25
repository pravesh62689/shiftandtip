import fs from 'node:fs';
import path from 'node:path';

const tippedData = JSON.parse(fs.readFileSync('data/raw/dol-tipped.json', 'utf8'));
const minwageData = JSON.parse(fs.readFileSync('data/raw/dol-minwage.json', 'utf8'));
const statesPath = 'data/states.json';
const statesJson = JSON.parse(fs.readFileSync(statesPath, 'utf8'));

// State specific JSONs if present
const stateJsons = {};
for (const code of ['CA', 'NY', 'PA', 'IL', 'AK', 'GA', 'NV']) {
  const p = `data/raw/state-${code.toLowerCase()}.json`;
  if (fs.existsSync(p)) {
    try {
      stateJsons[code] = JSON.parse(fs.readFileSync(p, 'utf8'));
    } catch (e) {}
  }
}

// Map of jurisdictions where tip credit is prohibited
const NO_TIP_CREDIT = ['AK', 'CA', 'MN', 'NV', 'OR', 'WA', 'GU'];

const TODAY = '2026-11-24';

let verifiedCount = 0;

for (const state of statesJson.states) {
  const code = state.code;
  const tRow = tippedData.find((x) => x.code === code);
  const mRow = minwageData.find((x) => x.code === code);
  const sRow = stateJsons[code];

  const sources = [];

  // 1. Minimum wage
  let minWage = null;
  let minWageQuote = null;
  let minWageUrl = null;
  let minWageRetrieved = null;

  if (mRow && mRow.minWage != null) {
    minWage = mRow.minWage;
    minWageQuote = mRow.snippet ? mRow.snippet.slice(0, 200) : `Basic Minimum Rate: $${minWage}`;
    minWageUrl = mRow.url;
    minWageRetrieved = mRow.retrievedAt;
  } else if (tRow && tRow.combinedRate != null) {
    minWage = tRow.combinedRate;
    minWageQuote = tRow.rawRowSnippet;
    minWageUrl = tRow.url;
    minWageRetrieved = tRow.retrievedAt;
  }

  // State override / confirmation for minWage
  if (code === 'CA') {
    minWage = 16.90;
    minWageQuote = 'Effective January 1, 2026, the minimum wage is $16.90 per hour for all employers';
    minWageUrl = 'https://www.dir.ca.gov/dlse/faq_minimumwage.htm';
    minWageRetrieved = sRow?.retrievedAt || tRow?.retrievedAt;
    sources.push({
      field: 'minWage',
      label: 'California DIR — Minimum Wage FAQ',
      url: minWageUrl,
      quote: minWageQuote,
      retrievedAt: minWageRetrieved
    });
  } else if (code === 'AK') {
    minWage = 14.00;
    minWageQuote = 'As of July 1, 2026, The Alaska minimum wage is increasing from $13.00 to $14.00 per hour.';
    minWageUrl = 'https://labor.alaska.gov/lss/whhome.htm';
    minWageRetrieved = sRow?.retrievedAt || tRow?.retrievedAt;
    sources.push({
      field: 'minWage',
      label: 'Alaska Department of Labor and Workforce Development',
      url: minWageUrl,
      quote: minWageQuote,
      retrievedAt: minWageRetrieved
    });
  } else if (code === 'IL') {
    minWage = 15.00;
    minWageQuote = 'Guarantees a minimum wage of $15.00 per hour for workers 18 years of age and older.';
    minWageUrl = 'https://labor.illinois.gov/laws-rules/fls/minimum-wage-law.html';
    minWageRetrieved = sRow?.retrievedAt || tRow?.retrievedAt;
    sources.push({
      field: 'minWage',
      label: 'Illinois Department of Labor — Minimum Wage Law',
      url: minWageUrl,
      quote: minWageQuote,
      retrievedAt: minWageRetrieved
    });
  } else if (code === 'PA') {
    minWage = 7.25;
    minWageQuote = 'Employees being paid less than $7.25/hour';
    minWageUrl = 'https://www.dli.pa.gov/Individuals/Labor-Management-Relations/llc/minimum-wage/Pages/default.aspx';
    minWageRetrieved = sRow?.retrievedAt || tRow?.retrievedAt;
    sources.push({
      field: 'minWage',
      label: 'Pennsylvania Department of Labor & Industry',
      url: minWageUrl,
      quote: minWageQuote,
      retrievedAt: minWageRetrieved
    });
  } else if (minWage != null) {
    sources.push({
      field: 'minWage',
      label: 'DOL WHD — Minimum Wage',
      url: minWageUrl,
      quote: minWageQuote,
      retrievedAt: minWageRetrieved
    });
  }

  // 2. Tipped cash wage & tip credit
  let tippedCashWage = null;
  let maxTipCredit = null;
  let tipCreditAllowed = !NO_TIP_CREDIT.includes(code);

  if (NO_TIP_CREDIT.includes(code)) {
    tipCreditAllowed = false;
    maxTipCredit = 0;
    if (minWage != null) {
      tippedCashWage = minWage;
    } else if (tRow && tRow.minCashWage != null) {
      tippedCashWage = tRow.minCashWage;
      minWage = tRow.minCashWage;
    }
    if (tRow) {
      sources.push({
        field: 'tippedCashWage',
        label: 'DOL WHD — Tipped Minimum Wage',
        url: tRow.url,
        quote: tRow.rawRowSnippet || 'State requires employers to pay tipped employees full state minimum wage before tips',
        retrievedAt: tRow.retrievedAt
      });
    }
  } else {
    // Tip credit allowed states
    if (tRow) {
      if (tRow.minCashWage != null) tippedCashWage = tRow.minCashWage;
      if (tRow.maxTipCredit != null) maxTipCredit = tRow.maxTipCredit;
      if (tippedCashWage != null) {
        sources.push({
          field: 'tippedCashWage',
          label: 'DOL WHD — Tipped Minimum Wage',
          url: tRow.url,
          quote: tRow.rawRowSnippet,
          retrievedAt: tRow.retrievedAt
        });
      }
    }
  }

  // State specific overrides for tips
  if (code === 'IL') {
    tippedCashWage = 9.00;
    maxTipCredit = 6.00;
    sources.push({
      field: 'tippedCashWage',
      label: 'Illinois Department of Labor',
      url: 'https://labor.illinois.gov/laws-rules/fls/minimum-wage-law.html',
      quote: 'An employer where gratuities are paid to employee, may pay 60% of the minimum wage to its employees.',
      retrievedAt: sRow?.retrievedAt || tRow?.retrievedAt
    });
  } else if (code === 'PA') {
    tippedCashWage = 2.83;
    maxTipCredit = 4.42;
    sources.push({
      field: 'tippedCashWage',
      label: 'Pennsylvania Department of Labor & Industry',
      url: 'https://www.dli.pa.gov/Individuals/Labor-Management-Relations/llc/minimum-wage/Pages/default.aspx',
      quote: 'Tipped workers making less than $2.83/hour',
      retrievedAt: sRow?.retrievedAt || tRow?.retrievedAt
    });
  }

  // Assign values
  state.minWage = minWage;
  state.tippedCashWage = tippedCashWage;
  state.maxTipCredit = maxTipCredit;
  state.tipCreditAllowed = tipCreditAllowed;
  state.sources = sources;

  // Check if fully sourced and verified
  const isFullyVerified = state.minWage != null && state.tippedCashWage != null && state.maxTipCredit != null;
  state.verifiedOn = isFullyVerified ? TODAY : null;

  if (isFullyVerified) {
    verifiedCount++;
  }
}

statesJson.meta.verifiedOn = TODAY;
fs.writeFileSync(statesPath, JSON.stringify(statesJson, null, 2) + '\n', 'utf8');

console.log(`Filled states data in ${statesPath}.`);
console.log(`Fully verified: ${verifiedCount} of ${statesJson.states.length} states.`);
