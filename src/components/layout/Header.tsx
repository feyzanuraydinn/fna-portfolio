"use client";
import { clsx } from "clsx";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { scrollToItem } from "@/utils/scroll";

const navIcons: Record<string, string> = {
  profile: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8",
  home: "M3 12l9-9 9 9M9 21V12h6v9",
  projects: "M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z",
  tools:
    "M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z",
  contact: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
};

export function Header(props: React.HTMLAttributes<HTMLElement>) {
  const t = useTranslations("header");
  const pathname = usePathname();
  const [activeId, setActiveId] = useState<string>("");

  const items = useMemo(
    () => [
      { id: "profile", hide: true, label: t("links.profile") },
      { id: "home", hide: false, label: t("links.home") },
      { id: "projects", hide: false, label: t("links.projects") },
      { id: "tools", hide: false, label: t("links.tools") },
      { id: "contact", hide: false, label: t("links.contact") },
    ],
    [t]
  );

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let cancelled = false;

    const setup = () => {
      if (cancelled) return;
      const sections = items
        .map((i) => document.getElementById(i.id))
        .filter((el): el is HTMLElement => el !== null);
      if (!sections.length) return;
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveId(entry.target.id);
          });
        },
        { root: null, rootMargin: "-40% 0px -40% 0px", threshold: 0 }
      );
      sections.forEach((s) => observer!.observe(s));
    };

    const raf = requestAnimationFrame(setup);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [items, pathname]);

  return (
    <header
      className={clsx(
        "z-[800]",
        "fixed top-10 inlg:top-6 left-1/2 -translate-x-1/2",
        "w-fit px-4 py-2 rounded-full",
        "dark:bg-light/33 bg-dark/33",
        "drop-shadow-[0_0_1px_rgba(0,0,0,0.333)]",
        "backdrop-blur"
      )}
      {...props}
    >
      <nav aria-label={t("navAriaLabel")}>
        <ul className="flex items-center gap-6 insm:gap-4">
          {items.map((item) => (
            <NavItem
              key={item.id}
              id={item.id}
              label={item.label}
              hide={item.hide}
              isActive={activeId === item.id}
            />
          ))}
        </ul>
      </nav>
    </header>
  );
}

interface NavItemProps {
  id: string;
  label: string;
  hide: boolean;
  isActive: boolean;
}

function NavItem({ id, label, hide, isActive }: NavItemProps) {
  return (
    <li
      aria-hidden={hide}
      className={hide ? "hidden inlg:block" : "block"}
    >
      <button
        type="button"
        aria-label={label}
        aria-current={isActive}
        onClick={scrollToItem(id)}
        className={clsx(
          "group outline-primary whitespace-nowrap relative p-2 rounded-full block cursor-pointer",
          "after:-z-10 after:origin-center after:absolute after:inset-0 after:rounded-full",
          isActive
            ? "after:scale-100 after:bg-primary"
            : "after:scale-0 after:bg-transparent",
          "after:transition-all after:duration-333"
        )}
      >
        <svg
          aria-hidden="true"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={clsx(
            "transition-colors duration-333",
            isActive ? "stroke-light" : "stroke-light/60"
          )}
        >
          <path d={navIcons[id]} />
        </svg>
        <span
          aria-hidden="true"
          className={clsx(
            "pointer-events-none opacity-0",
            "absolute top-0 left-1/2 -translate-x-1/2 translate-y-0",
            "rounded-full px-2 py-1",
            "font-medium text-xs text-light",
            "dark:bg-light/33 bg-dark/33",
            "transition-all duration-400 ease-in-out",
            "group-hover:opacity-100 group-hover:translate-y-12",
            "group-focus-visible:opacity-100 group-focus-visible:translate-y-12"
          )}
        >
          {label}
        </span>
      </button>
    </li>
  );
}
