"use client";

import { useState } from "react";
import { m, useMotionValue, useSpring } from "motion/react";
import { menu, type Diet } from "./data";
import Riso from "./Riso";

const roman = ["I", "II", "III", "IV", "V"];
const dietLabel: Record<Diet, string> = { V: "vegetarian", VG: "vegan", GF: "gluten-free" };
const seedOf = (id: string) => id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);

/** Printed-menu layout. On mouse devices a riso print of the hovered dish follows the cursor. */
export default function PrintedMenu() {
  const [hover, setHover] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 300, damping: 30, mass: 0.5 });
  const y = useSpring(useMotionValue(0), { stiffness: 300, damping: 30, mass: 0.5 });

  return (
    <div
      className="relative"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        x.set(e.clientX + 24);
        y.set(e.clientY - 120);
      }}
    >
      <div className="grid grid-cols-[minmax(0,1fr)] gap-x-16 gap-y-14 lg:grid-cols-2">
        {menu.map((course, ci) => (
          <section key={course.id} aria-labelledby={`course-${course.id}`} className={ci === 0 ? "lg:col-span-2" : ""}>
            <div className="flex items-baseline gap-4 border-b-2 border-rs-ink pb-3">
              <span className="font-rs-mono text-sm text-rs-deep">{roman[ci]}.</span>
              <h3 id={`course-${course.id}`} className="font-rs text-3xl font-extrabold tracking-tight text-rs-ink sm:text-4xl">{course.label}</h3>
            </div>
            <ul className={`mt-2 ${ci === 0 ? "grid gap-x-16 lg:grid-cols-2" : ""}`}>
              {course.dishes.map((d) => (
                <li key={d.id} className="border-b border-dashed border-rs-ink/25">
                  <button
                    type="button"
                    onPointerEnter={(e) => e.pointerType === "mouse" && setHover(d.id)}
                    onPointerLeave={() => setHover(null)}
                    onClick={() => setOpen(open === d.id ? null : d.id)}
                    aria-expanded={open === d.id}
                    className="group w-full py-4 text-left"
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="font-rs text-xl font-bold text-rs-ink transition group-hover:text-rs-deep sm:text-2xl">{d.name}</span>
                      <span className="mb-1 flex-1 border-b-2 border-dotted border-rs-ink/30" aria-hidden="true" />
                      <span className="font-rs-mono text-lg text-rs-ink">{d.price}</span>
                    </span>
                    <span className="mt-1 block font-rs-mono text-sm text-rs-mute">
                      {d.desc}
                      {d.diet && <span className="ml-2 text-rs-olive">· {d.diet.map((x) => dietLabel[x]).join(", ")}</span>}
                    </span>
                  </button>
                  {open === d.id && (
                    <div className="dm-fade-up pb-4 [@media(pointer:fine)]:hidden">
                      <Riso seed={seedOf(d.id)} label={d.name} className="aspect-[4/3] w-full rounded-3xl ring-2 ring-rs-ink" />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* cursor-following print (mouse only) */}
      <m.div style={{ x, y }} className="pointer-events-none fixed left-0 top-0 z-40 hidden [@media(pointer:fine)]:block" aria-hidden="true">
        {hover && (
          <div key={hover} className="h-56 w-56 -rotate-3 overflow-hidden rounded-[2rem] shadow-[6px_6px_0_#1c1a16] ring-2 ring-rs-ink [animation:dm-fade-up_.35s_var(--ease-out-expo)_both]">
            <Riso seed={seedOf(hover)} className="h-full w-full" />
          </div>
        )}
      </m.div>
    </div>
  );
}
