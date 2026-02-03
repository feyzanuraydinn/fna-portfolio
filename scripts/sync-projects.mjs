#!/usr/bin/env node
/**
 * Build-time project sync.
 *
 * Pulls projects from two sources, validates each with Zod, copies referenced
 * preview/cover assets into `public/previews/projects/` and
 * `public/images/projects/`, and writes the merged result to
 * `src/data/projects.generated.json`.
 *
 * Sources:
 *   1. **Remote** — `src/data/projectRepos.json` lists `"owner/repo"` entries
 *      (optional `@branch` suffix). Each repo must have `portfolio.json` plus
 *      its referenced asset(s) at the root. Pulled via raw HTTPS.
 *   2. **Local** — every subdirectory of `src/data/projects-local/` is treated
 *      as an inline project. Must contain a `portfolio.json` whose `preview`
 *      and `coverImage` paths resolve relative to that subdir. Use this for
 *      projects that aren't on GitHub or shouldn't be pulled remotely.
 *
 * The preview asset is loaded as `<img>` in the portfolio, so animated WebP /
 * GIF / static image are all valid (animated WebP is recommended — same size
 * as MP4, no browser-injected media controls).
 *
 * Auth (remote only): public repos work with no setup. Private repos need a
 * token via the `GITHUB_TOKEN` env var (locally:
 * `GITHUB_TOKEN=$(gh auth token) npm run sync`; on Vercel: add `GITHUB_TOKEN`
 * to Project Settings → Environment Variables).
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPOS_FILE = path.join(ROOT, "src/data/projectRepos.json");
const LOCAL_DIR = path.join(ROOT, "src/data/projects-local");
const OUT_FILE = path.join(ROOT, "src/data/projects.generated.json");
const PREVIEW_DIR = path.join(ROOT, "public/previews/projects");
const IMAGE_DIR = path.join(ROOT, "public/images/projects");

const LocalizedText = z.object({ tr: z.string(), en: z.string() });

const ProjectRoleSchema = z.object({
  icon: z.string().min(1),
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
  roles: z.array(ProjectRoleSchema).default([]),
});

const PortfolioJsonSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "id must be kebab-case"),
  slug: z.string().regex(/^[a-z0-9-]+$/, "slug must be kebab-case"),
  preview: z
    .string()
    .regex(/\.(webp|gif|png|jpe?g|avif)$/i, "preview must be an image file")
    .optional(),
  coverImage: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  liveUrl: z.string().url().optional(),
  isMobile: z.boolean().optional(),
  featured: z.boolean().optional(),
  content: ProjectContentSchema,
});

const ReposSchema = z.array(z.string().regex(/^[\w.-]+\/[\w.-]+(@[\w./-]+)?$/));

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";

async function fetchRaw(repo, branch, file) {
  const url = `https://raw.githubusercontent.com/${repo}/${branch}/${encodeURI(file)}`;
  const headers = { "User-Agent": "portfolio-sync" };
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const hint =
      res.status === 404 && !GITHUB_TOKEN
        ? " (private repo? set GITHUB_TOKEN)"
        : "";
    throw new Error(`HTTP ${res.status} ${res.statusText}${hint} — ${url}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function fetchAsset(repo, branch, file, targetDir, id) {
  const buf = await fetchRaw(repo, branch, file);
  await ensureDir(targetDir);
  const ext = path.extname(file) || "";
  const localName = `${id}${ext}`;
  await fs.writeFile(path.join(targetDir, localName), buf);
  return localName;
}

async function syncRepo(repoSpec) {
  const [repo, branch = "HEAD"] = repoSpec.split("@");
  console.log(`▶ remote: ${repo} (${branch})`);

  const jsonText = (await fetchRaw(repo, branch, "portfolio.json")).toString("utf8");
  const meta = PortfolioJsonSchema.parse(JSON.parse(jsonText));

  const project = {
    id: meta.id,
    slug: meta.slug,
    technologies: meta.technologies,
    githubUrl: `https://github.com/${repo}`,
    liveUrl: meta.liveUrl,
    isMobile: meta.isMobile,
    featured: meta.featured,
    content: meta.content,
  };

  if (meta.preview) {
    const local = await fetchAsset(repo, branch, meta.preview, PREVIEW_DIR, meta.id);
    project.previewUrl = `/previews/projects/${local}`;
  }

  if (meta.coverImage) {
    const local = await fetchAsset(repo, branch, meta.coverImage, IMAGE_DIR, meta.id);
    project.coverImage = `/images/projects/${local}`;
  }

  return project;
}

async function copyLocalAsset(srcDir, file, targetDir, id) {
  const srcPath = path.join(srcDir, file);
  const buf = await fs.readFile(srcPath);
  await ensureDir(targetDir);
  const ext = path.extname(file) || "";
  const localName = `${id}${ext}`;
  await fs.writeFile(path.join(targetDir, localName), buf);
  return localName;
}

async function syncLocal(dirName) {
  const projectDir = path.join(LOCAL_DIR, dirName);
  console.log(`▶ local:  ${dirName}`);

  const jsonText = await fs.readFile(path.join(projectDir, "portfolio.json"), "utf8");
  const meta = PortfolioJsonSchema.parse(JSON.parse(jsonText));

  const project = {
    id: meta.id,
    slug: meta.slug,
    technologies: meta.technologies,
    liveUrl: meta.liveUrl,
    isMobile: meta.isMobile,
    featured: meta.featured,
    content: meta.content,
  };

  if (meta.preview) {
    const local = await copyLocalAsset(projectDir, meta.preview, PREVIEW_DIR, meta.id);
    project.previewUrl = `/previews/projects/${local}`;
  }

  if (meta.coverImage) {
    const local = await copyLocalAsset(projectDir, meta.coverImage, IMAGE_DIR, meta.id);
    project.coverImage = `/images/projects/${local}`;
  }

  return project;
}

async function listLocalDirs() {
  try {
    const entries = await fs.readdir(LOCAL_DIR, { withFileTypes: true });
    return entries
      .filter((e) => e.isDirectory() && !e.name.startsWith("."))
      .map((e) => e.name)
      .sort();
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

async function main() {
  const reposRaw = JSON.parse(await fs.readFile(REPOS_FILE, "utf8"));
  const repos = ReposSchema.parse(reposRaw);
  const localDirs = await listLocalDirs();

  if (repos.length === 0 && localDirs.length === 0) {
    console.warn("⚠  No projects found (projectRepos.json empty and no projects-local/ subdirs).");
    await fs.writeFile(OUT_FILE, "[]\n");
    return;
  }

  const projects = [];
  let failed = false;

  for (const repo of repos) {
    try {
      projects.push(await syncRepo(repo));
    } catch (err) {
      console.error(`✗ remote ${repo}: ${err instanceof Error ? err.message : err}`);
      failed = true;
    }
  }

  for (const dir of localDirs) {
    try {
      projects.push(await syncLocal(dir));
    } catch (err) {
      console.error(`✗ local ${dir}: ${err instanceof Error ? err.message : err}`);
      failed = true;
    }
  }

  if (failed) {
    console.error("Sync failed.");
    process.exit(1);
  }

  // Reject duplicate ids across sources
  const seen = new Map();
  for (const p of projects) {
    if (seen.has(p.id)) {
      console.error(`✗ duplicate project id "${p.id}" — present in multiple sources`);
      process.exit(1);
    }
    seen.set(p.id, true);
  }

  await fs.writeFile(OUT_FILE, `${JSON.stringify(projects, null, 2)}\n`);
  console.log(
    `✓ Wrote ${projects.length} project${projects.length === 1 ? "" : "s"} to ${path.relative(ROOT, OUT_FILE)} (${repos.length} remote, ${localDirs.length} local)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
