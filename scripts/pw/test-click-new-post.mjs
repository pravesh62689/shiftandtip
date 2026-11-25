// scripts/pw/test-click-new-post.mjs
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
  await page.waitForTimeout(3000);

  console.log('2. Clicking NEW POST button...');
  const newPostBtn = page.locator('button:has-text("NEW POST"), [role="button"]:has-text("NEW POST"), a:has-text("NEW POST")').first();
  await newPostBtn.click();
  await page.waitForTimeout(6000);

  console.log('3. Current URL after click:', page.url());
  console.log('4. Page Title:', await page.title());

  await page.screenshot({ path: 'reports/live/new-post-editor.png' });
  console.log('Saved screenshot to reports/live/new-post-editor.png');

  await page.waitForTimeout(2000);
  await context.close();
}

main().catch(console.error);
