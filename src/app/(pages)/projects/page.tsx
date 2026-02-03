import type { Metadata } from "next";
import { siteConfig } from "@/data/siteConfig";
import { profile } from "@/data/profile";
import { ProjectsList } from "./ProjectsList";

export function generateMetadata(): Metadata {
  const isTr = siteConfig.defaultLocale === "tr";
  const title = isTr ? "Tüm Projeler" : "All Projects";
  const description = isTr
    ? `${profile.name}'in geliştirdiği tüm projeler — React, Next.js, TypeScript ve diğer teknolojilerle.`
    : `All projects built by ${profile.name} — React, Next.js, TypeScript and more.`;

  const url = `${siteConfig.url}/projects`;

  return {
    title,
    description,
    alternates: { canonical: "/projects" },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: profile.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function ProjectsPage() {
  return <ProjectsList />;
}
