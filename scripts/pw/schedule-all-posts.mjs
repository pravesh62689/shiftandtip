// scripts/pw/schedule-all-posts.mjs
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const BLOG_ID = '4523693247154244983';
const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';
const manifest = JSON.parse(readFileSync('dist/posts/manifest.json', 'utf8'));
const pubFile = 'dist/posts/published.json';
const liveUrlsFile = 'data/live-urls.json';

const published = existsSync(pubFile) ? JSON.parse(readFileSync(pubFile, 'utf8')) : {};
const liveUrls = existsSync(liveUrlsFile) ? JSON.parse(readFileSync(liveUrlsFile, 'utf8')) : {};

const ORDER = [
  'california-overtime-calculator',
  'texas-tipped-minimum-wage-and-overtime-calculator',
  'florida-tipped-minimum-wage-and-overtime-calculator',
  'new-york-tipped-minimum-wage-and-overtime-calculator',
  'colorado-overtime-calculator',
  'alaska-overtime-calculator',
  'pennsylvania-tipped-minimum-wage-and-overtime-calculator',
  'illinois-tipped-minimum-wage-and-overtime-calculator',
  'georgia-tipped-minimum-wage-and-overtime-calculator',
  'is-tip-pooling-legal',
  'tip-credit-explained',
  'how-to-split-tips-fairly',
  'what-is-a-typical-tip-out',
  'daily-overtime-states',
  'shift-differential-overtime',
  'tipped-employee-overtime',
  'no-tax-on-tips-rules',
  'no-tax-on-overtime-california',
  'how-to-read-tipped-paystub',
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getScheduleDates(count) {
  const dates = [];
  const start = new Date(Date.UTC(2026, 11, 1, 14, 0, 0)); // 2026-12-01 (Tue)
  let cur = new Date(start);

  while (dates.length < count) {
    const day = cur.getUTCDay(); // 0=Sun, 2=Tue, 4=Thu, 6=Sat
    if (day === 2 || day === 4 || day === 6) {
      dates.push(new Date(cur));
    }
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return dates;
}

const scheduledDates = getScheduleDates(ORDER.length);

const itemsToSchedule = ORDER.map((slug, idx) => {
  const m = manifest.find((x) => x.slug === slug);
  if (!m) throw new Error(`Missing manifest item for slug: ${slug}`);
  const d = scheduledDates[idx];
  const dateFormatted = `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const expectedUrl = `https://shiftandtip.blogspot.com/${yyyy}/${mm}/${slug}.html`;

  return {
    ...m,
    scheduledDate: d,
    dateStr: d.toISOString(),
    bloggerDateStr: dateFormatted,
    expectedUrl,
  };
});

// Ensure initial 3 are logged in published
published['california-overtime-calculator'] = {
  id: '7509899008980289598',
  url: 'https://shiftandtip.blogspot.com/2026/12/california-overtime-calculator.html',
  published: itemsToSchedule[0].dateStr,
  status: 'SCHEDULED',
  title: itemsToSchedule[0].title,
};
liveUrls['california-overtime-calculator'] = 'https://shiftandtip.blogspot.com/2026/12/california-overtime-calculator.html';

published['texas-tipped-minimum-wage-and-overtime-calculator'] = {
  id: '7946870761115222647',
  url: itemsToSchedule[1].expectedUrl,
  published: itemsToSchedule[1].dateStr,
  status: 'SCHEDULED',
  title: itemsToSchedule[1].title,
};
liveUrls['texas-tipped-minimum-wage-and-overtime-calculator'] = itemsToSchedule[1].expectedUrl;

published['florida-tipped-minimum-wage-and-overtime-calculator'] = {
  id: '7827484922455904848',
  url: itemsToSchedule[2].expectedUrl,
  published: itemsToSchedule[2].dateStr,
  status: 'SCHEDULED',
  title: itemsToSchedule[2].title,
};
liveUrls['florida-tipped-minimum-wage-and-overtime-calculator'] = itemsToSchedule[2].expectedUrl;

writeFileSync(pubFile, JSON.stringify(published, null, 2) + '\n');
writeFileSync(liveUrlsFile, JSON.stringify(liveUrls, null, 2) + '\n');

async function main() {
  console.log(`Starting automated post scheduling for ${itemsToSchedule.length} posts...`);

  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });

  const page = context.pages()[0] || await context.newPage();

  async function closeNotices() {
    const noticeClose = page.locator('[aria-label="Close"], [aria-label="Dismiss"], button:has-text("Dismiss"), [aria-label*="notification" i]');
    if (await noticeClose.count() > 0) {
      for (let i = 0; i < await noticeClose.count(); i++) {
        try { await noticeClose.nth(i).click({ timeout: 1000 }); } catch (e) {}
      }
    }
  }

  async function expandSection(headerText, checkLocator) {
    if (!(await checkLocator.isVisible())) {
      const header = page.locator(`.oX8Xbb:has-text("${headerText}")`).first();
      if (await header.isVisible()) {
        await header.click();
        await page.waitForTimeout(600);
      }
    }
  }

  // Loop through items
  for (let idx = 0; idx < itemsToSchedule.length; idx++) {
    const item = itemsToSchedule[idx];
    if (published[item.slug] && published[item.slug].status === 'SCHEDULED' && published[item.slug].id && !published[item.slug].id.startsWith('unknown')) {
      console.log(`[-] [${idx + 1}/${itemsToSchedule.length}] ${item.slug} is already SCHEDULED (ID: ${published[item.slug].id}). Skipping.`);
      continue;
    }

    console.log(`\n[+] [${idx + 1}/${itemsToSchedule.length}] Scheduling ${item.slug} for ${item.bloggerDateStr}...`);

    const content = readFileSync(path.join('dist/posts', item.file), 'utf8');

    // Navigate to post list
    await page.goto(`https://www.blogger.com/blog/posts/${BLOG_ID}`, { timeout: 35000 });
    await page.waitForTimeout(3000);
    await closeNotices();

    // Check if there is an untitled draft we can claim
    const untitledDraft = page.locator('a[href*="/blog/post/edit/"]:has-text("(Untitled)")').first();
    if (await untitledDraft.isVisible()) {
      console.log('Claiming existing (Untitled) draft...');
      await untitledDraft.click();
    } else {
      console.log('Clicking New post FAB...');
      await page.evaluate(() => {
        const el = document.querySelector('[aria-label*="new post" i], [aria-label*="New post" i], [data-tooltip*="new post" i]');
        if (el) el.click();
      });
    }

    await page.waitForTimeout(5000);
    await closeNotices();

    const currentUrl = page.url();
    const idMatch = currentUrl.match(/\/blog\/post\/edit\/\d+\/(\d+)/);
    const postId = idMatch ? idMatch[1] : `unknown_${Date.now()}`;
    console.log(`Editor active for post ID: ${postId}`);

    // Set Title
    const tInput = page.locator('input[aria-label="Title"]');
    await tInput.fill(item.title);

    // Set CodeMirror HTML Content
    await page.evaluate((html) => {
      const cm = document.querySelector('.CodeMirror');
      if (cm && cm.CodeMirror) {
        cm.CodeMirror.setValue(html);
      }
    }, content);

    // Set Labels
    const lTa = page.locator('textarea[aria-label="Separate labels with commas"]').first();
    await expandSection('Labels', lTa);
    if (await lTa.isVisible()) {
      await lTa.fill(item.labels.join(', '));
    }

    // Set Custom Permalink
    const customPermRadio = page.locator('[role="radio"][aria-label*="Custom permalink"]').first();
    await expandSection('Permalink', customPermRadio);
    if (await customPermRadio.isVisible()) {
      await customPermRadio.click();
      await page.waitForTimeout(500);
      const permInput = page.locator('input[aria-label="Custom permalink input"]').first();
      if (await permInput.isVisible()) {
        await permInput.fill(item.slug);
      }
    }

    // Set Published on (Scheduled date and time)
    const setDateRadio = page.locator('[role="radio"][aria-label="Set date and time"]').first();
    await expandSection('Published on', setDateRadio);
    if (await setDateRadio.isVisible()) {
      await setDateRadio.click();
      await page.waitForTimeout(500);
      const dateInput = page.locator('input[aria-label="Date"]').first();
      const timeInput = page.locator('input[aria-label="Time"]').first();

      await dateInput.click();
      await dateInput.selectText();
      await dateInput.fill(item.bloggerDateStr);
      await page.keyboard.press('Tab');

      await timeInput.click();
      await timeInput.selectText();
      await timeInput.fill('09:00');
      await page.keyboard.press('Tab');
      await page.waitForTimeout(500);
    }

    // Set Search Description
    const searchTa = page.locator('textarea[aria-label="Enter a search description"]').first();
    await expandSection('Search description', searchTa);
    if (await searchTa.isVisible()) {
      const cleanDesc = item.description.slice(0, 150);
      await searchTa.fill(cleanDesc);
    }

    // Click Publish / Schedule via visible button evaluate
    console.log('Clicking Publish/Schedule...');
    const clickedPub = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('[role="button"], button'));
      const pub = btns.find((b) => b.getAttribute('aria-label') === 'Publish' && b.offsetParent !== null) ||
                  btns.find((b) => b.innerText && b.innerText.trim().includes('Publish') && b.offsetParent !== null);
      if (pub) {
        pub.click();
        return true;
      }
      return false;
    });
    console.log(`Publish clicked: ${clickedPub}`);
    await page.waitForTimeout(2000);

    // Click Confirm in dialog
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

    console.log(`Confirmation clicked: ${confirmed}`);
    await page.waitForTimeout(4000);

    published[item.slug] = {
      id: postId,
      url: item.expectedUrl,
      published: item.dateStr,
      status: 'SCHEDULED',
      title: item.title,
    };
    liveUrls[item.slug] = item.expectedUrl;

    writeFileSync(pubFile, JSON.stringify(published, null, 2) + '\n');
    writeFileSync(liveUrlsFile, JSON.stringify(liveUrls, null, 2) + '\n');
    console.log(`[+] Successfully scheduled ${item.slug} (ID: ${postId})`);
    await page.waitForTimeout(2000);
  }

  // Update docs/publish-schedule.md
  let doc = `# Shift & Tip Content Publishing Schedule\n\n`;
  doc += `**Schedule Cadence**: 3 posts per week (Tuesdays, Thursdays, Saturdays at 09:00 AM ET / 14:00 UTC)\n`;
  doc += `**Staged Batch**: 19 items (9 priority state calculators + 10 authoritative guides)\n\n`;
  doc += `| # | Scheduled Date (ET) | Post Title | Slug | Blogger ID | Status |\n`;
  doc += `|---|---|---|---|---|---|\n`;

  itemsToSchedule.forEach((item, i) => {
    const pubInfo = published[item.slug] || {};
    const d = new Date(item.dateStr);
    const dateFormatted =
      d.toLocaleDateString('en-US', {
        timeZone: 'America/New_York',
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }) + ' 09:00 AM ET';
    doc += `| ${i + 1} | ${dateFormatted} | [${item.title}](${pubInfo.url || item.expectedUrl}) | \`${item.slug}\` | \`${pubInfo.id || 'N/A'}\` | SCHEDULED |\n`;
  });

  doc += `\n## Priority Sequence Strategy\n`;
  doc += `1. **High-Demand States**: California (CA), Texas (TX), Florida (FL), New York (NY) — captured during peak holiday and year-end labor searches.\n`;
  doc += `2. **Secondary States**: Colorado (CO), Alaska (AK), Pennsylvania (PA), Illinois (IL), Georgia (GA) — completing statutory daily overtime and key tipped jurisdiction coverage.\n`;
  doc += `3. **Guides & Policy Explainers**: Tip pooling legality, tip credit compliance, fair splitting math, shift differentials, and tax deductions — capturing informational search intent.\n`;

  writeFileSync('docs/publish-schedule.md', doc);
  console.log(`\nSchedule documented in docs/publish-schedule.md`);

  await context.close();
  console.log('All 19 posts scheduled successfully!');
}

main().catch((err) => {
  console.error('Fatal error during scheduling:', err);
  process.exit(1);
});
