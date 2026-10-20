/**
 * Per-country translation coverage report.
 * Writes TRANSLATION-REPORT.md and prints a JSON summary.
 */
import { createJiti } from "jiti";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
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

const LIBRARY = {
  ...featured.FEATURED_STORIES,
  ...europe.EUROPE_STORIES,
  ...americas.AMERICAS_STORIES,
  ...africa.AFRICA_STORIES,
  ...asia.ASIA_STORIES,
  ...full.FULL_STORIES,
};

const countries = JSON.parse(readFileSync(join(root, "src/data/countries.json"), "utf8"));
const worldMeta = JSON.parse(readFileSync(join(root, "src/data/world-meta.json"), "utf8"));
const nameOf = (iso) => countries[iso]?.name ?? worldMeta.names?.[iso] ?? iso.toUpperCase();

async function loadLocale(dir) {
  const folder = join(storiesDir, "translations", dir);
  const files = readdirSync(folder).filter((f) => f.startsWith("part-") && f.endsWith(".ts"));
  const map = {};
  for (const file of files) {
    const mod = await load(pathToFileURL(join(folder, file)));
    Object.assign(map, mod.default ?? {});
  }
  return map;
}

const localeMaps = {
  "en-GB": await loadLocale("en-gb"),
  "de-DE": await loadLocale("de-de"),
  "fr-FR": await loadLocale("fr-fr"),
};

const byIso = new Map();
for (const key of Object.keys(LIBRARY)) {
  const iso = key.split(":")[0];
  const entry = byIso.get(iso) ?? { iso, tales: 0, done: { "en-GB": 0, "de-DE": 0, "fr-FR": 0 } };
  entry.tales += 1;
  for (const locale of Object.keys(localeMaps)) {
    const pages = localeMaps[locale][key];
    if (Array.isArray(pages) && pages.length === 5) entry.done[locale] += 1;
  }
  byIso.set(iso, entry);
}

const rows = [...byIso.values()].sort((a, b) => a.iso.localeCompare(b.iso));
const isDone = (row, locale) => row.done[locale] === row.tales && row.tales > 0;
const remaining = (locale) =>
  rows.reduce((n, row) => n + (row.tales - row.done[locale]), 0);

const summary = {
  countries: rows.length,
  tales: Object.keys(LIBRARY).length,
  locales: {},
};
for (const locale of Object.keys(localeMaps)) {
  summary.locales[locale] = {
    remainingTales: remaining(locale),
    completeCountries: rows.filter((row) => isDone(row, locale)).length,
    untouchedCountries: rows.filter((row) => row.done[locale] === 0).length,
  };
}
summary.fullyCompleteCountries = rows.filter((row) =>
  Object.keys(localeMaps).every((locale) => isDone(row, locale)),
).length;
summary.untouchedEverywhere = rows
  .filter((row) => Object.values(row.done).every((n) => n === 0))
  .map((row) => row.iso);

const table = rows
  .map(
    (row) =>
      `| ${nameOf(row.iso)} | ${row.iso} | ${row.tales} | ${row.done["en-GB"]}/${row.tales} | ${row.done["de-DE"]}/${row.tales} | ${row.done["fr-FR"]}/${row.tales} |`,
  )
  .join("\n");

const md = `# Translation coverage by country

Generated ${new Date().toISOString().slice(0, 10)}.

- Tales in the Portuguese source: **${summary.tales}** across **${summary.countries}** countries.
- Countries complete in all three languages: **${summary.fullyCompleteCountries}**.
- Remaining tale-translations: en-GB **${summary.locales["en-GB"].remainingTales}**, de-DE **${summary.locales["de-DE"].remainingTales}**, fr-FR **${summary.locales["fr-FR"].remainingTales}**.

| Country | ISO | Tales | en-GB | de-DE | fr-FR |
| --- | --- | --- | --- | --- | --- |
${table}
`;

writeFileSync(join(root, "TRANSLATION-REPORT.md"), md);
console.log(JSON.stringify({ summary, report: "TRANSLATION-REPORT.md" }, null, 2));
