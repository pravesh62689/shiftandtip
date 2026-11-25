// src/engine/paycheck.js
// Statutory paycheck calculator engine. Computes Federal Income Tax, FICA (Social Security & Medicare),
// and State Income Tax withholding across all 50 states + DC for hourly, tipped, and overtime pay.

import { FICA_CONSTANTS, FEDERAL_TAX, STATE_TAXES } from './tax-tables.js';

function computeTaxFromBrackets(taxableCents, brackets) {
  if (taxableCents <= 0) return 0;
  let tax = 0;
  let prevCap = 0;

  for (const b of brackets) {
    if (b.cap === null) {
      // Top bracket
      tax += (taxableCents - prevCap) * b.rate;
      break;
    }
    const chunk = Math.min(taxableCents, b.cap) - prevCap;
    if (chunk > 0) {
      tax += chunk * b.rate;
      prevCap = b.cap;
    }
    if (taxableCents <= b.cap) break;
  }
  return Math.round(tax);
}

export function paycheck({
  wagesCents = 0,
  tipsCents = 0,
  overtimeCents = 0,
  periodsPerYear = 26,
  filingStatus = 'single',
  stateCode = 'FED',
  additionalWithholdingCents = 0
}) {
  const gross = Math.max(0, wagesCents + tipsCents + overtimeCents);
  const periods = Number(periodsPerYear) || 26;
  const status = (filingStatus || 'single').toLowerCase();
  const state = String(stateCode || 'FED').toUpperCase();

  const annualGross = gross * periods;

  // 1. Social Security (6.2% up to annual cap)
  const taxableSSAnnual = Math.min(annualGross, FICA_CONSTANTS.SS_WAGE_BASE);
  const ssCents = Math.round((taxableSSAnnual * FICA_CONSTANTS.ssRate) / periods);

  // 2. Medicare (1.45% base + 0.9% additional over threshold)
  const medThreshold = status === 'mfj' ? FICA_CONSTANTS.addlMedThresholdMFJ : FICA_CONSTANTS.addlMedThresholdSingle;
  const baseMed = gross * FICA_CONSTANTS.medRate;
  const addlMedAnnual = Math.max(0, annualGross - medThreshold) * FICA_CONSTANTS.addlMedRate;
  const medCents = Math.round(baseMed + (addlMedAnnual / periods));

  // 3. Federal Income Tax Withholding
  const fedStdDed = FEDERAL_TAX.standardDeduction[status] ?? FEDERAL_TAX.standardDeduction.single;
  const fedTaxableAnnual = Math.max(0, annualGross - fedStdDed);
  const fedBrackets = FEDERAL_TAX.brackets[status] ?? FEDERAL_TAX.brackets.single;
  const fedAnnualTax = computeTaxFromBrackets(fedTaxableAnnual, fedBrackets);
  const fedCents = Math.round(fedAnnualTax / periods) + additionalWithholdingCents;

  // 4. State Income Tax Withholding
  let stateCents = 0;
  const stateRule = STATE_TAXES[state];

  if (stateRule && stateRule.type !== 'none') {
    const stateStdDed = stateRule.standardDeduction || 0;
    const stateTaxableAnnual = Math.max(0, annualGross - stateStdDed);

    if (stateRule.type === 'flat') {
      const stateAnnualTax = Math.round(stateTaxableAnnual * stateRule.flatRate);
      stateCents = Math.round(stateAnnualTax / periods);
    } else if (stateRule.type === 'graduated') {
      const stateAnnualTax = computeTaxFromBrackets(stateTaxableAnnual, stateRule.brackets);
      stateCents = Math.round(stateAnnualTax / periods);
    }
  }

  const totalTaxCents = ssCents + medCents + fedCents + stateCents;
  const netCents = Math.max(0, gross - totalTaxCents);
  const effectiveTaxRatePct = gross > 0 ? +((totalTaxCents / gross) * 100).toFixed(1) : 0;

  return {
    grossCents: gross,
    annualGrossCents: annualGross,
    ssCents,
    medCents,
    fedCents,
    stateCents,
    totalTaxCents,
    netCents,
    effectiveTaxRatePct,
    stateCode: state,
    filingStatus: status,
    periodsPerYear: periods
  };
}
