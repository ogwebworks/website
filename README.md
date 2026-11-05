# ogwebworks.com

Website for **OG WebWorks**: *Original. Digital. Solutions!*

See [ROADMAP.md](./ROADMAP.md) for strategy, sitemap and phases.

## Stack
- Next.js 16 (App Router, Server Components, Turbopack) + TypeScript
- Tailwind CSS v4 (design tokens in `src/app/globals.css`)
- Hero visual: CSS-3D laptop + SVG growth/AI/score/fix cards (`src/components/HeroVisual.tsx`, styles `.hv-*` in `globals.css`), no WebGL, mouse parallax on desktop
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

## Before launch (TODO)
- [ ] Replace placeholder wordmark with the Phase 1 logo
- [ ] Confirm email address, prices and response-time promises in `src/lib/site.ts` / `Pricing.tsx`
- [ ] Wire `worker/proposal.ts` to email (Resend) and CRM via Worker secrets
- [ ] Privacy policy, terms and cookie consent (GDPR/CCPA)
- [ ] Analytics (GA4 + Search Console + Clarity)
- [ ] Open Graph image
