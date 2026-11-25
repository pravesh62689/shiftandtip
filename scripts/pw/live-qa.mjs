import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const liveUrlsFile = 'data/live-urls.json';
const liveReportsDir = 'reports/live';
const reportFile = 'reports/live-qa.md';

if (!fs.existsSync(liveReportsDir)) {
  fs.mkdirSync(liveReportsDir, { recursive: true });
}

// Expected calculations for tools
const EXPECTED_CHECKS = {
  'tip-pool-calculator': ['$213.11'],
  'tip-out-calculator': ['$180.00'],
  'overtime-and-double-time-calculator': ['$1,030.00'],
  'shift-differential-calculator': ['$997.50'],
  'tipped-overtime-calculator': ['$113.98'],
  'take-home-pay-with-tips-calculator': ['$1,175.25'],
  'no-tax-on-tips-and-overtime-deduction-estimator': ['$22,000.00'],
};

async function main() {
  if (!fs.existsSync(liveUrlsFile)) {
    console.error(`Live URLs file not found at ${liveUrlsFile}`);
    process.exit(1);
  }

  const liveUrls = JSON.parse(fs.readFileSync(liveUrlsFile, 'utf8'));
  let entries = Object.entries(liveUrls);

  const sampleIdx = process.argv.indexOf('--sample');
  if (sampleIdx !== -1 && process.argv[sampleIdx + 1]) {
    const limit = parseInt(process.argv[sampleIdx + 1], 10);
    if (!isNaN(limit) && limit > 0) {
      entries = entries.slice(0, limit);
      console.log(`Sampling first ${limit} URLs for Live QA...`);
    }
  }

  console.log(`Starting Live QA for ${entries.length} published URLs...`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // Mobile 390px
  });

  const results = [];

  for (const [slug, url] of entries) {
    console.log(`\n[LIVE QA] ${slug} -> ${url}`);
    const page = await context.newPage();
    const consoleErrors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        const txt = msg.text();
        if (!/favicon|google-analytics|doubleclick|googletag/i.test(txt)) {
          consoleErrors.push(txt);
        }
      }
    });
    page.on('pageerror', err => {
      consoleErrors.push(err.message);
    });

    try {
      const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      const status = resp ? resp.status() : 'unknown';
      await page.waitForTimeout(2000);

      // Verify calculations if tool
      let calcOk = true;
      let calcMsg = 'N/A (Page)';
      const expected = EXPECTED_CHECKS[slug];
      if (expected) {
        const bodyText = await page.content();
        const missing = expected.filter(val => !bodyText.includes(val));
        if (missing.length === 0) {
          calcOk = true;
          calcMsg = `Passed (${expected.join(', ')})`;
          console.log(`  [+] Engine verified: ${expected.join(', ')}`);
        } else {
          calcOk = false;
          calcMsg = `FAILED: missing ${missing.join(', ')}`;
          console.error(`  [!] Missing expected values: ${missing.join(', ')}`);
        }
      }

      // Check errors
      const errorsOk = consoleErrors.length === 0;
      if (!errorsOk) {
        console.warn(`  [!] Errors (${consoleErrors.length}):`, consoleErrors);
      } else {
        console.log('  [+] 0 critical console errors');
      }

      // Screenshot
      const shotPath = path.join(liveReportsDir, `${slug}.png`);
      await page.screenshot({ path: shotPath, fullPage: false });
      console.log(`  [+] Screenshot saved to ${shotPath}`);

      const passed = status === 200 && calcOk && errorsOk;
      results.push({
        slug,
        url,
        httpStatus: status,
        calcMsg,
        errors: consoleErrors.length,
        status: passed ? 'PASS' : 'FAIL',
        screenshot: shotPath
      });
    } catch (err) {
      console.error(`  [!] Error visiting ${url}:`, err.message);
      results.push({
        slug,
        url,
        httpStatus: 'ERR',
        calcMsg: err.message,
        errors: 1,
        status: 'FAIL',
        screenshot: ''
      });
    } finally {
      await page.close();
    }
  }

  // Write report
  const reportLines = [
    '# Live QA Report',
    `Date: ${new Date().toISOString()}`,
    `Total: ${results.length} | Passed: ${results.filter(r => r.status === 'PASS').length} | Failed: ${results.filter(r => r.status === 'FAIL').length}`,
    '',
    '| Slug | HTTP | Calculations | Errors | Status | URL |',
    '|---|---|---|---|---|---|',
    ...results.map(r => `| ${r.slug} | ${r.httpStatus} | ${r.calcMsg} | ${r.errors} | ${r.status} | [Link](${r.url}) |`)
  ];

  fs.writeFileSync(reportFile, reportLines.join('\n') + '\n');
  console.log(`\nLive QA Report written to ${reportFile}`);
  await browser.close();
}

main().catch(err => {
  console.error('Fatal error in live-qa:', err);
  process.exit(1);
});
