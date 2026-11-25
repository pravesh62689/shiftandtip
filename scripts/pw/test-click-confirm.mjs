// scripts/pw/test-click-confirm.mjs
import { chromium } from 'playwright';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';

async function main() {
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });

  const page = context.pages()[0] || await context.newPage();
  console.log('Opening Texas draft...');
  await page.goto('https://www.blogger.com/blog/post/edit/4523693247154244983/7946870761115222647', { timeout: 35000 });
  await page.waitForTimeout(4000);

  // Click Publish
  const pubBtn = page.locator('[role="button"][aria-label="Publish"]').first();
  await pubBtn.click();
  await page.waitForTimeout(2000);

  // Check dialog buttons
  const dialogButtons = await page.evaluate(() => {
    const dialog = document.querySelector('.g3VIld, [role="dialog"]');
    if (!dialog) return [];
    return Array.from(dialog.querySelectorAll('[role="button"], button')).map(b => ({
      text: b.innerText,
      ariaLabel: b.getAttribute('aria-label'),
      tag: b.tagName,
      className: b.className,
      html: b.outerHTML.slice(0, 150)
    }));
  });
  console.log('Dialog buttons:', JSON.stringify(dialogButtons, null, 2));

  // Click confirm button via getByRole or evaluate
  const clicked = await page.evaluate(() => {
    const dialog = document.querySelector('.g3VIld, [role="dialog"]');
    if (!dialog) return false;
    const btns = Array.from(dialog.querySelectorAll('[role="button"], button'));
    const confirmBtn = btns.find(b => /confirm|publish/i.test(b.innerText));
    if (confirmBtn) {
      confirmBtn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked confirm via evaluate:', clicked);
  await page.waitForTimeout(5000);

  console.log('URL after confirm:', page.url());
  await page.screenshot({ path: 'reports/live/after-texas-scheduled.png' });

  await context.close();
}

main().catch(console.error);
