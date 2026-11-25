/** Halcyon Bay Residences: fictional waterfront tower (demo data). Images are AI-generated. */

export const project = {
  name: "Halcyon Bay Residences",
  short: "Halcyon Bay",
  address: "1 Marina Promenade, Bayview",
  phone: "(305) 555-0147",
  phoneHref: "+13055550147",
  completion: "Spring 2028",
  floors: 24,
};

const A = "/demos-assets/halcyon/";
export const img = {
  tower: { lg: `${A}tower-2400.webp`, sm: `${A}tower-1400.webp`, aspect: 2752 / 1536 },
  resCut: { lg: `${A}res-cutaway.webp`, sm: `${A}res-cutaway-1200.webp`, aspect: 2752 / 1536 },
  phCut: { lg: `${A}ph-cutaway.webp`, sm: `${A}ph-cutaway-1200.webp`, aspect: 2752 / 1536 },
  living: { lg: `${A}living.webp`, sm: `${A}living-1200.webp`, aspect: 2752 / 1536 },
};

/** Floor bands measured on the tower photo (image uv). Residences: floors 3-22; Sky Penthouse: 23-24. */
const SLAB0 = 0.1862, STEP = 0.02606;
export function floorBand(f: number): { top: number; bottom: number; left: number; right: number } {
  if (f >= 23) {
    const top = f === 24 ? 0.1154 : 0.1508;
    return { top, bottom: top + 0.0354, left: 0.415, right: 0.585 };
  }
  const top = SLAB0 + (22 - f) * STEP;
  return { top, bottom: top + STEP, left: 0.404, right: 0.596 };
}

export type Status = "Available" | "Reserved" | "Sold";
const h = (n: number) => ((n * 9301 + 49297) % 233280) / 233280;
export function statusOf(f: number, unit: number): Status {
  const r = h(f * 7 + unit * 13);
  const sold = f < 8 ? 0.42 : f < 15 ? 0.25 : 0.12;
  return r < sold ? "Sold" : r < sold + 0.2 ? "Reserved" : "Available";
}

export type UnitType = { code: string; name: string; beds: string; baths: number; sqft: number; outdoor: number; from: number; per: number };
export const types: UnitType[] = [
  { code: "A", name: "Residence A", beds: "2 bed + den", baths: 2, sqft: 1480, outdoor: 210, from: 1_420_000, per: 28_000 },
  { code: "B", name: "Residence B", beds: "1 bed", baths: 1.5, sqft: 910, outdoor: 140, from: 845_000, per: 17_000 },
  { code: "C", name: "Residence C", beds: "3 bed", baths: 3, sqft: 2120, outdoor: 320, from: 2_180_000, per: 39_000 },
];
export const penthouse = { name: "Sky Penthouse", beds: "3 bed + media", baths: 3.5, sqft: 3950, outdoor: 1600, price: 6_400_000 };

export const priceOf = (t: UnitType, f: number) => Math.round((t.from + (f - 3) * t.per) / 5000) * 5000;
export const fmt = (n: number) => (n >= 1e6 ? `$${(n / 1e6).toFixed(2).replace(/0$/, "")}M` : `$${Math.round(n / 1000)}K`);

/** Hotspots on the cutaway images (image uv). */
export const resSpots = [
  { q: [0.44, 0.45], label: "Living room", text: "18 ft of floor-to-ceiling glass facing the bay." },
  { q: [0.55, 0.4], label: "Kitchen", text: "Stone waterfall island, integrated appliances." },
  { q: [0.47, 0.29], label: "Dining", text: "Seats six beside the fireplace wall." },
  { q: [0.69, 0.38], label: "Walk-in closet", text: "Lit oak wardrobes and a dressing island." },
  { q: [0.71, 0.63], label: "Primary bath", text: "Freestanding tub and double vanity." },
  { q: [0.57, 0.75], label: "Primary suite", text: "Corner glazing on two sides." },
  { q: [0.22, 0.55], label: "Balcony", text: "210 sq ft glass-railed balcony." },
] as const;

export const phSpots = [
  { q: [0.646, 0.78], label: "Plunge pool", text: "Heated terrace pool overlooking the marina." },
  { q: [0.56, 0.65], label: "Sun terrace", text: "1,600 sq ft wraparound planted terrace." },
  { q: [0.4, 0.3], label: "Chef's kitchen", text: "Marble island, wine wall and scullery." },
  { q: [0.47, 0.39], label: "Dining", text: "Seats ten under a crystal chandelier." },
  { q: [0.365, 0.55], label: "Great room", text: "Double-aspect living with a media wall." },
  { q: [0.77, 0.47], label: "Primary suite", text: "Private terrace access and sitting area." },
  { q: [0.667, 0.34], label: "Spa bath", text: "Stone tub and steam shower." },
] as const;
