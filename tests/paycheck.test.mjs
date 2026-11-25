// tests/paycheck.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { paycheck } from '../src/engine/paycheck.js';

test('Paycheck: Gross sums wages, tips, and overtime', () => {
  const res = paycheck({
    wagesCents: 100000, // $1,000
    tipsCents: 50000,   // $500
    overtimeCents: 25000, // $250
    periodsPerYear: 26,
    filingStatus: 'single',
    stateCode: 'TX'
  });

  assert.equal(res.grossCents, 175000);
  assert.equal(res.annualGrossCents, 175000 * 26);
});

test('Paycheck: Zero wage-tax state (Texas) has 0 state tax', () => {
  const res = paycheck({
    wagesCents: 200000, // $2,000 biweekly ($52,000/yr)
    periodsPerYear: 26,
    filingStatus: 'single',
    stateCode: 'TX'
  });

  assert.equal(res.stateCents, 0);
  assert.equal(res.ssCents, Math.round(200000 * 0.062)); // 6.2%
  assert.equal(res.medCents, Math.round(200000 * 0.0145)); // 1.45%
  assert.ok(res.fedCents > 0, 'Federal tax should be deducted');
  assert.equal(res.netCents, res.grossCents - res.ssCents - res.medCents - res.fedCents);
});

test('Paycheck: Flat-tax state (Illinois 4.95%)', () => {
  const res = paycheck({
    wagesCents: 200000, // $2,000 biweekly ($52,000/yr)
    periodsPerYear: 26,
    filingStatus: 'single',
    stateCode: 'IL'
  });

  // Annual IL taxable = 52,000 - 2,625 = $49,375.
  // Tax = 49,375 * 0.0495 = $2,444.06/yr -> ~$94.00 biweekly
  assert.ok(res.stateCents > 9000 && res.stateCents < 10000, `IL state tax expected ~9400 cents, got ${res.stateCents}`);
  assert.ok(res.totalTaxCents === res.ssCents + res.medCents + res.fedCents + res.stateCents);
});

test('Paycheck: Progressive bracket state (California)', () => {
  const res = paycheck({
    wagesCents: 300000, // $3,000 biweekly ($78,000/yr)
    tipsCents: 100000,  // $1,000 biweekly ($26,000/yr) -> $104,000 total
    periodsPerYear: 26,
    filingStatus: 'single',
    stateCode: 'CA'
  });

  assert.ok(res.stateCents > 0, 'CA should have progressive state tax');
  assert.ok(res.fedCents > 0, 'Federal tax should apply to $104k gross');
  assert.ok(res.netCents < res.grossCents, 'Net pay must be less than gross');
  assert.ok(res.effectiveTaxRatePct > 15 && res.effectiveTaxRatePct < 35, `Effective tax rate sensible: ${res.effectiveTaxRatePct}%`);
});

test('Paycheck: Social security caps at SSA wage base', () => {
  // Biweekly gross of $10,000 ($260,000 annual > $184,500 wage base)
  const res = paycheck({
    wagesCents: 1000000,
    periodsPerYear: 26,
    filingStatus: 'single',
    stateCode: 'FL'
  });

  // Expected SS: $184,500 * 6.2% / 26 = $11,439 / 26 = $439.96 = 43996 cents
  // Rather than 6.2% of $10,000 = $620
  assert.equal(res.ssCents, Math.round((18450000 * 0.062) / 26));
  assert.ok(res.ssCents < Math.round(1000000 * 0.062), 'SS tax should be capped by wage base');
});
