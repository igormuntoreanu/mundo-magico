/**
 * Merge per-country dish fragments into the three canonical data files.
 *
 * A fragment is written by a worker that has already chosen and eye-checked
 * photos for one country:
 *
 *   {
 *     "iso": "de",
 *     "dishes": [
 *       {
 *         "slug": "sauerbraten",
 *         "plated": true,
 *         "name": { "pt-BR": "...", "en-GB": "...", "de-DE": "...", "fr-FR": "..." },
 *         "note": { "pt-BR": "...", "en-GB": "...", "de-DE": "...", "fr-FR": "..." },
 *         "picks": ["File:...jpg"]
 *       }
 *     ]
 *   }
 *
 * It is merged into src/data/dish-copy.json (name/note/plated) and
 * scripts/dish-picks.json (Commons titles). Nothing else is written; the photos
 * themselves are downloaded later by fetch-dish-photos.mjs --apply.
 *
 * Usage: node scripts/merge-dish-fragments.mjs [--dry]
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const FRAGMENTS = join(ROOT, "scripts", "fragments");
const COPY = join(ROOT, "src", "data", "dish-copy.json");
const PICKS = join(ROOT, "scripts", "dish-picks.json");
const SOURCES = join(ROOT, "scripts", "dish-sources.json");
const LOCALES = ["pt-BR", "en-GB", "de-DE", "fr-FR"];
const dry = process.argv.includes("--dry");

/**
 * Workers on Windows sometimes save their fragment through PowerShell, which
 * reads UTF-8 as CP1252 and writes it back as UTF-8: "PastÃ©is" becomes
 * "PastÃƒÂ©is". Reverse exactly one layer when the markers are present.
 */
const CP1252 = {
  0x80: "\u20AC", 0x82: "\u201A", 0x83: "\u0192", 0x84: "\u201E", 0x85: "\u2026",
  0x86: "\u2020", 0x87: "\u2021", 0x88: "\u02C6", 0x89: "\u2030", 0x8A: "\u0160",
  0x8B: "\u2039", 0x8C: "\u0152", 0x8E: "\u017D", 0x91: "\u2018", 0x92: "\u2019",
  0x93: "\u201C", 0x94: "\u201D", 0x95: "\u2022", 0x96: "\u2013", 0x97: "\u2014",
  0x98: "\u02DC", 0x99: "\u2122", 0x9A: "\u0161", 0x9B: "\u203A", 0x9C: "\u0153",
  0x9E: "\u017E", 0x9F: "\u0178",
};
const reverse = new Map(Object.entries(CP1252).map(([byte, ch]) => [ch, Number(byte)]));

function repairMojibake(text) {
  if (!/[\u00C2\u00C3]/.test(text)) return text;
  const bytes = [];
  for (const ch of text) {
    if (reverse.has(ch)) bytes.push(reverse.get(ch));
    else if (ch.codePointAt(0) <= 0xff) bytes.push(ch.codePointAt(0));
    else return text; // mixed content, leave as is
  }
  const decoded = Buffer.from(bytes).toString("utf8");
  return decoded.includes("\uFFFD") ? text : decoded;
}

function readJson(path) {
  return JSON.parse(repairMojibake(readFileSync(path, "utf8").replace(/^\uFEFF/, "")));
}

if (!existsSync(FRAGMENTS)) {
  console.log("no scripts/fragments directory");
  process.exit(0);
}

const copy = readJson(COPY);
const picks = readJson(PICKS);
const sources = existsSync(SOURCES) ? readJson(SOURCES) : {};

const problems = [];
const merged = [];

for (const file of readdirSync(FRAGMENTS).filter(
  (f) => f.endsWith(".json") && !f.endsWith(".sources.json"),
)) {
  const path = join(FRAGMENTS, file);
  let fragment;
  try {
    fragment = readJson(path);
  } catch (err) {
    problems.push(`${file}: invalid JSON (${err.message})`);
    continue;
  }
  const iso = fragment.iso;
  if (!/^[a-z]{2}$/.test(iso ?? "")) {
    problems.push(`${file}: bad iso "${iso}"`);
    continue;
  }
  if (copy[iso]) {
    merged.push({ iso, note: "already merged, skipped" });
    continue;
  }
  const dishes = Array.isArray(fragment.dishes) ? fragment.dishes : [];
  if (!dishes.length) {
    problems.push(`${file}: no dishes`);
    continue;
  }
  if (dishes.length > 3) {
    problems.push(`${file}: ${dishes.length} dishes, keep at most 3`);
    continue;
  }
  const clean = [];
  const pickMap = {};
  let bad = false;
  for (const dish of dishes) {
    const slug = String(dish.slug ?? "").trim();
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
      problems.push(`${file}: bad slug "${slug}"`);
      bad = true;
      break;
    }
    const missingLocale = LOCALES.filter((l) => !String(dish.name?.[l] ?? "").trim());
    if (missingLocale.length) {
      problems.push(`${file}/${slug}: name missing ${missingLocale.join(", ")}`);
      bad = true;
      break;
    }
    const missingNote = LOCALES.filter((l) => !String(dish.note?.[l] ?? "").trim());
    if (missingNote.length) {
      problems.push(`${file}/${slug}: note missing ${missingNote.join(", ")}`);
      bad = true;
      break;
    }
    if (String(dish.note["en-GB"]).length < 15) {
      problems.push(`${file}/${slug}: note looks empty`);
      bad = true;
      break;
    }
    const dishPicks = (dish.picks ?? []).filter(Boolean);
    if (!dishPicks.length) {
      problems.push(`${file}/${slug}: no picks`);
      bad = true;
      break;
    }
    clean.push({
      slug,
      plated: Boolean(dish.plated),
      name: Object.fromEntries(LOCALES.map((l) => [l, dish.name[l]])),
      note: Object.fromEntries(LOCALES.map((l) => [l, dish.note[l]])),
    });
    pickMap[slug] = dishPicks;
  }
  if (bad) continue;
  copy[iso] = clean;
  picks[iso] = pickMap;

  // Keep the search registry in step, so a later candidate run for this
  // country still works. Fall back to slug-only entries when the worker did
  // not leave a sources fragment.
  const sourcesFile = join(FRAGMENTS, file.replace(/\.json$/, ".sources.json"));
  const workerSources = existsSync(sourcesFile) ? readJson(sourcesFile)[iso] : null;
  sources[iso] = clean.map((dish) => {
    const found = (workerSources ?? []).find((item) => item.slug === dish.slug);
    return { slug: dish.slug, search: found?.search ?? [] };
  });

  merged.push({ iso, note: `${clean.length} dish(es)` });
}

if (!dry) {
  writeFileSync(COPY, `${JSON.stringify(copy, null, 2)}\n`);
  writeFileSync(PICKS, `${JSON.stringify(picks, null, 2)}\n`);
  writeFileSync(SOURCES, `${JSON.stringify(sources, null, 2)}\n`);
}

for (const item of merged) console.log(`${item.iso}: ${item.note}`);
for (const problem of problems) console.log(`PROBLEM ${problem}`);
console.log(
  `merged ${merged.filter((m) => !m.note.startsWith("already")).length} country file(s), ${problems.length} problem(s)${dry ? " (dry run)" : ""}`,
);
if (problems.length) process.exitCode = 1;

