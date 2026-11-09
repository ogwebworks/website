import SiteImage from "./SiteImage";
import Reveal from "./Reveal";
import { industries } from "@/lib/site";
import type { ImageSlot } from "@/lib/images";

/** "Who we help": image tiles per industry. */
export default function Industries() {
  return (
    <section id="industries" className="container-x py-24 sm:py-32">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lime">Who we help</p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold tracking-tight sm:text-6xl">Built for businesses that sell online.</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-sm text-paper/65">Different industries, same goal: a site that earns trust in seconds and turns visitors into customers.</p>
        </Reveal>
      </div>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {industries.map((ind, i) => (
          <Reveal as="li" key={ind.slug} delay={i * 0.08}>
            <a href="#contact" className="group relative block aspect-[4/5] overflow-hidden rounded-3xl border border-line">
              <div className="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:scale-105">
                <SiteImage name={ind.image as ImageSlot} labelAtTop sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" aria-hidden="true" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-display text-2xl font-bold tracking-tight">{ind.title}</h3>
                <p className="mt-2 text-sm text-paper/70">{ind.text}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-lime">
                  Talk to us
                  <span className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1" aria-hidden="true">→</span>
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
