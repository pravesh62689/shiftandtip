---
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
