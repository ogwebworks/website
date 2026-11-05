"use client";

import { useRef } from "react";
import { m, useScroll, useSpring } from "motion/react";
import Reveal from "./Reveal";

const steps = [
  { n: "01", title: "Discover", text: "We audit your site, competitors and goals, then agree on what success looks like in numbers." },
  { n: "02", title: "Design", text: "Brand-led, mobile-first designs with motion and 3D used where they help, not as decoration." },
  { n: "03", title: "Build", text: "Clean, fast code on modern stacks, with schema, accessibility and analytics built in." },
  { n: "04", title: "Launch", text: "QA across devices, performance and SEO checks, redirects, Search Console. Zero-drama go-live." },
  { n: "05", title: "Grow", text: "SEO, AEO, GEO and ads on top of a monthly care plan. We report results, not activity." },
];

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.6"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="process" className="container-x grid gap-16 py-28 sm:py-36 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="lg:sticky lg:top-32 lg:self-start">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet">Process</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-6xl">From idea to impact in five moves.</h2>
          <p className="mt-6 max-w-md text-paper/65">
            A clear process with fixed milestones. You always know what&apos;s happening, what&apos;s next and what it costs.
          </p>
        </Reveal>
      </div>

      <div ref={ref} className="relative pl-10 sm:pl-14">
        <div className="absolute left-3 top-2 h-[calc(100%-1rem)] w-px bg-line sm:left-5" aria-hidden="true" />
        <m.div
          style={{ scaleY }}
          className="absolute left-3 top-2 h-[calc(100%-1rem)] w-px origin-top bg-gradient-to-b from-lime via-violet to-coral sm:left-5"
          aria-hidden="true"
        />
        <ol className="space-y-14">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 0.05} className="relative">
              <span className="absolute -left-10 top-1 grid h-6 w-6 place-items-center rounded-full border border-line bg-ink sm:-left-14 sm:h-10 sm:w-10" aria-hidden="true">
                <span className="h-1.5 w-1.5 rounded-full bg-lime sm:h-2 sm:w-2" />
              </span>
              <span className="font-display text-sm font-semibold text-mute">{s.n}</span>
              <h3 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">{s.title}</h3>
              <p className="mt-3 max-w-lg text-paper/65">{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
