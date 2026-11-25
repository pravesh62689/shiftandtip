// scripts/pw/inspect-ga4-current.mjs
import { chromium } from 'playwright';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';

async function main() {
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });

  const page = context.pages()[0] || await context.newPage();
  console.log('Navigating to analytics.google.com with commit wait...');
  await page.goto('https://analytics.google.com/', { timeout: 30000, waitUntil: 'commit' });
  await page.waitForTimeout(6000);

  console.log('Current URL:', page.url());
  console.log('Page title:', await page.title());

  const info = await page.evaluate(() => {
    const text = document.body.innerText.slice(0, 1000).replace(/\n+/g, ' | ');
    const buttons = Array.from(document.querySelectorAll('button, [role="button"], a')).map(b => b.innerText.trim()).filter(t => t.length > 0 && t.length < 50);
    const inputs = Array.from(document.querySelectorAll('input')).map(i => ({
      val: i.value,
      placeholder: i.placeholder,
      ariaLabel: i.getAttribute('aria-label')
    }));
    return { text, buttons: buttons.slice(0, 30), inputs };
  });

  console.log('GA4 Info:', JSON.stringify(info, null, 2));
  await page.screenshot({ path: 'reports/live/ga4-current-state.png' });
  console.log('Saved screenshot to reports/live/ga4-current-state.png');

  await context.close();
}

main().catch(console.error);
