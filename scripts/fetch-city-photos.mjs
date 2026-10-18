/**
 * Two public Wikimedia photographs per city (cities & landmarks section).
 * Downloads locally + writes src/data/city-photos.json with credits.
 * Default pilot: --iso br,uy
 */
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

const UA = "MundoMagicoCityPhotos/1.0 (educational child app; city landmarks; contact via project repo)";
const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT_ROOT = join(ROOT, "public", "cities");
const MANIFEST = join(ROOT, "src", "data", "city-photos.json");
const COUNTRIES = JSON.parse(readFileSync(join(ROOT, "src", "data", "countries.json"), "utf8"));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function strip(html) {
  return String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&/g, "&")
    .replace(/"/g, '"')
    .replace(/&#0?39;|'/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function fold(s) {
  return String(s || "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function slugify(s) {
  return fold(s).replace(/\s+/g, "-").slice(0, 48) || "city";
}

function licenseOk(short) {
  const s = fold(short);
  if (!s) return false;
  if (s.includes("non-commercial") || s.includes("noncommercial") || s.includes("-nc") || /\bnc\b/.test(s))
    return false;
  if (s.includes("no derivatives") || s.includes("-nd") || /\bnd\b/.test(s)) return false;
  if (s.includes("all rights reserved") || s.includes("copyrighted")) return false;
  return /public domain|cc0|cc by|cc-by|gfdl|pdm|no restrictions/.test(s);
}

const BAD =
  /illustrat|drawing|painting|desenho|ilustra|pintura|cartoon|vector|icon\b|logo|coat of arms|flag of|bandeira|mapa\b|map of|diagram|stamp\b|coin\b|banknote|screenshot|book cover|poster\b|engraving|sketch|aquarel|guache|artwork|comic|manga|anime|satellite|aerial chart|demography|election|covid|passport|id card|watermark|puntacasas|\bcasino\b|hotel conrad|resort & casino/;

const GOOD =
  /city|cidade|ciudad|skyline|panorama|view of|vista|downtown|centro|harbour|harbor|porto|praia|beach|playa|square|praca|plaza|street|rua|avenida|bridge|ponte|castelo|castle|palace|palacio|cathedral|catedral|church|igreja|templo|temple|monument|monumento|statue|estatua|tower|torre|fort|forte|fortaleza|museum|museu|park|parque|market|mercado|lighthouse|farol|harbour|rambla|old town|historic|historico|landmark|building|edificio|architecture|arquitetura|bay|baia|coast|costa|waterfront|orla/;

function subjectOf(title) {
  return title
    .replace(/^File:/, "")
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/_/g, " ")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\b\d{3,}\b/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 88);
}

async function search(q, attempt = 0) {
  const u = new URL("https://commons.wikimedia.org/w/api.php");
  u.searchParams.set("action", "query");
  u.searchParams.set("format", "json");
  u.searchParams.set("generator", "search");
  u.searchParams.set("gsrsearch", `${q} filetype:bitmap`);
  u.searchParams.set("gsrnamespace", "6");
  u.searchParams.set("gsrlimit", "12");
  u.searchParams.set("prop", "imageinfo|categories");
  u.searchParams.set("iiprop", "url|mime|size|extmetadata");
  u.searchParams.set("iiurlwidth", "1200");
  u.searchParams.set("cllimit", "16");
  const res = await fetch(u, { headers: { "User-Agent": UA, "Api-User-Agent": UA } });
  if (res.status === 429 && attempt < 6) {
    const wait = 4000 * (attempt + 1);
    console.log("429, wait", wait);
    await sleep(wait);
    return search(q, attempt + 1);
  }
  if (!res.ok) throw new Error(`commons ${res.status}`);
  const json = await res.json();
  return Object.values(json.query?.pages || {});
}

function candidates(pages, { prefer = [] } = {}) {
  const prefs = prefer.map(fold).filter((t) => t.length >= 3);
  const out = [];
  for (const page of pages) {
    const info = page.imageinfo?.[0];
    if (!info || !/^image\/jpe?g$/.test(info.mime || "")) continue;
    if ((info.thumbwidth || info.width || 0) < 640) continue;
    if ((info.size || 0) > 0 && info.size < 40_000) continue;
    const meta = info.extmetadata || {};
    const license = meta.LicenseShortName?.value || "";
    if (!licenseOk(license)) continue;
    const desc = strip(meta.ImageDescription?.value);
    const cats = (page.categories || []).map((c) => c.title).join(" ");
    const blob = `${page.title} ${desc} ${cats}`;
    const folded = fold(blob);
    if (BAD.test(folded)) continue;
    if (!GOOD.test(folded)) continue;
    const artist = strip(meta.Artist?.value).replace(/^by\s+/i, "").slice(0, 90);
    const prefHits = prefs.filter((t) => folded.includes(t)).length;
    out.push({
      title: page.title,
      info,
      license,
      artist: artist || "autor não indicado",
      subject: subjectOf(page.title),
      score: (GOOD.test(folded) ? 1 : 0) + prefHits * 2,
    });
  }
  out.sort((a, b) => b.score - a.score);
  const chosen = [];
  const seen = new Set();
  for (const item of out) {
    const key = fold(item.subject).slice(0, 40);
    if (seen.has(key)) continue;
    seen.add(key);
    chosen.push(item);
    if (chosen.length === 2) break;
  }
  return chosen;
}

async function download(url, dest, attempt = 0) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if ((res.status === 429 || res.status >= 500) && attempt < 6) {
    await sleep(3000 * (attempt + 1));
    return download(url, dest, attempt + 1);
  }
  if (!res.ok || !res.body) throw new Error(`download ${res.status}`);
  mkdirSync(dirname(dest), { recursive: true });
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
}

function href(title) {
  return `https://commons.wikimedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;
}

function parseIsoArg() {
  const raw = process.argv.find((a) => a.startsWith("--iso=")) || process.argv.find((a, i, arr) => arr[i - 1] === "--iso");
  let value = "br,uy";
  if (raw?.startsWith("--iso=")) value = raw.slice("--iso=".length);
  else if (raw && !raw.startsWith("--")) value = raw;
  else {
    const idx = process.argv.indexOf("--iso");
    if (idx >= 0 && process.argv[idx + 1] && !process.argv[idx + 1].startsWith("--")) {
      value = process.argv[idx + 1];
    }
  }
  return value
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

const resume = process.argv.includes("--resume");
const isos = parseIsoArg();
const manifest = existsSync(MANIFEST) && resume ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};

mkdirSync(OUT_ROOT, { recursive: true });

for (const iso of isos) {
  const country = COUNTRIES[iso];
  if (!country) {
    console.log("skip unknown iso", iso);
    continue;
  }
  if (!manifest[iso]) manifest[iso] = {};
  const countryNames = [country.name, ...(country.aliases || [])];
  const enName = country.aliases?.[0] || country.name;

  for (const cityRow of country.cities || []) {
    const city = cityRow.city;
    const spots = String(cityRow.spots || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const citySlug = slugify(city);

    if (resume && Array.isArray(manifest[iso][city]) && manifest[iso][city].length >= 2) {
      console.log("skip", iso, city);
      continue;
    }

    const prefer = [city, ...spots.slice(0, 3), ...countryNames];
    let pages = [];
    const queries = [
      `${city} ${enName}`,
      `${city} ${country.name}`,
      spots[0] ? `${spots[0]} ${enName}` : null,
      spots[1] ? `${spots[1]} ${city}` : null,
      `${city} skyline`,
    ].filter(Boolean);

    try {
      for (const q of queries) {
        pages = pages.concat(await search(q));
        await sleep(1100);
        let picks = candidates(pages, { prefer });
        if (picks.length >= 2) {
          const dir = join(OUT_ROOT, iso);
          mkdirSync(dir, { recursive: true });
          const photos = [];
          for (let i = 0; i < 2; i++) {
            const file = `${citySlug}-${i}.jpg`;
            const dest = join(dir, file);
            await download(picks[i].info.thumburl || picks[i].info.url, dest);
            photos.push({
              src: `/cities/${iso}/${file}`,
              caption: `${city} — ${picks[i].subject}`,
              credit: `Fotografia pública de ${picks[i].artist}. Wikimedia Commons, ${picks[i].license}.`,
              href: href(picks[i].title),
              kind: "photo",
            });
          }
          manifest[iso][city] = photos;
          writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
          console.log("ok", iso, city, photos.map((p) => p.caption).join(" | "));
          pages = [];
          break;
        }
      }
      if (!manifest[iso][city] || manifest[iso][city].length < 2) {
        console.log("gap", iso, city, "found", candidates(pages, { prefer }).length);
      }
    } catch (err) {
      console.log("fail", iso, city, err.message);
    }
  }
}

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
let total = 0;
let full = 0;
for (const iso of isos) {
  for (const city of Object.keys(manifest[iso] || {})) {
    const n = manifest[iso][city]?.length || 0;
    total += n;
    if (n >= 2) full += 1;
  }
}
console.log("done", "isos", isos.join(","), "city-pairs", full, "files", total);
