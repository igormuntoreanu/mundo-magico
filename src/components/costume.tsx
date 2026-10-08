import type { HatStyle } from "@/data/types";

type Props = {
  palette: [string, string, string];
  hat: HatStyle;
  name: string;
};

export function Costume({ palette, hat, name }: Props) {
  const [a, b] = palette;
  let extra = (
    <>
      <circle cx="132" cy="78" r="10" fill="#ff6b9d" stroke="#2b1b4e" strokeWidth="3" />
      <circle cx="138" cy="70" r="6" fill="#ffd93d" stroke="#2b1b4e" strokeWidth="2" />
    </>
  );

  if (hat === "cowboy" || hat === "akubra") {
    extra = (
      <>
        <ellipse cx="100" cy="52" rx="62" ry="8" fill="#6b3f1f" stroke="#2b1b4e" strokeWidth="3" />
        <ellipse cx="100" cy="46" rx="28" ry="14" fill="#8a5528" stroke="#2b1b4e" strokeWidth="3" />
      </>
    );
  } else if (hat === "sombrero") {
    extra = (
      <>
        <ellipse cx="100" cy="54" rx="70" ry="10" fill="#e2b007" stroke="#2b1b4e" strokeWidth="3" />
        <path d="M70 50 q30 -38 60 0" fill="#f0c93a" stroke="#2b1b4e" strokeWidth="3" />
      </>
    );
  } else if (hat === "beret" || hat === "barrete") {
    extra = (
      <>
        <ellipse cx="96" cy="50" rx="36" ry="14" fill="#1f3a93" stroke="#2b1b4e" strokeWidth="3" />
        <circle cx="128" cy="42" r="5" fill="#1f3a93" stroke="#2b1b4e" strokeWidth="2" />
      </>
    );
  } else if (hat === "chullo") {
    extra = (
      <>
        <path d="M62 70 Q100 18 138 70" fill="#e85d04" stroke="#2b1b4e" strokeWidth="3" />
        <rect x="58" y="66" width="14" height="28" rx="6" fill="#ffd93d" stroke="#2b1b4e" strokeWidth="2" />
        <rect x="128" y="66" width="14" height="28" rx="6" fill="#ffd93d" stroke="#2b1b4e" strokeWidth="2" />
      </>
    );
  } else if (hat === "kokoshnik") {
    extra = (
      <>
        <path d="M58 70 L100 22 L142 70 Z" fill="#7ecbff" stroke="#2b1b4e" strokeWidth="3" />
        <circle cx="100" cy="44" r="6" fill="#ffd93d" />
      </>
    );
  } else if (hat === "nemes") {
    extra = (
      <>
        <path d="M60 40 h80 v40 l-18 18 h-44 l-18 -18z" fill="#ffd93d" stroke="#2b1b4e" strokeWidth="3" />
        <path d="M100 40 v58" stroke="#2b1b4e" strokeWidth="4" />
      </>
    );
  } else if (hat === "non") {
    extra = <path d="M50 68 L100 28 L150 68 Z" fill="#f3e5ab" stroke="#2b1b4e" strokeWidth="3" />;
  } else if (hat === "ghutra") {
    extra = (
      <>
        <path d="M58 44 h84 v40 h-84z" fill="#fff" stroke="#2b1b4e" strokeWidth="3" />
        <rect x="58" y="58" width="84" height="10" fill="#2b1b4e" />
      </>
    );
  } else if (hat === "fez") {
    extra = (
      <>
        <rect x="78" y="28" width="44" height="28" rx="4" fill="#c1121f" stroke="#2b1b4e" strokeWidth="3" />
        <line x1="122" y1="30" x2="136" y2="18" stroke="#2b1b4e" strokeWidth="3" />
      </>
    );
  } else if (hat === "gele" || hat === "beads") {
    extra = (
      <>
        <circle cx="70" cy="86" r="7" fill="#ffd93d" stroke="#2b1b4e" strokeWidth="2" />
        <circle cx="130" cy="86" r="7" fill="#ff6b9d" stroke="#2b1b4e" strokeWidth="2" />
        <path d="M70 48 Q100 18 130 48" fill={a} stroke="#2b1b4e" strokeWidth="3" />
      </>
    );
  } else if (hat === "straw") {
    extra = (
      <>
        <ellipse cx="100" cy="54" rx="58" ry="8" fill="#e2c36b" stroke="#2b1b4e" strokeWidth="3" />
        <ellipse cx="100" cy="48" rx="24" ry="12" fill="#f0d78a" stroke="#2b1b4e" strokeWidth="3" />
      </>
    );
  } else if (hat === "beanie") {
    extra = (
      <path d="M64 70 Q100 22 136 70" fill="#ce1126" stroke="#2b1b4e" strokeWidth="3" />
    );
  }

  return (
    <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={`Amigo de ${name}`}>
      <ellipse cx="100" cy="222" rx="48" ry="10" fill="rgba(43,27,78,.15)" />
      <path d="M62 150 Q100 250 138 150" fill={a} stroke="#2b1b4e" strokeWidth="4" />
      <rect x="78" y="108" width="44" height="48" rx="16" fill={b} stroke="#2b1b4e" strokeWidth="4" />
      <circle cx="100" cy="84" r="34" fill="#ffe0bd" stroke="#2b1b4e" strokeWidth="4" />
      <circle cx="88" cy="82" r="5" fill="#2b1b4e" />
      <circle cx="112" cy="82" r="5" fill="#2b1b4e" />
      <path d="M88 98 Q100 108 112 98" fill="none" stroke="#2b1b4e" strokeWidth="3" strokeLinecap="round" />
      <circle cx="78" cy="92" r="7" fill="#ffb4c8" opacity=".8" />
      <circle cx="122" cy="92" r="7" fill="#ffb4c8" opacity=".8" />
      <path d="M46 128 q20 8 32 -8" fill="none" stroke="#2b1b4e" strokeWidth="6" strokeLinecap="round" />
      <path d="M154 128 q-20 8 -32 -8" fill="none" stroke="#2b1b4e" strokeWidth="6" strokeLinecap="round" />
      {extra}
    </svg>
  );
}
