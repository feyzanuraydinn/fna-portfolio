"use client";
import { clsx } from "clsx";
import { Section } from "@/components/ui/Section";
import { Title } from "@/components/ui/Title";
import { Strong } from "@/components/ui/Strong";
import { Ripple } from "@/components/ui/Ripple";
import { useTranslations } from "next-intl";
import { scrollToItem } from "@/utils/scroll";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";

function yearsSince(isoDate: string): number {
  const start = new Date(isoDate);
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  const before =
    now.getMonth() < start.getMonth() ||
    (now.getMonth() === start.getMonth() && now.getDate() < start.getDate());
  if (before) years -= 1;
  return Math.max(0, years);
}

function P(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className="text-lg dark:text-light/75 text-dark/75 inlg:text-center transition-theme" {...props} />;
}

function D(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className="flex flex-col items-center" {...props} />;
}

function DT(props: React.HTMLAttributes<HTMLElement>) {
  return <dt className="font-extrabold text-3xl dark:text-light text-dark transition-theme" {...props} />;
}

function DD(props: React.HTMLAttributes<HTMLElement>) {
  return <dd className="font-semibold text-xs dark:text-light/50 text-dark/50 tracking-widest text-center transition-theme" {...props} />;
}

function ToContact(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={scrollToItem("contact")}
      className={clsx(
        "cursor-pointer outline-offset-2 outline-primary",
        "px-6 py-2 rounded",
        "font-semibold text-light text-sm",
        "bg-primary shadow-custom",
        "transition-all duration-333",
        "active:scale-90 active:bg-secondary",
        "hover:scale-95 focus-visible:scale-95",
        "animate-shine motion-safe:animate-shine motion-reduce:animate-none"
      )}
      {...props}
    >
      <Ripple />
      {props.children}
    </button>
  );
}

function ToWork(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={scrollToItem("projects")}
      className={clsx(
        "cursor-pointer outline-offset-2 outline-primary",
        "px-6 py-2 rounded",
        "font-semibold text-sm",
        "dark:text-light text-dark",
        "border dark:border-light/25 border-dark/25",
        "shadow-custom",
        "transition-all duration-333",
        "active:scale-90 hover:scale-95 focus-visible:scale-95"
      )}
      {...props}
    >
      <Ripple />
      {props.children}
    </button>
  );
}

export function Home(props: React.HTMLAttributes<HTMLElement>) {
  const t = useTranslations("home");
  return (
    <Section id="home" aria-labelledby="home-title" aria-describedby="home-desc" className="!gap-6" {...props}>
      <header className="flex flex-col gap-6">
        <Title as="h1" id="home-title">{t("title")} <Strong>{t("strong")}</Strong></Title>
        <P id="home-desc">{t("description")}</P>
      </header>
      <div className="my-6 flex inlg:justify-center">
        <dl className="flex items-center gap-12 insm:gap-6 inxs:gap-1">
          <D><DT>+{yearsSince(profile.experienceStartDate)}</DT><DD>{t("numbers.years")}</DD></D>
          <D><DT>+{projects.length}</DT><DD>{t("numbers.projects")}</DD></D>
          <D><DT>+{new Set(projects.flatMap(p => p.technologies)).size}</DT><DD>{t("numbers.technologies")}</DD></D>
        </dl>
      </div>
      <nav aria-labelledby="home-title" className="flex items-center gap-6 inlg:justify-center">
        <ToContact>{t("buttons.contact")}</ToContact>
        <ToWork>{t("buttons.work")}</ToWork>
      </nav>
    </Section>
  );
}
