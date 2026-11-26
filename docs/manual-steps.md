# ⏳ AdSense Readiness Status: NOT YET READY (0/20 Substantial Posts Live 7+ Days)

> [!NOTE]
> **True State (2026-11-26):** 0 substantial posts (≥600 words) have been live for 7+ days (the 7 currently live tool posts are 136–201 words each; 19 scheduled posts at 3/week begin Dec 1, 2026).
> **Projected AdSense Application Date:** **2027-01-25** (7 days after the 20th substantial post goes live at 3 posts/week, once updated theme and trust pages are verified live with zero "pending verification" notices).

---

# Shift & Tip Manual Steps, UI Flows & Operational Runbook

> Run locally when needed:
> ```bash
> git clone https://github.com/pravesh62689/shiftandtip.git
> cd shiftandtip
> npm ci
> npx playwright install chromium
> ```

---

## 1. Google Auth Platform & OAuth Status (Testing — ₹0 Policy)
Because `blogspot.com` / `pages.dev` cannot be authorized for a Production OAuth app without buying a domain, the OAuth app stays in **Testing** (refresh tokens expire every 7 days):
- **Every 6 days:** `npm run reauth` → click **Allow** twice (Main profile `rathore.monty2002@gmail.com` on `48121`, FileBrik profile `praveshrathore2002@gmail.com` on `48122`). This refreshes `secrets/token.json`, `secrets/token-gsc-shiftandtip.json`, `secrets/token-gsc-filebrik.json`, and updates `BLOGGER_TOKEN_JSON` in GitHub Secrets.
- If a token expires, `weekly.yml` and `publish.yml` automatically pause publishing and open a GitHub issue (`Re-auth needed: run npm run reauth`).

---

## 2. Blogger Theme Restore & Updates
If the Blogger theme ever needs to be manually restored or refreshed:
1. Open **Blogger Dashboard** (`https://www.blogger.com/blog/themes/...`).
2. Click the three dots (⋮) next to "Customize" -> **Restore**.
3. Click **Upload** and select:
   - Latest production theme: `dist/theme.xml`
   - Or safe rollback backup: `backups/theme-backup-2026-11-25.xml`
4. Confirm message "Theme restored".

---

## 3. Google Search Console (GSC) Submission
1. Open https://search.google.com/search-console.
2. Select property `https://shiftandtip.blogspot.com/`.
3. Under **Indexing** > **Sitemaps**, submit:
   - `sitemap.xml`
   - `sitemap-pages.xml`
4. Verify both sitemaps return status **Success**.

---

## 4. Bing Webmaster Tools Import
1. Open https://www.bing.com/webmasters.
2. Sign in with Google and choose **Import from Google Search Console**.
3. Select `https://shiftandtip.blogspot.com/` and confirm import.
4. Verify sitemaps `sitemap.xml` and `sitemap-pages.xml` are detected and processed.

---

## 5. Google Analytics 4 (GA4) Verification
- Measurement ID: `G-Z9X42PTBP3` (stored in `data/ga4.json`).
- Blogger Dashboard > **Settings** > **Google Analytics Measurement ID**: confirm `G-Z9X42PTBP3` is saved.

---

## 6. Cloudflare Pages Asset Mirror
- Repository: `pravesh62689/shiftandtip-assets`
- Cloudflare Pages domain: `https://shiftandtip-assets.pages.dev`
- Serves static assets, minified tool bundles, and web fonts.
