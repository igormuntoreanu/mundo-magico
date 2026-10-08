export const LOCALES = ["pt-BR", "en-GB", "de-DE", "fr-FR"] as const;

export type Locale = (typeof LOCALES)[number];

export function isLocale(value: string | null | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}

export type Messages = {
  metaDescription: string;
  tagline: string;
  searchPlaceholder: string;
  searchLabel: string;
  clearSearch: string;
  dragHint: string;
  welcomeTitle: string;
  welcomeBody: string;
  mascotAlt: string;
  flagAlt: string;
  guide: string;
  outfit: string;
  otherCountry: string;
  friendAlt: string;
  talesTitle: string;
  talesHint: string;
  read: string;
  openTale: string;
  citiesTitle: string;
  closeStory: string;
  taleOf: string;
  folkBadge: string;
  narrator: string;
  illustrationAlt: string;
  storyEnd: string;
  previous: string;
  next: string;
  close: string;
  pageOf: string;
  goToPage: string;
  loading: string;
  missingArt: string;
  languageLabel: string;
  fallbackTale1: string;
  fallbackTale2: string;
  fallbackTale3: string;
  fallbackOutfit: string;
  fallbackSpotFamous: string;
  fallbackReturnCity: string;
  fallbackReturnSpot: string;
  fallbackExploreSpot: string;
  languages: Record<Locale, string>;
};
