// scripts/pw/set-blogger-ga4.mjs
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';
const BLOG_ID = '4523693247154244983';

async function main() {
  const gaData = JSON.parse(readFileSync('data/ga4.json', 'utf8'));
  const measurementId = gaData.measurementId;
  console.log('Measurement ID to save:', measurementId);

  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });

  const page = context.pages()[0] || await context.newPage();
  console.log('Navigating to Blogger settings...');
  await page.goto(`https://www.blogger.com/blog/settings/${BLOG_ID}`, { timeout: 35000, waitUntil: 'commit' });
  await page.waitForTimeout(7000);

  console.log('Finding Google Analytics setting...');
  const clickedInfo = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const target = all.find(e => e.innerText && e.innerText.trim() === 'Google Analytics Measurement ID');
    if (target) {
      const btn = target.closest('[role="button"]') || target.closest('div[jsaction]') || target;
      btn.scrollIntoView();
      btn.click();
      return { found: true, text: target.innerText };
    }
    return { found: false };
  });
  console.log('Clicked info:', clickedInfo);
  await page.waitForTimeout(2500);

  console.log('Entering Measurement ID in dialog...');
  const gaInput = page.locator('[role="dialog"] input[type="text"], input[type="text"]:visible').first();
  await gaInput.waitFor({ state: 'visible', timeout: 8000 });
  await gaInput.click({ force: true });
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(measurementId, { delay: 25 });
  await page.waitForTimeout(500);

  console.log('Saving...');
  const saveBtn = page.locator('[role="dialog"] button:has-text("Save"), [role="dialog"] [role="button"]:has-text("Save"), button:has-text("Save")').last();
  await saveBtn.click({ force: true });
  await page.waitForTimeout(4000);

  await page.screenshot({ path: 'reports/live/blogger-settings-ga4-saved.png', timeout: 5000 }).catch(() => {});
  console.log('=== Successfully Saved GA4 Measurement ID in Blogger Settings ===');
  await context.close();
}

main().catch(console.error);
