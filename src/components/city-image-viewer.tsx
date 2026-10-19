import { ExternalLink, X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { CityPhoto } from "@/data/city-photos";
import { useI18n } from "@/i18n/use-i18n";

type Props = {
  photo: CityPhoto;
  onClose: () => void;
};

export function CityImageViewer({ photo, onClose }: Props) {
  const { t } = useI18n();
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
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
      className="fixed inset-0 z-[210] flex items-center justify-center bg-night/90 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="city-photo-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="chunky-lg flex max-h-full w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-cream">
        <header className="flex items-center gap-3 border-b-4 border-stroke bg-sun px-3 py-2.5 sm:px-5">
          <h2 id="city-photo-title" className="min-w-0 flex-1 truncate font-display text-base font-bold text-ink sm:text-xl">
            {photo.caption}
          </h2>
          <button
            ref={closeButton}
            type="button"
            onClick={onClose}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-stroke bg-cream text-ink shadow-[2px_2px_0_#2b1b4e] active:scale-[0.96]"
            aria-label={t.closePhoto}
          >
            <X className="size-5" aria-hidden />
          </button>
        </header>

        <div className="flex min-h-0 flex-1 items-center justify-center bg-night p-2 sm:p-4">
          <img
            src={photo.src}
            alt={photo.caption}
            className="max-h-[calc(100dvh-10rem)] max-w-full object-contain"
            style={photo.objectPosition ? { objectPosition: photo.objectPosition } : undefined}
          />
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t-4 border-stroke bg-panel-end px-3 py-2.5 sm:px-5">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wide text-ink/60">{t.photoSource}</p>
            <p className="text-xs font-bold text-ink">{photo.credit}</p>
          </div>
          <a
            href={photo.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border-2 border-stroke bg-cream px-3 py-2 text-xs font-extrabold text-ink shadow-[2px_2px_0_#2b1b4e]"
          >
            {t.photoSource}
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </footer>
      </section>
    </div>
  );
}
