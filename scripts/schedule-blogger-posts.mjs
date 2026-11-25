// scripts/schedule-blogger-posts.mjs
// Schedules 19 enriched posts via Blogger API (3 posts/week: Tue/Thu/Sat 09:00 ET)
// Highest demand states first (CA, TX, FL, NY), followed by CO, AK, PA, IL, GA, then 10 guides.
// Records schedule in docs/publish-schedule.md and updates published.json & live-urls.json.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { google } from 'googleapis';

if (existsSync('.env')) {
  const envContent = readFileSync('.env', 'utf8');
  for (const line of envContent.split(/\r?\n/)) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match && !process.env[match[1].trim()]) {
      process.env[match[1].trim()] = match[2].trim();
    }
  }
}

const BLOG_ID = process.env.BLOG_ID || '4523693247154244983';
const manifest = JSON.parse(readFileSync('dist/posts/manifest.json', 'utf8'));
const pubFile = 'dist/posts/published.json';
const liveUrlsFile = 'data/live-urls.json';

const published = existsSync(pubFile) ? JSON.parse(readFileSync(pubFile, 'utf8')) : {};
const liveUrls = existsSync(liveUrlsFile) ? JSON.parse(readFileSync(liveUrlsFile, 'utf8')) : {};

const ORDER = [
  // High demand states
  'california-overtime-calculator',
  'texas-tipped-minimum-wage-and-overtime-calculator',
  'florida-tipped-minimum-wage-and-overtime-calculator',
  'new-york-tipped-minimum-wage-and-overtime-calculator',
  // Remaining states
  'colorado-overtime-calculator',
  'alaska-overtime-calculator',
  'pennsylvania-tipped-minimum-wage-and-overtime-calculator',
  'illinois-tipped-minimum-wage-and-overtime-calculator',
  'georgia-tipped-minimum-wage-and-overtime-calculator',
  // 10 Guides
  'is-tip-pooling-legal',
  'tip-credit-explained',
  'how-to-split-tips-fairly',
  'what-is-a-typical-tip-out',
  'daily-overtime-states',
  'shift-differential-overtime',
  'tipped-employee-overtime',
  'no-tax-on-tips-rules',
  'no-tax-on-overtime-california',
  'how-to-read-tipped-paystub',
];

// Generate dates: 3 posts/week (Tue, Thu, Sat at 09:00 AM ET = 14:00:00.000Z)
// Starting Tuesday, Dec 1, 2026
function getScheduleDates(count) {
  const dates = [];
  const start = new Date(Date.UTC(2026, 11, 1, 14, 0, 0)); // 2026-12-01 14:00:00Z (Tue)
  let cur = new Date(start);

  while (dates.length < count) {
    const day = cur.getUTCDay(); // 0=Sun, 2=Tue, 4=Thu, 6=Sat
    if (day === 2 || day === 4 || day === 6) {
      dates.push(new Date(cur));
    }
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return dates;
}

const scheduledDates = getScheduleDates(ORDER.length);

const itemsToSchedule = ORDER.map((slug, idx) => {
  const m = manifest.find((x) => x.slug === slug);
  if (!m) throw new Error(`Missing manifest item for slug: ${slug}`);
  return {
    ...m,
    scheduledDate: scheduledDates[idx],
    dateStr: scheduledDates[idx].toISOString(),
  };
});

console.log(`Prepared schedule for ${itemsToSchedule.length} posts:`);
itemsToSchedule.forEach((item, i) => {
  console.log(` ${i + 1}. ${item.slug} -> ${item.dateStr}`);
});

const TOKEN_PATH = 'secrets/token.json';
if (!existsSync(TOKEN_PATH)) {
  console.error('secrets/token.json not found');
  process.exit(1);
}

const token = JSON.parse(readFileSync(TOKEN_PATH, 'utf8'));
const clientSecret = JSON.parse(readFileSync('secrets/client_secret.json', 'utf8'));
const key = clientSecret.installed || clientSecret.web;
const oauth2Client = new google.auth.OAuth2(key.client_id, key.client_secret, key.redirect_uris ? key.redirect_uris[0] : undefined);
oauth2Client.setCredentials(token);
oauth2Client.on('tokens', (newTokens) => {
  const current = JSON.parse(readFileSync(TOKEN_PATH, 'utf8'));
  const merged = { ...current, ...newTokens };
  writeFileSync(TOKEN_PATH, JSON.stringify(merged, null, 2));
});
const blogger = google.blogger({ version: 'v3', auth: oauth2Client });

async function callWithRetry(fn, maxRetries = 5) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isRate = err.code === 429 || (err.message && err.message.includes('Resource has been exhausted'));
      if (isRate && attempt < maxRetries) {
        const delay = attempt * 12000;
        console.warn(`Rate limit 429. Waiting ${delay / 1000}s...`);
        await new Promise((r) => setTimeout(r, delay));
      } else {
        throw err;
      }
    }
  }
}

async function main() {
  const scheduleRows = [];

  for (const item of itemsToSchedule) {
    const content = readFileSync(path.join('dist/posts', item.file), 'utf8');
    const existing = published[item.slug];
    const existingId = existing ? (typeof existing === 'object' ? existing.id : existing) : null;

    let resPost;
    if (existingId) {
      console.log(`[+] Updating scheduled post ${item.slug} (ID: ${existingId})...`);
      resPost = await callWithRetry(() =>
        blogger.posts.patch({
          blogId: BLOG_ID,
          postId: existingId,
          requestBody: {
            title: item.title,
            content,
            labels: item.labels,
            published: item.dateStr,
          },
        })
      );
    } else {
      console.log(`[+] Creating scheduled post ${item.slug} (Slug title: ${item.slugTitle})...`);
      // 1. Create with slugTitle to lock permanent URL
      const created = await callWithRetry(() =>
        blogger.posts.insert({
          blogId: BLOG_ID,
          isDraft: false,
          requestBody: {
            title: item.slugTitle,
            content,
            labels: item.labels,
            published: item.dateStr,
          },
        })
      );

      const newId = created.data.id;
      // 2. Patch full SEO title
      console.log(`    Patching SEO title: "${item.title}"...`);
      resPost = await callWithRetry(() =>
        blogger.posts.patch({
          blogId: BLOG_ID,
          postId: newId,
          requestBody: {
            title: item.title,
          },
        })
      );
    }

    const postData = resPost.data;
    published[item.slug] = {
      id: postData.id,
      url: postData.url,
      published: item.dateStr,
      status: postData.status || 'SCHEDULED',
      title: item.title,
    };
    if (postData.url) {
      liveUrls[item.slug] = postData.url;
    }

    scheduleRows.push({
      slug: item.slug,
      title: item.title,
      scheduled: item.dateStr,
      id: postData.id,
      url: postData.url || 'Pending URL',
      description: item.description,
    });

    writeFileSync(pubFile, JSON.stringify(published, null, 2) + '\n');
    writeFileSync(liveUrlsFile, JSON.stringify(liveUrls, null, 2) + '\n');
    await new Promise((r) => setTimeout(r, 2000));
  }

  // Generate docs/publish-schedule.md
  let doc = `# Shift & Tip Content Publishing Schedule\n\n`;
  doc += `**Schedule Cadence**: 3 posts per week (Tuesdays, Thursdays, Saturdays at 09:00 AM ET / 14:00 UTC)\n`;
  doc += `**Staged Batch**: 19 items (9 priority state calculators + 10 authoritative guides)\n\n`;
  doc += `| # | Scheduled Date (ET) | Post Title | Slug | Blogger ID | Status |\n`;
  doc += `|---|---|---|---|---|---|\n`;

  scheduleRows.forEach((r, i) => {
    const d = new Date(r.scheduled);
    const dateFormatted = d.toLocaleDateString('en-US', { timeZone: 'America/New_York', weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) + ' 09:00 AM ET';
    doc += `| ${i + 1} | ${dateFormatted} | [${r.title}](${r.url}) | \`${r.slug}\` | \`${r.id}\` | SCHEDULED |\n`;
  });

  doc += `\n## Priority Sequence Strategy\n`;
  doc += `1. **High-Demand States**: California (CA), Texas (TX), Florida (FL), New York (NY) — captured during peak holiday and year-end labor searches.\n`;
  doc += `2. **Secondary States**: Colorado (CO), Alaska (AK), Pennsylvania (PA), Illinois (IL), Georgia (GA) — completing statutory daily overtime and key tipped jurisdiction coverage.\n`;
  doc += `3. **Guides & Policy Explainers**: Tip pooling legality, tip credit compliance, fair splitting math, shift differentials, and tax deductions — capturing informational search intent.\n`;

  writeFileSync('docs/publish-schedule.md', doc);
  console.log(`\nSchedule documented in docs/publish-schedule.md`);
}

main().catch((err) => {
  console.error('Scheduling failed:', err);
  process.exit(1);
});
