// scripts/pw/test-schedule-robust.mjs
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

  // Close any notices if present
  const noticeClose = page.locator('[aria-label="Close"], [aria-label="Dismiss"], button:has-text("Dismiss")');
  if (await noticeClose.count() > 0) {
    try { await noticeClose.first().click(); } catch(e) {}
  }

  // 1. Title
  const titleInput = page.locator('input[aria-label="Title"]');
  await titleInput.fill('Texas Tipped Minimum Wage and Overtime Calculator: Tip Credit Rules');
  console.log('Title filled.');

  // 2. CodeMirror Content
  await page.evaluate(() => {
    const cm = document.querySelector('.CodeMirror');
    if (cm && cm.CodeMirror) {
      cm.CodeMirror.setValue('<div>Test HTML content for Texas calculator</div>');
    }
  });
  console.log('Content filled.');

  // Helper to expand accordion if closed
  async function expandSection(headerText, checkLocator) {
    if (!(await checkLocator.isVisible())) {
      const header = page.locator(`.oX8Xbb:has-text("${headerText}")`).first();
      await header.click();
      await page.waitForTimeout(600);
    }
  }

  // 3. Labels
  const labelsTa = page.locator('textarea[aria-label="Separate labels with commas"]').first();
  await expandSection('Labels', labelsTa);
  if (await labelsTa.isVisible()) {
    await labelsTa.fill('Calculator, Texas, Tip Credit, Overtime');
    console.log('Labels filled.');
  }

  // 4. Permalink
  const customPermRadio = page.locator('[role="radio"][aria-label*="Custom permalink"]').first();
  await expandSection('Permalink', customPermRadio);
  if (await customPermRadio.isVisible()) {
    await customPermRadio.click();
    await page.waitForTimeout(600);
    const permInput = page.locator('input[aria-label="Custom permalink input"]').first();
    if (await permInput.isVisible()) {
      await permInput.fill('texas-tipped-minimum-wage-and-overtime-calculator');
      console.log('Permalink filled.');
    }
  }

  // 5. Date & Time
  const setDateRadio = page.locator('[role="radio"][aria-label="Set date and time"]').first();
  await expandSection('Published on', setDateRadio);
  if (await setDateRadio.isVisible()) {
    await setDateRadio.click();
    await page.waitForTimeout(600);
    const dateInput = page.locator('input[aria-label="Date"]').first();
    const timeInput = page.locator('input[aria-label="Time"]').first();
    console.log('Initial Date/Time inputs:', await dateInput.inputValue(), await timeInput.inputValue());
    
    // In Blogger, date input might be DD/MM/YYYY or YYYY-MM-DD or MM/DD/YYYY depending on locale.
    // Let's select and fill or type
    await dateInput.click();
    await dateInput.selectText();
    await dateInput.fill('03/12/2026'); // Dec 3, 2026
    await dateInput.dispatchEvent('change');

    await timeInput.click();
    await timeInput.selectText();
    await timeInput.fill('09:00');
    await timeInput.dispatchEvent('change');
    console.log('Date/Time filled:', await dateInput.inputValue(), await timeInput.inputValue());
  }

  // 6. Search description
  const searchTa = page.locator('textarea[aria-label="Enter a search description"]').first();
  await expandSection('Search description', searchTa);
  if (await searchTa.isVisible()) {
    await searchTa.fill('Calculate Texas tipped minimum wage ($2.13 base, $5.12 tip credit), overtime rates, and dual jobs 80/20 compliance.');
    console.log('Search description filled.');
  }

  // 7. Click Publish / Schedule button
  const pubBtn = page.locator('[role="button"][aria-label="Publish"], div[role="button"]:has-text("Publish")').first();
  console.log('Clicking Publish/Schedule button...');
  await pubBtn.click();
  await page.waitForTimeout(2000);

  // Check for confirmation dialog
  const confirmBtn = page.locator('[role="dialog"] button:has-text("Confirm"), [role="dialog"] [role="button"]:has-text("Confirm"), [role="dialog"] button:has-text("Publish"), [role="dialog"] [role="button"]:has-text("Publish")').first();
  if (await confirmBtn.isVisible()) {
    console.log('Confirm dialog visible! Clicking Confirm...');
    await confirmBtn.click();
    await page.waitForTimeout(4000);
  } else {
    console.log('No confirmation dialog detected, checking page URL...');
  }

  console.log('URL after action:', page.url());
  await page.screenshot({ path: 'reports/live/test-texas-scheduled.png' });

  await context.close();
  console.log('Test completed successfully.');
}

main().catch(console.error);
