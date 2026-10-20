# Lean translation brief (for batch agents)

One page, enough to translate. The full reference is `references/` beside this file; read it only when a line here is unclear.

## Task

Translate the Portuguese pages of a tale into the target locale for readers aged 8–10. Five pages in, five pages out, same order, same facts. Translate the telling, not the tale: keep plot, names, places, cultural details, and ambiguous endings exactly. Never add an event, a moral, or a historical fact.

## The five rules that matter most

1. One idea per sentence; aim 8–14 words; hard ceiling 20.
2. Active voice, everyday words; explain a culture word once, inline.
3. Keep five pages, 60–110 words each; do not pad a short source page.
4. Read it aloud in your head; if you run out of breath, split the sentence.
5. A missing tale is better than an invented one.

## Locale essentials

**en-GB**: colour, centre, organise, catalogue, travelled; mum, lorry, pavement, autumn, maths; single quotes for speech; never American spellings.

**de-DE**: ß after long vowels (Straße, Fuß), ss after short (Fluss, dass); Präteritum for narration, Präsens only for timeless lore the source gives in the present; no Konjunktiv, no indirect speech, no genitive chains; Januar, Kartoffel, Fahrrad, not Jänner/Erdapfel/Velo; quotes „ “.

**fr-FR**: passé composé + imparfait only, never passé simple; « guillemets » with inner spaces and a space before ? ! : ; voiture, soixante-dix, quatre-vingt-dix, dîner; "tu" address; no septante, nonante, souper, magasiner.

**pt-BR** (source): Brazilian norm; celular, ônibus, café da manhã, banheiro; gerúndio (está fazendo); você; never telemóvel, autocarro, pequeno-almoço, casa de banho.

## Output

Write exactly one file, `src/data/stories/translations/<locale>/part-NNN.ts`:

```ts
const PART: Record<string, string[]> = { "br:1": ["page 1", "page 2", "page 3", "page 4", "page 5"] };
export default PART;
```

Exactly the keys in the dump, five strings each, in order. Then run:

```
node .agents/skills/easy-read-narratives/scripts/check-locale.mjs --locale <tag> <file>
```

Fix real findings. Do not edit any other file, do not build, do not touch git. Delete temporary dumps.
