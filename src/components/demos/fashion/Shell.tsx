"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "./cart";
import { BASE, categories, getProduct, money, store } from "./data";
import ProductArt from "./ProductArt";

export function Wordmark({ className = "" }: { className?: string }) {
  return <span className={`font-mv text-2xl font-medium uppercase tracking-[0.32em] ${className}`}>{store.name}</span>;
}

const nav = [
  { href: `${BASE}/shop`, label: "Shop all" },
  { href: `${BASE}/shop?c=dresses`, label: "Dresses" },
  { href: `${BASE}/shop?c=knitwear`, label: "Knitwear" },
  { href: `${BASE}/shop?c=outerwear`, label: "Outerwear" },
  { href: `${BASE}/shop?c=accessories`, label: "Accessories" },
];

export default function Shell() {
  const cart = useCart();
  const [menu, setMenu] = useState(false);

  return (
    <>
      <div className="bg-mv-ink py-2 text-center text-xs tracking-wide text-mv-ivory">
        Free shipping over {money(store.freeShipping)} · Free 30-day returns
      </div>
      <header className="sticky top-0 z-40 border-b border-mv-ink/10 bg-mv-ivory/90 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-4 sm:px-6">
          <nav aria-label="Shop" className="hidden xl:block">
            <ul className="flex gap-5 whitespace-nowrap text-[12px] uppercase tracking-[0.14em]">
              {nav.map((n) => (
                <li key={n.label}>
                  <Link href={n.href} className="transition hover:text-mv-clay">{n.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <button type="button" className="justify-self-start xl:hidden" onClick={() => setMenu((v) => !v)} aria-expanded={menu} aria-controls="mv-menu" aria-label={menu ? "Close menu" : "Open menu"}>
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              {menu ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
          <Link href={BASE} aria-label={`${store.name} home`} className="justify-self-center">
            <Wordmark className="text-xl sm:text-2xl" />
          </Link>
          <div className="flex items-center justify-self-end gap-4">
            <Link href={`${BASE}/shop`} className="hidden text-[13px] uppercase tracking-[0.14em] sm:inline">Search</Link>
            <button type="button" onClick={() => cart.setOpen(true)} className="relative inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.14em]" aria-label={`Shopping bag, ${cart.count} items`}>
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M5 8h14l-1 12H6L5 8Z" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
              <span className="hidden sm:inline">Bag</span>
              {cart.count > 0 && (
                <span className="absolute -right-2 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-mv-clay px-1 text-[11px] font-semibold text-white sm:static">
                  {cart.count}
                </span>
              )}
            </button>
          </div>
        </div>
        {menu && (
          <nav id="mv-menu" aria-label="Mobile" className="border-t border-mv-ink/10 px-4 pb-6 xl:hidden">
            <ul className="divide-y divide-mv-ink/10">
              {[{ href: `${BASE}/shop`, label: "Shop all" }, ...categories.map((c) => ({ href: `${BASE}/shop?c=${c.id}`, label: c.label }))].map((n) => (
                <li key={n.label}>
                  <Link href={n.href} onClick={() => setMenu(false)} className="block py-4 font-mv text-2xl">{n.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>
      <CartDrawer />
    </>
  );
}

function CartDrawer() {
  const cart = useCart();
  const { open, setOpen } = cart;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const remaining = Math.max(0, store.freeShipping - cart.subtotal);
  return (
    <div className={`fixed inset-0 z-[70] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-mv-ink/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} onClick={() => setOpen(false)} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        data-lenis-prevent
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-mv-ivory shadow-2xl transition-transform duration-500 ease-out-expo ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-mv-ink/10 px-6 py-5">
          <h2 className="font-mv text-2xl">Your bag ({cart.count})</h2>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close bag" className="grid h-9 w-9 place-items-center rounded-full hover:bg-mv-sand" tabIndex={open ? 0 : -1}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>

        {cart.lines.length > 0 && (
          <div className="border-b border-mv-ink/10 px-6 py-4 text-sm">
            {remaining > 0 ? <p>You&apos;re <strong>{money(remaining)}</strong> away from free shipping</p> : <p>You&apos;ve unlocked <strong>free shipping</strong> ✓</p>}
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-mv-sand">
              <div className="h-full bg-mv-clay transition-all duration-500" style={{ width: `${Math.min(100, (cart.subtotal / store.freeShipping) * 100)}%` }} />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.lines.length === 0 ? (
            <div className="grid h-full place-items-center text-center">
              <div>
                <p className="font-mv text-2xl">Your bag is empty</p>
                <Link href={`${BASE}/shop`} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1} className="mt-4 inline-block border-b border-mv-ink pb-0.5 text-sm uppercase tracking-[0.14em]">
                  Start shopping
                </Link>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-mv-ink/10">
              {cart.lines.map((l) => {
                const p = getProduct(l.slug);
                if (!p) return null;
                const hex = p.colors.find((c) => c.name === l.color)?.hex ?? p.colors[0].hex;
                return (
                  <li key={`${l.slug}-${l.color}-${l.size}`} className="flex gap-4 py-4">
                    <div className="h-28 w-22 shrink-0 overflow-hidden bg-mv-sand">
                      <ProductArt art={p.art} hex={hex} />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <Link href={`${BASE}/product/${p.slug}`} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1} className="font-medium">{p.name}</Link>
                        <span>{money(p.price * l.qty)}</span>
                      </div>
                      <p className="mt-1 text-sm text-mv-mute">{l.color} · {l.size}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border border-mv-ink/20">
                          <button type="button" tabIndex={open ? 0 : -1} onClick={() => cart.setQty(l, l.qty - 1)} className="h-8 w-8" aria-label={`Decrease quantity of ${p.name}`}>−</button>
                          <span className="w-8 text-center text-sm" aria-live="polite">{l.qty}</span>
                          <button type="button" tabIndex={open ? 0 : -1} onClick={() => cart.setQty(l, l.qty + 1)} className="h-8 w-8" aria-label={`Increase quantity of ${p.name}`}>+</button>
                        </div>
                        <button type="button" tabIndex={open ? 0 : -1} onClick={() => cart.setQty(l, 0)} className="text-sm text-mv-mute underline underline-offset-4">Remove</button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {cart.lines.length > 0 && (
          <div className="border-t border-mv-ink/10 px-6 py-5">
            <div className="flex justify-between font-medium"><span>Subtotal</span><span>{money(cart.subtotal)}</span></div>
            <p className="mt-1 text-sm text-mv-mute">Shipping and taxes calculated at checkout.</p>
            <Link
              href={`${BASE}/checkout`}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className="mt-4 block bg-mv-ink py-4 text-center text-sm font-medium uppercase tracking-[0.16em] text-mv-ivory transition hover:bg-mv-clay"
            >
              Checkout
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
