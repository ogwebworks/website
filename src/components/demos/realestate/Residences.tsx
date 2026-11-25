"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { fmtFull, fmtPrice } from "./data";
import { monthly } from "./ListingModal";
import { interiors, penthousePlan, project, standardPlan, typeLabel, units, type Unit, type View } from "./residences-data";

type Beds = "all" | 0 | 1 | 2 | 3;
const VIEWS: View[] = ["Sea", "City", "Park"];
const MAX = Math.max(...units.map((u) => u.price));
const MIN = Math.min(...units.map((u) => u.price));
const roundUp = (n: number) => Math.ceil(n / 50000) * 50000;

const statusText = { available: "Available", reserved: "Reserved", sold: "Sold" } as const;
const statusPill = {
  available: "bg-re-cyan/15 text-re-cyan ring-re-cyan/40",
  reserved: "bg-[#f5b942]/15 text-[#f5c96a] ring-[#f5b942]/40",
  sold: "bg-white/10 text-white/55 ring-white/15",
} as const;

/** Colour of a unit on the facade and the floor plan. */
function tone(u: Unit, match: boolean) {
  if (u.status === "sold") return { fill: "#26345e", stroke: "#33447a", text: "#7d8bb3" };
  if (u.status === "reserved") return { fill: match ? "#5b4a22" : "#3a3326", stroke: "#f5b942", text: "#f5d58e" };
  return match ? { fill: "#0e5a78", stroke: "#12d6f8", text: "#e8fbff" } : { fill: "#1a2d63", stroke: "#3c5cb0", text: "#a9bce6" };
}

/**
 * "Choose your apartment": a new-build selector like the ones developers use on sales sites.
 * Pick a floor on the building elevation, a unit on the floor plan, then see its details,
 * interior layout, price and monthly estimate, shortlist up to three to compare, or request
 * a viewing. Filters (bedrooms, budget, view, availability) light up matching homes everywhere.
 */
export default function Residences() {
  const [beds, setBeds] = useState<Beds>("all");
  const [budget, setBudget] = useState(roundUp(MAX));
  const [views, setViews] = useState<View[]>([]);
  const [onlyAvail, setOnlyAvail] = useState(false);
  const [floor, setFloor] = useState(9);
  const [hoverFloor, setHoverFloor] = useState<number | null>(null);
  const [selId, setSelId] = useState<string>("9B");
  const [hoverUnit, setHoverUnit] = useState<string | null>(null);
  const [mode, setMode] = useState<"building" | "list">("building");
  const [sort, setSort] = useState<"price" | "sqft" | "floor">("price");
  const [saved, setSaved] = useState<string[]>([]);
  const [booking, setBooking] = useState<"closed" | "open" | "sent">("closed");
  const [dusk, setDusk] = useState(true);

  const matches = (u: Unit) =>
    (beds === "all" || u.beds === beds || (beds === 3 && u.beds >= 3)) &&
    u.price <= budget &&
    (views.length === 0 || views.includes(u.view)) &&
    (!onlyAvail || u.status === "available");

  const matchCount = units.filter((u) => matches(u) && u.status !== "sold").length;
  const floorUnits = (f: number) => units.filter((u) => u.floor === f);
  const sel = units.find((u) => u.id === selId)!;
  const plan = floor >= 13 ? penthousePlan : standardPlan;
  const shownFloor = hoverFloor ?? floor;
  const available = units.filter((u) => u.status === "available");

  const pickFloor = (f: number) => {
    setFloor(f);
    setBooking("closed");
    const fu = floorUnits(f);
    const best = fu.find((u) => matches(u) && u.status === "available") ?? fu.find((u) => u.status !== "sold") ?? fu[0];
    setSelId(best.id);
  };
  const pickUnit = (u: Unit) => {
    setSelId(u.id);
    setFloor(u.floor);
    setBooking("closed");
  };
  const toggleSave = (id: string) => setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length >= 3 ? [...s.slice(1), id] : [...s, id]));

  const list = useMemo(
    () =>
      units
        .filter((u) => matches(u))
        .sort((a, b) => (sort === "price" ? a.price - b.price : sort === "sqft" ? b.sqft - a.sqft : b.floor - a.floor)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [beds, budget, views, onlyAvail, sort],
  );

  const chip = (on: boolean) =>
    `rounded-full px-3.5 py-2 text-sm font-semibold transition ${on ? "bg-re-cyan text-re-navy" : "bg-white/[0.06] text-white/80 ring-1 ring-white/15 hover:bg-white/10"}`;

  return (
    <section id="residences" aria-labelledby="res-h" className="relative isolate scroll-mt-24 overflow-hidden bg-[linear-gradient(170deg,#071134_0%,#0a1f5c_55%,#102a6e_100%)] py-20 text-white sm:py-28">
      <div className="absolute -left-40 top-20 -z-10 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(closest-side,rgba(18,214,248,0.16),transparent)]" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* ---------- Header ---------- */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-re-cyan">New development · {project.area}</p>
            <h2 id="res-h" className="mt-3 font-re text-4xl tracking-tight sm:text-5xl">Choose your apartment.</h2>
            <p className="mt-3 max-w-xl text-white/75">
              {project.name}: {project.floors} floors of sea, city and park views. Pick a floor, then a home, and book a private viewing.
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-2 text-center sm:gap-3">
            {[
              [String(available.length), "available"],
              [fmtPrice(MIN), "from"],
              [project.completion, "completion"],
            ].map(([n, l]) => (
              <div key={l} className="rounded-2xl bg-white/[0.06] px-3 py-3 ring-1 ring-white/10 sm:px-5">
                <dt className="sr-only">{l}</dt>
                <dd>
                  <span className="block font-re text-xl sm:text-2xl">{n}</span>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-white/60">{l}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ---------- Filters ---------- */}
        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-5 rounded-3xl bg-white/[0.05] p-4 ring-1 ring-white/10 sm:p-5 lg:grid-cols-[auto_minmax(0,1fr)_auto_auto] lg:items-center">
          <div role="group" aria-label="Bedrooms" className="flex flex-wrap gap-1.5">
            {(["all", 0, 1, 2, 3] as Beds[]).map((b) => (
              <button key={String(b)} type="button" aria-pressed={beds === b} onClick={() => setBeds(b)} className={chip(beds === b)}>
                {b === "all" ? "All" : b === 0 ? "Studio" : b === 3 ? "3+ bed" : `${b} bed`}
              </button>
            ))}
          </div>
          <label className="block min-w-0">
            <span className="flex justify-between text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
              Max budget <b className="font-re text-sm normal-case tracking-normal text-white">{budget >= roundUp(MAX) ? "Any" : fmtPrice(budget)}</b>
            </span>
            <input type="range" min={roundUp(MIN)} max={roundUp(MAX)} step={50000} value={budget} onChange={(e) => setBudget(+e.target.value)} className="mt-2 w-full accent-[#12d6f8]" />
          </label>
          <div role="group" aria-label="View" className="flex flex-wrap gap-1.5">
            {VIEWS.map((v) => (
              <button key={v} type="button" aria-pressed={views.includes(v)} onClick={() => setViews((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]))} className={chip(views.includes(v))}>
                {v} view
              </button>
            ))}
          </div>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-white/85">
            <input type="checkbox" checked={onlyAvail} onChange={(e) => setOnlyAvail(e.target.checked)} className="h-4 w-4 accent-[#12d6f8]" />
            Available only
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-white/75" aria-live="polite">
            <b className="text-re-cyan">{matchCount}</b> {matchCount === 1 ? "home matches" : "homes match"} your search
          </p>
          <div className="flex items-center gap-2">
            <div role="group" aria-label="Display" className="flex rounded-full bg-white/[0.06] p-1 ring-1 ring-white/10">
              {(["building", "list"] as const).map((x) => (
                <button key={x} type="button" aria-pressed={mode === x} onClick={() => setMode(x)} className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition ${mode === x ? "bg-white text-re-navy" : "text-white/75 hover:text-white"}`}>
                  {x === "building" ? "Building" : "List"}
                </button>
              ))}
            </div>
            <Legend />
          </div>
        </div>

        {/* ---------- Main ---------- */}
        <div className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)_minmax(0,1fr)]">
          {mode === "building" ? (
            <>
              {/* Building elevation */}
              <div className="relative overflow-hidden rounded-3xl bg-[#06102e] ring-1 ring-white/10">
                <div className="flex items-center justify-between px-4 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">1 · Pick a floor</p>
                  <button type="button" onClick={() => setDusk((d) => !d)} aria-pressed={dusk} className="rounded-full bg-white/[0.07] px-3 py-1 text-xs font-semibold text-white/80 ring-1 ring-white/10 hover:bg-white/10">
                    {dusk ? "☾ Dusk" : "☀ Day"}
                  </button>
                </div>
                <Facade dusk={dusk} floor={floor} hoverFloor={hoverFloor} setHoverFloor={setHoverFloor} pickFloor={pickFloor} matches={matches} />
                <div className="flex items-center justify-between gap-2 border-t border-white/10 px-4 py-3">
                  <button type="button" onClick={() => pickFloor(Math.max(1, floor - 1))} disabled={floor === 1} className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.07] ring-1 ring-white/10 disabled:opacity-30" aria-label="Floor down">↓</button>
                  <p className="text-center text-sm" aria-live="polite">
                    <span className="font-re text-lg">{shownFloor >= 13 ? `Penthouse ${shownFloor - 12}` : `Floor ${shownFloor}`}</span>
                    <span className="block text-xs text-white/60">{floorUnits(shownFloor).filter((u) => u.status === "available").length} of {floorUnits(shownFloor).length} available</span>
                  </p>
                  <button type="button" onClick={() => pickFloor(Math.min(14, floor + 1))} disabled={floor === 14} className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.07] ring-1 ring-white/10 disabled:opacity-30" aria-label="Floor up">↑</button>
                </div>
              </div>

              {/* Floor plan */}
              <div className="overflow-hidden rounded-3xl bg-[#06102e] ring-1 ring-white/10">
                <div className="flex items-center justify-between px-4 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">2 · Pick a home · {floor >= 13 ? `Penthouse level ${floor - 12}` : `Floor ${floor}`}</p>
                  <span className="text-xs text-white/50">N ↑</span>
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  <m.div key={floor} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                    <svg viewBox="0 0 600 380" className="block w-full" role="group" aria-label={`Floor plan, floor ${floor}`}>
                      <text x="300" y="24" textAnchor="middle" fontSize="11" letterSpacing="3" fill="rgba(161,193,250,0.7)">SEA · HARBOUR</text>
                      <text x="300" y="368" textAnchor="middle" fontSize="11" letterSpacing="3" fill="rgba(161,193,250,0.7)">{floor >= 13 ? "PARK" : "CITY · PARK"}</text>
                      {/* corridor + core */}
                      <rect x="20" y="150" width="560" height="80" fill="#0b1840" />
                      <rect x="255" y="160" width="90" height="60" rx="6" fill="#132558" stroke="#2a3f7a" />
                      <text x="300" y="186" textAnchor="middle" fontSize="11" fill="#8ea3d6">LIFTS</text>
                      <text x="300" y="202" textAnchor="middle" fontSize="11" fill="#8ea3d6">STAIRS</text>
                      {plan.map((s) => {
                        const u = floorUnits(floor).find((x) => x.code === s.code)!;
                        const t = tone(u, matches(u));
                        const on = u.id === selId;
                        const hv = hoverUnit === u.id;
                        return (
                          <g
                            key={s.code}
                            role="button"
                            tabIndex={0}
                            aria-pressed={on}
                            aria-label={`${u.id}, ${typeLabel(u)}, ${u.sqft} square feet, ${u.view} view, ${fmtPrice(u.price)}, ${statusText[u.status]}`}
                            onClick={() => pickUnit(u)}
                            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), pickUnit(u))}
                            onPointerEnter={() => setHoverUnit(u.id)}
                            onPointerLeave={() => setHoverUnit(null)}
                            className="cursor-pointer outline-none [&:focus-visible>path]:stroke-white"
                          >
                            <path d={s.d} fill={t.fill} stroke={on ? "#ffffff" : t.stroke} strokeWidth={on ? 4 : hv ? 3 : 1.5} style={{ transition: "fill .3s, stroke-width .2s" }} opacity={hv || on ? 1 : 0.92} />
                            <text x={s.label[0]} y={s.label[1] - 6} textAnchor="middle" fontSize="20" fontWeight="700" fill={t.text}>{u.id}</text>
                            <text x={s.label[0]} y={s.label[1] + 14} textAnchor="middle" fontSize="12" fill={t.text} opacity="0.85">
                              {typeLabel(u)} · {u.status === "sold" ? "Sold" : fmtPrice(u.price)}
                            </text>
                          </g>
                        );
                      })}
                      {/* balconies on the sea side */}
                      {plan.filter((s) => s.code !== "PH-B").slice(0, 3).map((s) => {
                        const box = s.d.match(/M(\d+) (\d+) H(\d+)/)!;
                        const x1 = +box[1], x2 = +box[3];
                        return <rect key={`b${s.code}`} x={x1 + 16} y="31" width={x2 - x1 - 32} height="7" rx="3" fill="rgba(18,214,248,0.35)" pointerEvents="none" />;
                      })}
                    </svg>
                    <ul className="grid gap-1.5 px-4 pb-4 sm:grid-cols-2" aria-label="Homes on this floor">
                      {floorUnits(floor).map((u) => (
                        <li key={u.id}>
                          <button
                            type="button"
                            onClick={() => pickUnit(u)}
                            className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm ring-1 transition ${u.id === selId ? "bg-white/10 ring-re-cyan" : "ring-white/10 hover:bg-white/[0.05]"} ${matches(u) ? "" : "opacity-60"}`}
                          >
                            <span><b className="font-re">{u.id}</b> <span className="text-white/65">· {typeLabel(u)} · {u.view}</span></span>
                            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ring-1 ${statusPill[u.status]}`}>{u.status === "available" ? fmtPrice(u.price) : statusText[u.status]}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </m.div>
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="overflow-hidden rounded-3xl bg-[#06102e] ring-1 ring-white/10 lg:col-span-2">
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">{list.length} homes</p>
                <label className="flex items-center gap-2 text-sm text-white/75">
                  Sort
                  <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="rounded-lg bg-white/[0.07] px-2 py-1 text-white ring-1 ring-white/15">
                    <option value="price">Price: low to high</option>
                    <option value="sqft">Size: largest</option>
                    <option value="floor">Floor: highest</option>
                  </select>
                </label>
              </div>
              <div className="max-h-[560px] overflow-auto" data-lenis-prevent>
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead className="sticky top-0 bg-[#0a1638] text-xs uppercase tracking-[0.14em] text-white/55">
                    <tr>{["Home", "Type", "Size", "View", "Price", "Status"].map((h) => <th key={h} scope="col" className="px-4 py-2.5 font-semibold">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {list.map((u) => (
                      <tr key={u.id} className={`cursor-pointer border-t border-white/5 transition hover:bg-white/[0.05] ${u.id === selId ? "bg-re-cyan/10" : ""}`} onClick={() => pickUnit(u)}>
                        <td className="px-4 py-2.5"><button type="button" onClick={() => pickUnit(u)} className="font-re text-base text-white">{u.id}</button></td>
                        <td className="px-4 py-2.5 text-white/80">{typeLabel(u)}</td>
                        <td className="px-4 py-2.5 text-white/80">{u.sqft.toLocaleString("en-US")} sqft</td>
                        <td className="px-4 py-2.5 text-white/80">{u.view}</td>
                        <td className="px-4 py-2.5 font-semibold">{u.status === "sold" ? "–" : fmtPrice(u.price)}</td>
                        <td className="px-4 py-2.5"><span className={`rounded-full px-2 py-0.5 text-xs ring-1 ${statusPill[u.status]}`}>{statusText[u.status]}</span></td>
                      </tr>
                    ))}
                    {list.length === 0 && (
                      <tr><td colSpan={6} className="px-4 py-10 text-center text-white/65">No homes match. Try a higher budget or fewer filters.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ---------- Unit details ---------- */}
          <AnimatePresence mode="wait" initial={false}>
            <m.aside key={sel.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.25 }} className="flex flex-col rounded-3xl bg-white p-5 text-re-navy shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] sm:p-6" aria-label={`Home ${sel.id}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-re-blue">3 · Your home</p>
                  <h3 className="mt-1 font-re text-3xl tracking-tight">Residence {sel.id}</h3>
                  <p className="text-sm text-re-mute">{typeLabel(sel)} · {sel.floor >= 13 ? `Penthouse level ${sel.floor - 12}` : `Floor ${sel.floor}`} · {sel.aspect}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${sel.status === "available" ? "bg-[#0e7490]/10 text-[#0e7490]" : sel.status === "reserved" ? "bg-[#a16207]/10 text-[#8a5a06]" : "bg-re-navy/10 text-re-mute"}`}>
                  {statusText[sel.status]}
                </span>
              </div>

              <svg viewBox="-6 -6 332 212" className="mt-4 w-full rounded-xl bg-re-ice" aria-label={`Layout of residence ${sel.id}`} role="img">
                {interiors[sel.type].map(([x, y, w, h, l]) => (
                  <g key={l}>
                    <rect x={x} y={y} width={w} height={h} fill={/Balcony|Terrace/.test(l) ? "#d7f6fd" : "#ffffff"} stroke="#071134" strokeWidth="3" />
                    <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize="12" fill="#4b5a7d">{l}</text>
                  </g>
                ))}
              </svg>
              {!matches(sel) && sel.status !== "sold" && <p className="mt-2 text-xs text-[#8a5a06]">This home is outside your current filters.</p>}

              <dl className="mt-4 grid grid-cols-4 gap-2 text-center">
                {[
                  [sel.beds === 0 ? "Studio" : String(sel.beds), sel.beds === 0 ? "layout" : "beds"],
                  [String(sel.baths), "baths"],
                  [sel.sqft.toLocaleString("en-US"), "sqft"],
                  [String(sel.outdoor), sel.type === "ph" ? "terrace" : "balcony"],
                ].map(([n, l]) => (
                  <div key={l} className="rounded-xl bg-re-ice px-1 py-2">
                    <dt className="sr-only">{l}</dt>
                    <dd><span className="block font-re text-lg">{n}</span><span className="text-[10px] uppercase tracking-[0.12em] text-re-mute">{l}</span></dd>
                  </div>
                ))}
              </dl>

              <div className="mt-4 flex items-end justify-between gap-3 border-t border-re-navy/10 pt-4">
                <div>
                  <p className="font-re text-3xl">{sel.status === "sold" ? "Sold" : fmtFull(sel.price)}</p>
                  {sel.status !== "sold" && <p className="text-xs text-re-mute">{fmtFull(sel.price / sel.sqft)}/sqft · {sel.view} view</p>}
                </div>
                {sel.status !== "sold" && (
                  <p className="text-right text-sm">
                    <span className="block font-semibold">{fmtFull(monthly(sel.price, 20, 6.5).total)}/mo</span>
                    <span className="text-xs text-re-mute">20% down, 6.5%, 30 yrs, incl. tax &amp; insurance</span>
                  </p>
                )}
              </div>

              {booking === "open" ? (
                <form
                  className="mt-4 space-y-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (e.currentTarget.reportValidity()) setBooking("sent");
                  }}
                >
                  <input required placeholder="Your name" autoComplete="name" className="w-full rounded-xl border border-re-navy/15 px-3 py-2.5 text-sm" />
                  <input required type="email" placeholder="Email" autoComplete="email" className="w-full rounded-xl border border-re-navy/15 px-3 py-2.5 text-sm" />
                  <select className="w-full rounded-xl border border-re-navy/15 px-3 py-2.5 text-sm" defaultValue="Sat">
                    <option>Sat 10:00 · Sales suite</option>
                    <option>Sat 14:00 · Sales suite</option>
                    <option>Sun 11:00 · Sales suite</option>
                    <option>Video tour, any weekday</option>
                  </select>
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 rounded-full bg-re-navy py-3 text-sm font-semibold text-white">Request viewing</button>
                    <button type="button" onClick={() => setBooking("closed")} className="rounded-full px-4 text-sm text-re-mute">Cancel</button>
                  </div>
                </form>
              ) : booking === "sent" ? (
                <p className="mt-4 rounded-2xl bg-[#0e7490]/10 p-4 text-sm text-[#0e5a6e]" role="status">
                  Viewing requested for residence {sel.id}. A sales consultant would confirm by email. <span className="text-re-mute">(Demo: nothing is sent.)</span>
                </p>
              ) : (
                <div className="mt-4 flex gap-2">
                  <button type="button" disabled={sel.status === "sold"} onClick={() => setBooking("open")} className="flex-1 rounded-full bg-re-navy py-3 text-sm font-semibold text-white transition hover:bg-re-blue disabled:opacity-40">
                    {sel.status === "reserved" ? "Join waitlist" : "Book a viewing"}
                  </button>
                  <button type="button" onClick={() => toggleSave(sel.id)} aria-pressed={saved.includes(sel.id)} className={`rounded-full px-4 text-sm font-semibold ring-1 transition ${saved.includes(sel.id) ? "bg-re-cyan text-re-navy ring-re-cyan" : "ring-re-navy/20 hover:ring-re-navy/40"}`}>
                    {saved.includes(sel.id) ? "♥ Saved" : "♡ Compare"}
                  </button>
                </div>
              )}
            </m.aside>
          </AnimatePresence>
        </div>

        {/* ---------- Compare tray ---------- */}
        <AnimatePresence>
          {saved.length > 0 && (
            <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="mt-5 overflow-x-auto rounded-3xl bg-white/[0.06] p-4 ring-1 ring-white/10 sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Compare ({saved.length}/3)</p>
                <button type="button" onClick={() => setSaved([])} className="text-sm text-white/65 underline-offset-4 hover:underline">Clear</button>
              </div>
              <table className="w-full min-w-[520px] text-sm">
                <tbody>
                  {(
                    [
                      ["Home", (u: Unit) => <button type="button" onClick={() => pickUnit(u)} className="font-re text-lg text-re-cyan">{u.id}</button>],
                      ["Type", (u: Unit) => typeLabel(u)],
                      ["Size", (u: Unit) => `${u.sqft.toLocaleString("en-US")} sqft + ${u.outdoor} outdoor`],
                      ["View", (u: Unit) => `${u.view} · ${u.aspect}`],
                      ["Price", (u: Unit) => (u.status === "sold" ? "Sold" : fmtFull(u.price))],
                      ["Per sqft", (u: Unit) => fmtFull(u.price / u.sqft)],
                      ["Monthly", (u: Unit) => `${fmtFull(monthly(u.price, 20, 6.5).total)}/mo`],
                    ] as [string, (u: Unit) => React.ReactNode][]
                  ).map(([label, fn]) => (
                    <tr key={label} className="border-t border-white/5 first:border-0">
                      <th scope="row" className="w-28 py-2 pr-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-white/55">{label}</th>
                      {saved.map((id) => {
                        const u = units.find((x) => x.id === id)!;
                        return <td key={id} className="py-2 pr-4 text-white/90">{fn(u)}</td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </m.div>
          )}
        </AnimatePresence>
        <p className="mt-4 text-xs text-white/45">Fictional development for demonstration. Prices, availability and layouts are illustrative.</p>
      </div>
    </section>
  );
}

function Legend() {
  const items = [["#12d6f8", "Matches"], ["#3c5cb0", "Available"], ["#f5b942", "Reserved"], ["#33447a", "Sold"]];
  return (
    <ul className="hidden items-center gap-3 text-xs text-white/70 sm:flex" aria-label="Legend">
      {items.map(([c, l]) => (
        <li key={l} className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm" style={{ background: c }} />{l}</li>
      ))}
    </ul>
  );
}

/* ---------- Building elevation (SVG) ---------- */
function Facade({
  dusk,
  floor,
  hoverFloor,
  setHoverFloor,
  pickFloor,
  matches,
}: {
  dusk: boolean;
  floor: number;
  hoverFloor: number | null;
  setHoverFloor: (f: number | null) => void;
  pickFloor: (f: number) => void;
  matches: (u: Unit) => boolean;
}) {
  const top = 70, fh = 30, left = 50, width = 220;
  const y = (f: number) => top + (14 - f) * fh;
  return (
    <svg viewBox="0 0 320 560" className="mx-auto block w-full max-w-[280px] lg:max-w-none" role="group" aria-label="Building: choose a floor">
      <defs>
        <linearGradient id="res-sky" x1="0" y1="0" x2="0" y2="1">
          {dusk ? (<><stop offset="0" stopColor="#071134" /><stop offset="0.7" stopColor="#16307a" /><stop offset="1" stopColor="#2f6fe0" /></>) : (<><stop offset="0" stopColor="#8fc2ff" /><stop offset="1" stopColor="#dcecff" /></>)}
        </linearGradient>
        <linearGradient id="res-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={dusk ? "#0f1f4d" : "#bcd6f7"} />
          <stop offset="1" stopColor={dusk ? "#0a163a" : "#9fbfe8"} />
        </linearGradient>
      </defs>
      <rect width="320" height="560" fill="url(#res-sky)" style={{ transition: "all .6s" }} />
      {dusk && [[40, 30], [120, 18], [260, 40], [290, 22], [200, 12]].map(([cx, cy]) => <circle key={cx} cx={cx} cy={cy} r="1.2" fill="white" opacity="0.7" />)}
      {/* neighbouring towers */}
      <rect x="0" y="300" width="44" height="260" fill={dusk ? "#0b1638" : "#a9c4ea"} />
      <rect x="276" y="250" width="44" height="310" fill={dusk ? "#0b1638" : "#a9c4ea"} />
      {/* crown */}
      <rect x={left + 30} y={top - 26} width={width - 60} height="18" rx="3" fill={dusk ? "#132558" : "#7a98c9"} />
      <rect x={left + 60} y={top - 40} width={width - 120} height="14" rx="3" fill={dusk ? "#0f1e4a" : "#6d8bbd"} />
      <rect x={left - 4} y={top - 8} width={width + 8} height="8" fill={dusk ? "#1b2f6a" : "#88a6d6"} />
      {/* body */}
      <rect x={left} y={top} width={width} height={fh * 14} fill="url(#res-glass)" />
      {Array.from({ length: 14 }, (_, i) => 14 - i).map((f) => {
        const fu = units.filter((u) => u.floor === f);
        const cols = fu.length;
        const cw = (width - 12) / cols;
        const on = f === floor;
        const hv = f === hoverFloor;
        const avail = fu.filter((u) => u.status === "available").length;
        return (
          <g
            key={f}
            role="button"
            tabIndex={0}
            aria-pressed={on}
            aria-label={`${f >= 13 ? `Penthouse level ${f - 12}` : `Floor ${f}`}: ${avail} of ${cols} available`}
            onClick={() => pickFloor(f)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), pickFloor(f))}
            onPointerEnter={() => setHoverFloor(f)}
            onPointerLeave={() => setHoverFloor(null)}
            onFocus={() => setHoverFloor(f)}
            onBlur={() => setHoverFloor(null)}
            className="cursor-pointer outline-none"
          >
            <rect x={left} y={y(f)} width={width} height={fh} fill={on ? "rgba(18,214,248,0.22)" : hv ? "rgba(255,255,255,0.1)" : "transparent"} style={{ transition: "fill .2s" }} />
            {fu.map((u, i) => {
              const t = tone(u, matches(u));
              return (
                <rect
                  key={u.id}
                  x={left + 6 + i * cw + 2}
                  y={y(f) + 5}
                  width={cw - 4}
                  height={fh - 10}
                  rx="2"
                  fill={u.status === "available" && matches(u) && dusk ? "#12a9c9" : t.fill}
                  stroke={u.status === "sold" ? "transparent" : t.stroke}
                  strokeWidth="1.2"
                  opacity={u.status === "sold" ? 0.75 : 1}
                  style={{ transition: "fill .3s" }}
                />
              );
            })}
            {/* slab line */}
            <rect x={left} y={y(f) + fh - 1.5} width={width} height="1.5" fill={dusk ? "#22356f" : "#7d9acb"} />
            {(on || hv) && (
              <g pointerEvents="none">
                <rect x={left + width + 6} y={y(f) + 6} width="42" height="18" rx="9" fill={on ? "#12d6f8" : "#ffffff"} />
                <text x={left + width + 27} y={y(f) + 19} textAnchor="middle" fontSize="11" fontWeight="700" fill="#071134">{f >= 13 ? `PH${f - 12}` : `L${f}`}</text>
              </g>
            )}
            {on && <rect x={left - 2} y={y(f)} width={width + 4} height={fh} fill="none" stroke="#12d6f8" strokeWidth="2" rx="2" pointerEvents="none" />}
          </g>
        );
      })}
      {/* lobby */}
      <rect x={left} y={top + fh * 14} width={width} height="34" fill={dusk ? "#0c1a45" : "#7f9bc9"} />
      <rect x={left + 80} y={top + fh * 14 + 6} width={60} height="28" fill={dusk ? "#f7d48a" : "#dfeeff"} opacity={dusk ? 0.85 : 1} />
      <rect x="0" y={top + fh * 14 + 34} width="320" height="40" fill={dusk ? "#06102e" : "#5d7db0"} />
      {[30, 70, 250, 290].map((x) => (
        <g key={x}>
          <rect x={x - 1.5} y={top + fh * 14 + 18} width="3" height="18" fill={dusk ? "#0b1638" : "#46628f"} />
          <circle cx={x} cy={top + fh * 14 + 14} r="10" fill={dusk ? "#0e2150" : "#4f7fb8"} />
        </g>
      ))}
    </svg>
  );
}
