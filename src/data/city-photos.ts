import raw from "./city-photos.json";

export type CityPhoto = {
  src: string;
  caption: string;
  credit: string;
  href: string;
  kind: "photo";
};

const MANIFEST = raw as Record<string, Record<string, CityPhoto[]>>;

export function cityPhotos(iso: string, city: string): CityPhoto[] {
  return MANIFEST[iso]?.[city] ?? [];
}
