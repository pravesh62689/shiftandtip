import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');
const profileDir = process.env.PW_PROFILE_DIR || (process.platform === 'win32' && rootDir.startsWith('F:') ? 'C:\\Users\\prave\\.shiftandtip-pw-profile' : path.resolve(rootDir, '.pw-profile'));
const snapshotsDir = path.resolve(rootDir, 'data/raw/snapshots');

/**
 * launchPublic(): headless Chromium; on a 403 or empty result, retry once headed with channel "chrome".
 * Returns an enhanced session with browser, context, page, and a smart goto(url) method.
 */
export async function launchPublic() {
  let browser = await chromium.launch({ headless: true });
  let context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  let page = await context.newPage();

  async function goto(url, options = {}) {
    let resp = null;
    let text = '';
    let status = 0;
    try {
      resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000, ...options });
      status = resp ? resp.status() : 0;
      text = await page.evaluate(() => document.body ? document.body.innerText.trim() : '');
    } catch (e) {
      console.warn(`Initial headless navigation failed: ${e.message}`);
    }

    if (status === 403 || !text || text.length < 50) {
      console.log(`[launchPublic] 403 or empty result (status=${status}, text length=${text.length}). Retrying once headed with channel "chrome"...`);
      try { await browser.close(); } catch (e) {}
      browser = await chromium.launch({ headless: false, channel: 'chrome' });
      context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      page = await context.newPage();
      resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000, ...options });
    }
    return { resp, page };
  }

  async function close() {
    try { await browser.close(); } catch (e) {}
  }

  return { browser, context, page, goto, close };
}

/**
 * launchGoogle(): a persistent headed context at F:\shiftandtip\.pw-profile (add .pw-profile/ to .gitignore), channel "chrome".
 * On first use, open accounts.google.com, tell me to log in manually, and wait for me to press Enter in the terminal.
 * Don't type passwords or use any anti-detection flags.
 */
export async function launchGoogle() {
  if (!fs.existsSync(profileDir)) {
    fs.mkdirSync(profileDir, { recursive: true });
  }
  const loggedInMarker = path.join(profileDir, '.logged_in');
  const isFirstUse = !fs.existsSync(loggedInMarker);

  const context = await chromium.launchPersistentContext(profileDir, {
    headless: false,
    channel: 'chrome',
    viewport: { width: 1280, height: 800 },
  });

  const page = context.pages()[0] || await context.newPage();

  if (isFirstUse) {
    console.log('\n======================================================');
    console.log('FIRST USE: Opening accounts.google.com.');
    console.log('Please log into your Google account in the opened Chrome window.');
    console.log('Once you are logged in, press [ENTER] in this terminal to continue.');
    console.log('======================================================\n');
    await page.goto('https://accounts.google.com/');

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    await new Promise((resolve) => {
      rl.question('Press Enter after completing Google login: ', () => {
        rl.close();
        resolve();
      });
    });
    fs.writeFileSync(loggedInMarker, new Date().toISOString(), 'utf8');
  }

  return { context, page };
}

/**
 * snapshot(page, slug): saves data/raw/snapshots/<slug>-<YYYY-MM-DD>.html, .txt (document.body.innerText) and a full-page .png.
 */
export async function snapshot(page, slug) {
  if (!fs.existsSync(snapshotsDir)) {
    fs.mkdirSync(snapshotsDir, { recursive: true });
  }

  const today = new Date().toISOString().slice(0, 10);
  const baseName = `${slug}-${today}`;
  const htmlPath = path.join(snapshotsDir, `${baseName}.html`);
  const txtPath = path.join(snapshotsDir, `${baseName}.txt`);
  const pngPath = path.join(snapshotsDir, `${baseName}.png`);

  const html = await page.content();
  const text = await page.evaluate(() => document.body ? document.body.innerText : '');
  await page.screenshot({ path: pngPath, fullPage: true });

  fs.writeFileSync(htmlPath, html, 'utf8');
  fs.writeFileSync(txtPath, text, 'utf8');

  return {
    slug,
    date: today,
    retrievedAt: new Date().toISOString(),
    htmlPath,
    txtPath,
    pngPath,
    text,
    html,
  };
}
