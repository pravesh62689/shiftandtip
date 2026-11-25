# Recommended Affiliate Programs: Priority Signup Order

A numbered roadmap detailing which affiliate and partner networks to join first, ranked by conversion alignment, payout speed, international publisher friendliness (India), and ease of acceptance.

---

### 1. PartnerStack (Join First: 7shifts & Gusto)
- **Why First**:
  - Hosts both **7shifts** (our highest-converting context: automated tip pools) and **Gusto** (top-rated small business restaurant payroll).
  - Frictionless publisher onboarding: accepts international / India-based publishers with minimal document friction (standard W-8BEN form online).
  - Payout rails: direct integration with Stripe and PayPal, allowing instant transfer to Indian bank accounts in INR.
  - Generous attribution: 7shifts offers a 90-day cookie window and recurring revenue share options.
- **Action Step**: Sign up at [PartnerStack Marketplace](https://dash.partnerstack.com/) and search for "7shifts" and "Gusto".

---

### 2. Impact.com (Join Second: Homebase & TaxAct)
- **Why Second**:
  - Impact Radius is the enterprise standard for affiliate tracking with top-tier international banking support (direct wire / local currency bank transfer to India).
  - Grants instant access to **Homebase** (scheduling & hourly worker management) and **TaxAct** (tax filing for deduction calculators).
  - Very reliable real-time tracking pixels and vanity link generators.
- **Action Step**: Register as a Media Partner / Creator on [Impact.com](https://app.impact.com/). Search for "Homebase" and "TaxAct".

---

### 3. CJ Affiliate (Commission Junction) (Join Third: TurboTax & ADP)
- **Why Third**:
  - The undisputed leader for tax software brands: **TurboTax (Intuit)**, **H&R Block**, and **FreeTaxUSA (TaxHawk)**, plus enterprise payroll (**ADP**).
  - High seasonal earning potential between January and April when workers file returns using our deduction and take-home pay estimators.
  - Fully supports Indian publisher accounts via Payoneer or direct international ACH wire.
- **Action Step**: Create a publisher account at [CJ.com](https://www.cj.com/). Once approved, apply to the Intuit TurboTax, H&R Block, and ADP merchant programs.

---

### 4. Toast Referral Partner Program (Join Fourth)
- **Why Fourth**:
  - Unmatched single-conversion bounties ($500–$1,000 per closed restaurant POS/payroll installation).
  - Relevant for shift supervisors, bar owners, and restaurant operators using our commercial tip-split and overtime calculators.
  - Review timeline can take 3–5 business days, making it ideal to submit after setting up PartnerStack and Impact.
- **Action Step**: Submit application at [Toast Referral Program](https://pos.toasttab.com/referral-program).

---

### Next Steps for Implementation
1. Register on **PartnerStack** and **Impact.com**.
2. Once account IDs / referral links are issued, populate the corresponding affiliate IDs in `config.mjs`:
   - `SEVENSHIFTS_PARTNER_ID`
   - `GUSTO_PARTNER_ID`
   - `HOMEBASE_PARTNER_ID`
   - `TURBOTAX_PARTNER_ID`
3. Flip `AFFILIATES_ENABLED = true` in `config.mjs` to activate the live sponsored recommendation boxes across all calculator tools.
