import fs from 'node:fs';

const tipTxt = fs.readFileSync('data/raw/snapshots/dol-tipped-2026-11-24.txt', 'utf8').split('\n');
const states = ['Alaska', 'California', 'Colorado', 'Florida', 'Georgia', 'Nevada', 'Pennsylvania', 'Texas'];

for (const s of states) {
  for (let i = 0; i < tipTxt.length; i++) {
    if (tipTxt[i].startsWith(s)) {
      console.log(`${s} in dol-tipped.txt L${i + 1}: ${tipTxt[i]}`);
    }
  }
}
