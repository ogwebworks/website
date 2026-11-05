"use client";

import { LazyMotion, domAnimation } from "motion/react";

/** Loads only the animation features we use (~15 KB instead of the full bundle). */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
