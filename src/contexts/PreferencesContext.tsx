"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Color } from "@/utils/colors";
import { brandColors } from "@/data/siteConfig";

export type ThemeMode = "dark" | "light" | "auto";

type Preferences = {
  themeMode: ThemeMode;
  useColors: Color;
};

type PreferencesContextType = {
  preferences: Preferences;
  setPreferences: (data: Partial<Preferences>) => void;
  isDark: boolean;
};

const defaultPreferences: Preferences = {
  themeMode: "dark",
  useColors: {
    primary: brandColors.primary,
    secondary: brandColors.secondary,
  },
};

const PreferencesContext = createContext<PreferencesContextType>({
  preferences: defaultPreferences,
  setPreferences: () => {},
  isDark: true,
});

export function usePreferences() {
  return useContext(PreferencesContext);
}

function getSystemPrefersDark(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolveIsDark(mode: ThemeMode, systemDark: boolean): boolean {
  if (mode === "auto") return systemDark;
  return mode === "dark";
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferencesState] =
    useState<Preferences>(defaultPreferences);
  const [systemDark, setSystemDark] = useState<boolean>(true);

  useEffect(() => {
    // One-time hydration from system preference + localStorage on mount;
    // SSR-safe pattern, the cascade is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSystemDark(getSystemPrefersDark());
    try {
      const stored = localStorage.getItem("preferences");
      if (stored) {
        const parsed = JSON.parse(stored);
        const themeMode: ThemeMode =
          parsed.themeMode === "dark" ||
          parsed.themeMode === "light" ||
          parsed.themeMode === "auto"
            ? parsed.themeMode
            : parsed.shouldUseDarkTheme === false
              ? "light"
              : "dark";
        setPreferencesState({
          themeMode,
          useColors: {
            primary: parsed.useColors?.primary ?? defaultPreferences.useColors.primary,
            secondary: parsed.useColors?.secondary ?? defaultPreferences.useColors.secondary,
          },
        });
      } else {
        setPreferencesState((prev) => ({ ...prev, themeMode: "auto" }));
      }
    } catch {
      /* localStorage unavailable */
    }
  }, []);

  const setter = useCallback(
    (data: Partial<Preferences>) => {
      const prefs: Preferences = {
        themeMode: data.themeMode ?? preferences.themeMode,
        useColors: {
          primary: data.useColors?.primary ?? preferences.useColors.primary,
          secondary: data.useColors?.secondary ?? preferences.useColors.secondary,
        },
      };
      try {
        localStorage.setItem("preferences", JSON.stringify(prefs));
      } catch {
        /* localStorage unavailable */
      }
      setPreferencesState(prefs);
    },
    [preferences]
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const isDark = resolveIsDark(preferences.themeMode, systemDark);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--primary",
      preferences.useColors.primary
    );
    document.documentElement.style.setProperty(
      "--secondary",
      preferences.useColors.secondary
    );
  }, [preferences.useColors]);

  return (
    <PreferencesContext.Provider
      value={{ preferences, setPreferences: setter, isDark }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}
