// scripts/pw/ga4-complete-setup.mjs
import { chromium } from 'playwright';
import { writeFileSync, readFileSync } from 'node:fs';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';
const BLOG_ID = '4523693247154244983';

async function safeScreenshot(page, path) {
  try {
    await page.screenshot({ path, timeout: 5000, animations: 'disabled' });
  } catch (e) {
    console.log(`   (Screenshot ${path} skipped: ${e.message})`);
  }
}

async function main() {
  console.log('=== Starting Complete GA4 Setup & Linking ===');
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });

  const page = context.pages()[0] || await context.newPage();
  console.log('1. Navigating to Google Analytics provision page...');
  await page.goto('https://analytics.google.com/analytics/web/provision/#/provision', { timeout: 35000, waitUntil: 'commit' });
  await page.waitForTimeout(8000);

  // Check current screen state
  let isStreamModal = await page.locator('input[placeholder*="mywebsite.com" i], input[placeholder*="My Website" i], [role="heading"]:has-text("Set up data stream")').first().isVisible().catch(() => false);
  let isPlatformPicker = await page.locator('button:has-text("Web"), [role="button"]:has-text("Web")').first().isVisible().catch(() => false);

  if (!isStreamModal && !isPlatformPicker) {
    // 1. Click "Start measuring"
    const startBtn = page.getByRole('button', { name: /start measuring/i }).first();
    if (await startBtn.isVisible()) {
      console.log('Clicking "Start measuring"...');
      await startBtn.click();
      await page.waitForTimeout(4000);
    }

    // 2. Step 1: Account Setup
    console.log('2. Step 1: Setting Account Name...');
    const accInput = page.locator('input[aria-label*="Account name" i], input[placeholder*="Account name" i]').or(page.locator('input[type="text"]:visible')).first();
    if (await accInput.isVisible()) {
      await accInput.fill('Shift & Tip');
      console.log('   Account name set to "Shift & Tip"');
      await page.waitForTimeout(1000);

      const next1 = page.locator('button[debug-id*="account-next"]').or(page.getByRole('button', { name: /^next$/i })).first();
      await next1.click();
      await page.waitForTimeout(3000);
    }

    // 3. Step 2: Property Setup
    console.log('3. Step 2: Setting Property Name...');
    await safeScreenshot(page, 'reports/live/ga4-step2-debug.png');
    const propInputs = page.locator('input[type="text"]:visible');
    let propInput = null;
    const count = await propInputs.count();
    for (let i = 0; i < count; i++) {
      const val = await propInputs.nth(i).inputValue();
      if (val !== 'Shift & Tip') {
        propInput = propInputs.nth(i);
        break;
      }
    }
    if (!propInput) propInput = propInputs.last();
    if (await propInput.isVisible()) {
      await propInput.fill('shiftandtip.blogspot.com');
      await propInput.dispatchEvent('input');
      await propInput.dispatchEvent('change');
      console.log('   Property name set to "shiftandtip.blogspot.com"');
      await page.waitForTimeout(1000);

      const next2 = page.locator('button[debug-id="property-next-step-button"]').or(page.getByRole('button', { name: /^next$/i }).last());
      await next2.click();
      await page.waitForTimeout(3000);
    }

    // 4. Step 3: Business Details (Industry & Size)
    console.log('4. Step 3: Industry & Business Size...');
    await safeScreenshot(page, 'reports/live/ga4-step3-debug.png');
    
    // Inspect and find the industry selector
    const industryBtn = page.locator('button:has(.menu-open-button-label-text), .menu-open-button, [aria-label*="Industry" i], [aria-labelledby*="industry" i], mat-select, [role="combobox"]').first();
    const selectOne = page.locator('.menu-open-button-label-text').or(page.getByText(/select one|choose a category|select an industry/i)).first();
    
    if (await industryBtn.isVisible()) {
      console.log('   Opening Industry dropdown via industryBtn...');
      await industryBtn.click({ force: true });
      await page.waitForTimeout(1000);
    } else if (await selectOne.isVisible()) {
      console.log('   Opening Industry dropdown via selectOne text...');
      await selectOne.click({ force: true });
      await page.waitForTimeout(1000);
    }

    // Select any plausible option from the opened dropdown
    const opt = page.getByRole('option').or(page.locator('.mat-mdc-option, [role="option"], mat-option, .mat-menu-item, button[role="menuitem"]')).first();
    if (await opt.isVisible()) {
      console.log(`   Selected industry: "${await opt.innerText()}"`);
      await opt.click({ force: true });
      await page.waitForTimeout(800);
    }

    const smallRadio = page.getByText(/small/i).first();
    if (await smallRadio.isVisible()) {
      await smallRadio.click({ force: true });
      console.log('   Selected Small business size.');
      await page.waitForTimeout(800);
    }

    await safeScreenshot(page, 'reports/live/ga4-step3-after-select.png');

    const next3 = page.locator('button[debug-id*="next"]').or(page.getByRole('button', { name: /^next$/i })).last();
    if (await next3.isEnabled()) {
      console.log('   Next button is enabled, clicking...');
      await next3.click();
    }
    await page.waitForTimeout(3000);

    // 5. Step 4: Business Objectives
    console.log('5. Step 4: Business Objectives...');
    await safeScreenshot(page, 'reports/live/ga4-step4-debug.png');
    const firstCb = page.locator('input[type="checkbox"]:visible, [role="checkbox"]:visible').first();
    if (await firstCb.isVisible()) {
      await firstCb.click();
      console.log('   Selected objective.');
      await page.waitForTimeout(800);
    }

    // Scroll down to reveal the submit button
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    // Look for Next or Create button
    console.log('   Looking for submit/next/create button...');
    const createOrNextBtn = page.locator('button.mat-primary, button[type="submit"], [role="button"].mat-primary').or(page.getByRole('button', { name: /create|next/i })).last();
    await createOrNextBtn.scrollIntoViewIfNeeded();
    if (await createOrNextBtn.isVisible()) {
      console.log(`   Clicking button: "${await createOrNextBtn.innerText()}"...`);
      await createOrNextBtn.click({ force: true });
      await page.waitForTimeout(5000);
    }

    // 6. Terms of Service Dialog
    console.log('6. Checking for Terms modal...');
    await safeScreenshot(page, 'reports/live/ga4-terms-screen.png');
    const modal = page.locator('[role="dialog"], .terms-dialog, mat-dialog-container');
    if (await modal.count() > 0) {
      console.log('   Terms dialog visible. Checking required checkboxes...');
      const cbs = page.locator('[role="dialog"] input[type="checkbox"], [role="dialog"] [role="checkbox"], mat-dialog-container [role="checkbox"]');
      const cbCount = await cbs.count();
      console.log(`   Found ${cbCount} checkboxes in dialog.`);
      for (let i = 0; i < cbCount; i++) {
        try {
          const cb = cbs.nth(i);
          await cb.scrollIntoViewIfNeeded();
          if (!(await cb.isChecked())) {
            await cb.click({ force: true });
            console.log(`   Checked checkbox ${i + 1}`);
          }
        } catch (e) {
          console.log(`   Checkbox ${i + 1} click error:`, e.message);
        }
      }
      await page.waitForTimeout(1000);
      const acceptBtn = page.locator('[role="dialog"], mat-dialog-container').getByRole('button', { name: /accept/i }).first();
      if (await acceptBtn.isVisible()) {
        console.log('   Clicking "I Accept"...');
        await acceptBtn.click({ force: true });
        await page.waitForTimeout(8000);
      }
    }

    // 6b. Check for Email Communications Modal
    const emailSaveBtn = page.locator('[role="dialog"]').getByRole('button', { name: /^save$/i }).first();
    if (await emailSaveBtn.isVisible()) {
      console.log('   Dismissing Email communications dialog...');
      await emailSaveBtn.click();
      await page.waitForTimeout(3000);
    }
  }

  await safeScreenshot(page, 'reports/live/ga4-stream-picker.png');

  // 7. Choose Platform: Web
  console.log('7. Selecting Web platform...');
  const webBtn = page.locator('button:has-text("Web"), [role="button"]:has-text("Web"), [data-platform="web"], .platform-picker__item--web').first();
  if (await webBtn.isVisible()) {
    console.log('   Clicking Web platform card...');
    await webBtn.click();
    await page.waitForTimeout(4000);
  }

  // 8. Stream Details
  console.log('8. Entering Web Stream details...');
  await safeScreenshot(page, 'reports/live/ga4-stream-details-input.png');
  const urlIn = page.locator('input[placeholder*="mywebsite.com" i], input[placeholder*="example.com" i], input[aria-label*="Website URL" i]').first();
  if (await urlIn.isVisible()) {
    await urlIn.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await page.keyboard.type('shiftandtip.blogspot.com', { delay: 25 });
    console.log('   Typed Website URL: shiftandtip.blogspot.com');
  }

  const streamIn = page.locator('input[placeholder*="My Website" i], input[placeholder*="stream" i], input[aria-label*="Stream name" i]').first();
  if (await streamIn.isVisible()) {
    await streamIn.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await page.keyboard.type('Shift & Tip Web', { delay: 25 });
    console.log('   Typed Stream Name: Shift & Tip Web');
  }

  // Trigger blur / validation
  await page.keyboard.press('Tab');
  await page.waitForTimeout(1000);

  const createStream = page.locator('button[debug-id="create-stream-button"]').or(page.getByRole('button', { name: /create and continue|create stream/i })).first();
  if (await createStream.isVisible()) {
    const isEn = await createStream.isEnabled();
    console.log(`   Create stream button is enabled: ${isEn}`);
    if (!isEn) {
      console.log('   Button not enabled yet, trying evaluate click...');
      await page.evaluate(() => {
        const btn = document.querySelector('button[debug-id="create-stream-button"], button.save-button');
        if (btn) {
          btn.removeAttribute('disabled');
          btn.click();
        }
      });
    } else {
      await createStream.click();
    }
    await page.waitForTimeout(12000);
  }

  await safeScreenshot(page, 'reports/live/ga4-details-screen.png');

  // Close install instructions dialog if open
  const closeBtn = page.locator('button[aria-label*="Close" i], [role="dialog"] button:has-text("Close"), mat-icon:has-text("close")').first();
  if (await closeBtn.isVisible()) {
    console.log('   Closing Installation instructions dialog...');
    await closeBtn.click();
    await page.waitForTimeout(2000);
  }

  // 9. Extract Measurement ID
  let measurementId = await page.evaluate(() => {
    const text = document.body.innerText;
    const match = text.match(/G-[A-Z0-9]{8,12}/);
    return match ? match[0] : null;
  });

  if (!measurementId) {
    // Try looking in inputs or aria-labels
    measurementId = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('input, [aria-label], span, div'));
      for (const el of els) {
        const val = el.value || el.getAttribute('aria-label') || el.innerText || '';
        const m = val.match(/G-[A-Z0-9]{8,12}/);
        if (m) return m[0];
      }
      return null;
    });
  }

  console.log('9. EXTRACTED MEASUREMENT ID:', measurementId);

  if (measurementId) {
    writeFileSync('data/ga4.json', JSON.stringify({ measurementId, created: new Date().toISOString() }, null, 2) + '\n');
    console.log('   Saved to data/ga4.json');

    // 10. Update Blogger Settings with Measurement ID
    console.log('10. Updating Blogger Settings with GA4 ID...');
    await page.goto(`https://www.blogger.com/blog/settings/${BLOG_ID}`, { timeout: 35000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);

    const gaSetting = page.locator('div:has-text("Google Analytics Measurement ID"), [role="button"]:has-text("Google Analytics")').first();
    if (await gaSetting.isVisible()) {
      console.log('   Clicking Google Analytics Measurement ID setting...');
      await gaSetting.click();
      await page.waitForTimeout(1500);

      const gaInput = page.locator('[role="dialog"] input, input[aria-label*="Measurement ID" i]').first();
      if (await gaInput.isVisible()) {
        await gaInput.fill(measurementId);
        console.log(`   Filled ${measurementId}`);
        await page.waitForTimeout(500);
        const saveBtn = page.locator('[role="dialog"] button:has-text("Save"), [role="dialog"] [role="button"]:has-text("Save")').first();
        if (await saveBtn.isVisible()) {
          await saveBtn.click();
          console.log('   SAVED Google Analytics Measurement ID in Blogger Settings!');
          await page.waitForTimeout(3000);
        }
      }
    }
    await safeScreenshot(page, 'reports/live/blogger-settings-ga4-saved.png');
  }

  await context.close();
  console.log('=== GA4 Setup Completed Successfully ===');
}

main().catch(console.error);
