# Shift & Tip & FileBrik Master Status Report

**Last Updated**: 2026-11-26T02:38:00+05:30  
**Repository**: [pravesh62689/shiftandtip](https://github.com/pravesh62689/shiftandtip) (Public)

---

## 1. Shift & Tip Status

### Health & Workflow Verifications
- **CI Workflow (`ci.yml`)**: ✅ GREEN (Tests: 23/23 pass, build: 146/146 pages pass, audit: 0 fails).
- **Publish Workflow (`publish.yml`)**: ✅ GREEN (Blogger API OAuth verified in dry-run with production token).
- **Weekly Maintenance (`weekly.yml`)**: ✅ GREEN (Blogger blogs.get auth check, statutory data recheck, 5-URL live QA, 3-URL mobile Lighthouse audit, automatic report commit).
- **AdSense Tracker**: Integrated into `weekly.yml` via `scripts/track-adsense.mjs`. Automatically writes `APPLY NOW` banner to `docs/manual-steps.md` when 25+ substantial published pages have been live for 7+ days.

### Revenue & Scaling Assets
- **Affiliate Integration**:
  - Researched and documented in [docs/affiliates.md](file:///F:/shiftandtip/docs/affiliates.md) and [docs/affiliate-signup.md](file:///F:/shiftandtip/docs/affiliate-signup.md) (Gusto, 7shifts, Homebase, Toast, Sling, ADP, TurboTax, H&R Block, TaxAct, FreeTaxUSA).
  - Slots gated by `AFFILIATES_ENABLED` and per-program IDs in `config.mjs` with `rel="sponsored nofollow"` and visible disclosure.
  - GA4 `affiliate_click` tracking event wired into `src/ui/tools.js`.
  - Privacy policy and terms updated with affiliate disclosures.
- **Statutory Data & Scale**:
  - All 50 states + DC income tax brackets and standard deductions captured in `data/state-taxes.json`.
  - Top 40 US city minimum wage rates captured in `data/cities.json`.
  - State paycheck engine with tips and overtime implemented in `src/engine/paycheck.js` with full test suite.
  - 146 pages generated and passing quality gates (<15% 12-word shingle overlap, 600+ words).
  - Spanish localized versions for top 7 tools and top 10 states generated.
- **Outreach & Link Assets**:
  - Embeddable widget at `/p/embed.html` with branded attribution iframe.
  - Outreach directory of 30 hospitality publications documented in [docs/outreach.md](file:///F:/shiftandtip/docs/outreach.md).
  - Custom domain migration architecture and INR pricing documented in [docs/domain-plan.md](file:///F:/shiftandtip/docs/domain-plan.md).

### Local Workspace Status
- `F:\shiftandtip-assets`: Deleted (fully hosted on GitHub).
- `F:\shiftandtip`: Kept clean (~40 MB).
- Safe cleanup reclaimed: ~4.86 GB (ms-playwright, npm cache, debug scripts).

---

## 2. FileBrik Status

- **Status**: STOPPED at Phase 2 Gate 1.
- **Condition**: `stitch_filebrik_browser_tools_ui.zip` was deleted during safe cleanup.
- **Action Required**: Please download the Stitch zip to `C:\Users\prave\Downloads`.

---

## 3. Pending Human Actions (Phase 0 & Phase 2 Gates)

1. **Secrets Backup**: Run `F:\create-backup.cmd` (or double-click it on `F:\`) and type the encryption password to generate `F:\shiftandtip-secrets.7z`.
2. **FileBrik Stitch Zip**: Download the Stitch zip to `C:\Users\prave\Downloads\stitch_filebrik_browser_tools_ui.zip`.
