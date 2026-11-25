// scripts/generate-print-pdfs.mjs
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const projectPrintDir = 'F:/shiftandtip/dist/assets/print';
const downloadsDir = 'C:/Users/prave/Downloads';
if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir, { recursive: true });

const files = [
  'tip-out-sheet',
  'weekly-shift-log',
  'overtime-tracker'
];

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  for (const f of files) {
    const htmlPath = path.join(projectPrintDir, `${f}.html`);
    const pdfPath = path.join(projectPrintDir, `${f}.pdf`);
    const dlPath = path.join(downloadsDir, `${f}.pdf`);

    console.log(`Generating PDF for ${f}...`);
    await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'load' });
    await page.pdf({
      path: pdfPath,
      format: 'Letter',
      printBackground: true,
      margin: { top: '0.4in', bottom: '0.4in', left: '0.4in', right: '0.4in' }
    });

    // Copy to Downloads
    fs.copyFileSync(pdfPath, dlPath);
    console.log(`[+] Generated: ${pdfPath}`);
    console.log(`[+] Copied to: ${dlPath}`);
  }

  await browser.close();
  console.log('Finished generating printable PDFs.');
}

run();
