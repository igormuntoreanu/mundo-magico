// Measures the real cost of the 3D globe: WebGL capability, startup, and
// frame pacing at a given viewport. Prints one JSON verdict.
//
//   node scripts/measure-globe.mjs [url] [--headed] [--width=1280] [--height=900]
//
// Headless Chrome on Windows often falls back to SwiftShader; pass --headed
// (or --gpu) to benchmark the machine's real GPU. The renderer string is
// printed either way so a software result is never mistaken for hardware.
import { chromium } from "playwright";

const args = process.argv.slice(2);
const url = args.find((a) => a.startsWith("http")) ?? "http://127.0.0.1:8080/";
const headed = args.includes("--headed");
const width = Number(args.find((a) => a.startsWith("--width="))?.slice(8) ?? 1280);
const height = Number(args.find((a) => a.startsWith("--height="))?.slice(9) ?? 900);

const gpuArgs = [
  "--ignore-gpu-blocklist",
  "--enable-gpu-rasterization",
  "--enable-zero-copy",
  "--use-angle=d3d11",
];

const browser = await chromium.launch({
  channel: "chrome",
  headless: !headed,
  args: gpuArgs,
});

const context = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: 1,
});
const page = await context.newPage();
const consoleErrors = [];
page.on("pageerror", (error) => consoleErrors.push(`pageerror: ${error.message}`));
page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(`console: ${message.text()}`);
});

const gl = await page.evaluate(() => {
  const probe = (type) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext(type, { failIfMajorPerformanceCaveat: true });
    if (!ctx) return null;
    const ext = ctx.getExtension("WEBGL_debug_renderer_info");
    const info = {
      version: ctx.getParameter(ctx.VERSION),
      vendor: ext ? ctx.getParameter(ext.UNMASKED_VENDOR_WEBGL) : "unknown",
      renderer: ext ? ctx.getParameter(ext.UNMASKED_RENDERER_WEBGL) : "unknown",
      maxTexture: ctx.getParameter(ctx.MAX_TEXTURE_SIZE),
    };
    const lose = ctx.getExtension("WEBGL_lose_context");
    lose?.loseContext();
    return info;
  };
  const software = (renderer) =>
    /swiftshader|llvmpipe|software|basic render|microsoft basic/i.test(renderer);
  const webgl2 = probe("webgl2");
  const webgl1 = webgl2 ? null : probe("webgl");
  const picked = webgl2 ?? webgl1;
  return {
    webgl2: Boolean(webgl2),
    webgl1: Boolean(webgl1),
    renderer: picked?.renderer ?? null,
    vendor: picked?.vendor ?? null,
    maxTexture: picked?.maxTexture ?? null,
    software: picked ? software(picked.renderer) : true,
    cores: navigator.hardwareConcurrency ?? null,
    memoryGb: navigator.deviceMemory ?? null,
    dpr: window.devicePixelRatio,
  };
});

// Two passes: first compiles dev modules / warms caches, second is measured.
let startupMs = null;
let pacing = null;
let canvasBox = null;
for (let pass = 0; pass < 2; pass += 1) {
  const started = Date.now();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("canvas", { timeout: 60_000, state: "attached" });
  // The loading pill is the last thing to leave; the flag label means polygons landed.
  await page
    .waitForFunction(
      () =>
        !document.querySelector(".volcano-rise") &&
        !Array.from(document.querySelectorAll("p")).some((p) =>
          /carregando|loading|lädt|chargement/i.test(p.textContent ?? ""),
        ),
      null,
      { timeout: 60_000 },
    )
    .catch(() => {});
  await page.waitForTimeout(400);
  if (pass === 1) startupMs = Date.now() - started;

  const sample = await page.evaluate(async () => {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const frames = [];
    let last = performance.now();
    const deadline = last + 4000;
    await new Promise((resolve) => {
      const tick = (now) => {
        frames.push(now - last);
        last = now;
        if (now < deadline) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });
    await sleep(50);
    const usable = frames.slice(5).filter((dt) => dt > 0 && dt < 2000);
    const sorted = [...usable].sort((a, b) => a - b);
    const at = (q) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * q))] ?? 0;
    return {
      samples: usable.length,
      medianFrameMs: Number(at(0.5).toFixed(1)),
      p95FrameMs: Number(at(0.95).toFixed(1)),
      worstFrameMs: Number(Math.max(0, ...usable).toFixed(1)),
      fps: Number((1000 / Math.max(0.01, at(0.5))).toFixed(1)),
      longFrames: usable.filter((dt) => dt > 34).length,
    };
  });
  if (pass === 1) pacing = sample;
}

// Drag test: rotate the globe for ~1.5s and measure while interacting.
canvasBox = await page.locator("canvas").first().boundingBox();
let dragPacing = null;
if (canvasBox) {
  const cx = canvasBox.x + canvasBox.width / 2;
  const cy = canvasBox.y + canvasBox.height / 2;
  const dragSample = page.evaluate(async () => {
    const frames = [];
    let last = performance.now();
    const deadline = last + 1500;
    await new Promise((resolve) => {
      const tick = (now) => {
        frames.push(now - last);
        last = now;
        if (now < deadline) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });
    const usable = frames.slice(3).filter((dt) => dt > 0 && dt < 2000);
    const sorted = [...usable].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)] ?? 0;
    return { fps: Number((1000 / Math.max(0.01, median)).toFixed(1)), samples: usable.length };
  });
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  for (let i = 1; i <= 24; i += 1) {
    await page.mouse.move(cx + i * 6, cy + Math.sin(i / 3) * 20);
    await page.waitForTimeout(16);
  }
  await page.mouse.up();
  dragPacing = await dragSample;
}

const verdict = {
  url,
  mode: headed ? "headed (real GPU)" : "headless",
  viewport: `${width}x${height}`,
  capability: gl,
  startupMs,
  idle: pacing,
  duringDrag: dragPacing,
  canvas: canvasBox ? { w: Math.round(canvasBox.width), h: Math.round(canvasBox.height) } : null,
  consoleErrors: consoleErrors.slice(0, 8),
};

console.log(JSON.stringify(verdict, null, 2));
await browser.close();
