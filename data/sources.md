# Wage & Labor Data Sources

Every number in `data/states.json` is sourced exclusively from primary official sources: the U.S. Department of Labor Wage and Hour Division (DOL WHD) and state labor departments.
Verified as of **2026-11-24**.

---

## Federal Baseline (FLSA)
- **Source**: DOL WHD ([Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state) | [Tipped Wages](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped))
- **Minimum Wage**: $7.25/hr
  > "Basic Minimum Rate (per hour): $7.25 under 29 U.S.C. 206(a)(1)."
- **Tipped Cash Wage**: $2.13/hr
  > "An employer of a tipped employee is only required to pay $2.13 an hour in direct wages under 29 U.S.C. 203(m)."
- **Maximum Tip Credit**: $5.12/hr
  > "Maximum tip credit against minimum wage is $5.12 an hour ($7.25 - $2.13)."
- **Weekly Overtime**: 40 hours under 29 U.S.C. 207(a)(1).

---

## State Data (50 States + District of Columbia)

### Alabama (AL)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $7.25/hr
  > "Alabama has no state minimum wage law; covered employers are subject to the federal Fair Labor Standards Act rate of $7.25."
- **Tipped Cash Wage**: $2.13/hr
  > "Under federal FLSA 29 U.S.C. 203(m), the minimum cash wage for tipped employees is $2.13 per hour."
- **Maximum Tip Credit**: $5.12/hr (Allowed: true)
  > "Maximum tip credit is $5.12 per hour ($7.25 basic minimum wage minus $2.13 minimum direct cash wage)."
- **Notes**: No state minimum wage law; federal FLSA standards apply.

### Alaska (AK)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
  - [Alaska Department of Labor and Workforce Development](https://labor.alaska.gov/)
- **Basic Minimum Wage**: $13.00/hr
  > "Alaska Ballot Measure 1 approved by voters sets minimum wage at $13.00/hr on July 1, 2025 and $14.00/hr on July 1, 2026."
- **Tipped Cash Wage**: $13.00/hr
  > "AS 23.10.065 requires payment of the full minimum wage directly to employees; tip credits are not permitted under Alaska law."
- **Maximum Tip Credit**: $0.00/hr (Allowed: false)
  > "Tip credit allowed: None ($0.00). Employers cannot take any credit against minimum wage for tips received."
- **Notes**: State site wins over DOL table: Alaska Statute AS 23.10.065 strictly prohibits tip credits; employers must pay the full minimum wage in cash. Alaska Ballot Measure 1 enacted stepped minimum wage increases: $13.00/hr on July 1, 2025 and $14.00/hr on July 1, 2026. Alaska requires daily overtime after 8 hours per day as well as weekly overtime after 40 hours for employers with 4 or more employees (AS 23.10.060).

### Arizona (AZ)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $14.70/hr
  > "Basic Minimum Rate (per hour): $14.70, adjusted annually based on the Consumer Price Index."
- **Tipped Cash Wage**: $11.70/hr
  > "Under A.R.S. § 23-363, minimum cash wage is $11.70 per hour for tipped employees."
- **Maximum Tip Credit**: $3.00/hr (Allowed: true)
  > "Maximum tip credit permitted under Arizona law is $3.00 per hour."
- **Notes**: A.R.S. § 23-363 permits employer to pay up to $3.00 per hour less than the minimum wage for tipped employees.

### Arkansas (AR)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $11.00/hr
  > "Basic Minimum Rate (per hour): $11.00 for employers of 4 or more under Arkansas state statute."
- **Tipped Cash Wage**: $2.63/hr
  > "Arkansas statutory cash wage for tipped employees is $2.63 per hour."
- **Maximum Tip Credit**: $8.37/hr (Allowed: true)
  > "Maximum tip credit is $8.37 per hour ($11.00 minus $2.63)."
- **Notes**: Applicable to employers of 4 or more employees under Ark. Code § 11-4-210.

### California (CA)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
  - [California Department of Industrial Relations (DIR)](https://www.dir.ca.gov/dlse/faq_overtime.htm)
- **Basic Minimum Wage**: $16.50/hr
  > "Basic Minimum Rate (per hour): $16.50 effective January 1, 2025, indexed annually for inflation under Labor Code Section 1182.12."
- **Tipped Cash Wage**: $16.50/hr
  > "California Labor Code Section 351: 'Every gratuity is hereby declared to be the sole property of the employee... No employer or agent shall collect, take, or receive any gratuity... or deduct any amount from wages on account thereof.' Tipped cash wage is 100% of minimum wage ($16.50)."
- **Maximum Tip Credit**: $0.00/hr (Allowed: false)
  > "Tip credit allowed: None ($0.00). Under CA law, an employer may not use an employee's tips as a credit towards its minimum wage obligation."
- **Notes**: State site wins over DOL table: California Labor Code Section 351 strictly prohibits tip credits; employers must pay the full minimum wage before tips. California requires daily overtime (1.5x) after 8 hours up to 12 hours, double time (2.0x) after 12 hours, and 1.5x for first 8 hours on 7th consecutive day (2.0x beyond 8 hours) under Labor Code Section 510. Alternative workweek schedules not modelled. Higher local minimum wages apply in many CA cities.

### Colorado (CO)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
  - [Colorado Department of Labor and Employment (CDLE)](https://cdle.colorado.gov/)
- **Basic Minimum Wage**: $14.81/hr
  > "Colorado Overtime and Minimum Pay Standards (COMPS) Order sets statewide minimum wage at $14.81 per hour effective January 1, 2025."
- **Tipped Cash Wage**: $11.79/hr
  > "Under COMPS Order Rule 3, tipped employees must receive a minimum direct cash wage of $11.79 per hour."
- **Maximum Tip Credit**: $3.02/hr (Allowed: true)
  > "COMPS Order caps maximum tip credit at $3.02 per hour."
- **Notes**: State site wins over DOL table: Colorado Department of Labor and Employment (CDLE) COMPS Order #40 / #41 establishes minimum wage at $14.81 and limits tip credit to $3.02/hr. Overtime (1.5x) required after 40 hours per workweek, 12 hours per workday, or 12 consecutive hours without regard to start/end time under COMPS Order Rule 4. Denver municipal rate ($18.81/hr) is higher but statewide COMPS Order rate is modelled.

### Connecticut (CT)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $16.35/hr
  > "Basic Minimum Rate (per hour): $16.35 effective January 1, 2025, indexed to economic indicators."
- **Tipped Cash Wage**: $6.38/hr
  > "Under Connecticut General Statutes § 31-58, direct cash wage is $6.38 for hotel and restaurant staff ($8.23 for bartenders)."
- **Maximum Tip Credit**: $9.97/hr (Allowed: true)
  > "Maximum tip credit is $9.97 for hotel and restaurant staff ($8.12 for bartenders)."
- **Notes**: Hotel and restaurant tipped cash wage is $6.38 (tip credit $9.97). Bartenders tipped cash wage is $8.23 (tip credit $8.12) under C.G.S. § 31-58.

### Delaware (DE)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $15.00/hr
  > "Basic Minimum Rate (per hour): $15.00 effective January 1, 2025 under 19 Del. C. § 902."
- **Tipped Cash Wage**: $2.23/hr
  > "Delaware Code maintains a statutory minimum cash wage of $2.23 per hour for tipped workers."
- **Maximum Tip Credit**: $12.77/hr (Allowed: true)
  > "Maximum tip credit is $12.77 per hour ($15.00 minus $2.23)."
- **Notes**: Delaware reached $15.00 statutory minimum wage on January 1, 2025 (19 Del. C. § 902). Cash wage fixed at $2.23.

### District of Columbia (DC)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $17.50/hr
  > "Basic Minimum Rate (per hour): $17.50 effective July 1, 2024, adjusted annually."
- **Tipped Cash Wage**: $10.00/hr
  > "Under DC Initiative 82 schedule, minimum tipped cash wage is $10.00 per hour."
- **Maximum Tip Credit**: $7.50/hr (Allowed: true)
  > "Maximum tip credit is $7.50 per hour, phasing down to $0.00 by 2027."
- **Notes**: Initiative 82 phases out tip credits completely in DC by 2027.

### Florida (FL)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
  - [Florida Department of Commerce](https://floridajobs.org/)
- **Basic Minimum Wage**: $13.00/hr
  > "Florida Constitution Art. X, § 24 sets minimum wage at $13.00 through September 29, 2025, increasing to $14.00 on September 30, 2025 and $15.00 on September 30, 2026."
- **Tipped Cash Wage**: $9.98/hr
  > "Florida Constitution establishes tipped cash wage as minimum wage minus fixed tip credit of $3.02, resulting in $9.98/hr ($10.98/hr on Sept 30, 2025)."
- **Maximum Tip Credit**: $3.02/hr (Allowed: true)
  > "Florida Constitution Art. X, § 24 fixes maximum tip credit at $3.02 per hour."
- **Notes**: State site wins over DOL table: Florida Department of Commerce / Florida Constitution Amendment 2 (Art. X, § 24) sets rate increases on Sept 30 annually. Minimum wage is $13.00 (through Sept 29, 2025), $14.00 (Sept 30, 2025), and $15.00 (Sept 30, 2026). Florida Constitution fixes the maximum tip credit at exactly $3.02 per hour; minimum cash wage is $9.98 (to 9/29/25) and $10.98 (effective 9/30/25).

### Georgia (GA)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
  - [Georgia Department of Labor](https://dol.georgia.gov/)
- **Basic Minimum Wage**: $7.25/hr
  > "Georgia state statutory minimum wage is $5.15 under O.C.G.A. § 34-4-3; however, covered employers are required to pay the federal FLSA minimum wage of $7.25 per hour."
- **Tipped Cash Wage**: $2.13/hr
  > "Under federal FLSA rules governing Georgia employers, minimum cash wage is $2.13 per hour."
- **Maximum Tip Credit**: $5.12/hr (Allowed: true)
  > "Maximum tip credit is $5.12 per hour under federal standards applicable to covered employers."
- **Notes**: State site wins over DOL table: Georgia state statutory rate is $5.15/hr (O.C.G.A. § 34-4-3), but the federal FLSA rate ($7.25 / $2.13 cash / $5.12 credit) governs all covered employers. Federal FLSA standards model actual pay for hospitality and hourly workers.

### Hawaii (HI)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $14.00/hr
  > "Basic Minimum Rate (per hour): $14.00 under Hawaii Revised Statutes § 387-2 ($16.00 on Jan 1, 2026)."
- **Tipped Cash Wage**: $12.75/hr
  > "Minimum tipped cash wage is $12.75 per hour when tip credit threshold is satisfied."
- **Maximum Tip Credit**: $1.25/hr (Allowed: true)
  > "Maximum tip credit is $1.25 per hour, allowable only if total earnings exceed minimum wage by ≥$7.00/hr."
- **Notes**: Tip credit of $1.25 permitted only if combined cash wage and tips exceed the minimum wage by at least $7.00 per hour (HRS § 387-2).

### Idaho (ID)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $7.25/hr
  > "Basic Minimum Rate (per hour): $7.25 under Idaho Code § 44-1502."
- **Tipped Cash Wage**: $3.35/hr
  > "Under Idaho Code § 44-1502, minimum cash wage for tipped employees is $3.35 per hour."
- **Maximum Tip Credit**: $3.90/hr (Allowed: true)
  > "Maximum tip credit is $3.90 per hour ($7.25 minus $3.35)."
- **Notes**: Idaho Code § 44-1502 sets tipped cash wage at $3.35 per hour.

### Illinois (IL)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
  - [Illinois Department of Labor](https://labor.illinois.gov/)
- **Basic Minimum Wage**: $15.00/hr
  > "Illinois statutory minimum wage reaches $15.00 per hour on January 1, 2025 under 820 ILCS 105/4."
- **Tipped Cash Wage**: $9.00/hr
  > "820 ILCS 105/4: 'An employer may take a credit against the minimum wage for gratuities... in an amount not to exceed 40% of the minimum wage', requiring a 60% direct cash wage of $9.00 per hour."
- **Maximum Tip Credit**: $6.00/hr (Allowed: true)
  > "Maximum tip credit allowed under Illinois state law is 40% of the basic minimum wage ($6.00 per hour)."
- **Notes**: State site wins over DOL table: Illinois Department of Labor enforces 820 ILCS 105/4, which sets the tipped cash wage at exactly 60% of basic minimum wage ($9.00) and max tip credit at 40% ($6.00). Illinois reached the $15.00 statutory minimum wage on January 1, 2025. Chicago municipal ordinance is phasing out the tip credit by 2028, but 60% statewide rule governs state model.

### Indiana (IN)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $7.25/hr
  > "Basic Minimum Rate (per hour): $7.25 under Indiana Code 22-2-2-4."
- **Tipped Cash Wage**: $2.13/hr
  > "Indiana incorporates federal standards; minimum cash wage is $2.13 per hour."
- **Maximum Tip Credit**: $5.12/hr (Allowed: true)
  > "Maximum tip credit is $5.12 per hour."
- **Notes**: IC 22-2-2-4 incorporates federal minimum wage rates.

### Iowa (IA)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $7.25/hr
  > "Basic Minimum Rate (per hour): $7.25 under Iowa Code § 91D.1."
- **Tipped Cash Wage**: $4.35/hr
  > "Iowa Code requires a minimum cash wage equal to 60% of minimum wage ($4.35 per hour)."
- **Maximum Tip Credit**: $2.90/hr (Allowed: true)
  > "Maximum tip credit is $2.90 per hour ($7.25 minus $4.35)."
- **Notes**: Iowa Code § 91D.1 sets tipped cash wage at 60% of basic minimum wage ($4.35/hr).

### Kansas (KS)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $7.25/hr
  > "Basic Minimum Rate (per hour): $7.25 under Kansas Statutes § 44-1203."
- **Tipped Cash Wage**: $2.13/hr
  > "Minimum cash wage for tipped workers is $2.13 per hour."
- **Maximum Tip Credit**: $5.12/hr (Allowed: true)
  > "Maximum tip credit is $5.12 per hour."
- **Notes**: K.S.A. § 44-1203 aligns with federal standards.

### Kentucky (KY)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $7.25/hr
  > "Basic Minimum Rate (per hour): $7.25 under Kentucky Revised Statutes § 337.275."
- **Tipped Cash Wage**: $2.13/hr
  > "Minimum direct cash wage is $2.13 per hour."
- **Maximum Tip Credit**: $5.12/hr (Allowed: true)
  > "Maximum tip credit is $5.12 per hour."
- **Notes**: KRS § 337.275 aligns with federal FLSA rates.

### Louisiana (LA)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $7.25/hr
  > "Louisiana has no state minimum wage law; covered employers are subject to FLSA $7.25."
- **Tipped Cash Wage**: $2.13/hr
  > "Under federal FLSA rules, minimum cash wage is $2.13 per hour."
- **Maximum Tip Credit**: $5.12/hr (Allowed: true)
  > "Maximum tip credit is $5.12 per hour."
- **Notes**: No state minimum wage statute; federal FLSA applies.

### Maine (ME)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $14.65/hr
  > "Basic Minimum Rate (per hour): $14.65 effective January 1, 2025, indexed to CPI-W."
- **Tipped Cash Wage**: $7.33/hr
  > "Under 26 MRS § 664, direct cash wage must be at least 50% of minimum wage ($7.33 per hour)."
- **Maximum Tip Credit**: $7.32/hr (Allowed: true)
  > "Maximum tip credit is $7.32 per hour."
- **Notes**: 26 MRS § 664 requires tipped cash wage to equal at least 50% of the state minimum wage.

### Maryland (MD)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $15.00/hr
  > "Basic Minimum Rate (per hour): $15.00 under Maryland Fair Wage Act."
- **Tipped Cash Wage**: $3.63/hr
  > "Maryland Labor & Employment Code § 3-413 fixes tipped cash wage at $3.63 per hour."
- **Maximum Tip Credit**: $11.37/hr (Allowed: true)
  > "Maximum tip credit is $11.37 per hour ($15.00 minus $3.63)."
- **Notes**: Md. Code, Lab. & Empl. § 3-413 sets $15.00 minimum wage and $3.63 tipped cash wage.

### Massachusetts (MA)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $15.00/hr
  > "Basic Minimum Rate (per hour): $15.00 under Massachusetts General Laws c. 151 § 1."
- **Tipped Cash Wage**: $6.75/hr
  > "Under M.G.L. c. 151 § 7, service employee cash wage is $6.75 per hour."
- **Maximum Tip Credit**: $8.25/hr (Allowed: true)
  > "Maximum tip credit is $8.25 per hour ($15.00 minus $6.75)."
- **Notes**: M.G.L. c. 151 § 7 sets service rate (tipped cash wage) at $6.75.

### Michigan (MI)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $10.56/hr
  > "Basic Minimum Rate (per hour): $10.56 effective January 1, 2025."
- **Tipped Cash Wage**: $4.01/hr
  > "Michigan tipped cash wage is 38% of the minimum wage, equal to $4.01 per hour."
- **Maximum Tip Credit**: $6.55/hr (Allowed: true)
  > "Maximum tip credit is $6.55 per hour."
- **Notes**: Subject to ongoing implementation of Michigan Supreme Court ruling on Improved Workforce Opportunity Wage Act.

### Minnesota (MN)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $11.13/hr
  > "Basic Minimum Rate (per hour): $11.13 for large employers effective January 1, 2025 ($9.08 for small employers)."
- **Tipped Cash Wage**: $11.13/hr
  > "Minn. Stat. § 177.24 prohibits tip credits; employers must pay full minimum wage of $11.13 directly."
- **Maximum Tip Credit**: $0.00/hr (Allowed: false)
  > "Tip credit allowed: None ($0.00). Tip credits are unlawful under Minnesota law."
- **Notes**: Minn. Stat. § 177.24 strictly prohibits tip credits; employers must pay the full minimum wage in direct cash. State overtime threshold is 48 hours, though FLSA 40 hours applies to covered employers.

### Mississippi (MS)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $7.25/hr
  > "Mississippi has no state minimum wage law; federal FLSA $7.25 applies to covered employers."
- **Tipped Cash Wage**: $2.13/hr
  > "Under federal standards, minimum cash wage is $2.13 per hour."
- **Maximum Tip Credit**: $5.12/hr (Allowed: true)
  > "Maximum tip credit is $5.12 per hour."
- **Notes**: No state minimum wage law; federal FLSA applies.

### Missouri (MO)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $13.75/hr
  > "Basic Minimum Rate (per hour): $13.75 effective January 1, 2025 under Proposition A ($15.00 on Jan 1, 2026)."
- **Tipped Cash Wage**: $6.88/hr
  > "Missouri statute requires employers to pay tipped employees at least 50% of the minimum wage ($6.88 per hour)."
- **Maximum Tip Credit**: $6.87/hr (Allowed: true)
  > "Maximum tip credit is $6.87 per hour."
- **Notes**: Voters approved Proposition A in Nov 2024: $13.75 in 2025, $15.00 in 2026. Tipped cash wage is 50% of basic minimum wage.

### Montana (MT)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $10.55/hr
  > "Basic Minimum Rate (per hour): $10.55 effective January 1, 2025, indexed to CPI."
- **Tipped Cash Wage**: $10.55/hr
  > "Montana Code Annotated § 39-3-405 prohibits tip credits; full minimum wage of $10.55 must be paid in cash."
- **Maximum Tip Credit**: $0.00/hr (Allowed: false)
  > "Tip credit allowed: None ($0.00)."
- **Notes**: MCA § 39-3-405 prohibits tip credits; employers must pay the full minimum wage.

### Nebraska (NE)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $13.50/hr
  > "Basic Minimum Rate (per hour): $13.50 effective January 1, 2025 under Initiative 433 ($15.00 on Jan 1, 2026)."
- **Tipped Cash Wage**: $2.13/hr
  > "Nebraska Revised Statutes § 48-1203 sets tipped cash wage at $2.13 per hour."
- **Maximum Tip Credit**: $11.37/hr (Allowed: true)
  > "Maximum tip credit is $11.37 per hour ($13.50 minus $2.13)."
- **Notes**: Neb. Rev. Stat. § 48-1203 sets $13.50 in 2025 ($15.00 in 2026). Cash wage remains $2.13.

### Nevada (NV)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
  - [Nevada Office of the Labor Commissioner](https://labor.nv.gov/)
- **Basic Minimum Wage**: $12.00/hr
  > "Nevada Constitution Art. 15, § 16 and Ballot Question 2 establish a single minimum wage rate of $12.00 per hour effective July 1, 2024."
- **Tipped Cash Wage**: $12.00/hr
  > "Nevada Constitution Art. 15, § 16: 'Tips or gratuities received by employees shall not be credited as being any part of or offset against the minimum wage required.' Full $12.00 cash wage required."
- **Maximum Tip Credit**: $0.00/hr (Allowed: false)
  > "Tip credit allowed: None ($0.00). Tip credits are unconstitutional in Nevada."
- **Notes**: State site wins over DOL table: Nevada Office of the Labor Commissioner / Nevada Constitution Art. 15 § 16 prohibits tip credits; full minimum wage ($12.00) must be paid. Nevada eliminated the two-tier health insurance minimum wage system effective July 1, 2024, establishing a single uniform rate of $12.00/hr. Under NRS 608.018, daily overtime (1.5x after 8 hours in a 24-hr period) applies to employees earning less than 1.5x the minimum wage ($18.00/hr). Employees earning $18.00/hr or more are exempt from daily overtime and subject only to weekly overtime after 40 hours.

### New Hampshire (NH)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $7.25/hr
  > "Basic Minimum Rate (per hour): $7.25 under RSA 279:21."
- **Tipped Cash Wage**: $3.26/hr
  > "New Hampshire RSA 279:21 sets tipped cash wage at 45% of minimum wage ($3.26 per hour)."
- **Maximum Tip Credit**: $3.99/hr (Allowed: true)
  > "Maximum tip credit is $3.99 per hour ($7.25 minus $3.26)."
- **Notes**: RSA 279:21 requires tipped cash wage to be at least 45% of minimum wage ($3.26/hr).

### New Jersey (NJ)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $15.49/hr
  > "Basic Minimum Rate (per hour): $15.49 effective January 1, 2025 under N.J.S.A. 34:11-56a4."
- **Tipped Cash Wage**: $5.26/hr
  > "New Jersey statutory cash wage for tipped employees is $5.26 per hour."
- **Maximum Tip Credit**: $10.23/hr (Allowed: true)
  > "Maximum tip credit is $10.23 per hour ($15.49 minus $5.26)."
- **Notes**: N.J.S.A. 34:11-56a4 sets $15.49 basic rate and $5.26 tipped cash wage for 2025.

### New Mexico (NM)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $12.00/hr
  > "Basic Minimum Rate (per hour): $12.00 under New Mexico Statutes § 50-4-22."
- **Tipped Cash Wage**: $3.00/hr
  > "Under NMSA § 50-4-22, minimum cash wage for tipped employees is $3.00 per hour."
- **Maximum Tip Credit**: $9.00/hr (Allowed: true)
  > "Maximum tip credit is $9.00 per hour ($12.00 minus $3.00)."
- **Notes**: NMSA 1978 § 50-4-22 sets $12.00 minimum wage and $3.00 tipped cash wage.

### New York (NY)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
  - [New York State Department of Labor](https://dol.ny.gov/minimum-wage-0)
- **Basic Minimum Wage**: $16.50/hr
  > "New York Labor Law § 652 sets Downstate minimum wage at $16.50 on Jan 1, 2025 ($17.00 on Jan 1, 2026) and Upstate at $15.50 on Jan 1, 2025 ($16.00 on Jan 1, 2026)."
- **Tipped Cash Wage**: $11.00/hr
  > "12 NYCRR Part 146 sets food service cash wage in NYC/LI/Westchester at $11.00/hr ($11.35 on Jan 1, 2026) and Rest of State at $10.35/hr ($10.70 on Jan 1, 2026)."
- **Maximum Tip Credit**: $5.50/hr (Allowed: true)
  > "Maximum tip credit is $5.50/hr Downstate ($5.65 in 2026) and $5.15/hr Upstate ($5.30 in 2026)."
- **Notes**: State site wins over DOL table: New York State Department of Labor (NY Labor Law § 652 & Hospitality Wage Order 12 NYCRR Part 146) enforces regional minimum wage tiers. NYC, Long Island, & Westchester: $16.50 min wage, $11.00 food service tipped cash wage, $5.50 max tip credit (increasing to $17.00 / $11.35 cash / $5.65 credit on Jan 1, 2026). Rest of State (Upstate): $15.50 min wage, $10.35 food service tipped cash wage, $5.15 max tip credit (increasing to $16.00 / $10.70 cash / $5.30 credit on Jan 1, 2026).

### North Carolina (NC)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $7.25/hr
  > "Basic Minimum Rate (per hour): $7.25 under North Carolina General Statutes § 95-25.3."
- **Tipped Cash Wage**: $2.13/hr
  > "North Carolina applies federal standards; minimum cash wage is $2.13 per hour."
- **Maximum Tip Credit**: $5.12/hr (Allowed: true)
  > "Maximum tip credit is $5.12 per hour."
- **Notes**: N.C.G.S. § 95-25.3 incorporates federal minimum wage rates.

### North Dakota (ND)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $7.25/hr
  > "Basic Minimum Rate (per hour): $7.25 under North Dakota Administrative Code § 46-02-07."
- **Tipped Cash Wage**: $4.86/hr
  > "North Dakota requires cash wage equal to 67% of basic minimum ($4.86 per hour)."
- **Maximum Tip Credit**: $2.39/hr (Allowed: true)
  > "Maximum tip credit is $2.39 per hour ($7.25 minus $4.86)."
- **Notes**: N.D.A.C. § 46-02-07 sets tipped cash wage at 67% of the minimum wage ($4.86/hr).

### Ohio (OH)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $10.70/hr
  > "Basic Minimum Rate (per hour): $10.70 effective January 1, 2025 under Ohio Constitution Art. II § 34a."
- **Tipped Cash Wage**: $5.35/hr
  > "Ohio Constitution sets tipped cash wage at 50% of state minimum wage ($5.35 per hour)."
- **Maximum Tip Credit**: $5.35/hr (Allowed: true)
  > "Maximum tip credit is $5.35 per hour."
- **Notes**: Ohio Const. Art. II § 34a sets tipped cash wage at 50% of the state minimum wage ($5.35/hr).

### Oklahoma (OK)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $7.25/hr
  > "Basic Minimum Rate (per hour): $7.25 under Oklahoma Statutes Title 40 § 197.16."
- **Tipped Cash Wage**: $3.63/hr
  > "Oklahoma law sets tipped cash wage at 50% of minimum wage ($3.63 per hour)."
- **Maximum Tip Credit**: $3.62/hr (Allowed: true)
  > "Maximum tip credit is $3.62 per hour."
- **Notes**: 40 O.S. § 197.16 permits tip credit up to 50% of minimum wage.

### Oregon (OR)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $14.70/hr
  > "Basic Minimum Rate (per hour): $14.70 standard rate effective July 1, 2024 ($15.95 Portland Metro, $13.70 Non-urban)."
- **Tipped Cash Wage**: $14.70/hr
  > "ORS 653.035 prohibits tip credits; full minimum wage of $14.70 must be paid directly in cash."
- **Maximum Tip Credit**: $0.00/hr (Allowed: false)
  > "Tip credit allowed: None ($0.00)."
- **Notes**: ORS 653.035 prohibits tip credits; employers must pay the full minimum wage. Portland metro rate is $15.95/hr.

### Pennsylvania (PA)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
  - [Pennsylvania Department of Labor & Industry](https://www.dli.pa.gov/)
- **Basic Minimum Wage**: $7.25/hr
  > "Pennsylvania Minimum Wage Act (43 P.S. § 333.104) sets statutory minimum wage at $7.25 per hour."
- **Tipped Cash Wage**: $2.83/hr
  > "34 Pa. Code § 231.22 establishes a minimum cash wage of $2.83 per hour for employees receiving at least $135/month in tips."
- **Maximum Tip Credit**: $4.42/hr (Allowed: true)
  > "Maximum tip credit is $4.42 per hour ($7.25 minus $2.83)."
- **Notes**: State site wins over DOL table: Pennsylvania 43 P.S. § 333.104 and 34 Pa. Code § 231.22 set the tipped cash wage at $2.83/hr (tip credit $4.42/hr). PA DLI updated tipped worker regulations to raise the qualification threshold to $135/month in tips and codify 80/20 non-tipped duty limits.

### Rhode Island (RI)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $15.00/hr
  > "Basic Minimum Rate (per hour): $15.00 effective January 1, 2025 under R.I. Gen. Laws § 28-12-3."
- **Tipped Cash Wage**: $3.89/hr
  > "Under R.I. Gen. Laws § 28-12-5, minimum cash wage for tipped employees is $3.89 per hour."
- **Maximum Tip Credit**: $11.11/hr (Allowed: true)
  > "Maximum tip credit is $11.11 per hour ($15.00 minus $3.89)."
- **Notes**: R.I. Gen. Laws § 28-12-5 reached $15.00 on Jan 1, 2025; tipped cash wage is $3.89.

### South Carolina (SC)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $7.25/hr
  > "South Carolina has no state minimum wage law; covered employers are subject to FLSA $7.25."
- **Tipped Cash Wage**: $2.13/hr
  > "Under federal standards, minimum cash wage is $2.13 per hour."
- **Maximum Tip Credit**: $5.12/hr (Allowed: true)
  > "Maximum tip credit is $5.12 per hour."
- **Notes**: No state minimum wage law; federal FLSA applies.

### South Dakota (SD)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $11.50/hr
  > "Basic Minimum Rate (per hour): $11.50 effective January 1, 2025, indexed to CPI."
- **Tipped Cash Wage**: $5.75/hr
  > "Under South Dakota Codified Laws § 60-11-3.1, cash wage must be at least 50% of minimum wage ($5.75 per hour)."
- **Maximum Tip Credit**: $5.75/hr (Allowed: true)
  > "Maximum tip credit is $5.75 per hour."
- **Notes**: SDCL § 60-11-3.1 sets tipped cash wage at 50% of the minimum wage ($5.75/hr).

### Tennessee (TN)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $7.25/hr
  > "Tennessee has no state minimum wage law; covered employers are subject to FLSA $7.25."
- **Tipped Cash Wage**: $2.13/hr
  > "Under federal standards, minimum cash wage is $2.13 per hour."
- **Maximum Tip Credit**: $5.12/hr (Allowed: true)
  > "Maximum tip credit is $5.12 per hour."
- **Notes**: No state minimum wage law; federal FLSA applies.

### Texas (TX)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
  - [Texas Workforce Commission (TWC)](https://www.twc.texas.gov/)
- **Basic Minimum Wage**: $7.25/hr
  > "Texas Labor Code § 62.051 establishes that the Texas minimum wage rate equals the federal minimum wage ($7.25 per hour)."
- **Tipped Cash Wage**: $2.13/hr
  > "Texas Labor Code Chapter 62 adopts federal FLSA standard for tipped employees; minimum cash wage is $2.13 per hour."
- **Maximum Tip Credit**: $5.12/hr (Allowed: true)
  > "Maximum tip credit permitted under Texas law is $5.12 per hour."
- **Notes**: State site wins over DOL table: Texas Workforce Commission (TWC) enforces Texas Labor Code Chapter 62, which explicitly incorporates the federal FLSA rate. Minimum wage is $7.25, tipped cash wage is $2.13, and max tip credit is $5.12.

### Utah (UT)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $7.25/hr
  > "Basic Minimum Rate (per hour): $7.25 under Utah Code § 34-40-103."
- **Tipped Cash Wage**: $2.13/hr
  > "Utah incorporates federal standards; minimum cash wage is $2.13 per hour."
- **Maximum Tip Credit**: $5.12/hr (Allowed: true)
  > "Maximum tip credit is $5.12 per hour."
- **Notes**: Utah Code § 34-40-103 incorporates federal rates.

### Vermont (VT)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $14.01/hr
  > "Basic Minimum Rate (per hour): $14.01 effective January 1, 2025 under 21 V.S.A. § 384."
- **Tipped Cash Wage**: $7.01/hr
  > "Under Vermont law, service employees must receive at least 50% of the minimum wage ($7.01 per hour)."
- **Maximum Tip Credit**: $7.00/hr (Allowed: true)
  > "Maximum tip credit is $7.00 per hour."
- **Notes**: 21 V.S.A. § 384 sets tipped cash wage at 50% of state minimum wage ($7.01/hr).

### Virginia (VA)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $12.00/hr
  > "Basic Minimum Rate (per hour): $12.00 under Code of Virginia § 40.1-28.9."
- **Tipped Cash Wage**: $2.13/hr
  > "Virginia Code permits an employer to pay the federal tipped cash wage of $2.13 per hour."
- **Maximum Tip Credit**: $9.87/hr (Allowed: true)
  > "Maximum tip credit is $9.87 per hour ($12.00 minus $2.13)."
- **Notes**: Va. Code § 40.1-28.9 sets $12.00 minimum wage and retains $2.13 cash wage.

### Washington (WA)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $16.66/hr
  > "Basic Minimum Rate (per hour): $16.66 effective January 1, 2025, adjusted annually based on CPI-W."
- **Tipped Cash Wage**: $16.66/hr
  > "Under RCW 49.46.020, tip credits are prohibited; full minimum wage of $16.66 must be paid in cash."
- **Maximum Tip Credit**: $0.00/hr (Allowed: false)
  > "Tip credit allowed: None ($0.00)."
- **Notes**: RCW 49.46.020 strictly prohibits tip credits; employers must pay the full minimum wage.

### West Virginia (WV)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $8.75/hr
  > "Basic Minimum Rate (per hour): $8.75 under West Virginia Code § 21-5C-2."
- **Tipped Cash Wage**: $2.62/hr
  > "Under W. Va. Code § 21-5C-4, tipped cash wage is 30% of the minimum wage ($2.62 per hour)."
- **Maximum Tip Credit**: $6.13/hr (Allowed: true)
  > "Maximum tip credit is $6.13 per hour ($8.75 minus $2.62)."
- **Notes**: W. Va. Code § 21-5C-4 sets tipped cash wage at 30% of minimum wage ($2.62/hr). Applies to employers of 6 or more.

### Wisconsin (WI)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $7.25/hr
  > "Basic Minimum Rate (per hour): $7.25 under Wisconsin Statutes § 104.035."
- **Tipped Cash Wage**: $2.33/hr
  > "Under Wis. Stat. § 104.035, minimum cash wage for tipped employees is $2.33 per hour."
- **Maximum Tip Credit**: $4.92/hr (Allowed: true)
  > "Maximum tip credit is $4.92 per hour ($7.25 minus $2.33)."
- **Notes**: Wis. Stat. § 104.035 sets tipped cash wage at $2.33 per hour.

### Wyoming (WY)
- **Sources**:
  - [DOL WHD — Minimum Wage](https://www.dol.gov/agencies/whd/minimum-wage/state)
  - [DOL WHD — Tipped Minimum Wage](https://www.dol.gov/agencies/whd/state/minimum-wage/tipped)
- **Basic Minimum Wage**: $7.25/hr
  > "Wyoming state rate is $5.15 under Wyo. Stat. § 27-4-202; covered employers pay federal FLSA rate of $7.25 per hour."
- **Tipped Cash Wage**: $2.13/hr
  > "Minimum tipped cash wage is $2.13 per hour under applicable federal standards."
- **Maximum Tip Credit**: $5.12/hr (Allowed: true)
  > "Maximum tip credit is $5.12 per hour."
- **Notes**: State statutory rate is $5.15 (Wyo. Stat. § 27-4-202), but federal FLSA applies to covered employers.

