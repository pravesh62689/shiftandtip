// scripts/pw/test-select-blog.mjs
import { chromium } from 'playwright';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';

async function main() {
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1280, height: 800 },
  });

  const page = context.pages()[0] || await context.newPage();
  console.log('1. Navigating to Blogger posts...');
  await page.goto('https://www.blogger.com/blog/posts/4523693247154244983', { timeout: 30000 });
  await page.waitForTimeout(4000);

  // If there are notices overlay, check
  const noticeClose = page.locator('[aria-label="Close"], [aria-label="Dismiss"], button:has-text("Dismiss")');
  if (await noticeClose.count() > 0) {
    try { await noticeClose.first().click(); } catch(e) {}
  }

  // Click on "Shift & Tip" in blog selector if needed
  const blogLink = page.locator('text="Shift & Tip"').first();
  if (await blogLink.isVisible()) {
    console.log('Clicking Shift & Tip blog link...');
    await blogLink.click();
    await page.waitForTimeout(3000);
  }

  console.log('2. Inspecting Create new post button...');
  const fabInfo = await page.evaluate(() => {
    const el = document.querySelector('[aria-label*="new post" i], [aria-label*="New post" i], [data-tooltip*="new post" i]');
    if (!el) return null;
    return {
      tag: el.tagName,
      html: el.outerHTML.slice(0, 200),
      ariaLabel: el.getAttribute('aria-label'),
    };
  });
  console.log('FAB info:', fabInfo);

  console.log('Clicking FAB via DOM click...');
  await page.evaluate(() => {
    const el = document.querySelector('[aria-label*="new post" i], [aria-label*="New post" i], [data-tooltip*="new post" i]');
    if (el) el.click();
  });
  await page.waitForTimeout(6000);

  console.log('3. Current URL after click:', page.url());
  console.log('4. Page title:', await page.title());

  await page.screenshot({ path: 'reports/live/post-editor-after-fab.png' });
  console.log('Saved screenshot to reports/live/post-editor-after-fab.png');

  await page.waitForTimeout(2000);
  await context.close();
}

main().catch(console.error);
