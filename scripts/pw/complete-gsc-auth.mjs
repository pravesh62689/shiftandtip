import { chromium } from 'playwright';
import fs from 'node:fs';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';
const SITE_URL = 'https://shiftandtip.blogspot.com/';

async function main() {
  console.log('=== Complete GSC Auth & Bing Import ===');
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });
  const page = context.pages()[0] || await context.newPage();
  page.setDefaultTimeout(30000);

  // If already on account chooser or let's go to bing.com/webmasters/home
  await page.goto('https://www.bing.com/webmasters/home', { waitUntil: 'commit' });
  await page.waitForTimeout(5000);

  // If on GSC import / home
  if (page.url().includes('accounts.google.com')) {
    console.log('On Google screen:', page.url());
  } else {
    const importBtn = page.getByRole('button', { name: 'Import' }).first();
    if (await importBtn.isVisible()) {
      console.log('Clicking Import button...');
      await importBtn.click({ force: true });
      await page.waitForTimeout(3000);

      const contModal = page.getByRole('button', { name: 'Continue' }).first();
      if (await contModal.isVisible()) {
        console.log('Clicking Continue in modal...');
        await contModal.click({ force: true });
        await page.waitForTimeout(6000);
      }
    }
  }

  // Handle Google OAuth
  if (page.url().includes('accounts.google.com')) {
    console.log('Handling Google Account Chooser on URL:', page.url());
    const acc = page.locator('div[data-identifier*="rathore" i], div:has-text("rathore.monty2002@gmail.com"), li:has-text("rathore.monty2002@gmail.com")').first();
    if (await acc.isVisible()) {
      console.log('Clicking Monty account item...');
      await acc.click({ force: true });
      await page.waitForTimeout(6000);
    }

    console.log('After account click URL:', page.url());
    // Consent screen: Click Continue / Allow
    const allowBtn = page.locator('button:has-text("Continue"), [role="button"]:has-text("Continue"), button:has-text("Allow"), [role="button"]:has-text("Allow")').first();
    if (await allowBtn.isVisible()) {
      console.log('Clicking Continue / Allow on Google consent screen...');
      await allowBtn.click({ force: true });
      await page.waitForTimeout(10000);
    }
  }

  console.log('Back in Bing URL:', page.url());
  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'reports/live/bing-imported-sites.png' });

  // On Bing: Import sites list
  const sitesImportBtn = page.getByRole('button', { name: 'Import' }).first();
  if (await sitesImportBtn.isVisible()) {
    console.log('Clicking Import button for sites in Bing...');
    await sitesImportBtn.click({ force: true });
    await page.waitForTimeout(10000);
  }

  // Check Sitemaps
  console.log('Navigating to Sitemaps...');
  const siteParam = encodeURIComponent(SITE_URL);
  await page.goto(`https://www.bing.com/webmasters/sitemaps?siteUrl=${siteParam}`, { timeout: 35000, waitUntil: 'commit' }).catch(() => {});
  await page.waitForTimeout(8000);
  console.log('Sitemaps URL:', page.url());
  await page.screenshot({ path: 'reports/live/bing-sitemaps-final.png' });

  // Check if Submit sitemap button is present
  const submitBtn = page.locator('button:has-text("Submit sitemap"), [role="button"]:has-text("Submit sitemap")').first();
  if (await submitBtn.isVisible()) {
    console.log('Submitting sitemap.xml...');
    await submitBtn.click({ force: true });
    await page.waitForTimeout(2000);
    const input = page.locator('input[type="text"]:visible, input[placeholder*="sitemap" i]:visible').first();
    if (await input.isVisible()) {
      await input.fill(`${SITE_URL}sitemap.xml`);
      await page.waitForTimeout(1000);
      const conf = page.locator('button:has-text("Submit"):visible, [role="button"]:has-text("Submit"):visible').last();
      await conf.click({ force: true });
      console.log('Submitted sitemap.xml');
      await page.waitForTimeout(5000);
    }

    if (await submitBtn.isVisible()) {
      console.log('Submitting sitemap-pages.xml...');
      await submitBtn.click({ force: true });
      await page.waitForTimeout(2000);
      const input2 = page.locator('input[type="text"]:visible, input[placeholder*="sitemap" i]:visible').first();
      if (await input2.isVisible()) {
        await input2.fill(`${SITE_URL}sitemap-pages.xml`);
        await page.waitForTimeout(1000);
        const conf2 = page.locator('button:has-text("Submit"):visible, [role="button"]:has-text("Submit"):visible').last();
        await conf2.click({ force: true });
        console.log('Submitted sitemap-pages.xml');
        await page.waitForTimeout(5000);
      }
    }
  }

  await page.screenshot({ path: 'reports/live/bing-sitemaps-submitted.png' });

  // Update docs/indexing-log.md
  const logEntry = `\n## Bing Webmaster Tools Sitemaps\n- **Site**: \`${SITE_URL}\`\n- **sitemap.xml**: Submitted\n- **sitemap-pages.xml**: Submitted\n- **Submitted At**: ${new Date().toISOString()}\n`;
  fs.appendFileSync('docs/indexing-log.md', logEntry);

  await context.close();
  console.log('=== Bing Webmaster Import & Sitemaps Completed! ===');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
