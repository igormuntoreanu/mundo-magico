Task: fill missing city photos for Mundo Mágico (or replace bad ones).

Default: **one-shot apply**. Do **not** wait for OK unless the user says `dry-run` / `review` / `wait`.
Budget: **one Commons round-trip per city, one image look per city, one script run**. A second look only if that file is a hard reject. Then ship or mark unresolved. Do not keep searching for a nicer frame.

CONTEXT
- Cities: src/data/countries.json → cities[] = { city, spots } (Portuguese landmarks).
  DO NOT edit countries.json or i18n.
- Photos: src/data/city-photos.json (iso → cityName → CityPhoto[]) + public/cities/<iso>/<slug>-0.jpg
- Helper: `node --experimental-strip-types scripts/fetch-city-photos.ts …`
  Name maps: scripts/city-photo-names-africa.mjs (Africa) or scripts/city-photo-names.mjs
- Overrides: scripts/city-photo-overrides.json  e.g. {"bj|Cotonu":"File:Example.jpg"}
  An override **skips vision inside the script**. You still look once yourself before writing it.

GOAL
One real, recognizable postcard per city. Prefer (in order): iconic landmark exterior, skyline/aerial, waterfront, famous building or square. Subject dominates the frame.

HARD REJECT (never ship)
- Forest canopy walks, random bridges, trails, nature-only with no place identity
- Interiors, courtyard close-ups, museum rooms
- Tiny distant landmark, dirt-lot foreground, power lines or construction as the subject
- Portraits, crowds of identifiable people, tourists blocking the landmark
- Maps, flags, logos, diagrams, stamps, night blur, heavy watermark or burned-in credit
- Wrong city / wrong country
- Title or description contains "satellite" (the script rejects it)

LICENSE / FILE (check this in text — do not download to find out)
JPEG only. CC0 / Public Domain / CC BY / CC BY-SA. Width ≥1600. Aspect width/height 0.85–2.4.
Caption EN: "<Landmark>, <City>, <Country>" — the first TOURIST_SEARCH_NAMES entry is that landmark.
credit: "Foto: <Author>. Wikimedia Commons, <License>."
href = Commons file page. Skip a file whose href is already in city-photos.json.

DO NOT (this is what made a 6-city batch take 20 minutes)
- Do not download or Read a contact sheet, a top-3, or a category listing.
- Do not paginate Category: members. Do not run a second search because the first legal file is "only okay".
- Do not Read the fetch script, rasterize flags, or re-judge a file already killed by metadata.
- Do not call the Commons API once per file. Batch every candidate title into **one** `prop=imageinfo` query.
- Do not run find, then judge, then apply as three commands. Overrides make judge a no-op.
- On PowerShell, quote the replace flag: `"--replace=iso|City"`. A bare `|` is a pipe.

FAST PATH
1. Skip any city that already has a photo, unless the user passed `--replace=iso|City` or the current file is a known hard reject (watermark, wrong country).
2. **Name maps before any search** (Africa: `scripts/city-photo-names-africa.mjs`, all three objects):
   - CITY_SEARCH_NAMES: Portuguese name → bare English label (`Cotonu`→`Cotonou`). Do **not** append the country.
   - TOURIST_SEARCH_NAMES: first string is the caption landmark (`Dakhla waterfront`).
   - CITY_TEXT_ALIASES: words that actually appear in the chosen file title, description, or categories.
   Generic names (`o mar`, `o deserto`, `um acampamento`) have no tokens of their own. The English label and aliases must occur in that file or the override dies with `qid image lacks gps and city metadata`.
   Do not edit `city-photo-spots-generated.mjs` when you are about to set an override.
3. **Pick one file from text, then stop.**
   - One Wikipedia lead image (`prop=pageimages`) for the English place, or one Commons search `srlimit=5` of the landmark. Not both, and not a follow-up query, unless every hit fails the gate below.
   - One batched imageinfo for the ISO: mime, size, LicenseShortName, ImageDescription, categories.
   - Keep the first hit that is JPEG, wide enough, right aspect, free license, names the place, and is not in the hard-reject word list.
4. **Look at that one file** (Special:FilePath width=900, Read it). Ship it if a tourist would recognize the place and no hard reject is visible. If it fails, look at the next metadata-legal hit. **Maximum two looks per city.** Then override or unresolved.
5. Write every override, then **one** run:
   `node --experimental-strip-types scripts/fetch-city-photos.ts --iso=<iso> --vision=agent`
   Add `"--replace=iso|City"` only for cities you are redoing. Add `--retry-unresolved` only if a previous run left the city unresolved.
6. If the script rejects an override, the reason is enough (empty `candidates` in `scripts/.candidates/<iso>.json`). Fix the file or the name-map tokens **once** and re-run that city only. Do not open a new search.

NO VISION AVAILABLE
If Read returns no picture, do not invent a verdict and do not say the batch was visually QA'd.
Ship a metadata-legal override whose title and description name the place, say it was metadata-only, and give the one-line swap (`override` + `--replace=iso|City`). Stats (sharp luminance, color share) may only reject a flat or blank file. They never justify a pass.

OUTPUT
Stdout from the script is the report: one `iso|city|ACCEPT/UNRESOLVED/SKIP|…` line and one totals line.
In the reply, list added / replaced / unresolved in a few lines. No play-by-play of rejected files.

QUALITY BAR
Good: landmark or skyline filling the frame; waterfront with the town; a named camp, river, or desert that is obviously that place.
Bad: gallery courtyard, canopy walk, portrait, night blur, logo watermark, satellite shot, dirt lot with the landmark in the distance.
Unresolved is cheaper than a second search. Prefer it over a hard reject.
