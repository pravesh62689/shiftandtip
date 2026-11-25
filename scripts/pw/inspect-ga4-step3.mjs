// scripts/pw/inspect-ga4-step3.mjs
import { chromium } from 'playwright';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';

async function main() {
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });

  const page = context.pages()[0] || await context.newPage();
  await page.goto('https://analytics.google.com/analytics/web/provision/#/provision', { timeout: 45000, waitUntil: 'commit' });
  await page.waitForSelector('button:has-text("Start measuring"), input[type="text"]:visible', { timeout: 45000 });
  await page.waitForTimeout(3000);

  // 1. Click Start measuring
  const startBtn = page.getByRole('button', { name: /start measuring/i }).first();
  if (await startBtn.isVisible()) {
    await startBtn.click();
    await page.waitForTimeout(3000);
  }

  // 2. Step 1: Account setup
  const accountInput = page.locator('input[type="text"]:visible').first();
  await accountInput.fill('Shift & Tip');
  await page.getByRole('button', { name: /^next$/i }).first().click();
  await page.waitForTimeout(3000);

  // 3. Step 2: Property setup
  const propInput = page.locator('input[type="text"]:visible').first();
  await propInput.fill('shiftandtip.blogspot.com');
  await page.getByRole('button', { name: /^next$/i }).first().click();
  await page.waitForTimeout(4000);

  // Inspect Step 3
  const step3Info = await page.evaluate(() => {
    const text = document.body.innerText.slice(0, 1000).replace(/\n+/g, ' | ');
    const selects = Array.from(document.querySelectorAll('mat-select, select, [role="combobox"], [role="listbox"]')).map(s => ({
      tag: s.tagName,
      role: s.getAttribute('role'),
      ariaLabel: s.getAttribute('aria-label'),
      className: s.className,
      text: s.innerText
    }));
    const radios = Array.from(document.querySelectorAll('[role="radio"], input[type="radio"], mat-radio-button')).map(r => ({
      text: r.innerText,
      ariaLabel: r.getAttribute('aria-label')
    }));
    return { text, selects, radios };
  });

  console.log('Step 3 Info:', JSON.stringify(step3Info, null, 2));
  await page.screenshot({ path: 'reports/live/ga4-step3-details.png' });

  await context.close();
}

main().catch(console.error);
