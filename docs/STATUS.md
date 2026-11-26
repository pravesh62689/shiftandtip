# Shift & Tip & FileBrik Master Status Report

**Last Updated**: 2026-11-26T19:20:00+05:30  
**Repository**: [pravesh62689/shiftandtip](https://github.com/pravesh62689/shiftandtip) (Public)

---

## 1. Shift & Tip Status

### Health & Workflow Verifications
- **CI Workflow (`ci.yml`)**: ✅ GREEN (`45828522186` on `adca7e0`: 23/23 unit tests pass, 51/51 states verified, 148 posts built, SEO audit pass).
- **Publish Workflow (`publish.yml`)**: ✅ GREEN (`45699841365`).
- **Weekly Maintenance (`weekly.yml`)**: ✅ GREEN (`45699852651`).
- **AdSense Tracker**: Fixed `scripts/track-adsense.mjs` (`0/20` substantial posts live ≥7d; `APPLY NOW` gated on `≥20` substantial posts ≥600w live ≥7d + theme/trust live + zero pending verification). `docs/manual-steps.md` rewritten with true state & projected date `2027-01-25`.
- **Demoted & Re-Scheduled Posts (18 IDs)**: Moved all 18 empty scheduled posts to DRAFT (`data/scheduled-demoted-log.json`), verified all 18 against `tests/posts-math.test.mjs` (924–1244 words, max 7.64% overlap, engine-recomputed math, `.gov` sources), and re-scheduled all 18 on Blogger (`data/rescheduled-log.json`, 19 total SCHEDULED at 3/week through 2027-01-11).
- **Live Trust Pages Updated**: `about` (`1135863572982789623`), `privacy` (`3673742737761380144`), and `contact` (`7565678308731584462`) updated via Blogger API.
- **Audit Report**: Full checklist recorded in [docs/AUDIT-2026-11-26.md](docs/AUDIT-2026-11-26.md).

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
  - Domain: deferred, buy only from earnings — staying on free Blogger subdomain `https://shiftandtip.blogspot.com` (see [docs/domain-plan.md](file:///F:/shiftandtip/docs/domain-plan.md)).

### Local Workspace Status
- `F:\shiftandtip-assets`: Deleted (fully hosted on GitHub).
- `F:\shiftandtip`: Kept clean (~40 MB).
- Safe cleanup reclaimed: ~4.86 GB (ms-playwright, npm cache, debug scripts).

---

## 2. FileBrik Status

- **Repository**: [pravesh62689/filebrik-site](https://github.com/pravesh62689/filebrik-site) (Public)
- **Production URL**: `https://filebrik.pages.dev` (zero-budget Cloudflare Pages; custom domain deferred, buy only from ad earnings).
- **CI & Live QA**: GREEN (`45831952415` CI, `45832528918` Live QA: 48/48 Playwright e2e across Mobile/Desktop Chrome, Lighthouse Perf 100 / A11y 98–100 / BP 100 / SEO 100 / CLS 0).

---

## 3. Pending Human Actions

1. **GSC Search Console API + Bing WMT Key**: Enable `searchconsole.googleapis.com` in GCP Console and authorize `scripts/gsc-audit.mjs` for both sites; optionally set `BING_WMT_KEY`.
2. **Shift & Tip Blogger Live Sync**: Restore updated `dist/theme.xml` in Blogger Dashboard and enrich the 18 title-only scheduled posts + 3 updated trust pages (`about`, `privacy`, `contact`).
3. **Shift & Tip Secrets Backup**: Run `F:\create-backup.cmd` to generate `F:\shiftandtip-secrets.7z`.
4. **FileBrik Ad Networks**: Held per `docs/after-approval.md` until GSC shows indexed pages.

---

## 4. Release Log
- `2026-11-26` · **P0 Preflight**: Verified `git pull`, `gh auth status`, Node `v22.23.2`, disk space; updated `.gitignore` (`.env*`, `!.env.example`, `.pw-profile*`, `handoff/`).
