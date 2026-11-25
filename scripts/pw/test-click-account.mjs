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
  await page.getByRole('button', { name: /sign in/i }).first().click();
  await page.waitForTimeout(2000);
  await page.locator('.signInCard').filter({ has: page.locator('title:has-text("logo_google")') }).first().click();
  await page.waitForTimeout(4000);

  console.log('On Chooser URL:', page.url());
  const accountItem = page.locator('div[data-identifier="rathore.monty2002@gmail.com"]').first();
  console.log('Account item visible:', await accountItem.isVisible());
  if (await accountItem.isVisible()) {
    console.log('Clicking Monty account item...');
    await accountItem.click();
    await page.waitForTimeout(8000);
  }

  console.log('URL after clicking account:', page.url());
  console.log('Title after clicking account:', await page.title());
  await page.screenshot({ path: 'reports/live/bing-step2.png' });

  // If there is an OAuth consent / permission screen
  const allowBtn = page.locator('button:has-text("Continue"), button:has-text("Allow"), [role="button"]:has-text("Continue"), [role="button"]:has-text("Allow")').first();
  if (await allowBtn.isVisible()) {
    console.log('Consent button found! Text:', await allowBtn.innerText());
    await allowBtn.click();
    await page.waitForTimeout(8000);
    console.log('URL after consent:', page.url());
  }

  await page.waitForTimeout(5000);
  console.log('Final URL:', page.url());
  await page.screenshot({ path: 'reports/live/bing-step3.png' });
  await context.close();
}

main().catch(console.error);
