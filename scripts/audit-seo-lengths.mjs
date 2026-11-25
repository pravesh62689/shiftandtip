// scripts/audit-seo-lengths.mjs
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dirs = ['content/tools', 'content/states', 'content/guides', 'content/pages'];
const titleIssues = [];
const descIssues = [];
let totalCount = 0;

for (const d of dirs) {
  const files = readdirSync(d).filter(f => f.endsWith('.md') || f.endsWith('.html'));
  for (const f of files) {
    totalCount++;
    const content = readFileSync(join(d, f), 'utf8');
    const titleM = content.match(/^title:\s*(.+)$/m) || content.match(/<title>([^<]+)<\/title>/i);
    const descM = content.match(/^search_description:\s*(.+)$/m) || content.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
    const title = titleM ? titleM[1].trim().replace(/^["'\u201c\u201d]+|["'\u201c\u201d]+$/g, '') : '';
    const desc = descM ? descM[1].trim().replace(/^["'\u201c\u201d]+|["'\u201c\u201d]+$/g, '') : '';
    if (title.length > 60) titleIssues.push({ dir: d, file: f, len: title.length, title });
    if (desc.length > 155) descIssues.push({ dir: d, file: f, len: desc.length, desc });
  }
}

console.log(`Audited ${totalCount} items across all content dirs:`);
console.log(`- Titles > 60 chars: ${titleIssues.length}`);
titleIssues.forEach(x => console.log(`  [${x.len}ch] ${x.dir}/${x.file}: "${x.title}"`));

console.log(`- Descriptions > 155 chars: ${descIssues.length}`);
descIssues.forEach(x => console.log(`  [${x.len}ch] ${x.dir}/${x.file}: "${x.desc}"`));

let report = `# Character Length Audit Report\n\n`;
report += `Total Items Audited: ${totalCount}\n\n`;
report += `## Titles Exceeding 60 Characters (${titleIssues.length})\n`;
for (const t of titleIssues) {
  report += `- **${t.dir}/${t.file}** (${t.len} chars): \`${t.title}\`\n`;
}
report += `\n## Descriptions Exceeding 155 Characters (${descIssues.length})\n`;
for (const d of descIssues) {
  report += `- **${d.dir}/${d.file}** (${d.len} chars): \`${d.desc}\`\n`;
}
writeFileSync('reports/seo-character-counts.md', report);
console.log('Saved reports/seo-character-counts.md');
