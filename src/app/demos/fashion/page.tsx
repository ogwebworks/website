import Link from "next/link";
import ProductCard from "@/components/demos/fashion/ProductCard";
import ProductArt from "@/components/demos/fashion/ProductArt";
import { BASE, categories, products } from "@/components/demos/fashion/data";
import { productImages } from "@/components/demos/fashion/images";
import { getImage } from "@/lib/images";
import Newsletter from "@/components/demos/fashion/Newsletter";

export const metadata = { title: { absolute: "Maison Vale: Fashion store demo | OG WebWorks" } };

const catArt = { dresses: ["dress", "#a5583a"], tops: ["top", "#a9bccb"], knitwear: ["knit", "#b98a5a"], outerwear: ["coat", "#5f6348"], trousers: ["trousers", "#2a2d33"], accessories: ["bag", "#5b4033"] } as const;

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
          <p className="text-xs uppercase tracking-[0.24em] text-mv-mute">Autumn / Winter collection</p>
          <h1 className="mt-5 font-mv text-[clamp(3rem,7vw,6rem)] leading-[0.95] tracking-tight">
            Quiet luxury, <em className="font-normal italic text-mv-clay">made to last.</em>
          </h1>
          <p className="mt-6 max-w-md text-lg text-mv-mute">Natural fibres, considered cuts and honest prices. Pieces you&apos;ll still love in ten years.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={`${BASE}/shop`} className="bg-mv-ink px-8 py-4 text-sm font-medium uppercase tracking-[0.16em] text-mv-ivory transition hover:bg-mv-clay">Shop the collection</Link>
            <Link href={`${BASE}/shop?c=knitwear`} className="border border-mv-ink px-8 py-4 text-sm font-medium uppercase tracking-[0.16em] transition hover:bg-mv-ink hover:text-mv-ivory">Explore knitwear</Link>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden bg-mv-sand sm:aspect-[4/5]">
          {hero ? (
            // eslint-disable-next-line @next/next/no-img-element -- static export
            <img src={hero.src} alt={hero.alt} width={hero.w} height={hero.h} fetchPriority="high" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full grid-cols-2" aria-hidden="true">
              <ProductArt art="coat" hex="#b98a5a" />
              <div className="grid grid-rows-2">
                <ProductArt art="knit" hex="#efe9de" />
                <ProductArt art="trousers" hex="#2a2d33" />
              </div>
            </div>
          )}
          <span className="absolute bottom-4 left-4 bg-mv-ivory/95 px-4 py-2 text-xs uppercase tracking-[0.18em]">New: Double-faced wool coat</span>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="sr-only">Shop by category</h2>
        <ul className="grid grid-cols-3 gap-3 sm:gap-4 lg:grid-cols-6">
          {categories.map((c) => {
            const [art, hex] = catArt[c.id];
            return (
              <li key={c.id}>
                <Link href={`${BASE}/shop?c=${c.id}`} className="group block">
                  <div className="aspect-square overflow-hidden bg-mv-sand">
                    <div className="h-full w-full transition-transform duration-700 ease-out-expo group-hover:scale-105">
                      <ProductArt art={art} hex={hex} />
                    </div>
                  </div>
                  <p className="mt-2 text-center text-xs uppercase tracking-[0.14em] sm:text-sm">{c.label}</p>
                </Link>
              </li>
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
          {newIn.map((p) => (
            <ProductCard key={p.slug} p={p} src={imgs[p.slug]} />
          ))}
        </div>
      </section>

      {/* Editorial */}
      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6">
        <div className="relative grid overflow-hidden bg-mv-ink text-mv-ivory lg:grid-cols-2">
          <div className="aspect-[16/10] lg:aspect-auto">
            {editorial ? (
              // eslint-disable-next-line @next/next/no-img-element -- static export
              <img src={editorial.src} alt={editorial.alt} width={editorial.w} height={editorial.h} loading="lazy" className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full grid-cols-3" aria-hidden="true">
                <ProductArt art="bag" hex="#5b4033" />
                <ProductArt art="dress" hex="#d9cbb4" />
                <ProductArt art="top" hex="#8f9c84" />
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-14">
            <p className="text-xs uppercase tracking-[0.24em] text-mv-ivory/60">Our materials</p>
            <h2 className="mt-4 font-mv text-4xl leading-tight sm:text-5xl">Linen from France. Wool from Italy. <em className="italic">Nothing synthetic.</em></h2>
            <p className="mt-5 max-w-md text-mv-ivory/75">We work with six family-run mills and workshops, and publish the true cost of every piece. Fewer, better things.</p>
            <Link href={`${BASE}/shop`} className="mt-8 w-fit border-b border-mv-ivory pb-0.5 text-sm uppercase tracking-[0.14em]">Discover the collection</Link>
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        <h2 className="font-mv text-4xl sm:text-5xl">Bestsellers</h2>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3">
          {best.map((p) => (
            <ProductCard key={p.slug} p={p} src={imgs[p.slug]} />
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
