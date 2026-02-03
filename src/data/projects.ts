import { z } from "zod";
import generated from "./projects.generated.json";

const LocalizedText = z.object({ tr: z.string(), en: z.string() });

const ProjectRoleSchema = z.object({
  icon: z.string(),
  title: LocalizedText,
  desc: LocalizedText,
});

const ProjectContentSchema = z.object({
  name: LocalizedText,
  subtitle: LocalizedText,
  cardDescription: LocalizedText,
  description: LocalizedText,
  cardAlt: LocalizedText,
  heroAlt: LocalizedText,
  status: LocalizedText,
  roles: z.array(ProjectRoleSchema),
});

const ProjectSchema = z.object({
  id: z.string(),
  slug: z.string(),
  previewUrl: z.string().optional(),
  coverImage: z.string().optional(),
  technologies: z.array(z.string()),
  githubUrl: z.string().optional(),
  liveUrl: z.string().optional(),
  isMobile: z.boolean().optional(),
  featured: z.boolean().optional(),
  content: ProjectContentSchema,
});

export type Project = z.infer<typeof ProjectSchema>;
export type ProjectContent = z.infer<typeof ProjectContentSchema>;
export type ProjectRole = z.infer<typeof ProjectRoleSchema>;

export const projects: Project[] = z.array(ProjectSchema).parse(generated);
