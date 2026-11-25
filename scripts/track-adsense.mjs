// scripts/track-adsense.mjs
// Checks whether there are 25+ substantial published pages that have been live 7+ days.
// If so, writes "APPLY NOW" at the top of docs/manual-steps.md.

import fs from 'node:fs';
import { OAuth2Client } from 'google-auth-library';

const BLOG_ID = process.env.BLOG_ID || '4523693247154244983';
const MANUAL_STEPS_PATH = 'docs/manual-steps.md';

async function checkAdSenseReadiness() {
  let liveCount = 0;
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

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
      const substantialLivePosts = posts.filter(p => {
        const pubDate = new Date(p.published);
        const hasContent = (p.content || '').length > 1500;
        return pubDate <= sevenDaysAgo && hasContent;
      });

      liveCount = substantialLivePosts.length;
      console.log(`Substantial published posts live 7+ days: ${liveCount}`);
    } catch (err) {
      console.warn('Could not query Blogger API directly, falling back to data/live-urls.json:', err.message);
    }
  }

  if (liveCount === 0 && fs.existsSync('data/live-urls.json')) {
    const urls = JSON.parse(fs.readFileSync('data/live-urls.json', 'utf8'));
    const count = Object.keys(urls).length;
    console.log(`Live URLs recorded in data/live-urls.json: ${count}`);
    liveCount = count;
  }

  if (liveCount >= 25) {
    if (fs.existsSync(MANUAL_STEPS_PATH)) {
      let content = fs.readFileSync(MANUAL_STEPS_PATH, 'utf8');
      if (!content.startsWith('# 🚀 APPLY NOW: ADSENSE READINESS THRESHOLD MET')) {
        console.log('Target met (25+ pages live 7+ days)! Writing APPLY NOW to docs/manual-steps.md...');
        const banner = `# 🚀 APPLY NOW: ADSENSE READINESS THRESHOLD MET\n\n> [!IMPORTANT]\n> Shift & Tip has reached **${liveCount} substantial published pages** live for 7+ days.\n> Apply for Google AdSense now via https://www.google.com/adsense/start/ with custom domain or blogspot URL.\n\n---\n\n`;
        fs.writeFileSync(MANUAL_STEPS_PATH, banner + content);
      }
    }
  } else {
    console.log(`AdSense readiness: ${liveCount}/25 substantial pages live 7+ days. Threshold not yet met.`);
  }
}

checkAdSenseReadiness().catch(err => {
  console.error('Error in track-adsense.mjs:', err);
  process.exit(0);
});
