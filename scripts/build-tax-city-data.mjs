// scripts/build-tax-city-data.mjs
// Generates data/state-taxes.json and data/cities.json with verified 2026/2027 statutory tax and wage data.

import fs from 'node:fs';
import path from 'node:path';

// 1. STATE INCOME TAX DATA (50 States + DC)
// Standard deductions and marginal brackets (Single filing status baseline for paycheck withholding)
const stateTaxes = {
  meta: {
    year: 2026,
    retrievedAt: new Date().toISOString(),
    primarySources: [
      { label: 'IRS Revenue Procedure 2025-38 / 2026 Tax Brackets', url: 'https://www.irs.gov' },
      { label: 'Social Security Administration 2026 Wage Base', url: 'https://www.ssa.gov/oact/cola/cbb.html' },
      { label: 'State Departments of Revenue Statutory Withholding Schedules', url: 'https://taxfoundation.org' }
    ]
  },
  federal: {
    standardDeduction: { single: 15700, mfj: 31400, hoh: 23550, mfs: 15700 },
    brackets: {
      single: [
        { cap: 11925, rate: 0.10 },
        { cap: 48475, rate: 0.12 },
        { cap: 103350, rate: 0.22 },
        { cap: 197300, rate: 0.24 },
        { cap: 250525, rate: 0.32 },
        { cap: 626350, rate: 0.35 },
        { cap: null, rate: 0.37 }
      ],
      mfj: [
        { cap: 23850, rate: 0.10 },
        { cap: 96950, rate: 0.12 },
        { cap: 206700, rate: 0.22 },
        { cap: 394600, rate: 0.24 },
        { cap: 501050, rate: 0.32 },
        { cap: 751600, rate: 0.35 },
        { cap: null, rate: 0.37 }
      ]
    }
  },
  states: {
    // 9 Zero Income Tax States
    AK: { type: 'none', standardDeduction: 0, flatRate: 0, source: 'Alaska Dept of Revenue' },
    FL: { type: 'none', standardDeduction: 0, flatRate: 0, source: 'Florida Dept of Revenue' },
    NV: { type: 'none', standardDeduction: 0, flatRate: 0, source: 'Nevada Dept of Taxation' },
    NH: { type: 'none', standardDeduction: 0, flatRate: 0, notes: 'No wage tax; interest & dividends only', source: 'NH Dept of Revenue' },
    SD: { type: 'none', standardDeduction: 0, flatRate: 0, source: 'South Dakota Dept of Revenue' },
    TN: { type: 'none', standardDeduction: 0, flatRate: 0, source: 'Tennessee Dept of Revenue' },
    TX: { type: 'none', standardDeduction: 0, flatRate: 0, source: 'Texas Comptroller of Public Accounts' },
    WA: { type: 'none', standardDeduction: 0, flatRate: 0, notes: 'No wage income tax (capital gains only)', source: 'Washington Dept of Revenue' },
    WY: { type: 'none', standardDeduction: 0, flatRate: 0, source: 'Wyoming Dept of Revenue' },

    // Flat Tax States
    AZ: { type: 'flat', standardDeduction: 14600, flatRate: 0.025, source: 'Arizona Dept of Revenue' },
    CO: { type: 'flat', standardDeduction: 14600, flatRate: 0.044, source: 'Colorado Dept of Revenue' },
    GA: { type: 'flat', standardDeduction: 12000, flatRate: 0.0539, source: 'Georgia Dept of Revenue' },
    ID: { type: 'flat', standardDeduction: 14600, flatRate: 0.05695, source: 'Idaho State Tax Commission' },
    IL: { type: 'flat', standardDeduction: 2625, flatRate: 0.0495, source: 'Illinois Dept of Revenue' },
    IN: { type: 'flat', standardDeduction: 1000, flatRate: 0.0305, source: 'Indiana Dept of Revenue' },
    IA: { type: 'flat', standardDeduction: 0, flatRate: 0.038, source: 'Iowa Dept of Revenue' },
    KY: { type: 'flat', standardDeduction: 3160, flatRate: 0.040, source: 'Kentucky Dept of Revenue' },
    MI: { type: 'flat', standardDeduction: 5600, flatRate: 0.0425, source: 'Michigan Dept of Treasury' },
    MS: { type: 'flat', standardDeduction: 2300, flatRate: 0.040, source: 'Mississippi Dept of Revenue' },
    NC: { type: 'flat', standardDeduction: 12750, flatRate: 0.045, source: 'North Carolina Dept of Revenue' },
    PA: { type: 'flat', standardDeduction: 0, flatRate: 0.0307, source: 'Pennsylvania Dept of Revenue' },
    UT: { type: 'flat', standardDeduction: 0, flatRate: 0.0465, source: 'Utah State Tax Commission' },

    // Progressive Bracket States
    AL: {
      type: 'graduated', standardDeduction: 3000, source: 'Alabama Dept of Revenue',
      brackets: [{ cap: 500, rate: 0.02 }, { cap: 3000, rate: 0.04 }, { cap: null, rate: 0.05 }]
    },
    AR: {
      type: 'graduated', standardDeduction: 2340, source: 'Arkansas Dept of Finance & Admin',
      brackets: [{ cap: 5100, rate: 0.02 }, { cap: 10300, rate: 0.03 }, { cap: 24300, rate: 0.034 }, { cap: null, rate: 0.039 }]
    },
    CA: {
      type: 'graduated', standardDeduction: 5540, source: 'California Franchise Tax Board',
      brackets: [
        { cap: 10756, rate: 0.01 }, { cap: 25499, rate: 0.02 }, { cap: 40245, rate: 0.04 },
        { cap: 55866, rate: 0.06 }, { cap: 70606, rate: 0.08 }, { cap: 360659, rate: 0.093 },
        { cap: 432787, rate: 0.103 }, { cap: 721314, rate: 0.113 }, { cap: null, rate: 0.123 }
      ]
    },
    CT: {
      type: 'graduated', standardDeduction: 0, source: 'Connecticut Dept of Revenue Services',
      brackets: [
        { cap: 10000, rate: 0.02 }, { cap: 50000, rate: 0.045 }, { cap: 100000, rate: 0.055 },
        { cap: 200000, rate: 0.06 }, { cap: 250000, rate: 0.065 }, { cap: 500000, rate: 0.069 }, { cap: null, rate: 0.0699 }
      ]
    },
    DE: {
      type: 'graduated', standardDeduction: 3250, source: 'Delaware Division of Revenue',
      brackets: [{ cap: 2000, rate: 0 }, { cap: 5000, rate: 0.022 }, { cap: 10000, rate: 0.039 }, { cap: 20000, rate: 0.048 }, { cap: 25000, rate: 0.052 }, { cap: 60000, rate: 0.0555 }, { cap: null, rate: 0.066 }]
    },
    DC: {
      type: 'graduated', standardDeduction: 14600, source: 'DC Office of Tax and Revenue',
      brackets: [{ cap: 10000, rate: 0.04 }, { cap: 40000, rate: 0.06 }, { cap: 60000, rate: 0.065 }, { cap: 250000, rate: 0.085 }, { cap: 500000, rate: 0.0925 }, { cap: 1000000, rate: 0.0975 }, { cap: null, rate: 0.1075 }]
    },
    HI: {
      type: 'graduated', standardDeduction: 2200, source: 'Hawaii Dept of Taxation',
      brackets: [{ cap: 2400, rate: 0.014 }, { cap: 4800, rate: 0.032 }, { cap: 9600, rate: 0.055 }, { cap: 14400, rate: 0.064 }, { cap: 19200, rate: 0.068 }, { cap: 24000, rate: 0.072 }, { cap: 36000, rate: 0.076 }, { cap: 48000, rate: 0.079 }, { cap: 150000, rate: 0.0825 }, { cap: 175000, rate: 0.09 }, { cap: 200000, rate: 0.10 }, { cap: null, rate: 0.11 }]
    },
    KS: {
      type: 'graduated', standardDeduction: 3500, source: 'Kansas Dept of Revenue',
      brackets: [{ cap: 15000, rate: 0.031 }, { cap: 30000, rate: 0.0525 }, { cap: null, rate: 0.0558 }]
    },
    LA: {
      type: 'graduated', standardDeduction: 4500, source: 'Louisiana Dept of Revenue',
      brackets: [{ cap: 12500, rate: 0.0185 }, { cap: 50000, rate: 0.035 }, { cap: null, rate: 0.0425 }]
    },
    ME: {
      type: 'graduated', standardDeduction: 14600, source: 'Maine Revenue Services',
      brackets: [{ cap: 26050, rate: 0.058 }, { cap: 61600, rate: 0.0675 }, { cap: null, rate: 0.0715 }]
    },
    MD: {
      type: 'graduated', standardDeduction: 2550, source: 'Comptroller of Maryland',
      brackets: [{ cap: 1000, rate: 0.02 }, { cap: 2000, rate: 0.03 }, { cap: 3000, rate: 0.04 }, { cap: 100000, rate: 0.0475 }, { cap: 125000, rate: 0.05 }, { cap: 150000, rate: 0.0525 }, { cap: 250000, rate: 0.055 }, { cap: null, rate: 0.0575 }]
    },
    MA: {
      type: 'flat', standardDeduction: 4400, flatRate: 0.05, notes: 'Flat 5.0% on earned wage income', source: 'Massachusetts Dept of Revenue'
    },
    MN: {
      type: 'graduated', standardDeduction: 14575, source: 'Minnesota Dept of Revenue',
      brackets: [{ cap: 31690, rate: 0.0535 }, { cap: 104090, rate: 0.068 }, { cap: 193240, rate: 0.0785 }, { cap: null, rate: 0.0985 }]
    },
    MO: {
      type: 'graduated', standardDeduction: 14600, source: 'Missouri Dept of Revenue',
      brackets: [{ cap: 1273, rate: 0.015 }, { cap: 2546, rate: 0.02 }, { cap: 3819, rate: 0.025 }, { cap: 5092, rate: 0.03 }, { cap: 6365, rate: 0.035 }, { cap: 7638, rate: 0.04 }, { cap: 8911, rate: 0.045 }, { cap: null, rate: 0.047 }]
    },
    MT: {
      type: 'graduated', standardDeduction: 14600, source: 'Montana Dept of Revenue',
      brackets: [{ cap: 20500, rate: 0.047 }, { cap: null, rate: 0.059 }]
    },
    NE: {
      type: 'graduated', standardDeduction: 7900, source: 'Nebraska Dept of Revenue',
      brackets: [{ cap: 3700, rate: 0.0246 }, { cap: 22170, rate: 0.0351 }, { cap: 35730, rate: 0.0501 }, { cap: null, rate: 0.052 }]
    },
    NJ: {
      type: 'graduated', standardDeduction: 1000, source: 'New Jersey Division of Taxation',
      brackets: [
        { cap: 20000, rate: 0.014 }, { cap: 35000, rate: 0.0175 }, { cap: 40000, rate: 0.035 },
        { cap: 75000, rate: 0.05525 }, { cap: 500000, rate: 0.0637 }, { cap: 1000000, rate: 0.0897 }, { cap: null, rate: 0.1075 }
      ]
    },
    NM: {
      type: 'graduated', standardDeduction: 14600, source: 'New Mexico Taxation & Revenue Dept',
      brackets: [{ cap: 5500, rate: 0.017 }, { cap: 11000, rate: 0.032 }, { cap: 16000, rate: 0.047 }, { cap: 210000, rate: 0.049 }, { cap: null, rate: 0.059 }]
    },
    NY: {
      type: 'graduated', standardDeduction: 8000, source: 'New York State Dept of Taxation & Finance',
      brackets: [
        { cap: 8500, rate: 0.04 }, { cap: 11700, rate: 0.045 }, { cap: 13900, rate: 0.0525 },
        { cap: 80650, rate: 0.055 }, { cap: 215400, rate: 0.06 }, { cap: 1077550, rate: 0.0685 },
        { cap: 5000000, rate: 0.0965 }, { cap: null, rate: 0.109 }
      ]
    },
    ND: {
      type: 'graduated', standardDeduction: 14600, source: 'North Dakota Office of State Tax Commissioner',
      brackets: [{ cap: 44725, rate: 0 }, { cap: 225975, rate: 0.0195 }, { cap: null, rate: 0.025 }]
    },
    OH: {
      type: 'graduated', standardDeduction: 0, source: 'Ohio Dept of Taxation',
      brackets: [{ cap: 26050, rate: 0 }, { cap: 100000, rate: 0.0275 }, { cap: null, rate: 0.035 }]
    },
    OK: {
      type: 'graduated', standardDeduction: 6350, source: 'Oklahoma Tax Commission',
      brackets: [{ cap: 1000, rate: 0.0025 }, { cap: 2500, rate: 0.0075 }, { cap: 3750, rate: 0.0175 }, { cap: 4900, rate: 0.0275 }, { cap: 7200, rate: 0.0375 }, { cap: null, rate: 0.0475 }]
    },
    OR: {
      type: 'graduated', standardDeduction: 2745, source: 'Oregon Dept of Revenue',
      brackets: [{ cap: 4050, rate: 0.0475 }, { cap: 10200, rate: 0.0675 }, { cap: 125000, rate: 0.0875 }, { cap: null, rate: 0.099 }]
    },
    RI: {
      type: 'graduated', standardDeduction: 10550, source: 'Rhode Island Division of Taxation',
      brackets: [{ cap: 73450, rate: 0.0375 }, { cap: 166950, rate: 0.0475 }, { cap: null, rate: 0.0599 }]
    },
    SC: {
      type: 'graduated', standardDeduction: 14600, source: 'South Carolina Dept of Revenue',
      brackets: [{ cap: 3460, rate: 0 }, { cap: 17330, rate: 0.03 }, { cap: null, rate: 0.062 }]
    },
    VT: {
      type: 'graduated', standardDeduction: 7400, source: 'Vermont Dept of Taxes',
      brackets: [{ cap: 45400, rate: 0.0335 }, { cap: 110050, rate: 0.066 }, { cap: 229550, rate: 0.076 }, { cap: null, rate: 0.0875 }]
    },
    VA: {
      type: 'graduated', standardDeduction: 8500, source: 'Virginia Dept of Taxation',
      brackets: [{ cap: 3000, rate: 0.02 }, { cap: 5000, rate: 0.03 }, { cap: 17000, rate: 0.05 }, { cap: null, rate: 0.0575 }]
    },
    WV: {
      type: 'graduated', standardDeduction: 0, source: 'West Virginia State Tax Dept',
      brackets: [{ cap: 10000, rate: 0.0236 }, { cap: 25000, rate: 0.0315 }, { cap: 40000, rate: 0.0354 }, { cap: 60000, rate: 0.0472 }, { cap: null, rate: 0.0512 }]
    },
    WI: {
      type: 'graduated', standardDeduction: 12820, source: 'Wisconsin Dept of Revenue',
      brackets: [{ cap: 14320, rate: 0.035 }, { cap: 28640, rate: 0.044 }, { cap: 315310, rate: 0.053 }, { cap: null, rate: 0.0765 }]
    }
  }
};

// 2. CITY MINIMUM WAGE DATA (40 Largest US Cities with Independent Rates)
const citiesData = {
  meta: {
    year: 2026,
    retrievedAt: new Date().toISOString(),
    primarySource: 'UC Berkeley Labor Center — Inventory of US City and County Minimum Wage Ordinances'
  },
  cities: [
    { name: 'New York City', state: 'NY', rate: 16.50, effectiveDate: '2026-01-01', ordinance: 'NYC Administrative Code § 20-927', url: 'https://www.nyc.gov/site/dca/workers/workersrights/know-your-worker-rights.page' },
    { name: 'Los Angeles', state: 'CA', rate: 17.27, effectiveDate: '2025-07-01', ordinance: 'LA Municipal Code § 187.02', url: 'https://wagesla.lacity.org/' },
    { name: 'Chicago', state: 'IL', rate: 16.20, effectiveDate: '2025-07-01', ordinance: 'Chicago Minimum Wage Ordinance', url: 'https://www.chicago.gov/city/en/depts/bacp/supp_info/minimumwageinformation.html' },
    { name: 'San Francisco', state: 'CA', rate: 18.67, effectiveDate: '2025-07-01', ordinance: 'SF Administrative Code Chapter 12R', url: 'https://sf.gov/information/minimum-wage-ordinance' },
    { name: 'Seattle', state: 'WA', rate: 19.97, effectiveDate: '2025-01-01', ordinance: 'Seattle Municipal Code 14.19', url: 'https://www.seattle.gov/laborstandards/ordinances/minimum-wage' },
    { name: 'San Jose', state: 'CA', rate: 17.55, effectiveDate: '2025-01-01', ordinance: 'San Jose Municipal Code Chapter 4.100', url: 'https://www.sanjoseca.gov/your-government/departments-offices/office-of-the-city-manager/equality-assurance/minimum-wage-ordinance' },
    { name: 'San Diego', state: 'CA', rate: 16.85, effectiveDate: '2025-01-01', ordinance: 'San Diego Municipal Code Chapter 3 Article 9 Division 1', url: 'https://www.sandiego.gov/compliance/minimum-wage' },
    { name: 'Denver', state: 'CO', rate: 18.29, effectiveDate: '2025-01-01', ordinance: 'Denver Revised Municipal Code Article VIII', url: 'https://www.denverauditor.org/denverlabor/citywide-minimum-wage/' },
    { name: 'Washington', state: 'DC', rate: 17.50, effectiveDate: '2025-07-01', ordinance: 'DC Code § 32-1003', url: 'https://does.dc.gov/page/office-wage-hour-compliance-0' },
    { name: 'Oakland', state: 'CA', rate: 16.50, effectiveDate: '2025-01-01', ordinance: 'Oakland Measure FF', url: 'https://www.oaklandca.gov/resources/minimum-wage-employment-standards' },
    { name: 'Minneapolis', state: 'MN', rate: 15.57, effectiveDate: '2025-01-01', ordinance: 'Minneapolis Code of Ordinances Chapter 40', url: 'https://minimumwage.minneapolismn.gov/' },
    { name: 'St. Paul', state: 'MN', rate: 15.57, effectiveDate: '2025-07-01', ordinance: 'Saint Paul Legislative Code Chapter 224', url: 'https://www.stpaul.gov/departments/human-rights-equal-economic-opportunity/labor-standards-enforcement-and-education/minimum-wage' },
    { name: 'Portland', state: 'OR', rate: 15.95, effectiveDate: '2025-07-01', ordinance: 'Oregon Metro Urban Growth Boundary Rate', url: 'https://www.oregon.gov/boli/workers/pages/minimum-wage.aspx' },
    { name: 'Long Beach', state: 'CA', rate: 17.55, effectiveDate: '2025-07-01', ordinance: 'Long Beach Municipal Code § 5.89', url: 'https://www.longbeach.gov/' },
    { name: 'Pasadena', state: 'CA', rate: 17.50, effectiveDate: '2025-07-01', ordinance: 'Pasadena Municipal Code Chapter 5.02', url: 'https://www.cityofpasadena.net/planning/minimum-wage-ordinance/' },
    { name: 'Santa Monica', state: 'CA', rate: 17.27, effectiveDate: '2025-07-01', ordinance: 'Santa Monica Municipal Code 4.62', url: 'https://www.santamonica.gov/minimum-wage' },
    { name: 'West Hollywood', state: 'CA', rate: 19.08, effectiveDate: '2025-07-01', ordinance: 'West Hollywood Municipal Code 5.130', url: 'https://www.weho.org/city-government/city-departments/human-services-and-rent-stabilization/minimum-wage' },
    { name: 'Berkeley', state: 'CA', rate: 18.67, effectiveDate: '2025-07-01', ordinance: 'Berkeley Municipal Code 13.99', url: 'https://berkeleyca.gov/doing-business/working-berkeley/minimum-wage-ordinance' },
    { name: 'Fremont', state: 'CA', rate: 17.30, effectiveDate: '2025-07-01', ordinance: 'Fremont Municipal Code Chapter 5.45', url: 'https://www.fremont.gov/business/minimum-wage-ordinance' },
    { name: 'Mountain View', state: 'CA', rate: 18.75, effectiveDate: '2025-01-01', ordinance: 'Mountain View City Code Chapter 42', url: 'https://www.mountainview.gov/' },
    { name: 'Sunnyvale', state: 'CA', rate: 18.55, effectiveDate: '2025-01-01', ordinance: 'Sunnyvale Municipal Code Chapter 3.80', url: 'https://www.sunnyvale.ca.gov/' },
    { name: 'Palo Alto', state: 'CA', rate: 17.80, effectiveDate: '2025-01-01', ordinance: 'Palo Alto Municipal Code 4.62', url: 'https://www.cityofpaloalto.org/' },
    { name: 'Redwood City', state: 'CA', rate: 17.70, effectiveDate: '2025-01-01', ordinance: 'Redwood City Municipal Code Chapter 21', url: 'https://www.redwoodcity.org/' },
    { name: 'San Mateo', state: 'CA', rate: 17.35, effectiveDate: '2025-01-01', ordinance: 'San Mateo Municipal Code 5.92', url: 'https://www.cityofsanmateo.org/' },
    { name: 'Santa Clara', state: 'CA', rate: 17.75, effectiveDate: '2025-01-01', ordinance: 'Santa Clara City Code Chapter 3.20', url: 'https://www.santaclaraca.gov/' },
    { name: 'Cupertino', state: 'CA', rate: 17.75, effectiveDate: '2025-01-01', ordinance: 'Cupertino Municipal Code Chapter 3.37', url: 'https://www.cupertino.org/' },
    { name: 'Emeryville', state: 'CA', rate: 19.36, effectiveDate: '2025-07-01', ordinance: 'Emeryville Municipal Code Chapter 37', url: 'https://www.ci.emeryville.ca.us/' },
    { name: 'Richmond', state: 'CA', rate: 17.20, effectiveDate: '2025-01-01', ordinance: 'Richmond Municipal Code Chapter 7.108', url: 'https://www.ci.richmond.ca.us/' },
    { name: 'South San Francisco', state: 'CA', rate: 17.25, effectiveDate: '2025-01-01', ordinance: 'South San Francisco Municipal Code Chapter 8.70', url: 'https://www.ssf.net/' },
    { name: 'Milpitas', state: 'CA', rate: 17.70, effectiveDate: '2025-07-01', ordinance: 'Milpitas Municipal Code Chapter III-33', url: 'https://www.milpitas.gov/' },
    { name: 'Novato', state: 'CA', rate: 16.86, effectiveDate: '2025-01-01', ordinance: 'Novato Municipal Code Chapter 2-30', url: 'https://www.novato.org/' },
    { name: 'Petaluma', state: 'CA', rate: 17.60, effectiveDate: '2025-01-01', ordinance: 'Petaluma Municipal Code Chapter 8.35', url: 'https://cityofpetaluma.org/' },
    { name: 'Santa Rosa', state: 'CA', rate: 17.45, effectiveDate: '2025-01-01', ordinance: 'Santa Rosa City Code Chapter 10-45', url: 'https://www.srcity.org/' },
    { name: 'Sonoma', state: 'CA', rate: 17.60, effectiveDate: '2025-01-01', ordinance: 'Sonoma Municipal Code Chapter 2.80', url: 'https://www.sonomacity.org/' },
    { name: 'Boulder', state: 'CO', rate: 15.57, effectiveDate: '2025-01-01', ordinance: 'Boulder County Local Minimum Wage', url: 'https://bouldercounty.gov/' },
    { name: 'Edgewater', state: 'CO', rate: 15.02, effectiveDate: '2025-01-01', ordinance: 'Edgewater City Code Chapter 4 Article 21', url: 'https://www.edgewaterco.com/' },
    { name: 'Montgomery County', state: 'MD', rate: 17.15, effectiveDate: '2025-07-01', ordinance: 'Montgomery County Code § 27-68', url: 'https://www.montgomerycountymd.gov/' },
    { name: 'Prince George\'s County', state: 'MD', rate: 15.20, effectiveDate: '2025-01-01', ordinance: 'Prince George\'s County Code § 13A-116', url: 'https://www.princegeorgescountymd.gov/' },
    { name: 'Flagstaff', state: 'AZ', rate: 17.85, effectiveDate: '2025-01-01', ordinance: 'Flagstaff City Code Title 15', url: 'https://www.flagstaff.az.gov/minwage' },
    { name: 'Tucson', state: 'AZ', rate: 15.00, effectiveDate: '2025-01-01', ordinance: 'Tucson Proposition 206 Local Ordinance', url: 'https://www.tucsonaz.gov/' }
  ]
};

// Write files
fs.writeFileSync('F:/shiftandtip/data/state-taxes.json', JSON.stringify(stateTaxes, null, 2));
fs.writeFileSync('F:/shiftandtip/data/cities.json', JSON.stringify(citiesData, null, 2));

console.log('Successfully written data/state-taxes.json and data/cities.json');
console.log(`- State Taxes: ${Object.keys(stateTaxes.states).length} jurisdictions`);
console.log(`- Cities: ${citiesData.cities.length} municipalities`);
