import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = 'F:\\shiftandtip';
const profileDir = path.join(rootDir, '.pw-profile');
const markerFile = path.join(profileDir, '.logged_in');

async function main() {
  if (!fs.existsSync(profileDir)) {
    fs.mkdirSync(profileDir, { recursive: true });
  }

  console.log('Launching headed Chrome with persistent profile...');
  const context = await chromium.launchPersistentContext(profileDir, {
    headless: false,
    channel: 'chrome',
    viewport: { width: 1280, height: 800 },
  });

  const page = context.pages()[0] || await context.newPage();

  console.log('Navigating to Blogger (/u/4/)...');
  await page.goto('https://www.blogger.com/u/4/blog/themes/4523693247154244983', {
    waitUntil: 'domcontentloaded',
    timeout: 45000,
  });

  await page.waitForTimeout(3000);
  let url = page.url();
  console.log('Current URL:', url);

  if (url.includes('accounts.google.com') || url.includes('signin')) {
    console.log('AWAITING_USER_LOGIN: Please log in as rathore.pravesh2002@gmail.com in the opened Chrome window.');
    // Poll every 3 seconds for up to 5 minutes
    const startTime = Date.now();
    while (Date.now() - startTime < 300000) {
      await page.waitForTimeout(3000);
      try {
        url = page.url();
        if (url.includes('blogger.com') && !url.includes('signin') && !url.includes('accounts.google.com')) {
          console.log('LOGIN_SUCCESS: User logged in successfully. Reached:', url);
          fs.writeFileSync(markerFile, new Date().toISOString(), 'utf8');
          break;
        }
      } catch (e) {
        // Context might have been closed or page navigating
      }
    }
  } else if (url.includes('blogger.com')) {
    console.log('ALREADY_LOGGED_IN: Reached Blogger directly:', url);
    fs.writeFileSync(markerFile, new Date().toISOString(), 'utf8');
  }

  await page.waitForTimeout(2000);
  await context.close();
}

main().catch(err => {
  console.error('Login check error:', err);
  process.exit(1);
});
