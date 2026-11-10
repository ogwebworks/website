// FICTIONAL restaurant, used as a demo only. 555-01xx numbers are reserved for fiction.
export const resto = {
  name: "Ember & Salt",
  phone: "(312) 555-0172",
  phoneHref: "+13125550172",
  address: "214 Fulton Market, Chicago, IL",
  since: 2014,
};

export type Diet = "V" | "VG" | "GF";
export type Dish = { id: string; name: string; desc: string; price: number; diet?: Diet[]; tint: [string, string, string]; signature?: boolean };

export const menu: { id: string; label: string; dishes: Dish[] }[] = [
  {
    id: "small",
    label: "Small plates",
    dishes: [
      { id: "burrata", name: "Charred peach & burrata", desc: "Smoked honey, basil oil, toasted pistachio", price: 18, diet: ["V", "GF"], tint: ["#f2e6d0", "#f0a35e", "#7aa35a"], signature: true },
      { id: "scallops", name: "Ember-kissed scallops", desc: "Brown butter, cauliflower purée, capers", price: 24, diet: ["GF"], tint: ["#f4e2c4", "#d98a3d", "#e8d9b8"] },
      { id: "flatbread", name: "Wood-fired flatbread", desc: "Whipped feta, chilli honey, za'atar", price: 14, diet: ["V"], tint: ["#e9c38a", "#b5452a", "#f3ead7"] },
      { id: "carrots", name: "Coal-roasted carrots", desc: "Harissa yoghurt, dukkah, mint", price: 13, diet: ["V", "GF"], tint: ["#e2742c", "#f1e8d6", "#5f8b4c"] },
    ],
  },
  {
    id: "fire",
    label: "From the fire",
    dishes: [
      { id: "ribeye", name: "45-day dry-aged ribeye", desc: "Bone marrow butter, smoked salt, chimichurri", price: 64, diet: ["GF"], tint: ["#6b2b1f", "#a1442c", "#4f7a3a"], signature: true },
      { id: "chicken", name: "Half chicken, open fire", desc: "Lemon, garlic confit, charred greens", price: 32, diet: ["GF"], tint: ["#c98a46", "#e9c27a", "#5c8a43"] },
      { id: "octopus", name: "Grilled octopus", desc: "Romesco, crispy potatoes, smoked paprika", price: 34, diet: ["GF"], tint: ["#8c3b2e", "#d4673a", "#efd9b4"], signature: true },
      { id: "cauli", name: "Whole roasted cauliflower", desc: "Tahini, pomegranate, herb salsa", price: 26, diet: ["VG", "GF"], tint: ["#e8d2a6", "#b23a48", "#5f8f4e"] },
    ],
  },
  {
    id: "sides",
    label: "Sides",
    dishes: [
      { id: "potatoes", name: "Duck-fat potatoes", desc: "Rosemary, sea salt", price: 9, diet: ["GF"], tint: ["#d9a654", "#f0d79a", "#6e8d4b"] },
      { id: "greens", name: "Charred greens", desc: "Lemon, chilli, garlic", price: 9, diet: ["VG", "GF"], tint: ["#4f7a3a", "#7fa35a", "#e9d9b0"] },
      { id: "bread", name: "Sourdough & cultured butter", desc: "Baked every morning", price: 7, diet: ["V"], tint: ["#c48a4f", "#f2e4c4", "#8a5a33"] },
    ],
  },
  {
    id: "dessert",
    label: "Desserts",
    dishes: [
      { id: "basque", name: "Burnt Basque cheesecake", desc: "Sour cherries, crème fraîche", price: 12, diet: ["V", "GF"], tint: ["#6b3a22", "#f3dfb6", "#9e1f3a"], signature: true },
      { id: "chocolate", name: "Smoked chocolate tart", desc: "Sea salt, olive oil, hazelnut", price: 13, diet: ["V"], tint: ["#3b2318", "#6b3e26", "#d9b98a"] },
    ],
  },
  {
    id: "drinks",
    label: "Drinks",
    dishes: [
      { id: "smoke", name: "Smoke & Stone", desc: "Mezcal, charred pineapple, lime", price: 16, tint: ["#e8a33c", "#f6d78a", "#4f7a3a"] },
      { id: "wine", name: "Natural wine by the glass", desc: "Ask about tonight's 30 bottles open", price: 14, tint: ["#6e1f2b", "#a83a4a", "#f1e2c8"] },
    ],
  },
];

export const signatures = menu.flatMap((c) => c.dishes).filter((d) => d.signature);

export const hours: { day: string; open?: [number, number] }[] = [
  { day: "Monday" },
  { day: "Tuesday", open: [17, 22] },
  { day: "Wednesday", open: [17, 22] },
  { day: "Thursday", open: [17, 23] },
  { day: "Friday", open: [17, 24] },
  { day: "Saturday", open: [12, 24] },
  { day: "Sunday", open: [12, 21] },
];

export const reviews = [
  { q: "The ribeye is the best thing I've eaten this year. The room glows, the staff are brilliant.", who: "Dana W." },
  { q: "Booked a birthday on the chef's table. Watching the fire kitchen up close was unforgettable.", who: "Marcus T." },
  { q: "Natural wine list is fantastic and they explain every bottle without a hint of snobbery.", who: "Leah P." },
  { q: "That burnt cheesecake. Go for it, stay for it. We already booked again.", who: "Omar K." },
  { q: "Cosy, loud in the best way, and the scallops are perfect. A Chicago favourite.", who: "Ines R." },
];
