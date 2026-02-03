# Portfolio — Feyza Nur Aydın

**English** · [Türkçe](README.tr.md)

Personal portfolio site. Built with Next.js 16 + React 19 + Tailwind 4 + next-intl, deployed as a static export.

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack, `output: "export"`)
- **UI:** React 19, Tailwind CSS 4
- **i18n:** next-intl (TR / EN)
- **Animation:** Matter.js (Physics section)
- **Validation:** Zod (build-time + runtime)
- **Types:** TypeScript strict mode

## Development

```bash
npm install
npm run dev    # http://localhost:3000  (predev hook fetches projects from GitHub)
npm run sync   # re-fetch projects only (independent of dev/build)
npm run build  # static output in out/
npm run lint
npm test       # Vitest unit tests
```

> `dev` and `build` run `scripts/sync-projects.mjs` first. The script pulls each project's `portfolio.json` and preview asset over raw HTTPS and writes them to `src/data/projects.generated.json` and `public/previews/projects/`.
>
> **Auth:** No setup required for public repos. Private repos need a `GITHUB_TOKEN` env var:
> ```bash
> GITHUB_TOKEN=$(gh auth token) npm run sync     # local
> ```
> On Vercel: Project Settings → Environment Variables → add `GITHUB_TOKEN`.

## Architecture

```
src/
  app/
    layout.tsx          ← root layout, metadata, Geist font
    opengraph-image.tsx ← dynamic OG (1200×630, build-time PNG)
    robots.ts           ← /robots.txt
    sitemap.ts          ← /sitemap.xml (projects dynamic)
    (pages)/
      layout.tsx        ← Profile sidebar + content layout
      page.tsx          ← home + JSON-LD Person/Service schema
      projects/
        page.tsx        ← all projects list
        [slug]/page.tsx ← project detail + generateMetadata + CreativeWork schema
  components/
    layout/             ← Header, Sidemenu, Sidecard, Footer, ThemeDropdown
    projects/           ← ProjectCard (shared), ProjectDetail, GoHome
    sections/           ← Home, Projects, Tools, Contact, Physics
    seo/JsonLd.tsx      ← schema.org JSON-LD injector
    ui/                 ← Section, Title, Strong, Ripple, ProgressBar, BackToTop
  contexts/             ← Language, Theme/Preferences
  data/
    profile.ts                ← name, photo, social links, description (i18n)
    physicsObjects.ts         ← Physics section characters (SVG path, size, shape)
    projectRepos.json         ← GitHub repos to include as projects (remote source)
    projects-local/           ← local projects (private/non-GitHub) — see below
    projects.generated.json   ← produced by the sync script (gitignored)
    projects.ts               ← validates generated JSON with Zod and re-exports
    siteConfig.ts             ← domain, defaultLocale, brand color
  hooks/
  utils/
locales/
  tr.json                     ← static labels only (header, navigation, etc.)
  en.json
scripts/
  sync-projects.mjs           ← prebuild/predev hook
docs/
  portfolio.template.json     ← copy-paste template for new projects
```

## Editing the Profile

Single file: [`src/data/profile.ts`](src/data/profile.ts)
- Photo: `photoUrl`
- Name: `name`
- Description / title: `description.tr` / `description.en`
- Location: `location.tr` / `location.en`
- Socials: `social.github`, `social.linkedin`, `social.email`

## Adding a New Project

Two sources are supported:

- **Remote (preferred):** the project lives in its own GitHub repo and the portfolio pulls its `portfolio.json` + assets at build time. Best for public/private repos you maintain.
- **Local:** the project lives directly inside `src/data/projects-local/<id>/`. Best for projects that aren't on GitHub, are hosted elsewhere (GitLab, etc.), or whose source you don't want to set up token access for. The metadata + asset get committed alongside the portfolio repo.

The two sources are merged at build time. The Zod schema is identical for both — same `portfolio.json` structure, same template.

### Remote — 1. Prepare two files in the project repo

At the **root** of the project repo:

- `portfolio.json` — copy [`docs/portfolio.template.json`](docs/portfolio.template.json) and fill in the fields
- `<id>.webp` — animated WebP preview (recommended; loads as `<img>`, no browser-injected media controls)

To convert MP4 → animated WebP:

```bash
ffmpeg -i recording.mp4 -vcodec libwebp_anim \
  -filter:v "fps=12,scale=1280:-1:flags=lanczos" \
  -lossless 0 -compression_level 6 -q:v 70 -loop 0 -an \
  <id>.webp
```

`portfolio.json` is validated with Zod — `npm run sync`/`build` fails loudly on missing or invalid fields. Schema:
- `id`, `slug` — kebab-case, no spaces
- `preview` — `.webp`, `.gif`, `.png`, `.jpg`, `.avif`
- `technologies` — array of strings
- `liveUrl` — optional, valid URL
- `isMobile` — optional, switches the card layout to horizontal
- `featured` — optional, when `true` the project shows on the home page (max 4 featured projects displayed)
- `content.*` — every text must be `{ tr, en }`; passive voice preferred

### Remote — 2. Commit + push the two files to the project repo

```bash
git add portfolio.json <id>.webp
git commit -m "chore: add portfolio metadata and preview"
git push
```

### Remote — 3. Add the repo URL to the portfolio

[`src/data/projectRepos.json`](src/data/projectRepos.json):

```json
[
  "feyzanuraydinn/new-project"
]
```

### Remote — 4. Sync + commit

```bash
npm run sync   # generated JSON and preview assets are produced (gitignored)
npm run dev    # see the new project locally
git add src/data/projectRepos.json
git commit -m "feat: add new-project to portfolio"
git push
```

> Only `projectRepos.json` is committed. `projects.generated.json`, `public/previews/projects/`, and `public/images/projects/` are in `.gitignore` — the `prebuild` hook regenerates them on every build.

### Local — projects that aren't on GitHub

Drop a directory under `src/data/projects-local/` whose name is the project id:

```
src/data/projects-local/
  my-side-project/
    portfolio.json     ← copied from docs/portfolio.template.json, fields filled in
    preview.webp       ← any name; just match the `preview` field in portfolio.json
```

Same Zod schema applies. The sync script enumerates every subdirectory of `projects-local/` and treats each as a project source.

```bash
mkdir -p src/data/projects-local/my-side-project
cp docs/portfolio.template.json src/data/projects-local/my-side-project/portfolio.json
# fill in the fields, drop the preview asset next to portfolio.json
npm run sync
git add src/data/projects-local/my-side-project
git commit -m "feat: add my-side-project (local)"
git push
```

> Local project assets (`portfolio.json` + preview/cover) live inside the portfolio repo and are committed. If the portfolio repo is public, the project metadata and assets are public too. If you want them private, make the portfolio repo private and connect Vercel directly to the private repo.

## Editing Physics Characters

The SVG characters bouncing at the bottom of the home page live in two places:

- **Assets:** `public/images/physics/*.svg`
- **Config:** [`src/data/physicsObjects.ts`](src/data/physicsObjects.ts)

```ts
{ imageUrl: "/images/physics/me.svg", bodyType: "rectangle", width: 150 }
```

| Field | Meaning |
|---|---|
| `imageUrl` | Public path to the SVG |
| `bodyType` | `"circle"` (round collider + border-radius) or `"rectangle"` |
| `width` | Base width in pixels. Height is auto-derived from the SVG aspect ratio. Actual render size is multiplied by a responsive scale (×0.5 mobile, ×0.7 desktop) |

Common operations:
- **Add a character:** drop the SVG into `public/images/physics/`, append a row to `physicsObjects.ts`
- **Remove a character:** delete the row from the array (and the SVG file if you like)
- **Resize:** change the `width` of the relevant row
- **Change shape:** swap `bodyType: "circle"` ↔ `"rectangle"`
- **Scale all characters:** edit the multipliers in `getResponsiveScale()` inside `Physics.tsx`

## Domain

The `url` field in [`src/data/siteConfig.ts`](src/data/siteConfig.ts) is the canonical domain — sitemap, robots, OG/canonical are all derived from it.

## SEO

- ✅ `metadataBase` + Open Graph + Twitter card
- ✅ `sitemap.xml` + `robots.txt`
- ✅ Dynamic OG image (1200×630, name + title)
- ✅ JSON-LD: `Person` + `ProfessionalService` (home), `CreativeWork` (per project)
- ✅ Per-project `generateMetadata` (title, description, OG)
- ✅ Single `<h1>` per page
