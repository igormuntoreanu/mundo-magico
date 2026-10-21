/**
 * Export the untranslated country-panel strings into chunk files for translation.
 * Usage: node scripts/i18n-export.mjs <locale>
 * Writes .i18n-work/<locale>/src-NN.json  [{ id, kind, text }]
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const locale = process.argv[2] || "en-GB";
const CHUNK = 240;

const contentSrc = readFileSync(join(ROOT, "src/i18n/content.ts"), "utf8");
const talesBlock = contentSrc.slice(contentSrc.indexOf("const TALES"), contentSrc.indexOf("const OUTFITS"));
const known = new Set([...talesBlock.matchAll(/^ {2}["'](.+?)["']:/gm)].map((m) => m[1]));

const countries = JSON.parse(readFileSync(join(ROOT, "src/data/countries.json"), "utf8"));
const items = [];
const seenTale = new Set();
for (const [iso, country] of Object.entries(countries)) {
  for (const title of country.tales || []) {
    if (known.has(title) || seenTale.has(title)) continue;
    seenTale.add(title);
    items.push({ id: `tale:${title}`, kind: "tale", text: title });
  }
  for (const row of country.cities || []) {
    items.push({ id: `city:${iso}|${row.city}`, kind: "city", text: row.city });
    items.push({ id: `spots:${iso}|${row.city}`, kind: "spots", text: row.spots || "" });
  }
}

const dir = join(ROOT, ".i18n-work", locale);
mkdirSync(dir, { recursive: true });
let n = 0;
for (let i = 0; i < items.length; i += CHUNK) {
  n += 1;
  writeFileSync(join(dir, `src-${String(n).padStart(2, "0")}.json`), JSON.stringify(items.slice(i, i + CHUNK), null, 1));
}
console.log(locale, "strings", items.length, "chunks", n);
