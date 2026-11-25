import fs from 'node:fs';

const path = 'data/states.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// Update NY
const ny = data.states.find(s => s.code === 'NY');
if (ny) {
  ny.minWage = 17;
  ny.tippedCashWage = 11.35;
  ny.maxTipCredit = 5.65;
  ny.verifiedOn = '2026-11-24';
  ny.regions = [
    {
      name: 'New York City',
      minWage: 17.00,
      tippedCashWage: 11.35,
      maxTipCredit: 5.65,
      serviceCashWage: 14.15,
      serviceTipCredit: 2.85,
      sources: [
        {
          label: 'NY DOL — Minimum Wage (New York City)',
          url: 'https://dol.ny.gov/minimum-wage',
          quote: 'New York City\n$17.00\n$14.15 Cash Wage\n$2.85 Tip Credit\n$11.35 Cash Wage\n$5.65 Tip Credit',
          retrievedAt: '2026-11-24T16:09:58.272Z'
        }
      ]
    },
    {
      name: 'Long Island & Westchester',
      minWage: 17.00,
      tippedCashWage: 11.35,
      maxTipCredit: 5.65,
      serviceCashWage: 14.15,
      serviceTipCredit: 2.85,
      sources: [
        {
          label: 'NY DOL — Minimum Wage (Long Island & Westchester)',
          url: 'https://dol.ny.gov/minimum-wage',
          quote: 'Long Island & Westchester\n$17.00\n$14.15 Cash Wage\n$2.85 Tip Credit\n$11.35 Cash Wage\n$5.65 Tip Credit',
          retrievedAt: '2026-11-24T16:09:58.272Z'
        }
      ]
    },
    {
      name: 'Remainder of New York State',
      minWage: 16.00,
      tippedCashWage: 10.70,
      maxTipCredit: 5.30,
      serviceCashWage: 13.30,
      serviceTipCredit: 2.70,
      sources: [
        {
          label: 'NY DOL — Minimum Wage (Remainder of New York State)',
          url: 'https://dol.ny.gov/minimum-wage',
          quote: 'Remainder of  New York State\n$16.00\n$13.30 Cash Wage\n$2.70 Tip Credit\n$10.70 Cash Wage\n$5.30 Tip Credit',
          retrievedAt: '2026-11-24T16:09:58.272Z'
        }
      ]
    }
  ];

  ny.sources = [
    {
      field: 'minWage',
      label: 'NY DOL — Minimum Wage',
      url: 'https://dol.ny.gov/minimum-wage',
      quote: 'New York City\n$17.00\n$14.15 Cash Wage\n$2.85 Tip Credit\n$11.35 Cash Wage\n$5.65 Tip Credit',
      retrievedAt: '2026-11-24T16:09:58.272Z'
    },
    {
      field: 'tippedCashWage',
      label: 'NY DOL — Minimum Wage (Food Service)',
      url: 'https://dol.ny.gov/minimum-wage',
      quote: 'Tipped Food Service Workers as of 01/01/2027*\nNew York City\n$17.00\n$11.35 Cash Wage\n$5.65 Tip Credit',
      retrievedAt: '2026-11-24T16:09:58.272Z'
    },
    {
      field: 'maxTipCredit',
      label: 'NY DOL — Minimum Wage (Tip Credit)',
      url: 'https://dol.ny.gov/minimum-wage',
      quote: '$5.65 Tip Credit',
      retrievedAt: '2026-11-24T16:09:58.272Z'
    }
  ];
}

// Update CT: set null
const ct = data.states.find(s => s.code === 'CT');
if (ct) {
  ct.minWage = null;
  ct.tippedCashWage = null;
  ct.maxTipCredit = null;
  ct.verifiedOn = null;
}

// Update MT: set null
const mt = data.states.find(s => s.code === 'MT');
if (mt) {
  mt.minWage = null;
  mt.tippedCashWage = null;
  mt.maxTipCredit = null;
  mt.verifiedOn = null;
}

fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log('Successfully updated NY (with regions), CT (null), MT (null) in data/states.json');
