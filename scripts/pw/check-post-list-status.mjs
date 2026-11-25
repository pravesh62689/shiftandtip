// scripts/pw/check-post-list-status.mjs
import { chromium } from 'playwright';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';

async function main() {
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });

  const page = context.pages()[0] || await context.newPage();
  console.log('Navigating to posts list...');
  await page.goto('https://www.blogger.com/blog/posts/4523693247154244983', { timeout: 35000 });
  await page.waitForTimeout(4000);

  const posts = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('[data-post-id], [jsname="wP4dne"], .f6fU7c, [role="listitem"]')).map(r => ({
      text: r.innerText.slice(0, 150).replace(/\n+/g, ' | '),
    }));
    return rows;
  });

  console.log('Posts in list (first 10):', JSON.stringify(posts.slice(0, 10), null, 2));

  await page.screenshot({ path: 'reports/live/posts-list-current.png' });
  await context.close();
}

main().catch(console.error);
