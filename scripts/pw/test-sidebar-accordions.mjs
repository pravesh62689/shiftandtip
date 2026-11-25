// scripts/pw/test-sidebar-accordions.mjs
import { chromium } from 'playwright';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';

async function main() {
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });

  const page = context.pages()[0] || await context.newPage();
  console.log('Navigating to posts list to create new test post...');
  await page.goto('https://www.blogger.com/blog/posts/4523693247154244983', { timeout: 35000 });
  await page.waitForTimeout(3000);

  // Click FAB to create a brand new draft
  await page.evaluate(() => {
    const el = document.querySelector('[aria-label*="new post" i], [aria-label*="New post" i], [data-tooltip*="new post" i]');
    if (el) el.click();
  });
  await page.waitForTimeout(5000);
  console.log('New post URL:', page.url());

  // Check sidebar accordion headers
  const accordions = await page.evaluate(() => {
    // In Blogger, sidebar headers are usually div[role="button"] or similar
    const headers = Array.from(document.querySelectorAll('[role="button"], [role="tab"], .vO65Bf, .RBHbKe'))
      .map(el => ({
        text: el.innerText ? el.innerText.trim().split('\n')[0] : '',
        ariaLabel: el.getAttribute('aria-label'),
        className: el.className
      }))
      .filter(x => x.text && ['Labels', 'Published on', 'Permalink', 'Location', 'Options', 'Search description'].some(k => x.text.includes(k)));
    return headers;
  });

  console.log('Accordions found:', JSON.stringify(accordions, null, 2));

  // Let's click "Published on"
  const pubOn = page.locator('[role="button"]:has-text("Published on")').first();
  if (await pubOn.isVisible()) {
    console.log('Clicking Published on...');
    await pubOn.click();
    await page.waitForTimeout(1000);
    const dateInput = page.locator('input[aria-label="Date"]').first();
    const timeInput = page.locator('input[aria-label="Time"]').first();
    const setDateRadio = page.locator('label:has-text("Set date and time"), [role="radio"]:has-text("Set date and time"), text="Set date and time"').first();
    console.log('Published on controls:', {
      setDateRadio: await setDateRadio.count(),
      dateInput: await dateInput.count(),
      timeInput: await timeInput.count(),
    });
  }

  // Let's click "Permalink"
  const permalinkBtn = page.locator('[role="button"]:has-text("Permalink")').first();
  if (await permalinkBtn.isVisible()) {
    console.log('Clicking Permalink...');
    await permalinkBtn.click();
    await page.waitForTimeout(1000);
    const customRadio = page.locator('text="Custom permalink", label:has-text("Custom permalink")').first();
    const permalinkInput = page.locator('input[aria-label="Custom permalink input"], input[aria-label*="permalink" i]').first();
    console.log('Permalink controls:', {
      customRadio: await customRadio.count(),
      permalinkInput: await permalinkInput.count(),
    });
  }

  await context.close();
}

main().catch(console.error);
