import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const expectedRobots = fs.readFileSync('blogger/robots.txt', 'utf8').trim();
const reportsDir = 'reports';
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

const results = [];

console.log('Testing public settings against https://shiftandtip.blogspot.com...');

// 1. robots.txt
let robotsMatch = false;
let actualRobots = '';
try {
  const res = await fetch('https://shiftandtip.blogspot.com/robots.txt');
  actualRobots = (await res.text()).trim();
  robotsMatch = actualRobots === expectedRobots;
  results.push({
    item: 'GET /robots.txt matches blogger/robots.txt',
    pass: robotsMatch,
    details: robotsMatch ? 'Exact match' : `Mismatch.\nExpected:\n${expectedRobots}\n\nActual:\n${actualRobots}`
  });
} catch (e) {
  results.push({ item: 'GET /robots.txt', pass: false, details: e.message });
}

// 2. http:// redirect to https://
let httpRedirectPass = false;
try {
  // Using node http or fetch to check redirect
  const res = await fetch('http://shiftandtip.blogspot.com/', { redirect: 'manual' });
  const status = res.status;
  const location = res.headers.get('location') || '';
  httpRedirectPass = (status >= 300 && status < 400 && location.startsWith('https://')) || (res.url.startsWith('https://'));
  results.push({
    item: 'http:// redirects to https://',
    pass: httpRedirectPass,
    details: `Status ${status}, Location: ${location || 'none'}`
  });
} catch (e) {
  results.push({ item: 'http:// redirects to https://', pass: false, details: e.message });
}

// Browser checks for 404, homepage noindex, and search noindex
const browser = await chromium.launch();
const page = await browser.newPage();

// 3. 404 nonexistent URL
let custom404Pass = false;
try {
  const notFoundUrl = 'https://shiftandtip.blogspot.com/nonexistent-test-page-' + Date.now();
  const resp = await page.goto(notFoundUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
  const status = resp ? resp.status() : 0;
  const content = await page.content();
  const hasText = content.includes('Nothing to calculate here');
  custom404Pass = hasText;
  results.push({
    item: 'Nonexistent URL shows "Nothing to calculate here"',
    pass: custom404Pass,
    details: `Status ${status}, contains "Nothing to calculate here": ${hasText}`
  });
} catch (e) {
  results.push({ item: 'Nonexistent URL shows "Nothing to calculate here"', pass: false, details: e.message });
}

// 4. Homepage has no noindex
let homeNoindexPass = false;
try {
  const resp = await page.goto('https://shiftandtip.blogspot.com/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  const robotsMeta = await page.locator('meta[name="robots"]').getAttribute('content').catch(() => null);
  const xRobotsTag = resp ? resp.headers()['x-robots-tag'] : null;
  const hasNoindex = (robotsMeta && robotsMeta.toLowerCase().includes('noindex')) || (xRobotsTag && xRobotsTag.toLowerCase().includes('noindex'));
  homeNoindexPass = !hasNoindex;
  results.push({
    item: 'Homepage has no noindex',
    pass: homeNoindexPass,
    details: `Robots meta: ${robotsMeta || 'none'}, X-Robots-Tag: ${xRobotsTag || 'none'}`
  });
} catch (e) {
  results.push({ item: 'Homepage has no noindex', pass: false, details: e.message });
}

// 5. /search?q=x has noindex
let searchNoindexPass = false;
try {
  const searchUrl = 'https://shiftandtip.blogspot.com/search?q=tips';
  const resp = await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
  const robotsMeta = await page.locator('meta[name="robots"]').getAttribute('content').catch(() => null);
  const xRobotsTag = resp ? resp.headers()['x-robots-tag'] : null;
  const hasNoindex = (robotsMeta && robotsMeta.toLowerCase().includes('noindex')) || (xRobotsTag && xRobotsTag.toLowerCase().includes('noindex'));
  searchNoindexPass = !!hasNoindex;
  results.push({
    item: '/search?q=x carries noindex meta or header',
    pass: searchNoindexPass,
    details: `Robots meta: ${robotsMeta || 'none'}, X-Robots-Tag: ${xRobotsTag || 'none'}`
  });
} catch (e) {
  results.push({ item: '/search?q=x carries noindex', pass: false, details: e.message });
}

await browser.close();

// Generate markdown report
let md = '# Blogger Public Settings Check Report\n\n';
md += `**Target:** https://shiftandtip.blogspot.com  \n`;
md += `**Timestamp:** ${new Date().toISOString()}  \n\n`;
md += `| Setting Check | Result | Details |\n`;
md += `|---|---|---|\n`;

for (const r of results) {
  md += `| ${r.item} | ${r.pass ? 'PASS' : 'FAIL'} | ${r.details.replace(/\n/g, '<br>')} |\n`;
}

fs.writeFileSync('reports/settings-check.md', md);
console.log('Saved reports/settings-check.md');
console.table(results.map(r => ({ Check: r.item, Status: r.pass ? 'PASS' : 'FAIL' })));
