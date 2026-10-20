/** Coverage of the three translated locales against the Portuguese source. */
import { createJiti } from "jiti";
import { readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { join } from "node:path";

const jiti = createJiti(import.meta.url);
const load = (path) => jiti.import(path instanceof URL ? path.href : path);

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
const all = Object.keys(LIBRARY);

async function loadLocale(dir) {
  const folder = join(storiesDir, "translations", dir);
  const files = readdirSync(folder).filter((f) => f.startsWith("part-") && f.endsWith(".ts"));
  const map = {};
  for (const file of files) {
    const mod = await load(pathToFileURL(join(folder, file)));
    Object.assign(map, mod.default ?? {});
  }
  return { map, files: files.length };
}

const report = { source: { tales: all.length } };
for (const [locale, dir] of [
  ["en-GB", "en-gb"],
  ["de-DE", "de-de"],
  ["fr-FR", "fr-fr"],
]) {
  const { map, files } = await loadLocale(dir);
  const done = all.filter((key) => Array.isArray(map[key]) && map[key].length === 5);
  const missing = all.filter((key) => !done.includes(key));
  report[locale] = {
    parts: files,
    translated: done.length,
    total: all.length,
    percent: Math.round((done.length / all.length) * 1000) / 10,
    missingSample: missing.slice(0, 8),
  };
}
console.log(JSON.stringify(report, null, 2));
