"use client";

import { m, useScroll, useSpring } from "motion/react";

/** Thin brand-gradient bar at the top of the viewport that fills as you scroll. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <m.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-[linear-gradient(90deg,var(--color-azure),var(--color-brand),var(--color-ice))] shadow-[0_0_12px_var(--color-brand)]"
    />
  );
}
