# Shift & Tip: Custom Domain Architecture & Migration Plan

A readiness blueprint for upgrading from `shiftandtip.blogspot.com` to a branded custom `.com` domain.

---

## 1. Top 3 Available `.com` Options

All 3 domains verified as unregistered and immediately available via Verisign RDAP authoritative `.com` registry check on 2026-11-25:

| Option | Domain Name | Brand Alignment & Rationale | Registrar Price (INR) |
|---|---|---|---|
| **Option 1 (Recommended)** | `shiftandtip.com` | **Exact Brand Match**: Perfect parity with site title, branding, and assets. 100% brand retention, easiest for users to remember. | **₹865 – ₹895 / yr** ($10.37 on Porkbun / Cloudflare at-cost; ~₹599 1st yr on Namecheap) |
| **Option 2** | `shiftandtipcalc.com` | **High-Intent Search Match**: Highlights calculation tooling directly in the URL; excellent CTR for utility search queries. | **₹865 – ₹895 / yr** (~₹599 1st yr promotion) |
| **Option 3** | `tippaycheck.com` | **Broad Category Keyword**: Captures both tip pooling and paycheck/overtime calculations under a concise 12-character commercial domain. | **₹865 – ₹895 / yr** (~₹599 1st yr promotion) |

---

## 2. Registrar Price Comparison in Indian Rupees (INR)

| Registrar | First Year Price (INR) | Annual Renewal (INR) | WHOIS Privacy | Recommendation |
|---|---|---|---|---|
| **Cloudflare Registrar** | ~₹870 (At-cost, $10.44 USD) | ~₹870 (Zero markup forever) | Free Lifetime | **Best long-term value** |
| **Porkbun** | ~₹865 ($10.37 USD) | ~₹865 ($10.37 USD) | Free Lifetime | Excellent UI & instant DNS |
| **Namecheap** | ~₹599 (promo coupon) | ~₹1,150 (~$13.98 USD) | Free Lifetime | Popular starter option |
| **GoDaddy** | ~₹499 (1st year promo) | ~₹1,499+ (High renewal + privacy fees) | Paid add-on | Not recommended due to renewals |

---

## 3. Blogger Custom-Domain Setup Steps

Once the domain is purchased (e.g. `shiftandtip.com`), follow these exact steps to connect it to Blogger without downtime:

1. **In Blogger Dashboard**:
   - Go to **Settings** → **Basic** → **Publishing** → **Custom domain**.
   - Enter `www.shiftandtip.com` (Blogger requires a subdomain prefix such as `www`).
   - Click **Save**. Blogger will display two required CNAME records for verification:
     - **CNAME 1**: Name: `www` → Destination: `ghs.google.com`
     - **CNAME 2**: Name: `<unique-token>` → Destination: `<unique-token>.googlehosted.com`
2. **In Your Domain Registrar DNS Manager**:
   - Create the two CNAME records provided by Blogger.
   - Create 4 root `A` records pointing the naked domain (`shiftandtip.com`) to Google's redirect IPs:
     - `216.239.32.21`
     - `216.239.34.21`
     - `216.239.36.21`
     - `216.239.38.21`
3. **Activate Redirect & SSL in Blogger**:
   - Return to Blogger Settings and click **Save** on the custom domain.
   - Toggle **Redirect shiftandtip.com to www.shiftandtip.com** to ON.
   - Under **HTTPS**, toggle **HTTPS availability** to ON. Once the Google SSL certificate issues (~15–60 minutes), toggle **HTTPS redirect** to ON.

---

## 4. Redirect Behavior from `blogspot.com`

- **Automatic 301 Permanent Redirect**:
  Google Blogger automatically configures an internal 301 HTTP redirect from `shiftandtip.blogspot.com/*` to `www.shiftandtip.com/*`.
- **Search Equity Preservation**:
  Search engines (Google, Bing) transfer indexation history, PageRank, and keyword rankings to the new custom domain via the 301 redirects.
- **Sitemap Transition**:
  `/sitemap.xml` and `/sitemap-pages.xml` will automatically serve clean XML referencing the new `www.shiftandtip.com` canonical URLs.

---

## 5. Monetization & Ad Network Impact

| Network | Minimum Traffic Requirement | Blogspot Allowed? | Custom Domain Impact |
|---|---|---|---|
| **Google AdSense** | None (Content quality & policy compliance) | **Yes** (via Blogger Earnings tab) | **Positive**: Upgrading to a custom domain enhances publisher trust score. If applying on `.blogspot.com`, approval transfers, but adding the custom domain in the AdSense Sites dashboard takes 1–3 business days for domain re-verification. |
| **Mediavine Journey** | 10,000 monthly sessions | **No** (Strict requirement) | **Prerequisite**: Journey exclusively accepts top-level custom domains. A `.com` is mandatory to monetize with high-RPM premium video/display units once traffic reaches 10k sessions. |
| **Raptive (AdThrive)** | 25,000–100,000 monthly pageviews | **No** (Strict requirement) | **Prerequisite**: Raptive exclusively partners with independent publisher custom domains with high US audience share. Moving to a `.com` unlocks eligibility for $25–$45 RPM premium programmatic demand. |

---

## Recommendation & Decision Checkpoint
- **Recommended Action**: Secure **`shiftandtip.com`** on Cloudflare or Porkbun for ~₹865/year ($10.37 USD) to protect the exact brand identity before public traffic scales.
