"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { t as translate, getLocales, type Locale } from "@/lib/i18n";

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "en",
  setLocale: () => {},
  t: (k) => k,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  const tFn = (key: string) => translate(key, locale);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: tFn }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

/** Small flag toggle button for switching locale. */
export function LocaleToggle() {
  const { locale, setLocale } = useI18n();
  const locales = getLocales();

  return (
    <div style={{ display: "flex", gap: 2 }}>
      {locales.map((l) => (
        <button
          key={l.id}
          onClick={() => setLocale(l.id)}
          title={l.label}
          style={{
            padding: "3px 6px",
            borderRadius: 6,
            border: "none",
            background: locale === l.id ? "var(--color-primary-dim)" : "transparent",
            fontSize: 16,
            cursor: "pointer",
            opacity: locale === l.id ? 1 : 0.5,
            transition: "opacity 150ms",
          }}
        >
          {l.flag}
        </button>
      ))}
    </div>
  );
}
