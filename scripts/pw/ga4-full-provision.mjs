// scripts/pw/ga4-full-provision.mjs
import { chromium } from 'playwright';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';
const BLOG_ID = '4523693247154244983';

async function main() {
  console.log('Starting full GA4 provisioning flow...');
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });

  const page = context.pages()[0] || await context.newPage();
  console.log('Navigating to Google Analytics provision page...');
  await page.goto('https://analytics.google.com/analytics/web/provision/#/provision', { timeout: 45000, waitUntil: 'commit' });

  // Wait for loading to finish and UI to appear
  console.log('Waiting for Analytics UI to hydrate...');
  await page.waitForSelector('button:has-text("Start measuring"), input[type="text"]:visible, [role="button"]', { timeout: 45000 });
  await page.waitForTimeout(4000);

  console.log('Current URL:', page.url());

  // 1. Click "Start measuring" if present
  const startBtn = page.getByRole('button', { name: /start measuring/i }).first();
  if (await startBtn.isVisible()) {
    console.log('Clicking "Start measuring"...');
    await startBtn.click();
    await page.waitForTimeout(4000);
  }

  // 2. Step 1: Account setup
  console.log('Step 1: Account creation...');
  const accountInput = page.locator('input[type="text"]:visible').first();
  await accountInput.waitFor({ state: 'visible', timeout: 15000 });
  await accountInput.fill('Shift & Tip');
  console.log('Account name set.');
  await page.waitForTimeout(1000);

  const next1 = page.getByRole('button', { name: /^next$/i }).first();
  await next1.click();
  await page.waitForTimeout(4000);

  // 3. Step 2: Property setup
  console.log('Step 2: Property setup...');
  const propInput = page.locator('input[type="text"]:visible').first();
  await propInput.waitFor({ state: 'visible', timeout: 15000 });
  await propInput.fill('shiftandtip.blogspot.com');
  console.log('Property name set.');
  await page.waitForTimeout(1000);

  const next2 = page.getByRole('button', { name: /^next$/i }).first();
  await next2.click();
  await page.waitForTimeout(4000);

  // 4. Step 3: Business details
  console.log('Step 3: Business details...');
  const smallText = page.getByText(/small/i).first();
  if (await smallText.isVisible()) {
    await smallText.click();
    await page.waitForTimeout(500);
  }
  const next3 = page.getByRole('button', { name: /^next$/i }).first();
  if (await next3.isVisible()) {
    await next3.click();
    await page.waitForTimeout(4000);
  }

  // 5. Step 4: Business objectives
  console.log('Step 4: Business objectives...');
  const firstCb = page.locator('input[type="checkbox"]:visible, [role="checkbox"]:visible').first();
  if (await firstCb.isVisible()) {
    await firstCb.click();
    await page.waitForTimeout(500);
  }

  const createBtn = page.getByRole('button', { name: /^create$/i }).first();
  if (await createBtn.isVisible()) {
    console.log('Clicking Create...');
    await createBtn.click();
    await page.waitForTimeout(5000);
  }

  // 6. Terms Modal
  console.log('Checking for Terms modal...');
  const modal = page.locator('[role="dialog"]');
  if (await modal.count() > 0) {
    console.log('Modal visible, accepting terms...');
    const cbs = page.locator('[role="dialog"] input[type="checkbox"], [role="dialog"] [role="checkbox"]');
    for (let i = 0; i < await cbs.count(); i++) {
      try {
        const cb = cbs.nth(i);
        if (!(await cb.isChecked())) await cb.click();
      } catch (e) {}
    }
    const acceptBtn = page.locator('[role="dialog"]').getByRole('button', { name: /accept/i }).first();
    if (await acceptBtn.isVisible()) {
      await acceptBtn.click();
      await page.waitForTimeout(8000);
    }
  }

  await page.screenshot({ path: 'reports/live/ga4-stream-choice.png' });

  // 7. Platform choice: Web
  console.log('Looking for Web platform button...');
  const webBtn = page.getByRole('button', { name: /^web$/i }).or(page.getByText(/^web$/i)).first();
  if (await webBtn.isVisible()) {
    console.log('Clicking Web button...');
    await webBtn.click();
    await page.waitForTimeout(4000);
  }

  // 8. Stream inputs
  console.log('Configuring Web Stream...');
  const urlIn = page.locator('input[placeholder*="example.com" i], input[aria-label*="Website URL" i]').first();
  if (await urlIn.isVisible()) {
    await urlIn.fill('shiftandtip.blogspot.com');
  }
  const streamIn = page.locator('input[placeholder*="My web stream" i], input[aria-label*="Stream name" i]').first();
  if (await streamIn.isVisible()) {
    await streamIn.fill('Shift & Tip Web');
  }

  const createStream = page.getByRole('button', { name: /create stream/i }).first();
  if (await createStream.isVisible()) {
    console.log('Clicking Create stream...');
    await createStream.click();
    await page.waitForTimeout(8000);
  }

  await page.screenshot({ path: 'reports/live/ga4-stream-details.png' });

  // 9. Extract Measurement ID
  const measurementId = await page.evaluate(() => {
    const text = document.body.innerText;
    const match = text.match(/G-[A-Z0-9]{8,12}/);
    return match ? match[0] : null;
  });

  console.log('EXTRACTED MEASUREMENT ID:', measurementId);

  if (measurementId) {
    writeFileSync('data/ga4.json', JSON.stringify({ measurementId, timestamp: new Date().toISOString() }, null, 2) + '\n');
    console.log('Saved to data/ga4.json');

    // 10. Update Blogger Settings with Measurement ID
    console.log('Navigating to Blogger Settings to set Measurement ID...');
    await page.goto(`https://www.blogger.com/blog/settings/${BLOG_ID}`, { timeout: 35000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);

    // Look for Google Analytics Measurement ID setting
    const gaSetting = page.locator('div:has-text("Google Analytics Measurement ID"), [role="button"]:has-text("Google Analytics")').first();
    if (await gaSetting.isVisible()) {
      console.log('Clicking Google Analytics Measurement ID setting...');
      await gaSetting.click();
      await page.waitForTimeout(1000);

      const gaInput = page.locator('[role="dialog"] input, input[aria-label*="Measurement ID" i]').first();
      if (await gaInput.isVisible()) {
        await gaInput.fill(measurementId);
        console.log(`Filled ${measurementId} into Blogger GA setting.`);
        await page.waitForTimeout(500);
        const saveBtn = page.locator('[role="dialog"] button:has-text("Save"), [role="dialog"] [role="button"]:has-text("Save")').first();
        if (await saveBtn.isVisible()) {
          await saveBtn.click();
          console.log('Saved GA Measurement ID in Blogger Settings!');
          await page.waitForTimeout(3000);
        }
      }
    }
  }

  await page.screenshot({ path: 'reports/live/blogger-settings-ga4.png' });
  await context.close();
  console.log('GA4 setup complete.');
}

main().catch(console.error);
