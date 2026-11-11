/* Scripted local HTTP fixtures, NOT a production waitlist provider. */
'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { chromium, firefox } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const out = path.resolve(process.env.EVIDENCE_DIR || path.join(root, '..', 'clarity-website-evidence'));
assert(!out.startsWith(root + path.sep), 'Evidence must stay outside the public source tree');
fs.mkdirSync(out, { recursive: true });
let mode = 'unset';
let requests = [];
const evidence = { evidenceType: 'Real browsers against task-owned scripted local HTTP fixtures, not a production backend', checks: [], layouts: [], screenshots: [], browserErrors: [], fixturePayloads: [], productionBackendVerified: false };
const check = (name, data = {}) => { evidence.checks.push({ name, passed: true, ...data }); console.log('PASS', name); };
function listen(server) { return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server.address().port))); }
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const api = http.createServer((req, res) => {
  const current = req.url.split('/')[1];
  if (current !== 'cors-denied') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
  }
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  let raw = '';
  req.on('data', chunk => raw += chunk);
  req.on('end', async () => {
    if (req.method !== 'POST' || !req.url.endsWith('/v1/waitlist')) { res.writeHead(404); res.end(); return; }
    const body = JSON.parse(raw);
    requests.push({ method: req.method, path: req.url, body });
    if (current === 'network-error') { req.socket.destroy(); return; }
    if (current === 'delayed') await delay(700);
    if (current === 'body-timeout') { res.writeHead(200, { 'Content-Type': 'application/json' }); res.write('{'); return; }
    const code = /^http-/.test(current) ? Number(current.slice(5)) : 200;
    res.writeHead(code, { 'Content-Type': 'application/json' });
    if (current === 'malformed') res.end('not JSON');
    else res.end(JSON.stringify({ accepted: current !== 'not-accepted' }));
  });
});
let apiPort;
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain', '.json': 'application/json' };
const site = http.createServer((req, res) => {
  const pathname = new URL(req.url, 'http://127.0.0.1').pathname;
  if (pathname === '/clarity-website/assets/config.js') {
    res.writeHead(200, { 'Content-Type': 'text/javascript', 'Cache-Control': 'no-store' });
    const base = mode === 'unset' ? '' : mode === 'invalid-config' ? 'http://untrusted.example.test' : `http://127.0.0.1:${apiPort}/${mode}`;
    res.end(`window.CLARITY_CONFIG=Object.freeze({waitlistApiBase:${JSON.stringify(base)}});`); return;
  }
  if (!pathname.startsWith('/clarity-website/')) { res.writeHead(404); res.end(); return; }
  let file = path.resolve(root, '.' + decodeURIComponent(pathname.slice('/clarity-website'.length)));
  if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403); res.end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  let status = 200;
  if (!fs.existsSync(file)) { file = path.join(root, '404.html'); status = 404; }
  res.writeHead(status, { 'Content-Type': mime[path.extname(file)] || 'text/plain', 'Cache-Control': 'no-store' });
  let content = fs.readFileSync(file);
  // Fixture-only transport policy: deployed HTML permits only the real API.
  // This server alone allows its real owned loopback HTTP fixture.
  if (path.extname(file) === '.html') {
    content = Buffer.from(content.toString('utf8').replace('connect-src https://clarity-api.tjagent.cc;', `connect-src http://127.0.0.1:${apiPort};`));
  }
  res.end(content);
});
async function capture(page, name) {
  const file = path.join(out, name + '.png');
  await page.screenshot({ path: file, fullPage: true, timeout: 20000 });
  evidence.screenshots.push({ file: path.basename(file), sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
}
async function fill(page) {
  await page.locator('#email').fill('focus@example.test');
  await page.locator('#consent').check();
}
async function layout(page, width, route, textScale = 1) {
  mode = 'unset';
  await page.setViewportSize({ width, height: 900 });
  await page.goto(route);
  if (textScale !== 1) await page.evaluate(scale => document.documentElement.style.fontSize = `${scale * 100}%`, textScale);
  await page.locator('h1').waitFor();
  await page.evaluate(() => { for (const image of document.images) image.loading = 'eager'; });
  await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0), null, { timeout: 10000 });
  const result = await page.evaluate(() => {
    const targets = [...document.querySelectorAll('button,.button,.brand,.nav-link,.quiet-link,.footer a,summary,.consent')].filter(el => el.getClientRects().length);
    return { width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
      clipped: [...document.querySelectorAll('h1,h2,h3,input,.button,button')].filter(el => el.getClientRects().length && !el.closest('[aria-hidden="true"]') && (el.getBoundingClientRect().right > innerWidth + 1 || el.getBoundingClientRect().left < -1)).map(el => el.textContent.slice(0, 60)),
      smallTargets: targets.filter(el => el.getBoundingClientRect().height < 43.9 || el.getBoundingClientRect().width < 43.9).map(el => el.textContent.slice(0, 60)),
      imagesLoaded: [...document.images].every(img => img.complete && img.naturalWidth > 0) };
  });
  assert.equal(result.width, width);
  assert(result.scrollWidth <= width, JSON.stringify(result));
  assert.deepEqual(result.clipped, [], JSON.stringify(result));
  assert.deepEqual(result.smallTargets, [], JSON.stringify(result));
  assert(result.imagesLoaded);
  const name = `${route.endsWith('iphone/') ? 'iphone' : 'home'}-${width}${textScale > 1 ? '-text200' : ''}`;
  evidence.layouts.push({ route: new URL(route).pathname, requestedWidth: width, textScale, ...result });
  await capture(page, name);
  check(`layout ${name}`, result);
}
(async () => {
 let browser;
 try {
  apiPort = await listen(api);
  const sitePort = await listen(site);
  const base = `http://127.0.0.1:${sitePort}/clarity-website/`;
  const localChrome = process.env.CHROMIUM_EXECUTABLE || (fs.existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined);
  browser = await chromium.launch({ executablePath: localChrome, headless: true, args: ['--no-sandbox'] });
  evidence.chromium = browser.version();
  const page = await browser.newPage();
  page.on('pageerror', error => evidence.browserErrors.push(error.message));
  // Layouts exercise actual CSS viewports, not just screenshot dimensions.
  for (const width of [320, 375, 414, 768, 1440]) for (const route of [base, base + 'iphone/']) await layout(page, width, route);
  for (const route of [base, base + 'iphone/']) await layout(page, 375, route, 2);
  for (const width of [320, 375, 414, 768]) {
    await page.setViewportSize({ width, height: 900 });
    for (const suffix of ['privacy/', 'support/', '404.html']) {
      await page.goto(base + suffix);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      check(`document layout ${suffix} ${width}`);
    }
  }
  mode = 'unset';
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const suffix of ['', 'iphone/', 'privacy/', 'support/', '404.html']) {
    const response = await page.goto(base + suffix); assert.equal(response.status(), 200);
    assert.equal(await page.locator('h1').count(), 1);
    assert(await page.locator('meta[name=description]').getAttribute('content'));
    assert((await page.locator('link[rel=canonical]').getAttribute('href')).startsWith('https://teejay.dev/clarity-website/'));
    assert.equal(await page.locator('meta[property="og:image"]').getAttribute('content'), 'https://teejay.dev/clarity-website/assets/og.png');
    for (const href of await page.locator('a[href]').evaluateAll(a => a.map(x => x.getAttribute('href')))) {
      if (href.startsWith('/clarity-website/')) assert.equal((await page.request.get(new URL(href, base).href)).status(), 200, href);
    }
    check('route and metadata ' + (suffix || 'home'));
  }
  assert.equal((await page.request.get(base + 'missing/nested/page')).status(), 404);
  await page.goto(base + 'missing/nested/page');
  await page.getByRole('link', { name: 'Back to Clarity', exact: true }).click();
  assert.equal(page.url(), base);
  check('nested 404 real home navigation');
  for (const asset of ['sitemap.xml', 'robots.txt', '.nojekyll', 'assets/og.png', 'tokens.css']) assert.equal((await page.request.get(base + asset)).status(), 200);
  const playLinks = await page.locator('a[href*="play.google.com"]').evaluateAll(a => a.map(x => x.href));
  assert(playLinks.length >= 1 && playLinks.every(x => x === 'https://play.google.com/store/apps/details?id=com.thom.clarity'));
  assert.equal(await page.getByRole('button', { name: 'Chrome · coming soon', exact: true }).isDisabled(), true);
  assert.equal(await page.getByRole('button', { name: 'Firefox · coming soon', exact: true }).isDisabled(), true);
  await page.getByRole('link', { name: 'Waiting for iPhone?', exact: true }).click();
  assert.equal(page.url(), base + 'iphone/');
  check('real CTA navigation and disabled extension locations');
  const countBefore = requests.length;
  await page.locator('button[type=submit]').click();
  assert.equal(await page.locator('#email').getAttribute('aria-invalid'), 'true');
  assert.equal(await page.locator('#consent').getAttribute('aria-invalid'), 'true');
  await page.locator('#email').fill('invalid-address');
  await page.locator('#consent').check();
  await page.locator('button[type=submit]').click();
  assert.equal(await page.locator('#email').getAttribute('aria-invalid'), 'true');
  assert.equal(requests.length, countBefore);
  await fill(page);
  await page.locator('button[type=submit]').click();
  await page.getByText('Waitlist not open yet', { exact: true }).waitFor();
  assert.equal(requests.length, countBefore);
  await capture(page, 'iphone-unconfigured');
  check('accessible validation and unset config never dispatch or fake success');
  mode = 'invalid-config'; await page.reload(); await fill(page); await page.locator('button[type=submit]').click();
  await page.getByText('Waitlist not open yet', { exact: true }).waitFor(); assert.equal(requests.length, countBefore);
  check('insecure nonlocal API config fails closed');
  for (const fixture of ['delayed','success','success']) {
    mode = fixture; await page.reload(); await fill(page);
    const before = requests.length;
    await page.locator('button[type=submit]').click();
    if (fixture === 'delayed') {
      assert.equal(await page.locator('button[type=submit]').isDisabled(), true);
      assert.equal(await page.locator('#waitlist').getAttribute('aria-busy'), 'true');
      assert.equal(await page.locator('#email').isEditable(), false);
      assert.equal(await page.locator('#consent').isDisabled(), true);
      await page.locator('#waitlist').evaluate(el => el.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
      await capture(page, 'iphone-submitting');
    }
    await page.getByText('You’re on the list', { exact: true }).waitFor();
    assert.equal(requests.length, before + 1);
    assert.deepEqual(requests.at(-1).body, { email: 'focus@example.test', source: 'iphone', consent: true, website: '' });
    assert.equal(await page.locator('#email').inputValue(), '');
    assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
    check('server fixture acceptance ' + fixture + ' #' + requests.length);
  }
  await capture(page, 'iphone-success-fixture');
  for (const fixture of ['http-400','http-429','http-500','http-201','malformed','not-accepted','network-error','cors-denied','body-timeout']) {
    mode = fixture; await page.reload(); await fill(page);
    await page.locator('button[type=submit]').click();
    await page.locator('#form-status[data-kind=error]').waitFor({ timeout: 16000 });
    assert.equal(await page.locator('button[type=submit]').isDisabled(), false);
    assert.equal(await page.getByText('You’re on the list', { exact: true }).count(), 0);
    assert.equal(await page.locator('#email').inputValue(), 'focus@example.test');
    assert.equal(await page.locator('#email').isEditable(), true);
    assert.equal(await page.locator('#consent').isDisabled(), false);
    check('honest recoverable failure ' + fixture);
  }
  await capture(page, 'iphone-error-fixture');
  mode = 'success'; await page.reload(); await fill(page);
  await page.locator('#website').evaluate(el => el.value = 'spam.example.test');
  await page.locator('button[type=submit]').click(); await page.getByText('You’re on the list', { exact: true }).waitFor();
  assert.equal(requests.at(-1).body.website, 'spam.example.test');
  check('honeypot preserved for backend enforcement');
  mode = 'unset';
  const noJS = await browser.newContext({ javaScriptEnabled: false });
  const noPage = await noJS.newPage(); await noPage.goto(base + 'iphone/');
  assert(await noPage.locator('noscript').innerText());
  assert((await noPage.locator('#availability-note').textContent()).includes('JavaScript is required'));
  check('no JavaScript has honest unavailable guidance'); await noJS.close();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(base);
  assert.equal(await page.locator('.button').first().evaluate(el => getComputedStyle(el).transitionDuration), '0s');
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.className), 'skip');
  await page.keyboard.press('Enter');
  assert(page.url().endsWith('#main'));
  check('reduced motion and keyboard skip link');
  assert.deepEqual(evidence.browserErrors, []);
  await browser.close(); browser = null;
  const firefoxPath = process.env.FIREFOX_EXECUTABLE || firefox.executablePath();
  if (fs.existsSync(firefoxPath)) {
    const ff = await firefox.launch({ executablePath: firefoxPath, headless: true });
    const p = await ff.newPage({ viewport: { width: 375, height: 900 } });
    mode = 'success'; await p.goto(base + 'iphone/'); await fill(p); await p.locator('button[type=submit]').click();
    await p.getByText('You’re on the list', { exact: true }).waitFor();
    await capture(p, 'firefox-success-fixture'); evidence.firefox = ff.version();
    check('Firefox HTTP fixture main flow'); await ff.close();
  } else evidence.firefox = { status: 'not run', reason: 'No cached Playwright Firefox executable; no browser download attempted' };
  evidence.fixturePayloads = requests;
  evidence.passed = true;
 } catch (error) {
  evidence.passed = false; evidence.error = error.stack; console.error(error); process.exitCode = 1;
 } finally {
  if (browser) await browser.close();
  site.closeAllConnections(); api.closeAllConnections();
  await Promise.all([new Promise(resolve => site.close(resolve)), new Promise(resolve => api.close(resolve))]);
  fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(evidence, null, 2) + '\n');
  console.log('Evidence:', out, 'Passed:', evidence.passed, 'Checks:', evidence.checks.length);
 }
})();
