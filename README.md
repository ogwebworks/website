# ogwebworks.com

Website for **OG WebWorks**: *Original. Digital. Solutions!*

See [ROADMAP.md](./ROADMAP.md) for strategy, sitemap and phases.

## Stack
- Next.js 16 (App Router, Server Components, Turbopack) + TypeScript
- Tailwind CSS v4 (design tokens in `src/app/globals.css`)
- 3D: three.js + React Three Fiber + drei (`src/components/HeroScene.tsx`), lazy-loaded after idle, paused off-screen, skipped for reduced motion
- Motion: `motion` (Framer Motion) + Lenis smooth scroll
- Deploy target: Vercel (Pro plan, since the site is commercial)

## Develop
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
npm run lint
```

## Structure
```
src/app/            layout, homepage, robots.ts, sitemap.ts, icon.svg, api/proposal
src/components/     Header, Hero, HeroScene (3D), Pillars, Stats, Statement, Process,
                    AiCallout, Comparison, Pricing, Faq, ProposalForm, Footer
src/lib/site.ts     all copy, services and FAQ data (edit content here)
public/llms.txt     AI-crawler summary (GEO)
```

## Before launch (TODO)
- [ ] Replace placeholder wordmark with the Phase 1 logo
- [ ] Confirm email address, prices and response-time promises in `src/lib/site.ts` / `Pricing.tsx`
- [ ] Wire `/api/proposal` to email (Resend) and CRM via environment variables
- [ ] Privacy policy, terms and cookie consent (GDPR/CCPA)
- [ ] Analytics (GA4 + Search Console + Clarity)
- [ ] Open Graph image
