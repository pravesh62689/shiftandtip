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
