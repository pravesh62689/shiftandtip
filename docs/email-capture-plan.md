# Email Capture Research & Implementation Plan

Analysis of free newsletter and email capture form providers that accept India-based publisher accounts without upfront billing or credit card requirements.

---

## Provider Comparison Matrix

| Provider | Free Tier Allowance | India-Based Account Support? | Payment Card Required? | Embed Format | Recommendation |
|---|---|---|---|---|---|
| **Google Forms / Webhook** | Unlimited subscribers & emails | **Yes** (Instant via existing Google Account) | **No** | Clean native HTML `<form>` (Zero JS) | **(Recommended for Launch)** 100% reliable, zero risk of account ban. |
| **Buttondown** | Up to 100 subscribers | **Yes** (Accepts global creators) | **No** | Clean `<form action="https://buttondown.email/api/emails/embed-subscribe/..." method="post">` | **(Strong Option)** Ideal for clean, text-based statutory alerts. |
| **Brevo (Sendinblue)** | 300 emails/day, unlimited contacts | **Yes** (Requires SMS verification) | **No** | Embedded HTML snippet or Webhook | Excellent automation for state-specific autoresponders. |
| **Formspree** | 50 submissions/month | **Yes** (Accepts India accounts) | **No** | Simple POST endpoint `<form action="https://formspree.io/f/..." method="POST">` | Lightweight, forwards directly to Gmail. |

---

## Recommended Immediate Setup: Google Forms / Sheets Webhook
- **Why**: Zero risk, completely free, uses your existing verified Google account (`rathore.monty2002@gmail.com`).
- **Data Captured**:
  1. `email`: Subscriber email address
  2. `state`: User's selected US state (e.g. CA, NY, TX)
  3. `timestamp`: Date/time of subscription
- **No Pop-Ups**: In compliance with user instructions, the email capture is strictly integrated as an inline widget in the footer of `theme/theme.xml` and on `/p/state-pay-rules.html`.

---

## Action Required From User
To connect your preferred live destination:
1. **Option A (Google Sheets)**: Create a 2-question Google Form ("Email" and "State") and copy the Form Action URL into `theme/theme.xml`.
2. **Option B (Buttondown)**: Register a free account at [Buttondown.email](https://buttondown.email) and provide the username.
3. **Option C (Brevo)**: Register at [Brevo.com](https://www.brevo.com) and paste the Form ID.
