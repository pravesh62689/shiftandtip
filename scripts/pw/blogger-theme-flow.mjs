import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = 'F:\\shiftandtip';
const profileDir = process.env.PW_PROFILE_DIR || 'C:\\Users\\prave\\.shiftandtip-pw-profile';
const downloadsDir = 'C:\\Users\\prave\\Downloads';
const backupsDir = path.join(rootDir, 'backups');
const reportsLiveDir = path.join(rootDir, 'reports', 'live');

[backupsDir, reportsLiveDir, downloadsDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

async function main() {
  console.log('1. Launching Chrome with persistent profile at:', profileDir);
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1280, height: 800 },
    acceptDownloads: true,
  });

  const page = context.pages()[0] || await context.newPage();

  console.log('2. Navigating to Blogger theme settings...');
  await page.goto('https://www.blogger.com/blog/themes/4523693247154244983', { timeout: 35000, waitUntil: 'commit' });
  await page.waitForTimeout(6000);
  console.log('Landed on URL:', page.url());
  console.log('Page Title:', await page.title());

  const dropdownBtn = page.locator('button:has-text("CUSTOMISE") ~ button, [role="button"]:has-text("CUSTOMISE") ~ [role="button"], button:has-text("CUSTOMIZE") ~ button, [role="button"]:has-text("CUSTOMIZE") ~ [role="button"]').first();
  await dropdownBtn.waitFor({ state: 'visible', timeout: 15000 });

  // 1. BACKUP
  console.log('3. Opening menu for Backup...');
  await dropdownBtn.click({ force: true });
  await page.waitForTimeout(1500);

  const backupItem = page.locator('[role="menuitem"]:has-text("Backup")').first();
  await backupItem.click({ force: true });
  await page.waitForTimeout(1500);

  const dateStr = new Date().toISOString().slice(0, 10);
  const backupFileProject = path.join(backupsDir, `theme-backup-${dateStr}.xml`);
  const backupFileDownloads = path.join(downloadsDir, `theme-backup-${dateStr}.xml`);

  console.log('4. Clicking Download button (data-id=EBS5u)...');
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 30000 }),
    page.locator('[data-id="EBS5u"]:visible').first().click({ force: true }),
  ]);

  const downloadedPath = await download.path();
  fs.copyFileSync(downloadedPath, backupFileProject);
  fs.copyFileSync(downloadedPath, backupFileDownloads);
  console.log(`Theme backed up successfully to:\n - ${backupFileProject}\n - ${backupFileDownloads}`);

  await page.waitForTimeout(3000);

  // 2. RESTORE
  console.log('5. Opening menu for Restore...');
  await dropdownBtn.click({ force: true });
  await page.waitForTimeout(1500);

  const restoreItem = page.locator('[role="menuitem"]:has-text("Restore")').first();
  await restoreItem.click({ force: true });
  await page.waitForTimeout(1500);

  console.log('6. Uploading dist/theme.xml via #restoreFileInput...');
  const themeXmlPath = path.resolve(rootDir, 'dist/theme.xml');

  await page.locator('#restoreFileInput').setInputFiles(themeXmlPath);
  console.log('Theme XML uploaded. Waiting for Blogger to restore...');

  // Wait 12 seconds for restoration
  await page.waitForTimeout(12000);

  const errorText = await page.evaluate(() => {
    const alerts = Array.from(document.querySelectorAll('[role="alert"], .error, div[class*="error"]'));
    return alerts.map(a => a.innerText.trim()).filter(Boolean).join(' | ');
  });

  if (errorText && errorText.toLowerCase().includes('error')) {
    console.error('Blogger theme error detected:', errorText);
    await page.screenshot({ path: path.join(rootDir, 'reports', 'theme-error.png') });
    throw new Error(`Theme upload error: ${errorText}`);
  }
  console.log('Theme restore completed without errors.');

  // 3. CHECK LIVE HOMEPAGE
  console.log('7. Navigating to live homepage: https://shiftandtip.blogspot.com...');
  await page.goto('https://shiftandtip.blogspot.com', { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(4000);

  const homeScreenshot = path.join(reportsLiveDir, 'home.png');
  await page.screenshot({ path: homeScreenshot, fullPage: true });
  console.log('Saved live homepage screenshot to:', homeScreenshot);

  const checkResults = await page.evaluate(() => {
    const bodyBg = window.getComputedStyle(document.body).backgroundColor;
    const header = document.querySelector('header, .site-header, .header');
    const contactForm = document.querySelector('#ContactForm1, .contact-form, [id*="ContactForm"]');
    return {
      bodyBg,
      hasHeader: !!header,
      hasContactForm: !!contactForm,
      title: document.title,
    };
  });
  console.log('Homepage verification results:', JSON.stringify(checkResults, null, 2));

  await page.waitForTimeout(2000);
  await context.close();
  console.log('THEME_PROCESS_COMPLETE');
}

main().catch(err => {
  console.error('Theme flow failed:', err);
  process.exit(1);
});
