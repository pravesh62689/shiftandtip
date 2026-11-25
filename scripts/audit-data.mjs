import fs from 'node:fs';
import path from 'node:path';

// Read new snapshots if present, fallback to raw html
const minSnapPath = fs.existsSync('data/raw/snapshots/dol-minwage-2026-11-24.html')
  ? 'data/raw/snapshots/dol-minwage-2026-11-24.html'
  : 'data/raw/dol-minwage.html';

const tipSnapPath = fs.existsSync('data/raw/snapshots/dol-tipped-2026-11-24.html')
  ? 'data/raw/snapshots/dol-tipped-2026-11-24.html'
  : 'data/raw/dol-tipped.html';

const minHtml = fs.readFileSync(minSnapPath, 'utf8');
const tipHtml = fs.readFileSync(tipSnapPath, 'utf8');
const statesPath = 'data/states.json';
const statesData = JSON.parse(fs.readFileSync(statesPath, 'utf8'));

// Extract state sections from dol-minwage
const minSections = {};
const reMin = /<div id="([a-z]{2})">([\s\S]*?)(?=<div id="[a-z]{2}">|<\/body>|<footer|$)/gi;
let m;
while ((m = reMin.exec(minHtml)) !== null) {
  minSections[m[1].toUpperCase()] = m[2];
}

// Extract state rows & footnotes from dol-tipped
// Match table rows <tr>...</tr> and footnotes <p id="...">...</p>
const tipRows = tipHtml.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
const tipFootnotes = tipHtml.match(/<p\s+id="\d+"[^>]*>[\s\S]*?<\/p>/gi) || [];

// Section in DOL table for states where tip credits are prohibited
const noTipCreditSectionMatch = /State requires employers to pay tipped employees full state minimum wage before tips[\s\S]*?(?=State requires employers to pay tipped employees a minimum cash wage)/i.exec(tipHtml);
const noTipCreditSection = noTipCreditSectionMatch ? noTipCreditSectionMatch[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ') : '';

function getTippedTextForState(stateName, stateCode, tipCreditAllowed) {
  let matchedText = '';
  const nameLower = stateName.toLowerCase();
  for (const row of tipRows) {
    if (row.toLowerCase().includes(nameLower)) {
      matchedText += '\n' + row.replace(/<[^>]+>/g, ' ');
    }
  }
  for (const fn of tipFootnotes) {
    if (fn.toLowerCase().includes(nameLower)) {
      matchedText += '\n' + fn.replace(/<[^>]+>/g, ' ');
    }
  }
  if (!tipCreditAllowed && noTipCreditSection.toLowerCase().includes(nameLower)) {
    matchedText += '\nState requires employers to pay tipped employees full state minimum wage before tips: ' + stateName;
  }
  return matchedText;
}

// State snapshots directory
const snapshotsDir = 'data/raw/snapshots';

function getStateSnapshotText(stateCode) {
  const txtPath = path.join(snapshotsDir, `state-${stateCode.toLowerCase()}-2026-11-24.txt`);
  if (fs.existsSync(txtPath)) {
    return fs.readFileSync(txtPath, 'utf8');
  }
  return '';
}

function findValueInText(text, val, isZeroAllowedNoTipCredit = false) {
  if (val == null || typeof val !== 'number') return null;

  if (val === 0 && isZeroAllowedNoTipCredit) {
    // Tip credit is prohibited/zero: check for zero, full state minimum wage, or prohibited tip credit
    const zeroPatterns = [
      /\$0(?:\.00)?(?![\d.])/i,
      /(?<![\d.])0(?:\.00)?(?![\d.])/i,
      /full\s+state\s+minimum\s+wage/i,
      /prohibit(?:s|ed)?\s+tip\s+credit/i,
      /no\s+tip\s+credit/i,
      /does\s+not\s+allow\s+tip\s+credit/i
    ];
    for (const rx of zeroPatterns) {
      const match = rx.exec(text);
      if (match) {
        const start = Math.max(0, match.index - 40);
        const end = Math.min(text.length, match.index + match[0].length + 40);
        let snippet = text.slice(start, end).replace(/\s+/g, ' ').trim().replace(/\|/g, '\\|');
        return { match: match[0], snippet };
      }
    }
    return null;
  }

  const patterns = [];
  const fixed2 = val.toFixed(2);
  // Match $15.00 or 15.00
  patterns.push(new RegExp(`\\$${fixed2.replace('.', '\\.')}(?![\\d.])`, 'i'));
  patterns.push(new RegExp(`(?<![\\d.])${fixed2.replace('.', '\\.')}(?![\\d.])`, 'i'));

  if (Number.isInteger(val)) {
    if (val !== 0) {
      patterns.push(new RegExp(`\\$${val}(?![\\d.])`, 'i'));
      patterns.push(new RegExp(`(?<![\\d.])${val}(?![\\d.])`, 'i'));
    }
  } else {
    // e.g. 14.7 -> $14.7 or 14.7
    const raw = String(val);
    patterns.push(new RegExp(`\\$${raw.replace('.', '\\.')}(?![\\d.])`, 'i'));
  }

  for (const rx of patterns) {
    const match = rx.exec(text);
    if (match) {
      const start = Math.max(0, match.index - 40);
      const end = Math.min(text.length, match.index + match[0].length + 40);
      let snippet = text.slice(start, end).replace(/\s+/g, ' ').trim().replace(/\|/g, '\\|');
      return { match: match[0], snippet };
    }
  }
  return null;
}

const auditRows = [];
const unverifiedList = [];
let nullCount = 0;

for (const state of statesData.states) {
  const minText = minSections[state.code] || '';
  const tipText = getTippedTextForState(state.name, state.code, state.tipCreditAllowed);
  const stateSnapText = getStateSnapshotText(state.code);
  const combinedText = minText + '\n' + tipText + '\n' + stateSnapText;

  const fields = ['minWage', 'tippedCashWage', 'maxTipCredit'];
  let stateHadFailure = false;

  for (const field of fields) {
    const originalVal = state[field];
    if (originalVal == null) {
      auditRows.push({
        state: state.code,
        name: state.name,
        field,
        value: 'null',
        found: 'No',
        snippet: '—'
      });
      stateHadFailure = true;
      continue;
    }

    const isZeroCredit = field === 'maxTipCredit' && originalVal === 0 && state.tipCreditAllowed === false;
    const foundResult = findValueInText(combinedText, originalVal, isZeroCredit);
    if (foundResult) {
      auditRows.push({
        state: state.code,
        name: state.name,
        field,
        value: String(originalVal),
        found: 'Yes',
        snippet: foundResult.snippet
      });
    } else {
      auditRows.push({
        state: state.code,
        name: state.name,
        field,
        value: String(originalVal),
        found: 'No',
        snippet: '—'
      });
      unverifiedList.push({ state: state.code, field, value: originalVal });
      state[field] = null;
      stateHadFailure = true;
      nullCount++;
    }
  }

  if (stateHadFailure) {
    state.verifiedOn = null;
  }
}

// Generate data/audit-report.md
let md = '# DOL Raw Data Audit Report\n\n';
md += `Mechanical verification of \`data/states.json\` against \`${minSnapPath}\` and \`${tipSnapPath}\` plus state snapshots.\n\n`;
md += `**Total values audited**: ${auditRows.length} (${statesData.states.length} states × 3 values)\n`;
md += `**Found verbatim**: ${auditRows.filter((r) => r.found === 'Yes').length}\n`;
md += `**Not found verbatim (set to null)**: ${nullCount}\n\n`;

md += '## Values Not Found Verbatim (Set to null, verifiedOn cleared)\n\n';
if (unverifiedList.length) {
  for (const item of unverifiedList) {
    md += `- **${item.state}** \`${item.field}\`: was \`${item.value}\`\n`;
  }
} else {
  md += 'None.\n';
}

md += '\n## Audit Verification Table\n\n';
md += '| State | Name | Field | Value | Found | Raw Snippet |\n';
md += '|---|---|---|---|---|---|\n';
for (const r of auditRows) {
  md += `| ${r.state} | ${r.name} | ${r.field} | ${r.value} | ${r.found} | \`${r.snippet}\` |\n`;
}

fs.writeFileSync('data/audit-report.md', md, 'utf8');
fs.writeFileSync(statesPath, JSON.stringify(statesData, null, 2) + '\n', 'utf8');

console.log(`Audited ${statesData.states.length} states.`);
console.log(`Total values: ${auditRows.length}`);
console.log(`Found verbatim: ${auditRows.filter((r) => r.found === 'Yes').length}`);
console.log(`Not found verbatim (set to null): ${nullCount}`);
console.log('Saved data/audit-report.md and updated data/states.json');
