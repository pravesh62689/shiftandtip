import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { tipPool } from '../src/engine/tips.js';
import { grossPay } from '../src/engine/overtime.js';
import { RULES } from '../src/engine/rules.js';
import { fmt } from '../src/engine/money.js';

console.log('Testing each file...');
const tpl = readFileSync('templates/page.html', 'utf8');

for (const dir of ['tools', 'states', 'guides']) {
  const p = join('content', dir);
  if (!existsSync(p)) continue;
  for (const f of readdirSync(p).filter(x => x.endsWith('.md'))) {
    console.log(`Processing ${dir}/${f}`);
    const { data: fm, content } = matter(readFileSync(join(p, f), 'utf8'));
    let body = marked.parse(content);
    console.log(` - parsed marked for ${f}`);
  }
}
console.log('Finished testing without error!');
