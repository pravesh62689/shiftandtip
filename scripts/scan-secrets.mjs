import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

console.log('=== Pre-Commit Secret Scanner ===');

const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' })
  .split(/\r?\n/)
  .map(f => f.trim())
  .filter(Boolean);

console.log(`Auditing ${stagedFiles.length} staged file(s)...`);

const BINARY_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.ico', '.woff', '.woff2', '.ttf', '.eot',
  '.zip', '.7z', '.tar', '.gz', '.pdf', '.exe'
]);

let violations = 0;

for (const file of stagedFiles) {
  if (file.includes('scan-secrets.mjs')) continue;
  const ext = path.extname(file).toLowerCase();
  if (BINARY_EXTENSIONS.has(ext)) continue;
  if (!fs.existsSync(file)) continue;

  const content = fs.readFileSync(file, 'utf8');

  // 1. Google OAuth Client Secret (GOCSPX-...)
  if (/GOCSPX-[A-Za-z0-9_-]{20,}/.test(content)) {
    console.error(`[VIOLATION] Google OAuth Client Secret ('GOCSPX-') detected in: ${file}`);
    violations++;
  }

  // 2. Real OAuth refresh token
  if (/"refresh_token"\s*:\s*"1\/\/[A-Za-z0-9_-]{20,}"/.test(content) || /1\/\/[A-Za-z0-9_-]{35,}/.test(content)) {
    console.error(`[VIOLATION] OAuth refresh token detected in: ${file}`);
    violations++;
  }

  // 3. Real AdSense publisher ID (ca-pub- followed by digits)
  if (/ca-pub-\d{10,}/.test(content)) {
    console.error(`[VIOLATION] Live AdSense publisher ID ('ca-pub-digits') detected in: ${file}`);
    violations++;
  }

  // 4. Real client_secret key field in JSON
  if (/"client_secret"\s*:\s*"[A-Za-z0-9_-]{16,}"/.test(content)) {
    console.error(`[VIOLATION] client_secret JSON field detected in: ${file}`);
    violations++;
  }
}

if (violations > 0) {
  console.error(`\nABORT: Found ${violations} secret violation(s) in staged files.`);
  process.exit(1);
}

console.log('✓ Secret scan passed: 0 secrets detected in staged files.');
process.exit(0);
