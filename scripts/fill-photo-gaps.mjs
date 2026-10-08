/** Slower second pass for countries that still lack two festival photos. */
import { createWriteStream, readFileSync, writeFileSync, existsSync } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

const UA = "MundoMagicoFolkloreApp/1.0 (educational child folklore; public-photo gallery)";
const countries = JSON.parse(readFileSync(new URL("../src/data/countries.json", import.meta.url), "utf8"));
const cachePath = new URL("./country-photos.json", import.meta.url);
const cache = JSON.parse(readFileSync(cachePath, "utf8"));
const only = new Set((process.argv[2] || "").split(",").filter(Boolean));

function fold(s) {
  return String(s || "").normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
function strip(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/&/g, "&").replace(/\s+/g, " ").trim();
}
function licenseOk(short) {
  const s = fold(short);
  if (!s || s.includes("non-commercial") || s.includes("-nc") || s.includes("-nd")) return false;
  return /public domain|cc0|cc by|cc-by|gfdl|pdm/.test(s);
}
const BAD = /illustrat|drawing|painting|cartoon|logo|flag of|map of|diagram|flight attendant|airline|army|fireworks|reindeer|lasso|pumpkin|halloween|asean sport|first day in class|school class/;
const GOOD = /festival|festa|parade|desfile|carnaval|carnival|costume|traje|folclore|folklore|dance|danca|fiesta|procession|performance/;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function search(q, attempt = 0) {
  const u = new URL("https://commons.wikimedia.org/w/api.php");
  u.searchParams.set("action", "query");
  u.searchParams.set("format", "json");
  u.searchParams.set("generator", "search");
  u.searchParams.set("gsrsearch", `${q} filetype:bitmap`);
  u.searchParams.set("gsrnamespace", "6");
  u.searchParams.set("gsrlimit", "8");
  u.searchParams.set("prop", "imageinfo");
  u.searchParams.set("iiprop", "url|mime|extmetadata");
  u.searchParams.set("iiurlwidth", "1200");
  const res = await fetch(u, { headers: { "User-Agent": UA, "Api-User-Agent": UA } });
  if (res.status === 429 && attempt < 4) {
    await sleep(15000 * (attempt + 1));
    return search(q, attempt + 1);
  }
  if (!res.ok) throw new Error(`commons ${res.status}`);
  const json = await res.json();
  return Object.values(json.query?.pages || {});
}

async function download(url, dest, attempt = 0) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if ((res.status === 429 || res.status >= 500) && attempt < 4) {
    await sleep(12000 * (attempt + 1));
    return download(url, dest, attempt + 1);
  }
  if (!res.ok || !res.body) throw new Error(`download ${res.status}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
}

for (const [iso, country] of Object.entries(countries)) {
  if (only.size && !only.has(iso)) continue;
  if ((cache[iso] || []).length >= 2) continue;
  const alias = country.aliases?.[0] || country.name;
  const names = [country.name, ...(country.aliases || [])].map(fold).filter((s) => s.length >= 4);
  try {
    await sleep(8000);
    const pages = await search(`${alias} folklore festival`);
    const picks = [];
    for (const page of pages) {
      const info = page.imageinfo?.[0];
      if (!info || info.mime !== "image/jpeg") continue;
      const license = info.extmetadata?.LicenseShortName?.value || "";
      if (!licenseOk(license)) continue;
      const blob = fold(`${page.title} ${strip(info.extmetadata?.ImageDescription?.value)}`);
      if (BAD.test(blob) || !GOOD.test(blob)) continue;
      if (!names.some((n) => blob.includes(n))) continue;
      const subject = page.title.replace(/^File:/, "").replace(/\.[a-z0-9]+$/i, "").replace(/_/g, " ").slice(0, 88);
      picks.push({
        item: {
          title: page.title,
          license,
          artist: strip(info.extmetadata?.Artist?.value).slice(0, 90) || "autor não indicado",
          subject,
        },
        info,
      });
      if (picks.length === 2) break;
    }
    const saved = [];
    for (let i = 0; i < picks.length; i++) {
      const file = `${iso}-fest-${i === 0 ? "a" : "b"}.jpg`;
      const dest = new URL(`../public/stories/living/${file}`, import.meta.url);
      if (!existsSync(dest)) await download(picks[i].info.thumburl || picks[i].info.url, dest);
      saved.push({ item: picks[i].item, file });
    }
    if (saved.length) {
      cache[iso] = saved;
      writeFileSync(cachePath, JSON.stringify(cache));
      console.log("ok", iso, saved.length, saved.map((s) => s.item.subject).join(" | "));
    } else console.log("empty", iso);
  } catch (err) {
    console.log("fail", iso, err.message);
  }
}
console.log("gap pass done");
