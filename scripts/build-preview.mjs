import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const xml = readFileSync('dist/theme.xml', 'utf8');
const skinMatch = xml.match(/<b:skin><!\[CDATA\[([\s\S]*?)\]\]><\/b:skin>/);
if (!skinMatch) throw new Error('Could not find CSS in dist/theme.xml');
const css = skinMatch[1];

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shift &amp; Tip — Tool Engine Preview</title>
  <style>
${css}
    /* Preview container additions */
    .preview-header {
      background: var(--surface);
      border-bottom: 1px solid var(--line);
      padding: var(--s4);
      margin-bottom: var(--s6);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .preview-nav {
      max-width: var(--max);
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      gap: var(--s2);
      align-items: center;
    }
    .preview-nav a {
      font-size: 13px;
      font-weight: 600;
      padding: 6px 12px;
      background: var(--paper);
      border: 1px solid var(--line);
      border-radius: var(--r-sm);
      text-decoration: none;
      color: var(--ink-2);
    }
    .preview-nav a:hover {
      background: var(--ledger-50);
      color: var(--ledger);
      border-color: var(--ledger);
    }
    .tool-section {
      max-width: var(--max);
      margin: 0 auto var(--s8);
      padding: 0 var(--s4);
    }
    .tool-section h2 {
      margin-bottom: var(--s2);
      display: flex;
      align-items: center;
      gap: var(--s3);
    }
    .tool-section .badge {
      font: 600 12px var(--font-num);
      background: var(--ledger-50);
      color: var(--ledger);
      padding: 2px 8px;
      border-radius: 12px;
    }
    .tool-section p.desc {
      color: var(--muted);
      margin-bottom: var(--s4);
      font-size: 15px;
    }
  </style>
</head>
<body>
  <header class="preview-header">
    <nav class="preview-nav" aria-label="Tool navigation">
      <span style="font-weight:bold;margin-right:8px;">Tools:</span>
      <a href="#tool-1">1. Tip Pool</a>
      <a href="#tool-2">2. Tip-Out</a>
      <a href="#tool-3">3. Overtime</a>
      <a href="#tool-4">4. Shift Differential</a>
      <a href="#tool-5">5. Tipped Overtime</a>
      <a href="#tool-6">6. Take-Home Pay</a>
      <a href="#tool-7">7. Tips &amp; OT Deduction</a>
    </nav>
  </header>

  <main>
    <section id="tool-1" class="tool-section">
      <h2>1. Tip Pool Calculator <span class="badge">data-tool="tip-pool"</span></h2>
      <p class="desc">Distributes shift tip pools by hours worked, points, or percentage, with top-slice kitchen/support tip-outs.</p>
      <div class="tool" data-tool="tip-pool"></div>
    </section>

    <section id="tool-2" class="tool-section">
      <h2>2. Tip-Out Calculator <span class="badge">data-tool="tip-out"</span></h2>
      <p class="desc">Calculates server tip-outs to bar, bussers, and runners from net sales or total tips.</p>
      <div class="tool" data-tool="tip-out"></div>
    </section>

    <section id="tool-3" class="tool-section">
      <h2>3. Overtime &amp; Double Time Calculator <span class="badge">data-tool="overtime"</span></h2>
      <p class="desc">Models weekly and daily overtime + 7th consecutive day rules (CA, CO, AK, NV, Federal).</p>
      <div class="tool" data-tool="overtime" data-state="CA"></div>
    </section>

    <section id="tool-4" class="tool-section">
      <h2>4. Shift Differential &amp; Blended Rate Calculator <span class="badge">data-tool="shift-differential"</span></h2>
      <p class="desc">Calculates weighted average regular rate and overtime premiums across mixed base and premium shifts.</p>
      <div class="tool" data-tool="shift-differential"></div>
    </section>

    <section id="tool-5" class="tool-section">
      <h2>5. Tipped Overtime Calculator <span class="badge">data-tool="tipped-overtime"</span></h2>
      <p class="desc">Calculates correct statutory tipped overtime cash wage based on full minimum wage minus allowable tip credit.</p>
      <div class="tool" data-tool="tipped-overtime"></div>
    </section>

    <section id="tool-6" class="tool-section">
      <h2>6. Take-Home Pay with Tips Calculator <span class="badge">data-tool="take-home"</span></h2>
      <p class="desc">Estimates pay-period take-home after Social Security, Medicare, Federal income tax, and state tax exemptions.</p>
      <div class="tool" data-tool="take-home"></div>
    </section>

    <section id="tool-7" class="tool-section">
      <h2>7. No-Tax-on-Tips &amp; Overtime Deduction Estimator <span class="badge">data-tool="tips-ot-deduction"</span></h2>
      <p class="desc">Models federal above-the-line deduction caps ($25k tips, $12.5k/$25k OT) with MAGI phase-out reductions.</p>
      <div class="tool" data-tool="tips-ot-deduction"></div>
    </section>
  </main>

  <script src="../dist/assets/tools.min.js"></script>
</body>
</html>
`;

mkdirSync('preview', { recursive: true });
writeFileSync('preview/index.html', html, 'utf8');
console.log('preview/index.html written successfully.');
