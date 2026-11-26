// scripts/track-adsense.mjs
// Checks AdSense readiness:
//   1. >= 20 substantial posts (>= 600 words) LIVE for >= 7 days
//   2. Updated theme (ASSET_VERSION + sr-only H1) and trust pages (about, privacy, contact) live
//   3. No live page/post contains "pending verification"
// Writes APPLY NOW to docs/manual-steps.md ONLY when all three conditions pass.

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { OAuth2Client } from 'google-auth-library';

const BLOG_ID = process.env.BLOG_ID || '4523693247154244983';
const BLOG_URL = 'https://shiftandtip.blogspot.com';
const MANUAL_STEPS_PATH = 'docs/manual-steps.md';
const MIN_SUBSTANTIAL_POSTS = 20;
const MIN_WORDS = 600;
const MIN_AGE_DAYS = 7;

export function countWords(html) {
  const text = String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text ? text.split(' ').length : 0;
}

export function evaluateAdSenseReadiness({
  substantialCount = 0,
  themeLive = false,
  trustPagesLive = false,
  hasPendingVerification = true,
}) {
  const reasons = [];
  if (substantialCount < MIN_SUBSTANTIAL_POSTS) {
    reasons.push(`Substantial posts live >=${MIN_AGE_DAYS}d: ${substantialCount}/${MIN_SUBSTANTIAL_POSTS}`);
  }
  if (!themeLive) reasons.push('Updated theme (ASSET_VERSION + homepage sr-only H1) not live');
  if (!trustPagesLive) reasons.push('Updated trust pages (about, privacy, contact) not all live');
  if (hasPendingVerification) reasons.push('At least one live page shows "pending verification"');
  return { ready: reasons.length === 0, substantialCount, reasons };
}

async function fetchText(url) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) return { ok: false, status: res.status, text: '' };
  return { ok: true, status: res.status, text: await res.text() };
}

export async function checkLiveSignals() {
  let assetVersion = 'v1.0.4';
  if (fs.existsSync('config.mjs')) {
    const cfg = fs.readFileSync('config.mjs', 'utf8');
    const m = cfg.match(/ASSET_VERSION\s*=\s*['"]([^'"]+)['"]/);
    if (m) assetVersion = m[1];
  }

  const home = await fetchText(`${BLOG_URL}/`);
  const themeLive =
    home.ok &&
    home.text.includes(assetVersion) &&
    /class=['"]sr-only['"][^>]*>Shift &amp; Tip/i.test(home.text);

  const trustUrls = [
    `${BLOG_URL}/p/about-shift-tip.html`,
    `${BLOG_URL}/p/privacy-policy.html`,
    `${BLOG_URL}/p/contact-shift-tip.html`,
  ];
  const trustResults = await Promise.all(trustUrls.map(fetchText));
  const trustPagesLive = trustResults.every(
    (r) => r.ok && !/pending verification/i.test(r.text)
  );
  const hasPendingVerification =
    (home.ok && /pending verification/i.test(home.text)) ||
    trustResults.some((r) => r.ok && /pending verification/i.test(r.text));

  return { themeLive, trustPagesLive, hasPendingVerification };
}

export async function checkAdSenseReadiness() {
  let substantialCount = 0;
  let hasPendingInPosts = false;
  const now = new Date();
  const cutoff = new Date(now.getTime() - MIN_AGE_DAYS * 24 * 60 * 60 * 1000);

  if (fs.existsSync('secrets/client_secret.json') && fs.existsSync('secrets/token.json')) {
    try {
      const creds = JSON.parse(fs.readFileSync('secrets/client_secret.json', 'utf8'));
      const clientSecret = creds.installed || creds.web;
      const tokens = JSON.parse(fs.readFileSync('secrets/token.json', 'utf8'));
      const auth = new OAuth2Client(clientSecret.client_id, clientSecret.client_secret);
      auth.setCredentials(tokens);

      const res = await auth.request({
        url: `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?status=LIVE&maxResults=100`,
      });

      const posts = res.data.items || [];
      for (const p of posts) {
        if (/pending verification/i.test(p.content || '')) {
          hasPendingInPosts = true;
        }
        const pubDate = new Date(p.published);
        const words = countWords(p.content);
        if (pubDate <= cutoff && words >= MIN_WORDS) {
          substantialCount++;
        }
      }
      console.log(`Substantial published posts (>=${MIN_WORDS}w) live ${MIN_AGE_DAYS}+ days: ${substantialCount}`);
    } catch (err) {
      console.warn('Could not query Blogger API:', err.message);
    }
  }

  let liveSignals = { themeLive: false, trustPagesLive: false, hasPendingVerification: true };
  try {
    liveSignals = await checkLiveSignals();
  } catch (err) {
    console.warn('Could not fetch live site signals:', err.message);
  }

  const evaluation = evaluateAdSenseReadiness({
    substantialCount,
    themeLive: liveSignals.themeLive,
    trustPagesLive: liveSignals.trustPagesLive,
    hasPendingVerification: liveSignals.hasPendingVerification || hasPendingInPosts,
  });

  if (evaluation.ready) {
    if (fs.existsSync(MANUAL_STEPS_PATH)) {
      let content = fs.readFileSync(MANUAL_STEPS_PATH, 'utf8');
      if (!content.startsWith('# 🚀 APPLY NOW: ADSENSE READINESS THRESHOLD MET')) {
        console.log('All AdSense gates met! Writing APPLY NOW to docs/manual-steps.md...');
        const banner = `# 🚀 APPLY NOW: ADSENSE READINESS THRESHOLD MET\n\n> [!IMPORTANT]\n> Shift & Tip has reached **${substantialCount} substantial published posts** live for ${MIN_AGE_DAYS}+ days, with updated theme & trust pages live and zero pending verification notices.\n> Apply for Google AdSense now via https://www.google.com/adsense/start/.\n\n---\n\n`;
        fs.writeFileSync(MANUAL_STEPS_PATH, banner + content);
      }
    }
  } else {
    console.log(`AdSense NOT ready: ${evaluation.reasons.join(' | ')}`);
  }

  return evaluation;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  checkAdSenseReadiness().catch((err) => {
    console.error('Error in track-adsense.mjs:', err);
    process.exit(0);
  });
}
