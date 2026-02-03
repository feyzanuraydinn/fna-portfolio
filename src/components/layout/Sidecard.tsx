"use client";
import Image from "next/image";
import { clsx } from "clsx";
import { useTranslations } from "next-intl";
import { scrollToItem } from "@/utils/scroll";
import { Ripple } from "@/components/ui/Ripple";
import { useLanguage } from "@/contexts/LanguageContext";
import { profile } from "@/data/profile";
import { SiGithub } from "react-icons/si";
import { FaLinkedin, FaEnvelope } from "react-icons/fa";
import { SocialLink } from "./SocialLink";

const decorativeCircles = clsx(
  "after:content-[''] after:pointer-events-none after:absolute",
  "after:w-36 after:h-36 after:rounded-full",
  "after:border-4 after:border-dashed after:border-primary",
  "after:drop-shadow-custom after:transition-theme",
  "after:top-0 after:left-0 after:-translate-1/3 insm:after:-translate-1/2",
  "before:content-[''] before:pointer-events-none before:absolute",
  "before:w-36 before:h-36 before:rounded-full",
  "before:border-4 before:border-dashed before:border-primary",
  "before:drop-shadow-custom before:transition-theme",
  "before:bottom-0 before:right-0 before:translate-1/3 insm:before:translate-1/2"
);

export function Sidecard(props: React.HTMLAttributes<HTMLElement>) {
  const t = useTranslations("profile");
  const { locale } = useLanguage();

  return (
    <aside
      className={clsx(
        "overflow-hidden relative",
        "max-w-full w-[344px] max-h-full h-[640px] rounded-xl",
        "inlg:w-full inlg:h-full inlg:rounded-none inlg:pt-20",
        "flex flex-col items-center justify-center",
        "dark:bg-light/5 bg-dark/5",
        "transition-theme",
        decorativeCircles
      )}
      {...props}
    >
      <figure className="overflow-hidden relative w-[240px] h-[280px] rounded-xl flex items-center justify-center">
        <Image
          src={profile.photoUrl}
          alt={t("photo.alt")}
          width={240}
          height={280}
          priority
          className="object-cover w-full h-full"
        />
      </figure>

      <h2
        id="profile-title"
        className="mt-8 mb-4 font-bold text-2xl dark:text-light text-dark transition-theme"
      >
        {profile.name}
      </h2>
      <h3
        id="profile-desc"
        className="font-semibold dark:text-light/75 text-dark/75 transition-theme"
      >
        {profile.description[locale]}
      </h3>
      <h4 className="font-semibold text-sm dark:text-light/50 text-dark/50 transition-theme">
        {profile.location[locale]}
      </h4>

      <nav className="my-8">
        <ul className="flex items-center gap-6">
          <li>
            <SocialLink
              href={profile.social.github}
              label={t("socials.github")}
              Icon={SiGithub}
            />
          </li>
          <li>
            <SocialLink
              href={profile.social.linkedin}
              label={t("socials.linkedin")}
              Icon={FaLinkedin}
            />
          </li>
          <li>
            <SocialLink
              href={`mailto:${profile.social.email}`}
              label={t("socials.email")}
              Icon={FaEnvelope}
            />
          </li>
        </ul>
      </nav>

      <button
        type="button"
        onClick={scrollToItem("contact")}
        className={clsx(
          "cursor-pointer outline-offset-2 outline-primary",
          "px-6 py-2 rounded",
          "font-semibold text-light text-sm",
          "bg-primary shadow-custom",
          "transition-all duration-333",
          "active:scale-90 active:bg-secondary hover:scale-95 focus-visible:scale-95",
          "animate-shine motion-safe:animate-shine motion-reduce:animate-none"
        )}
      >
        <Ripple />
        {t("button")}
      </button>
    </aside>
  );
}
