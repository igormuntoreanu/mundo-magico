import { readFileSync, existsSync } from "node:fs";
import sharp from "sharp";

const AFRICA = ["dz","ao","bj","bw","bf","bi","cm","cv","cf","td","km","cg","cd","ci","dj","eg","gq","er","sz","et","ga","gm","gh","gn","gw","ke","ls","lr","ly","mg","mw","ml","mr","mu","ma","mz","na","ne","ng","rw","st","sn","sc","sl","so","za","ss","sd","tz","tg","tn","ug","zm","zw"];

const countries = JSON.parse(readFileSync("src/data/countries.json", "utf8"));
const manifest = JSON.parse(readFileSync("src/data/city-photos.json", "utf8"));

let cities = 0, photos = 0, bad = 0;
const missing = [];
const seen = new Map();
const dups = [];
for (const iso of AFRICA) {
  const c = countries[iso];
  if (!c) continue;
  for (const row of c.cities || []) {
    cities++;
    const entry = manifest[iso]?.[row.city];
    if (!entry?.length) { missing.push(`${iso}|${row.city}`); continue; }
    for (const p of entry) {
      photos++;
      const f = "public" + p.src;
      if (!existsSync(f)) { bad++; missing.push(`${iso}|${row.city} file`); continue; }
      const meta = await sharp(f).metadata();
      if ((meta.width || 0) < 1600 || (meta.height || 0) > (meta.width || 0)) bad++;
      if (seen.has(p.href)) dups.push(`${iso}|${row.city}`); else seen.set(p.href, 1);
    }
  }
}
// Africa manifest entries not in countries data
const stray = Object.keys(manifest).filter((iso) => AFRICA.includes(iso) && !countries[iso]);
console.log(JSON.stringify({ cities, photos, bad, missing, dups, stray }, null, 2));
