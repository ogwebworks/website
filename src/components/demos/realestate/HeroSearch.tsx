"use client";

import { useState } from "react";
import { areas, listings, type Area, type Listing } from "./data";
import { useRe } from "./store";

const sel = "w-full appearance-none rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white focus:border-re-cyan focus:outline-none [&>option]:text-re-navy";

/** Glass search panel in the hero; writes filters to the shared store and scrolls to results. */
export default function HeroSearch() {
  const re = useRe();
  const [mode, setMode] = useState<"buy" | "sell">("buy");
  const [area, setArea] = useState<Area | "Any">("Any");
  const [type, setType] = useState<Listing["type"] | "Any">("Any");
  const [beds, setBeds] = useState(0);
  const [max, setMax] = useState(3500000);
  const count = listings.filter((l) => (area === "Any" || l.area === area) && (type === "Any" || l.type === type) && l.beds >= beds && l.price <= max).length;

  return (
    <div className="rounded-3xl border border-white/15 bg-white/[0.07] p-5 shadow-2xl backdrop-blur-xl sm:p-6">
      <div className="mb-5 inline-flex rounded-full bg-white/10 p-1" role="tablist" aria-label="Search mode">
        {(["buy", "sell"] as const).map((m) => (
          <button key={m} role="tab" type="button" aria-selected={mode === m} onClick={() => setMode(m)} className={`rounded-full px-5 py-2 text-sm font-semibold capitalize transition ${mode === m ? "bg-white text-re-navy" : "text-white/80 hover:text-white"}`}>
            {m}
          </button>
        ))}
      </div>
      {mode === "buy" ? (
        <form
          className="grid grid-cols-2 gap-3 lg:grid-cols-[1.3fr_1fr_0.8fr_1fr_auto]"
          onSubmit={(e) => {
            e.preventDefault();
            re.setFilters({ area, type, beds, maxPrice: max });
            document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <label className="col-span-2 text-xs font-medium uppercase tracking-[0.14em] text-white/70 lg:col-span-1">
            Neighbourhood
            <select value={area} onChange={(e) => setArea(e.target.value as Area | "Any")} className={`${sel} mt-1.5 text-sm normal-case tracking-normal`}>
              <option value="Any">All of {`Bayview`}</option>
              {areas.map((a) => <option key={a}>{a}</option>)}
            </select>
          </label>
          <label className="text-xs font-medium uppercase tracking-[0.14em] text-white/70">
            Type
            <select value={type} onChange={(e) => setType(e.target.value as Listing["type"] | "Any")} className={`${sel} mt-1.5 text-sm normal-case tracking-normal`}>
              <option value="Any">Any</option>
              <option>House</option>
              <option>Condo</option>
              <option>Townhome</option>
            </select>
          </label>
          <label className="text-xs font-medium uppercase tracking-[0.14em] text-white/70">
            Beds
            <select value={beds} onChange={(e) => setBeds(Number(e.target.value))} className={`${sel} mt-1.5 text-sm normal-case tracking-normal`}>
              {[0, 1, 2, 3, 4].map((b) => <option key={b} value={b}>{b ? `${b}+` : "Any"}</option>)}
            </select>
          </label>
          <label className="col-span-2 text-xs font-medium uppercase tracking-[0.14em] text-white/70 lg:col-span-1">
            Max price
            <select value={max} onChange={(e) => setMax(Number(e.target.value))} className={`${sel} mt-1.5 text-sm normal-case tracking-normal`}>
              {[750000, 1000000, 1500000, 2000000, 3500000].map((p) => <option key={p} value={p}>{p === 3500000 ? "No max" : `$${(p / 1e6).toFixed(p % 1e6 ? 2 : 1)}M`}</option>)}
            </select>
          </label>
          <button type="submit" className="dm-shine col-span-2 self-end rounded-xl bg-re-cyan px-6 py-3 font-semibold text-re-navy transition hover:brightness-110 lg:col-span-1">
            Search {count} {count === 1 ? "home" : "homes"}
          </button>
        </form>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-white/80">Find out what your home is worth in 30 seconds, then get a free market report from a local agent.</p>
          <a href="#value" className="dm-shine shrink-0 rounded-xl bg-re-cyan px-6 py-3 text-center font-semibold text-re-navy">Get my home value</a>
        </div>
      )}
    </div>
  );
}
