// scripts/generate-og-cards.mjs
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const cards = [
  { slug: 'tip-pool-calculator', title: 'Tip Pool Calculator', subtitle: 'Split pooled tips fairly by hours worked, job points, or percentages under FLSA rules.', badge: 'FLSA Compliant' },
  { slug: 'tip-out-calculator', title: 'Tip Out Calculator', subtitle: 'Calculate fair support staff tip-outs as a percentage of food sales or card tips.', badge: 'Zero Server Storage' },
  { slug: 'overtime-and-double-time-calculator', title: 'Overtime & Double Time', subtitle: 'Accurate daily, weekly, and 7th-consecutive-day premium pay for all 50 states.', badge: 'All 50 States' },
  { slug: 'shift-differential-calculator', title: 'Shift Differential Calculator', subtitle: 'Blend hourly base pay, night diffs, and weekend premiums into correct regular rates.', badge: 'FLSA §778.207' },
  { slug: 'tipped-overtime-calculator', title: 'Tipped Overtime Calculator', subtitle: 'Calculate true overtime pay without losing your state tip credit statutory floor.', badge: 'DOL Fact Sheet #15' },
  { slug: 'take-home-pay-with-tips-calculator', title: 'Take-Home Pay with Tips', subtitle: 'Estimate real net pay after Social Security, Medicare, and estimated income taxes.', badge: '2026 Tax Rates' },
  { slug: 'no-tax-on-tips-and-overtime-deduction-estimator', title: 'No Tax on Tips & OT Estimator', subtitle: 'Estimate federal tax deductions for tips and overtime under 2025–2028 rules.', badge: 'IRS Phase-Out Rules' },
  { slug: 'tip-tools', title: 'Tip Calculation Tools', subtitle: 'Free, transparent calculators for tip pooling, bartender tip-outs, and FLSA limits.', badge: 'Tip Tools Hub' },
  { slug: 'overtime-tools', title: 'Overtime Pay Calculators', subtitle: 'State-specific daily overtime, 7th day rules, and blended rate wage tools.', badge: 'Overtime Hub' },
  { slug: 'shift-pay-tools', title: 'Shift Pay & Deduction Tools', subtitle: 'Shift differentials, take-home estimates, and tax deduction calculators.', badge: 'Shift Pay Hub' },
  { slug: 'guides', title: 'Worker Pay & Legal Guides', subtitle: 'Plain-English statutory explainers on tip pooling, tip credits, and overtime.', badge: 'Legal Explainers' },
  { slug: 'state-pay-rules', title: 'State Minimum Wage & Overtime', subtitle: 'Verified state-by-state statutory wage rates, maximum tip credits, and daily OT.', badge: 'Verified 2026 Data' },
  { slug: 'default', title: 'Shift & Tip', subtitle: 'Free, transparent pay calculators and statutory wage rules for hourly & tipped workers.', badge: 'Free & Client-Side' }
];

function buildHtml(item) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1200px;
    height: 630px;
    background: #fbf9f4;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
    color: #1c1917;
  }
  .card {
    width: 100%;
    height: 100%;
    background: #ffffff;
    border: 3px solid #e7e5e4;
    border-radius: 24px;
    padding: 60px 68px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 16px 36px rgba(28, 25, 23, 0.06);
    position: relative;
    overflow: hidden;
  }
  .card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 10px;
    background: #0f766e;
  }
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .brand {
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: #0f766e;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .badge {
    background: #f0fdfa;
    color: #0f766e;
    border: 1.5px solid #ccfbf1;
    font-size: 16px;
    font-weight: 700;
    padding: 6px 16px;
    border-radius: 999px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .middle {
    margin: 24px 0;
  }
  .title {
    font-size: 54px;
    font-weight: 800;
    line-height: 1.15;
    color: #0c0a09;
    letter-spacing: -1px;
    margin-bottom: 18px;
  }
  .subtitle {
    font-size: 24px;
    font-weight: 400;
    line-height: 1.45;
    color: #57534e;
    max-width: 950px;
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 24px;
    border-top: 2px solid #f5f5f4;
  }
  .url {
    font-size: 20px;
    font-weight: 600;
    color: #78716c;
  }
  .pills {
    display: flex;
    gap: 14px;
  }
  .pill {
    background: #f5f5f4;
    color: #44403c;
    font-size: 15px;
    font-weight: 600;
    padding: 6px 14px;
    border-radius: 8px;
  }
</style>
</head>
<body>
  <div class="card">
    <div class="top">
      <div class="brand">Shift &amp; Tip</div>
      <div class="badge">${item.badge}</div>
    </div>
    <div class="middle">
      <h1 class="title">${item.title}</h1>
      <p class="subtitle">${item.subtitle}</p>
    </div>
    <div class="bottom">
      <div class="url">shiftandtip.blogspot.com</div>
      <div class="pills">
        <div class="pill">No Tracking</div>
        <div class="pill">Instant Calculations</div>
        <div class="pill">100% Free</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function main() {
  console.log('=== Generating 1200x630 Open Graph Images ===');
  mkdirSync('F:/shiftandtip-assets/img/og', { recursive: true });
  mkdirSync('F:/shiftandtip/dist/assets/img/og', { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630, deviceScaleFactor: 2 } });

  for (const item of cards) {
    const html = buildHtml(item);
    await page.setContent(html, { waitUntil: 'load' });
    const target1 = `F:/shiftandtip-assets/img/og/${item.slug}.png`;
    const target2 = `F:/shiftandtip/dist/assets/img/og/${item.slug}.png`;
    await page.screenshot({ path: target1 });
    await page.screenshot({ path: target2 });
    console.log(`  Generated: img/og/${item.slug}.png`);
  }

  await browser.close();
  console.log('=== All 13 OG Share Cards Generated Successfully ===');
}

main().catch(console.error);
