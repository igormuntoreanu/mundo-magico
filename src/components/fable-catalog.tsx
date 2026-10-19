import { BookOpen, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { flagUrl, getCountry } from "@/data/catalog";
import { TOP_FABLES } from "@/data/top-fables";
import { localizeCountry, localizeFableCreator, localizeFableDate } from "@/i18n/content";
import { countryName } from "@/i18n/country-name";
import { useI18n } from "@/i18n/use-i18n";

type Props = {
  onClose: () => void;
  onOpenFable: (iso: string, taleIndex: number) => void;
};

export function FableCatalog({ onClose, onOpenFable }: Props) {
  const { locale, t } = useI18n();
  const closeButton = useRef<HTMLButtonElement>(null);
  const [query, setQuery] = useState("");
  const rows = useMemo(
    () =>
      TOP_FABLES.map((entry, rank) => {
        const country = localizeCountry(getCountry(entry.iso), locale, t);
        return {
          ...entry,
          rank: rank + 1,
          title: country.tales[entry.taleIndex] ?? "",
          countryName: countryName(entry.iso, locale, country.name),
          estimatedDate: localizeFableDate(entry.estimatedDate, locale),
          creator: localizeFableCreator(entry.creator, locale),
        };
      }),
    [locale, t],
  );
  const visibleRows = useMemo(() => {
    const term = query.trim().toLocaleLowerCase(locale);
    if (!term) return rows;
    return rows.filter((row) =>
      `${row.title} ${row.countryName} ${row.creator ?? ""}`
        .toLocaleLowerCase(locale)
        .includes(term),
    );
  }, [locale, query, rows]);

  useEffect(() => {
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[210] bg-night/85 p-0 md:flex md:items-center md:justify-center md:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fables-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="chunky-lg flex h-dvh w-full flex-col overflow-hidden bg-cream md:h-auto md:max-h-[min(920px,calc(100dvh-2rem))] md:max-w-3xl md:rounded-[1.75rem]">
        <header className="flex items-center gap-3 border-b-4 border-stroke bg-sun px-3 py-3 sm:px-5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-stroke bg-cream shadow-[2px_2px_0_#2b1b4e]">
            <BookOpen className="size-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h2
              id="fables-title"
              className="font-display text-lg font-bold leading-tight text-ink sm:text-2xl"
            >
              {t.fablesTitle}
            </h2>
            <p className="text-xs font-extrabold text-ink/70">{t.fablesCount}</p>
          </div>
          <button
            ref={closeButton}
            type="button"
            onClick={onClose}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-stroke bg-cream text-ink shadow-[2px_2px_0_#2b1b4e] active:scale-[0.96]"
            aria-label={t.closeFables}
          >
            <X className="size-5" aria-hidden />
          </button>
        </header>

        <p className="px-4 pt-3 text-sm font-semibold leading-relaxed text-ink/75 sm:px-5">
          {t.fablesDescription}
        </p>

        <div className="relative mx-4 mt-3 sm:mx-5">
          <Search
            className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink/50"
            aria-hidden
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.searchFables}
            aria-label={t.searchFables}
            className="w-full rounded-xl border-2 border-stroke bg-white py-2.5 pr-3 pl-9 text-sm font-bold text-ink outline-none placeholder:text-ink/40"
          />
        </div>

        <ol className="min-h-0 flex-1 list-none space-y-2 overflow-y-auto px-4 py-3 sm:px-5">
          {visibleRows.map((row) => {
            const flag = flagUrl(row.iso, 80);
            return (
              <li key={`${row.iso}-${row.taleIndex}`}>
                <button
                  type="button"
                  onClick={() => onOpenFable(row.iso, row.taleIndex)}
                  aria-label={`${t.openFable}: ${row.title}, ${row.countryName}`}
                  className="flex w-full items-start gap-3 rounded-xl border-2 border-stroke bg-white p-3 text-left shadow-[2px_2px_0_#2b1b4e] transition-transform active:scale-[0.99] hover:bg-panel-start"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-stroke bg-sun font-display font-bold text-ink">
                    {row.rank}
                  </span>
                  {flag ? (
                    <img
                      src={flag}
                      alt=""
                      className="mt-1 h-5 w-8 shrink-0 rounded-sm border border-stroke object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="mt-1 min-w-8 text-center text-xs font-extrabold uppercase">
                      {row.iso}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block font-display font-bold text-ink">{row.title}</span>
                    <span className="mt-0.5 block text-xs font-extrabold text-candy">
                      {t.fableOrigin}: {row.countryName}
                    </span>
                    <span className="mt-1 block text-xs font-semibold text-ink/70">
                      <span className="font-extrabold">{t.estimatedDate}: </span>
                      {row.estimatedDate ?? t.oralDateUnknown}
                    </span>
                    {row.creator ? (
                      <span className="mt-0.5 block text-xs font-semibold text-ink/70">
                        <span className="font-extrabold">{t.creatorSource}: </span>
                        {row.creator}
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
          {visibleRows.length === 0 ? (
            <li className="rounded-xl border-2 border-stroke bg-white p-4 text-center text-sm font-bold text-ink/70">
              {t.noFableMatch}
            </li>
          ) : null}
        </ol>
      </section>
    </div>
  );
}
