"use client";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";

const FROM_PROJECTS_KEY = "cameFromProjectsList";

export function GoHome() {
  const t = useTranslations("projects");
  const pathname = usePathname();
  const [fromProjects, setFromProjects] = useState(false);

  useEffect(() => {
    // Read sessionStorage on every route change to refresh the back-link target.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFromProjects(sessionStorage.getItem(FROM_PROJECTS_KEY) === "1");
  }, [pathname]);

  const href = fromProjects ? "/projects" : "/#projects";
  const label = fromProjects ? t("goProjects") : t("goHome");

  const handleClick = () => {
    if (fromProjects) {
      sessionStorage.removeItem(FROM_PROJECTS_KEY);
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      data-go-home
      className={clsx(
        "group",
        "outline-primary outline-offset-4",
        "w-fit",
        "flex items-center gap-3",
        "font-medium dark:text-light text-dark",
        "transition-colors duration-333",
        "hover:text-primary",
        "focus-visible:text-primary",
        "active:text-primary"
      )}
    >
      <svg
        aria-hidden="true"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={clsx(
          "transition-all duration-333",
          "group-hover:-translate-x-1.5",
          "group-focus-visible:-translate-x-1.5",
          "group-active:-translate-x-1.5"
        )}
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      <span>{label}</span>
    </Link>
  );
}
