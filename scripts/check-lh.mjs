import fs from 'node:fs';

const d = JSON.parse(fs.readFileSync('reports/lighthouse/mobile.json', 'utf8'));
for (const v of d.categories.performance.auditRefs) {
  const audit = d.audits[v.id];
  if (audit && audit.score !== null && audit.score < 0.95) {
    console.log(`${v.id} (weight: ${v.weight}): score=${audit.score}, val=${audit.displayValue || audit.numericValue}`);
  }
}
