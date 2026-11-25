import { writeFileSync, mkdirSync } from 'node:fs';

mkdirSync('content/states', { recursive: true });

const STATES = [
  {
    code: 'CA',
    slug: 'california-overtime-calculator',
    title: 'California Overtime Calculator: Daily & DT Rules',
    h1: 'California overtime and double time calculator',
    description: 'Calculate California daily overtime and double time under Labor Code 510. Includes 7th-day rules, updated for 2026. Free calculator.',
    intro: 'Calculate California daily overtime, double time, and seventh-day pay under California Labor Code Section 510. California does not allow tip credits.',
    tool: 'overtime',
    labels: ['states', 'overtime', 'california'],
    diff: 'California is one of only four states with mandatory daily overtime. Unlike federal law which only counts weekly hours over 40, California requires 1.5x pay after 8 hours in a workday and 2.0x double time after 12 hours. Furthermore, working seven consecutive days in a workweek triggers overtime for the first 8 hours on day seven, and double time thereafter. Tip credits are strictly prohibited by Labor Code Section 351.',
    example: 'A server in Los Angeles works shifts of 10, 8, 12.5, 9, and 8 hours (total 47.5 hours) at a base rate of $20.00/hr. Under California rules, regular hours are capped at 40, generating 7 hours of daily overtime (at $30.00/hr = $210.00) and 0.5 hours of double time (at $40.00/hr = $20.00), totaling $1,030.00 gross earnings.',
    dataPoints: [
      'Basic minimum wage: $16.50/hr ($16.90 indexed inflation floor under LC 1182.12)',
      'Tipped cash wage: $16.50/hr (100% full wage paid before tips)',
      'Tip credit allowed: Prohibited ($0.00 tip credit under Labor Code § 351)',
      'Daily overtime: 1.5x after 8 hours up to 12 hours in a workday',
      'Daily double time: 2.0x after 12 hours in a workday and after 8 hours on the 7th consecutive day'
    ],
    neighbors: [
      { label: 'Nevada overtime calculator', url: '/2026/12/nevada-overtime-calculator.html' },
      { label: 'Colorado overtime calculator', url: '/2026/12/colorado-overtime-calculator.html' },
      { label: 'Alaska overtime calculator', url: '/2026/12/alaska-overtime-calculator.html' }
    ],
    sources: [
      { label: 'California DIR — Overtime Pay FAQ', url: 'https://www.dir.ca.gov/dlse/faq_overtime.htm' },
      { label: 'California DIR — Minimum Wage Order', url: 'https://www.dir.ca.gov/dlse/minimum_wage.htm' }
    ]
  },
  {
    code: 'AK',
    slug: 'alaska-overtime-calculator',
    title: 'Alaska Overtime Calculator: Daily & Weekly Rules',
    h1: 'Alaska daily and weekly overtime calculator',
    description: 'Calculate Alaska daily overtime after 8 hours and weekly overtime after 40 hours under AS 23.10.060. Updated for 2026 with Ballot Measure 1 rates.',
    intro: 'Calculate Alaska daily overtime (after 8 hours) and weekly overtime (after 40 hours) under Alaska Statute 23.10.060. Tip credits are prohibited in Alaska.',
    tool: 'overtime',
    labels: ['states', 'overtime', 'alaska'],
    diff: 'Alaska requires daily overtime for hours worked in excess of 8 hours in any single day, in addition to federal weekly overtime over 40 hours. This requirement applies to employers with four or more employees under AS 23.10.060. In addition, Alaska Statute 23.10.065 strictly forbids tip credits: employers must pay the full statutory cash wage directly to all employees before tips.',
    example: 'An employee in Anchorage works 10 hours on Monday, 10 hours on Tuesday, and 8 hours on Wednesday, Thursday, and Friday (total 44 hours) at $18.00/hr. The 2 extra hours on Monday and Tuesday count as daily overtime (4 hours OT at $27.00/hr = $108.00), yielding $828.00 gross pay.',
    dataPoints: [
      'Basic minimum wage: $13.00/hr (increasing to $14.00 on July 1, 2026 under Ballot Measure 1)',
      'Tipped cash wage: $13.00/hr (full wage required)',
      'Tip credit allowed: Prohibited ($0.00 credit under AS 23.10.065)',
      'Daily overtime: 1.5x after 8 hours in a workday for employers with 4+ workers',
      'Statutory authority: Alaska Statutes AS 23.10.060 and AS 23.10.065'
    ],
    neighbors: [
      { label: 'California overtime calculator', url: '/2026/12/california-overtime-calculator.html' },
      { label: 'Nevada overtime calculator', url: '/2026/12/nevada-overtime-calculator.html' },
      { label: 'Colorado overtime calculator', url: '/2026/12/colorado-overtime-calculator.html' }
    ],
    sources: [
      { label: 'Alaska Department of Labor and Workforce Development', url: 'https://labor.alaska.gov/' },
      { label: 'DOL WHD — State Minimum Wage Laws', url: 'https://www.dol.gov/agencies/whd/minimum-wage/state' }
    ]
  },
  {
    code: 'NV',
    slug: 'nevada-overtime-calculator',
    title: 'Nevada Overtime Calculator: 2026 Daily Rules',
    h1: 'Nevada daily and weekly overtime calculator',
    description: 'Calculate Nevada daily overtime under NRS 608.018 for workers earning under 1.5x minimum wage. Updated for uniform $12.00 minimum wage.',
    intro: 'Calculate Nevada daily overtime under NRS 608.018 and weekly overtime after 40 hours. Nevada law prohibits employers from taking tip credits.',
    tool: 'overtime',
    labels: ['states', 'overtime', 'nevada'],
    diff: 'Nevada enforces a conditional daily overtime rule under NRS 608.018: employees earning less than 1.5 times the minimum wage ($18.00/hr based on the $12.00 rate) are entitled to daily overtime for all hours worked over 8 in a 24-hour period. Employees earning $18.00/hr or more are exempt from daily overtime and receive overtime only after 40 hours per week. Tip credits are forbidden by the Nevada Constitution.',
    example: 'A casino busser in Las Vegas earns $14.00/hr (below the $18.00 daily overtime threshold) and works 10 hours on Friday, 10 hours on Saturday, and 8 hours on Sunday (28 total hours). Because the rate is under 1.5x minimum wage, the 4 hours over 8 per day earn 1.5x ($21.00/hr), giving $56.00 in daily overtime premium despite total weekly hours being under 40.',
    dataPoints: [
      'Basic minimum wage: $12.00/hr statewide (two-tier system eliminated)',
      'Tipped cash wage: $12.00/hr (full wage paid in cash)',
      'Tip credit allowed: Prohibited (Nevada Constitution Art. 15 § 16)',
      'Daily overtime threshold: Applies to workers earning under $18.00/hr (1.5x min wage)',
      'Statutory authority: NRS 608.018 and Nevada Constitution Art. 15 § 16'
    ],
    neighbors: [
      { label: 'California overtime calculator', url: '/2026/12/california-overtime-calculator.html' },
      { label: 'Colorado overtime calculator', url: '/2026/12/colorado-overtime-calculator.html' },
      { label: 'Texas tipped minimum wage calculator', url: '/2026/12/texas-tipped-minimum-wage-and-overtime-calculator.html' }
    ],
    sources: [
      { label: 'Nevada Office of the Labor Commissioner', url: 'https://labor.nv.gov/' },
      { label: 'DOL WHD — Tipped Minimum Wages', url: 'https://www.dol.gov/agencies/whd/state/minimum-wage/tipped' }
    ]
  },
  {
    code: 'CO',
    slug: 'colorado-overtime-calculator',
    title: 'Colorado Overtime Calculator: COMPS Order Rules',
    h1: 'Colorado overtime calculator: daily and weekly rules',
    description: 'Calculate Colorado daily overtime after 12 hours and weekly overtime under COMPS Order 40/41. Includes $3.02 tip credit calculation.',
    intro: 'Calculate Colorado overtime under the COMPS Order (12 hours/day or 40 hours/week). Colorado permits a maximum tip credit of $3.02 per hour.',
    tool: 'overtime',
    labels: ['states', 'overtime', 'colorado'],
    diff: 'Colorado does not use the standard 8-hour daily cutoff; instead, COMPS Order Rule 4 mandates overtime (1.5x) after 12 hours in a single workday or 12 consecutive hours spanning shifts. Weekly overtime is also required after 40 hours. Tipped employers may take a tip credit capped strictly at $3.02/hr, requiring a cash wage of $11.79 against the $14.81 statewide minimum wage.',
    example: 'A prep cook in Colorado Springs works three 13-hour shifts in a week (39 total hours) at $16.00/hr. Although weekly hours are under 40, each 13-hour shift has 1 hour over the 12-hour daily threshold, generating 3 daily overtime hours at $24.00/hr ($72.00) plus 36 regular hours ($576.00), for $648.00 total gross pay.',
    dataPoints: [
      'Basic minimum wage: $14.81/hr statewide (COMPS Order #40 / #41)',
      'Tipped cash wage: $11.79/hr minimum direct pay',
      'Tip credit allowed: Capped at $3.02/hr maximum credit',
      'Daily overtime: Required after 12 hours per workday or 12 consecutive hours',
      'Weekly overtime: Required after 40 hours in a designated workweek'
    ],
    neighbors: [
      { label: 'Nevada overtime calculator', url: '/2026/12/nevada-overtime-calculator.html' },
      { label: 'Texas tipped minimum wage calculator', url: '/2026/12/texas-tipped-minimum-wage-and-overtime-calculator.html' },
      { label: 'California overtime calculator', url: '/2026/12/california-overtime-calculator.html' }
    ],
    sources: [
      { label: 'Colorado Department of Labor and Employment (CDLE)', url: 'https://cdle.colorado.gov/' },
      { label: 'Colorado COMPS Order Regulations', url: 'https://cdle.colorado.gov/labor-laws' }
    ]
  },
  {
    code: 'TX',
    slug: 'texas-tipped-minimum-wage-and-overtime-calculator',
    title: 'Texas Tipped Minimum Wage & Overtime Calculator',
    h1: 'Texas tipped minimum wage and overtime calculator',
    description: 'Calculate Texas tipped minimum wage ($2.13 cash wage, $5.12 tip credit) and overtime rates under Texas Labor Code 62 and FLSA. Free tool.',
    intro: 'Calculate Texas tipped wages and overtime under Texas Labor Code Chapter 62 and the FLSA. Direct cash wage is $2.13/hr with a $5.12/hr tip credit.',
    tool: 'tipped-overtime',
    labels: ['states', 'tips', 'overtime', 'texas'],
    diff: 'Texas has no state-specific overtime thresholds and does not require daily overtime. Under Texas Labor Code Chapter 62, the state explicitly adopts federal FLSA wage standards: $7.25 minimum wage, $2.13 tipped cash wage, and $5.12 maximum tip credit. Tipped overtime is calculated by multiplying the full minimum wage ($7.25) by 1.5 ($10.875) and then subtracting the tip credit ($5.12), resulting in a cash overtime rate of $5.76/hr.',
    example: 'A server in Dallas works 45 hours in a week. Cash wage is $2.13/hr and tip credit is $5.12/hr. The 40 regular hours yield $85.20 (40 x $2.13). The 5 overtime hours earn cash overtime at $5.755/hr = $28.78. Total cash wages paid by the restaurant are $113.98, while tips must cover the remainder so that average hourly earnings meet or exceed $7.25.',
    dataPoints: [
      'Basic minimum wage: $7.25/hr under Texas Labor Code § 62.051',
      'Tipped cash wage: $2.13/hr direct employer obligation',
      'Maximum tip credit: $5.12/hr against minimum wage',
      'Tipped overtime cash rate: $5.76/hr ($7.25 x 1.5 - $5.12)',
      'Overtime threshold: Weekly overtime required after 40 hours; no daily overtime'
    ],
    neighbors: [
      { label: 'Colorado overtime calculator', url: '/2026/12/colorado-overtime-calculator.html' },
      { label: 'Georgia tipped minimum wage calculator', url: '/2026/12/georgia-tipped-minimum-wage-and-overtime-calculator.html' },
      { label: 'Florida tipped minimum wage calculator', url: '/2026/12/florida-tipped-minimum-wage-and-overtime-calculator.html' }
    ],
    sources: [
      { label: 'Texas Workforce Commission (TWC)', url: 'https://www.twc.texas.gov/' },
      { label: 'DOL WHD — Fact Sheet #15 Tipped Employees', url: 'https://www.dol.gov/agencies/whd/fact-sheets/15-tipped-employees-flsa' }
    ]
  },
  {
    code: 'FL',
    slug: 'florida-tipped-minimum-wage-and-overtime-calculator',
    title: 'Florida Tipped Minimum Wage & Overtime Calculator',
    h1: 'Florida tipped minimum wage and overtime calculator',
    description: 'Calculate Florida tipped minimum wage ($9.98 to $10.98 cash wage) and overtime under Florida Constitution Art. X. Tip credit fixed at $3.02.',
    intro: 'Calculate Florida tipped pay and overtime under Florida Constitution Article X, Section 24. Maximum tip credit is constitutionally capped at $3.02/hr.',
    tool: 'tipped-overtime',
    labels: ['states', 'tips', 'overtime', 'florida'],
    diff: 'Florida wages change every September 30 under Constitutional Amendment 2 until reaching $15.00 in 2026. Uniquely, Florida law fixes the maximum tip credit at exactly $3.02 per hour. Because the tip credit does not expand as the minimum wage rises, direct cash wages increase dollar-for-dollar: $9.98/hr (through Sept 29, 2025) and $10.98/hr (effective Sept 30, 2025). Overtime is calculated on the full minimum wage.',
    example: 'A bartender in Miami works 46 hours in a week under the $13.00 minimum wage ($9.98 cash wage, $3.02 credit). Regular pay for 40 hours is $399.20 (40 x $9.98). Tipped overtime cash rate is (1.5 x $13.00) - $3.02 = $16.48/hr. For 6 overtime hours, overtime cash pay is 6 x $16.48 = $98.88. Total direct cash pay equals $498.08.',
    dataPoints: [
      'Basic minimum wage: $13.00/hr ($14.00 on Sept 30, 2025; $15.00 on Sept 30, 2026)',
      'Tipped cash wage: $9.98/hr ($10.98 on Sept 30, 2025; $11.98 on Sept 30, 2026)',
      'Maximum tip credit: Fixed at $3.02/hr by Florida Constitution Art. X § 24',
      'Overtime threshold: 40 hours per workweek; no daily overtime mandate',
      'Scheduled change: Minimum wage increases annually every September 30'
    ],
    neighbors: [
      { label: 'Georgia tipped minimum wage calculator', url: '/2026/12/georgia-tipped-minimum-wage-and-overtime-calculator.html' },
      { label: 'Texas tipped minimum wage calculator', url: '/2026/12/texas-tipped-minimum-wage-and-overtime-calculator.html' },
      { label: 'Pennsylvania tipped minimum wage calculator', url: '/2026/12/pennsylvania-tipped-minimum-wage-and-overtime-calculator.html' }
    ],
    sources: [
      { label: 'Florida Department of Commerce', url: 'https://floridajobs.org/' },
      { label: 'Florida Constitution Amendment 2 Notice', url: 'https://floridajobs.org/minimum-wage' }
    ]
  },
  {
    code: 'NY',
    slug: 'new-york-tipped-minimum-wage-and-overtime-calculator',
    title: 'New York Tipped Minimum Wage & OT Calculator',
    h1: 'New York tipped minimum wage and overtime calculator',
    description: 'Calculate New York tipped minimum wages and overtime for NYC, Long Island, Westchester, and Upstate under Hospitality Wage Order 12 NYCRR 146.',
    intro: 'Calculate New York tipped minimum wages and overtime under NY Labor Law Section 652 and the Hospitality Wage Order (12 NYCRR Part 146).',
    tool: 'tipped-overtime',
    labels: ['states', 'tips', 'overtime', 'new-york'],
    diff: 'New York maintains two geographic wage tiers: Downstate (NYC, Long Island, Westchester) at $16.50 min wage ($11.00 food service cash wage, $5.50 credit) and Rest of State (Upstate) at $15.50 min wage ($10.35 food service cash wage, $5.15 credit). Rates increase to $17.00 Downstate and $16.00 Upstate in 2026. Overtime is 1.5x of the full minimum wage minus the applicable regional tip credit.',
    example: 'A food server in Manhattan works 44 hours in a week at the $16.50 rate ($11.00 cash wage, $5.50 tip credit). 40 regular hours equal $440.00 (40 x $11.00). Overtime cash rate is (1.5 x $16.50) - $5.50 = $24.75 - $5.50 = $19.25/hr. 4 hours of overtime pay $77.00, giving $517.00 total direct employer cash wages.',
    dataPoints: [
      'Downstate minimum wage: $16.50/hr ($17.00 on Jan 1, 2026)',
      'Downstate food service cash wage: $11.00/hr ($11.35 on Jan 1, 2026; credit $5.50/$5.65)',
      'Upstate minimum wage: $15.50/hr ($16.00 on Jan 1, 2026)',
      'Upstate food service cash wage: $10.35/hr ($10.70 on Jan 1, 2026; credit $5.15/$5.30)',
      'Regulatory authority: 12 NYCRR Part 146 (Hospitality Wage Order)'
    ],
    neighbors: [
      { label: 'Pennsylvania tipped minimum wage calculator', url: '/2026/12/pennsylvania-tipped-minimum-wage-and-overtime-calculator.html' },
      { label: 'Illinois tipped minimum wage calculator', url: '/2026/12/illinois-tipped-minimum-wage-and-overtime-calculator.html' },
      { label: 'Georgia tipped minimum wage calculator', url: '/2026/12/georgia-tipped-minimum-wage-and-overtime-calculator.html' }
    ],
    sources: [
      { label: 'New York State Department of Labor', url: 'https://dol.ny.gov/minimum-wage-0' },
      { label: 'NY Hospitality Industry Wage Order (12 NYCRR 146)', url: 'https://dol.ny.gov/hospitality-industry-wage-order' }
    ]
  },
  {
    code: 'PA',
    slug: 'pennsylvania-tipped-minimum-wage-and-overtime-calculator',
    title: 'PA Tipped Minimum Wage & Overtime Calculator',
    h1: 'Pennsylvania tipped minimum wage and overtime calculator',
    description: 'Calculate Pennsylvania tipped minimum wage ($2.83 cash wage, $4.42 credit) and overtime under 34 Pa. Code 231. Free pay calculator.',
    intro: 'Calculate Pennsylvania tipped wages and overtime under 43 P.S. 333.104 and 34 Pa. Code Chapter 231. Minimum cash wage is $2.83/hr.',
    tool: 'tipped-overtime',
    labels: ['states', 'tips', 'overtime', 'pennsylvania'],
    diff: 'Pennsylvania sets a higher direct cash wage than federal law: $2.83 per hour (compared to federal $2.13), resulting in a maximum tip credit of $4.42 against the $7.25 statutory minimum wage. Furthermore, PA DLI updated tipped worker regulations to require at least $135/month in tips to qualify as a tipped employee (up from $30) and strictly enforces 80/20 non-tipped duty limits.',
    example: 'A food server in Philadelphia works 45 hours in a week. Cash wage is $2.83/hr and tip credit is $4.42/hr. 40 regular hours equal $113.20 (40 x $2.83). Overtime rate is (1.5 x $7.25) - $4.42 = $10.875 - $4.42 = $6.455/hr. 5 overtime hours equal $32.28, for total cash pay of $145.48.',
    dataPoints: [
      'Basic minimum wage: $7.25/hr under 43 P.S. § 333.104',
      'Tipped cash wage: $2.83/hr under 34 Pa. Code § 231.22',
      'Maximum tip credit: $4.42/hr ($7.25 minus $2.83)',
      'Tipped overtime rate: $6.46/hr ($7.25 x 1.5 - $4.42)',
      'Tipped threshold: Employee must receive at least $135/month in tips'
    ],
    neighbors: [
      { label: 'New York tipped minimum wage calculator', url: '/2026/12/new-york-tipped-minimum-wage-and-overtime-calculator.html' },
      { label: 'Illinois tipped minimum wage calculator', url: '/2026/12/illinois-tipped-minimum-wage-and-overtime-calculator.html' },
      { label: 'Georgia tipped minimum wage calculator', url: '/2026/12/georgia-tipped-minimum-wage-and-overtime-calculator.html' }
    ],
    sources: [
      { label: 'Pennsylvania Department of Labor & Industry', url: 'https://www.dli.pa.gov/' },
      { label: 'PA Bureau of Labor Law Compliance', url: 'https://www.dli.pa.gov/Individuals/Labor-Management-Relations/llc' }
    ]
  },
  {
    code: 'IL',
    slug: 'illinois-tipped-minimum-wage-and-overtime-calculator',
    title: 'Illinois Tipped Minimum Wage & OT Calculator',
    h1: 'Illinois tipped minimum wage and overtime calculator',
    description: 'Calculate Illinois tipped minimum wage ($9.00 cash wage, $6.00 tip credit) and overtime under 820 ILCS 105/4. Updated for $15.00 min wage.',
    intro: 'Calculate Illinois tipped minimum wage and overtime under 820 ILCS 105/4. Illinois sets the tipped cash wage at 60% of minimum wage ($9.00/hr).',
    tool: 'tipped-overtime',
    labels: ['states', 'tips', 'overtime', 'illinois'],
    diff: 'Illinois ties its tipped cash wage proportionally to 60% of the state minimum wage under 820 ILCS 105/4. With the minimum wage reaching $15.00 on January 1, 2025, the tipped cash wage is $9.00 per hour, leaving a maximum tip credit of $6.00 (40%). Overtime is calculated on the $15.00 base rate ($22.50) minus the $6.00 tip credit, resulting in an overtime cash wage of $16.50/hr.',
    example: 'A server in Naperville works 45 hours in a week. Cash wage is $9.00/hr and tip credit is $6.00/hr. 40 regular hours equal $360.00 (40 x $9.00). 5 overtime hours at $16.50/hr equal $82.50. Total direct employer cash wages equal $442.50.',
    dataPoints: [
      'Basic minimum wage: $15.00/hr under 820 ILCS 105/4',
      'Tipped cash wage: $9.00/hr (60% statutory ratio)',
      'Maximum tip credit: $6.00/hr (40% statutory maximum)',
      'Tipped overtime cash rate: $16.50/hr ($15.00 x 1.5 - $6.00)',
      'Weekly overtime: Required after 40 hours under Illinois Minimum Wage Law'
    ],
    neighbors: [
      { label: 'Pennsylvania tipped minimum wage calculator', url: '/2026/12/pennsylvania-tipped-minimum-wage-and-overtime-calculator.html' },
      { label: 'Texas tipped minimum wage calculator', url: '/2026/12/texas-tipped-minimum-wage-and-overtime-calculator.html' },
      { label: 'New York tipped minimum wage calculator', url: '/2026/12/new-york-tipped-minimum-wage-and-overtime-calculator.html' }
    ],
    sources: [
      { label: 'Illinois Department of Labor', url: 'https://labor.illinois.gov/' },
      { label: 'Illinois Minimum Wage Law (820 ILCS 105/)', url: 'https://labor.illinois.gov/laws-rules/fls/minimum-wage.html' }
    ]
  },
  {
    code: 'GA',
    slug: 'georgia-tipped-minimum-wage-and-overtime-calculator',
    title: 'Georgia Tipped Minimum Wage & Overtime Calculator',
    h1: 'Georgia tipped minimum wage and overtime calculator',
    description: 'Calculate Georgia tipped minimum wages ($2.13 cash wage) and overtime under federal FLSA and O.C.G.A. 34-4-3. Free wage calculator.',
    intro: 'Calculate Georgia tipped wages and overtime under federal FLSA standards. The federal $7.25 minimum wage governs all covered employers.',
    tool: 'tipped-overtime',
    labels: ['states', 'tips', 'overtime', 'georgia'],
    diff: 'While Georgia state statute sets a minimum wage of $5.15/hr (O.C.G.A. § 34-4-3), the federal Fair Labor Standards Act takes precedence for any business engaged in interstate commerce or grossing $500,000 or more. In practice, virtually all restaurant, bar, and hospitality employers are covered by the federal $7.25 minimum wage, $2.13 direct cash wage, and $5.12 maximum tip credit.',
    example: 'A server in Savannah works 45 hours in a week under federal FLSA coverage. Regular pay for 40 hours at $2.13/hr equals $85.20. Overtime pay for 5 hours at $5.755/hr ((1.5 x $7.25) - $5.12) equals $28.78. Total cash wages paid directly by the employer equal $113.98.',
    dataPoints: [
      'Federal FLSA minimum wage: $7.25/hr (governs covered Georgia employers)',
      'Tipped cash wage: $2.13/hr direct employer obligation',
      'Maximum tip credit: $5.12/hr against minimum wage',
      'State statutory floor: $5.15/hr under O.C.G.A. § 34-4-3',
      'Overtime threshold: 40 hours per workweek under federal FLSA'
    ],
    neighbors: [
      { label: 'Florida tipped minimum wage calculator', url: '/2026/12/florida-tipped-minimum-wage-and-overtime-calculator.html' },
      { label: 'Texas tipped minimum wage calculator', url: '/2026/12/texas-tipped-minimum-wage-and-overtime-calculator.html' },
      { label: 'Pennsylvania tipped minimum wage calculator', url: '/2026/12/pennsylvania-tipped-minimum-wage-and-overtime-calculator.html' }
    ],
    sources: [
      { label: 'Georgia Department of Labor', url: 'https://dol.georgia.gov/' },
      { label: 'DOL WHD — FLSA Compliance Assistance', url: 'https://www.dol.gov/agencies/whd/flsa' }
    ]
  }
];

for (const s of STATES) {
  const md = `---
title: "${s.title}"
slugTitle: "${s.slug}"
h1: "${s.h1}"
description: "${s.description}"
intro: "${s.intro}"
type: tool
tool: ${s.tool}
state: ${s.code}
hub: /p/state-pay-rules.html
hubName: State pay rules
labels: [${s.labels.join(', ')}]
needs human edit: true
related:
${s.neighbors.map(n => `  - { label: "${n.label}", url: "${n.url}" }`).join('\n')}
sources:
${s.sources.map(src => `  - { label: "${src.label}", url: "${src.url}" }`).join('\n')}
---
## What's different in ${s.code === 'CA' ? 'California' : s.code === 'AK' ? 'Alaska' : s.code === 'NV' ? 'Nevada' : s.code === 'CO' ? 'Colorado' : s.code === 'TX' ? 'Texas' : s.code === 'FL' ? 'Florida' : s.code === 'NY' ? 'New York' : s.code === 'PA' ? 'Pennsylvania' : s.code === 'IL' ? 'Illinois' : 'Georgia'}

${s.diff}

## Key data points

${s.dataPoints.map(dp => `- ${dp}`).join('\n')}

## Worked example

${s.example}

## Common mistakes

- Relying on federal weekly thresholds when daily overtime rules apply.
- Applying a tip credit in states where tip credits are prohibited by law.
- Calculating overtime solely on direct cash wages instead of the full statutory minimum wage.
- Forgetting that municipal minimum wages (such as local city ordinances) may set higher standards.

## Frequently asked questions

### Does my employer have to pay overtime if I receive tips?
Yes. Overtime is calculated on the full statutory regular rate of pay, not just the tipped cash wage. The tip credit cannot be expanded on overtime hours.

### Can managers participate in a tip pool?
No. Under federal FLSA regulations and state labor laws, managers, supervisors, and employers cannot receive tips from an employee tip pool.

### What happens if tips fall short of the minimum wage?
If an employee's direct cash wage plus tips does not equal at least the statutory minimum wage for all hours worked during the pay period, the employer must pay the difference.
`;

  writeFileSync(`content/states/${s.slug}.md`, md, 'utf8');
  console.log(`Wrote content/states/${s.slug}.md`);
}
console.log('Successfully generated 10 state pages.');
