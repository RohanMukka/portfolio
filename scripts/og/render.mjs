// Renders public/og.png, the picture a shared link shows (LinkedIn, Slack,
// X...): 1200 x 630, in the site's own fonts and dark colours, saying what
// the hero says. Run it again whenever the hero's copy changes:
//
//   node scripts/og/render.mjs
//
// Chrome comes from CHROME_PATH (or the usual install place), as in
// scripts/perf/budgets.mjs.
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const OUT = path.resolve("public/og.png");
// Inlined, since a page set from a string may not read local files.
const font = (file) => `data:font/woff2;base64,${fs.readFileSync(path.resolve("public/fonts", file)).toString("base64")}`;
const CHROME =
  process.env.CHROME_PATH ??
  {
    win32: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  }[process.platform] ??
  "/usr/bin/google-chrome";

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
  @font-face { font-family: "Inter"; src: url("${font("inter-latin.woff2")}") format("woff2"); font-weight: 100 900; }
  @font-face { font-family: "Inter Tight"; src: url("${font("inter-tight-latin.woff2")}") format("woff2"); font-weight: 100 900; }
  @font-face { font-family: "Instrument Serif"; src: url("${font("instrument-serif-italic-latin.woff2")}") format("woff2"); font-style: italic; }
  @font-face { font-family: "JetBrains Mono"; src: url("${font("jetbrains-mono-latin.woff2")}") format("woff2"); font-weight: 100 900; }
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 1200px; height: 630px; }
  body {
    position: relative;
    overflow: hidden;
    background: radial-gradient(90% 70% at 70% 40%, #16161f 0%, #0a0a0d 70%);
    color: #f8fafc;
    font-family: "Inter", sans-serif;
  }
  .corner { position: absolute; width: 22px; height: 22px; border-color: rgba(248, 250, 252, 0.4); border-style: solid; border-width: 0; }
  .tl { top: 32px; left: 36px; border-top-width: 1.5px; border-left-width: 1.5px; }
  .tr { top: 32px; right: 36px; border-top-width: 1.5px; border-right-width: 1.5px; }
  .bl { bottom: 32px; left: 36px; border-bottom-width: 1.5px; border-left-width: 1.5px; }
  .br { bottom: 32px; right: 36px; border-bottom-width: 1.5px; border-right-width: 1.5px; }
  .hud {
    position: absolute; top: 62px; left: 72px; right: 72px;
    display: flex; justify-content: space-between;
    font-family: "JetBrains Mono", monospace; font-size: 15px; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase; color: #94a3b8;
  }
  .dot { color: #f97316; }
  h1 {
    position: absolute; left: 66px; top: 150px;
    font-family: "Inter Tight", sans-serif; font-weight: 800;
    font-size: 176px; line-height: 0.82; letter-spacing: -0.055em;
  }
  .line {
    position: absolute; left: 72px; right: 72px; top: 372px; height: 4px; border-radius: 4px;
    background: linear-gradient(90deg, #3b6cff, #e0457b 55%, #ff7a3d);
  }
  .claim {
    position: absolute; left: 72px; bottom: 74px;
    font-family: "Inter Tight", sans-serif; font-weight: 600;
    font-size: 46px; letter-spacing: -0.035em; line-height: 1.05;
  }
  .claim em { font-family: "Instrument Serif", serif; font-style: italic; font-weight: 400; letter-spacing: 0; color: #f97316; }
  .url {
    position: absolute; right: 72px; top: 398px;
    font-family: "JetBrains Mono", monospace; font-size: 15px; letter-spacing: 0.12em; color: #94a3b8;
  }
</style>
</head>
<body>
  <span class="corner tl"></span><span class="corner tr"></span><span class="corner bl"></span><span class="corner br"></span>
  <div class="hud"><span>AI / ML engineer</span><span><span class="dot">●</span> Available for work</span></div>
  <h1>Rohan Mukka</h1>
  <div class="line"></div>
  <p class="claim">I build <em>AI systems</em> that can prove they work.</p>
  <p class="url">portfolio-rohan03.vercel.app</p>
</body>
</html>`;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const missing = await page.evaluate(() =>
    ["800 1em 'Inter Tight'", "italic 1em 'Instrument Serif'", "500 1em 'JetBrains Mono'"].filter((f) => !document.fonts.check(f)),
  );
  if (missing.length) throw new Error(`fonts didn't load: ${missing.join(", ")}`);
  await page.screenshot({ path: OUT, type: "png" });
  console.log(`wrote ${path.relative(process.cwd(), OUT)}`);
} finally {
  await browser.close();
}
