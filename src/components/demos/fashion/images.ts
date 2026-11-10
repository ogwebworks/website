import "server-only";
import { findPublicImage } from "@/lib/images";
import { products } from "./data";

/** Build-time map of product slug -> photo path (or null to use the illustration). */
export function productImages(): Record<string, string | null> {
  return Object.fromEntries(products.map((p) => [p.slug, findPublicImage(`demo-fashion-${p.slug}`)]));
}
