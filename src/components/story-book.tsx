import { BookOpen, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { StoryArt } from "@/components/story-art";
import { flagUrl, portraitUrl } from "@/data/catalog";
import type { FolkStory } from "@/data/stories/types";
import type { CountryProfile } from "@/data/types";
import { cn } from "@/lib/cn";

type Props = {
  story: FolkStory;
  country: CountryProfile;
  onClose: () => void;
};

export function StoryBook({ story, country, onClose }: Props) {
  const [page, setPage] = useState(0);
  const touchX = useRef<number | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const total = story.pages.length;
  const current = story.pages[page];
  const portrait = portraitUrl(country.iso);
  const flag = flagUrl(country.iso);
  const last = page === total - 1;

  useEffect(() => {
    setPage(0);
  }, [story.title, story.iso, total]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [page, story.title]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setPage((p) => Math.min(total - 1, p + 1));
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setPage((p) => Math.max(0, p - 1));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, total]);

  if (!current || total === 0) return null;

  function go(delta: number) {
    setPage((p) => Math.min(total - 1, Math.max(0, p + delta)));
  }

  return (
    <div
      className="fixed inset-0 z-[200] bg-night/85 p-0 md:flex md:items-center md:justify-center md:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="story-title"
      onTouchStart={(e) => {
        touchX.current = e.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchX.current;
        const end = e.changedTouches[0]?.clientX;
        touchX.current = null;
        if (start == null || end == null) return;
        const dx = end - start;
        if (Math.abs(dx) < 56) return;
        go(dx < 0 ? 1 : -1);
      }}
    >
      <div className="chunky-lg relative flex h-dvh w-full max-w-5xl flex-col overflow-hidden bg-cream md:h-auto md:max-h-[min(920px,calc(100dvh-2rem))] md:rounded-[1.75rem]">
        <header className="flex items-center gap-2 border-b-4 border-stroke bg-sun px-3 py-2.5">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-stroke bg-cream text-ink shadow-[2px_2px_0_#2b1b4e] transition-transform duration-150 ease-out active:scale-[0.96]"
            aria-label="Fechar a história"
          >
            <X className="size-5" aria-hidden />
          </button>
          {flag ? (
            <img
              src={flag}
              alt=""
              className="h-7 w-10 rounded-md border-2 border-stroke object-cover"
            />
          ) : null}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-extrabold tracking-wide text-ink/70 uppercase">
              Conto de {country.name}
            </p>
            <h2 id="story-title" className="truncate font-display text-lg font-bold leading-tight text-ink sm:text-2xl">
              {story.title}
            </h2>
          </div>
          <span className="rounded-full border-2 border-stroke bg-cream px-2.5 py-1 text-[11px] font-extrabold text-ink">
            {page + 1} / {total}
          </span>
        </header>

        <div
          ref={scroller}
          className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
        >
          <div
            key={`${story.iso}-${story.title}-${page}-art`}
            className="relative bg-sky motion-safe:animate-[fadeInUp_280ms_ease-out]"
          >
            <StoryArt
              scene={current.art}
              alt={`Ilustração da página ${page + 1} da história ${story.title}`}
              className="aspect-[4/3] w-full lg:min-h-full lg:aspect-auto"
            />
            <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border-2 border-stroke bg-cream/95 px-2.5 py-1 text-[11px] font-extrabold text-ink shadow-[2px_2px_0_#2b1b4e]">
              <BookOpen className="size-3.5" aria-hidden />
              História do folclore
            </div>
          </div>

          <div
            key={`${story.iso}-${story.title}-${page}-text`}
            className="flex flex-col justify-center gap-4 p-4 sm:p-6 motion-safe:animate-[fadeInUp_280ms_ease-out]"
          >
            {page === 0 ? (
              <div className="flex items-center gap-3 rounded-2xl border-3 border-stroke bg-panel-start px-3 py-2">
                {portrait ? (
                  <img
                    src={portrait}
                    alt=""
                    className="size-14 rounded-full border-3 border-stroke object-cover object-top"
                  />
                ) : null}
                <p className="text-sm font-bold text-ink">
                  <span className="text-candy">{country.who}</span> conta-te esta história tal como o povo deste país a
                  guarda — em palavras simples, sem mudar o conto.
                </p>
              </div>
            ) : null}

            <p className="font-sans text-[1.05rem] leading-[1.65] font-semibold text-ink sm:text-xl sm:leading-relaxed">
              {current.text}
            </p>

            {last ? (
              <p className="rounded-2xl border-3 border-stroke bg-mint px-3 py-2 text-sm font-extrabold text-ink">
                Fim desta história. O folclore continua vivo enquanto for contado.
              </p>
            ) : null}
          </div>
        </div>

        <footer className="flex items-center justify-between gap-2 border-t-4 border-stroke bg-panel-end px-3 py-2.5">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={page === 0}
            className="inline-flex min-h-11 items-center gap-1 rounded-full border-2 border-stroke bg-cream px-3 py-2 text-sm font-extrabold text-ink shadow-[2px_2px_0_#2b1b4e] transition-transform duration-150 ease-out active:scale-[0.96] disabled:opacity-40"
          >
            <ChevronLeft className="size-4" aria-hidden />
            Antes
          </button>
          <div
            className="flex max-w-[46%] flex-wrap items-center justify-center gap-1.5"
            aria-label={`Página ${page + 1} de ${total}`}
          >
            {Array.from({ length: total }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                className={cn(
                  "size-3 rounded-full border-2 border-stroke transition-transform duration-150",
                  i === page ? "scale-125 bg-candy" : "bg-cream",
                )}
                aria-label={`Ir para a página ${i + 1}`}
                aria-current={i === page ? "page" : undefined}
              />
            ))}
          </div>
          {last ? (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-11 items-center gap-1 rounded-full border-2 border-stroke bg-mint px-3 py-2 text-sm font-extrabold text-ink shadow-[2px_2px_0_#2b1b4e] transition-transform duration-150 ease-out active:scale-[0.96]"
            >
              Fechar
              <X className="size-4" aria-hidden />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => go(1)}
              className="inline-flex min-h-11 items-center gap-1 rounded-full border-2 border-stroke bg-sun px-3 py-2 text-sm font-extrabold text-ink shadow-[2px_2px_0_#2b1b4e] transition-transform duration-150 ease-out active:scale-[0.96]"
            >
              Depois
              <ChevronRight className="size-4" aria-hidden />
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}