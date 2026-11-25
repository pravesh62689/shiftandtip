# State Pay Rules Data Status Report

**Audit Date**: 2026-11-25  
**Database**: `data/states.json`  
**Snapshots Directory**: `data/raw/snapshots/`  
**Live URL**: `https://shiftandtip.blogspot.com/p/state-pay-rules-minimum-wage-overtime.html`

## Executive Summary
- **Total Jurisdictions**: 51 (50 States + District of Columbia)
- **Verified Jurisdictions**: 49
- **Unverified Jurisdictions**: 2 (`CT`, `MT`)
- **States with Verbatim Quotes in Primary Snapshots**: 49

## Verification Breakdown
All 49 verified jurisdictions have exact numeric wage thresholds (`minWage`, `tippedCashWage`, `maxTipCredit`, overtime threshold) anchored to statutory Department of Labor records and official state labor department orders:
- **Primary Source Snapshots**:
  - `dol-minwage-2026-11-24.html` / `.txt`: U.S. Department of Labor Wage & Hour Division minimum wage table.
  - `dol-tipped-2026-11-24.html` / `.txt`: U.S. DOL minimum wages for tipped employees.
  - `dol-factsheet-15-2026-11-24.html` / `.txt`: FLSA tipped employee regulations.
  - `state-ca-2026-11-24.txt`, `state-ny-2026-11-24.txt`, `state-pa-2026-11-24.txt`, `state-il-2026-11-24.txt`, `state-ga-2026-11-24.txt`, `state-nv-2026-11-24.txt`, `state-ak-2026-11-24.txt`: State department labor bulletins and wage orders.

### Unverified States ("pending verification")
1. **Connecticut (CT)**: Minimum wage is $16.94, but tipped cash wage varies by sub-industry ($6.38 for hotel/restaurant vs $8.23 for bartenders under C.G.S. § 31-58); flagged as `pending verification` until multi-tier selection is modeled.
2. **Montana (MT)**: Minimum wage $10.85 applies to businesses with gross annual sales >$110,000, while businesses not covered by FLSA have a lower statutory floor; flagged as `pending verification`.

## Live Table Audit
- Verified on live endpoint `https://shiftandtip.blogspot.com/p/state-pay-rules-minimum-wage-overtime.html`.
- Confirmed that 49 states render sortable tabular records with verified dates and official source hyperlinks.
- Confirmed that `CT` and `MT` cleanly display `<span class="receipt__sub">pending verification</span>` fallback in all wage columns.
