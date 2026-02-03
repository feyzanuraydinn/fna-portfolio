"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { NextIntlClientProvider } from "next-intl";
import en from "../../locales/en.json";
import tr from "../../locales/tr.json";

type Locale = "en" | "tr";

type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const messages: Record<Locale, typeof en> = { en, tr };

const LanguageContext = createContext<LanguageContextType>({
  locale: "tr",
  setLocale: () => {},
});

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("tr");

  useEffect(() => {
    // One-time hydration from localStorage on mount; SSR-safe pattern.
    try {
      const stored = localStorage.getItem("locale");
      if (stored === "en" || stored === "tr") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocaleState(stored);
        document.documentElement.lang = stored;
      }
    } catch {
      /* localStorage unavailable */
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem("locale", newLocale);
    } catch {
      /* localStorage unavailable */
    }
    document.documentElement.lang = newLocale;
  }, []);

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages[locale]}>
        {children}
      </NextIntlClientProvider>
    </LanguageContext.Provider>
  );
}
