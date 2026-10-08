import type { CountryProfile, HatStyle } from "./types";
import countriesJson from "./countries.json";
import worldMeta from "./world-meta.json";
import { PORTRAIT_ISOS } from "./portraits";

type RawCountry = Omit<CountryProfile, "iso" | "portrait" | "hat" | "palette"> & {
  iso?: string;
  portrait?: boolean;
  hat: string;
  palette: string[];
};

const RICH = countriesJson as Record<string, RawCountry>;
const NAMES = worldMeta.names as Record<string, string>;
const CAPITALS = worldMeta.capitals as Record<string, string[]>;
const GUIDES = ((worldMeta as { guides?: Record<string, { who: string; outfit: string; hat: string }> }).guides ??
  {}) as Record<string, { who: string; outfit: string; hat: string }>;

const TOY_COLORS = [
  "#ff6b9d",
  "#7ecbff",
  "#ffd93d",
  "#4ade80",
  "#ff8a3d",
  "#a78bfa",
  "#22d3ee",
  "#fb7185",
  "#34d399",
  "#fbbf24",
] as const;

function paletteFor(iso: string): [string, string, string] {
  const n = [...iso].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return [
    TOY_COLORS[n % TOY_COLORS.length]!,
    TOY_COLORS[(n + 3) % TOY_COLORS.length]!,
    TOY_COLORS[(n + 6) % TOY_COLORS.length]!,
  ];
}

function toProfile(iso: string, raw: RawCountry): CountryProfile {
  const palette = raw.palette as [string, string, string];
  return {
    iso,
    name: raw.name,
    aliases: raw.aliases ?? [],
    hello: raw.hello,
    who: raw.who,
    outfit: raw.outfit,
    hat: raw.hat as HatStyle,
    palette,
    tales: raw.tales,
    cities: raw.cities,
    portrait: PORTRAIT_ISOS.has(iso),
  };
}

const cache = new Map<string, CountryProfile>();

export function getCountry(iso: string, fallbackName?: string): CountryProfile {
  const cached = cache.get(iso);
  if (cached) return cached;

  const rich = RICH[iso];
  if (rich) {
    const profile = toProfile(iso, rich);
    cache.set(iso, profile);
    return profile;
  }

  const name = NAMES[iso] ?? fallbackName ?? iso.toUpperCase();
  const capital = CAPITALS[iso];
  const palette = paletteFor(iso);
  const guide = GUIDES[iso];
  const profile: CountryProfile = {
    iso,
    name,
    aliases: fallbackName && fallbackName !== name ? [fallbackName] : [],
    hello: "Olá!",
    who: guide?.who ?? "Explorador",
    outfit: guide?.outfit ?? "roupa nas cores da bandeira deste país",
    hat: (guide?.hat as HatStyle) ?? "flower",
    palette,
    tales: [
      `Os contos folclóricos de ${name} ainda estão a ser escritos no nosso caderno de viagem.`,
      "Pergunta a alguém deste país qual é a lenda preferida da família.",
      "Cada país guarda histórias únicas — volta em breve para ler as deste.",
    ],
    cities: capital && capital[0]
      ? [
          { city: capital[0], spots: capital[1] ?? "paisagens e monumentos famosos" },
          {
            city: `Volta a ${name}`,
            spots: "gira o globo e descobre os vizinhos deste país",
          },
        ]
      : [
          {
            city: name,
            spots: "explora o mapa e imagina as paisagens deste país",
          },
        ],
    portrait: PORTRAIT_ISOS.has(iso),
  };
  cache.set(iso, profile);
  return profile;
}

export function allRichCountries(): CountryProfile[] {
  return Object.keys(RICH)
    .map((iso) => getCountry(iso))
    .sort((a, b) => a.name.localeCompare(b.name, "pt"));
}

export function searchCountries(query: string): CountryProfile[] {
  const term = query.trim().toLowerCase();
  if (!term) return [];
  const hits: CountryProfile[] = [];
  const seen = new Set<string>();

  for (const iso of Object.keys(RICH)) {
    const c = getCountry(iso);
    const blob = [c.name, c.iso, ...c.aliases].join(" ").toLowerCase();
    if (blob.includes(term)) {
      hits.push(c);
      seen.add(iso);
    }
  }
  for (const [iso, name] of Object.entries(NAMES)) {
    if (seen.has(iso)) continue;
    if (name.toLowerCase().includes(term) || iso.includes(term)) {
      hits.push(getCountry(iso));
    }
  }
  return hits.slice(0, 8);
}

export const FEATURED = ["br", "pt", "jp", "eg", "mx", "fr", "in", "ke", "ao", "nz"] as const;

export function flagUrl(iso: string, width = 320): string {
  if (iso === "aq") return "https://flagcdn.com/w320/aq.png";
  if (iso === "xk") return "https://flagcdn.com/w320/xk.png";
  if (iso.length !== 2) return "";
  return `https://flagcdn.com/w${width}/${iso}.png`;
}

export function portraitUrl(iso: string): string | null {
  if (PORTRAIT_ISOS.has(iso)) return `/characters/${iso}.jpg?v=3`;
  return null;
}
