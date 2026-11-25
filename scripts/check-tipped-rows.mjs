import fs from 'node:fs';
const tipped = JSON.parse(fs.readFileSync('data/raw/dol-tipped.json', 'utf8'));
const codes = ['CT', 'MT', 'NY', 'DC', 'CA', 'NV', 'AK', 'IL', 'PA', 'GA'];
for (const c of codes) {
  const row = tipped.find(x => x.code === c);
  console.log(`=== ${c} ===`);
  console.log(JSON.stringify(row, null, 2));
}
