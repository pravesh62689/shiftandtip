// scripts/pw/capture-tax-and-cities.mjs
// Playwright automation to visit official .gov state revenue & municipal labor pages,
// save live text snapshots in data/raw/snapshots/, and extract verifiable quotes/rates
// into data/raw/tax-<state>.json and data/raw/city-<slug>.json.
// Supports `--pending-only` to capture only unverified states/cities.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchPublic } from './browser.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const rawDir = path.join(rootDir, 'data/raw');
const snapshotsDir = path.join(rawDir, 'snapshots');
const taxPath = path.join(rootDir, 'data/state-taxes.json');
const citiesPath = path.join(rootDir, 'data/cities.json');

if (!fs.existsSync(snapshotsDir)) fs.mkdirSync(snapshotsDir, { recursive: true });

const PENDING_ONLY = process.argv.includes('--pending-only');

// Official .gov Department of Revenue tax rate/withholding URLs (50 States + DC)
const STATE_GOV_URLS = {
  AL: 'https://www.revenue.alabama.gov/individual-corporate/taxes-administered-by-individual-corporate-income-tax/individual-income-tax/',
  AK: 'https://dor.alaska.gov/',
  AZ: 'https://azdor.gov/individuals/income-tax-filing-assistance',
  AR: 'https://www.dfa.arkansas.gov/office/taxes/income-tax-administration/individual-income-tax/',
  CA: 'https://www.ftb.ca.gov/file/personal/tax-calculator-tables-rates.html',
  CO: 'https://tax.colorado.gov/individual-income-tax-guide',
  CT: 'https://portal.ct.gov/drs/individuals/individual-tax-page/tax-information',
  DE: 'https://revenue.delaware.gov/frequently-asked-questions/personal-income-tax-faqs/',
  DC: 'https://otr.cfo.dc.gov/page/individual-income-tax-filing',
  FL: 'https://floridarevenue.com/taxes/taxesfees/Pages/default.aspx',
  GA: 'https://dor.georgia.gov/taxes/individual-taxes/income-tax-rates',
  HI: 'https://tax.hawaii.gov/geninfo/a1_b2_3tax_rates/',
  ID: 'https://tax.idaho.gov/taxes/income-tax/individual-income/rate/',
  IL: 'https://tax.illinois.gov/individuals/taxrates.html',
  IN: 'https://www.in.gov/dor/individual-income-taxes/',
  IA: 'https://revenue.iowa.gov/taxes/tax-guidance/individual-income-tax/iowa-income-tax-rate-schedules',
  KS: 'https://www.ksrevenue.gov/perstrainfo.html',
  KY: 'https://revenue.ky.gov/Individual/Pages/default.aspx',
  LA: 'https://revenue.louisiana.gov/IndividualIncomeTax',
  ME: 'https://www.maine.gov/revenue/taxes/income-estate-tax/individual-income-tax-1040me',
  MD: 'https://www.marylandtaxes.gov/individual/income/tax-info/tax-rates.php',
  MA: 'https://www.mass.gov/info-details/massachusetts-tax-rates',
  MI: 'https://www.michigan.gov/taxes/iit',
  MN: 'https://www.revenue.state.mn.us/minnesota-income-tax-rates-and-brackets',
  MS: 'https://www.dor.ms.gov/individual/individual-income-tax-faqs',
  MO: 'https://dor.mo.gov/taxation/individual/tax-types/income/',
  MT: 'https://mtrevenue.gov/taxes/individual-income-tax/',
  NE: 'https://revenue.nebraska.gov/individuals',
  NV: 'https://tax.nv.gov/',
  NH: 'https://www.revenue.nh.gov/',
  NJ: 'https://www.nj.gov/treasury/taxation/njit25.shtml',
  NM: 'https://www.tax.newmexico.gov/individuals/personal-income-tax-information-overview/',
  NY: 'https://www.tax.ny.gov/pit/file/tax_tables.htm',
  NC: 'https://www.ncdor.gov/taxes-forms/individual-income-tax/individual-income-tax-rates-and-standard-deduction',
  ND: 'https://www.tax.nd.gov/individual/income-tax',
  OH: 'https://tax.ohio.gov/individual/resources/annual-tax-rates',
  OK: 'https://oklahoma.gov/tax/individuals/income-tax.html',
  OR: 'https://www.oregon.gov/dor/programs/individuals/Pages/default.aspx',
  PA: 'https://www.revenue.pa.gov/TaxTypes/PIT/Pages/default.aspx',
  RI: 'https://tax.ri.gov/tax-sections/personal-income-tax',
  SC: 'https://dor.sc.gov/tax/individual-income',
  SD: 'https://dor.sd.gov/',
  TN: 'https://www.tn.gov/revenue/taxes/hall-income-tax.html',
  TX: 'https://comptroller.texas.gov/taxes/',
  UT: 'https://incometax.utah.gov/',
  VT: 'https://tax.vermont.gov/individuals/income-tax-rates',
  VA: 'https://www.tax.virginia.gov/individual-income-tax-filing',
  WA: 'https://dor.wa.gov/taxes-rates/income-tax',
  WV: 'https://tax.wv.gov/Individuals/Pages/Individuals.aspx',
  WI: 'https://www.revenue.wi.gov/Pages/FAQS/pcs-indinc.aspx',
  WY: 'https://revenue.wyo.gov/',
};

function findSentenceWith(text, regex) {
  const sentences = text.split(/(?<=[.!?])\s+|\n+/);
  for (const s of sentences) {
    const clean = s.replace(/\s+/g, ' ').trim();
    if (clean.length >= 15 && clean.length <= 280 && regex.test(clean)) {
      return clean;
    }
  }
  return null;
}

export async function runCapture() {
  const taxData = JSON.parse(fs.readFileSync(taxPath, 'utf8'));
  const citiesData = JSON.parse(fs.readFileSync(citiesPath, 'utf8'));
  const dateOnly = new Date().toISOString().split('T')[0];

  const statesToCapture = Object.entries(taxData.states).filter(([, s]) => !PENDING_ONLY || s.status !== 'verified');
  const citiesToCapture = citiesData.cities.filter((c) => !PENDING_ONLY || c.status !== 'verified');

  console.log(`Capture mode: ${PENDING_ONLY ? 'PENDING ONLY' : 'ALL'} (${statesToCapture.length} states, ${citiesToCapture.length} cities)`);
  const session = await launchPublic();

  // 1. State Revenue Departments (.gov only)
  for (const [code, stateObj] of statesToCapture) {
    const url = STATE_GOV_URLS[code];
    if (!url || !url.includes('.gov')) {
      console.log(`Skipping state ${code}: non-.gov or missing official URL (${url || 'none'})`);
      continue;
    }
    console.log(`[State ${code}] Visiting ${url}...`);
    try {
      const { resp, page } = await session.goto(url, { timeout: 25000 });
      const status = resp ? resp.status() : 0;
      const text = await page.evaluate(() => document.body ? document.body.innerText.trim() : '');
      if (status >= 400 || text.length < 80) {
        console.warn(`  -> HTTP ${status}, textLen=${text.length} (skipped)`);
        continue;
      }

      const snapBase = `tax-${code.toLowerCase()}-${dateOnly}`;
      const txtPath = path.join(snapshotsDir, `${snapBase}.txt`);
      fs.writeFileSync(txtPath, `URL: ${url}\nCaptured: ${new Date().toISOString()}\nStatus: ${status}\n\n${text}\n`, 'utf8');

      // Extract verifiable statement verbatim from live page text
      let quote = null;
      if (stateObj.type === 'none') {
        quote = findSentenceWith(text, /no\s+(?:state\s+)?(?:personal\s+|individual\s+)?income\s+tax|does\s+not\s+(?:impose|levy|assess)\s+.*income\s+tax/i);
      } else {
        quote = findSentenceWith(text, /\b\d+(?:\.\d+)?\s*%|\b\d+(?:\.\d+)?\s*percent\b|tax\s+rate|bracket|standard\s+deduction/i);
      }

      if (quote) {
        const record = {
          state: code,
          url,
          type: stateObj.type,
          quote,
          snapshotDate: new Date().toISOString(),
          snapshotFile: `${snapBase}.txt`,
        };
        fs.writeFileSync(path.join(rawDir, `tax-${code.toLowerCase()}.json`), JSON.stringify(record, null, 2));
        console.log(`  -> Captured quote: "${quote.slice(0, 90)}"`);
      } else {
        console.log(`  -> Snapshot saved (${snapBase}.txt), no direct rate sentence extracted.`);
      }
    } catch (err) {
      console.warn(`  -> Error capturing state ${code}: ${err.message}`);
    }
  }

  // 2. City / County Minimum Wage Offices (.gov only)
  for (const city of citiesToCapture) {
    const url = city.url;
    if (!url || !url.includes('.gov')) {
      console.log(`Skipping city ${city.name}: non-.gov URL (${url || 'none'})`);
      continue;
    }
    const slug = city.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    console.log(`[City ${city.name}] Visiting ${url}...`);
    try {
      const { resp, page } = await session.goto(url, { timeout: 25000 });
      const status = resp ? resp.status() : 0;
      const text = await page.evaluate(() => document.body ? document.body.innerText.trim() : '');
      if (status >= 400 || text.length < 80) {
        console.warn(`  -> HTTP ${status}, textLen=${text.length} (skipped)`);
        continue;
      }

      const snapBase = `city-${slug}-${dateOnly}`;
      const txtPath = path.join(snapshotsDir, `${snapBase}.txt`);
      fs.writeFileSync(txtPath, `URL: ${url}\nCaptured: ${new Date().toISOString()}\nStatus: ${status}\n\n${text}\n`, 'utf8');

      // Extract verbatim minimum wage sentence & hourly dollar figure
      const quote = findSentenceWith(text, /minimum\s+wage.*\$\d{1,2}(?:\.\d{2})?|\$\d{1,2}(?:\.\d{2})?.*per\s+hour/i);
      const rateMatch = quote ? quote.match(/\$(\d{1,2}\.\d{2})/) : null;
      if (quote && rateMatch) {
        const record = {
          cityKey: slug,
          name: city.name,
          state: city.state,
          url,
          rate: parseFloat(rateMatch[1]),
          quote,
          snapshotDate: new Date().toISOString(),
          snapshotFile: `${snapBase}.txt`,
        };
        fs.writeFileSync(path.join(rawDir, `city-${slug}.json`), JSON.stringify(record, null, 2));
        console.log(`  -> Captured $${record.rate}/hr verbatim.`);
      } else {
        console.log(`  -> Snapshot saved (${snapBase}.txt), no direct minimum wage rate extracted.`);
      }
    } catch (err) {
      console.warn(`  -> Error capturing city ${city.name}: ${err.message}`);
    }
  }

  await session.close();
  console.log('Completed Playwright capture.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runCapture().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
