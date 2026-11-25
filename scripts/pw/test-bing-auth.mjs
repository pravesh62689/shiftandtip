import { chromium } from 'playwright';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';

async function main() {
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });
  const page = context.pages()[0] || await context.newPage();
  await page.goto('https://www.bing.com/webmasters/about', { waitUntil: 'commit' });
  await page.waitForTimeout(4000);

  const signInBtn = page.getByRole('button', { name: /sign in/i }).first();
  if (await signInBtn.isVisible()) {
    console.log('Clicking Sign In...');
    await signInBtn.click();
    await page.waitForTimeout(2000);

    const googleCard = page.locator('.signInCard').filter({ has: page.locator('title:has-text("logo_google")') }).first();
    console.log('Google card visible:', await googleCard.isVisible());

    // Listen for popup or navigation
    const [popup] = await Promise.all([
      context.waitForEvent('page', { timeout: 15000 }).catch(() => null),
      googleCard.click(),
    ]);

    if (popup) {
      console.log('Popup URL:', popup.url());
      await popup.waitForTimeout(5000);
      console.log('Popup Title:', await popup.title());
      await popup.screenshot({ path: 'reports/live/bing-google-popup.png' });

      // Check if account selection is shown
      const acc = popup.locator('div[data-identifier*="rathore" i], div:has-text("rathore.monty2002@gmail.com")').first();
      if (await acc.isVisible()) {
        console.log('Found user account! Clicking...');
        await acc.click();
        await popup.waitForTimeout(6000);
      }

      // Check for Continue / Allow buttons
      const continueBtn = popup.locator('button:has-text("Continue"), button:has-text("Allow"), [role="button"]:has-text("Continue"), [role="button"]:has-text("Allow")').first();
      if (await continueBtn.isVisible()) {
        console.log('Found Continue/Allow button! Clicking...');
        await continueBtn.click();
        await popup.waitForTimeout(6000);
      }
    } else {
      console.log('No popup opened. Current page URL:', page.url());
    }

    await page.waitForTimeout(8000);
    console.log('Final Page URL:', page.url());
    await page.screenshot({ path: 'reports/live/bing-after-auth.png' });
  }

  await context.close();
  console.log('Done test!');
}

main().catch(console.error);
