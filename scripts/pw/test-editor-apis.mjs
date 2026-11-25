// scripts/pw/test-editor-apis.mjs
import { chromium } from 'playwright';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';

async function main() {
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });

  const page = context.pages()[0] || await context.newPage();
  console.log('Navigating directly to California post editor...');
  await page.goto('https://www.blogger.com/blog/post/edit/4523693247154244983/7509899008980289598', { timeout: 35000 });
  await page.waitForTimeout(5000);

  const testResults = await page.evaluate(() => {
    const cm = document.querySelector('.CodeMirror');
    const cmVal = cm && cm.CodeMirror ? cm.CodeMirror.getValue().slice(0, 100) : null;
    const titleInput = document.querySelector('input[aria-label="Title"]');
    const titleVal = titleInput ? titleInput.value : null;

    // Check right sidebar sections
    const accordionButtons = Array.from(document.querySelectorAll('[role="button"]'))
      .map(b => b.innerText ? b.innerText.trim() : '')
      .filter(t => t.length > 0 && t.length < 35);

    return {
      hasCodeMirror: !!(cm && cm.CodeMirror),
      cmValPreview: cmVal,
      hasTitleInput: !!titleInput,
      titleVal,
      accordionButtons: accordionButtons.slice(0, 30)
    };
  });

  console.log('Test Results:', JSON.stringify(testResults, null, 2));

  // Check search description
  const searchDescBtn = page.locator('[role="button"]:has-text("Search description")').first();
  console.log('Search desc button count:', await searchDescBtn.count());
  if (await searchDescBtn.count() > 0) {
    await searchDescBtn.click();
    await page.waitForTimeout(1000);
    const ta = page.locator('textarea[aria-label="Enter a search description"]');
    console.log('Search desc textarea visible:', await ta.isVisible());
    if (await ta.isVisible()) {
      console.log('Search desc current value:', await ta.inputValue());
    }
  }

  // Check Publish/Schedule button
  const publishBtn = page.locator('[role="button"][aria-label*="Publish" i], [role="button"]:has-text("Publish"), [role="button"]:has-text("Schedule"), [role="button"][aria-label*="Schedule" i]');
  console.log('Publish/Schedule button count:', await publishBtn.count());
  for (let i = 0; i < await publishBtn.count(); i++) {
    const b = publishBtn.nth(i);
    console.log(`Button ${i}: text="${await b.innerText()}", aria-label="${await b.getAttribute('aria-label')}"`);
  }

  await context.close();
}

main().catch(console.error);
