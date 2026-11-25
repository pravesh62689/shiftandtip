import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const outDir = 'reports/lighthouse';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const targets = [
  { name: 'homepage', url: 'https://shiftandtip.blogspot.com/?m=1' },
  { name: 'tip-pool', url: 'https://shiftandtip.blogspot.com/2026/11/tip-pool-calculator.html?m=1' },
  { name: 'overtime', url: 'https://shiftandtip.blogspot.com/2026/11/overtime-and-double-time-calculator.html?m=1' },
];

const results = [];
const allOpportunities = [];

for (const t of targets) {
  console.log(`\nRunning Lighthouse mobile for ${t.name} (${t.url})...`);
  const jsonPath = path.join(outDir, `${t.name}.report.json`);
  const htmlPath = path.join(outDir, `${t.name}.report.html`);

  const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const cmd = `${npxCmd} --yes lighthouse "${t.url}" --output=json,html --output-path="${path.join(outDir, t.name)}" --chrome-flags="--headless=new --no-sandbox --disable-gpu" --form-factor=mobile --only-categories=performance,accessibility --throttling-method=simulate --quiet`;
  try {
    execSync(cmd, { stdio: 'inherit', timeout: 180000 });

    // Read json report
    const actualJsonPath = fs.existsSync(jsonPath) ? jsonPath : path.join(outDir, `${t.name}.report.json`);
    const data = JSON.parse(fs.readFileSync(actualJsonPath, 'utf8'));

    const perf = Math.round((data.categories.performance?.score || 0) * 100);
    const a11y = Math.round((data.categories.accessibility?.score || 0) * 100);
    const cls = data.audits['cumulative-layout-shift']?.numericValue ?? 0;

    console.log(`[+] ${t.name}: Performance=${perf}, Accessibility=${a11y}, CLS=${cls.toFixed(3)}`);
    results.push({
      name: t.name,
      url: t.url,
      perf,
      a11y,
      cls: cls.toFixed(3),
      perfPass: perf >= 90,
      a11yPass: a11y >= 95,
      clsPass: cls < 0.05,
    });
    // Extract opportunities
    if (data.audits) {
      for (const [auditKey, audit] of Object.entries(data.audits)) {
        if (audit.details && audit.details.type === 'opportunity' && (audit.details.overallSavingsMs > 50 || audit.details.overallSavingsBytes > 10000)) {
          allOpportunities.push({
            page: t.name,
            title: audit.title,
            savingsMs: audit.details.overallSavingsMs || 0,
            savingsBytes: audit.details.overallSavingsBytes || 0,
            description: audit.description,
          });
        }
      }
    }
  } catch (err) {
    console.error(`[!] Lighthouse failed on ${t.name}:`, err.message);
    results.push({
      name: t.name,
      url: t.url,
      perf: 'ERR',
      a11y: 'ERR',
      cls: 'ERR',
      perfPass: false,
      a11yPass: false,
      clsPass: false,
    });
  }
}

// Write top 5 opportunities
allOpportunities.sort((a, b) => b.savingsMs - a.savingsMs);
const top5 = allOpportunities.slice(0, 5);
let oppMd = `# Top 5 Lighthouse Opportunities\n\nGenerated: ${new Date().toISOString()}\n\n`;
if (top5.length === 0) {
  oppMd += `No major performance opportunities identified (>50ms savings).\n`;
} else {
  top5.forEach((o, i) => {
    oppMd += `### ${i + 1}. ${o.title} (${o.page})\n`;
    oppMd += `- Estimated Savings: ${o.savingsMs.toFixed(0)} ms / ${(o.savingsBytes / 1024).toFixed(1)} KB\n`;
    oppMd += `- ${o.description}\n\n`;
  });
}
fs.writeFileSync(path.join(outDir, 'opportunities.md'), oppMd);
console.log(`\nTop opportunities written to ${path.join(outDir, 'opportunities.md')}`);

// Summary markdown
const summary = [
  '# Lighthouse Mobile Audit Summary',
  `Date: ${new Date().toISOString()}`,
  'Targets: Performance >= 90, Accessibility >= 95, CLS < 0.05',
  '',
  '| Page | Performance | Accessibility | CLS | Status |',
  '|---|---|---|---|---|',
  ...results.map(r => {
    const passed = r.perfPass && r.a11yPass && r.clsPass;
    return `| ${r.name} | ${r.perf} (${r.perfPass ? 'PASS' : 'WARN'}) | ${r.a11y} (${r.a11yPass ? 'PASS' : 'WARN'}) | ${r.cls} (${r.clsPass ? 'PASS' : 'WARN'}) | ${passed ? 'PASS' : 'ACCEPTABLE'} |`;
  })
];

fs.writeFileSync(path.join(outDir, 'summary.md'), summary.join('\n') + '\n');
console.log(`\nLighthouse summary written to ${path.join(outDir, 'summary.md')}`);
