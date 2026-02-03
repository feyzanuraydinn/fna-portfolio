"use client";
import { clsx } from "clsx";
import type { IconType } from "react-icons";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiElectron,
  SiPostgresql,
  SiMongodb,
  SiPrisma,
  SiZod,
  SiVitest,
  SiGit,
  SiVercel,
} from "react-icons/si";
import { Section } from "@/components/ui/Section";
import { Title } from "@/components/ui/Title";
import { Strong } from "@/components/ui/Strong";
import { useTranslations } from "next-intl";

function ToolArticle(props: React.HTMLAttributes<HTMLElement>) {
  return (
    <article
      className={clsx(
        "h-full flex items-center gap-4 p-3 rounded-xl",
        "dark:bg-light/5 bg-dark/5",
        "shadow-custom",
        "transition-all duration-333",
        "hover:scale-[0.98]"
      )}
      {...props}
    />
  );
}

function ToolFigure({ Icon }: { Icon: IconType }) {
  return (
    <figure
      aria-hidden="true"
      className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center dark:bg-light/10 bg-dark/10 transition-theme"
    >
      <Icon size={22} className="text-primary" />
    </figure>
  );
}

function ToolTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className="font-semibold text-sm dark:text-light text-dark transition-theme" {...props} />;
}

function ToolDesc(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className="text-xs dark:text-light/50 text-dark/50 transition-theme" {...props} />;
}

const tools: { key: string; Icon: IconType }[] = [
  // Frontend
  { key: "react", Icon: SiReact },
  { key: "nextjs", Icon: SiNextdotjs },
  { key: "typescript", Icon: SiTypescript },
  { key: "tailwind", Icon: SiTailwindcss },
  // Backend
  { key: "nodejs", Icon: SiNodedotjs },
  { key: "express", Icon: SiExpress },
  // Desktop
  { key: "electron", Icon: SiElectron },
  // Database / ORM
  { key: "postgresql", Icon: SiPostgresql },
  { key: "mongodb", Icon: SiMongodb },
  { key: "prisma", Icon: SiPrisma },
  // Validation / Testing
  { key: "zod", Icon: SiZod },
  { key: "vitest", Icon: SiVitest },
  // Tooling / Hosting
  { key: "git", Icon: SiGit },
  { key: "vercel", Icon: SiVercel },
];

export function Tools(props: React.HTMLAttributes<HTMLElement>) {
  const t = useTranslations("tools");
  return (
    <Section id="tools" aria-labelledby="tools-title" {...props}>
      <header>
        <Title id="tools-title">{t("title")} <Strong>{t("strong")}</Strong></Title>
      </header>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-6 insm:gap-x-2 insm:gap-y-3">
        {tools.map((tool) => (
          <li key={tool.key}>
            <ToolArticle>
              <ToolFigure Icon={tool.Icon} />
              <div>
                <ToolTitle>{t(`items.${tool.key}.name`)}</ToolTitle>
                <ToolDesc>{t(`items.${tool.key}.description`)}</ToolDesc>
              </div>
            </ToolArticle>
          </li>
        ))}
      </ul>
    </Section>
  );
}
