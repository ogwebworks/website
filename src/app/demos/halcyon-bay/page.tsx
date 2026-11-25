import Link from "next/link";
import ScrollStory from "@/components/demos/halcyon/ScrollStory";
import Availability from "@/components/demos/halcyon/Availability";
import Enquire from "@/components/demos/halcyon/Enquire";
import { img, project } from "@/components/demos/halcyon/data";

const amenities = [
  ["Private marina", "Twelve deep-water slips reserved for residents."],
  ["Bayfront pool deck", "A 25-metre lap pool, cabanas and a poolside bar."],
  ["Wellness floor", "Spa, sauna, cold plunge and a Pilates studio."],
  ["Residents' lounge", "Library, wine room and private dining on level 2."],
];

export default function HalcyonBayDemo() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-hb-ink/70 text-white backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <a href="#story" className="font-hb-serif text-lg tracking-[0.2em]">HALCYON BAY</a>
          <nav aria-label="Main" className="hidden items-center gap-7 text-sm text-white/80 md:flex">
            <a href="#story" className="hover:text-white">The tower</a>
            <a href="#residences" className="hover:text-white">Residences</a>
            <a href="#availability" className="hover:text-white">Availability</a>
            <a href="#amenities" className="hover:text-white">Amenities</a>
          </nav>
          <a href="#enquire" className="rounded-full bg-hb-gold px-4 py-2 text-sm font-semibold text-hb-ink">Book a preview</a>
        </div>
      </header>
      <main id="main" className="-mt-14">
        <ScrollStory />

        <section id="residences" className="scroll-mt-20 bg-hb-ink py-20 text-white sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-hb-gold">Residences</p>
            <h2 className="mt-2 font-hb-serif text-4xl sm:text-5xl">Four ways to live on the water</h2>
            <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2">
              {[
                { t: "Residence A", d: "2 bed + den · 1,480 sq ft · from $1.42M", i: img.resCut.sm },
                { t: "Sky Penthouse", d: "3 bed + media · 3,950 sq ft + terrace pool · $6.4M", i: img.phCut.sm },
              ].map((c) => (
                <a key={c.t} href="#story" className="group overflow-hidden rounded-3xl bg-hb-navy ring-1 ring-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
                  <img src={c.i} alt={`${c.t} cutaway (AI-generated)`} loading="lazy" className="aspect-[16/9] w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                  <div className="p-6"><p className="font-hb-serif text-3xl">{c.t}</p><p className="mt-1 text-white/70">{c.d}</p></div>
                </a>
              ))}
              {[["Residence B", "1 bed · 910 sq ft · from $845K · city skyline views"], ["Residence C", "3 bed · 2,120 sq ft · from $2.18M · corner bay views"]].map(([t, d]) => (
                <div key={t} className="rounded-3xl bg-hb-navy p-6 ring-1 ring-white/10"><p className="font-hb-serif text-3xl">{t}</p><p className="mt-1 text-white/70">{d}</p><a href="#availability" className="mt-4 inline-block text-sm font-semibold text-white underline decoration-hb-gold underline-offset-4">See availability</a></div>
              ))}
            </div>
          </div>
        </section>

        <Availability />

        <section id="amenities" className="scroll-mt-20 bg-hb-ivory pb-20 sm:pb-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#74592a]">Amenities</p>
            <h2 className="mt-2 font-hb-serif text-4xl sm:text-5xl">A resort you come home to</h2>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {amenities.map(([t, d]) => (
                <li key={t} className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_-35px_rgba(10,18,34,0.4)]"><p className="font-hb-serif text-2xl">{t}</p><p className="mt-2 text-sm text-hb-mute">{d}</p></li>
              ))}
            </ul>
          </div>
        </section>

        <Enquire />
      </main>
      <footer className="bg-hb-ink px-4 py-12 text-sm text-white/65 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 md:flex-row">
          <div>
            <p className="font-hb-serif text-lg tracking-[0.2em] text-white">HALCYON BAY</p>
            <p className="mt-2">{project.address} · <a href={`tel:${project.phoneHref}`} className="underline underline-offset-4">{project.phone}</a></p>
          </div>
          <p className="max-w-xl">
            {project.name} is a fictional development. All images are AI-generated illustrations; prices, availability and specifications are for demonstration only. Designed &amp; built by{" "}
            <Link href="/" target="_top" className="text-white underline underline-offset-4">OG WebWorks</Link>.
          </p>
        </div>
      </footer>
    </>
  );
}
