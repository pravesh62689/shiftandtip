// scripts/research-affiliates.mjs
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const outDir = 'F:/shiftandtip/data/raw/snapshots/affiliates';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const targets = [
  { name: 'gusto', url: 'https://gusto.com/partners' },
  { name: '7shifts', url: 'https://www.7shifts.com/partners/' },
  { name: 'homebase', url: 'https://joinhomebase.com/affiliates/' },
  { name: 'toast', url: 'https://pos.toasttab.com/referral-program' },
  { name: 'adp', url: 'https://www.adp.com/who-we-serve/partners/referral-program.aspx' },
  { name: 'taxact', url: 'https://www.taxact.com/affiliates' },
];

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  for (const t of targets) {
    console.log(`Snapshotting ${t.name} (${t.url})...`);
    try {
      await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(3000);
      const title = await page.title();
      const text = await page.evaluate(() => document.body.innerText.slice(0, 2000));
      
      fs.writeFileSync(path.join(outDir, `${t.name}.txt`), `URL: ${t.url}\nTitle: ${title}\nSnapshot Date: ${new Date().toISOString()}\n\nSample text:\n${text}`);
      await page.screenshot({ path: path.join(outDir, `${t.name}.png`), fullPage: false });
      console.log(`[+] Captured ${t.name}: "${title}"`);
    } catch (err) {
      console.warn(`[!] Failed to snapshot ${t.name}:`, err.message);
      fs.writeFileSync(path.join(outDir, `${t.name}.txt`), `URL: ${t.url}\nFailed: ${err.message}\nDate: ${new Date().toISOString()}`);
    }
  }

  await browser.close();
  console.log('Finished capturing affiliate snapshots.');
}

run();
