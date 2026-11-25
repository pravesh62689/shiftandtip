// scripts/pw/inspect-content-editor.mjs
import { chromium } from 'playwright';

const profileDir = 'C:\\Users\\prave\\.shiftandtip-pw-profile';

async function main() {
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1400, height: 950 },
  });

  const page = context.pages()[0] || await context.newPage();
  console.log('Navigating directly to existing draft or creating one...');
  await page.goto('https://www.blogger.com/blog/posts/4523693247154244983', { timeout: 30000 });
  await page.waitForTimeout(3000);

  // Click on the draft we just created or FAB
  const draftLink = page.locator('a[href*="/blog/post/edit/"]').first();
  if (await draftLink.isVisible()) {
    console.log('Clicking top post link in list...');
    await draftLink.click();
  } else {
    console.log('Clicking FAB...');
    await page.evaluate(() => {
      const el = document.querySelector('[aria-label*="new post" i], [aria-label*="New post" i], [data-tooltip*="new post" i]');
      if (el) el.click();
    });
  }
  await page.waitForTimeout(5000);

  console.log('Editor URL:', page.url());

  // Check toolbar buttons
  const toolbarButtons = await page.evaluate(() => {
    const bar = document.querySelector('[role="toolbar"]') || document.querySelector('.mU5HHe') || document.body;
    return Array.from(bar.querySelectorAll('[role="button"], button')).map(b => ({
      ariaLabel: b.getAttribute('aria-label'),
      title: b.getAttribute('title'),
      text: b.innerText ? b.innerText.trim() : '',
      html: b.outerHTML.slice(0, 100)
    })).filter(x => x.ariaLabel || x.title || x.text);
  });

  console.log('Toolbar buttons:', JSON.stringify(toolbarButtons.slice(0, 20), null, 2));

  // Check how to switch to HTML view
  // Usually there is a button with aria-label or tooltip "HTML view" or "Compose view" or "Switch to HTML view"
  const htmlViewBtn = page.locator('[aria-label*="HTML" i], [title*="HTML" i], [data-tooltip*="HTML" i], [aria-label*="Compose" i]').first();
  console.log('HTML view button count:', await htmlViewBtn.count());
  if (await htmlViewBtn.count() > 0) {
    console.log('HTML view button text/label:', await htmlViewBtn.getAttribute('aria-label') || await htmlViewBtn.innerText());
  }

  // Check CodeMirror or contenteditable or iframe
  const editorArea = await page.evaluate(() => {
    const iframes = Array.from(document.querySelectorAll('iframe')).map(f => f.src || f.id || f.className);
    const contentEditables = Array.from(document.querySelectorAll('[contenteditable="true"]')).map(c => ({
      tag: c.tagName,
      className: c.className,
      ariaLabel: c.getAttribute('aria-label')
    }));
    const codeMirrors = Array.from(document.querySelectorAll('.CodeMirror, textarea')).map(t => ({
      tag: t.tagName,
      className: t.className,
      id: t.id
    }));
    return { iframes, contentEditables, codeMirrors };
  });

  console.log('Editor Area:', JSON.stringify(editorArea, null, 2));

  await context.close();
}

main().catch(console.error);
