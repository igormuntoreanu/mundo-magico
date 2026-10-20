# de-DE — German of Germany

## Norm

Bundesdeutsch. Not Austrian, not Swiss. The locale tag is `de-DE`; every variant word is a defect.

## Spelling

- `ß` after a long vowel or diphthong: `Straße`, `Fuß`, `heiß`, `groß`, `heißen`.
- `ss` after a short vowel: `Fluss`, `dass`, `muss`, `Schloss`.
- Never `ß` in Swiss style (`Strasse`) and never `daß` (old spelling).
- Nouns capitalised. Verbs, adjectives and pronouns lower case.

## Vocabulary

| Use (de-DE) | Never |
| --- | --- |
| Januar | Jänner (AT) |
| Kartoffel | Erdapfel (AT) |
| Tomate | Paradeiser (AT) |
| Fahrrad | Velo (CH) |
| Bürgersteig | Trottoir (CH/AT) |
| Tüte | Sackerl (AT) |
| hallo, guten Tag | Grüezi (CH) |
| Sahne | Obers (AT), Rahm (CH) |
| Brötchen | Semmel (AT) |

## Grammar

- Verb second in main clauses, verb last in subordinate clauses.
- Avoid long subordinate chains: one subordinate clause per sentence at most.
- No Konjunktiv in narration. No indirect speech. Use direct speech with `„ “`.
- Avoid the genitive where a `von` phrase is clearer: `das Haus von der alten Frau` rather than a genitive chain.
- Past: `Perfekt` for spoken narration (`Er hat gelaufen`); `Präteritum` only for common narration verbs (`war`, `hatte`, `ging`) and keep it short.
- Avoid passive. Name the actor.
- Relative pronoun `der/die/das`, not `welche/r/s`.

## Punctuation and numbers

- Quotes: `„Wo ist die Mütze?“ fragte das Mädchen.`
- Thousands with a dot, decimals with a comma: `1.000`, `3,5`.
- Dates: `3. März 2026`.
- Times: `15 Uhr`.

## Compounds

Split a hard compound with a hyphen only when it stays readable: `Regen-Wolke` is worse than `Regenwolke`. Prefer a short paraphrase over a four-part compound.

## Examples

Source: "Ele é um menino de uma perna só, pele escura, gorro vermelho e um cachimbo na boca."

Good: "Er ist ein Junge mit nur einem Bein. Seine Haut ist dunkel, er trägt eine rote Mütze und hat eine Pfeife im Mund."

Bad: "Er ist ein einbeiniger, dunkelhäutiger Junge mit roter Mütze und Pfeife im Mund." (one overlong sentence, stacked adjectives, no actors).

## Check

Run `node scripts/check-locale.mjs --locale de-DE <file>`.
