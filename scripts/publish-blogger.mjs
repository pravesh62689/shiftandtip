// Inserts built posts into Blogger as DRAFTS only, or publishes them.
//   node scripts/publish-blogger.mjs                   -> dry run (lists what would be created)
//   node scripts/publish-blogger.mjs --confirm         -> creates drafts (posts with slugTitle, pages with title) and records ids in dist/posts/published.json
//   node scripts/publish-blogger.mjs --publish --confirm       -> publishes drafts (posts & pages)
//   node scripts/publish-blogger.mjs --patch-titles --confirm   -> sets full SEO titles on posts
// Needs: BLOG_ID env, secrets/client_secret.json (OAuth desktop client, scope blogger). Never commit secrets/.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { google } from 'googleapis';

// Load .env if present
if (existsSync('.env')) {
  const envContent = readFileSync('.env', 'utf8');
  for (const line of envContent.split(/\r?\n/)) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match && !process.env[match[1].trim()]) {
      process.env[match[1].trim()] = match[2].trim();
    }
  }
}

const args = process.argv.slice(2);
const CONFIRM = args.includes('--confirm');
const PUBLISH = args.includes('--publish');
const PATCH = args.includes('--patch-titles');
const UPDATE = args.includes('--update');

const BLOG_ID = process.env.BLOG_ID || '4523693247154244983';
const manifest = JSON.parse(readFileSync('dist/posts/manifest.json', 'utf8'));
const pubFile = 'dist/posts/published.json';
const liveUrlsFile = 'data/live-urls.json';

const published = existsSync(pubFile) ? JSON.parse(readFileSync(pubFile, 'utf8')) : {};
const liveUrls = existsSync(liveUrlsFile) ? JSON.parse(readFileSync(liveUrlsFile, 'utf8')) : {};

// 1. Data layer state verification
const statesData = existsSync('data/states.json') ? JSON.parse(readFileSync('data/states.json', 'utf8')) : { states: [] };
const statesMap = new Map((statesData.states || []).map((s) => [s.code, s]));

function isStateVerified(code) {
  const s = statesMap.get(code.toUpperCase());
  if (!s) return false;
  return s.minWage != null && s.tippedCashWage != null && s.maxTipCredit != null && s.verifiedOn != null;
}

const STATE_SLUGS = {
  california: 'CA',
  alaska: 'AK',
  nevada: 'NV',
  colorado: 'CO',
  texas: 'TX',
  florida: 'FL',
  'new-york': 'NY',
  pennsylvania: 'PA',
  illinois: 'IL',
  georgia: 'GA',
};

function getStatesUsed(m) {
  const list = [];
  for (const [name, code] of Object.entries(STATE_SLUGS)) {
    if (m.slug.includes(name)) list.push(code);
  }
  if (m.slug === 'daily-overtime-states') list.push('CA', 'AK', 'CO', 'NV');
  return [...new Set(list)];
}

// 2. Publish order rules: default 18 items (7 tools + 11 static pages)
const DEFAULT_ALLOWED_SLUGS = new Set([
  // 7 Tools
  'tip-pool-calculator',
  'tip-out-calculator',
  'overtime-and-double-time-calculator',
  'shift-differential-calculator',
  'tipped-overtime-calculator',
  'take-home-pay-with-tips-calculator',
  'no-tax-on-tips-and-overtime-deduction-estimator',
  // 11 Static Pages
  'tip-tools',
  'overtime-tools',
  'shift-pay-tools',
  'state-pay-rules',
  'guides',
  'about',
  'methodology',
  'privacy',
  'terms',
  'contact',
  'corrections',
]);

function isEligibleToStage(m) {
  if (DEFAULT_ALLOWED_SLUGS.has(m.slug)) return true;
  if (m.needsHumanEdit) return false;
  const statesUsed = getStatesUsed(m);
  if (statesUsed.length === 0) return true;
  return statesUsed.every(isStateVerified);
}

const eligible = manifest.filter(isEligibleToStage);
const skipped = manifest.filter((m) => !isEligibleToStage(m));

function getItemId(slug) {
  const item = published[slug];
  if (!item) return null;
  return typeof item === 'object' ? item.id : item;
}

let todo = [];
let modeLabel = 'Create drafts';

if (UPDATE) {
  modeLabel = 'Update content';
  todo = eligible.filter((m) => getItemId(m.slug));
} else if (PATCH) {
  modeLabel = 'Patch titles';
  todo = eligible.filter((m) => !m.isPage && getItemId(m.slug));
} else if (PUBLISH) {
  modeLabel = 'Publish drafts';
  todo = eligible.filter((m) => getItemId(m.slug));
} else {
  modeLabel = 'Create drafts';
  todo = eligible.filter((m) => !getItemId(m.slug));
}

console.log(`${modeLabel}: staging ${todo.length} of ${eligible.length} eligible item(s) (${skipped.length} skipped pending verification or human edit)`);
todo.forEach((m) => console.log(' -', m.slug, '|', m.isPage ? `[PAGE] ${m.title}` : `[POST] ${PATCH ? m.title : m.slugTitle}`));

if (skipped.length) {
  console.log(`\nSkipped (${skipped.length}):`);
  skipped.forEach((m) => {
    const reasons = [];
    if (m.needsHumanEdit) reasons.push('needs human edit');
    const unverifiedStates = getStatesUsed(m).filter((c) => !isStateVerified(c));
    if (unverifiedStates.length) reasons.push('unverified state data: ' + unverifiedStates.join(', '));
    console.log(` * ${m.slug} [${reasons.join('; ')}]`);
  });
}

if (!CONFIRM) {
  console.log('\nDry run. Re-run with --confirm to call the Blogger API.');
  process.exit(0);
}
if (!BLOG_ID) {
  console.error('Set BLOG_ID first (blogID=... in the Blogger dashboard URL or .env).');
  process.exit(1);
}

const TOKEN_PATH = 'secrets/token.json';
if (!existsSync(TOKEN_PATH)) {
  console.error('secrets/token.json not found. Run node scripts/pw/auth-flow.mjs first.');
  process.exit(1);
}

const token = JSON.parse(readFileSync(TOKEN_PATH, 'utf8'));
const clientSecret = JSON.parse(readFileSync('secrets/client_secret.json', 'utf8'));
const key = clientSecret.installed || clientSecret.web;
const oauth2Client = new google.auth.OAuth2(key.client_id, key.client_secret, key.redirect_uris ? key.redirect_uris[0] : undefined);
oauth2Client.setCredentials(token);
const auth = oauth2Client;
console.log('Using cached OAuth token from secrets/token.json');

const blogger = google.blogger({ version: 'v3', auth });

async function callWithRetry(fn, maxRetries = 6) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isRateLimit = err.code === 429 || (err.message && err.message.includes('Resource has been exhausted'));
      if (isRateLimit && attempt < maxRetries) {
        const delay = attempt * 10000;
        console.warn(`Rate limit hit (429). Retrying in ${delay / 1000}s (attempt ${attempt}/${maxRetries})...`);
        await new Promise((r) => setTimeout(r, delay));
      } else {
        throw err;
      }
    }
  }
}

for (const m of todo) {
  const content = readFileSync(path.join('dist/posts', m.file), 'utf8');

  if (UPDATE) {
    const id = getItemId(m.slug);
    if (m.isPage) {
      await callWithRetry(() => blogger.pages.patch({
        blogId: BLOG_ID,
        pageId: id,
        requestBody: { content: content },
      }));
      console.log('updated page content:', m.slug);
    } else {
      await callWithRetry(() => blogger.posts.patch({
        blogId: BLOG_ID,
        postId: id,
        requestBody: { content: content },
      }));
      console.log('updated post content:', m.slug);
    }
  } else if (PATCH) {
    const postId = getItemId(m.slug);
    await callWithRetry(() => blogger.posts.patch({
      blogId: BLOG_ID,
      postId: postId,
      requestBody: { title: m.title },
    }));
    console.log('patched title:', m.slug);
  } else if (PUBLISH) {
    const id = getItemId(m.slug);
    if (m.isPage) {
      const res = await callWithRetry(() => blogger.pages.publish({ blogId: BLOG_ID, pageId: id }));
      console.log('published page:', m.slug, res.data.url);
      liveUrls[m.slug] = res.data.url;
    } else {
      const res = await callWithRetry(() => blogger.posts.publish({ blogId: BLOG_ID, postId: id }));
      console.log('published post:', m.slug, res.data.url);
      liveUrls[m.slug] = res.data.url;
    }
    writeFileSync(liveUrlsFile, JSON.stringify(liveUrls, null, 2));
  } else {
    // Create drafts
    if (m.isPage) {
      const res = await callWithRetry(() => blogger.pages.insert({
        blogId: BLOG_ID,
        isDraft: true,
        requestBody: {
          title: m.title,
          content: content,
        },
      }));
      published[m.slug] = {
        id: res.data.id,
        isPage: true,
        url: res.data.url,
      };
      writeFileSync(pubFile, JSON.stringify(published, null, 2));
      console.log('draft page created:', m.slug, res.data.id);
    } else {
      const res = await callWithRetry(() => blogger.posts.insert({
        blogId: BLOG_ID,
        isDraft: true,
        requestBody: {
          title: m.slugTitle,
          content: content,
          labels: m.labels,
        },
      }));
      published[m.slug] = {
        id: res.data.id,
        isPage: false,
        url: res.data.url,
      };
      writeFileSync(pubFile, JSON.stringify(published, null, 2));
      console.log('draft post created:', m.slug, res.data.id);
    }
  }
  // Polite pause between requests to prevent rate limiting
  await new Promise((r) => setTimeout(r, 2500));
}
console.log('All operations completed successfully.');
