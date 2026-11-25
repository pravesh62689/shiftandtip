import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// 1. Static file server
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0].split('#')[0];
  if (reqPath === '/') reqPath = '/preview/index.html';
  const filePath = path.join(rootDir, reqPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
    return;
  }
  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

await new Promise((resolve) => server.listen(8123, '127.0.0.1', resolve));
console.log('Static preview server listening on http://127.0.0.1:8123');

// 2. CDP client helper
class CDP {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.pending = new Map();
    this.events = new Map();

    this.ready = new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      } else if (msg.method) {
        const handlers = this.events.get(msg.method) || [];
        handlers.forEach((h) => h(msg.params));
      }
    };
  }

  send(method, params = {}) {
    const id = this.id++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  on(event, handler) {
    if (!this.events.has(event)) this.events.set(event, []);
    this.events.get(event).push(handler);
  }

  async eval(expr) {
    const res = await this.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.exception?.description || 'Eval failed: ' + expr);
    }
    return res.result.value;
  }

  close() {
    this.ws.close();
  }
}

// 3. Connect to Chrome target
const newTargetRes = await fetch('http://127.0.0.1:9222/json/new?http://127.0.0.1:8123/preview/index.html', { method: 'PUT' });
const targetInfo = await newTargetRes.json();
console.log('Opened target:', targetInfo.id, targetInfo.webSocketDebuggerUrl);

const cdp = new CDP(targetInfo.webSocketDebuggerUrl);
await cdp.ready;

await cdp.send('Page.enable');
await cdp.send('Runtime.enable');
await cdp.send('DOM.enable');

// Ensure page is navigated and ready
await cdp.send('Page.navigate', { url: 'http://127.0.0.1:8123/preview/index.html' });
for (let i = 0; i < 40; i++) {
  const ready = await cdp.eval('document.readyState === "complete" && document.querySelectorAll("[data-tool][data-ready=\\"1\\"]").length === 7');
  if (ready) break;
  await new Promise((r) => setTimeout(r, 100));
}
await new Promise((r) => setTimeout(r, 300));

// Check tool mounts
const toolCount = await cdp.eval('document.querySelectorAll("[data-tool]").length');
const readyCount = await cdp.eval('document.querySelectorAll("[data-tool][data-ready=\\"1\\"]").length');
console.log(`Mounted tools: ${toolCount}, Ready: ${readyCount}`);

if (toolCount !== 7 || readyCount !== 7) {
  throw new Error(`Expected 7 ready tools, got count=${toolCount}, ready=${readyCount}`);
}

// 4. Test engine values in each tool
const results = await cdp.eval(`(() => {
  const getReceipt = (id) => {
    const el = document.getElementById(id);
    if (!el) return null;
    return el.querySelector('[data-result]')?.innerText || '';
  };
  return {
    t1: getReceipt('tool-1'),
    t2: getReceipt('tool-2'),
    t3: getReceipt('tool-3'),
    t4: getReceipt('tool-4'),
    t5: getReceipt('tool-5'),
    t6: getReceipt('tool-6'),
    t7: getReceipt('tool-7')
  };
})()`);

console.log('--- Tool Outputs ---');
console.log('Tool 1 (Tip Pool):\n', results.t1);
console.log('Tool 2 (Tip-Out):\n', results.t2);
console.log('Tool 3 (Overtime):\n', results.t3);
console.log('Tool 4 (Shift Diff):\n', results.t4);
console.log('Tool 5 (Tipped OT):\n', results.t5);
console.log('Tool 6 (Take-Home):\n', results.t6);
console.log('Tool 7 (Deductions):\n', results.t7);

// Validations against engine test specifications
const checks = [
  { name: 'Tool 1 Tip Pool $1,240 Total', pass: results.t1.includes('$1,240.00') && results.t1.includes('$240.00') && results.t1.includes('$213.11') },
  { name: 'Tool 2 Tip-Out Keep $440', pass: results.t2.includes('$180.00') && results.t2.includes('$440.00') },
  { name: 'Tool 3 Overtime $1,030.00', pass: results.t3.includes('$1,030.00') && results.t3.includes('40 h') && results.t3.includes('7 h') && results.t3.includes('0.5 h') },
  { name: 'Tool 4 Shift Diff $997.50', pass: results.t4.includes('$997.50') && results.t4.includes('$21.00/hr') && results.t4.includes('5 h') },
  { name: 'Tool 5 Tipped OT $113.98', pass: results.t5.includes('$113.98') && results.t5.includes('$5.76/hr') },
  { name: 'Tool 6 Take-Home Net $1,175.25', pass: results.t6.includes('$1,500.00') && results.t6.includes('−$93.00') && results.t6.includes('−$21.75') && results.t6.includes('$1,175.25') },
  { name: 'Tool 7 Deductions $22,000 / $2,640', pass: results.t7.includes('$18,000.00') && results.t7.includes('$4,000.00') && results.t7.includes('$22,000.00') && results.t7.includes('$2,640.00') },
];

console.log('\n--- Validation Checks ---');
let allPassed = true;
for (const chk of checks) {
  console.log(`${chk.pass ? 'PASS' : 'FAIL'}: ${chk.name}`);
  if (!chk.pass) allPassed = false;
}

// 5. Create screenshots directory
const screenshotDir = path.join(rootDir, 'preview', 'screenshots');
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

// 6. Set desktop viewport (1200x900) and capture individual tool screenshots
await cdp.send('Emulation.setDeviceMetricsOverride', {
  width: 1200,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});

for (let i = 1; i <= 7; i++) {
  const toolId = `tool-${i}`;
  // Scroll to tool and get bounding box
  const box = await cdp.eval(`(() => {
    const el = document.getElementById('${toolId}');
    if (!el) return null;
    el.scrollIntoView({ behavior: 'instant', block: 'start' });
    const r = el.getBoundingClientRect();
    return { x: window.scrollX + r.left, y: window.scrollY + r.top, width: r.width, height: r.height };
  })()`);

  // Wait a moment for layout/scroll
  await new Promise((r) => setTimeout(r, 200));

  // Capture screenshot of element clip
  const clip = {
    x: box.x,
    y: box.y,
    width: Math.min(box.width, 1200),
    height: box.height,
    scale: 1,
  };
  const shot = await cdp.send('Page.captureScreenshot', { format: 'png', clip });
  const outPath = path.join(screenshotDir, `tool-${i}.png`);
  fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
  console.log(`Saved screenshot: preview/screenshots/tool-${i}.png (${shot.data.length} bytes)`);
}

// 7. Test mobile viewport 390px (iPhone 14 / standard 390px width)
await cdp.send('Emulation.setDeviceMetricsOverride', {
  width: 390,
  height: 844,
  deviceScaleFactor: 2,
  mobile: true,
});

// Scroll to top
await cdp.eval('window.scrollTo(0, 0)');
await new Promise((r) => setTimeout(r, 300));

// Check responsiveness metrics
const mobileCheck = await cdp.eval(`(() => {
  const scrollWidth = document.documentElement.scrollWidth;
  const clientWidth = document.documentElement.clientWidth;
  const overflows = scrollWidth > clientWidth;
  const toolWidths = Array.from(document.querySelectorAll('.tool-section')).map(el => ({
    id: el.id,
    w: el.offsetWidth,
    sw: el.scrollWidth
  }));
  return { scrollWidth, clientWidth, overflows, toolWidths };
})()`);
console.log('\n--- Mobile 390px Check ---');
console.log('Mobile viewport:', mobileCheck);

// Capture mobile screenshot of top tool (tool-1 on mobile)
const mobileShot = await cdp.send('Page.captureScreenshot', { format: 'png' });
const mobileOutPath = path.join(screenshotDir, 'mobile-390px-preview.png');
fs.writeFileSync(mobileOutPath, Buffer.from(mobileShot.data, 'base64'));
console.log(`Saved mobile screenshot: preview/screenshots/mobile-390px-preview.png (${mobileShot.data.length} bytes)`);

// Clean up
cdp.close();
await fetch(`http://127.0.0.1:9222/json/close/${targetInfo.id}`, { method: 'PUT' });
server.close();

if (!allPassed) {
  console.error('Some validation checks failed!');
  process.exit(1);
} else {
  console.log('\nAll 7 tools verified and screenshots captured successfully!');
  process.exit(0);
}
