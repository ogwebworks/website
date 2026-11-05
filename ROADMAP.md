# OG WebWorks — Website Roadmap

**Domain:** ogwebworks.com
**Tagline:** *Original. Digital. Solutions!*
**Services:** Website development & maintenance · Brand development · SEO · AEO · GEO · Ads campaign management · Website error resolution
**Status:** Planning (v1.1 · November 2026)

---

## 1. Summary

The site has one job: **turn visitors into booked strategy calls and proposal requests.** Big agencies like WebFX do this with three things, and we will use all three at our own scale:

1. **Proof everywhere.** Results counters, case studies with numbers, review badges, client logos.
2. **One clear next step on every screen.** "Get a Free Proposal", repeated across the site and kept in a sticky header.
3. **Content and free tools that bring in search traffic,** such as a free website audit and a pricing guide.

Where we differ: we can't claim WebFX's scale (700+ staff, $10B+ in client revenue), and we shouldn't pretend to. A small agency wins on **speed, direct access to senior people, honest pricing, and visible craft.** The site itself is the main portfolio piece. It has to be fast, clear, accessible and easy for AI tools to cite. If we sell SEO, AEO and GEO, our own site must show them working.

---

## 2. Research: what large agency sites do

### 2.1 WebFX (main reference)
| Pattern | What they do | How we adapt it |
|---|---|---|
| **Big results counters** | The homepage shows "$10,085,355,239+ revenue driven" and "24.8M+ leads" | Show **real** numbers only: projects shipped, average speed score gained, bugs fixed, hours to first response. If we have none yet, use a "Our standards" strip (e.g. "Sites launch with 95+ Lighthouse scores") |
| **Own software platform** | They sell RevenueCloudFX as a reason to choose them | Start small: a free **"OG Site Check"** audit tool (§6.3), then a client dashboard later |
| **Review volume** | They show thousands of reviews (Clutch, Google) | From day one: Google Business Profile, Clutch, DesignRush and Trustpilot profiles, plus a script for asking every client for a review |
| **Published prices** | Pricing pages for most services; reviewers call this rare and praise it | Publish **"starting at"** prices and maintenance tiers. This builds trust and pre-qualifies leads |
| **Mega-menu navigation** | Services grouped by category, each with icons and short descriptions | A mega menu with 3 columns: Build · Grow · Fix |
| **Case studies with numbers** | "+378% organic revenue", "$300K SEO revenue in 1 month" | Problem → Approach → Result layout, with numbers, screenshots and a client quote |
| **Huge resource library** | Thousands of blog posts and guides that rank in search | A focused set of topic clusters (§8), aiming for depth over volume |
| **"Free proposal" CTA** | A long form, repeated on every page | A **multi-step** form (3–4 short steps), which is less intimidating |

### 2.2 Other reference agencies
- **Ignite Visibility:** positions itself as award-winning and leans on certifications and partner badges (Google Partner, Meta Partner). → We'll show certifications once we earn them; Google Ads and Meta Blueprint certifications are free.
- **Disruptive Advertising:** built its reputation on review volume ("most-reviewed agency") and on ad spend managed. → For our Ads service, show ad spend managed and ROAS once we have them.
- **Thrive Agency:** positions as full-service, combining web, design and marketing with a focus on conversion. → This is closest to our own service mix.
- **Single Grain:** an ROI-focused message and founder-led content (podcast, YouTube). → Founder-led content is the cheapest way for a small agency to build authority.

### 2.3 What 2026 best-practice sources agree on
- **Speed affects conversions about as much as clarity does**, and page experience still counts for SEO.
- **Mobile-first**, a clear visual hierarchy, lots of white space ("Minimalism 3.0"), and **one main CTA per section**.
- **Sticky CTAs**, F-pattern scanning (put key words at the start of headings), and strong trust signals placed near CTAs.
- **Judge trends by conversion data, not looks.** Award-winning visuals often hurt conversion rates.
- **AI search has changed SEO:** agencies now bundle AEO/GEO as llms.txt, schema markup, answer-first content, AI-crawler audits and citation tracking across ChatGPT, Perplexity, Gemini and Claude.

> **Research note:** the cloud session's network blocked direct visits to webfx.com, disruptiveadvertising.com and ignitevisibility.com. These findings come from search results, review sites (G2, Clutch-based reviews) and WebFX's indexed pages. Before we design, it's worth an hour of manual browsing to screenshot their hero, nav, footer and form patterns into a mood board.

---

## 3. Brand foundation (before any design)

### 3.1 Positioning statement
> OG WebWorks builds fast, original websites and runs the search and ads work behind them, for businesses that want senior-level craft without big-agency overhead.

### 3.2 Brand story hooks
- **"OG" = Original.** It links straight to the tagline and reads as confident and modern. Two notes: some audiences hear "OG" as slang, and "OG" alone can be read as "Open Graph". Neither is a problem, but keep "WebWorks" visible so the name stays clear.
- **The tagline's three beats map onto the site:**
  - **Original.** Custom design, no templates. → *Brand & Web*
  - **Digital.** Search, AI visibility, ads. → *Growth*
  - **Solutions!** Fixes, maintenance, support. → *Care & Repair*
- **About the "!":** it reads as energetic and fits a hero line. In formal places (legal footer, invoices) consider writing it as a period. Keep it consistent within each context.

### 3.3 Visual direction (proposal)
| Element | Direction |
|---|---|
| **Palette** | Deep ink/navy base (#0B1020), an electric brand accent (e.g. #3D5AFE or a lime #C6F432 for an "OG" edge), a warm secondary for CTAs, and neutral greys. Full light and dark themes |
| **Type** | A distinctive headline font (e.g. *Clash Display*, *Space Grotesk* or *Satoshi*) with a readable body font (*Inter*). Self-host the fonts so they load fast |
| **Motifs** | A code-bracket or "<OG/>" mark, grid lines and blueprint textures (the "works" idea), subtle scroll-reveal motion |
| **Imagery** | Real team photos and real project screenshots in device frames. **No generic stock photos of people shaking hands** |
| **Voice** | Plain, confident, a little bold. Short sentences. Numbers instead of adjectives |

**Deliverables:** logo (primary, icon and monochrome versions), colour and type tokens, a one-page brand guide, social templates, favicon and OG image.

---

## 4. Information architecture (sitemap)

```
/                                   Home
/services/                          Services hub
  ├─ Build (Original)
  │   /services/website-development/
  │   /services/website-maintenance/        ← tiers + pricing
  │   /services/brand-development/
  ├─ Grow (Digital)
  │   /services/seo/
  │   /services/aeo/                         ← Answer Engine Optimization
  │   /services/geo/                         ← Generative Engine Optimization
  │   /services/ads-management/              (Google, Meta, LinkedIn, TikTok)
  └─ Fix (Solutions!)
      /services/website-error-resolution/    ← "Emergency Fix" fast lane
      /services/speed-optimization/          (optional, later)
/work/                              Portfolio / case studies
  /work/[case-study]/
/pricing/                           All "starting at" prices + maintenance plans
/free-site-check/                   Lead-magnet audit tool
/about/                             Story, team, values, process
/process/                           How we work (can live inside About for v1)
/resources/                         Blog + guides
  /resources/[slug]/
  /resources/glossary/              (SEO / AEO / GEO terms, good for AI citations)
/contact/  →  /get-a-proposal/      Multi-step proposal form + Calendly
/careers/                           (later)
/industries/[industry]/             (Phase 3: e.g. dentists, law firms, e-commerce)
/locations/[city]/                  (Phase 3, only if targeting local SEO)
/privacy/  /terms/  /cookies/
/llms.txt  /sitemap.xml  /robots.txt
```

**Main nav:** Services ▾ (mega menu) · Work · Pricing · Free Site Check · Resources · About · **[Get a Free Proposal]** (button)
**Utility bar (optional):** phone · WhatsApp · "Site down? Emergency fix →"

---

## 5. Page blueprints

### 5.1 Homepage (section order)
1. **Sticky header:** logo, mega menu, CTA button, and a hamburger menu on mobile.
2. **Hero:**
   - H1: *"Original websites. Digital growth. Real solutions."* (or the tagline itself)
   - Sub: one sentence on who we help and the result.
   - CTA 1: **Get a Free Proposal** · CTA 2: **Run a Free Site Check** (URL input placed in the hero, the WebFX/HubSpot-style capture)
   - Visual: animated device mockup of real work, or a live "site score" demo.
3. **Trust strip:** client logos, Google rating, Clutch badge, certifications.
4. **Three pillars (Build / Grow / Fix):** cards in a bento grid, each linking to its services.
5. **Results counters:** real numbers only (see §2.1).
6. **Featured case studies:** 2–3 cards with one big number each.
7. **"Why OG" comparison:** OG WebWorks vs. big agency vs. freelancer (price, speed, access to senior people, ownership of the site). This is a strong differentiator.
8. **Process:** Discover → Design → Build → Launch → Grow (5 steps).
9. **AI-search callout:** "Is ChatGPT recommending your competitors?" → AEO/GEO service. A timely hook.
10. **Testimonials:** video if possible, text with photo and name otherwise.
11. **Pricing teaser:** "Websites from $X · Care plans from $Y/mo" → /pricing.
12. **FAQ:** 6–8 questions, marked up with FAQPage schema (good for AEO).
13. **Final CTA band** and a short form.
14. **Footer:** services, company, resources, contact, address/NAP, socials, badges, newsletter, legal.

### 5.2 Service page template (one template for all services)
1. Hero: outcome-led H1, a short answer paragraph (40–60 words, written so AI tools can quote it), and a CTA.
2. Problems we solve (pain points).
3. What's included (deliverables checklist).
4. Process and timeline.
5. A relevant case study.
6. Pricing ("starting at", with what drives the cost).
7. Tools and platforms we use (logos).
8. FAQs (with schema).
9. Related services (cross-sell: SEO ↔ AEO ↔ GEO, Web ↔ Maintenance).
10. CTA band.

### 5.3 Website Error Resolution: the "Emergency Fix" fast lane
This is a strong differentiator, because most big agencies don't take one-off fixes.
- A short form: URL, what's broken, a screenshot upload, urgency (Today / This week).
- Clear SLA wording, e.g. *"Response within 2 business hours."* Promise only what we can actually deliver.
- A flat fee per diagnosis, or fixed fix packages (e.g. "White screen / 500 error", "Hacked site cleanup", "Broken forms", "SSL / redirect issues").
- Upsell to a maintenance plan after the fix.

### 5.4 Maintenance pricing (draft, based on 2026 market ranges)
Market research shows maintenance usually costs **$25–$600+/month**, often split into Basic ($50–150), Standard ($150–350) and Premium ($300–1,000, with an SLA and development hours). Suggested tiers:

| | **Essential** | **Growth** | **Priority** |
|---|---|---|---|
| Suggested price | $49–79/mo | $149–199/mo | $349+/mo |
| Core, plugin and theme updates | ✓ | ✓ | ✓ |
| Daily off-site backups | Weekly | Daily | Daily + on-demand |
| Uptime and security monitoring | ✓ | ✓ | ✓ |
| Monthly report | ✓ | ✓ + SEO snapshot | ✓ + strategy call |
| Development or content edits | – | 1 hr/mo | 3 hrs/mo |
| Response time (SLA) | 2 business days | 1 business day | 4 business hours |
| Malware cleanup | Paid | Included | Included |

Adjust these to your market. Prices in PKR, GBP and USD differ a lot, so decide which market you're targeting (see §12).

---

## 6. How the site converts visitors

### 6.1 CTA ladder (from small asks to big ones)
| Visitor intent | Offer |
|---|---|
| Just browsing | Newsletter, guides, glossary |
| Curious | **Free Site Check** (instant automated report) |
| Evaluating | Pricing page, case studies, comparison table |
| Ready | **Get a Free Proposal** (multi-step form) and **Book a 20-min call** (Calendly / Cal.com) |
| Urgent | **Emergency Fix** form, WhatsApp, phone |

### 6.2 Multi-step proposal form
Step 1: What do you need? (service checkboxes) → Step 2: Website URL and business type → Step 3: Budget range and timeline → Step 4: Name, email, phone. Show a progress bar and save each step as it's completed, so we can follow up on half-finished forms. Send leads to a CRM (HubSpot free tier, Zoho or Pipedrive) and email or WhatsApp a notification.

### 6.3 Free "OG Site Check" tool (lead magnet)
- The visitor enters a URL. We check speed (PageSpeed Insights API), SEO basics (title, meta, H1, schema), mobile, SSL, and an **AI-readiness** score (schema, llms.txt, crawlability for AI bots).
- Show the summary straight away. The full PDF report requires an email (the gate).
- Multi-signal scorecards are more convincing than a single number.
- **v1 option:** embed a white-label widget (SE Ranking, BrightLocal or MySiteAuditor) so we can launch quickly. **v2:** build our own on serverless functions.

### 6.4 Trust boosters placed near CTAs
Review stars, "No long-term contracts", "You own your site and accounts", response-time promise, privacy note under forms.

---

## 7. Tech stack

### 7.1 Decision: Next.js, hosted free on Cloudflare Workers (v1.2)
| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router, React Server Components, TypeScript)** | One codebase for the marketing site *and* the products we'll add later (Site Check tool, client portal, dashboards). Next.js is also a skill international clients ask for, so our own site sells it |
| Styling | **Tailwind CSS** + design tokens (+ shadcn/ui for accessible primitives) | Fast to build and consistent |
| CMS | **Sanity** (or MDX in the repo for v1) | Non-developers can edit blog posts and case studies; works with Next.js Draft Mode for previews |
| Hosting | **Cloudflare Workers, free plan** (static assets) | $0, commercial use allowed, free static-asset requests, global CDN, preview versions per branch. The site is a static export; the form runs in a small Worker (100k requests/day free). Vercel Hobby was ruled out because it is non-commercial only, and Pro (~$20/user/mo) was declined |

**Performance rules for Next.js** (Next ships a React runtime, so speed takes some discipline):
- Server Components by default. Use `"use client"` only for real interactivity (menu, forms, Site Check).
- Generate marketing pages statically (SSG/ISR); no per-request rendering for content.
- Use `next/font` and `next/image`, and lazy-load third-party scripts with `next/script` (`lazyOnload`). Load analytics and chat after user interaction.
- Animations: CSS first. Load Framer Motion/GSAP only in the components that use them.
- JS budget: ≤ 250 KB of gzipped JS on first load (measured: React/Next runtime ≈ 150 KB + Motion ≈ 70 KB + app code). Heavy 3D (Three.js ≈ 265 KB gz) **must** stay lazy-loaded after the page becomes interactive and is skipped for reduced-motion users. Enforce with Lighthouse CI on every pull request.
- **3D policy (from Lighthouse audit, Nov 2026):** real WebGL only on desktop with a mouse, ≥4 CPU cores and ≥4 GB RAM, no data-saver, started on first interaction. Phones get a CSS-only 3D orb (compositor animations, zero JS). Result: mobile Performance 47 → 93, desktop 59 → 98, Accessibility 100.

*Alternative we considered:* Astro has the better default performance for content sites (it ships no JS by default) and is backed by Cloudflare since its January 2026 acquisition. We chose Next.js for how far it can grow as an app platform. If we ever want both, a split works: Astro for the marketing pages and Next.js at `app.ogwebworks.com`.
| Forms / backend | Serverless functions + **Resend** (email) + CRM webhook | No server to maintain |
| Analytics | **GA4** + **Google Search Console** + **Microsoft Clarity** (heatmaps, free) + optionally Plausible | Shows both the numbers and the behaviour behind them |
| Booking | Cal.com or Calendly embed | |
| Chat | WhatsApp click-to-chat (important in South Asian and Middle Eastern markets); an AI chat assistant later | |

### 7.2 Another view: WordPress
We **sell** WordPress maintenance, so there's a case for building our own site on WordPress, since it shows we know the platform. Trade-offs:
- **WordPress (custom block theme or Bricks/Elementor):** easier for non-developers to edit and shows WP skill, but it's slower by default, needs ongoing patching, and has more security risk.
- **Astro:** best speed and security, and the site itself is evidence of performance work. The cost is that editing needs a headless CMS.
- **Suggestion:** Astro for the agency site, plus a portfolio section of WP builds to show WordPress skill. Decide this in Phase 0.

### 7.3 Non-negotiable quality targets
| Metric | Target |
|---|---|
| LCP | < 2.0 s (Google's "good" is < 2.5 s) |
| INP | < 150 ms (Google's official "good" is < 200 ms; some 2026 sources say Google tightened it to 150 ms, so aim lower to be safe) |
| CLS | < 0.05 (official < 0.1) |
| Lighthouse | 95+ in all four categories |
| Accessibility | **WCAG 2.2 AA**: keyboard navigation, contrast, focus states, alt text, respect for reduced-motion settings |
| Page weight | < 1 MB on the homepage; AVIF/WebP images; self-hosted, subset fonts |
| Security | HTTPS, HSTS, CSP headers, spam protection on forms (Turnstile / honeypot) |
| Privacy | Cookie consent (GDPR/CCPA if targeting EU/US), privacy policy, consent mode for GA4 |

---

## 8. SEO, AEO and GEO for our own site

**Why it matters:** this is our own proof that the service works. If prospects ask ChatGPT for "website agency in [city]" and we appear, that's the best sales pitch we can make.

### 8.1 Technical
- Clean URLs, XML sitemap, canonical tags, breadcrumbs, internal linking between topic clusters.
- **Schema (JSON-LD):** `Organization`, `ProfessionalService`/`LocalBusiness`, `WebSite`, `Service` (one per service page), `FAQPage`, `Article`, `BreadcrumbList`, `Review`/`AggregateRating` (only for real reviews and following Google's rules), `Person` (founders, which helps with E-E-A-T).
- **robots.txt:** decide on purpose which AI crawlers to allow (GPTBot, ClaudeBot, PerplexityBot, Google-Extended). For a GEO agency, allowing them is usually the right call.
- **/llms.txt:** a short Markdown summary of the agency, its services and key pages. Note that it's a proposed standard and it isn't confirmed that major AI platforms read it. It costs almost nothing to add, but don't promise clients results from it.

### 8.2 Content (answer-first)
- Every service page and post opens with a **direct 40–60-word answer**, followed by detail. Use question-style H2s ("What is GEO?", "How much does website maintenance cost?").
- Make the facts specific and checkable: numbers, dates, named tools. AI tools prefer to cite clear claims.
- Name the authors with bios and credentials (E-E-A-T).

### 8.3 Topic clusters (first 30–40 articles)
| Cluster | Example pillar | Example supporting posts |
|---|---|---|
| Website cost & dev | "How much does a website cost in 2026?" | WordPress vs. custom, Astro vs. WordPress, site launch checklist |
| Maintenance & errors | "Website maintenance: the complete guide" | Fixing the WordPress white screen, 500 errors, hacked-site recovery |
| SEO | "SEO for small businesses" | Local SEO, Core Web Vitals, technical SEO checklist |
| AEO / GEO | "GEO vs AEO vs SEO explained" | How to get cited by ChatGPT, the llms.txt guide, schema for AI |
| Ads | "Google Ads vs Meta Ads for small business" | Budgets, ROAS benchmarks, landing pages |
| Branding | "Brand identity checklist" | Logo, brand voice, rebranding signals |

### 8.4 Off-site
Google Business Profile, agency directories (Clutch, DesignRush, GoodFirms, Sortlist), LinkedIn company page, founder posting on LinkedIn and X, guest posts, being quoted in roundups (HARO-style platforms), and **review generation**. Reviews and mentions on third-party sites are among the strongest GEO signals.

---

## 9. If we have no case studies yet

This is the usual problem for a new agency, and there are honest ways around it:
1. **Rebuild concept work:** redesign 2–3 real local businesses' sites as concepts, clearly labelled *"Concept"*.
2. **Pro-bono or discounted founding clients:** 2–3 projects in exchange for a detailed case study and a video testimonial.
3. **Past work** by the founders (with permission).
4. **Use our own site as case study #1:** "How we built a 100/100 Lighthouse agency site".
5. **Never** invent stats, logos or reviews. It's unethical, can be illegal (the FTC's fake-review rule in the US, consumer-protection laws elsewhere), and buyers can tell.

---

## 10. Phased timeline

| Phase | Weeks | Work | Output |
|---|---|---|---|
| **0. Discovery** | 1 | Target market and geography, competitor audit (WebFX plus 3 local competitors), keyword research, stack decision, pricing decision | Strategy brief, sitemap sign-off |
| **1. Brand** | 2–3 | Logo, palette, type, voice, brand guide | Brand kit |
| **2. Content** | 2–4 (in parallel) | Homepage and service page copy, About story, FAQs, 3–5 launch blog posts, case studies or concepts | Copy deck |
| **3. UX/UI design** | 3–5 | Wireframes (mobile first) → high-fidelity Figma designs → design system (components, tokens, dark mode) | Figma file |
| **4. Build (MVP)** | 5–8 | Next.js + Vercel setup, components, Home, Services ×7, Work, Pricing, About, Contact/Proposal, Blog, legal pages, schema, analytics, forms → CRM | Staging site |
| **5. QA & launch** | 9 | Cross-browser and device testing, Lighthouse and accessibility audits, 301 redirects (if replacing an old site), Search Console, GBP, launch announcement | **Live ogwebworks.com** |
| **6. Growth** (ongoing) | Months 3–12 | Free Site Check tool v1 → v2, 4–8 posts/month, industry and location pages, A/B testing the hero and CTAs, video testimonials, client portal, AI chat assistant | Monthly KPI reports |

**MVP scope (what must be ready at launch):** Home, 7 service pages, Pricing, Work (even with 2–3 items), About, Get-a-Proposal, Emergency Fix form, 3+ blog posts, legal pages, schema, analytics.
**Can wait until after launch:** Free Site Check (custom version), industry and location pages, careers, client portal, chatbot.

---

## 11. KPIs to track

| KPI | 90-day target (indicative) |
|---|---|
| Lighthouse (all categories) | 95+ |
| Visitor → lead conversion rate | 2–5% |
| Proposal form completion (step 1 → submit) | > 40% |
| Free Site Check runs → emails collected | > 25% |
| Organic sessions | Steady month-on-month growth; first top-10 rankings for long-tail terms |
| AI citations | Tracked manually or with a tool: prompts like "best web agency for X" in ChatGPT, Perplexity, Gemini and Claude |
| Google reviews | 10+ |
| Leads → booked calls → closed deals | Tracked in the CRM |

---

## 12. Decisions

### Decided (v1.1)
- ✅ **Market: international.** This means USD pricing (with a GBP/EUR display toggle later), English first, GDPR and CCPA-ready consent and privacy pages, and time-zone-friendly booking (Cal.com showing the visitor's local time). We'll target "industry + service" keywords rather than city keywords, and use Clutch, DesignRush and G2-style directories for trust. Add hreflang and translated pages only once there's demand from a market.
- ✅ **Logo: none yet.** The full identity gets designed in Phase 1 (logo system, palette, type, brand guide) before UI design starts.
- ✅ **Stack: Next.js, static export on Cloudflare Workers (free)** (see §7.1). Revisit when we build app features (client portal, live Site Check): options then are OpenNext on Cloudflare Workers, or a paid host.

### Still open
1. **Ideal clients:** any industries you want to focus on (e.g. e-commerce, clinics, real estate, SaaS)?
2. **Portfolio:** how many real projects and testimonials can we show today?
3. **Pricing transparency:** comfortable publishing "starting at" prices (recommended)?
4. **CRM and booking:** any existing tools (HubSpot, Zoho, Calendly)?
5. **Team page:** real photos and names of the founder or team (strongly recommended for trust and E-E-A-T)?
6. **Contact channels:** phone, WhatsApp, email, physical address?

---

## 13. Sources

- [WebFX homepage](https://www.webfx.com/) · [WebFX Results](https://www.webfx.com/about/results/) · [RevenueCloudFX](https://www.webfx.com/technology/revenuecloudfx/) · [WebFX on LinkedIn](https://www.linkedin.com/company/webfxinc/)
- [WebFX Review 2026 (Ryze)](https://www.get-ryze.ai/blog/webfx-review-2026) · [WebFX Pricing Explained (Ryze)](https://www.get-ryze.ai/blog/webfx-pricing-explained-2026) · [WebFX on G2](https://www.g2.com/products/webfx/pricing) · [checkthat.ai WebFX](https://checkthat.ai/brands/webfx)
- [Best digital marketing agencies (eComposer)](https://ecomposer.io/blogs/comparison/best-digital-marketing-agencies) · [Thrive Agency list](https://thriveagency.com/news/best-digital-marketing-agencies/) · [Single Grain list](https://www.singlegrain.com/marketing-agencies) · [NinjaPromo full-service agencies](https://ninjapromo.io/best-full-service-digital-marketing-agencies)
- [Clutch: web design trends that convert](https://clutch.co/resources/web-design-trends-convert) · [Redberries: high-converting design 2026](https://redberries.ae/web-design-dos-and-donts-what-high-converting-websites-do-differently/) · [TechWyse: what makes a site convert](https://www.techwyse.com/blog/website-design/what-makes-a-website-convert-8-design-strategies-that-work) · [Linear Design](https://lineardesign.com/blog/how-to-design-a-website-that-actually-sells-stuff/) · [webdew](https://www.webdew.com/blog/web-design-trends-for-conversions)
- [FirstPier: GEO services 2026](https://www.firstpier.com/resources/generative-engine-optimization-geo-services) · [Fuel Online: AI SEO / GEO](https://fuelonline.com/ai-seo-geo-services) · [TripleDart: GEO agencies](https://www.tripledart.com/ai-seo/best-generative-engine-optimization-agencies) · [Hurra: LLMO & GEO](https://www.hurra.com/en/services/organic/llmo-geo-agency) · [llms.txt agency guide](https://blog-aiwhitelabel.pages.dev/posts/llms-new-robotstxt-ai-engines-agency-guide-2026/)
- [Belov Digital: WP maintenance plans](https://belovdigital.agency/wordpress-maintenance-plans-explained-whats-worth-paying-for/) · [FatLab: maintenance packages compared](https://fatlabwebsupport.com/blog/website-maintenance/website-maintenance-packages-compared-your-complete-buyers-guide/) · [Seahawk: maintenance packages 2026](https://seahawkmedia.com/?p=413926) · [Websults pricing](https://websults.com/web-development/maintenance/pricing/)
- [Vercel: improve Core Web Vitals](https://vercel.com/kb/guide/how-to-improve-core-web-vitals) · [StudioMeyer: CWV 2026](https://studiomeyer.io/en/blog/core-web-vitals-2026) · [Core Web Vitals 2026 changes](https://freeseoaudit.vercel.app/blog/core-web-vitals-2026) · [eSEOspace: CWV 2026](https://eseospace.com/blog/core-web-vitals-in-2026-what-changed-what-still-matters-and-how-to-pass/)
- [Insites: audit tool for agency leads](https://insites.com/blog/how-agencies-use-a-free-white-label-seo-audit-tool-to-generate-leads-on-autopilot/) · [BrightLocal Agency Lead Generator](https://help.brightlocal.com/hc/en-us/articles/360000561648-How-does-the-Agency-Lead-Generator-Widget-work) · [SE Ranking lead generator](https://help.seranking.com/en/seo-tools/lead-generator/overview) · [Why single-score audit tools underperform](https://dev.to/webperfdev/why-your-agencys-free-website-audit-tool-is-costing-you-clients-19m)

*Note: many sources are agency marketing content. Figures marked as third-party claims (e.g. INP 150 ms, llms.txt citation boosts) aren't independently verified, and the roadmap plans around them conservatively.*
