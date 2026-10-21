/**
 * Stage 2: turn accepted shortlist picks into shipped photos.
 *
 * Reads .shortlists/shortlists.json and .shortlists/accepted.json
 * ({ "iso|city": candidateIndex }), downloads the 3840px render, writes it to
 * public/cities/<iso>/<slug>-0.jpg and updates src/data/city-photos.json.
 *
 * Usage: node scripts/apply-city-photos.mjs [--dry]
 */
import { createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

const UA = "MundoMagicoCityPhotos/2.0 (educational child app; city landmarks; contact via project repo)";
const ROOT = fileURLToPath(new URL("..", import.meta.url));
const MANIFEST_FILE = join(ROOT, "src/data/city-photos.json");
const SHORTLIST_FILE = join(ROOT, ".shortlists/shortlists.json");
const ACCEPTED_FILE = join(ROOT, ".shortlists/accepted.json");
const dry = process.argv.includes("--dry");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fold = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
const slug = (s) => fold(s).replace(/\s+/g, "-").slice(0, 44) || "city";

const manifest = JSON.parse(readFileSync(MANIFEST_FILE, "utf8"));
const shortlists = JSON.parse(readFileSync(SHORTLIST_FILE, "utf8"));
const accepted = JSON.parse(readFileSync(ACCEPTED_FILE, "utf8"));

function cleanSubject(title) {
  let s = title
    .replace(/^File:/, "")
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/_/g, " ")
    .replace(/^\d{4}[- ]\d{2}[- ]\d{2}\s*[-–]?\s*/, "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\b\d{5,}\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (s.length > 74) s = `${s.slice(0, 71).trim()}...`;
  return s || "Vista da cidade";
}

function jpegWidth(path) {
  const data = readFileSync(path);
  const sof = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  let off = 2;
  while (off < data.length - 8) {
    if (data[off] !== 0xff) {
      off++;
      continue;
    }
    let m = off + 1;
    while (data[m] === 0xff) m++;
    const marker = data[m];
    if (marker === 0xda || marker === 0xd9) break;
    if (sof.has(marker)) return [data.readUInt16BE(m + 6), data.readUInt16BE(m + 4)];
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      off = m + 1;
      continue;
    }
    const len = data.readUInt16BE(m + 1);
    if (!len) break;
    off = m + 1 + len;
  }
  return [0, 0];
}

async function api(params, attempt = 0) {
  const u = new URL("https://commons.wikimedia.org/w/api.php");
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  const res = await fetch(u, {
    headers: { "User-Agent": UA, "Api-User-Agent": UA },
    signal: AbortSignal.timeout(60_000),
  });
  if ((res.status === 429 || res.status >= 500) && attempt < 5) {
    await sleep(12_000 * (attempt + 1));
    return api(params, attempt + 1);
  }
  if (!res.ok) throw new Error(`commons ${res.status}`);
  return res.json();
}

async function download(url, dest) {
  for (let a = 0; a < 4; a++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(120_000) });
      if (res.status === 429) {
        await sleep(12_000 * (a + 1));
        continue;
      }
      if (!res.ok || !res.body) throw new Error(`download ${res.status}`);
      const staged = `${dest}.download`;
      await pipeline(Readable.fromWeb(res.body), createWriteStream(staged));
      return staged;
    } catch (err) {
      if (a === 3) throw err;
      await sleep(3000);
    }
  }
  throw new Error("download failed");
}

const work = [];
for (const [key, idx] of Object.entries(accepted)) {
  const [iso, city] = key.split("|", 1).concat([key.slice(key.indexOf("|") + 1)]);
  const cand = shortlists[key]?.[idx];
  if (!cand) {
    console.log("missing candidate", key, idx);
    continue;
  }
  if (manifest[iso]?.[city]?.length) continue;
  work.push({ iso, city, cand });
}
console.log("accepted", work.length);
if (dry) {
  for (const w of work) console.log(w.iso, w.city, w.cand.w, w.cand.h, w.cand.title);
  process.exit(0);
}

// batch-resolve 3840px render urls
const byTitle = new Map();
for (let i = 0; i < work.length; i += 40) {
  const chunk = work.slice(i, i + 40);
  const json = await api({
    action: "query",
    format: "json",
    titles: chunk.map((w) => w.cand.title).join("|"),
    prop: "imageinfo",
    iiprop: "url|size|mime",
    iiurlwidth: "3840",
  });
  for (const page of Object.values(json.query?.pages || {})) {
    const info = page.imageinfo?.[0];
    if (info) byTitle.set(page.title, info);
  }
  await sleep(700);
}

let ok = 0;
let fail = 0;
const used = new Set();
for (const { iso, city, cand } of work) {
  if (used.has(cand.title)) {
    console.log("duplicate skip", city, cand.title);
    continue;
  }
  const info = byTitle.get(cand.title);
  if (!info) {
    console.log("no info", city);
    fail++;
    continue;
  }
  const dir = join(ROOT, "public", "cities", iso);
  mkdirSync(dir, { recursive: true });
  const file = `${slug(city)}-0.jpg`;
  const dest = join(dir, file);
  try {
    const staged = await download(info.thumburl || info.url, dest);
    const [w, h] = jpegWidth(staged);
    const { renameSync } = await import("node:fs");
    renameSync(staged, dest);
    manifest[iso] = manifest[iso] || {};
    manifest[iso][city] = [
      {
        src: `/cities/${iso}/${file}`,
        caption: `${city} — ${cleanSubject(cand.title)}`,
        credit: `Foto: ${cand.artist}. Wikimedia Commons, ${cand.license}.`,
        href: cand.href,
        kind: "photo",
      },
    ];
    used.add(cand.title);
    ok++;
    console.log("ok", iso, city, `${w}x${h}`);
  } catch (err) {
    console.log("fail", iso, city, err.message);
    fail++;
  }
  await sleep(400);
}

writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
console.log("applied", ok, "failed", fail);
