import SiteImage from "./SiteImage";
import DemoPreview from "./DemoPreview";
import Reveal from "./Reveal";
import type { ImageSlot } from "@/lib/images";

const demos: { src: string; host: string; title: string; kind: string; heading: string; thumb: ImageSlot; features: string[] }[] = [
  {
    src: "/demos/tree-services",
    host: "canopyandcrown.demo",
    title: "Canopy & Crown: tree services demo website",
    kind: "Local services",
    heading: "Tree care company",
    thumb: "demo-tree-thumb",
    features: ["Online estimates with photo upload", "Drag-to-compare before/after slider", "Sticky call & quote bar on mobile", "Reviews, service areas & FAQ"],
  },
  {
    src: "/demos/fashion",
    host: "maisonvale.demo",
    title: "Maison Vale: fashion e-commerce demo store",
    kind: "E-commerce",
    heading: "Fashion boutique",
    thumb: "demo-fashion-thumb",
    features: ["Catalogue with filters, search & sort", "Product pages with colour & size", "Slide-out bag with free-shipping bar", "3-step checkout & discount codes"],
  },
];

/** Homepage: live demo websites visitors can use without leaving the page. */
export default function Demos() {
  return (
    <section id="demos" className="container-x py-24 sm:py-32">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Live demos</p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold tracking-tight sm:text-6xl">See what you&apos;ll get.</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-sm text-paper/65">Try complete demo websites we&apos;ve built for fictional businesses, right here on the page. Yours is designed from scratch for your brand.</p>
        </Reveal>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {demos.map((d, i) => (
          <Reveal key={d.src} delay={i * 0.1} className="min-w-0">
            <div className="flex h-full min-w-0 flex-col gap-6 rounded-3xl border border-line bg-ink-2 p-3 sm:p-4">
              <DemoPreview
                src={d.src}
                title={d.title}
                host={d.host}
                poster={<SiteImage name={d.thumb} sizes="(min-width: 1024px) 45vw, 100vw" className="object-top" />}
              />
              <div className="px-3 pb-3 sm:px-4">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">{d.kind}</p>
                <h3 className="mt-2 font-display text-3xl font-bold tracking-tight">{d.heading}</h3>
                <ul className="mt-4 grid gap-x-6 gap-y-1.5 text-sm text-paper/70 sm:grid-cols-2">
                  {d.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-brand" aria-hidden="true">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-dashed border-line px-6 py-5 sm:flex-row sm:items-center">
        <p className="text-paper/70">Fully interactive: scroll, click, add to bag, check out. Switch desktop/mobile or expand. More on the way: clinics, law firms, restaurants.</p>
        <a href="#contact" className="shrink-0 font-semibold text-brand underline decoration-brand/40 underline-offset-4">Need one for your industry? →</a>
      </Reveal>
    </section>
  );
}
