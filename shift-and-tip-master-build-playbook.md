# Shift & Tip: Master Build Playbook
**Version 1.0 · 24 Nov 2026 · Zero-budget, ad-revenue-maximised tool site on a free Blogger subdomain**

> **What this is:** the complete spec to research, design (Google Stitch), build, rank and monetise the site end to end. You run the numbered steps; Claude Code / Antigravity runs the prompts in **§19 Agent Prompt Pack**. Every section ends with a **Definition of Done (DoD)**.
>
> **An honest framing:** nobody can guarantee permanent #1 rankings or a specific income. This playbook is built to give you the best odds and the best RPM that the constraints allow (no domain, ₹0 budget). Figures marked **VERIFY** must be confirmed against the linked primary source before you ship them.

---

## 0. Global variables (replace everywhere)

| Variable | Value |
|---|---|
| `BRAND` | **Shift & Tip** |
| `BLOG_URL` | `https://shiftandtip.blogspot.com` (check availability in Phase 0; fallbacks: `shiftandtippay`, `tipandshift`) |
| `AUTHOR_NAME` | Your real name (never a fake persona) |
| `CONTACT_EMAIL` | A new dedicated Gmail, e.g. `shiftandtip.contact@gmail.com` |
| `GH_USER` | `pravesh62689` |
| `ASSETS_REPO` | `shiftandtip-assets` (public: jsDelivr needs public repos) |
| `CDN` | `https://cdn.jsdelivr.net/gh/pravesh62689/shiftandtip-assets@v1.0.0` |
| `CDN_FALLBACK` | `https://shiftandtip-assets.pages.dev` (Cloudflare Pages mirror) |
| `PUB_ID` | `ca-pub-XXXXXXXXXXXXXXXX` (after AdSense approval) |
| `BLOG_ID` | From Blogger dashboard URL (`blogID=...`) |
| `YEAR` | 2026 (rolls to 2027 on 1 Jan, see §12.9) |

### Non-negotiable red lines (breaking any of these kills revenue)
1. **No pop-unders, push-notification ads, Social Bar, Smartlinks, redirects or non-Google interstitials, ever.** Google disallows its ads on any site that contains or triggers pop-unders.
2. **No fake trust signals:** no invented usage counters, reviews, ratings, team, US address or credentials. This falls under Google's misrepresentation and spam policies, and it destroys E-E-A-T.
3. **No ad refresh.** Never re-push or reload ad units when a calculator recalculates.
4. **No ads inside the tool card or next to tap targets.** Keep ads at least 24px away from inputs and buttons, and always label them "Advertisements".
5. **No templated pages without unique data.** Every programmatic page must carry real, sourced, different numbers (scaled content abuse policy).
6. **No third-party ad code during AdSense review.**

---

## 1. Locked decisions

| Decision | Choice | Why (one line) |
|---|---|---|
| Topic | **Pay toolkit for US hourly, shift and tipped workers**: tip pool and tip-out, state overtime and double time, shift differential and blended regular rate, tipped overtime, take-home with tips, 2025–2028 federal tips and overtime deductions | Finance-tier RPM, personalised outputs that AI Overviews can't replace, weekly repeat use, weak platform-level competition |
| Audience | US, English; Spanish versions of the top 5 tools in v3 | Tier-1 RPM is 10–20× India RPM |
| Host | **Blogger (blogspot)** for HTML pages, plus **jsDelivr** (from GitHub) for JS/data, with a Cloudflare Pages mirror as fallback | Blogger is the only free subdomain with an official AdSense path; jsDelivr gives versioned, free, global JS hosting |
| Monetisation | AdSense (manual + Auto ads), then Journey by Mediavine (1K Tier-1 sessions), then Monumetric Propel (10K PV, Blogger supported), then Raptive (25K PV); affiliates as a second stream | Highest legal RPM path for a blogspot site |
| Brand | "Shift & Tip" (replaces the research's "ShiftPay") | The "ShiftPay" name space is crowded with shift-pay apps (e.g. ShiftPayTrack), which confuses branded search |
| Design | "Trustworthy payroll utility": editorial, dense, receipt and ledger motifs | Reads as a real product, not an AI template |

**DoD:** you accept these, or edit the table before Phase 1.

---

## 2. Phase 0: Accounts and local setup (Windows)

1. **Brand check:** Google `"Shift & Tip" calculator` and `"shiftandtip"`. Search USPTO trademarks (tmsearch.uspto.gov) for "SHIFT & TIP". If there's a conflict, pick a fallback and find-replace `BRAND` and `BLOG_URL`.
2. **Google account:** use the account that will own AdSense permanently. AdSense allows one account per payee, so if you already have one (e.g. from YouTube), you will link that same account.
3. **Create the blog:** blogger.com → New blog → Title `Shift & Tip` → Address `shiftandtip` → Display name: your real name.
4. **Blogger Settings baseline** (Settings page):
   1. Basic → Description: "Free pay calculators for tipped and hourly workers: tip pools, overtime, double time, shift differentials, with each state's rules."
   2. Basic → Google Analytics property ID: add later (§15).
   3. HTTPS → HTTPS redirect **ON**.
   4. Permissions → Blog readers **Public**.
   5. Posts → Max posts on main page **10**; Image lightbox **OFF**.
   6. Comments → Location **Hide** (less JS, no spam; revisit in v3).
   7. Formatting → Time zone **America/New_York**.
   8. Meta tags → Enable search description **ON** and fill it in.
   9. Errors and redirections → custom 404 (paste the HTML from §11.6).
   10. Crawlers and indexing → set it up in §12.2.
   11. Monetisation → Custom ads.txt: leave **OFF** until §13.6.
5. **Install tools** (skip any you have): Node.js LTS, Git, Claude Code. Then, in PowerShell:
   ```powershell
   mkdir D:\shiftandtip; cd D:\shiftandtip
   git init
   npm init -y
   npm i -D esbuild gray-matter marked
   npm i googleapis @google-cloud/local-auth
   mkdir design, design\exports, design\screens, theme, src\engine, src\ui, data, content\tools, content\states, content\guides, templates, scripts, dist, tests, secrets
   "secrets/`nnode_modules/`n.env" | Out-File -Encoding utf8 .gitignore
   ```
6. **GitHub:** create the public repo `shiftandtip-assets` (it will hold only `dist/` JS, CSS, fonts and data). Keep the main project repo private.
7. **Cloudflare Pages (fallback CDN):** connect `shiftandtip-assets` → project name `shiftandtip-assets` → build command none → output directory `/`.

**DoD:** the blog exists at `BLOG_URL`, the local folder is scaffolded, and the assets repo is live.

---

## 3. Phase 1: Stitch MCP setup (do this first)

1. Store the key as a user environment variable. **Never paste it into chat or commit it.**
   ```powershell
   setx STITCH_API_KEY "PASTE_YOUR_KEY_HERE"
   ```
   Close every terminal and open a new one, so the variable is picked up.
2. Create `D:\shiftandtip\.mcp.json`. It is safe to commit, because the key comes from the environment:
   ```json
   {
     "mcpServers": {
       "stitch": {
         "type": "http",
         "url": "https://stitch.googleapis.com/mcp",
         "headers": { "X-Goog-Api-Key": "${STITCH_API_KEY}" }
       }
     }
   }
   ```
   Alternative (user scope, one line in PowerShell; this stores the expanded key in `%USERPROFILE%\.claude.json`):
   ```powershell
   claude mcp add stitch --transport http https://stitch.googleapis.com/mcp --header "X-Goog-Api-Key: $env:STITCH_API_KEY" -s user
   ```
3. Open the project in Claude Code: `cd D:\shiftandtip; claude`, then run `/mcp`. Expect `stitch · connected`. Approve the project-scoped server when asked.
4. Ask the agent to **list the Stitch tools**. Expected tools include create_project, list_projects, generate_screen_from_text, edit_screens, generate_variants, get_screen, list_screens and download_file. Exact names can change, so map them to §5.5.
5. Optional: Google's skills pack, `npx plugins add google-labs-code/stitch-skills --scope project --target claude-code`.
6. **Quota:** check your generation quota in Stitch settings (one guide said 350/month; unverified). The loop in §5.5 is capped at about 60 generations in total.
7. If a key ever leaks, delete it in Stitch settings and create a new one.

**DoD:** `/mcp` shows Stitch connected, and the agent lists its tools.

---

## 4. Phase 2: Design system (`design/DESIGN.md`, upload this to Stitch)

Save everything inside the block below as `design/DESIGN.md`. Upload it to the Stitch project, or paste it at the top of the first prompt.

```markdown
# Shift & Tip — Design System v1

## Product & voice
Free pay calculators for US restaurant servers, bartenders, bussers, nurses, warehouse
and hourly trades workers, plus the managers who run tip pools. Feels like a payroll
utility built by a small, careful team: precise, calm, editorial, zero hype.
Voice: plain US English, second person, numbers first. Never: "unlock", "supercharge",
"seamless", "revolutionary", exclamation marks, emoji.

## Typography (all free on Google Fonts; self-hosted woff2 subsets in production)
- Display/headings: Source Serif 4, weight 600, optical size on. H1 38/44, H2 28/34, H3 20/28.
- UI/body: Public Sans, weights 400/600. Body 17/28 (mobile 16/26), UI 15/22, small 13/18.
- Numbers in results/tables: IBM Plex Mono 500, tabular figures, slightly larger (+1px).
- Max line length 68ch. Sentence case for all headings and buttons.
- BANNED fonts: Inter, Poppins, Montserrat, Roboto as display.

## Colour (light only in v1)
--ink #16201C (text)        --ink-2 #3D4A44 (secondary)   --muted #5E6B65
--paper #F7F6F1 (page bg)   --surface #FFFFFF (cards)     --line #E3E0D6  --line-2 #CFCABB
--ledger #0E6B4C (primary, links, focus) --ledger-600 #0A5039 (hover) --ledger-50 #E7F1EC
--receipt #A85400 (accent text, highlights only) --receipt-50 #FBF1E3
--danger #B42318  --ad-bg #F1EFE8
Rules: one primary colour, accent used for at most 1 highlight per screen. No gradients,
no glassmorphism, no purple/indigo/violet, no neon, no drop shadows heavier than
0 1px 2px rgba(22,32,28,.06). Borders do the work. All text pairs >= 4.5:1 contrast.

## Spacing, grid, shape
4px base: 4 8 12 16 24 32 48 64. Desktop: 12 cols, 1200px max, 24px gutters;
content 8 cols + 300px sidebar. Article body 680px. Mobile: 1 col, 16px side padding.
Radius: 6px inputs/buttons, 10px cards, 999px chips only. 1px borders.

## Signature motifs (use sparingly, they make it ours)
- Receipt result card: white card, dashed 1px divider (--line-2), perforated top edge
  (small semicircle notches), totals line in mono, "Allocated $X of $X" check line.
- Ledger lines: faint 1px horizontal rules behind data tables.
- "Rules verified" badge: small pill, --ledger-50 bg, --ledger text, calendar glyph,
  e.g. "Rules verified Dec 2026".
- Source footnotes: tiny superscript numbers linking to official sources (dol.gov, irs.gov).

## Components
- Input: 44px height, label above (600, 14px), helper text below (13px muted), unit
  affixes inside field ("$", "hrs", "%"). Focus: 2px --ledger ring, offset 2px.
- Segmented control: 3-4 options, 40px, active = --ink bg / white text.
- Editable staff table (desktop) → stacked row-cards (mobile), each with role select,
  name (optional), hours, points, remove icon; "+ Add person" text button.
- Buttons: primary solid --ledger; secondary outline; tertiary text link. One primary per view.
- State picker: searchable select with recent states on top.
- Tables: zebra rows (#FAFAF7), sticky header, right-aligned numbers, mono figures.
- Breadcrumbs, "Copy link", "Print", "Export CSV", "Save preset" icon+label actions.
- Callout: left 3px border --receipt, --receipt-50 bg, for "Watch out" legal notes.

## Ad containers (must appear in every design where specified)
Light --ad-bg block, radius 10px, label "ADVERTISEMENTS" 11px/600 uppercase, letter-spacing
.08em, --muted, centred above the ad. Fixed reserved heights: mobile in-content 300px,
desktop in-content 280px, desktop sidebar 600px (sticky), mobile anchor 60px bottom.
Never inside tool cards. Minimum 24px from any input or button.

## Banned AI-template patterns
Centered hero with two CTA buttons; gradient blobs; 3-up icon-in-circle feature cards;
testimonials; logo walls; fake stats ("10,000+ users"); "Get started" buttons;
stock 3D illustrations; emoji; lorem ipsum; dark-mode-by-default neon; oversized
rounded-2xl everything; generic "Features / Pricing / FAQ" landing structure.
```

**DoD:** `design/DESIGN.md` is saved and uploaded to the Stitch project "Shift & Tip v1".

---

## 5. Phase 3: Stitch generation and the regeneration loop

### 5.1 Screens to produce (in this order)
| # | Screen | Device | Purpose |
|---|---|---|---|
| S0 | Component sheet | Desktop | Locks the visual language before pages |
| S1 | Tip pool calculator (tool page) | Desktop and mobile | Main money page template |
| S2 | California overtime and double time (state tool page) | Mobile, then desktop | Programmatic template |
| S3 | Home | Desktop and mobile | Hub and brand |
| S4 | State pay rules hub (data table) | Desktop | Programmatic hub |
| S5 | Guide/article | Desktop and mobile | Content template |
| S6 | About and methodology | Desktop | E-E-A-T |
| S7 | Privacy policy | Desktop | AdSense requirement |
| S8 | 404 | Mobile | Recovery |

### 5.2 Prompt rules (apply to every screen)
- Use Stitch's three layers in this order: **ANATOMY** (structure), then **VIBE** (aesthetic, pointing at DESIGN.md), then **CONTENT** (real copy and numbers).
- Always end with the **AVOID** line from DESIGN.md.
- Use realistic sample numbers. Rule values in the mocks are placeholders; the build replaces them with verified data from `data/states.json`.
- If the tool has a model or quality option, use the fastest mode for the first pass and the highest-quality mode for the final pass.

### 5.3 Copy-paste prompts

**S0: Component sheet**
```text
ANATOMY: A desktop "design system sheet" page for Shift & Tip. Sections in a 2-column
grid: (1) Type scale specimen — Source Serif 4 H1/H2/H3, Public Sans body/UI/small,
IBM Plex Mono result numbers "$1,240.00". (2) Colour swatches with names and hex.
(3) Inputs: default, focus, error ("Enter hours between 0 and 24"), with "$" and "hrs"
affixes. (4) Segmented control "Hours | Points | Hours × points | % share".
(5) Buttons primary/secondary/text. (6) Receipt result card with perforated top edge,
dashed divider, 5 payout rows in mono, check line "Allocated $1,240.00 of $1,240.00".
(7) Data table with zebra rows and sticky header. (8) "Rules verified Dec 2026" badge,
breadcrumb, callout "Watch out: managers can't share in the tip pool under federal law."
(9) Ad container examples: in-content 300px mobile, 280px desktop, sidebar 300×600,
each labelled "ADVERTISEMENTS".
VIBE: follow DESIGN.md exactly. Calm, precise, payroll-utility, editorial.
CONTENT: real labels as written above.
AVOID: gradients, purple/indigo, glassmorphism, Inter/Poppins, emoji, icon circles,
lorem ipsum, fake stats, testimonials.
```

**S1: Tip pool calculator (desktop; then regenerate as mobile)**
```text
ANATOMY: Desktop tool page. Top bar: wordmark "Shift & Tip" (Source Serif 4 600) +
nav "Tip tools · Overtime · Shift pay · State rules · Guides" + small search field.
Breadcrumb "Tip tools / Tip pool calculator". H1 "Tip pool calculator".
One-line promise: "Split tonight's tips by hours, points or percentage — with tip-outs
taken off the top." Badge "Rules verified Dec 2026".
Main column (8 cols):
 1) Input card: "Total tips" ($1,240.00); "Net sales (for tip-outs)" ($8,000.00);
    segmented "Split by: Hours | Points | Hours × points | % share" (Hours active);
    editable staff table with 5 rows — Server · Maya · 6.5 h; Server · Luis · 7 h;
    Bartender · Dana · 8 h; Busser · Theo · 5 h; Host · Priya · 4 h; "+ Add person";
    tip-out row "Kitchen · 3% of net sales = $240.00" with "+ Add tip-out".
    Results update live (no Calculate button); small "Use example" and "Reset" links.
 2) Receipt result card directly under the input card: perforated top edge, rows
    Maya $213.11 · Luis $229.51 · Dana $262.30 · Theo $163.93 · Priya $131.15,
    each with effective $/hr in muted mono; dashed divider; "Kitchen tip-out $240.00";
    check line "Allocated $1,240.00 of $1,240.00"; actions Save preset · Copy link ·
    Print · Export CSV.
 3) AD: full-width "ADVERTISEMENTS" container, 280px tall, 32px below the result card.
 4) "How this was calculated" — 3 numbered steps with the actual arithmetic.
 5) AD: second in-content container 280px.
 6) "Tip pooling rules by state" accordion (3 sample states open/closed) with
    superscript source links; callout "Watch out: under federal law, managers and
    supervisors can't keep tips from the pool."
 7) FAQ (5 questions), then "Related calculators" as a 3-row list (not cards),
    then a 6-tile "Multiplex" ad grid placeholder labelled "ADVERTISEMENTS".
Right sidebar (300px): "Saved presets" mini card (2 presets: "Fri dinner", "Sun brunch"),
below it a sticky 300×600 ad container.
Footer: About · Methodology · Privacy · Terms · Contact · "Estimates, not legal or tax advice."
VIBE: DESIGN.md. Precise, receipt-like, quiet confidence. Dense but breathable.
AVOID: gradients, purple, glass, Inter, emoji, icon circles, centered hero, fake stats.
```
Mobile variant addition:
```text
Same page as MOBILE (390px). Staff table becomes stacked row-cards (role select +
hours field on one line, name optional on second line). Result card full width.
First in-content ad (300px) below the result card. Sidebar content moves below FAQ.
Bottom 60px anchor ad placeholder. Thumb-reachable controls, 44px min touch targets.
```

**S2: California overtime and double time (state tool page; mobile first)**
```text
ANATOMY: MOBILE tool page. Breadcrumb "Overtime / California". H1 "California overtime
& double time calculator". Promise line "Daily overtime after 8 hours, double time
after 12, and the seventh-day rule — applied automatically." Badge "Rules verified Dec 2026".
Input card: hourly rate ($20.00); week grid of 7 day inputs Mon–Sun with hours
(10, 8, 12.5, 9, 8, 0, 0); toggle "Add a shift differential"; toggle "Add a bonus".
Receipt result card: Regular 40.0 h · Overtime 1.5× 7.0 h · Double time 2× 0.5 h;
Gross $1,030.00; comparison line "Federal-only rules would pay $1,025.00 (+$5.00 in CA)".
Per-day breakdown mini table (day, reg, OT, DT) in mono.
AD container 300px below the result card.
"What's different in California" — 3 bullet rules with source superscripts (dir.ca.gov).
Worked example in prose. AD container 300px. FAQ (4). "Other states with daily overtime:
Alaska · Colorado · Nevada" chips. Multiplex ad grid. Anchor ad 60px.
VIBE: DESIGN.md; data-dense, trustworthy; the comparison line uses --receipt accent.
AVOID: gradients, purple, glass, Inter, emoji, icon circles, fake stats.
```

**S3: Home**
```text
ANATOMY: Desktop homepage. Top bar as S1. Hero left-aligned in 7 columns: kicker
"Free · No sign-up · 2026 state rules"; H1 "Pay math for people who work shifts.";
subline "Tip pools, overtime, double time and take-home pay — calculated with your
state's rules and the source linked."; single text link "See all 7 calculators →".
Right 5 columns: a working mini tip-split receipt card ($1,240.00 across 5 staff,
kitchen tip-out 3%).
"Calculators" as a LIST (not icon cards): 7 rows — name, the question it answers in
quotes, small arrow: Tip pool "How much does each of us get tonight?"; Tip-out "What
do I owe the bar and bussers?"; Overtime & double time "Was my overtime paid right?";
Shift differential "What's my real overtime rate with night pay?"; Tipped overtime
"What cash wage do I get for overtime hours?"; Take-home with tips "What lands in my
account?"; Tips & overtime deduction "How much could the 2025–2028 deduction save me?".
AD: full-width 90px leaderboard container below the list.
"Check your state" strip: chips CA TX FL NY IL PA OH GA NC MI NV WA + "All states".
"Rules we track" table preview: Federal $7.25 / $2.13 / none; Texas follows federal;
California same as minimum (no tip credit) / daily OT after 8 h; Colorado daily OT
after 12 h; Nevada daily OT after 8 h (conditions) — with "Verified" column.
"Latest guides" — 3 rows with date and read time; 300×250 ad container in right column.
Footer as S1. Mobile variant: same order, anchor ad 60px.
VIBE: DESIGN.md. Editorial newspaper-utility hybrid, asymmetric, generous whitespace.
AVOID: centered hero, two CTAs, gradients, icons in circles, testimonials, logos,
fake usage numbers, emoji, Inter.
```

**S4: State pay rules hub**
```text
ANATOMY: Desktop hub "State pay rules for tipped & hourly workers (2026)". Intro 2 lines
+ "Rules verified Dec 2026" + "How we verify" link. Leaderboard ad container below intro.
Filter bar: search state, toggles "Daily overtime", "No tip credit", region select.
Sortable 51-row table (show 12 rows): State | Minimum wage | Tipped cash wage |
Max tip credit | Daily OT | Double time | Verified | → calculator link.
Ledger-line background, sticky header, mono numbers, zebra rows. After row 10, a
table-width in-feed ad band (labelled). Right sidebar: "Most-used state calculators"
list + sticky 300×600 ad. Footer.
VIBE: data-journalism table; sober; precise.
AVOID: gradients, purple, glass, Inter, emoji, chart junk.
```

**S5: Guide/article**
```text
ANATOMY: Desktop article "Is tip pooling legal? Rules for owners and staff (2026)".
Byline: author photo placeholder, "{AUTHOR_NAME}", role "Editor, Shift & Tip",
"Updated Dec 2026 · 8 min read · Sources: 6". Key takeaways box (4 bullets).
Sticky table of contents in left gutter. 680px body with H2s. In-article ad container
after paragraph 3 and after paragraph 8 (250px, labelled). Embedded mini tip-split
calculator mid-article. Callout "Check your state" linking to the hub. Sources list
(numbered, dol.gov/irs.gov style links). Author bio card. Related calculators list.
Multiplex ad grid at end. Sidebar sticky 300×600 ad.
VIBE: trustworthy finance publication; serif headings; quiet.
AVOID: hero image, stock photos, emoji, gradients, purple, Inter.
```

**S6: About and methodology**
```text
ANATOMY: Desktop single-column page. H1 "About Shift & Tip". Who runs it: real-person
bio block (photo placeholder, name, honest background "software engineer who builds
banking and payments software"). "How we verify rules" — 4-step horizontal process
(Find official source → Record value + date → Second check → Publish with source link).
"Corrections policy" + "Last corrections" log table (date, page, what changed).
"What we are not" callout: not lawyers, not tax advisers; estimates only.
No ad containers. Footer.
VIBE: plain, credible, documentary.
```

**S7: Privacy policy**
```text
ANATOMY: Desktop legal page with sticky left TOC: Information we collect · Cookies ·
Google advertising cookies and partners · Your choices (button "Manage privacy choices")
· Analytics · Local storage (saved presets stay on your device) · Children · Changes ·
Contact. Readable 680px column, numbered sections, last-updated date. No ads.
VIBE: legal readability; generous line height.
```

**S8: 404**
```text
ANATOMY: Mobile 404. Receipt card motif "Nothing to calculate here" with torn bottom
edge; search field; list of 5 calculators; link to State rules hub. No ads.
VIBE: DESIGN.md; light humour only in one line.
```

### 5.4 Anti-AI-look audit (the scoring rubric)
**Hard fails** (any one means regenerate):
1. Gradient or blob backgrounds.
2. Purple, indigo or violet anywhere.
3. A centred hero with two CTAs.
4. An icon-in-circle feature grid.
5. Emoji.
6. Fake stats, testimonials or logos.
7. Lorem ipsum.
8. Inter or Poppins visible.
9. Glassmorphism.
10. A required ad container missing, placed inside a tool card, or less than 24px from a control.
11. Body text contrast below 4.5:1.

**Scored dimensions** (100 total):
| Dimension | Pts | What "full marks" looks like |
|---|---|---|
| Information hierarchy | 15 | The tool sits above the fold on desktop, the result is instantly scannable, there's one primary action |
| Typography craft | 15 | Serif/sans/mono roles respected, tight scale, tabular numbers, 68ch max |
| Colour discipline | 10 | One primary, accent used at most once, borders over shadows |
| Real-product details | 15 | Helper text, units, verified badge, source footnotes, empty and error states, breadcrumbs |
| Tool UX | 15 | Live results, clear inputs, mobile row-cards, 44px targets, obvious reset/example |
| Ad integration | 10 | Labelled, reserved heights, native-looking furniture, density ≤30% of any mobile viewport |
| Mobile layout | 10 | Single column, thumb-reachable, no horizontal scroll, anchor clearance |
| Distinctiveness | 10 | Receipt and ledger motifs present but restrained; couldn't be mistaken for a template |

**Pass bar: ≥ 88/100 and zero hard fails.**

### 5.5 Regeneration loop (the agent runs this; prompt P2 in §19)
For each screen S0 to S8:
1. **Iteration 1:** generate_screen_from_text with the prompt. If generate_variants exists, request 3 variants.
2. **Score:** download each screenshot to `design/screens/S{n}-v{k}.png`, view it, and score it with §5.4. Log the hard fails, the scores and 3 specific fixes in `design/scores.md`.
3. **Pick** the best variant. If it scores at least 88 with no hard fails, stop and export.
4. **Fix:** call edit_screens on the best version with only the 3 specific fixes, phrased as concrete instructions (e.g. "Replace the shadow on the result card with a 1px #E3E0D6 border; move the ad container 32px lower"). Never re-send the whole prompt for small fixes.
5. **Repeat** steps 2–4 up to **6 iterations per screen**. If the screen is still below the bar, regenerate from scratch once with a sharpened ANATOMY, then take the best result.
6. **Consistency pass:** after S1 passes, add "Match the exact visual language of screen S1 (S0 component sheet)" to every later prompt.
7. **Budget guard:** stop and report when total generations reach 60.

### 5.6 Human gate and export
1. You review the top version of each screen (5 minutes per screen). Approve it or give one note.
2. The agent exports HTML and PNG for each approved screen to `design/exports/`.
3. The agent writes `design/tokens.css` and `design/components.md`, extracted from the exports. These, not the raw Stitch Tailwind, are the source of truth for the build.

**DoD:** S0–S8 approved, scores at least 88 logged, and exports plus tokens saved.

---

## 6. UX specification (implementation rules)

### 6.1 Global
- **Tool first:** on desktop, the H1 and tool inputs sit above the fold. On mobile, the first input sits above the fold.
- **Live results:** recalculate on input (debounced 150ms) and show a subtle "Updated" tick. **Never re-push ads on recalculation.**
- **Pre-filled example:** every tool loads with the example values, so the result card is never empty. This also makes the first paint meaningful.
- **Inputs:** `inputmode="decimal"` for money, and steppers for hours (0.25 increments). Accept "6:30" as 6.5 hours. Validate hours to 0–24 per day.
- **Errors:** inline messages under the field, in plain language ("Hours must be between 0 and 24").
- **Results:** mono tabular numbers, a check line that proves the totals, and per-hour effective rates.
- **Accessibility:** WCAG 2.2 AA; labels tied to inputs; `aria-live="polite"` on the result summary; visible focus rings; full keyboard operation of table rows; respect `prefers-reduced-motion`.
- **Print stylesheet:** prints the inputs and results only (no ads, nav or footer), with the URL and date. Restaurant managers print tip sheets.
- **Saved presets:** stored in `localStorage` (wrapped in try/catch), up to 10 per tool, with names. No login.
- **Share links:** the URL hash encodes inputs (`#v=1&t=124000&m=h&s=Server:6.5,...`). **Names are excluded by default**; the "Include names" checkbox is off by default.
- **CSV export** for tip pools and the weekly OT breakdown.

### 6.2 Tool-specific
| Tool | Inputs | Outputs | Edge rules |
|---|---|---|---|
| Tip pool | total tips, net sales, method, staff rows, tip-outs | per-person share, $/hr, tip-out totals, check line | warn if tip-outs exceed tips, % shares not 100, a manager is in the pool |
| Tip-out | server sales, tips, tip-out % per role (bar/busser/runner/kitchen), basis (sales/tips) | amounts owed per role, server keeps | presets for common structures, labelled "example", not "standard" |
| Overtime & double time | state, rate, 7 day hours, workweek start | reg/OT/DT hours, gross, federal comparison | AK note (4+ employees), NV pay condition, CO 12 consecutive hours note, CA alternative workweek not modelled |
| Shift differential + regular rate | base rate, shifts with differential ($ or %), bonus | blended regular rate, OT premium, gross, "naive vs correct" gap | FLSA weighted-average method; CA flat-sum bonus caveat |
| Tipped overtime | state, cash wage, tip credit, hours | OT cash wage per hour, weekly cash pay | uses state values from data; warn if cash + tips are below minimum |
| Take-home with tips | pay period, wages, cash/card tips, filing status, state | net pay estimate, FICA, federal, state (no-tax states plus a manual rate in v1) | "Estimate" labels everywhere |
| Tips & OT deduction (2025–2028) | qualified tips, FLSA OT premium, MAGI, filing status | deduction amounts, estimated federal tax change | MFS gets 0; state daily-OT premium isn't qualified unless FLSA requires it (**VERIFY**) |

**DoD:** the spec is accepted and the agent builds against it.

---

## 7. Architecture

```
            Blogger (shiftandtip.blogspot.com)
            ├─ Custom XML theme (CSS inlined in <b:skin>, ≤25 KB)
            ├─ Posts  = tools, state tools, guides   (static HTML generated by build)
            ├─ Pages  = hubs + legal (≤20 static pages)
            └─ AdSense via Earnings (hosted)  + manual units in post HTML
                         │ defer-loads
            jsDelivr  ── cdn.jsdelivr.net/gh/pravesh62689/shiftandtip-assets@vX.Y.Z
            (fallback: shiftandtip-assets.pages.dev)
            ├─ tools.min.js (≤40 KB gz)  ├─ states.json  ├─ fonts/*.woff2
```

### 7.1 Repo layout (private main repo)
```
D:\shiftandtip
├─ .mcp.json  .gitignore  package.json
├─ design\ DESIGN.md scores.md tokens.css components.md exports\ screens\
├─ theme\ theme.xml  theme.css (source; inlined into theme.xml by build)
├─ src\engine\ money.js tips.js overtime.js deductions.js rules.js
├─ src\ui\ hydrate.js presets.js share.js csv.js print.css
├─ data\ states.json  sources.md  changelog.md
├─ content\ tools\*.md  states\*.md  guides\*.md   (front matter + body)
├─ templates\ tool.html  state.html  guide.html  hub.html
├─ scripts\ build-assets.mjs build-posts.mjs publish-blogger.mjs audit-seo.mjs check-data.mjs
├─ dist\ assets\ (copied to the public assets repo)  posts\*.html
└─ tests\ engine.test.mjs
```

### 7.2 URL map (slugs never contain the year; titles do)
| Type | Blogger object | URL pattern |
|---|---|---|
| Tool | Post | `/2026/12/tip-pool-calculator.html` |
| State tool | Post | `/2026/12/california-overtime-calculator.html` |
| Guide | Post | `/2026/12/is-tip-pooling-legal.html` |
| Hub | Page | `/p/tip-tools.html`, `/p/overtime-tools.html`, `/p/shift-pay-tools.html`, `/p/state-pay-rules.html`, `/p/guides.html` |
| Trust | Page | `/p/about.html`, `/p/methodology.html`, `/p/privacy.html`, `/p/terms.html`, `/p/contact.html`, `/p/corrections.html` |

Blogger builds the slug from the title on first publish. Publish with a short slug-style title ("tip pool calculator"), then change the title to the full SEO title. Always confirm the final URL before you link to it.

**DoD:** the repo is scaffolded and the URL map is frozen.

---

## 8. Blogger theme build

### 8.1 Rules
1. Convert the Stitch exports to **hand-written CSS** using `design/tokens.css`, with BEM class names. **No Tailwind CDN.** Keep the CSS at 25 KB or less, inlined in `<b:skin>`.
2. Set `b:css='false'` to drop Blogger's default widget CSS.
3. All JS in the theme goes inside `//<![CDATA[ ... //]]>`. Escape `&` as `&amp;` in attributes.
4. Keep `<b:include data='blog' name='all-head-content'/>`; it emits canonical, description and feeds. Then **view-source and remove any duplicate tags** you add.
5. Before editing, back up the current theme (Theme → ⋯ → Backup). Blogger's editor rejects invalid XML and tells you the line, so iterate until it saves.
6. Blogger data-tag names vary between widget versions. If a tag errors, check it against Blogger's layout data tags reference (e.g. `data:post.date.iso8601` against the older `data:post.timestampISO8601`).

### 8.2 Skeleton (`theme/theme.xml`)
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html>
<html b:css='false' b:defaultwidgetversion='2' b:layoutsVersion='3' b:responsive='true' b:templateVersion='1.0.0' expr:dir='data:blog.languageDirection' expr:lang='data:blog.localeUnderscoreDelimited' xmlns='http://www.w3.org/1999/xhtml' xmlns:b='http://www.google.com/2005/gml/b' xmlns:data='http://www.google.com/2005/gml/data' xmlns:expr='http://www.google.com/2005/gml/expr'>
<head>
  <meta charset='UTF-8'/>
  <meta content='width=device-width, initial-scale=1' name='viewport'/>
  <b:include data='blog' name='all-head-content'/>
  <title><b:if cond='data:view.isHomepage'><data:blog.title/> · Free pay calculators for tipped &amp; hourly workers<b:else/><data:view.title.escaped/></b:if></title>
  <meta content='#F7F6F1' name='theme-color'/>
  <link crossorigin='anonymous' href='https://cdn.jsdelivr.net' rel='preconnect'/>
  <link as='font' crossorigin='anonymous' href='https://cdn.jsdelivr.net/gh/pravesh62689/shiftandtip-assets@v1.0.0/fonts/public-sans-var-latin.woff2' rel='preload' type='font/woff2'/>
  <b:if cond='data:view.isSingleItem'>
    <meta expr:content='data:view.title.escaped' property='og:title'/>
    <meta expr:content='data:view.url.canonical' property='og:url'/>
    <meta content='article' property='og:type'/>
    <meta content='summary_large_image' name='twitter:card'/>
  </b:if>
  <b:skin><![CDATA[
  /* ==== paste build output of theme/theme.css here (tokens + layout + components) ==== */
  ]]></b:skin>
  <!-- AdSense loader: ONLY if Blogger Earnings has NOT already injected it (check view-source) -->
  <!-- <script async='async' crossorigin='anonymous' src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX'/> -->
</head>
<body>
  <b:class cond='data:view.isPost' name='is-post'/>
  <b:class cond='data:view.isPage' name='is-page'/>
  <b:class cond='data:view.isHomepage' name='is-home'/>
  <a class='skip' href='#content'>Skip to content</a>

  <header class='topbar'>
    <b:section class='topbar__brand' id='brand' maxwidgets='1' showaddelement='false'>
      <b:widget id='Header1' locked='true' title='Shift &amp; Tip (Header)' type='Header' version='2' visible='true'>
        <b:includable id='main'>
          <a class='brand' expr:href='data:blog.homepageUrl'>Shift &amp; Tip</a>
        </b:includable>
      </b:widget>
    </b:section>
    <nav aria-label='Primary' class='topbar__nav'>
      <a href='/p/tip-tools.html'>Tip tools</a>
      <a href='/p/overtime-tools.html'>Overtime</a>
      <a href='/p/shift-pay-tools.html'>Shift pay</a>
      <a href='/p/state-pay-rules.html'>State rules</a>
      <a href='/p/guides.html'>Guides</a>
    </nav>
    <form action='/search' class='topbar__search' method='get' role='search'>
      <label class='sr-only' for='q'>Search tools</label>
      <input id='q' name='q' placeholder='Search tools' type='search'/>
    </form>
  </header>

  <div class='layout' id='content'>
    <main class='layout__main'>
      <b:section id='main' showaddelement='false'>
        <b:widget id='Blog1' locked='true' title='Posts' type='Blog' version='2' visible='true'>
          <b:includable id='main'>
            <b:if cond='data:view.isSingleItem'>
              <b:loop values='data:posts' var='post'>
                <article class='entry'>
                  <h1 class='entry__title'><data:post.title/></h1>
                  <p class='entry__meta'>By <a href='/p/about.html'>AUTHOR_NAME</a> · Updated <time expr:datetime='data:post.lastUpdated.iso8601'><data:post.lastUpdated/></time></p>
                  <div class='entry__body'><data:post.body/></div>
                </article>
              </b:loop>
            <b:else/>
              <ol class='list'>
                <b:loop values='data:posts' var='post'>
                  <li class='list__row'>
                    <a class='list__title' expr:href='data:post.url'><data:post.title/></a>
                    <p class='list__snippet'><data:post.snippets.short/></p>
                  </li>
                </b:loop>
              </ol>
              <nav class='pager'>
                <b:if cond='data:newerPageUrl'><a expr:href='data:newerPageUrl'>← Newer</a></b:if>
                <b:if cond='data:olderPageUrl'><a expr:href='data:olderPageUrl'>Older →</a></b:if>
              </nav>
            </b:if>
          </b:includable>
        </b:widget>
      </b:section>
    </main>

    <aside class='layout__side'>
      <!-- Add an HTML/JavaScript gadget here via Layout and paste the sidebar ad unit (§13.4) -->
      <b:section id='sidebar' showaddelement='true'/>
    </aside>
  </div>

  <footer class='footer'>
    <nav aria-label='Footer'>
      <a href='/p/about.html'>About</a> <a href='/p/methodology.html'>Methodology</a>
      <a href='/p/privacy.html'>Privacy</a> <a href='/p/terms.html'>Terms</a>
      <a href='/p/contact.html'>Contact</a> <a href='/p/corrections.html'>Corrections</a>
    </nav>
    <p class='footer__note'>Estimates only, not legal or tax advice. Rules link to official sources.</p>
  </footer>

  <script>//<![CDATA[
  (function(){
    if(!document.querySelector('[data-tool]')) return;
    var P='https://cdn.jsdelivr.net/gh/pravesh62689/shiftandtip-assets@v1.0.0/tools.min.js';
    var F='https://shiftandtip-assets.pages.dev/tools.min.js';
    var s=document.createElement('script'); s.src=P; s.defer=true;
    s.onerror=function(){var f=document.createElement('script'); f.src=F; f.defer=true; document.body.appendChild(f);};
    document.body.appendChild(s);
  })();
  //]]></script>
</body>
</html>
```
If `data:post.lastUpdated` errors, use `data:post.date`.

### 8.3 Sidebar gadget wrapper (show it only on posts)
After adding the HTML/JavaScript gadget, edit its includable in the theme XML:
```xml
<b:includable id='main'>
  <b:if cond='data:view.isPost'>
    <div class='ad ad--rail'><span class='ad__label'>Advertisements</span><data:content/></div>
  </b:if>
</b:includable>
```

**DoD:** the theme saves without errors, renders the home, post, page and 404 views, scores at least 95 in Lighthouse on an empty post, and contains no duplicate head tags.

---

## 9. Tool engine (the calculations are the product)

All money is in **integer cents** and all hours in **hundredths**. Pure functions, no DOM. Tests must pass before any UI work starts.

### 9.1 `src/engine/money.js`
```js
export const toCents = (v) => Math.round(Number(v) * 100);
export const fmt = (c) => (c / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

// Largest-remainder allocation with integer weights → shares always sum exactly to total.
export function allocate(totalCents, weights) {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (!(totalCents > 0) || sum === 0) return weights.map(() => 0);
  const parts = weights.map((w, i) => ({ i, q: Math.floor((totalCents * w) / sum), r: (totalCents * w) % sum }));
  const left = totalCents - parts.reduce((a, p) => a + p.q, 0);
  [...parts].sort((a, b) => b.r - a.r || a.i - b.i).slice(0, left).forEach((p) => { p.q += 1; });
  return parts.map((p) => p.q);
}
```

### 9.2 `src/engine/tips.js`
```js
import { allocate } from './money.js';

// staff: [{ role, name?, hours, points?, percent?, isManager? }]
// tipOuts: [{ label, pct, basis: 'sales' | 'tips' }]
export function tipPool({ totalTipsCents, salesCents = 0, method = 'hours', staff, tipOuts = [] }) {
  const warnings = [];
  const outs = tipOuts.map((t) => ({
    label: t.label,
    cents: Math.round(((t.basis === 'sales' ? salesCents : totalTipsCents) * t.pct) / 100),
  }));
  const outTotal = outs.reduce((a, o) => a + o.cents, 0);
  if (outTotal > totalTipsCents) warnings.push('TIP_OUTS_EXCEED_TIPS');
  const pool = Math.max(0, totalTipsCents - outTotal);

  const w = staff.map((s) => {
    const h = Math.round((s.hours || 0) * 100);
    const p = Math.round((s.points || 0) * 100);
    switch (method) {
      case 'hours': return h;
      case 'points': return p;
      case 'hoursXpoints': return h * p;
      case 'percent': return Math.round((s.percent || 0) * 100);
      default: throw new Error('UNKNOWN_METHOD');
    }
  });
  if (method === 'percent' && w.reduce((a, b) => a + b, 0) !== 10000) warnings.push('PERCENTS_NOT_100');
  if (staff.some((s) => s.isManager)) warnings.push('MANAGER_IN_POOL'); // FLSA 3(m)(2)(B)

  const shares = allocate(pool, w);
  return {
    tipOuts: outs,
    poolCents: pool,
    warnings,
    rows: staff.map((s, i) => ({ ...s, shareCents: shares[i], perHourCents: s.hours > 0 ? Math.round(shares[i] / s.hours) : null })),
    checkCents: Math.min(outTotal, totalTipsCents) + shares.reduce((a, b) => a + b, 0),
  };
}
```

### 9.3 `src/engine/rules.js` (values filled from `data/states.json` at build)
```js
export const RULES = {
  FED: { weeklyOT: 40 },
  CA:  { weeklyOT: 40, dailyOT: 8, dailyDT: 12, seventhDay: true }, // alternative workweeks not modelled
  AK:  { weeklyOT: 40, dailyOT: 8 },                                 // employers with 4+ employees (note in UI)
  NV:  { weeklyOT: 40, dailyOT: 8, dailyOTRateCapMultiple: 1.5, stateMinWage: null }, // daily OT only if rate < 1.5× state min — VERIFY, fill from data
  CO:  { weeklyOT: 40, dailyOT: 12 },                                // also >12 consecutive hours (not modelled, note in UI)
};
// All other states: FED rules unless data/states.json says otherwise.
```

### 9.4 `src/engine/overtime.js`
```js
// days: 7 numbers in workweek order. Returns hours split into regular / OT (1.5×) / DT (2×).
export function splitHours(days, rules, opts = {}) {
  if (days.length !== 7 || days.some((h) => !(h >= 0 && h <= 24))) throw new Error('INVALID_DAYS');
  const q = (x) => Math.round(x * 100);
  const d = days.map(q);

  let applyDaily = !!rules.dailyOT;
  if (rules.dailyOTRateCapMultiple) {
    if (rules.stateMinWage == null) throw new Error('DATA_MISSING_STATE_MIN_WAGE');
    if (opts.regularRate != null && opts.regularRate >= rules.dailyOTRateCapMultiple * rules.stateMinWage) applyDaily = false;
  }
  const workedAll7 = d.every((h) => h > 0);

  const out = d.map((h, i) => {
    if (rules.seventhDay && workedAll7 && i === 6) {
      const first8 = Math.min(h, 800);
      return { reg: 0, ot: first8, dt: h - first8 };
    }
    if (!applyDaily) return { reg: h, ot: 0, dt: 0 };
    const dtStart = rules.dailyDT ? q(rules.dailyDT) : Infinity;
    const otStart = q(rules.dailyOT);
    const dt = Math.max(0, h - dtStart);
    const ot = Math.max(0, Math.min(h, dtStart) - otStart);
    return { reg: h - ot - dt, ot, dt };
  });

  // Weekly OT: regular hours beyond the weekly threshold convert to OT, latest days first (no pyramiding).
  let excess = Math.max(0, out.reduce((a, x) => a + x.reg, 0) - q(rules.weeklyOT ?? 40));
  for (let i = 6; i >= 0 && excess > 0; i--) {
    const move = Math.min(out[i].reg, excess);
    out[i].reg -= move; out[i].ot += move; excess -= move;
  }
  const sum = (k) => out.reduce((a, x) => a + x[k], 0) / 100;
  return { days: out.map((x) => ({ reg: x.reg / 100, ot: x.ot / 100, dt: x.dt / 100 })), reg: sum('reg'), ot: sum('ot'), dt: sum('dt') };
}

// segments: straight-time pieces [{ hours, rateCents }] (rate includes any shift differential).
// FLSA regular rate = (all straight-time pay + nondiscretionary bonus + tip credit) / total hours.
// Premium = 0.5 × RR per OT hour, 1.0 × RR per DT hour (straight time already paid in segments).
export function grossPay({ days, rules, segments, bonusCents = 0, tipCreditCentsPerHour = 0 }) {
  const totalHours = days.reduce((a, b) => a + b, 0);
  const segHours = segments.reduce((a, s) => a + s.hours, 0);
  if (Math.abs(segHours - totalHours) > 0.001) throw new Error('HOURS_MISMATCH');
  const stCents = Math.round(segments.reduce((a, s) => a + s.hours * s.rateCents, 0)) + bonusCents;
  const tipCredit = Math.round(totalHours * tipCreditCentsPerHour);
  const rr = totalHours > 0 ? (stCents + tipCredit) / totalHours : 0;
  const split = splitHours(days, rules, { regularRate: rr / 100 });
  const premiumCents = Math.round(rr * (0.5 * split.ot + 1.0 * split.dt));
  return { ...split, regularRateCents: Math.round(rr), straightTimeCents: stCents, premiumCents, totalCents: stCents + premiumCents };
}
```

### 9.5 `src/engine/deductions.js` (2025–2028 federal deductions, **all constants VERIFY against IRS**)
```js
// Source to verify: irs.gov "One, Big, Beautiful Bill provisions" + Schedule 1-A instructions.
const C = {
  TIPS_CAP: 2500000,                       // $25,000 per return
  OT_CAP: { single: 1250000, hoh: 1250000, mfj: 2500000 }, // $12,500 / $25,000 joint
  PHASE_START: { single: 15000000, hoh: 15000000, mfj: 30000000 }, // MAGI $150k / $300k
  STEP: 100000, STEP_REDUCTION: 10000,     // $100 per $1,000 over — VERIFY whole-$1,000 rounding
};
const phase = (magiCents, fs) => Math.floor(Math.max(0, magiCents - C.PHASE_START[fs]) / C.STEP) * C.STEP_REDUCTION;

export function tipsDeduction({ qualifiedTipsCents, magiCents, filingStatus }) {
  if (filingStatus === 'mfs') return 0;
  return Math.max(0, Math.min(qualifiedTipsCents, C.TIPS_CAP) - phase(magiCents, filingStatus));
}
// qualifiedOTPremiumCents = only the premium portion (the "half" of time-and-a-half) required by FLSA section 7.
export function overtimeDeduction({ qualifiedOTPremiumCents, magiCents, filingStatus }) {
  if (filingStatus === 'mfs') return 0;
  return Math.max(0, Math.min(qualifiedOTPremiumCents, C.OT_CAP[filingStatus]) - phase(magiCents, filingStatus));
}
```
Take-home engine (v1): FICA is 6.2% Social Security up to the wage base (2026 base **$184,500, VERIFY at ssa.gov**) plus 1.45% Medicare, plus 0.9% Additional Medicare withholding above $200k. Federal income tax comes from IRS brackets and the standard deduction for the tax year, loaded from `data/federal-YEAR.json` built from the IRS Rev. Proc. (**no hand-typed numbers**). State tax: zero for AK, FL, NV, NH (wages), SD, TN, TX, WA and WY; a manual "state rate %" for everything else in v1; bracket data for CA, NY, IL, PA, OH, GA, NC and MI in v2.

### 9.6 `tests/engine.test.mjs` (run with `node --test`)
```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { allocate } from '../src/engine/money.js';
import { tipPool } from '../src/engine/tips.js';
import { splitHours, grossPay } from '../src/engine/overtime.js';
import { tipsDeduction, overtimeDeduction } from '../src/engine/deductions.js';
import { RULES } from '../src/engine/rules.js';

const staff = [{ role: 'Server', hours: 6.5 }, { role: 'Server', hours: 7 }, { role: 'Bartender', hours: 8 }, { role: 'Busser', hours: 5 }, { role: 'Host', hours: 4 }];

test('allocate sums exactly', () => assert.deepEqual(allocate(100000, [650, 700, 800, 500, 400]), [21311, 22951, 26230, 16393, 13115]));
test('tip pool + kitchen tip-out', () => {
  const r = tipPool({ totalTipsCents: 124000, salesCents: 800000, staff, tipOuts: [{ label: 'Kitchen', pct: 3, basis: 'sales' }] });
  assert.equal(r.tipOuts[0].cents, 24000);
  assert.deepEqual(r.rows.map((x) => x.shareCents), [21311, 22951, 26230, 16393, 13115]);
  assert.equal(r.checkCents, 124000);
});
test('manager warning', () => assert.ok(tipPool({ totalTipsCents: 1000, staff: [{ hours: 1, isManager: true }] }).warnings.includes('MANAGER_IN_POOL')));
test('CA daily OT + DT', () => { const s = splitHours([10, 8, 12.5, 9, 8, 0, 0], RULES.CA); assert.deepEqual([s.reg, s.ot, s.dt], [40, 7, 0.5]); });
test('FED weekly only', () => { const s = splitHours([10, 8, 12.5, 9, 8, 0, 0], RULES.FED); assert.deepEqual([s.reg, s.ot, s.dt], [40, 7.5, 0]); });
test('CA seventh day', () => { const s = splitHours([6, 6, 6, 6, 6, 6, 9], RULES.CA); assert.deepEqual([s.reg, s.ot, s.dt], [36, 8, 1]); });
test('CA weekly conversion', () => { const s = splitHours([9, 9, 9, 9, 9, 9, 0], RULES.CA); assert.deepEqual([s.reg, s.ot, s.dt], [40, 14, 0]); });
test('CO daily over 12', () => { const s = splitHours([13, 13, 13, 0, 0, 0, 0], RULES.CO); assert.deepEqual([s.reg, s.ot, s.dt], [36, 3, 0]); });
test('NV needs data', () => assert.throws(() => splitHours([9, 0, 0, 0, 0, 0, 0], RULES.NV), /DATA_MISSING/));
test('CA gross $20/hr', () => assert.equal(grossPay({ days: [10, 8, 12.5, 9, 8, 0, 0], rules: RULES.CA, segments: [{ hours: 47.5, rateCents: 2000 }] }).totalCents, 103000));
test('FED gross same week', () => assert.equal(grossPay({ days: [10, 8, 12.5, 9, 8, 0, 0], rules: RULES.FED, segments: [{ hours: 47.5, rateCents: 2000 }] }).totalCents, 102500));
test('blended regular rate', () => {
  const g = grossPay({ days: [9, 9, 9, 9, 9, 0, 0], rules: RULES.FED, segments: [{ hours: 30, rateCents: 2000 }, { hours: 15, rateCents: 2300 }] });
  assert.equal(g.regularRateCents, 2100); assert.equal(g.totalCents, 99750);
});
test('tipped OT federal ($2.13 + $5.12 credit)', () =>
  assert.equal(grossPay({ days: [9, 9, 9, 9, 9, 0, 0], rules: RULES.FED, segments: [{ hours: 45, rateCents: 213 }], tipCreditCentsPerHour: 512 }).totalCents, 11398));
test('tips deduction cap + phase-out', () => {
  assert.equal(tipsDeduction({ qualifiedTipsCents: 3000000, magiCents: 10000000, filingStatus: 'single' }), 2500000);
  assert.equal(tipsDeduction({ qualifiedTipsCents: 3000000, magiCents: 16050000, filingStatus: 'single' }), 2400000);
  assert.equal(tipsDeduction({ qualifiedTipsCents: 3000000, magiCents: 10000000, filingStatus: 'mfs' }), 0);
});
test('OT deduction joint cap', () => assert.equal(overtimeDeduction({ qualifiedOTPremiumCents: 3000000, magiCents: 20000000, filingStatus: 'mfj' }), 2500000));
```

**DoD:** `node --test` is all green. Every worked example on the site is computed by this engine at build time, never typed by hand.

---

## 10. Data layer (the moat)

### 10.1 `data/states.json` schema
```json
{
  "meta": { "version": "2026.12.0", "verifiedOn": "2026-12-01", "federal": { "minWage": 7.25, "tippedCashWage": 2.13, "maxTipCredit": 5.12, "weeklyOT": 40 } },
  "states": [
    {
      "code": "CA", "name": "California", "slug": "california",
      "minWage": null, "tippedCashWage": null, "maxTipCredit": 0, "tipCreditAllowed": false,
      "ot": { "weekly": 40, "daily": 8, "dailyDT": 12, "seventhDay": true },
      "notes": ["Alternative workweek schedules not modelled."],
      "tipPoolNotes": null,
      "localOverrides": "Many CA cities set higher minimums — link list, don't model in v1.",
      "effectiveFrom": "2026-01-01",
      "nextChange": { "date": null, "minWage": null },
      "sources": [{ "label": "CA DIR — Overtime FAQ", "url": "https://www.dir.ca.gov/dlse/faq_overtime.htm" }],
      "verifiedOn": null
    }
  ]
}
```
The federal values ($7.25 / $2.13 / $5.12) have been stable for years but still need a check against DOL. **Every `null` must be filled from a primary source.** `scripts/check-data.mjs` fails the build if any published field is null or `verifiedOn` is older than 120 days.

### 10.2 Sourcing protocol (the agent follows it; you spot-check 10%)
1. Primary sources only: dol.gov, the state labour department site, irs.gov, ssa.gov, ecfr.gov. Never a blog or another calculator.
2. Record the value, the source URL, the effective date and `verifiedOn`.
3. Second pass: re-open the source and confirm the value by quoting the exact line in `data/sources.md`.
4. Disagreement between DOL's table and the state site means the state site wins, with a note added.
5. Log every change in `data/changelog.md`, and log public-facing changes on `/p/corrections.html`.

### 10.3 Starting sources (**VERIFY each URL is live**)
- DOL tipped minimum wages by state: https://www.dol.gov/agencies/whd/state/minimum-wage/tipped
- DOL state minimum wage laws: https://www.dol.gov/agencies/whd/minimum-wage/state
- DOL Fact Sheet #15 (tipped employees): https://www.dol.gov/agencies/whd/fact-sheets/15-tipped-employees-flsa
- DOL Fact Sheet #23 (overtime): https://www.dol.gov/agencies/whd/fact-sheets/23-flsa-overtime-pay
- 29 CFR Part 778 (regular rate): https://www.ecfr.gov/current/title-29/subtitle-B/chapter-V/subchapter-B/part-778
- California DIR overtime: https://www.dir.ca.gov/dlse/faq_overtime.htm
- IRS 2025 law provisions (tips and overtime deductions): https://www.irs.gov/newsroom/one-big-beautiful-bill-provisions
- SSA wage base: https://www.ssa.gov/oact/cola/cbb.html

**DoD:** all 50 states plus DC are filled, double-checked and dated; `check-data` passes.

---

## 11. Content system

### 11.1 Tool page skeleton (template `templates/tool.html`, built by `build-posts.mjs`)
1. **Answer-first intro** (40–60 words): what it does, for whom, and the rules year. No fluff.
2. **Tool** as static HTML (inputs pre-filled) plus a `<div data-tool="tip-pool" data-state="">` mount. The engine output for the example is pre-rendered into the result card, so it works before JS loads and is indexable.
3. **AD T1** (§13.4), after the result card.
4. **How this was calculated**: steps with the real example arithmetic.
5. **Worked example #2**: a different realistic scenario (e.g. a 4-person brunch shift).
6. **AD T2**.
7. **Rules table** (from data) with sources.
8. **Common mistakes** (3–5, from real forum questions).
9. **FAQ** (4–6, from People Also Ask and real Reddit threads; paraphrased, never copied).
10. **Sources** (numbered, official).
11. **Related calculators** (3) and state pages (top 5).
12. **Multiplex ad**, then the author and "Rules verified" line.
13. JSON-LD (§12.5).

### 11.2 State page rules (programmatic, quality-gated)
- Generate a state page only where the rules differ: daily-OT states (CA, AK, NV, CO) for overtime, and every state for "tipped minimum wage and tipped overtime" pages, because each has different numbers.
- Each page needs at least **5 unique data points**, an engine-computed example using that state's values, a "What's different in {State}" section built from the diff against federal (then **edited by hand**), a source link to that state's labour department, and links to 3 neighbouring states.
- Release **10–15 a week**. If more than 30% of a batch shows "Crawled – currently not indexed" after 3 weeks, stop and enrich those pages.

### 11.3 Launch content set (32 items, all needed before applying to AdSense)
**Tools (7):**
1. Tip pool calculator
2. Tip-out calculator
3. Overtime and double time calculator
4. Shift differential and blended overtime rate calculator
5. Tipped overtime calculator
6. Take-home pay with tips calculator
7. No-tax-on-tips and overtime deduction estimator (2025–2028)

**State tools (10):** California, Alaska, Nevada and Colorado overtime calculators; tipped minimum wage and overtime calculators for Texas, Florida, New York, Pennsylvania, Illinois and Georgia.

**Guides (10):**
- Is tip pooling legal? Rules for owners and staff
- Tip credit explained: what tipped workers must earn
- How to split tips fairly: hours vs points vs percentage
- What is a typical tip-out? How restaurants structure it
- Daily overtime: the 4 states that have it
- How overtime works with a shift differential (regular rate explained)
- Tipped employee overtime: how the cash wage is calculated
- No tax on tips (2025–2028): who qualifies and what it doesn't cover
- No tax on overtime: why California daily OT may not count (**VERIFY**)
- How to read your paystub as a tipped worker

**Hubs (5):** tip tools, overtime tools, shift pay tools, state pay rules, guides.

**Trust (6):** About, Methodology, Privacy, Terms and disclaimer, Contact, Corrections.

### 11.4 Writing rules
- You may draft with AI, but **every number comes from the engine or `states.json`**, and every page gets an original worked example and a human edit.
- Each guide has at least one element no AI summary has: an original table, a computed example, a printable sheet, or a state comparison.
- Use plain words, short paragraphs and real situations ("Friday dinner, 5 staff, $1,240 in tips").
- Never write "In this article we will…", "In today's fast-paced world…", "comprehensive guide", "delve" or "unlock".
- Use a YMYL disclaimer block on every tax or pay page: "Estimate for planning only. Not legal or tax advice. Rules verified {date} — sources below."

### 11.5 Legal pages (AdSense requirements)
- **Privacy:** cookies; Google and third-party vendors using cookies to serve ads based on prior visits; a link to Google's Ads Settings; the CMP "Manage privacy choices" link; analytics; localStorage; contact.
- **Terms and disclaimer:** estimates only; no warranty; no professional advice; users verify with their employer, DOL or IRS.
- **Contact:** `CONTACT_EMAIL` plus a simple Google Form embed.

### 11.6 404 HTML (Settings → Errors and redirections → Custom 404)
```html
<div class="nf"><h1>Nothing to calculate here</h1><p>That page moved or never existed.</p>
<p><a href="/p/tip-tools.html">Tip tools</a> · <a href="/p/overtime-tools.html">Overtime</a> · <a href="/p/state-pay-rules.html">State rules</a></p></div>
```

**DoD:** the 32 launch items are published, each passes the §12.4 checklist, and none is thin.

---

## 12. SEO system

### 12.1 Blogger technical setup
1. Settings → Meta tags → Search description ON. Write a unique description per post, ≤155 characters.
2. Settings → Crawlers and indexing → **Custom robots header tags ON**:
   - Home page: `all`
   - Archive and search pages: `noindex`
   - Posts and pages: `all`
3. Settings → **Google Search Console**: link it, then submit `/sitemap.xml` and `/sitemap-pages.xml`.
4. **Bing Webmaster Tools:** import from Search Console. Bing's index also feeds Copilot and other AI search, which brings citations.
5. Never link internally to `?m=1` URLs. Canonical tags handle the mobile variants.

### 12.2 Custom robots.txt
```
User-agent: Mediapartners-Google
Disallow:

User-agent: *
Disallow: /search
Allow: /

Sitemap: https://shiftandtip.blogspot.com/sitemap.xml
Sitemap: https://shiftandtip.blogspot.com/sitemap-pages.xml
```
AI crawlers (GPTBot and others) stay allowed, so AI answers can cite and link the tools. Google-Extended only affects Gemini training, not Search.

### 12.3 On-page formulas
| Element | Tool page | State page | Guide |
|---|---|---|---|
| Title (≤60) | `Tip Pool Calculator: Split Tips by Hours or Points` | `California Overtime & Double Time Calculator (2026)` | `Is Tip Pooling Legal? Rules for Owners & Staff (2026)` |
| Meta (≤155) | Outcome + method + "free, no sign-up" | State rule summary + "calculated for you" | Answer in one line + "with state table" |
| H1 | Tool name | Tool name with state | Question |
| First 60 words | Direct answer and who it's for | The state's rule in one sentence | The answer, then the nuance |
| Slug | `tip-pool-calculator` | `california-overtime-calculator` | `is-tip-pooling-legal` |

### 12.4 Per-page publish checklist
1. Unique title and meta description.
2. One H1, with logical H2/H3s.
3. The tool works with JS disabled (it shows the pre-rendered example).
4. At least 3 internal links in and 3 out.
5. Primary sources linked.
6. "Rules verified" date present.
7. JSON-LD validates (Rich Results Test / validator.schema.org).
8. LCP under 2.5s on mobile in PageSpeed Insights.
9. Ad slots match §13.4.
10. Spelling and number check against the engine output.

### 12.5 Structured data
- **Tool pages** carry a `WebApplication` plus `BreadcrumbList`:
```html
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
 {"@type":"WebApplication","name":"Tip Pool Calculator","url":"https://shiftandtip.blogspot.com/2026/12/tip-pool-calculator.html",
  "applicationCategory":"FinanceApplication","operatingSystem":"Any (web browser)","isAccessibleForFree":true,
  "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
  "author":{"@type":"Person","name":"AUTHOR_NAME","url":"https://shiftandtip.blogspot.com/p/about.html"},
  "dateModified":"2026-12-01"},
 {"@type":"BreadcrumbList","itemListElement":[
  {"@type":"ListItem","position":1,"name":"Tip tools","item":"https://shiftandtip.blogspot.com/p/tip-tools.html"},
  {"@type":"ListItem","position":2,"name":"Tip pool calculator"}]}
]}
</script>
```
- **Never add `aggregateRating` or `review` unless the ratings are real and collected on-site.** Fake ratings are a manual-action risk.
- **Guides** use `Article` with `author` (Person), `dateModified` and a `citation` array.
- **The state rules hub** uses `Dataset`, with name, description, `dateModified`, `creator` and `isBasedOn` (the DOL URLs).
- FAQ and HowTo markup no longer earn rich results for most sites, so add them only where they help machine reading, and don't expect snippets.

### 12.6 Internal linking rules
- Every tool links to its hub, 2–3 sibling tools, its top 5 state pages and 1–2 guides.
- Every guide links to its primary tool within the first 150 words, and embeds a mini calculator.
- Every state page links to its hub, the parent tool and 3 neighbouring states.
- Breadcrumbs on all posts. Footer links go to hubs only; no 50-state link blocks.
- Use descriptive anchors that vary naturally ("split tips by hours", "California double-time rules").

### 12.7 Indexing workflow
1. Publish, then use Search Console URL Inspection and Request indexing (only the important pages; there's a daily quota).
2. Check coverage weekly. Fix "Crawled – currently not indexed" by enriching and interlinking, never by re-requesting.
3. Refresh the five pages with the highest impressions every quarter.

### 12.8 E-E-A-T and AI search
- A real author (your name and honest background), a methodology page, a corrections log, primary-source citations and visible verified dates.
- **Answer blocks:** a one-sentence direct answer under each H2, plus clean tables. These are what AI Overviews and ChatGPT search quote and link.
- **Original data asset:** "State Tip & Overtime Rules 2027" (a downloadable CSV plus a table), published in December. It's the link-earning piece for journalists covering 1 January wage changes.
- **Optional:** one paid-free expert review. If a payroll or tax professional genuinely reviews the deduction tool, credit them with their permission. Never invent one.

### 12.9 Freshness calendar
| When | Action |
|---|---|
| 1–20 Dec | Re-verify all states for 1 January changes; draft "2027" titles; publish the 2027 data report |
| 1 Jan | Switch titles and data to 2027; update verified badges; changelog; Search Console request indexing for the top 20 |
| Jan–Apr | Tax season: promote the deduction and take-home tools on home, hubs and guides |
| 1 Jul | Mid-year wage changes (some states and cities); re-verify |
| Nov–Dec | Holiday tipping season: tip pool and tip-out tools promoted |

### 12.10 Keyword map (validate in Keyword Planner and Search Console in week 2; one primary intent per URL)
| Cluster | Primary page | Secondary terms |
|---|---|---|
| tip pool calculator | Tip pool tool | tip split calculator, tip share calculator by hours, how to split tips |
| tip out calculator | Tip-out tool | server tip out, bartender tip out percentage, busser tip out |
| overtime calculator | OT and DT tool | time and a half calculator, overtime pay calculator weekly |
| double time calculator california | CA state page | california daily overtime, 7th day overtime california |
| shift differential calculator | Shift diff tool | night shift differential, blended overtime rate, regular rate calculator |
| tipped minimum wage {state} | State tipped pages | tip credit {state}, {state} server minimum wage |
| tipped overtime | Tipped OT tool | overtime for tipped employees, cash wage overtime |
| take home pay with tips | Take-home tool | server paycheck calculator, tips paycheck calculator |
| no tax on tips calculator | Deduction tool | no tax on overtime calculator, tips deduction 2025 |

**DoD:** settings done, sitemaps submitted, checklist enforced by `scripts/audit-seo.mjs` (it fails the build on missing titles, meta, canonical, JSON-LD, internal links or the verified date).

---

## 13. Monetisation

### 13.1 AdSense on Blogger (when 25 or more substantial pages are live, around week 6)
1. Blogger → Earnings → Sign up for AdSense, or link your existing AdSense account.
2. Fill in your payment profile (India bank account), PAN and US tax info (W-8BEN in AdSense Payments settings). Verify your PIN when the letter arrives, at a $10 balance.
3. While the review runs: **no other ad code**, no "coming soon" pages, all trust pages live.
4. **After approval:** Blogger → Earnings → enable ads. Then in AdSense:
   - **Auto ads:** ON, with anchor (bottom), vignette (test it, §13.7) and in-page ads at the medium ad load. Keep "Optimize existing ad units" ON.
   - **URL exclusions:** `/p/privacy.html`, `/p/terms.html`, `/p/contact.html`, `/p/about.html`, `/p/methodology.html`, `/p/corrections.html`.
   - **Manual units:** create In-content T1, In-content T2, In-article G1, In-article G2, Sidebar rail, Hub leaderboard and Multiplex end.
   - **Privacy & messaging:** create the European regulations message (Google's certified CMP) and the US state regulations message. Use a clear "Consent" button and a "Manage options" link; don't bury choices.

### 13.2 Network ladder
| Stage | Trigger | Action |
|---|---|---|
| 1 | Approval | AdSense: manual units plus Auto ads |
| 2 | 1,000+ Tier-1 sessions in 30 days | Apply to Journey by Mediavine. **First confirm by email that they accept blogspot sites.** Journey is exclusive and replaces AdSense, so switch only if its RPM test beats AdSense |
| 3 | 10K–80K pageviews/month, ≥50% US/UK/CA/AU | Monumetric Propel ("WordPress or Blogger site"; $99 setup taken from earnings; 6 slots, 300px sidebar). The layout already fits |
| 4 | 25K+ pageviews, majority Tier-1 | Raptive (confirm blogspot acceptance) |
| 5 | Revenue above about ₹1,000/month | Strongly consider a ₹1,000/year domain via Blogger's custom-domain setting (keeps the posts, redirects old URLs); it unlocks the premium networks fully |

### 13.3 Density and policy rules
- Content must outweigh ads (Valuable Inventory policy).
- On mobile, ads must never take more than 30% of any viewport (Better Ads standard).
- Only one sticky unit at a time: the anchor on mobile, the sidebar rail on desktop. Desktop sticky sidebar units are generally allowed if they never overlap content; check the current AdSense ad placement policies.
- The only allowed label is **"Advertisements"** (or "Sponsored links"). Never "Click", "Support us" or arrows pointing at ads.
- Never put ads inside the tool card, next to buttons, in pop-ups, or on pages with no content.
- **No reloading or refreshing ads** on recalculation, tab switches or timers.

### 13.4 Slot map and code
**Tool page (mobile order):** inputs → result card → **T1** → how calculated → example 2 → **T2** → rules table → (T3 only if the page is over 1,800 words) → FAQ → related → **Multiplex** → author. Auto anchor at the bottom.
**Tool page (desktop):** the same, plus a **sidebar rail** (300×600 sticky).
**Guide:** **G1** after paragraph 3 → mini calculator → **G2** after paragraph 8 (≥1.5 screens later) → further units each about 700 words → **Multiplex** at the end; sidebar rail.
**Hub:** **leaderboard** below the intro → table/list → in-feed band after row 10 → **Multiplex**.
**Home:** one unit after the calculators list, plus one in the guides column.
**Trust pages:** none.

**In-content unit (T1/T2), pasted into post HTML by the build:**
```html
<div class="ad" data-slot="T1">
  <span class="ad__label">Advertisements</span>
  <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" data-ad-slot="SLOT_T1" data-ad-format="auto" data-full-width-responsive="true"></ins>
  <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
  <a class="ad__house" href="/p/tip-tools.html">See all free tip tools →</a>
</div>
```
**In-article (G1/G2):** the same wrapper with `data-ad-layout="in-article" data-ad-format="fluid"` and `style="display:block; text-align:center;"`.
**Multiplex:** the same wrapper with `data-ad-format="autorelaxed"`.

**CSS** (reserved heights mean CLS is about 0; the house link shows only if the ad is unfilled, and the label hides then):
```css
.ad{position:relative;margin:32px 0;padding:12px 0 16px;background:var(--ad-bg);border-radius:10px;min-height:300px;text-align:center}
.ad__label{display:block;font:600 11px/1 var(--font-ui);letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:8px}
.ad__house{display:none;padding:24px;font-weight:600;color:var(--ledger)}
.ad ins.adsbygoogle[data-ad-status="unfilled"]{display:none!important}
.ad:has(ins[data-ad-status="unfilled"]) .ad__house{display:block}
.ad:has(ins[data-ad-status="unfilled"]) .ad__label{visibility:hidden}
.ad--rail{min-height:600px;position:sticky;top:24px}
@media (min-width:1024px){.ad{min-height:280px}}
@media print{.ad{display:none!important}}
```

### 13.5 RPM levers (in order of impact)
1. **Tier-1 share:** US-only topics, US spellings, US examples; no India-targeted pages on this site.
2. **Engagement:** live results, presets, comparisons and printable sheets keep dwell time high and raise viewability and bids.
3. **Seasonality:** January–April tax intent attracts the most expensive advertisers, so lead with the deduction and take-home tools then.
4. **Consent rate:** a clean CMP message design means more personalised ads in the EEA/UK.
5. **Ad balance experiments:** run AdSense Experiments for 4 weeks; keep the variant with the highest page RPM.
6. **Don't block ad categories** by default. Fewer bidders means a lower RPM.

### 13.6 ads.txt (only when you add a second network)
Turn on Blogger → Settings → Monetisation → Custom ads.txt. **You must include Google's line, or you lose AdSense demand:**
```
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
# + lines supplied by any approved additional network
```

### 13.7 Third-party ads and affiliates (your "as many networks as possible" request, done safely)
- **More networks does not mean more money.** Low-tier networks fill with India-level CPMs and risk malware or deceptive creatives that get the site flagged. The revenue-maximising stack is **one premium display network plus relevant affiliates**.
- **Allowed test** (only after 60 days of stable AdSense): one non-Google contextual display unit in a below-the-fold sidebar slot (e.g. Media.net if it accepts the site; acceptance unverified). Keep it only if **total page RPM rises at least 10%** over 4 weeks with no CWV regression.
- **Never:** Adsterra or Monetag pop-unders, Social Bar, push, Smartlink, interstitials, or anything that redirects.
- **Affiliates (often worth more than display on this topic):**
  - **Owners and managers** using the tip pool and tip-out tools: restaurant scheduling, tip-management and payroll software referral programs. Find them via PartnerStack, Impact and the vendors' own partner pages, and verify the terms.
  - **Workers in tax season:** tax-filing software affiliate programs. Verify that they accept international affiliates.
  - **Work gear guides** (non-slip shoes, server books, nurse compression socks) via Amazon Associates US. Verify the international payout method.
  - Add an FTC disclosure on every page with affiliate links; mark them `rel="sponsored"`.
- **Vignette:** A/B test it via AdSense Experiments. If pages/session falls more than 10%, turn it off on tool pages.

**DoD:** approved, units live per the map, CMP live, policy center clean, page RPM tracked weekly.

---

## 14. Performance budget (Core Web Vitals = ranking + RPM)
| Metric | Budget |
|---|---|
| HTML per page | ≤ 150 KB (Blogger caps pages at about 1 MB) |
| Theme CSS (inlined) | ≤ 25 KB |
| `tools.min.js` | ≤ 40 KB gzipped, `defer`, from jsDelivr |
| Fonts | 2 woff2 latin subsets, ≤ 60 KB total, `font-display: swap`, preload the UI font only |
| Mobile LCP / INP / CLS | < 2.5 s (aim 2.0) / < 200 ms / < 0.05 |

Rules:
- The pre-rendered result card is the LCP element.
- Hero images aren't needed; use Blogger image URLs sized `w800` and WebP where possible.
- AdSense is loaded only once.
- Run PageSpeed Insights on 5 template URLs after every theme or JS release.
- Load Microsoft Clarity (optional heatmaps) only after consent.

**DoD:** all 5 templates pass CWV in PSI lab tests; field data is checked monthly in the Search Console CWV report.

---

## 15. Analytics and KPIs
1. GA4: create a property and add the Measurement ID in Blogger Settings, or add gtag in the theme.
2. Google's CMP in AdSense handles consent signals for Google tags in the EEA/UK; confirm in GA4 that Consent Mode is detected.
3. Events from `hydrate.js`: `calc_run` (tool, state), `preset_save`, `share_link`, `csv_export`, `print`, `state_change`, `example_reset`.
4. Weekly dashboard: Search Console (clicks, impressions, CTR, average position by page) + GA4 (sessions, % Tier-1, engaged sessions, `calc_run` per session, returning users) + AdSense (page RPM, impressions per page, viewability).

| KPI | Month 3 | Month 6 | Month 12 |
|---|---|---|---|
| Indexed pages | 60 | 110 | 160 |
| Monthly sessions (base) | 1,000 | 5,500 | 30,000 |
| Tier-1 share | ≥ 55% | ≥ 60% | ≥ 65% |
| calc_run per session | ≥ 1.3 | ≥ 1.5 | ≥ 1.6 |
| Returning users | ≥ 12% | ≥ 18% | ≥ 22% |
| Page RPM | – | ≥ $6 | ≥ $8 (AdSense) |

---

## 16. Launch checklist (in order)
1. Theme live; 404 set; HTTPS on; favicon (receipt glyph) uploaded.
2. Trust pages live: About, Methodology, Privacy, Terms, Contact, Corrections.
3. 7 tools live; engine tests green; JS works and falls back gracefully.
4. 10 state pages and 10 guides live; hubs live with lists.
5. Robots, header tags and search descriptions set; sitemaps submitted to Search Console and Bing.
6. `audit-seo` passes; Rich Results Test passes on 5 templates; PSI passes.
7. No broken links (`audit-seo` link check); no placeholder text anywhere.
8. Week 6 or later: apply to AdSense via Blogger Earnings.
9. After approval: run §13.1 step 4, then the ad slot audit on mobile and desktop.

---

## 17. Growth and links (white-hat only)
1. **Communities:** answer real questions in r/Serverlife, r/bartenders, r/KitchenConfidential, r/restaurantowners and r/nursing (follow each subreddit's self-promotion rules; link a tool only when it answers the question). Facebook groups for servers and restaurant managers work the same way.
2. **Embeddable widget (v2):** a tip-split widget for restaurant blogs and POS communities, with a visible branded credit ("Calculator by Shift & Tip"). Widget links count for referrals and brand; Google may discount them.
3. **Data report PR:** in December, publish "State Tip & Overtime Rules 2027". Pitch local reporters covering 1 January wage increases, through journalist-request platforms (e.g. Qwoted, Featured; check which ones are current).
4. **Printable assets:** tip-out sheets and weekly shift logs (print CSS), shared on Pinterest and in forums.
5. **Spanish (v3):** the top 5 tools in Spanish (`hreflang` via theme conditionals for those URLs).
6. **Never:** buy links, PBNs, link exchanges, comment spam or AI-spun guest posts.

---

## 18. Roadmap and targets
| Week | Deliverables |
|---|---|
| 1 | Phase 0–1; Stitch S0–S1 approved |
| 2 | S2–S8 approved; tokens; theme v1; engine + tests; keyword validation |
| 3 | Tools 1–4 live; trust pages; 4 guides; Search Console and Bing |
| 4 | Tools 5–7; hubs; 4 state pages |
| 5 | 6 state pages; 4 guides; data double-check |
| 6 | 2 guides; full audit; **apply to AdSense** |
| 7–8 | 15 state pages (batch); comparison pages (e.g. California vs Texas overtime) |
| 9–10 | Presets, share links and CSV polish; widget v1; community answering |
| 11–12 | 15 state pages; prep the 2027 data refresh; AdSense optimisation once approved |
| Month 4–6 | Spanish top 3; printable assets; Experiments; Journey check at 1K Tier-1 sessions |
| Month 7–12 | Manager mode (weekly roster), PWA offline, 2027 report PR, Monumetric/Raptive as eligible, domain decision |

**Revenue model** (from the research; a model, not a forecast):
| | M3 | M6 | M9 | M12 |
|---|---|---|---|---|
| Base sessions / $ | 1,000 / $13 | 5,500 / $70 | 15,000 / $192 | 30,000 / ~$384 |
| Optimistic sessions / $ | 3,000 / $65 | 16,000 / $346 | 50,000 / $1,620 | 120,000 / ~$2,600–3,900 |

The model assumes 55–65% US traffic, 1.5–1.8 pageviews per session and an AdSense page RPM of $4, $8 or $12 for the conservative, base and optimistic cases. Tax season can add 30–60% to the tax tools. Affiliates are not included.

---

## 19. Agent Prompt Pack (paste into Claude Code in `D:\shiftandtip`)

**P1: Verify Stitch**
```text
Run /mcp context check: confirm the "stitch" MCP server is connected and list its tools with
one-line descriptions. Map them to these roles: create project, generate screen, generate
variants, edit screen, get/download screen (HTML + image), upload design doc. Write the
mapping to design/stitch-tools.md. Do not generate anything yet.
```

**P2: Design generation and regeneration loop**
```text
Read design/DESIGN.md and section 5 of shift-and-tip-master-build-playbook.md.
1) Create Stitch project "Shift & Tip v1"; upload/attach DESIGN.md if a tool exists, else
   prepend it to every prompt.
2) For screens S0..S8 in order, run the loop in §5.5 exactly: generate (3 variants if
   possible) → download screenshots to design/screens/ → view each image → score with the
   §5.4 rubric → log hard fails, scores, 3 fixes in design/scores.md → edit_screens with only
   those fixes → repeat until ≥88 and zero hard fails, max 6 iterations per screen.
3) After S1 passes, add "Match the exact visual language of S0 and S1" to all later prompts.
4) Stop at 60 total generations and report. After each screen passes, show me the final
   screenshot path and score, then continue.
5) When all pass and I approve, export HTML + PNG to design/exports/ and write
   design/tokens.css (CSS custom properties only) and design/components.md (component
   anatomy, states, spacing) extracted from the exports.
Never accept a screen with gradients, purple, Inter/Poppins, emoji, fake stats,
testimonials, icon-circle grids, or ads inside tool cards.
```

**P3: Engine and tests**
```text
Create src/engine/{money,tips,rules,overtime,deductions}.js and tests/engine.test.mjs
exactly as in §9 of the playbook (ESM). Run `node --test`. All tests must pass. If a test
fails, fix the code, not the test, unless the test contradicts the stated rule — then
explain. Do not add dependencies.
```

**P4: Data**
```text
Build data/states.json per §10.1 for all 50 states + DC using ONLY primary sources in §10.3
(and each state's labour department site). Follow the §10.2 protocol: record value, source
URL, effective date, verifiedOn; quote the exact source line in data/sources.md.
Leave a field null if you cannot confirm it — never guess. Then write scripts/check-data.mjs
that fails on nulls in published fields or verifiedOn older than 120 days. Report all nulls.
```

**P5: Theme**
```text
Using design/tokens.css, design/components.md and design/exports/, write theme/theme.css
(BEM, ≤25 KB, no Tailwind) and theme/theme.xml from the §8.2 skeleton. Implement: topbar,
layout with 300px sidebar ≥1024px, list view, single post view, footer, print styles,
ad wrapper styles from §13.4, focus styles, reduced-motion. Write scripts/build-theme.mjs
that minifies theme.css and injects it into <b:skin> CDATA, outputting dist/theme.xml.
Give me numbered steps to upload it and a checklist of what to verify in view-source.
```

**P6: Front-end tools**
```text
Create src/ui/{hydrate,presets,share,csv}.js and print.css per §6. hydrate.js finds
[data-tool] mounts, reads pre-rendered inputs, wires live recalculation (150 ms debounce)
using the engine, updates the result card with aria-live, never touches .ad elements, and
sends GA4 events from §15. presets.js uses localStorage in try/catch. share.js encodes
inputs in the URL hash, excluding names by default. Bundle with esbuild into
dist/assets/tools.min.js (target es2019, minify) and fail the build if gzip > 40 KB.
Copy states.json and fonts into dist/assets/. Output the git commands to tag v1.0.0 in
the shiftandtip-assets repo and the jsDelivr + Cloudflare Pages URLs to test.
```

**P7: Post generator and publishing**
```text
Write scripts/build-posts.mjs: read content/{tools,states,guides}/*.md (front matter:
title, slugTitle, description, type, tool, state, hub, related[], labels[]); render with
templates/*.html following §11.1/§11.2; pre-compute every example with the engine; inject
ad units per §13.4 (placeholders until PUB_ID is set); add JSON-LD per §12.5; write
dist/posts/<slug>.html. Then write scripts/publish-blogger.mjs using googleapis +
@google-cloud/local-auth (OAuth desktop client at secrets/oauth-client.json, scope
blogger) that inserts posts as DRAFTS with title=slugTitle and labels. After I publish,
a second command patches the title to the full SEO title. Give me numbered steps to create
the OAuth client in Google Cloud console.
```

**P8: SEO audit**
```text
Write scripts/audit-seo.mjs that fetches every URL in BLOG_URL/sitemap.xml and
sitemap-pages.xml and checks: title length, meta description present and ≤155, single H1,
canonical present, JSON-LD parses and has required fields, ≥3 internal links, "Rules
verified" present on tool/state pages, no "?m=1" internal links, no broken links, ad
wrappers ≥24px from inputs (static check by DOM order), and HTML size ≤150 KB. Output a
table and exit non-zero on failures.
```

**P9: Content drafting (per batch)**
```text
Draft the next batch from §11.3 into content/*.md. Rules: §11.4 strictly; every number
from the engine or data/states.json via the build, not typed; one original worked example
per page; real-situation framing; FAQ from genuine questions (paraphrased); sources list
of primary URLs only. Mark each draft "needs human edit" in front matter. No AI clichés.
```

**P10: Monthly optimisation**
```text
Using exported Search Console (queries/pages CSV) and AdSense page-RPM CSV I place in
reports/, list: pages ranking 5–20 with high impressions (rewrite title/intro/FAQ),
queries without a dedicated page (propose new tool/state/guide pages), pages with low
calc_run rate (UX fixes), and the 3 highest-RPM templates (replicate their structure).
Output an action list ranked by expected revenue impact.
```

---

## 20. Risks and mitigations
| Risk | Mitigation |
|---|---|
| AdSense rejection (thin content, missing pages) | 32-item launch set, trust pages, no third-party ads during review; on rejection, fix the stated reason and reapply after 2–4 weeks |
| Old "India: 6 months active" rule still applied | Plan cash flow for it, and apply as soon as you're ready |
| Wrong numbers (YMYL) | Engine tests, primary-source data, verified dates, corrections log, estimate labels |
| Scaled content abuse | Unique data gate, hand edits, batch releases, an indexing watch |
| Pop-under contamination | Red line #1; never install those scripts |
| EEA/UK consent | Google CMP live before ads |
| Blogger limits (about 20 static pages, 1 MB pages) | Tools as posts; JS and data on the CDN; page-size check |
| CDN outage or rename | jsDelivr pinned tag plus Cloudflare fallback loader |
| Premium networks refuse blogspot | Monumetric (Blogger supported); domain switch when revenue above about ₹1,000/month |
| Legal claims | Educational framing, sources, "not legal or tax advice", no individual advice |
| Platform lock-in | Blogger custom domain with redirects later; keep all content in the repo (Blogger is just the renderer) |

---

### Appendix: Items marked VERIFY (check before go-live)
1. The 2025–2028 tips and overtime deduction caps, phase-out rounding and the state-OT eligibility nuance (IRS).
2. The 2026 Social Security wage base (SSA), and federal brackets and standard deduction (IRS Rev. Proc.).
3. Nevada's daily-OT pay condition and its current minimum wage.
4. That every source URL in §10.3 is live.
5. That Journey and Raptive accept blogspot sites (email support).
6. Your Stitch generation quota and exact tool names (P1).
7. That desktop sticky sidebar ads comply with the current AdSense ad placement policies.
