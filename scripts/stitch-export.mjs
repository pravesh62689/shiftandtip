// scripts/stitch-export.mjs
// Exports every screen of a Stitch project (HTML + PNG) through the Stitch MCP API. No browser, no clicks.
// Usage (PowerShell, in F:\shiftandtip):  node scripts/stitch-export.mjs [projectId]
// Needs the STITCH_API_KEY environment variable (setx STITCH_API_KEY "<key>" then open a new terminal).
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const KEY = process.env.STITCH_API_KEY;
const PROJECT = process.argv[2] || '7797411789656205095';
const ENDPOINT = 'https://stitch.googleapis.com/mcp';
const OUT = path.resolve('design/exports');

if (!KEY) {
  console.error('STITCH_API_KEY is not set. Run: setx STITCH_API_KEY "<your key>"  then open a NEW terminal.');
  process.exit(1);
}

let sessionId = null;
let rpcId = 0;

function parseSSE(text, id) {
  for (const ev of text.split(/\r?\n\r?\n/)) {
    const data = ev.split(/\r?\n/).filter((l) => l.startsWith('data:')).map((l) => l.slice(5).replace(/^ /, '')).join('\n');
    if (!data) continue;
    try { const m = JSON.parse(data); if (m.id === id) return m; } catch { /* skip */ }
  }
  return null;
}

async function rpc(method, params, notification = false) {
  const body = { jsonrpc: '2.0', method };
  if (params !== undefined) body.params = params;
  if (!notification) body.id = ++rpcId;
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', 'X-Goog-Api-Key': KEY };
  if (sessionId) headers['Mcp-Session-Id'] = sessionId;
  const res = await fetch(ENDPOINT, { method: 'POST', headers, body: JSON.stringify(body) });
  const sid = res.headers.get('mcp-session-id');
  if (sid) sessionId = sid;
  if (notification) return null;
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} -> HTTP ${res.status}: ${text.slice(0, 300)}`);
  const msg = (res.headers.get('content-type') || '').includes('text/event-stream') ? parseSSE(text, body.id) : JSON.parse(text);
  if (!msg) throw new Error(`${method}: no JSON-RPC response`);
  if (msg.error) throw new Error(`${method}: ${JSON.stringify(msg.error).slice(0, 300)}`);
  return msg.result;
}

function payload(result) {
  if (result?.structuredContent) return result.structuredContent;
  const texts = (result?.content || []).filter((c) => c.type === 'text').map((c) => c.text);
  for (const t of texts) { try { return JSON.parse(t); } catch { /* not JSON */ } }
  return { _text: texts.join('\n') };
}

async function call(name, args) {
  const r = await rpc('tools/call', { name, arguments: args });
  if (r?.isError) throw new Error(`${name}: ${JSON.stringify(r.content).slice(0, 300)}`);
  return payload(r);
}

const props = (tool) => Object.keys(tool.inputSchema?.properties || {});
function argsFor(tool, screenId) {
  const a = {};
  for (const k of props(tool)) {
    if (/^project_?id$/i.test(k)) a[k] = PROJECT;
    else if (/^screen_?id$/i.test(k) && screenId) a[k] = screenId;
    else if (k === 'name') a[k] = screenId ? `projects/${PROJECT}/screens/${screenId}` : `projects/${PROJECT}`;
    else if (k === 'parent') a[k] = `projects/${PROJECT}`;
  }
  return a;
}

function screenIds(obj) {
  const ids = new Set();
  const s = JSON.stringify(obj);
  for (const m of s.matchAll(/screens\/([A-Za-z0-9_-]{16,})/g)) ids.add(m[1]);
  (function walk(o) {
    if (Array.isArray(o)) o.forEach(walk);
    else if (o && typeof o === 'object') {
      if (typeof o.id === 'string' && /^[a-f0-9]{24,}$/i.test(o.id) && (o.title || o.screenshot || o.htmlCode)) ids.add(o.id);
      Object.values(o).forEach(walk);
    }
  })(obj);
  return [...ids];
}

function urls(obj, p = '', out = []) {
  if (Array.isArray(obj)) obj.forEach((o, i) => urls(o, `${p}[${i}]`, out));
  else if (obj && typeof obj === 'object') for (const [k, v] of Object.entries(obj)) urls(v, p ? `${p}.${k}` : k, out);
  else if (typeof obj === 'string' && /^https?:\/\//.test(obj)) out.push({ p: p.toLowerCase(), url: obj });
  return out;
}

function findInlineHtml(obj) {
  let found = null;
  (function walk(o) {
    if (found) return;
    if (typeof o === 'string' && /<html[\s>]/i.test(o)) found = o;
    else if (Array.isArray(o)) o.forEach(walk);
    else if (o && typeof o === 'object') Object.values(o).forEach(walk);
  })(obj);
  return found;
}

const pick = (o, keys) => { for (const k of keys) if (o?.[k] != null) return o[k]; return null; };

function sName(title, width) {
  const t = (title || '').toLowerCase();
  const mobile = (width && Number(width) < 600) || /mobile/.test(t);
  const d = mobile ? 'mobile' : 'desktop';
  if (/design system|component/.test(t)) return 'S0-desktop';
  if (/tip pooling legal|guide|article|is tip/.test(t)) return `S5-${d}`;
  if (/california|overtime|double time/.test(t)) return `S2-${d}`;
  if (/state.*(rule|law)|hub/.test(t)) return `S4-${d}`;
  if (/tip pool/.test(t)) return `S1-${d}`;
  if (/home|pay math|shift & tip$/.test(t)) return `S3-${d}`;
  return null;
}
const slug = (s) => (s || 'screen').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);

async function download(url, file) {
  const headers = /googleapis\.com/.test(new URL(url).hostname) ? { 'X-Goog-Api-Key': KEY } : {};
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`download HTTP ${res.status} for ${file}`);
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
}

(async () => {
  await mkdir(OUT, { recursive: true });
  await rpc('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'stitch-export', version: '1.0.0' } });
  await rpc('notifications/initialized', undefined, true);
  const { tools = [] } = await rpc('tools/list', {});
  const listTool = tools.find((t) => t.name === 'list_screens');
  const getTool = tools.find((t) => t.name === 'get_screen');
  if (!listTool || !getTool) {
    console.error('Expected list_screens and get_screen. Tools available:', tools.map((t) => t.name).join(', '));
    process.exit(1);
  }

  const listed = await call(listTool.name, argsFor(listTool));
  const ids = screenIds(listed);
  if (!ids.length) { console.error('No screens found. Raw list_screens output:\n', JSON.stringify(listed).slice(0, 1500)); process.exit(1); }
  console.log(`Found ${ids.length} screens in project ${PROJECT}.`);

  const screens = [];
  for (const id of ids) {
    try {
      const s = await call(getTool.name, argsFor(getTool, id));
      const root = s.screen || s;
      screens.push({
        id, data: s,
        title: pick(root, ['title', 'displayName', 'name']) || '',
        width: pick(root, ['width']) ?? pick(root.screenshot || {}, ['width']),
        height: pick(root, ['height']) ?? pick(root.screenshot || {}, ['height']),
        time: Date.parse(pick(root, ['updateTime', 'createTime']) || '') || 0,
      });
    } catch (e) { console.error(`  ! ${id}: ${e.message}`); }
  }

  screens.sort((a, b) => b.time - a.time); // newest first gets the canonical S-name
  const used = new Set();
  const manifest = [];
  for (const s of screens) {
    let base = sName(s.title, s.width) || slug(s.title);
    if (used.has(base)) base = `${base}__${s.id.slice(0, 6)}`;
    used.add(base);
    const found = urls(s.data);
    const htmlUrl = (found.find((u) => /html|code/.test(u.p)) || {}).url;
    const pngUrl = (found.find((u) => /screenshot|image|png/.test(u.p)) || {}).url;
    const files = [];
    try {
      if (htmlUrl) { await download(htmlUrl, path.join(OUT, `${base}.html`)); files.push(`${base}.html`); }
      else { const inline = findInlineHtml(s.data); if (inline) { await writeFile(path.join(OUT, `${base}.html`), inline); files.push(`${base}.html`); } }
      if (pngUrl) { await download(pngUrl, path.join(OUT, `${base}.png`)); files.push(`${base}.png`); }
    } catch (e) { console.error(`  ! ${base}: ${e.message}`); }
    manifest.push({ file: base, id: s.id, title: s.title, width: s.width, height: s.height, files });
    console.log(`${files.length === 2 ? 'OK  ' : 'PART'} ${base.padEnd(22)} ${s.title}  [${s.id}]  ${files.join(', ') || 'no files'}`);
  }
  await writeFile(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`\nSaved to ${OUT}  (manifest.json lists every screen).`);
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
