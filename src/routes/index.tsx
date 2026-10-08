import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { CountryPanel } from "@/components/country-panel";
import { GlobeCanvas, type GlobeApi } from "@/components/globe-canvas";
import { StoryBook } from "@/components/story-book";
import { FEATURED, getCountry, searchCountries } from "@/data/catalog";
import type { FolkStory } from "@/data/stories/types";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [selectedIso, setSelectedIso] = useState<string | null>(null);
  const [taleIndex, setTaleIndex] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [openSuggest, setOpenSuggest] = useState(false);
  const globeApi = useRef<GlobeApi | null>(null);
  const [story, setStory] = useState<FolkStory | null>(null);

  const country = selectedIso ? getCountry(selectedIso) : null;
  const hits = useMemo(() => searchCountries(query), [query]);
  const featured = FEATURED.map((iso) => ({ iso, name: getCountry(iso).name }));

  useEffect(() => {
    if (!country || taleIndex == null) {
      setStory(null);
      return;
    }
    let cancel = false;
    const iso = country.iso;
    const title = country.tales[taleIndex] ?? "";
    const index = taleIndex;
    void import("@/data/stories").then((mod) => {
      if (!cancel) setStory(mod.getStory(iso, title, index));
    });
    return () => {
      cancel = true;
    };
  }, [country, taleIndex]);

  function pick(iso: string, lat?: number, lng?: number) {
    setSelectedIso(iso);
    setTaleIndex(null);
    setQuery("");
    setOpenSuggest(false);
    if (lat != null && lng != null) {
      globeApi.current?.flyTo(lat, lng);
    } else {
      globeApi.current?.flyToIso(iso);
    }
  }

  return (
    <main className="relative min-h-dvh overflow-hidden bg-night text-ink">
      <Stars />
      <div className="relative z-10 mx-auto grid min-h-dvh w-full max-w-[1400px] grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <section className="relative min-h-[46vh] lg:min-h-dvh">
          <GlobeCanvas
            selectedIso={selectedIso}
            onSelect={(iso, lat, lng) => pick(iso, lat, lng)}
            onReady={(api) => {
              globeApi.current = api;
            }}
          />

          <div className="pointer-events-none absolute inset-x-3 top-3 z-20 flex flex-col gap-2 sm:flex-row sm:items-start">
            <div className="pointer-events-auto flex flex-wrap items-center gap-2">
              <h1 className="font-display text-[1.7rem] font-bold leading-none text-sun drop-shadow-[0_3px_0_#2b1b4e] sm:text-3xl">
                Mundo Mágico
              </h1>
              <span className="hidden rounded-full border-3 border-stroke bg-cream px-3 py-1 text-xs font-extrabold text-ink shadow-[4px_4px_0_#2b1b4e] sm:inline">
                Gira o globo e escolhe um país
              </span>
            </div>
            <div className="pointer-events-auto relative min-w-0 flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink/50" aria-hidden />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpenSuggest(true);
                }}
                onFocus={() => setOpenSuggest(true)}
                placeholder="Procurar país..."
                className="w-full rounded-2xl border-3 border-stroke bg-cream py-2.5 pr-10 pl-9 font-sans text-sm font-bold text-ink shadow-[4px_4px_0_#2b1b4e] outline-none placeholder:text-ink/40"
                aria-label="Procurar país"
              />
              {query ? (
                <button
                  type="button"
                  className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1 text-ink/60"
                  onClick={() => {
                    setQuery("");
                    setOpenSuggest(false);
                  }}
                  aria-label="Limpar pesquisa"
                >
                  <X className="size-4" />
                </button>
              ) : null}
              {openSuggest && hits.length > 0 ? (
                <div className="absolute inset-x-0 top-[110%] z-30 overflow-hidden rounded-2xl border-3 border-stroke bg-cream shadow-[5px_5px_0_#2b1b4e]">
                  {hits.map((c) => (
                    <button
                      key={c.iso}
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-bold hover:bg-sun"
                      onClick={() => pick(c.iso)}
                    >
                      <img
                        src={`https://flagcdn.com/w40/${c.iso}.png`}
                        alt=""
                        className="h-4 w-6 rounded-sm border border-stroke object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                        }}
                      />
                      {c.name}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <p className="pointer-events-none absolute bottom-3 left-3 z-20 max-w-[220px] rounded-2xl border-3 border-stroke bg-sun px-3 py-2 text-xs font-extrabold text-ink shadow-[4px_4px_0_#2b1b4e] sm:max-w-none">
            Arrasta para girar · toca num país colorido
          </p>
        </section>

        <aside className="relative max-h-[54vh] overflow-y-auto border-t-4 border-stroke bg-linear-to-b from-panel-start via-panel-mid to-panel-end lg:max-h-none lg:border-t-0 lg:border-l-4">
          <CountryPanel
            country={country}
            onPick={(iso) => pick(iso)}
            onClear={() => {
              setSelectedIso(null);
              setTaleIndex(null);
            }}
            onTale={(index) => {
              setTaleIndex(index);
            }}
            featured={featured}
          />
        </aside>
      </div>

      {country && story ? (
        <StoryBook
          key={`${country.iso}-${taleIndex}`}
          story={story}
          country={country}
          onClose={() => setTaleIndex(null)}
        />
      ) : null}
    </main>
  );
}

function Stars() {
  const dots = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => ({
        id: i,
        left: `${(i * 17) % 100}%`,
        top: `${(i * 29) % 100}%`,
        delay: `${(i % 7) * 0.25}s`,
        size: 3 + (i % 4),
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {dots.map((d) => (
        <span
          key={d.id}
          className="absolute rounded-full bg-cream shadow-[0_0_8px_#fff] motion-safe:animate-pulse"
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            animationDelay: d.delay,
          }}
        />
      ))}
    </div>
  );
}
