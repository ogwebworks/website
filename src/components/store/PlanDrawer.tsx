"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m } from "motion/react";
import { plan, usePlan } from "@/lib/plan";
import { productById } from "@/lib/store";
import ProductIcon from "./ProductIcon";
import { sfx } from "../fx/sound";

const noop = () => () => {};

/** Header "Your plan" button + slide-over drawer (the store's cart). */
export default function PlanDrawer() {
  const items = usePlan();
  const [open, setOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const o = () => setOpen(true);
    const a = () => setBump((b) => b + 1);
    window.addEventListener("og:plan-open", o);
    window.addEventListener("og:plan-added", a);
    return () => { window.removeEventListener("og:plan-open", o); window.removeEventListener("og:plan-added", a); };
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeBtn.current?.focus();
    const back = opener.current;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => { document.documentElement.style.overflow = prev; window.removeEventListener("keydown", onKey); back?.focus(); };
  }, [open]);

  const request = () => {
    const lines = items.map((it) => {
      const p = productById[it.id];
      const tier = p.tiers[it.tier] ?? p.tiers[0];
      return { service: tier.formService, line: `${p.name}: ${tier.name} (${tier.detail})` };
    });
    window.dispatchEvent(new CustomEvent("og:prefill", { detail: { url: "", services: lines.map((l) => l.service), note: `My plan:\n${lines.map((l) => `• ${l.line}`).join("\n")}` } }));
    setOpen(false);
    sfx.whoosh();
    window.setTimeout(() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }), 60);
  };

  return (
    <>
      <button
        ref={opener}
        type="button"
        onClick={() => { setOpen(true); sfx.tick(); }}
        aria-label={`Your plan, ${items.length} ${items.length === 1 ? "item" : "items"}`}
        className="relative grid h-10 w-10 place-items-center rounded-full border border-line transition hover:border-paper/40"
      >
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 8Z" />
          <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
        </svg>
        {items.length > 0 && (
          <m.span key={bump} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15 }} className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-bold text-ink">
            {items.length}
          </m.span>
        )}
      </button>

      {mounted && createPortal(
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label="Your plan" data-lenis-prevent>
            <m.div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <m.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-line bg-ink-2 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-line px-6 py-5">
                <div>
                  <p className="font-display text-2xl font-bold tracking-tight">Your plan</p>
                  <p className="text-sm text-mute">{items.length ? `${items.length} ${items.length === 1 ? "service" : "services"}` : "Nothing added yet"}</p>
                </div>
                <button ref={closeBtn} type="button" onClick={() => setOpen(false)} aria-label="Close plan" className="grid h-10 w-10 place-items-center rounded-full border border-line hover:border-paper/40">✕</button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                {items.length === 0 ? (
                  <div className="grid h-full place-items-center text-center">
                    <div>
                      <p className="font-display text-xl font-semibold">Start with what hurts most.</p>
                      <p className="mt-2 text-paper/60">Browse the store and add a website, brand, growth or care package.</p>
                      <a href="#store" onClick={() => setOpen(false)} className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-ink">Browse the store</a>
                    </div>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    <AnimatePresence initial={false}>
                      {items.map((it) => {
                        const p = productById[it.id];
                        const tier = p.tiers[it.tier] ?? p.tiers[0];
                        return (
                          <m.li key={it.id} layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} className="flex gap-4 rounded-2xl border border-line bg-ink p-4">
                            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-[radial-gradient(circle_at_30%_30%,rgb(18_214_248/0.35),rgb(29_109_255/0.15))] text-brand">
                              <ProductIcon id={it.id} className="h-7 w-7" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block font-display font-semibold">{p.name}</span>
                              <span className="block text-sm text-brand">{tier.name}</span>
                              <span className="block text-sm text-paper/60">{tier.detail} · {tier.time}</span>
                            </span>
                            <button type="button" onClick={() => plan.remove(it.id)} aria-label={`Remove ${p.name}`} className="self-start text-sm text-mute underline-offset-4 hover:text-paper hover:underline">Remove</button>
                          </m.li>
                        );
                      })}
                    </AnimatePresence>
                  </ul>
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t border-line px-6 py-5">
                  <div className="mb-4 flex items-center justify-between text-sm">
                    <span className="text-mute">Estimate</span>
                    <span className="font-medium">Fixed quote within 1 business day</span>
                  </div>
                  <button type="button" onClick={request} className="w-full rounded-full bg-brand py-4 font-semibold text-ink shadow-[0_10px_40px_-10px_rgb(18_214_248/0.8)] transition hover:brightness-110">
                    Request my proposal →
                  </button>
                  <p className="mt-3 text-center text-xs text-mute">No payment, no commitment. We reply with a plan and a quote.</p>
                </div>
              )}
            </m.aside>
          </div>
        )}
      </AnimatePresence>,
      document.body,
      )}
    </>
  );
}
