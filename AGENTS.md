# Andrés Mata Caro – web de arquitectura

Vite + React 19 + Tailwind v4 + motion + Lenis (smooth scroll). Single page composed in `src/App.tsx` from `src/components/`.

## Design language ("entre la cal y el hormigón")
- Palette tokens in `src/index.css`: `cal` (whitewash bg), `cal-2`, `piedra`, `pizarra` (slate/ink), `almagra` (red-earth accent), `almagra-claro` (accent on dark).
- Type: `font-serif` Source Serif 4 (optical sizes; headlines, emphasis only with almagra colour – never italics, `font-light` for long display text), `font-sans` Geist (body), `label` utility = Geist uppercase tracked. Geist Mono only inside the technical drawings (hero elevation, map).
- Photos/renders use the `graded` utility (subtle contrast/saturation lift). The client wants vivid colours: never desaturate or sepia-tone images.
- Shared animation helpers in `src/components/ui.tsx` (`MaskLines`, `Reveal`, `SectionLabel`, `NasridStar`). Trigger `whileInView` on a container that has a real size, never on an element that starts at scale 0 or hidden behind a mask (IntersectionObserver won't fire).
- Scroll locking must go through `lockScroll()` in `src/lib/smoothScroll.ts` (stops Lenis too).
- Headless Chrome reports `hover: none`; to test hover-only UI launch it with `--blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4`.

## Brand
- Logo: `src/components/Logo.tsx`, generated from `assets/logos/arrow-2-telos/04-editorial.svg` (cropped viewBox, `currentColor`). Use it in header, menu and footer.
- Header (`Nav.tsx`): simple fixed full-width bar, solid `bg-cal` + thin bottom border (never transparent). Current section highlighted in almagra (scroll spy via IntersectionObserver).
- Footer (`Footer.tsx` + `FooterAnimation.tsx`): Stanzza-like layout; full-width "line boil" animation cycling 4 ink frames (`public/footer/casa-1..4.webp`, made from `assets/animation/casa-dibujo-v2/imagen3-6.png`: same crop 2752x870+0+320, paper removed, ink as alpha tinted pizarra).

## Hero
- `GeometricGrid.tsx`: 10×7 modular grid with tangent (sigmoid) curves (inspired by happyrobot.ai) plus our own plan vocabulary: arcade of arches, hatched cells, dimension lines. Lines draw/erase from either end, curves flip tangent, almagra tracers run along lines; reference buildings reveal in single cells (always 1×1, never larger than a cell). On desktop it is absolutely positioned and bleeds under the headline (faded with a mask, images kept at `minImageCol` ≥ 3); on mobile a column crop (`columns={[3, 10]}`) sits below the text.
- Reference images: `src/data/references.ts` + `public/references/` (Wikimedia Commons, free licences, cropped square). Credits are listed in the footer and must be kept when adding/removing images.
- `HeroDrawing.tsx` (elevation village → contemporary house → block) sits below the hero and animates when scrolled into view.

## Commands
- `npm run dev` – dev server (port 3000, falls back to next free port)
- `npm run lint` – type check (`tsc --noEmit`, also covers `scripts/`)
- `npm run build` – production build
- `npm run images` – build project images: uses `assets/retouched/<id>-profesional.png` when present (or the `retouched` field), otherwise a local upscale of the original
- `npm run images -- --ai [--force] [--only=<slug>|<slug>/01.jpg]` – AI retouch with Gemini (needs `GEMINI_API_KEY` in `.env.local`; model overridable with `GEMINI_IMAGE_MODEL`)

## Projects
- Single source of truth: `src/data/projects.ts` (UI + image pipeline).
- Originals imported from the old site (https://www.andres-mata-caro.es/) live in `assets/originals/`; generated images go to `public/projects/<slug>/NN.jpg`.
- Generated JPEGs carry a comment `retouched`, `ai` or `local`; a higher-priority source replaces a lower one automatically (`--force` rebuilds all).
- Retouched images (made by the user) live in `assets/retouched/`; planning drawings have no retouched version on purpose.
- Images of kind `plan` are never sent to the AI (it would invent lines/labels). AI output must keep the real building geometry – review every result against its original.

## Deployment (Vercel)
- Project `andres-mata-caro` (team `carlos-projects-3203b073`), production URL https://andres-mata-caro.vercel.app. Deploy with `vercel deploy --prod` (Git integration not connected yet).
- Private preview: `middleware.ts` (Vercel Routing Middleware) applies HTTP Basic Auth with env vars `SITE_USER` / `SITE_PASSWORD` (Production + Preview). Deleting `SITE_PASSWORD` and redeploying makes the site public.
- `.vercelignore` excludes `assets/` (source images, ~100 MB) – the build only needs `public/`.
- Current domain andres-mata-caro.es: registered/DNS at IONOS (ui-dns nameservers), old site on IONOS MyWebsite, MX records point to IONOS mail.
