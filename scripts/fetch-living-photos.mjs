/**
 * Two public Wikimedia photographs per tale.
 * Prefers a photo that really names the tale (festival, statue, costume, people).
 * Otherwise uses two free photos of a real folklore festival in that country,
 * captioned honestly — never as if they showed a different event.
 */
import { createWriteStream, mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

const UA = "MundoMagicoFolkloreApp/1.0 (educational child folklore; public-photo gallery)";
const OUT_DIR = new URL("../public/stories/living/", import.meta.url);
const MANIFEST = new URL("../src/data/stories/living.json", import.meta.url);
const COUNTRIES = JSON.parse(readFileSync(new URL("../src/data/countries.json", import.meta.url), "utf8"));

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

function licenseOk(short) {
  const s = fold(short);
  if (!s) return false;
  if (s.includes("non-commercial") || s.includes("noncommercial") || s.includes("-nc") || /\bnc\b/.test(s)) return false;
  if (s.includes("no derivatives") || s.includes("-nd") || /\bnd\b/.test(s)) return false;
  if (s.includes("all rights reserved") || s.includes("copyrighted")) return false;
  return /public domain|cc0|cc by|cc-by|gfdl|pdm|no restrictions/.test(s);
}

const BAD = /illustrat|drawing|painting|desenho|ilustra|pintura|cartoon|vector|icon\b|logo|coat of arms|flag of|bandeira|mapa\b|map of|diagram|stamp\b|coin\b|banknote|screenshot|book cover|poster\b|engraving|sketch|aquarel|guache|artwork|comic|manga|anime|rodovia|highway|vicinal|estrada|dust devil|redemoinho|drought|seca de/;
const GOOD = /festival|festa|parade|desfile|carnaval|carnival|costume|traje|folclore|folklore|statue|monumento|monument|dance|danca|procession|prociss|performance|boi-bumba|bumba|romaria|fiesta|matsuri|people|pessoa|crowd|multidao|dancer|bailar|tradition|tradicional/;

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
  u.searchParams.set("gsrlimit", "8");
  u.searchParams.set("prop", "imageinfo|categories");
  u.searchParams.set("iiprop", "url|mime|size|extmetadata");
  u.searchParams.set("iiurlwidth", "1200");
  u.searchParams.set("cllimit", "12");
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

function candidates(pages, { mustInclude = [] } = {}) {
  const need = mustInclude.map(fold).filter((t) => t.length >= 4);
  const out = [];
  for (const page of pages) {
    const info = page.imageinfo?.[0];
    if (!info || !/^image\/jpe?g$/.test(info.mime || "")) continue;
    if ((info.thumbwidth || 0) < 640) continue;
    const meta = info.extmetadata || {};
    const license = meta.LicenseShortName?.value || "";
    if (!licenseOk(license)) continue;
    const desc = strip(meta.ImageDescription?.value);
    const cats = (page.categories || []).map((c) => c.title).join(" ");
    const blob = `${page.title} ${desc} ${cats}`;
    const folded = fold(blob);
    if (BAD.test(folded)) continue;
    if (!GOOD.test(folded)) continue;
    if (need.length && !need.some((t) => folded.includes(t))) continue;
    const artist = strip(meta.Artist?.value).replace(/^by\s+/i, "").slice(0, 90);
    out.push({
      title: page.title,
      info,
      license,
      artist: artist || "autor não indicado",
      subject: subjectOf(page.title),
      score: (GOOD.test(folded) ? 2 : 0) + (need.filter((t) => folded.includes(t)).length),
    });
  }
  out.sort((a, b) => b.score - a.score);
  const chosen = [];
  const seen = new Set();
  for (const item of out) {
    const key = fold(item.subject).slice(0, 36);
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
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
}

function href(title) {
  return `https://commons.wikimedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;
}

function photoRecord(item, file, caption) {
  return {
    src: `/stories/living/${file}`,
    caption,
    credit: `Fotografia pública de ${item.artist}. Wikimedia Commons, ${item.license}.`,
    href: href(item.title),
    kind: "photo",
  };
}

async function savePair(items, names) {
  const saved = [];
  for (let i = 0; i < items.length; i++) {
    const file = names[i];
    await download(items[i].info.thumburl || items[i].info.url, new URL(file, OUT_DIR));
    saved.push({ item: items[i], file });
  }
  return saved;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

mkdirSync(OUT_DIR, { recursive: true });
const resume = process.argv.includes("--resume");
if (!resume) {
  rmSync(OUT_DIR, { recursive: true, force: true });
  mkdirSync(OUT_DIR, { recursive: true });
}

const countryPhotos = {};
if (resume) {
  try {
    Object.assign(countryPhotos, JSON.parse(readFileSync(new URL("./country-photos.json", import.meta.url), "utf8")));
  } catch {
    /* fresh */
  }
}
let n = 0;
for (const [iso, country] of Object.entries(COUNTRIES)) {
  n += 1;
  if (countryPhotos[iso]?.length >= 2) {
    console.log("fest skip", iso);
    continue;
  }
  const alias = country.aliases?.[0] || country.name;
  try {
    let pages = [...(await search(`${alias} folklore festival`)), ...(await search(`${country.name} folklore festival`))];
    await sleep(1100);
    const names = [country.name, ...(country.aliases || [])].map(fold).filter((s) => s.length >= 4);
    let picks = candidates(pages, { mustInclude: names });
    if (picks.length < 2) {
      pages = pages.concat(await search(`${alias} traditional costume`));
      await sleep(1100);
      picks = candidates(pages, { mustInclude: names });
    }
    if (!picks.length) {
      console.log("no festival", iso, alias);
      continue;
    }
    const saved = await savePair(
      picks,
      picks.map((_, i) => `${iso}-fest-${i === 0 ? "a" : "b"}.jpg`),
    );
    countryPhotos[iso] = saved;
    writeFileSync(new URL("./country-photos.json", import.meta.url), JSON.stringify(countryPhotos));
    console.log("fest", n, iso, saved.length, saved.map((s) => s.item.subject).join(" | "));
  } catch (err) {
    console.log("fest fail", iso, err.message);
  }
}

const manifest = {};
const gaps = [];
n = 0;
for (const [iso, country] of Object.entries(COUNTRIES)) {
  for (let index = 0; index < country.tales.length; index++) {
    const title = country.tales[index];
    const key = `${iso}:${index}`;
    n += 1;
    let specific = [];
    try {
      const distinctive = title.split(/[,:(]/)[0].trim();
      const word = fold(distinctive)
        .split(" ")
        .filter((w) => w.length >= 5)
        .sort((a, b) => b.length - a.length)[0];
      const pages = await search(`${distinctive} ${country.aliases?.[0] || country.name}`);
      await sleep(1100);
      specific = word ? candidates(pages, { mustInclude: [word] }) : [];
    } catch (err) {
      console.log("tale fail", key, err.message);
    }
    const photos = [];
    if (specific.length) {
      const saved = await savePair(
        specific,
        specific.map((_, i) => `${iso}-${index}-${i === 0 ? "a" : "b"}.jpg`),
      );
      for (const s of saved) {
        photos.push(photoRecord(s.item, s.file, `${title} — ${s.item.subject}`));
      }
    }
    const fest = countryPhotos[iso] || [];
    for (const s of fest) {
      if (photos.length >= 2) break;
      if (photos.some((p) => p.caption.includes(s.item.subject))) continue;
      photos.push(
        photoRecord(
          s.item,
          s.file,
          `Festa tradicional em ${country.name}: ${s.item.subject}. Pessoas e lugar reais, no país onde se conta «${title}».`,
        ),
      );
    }
    if (photos.length < 2) gaps.push({ key, title, country: country.name, found: photos.length });
    if (photos.length) manifest[key] = photos.slice(0, 2);
    if (n % 15 === 0) writeFileSync(MANIFEST, JSON.stringify(manifest));
    if (n % 40 === 0) console.log("tales", n, "with photos", Object.keys(manifest).length, "gaps", gaps.length);
  }
}

writeFileSync(MANIFEST, JSON.stringify(manifest));
writeFileSync(new URL("./living-gaps.json", import.meta.url), JSON.stringify(gaps, null, 2));
const full = Object.values(manifest).filter((p) => p.length >= 2).length;
console.log("done", "stories", Object.keys(manifest).length, "with 2 photos", full, "gaps", gaps.length);
