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
  await page.waitForTimeout(5000);

  // Let's find the Sign In button
  const signInBtn = page.getByRole('button', { name: /sign in/i }).first();
  console.log('SignIn button tag & text:', await signInBtn.evaluate(el => el.outerHTML));
  await signInBtn.click();
  await page.waitForTimeout(3000);

  // Inspect any open dialog or modal
  const dialogHtml = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"], .modal, div[class*="dialog"], div[class*="modal"], div[class*="popup"], div[class*="signIn"]');
    if (dialog) return dialog.outerHTML;
    // Check all visible buttons
    return Array.from(document.querySelectorAll('button, a, div[role="button"]'))
      .filter(e => {
        const rect = e.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && e.offsetParent !== null;
      })
      .map(e => ({ tag: e.tagName, text: e.innerText.trim(), href: e.href, outer: e.outerHTML.slice(0, 150) }));
  });

  console.log('Dialog / Visible interactive elements:', JSON.stringify(dialogHtml, null, 2));
  await context.close();
}

main().catch(console.error);
