/**
 * Browser check for the dishes section, one country per ISO code.
 *
 *   node scripts/dish-qa.mjs za,so,zm
 *
 * Opens the app, selects each country by its exact name, scrolls the dishes
 * section into view and reports the card count and how many images loaded.
 * Any console error or a mismatch marks the run as failed.
 */
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const meta = JSON.parse(readFileSync("src/data/world-meta.json", "utf8"));
const rich = JSON.parse(readFileSync("src/data/countries.json", "utf8"));
const copy = JSON.parse(readFileSync("src/data/dish-copy.json", "utf8"));
const photos = JSON.parse(readFileSync("src/data/dish-photos.json", "utf8"));
const americanDishes = new Set(
  [
    "br", "ar", "bo", "cl", "co", "ec", "pe", "uy", "ve", "py", "bz", "cr",
    "sv", "gt", "hn", "ni", "pa", "ca", "mx", "us",
  ],
);
const nameOf = (iso) => rich[iso]?.name ?? meta.names?.[iso] ?? iso;
const expectedDishes = (iso) => {
  if (copy[iso]) return copy[iso].length;
  return americanDishes.has(iso) ? null : 0;
};

const isos = (process.argv[2] ?? "").split(",").filter(Boolean);
if (!isos.length) {
  console.log("usage: node scripts/dish-qa.mjs za,so,zm");
  process.exit(1);
}

const browser = await chromium.launch();
const errors = [];
let bad = 0;

for (const iso of isos) {
  const name = nameOf(iso);
  const expected = expectedDishes(iso);
  const context = await browser.newContext({ viewport: { width: 1400, height: 950 } });
  const page = await context.newPage();
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(iso + ": " + m.text());
  });
  page.on("pageerror", (e) => errors.push(iso + ": " + e.message));
  await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
  const input = page.getByRole("textbox").first();
  await input.click();
  await input.fill(name);
  await page.waitForTimeout(500);
  const option = page
    .getByRole("button", { name: new RegExp("^" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$") })
    .first();
  if (!(await option.count())) {
    console.log("NO OPTION", iso, name);
    bad++;
    await context.close();
    continue;
  }
  await option.click({ timeout: 8000 });
  await page.locator("aside h2").first().waitFor({ timeout: 15000 });
  await page.waitForTimeout(1200);
  await page.evaluate(() => {
    const heading = [...document.querySelectorAll("aside h3")].find((h) =>
      (h.textContent || "").includes("Pratos"),
    );
    heading?.closest("section")?.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(1200);
  const info = await page.evaluate(() => {
    const heading = [...document.querySelectorAll("aside h3")].find((h) =>
      (h.textContent || "").includes("Pratos"),
    );
    const section = heading?.closest("section");
    const cards = section ? [...section.querySelectorAll("li")] : [];
    return {
      country: document.querySelector("aside h2")?.textContent?.trim(),
      count: cards.length,
      loaded: cards.filter((li) => {
        const img = li.querySelector("img");
        return img && img.complete && img.naturalWidth > 0;
      }).length,
      names: cards.map((li) => li.querySelector("p.font-display")?.textContent?.trim()),
    };
  });
  const manifestCount = photos[iso] ? Object.keys(photos[iso]).length : 0;
  const ok =
    info.country === name &&
    info.count === info.loaded &&
    info.count === manifestCount &&
    (expected === null || info.count === expected);
  if (!ok) bad++;
  console.log(
    (ok ? "OK  " : "FAIL"),
    iso,
    "->",
    info.country,
    info.count + " cards,",
    info.loaded,
    "loaded, manifest",
    manifestCount,
    JSON.stringify(info.names),
  );
  await context.close();
}

console.log("bad:", bad, "| console errors:", errors.length ? JSON.stringify(errors.slice(0, 5)) : "none");
await browser.close();
process.exitCode = bad ? 1 : 0;
