"use client";

import { useRef } from "react";
import { m, useScroll, useTransform, type MotionValue } from "motion/react";

const text =
  "Most agencies hand you a template and a monthly invoice. We hand you an original, a site that loads instantly, ranks, gets cited by AI, and actually converts.";

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const highlight = /original|instantly|ranks|AI|converts/i.test(children);
  // Animate colour (not opacity) between contrast-safe tones (>= 3:1 on ink, WCAG large text).
  const color = useTransform(progress, range, highlight ? ["#1e7a91", "#12d6f8"] : ["#61709a", "#f2f6ff"]);
  return (
    <m.span style={{ color }} className="mr-[0.25em] inline-block">
      {children}
    </m.span>
  );
}

/** Kinetic manifesto: words light up as you scroll. */
export default function Statement() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.35"] });
  const words = text.split(" ");
  return (
    <section id="why" className="container-x py-24 sm:py-32">
      <div ref={ref}>
        <p className="mb-8 text-sm font-semibold uppercase tracking-[0.2em] text-mute">Why OG</p>
        <p className="font-display text-[clamp(2rem,5.2vw,4.6rem)] font-semibold leading-[1.08] tracking-tight">
          {words.map((w, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
              {w}
            </Word>
          ))}
        </p>
      </div>
    </section>
  );
}
