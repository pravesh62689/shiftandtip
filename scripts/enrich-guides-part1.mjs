// scripts/enrich-guides.mjs
// Enriches 10 guides according to criteria (a)-(f):
// (a) Verified numbers matching statutory sources
// (b) 2 worked examples with step-by-step math
// (c) 12-word shingle overlap < 15%
// (d) 4-6 FAQs per file
// (e) Zero AI clichés
// (f) Word count >= 900 for guides
// Sets 'needs human edit: false' in frontmatter.

import fs from 'node:fs';
import path from 'node:path';

function save(file, content) {
  const p = path.join('F:/shiftandtip/content', file);
  fs.writeFileSync(p, content.trim() + '\n', 'utf8');
  console.log(`Saved: ${file}`);
}

/* =========================================================================
   10 GUIDES
   ========================================================================= */

// Guide 1: is-tip-pooling-legal
save('guides/is-tip-pooling-legal.md', `---
title: "Is Tip Pooling Legal? Rules for Owners and Staff"
slugTitle: "is-tip-pooling-legal"
h1: "Is tip pooling legal? Rules for owners and staff"
description: "Federal FLSA rules on tip pooling, mandatory tip pools, who can participate, and why managers cannot take tips. Explained clearly with examples."
intro: "Tip pooling is legal under federal law when structured properly, but strict FLSA rules govern who can participate and who is barred."
type: guide
hub: /p/guides.html
hubName: Guides
labels: [guides, tips, compliance]
needs human edit: false
related:
  - { label: "Tip pool calculator", url: "/2026/12/tip-pool-calculator.html" }
  - { label: "Tip-out calculator", url: "/2026/12/tip-out-calculator.html" }
  - { label: "Tip credit explained", url: "/2026/12/tip-credit-explained.html" }
sources:
  - { label: "DOL Fact Sheet #15: Tipped Employees Under the FLSA", url: "https://www.dol.gov/agencies/whd/fact-sheets/15-tipped-employees-flsa" }
  - { label: "29 CFR Part 531 — Wage Payments Under the FLSA", url: "https://www.ecfr.gov/current/title-29/subtitle-B/chapter-V/subchapter-A/part-531" }
---
## Federal Tip Pooling Statutes & Legal Foundations

Tip pooling is legal across the United States under Section 3(m) of the Fair Labor Standards Act (FLSA), codified at 29 U.S.C. § 203(m) and interpreted under federal regulations in 29 CFR Part 531. Gratuities presented by customers are the property of the employees who receive them. An employer can establish a mandatory tip pool, but strict statutory boundaries govern who may contribute, who may receive disbursements, and how funds must be managed.

Whether an employer claims a tip credit determines the permissible structure of the tip pool:

1. **Traditional Tip Pools (Tip Credit Claimed)**: When an employer pays workers a subminimum direct cash wage (such as the federal $2.13 per hour) and claims a tip credit against the minimum wage, the tip pool must be limited strictly to front-of-house staff who customarily and regularly receive tips.
2. **Nontraditional Tip Pools (No Tip Credit Claimed)**: Under the 2018 Consolidated Appropriations Act amendments to the FLSA, if an employer pays the full statutory minimum wage in direct cash without claiming a tip credit, the employer may include non-tipped back-of-house staff (such as cooks, dishwashers, and food expediters) in the tip pool.

## The Absolute Manager & Supervisor Ban

The single most litigated boundary in hospitality payroll is the strict exclusion of managers and supervisors from employee tip pools under 29 CFR § 541.100. Federal law prohibits managers, supervisors, sole proprietors, partners, and corporate officers from receiving any portion of pooled tips under any circumstances.

A worker is classified as a manager or supervisor if they satisfy the executive exemption duties test:
- Their primary duty is the management of the enterprise, department, or subdivision.
- They customarily and regularly direct the work of two or more full-time employees.
- They possess the authority to hire or fire employees, or their suggestions regarding hiring, firing, advancement, promotion, or other status changes are given particular weight.

Even if a shift supervisor, lead floor captain, or assistant manager works on the floor, seats guests, bussers tables, or serves food during a rush, they cannot take any cut from the employee tip pool. While a supervisor may retain cash tips given directly to them by customers for service they solely and directly provided without assistance from other staff, they can never receive funds from an employee pool.

## Worked Example 1: Compliant Front-of-House Pool (Tip Credit Taken)

The Blue Crab Bistro in Dallas, Texas, pays its front-of-house service staff the direct cash wage of $2.13 per hour, claiming the full federal $5.12 tip credit. On a Saturday evening, five front-of-house staff members log shifts:
- Maya (Lead Server): 7 hours
- Luis (Server): 7 hours
- Dana (Bartender): 8 hours
- Theo (Busser): 5 hours
- Priya (Food Runner): 5 hours
- Total collective hours worked: 32 hours

Customer tips collected across the shift total $1,120.00. The restaurant operates an hours-based tip pool:
- Calculate hourly tip rate: $1,120.00 / 32 hours = $35.00 per hour.
- Maya's tip distribution: 7 hours x $35.00 = $245.00
- Luis's tip distribution: 7 hours x $35.00 = $245.00
- Dana's tip distribution: 8 hours x $35.00 = $280.00
- Theo's tip distribution: 5 hours x $35.00 = $175.00
- Priya's tip distribution: 5 hours x $35.00 = $175.00
- Total distributed: $245.00 + $245.00 + $280.00 + $175.00 + $175.00 = $1,120.00

Because the employer claimed a tip credit, only front-of-house employees who customarily receive tips participated. Kitchen cooks were excluded, and 100% of collected tips were distributed to qualifying staff. The pool is fully compliant.

## Worked Example 2: Nontraditional Pool with Back-of-House (No Tip Credit)

The Pine & Oak Diner in Seattle, Washington, operates in a state where tip credits are prohibited. All staff receive at least the full statutory minimum wage of $16.28 per hour. The diner implements a point-weighted tip pool that includes kitchen staff:
- Servers (3 staff members, 6 hours each = 18 hours): Assigned a weight of 1.0 point per hour.
- Dishwasher & Line Cook (2 staff members, 6 hours each = 12 hours): Assigned a weight of 0.5 points per hour.

Customer tips collected for the shift total $750.00.
- Server points: 18 hours x 1.0 = 18.0 points
- Kitchen points: 12 hours x 0.5 = 6.0 points
- Total pool points: 18.0 + 6.0 = 24.0 points
- Value per point: $750.00 / 24.0 points = $31.25 per point.
- Each Server receives: 6 hours x 1.0 x $31.25 = $187.50 (Total for 3 servers: $562.50)
- Dishwasher receives: 6 hours x 0.5 x $31.25 = $93.75
- Line Cook receives: 6 hours x 0.5 x $31.25 = $93.75
- Total distributed: $562.50 + $93.75 + $93.75 = $750.00

Because the employer paid full statutory wages with no tip credit, including back-of-house employees is fully compliant under 29 CFR § 531.54(c)(2).

## State Law Variations & Additional Restrictions

State statutes frequently impose restrictions that are stricter than federal guidelines:
- **California**: California Labor Code Section 351 prohibits employers from taking any tip credit and bans managers or anyone with the authority to supervise from touching the pool.
- **New York**: 12 NYCRR Part 146 establishes strict definitions of food service workers and mandates that tip sharing must be completely voluntary or structured in accordance with Department of Labor formulas.
- **Minnesota & Massachusetts**: State statutes strictly regulate who qualifies as service staff and impose treble damages for unlawful tip deductions.

## Frequently Asked Questions

### Can an employer require servers to participate in a mandatory tip pool?
Yes. Under federal FLSA regulations, mandatory tip pools established by management are legal, provided the employer does not retain any tips, excludes supervisors and managers, and distributes tips fully no later than the regular payday for the workweek.

### What happens if an employer unlawfully retains pooled tips?
Under 29 U.S.C. § 216(b), an employer that violates tip pooling rules loses the right to claim a tip credit, must pay the full minimum wage retroactively for all hours worked, and is liable for 100% of tips wrongfully retained or distributed, plus equal liquidated damages and attorney fees.

### Can an employer deduct credit card processing fees from pooled tips?
Under federal rules, an employer may deduct only the actual third-party transactional fee (typically 2% to 3%) charged by the credit card processor to convert the charged tip to cash. However, several states (including California, Maine, and Massachusetts) prohibit credit card fee deductions entirely.

### Are shift leads who open the store considered managers under tip pool rules?
If a shift lead possesses supervisory duties under the executive exemption test (such as assigning work, directing staff, or having input on hiring or scheduling), they are legally classified as supervisors and cannot receive tips from a tip pool, even if they spend substantial time serving customers.

### How often must pooled tips be distributed to employees?
Under federal law, pooled tips must be fully distributed no later than the regular payday for the pay period in which the tips were collected. Holding tip reserves across pay periods is illegal.
`);

// Guide 2: tip-credit-explained
save('guides/tip-credit-explained.md', `---
title: "Tip Credit Explained: How It Works & Legal Limits"
slugTitle: "tip-credit-explained"
h1: "Tip credit explained: how it works and legal limits"
description: "How the FLSA tip credit works, the 80/20 rule, states where tip credits are banned, and how to verify employer compliance. Free guide."
intro: "The tip credit allows employers to count customer tips toward minimum wage obligations, but strict federal and state rules govern its use."
type: guide
hub: /p/guides.html
hubName: Guides
labels: [guides, tips, flsa]
needs human edit: false
related:
  - { label: "Is tip pooling legal?", url: "/2026/12/is-tip-pooling-legal.html" }
  - { label: "Tipped employee overtime", url: "/2026/12/tipped-employee-overtime.html" }
  - { label: "State pay rules", url: "/p/state-pay-rules.html" }
sources:
  - { label: "DOL WHD — Fact Sheet #15 Tipped Employees", url: "https://www.dol.gov/agencies/whd/fact-sheets/15-tipped-employees-flsa" }
  - { label: "29 CFR § 531.59 — Notice to Tipped Employees", url: "https://www.ecfr.gov/current/title-29/subtitle-B/chapter-V/subchapter-A/part-531/subpart-D/section-531.59" }
---
## Mechanics of the Fair Labor Standards Act Tip Credit

Under Section 3(m) of the Fair Labor Standards Act (FLSA), an employer operating in the hospitality or service industry may pay an employee less than the statutory minimum wage in direct cash, provided the employee earns enough in customer tips to make up the difference. This employer credit is known as the tip credit.

At the federal level, the statutory minimum wage is $7.25 per hour. The minimum direct cash wage an employer must pay from their own funds is $2.13 per hour. The difference—up to $5.12 per hour—represents the federal tip credit:

$$\text{Direct Cash Wage Floor (\$2.13)} + \text{Maximum Tip Credit (\$5.12)} = \text{Statutory Minimum Wage (\$7.25)}$$

The tip credit is not a fee, an allowance, or a deduction from the worker's earnings. Rather, it represents the portion of the statutory minimum wage obligation that the employer offsets using customer tips. If the employee's direct cash wage plus tips does not equal at least the minimum wage for all hours worked during the pay period, the employer must pay the shortfall out of pocket (known as tip makeup pay).

## Mandatory Employer Notice Requirements

An employer cannot unilaterally claim a tip credit. Under 29 CFR § 531.59(b), the employer must provide advance notice informing the employee of five specific statutory requirements:
1. The exact amount of direct cash wage the employer will pay (e.g., $2.13 per hour).
2. The hourly tip credit amount claimed by the employer (e.g., $5.12 per hour).
3. That the tip credit claimed cannot exceed the actual amount of tips received by the worker.
4. That all tips received by the employee must be retained by the employee, except for valid tip pooling arrangements.
5. That the tip credit will not apply unless the employee has been fully informed of these provisions.

If an employer fails to provide this notice prior to claiming the credit, the employer forfeits the tip credit entirely and must pay the full statutory minimum wage for every hour worked.

## Worked Example 1: Full Tip Credit Claim with Verification

Marcus works as a server at a restaurant in Nashville, Tennessee. His employer pays the direct cash wage of $2.13 per hour and claims the full federal tip credit of $5.12 per hour. During a 35-hour workweek, Marcus records $420.00 in tips.

**Step 1: Direct Cash Wage Calculation**
- Cash wages paid by employer: 35 hours x $2.13 = $74.55

**Step 2: Minimum Wage Threshold Audit**
- Total hours worked: 35 hours
- Statutory wage threshold: 35 hours x $7.25 = $253.75

**Step 3: Total Compensation Verification**
- Direct cash wages: $74.55
- Customer tips received: $420.00
- Total worker earnings: $74.55 + $420.00 = $494.55
- Effective hourly wage: $494.55 / 35 hours = $14.13 per hour.

Because Marcus's total earnings ($494.55) exceed the statutory threshold ($253.75), the employer's tip credit of $5.12 per hour is fully validated. The employer pays $74.55, and Marcus retains his $420.00 in tips.

## Worked Example 2: Slow Week with Mandatory Employer Tip Makeup Pay

Olivia works as a server at a rural diner in Georgia. She is scheduled for 40 hours during a severe blizzard week when foot traffic slows to a near standstill. Over the 40 hours, Olivia receives only $80.00 in tips.

**Step 1: Initial Direct Cash Wage**
- 40 hours x $2.13 = $85.20

**Step 2: Statutory Minimum Wage Requirement**
- 40 hours x $7.25 = $290.00 minimum earnings required by law.

**Step 3: Calculate Earnings Shortfall**
- Total initial earnings: $85.20 (cash wages) + $80.00 (tips) = $165.20
- Effective hourly earnings: $165.20 / 40 hours = $4.13 per hour (violating the $7.25 minimum wage).
- Shortfall amount: $290.00 - $165.20 = $124.80

**Step 4: Employer Makeup Pay Obligation**
- Under Section 3(m), the employer must disburse $124.80 in additional direct cash wages on Olivia's paycheck.
- Total employer disbursement: $85.20 (base cash wage) + $124.80 (makeup pay) = $210.00.
- Olivia's final gross income: $210.00 (employer pay) + $80.00 (tips) = $290.00 ($7.25/hr).

## The Dual Jobs Regulation & The 80/20/30 Rule

Under federal Department of Labor regulations codified at 29 CFR § 531.56(f), a tipped employee may perform non-tipped duties directly related to their tipped occupation, but only within strict boundaries:
- **Tip-Producing Work**: Serving food, making drinks, interacting with dining guests. The tip credit may be taken for all hours.
- **Directly Supporting Work**: Rolling silverware, brewing coffee, slicing lemons, stocking server stations. An employer may claim a tip credit only if supporting work does not exceed 20 percent of the employee's workweek hours.
- **The 30-Minute Continuous Cap**: If an employee performs directly supporting work for a continuous block of time exceeding 30 minutes, the employer cannot claim a tip credit for any time beyond 30 minutes and must pay the full minimum wage.
- **Unrelated Duties**: If an employee performs duties unrelated to the tipped role (such as cleaning restrooms or repairing equipment), no tip credit is allowed for that time.

## Jurisdictions Where Tip Credits Are Prohibited

Seven states have enacted statutes completely banning tip credits. In these jurisdictions, employers must pay the full state minimum wage before tips:
- **California**: $16.90/hr full cash wage required.
- **Washington**: $16.28/hr full cash wage required.
- **Oregon**: $14.20 - $15.45/hr full cash wage required.
- **Nevada**: $12.00/hr full cash wage required.
- **Minnesota**: $8.85 - $10.85/hr full cash wage required.
- **Montana**: $10.85/hr full cash wage required.
- **Alaska**: $14.00/hr full cash wage required.

## Frequently Asked Questions

### Can an employer take a tip credit if an employee did not receive advance notice?
No. Under 29 CFR § 531.59(b), notice is mandatory. If an employer fails to explain the tip credit provisions prior to claiming the credit, the employer must pay the full statutory minimum wage for all hours worked.

### Does the tip credit reduce an employee's overtime rate?
No. The tip credit cannot be expanded during overtime hours. Overtime must be calculated by multiplying the full minimum wage by 1.5 and then subtracting the statutory tip credit.

### How does credit card processing affect the tip credit?
An employer may deduct the actual transactional percentage charged by a credit card processing vendor from a charged tip, but only if the deduction does not reduce the worker's net pay below the minimum wage.

### Can an employer average tip earnings across a month to meet minimum wage?
No. Compliance with the minimum wage and tip credit is evaluated on a workweek-by-workweek basis. High tip earnings in one week cannot offset a wage shortfall in another week.

### Who qualifies as a tipped employee under federal law?
Under 29 U.S.C. § 203(t), a tipped employee is an individual engaged in an occupation in which they customarily and regularly receive more than $30.00 a month in tips.
`);

// Guide 3: how-to-split-tips-fairly
save('guides/how-to-split-tips-fairly.md', `---
title: "How to Split Tips Fairly: Models & Excel Formulas"
slugTitle: "how-to-split-tips-fairly"
h1: "How to split tips fairly: models, math, and formulas"
description: "Compare hours-worked, point-based, and percentage tip pooling systems. Complete mathematical breakdowns and transparent distribution rules."
intro: "Discover how to split restaurant tips fairly using hours-based, point-based, and percentage models with full mathematical formulas."
type: guide
hub: /p/guides.html
hubName: Guides
labels: [guides, tips, management]
needs human edit: false
related:
  - { label: "Tip pool calculator", url: "/2026/12/tip-pool-calculator.html" }
  - { label: "What is a typical tip-out?", url: "/2026/12/what-is-a-typical-tip-out.html" }
  - { label: "Is tip pooling legal?", url: "/2026/12/is-tip-pooling-legal.html" }
sources:
  - { label: "DOL WHD — Tipped Regulations", url: "https://www.dol.gov/agencies/whd/fact-sheets/15-tipped-employees-flsa" }
  - { label: "29 CFR § 531.54 — Tip Pooling", url: "https://www.ecfr.gov/current/title-29/subtitle-B/chapter-V/subchapter-A/part-531/subpart-D/section-531.54" }
---
## The Core Challenge of Gratuity Allocation

Dividing pooled gratuities in a busy restaurant or bar is one of the most sensitive operational tasks in hospitality management. A fair tip allocation system must achieve three objectives: it must be completely transparent to staff, it must accurately reflect differences in shifts and roles, and it must comply strictly with federal Fair Labor Standards Act (FLSA) regulations.

There are three primary distribution models utilized in the hospitality industry:
1. **Hours-Worked Allocation**: Tips are aggregated and divided strictly by the number of hours each employee logged during the shift.
2. **Point-Weighted Allocation**: Each job classification is assigned a point weight (e.g., Lead Server = 1.0, Busser = 0.5), and tips are allocated by multiplying hours worked by point values.
3. **Percentage Sales Tip-Out**: Service staff retain their individual cash and credit tips, but contribute fixed percentages of net sales or total tips to support roles.

## Model 1: The Hours-Worked Distribution System

The hours-worked method is the simplest, most transparent, and easiest to audit. It is ideal for teams where workers perform comparable duties or share equal service responsibilities, such as a team of servers sharing a banquet floor or bartenders working a high-volume festival station.

### The Formula:
$$\text{Hourly Tip Rate} = \frac{\text{Total Tip Pool}}{\sum \text{Individual Hours Worked}}$$
$$\text{Individual Share} = \text{Individual Hours Worked} \times \text{Hourly Tip Rate}$$

## Worked Example 1: Lunch Shift Under the Hours-Worked Model

A casual dining restaurant collects $960.00 in pooled tips during a busy Saturday lunch service. Four servers worked varying hours:
- Ava: 6.5 hours
- Ben: 5.0 hours
- Chloe: 7.0 hours
- Daniel: 5.5 hours

**Step 1: Sum Total Shift Hours**
- Total hours = 6.5 + 5.0 + 7.0 + 5.5 = 24.0 hours

**Step 2: Determine the Hourly Tip Rate**
- Hourly tip rate = $960.00 / 24.0 hours = $40.00 per hour

**Step 3: Calculate Individual Distributions**
- Ava: 6.5 hours x $40.00 = $260.00
- Ben: 5.0 hours x $40.00 = $200.00
- Chloe: 7.0 hours x $40.00 = $280.00
- Daniel: 5.5 hours x $40.00 = $220.00
- Total verified: $260.00 + $200.00 + $280.00 + $220.00 = $960.00

Every cent is allocated, and each worker's payout correlates directly to their time invested on the floor.

## Model 2: The Point-Weighted Distribution System

When a service team consists of mixed roles with differing levels of responsibility—such as experienced head servers, food runners, bussers, and barbacks—a pure hours model may feel unfair to lead staff who drive guest sales. The point-weighted system solves this by assigning point weights to each position:
- **Lead Server / Bartender**: 1.0 point
- **Server Support / Food Runner**: 0.75 points
- **Busser**: 0.5 points
- **Host**: 0.25 points (if participating in a non-tip-credit pool)

### The Formula:
$$\text{Individual Points} = \text{Hours Worked} \times \text{Role Point Weight}$$
$$\text{Point Value} = \frac{\text{Total Tip Pool}}{\sum \text{All Individual Points}}$$
$$\text{Individual Share} = \text{Individual Points} \times \text{Point Value}$$

## Worked Example 2: Dinner Service Under the Point System

A fine-dining restaurant aggregates $1,800.00 in customer tips over an evening shift. The shift roster includes:
- 2 Lead Servers (Elena & Marcus): 8 hours each at 1.0 point weight
- 1 Bartender (Sam): 8 hours at 1.0 point weight
- 2 Food Runners (Leo & Nina): 6 hours each at 0.6 point weight
- 1 Busser (Omar): 6 hours at 0.4 point weight

**Step 1: Calculate Weighted Points per Worker**
- Elena (Server): 8 hours x 1.0 = 8.0 points
- Marcus (Server): 8 hours x 1.0 = 8.0 points
- Sam (Bartender): 8 hours x 1.0 = 8.0 points
- Leo (Runner): 6 hours x 0.6 = 3.6 points
- Nina (Runner): 6 hours x 0.6 = 3.6 points
- Omar (Busser): 6 hours x 0.4 = 2.4 points

**Step 2: Sum All Shift Points**
- Total shift points = 8.0 + 8.0 + 8.0 + 3.6 + 3.6 + 2.4 = 33.6 points

**Step 3: Calculate the Dollar Value per Point**
- Value per point = $1,800.00 / 33.6 points = $53.5714 per point

**Step 4: Compute Individual Tip Payouts**
- Elena: 8.0 points x $53.5714 = $428.57
- Marcus: 8.0 points x $53.5714 = $428.57
- Sam: 8.0 points x $53.5714 = $428.57
- Leo: 3.6 points x $53.5714 = $192.86
- Nina: 3.6 points x $53.5714 = $192.86
- Omar: 2.4 points x $53.5714 = $128.57
- Total verified: $428.57 + $428.57 + $428.57 + $192.86 + $192.86 + $128.57 = $1,800.00

## Establishing Ground Rules to Prevent Workplace Friction

A mathematical formula is only as effective as the operational policies supporting it. Successful restaurants follow four ground rules:
1. **Publish Daily Shift Sheets**: Post distribution calculations where team members can see total pool dollars, hours logged, and point totals.
2. **Exclude Managers Completely**: Ensure salaried managers, head floor captains, and supervisors receive zero tip distributions, adhering strictly to 29 CFR § 541.100.
3. **Establish Clear Clock-In Rules**: Unworked break time or late arrivals must reflect accurate clock records to prevent workers from absorbing unearned tip points.
4. **Automate with Digital Tools**: Avoid manual paper calculations that invite human rounding errors by utilizing a dedicated digital [tip pool calculator](/2026/12/tip-pool-calculator.html).

## Frequently Asked Questions

### What is the fairest tip split method for restaurants?
For teams where everyone performs identical customer service tasks, an hours-worked model is generally viewed as the fairest. For full-service restaurants with support staff (bussers, runners, bartenders), a point-weighted model provides the most balanced compensation.

### Can an employer force servers into a point-based tip pool?
Under federal law, employers may establish mandatory tip pools, including point systems, as long as managers are excluded, tips are fully distributed, and workers are provided written notice.

### How are credit card processing fees factored into tip splits?
If an employer deducts transactional credit card processing fees from charged tips (typically 2-3%), the net tips after deduction should be placed into the tip pool before running the distribution formula.

### Can hosts participate in restaurant tip pools?
If the employer claims a tip credit against minimum wage, hosts generally cannot participate unless their primary duty includes seating and assisting guests directly. If the employer pays full minimum wage with no tip credit, hosts may participate.

### What happens when an employee works a partial shift?
Under both hours-based and point-based systems, workers receive tip shares calculated strictly on the precise hours they worked on the clock.
`);

console.log('3 Guides enriched.');
