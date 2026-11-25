import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { OAuth2Client } from 'google-auth-library';
import { chromium } from 'playwright';

const rootDir = 'F:\\shiftandtip';
const profileDir = process.env.PW_PROFILE_DIR || 'C:\\Users\\prave\\.shiftandtip-pw-profile';
const tokenPath = path.join(rootDir, 'secrets', 'token.json');
const clientSecretPath = path.join(rootDir, 'secrets', 'client_secret.json');
const oauthReportsDir = path.join(rootDir, 'reports', 'oauth');

if (!fs.existsSync(oauthReportsDir)) fs.mkdirSync(oauthReportsDir, { recursive: true });

async function main() {
  const secretData = JSON.parse(fs.readFileSync(clientSecretPath, 'utf8'));
  const key = secretData.installed || secretData.web;

  const port = 3000;
  const redirectUri = `http://localhost:${port}/oauth2callback`;
  const oauth2Client = new google.auth.OAuth2(key.client_id, key.client_secret, redirectUri);

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/blogger'],
    prompt: 'consent',
  });

  console.log('Starting local OAuth callback server on port', port);
  let resolveCode;
  const codePromise = new Promise((resolve) => { resolveCode = resolve; });

  const server = http.createServer((req, res) => {
    const u = new URL(req.url, `http://localhost:${port}`);
    if (u.pathname === '/oauth2callback') {
      const code = u.searchParams.get('code');
      const err = u.searchParams.get('error');
      if (code) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Authentication successful! You can close this window.</h1>');
        resolveCode(code);
      } else {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end(`<h1>Authentication failed: ${err}</h1>`);
        resolveCode(null);
      }
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  await new Promise((resolve) => server.listen(port, resolve));

  console.log('Launching Chrome with persistent profile to authorize OAuth...');
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1280, height: 800 },
  });

  const page = context.pages()[0] || await context.newPage();
  console.log('Navigating to OAuth consent URL...');
  await page.goto(authUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  const startTime = Date.now();
  let step = 0;

  while (Date.now() - startTime < 60000) {
    step++;
    await page.waitForTimeout(2000);
    const curUrl = page.url();
    console.log(`[Step ${step}] URL: ${curUrl}`);

    await page.screenshot({ path: path.join(oauthReportsDir, `step-${step}.png`) });

    if (curUrl.includes('localhost:3000/oauth2callback')) {
      console.log('Reached callback URL!');
      break;
    }

    // 1. Account Chooser (ONLY on accountchooser URL)
    if (curUrl.includes('accountchooser')) {
      console.log('On accountchooser page. Looking for account link...');
      const accountItem = page.locator('[role="link"]:has-text("rathore.monty2002@gmail.com"), [role="button"]:has-text("rathore.monty2002@gmail.com")').first();
      if (await accountItem.count() > 0) {
        console.log('Clicking account link...');
        await accountItem.click();
        await page.waitForTimeout(3000);
        continue;
      }
    }

    // 2. Unverified app warning (oauth/warning)
    if (curUrl.includes('warning') || (await page.locator('text="Google hasn\'t verified this app"').count()) > 0) {
      console.log('On unverified app screen. Looking for Continue button...');
      const continueBtn = page.locator('button:has-text("Continue"), [role="button"]:has-text("Continue"), a:has-text("Continue")').first();
      if (await continueBtn.count() > 0 && await continueBtn.isVisible()) {
        console.log('Clicking Continue on unverified app warning...');
        await continueBtn.click();
        await page.waitForTimeout(3000);
        continue;
      }
    }

    // 3. Final Consent Screen (oauth/v3/consent)
    if (curUrl.includes('consent')) {
      console.log('On consent screen. Looking for Continue / Allow button...');
      // Check any unchecked scope checkboxes if present
      const checkboxes = page.locator('input[type="checkbox"]');
      const cbCount = await checkboxes.count();
      for (let i = 0; i < cbCount; i++) {
        const cb = checkboxes.nth(i);
        if (!(await cb.isChecked())) {
          console.log(`Checking permission checkbox ${i + 1}...`);
          await cb.check({ force: true }).catch(() => {});
        }
      }

      // The Continue button on consent page
      const continueBtn = page.locator('button:has-text("Continue"), [role="button"]:has-text("Continue"), button:has-text("Allow"), [role="button"]:has-text("Allow")').last();
      if (await continueBtn.count() > 0 && await continueBtn.isVisible()) {
        console.log('Clicking final Continue button on consent page...');
        await continueBtn.click();
        await page.waitForTimeout(4000);
      } else {
        console.log('Fallback: clicking Continue via evaluate...');
        await page.evaluate(() => {
          const all = Array.from(document.querySelectorAll('button, div[role="button"], a, span'));
          const btn = all.reverse().find(el => el.innerText && el.innerText.trim() === 'Continue');
          if (btn) btn.click();
        });
        await page.waitForTimeout(4000);
      }
    }
  }

  console.log('Waiting for authorization code promise...');
  const code = await Promise.race([
    codePromise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('OAuth code callback timeout')), 30000)),
  ]);

  if (!code) {
    throw new Error('No authorization code received.');
  }

  console.log('Exchanging authorization code for tokens...');
  const { tokens } = await oauth2Client.getToken(code);
  fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2), 'utf8');
  console.log('OAuth token saved successfully to:', tokenPath);

  await page.waitForTimeout(2000);
  await context.close();
  server.close();
  console.log('OAUTH_FLOW_COMPLETE');
}

main().catch(err => {
  console.error('OAuth flow failed:', err);
  process.exit(1);
});
