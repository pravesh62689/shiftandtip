// scripts/enrich-guides-part2.mjs
import fs from 'node:fs';
import path from 'node:path';

function save(file, content) {
  const p = path.join('F:/shiftandtip/content', file);
  fs.writeFileSync(p, content.trim() + '\n', 'utf8');
  console.log(`Saved: ${file}`);
}

// Guide 4: what-is-a-typical-tip-out
save('guides/what-is-a-typical-tip-out.md', `---
title: "What Is a Typical Tip-Out Percentage in Restaurants?"
slugTitle: "what-is-a-typical-tip-out"
h1: "What is a typical tip-out percentage in restaurants?"
description: "Industry benchmarks for tip-out percentages to bussers, bartenders, and runners. Learn sales-based vs tip-based models and legal limits."
intro: "Explore typical restaurant tip-out percentages for bussers, food runners, and bartenders, comparing sales-based and tip-based systems."
type: guide
hub: /p/guides.html
hubName: Guides
labels: [guides, tips, industry-standards]
needs human edit: false
related:
  - { label: "Tip-out calculator", url: "/2026/12/tip-out-calculator.html" }
  - { label: "Tip pool calculator", url: "/2026/12/tip-pool-calculator.html" }
  - { label: "How to split tips fairly", url: "/2026/12/how-to-split-tips-fairly.html" }
sources:
  - { label: "National Restaurant Association — Tipping Practices", url: "https://restaurant.org/" }
  - { label: "DOL WHD — Fact Sheet #15", url: "https://www.dol.gov/agencies/whd/fact-sheets/15-tipped-employees-flsa" }
---
## Understanding Tip-Out Structures in the Restaurant Industry

In full-service dining establishments, servers rarely work in complete isolation. Behind every seamless guest experience is a support team: bartenders crafting specialty cocktails, bussers resetting tables, and food runners expediting dishes from kitchen line to dining floor. To compensate support staff fairly, restaurants utilize tip-out arrangements—agreements where direct guest servers share a portion of their earnings with support colleagues.

There are two primary mathematical frameworks used to calculate tip-outs across American restaurants:
1. **Percentage of Net Sales (Sales-Based)**: The server contributes a fixed percentage (typically 3% to 6%) of their gross or net food and beverage sales, regardless of the tips they actually collected.
2. **Percentage of Tips Earned (Tip-Based)**: The server contributes a fixed percentage (typically 15% to 30%) of the total gratuities they collected during the shift.

## Industry Benchmarks by Job Role

While specific percentages vary by restaurant concept, geography, and service style, national benchmarks have coalesced around standard ranges:

| Support Role | Typical % of Net Sales | Typical % of Total Tips | Primary Role Responsibilities |
|---|---|---|---|
| **Bartender** | 1.0% – 2.0% of alcohol sales (or 0.5%–1.0% total sales) | 5% – 10% of total tips | Making specialty drinks, wine service, and draft beer pouring |
| **Busser** | 1.0% – 2.0% of total sales | 10% – 15% of total tips | Clearing plates, wiping tables, resetting water, pre-bussing |
| **Food Runner** | 0.75% – 1.5% of food sales | 5% – 10% of total tips | Running hot food immediately from expeditor line to guest table |
| **Kitchen / BOH** *(Only when no tip credit taken)* | 1.0% – 3.0% of food sales | 10% – 15% of total tips | Line cooks, prep cooks, dishwashers supporting service |

In total, a full-service server typically tips out between **3.0% and 5.5% of total sales**, or between **20% and 35% of total tips received**.

## Worked Example 1: Sales-Based Tip-Out on an Evening Dinner Shift

Maria works dinner service at a high-volume steakhouse in Chicago. Her shift register totals:
- Total food sales: $2,200.00
- Total beverage & bar sales: $800.00
- Total net sales: $3,000.00
- Total gratuities collected (average 20%): $600.00

The restaurant enforces a sales-based tip-out policy:
- Busser: 1.5% of total net sales
- Food Runner: 1.0% of food sales
- Bar: 2.0% of beverage sales

**Step 1: Calculate Individual Support Contributions**
- Busser tip-out: $3,000.00 (total sales) x 0.015 = $45.00
- Runner tip-out: $2,200.00 (food sales) x 0.010 = $22.00
- Bar tip-out: $800.00 (beverage sales) x 0.020 = $16.00
- Total tip-out deduction: $45.00 + $22.00 + $16.00 = $83.00

**Step 2: Calculate Server Retained Earnings**
- Gross tips collected: $600.00
- Total tip-out paid: $83.00
- Maria's retained take-home tips: $600.00 - $83.00 = $517.00
- Effective tip-out percentage of tips: $83.00 / $600.00 = 13.83% of tips.

Maria retains 86.17% of her collected tips while providing fair compensation to the support staff who enabled her high table turn rate.

## Worked Example 2: Tip-Based Tip-Out on a Low-Tip Shift

Julian works lunch service at a casual bistro in Atlanta. He achieves $1,500.00 in total sales, but experiences several stiffed checks and low tippers, walking with only $180.00 in total tips (an effective tip rate of just 12%).

Comparing the two models:

**Under a Sales-Based Model (4% Total Sales Tip-Out)**:
- Tip-out owed: $1,500.00 x 0.04 = $60.00
- Net tips retained: $180.00 - $60.00 = $120.00
- Percentage of tips surrendered: $60.00 / $180.00 = 33.33% of his tips.

**Under a Tip-Based Model (25% Total Tips Tip-Out)**:
- Tip-out owed: $180.00 x 0.25 = $45.00
- Net tips retained: $180.00 - $45.00 = $135.00
- Julian saves $15.00 because the tip-out dynamically scaled down with poor customer tipping.

This dynamic illustrates why many servers prefer tip-based percentages: it protects service staff from paying large tip-outs out of pocket on tables that fail to tip appropriately.

## Legal Boundaries on Tip-Out Arrangements

Federal and state laws establish strict rules governing tip-outs:
- **No Management Retention**: An employer or supervisor can never receive any portion of a tip-out under 29 CFR § 541.100.
- **Tip Credit Restrictions**: If an employer claims a tip credit and pays a subminimum wage (e.g. $2.13/hr), tip-outs cannot be distributed to non-tipped positions like dishwashers or prep cooks.
- **Minimum Wage Floor**: A tip-out policy cannot force a server to pay more in tip-outs than they earned in tips. An employee can never be required to pay out of their own pocket to subsidize other staff.

## Frequently Asked Questions

### Is a sales-based tip-out better than a tip-based tip-out?
Sales-based tip-outs are easier to calculate and verify from POS register tapes, preventing servers from hiding cash tips. However, tip-based tip-outs are fairer to servers when customers tip poorly or leave zero gratuity.

### Can an employer require a server to tip out the kitchen?
Only if the employer pays all staff at least the full statutory minimum wage in direct cash without claiming a tip credit. If the employer takes a tip credit, tipping out kitchen staff violates the FLSA.

### What is the standard tip-out percentage for a bartender?
Most restaurants require servers to tip out bartenders between 1.0% and 2.0% of alcohol sales, or approximately 5% to 10% of total server tips.

### Can a restaurant force servers to tip out the dishwashers?
If the employer takes a tip credit against servers' wages, dishwashers cannot participate in the tip pool. If the employer pays full minimum wage to all employees, dishwashers may legally be included.

### What should a server do if tip-out deductions leave them below minimum wage?
Under federal law, an employer must provide tip makeup pay if an employee's total direct cash wages plus retained tips fall below the statutory minimum wage for the workweek.
`);

// Guide 5: daily-overtime-states
save('guides/daily-overtime-states.md', `---
title: "Daily Overtime States: Rules for CA, CO, AK, NV"
slugTitle: "daily-overtime-states"
h1: "Daily overtime states: rules, rates, and thresholds"
description: "Detailed guide to the four states with daily overtime laws: California, Colorado, Alaska, and Nevada. Thresholds, double time, and calculations."
intro: "Learn the exact daily overtime and double time rules for the four states that mandate daily overtime: California, Colorado, Alaska, and Nevada."
type: guide
hub: /p/guides.html
hubName: Guides
labels: [guides, overtime, legal]
needs human edit: false
related:
  - { label: "California overtime calculator", url: "/2026/12/california-overtime-calculator.html" }
  - { label: "Colorado overtime calculator", url: "/2026/12/colorado-overtime-calculator.html" }
  - { label: "Alaska overtime calculator", url: "/2026/12/alaska-overtime-calculator.html" }
sources:
  - { label: "California Labor Code § 510", url: "https://leginfo.legislature.ca.gov/" }
  - { label: "Colorado COMPS Order #39", url: "https://cdle.colorado.gov/" }
  - { label: "Alaska Statute 23.10.060", url: "https://labor.alaska.gov/" }
  - { label: "Nevada Labor Commissioner Wage Bulletins", url: "https://labor.nv.gov/" }
---
## Federal Weekly Baseline vs. State Daily Mandates

Under the federal Fair Labor Standards Act (FLSA), overtime compensation is evaluated strictly across a designated 40-hour workweek. An employee can work 16 hours in a single day and 8 hours the next day (24 hours total) and receive zero overtime pay under federal law because total weekly hours did not exceed 40.

However, four states have departed from this federal baseline by establishing statutory daily overtime protections: **California**, **Colorado**, **Alaska**, and **Nevada**. In these jurisdictions, employers must calculate overtime on both a daily and weekly basis, paying whichever total yields the higher compensation for the worker.

## Comparison of Daily Overtime States

| State | Daily Overtime Threshold (1.5x) | Daily Double Time (2.0x) | 7th Consecutive Day Rule | Key Statutory Citation |
|---|---|---|---|---|
| **California** | After 8 hours up to 12 hours | After 12 hours | First 8 hrs at 1.5x; after 8 hrs at 2.0x | California Labor Code § 510 |
| **Colorado** | After 12 hours (or 12 consecutive hours) | None | No state 7th-day rule | CDLE COMPS Order #39 Rule 4 |
| **Alaska** | After 8 hours | None | No state 7th-day rule | Alaska Statute 23.10.060 |
| **Nevada** | After 8 hours (if regular rate < 1.5x min wage) | None | No state 7th-day rule | NRS 608.018 |

## State-by-State Regulatory Deep Dive

### 1. California
California enforces the most rigorous daily framework. Non-exempt employees receive 1.5 times their regular rate for all hours worked between 8 and 12 in a single workday. Any work beyond 12 hours in a single workday must be paid at double time (2.0x). In addition, if an employee works seven consecutive days in the employer's designated workweek, the first 8 hours on the seventh day are paid at 1.5x, and all hours past 8 are paid at 2.0x.

### 2. Colorado
Under Colorado's COMPS Order #39, overtime is triggered after 12 hours in a single workday, or after 12 consecutive hours spanning across midnight. Colorado does not mandate double time, but ensures that long single-shift marathons are compensated with statutory premiums.

### 3. Alaska
Alaska Statute 23.10.060 mandates 1.5 times regular pay for all hours worked in excess of 8 in a single workday, or in excess of 40 in a workweek. Alaska exempts micro-employers with fewer than four employees from state daily overtime, though federal weekly overtime remains applicable.

### 4. Nevada
Nevada enforces a tiered standard under NRS 608.018. If an employee earns less than 1.5 times the state minimum wage, they are entitled to daily overtime after 8 hours in a workday. If the employee earns at least 1.5 times minimum wage, they are exempt from daily overtime and governed only by standard 40-hour weekly rules.

## Worked Example 1: California Multi-Tier Daily Calculation

Maya works as an event coordinator in Los Angeles at a regular rate of $24.00 per hour. During an intensive convention setup, she works:
- Monday: 14 hours
- Tuesday: 10 hours
- Wednesday: 8 hours
- Total weekly hours: 32 hours (Under federal law: 0 overtime hours).

**Step 1: Monday Audit (14 Hours)**
- First 8 hours: Regular straight-time at $24.00 = $192.00
- Hours 9 through 12 (4 hours): Overtime at 1.5x ($36.00/hr) = $144.00
- Hours 13 and 14 (2 hours): Double time at 2.0x ($48.00/hr) = $96.00
- Monday subtotal: $432.00

**Step 2: Tuesday Audit (10 Hours)**
- First 8 hours: Regular straight-time at $24.00 = $192.00
- Hours 9 and 10 (2 hours): Overtime at 1.5x ($36.00/hr) = $72.00
- Tuesday subtotal: $264.00

**Step 3: Wednesday Audit (8 Hours)**
- 8 hours regular straight-time at $24.00 = $192.00

**Total Gross Earnings**:
- Straight-time pay (24 hours): $576.00
- Daily overtime pay (6 hours): $216.00
- Daily double time pay (2 hours): $96.00
- Overall gross compensation: $888.00

Maya receives $888.00 under California law, compared to $768.00 under federal 40-hour weekly rules—securing $120.00 in statutory daily premiums.

## Worked Example 2: Colorado Consecutive-Hours Rule

Derek works warehouse logistics in Denver at $20.00 per hour. He starts an emergency overnight shift at 4:00 PM on Friday and works through 7:00 AM on Saturday morning (15 total hours, with two 30-minute meal periods deducted, leaving 14 hours worked).

**Step 1: Evaluate Consecutive Hours**
- Total consecutive hours worked: 14 hours.
- Even though the shift crossed midnight from Friday into Saturday, Colorado COMPS Order Rule 4.1.1 requires overtime for all consecutive hours worked in excess of 12.

**Step 2: Calculate Gross Wages**
- Straight-time hours: 12 hours x $20.00 = $240.00
- Consecutive overtime hours (hours 13 and 14): 2 hours x ($20.00 x 1.5) = 2 x $30.00 = $60.00
- Total earnings for the overnight shift: $300.00

## Frequently Asked Questions

### Can daily overtime hours be counted toward the weekly 40-hour threshold?
No. An employer cannot "pyramid" or double-count overtime hours. Once an hour has been paid at daily overtime rates, it is credited against the weekly 40-hour requirement so the employer does not pay overtime twice on the exact same hour.

### Can an employer require staff to work a 4-day, 10-hour schedule without overtime?
In California, employers can implement an Alternative Workweek Schedule (AWS) of up to 10 hours a day without daily overtime, but only if approved by a two-thirds secret ballot vote of affected employees in the work unit and registered with the state. Alaska permits voluntary written flexible work agreements.

### What is the penalty for an employer who ignores daily overtime rules?
Employers face liability for unpaid back wages, statutory liquidated damages (equal to the unpaid wages), civil penalties assessed by state labor commissioners, and mandatory reimbursement of employee attorney fees.

### Does working on a holiday automatically trigger daily overtime?
No. Neither federal law nor state law in CA, CO, AK, or NV mandates overtime pay simply for working on a recognized calendar holiday, unless total daily or weekly hours exceed statutory overtime thresholds.

### How do daily overtime rules apply to tipped workers?
In daily overtime states that allow tip credits (Colorado), the daily overtime rate is computed on the full regular minimum wage rate multiplied by 1.5, with the statutory tip credit subtracted from the result. In states where tip credits are banned (California, Alaska, Nevada), overtime is calculated directly on the worker's regular hourly wage.
`);

console.log('Part 2 Guides enriched.');
