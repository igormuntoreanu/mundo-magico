/**
 * Readability audit for translated pages.
 * Writes QUALITY-REPORT.md and prints a JSON summary.
 */
import { createJiti } from "jiti";
import { readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { join } from "node:path";

const jiti = createJiti(import.meta.url);
const load = (url) => jiti.import(url instanceof URL ? url.href : url);
const root = fileURLToPath(new URL("..", import.meta.url));
const dir = join(root, "src/data/stories/translations");

const sentences = (text) =>
  text
    .split(/[.!?…]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.split(/\s+/).filter(Boolean).length);

const longSentences = [];
const outOfBand = [];
const shortTales = [];
const stats = {};

for (const [locale, folder] of [
  ["en-GB", "en-gb"],
  ["de-DE", "de-de"],
  ["fr-FR", "fr-fr"],
]) {
  const files = readdirSync(join(dir, folder)).filter((f) => f.startsWith("part-") && f.endsWith(".ts"));
  let pages = 0;
  let words = 0;
  let maxSentence = 0;
  for (const file of files) {
    const mod = await load(pathToFileURL(join(dir, folder, file)));
    for (const [key, pageTexts] of Object.entries(mod.default ?? {})) {
      if (!Array.isArray(pageTexts) || pageTexts.length !== 5) continue;
      let total = 0;
      pageTexts.forEach((text, i) => {
        pages += 1;
        const count = String(text).split(/\s+/).filter(Boolean).length;
        words += count;
        total += count;
        if (count < 60 || count > 110) outOfBand.push({ locale, key, page: i + 1, words: count });
        const lens = sentences(String(text));
        const longest = Math.max(0, ...lens);
        maxSentence = Math.max(maxSentence, longest);
        if (longest > 20) longSentences.push({ locale, key, page: i + 1, words: longest });
      });
      if (total < 280) shortTales.push({ locale, key, words: total });
    }
  }
  stats[locale] = { pages, words, maxSentence, longSentences: longSentences.filter((x) => x.locale === locale).length };
}

longSentences.sort((a, b) => b.words - a.words);
const top = longSentences.slice(0, 25);

const md = `# Translation quality report

Generated ${new Date().toISOString().slice(0, 10)}.

| Locale | Pages | Words | Longest sentence | Sentences over 20 words |
| --- | --- | --- | --- | --- |
${Object.entries(stats)
  .map(([locale, s]) => `| ${locale} | ${s.pages} | ${s.words} | ${s.maxSentence} | ${s.longSentences} |`)
  .join("\n")}

Pages outside the 60–110 word band: **${outOfBand.length}**.
Tales under 280 words total: **${shortTales.length}**.

## Longest sentences (top ${top.length})

| Locale | Tale | Page | Words |
| --- | --- | --- | --- |
${top.map((x) => `| ${x.locale} | ${x.key} | ${x.page} | ${x.words} |`).join("\n")}
`;

writeFileSync(join(root, "QUALITY-REPORT.md"), md);
console.log(JSON.stringify({ stats, outOfBand: outOfBand.length, shortTales: shortTales.length, top }, null, 2));
