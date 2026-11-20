/** "The OG Store": services presented as products. Pricing is quoted per project (see Pricing, hidden for now). */
export type ProductId = "website" | "brand" | "seo" | "ai" | "ads" | "care";

export type Product = {
  id: ProductId;
  name: string;
  category: string;
  tagline: string;
  description: string;
  tiers: { name: string; detail: string; time: string; formService: string }[];
  includes: string[];
};

export const products: Product[] = [
  {
    id: "website",
    name: "The Website",
    category: "Build",
    tagline: "Designed from a blank page. Engineered to load in under 2.5s.",
    description: "A custom website with its own concept, motion and type, built on a modern stack you fully own.",
    tiers: [
      { name: "Launch", detail: "One high-converting landing page", time: "1–2 weeks", formService: "Website Development" },
      { name: "Business", detail: "5–12 page marketing site with CMS", time: "4–6 weeks", formService: "Website Development" },
      { name: "Commerce", detail: "Online store with catalogue, cart & checkout", time: "6–10 weeks", formService: "Website Development" },
    ],
    includes: ["Original design, zero templates", "Mobile-first, Core Web Vitals passed", "Schema, analytics & conversion tracking", "You own the code, domain and accounts"],
  },
  {
    id: "brand",
    name: "Brand Kit",
    category: "Build",
    tagline: "A mark, a palette and a voice people remember.",
    description: "Identity work that makes everything else easier: logo suite, colour and type system, and a voice guide.",
    tiers: [
      { name: "Essentials", detail: "Logo suite, colours & fonts", time: "1–2 weeks", formService: "Brand Development" },
      { name: "Identity", detail: "Full visual identity + social kit", time: "3–4 weeks", formService: "Brand Development" },
      { name: "System", detail: "Identity, voice guide & brand book", time: "5–6 weeks", formService: "Brand Development" },
    ],
    includes: ["Primary, secondary & icon marks", "Colour and type system with contrast checks", "Social, favicon & email signature kit", "Editable source files, all yours"],
  },
  {
    id: "seo",
    name: "Search Engine",
    category: "Grow",
    tagline: "Rankings that compound month after month.",
    description: "Technical, on-page and content SEO, measured against the keywords that actually bring revenue.",
    tiers: [
      { name: "Audit", detail: "Full technical & content audit with a fix list", time: "1 week", formService: "SEO" },
      { name: "Monthly", detail: "Ongoing SEO with content each month", time: "Rolling", formService: "SEO" },
      { name: "Authority", detail: "Monthly SEO + digital PR & links", time: "Rolling", formService: "SEO" },
    ],
    includes: ["Technical fixes: speed, crawl, indexing", "Keyword & content plan tied to revenue", "Local SEO and Google Business Profile", "Monthly report you can actually read"],
  },
  {
    id: "ai",
    name: "AI Visibility",
    category: "Grow",
    tagline: "Be the answer ChatGPT, Gemini and Perplexity give.",
    description: "AEO and GEO: structure your content, entities and schema so search answers and AI assistants cite you.",
    tiers: [
      { name: "Check", detail: "AI visibility audit across 4 assistants", time: "1 week", formService: "AEO / GEO (AI search)" },
      { name: "Optimise", detail: "Entity, schema & answer-ready content work", time: "4–6 weeks", formService: "AEO / GEO (AI search)" },
      { name: "Monitor", detail: "Monthly citation tracking & updates", time: "Rolling", formService: "AEO / GEO (AI search)" },
    ],
    includes: ["Entity & knowledge-graph clean-up", "FAQ, how-to and product schema", "Answer-ready page rewrites", "Citation tracking in ChatGPT, Gemini, Perplexity & Claude"],
  },
  {
    id: "ads",
    name: "Ads Engine",
    category: "Grow",
    tagline: "Campaigns built for return, not for clicks.",
    description: "Google, Meta and LinkedIn campaigns with clean tracking, sharp creative and weekly optimisation.",
    tiers: [
      { name: "Setup", detail: "Accounts, tracking & first campaigns", time: "2 weeks", formService: "Ads Management" },
      { name: "Manage", detail: "Monthly management on one platform", time: "Rolling", formService: "Ads Management" },
      { name: "Scale", detail: "Multi-platform management & creative", time: "Rolling", formService: "Ads Management" },
    ],
    includes: ["Conversion tracking done properly", "Landing pages that match the ad", "Creative & copy testing", "Weekly optimisation, monthly reporting"],
  },
  {
    id: "care",
    name: "Care & Fix",
    category: "Fix",
    tagline: "Broken today? Fixed today. Then kept that way.",
    description: "Emergency fixes, malware clean-up and a care plan that keeps your site fast, patched and backed up.",
    tiers: [
      { name: "Rescue", detail: "One-off fix: errors, outages, hacks", time: "Same day start", formService: "Emergency Fix" },
      { name: "Care", detail: "Updates, backups & uptime monitoring", time: "Monthly", formService: "Website Maintenance" },
      { name: "Care+", detail: "Care plus speed work & priority fixes", time: "Monthly", formService: "Website Maintenance" },
    ],
    includes: ["Diagnosis and a fixed quote before work starts", "Malware removal and hardening", "Daily backups and 24/7 uptime monitoring", "Speed and Core Web Vitals tune-ups"],
  },
];

export const productById = Object.fromEntries(products.map((p) => [p.id, p])) as Record<ProductId, Product>;
