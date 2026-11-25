# Shift & Tip design handoff
Project ID: 7797411789656205095 (Stitch, "Shift & Tip v1")
Design system: "Shift & Tip Utility" assets/780af8b13987477eb661eb4a5ccd5c4d
Model used: GEMINI_3_8_FLASH (Flash-Lite only for one S0 attempt)

## Screens
- S0 (component sheet): manual export, no screen ID. Stitch holds two
  "Shift & Tip Design System Spec" screens: 6afbae05df0141c0af9e546e0d3e2085,
  1809cb60876148cdb01ed100eb056aba. Score 86, no hard fails.
  Files: design/exports/S0-desktop.html, design/exports/S0-desktop.png, design/screens/S0-v1.png
- S1-desktop ("Tip Pool Calculator"): 44a45167d64241ceb2d51f9ad6e0786c. Score 80 (v1, below the 88 bar).
  Files: design/exports/S1-desktop.html, design/exports/S1-desktop.png, design/screens/S1-desktop-v1.png
  Edit sent (bg, sidebar ad, 44px inputs); never appeared after 18 min polling.
- S3-desktop ("Shift & Tip — Desktop Homepage"): 6c565b289f35491387ec886a94d13bb3.
  Returned by the generate call. Not downloaded, not scored.

## S1 known issues to fix in CSS
mint background -> #F7F6F1; sticky 300x600 sidebar ad; inputs 44px with larger text

## Sent, awaiting manual export
S1-mobile, S2-mobile, S4-desktop, S5-desktop: calls timed out, no screen ID.
S3-desktop: ID above; export manually or fetch by ID.
Do not re-send. Check Stitch for them (they can take ~15 min).

## Not done
tokens.css, components.md, S6-S8: build from tokens (Antigravity).
Mobile S3/S5: build from tokens (Antigravity).

## Generations used: 10 of 25
S0 x3, S1 x1, S1 edit x1, S1-mobile, S2-mobile, S3, S4, S5 (one each)

## Notes
design/_import_zip/ is a duplicate of S1 v1; user will delete.
No scores logged for S2-S5 (nothing viewed).
