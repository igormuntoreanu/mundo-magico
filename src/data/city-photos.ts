import raw from "./city-photos.json";

export type CityPhoto = {
  src: string;
  caption: string;
  credit: string;
  /** Source page. Omitted for AI-generated images, which have no external source. */
  href?: string;
  /** "photo" = a real licensed photograph; "ai" = AI-generated image, labelled as such. */
  kind: "photo" | "ai";
  objectPosition?: "top" | "center" | "bottom";
};

const MANIFEST = raw as Record<string, Record<string, CityPhoto[]>>;

export function cityPhotos(iso: string, city: string): CityPhoto[] {
  return MANIFEST[iso]?.[city] ?? [];
}
