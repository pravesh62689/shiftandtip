// scripts/pw/ga4-setup.mjs
import { chromium } from 'playwright';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';

async function main() {
  console.log('Launching Playwright Chrome for GA4 setup...');
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });

  const page = context.pages()[0] || await context.newPage();
  await page.goto('https://analytics.google.com/analytics/web/provision/#/provision', { timeout: 45000, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);

  // 1. Click "Start measuring"
  const startBtn = page.locator('button:has-text("Start measuring"), [role="button"]:has-text("Start measuring")').first();
  if (await startBtn.isVisible()) {
    console.log('Clicking "Start measuring"...');
    await startBtn.click();
    await page.waitForTimeout(4000);
  }

  // 2. Step 1: Account creation
  console.log('Filling Account Name...');
  const accountInput = page.locator('input[aria-label*="Account name" i], input[placeholder*="Account name" i], input[formcontrolname="accountName"]').first();
  if (await accountInput.isVisible()) {
    await accountInput.fill('Shift & Tip');
    console.log('Account name set to "Shift & Tip"');
  } else {
    // try any visible text input in the first step
    const firstInput = page.locator('input[type="text"]:visible').first();
    if (await firstInput.isVisible()) {
      await firstInput.fill('Shift & Tip');
      console.log('Filled first visible text input with "Shift & Tip"');
    }
  }

  // Click Next
  const nextBtn1 = page.locator('button:has-text("Next"), [role="button"]:has-text("Next")').first();
  if (await nextBtn1.isVisible()) {
    console.log('Clicking Next (Step 1)...');
    await nextBtn1.click();
    await page.waitForTimeout(4000);
  }

  // 3. Step 2: Property creation
  console.log('Filling Property Name...');
  const propertyInput = page.locator('input[aria-label*="Property name" i], input[placeholder*="Property name" i], input[formcontrolname="propertyName"]').first();
  if (await propertyInput.isVisible()) {
    await propertyInput.fill('shiftandtip.blogspot.com');
    console.log('Property name set to "shiftandtip.blogspot.com"');
  } else {
    const firstInput2 = page.locator('input[type="text"]:visible').first();
    if (await firstInput2.isVisible()) {
      await firstInput2.fill('shiftandtip.blogspot.com');
      console.log('Filled first visible text input with "shiftandtip.blogspot.com"');
    }
  }

  // Select Time Zone: America/New_York
  console.log('Selecting Time Zone...');
  try {
    const tzDropdown = page.locator('[aria-label*="Reporting time zone" i], [aria-label*="time zone" i]').first();
    if (await tzDropdown.isVisible()) {
      await tzDropdown.click();
      await page.waitForTimeout(1000);
      const usOpt = page.locator('[role="option"]:has-text("United States"), text="United States"').first();
      if (await usOpt.isVisible()) await usOpt.click();
      await page.waitForTimeout(1000);
    }
  } catch (e) {
    console.log('Tz selection note:', e.message);
  }

  // Click Next
  const nextBtn2 = page.locator('button:has-text("Next"), [role="button"]:has-text("Next")').first();
  if (await nextBtn2.isVisible()) {
    console.log('Clicking Next (Step 2)...');
    await nextBtn2.click();
    await page.waitForTimeout(4000);
  }

  // 4. Step 3: Business Details
  console.log('Handling Business details step...');
  try {
    // Select small business
    const smallRadio = page.locator('label:has-text("Small"), [role="radio"]:has-text("Small"), text="Small"').first();
    if (await smallRadio.isVisible()) await smallRadio.click();
  } catch (e) {}

  const nextBtn3 = page.locator('button:has-text("Next"), [role="button"]:has-text("Next")').first();
  if (await nextBtn3.isVisible()) {
    console.log('Clicking Next (Step 3)...');
    await nextBtn3.click();
    await page.waitForTimeout(4000);
  }

  // 5. Step 4: Business Objectives
  console.log('Handling Business objectives step...');
  try {
    const objOption = page.locator('label:has-text("Examine user behavior"), [role="checkbox"]:has-text("Examine user behavior"), text="Examine user behavior"').first();
    if (await objOption.isVisible()) await objOption.click();
    else {
      const firstObj = page.locator('input[type="checkbox"]:visible, [role="checkbox"]:visible').first();
      if (await firstObj.isVisible()) await firstObj.click();
    }
  } catch (e) {}

  const createBtn = page.locator('button:has-text("Create"), [role="button"]:has-text("Create")').first();
  if (await createBtn.isVisible()) {
    console.log('Clicking Create...');
    await createBtn.click();
    await page.waitForTimeout(5000);
  }

  // 6. Terms of Service Modal
  console.log('Checking for Terms of Service modal...');
  const tosModal = page.locator('[role="dialog"], .modal, .cdk-overlay-pane');
  if (await tosModal.count() > 0) {
    console.log('TOS modal found. Checking accept boxes...');
    const checkboxes = page.locator('[role="dialog"] input[type="checkbox"], [role="dialog"] [role="checkbox"]');
    for (let i = 0; i < await checkboxes.count(); i++) {
      try {
        const cb = checkboxes.nth(i);
        if (!(await cb.isChecked())) await cb.click();
      } catch (e) {}
    }
    const acceptBtn = page.locator('[role="dialog"] button:has-text("I Accept"), [role="dialog"] [role="button"]:has-text("I Accept"), button:has-text("I Accept")').first();
    if (await acceptBtn.isVisible()) {
      console.log('Clicking "I Accept"...');
      await acceptBtn.click();
      await page.waitForTimeout(6000);
    }
  }

  await page.screenshot({ path: 'reports/live/ga4-after-create.png' });
  console.log('Screenshot saved to reports/live/ga4-after-create.png');

  // 7. Choose a platform -> Web
  console.log('Looking for Web platform selection...');
  const webPlatform = page.locator('button:has-text("Web"), [role="button"]:has-text("Web"), div:has-text("Web")').filter({ hasText: /^Web$/ }).first();
  if (await webPlatform.isVisible()) {
    console.log('Clicking "Web" platform...');
    await webPlatform.click();
    await page.waitForTimeout(4000);
  }

  // Fill Website URL and Stream Name
  console.log('Configuring Web Data Stream...');
  const urlInput = page.locator('input[placeholder*="example.com" i], input[aria-label*="Website URL" i]').first();
  if (await urlInput.isVisible()) {
    await urlInput.fill('shiftandtip.blogspot.com');
    console.log('Website URL set to shiftandtip.blogspot.com');
  }

  const streamInput = page.locator('input[aria-label*="Stream name" i], input[placeholder*="My web stream" i]').first();
  if (await streamInput.isVisible()) {
    await streamInput.fill('Shift & Tip Web');
    console.log('Stream name set to Shift & Tip Web');
  }

  const createStreamBtn = page.locator('button:has-text("Create stream"), [role="button"]:has-text("Create stream")').first();
  if (await createStreamBtn.isVisible()) {
    console.log('Clicking "Create stream"...');
    await createStreamBtn.click();
    await page.waitForTimeout(6000);
  }

  await page.screenshot({ path: 'reports/live/ga4-stream-created.png' });
  console.log('Screenshot saved to reports/live/ga4-stream-created.png');

  // Extract Measurement ID (G-XXXXXXXXXX)
  const measurementId = await page.evaluate(() => {
    const bodyText = document.body.innerText;
    const match = bodyText.match(/G-[A-Z0-9]{8,12}/);
    return match ? match[0] : null;
  });

  console.log('Measurement ID detected:', measurementId);

  await context.close();
  return measurementId;
}

main().catch(console.error);
