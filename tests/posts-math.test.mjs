import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { splitHours, grossPay } from '../src/engine/overtime.js';
import { tipPool } from '../src/engine/tips.js';
import { tipsDeduction, overtimeDeduction } from '../src/engine/deductions.js';
import { toCents } from '../src/engine/money.js';

const statesData = JSON.parse(fs.readFileSync('data/states.json', 'utf8')).states;
const manifest = JSON.parse(fs.readFileSync('dist/posts/manifest.json', 'utf8'));
const demoted = JSON.parse(fs.readFileSync('data/scheduled-demoted-log.json', 'utf8'));
const targetTitles = new Set(demoted.map((d) => d.title));
const posts18 = manifest.filter((m) => targetTitles.has(m.title));

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function shingles12(text) {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  const set = new Set();
  for (let i = 0; i <= words.length - 12; i++) {
    set.add(words.slice(i, i + 12).join(' '));
  }
  return { words: words.length, set };
}

test('All 18 demoted posts meet >=900w, 70-160 desc, >=3 internal links, .gov source, and <15% overlap', () => {
  assert.equal(posts18.length, 18);
  const parsed = posts18.map((p) => {
    const html = fs.readFileSync(`dist/posts/${p.file}`, 'utf8');
    const text = stripHtml(html);
    const { words, set } = shingles12(text);
    const internalLinks = (html.match(/href=["']\/[^"']*["']/g) || []).length;
    const hasGovSource = /\.gov\//i.test(html);
    return { slug: p.slug, descLen: (p.description || '').length, words, set, internalLinks, hasGovSource };
  });

  for (const a of parsed) {
    assert.ok(a.words >= 900, `${a.slug} words=${a.words} < 900`);
    assert.ok(a.descLen >= 70 && a.descLen <= 160, `${a.slug} descLen=${a.descLen}`);
    assert.ok(a.internalLinks >= 3, `${a.slug} internalLinks=${a.internalLinks} < 3`);
    assert.ok(a.hasGovSource, `${a.slug} missing .gov source link`);

    for (const b of parsed) {
      if (a.slug === b.slug) continue;
      let hits = 0;
      for (const sh of a.set) if (b.set.has(sh)) hits++;
      const ov = a.set.size ? (hits / a.set.size) * 100 : 0;
      assert.ok(ov < 15, `${a.slug} vs ${b.slug} overlap ${ov.toFixed(2)}% >= 15%`);
    }
  }
});

test('Engine re-computes statutory rates & worked examples for the 8 state posts', () => {
  const cases = [
    { code: 'TX', slug: 'texas-tipped-minimum-wage-and-overtime-calculator', cashRate: 213, credit: 512, days: [9, 9, 9, 9, 9, 0, 0] },
    { code: 'FL', slug: 'florida-tipped-minimum-wage-and-overtime-calculator', cashRate: 1198, credit: 302, days: [8, 9, 9, 9, 9, 0, 0] },
    { code: 'NY', slug: 'new-york-tipped-minimum-wage-and-overtime-calculator', cashRate: 1135, credit: 565, days: [9, 9, 9, 9, 9, 0, 0] },
    { code: 'CO', slug: 'colorado-overtime-calculator', cashRate: 1214, credit: 302, days: [14, 8, 8, 8, 0, 0, 0] },
    { code: 'AK', slug: 'alaska-overtime-calculator', cashRate: 1400, credit: 0, days: [10, 10, 10, 10, 4, 0, 0] },
    { code: 'PA', slug: 'pennsylvania-tipped-minimum-wage-and-overtime-calculator', cashRate: 283, credit: 442, days: [9, 9, 9, 9, 9, 0, 0] },
    { code: 'IL', slug: 'illinois-tipped-minimum-wage-and-overtime-calculator', cashRate: 900, credit: 600, days: [9, 9, 9, 9, 9, 0, 0] },
    { code: 'GA', slug: 'georgia-tipped-minimum-wage-and-overtime-calculator', cashRate: 213, credit: 512, days: [9, 9, 9, 9, 9, 0, 0] },
  ];

  for (const c of cases) {
    const st = statesData.find((s) => s.code === c.code);
    assert.ok(st, `Missing state ${c.code}`);
    const minCents = toCents(st.minWage);
    const cashCents = toCents(st.tippedCashWage);
    const creditCents = toCents(st.maxTipCredit);
    assert.equal(cashCents, c.cashRate, `${c.code} cashRate`);
    assert.equal(creditCents, c.credit, `${c.code} tipCredit`);

    const rules = {
      weeklyOT: st.ot.weekly,
      dailyOT: st.ot.daily,
      dailyDT: st.ot.dailyDT,
      seventhDay: st.ot.seventhDay,
    };
    const split = splitHours(c.days, rules);
    assert.ok(split.reg + split.ot + split.dt === c.days.reduce((a, b) => a + b, 0));

    const pay = grossPay({
      days: c.days,
      rules,
      segments: [{ hours: c.days.reduce((a, b) => a + b, 0), rateCents: cashCents }],
      tipCreditCentsPerHour: creditCents,
    });
    assert.ok(pay.totalCents > 0);
    assert.ok(pay.premiumCents >= 0);

    const m = manifest.find((x) => x.slug === c.slug);
    const html = fs.readFileSync(`dist/posts/${m.file}`, 'utf8');
    assert.ok(html.includes(st.tippedCashWage.toFixed(2)), `${c.slug} should include cash wage ${st.tippedCashWage.toFixed(2)}`);
  }
});

test('Engine re-computes tip pool and tax deduction examples for guide posts', () => {
  const pool = tipPool({
    totalTipsCents: 100000,
    method: 'hours',
    staff: [
      { name: 'Maya', role: 'Server', hours: 7 },
      { name: 'Luis', role: 'Server', hours: 7 },
      { name: 'Dana', role: 'Bartender', hours: 8 },
    ],
  });
  assert.equal(pool.rows.reduce((s, p) => s + p.shareCents, 0), 100000);

  const td = tipsDeduction({ qualifiedTipsCents: 1800000, magiCents: 9500000, filingStatus: 'single' });
  assert.equal(td, 1800000);

  const od = overtimeDeduction({ qualifiedOTPremiumCents: 800000, magiCents: 9500000, filingStatus: 'single' });
  assert.equal(od, 800000);
});
