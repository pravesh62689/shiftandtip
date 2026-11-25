// scripts/test-api-insert.mjs
import { readFileSync } from 'node:fs';
import { google } from 'googleapis';

const token = JSON.parse(readFileSync('secrets/token.json', 'utf8'));
const clientSecret = JSON.parse(readFileSync('secrets/client_secret.json', 'utf8'));
const key = clientSecret.installed || clientSecret.web;
const oauth2Client = new google.auth.OAuth2(key.client_id, key.client_secret, key.redirect_uris ? key.redirect_uris[0] : undefined);
oauth2Client.setCredentials(token);
const blogger = google.blogger({ version: 'v3', auth: oauth2Client });

async function run() {
  try {
    console.log('Testing insert via Blogger API...');
    const res = await blogger.posts.insert({
      blogId: '4523693247154244983',
      isDraft: true,
      requestBody: {
        title: 'test-insert-check',
        content: '<p>Test</p>',
      }
    });
    console.log('SUCCESS! Post ID:', res.data.id, 'URL:', res.data.url);
    await blogger.posts.delete({ blogId: '4523693247154244983', postId: res.data.id });
    console.log('Cleaned up test post.');
  } catch (err) {
    console.error('API Error:', err.response ? JSON.stringify(err.response.data, null, 2) : err.message);
  }
}

run();
