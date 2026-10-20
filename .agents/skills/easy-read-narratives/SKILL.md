---
name: easy-read-narratives
description: Write or review Mundo Mágico story text, tale titles, city blurbs and UI copy for readers aged 8-10 in Brazilian Portuguese, British English, German (Germany) and French (France). Use whenever tale pages are added, translated or edited, or when checking that copy stays in the right national variety and stays easy to read.
---

# Easy-read narratives (Mundo Mágico)

Mundo Mágico is read by children of about 8 to 10, often aloud with an adult. Every tale is five pages. The Portuguese text is the source; the other three locales are translations of it, not retellings.

## The four locales

| Locale | Variety | Never |
| --- | --- | --- |
| `pt-BR` | Brazilian Portuguese | European Portuguese |
| `en-GB` | British English | American English |
| `de-DE` | German of Germany | Austrian or Swiss German |
| `fr-FR` | French of France | Canadian, Belgian or Swiss French |

## Shared rules (all locales)

1. One idea per sentence. If a sentence carries two ideas, split it.
2. Aim for 8 to 14 words per sentence. Hard ceiling 20 for tale text, 8 for titles.
3. Active voice. Name the actor: "the hunter forgot the path", not "the path was forgotten".
4. Use everyday words. If a word needs a dictionary for a ten-year-old, replace it or explain it in the same sentence.
5. Explain a culture-specific word the first time it appears on a page, in one short clause. Do not add a glossary.
6. Keep the plot, the names and the cultural facts exactly as the Portuguese source. Translate the telling, not the tale. Never invent an episode.
7. No idioms that do not cross languages, no sarcasm, and no rhetorical questions in the narration.
8. Keep the five-page shape. 60 to 110 words per page. Do not merge or reorder pages.
9. Prefer present or simple past. Avoid stacked subordinate clauses and participle chains.
10. Keep proper nouns. Use the established local name only where one exists (for example "Rio de Janeiro" stays the same in all four).

## Workflow

1. Read the Portuguese page, then close it and say the page out loud in the target language.
2. Draft page by page, following the locale reference.
3. Fix high-signal mistakes with the checker:
   `node .agents/skills/easy-read-narratives/scripts/check-locale.mjs --locale en-GB path/to/file`
4. Read the result aloud again. If you run out of breath, the sentence is too long.
5. Store the result in `src/data/stories/translations/<locale>/` keyed `<iso>:<index>`, always five strings.
6. Do not leave a page in Portuguese inside another locale. If a page cannot be translated honestly, leave the whole tale out so the app falls back to Portuguese and shows its notice.

## References

- `references/shared-rules.md` — narrative structure, vocabulary, the read-aloud test, worked examples.
- `references/pt-BR.md`
- `references/en-GB.md`
- `references/de-DE.md`
- `references/fr-FR.md`
- `scripts/check-locale.mjs` — regex checker for high-signal locale mistakes.

## Batch translation workflow

The library has 895 tales, five pages each. Translations live in `src/data/stories/translations/<locale>/part-NNN.ts`, one default export per file:

```ts
const PART: Record<string, string[]> = { "br:1": ["page 1", "page 2", "page 3", "page 4", "page 5"] };
export default PART;
```

- `node scripts/next-batch.mjs --locale en-GB --size 10` — the next untranslated slice and its dump command.
- `node scripts/stories-dump.mjs --start N --count 10` — the Portuguese source for a slice.
- `node scripts/validate-translations.mjs` — structural gate: 5 pages, known keys, no duplicates, length and sentence warnings.
- `node scripts/translation-status.mjs` — coverage per locale.

Translate one locale per run. Keep proper nouns as in the source (Pedro, Inês de Castro, Momotarō, Fuji); translate only the telling. Do not translate a tale you cannot check: a missing tale falls back to Portuguese and shows the in-app notice.

## Not this

This skill does not make the text compliant with Leichte Sprache (DIN SPEC 33429) or FALC. Those are accessibility formats for people with cognitive disabilities and are stricter than a children's book. Borrow their clarity, never claim their compliance.

This skill does not verify history. Source verification is a separate editorial task.
