/**
 * Harbour Point Residences: a fictional 14-storey new development (demo data).
 * Floors 1-12: six units (A-F) around a central core. Floors 13-14: two penthouses.
 * Prices and availability are deterministic so the page looks the same for everyone.
 */
export type View = "Sea" | "City" | "Park";
export type Status = "available" | "reserved" | "sold";
export type UnitType = "studio" | "1bed" | "2bed" | "3bed" | "ph";

export type Unit = {
  id: string; // e.g. "9C"
  floor: number;
  code: string; // A-F or PH-A / PH-B
  type: UnitType;
  beds: number; // 0 = studio
  baths: number;
  sqft: number;
  outdoor: number; // balcony / terrace sqft
  view: View;
  aspect: string; // e.g. "North-west corner"
  price: number;
  status: Status;
};

export const project = {
  name: "Harbour Point Residences",
  area: "Harbour District",
  floors: 14,
  completion: "Q3 2027",
  developer: "Meridian Homes (demo)",
};

type Template = { code: string; type: UnitType; beds: number; baths: number; sqft: number; outdoor: number; view: View; aspect: string };

const standard: Template[] = [
  { code: "A", type: "2bed", beds: 2, baths: 2, sqft: 1080, outdoor: 90, view: "Sea", aspect: "North-west corner" },
  { code: "B", type: "1bed", beds: 1, baths: 1, sqft: 720, outdoor: 60, view: "Sea", aspect: "North" },
  { code: "C", type: "2bed", beds: 2, baths: 2, sqft: 1040, outdoor: 90, view: "Sea", aspect: "North-east corner" },
  { code: "D", type: "3bed", beds: 3, baths: 2, sqft: 1420, outdoor: 110, view: "Park", aspect: "South-west corner" },
  { code: "E", type: "studio", beds: 0, baths: 1, sqft: 480, outdoor: 40, view: "City", aspect: "South" },
  { code: "F", type: "1bed", beds: 1, baths: 1, sqft: 690, outdoor: 55, view: "City", aspect: "South-east corner" },
];
const penthouses: Template[] = [
  { code: "PH-A", type: "ph", beds: 3, baths: 3, sqft: 2200, outdoor: 620, view: "Sea", aspect: "Full north frontage" },
  { code: "PH-B", type: "ph", beds: 3, baths: 2, sqft: 1950, outdoor: 540, view: "Park", aspect: "Full south frontage" },
];

const perSqft: Record<View, number> = { Sea: 1180, City: 960, Park: 1020 };
const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return ((h >>> 0) % 1000) / 1000;
};

export const units: Unit[] = [];
for (let floor = 1; floor <= 14; floor++) {
  const tpl = floor >= 13 ? penthouses : standard;
  for (const t of tpl) {
    const id = floor >= 13 ? `${floor}${t.code.replace("PH-", "")}` : `${floor}${t.code}`;
    const rate = t.type === "ph" ? 1480 : perSqft[t.view];
    const price = Math.round((t.sqft * rate * (1 + (floor - 1) * 0.016)) / 5000) * 5000;
    // lower floors sold first; penthouses mostly still available
    const r = hash(id);
    const soldBias = floor <= 4 ? 0.3 : floor <= 8 ? 0.16 : 0.08;
    const status: Status = r < soldBias ? "sold" : r < soldBias + 0.18 ? "reserved" : "available";
    units.push({ id, floor, ...t, price, status });
  }
}

export const typeLabel = (u: Pick<Unit, "type" | "beds">) => (u.type === "ph" ? "Penthouse" : u.beds === 0 ? "Studio" : `${u.beds}-bedroom`);

/* ---------- Floor plan geometry (SVG viewBox 0 0 600 380) ---------- */
export type Shape = { code: string; d: string; label: [number, number] };
export const standardPlan: Shape[] = [
  { code: "A", d: "M20 40 H200 V150 H20 Z", label: [110, 95] },
  { code: "B", d: "M200 40 H400 V150 H200 Z", label: [300, 95] },
  { code: "C", d: "M400 40 H580 V150 H400 Z", label: [490, 95] },
  { code: "D", d: "M20 230 H230 V340 H20 Z", label: [125, 285] },
  { code: "E", d: "M230 230 H370 V340 H230 Z", label: [300, 285] },
  { code: "F", d: "M370 230 H580 V340 H370 Z", label: [475, 285] },
];
export const penthousePlan: Shape[] = [
  { code: "PH-A", d: "M20 40 H580 V150 H20 Z", label: [300, 95] },
  { code: "PH-B", d: "M20 230 H580 V340 H20 Z", label: [300, 285] },
];

/* ---------- Interior layouts per type (SVG viewBox 0 0 320 200): [x, y, w, h, label] ---------- */
export type Room = [number, number, number, number, string];
export const interiors: Record<UnitType, Room[]> = {
  studio: [[0, 0, 210, 140, "Living / sleep"], [210, 0, 110, 80, "Kitchen"], [210, 80, 110, 60, "Bath"], [0, 140, 320, 60, "Balcony"]],
  "1bed": [[0, 0, 180, 130, "Living"], [180, 0, 140, 80, "Bedroom"], [180, 80, 70, 50, "Bath"], [250, 80, 70, 50, "Store"], [0, 130, 120, 70, "Kitchen"], [120, 130, 200, 70, "Balcony"]],
  "2bed": [[0, 0, 170, 120, "Living"], [170, 0, 150, 85, "Bedroom 1"], [170, 85, 75, 45, "En-suite"], [245, 85, 75, 45, "Bath"], [0, 120, 100, 80, "Kitchen"], [100, 120, 120, 80, "Bedroom 2"], [220, 130, 100, 70, "Balcony"]],
  "3bed": [[0, 0, 160, 110, "Living"], [160, 0, 160, 80, "Bedroom 1"], [160, 80, 80, 45, "En-suite"], [240, 80, 80, 45, "Bath"], [0, 110, 100, 90, "Kitchen"], [100, 110, 110, 90, "Bedroom 2"], [210, 125, 110, 75, "Bedroom 3"]],
  ph: [[0, 0, 140, 110, "Living"], [140, 0, 90, 110, "Dining"], [230, 0, 90, 70, "Kitchen"], [230, 70, 90, 60, "Bedroom 3"], [0, 110, 110, 90, "Main suite"], [110, 110, 70, 50, "Bath"], [180, 130, 140, 70, "Bedroom 2"], [110, 160, 70, 40, "WC"]],
};
