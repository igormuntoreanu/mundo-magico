import { AFRICA_STORIES } from "./africa";
import { AMERICAS_STORIES } from "./americas";
import { ASIA_STORIES } from "./asia";
import { EUROPE_STORIES } from "./europe";
import { FEATURED_STORIES } from "./featured";
import { FULL_STORIES } from "./full";

const LIBRARY: Record<string, string[]> = {
  ...FEATURED_STORIES,
  ...EUROPE_STORIES,
  ...AMERICAS_STORIES,
  ...AFRICA_STORIES,
  ...ASIA_STORIES,
  ...FULL_STORIES,
};

export function hasStory(iso: string, index: number): boolean {
  const pages = LIBRARY[`${iso}:${index}`];
  return Boolean(pages && pages.length > 0);
}

export function pageArtId(iso: string, taleIndex: number, pageIndex: number): string {
  return `${iso}-${taleIndex}-${pageIndex}`;
}

export function getStory(iso: string, title: string, index: number, translated?: string[]) {
  const key = `${iso}:${index}`;
  const source = LIBRARY[key];
  if (!source?.length) return null;
  // A translation only counts when it keeps the five-page shape.
  const pages = translated?.length === source.length ? translated : source;
  return {
    iso,
    title,
    translated: pages !== source,
    pages: pages.map((text, i) => ({
      text,
      art: pageArtId(iso, index, i),
    })),
  };
}