// Verifies Blogger API authorization with a no-op blogs.get call.
// Exits 0 if authenticated, exits 1 if token expired or missing.
import { readFileSync, existsSync } from 'node:fs';
import { google } from 'googleapis';

const BLOG_ID = process.env.BLOG_ID || '4523693247154244983';

let token;
let clientSecret;

if (existsSync('secrets/token.json')) {
  token = JSON.parse(readFileSync('secrets/token.json', 'utf8'));
} else if (process.env.BLOGGER_TOKEN_JSON) {
  token = JSON.parse(process.env.BLOGGER_TOKEN_JSON);
} else {
  console.error('✗ No token found in secrets/token.json or BLOGGER_TOKEN_JSON env var.');
  process.exit(1);
}

if (existsSync('secrets/client_secret.json')) {
  clientSecret = JSON.parse(readFileSync('secrets/client_secret.json', 'utf8'));
} else if (process.env.BLOGGER_CLIENT_SECRET_JSON) {
  clientSecret = JSON.parse(process.env.BLOGGER_CLIENT_SECRET_JSON);
} else {
  console.error('✗ No client_secret found in secrets/client_secret.json or BLOGGER_CLIENT_SECRET_JSON env var.');
  process.exit(1);
}

const key = clientSecret.installed || clientSecret.web;
const oauth2Client = new google.auth.OAuth2(key.client_id, key.client_secret, key.redirect_uris ? key.redirect_uris[0] : undefined);
oauth2Client.setCredentials(token);

const blogger = google.blogger({ version: 'v3', auth: oauth2Client });

try {
  console.log(`Verifying Blogger API access for blog ${BLOG_ID}...`);
  const res = await blogger.blogs.get({ blogId: BLOG_ID });
  console.log(`✓ Blogger API authorization verified! Blog title: "${res.data.name}" (${res.data.url})`);
  process.exit(0);
} catch (err) {
  console.error('✗ Blogger API authorization check FAILED:', err.message);
  process.exit(1);
}
