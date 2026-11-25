import fs from 'node:fs';

const states = ['CA', 'TX', 'FL', 'PA', 'GA', 'AK', 'CO', 'NV'];

function searchFile(filePath, patterns) {
  if (!fs.existsSync(filePath)) return [];
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  const results = [];
  lines.forEach((line, idx) => {
    for (const p of patterns) {
      if (line.toLowerCase().includes(p.toLowerCase())) {
        results.push({ file: filePath, lineNum: idx + 1, text: line.trim() });
      }
    }
  });
  return results;
}

const statesData = JSON.parse(fs.readFileSync('data/states.json', 'utf8')).states;

for (const code of states) {
  const s = statesData.find(x => x.code === code);
  console.log(`\n=== STATE: ${code} (${s.name}) ===`);
  console.log(`minWage: ${s.minWage}, tippedCashWage: ${s.tippedCashWage}, maxTipCredit: ${s.maxTipCredit}, allowed: ${s.tipCreditAllowed}`);
  
  // Search in state snapshot if exists
  const stateSnap = `data/raw/snapshots/state-${code.toLowerCase()}-2026-11-24.txt`;
  const dolMin = 'data/raw/snapshots/dol-minwage-2026-11-24.html';
  const dolTip = 'data/raw/snapshots/dol-tipped-2026-11-24.html';

  console.log('--- Matches in state snapshot ---');
  const m1 = searchFile(stateSnap, [String(s.minWage), String(s.tippedCashWage)]);
  m1.slice(0, 3).forEach(r => console.log(`  [${r.file}:${r.lineNum}] ${r.text.slice(0, 120)}`));

  console.log('--- Matches in DOL minwage ---');
  const m2 = searchFile(dolMin, [`id="${code.toLowerCase()}"`, s.name]);
  m2.slice(0, 2).forEach(r => console.log(`  [${r.file}:${r.lineNum}] ${r.text.slice(0, 120)}`));

  console.log('--- Matches in DOL tipped ---');
  const m3 = searchFile(dolTip, [s.name]);
  m3.slice(0, 2).forEach(r => console.log(`  [${r.file}:${r.lineNum}] ${r.text.slice(0, 120)}`));
}
