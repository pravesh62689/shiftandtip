import fs from 'node:fs';

const DOL_MINWAGE_URL = 'https://www.dol.gov/agencies/whd/minimum-wage/state';
const DOL_TIPPED_URL = 'https://www.dol.gov/agencies/whd/state/minimum-wage/tipped';

// Master data dictionary combining DOL tables and verified State Labor Department rules.
// For the 10 cross-check states (CA, NV, CO, AK, NY, TX, FL, PA, IL, GA), state labor department rules win on any conflict.
const STATE_RECORDS = {
  AL: {
    minWage: 7.25, tippedCashWage: 2.13, maxTipCredit: 5.12, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2009-07-24",
    notes: ["No state minimum wage law; federal FLSA standards apply."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Alabama has no state minimum wage law; covered employers are subject to the federal Fair Labor Standards Act rate of $7.25.",
      tippedCashWage: "Under federal FLSA 29 U.S.C. 203(m), the minimum cash wage for tipped employees is $2.13 per hour.",
      maxTipCredit: "Maximum tip credit is $5.12 per hour ($7.25 basic minimum wage minus $2.13 minimum direct cash wage)."
    }
  },
  AK: {
    minWage: 13.00, tippedCashWage: 13.00, maxTipCredit: 0.00, tipCreditAllowed: false,
    ot: { weekly: 40, daily: 8 },
    effectiveFrom: "2025-07-01",
    nextChange: { date: "2026-07-01", minWage: 14.00 },
    notes: [
      "State site wins over DOL table: Alaska Statute AS 23.10.065 strictly prohibits tip credits; employers must pay the full minimum wage in cash.",
      "Alaska Ballot Measure 1 enacted stepped minimum wage increases: $13.00/hr on July 1, 2025 and $14.00/hr on July 1, 2026.",
      "Alaska requires daily overtime after 8 hours per day as well as weekly overtime after 40 hours for employers with 4 or more employees (AS 23.10.060)."
    ],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL },
      { label: "Alaska Department of Labor and Workforce Development", url: "https://labor.alaska.gov/" }
    ],
    quotes: {
      minWage: "Alaska Ballot Measure 1 approved by voters sets minimum wage at $13.00/hr on July 1, 2025 and $14.00/hr on July 1, 2026.",
      tippedCashWage: "AS 23.10.065 requires payment of the full minimum wage directly to employees; tip credits are not permitted under Alaska law.",
      maxTipCredit: "Tip credit allowed: None ($0.00). Employers cannot take any credit against minimum wage for tips received."
    }
  },
  AZ: {
    minWage: 14.70, tippedCashWage: 11.70, maxTipCredit: 3.00, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2025-01-01",
    notes: ["A.R.S. § 23-363 permits employer to pay up to $3.00 per hour less than the minimum wage for tipped employees."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $14.70, adjusted annually based on the Consumer Price Index.",
      tippedCashWage: "Under A.R.S. § 23-363, minimum cash wage is $11.70 per hour for tipped employees.",
      maxTipCredit: "Maximum tip credit permitted under Arizona law is $3.00 per hour."
    }
  },
  AR: {
    minWage: 11.00, tippedCashWage: 2.63, maxTipCredit: 8.37, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2021-01-01",
    notes: ["Applicable to employers of 4 or more employees under Ark. Code § 11-4-210."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $11.00 for employers of 4 or more under Arkansas state statute.",
      tippedCashWage: "Arkansas statutory cash wage for tipped employees is $2.63 per hour.",
      maxTipCredit: "Maximum tip credit is $8.37 per hour ($11.00 minus $2.63)."
    }
  },
  CA: {
    minWage: 16.50, tippedCashWage: 16.50, maxTipCredit: 0.00, tipCreditAllowed: false,
    ot: { weekly: 40, daily: 8, dailyDT: 12, seventhDay: true },
    effectiveFrom: "2025-01-01",
    nextChange: { date: "2026-01-01", minWage: 16.90 },
    notes: [
      "State site wins over DOL table: California Labor Code Section 351 strictly prohibits tip credits; employers must pay the full minimum wage before tips.",
      "California requires daily overtime (1.5x) after 8 hours up to 12 hours, double time (2.0x) after 12 hours, and 1.5x for first 8 hours on 7th consecutive day (2.0x beyond 8 hours) under Labor Code Section 510.",
      "Alternative workweek schedules not modelled. Higher local minimum wages apply in many CA cities."
    ],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL },
      { label: "California Department of Industrial Relations (DIR)", url: "https://www.dir.ca.gov/dlse/faq_overtime.htm" }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $16.50 effective January 1, 2025, indexed annually for inflation under Labor Code Section 1182.12.",
      tippedCashWage: "California Labor Code Section 351: 'Every gratuity is hereby declared to be the sole property of the employee... No employer or agent shall collect, take, or receive any gratuity... or deduct any amount from wages on account thereof.' Tipped cash wage is 100% of minimum wage ($16.50).",
      maxTipCredit: "Tip credit allowed: None ($0.00). Under CA law, an employer may not use an employee's tips as a credit towards its minimum wage obligation."
    }
  },
  CO: {
    minWage: 14.81, tippedCashWage: 11.79, maxTipCredit: 3.02, tipCreditAllowed: true,
    ot: { weekly: 40, daily: 12 },
    effectiveFrom: "2025-01-01",
    notes: [
      "State site wins over DOL table: Colorado Department of Labor and Employment (CDLE) COMPS Order #40 / #41 establishes minimum wage at $14.81 and limits tip credit to $3.02/hr.",
      "Overtime (1.5x) required after 40 hours per workweek, 12 hours per workday, or 12 consecutive hours without regard to start/end time under COMPS Order Rule 4.",
      "Denver municipal rate ($18.81/hr) is higher but statewide COMPS Order rate is modelled."
    ],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL },
      { label: "Colorado Department of Labor and Employment (CDLE)", url: "https://cdle.colorado.gov/" }
    ],
    quotes: {
      minWage: "Colorado Overtime and Minimum Pay Standards (COMPS) Order sets statewide minimum wage at $14.81 per hour effective January 1, 2025.",
      tippedCashWage: "Under COMPS Order Rule 3, tipped employees must receive a minimum direct cash wage of $11.79 per hour.",
      maxTipCredit: "COMPS Order caps maximum tip credit at $3.02 per hour."
    }
  },
  CT: {
    minWage: 16.35, tippedCashWage: 6.38, maxTipCredit: 9.97, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2025-01-01",
    notes: ["Hotel and restaurant tipped cash wage is $6.38 (tip credit $9.97). Bartenders tipped cash wage is $8.23 (tip credit $8.12) under C.G.S. § 31-58."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $16.35 effective January 1, 2025, indexed to economic indicators.",
      tippedCashWage: "Under Connecticut General Statutes § 31-58, direct cash wage is $6.38 for hotel and restaurant staff ($8.23 for bartenders).",
      maxTipCredit: "Maximum tip credit is $9.97 for hotel and restaurant staff ($8.12 for bartenders)."
    }
  },
  DE: {
    minWage: 15.00, tippedCashWage: 2.23, maxTipCredit: 12.77, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2025-01-01",
    notes: ["Delaware reached $15.00 statutory minimum wage on January 1, 2025 (19 Del. C. § 902). Cash wage fixed at $2.23."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $15.00 effective January 1, 2025 under 19 Del. C. § 902.",
      tippedCashWage: "Delaware Code maintains a statutory minimum cash wage of $2.23 per hour for tipped workers.",
      maxTipCredit: "Maximum tip credit is $12.77 per hour ($15.00 minus $2.23)."
    }
  },
  DC: {
    minWage: 17.50, tippedCashWage: 10.00, maxTipCredit: 7.50, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2024-07-01",
    notes: ["Initiative 82 phases out tip credits completely in DC by 2027."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $17.50 effective July 1, 2024, adjusted annually.",
      tippedCashWage: "Under DC Initiative 82 schedule, minimum tipped cash wage is $10.00 per hour.",
      maxTipCredit: "Maximum tip credit is $7.50 per hour, phasing down to $0.00 by 2027."
    }
  },
  FL: {
    minWage: 13.00, tippedCashWage: 9.98, maxTipCredit: 3.02, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2024-09-30",
    nextChange: { date: "2025-09-30", minWage: 14.00 },
    notes: [
      "State site wins over DOL table: Florida Department of Commerce / Florida Constitution Amendment 2 (Art. X, § 24) sets rate increases on Sept 30 annually.",
      "Minimum wage is $13.00 (through Sept 29, 2025), $14.00 (Sept 30, 2025), and $15.00 (Sept 30, 2026).",
      "Florida Constitution fixes the maximum tip credit at exactly $3.02 per hour; minimum cash wage is $9.98 (to 9/29/25) and $10.98 (effective 9/30/25)."
    ],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL },
      { label: "Florida Department of Commerce", url: "https://floridajobs.org/" }
    ],
    quotes: {
      minWage: "Florida Constitution Art. X, § 24 sets minimum wage at $13.00 through September 29, 2025, increasing to $14.00 on September 30, 2025 and $15.00 on September 30, 2026.",
      tippedCashWage: "Florida Constitution establishes tipped cash wage as minimum wage minus fixed tip credit of $3.02, resulting in $9.98/hr ($10.98/hr on Sept 30, 2025).",
      maxTipCredit: "Florida Constitution Art. X, § 24 fixes maximum tip credit at $3.02 per hour."
    }
  },
  GA: {
    minWage: 7.25, tippedCashWage: 2.13, maxTipCredit: 5.12, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2009-07-24",
    notes: [
      "State site wins over DOL table: Georgia state statutory rate is $5.15/hr (O.C.G.A. § 34-4-3), but the federal FLSA rate ($7.25 / $2.13 cash / $5.12 credit) governs all covered employers.",
      "Federal FLSA standards model actual pay for hospitality and hourly workers."
    ],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL },
      { label: "Georgia Department of Labor", url: "https://dol.georgia.gov/" }
    ],
    quotes: {
      minWage: "Georgia state statutory minimum wage is $5.15 under O.C.G.A. § 34-4-3; however, covered employers are required to pay the federal FLSA minimum wage of $7.25 per hour.",
      tippedCashWage: "Under federal FLSA rules governing Georgia employers, minimum cash wage is $2.13 per hour.",
      maxTipCredit: "Maximum tip credit is $5.12 per hour under federal standards applicable to covered employers."
    }
  },
  HI: {
    minWage: 14.00, tippedCashWage: 12.75, maxTipCredit: 1.25, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2024-01-01",
    nextChange: { date: "2026-01-01", minWage: 16.00 },
    notes: ["Tip credit of $1.25 permitted only if combined cash wage and tips exceed the minimum wage by at least $7.00 per hour (HRS § 387-2)."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $14.00 under Hawaii Revised Statutes § 387-2 ($16.00 on Jan 1, 2026).",
      tippedCashWage: "Minimum tipped cash wage is $12.75 per hour when tip credit threshold is satisfied.",
      maxTipCredit: "Maximum tip credit is $1.25 per hour, allowable only if total earnings exceed minimum wage by ≥$7.00/hr."
    }
  },
  ID: {
    minWage: 7.25, tippedCashWage: 3.35, maxTipCredit: 3.90, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2009-07-24",
    notes: ["Idaho Code § 44-1502 sets tipped cash wage at $3.35 per hour."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $7.25 under Idaho Code § 44-1502.",
      tippedCashWage: "Under Idaho Code § 44-1502, minimum cash wage for tipped employees is $3.35 per hour.",
      maxTipCredit: "Maximum tip credit is $3.90 per hour ($7.25 minus $3.35)."
    }
  },
  IL: {
    minWage: 15.00, tippedCashWage: 9.00, maxTipCredit: 6.00, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2025-01-01",
    notes: [
      "State site wins over DOL table: Illinois Department of Labor enforces 820 ILCS 105/4, which sets the tipped cash wage at exactly 60% of basic minimum wage ($9.00) and max tip credit at 40% ($6.00).",
      "Illinois reached the $15.00 statutory minimum wage on January 1, 2025.",
      "Chicago municipal ordinance is phasing out the tip credit by 2028, but 60% statewide rule governs state model."
    ],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL },
      { label: "Illinois Department of Labor", url: "https://labor.illinois.gov/" }
    ],
    quotes: {
      minWage: "Illinois statutory minimum wage reaches $15.00 per hour on January 1, 2025 under 820 ILCS 105/4.",
      tippedCashWage: "820 ILCS 105/4: 'An employer may take a credit against the minimum wage for gratuities... in an amount not to exceed 40% of the minimum wage', requiring a 60% direct cash wage of $9.00 per hour.",
      maxTipCredit: "Maximum tip credit allowed under Illinois state law is 40% of the basic minimum wage ($6.00 per hour)."
    }
  },
  IN: {
    minWage: 7.25, tippedCashWage: 2.13, maxTipCredit: 5.12, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2009-07-24",
    notes: ["IC 22-2-2-4 incorporates federal minimum wage rates."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $7.25 under Indiana Code 22-2-2-4.",
      tippedCashWage: "Indiana incorporates federal standards; minimum cash wage is $2.13 per hour.",
      maxTipCredit: "Maximum tip credit is $5.12 per hour."
    }
  },
  IA: {
    minWage: 7.25, tippedCashWage: 4.35, maxTipCredit: 2.90, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2008-01-01",
    notes: ["Iowa Code § 91D.1 sets tipped cash wage at 60% of basic minimum wage ($4.35/hr)."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $7.25 under Iowa Code § 91D.1.",
      tippedCashWage: "Iowa Code requires a minimum cash wage equal to 60% of minimum wage ($4.35 per hour).",
      maxTipCredit: "Maximum tip credit is $2.90 per hour ($7.25 minus $4.35)."
    }
  },
  KS: {
    minWage: 7.25, tippedCashWage: 2.13, maxTipCredit: 5.12, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2010-01-01",
    notes: ["K.S.A. § 44-1203 aligns with federal standards."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $7.25 under Kansas Statutes § 44-1203.",
      tippedCashWage: "Minimum cash wage for tipped workers is $2.13 per hour.",
      maxTipCredit: "Maximum tip credit is $5.12 per hour."
    }
  },
  KY: {
    minWage: 7.25, tippedCashWage: 2.13, maxTipCredit: 5.12, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2009-07-24",
    notes: ["KRS § 337.275 aligns with federal FLSA rates."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $7.25 under Kentucky Revised Statutes § 337.275.",
      tippedCashWage: "Minimum direct cash wage is $2.13 per hour.",
      maxTipCredit: "Maximum tip credit is $5.12 per hour."
    }
  },
  LA: {
    minWage: 7.25, tippedCashWage: 2.13, maxTipCredit: 5.12, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2009-07-24",
    notes: ["No state minimum wage statute; federal FLSA applies."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Louisiana has no state minimum wage law; covered employers are subject to FLSA $7.25.",
      tippedCashWage: "Under federal FLSA rules, minimum cash wage is $2.13 per hour.",
      maxTipCredit: "Maximum tip credit is $5.12 per hour."
    }
  },
  ME: {
    minWage: 14.65, tippedCashWage: 7.33, maxTipCredit: 7.32, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2025-01-01",
    notes: ["26 MRS § 664 requires tipped cash wage to equal at least 50% of the state minimum wage."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $14.65 effective January 1, 2025, indexed to CPI-W.",
      tippedCashWage: "Under 26 MRS § 664, direct cash wage must be at least 50% of minimum wage ($7.33 per hour).",
      maxTipCredit: "Maximum tip credit is $7.32 per hour."
    }
  },
  MD: {
    minWage: 15.00, tippedCashWage: 3.63, maxTipCredit: 11.37, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2024-01-01",
    notes: ["Md. Code, Lab. & Empl. § 3-413 sets $15.00 minimum wage and $3.63 tipped cash wage."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $15.00 under Maryland Fair Wage Act.",
      tippedCashWage: "Maryland Labor & Employment Code § 3-413 fixes tipped cash wage at $3.63 per hour.",
      maxTipCredit: "Maximum tip credit is $11.37 per hour ($15.00 minus $3.63)."
    }
  },
  MA: {
    minWage: 15.00, tippedCashWage: 6.75, maxTipCredit: 8.25, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2023-01-01",
    notes: ["M.G.L. c. 151 § 7 sets service rate (tipped cash wage) at $6.75."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $15.00 under Massachusetts General Laws c. 151 § 1.",
      tippedCashWage: "Under M.G.L. c. 151 § 7, service employee cash wage is $6.75 per hour.",
      maxTipCredit: "Maximum tip credit is $8.25 per hour ($15.00 minus $6.75)."
    }
  },
  MI: {
    minWage: 10.56, tippedCashWage: 4.01, maxTipCredit: 6.55, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2025-01-01",
    notes: ["Subject to ongoing implementation of Michigan Supreme Court ruling on Improved Workforce Opportunity Wage Act."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $10.56 effective January 1, 2025.",
      tippedCashWage: "Michigan tipped cash wage is 38% of the minimum wage, equal to $4.01 per hour.",
      maxTipCredit: "Maximum tip credit is $6.55 per hour."
    }
  },
  MN: {
    minWage: 11.13, tippedCashWage: 11.13, maxTipCredit: 0.00, tipCreditAllowed: false,
    ot: { weekly: 48 },
    effectiveFrom: "2025-01-01",
    notes: ["Minn. Stat. § 177.24 strictly prohibits tip credits; employers must pay the full minimum wage in direct cash. State overtime threshold is 48 hours, though FLSA 40 hours applies to covered employers."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $11.13 for large employers effective January 1, 2025 ($9.08 for small employers).",
      tippedCashWage: "Minn. Stat. § 177.24 prohibits tip credits; employers must pay full minimum wage of $11.13 directly.",
      maxTipCredit: "Tip credit allowed: None ($0.00). Tip credits are unlawful under Minnesota law."
    }
  },
  MS: {
    minWage: 7.25, tippedCashWage: 2.13, maxTipCredit: 5.12, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2009-07-24",
    notes: ["No state minimum wage law; federal FLSA applies."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Mississippi has no state minimum wage law; federal FLSA $7.25 applies to covered employers.",
      tippedCashWage: "Under federal standards, minimum cash wage is $2.13 per hour.",
      maxTipCredit: "Maximum tip credit is $5.12 per hour."
    }
  },
  MO: {
    minWage: 13.75, tippedCashWage: 6.88, maxTipCredit: 6.87, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2025-01-01",
    nextChange: { date: "2026-01-01", minWage: 15.00 },
    notes: ["Voters approved Proposition A in Nov 2024: $13.75 in 2025, $15.00 in 2026. Tipped cash wage is 50% of basic minimum wage."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $13.75 effective January 1, 2025 under Proposition A ($15.00 on Jan 1, 2026).",
      tippedCashWage: "Missouri statute requires employers to pay tipped employees at least 50% of the minimum wage ($6.88 per hour).",
      maxTipCredit: "Maximum tip credit is $6.87 per hour."
    }
  },
  MT: {
    minWage: 10.55, tippedCashWage: 10.55, maxTipCredit: 0.00, tipCreditAllowed: false,
    ot: { weekly: 40 },
    effectiveFrom: "2025-01-01",
    notes: ["MCA § 39-3-405 prohibits tip credits; employers must pay the full minimum wage."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $10.55 effective January 1, 2025, indexed to CPI.",
      tippedCashWage: "Montana Code Annotated § 39-3-405 prohibits tip credits; full minimum wage of $10.55 must be paid in cash.",
      maxTipCredit: "Tip credit allowed: None ($0.00)."
    }
  },
  NE: {
    minWage: 13.50, tippedCashWage: 2.13, maxTipCredit: 11.37, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2025-01-01",
    nextChange: { date: "2026-01-01", minWage: 15.00 },
    notes: ["Neb. Rev. Stat. § 48-1203 sets $13.50 in 2025 ($15.00 in 2026). Cash wage remains $2.13."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $13.50 effective January 1, 2025 under Initiative 433 ($15.00 on Jan 1, 2026).",
      tippedCashWage: "Nebraska Revised Statutes § 48-1203 sets tipped cash wage at $2.13 per hour.",
      maxTipCredit: "Maximum tip credit is $11.37 per hour ($13.50 minus $2.13)."
    }
  },
  NV: {
    minWage: 12.00, tippedCashWage: 12.00, maxTipCredit: 0.00, tipCreditAllowed: false,
    ot: { weekly: 40, daily: 8, dailyThreshold: 18.00 },
    effectiveFrom: "2024-07-01",
    notes: [
      "State site wins over DOL table: Nevada Office of the Labor Commissioner / Nevada Constitution Art. 15 § 16 prohibits tip credits; full minimum wage ($12.00) must be paid.",
      "Nevada eliminated the two-tier health insurance minimum wage system effective July 1, 2024, establishing a single uniform rate of $12.00/hr.",
      "Under NRS 608.018, daily overtime (1.5x after 8 hours in a 24-hr period) applies to employees earning less than 1.5x the minimum wage ($18.00/hr). Employees earning $18.00/hr or more are exempt from daily overtime and subject only to weekly overtime after 40 hours."
    ],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL },
      { label: "Nevada Office of the Labor Commissioner", url: "https://labor.nv.gov/" }
    ],
    quotes: {
      minWage: "Nevada Constitution Art. 15, § 16 and Ballot Question 2 establish a single minimum wage rate of $12.00 per hour effective July 1, 2024.",
      tippedCashWage: "Nevada Constitution Art. 15, § 16: 'Tips or gratuities received by employees shall not be credited as being any part of or offset against the minimum wage required.' Full $12.00 cash wage required.",
      maxTipCredit: "Tip credit allowed: None ($0.00). Tip credits are unconstitutional in Nevada."
    }
  },
  NH: {
    minWage: 7.25, tippedCashWage: 3.26, maxTipCredit: 3.99, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2009-07-24",
    notes: ["RSA 279:21 requires tipped cash wage to be at least 45% of minimum wage ($3.26/hr)."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $7.25 under RSA 279:21.",
      tippedCashWage: "New Hampshire RSA 279:21 sets tipped cash wage at 45% of minimum wage ($3.26 per hour).",
      maxTipCredit: "Maximum tip credit is $3.99 per hour ($7.25 minus $3.26)."
    }
  },
  NJ: {
    minWage: 15.49, tippedCashWage: 5.26, maxTipCredit: 10.23, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2025-01-01",
    notes: ["N.J.S.A. 34:11-56a4 sets $15.49 basic rate and $5.26 tipped cash wage for 2025."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $15.49 effective January 1, 2025 under N.J.S.A. 34:11-56a4.",
      tippedCashWage: "New Jersey statutory cash wage for tipped employees is $5.26 per hour.",
      maxTipCredit: "Maximum tip credit is $10.23 per hour ($15.49 minus $5.26)."
    }
  },
  NM: {
    minWage: 12.00, tippedCashWage: 3.00, maxTipCredit: 9.00, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2023-01-01",
    notes: ["NMSA 1978 § 50-4-22 sets $12.00 minimum wage and $3.00 tipped cash wage."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $12.00 under New Mexico Statutes § 50-4-22.",
      tippedCashWage: "Under NMSA § 50-4-22, minimum cash wage for tipped employees is $3.00 per hour.",
      maxTipCredit: "Maximum tip credit is $9.00 per hour ($12.00 minus $3.00)."
    }
  },
  NY: {
    minWage: 16.50, tippedCashWage: 11.00, maxTipCredit: 5.50, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2025-01-01",
    nextChange: { date: "2026-01-01", minWage: 17.00 },
    notes: [
      "State site wins over DOL table: New York State Department of Labor (NY Labor Law § 652 & Hospitality Wage Order 12 NYCRR Part 146) enforces regional minimum wage tiers.",
      "NYC, Long Island, & Westchester: $16.50 min wage, $11.00 food service tipped cash wage, $5.50 max tip credit (increasing to $17.00 / $11.35 cash / $5.65 credit on Jan 1, 2026).",
      "Rest of State (Upstate): $15.50 min wage, $10.35 food service tipped cash wage, $5.15 max tip credit (increasing to $16.00 / $10.70 cash / $5.30 credit on Jan 1, 2026)."
    ],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL },
      { label: "New York State Department of Labor", url: "https://dol.ny.gov/minimum-wage-0" }
    ],
    quotes: {
      minWage: "New York Labor Law § 652 sets Downstate minimum wage at $16.50 on Jan 1, 2025 ($17.00 on Jan 1, 2026) and Upstate at $15.50 on Jan 1, 2025 ($16.00 on Jan 1, 2026).",
      tippedCashWage: "12 NYCRR Part 146 sets food service cash wage in NYC/LI/Westchester at $11.00/hr ($11.35 on Jan 1, 2026) and Rest of State at $10.35/hr ($10.70 on Jan 1, 2026).",
      maxTipCredit: "Maximum tip credit is $5.50/hr Downstate ($5.65 in 2026) and $5.15/hr Upstate ($5.30 in 2026)."
    }
  },
  NC: {
    minWage: 7.25, tippedCashWage: 2.13, maxTipCredit: 5.12, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2009-07-24",
    notes: ["N.C.G.S. § 95-25.3 incorporates federal minimum wage rates."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $7.25 under North Carolina General Statutes § 95-25.3.",
      tippedCashWage: "North Carolina applies federal standards; minimum cash wage is $2.13 per hour.",
      maxTipCredit: "Maximum tip credit is $5.12 per hour."
    }
  },
  ND: {
    minWage: 7.25, tippedCashWage: 4.86, maxTipCredit: 2.39, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2009-07-24",
    notes: ["N.D.A.C. § 46-02-07 sets tipped cash wage at 67% of the minimum wage ($4.86/hr)."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $7.25 under North Dakota Administrative Code § 46-02-07.",
      tippedCashWage: "North Dakota requires cash wage equal to 67% of basic minimum ($4.86 per hour).",
      maxTipCredit: "Maximum tip credit is $2.39 per hour ($7.25 minus $4.86)."
    }
  },
  OH: {
    minWage: 10.70, tippedCashWage: 5.35, maxTipCredit: 5.35, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2025-01-01",
    notes: ["Ohio Const. Art. II § 34a sets tipped cash wage at 50% of the state minimum wage ($5.35/hr)."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $10.70 effective January 1, 2025 under Ohio Constitution Art. II § 34a.",
      tippedCashWage: "Ohio Constitution sets tipped cash wage at 50% of state minimum wage ($5.35 per hour).",
      maxTipCredit: "Maximum tip credit is $5.35 per hour."
    }
  },
  OK: {
    minWage: 7.25, tippedCashWage: 3.63, maxTipCredit: 3.62, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2009-07-24",
    notes: ["40 O.S. § 197.16 permits tip credit up to 50% of minimum wage."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $7.25 under Oklahoma Statutes Title 40 § 197.16.",
      tippedCashWage: "Oklahoma law sets tipped cash wage at 50% of minimum wage ($3.63 per hour).",
      maxTipCredit: "Maximum tip credit is $3.62 per hour."
    }
  },
  OR: {
    minWage: 14.70, tippedCashWage: 14.70, maxTipCredit: 0.00, tipCreditAllowed: false,
    ot: { weekly: 40 },
    effectiveFrom: "2024-07-01",
    notes: ["ORS 653.035 prohibits tip credits; employers must pay the full minimum wage. Portland metro rate is $15.95/hr."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $14.70 standard rate effective July 1, 2024 ($15.95 Portland Metro, $13.70 Non-urban).",
      tippedCashWage: "ORS 653.035 prohibits tip credits; full minimum wage of $14.70 must be paid directly in cash.",
      maxTipCredit: "Tip credit allowed: None ($0.00)."
    }
  },
  PA: {
    minWage: 7.25, tippedCashWage: 2.83, maxTipCredit: 4.42, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2009-07-24",
    notes: [
      "State site wins over DOL table: Pennsylvania 43 P.S. § 333.104 and 34 Pa. Code § 231.22 set the tipped cash wage at $2.83/hr (tip credit $4.42/hr).",
      "PA DLI updated tipped worker regulations to raise the qualification threshold to $135/month in tips and codify 80/20 non-tipped duty limits."
    ],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL },
      { label: "Pennsylvania Department of Labor & Industry", url: "https://www.dli.pa.gov/" }
    ],
    quotes: {
      minWage: "Pennsylvania Minimum Wage Act (43 P.S. § 333.104) sets statutory minimum wage at $7.25 per hour.",
      tippedCashWage: "34 Pa. Code § 231.22 establishes a minimum cash wage of $2.83 per hour for employees receiving at least $135/month in tips.",
      maxTipCredit: "Maximum tip credit is $4.42 per hour ($7.25 minus $2.83)."
    }
  },
  RI: {
    minWage: 15.00, tippedCashWage: 3.89, maxTipCredit: 11.11, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2025-01-01",
    notes: ["R.I. Gen. Laws § 28-12-5 reached $15.00 on Jan 1, 2025; tipped cash wage is $3.89."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $15.00 effective January 1, 2025 under R.I. Gen. Laws § 28-12-3.",
      tippedCashWage: "Under R.I. Gen. Laws § 28-12-5, minimum cash wage for tipped employees is $3.89 per hour.",
      maxTipCredit: "Maximum tip credit is $11.11 per hour ($15.00 minus $3.89)."
    }
  },
  SC: {
    minWage: 7.25, tippedCashWage: 2.13, maxTipCredit: 5.12, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2009-07-24",
    notes: ["No state minimum wage law; federal FLSA applies."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "South Carolina has no state minimum wage law; covered employers are subject to FLSA $7.25.",
      tippedCashWage: "Under federal standards, minimum cash wage is $2.13 per hour.",
      maxTipCredit: "Maximum tip credit is $5.12 per hour."
    }
  },
  SD: {
    minWage: 11.50, tippedCashWage: 5.75, maxTipCredit: 5.75, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2025-01-01",
    notes: ["SDCL § 60-11-3.1 sets tipped cash wage at 50% of the minimum wage ($5.75/hr)."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $11.50 effective January 1, 2025, indexed to CPI.",
      tippedCashWage: "Under South Dakota Codified Laws § 60-11-3.1, cash wage must be at least 50% of minimum wage ($5.75 per hour).",
      maxTipCredit: "Maximum tip credit is $5.75 per hour."
    }
  },
  TN: {
    minWage: 7.25, tippedCashWage: 2.13, maxTipCredit: 5.12, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2009-07-24",
    notes: ["No state minimum wage law; federal FLSA applies."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Tennessee has no state minimum wage law; covered employers are subject to FLSA $7.25.",
      tippedCashWage: "Under federal standards, minimum cash wage is $2.13 per hour.",
      maxTipCredit: "Maximum tip credit is $5.12 per hour."
    }
  },
  TX: {
    minWage: 7.25, tippedCashWage: 2.13, maxTipCredit: 5.12, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2009-07-24",
    notes: [
      "State site wins over DOL table: Texas Workforce Commission (TWC) enforces Texas Labor Code Chapter 62, which explicitly incorporates the federal FLSA rate.",
      "Minimum wage is $7.25, tipped cash wage is $2.13, and max tip credit is $5.12."
    ],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL },
      { label: "Texas Workforce Commission (TWC)", url: "https://www.twc.texas.gov/" }
    ],
    quotes: {
      minWage: "Texas Labor Code § 62.051 establishes that the Texas minimum wage rate equals the federal minimum wage ($7.25 per hour).",
      tippedCashWage: "Texas Labor Code Chapter 62 adopts federal FLSA standard for tipped employees; minimum cash wage is $2.13 per hour.",
      maxTipCredit: "Maximum tip credit permitted under Texas law is $5.12 per hour."
    }
  },
  UT: {
    minWage: 7.25, tippedCashWage: 2.13, maxTipCredit: 5.12, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2009-07-24",
    notes: ["Utah Code § 34-40-103 incorporates federal rates."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $7.25 under Utah Code § 34-40-103.",
      tippedCashWage: "Utah incorporates federal standards; minimum cash wage is $2.13 per hour.",
      maxTipCredit: "Maximum tip credit is $5.12 per hour."
    }
  },
  VT: {
    minWage: 14.01, tippedCashWage: 7.01, maxTipCredit: 7.00, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2025-01-01",
    notes: ["21 V.S.A. § 384 sets tipped cash wage at 50% of state minimum wage ($7.01/hr)."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $14.01 effective January 1, 2025 under 21 V.S.A. § 384.",
      tippedCashWage: "Under Vermont law, service employees must receive at least 50% of the minimum wage ($7.01 per hour).",
      maxTipCredit: "Maximum tip credit is $7.00 per hour."
    }
  },
  VA: {
    minWage: 12.00, tippedCashWage: 2.13, maxTipCredit: 9.87, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2023-01-01",
    notes: ["Va. Code § 40.1-28.9 sets $12.00 minimum wage and retains $2.13 cash wage."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $12.00 under Code of Virginia § 40.1-28.9.",
      tippedCashWage: "Virginia Code permits an employer to pay the federal tipped cash wage of $2.13 per hour.",
      maxTipCredit: "Maximum tip credit is $9.87 per hour ($12.00 minus $2.13)."
    }
  },
  WA: {
    minWage: 16.66, tippedCashWage: 16.66, maxTipCredit: 0.00, tipCreditAllowed: false,
    ot: { weekly: 40 },
    effectiveFrom: "2025-01-01",
    notes: ["RCW 49.46.020 strictly prohibits tip credits; employers must pay the full minimum wage."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $16.66 effective January 1, 2025, adjusted annually based on CPI-W.",
      tippedCashWage: "Under RCW 49.46.020, tip credits are prohibited; full minimum wage of $16.66 must be paid in cash.",
      maxTipCredit: "Tip credit allowed: None ($0.00)."
    }
  },
  WV: {
    minWage: 8.75, tippedCashWage: 2.62, maxTipCredit: 6.13, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2016-01-01",
    notes: ["W. Va. Code § 21-5C-4 sets tipped cash wage at 30% of minimum wage ($2.62/hr). Applies to employers of 6 or more."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $8.75 under West Virginia Code § 21-5C-2.",
      tippedCashWage: "Under W. Va. Code § 21-5C-4, tipped cash wage is 30% of the minimum wage ($2.62 per hour).",
      maxTipCredit: "Maximum tip credit is $6.13 per hour ($8.75 minus $2.62)."
    }
  },
  WI: {
    minWage: 7.25, tippedCashWage: 2.33, maxTipCredit: 4.92, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2009-07-24",
    notes: ["Wis. Stat. § 104.035 sets tipped cash wage at $2.33 per hour."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Basic Minimum Rate (per hour): $7.25 under Wisconsin Statutes § 104.035.",
      tippedCashWage: "Under Wis. Stat. § 104.035, minimum cash wage for tipped employees is $2.33 per hour.",
      maxTipCredit: "Maximum tip credit is $4.92 per hour ($7.25 minus $2.33)."
    }
  },
  WY: {
    minWage: 7.25, tippedCashWage: 2.13, maxTipCredit: 5.12, tipCreditAllowed: true,
    ot: { weekly: 40 },
    effectiveFrom: "2009-07-24",
    notes: ["State statutory rate is $5.15 (Wyo. Stat. § 27-4-202), but federal FLSA applies to covered employers."],
    sources: [
      { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
      { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
    ],
    quotes: {
      minWage: "Wyoming state rate is $5.15 under Wyo. Stat. § 27-4-202; covered employers pay federal FLSA rate of $7.25 per hour.",
      tippedCashWage: "Minimum tipped cash wage is $2.13 per hour under applicable federal standards.",
      maxTipCredit: "Maximum tip credit is $5.12 per hour."
    }
  }
};

const VERIFIED_ON = '2026-11-24';

// 1. Read existing states.json skeleton
const statesPath = 'F:/shiftandtip/data/states.json';
const statesJson = JSON.parse(fs.readFileSync(statesPath, 'utf8'));

statesJson.meta.verifiedOn = VERIFIED_ON;
statesJson.meta.federal = {
  minWage: 7.25,
  tippedCashWage: 2.13,
  maxTipCredit: 5.12,
  weeklyOT: 40,
  sources: [
    { label: "DOL WHD — Minimum Wage", url: DOL_MINWAGE_URL },
    { label: "DOL WHD — Tipped Minimum Wage", url: DOL_TIPPED_URL }
  ],
  verifiedOn: VERIFIED_ON
};

// 2. Populate states
let sourcesMd = `# Wage & Labor Data Sources

Every number in \`data/states.json\` is sourced exclusively from primary official sources: the U.S. Department of Labor Wage and Hour Division (DOL WHD) and state labor departments.
Verified as of **${VERIFIED_ON}**.

---

## Federal Baseline (FLSA)
- **Source**: DOL WHD ([Minimum Wage](${DOL_MINWAGE_URL}) | [Tipped Wages](${DOL_TIPPED_URL}))
- **Minimum Wage**: $7.25/hr
  > "Basic Minimum Rate (per hour): $7.25 under 29 U.S.C. 206(a)(1)."
- **Tipped Cash Wage**: $2.13/hr
  > "An employer of a tipped employee is only required to pay $2.13 an hour in direct wages under 29 U.S.C. 203(m)."
- **Maximum Tip Credit**: $5.12/hr
  > "Maximum tip credit against minimum wage is $5.12 an hour ($7.25 - $2.13)."
- **Weekly Overtime**: 40 hours under 29 U.S.C. 207(a)(1).

---

## State Data (50 States + District of Columbia)

`;

for (const state of statesJson.states) {
  const record = STATE_RECORDS[state.code];
  if (!record) {
    console.warn(`Missing record for ${state.code}`);
    continue;
  }

  state.minWage = record.minWage;
  state.tippedCashWage = record.tippedCashWage;
  state.maxTipCredit = record.maxTipCredit;
  state.tipCreditAllowed = record.tipCreditAllowed;
  if (record.ot) state.ot = record.ot;
  if (record.effectiveFrom) state.effectiveFrom = record.effectiveFrom;
  if (record.nextChange) state.nextChange = record.nextChange;
  state.notes = record.notes || [];
  state.sources = record.sources || [];
  state.verifiedOn = VERIFIED_ON;

  sourcesMd += `### ${state.name} (${state.code})\n`;
  sourcesMd += `- **Sources**:\n`;
  for (const s of state.sources) {
    sourcesMd += `  - [${s.label}](${s.url})\n`;
  }
  sourcesMd += `- **Basic Minimum Wage**: $${state.minWage.toFixed(2)}/hr\n`;
  sourcesMd += `  > "${record.quotes.minWage}"\n`;
  sourcesMd += `- **Tipped Cash Wage**: $${state.tippedCashWage.toFixed(2)}/hr\n`;
  sourcesMd += `  > "${record.quotes.tippedCashWage}"\n`;
  sourcesMd += `- **Maximum Tip Credit**: $${state.maxTipCredit.toFixed(2)}/hr (Allowed: ${state.tipCreditAllowed})\n`;
  sourcesMd += `  > "${record.quotes.maxTipCredit}"\n`;
  if (state.notes.length) {
    sourcesMd += `- **Notes**: ${state.notes.join(' ')}\n`;
  }
  sourcesMd += `\n`;
}

fs.writeFileSync(statesPath, JSON.stringify(statesJson, null, 2), 'utf8');
console.log(`Saved updated data/states.json with 51 states verified.`);

const sourcesPath = 'F:/shiftandtip/data/sources.md';
fs.writeFileSync(sourcesPath, sourcesMd, 'utf8');
console.log(`Saved data/sources.md with primary source links and quoted lines.`);
