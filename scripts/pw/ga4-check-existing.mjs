// scripts/pw/ga4-check-existing.mjs
import { chromium } from 'playwright';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';

async function main() {
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });

  const page = context.pages()[0] || await context.newPage();
  console.log('Navigating to https://analytics.google.com/analytics/web/ ...');
  await page.goto('https://analytics.google.com/analytics/web/', { timeout: 35000, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(8000);

  console.log('Current URL:', page.url());
  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 1000));
  console.log('Body preview:\n', bodyText);

  // Check if G- measurement ID is anywhere on the page
  const measurementMatch = await page.evaluate(() => {
    const text = document.body.innerText;
    const m = text.match(/G-[A-Z0-9]{8,12}/);
    return m ? m[0] : null;
  });
  console.log('Measurement ID match on page:', measurementMatch);

  await page.screenshot({ path: 'reports/live/ga4-existing-check.png', timeout: 5000 }).catch(() => {});
  await context.close();
}

main().catch(console.error);
