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
      <ul className="grid gap-5 md:grid-cols-2">
        {industries.map((ind, i) => (
          <Reveal as="li" key={ind.slug} delay={i * 0.08}>
            <a href="#contact" className="group block h-full overflow-hidden rounded-3xl border border-line bg-ink-2 transition-colors duration-500 hover:border-paper/20">
              <div className="relative aspect-video overflow-hidden">
                <div className="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:scale-105">
                  <SiteImage name={ind.image as ImageSlot} sizes="(min-width: 768px) 50vw, 100vw" />
                </div>
              </div>
              <div className="flex items-end justify-between gap-6 p-6 sm:p-8">
                <div>
                  <h3 className="font-display text-2xl font-bold tracking-tight">{ind.title}</h3>
                  <p className="mt-2 max-w-sm text-paper/65">{ind.text}</p>
                </div>
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-lime transition duration-500 ease-out-expo group-hover:border-lime group-hover:bg-lime group-hover:text-ink"
                  aria-hidden="true"
                >
                  →
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
