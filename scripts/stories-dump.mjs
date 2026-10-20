/** Dump a slice of the tale library as JSON, for translation batches. */
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

const args = process.argv.slice(2);
function arg(name, fallback) {
  const i = args.indexOf(name);
  return i >= 0 ? Number(args[i + 1]) : fallback;
}
const keysArg = args.indexOf("--keys") >= 0 ? args[args.indexOf("--keys") + 1] : "";
const start = arg("--start", 0);
const count = arg("--count", 15);
const keys = keysArg
  ? keysArg.split(",").map((key) => key.trim()).filter(Boolean)
  : Object.keys(LIBRARY).slice(start, start + count);
const unknown = keys.filter((key) => !(key in LIBRARY));
if (unknown.length > 0) {
  console.error(`Unknown keys: ${unknown.join(", ")}`);
  process.exit(1);
}
const batch = Object.fromEntries(keys.map((key) => [key, LIBRARY[key]]));

console.log(
  JSON.stringify(
    {
      totalTales: Object.keys(LIBRARY).length,
      start,
      count: keys.length,
      firstKey: keys[0],
      lastKey: keys[keys.length - 1],
      tales: batch,
    },
    null,
    2,
  ),
);
