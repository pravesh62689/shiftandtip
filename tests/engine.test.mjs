import test from 'node:test';
import assert from 'node:assert/strict';
import { allocate } from '../src/engine/money.js';
import { tipPool } from '../src/engine/tips.js';
import { splitHours, grossPay } from '../src/engine/overtime.js';
import { tipsDeduction, overtimeDeduction } from '../src/engine/deductions.js';
import { RULES } from '../src/engine/rules.js';

const staff = [{ role: 'Server', hours: 6.5 }, { role: 'Server', hours: 7 }, { role: 'Bartender', hours: 8 }, { role: 'Busser', hours: 5 }, { role: 'Host', hours: 4 }];

test('allocate sums exactly', () => assert.deepEqual(allocate(100000, [650, 700, 800, 500, 400]), [21311, 22951, 26230, 16393, 13115]));
test('tip pool + kitchen tip-out', () => {
  const r = tipPool({ totalTipsCents: 124000, salesCents: 800000, staff, tipOuts: [{ label: 'Kitchen', pct: 3, basis: 'sales' }] });
  assert.equal(r.tipOuts[0].cents, 24000);
  assert.deepEqual(r.rows.map((x) => x.shareCents), [21311, 22951, 26230, 16393, 13115]);
  assert.equal(r.checkCents, 124000);
});
test('manager warning', () => assert.ok(tipPool({ totalTipsCents: 1000, staff: [{ hours: 1, isManager: true }] }).warnings.includes('MANAGER_IN_POOL')));
test('CA daily OT + DT', () => { const s = splitHours([10, 8, 12.5, 9, 8, 0, 0], RULES.CA); assert.deepEqual([s.reg, s.ot, s.dt], [40, 7, 0.5]); });
test('FED weekly only', () => { const s = splitHours([10, 8, 12.5, 9, 8, 0, 0], RULES.FED); assert.deepEqual([s.reg, s.ot, s.dt], [40, 7.5, 0]); });
test('CA seventh day', () => { const s = splitHours([6, 6, 6, 6, 6, 6, 9], RULES.CA); assert.deepEqual([s.reg, s.ot, s.dt], [36, 8, 1]); });
test('CA weekly conversion', () => { const s = splitHours([9, 9, 9, 9, 9, 9, 0], RULES.CA); assert.deepEqual([s.reg, s.ot, s.dt], [40, 14, 0]); });
test('CO daily over 12', () => { const s = splitHours([13, 13, 13, 0, 0, 0, 0], RULES.CO); assert.deepEqual([s.reg, s.ot, s.dt], [36, 3, 0]); });
test('NV needs data', () => assert.throws(() => splitHours([9, 0, 0, 0, 0, 0, 0], RULES.NV), /DATA_MISSING/));
test('CA gross $20/hr', () => assert.equal(grossPay({ days: [10, 8, 12.5, 9, 8, 0, 0], rules: RULES.CA, segments: [{ hours: 47.5, rateCents: 2000 }] }).totalCents, 103000));
test('FED gross same week', () => assert.equal(grossPay({ days: [10, 8, 12.5, 9, 8, 0, 0], rules: RULES.FED, segments: [{ hours: 47.5, rateCents: 2000 }] }).totalCents, 102500));
test('blended regular rate', () => {
  const g = grossPay({ days: [9, 9, 9, 9, 9, 0, 0], rules: RULES.FED, segments: [{ hours: 30, rateCents: 2000 }, { hours: 15, rateCents: 2300 }] });
  assert.equal(g.regularRateCents, 2100); assert.equal(g.totalCents, 99750);
});
test('tipped OT federal ($2.13 + $5.12 credit)', () =>
  assert.equal(grossPay({ days: [9, 9, 9, 9, 9, 0, 0], rules: RULES.FED, segments: [{ hours: 45, rateCents: 213 }], tipCreditCentsPerHour: 512 }).totalCents, 11398));
test('tips deduction cap + phase-out', () => {
  assert.equal(tipsDeduction({ qualifiedTipsCents: 3000000, magiCents: 10000000, filingStatus: 'single' }), 2500000);
  assert.equal(tipsDeduction({ qualifiedTipsCents: 3000000, magiCents: 16050000, filingStatus: 'single' }), 2400000);
  assert.equal(tipsDeduction({ qualifiedTipsCents: 3000000, magiCents: 10000000, filingStatus: 'mfs' }), 0);
});
test('OT deduction joint cap', () => assert.equal(overtimeDeduction({ qualifiedOTPremiumCents: 3000000, magiCents: 20000000, filingStatus: 'mfj' }), 2500000));
