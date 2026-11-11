"use client";

import { useMemo, useState } from "react";
import { useNow } from "../motion";
import { hours, resto } from "./data";

const mono = "font-rs-mono text-xs uppercase tracking-[0.18em] text-rs-mute";

/** Reservation as a perforated ticket that gets stamped on confirmation. */
export default function Ticket() {
  const now = useNow(60 * 60 * 1000);
  const days = useMemo(() => {
    if (!now) return [];
    return Array.from({ length: 10 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      return { d, open: hours.find((h) => h.day === d.toLocaleDateString("en-US", { weekday: "long" }))?.open };
    }).filter((x) => x.open);
  }, [now]);
  const [party, setParty] = useState(2);
  const [di, setDi] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [stamped, setStamped] = useState(false);
  const day = days[di];
  const slots = useMemo(() => {
    if (!day?.open) return [];
    const out: { t: string; full: boolean }[] = [];
    for (let h = day.open[0]; h < Math.min(day.open[1], 22.5); h += 0.75) {
      const hh = Math.floor(h), mm = Math.round((h % 1) * 60);
      out.push({ t: `${hh > 12 ? hh - 12 : hh}:${String(mm).padStart(2, "0")}`, full: (day.d.getDate() + out.length * 3 + party) % 5 === 0 });
    }
    return out;
  }, [day, party]);

  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="relative grid grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[2rem] bg-rs-paper shadow-[8px_8px_0_#1c1a16] ring-2 ring-rs-ink md:grid-cols-[minmax(0,1fr)_200px]">
        {/* main stub */}
        <form
          className="rs-grain relative p-6 sm:p-10"
          onSubmit={(e) => {
            e.preventDefault();
            if (slot && e.currentTarget.reportValidity()) setStamped(true);
          }}
        >
          <p className={mono}>Admit {party} · {resto.name}</p>
          <div className="mt-6">
            <p className={mono}>Party</p>
            <div className="mt-2 flex items-center gap-4">
              <button type="button" disabled={stamped} onClick={() => setParty(Math.max(1, party - 1))} className="grid h-12 w-12 place-items-center rounded-full font-rs text-2xl ring-2 ring-rs-ink transition hover:bg-rs-ink hover:text-rs-paper disabled:opacity-40" aria-label="Fewer guests">−</button>
              <span className="w-16 text-center font-rs text-6xl font-extrabold tabular-nums" aria-live="polite">{party}</span>
              <button type="button" disabled={stamped} onClick={() => setParty(Math.min(12, party + 1))} className="grid h-12 w-12 place-items-center rounded-full font-rs text-2xl ring-2 ring-rs-ink transition hover:bg-rs-ink hover:text-rs-paper disabled:opacity-40" aria-label="More guests">+</button>
            </div>
          </div>
          <div className="mt-6">
            <p className={mono}>Date</p>
            <div className="mt-2 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]" role="group" aria-label="Choose a date">
              {days.length === 0 && <span className="h-16" />}
              {days.map((x, i) => (
                <button key={x.d.toDateString()} type="button" disabled={stamped} aria-pressed={di === i} onClick={() => { setDi(i); setSlot(null); }} className={`shrink-0 rounded-2xl px-3 py-2 text-center ring-2 ring-rs-ink transition ${di === i ? "bg-rs-ink text-rs-paper" : "hover:bg-rs-paper2"}`}>
                  <span className="block font-rs-mono text-[11px] uppercase">{x.d.toLocaleDateString("en-US", { weekday: "short" })}</span>
                  <span className="block font-rs text-2xl font-extrabold">{x.d.getDate()}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <p className={mono}>Time (pm)</p>
            <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Choose a time">
              {slots.map((s) => (
                <button key={s.t} type="button" disabled={s.full || stamped} aria-pressed={slot === s.t} onClick={() => setSlot(s.t)} className={`rounded-full px-4 py-2 font-rs-mono text-sm ring-2 ring-rs-ink transition ${slot === s.t ? "bg-rs-deep text-rs-paper ring-rs-deep" : "hover:bg-rs-paper2"} disabled:cursor-not-allowed disabled:opacity-35 disabled:line-through`}>
                  {s.t}
                </button>
              ))}
            </div>
          </div>
          <label className="mt-6 block">
            <span className={mono}>Name on the booking</span>
            <input required disabled={stamped} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full border-b-2 border-rs-ink bg-transparent pb-2 font-rs text-2xl font-bold text-rs-ink placeholder:text-rs-mute/60 focus:border-rs-deep focus:outline-none" placeholder="Your name" />
          </label>
          <label className="mt-5 block">
            <span className={mono}>Phone</span>
            <input required disabled={stamped} type="tel" autoComplete="tel" className="mt-2 w-full border-b-2 border-rs-ink bg-transparent pb-2 font-rs-mono text-lg text-rs-ink focus:border-rs-deep focus:outline-none" />
          </label>
          {!stamped && (
            <button type="submit" disabled={!slot} className="mt-8 w-full rounded-full bg-rs-ink py-4 font-rs-mono text-sm uppercase tracking-[0.18em] text-rs-paper transition hover:bg-rs-deep disabled:opacity-40">
              {slot ? `Hold the table · ${slot}pm` : "Pick a time"}
            </button>
          )}
          {stamped && (
            <p className="mt-8 font-rs-mono text-sm text-rs-mute" role="status">
              Confirmed for {name.split(" ")[0] || "you"}: {day?.d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}, {slot}pm. Demo: nothing is sent.
              <button type="button" onClick={() => { setStamped(false); setSlot(null); }} className="ml-2 underline underline-offset-4">Book another</button>
            </p>
          )}

          {stamped && (
            <div className="rs-stamp pointer-events-none absolute right-6 top-6 grid h-36 w-36 place-items-center rounded-full border-4 border-double border-rs-deep text-center font-rs-mono text-xs font-medium uppercase leading-tight tracking-[0.14em] text-rs-deep sm:right-12 sm:top-10 sm:h-44 sm:w-44" aria-hidden="true">
              <span>
                Confirmed
                <span className="my-1 block font-rs text-4xl font-extrabold tracking-tight">{slot}</span>
                Table for {party}
              </span>
            </div>
          )}
        </form>

        {/* tear-off stub */}
        <div className="relative hidden flex-col justify-between border-l-2 border-dashed border-rs-ink bg-rs-deep p-6 text-rs-paper md:flex">
          <span className="absolute -left-[13px] -top-3 h-6 w-6 rounded-full bg-rs-paper2 ring-2 ring-rs-ink" aria-hidden="true" />
          <span className="absolute -bottom-3 -left-[13px] h-6 w-6 rounded-full bg-rs-paper2 ring-2 ring-rs-ink" aria-hidden="true" />
          <p className="font-rs-mono text-xs uppercase tracking-[0.2em]">No.</p>
          <p className="font-rs text-5xl font-extrabold leading-none [writing-mode:vertical-rl]">{String(party * 137 + (slot?.length ?? 0) * 11).padStart(4, "0")}</p>
          <p className="font-rs-mono text-xs uppercase tracking-[0.2em]">Keep this stub</p>
        </div>
      </div>
    </div>
  );
}
