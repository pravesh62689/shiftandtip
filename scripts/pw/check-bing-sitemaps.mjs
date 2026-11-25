import { chromium } from 'playwright';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';

async function main() {
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });
  const page = context.pages()[0] || await context.newPage();
  await page.goto('https://www.bing.com/webmasters/sitemaps?siteUrl=https%3A%2F%2Fshiftandtip.blogspot.com%2F', { waitUntil: 'commit' });
  await page.waitForTimeout(6000);

  console.log('Final URL:', page.url());
  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 1500));
  console.log('Page body snippet:\n', bodyText);

  // Check if sitemaps or submit sitemap button exists
  const rows = await page.locator('[role="row"], tr, .ms-DetailsRow').evaluateAll(els => els.map(e => e.innerText.trim()).filter(Boolean));
  console.log('Table rows found:', rows);

  await context.close();
}

main().catch(console.error);
