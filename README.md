# ogwebworks.com

Website for **OG WebWorks**: *Original. Digital. Solutions!*

See [ROADMAP.md](./ROADMAP.md) for strategy, sitemap and phases.

## Stack
- Next.js 16 (App Router, Server Components, Turbopack) + TypeScript
- Tailwind CSS v4 (design tokens in `src/app/globals.css`)
- 3D: three.js + React Three Fiber + drei (`src/components/HeroScene.tsx`), lazy-loaded after idle, paused off-screen, skipped for reduced motion
- Motion: `motion` (Framer Motion) + Lenis smooth scroll
- Hosting: **Cloudflare Pages (free plan, commercial use allowed)**. Fully static export (`out/`) + a Pages Function for the form (`functions/api/proposal.ts`)

## Develop
```bash
npm install
npm run dev      # http://localhost:3000
npm run preview  # production build served by Cloudflare's runtime (incl. form API) on :8788
npm run lint
```

## Deploy (Cloudflare Pages, free)
1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → pick `ogwebworks/website`.
2. Framework preset: **None** · Build command: `npm run build` · Output directory: `out`.
3. Environment variable: `NODE_VERSION` = `22`.
4. Deploy. Every branch gets a preview URL; set the production branch to `main`.
5. **Custom domains** → add `ogwebworks.com` (easiest if the domain's DNS is on Cloudflare).

> Note: `npm run dev` serves pages but not the form API (that runs on Cloudflare). Use `npm run preview` to test the form locally.

## Structure
```
src/app/            layout, homepage, robots.ts, sitemap.ts, icon.svg
functions/api/      Cloudflare Pages Function for the proposal form
public/_headers     security + caching headers for Cloudflare
src/components/     Header, Hero, HeroScene (3D), Pillars, Stats, Statement, Process,
                    AiCallout, Comparison, Pricing, Faq, ProposalForm, Footer
src/lib/site.ts     all copy, services and FAQ data (edit content here)
public/llms.txt     AI-crawler summary (GEO)
```

## Before launch (TODO)
- [ ] Replace placeholder wordmark with the Phase 1 logo
- [ ] Confirm email address, prices and response-time promises in `src/lib/site.ts` / `Pricing.tsx`
- [ ] Wire `functions/api/proposal.ts` to email (Resend) and CRM via Pages environment variables
- [ ] Privacy policy, terms and cookie consent (GDPR/CCPA)
- [ ] Analytics (GA4 + Search Console + Clarity)
- [ ] Open Graph image
