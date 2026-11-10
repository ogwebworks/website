// FICTIONAL brokerage, agents and listings, used as a demo only. 555-01xx numbers are reserved for fiction.
export const agency = { name: "Meridian Homes", phone: "(415) 555-0186", phoneHref: "+14155550186", city: "Bayview" };

export type HouseStyle = "modern" | "gable" | "tower" | "townhome";
export type Listing = {
  id: string;
  title: string;
  address: string;
  area: Area;
  type: "House" | "Condo" | "Townhome";
  style: HouseStyle;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  status?: "New" | "Open house" | "Price drop";
  dusk?: boolean;
  seed: number;
  pin: { x: number; y: number };
  blurb: string;
  features: string[];
  agent: number;
};

export const areas = ["Harbour District", "Oak Hills", "Riverside", "Downtown"] as const;
export type Area = (typeof areas)[number];

export const listings: Listing[] = [
  { id: "glasshouse", title: "The Glasshouse", address: "18 Cliffside Way", area: "Oak Hills", type: "House", style: "modern", price: 2450000, beds: 4, baths: 3.5, sqft: 3420, status: "New", dusk: true, seed: 3, pin: { x: 22, y: 30 }, agent: 0,
    blurb: "Floor-to-ceiling glass, a cantilevered terrace and bay views from every main room.", features: ["Bay views", "Chef's kitchen", "Heated pool", "EV-ready garage"] },
  { id: "harbour-loft", title: "Harbour Loft 12B", address: "220 Wharf Street", area: "Harbour District", type: "Condo", style: "tower", price: 1180000, beds: 2, baths: 2, sqft: 1380, status: "Open house", dusk: true, seed: 7, pin: { x: 72, y: 62 }, agent: 1,
    blurb: "A corner loft with double-height windows above the marina and a private balcony.", features: ["Concierge", "Rooftop lounge", "Gym", "Pet friendly"] },
  { id: "maple-gable", title: "Maple Gable Cottage", address: "41 Maple Lane", area: "Riverside", type: "House", style: "gable", price: 895000, beds: 3, baths: 2, sqft: 1860, seed: 11, pin: { x: 40, y: 72 }, agent: 2,
    blurb: "A renovated craftsman cottage with a wraparound porch, garden studio and river trail access.", features: ["Garden studio", "New roof", "Hardwood floors", "Walk to river"] },
  { id: "row-no5", title: "No. 5 Linden Row", address: "5 Linden Row", area: "Downtown", type: "Townhome", style: "townhome", price: 1395000, beds: 3, baths: 2.5, sqft: 2100, status: "Price drop", seed: 5, pin: { x: 58, y: 40 }, agent: 1,
    blurb: "A restored brick townhome on a tree-lined row, minutes from cafés and the metro.", features: ["Private patio", "Original fireplace", "Roof deck", "Two-car parking"] },
  { id: "skyline-31", title: "Skyline Residence 31", address: "900 Market Avenue", area: "Downtown", type: "Condo", style: "tower", price: 1890000, beds: 3, baths: 2, sqft: 1720, status: "New", seed: 13, pin: { x: 63, y: 30 }, agent: 0,
    blurb: "Thirty-first floor with skyline and water views, wide-plank oak and a wraparound terrace.", features: ["Skyline views", "Valet parking", "Spa & pool", "Smart home"] },
  { id: "ridge-modern", title: "Ridge Modern", address: "7 Summit Court", area: "Oak Hills", type: "House", style: "modern", price: 3150000, beds: 5, baths: 4.5, sqft: 4480, dusk: true, seed: 17, pin: { x: 30, y: 18 }, agent: 2,
    blurb: "Architect-designed on half an acre, with a pavilion, infinity pool and a separate guest suite.", features: ["Infinity pool", "Guest suite", "Home cinema", "Solar + battery"] },
  { id: "riverside-row", title: "Riverside Townhome", address: "62 Quay Walk", area: "Riverside", type: "Townhome", style: "townhome", price: 965000, beds: 3, baths: 2.5, sqft: 1740, status: "Open house", seed: 9, pin: { x: 46, y: 82 }, agent: 0,
    blurb: "Light-filled end unit facing the water, with an open-plan kitchen and private garden.", features: ["Water views", "Private garden", "Storage room", "Bike room"] },
  { id: "lantern-house", title: "Lantern House", address: "3 Beacon Hill", area: "Harbour District", type: "House", style: "gable", price: 1675000, beds: 4, baths: 3, sqft: 2650, dusk: true, seed: 21, pin: { x: 82, y: 44 }, agent: 1,
    blurb: "A modern farmhouse with vaulted ceilings, a lantern-lit porch and harbour glimpses.", features: ["Vaulted ceilings", "Mudroom", "Wine cellar", "Fenced yard"] },
  { id: "marina-studio", title: "Marina Studio 4C", address: "14 Pier Road", area: "Harbour District", type: "Condo", style: "tower", price: 625000, beds: 1, baths: 1, sqft: 720, seed: 2, pin: { x: 78, y: 76 }, agent: 2,
    blurb: "An efficient, bright one-bedroom steps from the ferry, cafés and the waterfront path.", features: ["Ferry access", "In-unit laundry", "Bike storage", "Low HOA"] },
];

export const agents = [
  { name: "Ava Moreno", role: "Principal broker", sold: 312, initials: "AM" },
  { name: "Daniel Okafor", role: "Luxury & condos", sold: 241, initials: "DO" },
  { name: "Mei Tanaka", role: "First-time buyers", sold: 188, initials: "MT" },
];

export const testimonials = [
  { q: "They sold our house in nine days, above asking, and handled every detail. Calm, sharp and honest.", who: "The Harrisons · Oak Hills" },
  { q: "As first-time buyers we had a hundred questions. Mei answered all of them and found us the perfect place.", who: "Priya & Sam · Riverside" },
  { q: "The 3D tours and pro photos made our condo stand out instantly. Multiple offers the first weekend.", who: "Jordan L. · Downtown" },
  { q: "Daniel negotiated like a pro and knew every building in the Harbour District inside out.", who: "Elena R. · Harbour District" },
];

export const fmtPrice = (n: number) => (n >= 1e6 ? `$${(n / 1e6).toFixed(n % 1e6 === 0 ? 1 : 2)}M` : `$${Math.round(n / 1000)}K`);
export const fmtFull = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
