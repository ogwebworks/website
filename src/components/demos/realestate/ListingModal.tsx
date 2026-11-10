"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { agents, fmtFull, fmtPrice, listings } from "./data";
import HouseArt from "./HouseArt";
import { Heart } from "./Listings";
import { useRe } from "./store";
import { useNow } from "../motion";

export const monthly = (price: number, downPct: number, rate: number, years = 30) => {
  const p = price * (1 - downPct / 100);
  const r = rate / 100 / 12;
  const n = years * 12;
  const pi = r === 0 ? p / n : (p * r * (1 + r) ** n) / ((1 + r) ** n - 1);
  const tax = (price * 0.011) / 12;
  const ins = (price * 0.0035) / 12;
  return { pi, tax, ins, total: pi + tax + ins };
};

/** Listing detail overlay: gallery, facts, payment estimate, tour booking, agent. */
export default function ListingModal() {
  const re = useRe();
  const l = listings.find((x) => x.id === re.open);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!l) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && re.openListing(null);
    window.addEventListener("keydown", onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [l, re]);

  if (!mounted || !l) return null;
  return createPortal(<Detail key={l.id} id={l.id} />, document.body);
}

function Detail({ id }: { id: string }) {
  const re = useRe();
  const l = listings.find((x) => x.id === id)!;
  const agent = agents[l.agent];
  const [view, setView] = useState(0);
  const [down, setDown] = useState(20);
  const [rate, setRate] = useState(6.5);
  const pay = monthly(l.price, down, rate);
  const now = useNow(60 * 60 * 1000);
  const days = useMemo(() => (now ? Array.from({ length: 6 }, (_, i) => { const d = new Date(now); d.setDate(d.getDate() + i + 1); return d; }) : []), [now]);
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  const [tourType, setTourType] = useState<"In person" | "Video">("In person");
  const [booked, setBooked] = useState(false);
  const saved = re.saved.includes(l.id);

  return (
    <div role="dialog" aria-modal="true" aria-label={l.title} data-lenis-prevent className="fixed inset-0 z-[100] flex items-end justify-center bg-re-navy/60 backdrop-blur-sm sm:items-center sm:p-6" onClick={(e) => e.target === e.currentTarget && re.openListing(null)}>
      <div className="dm-fade-up max-h-[94dvh] w-full max-w-5xl overflow-y-auto rounded-t-3xl bg-re-ice shadow-2xl sm:rounded-3xl">
        {/* gallery */}
        <div className="relative">
          <div className="aspect-[16/9] overflow-hidden sm:aspect-[21/9]">
            <HouseArt key={view} style={l.style} seed={l.seed} dusk={view === 3 ? !l.dusk : l.dusk} view={view % 3} className="dm-fade-up" />
          </div>
          <div className="absolute right-4 top-4 flex gap-2">
            <button type="button" onClick={() => re.toggleSave(l.id)} aria-pressed={saved} aria-label={saved ? "Unsave home" : "Save home"} className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-re-navy backdrop-blur"><Heart on={saved} /></button>
            <button type="button" onClick={() => re.openListing(null)} aria-label="Close" className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-re-navy backdrop-blur">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
          </div>
          <div className="absolute bottom-4 left-4 flex gap-2">
            {["Exterior", "Detail", "Close-up", l.dusk ? "Daytime" : "Twilight"].map((v, i) => (
              <button key={v} type="button" onClick={() => setView(i)} aria-pressed={view === i} className={`rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur transition ${view === i ? "bg-white text-re-navy" : "bg-re-navy/60 text-white hover:bg-re-navy/80"}`}>
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)] gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                {l.status && <span className="rounded-full bg-re-cyan/20 px-3 py-1 text-xs font-semibold text-re-navy">{l.status}</span>}
                <h2 className="mt-2 font-re text-3xl tracking-tight text-re-navy sm:text-4xl">{l.title}</h2>
                <p className="mt-1 text-re-mute">{l.address} · {l.area}, Bayview</p>
              </div>
              <p className="font-re text-3xl text-re-navy">{fmtFull(l.price)}</p>
            </div>
            <dl className="mt-6 grid grid-cols-4 gap-3">
              {[["Beds", l.beds], ["Baths", l.baths], ["Sq ft", l.sqft.toLocaleString("en-US")], ["Type", l.type]].map(([k, v]) => (
                <div key={k as string} className="rounded-2xl bg-white p-3 text-center ring-1 ring-re-navy/5">
                  <dt className="text-xs uppercase tracking-[0.12em] text-re-mute">{k}</dt>
                  <dd className="mt-1 font-re text-lg text-re-navy">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 leading-relaxed text-re-navy/80">{l.blurb}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {l.features.map((x) => <li key={x} className="rounded-full bg-re-sand px-3 py-1.5 text-sm text-re-navy">✓ {x}</li>)}
            </ul>

            <div className="mt-8 rounded-3xl bg-white p-6 ring-1 ring-re-navy/5">
              <div className="flex items-baseline justify-between">
                <p className="font-re text-lg text-re-navy">Estimated payment</p>
                <p className="font-re text-2xl text-re-blue">{fmtFull(pay.total)}<span className="text-sm text-re-mute">/mo</span></p>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="text-sm text-re-mute">Down payment: <strong className="text-re-navy">{down}% ({fmtPrice(l.price * down / 100)})</strong>
                  <input type="range" min={5} max={50} value={down} onChange={(e) => setDown(Number(e.target.value))} className="mt-2 w-full accent-[#1a52c4]" />
                </label>
                <label className="text-sm text-re-mute">Interest rate: <strong className="text-re-navy">{rate.toFixed(2)}%</strong>
                  <input type="range" min={3} max={9} step={0.125} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="mt-2 w-full accent-[#1a52c4]" />
                </label>
              </div>
              <p className="mt-3 text-xs text-re-mute">Principal &amp; interest {fmtFull(pay.pi)} · tax {fmtFull(pay.tax)} · insurance {fmtFull(pay.ins)}. 30-year fixed, illustrative only.</p>
            </div>
          </div>

          {/* tour booking */}
          <aside className="min-w-0 rounded-3xl bg-re-navy p-6 text-white" aria-label="Book a tour">
            {booked ? (
              <div className="dm-fade-up py-6 text-center" role="status">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-re-cyan text-2xl text-re-navy">✓</div>
                <p className="mt-4 font-re text-2xl">Tour requested</p>
                <p className="mt-2 text-sm text-white/75">{tourType} · {days[day]?.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })} · {slot}</p>
                <p className="mt-4 text-sm text-white/75">{agent.name} will confirm shortly. Demo: nothing is sent.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (slot && e.currentTarget.reportValidity()) setBooked(true);
                }}
              >
                <p className="font-re text-xl">Book a tour</p>
                <div className="mt-4 inline-flex rounded-full bg-white/10 p-1">
                  {(["In person", "Video"] as const).map((t) => (
                    <button key={t} type="button" aria-pressed={tourType === t} onClick={() => setTourType(t)} className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${tourType === t ? "bg-white text-re-navy" : "text-white/80"}`}>{t}</button>
                  ))}
                </div>
                <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" role="group" aria-label="Day">
                  {days.map((d, i) => (
                    <button key={i} type="button" aria-pressed={day === i} onClick={() => setDay(i)} className={`flex w-14 shrink-0 flex-col items-center rounded-2xl py-2 text-sm transition ${day === i ? "bg-re-cyan text-re-navy" : "bg-white/10 hover:bg-white/20"}`}>
                      <span className="text-[11px] uppercase">{d.toLocaleDateString("en-US", { weekday: "short" })}</span>
                      <span className="font-re text-lg">{d.getDate()}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label="Time">
                  {["10:00", "11:30", "1:00", "2:30", "4:00", "5:30"].map((t) => (
                    <button key={t} type="button" aria-pressed={slot === t} onClick={() => setSlot(t)} className={`rounded-xl py-2 text-sm transition ${slot === t ? "bg-white font-semibold text-re-navy" : "bg-white/10 hover:bg-white/20"}`}>{t}</button>
                  ))}
                </div>
                <label className="mt-4 block text-sm text-white/80">Name<input required autoComplete="name" className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-white focus:border-re-cyan focus:outline-none" /></label>
                <label className="mt-3 block text-sm text-white/80">Phone<input required type="tel" autoComplete="tel" className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-white focus:border-re-cyan focus:outline-none" /></label>
                <button type="submit" disabled={!slot} className="dm-shine mt-5 w-full rounded-full bg-re-cyan py-3 font-semibold text-re-navy transition disabled:opacity-50">{slot ? `Request ${slot} tour` : "Pick a time"}</button>
              </form>
            )}
            <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-re-cyan to-[#1d6dff] font-semibold text-re-navy">{agent.initials}</span>
              <div>
                <p className="font-semibold">{agent.name}</p>
                <p className="text-sm text-white/70">{agent.role}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
