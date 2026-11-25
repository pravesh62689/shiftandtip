import { chromium } from 'playwright';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';

async function main() {
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });
  const page = context.pages()[0] || await context.newPage();
  await page.goto('https://www.bing.com/webmasters', { timeout: 35000, waitUntil: 'commit' });
  await page.waitForTimeout(6000);

  console.log('Initial URL:', page.url());

  // Check if we already landed in dashboard
  if (page.url().includes('/home') || page.url().includes('/dashboard')) {
    console.log('Already in Bing dashboard!');
    await page.screenshot({ path: 'reports/live/bing-dashboard-logged.png' });
    await context.close();
    return;
  }

  const signInBtn = page.getByRole('button', { name: /sign in|get started/i }).first();
  if (await signInBtn.isVisible()) {
    console.log('Clicking Sign in button...');
    await signInBtn.click();
    await page.waitForTimeout(3000);

    const items = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('button, a, div[role="button"], span[role="button"]'));
      return els.map(e => ({ text: e.innerText.trim(), tag: e.tagName, role: e.getAttribute('role') }))
        .filter(x => x.text.length > 0 && x.text.length < 50);
    });
    console.log('Found interactive elements:', items);
  }

  await page.screenshot({ path: 'reports/live/bing-signin-modal.png' });
  await context.close();
}

main().catch(console.error);
