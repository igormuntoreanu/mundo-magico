/**
 * Stage 1 of the gap-filling pipeline: build a *visual* shortlist.
 *
 * For every city slot without photos, query Wikimedia Commons, apply the
 * technical gates (JPEG, long edge >= 1920, 4:3-ish aspect, free licence,
 * no archival/artwork/aircraft framing) and download an 800px preview of the
 * best few candidates. It never touches the manifest: a human (or the agent)
 * still has to look at the contact sheets and accept one.
 *
 * Usage:
 *   node scripts/source-city-photos.mjs [--iso=ao,cd] [--limit=40] [--force]
 *
 * Output:
 *   .shortlists/shortlists.json      { "iso|city": [candidate, ...] }
 *   .shortlists/previews/<iso>-<slug>-<n>.jpg
 */
import { createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import {
  CITY_EXCLUDE_PLACES,
  CITY_SEARCH_NAMES,
  CITY_TEXT_ALIASES,
  TOURIST_SEARCH_NAMES,
} from "./city-photo-names.mjs";

const UA = "MundoMagicoCityPhotos/2.0 (educational child app; city landmarks; contact via project repo)";
const ROOT = fileURLToPath(new URL("..", import.meta.url));
const COUNTRIES = JSON.parse(readFileSync(join(ROOT, "src/data/countries.json"), "utf8"));
const MANIFEST = JSON.parse(readFileSync(join(ROOT, "src/data/city-photos.json"), "utf8"));
const STATE_DIR = join(ROOT, ".shortlists");
const PREVIEW_DIR = join(STATE_DIR, "previews");
const STATE_FILE = join(STATE_DIR, "shortlists.json");

const args = process.argv.slice(2);
const isoFilter = new Set(
  (args.find((a) => a.startsWith("--iso="))?.slice(6) || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean),
);
const limit = Number(args.find((a) => a.startsWith("--limit="))?.slice(8) || 0) || Infinity;
const force = args.includes("--force");

const PREVIEW_WIDTH = 800;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fold = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
const strip = (s) =>
  String(s || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

function licenseOk(short) {
  const s = fold(short);
  if (!s) return false;
  if (/non.?commercial|noncommercial|\bnc\b|no derivatives|\bnd\b/.test(s)) return false;
  if (/all rights reserved|copyrighted|fair use/.test(s)) return false;
  return /public domain|cc0|cc by|gfdl|pdm|no restrictions/.test(s);
}

const REJECT = new RegExp(
  [
    "\\b1[6-9]\\d{2}s?\\b",
    "\\b(?:loc|matpc|habs|haer|lccn|dpla|btv1b|puntacasas|agence|mondial)\\b",
    "archival|historic photo|old photo|scan(?:ned)? document",
    "painting|drawing|engraving|lithograph|etching|sketch|cartoon|comic|manga|poster|stamp|coin|banknote|manuscript|miniature|calligraph|album|logo|coat of arms|flag of|\\bmaps?\\b|map of|diagram|satellite|screenshot|book cover|collage|illustration",
    "aircraft|airplane|aeroplane|airline|airport|airfield|air show|flight|\\bwing\\b|window seat|through the window|cockpit|helicopter|uav|\\biss\\b|nasa",
    "earthquake|damaged|destroyed|ruins of|aftermath|flood|fire|riot|protest|military|soldier|troops|weapon|prison|cemetery|grave|funeral|hospital|refugee|camp\\b|slum",
    "school|university|college|institute|high school|elementary|kindergarten|headquarters|embassy|shopping|supermarket|hypermarket|parking|power plant|warehouse|depot|logistics",
    "interior|inside the|close.?up|facade detail|logo of",
  ].join("|"),
);

const NATURE =
  /^(rio|lago|ilha|parque|deserto|floresta|montanha|praia|vale|arquip|península|peninsula|estação|estacao|círculo|circulo|serra|delta|caverna|savana|estepe|selva|o |a |as |os |um |uma )/i;

const NATURE_PREFIX = {
  rio: "River",
  lago: "Lake",
  ilha: "Island",
  parque: "National Park",
  deserto: "Desert",
  floresta: "Forest",
  montanha: "Mountains",
  montanhas: "Mountains",
  praia: "Beach",
  vale: "Valley",
  arquipélago: "Archipelago",
  arquipelago: "Archipelago",
  península: "Peninsula",
  peninsula: "Peninsula",
  serra: "Mountains",
  delta: "Delta",
  caverna: "Cave",
  savana: "Savanna",
  estepe: "Steppe",
  selva: "Jungle",
};

function slug(s) {
  return fold(s).replace(/\s+/g, "-").slice(0, 44) || "city";
}

function searchSubject(iso, city) {
  if (NATURE.test(city)) {
    const words = city.split(/\s+/);
    const head = fold(words[0]);
    const rest = words
      .slice(1)
      .join(" ")
      .replace(/^(do|da|de|del|dos|das)\s+/i, "");
    if (!rest) return null;
    const prefix = NATURE_PREFIX[head];
    return prefix ? `${rest} ${prefix}` : rest;
  }
  return CITY_SEARCH_NAMES[iso]?.[city] || city;
}

function keyTokens(iso, city, searchCity, countryNames) {
  const generic = new Set([
    "city", "cidade", "ciudad", "ville", "town", "the", "de", "do", "da", "del", "of",
    "river", "lake", "mountains", "national", "park", "island", "beach", "forest",
    "desert", "valley", "delta", "cave", "steppe", "jungle", "archipelago", "peninsula",
    "rio", "lago",
  ]);
  const own = fold(city)
    .split(" ")
    .filter((t) => t.length >= 3 && !generic.has(t));
  if (NATURE.test(city)) {
    const rest = fold(city.split(/\s+/).slice(1).join(" "));
    const tokens = rest.split(" ").filter((t) => t.length >= 3 && !generic.has(t));
    return tokens.length ? tokens : own;
  }
  const countryTokens = new Set(countryNames.flatMap((n) => fold(n).split(" ")).filter(Boolean));
  const aliasTokens = (CITY_TEXT_ALIASES[iso]?.[city] || []).flatMap((n) => fold(n).split(" "));
  const all = [...own, ...fold(searchCity || "").split(" "), ...aliasTokens];
  const kept = all.filter(
    (t) => t.length >= 4 && !generic.has(t) && (!countryTokens.has(t) || own.includes(t)),
  );
  if (kept.length) return [...new Set(kept)];
  // short names (Xi'an, Osh, Bo) keep 2-3 letter tokens rather than failing outright
  const short = [...own, ...fold(searchCity || "").split(" ")].filter(
    (t) => t.length >= 2 && !generic.has(t) && !countryTokens.has(t),
  );
  return [...new Set(short.length ? short : own)];
}

async function api(params, attempt = 0) {
  const u = new URL("https://commons.wikimedia.org/w/api.php");
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  const res = await fetch(u, {
    headers: { "User-Agent": UA, "Api-User-Agent": UA },
    signal: AbortSignal.timeout(45_000),
  });
  if (res.status === 429 && attempt < 5) {
    await sleep(12_000 * (attempt + 1));
    return api(params, attempt + 1);
  }
  if (!res.ok) throw new Error(`commons ${res.status}`);
  return res.json();
}

async function search(q) {
  const json = await api({
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: `${q} filetype:bitmap`,
    gsrnamespace: "6",
    gsrlimit: "24",
    prop: "imageinfo|categories",
    iiprop: "url|mime|size|extmetadata",
    iiurlwidth: String(PREVIEW_WIDTH),
    cllimit: "16",
  });
  return Object.values(json.query?.pages || {});
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(60_000) });
  if (!res.ok || !res.body) throw new Error(`download ${res.status}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
}

function subjectOf(title) {
  return title
    .replace(/^File:/, "")
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function collect(pages, tokens, excludePlaces, spots = []) {
  const out = [];
  for (const page of pages) {
    const info = page.imageinfo?.[0];
    if (!info) continue;
    if (!/^image\/jpe?g$/.test(info.mime || "")) continue;
    const w = Number(info.width || 0);
    const h = Number(info.height || 0);
    if (!w || !h) continue;
    if (Math.max(w, h) < 1920) continue;
    const aspect = w / h;
    if (aspect < 1.15 || aspect > 2.05) continue;
    const meta = info.extmetadata || {};
    const license = meta.LicenseShortName?.value || "";
    if (!licenseOk(license)) continue;
    const desc = strip(meta.ImageDescription?.value);
    const cats = (page.categories || []).map((c) => c.title).join(" ");
    const blob = fold(`${page.title} ${desc} ${cats}`);
    if (REJECT.test(blob)) continue;
    if (excludePlaces?.some((p) => blob.includes(fold(p)))) continue;
    if (!tokens.some((t) => blob.includes(t))) continue;
    // The city must be in the file title itself: descriptions lie, and
    // "Florence OR aerial" / "Mount Kilimanjaro" only get in through metadata.
    const titleText = fold(page.title);
    if (!tokens.some((t) => titleText.includes(t))) continue;
    const artist = strip(meta.Artist?.value).replace(/^by\s+/i, "").slice(0, 90) || "autor não indicado";
    const year = Number((fold(desc).match(/\b20\d{2}\b/) || [])[0]);
    const aerial = /aerial|aerea|aereo|dron|luftbild|bird|overhead|panorama|skyline|cityscape/.test(blob);
    const prestige = /featured picture|quality image|valued image/.test(blob) ? 25 : 0;
    const NEG =
      /supermarket|hypermarket|shopping|parking|industrial|factory|construction|crane|fish|office building|residential|apartment|warehouse|depot|street|road|traffic/;
    const VIEW =
      /skyline|panorama|view of|from above|aerial view|cityscape|downtown|old town|historic centre|historic center|bay|harbour view/;
    const genericSpot = new Set([
      "praia", "plaza", "praca", "square", "market", "mercado", "city", "cidade", "park",
      "parque", "palace", "palacio", "museum", "museu", "church", "igreja", "cathedral",
      "catedral", "national", "monument", "monumento", "tower", "torre", "lake", "lago",
      "island", "ilha", "bridge", "ponte",
    ]);
    const spotWords = spots
      .flatMap((sp) => fold(sp).split(" "))
      .filter((word) => word.length >= 4 && !genericSpot.has(word));
    const spotHits = spotWords.filter((word) => blob.includes(word)).length;
    out.push({
      title: page.title,
      w,
      h,
      license,
      artist,
      desc: desc.slice(0, 140),
      previewUrl: info.thumburl || info.url,
      href: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, "_"))}`,
      score:
        Math.min(w, 4000) / 100 +
        (aerial ? 40 : 0) +
        prestige +
        spotHits * 120 +
        (VIEW.test(blob) ? 30 : 0) -
        (NEG.test(blob) ? 110 : 0) +
        (year ? Math.max(0, Math.min(20, year - 2010)) : 0),
    });
  }
  out.sort((a, b) => b.score - a.score);
  const seen = new Set();
  return out.filter((c) => {
    const key = fold(subjectOf(c.title)).replace(/\b\d+\b/g, "").trim().slice(0, 36);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

mkdirSync(PREVIEW_DIR, { recursive: true });
const state = existsSync(STATE_FILE) ? JSON.parse(readFileSync(STATE_FILE, "utf8")) : {};

const targets = [];
for (const [iso, country] of Object.entries(COUNTRIES)) {
  if (isoFilter.size && !isoFilter.has(iso)) continue;
  for (const row of country.cities || []) {
    const city = row.city;
    if (!city) continue;
    if ((MANIFEST[iso]?.[city] || []).length) continue;
    if (!force && state[`${iso}|${city}`]?.length) continue;
    targets.push({ iso, city, row, country });
  }
}
console.log("targets", targets.length);
if (force) for (const t of targets) delete state[`${t.iso}|${t.city}`];

const usedTitles = new Set(Object.values(state).flat().map((c) => c.title));
let processed = 0;
let found = 0;

for (const { iso, city, row, country } of targets) {
  if (processed >= limit) break;
  processed++;
  const countryNames = [country.name, ...(country.aliases || [])];
  const enName = (country.aliases || [])[0] || country.name;
  const searchCity = searchSubject(iso, city);
  if (searchCity === null) {
    state[`${iso}|${city}`] = [];
    console.log("skip (no subject)", iso, city);
    continue;
  }
  const spots = String(row.spots || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const searchSpots = TOURIST_SEARCH_NAMES[iso]?.[city] || spots;
  const tokens = keyTokens(iso, city, searchCity, countryNames);
  if (!tokens.length) {
    state[`${iso}|${city}`] = [];
    console.log("skip (no tokens)", iso, city);
    continue;
  }
  const queries = [
    `${searchCity} aerial`,
    `${searchCity} panorama view`,
    `${searchCity} ${enName}`,
    ...(searchSpots.length
      ? [`(${searchSpots.slice(0, 2).map((s) => `"${s.replace(/"/g, "")}"`).join(" OR ")}) ${enName}`]
      : []),
  ];

  let picks = [];
  try {
    const pages = [];
    for (const q of queries) {
      pages.push(...(await search(q)));
      await sleep(900);
      const got = collect(pages, tokens, CITY_EXCLUDE_PLACES[iso]?.[city], searchSpots);
      if (got.length >= 3) {
        picks = got;
        break;
      }
    }
    if (!picks.length) picks = collect(pages, tokens, CITY_EXCLUDE_PLACES[iso]?.[city], searchSpots);
  } catch (err) {
    console.log("fail", iso, city, err.message);
    state[`${iso}|${city}`] = state[`${iso}|${city}`] || [];
    continue;
  }

  picks = picks
    .filter((c) => !usedTitles.has(c.title))
    .slice(0, 3)
    .map((c, i) => {
      const file = `${iso}-${slug(city)}-${i}.jpg`;
      return { ...c, preview: `previews/${file}`, file };
    });

  for (const p of picks) {
    const dest = join(PREVIEW_DIR, p.file);
    try {
      if (!existsSync(dest)) await download(p.previewUrl, dest);
      usedTitles.add(p.title);
      delete p.previewUrl;
    } catch (err) {
      p.preview = null;
      console.log("preview fail", iso, city, err.message);
    }
    await sleep(350);
  }
  state[`${iso}|${city}`] = picks;
  if (picks.length) found++;
  console.log(picks.length ? "ok" : "gap", iso, city, picks.length);
  if (processed % 8 === 0) writeFileSync(STATE_FILE, JSON.stringify(state, null, 1));
}

writeFileSync(STATE_FILE, JSON.stringify(state, null, 1));
const withPicks = Object.values(state).filter((v) => v.length).length;
console.log("done: processed", processed, "with-candidates", withPicks, "state-size", Object.keys(state).length);
