# Andrés Mata Caro – web de arquitectura

Vite + React 19 + Tailwind v4 + motion + Lenis (smooth scroll). Single page composed in `src/App.tsx` from `src/components/`.

## Design language ("entre la cal y el hormigón")
- Palette tokens in `src/index.css`: `cal` (whitewash bg), `cal-2`, `piedra`, `pizarra` (slate/ink), `almagra` (red-earth accent), `almagra-claro` (accent on dark).
- Type: `font-serif` Instrument Serif (headlines, italics in almagra for emphasis), `font-sans` Geist (body), `label` utility = Geist Mono uppercase for technical annotations.
- Photos/renders always use the `graded` utility to unify tone.
- Shared animation helpers in `src/components/ui.tsx` (`MaskLines`, `Reveal`, `SectionLabel`, `NasridStar`). Trigger `whileInView` on a container that has a real size, never on an element that starts at scale 0 or hidden behind a mask (IntersectionObserver won't fire).
- Scroll locking must go through `lockScroll()` in `src/lib/smoothScroll.ts` (stops Lenis too).
- Headless Chrome reports `hover: none`; to test hover-only UI launch it with `--blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4`.

## Commands
- `npm run dev` – dev server (port 3000, falls back to next free port)
- `npm run lint` – type check (`tsc --noEmit`, also covers `scripts/`)
- `npm run build` – production build
- `npm run images` – build missing project images locally (no AI)
- `npm run images -- --ai [--force] [--only=<slug>|<slug>/01.jpg]` – AI retouch with Gemini (needs `GEMINI_API_KEY` in `.env.local`; model overridable with `GEMINI_IMAGE_MODEL`)

## Projects
- Single source of truth: `src/data/projects.ts` (UI + image pipeline).
- Originals imported from the old site (https://www.andres-mata-caro.es/) live in `assets/originals/`; generated images go to `public/projects/<slug>/NN.jpg`.
- Generated JPEGs carry a comment `ai` or `local` identifying how they were produced.
- Images of kind `plan` are never sent to the AI (it would invent lines/labels). AI output must keep the real building geometry – review every result against its original.
