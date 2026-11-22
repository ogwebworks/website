# ogwebworks.com

Website for **OG WebWorks**: *Original. Digital. Solutions!*

See [ROADMAP.md](./ROADMAP.md) for strategy, sitemap and phases.

## Stack
- Next.js 16 (App Router, Server Components, Turbopack) + TypeScript
- Tailwind CSS v4 (design tokens in `src/app/globals.css`)
- Hero visual: CSS-3D laptop + SVG cards (`src/components/HeroVisual.tsx`, `.hv-*` styles) paints instantly on every device. On screens ≥1280px it is swapped for a real WebGL scene (`src/components/three/hero-scene.ts`, three.js) after the visitor's first mouse move or scroll: 3D laptop building a site live on its screen, glass growth bars, floating score/AI/fix cards, drag to spin, lid closes on scroll
- Growth city (`src/components/Stats.tsx` + `three/city-scene.ts`): pinned, scroll-driven WebGL skyline that rises as you scroll, cursor ripple, trend line; loads only when the section is near; CSS skyline fallback
- Immersive layer (`src/components/fx/`): custom cursor with labels (`data-cursor="Play"`), scroll progress bar, spotlight + tilt cards (`.fx-card` inside `<Spotlight>`), particle network canvas, magnetic footer wordmark, velocity-reactive marquee. Spotlight and ParticleField are adapted from the BizPlainly site
- Store (`src/components/store/`, data in `src/lib/store.ts`): services as products with layered glass "product shots" (`ProductVisual.tsx`, HTML/CSS/SVG, scaled from a 560×440 board), packages, "Add to plan". The plan (cart) lives in localStorage (`src/lib/plan.ts`); the header drawer turns it into a pre-filled proposal (services + note)
- Work ring (`src/components/work/`): portfolio carousel of the demos on a CSS-3D cylinder (drag, scroll nudge, snap); opens each live demo full screen (`DemoLightbox`)
- Intro curtain (`fx/IntroCurtain.tsx`): CSS-only first-visit intro on tablets/desktops, once per session
- UI sound (`fx/sound.ts`, `fx/SoundToggle.tsx`): synthesized Web Audio ticks/chimes, off by default
- Mobile budget: WebGL only on desktop with a mouse (≥1024px); particle canvases desktop-only; off-screen sections use `content-visibility: auto` and pause their CSS animations (`fx/AnimPauser.tsx`); rAF loops stop off-screen
- 3D rules: never probe WebGL during start-up (`three/support.ts`), respect reduced motion / Save-Data / low-memory devices, pause render loops off-screen
- Motion: `motion` (Framer Motion) + Lenis smooth scroll
- Hosting: **Cloudflare Workers (free plan, commercial use allowed)**. Static export (`out/`) served as Worker static assets, plus a tiny Worker (`worker/`) for the form API. Config: `wrangler.jsonc`

## Develop
```bash
npm install
npm run dev      # http://localhost:3000
npm run preview  # production build on the local Cloudflare Workers runtime (incl. form API)
npm run lint
```

## Deploy (Cloudflare Workers, free)
Dashboard → **Workers & Pages → Create → Import a repository** → `ogwebworks/website`:
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- The Worker name must match `"name"` in `wrangler.jsonc` (currently `website`)

Every push to the production branch deploys; other branches get preview versions.
Add `ogwebworks.com` under the Worker's **Settings → Domains & Routes**.

> Note: `npm run dev` serves pages but not the form API (that runs on Cloudflare). Use `npm run preview` to test the form locally.

## Structure
```
src/app/            layout, homepage, robots.ts, sitemap.ts, icon.svg
worker/             Cloudflare Worker entry + proposal form handler
wrangler.jsonc      Cloudflare Workers config (static assets from ./out)
public/_headers     security + caching headers for Cloudflare
src/components/     Header, Hero, HeroScene (3D), Pillars, Stats, Statement, Process,
                    AiCallout, Comparison, Pricing, Faq, ProposalForm, Footer
src/lib/site.ts     all copy, services and FAQ data (edit content here)
public/llms.txt     AI-crawler summary (GEO)
```

## Images
Image slots live in `src/lib/images.ts`; until a file exists, a labelled placeholder is shown.
1. Generate images with the prompts in [docs/IMAGE_PROMPTS.md](./docs/IMAGE_PROMPTS.md)
2. Save originals in `images-src/` as `<slot>.png` (e.g. `pillar-build.png`)
3. `npm run images` crops/compresses them into `public/images/`, then build/commit

## Before launch (TODO)
- [ ] Replace placeholder wordmark with the Phase 1 logo
- [ ] Confirm email address, prices and response-time promises in `src/lib/site.ts` / `Pricing.tsx`
- [ ] Wire `worker/proposal.ts` to email (Resend) and CRM via Worker secrets
- [ ] Privacy policy, terms and cookie consent (GDPR/CCPA)
- [ ] Analytics (GA4 + Search Console + Clarity)
- [ ] Add all 11 images (docs/IMAGE_PROMPTS.md), including the Open Graph image `og`
