// Minifies design/tokens.css + theme/theme.css and inlines them into theme/theme.xml -> dist/theme.xml
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { ASSET_VERSION, AUTHOR_NAME, CDN_FALLBACK, ADS_ENABLED } from '../config.mjs';

const author = process.env.AUTHOR_NAME || AUTHOR_NAME || 'Pravesh Rathore';
let raw = readFileSync('design/tokens.css', 'utf8') + '\n' + readFileSync('theme/theme.css', 'utf8');
raw = raw.replace(/@v\d+\.\d+\.\d+/g, `@${ASSET_VERSION}`);
if (!ADS_ENABLED) {
  raw = raw.replace(/\/\* Ads[\s\S]*?\.ad--rail\{[^}]*\}/g, '')
           .replace(/\.ad--[^{]*\{[^}]*\}/g, '')
           .replace(/\.ad\{[^}]*\}/g, '')
           .replace(/,\.ad,/g, ',')
           .replace(/,\.ad\b/g, '')
           .replace(/\.ad\b,/g, '');
}
const css = raw
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([{};,>])\s*/g, '$1')
  .replace(/;}/g, '}')
  .trim();
if (css.includes(']]>')) throw new Error('CSS contains ]]> which breaks the Blogger CDATA block');
const kb = Buffer.byteLength(css) / 1024;
if (kb > 25) { console.error('FAIL: inlined CSS is ' + kb.toFixed(1) + ' KB (budget 25 KB)'); process.exit(1); }

let xml = readFileSync('theme/theme.xml', 'utf8')
  .replace('/*__THEME_CSS__*/', css)
  .split('AUTHOR_NAME').join(author)
  .replace(/@v\d+\.\d+\.\d+/g, `@${ASSET_VERSION}`)
  .replace('https://shiftandtip-assets.pages.dev/tools.min.js', `${CDN_FALLBACK}/tools.min.js`);
mkdirSync('dist', { recursive: true });
writeFileSync('dist/theme.xml', xml);
console.log('dist/theme.xml written with ASSET_VERSION ' + ASSET_VERSION + '. Inlined CSS ' + kb.toFixed(1) + ' KB, author "' + author + '".');
