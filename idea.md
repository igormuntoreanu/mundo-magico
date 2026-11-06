# FolkGlobe — idea.md

## Concept

A world-explorer / storybook app for children (roughly 6–10 years) that turns
a globe into a doorway into global folklore. Kids pinch, drag and tap a
3D globe to fly to any country, then read a traditional folk tale, see a
typical costume and a friendly local guide, browse famous cities and, on
supported countries, eat a regional dish. It is English-first, with a
Portuguese, German and French trailer — every UI string, story title, city
name, landmark line and costume carries all four locales.

* **Former working names:** Mundo Mágico, Spinlore.
* **Product name:** FolkGlobe (folkglobe.com).
* **Tagline:** *Gire o globo e escolha um país* (Portuguese) / "Spin the globe and choose a country."

## Target

Children discovering the world through stories. The experience is light,
tactile and read-aloud friendly: big illustrations, one hand-swipe-per-
country navigation, minimal text, and a story reader that behaves like a
picture book. No accounts, no login, no database — everything lives in the
client bundle (localStorage only, per the App Builder §0.5 rule).

## Scope

**Core surface**
* **Globe view** — one 2048×1024 texture atlas of all countries (the whole
  reason the globe stays cheap), `globe.gl` + `three`, with a d3-geo/topojson
  fallback map for low-end devices.
* **Country profile** — flag, a typical costume with a per-country guide
  character, a short description, and local hello.
* **Story reader** — the Top-100 folk tales catalogue, presented as a
  picture-book reader with page navigation, portrait art and flags.
* **City board** — photographed landmarks per country (touristic-first;
  aerial framing preferred).
* **Dish board** — a plated regional dish per supported country, with a
  read-level 8–10 note.

**Catalogue**
* A Top-100 fable catalogue with editorial (not statistical) ordering,
  origin and estimated/first-recorded date, plus creator/collector and
  source notes. Order is explicitly **not** a worldwide popularity ranking.

**Localisation**
* `pt-BR`, `en-GB`, `de-DE`, `fr-FR` for every UI string, story title,
  city name, landmark line, costume and dish name/note. Story *narratives*
  are the one remaining Portuguese-only surface.
* A locale-aware search across countries and tales.

## Architecture

* **Framework:** TanStack Start (file-based routing, `createFileRoute`),
  React 19, Vite on Node 22, Tailwind v4, Radix primitives for UI chrome.
* **Cartography:** `globe.gl` + `three`/`@react-three-fiber`, `d3-geo`,
  `topojson-client`, a 110m country topography asset at `public/geo/`.
* **Data:** static catalogs (`src/data/`) — country profiles, tale catalog,
  city photos, dish definitions, portraits/flags. No server DB at this stage.
* **State:** zustand-family stores plus React state; no migrations, no
  `src/lib/db`, no auth routes (auth and database are OFF by default).
* **Entry contract:** `src/router.tsx` (`getRouter`), `src/routes/__root.tsx`,
  `src/routes/index.tsx`, `src/styles.css` (Tailwind import + button base).
* **Brand:** branding injector, the "Created with Grok / Remix" pill and
  preview bridge are preserved — never stripped.

## Current state

A playable, demo-quality app is running on `0.0.0.0:8080` (see
`startup.sh`). The globe, catalogue, story reader, city and dish boards and
the language switcher all render and respond. The data layer ships with
49 of the world's countries profiled, city photos for 328 of 573 city slots,
and dishes for the Americas, Europe and Africa waves shipped, with the
remainder (Asia/Oceania, weak-profile countries) outstanding.

## Outstanding work

1. **Source-verify and expand all 100 fable texts.** Every catalogue entry
   resolves to the same five story pages; the existing page text has not been
   checked against a traceable primary text or reliable historical edition.
   Record a source per story before adding detail; don't present uncertain
   retellings as documented history.
2. **Translate the complete story narratives.** The catalogue interface and
   all 100 titles are in four locales, but the five-page narrative body is
   still Portuguese. Verify each source text before translating into en-GB,
   de-DE and fr-FR so unverified wording isn't spread.
3. **City photos — finish the globe.** 328/573 filled; Port-au-Prince left
   blank on purpose (earthquake imagery unsuitable). Needed: a second pass
   over rejected slots, the 67 empty small/remote countries, and the Asia
   / Oceania waves.
4. **Dish photos — finish the world.** Americas, Europe and Africa shipped;
   Asia/Oceania remain, plus a pass over weak plates (Central America, some
   African countries).
5. **Top-100 catalogue wording** — editorial-order copy is plain and refers
   to "a world ranking" only as explicitly non-definitive; polish for
   child-facing voice.
6. **Accessibility & performance** — the live-frame probe flags devices that
   can't keep the globe fluid; degrade gracefully rather than drop frames.

## Non-goals

* No accounts / sign-in (unless an explicit per-user or cross-device
  feature is requested).
* No persistent server storage or migrations.
* No AI / xAI gen-api calls (no `XAI_API_KEY` yet; never mock AI output).
* No real-time multiplayer or public sharing between users.
