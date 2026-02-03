"use client";
import React from "react";
import Image from "next/image";
import { clsx } from "clsx";
import { useTranslations } from "next-intl";
import { Ripple } from "@/components/ui/Ripple";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Project } from "@/data/projects";
import { getProjectIcon } from "./icons";

function Hero({
  src,
  alt,
  previewUrl,
  isMobile,
}: {
  src?: string;
  alt: string;
  previewUrl?: string;
  isMobile?: boolean;
}) {
  const figureClass = isMobile
    ? "overflow-hidden aspect-[9/16] max-w-[260px] inlg:max-w-[200px] inlg:mx-auto relative rounded-xl flex-shrink-0"
    : "overflow-hidden aspect-video relative rounded-xl";

  // Animated previews (webp/gif) bypass next/image processing so the animation
  // is preserved end-to-end.
  if (previewUrl) {
    return (
      <figure className={figureClass}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl}
          alt={alt}
          decoding="async"
          draggable={false}
          className={clsx(
            "absolute inset-0 w-full h-full",
            "[transform:translateZ(0)]",
            "pointer-events-none select-none",
            isMobile ? "object-contain" : "object-cover",
            !isMobile && "bg-primary",
            "transition-theme"
          )}
        />
      </figure>
    );
  }

  if (!src) {
    return null;
  }

  return (
    <figure className={figureClass}>
      <Image
        fill
        src={src}
        alt={alt}
        sizes={
          isMobile
            ? "(max-width: 1024px) 200px, 260px"
            : "(max-width: 1024px) 100vw, 666px"
        }
        priority
        className={clsx(
          "[transform:translateZ(0)]",
          "pointer-events-none select-none",
          isMobile ? "object-contain" : "object-cover",
          !isMobile && "bg-primary",
          "transition-theme"
        )}
      />
    </figure>
  );
}

function ProjectHeading(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className="font-extrabold text-5xl inlg:text-4xl dark:text-light text-dark inlg:text-center transition-theme"
      {...props}
    />
  );
}

function Subtitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className="font-medium text-sm dark:text-light/50 text-dark/50 inlg:text-center transition-theme"
      {...props}
    />
  );
}

function Desc(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className="font-medium dark:text-light/75 text-dark/75 inlg:text-center transition-theme"
      {...props}
    />
  );
}

function ToViewLive({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        "outline-offset-2 outline-primary",
        "block w-fit px-4 py-2 rounded-md",
        "text-sm text-light",
        "bg-primary shadow-custom",
        "transition-all duration-333",
        "active:scale-90 active:bg-secondary",
        "hover:scale-95 focus-visible:scale-95",
        "animate-shine motion-safe:animate-shine motion-reduce:animate-none"
      )}
    >
      <Ripple />
      {label}
    </a>
  );
}

function ToRepo({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        "group outline-primary outline-offset-4 w-fit",
        "flex items-center gap-1",
        "font-medium text-sm dark:text-light text-dark",
        "transition-theme",
        "hover:text-primary focus-visible:text-primary active:text-primary"
      )}
    >
      <span>{children}</span>
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
        className="transition-all duration-333 group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5"
      >
        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
      </svg>
    </a>
  );
}

function Role({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <li className="p-4 rounded-xl flex flex-col gap-4 dark:bg-light/5 bg-dark/5 transition-theme">
      <div className="flex items-center gap-4">
        <div className="w-fit p-1 rounded-full bg-primary transition-theme">
          {icon}
        </div>
        <h4 className="font-semibold text-lg dark:text-light/75 text-dark/75 transition-theme">
          {title}
        </h4>
      </div>
      <p className="font-medium text-sm dark:text-light/50 text-dark/50 transition-theme">
        {desc}
      </p>
    </li>
  );
}

function InfoBlock({ project }: { project: Project }) {
  const t = useTranslations("projects");
  const { locale } = useLanguage();

  return (
    <>
      <header className="flex flex-col gap-6">
        <ProjectHeading id="project-title">
          {project.content.name[locale]}
        </ProjectHeading>
        <Subtitle>{project.content.subtitle[locale]}</Subtitle>
        <Desc id="project-desc">{project.content.description[locale]}</Desc>
      </header>
      <nav aria-label={t("navAriaLabel")}>
        <ul className="flex items-center gap-6 flex-wrap">
          {project.liveUrl && (
            <li>
              <ToViewLive href={project.liveUrl} label={t("viewLive")} />
            </li>
          )}
          {project.githubUrl && (
            <li>
              <ToRepo href={project.githubUrl}>GitHub</ToRepo>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
}

interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const t = useTranslations("projects");
  const { locale } = useLanguage();

  useScrollToTop([project.id], { mobileTargetSelector: "[data-go-home]" });

  return (
    <>
      {project.isMobile && (project.coverImage || project.previewUrl) ? (
        <div className="flex gap-8 items-start inlg:flex-col inlg:gap-6">
          <Hero
            src={project.coverImage}
            alt={project.content.heroAlt[locale]}
            previewUrl={project.previewUrl}
            isMobile
          />
          <div className="flex flex-col gap-6 flex-1 min-w-0">
            <InfoBlock project={project} />
          </div>
        </div>
      ) : (
        <>
          {(project.coverImage || project.previewUrl) && (
            <Hero
              src={project.coverImage}
              alt={project.content.heroAlt[locale]}
              previewUrl={project.previewUrl}
            />
          )}
          <InfoBlock project={project} />
        </>
      )}
      {project.content.roles.length > 0 && (
        <ul
          aria-label={t("rolesAriaLabel")}
          className="grid grid-cols-2 gap-6 insm:grid-cols-1"
        >
          {project.content.roles.map((role, index) => (
            <Role
              key={index}
              icon={getProjectIcon(role.icon)}
              title={role.title[locale]}
              desc={role.desc[locale]}
            />
          ))}
        </ul>
      )}
    </>
  );
}
