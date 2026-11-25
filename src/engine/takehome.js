// Take-home estimate. Confirmed 2026 wage base $184,500 at https://www.ssa.gov/oact/cola/cbb.html on 2026-11-24.
// Federal income tax is NOT hand-typed: v1 takes a user-entered effective rate; data/federal-YEAR.json (from the IRS Rev. Proc.) is not built yet.
export const FICA = {
  ssRate: 0.062,
  medRate: 0.0145,
  addlMedRate: 0.009,
  addlMedThreshold: 20000000, // $200,000 in cents
  SS_WAGE_BASE: 18450000, // Confirmed $184,500 at https://www.ssa.gov/oact/cola/cbb.html on 2026-11-24 (2025 confirmed at $176,100)
};
export const NO_WAGE_TAX_STATES = ['AK', 'FL', 'NV', 'NH', 'SD', 'TN', 'TX', 'WA', 'WY'];

// All amounts are cents for ONE pay period. periodsPerYear: 52 weekly, 26 biweekly, 24 semimonthly, 12 monthly.
export function takeHome({ wagesCents, tipsCents, periodsPerYear = 26, fedRatePct = 0, stateRatePct = 0, stateCode = '' }) {
  const gross = wagesCents + tipsCents;
  const annual = gross * periodsPerYear;
  const ss = Math.round((Math.min(annual, FICA.SS_WAGE_BASE) * FICA.ssRate) / periodsPerYear);
  const med = Math.round(gross * FICA.medRate) + Math.round((Math.max(0, annual - FICA.addlMedThreshold) * FICA.addlMedRate) / periodsPerYear);
  const fed = Math.round((gross * fedRatePct) / 100);
  const state = NO_WAGE_TAX_STATES.includes(stateCode) ? 0 : Math.round((gross * stateRatePct) / 100);
  return { grossCents: gross, ssCents: ss, medCents: med, fedCents: fed, stateCents: state, netCents: gross - ss - med - fed - state };
}
