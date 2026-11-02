/**
 * Fill missing city photos: Wikidata QID → Commons → optional Openverse + vision judge.
 *
 * Stages (disk handoff):
 *   --stage=find   search/rank → scripts/.candidates/<iso>.json
 *   --stage=judge  vision → verdict cache + scripts/review/index.html
 *   --stage=apply  download/resize/manifest (accepted only)
 *   (default) find → judge → apply
 *
 *   --dry-run  stops before apply; writes only logs/dryrun-* (+ candidates/review/cache)
 *
 * Usage:
 *   node --experimental-strip-types scripts/fetch-city-photos.ts --iso=ng --dry-run --replace=ng|Lagos,ng|Abuja
 */
import {
  appendFileSync,
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import sharp from "sharp";
import {
  CITY_EXCLUDE_PLACES,
  CITY_SEARCH_NAMES,
  CITY_TEXT_ALIASES,
  TOURIST_SEARCH_NAMES,
} from "./city-photo-names.mjs";
import { GENERATED_SPOT_NAMES } from "./city-photo-spots-generated.mjs";

const UA =
  "MundoMagicoCityPhotos/3.1 (educational child app; city landmarks; contact via project repo)";
const ROOT = fileURLToPath(new URL("..", import.meta.url));
const COUNTRIES_PATH = join(ROOT, "src/data/countries.json");
const MANIFEST_PATH = join(ROOT, "src/data/city-photos.json");
const STATE_PATH = join(ROOT, "scripts/.city-photo-state.json");
const UNRESOLVED_PATH = join(ROOT, "scripts/unresolved-cities.json");
const OVERRIDES_PATH = join(ROOT, "scripts/city-photo-overrides.json");
const LOG_DIR = join(ROOT, "scripts/logs");
const CACHE_DIR = join(ROOT, "scripts/.cache");
const CAND_DIR = join(ROOT, "scripts/.candidates");
const REVIEW_DIR = join(ROOT, "scripts/review");
const OUT_ROOT = join(ROOT, "public/cities");
const VERDICT_CACHE_PATH = join(CACHE_DIR, "vision-verdicts.json");

const MIN_SCORE = 90;
const SPOT_BONUS = 18; // earlier spots
const HUMAN_QID = "Q5";

type CityPhoto = {
  src: string;
  caption: string;
  credit: string;
  href: string;
  kind: "photo";
  objectPosition?: "top" | "center" | "bottom";
};

type CountryRow = {
  name: string;
  aliases?: string[];
  cities?: { city: string; spots?: string }[];
};

type Candidate = {
  title: string;
  width: number;
  height: number;
  license: string;
  artist: string;
  desc: string;
  downloadUrl: string;
  previewUrl?: string;
  href: string;
  landmark: string;
  source: "wikidata" | "commons" | "openverse" | "override";
  score: number;
  objectPosition: "top" | "center";
  identityViaQid?: boolean;
  spotIndex?: number;
};

type VisionVerdict = {
  shows_named_landmark: boolean;
  landmark_prominence: number;
  clutter: number;
  postcard_score: number;
  reason: string;
};

type Decision = {
  ts: string;
  iso: string;
  city: string;
  decision: string;
  reason: string;
  title?: string;
  landmark?: string;
  source?: string;
  score?: number;
  postcard?: number;
};

type Unresolved = {
  iso: string;
  country: string;
  city: string;
  spots: string;
  tried: string[];
  why: string;
};

const CONTINENTS: Record<string, string[]> = {
  africa: [
    "dz", "ao", "bj", "bw", "bf", "bi", "cm", "cv", "cf", "td", "km", "cg", "cd", "ci", "dj",
    "eg", "gq", "er", "sz", "et", "ga", "gm", "gh", "gn", "gw", "ke", "ls", "lr", "ly", "mg",
    "mw", "ml", "mr", "mu", "ma", "mz", "na", "ne", "ng", "rw", "st", "sn", "sc", "sl", "so",
    "za", "ss", "sd", "tz", "tg", "tn", "ug", "zm", "zw",
  ],
  europe: [
    "al", "ad", "am", "at", "az", "by", "be", "ba", "bg", "hr", "cy", "cz", "dk", "ee", "fi",
    "fr", "ge", "de", "gr", "hu", "is", "ie", "it", "xk", "lv", "li", "lt", "lu", "mt", "md",
    "mc", "me", "nl", "mk", "no", "pl", "pt", "ro", "ru", "sm", "rs", "sk", "si", "es", "se",
    "ch", "tr", "ua", "gb", "va",
  ],
  asia: [
    "af", "bh", "bd", "bt", "bn", "kh", "cn", "in", "id", "ir", "iq", "il", "jp", "jo", "kz",
    "kw", "kg", "la", "lb", "my", "mv", "mn", "mm", "np", "kp", "om", "pk", "ps", "ph", "qa",
    "sa", "sg", "kr", "lk", "sy", "tw", "tj", "th", "tl", "tm", "ae", "uz", "vn", "ye",
  ],
  americas: [
    "ag", "ar", "bs", "bb", "bz", "bo", "br", "ca", "cl", "co", "cr", "cu", "dm", "do", "ec",
    "sv", "gd", "gt", "gy", "ht", "hn", "jm", "mx", "ni", "pa", "py", "pe", "pr", "kn", "lc",
    "vc", "sr", "tt", "us", "uy", "ve", "fk",
  ],
  oceania: ["au", "fj", "ki", "mh", "fm", "nr", "nz", "pw", "pg", "ws", "sb", "to", "tv", "vu", "nc"],
  antarctica: ["aq"],
};

const REJECT_TITLE = new RegExp(
  [
    "\\bmaps?\\b", "\\blocator\\b", "\\bflag\\b", "\\blogo\\b", "\\bdiagram\\b", "\\bstamp\\b",
    "\\bcoin\\b", "\\bbanknote\\b", "\\bflier\\b", "\\bflyer\\b", "\\bselfie\\b", "\\bportrait\\b",
    "\\binterior\\b", "attends event", "\\bsecretary\\b", "\\bdiplomat\\b", "press conference",
    "close.?up", "facade detail", "\\bcrowd\\b", "\\bprotest\\b", "\\bmilitary\\b", "\\bsoldier\\b",
    "\\bweapon\\b", "\\bcemetery\\b", "\\bgrave\\b", "\\bpainting\\b", "\\bdrawing\\b",
    "\\bengraving\\b", "\\blithograph\\b", "\\bsketch\\b", "\\bcartoon\\b", "\\billustration\\b",
    "\\bsatellite\\b", "\\bscreenshot\\b", "\\bwatermark\\b", "night view", "\\bnightscape\\b",
    "\\bnightlife\\b", "swimming pool",
  ].join("|"),
  "i",
);

const REJECT_CATS = new RegExp(
  [
    "\\bmaps?\\b", "locator maps", "flags of", "coats of arms", "logos", "diagrams", "stamps of",
    "given name", "people of", "selfies", "portraits", "interiors", "cemeteries", "paintings",
    "drawings", "engravings", "cartoons", "illustrations", "satellite images", "screenshots",
  ].join("|"),
  "i",
);

const TALL_LANDMARK =
  /tower|statue|mosque|minaret|cathedral|church|obelisk|monument|rock|christ|redeemer|skyscraper|burj/i;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const fold = (s: string) =>
  String(s || "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const stripHtml = (s: string) =>
  String(s || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const slug = (s: string) => fold(s).replace(/\s+/g, "-").slice(0, 44) || "city";

function licenseOk(short: string): boolean {
  const s = fold(short);
  if (!s) return false;
  if (/non.?commercial|noncommercial|\bnc\b|no derivatives|\bnd\b/.test(s)) return false;
  if (/all rights reserved|copyrighted|fair use/.test(s)) return false;
  return /public domain|cc0|cc by(?!.*nc)|pdm|cc-by(?!.*nc)/.test(s);
}

function normalizeLicense(short: string): string {
  const s = short.trim();
  if (/public domain/i.test(s) || /^pd$/i.test(s)) return "Public domain";
  if (/cc0/i.test(s)) return "CC0";
  const m = s.match(/CC[- ]?BY(?:[- ]SA)?(?:[- ]?\d(?:\.\d)?)?/i);
  if (m) return m[0].replace(/\s+/g, " ").toUpperCase().replace("BY SA", "BY-SA");
  return s;
}

type Cli = {
  isos: Set<string>;
  limit: number;
  dryRun: boolean;
  force: boolean;
  stage: "" | "find" | "judge" | "apply";
  replace: Set<string>;
  retryUnresolved: boolean;
  openverse: boolean;
  visionModel: string;
  visionMode: "api" | "agent";
};

function parseArgs(argv: string[]): Cli {
  const isoRaw =
    argv.find((a) => a.startsWith("--iso="))?.slice(6) ||
    (argv.includes("--iso") ? argv[argv.indexOf("--iso") + 1] : "");
  const continent = argv.find((a) => a.startsWith("--continent="))?.slice(12)?.toLowerCase() || "";
  const limit = Number(argv.find((a) => a.startsWith("--limit="))?.slice(8) || 0) || Infinity;
  const dryRun = argv.includes("--dry-run") || argv.includes("--dry");
  const force = argv.includes("--force");
  const stageRaw = (argv.find((a) => a.startsWith("--stage="))?.slice(8) || "") as Cli["stage"];
  const stage = stageRaw === "find" || stageRaw === "judge" || stageRaw === "apply" ? stageRaw : "";
  const replace = new Set(
    (argv.find((a) => a.startsWith("--replace="))?.slice(10) || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
  const retryUnresolved = argv.includes("--retry-unresolved");
  const openverse = argv.includes("--openverse");
  const visionModel =
    argv.find((a) => a.startsWith("--vision-model="))?.slice(15) || "claude-haiku-4-5-20251001";
  const visionMode: "api" | "agent" =
    argv.includes("--vision=agent") || process.env.CITY_PHOTO_VISION === "agent"
      ? "agent"
      : "api";
  // optional local key file (gitignored): scripts/.anthropic-key
  if (!process.env.ANTHROPIC_API_KEY) {
    const keyFile = join(ROOT, "scripts/.anthropic-key");
    if (existsSync(keyFile)) {
      process.env.ANTHROPIC_API_KEY = readFileSync(keyFile, "utf8").trim();
    }
  }
  let isos = new Set(
    (isoRaw || "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
  if (continent) {
    const list = CONTINENTS[continent];
    if (!list) throw new Error(`Unknown continent "${continent}"`);
    for (const iso of list) isos.add(iso);
  }
  return {
    isos,
    limit,
    dryRun,
    force,
    stage,
    replace,
    retryUnresolved,
    openverse,
    visionModel,
    visionMode,
  };
}

function cacheKey(parts: string): string {
  return createHash("sha1").update(parts).digest("hex").slice(0, 24);
}

function readJson<T>(path: string, fallback: T): T {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function writeJson(path: string, data: unknown) {
  mkdirSync(join(path, ".."), { recursive: true });
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
}

async function wikiApi(
  host: "commons" | "wikidata",
  params: Record<string, string>,
  attempt = 0,
): Promise<any> {
  const key = cacheKey(`${host}|${JSON.stringify(params)}`);
  const cachePath = join(CACHE_DIR, `${host}-${key}.json`);
  if (existsSync(cachePath)) return JSON.parse(readFileSync(cachePath, "utf8"));

  const base =
    host === "commons"
      ? "https://commons.wikimedia.org/w/api.php"
      : "https://www.wikidata.org/w/api.php";
  const u = new URL(base);
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  const res = await fetch(u, {
    headers: { "User-Agent": UA, "Api-User-Agent": UA },
    signal: AbortSignal.timeout(45_000),
  });
  if ((res.status === 429 || res.status >= 500) && attempt < 6) {
    const wait = Number(res.headers.get("retry-after") || 0) * 1000 || 12_000 * (attempt + 1);
    await sleep(Math.min(wait, 60_000));
    return wikiApi(host, params, attempt + 1);
  }
  if (!res.ok) throw new Error(`${host} ${res.status}`);
  const json = await res.json();
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(cachePath, JSON.stringify(json));
  return json;
}

function commonsHref(title: string): string {
  return `https://commons.wikimedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;
}

function citySearchName(iso: string, city: string): string {
  return (CITY_SEARCH_NAMES as Record<string, Record<string, string>>)[iso]?.[city] || city;
}

function spotQueries(iso: string, city: string, spotsPt: string[]): string[] {
  const tourist = (TOURIST_SEARCH_NAMES as Record<string, Record<string, string[]>>)[iso]?.[city];
  const generated = (GENERATED_SPOT_NAMES as Record<string, Record<string, string[]>>)[iso]?.[city];
  const aliases = (CITY_TEXT_ALIASES as Record<string, Record<string, string[]>>)[iso]?.[city] || [];
  const merged = [...(tourist || []), ...(generated || []), ...spotsPt, ...aliases]
    .map((s) => s.trim())
    .filter(Boolean);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of merged) {
    const k = fold(s);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(s);
  }
  return out;
}

function haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

function englishCountry(country: CountryRow): string {
  return country.aliases?.[0] || country.name;
}

function rivalCityTokens(iso: string, city: string, countries: Record<string, CountryRow>): string[] {
  const own = new Set(fold(city).split(" ").filter((t) => t.length >= 3));
  const rivals: string[] = [];
  for (const row of countries[iso]?.cities || []) {
    if (row.city === city) continue;
    for (const t of fold(row.city).split(" ")) {
      if (t.length >= 4 && !own.has(t)) rivals.push(t);
    }
  }
  return [...new Set(rivals)];
}

function manifestHrefs(manifest: Record<string, Record<string, CityPhoto[]>>): Set<string> {
  const set = new Set<string>();
  for (const cities of Object.values(manifest)) {
    for (const photos of Object.values(cities)) {
      for (const p of photos) if (p.href) set.add(p.href);
    }
  }
  return set;
}

type QidHit = {
  id: string;
  label: string;
  coords: { lat: number; lon: number } | null;
  p18: string[];
  p373: string[];
};

async function countryQidForIso(iso: string): Promise<string | null> {
  const cachePath = join(CACHE_DIR, `iso-country-${iso}.json`);
  if (existsSync(cachePath)) return JSON.parse(readFileSync(cachePath, "utf8")).qid;
  // SPARQL-less: search ISO code via wbsearch then check P297
  const json = await wikiApi("wikidata", {
    action: "wbsearchentities",
    format: "json",
    language: "en",
    type: "item",
    limit: "10",
    search: iso.toUpperCase(),
  });
  await sleep(350);
  const ids = (json.search || []).map((s: { id: string }) => s.id).slice(0, 8);
  if (!ids.length) return null;
  const ents = await wikiApi("wikidata", {
    action: "wbgetentities",
    format: "json",
    ids: ids.join("|"),
    props: "claims",
  });
  await sleep(350);
  for (const id of ids) {
    const claims = ents.entities?.[id]?.claims;
    const codes = (claims?.P297 || []).map((c: any) => c.mainsnak?.datavalue?.value);
    if (codes.includes(iso.toUpperCase())) {
      writeJson(cachePath, { qid: id });
      return id;
    }
  }
  return null;
}

function isHuman(ent: any): boolean {
  return (ent.claims?.P31 || []).some(
    (c: any) => c.mainsnak?.datavalue?.value?.id === HUMAN_QID,
  );
}

function countryMatches(ent: any, countryQid: string | null, iso: string): boolean {
  if (!countryQid) return true;
  const p17 = (ent.claims?.P17 || []).map((c: any) => c.mainsnak?.datavalue?.value?.id);
  if (p17.includes(countryQid)) return true;
  // also accept if P297 on the entity itself somehow
  const codes = (ent.claims?.P297 || []).map((c: any) => c.mainsnak?.datavalue?.value);
  return codes.includes(iso.toUpperCase());
}

async function resolveQid(
  search: string,
  iso: string,
  countryQid: string | null,
): Promise<QidHit | null> {
  const json = await wikiApi("wikidata", {
    action: "wbsearchentities",
    format: "json",
    language: "en",
    type: "item",
    limit: "8",
    search,
  });
  await sleep(400);
  const ids = (json.search || []).map((s: { id: string }) => s.id).slice(0, 6);
  if (!ids.length) return null;
  const ents = await wikiApi("wikidata", {
    action: "wbgetentities",
    format: "json",
    ids: ids.join("|"),
    props: "claims|labels",
    languages: "en",
  });
  await sleep(400);
  for (const id of ids) {
    const ent = ents.entities?.[id];
    if (!ent || ent.missing || isHuman(ent)) continue;
    if (!countryMatches(ent, countryQid, iso)) continue;
    const coordsRaw = ent.claims?.P625?.[0]?.mainsnak?.datavalue?.value;
    const coords = coordsRaw
      ? { lat: coordsRaw.latitude as number, lon: coordsRaw.longitude as number }
      : null;
    const p18 = (ent.claims?.P18 || [])
      .map((c: any) => c.mainsnak?.datavalue?.value as string)
      .filter(Boolean);
    const p373 = (ent.claims?.P373 || [])
      .map((c: any) => c.mainsnak?.datavalue?.value as string)
      .filter(Boolean);
    return {
      id,
      label: ent.labels?.en?.value || search,
      coords,
      p18,
      p373,
    };
  }
  return null;
}

async function commonsFileMeta(fileTitle: string): Promise<any | null> {
  const title = fileTitle.startsWith("File:") ? fileTitle : `File:${fileTitle}`;
  const json = await wikiApi("commons", {
    action: "query",
    format: "json",
    titles: title,
    prop: "imageinfo|categories|coordinates|globalusage",
    iiprop: "url|mime|size|extmetadata",
    iiurlwidth: "3840",
    cllimit: "20",
    gulimit: "20",
    coprop: "lat|lon|primary",
  });
  await sleep(500);
  const page = Object.values(json.query?.pages || {})[0] as any;
  if (!page || page.missing != null) return null;
  return page;
}

async function commonsSearchPages(query: string): Promise<any[]> {
  const json = await wikiApi("commons", {
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: "6",
    gsrlimit: "24",
    prop: "imageinfo|categories|coordinates|globalusage",
    iiprop: "url|mime|size|extmetadata",
    iiurlwidth: "3840",
    cllimit: "16",
    gulimit: "10",
    coprop: "lat|lon|primary",
  });
  await sleep(800);
  return Object.values(json.query?.pages || {});
}

async function commonsCategoryFiles(category: string): Promise<any[]> {
  const json = await wikiApi("commons", {
    action: "query",
    format: "json",
    generator: "categorymembers",
    gcmtitle: category.startsWith("Category:") ? category : `Category:${category}`,
    gcmtype: "file",
    gcmlimit: "20",
    prop: "imageinfo|categories|coordinates|globalusage",
    iiprop: "url|mime|size|extmetadata",
    iiurlwidth: "3840",
    cllimit: "16",
    gulimit: "10",
    coprop: "lat|lon|primary",
  });
  await sleep(800);
  return Object.values(json.query?.pages || {});
}

function evaluatePage(
  page: any,
  opts: {
    landmark: string;
    city: string;
    searchCity: string;
    tokens: string[];
    exclude: string[] | undefined;
    cityCoord: { lat: number; lon: number } | null;
    rivals: string[];
    source: Candidate["source"];
    identityViaQid: boolean;
    usedHrefs: Set<string>;
    spotIndex: number;
  },
): { ok: Candidate } | { reject: string } {
  const info = page.imageinfo?.[0];
  if (!info) return { reject: "no imageinfo" };
  if (!/^image\/jpe?g$/i.test(info.mime || "")) return { reject: `mime ${info.mime}` };
  const width = Number(info.width || 0);
  const height = Number(info.height || 0);
  if (width < 1600) return { reject: `width ${width} < 1600` };
  const aspect = width / Math.max(height, 1);
  if (aspect < 0.85 || aspect > 2.4) return { reject: `aspect ${aspect.toFixed(2)}` };

  const meta = info.extmetadata || {};
  const licenseRaw = meta.LicenseShortName?.value || "";
  if (!licenseOk(licenseRaw)) return { reject: `license ${licenseRaw || "unknown"}` };

  const desc = stripHtml(meta.ImageDescription?.value || "");
  const cats = (page.categories || []).map((c: { title: string }) => c.title).join(" ");
  const title = page.title as string;
  const titleFold = fold(title);
  const href = commonsHref(title);
  if (opts.usedHrefs.has(href)) return { reject: "href already in manifest" };

  // metadata rejects BEFORE extra API work (categories already present)
  if (REJECT_TITLE.test(title) || REJECT_TITLE.test(desc)) {
    return { reject: "rejected title/desc pattern" };
  }
  if (REJECT_CATS.test(cats)) return { reject: "rejected category pattern" };

  const blob = fold(`${title} ${desc} ${cats}`);
  if (opts.exclude?.some((p) => blob.includes(fold(p)))) return { reject: "excluded place token" };

  const stop = new Set([
    "the", "and", "of", "de", "da", "do", "del", "la", "le", "el", "in", "at", "bay", "park",
    "centre", "center", "national", "gallery", "art", "beach", "city",
  ]);
  const cityNameTokens = new Set(
    [...fold(opts.city).split(" "), ...fold(opts.searchCity).split(" ")].filter(
      (t) => t.length >= 3 && !stop.has(t),
    ),
  );
  const landmarkWords = fold(opts.landmark)
    .split(" ")
    .filter((t) => t.length >= 4 && !stop.has(t) && !cityNameTokens.has(t));
  const uniqueTokens = [
    ...new Set([...opts.tokens, ...cityNameTokens].filter((t) => t.length >= 3 && !stop.has(t))),
  ];
  const landmarkInTitle = landmarkWords.some((t) => titleFold.includes(t));
  const cityInTitle = [...cityNameTokens].some((t) => titleFold.includes(t));
  const cityHit = uniqueTokens.some((t) => blob.includes(t));

  if (!opts.identityViaQid) {
    const isSpotPick = landmarkWords.length > 0 && fold(opts.landmark) !== fold(opts.city);
    if (isSpotPick && !landmarkInTitle) return { reject: "landmark missing from file title" };
    if (!cityHit && !cityInTitle) return { reject: "city missing from metadata" };
    for (const rival of opts.rivals) {
      if (
        titleFold.includes(rival) &&
        !cityNameTokens.has(rival) &&
        ![...cityNameTokens].some((t) => titleFold.includes(t))
      ) {
        return { reject: `title names rival city ${rival}` };
      }
    }
  }

  const gps = page.coordinates?.[0];
  if (gps && opts.cityCoord) {
    const km = haversineKm(opts.cityCoord, { lat: gps.lat, lon: gps.lon });
    if (km > 50) return { reject: `gps ${km.toFixed(0)}km from city` };
  } else if (opts.identityViaQid && !gps) {
    // QID path skips title rules, but without GPS still require city identity
    if (!cityHit && !cityInTitle) return { reject: "qid image lacks gps and city metadata" };
  }

  const artist =
    stripHtml(meta.Artist?.value || "")
      .replace(/^by\s+/i, "")
      .slice(0, 90) || "autor não indicado";
  const downloadUrl = info.thumburl || info.url;
  if (!downloadUrl) return { reject: "no download url" };

  const aerial = /aerial|panorama|skyline|cityscape|drone|luftbild/.test(blob);
  const prestige = /featured picture|quality image|valued image/.test(blob) ? 80 : 0;
  const usage = Math.min(40, ((page.globalusage || []) as unknown[]).length * 4);
  const spotBonus = Math.max(0, (4 - (opts.spotIndex || 0)) * SPOT_BONUS);
  const score =
    Math.min(width, 4000) / 100 +
    prestige +
    usage +
    spotBonus +
    (opts.identityViaQid ? 50 : 0) +
    (aerial ? 25 : 0);

  return {
    ok: {
      title,
      width,
      height,
      license: normalizeLicense(licenseRaw),
      artist,
      desc: desc.slice(0, 160),
      downloadUrl,
      previewUrl: info.thumburl,
      href,
      landmark: opts.landmark,
      source: opts.source,
      score,
      objectPosition: TALL_LANDMARK.test(opts.landmark) || TALL_LANDMARK.test(title) ? "top" : "center",
      identityViaQid: opts.identityViaQid,
      spotIndex: opts.spotIndex,
    },
  };
}

async function openverseSearch(
  landmark: string,
  city: string,
  countryEn: string,
): Promise<any[]> {
  const q = encodeURIComponent(`${landmark} ${city} ${countryEn}`);
  const u = `https://api.openverse.org/v1/images/?q=${q}&license=cc0,pdm,by,by-sa&extension=jpg&page_size=12`;
  const res = await fetch(u, {
    headers: { "User-Agent": UA, Accept: "application/json" },
    signal: AbortSignal.timeout(45_000),
  });
  await sleep(900);
  if (!res.ok) return [];
  const json = (await res.json()) as { results?: any[] };
  return json.results || [];
}

function appendDecision(logFile: string, d: Decision) {
  mkdirSync(LOG_DIR, { recursive: true });
  appendFileSync(logFile, JSON.stringify(d) + "\n");
}

function lineOut(
  iso: string,
  city: string,
  status: string,
  title: string,
  score: number | "",
  postcard: number | "",
  reason: string,
) {
  console.log(
    `${iso}|${city}|${status}|${title}|${score}|${postcard}|${reason.replace(/\|/g, "/").slice(0, 80)}`,
  );
}

async function downloadBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(120_000) });
  if (!res.ok) throw new Error(`download ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function downloadAndResize(url: string, dest: string): Promise<{ width: number; height: number }> {
  const buf = await downloadBuffer(url);
  const staged = `${dest}.download`;
  writeFileSync(staged, buf);
  const meta = await sharp(staged)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(dest);
  try {
    const { unlinkSync } = await import("node:fs");
    unlinkSync(staged);
  } catch {
    /* ignore */
  }
  return { width: meta.width || 0, height: meta.height || 0 };
}

async function visionJudge(
  previewJpeg: Buffer,
  landmark: string,
  city: string,
  country: string,
  model: string,
  mode: "api" | "agent",
  fileTitle: string,
): Promise<VisionVerdict> {
  // Agent mode: verdicts are pre-written to vision-verdicts.json by the coding agent.
  if (mode === "agent") {
    const cache = readJson<Record<string, VisionVerdict>>(VERDICT_CACHE_PATH, {});
    const hit = cache[fileTitle];
    if (!hit) {
      throw new Error(`agent-vision missing verdict for ${fileTitle}`);
    }
    return {
      shows_named_landmark: !!hit.shows_named_landmark,
      landmark_prominence: Number(hit.landmark_prominence) || 0,
      clutter: Number(hit.clutter) || 5,
      postcard_score: Number(hit.postcard_score) || 0,
      reason: String(hit.reason || "").slice(0, 80),
    };
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY is not set (or use --vision=agent)");
  const b64 = previewJpeg.toString("base64");
  const prompt = `You judge a photo for a children's geography app.
Named landmark: "${landmark}" in ${city}, ${country}.
Return ONLY compact JSON:
{"shows_named_landmark":bool,"landmark_prominence":1-5,"clutter":1-5,"postcard_score":1-10,"reason":"<=15 words"}
Rules: prominence 5 = landmark fills frame clearly; clutter 5 = wires/dirt/construction/vehicles/close-up people.
Reject courtyard art close-ups, distant landmarks in dirt lots, portraits.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: "image/jpeg", data: b64 } },
            { type: "text", text: prompt },
          ],
        },
      ],
    }),
    signal: AbortSignal.timeout(60_000),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`vision ${res.status}: ${t.slice(0, 200)}`);
  }
  const json = (await res.json()) as { content?: { text?: string }[] };
  const text = json.content?.map((c) => c.text || "").join("") || "";
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("vision: no JSON");
  const v = JSON.parse(m[0]) as VisionVerdict;
  return {
    shows_named_landmark: !!v.shows_named_landmark,
    landmark_prominence: Number(v.landmark_prominence) || 0,
    clutter: Number(v.clutter) || 5,
    postcard_score: Number(v.postcard_score) || 0,
    reason: String(v.reason || "").slice(0, 80),
  };
}

function visionPass(v: VisionVerdict): boolean {
  return (
    v.shows_named_landmark &&
    v.landmark_prominence >= 4 &&
    v.clutter <= 2 &&
    v.postcard_score >= 7
  );
}

async function findCandidatesForCity(ctx: {
  iso: string;
  city: string;
  spotsPt: string[];
  country: CountryRow;
  countries: Record<string, CountryRow>;
  usedHrefs: Set<string>;
  openverse: boolean;
  logFile: string;
}): Promise<{ candidates: Candidate[]; tried: string[]; cityQidError?: string }> {
  const { iso, city, spotsPt, country, countries, usedHrefs, openverse, logFile } = ctx;
  const countryEn = englishCountry(country);
  const searchCity = citySearchName(iso, city);
  const landmarks = spotQueries(iso, city, spotsPt);
  const tokens = [
    ...fold(city).split(" "),
    ...fold(searchCity).split(" "),
    ...((CITY_TEXT_ALIASES as Record<string, Record<string, string[]>>)[iso]?.[city] || []).flatMap((a) =>
      fold(a).split(" "),
    ),
  ].filter((t) => t.length >= 3);
  const exclude = (CITY_EXCLUDE_PLACES as Record<string, Record<string, string[]>>)[iso]?.[city];
  const rivals = rivalCityTokens(iso, city, countries);
  const tried: string[] = [];
  const pool: Candidate[] = [];

  const countryQid = await countryQidForIso(iso);
  const cityHit = await resolveQid(`${searchCity}`, iso, countryQid);
  if (!cityHit?.coords) {
    return {
      candidates: [],
      tried,
      cityQidError: `city QID/coords unresolved for "${searchCity}"`,
    };
  }
  const cityCoord = cityHit.coords;

  const pushEval = (
    page: any,
    landmark: string,
    source: Candidate["source"],
    identityViaQid: boolean,
    spotIndex: number,
  ) => {
    const result = evaluatePage(page, {
      landmark,
      city,
      searchCity,
      tokens,
      exclude,
      cityCoord,
      rivals,
      source,
      identityViaQid,
      usedHrefs,
      spotIndex,
    });
    if ("reject" in result) {
      appendDecision(logFile, {
        ts: new Date().toISOString(),
        iso,
        city,
        decision: "rejected",
        reason: result.reject,
        title: page.title,
        landmark,
        source,
      });
      return;
    }
    pool.push(result.ok);
  };

  for (let spotIndex = 0; spotIndex < landmarks.length; spotIndex++) {
    const landmark = landmarks[spotIndex]!;
    tried.push(`wikidata:${landmark}`);
    const lmQid = await resolveQid(`${landmark} ${countryEn}`, iso, countryQid);
    if (lmQid) {
      for (const file of lmQid.p18.slice(0, 3)) {
        const page = await commonsFileMeta(file);
        if (page) pushEval(page, landmark, "wikidata", true, spotIndex);
      }
      // Wikipedia lead image (enwiki)
      try {
        const ents = await wikiApi("wikidata", {
          action: "wbgetentities",
          format: "json",
          ids: lmQid.id,
          props: "sitelinks",
        });
        await sleep(300);
        const enTitle = ents.entities?.[lmQid.id]?.sitelinks?.enwiki?.title;
        if (enTitle) {
          const wp = new URL("https://en.wikipedia.org/w/api.php");
          wp.searchParams.set("action", "query");
          wp.searchParams.set("format", "json");
          wp.searchParams.set("titles", enTitle);
          wp.searchParams.set("prop", "pageimages");
          wp.searchParams.set("pithumbsize", "1600");
          const wres = await fetch(wp, {
            headers: { "User-Agent": UA, "Api-User-Agent": UA },
            signal: AbortSignal.timeout(30_000),
          });
          if (wres.ok) {
            const wj = await wres.json();
            const page0 = Object.values(wj.query?.pages || {})[0] as any;
            const lead = page0?.pageimage;
            if (lead) {
              const page = await commonsFileMeta(`File:${lead}`);
              if (page) pushEval(page, landmark, "wikidata", true, spotIndex);
            }
          }
          await sleep(300);
        }
      } catch {
        /* lead image optional */
      }
      for (const cat of lmQid.p373.slice(0, 1)) {
        tried.push(`commons-cat:${cat}`);
        try {
          const pages = await commonsCategoryFiles(cat);
          for (const page of pages.slice(0, 12)) pushEval(page, landmark, "wikidata", true, spotIndex);
        } catch (err: any) {
          appendDecision(logFile, {
            ts: new Date().toISOString(),
            iso,
            city,
            decision: "rejected",
            reason: `category error: ${err.message}`,
            landmark,
            source: "wikidata",
          });
        }
      }
    }

    const queries = [
      `"${landmark}" ${searchCity}`,
      `${landmark} ${city} ${countryEn}`,
      `${landmark} ${countryEn}`,
    ];
    for (const q of queries) {
      tried.push(`commons:${q}`);
      try {
        const pages = await commonsSearchPages(q);
        for (const page of pages) pushEval(page, landmark, "commons", false, spotIndex);
      } catch (err: any) {
        appendDecision(logFile, {
          ts: new Date().toISOString(),
          iso,
          city,
          decision: "rejected",
          reason: `commons error: ${err.message}`,
          landmark,
          source: "commons",
        });
      }
    }
  }

  // skyline fallback — last spot index
  for (const q of [`${searchCity} skyline`, `${searchCity} panorama`, `${searchCity} aerial view`]) {
    tried.push(`commons:${q}`);
    try {
      const pages = await commonsSearchPages(q);
      for (const page of pages) pushEval(page, city, "commons", false, landmarks.length);
    } catch {
      /* continue */
    }
  }

  if (openverse) {
    for (const [spotIndex, landmark] of landmarks.slice(0, 2).entries()) {
      tried.push(`openverse:${landmark}`);
      try {
        const results = await openverseSearch(landmark, searchCity, countryEn);
        for (const r of results) {
          if (r.width && r.width < 1600) continue;
          const lic = String(r.license || "").toUpperCase().replace("_", "-");
          const licNorm = lic.startsWith("CC") ? lic : `CC ${lic}`;
          if (!licenseOk(licNorm) && !licenseOk(lic)) continue;
          pool.push({
            title: r.title?.startsWith?.("File:") ? r.title : `File:${r.title || r.id}`,
            width: r.width || 1600,
            height: r.height || 1000,
            license: normalizeLicense(licNorm),
            artist: stripHtml(r.creator || "").slice(0, 90) || "autor não indicado",
            desc: r.title || "",
            downloadUrl: r.url,
            href: r.foreign_landing_url || r.url,
            landmark,
            source: "openverse",
            score: 40 + Math.max(0, (4 - spotIndex) * SPOT_BONUS),
            objectPosition: TALL_LANDMARK.test(landmark) ? "top" : "center",
            spotIndex,
          });
        }
      } catch {
        /* continue */
      }
    }
  }

  const seen = new Set<string>();
  const unique = pool
    .filter((c) => {
      if (seen.has(c.title)) return false;
      seen.add(c.title);
      return true;
    })
    .filter((c) => c.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return { candidates: unique, tried };
}

async function stageFind(opts: {
  targets: { iso: string; city: string; spots: string; country: CountryRow }[];
  countries: Record<string, CountryRow>;
  usedHrefs: Set<string>;
  openverse: boolean;
  logFile: string;
  overrides: Record<string, string>;
  verbose: boolean;
}) {
  mkdirSync(CAND_DIR, { recursive: true });
  const byIso: Record<string, Record<string, { candidates: Candidate[]; tried: string[] }>> = {};

  for (const t of opts.targets) {
    const key = `${t.iso}|${t.city}`;
    // disk handoff: skip find if top-3 already cached for this city
    const existingIso = readJson<Record<string, { candidates: Candidate[]; tried: string[] }>>(
      join(CAND_DIR, `${t.iso}.json`),
      {},
    );
    if (existingIso[t.city]?.candidates?.length && !opts.overrides[key]) {
      byIso[t.iso] = byIso[t.iso] || {};
      byIso[t.iso]![t.city] = existingIso[t.city]!;
      if (opts.verbose) {
        lineOut(
          t.iso,
          t.city,
          "ACCEPT",
          existingIso[t.city]!.candidates[0]!.title,
          Math.round(existingIso[t.city]!.candidates[0]!.score),
          "",
          "cached candidates",
        );
      }
      continue;
    }
    if (opts.overrides[key]) {
      const page = await commonsFileMeta(opts.overrides[key]);
      if (!page) {
        if (opts.verbose) {
          lineOut(t.iso, t.city, "UNRESOLVED", opts.overrides[key], "", "", "override file missing");
        }
        byIso[t.iso] = byIso[t.iso] || {};
        byIso[t.iso]![t.city] = { candidates: [], tried: [`override:${opts.overrides[key]}`] };
        continue;
      }
      const spotsPt = t.spots.split(",").map((s) => s.trim()).filter(Boolean);
      const landmark = spotQueries(t.iso, t.city, spotsPt)[0] || t.city;
      const result = evaluatePage(page, {
        landmark,
        city: t.city,
        searchCity: citySearchName(t.iso, t.city),
        tokens: fold(t.city).split(" "),
        exclude: undefined,
        cityCoord: null,
        rivals: [],
        source: "override",
        identityViaQid: true,
        usedHrefs: opts.usedHrefs,
        spotIndex: 0,
      });
      const cands = "ok" in result ? [result.ok] : [];
      if (opts.verbose) {
        if ("reject" in result) {
          lineOut(t.iso, t.city, "UNRESOLVED", opts.overrides[key], "", "", result.reject);
        } else {
          lineOut(t.iso, t.city, "ACCEPT", cands[0]!.title, Math.round(cands[0]!.score), "", "override");
        }
      }
      byIso[t.iso] = byIso[t.iso] || {};
      byIso[t.iso]![t.city] = { candidates: cands, tried: [`override:${opts.overrides[key]}`] };
      writeJson(join(CAND_DIR, `${t.iso}.json`), byIso[t.iso]);
      continue;
    }

    const { candidates, tried, cityQidError } = await findCandidatesForCity({
      iso: t.iso,
      city: t.city,
      spotsPt: t.spots.split(",").map((s) => s.trim()).filter(Boolean),
      country: t.country,
      countries: opts.countries,
      usedHrefs: opts.usedHrefs,
      openverse: opts.openverse,
      logFile: opts.logFile,
    });

    byIso[t.iso] = byIso[t.iso] || {};
    byIso[t.iso]![t.city] = { candidates, tried };
    writeJson(join(CAND_DIR, `${t.iso}.json`), byIso[t.iso]);

    if (opts.verbose) {
      if (cityQidError) {
        lineOut(t.iso, t.city, "UNRESOLVED", "-", "", "", cityQidError);
      } else if (!candidates.length) {
        lineOut(t.iso, t.city, "UNRESOLVED", "-", "", "", "no candidates above min score");
      } else {
        lineOut(
          t.iso,
          t.city,
          "ACCEPT",
          candidates[0]!.title,
          Math.round(candidates[0]!.score),
          "",
          `top3=${candidates.length}`,
        );
      }
    } else if (cityQidError || !candidates.length) {
      appendDecision(opts.logFile, {
        ts: new Date().toISOString(),
        iso: t.iso,
        city: t.city,
        decision: "unresolved",
        reason: cityQidError || "no candidates above min score",
      });
    }
  }
}

async function stageJudge(opts: {
  isos: Set<string>;
  targets: { iso: string; city: string; spots: string; country: CountryRow }[];
  overrides: Record<string, string>;
  visionModel: string;
  visionMode: "api" | "agent";
  logFile: string;
  verbose: boolean;
}) {
  const verdicts = readJson<Record<string, VisionVerdict & { pass?: boolean }>>(VERDICT_CACHE_PATH, {});
  const reviewRows: string[] = [];
  mkdirSync(REVIEW_DIR, { recursive: true });
  mkdirSync(join(REVIEW_DIR, "previews"), { recursive: true });

  for (const t of opts.targets) {
    const key = `${t.iso}|${t.city}`;
    const candFile = join(CAND_DIR, `${t.iso}.json`);
    const cityCands = readJson<Record<string, { candidates: Candidate[]; tried: string[] }>>(
      candFile,
      {},
    )[t.city];
    if (!cityCands?.candidates?.length) {
      if (opts.verbose) lineOut(t.iso, t.city, "UNRESOLVED", "-", "", "", "no candidates to judge");
      continue;
    }

    // overrides skip vision
    if (opts.overrides[key]) {
      const c = cityCands.candidates[0]!;
      if (opts.verbose) {
        lineOut(t.iso, t.city, "ACCEPT", c.title, Math.round(c.score), 10, "override skip vision");
      }
      writeJson(join(CAND_DIR, `${t.iso}.judged.json`), {
        ...(readJson(join(CAND_DIR, `${t.iso}.judged.json`), {}) as object),
        [t.city]: { chosen: c, verdict: { postcard_score: 10, reason: "override", pass: true } },
      });
      continue;
    }

    let chosen: Candidate | null = null;
    let chosenVerdict: VisionVerdict | null = null;
    let bestFail: { c: Candidate; v: VisionVerdict } | null = null;

    for (const c of cityCands.candidates.slice(0, 3)) {
      const cached = verdicts[c.title];
      let v: VisionVerdict;
      if (cached) {
        v = cached;
      } else {
        const previewUrl =
          c.previewUrl ||
          (await commonsFileMeta(c.title))?.imageinfo?.[0]?.thumburl ||
          c.downloadUrl;
        // fetch ~1024 preview
        const u = new URL(
          previewUrl.includes("http")
            ? previewUrl
            : `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(c.title.replace(/^File:/, ""))}?width=1024`,
        );
        let buf: Buffer;
        try {
          // Prefer commons thumb at 1024
          const meta = await commonsFileMeta(c.title);
          const thumb =
            meta?.imageinfo?.[0]?.thumburl?.replace(/\/\d+px-/, "/1024px-") ||
            meta?.imageinfo?.[0]?.url;
          buf = await downloadBuffer(thumb || c.downloadUrl);
          buf = await sharp(buf).resize({ width: 1024, withoutEnlargement: true }).jpeg({ quality: 80 }).toBuffer();
        } catch (err: any) {
          appendDecision(opts.logFile, {
            ts: new Date().toISOString(),
            iso: t.iso,
            city: t.city,
            decision: "rejected",
            reason: `preview fail: ${err.message}`,
            title: c.title,
          });
          continue;
        }
        const previewPath = join(
          REVIEW_DIR,
          "previews",
          `${slug(`${t.iso}-${t.city}-${c.title}`)}.jpg`,
        );
        writeFileSync(previewPath, buf);
        if (opts.visionMode === "agent" && !verdicts[c.title]) {
          // Preview on disk; coding agent fills scripts/.cache/vision-verdicts.json
          appendDecision(opts.logFile, {
            ts: new Date().toISOString(),
            iso: t.iso,
            city: t.city,
            decision: "rejected",
            reason: `agent-vision pending preview=${previewPath}`,
            title: c.title,
            landmark: c.landmark,
          });
          throw new Error(
            `agent-vision: write verdict for ${c.title} then re-run --stage=judge --vision=agent`,
          );
        }
        v = await visionJudge(
          buf,
          c.landmark,
          t.city,
          englishCountry(t.country),
          opts.visionModel,
          opts.visionMode,
          c.title,
        );
        verdicts[c.title] = v;
        writeJson(VERDICT_CACHE_PATH, verdicts);
        await sleep(400);
        void u;
      }

      reviewRows.push(
        `<tr><td><img src="previews/${slug(t.iso + "-" + t.city + "-" + c.title)}.jpg" width="240"/></td><td>${t.iso}|${t.city}</td><td>${c.title}</td><td>${visionPass(v) ? "PASS" : "FAIL"}</td><td>${v.postcard_score}</td><td>${v.reason}</td></tr>`,
      );

      if (visionPass(v)) {
        chosen = c;
        chosenVerdict = v;
        break;
      }
      if (!bestFail || v.postcard_score > bestFail.v.postcard_score) bestFail = { c, v };
    }

    const judgedPath = join(CAND_DIR, `${t.iso}.judged.json`);
    const judged = readJson<Record<string, any>>(judgedPath, {});
    if (chosen && chosenVerdict) {
      judged[t.city] = { chosen, verdict: { ...chosenVerdict, pass: true } };
      writeJson(judgedPath, judged);
      if (opts.verbose) {
        lineOut(
          t.iso,
          t.city,
          "ACCEPT",
          chosen.title,
          Math.round(chosen.score),
          chosenVerdict.postcard_score,
          chosenVerdict.reason,
        );
      }
    } else {
      judged[t.city] = {
        chosen: null,
        verdict: bestFail ? { ...bestFail.v, pass: false } : null,
        best: bestFail?.c || null,
      };
      writeJson(judgedPath, judged);
      if (opts.verbose) {
        lineOut(
          t.iso,
          t.city,
          "UNRESOLVED",
          bestFail?.c.title || "-",
          bestFail ? Math.round(bestFail.c.score) : "",
          bestFail?.v.postcard_score ?? "",
          bestFail?.v.reason || "vision rejected all",
        );
      }
    }
  }

  const html = `<!doctype html><meta charset="utf-8"/><title>City photo review</title>
<style>body{font-family:sans-serif} td{vertical-align:top;padding:8px;border-bottom:1px solid #ddd}</style>
<table><thead><tr><th>Preview</th><th>City</th><th>File</th><th>Verdict</th><th>Postcard</th><th>Reason</th></tr></thead>
<tbody>${reviewRows.join("\n")}</tbody></table>`;
  writeFileSync(join(REVIEW_DIR, "index.html"), html);
}

async function stageApply(opts: {
  targets: { iso: string; city: string; spots: string; country: CountryRow }[];
  dryRun: boolean;
  manifest: Record<string, Record<string, CityPhoto[]>>;
  state: Record<string, any>;
  unresolved: Unresolved[];
  logFile: string;
  replace: Set<string>;
}) {
  let added = 0;
  let unresolvedCount = 0;

  for (const t of opts.targets) {
    const key = `${t.iso}|${t.city}`;
    const judged = readJson<Record<string, any>>(join(CAND_DIR, `${t.iso}.judged.json`), {})[t.city];
    if (!judged?.chosen || !judged?.verdict?.pass) {
      unresolvedCount++;
      if (!opts.dryRun) {
        opts.state[key] = {
          status: "unresolved",
          why: judged?.verdict?.reason || "no passing candidate",
          at: new Date().toISOString(),
        };
        const entry: Unresolved = {
          iso: t.iso,
          country: t.country.name,
          city: t.city,
          spots: t.spots,
          tried: [],
          why: judged?.verdict?.reason || "no passing candidate",
        };
        const idx = opts.unresolved.findIndex((u) => u.iso === t.iso && u.city === t.city);
        if (idx >= 0) opts.unresolved[idx] = entry;
        else opts.unresolved.push(entry);
        writeJson(STATE_PATH, opts.state);
        writeJson(UNRESOLVED_PATH, opts.unresolved);
      }
      lineOut(
        t.iso,
        t.city,
        "UNRESOLVED",
        judged?.best?.title || "-",
        judged?.best ? Math.round(judged.best.score) : "",
        judged?.verdict?.postcard_score ?? "",
        judged?.verdict?.reason || "no passing candidate",
      );
      continue;
    }

    const cand = judged.chosen as Candidate;
    const caption = `${cand.landmark}, ${t.city}, ${englishCountry(t.country)}`;
    const credit =
      cand.source === "openverse"
        ? `Foto: ${cand.artist}. ${cand.license}.`
        : `Foto: ${cand.artist}. Wikimedia Commons, ${cand.license}.`;
    const file = `${slug(t.city)}-0.jpg`;
    const src = `/cities/${t.iso}/${file}`;

    if (opts.dryRun) {
      lineOut(
        t.iso,
        t.city,
        "ACCEPT",
        cand.title,
        Math.round(cand.score),
        judged.verdict.postcard_score,
        `dry-run would write ${src}`,
      );
      appendDecision(opts.logFile, {
        ts: new Date().toISOString(),
        iso: t.iso,
        city: t.city,
        decision: "accepted",
        reason: `dry-run ${src}`,
        title: cand.title,
        landmark: cand.landmark,
        source: cand.source,
        score: cand.score,
        postcard: judged.verdict.postcard_score,
      });
      continue;
    }

    // safety: never replace unless --replace
    if ((opts.manifest[t.iso]?.[t.city] || []).length && !opts.replace.has(key)) {
      lineOut(t.iso, t.city, "SKIP", cand.title, Math.round(cand.score), "", "manifest exists (use --replace)");
      continue;
    }

    const dir = join(OUT_ROOT, t.iso);
    mkdirSync(dir, { recursive: true });
    const dest = join(dir, file);
    try {
      const dims = await downloadAndResize(cand.downloadUrl, dest);
      opts.manifest[t.iso] = opts.manifest[t.iso] || {};
      opts.manifest[t.iso]![t.city] = [
        {
          src,
          caption,
          credit,
          href: cand.href,
          kind: "photo",
          objectPosition: cand.objectPosition,
        },
      ];
      writeJson(MANIFEST_PATH, opts.manifest);
      opts.state[key] = {
        status: "accepted",
        title: cand.title,
        landmark: cand.landmark,
        source: cand.source,
        dims,
        at: new Date().toISOString(),
      };
      const uidx = opts.unresolved.findIndex((u) => u.iso === t.iso && u.city === t.city);
      if (uidx >= 0) opts.unresolved.splice(uidx, 1);
      writeJson(STATE_PATH, opts.state);
      writeJson(UNRESOLVED_PATH, opts.unresolved);
      added++;
      lineOut(
        t.iso,
        t.city,
        "ACCEPT",
        cand.title,
        Math.round(cand.score),
        judged.verdict.postcard_score,
        `wrote ${src}`,
      );
    } catch (err: any) {
      unresolvedCount++;
      opts.state[key] = { status: "unresolved", why: err.message, at: new Date().toISOString() };
      writeJson(STATE_PATH, opts.state);
      lineOut(t.iso, t.city, "UNRESOLVED", cand.title, Math.round(cand.score), "", err.message);
    }
  }

  return { added, unresolvedCount };
}

function regressionCheck(): string {
  const bad = [
    "File:Lagos Lekki Nike Art Gallery Aug 2026 IMG 6955b.jpg",
    "File:National Mosque - Abuja.jpg",
  ];
  const paths = [
    join(CAND_DIR, "ng.judged.json"),
    join(CAND_DIR, "ng.json"),
    VERDICT_CACHE_PATH,
  ];
  for (const p of paths) {
    if (!existsSync(p)) continue;
    const text = readFileSync(p, "utf8");
    for (const b of bad) {
      // Fail only if accepted/chosen as pass
      if (text.includes(b) && /"pass"\s*:\s*true/.test(text) && text.indexOf(b) < text.indexOf('"pass": true') + 500) {
        // crude: if judged chosen title is bad
      }
    }
  }
  if (existsSync(join(CAND_DIR, "ng.judged.json"))) {
    const judged = readJson<Record<string, any>>(join(CAND_DIR, "ng.judged.json"), {});
    for (const city of Object.keys(judged)) {
      const title = judged[city]?.chosen?.title;
      if (title && bad.includes(title) && judged[city]?.verdict?.pass) {
        return `FAIL regression: ${city} accepted ${title}`;
      }
    }
  }
  return "PASS regression: pilot-bad files not accepted";
}

async function main() {
  const cli = parseArgs(process.argv.slice(2));
  if (!cli.isos.size) {
    console.error("Pass --iso=ng or --continent=africa");
    process.exit(1);
  }

  mkdirSync(LOG_DIR, { recursive: true });
  mkdirSync(CACHE_DIR, { recursive: true });

  const countries = JSON.parse(readFileSync(COUNTRIES_PATH, "utf8")) as Record<string, CountryRow>;
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8")) as Record<
    string,
    Record<string, CityPhoto[]>
  >;
  const state = readJson<Record<string, any>>(STATE_PATH, {});
  const unresolved = readJson<Unresolved[]>(UNRESOLVED_PATH, []);
  const overrides = readJson<Record<string, string>>(OVERRIDES_PATH, {});
  if (!existsSync(OVERRIDES_PATH)) writeJson(OVERRIDES_PATH, {});

  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const logFile = join(LOG_DIR, cli.dryRun ? `dryrun-${stamp}.jsonl` : `fetch-${stamp}.jsonl`);
  const usedHrefs = manifestHrefs(manifest);

  const targets: { iso: string; city: string; spots: string; country: CountryRow }[] = [];
  let skipped = 0;

  for (const [iso, country] of Object.entries(countries)) {
    if (!cli.isos.has(iso)) continue;
    for (const row of country.cities || []) {
      if (!row.city) continue;
      const key = `${iso}|${row.city}`;
      const isReplace = cli.replace.has(key);
      const hasPhoto = (manifest[iso]?.[row.city] || []).length > 0;

      if (hasPhoto && !isReplace) {
        // --force must NOT replace
        skipped++;
        lineOut(iso, row.city, "SKIP", "-", "", "", "already has photo");
        continue;
      }
      if (!isReplace && state[key]?.status === "accepted" && !cli.retryUnresolved) {
        skipped++;
        lineOut(iso, row.city, "SKIP", "-", "", "", "state accepted");
        continue;
      }
      if (
        !isReplace &&
        state[key]?.status === "unresolved" &&
        !cli.retryUnresolved &&
        !hasPhoto
      ) {
        skipped++;
        lineOut(iso, row.city, "SKIP", "-", "", "", "state unresolved (use --retry-unresolved)");
        continue;
      }
      targets.push({ iso, city: row.city, spots: row.spots || "", country });
      if (targets.length >= cli.limit) break;
    }
    if (targets.length >= cli.limit) break;
  }

  const runFind = !cli.stage || cli.stage === "find";
  const runJudge = !cli.stage || cli.stage === "judge" || cli.stage === "";
  const runApply = (!cli.stage || cli.stage === "apply" || cli.stage === "") && !cli.dryRun;
  // dry-run still runs find+judge; apply section emits ACCEPT dry-run lines without writing
  const runApplyDry = cli.dryRun && (!cli.stage || cli.stage === "apply" || cli.stage === "");

  const findOnly = cli.stage === "find";
  const judgeOnly = cli.stage === "judge";

  if (runFind) {
    await stageFind({
      targets,
      countries,
      usedHrefs,
      openverse: cli.openverse,
      logFile,
      overrides,
      verbose: findOnly,
    });
  }

  if (runJudge && (judgeOnly || !cli.stage)) {
    if (
      cli.visionMode === "api" &&
      !process.env.ANTHROPIC_API_KEY &&
      !targets.every((t) => overrides[`${t.iso}|${t.city}`])
    ) {
      console.error("ANTHROPIC_API_KEY required (or pass --vision=agent)");
      process.exit(1);
    }
    await stageJudge({
      isos: cli.isos,
      targets,
      overrides,
      visionModel: cli.visionModel,
      visionMode: cli.visionMode,
      logFile,
      verbose: judgeOnly,
    });
  }

  let added = 0;
  let unresolvedCount = 0;
  // Final per-city lines come from apply (or dry apply). Skip if find/judge-only.
  if ((runApply || runApplyDry) && !findOnly && !judgeOnly) {
    const r = await stageApply({
      targets,
      dryRun: cli.dryRun,
      manifest,
      state,
      unresolved,
      logFile,
      replace: cli.replace,
    });
    added = r.added;
    unresolvedCount = r.unresolvedCount;
  }

  console.log(
    `totals|added=${added}|skipped=${skipped}|unresolved=${unresolvedCount}|targets=${targets.length}|dryRun=${cli.dryRun}`,
  );
  if (cli.isos.has("ng")) console.log(regressionCheck());
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
