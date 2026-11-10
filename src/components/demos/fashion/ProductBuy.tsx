"use client";

import { useState } from "react";
import { useCart } from "./cart";
import { money, store, type Product } from "./data";
import { ProductImage } from "./ProductArt";

const views = [
  { label: "Front", pos: "center", zoom: 1 },
  { label: "Detail", pos: "50% 30%", zoom: 1.7 },
  { label: "Texture", pos: "40% 65%", zoom: 2.6 },
];

export default function ProductBuy({ p, src }: { p: Product; src?: string | null }) {
  const cart = useCart();
  const [color, setColor] = useState(p.colors[0]);
  const [size, setSize] = useState<string | null>(p.sizes.length === 1 ? p.sizes[0] : null);
  const [qty, setQty] = useState(1);
  const [view, setView] = useState(0);
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState(false);

  const add = () => {
    if (!size) {
      setError(true);
      return;
    }
    cart.add({ slug: p.slug, color: color.name, size }, qty);
  };

  const image = (i: number) => (
    <div className="h-full w-full" style={{ transform: `scale(${views[i].zoom})`, transformOrigin: views[i].pos }}>
      <ProductImage src={src} art={p.art} hex={color.hex} alt={`${p.name} in ${color.name}, ${views[i].label.toLowerCase()} view`} eager={i === 0} />
    </div>
  );

  return (
    <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
      {/* Gallery */}
      <div className="grid gap-3 sm:grid-cols-[80px_1fr]">
        <div className="order-2 flex gap-3 sm:order-1 sm:flex-col">
          {views.map((v, i) => (
            <button
              key={v.label}
              type="button"
              onClick={() => setView(i)}
              aria-label={`Show ${v.label.toLowerCase()} view`}
              aria-pressed={view === i}
              className={`aspect-[4/5] w-20 overflow-hidden bg-mv-sand ring-offset-2 ring-offset-mv-ivory transition ${view === i ? "ring-1 ring-mv-ink" : "opacity-70 hover:opacity-100"}`}
            >
              {image(i)}
            </button>
          ))}
        </div>
        <div className="relative order-1 aspect-[4/5] overflow-hidden bg-mv-sand sm:order-2">
          {image(view)}
          {p.badge && <span className={`absolute left-4 top-4 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] ${p.badge === "Sale" ? "bg-mv-clay text-white" : "bg-mv-ivory"}`}>{p.badge}</span>}
        </div>
      </div>

      {/* Buy box */}
      <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
        <h1 className="font-mv text-4xl leading-tight sm:text-5xl">{p.name}</h1>
        <p className="mt-3 text-xl">
          {p.compareAt && <span className="mr-2 text-mv-mute line-through">{money(p.compareAt)}</span>}
          <span className={p.compareAt ? "text-mv-clay" : ""}>{money(p.price)}</span>
        </p>
        <p className="mt-2 text-sm text-mv-mute">
          <span className="text-mv-ink" aria-hidden="true">★★★★★</span> {p.rating} · {p.reviews} reviews <span className="sr-only">(demo)</span>
        </p>
        <p className="mt-6 leading-relaxed text-mv-mute">{p.description}</p>

        <fieldset className="mt-8">
          <legend className="text-sm">Colour: <span className="font-medium">{color.name}</span></legend>
          <div className="mt-3 flex gap-3">
            {p.colors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColor(c)}
                aria-pressed={color.name === c.name}
                aria-label={c.name}
                className={`h-9 w-9 rounded-full ring-offset-2 ring-offset-mv-ivory transition ${color.name === c.name ? "ring-2 ring-mv-ink" : "ring-1 ring-mv-ink/20 hover:ring-mv-ink/60"}`}
                style={{ background: c.hex }}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-7">
          <div className="flex items-center justify-between">
            <legend className="text-sm">Size{size && <>: <span className="font-medium">{size}</span></>}</legend>
            <details className="text-sm">
              <summary className="cursor-pointer text-mv-mute underline underline-offset-4">Size guide</summary>
              <table className="absolute z-10 mt-2 border border-mv-ink/10 bg-white text-left shadow-lg">
                <thead><tr className="bg-mv-sand">{["Size", "Bust", "Waist", "Hip"].map((h) => <th key={h} className="px-3 py-2 font-medium">{h}</th>)}</tr></thead>
                <tbody>
                  {[["XS", 81, 63, 88], ["S", 86, 68, 93], ["M", 91, 73, 98], ["L", 97, 79, 104], ["XL", 103, 85, 110]].map((r) => (
                    <tr key={r[0]}>{r.map((v, i) => <td key={i} className="px-3 py-1.5">{i ? `${v} cm` : v}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </details>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {p.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSize(s);
                  setError(false);
                }}
                aria-pressed={size === s}
                className={`min-w-14 border px-4 py-3 text-sm transition ${size === s ? "border-mv-ink bg-mv-ink text-mv-ivory" : "border-mv-ink/20 hover:border-mv-ink"}`}
              >
                {s}
              </button>
            ))}
          </div>
          {error && <p className="mt-2 text-sm text-mv-clay" role="alert">Please choose a size.</p>}
        </fieldset>

        <div className="mt-8 flex gap-3">
          <div className="flex items-center border border-mv-ink/20">
            <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="h-14 w-11" aria-label="Decrease quantity">−</button>
            <span className="w-8 text-center" aria-live="polite">{qty}</span>
            <button type="button" onClick={() => setQty(qty + 1)} className="h-14 w-11" aria-label="Increase quantity">+</button>
          </div>
          <button type="button" onClick={add} className="flex-1 bg-mv-ink text-sm font-medium uppercase tracking-[0.16em] text-mv-ivory transition hover:bg-mv-clay">
            Add to bag · {money(p.price * qty)}
          </button>
          <button
            type="button"
            onClick={() => setSaved((v) => !v)}
            aria-pressed={saved}
            aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
            className="grid w-14 place-items-center border border-mv-ink/20 transition hover:border-mv-ink"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill={saved ? "#1958d6" : "none"} stroke={saved ? "#1958d6" : "currentColor"} strokeWidth="1.5" aria-hidden="true">
              <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
            </svg>
          </button>
        </div>

        <ul className="mt-6 space-y-2 text-sm text-mv-mute">
          <li>✓ Free shipping on orders over {money(store.freeShipping)}</li>
          <li>✓ Free 30-day returns and exchanges</li>
          <li>✓ Dispatched within 1 business day</li>
        </ul>

        <div className="mt-8 divide-y divide-mv-ink/10 border-y border-mv-ink/10">
          {[
            ["Details & fabric", <ul key="d" className="list-disc space-y-1 pl-5">{p.details.map((d) => <li key={d}>{d}</li>)}</ul>],
            ["Shipping & returns", <p key="s">Standard 3–5 business days, express next day. Return or exchange within 30 days for free.</p>],
            ["Care", <p key="c">Follow the care label. Wash less, air more, and repair rather than replace. Free repairs for life.</p>],
          ].map(([t, body], i) => (
            <details key={t as string} className="group py-4" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm uppercase tracking-[0.14em] [&::-webkit-details-marker]:hidden">
                {t}
                <span className="transition group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <div className="mt-3 text-sm leading-relaxed text-mv-mute">{body}</div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
