"use client";

import { useState } from "react";
import { areas, fmtFull, fmtPrice, listings, type Area } from "./data";
import { monthly } from "./ListingModal";
import { useRe } from "./store";

/** Stylised map of Bayview with listing pins; clicking a pin opens the listing. */
export function ListingMap() {
  const re = useRe();
  const [hover, setHover] = useState<string | null>(null);
  return (
    <div className="relative aspect-[16/10] min-h-[320px] overflow-hidden rounded-[2rem] bg-re-navy shadow-2xl">
      <svg viewBox="0 0 160 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <path d="M100 100 Q110 70 130 62 T160 48 V100 Z" fill="#16307a" />
        <path d="M0 90 Q40 78 70 88 T120 100 H0 Z" fill="#16307a" opacity="0.7" />
        <g stroke="rgba(195,205,230,0.12)" strokeWidth="0.6" fill="none">
          {[14, 28, 42, 56, 70].map((y) => <path key={y} d={`M0 ${y} H160`} />)}
          {[20, 40, 60, 80, 100, 120, 140].map((x) => <path key={x} d={`M${x} 0 V100`} />)}
        </g>
        <g stroke="rgba(195,205,230,0.28)" strokeWidth="1.6" fill="none">
          <path d="M0 50 Q60 44 100 30 T160 20" />
          <path d="M58 0 Q62 50 70 100" />
        </g>
      </svg>
      {[["Oak Hills", "20%", "14%"], ["Downtown", "50%", "48%"], ["Harbour District", "74%", "86%"], ["Riverside", "28%", "88%"]].map(([n, x, y]) => (
        <span key={n} className="absolute -translate-x-1/2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50" style={{ left: x, top: y }}>{n}</span>
      ))}
      {listings.map((l) => (
        <button
          key={l.id}
          type="button"
          onClick={() => re.openListing(l.id)}
          onPointerEnter={() => setHover(l.id)}
          onPointerLeave={() => setHover(null)}
          onFocus={() => setHover(l.id)}
          onBlur={() => setHover(null)}
          className="absolute -translate-x-1/2 -translate-y-full"
          style={{ left: `${l.pin.x}%`, top: `${l.pin.y}%` }}
          aria-label={`${l.title}, ${fmtPrice(l.price)}, ${l.area}`}
        >
          <span className={`block rounded-full px-3 py-1.5 text-xs font-bold shadow-lg transition duration-300 ${hover === l.id ? "scale-110 bg-white text-re-navy" : "bg-re-cyan text-re-navy"}`}>{fmtPrice(l.price)}</span>
          <span className="mx-auto block h-2 w-2 -translate-y-1 rotate-45 bg-re-cyan" />
          {hover === l.id && (
            <span className="dm-fade-up absolute bottom-full left-1/2 mb-2 w-44 -translate-x-1/2 rounded-xl bg-white p-3 text-left text-re-navy shadow-xl">
              <span className="block font-semibold">{l.title}</span>
              <span className="block text-xs text-re-mute">{l.beds} bd · {l.baths} ba · {l.area}</span>
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

/** Standalone mortgage calculator with an animated breakdown ring. */
export function Mortgage() {
  const [price, setPrice] = useState(1200000);
  const [down, setDown] = useState(20);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);
  const p = monthly(price, down, rate, years);
  const parts = [
    { k: "Principal & interest", v: p.pi, c: "#12d6f8" },
    { k: "Property tax", v: p.tax, c: "#1d6dff" },
    { k: "Insurance", v: p.ins, c: "#a1c1fa" },
  ];
  let acc = 0;
  const ring = parts.map((x) => { const s = (acc / p.total) * 360; acc += x.v; return `${x.c} ${s}deg ${(acc / p.total) * 360}deg`; }).join(", ");
  const field = "mt-2 w-full accent-[#12d6f8]";
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 rounded-[2rem] bg-re-navy p-6 text-white sm:p-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <div className="space-y-6">
        <label className="block text-sm text-white/75">Home price <strong className="float-right font-re text-lg text-white">{fmtFull(price)}</strong>
          <input type="range" min={300000} max={4000000} step={25000} value={price} onChange={(e) => setPrice(Number(e.target.value))} className={field} />
        </label>
        <label className="block text-sm text-white/75">Down payment <strong className="float-right font-re text-lg text-white">{down}% · {fmtPrice(price * down / 100)}</strong>
          <input type="range" min={3} max={60} value={down} onChange={(e) => setDown(Number(e.target.value))} className={field} />
        </label>
        <label className="block text-sm text-white/75">Interest rate <strong className="float-right font-re text-lg text-white">{rate.toFixed(2)}%</strong>
          <input type="range" min={3} max={9} step={0.125} value={rate} onChange={(e) => setRate(Number(e.target.value))} className={field} />
        </label>
        <fieldset>
          <legend className="text-sm text-white/75">Loan term</legend>
          <div className="mt-2 flex gap-2">
            {[15, 20, 30].map((y) => (
              <button key={y} type="button" aria-pressed={years === y} onClick={() => setYears(y)} className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${years === y ? "bg-re-cyan text-re-navy" : "bg-white/10 hover:bg-white/20"}`}>{y} years</button>
            ))}
          </div>
        </fieldset>
      </div>
      <div className="flex flex-col items-center">
        <div className="relative grid h-56 w-56 place-items-center rounded-full transition-[background] duration-500 sm:h-64 sm:w-64" style={{ background: `conic-gradient(${ring})` }}>
          <div className="grid h-[78%] w-[78%] place-items-center rounded-full bg-re-navy text-center">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/70">Per month</p>
              <p className="font-re text-4xl" aria-live="polite">{fmtFull(p.total)}</p>
            </div>
          </div>
        </div>
        <ul className="mt-6 w-full max-w-xs space-y-2 text-sm">
          {parts.map((x) => (
            <li key={x.k} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-white/80"><span className="h-2.5 w-2.5 rounded-full" style={{ background: x.c }} />{x.k}</span>
              <span className="font-semibold">{fmtFull(x.v)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-center text-xs text-white/70">Illustrative estimate. Tax 1.1%, insurance 0.35% of price per year.</p>
      </div>
    </div>
  );
}

/** Home valuation lead magnet: address + details -> estimated range (deterministic demo). */
export function Valuation() {
  const [area, setArea] = useState<Area>("Riverside");
  const [beds, setBeds] = useState(3);
  const [sqft, setSqft] = useState(1800);
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<[number, number] | null>(null);
  const perSqft: Record<Area, number> = { "Harbour District": 760, "Oak Hills": 690, Riverside: 500, Downtown: 830 };
  const field = "mt-1.5 w-full rounded-xl border border-re-navy/15 bg-white px-4 py-3 text-re-navy focus:border-re-blue focus:outline-none";
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-2">
      <form
        className="rounded-[2rem] bg-white p-6 shadow-[0_20px_60px_-30px_rgba(7,17,52,0.4)] ring-1 ring-re-navy/5 sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (!e.currentTarget.reportValidity()) return;
          const base = sqft * perSqft[area] * (1 + (beds - 3) * 0.04);
          setResult([Math.round((base * 0.94) / 5000) * 5000, Math.round((base * 1.06) / 5000) * 5000]);
        }}
      >
        <p className="font-re text-2xl text-re-navy">What&apos;s my home worth?</p>
        <label className="mt-5 block text-sm font-medium text-re-navy">Street address<input required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. 12 Harbour View" className={field} /></label>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="col-span-2 block text-sm font-medium text-re-navy">Area
            <select value={area} onChange={(e) => setArea(e.target.value as Area)} className={field}>{areas.map((a) => <option key={a}>{a}</option>)}</select>
          </label>
          <label className="block text-sm font-medium text-re-navy">Beds
            <select value={beds} onChange={(e) => setBeds(Number(e.target.value))} className={field}>{[1, 2, 3, 4, 5].map((b) => <option key={b}>{b}</option>)}</select>
          </label>
          <label className="block text-sm font-medium text-re-navy">Sq ft
            <input type="number" min={400} max={8000} step={50} value={sqft} onChange={(e) => setSqft(Number(e.target.value))} className={field} />
          </label>
        </div>
        <button type="submit" className="dm-shine mt-6 w-full rounded-full bg-re-navy py-4 font-semibold text-white transition hover:bg-re-royal">Get my estimate</button>
      </form>
      <div className="flex flex-col justify-center rounded-[2rem] bg-gradient-to-br from-re-royal to-re-navy p-8 text-white" aria-live="polite">
        {result ? (
          <div className="dm-fade-up">
            <p className="text-sm uppercase tracking-[0.18em] text-white/70">Estimated value · {address || "your home"}</p>
            <p className="mt-3 font-re text-4xl sm:text-5xl">{fmtPrice(result[0])} – {fmtPrice(result[1])}</p>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-2/3 rounded-full bg-gradient-to-r from-re-cyan to-[#1d6dff]" /></div>
            <p className="mt-4 text-white/80">Based on recent sales in {area}. A local agent will send a full comparative market report within 24 hours.</p>
            <a href="#tour" className="mt-6 inline-block rounded-full bg-re-cyan px-6 py-3 font-semibold text-re-navy">Talk to an agent</a>
            <p className="mt-4 text-xs text-white/70">Demo estimate for a fictional market.</p>
          </div>
        ) : (
          <div>
            <p className="font-re text-3xl">Selling soon?</p>
            <p className="mt-3 text-white/80">Get an instant estimate, then a free, no-obligation valuation from an agent who knows your street.</p>
            <ul className="mt-6 space-y-2 text-white/85">
              <li>✓ Instant online estimate</li>
              <li>✓ Professional photos &amp; 3D tour included</li>
              <li>✓ Average 12 days on market (demo figure)</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/** General "book a tour / talk to an agent" form. */
export function TourForm() {
  const [done, setDone] = useState(false);
  const field = "mt-1.5 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:border-re-cyan focus:outline-none [&>option]:text-re-navy";
  if (done)
    return (
      <div className="dm-fade-up rounded-[2rem] border border-white/15 bg-white/[0.07] p-8 text-center backdrop-blur-xl" role="status">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-re-cyan text-2xl text-re-navy">✓</div>
        <p className="mt-4 font-re text-2xl">Request received</p>
        <p className="mt-2 text-white/75">An agent will call you within the hour to confirm. Demo: nothing is sent.</p>
      </div>
    );
  return (
    <form
      className="rounded-[2rem] border border-white/15 bg-white/[0.07] p-6 backdrop-blur-xl sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        if (e.currentTarget.reportValidity()) setDone(true);
      }}
    >
      <label className="block text-sm text-white/80">I&apos;m interested in
        <select className={field} defaultValue="any">
          <option value="any">Any home / general advice</option>
          {listings.map((l) => <option key={l.id} value={l.id}>{l.title} · {fmtPrice(l.price)}</option>)}
        </select>
      </label>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-white/80">Name<input required autoComplete="name" className={field} /></label>
        <label className="block text-sm text-white/80">Phone<input required type="tel" autoComplete="tel" className={field} /></label>
      </div>
      <label className="mt-4 block text-sm text-white/80">Email<input required type="email" autoComplete="email" className={field} /></label>
      <button type="submit" className="dm-shine mt-6 w-full rounded-full bg-re-cyan py-4 font-semibold text-re-navy">Book my tour</button>
    </form>
  );
}
