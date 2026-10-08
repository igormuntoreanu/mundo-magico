import { BookOpen, ChevronRight, Landmark, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Costume } from "@/components/costume";
import { flagUrl, portraitUrl } from "@/data/catalog";
import { hasStory } from "@/data/stories";
import type { CitySpot, CountryProfile } from "@/data/types";
import { cn } from "@/lib/cn";

type Props = {
  country: CountryProfile | null;
  onPick: (iso: string) => void;
  onClear: () => void;
  onTale: (index: number) => void;
  featured: { iso: string; name: string }[];
};

function NumberedTable({
  rows,
  accent,
  onRow,
  actionLabel = "Ler",
  actionClass = "bg-sun",
  ariaVerb = "Abrir o conto",
}: {
  rows: { title: string; detail?: string; openable?: boolean }[];
  accent: string;
  onRow?: (index: number) => void;
  actionLabel?: string;
  actionClass?: string;
  ariaVerb?: string;
}) {
  return (
    <table className="w-full border-separate border-spacing-y-1.5">
      <tbody>
        {rows.map((row, i) => {
          const openable = Boolean(row.openable && onRow);
          const inner = (
            <>
              <td
                className={cn(
                  "w-10 text-center font-display text-lg font-bold text-ink",
                  "rounded-l-xl border-2 border-r-0 border-stroke",
                )}
                style={{ background: accent }}
              >
                {i + 1}
              </td>
              <td
                className={cn(
                  "rounded-r-xl border-2 border-stroke bg-cream px-3 py-2 text-sm font-bold leading-snug text-ink",
                  openable && "pr-2",
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <span>
                    <span>{row.title}</span>
                    {row.detail ? (
                      <span className="mt-0.5 block text-xs font-semibold text-ink/70">{row.detail}</span>
                    ) : null}
                  </span>
                  {openable ? (
                    <span
                      className={cn(
                        "inline-flex shrink-0 items-center gap-1 rounded-full border-2 border-stroke px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-ink uppercase",
                        actionClass,
                      )}
                    >
                      {actionLabel}
                      <ChevronRight className="size-3" aria-hidden />
                    </span>
                  ) : null}
                </span>
              </td>
            </>
          );

          if (openable) {
            return (
              <tr key={`${row.title}-${i}`}>
                <td colSpan={2} className="p-0">
                  <button
                    type="button"
                    onClick={() => onRow?.(i)}
                    className="flex w-full border-separate text-left transition-transform duration-150 ease-out hover:-translate-y-0.5 active:scale-[0.99]"
                    aria-label={`${ariaVerb} ${row.title}`}
                  >
                    <table className="w-full border-separate border-spacing-0">
                      <tbody>
                        <tr>{inner}</tr>
                      </tbody>
                    </table>
                  </button>
                </td>
              </tr>
            );
          }

          return <tr key={`${row.title}-${i}`}>{inner}</tr>;
        })}
      </tbody>
    </table>
  );
}

function cityRows(cities: CitySpot[]) {
  return cities.map((c) => ({ title: c.city, detail: c.spots }));
}

export function CountryPanel({ country, onPick, onClear, onTale, featured }: Props) {
  const [portraitFailed, setPortraitFailed] = useState(false);

  useEffect(() => {
    setPortraitFailed(false);
  }, [country?.iso]);

  if (!country) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-5 py-8 text-center">
        <img
          src="/characters/mascot.jpg"
          alt="Mascote Mundo Mágico"
          className="mb-3 size-32 rounded-full border-4 border-stroke object-cover shadow-[5px_5px_0_#2b1b4e]"
        />
        <h2 className="font-display text-2xl font-bold text-ink">Bem-vindo, explorador!</h2>
        <p className="mt-2 max-w-sm text-sm font-semibold leading-relaxed text-ink/75">
          Gira o globo e toca num país. Vais ver a bandeira, um amigo de traje típico, contos
          folclóricos para ler e cidades famosas.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {featured.map((f) => (
            <button
              key={f.iso}
              type="button"
              onClick={() => onPick(f.iso)}
              className="rounded-full border-2 border-stroke bg-cream px-3 py-2 text-xs font-extrabold text-ink shadow-[3px_3px_0_#2b1b4e] transition-transform duration-150 ease-out hover:-translate-y-0.5 active:scale-[0.96]"
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const portrait = portraitUrl(country.iso);
  const flag = flagUrl(country.iso);

  return (
    <div className="flex flex-col gap-4 px-4 py-4 pb-8">
      <header className="chunky-lg grid grid-cols-[112px_1fr] gap-3 rounded-[1.75rem] bg-cream p-3">
        {flag ? (
          <img
            src={flag}
            alt={`Bandeira de ${country.name}`}
            className="aspect-[3/2] w-full rounded-xl border-3 border-stroke object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="flex aspect-[3/2] items-center justify-center rounded-xl border-3 border-stroke bg-sky font-display text-2xl font-bold">
            {country.iso.toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <h2 className="font-display text-2xl font-bold leading-tight text-ink">{country.name}</h2>
          <p className="mt-1 text-sm font-bold text-ink/80">
            Guia: <span className="text-candy">{country.who}</span>
          </p>
          <p className="mt-0.5 text-xs font-semibold leading-snug text-ink/70">Traje: {country.outfit}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full border-2 border-stroke bg-sun px-2.5 py-0.5 text-xs font-extrabold text-ink">
              {country.hello}
            </span>
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 rounded-full border-2 border-stroke bg-cream px-2.5 py-1 text-xs font-extrabold text-ink shadow-[2px_2px_0_#2b1b4e] transition-transform duration-150 ease-out active:scale-[0.96]"
            >
              <RotateCcw className="size-3" aria-hidden />
              Outro país
            </button>
          </div>
        </div>
      </header>

      <div className="flex justify-center">
        {portrait && !portraitFailed ? (
          <img
            key={country.iso}
            src={portrait}
            alt={`${country.who}, amigo de ${country.name}`}
            className="h-52 w-auto rounded-[1.6rem] border-4 border-stroke object-cover object-top shadow-[6px_6px_0_#2b1b4e]"
            onError={() => setPortraitFailed(true)}
          />
        ) : (
          <div className="h-52 w-44 drop-shadow-[5px_8px_0_rgba(43,27,78,.2)]">
            <Costume palette={country.palette} hat={country.hat} name={country.who} />
          </div>
        )}
      </div>

      <section>
        <h3 className="mb-2 flex items-center gap-2 font-display text-lg font-bold text-ink">
          <span className="inline-flex size-8 items-center justify-center rounded-xl border-2 border-stroke bg-sun">
            <BookOpen className="size-4" aria-hidden />
          </span>
          Contos folclóricos
        </h3>
        <p className="mb-2 text-xs font-bold text-ink/60">Toca num conto para abrir o livro e ler a história.</p>
        <NumberedTable
          accent="#ffd93d"
          onRow={onTale}
          rows={country.tales.map((title, i) => ({
            title,
            openable: hasStory(country.iso, i),
          }))}
        />
      </section>

      <section>
        <h3 className="mb-2 flex items-center gap-2 font-display text-lg font-bold text-ink">
          <span className="inline-flex size-8 items-center justify-center rounded-xl border-2 border-stroke bg-mint">
            <Landmark className="size-4" aria-hidden />
          </span>
          Cidades e monumentos
        </h3>
        <NumberedTable accent="#4ade80" rows={cityRows(country.cities)} />
      </section>
    </div>
  );
}
