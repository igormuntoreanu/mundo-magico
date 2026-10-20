/**
 * Top-100 translation status and next slice.
 * Usage: node scripts/priority-batch.mjs [--locale en-GB] [--limit 15]
 */
import { createJiti } from "jiti";
import { readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { join } from "node:path";

const jiti = createJiti(import.meta.url);
const load = (url) => jiti.import(url instanceof URL ? url.href : url);
const root = fileURLToPath(new URL("..", import.meta.url));
const dir = join(root, "src/data/stories/translations");

const top = await load(pathToFileURL(join(root, "src/data/top-fables.ts")));
const topKeys = top.TOP_FABLES.map((entry) => `${entry.iso}:${entry.taleIndex}`);

const args = process.argv.slice(2);
const onlyLocale = args.includes("--locale") ? args[args.indexOf("--locale") + 1] : null;
const limit = args.includes("--limit") ? Number(args[args.indexOf("--limit") + 1]) : 15;

async function loadLocale(folder) {
  const map = {};
  for (const file of readdirSync(join(dir, folder)).filter((f) => f.startsWith("part-") && f.endsWith(".ts"))) {
    const mod = await load(pathToFileURL(join(dir, folder, file)));
    Object.assign(map, mod.default ?? {});
  }
  return map;
}

const locales = [
  ["en-GB", "en-gb"],
  ["de-DE", "de-de"],
  ["fr-FR", "fr-fr"],
];
const report = {};
for (const [locale, folder] of locales) {
  if (onlyLocale && onlyLocale !== locale) continue;
  const map = await loadLocale(folder);
  const missing = topKeys.filter((key) => !(Array.isArray(map[key]) && map[key].length === 5));
  report[locale] = {
    translated: topKeys.length - missing.length,
    total: topKeys.length,
    next: missing.slice(0, limit),
    command: missing.length
      ? `node scripts/stories-dump.mjs --keys ${missing.slice(0, limit).join(",")}`
      : null,
  };
}

if (!onlyLocale) {
  const md = `# Top 100 fables — translation status

| Locale | Translated | Remaining |
| --- | --- | --- |
${Object.entries(report)
  .map(([locale, r]) => `| ${locale} | ${r.translated}/100 | ${r.total - r.translated} |`)
  .join("\n")}
`;
  writeFileSync(join(root, "TOP100-STATUS.md"), md);
}
console.log(JSON.stringify(report, null, 2));
