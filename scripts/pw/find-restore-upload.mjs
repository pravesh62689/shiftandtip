import { chromium } from 'playwright';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';

async function main() {
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1280, height: 800 },
  });
  const page = context.pages()[0] || await context.newPage();
  await page.goto('https://www.blogger.com/u/4/blog/themes/4523693247154244983', { timeout: 30000 });
  await page.waitForTimeout(3000);

  const dropdownBtn = page.locator('button:has-text("CUSTOMISE") ~ button, [role="button"]:has-text("CUSTOMISE") ~ [role="button"], button:has-text("CUSTOMIZE") ~ button, [role="button"]:has-text("CUSTOMIZE") ~ [role="button"]').first();
  await dropdownBtn.click({ force: true });
  await page.waitForTimeout(1000);

  const restoreItem = page.locator('[role="menuitem"]:has-text("Restore")').first();
  await restoreItem.click({ force: true });
  await page.waitForTimeout(2000);

  const uploadBtns = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, div[role="button"], span[role="button"], input[type="file"]'))
      .filter(e => (e.innerText || '').includes('Upload') || (e.getAttribute('aria-label') || '').includes('Upload') || e.type === 'file')
      .map(e => ({ tag: e.tagName, text: e.innerText?.trim(), ariaLabel: e.getAttribute('aria-label'), type: e.type, dataId: e.getAttribute('data-id'), outer: e.outerHTML.slice(0, 200) }));
  });
  console.log('Upload buttons/inputs found:', uploadBtns);

  await context.close();
}

main().catch(console.error);
