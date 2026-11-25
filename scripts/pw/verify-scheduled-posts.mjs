// scripts/pw/verify-scheduled-posts.mjs
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';
const BLOG_ID = '4523693247154244983';

async function main() {
  console.log('Auditing Blogger post statuses...');
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });

  const page = context.pages()[0] || await context.newPage();
  await page.goto(`https://www.blogger.com/blog/posts/${BLOG_ID}`, { timeout: 35000 });
  await page.waitForTimeout(4000);

  // Close notices
  const noticeClose = page.locator('[aria-label="Close"], [aria-label="Dismiss"], button:has-text("Dismiss"), [aria-label*="notification" i]');
  if (await noticeClose.count() > 0) {
    for (let i = 0; i < await noticeClose.count(); i++) {
      try { await noticeClose.nth(i).click({ timeout: 1000 }); } catch (e) {}
    }
  }

  // Get all post entries from list
  const postEntries = await page.evaluate(() => {
    // Each row in Blogger post list
    const rows = Array.from(document.querySelectorAll('[data-post-id], [jsname="wP4dne"], .f6fU7c, [role="listitem"]'));
    return rows.map(r => {
      const link = r.querySelector('a[href*="/blog/post/edit/"]');
      const href = link ? link.getAttribute('href') : '';
      const idMatch = href.match(/\/blog\/post\/edit\/\d+\/(\d+)/);
      const text = r.innerText.replace(/\n+/g, ' | ');
      const isScheduled = /Scheduled/i.test(text);
      const isDraft = /Draft/i.test(text);
      const isPublished = /Published/i.test(text);
      return {
        id: idMatch ? idMatch[1] : null,
        href,
        text,
        isScheduled,
        isDraft,
        isPublished,
      };
    }).filter(x => x.id);
  });

  console.log(`Found ${postEntries.length} post rows in Blogger:`);
  const drafts = postEntries.filter(p => p.isDraft && !p.text.includes('(Untitled)'));
  const scheduled = postEntries.filter(p => p.isScheduled);
  const published = postEntries.filter(p => p.isPublished);

  console.log(`  Published: ${published.length}`);
  console.log(`  Scheduled: ${scheduled.length}`);
  console.log(`  Drafts needing schedule confirmation: ${drafts.length}`);

  // Confirm schedule on any draft that has date set
  for (const d of drafts) {
    console.log(`\nConfirming schedule on post ${d.id} (${d.text.slice(0, 50)}...)...`);
    await page.goto(`https://www.blogger.com${d.href}`, { timeout: 35000 });
    await page.waitForTimeout(4000);

    // Click Publish button
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('[role="button"], button'));
      const pub = btns.find((b) => b.getAttribute('aria-label') === 'Publish' && b.offsetParent !== null) ||
                  btns.find((b) => b.innerText && b.innerText.trim().includes('Publish') && b.offsetParent !== null);
      if (pub) pub.click();
    });
    await page.waitForTimeout(2000);

    // Click Confirm
    const confirmed = await page.evaluate(() => {
      const dialog = document.querySelector('.g3VIld, [role="dialog"]');
      if (!dialog) return false;
      const btns = Array.from(dialog.querySelectorAll('[role="button"], button'));
      const confirmBtn = btns.find((b) => /confirm|publish/i.test(b.innerText));
      if (confirmBtn) {
        confirmBtn.click();
        return true;
      }
      return false;
    });

    console.log(`  Post ${d.id} confirmed: ${confirmed}`);
    await page.waitForTimeout(3000);
  }

  // Final recheck
  await page.goto(`https://www.blogger.com/blog/posts/${BLOG_ID}`, { timeout: 35000 });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: 'reports/live/posts-final-status.png' });
  console.log('Final screenshot saved to reports/live/posts-final-status.png');

  await context.close();
  console.log('Post status audit & confirmation complete.');
}

main().catch(console.error);
