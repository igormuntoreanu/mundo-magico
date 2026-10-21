/**
 * Merge translated chunks into src/data/i18n-country.json.
 * Usage: node scripts/i18n-merge.mjs [locale ...]
 * Reads .i18n-work/<locale>/out-*.json  [{ id, text }]
 * Writes { "<locale>": { tales: {...}, cities: {...}, spots: {...} } }
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT = join(ROOT, "src", "data", "i18n-country.json");
const locales = process.argv.slice(2);
const all = ["en-GB", "de-DE", "fr-FR"].filter((l) => !locales.length || locales.includes(l));

const merged = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
for (const locale of all) {
  const dir = join(ROOT, ".i18n-work", locale);
  if (!existsSync(dir)) continue;
  const bucket = merged[locale] || { tales: {}, cities: {}, spots: {} };
  let count = 0;
  for (const file of readdirSync(dir).filter((f) => /^out-.+\.json$/.test(f))) {
    const rows = JSON.parse(readFileSync(join(dir, file), "utf8").replace(/^\uFEFF/, ""));
    for (const { id, text } of rows) {
      const value = String(text ?? "").trim();
      if (!value) continue;
      const [kind, key] = [id.slice(0, id.indexOf(":")), id.slice(id.indexOf(":") + 1)];
      if (kind === "tale") bucket.tales[key] = value;
      else if (kind === "city") bucket.cities[key] = value;
      else if (kind === "spots") bucket.spots[key] = value;
      else if (kind === "outfit") {
        bucket.outfits = bucket.outfits || {};
        bucket.outfits[key] = value;
      }
      count += 1;
    }
  }
  merged[locale] = bucket;
  console.log(locale, "entries", count, "total tales", Object.keys(bucket.tales).length,
    "cities", Object.keys(bucket.cities).length, "spots", Object.keys(bucket.spots).length);
}
writeFileSync(OUT, `${JSON.stringify(merged, null, 1)}\n`);
console.log("wrote", OUT);
