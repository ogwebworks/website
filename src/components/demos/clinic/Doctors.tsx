"use client";

import { useState } from "react";
import { Tilt } from "../motion";
import { doctors, services, type ServiceId } from "./data";
import { useBookingPrefill } from "./store";

const nextLabel = ["Today", "Tomorrow", "In 2 days"];

/** Clinician directory with specialty filter; "Book" pre-fills the booking wizard. */
export default function Doctors() {
  const [filter, setFilter] = useState<ServiceId | "all">("all");
  const pre = useBookingPrefill();
  const list = doctors.filter((d) => filter === "all" || d.services.includes(filter));
  const chip = (on: boolean) => `shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${on ? "bg-cl-navy text-white" : "bg-white text-cl-navy ring-1 ring-cl-navy/10 hover:ring-cl-navy/40"}`;
  return (
    <div className="min-w-0">
      <div className="flex min-w-0 gap-2 overflow-x-auto pb-2 [scrollbar-width:none]" role="group" aria-label="Filter by specialty">
        <button type="button" aria-pressed={filter === "all"} onClick={() => setFilter("all")} className={chip(filter === "all")}>All clinicians</button>
        {services.map((s) => (
          <button key={s.id} type="button" aria-pressed={filter === s.id} onClick={() => setFilter(s.id)} className={chip(filter === s.id)}>{s.title}</button>
        ))}
      </div>
      <ul key={filter} className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((d, i) => (
          <li key={d.id} className="dm-fade-up" style={{ "--i": i } as React.CSSProperties}>
            <Tilt className="h-full rounded-[2rem] bg-white p-6 ring-1 ring-cl-navy/5 shadow-[0_20px_50px_-30px_rgba(7,17,52,0.4)]" max={5}>
              <div className="flex items-start gap-4">
                <span className="relative grid h-16 w-16 shrink-0 place-items-center rounded-2xl font-cl text-xl text-cl-navy" style={{ background: `linear-gradient(135deg, ${d.hue[0]}, ${d.hue[1]})` }}>
                  {d.initials}
                  <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-[#22c55e]" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="font-cl text-xl text-cl-navy">{d.name}</p>
                  <p className="text-cl-mute">{d.title}</p>
                  <p className="mt-1 text-sm text-cl-blue">★ {d.rating.toFixed(1)} · {d.years} yrs</p>
                </div>
              </div>
              <p className="mt-5 text-sm text-cl-mute">Speaks {d.langs.join(", ")}</p>
              <div className="mt-5 flex items-center justify-between gap-3 border-t border-cl-navy/10 pt-4">
                <span className="text-sm"><span className="text-cl-mute">Next available</span><br /><strong className="text-cl-navy">{nextLabel[d.next]}</strong></span>
                <button type="button" onClick={() => pre.book(filter !== "all" && d.services.includes(filter) ? filter : d.services[0], d.id)} className="dm-shine rounded-full bg-cl-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cl-blue">
                  Book
                </button>
              </div>
            </Tilt>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-cl-mute">Fictional clinicians (demo content).</p>
    </div>
  );
}
