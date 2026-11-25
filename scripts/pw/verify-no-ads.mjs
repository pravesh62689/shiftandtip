import { chromium } from 'playwright';
import fs from 'node:fs';

const liveUrls = JSON.parse(fs.readFileSync('data/live-urls.json', 'utf8'));
const urls = [
  { name: 'homepage', url: 'https://shiftandtip.blogspot.com' },
  ...Object.entries(liveUrls).map(([name, url]) => ({ name, url }))
];

async function main() {
  console.log(`Checking ${urls.length} live pages for adsbygoogle and .ad elements...`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = [];
  let hasFailures = false;

  for (const item of urls) {
    let adsbygoogleCount = 0;
    let adElementsCount = 0;
    let status = 200;

    try {
      const resp = await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      status = resp ? resp.status() : 0;
      await page.waitForTimeout(1000);

      const html = await page.content();
      const matches = html.match(/adsbygoogle/gi);
      adsbygoogleCount = matches ? matches.length : 0;

      adElementsCount = await page.evaluate(() => {
        return document.querySelectorAll('.ad').length;
      });

      const pass = adsbygoogleCount === 0 && adElementsCount === 0;
      if (!pass) hasFailures = true;

      results.push({
        name: item.name,
        url: item.url,
        status,
        adsbygoogleCount,
        adElementsCount,
        pass
      });
      console.log(`[${pass ? 'PASS' : 'FAIL'}] ${item.name}: adsbygoogle=${adsbygoogleCount}, .ad=${adElementsCount}`);
    } catch (err) {
      console.error(`[ERROR] ${item.name}: ${err.message}`);
      results.push({
        name: item.name,
        url: item.url,
        status: 'error',
        adsbygoogleCount: -1,
        adElementsCount: -1,
        pass: false,
        error: err.message
      });
      hasFailures = true;
    }
  }

  await browser.close();

  fs.mkdirSync('reports', { recursive: true });
  let report = `# AdSense-Readiness Zero-Ad Verification Report\n\n`;
  report += `Generated: ${new Date().toISOString()}\n`;
  report += `Total pages checked: ${results.length}\n`;
  report += `Overall Status: ${hasFailures ? 'FAILED' : 'PASSED'}\n\n`;
  report += `| Page | URL | HTTP Status | 'adsbygoogle' count | '.ad' elements | Pass |\n`;
  report += `|---|---|---|---|---|---|\n`;
  for (const r of results) {
    report += `| ${r.name} | [${r.url}](${r.url}) | ${r.status} | ${r.adsbygoogleCount} | ${r.adElementsCount} | ${r.pass ? '✅' : '❌'} |\n`;
  }

  fs.writeFileSync('reports/no-ads-check.md', report);
  console.log(`\nReport written to reports/no-ads-check.md`);

  if (hasFailures) {
    console.error('FAILED: One or more pages have ad markup!');
    process.exit(1);
  } else {
    console.log('SUCCESS: All live pages have 0 adsbygoogle strings and 0 .ad elements.');
  }
}

main().catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});
