"use client";
import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeDropdown } from "./ThemeDropdown";

const locales = ["en", "tr"] as const;

export function Sidemenu(props: React.HTMLAttributes<HTMLElement>) {
  const t = useTranslations("aside");
  const { locale, setLocale } = useLanguage();
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const themeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setIsThemeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside aria-label="Side menu" {...props}>
      <div
        className={clsx(
          "z-[900] fixed",
          "top-5 right-5 bottom-auto",
          "insm:top-auto insm:bottom-5",
          "flex flex-col gap-2"
        )}
      >
        {/* Language Switcher */}
        <div className="flex gap-1 rounded-full dark:bg-light/33 bg-dark/33 backdrop-blur p-1">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => setLocale(loc)}
              aria-label={`${t("buttons.language.label")}: ${loc.toUpperCase()}`}
              className={clsx(
                "cursor-pointer px-3 py-1.5 rounded-full text-xs font-semibold uppercase",
                "transition-all duration-333",
                locale === loc
                  ? "bg-primary text-light"
                  : "text-light/75 hover:text-light"
              )}
            >
              {loc}
            </button>
          ))}
        </div>

        {/* Theme Switcher */}
        <div ref={themeRef} className="relative">
          <button
            onClick={() => setIsThemeOpen(!isThemeOpen)}
            aria-label={t("buttons.theme.label")}
            aria-haspopup="menu"
            aria-expanded={isThemeOpen}
            className={clsx(
              "cursor-pointer w-full flex items-center justify-center",
              "p-2 rounded-full",
              "dark:bg-light/33 bg-dark/33",
              "backdrop-blur",
              "transition-all duration-333",
              "hover:bg-primary/50"
            )}
          >
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="none"
              className="text-light"
            >
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          </button>
          <ThemeDropdown isOpen={isThemeOpen} />
        </div>
      </div>
    </aside>
  );
}
