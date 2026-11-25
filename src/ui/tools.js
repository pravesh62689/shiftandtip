// Client bundle: mounts tools on [data-tool] elements. Never touches .ad elements; never re-pushes ads.
import { tipPool } from '../engine/tips.js';
import { grossPay } from '../engine/overtime.js';
import { RULES } from '../engine/rules.js';
import { fmt } from '../engine/money.js';
import { takeHome, NO_WAGE_TAX_STATES } from '../engine/takehome.js';
import { tipsDeduction, overtimeDeduction } from '../engine/deductions.js';
import { paycheck } from '../engine/paycheck.js';

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ESC[c]);
const num = (v) => { const n = parseFloat(String(v).replace(/[^0-9.\-]/g, '')); return Number.isFinite(n) ? n : 0; };
const hrs = (v) => { const m = String(v).trim().match(/^(\d{1,2}):(\d{2})$/); return m ? +m[1] + +m[2] / 60 : num(v); };
const $ = (root, sel) => root.querySelector(sel);
const $$ = (root, sel) => Array.from(root.querySelectorAll(sel));
const track = (name, params) => { try { if (window.gtag) window.gtag('event', name, params || {}); } catch (e) { /* no-op */ } };
const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
};
const debounce = (fn, ms) => { let t; return () => { clearTimeout(t); t = setTimeout(fn, ms); }; };
const download = (name, text) => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv' }));
  a.download = name; document.body.appendChild(a); a.click(); a.remove();
};
const readHash = (key) => {
  const m = location.hash.match(new RegExp('[#&]' + key + '=([^&]+)'));
  if (!m) return null;
  try { return JSON.parse(decodeURIComponent(m[1])); } catch (e) { return null; }
};
const copy = async (text, btn) => {
  try {
    if (history.replaceState) history.replaceState(null, '', text);
    await navigator.clipboard.writeText(text);
    btn.textContent = 'Link copied';
  } catch (e) {
    btn.textContent = 'Copy failed';
  }
  setTimeout(() => { btn.textContent = 'Copy link'; }, 2000);
};
const field = (name, label, value, opts = {}) =>
  '<label class="field' + (opts.full ? ' field--full' : '') + '"><span class="field__label">' + label + '</span>' +
  '<span class="field__wrap">' + (opts.prefix ? '<span class="field__affix">' + opts.prefix + '</span>' : '') +
  '<input class="field__input" name="' + name + '" inputmode="decimal" value="' + esc(value) + '"' + (opts.prefix ? '' : ' style="padding-left:12px"') + '></span>' +
  (opts.help ? '<span class="field__help">' + opts.help + '</span>' : '') + '</label>';

/* ---------------- Tip pool ---------------- */
const TP_KEY = 'snt:tp:presets';
const TP_EXAMPLE = {
  tips: 1240, sales: 8000, method: 'hours',
  staff: [
    { role: 'Server', name: 'Maya', hours: 6.5, points: 1, percent: 0 },
    { role: 'Server', name: 'Luis', hours: 7, points: 1, percent: 0 },
    { role: 'Bartender', name: 'Dana', hours: 8, points: 1, percent: 0 },
    { role: 'Busser', name: 'Theo', hours: 5, points: 0.5, percent: 0 },
    { role: 'Host', name: 'Priya', hours: 4, points: 0.5, percent: 0 },
  ],
  outs: [{ label: 'Kitchen', pct: 3, basis: 'sales' }],
};
const METHODS = [['hours', 'Hours'], ['points', 'Points'], ['hoursXpoints', 'Hours × points'], ['percent', '% share']];
const WARN = {
  TIP_OUTS_EXCEED_TIPS: 'Tip-outs are larger than total tips. Check the percentages.',
  PERCENTS_NOT_100: 'Percent shares don’t add up to 100%. Shares were scaled proportionally.',
  MANAGER_IN_POOL: 'Watch out: under federal law, managers and supervisors can’t keep tips from the pool.',
};

function TipPool(root) {
  const clone = (o) => JSON.parse(JSON.stringify(o));
  let s = readHash('tp') || clone(TP_EXAMPLE);

  const staffRow = (p, i) =>
    '<tr class="staff__row" data-i="' + i + '">' +
    '<td><input class="field__input" name="role" aria-label="Role" value="' + esc(p.role) + '"></td>' +
    '<td><input class="field__input" name="name" aria-label="Name (optional)" placeholder="Name (optional)" value="' + esc(p.name) + '"></td>' +
    '<td><input class="field__input" name="hours" inputmode="decimal" aria-label="Hours" value="' + esc(p.hours) + '"></td>' +
    '<td data-col="points"><input class="field__input" name="points" inputmode="decimal" aria-label="Points" value="' + esc(p.points) + '"></td>' +
    '<td data-col="percent"><input class="field__input" name="percent" inputmode="decimal" aria-label="Percent share" value="' + esc(p.percent) + '"></td>' +
    '<td><label class="field__help"><input type="checkbox" name="mgr"' + (p.isManager ? ' checked' : '') + '> Manager</label></td>' +
    '<td><button type="button" class="btn btn--icon" data-act="del" aria-label="Remove person">&times;</button></td></tr>';
  const outRow = (o, i) =>
    '<div class="tool__grid tipout" data-i="' + i + '">' +
    '<label class="field"><span class="field__label">Tip-out to</span><input class="field__input" name="olabel" value="' + esc(o.label) + '" style="padding-left:12px"></label>' +
    '<label class="field"><span class="field__label">Percent of ' + (o.basis === 'sales' ? 'net sales' : 'tips') + '</span>' +
    '<span class="field__wrap"><input class="field__input" name="opct" inputmode="decimal" value="' + esc(o.pct) + '" style="padding-left:12px"><span class="field__affix field__affix--end">%</span></span></label>' +
    '<label class="field"><span class="field__label">Based on</span><select class="field__input" name="obasis"><option value="sales"' + (o.basis === 'sales' ? ' selected' : '') + '>Net sales</option><option value="tips"' + (o.basis === 'tips' ? ' selected' : '') + '>Total tips</option></select></label>' +
    '<div class="field" style="justify-content:flex-end"><button type="button" class="btn btn--text" data-act="delout">Remove tip-out</button></div></div>';

  const renderInputs = () => {
    const seg = METHODS.map((m) => '<button type="button" class="seg__btn' + (s.method === m[0] ? ' is-active' : '') + '" data-method="' + m[0] + '" aria-pressed="' + (s.method === m[0]) + '">' + m[1] + '</button>').join('');
    const presets = (store.get(TP_KEY) || []).map((p, i) => '<option value="' + i + '">' + esc(p.name) + '</option>').join('');
    root.innerHTML =
      '<div class="tool__grid">' +
      field('tips', 'Total tips', s.tips, { prefix: '$', help: 'Cash and card tips for the shift.' }) +
      field('sales', 'Net sales', s.sales, { prefix: '$', help: 'Only needed for tip-outs based on sales.' }) +
      '</div>' +
      '<div class="field" style="margin-top:16px"><span class="field__label">Split by</span><div class="seg" role="group" aria-label="Split method">' + seg + '</div></div>' +
      '<div class="table-wrap"><table class="staff" data-method="' + s.method + '"><thead><tr><th scope="col">Role</th><th scope="col">Name</th><th scope="col">Hours</th><th scope="col" data-col="points">Points</th><th scope="col" data-col="percent">% share</th><th scope="col"><span class="sr-only">Manager</span></th><th scope="col"><span class="sr-only">Actions</span></th></tr></thead><tbody>' +
      s.staff.map(staffRow).join('') + '</tbody></table></div>' +
      '<button type="button" class="btn btn--text" data-act="add">+ Add person</button>' +
      '<h2 style="margin-top:24px;font-size:20px">Tip-outs taken off the top</h2>' + s.outs.map(outRow).join('') +
      '<button type="button" class="btn btn--text" data-act="addout">+ Add tip-out</button>' +
      '<p class="field__help" style="margin-top:8px"><button type="button" class="btn btn--text" data-act="example">Use example</button> · <button type="button" class="btn btn--text" data-act="reset">Reset</button></p>' +
      '<div class="receipt" aria-live="polite" data-result></div>' +
      '<div class="presets"><label for="tp-pname" class="field__help">Save as preset</label><input id="tp-pname" class="field__input" name="pname" placeholder="e.g. Fri dinner">' +
      '<button type="button" class="btn btn--ghost" data-act="save">Save preset</button>' +
      (presets ? '<select class="field__input" data-act="load" aria-label="Load preset"><option value="">Load preset…</option>' + presets + '</select>' : '') + '</div>';
    renderResult();
  };

  const read = () => {
    s.tips = num($(root, '[name=tips]').value);
    s.sales = num($(root, '[name=sales]').value);
    s.staff = $$(root, '.staff__row').map((r) => ({
      role: $(r, '[name=role]').value, name: $(r, '[name=name]').value,
      hours: hrs($(r, '[name=hours]').value), points: num($(r, '[name=points]').value),
      percent: num($(r, '[name=percent]').value), isManager: $(r, '[name=mgr]').checked,
    }));
    s.outs = $$(root, '.tipout').map((r) => ({ label: $(r, '[name=olabel]').value, pct: num($(r, '[name=opct]').value), basis: $(r, '[name=obasis]').value }));
  };

  let last = null;
  const renderResult = () => {
    const r = tipPool({ totalTipsCents: Math.round(s.tips * 100), salesCents: Math.round(s.sales * 100), method: s.method, staff: s.staff, tipOuts: s.outs });
    last = r;
    const rows = r.rows.map((p) =>
      '<div class="receipt__row"><span>' + esc(p.name || p.role) + ' <span class="receipt__sub">' + esc(p.name ? p.role : '') + '</span></span>' +
      '<span><span class="num">' + fmt(p.shareCents) + '</span>' + (p.perHourCents != null ? ' <span class="receipt__sub num">' + fmt(p.perHourCents) + '/hr</span>' : '') + '</span></div>').join('');
    const outs = r.tipOuts.map((o) => '<div class="receipt__row"><span>' + esc(o.label) + ' tip-out</span><span class="num">' + fmt(o.cents) + '</span></div>').join('');
    const warns = r.warnings.map((w) => '<div class="warn' + (w === 'TIP_OUTS_EXCEED_TIPS' ? ' warn--error' : '') + '">' + WARN[w] + '</div>').join('');
    $(root, '[data-result]').innerHTML =
      '<div class="receipt__title">Payouts</div>' + rows + outs +
      '<div class="receipt__total"><span>Total tips</span><span class="num">' + fmt(Math.round(s.tips * 100)) + '</span></div>' +
      '<div class="receipt__check">Allocated <span class="num">' + fmt(r.checkCents) + '</span> of <span class="num">' + fmt(Math.round(s.tips * 100)) + '</span></div>' + warns +
      '<div class="receipt__actions"><button type="button" class="btn btn--ghost" data-act="copy">Copy link</button>' +
      '<label class="field__help"><input type="checkbox" data-act="names"> Include names in link</label>' +
      '<button type="button" class="btn btn--ghost" data-act="csv">Export CSV</button>' +
      '<button type="button" class="btn btn--ghost" data-act="print">Print</button></div>';
    track('calc_run', { tool: 'tip-pool' });
  };

  const live = debounce(() => { read(); renderResult(); }, 150);
  root.addEventListener('input', (e) => { if (e.target.name !== 'pname' && !e.target.dataset.act) live(); });
  root.addEventListener('change', (e) => {
    if (e.target.name === 'obasis' || e.target.name === 'mgr') { read(); renderInputs(); }
    if (e.target.dataset.act === 'load' && e.target.value !== '') {
      const p = (store.get(TP_KEY) || [])[+e.target.value];
      if (p) { s = clone(p.state); renderInputs(); }
    }
  });
  root.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const act = b.dataset.act; const method = b.dataset.method;
    if (method) { read(); s.method = method; renderInputs(); return; }
    if (!act) return;
    read();
    if (act === 'add') { s.staff.push({ role: 'Server', name: '', hours: 0, points: 1, percent: 0 }); renderInputs(); }
    else if (act === 'del') { s.staff.splice(+b.closest('tr').dataset.i, 1); renderInputs(); }
    else if (act === 'addout') { s.outs.push({ label: 'Bar', pct: 1, basis: 'sales' }); renderInputs(); }
    else if (act === 'delout') { s.outs.splice(+b.closest('.tipout').dataset.i, 1); renderInputs(); }
    else if (act === 'example') { s = clone(TP_EXAMPLE); renderInputs(); }
    else if (act === 'reset') { s = { tips: 0, sales: 0, method: 'hours', staff: [{ role: 'Server', name: '', hours: 0, points: 1, percent: 0 }], outs: [] }; renderInputs(); }
    else if (act === 'save') {
      const name = ($(root, '[name=pname]').value || '').trim() || 'Preset ' + new Date().toLocaleDateString('en-US');
      const list = (store.get(TP_KEY) || []).filter((p) => p.name !== name).slice(-9);
      list.push({ name, state: s });
      b.textContent = store.set(TP_KEY, list) ? 'Saved' : 'Storage unavailable';
      track('preset_save', { tool: 'tip-pool' }); setTimeout(renderInputs, 900);
    } else if (act === 'copy') {
      const withNames = $(root, '[data-act=names]').checked;
      const share = clone(s); if (!withNames) share.staff.forEach((p) => { p.name = ''; });
      copy(location.href.split('#')[0] + '#tp=' + encodeURIComponent(JSON.stringify(share)), b);
      track('share_link', { tool: 'tip-pool' });
    } else if (act === 'csv') {
      const lines = [['Role', 'Name', 'Hours', 'Share', 'Per hour']].concat(last.rows.map((p) => [p.role, p.name || '', p.hours, (p.shareCents / 100).toFixed(2), p.perHourCents != null ? (p.perHourCents / 100).toFixed(2) : '']));
      last.tipOuts.forEach((o) => lines.push([o.label + ' tip-out', '', '', (o.cents / 100).toFixed(2), '']));
      download('tip-pool.csv', lines.map((l) => l.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n'));
      track('csv_export', { tool: 'tip-pool' });
    } else if (act === 'print') { track('print', { tool: 'tip-pool' }); window.print(); }
  });
  renderInputs();
}

/* ---------------- Overtime & double time ---------------- */
const OT_STATES = [['FED', 'Federal rules (most states)'], ['CA', 'California'], ['AK', 'Alaska'], ['CO', 'Colorado']]
  .concat(RULES.NV.stateMinWage != null ? [['NV', 'Nevada']] : []);
const OT_NOTES = {
  CA: 'Daily overtime after 8 hours, double time after 12, and the seventh-consecutive-day rule. Alternative workweek schedules are not modelled.',
  AK: 'Daily overtime after 8 hours applies to employers with 4 or more employees.',
  CO: 'Daily overtime after 12 hours. Colorado also counts 12 consecutive hours across midnight, which this calculator does not model.',
  NV: 'Daily overtime after 8 hours applies only below 1.5× the Nevada minimum wage.',
  FED: 'Overtime after 40 hours in the workweek at 1.5× the regular rate.',
};
const DAYS = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];

function Overtime(root) {
  const pre = (root.dataset.state || 'CA').toUpperCase();
  let s = readHash('ot') || { st: OT_STATES.some((x) => x[0] === pre) ? pre : 'FED', rate: 20, days: [10, 8, 12.5, 9, 8, 0, 0] };
  const renderInputs = () => {
    root.innerHTML =
      '<div class="tool__grid"><label class="field"><span class="field__label">State rules</span><select class="field__input" name="st">' +
      OT_STATES.map((x) => '<option value="' + x[0] + '"' + (s.st === x[0] ? ' selected' : '') + '>' + x[1] + '</option>').join('') + '</select></label>' +
      field('rate', 'Hourly rate', s.rate, { prefix: '$' }) + '</div>' +
      '<div class="field" style="margin-top:16px"><span class="field__label">Hours worked each day (start with day 1 of your workweek)</span><div class="week">' +
      s.days.map((h, i) => '<label class="field"><span class="field__label">' + DAYS[i] + '</span><input class="field__input" name="d' + i + '" inputmode="decimal" value="' + esc(h) + '"></label>').join('') +
      '</div><span class="field__help">Use decimals (7.5) or hours:minutes (7:30).</span></div>' +
      '<div class="receipt" aria-live="polite" data-result></div>';
    renderResult();
  };
  const read = () => {
    s.st = $(root, '[name=st]').value; s.rate = num($(root, '[name=rate]').value);
    s.days = DAYS.map((_, i) => Math.min(24, Math.max(0, hrs($(root, '[name=d' + i + ']').value))));
  };
  const renderResult = () => {
    const total = s.days.reduce((a, b) => a + b, 0);
    const seg = [{ hours: total, rateCents: Math.round(s.rate * 100) }];
    let rule = RULES[s.st];
    let isPending = false;
    if (!rule || (s.st === 'NV' && rule.stateMinWage == null)) {
      rule = RULES.FED;
      isPending = true;
    }
    const g = grossPay({ days: s.days, rules: rule, segments: seg });
    const f = grossPay({ days: s.days, rules: RULES.FED, segments: seg });
    const diff = g.totalCents - f.totalCents;
    const table = '<div class="table-wrap"><table class="data"><thead><tr><th>Day</th><th>Regular</th><th>OT 1.5×</th><th>DT 2×</th></tr></thead><tbody>' +
      g.days.map((d, i) => '<tr><td>' + DAYS[i] + '</td><td class="n">' + d.reg + '</td><td class="n">' + d.ot + '</td><td class="n">' + d.dt + '</td></tr>').join('') + '</tbody></table></div>';
    const pendingHtml = isPending ? '<div class="warn warn--info" style="margin-top:8px">State figures pending verification — federal rules shown.</div>' : '';
    $(root, '[data-result]').innerHTML =
      '<div class="receipt__title">This week</div>' + pendingHtml +
      '<div class="receipt__row"><span>Regular</span><span class="num">' + g.reg + ' h</span></div>' +
      '<div class="receipt__row"><span>Overtime 1.5×</span><span class="num">' + g.ot + ' h</span></div>' +
      '<div class="receipt__row"><span>Double time 2×</span><span class="num">' + g.dt + ' h</span></div>' +
      '<div class="receipt__total"><span>Gross pay</span><span class="num">' + fmt(g.totalCents) + '</span></div>' +
      (s.st !== 'FED' && !isPending ? '<div class="receipt__compare">Federal-only rules would pay ' + fmt(f.totalCents) + (diff ? ' (' + (diff > 0 ? '+' : '−') + fmt(Math.abs(diff)) + ' under ' + s.st + ' rules)' : ' (no difference this week)') + '</div>' : '') +
      '<p class="field__help" style="margin-top:8px">' + (OT_NOTES[s.st] || OT_NOTES.FED) + ' Estimate only; exempt employees and special schedules differ.</p>' + table +
      '<div class="receipt__actions"><button type="button" class="btn btn--ghost" data-act="copy">Copy link</button><button type="button" class="btn btn--ghost" data-act="print">Print</button></div>';
    track('calc_run', { tool: 'overtime', state: s.st });
  };
  const live = debounce(() => { read(); renderResult(); }, 150);
  root.addEventListener('input', live);
  root.addEventListener('change', (e) => { if (e.target.name === 'st') { read(); renderResult(); track('state_change', { tool: 'overtime', state: s.st }); } });
  root.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-act]'); if (!b) return;
    if (b.dataset.act === 'copy') { copy(location.href.split('#')[0] + '#ot=' + encodeURIComponent(JSON.stringify(s)), b); track('share_link', { tool: 'overtime' }); }
    if (b.dataset.act === 'print') { track('print', { tool: 'overtime' }); window.print(); }
  });
  renderInputs();
}

/* ---------------- Simple tools (tip-out, shift differential, tipped OT, take-home, deduction) ---------------- */
const cents = (v) => Math.round(v * 100);
const row = (l, v) => '<div class="receipt__row"><span>' + l + '</span><span class="num">' + v + '</span></div>';
const total = (l, v) => '<div class="receipt__total"><span>' + l + '</span><span class="num">' + v + '</span></div>';
const sel = (name, label, val, opts) => '<label class="field"><span class="field__label">' + label + '</span><select class="field__input" name="' + name + '">' +
  opts.map((o) => '<option value="' + o[0] + '"' + (String(val) === String(o[0]) ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select></label>';
const rd = (root, s, keys) => keys.forEach((k) => {
  const el = $(root, '[name=' + k + ']');
  if (!el) return;
  s[k] = el.tagName === 'SELECT' ? (isNaN(Number(el.value)) ? el.value : Number(el.value)) : num(el.value);
});

const simple = (id, b) => (root) => {
  let s = readHash(id) || b.defaults();
  const result = () => {
    let html;
    try { html = b.result(s) + '<div class="receipt__actions"><button type="button" class="btn btn--ghost" data-act="copy">Copy link</button><button type="button" class="btn btn--ghost" data-act="print">Print</button></div>'; track('calc_run', { tool: id }); }
    catch (e) { html = '<div class="warn warn--error">Check your entries and try again.</div>'; }
    $(root, '[data-result]').innerHTML = html;
  };
  const render = () => { root.innerHTML = b.form(s) + '<div class="receipt" aria-live="polite" data-result></div>'; result(); };
  const live = debounce(() => { b.read(root, s); result(); }, 150);
  root.addEventListener('input', live);
  root.addEventListener('change', () => { b.read(root, s); if (b.rerender) render(); else result(); });
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-act]'); if (!btn) return;
    if (btn.dataset.act === 'copy') { copy(location.href.split('#')[0] + '#' + id + '=' + encodeURIComponent(JSON.stringify(s)), btn); track('share_link', { tool: id }); }
    if (btn.dataset.act === 'print') { track('print', { tool: id }); window.print(); }
  });
  render();
};
const DOL = '$';

const TipOut = simple('tipout', {
  defaults: () => ({ sales: 3000, tips: 620, bar: 3, busser: 2, runner: 1, basis: 'sales' }),
  form: (s) => '<div class="tool__grid">' + field('sales', 'Your net sales', s.sales, { prefix: DOL }) + field('tips', 'Your tips', s.tips, { prefix: DOL }) +
    sel('basis', 'Tip-out is based on', s.basis, [['sales', 'Net sales'], ['tips', 'Tips']]) + '</div><div class="tool__grid" style="margin-top:16px">' +
    field('bar', 'Bar %', s.bar, { prefix: '%' }) + field('busser', 'Busser %', s.busser, { prefix: '%' }) + field('runner', 'Food runner %', s.runner, { prefix: '%' }) +
    '</div><p class="field__help">Percentages are examples, not a standard. Use your restaurant’s policy.</p>',
  read: (r, s) => rd(r, s, ['sales', 'tips', 'bar', 'busser', 'runner', 'basis']),
  result: (s) => {
    const base = cents(s.basis === 'sales' ? s.sales : s.tips), tips = cents(s.tips);
    const o = [['Bar', s.bar], ['Bussers', s.busser], ['Food runners', s.runner]].map((x) => [x[0], Math.round(base * x[1] / 100)]);
    const out = o.reduce((a, x) => a + x[1], 0);
    return '<div class="receipt__title">Tip-out owed</div>' + o.map((x) => row(x[0], fmt(x[1]))).join('') + total('Total tip-out', fmt(out)) + row('You keep', fmt(tips - out)) +
      (out > tips ? '<div class="warn warn--error">Tip-outs are larger than your tips.</div>' : '');
  },
});

const ShiftDiff = simple('shift-differential', {
  defaults: () => ({ base: 20, diff: 3, h1: 30, h2: 15, bonus: 0 }),
  form: (s) => '<div class="tool__grid">' + field('base', 'Base hourly rate', s.base, { prefix: DOL }) +
    field('diff', 'Differential per hour', s.diff, { prefix: DOL, help: 'Added to the base rate on differential shifts.' }) +
    field('h1', 'Base-rate hours', s.h1, {}) + field('h2', 'Differential hours', s.h2, {}) + field('bonus', 'Nondiscretionary bonus', s.bonus, { prefix: DOL }) + '</div>',
  read: (r, s) => rd(r, s, ['base', 'diff', 'h1', 'h2', 'bonus']),
  result: (s) => {
    const d = []; let left = s.h1 + s.h2;
    for (let i = 0; i < 7; i++) { const h = Math.min(left, 10); d.push(h); left -= h; }
    if (left > 0) throw new Error('TOO_MANY_HOURS');
    const seg = [{ hours: s.h1, rateCents: cents(s.base) }, { hours: s.h2, rateCents: cents(s.base + s.diff) }];
    const g = grossPay({ days: d, rules: RULES.FED, segments: seg, bonusCents: cents(s.bonus) });
    const naive = g.straightTimeCents + Math.round(cents(s.base) * 0.5 * g.ot);
    return '<div class="receipt__title">Blended overtime</div>' + row('Overtime hours (over 40)', g.ot + ' h') + row('Blended regular rate', fmt(g.regularRateCents) + '/hr') +
      row('Overtime premium (0.5×)', fmt(g.premiumCents)) + total('Gross pay', fmt(g.totalCents)) +
      '<div class="receipt__compare">Using only the base rate for overtime would pay ' + fmt(naive) + ' (' + fmt(g.totalCents - naive) + ' less).</div>';
  },
});

const NY_REGIONS = [
  ['NYC', 'New York City ($11.35 cash / $5.65 credit)'],
  ['LI_WEST', 'Long Island & Westchester ($11.35 cash / $5.65 credit)'],
  ['REST', 'Remainder of State ($10.70 cash / $5.30 credit)']
];

const TippedOT = simple('tipped-overtime', {
  rerender: true,
  defaults: () => ({ st: 'FED', region: 'NYC', cash: 2.13, credit: 5.12, hours: 45 }),
  form: (s) => '<div class="tool__grid">' +
    sel('st', 'Jurisdiction', s.st || 'FED', [['FED', 'Federal rules (standard)'], ['NY', 'New York (Regional rates)']]) +
    (s.st === 'NY' ? sel('region', 'New York region', s.region || 'NYC', NY_REGIONS) : '') +
    field('cash', 'Cash wage', s.cash, { prefix: DOL }) +
    field('credit', 'Tip credit', s.credit, { prefix: DOL, help: 'Federal example: $2.13 + $5.12 = $7.25. Use your state’s values.' }) +
    field('hours', 'Hours this week', s.hours, {}) + '</div>',
  read: (r, s) => {
    const prevSt = s.st;
    const prevReg = s.region;
    rd(r, s, ['st', 'region', 'cash', 'credit', 'hours']);
    if (s.st === 'NY') {
      if (prevSt !== 'NY' || prevReg !== s.region) {
        if (s.region === 'REST') { s.cash = 10.70; s.credit = 5.30; }
        else { s.cash = 11.35; s.credit = 5.65; }
      }
    } else if (prevSt === 'NY' && s.st !== 'NY') {
      s.cash = 2.13;
      s.credit = 5.12;
    }
  },
  result: (s) => {
    let pendingMsg = '';
    let cash = s.cash;
    let credit = s.credit;
    if (cash == null || isNaN(cash) || cash <= 0 || credit == null || isNaN(credit)) {
      cash = 2.13;
      credit = 5.12;
      pendingMsg = '<div class="warn warn--info">State figures pending verification — federal rules shown.</div>';
    }
    const full = cents(cash + credit), ot = Math.max(0, (s.hours || 0) - 40), reg = (s.hours || 0) - ot;
    const otCash = Math.max(0, Math.round(full * 1.5) - cents(credit));
    const d = []; let left = s.hours || 0;
    for (let i = 0; i < 7; i++) { const h = Math.min(left, 10); d.push(h); left -= h; }
    const g = grossPay({ days: d, rules: RULES.FED, segments: [{ hours: s.hours || 0, rateCents: cents(cash) }], tipCreditCentsPerHour: cents(credit) });
    return '<div class="receipt__title">Tipped overtime</div>' + pendingMsg + row('Overtime cash wage', fmt(otCash) + '/hr') + row('Regular hours', reg + ' h') + row('Overtime hours', ot + ' h') +
      total('Weekly cash pay', fmt(g.totalCents)) + '<p class="field__help">Overtime is 1.5× the full minimum wage, minus the tip credit. Tips must still bring total pay up to the full minimum wage.</p>';
  },
});

const STATES = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
const TakeHome = simple('take-home', {
  rerender: true,
  defaults: () => ({ wages: 600, tips: 900, per: 26, fed: 10, state: 4, sc: 'OH' }),
  form: (s) => '<div class="tool__grid">' + field('wages', 'Wages this pay period', s.wages, { prefix: DOL }) + field('tips', 'Tips this pay period (cash + card)', s.tips, { prefix: DOL }) +
    sel('per', 'Pay period', s.per, [[52, 'Weekly'], [26, 'Every two weeks'], [24, 'Twice a month'], [12, 'Monthly']]) +
    field('fed', 'Federal income tax rate (estimate)', s.fed, { prefix: '%' }) + sel('sc', 'State', s.sc, STATES.map((c) => [c, c])) +
    (NO_WAGE_TAX_STATES.includes(s.sc) ? '' : field('state', 'State income tax rate (estimate)', s.state, { prefix: '%' })) +
    '</div><p class="field__help">Estimate only. In this version the federal and state rates are your own estimates.</p>',
  read: (r, s) => { rd(r, s, ['wages', 'tips', 'per', 'fed', 'sc']); const st = $(r, '[name=state]'); if (st) s.state = num(st.value); },
  result: (s) => {
    const t = takeHome({ wagesCents: cents(s.wages), tipsCents: cents(s.tips), periodsPerYear: +s.per, fedRatePct: s.fed, stateRatePct: s.state, stateCode: s.sc });
    return '<div class="receipt__title">Estimated take-home</div>' + row('Gross (wages + tips)', fmt(t.grossCents)) + row('Social Security (6.2%)', '−' + fmt(t.ssCents)) +
      row('Medicare (1.45%)', '−' + fmt(t.medCents)) + row('Federal income tax (est.)', '−' + fmt(t.fedCents)) + row('State income tax (est.)', '−' + fmt(t.stateCents)) + total('Estimated net', fmt(t.netCents));
  },
});

const Deduction = simple('tips-ot-deduction', {
  defaults: () => ({ tips: 18000, otp: 4000, magi: 80000, fs: 'single', bracket: 12 }),
  form: (s) => '<div class="tool__grid">' + field('tips', 'Qualified tips for the year', s.tips, { prefix: DOL }) +
    field('otp', 'Overtime premium (the “half” of time-and-a-half)', s.otp, { prefix: DOL }) + field('magi', 'Modified adjusted gross income', s.magi, { prefix: DOL }) +
    sel('fs', 'Filing status', s.fs, [['single', 'Single'], ['mfj', 'Married filing jointly'], ['hoh', 'Head of household'], ['mfs', 'Married filing separately']]) +
    field('bracket', 'Your federal tax bracket (est.)', s.bracket, { prefix: '%' }) + '</div>' +
    '<p class="field__help">2025–2028 federal deductions. Limits and phase-outs follow IRS rules; confirm at irs.gov before relying on this.</p>',
  read: (r, s) => rd(r, s, ['tips', 'otp', 'magi', 'fs', 'bracket']),
  result: (s) => {
    const a = tipsDeduction({ qualifiedTipsCents: cents(s.tips), magiCents: cents(s.magi), filingStatus: s.fs });
    const b = overtimeDeduction({ qualifiedOTPremiumCents: cents(s.otp), magiCents: cents(s.magi), filingStatus: s.fs });
    return '<div class="receipt__title">Estimated deductions</div>' + row('Tips deduction', fmt(a)) + row('Overtime deduction', fmt(b)) + total('Total deduction', fmt(a + b)) +
      '<div class="receipt__compare">At a ' + s.bracket + '% bracket, estimated federal tax savings: ' + fmt(Math.round((a + b) * s.bracket / 100)) + '</div>' +
      (s.fs === 'mfs' ? '<div class="warn">Married filing separately gets no deduction under these rules.</div>' : '');
  },
});

const Paycheck = simple('paycheck', {
  rerender: true,
  defaults: () => ({ wages: 1200, tips: 400, ot: 0, per: 26, fs: 'single', sc: 'CA' }),
  form: (s) => '<div class="tool__grid">' +
    field('wages', 'Regular wages (per pay period)', s.wages, { prefix: DOL }) +
    field('tips', 'Reported tips (cash + card)', s.tips, { prefix: DOL }) +
    field('ot', 'Overtime earnings (if any)', s.ot, { prefix: DOL }) +
    sel('per', 'Pay frequency', s.per, [[52, 'Weekly (52/yr)'], [26, 'Biweekly (26/yr)'], [24, 'Semimonthly (24/yr)'], [12, 'Monthly (12/yr)']]) +
    sel('fs', 'Filing status', s.fs, [['single', 'Single'], ['mfj', 'Married filing jointly'], ['hoh', 'Head of household'], ['mfs', 'Married filing separately']]) +
    sel('sc', 'State', s.sc, STATES.map((c) => [c, c])) +
    '</div><p class="field__help">Calculates 2026/2027 statutory withholding: Federal income tax, FICA (Social Security & Medicare), and state income tax.</p>',
  read: (r, s) => rd(r, s, ['wages', 'tips', 'ot', 'per', 'fs', 'sc']),
  result: (s) => {
    const res = paycheck({
      wagesCents: cents(s.wages),
      tipsCents: cents(s.tips),
      overtimeCents: cents(s.ot),
      periodsPerYear: +s.per,
      filingStatus: s.fs,
      stateCode: s.sc
    });
    return '<div class="receipt__title">Paycheck Withholding Summary (' + s.sc + ')</div>' +
      row('Gross Pay', fmt(res.grossCents)) +
      row('Social Security (6.2%)', '−' + fmt(res.ssCents)) +
      row('Medicare (1.45%)', '−' + fmt(res.medCents)) +
      row('Federal Income Tax', '−' + fmt(res.fedCents)) +
      row('State Income Tax (' + s.sc + ')', (res.stateCents === 0 ? '$0.00' : '−' + fmt(res.stateCents))) +
      total('Take-Home Pay', fmt(res.netCents)) +
      '<div class="receipt__compare">Effective tax rate: ' + res.effectiveTaxRatePct + '% (Annualized gross: ' + fmt(res.annualGrossCents) + ')</div>';
  }
});

/* ---------------- Boot ---------------- */
const TOOLS = { 'tip-pool': TipPool, overtime: Overtime, 'tip-out': TipOut, 'shift-differential': ShiftDiff, 'tipped-overtime': TippedOT, 'take-home': TakeHome, 'tips-ot-deduction': Deduction, paycheck: Paycheck };
const boot = () => {
  const els = $$(document, '[data-tool]');
  const init = (el) => {
    const fn = TOOLS[el.getAttribute('data-tool')];
    if (fn && !el.dataset.ready) {
      el.dataset.ready = '1';
      try { fn(el); } catch (err) { el.insertAdjacentHTML('beforeend', '<p class="warn warn--error">The calculator failed to load. Please refresh.</p>'); }
    }
  };
  const mount = () => els.forEach(init);
  if (typeof requestAnimationFrame !== 'undefined') {
    requestAnimationFrame(() => setTimeout(mount, 0));
  } else {
    setTimeout(mount, 0);
  }

  // Affiliate Click Tracking (GA4)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('.affiliate-box__btn, [data-affiliate] a');
    if (btn) {
      const box = btn.closest('.affiliate-box, [data-affiliate]');
      const program = box ? box.getAttribute('data-affiliate') : 'partner';
      track('affiliate_click', { program, page: location.pathname });
    }
  });
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
