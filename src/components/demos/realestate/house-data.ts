import type { SceneDef } from "./house-gl";

/** The Glasshouse walk-through: scenes (photos + depth + masks), the route, hotspots and details. All AI-generated imagery of a fictional home. */

export type Cam = [number, number, number];
export type Hotspot = { q: [number, number]; label: string; text: string; detail?: "oak" | "stone"; go?: string };
export type Room = {
  id: string; // scene id
  key: string; // chapter key
  floor: "Outside" | "Ground floor" | "First floor";
  title: string;
  body: string;
  facts?: string[];
  start: Cam;
  end: Cam;
  exit: [number, number]; // where the camera walks through to the next room
  vp?: [number, number]; // vanishing point (interiors) for hotspot depth
  aspect: number;
  spots: Hotspot[];
};

const R = (id: string): SceneDef => ({ id, img: `/tour/rooms/${id}.webp`, depth: `/tour/rooms/${id}-depth.png`, mask: `/tour/rooms/${id}-mask.png` });

export const scenes: SceneDef[] = [
  { id: "exterior", img: "/tour/glasshouse-2000.webp", depth: "/tour/glasshouse-depth.png", mask: "/tour/glasshouse-masks.png" },
  R("entrance"),
  { ...R("living"), fire: [0.765, 0.69, 0.885, 0.775] },
  R("kitchen"),
  R("terrace"),
  R("gallery"),
  R("suite"),
  { ...R("ensuite"), steam: [0.09, 0.18, 0.26, 0.62] },
  R("study"),
];

const IN = 1376 / 768;
const EXT = 2400 / 1792;

export const route: Room[] = [
  {
    id: "exterior", key: "arrive", floor: "Outside", title: "The Glasshouse", aspect: EXT,
    body: "Glass, oak and travertine around a 12-metre pool in Oak Hills. Scroll to walk through every room.",
    start: [0.5, 0.5, 1], end: [0.46, 0.58, 1.22], exit: [0.44, 0.62],
    spots: [
      { q: [0.43, 0.63], label: "Living room", text: "Double-height living behind 6 m of sliding glass.", go: "living" },
      { q: [0.42, 0.4], label: "Main suite", text: "First-floor suite with corner glazing.", go: "suite" },
      { q: [0.76, 0.8], label: "Pool & terrace", text: "Heated 12 m pool, travertine terrace.", go: "terrace" },
    ],
  },
  {
    id: "entrance", key: "entrance", floor: "Ground floor", title: "Entrance hall", aspect: IN, vp: [0.52, 0.5],
    body: "A double-height hall: an oversized oak pivot door, a floating stair and a view straight through to the pool.",
    facts: ["6.5 m ceiling", "Solid oak pivot door", "Underfloor heating"],
    start: [0.5, 0.5, 1], end: [0.54, 0.52, 1.14], exit: [0.55, 0.55],
    spots: [
      { q: [0.25, 0.52], label: "Pivot door", text: "2.8 m solid oak pivot door with a full-height black pull." },
      { q: [0.82, 0.42], label: "Floating stair", text: "Cantilevered oak treads with a frameless glass balustrade.", detail: "oak" },
      { q: [0.56, 0.14], label: "Paper pendant", text: "80 cm hand-made paper lantern, dimmable." },
    ],
  },
  {
    id: "living", key: "living", floor: "Ground floor", title: "Living room", aspect: IN, vp: [0.48, 0.55],
    body: "Six metres of glass slide away to the terrace. A travertine fireplace wall anchors the room.",
    facts: ["Double height", "Linear gas fireplace", "Wide-plank oak floors"],
    start: [0.5, 0.5, 1], end: [0.6, 0.58, 1.14], exit: [0.12, 0.6],
    spots: [
      { q: [0.83, 0.69], label: "Fireplace", text: "1.8 m linear gas fire set into a honed travertine wall." },
      { q: [0.45, 0.33], label: "Sliding glass wall", text: "Three 2 m panels slide into a hidden pocket." },
      { q: [0.43, 0.74], label: "Lounge", text: "Low modular sofa, oak table and a bouclé chair by the fire." },
    ],
  },
  {
    id: "kitchen", key: "kitchen", floor: "Ground floor", title: "Kitchen & dining", aspect: IN, vp: [0.58, 0.5],
    body: "A 4-metre travertine island, flush oak joinery and a dining table for eight facing the olive garden.",
    facts: ["4 m island", "Integrated appliances", "Walk-in pantry"],
    start: [0.5, 0.5, 1], end: [0.64, 0.55, 1.14], exit: [0.78, 0.5],
    spots: [
      { q: [0.32, 0.53], label: "Island & tap", text: "Honed travertine with a waterfall edge and brushed brass tap.", detail: "stone" },
      { q: [0.36, 0.3], label: "Glass pendants", text: "Three hand-blown amber glass pendants." },
      { q: [0.73, 0.62], label: "Dining", text: "Solid oak table for eight under a sculptural pendant." },
    ],
  },
  {
    id: "terrace", key: "terrace", floor: "Outside", title: "Terrace & outdoor kitchen", aspect: IN, vp: [0.6, 0.46],
    body: "Under the cantilevered roof: a travertine outdoor kitchen, dining for eight and a lounge by the pool.",
    facts: ["Covered terrace", "Built-in grill", "Heated pool"],
    start: [0.5, 0.5, 1], end: [0.62, 0.55, 1.14], exit: [0.4, 0.45],
    spots: [
      { q: [0.17, 0.66], label: "Outdoor kitchen", text: "Travertine counter, built-in grill and fridge drawers." },
      { q: [0.84, 0.6], label: "Pool", text: "12 m heated pool with LED lighting." },
      { q: [0.5, 0.62], label: "Lounge", text: "Weatherproof lounge under the roof overhang." },
    ],
  },
  {
    id: "gallery", key: "gallery", floor: "First floor", title: "Gallery landing", aspect: IN, vp: [0.37, 0.45],
    body: "Up the floating stair: a glass-edged landing that looks down into the living room and out to the pool.",
    facts: ["Glass balustrade", "Reading nook", "Linear ceiling light"],
    start: [0.5, 0.5, 1], end: [0.42, 0.5, 1.16], exit: [0.42, 0.45],
    spots: [
      { q: [0.16, 0.3], label: "Floating stair", text: "Oak treads fixed into a steel wall beam.", detail: "oak" },
      { q: [0.43, 0.62], label: "Reading nook", text: "A lounge chair and floor lamp by full-height glass." },
      { q: [0.6, 0.8], label: "The void", text: "Look down into the double-height living room." },
    ],
  },
  {
    id: "suite", key: "suite", floor: "First floor", title: "Main suite", aspect: IN, vp: [0.52, 0.5],
    body: "Corner glazing, sheer linen and a private balcony over the pool. Lights off for the view.",
    facts: ["38 m² suite", "Private balcony", "Dressing room"],
    start: [0.5, 0.5, 1], end: [0.6, 0.52, 1.14], exit: [0.2, 0.45],
    spots: [
      { q: [0.33, 0.62], label: "Platform bed", text: "Low oak bed, bouclé bench and travertine bedside tables." },
      { q: [0.76, 0.55], label: "Balcony", text: "Glass-balustrade balcony overlooking the pool." },
    ],
  },
  {
    id: "ensuite", key: "ensuite", floor: "First floor", title: "En-suite", aspect: IN, vp: [0.5, 0.52],
    body: "Honed travertine throughout, a carved stone bath framed by an olive tree, and a steam-ready rain shower.",
    facts: ["Stone bath", "Rain shower", "Heated floors"],
    start: [0.5, 0.5, 1], end: [0.5, 0.6, 1.14], exit: [0.5, 0.5],
    spots: [
      { q: [0.5, 0.7], label: "Stone bath", text: "Freestanding carved stone bath under a picture window." },
      { q: [0.15, 0.45], label: "Rain shower", text: "Walk-in shower with a ceiling rain head and steam." },
      { q: [0.84, 0.62], label: "Vanity", text: "Floating oak vanity with a carved stone basin and brass taps." },
    ],
  },
  {
    id: "study", key: "study", floor: "First floor", title: "Guest bedroom & study", aspect: IN, vp: [0.55, 0.5],
    body: "A calm second bedroom with a built-in oak desk facing the garden: ideal for guests or working from home.",
    facts: ["Built-in desk", "Full-height wardrobes", "Garden views"],
    start: [0.5, 0.5, 1], end: [0.64, 0.55, 1.12], exit: [0.5, 0.5],
    spots: [
      { q: [0.79, 0.6], label: "Desk", text: "Built-in oak desk with cable management along the glass." },
      { q: [0.2, 0.28], label: "Wardrobes", text: "Floor-to-ceiling oak wardrobes with push-to-open doors." },
    ],
  },
  {
    id: "exterior", key: "finale", floor: "Outside", title: "See it in person", aspect: EXT,
    body: "$2,450,000 · 4 bedrooms · 3.5 baths · 3,420 sqft. Private viewings this week, or a live video walk-through.",
    start: [0.5, 0.52, 1.05], end: [0.5, 0.5, 1], exit: [0.5, 0.5],
    spots: [],
  },
];

export const details = {
  oak: { img: "/tour/rooms/detail-oak.webp", title: "Floating oak stair", text: "Solid European oak treads, 70 mm thick, hand-oiled to a matte finish and cantilevered from a hidden steel beam. The same oak runs through the floors as 240 mm wide planks." },
  stone: { img: "/tour/rooms/detail-stone.webp", title: "Travertine island & brass tap", text: "A single 4 m slab of honed Roman travertine with an integrated carved sink and waterfall edge, paired with a brushed brass single-lever tap." },
};

/** Floor plan navigator (viewBox 0 0 100 64 per floor). */
export const plans: { floor: "Ground floor" | "First floor"; rooms: { key: string; label: string; r: [number, number, number, number] }[] }[] = [
  {
    floor: "Ground floor",
    rooms: [
      { key: "kitchen", label: "Kitchen", r: [2, 2, 38, 28] },
      { key: "living", label: "Living", r: [40, 2, 58, 34] },
      { key: "entrance", label: "Entrance", r: [2, 30, 38, 22] },
      { key: "terrace", label: "Terrace", r: [40, 36, 58, 26] },
    ],
  },
  {
    floor: "First floor",
    rooms: [
      { key: "suite", label: "Main suite", r: [2, 2, 46, 34] },
      { key: "ensuite", label: "En-suite", r: [48, 2, 24, 24] },
      { key: "gallery", label: "Gallery", r: [48, 26, 50, 16] },
      { key: "study", label: "Study", r: [2, 36, 46, 26] },
    ],
  },
];

/** Same depth model as the generated maps, for placing hotspots. */
export function depthAt(room: Room, q: [number, number]) {
  if (!room.vp) return room.id === "exterior" ? (q[1] > 0.66 ? 0.7 : 0.42) : 0.5;
  const dx = (q[0] - room.vp[0]) * 1.78, dy = q[1] - room.vp[1];
  return Math.min(1, Math.hypot(dx, dy) / 0.95) ** 0.85 * 0.85 + 0.1;
}
