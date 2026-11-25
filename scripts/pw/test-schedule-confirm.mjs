// scripts/pw/test-schedule-confirm.mjs
import { chromium } from 'playwright';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';

async function main() {
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });

  const page = context.pages()[0] || await context.newPage();
  console.log('Opening Texas draft...');
  await page.goto('https://www.blogger.com/blog/post/edit/4523693247154244983/7946870761115222647', { timeout: 35000 });
  await page.waitForTimeout(4000);

  // Expand Published on
  const pubOnHeader = page.locator('.oX8Xbb:has-text("Published on")').first();
  const setDateRadio = page.locator('[role="radio"][aria-label="Set date and time"]').first();
  if (!(await setDateRadio.isVisible())) {
    await pubOnHeader.click();
    await page.waitForTimeout(600);
  }
  await setDateRadio.click();
  await page.waitForTimeout(600);

  const dateInput = page.locator('input[aria-label="Date"]').first();
  console.log('Date input current val:', await dateInput.inputValue());
  
  // Test filling formatted date
  await dateInput.click();
  await dateInput.selectText();
  await dateInput.fill('3 Dec 2026');
  await page.keyboard.press('Tab');
  await page.waitForTimeout(1000);

  console.log('Date input val after Tab:', await dateInput.inputValue());

  // Click Publish
  const pubBtn = page.locator('[role="button"][aria-label="Publish"]').first();
  console.log('Clicking Publish button...');
  await pubBtn.click();
  await page.waitForTimeout(2000);

  const dialogText = await page.locator('.g3VIld, [role="dialog"]').innerText();
  console.log('Dialog Text:', dialogText);

  // Click CONFIRM
  const confirmBtn = page.locator('.g3VIld span:has-text("CONFIRM"), .g3VIld [role="button"]:has-text("CONFIRM")').first();
  if (await confirmBtn.isVisible()) {
    console.log('Clicking CONFIRM in dialog...');
    await confirmBtn.click();
    await page.waitForTimeout(4000);
  }

  console.log('Current URL after confirming:', page.url());
  await context.close();
}

main().catch(console.error);
