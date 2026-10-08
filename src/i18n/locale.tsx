import { useEffect, useMemo, useState, type ReactNode } from "react";
import { MESSAGES } from "./messages";
import { isLocale, type Locale } from "./types";
import { LocaleContext } from "./use-i18n";

const STORAGE_KEY = "mundo-magico-locale";

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt-BR");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(saved)) setLocaleState(saved);
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  useEffect(() => {
    document.documentElement.lang = locale;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", MESSAGES[locale].metaDescription);
  }, [locale]);

  const value = useMemo(
    () => ({ locale, setLocale, t: MESSAGES[locale] }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
