"use client";

import { useMemo, useState } from "react";
import { fmt, penthouse, priceOf, statusOf, types, type Status } from "./data";

type Unit = { id: string; floor: number; code: string; name: string; beds: string; baths: number; sqft: number; outdoor: number; price: number; status: Status; view: string };

const views: Record<string, string> = { A: "Bay & marina", B: "City skyline", C: "Bay, corner" };
const all: Unit[] = [];
for (let f = 22; f >= 3; f--) {
  ["B", "A", "C"].forEach((code, i) => {
    const t = types.find((x) => x.code === code)!;
    all.push({ id: `${f}${code}`, floor: f, code, name: t.name, beds: t.beds, baths: t.baths, sqft: t.sqft, outdoor: t.outdoor, price: priceOf(t, f), status: statusOf(f, i), view: views[code] });
  });
}
const ph: Unit[] = [
  { id: "PH-N", floor: 23, code: "PH", name: "Sky Penthouse North", beds: penthouse.beds, baths: penthouse.baths, sqft: penthouse.sqft, outdoor: penthouse.outdoor, price: penthouse.price, status: "Available", view: "360° bay & city" },
  { id: "PH-S", floor: 23, code: "PH", name: "Sky Penthouse South", beds: penthouse.beds, baths: penthouse.baths, sqft: penthouse.sqft - 180, outdoor: penthouse.outdoor - 220, price: penthouse.price - 450_000, status: "Reserved", view: "Marina & sunset" },
];

const filters = [
  { k: "all", l: "All" },
  { k: "B", l: "1 bed" },
  { k: "A", l: "2 bed + den" },
  { k: "C", l: "3 bed" },
  { k: "PH", l: "Penthouse" },
];
const tone: Record<Status, string> = {
  Available: "bg-[#1f6b52] text-white hover:bg-[#185943]",
  Reserved: "bg-hb-gold/80 text-hb-ink",
  Sold: "bg-hb-sand text-hb-mute line-through",
};

/** Live availability: a stacking plan by floor, filters, and a details card with "request this residence". */
export default function Availability() {
  const [filter, setFilter] = useState("all");
  const [onlyAvail, setOnlyAvail] = useState(false);
  const [sel, setSel] = useState<Unit>(all.find((u) => u.id === "15A")!);
  const shown = (u: Unit) => (filter === "all" || u.code === filter) && (!onlyAvail || u.status === "Available");
  const counts = useMemo(() => ({ avail: [...all, ...ph].filter((u) => u.status === "Available").length, total: all.length + ph.length }), []);

  const request = () => {
    window.dispatchEvent(new CustomEvent("hb:enquire", { detail: `${sel.name} · ${sel.code === "PH" ? "Floors 23-24" : `Floor ${sel.floor}`} (${sel.id})` }));
    document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="availability" className="scroll-mt-20 bg-hb-ivory py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#74592a]">Availability</p>
            <h2 className="mt-2 font-hb-serif text-4xl sm:text-5xl">Choose your residence</h2>
            <p className="mt-3 max-w-xl text-hb-mute">{counts.avail} of {counts.total} residences available. Pick a floor and a home to see its details.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((f) => (
              <button key={f.k} type="button" aria-pressed={filter === f.k} onClick={() => setFilter(f.k)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filter === f.k ? "bg-hb-ink text-white" : "bg-white text-hb-ink ring-1 ring-hb-ink/10 hover:ring-hb-ink/30"}`}>{f.l}</button>
            ))}
            <label className="ml-1 flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={onlyAvail} onChange={(e) => setOnlyAvail(e.target.checked)} className="h-4 w-4 accent-[#1f6b52]" /> Available only</label>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* stacking plan */}
          <div className="rounded-3xl bg-white p-4 shadow-[0_20px_60px_-30px_rgba(10,18,34,0.35)] sm:p-6">
            <div className="mb-2 grid grid-cols-[3rem_repeat(3,minmax(0,1fr))] gap-1.5 text-center text-[11px] font-semibold uppercase tracking-wider text-hb-mute">
              <span>Floor</span><span>B · 1 bed</span><span>A · 2 bed</span><span>C · 3 bed</span>
            </div>
            <div className="max-h-[560px] space-y-1.5 overflow-y-auto pr-1" data-lenis-prevent>
              <div className="grid grid-cols-[3rem_minmax(0,1fr)] gap-1.5">
                <span className="grid place-items-center text-xs font-semibold text-hb-mute">PH</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {ph.map((u) => (
                    <button key={u.id} type="button" onClick={() => setSel(u)} aria-pressed={sel.id === u.id} className={`h-10 rounded-lg text-xs font-semibold transition ${tone[u.status]} ${shown(u) ? "" : "opacity-20"} ${sel.id === u.id ? "ring-2 ring-hb-ink ring-offset-2" : ""}`}>
                      {u.name.replace("Sky Penthouse ", "PH ")} · {u.status === "Sold" ? "Sold" : fmt(u.price)}
                    </button>
                  ))}
                </div>
              </div>
              {Array.from({ length: 20 }, (_, i) => 22 - i).map((f) => (
                <div key={f} className="grid grid-cols-[3rem_repeat(3,minmax(0,1fr))] gap-1.5">
                  <span className="grid place-items-center text-xs font-semibold tabular-nums text-hb-mute">{f}</span>
                  {all.filter((u) => u.floor === f).map((u) => (
                    <button key={u.id} type="button" onClick={() => setSel(u)} aria-pressed={sel.id === u.id} aria-label={`${u.name}, floor ${u.floor}, ${u.status}${u.status === "Sold" ? "" : `, ${fmt(u.price)}`}`} className={`h-9 rounded-lg text-[11px] font-semibold tabular-nums transition sm:text-xs ${tone[u.status]} ${shown(u) ? "" : "opacity-20"} ${sel.id === u.id ? "ring-2 ring-hb-ink ring-offset-2" : ""}`}>
                      {u.status === "Sold" ? "Sold" : fmt(u.price)}
                    </button>
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-hb-mute">
              {(["Available", "Reserved", "Sold"] as Status[]).map((s) => <span key={s} className="flex items-center gap-1.5"><i className={`h-3 w-3 rounded ${tone[s].split(" ")[0]}`} />{s}</span>)}
            </div>
          </div>

          {/* details */}
          <aside className="self-start rounded-3xl bg-hb-ink p-6 text-white lg:sticky lg:top-24" aria-live="polite">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-hb-gold">{sel.code === "PH" ? "Floors 23-24" : `Floor ${sel.floor}`} · {sel.view}</p>
            <h3 className="mt-1 font-hb-serif text-4xl">{sel.name}</h3>
            <p className="mt-1 text-white/70">Residence {sel.id}</p>
            <dl className="mt-5 grid grid-cols-2 gap-2 text-sm">
              {[["Layout", sel.beds], ["Baths", String(sel.baths)], ["Interior", `${sel.sqft.toLocaleString("en-US")} sq ft`], [sel.code === "PH" ? "Terrace" : "Balcony", `${sel.outdoor.toLocaleString("en-US")} sq ft`]].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-white/[0.06] p-3"><dt className="text-[11px] uppercase tracking-wider text-white/55">{k}</dt><dd className="mt-0.5 font-semibold">{v}</dd></div>
              ))}
            </dl>
            <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-5">
              <div>
                <p className="font-hb-serif text-3xl">{sel.status === "Sold" ? "Sold" : fmt(sel.price)}</p>
                <p className="text-xs text-white/60">{sel.status === "Sold" ? "Join the resale list" : `${sel.status} · ${fmt(sel.price / sel.sqft)}/sq ft`}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${sel.status === "Available" ? "bg-[#1f6b52]" : sel.status === "Reserved" ? "bg-hb-gold text-hb-ink" : "bg-white/15"}`}>{sel.status}</span>
            </div>
            <button type="button" onClick={request} className="mt-5 w-full rounded-full bg-hb-gold py-3.5 text-sm font-semibold text-hb-ink transition hover:brightness-105">
              {sel.status === "Sold" ? "Join the waitlist" : "Request this residence"}
            </button>
            <p className="mt-3 text-center text-xs text-white/50">Fictional development · prices and availability are illustrative</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
