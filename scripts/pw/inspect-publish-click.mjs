// scripts/pw/inspect-publish-click.mjs
import { chromium } from 'playwright';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';

async function main() {
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });

  const page = context.pages()[0] || await context.newPage();
  console.log('Opening Texas draft...');
  await page.goto('https://www.blogger.com/blog/post/edit/4523693247154244983/7946870761115222647', { timeout: 35000 });
  await page.waitForTimeout(4000);

  // Check top right buttons
  const topButtons = await page.evaluate(() => {
    const header = document.querySelector('header') || document.body;
    return Array.from(header.querySelectorAll('[role="button"], button')).map(b => ({
      text: b.innerText ? b.innerText.trim() : '',
      ariaLabel: b.getAttribute('aria-label'),
      className: b.className
    })).filter(x => x.text || x.ariaLabel);
  });
  console.log('Top buttons:', JSON.stringify(topButtons, null, 2));

  // Find Publish button
  const pubBtn = page.locator('[role="button"][aria-label="Publish"], div[role="button"]:has-text("Publish")').first();
  console.log('Publish button found:', await pubBtn.isVisible());
  console.log('Publish button details:', await pubBtn.evaluate(el => ({
    text: el.innerText,
    ariaLabel: el.getAttribute('aria-label'),
    outerHTML: el.outerHTML
  })));

  console.log('Clicking Publish button...');
  await pubBtn.click();
  await page.waitForTimeout(2000);

  // Check all dialogs / overlays
  const overlays = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[role="dialog"], [role="alertdialog"], .modal, .quantumWizDialogPaperdialogEl, [aria-modal="true"]')).map(d => ({
      text: d.innerText,
      html: d.outerHTML.slice(0, 300)
    }));
  });
  console.log('Overlays found:', JSON.stringify(overlays, null, 2));

  await page.screenshot({ path: 'reports/live/after-pub-click-debug.png' });
  await context.close();
}

main().catch(console.error);
