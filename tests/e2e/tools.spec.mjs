import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const SCREENSHOTS_DIR = 'preview/screenshots';
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

test.describe('Shift & Tip Tools E2E Suite', () => {
  let consoleErrors = [];

  test.beforeEach(async ({ page }) => {
    consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => {
      consoleErrors.push(err.message);
    });
  });

  test('All 7 tools render default engine values without console errors', async ({ page }, testInfo) => {
    const isMobile = testInfo.project.name === 'mobile';
    await page.goto('/preview/index.html');
    await page.waitForSelector('[data-tool="tips-ot-deduction"] [data-result]');

    // Verify no console errors
    expect(consoleErrors).toEqual([]);

    // 1. Tip Pool
    const tp = page.locator('[data-tool="tip-pool"]');
    await tp.scrollIntoViewIfNeeded();
    await expect(tp).toBeVisible();
    await expect(tp.locator('.receipt')).toContainText('$213.11');
    await expect(tp.locator('.receipt')).toContainText('$229.51');
    await expect(tp.locator('.receipt')).toContainText('$262.30');
    await expect(tp.locator('.receipt')).toContainText('$163.93');
    await expect(tp.locator('.receipt')).toContainText('$131.15');
    await expect(tp.locator('.receipt__check')).toContainText('Allocated $1,240.00 of $1,240.00');

    // 2. Tip-Out
    const tipout = page.locator('[data-tool="tip-out"]');
    await tipout.scrollIntoViewIfNeeded();
    await expect(tipout).toBeVisible();
    await expect(tipout.locator('.receipt__total')).toContainText('$180.00');

    // 3. Overtime (CA rules)
    const ot = page.locator('[data-tool="overtime"]');
    await ot.scrollIntoViewIfNeeded();
    await expect(ot).toBeVisible();
    await expect(ot.locator('.receipt__total')).toContainText('$1,030.00');
    await expect(ot.locator('.receipt__compare')).toContainText('$1,025.00');

    // 4. Shift Differential
    const sd = page.locator('[data-tool="shift-differential"]');
    await sd.scrollIntoViewIfNeeded();
    await expect(sd).toBeVisible();
    await expect(sd.locator('.receipt__total')).toContainText('$997.50');

    // 5. Tipped Overtime (Federal rules)
    const tot = page.locator('[data-tool="tipped-overtime"]');
    await tot.scrollIntoViewIfNeeded();
    await expect(tot).toBeVisible();
    await expect(tot.locator('.receipt__total')).toContainText('$113.98');

    // 6. Take-Home
    const th = page.locator('[data-tool="take-home"]');
    await th.scrollIntoViewIfNeeded();
    await expect(th).toBeVisible();
    await expect(th.locator('.receipt__total')).toContainText('$1,175.25');

    // 7. Tips & OT Deduction
    const ded = page.locator('[data-tool="tips-ot-deduction"]');
    await ded.scrollIntoViewIfNeeded();
    await expect(ded).toBeVisible();
    await expect(ded.locator('.receipt__total')).toContainText('$22,000.00');

    // Save screenshots for each tool
    const proj = testInfo.project.name;
    await tp.screenshot({ path: path.join(SCREENSHOTS_DIR, `${proj}-1-tip-pool.png`) });
    await tipout.screenshot({ path: path.join(SCREENSHOTS_DIR, `${proj}-2-tip-out.png`) });
    await ot.screenshot({ path: path.join(SCREENSHOTS_DIR, `${proj}-3-overtime.png`) });
    await sd.screenshot({ path: path.join(SCREENSHOTS_DIR, `${proj}-4-shift-differential.png`) });
    await tot.screenshot({ path: path.join(SCREENSHOTS_DIR, `${proj}-5-tipped-overtime.png`) });
    await th.screenshot({ path: path.join(SCREENSHOTS_DIR, `${proj}-6-take-home.png`) });
    await ded.screenshot({ path: path.join(SCREENSHOTS_DIR, `${proj}-7-tips-ot-deduction.png`) });
  });

  test('Editing input updates result within 500 ms', async ({ page }) => {
    await page.goto('/preview/index.html');
    const tot = page.locator('[data-tool="tipped-overtime"]');
    const hoursInput = tot.locator('input[name="hours"]');
    await hoursInput.fill('40');

    const start = Date.now();
    await expect(tot.locator('.receipt__total')).toContainText('$85.20');
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(500);
  });

  test('Share link round-trips correctly', async ({ page, context }) => {
    await page.goto('/preview/index.html');
    const ot = page.locator('[data-tool="overtime"]');
    await ot.locator('input[name="rate"]').fill('25');
    // Click copy link button
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await ot.locator('button[data-act="copy"]').click();

    // Check hash update
    const url = page.url();
    expect(url).toContain('#ot=');

    // Reload with the shared URL
    await page.goto(url);
    await expect(page.locator('[data-tool="overtime"] input[name="rate"]')).toHaveValue('25');
  });

  test('Tip pool preset survives reload', async ({ page }) => {
    await page.goto('/preview/index.html');
    const tp = page.locator('[data-tool="tip-pool"]');
    await tp.locator('input[name="pname"]').fill('Weekend Shift Test');
    await tp.locator('button[data-act="save"]').click();
    await page.waitForTimeout(1000);

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Preset dropdown should have option
    const loadSelect = page.locator('[data-tool="tip-pool"] select[data-act="load"]');
    await expect(loadSelect).toBeVisible();
    await expect(loadSelect).toContainText('Weekend Shift Test');
  });

  test('Tip pool CSV download fires', async ({ page }) => {
    await page.goto('/preview/index.html');
    const tp = page.locator('[data-tool="tip-pool"]');
    const downloadPromise = page.waitForEvent('download');
    await tp.locator('button[data-act="csv"]').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('tip-pool.csv');
  });

  test('Every input has an accessible label', async ({ page }) => {
    await page.goto('/preview/index.html');
    const inputs = await page.locator('main input, main select, main textarea').all();
    expect(inputs.length).toBeGreaterThan(15);

    for (const input of inputs) {
      const isAccessible = await input.evaluate((el) => {
        // Has aria-label or aria-labelledby
        if (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby')) return true;
        // Has associated label via for=id
        if (el.id && document.querySelector(`label[for="${el.id}"]`)) return true;
        // Wrapped in label
        if (el.closest('label')) return true;
        return false;
      });
      expect(isAccessible).toBe(true);
    }
  });

  test('No horizontal overflow on mobile', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'mobile') return;
    await page.goto('/preview/index.html');
    await page.waitForLoadState('networkidle');

    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasOverflow).toBe(false);
  });

  test('Print media hides .ad, .topbar, and .footer', async ({ page }) => {
    await page.goto('/preview/index.html');
    await page.emulateMedia({ media: 'print' });

    const topbarDisplay = await page.locator('.topbar').evaluate((el) => window.getComputedStyle(el).display);
    const footerDisplay = await page.locator('.footer').evaluate((el) => window.getComputedStyle(el).display);
    const adDisplay = await page.locator('.ad').evaluate((el) => window.getComputedStyle(el).display);

    expect(topbarDisplay).toBe('none');
    expect(footerDisplay).toBe('none');
    expect(adDisplay).toBe('none');
  });
});
