import test from 'node:test';
import assert from 'node:assert/strict';
import { takeHome } from '../src/engine/takehome.js';

test('FICA on $1,500 biweekly, no income tax', () => {
  const t = takeHome({ wagesCents: 60000, tipsCents: 90000, periodsPerYear: 26, stateCode: 'TX' });
  assert.equal(t.ssCents, 9300);
  assert.equal(t.medCents, 2175);
  assert.equal(t.netCents, 150000 - 9300 - 2175);
});
test('no-wage-tax state ignores state rate', () => assert.equal(takeHome({ wagesCents: 100000, tipsCents: 0, stateRatePct: 5, stateCode: 'FL' }).stateCents, 0));
test('state rate applies elsewhere', () => assert.equal(takeHome({ wagesCents: 100000, tipsCents: 0, stateRatePct: 5, stateCode: 'OH' }).stateCents, 5000));
