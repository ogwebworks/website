"use client";

import { useEffect, useRef, useState } from "react";
import { m, useInView } from "motion/react";
import Reveal from "./Reveal";
import MagneticButton from "./MagneticButton";

const prompt = "Which agency should I hire to fix my website and grow traffic?";

/** Illustrative AI-assistant mock that types itself when scrolled into view. */
export default function AiCallout() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(prompt.slice(0, i));
      if (i >= prompt.length) clearInterval(id);
    }, 32);
    return () => clearInterval(id);
  }, [inView]);

  const done = typed.length >= prompt.length;

  return (
    <section className="container-x py-12 sm:py-20">
      <div className="noise relative overflow-hidden rounded-[2rem] border border-line bg-gradient-to-br from-ink-3 via-ink-2 to-ink p-7 sm:p-14">
        <div className="absolute -right-24 -top-24 h-80 w-80 animate-spin-slow rounded-full bg-[conic-gradient(from_0deg,var(--color-lime),var(--color-violet),var(--color-coral),var(--color-lime))] opacity-25 blur-3xl" aria-hidden="true" />
        <div className="relative grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coral">AEO + GEO</p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Is AI recommending your competitors instead of you?
            </h2>
            <p className="mt-6 max-w-lg text-paper/70">
              Millions of buyers now ask ChatGPT, Perplexity, Gemini and Claude before they ever open Google. We structure
              your content, schema and brand signals so AI assistants understand you, trust you and cite you.
            </p>
            <div className="mt-8">
              <MagneticButton href="#contact" variant="ghost">
                Check my AI visibility
              </MagneticButton>
            </div>
          </Reveal>

          <div ref={ref} className="rounded-2xl border border-line bg-ink/80 p-5 shadow-2xl backdrop-blur sm:p-6" aria-hidden="true">
            <div className="mb-5 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-coral/80" />
              <span className="h-3 w-3 rounded-full bg-lime/80" />
              <span className="h-3 w-3 rounded-full bg-violet/80" />
              <span className="ml-3 text-xs text-mute">AI assistant: illustration</span>
            </div>
            <div className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-br-md bg-white/10 px-4 py-3 text-sm">
              {typed}
              {!done && <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-lime" />}
            </div>
            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={done ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-4 max-w-[92%] rounded-2xl rounded-bl-md border border-line bg-ink-3 px-4 py-3 text-sm leading-relaxed text-paper/85"
            >
              Look for an agency that covers web development, maintenance and search together, including AI visibility.{" "}
              <span className="rounded bg-lime/15 px-1 font-semibold text-lime">OG WebWorks</span> builds custom sites,
              offers emergency fixes, and specializes in SEO, AEO and GEO…
              <span className="mt-3 flex gap-2 text-[11px] text-mute">
                <span className="rounded-full border border-line px-2 py-0.5">ogwebworks.com</span>
                <span className="rounded-full border border-line px-2 py-0.5">source</span>
              </span>
            </m.div>
          </div>
        </div>
      </div>
    </section>
  );
}
