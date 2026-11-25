import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const rootDir = 'F:\\shiftandtip';
const reportPath = path.join(rootDir, 'reports', 'settings-check.md');
const expectedRobotsPath = path.join(rootDir, 'blogger', 'robots.txt');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  const results = [];
  let mismatches = [];

  // 1. Robots.txt
  console.log('1. Checking /robots.txt...');
  const expectedRobots = fs.existsSync(expectedRobotsPath) ? fs.readFileSync(expectedRobotsPath, 'utf8').trim() : '';
  let actualRobots = '';
  try {
    const res = await page.goto('https://shiftandtip.blogspot.com/robots.txt', { waitUntil: 'load', timeout: 15000 });
    actualRobots = (await page.evaluate(() => document.body ? document.body.innerText.trim() : '')) || (await res.text()).trim();
  } catch (e) {
    actualRobots = 'ERROR: ' + e.message;
  }

  const robotsMatch = actualRobots.replace(/\r\n/g, '\n').trim() === expectedRobots.replace(/\r\n/g, '\n').trim();
  results.push({
    item: 'robots.txt equality',
    status: robotsMatch ? 'PASS' : 'FAIL',
    details: robotsMatch ? 'Matches blogger/robots.txt exactly' : `Mismatch.\nExpected:\n${expectedRobots}\n\nActual:\n${actualRobots}`
  });
  if (!robotsMatch) mismatches.push('robots.txt');

  // 2. HTTP to HTTPS redirect
  console.log('2. Checking http:// redirect...');
  let httpRedirects = false;
  let finalUrl = '';
  try {
    const res = await page.goto('http://shiftandtip.blogspot.com/', { waitUntil: 'domcontentloaded', timeout: 15000 });
    finalUrl = page.url();
    httpRedirects = finalUrl.startsWith('https://');
  } catch (e) {
    finalUrl = 'ERROR: ' + e.message;
  }
  results.push({
    item: 'HTTP to HTTPS redirect',
    status: httpRedirects ? 'PASS' : 'FAIL',
    details: `Navigating to http:// resolved to: ${finalUrl}`
  });
  if (!httpRedirects) mismatches.push('HTTP redirect');

  // 3. Custom 404
  console.log('3. Checking custom 404...');
  let has404Message = false;
  let notFoundText = '';
  try {
    await page.goto('https://shiftandtip.blogspot.com/nonexistent-test-404-check', { waitUntil: 'domcontentloaded', timeout: 15000 });
    notFoundText = await page.evaluate(() => document.body ? document.body.innerText : '');
    has404Message = notFoundText.includes('Nothing to calculate here');
  } catch (e) {
    notFoundText = 'ERROR: ' + e.message;
  }
  results.push({
    item: 'Custom 404 message',
    status: has404Message ? 'PASS' : 'FAIL',
    details: has404Message ? 'Contains "Nothing to calculate here"' : 'Did not find expected 404 text'
  });
  if (!has404Message) mismatches.push('Custom 404');

  // 4. Homepage noindex check & search noindex check
  console.log('4. Checking noindex meta tags...');
  await page.goto('https://shiftandtip.blogspot.com/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  const homeRobotsMeta = await page.evaluate(() => {
    const el = document.querySelector('meta[name="robots"]');
    return el ? el.getAttribute('content') : null;
  });
  const homeNoIndex = homeRobotsMeta && homeRobotsMeta.toLowerCase().includes('noindex');

  await page.goto('https://shiftandtip.blogspot.com/search?q=test', { waitUntil: 'domcontentloaded', timeout: 15000 });
  const searchRobotsMeta = await page.evaluate(() => {
    const el = document.querySelector('meta[name="robots"]');
    return el ? el.getAttribute('content') : null;
  });
  const searchNoIndex = searchRobotsMeta && searchRobotsMeta.toLowerCase().includes('noindex');

  const metaPass = !homeNoIndex && searchNoIndex;
  results.push({
    item: 'Robots meta tags (home indexable, search noindex)',
    status: metaPass ? 'PASS' : 'FAIL',
    details: `Home meta[name="robots"]: ${homeRobotsMeta || 'none (indexable)'}; Search meta[name="robots"]: ${searchRobotsMeta || 'none'}`
  });
  if (!metaPass) mismatches.push('Robots meta tags');

  // Write report
  let md = '# Blogger Settings Verification Report\n\n';
  md += `Checked at: ${new Date().toISOString()}\n\n`;
  md += '| Setting | Status | Details |\n';
  md += '|---|---|---|\n';
  for (const r of results) {
    md += `| ${r.item} | **${r.status}** | ${r.details.replace(/\n/g, '<br>')} |\n`;
  }
  md += '\n';
  if (mismatches.length === 0) {
    md += '### Summary: All settings PASSED verification.\n';
  } else {
    md += `### Summary: ${mismatches.length} mismatch(es) detected: ${mismatches.join(', ')}\n`;
  }

  fs.writeFileSync(reportPath, md, 'utf8');
  console.log(`Saved report to ${reportPath}`);
  console.log(md);

  await browser.close();
}

main().catch(console.error);
