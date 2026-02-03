"use client";
import { useTranslations } from "next-intl";
import { profile } from "@/data/profile";

export function Footer(props: React.HTMLAttributes<HTMLElement>) {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();
  return (
    <footer className="p-4 dark:bg-dark bg-light transition-theme" {...props}>
      <p className="text-center text-xs dark:text-light/50 text-dark/50 transition-theme">
        © {year}{" "}
        <span className="text-primary font-semibold transition-theme">
          {profile.name}
        </span>
        . {t("rightsReserved")}
      </p>
    </footer>
  );
}
