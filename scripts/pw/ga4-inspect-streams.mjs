// scripts/pw/ga4-inspect-streams.mjs
import { chromium } from 'playwright';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';
const PROP_PATH = 'a417389583p565821616';

async function main() {
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });

  const page = context.pages()[0] || await context.newPage();
  console.log('Navigating to Streams page...');
  await page.goto(`https://analytics.google.com/analytics/web/#/${PROP_PATH}/admin/streams/table`, { timeout: 40000, waitUntil: 'commit' });
  
  console.log('Waiting for "Loading..." to disappear...');
  await page.waitForFunction(() => {
    return document.body && document.body.innerText && !document.body.innerText.trim().startsWith('Loading...') && document.body.innerText.trim().length > 20;
  }, { timeout: 45000 }).catch(e => console.log('Wait error:', e.message));

  await page.waitForTimeout(4000);
  console.log('Current URL:', page.url());
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('Page text snippet:\n', bodyText.slice(0, 1000));

  const mMatch = bodyText.match(/G-[A-Z0-9]{8,12}/g);
  console.log('G- matches found:', mMatch);

  await page.screenshot({ path: 'reports/live/ga4-streams-inspection.png', timeout: 5000 }).catch(() => {});
  await context.close();
}

main().catch(console.error);
