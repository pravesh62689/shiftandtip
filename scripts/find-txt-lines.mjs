import fs from 'node:fs';

const tipTxtLines = fs.readFileSync('data/raw/snapshots/dol-tipped-2026-11-24.txt', 'utf8').split('\n');
const codes = ['CA', 'TX', 'FL', 'PA', 'GA', 'AK', 'CO', 'NV'];
const stateNameMap = { CA: 'California', TX: 'Texas', FL: 'Florida', PA: 'Pennsylvania', GA: 'Georgia', AK: 'Alaska', CO: 'Colorado', NV: 'Nevada' };

for (const c of codes) {
  const name = stateNameMap[c];
  console.log(`\n=== dol-tipped.txt LINES FOR ${c} (${name}) ===`);
  tipTxtLines.forEach((l, idx) => {
    if (l.trim().startsWith(name) || l.trim() === name) {
      console.log(`line ${idx + 1}: ${l.slice(0, 120)}`);
      for (let j = 1; j <= 4; j++) {
        if (tipTxtLines[idx + j]) console.log(`  line ${idx + 1 + j}: ${tipTxtLines[idx + j].slice(0, 120)}`);
      }
    }
  });
}
