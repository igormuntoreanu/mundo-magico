import { createContext, useContext } from "react";
import type { Locale, Messages } from "./types";

export type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Messages;
};

export const LocaleContext = createContext<LocaleContextValue | null>(null);

export function useI18n() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("useI18n must be used within LocaleProvider");
  return value;
}
