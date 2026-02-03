# Portfolio — Feyza Nur Aydın

[English](README.md) · **Türkçe**

Kişisel portföy sitesi. Next.js 16 + React 19 + Tailwind 4 + next-intl ile geliştirildi, statik export olarak deploy edilir.

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack, `output: "export"`)
- **UI:** React 19, Tailwind CSS 4
- **i18n:** next-intl (TR / EN)
- **Animasyon:** Matter.js (Physics section)
- **Veri doğrulama:** Zod (build-time + runtime)
- **Tipler:** TypeScript strict mode

## Geliştirme

```bash
npm install
npm run dev    # http://localhost:3000  (predev hook GitHub'dan projeleri çeker)
npm run sync   # sadece projeleri yeniden çek (build/dev'den bağımsız)
npm run build  # statik çıktı out/ klasöründe
npm run lint
npm test       # Vitest unit testleri
```

> `dev` ve `build`, başlamadan önce `scripts/sync-projects.mjs`'i çalıştırır. Script, her proje reposundan raw HTTPS ile `portfolio.json` ve preview asset'i çekip `src/data/projects.generated.json` ve `public/previews/projects/` altına yazar.
>
> **Auth:** Public repolar için kurulum gerekmiyor. Private repolar için `GITHUB_TOKEN` env var lazım:
> ```bash
> GITHUB_TOKEN=$(gh auth token) npm run sync     # lokal
> ```
> Vercel'de: Project Settings → Environment Variables → `GITHUB_TOKEN` ekle.

## Mimari

```
src/
  app/
    layout.tsx          ← root layout, metadata, Geist font
    opengraph-image.tsx ← dinamik OG (1200×630, build-time PNG)
    robots.ts           ← /robots.txt
    sitemap.ts          ← /sitemap.xml (projeler dinamik)
    (pages)/
      layout.tsx        ← Profile sidebar + content layout
      page.tsx          ← anasayfa + JSON-LD Person/Service schema
      projects/
        page.tsx        ← tüm projeler listesi
        [slug]/page.tsx ← proje detay + generateMetadata + CreativeWork schema
  components/
    layout/             ← Header, Sidemenu, Sidecard, Footer, ThemeDropdown
    projects/           ← ProjectCard (paylaşılan), ProjectDetail, GoHome
    sections/           ← Home, Projects, Tools, Contact, Physics
    seo/JsonLd.tsx      ← schema.org JSON-LD enjektörü
    ui/                 ← Section, Title, Strong, Ripple, ProgressBar, BackToTop
  contexts/             ← Language, Theme/Preferences
  data/
    profile.ts                ← isim, foto, sosyal linkler, açıklama (i18n)
    physicsObjects.ts         ← Physics section karakterleri (SVG yolu, boyut, şekil)
    projectRepos.json         ← projeler dahil edilmek istenen GitHub repoları (remote kaynak)
    projects-local/           ← local projeler (private/GitHub-dışı) — aşağıda
    projects.generated.json   ← sync script tarafından üretilir (gitignored)
    projects.ts               ← generated JSON'ı Zod ile doğrulayıp re-export eder
    siteConfig.ts             ← domain, defaultLocale, brand color
  hooks/
  utils/
locales/
  tr.json                     ← sadece statik labellar (header, navigation, vb.)
  en.json
scripts/
  sync-projects.mjs           ← prebuild/predev hook
docs/
  portfolio.template.json     ← yeni proje için kopyala-doldur şablon
```

## Profili Düzenlemek

Tek dosya: [`src/data/profile.ts`](src/data/profile.ts)
- Foto: `photoUrl`
- İsim: `name`
- Açıklama / unvan: `description.tr` / `description.en`
- Konum: `location.tr` / `location.en`
- Sosyal: `social.github`, `social.linkedin`, `social.email`

## Yeni Proje Eklemek

İki kaynak destekleniyor:

- **Remote (önerilen):** Proje kendi GitHub reposunda yaşar; portfolio build-time'da `portfolio.json` + asset'leri çeker. Senin maintain ettiğin public/private repolar için ideal.
- **Local:** Proje doğrudan `src/data/projects-local/<id>/` altında yaşar. GitHub'da olmayan, başka bir platformda (GitLab vb.) olan ya da token erişimi kurulmasını istemediğin projeler için. Metadata + asset portfolio repo'su ile birlikte commit edilir.

İki kaynak build-time'da merge edilir. Zod şeması her ikisi için aynı — aynı `portfolio.json` yapısı, aynı template.

### Remote — 1. Proje reposunda iki dosya hazırla

Proje reposunun **kökünde**:

- `portfolio.json` — [`docs/portfolio.template.json`](docs/portfolio.template.json) dosyasını kopyala, alanları doldur
- `<id>.webp` — animated WebP preview (önerilen format; `<img>` ile yüklenir, browser-injected media controls çıkmaz)

Preview için MP4 → animated WebP dönüşümü:

```bash
ffmpeg -i recording.mp4 -vcodec libwebp_anim \
  -filter:v "fps=12,scale=1280:-1:flags=lanczos" \
  -lossless 0 -compression_level 6 -q:v 70 -loop 0 -an \
  <id>.webp
```

`portfolio.json` doğrulama Zod ile yapılır — eksik veya yanlış field varsa `npm run sync`/`build` patlar ve eksik alanı söyler. Şema:
- `id`, `slug` — kebab-case, boşluksuz
- `preview` — `.webp`, `.gif`, `.png`, `.jpg`, `.avif`
- `technologies` — string dizisi
- `liveUrl` — opsiyonel, geçerli URL
- `isMobile` — opsiyonel, kart layout'unu yatay yapar
- `featured` — opsiyonel, `true` ise proje anasayfada görünür (anasayfada maks 4 öne çıkan proje gösterilir)
- `content.*` — tüm metinler `{ tr, en }` olmalı, edilgen yapı tercih edilir

### Remote — 2. İki dosyayı proje reposuna commit + push'la

```bash
git add portfolio.json <id>.webp
git commit -m "chore: add portfolio metadata and preview"
git push
```

### Remote — 3. Portfolio'da repo URL'sini listeye ekle

[`src/data/projectRepos.json`](src/data/projectRepos.json):

```json
[
  "feyzanuraydinn/yeni-proje"
]
```

### Remote — 4. Sync + commit

```bash
npm run sync   # generated JSON ve preview asset üretilir (gitignored)
npm run dev    # localhost'ta yeni projeyi gör
git add src/data/projectRepos.json
git commit -m "feat: add yeni-proje to portfolio"
git push
```

> Yalnızca `projectRepos.json` commit'lenir. `projects.generated.json` ve `public/previews/projects/`, `public/images/projects/` `.gitignore`'da; her build'de `prebuild` hook'u tarafından yeniden üretilir.

### Local — GitHub'da olmayan projeler için

Adı projenin id'si olan bir klasör aç `src/data/projects-local/` altında:

```
src/data/projects-local/
  ozel-projem/
    portfolio.json     ← docs/portfolio.template.json'dan kopyala, alanları doldur
    preview.webp       ← ismi farketmiyor, portfolio.json'daki `preview` ile eşleşsin
```

Aynı Zod şeması geçerli. Sync script, `projects-local/` altındaki her subdir'i bir proje kaynağı olarak işler.

```bash
mkdir -p src/data/projects-local/ozel-projem
cp docs/portfolio.template.json src/data/projects-local/ozel-projem/portfolio.json
# alanları doldur, preview asset'i portfolio.json'un yanına koy
npm run sync
git add src/data/projects-local/ozel-projem
git commit -m "feat: add ozel-projem (local)"
git push
```

> Local proje asset'leri (`portfolio.json` + preview/cover) portfolio repo'sunda yaşar ve commit edilir. Portfolio repo'su public ise proje metadata'sı ve asset'leri de public olur. Gizli tutmak istiyorsan portfolio repo'sunu private yap, Vercel'i direkt o private repo'ya bağla.

## Physics Karakterlerini Düzenlemek

Anasayfanın altındaki düşen SVG karakterler iki yerde yaşar:

- **Asset:** `public/images/physics/*.svg`
- **Konfig:** [`src/data/physicsObjects.ts`](src/data/physicsObjects.ts)

```ts
{ imageUrl: "/images/physics/me.svg", bodyType: "rectangle", width: 150 }
```

| Field | Anlamı |
|---|---|
| `imageUrl` | SVG'nin public yolu |
| `bodyType` | `"circle"` (yuvarlak çarpışma + border-radius) veya `"rectangle"` |
| `width` | Base genişlik (px). Yükseklik SVG aspect ratio'sundan otomatik hesaplanır. Gerçek render boyutu responsive scale ile çarpılır (mobilde ×0.5, desktop'ta ×0.7) |

Yaygın işlemler:
- **Yeni karakter:** SVG'yi `public/images/physics/`'e at → `physicsObjects.ts`'e satır ekle
- **Karakter sil:** Dizi'den satırı çıkar (ve istersen SVG dosyasını sil)
- **Boyut değiştir:** İlgili satırın `width` değerini değiştir
- **Şekil değiştir:** `bodyType: "circle"` ↔ `"rectangle"`
- **Tüm karakterleri ölçeklendir:** `Physics.tsx` içindeki `getResponsiveScale()` çarpanlarını değiştir

## Domain

[`src/data/siteConfig.ts`](src/data/siteConfig.ts) içindeki `url` alanı gerçek domain — sitemap, robots, OG/canonical otomatik buradan üretilir.

## SEO

- ✅ `metadataBase` + Open Graph + Twitter card
- ✅ `sitemap.xml` + `robots.txt`
- ✅ Dinamik OG image (1200×630, isim+unvan)
- ✅ JSON-LD: `Person` + `ProfessionalService` (anasayfa), `CreativeWork` (her proje)
- ✅ Per-project `generateMetadata` (title, description, OG)
- ✅ Tek `<h1>` her sayfada
