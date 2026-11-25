// scripts/pw/inspect-editor-details.mjs
import { chromium } from 'playwright';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';

async function main() {
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });

  const page = context.pages()[0] || await context.newPage();
  console.log('Navigating to Blogger post list...');
  await page.goto('https://www.blogger.com/blog/posts/4523693247154244983', { timeout: 30000 });
  await page.waitForTimeout(3000);

  // Click create new post
  console.log('Clicking FAB to create/open new post...');
  await page.evaluate(() => {
    const el = document.querySelector('[aria-label*="new post" i], [aria-label*="New post" i], [data-tooltip*="new post" i]');
    if (el) el.click();
  });
  await page.waitForTimeout(5000);

  console.log('Current URL:', page.url());

  // Inspect elements
  const details = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input, textarea')).map(el => ({
      tag: el.tagName,
      type: el.type,
      placeholder: el.placeholder,
      ariaLabel: el.getAttribute('aria-label'),
      name: el.name,
      className: el.className
    }));

    const buttons = Array.from(document.querySelectorAll('button, [role="button"]')).map(el => ({
      text: el.innerText ? el.innerText.trim().slice(0, 50) : '',
      ariaLabel: el.getAttribute('aria-label'),
      role: el.getAttribute('role'),
    })).filter(b => b.text || b.ariaLabel);

    return { inputs, buttons: buttons.slice(0, 40) };
  });

  console.log('Inputs found:', JSON.stringify(details.inputs, null, 2));
  console.log('Buttons sample:', JSON.stringify(details.buttons, null, 2));

  await page.screenshot({ path: 'reports/live/post-editor-detailed.png', fullPage: true });
  console.log('Screenshot saved to reports/live/post-editor-detailed.png');

  await context.close();
}

main().catch(console.error);
