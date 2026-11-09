"use client";

import { useRef, type ReactNode } from "react";
import { m, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { pillars, services } from "@/lib/site";
import Reveal from "./Reveal";

function PillarCard({ p, i, media }: { p: (typeof pillars)[number]; i: number; media?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const rx = useSpring(0, { stiffness: 150, damping: 18 });
  const ry = useSpring(0, { stiffness: 150, damping: 18 });
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, color-mix(in oklab, ${p.accent} 22%, transparent), transparent 70%)`;

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    mx.set(x);
    my.set(y);
    if (e.pointerType === "mouse") {
      ry.set((x / r.width - 0.5) * 8);
      rx.set(-(y / r.height - 0.5) * 8);
    }
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    mx.set(-200);
    my.set(-200);
  };

  const list = services.filter((s) => s.pillar === p.id);

  return (
    <Reveal delay={i * 0.1} className="[perspective:1200px]">
      <m.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry }}
        className="group relative h-full overflow-hidden rounded-3xl border border-line bg-ink-2"
      >
        {media && (
          <div className="relative aspect-[16/10] overflow-hidden border-b border-line">
            <div className="h-full w-full transition-transform duration-700 ease-out-expo group-hover:scale-105">{media}</div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-2 via-transparent to-transparent" aria-hidden="true" />
          </div>
        )}
        <m.div className="pointer-events-none absolute inset-0" style={{ background: spotlight }} aria-hidden="true" />
        <div className="relative p-7 sm:p-9">
          <div className="flex items-baseline justify-between">
            <span className="font-display text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: p.accent }}>
              0{i + 1} / {p.title}
            </span>
            <span className="h-2.5 w-2.5 rounded-full transition-transform duration-500 group-hover:scale-[2.2]" style={{ background: p.accent }} aria-hidden="true" />
          </div>
          <h3 className="mt-6 font-display text-5xl font-bold tracking-tight sm:text-6xl">{p.word}</h3>
          <p className="mt-4 max-w-sm text-paper/70">{p.blurb}</p>
          <ul className="mt-8 space-y-3 border-t border-line pt-6">
            {list.map((s) => (
              <li key={s.slug} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: p.accent }} aria-hidden="true" />
                <span>
                  <span className="font-medium">{s.title}</span>
                  <span className="block text-sm text-mute">{s.short}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </m.div>
    </Reveal>
  );
}

export default function Pillars({ media = {} }: { media?: Partial<Record<string, ReactNode>> }) {
  return (
    <section id="services" className="container-x py-28 sm:py-36">
      <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lime">Services</p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold tracking-tight sm:text-6xl">
            Everything your brand needs online, under one roof.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-sm text-paper/65">
            Three pillars, one team. Build it right, grow it fast, and keep it running, without juggling five vendors.
          </p>
        </Reveal>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {pillars.map((p, i) => (
          <PillarCard key={p.id} p={p} i={i} media={media[p.id]} />
        ))}
      </div>
    </section>
  );
}
