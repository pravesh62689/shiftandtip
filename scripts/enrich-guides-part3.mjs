// scripts/enrich-guides-part3.mjs
import fs from 'node:fs';
import path from 'node:path';

function save(file, content) {
  const p = path.join('F:/shiftandtip/content', file);
  fs.writeFileSync(p, content.trim() + '\n', 'utf8');
  console.log(`Saved: ${file}`);
}

// Guide 6: shift-differential-overtime
save('guides/shift-differential-overtime.md', `---
title: "Shift Differential & Overtime: Blended Rate Math"
slugTitle: "shift-differential-overtime"
h1: "Shift differential and overtime: how to calculate blended regular rates"
description: "How to calculate regular rates of pay and overtime when working night, weekend, or hazard shift differentials under FLSA 29 CFR 778.207."
intro: "Learn how shift differentials affect your regular rate of pay and overtime calculations under federal FLSA regulations."
type: guide
hub: /p/guides.html
hubName: Guides
labels: [guides, overtime, payroll]
needs human edit: false
related:
  - { label: "Shift differential calculator", url: "/2026/12/shift-differential-calculator.html" }
  - { label: "Overtime calculator", url: "/2026/12/overtime-and-double-time-calculator.html" }
  - { label: "Daily overtime states", url: "/2026/12/daily-overtime-states.html" }
sources:
  - { label: "29 CFR Part 778 — Overtime Compensation", url: "https://www.ecfr.gov/current/title-29/subtitle-B/chapter-V/subchapter-B/part-778" }
  - { label: "DOL Fact Sheet #23: Overtime Pay Requirements", url: "https://www.dol.gov/agencies/whd/fact-sheets/23-overtime-pay-requirements" }
---
## The Legal Relationship Between Shift Differentials and Overtime

Many employers in healthcare, manufacturing, hospitality, and logistics offer shift differentials—additional hourly premiums paid to incentivize workers to cover less desirable shifts, such as night shifts, graveyard rotations, weekends, or hazardous duties. A common point of confusion is how these shift differentials interact with overtime obligations.

Under the federal Fair Labor Standards Act (FLSA), codified in 29 U.S.C. § 207(e) and detailed in 29 CFR § 778.207, shift differentials cannot be excluded from an employee's regular rate of pay. Overtime cannot be calculated simply by multiplying a worker's base day rate by 1.5. Instead, the employer must aggregate all straight-time earnings (including shift differentials) across all hours worked, divide by the total hours to determine the **blended regular rate of pay**, and calculate overtime premiums on that blended rate.

## The Mathematical Blended Rate Formula

Under 29 CFR § 778.115, when an employee in a single workweek works at two or more different rates of pay (or earns a shift differential on certain hours), the regular rate of pay is the weighted average:

$$\text{Total Straight-Time Compensation} = (\text{Day Hours} \times \text{Base Rate}) + (\text{Night Hours} \times \text{Differential Rate})$$
$$\text{Blended Regular Rate} = \frac{\text{Total Straight-Time Compensation}}{\text{Total Hours Worked (Straight + Overtime)}}$$
$$\text{Overtime Premium Due} = \text{Overtime Hours} \times (\text{Blended Regular Rate} \times 0.5)$$
$$\text{Total Gross Pay} = \text{Total Straight-Time Compensation} + \text{Overtime Premium Due}$$

## Worked Example 1: Day Shifts vs. Night Differential Shifts

Marcus works as an acute care nurse at a hospital in Ohio. His base day wage is $30.00 per hour, but the hospital pays a $4.00 per hour night shift differential ($34.00/hr) for all hours worked between 7:00 PM and 7:00 AM. Over a pay week, Marcus logs:
- 24 hours on day shifts at $30.00/hr
- 24 hours on night shifts at $34.00/hr
- Total hours worked: 48 hours (40 straight-time + 8 weekly overtime)

**Step 1: Calculate Total Straight-Time Earnings**
- Day shift earnings: 24 hours x $30.00 = $720.00
- Night shift earnings: 24 hours x $34.00 = $816.00
- Total straight-time earnings: $720.00 + $816.00 = $1,536.00

**Step 2: Compute the Blended Regular Rate of Pay**
- Total straight-time earnings: $1,536.00
- Total hours worked: 48 hours
- Blended Regular Rate: $1,536.00 / 48 hours = $32.00 per hour

**Step 3: Calculate the Half-Time Overtime Premium**
- Because straight-time pay ($32.00/hr) was already paid for all 48 hours in Step 1, the overtime hours are due an additional half-time premium (0.5x):
- Overtime premium: 8 overtime hours x ($32.00 x 0.5) = 8 x $16.00 = $128.00

**Step 4: Total Gross Pay**
- Total straight-time earnings: $1,536.00
- Overtime premium: $128.00
- Total gross earnings: $1,664.00

*(Note: Alternatively calculated as 40 straight hours x $32.00 [$1,280.00] + 8 overtime hours x $48.00 [$384.00] = $1,664.00).*

If the hospital had illegally computed overtime on Marcus's $30.00 base rate, his overtime premium would have been only 8 x $15.00 = $120.00, shortchanging him on statutory compensation.

## Worked Example 2: Flat Weekly Shift Differential

Elena works at a distribution warehouse in Pennsylvania earning a base wage of $20.00 per hour. She receives a flat $100.00 weekly attendance and night-shift incentive bonus. Elena works 50 hours during the week.

**Step 1: Aggregate All Straight-Time Compensation**
- Hourly base earnings: 50 hours x $20.00 = $1,000.00
- Shift bonus: $100.00
- Total straight-time pay: $1,000.00 + $100.00 = $1,100.00

**Step 2: Determine Blended Regular Rate**
- Regular rate: $1,100.00 / 50 hours = $22.00 per hour

**Step 3: Calculate Overtime Premium**
- 10 overtime hours x ($22.00 x 0.5) = 10 x $11.00 = $110.00

**Step 4: Total Gross Pay**
- Total gross earnings: $1,100.00 + $110.00 = $1,210.00

## Frequent Payroll Compliance Errors

- Calculating overtime strictly on the lowest daytime rate rather than blending the differential.
- Treating shift differentials as discretionary bonuses; non-discretionary shift premiums must always be included in the regular rate.
- Applying overtime premiums only to the hours worked on the night shift while excluding day hours from the weighted average.

## Frequently Asked Questions

### Can an employer pay overtime at the rate in effect when the overtime occurred?
Under FLSA Section 7(g)(2), an employer and employee may agree in advance of the work that overtime will be paid at 1.5 times the bona fide hourly rate in effect during the specific overtime hours, provided the agreement is established prior to performance and meets statutory requirements. Otherwise, the weighted blended rate must be used.

### Do weekend differentials have to be included in the regular rate?
Yes. Any differential paid for working specific shifts, weekend days, holidays, or undesirable hours is classified as non-discretionary wage compensation and must be factored into the regular rate of pay.

### What is the difference between straight-time pay and the half-time premium?
When calculating overtime via the weighted average method, the straight-time hourly rate has already been paid for all hours worked. Therefore, the additional overtime obligation is 0.5 times the regular rate, yielding the full 1.5x total compensation.

### How do non-discretionary bonuses affect shift differential overtime?
Any production bonus, efficiency incentive, or non-discretionary bonus must be added to shift differential earnings before dividing by total hours to find the true regular rate.

### Can shift differentials be offset against statutory overtime pay?
No. An employer cannot substitute a shift differential in place of mandatory 1.5x overtime premiums. Both the shift differential and the statutory overtime premium must be paid.
`);

// Guide 7: tipped-employee-overtime
save('guides/tipped-employee-overtime.md', `---
title: "Tipped Employee Overtime: FLSA Rules & Calculation"
slugTitle: "tipped-employee-overtime"
h1: "Tipped employee overtime: the complete FLSA calculation guide"
description: "How to correctly calculate overtime for tipped employees under federal FLSA regulations. Avoid the common 1.5x cash wage mistake."
intro: "Calculate tipped employee overtime under federal FLSA rules. Understand why multiplying cash wage by 1.5 is illegal wage underpayment."
type: guide
hub: /p/guides.html
hubName: Guides
labels: [guides, tips, overtime, flsa]
needs human edit: false
related:
  - { label: "Tipped overtime calculator", url: "/2026/12/tipped-overtime-calculator.html" }
  - { label: "Tip credit explained", url: "/2026/12/tip-credit-explained.html" }
  - { label: "State pay rules", url: "/p/state-pay-rules.html" }
sources:
  - { label: "29 CFR § 531.60 — Overtime Payments", url: "https://www.ecfr.gov/current/title-29/subtitle-B/chapter-V/subchapter-A/part-531/subpart-D/section-531.60" }
  - { label: "DOL WHD — Fact Sheet #15", url: "https://www.dol.gov/agencies/whd/fact-sheets/15-tipped-employees-flsa" }
---
## The Universal Tipped Overtime Error

In the restaurant and hospitality sectors, one payroll mistake accounts for more federal wage and hour violations than almost any other: **multiplying the employee's direct cash wage by 1.5**.

Under federal law, the tipped cash wage is $2.13 per hour, and the maximum tip credit is $5.12 per hour, creating the $7.25 federal minimum wage. Untrained managers frequently assume that overtime pay for a server is simply:
$$\$2.13 \times 1.5 = \$3.195 \quad \text{(ILLEGAL UNDERPAYMENT)}$$

Under federal regulations codified at **29 CFR § 531.60**, this calculation is illegal. The Fair Labor Standards Act strictly mandates that an employer cannot expand the tip credit during overtime hours. The tip credit remains capped at the standard statutory maximum, and overtime must be computed on the **full statutory regular rate**.

## The Mandated Federal Formula

Under 29 CFR § 531.60, calculating overtime for a tipped employee requires three steps:

$$\text{Step 1: Full Overtime Rate} = \text{Full Statutory Minimum Wage} \times 1.5$$
$$\text{Step 2: Tipped Overtime Cash Rate} = \text{Full Overtime Rate} - \text{Allowable Tip Credit}$$
$$\text{Step 3: Total Cash Owed} = (\text{Regular Hours} \times \text{Direct Cash Wage}) + (\text{Overtime Hours} \times \text{Tipped Cash Overtime Rate})$$

Under federal baselines ($7.25 minimum wage, $5.12 tip credit, $2.13 cash wage):
- Full overtime rate: $\$7.25 \times 1.5 = \$10.875$ per hour.
- Subtract tip credit: $\$10.875 - \$5.12 = \mathbf{\$5.755}$ per hour (customarily rounded to **$5.76/hr**).

An employer paying only $3.20 per hour instead of $5.76 per hour is shortchanging the worker by **$2.56 per overtime hour**, exposing the business to mandatory liquidated damages and back pay liabilities.

## Worked Example 1: 48-Hour Workweek at Federal Minimums

Jessica works as a server in San Antonio, Texas. She is paid the federal direct cash wage of $2.13 per hour, with her employer claiming the $5.12 tip credit. Over a 48-hour workweek, Jessica earns $720.00 in customer tips.

**Step 1: Straight-Time Cash Wages (First 40 Hours)**
- 40 hours x $2.13 = $85.20

**Step 2: Tipped Overtime Cash Rate**
- Full regular rate: $7.25/hr
- Full overtime rate: $7.25 x 1.5 = $10.875/hr
- Subtract allowable tip credit: $10.875 - $5.12 = $5.755/hr
- Overtime cash pay for 8 hours: 8 hours x $5.755 = $46.04

**Step 3: Total Employer Cash Disbursement**
- Straight-time pay: $85.20
- Overtime pay: $46.04
- Total direct cash wages: $85.20 + $46.04 = $131.24

**Step 4: Statutory Wage Audit**
- Total hours worked: 48 hours
- Minimum legal earnings requirement: 40 hours x $7.25 + 8 hours x $10.875 = $290.00 + $87.00 = $377.00
- Jessica's total earnings: $131.24 (cash wages) + $720.00 (tips) = $851.24
- Since $851.24 far exceeds $377.00, the tip credit is fully verified.

## Worked Example 2: State with Higher Minimum Wage (Florida)

Carlos works as a server in Tampa, Florida, where the state minimum wage is $15.00 per hour and the statutory tip credit is capped at $3.02 per hour, creating a direct cash wage of $11.98 per hour. Carlos works 46 hours and collects $650.00 in tips.

**Step 1: Straight-Time Pay (First 40 Hours)**
- 40 hours x $11.98 = $479.20

**Step 2: Overtime Hourly Cash Rate**
- Base rate: $15.00/hr
- Full overtime rate: $15.00 x 1.5 = $22.50/hr
- Subtract Florida tip credit: $22.50 - $3.02 = $19.48/hr cash overtime rate
- Overtime cash pay for 6 hours: 6 hours x $19.48 = $116.88

**Step 3: Total Employer Cash Pay**
- Total cash wages paid by restaurant: $479.20 + $116.88 = $596.08
- Total earnings with tips: $596.08 + $650.00 = $1,246.08

## State Variations on Tipped Overtime

- **No Tip Credit States**: In California, Alaska, Washington, Nevada, Oregon, and Montana, tip credits are prohibited. Overtime is simply calculated as the employee's direct hourly wage multiplied by 1.5.
- **Fixed Tip Credit States**: In Florida ($3.02 credit) and Colorado ($3.02 credit), the tip credit is fixed by statute, resulting in higher cash overtime rates as minimum wages increase.

## Statutory Damages and Enforcement Mechanisms

Under Section 16(b) of the Fair Labor Standards Act (29 U.S.C. § 216(b)), an employer that calculates tipped overtime incorrectly is liable to the affected employee for the full amount of unpaid overtime compensation, plus an equal amount in mandatory liquidated damages (double damages). In addition, prevailing employees are entitled to statutory reimbursement of their reasonable attorney fees and court costs.

Because federal wage and hour claims carry a two-year statute of limitations (extending to three years for willful violations under 29 U.S.C. § 255), systematic miscalculation of tipped overtime across a restaurant staff can quickly accumulate substantial financial liability. Hospitality operators must ensure automated payroll software is explicitly configured with the FLSA three-step formula rather than relying on standard 1.5x multiplier defaults.

## Frequently Asked Questions

### Can an employer increase the tip credit during overtime hours?
No. Under 29 CFR § 531.60, an employer cannot claim a higher tip credit on overtime hours than on straight-time hours. The tip credit remains capped at the statutory straight-time maximum.

### Why is multiplying the cash wage by 1.5 considered wage theft?
Because doing so improperly multiplies the tip credit by 1.5, allowing the employer to offset more of the overtime obligation with customer tips. Overtime is owed on the full regular rate.

### How does tipped overtime work when an employee earns different base rates?
When an employee works multiple tipped or non-tipped roles at different hourly rates in the same week, the regular rate must be calculated as the weighted average before subtracting the allowable tip credit.

### Can an employer force an employee to work overtime without paying cash overtime?
No. All hours worked beyond 40 in a designated payroll workweek must be compensated with monetary overtime premiums paid on the employee's regular paycheck.

### What should a worker do if their paystub shows $3.20/hr for overtime?
A cash rate of $3.20/hr indicates the employer used the illegal $2.13 x 1.5 formula. The worker is owed back wages of at least $2.56 per overtime hour and can file a wage claim with the federal Department of Labor Wage and Hour Division.
`);

// Guide 8: no-tax-on-tips-rules
save('guides/no-tax-on-tips-rules.md', `---
title: "No Tax on Tips Explained: Deduction Rules & Caps"
slugTitle: "no-tax-on-tips-rules"
h1: "No tax on tips: rules, income caps, and tax deductions"
description: "Understand the 'No Tax on Tips' legislative deduction. Federal income tax deduction caps, phase-out thresholds, and FICA tax obligations."
intro: "Explore how the 'No Tax on Tips' deduction works, including statutory dollar caps, income phase-outs, and continuing FICA payroll taxes."
type: guide
hub: /p/guides.html
hubName: Guides
labels: [guides, tips, taxes]
needs human edit: false
related:
  - { label: "No tax on tips estimator", url: "/2026/12/no-tax-on-tips-and-overtime-deduction-estimator.html" }
  - { label: "Take-home pay with tips calculator", url: "/2026/12/take-home-pay-with-tips-calculator.html" }
  - { label: "How to read a tipped paystub", url: "/2026/12/how-to-read-tipped-paystub.html" }
sources:
  - { label: "IRS Publication 531: Reporting Tip Income", url: "https://www.irs.gov/forms-pubs/about-publication-531" }
  - { label: "Joint Committee on Taxation — Tax Expenditure Analysis", url: "https://www.jct.gov/" }
---
## The Legislative Architecture of "No Tax on Tips"

The policy concept popular in legislative proposals as "No Tax on Tips" is designed to provide targeted tax relief to front-line service workers. However, widespread misconceptions exist regarding how such a policy functions in practice. A "No Tax on Tips" measure does not eliminate all taxes on gratuities, nor does it convert tip income into untraceable cash.

Instead, statutory proposals structure this relief as an **above-the-line deduction against federal ordinary income tax**, subject to specific annual dollar limitations and income phase-out thresholds. Crucially, **FICA payroll taxes (Social Security and Medicare)** continue to apply to every dollar of earned tip income.

## Key Operational Rules & Structural Limitations

1. **Federal Income Tax Relief Only**: The statutory deduction applies solely to federal ordinary income taxes. It does not eliminate state income taxes (unless a state specifically enacts conforming legislation) or local municipal wage taxes.
2. **Continuing FICA Obligations**: Both employee and employer FICA taxes remain fully applicable:
   - Social Security Tax: 6.2% on all wages up to the annual wage base cap.
   - Medicare Tax: 1.45% on all wages without cap (plus 0.9% Additional Medicare on high earners).
   - Tipped workers must still contribute 7.65% in FICA taxes on all reported tip income to maintain Social Security disability, retirement, and Medicare eligibility credits.
3. **Statutory Deduction Caps**: Legislative frameworks establish maximum annual deductible tip thresholds—typically capped at **$25,000 per individual taxpayer** (or $50,000 for married couples filing jointly).
4. **Income Phase-Outs**: To target relief to working-class hospitality staff, the deduction phases out at higher Adjusted Gross Income (AGI) levels (e.g., beginning at $150,000 for single filers, phasing out completely at $200,000).
5. **Mandatory Tip Reporting**: Tips must still be fully declared to the employer on IRS Form 4070 or automated POS clock-out reports. Undue reporting forfeits eligibility for the deduction.

## Worked Example 1: Full Deduction for a Full-Time Server

Javier works as a full-time server in Chicago. Over the tax year, Javier's payroll records show:
- Base hourly cash wages: $18,720.00
- Reported credit and cash tips: $22,000.00
- Total gross earnings: $40,720.00
- Filing status: Single (taking the standard deduction)

**Step 1: Evaluate FICA Payroll Taxes**
- Javier must pay 7.65% FICA on all earnings (wages + tips):
- FICA tax due: $40,720.00 x 0.0765 = $3,115.08
- The "No Tax on Tips" deduction provides zero reduction in FICA taxes.

**Step 2: Apply the "No Tax on Tips" Federal Income Tax Deduction**
- Total tips earned: $22,000.00
- Statutory cap: $25,000.00
- Allowable deduction: Full $22,000.00 of tip income is deducted from Adjusted Gross Income (AGI).
- Taxable income after tip deduction and standard deduction:
  - Adjusted Gross Income before standard deduction: $40,720.00 - $22,000.00 = $18,720.00.
  - Applying standard deduction reduces federal ordinary income tax liability to near zero.

**Tax Savings Summary**:
- In the 12% marginal federal tax bracket, deducting $22,000 in tips yields approximately **$2,640.00 in direct federal income tax savings**, while preserving Javier's Social Security retirement credits through paid FICA taxes.

## Worked Example 2: High-Volume Bartender Exceeding the Statutory Cap

Ashley works as a lead bartender at a premier resort in Miami, Florida. Over the year, Ashley earns:
- Base hourly cash wages: $24,960.00
- Reported tips: $36,000.00
- Total gross income: $60,960.00

**Step 1: Application of the $25,000 Statutory Cap**
- Total tips earned: $36,000.00
- Maximum allowable tip deduction: $25,000.00
- Tips remaining subject to federal income tax: $36,000.00 - $25,000.00 = $11,000.00

**Step 2: Federal Taxable Income Impact**
- Gross income: $60,960.00
- Subtract tip deduction: -$25,000.00
- Revised AGI: $35,960.00
- In the 22% marginal bracket, deducting the capped $25,000 saves Ashley approximately **$5,500.00 in federal income taxes**.
- FICA taxes of 7.65% remain payable on the entire $60,960.00 ($4,663.44).

## Critical Recordkeeping Obligations for Workers

To claim a tip income tax deduction, an employee must maintain meticulous documentation:
- Maintain daily tip logs (such as IRS Form 4070A or digital point-of-sale shift summaries).
- Ensure all credit card tips and cash tips are accurately reported to the employer at least monthly.
- Retain final Form W-2 records separating Box 1 (Taxable Wages) from Box 7 (Social Security Tips).

## Frequently Asked Questions

### Does "No Tax on Tips" mean I don't have to report cash tips?
No. All tips must be reported to employers and the IRS. Failing to report tips constitutes tax evasion and disqualifies the worker from claiming any statutory tip deduction on their tax return.

### Will the tip deduction reduce my future Social Security benefits?
No, because FICA payroll taxes (which fund Social Security and Medicare) continue to apply to 100% of reported tip income. Your earnings credits toward Social Security retirement and disability remain completely intact.

### Do mandatory service charges qualify for the tip deduction?
No. Compulsory banquet fees, automatic 18% gratuities, and delivery charges are legally classified as service charges and employer revenue, not voluntary tips. They do not qualify for tip income deductions.

### How does the deduction affect state income taxes?
Unless your state legislature specifically amends its state tax code to conform to the federal tip deduction, you will still owe state income taxes on your full tip earnings.

### Can independent contractors (like gig delivery drivers) claim the tip deduction?
Statutory proposals require qualifying tips to be earned in a bona fide service occupation. Specific reporting schedules (such as Schedule 1A) govern self-employed workers and 1099 contractors claiming qualified tip deductions.
`);

// Guide 9: no-tax-on-overtime-california
save('guides/no-tax-on-overtime-california.md', `---
title: "No Tax on Overtime: California Pay Rules Explained"
slugTitle: "no-tax-on-overtime-california"
h1: "No tax on overtime: California rules, limits, and payroll impact"
description: "How 'No Tax on Overtime' proposals interact with California daily overtime and double time. Complete breakdown of federal vs state tax rules."
intro: "Explore how federal 'No Tax on Overtime' proposals affect California workers, comparing federal tax deductions with California state income taxes."
type: guide
hub: /p/guides.html
hubName: Guides
labels: [guides, overtime, california, taxes]
needs human edit: false
related:
  - { label: "California overtime calculator", url: "/2026/12/california-overtime-calculator.html" }
  - { label: "No tax on tips estimator", url: "/2026/12/no-tax-on-tips-and-overtime-deduction-estimator.html" }
  - { label: "Daily overtime states", url: "/2026/12/daily-overtime-states.html" }
sources:
  - { label: "California Franchise Tax Board (FTB)", url: "https://www.ftb.ca.gov/" }
  - { label: "IRS Publication 15 (Circular E)", url: "https://www.irs.gov/publications/p15" }
---
## Federal Overtime Deductions vs. California Tax Reality

Legislative initiatives proposing "No Tax on Overtime" have generated significant interest among hourly workers, particularly in California where daily overtime (1.5x after 8 hours) and daily double time (2.0x after 12 hours) produce substantial premium earnings.

However, workers in California must navigate a critical constitutional and tax reality: **federal tax legislation does not automatically govern state income taxes**.

California operates an independent state income tax administered by the California Franchise Tax Board (FTB), featuring marginal tax brackets ranging from 1.0% up to 13.3%. Unless the California State Legislature passes explicit conformity legislation matching federal overtime exemptions, overtime earnings exempt from federal tax remain **100% taxable at the state level**.

## How the Overtime Tax Deduction Is Structured

Federal proposals for overtime tax relief typically operate as an above-the-line deduction on Form 1040:
- **Deduction Mechanism**: Overtime premium pay (the extra 0.5x on 1.5x overtime and the extra 1.0x on 2.0x double time) is deducted from federal Adjusted Gross Income.
- **Annual Statutory Caps**: Most proposals cap the maximum annual overtime deduction (commonly $12,500 for single filers and $25,000 for married couples).
- **FICA Exclusions**: Overtime earnings remain fully subject to Social Security (6.2%) and Medicare (1.45%) payroll taxes.
- **State Tax Independence**: California FTB rules require taxpayers to add back federally deducted overtime when calculating California taxable income unless state conformity laws are enacted.

## Worked Example 1: California Nurse Working Regular Overtime Shifts

David works as a nurse in Sacramento earning a regular base wage of $40.00 per hour. In California, his 1.5x overtime rate is $60.00 per hour (containing a $20.00/hr premium). Over the course of the tax year, David logs 300 overtime hours:
- Base wages earned on overtime hours: 300 hours x $40.00 = $12,000.00
- Overtime premium earned: 300 hours x $20.00 = $6,000.00
- Total overtime earnings: $18,000.00
- Annual straight-time salary: $83,200.00
- Total annual gross income: $101,200.00

**Step 1: Evaluate Federal Income Tax Relief**
- Overtime premium earned: $6,000.00 (below the $12,500 statutory cap).
- Federal deduction: Full $6,000.00 overtime premium is deducted from federal AGI.
- In the 22% federal tax bracket, David saves: $6,000.00 x 0.22 = **$1,320.00 in federal income taxes**.

**Step 2: Evaluate California State Income Tax Impact**
- California does not conform to federal overtime deductions.
- The entire $101,200.00 is subject to California state income tax brackets (up to 9.3%).
- David owes his standard state tax of approximately $6,200.00 with zero state tax reduction on overtime.

**Step 3: Evaluate FICA Payroll Taxes**
- FICA taxes (7.65%) apply to the complete $101,200.00 gross earnings ($7,741.80).

**Net Summary**: David achieves $1,320.00 in federal tax savings, but continues paying full state income taxes and FICA payroll contributions.

## Worked Example 2: Extended Double Time Work Exceeding the Cap

Renee works as an industrial electrician in Long Beach earning $50.00 per hour base pay. Her double time rate is $100.00 per hour ($50.00 base + $50.00 premium). Over an emergency refinery turnaround project, Renee logs 400 overtime and double time hours, generating $22,000.00 in premium pay.

**Step 1: Application of the Federal $12,500 Cap**
- Total premium earned: $22,000.00
- Maximum allowable federal deduction: $12,500.00
- Taxable premium remaining: $22,000.00 - $12,500.00 = $9,500.00

**Step 2: Federal Savings**
- In Renee's 24% marginal federal bracket, the $12,500 deduction delivers **$3,000.00 in federal tax savings**.
- The remaining $9,500 in premium pay is taxed at standard federal rates.
- California FTB taxes the complete gross income without deduction.

## Crucial Paystub Audit Rules for California Workers

When reviewing California paystubs under overtime tax relief rules, workers should verify:
1. **Explicit Line Itemization**: California Labor Code Section 226 requires paystubs to explicitly separate straight-time hours and rates from overtime and double time hours and rates.
2. **Form W-2 Separation**: Employers must report qualifying overtime premium pay in dedicated W-2 reporting boxes to allow accurate tax preparation on Form 1040.
3. **Withholding Accuracy**: Federal tax withholding on paychecks may reflect the anticipated overtime deduction, but state withholding must continue at standard California FTB schedules.

## Local Municipal Taxes & Collective Bargaining Considerations

In several California metropolitan areas, union contracts (such as collective bargaining agreements under UNITE HERE, IBEW, or CNA) establish contractual overtime formulas that exceed statutory minimums. Contractual premium pay negotiated by labor unions must still comply with statutory regular rate baselines under California law. Additionally, while California cities do not impose local municipal personal income taxes, payroll accounting teams must ensure that payroll tax reports generated for city business licenses do not conflate gross wages with federal taxable income.

## Frequently Asked Questions

### Does "No Tax on Overtime" apply to double time in California?
Under federal legislative proposals, the deduction covers the premium portion of overtime pay. For double time (2.0x), the 1.0x premium component above the straight-time base rate qualifies for the deduction up to statutory annual caps.

### Will California conform to federal overtime tax exemptions?
California historically maintains selective conformity with federal tax changes. Because income tax is the primary revenue source for California's general fund, automatic conformity is not guaranteed and requires specific legislation passed by the California State Legislature.

### Does the overtime deduction apply to salaried exempt employees?
No. To qualify for overtime and any corresponding overtime tax deduction, an employee must be classified as non-exempt and compensated on an hourly or daily overtime schedule under the FLSA and California Labor Code.

### Does the overtime deduction reduce child support or alimony obligations?
No. Child support and spousal maintenance calculations in California are based on total gross income from all sources under California Family Code Section 4058, regardless of federal tax deductions.

### How does the deduction affect Social Security retirement credits?
Because FICA taxes continue to apply to 100% of overtime earnings, your earnings credits toward future Social Security retirement and disability benefits remain completely unaffected.
`);

// Guide 10: how-to-read-tipped-paystub
save('guides/how-to-read-tipped-paystub.md', `---
title: "How to Read a Tipped Paystub: Line-by-Line Guide"
slugTitle: "how-to-read-tipped-paystub"
h1: "How to read a tipped employee paystub: line-by-line guide"
description: "Decode your hospitality paystub. Understand cash wages, tip credits, allocated tips, tip-outs, and FICA tax withholding calculations."
intro: "Learn how to read and decode a restaurant or hospitality paystub, explaining cash wages, tip credits, FICA taxes, and allocated tips."
type: guide
hub: /p/guides.html
hubName: Guides
labels: [guides, tips, paystub]
needs human edit: false
related:
  - { label: "Take-home pay with tips calculator", url: "/2026/12/take-home-pay-with-tips-calculator.html" }
  - { label: "Tip credit explained", url: "/2026/12/tip-credit-explained.html" }
  - { label: "Tipped employee overtime", url: "/2026/12/tipped-employee-overtime.html" }
sources:
  - { label: "IRS Publication 531 — Reporting Tip Income", url: "https://www.irs.gov/forms-pubs/about-publication-531" }
  - { label: "DOL WHD — Tipped Employee Regulations", url: "https://www.dol.gov/agencies/whd/fact-sheets/15-tipped-employees-flsa" }
---
## Why Hospitality Paystubs Are Uniquely Complex

For servers, bartenders, and hospitality workers, opening a biweekly paystub can often be confusing. Unlike standard hourly workers whose gross earnings simply equal hours worked multiplied by their hourly wage, tipped employees receive compensation from two separate sources: direct hourly cash wages disbursed by the employer, and customer gratuities collected via credit cards and cash.

Because taxes must be withheld on both direct cash wages and reported tips, a server's net paycheck is often surprisingly small—and in some cases, can even read $0.00 (known as a "zero check").

Understanding each line item on your earnings statement is essential for verifying minimum wage compliance, ensuring accurate tax withholding, and auditing tip credit calculations.

## Anatomy of a Tipped Paystub: Core Line Items

A compliant hospitality earnings statement contains five primary sections:

### 1. Hours & Hourly Earnings
- **Regular Tipped Hours (Reg Tipped)**: Hours worked at your direct cash wage (e.g., 40.0 hours at $2.13/hr = $85.20).
- **Overtime Hours (OT Tipped)**: Hours worked past 40 at the statutory tipped cash overtime rate (e.g., $5.76/hr under federal baselines).
- **Non-Tipped Hours (Reg Non-Tip)**: Hours spent in mandatory meetings or extended prep work compensated at the full minimum wage (e.g., $7.25 or $15.00/hr).

### 2. Reported Gratuities (Memo Items)
- **Charged Tips (CC Tips)**: Customer tips left on credit cards, paid out on paycheck or cashed out daily.
- **Declared Cash Tips**: Cash tips you reported to the restaurant at clock-out via IRS Form 4070.
- **Memo Tips / Non-Cash Earnings**: These figures are listed for tax accounting purposes only. They reflect money you already received in cash or daily checkout and are not paid again on the check.

### 3. Tax Withholdings
- **Federal Withholding (FIT)**: Federal income tax calculated on your combined total earnings (cash wages + tips).
- **Social Security (OASDI)**: 6.2% of combined total earnings.
- **Medicare (FICA Med)**: 1.45% of combined total earnings.
- **State Withholding (SIT)**: State income tax on combined total earnings.

### 4. Direct Deductions & Offsets
- **Tips Already Paid (Direct Tip Offset)**: If credit card tips were cashed out at the end of each shift, this line deducts those amounts so they are not paid a second time.
- **Tip-Out Contributions**: Recorded deductions transferred to bussers, runners, or bartenders.

### 5. Employer Tip Credit Disclosure
- A compliant paystub should show the hourly tip credit claimed by the employer (e.g., $5.12/hr) to document statutory compliance.

## Worked Example 1: Standard Biweekly Paystub with Cash-Out Deductions

Ashley works as a server in Georgia. She works 70 hours across a two-week biweekly pay period at the statutory cash wage of $2.13 per hour. Over the two weeks, Ashley declared $1,400.00 in credit card tips, which the restaurant cashed out daily at the end of each shift.

**Step 1: Calculate Employer Gross Cash Wages**
- 70 hours x $2.13 = $149.10

**Step 2: Determine Total Taxable Gross Income**
- Direct cash wages: $149.10
- Reported credit tips: $1,400.00
- Total taxable gross income: $149.10 + $1,400.00 = $1,549.10

**Step 3: Calculate Statutory Tax Withholdings**
- Social Security tax (6.2%): $1,549.10 x 0.062 = $96.04
- Medicare tax (1.45%): $1,549.10 x 0.0145 = $22.46
- Federal income tax withholding (approx. 5% effective): $77.46
- State income tax withholding (Georgia approx. 4%): $61.96
- Total statutory tax withholdings: $96.04 + $22.46 + $77.46 + $61.96 = $257.92

**Step 4: Net Paycheck Calculation**
- Total cash wages available to withhold from: $149.10
- Total taxes owed: $257.92
- Because total taxes ($257.92) exceed Ashley's direct cash wages ($149.10), her direct paycheck reflects **Net Pay: $0.00**.
- The remaining tax shortfall ($257.92 - $149.10 = $108.82) is recorded as uncollected Social Security and Medicare taxes, which Ashley will reconcile when filing her annual Form 1040.

Ashley took home her $1,400.00 in daily cash, while her entire $149.10 paycheck went directly to cover payroll taxes on her earnings.

## Worked Example 2: Paystub in a High Minimum Wage State (California)

David works as a server in San Diego, California, where tip credits are prohibited and all workers receive the full minimum wage of $16.90 per hour. Over two weeks, David logs 80 hours and reports $1,200.00 in credit card tips retained on his paycheck.

**Step 1: Calculate Employer Cash Wages**
- 80 hours x $16.90 = $1,352.00

**Step 2: Total Gross Pay (Wages + Tips Paid on Check)**
- Cash wages: $1,352.00
- Credit card tips paid on check: $1,200.00
- Total gross earnings: $2,552.00

**Step 3: Calculate Tax Deductions**
- FICA Social Security (6.2%): $2,552.00 x 0.062 = $158.22
- FICA Medicare (1.45%): $2,552.00 x 0.0145 = $37.00
- Federal income tax (est. 10%): $255.20
- California state income tax + SDI (approx. 5%): $127.60
- Total withholdings: $578.02

**Step 4: Net Take-Home Paycheck**
- Total gross: $2,552.00
- Total taxes withheld: -$578.02
- Net paycheck deposited into David's bank account: **$1,973.98**

## Red Flags to Watch for on Your Paystub

- **Missing Overtime Premium**: If your paystub lists overtime hours at $3.20/hr instead of the statutory $5.76/hr (federal) or higher state rate, your employer is using an illegal formula.
- **Unexplained Deductions**: Line items for "cash register shortage," "walkout," or "broken glass" that reduce your wages below the statutory minimum wage are illegal under federal and state law.
- **Allocated Tips**: If Box 8 of your W-2 or your year-end paystub shows "Allocated Tips," your employer reported that credit tips fell short of IRS 8% gross receipt benchmarks, potentially creating tax liability for income you never actually received.

## Frequently Asked Questions

### Why is my server paycheck zero dollars?
When a worker earns high customer tips, the income taxes and FICA payroll taxes owed on those tips can exceed the small direct cash wage (such as $2.13/hr). The employer withholds the entire cash paycheck to satisfy tax obligations, resulting in a zero net paycheck.

### What are "allocated tips" on a paystub or W-2?
Under IRS rules for large food establishments (employing >10 staff), if the total tips reported by staff equal less than 8 percent of gross food and beverage sales, the employer must allocate the shortfall among employees. Allocated tips are not subject to withholding but must be reported on Form 1040.

### Are credit card processing fee deductions shown on the paystub?
If an employer deducts transactional processing fees from charged tips, the deduction should be itemized on the shift checkout report or listed as a specific deduction line item on the paystub.

### How do I verify my employer paid the required tip makeup pay?
Check your total hours worked multiplied by the full statutory minimum wage. If your direct cash wages plus reported tips do not equal at least that total, your paystub should show a line item for "Tip Makeup Pay" or "Minimum Wage Differential."

### What should I do if my paystub does not separate straight time and overtime hours?
Under federal FLSA rules and state labor codes (such as California Labor Code § 226), employers are legally required to itemize straight-time hours, overtime hours, and corresponding wage rates. You can request a corrected earnings statement from payroll or file a complaint with the state labor board.
`);

console.log('Part 3 Guides enriched.');
