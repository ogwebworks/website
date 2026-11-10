import Link from "next/link";
import ProductCard from "@/components/demos/fashion/ProductCard";
import ProductArt from "@/components/demos/fashion/ProductArt";
import { BASE, categories, products } from "@/components/demos/fashion/data";
import { productImages } from "@/components/demos/fashion/images";
import { getImage } from "@/lib/images";
import Newsletter from "@/components/demos/fashion/Newsletter";
import { InView, Marquee, Parallax, Words } from "@/components/demos/motion";

export const metadata = { title: { absolute: "Maison Vale: Fashion store demo | OG WebWorks" } };

const catArt = { dresses: ["dress", "#1d4fd8"], tops: ["top", "#a1c1fa"], knitwear: ["knit", "#e3e9f3"], outerwear: ["coat", "#16264f"], trousers: ["trousers", "#2b3650"], accessories: ["bag", "#0d1530"] } as const;

export default function FashionHome() {
  const imgs = productImages();
  const hero = getImage("demo-fashion-hero");
  const editorial = getImage("demo-fashion-editorial");
  const newIn = products.filter((p) => p.badge === "New").concat(products.filter((p) => p.badge !== "New")).slice(0, 4);
  const best = products.filter((p) => p.badge === "Bestseller");

  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:pt-14">
        <div>
          <p className="dm-fade-up text-xs uppercase tracking-[0.24em] text-mv-mute">Autumn / Winter collection</p>
          <h1 className="mt-5 font-mv text-[clamp(2.6rem,5.6vw,4.8rem)] leading-[1.02] tracking-[-0.035em]">
            <Words text="Quiet luxury," delay={100} />
            <br />
            <Words text="made to last." delay={350} wordClass="text-mv-clay" />
          </h1>
          <p className="dm-fade-up mt-6 max-w-md text-lg text-mv-mute" style={{ "--d": "700ms" } as React.CSSProperties}>Natural fibres, considered cuts and honest prices. Pieces you&apos;ll still love in ten years.</p>
          <div className="dm-fade-up mt-9 flex flex-wrap gap-3" style={{ "--d": "850ms" } as React.CSSProperties}>
            <Link href={`${BASE}/shop`} className="dm-shine bg-mv-ink px-8 py-4 text-sm font-medium uppercase tracking-[0.16em] text-mv-ivory transition hover:bg-mv-clay">Shop the collection</Link>
            <Link href={`${BASE}/shop?c=knitwear`} className="border border-mv-ink px-8 py-4 text-sm font-medium uppercase tracking-[0.16em] transition hover:bg-mv-ink hover:text-mv-ivory">Explore knitwear</Link>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden bg-mv-sand sm:aspect-[4/5]">
          {hero ? (
            // eslint-disable-next-line @next/next/no-img-element -- static export
            <img src={hero.src} alt={hero.alt} width={hero.w} height={hero.h} fetchPriority="high" className="h-full w-full object-cover" />
          ) : (
            <div className="dm-kenburns grid h-full grid-cols-2" aria-hidden="true">
              <ProductArt art="coat" hex="#16264f" />
              <div className="grid grid-rows-2">
                <ProductArt art="knit" hex="#e3e9f3" />
                <ProductArt art="trousers" hex="#6f9be8" />
              </div>
            </div>
          )}
          <span className="dm-float absolute bottom-4 left-4 bg-mv-ivory/95 px-4 py-2 text-xs uppercase tracking-[0.18em]" style={{ "--rot": "0deg" } as React.CSSProperties}>New: Double-faced wool coat</span>
        </div>
      </section>

      {/* Kinetic fabric ticker */}
      <div className="mb-14 border-y border-mv-ink/10 py-5">
        <Marquee duration={45}>
          {["European linen", "Extra-fine merino", "Grade-A cashmere", "Vegetable-tanned leather", "Free 30-day returns", "Made in small runs"].map((t) => (
            <span key={t} className="flex items-center gap-10 pr-10 font-mv text-3xl sm:text-4xl">
              {t} <span className="text-mv-clay" aria-hidden="true">✦</span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="sr-only">Shop by category</h2>
        <ul className="grid grid-cols-3 gap-3 sm:gap-4 lg:grid-cols-6">
          {categories.map((c, i) => {
            const [art, hex] = catArt[c.id];
            return (
              <InView as="li" key={c.id} i={i}>
                <Link href={`${BASE}/shop?c=${c.id}`} className="group block">
                  <div className="aspect-square overflow-hidden bg-mv-sand">
                    <div className="h-full w-full transition-transform duration-700 ease-out-expo group-hover:scale-105">
                      <ProductArt art={art} hex={hex} />
                    </div>
                  </div>
                  <p className="mt-2 text-center text-xs uppercase tracking-[0.14em] sm:text-sm">{c.label}</p>
                </Link>
              </InView>
            );
          })}
        </ul>
      </section>

      {/* New in */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-mv text-4xl sm:text-5xl">New in</h2>
          <Link href={`${BASE}/shop`} className="border-b border-mv-ink pb-0.5 text-sm uppercase tracking-[0.14em]">View all</Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {newIn.map((p, i) => (
            <InView key={p.slug} i={i}>
              <ProductCard p={p} src={imgs[p.slug]} />
            </InView>
          ))}
        </div>
      </section>

      {/* Editorial */}
      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6">
        <div className="relative grid overflow-hidden bg-mv-ink text-mv-ivory lg:grid-cols-2">
          <Parallax amount={40} className="aspect-[16/10] lg:aspect-auto">
            {editorial ? (
              // eslint-disable-next-line @next/next/no-img-element -- static export
              <img src={editorial.src} alt={editorial.alt} width={editorial.w} height={editorial.h} loading="lazy" className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full grid-cols-3" aria-hidden="true">
                <ProductArt art="bag" hex="#0d1530" />
                <ProductArt art="dress" hex="#a1c1fa" />
                <ProductArt art="top" hex="#1d4fd8" />
              </div>
            )}
          </Parallax>
          <div className="flex flex-col justify-center p-8 sm:p-14">
            <p className="text-xs uppercase tracking-[0.24em] text-mv-ivory/60">Our materials</p>
            <h2 className="mt-4 font-mv text-4xl leading-tight sm:text-5xl">Linen from France. Wool from Italy. <span className="text-[#8fe9fb]">Nothing synthetic.</span></h2>
            <p className="mt-5 max-w-md text-mv-ivory/75">We work with six family-run mills and workshops, and publish the true cost of every piece. Fewer, better things.</p>
            <Link href={`${BASE}/shop`} className="mt-8 w-fit border-b border-mv-ivory pb-0.5 text-sm uppercase tracking-[0.14em]">Discover the collection</Link>
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        <h2 className="font-mv text-4xl sm:text-5xl">Bestsellers</h2>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3">
          {best.map((p, i) => (
            <InView key={p.slug} i={i}>
              <ProductCard p={p} src={imgs[p.slug]} />
            </InView>
          ))}
        </div>
      </section>

      {/* Promises */}
      <section className="mx-auto mt-24 max-w-7xl border-y border-mv-ink/10 px-4 sm:px-6">
        <ul className="grid grid-cols-2 gap-6 py-10 text-center lg:grid-cols-4">
          {[
            ["Free shipping", "On orders over $150"],
            ["30-day returns", "Free and easy"],
            ["Secure checkout", "Cards, Apple Pay, PayPal"],
            ["Responsibly made", "Natural fibres, fair wages"],
          ].map(([t, d]) => (
            <li key={t}>
              <p className="font-mv text-xl">{t}</p>
              <p className="mt-1 text-sm text-mv-mute">{d}</p>
            </li>
          ))}
        </ul>
      </section>

      <Newsletter />
    </>
  );
}
