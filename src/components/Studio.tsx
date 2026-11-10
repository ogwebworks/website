import SiteImage from "./SiteImage";
import Reveal from "./Reveal";

const points = [
  { t: "Senior people on every project", d: "The people you meet are the people who build. No hand-offs to juniors." },
  { t: "One point of contact", d: "Direct access to your lead, not an account-manager relay." },
  { t: "Worldwide, on your time zone", d: "Remote-first, with calls scheduled around your working day." },
];

/** Studio / about teaser: image collage + why-us points. */
export default function Studio() {
  return (
    <section id="studio" className="container-x grid items-center gap-14 py-24 sm:py-32 lg:grid-cols-2">
      <Reveal className="relative pb-16 pr-10 sm:pr-16">
        <div className="overflow-hidden rounded-3xl border border-line shadow-2xl">
          <SiteImage name="studio-main" sizes="(min-width: 1024px) 45vw, 100vw" className="aspect-video" />
        </div>
        <div className="absolute bottom-0 right-0 w-[44%] overflow-hidden rounded-2xl border-4 border-ink shadow-2xl">
          <SiteImage name="studio-detail" sizes="(min-width: 1024px) 20vw, 44vw" className="aspect-square" />
        </div>
        <div className="absolute -left-3 top-8 rounded-2xl border border-line bg-ink-2/95 px-4 py-3 shadow-xl sm:-left-6">
          <p className="font-display text-2xl font-bold text-lime">100%</p>
          <p className="text-xs text-mute">custom. Zero templates</p>
        </div>
      </Reveal>

      <div>
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coral">The studio</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-6xl">
            A small, senior team. Big-agency standards.
          </h2>
          <p className="mt-6 max-w-lg text-paper/65">
            OG WebWorks is built for businesses that want craft and accountability, not a ticket queue. Every site is
            designed from scratch, engineered for speed, and owned by you.
          </p>
        </Reveal>
        <ul className="mt-10 space-y-6">
          {points.map((p, i) => (
            <Reveal as="li" key={p.t} delay={0.08 * i} className="flex gap-4">
              <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-lime/15 text-sm text-lime" aria-hidden="true">
                ✓
              </span>
              <span>
                <span className="block font-display text-lg font-semibold">{p.t}</span>
                <span className="mt-1 block text-paper/60">{p.d}</span>
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
