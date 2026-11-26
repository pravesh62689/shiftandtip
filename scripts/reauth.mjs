// Re-mints OAuth tokens for Shift & Tip (Blogger + GSC, port 48121) and FileBrik (GSC, port 48122),
// and updates the GitHub Actions secret BLOGGER_TOKEN_JSON without printing token values.
// Usage: npm run reauth
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { OAuth2Client } from 'google-auth-library';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const CLIENT_SECRET_PATH = path.join(REPO_ROOT, 'secrets', 'client_secret.json');
const TIMEOUT_MS = 1800000; // 30 minutes

if (!fs.existsSync(CLIENT_SECRET_PATH)) {
  console.error(`Missing OAuth client config at ${CLIENT_SECRET_PATH}`);
  process.exit(1);
}

const secretJson = JSON.parse(fs.readFileSync(CLIENT_SECRET_PATH, 'utf8'));
const clientCfg = secretJson.installed || secretJson.web;

async function startConsentListener({ label, profileHint, port, scopes, savePaths }) {
  const server = http.createServer();
  await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));
  const redirectUri = `http://127.0.0.1:${port}/oauth2callback`;
  const oauth = new OAuth2Client(clientCfg.client_id, clientCfg.client_secret, redirectUri);

  const authUrl = oauth.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });

  console.log(`[${label}] Open in ${profileHint}: http://127.0.0.1:${port}/start`);

  const code = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} OAuth timeout (1800s)`)), TIMEOUT_MS);
    server.on('request', (req, res) => {
      const u = new URL(req.url, redirectUri);
      if (u.pathname === '/start') {
        res.writeHead(302, { Location: authUrl });
        res.end();
        return;
      }
      if (u.pathname !== '/oauth2callback') {
        res.writeHead(404);
        res.end();
        return;
      }
      const authCode = u.searchParams.get('code');
      const err = u.searchParams.get('error');
      clearTimeout(timer);
      if (authCode) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<h2>${label} OAuth succeeded. You may close this tab.</h2>`);
        resolve(authCode);
      } else {
        res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<h2>${label} authorization failed: ${err || 'unknown'}</h2>`);
        reject(new Error(err || 'oauth_denied'));
      }
    });
  });

  server.close();
  const { tokens } = await oauth.getToken(code);
  const payload = JSON.stringify(tokens, null, 2) + '\n';
  for (const rel of savePaths) {
    const out = path.join(REPO_ROOT, rel);
    fs.writeFileSync(out, payload);
    console.log(`[${label}] Saved token to ${rel}`);
  }
  return payload;
}

async function main() {
  console.log('Starting OAuth re-auth listeners (30-min timeout)...');

  const shiftPromise = startConsentListener({
    label: 'Shift & Tip',
    profileHint: 'MAIN Chrome profile (rathore.monty2002@gmail.com)',
    port: 48121,
    scopes: [
      'https://www.googleapis.com/auth/blogger',
      'https://www.googleapis.com/auth/webmasters.readonly',
    ],
    savePaths: ['secrets/token.json', 'secrets/token-gsc-shiftandtip.json'],
  }).then((payload) => {
    execFileSync('gh', ['secret', 'set', 'BLOGGER_TOKEN_JSON', '-R', 'pravesh62689/shiftandtip'], {
      input: payload,
      stdio: ['pipe', 'inherit', 'inherit'],
    });
    console.log('[Shift & Tip] Updated GitHub secret BLOGGER_TOKEN_JSON.');
  });

  const filebrikPromise = startConsentListener({
    label: 'FileBrik',
    profileHint: 'FILEBRIK Chrome profile (praveshrathore2002@gmail.com)',
    port: 48122,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    savePaths: ['secrets/token-gsc-filebrik.json'],
  });

  await Promise.all([shiftPromise, filebrikPromise]);
  console.log('All OAuth tokens refreshed and synced.');
}

main().catch((err) => {
  console.error('Re-auth failed:', err.message);
  process.exit(1);
});
