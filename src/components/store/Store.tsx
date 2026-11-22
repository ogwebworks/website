"use client";

import { useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { products, type ProductId } from "@/lib/store";
import { plan, usePlan } from "@/lib/plan";
import ProductIcon from "./ProductIcon";
import ProductVisual from "./ProductVisual";
import { sfx } from "../fx/sound";

/**
 * "The OG Store": services presented like products on a high-end store: a layered
 * "product shot" per service, package selector, what's included, and "Add to plan",
 * which fills the visitor's plan (cart) and later the proposal form.
 */
export default function Store() {
  const [idx, setIdx] = useState(0);
  const [tier, setTier] = useState<Record<string, number>>({});
  const [added, setAdded] = useState<string | null>(null);
  const items = usePlan();
  const p = products[idx];
  const t = tier[p.id] ?? 1;
  const inPlan = items.find((x) => x.id === p.id);

  const select = (i: number) => {
    if (i === idx) return;
    setIdx(i);
    sfx.tick();
  };
  const add = () => {
    plan.add(p.id as ProductId, t);
    setAdded(p.id);
    sfx.chime();
    window.setTimeout(() => setAdded(null), 1800);
  };

  const onKeyTabs = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); const n = (idx + 1) % products.length; select(n); document.getElementById(`tab-${products[n].id}`)?.focus(); }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); const n = (idx - 1 + products.length) % products.length; select(n); document.getElementById(`tab-${products[n].id}`)?.focus(); }
  };

  return (
    <section id="store" aria-labelledby="store-h" className="relative py-24 sm:py-32">
      <div className="container-x">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">The OG Store</p>
            <h2 id="store-h" className="mt-4 max-w-2xl font-display text-4xl font-bold tracking-tight sm:text-6xl">
              Pick what you need. <span className="text-gradient">We&apos;ll build the rest.</span>
            </h2>
          </div>
          <p className="max-w-sm text-paper/65">
            Every service, made like a product. Choose a package, add it to your plan, and get one tailored proposal for the lot.
          </p>
        </div>

        {/* product rail */}
        <div role="tablist" aria-label="Services" onKeyDown={onKeyTabs} className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0">
          {products.map((x, i) => {
            const on = i === idx;
            const has = items.some((it) => it.id === x.id);
            return (
              <button
                key={x.id}
                id={`tab-${x.id}`}
                role="tab"
                type="button"
                aria-selected={on}
                aria-controls="store-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => select(i)}
                className={`group relative flex shrink-0 items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm font-medium transition ${on ? "border-brand bg-brand text-ink" : "border-line text-paper/80 hover:border-paper/30 hover:text-paper"}`}
              >
                <ProductIcon id={x.id} className="h-4.5 w-4.5" />
                {x.name}
                {has && <span className={`h-1.5 w-1.5 rounded-full ${on ? "bg-ink" : "bg-brand"}`} aria-label="in your plan" />}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[2rem] border border-line bg-ink-2 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          {/* stage */}
          <div className="relative h-[340px] overflow-hidden border-b border-line bg-[radial-gradient(ellipse_at_50%_40%,rgb(29_109_255/0.25),transparent_65%)] sm:h-[460px] lg:h-auto lg:min-h-[600px] lg:border-b-0 lg:border-r">
            <div className="pointer-events-none absolute left-6 top-6 font-display text-[clamp(4rem,10vw,8rem)] font-bold leading-none tracking-tighter text-white/[0.04]" aria-hidden="true">
              0{idx + 1}
            </div>
            <ProductVisual id={p.id} />
            <p className="pointer-events-none absolute bottom-5 left-6 text-[11px] uppercase tracking-[0.2em] text-mute">Illustration · {p.category}</p>
          </div>

          {/* details */}
          <div id="store-panel" role="tabpanel" aria-labelledby={`tab-${p.id}`} className="flex flex-col p-6 sm:p-10">
            <AnimatePresence mode="wait" initial={false}>
              <m.div key={p.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="flex flex-1 flex-col">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">{p.category}</p>
                <h3 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">{p.name}</h3>
                <p className="mt-3 text-lg text-paper/80">{p.tagline}</p>
                <p className="mt-3 text-paper/60">{p.description}</p>

                <fieldset className="mt-8">
                  <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-mute">Package</legend>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {p.tiers.map((x, i) => (
                      <label
                        key={x.name}
                        className={`cursor-pointer rounded-2xl border p-3.5 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand ${i === t ? "border-brand bg-brand/10" : "border-line hover:border-paper/30"}`}
                      >
                        <input type="radio" name={`tier-${p.id}`} className="sr-only" checked={i === t} onChange={() => { setTier((s) => ({ ...s, [p.id]: i })); sfx.tick(); }} />
                        <span className="block font-display font-semibold">{x.name}</span>
                        <span className="mt-1 block text-xs leading-snug text-paper/60">{x.detail}</span>
                        <span className="mt-2 block text-[11px] uppercase tracking-[0.14em] text-brand">{x.time}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <ul className="mt-7 grid gap-2.5 text-sm text-paper/80 sm:grid-cols-2">
                  {p.includes.map((x) => (
                    <li key={x} className="flex gap-2.5">
                      <span className="mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full bg-brand/15 text-[10px] text-brand" aria-hidden="true">✓</span>
                      {x}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-col gap-3 pt-9 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={add}
                    className="relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-brand px-7 py-4 font-semibold text-ink shadow-[0_10px_40px_-10px_rgb(18_214_248/0.8)] transition hover:brightness-110 active:scale-[0.98]"
                  >
                    {added === p.id ? "Added to your plan ✓" : inPlan ? (inPlan.tier === t ? "In your plan · Update" : "Update package") : "Add to plan"}
                  </button>
                  <button type="button" onClick={() => plan.open()} className="rounded-full border border-line px-6 py-4 font-medium text-paper/85 transition hover:border-paper/40">
                    View plan{items.length ? ` (${items.length})` : ""}
                  </button>
                </div>
                <p className="mt-4 text-xs text-mute">Pricing is tailored to scope. Your plan turns into a fixed quote within one business day.</p>
              </m.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
