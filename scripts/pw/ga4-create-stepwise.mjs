// scripts/pw/ga4-create-stepwise.mjs
import { chromium } from 'playwright';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';

async function main() {
  console.log('Starting GA4 Stepwise Setup...');
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });

  const page = context.pages()[0] || await context.newPage();
  console.log('Navigating to https://analytics.google.com/ ...');
  await page.goto('https://analytics.google.com/', { timeout: 30000, waitUntil: 'commit' });
  await page.waitForTimeout(6000);

  console.log('Current URL:', page.url());
  console.log('Page title:', await page.title());

  // 1. Click Start measuring
  const startBtn = page.getByRole('button', { name: /start measuring/i }).first();
  if (await startBtn.isVisible()) {
    console.log('Clicking Start measuring...');
    await startBtn.click();
    await page.waitForTimeout(4000);
  }

  // 2. Step 1: Account setup
  console.log('Step 1: Setting Account Name...');
  const accountInput = page.locator('input[type="text"]:visible').first();
  if (await accountInput.isVisible()) {
    await accountInput.fill('Shift & Tip');
    console.log('Account name filled.');
  }

  // Click Next
  const next1 = page.getByRole('button', { name: /^next$/i }).first();
  if (await next1.isVisible()) {
    console.log('Clicking Next (Step 1)...');
    await next1.click();
    await page.waitForTimeout(3000);
  }

  // 3. Step 2: Property setup
  console.log('Step 2: Setting Property Name...');
  const propInput = page.locator('input[type="text"]:visible').first();
  if (await propInput.isVisible()) {
    await propInput.fill('shiftandtip.blogspot.com');
    console.log('Property name filled.');
  }

  // Click Next
  const next2 = page.getByRole('button', { name: /^next$/i }).first();
  if (await next2.isVisible()) {
    console.log('Clicking Next (Step 2)...');
    await next2.click();
    await page.waitForTimeout(3000);
  }

  // 4. Step 3: Business details
  console.log('Step 3: Business details...');
  const smallRadio = page.getByText(/small/i).first();
  if (await smallRadio.isVisible()) {
    await smallRadio.click();
  }
  const next3 = page.getByRole('button', { name: /^next$/i }).first();
  if (await next3.isVisible()) {
    console.log('Clicking Next (Step 3)...');
    await next3.click();
    await page.waitForTimeout(3000);
  }

  // 5. Step 4: Business objectives
  console.log('Step 4: Business objectives...');
  const firstCb = page.locator('input[type="checkbox"]:visible, [role="checkbox"]:visible').first();
  if (await firstCb.isVisible()) {
    await firstCb.click();
  }

  // Click Create
  console.log('Clicking Create button...');
  const createBtn = page.getByRole('button', { name: /^create$/i }).first();
  if (await createBtn.isVisible()) {
    await createBtn.click();
    await page.waitForTimeout(5000);
  }

  // 6. Accept Terms modal
  console.log('Checking for Terms modal...');
  const modal = page.locator('[role="dialog"]');
  if (await modal.count() > 0) {
    console.log('Terms modal present. Checking checkboxes...');
    const cbs = page.locator('[role="dialog"] input[type="checkbox"], [role="dialog"] [role="checkbox"]');
    for (let i = 0; i < await cbs.count(); i++) {
      try {
        const cb = cbs.nth(i);
        if (!(await cb.isChecked())) await cb.click();
      } catch (e) {}
    }
    const acceptBtn = page.locator('[role="dialog"]').getByRole('button', { name: /accept/i }).first();
    if (await acceptBtn.isVisible()) {
      console.log('Clicking Accept...');
      await acceptBtn.click();
      await page.waitForTimeout(6000);
    }
  }

  await page.screenshot({ path: 'reports/live/ga4-after-terms.png' });

  // 7. Choose platform: Web
  console.log('Selecting Web platform...');
  const webBtn = page.getByRole('button', { name: /^web$/i }).or(page.getByText(/^web$/i)).first();
  if (await webBtn.isVisible()) {
    await webBtn.click();
    await page.waitForTimeout(3000);
  }

  // Configure stream
  console.log('Filling Stream details...');
  const urlInput = page.locator('input[placeholder*="example.com" i], input[aria-label*="Website URL" i]').first();
  if (await urlInput.isVisible()) {
    await urlInput.fill('shiftandtip.blogspot.com');
  }
  const streamInput = page.locator('input[placeholder*="My web stream" i], input[aria-label*="Stream name" i]').first();
  if (await streamInput.isVisible()) {
    await streamInput.fill('Shift & Tip Web');
  }

  const createStreamBtn = page.getByRole('button', { name: /create stream/i }).first();
  if (await createStreamBtn.isVisible()) {
    console.log('Clicking Create stream...');
    await createStreamBtn.click();
    await page.waitForTimeout(6000);
  }

  await page.screenshot({ path: 'reports/live/ga4-stream-final.png' });

  // Extract Measurement ID
  const measurementId = await page.evaluate(() => {
    const text = document.body.innerText;
    const m = text.match(/G-[A-Z0-9]{8,12}/);
    return m ? m[0] : null;
  });

  console.log('RESULT: Measurement ID =', measurementId);

  await context.close();
}

main().catch(console.error);
