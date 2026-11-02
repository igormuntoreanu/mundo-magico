Task: fill missing city photos for Mundo Mágico (or replace bad ones).

Default: **one-shot apply** (find → judge → apply). Do **not** wait for OK unless the user says `dry-run` / `review` / `wait`.
Ship good postcards fast; use overrides when you already know a strong Commons file.

CONTEXT
- Cities: src/data/countries.json → cities[] = { city, spots } (Portuguese landmarks).
  DO NOT edit countries.json or i18n.
- Photos: src/data/city-photos.json (iso → cityName → CityPhoto[]) + public/cities/<iso>/<slug>-0.jpg
- Helper: `node --experimental-strip-types scripts/fetch-city-photos.ts …`
  Name maps: scripts/city-photo-names.mjs + scripts/city-photo-spots-generated.mjs
- Overrides: scripts/city-photo-overrides.json  e.g. {"bj|Cotonu":"File:Example.jpg"}

GOAL
One real, recognizable postcard per city: a tourist would instantly know the place.
Prefer (in order): iconic landmark exterior, city skyline/aerial, waterfront/marina/beach,
famous building or square. Subject must dominate the frame.

HARD REJECT (never ship)
- Forest canopy walks, random bridges, trails, nature-only with no city identity
- Gallery interiors, courtyard sculpture close-ups, museum rooms
- Tiny distant landmark with dirt lots, power lines, construction clutter
- Portraits / tourists blocking the landmark, crowds of identifiable people
- Maps, flags, logos, diagrams, stamps, night blur, heavy watermark
- Wrong city / wrong country (same-name places)

LICENSE / OUTPUT FILE
CC0 / Public Domain / CC BY / CC BY-SA only. Width ≥1600. Landscape/near-square.
Download → sharp resize max 1600px JPEG ~82 → public/cities/<iso>/<slug>-0.jpg
Caption EN: "<Landmark or place>, <City>, <Country>"
credit: "Foto: <Author>. Wikimedia Commons, <License>."
href = Commons file page; kind "photo"; objectPosition "center" (or "top" for tall landmarks)

WHY FIND IS SLOW (avoid repeat work)
- Find hammers Wikidata/Commons with sleeps; empty/wrong name maps = wasted full find.
- Apply alone is fast once candidates + verdicts/overrides exist.
- Agent vision one-file-at-a-time (throw → rewrite → re-judge) is the other time sink.

FAST PATH (do this every batch)
1. **Name maps BEFORE find** (mandatory for the ISO):
   - CITY_SEARCH_NAMES: Portuguese app name → bare English Wikidata label
     (e.g. Cotonu→Cotonou, Ganvié→Ganvie). Do **not** append the country
     ("Cotonou Benin" often returns zero Wikidata hits).
   - TOURIST_SEARCH_NAMES: 3–5 iconic English landmarks; put the intended postcard subject first
     (first spot becomes override caption landmark).
   - CITY_TEXT_ALIASES as needed (Cotonou, Porto Novo, Lake Nokoué…).
   - Optionally refresh GENERATED_SPOT_NAMES English spots for that ISO.
2. **Overrides first when you know a File:** title (skips vision; still needs find/apply for that key).
   Prefer override over hoping rank-1 passes. Write overrides **before** find when possible.
3. **One find**: `--iso=<iso> --stage=find` (or full pipeline). Delete
   `scripts/.candidates/<iso>.json` only when maps/overrides changed and you need a re-find.
4. **Agent vision in one batch** (`--vision=agent`):
   - Download **all** top-3 previews for all cities first (Commons API iiurlwidth=1024).
   - Inspect them (Read images), write **all** verdicts to scripts/.cache/vision-verdicts.json.
   - Then **one** `--stage=judge --vision=agent` (or full run). Never judge→throw→one verdict→repeat.
5. **Apply in the same turn** unless the user asked for dry-run/review:
   `… --iso=<iso> --vision=agent` (default stages) or `--stage=apply` if find+judge already done.
6. If auto top-3 are weak but you found a better Commons File while judging → set override,
   clear that city from candidates (or whole iso json), re-find/apply that city only — still same turn.

STAGES (script)
--stage=find|judge|apply  (default = all three)
--dry-run  find+judge only; no state/manifest/public writes (only if user asks)
--replace=iso|City  required to redo a city that already has a photo (--force must NOT overwrite)
--vision=agent  default here; or ANTHROPIC_API_KEY for API vision

SELECTION
Collect across ALL spots + skyline/panorama/aerial fallback, then rank.
Earlier spots = small bonus, not a veto. Min score → else unresolved.
Vision PASS only if: shows_named_landmark && prominence≥4 && clutter≤2 && postcard≥7
Clutter = wires, dirt, construction, parking-lot dominance, close-up people.
If none pass → unresolved (no AI images). Prefer a known-good override over unresolved.

OUTPUT DISCIPLINE
Stdout one line per city:
iso|city|ACCEPT/UNRESOLVED/SKIP|file title|score|postcard|short reason
plus one totals line. Detail only in scripts/logs/.
After apply: report added / skipped / unresolved.
If user asked dry-run: show scripts/review/index.html and wait for OK before apply.

QUALITY BAR
Good: Abuja National Mosque filling the frame; Lagos Victoria Island aerial + marina;
  Porto-Novo Grande Mosquée façade; Cotonou Place de l'Étoile Rouge; Ganvié stilts on water.
Bad: Nike Art Gallery courtyards; Lekki canopy walk; mosque tiny behind dirt/wires;
  museum-gate/stool/hotel; petrol-vendor portrait; night hotel fountain; wrong-city Abomey gate;
  nature-only beach with no city identity.

USER KICKOFF
Start with: `<ISO or continent>` [optional: `dry-run`] [cities to replace if any]
Examples: `bj`  |  `bj dry-run`  |  `ng replace ng|Lagos`
