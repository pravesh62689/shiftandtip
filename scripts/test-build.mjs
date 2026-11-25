import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

console.log('Testing build step by step...');
for (const dir of ['tools', 'states', 'guides']) {
  const p = join('content', dir);
  if (!existsSync(p)) continue;
  for (const f of readdirSync(p).filter(x => x.endsWith('.md'))) {
    console.log('Reading:', dir, f);
    const { data: fm, content } = matter(readFileSync(join(p, f), 'utf8'));
    console.log(' - Title:', fm.title);
    const body = marked.parse(content);
    console.log(' - Parsed body length:', body.length);
  }
}
console.log('ALL PASSED!');
