export type HatStyle =
  | "flower"
  | "cowboy"
  | "sombrero"
  | "beret"
  | "chullo"
  | "kokoshnik"
  | "nemes"
  | "non"
  | "ghutra"
  | "fez"
  | "gele"
  | "beads"
  | "straw"
  | "barrete"
  | "akubra"
  | "beanie"
  | "none";

export type CitySpot = {
  city: string;
  spots: string;
};

export type CountryProfile = {
  iso: string;
  name: string;
  aliases: string[];
  hello: string;
  who: string;
  outfit: string;
  hat: HatStyle;
  palette: [string, string, string];
  tales: string[];
  cities: CitySpot[];
  portrait: boolean;
};
