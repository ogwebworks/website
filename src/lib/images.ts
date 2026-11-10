import "server-only";
import fs from "node:fs";
import path from "node:path";

/**
 * Image slots used on the site. Drop a file named `<name>.webp` (or .avif/.jpg/.png) into
 * `public/images/` (or run `npm run images` on the originals in `images-src/`) and the next build
 * uses it automatically; until then a branded placeholder is shown.
 * Prompts for generating each image: docs/IMAGE_PROMPTS.md
 */
export const imageSlots = {
  "pillar-build": { w: 1600, h: 900, alt: "Designer's workspace with a custom website layout taking shape across a laptop and wireframe sketches" },
  "pillar-grow": { w: 1600, h: 900, alt: "Abstract 3D growth chart rising through a dark scene, glowing brand and azure" },
  "pillar-fix": { w: 1600, h: 900, alt: "Close-up of code on a monitor with an error being resolved and a green status light" },
  "studio-main": { w: 1600, h: 900, alt: "The OG WebWorks studio: a calm, modern workspace with monitors showing website designs at dusk" },
  "studio-detail": { w: 1000, h: 1000, alt: "Hands sketching website wireframes in a notebook next to a laptop" },
  process: { w: 1500, h: 1000, alt: "Isometric illustration of a website moving through discovery, design, build, launch and growth" },
  "industry-ecommerce": { w: 1600, h: 900, alt: "Modern online store product page on a phone beside neatly packed parcels" },
  "industry-healthcare": { w: 1600, h: 900, alt: "Bright, modern clinic reception with an appointment booking site on a tablet" },
  "industry-professional": { w: 1600, h: 900, alt: "Elegant office desk with a professional services website open on a laptop" },
  "industry-saas": { w: 1600, h: 900, alt: "Software dashboard interface floating in a dark, glowing 3D scene" },
  og: { w: 1200, h: 630, alt: "OG WebWorks: Original. Digital. Solutions!" },
  // --- Demo: tree services (fictional business) ---
  "demo-tree-hero": { w: 1600, h: 1200, alt: "Arborist in safety gear pruning a large oak tree in a sunny backyard" },
  "demo-tree-before": { w: 1600, h: 1000, alt: "Before: an overgrown, storm-damaged tree leaning over a house roof" },
  "demo-tree-after": { w: 1600, h: 1000, alt: "After: the same yard, tree safely removed and the lawn cleaned up" },
  "demo-tree-gallery-1": { w: 1200, h: 900, alt: "Crew lowering a cut limb with ropes" },
  "demo-tree-gallery-2": { w: 1200, h: 900, alt: "Stump grinder working on a freshly cut stump" },
  "demo-tree-gallery-3": { w: 1200, h: 900, alt: "Neatly pruned trees lining a tidy front yard" },
  "demo-tree-thumb": { w: 1600, h: 1000, alt: "Preview of the Canopy & Crown tree services demo website" },
} as const;

export type ImageSlot = keyof typeof imageSlots;

const EXTS = ["webp", "avif", "jpg", "jpeg", "png"];

/** Resolve a slot to a real file in /public/images at build time, or null if not added yet. */
export function getImage(name: ImageSlot) {
  const spec = imageSlots[name];
  for (const ext of EXTS) {
    const rel = `/images/${name}.${ext}`;
    if (fs.existsSync(path.join(process.cwd(), "public", rel))) return { src: rel, ...spec };
  }
  return null;
}
