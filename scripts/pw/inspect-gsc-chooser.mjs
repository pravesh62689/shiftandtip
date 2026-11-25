import { chromium } from 'playwright';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';

async function main() {
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });
  const page = context.pages()[0] || await context.newPage();
  await page.goto('https://www.bing.com/webmasters/home', { waitUntil: 'commit' });
  await page.waitForTimeout(4000);

  const importBtn = page.getByRole('button', { name: 'Import' }).first();
  if (await importBtn.isVisible()) {
    await importBtn.click({ force: true });
    await page.waitForTimeout(2000);
    const contBtn = page.getByRole('button', { name: 'Continue' }).first();
    await contBtn.click({ force: true });
    await page.waitForTimeout(6000);
  }

  console.log('Current URL:', page.url());
  const clickableItems = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('div, li, button, a'))
      .filter(e => {
        const t = e.innerText || '';
        return t.includes('rathore.monty2002@gmail.com') || t.includes('Monty');
      })
      .map(e => ({
        tag: e.tagName,
        className: e.className,
        role: e.getAttribute('role'),
        dataId: e.getAttribute('data-identifier'),
        text: e.innerText.slice(0, 50)
      }));
  });
  console.log('Clickable matching items:', clickableItems);

  // Take screenshot
  await page.screenshot({ path: 'reports/live/bing-gsc-accountchooser.png' });
  await context.close();
}

main().catch(console.error);
