"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useCart } from "./cart";
import { BASE, categories, getProduct, money, products, store } from "./data";
import ProductArt from "./ProductArt";

export function Wordmark({ className = "" }: { className?: string }) {
  return <span className={`font-mv whitespace-nowrap text-2xl font-semibold uppercase tracking-[0.28em] ${className}`}>{store.name}</span>;
}

const catArt = { dresses: ["dress", "#1d4fd8"], tops: ["top", "#a1c1fa"], knitwear: ["knit", "#e3e9f3"], outerwear: ["coat", "#16264f"], trousers: ["trousers", "#4b5872"], accessories: ["bag", "#0d1530"] } as const;

const navLinks = [
  { href: `${BASE}/shop?sort=new`, label: "New in", key: "new" },
  ...categories.map((c) => ({ href: `${BASE}/shop?c=${c.id}`, label: c.id === "tops" ? "Tops" : c.label, key: c.id })),
  { href: `${BASE}/shop?sale=1`, label: "Sale", key: "sale" },
];

/** Which nav item is active (reads the query string, so it lives inside Suspense). */
function useActiveKey() {
  const pathname = usePathname();
  const params = useSearchParams();
  if (!pathname.startsWith(`${BASE}/shop`)) return null;
  if (params.get("sale")) return "sale";
  if (params.get("c")) return params.get("c");
  if (params.get("sort") === "new") return "new";
  return "all";
}

function DesktopNav() {
  const active = useActiveKey();
  const [mega, setMega] = useState(false);
  return (
    <nav aria-label="Shop" className="relative hidden border-t border-mv-ink/5 lg:block" onMouseLeave={() => setMega(false)}>
      <ul className="mx-auto flex max-w-7xl items-center justify-center gap-8 px-6 text-[12px] font-medium uppercase tracking-[0.16em]">
        <li>
          <button
            type="button"
            onMouseEnter={() => setMega(true)}
            onClick={() => setMega((v) => !v)}
            aria-expanded={mega}
            aria-controls="mv-mega"
            className={`relative flex items-center gap-1 py-3.5 uppercase tracking-[0.16em] transition hover:text-mv-clay ${active === "all" ? "text-mv-clay" : ""}`}
          >
            Shop
            <svg viewBox="0 0 20 20" className={`h-3 w-3 transition ${mega ? "rotate-180" : ""}`} fill="currentColor" aria-hidden="true"><path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" /></svg>
          </button>
        </li>
        {navLinks.map((n) => (
          <li key={n.key} onMouseEnter={() => setMega(false)}>
            <Link
              href={n.href}
              aria-current={active === n.key ? "page" : undefined}
              className={`relative block py-3.5 transition hover:text-mv-clay after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:bg-mv-clay after:transition-transform after:duration-300 ${active === n.key ? "text-mv-clay after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"} ${n.key === "sale" ? "text-mv-clay" : ""}`}
            >
              {n.label}
            </Link>
          </li>
        ))}
      </ul>
      {mega && (
        <div id="mv-mega" className="dm-fade-up absolute inset-x-0 top-full border-y border-mv-ink/10 bg-mv-ivory shadow-[0_30px_60px_-30px_rgba(3,8,32,0.35)]">
          <div className="mx-auto grid max-w-7xl grid-cols-[1fr_2fr] gap-10 px-6 py-8">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-mv-mute">Shop by category</p>
              <ul className="mt-4 space-y-2.5">
                <li><Link href={`${BASE}/shop`} onClick={() => setMega(false)} className="font-mv text-xl hover:text-mv-clay">Shop all</Link></li>
                {categories.map((c) => (
                  <li key={c.id}><Link href={`${BASE}/shop?c=${c.id}`} onClick={() => setMega(false)} className="font-mv text-xl hover:text-mv-clay">{c.label}</Link></li>
                ))}
              </ul>
            </div>
            <ul className="grid grid-cols-3 gap-4">
              {categories.map((c) => {
                const [art, hex] = catArt[c.id];
                return (
                  <li key={c.id}>
                    <Link href={`${BASE}/shop?c=${c.id}`} onClick={() => setMega(false)} className="group block">
                      <div className="aspect-[4/3] overflow-hidden bg-mv-sand">
                        <div className="h-full w-full transition-transform duration-700 ease-out-expo group-hover:scale-105"><ProductArt art={art} hex={hex} /></div>
                      </div>
                      <p className="mt-2 text-xs uppercase tracking-[0.14em]">{c.label}</p>
                      <p className="text-xs text-mv-mute">{c.blurb}</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}

/** Full-width search overlay with live product results. */
function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const results = q.trim() ? products.filter((p) => `${p.name} ${p.category} ${p.colors.map((c) => c.name).join(" ")}`.toLowerCase().includes(q.trim().toLowerCase())).slice(0, 6) : [];
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-label="Search products" data-lenis-prevent className="fixed inset-0 z-[80] bg-mv-ink/40 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dm-fade-up bg-mv-ivory shadow-2xl">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
          <div className="flex items-center gap-3 border-b-2 border-mv-ink pb-3">
            <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
            <label htmlFor="mv-search" className="sr-only">Search products</label>
            <input id="mv-search" autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search dresses, cashmere, cobalt…" style={{ outline: "none" }} className="min-w-0 flex-1 bg-transparent font-mv text-2xl placeholder:text-mv-mute/70 focus:outline-none" />
            <button type="button" onClick={onClose} aria-label="Close search" className="grid h-10 w-10 place-items-center rounded-full hover:bg-mv-sand">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
          </div>
          {q.trim() === "" ? (
            <div className="mt-5 flex flex-wrap gap-2 text-sm">
              <span className="text-mv-mute">Popular:</span>
              {["Linen", "Cashmere", "Coat", "Tote", "Cobalt"].map((t) => (
                <button key={t} type="button" onClick={() => setQ(t)} className="rounded-full border border-mv-ink/15 px-3 py-1 hover:border-mv-ink">{t}</button>
              ))}
            </div>
          ) : results.length === 0 ? (
            <p className="mt-6 text-mv-mute" role="status">No products match &ldquo;{q}&rdquo;.</p>
          ) : (
            <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3" aria-live="polite">
              {results.map((p) => (
                <li key={p.slug}>
                  <Link href={`${BASE}/product/${p.slug}`} onClick={onClose} className="group flex items-center gap-3">
                    <div className="h-20 w-16 shrink-0 overflow-hidden bg-mv-sand"><ProductArt art={p.art} hex={p.colors[0].hex} /></div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium group-hover:text-mv-clay">{p.name}</p>
                      <p className="text-sm text-mv-mute">{money(p.price)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/** Mobile/tablet slide-in drawer menu. */
function MobileMenu({ onClose, onSearch }: { onClose: () => void; onSearch: () => void }) {
  const active = useActiveKey();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[80] lg:hidden" data-lenis-prevent>
      <div className="absolute inset-0 bg-mv-ink/40" onClick={onClose} />
      <nav id="mv-menu" aria-label="Mobile" className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-mv-ivory shadow-2xl [animation:mv-slide_.45s_var(--ease-out-expo)]">
        <div className="flex items-center justify-between border-b border-mv-ink/10 px-5 py-4">
          <Wordmark className="text-base" />
          <button type="button" onClick={onClose} aria-label="Close menu" className="grid h-10 w-10 place-items-center rounded-full hover:bg-mv-sand">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <button type="button" onClick={onSearch} className="flex w-full items-center gap-3 rounded-full border border-mv-ink/15 px-4 py-3 text-left text-mv-mute">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
            Search products
          </button>
          <ul className="mt-5 space-y-1">
            {[{ href: `${BASE}/shop`, label: "Shop all", key: "all" }, { href: `${BASE}/shop?sort=new`, label: "New in", key: "new" }].map((n) => (
              <li key={n.key}>
                <Link href={n.href} onClick={onClose} aria-current={active === n.key ? "page" : undefined} className={`block rounded-xl px-3 py-3 text-lg font-semibold ${active === n.key ? "bg-mv-sand text-mv-clay" : ""}`}>{n.label}</Link>
              </li>
            ))}
          </ul>
          <p className="mt-5 px-3 text-xs uppercase tracking-[0.18em] text-mv-mute">Categories</p>
          <ul className="mt-2 space-y-1">
            {categories.map((c, i) => {
              const [art, hex] = catArt[c.id];
              return (
                <li key={c.id} className="dm-fade-up" style={{ "--i": i } as React.CSSProperties}>
                  <Link href={`${BASE}/shop?c=${c.id}`} onClick={onClose} aria-current={active === c.id ? "page" : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-2 ${active === c.id ? "bg-mv-sand text-mv-clay" : "hover:bg-mv-sand/60"}`}>
                    <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-mv-sand"><ProductArt art={art} hex={hex} /></span>
                    <span className="font-medium">{c.label}</span>
                    <span className="ml-auto text-mv-mute" aria-hidden="true">›</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link href={`${BASE}/shop?sale=1`} onClick={onClose} className="mt-4 block rounded-xl bg-mv-clay px-4 py-3 text-center font-semibold text-white">Shop the sale</Link>
          <ul className="mt-6 space-y-2 border-t border-mv-ink/10 px-3 pt-5 text-sm text-mv-mute">
            <li>Shipping &amp; returns</li>
            <li>Size guide</li>
            <li>Contact us</li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default function Shell() {
  const cart = useCart();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const iconBtn = "inline-flex h-10 min-w-10 items-center justify-center rounded-full transition hover:bg-mv-sand";

  return (
    <>
      <div className="bg-mv-clay py-2 text-center text-xs tracking-[0.12em] text-white">
        Free shipping over {money(store.freeShipping)} · Free 30-day returns
      </div>
      <header className="sticky top-0 z-40 border-b border-mv-ink/10 bg-mv-ivory/90 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-3 sm:px-6 lg:py-4">
          <div className="flex items-center gap-1 justify-self-start">
            <button type="button" className={`${iconBtn} lg:hidden`} onClick={() => setMenu(true)} aria-expanded={menu} aria-controls="mv-menu" aria-label="Open menu">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10" /></svg>
            </button>
            <button type="button" className={`${iconBtn} lg:w-auto lg:gap-2 lg:px-3 lg:text-[12px] lg:uppercase lg:tracking-[0.16em]`} onClick={() => setSearch(true)} aria-label="Search products">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
              <span className="hidden lg:inline">Search</span>
            </button>
          </div>
          <Link href={BASE} aria-label={`${store.name} home`} className="justify-self-center">
            <Wordmark className="text-lg sm:text-2xl" />
          </Link>
          <div className="flex items-center justify-self-end gap-1">
            <span className="hidden text-[12px] uppercase tracking-[0.16em] text-mv-mute xl:inline">USD $</span>
            <button type="button" onClick={() => cart.setOpen(true)} className={`${iconBtn} relative lg:w-auto lg:gap-2 lg:px-3 lg:text-[12px] lg:uppercase lg:tracking-[0.16em]`} aria-label={`Shopping bag, ${cart.count} items`}>
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M5 8h14l-1 12H6L5 8Z" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
              <span className="hidden lg:inline">Bag</span>
              {cart.count > 0 && (
                <span className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-mv-clay px-1 text-[11px] font-semibold text-white lg:static">{cart.count}</span>
              )}
            </button>
          </div>
        </div>
        <Suspense fallback={<div className="hidden h-[45px] border-t border-mv-ink/5 lg:block" />}>
          <DesktopNav />
        </Suspense>
      </header>
      {menu && (
        <Suspense fallback={null}>
          <MobileMenu
            onClose={() => setMenu(false)}
            onSearch={() => {
              setMenu(false);
              setSearch(true);
            }}
          />
        </Suspense>
      )}
      {search && <SearchOverlay onClose={() => setSearch(false)} />}
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
