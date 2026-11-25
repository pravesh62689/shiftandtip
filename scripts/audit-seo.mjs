// SEO/policy audit (playbook §12.4, P8). Usage: node scripts/audit-seo.mjs [--dir dist/posts]  (local files)
//                                              node scripts/audit-seo.mjs --live                (fetches BLOG_URL sitemaps)
// Exits non-zero on any failure.
import { readFileSync, readdirSync } from 'node:fs';
const BLOG_URL = (process.env.BLOG_URL || 'https://shiftandtip.blogspot.com').replace(/\/$/, '');
const live = process.argv.includes('--live');
const di = process.argv.indexOf('--dir');
const dir = di > -1 ? process.argv[di + 1] : 'dist/posts';

const pages = [];
if (live) {
  const locs = async (u) => { const r = await fetch(u); return r.ok ? [...(await r.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]) : []; };
  for (const u of [...(await locs(BLOG_URL + '/sitemap.xml')), ...(await locs(BLOG_URL + '/sitemap-pages.xml'))]) {
    const r = await fetch(u); pages.push({ id: u, html: await r.text(), live: true });
  }
} else {
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.html'))) pages.push({ id: f, html: readFileSync(dir + '/' + f, 'utf8') });
}

const fails = [];
const rows = [];
for (const p of pages) {
  const h = p.html, bad = [];
  const isTool = /data-tool=/.test(h), isTrust = /(?:\/p\/|^)(about|methodology|privacy|terms|contact|corrections)\.html$/.test(p.id);
  const isHub = /(?:\/p\/|^)(tip-tools|overtime-tools|shift-pay-tools|state-pay-rules|guides)\.html$/.test(p.id);
  if (p.live) {
    const t = (h.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
    if (!t || t.length > 60) bad.push(`title ${t.length}`);
    const d = (h.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i) || [])[1];
    if (!d) bad.push('meta description missing'); else if (d.length > 155) bad.push('meta description > 155');
    if (!/rel=["']canonical["']/.test(h)) bad.push('canonical missing');
  }
  const h1s = (h.match(/<h1[\s>]/g) || []).length;
  if (p.live && h1s !== 1) bad.push(`h1 count ${h1s}`);
  const ld = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!isTrust) {
    if (!ld.length) bad.push('JSON-LD missing');
    for (const m of ld) { try { const j = JSON.parse(m[1]); if (!j['@context']) bad.push('JSON-LD no @context'); if (/aggregateRating|"review"/.test(m[1])) bad.push('fake-rating schema'); } catch { bad.push('JSON-LD parse error'); } }
  }
  const links = (h.match(/<a [^>]*href=["']\/[^"']*["']/g) || []).length + (h.match(new RegExp('href=["\']' + BLOG_URL.replace(/[.]/g, '\\.') + '/', 'g')) || []).length;
  if (!isTrust && links < 3) bad.push(`internal links ${links} < 3`);
  if ((isTool || /data-state=/.test(h)) && !/Rules verified/.test(h)) bad.push('"Rules verified" missing');
  if (/DATE PENDING/.test(h)) bad.push('verified date pending');
  if (/[?&]m=1/.test(h)) bad.push('?m=1 link');
  if (/AUTHOR_NAME/.test(h)) bad.push('AUTHOR_NAME placeholder');
  if (/lorem ipsum|TODO/i.test(h) || (!p.id.includes('state-pay-rules') && /pending verification/i.test(h))) bad.push('placeholder text');
  if (Buffer.byteLength(h) > 150 * 1024) bad.push('HTML > 150 KB');
  // ads: must carry a label, and never sit inside the tool card
  for (const m of h.matchAll(/<div class="ad"[\s\S]*?<\/div>/g)) if (!/Advertisements/.test(m[0])) bad.push('unlabelled ad');
  const toolBlock = (h.match(/<div class="tool">[\s\S]*?<\/div><\/div>/) || [''])[0];
  if (/class="ad"|adsbygoogle/.test(toolBlock)) bad.push('ad inside tool card');
  rows.push([p.id, bad.length ? 'FAIL' : 'ok', bad.join('; ')]);
  if (bad.length) fails.push(p.id);
}
console.table(rows.map(([id, s, n]) => ({ page: id, status: s, issues: n })));
console.log(`${pages.length} page(s), ${fails.length} failing`);
process.exit(fails.length ? 1 : 0);
