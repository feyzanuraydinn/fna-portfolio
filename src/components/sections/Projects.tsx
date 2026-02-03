"use client";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Title } from "@/components/ui/Title";
import { Strong } from "@/components/ui/Strong";
import { useTranslations } from "next-intl";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";

export function Projects(props: React.HTMLAttributes<HTMLElement>) {
  const t = useTranslations("work");
  const displayedProjects = projects.filter((p) => p.featured).slice(0, 4);

  return (
    <Section id="projects" aria-labelledby="projects-title" {...props}>
      <header>
        <Title id="projects-title">
          {t("title")} <Strong>{t("strong")}</Strong>
        </Title>
      </header>
      <nav>
        <ul className="grid grid-cols-2 gap-x-3 gap-y-6 inlg:grid-cols-1 insm:gap-x-1">
          {displayedProjects.map((project) => (
            <li key={project.id} className="w-full">
              <ProjectCard
                project={project}
                cardHeight={250}
                imageHeightClass="h-28"
                mobileDescClamp={7}
                onLinkClick={() => sessionStorage.removeItem("cameFromProjectsList")}
              />
            </li>
          ))}
        </ul>
      </nav>
      <Link
        href="/projects"
        className="mx-auto -mt-4 px-6 py-3 rounded-lg font-medium text-sm dark:text-light text-dark border dark:border-light/20 border-dark/20 transition-all duration-333 hover:border-primary hover:text-primary focus-visible:border-primary focus-visible:text-primary"
      >
        {t("viewAll")}
      </Link>
    </Section>
  );
}
