import fs from 'node:fs';

const html = fs.readFileSync('data/raw/snapshots/dol-tipped-2026-11-24.html', 'utf8');

const STATE_NAMES_TO_CODES = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
  'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'District of Columbia': 'DC',
  'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL',
  'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA',
  'Maine': 'ME', 'Maryland': 'MD', 'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN',
  'Mississippi': 'MS', 'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
  'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
  'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK', 'Oregon': 'OR',
  'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC', 'South Dakota': 'SD',
  'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT', 'Virginia': 'VA',
  'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY',
  'Guam': 'GU', 'Puerto Rico': 'PR', 'Virgin Islands': 'VI', 'American Samoa': 'AS',
  'Northern Mariana Islands': 'MP'
};

const rows = [];
const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
let trMatch;

while ((trMatch = trRegex.exec(html)) !== null) {
  const rowContent = trMatch[1];
  if (rowContent.includes('<th') && !rowContent.includes('<td')) continue; // table header
  
  // Extract cells (th or td)
  const cellRegex = /<(?:td|th)[^>]*>([\s\S]*?)<\/(?:td|th)>/gi;
  const cells = [];
  let cellMatch;
  while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
    const raw = cellMatch[1];
    const text = raw.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    cells.push({ raw, text });
  }

  if (cells.length >= 3) {
    const rawJurisdiction = cells[0].text;
    // Check if starts with a known state
    let matchedCode = null;
    let matchedName = null;
    for (const [name, code] of Object.entries(STATE_NAMES_TO_CODES)) {
      if (rawJurisdiction.toLowerCase().startsWith(name.toLowerCase())) {
        matchedCode = code;
        matchedName = name;
        break;
      }
    }

    if (matchedCode) {
      // Parse rates
      // Cells: 0: State, 1: Combined Rate, 2: Max Tip Credit, 3: Min Cash Wage, 4: Def
      const parseNum = (str) => {
        if (!str) return null;
        const m = str.match(/\$([0-9]+(?:\.[0-9]+)?)/);
        return m ? parseFloat(m[1]) : null;
      };

      const combined = parseNum(cells[1]?.text);
      const tipCredit = parseNum(cells[2]?.text);
      const cashWage = parseNum(cells[3]?.text);

      rows.push({
        code: matchedCode,
        name: matchedName,
        jurisdictionText: rawJurisdiction,
        combinedRateText: cells[1]?.text || '',
        combinedRate: combined,
        maxTipCreditText: cells[2]?.text || '',
        maxTipCredit: tipCredit,
        minCashWageText: cells[3]?.text || '',
        minCashWage: cashWage,
        definitionText: cells[4]?.text || '',
        rawSnippet: cells.map(c => c.text).filter(Boolean).join(' | ')
      });
    }
  }
}

console.log('Parsed DOL tipped rows:', rows.length);
console.log('Sample rows:', rows.slice(0, 10));
