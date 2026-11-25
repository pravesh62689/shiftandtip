import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BLOG_ID = process.env.BLOG_ID || '4523693247154244983';
const profileDir = process.env.PW_PROFILE_DIR || 'C:\\Users\\prave\\.shiftandtip-pw-profile';
const manifest = JSON.parse(fs.readFileSync('dist/posts/manifest.json', 'utf8'));
const published = JSON.parse(fs.readFileSync('dist/posts/published.json', 'utf8'));
const reportFile = 'reports/search-descriptions.md';

const descMap = new Map(manifest.map(m => [m.slug, m.description]));

async function main() {
  console.log('Launching Playwright Chrome with profile:', profileDir);
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1280, height: 900 },
  });

  const page = context.pages()[0] || await context.newPage();

  const items = Object.entries(published);
  console.log(`Processing ${items.length} items for Search Descriptions...`);
  const reportLines = [
    '# Search Descriptions Audit',
    `Date: ${new Date().toISOString()}`,
    '',
    '| Slug | Type | Description Length | Status | Description Preview |',
    '|---|---|---|---|---|'
  ];

  for (const [slug, info] of items) {
    const rawDesc = descMap.get(slug);
    if (!rawDesc) {
      console.log(`[-] ${slug}: No description in manifest, skipping`);
      reportLines.push(`| ${slug} | ? | 0 | Skipped (No desc) | |`);
      continue;
    }
    const targetDesc = rawDesc.slice(0, 150);

    const id = typeof info === 'object' ? info.id : info;
    const isPage = typeof info === 'object' ? info.isPage : false;
    const editUrl = isPage
      ? `https://www.blogger.com/blog/page/edit/${BLOG_ID}/${id}`
      : `https://www.blogger.com/blog/post/edit/${BLOG_ID}/${id}`;

    console.log(`\nNavigating to ${slug} (${isPage ? 'PAGE' : 'POST'} ${id})...`);
    await page.goto(editUrl, { timeout: 45000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Look for search description accordion button
    const btn = page.locator('[role="button"]:has-text("Search description")').first();
    if (await btn.count() === 0) {
      console.log(`  [!] ${slug}: [role="button"]:has-text("Search description") not found!`);
      reportLines.push(`| ${slug} | ${isPage ? 'PAGE' : 'POST'} | ${targetDesc.length} | Missing Accordion | ${targetDesc.slice(0, 30)}... |`);
      continue;
    }

    const ta = page.locator('textarea[aria-label="Enter a search description"]');
    if (!(await ta.isVisible())) {
      await btn.click();
      await page.waitForTimeout(1000);
    }

    if (await ta.count() === 0 || !(await ta.isVisible())) {
      console.log(`  [!] ${slug}: Textarea not visible!`);
      reportLines.push(`| ${slug} | ${isPage ? 'PAGE' : 'POST'} | ${targetDesc.length} | Textarea Hidden | ${targetDesc.slice(0, 30)}... |`);
      continue;
    }

    const currentVal = (await ta.inputValue()).trim();
    if (currentVal === targetDesc) {
      console.log(`  [=] ${slug}: Already set correctly (${targetDesc.length} chars)`);
      reportLines.push(`| ${slug} | ${isPage ? 'PAGE' : 'POST'} | ${targetDesc.length} | Verified Existing | ${targetDesc.slice(0, 30)}... |`);
      continue;
    }

    // Fill new value
    await ta.fill(targetDesc);
    await ta.dispatchEvent('input');
    await page.waitForTimeout(1000);

    // Save via More options
    const moreBtn = page.locator('[aria-label="More options"]').first();
    if (await moreBtn.isVisible()) {
      await moreBtn.click();
      await page.waitForTimeout(800);
      const saveMenuItem = page.locator('[role="menuitem"]:has-text("Save"), div:has-text("Save")').filter({ hasText: /^Save$/ }).first();
      if (await saveMenuItem.count() > 0) {
        await saveMenuItem.click();
        console.log(`  [+] ${slug}: Clicked Save menu item`);
        await page.waitForTimeout(2500);
      } else {
        await page.keyboard.press('Control+s');
        console.log(`  [+] ${slug}: Used Ctrl+S`);
        await page.waitForTimeout(2500);
      }
    } else {
      await page.keyboard.press('Control+s');
      console.log(`  [+] ${slug}: Used Ctrl+S (moreBtn not visible)`);
      await page.waitForTimeout(2500);
    }

    console.log(`  [+] ${slug}: Successfully updated search description (${targetDesc.length} chars)`);
    reportLines.push(`| ${slug} | ${isPage ? 'PAGE' : 'POST'} | ${targetDesc.length} | Updated & Saved | ${targetDesc.slice(0, 30)}... |`);
  }

  fs.writeFileSync(reportFile, reportLines.join('\n') + '\n');
  console.log(`\nReport written to ${reportFile}`);
  await context.close();
  console.log('All search descriptions completed.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
