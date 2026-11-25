# Shift & Tip Manual Steps, UI Flows & Operational Runbook

> Run locally when needed:
> ```bash
> git clone https://github.com/pravesh62689/shiftandtip.git
> cd shiftandtip
> npm ci
> npx playwright install chromium
> ```

---

## 1. Google Auth Platform & OAuth Status (Production)
To ensure refresh tokens do not expire after 7 days:
1. Go to **Google Cloud Console** > **APIs & Services** > **OAuth consent screen** (or Google Auth Platform).
2. **Branding**:
   - App name: `Shift & Tip`
   - User support email: Select your verified Google account email.
   - App logo: (optional).
   - Application home page: `https://shiftandtip.blogspot.com`
   - Application privacy policy link: `https://shiftandtip.blogspot.com/p/privacy-policy.html`
   - Application terms of service link: `https://shiftandtip.blogspot.com/p/terms-of-service-disclaimers.html`
   - Developer contact email: Your email.
   - Click **Save and Continue**.
3. **Audience / Publishing Status**:
   - Change Publishing status from **Testing** to **In production** by clicking **Publish App** -> **Confirm**.
4. **Re-mint OAuth Token**:
   - Run `node scripts/pw/auth-flow.mjs` locally.
   - Complete Google login and consent in Chrome (`Advanced` -> `Go to Shift & Tip (unsafe)` -> `Continue` / `Allow`).
   - Token is refreshed and written to `secrets/token.json`.
   - Update the GitHub secret `BLOGGER_TOKEN_JSON` with the new token content.

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
