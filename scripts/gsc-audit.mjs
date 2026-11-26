// Usage: node scripts/gsc-audit.mjs --site https://shiftandtip.blogspot.com/ [--auth] [--out reports/gsc-audit.json]
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { OAuth2Client } from 'google-auth-library';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const SLEEP_MS = 160; // <= 375 calls/min, well under 600 calls/min
const MAX_DAILY_CALLS = 1900;

function argVal(flag) {
  const i = process.argv.indexOf(flag);
  return i > -1 ? process.argv[i + 1] : null;
}

const rawSite = argVal('--site');
if (!rawSite) {
  console.error('Usage: node scripts/gsc-audit.mjs --site <url> [--auth] [--out <path>]');
  process.exit(2);
}

const siteUrl = rawSite.endsWith('/') ? rawSite : `${rawSite}/`;
const isFileBrik = /filebrik/i.test(siteUrl);
const siteKey = isFileBrik ? 'filebrik' : 'shiftandtip';
const tokenPath = path.join(REPO_ROOT, 'secrets', `token-gsc-${siteKey}.json`);
const clientSecretPath = path.join(REPO_ROOT, 'secrets', 'client_secret.json');
const outPath = argVal('--out') || path.join(REPO_ROOT, 'reports', `gsc-audit-${siteKey}.json`);
const DO_AUTH = process.argv.includes('--auth');
const PRINT_AUTH_URL = process.argv.includes('--print-auth-url');
const OAUTH_PORT = Number(argVal('--port') || 0);

if (!fs.existsSync(clientSecretPath)) {
  console.error(`Missing OAuth client config at ${clientSecretPath}`);
  process.exit(1);
}

const secretJson = JSON.parse(fs.readFileSync(clientSecretPath, 'utf8'));
const clientCfg = secretJson.installed || secretJson.web;

async function authorizeInteractive() {
  const server = http.createServer();
  await new Promise((resolve) => server.listen(OAUTH_PORT, '127.0.0.1', resolve));
  const { port } = server.address();
  const redirectUri = `http://127.0.0.1:${port}/oauth2callback`;
  const oauth = new OAuth2Client(clientCfg.client_id, clientCfg.client_secret, redirectUri);

  const authUrl = oauth.generateAuthUrl({
    access_type: 'offline',
    scope: [SCOPE],
    prompt: 'consent',
  });

  if (PRINT_AUTH_URL) {
    console.log(`AUTH_URL=${authUrl}`);
    server.close();
    process.exit(0);
  }

  console.log(`\nOpen in ${isFileBrik ? 'FILEBRIK' : 'MAIN'} Chrome profile: http://127.0.0.1:${port}/start`);
  console.log(`Waiting on ${redirectUri} for OAuth callback (up to 30 min)...`);

  const code = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('OAuth callback timeout (1800s)')), 1800000);
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
        res.end('<h2>GSC authorization succeeded. Close this tab and return to Antigravity.</h2>');
        resolve(authCode);
      } else {
        res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<h2>Authorization failed: ${err || 'unknown'}</h2>`);
        reject(new Error(err || 'oauth_denied'));
      }
    });
  });

  const { tokens } = await oauth.getToken(code);
  fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2), 'utf8');
  server.close();
  console.log(`Saved GSC token to ${path.relative(REPO_ROOT, tokenPath)}`);
  return tokens;
}

async function fetchSitemapUrls(originUrl) {
  const base = originUrl.replace(/\/$/, '');
  const found = new Set();

  async function walk(smUrl, depth = 0) {
    if (depth > 3) return;
    try {
      const r = await fetch(smUrl);
      if (!r.ok) return;
      const xml = await r.text();
      const childSitemaps = [...xml.matchAll(/<sitemap>[\s\S]*?<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
      if (childSitemaps.length) {
        for (const c of childSitemaps) await walk(c, depth + 1);
      } else {
        for (const m of xml.matchAll(/<url>[\s\S]*?<loc>([^<]+)<\/loc>/g)) {
          found.add(m[1].trim());
        }
      }
    } catch {
      // ignore fetch issue
    }
  }

  if (isFileBrik) {
    await walk(`${base}/sitemap-index.xml`);
  } else {
    await walk(`${base}/sitemap.xml`);
    await walk(`${base}/sitemap-pages.xml`);
  }
  return [...found];
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  let tokens;
  if (fs.existsSync(tokenPath) && !DO_AUTH && !PRINT_AUTH_URL) {
    tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
  } else if (DO_AUTH || PRINT_AUTH_URL) {
    tokens = await authorizeInteractive();
  } else {
    console.error(`MISSING_TOKEN: ${path.relative(REPO_ROOT, tokenPath)} does not exist. Re-run with --auth.`);
    process.exit(3);
  }

  const oauth = new OAuth2Client(clientCfg.client_id, clientCfg.client_secret);
  oauth.setCredentials(tokens);
  oauth.on('tokens', (updated) => {
    const merged = { ...tokens, ...updated };
    fs.writeFileSync(tokenPath, JSON.stringify(merged, null, 2), 'utf8');
  });

  async function apiRequest(url, options = {}) {
    try {
      const res = await oauth.request({ url, ...options });
      return res.data;
    } catch (err) {
      const msg = err?.response?.data ? JSON.stringify(err.response.data) : err.message;
      if (/accessNotConfigured|SERVICE_DISABLED|has not been used/i.test(msg)) {
        console.error('SEARCH_CONSOLE_API_DISABLED:', msg);
        process.exit(4);
      }
      throw new Error(`GSC API error (${err?.response?.status || 'ERR'}): ${msg}`);
    }
  }

  const sitesRes = await apiRequest('https://www.googleapis.com/webmasters/v3/sites');
  const sitemapsRes = await apiRequest(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps`
  );

  const sitemapUrls = await fetchSitemapUrls(siteUrl);
  const inspections = [];
  const toInspect = sitemapUrls.slice(0, MAX_DAILY_CALLS);

  for (const url of toInspect) {
    await sleep(SLEEP_MS);
    try {
      const data = await apiRequest('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
        method: 'POST',
        data: { inspectionUrl: url, siteUrl, languageCode: 'en-US' },
      });
      const idx = data?.inspectionResult?.indexStatusResult || {};
      const mob = data?.inspectionResult?.mobileUsabilityResult || {};
      inspections.push({
        url,
        verdict: idx.verdict || null,
        coverageState: idx.coverageState || null,
        indexingState: idx.indexingState || null,
        lastCrawlTime: idx.lastCrawlTime || null,
        googleCanonical: idx.googleCanonical || null,
        userCanonical: idx.userCanonical || null,
        canonicalMismatch: Boolean(idx.googleCanonical && idx.userCanonical && idx.googleCanonical !== idx.userCanonical),
        robotsTxtState: idx.robotsTxtState || null,
        pageFetchState: idx.pageFetchState || null,
        mobileUsability: mob.verdict || 'UNSPECIFIED',
        mobileIssues: mob.issues || [],
      });
    } catch (err) {
      inspections.push({ url, error: err.message });
    }
  }

  const coverageBreakdown = {};
  for (const item of inspections) {
    const k = item.coverageState || item.error || 'UNKNOWN';
    coverageBreakdown[k] = (coverageBreakdown[k] || 0) + 1;
  }

  const report = {
    auditedAt: new Date().toISOString(),
    siteUrl,
    sitesList: (sitesRes.siteEntry || []).map((s) => ({ siteUrl: s.siteUrl, permissionLevel: s.permissionLevel })),
    sitemapsList: (sitemapsRes.sitemap || []).map((s) => ({
      path: s.path,
      lastSubmitted: s.lastSubmitted || null,
      lastDownloaded: s.lastDownloaded || null,
      isPending: s.isPending || false,
      errors: Number(s.errors || 0),
      warnings: Number(s.warnings || 0),
      contents: s.contents || [],
    })),
    summary: {
      sitemapUrlCount: sitemapUrls.length,
      inspectedCount: inspections.length,
      indexedCount: inspections.filter((i) => i.verdict === 'PASS' || /Submitted and indexed/i.test(i.coverageState || '')).length,
      notIndexedCount: inspections.filter((i) => i.verdict !== 'PASS' && !/Submitted and indexed/i.test(i.coverageState || '')).length,
      canonicalMismatches: inspections.filter((i) => i.canonicalMismatch).map((i) => ({ url: i.url, googleCanonical: i.googleCanonical, userCanonical: i.userCanonical })),
      coverageBreakdown,
    },
    inspections,
  };

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(JSON.stringify({ outPath, ...report.summary, sitemaps: report.sitemapsList, sites: report.sitesList }, null, 2));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
