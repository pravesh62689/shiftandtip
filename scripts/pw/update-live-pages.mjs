// scripts/pw/update-live-pages.mjs
import { chromium } from 'playwright';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const BLOG_ID = '4523693247154244983';
const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';
const published = JSON.parse(readFileSync('dist/posts/published.json', 'utf8'));

const pagesToUpdate = [
  'tip-tools',
  'overtime-tools',
  'shift-pay-tools',
  'guides',
  'state-pay-rules',
  'about',
  'methodology',
  'privacy',
  'terms',
  'contact',
  'corrections',
];

async function main() {
  console.log(`Updating ${pagesToUpdate.length} static pages on Blogger...`);
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });

  const page = context.pages()[0] || await context.newPage();

  async function closeNotices() {
    const noticeClose = page.locator('[aria-label="Close"], [aria-label="Dismiss"], button:has-text("Dismiss")');
    if (await noticeClose.count() > 0) {
      for (let i = 0; i < await noticeClose.count(); i++) {
        try { await noticeClose.nth(i).click({ timeout: 1000 }); } catch (e) {}
      }
    }
  }

  for (let i = 0; i < pagesToUpdate.length; i++) {
    const slug = pagesToUpdate[i];
    const info = published[slug];
    if (!info) {
      console.log(`[-] ${slug}: No published info, skipping`);
      continue;
    }
    const pageId = typeof info === 'object' ? info.id : info;
    const contentFile = path.join('dist/posts', `${slug}.html`);
    if (!existsSync(contentFile)) {
      console.log(`[-] ${slug}: ${contentFile} not found, skipping`);
      continue;
    }
    const content = readFileSync(contentFile, 'utf8');

    console.log(`\n[${i + 1}/${pagesToUpdate.length}] Updating ${slug} (Page ID: ${pageId})...`);
    await page.goto(`https://www.blogger.com/blog/page/edit/${BLOG_ID}/${pageId}`, { timeout: 35000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await closeNotices();

    // Set CodeMirror content
    await page.evaluate((html) => {
      const cm = document.querySelector('.CodeMirror');
      if (cm && cm.CodeMirror) {
        cm.CodeMirror.setValue(html);
      }
    }, content);

    // Click Update
    console.log(`Clicking Update for ${slug}...`);
    const updated = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('[role="button"], button'));
      const updateBtn = btns.find((b) => /update/i.test(b.innerText) && b.offsetParent !== null) ||
                        btns.find((b) => /update/i.test(b.getAttribute('aria-label')) && b.offsetParent !== null);
      if (updateBtn) {
        updateBtn.click();
        return true;
      }
      return false;
    });

    console.log(`Update clicked: ${updated}`);
    await page.waitForTimeout(2500);
  }

  await context.close();
  console.log('All static pages updated successfully on Blogger!');
}

main().catch(console.error);
