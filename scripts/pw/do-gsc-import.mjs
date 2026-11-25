import { chromium } from 'playwright';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';

async function main() {
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });
  const page = context.pages()[0] || await context.newPage();
  await page.goto('https://www.bing.com/webmasters/home', { waitUntil: 'commit' });
  await page.waitForTimeout(5000);

  console.log('Home URL:', page.url());
  const importBtn = page.getByRole('button', { name: 'Import' }).first();
  console.log('Import button visible:', await importBtn.isVisible());
  if (await importBtn.isVisible()) {
    console.log('Clicking Import button...');
    await importBtn.click({ force: true });
    await page.waitForTimeout(3000);

    // Check modal
    const continueBtn = page.getByRole('button', { name: 'Continue' }).first();
    console.log('Continue in modal visible:', await continueBtn.isVisible());
    if (await continueBtn.isVisible()) {
      console.log('Clicking Continue in modal...');
      const popupPromise = context.waitForEvent('page', { timeout: 15000 }).catch(() => null);
      await continueBtn.click({ force: true });
      const popup = await popupPromise;
      if (popup) {
        console.log('Popup URL:', popup.url());
        await popup.waitForTimeout(5000);
        console.log('Popup body:', await popup.evaluate(() => document.body.innerText.slice(0, 400)));

        // Select Monty account
        const acc = popup.locator('div[data-identifier*="rathore" i], div:has-text("rathore.monty2002@gmail.com"), li:has-text("rathore.monty2002@gmail.com")').first();
        if (await acc.isVisible()) {
          console.log('Selecting Monty in popup...');
          await acc.click({ force: true });
          await popup.waitForTimeout(6000);
        }

        // Check for Allow / Continue
        const allow = popup.getByRole('button', { name: /continue|allow/i }).first();
        if (await allow.isVisible()) {
          console.log('Clicking Allow / Continue in popup...');
          await allow.click({ force: true });
          await popup.waitForTimeout(10000);
        }
      }
    }
  }

  await page.waitForTimeout(8000);
  console.log('Post Import URL:', page.url());
  const text = await page.evaluate(() => document.body.innerText.slice(0, 1000));
  console.log('Post Import body:\n', text);

  // If site list is displayed with Import button
  const siteImportBtn = page.getByRole('button', { name: 'Import' }).last();
  if (await siteImportBtn.isVisible()) {
    console.log('Clicking final sites Import button...');
    await siteImportBtn.click({ force: true });
    await page.waitForTimeout(8000);
  }

  await page.screenshot({ path: 'reports/live/bing-imported-success.png' });
  await context.close();
  console.log('Done GSC Import flow!');
}

main().catch(console.error);
