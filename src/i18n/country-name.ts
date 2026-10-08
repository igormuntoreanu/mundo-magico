import type { Locale } from "./types";

const EXTRA: Record<string, Partial<Record<Locale, string>>> = {
  xk: {
    "pt-BR": "Kosovo",
    "en-GB": "Kosovo",
    "de-DE": "Kosovo",
    "fr-FR": "Kosovo",
  },
  somaliland: {
    "pt-BR": "Somalilândia",
    "en-GB": "Somaliland",
    "de-DE": "Somaliland",
    "fr-FR": "Somaliland",
  },
  ncyp: {
    "pt-BR": "Chipre do Norte",
    "en-GB": "Northern Cyprus",
    "de-DE": "Nordzypern",
    "fr-FR": "Chypre du Nord",
  },
};

const displayers = new Map<Locale, Intl.DisplayNames>();

function displayer(locale: Locale) {
  let names = displayers.get(locale);
  if (!names) {
    names = new Intl.DisplayNames([locale], { type: "region" });
    displayers.set(locale, names);
  }
  return names;
}

export function countryName(iso: string, locale: Locale, fallback: string): string {
  const extra = EXTRA[iso]?.[locale];
  if (extra) return extra;
  if (/^[a-z]{2}$/i.test(iso)) {
    try {
      const localized = displayer(locale).of(iso.toUpperCase());
      if (localized && localized.toUpperCase() !== iso.toUpperCase()) return localized;
    } catch {
      // Unknown region codes keep the catalogue name.
    }
  }
  return fallback;
}
