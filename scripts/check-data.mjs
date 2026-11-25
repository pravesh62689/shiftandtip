// Reports unverified state data. --report = list only; without it, exits 1 when anything is missing/stale.
import { readFileSync } from 'node:fs';
const d = JSON.parse(readFileSync('data/states.json', 'utf8'));
const req = ['minWage', 'tippedCashWage', 'maxTipCredit', 'verifiedOn'];
const now = Date.now(); let bad = 0;
for (const s of d.states) {
  const miss = req.filter((k) => s[k] == null);
  if (!s.sources || !s.sources.length) miss.push('sources');
  if (s.verifiedOn && now - Date.parse(s.verifiedOn) > 120 * 864e5) miss.push('stale(>120d)');
  if (miss.length) { bad++; console.log(s.code + ': ' + miss.join(', ')); }
}
console.log(bad ? bad + ' of ' + d.states.length + ' states need verified data.' : 'All states verified.');
if (bad && !process.argv.includes('--report')) process.exit(1);
