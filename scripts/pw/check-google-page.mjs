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
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: /sign in/i }).first().click();
  await page.waitForTimeout(2000);
  await page.locator('.signInCard').filter({ has: page.locator('title:has-text("logo_google")') }).first().click();
  await page.waitForTimeout(4000);

  const accountItem = page.locator('div[data-identifier="rathore.monty2002@gmail.com"]').first();
  if (await accountItem.isVisible()) {
    await accountItem.click();
    await page.waitForTimeout(5000);
  }

  console.log('Current URL:', page.url());
  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 800));
  console.log('Body snippet:\n', bodyText);
  await context.close();
}

main().catch(console.error);
