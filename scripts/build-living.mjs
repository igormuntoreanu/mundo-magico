/** Build living.json from cached country festival photos. Honest captions. */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const countries = JSON.parse(readFileSync(new URL("../src/data/countries.json", import.meta.url), "utf8"));
const cache = JSON.parse(readFileSync(new URL("./country-photos.json", import.meta.url), "utf8"));
const BAD = /flight attendant|garuda indonesia|army band|fireworks|reindeer racing|lasso practice|pumpkin fest|halloween|asean sport|christmas boat|airline|photowalk/i;

function href(title) {
  return `https://commons.wikimedia.org/wiki/${encodeURIComponent(String(title).replace(/ /g, "_"))}`;
}

const manifest = {};
let full = 0;
let missing = 0;
for (const [iso, country] of Object.entries(countries)) {
  const photos = (cache[iso] || [])
    .filter((row) => row?.item && row.file && existsSync(new URL(`../public/stories/living/${row.file}`, import.meta.url)))
    .filter((row) => !BAD.test(`${row.item.subject} ${row.item.title}`));
  country.tales.forEach((title, index) => {
    const picked = photos.slice(0, 2).map((row) => ({
      src: `/stories/living/${row.file}`,
      caption: `${country.name}: ${row.item.subject}. Fotografia pública de uma festa tradicional, no país onde se conta «${title}».`,
      credit: `Fotografia pública de ${row.item.artist}. Wikimedia Commons, ${row.item.license}.`,
      href: href(row.item.title),
      kind: "photo",
    }));
    if (picked.length >= 2) full += 1;
    else missing += 1;
    if (picked.length) manifest[`${iso}:${index}`] = picked;
  });
}
writeFileSync(new URL("../src/data/stories/living.json", import.meta.url), JSON.stringify(manifest));
console.log("stories with 2", full, "short", missing, "keys", Object.keys(manifest).length);
