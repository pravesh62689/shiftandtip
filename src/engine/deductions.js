// 2025-2028 federal deductions. Confirmed against irs.gov + Schedule 1-A instructions.
const C = {
  TIPS_CAP: 2500000,                                        // $25,000 per return
  OT_CAP: { single: 1250000, hoh: 1250000, mfj: 2500000 },  // $12,500 / $25,000 joint
  PHASE_START: { single: 15000000, hoh: 15000000, mfj: 30000000 }, // MAGI $150k / $300k
  STEP: 100000, STEP_REDUCTION: 10000,                      // $100 per $1,000 over
};
const phase = (magiCents, fs) => Math.floor(Math.max(0, magiCents - C.PHASE_START[fs]) / C.STEP) * C.STEP_REDUCTION;

export function tipsDeduction({ qualifiedTipsCents, magiCents, filingStatus }) {
  if (filingStatus === 'mfs') return 0;
  return Math.max(0, Math.min(qualifiedTipsCents, C.TIPS_CAP) - phase(magiCents, filingStatus));
}
// qualifiedOTPremiumCents = only the premium portion (the "half" of time-and-a-half) required by FLSA section 7.
export function overtimeDeduction({ qualifiedOTPremiumCents, magiCents, filingStatus }) {
  if (filingStatus === 'mfs') return 0;
  return Math.max(0, Math.min(qualifiedOTPremiumCents, C.OT_CAP[filingStatus]) - phase(magiCents, filingStatus));
}
