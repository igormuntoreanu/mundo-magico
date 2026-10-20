/**
 * Print the next untranslated slice for a locale.
 * Usage: node scripts/next-batch.mjs --locale en-GB --size 10
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

const LIBRARY = {
  ...featured.FEATURED_STORIES,
  ...europe.EUROPE_STORIES,
  ...americas.AMERICAS_STORIES,
  ...africa.AFRICA_STORIES,
  ...asia.ASIA_STORIES,
  ...full.FULL_STORIES,
};
const keys = Object.keys(LIBRARY);

const args = process.argv.slice(2);
const locale = args[args.indexOf("--locale") + 1];
const size = Number(args[args.indexOf("--size") + 1] || 10);
const dirs = { "en-GB": "en-gb", "de-DE": "de-de", "fr-FR": "fr-fr" };
const dir = dirs[locale];
if (!dir) {
  console.error("Usage: node scripts/next-batch.mjs --locale en-GB --size 10");
  process.exit(2);
}

const folder = join(storiesDir, "translations", dir);
const files = readdirSync(folder).filter((f) => f.startsWith("part-") && f.endsWith(".ts"));
const done = new Set();
for (const file of files) {
  const mod = await load(pathToFileURL(join(folder, file)));
  for (const key of Object.keys(mod.default ?? {})) done.add(key);
}

const start = keys.findIndex((key) => !done.has(key));
if (start < 0) {
  console.log(JSON.stringify({ locale, complete: true }, null, 2));
  process.exit(0);
}
const slice = [];
for (let i = start; i < keys.length && slice.length < size; i++) {
  if (!done.has(keys[i])) slice.push(keys[i]);
}
console.log(
  JSON.stringify(
    {
      locale,
      start,
      count: slice.length,
      firstKey: slice[0],
      lastKey: slice[slice.length - 1],
      keys: slice,
      command: `node scripts/stories-dump.mjs --start ${start} --count ${slice.length}`,
    },
    null,
    2,
  ),
);
