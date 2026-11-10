import { services } from "@/lib/site";

const items = [...services.map((s) => s.title), "Core Web Vitals", "Schema & Entities", "Conversion Design"];

/** Infinite kinetic ticker (pure CSS, zero JS). */
export default function Marquee() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <li key={t} className="flex items-center gap-10 whitespace-nowrap font-display text-2xl font-semibold tracking-tight sm:text-4xl">
          {t}
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand sm:h-7 sm:w-7" fill="currentColor" aria-hidden="true">
            <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
          </svg>
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label="What we do" className="relative -rotate-1 border-y border-line bg-ink-2 py-6">
      <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <div className="flex animate-marquee hover:[animation-play-state:paused]">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
