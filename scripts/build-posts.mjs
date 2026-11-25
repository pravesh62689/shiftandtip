// Renders content/{tools,states,guides}/*.md -> dist/posts/<slug>.html + dist/posts/manifest.json (playbook §11, §12.5, §13.4).
// Every number in a pre-rendered example comes from the engine; rules tables come from data/states.json.
// Env: BLOG_URL, PUB_ID (ad client; placeholders are emitted while unset), AUTHOR_NAME.
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { tipPool } from '../src/engine/tips.js';
import { grossPay } from '../src/engine/overtime.js';
import { RULES } from '../src/engine/rules.js';
import { fmt } from '../src/engine/money.js';
import { paycheck } from '../src/engine/paycheck.js';
import { AUTHOR_NAME, BLOG_URL as CONFIG_BLOG_URL, ASSET_VERSION, ADS_ENABLED as CONFIG_ADS_ENABLED, PUB_ID as CONFIG_PUB_ID, AFFILIATES_ENABLED as CONFIG_AFFILIATES_ENABLED, AFFILIATE_PROGRAMS } from '../config.mjs';

const BLOG_URL = (process.env.BLOG_URL || CONFIG_BLOG_URL || 'https://shiftandtip.blogspot.com').replace(/\/$/, '');
const ADS_ENABLED = process.env.ADS_ENABLED ? process.env.ADS_ENABLED === 'true' : (CONFIG_ADS_ENABLED ?? false);
const AFFILIATES_ENABLED = process.env.AFFILIATES_ENABLED ? process.env.AFFILIATES_ENABLED === 'true' : (CONFIG_AFFILIATES_ENABLED ?? false);
const PUB_ID = process.env.PUB_ID || CONFIG_PUB_ID || '';
const AUTHOR = process.env.AUTHOR_NAME || AUTHOR_NAME || 'Pravesh Rathore';
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const states = existsSync('data/states.json') ? JSON.parse(readFileSync('data/states.json', 'utf8')) : { meta: {}, states: [] };
const verifiedOn = states.meta?.verifiedOn || null;
const verifiedLabel = verifiedOn ? new Date(verifiedOn + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }) : 'DATE PENDING';
const warnings = [];

// ---- affiliate slot system gated by AFFILIATES_ENABLED & program IDs ----
function renderAffiliateSlot(toolName) {
  if (!AFFILIATES_ENABLED || !toolName) return '';
  const t = String(toolName).toLowerCase();

  // 1. Tip pool & tip-out: scheduling and tip software (7shifts / Homebase)
  if (t === 'tip-pool' || t === 'tip-out') {
    const pId = AFFILIATE_PROGRAMS?.SEVENSHIFTS_ID || AFFILIATE_PROGRAMS?.HOMEBASE_ID;
    if (!pId) return '';
    const link = AFFILIATE_PROGRAMS?.SEVENSHIFTS_ID
      ? `https://www.7shifts.com/partners/?partner=${encodeURIComponent(pId)}`
      : `https://joinhomebase.com/?ref=${encodeURIComponent(pId)}`;
    return `<div class="affiliate-box" data-affiliate="scheduling">` +
      `<div class="affiliate-box__header"><span class="affiliate-box__tag">Automate Your Tips</span><span class="affiliate-box__disclosure">We may earn a commission</span></div>` +
      `<h3 class="affiliate-box__title">Run tip pools and scheduling automatically</h3>` +
      `<p class="affiliate-box__desc">Tired of manual tip spreadsheets? Calculate pooled tip distributions, sync POS sales, and export straight to payroll in one click with <strong>7shifts</strong>.</p>` +
      `<a class="affiliate-box__btn" href="${link}" rel="sponsored nofollow" target="_blank">Try 7shifts Free &rarr;</a>` +
      `</div>`;
  }

  // 2. Overtime and shift tools: payroll box (Gusto / ADP)
  if (t === 'overtime' || t === 'shift-differential' || t === 'tipped-overtime') {
    const pId = AFFILIATE_PROGRAMS?.GUSTO_ID || AFFILIATE_PROGRAMS?.ADP_ID;
    if (!pId) return '';
    const link = AFFILIATE_PROGRAMS?.GUSTO_ID
      ? `https://gusto.com/r/${encodeURIComponent(pId)}`
      : `https://www.adp.com/?ref=${encodeURIComponent(pId)}`;
    return `<div class="affiliate-box" data-affiliate="payroll">` +
      `<div class="affiliate-box__header"><span class="affiliate-box__tag">Accurate Payroll</span><span class="affiliate-box__disclosure">We may earn a commission</span></div>` +
      `<h3 class="affiliate-box__title">Automate multi-rate and tipped overtime payroll</h3>` +
      `<p class="affiliate-box__desc">Avoid costly wage compliance penalties. Calculate weighted average overtime, tip credits, and tax withholdings with <strong>Gusto</strong>.</p>` +
      `<a class="affiliate-box__btn" href="${link}" rel="sponsored nofollow" target="_blank">Get Started with Gusto &rarr;</a>` +
      `</div>`;
  }

  // 3. Take-home and deduction tools: tax software (TurboTax / TaxAct)
  if (t === 'take-home' || t === 'tips-ot-deduction' || t === 'paycheck') {
    const pId = AFFILIATE_PROGRAMS?.TURBOTAX_ID || AFFILIATE_PROGRAMS?.TAXACT_ID;
    if (!pId) return '';
    const link = AFFILIATE_PROGRAMS?.TURBOTAX_ID
      ? `https://turbotax.intuit.com/affiliate/?id=${encodeURIComponent(pId)}`
      : `https://www.taxact.com/?partner=${encodeURIComponent(pId)}`;
    return `<div class="affiliate-box" data-affiliate="tax">` +
      `<div class="affiliate-box__header"><span class="affiliate-box__tag">Tax Season 2026–2027</span><span class="affiliate-box__disclosure">We may earn a commission</span></div>` +
      `<h3 class="affiliate-box__title">Maximize your tip and overtime deductions</h3>` +
      `<p class="affiliate-box__desc">File your annual return with confidence. Claim all qualified tip credits, itemized write-offs, and state deductions step-by-step with <strong>TurboTax</strong>.</p>` +
      `<a class="affiliate-box__btn" href="${link}" rel="sponsored nofollow" target="_blank">File with TurboTax &rarr;</a>` +
      `</div>`;
  }

  return '';
}

// ---- ads (§13.4): labelled, reserved height, never inside .tool ----
const SLOTS = { T1: 'SLOT_T1', T2: 'SLOT_T2', G1: 'SLOT_G1', G2: 'SLOT_G2', MULTIPLEX: 'SLOT_MULTIPLEX', LEADER: 'SLOT_LEADER' };
const FORMAT = { G1: 'data-ad-layout="in-article" data-ad-format="fluid"', G2: 'data-ad-layout="in-article" data-ad-format="fluid"', MULTIPLEX: 'data-ad-format="autorelaxed"' };
const ad = (k) => {
  if (!ADS_ENABLED || !PUB_ID || PUB_ID.includes('XXXX')) return '';
  return `<div class="ad" data-slot="${k}"><span class="ad__label">Advertisements</span>` +
    `<ins class="adsbygoogle" style="display:block${k[0] === 'G' ? ';text-align:center' : ''}" data-ad-client="${PUB_ID}" data-ad-slot="${SLOTS[k]}" ${FORMAT[k] || 'data-ad-format="auto" data-full-width-responsive="true"'}></ins>` +
    `<script>(adsbygoogle = window.adsbygoogle || []).push({});</script><a class="ad__house" href="/p/tip-tools.html">See all free tip tools →</a></div>`;
};

// ---- pre-rendered examples, computed by the engine ----
const row = (l, v) => `<div class="receipt__row"><span>${l}</span><span class="num">${v}</span></div>`;
const EX_STAFF = [['Server', 'Maya', 6.5], ['Server', 'Luis', 7], ['Bartender', 'Dana', 8], ['Busser', 'Theo', 5], ['Host', 'Priya', 4]].map(([role, name, hours]) => ({ role, name, hours }));
function preRender(fm) {
  if (fm.tool === 'tip-pool') {
    const r = tipPool({ totalTipsCents: 124000, salesCents: 800000, staff: EX_STAFF, tipOuts: [{ label: 'Kitchen', pct: 3, basis: 'sales' }] });
    return `<div class="receipt"><div class="receipt__title">Payouts (example)</div>${r.rows.map((p) => row(`${p.name} <span class="receipt__sub">${p.role}</span>`, `${fmt(p.shareCents)} <span class="receipt__sub">${fmt(p.perHourCents)}/hr</span>`)).join('')}` +
      r.tipOuts.map((o) => row(`${o.label} tip-out`, fmt(o.cents))).join('') + `<div class="receipt__total"><span>Total tips</span><span class="num">${fmt(124000)}</span></div><div class="receipt__check">Allocated <span class="num">${fmt(r.checkCents)}</span> of <span class="num">${fmt(124000)}</span></div></div>`;
  }
  if (fm.tool === 'overtime') {
    const code = (fm.state || 'FED').toUpperCase(), rules = RULES[code];
    if (!rules || (code === 'NV')) { warnings.push(`${fm.slugTitle}: no pre-render for ${code} (needs verified data)`); return ''; }
    const days = [10, 8, 12.5, 9, 8, 0, 0], seg = [{ hours: 47.5, rateCents: 2000 }];
    const g = grossPay({ days, rules, segments: seg }), f = grossPay({ days, rules: RULES.FED, segments: seg }), d = g.totalCents - f.totalCents;
    return `<div class="receipt"><div class="receipt__title">This week (example, $20.00/hr)</div>${row('Regular', g.reg + ' h')}${row('Overtime 1.5×', g.ot + ' h')}${row('Double time 2×', g.dt + ' h')}` +
      `<div class="receipt__total"><span>Gross pay</span><span class="num">${fmt(g.totalCents)}</span></div>` + (code !== 'FED' ? `<div class="receipt__compare">Federal-only rules would pay ${fmt(f.totalCents)}${d ? ` (+${fmt(d)} under ${code} rules)` : ''}</div>` : '') + '</div>';
  }
  if (fm.tool === 'paycheck') {
    const code = (fm.state || 'CA').toUpperCase();
    const res = paycheck({ wagesCents: 120000, tipsCents: 40000, periodsPerYear: 26, filingStatus: 'single', stateCode: code });
    return `<div class="receipt"><div class="receipt__title">Paycheck Withholding (example: $1,600 biweekly)</div>` +
      row('Gross Pay', fmt(res.grossCents)) +
      row('Social Security (6.2%)', '−' + fmt(res.ssCents)) +
      row('Medicare (1.45%)', '−' + fmt(res.medCents)) +
      row('Federal Income Tax', '−' + fmt(res.fedCents)) +
      row(`State Income Tax (${code})`, (res.stateCents === 0 ? '$0.00' : '−' + fmt(res.stateCents))) +
      `<div class="receipt__total"><span>Take-Home Pay</span><span class="num">${fmt(res.netCents)}</span></div>` +
      `<div class="receipt__compare">Effective tax rate: ${res.effectiveTaxRatePct}% (Annualized: ${fmt(res.annualGrossCents)})</div></div>`;
  }
  return '';
}

function rulesTable(fm) {
  if (!fm.state) return '';
  const st = states.states.find((s) => s.code === String(fm.state).toUpperCase());
  if (!st) return '';
  const cell = (v, pre = '', suf = '') => (v == null ? '<span class="receipt__sub">pending verification</span>' : pre + v + suf);
  if (st.minWage == null || st.verifiedOn == null) warnings.push(`${fm.slugTitle}: ${st.code} rules not verified in data/states.json; do not publish`);
  const src = (st.sources || []).map((s, i) => `<li><a rel="noopener" href="${esc(s.url)}">${esc(s.label)}</a></li>`).join('');
  return `<h2>${esc(st.name)} rules at a glance</h2><div class="table-wrap"><table class="data data--ledger"><thead><tr><th>Rule</th><th>Value</th></tr></thead><tbody>` +
    `<tr><td>Minimum wage</td><td class="n">${cell(st.minWage, '$')}</td></tr><tr><td>Tipped cash wage</td><td class="n">${cell(st.tippedCashWage, '$')}</td></tr>` +
    `<tr><td>Maximum tip credit</td><td class="n">${cell(st.maxTipCredit, '$')}</td></tr><tr><td>Daily overtime</td><td class="n">${st.ot?.daily ? 'After ' + st.ot.daily + ' h' : 'None'}</td></tr>` +
    `<tr><td>Verified</td><td class="n">${st.verifiedOn ? esc(st.verifiedOn) : '<span class="receipt__sub">pending</span>'}</td></tr></tbody></table></div>` + (src ? `<ul class="sources">${src}</ul>` : '');
}

const jsonld = (fm, url) => {
  const author = { '@type': 'Person', name: AUTHOR, url: BLOG_URL + '/p/about.html' };
  if (fm.slugTitle === 'state-pay-rules') {
    const dataset = {
      '@type': 'Dataset',
      name: 'State Tip and Overtime Pay Rules (2026)',
      description: fm.description,
      url: `${BLOG_URL}/p/state-pay-rules.html`,
      creator: author,
      dateModified: verifiedOn || '2026-11-24',
      isBasedOn: [
        'https://www.dol.gov/agencies/whd/minimum-wage/state',
        'https://www.dol.gov/agencies/whd/state/minimum-wage/tipped'
      ]
    };
    const crumbs = {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BLOG_URL + '/' },
        { '@type': 'ListItem', position: 2, name: 'State pay rules', item: `${BLOG_URL}/p/state-pay-rules.html` }
      ]
    };
    return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': [dataset, crumbs] })}</script>`;
  }
  if (fm.type === 'page') {
    const crumbs = {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BLOG_URL + '/' },
        { '@type': 'ListItem', position: 2, name: fm.title, item: `${BLOG_URL}/p/${kebab(fm.slugTitle)}.html` }
      ]
    };
    return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': [crumbs] })}</script>`;
  }
  const crumbs = { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: fm.hubName || 'Tools', item: BLOG_URL + (fm.hub || '/p/tip-tools.html') }, { '@type': 'ListItem', position: 2, name: fm.h1 || fm.title }] };
  const main = fm.type === 'guide'
    ? { '@type': 'Article', headline: fm.title, author, dateModified: verifiedOn || undefined, citation: (fm.sources || []).map((s) => s.url), mainEntityOfPage: url }
    : { '@type': 'WebApplication', name: fm.h1 || fm.title, url, applicationCategory: 'FinanceApplication', operatingSystem: 'Any (web browser)', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, author, dateModified: verifiedOn || undefined };
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': [main, crumbs] })}</script>`; // never aggregateRating/review
};

const tpl = readFileSync('templates/page.html', 'utf8');
const kebab = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
mkdirSync('dist/posts', { recursive: true });
const manifest = [];
for (const dir of ['tools', 'states', 'guides', 'cities', 'es', 'pages']) {
  if (!existsSync(join('content', dir))) continue;
  for (const f of readdirSync(join('content', dir)).filter((x) => x.endsWith('.md'))) {
    const { data: fm, content } = matter(readFileSync(join('content', dir, f), 'utf8'));
    for (const k of ['title', 'slugTitle', 'description', 'type']) if (!fm[k]) throw new Error(`${dir}/${f}: front matter "${k}" missing`);
    if (fm.description.length > 155) warnings.push(`${f}: description ${fm.description.length} > 155`);
    if (fm.title.length > 60) warnings.push(`${f}: title ${fm.title.length} > 60`);
    const slug = kebab(fm.slugTitle), isPage = dir === 'pages';
    const url = isPage ? `${BLOG_URL}/p/${slug}.html` : `${BLOG_URL}/YYYY/MM/${slug}.html`;

    // Only generate state pages for states that are fully verified
    if (dir === 'states' && fm.state) {
      const st = states.states.find((s) => s.code === String(fm.state).toUpperCase());
      const isVerified = st && st.verifiedOn != null && st.minWage != null && st.tippedCashWage != null && st.maxTipCredit != null;
      if (!isVerified) {
        console.log(`Skipping unverified state: ${fm.state} (${f})`);
        const targetHtml = join('dist/posts', slug + '.html');
        if (existsSync(targetHtml)) {
          unlinkSync(targetHtml);
          console.log(`Deleted unverified draft: ${targetHtml}`);
        }
        continue;
      }
    }

    console.log(`Building: ${dir}/${f}`);
    const sources = (fm.sources || []).length ? `<h2>Sources</h2><ol class="sources">${fm.sources.map((s) => `<li><a rel="noopener" href="${esc(s.url)}">${esc(s.label)}</a></li>`).join('')}</ol>` : '';
    const related = (fm.related || []).length ? `<h2>Related calculators</h2><ul class="related">${fm.related.map((r) => `<li><a href="${esc(r.url)}">${esc(r.label)}</a></li>`).join('')}</ul>` : '';
    const isGuide = fm.type === 'guide';
    let body = marked.parse(content);
    if (isGuide) { // G1 after paragraph 3, G2 after paragraph 8
      let n = 0; body = body.replace(/<\/p>/g, (m) => { n += 1; return m + (n === 3 ? ad('G1') : n === 8 ? ad('G2') : ''); });
    }
    const toolBlock = fm.tool ? `<div class="tool"><div data-tool="${esc(fm.tool)}"${fm.state ? ` data-state="${esc(fm.state)}"` : ''}>${preRender(fm)}</div></div>` : '';
    const breadcrumbHtml = isPage ? `<a href="/">Home</a> / ${esc(fm.title)}` : `<a href="${esc(fm.hub || '/p/tip-tools.html')}">${esc(fm.hubName || 'Tools')}</a> / ${esc(fm.h1 || fm.title)}`;
    const html = tpl
      .replace('{{breadcrumb}}', () => breadcrumbHtml)
      .replace('{{intro}}', () => esc(fm.intro || fm.description))
      .replace('{{verifiedLabel}}', () => verifiedLabel).replace('{{toolBlock}}', () => toolBlock)
      .replace('{{affiliateSlot}}', () => renderAffiliateSlot(fm.tool))
      .replace('{{ad_T1}}', () => (isGuide || isPage ? '' : ad('T1'))).replace('{{body}}', () => body)
      .replace('{{rulesTable}}', () => rulesTable(fm)).replace('{{ad_T2}}', () => (isGuide || isPage ? '' : ad('T2')))
      .replace('{{sources}}', () => sources).replace('{{related}}', () => related).replace('{{ad_MULTIPLEX}}', () => (isPage ? '' : ad('MULTIPLEX')))
      .replace('{{byline}}', () => `By ${esc(AUTHOR)}.`).replace('{{verifiedLabel}}', () => verifiedLabel).replace('{{jsonld}}', () => jsonld(fm, url));
    writeFileSync(join('dist/posts', slug + '.html'), html);
    manifest.push({ slug, file: slug + '.html', slugTitle: fm.slugTitle, title: fm.title, description: fm.description, labels: fm.labels || [], type: fm.type, isPage, needsHumanEdit: !!fm['needs human edit'] });
  }
}
writeFileSync('dist/posts/manifest.json', JSON.stringify(manifest, null, 2));
console.log(`built ${manifest.length} post(s)${PUB_ID.includes('XXXX') ? ' (ad client is a placeholder: set PUB_ID after approval)' : ''}`);
for (const w of warnings) console.log('WARN: ' + w);
