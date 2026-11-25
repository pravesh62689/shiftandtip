// scripts/pw/gsc-submit-pages-sitemap.mjs
import { chromium } from 'playwright';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';
const SITE_URL = 'https://shiftandtip.blogspot.com/';

async function main() {
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });

  const page = context.pages()[0] || await context.newPage();
  const sitemapsUrl = `https://search.google.com/search-console/sitemaps?resource_id=${encodeURIComponent(SITE_URL)}`;
  await page.goto(sitemapsUrl, { timeout: 35000, waitUntil: 'commit' });
  await page.waitForTimeout(6000);

  // Press Escape to dismiss any feedback drawer or tooltips
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);

  console.log('Submitting sitemap-pages.xml...');
  const smInput = page.locator('input[aria-label*="sitemap" i], input[placeholder*="sitemap" i]').first();
  if (await smInput.isVisible()) {
    await smInput.click({ force: true });
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await page.keyboard.type('sitemap-pages.xml', { delay: 30 });
    await page.waitForTimeout(1000);

    const submitBtn = page.locator('[role="button"]:has-text("Submit"), button:has-text("Submit")').first();
    await submitBtn.click({ force: true, noWaitAfter: true });
    await page.waitForTimeout(6000);

    const gotItBtn = page.locator('[role="dialog"] [role="button"]:has-text("Got it"), [role="button"]:has-text("Got it")').first();
    if (await gotItBtn.isVisible()) {
      await gotItBtn.click({ force: true, noWaitAfter: true });
      await page.waitForTimeout(2000);
    }
  }

  await page.screenshot({ path: 'reports/live/gsc-sitemaps-both.png', timeout: 5000 }).catch(() => {});
  await context.close();
  console.log('Done!');
}

main().catch(console.error);
