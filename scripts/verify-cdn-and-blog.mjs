import { chromium } from 'playwright';

const urls = [
  'https://cdn.jsdelivr.net/gh/pravesh62689/shiftandtip-assets@v1.0.0/tools.min.js',
  'https://cdn.jsdelivr.net/gh/pravesh62689/shiftandtip-assets@v1.0.0/states.json',
  'https://cdn.jsdelivr.net/gh/pravesh62689/shiftandtip-assets@v1.0.0/fonts/public-sans-var-latin.woff2',
  'https://cdn.jsdelivr.net/gh/pravesh62689/shiftandtip-assets@v1.0.0/fonts/source-serif-4-600-latin.woff2',
  'https://cdn.jsdelivr.net/gh/pravesh62689/shiftandtip-assets@v1.0.0/fonts/ibm-plex-mono-500-latin.woff2',
];

console.log('--- Verifying CDN Assets ---');
const browser = await chromium.launch();
const context = await browser.newContext();

for (const url of urls) {
  try {
    const res = await context.request.get(url);
    const status = res.status();
    const contentType = res.headers()['content-type'] || 'unknown';
    console.log(`[CDN] ${status} (${contentType}) - ${url.split('@v1.0.0/')[1]}`);
  } catch (err) {
    console.error(`[CDN ERROR] ${url}:`, err.message);
  }
}

console.log('\n--- Checking Blogger Existence ---');
try {
  const blogUrl = 'https://shiftandtip.blogspot.com';
  const page = await context.newPage();
  const res = await page.goto(blogUrl, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(e => null);
  
  if (!res) {
    console.log('[BLOG] Failed to load URL or timed out.');
  } else {
    const status = res.status();
    const currentUrl = page.url();
    const title = await page.title();
    const bodyText = await page.locator('body').innerText().catch(() => '');
    console.log(`[BLOG] HTTP Status: ${status}`);
    console.log(`[BLOG] Final URL: ${currentUrl}`);
    console.log(`[BLOG] Title: ${title}`);
    
    const notFoundSignals = [
      'Blog has been removed',
      'does not exist',
      'The blog you were looking for does not exist',
      'not found'
    ];
    const isNotFound = status === 404 || notFoundSignals.some(s => bodyText.includes(s) || title.includes(s));
    console.log(`[BLOG] Exists: ${!isNotFound}`);
  }
} catch (e) {
  console.error('[BLOG ERROR]:', e.message);
}

await browser.close();
