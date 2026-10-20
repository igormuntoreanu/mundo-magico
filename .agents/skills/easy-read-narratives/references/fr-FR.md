# fr-FR — French of France

## Norm

French of France. Not Canadian, not Belgian, not Swiss. The locale tag is `fr-FR`.

## Typography (French rules, not English)

- Non-breaking space before `: ; ! ?` and inside the guillemets: `« Bonjour ! »`
  In source files write a normal space; the renderer and editors must not collapse it. When in doubt, use `\u00A0`.
- Dialogue with guillemets and a dash:
  `« Où est le chapeau ? demanda la fille. »`
- Numbers: space for thousands, comma for decimals: `1 000`, `3,5`.
- Dates: `3 mars 2026`.
- Times: `15 h`, `15 h 30`.
- No space before a comma or a full stop.

## Vocabulary

| Use (fr-FR) | Never |
| --- | --- |
| voiture | char (CA) |
| soixante-dix, quatre-vingt-dix | septante, nonante (BE/CH) |
| déjeuner (midi) | dîner (BE/CH for lunch) |
| dîner (soir) | souper (BE/CH/CA) |
| petit-déjeuner | déjeuner (BE/CH) |
| faire du shopping, magasiner is wrong | magasiner (CA) |
| petite amie | blonde (CA) |
| travail | job (informal only) |

## Grammar and tense

- Narrate in `passé composé` and `imparfait`. Avoid `passé simple` and `passé antérieur`: they are hard for young readers.
  Good: `Le garçon a suivi le vent.` Bad: `Le garçon suivit le vent.`
- One idea per sentence. Avoid `dont`, `auquel`, `duquel` chains.
- Avoid passive (`a été fait`). Name the actor.
- `on` only when the actor is genuinely unknown; otherwise name the person.
- Keep the `ne` in negation in written text: `il ne savait pas`.

## Examples

Source: "Sem o gorro vermelho, a força dele fica pequena."

Good: "Sans son bonnet rouge, il perd sa force."

Bad: "Privé de son bonnet rouge, sa force s'amenuise." (passive participle, abstract verb, no actor).

## Check

Run `node scripts/check-locale.mjs --locale fr-FR <file>`.
