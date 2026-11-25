import { chromium } from 'playwright';
import fs from 'node:fs';

const liveUrls = JSON.parse(fs.readFileSync('data/live-urls.json', 'utf8'));

const toolMap = {
  'tip-pool': liveUrls['tip-pool-calculator'],
  'tip-out': liveUrls['tip-out-calculator'],
  'overtime': liveUrls['overtime-and-double-time-calculator'],
  'shift-differential': liveUrls['shift-differential-calculator'],
  'tipped-overtime': liveUrls['tipped-overtime-calculator'],
  'take-home': liveUrls['take-home-pay-with-tips-calculator'],
  'tips-ot-deduction': liveUrls['no-tax-on-tips-and-overtime-deduction-estimator'],
};

async function main() {
  const browser = await chromium.launch();
  const measurements = {};

  for (const [toolName, url] of Object.entries(toolMap)) {
    measurements[toolName] = {};

    // 390px mobile
    const pageMobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await pageMobile.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await pageMobile.waitForSelector(`[data-tool]`, { timeout: 10000 });
    await pageMobile.waitForTimeout(1000);
    const boxMobile = await pageMobile.locator(`[data-tool]`).boundingBox();
    measurements[toolName].mobile = Math.ceil(boxMobile ? boxMobile.height : 0);
    await pageMobile.close();

    // 1280px desktop
    const pageDesktop = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await pageDesktop.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await pageDesktop.waitForSelector(`[data-tool]`, { timeout: 10000 });
    await pageDesktop.waitForTimeout(1000);
    const boxDesktop = await pageDesktop.locator(`[data-tool]`).boundingBox();
    measurements[toolName].desktop = Math.ceil(boxDesktop ? boxDesktop.height : 0);
    await pageDesktop.close();

    measurements[toolName].max = Math.max(measurements[toolName].mobile, measurements[toolName].desktop);
    console.log(`${toolName}: mobile=${measurements[toolName].mobile}px, desktop=${measurements[toolName].desktop}px, max=${measurements[toolName].max}px`);
  }

  await browser.close();

  fs.writeFileSync('reports/tool-heights.json', JSON.stringify(measurements, null, 2));
  console.log('Saved measurements to reports/tool-heights.json');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
