# AI city postcards — FLUX 3 prompt

Companion to `prompt.md` (which sources **real** Commons photographs). Use this
file only when a city has no usable licensed photograph and a photorealistic
**AI-generated** photograph is acceptable. AI images are labelled in the UI as
`Imagem gerada por IA (FLUX 3) para o FolkGlobe.` and never carry a fake source
link.

## Model

- Provider: Black Forest Labs, endpoint `flux-3-image`
- Auth: `x-key: $BFL_API_KEY`
- Size: `1920x1080` (≈7 credits/image)
- Output: PNG → JPEG q88 (sharp), saved as `public/cities/<iso>/<slug>-0.jpg`

## Prompt template

```
<SCENE — one dense sentence: the real place, its recognisable landmark or
geography, what locals/tourists are doing there>.
Photorealistic travel photograph, shot on a full-frame DSLR with a 24mm lens at
f/8, natural daylight, crisp realistic detail, true-to-life colours,
documentary travel-photography look, high dynamic range, no HDR halos.
Real tourists and local people going about their day in the middle distance,
natural candid poses, nobody looking at the camera or posing.
This is a photograph, not an illustration: no painting, no drawing, no cartoon,
no CGI, no 3D render, no stylisation.
No text, no letters, no words, no captions, no logos, no watermark, no borders,
no frame.
```

The model expands the prompt into a long description, so keep the scene
concrete (named landmark, water/terrain, boats, houses, people) and repeat the
negative list — text, watermarks and painterly drift are the usual failures.

## Data entry

```json
{
  "src": "/cities/<iso>/<slug>-0.jpg",
  "caption": "<Place>, <Country> — <one-line description>",
  "credit": "Imagem gerada por IA (FLUX 3) para o FolkGlobe.",
  "kind": "ai"
}
```

`href` is omitted for AI images (there is no source page); the viewer hides
the "source" button when `href` is absent.

## Prompt used for the Oceania gap-fill

- **Milne Bay (pg)** — coral bay, green volcanic islands, jetty with outrigger
  canoes, clay pots on the sand, local fishermen and visitors on the waterfront.
- **Sepik (pg)** — wide river through rainforest, haus tambaran with carved
  facade, dugout canoes with paddlers, people on the bank, village carvings.
- **Makira (sb)** — turquoise cove, thatched stilt-house village over the water,
  canoes at the walkways, villagers and travellers on the boardwalk.
- **Banks (vu)** — volcanic islands in a deep-blue lagoon, white-sand beach,
  canoes ashore, thatched huts, locals and visitors.
- **Malekula (vu)** — dark volcanic sand, jungle hills, thatched village with
  carved posts, sand drawings on the beach, villagers and tourists, late light.

Regenerate with `node scripts/generate-flux-cities.mjs [slug ...]`.
