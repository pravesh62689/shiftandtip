# Shift & Tip AdSense Activation & Revenue Playbook (After Approval)

This document outlines the exact, step-by-step procedure to activate advertising and monetization on Shift & Tip once Google AdSense approves the site application (`https://shiftandtip.blogspot.com`).

---

## 1. Approval Verification Checklist
Before enabling ads, verify the following prerequisites are met:
- [ ] Official Google AdSense approval email received ("Your site is now ready to serve ads").
- [ ] Publisher ID confirmed (`pub-XXXXXXXXXXXXXXXX`).
- [ ] Google-certified CMP (Consent Management Platform) message created in AdSense > **Privacy & messaging** for GDPR and CPRA.
- [ ] Form W-8BEN submitted in AdSense > **Payments** > **Payments info** with tax treaty benefits claimed to prevent 30% foreign withholding.

---

## 2. Configuration & Build Updates
Once approved, activate the build-time ad placement gates in the codebase:

1. **Update `config.mjs`**:
   ```javascript
   export const ADS_ENABLED = true;
   export const ADS_CLIENT = 'ca-pub-XXXXXXXXXXXXXXXX'; // Replace with approved Publisher ID
   export const ADS_SLOT_TOP = '1234567890';
   export const ADS_SLOT_BOTTOM = '0987654321';
   ```

2. **Rebuild Theme and Posts**:
   ```powershell
   cd F:\shiftandtip
   npm run build:theme
   npm run build:posts
   npm run audit
   ```
   *Verification*: Confirm that ad wrappers (`<div class="ad-container">`, `<ins class="adsbygoogle" ...>`) render only with valid non-placeholder client IDs and slot IDs.

3. **Deploy Updated Theme to Blogger**:
   - In Blogger Dashboard > **Theme** > ▾ > **Restore** > Upload `dist/theme.xml`.
   - Ensure the sticky footer CMP trigger ("Manage privacy choices") remains fully operational.

4. **Update Published Posts & Pages**:
   - Run `node scripts/publish-blogger.mjs` to patch the rebuilt HTML content across all live tools and guides.

---

## 3. Custom Ads.txt Configuration
In Blogger Dashboard:
1. Navigate to **Settings** > **Monetization**.
2. Toggle **Enable custom ads.txt** to ON.
3. Paste the authorized seller declaration:
   ```text
   google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
   ```
   *(Replace `pub-XXXXXXXXXXXXXXXX` with your exact publisher ID without the `ca-` prefix).*
4. Verify publicly via browser or curl:
   ```powershell
   curl https://shiftandtip.blogspot.com/ads.txt
   ```
   Ensure it returns HTTP 200 with the exact line.

---

## 4. Ad Placement Guidelines & Core Web Vitals Protection
To maintain mobile performance $\ge 90$ and CLS $< 0.05$:
- **Zero Shift Mounting**: All ad slots are hard-coded with CSS `min-height: 250px` or `min-height: 280px` (`ad-container--fixed`) to prevent layout shifts when ads load.
- **Asynchronous Script**: The `adsbygoogle.js` library is loaded asynchronously (`async`) and deferred until after critical CSS and UI font assets have parsed.
- **Placement Limits**:
  - Max 1 unit above the fold on desktop (sidebar only, zero intrusive popups).
  - 1 unit directly below the primary calculation receipt card.
  - 1 unit mid-content in long-form guides ($\ge 900$ words).
- **No Auto-Ads on Interactive Tool Mounts**: Auto-ads must be excluded from `#tool-mount` elements via AdSense page exclusion controls to prevent calculator breakage.

---

## 5. Ongoing Monitoring & Earning Optimization
- **Weekly Revenue Check**: Review RPM, CTR, and viewability in AdSense dashboard.
- **Core Web Vitals Check**: Regularly run `npm run test:e2e` and check Google Search Console Core Web Vitals report to ensure FID/INP and CLS remain green.
