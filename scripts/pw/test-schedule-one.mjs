// scripts/pw/test-schedule-one.mjs
import { chromium } from 'playwright';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';

async function main() {
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });

  const page = context.pages()[0] || await context.newPage();
  console.log('Opening draft 7946870761115222647...');
  await page.goto('https://www.blogger.com/blog/post/edit/4523693247154244983/7946870761115222647', { timeout: 35000 });
  await page.waitForTimeout(4000);

  // 1. Set title
  const titleInput = page.locator('input[aria-label="Title"]');
  await titleInput.fill('Texas Tipped Minimum Wage and Overtime Calculator: Tip Credit Rules');
  console.log('Title set.');

  // 2. Set CodeMirror content
  await page.evaluate(() => {
    const cm = document.querySelector('.CodeMirror');
    if (cm && cm.CodeMirror) {
      cm.CodeMirror.setValue('<div>Test content for Texas</div>');
    }
  });
  console.log('Content set in CodeMirror.');

  // 3. Set Labels
  const labelsHeader = page.locator('.oX8Xbb:has-text("Labels")').first();
  await labelsHeader.click();
  await page.waitForTimeout(500);
  const labelsTa = page.locator('textarea[aria-label="Separate labels with commas"]').first();
  await labelsTa.fill('Calculator, Texas, Tip Credit, Overtime');
  console.log('Labels set.');

  // 4. Set Permalink
  const permalinkHeader = page.locator('.oX8Xbb:has-text("Permalink")').first();
  await permalinkHeader.click();
  await page.waitForTimeout(500);
  const customPermRadio = page.locator('[role="radio"][aria-label*="Custom permalink"]').first();
  await customPermRadio.click();
  await page.waitForTimeout(500);
  const permInput = page.locator('input[aria-label="Custom permalink input"]').first();
  await permInput.fill('texas-tipped-minimum-wage-and-overtime-calculator');
  console.log('Permalink set.');

  // 5. Set Date & Time (Schedule)
  const pubOnHeader = page.locator('.oX8Xbb:has-text("Published on")').first();
  await pubOnHeader.click();
  await page.waitForTimeout(500);
  const setDateRadio = page.locator('[role="radio"][aria-label="Set date and time"]').first();
  await setDateRadio.click();
  await page.waitForTimeout(500);
  const dateInput = page.locator('input[aria-label="Date"]').first();
  // Format in Blogger: e.g. "03/12/2026" or "3 Dec 2026" - let's see current date input format
  console.log('Current date input value:', await dateInput.inputValue());
  await dateInput.fill('12/03/2026'); // Dec 3, 2026
  await dateInput.dispatchEvent('change');
  const timeInput = page.locator('input[aria-label="Time"]').first();
  console.log('Current time input value:', await timeInput.inputValue());
  await timeInput.fill('09:00');
  await timeInput.dispatchEvent('change');
  console.log('Date and time set.');

  // 6. Set Search Description
  const searchDescHeader = page.locator('.oX8Xbb:has-text("Search description")').first();
  await searchDescHeader.click();
  await page.waitForTimeout(500);
  const searchTa = page.locator('textarea[aria-label="Enter a search description"]').first();
  await searchTa.fill('Calculate Texas tipped minimum wage ($2.13 base, $5.12 tip credit), overtime rates, and dual jobs 80/20 compliance.');
  console.log('Search description set.');

  // 7. Inspect Publish button
  const pubBtn = page.locator('[role="button"][aria-label="Publish"], div[role="button"]:has-text("Publish")').first();
  console.log('Publish button found:', await pubBtn.isVisible());
  console.log('Publish button text:', await pubBtn.innerText());

  // Click Publish
  console.log('Clicking Publish...');
  await pubBtn.click();
  await page.waitForTimeout(2000);

  // Check if confirmation modal appears
  const modalInfo = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    if (!dialog) return null;
    return {
      text: dialog.innerText.slice(0, 300),
      buttons: Array.from(dialog.querySelectorAll('button, [role="button"]')).map(b => b.innerText.trim())
    };
  });
  console.log('Modal info:', modalInfo);

  // If confirm button exists in dialog, click it
  if (modalInfo) {
    const confirmBtn = page.locator('[role="dialog"] button:has-text("Confirm"), [role="dialog"] [role="button"]:has-text("Confirm"), [role="dialog"] button:has-text("Publish"), [role="dialog"] [role="button"]:has-text("Publish")').first();
    if (await confirmBtn.isVisible()) {
      console.log('Clicking Confirm in dialog...');
      await confirmBtn.click();
      await page.waitForTimeout(4000);
    }
  }

  console.log('Current URL after publish:', page.url());
  await page.screenshot({ path: 'reports/live/after-test-publish.png' });

  await context.close();
}

main().catch(console.error);
