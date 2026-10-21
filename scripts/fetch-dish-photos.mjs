/**
 * Dish photography pipeline, modelled on scripts/fetch-city-photos.mjs.
 *
 * Policy (2026-10-21, mirrors the city photo policy):
 *  - a photo must show the dish itself as the subject, nothing else competing:
 *    no people, hands, kitchens, menus, packaging or restaurant interiors;
 *  - a dish that is served on a plate must be photographed on a plate, with no
 *    table clutter. A hand food (bread, snack) may sit on a board or in a
 *    basket — do not force a plate onto it;
 *  - licence must allow commercial reuse with attribution (CC0 / PD / CC BY /
 *    CC BY-SA), and every credit is stored next to the file;
 *  - each image is checked by eye before it ships. Metadata cannot tell a plate
 *    of the right dish from a plate of the wrong one.
 *
 * Usage:
 *   node scripts/fetch-dish-photos.mjs --list br
 *   node scripts/fetch-dish-photos.mjs --candidates br [--slug feijoada]
 *   node scripts/fetch-dish-photos.mjs --apply br
 *   node scripts/fetch-dish-photos.mjs --check br
 *
 * `--list` prints a shortlist (title, licence, size, credit) with no downloads.
 * `--candidates` downloads the shortlist at 1280px into screenshots/ so the
 * images can be inspected before anything is published.
 * `--apply` downloads the titles recorded in PICKS at 3840px into
 * public/dishes/<iso>/ and rewrites src/data/dish-photos.json.
 */
import { createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

const UA =
  "MundoMagicoDishPhotos/1.0 (educational child app; national dishes; contact via project repo)";
const ROOT = fileURLToPath(new URL("..", import.meta.url));
const MANIFEST = join(ROOT, "src", "data", "dish-photos.json");
const PICKS = join(ROOT, "scripts", "dish-picks.json");
const PREVIEW_ROOT = join(ROOT, "screenshots", "dish-candidates");

/**
 * Editorial dish registry. `picks` holds Commons file titles confirmed by eye.
 * A slug with an empty `picks` is simply not published yet — the app hides the
 * whole section for that country instead of showing a placeholder photo.
 */
const DISHES = {
  br: [
    {
      slug: "feijoada",
      category: ["Category:Feijoada à brasileira", "Category:Feijoada"],
      search: ["feijoada brasileira prato", "feijoada completa"],
      picks: ["File:Feijoada à brasileira 3.jpg"],
    },
    {
      slug: "pao-de-queijo",
      category: ["Category:Pão de queijo"],
      search: ["pão de queijo", "pao de queijo brasileiro"],
      picks: ["File:Pão de Queijo (Brazilian Cheese Bread).jpg"],
    },
    {
      slug: "brigadeiro",
      category: ["Category:Brigadeiros", "Category:Brigadeiro"],
      search: ["brigadeiros of brazil", "brigadeiro chocolate doce brasileiro"],
      picks: ["File:Brigadeiro.jpg"],
    },
  ],
  // Wave 1 — South America
  ar: [
    {
      slug: "asado",
      category: ["Category:Asado", "Category:Parrilladas"],
      search: ["tira de asado", "parrillada mixta", "asado argentino plato"],
      picks: ["File:Parrillada argentina.jpg"],
    },
    {
      slug: "empanadas",
      category: ["Category:Empanadas"],
      search: ["empanadas argentinas horno", "empanada argentina", "empanadas argentinas"],
      picks: ["File:Fried Argentine beef empanadas served on a tray.jpg"],
    },
    {
      slug: "alfajor",
      category: ["Category:Alfajores"],
      search: ["alfajores argentinos", "alfajor argentino", "alfajor"],
      picks: ["File:Alfajores argentinos - 2025.jpg"],
    },
  ],
  bo: [
    {
      slug: "saltenas",
      search: ["salteñas bolivianas", "salteña bolivia", "saltenas"],
      picks: [],
    },
    {
      slug: "silpancho",
      category: ["Category:Silpancho"],
      search: ["silpancho cochabamba", "silpancho bolivia", "silpancho"],
      picks: [],
    },
    {
      slug: "pique-a-lo-macho",
      category: ["Category:Pique macho"],
      search: ["pique a lo macho", "pique macho bolivia"],
      picks: [],
    },
  ],
  cl: [
    {
      slug: "pastel-de-choclo",
      search: ["pastel de choclo chileno", "pastel de choclo"],
      picks: [],
    },
    {
      slug: "empanada-de-pino",
      search: ["empanada de pino", "empanadas chilenas"],
      picks: [],
    },
    {
      slug: "cazuela",
      search: ["cazuela chilena", "cazuela de vacuno"],
      picks: [],
    },
  ],
  co: [
    {
      slug: "bandeja-paisa",
      search: ["bandeja paisa colombiana", "bandeja paisa"],
      picks: [],
    },
    {
      slug: "arepas",
      search: ["arepas colombianas", "arepa colombiana", "arepas"],
      picks: [],
    },
    {
      slug: "ajiaco",
      search: ["ajiaco santafereño", "ajiaco bogotano", "ajiaco"],
      picks: [],
    },
  ],
  ec: [
    {
      slug: "ceviche",
      search: ["ceviche ecuatoriano", "ceviche ecuador"],
      picks: [],
    },
    {
      slug: "llapingachos",
      search: ["llapingachos ecuador", "llapingachos"],
      picks: [],
    },
    {
      slug: "encebollado",
      search: ["encebollado ecuatoriano", "encebollado"],
      picks: [],
    },
  ],
  gy: [
    {
      slug: "pepperpot",
      search: ["guyanese pepperpot", "pepperpot guyana"],
      picks: [],
    },
    {
      slug: "cook-up-rice",
      search: ["cook up rice guyana", "guyanese cook up rice"],
      picks: [],
    },
    {
      slug: "roti",
      search: ["guyanese roti", "roti guyana"],
      picks: [],
    },
  ],
  py: [
    {
      slug: "sopa-paraguaya",
      search: ["sopa paraguaya", "sopa paraguaya paraguay"],
      picks: [],
    },
    {
      slug: "chipa",
      search: ["chipa paraguaya", "chipa"],
      picks: [],
    },
    {
      slug: "vori-vori",
      search: ["vori vori paraguay", "vori vori"],
      picks: [],
    },
  ],
  pe: [
    {
      slug: "ceviche",
      search: ["ceviche peruano", "ceviche peru"],
      picks: [],
    },
    {
      slug: "lomo-saltado",
      search: ["lomo saltado peruano", "lomo saltado"],
      picks: [],
    },
    {
      slug: "aji-de-gallina",
      search: ["aji de gallina peruano", "ají de gallina"],
      picks: [],
    },
  ],
  sr: [
    {
      slug: "pom",
      search: ["surinamese pom", "pom suriname"],
      picks: [],
    },
    {
      slug: "roti",
      search: ["surinamese roti", "roti suriname"],
      picks: [],
    },
    {
      slug: "saoto",
      search: ["saoto soep suriname", "saoto suriname"],
      picks: [],
    },
  ],
  uy: [
    {
      slug: "chivito",
      search: ["chivito uruguayo", "chivito sandwich"],
      picks: [],
    },
    {
      slug: "asado",
      search: ["asado uruguayo parrilla", "asado uruguay"],
      picks: [],
    },
    {
      slug: "torta-frita",
      search: ["torta frita uruguaya", "tortas fritas"],
      picks: [],
    },
  ],
  ve: [
    {
      slug: "arepa",
      search: ["arepa venezolana", "arepas venezolanas"],
      picks: [],
    },
    {
      slug: "pabellon-criollo",
      search: ["pabellón criollo venezolano", "pabellon criollo"],
      picks: [],
    },
    {
      slug: "hallacas",
      search: ["hallacas venezolanas", "hallaca"],
      picks: [],
    },
  ],
};

/**
 * Countries added after the first wave live in scripts/dish-sources.json, so
 * new waves never require editing this file and re-running the whole registry.
 */
const SOURCES = join(ROOT, "scripts", "dish-sources.json");
if (existsSync(SOURCES)) {
  Object.assign(DISHES, JSON.parse(readFileSync(SOURCES, "utf8")));
}

const MIN_SOURCE_WIDTH = 1920;
const PREVIEW_WIDTH = 1280;
const OUTPUT_WIDTH = 1920;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function strip(html) {
  return String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function fold(s) {
  return String(s || "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function licenseOk(short) {
  const s = fold(short);
  if (!s) return false;
  if (s.includes("non commercial") || s.includes("noncommercial") || /\bnc\b/.test(s)) return false;
  if (s.includes("no derivatives") || /\bnd\b/.test(s)) return false;
  if (s.includes("all rights reserved") || s.includes("copyrighted")) return false;
  return /public domain|cc0|cc by|cc-by|gfdl|pdm|no restrictions/.test(s);
}

/** Things that disqualify a food photograph outright. */
const FOOD_BAD =
  /\b(illustration|drawing|painting|engraving|sketch|watercolou?r|cartoon|vector|logo|icon|poster|menu|stamp|coin|banknote|screenshot|diagram|chart|infographic|map|receipt|packaging|package|label|supermarket|grocery|store shelf|frozen|raw|cooking|preparation|preparing|recipe|chef|kitchen|restaurant interior|dining room|people|persons?|crowd|woman|man|children|child|kids?|hands?|holding|eating|tasting|waiter|staff|buffet|banquet|takeaway|take away|leftover|plastico?|styrofoam|tin can|jar|bottle|box|metro|subway|station|estacao|plataforma|platform|train|tunnel|escalator|bakery|padaria|storefront|facade|fachada|shop window|awning|sign|signage|street|sidewalk|faculty|university|ufsc|campus|casa do pao|loja|shop|boutique|mall|outlet|vitrine)\b/;

/** Signs that the dish, and not a scene, is the subject. */
const FOOD_GOOD =
  /\b(plate|prato|plato|teller|assiette|dish|bowl|tigela|travessa|board|tabua|basket|cesta|served|close.?up|detail)\b/;

function aspectPenalty(width, height) {
  if (!width || !height) return 0;
  const ratio = width / height;
  if (ratio > 2.4 || ratio < 0.6) return 80; // panorama strip or vertical slice
  if (ratio < 0.85) return 20;
  return Math.abs(ratio - 1.5) * 6; // 3:2 is the ideal card crop
}

async function search(q, attempt = 0) {
  const u = new URL("https://commons.wikimedia.org/w/api.php");
  u.searchParams.set("action", "query");
  u.searchParams.set("format", "json");
  u.searchParams.set("generator", "search");
  u.searchParams.set("gsrsearch", `${q} filetype:bitmap`);
  u.searchParams.set("gsrnamespace", "6");
  u.searchParams.set("gsrlimit", "30");
  u.searchParams.set("prop", "imageinfo|categories");
  u.searchParams.set("iiprop", "url|mime|size|extmetadata");
  u.searchParams.set("iiurlwidth", String(OUTPUT_WIDTH));
  u.searchParams.set("cllimit", "12");
  let res;
  try {
    res = await fetch(u, {
      headers: { "User-Agent": UA, "Api-User-Agent": UA },
      signal: AbortSignal.timeout(45_000),
    });
  } catch (err) {
    if (attempt < 5 && ["AbortError", "TimeoutError"].includes(err?.name)) {
      await sleep(8_000 * (attempt + 1));
      return search(q, attempt + 1);
    }
    throw err;
  }
  if (res.status === 429 && attempt < 5) {
    await sleep(10_000 * (attempt + 1));
    return search(q, attempt + 1);
  }
  if (!res.ok) throw new Error(`commons ${res.status}`);
  const json = await res.json();
  return Object.values(json.query?.pages || {});
}

async function categoryPages(category, limit = 50, attempt = 0) {
  const u = new URL("https://commons.wikimedia.org/w/api.php");
  u.searchParams.set("action", "query");
  u.searchParams.set("format", "json");
  u.searchParams.set("generator", "categorymembers");
  u.searchParams.set("gcmtitle", category);
  u.searchParams.set("gcmtype", "file");
  u.searchParams.set("gcmlimit", String(Math.min(limit, 50)));
  u.searchParams.set("prop", "imageinfo|categories");
  u.searchParams.set("iiprop", "url|mime|size|extmetadata");
  u.searchParams.set("iiurlwidth", String(OUTPUT_WIDTH));
  u.searchParams.set("cllimit", "8");
  let res;
  try {
    res = await fetch(u, {
      headers: { "User-Agent": UA, "Api-User-Agent": UA },
      signal: AbortSignal.timeout(45_000),
    });
  } catch (err) {
    if (attempt < 5 && ["AbortError", "TimeoutError"].includes(err?.name)) {
      await sleep(10_000 * (attempt + 1));
      return categoryPages(category, limit, attempt + 1);
    }
    throw err;
  }
  if (res.status === 429 && attempt < 5) {
    await sleep(20_000 * (attempt + 1));
    return categoryPages(category, limit, attempt + 1);
  }
  if (!res.ok) throw new Error(`category ${res.status}`);
  const json = await res.json();
  return Object.values(json.query?.pages || {});
}

async function collectPages(dish) {
  const pages = [];
  for (const category of dish.category ?? []) {
    try {
      pages.push(...(await categoryPages(category)));
    } catch (err) {
      console.warn(`category failed ${category}: ${err.message}`);
    }
  }
  for (const q of dish.search ?? []) {
    pages.push(...(await search(q)));
  }
  return pages;
}

function shortlist(pages, dish) {
  const out = [];
  for (const page of pages) {
    const info = page.imageinfo?.[0];
    if (!info || !/^image\/jpe?g$/i.test(info.mime || "")) continue;
    const width = Number(info.width || 0);
    if (width < MIN_SOURCE_WIDTH) continue;
    if (Number(info.size || 0) > 0 && Number(info.size) < 80_000) continue;
    const meta = info.extmetadata || {};
    const license = meta.LicenseShortName?.value || "";
    if (!licenseOk(license)) continue;
    const blob = fold(
      `${page.title} ${strip(meta.ImageDescription?.value)} ${(page.categories || [])
        .map((c) => c.title)
        .join(" ")}`,
    );
    if (FOOD_BAD.test(blob)) continue;
    // The dish name has to appear as a phrase in the file title, not just one
    // loose word: otherwise "fry jacks" matches every stir fry on Commons.
    const titleFold = fold(page.title);
    const phrase = fold(dish.slug);
    const phraseSingular = phrase.replace(/s$/, "");
    const queryPhrases = (dish.search ?? [])
      .map((q) => fold(q))
      .filter((q) => q.split(" ").length >= 2);
    const matchesPhrase =
      titleFold.includes(phrase) ||
      titleFold.includes(phraseSingular) ||
      queryPhrases.some((q) => titleFold.includes(q) || titleFold.includes(q.replace(/s$/, "")));
    if (!matchesPhrase) continue;
    const good = FOOD_GOOD.test(blob);
    const artist = strip(meta.Artist?.value)
      .replace(/^by\s+/i, "")
      .slice(0, 90);
    const ratio = aspectPenalty(width, Number(info.height || 0));
    out.push({
      title: page.title,
      license,
      width,
      height: Number(info.height || 0),
      ratio,
      artist: artist || "autor não indicado",
      good,
      score: (good ? 45 : 0) + Math.min(width, 6000) / 60 - ratio,
      thumbUrl: info.thumburl || info.url,
      url: info.url,
      descriptionUrl: info.descriptionurl,
    });
  }
  out.sort((a, b) => b.score - a.score);
  const seen = new Set();
  return out.filter((item) => {
    const key = fold(item.title).slice(0, 45);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function download(url, dest, attempt = 0) {
  let res;
  try {
    res = await fetch(url, {
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(90_000),
    });
  } catch (err) {
    if (attempt < 8 && ["AbortError", "TimeoutError"].includes(err?.name)) {
      await sleep(15_000 * (attempt + 1));
      return download(url, dest, attempt + 1);
    }
    throw err;
  }
  if (res.status === 429 && attempt < 8) {
    const retryAfter = Number(res.headers.get("retry-after"));
    const wait = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 60_000;
    console.log(`  rate limited, waiting ${Math.round(wait / 1000)}s`);
    await sleep(wait);
    return download(url, dest, attempt + 1);
  }
  if (res.status >= 500 && attempt < 5) {
    await sleep(20_000 * (attempt + 1));
    return download(url, dest, attempt + 1);
  }
  if (!res.ok || !res.body) throw new Error(`download ${res.status}`);
  mkdirSync(dirname(dest), { recursive: true });
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
}

/** Direct, width-limited thumbnail URL — unlike imageinfo.thumburl it survives
 *  images that are smaller than the requested width. */
function previewUrl(title, width) {
  const file = title.replace(/^File:/, "").replace(/ /g, "_");
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
}

function href(title) {
  return `https://commons.wikimedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;
}

function jpegSize(path) {
  const data = readFileSync(path);
  const startOfFrame = new Set([
    0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
  ]);
  let offset = 2;
  while (offset < data.length - 8) {
    if (data[offset] !== 0xff) {
      offset++;
      continue;
    }
    let markerOffset = offset + 1;
    while (data[markerOffset] === 0xff) markerOffset++;
    const marker = data[markerOffset];
    if (marker === 0xda || marker === 0xd9) break;
    if (startOfFrame.has(marker)) {
      return {
        height: data.readUInt16BE(markerOffset + 4),
        width: data.readUInt16BE(markerOffset + 6),
      };
    }
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset = markerOffset + 1;
      continue;
    }
    const length = data.readUInt16BE(markerOffset + 1);
    if (!length) break;
    offset = markerOffset + 1 + length;
  }
  return { width: 0, height: 0 };
}

async function fileInfo(title, attempt = 0) {
  const u = new URL("https://commons.wikimedia.org/w/api.php");
  u.searchParams.set("action", "query");
  u.searchParams.set("format", "json");
  u.searchParams.set("titles", title);
  u.searchParams.set("prop", "imageinfo");
  u.searchParams.set("iiprop", "url|mime|size|extmetadata");
  u.searchParams.set("iiurlwidth", String(OUTPUT_WIDTH));
  let res;
  try {
    res = await fetch(u, {
      headers: { "User-Agent": UA, "Api-User-Agent": UA },
      signal: AbortSignal.timeout(45_000),
    });
  } catch (err) {
    if (attempt < 5 && ["AbortError", "TimeoutError"].includes(err?.name)) {
      await sleep(8_000 * (attempt + 1));
      return fileInfo(title, attempt + 1);
    }
    throw err;
  }
  if ((res.status === 429 || res.status >= 500) && attempt < 5) {
    await sleep(10_000 * (attempt + 1));
    return fileInfo(title, attempt + 1);
  }
  if (!res.ok) throw new Error(`file info ${res.status}`);
  const json = await res.json();
  return Object.values(json.query?.pages || {})[0] || null;
}

function readManifest() {
  if (!existsSync(MANIFEST)) return {};
  try {
    return JSON.parse(readFileSync(MANIFEST, "utf8"));
  } catch {
    return {};
  }
}

function dishList(iso) {
  const list = DISHES[iso];
  if (!list) throw new Error(`no dishes registered for "${iso}"`);
  return list;
}

function arg(flag, fallback = null) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? (process.argv[i + 1] ?? fallback) : fallback;
}

async function list(iso) {
  for (const dish of dishList(iso)) {
    console.log(`\n== ${iso} / ${dish.slug} ==`);
    const pages = await collectPages(dish);
    const items = shortlist(pages, dish).slice(0, 12);
    if (!items.length) {
      console.log("  (no candidate passed the licence / subject filter)");
      continue;
    }
    for (const [i, item] of items.entries()) {
      console.log(
        `  [${i}] ${item.title}\n      ${item.license} · ${item.width}x${item.height} · ${item.artist}`,
      );
    }
  }
}

async function candidates(iso) {
  const only = arg("--slug");
  const count = Number(arg("--count", "3"));
  for (const dish of dishList(iso)) {
    if (only && dish.slug !== only) continue;
    const pages = await collectPages(dish);
    const items = shortlist(pages, dish).slice(0, count);
    const dir = join(PREVIEW_ROOT, iso, dish.slug);
    mkdirSync(dir, { recursive: true });
    const meta = [];
    for (const [i, item] of items.entries()) {
      const file = join(dir, `${String(i).padStart(2, "0")}.jpg`);
      await download(previewUrl(item.title, PREVIEW_WIDTH), file);
      const size = jpegSize(file);
      meta.push({ index: i, file: file.replace(ROOT, ""), ...item, localWidth: size.width });
      console.log(`saved ${file} (${size.width}px) <- ${item.title}`);
      await sleep(3_000);
    }
    writeFileSync(join(dir, "candidates.json"), JSON.stringify(meta, null, 2));
  }
}

function readPicks() {
  if (!existsSync(PICKS)) return {};
  try {
    return JSON.parse(readFileSync(PICKS, "utf8"));
  } catch {
    return {};
  }
}

async function apply(iso) {
  const manifest = readManifest();
  const picksForIso = readPicks()[iso] || {};
  manifest[iso] = manifest[iso] || {};
  for (const dish of dishList(iso)) {
    const picks = picksForIso[dish.slug] ?? dish.picks ?? [];
    if (!picks.length) {
      delete manifest[iso][dish.slug];
      console.log(`skip ${iso}/${dish.slug}: no confirmed picks`);
      continue;
    }
    const photos = [];
    for (const [i, title] of picks.entries()) {
      const page = await fileInfo(title);
      const info = page?.imageinfo?.[0];
      if (!info) throw new Error(`missing on Commons: ${title}`);
      const meta = info.extmetadata || {};
      const license = meta.LicenseShortName?.value || "";
      if (!licenseOk(license))
        throw new Error(`licence no longer acceptable: ${title} (${license})`);
      const artist = strip(meta.Artist?.value)
        .replace(/^by\s+/i, "")
        .slice(0, 90);
      const src = `/dishes/${iso}/${dish.slug}-${i}.jpg`;
      // Wikimedia now rejects arbitrary thumbnail widths, so ask for the
      // standard 1920px rendition through Special:FilePath instead of using
      // imageinfo.thumburl.
      await download(
        `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
          title.replace(/^File:/, ""),
        )}?width=${OUTPUT_WIDTH}`,
        join(ROOT, "public", src),
      );
      const size = jpegSize(join(ROOT, "public", src));
      if (size.width < MIN_SOURCE_WIDTH) {
        console.warn(`  ! ${src} is only ${size.width}px wide`);
      }
      photos.push({
        src,
        credit: `${artist || "autor não indicado"}. Wikimedia Commons, ${license}.`,
        href: info.descriptionurl || href(title),
        kind: "photo",
      });
      console.log(`ok ${src} (${size.width}x${size.height}) <- ${title}`);
      await sleep(2_500);
    }
    manifest[iso][dish.slug] = photos;
  }
  writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`manifest written: ${MANIFEST.replace(ROOT, "")}`);
}

function check(iso) {
  const manifest = readManifest();
  for (const dish of dishList(iso)) {
    const photos = manifest[iso]?.[dish.slug] || [];
    const missing = photos.filter((p) => !existsSync(join(ROOT, "public", p.src)));
    const state = !photos.length
      ? "no photo"
      : missing.length
        ? `MISSING FILE: ${missing.map((p) => p.src).join(", ")}`
        : `${photos.length} photo(s)`;
    console.log(`${iso}/${dish.slug}: ${state}`);
  }
}

const mode = process.argv[2];
const iso = arg("--iso") || process.argv[3];

try {
  if (mode === "--list") await list(iso);
  else if (mode === "--candidates") await candidates(iso);
  else if (mode === "--apply") await apply(iso);
  else if (mode === "--check") check(iso);
  else {
    console.log(
      "usage: --list <iso> | --candidates <iso> [--slug X] | --apply <iso> | --check <iso>",
    );
  }
} catch (err) {
  console.error(err.message || err);
  process.exitCode = 1;
}



