/**
 * Structural and readability gate for translated tale parts.
 * Usage: node scripts/validate-translations.mjs [--strict]
 */
import { createJiti } from "jiti";
import { readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { join } from "node:path";

const jiti = createJiti(import.meta.url);
const load = (url) => jiti.import(url instanceof URL ? url.href : url);
const root = fileURLToPath(new URL("..", import.meta.url));
const storiesDir = join(root, "src/data/stories");

const [featured, europe, americas, africa, asia, full] = await Promise.all([
  load(pathToFileURL(join(storiesDir, "featured.ts"))),
  load(pathToFileURL(join(storiesDir, "europe.ts"))),
  load(pathToFileURL(join(storiesDir, "americas.ts"))),
  load(pathToFileURL(join(storiesDir, "africa.ts"))),
  load(pathToFileURL(join(storiesDir, "asia.ts"))),
  load(pathToFileURL(join(storiesDir, "full/index.ts"))),
]);

const SOURCE = {
  ...featured.FEATURED_STORIES,
  ...europe.EUROPE_STORIES,
  ...americas.AMERICAS_STORIES,
  ...africa.AFRICA_STORIES,
  ...asia.ASIA_STORIES,
  ...full.FULL_STORIES,
};

const PT_MARKERS = /\b(não|você|também|muito|ele|ela|está|estava|até|depois|porque|quando)\b/iu;
const errors = [];
const warnings = [];

for (const [locale, dir] of [
  ["en-GB", "en-gb"],
  ["de-DE", "de-de"],
  ["fr-FR", "fr-fr"],
]) {
  const folder = join(storiesDir, "translations", dir);
  const files = readdirSync(folder).filter((f) => f.startsWith("part-") && f.endsWith(".ts"));
  const seen = new Map();
  for (const file of files) {
    const mod = await load(pathToFileURL(join(folder, file)));
    const part = mod.default ?? {};
    for (const [key, pages] of Object.entries(part)) {
      if (seen.has(key)) errors.push(`${locale} ${key}: duplicate in ${file} and ${seen.get(key)}`);
      seen.set(key, file);
      if (!(key in SOURCE)) {
        errors.push(`${locale} ${key}: key not in the Portuguese library`);
        continue;
      }
      if (!Array.isArray(pages) || pages.length !== 5) {
        errors.push(`${locale} ${key}: expected 5 pages, got ${Array.isArray(pages) ? pages.length : typeof pages}`);
        continue;
      }
      let words = 0;
      pages.forEach((page, i) => {
        const text = String(page ?? "").trim();
        if (!text) {
          errors.push(`${locale} ${key}: page ${i + 1} is empty`);
          return;
        }
        const count = text.split(/\s+/).filter(Boolean).length;
        words += count;
        if (count < 40 || count > 130) {
          warnings.push(`${locale} ${key}: page ${i + 1} has ${count} words (target 60-110)`);
        }
        const norm = text
          .replace(/([.!?…])\s*["'”’»]+/g, "$1 ")
          .replace(/([.!?…])\s*["'‘“„«]+/g, " $1 ");
        const sentences = norm.split(/(?<=[.!?…])\s+/).map((s) => s.trim()).filter(Boolean);
        const longest = Math.max(0, ...sentences.map((s) => s.split(/\s+/).filter(Boolean).length));
        if (longest > 20) errors.push(`${locale} ${key}: page ${i + 1} has a ${longest}-word sentence (max 20)`);
        if (locale !== "pt-BR" && PT_MARKERS.test(text)) {
          warnings.push(`${locale} ${key}: page ${i + 1} contains a Portuguese-looking word`);
        }
      });
      if (words < 240 || words > 640) {
        warnings.push(`${locale} ${key}: ${words} words total (target 300-550)`);
      }
    }
  }
}

const strict = process.argv.includes("--strict");
const summary = {
  errors: errors.length,
  warnings: warnings.length,
  errorSample: errors.slice(0, 20),
  warningSample: warnings.slice(0, 20),
};
console.log(JSON.stringify(summary, null, 2));
if (errors.length > 0 || (strict && warnings.length > 0)) process.exit(1);
