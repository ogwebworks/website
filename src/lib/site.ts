export const site = {
  name: "OG WebWorks",
  legalName: "OG WebWorks",
  url: "https://ogwebworks.com",
  tagline: "Original. Digital. Solutions!",
  description:
    "OG WebWorks is a digital agency building fast, original websites and growing them with SEO, AEO, GEO and paid ads, plus maintenance and emergency website fixes.",
  email: "hello@ogwebworks.com", // TODO: confirm real inbox
};

export type Service = {
  slug: string;
  title: string;
  short: string;
  pillar: "build" | "grow" | "fix";
};

export const services: Service[] = [
  { slug: "website-development", title: "Website Development", short: "Custom, lightning-fast sites built on modern stacks.", pillar: "build" },
  { slug: "website-maintenance", title: "Website Maintenance", short: "Updates, backups, security and monitoring on autopilot.", pillar: "build" },
  { slug: "brand-development", title: "Brand Development", short: "Logos, identity systems and a voice people remember.", pillar: "build" },
  { slug: "seo", title: "SEO", short: "Technical, on-page and content SEO that compounds.", pillar: "grow" },
  { slug: "aeo", title: "AEO", short: "Win answer boxes, featured snippets and voice results.", pillar: "grow" },
  { slug: "geo", title: "GEO", short: "Get cited by ChatGPT, Perplexity, Gemini and Claude.", pillar: "grow" },
  { slug: "ads-management", title: "Ads Management", short: "Google, Meta and LinkedIn campaigns built for ROAS.", pillar: "grow" },
  { slug: "website-error-resolution", title: "Error Resolution", short: "Broken, hacked or down? We diagnose and fix fast.", pillar: "fix" },
  { slug: "malware-cleanup", title: "Hack & Malware Cleanup", short: "Remove infections, close the holes, restore trust.", pillar: "fix" },
  { slug: "speed-optimization", title: "Speed Optimization", short: "Pass Core Web Vitals and stop losing impatient visitors.", pillar: "fix" },
];

export const pillars = [
  {
    id: "build",
    word: "Original.",
    title: "Build",
    blurb: "Hand-crafted websites and brands. Zero templates, all intent.",
    accent: "var(--color-brand)",
  },
  {
    id: "grow",
    word: "Digital.",
    title: "Grow",
    blurb: "Search, AI visibility and ads that turn traffic into revenue.",
    accent: "var(--color-azure)",
  },
  {
    id: "fix",
    word: "Solutions!",
    title: "Fix",
    blurb: "Errors, outages and hacks resolved, then kept from coming back.",
    accent: "var(--color-ice)",
  },
] as const;

export const faqs = [
  {
    q: "What does OG WebWorks do?",
    a: "OG WebWorks is a digital agency that designs and develops custom websites, builds brands, and grows them through SEO, AEO (answer engine optimization), GEO (generative engine optimization) and paid ads. We also offer monthly website maintenance and fast one-off error resolution.",
  },
  {
    q: "What is the difference between SEO, AEO and GEO?",
    a: "SEO helps you rank in traditional search results. AEO structures your content so search engines can lift it into answer boxes, featured snippets and voice results. GEO makes your brand easy for AI assistants like ChatGPT, Perplexity, Gemini and Claude to understand, trust and cite. A complete strategy covers all three.",
  },
  {
    q: "Do you work with clients internationally?",
    a: "Yes. We work remotely with businesses worldwide, quote in USD, and schedule calls in your time zone.",
  },
  {
    q: "How long does a website take?",
    a: "A typical marketing website takes 4–8 weeks from discovery to launch, depending on page count, content readiness and integrations. Small landing pages can ship in 1–2 weeks.",
  },
  {
    q: "My site is broken right now. Can you help?",
    a: "Yes. Use the Emergency Fix option in the proposal form, tell us what's wrong and share the URL. We diagnose the issue, give you a fixed quote, and fix it, from white screens and 500 errors to hacked sites and broken forms.",
  },
  {
    q: "Will I own my website?",
    a: "Always. You own your domain, code, content and every account we set up. No lock-in, no hostage situations.",
  },
];

// "Who we help" tiles. TODO: confirm target industries (ROADMAP §12).
export const industries = [
  { slug: "ecommerce", image: "industry-ecommerce", title: "E-commerce", text: "Fast stores that rank, convert and recover abandoned carts." },
  { slug: "healthcare", image: "industry-healthcare", title: "Clinics & healthcare", text: "Trustworthy sites with online booking and local SEO." },
  { slug: "professional", image: "industry-professional", title: "Professional services", text: "Law, finance and consulting brands that win the first call." },
  { slug: "saas", image: "industry-saas", title: "SaaS & startups", text: "Launch-ready marketing sites built to scale with you." },
] as const;
