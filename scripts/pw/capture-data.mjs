import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchPublic, snapshot } from './browser.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');
const rawDir = path.join(rootDir, 'data/raw');
const blockedFile = path.join(rootDir, 'data/blocked.md');

if (!fs.existsSync(rawDir)) fs.mkdirSync(rawDir, { recursive: true });
if (!fs.existsSync(blockedFile)) {
  fs.writeFileSync(blockedFile, '# Blocked Sources Log\n\n| URL | Timestamp | Reason |\n|---|---|---|\n', 'utf8');
}

function logBlocked(url, reason) {
  const line = `| ${url} | ${new Date().toISOString()} | ${reason} |\n`;
  fs.appendFileSync(blockedFile, line, 'utf8');
  console.warn(`[BLOCKED] ${url}: ${reason}`);
}

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
  'Guam': 'GU', 'Puerto Rico': 'PR', 'Virgin Islands': 'VI'
};

const session = await launchPublic();

try {
  // 1. Capture DOL Tipped page
  console.log('1. Capturing DOL Tipped page...');
  const dolTippedUrl = 'https://www.dol.gov/agencies/whd/state/minimum-wage/tipped';
  try {
    const { resp, page } = await session.goto(dolTippedUrl);
    if (!resp || resp.status() >= 400) {
      logBlocked(dolTippedUrl, `HTTP ${resp ? resp.status() : 'failed'}`);
    } else {
      const snap = await snapshot(page, 'dol-tipped');
      // Parse table
      const rows = [];
      const trs = snap.html.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
      for (const tr of trs) {
        const cellMatches = tr.match(/<(?:td|th)[^>]*>([\s\S]*?)<\/(?:td|th)>/gi) || [];
        const cells = cellMatches.map(c => c.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim());
        if (cells.length >= 2) {
          const rawJuris = cells[0];
          let matchedCode = null;
          let matchedName = null;
          for (const [name, code] of Object.entries(STATE_NAMES_TO_CODES)) {
            if (rawJuris.toLowerCase().startsWith(name.toLowerCase())) {
              matchedCode = code;
              matchedName = name;
              break;
            }
          }
          if (matchedCode) {
            const parseNum = (str) => {
              if (!str) return null;
              const m = str.match(/\$([0-9]+(?:\.[0-9]+)?)/);
              return m ? parseFloat(m[1]) : null;
            };
            const combined = parseNum(cells[1]);
            const tipCredit = parseNum(cells[2]);
            const cashWage = parseNum(cells[3]);
            rows.push({
              code: matchedCode,
              name: matchedName,
              jurisdictionText: rawJuris,
              combinedRate: combined,
              maxTipCredit: tipCredit,
              minCashWage: cashWage,
              rawRowSnippet: cells.filter(Boolean).join(' | '),
              retrievedAt: snap.retrievedAt,
              url: dolTippedUrl
            });
          }
        }
      }
      fs.writeFileSync(path.join(rawDir, 'dol-tipped.json'), JSON.stringify(rows, null, 2), 'utf8');
      console.log(`Parsed ${rows.length} rows into data/raw/dol-tipped.json`);
    }
  } catch (err) {
    logBlocked(dolTippedUrl, err.message);
  }

  // 2. Capture DOL Minwage page
  console.log('2. Capturing DOL Minwage page...');
  const dolMinwageUrl = 'https://www.dol.gov/agencies/whd/minimum-wage/state';
  try {
    const { resp, page } = await session.goto(dolMinwageUrl);
    if (!resp || resp.status() >= 400) {
      logBlocked(dolMinwageUrl, `HTTP ${resp ? resp.status() : 'failed'}`);
    } else {
      const snap = await snapshot(page, 'dol-minwage');
      const minwageData = [];
      const reDiv = /<div id="([a-z]{2})">([\s\S]*?)(?=<div id="[a-z]{2}">|<\/body>|<footer|$)/gi;
      let m;
      while ((m = reDiv.exec(snap.html)) !== null) {
        const code = m[1].toUpperCase();
        const content = m[2];
        const clean = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        const mwMatch = clean.match(/(?:Basic Minimum Rate|minimum wage of)\s*(?:\([^)]*\))?:?\s*\$([0-9]+(?:\.[0-9]+)?)/i);
        const rate = mwMatch ? parseFloat(mwMatch[1]) : null;
        minwageData.push({
          code,
          minWage: rate,
          snippet: clean.slice(0, 300),
          retrievedAt: snap.retrievedAt,
          url: dolMinwageUrl
        });
      }
      fs.writeFileSync(path.join(rawDir, 'dol-minwage.json'), JSON.stringify(minwageData, null, 2), 'utf8');
      console.log(`Parsed ${minwageData.length} states into data/raw/dol-minwage.json`);
    }
  } catch (err) {
    logBlocked(dolMinwageUrl, err.message);
  }

  // 3. DOL Fact Sheet #15
  console.log('3. Capturing DOL Fact Sheet #15...');
  const factsheetUrl = 'https://www.dol.gov/agencies/whd/fact-sheets/15-tipped-employees-flsa';
  try {
    const { resp, page } = await session.goto(factsheetUrl);
    if (!resp || resp.status() >= 400) {
      logBlocked(factsheetUrl, `HTTP ${resp ? resp.status() : 'failed'}`);
    } else {
      const snap = await snapshot(page, 'dol-factsheet-15');
      const confirmsFed = snap.text.includes('$7.25') && snap.text.includes('$2.13') && snap.text.includes('$5.12');
      console.log(`DOL Fact Sheet #15 confirms federal $7.25 / $2.13 / $5.12: ${confirmsFed ? 'YES' : 'NO'}`);
      fs.writeFileSync(path.join(rawDir, 'dol-factsheet-15.json'), JSON.stringify({
        url: factsheetUrl,
        confirmsFederal: confirmsFed,
        retrievedAt: snap.retrievedAt
      }, null, 2), 'utf8');
    }
  } catch (err) {
    logBlocked(factsheetUrl, err.message);
  }

  // 4. Follow state labor department links for the 10 cross-check states
  console.log('4. Cross-checking 10 states against official state labor sites...');
  const STATE_URLS = {
    CA: 'https://www.dir.ca.gov/dlse/faq_minimumwage.htm',
    TX: 'https://www.twc.texas.gov/programs/wage-and-hour/texas-minimum-wage-act',
    FL: 'https://floridajobs.org/minimumwage',
    NY: 'https://dol.ny.gov/minimum-wage',
    PA: 'https://www.dli.pa.gov/Individuals/Labor-Management-Relations/llc/minimum-wage/Pages/default.aspx',
    IL: 'https://labor.illinois.gov/laws-rules/fls/minimum-wage-law.html',
    GA: 'https://dol.georgia.gov/',
    NV: 'https://labor.nv.gov/Employer/Wage_and_Hour_Laws/',
    CO: 'https://cdle.colorado.gov/wage-and-hour-laws/minimum-wage',
    AK: 'https://labor.alaska.gov/lss/whhome.htm'
  };

  for (const [code, url] of Object.entries(STATE_URLS)) {
    console.log(`Checking state ${code} at ${url}...`);
    try {
      const { resp, page } = await session.goto(url);
      if (!resp || resp.status() >= 400) {
        logBlocked(url, `HTTP ${resp ? resp.status() : 'failed'}`);
        continue;
      }
      const snap = await snapshot(page, `state-${code.toLowerCase()}`);
      fs.writeFileSync(path.join(rawDir, `state-${code.toLowerCase()}.json`), JSON.stringify({
        code,
        url,
        retrievedAt: snap.retrievedAt,
        textSample: snap.text.slice(0, 1000)
      }, null, 2), 'utf8');
      console.log(`Saved state-${code.toLowerCase()}.json`);
    } catch (err) {
      logBlocked(url, err.message);
    }
  }

  // 5. SSA wage base
  console.log('5. Capturing SSA wage base...');
  const ssaUrl = 'https://www.ssa.gov/oact/cola/cbb.html';
  try {
    const { resp, page } = await session.goto(ssaUrl);
    if (!resp || resp.status() >= 400) {
      logBlocked(ssaUrl, `HTTP ${resp ? resp.status() : 'failed'}`);
    } else {
      const snap = await snapshot(page, 'ssa-wage-base');
      const confirms2026 = snap.text.includes('184,500') || snap.text.includes('182,700');
      const confirms2025 = snap.text.includes('176,100');
      fs.writeFileSync(path.join(rawDir, 'ssa-wage-base.json'), JSON.stringify({
        url: ssaUrl,
        confirms2025,
        confirms2026,
        retrievedAt: snap.retrievedAt
      }, null, 2), 'utf8');
      console.log(`SSA 2025 confirmed: ${confirms2025}, 2026 confirmed: ${confirms2026}`);
    }
  } catch (err) {
    logBlocked(ssaUrl, err.message);
  }

  // 6. IRS deductions
  console.log('6. Capturing IRS deductions...');
  const irsUrl = 'https://www.irs.gov/newsroom/treasury-and-irs-issue-guidance-on-new-deductions-for-tips-and-overtime-pay';
  try {
    const { resp, page } = await session.goto(irsUrl);
    if (!resp || resp.status() >= 400) {
      logBlocked(irsUrl, `HTTP ${resp ? resp.status() : 'failed'}`);
    } else {
      const snap = await snapshot(page, 'irs-tips-ot-deduction');
      fs.writeFileSync(path.join(rawDir, 'irs-tips-ot-deduction.json'), JSON.stringify({
        url: irsUrl,
        retrievedAt: snap.retrievedAt,
        sample: snap.text.slice(0, 1000)
      }, null, 2), 'utf8');
      console.log('Saved IRS guidance snapshot');
    }
  } catch (err) {
    logBlocked(irsUrl, err.message);
  }

} finally {
  await session.close();
}
