// scripts/pw/check-blogger-posts.mjs
import { chromium } from 'playwright';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';

async function main() {
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1280, height: 800 },
  });

  const page = context.pages()[0] || await context.newPage();
  console.log('Navigating to Blogger posts (/u/4/)...');
  await page.goto('https://www.blogger.com/u/4/blog/posts/4523693247154244983', { timeout: 30000 });
  await page.waitForTimeout(4000);

  const title = await page.title();
  console.log('Page Title:', title);

  const data = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, a, [role="button"]'))
      .map(el => el.innerText.trim()).filter(Boolean);
    const postTitles = Array.from(document.querySelectorAll('a[href*="/post/edit/"], [data-post-id]'))
      .map(el => el.innerText.trim()).filter(Boolean);
    return { btns, postTitles };
  });

  console.log('Buttons:', data.btns.filter(b => b.toLowerCase().includes('post') || b.toLowerCase().includes('new')));
  console.log('Post titles in UI:', data.postTitles);
  await page.waitForTimeout(2000);
  await context.close();
}

main().catch(console.error);
