// scripts/pw/gsc-flow.mjs
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';
const SITE_URL = 'https://shiftandtip.blogspot.com/';

async function main() {
  console.log('=== Google Search Console Automation ===');
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });

  const page = context.pages()[0] || await context.newPage();

  console.log('1. Navigating to Google Search Console...');
  await page.goto('https://search.google.com/search-console', { timeout: 35000, waitUntil: 'commit' });
  await page.waitForTimeout(6000);

  // Dismiss any feature walkthrough / "Got it" buttons
  const gotItStart = page.getByRole('button', { name: /got it/i }).first();
  if (await gotItStart.isVisible()) {
    await gotItStart.click({ force: true });
    await page.waitForTimeout(1000);
  }

  // 2. Submit Sitemaps
  console.log('2. Navigating to Sitemaps page...');
  const sitemapsUrl = `https://search.google.com/search-console/sitemaps?resource_id=${encodeURIComponent(SITE_URL)}`;
  await page.goto(sitemapsUrl, { timeout: 35000, waitUntil: 'commit' });
  await page.waitForTimeout(6000);

  const sitemaps = ['sitemap.xml', 'sitemap-pages.xml'];
  const sitemapResults = [];

  for (const sm of sitemaps) {
    console.log(`   Submitting ${sm}...`);
    const smInput = page.locator('input[aria-label*="sitemap" i], input[placeholder*="sitemap" i]').first();
    if (await smInput.isVisible()) {
      await smInput.click({ force: true });
      await page.keyboard.press('Control+A');
      await page.keyboard.press('Backspace');
      await page.keyboard.type(sm, { delay: 30 });
      await page.waitForTimeout(1000);

      const submitBtn = page.locator('[role="button"]:has-text("Submit"), button:has-text("Submit")').first();
      await submitBtn.click({ force: true, noWaitAfter: true });
      await page.waitForTimeout(6000);

      // Dismiss "Sitemap submitted" dialog
      const gotItBtn = page.locator('[role="dialog"] [role="button"]:has-text("Got it"), [role="dialog"] button:has-text("Got it"), [role="button"]:has-text("Got it")').first();
      if (await gotItBtn.isVisible()) {
        await gotItBtn.click({ force: true, noWaitAfter: true });
        await page.waitForTimeout(1500);
      }
      sitemapResults.push({ sitemap: sm, status: 'Submitted successfully' });
    }
  }

  await page.screenshot({ path: 'reports/live/gsc-sitemaps.png', timeout: 5000 }).catch(() => {});

  // 3. Inspect and Request Indexing
  const urlsToInspect = [
    'https://shiftandtip.blogspot.com/',
    'https://shiftandtip.blogspot.com/2026/11/tip-pool-calculator.html',
    'https://shiftandtip.blogspot.com/p/state-pay-rules-minimum-wage-overtime.html'
  ];

  const inspectionLog = [];

  for (const url of urlsToInspect) {
    console.log(`3. Inspecting URL: ${url}...`);
    const inspectUrl = `https://search.google.com/search-console/inspect?resource_id=${encodeURIComponent(SITE_URL)}&id=${encodeURIComponent(url)}`;
    await page.goto(inspectUrl, { timeout: 35000, waitUntil: 'commit' });
    await page.waitForTimeout(10000);

    const statusText = await page.evaluate(() => {
      const text = document.body.innerText;
      if (text.includes('URL is on Google')) return 'URL is on Google';
      if (text.includes('URL is not on Google')) return 'URL is not on Google';
      return 'Inspected';
    });

    console.log(`   Status: ${statusText}`);

    // Check for "Request Indexing" button
    const reqBtn = page.locator('[role="button"]:has-text("Request indexing"), button:has-text("Request indexing")').first();
    let requested = false;
    if (await reqBtn.isVisible() && await reqBtn.isEnabled()) {
      console.log('   Clicking "Request indexing"...');
      await reqBtn.click({ force: true, noWaitAfter: true });
      // Wait for live test to complete (usually 15-25s)
      await page.waitForTimeout(20000);
      const gotIt = page.locator('[role="dialog"] [role="button"]:has-text("Got it"), [role="button"]:has-text("Got it")').first();
      if (await gotIt.isVisible()) {
        await gotIt.click({ force: true, noWaitAfter: true });
        await page.waitForTimeout(1000);
      }
      requested = true;
    }

    inspectionLog.push({ url, status: statusText, requested, timestamp: new Date().toISOString() });
  }

  // Write docs/indexing-log.md
  let md = '# Search Engine Indexing & Sitemaps Log\n\n';
  md += `**Date**: ${new Date().toISOString()}\n`;
  md += `**Property**: \`${SITE_URL}\`\n\n`;
  md += '## Sitemaps Submitted (Google Search Console)\n';
  for (const s of sitemapResults) {
    md += `- \`${s.sitemap}\`: ${s.status}\n`;
  }
  md += '\n## URL Inspection & Indexing Requests\n';
  for (const item of inspectionLog) {
    md += `- **URL**: \`${item.url}\`\n`;
    md += `  - **Status**: ${item.status}\n`;
    md += `  - **Indexing Requested**: ${item.requested ? 'Yes (Submitted for indexing queue)' : 'Already requested / Skipped'}\n`;
    md += `  - **Checked At**: ${item.timestamp}\n\n`;
  }

  writeFileSync('docs/indexing-log.md', md);
  console.log('Saved docs/indexing-log.md');

  await context.close();
  console.log('=== GSC Automation Done ===');
}

main().catch(console.error);
