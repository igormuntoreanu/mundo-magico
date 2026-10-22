# World view: fluid globe, honest fallback

Date: 2026-10-21
Status: executing
Owner surface: `src/components/globe-canvas.tsx`, new `src/components/world-map.tsx`,
new `src/lib/world-view/*`, `src/routes/index.tsx`

## TaskIntentDraft

- **Requested outcome:** the world navigation (globe or map) is fluid on the
  machines this app actually runs on, and the app degrades honestly instead of
  silently offering a slideshow.
- **Goal:** ≥ 55 fps median while rotating at 1280×900 and 390×844 on the
  reference machine (Intel UHD 620), with a guaranteed non-WebGL path that is
  equally fluid.
- **Success evidence:** `scripts/measure-globe.mjs` numbers before/after; screenshots
  of globe + map at both viewports; clean console; build + typecheck + tests pass.
- **Stop condition:** done when a 3D globe and a 2D map both hit the frame
  budget, capability gating is measured rather than sniffed, and the user can
  override the choice.
- **Non-goals:** new story content, new countries, changing the visual language,
  a full map engine (MapLibre), re-adding per-country 3D meshes.
- **Constraint:** keep the existing look, palette, flags, fly-to behaviour and
  `GlobeApi` navigation contract usable by the rest of the page.

## What was measured (before any change)

Reference machine: Intel UHD Graphics 620, 8 threads, DPR 1, Chrome, real GPU
(ANGLE/D3D11, not SwiftShader).

| Measurement | Value |
| --- | --- |
| WebGL capability | WebGL2 present, hardware renderer, 16384 max texture |
| Time to usable globe (dev) | 7.8 s headed, 22.6 s cold headless |
| Idle frame rate | **8.6 fps** (116 ms/frame) |
| Frame rate while dragging | **7.5 fps** |
| Draw calls per frame | **1,427** |
| Main-thread JS while rendering | **~100 % of one core** |
| Globe with the polygon layer removed | **59.9 fps** |
| 177 polygons, one shared cap colour | **59.5 fps, 91 draw calls** |

CPU profile: 38 % native program work, 21 % `getParameters`, 14 % `getProgram`,
3 % `setProgram` — i.e. three.js is rebuilding shader/program state on every
one of the 177 per-country materials, on every frame.

Conclusion: the sphere, the ocean texture, the atmosphere and the labels are
free. **The per-country extruded meshes are the whole cost.** A "plain map"
would not have fixed this — the globe itself was never the expensive part, and
a map would have hidden a fixable implementation bug behind a feature downgrade.

## Decision

1. **Replace the per-country 3D meshes with one baked country texture** drawn
   once into an equirectangular canvas (2048×1024) with `d3-geo`, composited
   over the existing ocean texture and used as the sphere's map. Rays are cast
   against the sphere for picking, and `geoContains` resolves the country.
   Hover/selection are drawn as a two-item polygon overlay (max 2 extra meshes)
   so the selected country still pops out.
2. **Keep the globe as the primary view.** Do not trade the product identity for
   a map by default.
3. **Detect and measure, don't guess.** A preflight (WebGL2, software renderer,
   save-data, reduced motion) plus a real frame-time probe after mount decides
   the tier; the result is remembered; the user can always override.
4. **Ship a real 2D fallback**, not a placeholder: an SVG world map
   (Natural Earth projection) with drag-pan, wheel/pinch zoom, hover label,
   click-to-focus and the same `flyTo`/`flyToIso` API. It uses no WebGL at all,
   so it also covers driver blocklists and context loss.
5. **Remove the 12-polygons-per-tick pump.** It caused 15 full data joins and
   was the source of the multi-second startup.

## Architecture

```
src/lib/world-view/
  capability.ts      readCapability(), preflightMode(), pacing grade, stored mode
  capability.test.ts pure-function tests
  use-world-mode.ts  mode state + persistence + forced fallback
src/components/
  globe-canvas.tsx   texture globe (globe.gl) + probe + onSlow()
  world-map.tsx      SVG fallback map
  world-loader.tsx   shared volcano loader
src/routes/index.tsx mode switch + toggle
```

Tier rules:

| Signal | Result |
| --- | --- |
| no WebGL2, or software renderer, or `saveData` | `map` |
| stored user choice | that choice |
| globe mounts, median ≤ 22 ms and p95 ≤ 45 ms | `globe` (remembered) |
| median/p95 over budget at DPR > 1 | drop to DPR 1, re-probe once |
| still over budget, or context lost | `map` (remembered) |

## TDD route

Mode `off` (project default) → decision `skipped` for the rendering rewrite;
pure capability/grading helpers get focused unit tests because they encode the
threshold policy. Verification is measurement-led (the harness above) plus the
existing build/typecheck/browser gates.

## Tasks

1. Capability + pacing module and tests.
2. `WorldMap` fallback component.
3. `GlobeCanvas` texture rewrite (single texture, sphere picking, 2-item
   highlight layer, frame probe, DPR step-down, context-loss fallback).
4. `index.tsx` mode switch, persistence, toggle, i18n strings (4 locales).
5. Verification: unit tests, typecheck, build, dev + preview smoke, measured
   frame rates at both viewports, forced-map screenshots, console clean.
6. Record final numbers in this file.

## Risks

- Texture UV alignment: verified by screenshot; a 180° offset would be obvious.
- Hover picking cost: raycast + `geoContains` runs per pointer move; rAF-throttled,
  and skipped while dragging.
- False "poor" verdict on a cold/background tab: sampling waits for visibility
  and ignores the first frames; the result is a remembered *suggestion*, and the
  toggle overrides it.
- Sub-pixel countries (Singapore, Monaco) remain hard to hit on a globe; that is
  pre-existing and the search box is the accessible path.

## Verification log

Measured with `scripts/measure-globe.mjs` on the same Intel UHD 620, headed
Chrome, 1280×900, after a warm reload.

| | Before | After |
| --- | --- | --- |
| Time to usable globe | 7.8 s (22.6 s cold) | **2.9 s** |
| Idle frame rate | 8.6 fps (116 ms) | **59.9 fps** (16.7 ms median, 16.8 ms p95) |
| Frame rate while dragging | 7.5 fps | **59.9 fps** (0 long frames) |
| Draw calls per frame | 1,427 | **6** (globe + 2-item highlight + atmosphere) |
| Console errors | none | none |

Fallback map: 177 SVG paths, **59.9 fps**, zero per-frame JavaScript while idle.

Behaviour verified in a real browser:

- hover → flag + country label on both views;
- click → country panel, fly-to, and the selected country raised/highlighted;
- drag on the globe rotates without selecting (movement guard);
- map pan/pinch/wheel zoom, click-to-focus and reset;
- globe ⇄ map toggle persists (`mundo-magico.world-view.v1`), survives reload,
  and keeps the current country selected;
- `--disable-3d-apis` → map immediately, no canvas, nothing persisted;
- synthetic `webglcontextlost` → map, persisted as `measured`;
- German, English, French and Portuguese strings render.

Gates: `npm run typecheck` clean, `npm test` 68/68, `npm run build` OK, ESLint
clean on the changed files. The production bundle was served from the built
Vercel function and re-checked at 59.9 fps with a clean console.

### Bug found on the way

Selecting a country stretched the desktop grid row to the country panel's
content height (2872 px), so the globe canvas became 727×2872 and its camera
aspect collapsed to 0.253 — the "globe zooms into the ocean" symptom. The
desktop shell is now `lg:h-dvh` with the aside scrolling internally; the canvas
stays 736×731 and the camera aspect 1.007. This was a pre-existing layout bug,
not a texture problem.

### Notes

- `vite preview` (port 8081) serves the SSR HTML but never hydrates in this
  environment; the built output was verified instead by adapting the Vercel
  serverless function locally (the same bundle that deploys).
- The remaining visual trade-off: the baked texture is softer than the old
  vector-extruded countries when zoomed to one country. At 2048×1024 the
  screen resolution (~2.8 px/degree) still exceeds the old 110m geometry's
  detail, and it buys a 7× frame-rate improvement.

