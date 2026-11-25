// scripts/pw/bing-webmaster.mjs
import { chromium } from 'playwright';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';
const SITE_URL = 'https://shiftandtip.blogspot.com/';

async function main() {
  console.log('=== Bing Webmaster Tools Automation ===');
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });

  const page = context.pages()[0] || await context.newPage();
  console.log('Navigating to Bing Webmaster Tools...');
  await page.goto('https://www.bing.com/webmasters', { timeout: 35000, waitUntil: 'commit' });
  await page.waitForTimeout(8000);

  console.log('Current URL:', page.url());
  await page.screenshot({ path: 'reports/live/bing-home.png', timeout: 5000 }).catch(() => {});

  // Check if sign-in button or "Sign In" is present
  const signInBtn = page.getByRole('button', { name: /sign in|get started/i }).first();
  if (await signInBtn.isVisible()) {
    console.log('Clicking Sign in...');
    await signInBtn.click();
    await page.waitForTimeout(3000);

    // Click Google option
    const googleOpt = page.locator('button:has-text("Google"), [role="button"]:has-text("Google")').first();
    if (await googleOpt.isVisible()) {
      console.log('Clicking Google sign-in option...');
      const popupPromise = page.waitForEvent('popup', { timeout: 10000 }).catch(() => null);
      await googleOpt.click();
      const popup = await popupPromise;
      if (popup) {
        console.log('Popup URL:', popup.url());
        await popup.waitForTimeout(5000);
        // If account selection is shown, click user's account
        const acc = popup.locator('div[data-identifier*="rathore" i], div:has-text("rathore.monty2002@gmail.com")').first();
        if (await acc.isVisible()) {
          console.log('Selecting Monty account in Google popup...');
          await acc.click();
          await popup.waitForTimeout(6000);
        }
      }
      await page.waitForTimeout(8000);
    }
  }

  console.log('URL after sign-in check:', page.url());
  await page.screenshot({ path: 'reports/live/bing-dashboard.png', timeout: 5000 }).catch(() => {});
  await context.close();
  console.log('Done!');
}

main().catch(console.error);
