import { spawn } from 'node:child_process';
import fs from 'node:fs';

const url = 'https://shiftandtip.blogspot.com/';
console.log('Testing Lighthouse on:', url);

const args = [
  '--yes',
  'lighthouse',
  url,
  '--output=json',
  '--output-path=reports/lighthouse/test-lh.json',
  '--chrome-flags=--headless=new --no-sandbox --disable-gpu',
  '--form-factor=mobile',
  '--only-categories=performance,accessibility',
  '--throttling-method=simulate',
  '--quiet',
];

const t0 = Date.now();
const proc = spawn('npx.cmd', args, { shell: true, stdio: 'inherit' });
proc.on('close', (code) => {
  console.log(`Lighthouse exited with code ${code} in ${(Date.now() - t0) / 1000}s`);
  if (code === 0 && fs.existsSync('reports/lighthouse/test-lh.json')) {
    const data = JSON.parse(fs.readFileSync('reports/lighthouse/test-lh.json', 'utf8'));
    console.log('Perf:', Math.round((data.categories.performance?.score || 0) * 100));
    console.log('A11y:', Math.round((data.categories.accessibility?.score || 0) * 100));
    console.log('CLS:', data.audits['cumulative-layout-shift']?.numericValue);
  }
});
