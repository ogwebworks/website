"use client";

import { useState } from "react";
import { menu, type Diet } from "./data";
import PlateArt from "./PlateArt";

const dietLabel: Record<Diet, string> = { V: "Vegetarian", VG: "Vegan", GF: "Gluten-free" };

/** Interactive menu: animated category tabs + dietary filters + a hover preview plate. */
export default function MenuTabs() {
  const [tab, setTab] = useState(menu[0].id);
  const [diet, setDiet] = useState<Diet | null>(null);
  const cat = menu.find((c) => c.id === tab)!;
  const dishes = cat.dishes.filter((d) => !diet || d.diet?.includes(diet) || (diet === "V" && d.diet?.includes("VG")));
  const [hover, setHover] = useState<string | null>(null);
  const preview = dishes.find((d) => d.id === hover) ?? dishes[0];

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
      <div>
        <div role="tablist" aria-label="Menu sections" className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
          {menu.map((c) => (
            <button
              key={c.id}
              role="tab"
              type="button"
              aria-selected={tab === c.id}
              aria-controls="es-menu-panel"
              onClick={() => {
                setTab(c.id);
                setHover(null);
              }}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition duration-300 ${tab === c.id ? "bg-es-cream text-es-char shadow-[0_8px_30px_-10px_rgba(244,234,217,0.6)]" : "text-es-cream/70 ring-1 ring-white/15 hover:text-es-cream hover:ring-white/40"}`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm" role="group" aria-label="Dietary filter">
          <span className="mr-1 text-es-mute">Filter:</span>
          {(Object.keys(dietLabel) as Diet[]).map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={diet === d}
              onClick={() => setDiet(diet === d ? null : d)}
              className={`rounded-full px-3 py-1 transition ${diet === d ? "bg-es-saffron text-es-char" : "ring-1 ring-white/15 hover:ring-white/40"}`}
            >
              {dietLabel[d]}
            </button>
          ))}
        </div>

        <div id="es-menu-panel" role="tabpanel" aria-label={cat.label}>
        <ul key={`${tab}-${diet}`} className="mt-8 divide-y divide-white/10">
          {dishes.length === 0 && <li className="py-8 text-es-mute">Nothing in this section matches that filter, but ask your server: the kitchen adapts most dishes.</li>}
          {dishes.map((d, i) => (
            <li
              key={d.id}
              className="dm-fade-up group cursor-default py-5"
              style={{ "--i": i } as React.CSSProperties}
              onPointerEnter={() => setHover(d.id)}
              onFocus={() => setHover(d.id)}
              tabIndex={0}
            >
              <div className="flex items-baseline gap-4">
                <h3 className="font-es text-xl transition-colors duration-300 group-hover:text-es-ember sm:text-2xl">{d.name}</h3>
                <span className="flex-1 border-b border-dashed border-white/15" aria-hidden="true" />
                <span className="font-es text-xl text-es-saffron sm:text-2xl">${d.price}</span>
              </div>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-es-mute">
                {d.desc}
                {d.diet?.map((x) => (
                  <abbr key={x} title={dietLabel[x]} className="rounded-full border border-white/20 px-1.5 text-[11px] font-semibold no-underline">{x}</abbr>
                ))}
              </p>
            </li>
          ))}
        </ul>
        </div>
        <p className="mt-6 text-sm text-es-mute">Menu changes with the seasons. Please tell us about allergies when booking.</p>
      </div>

      <div className="hidden lg:block">
        <div className="sticky top-28">
          {preview && (
            <div key={preview.id} className="dm-fade-up">
              <div className="dm-spin" style={{ "--dur": "60s" } as React.CSSProperties}>
                <PlateArt tint={preview.tint} seed={preview.id.length * 7} steam />
              </div>
              <p className="mt-6 text-center font-es text-2xl">{preview.name}</p>
              <p className="mt-1 text-center text-sm text-es-mute">Hover a dish to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
