import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = 'F:\\shiftandtip';
const profileDir = path.join(rootDir, '.pw-profile');
const downloadsDir = 'C:\\Users\\prave\\Downloads';
const backupsDir = path.join(rootDir, 'backups');
const reportsLiveDir = path.join(rootDir, 'reports', 'live');

[backupsDir, reportsLiveDir, downloadsDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

async function run() {
  console.log('Launching Chrome with persistent profile at:', profileDir);
  const context = await chromium.launchPersistentContext(profileDir, {
    headless: false,
    channel: 'chrome',
    viewport: { width: 1280, height: 800 },
    acceptDownloads: true,
  });

  const page = context.pages()[0] || await context.newPage();

  console.log('Navigating to Blogger theme settings (/u/4/)...');
  await page.goto('https://www.blogger.com/u/4/blog/themes/4523693247154244983', {
    waitUntil: 'networkidle',
    timeout: 30000,
  }).catch(e => console.log('Navigation note:', e.message));

  const currentUrl = page.url();
  console.log('Current URL:', currentUrl);

  if (currentUrl.includes('accounts.google.com') || currentUrl.includes('signin')) {
    console.log('LOGIN_REQUIRED: Google login is required.');
    console.log('USER_ACTION_REQUIRED: Please log into Google account (rathore.pravesh2002@gmail.com).');
    // Keep browser open and exit with code 42 to signal waiting for user login
    process.exit(42);
  }

  // Verify we are on the Blogger theme page
  await page.waitForTimeout(2000);
  const title = await page.title();
  console.log('Page title:', title);

  // Look for the dropdown menu next to Customize button
  // Typically button with aria-haspopup="menu" or three dots or arrow
  const customizeBtn = page.locator('text=Customize');
  await customizeBtn.waitFor({ state: 'visible', timeout: 15000 });
  console.log('Found Customize button');

  // Find the menu trigger button next to Customize
  // Blogger usually has: button with icon or dropdown next to Customize
  const menuBtn = page.locator('button[aria-label*="Customize"], button[aria-label*="options"], div[role="button"][aria-label*="options"], button:has-text("▾"), [data-action-id="backup"]').first();
  
  // Let's inspect available buttons in the theme actions bar
  const actionButtons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, div[role="button"], a[role="button"]')).map(el => ({
      text: el.innerText.trim(),
      ariaLabel: el.getAttribute('aria-label'),
      role: el.getAttribute('role'),
      classes: el.className,
      rect: el.getBoundingClientRect(),
    })).filter(b => b.rect.width > 0 && b.rect.height > 0);
  });
  console.log('Visible buttons on theme page:', JSON.stringify(actionButtons.filter(b => b.text.includes('Customize') || b.ariaLabel || b.classes.includes('menu')), null, 2));

  // Let's close context for inspection
  await context.close();
}

run().catch(err => {
  console.error('Error in manage-theme:', err);
  process.exit(1);
});
