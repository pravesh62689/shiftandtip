// src/engine/tax-tables.js
// 2026 Statutory Federal and State income tax schedules for paycheck withholding calculations.
// SSA wage base: $184,500 (2026 confirmed at https://www.ssa.gov/oact/cola/cbb.html)
// IRS Revenue Procedure 2025-38 inflation adjustments.

export const FICA_CONSTANTS = {
  ssRate: 0.062,
  medRate: 0.0145,
  addlMedRate: 0.009,
  addlMedThresholdSingle: 20000000, // $200,000 in cents
  addlMedThresholdMFJ: 25000000,    // $250,000 in cents
  SS_WAGE_BASE: 18450000            // $184,500 in cents
};

export const FEDERAL_TAX = {
  standardDeduction: {
    single: 1570000, // in cents ($15,700)
    mfj: 3140000,    // in cents ($31,400)
    hoh: 2355000,    // in cents ($23,550)
    mfs: 1570000     // in cents ($15,700)
  },
  brackets: {
    single: [
      { cap: 1192500, rate: 0.10 },
      { cap: 4847500, rate: 0.12 },
      { cap: 10335000, rate: 0.22 },
      { cap: 19730000, rate: 0.24 },
      { cap: 25052500, rate: 0.32 },
      { cap: 62635000, rate: 0.35 },
      { cap: null, rate: 0.37 }
    ],
    mfj: [
      { cap: 2385000, rate: 0.10 },
      { cap: 9695000, rate: 0.12 },
      { cap: 20670000, rate: 0.22 },
      { cap: 39460000, rate: 0.24 },
      { cap: 50105000, rate: 0.32 },
      { cap: 75160000, rate: 0.35 },
      { cap: null, rate: 0.37 }
    ]
  }
};

export const STATE_TAXES = {
  // No wage tax
  AK: { type: 'none' },
  FL: { type: 'none' },
  NV: { type: 'none' },
  NH: { type: 'none' },
  SD: { type: 'none' },
  TN: { type: 'none' },
  TX: { type: 'none' },
  WA: { type: 'none' },
  WY: { type: 'none' },

  // Flat tax
  AZ: { type: 'flat', standardDeduction: 1460000, flatRate: 0.025 },
  CO: { type: 'flat', standardDeduction: 1460000, flatRate: 0.044 },
  GA: { type: 'flat', standardDeduction: 1200000, flatRate: 0.0539 },
  ID: { type: 'flat', standardDeduction: 1460000, flatRate: 0.05695 },
  IL: { type: 'flat', standardDeduction: 262500, flatRate: 0.0495 },
  IN: { type: 'flat', standardDeduction: 100000, flatRate: 0.0305 },
  IA: { type: 'flat', standardDeduction: 0, flatRate: 0.038 },
  KY: { type: 'flat', standardDeduction: 316000, flatRate: 0.040 },
  MA: { type: 'flat', standardDeduction: 440000, flatRate: 0.050 },
  MI: { type: 'flat', standardDeduction: 560000, flatRate: 0.0425 },
  MS: { type: 'flat', standardDeduction: 230000, flatRate: 0.040 },
  NC: { type: 'flat', standardDeduction: 1275000, flatRate: 0.045 },
  PA: { type: 'flat', standardDeduction: 0, flatRate: 0.0307 },
  UT: { type: 'flat', standardDeduction: 0, flatRate: 0.0465 },

  // Progressive brackets
  AL: {
    type: 'graduated', standardDeduction: 300000,
    brackets: [{ cap: 50000, rate: 0.02 }, { cap: 300000, rate: 0.04 }, { cap: null, rate: 0.05 }]
  },
  AR: {
    type: 'graduated', standardDeduction: 234000,
    brackets: [{ cap: 510000, rate: 0.02 }, { cap: 1030000, rate: 0.03 }, { cap: 2430000, rate: 0.034 }, { cap: null, rate: 0.039 }]
  },
  CA: {
    type: 'graduated', standardDeduction: 554000,
    brackets: [
      { cap: 1075600, rate: 0.01 }, { cap: 2549900, rate: 0.02 }, { cap: 4024500, rate: 0.04 },
      { cap: 5586600, rate: 0.06 }, { cap: 7060600, rate: 0.08 }, { cap: 36065900, rate: 0.093 },
      { cap: 43278700, rate: 0.103 }, { cap: 72131400, rate: 0.113 }, { cap: null, rate: 0.123 }
    ]
  },
  CT: {
    type: 'graduated', standardDeduction: 0,
    brackets: [
      { cap: 1000000, rate: 0.02 }, { cap: 5000000, rate: 0.045 }, { cap: 10000000, rate: 0.055 },
      { cap: 20000000, rate: 0.06 }, { cap: 25000000, rate: 0.065 }, { cap: 50000000, rate: 0.069 }, { cap: null, rate: 0.0699 }
    ]
  },
  DE: {
    type: 'graduated', standardDeduction: 325000,
    brackets: [{ cap: 200000, rate: 0 }, { cap: 500000, rate: 0.022 }, { cap: 1000000, rate: 0.039 }, { cap: 2000000, rate: 0.048 }, { cap: 2500000, rate: 0.052 }, { cap: 6000000, rate: 0.0555 }, { cap: null, rate: 0.066 }]
  },
  DC: {
    type: 'graduated', standardDeduction: 1460000,
    brackets: [{ cap: 1000000, rate: 0.04 }, { cap: 4000000, rate: 0.06 }, { cap: 6000000, rate: 0.065 }, { cap: 25000000, rate: 0.085 }, { cap: 50000000, rate: 0.0925 }, { cap: 100000000, rate: 0.0975 }, { cap: null, rate: 0.1075 }]
  },
  HI: {
    type: 'graduated', standardDeduction: 220000,
    brackets: [{ cap: 240000, rate: 0.014 }, { cap: 480000, rate: 0.032 }, { cap: 960000, rate: 0.055 }, { cap: 1440000, rate: 0.064 }, { cap: 1920000, rate: 0.068 }, { cap: 2400000, rate: 0.072 }, { cap: 3600000, rate: 0.076 }, { cap: 4800000, rate: 0.079 }, { cap: 15000000, rate: 0.0825 }, { cap: 17500000, rate: 0.09 }, { cap: 20000000, rate: 0.10 }, { cap: null, rate: 0.11 }]
  },
  KS: {
    type: 'graduated', standardDeduction: 350000,
    brackets: [{ cap: 1500000, rate: 0.031 }, { cap: 3000000, rate: 0.0525 }, { cap: null, rate: 0.0558 }]
  },
  LA: {
    type: 'graduated', standardDeduction: 450000,
    brackets: [{ cap: 1250000, rate: 0.0185 }, { cap: 5000000, rate: 0.035 }, { cap: null, rate: 0.0425 }]
  },
  ME: {
    type: 'graduated', standardDeduction: 1460000,
    brackets: [{ cap: 2605000, rate: 0.058 }, { cap: 6160000, rate: 0.0675 }, { cap: null, rate: 0.0715 }]
  },
  MD: {
    type: 'graduated', standardDeduction: 255000,
    brackets: [{ cap: 100000, rate: 0.02 }, { cap: 200000, rate: 0.03 }, { cap: 300000, rate: 0.04 }, { cap: 10000000, rate: 0.0475 }, { cap: 12500000, rate: 0.05 }, { cap: 15000000, rate: 0.0525 }, { cap: 25000000, rate: 0.055 }, { cap: null, rate: 0.0575 }]
  },
  MN: {
    type: 'graduated', standardDeduction: 1457500,
    brackets: [{ cap: 3169000, rate: 0.0535 }, { cap: 10409000, rate: 0.068 }, { cap: 19324000, rate: 0.0785 }, { cap: null, rate: 0.0985 }]
  },
  MO: {
    type: 'graduated', standardDeduction: 1460000,
    brackets: [{ cap: 127300, rate: 0.015 }, { cap: 254600, rate: 0.02 }, { cap: 381900, rate: 0.025 }, { cap: 509200, rate: 0.03 }, { cap: 636500, rate: 0.035 }, { cap: 763800, rate: 0.04 }, { cap: 891100, rate: 0.045 }, { cap: null, rate: 0.047 }]
  },
  MT: {
    type: 'graduated', standardDeduction: 1460000,
    brackets: [{ cap: 2050000, rate: 0.047 }, { cap: null, rate: 0.059 }]
  },
  NE: {
    type: 'graduated', standardDeduction: 790000,
    brackets: [{ cap: 370000, rate: 0.0246 }, { cap: 2217000, rate: 0.0351 }, { cap: 3573000, rate: 0.0501 }, { cap: null, rate: 0.052 }]
  },
  NJ: {
    type: 'graduated', standardDeduction: 100000,
    brackets: [
      { cap: 2000000, rate: 0.014 }, { cap: 3500000, rate: 0.0175 }, { cap: 4000000, rate: 0.035 },
      { cap: 7500000, rate: 0.05525 }, { cap: 50000000, rate: 0.0637 }, { cap: 100000000, rate: 0.0897 }, { cap: null, rate: 0.1075 }
    ]
  },
  NM: {
    type: 'graduated', standardDeduction: 1460000,
    brackets: [{ cap: 550000, rate: 0.017 }, { cap: 1100000, rate: 0.032 }, { cap: 1600000, rate: 0.047 }, { cap: 21000000, rate: 0.049 }, { cap: null, rate: 0.059 }]
  },
  NY: {
    type: 'graduated', standardDeduction: 800000,
    brackets: [
      { cap: 850000, rate: 0.04 }, { cap: 1170000, rate: 0.045 }, { cap: 1390000, rate: 0.0525 },
      { cap: 8065000, rate: 0.055 }, { cap: 21540000, rate: 0.06 }, { cap: 107755000, rate: 0.0685 },
      { cap: 500000000, rate: 0.0965 }, { cap: null, rate: 0.109 }
    ]
  },
  ND: {
    type: 'graduated', standardDeduction: 1460000,
    brackets: [{ cap: 4472500, rate: 0 }, { cap: 22597500, rate: 0.0195 }, { cap: null, rate: 0.025 }]
  },
  OH: {
    type: 'graduated', standardDeduction: 0,
    brackets: [{ cap: 2605000, rate: 0 }, { cap: 10000000, rate: 0.0275 }, { cap: null, rate: 0.035 }]
  },
  OK: {
    type: 'graduated', standardDeduction: 635000,
    brackets: [{ cap: 100000, rate: 0.0025 }, { cap: 250000, rate: 0.0075 }, { cap: 375000, rate: 0.0175 }, { cap: 490000, rate: 0.0275 }, { cap: 720000, rate: 0.0375 }, { cap: null, rate: 0.0475 }]
  },
  OR: {
    type: 'graduated', standardDeduction: 274500,
    brackets: [{ cap: 405000, rate: 0.0475 }, { cap: 1020000, rate: 0.0675 }, { cap: 12500000, rate: 0.0875 }, { cap: null, rate: 0.099 }]
  },
  RI: {
    type: 'graduated', standardDeduction: 1055000,
    brackets: [{ cap: 7345000, rate: 0.0375 }, { cap: 16695000, rate: 0.0475 }, { cap: null, rate: 0.0599 }]
  },
  SC: {
    type: 'graduated', standardDeduction: 1460000,
    brackets: [{ cap: 346000, rate: 0 }, { cap: 1733000, rate: 0.03 }, { cap: null, rate: 0.062 }]
  },
  VT: {
    type: 'graduated', standardDeduction: 740000,
    brackets: [{ cap: 4540000, rate: 0.0335 }, { cap: 11005000, rate: 0.066 }, { cap: 22955000, rate: 0.076 }, { cap: null, rate: 0.0875 }]
  },
  VA: {
    type: 'graduated', standardDeduction: 850000,
    brackets: [{ cap: 300000, rate: 0.02 }, { cap: 500000, rate: 0.03 }, { cap: 1700000, rate: 0.05 }, { cap: null, rate: 0.0575 }]
  },
  WV: {
    type: 'graduated', standardDeduction: 0,
    brackets: [{ cap: 1000000, rate: 0.0236 }, { cap: 2500000, rate: 0.0315 }, { cap: 4000000, rate: 0.0354 }, { cap: 6000000, rate: 0.0472 }, { cap: null, rate: 0.0512 }]
  },
  WI: {
    type: 'graduated', standardDeduction: 1282000,
    brackets: [{ cap: 1432000, rate: 0.035 }, { cap: 2864000, rate: 0.044 }, { cap: 31531000, rate: 0.053 }, { cap: null, rate: 0.0765 }]
  }
};
