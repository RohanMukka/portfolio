// Performance and accessibility budgets for a production build (dist/).
// Fails (exit code 1) if any is broken, so CI catches a regression:
//
//   bundles   gzipped size of each built chunk
//   at rest   once the page has settled: no WebGL draw calls, no animation
//             frames asked for, no layouts (src/stage/clock.ts)
//   waking    a wheel turn at rest draws again promptly
//   covered   a case study open over the page: the stage draws nothing
//   hero      the copy index.html shows before any script is the page's own
//   headers   served with vercel.json's headers: its security policy lets
//             the page's inline script run and blocks nothing it uses
//             (including the footer cards' outside requests)
//   axe       no WCAG 2.2 A/AA violations beyond the ones listed as known
//
// It counts things rather than timing them, so it holds on a CI machine
// with no graphics card (software WebGL) as well as on a laptop.
//
//   npm run build && npm run perf
//
// Chrome comes from CHROME_PATH (or the usual install place); set
// SOFTWARE_GL=1 where there's no GPU, as in CI.
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import zlib from "node:zlib";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import puppeteer from "puppeteer-core";

const require = createRequire(import.meta.url);
const DIST = path.resolve(process.argv[2] ?? "dist");
const PORT = 4321;
const ORIGIN = `http://localhost:${PORT}`;

// Gzipped KB per chunk, a little above today's sizes.
const BUNDLES = [
  { name: "main script", match: /^index-.*\.js$/, maxKb: 170 },
  { name: "3D stage script", match: /^scene-.*\.js$/, maxKb: 140 },
  { name: "stylesheet", match: /^index-.*\.css$/, maxKb: 14 },
  { name: "ReviewGuard results script", match: /^ReviewGuardProof-.*\.js$/, maxKb: 9 },
];
// Known WCAG violations to tolerate (none: any violation fails).
const KNOWN_AXE = new Set();

const CHROME =
  process.env.CHROME_PATH ??
  {
    win32: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  }[process.platform] ??
  "/usr/bin/google-chrome";
const GL_FLAGS = process.env.SOFTWARE_GL ? ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] : ["--ignore-gpu-blocklist"];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const check = (name, ok, detail) => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "pass" : "FAIL"}  ${name.padEnd(44)} ${detail}`);
};

// vercel.json's headers, applied the way Vercel applies them (every rule
// whose source matches the path), so the page runs under the real policy.
const RULES = JSON.parse(fs.readFileSync("vercel.json", "utf8")).headers.map((rule) => ({
  match: new RegExp(`^${rule.source}$`),
  headers: Object.fromEntries(rule.headers.map((h) => [h.key, h.value])),
}));
const headersFor = (pathname) => Object.assign({}, ...RULES.filter((r) => r.match.test(pathname)).map((r) => r.headers));

// The build, served as a static site (unknown paths fall back to the page).
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".mp4": "video/mp4", ".pdf": "application/pdf", ".json": "application/json", ".txt": "text/plain", ".woff2": "font/woff2", ".xml": "application/xml" };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, ORIGIN);
  let file = path.join(DIST, decodeURIComponent(url.pathname));
  if (!file.startsWith(DIST) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    if (url.pathname.startsWith("/api/")) {
      res.writeHead(404).end();
      return;
    }
    file = path.join(DIST, "index.html");
  }
  res.writeHead(200, { ...headersFor(url.pathname), "Content-Type": TYPES[path.extname(file)] ?? "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});

// Counts the page's WebGL draw calls (and when they happen) and its own
// animation-frame requests, from before any of its scripts run.
const instrument = () => {
  window.__draws = [];
  window.__rafRequests = 0;
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => {
    window.__rafRequests++;
    return raf(cb);
  };
  for (const Context of [WebGLRenderingContext, WebGL2RenderingContext]) {
    for (const name of ["drawArrays", "drawElements"]) {
      const draw = Context.prototype[name];
      Context.prototype[name] = function (...args) {
        window.__draws.push(performance.now());
        return draw.apply(this, args);
      };
    }
  }
};

const run = async () => {
  // Bundles
  const assets = fs.readdirSync(path.join(DIST, "assets"));
  for (const bundle of BUNDLES) {
    const file = assets.find((f) => bundle.match.test(f));
    if (!file) {
      check(`${bundle.name} size`, false, "not found in dist/assets");
      continue;
    }
    const kb = zlib.gzipSync(fs.readFileSync(path.join(DIST, "assets", file)), { level: 9 }).length / 1024;
    check(`${bundle.name} size`, kb <= bundle.maxKb, `${kb.toFixed(1)} KB gzipped (budget ${bundle.maxKb})`);
  }

  // The policy allows index.html's inline script by its hash.
  const csp = headersFor("/")["Content-Security-Policy"] ?? "";
  const inline = [...fs.readFileSync(path.join(DIST, "index.html"), "utf8").matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
    (m) => `'sha256-${crypto.createHash("sha256").update(m[1]).digest("base64")}'`,
  );
  const unlisted = inline.filter((h) => !csp.includes(h));
  check(
    "security policy allows the inline script",
    inline.length > 0 && unlisted.length === 0,
    unlisted.length ? `add ${unlisted.join(" ")} to script-src in vercel.json` : `${inline.length} inline script, hash listed`,
  );

  await new Promise((r) => server.listen(PORT, r));
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: GL_FLAGS, protocolTimeout: 240000 });
  try {
    // The hero's copy as index.html carries it for the first paint (read
    // with scripts off), to compare with what the page renders.
    const heroCopy = () => [...document.querySelectorAll("[data-hero-copy]")].map((el) => el.textContent.replace(/\s+/g, "")).join(" | "); // spacing between tags differs; the words mustn't
    const bare = await browser.newPage();
    await bare.setJavaScriptEnabled(false);
    await bare.goto(`${ORIGIN}/`, { waitUntil: "load" });
    const staticCopy = await bare.evaluate(heroCopy);
    await bare.close();

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    // Chrome reports anything the security policy blocks on the console.
    const blocked = [];
    page.on("console", (m) => {
      if (/Content Security Policy/i.test(m.text())) blocked.push(m.text());
    });
    await page.evaluateOnNewDocument(instrument);
    const cdp = await page.createCDPSession();
    await cdp.send("Performance.enable");
    const layouts = async () => (await cdp.send("Performance.getMetrics")).metrics.find((m) => m.name === "LayoutCount").value;
    // `?full` keeps the 3D stage on a machine without a graphics card.
    await page.goto(`${ORIGIN}/?full`, { waitUntil: "load" });
    await page.waitForFunction(() => !document.querySelector("#hero > .absolute.inset-0.z-20"), { timeout: 90000 });
    const liveCopy = await page.evaluate(heroCopy);
    check("hero copy in index.html matches the page", staticCopy.length > 0 && staticCopy === liveCopy, staticCopy === liveCopy ? `${staticCopy.length} characters, before any script` : `index.html: "${staticCopy}" / page: "${liveCopy}"`);
    const drew = await page.evaluate(() => window.__draws.length > 0);
    check("stage draws after the intro", drew, drew ? "the 3D stage is running" : "no WebGL draws at all; is WebGL available?");

    // Settled: no draw for 2 s (stage asleep).
    const settle = async (timeout = 40000) => {
      const start = Date.now();
      while (Date.now() - start < timeout) {
        const quiet = await page.evaluate(() => (window.__draws.length ? performance.now() - window.__draws.at(-1) : Infinity));
        if (quiet > 2000) return true;
        await sleep(250);
      }
      return false;
    };
    const atRest = async (label) => {
      const settled = await settle();
      await page.evaluate(() => {
        window.__draws = [];
        window.__rafRequests = 0;
      });
      const before = await layouts();
      await sleep(3000);
      const after = await layouts();
      const c = await page.evaluate(() => ({ draws: window.__draws.length, raf: window.__rafRequests }));
      check(`${label}: settles`, settled, settled ? "stage asleep" : "still drawing after 40 s");
      check(`${label}: no draw calls at rest`, c.draws === 0, `${c.draws} in 3 s`);
      check(`${label}: no animation frames at rest`, c.raf === 0, `${c.raf} requested in 3 s`);
      check(`${label}: no layouts at rest`, after - before === 0, `${after - before} in 3 s`);
    };

    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await sleep(500);
    // The footer cards make the page's only outside requests; pointing at
    // each link loads its card. Whether the request succeeds doesn't matter
    // here (a blocked one is reported before it's sent).
    for (const name of ["GitHub", "LeetCode", "Monkeytype"]) {
      const link = await page.evaluateHandle((n) => [...document.querySelectorAll("#footer a")].find((a) => a.textContent.trim().startsWith(n)), name);
      await link.hover();
      await sleep(1500);
    }
    await page.mouse.move(5, 5);
    await atRest("footer");

    await page.mouse.move(640, 400);
    await page.evaluate(() => {
      window.__draws = [];
    });
    const sent = await page.evaluate(() => performance.now());
    await page.mouse.wheel({ deltaY: -200 });
    await sleep(1000);
    const first = await page.evaluate(() => window.__draws[0] ?? null);
    check("a wheel turn wakes the stage", first !== null, first !== null ? `first draw ${Math.round(first - sent)} ms after the wheel` : "no draw within 1 s");

    // ReviewGuard's has the most on it: the results a visitor works through.
    await page.goto(`${ORIGIN}/?full#/work/reviewguard`, { waitUntil: "load" });
    await page.waitForFunction(() => document.querySelector("#reviewguard-results"), { timeout: 60000 });
    await page.evaluate(() => {
      const results = document.querySelector("#reviewguard-results");
      results.scrollIntoView();
      [...results.closest("section").querySelectorAll("ol button")].at(-1).click();
    });
    await sleep(3000);
    await atRest("case study open");
    check("security policy blocks nothing the page uses", blocked.length === 0, blocked.length ? blocked[0].slice(0, 160) : "no violations reported");

    // Accessibility. axe goes in as an inline script, which the policy
    // rightly refuses; it's the test's, not the page's, so this step alone
    // runs with the policy off.
    await page.setBypassCSP(true);
    await page.goto(`${ORIGIN}/?full`, { waitUntil: "load" });
    await page.waitForFunction(() => !document.querySelector("#hero > .absolute.inset-0.z-20"), { timeout: 90000 });
    await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
    const violations = await page.evaluate(async () => {
      const r = await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] }, resultTypes: ["violations"] });
      return r.violations.map((v) => ({ id: v.id, nodes: v.nodes.length }));
    });
    const unknown = violations.filter((v) => !KNOWN_AXE.has(v.id));
    check("axe: no new WCAG violations", unknown.length === 0, unknown.length ? unknown.map((v) => `${v.id} ×${v.nodes}`).join(", ") : `known only: ${violations.map((v) => `${v.id} ×${v.nodes}`).join(", ") || "none"}`);
  } finally {
    await browser.close();
    server.close();
  }
};

run()
  .catch((error) => {
    console.error(error);
    results.push({ ok: false });
  })
  .finally(() => {
    const failed = results.filter((r) => !r.ok).length;
    console.log(failed ? `\n${failed} budget(s) broken` : "\nall budgets hold");
    process.exitCode = failed ? 1 : 0;
  });
