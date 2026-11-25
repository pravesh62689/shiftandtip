// scripts/pw/debug-ga4-current.mjs
import { chromium } from 'playwright';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';

async function main() {
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });

  const page = context.pages()[0] || await context.newPage();
  await page.goto('https://analytics.google.com/', { timeout: 30000, waitUntil: 'commit' });
  await page.waitForTimeout(10000);

  console.log('Current URL:', page.url());
  console.log('Page Title:', await page.title());

  const text = await page.evaluate(() => document.body.innerText.slice(0, 1500).replace(/\n+/g, ' | '));
  console.log('Page Text:', text);

  await page.screenshot({ path: 'reports/live/ga4-debug-state.png' });
  console.log('Saved screenshot to reports/live/ga4-debug-state.png');

  await context.close();
}

main().catch(console.error);
