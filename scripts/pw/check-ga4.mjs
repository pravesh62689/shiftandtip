// scripts/pw/check-ga4.mjs
import { chromium } from 'playwright';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';

async function main() {
  console.log('Opening Google Analytics in persistent profile...');
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });

  const page = context.pages()[0] || await context.newPage();
  await page.goto('https://analytics.google.com/', { timeout: 45000, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(6000);

  console.log('Current URL:', page.url());
  console.log('Page title:', await page.title());

  await page.screenshot({ path: 'reports/live/ga4-initial.png' });
  console.log('Screenshot saved to reports/live/ga4-initial.png');

  // Check buttons / elements
  const info = await page.evaluate(() => {
    return {
      bodyText: document.body.innerText.slice(0, 500).replace(/\n+/g, ' | '),
      buttons: Array.from(document.querySelectorAll('button, [role="button"], a')).map(b => b.innerText.trim()).filter(t => t.length > 0 && t.length < 40).slice(0, 20)
    };
  });
  console.log('GA4 page info:', JSON.stringify(info, null, 2));

  await context.close();
}

main().catch(console.error);
