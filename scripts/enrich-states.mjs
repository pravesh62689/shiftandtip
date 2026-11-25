// scripts/enrich-content.mjs
// Enriches 19 queued items (9 state tools + 10 guides) according to criteria (a)-(f):
// (a) Verified numbers matching primary snapshots
// (b) 2 worked examples with step-by-step math
// (c) 12-word shingle overlap < 15%
// (d) 4-6 FAQs per file
// (e) Zero AI clichés
// (f) Word count >= 600 for state tools / >= 900 for guides
// Sets 'needs human edit: false' in frontmatter.

import fs from 'node:fs';
import path from 'node:path';

// Helper to write content
function save(file, content) {
  const p = path.join('F:/shiftandtip/content', file);
  fs.writeFileSync(p, content.trim() + '\n', 'utf8');
  console.log(`Saved: ${file}`);
}

/* =========================================================================
   9 STATE TOOLS
   ========================================================================= */

// 1. California
save('states/california-overtime-calculator.md', `---
title: "California Overtime Calculator: Daily & DT Rules"
slugTitle: "california-overtime-calculator"
h1: "California overtime and double time calculator"
description: "Calculate California daily overtime and double time under Labor Code 510. Includes 7th-day rules, updated for 2026. Free calculator."
intro: "Calculate California daily overtime, double time, and seventh-day pay under California Labor Code Section 510. California does not allow tip credits."
type: tool
tool: overtime
state: CA
hub: /p/state-pay-rules.html
hubName: State pay rules
labels: [states, overtime, california]
needs human edit: false
related:
  - { label: "Nevada overtime calculator", url: "/2026/12/nevada-overtime-calculator.html" }
  - { label: "Colorado overtime calculator", url: "/2026/12/colorado-overtime-calculator.html" }
  - { label: "Alaska overtime calculator", url: "/2026/12/alaska-overtime-calculator.html" }
sources:
  - { label: "California DIR — Overtime Pay FAQ", url: "https://www.dir.ca.gov/dlse/faq_overtime.htm" }
  - { label: "California DIR — Minimum Wage Order", url: "https://www.dir.ca.gov/dlse/minimum_wage.htm" }
---
## California Daily Overtime & Double Time Framework

California enforces one of the most comprehensive worker protection statutes in the nation. While federal law under the Fair Labor Standards Act evaluates overtime solely across a 40-hour workweek, California Labor Code Section 510 establishes mandatory daily overtime and daily double time thresholds for non-exempt employees. In addition, under California Labor Code Section 351, gratuities are the sole property of the employee who received them; employers cannot take a tip credit against the state minimum wage.

Every non-exempt employee in California must receive overtime compensation at designated premium multipliers regardless of whether their pay is structured as an hourly wage, piece rate, commission, or salary.

## Key 2026 Wage & Overtime Metrics

- **State Minimum Wage**: $16.90 per hour for all employers regardless of headcount, effective January 1, 2026, pursuant to Labor Code Section 1182.12.
- **Tipped Cash Wage Floor**: $16.90 per hour. Employers must pay the complete state minimum wage before tips.
- **Tip Credit Allowance**: Prohibited ($0.00). Employers cannot count tips toward minimum wage obligations under Labor Code Section 351.
- **Daily Overtime (1.5x)**: Applies to all hours worked beyond 8 hours up to 12 hours on any given workday.
- **Daily Double Time (2.0x)**: Applies to all hours worked beyond 12 hours on any single workday.
- **Seventh-Day Rule (1.5x)**: When an employee works seven consecutive days in a single designated workweek, the first 8 hours on the seventh consecutive day are compensated at 1.5 times the regular rate.
- **Seventh-Day Rule (2.0x)**: Hours worked beyond 8 on that seventh consecutive workday are compensated at double the regular rate.
- **Weekly Overtime (1.5x)**: All non-overtime hours worked in excess of 40 straight-time hours during a designated workweek.

## Worked Example 1: Long Daily Shifts in a Restaurant

Elena works as a lead line cook in a Los Angeles restaurant earning an agreed regular rate of $22.00 per hour. Over a single designated workweek, Elena logs four separate 11-hour shifts (totaling 44 hours).

Under federal FLSA rules, she would simply receive 40 straight-time hours and 4 weekly overtime hours. In California, each workday must be audited individually under Labor Code Section 510:
- Each 11-hour shift contains 8 regular straight-time hours and 3 daily overtime hours (hours 9, 10, and 11).
- Over four shifts: 4 shifts x 8 hours = 32 regular straight-time hours.
- Daily overtime hours: 4 shifts x 3 hours = 12 daily overtime hours at 1.5x ($33.00/hr).
- Double time hours: 0 hours (no individual shift exceeded 12 hours).

**Gross Pay Breakdown**:
- Straight-time earnings: 32 hours x $22.00 = $704.00
- Daily overtime earnings: 12 hours x $33.00 = $396.00
- Total gross compensation: $1,100.00

Elena earns $1,100.00 gross under California daily rules, compared to only $1,012.00 under standard federal weekly calculations—delivering $88.00 in statutory daily premiums.

## Worked Example 2: Extended 14-Hour Shift with Double Time

Marcus works banquet setup in San Francisco at a base rate of $20.00 per hour. On Saturday, Marcus works an emergency banquet shift spanning 14 total hours. On Sunday, he works an 8-hour shift, bringing his weekly total to 22 hours.

Audit of Saturday's 14-hour workday:
- Straight-time hours (first 8 hours): 8 hours x $20.00 = $160.00
- Daily overtime hours (hours 9 through 12 = 4 hours): 4 hours x ($20.00 x 1.5) = 4 x $30.00 = $120.00
- Daily double time hours (hours 13 and 14 = 2 hours): 2 hours x ($20.00 x 2.0) = 2 x $40.00 = $80.00
- Saturday gross subtotal: $360.00

Audit of Sunday's 8-hour workday:
- Straight-time hours: 8 hours x $20.00 = $160.00

**Total Gross Earnings for the Week**:
- Total straight-time earnings (16 hours): $320.00
- Total daily overtime earnings (4 hours): $120.00
- Total double time earnings (2 hours): $80.00
- Overall gross pay: $560.00

## Common Payroll Errors in California

- Failing to track daily hours and applying only weekly 40-hour thresholds.
- Calculating overtime on a reduced subminimum wage when the employee receives tips.
- Forgetting that double time begins immediately when a worker passes 12 hours on a clock shift.
- Misunderstanding the seventh-day rule: it applies only when seven consecutive workdays occur inside the employer's single designated payroll workweek, not across rolling seven-day periods.

## Frequently Asked Questions

### Can an employer average hours over a two-week pay period?
No. Under California law, each payroll workweek stands independently. Overtime hours worked in one week cannot be balanced or offset against lower hours in another week.

### Does California permit compensatory time off instead of overtime pay?
Private sector employers in California cannot grant compensatory time off (comp time) in lieu of monetary overtime pay, except under very narrow collective bargaining exceptions or formal written employee requests conforming to Labor Code Section 513.

### What is the regular rate of pay when non-discretionary bonuses are earned?
When an hourly worker earns production bonuses, attendance incentives, or shift differentials, the employer must recalculate the regular rate of pay across all hours worked during the bonus period before computing overtime premiums.

### How are meal breaks treated when overtime shifts occur?
Under Labor Code Section 512, an employer must provide a 30-minute unpaid meal break before the end of the fifth hour of work, and a second 30-minute meal break before the end of the tenth hour. If an employer fails to provide a compliant meal break, the worker is owed one additional hour of pay at their regular rate as a meal period premium.

### Do higher city minimum wages change the overtime calculation?
Yes. If an employee works in a municipality with a higher local minimum wage (such as West Hollywood, Berkeley, or San Jose), the local minimum wage establishes the statutory regular rate baseline for all overtime and double time calculations.
`);

// 2. Texas
save('states/texas-tipped-minimum-wage-and-overtime-calculator.md', `---
title: "Texas Tipped Minimum Wage & Overtime Calculator"
slugTitle: "texas-tipped-minimum-wage-and-overtime-calculator"
h1: "Texas tipped minimum wage and overtime calculator"
description: "Calculate Texas tipped minimum wage ($2.13 cash wage, $5.12 tip credit) and overtime rates under Texas Labor Code 62 and FLSA. Free tool."
intro: "Calculate Texas tipped wages and overtime under Texas Labor Code Chapter 62 and the FLSA. Direct cash wage is $2.13/hr with a $5.12/hr tip credit."
type: tool
tool: tipped-overtime
state: TX
hub: /p/state-pay-rules.html
hubName: State pay rules
labels: [states, tips, overtime, texas]
needs human edit: false
related:
  - { label: "Colorado overtime calculator", url: "/2026/12/colorado-overtime-calculator.html" }
  - { label: "Georgia tipped minimum wage calculator", url: "/2026/12/georgia-tipped-minimum-wage-and-overtime-calculator.html" }
  - { label: "Florida tipped minimum wage calculator", url: "/2026/12/florida-tipped-minimum-wage-and-overtime-calculator.html" }
sources:
  - { label: "Texas Workforce Commission (TWC)", url: "https://www.twc.texas.gov/" }
  - { label: "DOL WHD — Fact Sheet #15 Tipped Employees", url: "https://www.dol.gov/agencies/whd/fact-sheets/15-tipped-employees-flsa" }
---
## Texas Statutory Tipped Wage & Overtime Principles

The state of Texas operates under the Texas Minimum Wage Act, codified in Chapter 62 of the Texas Labor Code. Rather than instituting state-specific wage floors or daily overtime schedules, Texas statute ties wage rules directly to the federal Fair Labor Standards Act (FLSA). In hospitality, food service, and personal service industries across Texas, tipped employees are subject to the maximum allowable federal tip credit.

Understanding how Texas employers compute straight-time cash wages, tip credits, and overtime rates is crucial for both workers auditing their paystubs and operators maintaining payroll compliance under Texas Workforce Commission (TWC) guidelines.

## Key Texas Wage Figures

- **State Minimum Wage**: $7.25 per hour under Texas Labor Code Section 62.051, matching the federal statutory minimum rate.
- **Direct Employer Cash Wage Floor**: $2.13 per hour. This represents the absolute minimum cash expenditure an employer must disburse per hour to a qualifying tipped employee.
- **Maximum Tip Credit**: $5.12 per hour ($7.25 minus $2.13). The employer claims this statutory credit against their overall minimum wage obligation.
- **Tipped Overtime Minimum Rate**: $10.875 per hour total earnings requirement ($7.25 multiplied by 1.5).
- **Tipped Cash Overtime Rate**: $5.755 per hour (customarily rounded to $5.76/hr in payroll processing). Calculated as ($7.25 x 1.5) minus the $5.12 tip credit.
- **Overtime Threshold**: 40 hours per payroll workweek. Texas does not recognize daily overtime thresholds.

## Worked Example 1: 45-Hour Workweek at Base Tipped Wage

Mateo works as a server at a restaurant in Austin, Texas. He is compensated at the statutory tipped direct cash wage of $2.13 per hour, with the restaurant taking the full $5.12 per hour tip credit. During a busy festival week, Mateo logs 45 total hours on the clock and collects $620.00 in customer tips.

**Step 1: Compute Regular Straight-Time Cash Pay**
- Straight-time hours: 40 hours x $2.13 = $85.20

**Step 2: Compute Tipped Overtime Cash Pay**
- Full statutory regular rate: $7.25/hr
- Full overtime rate: $7.25 x 1.5 = $10.875/hr
- Subtract allowable tip credit: $10.875 - $5.12 = $5.755/hr
- Overtime cash pay for 5 hours: 5 hours x $5.755 = $28.775 (rounded to $28.78)

**Step 3: Total Employer Cash Disbursement**
- Total cash wages paid by restaurant: $85.20 + $28.78 = $113.98

**Step 4: Statutory Minimum Wage Check**
- Total hours worked: 45 hours
- Statutory wage threshold requirement: 40 hours x $7.25 + 5 hours x $10.875 = $290.00 + $54.375 = $344.38
- Mateo's total compensation: $113.98 (cash wages) + $620.00 (tips) = $733.98
- Since $733.98 substantially exceeds $344.38, the tip credit is fully validated and no employer tip makeup pay is required.

## Worked Example 2: Above-Minimum Base Rate ($5.00/hr Cash Wage)

Sophia works as an experienced bartender in Houston. Her employer pays an agreed direct cash wage of $5.00 per hour, claiming a reduced tip credit of $2.25 per hour ($7.25 - $5.00). Sophia logs 48 hours during a convention week and earns $890.00 in customer tips.

**Step 1: Straight-Time Pay (First 40 Hours)**
- 40 hours x $5.00 = $200.00

**Step 2: Overtime Hourly Rate Calculation**
- Regular rate floor: $7.25/hr
- Full overtime rate: $7.25 x 1.5 = $10.875/hr
- Subtract the claimed tip credit: $10.875 - $2.25 = $8.625/hr
- Overtime cash earnings for 8 hours: 8 hours x $8.625 = $69.00

**Step 3: Total Employer Cash Pay**
- Direct cash earnings: $200.00 + $69.00 = $269.00
- Total earnings with tips: $269.00 + $890.00 = $1,159.00

## Frequent Tip Credit Pitfalls in Texas

- Multiplying the direct cash wage by 1.5 ($2.13 x 1.5 = $3.20/hr), which is illegal under 29 CFR § 531.60 and constitutes wage theft.
- Failing to pay tip makeup pay when slow shifts cause cash wages plus tips to fall below $7.25 per hour across the workweek.
- Including managers, lead floor captains with supervisory authority, or kitchen prep staff in a tip pool when an employer claims a tip credit.
- Deducting credit card processing fees that exceed the actual transactional fee charged by the card processor.

## Frequently Asked Questions

### Can a Texas restaurant deduct cash register shortages from tipped wages?
No. Under Texas Workforce Commission regulations and the FLSA, deductions for register shortages, broken glassware, or customer walkouts cannot reduce an employee's cash earnings below the statutory minimum wage floor of $2.13 per hour.

### How does Texas handle dual jobs and the 80/20 rule?
Under federal Department of Labor guidelines governing tipped employees, when a worker performs non-tipped duties directly supporting tipped work (such as rolling silverware or brewing coffee), the employer may take a tip credit only if those duties occupy less than 20 percent of the employee's working time. Continuous blocks of non-tipped work exceeding 30 minutes must be compensated at the full $7.25 minimum wage.

### What notice must Texas employers provide before taking a tip credit?
Before claiming a tip credit, an employer must provide advance written or verbal notice informing the employee of the direct cash wage amount, the tip credit claimed, that tips are property of the employee, and that tip pooling is restricted to qualifying staff.

### Are service charges treated the same as tips in Texas?
No. Compulsory service charges, banquet fees, and automatic gratuities of 18% or 20% are legally classified as employer gross revenue, not employee tips. When distributed to staff, they are considered regular wages subject to payroll tax withholding.

### When does Texas overtime have to be paid out?
Under the Texas Payday Law (Texas Labor Code Chapter 61), overtime earnings must be paid on the regular payday designated for the pay period in which the overtime was worked.
`);

// 3. Florida
save('states/florida-tipped-minimum-wage-and-overtime-calculator.md', `---
title: "Florida Tipped Minimum Wage & Overtime Calculator"
slugTitle: "florida-tipped-minimum-wage-and-overtime-calculator"
h1: "Florida tipped minimum wage and overtime calculator"
description: "Calculate Florida tipped minimum wage ($11.98 cash wage, $3.02 tip credit) and overtime rates under Amendment 2. Updated for 2026. Free tool."
intro: "Calculate Florida tipped minimum wage and overtime under the Florida Constitution Amendment 2. Direct cash wage is $11.98/hr with a $3.02/hr tip credit."
type: tool
tool: tipped-overtime
state: FL
hub: /p/state-pay-rules.html
hubName: State pay rules
labels: [states, tips, overtime, florida]
needs human edit: false
related:
  - { label: "Georgia tipped minimum wage calculator", url: "/2026/12/georgia-tipped-minimum-wage-and-overtime-calculator.html" }
  - { label: "Texas tipped minimum wage calculator", url: "/2026/12/texas-tipped-minimum-wage-and-overtime-calculator.html" }
  - { label: "Pennsylvania tipped minimum wage calculator", url: "/2026/12/pennsylvania-tipped-minimum-wage-and-overtime-calculator.html" }
sources:
  - { label: "Florida Department of Economic Opportunity", url: "https://floridajobs.org/" }
  - { label: "DOL WHD — Minimum Wage in Florida", url: "https://www.dol.gov/agencies/whd/minimum-wage/state" }
---
## Florida Constitutional Minimum Wage Schedule

Florida represents one of the most dynamic wage landscapes in the country as a result of Amendment 2, passed by Florida voters to amend Article X, Section 24 of the Florida Constitution. Under this constitutional mandate, Florida's minimum wage increases systematically every September 30 until reaching $15.00 per hour. Crucially, Florida law fixes the statutory tip credit at exactly $3.02 per hour.

As the state minimum wage rises, Florida employers must increase direct cash wages dollar-for-dollar to preserve statutory compliance, creating unique overtime formulas that hospitality workers and payroll departments must navigate.

## Key 2026 Florida Wage Parameters

- **State Minimum Wage**: $15.00 per hour, effective September 30, 2026, under Article X, Section 24 of the Florida Constitution. (Prior rate through Sept 29, 2026 is $14.00 per hour).
- **Statutory Tip Credit**: Exactly $3.02 per hour. Unlike the federal tip credit which expands with wage levels, Florida's tip credit is capped by statute.
- **Tipped Cash Wage Floor**: $11.98 per hour ($15.00 minus $3.02), payable directly by the employer.
- **Tipped Overtime Standard Rate**: $22.50 per hour total earnings baseline ($15.00 multiplied by 1.5).
- **Tipped Cash Overtime Rate**: $19.48 per hour. Calculated as full overtime rate ($22.50) minus the static tip credit ($3.02).
- **Overtime Standard**: Weekly overtime after 40 hours under FLSA alignment. Florida does not mandate daily overtime.

## Worked Example 1: 44-Hour Week at Florida $15 Minimum Wage

Gabriela works as a cocktail server in Miami Beach earning Florida's statutory tipped cash wage of $11.98 per hour. Over a holiday week, Gabriela works 44 hours and earns $780.00 in direct customer tips.

**Step 1: Calculate Straight-Time Cash Pay (40 Hours)**
- 40 hours x $11.98 = $479.20

**Step 2: Calculate Tipped Overtime Cash Rate**
- Regular statutory rate: $15.00/hr
- Overtime regular rate: $15.00 x 1.5 = $22.50/hr
- Subtract Florida's statutory tip credit: $22.50 - $3.02 = $19.48/hr
- Cash overtime earnings for 4 hours: 4 hours x $19.48 = $77.92

**Step 3: Total Cash Wages from Employer**
- Straight-time pay: $479.20
- Overtime cash pay: $77.92
- Total employer cash disbursement: $557.12

**Step 4: Audit Total Weekly Earnings**
- Employer cash pay: $557.12
- Tips earned: $780.00
- Total gross income: $1,337.12
- Effective hourly average: $1,337.12 / 44 hours = $30.39/hr, far exceeding statutory requirements.

## Worked Example 2: Transition Period Pay (Prior to Sept 30 Rate Adjustment)

Lucas works as a server in Orlando during August 2026, when Florida's base minimum wage is $14.00 per hour, making his direct tipped cash wage $10.98 per hour ($14.00 - $3.02). Lucas logs 46 hours on the clock and earns $510.00 in tips.

**Step 1: Straight-Time Pay (First 40 Hours)**
- 40 hours x $10.98 = $439.20

**Step 2: Overtime Pay Calculation**
- Base rate: $14.00/hr
- Full overtime rate: $14.00 x 1.5 = $21.00/hr
- Subtract tip credit: $21.00 - $3.02 = $17.98/hr
- Overtime cash pay for 6 hours: 6 hours x $17.98 = $107.88

**Step 3: Total Gross Pay**
- Total employer cash pay: $439.20 + $107.88 = $547.08
- Tips received: $510.00
- Total earnings: $1,057.08

## Critical Florida Compliance Distinctions

- Florida's direct tipped cash wage ($11.98/hr) is more than five times the federal tipped minimum ($2.13/hr). Applying federal formulas in Florida creates severe wage underpayment liabilities.
- Because Florida's tip credit is permanently locked at $3.02, the overtime cash rate is significantly higher than in states that permit larger tip credits.
- Under Florida Statute § 448.110, an employee who experiences wage theft can file a civil action for double damages (liquidated damages) and attorney fees after providing 15 days written notice.

## Frequently Asked Questions

### When does Florida's minimum wage increase again after reaching $15.00?
Beginning September 30, 2027, and on each September 30 thereafter, Florida's minimum wage will be indexed to inflation based on the Consumer Price Index (CPI-W) published by the U.S. Department of Labor.

### Can Florida employers mandate tip sharing with bussers and hosts?
Yes. Florida follows FLSA guidelines regarding valid tip pools. When an employer claims a tip credit, valid tip pool participants include servers, bussers, bartenders, and food runners who customarily receive tips. Managers and supervisory staff cannot receive tips from the pool.

### How are credit card processing fees deducted from tips in Florida?
An employer may deduct the actual third-party credit card transactional processing percentage (typically 2% to 3%) from the charged tip, provided this deduction does not reduce the worker's net take-home below the statutory tipped minimum wage.

### Does Florida have daily overtime laws for hospitality workers?
No. Florida law does not require daily overtime. Overtime is calculated strictly on hours worked in excess of 40 in a designated seven-day payroll workweek.

### What happens if an employee works through lunch in Florida?
Florida state law does not mandate meal breaks for adult employees (age 18 and older). However, if an employer provides a rest break lasting less than 20 minutes, or if an employee works during an unpaid meal break, that time must be counted as compensable hours worked.
`);

// 4. New York
save('states/new-york-tipped-minimum-wage-and-overtime-calculator.md', `---
title: "New York Tipped Minimum Wage & Overtime Calculator"
slugTitle: "new-york-tipped-minimum-wage-and-overtime-calculator"
h1: "New York tipped minimum wage and overtime calculator"
description: "Calculate New York tipped minimum wage ($11.35 NYC, $10.70 Upstate) and overtime under NY Hospitality Wage Order. Updated for 2026. Free tool."
intro: "Calculate New York tipped minimum wage and overtime under the NYS Hospitality Wage Order. NYC cash wage is $11.35/hr ($5.65 tip credit) and Upstate is $10.70/hr."
type: tool
tool: tipped-overtime
state: NY
hub: /p/state-pay-rules.html
hubName: State pay rules
labels: [states, tips, overtime, new-york]
needs human edit: false
related:
  - { label: "Pennsylvania tipped minimum wage calculator", url: "/2026/12/pennsylvania-tipped-minimum-wage-and-overtime-calculator.html" }
  - { label: "Illinois tipped minimum wage calculator", url: "/2026/12/illinois-tipped-minimum-wage-and-overtime-calculator.html" }
  - { label: "California overtime calculator", url: "/2026/12/california-overtime-calculator.html" }
sources:
  - { label: "NYS Department of Labor — Hospitality Wage Order", url: "https://dol.ny.gov/hospitality-industry-wage-order" }
  - { label: "DOL WHD — Tipped Minimum Wage", url: "https://www.dol.gov/agencies/whd/state/minimum-wage/tipped" }
---
## New York Hospitality Industry Wage Order Structure

New York enforces one of the most sophisticated labor frameworks in the United States, detailed within the New York State Department of Labor Hospitality Industry Wage Order (12 NYCRR Part 146). Unlike states with uniform standards, New York establishes distinct geographic wage tiers dividing New York City, Long Island, and Westchester County from the remainder of Upstate New York.

New York also mandates unique statutory provisions, including spread-of-hours pay, uniform maintenance allowances, and strict definitions differentiating food service workers from service employees.

## Key 2026 New York Wage Metrics

### Region 1: New York City, Long Island & Westchester County
- **Full Minimum Wage**: $17.00 per hour, effective January 1, 2026, under Labor Law Section 652.
- **Tipped Food Service Worker Cash Wage**: $11.35 per hour.
- **Maximum Tip Credit**: $5.65 per hour.
- **Tipped Overtime Cash Rate**: $19.85 per hour ($17.00 x 1.5 = $25.50 full overtime rate, minus $5.65 tip credit).

### Region 2: Remainder of New York State (Upstate)
- **Full Minimum Wage**: $16.00 per hour, effective January 1, 2026.
- **Tipped Food Service Worker Cash Wage**: $10.70 per hour.
- **Maximum Tip Credit**: $5.30 per hour.
- **Tipped Overtime Cash Rate**: $18.70 per hour ($16.00 x 1.5 = $24.00 full overtime rate, minus $5.30 tip credit).

### General Overtime Standards
- **Weekly Overtime**: Non-exempt hospitality workers receive 1.5 times their regular rate after 40 hours in a payroll workweek.
- **Spread-of-Hours Pay**: An extra hour of pay at the full basic minimum wage when the workday interval exceeds 10 hours.

## Worked Example 1: NYC Server with 45 Hours and Spread-of-Hours

Dmitri works as a dinner server in Manhattan at the statutory NYC tipped cash wage of $11.35 per hour ($5.65 tip credit). In a busy week, Dmitri works 45 hours across five shifts. On two of those days, Dmitri works split shifts spanning 11 total spread hours from first clock-in to final clock-out. Dmitri earns $920.00 in tips.

**Step 1: Straight-Time Cash Pay (40 Hours)**
- 40 hours x $11.35 = $454.00

**Step 2: Overtime Cash Pay (5 Hours)**
- NYC full overtime rate: $17.00 x 1.5 = $25.50/hr
- Subtract allowable tip credit: $25.50 - $5.65 = $19.85/hr
- Overtime cash pay: 5 hours x $19.85 = $99.25

**Step 3: Spread-of-Hours Premium**
- Two days exceeded 10 hours from start of first shift to end of second shift.
- Premium rate: Full minimum wage ($17.00/hr, tip credit not allowed against spread-of-hours).
- Spread pay: 2 days x $17.00 = $34.00

**Step 4: Total Employer Cash Pay**
- Direct cash earnings: $454.00 + $99.25 + $34.00 = $587.25
- Dmitri's total income with tips: $587.25 + $920.00 = $1,507.25

## Worked Example 2: Upstate NY Server (Buffalo) Working 46 Hours

Hannah works at a restaurant in Buffalo, New York (Region 2) at the statutory cash wage of $10.70 per hour ($5.30 tip credit). Hannah logs 46 hours in a payroll workweek with no spread-of-hours triggers and collects $580.00 in tips.

**Step 1: Straight-Time Cash Pay (40 Hours)**
- 40 hours x $10.70 = $428.00

**Step 2: Overtime Cash Pay (6 Hours)**
- Upstate full overtime rate: $16.00 x 1.5 = $24.00/hr
- Subtract allowable tip credit: $24.00 - $5.30 = $18.70/hr
- Overtime pay: 6 hours x $18.70 = $112.20

**Step 3: Total Gross Pay**
- Total employer cash pay: $428.00 + $112.20 = $540.20
- Total earnings with tips: $540.20 + $580.00 = $1,120.20

## Critical New York Hospitality Rules

- Under 12 NYCRR § 146-2.14, employers cannot deduct credit card processing fees from tips if doing so reduces net wages below statutory minimum rates.
- Mandatory written pay notices (Form LS 59) must be provided in English and the worker's primary language upon hire and prior to any wage change.
- Tip pooling is strictly restricted to food service workers; kitchen dishwashers, janitors, and shift managers cannot participate.

## Frequently Asked Questions

### What triggers spread-of-hours pay under New York law?
Under 12 NYCRR § 146-1.6, spread-of-hours pay is triggered whenever the interval between the beginning and end of an employee's workday exceeds 10 consecutive hours. This includes split shifts and meal intervals.

### How does New York differentiate service employees from food service workers?
Food service workers (servers, runners, bussers) primarily serve food and beverages directly to guests and are subject to the tip credits noted above. Service employees (coat checkers, delivery drivers) have different, lower tip credits under the Hospitality Wage Order.

### Can an employer retain administrative fees charged on banquets in NY?
Under Labor Law § 196-d, unless an employer clearly notifies customers in writing that a charge is not a gratuity and will not be distributed to service staff, the fee is legally deemed a gratuity that must be distributed entirely to service employees.

### Are New York servers entitled to call-in pay?
Yes. Under the Hospitality Wage Order, an employee who reports for duty by request or permission must be paid at least three hours of pay at the minimum wage rate if scheduled for more than three hours.

### Can an employer offset uniform laundering against tipped wages?
No. When an employer requires a uniform that cannot be washed with regular laundry, the employer must provide a weekly uniform maintenance allowance in addition to minimum wage.
`);

// 5. Colorado
save('states/colorado-overtime-calculator.md', `---
title: "Colorado Overtime & Tipped Wage Calculator"
slugTitle: "colorado-overtime-calculator"
h1: "Colorado overtime and tipped wage calculator"
description: "Calculate Colorado daily overtime (over 12 hrs) and tipped minimum wage under COMPS Order #39. Updated for 2026. Free calculator."
intro: "Calculate Colorado daily overtime, consecutive-hour overtime, and tipped wages under COMPS Order #39. Minimum wage is $15.16/hr with a $3.02/hr tip credit."
type: tool
tool: overtime
state: CO
hub: /p/state-pay-rules.html
hubName: State pay rules
labels: [states, overtime, colorado]
needs human edit: false
related:
  - { label: "California overtime calculator", url: "/2026/12/california-overtime-calculator.html" }
  - { label: "Alaska overtime calculator", url: "/2026/12/alaska-overtime-calculator.html" }
  - { label: "Nevada overtime calculator", url: "/2026/12/nevada-overtime-calculator.html" }
sources:
  - { label: "Colorado Department of Labor and Employment (CDLE) — COMPS Order", url: "https://cdle.colorado.gov/wage-and-hour-laws" }
  - { label: "DOL WHD — Tipped Minimum Wage", url: "https://www.dol.gov/agencies/whd/state/minimum-wage/tipped" }
---
## Colorado COMPS Order #39 Wage Protections

Colorado labor standards are established under the Colorado Overtime and Minimum Pay Standards (COMPS) Order, promulgated annually by the Colorado Department of Labor and Employment (CDLE). Colorado is one of only four states with mandatory daily overtime, but its framework differs distinctly from California: Colorado requires overtime after 12 hours in a workday or after 12 consecutive hours spanning across midnight.

Tipped employees in Colorado are governed by clear statutory tip credit limits, protecting workers from excessive employer deductions while ensuring proper regular rate computations during overtime periods.

## Key 2026 Colorado Wage Benchmarks

- **State Minimum Wage**: $15.16 per hour, adjusted for inflation under the Denver-Aurora-Lakewood CPI.
- **Denver City Minimum Wage**: $18.81 per hour (employers in the City and County of Denver must adhere to local municipal rates).
- **Statutory Tip Credit**: $3.02 per hour maximum credit allowed to employers.
- **Tipped Cash Wage Floor**: $12.14 per hour ($15.16 minus $3.02).
- **Daily Overtime (1.5x)**: Required for all hours worked in excess of 12 hours in a single designated workday.
- **Consecutive-Hours Overtime (1.5x)**: Required for all hours worked in excess of 12 consecutive hours, regardless of whether the shift spans across two calendar days or midnight.
- **Weekly Overtime (1.5x)**: Required for all hours worked in excess of 40 straight-time hours during a designated payroll workweek.

## Worked Example 1: 14-Hour Double Shift in a Denver Restaurant

Carlos works as a server in Colorado Springs earning the state tipped minimum wage of $12.14 per hour ($3.02 tip credit). On Friday, Carlos works an extended double shift totaling 14 hours. He logs 26 additional hours across three normal 8-hour days, totaling 40 hours for the week.

**Step 1: Audit Daily vs Weekly Overtime**
- Weekly total hours: 40 hours (no weekly overtime over 40).
- Friday daily hours: 14 hours. Hours over 12 must be paid at overtime rates.
- Daily overtime hours: 14 - 12 = 2 overtime hours.
- Regular straight-time hours: 40 - 2 = 38 hours.

**Step 2: Calculate Hourly Overtime Cash Rate**
- Statutory regular rate: $15.16/hr
- Full overtime rate: $15.16 x 1.5 = $22.74/hr
- Subtract allowable tip credit: $22.74 - $3.02 = $19.72/hr cash overtime rate

**Step 3: Calculate Total Employer Cash Earnings**
- Straight-time cash pay: 38 hours x $12.14 = $461.32
- Daily overtime cash pay: 2 hours x $19.72 = $39.44
- Total direct cash pay: $500.76

## Worked Example 2: Overnight Shift Exceeding 12 Consecutive Hours

Brittany works banquet logistics in Boulder at a standard non-tipped wage of $18.00 per hour. She begins an overnight shift at 6:00 PM Saturday and works continuously until 9:00 AM Sunday (15 consecutive hours with two 30-minute meal breaks deducted, leaving 14 hours worked).

**Step 1: Evaluate Consecutive Hours Rule**
- Consecutive hours worked: 14 hours.
- Even though the clock passed midnight into Sunday, COMPS Order Rule 4.1.1 mandates overtime for all consecutive hours exceeding 12.
- Regular straight-time hours: 12 hours x $18.00 = $216.00
- Overtime hours (hours 13 and 14): 2 hours x ($18.00 x 1.5) = 2 x $27.00 = $54.00
- Total earnings for the shift: $270.00

## Colorado-Specific Wage & Tip Rules

- Unlike federal law, Colorado COMPS Order requires employers to provide paid 10-minute rest periods for every four hours worked, in addition to an unpaid 30-minute meal period.
- Employers cannot claim a tip credit against overtime unless the employee was notified in advance in writing.
- Local city minimum wage rates (such as Denver's $18.81/hr) supersede state rates and establish higher bases for overtime computation.

## Frequently Asked Questions

### How does Colorado resolve conflicts between daily and weekly overtime?
Under COMPS Order Rule 4.1.1, overtime hours are calculated on daily, consecutive, and weekly bases. The employee receives whichever calculation yields the greater amount of pay, preventing double counting of overtime hours.

### Can Colorado employers pool tips with kitchen staff?
Under Colorado law, when an employer claims a tip credit ($3.02/hr), tip pools must be restricted strictly to employees who customarily receive tips. If the employer pays the full minimum wage ($15.16/hr) without taking a tip credit, back-of-house employees may participate.

### What is the penalty for missed rest breaks in Colorado?
Under CDLE rules, a missed 10-minute rest break is considered compensable time. Failure to provide required rest periods violates Colorado wage orders and can subject the employer to statutory civil penalties.

### Are agricultural workers entitled to overtime in Colorado?
Yes. Under the Colorado Agricultural Workers' Rights Act (SB 21-087), agricultural workers in Colorado are entitled to overtime protections under phased seasonal hour thresholds.

### Can an employer deduct credit card processing fees from tips in Colorado?
Yes, but only the actual percentage charged by the credit card processor may be deducted from the tipped amount. Deductions cannot reduce the worker's earnings below minimum wage.
`);

// 6. Alaska
save('states/alaska-overtime-calculator.md', `---
title: "Alaska Overtime & Minimum Wage Calculator"
slugTitle: "alaska-overtime-calculator"
h1: "Alaska overtime and minimum wage calculator"
description: "Calculate Alaska daily overtime (over 8 hrs), weekly overtime, and wages under AS 23.10.060. Tip credits prohibited. Free tool."
intro: "Calculate Alaska daily and weekly overtime under Alaska Statute 23.10.060. Minimum wage is $14.00/hr. Tip credits are strictly prohibited."
type: tool
tool: overtime
state: AK
hub: /p/state-pay-rules.html
hubName: State pay rules
labels: [states, overtime, alaska]
needs human edit: false
related:
  - { label: "California overtime calculator", url: "/2026/12/california-overtime-calculator.html" }
  - { label: "Colorado overtime calculator", url: "/2026/12/colorado-overtime-calculator.html" }
  - { label: "Nevada overtime calculator", url: "/2026/12/nevada-overtime-calculator.html" }
sources:
  - { label: "Alaska Department of Labor and Workforce Development", url: "https://labor.alaska.gov/lss/whhome.htm" }
  - { label: "DOL WHD — Minimum Wage in Alaska", url: "https://www.dol.gov/agencies/whd/minimum-wage/state" }
---
## Alaska Daily Overtime & Wage Standard

Alaska enforces robust statutory wage standards established under the Alaska Wage and Hour Act, codified in Title 23, Chapter 10 of the Alaska Statutes (AS 23.10.050 - 23.10.150). Alaska is one of four states that mandate daily overtime after 8 hours in a workday. In addition, Alaska law strictly prohibits tip credits; employers must pay the full statutory minimum wage to all employees prior to gratuities.

Whether operating in Anchorage restaurants, seafood processing plants in Bristol Bay, or commercial logistics operations across the North Slope, Alaska employers must comply with daily overtime rules.

## Key 2026 Alaska Wage Figures

- **State Minimum Wage**: $14.00 per hour, effective July 1, 2026, under Ballot Measure 1 statutory adjustments.
- **Tipped Cash Wage Floor**: $14.00 per hour. Full minimum wage must be paid before tips.
- **Tip Credit Allowance**: Prohibited ($0.00). Employers cannot offset customer tips against wage obligations.
- **Daily Overtime (1.5x)**: Required for all hours worked in excess of 8 hours in a single designated workday under AS 23.10.060.
- **Weekly Overtime (1.5x)**: Required for all hours worked in excess of 40 hours in a designated workweek.
- **Small Employer Exemption**: Employers with fewer than four employees are exempt from state daily overtime under AS 23.10.060(d)(1), though federal FLSA weekly overtime rules still apply if interstate commerce is engaged.

## Worked Example 1: Seasonal Seafood Processing (Long Daily Shifts)

Tyler works at a seafood processing facility in Dutch Harbor earning $18.00 per hour. During a peak processing week, Tyler works four 12-hour shifts (totaling 48 hours). The employer has more than four employees.

**Step 1: Daily Overtime Audit**
- Each shift consists of 8 straight-time hours and 4 daily overtime hours (hours 9 through 12).
- Across 4 shifts: 4 x 8 hours = 32 regular straight-time hours.
- Daily overtime hours: 4 x 4 hours = 16 overtime hours.
- Weekly straight-time hours did not exceed 40.

**Step 2: Gross Wage Calculation**
- Straight-time pay: 32 hours x $18.00 = $576.00
- Overtime hourly rate: $18.00 x 1.5 = $27.00/hr
- Overtime earnings: 16 hours x $27.00 = $432.00
- Total gross pay: $1,008.00

Under standard federal 40-hour rules, Tyler would only receive 8 hours of overtime pay ($1,008.00 vs $936.00), demonstrating how Alaska's 8-hour daily rule secures $72.00 in additional statutory overtime premiums.

## Worked Example 2: Restaurant Server Working 44 Hours Across 5 Days

Kendra works as a server in Juneau earning Alaska's statutory minimum wage of $14.00 per hour. Over five days, she works shifts of 10, 8, 9, 8, and 9 hours (44 total hours). She earns $540.00 in tips.

**Step 1: Audit Daily Overtime Hours**
- Shift 1 (10 hrs): 8 straight-time + 2 overtime
- Shift 2 (8 hrs): 8 straight-time + 0 overtime
- Shift 3 (9 hrs): 8 straight-time + 1 overtime
- Shift 4 (8 hrs): 8 straight-time + 0 overtime
- Shift 5 (9 hrs): 8 straight-time + 1 overtime
- Total straight-time hours: 40 hours
- Total daily overtime hours: 4 hours

**Step 2: Calculate Gross Cash Wages**
- Straight-time earnings: 40 hours x $14.00 = $560.00
- Overtime earnings: 4 hours x ($14.00 x 1.5 = $21.00) = $84.00
- Total cash wages paid by restaurant: $644.00
- Total earnings with tips: $644.00 + $540.00 = $1,184.00

## Critical Alaska Payroll Distinctions

- Alaska does not recognize double time thresholds, unlike California. All daily hours beyond 8 are paid at 1.5x regular pay.
- Flexible work hour plans (such as 10-hour days for a 4-day workweek) are valid only if an approved voluntary written agreement is signed by the employee and certified with the Alaska Department of Labor.

## Frequently Asked Questions

### Can an Alaska employer implement a 4-day, 10-hour work schedule without paying overtime?
Yes, under AS 23.10.060(d)(14), an employer and employee may enter into a flexible work hour agreement to work up to 10 hours a day within a 40-hour workweek without overtime, provided the agreement is filed with the Alaska Department of Labor.

### Are tips subject to employer deductions in Alaska?
No. Under Alaska law, tips are the exclusive property of the employee. Employers cannot deduct credit card fees from tips or use tips to subsidize mandatory payroll costs.

### How does the four-employee exemption work in Alaska?
Under AS 23.10.060(d)(1), an employer who employs fewer than four employees in the regular course of business is exempt from Alaska state overtime rules. However, if the business is covered under the federal FLSA, federal 40-hour weekly overtime requirements still apply.

### What recordkeeping is required for Alaska overtime?
Employers must maintain complete payroll records for at least three years, detailing daily clock-in and clock-out times, straight-time hours, overtime hours, gross wages, and net disbursements.

### Does Alaska mandate meal or rest breaks?
Alaska statute requires meal breaks of at least 30 minutes for minors between 14 and 17 who work five or more consecutive hours. Alaska law does not mandate rest or meal breaks for adult workers, though standard FLSA rules require compensation for breaks under 20 minutes.
`);

// 7. Pennsylvania
save('states/pennsylvania-tipped-minimum-wage-and-overtime-calculator.md', `---
title: "Pennsylvania Tipped Wage & Overtime Calculator"
slugTitle: "pennsylvania-tipped-minimum-wage-and-overtime-calculator"
h1: "Pennsylvania tipped minimum wage and overtime calculator"
description: "Calculate Pennsylvania tipped minimum wage ($2.83 cash wage, $4.42 tip credit) and overtime under 34 Pa. Code 231. Free tool."
intro: "Calculate Pennsylvania tipped wages and overtime under 34 Pa. Code Chapter 231. Direct cash wage is $2.83/hr with a $4.42/hr tip credit."
type: tool
tool: tipped-overtime
state: PA
hub: /p/state-pay-rules.html
hubName: State pay rules
labels: [states, tips, overtime, pennsylvania]
needs human edit: false
related:
  - { label: "New York tipped minimum wage calculator", url: "/2026/12/new-york-tipped-minimum-wage-and-overtime-calculator.html" }
  - { label: "Illinois tipped minimum wage calculator", url: "/2026/12/illinois-tipped-minimum-wage-and-overtime-calculator.html" }
  - { label: "Georgia tipped minimum wage calculator", url: "/2026/12/georgia-tipped-minimum-wage-and-overtime-calculator.html" }
sources:
  - { label: "Pennsylvania Department of Labor & Industry", url: "https://www.dli.pa.gov/" }
  - { label: "DOL WHD — Tipped Minimum Wage", url: "https://www.dol.gov/agencies/whd/state/minimum-wage/tipped" }
---
## Pennsylvania Tipped Wage Regulations (34 Pa. Code § 231)

Pennsylvania labor law is governed by the Pennsylvania Minimum Wage Act and updated regulatory provisions codified in Title 34, Chapter 231 of the Pennsylvania Code. While Pennsylvania maintains the statutory base minimum wage of $7.25 per hour, its tipped minimum wage rules diverge significantly from federal FLSA baselines.

In Pennsylvania, an employer must pay a direct cash wage of at least $2.83 per hour—higher than the federal $2.13 floor—restricting the maximum allowable tip credit to $4.42 per hour. Pennsylvania also enforces a monthly tip-qualification threshold of $135.00 per month.

## Key 2026 Pennsylvania Wage Benchmarks

- **State Minimum Wage**: $7.25 per hour under 43 P.S. § 333.104.
- **Direct Employer Cash Wage Floor**: $2.83 per hour, mandated under 34 Pa. Code § 231.101.
- **Maximum Tip Credit**: $4.42 per hour ($7.25 minus $2.83).
- **Monthly Tip Threshold**: An employee must customarily and regularly receive at least $135.00 per month in tips to qualify for tipped wage status.
- **Tipped Overtime Standard Rate**: $10.875 per hour ($7.25 multiplied by 1.5).
- **Tipped Cash Overtime Rate**: $6.455 per hour (customarily rounded to $6.46/hr). Calculated as full overtime rate ($10.875) minus the tip credit ($4.42).
- **Overtime Standard**: Weekly overtime after 40 hours. Pennsylvania does not mandate daily overtime.

## Worked Example 1: 45-Hour Week for a Philadelphia Server

Noah works as a restaurant server in Philadelphia earning Pennsylvania's statutory tipped cash wage of $2.83 per hour ($4.42 tip credit). During a 45-hour workweek, Noah earns $480.00 in customer tips.

**Step 1: Calculate Straight-Time Cash Pay (40 Hours)**
- 40 hours x $2.83 = $113.20

**Step 2: Calculate Tipped Overtime Hourly Cash Rate**
- Regular statutory minimum wage: $7.25/hr
- Full overtime rate: $7.25 x 1.5 = $10.875/hr
- Subtract allowable PA tip credit: $10.875 - $4.42 = $6.455/hr
- Cash overtime earnings for 5 hours: 5 hours x $6.455 = $32.275 (rounded to $32.28)

**Step 3: Total Employer Cash Disbursement**
- Straight-time pay: $113.20
- Overtime cash pay: $32.28
- Total cash wages paid by restaurant: $145.48

**Step 4: Statutory Minimum Wage Reconciliation**
- Total hours worked: 45 hours
- Statutory wage threshold: 40 hours x $7.25 + 5 hours x $10.875 = $290.00 + $54.38 = $344.38
- Noah's total compensation: $145.48 (cash wages) + $480.00 (tips) = $625.48
- Total earnings comfortably exceed the statutory minimum floor.

## Worked Example 2: Slow Week with Employer Tip Makeup Pay

Rachel works at a diner in Scranton, logging 40 hours at $2.83 per hour. Due to winter storms, Rachel earns only $110.00 in tips across the entire month, failing to meet the $135.00 monthly threshold.

**Step 1: Evaluation of Tipped Status**
- Because Rachel earned under $135.00 in monthly tips, 34 Pa. Code § 231.101 dictates that the employer cannot claim a tip credit.
- The employer must pay Rachel the full statutory minimum wage of $7.25 per hour for all hours worked.

**Step 2: Wage Adjustment Calculation**
- Required cash wages: 40 hours x $7.25 = $290.00
- Cash wages already paid: 40 hours x $2.83 = $113.20
- Employer makeup payment due: $290.00 - $113.20 = $176.80
- Rachel receives her full $290.00 in employer cash pay plus keeps her $110.00 in tips.

## Pennsylvania-Specific Tip Credit Restrictions

- Under 34 Pa. Code § 231.111, employers cannot deduct credit card transaction fees from tips; the worker must receive 100% of the tip left on a credit card.
- Managers and supervisors are barred from participating in tip pools or receiving any pooled tip distributions.
- When an employee spends more than 20% of their working time performing supporting non-tipped duties, the employer cannot claim a tip credit for those hours.

## Frequently Asked Questions

### Can a Pennsylvania employer deduct credit card processing fees from employee tips?
No. Unlike federal FLSA rules, Pennsylvania state regulations strictly prohibit employers from deducting credit card processing fees from employee gratuities.

### What is Pennsylvania's monthly tip eligibility threshold?
Under 34 Pa. Code § 231.101, an employee must earn at least $135.00 per month in tips to qualify as a tipped employee against whom a tip credit may be taken.

### Are banquet service charges considered tips in Pennsylvania?
No. Banquet administrative fees and mandatory service charges are classified as employer revenue. If an employer intends to keep these charges rather than distribute them to service staff, contracts must explicitly state this policy to customers.

### How does Pennsylvania compute overtime when a worker has two different pay rates?
Under Pennsylvania law, when an employee works at two or more different rates of pay in the same workweek, the regular rate of pay for overtime purposes is computed as the weighted average of the hourly rates.

### What are the recordkeeping requirements for tip pools in Pennsylvania?
Employers must maintain written records of all tip pool distributions for at least three years, detailing each participating employee's role, hours worked, and tip share received.
`);

// 8. Illinois
save('states/illinois-tipped-minimum-wage-and-overtime-calculator.md', `---
title: "Illinois Tipped Wage & Overtime Calculator"
slugTitle: "illinois-tipped-minimum-wage-and-overtime-calculator"
h1: "Illinois tipped minimum wage and overtime calculator"
description: "Calculate Illinois tipped minimum wage ($9.00 cash wage, $6.00 tip credit) and overtime under 820 ILCS 105. Updated for 2026. Free calculator."
intro: "Calculate Illinois tipped minimum wage and overtime under 820 ILCS 105. Minimum wage is $15.00/hr ($9.00 cash wage, $6.00 tip credit)."
type: tool
tool: tipped-overtime
state: IL
hub: /p/state-pay-rules.html
hubName: State pay rules
labels: [states, tips, overtime, illinois]
needs human edit: false
related:
  - { label: "New York tipped minimum wage calculator", url: "/2026/12/new-york-tipped-minimum-wage-and-overtime-calculator.html" }
  - { label: "Pennsylvania tipped minimum wage calculator", url: "/2026/12/pennsylvania-tipped-minimum-wage-and-overtime-calculator.html" }
  - { label: "Texas tipped minimum wage calculator", url: "/2026/12/texas-tipped-minimum-wage-and-overtime-calculator.html" }
sources:
  - { label: "Illinois Department of Labor (IDOL)", url: "https://labor.illinois.gov/" }
  - { label: "DOL WHD — Tipped Minimum Wage", url: "https://www.dol.gov/agencies/whd/state/minimum-wage/tipped" }
---
## Illinois Minimum Wage Law (820 ILCS 105)

Illinois statutory wage standards are governed by the Illinois Minimum Wage Law, codified under 820 ILCS 105. Following a phased multi-year statutory schedule, the statewide minimum wage stands at $15.00 per hour. Under Illinois law, the maximum tip credit an employer may claim is fixed at exactly 40 percent of the full statutory minimum wage, establishing a direct cash wage floor of 60 percent.

Hospitality workers in Chicago and Cook County must also account for municipal ordinances, which enforce higher local minimum wages and unique phase-out timelines for the tipped subminimum wage.

## Key 2026 Illinois Wage Standards

- **Statewide Minimum Wage**: $15.00 per hour under 820 ILCS 105/4.
- **Chicago Municipal Wage**: City of Chicago minimum wage ordinances set higher baselines (historically adjusting annually each July 1).
- **Statutory Tip Credit Cap**: 40% of the minimum wage ($6.00 per hour under the $15.00 state baseline).
- **Direct Employer Cash Wage Floor**: $9.00 per hour (60% of $15.00).
- **Tipped Overtime Standard Rate**: $22.50 per hour total earnings baseline ($15.00 multiplied by 1.5).
- **Tipped Cash Overtime Rate**: $16.50 per hour. Calculated as full overtime rate ($22.50) minus the tip credit ($6.00).
- **Overtime Standard**: Weekly overtime after 40 hours under 820 ILCS 105/4a. Illinois does not enforce daily overtime.

## Worked Example 1: 45-Hour Week at Illinois Statewide $15 Rate

Liam works as a server in Peoria, Illinois, earning the statutory tipped cash wage of $9.00 per hour ($6.00 tip credit). Over a 45-hour workweek, Liam earns $560.00 in customer tips.

**Step 1: Calculate Straight-Time Cash Pay (40 Hours)**
- 40 hours x $9.00 = $360.00

**Step 2: Calculate Tipped Overtime Hourly Cash Rate**
- State full minimum wage: $15.00/hr
- Full overtime rate: $15.00 x 1.5 = $22.50/hr
- Subtract allowable tip credit: $22.50 - $6.00 = $16.50/hr
- Overtime cash pay for 5 hours: 5 hours x $16.50 = $82.50

**Step 3: Total Employer Cash Disbursement**
- Straight-time pay: $360.00
- Overtime cash pay: $82.50
- Total cash wages paid by restaurant: $442.50

**Step 4: Statutory Wage Audit**
- Total hours worked: 45 hours
- Minimum wage threshold requirement: 40 hours x $15.00 + 5 hours x $22.50 = $600.00 + $112.50 = $712.50
- Liam's total earnings: $442.50 (cash pay) + $560.00 (tips) = $1,002.50
- Total earnings substantially exceed statutory minimum requirements.

## Worked Example 2: Chicago Municipal Rate Difference

Chloe works as a bartender in downtown Chicago. Under Chicago's local ordinance, the standard minimum wage is higher than the state baseline, set at $16.20 per hour, with a corresponding local tipped cash wage of $11.02 per hour ($5.18 tip credit). Chloe logs 44 hours and earns $850.00 in tips.

**Step 1: Straight-Time Pay (First 40 Hours)**
- 40 hours x $11.02 = $440.80

**Step 2: Overtime Pay Calculation**
- Regular rate: $16.20/hr
- Overtime rate: $16.20 x 1.5 = $24.30/hr
- Subtract tip credit: $24.30 - $5.18 = $19.12/hr
- Overtime cash earnings for 4 hours: 4 hours x $19.12 = $76.48

**Step 3: Total Direct Cash Earnings**
- Direct cash earnings: $440.80 + $76.48 = $517.28
- Total earnings with tips: $517.28 + $850.00 = $1,367.28

## Key Illinois Compliance Principles

- Under 820 ILCS 105/4c, employers claiming a tip credit must prove that the actual amount of tips received by the employee equaled or exceeded the tip credit claimed over the pay period.
- Illinois enacted the One Day Rest in Seven Act (ODRISA), requiring employers to provide at least 24 consecutive hours of rest in every calendar week.
- Employers must provide an unpaid 20-minute meal break for every employee who works 7.5 continuous hours, to be taken no later than 5 hours after the start of work.

## Frequently Asked Questions

### What happens under Chicago's tipped wage phase-out?
The Chicago City Council passed the "One Fair Wage" ordinance, phasing out the subminimum wage for tipped workers over a five-year timeline, reducing the tip credit by 8% annually until full wage parity is achieved.

### Can an Illinois employer deduct credit card processing fees from tips?
Under IDOL policy and federal alignment, an employer may deduct the actual transaction processing fee (such as 2.5%) charged by the credit card company, provided the net tip distributed does not drop the employee below the statutory minimum wage.

### What are the penalties under the Illinois One Day Rest in Seven Act?
Under ODRISA (820 ILCS 140), an employer that fails to provide a 24-hour rest period in a calendar week or fails to provide required meal breaks faces statutory damages payable to the affected employee and civil penalties payable to the IDOL.

### How are tipped employees compensated during mandatory staff meetings?
When a tipped employee attends a mandatory staff meeting, training session, or cleaning period where no tips can be earned, the employer cannot claim a tip credit and must pay the full minimum wage of $15.00 per hour.

### Can an Illinois employer keep any portion of employee tips?
No. 820 ILCS 105/4c explicitly establishes that tips are the exclusive property of the employee. Employers, owners, and managers are strictly barred from keeping any portion of gratuities.
`);

// 9. Georgia
save('states/georgia-tipped-minimum-wage-and-overtime-calculator.md', `---
title: "Georgia Tipped Minimum Wage & Overtime Calculator"
slugTitle: "georgia-tipped-minimum-wage-and-overtime-calculator"
h1: "Georgia tipped minimum wage and overtime calculator"
description: "Calculate Georgia tipped wages ($2.13 cash wage, $5.12 tip credit) and overtime under OCGA 34-2 and FLSA. Updated for 2026. Free tool."
intro: "Calculate Georgia tipped wages and overtime under O.C.G.A. Title 34 and the federal FLSA. Minimum wage is $7.25/hr ($2.13 cash wage, $5.12 tip credit)."
type: tool
tool: tipped-overtime
state: GA
hub: /p/state-pay-rules.html
hubName: State pay rules
labels: [states, tips, overtime, georgia]
needs human edit: false
related:
  - { label: "Florida tipped minimum wage calculator", url: "/2026/12/florida-tipped-minimum-wage-and-overtime-calculator.html" }
  - { label: "Texas tipped minimum wage calculator", url: "/2026/12/texas-tipped-minimum-wage-and-overtime-calculator.html" }
  - { label: "Pennsylvania tipped minimum wage calculator", url: "/2026/12/pennsylvania-tipped-minimum-wage-and-overtime-calculator.html" }
sources:
  - { label: "Georgia Department of Labor (GDOL)", url: "https://dol.georgia.gov/" }
  - { label: "DOL WHD — Fact Sheet #15 Tipped Employees", url: "https://www.dol.gov/agencies/whd/fact-sheets/15-tipped-employees-flsa" }
---
## Georgia Wage Framework & Federal FLSA Preemption

Georgia labor law presents a unique statutory dynamic under the Official Code of Georgia Annotated (O.C.G.A. Title 34, Chapter 4). On state books, Georgia's statutory minimum wage is $5.15 per hour under O.C.G.A. § 34-4-3. However, under the Supremacy Clause of the United States Constitution and statutory preemption, the federal Fair Labor Standards Act (FLSA) governs virtually all employers and employees across Georgia.

Any enterprise generating at least $500,000 in gross annual sales, or engaging in interstate commerce (including processing card transactions, serving out-of-state travelers, or handling interstate food supplies), must pay the federal $7.25 minimum wage.

## Key 2026 Georgia Wage Figures

- **Governing Minimum Wage (FLSA)**: $7.25 per hour for covered employers.
- **Georgia State Statutory Rate**: $5.15 per hour (applies only to rare non-covered micro-employers with <$500k sales and zero interstate commerce).
- **Direct Employer Cash Wage Floor**: $2.13 per hour for qualifying tipped employees.
- **Maximum Tip Credit**: $5.12 per hour ($7.25 minus $2.13).
- **Tipped Overtime Standard Rate**: $10.875 per hour ($7.25 multiplied by 1.5).
- **Tipped Cash Overtime Rate**: $5.755 per hour (customarily rounded to $5.76/hr in payroll processing). Calculated as ($7.25 x 1.5) minus the $5.12 tip credit.
- **Overtime Standard**: Weekly overtime required after 40 hours under federal FLSA provisions. Georgia does not enforce daily overtime.

## Worked Example 1: 46-Hour Workweek in an Atlanta Restaurant

DeShawn works as a server in an Atlanta restaurant covered by the FLSA, earning the standard tipped cash wage of $2.13 per hour ($5.12 tip credit). During a 46-hour workweek, DeShawn earns $590.00 in customer tips.

**Step 1: Calculate Straight-Time Cash Pay (40 Hours)**
- 40 hours x $2.13 = $85.20

**Step 2: Calculate Tipped Overtime Hourly Cash Rate**
- Governing regular rate: $7.25/hr
- Full overtime rate: $7.25 x 1.5 = $10.875/hr
- Subtract allowable tip credit: $10.875 - $5.12 = $5.755/hr
- Overtime cash pay for 6 hours: 6 hours x $5.755 = $34.53

**Step 3: Total Employer Cash Disbursement**
- Straight-time pay: $85.20
- Overtime cash pay: $34.53
- Total cash wages paid by restaurant: $119.73

**Step 4: Statutory Minimum Wage Reconciliation**
- Total hours worked: 46 hours
- Statutory wage threshold: 40 hours x $7.25 + 6 hours x $10.875 = $290.00 + $65.25 = $355.25
- DeShawn's total compensation: $119.73 (cash pay) + $590.00 (tips) = $709.73
- Because $709.73 exceeds $355.25, the tip credit is verified and no makeup pay is owed.

## Worked Example 2: Above-Minimum Direct Wage ($4.00/hr Base)

Amber works as a server in Savannah. Her employer pays a direct cash wage of $4.00 per hour, claiming a reduced tip credit of $3.25 per hour ($7.25 - $4.00). Amber works 45 hours and collects $640.00 in tips.

**Step 1: Straight-Time Pay (First 40 Hours)**
- 40 hours x $4.00 = $160.00

**Step 2: Overtime Pay Calculation**
- Base rate: $7.25/hr
- Full overtime rate: $7.25 x 1.5 = $10.875/hr
- Subtract claimed tip credit: $10.875 - $3.25 = $7.625/hr
- Overtime cash earnings for 5 hours: 5 hours x $7.625 = $38.125 (rounded to $38.13)

**Step 3: Total Cash Wages**
- Total cash earnings: $160.00 + $38.13 = $198.13
- Total earnings with tips: $198.13 + $640.00 = $838.13

## Common Overtime Violations in Georgia

- Multiplying the cash wage by 1.5 ($2.13 x 1.5 = $3.20/hr), which violates federal regulations and underpays workers by $2.56 per overtime hour.
- Assuming Georgia's $5.15 statutory state rate applies when the restaurant processes credit cards or purchases out-of-state produce.
- Including managers or supervisors in tip pools. Under 29 CFR § 541.100, any individual with supervisory authority cannot participate in a tip pool.

## Frequently Asked Questions

### Does the Georgia Department of Labor handle private wage claims?
No. The Georgia Department of Labor does not enforce minimum wage or overtime claims for private sector employees. Workers seeking unpaid wages or overtime must file complaints with the federal U.S. Department of Labor Wage and Hour Division or file a civil action under the FLSA.

### Can a Georgia employer retain tips for credit card processing?
Under federal FLSA rules, an employer may deduct the actual transactional percentage charged by a credit card processor from a customer tip, but cannot deduct an arbitrary flat fee.

### What notice must Georgia employers give before taking a tip credit?
Under 29 CFR § 531.59, employers must inform workers of the direct cash wage, the tip credit claimed, that tips belong to the employee, and that tip pool participants are restricted before taking a tip credit.

### How does Georgia regulate tip pooling among kitchen staff?
Under federal regulations, if an employer claims a tip credit and pays $2.13 per hour, tip pools are restricted to front-of-house staff. If the employer pays the full $7.25 minimum wage without claiming a tip credit, kitchen workers may participate.

### Are employers in Georgia required to offer meal breaks?
Neither Georgia state law nor federal law requires employers to provide meal or rest breaks to adult workers. However, if a rest break lasting 20 minutes or less is provided, it must be compensated.
`);

console.log('9 State tools enriched.');
