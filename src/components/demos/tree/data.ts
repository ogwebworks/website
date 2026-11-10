// All content below is for a FICTIONAL business used as a demo. 555-01xx numbers are reserved for fiction.
export const brand = {
  name: "Canopy & Crown",
  phone: "(503) 555-0148",
  phoneHref: "+15035550148",
  email: "hello@canopyandcrown.example",
  since: 2009,
};

export const services = [
  { title: "Tree removal", text: "Safe removal of dead, dangerous or unwanted trees, even in tight spaces beside homes.", icon: "axe" },
  { title: "Trimming & pruning", text: "Healthier, better-shaped trees and clearance from roofs, lines and driveways.", icon: "shears" },
  { title: "Stump grinding", text: "Stumps ground below grade, chips cleared and the area ready for lawn or planting.", icon: "stump" },
  { title: "24/7 storm response", text: "Fallen tree on the house or driveway? Our emergency crew is on call day and night.", icon: "storm" },
  { title: "Tree health care", text: "Diagnosis and treatment of disease, pests and nutrient problems by certified arborists.", icon: "leaf" },
  { title: "Lot & land clearing", text: "Brush, saplings and trees cleared for builds, fences, views or fire safety.", icon: "land" },
] as const;

export const reviews = [
  { name: "Megan R.", area: "Riverside", text: "They removed a huge leaning maple two feet from our house without a scratch, and the yard was cleaner than before they came." },
  { name: "David K.", area: "North Hills", text: "Called at 11pm after a storm dropped a limb on our car. They were there in 40 minutes. Fair price, zero drama." },
  { name: "Priya S.", area: "Oak Park", text: "Clear quote, on time, and they explained exactly what our old oak needed. It's never looked healthier." },
];

export const areas = ["Riverside", "North Hills", "Oak Park", "Westbrook", "Cedar Falls", "Maple Grove", "Lakeview", "Pine Ridge", "Elm Heights", "Stonebridge"];

export const faqs = [
  { q: "Are estimates really free?", a: "Yes. An arborist visits, looks at the job and gives you a written, fixed quote with no obligation." },
  { q: "Are you licensed and insured?", a: "Fully licensed, bonded and insured with liability and workers' comp cover. Certificates are available on request." },
  { q: "Do you clean up afterwards?", a: "Always. We haul away wood and debris, rake the area and can leave firewood or wood chips if you want them." },
  { q: "Do I need a permit to remove a tree?", a: "Some cities require one for larger trees. We check the local rules for your address and handle the paperwork." },
  { q: "How fast can you come out?", a: "Most estimates happen within the same week. Storm emergencies get a crew the same day, often within the hour." },
];
