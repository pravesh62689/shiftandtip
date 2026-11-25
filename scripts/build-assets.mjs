// Bundles src/ui/tools.js -> dist/assets/tools.min.js (fails if > 40 KB gzip) and copies data/states.json.
import { build } from 'esbuild';
import { readFileSync, copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

mkdirSync('dist/assets', { recursive: true });
await build({ entryPoints: ['src/ui/tools.js'], bundle: true, minify: true, format: 'iife', target: 'es2019', outfile: 'dist/assets/tools.min.js', legalComments: 'none' });
const gz = gzipSync(readFileSync('dist/assets/tools.min.js')).length / 1024;
if (gz > 40) { console.error('FAIL: tools.min.js is ' + gz.toFixed(1) + ' KB gzipped (budget 40 KB)'); process.exit(1); }
if (existsSync('data/states.json')) copyFileSync('data/states.json', 'dist/assets/states.json');
console.log('dist/assets/tools.min.js ' + gz.toFixed(1) + ' KB gzipped' + (existsSync('data/states.json') ? '; states.json copied.' : '.'));
