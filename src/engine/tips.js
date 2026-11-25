import { allocate } from './money.js';

// staff: [{ role, name?, hours, points?, percent?, isManager? }]
// tipOuts: [{ label, pct, basis: 'sales' | 'tips' }]
export function tipPool({ totalTipsCents, salesCents = 0, method = 'hours', staff, tipOuts = [] }) {
  const warnings = [];
  const outs = tipOuts.map((t) => ({
    label: t.label,
    cents: Math.round(((t.basis === 'sales' ? salesCents : totalTipsCents) * t.pct) / 100),
  }));
  const outTotal = outs.reduce((a, o) => a + o.cents, 0);
  if (outTotal > totalTipsCents) warnings.push('TIP_OUTS_EXCEED_TIPS');
  const pool = Math.max(0, totalTipsCents - outTotal);

  const w = staff.map((s) => {
    const h = Math.round((s.hours || 0) * 100);
    const p = Math.round((s.points || 0) * 100);
    switch (method) {
      case 'hours': return h;
      case 'points': return p;
      case 'hoursXpoints': return h * p;
      case 'percent': return Math.round((s.percent || 0) * 100);
      default: throw new Error('UNKNOWN_METHOD');
    }
  });
  if (method === 'percent' && w.reduce((a, b) => a + b, 0) !== 10000) warnings.push('PERCENTS_NOT_100');
  if (staff.some((s) => s.isManager)) warnings.push('MANAGER_IN_POOL'); // FLSA 3(m)(2)(B)

  const shares = allocate(pool, w);
  return {
    tipOuts: outs,
    poolCents: pool,
    warnings,
    rows: staff.map((s, i) => ({ ...s, shareCents: shares[i], perHourCents: s.hours > 0 ? Math.round(shares[i] / s.hours) : null })),
    checkCents: Math.min(outTotal, totalTipsCents) + shares.reduce((a, b) => a + b, 0),
  };
}
