"use client";

import type { PointerEvent, ReactNode } from "react";

/**
 * Wraps a group of `.fx-card` elements: a soft light follows the cursor across whichever
 * card it is over, and the card tilts toward the pointer with a moving glare.
 * One listener for the whole group (adapted from the BizPlainly spotlight grid).
 */
export default function Spotlight({ children, className, as: Tag = "div" }: { children: ReactNode; className?: string; as?: "div" | "ul" }) {
  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const card = (e.target as HTMLElement).closest<HTMLElement>(".fx-card");
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    card.style.setProperty("--mx", `${x * 100}%`);
    card.style.setProperty("--my", `${y * 100}%`);
    card.style.setProperty("--rx", `${(0.5 - y) * 6}deg`);
    card.style.setProperty("--ry", `${(x - 0.5) * 8}deg`);
  };
  const onOut = (e: PointerEvent<HTMLElement>) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>(".fx-card");
    if (!card || card.contains(e.relatedTarget as Node)) return;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  };
  return (
    <Tag className={className} onPointerMove={onMove} onPointerOut={onOut}>
      {children}
    </Tag>
  );
}
