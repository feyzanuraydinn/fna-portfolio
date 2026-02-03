import { projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { siteConfig } from "@/data/siteConfig";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  const locale = siteConfig.defaultLocale;
  const title = project.content.name[locale];
  const description = project.content.description[locale];
  const url = `${siteConfig.url}/projects/${project.slug}`;

  return {
    title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
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

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const project = projects.find((p) => p.slug === slug);
  if (!project) {
    notFound();
  }

  const locale = siteConfig.defaultLocale;

  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.content.name[locale],
    description: project.content.description[locale],
    url: `${siteConfig.url}/projects/${project.slug}`,
    image: project.coverImage
      ? `${siteConfig.url}${project.coverImage}`
      : undefined,
    keywords: project.technologies.join(", "),
    creator: {
      "@type": "Person",
      name: profile.name,
      url: siteConfig.url,
    },
    inLanguage: locale,
    ...(project.githubUrl && { codeRepository: project.githubUrl }),
    creativeWorkStatus: project.content.status[locale],
  };

  return (
    <>
      <ProjectDetail project={project} />
      <JsonLd data={projectSchema} />
    </>
  );
}
