import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BLOG_ID = process.env.BLOG_ID || '4523693247154244983';
const profileDir = process.env.PW_PROFILE_DIR || 'C:\\Users\\prave\\.shiftandtip-pw-profile';
const published = JSON.parse(fs.readFileSync('dist/posts/published.json', 'utf8'));
const draftsDir = 'reports/drafts';
const reportFile = 'reports/draft-qa.md';

if (!fs.existsSync(draftsDir)) {
  fs.mkdirSync(draftsDir, { recursive: true });
}

// Expected calculations for tools
const EXPECTED_CHECKS = {
  'tip-pool-calculator': ['$213.11'],
  'tip-out-calculator': ['$180.00'],
  'overtime-and-double-time-calculator': ['$1,030.00'],
  'shift-differential-calculator': ['$997.50'],
  'tipped-overtime-calculator': ['$113.98'],
  'take-home-pay-with-tips-calculator': ['$1,175.25'],
  'no-tax-on-tips-and-overtime-deduction-estimator': ['$22,000.00'],
};

async function main() {
  console.log('Launching Playwright Chrome with profile:', profileDir);
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1280, height: 900 },
  });

  const editorPage = context.pages()[0] || await context.newPage();
  const results = [];

  const items = Object.entries(published);
  console.log(`Starting Draft QA for ${items.length} items...`);

  for (const [slug, info] of items) {
    const id = typeof info === 'object' ? info.id : info;
    const isPage = typeof info === 'object' ? info.isPage : false;
    const editUrl = isPage
      ? `https://www.blogger.com/blog/page/edit/${BLOG_ID}/${id}`
      : `https://www.blogger.com/blog/post/edit/${BLOG_ID}/${id}`;

    console.log(`\n[QA] ${slug} (${isPage ? 'PAGE' : 'POST'} ${id})...`);
    await editorPage.goto(editUrl, { timeout: 45000, waitUntil: 'domcontentloaded' });
    await editorPage.waitForTimeout(3000);

    const previewBtn = editorPage.locator('[aria-label="Preview post"], [aria-label="Preview page"], [aria-label="Preview"], div[role="button"]:has-text("Preview")').first();
    if (await previewBtn.count() === 0) {
      console.error(`  [!] Preview button not found for ${slug}`);
      results.push({ slug, isPage, status: 'FAIL', reason: 'No preview button' });
      continue;
    }

    console.log('  Opening preview in new tab...');
    const [previewTab] = await Promise.all([
      context.waitForEvent('page', { timeout: 30000 }),
      previewBtn.click()
    ]);

    const pageErrors = [];
    previewTab.on('console', msg => {
      if (msg.type() === 'error') {
        const txt = msg.text();
        if (!/favicon|google-analytics|doubleclick|googletag/i.test(txt)) {
          pageErrors.push(txt);
        }
      }
    });
    previewTab.on('pageerror', err => {
      pageErrors.push(err.message);
    });

    await previewTab.waitForLoadState('domcontentloaded');
    await previewTab.waitForTimeout(4000);

    // Locate previewFrame iframe
    let frame = previewTab.frame('previewFrame') || previewTab.frames().find(f => f.url().includes('blog-preview'));
    if (!frame) {
      // Wait up to 5s for frame
      await previewTab.waitForTimeout(3000);
      frame = previewTab.frame('previewFrame') || previewTab.frames().find(f => f.url().includes('blog-preview'));
    }

    // Set mobile viewport 390px on preview tab
    await previewTab.setViewportSize({ width: 390, height: 844 });
    await previewTab.waitForTimeout(1500);

    // Check calculations if it is a tool
    let calcOk = true;
    let calcMsg = 'N/A (Page)';
    const expected = EXPECTED_CHECKS[slug];
    if (expected) {
      const frameContent = frame ? await frame.content() : await previewTab.content();
      const missing = expected.filter(val => !frameContent.includes(val));
      if (missing.length === 0) {
        calcOk = true;
        calcMsg = `Passed (${expected.join(', ')})`;
        console.log(`  [+] Calculations verified in preview frame: ${expected.join(', ')}`);
      } else {
        calcOk = false;
        calcMsg = `FAILED: missing ${missing.join(', ')}`;
        console.error(`  [!] Calculation check failed: missing ${missing.join(', ')}`);
      }
    }

    // Check console errors
    const errorsOk = pageErrors.length === 0;
    if (!errorsOk) {
      console.warn(`  [!] Console errors (${pageErrors.length}):`, pageErrors);
    } else {
      console.log('  [+] 0 critical console errors');
    }

    // Save screenshot
    const shotPath = path.join(draftsDir, `${slug}.png`);
    await previewTab.screenshot({ path: shotPath, fullPage: false });
    console.log(`  [+] Screenshot saved to ${shotPath}`);

    const passed = calcOk && errorsOk;
    results.push({
      slug,
      isPage,
      status: passed ? 'PASS' : 'FAIL',
      calcMsg,
      errors: pageErrors.length,
      screenshot: shotPath
    });

    await previewTab.close();
    await editorPage.waitForTimeout(1000);
  }

  // Write report
  const reportLines = [
    '# Draft QA Report',
    `Date: ${new Date().toISOString()}`,
    `Total: ${results.length} | Passed: ${results.filter(r => r.status === 'PASS').length} | Failed: ${results.filter(r => r.status === 'FAIL').length}`,
    '',
    '| Slug | Type | Calculation Check | Console Errors | Viewport | Status |',
    '|---|---|---|---|---|---|',
    ...results.map(r => `| ${r.slug} | ${r.isPage ? 'PAGE' : 'POST'} | ${r.calcMsg} | ${r.errors} | 390x844 | ${r.status} |`)
  ];

  fs.writeFileSync(reportFile, reportLines.join('\n') + '\n');
  console.log(`\nReport written to ${reportFile}`);
  await context.close();
}

main().catch(err => {
  console.error('Fatal error in draft-qa:', err);
  process.exit(1);
});
