import { chromium } from 'playwright';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';

async function main() {
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
  });
  const page = context.pages()[0] || await context.newPage();
  await page.goto('https://www.bing.com/webmasters/about', { waitUntil: 'commit' });
  await page.waitForTimeout(4000);
  await page.getByRole('button', { name: /sign in/i }).first().click();
  await page.waitForTimeout(2000);
  await page.locator('.signInCard').filter({ has: page.locator('title:has-text("logo_google")') }).first().click();
  await page.waitForTimeout(5000);

  console.log('Current URL:', page.url());
  const elements = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('div[data-identifier], div[data-profileidentifier], [role="link"], [role="button"], button, li'))
      .map(e => ({ text: e.innerText.trim(), tag: e.tagName, role: e.getAttribute('role'), dataId: e.getAttribute('data-identifier') }))
      .filter(x => x.text.length > 0 && x.text.length < 100);
  });
  console.log('Account Chooser Elements:', elements);
  await context.close();
}

main().catch(console.error);
