import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const profileDir = process.env.PW_PROFILE_DIR || 'C:\\Users\\prave\\.shiftandtip-pw-profile';
const scDir = 'reports/search-console';
if (!fs.existsSync(scDir)) fs.mkdirSync(scDir, { recursive: true });

async function main() {
  console.log('Launching Chrome with persistent profile:', profileDir);
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1280, height: 900 },
  });

  const page = context.pages()[0] || await context.newPage();
  const propertyUrl = 'https://shiftandtip.blogspot.com/';

  // 1. Submit Sitemaps
  const sitemapsUrl = `https://search.google.com/search-console/sitemaps?resource_id=${encodeURIComponent(propertyUrl)}`;
  console.log('Navigating to Sitemaps page:', sitemapsUrl);
  await page.goto(sitemapsUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(5000);

  // Dismiss any tour / dialog
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);

  // Submit sitemap.xml
  console.log('Submitting sitemap.xml...');
  const sitemapInput1 = page.locator('input[aria-label*="sitemap" i]:visible, input[name="sitemapPath"]:visible, input[type="text"]:visible').first();
  if (await sitemapInput1.isVisible()) {
    await sitemapInput1.fill('sitemap.xml');
    await page.waitForTimeout(800);
    
    // Try both pressing Enter and clicking Submit with force:true
    await sitemapInput1.press('Enter');
    const submitBtn = page.locator('button:has-text("Submit"):visible, [role="button"]:has-text("Submit"):visible').first();
    if (await submitBtn.count() > 0) {
      try {
        await submitBtn.click({ force: true, timeout: 5000 });
      } catch (e) {
        console.log('Submit button clicked via Enter or failed force-click:', e.message);
      }
    }
    await page.waitForTimeout(6000);

    const gotItBtn = page.locator('button:has-text("Got it"):visible, [role="button"]:has-text("Got it"):visible').first();
    if (await gotItBtn.isVisible()) {
      await page.screenshot({ path: path.join(scDir, 'sitemap-submitted.png') });
      await gotItBtn.click({ force: true });
      await page.waitForTimeout(1500);
    } else {
      await page.screenshot({ path: path.join(scDir, 'sitemap-submitted.png') });
    }
    console.log('[+] sitemap.xml submitted.');
  }

  // Dismiss any dialog
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);

  // Submit sitemap-pages.xml
  console.log('Submitting sitemap-pages.xml...');
  const sitemapInput2 = page.locator('input[aria-label*="sitemap" i]:visible, input[name="sitemapPath"]:visible, input[type="text"]:visible').first();
  if (await sitemapInput2.isVisible()) {
    await sitemapInput2.fill('sitemap-pages.xml');
    await page.waitForTimeout(800);
    
    await sitemapInput2.press('Enter');
    const submitBtn2 = page.locator('button:has-text("Submit"):visible, [role="button"]:has-text("Submit"):visible').first();
    if (await submitBtn2.count() > 0) {
      try {
        await submitBtn2.click({ force: true, timeout: 5000 });
      } catch (e) {
        console.log('Submit 2 clicked via Enter or failed force-click:', e.message);
      }
    }
    await page.waitForTimeout(6000);

    const gotItBtn2 = page.locator('button:has-text("Got it"):visible, [role="button"]:has-text("Got it"):visible').first();
    if (await gotItBtn2.isVisible()) {
      await page.screenshot({ path: path.join(scDir, 'sitemap-pages-submitted.png') });
      await gotItBtn2.click({ force: true });
      await page.waitForTimeout(1500);
    } else {
      await page.screenshot({ path: path.join(scDir, 'sitemap-pages-submitted.png') });
    }
    console.log('[+] sitemap-pages.xml submitted.');
  }

  // 2. URL Inspection for Homepage
  const inspectUrl = `https://search.google.com/search-console/inspect?resource_id=${encodeURIComponent(propertyUrl)}&id=${encodeURIComponent(propertyUrl)}`;
  console.log('Navigating to URL Inspection:', inspectUrl);
  await page.goto(inspectUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(8000);

  // Dismiss any tour
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);

  const reqIndexBtn = page.locator('button:has-text("Request indexing"):visible, [role="button"]:has-text("Request indexing"):visible').first();
  if (await reqIndexBtn.count() > 0 && await reqIndexBtn.isVisible()) {
    console.log('Clicking "Request indexing"...');
    await reqIndexBtn.click({ force: true });
    console.log('Waiting for indexing request modal dialog (25s)...');
    await page.waitForTimeout(25000);
    await page.screenshot({ path: path.join(scDir, 'homepage-indexing-requested.png') });
    console.log('[+] Indexing request screenshot saved.');
  } else {
    console.log('Request indexing button not visible, saving current inspection screenshot...');
    await page.screenshot({ path: path.join(scDir, 'homepage-inspection.png') });
  }

  console.log('Closing browser...');
  await context.close();
  console.log('Search Console operations completed.');
}

main().catch(err => {
  console.error('Fatal in submit-search-console:', err);
  process.exit(1);
});
