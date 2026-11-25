# Remaining work for Antigravity (setup.mjs already did the deterministic parts)
Done by setup.mjs: engine + 15 passing tests, design/tokens.css, theme/theme.css (base), theme/theme.xml,
scripts/build-theme.mjs, src/ui/tools.js (tip pool + overtime tools), scripts/build-assets.mjs,
data/states.json skeleton (51 entries, values null), scripts/check-data.mjs, blogger/* snippets.

Do next, in order, per shift-and-tip-master-build-playbook.md (read it fully first):
1. Refine theme/theme.css against design/exports/*.png (see design/exports/MANIFEST.md). Background stays #F7F6F1.
   Keep class names used by src/ui/tools.js. Run: npm run build:theme (must stay <= 25 KB).
2. Add the other 5 tools to src/ui/tools.js following the TipPool/Overtime pattern: tip-out, shift differential
   (engine grossPay with segments), tipped overtime (tipCreditCentsPerHour), take-home with tips (§9.5), tips & OT
   deduction (deductions.js). Run: npm test && npm run build:assets (<= 40 KB gzip).
3. Fill data/states.json from primary sources only (§10.2/§10.3). Leave null if unconfirmed. npm run check:data.
4. Fonts: put woff2 subsets (Public Sans var, Source Serif 4 600, IBM Plex Mono 500, latin) in dist/assets/fonts/.
5. Write scripts/build-posts.mjs + templates (§11), scripts/publish-blogger.mjs (drafts only), scripts/audit-seo.mjs (P8).
6. Draft content per §11.3 / P9, marked "needs human edit".
7. Give me a numbered handover list. Ask before any push/publish.
