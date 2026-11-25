import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';

const reportsDir = 'reports/lighthouse';
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// 1. Start static server
console.log('Starting static server on port 4173...');
const serverProc = spawn('node', ['scripts/serve.mjs'], { stdio: 'inherit' });

// Wait for server to be responsive
async function waitForServer(url, timeout = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
          if (res.statusCode === 200) resolve();
          else reject(new Error('Status ' + res.statusCode));
        });
        req.on('error', reject);
      });
      return true;
    } catch (e) {
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  throw new Error('Server timed out');
}

await waitForServer('http://localhost:4173/preview/index.html');
console.log('Server is ready. Running Lighthouse mobile audit...');

const outputPath = path.resolve('reports/lighthouse/mobile.json');

// Run Lighthouse CLI
const args = [
  'lighthouse',
  'http://localhost:4173/preview/index.html',
  '--output=json',
  `--output-path=${outputPath}`,
  '--only-categories=performance,accessibility,best-practices,seo',
  '--chrome-flags=--headless=new --no-sandbox',
  '--form-factor=mobile',
  '--quiet'
];

const lhProc = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', args, {
  stdio: 'inherit',
  shell: true
});

lhProc.on('close', (code) => {
  serverProc.kill();
  if (code !== 0) {
    console.error(`Lighthouse failed with code ${code}`);
    process.exit(code);
  }

  if (fs.existsSync(outputPath)) {
    const data = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    const perf = Math.round((data.categories.performance?.score || 0) * 100);
    const a11y = Math.round((data.categories.accessibility?.score || 0) * 100);
    const bp = Math.round((data.categories['best-practices']?.score || 0) * 100);
    const seo = Math.round((data.categories.seo?.score || 0) * 100);
    const cls = data.audits['cumulative-layout-shift']?.numericValue || 0;

    console.log('\n=== LIGHTHOUSE MOBILE REPORT ===');
    console.log(`Performance:    ${perf} / 100  (Target: >= 90)`);
    console.log(`Accessibility:  ${a11y} / 100  (Target: >= 95)`);
    console.log(`Best Practices: ${bp} / 100`);
    console.log(`SEO:            ${seo} / 100`);
    console.log(`CLS:            ${cls.toFixed(4)}       (Target: < 0.05)`);
    console.log(`Saved report to ${outputPath}`);
  }
});
