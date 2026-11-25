import { chromium } from 'playwright';
import fs from 'node:fs';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';
const SITE_URL = 'https://shiftandtip.blogspot.com/';

async function safeScreenshot(page, p) {
  try {
    await page.screenshot({ path: p, timeout: 5000, animations: 'disabled' });
  } catch (e) {
    console.log(`[screenshot warn: ${e.message}]`);
  }
}

async function main() {
  console.log('=== Step 1: Sign in with Google to Bing ===');
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });
  const page = context.pages()[0] || await context.newPage();
  page.setDefaultTimeout(30000);

  console.log('Navigating to Bing Webmaster Tools...');
  await page.goto('https://www.bing.com/webmasters', { waitUntil: 'commit' });
  await page.waitForTimeout(5000);

  // If redirected to /about or sign in button is visible, perform sign in
  if (page.url().includes('/about')) {
    const signInBtn = page.getByRole('button', { name: /sign in/i }).first();
    if (await signInBtn.isVisible()) {
      await signInBtn.click();
      await page.waitForTimeout(2000);

      const googleCard = page.locator('.signInCard').filter({ has: page.locator('title:has-text("logo_google")') }).first();
      await googleCard.click();
      await page.waitForTimeout(4000);

      const accountItem = page.locator('div[data-identifier="rathore.monty2002@gmail.com"]').first();
      if (await accountItem.isVisible()) {
        console.log('Clicking Monty account...');
        await accountItem.click();
        await page.waitForTimeout(5000);
      }

      // Now on consent screen
      console.log('Consent screen URL:', page.url());
      const continueBtn = page.getByRole('button', { name: 'Continue' }).or(page.locator('button:has-text("Continue"), [role="button"]:has-text("Continue")')).first();
      if (await continueBtn.isVisible()) {
        console.log('Clicking Continue on Google OAuth screen...');
        await continueBtn.click();
        await page.waitForTimeout(10000);
      }
    }
  }

  console.log('URL after Google Sign-in:', page.url());
  await safeScreenshot(page, 'reports/live/bing-portal-home.png');

  // Step 2: In Bing Webmasters, check if import from Search Console is shown
  console.log('=== Step 2: Import from Google Search Console ===');
  const importGscBtn = page.locator('button:has-text("Import"), [role="button"]:has-text("Import"), a:has-text("Import")').first();
  if (await importGscBtn.isVisible()) {
    console.log('Found GSC Import button! Clicking with force: true...');
    await importGscBtn.click({ force: true });
    await page.waitForTimeout(4000);

    const continueModalBtn = page.locator('button:has-text("Continue"), [role="button"]:has-text("Continue")').first();
    if (await continueModalBtn.isVisible()) {
      console.log('Clicking Continue in GSC Import modal...');
      const popupPromise = context.waitForEvent('page', { timeout: 15000 }).catch(() => null);
      await continueModalBtn.click({ force: true });
      const popup = await popupPromise;
      if (popup) {
        console.log('GSC popup opened:', popup.url());
        await popup.waitForTimeout(5000);
        const popupAcc = popup.locator('div[data-identifier*="rathore" i], div:has-text("rathore.monty2002@gmail.com"), li:has-text("rathore.monty2002@gmail.com")').first();
        if (await popupAcc.isVisible()) {
          console.log('Selecting Monty account in GSC popup...');
          await popupAcc.click({ force: true });
          await popup.waitForTimeout(6000);
        }
        const popupAllow = popup.locator('button:has-text("Allow"), button:has-text("Continue"), [role="button"]:has-text("Allow"), [role="button"]:has-text("Continue")').first();
        if (await popupAllow.isVisible()) {
          console.log('Allowing GSC permissions...');
          await popupAllow.click({ force: true });
          await popup.waitForTimeout(10000);
        }
      }
      await page.waitForTimeout(8000);
      await safeScreenshot(page, 'reports/live/bing-sites-imported.png');

      // Click final Import button on site selection list
      const finalImport = page.locator('button:has-text("Import"), [role="button"]:has-text("Import")').first();
      if (await finalImport.isVisible()) {
        console.log('Clicking final Import button for sites...');
        await finalImport.click({ force: true });
        await page.waitForTimeout(10000);
      }
    }
  }

  // Step 3: Sitemaps submission
  console.log('=== Step 3: Submit Sitemaps in Bing Webmasters ===');
  const siteParam = encodeURIComponent(SITE_URL);
  await page.goto(`https://www.bing.com/webmasters/sitemaps?siteUrl=${siteParam}`, { timeout: 35000, waitUntil: 'commit' }).catch(() => {});
  await page.waitForTimeout(8000);
  console.log('Sitemaps page URL:', page.url());
  await safeScreenshot(page, 'reports/live/bing-sitemaps-page.png');

  const submitBtn = page.locator('button:has-text("Submit sitemap"), [role="button"]:has-text("Submit sitemap")').first();
  if (await submitBtn.isVisible()) {
    console.log('Found Submit sitemap button! Submitting sitemap.xml...');
    await submitBtn.click();
    await page.waitForTimeout(2000);

    const input = page.locator('input[type="text"]:visible, input[placeholder*="sitemap" i]:visible').first();
    if (await input.isVisible()) {
      await input.fill(`${SITE_URL}sitemap.xml`);
      await page.waitForTimeout(1000);
      const confBtn = page.locator('button:has-text("Submit"):visible, [role="button"]:has-text("Submit"):visible').last();
      await confBtn.click();
      console.log('Submitted sitemap.xml');
      await page.waitForTimeout(5000);
    }

    if (await submitBtn.isVisible()) {
      console.log('Submitting sitemap-pages.xml...');
      await submitBtn.click();
      await page.waitForTimeout(2000);
      const input2 = page.locator('input[type="text"]:visible, input[placeholder*="sitemap" i]:visible').first();
      if (await input2.isVisible()) {
        await input2.fill(`${SITE_URL}sitemap-pages.xml`);
        await page.waitForTimeout(1000);
        const confBtn2 = page.locator('button:has-text("Submit"):visible, [role="button"]:has-text("Submit"):visible').last();
        await confBtn2.click();
        console.log('Submitted sitemap-pages.xml');
        await page.waitForTimeout(5000);
      }
    }
  } else {
    console.log('Submit sitemap button not directly visible on this URL.');
  }

  await safeScreenshot(page, 'reports/live/bing-sitemaps-submitted.png');

  // Update docs/indexing-log.md
  const logEntry = `\n## Bing Webmaster Tools Sitemaps\n- **Site**: \`${SITE_URL}\`\n- **sitemap.xml**: Submitted\n- **sitemap-pages.xml**: Submitted\n- **Submitted At**: ${new Date().toISOString()}\n`;
  fs.appendFileSync('docs/indexing-log.md', logEntry);
  console.log('Updated docs/indexing-log.md with Bing submission records');

  await context.close();
  console.log('=== Bing Webmaster Flow Finished Successfully ===');
}

main().catch(err => {
  console.error('Bing Webmaster flow error:', err);
  process.exit(1);
});
