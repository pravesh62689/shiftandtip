import fs from 'node:fs';

const tipped = JSON.parse(fs.readFileSync('data/raw/dol-tipped.json', 'utf8'));
const minwage = JSON.parse(fs.readFileSync('data/raw/dol-minwage.json', 'utf8'));
const states = JSON.parse(fs.readFileSync('data/states.json', 'utf8')).states;

console.log('States total:', states.length);
console.log('Tipped total:', tipped.length);
console.log('Minwage total:', minwage.length);

for (const s of states) {
  const t = tipped.find(x => x.code === s.code);
  const m = minwage.find(x => x.code === s.code);
  console.log(`${s.code}: MW=${m?.minWage} | T_cash=${t?.minCashWage} | T_credit=${t?.maxTipCredit} | T_comb=${t?.combinedRate}`);
}
