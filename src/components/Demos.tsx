import Link from "next/link";
import SiteImage from "./SiteImage";
import Reveal from "./Reveal";

const treeFeatures = ["Online estimates with photo upload", "Drag-to-compare before/after slider", "Sticky call & quote bar on mobile", "Reviews, service areas & FAQ"];
const shopFeatures = ["Product catalogue with filters", "Cart & checkout flow", "Product pages built to rank", "Fast on every phone"];

/** Homepage: live demo websites visitors can click through. */
export default function Demos() {
  return (
    <section id="demos" className="container-x py-24 sm:py-32">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Live demos</p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold tracking-tight sm:text-6xl">See what you&apos;ll get.</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-sm text-paper/65">Click through complete demo websites we&apos;ve built for fictional businesses. Yours is designed from scratch for your brand.</p>
        </Reveal>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Reveal>
          <Link href="/demos/tree-services" className="group block h-full overflow-hidden rounded-3xl border border-line bg-ink-2 transition-colors duration-500 hover:border-brand/40">
            <div className="border-b border-line bg-ink-3/60 px-4 py-2.5">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-coral/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#f5c542]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#3fcf6b]" />
                <span className="ml-3 rounded-full bg-white/5 px-3 py-0.5 text-xs text-mute">canopyandcrown.demo</span>
              </div>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden">
              <div className="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]">
                <SiteImage name="demo-tree-thumb" sizes="(min-width: 1024px) 60vw, 100vw" className="object-top" />
              </div>
            </div>
            <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">Local services</p>
                <h3 className="mt-2 font-display text-3xl font-bold tracking-tight">Tree care company</h3>
                <ul className="mt-4 grid gap-x-6 gap-y-1.5 text-sm text-paper/70 sm:grid-cols-2">
                  {treeFeatures.map((f) => (
                    <li key={f} className="flex gap-2"><span className="text-brand" aria-hidden="true">✓</span>{f}</li>
                  ))}
                </ul>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-5 py-3 font-semibold text-ink transition group-hover:shadow-[0_0_40px_-6px_var(--color-brand)]">
                Open live demo <span aria-hidden="true">↗</span>
              </span>
            </div>
          </Link>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex h-full flex-col justify-between rounded-3xl border border-dashed border-line bg-ink-2/50 p-6 sm:p-8">
            <div>
              <span className="inline-block rounded-full bg-azure/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#7fb0ff]">Coming soon</span>
              <h3 className="mt-4 font-display text-3xl font-bold tracking-tight">E-commerce store</h3>
              <ul className="mt-4 space-y-1.5 text-sm text-paper/70">
                {shopFeatures.map((f) => (
                  <li key={f} className="flex gap-2"><span className="text-azure" aria-hidden="true">✓</span>{f}</li>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <p className="text-sm text-mute">More on the way: clinics, law firms, restaurants, SaaS.</p>
              <a href="#contact" className="mt-4 inline-flex items-center gap-2 font-semibold text-brand underline decoration-brand/40 underline-offset-4">
                Need one for your industry? Ask us →
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
