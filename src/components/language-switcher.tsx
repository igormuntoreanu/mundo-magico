import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useI18n } from "@/i18n/use-i18n";
import { LOCALES, type Locale } from "@/i18n/types";
import { cn } from "@/lib/cn";

const FLAGS: Record<Locale, string> = {
  "pt-BR": "br",
  "en-GB": "gb",
  "de-DE": "de",
  "fr-FR": "fr",
};

function Flag({ locale }: { locale: Locale }) {
  return (
    <img
      src={`https://flagcdn.com/w40/${FLAGS[locale]}.png`}
      alt=""
      width={20}
      height={14}
      className="h-3.5 w-5 rounded-sm border border-stroke object-cover"
    />
  );
}

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    function onPointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="pointer-events-auto relative shrink-0">
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-2xl border-3 border-stroke bg-cream px-2.5 py-2 text-xs font-extrabold text-ink shadow-[4px_4px_0_#2b1b4e]"
        aria-label={t.languageLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
      >
        <Flag locale={locale} />
        <span>{t.languages[locale]}</span>
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={t.languageLabel}
          className="absolute right-0 top-[calc(100%+0.4rem)] z-40 min-w-[11.5rem] overflow-hidden rounded-2xl border-3 border-stroke bg-cream shadow-[5px_5px_0_#2b1b4e]"
        >
          {LOCALES.map((item) => {
            const selected = item === locale;
            return (
              <li key={item} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-extrabold text-ink",
                    selected ? "bg-sun" : "hover:bg-sun/70",
                  )}
                  onClick={() => {
                    setLocale(item);
                    setOpen(false);
                  }}
                >
                  <Flag locale={item} />
                  <span className="flex-1">{t.languages[item]}</span>
                  {selected ? <Check className="size-4" aria-hidden /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
