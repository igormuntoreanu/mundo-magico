import type { Locale } from "@/i18n/types";

export type TranslationPack = Record<string, string[]>;

/**
 * One lazy chunk per locale, so a visitor only downloads the language they
 * read. `import.meta.glob` inside each folder still picks up every part file.
 */
const PACKS: Record<Exclude<Locale, "pt-BR">, () => Promise<TranslationPack>> = {
  "en-GB": () => import("./en-gb").then((m) => m.EN_GB),
  "de-DE": () => import("./de-de").then((m) => m.DE_DE),
  "fr-FR": () => import("./fr-fr").then((m) => m.FR_FR),
};

export async function loadTranslationPack(locale: Locale): Promise<TranslationPack> {
  if (locale === "pt-BR") return {};
  return PACKS[locale]();
}
