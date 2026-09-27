"use client";

import * as React from "react";
import idMessages from "../../messages/id.json";
import enMessages from "../../messages/en.json";
import zhMessages from "../../messages/zh.json";

export type Locale = "id" | "en" | "zh";

const dictionaries: Record<Locale, typeof idMessages> = {
  id: idMessages,
  en: enMessages,
  zh: zhMessages,
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: typeof idMessages;
  t: (keyPath: string) => string;
}

const I18nContext = React.createContext<I18nContextType | null>(null);

export function I18nProvider({
  children,
  initialLocale = "id",
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = React.useState<Locale>(initialLocale);

  // Sync with cookie or localStorage if available
  React.useEffect(() => {
    const saved = localStorage.getItem("tju_locale") as Locale | null;
    if (saved && (saved === "id" || saved === "en" || saved === "zh")) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("tju_locale", newLocale);
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
  };

  const messages = dictionaries[locale] || dictionaries.id;

  const t = (keyPath: string): string => {
    const keys = keyPath.split(".");
    let current: any = messages;
    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = current[k];
      } else {
        return keyPath;
      }
    }
    return typeof current === "string" ? current : keyPath;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, messages, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = React.useContext(I18nContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      locale: "id" as Locale,
      setLocale: () => {},
      messages: idMessages,
      t: (keyPath: string) => {
        const keys = keyPath.split(".");
        let current: any = idMessages;
        for (const k of keys) {
          if (current && typeof current === "object" && k in current) {
            current = current[k];
          } else {
            return keyPath;
          }
        }
        return typeof current === "string" ? current : keyPath;
      },
    };
  }
  return context;
}
