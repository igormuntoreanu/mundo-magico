import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Search, X } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { CountryPanel } from "@/components/country-panel";
import { FableCatalog } from "@/components/fable-catalog";
import { GlobeCanvas, type GlobeApi } from "@/components/globe-canvas";
import { LanguageSwitcher } from "@/components/language-switcher";
import { StoryBook } from "@/components/story-book";
import { FEATURED, getCountry, searchCountries } from "@/data/catalog";
import { loadTranslationPack } from "@/data/stories/translations";
import { countryName } from "@/i18n/country-name";
import { localizeCountry } from "@/i18n/content";
import { useI18n } from "@/i18n/use-i18n";
import type { FolkStory } from "@/data/stories/types";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { locale, t } = useI18n();
  const [selectedIso, setSelectedIso] = useState<string | null>(null);
  const [taleIndex, setTaleIndex] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [openSuggest, setOpenSuggest] = useState(false);
  const [fablesOpen, setFablesOpen] = useState(false);
  const globeApi = useRef<GlobeApi | null>(null);
  const asideRef = useRef<HTMLElement | null>(null);
  const [story, setStory] = useState<FolkStory | null>(null);

  const country = useMemo(() => {
    if (!selectedIso) return null;
    return localizeCountry(getCountry(selectedIso), locale, t);
  }, [selectedIso, locale, t]);
  const hits = useMemo(() => searchCountries(query, locale), [query, locale]);
  const featured = FEATURED.map((iso) => {
    const profile = getCountry(iso);
    return { iso, name: countryName(iso, locale, profile.name) };
  });

  useEffect(() => {
    if (!country || taleIndex == null) {
      setStory(null);
      return;
    }
    let cancel = false;
    const iso = country.iso;
    const title = country.tales[taleIndex] ?? "";
    const index = taleIndex;
    void Promise.all([import("@/data/stories"), loadTranslationPack(locale)]).then(
      ([mod, pack]) => {
        if (!cancel) setStory(mod.getStory(iso, title, index, pack[`${iso}:${index}`]));
      },
    );
    return () => {
      cancel = true;
    };
  }, [country, taleIndex, locale]);

  const pick = useCallback((iso: string, lat?: number, lng?: number) => {
    setSelectedIso(iso);
    setTaleIndex(null);
    setQuery("");
    setOpenSuggest(false);
    if (lat != null && lng != null) {
      globeApi.current?.flyTo(lat, lng);
    } else {
      globeApi.current?.flyToIso(iso);
    }
    if (window.matchMedia("(max-width: 1023px)").matches) {
      asideRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);
  const closeFables = useCallback(() => setFablesOpen(false), []);
  const openFable = useCallback(
    (iso: string, index: number) => {
      closeFables();
      pick(iso);
      setTaleIndex(index);
    },
    [closeFables, pick],
  );

  return (
    <main className="relative min-h-dvh overflow-hidden bg-night text-ink">
      <Stars />
      <div className="relative z-10 mx-auto grid min-h-dvh w-full max-w-[1400px] grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <section className="relative flex min-h-[60vh] flex-col lg:min-h-dvh">
          <div className="relative z-20 flex shrink-0 flex-col gap-2 px-3 pt-3 pb-3">
            <div className="flex items-start gap-2">
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                <h1 className="font-display text-[1.7rem] font-bold leading-none text-sun drop-shadow-[0_3px_0_#2b1b4e] sm:text-3xl">
                  Mundo Mágico
                </h1>
              </div>
              <LanguageSwitcher />
            </div>
            <div className="relative min-w-0">
              <div className="relative">
                <Search
                  className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink/50"
                  aria-hidden
                />
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setOpenSuggest(true);
                  }}
                  onFocus={() => setOpenSuggest(true)}
                  placeholder={t.searchPlaceholder}
                  className="w-full rounded-2xl border-3 border-stroke bg-cream py-2.5 pr-10 pl-9 font-sans text-sm font-bold text-ink shadow-[4px_4px_0_#2b1b4e] outline-none placeholder:text-ink/40"
                  aria-label={t.searchLabel}
                />
                {query ? (
                  <button
                    type="button"
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1 text-ink/60"
                    onClick={() => {
                      setQuery("");
                      setOpenSuggest(false);
                    }}
                    aria-label={t.clearSearch}
                  >
                    <X className="size-4" />
                  </button>
                ) : null}
              </div>
              {openSuggest && hits.length > 0 ? (
                <div className="absolute inset-x-0 top-[3.25rem] z-30 overflow-hidden rounded-2xl border-3 border-stroke bg-cream shadow-[5px_5px_0_#2b1b4e]">
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
                      {countryName(c.iso, locale, c.name)}
                    </button>
                  ))}
                </div>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setOpenSuggest(false);
                  setFablesOpen(true);
                }}
                className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border-3 border-stroke bg-sun px-3 py-2 text-sm font-extrabold text-ink shadow-[3px_3px_0_#2b1b4e] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <BookOpen className="size-4" aria-hidden />
                {t.openFables}
              </button>
            </div>
          </div>

          <div className="relative min-h-0 flex-1">
            <GlobeCanvas
              selectedIso={selectedIso}
              onSelect={(iso, lat, lng) => pick(iso, lat, lng)}
              onReady={(api) => {
                globeApi.current = api;
              }}
            />
          </div>
        </section>

        <aside
          ref={asideRef}
          className="relative max-h-[54vh] overflow-y-auto border-t-4 border-stroke bg-linear-to-b from-panel-start via-panel-mid to-panel-end lg:max-h-none lg:border-t-0 lg:border-l-4"
        >
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
      {fablesOpen ? <FableCatalog onClose={closeFables} onOpenFable={openFable} /> : null}
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
