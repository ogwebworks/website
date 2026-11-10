"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import { categories, products, type Category } from "./data";

type Sort = "featured" | "new" | "low" | "high";
const allColors = Array.from(new Map(products.flatMap((p) => p.colors).map((c) => [c.name, c])).values());
const sizes = ["XS", "S", "M", "L", "XL", "One size"];

export default function ShopGrid({ images }: { images: Record<string, string | null> }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const cat = (params.get("c") as Category | null) ?? null;

  const [colors, setColors] = useState<string[]>([]);
  const [size, setSize] = useState<string | null>(null);
  const [max, setMax] = useState(400);
  const [onSale, setOnSale] = useState(false);
  const [sort, setSort] = useState<Sort>("featured");
  const [q, setQ] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const setCat = (c: Category | null) => router.replace(c ? `${pathname}?c=${c}` : pathname, { scroll: false });
  const toggle = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const list = useMemo(() => {
    let l = products.filter(
      (p) =>
        (!cat || p.category === cat) &&
        (colors.length === 0 || p.colors.some((c) => colors.includes(c.name))) &&
        (!size || p.sizes.includes(size)) &&
        p.price <= max &&
        (!onSale || !!p.compareAt) &&
        (!q || `${p.name} ${p.category}`.toLowerCase().includes(q.toLowerCase())),
    );
    if (sort === "low") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "high") l = [...l].sort((a, b) => b.price - a.price);
    if (sort === "new") l = [...l].sort((a, b) => Number(b.badge === "New") - Number(a.badge === "New"));
    return l;
  }, [cat, colors, size, max, onSale, sort, q]);

  const reset = () => {
    setColors([]);
    setSize(null);
    setMax(400);
    setOnSale(false);
    setQ("");
    setCat(null);
  };
  const title = cat ? categories.find((c) => c.id === cat)?.label : "Shop all";
  const chip = (active: boolean) => `border px-3 py-1.5 text-sm transition ${active ? "border-mv-ink bg-mv-ink text-mv-ivory" : "border-mv-ink/20 hover:border-mv-ink"}`;

  const filters = (
    <div className="space-y-8">
      <fieldset>
        <legend className="mb-3 text-xs uppercase tracking-[0.16em] text-mv-mute">Category</legend>
        <ul className="space-y-2">
          <li><button type="button" onClick={() => setCat(null)} className={!cat ? "font-medium underline underline-offset-4" : ""}>All</button></li>
          {categories.map((c) => (
            <li key={c.id}>
              <button type="button" onClick={() => setCat(c.id)} aria-pressed={cat === c.id} className={cat === c.id ? "font-medium underline underline-offset-4" : ""}>
                {c.label}
              </button>
            </li>
          ))}
        </ul>
      </fieldset>
      <fieldset>
        <legend className="mb-3 text-xs uppercase tracking-[0.16em] text-mv-mute">Colour</legend>
        <div className="flex flex-wrap gap-2">
          {allColors.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setColors(toggle(colors, c.name))}
              aria-pressed={colors.includes(c.name)}
              aria-label={c.name}
              title={c.name}
              className={`h-7 w-7 rounded-full ring-offset-2 ring-offset-mv-ivory transition ${colors.includes(c.name) ? "ring-2 ring-mv-ink" : "ring-1 ring-mv-ink/20"}`}
              style={{ background: c.hex }}
            />
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-3 text-xs uppercase tracking-[0.16em] text-mv-mute">Size</legend>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button key={s} type="button" onClick={() => setSize(size === s ? null : s)} aria-pressed={size === s} className={chip(size === s)}>{s}</button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-3 text-xs uppercase tracking-[0.16em] text-mv-mute">Max price: ${max}</legend>
        <label className="sr-only" htmlFor="mv-price">Maximum price</label>
        <input id="mv-price" type="range" min={50} max={400} step={10} value={max} onChange={(e) => setMax(Number(e.target.value))} className="w-full accent-mv-clay" />
      </fieldset>
      <label className="flex items-center gap-3">
        <input type="checkbox" checked={onSale} onChange={(e) => setOnSale(e.target.checked)} className="h-4 w-4 accent-mv-clay" />
        On sale only
      </label>
      <button type="button" onClick={reset} className="text-sm text-mv-mute underline underline-offset-4">Clear all filters</button>
    </div>
  );

  return (
    <>
      <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.14em] text-mv-mute">Home / {title}</nav>
      <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="font-mv text-5xl">{title}</h1>
        <div className="flex flex-wrap items-center gap-3">
          <label className="sr-only" htmlFor="mv-q">Search products</label>
          <input id="mv-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="w-44 border-b border-mv-ink/30 bg-transparent py-2 placeholder:text-mv-mute focus:border-mv-ink focus:outline-none" />
          <label className="sr-only" htmlFor="mv-sort">Sort by</label>
          <select id="mv-sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="border border-mv-ink/20 bg-transparent px-3 py-2 text-sm">
            <option value="featured">Featured</option>
            <option value="new">Newest</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
          <button type="button" onClick={() => setFiltersOpen((v) => !v)} aria-expanded={filtersOpen} className="border border-mv-ink px-4 py-2 text-sm lg:hidden">
            Filters
          </button>
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside className={`${filtersOpen ? "block" : "hidden"} lg:block`} aria-label="Filters">{filters}</aside>
        <div>
          <p className="mb-6 text-sm text-mv-mute" aria-live="polite">{list.length} {list.length === 1 ? "product" : "products"}</p>
          {list.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-mv text-3xl">No matches</p>
              <button type="button" onClick={reset} className="mt-4 underline underline-offset-4">Clear filters</button>
            </div>
          ) : (
            <div key={`${cat}-${colors.join()}-${size}-${max}-${onSale}-${sort}-${q}`} className="grid grid-cols-2 gap-x-4 gap-y-10 xl:grid-cols-3">
              {list.map((p, i) => (
                <div key={p.slug} className="dm-fade-up" style={{ "--i": i } as React.CSSProperties}>
                  <ProductCard p={p} src={images[p.slug]} eager={i < 3} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
