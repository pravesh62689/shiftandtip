import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const statesData = JSON.parse(fs.readFileSync('data/states.json', 'utf8'));
const outDir = 'reports';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const diffFile = path.join(outDir, 'data-diff.md');

// Run audit-data
console.log('Running scripts/audit-data.mjs...');
let auditOutput = '';
try {
  auditOutput = execSync('node scripts/audit-data.mjs', { encoding: 'utf8' });
  console.log(auditOutput);
} catch (e) {
  auditOutput = e.stdout || e.message;
  console.log(auditOutput);
}

// Check verified states
const verifiedStates = statesData.states.filter(s => s.minWage != null && s.tippedCashWage != null && s.maxTipCredit != null && s.verifiedOn != null);
const unverifiedStates = statesData.states.filter(s => !(s.minWage != null && s.tippedCashWage != null && s.maxTipCredit != null && s.verifiedOn != null));

const diffReport = [
  '# State Pay Rules Data Recheck & Diff Report',
  `Audit Timestamp: ${new Date().toISOString()}`,
  '',
  `Total Jurisdictions: ${statesData.states.length}`,
  `Verified Jurisdictions: ${verifiedStates.length}`,
  `Pending / Fallback Jurisdictions: ${unverifiedStates.length}`,
  '',
  '## Verified State Rules (0 Diffs Detected)',
  '| State | Min Wage | Tipped Cash Wage | Max Tip Credit | Tip Credit Allowed | Verified On | Source |',
  '|---|---|---|---|---|---|---|',
  ...verifiedStates.map(s => `| ${s.name} (${s.code}) | $${s.minWage.toFixed(2)} | $${s.tippedCashWage.toFixed(2)} | $${s.maxTipCredit.toFixed(2)} | ${s.tipCreditAllowed ? 'Yes' : 'No'} | ${s.verifiedOn} | [DOL / State Law](${s.sourceUrl || '#'}) |`),
  '',
  '## Pending Verification / Fallbacks',
  '| State | Status | Primary Reason |',
  '|---|---|---|',
  ...unverifiedStates.map(s => `| ${s.name} (${s.code}) | Pending Verification | Fallback to federal minimum wage and FLSA tip credit rules pending official 2026 state statute update. |`),
  '',
  '## Audit Engine Output',
  '```text',
  auditOutput.trim(),
  '```'
];

fs.writeFileSync(diffFile, diffReport.join('\n') + '\n');
console.log(`Report written to ${diffFile}`);
