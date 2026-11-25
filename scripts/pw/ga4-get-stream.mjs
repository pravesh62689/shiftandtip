// scripts/pw/ga4-get-stream.mjs
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';
const BLOG_ID = '4523693247154244983';
const PROP_PATH = 'a417389583p565821616';

async function main() {
  console.log('=== Fetching / Creating GA4 Data Stream for Property ===');
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });

  const page = context.pages()[0] || await context.newPage();

  console.log('1. Navigating to Data Streams page...');
  await page.goto(`https://analytics.google.com/analytics/web/#/${PROP_PATH}/admin/streams/table`, { timeout: 40000, waitUntil: 'commit' });
  await page.waitForTimeout(12000);
  console.log('   Current URL:', page.url());

  // Check for email communications modal or any welcome dialog
  console.log('Checking for modal dialogs / backdrops...');
  for (let d = 0; d < 3; d++) {
    const dialogBtn = page.locator('[role="dialog"] button:has-text("Save"), mat-dialog-container button:has-text("Save"), [role="dialog"] button:has-text("Close"), [role="dialog"] button:has-text("Done")').first();
    if (await dialogBtn.isVisible()) {
      console.log(`   Dismissing dialog with button: "${await dialogBtn.innerText()}"...`);
      await dialogBtn.click({ force: true });
      await page.waitForTimeout(2000);
    }
  }

  const backdrop = page.locator('.cdk-overlay-backdrop');
  if (await backdrop.count() > 0) {
    console.log('   Waiting for overlay backdrop to detach...');
    await backdrop.first().waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  }

  // Check if any stream row exists
  console.log('2. Checking for existing streams...');
  let streamRow = page.locator('mat-row, tr[role="row"], .stream-row, [role="button"]:has-text("Shift & Tip"), [role="button"]:has-text("shiftandtip")').first();
  if (await streamRow.isVisible()) {
    console.log('   Found existing stream row, opening...');
    await streamRow.click({ force: true });
    await page.waitForTimeout(4000);
  } else {
    console.log('   No stream row found. Checking for "Add stream" or platform picker...');
    const addStreamBtn = page.getByRole('button', { name: /add stream/i }).first();
    if (await addStreamBtn.isVisible()) {
      await addStreamBtn.click({ force: true });
      await page.waitForTimeout(1000);
      const webOption = page.getByRole('menuitem', { name: /^web$/i }).or(page.getByText(/^web$/i)).first();
      await webOption.click({ force: true });
      await page.waitForTimeout(3000);
    } else {
      const webBtn = page.locator('button:has-text("Web"), [role="button"]:has-text("Web")').first();
      if (await webBtn.isVisible()) {
        console.log('   Clicking Web platform...');
        await webBtn.click({ force: true });
        await page.waitForTimeout(3000);
      }
    }

    // Fill Stream Details
    console.log('3. Filling Web Stream details...');
    const urlIn = page.locator('input[placeholder*="mywebsite.com" i], input[placeholder*="example.com" i], input[aria-label*="Website URL" i]').first();
    if (await urlIn.isVisible()) {
      await urlIn.click({ force: true });
      await page.keyboard.press('Control+A');
      await page.keyboard.press('Backspace');
      await page.keyboard.type('shiftandtip.blogspot.com', { delay: 25 });
      console.log('   Filled URL: shiftandtip.blogspot.com');
    }

    const streamIn = page.locator('input[placeholder*="My Website" i], input[placeholder*="stream" i], input[aria-label*="Stream name" i]').first();
    if (await streamIn.isVisible()) {
      await streamIn.click({ force: true });
      await page.keyboard.press('Control+A');
      await page.keyboard.press('Backspace');
      await page.keyboard.type('Shift & Tip Web', { delay: 25 });
      console.log('   Filled Stream Name: Shift & Tip Web');
    }

    await page.keyboard.press('Tab');
    await page.waitForTimeout(1000);

    const createStream = page.locator('button[debug-id="create-stream-button"]').or(page.getByRole('button', { name: /create and continue|create stream/i })).first();
    if (await createStream.isVisible()) {
      console.log('   Clicking Create stream...');
      await createStream.click({ force: true });
      await page.waitForTimeout(10000);
    }
  }

  // Close install instructions dialog if open
  const closeBtn = page.locator('button[aria-label*="Close" i], [role="dialog"] button:has-text("Close"), mat-icon:has-text("close")').first();
  if (await closeBtn.isVisible()) {
    console.log('   Closing Installation instructions dialog...');
    await closeBtn.click();
    await page.waitForTimeout(2000);
  }

  // Extract Measurement ID
  console.log('4. Extracting Measurement ID...');
  let measurementId = await page.evaluate(() => {
    const text = document.body.innerText;
    const m = text.match(/G-[A-Z0-9]{8,12}/);
    return m ? m[0] : null;
  });

  if (!measurementId) {
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

  console.log('RESULT MEASUREMENT ID:', measurementId);

  if (measurementId) {
    writeFileSync('data/ga4.json', JSON.stringify({
      measurementId,
      propertyId: '565821616',
      accountId: '417389583',
      created: new Date().toISOString()
    }, null, 2) + '\n');
    console.log('   Saved to data/ga4.json');

    // 5. Update Blogger Settings
    console.log('5. Updating Blogger Settings with GA4 ID...');
    await page.goto(`https://www.blogger.com/blog/settings/${BLOG_ID}`, { timeout: 35000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);

    const gaSetting = page.locator('div:has-text("Google Analytics Measurement ID"), [role="button"]:has-text("Google Analytics")').first();
    if (await gaSetting.isVisible()) {
      console.log('   Opening Google Analytics setting dialog...');
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
  }

  await context.close();
  console.log('=== Completed Successfully ===');
}

main().catch(console.error);
