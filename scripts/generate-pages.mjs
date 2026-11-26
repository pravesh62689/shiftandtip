import fs from 'node:fs';
import path from 'node:path';

const pagesDir = 'content/pages';
if (!fs.existsSync(pagesDir)) fs.mkdirSync(pagesDir, { recursive: true });

const statesData = JSON.parse(fs.readFileSync('data/states.json', 'utf8'));
const liveUrls = JSON.parse(fs.readFileSync('data/live-urls.json', 'utf8'));

// Helper to escape HTML
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Map state codes to calculator URLs
const stateCalculatorUrls = {
  CA: '/2026/12/california-overtime-calculator.html',
  TX: '/2026/12/texas-tipped-minimum-wage-and-overtime-calculator.html',
  FL: '/2026/12/florida-tipped-minimum-wage-and-overtime-calculator.html',
  NY: '/2026/12/new-york-tipped-minimum-wage-and-overtime-calculator.html',
  CO: '/2026/12/colorado-overtime-calculator.html',
  AK: '/2026/12/alaska-overtime-calculator.html',
  PA: '/2026/12/pennsylvania-tipped-minimum-wage-and-overtime-calculator.html',
  IL: '/2026/12/illinois-tipped-minimum-wage-and-overtime-calculator.html',
  GA: '/2026/12/georgia-tipped-minimum-wage-and-overtime-calculator.html',
};

// 1. Tip Tools Hub
fs.writeFileSync(path.join(pagesDir, 'tip-tools.md'), `---
title: "Tip Tools & Calculators"
slugTitle: "tip-tools"
description: "Free tip pooling, tip-out, and tipped wage calculators for restaurant staff and hospitality workers."
type: page
labels: [tools, tips, hub]
needs human edit: false
---
## Shift & Tip: Free Tip Calculators

Accurate tip calculations keep restaurant shifts fair, transparent, and compliant with labor standards. Explore our dedicated tip calculation tools below:

- **[Tip Pool Calculator](/2026/11/tip-pool-calculator.html)**: Allocate pooled shift tips across floor and bar staff using hours worked, weighted job-role points, or custom percentages. Includes automated manager-exclusion warnings and tip-out deductions.
- **[Tip-Out Calculator](/2026/11/tip-out-calculator.html)**: Determine exact tip-out shares owed to bartenders, bussers, and food runners based on gross receipts or total tips.
- **[Tipped Overtime Calculator](/2026/11/tipped-overtime-calculator.html)**: Calculate overtime cash wages for tipped employees under federal FLSA and regional state wage orders.

### Official Rule Verification
Tip credit limits and overtime rules vary significantly by jurisdiction. Consult our **[State Pay Rules Hub](/p/state-pay-rules-minimum-wage-overtime.html)** to review statutory minimum cash wages and maximum employer tip credits for all 51 US jurisdictions.
`);

// 2. Overtime Tools Hub
fs.writeFileSync(path.join(pagesDir, 'overtime-tools.md'), `---
title: "Overtime & Double Time Calculators"
slugTitle: "overtime-tools"
description: "Calculators for weekly overtime, daily overtime, double time, shift differentials, and tipped overtime."
type: page
labels: [tools, overtime, hub]
needs human edit: false
---
## Hourly Overtime & Premium Pay Calculators

Overtime laws protect hourly workers from excessive uncompensated hours. Shift & Tip provides accurate tools for both standard federal FLSA calculations and complex state-specific daily premium rules:

- **[Overtime & Double Time Calculator](/2026/11/overtime-and-double-time-calculator.html)**: Models daily overtime after 8 hours, double time after 12 hours, consecutive seventh-day premiums (California, Alaska, Colorado), and standard weekly overtime.
- **[Shift Differential Calculator](/2026/11/shift-differential-calculator.html)**: Calculates blended regular rates and true overtime premiums when working multiple shifts or night/weekend differentials during a single pay period.
- **[Tipped Overtime Calculator](/2026/11/tipped-overtime-calculator.html)**: Computes direct employer cash obligations for tipped employees working in excess of 40 weekly hours.

### State Overtime Rules
Learn how your state treats daily overtime and consecutive workdays on our **[Daily Overtime States Guide](/2026/12/daily-overtime-states.html)**.
`);

// 3. Shift Pay Tools Hub
fs.writeFileSync(path.join(pagesDir, 'shift-pay-tools.md'), `---
title: "Shift Pay & Deduction Calculators"
slugTitle: "shift-pay-tools"
description: "Estimate take-home pay with tips and calculate no-tax-on-tips and overtime tax deductions."
type: page
labels: [tools, pay, hub]
needs human edit: false
---
## Shift Pay & Tax Deduction Tools

Understand your actual earnings after taxes, mandatory FICA withholdings, and statutory federal tax deductions:

- **[Take-Home Pay with Tips Calculator](/2026/11/take-home-pay-with-tips-calculator.html)**: Models net take-home earnings across hourly wages and cash/credit card tips, accounting for Social Security, Medicare, and estimated federal and state income tax withholdings.
- **[No Tax on Tips & Overtime Deduction Estimator](/2026/11/no-tax-on-tips-and-overtime-deduction.html)**: Models potential federal taxable income deductions for qualified tips (up to $25,000) and overtime premiums (up to $12,500 single / $25,000 joint) with statutory phase-out thresholds.

### Educational Guides
Review our explainer on **[How to Read a Tipped Employee Paystub](/2027/01/how-to-read-tipped-paystub.html)** for line-by-line guidance on gross pay, tip declarations, and tax withholdings.
`);

// 4. Guides Hub
fs.writeFileSync(path.join(pagesDir, 'guides.md'), `---
title: "Worker Pay Guides & Legal Explainers"
slugTitle: "guides"
description: "Plain-English guides on tip pooling legality, tip credit rules, daily overtime thresholds, and paystubs."
type: page
labels: [guides, hub]
needs human edit: false
---
## Practical Guides for Shift & Hourly Workers

Read our legal explainers and practical shift guides written for restaurant staff, hourly workers, and shift managers:

- **[Is Tip Pooling Legal? Federal & State Rules](/2026/12/is-tip-pooling-legal.html)**: Who can participate in a valid tip pool, manager exclusions, and FLSA compliance rules.
- **[The Tip Credit Explained: What Employers Can Deduct](/2026/12/tip-credit-explained.html)**: How statutory tip credits work, direct cash wages, and when tip credits are prohibited.
- **[How to Split Tips Fairly: Hours, Points & Percentages](/2026/12/how-to-split-tips-fairly.html)**: Step-by-step walkthroughs of point systems, hours-based distribution, and hybrid tip pools.
- **[What Is a Typical Tip-Out Percentage?](/2026/12/what-is-a-typical-tip-out.html)**: Industry benchmarks for food runners, bussers, and bar staff based on sales and tips.
- **[Daily Overtime States: Which States Require Daily OT?](/2026/12/daily-overtime-states.html)**: Daily overtime and double-time requirements in California, Alaska, Colorado, and Nevada.
- **[Shift Differentials & Overtime: The Blended Rate Formula](/2027/01/shift-differential-overtime.html)**: How FLSA requires employers to blend regular rates when differential hours occur.
- **[Tipped Employee Overtime: Why You Cannot Just Multiply Cash Wage](/2027/01/tipped-employee-overtime.html)**: The federal FLSA formula for computing tipped overtime pay.
- **[No Tax on Tips: Federal Deduction Rules & Eligibility](/2027/01/no-tax-on-tips-rules.html)**: Caps, income thresholds, eligible occupations, and tax filing requirements.
- **[No Tax on Overtime in California: Rules & Differences](/2027/01/no-tax-on-overtime-california.html)**: Federal tax deduction interaction with California state income tax.
- **[How to Read a Tipped Employee Paystub](/2027/01/how-to-read-tipped-paystub.html)**: Decoding allocated tips, declared cash tips, tip credits, and tax withholdings.
`);

// 5. State Pay Rules Hub (Sortable Table)
let tableRows = '';
for (const s of statesData.states) {
  const min = s.minWage != null ? '$' + s.minWage.toFixed(2) : '<span class="receipt__sub">pending verification</span>';
  const cash = s.tippedCashWage != null ? '$' + s.tippedCashWage.toFixed(2) : '<span class="receipt__sub">pending verification</span>';
  const credit = s.maxTipCredit != null ? '$' + s.maxTipCredit.toFixed(2) : (s.tipCreditAllowed === false ? '$0.00 (Prohibited)' : '<span class="receipt__sub">pending verification</span>');
  const ot = s.ot?.daily ? 'After ' + s.ot.daily + ' h' : 'Weekly (40 h)';
  const verified = s.verifiedOn ? s.verifiedOn : '<span class="receipt__sub">pending verification</span>';
  const src = (s.sources || []).map(x => `<a rel="noopener" href="${esc(x.url)}">${esc(x.label || 'Source')}</a>`).join(', ');

  const calcUrl = stateCalculatorUrls[s.code];
  const nameCell = calcUrl
    ? `<a href="${calcUrl}"><strong>${esc(s.name)}</strong> (${esc(s.code)})</a>`
    : `<strong>${esc(s.name)}</strong> (${esc(s.code)})`;

  tableRows += `<tr>
  <td>${nameCell}</td>
  <td class="n">${min}</td>
  <td class="n">${cash}</td>
  <td class="n">${credit}</td>
  <td>${ot}</td>
  <td class="n">${verified}</td>
  <td>${src || '—'}</td>
</tr>\n`;
}

fs.writeFileSync(path.join(pagesDir, 'state-pay-rules.md'), `---
title: "State Pay Rules: Minimum Wage & Overtime"
slugTitle: "state-pay-rules"
description: "Comprehensive 2026 pay rules for 51 US jurisdictions: minimum wages, tipped cash wages, tip credits, and overtime."
type: page
labels: [states, rules, hub]
needs human edit: false
---
## State Pay Rules for Tipped & Hourly Workers (2026)

Every numeric wage threshold below is verified directly against statutory Department of Labor records and official state labor department wage orders. Unverified jurisdictions are explicitly marked as *pending verification*. Select high-demand states to launch dedicated state overtime and tipped wage calculators.

<div class="table-wrap">
<table class="data data--ledger">
<thead>
<tr>
  <th>Jurisdiction</th>
  <th class="n">Minimum Wage</th>
  <th class="n">Tipped Cash Wage</th>
  <th class="n">Max Tip Credit</th>
  <th>Overtime Threshold</th>
  <th class="n">Verified Date</th>
  <th>Primary Sources</th>
</tr>
</thead>
<tbody>
${tableRows}
</tbody>
</table>
</div>

### Sourcing & Verification Standards
Under our strict verification methodology, values are sourced exclusively from official primary sources: state labor department wage orders and US Department of Labor Wage and Hour Division (WHD) statutes. Review our full verification protocol on our **[Methodology Page](/p/methodology-how-we-verify-pay-rules.html)**.
`);

// 6. About
fs.writeFileSync(path.join(pagesDir, 'about.md'), `---
title: "About Shift & Tip — Tipped & Hourly Pay Calculators"
slugTitle: "about"
description: "Learn about Shift & Tip, our mission, editorial standards, and author Pravesh Rathore."
type: page
labels: [about, trust]
needs human edit: false
---
## About Shift & Tip

Shift & Tip is an independent publication and financial utility dedicated to providing free, precise calculation tools and clear legal explainers for tipped workers, hourly employees, and restaurant managers.

### Our Mission
Hourly and tipped payroll is notoriously complex. With varying state minimum wages, differing tip credit allowances, blended overtime rates, and statutory tax rules, workers and managers frequently struggle to determine accurate wage entitlements. Shift & Tip was built to eliminate guesswork by providing:

1. **Rigorous Financial Engines**: Every calculator on this site is powered by open formulas validated against official Department of Labor and Internal Revenue Service guidance.
2. **Strict Sourcing**: We never guess or estimate state labor thresholds. Every figure published in our state rules database is cited to official statutes.
3. **No Financial or Legal Jargon**: We explain complex wage order regulations in plain, practical language with realistic shift examples.

### Editorial & Technical Leadership
Shift & Tip is created and edited by **Pravesh Rathore**, a software engineer with extensive experience building precision banking, payment processing, and financial systems. Bringing engineering rigor to labor economics, Pravesh designs the mathematical engines, audits primary statutory sources, and maintains our verified state data repositories.

### Editorial Independence
Shift & Tip is entirely editorially independent. We do not accept sponsored content, paid reviews, or employer partnerships. Calculations are performed locally on client devices without tracking personal financial inputs.
`);

// 7. Methodology
fs.writeFileSync(path.join(pagesDir, 'methodology.md'), `---
title: "Methodology & How We Verify Pay Rules"
slugTitle: "methodology"
description: "Our 4-step rule verification process, primary legal sources, engine tests, and rounding standards."
type: page
labels: [methodology, trust]
needs human edit: false
---
## How We Calculate and Verify Pay Rules

Shift & Tip adheres to strict mathematical and journalistic standards. We treat wage calculations as high-stakes personal finance data (YMYL). Every formula and published threshold follows a four-step verification process:

### 1. Primary Source Sourcing
We never rely on third-party aggregators, memory, or AI summaries. Every statutory wage rate, tip credit limit, and overtime rule is extracted directly from:
- United States Department of Labor Wage and Hour Division (WHD) tables.
- State Labor Department and Workforce Commission statutes and published wage orders (e.g., California Labor Code § 510, NY 12 NYCRR Part 146).
- IRS Revenue Procedures and Social Security Administration COLA announcements.

### 2. Sourced Evidence Archiving
Every captured data point is permanently archived in snapshot form with URL, exact quoted statutory text, and timestamp. If state labor department sites conflict with federal tables, the state site takes precedence.

### 3. Automated Engine Testing
Our calculation engines are implemented as pure mathematical functions covered by rigorous automated unit tests. Calculations maintain exact cent precision throughout intermediate steps, with rounding performed only on final display amounts using standard half-up integer rounding.

### 4. Continuous Audit & Public Changelog
We continuously monitor labor department wage bulletins. When statutory rates change, our audit scripts flag discrepancies, update verified dates, and record the modifications publicly on our **[Corrections Page](/p/corrections-policy-public-changelog.html)**.
`);

// 8. Privacy
fs.writeFileSync(path.join(pagesDir, 'privacy.md'), `---
title: "Privacy Policy — Shift & Tip Cookie & Data Practices"
slugTitle: "privacy"
description: "Privacy policy covering cookies, Google advertising partners, consent choices, and data handling."
type: page
labels: [privacy, trust]
needs human edit: false
---
## Privacy Policy

**Effective Date:** January 1, 2026

Shift & Tip respects your privacy. This Privacy Policy details our practices regarding information collection, advertising cookies, and client-side calculations.

### Local Calculation Data
All calculation inputs entered into Shift & Tip tools (such as hours worked, sales figures, tip amounts, and hourly wages) are processed locally within your web browser. We do not transmit, collect, or store your personal wage or tip numbers on our servers. Optional saved presets are stored strictly in your browser's local storage (\`localStorage\`) and remain entirely on your device.

### Advertising & Third-Party Cookies
We partner with Google and third-party advertising vendors to display advertisements when you visit our site. These companies may use cookies, web beacons, and similar technologies to serve ads based on your prior visits to this website or other sites on the Internet:
- Google's use of advertising cookies enables it and its partners to serve ads based on your visit to Shift & Tip and other sites across the web.
- You may opt out of personalized advertising by visiting **[Google Ads Settings](https://www.google.com/settings/ads)**.
- You can manage your consent preferences at any time by selecting **Manage privacy choices** in the consent banner.

### Analytics & Web Server Logs
Like most website operators, we collect non-personally-identifying technical data that web browsers typically provide, including browser type, language preference, referring site, and page request timestamps.

### Contacting Us
If you have questions regarding this Privacy Policy or our data practices, please contact us via the contact form located at the bottom of any page on this site.
`);

// 9. Terms
fs.writeFileSync(path.join(pagesDir, 'terms.md'), `---
title: "Terms of Service & Disclaimers"
slugTitle: "terms"
description: "Terms of service, estimate disclaimers, limitation of liability, and official verification guidelines."
type: page
labels: [terms, trust]
needs human edit: false
---
## Terms of Service & Disclaimers

### 1. Informational & Estimation Purposes Only
All calculators, pay charts, and educational articles provided on Shift & Tip are intended solely for general informational and educational planning. **Nothing on this website constitutes legal, accounting, tax, or payroll advice.** 

Employment situations involve unique contractual terms, collective bargaining agreements, municipal ordinances, and tax classifications that cannot be modeled by general calculators. Always verify your specific paystub calculations with your employer's payroll department, a licensed CPA, or the United States Department of Labor.

### 2. Disclaimer of Warranties
While we strive for complete accuracy and verify rules against primary statutes, Shift & Tip is provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied.

### 3. Limitation of Liability
In no event shall Shift & Tip or its authors be liable for any direct, indirect, incidental, or consequential damages arising from the use of, or inability to use, our tools or published information.

### 4. Inquiries & Feedback
To report calculation discrepancies or submit questions, please contact us via the form on this site.
`);

// 10. Contact
fs.writeFileSync(path.join(pagesDir, 'contact.md'), `---
title: "Contact Shift & Tip — Support, Feedback & Corrections"
slugTitle: "contact"
description: "Contact the Shift & Tip team for corrections, feedback, questions, or calculation inquiries."
type: page
labels: [contact, trust]
needs human edit: false
---
## Contact Shift & Tip

We welcome feedback, suggestions, and rule discrepancy inquiries from workers, restaurant operators, and payroll professionals.

### How to Reach Us
Use the form at the bottom of any page; we reply within 3 business days.

### Reporting Data Discrepancies
If a minimum wage or tip credit rate in your state has recently changed or differs from our state rules table, please include:
1. The state or municipality.
2. The specific rule (e.g., minimum cash wage, tip credit cap, daily overtime rule).
3. A link to the official state labor department wage order or statute.

We investigate all statutory reports promptly and update our public changelog accordingly.
`);

// 11. Corrections
fs.writeFileSync(path.join(pagesDir, 'corrections.md'), `---
title: "Corrections Policy & Public Changelog"
slugTitle: "corrections"
description: "Our public corrections policy and changelog tracking every data update and formula correction."
type: page
labels: [corrections, trust]
needs human edit: false
---
## Corrections Policy & Public Changelog

Shift & Tip is committed to immediate transparency when updating data or correcting errors. When a calculation error, formula bug, or outdated statutory wage threshold is identified, we correct it promptly and document the change in our public changelog below.

### Policy
- **Factual & Statutory Updates**: When labor departments publish revised minimum wage rates or wage orders, our datasets are updated and verified dates refreshed.
- **Formula Corrections**: If an engine formula produces an unintended discrepancy under edge conditions, the engine is patched, new unit tests are added to prevent regression, and the correction is noted here.

### Public Changelog

<div class="table-wrap">
<table class="data">
<thead>
<tr>
  <th>Date</th>
  <th>Page / Component</th>
  <th>Change Description</th>
</tr>
</thead>
<tbody>
<tr>
  <td>2026-11-24</td>
  <td>State Pay Rules Hub</td>
  <td>Verified and updated 49 US jurisdictions against DOL WHD tables and state labor department bulletins.</td>
</tr>
<tr>
  <td>2026-11-24</td>
  <td>New York Tipped Overtime</td>
  <td>Implemented regional wage tiers for NYC, Long Island/Westchester ($17.00 / $11.35 cash), and Rest of State ($16.00 / $10.70 cash).</td>
</tr>
<tr>
  <td>2026-11-24</td>
  <td>Take-Home Pay Calculator</td>
  <td>Updated 2026 Social Security wage base cap to $184,500 per official SSA COLA announcement.</td>
</tr>
</tbody>
</table>
</div>
`);

console.log('Successfully generated all 11 static pages in content/pages/ with canonical URLs and cross-links');
