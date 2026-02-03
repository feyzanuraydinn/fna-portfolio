"use client";
import { useTranslations } from "next-intl";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { useScrollToTop } from "@/hooks/useScrollToTop";

export function ProjectsList() {
  const t = useTranslations("work");
  useScrollToTop([], { mobileTargetSelector: "[data-go-home]" });

  return (
    <>
      <header className="flex flex-col gap-4">
        <h1
          id="projects-title"
          className="font-extrabold text-5xl dark:text-light text-dark transition-theme"
        >
          {t("allTitle")} <span className="text-primary">{t("allStrong")}</span>
        </h1>
      </header>
      <ul className="flex flex-col gap-6">
        {projects.map((project) => (
          <li key={project.id} className="w-full">
            <ProjectCard
              project={project}
              cardHeight={320}
              imageHeightClass="h-44"
              mobileDescClamp={10}
              onLinkClick={() => sessionStorage.setItem("cameFromProjectsList", "1")}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
