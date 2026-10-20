/** Inventory of every tale in the library, for translation coverage. */
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);
const load = (path) => jiti.import(new URL(path, import.meta.url).href);

const [featured, europe, americas, africa, asia, full] = await Promise.all([
  load("../src/data/stories/featured.ts"),
  load("../src/data/stories/europe.ts"),
  load("../src/data/stories/americas.ts"),
  load("../src/data/stories/africa.ts"),
  load("../src/data/stories/asia.ts"),
  load("../src/data/stories/full/index.ts"),
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
const pages = keys.reduce((n, key) => n + LIBRARY[key].length, 0);
const words = keys.reduce(
  (n, key) => n + LIBRARY[key].join(" ").split(/\s+/).filter(Boolean).length,
  0,
);
const byIso = new Map();
for (const key of keys) {
  const iso = key.split(":")[0];
  byIso.set(iso, (byIso.get(iso) ?? 0) + 1);
}
const bad = keys.filter((key) => LIBRARY[key].length !== 5);

console.log(
  JSON.stringify(
    {
      tales: keys.length,
      pages,
      words,
      countries: byIso.size,
      pagesPerTale: [...new Set(keys.map((k) => LIBRARY[k].length))],
      talesNotFivePages: bad,
      sampleKeys: keys.slice(0, 5),
    },
    null,
    2,
  ),
);
