/**
 * Export the 168 country outfits that have no exact translation yet.
 * Usage: node scripts/i18n-export-outfits.mjs <locale>
 * Writes .i18n-work/<locale>/src-outfits.json  [{ id, kind, text }]
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const locale = process.argv[2] || "en-GB";
const contentSrc = readFileSync(join(ROOT, "src/i18n/content.ts"), "utf8");
const block = contentSrc.slice(contentSrc.indexOf("const OUTFITS"), contentSrc.indexOf("const PHRASES"));
const known = new Set([...block.matchAll(/^ {2}["'](.+?)["']:/gm)].map((m) => m[1]));

const countries = JSON.parse(readFileSync(join(ROOT, "src/data/countries.json"), "utf8"));
const seen = new Set();
const items = [];
for (const country of Object.values(countries)) {
  const outfit = country.outfit;
  if (!outfit || known.has(outfit) || seen.has(outfit)) continue;
  seen.add(outfit);
  items.push({ id: `outfit:${outfit}`, kind: "outfit", text: outfit });
}

const dir = join(ROOT, ".i18n-work", locale);
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "src-outfits.json"), JSON.stringify(items, null, 1));
console.log(locale, "outfits", items.length);
