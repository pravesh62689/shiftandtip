// scripts/pw/test-editor-ui.mjs
import { chromium } from 'playwright';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';

async function main() {
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1280, height: 800 },
  });

  const page = context.pages()[0] || await context.newPage();
  console.log('Navigating to New Post editor...');
  await page.goto('https://www.blogger.com/u/4/blog/post/edit/4523693247154244983', { timeout: 30000 });
  await page.waitForTimeout(5000);

  const titleInput = await page.locator('input[aria-label="Title"], textarea[aria-label="Title"], input[placeholder="Title"]').first().isVisible();
  console.log('Title input visible:', titleInput);

  const sidebarItems = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[role="tab"], [role="button"], div[class*="sidebar"], div[class*="section"]'))
      .map(el => el.innerText.trim()).filter(t => t.length > 0 && t.length < 50);
  });

  console.log('Sidebar/UI items sample:', [...new Set(sidebarItems)].slice(0, 25));

  await page.screenshot({ path: 'reports/live/editor-test.png' });
  console.log('Saved screenshot to reports/live/editor-test.png');

  await page.waitForTimeout(2000);
  await context.close();
}

main().catch(console.error);
