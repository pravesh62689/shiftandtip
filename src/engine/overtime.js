// days: 7 numbers in workweek order. Returns hours split into regular / OT (1.5x) / DT (2x).
export function splitHours(days, rules, opts = {}) {
  if (days.length !== 7 || days.some((h) => !(h >= 0 && h <= 24))) throw new Error('INVALID_DAYS');
  const q = (x) => Math.round(x * 100);
  const d = days.map(q);

  let applyDaily = !!rules.dailyOT;
  if (rules.dailyOTRateCapMultiple) {
    if (rules.stateMinWage == null) throw new Error('DATA_MISSING_STATE_MIN_WAGE');
    if (opts.regularRate != null && opts.regularRate >= rules.dailyOTRateCapMultiple * rules.stateMinWage) applyDaily = false;
  }
  const workedAll7 = d.every((h) => h > 0);

  const out = d.map((h, i) => {
    if (rules.seventhDay && workedAll7 && i === 6) {
      const first8 = Math.min(h, 800);
      return { reg: 0, ot: first8, dt: h - first8 };
    }
    if (!applyDaily) return { reg: h, ot: 0, dt: 0 };
    const dtStart = rules.dailyDT ? q(rules.dailyDT) : Infinity;
    const otStart = q(rules.dailyOT);
    const dt = Math.max(0, h - dtStart);
    const ot = Math.max(0, Math.min(h, dtStart) - otStart);
    return { reg: h - ot - dt, ot, dt };
  });

  // Weekly OT: regular hours beyond the weekly threshold convert to OT, latest days first (no pyramiding).
  let excess = Math.max(0, out.reduce((a, x) => a + x.reg, 0) - q(rules.weeklyOT ?? 40));
  for (let i = 6; i >= 0 && excess > 0; i--) {
    const move = Math.min(out[i].reg, excess);
    out[i].reg -= move; out[i].ot += move; excess -= move;
  }
  const sum = (k) => out.reduce((a, x) => a + x[k], 0) / 100;
  return { days: out.map((x) => ({ reg: x.reg / 100, ot: x.ot / 100, dt: x.dt / 100 })), reg: sum('reg'), ot: sum('ot'), dt: sum('dt') };
}

// segments: straight-time pieces [{ hours, rateCents }] (rate includes any shift differential).
// FLSA regular rate = (all straight-time pay + nondiscretionary bonus + tip credit) / total hours.
// Premium = 0.5 x RR per OT hour, 1.0 x RR per DT hour (straight time already paid in segments).
export function grossPay({ days, rules, segments, bonusCents = 0, tipCreditCentsPerHour = 0 }) {
  const totalHours = days.reduce((a, b) => a + b, 0);
  const segHours = segments.reduce((a, s) => a + s.hours, 0);
  if (Math.abs(segHours - totalHours) > 0.001) throw new Error('HOURS_MISMATCH');
  const stCents = Math.round(segments.reduce((a, s) => a + s.hours * s.rateCents, 0)) + bonusCents;
  const tipCredit = Math.round(totalHours * tipCreditCentsPerHour);
  const rr = totalHours > 0 ? (stCents + tipCredit) / totalHours : 0;
  const split = splitHours(days, rules, { regularRate: rr / 100 });
  const premiumCents = Math.round(rr * (0.5 * split.ot + 1.0 * split.dt));
  return { ...split, regularRateCents: Math.round(rr), straightTimeCents: stCents, premiumCents, totalCents: stCents + premiumCents };
}
