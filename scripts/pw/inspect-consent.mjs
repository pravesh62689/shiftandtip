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

  const accountItem = page.locator('div[data-identifier="rathore.monty2002@gmail.com"]').first();
  if (await accountItem.isVisible()) {
    await accountItem.click();
    await page.waitForTimeout(6000);
  }

  console.log('Consent Page URL:', page.url());
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, [role="button"], input[type="submit"]')).map(b => ({
      text: b.innerText.trim(),
      id: b.id,
      role: b.getAttribute('role'),
      tag: b.tagName
    })).filter(x => x.text.length > 0);
  });
  console.log('Consent Page Buttons:', buttons);

  // Click Continue or Allow if found
  const cont = page.locator('button:has-text("Continue"), [role="button"]:has-text("Continue"), button:has-text("Allow"), [role="button"]:has-text("Allow"), button:has-text("Next"), [role="button"]:has-text("Next")').first();
  if (await cont.isVisible()) {
    console.log('Clicking button:', await cont.innerText());
    await cont.click();
    await page.waitForTimeout(8000);
  }

  console.log('Next URL:', page.url());
  await context.close();
}

main().catch(console.error);
