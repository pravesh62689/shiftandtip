// scripts/pw/test-sidebar-inspect.mjs
import { chromium } from 'playwright';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';

async function main() {
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });

  const page = context.pages()[0] || await context.newPage();
  console.log('Navigating to recent draft...');
  await page.goto('https://www.blogger.com/blog/post/edit/4523693247154244983/7946870761115222647', { timeout: 35000 });
  await page.waitForTimeout(4000);

  // 1. Published on
  const pubOn = page.locator('.oX8Xbb:has-text("Published on")').first();
  await pubOn.click();
  await page.waitForTimeout(1000);
  const pubOnInfo = await page.evaluate(() => {
    const radios = Array.from(document.querySelectorAll('[role="radio"], input[type="radio"]')).map(r => ({
      ariaLabel: r.getAttribute('aria-label'),
      text: r.parentElement ? r.parentElement.innerText.trim() : '',
      checked: r.getAttribute('aria-checked') || r.checked
    }));
    const inputs = Array.from(document.querySelectorAll('input[type="text"], input:not([type])')).map(i => ({
      ariaLabel: i.getAttribute('aria-label'),
      val: i.value,
      placeholder: i.placeholder
    }));
    return { radios, inputs };
  });
  console.log('Published on info:', JSON.stringify(pubOnInfo, null, 2));

  // 2. Permalink
  const permalinkHeader = page.locator('.oX8Xbb:has-text("Permalink")').first();
  await permalinkHeader.click();
  await page.waitForTimeout(1000);
  const permalinkInfo = await page.evaluate(() => {
    const radios = Array.from(document.querySelectorAll('[role="radio"], input[type="radio"]')).map(r => ({
      ariaLabel: r.getAttribute('aria-label'),
      text: r.parentElement ? r.parentElement.innerText.trim() : '',
      checked: r.getAttribute('aria-checked') || r.checked
    }));
    const inputs = Array.from(document.querySelectorAll('input')).map(i => ({
      ariaLabel: i.getAttribute('aria-label'),
      val: i.value,
      placeholder: i.placeholder
    }));
    return { radios, inputs };
  });
  console.log('Permalink info:', JSON.stringify(permalinkInfo, null, 2));

  await context.close();
}

main().catch(console.error);
