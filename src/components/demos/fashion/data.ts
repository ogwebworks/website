// FICTIONAL brand and products, used as a demo only.
export const store = { name: "Maison Vale", freeShipping: 150 };

export type Category = "dresses" | "tops" | "knitwear" | "outerwear" | "trousers" | "accessories";
export type Art = "dress" | "top" | "knit" | "coat" | "trousers" | "bag";
export type Color = { name: string; hex: string };

export type Product = {
  slug: string;
  name: string;
  category: Category;
  art: Art;
  price: number;
  compareAt?: number;
  badge?: "New" | "Bestseller" | "Sale";
  colors: Color[];
  sizes: string[];
  description: string;
  details: string[];
  rating: number;
  reviews: number;
};

export const categories: { id: Category; label: string; blurb: string }[] = [
  { id: "dresses", label: "Dresses", blurb: "Effortless, all-day silhouettes" },
  { id: "tops", label: "Tops & shirts", blurb: "Crisp cotton and washed silk" },
  { id: "knitwear", label: "Knitwear", blurb: "Merino, cashmere, alpaca" },
  { id: "outerwear", label: "Outerwear", blurb: "Coats built for decades" },
  { id: "trousers", label: "Trousers", blurb: "Tailored and relaxed fits" },
  { id: "accessories", label: "Accessories", blurb: "Leather goods and finishing touches" },
];

const S = ["XS", "S", "M", "L", "XL"];
const C = {
  oat: { name: "Oat", hex: "#d9cbb4" },
  ink: { name: "Ink", hex: "#2a2d33" },
  clay: { name: "Clay", hex: "#a5583a" },
  sage: { name: "Sage", hex: "#8f9c84" },
  ivory: { name: "Ivory", hex: "#efe9de" },
  cocoa: { name: "Cocoa", hex: "#5b4033" },
  sky: { name: "Sky", hex: "#a9bccb" },
  olive: { name: "Olive", hex: "#5f6348" },
  camel: { name: "Camel", hex: "#b98a5a" },
};

export const products: Product[] = [
  { slug: "linen-wrap-dress", name: "Linen Wrap Dress", category: "dresses", art: "dress", price: 168, badge: "New", colors: [C.clay, C.oat, C.ink], sizes: S, rating: 4.8, reviews: 126,
    description: "A softly structured wrap dress in European linen that gets better with every wash. Ties at the waist, falls just below the knee.",
    details: ["100% European flax linen", "Adjustable wrap tie, side seam pockets", "Midi length, relaxed fit", "Machine wash cold, line dry"] },
  { slug: "silk-slip-dress", name: "Washed Silk Slip Dress", category: "dresses", art: "dress", price: 210, colors: [C.ivory, C.cocoa], sizes: S, rating: 4.9, reviews: 88,
    description: "Bias-cut sandwashed silk with a fluid drape and fine adjustable straps. Layer it or wear it alone.",
    details: ["100% mulberry silk, sandwashed", "Bias cut for a fluid drape", "Adjustable straps", "Hand wash or dry clean"] },
  { slug: "poplin-shirt", name: "Oversized Poplin Shirt", category: "tops", art: "top", price: 98, badge: "Bestseller", colors: [C.ivory, C.sky, C.ink], sizes: S, rating: 4.7, reviews: 342,
    description: "Our best-selling crisp cotton shirt with a relaxed, slightly dropped shoulder. Tuck it, knot it, or wear it open.",
    details: ["100% organic cotton poplin", "Mother-of-pearl buttons", "Relaxed fit, dropped shoulder", "Machine wash warm"] },
  { slug: "rib-knit-tank", name: "Rib Knit Tank", category: "tops", art: "top", price: 48, colors: [C.oat, C.ink, C.sage], sizes: S, rating: 4.6, reviews: 210,
    description: "A fine-rib tank in a soft cotton-modal blend that holds its shape all day.",
    details: ["70% organic cotton, 30% modal", "Slim fit", "Scoop neck", "Machine wash cold"] },
  { slug: "merino-crew", name: "Fine Merino Crew", category: "knitwear", art: "knit", price: 128, badge: "Bestseller", colors: [C.camel, C.ink, C.sage], sizes: S, rating: 4.8, reviews: 517,
    description: "Featherweight extra-fine merino that regulates temperature year-round. The sweater you will reach for first.",
    details: ["100% extra-fine merino wool, 17.5 micron", "Fully fashioned shoulders", "Regular fit", "Hand wash cold, dry flat"] },
  { slug: "cashmere-cardigan", name: "Cashmere Cardigan", category: "knitwear", art: "knit", price: 245, compareAt: 295, badge: "Sale", colors: [C.oat, C.cocoa], sizes: S, rating: 4.9, reviews: 164,
    description: "Grade-A Mongolian cashmere in a cropped, boxy cardigan with horn buttons.",
    details: ["100% Grade-A cashmere", "Horn buttons", "Cropped, boxy fit", "Hand wash cold, dry flat"] },
  { slug: "wool-overcoat", name: "Double-Faced Wool Coat", category: "outerwear", art: "coat", price: 395, badge: "New", colors: [C.camel, C.ink], sizes: S, rating: 4.9, reviews: 73,
    description: "An unlined double-faced wool coat with hand-finished seams and a clean, collarless line. Built to last decades.",
    details: ["90% wool, 10% cashmere, double-faced", "Hand-finished seams, unlined", "Relaxed fit, mid-calf length", "Dry clean only"] },
  { slug: "trench-coat", name: "Classic Cotton Trench", category: "outerwear", art: "coat", price: 325, colors: [C.oat, C.olive], sizes: S, rating: 4.7, reviews: 129,
    description: "A water-resistant cotton gabardine trench with storm flap, belted waist and removable lining.",
    details: ["100% cotton gabardine, water resistant", "Removable belt and lining", "Storm flap and gun patch", "Dry clean"] },
  { slug: "wide-leg-trouser", name: "Pleated Wide-Leg Trouser", category: "trousers", art: "trousers", price: 138, badge: "New", colors: [C.ink, C.oat, C.olive], sizes: S, rating: 4.7, reviews: 201,
    description: "High-rise, double-pleated trousers in a fluid wool blend with a generous wide leg.",
    details: ["Wool-blend suiting, fluid drape", "High rise, double pleats", "Side and back pockets", "Dry clean or hand wash"] },
  { slug: "linen-trouser", name: "Relaxed Linen Trouser", category: "trousers", art: "trousers", price: 112, compareAt: 138, badge: "Sale", colors: [C.ivory, C.sage, C.cocoa], sizes: S, rating: 4.6, reviews: 156,
    description: "Easy drawstring trousers in garment-washed linen. Summer's most-worn piece.",
    details: ["100% linen, garment washed", "Drawstring waist", "Relaxed straight leg", "Machine wash cold"] },
  { slug: "leather-tote", name: "Everyday Leather Tote", category: "accessories", art: "bag", price: 220, badge: "Bestseller", colors: [C.cocoa, C.ink, C.camel], sizes: ["One size"], rating: 4.9, reviews: 402,
    description: "A vegetable-tanned leather tote that ages beautifully. Fits a 14-inch laptop, with an inner zip pocket.",
    details: ["Full-grain vegetable-tanned leather", "Fits a 14-inch laptop", "Inner zip pocket", "Made by a family workshop in Spain"] },
  { slug: "mini-crossbody", name: "Mini Crossbody Bag", category: "accessories", art: "bag", price: 145, colors: [C.clay, C.ink], sizes: ["One size"], rating: 4.8, reviews: 98,
    description: "A compact crossbody with adjustable strap and magnetic closure. Phone, cards, keys, done.",
    details: ["Full-grain leather", "Adjustable strap", "Magnetic flap closure", "Card slot inside"] },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const money = (n: number) => `$${n.toFixed(0)}`;
export const BASE = "/demos/fashion";
