"use client";
import { clsx } from "clsx";
import { useTranslations } from "next-intl";
import { usePreferences, type ThemeMode } from "@/contexts/PreferencesContext";
import { colors } from "@/utils/colors";
import { Ripple } from "@/components/ui/Ripple";

const themeIcons: Record<ThemeMode, { path: string; fill: boolean }> = {
  dark: {
    path: "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
    fill: true,
  },
  light: {
    path: "M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41M12 6a6 6 0 100 12 6 6 0 000-12z",
    fill: false,
  },
  auto: {
    path: "M2 5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zM8 21h8M12 17v4",
    fill: false,
  },
};

function ThemeItem({
  forMode,
  children,
}: {
  forMode: ThemeMode;
  children: React.ReactNode;
}) {
  const { preferences, setPreferences } = usePreferences();
  const isActive = preferences.themeMode === forMode;

  const handleClick = () => {
    setPreferences({ themeMode: forMode });
  };

  const { path, fill } = themeIcons[forMode];

  return (
    <button
      type="button"
      role="menuitem"
      aria-current={isActive}
      onClick={handleClick}
      className={clsx(
        "cursor-pointer outline-primary",
        "overflow-hidden",
        "relative w-full min-h-[33px] px-2 py-1 rounded",
        "flex items-center gap-2",
        "transition-colors duration-333",
        isActive
          ? "bg-primary"
          : "bg-transparent hover:bg-neutral/25 focus-visible:bg-neutral/25"
      )}
    >
      <Ripple />
      <svg
        aria-hidden="true"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={fill ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="dark:text-dark text-light"
      >
        <path d={path} />
      </svg>
      <span
        className={clsx(
          "pl-2",
          "border-l dark:border-dark/25 border-light/25",
          "font-mono font-semibold text-sm insm:text-xs",
          "dark:text-dark text-light"
        )}
      >
        {children}
      </span>
    </button>
  );
}

function ColorItem({ shade }: { shade: { primary: string; secondary: string } }) {
  const { preferences, setPreferences } = usePreferences();
  const isActive = shade.primary === preferences.useColors.primary;

  const handleClick = () => {
    setPreferences({
      useColors: { primary: shade.primary, secondary: shade.secondary },
    });
  };

  return (
    <button
      type="button"
      role="menuitem"
      aria-current={isActive}
      onClick={handleClick}
      className={clsx(
        "cursor-pointer outline-primary",
        "overflow-hidden",
        "relative w-fit m-auto p-1 rounded",
        "flex items-center gap-2",
        "transition-colors duration-333",
        isActive
          ? "bg-primary/50"
          : "bg-transparent hover:bg-neutral/25 focus-visible:bg-neutral/25"
      )}
    >
      <Ripple />
      <svg
        aria-hidden="true"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        style={{ fill: shade.primary }}
      >
        <rect width="24" height="24" rx="4" />
      </svg>
    </button>
  );
}

export function ThemeDropdown({
  isOpen,
  ...props
}: { isOpen: boolean } & React.HTMLAttributes<HTMLDivElement>) {
  const t = useTranslations("aside");

  if (!isOpen) return null;

  return (
    <div
      role="menu"
      aria-orientation="vertical"
      aria-hidden={!isOpen}
      className={clsx(
        "absolute right-0 top-full mt-2",
        "min-w-[180px] p-1 rounded-xl",
        "dark:bg-light/33 bg-dark/33",
        "backdrop-blur",
        "flex flex-col gap-3",
        "insm:bottom-full insm:top-auto insm:mt-0 insm:mb-2"
      )}
      {...props}
    >
      <div role="group" aria-label="Themes" className="flex flex-col gap-1">
        <ThemeItem forMode="dark">
          {t("dropdowns.theme.dark")}
        </ThemeItem>
        <ThemeItem forMode="light">
          {t("dropdowns.theme.light")}
        </ThemeItem>
        <ThemeItem forMode="auto">
          {t("dropdowns.theme.auto")}
        </ThemeItem>
      </div>
      <hr
        aria-hidden="true"
        className="pointer-events-none w-4/5 m-auto dark:text-dark/25 text-light/25"
      />
      <div role="group" aria-label="Colors" className="grid grid-cols-3">
        {Object.entries(colors).map(([name, c]) => (
          <ColorItem key={name} shade={c} />
        ))}
      </div>
    </div>
  );
}
