# pt-BR — Brazilian Portuguese

Source locale. The tales are written in it, so this file is also the reference for editing the source.

## Norm

Brazilian norm, Acordo Ortográfico de 2009 (in force since 2016). Use the Brazilian vocabulary and the Brazilian verbal system. Never let European Portuguese forms in.

## Spelling

- No trema: `linguiça`, `consequência`.
- `ideia`, `voo`, `micro-ondas`, `heroico`, `feiura` (no accent).
- `você`, `tem` (not `têm` for singular), `vem` (singular).
- Keep the accent on `ê` in `você`, `êle` is wrong (no accent on `ele`).

## Grammar and vocabulary

| Use (pt-BR) | Never (pt-PT) |
| --- | --- |
| celular | telemóvel |
| ônibus | autocarro |
| café da manhã | pequeno-almoço |
| geladeira | frigorífico |
| sorvete | gelado |
| banheiro | casa de banho |
| trem | comboio |
| tênis | sapatilhas |
| time | equipa |
| moça, menina | rapariga (in Brazil this word carries a different, coarse meaning) |

- Progressive: `está correndo`, `estava falando` (not `está a correr`).
- Second person: `você` with third-person verb (`você sabe`). Do not use `tu sabes` or `vós`.
- `a gente` is fine in dialogue, but narration prefers `as pessoas`, `o povo`, `eles`.
- Contractions: `do`, `da`, `no`, `na`, `pelo`, `pela`.

## Punctuation and numbers

- Dialogue with travessão: `— Devolve o chapéu — pediu a menina.`
- Quotes inside text: aspas curvas `“ ”`.
- No space before `, . ; : ! ?`.
- Thousands with a dot, decimals with a comma: `1.000`, `3,5`.
- Dates: `3 de março de 2026`.
- Times: `às 15h`.

## Examples

Source: "Sem o gorro vermelho, a força dele fica pequena."

Good: "Sem o gorro vermelho, ele fica sem força." (shorter, same meaning)

Bad: "Sem o gorro vermelho, a sua força fica pequena." (ambiguous possessive, slightly stiff)

## Check

Run `node scripts/check-locale.mjs --locale pt-BR <file>` for the high-signal list.
