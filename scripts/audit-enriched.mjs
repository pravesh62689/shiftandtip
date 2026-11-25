// scripts/audit-enriched.mjs
import fs from 'node:fs';
import path from 'node:path';

const stateFiles = [
  'states/california-overtime-calculator.md',
  'states/texas-tipped-minimum-wage-and-overtime-calculator.md',
  'states/florida-tipped-minimum-wage-and-overtime-calculator.md',
  'states/new-york-tipped-minimum-wage-and-overtime-calculator.md',
  'states/colorado-overtime-calculator.md',
  'states/alaska-overtime-calculator.md',
  'states/pennsylvania-tipped-minimum-wage-and-overtime-calculator.md',
  'states/illinois-tipped-minimum-wage-and-overtime-calculator.md',
  'states/georgia-tipped-minimum-wage-and-overtime-calculator.md',
];

const guideFiles = [
  'guides/is-tip-pooling-legal.md',
  'guides/tip-credit-explained.md',
  'guides/how-to-split-tips-fairly.md',
  'guides/what-is-a-typical-tip-out.md',
  'guides/daily-overtime-states.md',
  'guides/shift-differential-overtime.md',
  'guides/tipped-employee-overtime.md',
  'guides/no-tax-on-tips-rules.md',
  'guides/no-tax-on-overtime-california.md',
  'guides/how-to-read-tipped-paystub.md',
];

const allFiles = [...stateFiles, ...guideFiles];
const cliches = ['in conclusion', 'it is important to note', 'testament to', 'delve', 'beacon', 'game-changer', 'tapestry', 'nestled', 'moreover', 'furthermore'];

console.log(`Auditing ${allFiles.length} queued items (9 state tools + 10 guides)...\n`);

// 1. Shingle helper
function get12Shingles(text) {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim().split(/\s+/).filter(Boolean);
  const shingles = new Set();
  for (let i = 0; i <= words.length - 12; i++) {
    shingles.add(words.slice(i, i + 12).join(' '));
  }
  return shingles;
}

const fileData = [];
let failures = 0;

for (const rel of allFiles) {
  const full = path.join('F:/shiftandtip/content', rel);
  const raw = fs.readFileSync(full, 'utf8');
  const isState = rel.startsWith('states/');
  const body = raw.replace(/---[\s\S]*?---/, '').trim();
  const words = body.split(/\s+/).filter(Boolean).length;
  const minWords = isState ? 600 : 900;
  const faqs = (body.match(/###\s+[^\n?]+\?/g) || []).length;
  const examples = (body.match(/##\s+Worked Example|###\s+Worked Example|\*\*Step 1/gi) || []).length;
  const foundCliches = cliches.filter(c => new RegExp('\\b' + c + '\\b', 'i').test(body));
  const needsEdit = /needs human edit:\s*true/i.test(raw);

  const wordPass = words >= minWords;
  const faqPass = faqs >= 4;
  const exPass = examples >= 2;
  const clichePass = foundCliches.length === 0;
  const editPass = !needsEdit;

  if (!wordPass || !faqPass || !exPass || !clichePass || !editPass) failures++;

  fileData.push({
    file: rel,
    words,
    minWords,
    wordPass,
    faqs,
    faqPass,
    examples,
    exPass,
    cliches: foundCliches.join(', '),
    needsEdit,
    shingles: get12Shingles(body),
  });
}

console.table(fileData.map(f => ({
  file: f.file,
  words: `${f.words}/${f.minWords} (${f.wordPass ? 'PASS' : 'FAIL'})`,
  faqs: `${f.faqs} (${f.faqPass ? 'PASS' : 'FAIL'})`,
  examples: `${f.examples} (${f.exPass ? 'PASS' : 'FAIL'})`,
  cliches: f.cliches || 'None (PASS)',
  needsEdit: f.needsEdit ? 'TRUE (FAIL)' : 'FALSE (PASS)',
})));

// 2. Pairwise 12-word shingle overlap check
console.log('\nTesting pairwise 12-word shingle overlap across all files (threshold < 15%)...');
let maxOverlap = 0;
let worstPair = '';

for (let i = 0; i < fileData.length; i++) {
  for (let j = i + 1; j < fileData.length; j++) {
    const s1 = fileData[i].shingles;
    const s2 = fileData[j].shingles;
    if (s1.size === 0 || s2.size === 0) continue;
    let common = 0;
    for (const sh of s1) {
      if (s2.has(sh)) common++;
    }
    const overlap = common / Math.min(s1.size, s2.size);
    if (overlap > maxOverlap) {
      maxOverlap = overlap;
      worstPair = `${fileData[i].file} <-> ${fileData[j].file}`;
    }
    if (overlap >= 0.15) {
      console.error(`FAIL: 12-word shingle overlap ${(overlap * 100).toFixed(1)}% between ${fileData[i].file} and ${fileData[j].file}`);
      failures++;
    }
  }
}

console.log(`Max pairwise overlap: ${(maxOverlap * 100).toFixed(2)}% (${worstPair})`);
console.log(`Overall status: ${failures === 0 ? 'ALL CRITERIA PASSED' : failures + ' AUDIT FAILURE(S)'}`);

if (failures > 0) process.exit(1);
