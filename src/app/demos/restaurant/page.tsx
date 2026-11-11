import Link from "next/link";
import Shell from "@/components/demos/restaurant/Shell";
import Story from "@/components/demos/restaurant/Story";
import PrintedMenu from "@/components/demos/restaurant/PrintedMenu";
import Ticket from "@/components/demos/restaurant/Ticket";
import Quotes from "@/components/demos/restaurant/Quotes";
import Riso from "@/components/demos/restaurant/Riso";
import { hours, resto } from "@/components/demos/restaurant/data";
import { InView, Marquee } from "@/components/demos/motion";

const fmt = (h: number) => (h === 24 ? "late" : `${h > 12 ? h - 12 : h}${h >= 12 ? "pm" : "am"}`);

export default function RestaurantDemo() {
  return (
    <>
      <Shell />
      <main id="main">
        {/* ---------- Hero: giant wordmark ---------- */}
        <section id="top" className="rs-grain relative isolate overflow-hidden bg-rs-paper px-4 pb-10 pt-32 sm:px-6 sm:pt-36">
          <div className="pointer-events-none absolute -right-16 top-24 -z-10 h-72 w-72 rotate-12 sm:h-[26rem] sm:w-[26rem]" aria-hidden="true">
            <Riso seed={21} className="h-full w-full rounded-full" />
          </div>
          <div className="pointer-events-none absolute -left-20 bottom-24 -z-10 hidden h-56 w-56 sm:block -rotate-6 sm:h-72 sm:w-72" aria-hidden="true">
            <Riso seed={33} className="h-full w-full rounded-[40%_60%_55%_45%]" />
          </div>

          <p className="dm-fade-up font-rs-mono text-xs uppercase tracking-[0.24em] text-rs-mute sm:text-sm">Wood-fired kitchen · Fulton Market, Chicago · Since {resto.since}</p>
          <h1 className="mt-6 font-rs font-extrabold uppercase leading-[0.8] tracking-[-0.06em] text-rs-ink">
            <span className="block text-[clamp(4.5rem,21vw,22rem)]">
              <span className="dm-mask"><span className="dm-word" style={{ "--i": 0 } as React.CSSProperties}>Ember</span></span>
            </span>
            <span className="flex items-end gap-[3vw] text-[clamp(4.5rem,21vw,22rem)]">
              <span className="dm-mask"><span className="dm-word text-rs-tomato" style={{ "--i": 1 } as React.CSSProperties}>&amp;</span></span>
              <span className="dm-mask"><span className="dm-word" style={{ "--i": 2 } as React.CSSProperties}>Salt</span></span>
            </span>
          </h1>

          {/* rotating sticker */}
          <div className="absolute right-6 top-[46%] hidden h-36 w-36 md:block lg:right-20 lg:h-44 lg:w-44" aria-hidden="true">
            <svg viewBox="0 0 100 100" className="dm-spin h-full w-full" style={{ "--dur": "16s" } as React.CSSProperties}>
              <circle cx="50" cy="50" r="49" fill="#b5361f" />
              <defs><path id="rs-ring" d="M50 50 m-36 0 a36 36 0 1 1 72 0 a36 36 0 1 1 -72 0" /></defs>
              <text fill="#f2ebdd" fontSize="9.5" fontFamily="var(--font-dmmono), monospace"><textPath href="#rs-ring" textLength="224" lengthAdjust="spacing">OPEN FIRE · NATURAL WINE · OPEN FIRE ·</textPath></text>
            </svg>
            <span className="absolute inset-0 grid place-items-center font-rs text-3xl font-extrabold text-rs-paper">450°</span>
          </div>

          <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-6 border-t-2 border-rs-ink pt-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <p className="dm-fade-up max-w-md text-lg leading-relaxed text-rs-ink" style={{ "--d": "500ms" } as React.CSSProperties}>
              Seasonal plates cooked over a single oak fire, a wine list that changes weekly, and a room built for long, loud dinners.
            </p>
            <div className="dm-fade-up font-rs-mono text-sm text-rs-mute" style={{ "--d": "600ms" } as React.CSSProperties}>
              <p className="uppercase tracking-[0.16em] text-rs-ink">Tonight</p>
              <p className="mt-2">Dinner 5pm till late<br />Walk-ins at the bar</p>
            </div>
            <div className="dm-fade-up font-rs-mono text-sm text-rs-mute" style={{ "--d": "700ms" } as React.CSSProperties}>
              <p className="uppercase tracking-[0.16em] text-rs-ink">Call</p>
              <a href={`tel:${resto.phoneHref}`} className="mt-2 block text-rs-ink underline decoration-rs-tomato decoration-2 underline-offset-4">{resto.phone}</a>
            </div>
          </div>
        </section>

        {/* ---------- Ink band ---------- */}
        <div className="border-y-2 border-rs-ink bg-rs-ink py-4 text-rs-paper">
          <Marquee duration={30}>
            {["Charred peach & burrata", "45-day ribeye", "Grilled octopus", "Burnt Basque cheesecake", "Smoke & Stone", "Sourdough every morning"].map((t) => (
              <span key={t} className="flex items-center gap-6 pr-6 font-rs text-2xl font-bold sm:text-3xl">
                {t} <span className="text-rs-tomato" aria-hidden="true">●</span>
              </span>
            ))}
          </Marquee>
        </div>

        <Story />

        {/* ---------- Menu ---------- */}
        <section id="menu" className="rs-grain relative scroll-mt-10 border-t-2 border-rs-ink bg-rs-paper px-4 py-24 sm:px-6 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <h2 className="font-rs text-[clamp(3.5rem,10vw,8rem)] font-extrabold uppercase leading-[0.85] tracking-[-0.05em]">The<br />menu</h2>
              <p className="max-w-xs font-rs-mono text-sm text-rs-mute">Printed fresh daily. Hover a dish for a look (tap on mobile). Allergies? Tell us when you book.</p>
            </div>
            <PrintedMenu />
          </div>
        </section>

        {/* ---------- Quotes ---------- */}
        <section aria-label="Guest reviews" className="border-t-2 border-rs-ink bg-rs-paper2 px-4 py-24 sm:px-6">
          <Quotes />
        </section>

        {/* ---------- Reserve ---------- */}
        <section id="reserve" className="scroll-mt-10 border-t-2 border-rs-ink bg-rs-paper2 px-4 pb-24 sm:px-6">
          <InView className="mx-auto mb-12 max-w-3xl pt-4 text-center">
            <h2 className="font-rs text-[clamp(3rem,8vw,6rem)] font-extrabold uppercase leading-[0.85] tracking-[-0.05em]">Save a seat<span className="text-rs-tomato">.</span></h2>
            <p className="mt-4 font-rs-mono text-sm text-rs-mute">Tables for up to 12. Bigger party? Ask about the Cellar Room.</p>
          </InView>
          <Ticket />
        </section>

        {/* ---------- Visit ---------- */}
        <section id="visit" className="border-t-2 border-rs-ink bg-rs-deep px-4 py-20 text-rs-paper sm:px-6">
          <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-12 md:grid-cols-3">
            <div>
              <p className="font-rs-mono text-xs uppercase tracking-[0.2em] text-rs-paper">Find us</p>
              <p className="mt-4 font-rs text-3xl font-bold leading-tight">{resto.address}</p>
            </div>
            <div>
              <p className="font-rs-mono text-xs uppercase tracking-[0.2em] text-rs-paper">Hours</p>
              <dl className="mt-4 space-y-1 font-rs-mono text-sm">
                {hours.map((h) => (
                  <div key={h.day} className="flex justify-between border-b border-rs-paper/20 py-1">
                    <dt>{h.day.slice(0, 3)}</dt>
                    <dd>{h.open ? `${fmt(h.open[0])} – ${fmt(h.open[1])}` : "Closed"}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <p className="font-rs-mono text-xs uppercase tracking-[0.2em] text-rs-paper">Private dining</p>
              <p className="mt-4 text-lg leading-relaxed">The Cellar Room seats 24 for birthdays, launches and long lunches.</p>
              <a href={`tel:${resto.phoneHref}`} className="mt-4 inline-block font-rs-mono text-sm uppercase tracking-[0.16em] underline underline-offset-4">Call to enquire</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="overflow-hidden border-t-2 border-rs-ink bg-rs-paper pb-28 pt-10">
        <p className="whitespace-nowrap px-4 font-rs text-[clamp(4rem,18vw,18rem)] font-extrabold uppercase leading-[0.8] tracking-[-0.06em] text-rs-ink/90 sm:px-6" aria-hidden="true">Ember &amp; Salt</p>
        <p className="mt-6 px-4 font-rs-mono text-xs uppercase tracking-[0.16em] text-rs-mute sm:px-6">
          {resto.name} is a fictional restaurant · Designed &amp; built by{" "}
          <Link href="/" target="_top" className="text-rs-ink underline decoration-rs-tomato underline-offset-4">OG WebWorks</Link>
        </p>
      </footer>
    </>
  );
}
