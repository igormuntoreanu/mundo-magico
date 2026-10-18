import { readdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";

async function loadTs(rel) {
  return import(new URL(`../${rel}`, import.meta.url).href);
}

const [
  { AFRICA_STORIES },
  { AMERICAS_STORIES },
  { ASIA_STORIES },
  { EUROPE_STORIES },
  { FEATURED_STORIES },
  { FULL_STORIES },
] = await Promise.all([
  loadTs("src/data/stories/africa.ts"),
  loadTs("src/data/stories/americas.ts"),
  loadTs("src/data/stories/asia.ts"),
  loadTs("src/data/stories/europe.ts"),
  loadTs("src/data/stories/featured.ts"),
  loadTs("src/data/stories/full/index.ts"),
]);

const LIBRARY = {
  ...FEATURED_STORIES,
  ...EUROPE_STORIES,
  ...AMERICAS_STORIES,
  ...AFRICA_STORIES,
  ...ASIA_STORIES,
  ...FULL_STORIES,
};

const countries = JSON.parse(readFileSync(new URL("../src/data/countries.json", import.meta.url), "utf8"));
const nameByIso = {};
for (const [k, v] of Object.entries(countries)) {
  nameByIso[(v.iso || k).toLowerCase()] = v.name || k;
  // also keep tale titles for reporting
  nameByIso[`tales:${(v.iso || k).toLowerCase()}`] = v.tales || [];
}

const pagesDir = new URL("../public/stories/pages", import.meta.url);
const existing = new Set(
  existsSync(pagesDir)
    ? readdirSync(pagesDir)
        .filter((f) => f.endsWith(".jpg"))
        .map((f) => f.replace(/\.jpg$/, ""))
    : [],
);

const byIso = new Map();

for (const [key, pages] of Object.entries(LIBRARY)) {
  const [iso, taleStr] = key.split(":");
  const taleIndex = Number(taleStr);
  if (!pages?.length) continue;
  if (!byIso.has(iso)) {
    byIso.set(iso, {
      iso,
      name: nameByIso[iso] || iso,
      taleTitles: nameByIso[`tales:${iso}`] || [],
      tales: 0,
      pages: 0,
      have: 0,
      missing: 0,
      missingScenes: [],
      completeTales: 0,
      emptyTales: 0,
      partialTales: 0,
      taleStatus: [],
    });
  }
  const c = byIso.get(iso);
  c.tales += 1;
  c.pages += pages.length;
  let taleHave = 0;
  const missingInTale = [];
  for (let i = 0; i < pages.length; i++) {
    const scene = `${iso}-${taleIndex}-${i}`;
    if (existing.has(scene)) {
      c.have += 1;
      taleHave += 1;
    } else {
      c.missing += 1;
      c.missingScenes.push(scene);
      missingInTale.push(i);
    }
  }
  const title = c.taleTitles[taleIndex] || `tale ${taleIndex}`;
  let status = "empty";
  if (taleHave === pages.length) {
    c.completeTales += 1;
    status = "complete";
  } else if (taleHave === 0) {
    c.emptyTales += 1;
    status = "empty";
  } else {
    c.partialTales += 1;
    status = "partial";
  }
  c.taleStatus.push({
    index: taleIndex,
    title,
    pages: pages.length,
    have: taleHave,
    missing: missingInTale,
    status,
  });
}

const all = [...byIso.values()].sort((a, b) => a.name.localeCompare(b.name, "pt"));
const withoutAny = all.filter((c) => c.have === 0);
const partial = all.filter((c) => c.have > 0 && c.missing > 0);
const complete = all.filter((c) => c.missing === 0);

const report = {
  totals: {
    countriesWithStories: all.length,
    complete: complete.length,
    partial: partial.length,
    withoutAny: withoutAny.length,
    imageFiles: existing.size,
    expectedPages: all.reduce((s, c) => s + c.pages, 0),
    havePages: all.reduce((s, c) => s + c.have, 0),
    missingPages: all.reduce((s, c) => s + c.missing, 0),
  },
  complete: complete.map((c) => ({ iso: c.iso, name: c.name, tales: c.tales, pages: c.pages })),
  partial: partial.map((c) => ({
    iso: c.iso,
    name: c.name,
    tales: c.tales,
    pages: c.pages,
    have: c.have,
    missing: c.missing,
    completeTales: c.completeTales,
    emptyTales: c.emptyTales,
    partialTales: c.partialTales,
    taleStatus: c.taleStatus.filter((t) => t.status !== "complete"),
  })),
  withoutAny: withoutAny.map((c) => ({
    iso: c.iso,
    name: c.name,
    tales: c.tales,
    pages: c.pages,
  })),
};

writeFileSync(new URL("../scripts/audit-story-images.json", import.meta.url), JSON.stringify(report, null, 2));
process.stdout.write(
  JSON.stringify(
    {
      totals: report.totals,
      completeIsos: report.complete.map((c) => c.iso),
      partialCount: report.partial.length,
      withoutAnyCount: report.withoutAny.length,
      withoutAnyNames: report.withoutAny.map((c) => `${c.name} (${c.iso})`),
      partialSummary: report.partial.map(
        (c) => `${c.name} (${c.iso}): ${c.have}/${c.pages} pages, emptyTales=${c.emptyTales}, partialTales=${c.partialTales}`,
      ),
    },
    null,
    2,
  ),
);
