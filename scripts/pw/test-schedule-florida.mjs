// scripts/pw/test-schedule-florida.mjs
import { chromium } from 'playwright';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';

async function main() {
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });

  const page = context.pages()[0] || await context.newPage();
  console.log('Opening Florida draft 7827484922455904848...');
  await page.goto('https://www.blogger.com/blog/post/edit/4523693247154244983/7827484922455904848', { timeout: 35000 });
  await page.waitForTimeout(4000);

  // Click visible Publish button
  const clickedPub = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('[role="button"], button'));
    const pub = btns.find(b => b.getAttribute('aria-label') === 'Publish' && b.offsetParent !== null)
             || btns.find(b => b.innerText && b.innerText.trim().includes('Publish') && b.offsetParent !== null);
    if (pub) {
      pub.click();
      return true;
    }
    return false;
  });
  console.log('Publish clicked:', clickedPub);
  await page.waitForTimeout(2000);

  // Click Confirm in dialog
  const confirmed = await page.evaluate(() => {
    const dialog = document.querySelector('.g3VIld, [role="dialog"]');
    if (!dialog) return false;
    const btns = Array.from(dialog.querySelectorAll('[role="button"], button'));
    const confirmBtn = btns.find((b) => /confirm|publish/i.test(b.innerText));
    if (confirmBtn) {
      confirmBtn.click();
      return true;
    }
    return false;
  });
  console.log('Confirmed in dialog:', confirmed);
  await page.waitForTimeout(4000);

  console.log('URL after confirm:', page.url());
  await context.close();
}

main().catch(console.error);
