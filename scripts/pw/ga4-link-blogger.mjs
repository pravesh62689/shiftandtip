// scripts/pw/ga4-link-blogger.mjs
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';
const BLOG_ID = '4523693247154244983';
const PROP_PATH = 'a417389583p565821616';

async function main() {
  console.log('=== Linking GA4 Stream Measurement ID to Blogger ===');
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });

  const page = context.pages()[0] || await context.newPage();
  console.log('1. Navigating to Streams page...');
  await page.goto(`https://analytics.google.com/analytics/web/#/${PROP_PATH}/admin/streams/table`, { timeout: 40000, waitUntil: 'commit' });

  console.log('   Waiting for streams table to load...');
  await page.waitForFunction(() => {
    return document.body && document.body.innerText && document.body.innerText.includes('Shift & Tip Web');
  }, { timeout: 45000 });
  await page.waitForTimeout(2000);

  console.log('2. Clicking "Shift & Tip Web" stream row...');
  const streamRow = page.getByText('Shift & Tip Web').first();
  await streamRow.click();
  await page.waitForTimeout(5000);

  // Extract Measurement ID
  console.log('3. Extracting Measurement ID from details...');
  let measurementId = await page.evaluate(() => {
    const text = document.body.innerText;
    const m = text.match(/G-[A-Z0-9]{8,12}/);
    return m ? m[0] : null;
  });

  if (!measurementId) {
    console.log('   Pressing Escape to dismiss modal if open...');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(2000);

    measurementId = await page.evaluate(() => {
      const text = document.body.innerText;
      const m = text.match(/G-[A-Z0-9]{8,12}/);
      return m ? m[0] : null;
    });
  }

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

  console.log('   FOUND MEASUREMENT ID:', measurementId);

  if (!measurementId) {
    throw new Error('Measurement ID not found in stream details');
  }

  const gaData = {
    measurementId,
    streamId: '16412860911',
    propertyId: '565821616',
    accountId: '417389583',
    created: new Date().toISOString()
  };
  writeFileSync('data/ga4.json', JSON.stringify(gaData, null, 2) + '\n');
  console.log('   Saved to data/ga4.json');

  // 4. Update Blogger Settings
  console.log('4. Navigating to Blogger Settings...');
  await page.goto(`https://www.blogger.com/blog/settings/${BLOG_ID}`, { timeout: 35000, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);

  console.log('   Opening Google Analytics setting dialog...');
  const gaSetting = page.locator('div:has-text("Google Analytics Measurement ID"), [role="button"]:has-text("Google Analytics")').first();
  await gaSetting.scrollIntoViewIfNeeded();
  await gaSetting.click();
  await page.waitForTimeout(1500);

  const gaInput = page.locator('[role="dialog"] input, input[aria-label*="Measurement ID" i]').first();
  await gaInput.waitFor({ state: 'visible', timeout: 5000 });
  await gaInput.fill(measurementId);
  console.log(`   Filled Measurement ID: ${measurementId}`);
  await page.waitForTimeout(500);

  const saveBtn = page.locator('[role="dialog"] button:has-text("Save"), [role="dialog"] [role="button"]:has-text("Save")').first();
  await saveBtn.click();
  console.log('   SAVED Google Analytics Measurement ID in Blogger Settings!');
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'reports/live/blogger-settings-ga4-saved.png', timeout: 5000 }).catch(() => {});
  await context.close();
  console.log('=== GA4 Linking Completed Successfully ===');
}

main().catch(console.error);
