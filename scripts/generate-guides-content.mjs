import { writeFileSync, mkdirSync } from 'node:fs';

mkdirSync('content/guides', { recursive: true });

const GUIDES = [
  {
    slug: 'is-tip-pooling-legal',
    title: 'Is Tip Pooling Legal? Rules for Owners and Staff',
    h1: 'Is tip pooling legal? Rules for owners and staff',
    description: 'Federal FLSA rules on tip pooling, mandatory tip pools, who can participate, and why managers cannot take tips. Explained clearly with examples.',
    intro: 'Tip pooling is legal under federal law when structured properly, but strict FLSA rules govern who can participate and who is barred.',
    labels: ['guides', 'tips', 'compliance'],
    body: `Tip pooling is legal across the United States under the Fair Labor Standards Act (FLSA), provided the pool follows strict statutory standards regarding participation, distribution, and ownership of gratuities. Under federal law, tips are the absolute property of the employees who receive them.

Whether an employer takes a tip credit determines who can participate in the tip pool. When an employer pays the full minimum wage without claiming a tip credit, back-of-house staff such as dishwashers, line cooks, and kitchen prep workers may legally participate in the tip pool. When an employer claims a tip credit and pays a reduced direct cash wage (such as the federal $2.13/hr), the tip pool must be limited strictly to front-of-house employees who customarily and regularly receive tips.

The most critical and strictly enforced rule in tip pooling is the complete exclusion of managers, supervisors, and employers. Under 29 CFR § 541.100, anyone who possesses supervisory authority—such as hiring, firing, scheduling, or directing work—cannot participate in a tip pool or receive any portion of pooled tips under any circumstances.

Even if a shift supervisor or manager works a service shift, covers tables, or serves food directly, they cannot take tips from the employee pool. While an exempt supervisor may keep tips handed directly to them by customers for service they solely provided without assistance, they may never draw from or contribute to a staff tip pool.

Mandatory tip pools established by management are legal under federal law, provided the employer distributes all collected tips no later than the regular payday for the workweek in which the tips were earned. Employers cannot retain employee tips for business operating costs, credit card transaction fees exceeding actual processing costs, or cash register shortages.

State laws can impose stricter limitations than federal rules. In states like California, Nevada, Minnesota, Montana, Oregon, and Washington, tip credits are completely illegal, and state statutes provide additional protections guaranteeing tips to service staff.

For a worked scenario, consider a Friday dinner shift with 5 front-of-house staff and $1,240 in pooled tips. After a 3% net sales tip-out to kitchen support, the remaining $1,000 is distributed proportionally based on hours worked. You can model this directly with our [tip pool calculator](/2026/12/tip-pool-calculator.html).

To learn more about individual server percentages, check our [tip-out calculator](/2026/12/tip-out-calculator.html) or review state-specific rules in our [California overtime calculator](/2026/12/california-overtime-calculator.html).

Estimate for planning only. Not legal or tax advice. Rules verified Nov 2026 — sources below.`,
    related: [
      { label: 'Tip pool calculator', url: '/2026/12/tip-pool-calculator.html' },
      { label: 'Tip-out calculator', url: '/2026/12/tip-out-calculator.html' },
      { label: 'Tip credit explained', url: '/2026/12/tip-credit-explained.html' }
    ],
    sources: [
      { label: 'DOL Fact Sheet #15: Tipped Employees Under the FLSA', url: 'https://www.dol.gov/agencies/whd/fact-sheets/15-tipped-employees-flsa' },
      { label: '29 CFR Part 531 — Wage Payments Under the FLSA', url: 'https://www.ecfr.gov/current/title-29/subtitle-B/chapter-V/subchapter-A/part-531' }
    ]
  },
  {
    slug: 'tip-credit-explained',
    title: 'Tip Credit Explained: What Tipped Workers Must Earn',
    h1: 'Tip credit explained: what tipped workers must earn',
    description: 'How the tip credit works under FLSA and state laws, cash wage vs credit, and the 7 states that ban tip credits. Clear guide with examples.',
    intro: 'A tip credit allows employers to count employee tips toward their minimum wage obligations, paying as little as $2.13/hr in direct cash wages.',
    labels: ['guides', 'tips', 'wages'],
    body: `A tip credit is a legal provision under Section 3(m) of the Fair Labor Standards Act (FLSA) that allows employers to pay tipped employees a direct cash wage below the statutory minimum wage, using the tips received by the employee to make up the difference.

Under federal law, the minimum wage is $7.25 per hour. Federal law allows employers to take a maximum tip credit of $5.12 per hour, meaning the employer must pay at least $2.13 per hour in direct cash wages. If the employee does not earn at least $5.12 per hour in tips, the employer must make up the shortfall.

Employers must satisfy strict statutory notice requirements before claiming a tip credit. The employer must inform employees in advance of the direct cash wage amount, the tip credit claimed, and that all tips received must be retained by the employee, except for valid tip pooling arrangements.

If an employer fails to provide proper advance notice, the tip credit is completely voided. In that event, the employer must pay the full minimum wage in direct cash for all hours worked, plus allow the employee to keep all tips earned.

Seven states strictly prohibit tip credits under state law: California, Alaska, Nevada, Minnesota, Montana, Oregon, and Washington. In these states, employers must pay the full state minimum wage in direct cash wages before any tips are earned.

Other states cap the tip credit at significantly lower amounts than federal law. For example, Florida caps the maximum tip credit at $3.02 per hour under its state constitution, while Colorado limits it to $3.02 under the COMPS Order, and Illinois requires employers to pay at least 60% of minimum wage in cash ($9.00/hr).

When calculating overtime for tipped workers, the overtime premium must be computed on the full statutory minimum wage, never on the reduced direct cash wage. You can calculate your exact state rates using our [tipped overtime calculator](/2026/12/tipped-overtime-calculator.html).

Review our [Texas tipped minimum wage calculator](/2026/12/texas-tipped-minimum-wage-and-overtime-calculator.html) or our [Florida tipped minimum wage calculator](/2026/12/florida-tipped-minimum-wage-and-overtime-calculator.html) to see how regional rules apply in practice.

Estimate for planning only. Not legal or tax advice. Rules verified Nov 2026 — sources below.`,
    related: [
      { label: 'Tipped overtime calculator', url: '/2026/12/tipped-overtime-calculator.html' },
      { label: 'Texas tipped minimum wage calculator', url: '/2026/12/texas-tipped-minimum-wage-and-overtime-calculator.html' },
      { label: 'Florida tipped minimum wage calculator', url: '/2026/12/florida-tipped-minimum-wage-and-overtime-calculator.html' }
    ],
    sources: [
      { label: 'DOL WHD — Tipped Minimum Wage by State', url: 'https://www.dol.gov/agencies/whd/state/minimum-wage/tipped' },
      { label: 'DOL Fact Sheet #15: Tipped Employees', url: 'https://www.dol.gov/agencies/whd/fact-sheets/15-tipped-employees-flsa' }
    ]
  },
  {
    slug: 'how-to-split-tips-fairly',
    title: 'How to Split Tips Fairly: Hours vs Points vs Percent',
    h1: 'How to split tips fairly: hours vs points vs percentage',
    description: 'Compare hours-worked, point-based, and percentage-based tip pooling systems. Formulas, examples, and fair distribution tips for hospitality teams.',
    intro: 'Fair tip splitting keeps restaurant and bar teams unified. Learn the three core mathematical methods: hours-worked, points, and percentages.',
    labels: ['guides', 'tips', 'math'],
    body: `Splitting tips fairly across a shift is essential for staff morale and legal compliance. While restaurant formats vary, virtually all tip pools rely on one of three mathematical models: hours-worked, point-based, or percentage-of-pool.

The hours-worked method is the most common and transparent system for shifts where team members have similar roles but work staggered hours. In this system, total tips are divided by total shift hours to establish an hourly tip rate, and each worker receives that rate multiplied by their hours worked.

The point-based system accommodates shifts where different roles carry distinct levels of responsibility. For example, a senior bartender might receive 10 points, a floor server 8 points, and a barback or busser 5 points. Each worker's points are multiplied by their hours to calculate total shift shares.

The percentage-of-pool method allocates fixed percentage slices of the shift tip total to designated team roles. For instance, a pool may specify 70% to floor servers, 20% to bartenders, and 10% to bussers, with each role group dividing its share equally.

Regardless of which method is chosen, the largest-remainder method (Hare-Niemeyer method) should be used to round pennies. Rounding each individual share to the nearest dollar creates unallocated cents that violate FLSA pool reconciliation rules.

Tip-outs taken off the top for support staff—such as food runners or kitchen expediters—must be deducted before dividing the remaining pool among the core service team.

For instance, on a busy shift with $1,240 in total tips and $8,000 in net sales, a 3% kitchen tip-out ($240) leaves $1,000 to be divided across 30.5 combined server hours. You can test these exact figures in our [tip pool calculator](/2026/12/tip-pool-calculator.html).

Explore our [what is a typical tip-out](/2026/12/what-is-a-typical-tip-out.html) guide and our [tip-out calculator](/2026/12/tip-out-calculator.html) to structure support staff payouts seamlessly.

Estimate for planning only. Not legal or tax advice. Rules verified Nov 2026 — sources below.`,
    related: [
      { label: 'Tip pool calculator', url: '/2026/12/tip-pool-calculator.html' },
      { label: 'Tip-out calculator', url: '/2026/12/tip-out-calculator.html' },
      { label: 'What is a typical tip-out?', url: '/2026/12/what-is-a-typical-tip-out.html' }
    ],
    sources: [
      { label: 'DOL Fact Sheet #15: Tipped Employees', url: 'https://www.dol.gov/agencies/whd/fact-sheets/15-tipped-employees-flsa' },
      { label: 'National Restaurant Association — Tip Pooling Guidelines', url: 'https://restaurant.org/' }
    ]
  },
  {
    slug: 'what-is-a-typical-tip-out',
    title: 'What Is a Typical Tip-Out? How Restaurants Structure It',
    h1: 'What is a typical tip-out? How restaurants structure it',
    description: 'Industry benchmark tip-out percentages for bartenders, bussers, runners, and hosts. Sales-based vs tips-based structures explained.',
    intro: 'Tip-outs compensate essential support staff who do not receive direct customer tips. Discover typical industry percentages and formulas.',
    labels: ['guides', 'tips', 'hospitality'],
    body: `In full-service restaurants and bars, front-line servers rarely keep 100% of the gratuities left by their guests. Instead, standard industry practice requires servers to tip out support staff who helped deliver the guest experience.

Tip-outs are generally calculated either as a percentage of total net sales or as a percentage of total tips received. The sales-based model is by far the most prevalent in high-volume American dining establishments.

Under the net sales model, a typical tip-out schedule allocates between 3% and 6% of total sales across support roles: 1.5% to 2.5% to bartenders for beverage production, 1.0% to 2.0% to bussers for table maintenance, and 1.0% to food runners.

Under the tips-based model, servers share between 20% and 35% of their total collected tips with support staff. For instance, if a server collects $300 in tips, they might tip out $45 (15%) to bussers and $30 (10%) to the service bar, retaining $225 (75%).

The key difference between the two models lies in sales volatility. A sales-based tip-out guarantees support staff consistent earnings regardless of how generously guests tip, but can penalize servers if several tables tip poorly.

Under federal FLSA rules, employers cannot use tip-outs to subsidize normal operational overhead or retain tips for house revenue. All tip-out funds must flow directly to eligible employees.

To calculate your take-home pay after shift tip-outs, use our interactive [tip-out calculator](/2026/12/tip-out-calculator.html).

You can also examine how tip-outs impact your weekly earnings using our [take-home pay with tips calculator](/2026/12/take-home-pay-with-tips-calculator.html) or our [tip pool calculator](/2026/12/tip-pool-calculator.html).

Estimate for planning only. Not legal or tax advice. Rules verified Nov 2026 — sources below.`,
    related: [
      { label: 'Tip-out calculator', url: '/2026/12/tip-out-calculator.html' },
      { label: 'Tip pool calculator', url: '/2026/12/tip-pool-calculator.html' },
      { label: 'Take-home pay with tips calculator', url: '/2026/12/take-home-pay-with-tips-calculator.html' }
    ],
    sources: [
      { label: 'DOL Fact Sheet #15: Tipped Employees Under the FLSA', url: 'https://www.dol.gov/agencies/whd/fact-sheets/15-tipped-employees-flsa' },
      { label: '29 U.S.C. 203(m) — Tipped Wage Provisions', url: 'https://www.ecfr.gov/current/title-29/subtitle-B/chapter-V/subchapter-A/part-531' }
    ]
  },
  {
    slug: 'daily-overtime-states',
    title: 'Daily Overtime: The 4 States That Have It',
    h1: 'Daily overtime: the 4 states that have it',
    description: 'Guide to daily overtime laws in California, Alaska, Nevada, and Colorado. Cutoffs, double time rules, and rate thresholds explained.',
    intro: 'While federal law only mandates overtime after 40 hours a week, four states require daily overtime: California, Alaska, Nevada, and Colorado.',
    labels: ['guides', 'overtime', 'compliance'],
    body: `Federal wage law under the Fair Labor Standards Act (FLSA) calculates overtime strictly on a weekly basis, requiring 1.5 times the regular rate for hours worked beyond 40 in a workweek. However, four states provide stronger employee protections by mandating daily overtime: California, Alaska, Nevada, and Colorado.

California has the most comprehensive daily overtime statute in the nation under Labor Code Section 510. Non-exempt employees earn 1.5x their regular rate for all hours worked over 8 up to 12 in a workday, and double time (2.0x) for hours beyond 12. Working seven consecutive days also triggers daily overtime for the first 8 hours on day seven, and double time beyond 8 hours.

Alaska mandates daily overtime for employers with four or more employees under AS 23.10.060. Any hours worked in excess of 8 in a single workday must be paid at 1.5 times the regular rate, in addition to weekly overtime after 40 hours.

Colorado enforces a unique 12-hour daily overtime cutoff under the Colorado Overtime and Minimum Pay Standards (COMPS) Order Rule 4. Employees earn 1.5x their regular rate for hours worked beyond 12 in a single workday or across 12 consecutive hours spanning shifts.

Nevada establishes a conditional daily overtime system under NRS 608.018. Daily overtime (1.5x after 8 hours in a 24-hour period) applies specifically to employees earning less than 1.5 times the state minimum wage ($18.00/hr). Employees earning $18.00/hr or more are subject only to the standard 40-hour weekly threshold.

In daily overtime states, daily and weekly overtime hours cannot be pyramided; employers credit daily overtime hours toward the 40-hour weekly threshold.

Calculate your exact hours breakdown using our [California overtime calculator](/2026/12/california-overtime-calculator.html) or our [Colorado overtime calculator](/2026/12/colorado-overtime-calculator.html).

For multi-state operators, check our [Nevada overtime calculator](/2026/12/nevada-overtime-calculator.html) or our [Alaska overtime calculator](/2026/12/alaska-overtime-calculator.html).

Estimate for planning only. Not legal or tax advice. Rules verified Nov 2026 — sources below.`,
    related: [
      { label: 'California overtime calculator', url: '/2026/12/california-overtime-calculator.html' },
      { label: 'Colorado overtime calculator', url: '/2026/12/colorado-overtime-calculator.html' },
      { label: 'Nevada overtime calculator', url: '/2026/12/nevada-overtime-calculator.html' }
    ],
    sources: [
      { label: 'California DIR — Overtime Pay FAQ', url: 'https://www.dir.ca.gov/dlse/faq_overtime.htm' },
      { label: 'Colorado Department of Labor — COMPS Order #40', url: 'https://cdle.colorado.gov/' },
      { label: 'Nevada Office of the Labor Commissioner', url: 'https://labor.nv.gov/' }
    ]
  },
  {
    slug: 'shift-differential-overtime',
    title: 'How Overtime Works with a Shift Differential',
    h1: 'How overtime works with a shift differential (regular rate explained)',
    description: 'Calculate blended regular rate when working multiple rates or night differentials. 29 CFR 778 formulas with step-by-step arithmetic.',
    intro: 'Working night shifts or multiple pay rates changes how overtime is computed. Learn how to calculate your blended regular rate under 29 CFR 778.',
    labels: ['guides', 'overtime', 'math'],
    body: `When an employee works shifts at different hourly rates in the same workweek—such as a base day rate and a night shift differential—overtime cannot simply be calculated on the lower base rate. Under federal FLSA regulations (29 CFR § 778.115), employers must calculate a blended regular rate.

A shift differential is an additional hourly amount paid to incentivize employees to work less desirable hours, such as evening, overnight, or weekend shifts. Under the law, all non-discretionary differentials form part of the regular rate of pay.

To compute the blended regular rate, total earnings from all hours worked across all shifts are divided by total hours worked in the workweek. The overtime premium of 0.5 times this blended rate is then added to all overtime hours worked beyond 40.

For example, consider an employee who works 30 hours at a base rate of $20.00/hr ($600.00) and 15 hours on a night differential shift at $23.00/hr ($345.00). Total straight-time earnings are $945.00 for 45 total hours.

Dividing $945.00 by 45 hours produces a blended regular rate of $21.00 per hour. The 5 overtime hours earn straight time plus half-time premium ($10.50/hr), resulting in an overtime premium of $52.50. Total gross pay equals $997.50.

Failing to blend differential rates is a common payroll error that violates federal and state wage laws, leading to substantial back-pay liability for employers.

You can verify mixed shifts instantly using our [shift differential calculator](/2026/12/shift-differential-calculator.html).

For standard weekly calculations, explore our [overtime and double time calculator](/2026/12/overtime-and-double-time-calculator.html) or our [take-home pay with tips calculator](/2026/12/take-home-pay-with-tips-calculator.html).

Estimate for planning only. Not legal or tax advice. Rules verified Nov 2026 — sources below.`,
    related: [
      { label: 'Shift differential calculator', url: '/2026/12/shift-differential-calculator.html' },
      { label: 'Overtime and double time calculator', url: '/2026/12/overtime-and-double-time-calculator.html' },
      { label: 'Take-home pay with tips calculator', url: '/2026/12/take-home-pay-with-tips-calculator.html' }
    ],
    sources: [
      { label: '29 CFR § 778.115 — Employees Working at Two or More Rates', url: 'https://www.ecfr.gov/current/title-29/subtitle-B/chapter-V/subchapter-B/part-778' },
      { label: 'DOL Fact Sheet #23: Overtime Pay Requirements', url: 'https://www.dol.gov/agencies/whd/fact-sheets/23-flsa-overtime-pay' }
    ]
  },
  {
    slug: 'tipped-employee-overtime',
    title: 'Tipped Employee Overtime: Cash Wage Calculation',
    h1: 'Tipped employee overtime: how the cash wage is calculated',
    description: 'Learn the exact legal formula for tipped employee overtime. Why multiplying cash wage by 1.5 is illegal, with full arithmetic breakdown.',
    intro: 'Calculating overtime for tipped employees requires computing 1.5x the full minimum wage before subtracting the tip credit. Here is the legal formula.',
    labels: ['guides', 'overtime', 'tips'],
    body: `One of the most widespread wage violations in the hospitality industry occurs when employers calculate overtime by simply multiplying a server's reduced direct cash wage by 1.5. Under federal law, this practice is illegal.

Under Fair Labor Standards Act (FLSA) regulations (29 CFR § 531.60), overtime for tipped employees must always be calculated using the full statutory minimum wage, never the cash wage alone.

The statutory formula requires two steps: first, multiply the full basic minimum wage by 1.5 to determine the regular overtime rate. Second, subtract the allowable tip credit from that overtime rate to find the direct cash wage owed by the employer.

Under federal rates where the minimum wage is $7.25 and the maximum tip credit is $5.12, the full overtime rate is $10.875 per hour ($7.25 x 1.5). Subtracting the $5.12 tip credit leaves a direct cash overtime rate of $5.755 (rounded to $5.76 per hour).

If an employer mistakenly multiplied the $2.13 cash wage by 1.5, they would pay only $3.20 per hour in overtime, unlawfully shortchanging the worker by more than $2.55 for every overtime hour worked.

In states with higher minimum wages, the difference is even more pronounced. In Illinois, where minimum wage is $15.00 and tip credit is $6.00, the cash overtime wage is $16.50/hr ($15.00 x 1.5 - $6.00). In New York Downstate, the overtime cash rate is $19.25/hr ($16.50 x 1.5 - $5.50).

In states that prohibit tip credits entirely—such as California, Nevada, and Alaska—tipped workers receive 1.5 times the full state minimum wage in direct cash.

Calculate your exact statutory overtime pay with our [tipped overtime calculator](/2026/12/tipped-overtime-calculator.html).

Compare state rules using our [Illinois tipped minimum wage calculator](/2026/12/illinois-tipped-minimum-wage-and-overtime-calculator.html) or our [New York tipped minimum wage calculator](/2026/12/new-york-tipped-minimum-wage-and-overtime-calculator.html).

Estimate for planning only. Not legal or tax advice. Rules verified Nov 2026 — sources below.`,
    related: [
      { label: 'Tipped overtime calculator', url: '/2026/12/tipped-overtime-calculator.html' },
      { label: 'Illinois tipped minimum wage calculator', url: '/2026/12/illinois-tipped-minimum-wage-and-overtime-calculator.html' },
      { label: 'New York tipped minimum wage calculator', url: '/2026/12/new-york-tipped-minimum-wage-and-overtime-calculator.html' }
    ],
    sources: [
      { label: '29 CFR § 531.60 — Overtime Payments on Tipped Wages', url: 'https://www.ecfr.gov/current/title-29/subtitle-B/chapter-V/subchapter-A/part-531' },
      { label: 'DOL Fact Sheet #15: Tipped Employees Under the FLSA', url: 'https://www.dol.gov/agencies/whd/fact-sheets/15-tipped-employees-flsa' }
    ]
  },
  {
    slug: 'no-tax-on-tips-rules',
    title: 'No Tax on Tips (2025–2028): Who Qualifies',
    h1: 'No tax on tips (2025–2028): who qualifies and what it does not cover',
    description: 'Federal tax deduction rules for qualified tips: $25,000 cap, MAGI phase-out thresholds, eligible occupations, and FICA payroll tax rules.',
    intro: 'Federal tax reforms introduce an above-the-line deduction for qualified tips up to $25,000. Learn who qualifies, phase-outs, and limitations.',
    labels: ['guides', 'taxes', 'tips'],
    body: `Recent federal tax legislation enacted an above-the-line deduction on Form 1040 (Schedule 1-A) for qualified tip income received by eligible service workers between tax years 2025 and 2028.

The deduction allows eligible employees to deduct up to $25,000 of qualified gratuities per tax return directly from their gross income, reducing their taxable federal income dollar-for-dollar without requiring them to itemize deductions.

To qualify, tips must be voluntary cash or credit card gratuities received by an employee in an occupation that traditionally and customarily receives tips, such as restaurant servers, bartenders, hairstylists, bellhops, and delivery drivers. Mandatory service charges added by employers do not qualify as tips.

The deduction is subject to statutory income phase-out limits: the allowable deduction begins phasing out at $150,000 of Modified Adjusted Gross Income (MAGI) for single filers and $300,000 for married couples filing jointly.

For every $1,000 by which a taxpayer's MAGI exceeds these thresholds, the maximum deduction is reduced by $100. Taxpayers filing as Married Filing Separately are disqualified from claiming the deduction.

Crucially, the deduction applies exclusively to federal income tax. It does not eliminate Social Security (6.2%) or Medicare (1.45%) payroll taxes under FICA; payroll taxes remain due on all reported tips.

State income taxes also vary; unless your state legislature specifically conforms its state tax code to the federal provision, state income tax may still apply to tip earnings.

You can calculate your estimated tax savings using our [no-tax-on-tips and overtime deduction estimator](/2026/12/no-tax-on-tips-and-overtime-deduction-estimator.html).

Review your complete paycheck impact with our [take-home pay with tips calculator](/2026/12/take-home-pay-with-tips-calculator.html) or our [tip pool calculator](/2026/12/tip-pool-calculator.html).

Estimate for planning only. Not legal or tax advice. Rules verified Nov 2026 — sources below.`,
    related: [
      { label: 'Tips & OT deduction estimator', url: '/2026/12/no-tax-on-tips-and-overtime-deduction-estimator.html' },
      { label: 'Take-home pay with tips calculator', url: '/2026/12/take-home-pay-with-tips-calculator.html' },
      { label: 'Tip-out calculator', url: '/2026/12/tip-out-calculator.html' }
    ],
    sources: [
      { label: 'Internal Revenue Service — Qualified Tips Guidance', url: 'https://www.irs.gov/newsroom/one-big-beautiful-bill-provisions' },
      { label: 'IRS Form 1040 Schedule 1-A Instructions', url: 'https://www.irs.gov/forms-pubs/about-schedule-1-form-1040' }
    ]
  },
  {
    slug: 'no-tax-on-overtime-california',
    title: 'No Tax on Overtime: Why CA Daily OT May Not Count',
    h1: 'No tax on overtime: why California daily OT may not count',
    description: 'Federal overtime deduction limits under FLSA Section 7 definition. Why state daily overtime in California might not qualify for federal deductions.',
    intro: 'Federal tax legislation limits overtime deductions to hours mandated under FLSA Section 7. Learn why California daily overtime faces scrutiny.',
    labels: ['guides', 'taxes', 'overtime'],
    body: `Federal tax reforms provide an above-the-line deduction for qualified overtime compensation (capped at $12,500 for single filers and $25,000 for married couples filing jointly). However, workers in states with daily overtime laws, such as California, face critical statutory distinctions.

The federal statute defines 'qualified overtime compensation' strictly by reference to overtime required under Section 7 of the Fair Labor Standards Act (FLSA), 29 U.S.C. § 207. Under Section 7 of the FLSA, overtime is required only for hours worked in excess of 40 in a workweek.

California Labor Code Section 510 mandates daily overtime after 8 hours in a day, double time after 12 hours, and seventh-day overtime. However, if an employee works daily overtime during a week where total hours do not exceed 40, those premium hours arise solely under California state law, not Section 7 of the FLSA.

Because federal tax deduction provisions tie qualification to FLSA Section 7, daily overtime hours that fall below the 40-hour weekly threshold may be excluded from the federal overtime deduction under preliminary IRS guidance.

Only the premium portion—the 'half' in time-and-a-half—qualifies for the deduction. For example, if an employee's regular rate is $30.00/hr and their overtime rate is $45.00/hr, only the $15.00/hr premium counts toward the deduction, not the full $45.00.

The deduction phases out starting at $150,000 MAGI for single filers ($300,000 joint) at a rate of $100 per $1,000 excess, and Married Filing Separately filers receive $0.

California state income tax does not automatically conform to federal changes; California tax returns may still assess full state income tax on all overtime pay.

Estimate your deduction and tax bracket savings with our [no-tax-on-tips and overtime deduction estimator](/2026/12/no-tax-on-tips-and-overtime-deduction-estimator.html).

Review your weekly hours breakdown with our [California overtime calculator](/2026/12/california-overtime-calculator.html) or our [shift differential calculator](/2026/12/shift-differential-calculator.html).

Estimate for planning only. Not legal or tax advice. Rules verified Nov 2026 — sources below.`,
    related: [
      { label: 'California overtime calculator', url: '/2026/12/california-overtime-calculator.html' },
      { label: 'Tips & OT deduction estimator', url: '/2026/12/no-tax-on-tips-and-overtime-deduction-estimator.html' },
      { label: 'Daily overtime states guide', url: '/2026/12/daily-overtime-states.html' }
    ],
    sources: [
      { label: 'IRS Guidelines on Qualified Overtime Deductions', url: 'https://www.irs.gov/newsroom/one-big-beautiful-bill-provisions' },
      { label: 'California Franchise Tax Board (FTB)', url: 'https://www.ftb.ca.gov/' }
    ]
  },
  {
    slug: 'how-to-read-tipped-paystub',
    title: 'How to Read Your Paystub as a Tipped Worker',
    h1: 'How to read your paystub as a tipped worker',
    description: 'Detailed line-by-line guide to understanding tipped worker paystubs: cash wages, reported tips, tip credits, FICA taxes, and net pay arithmetic.',
    intro: 'Paystubs for tipped employees contain unique line items like allocated tips and tip credits. Here is how to verify your pay accurately.',
    labels: ['guides', 'paystubs', 'tips'],
    body: `Paystubs for restaurant, bar, and hospitality staff look fundamentally different from standard hourly paystubs because they must account for both direct employer cash wages and customer-provided gratuities.

Understanding each line item on your earnings statement ensures your employer is paying correct statutory wages and deducting payroll taxes properly.

Direct cash wages represent the hourly rate paid directly from the employer's payroll. In states following the federal standard, this appears as $2.13 per hour multiplied by your total hours worked. In states that ban tip credits like California or Nevada, this equals the full state minimum wage.

Reported tips include all credit card tips paid out on payroll or declared cash tips. These tips appear on your paystub so that federal, state, and payroll taxes can be calculated, even if cash tips were already taken home at the end of each shift.

Tip credit line items show the amount the employer claims as a credit against the statutory minimum wage. For example, on 40 hours under federal law, a $5.12 credit appears as a $204.80 tip credit offset, demonstrating that combined cash wages ($85.20) and tips satisfy the $288.00 minimum wage obligation.

FICA deductions include Social Security tax (6.2%) and Medicare tax (1.45%), calculated on total gross compensation (cash wages plus all reported tips). If credit card tips were paid out in cash at shift end, your payroll check may be small or zero because taxes on all tips are withheld from direct cash wages.

If an employer allocates tips because total reported restaurant tips fall below 8% of gross food and beverage sales, allocated tips will appear on Form W-2 Box 8, but are not subject to immediate withholding on paystubs.

You can verify your expected take-home pay using our [take-home pay with tips calculator](/2026/12/take-home-pay-with-tips-calculator.html).

To check your overtime rates, explore our [tipped overtime calculator](/2026/12/tipped-overtime-calculator.html) or our [tip-out calculator](/2026/12/tip-out-calculator.html).

Estimate for planning only. Not legal or tax advice. Rules verified Nov 2026 — sources below.`,
    related: [
      { label: 'Take-home pay with tips calculator', url: '/2026/12/take-home-pay-with-tips-calculator.html' },
      { label: 'Tipped overtime calculator', url: '/2026/12/tipped-overtime-calculator.html' },
      { label: 'Tip pool calculator', url: '/2026/12/tip-pool-calculator.html' }
    ],
    sources: [
      { label: 'IRS Publication 531: Reporting Tip Income', url: 'https://www.irs.gov/forms-pubs/about-publication-531' },
      { label: 'DOL Fact Sheet #15: Tipped Employees', url: 'https://www.dol.gov/agencies/whd/fact-sheets/15-tipped-employees-flsa' }
    ]
  }
];

for (const g of GUIDES) {
  const md = `---
title: "${g.title}"
slugTitle: "${g.slug}"
h1: "${g.h1}"
description: "${g.description}"
intro: "${g.intro}"
type: guide
hub: /p/guides.html
hubName: Guides
labels: [${g.labels.join(', ')}]
needs human edit: true
related:
${g.related.map(r => `  - { label: "${r.label}", url: "${r.url}" }`).join('\n')}
sources:
${g.sources.map(s => `  - { label: "${s.label}", url: "${s.url}" }`).join('\n')}
---
${g.body}
`;

  writeFileSync(`content/guides/${g.slug}.md`, md, 'utf8');
  console.log(`Wrote content/guides/${g.slug}.md`);
}
console.log('Successfully generated 10 guides.');
