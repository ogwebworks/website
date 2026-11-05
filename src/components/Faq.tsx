"use client";

import { useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { faqs } from "@/lib/site";
import Reveal from "./Reveal";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="container-x grid gap-12 py-24 sm:py-32 lg:grid-cols-[0.8fr_1.2fr]">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lime">FAQ</p>
        <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-6xl">Straight answers.</h2>
      </Reveal>
      <ul className="divide-y divide-line border-y border-line">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <li key={f.q}>
              <h3>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-6 py-6 text-left font-display text-lg font-semibold sm:text-xl"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  id={`faq-btn-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  {f.q}
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line transition duration-500 ${isOpen ? "rotate-45 border-lime bg-lime text-ink" : ""}`} aria-hidden="true">
                    +
                  </span>
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <m.div
                    id={`faq-${i}`}
                    role="region"
                    aria-labelledby={`faq-btn-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-2xl pb-6 text-paper/70">{f.a}</p>
                  </m.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
