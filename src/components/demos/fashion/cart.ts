"use client";

import { useSyncExternalStore } from "react";
import { getProduct, store } from "./data";

export type Line = { slug: string; color: string; size: string; qty: number };
type State = { lines: Line[]; open: boolean };

const KEY = "mv-demo-cart-v2";
const EMPTY: State = { lines: [], open: false };
let state: State | null = null;
const listeners = new Set<() => void>();

function read(): State {
  if (state === null) {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
      state = { lines: Array.isArray(saved) ? saved : [], open: false };
    } catch {
      state = { lines: [], open: false };
    }
  }
  return state;
}
function write(next: State) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next.lines));
  } catch {
    /* storage unavailable: the cart still works for this visit */
  }
  listeners.forEach((l) => l());
}
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
const same = (a: Omit<Line, "qty">, b: Omit<Line, "qty">) => a.slug === b.slug && a.color === b.color && a.size === b.size;

/** Tiny cart store: localStorage-backed and SSR-safe (server snapshot is an empty cart). */
export function useCart() {
  const s = useSyncExternalStore(subscribe, read, () => EMPTY);
  const count = s.lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = s.lines.reduce((n, l) => n + (getProduct(l.slug)?.price ?? 0) * l.qty, 0);
  return {
    lines: s.lines,
    open: s.open,
    count,
    subtotal,
    shipping: subtotal === 0 || subtotal >= store.freeShipping ? 0 : 12,
    add(line: Omit<Line, "qty">, qty = 1) {
      const cur = read();
      const exists = cur.lines.some((l) => same(l, line));
      const lines = exists ? cur.lines.map((l) => (same(l, line) ? { ...l, qty: l.qty + qty } : l)) : [...cur.lines, { ...line, qty }];
      write({ lines, open: true });
    },
    setQty(line: Line, qty: number) {
      const cur = read();
      write({ ...cur, lines: qty <= 0 ? cur.lines.filter((l) => !same(l, line)) : cur.lines.map((l) => (same(l, line) ? { ...l, qty } : l)) });
    },
    clear: () => write({ lines: [], open: false }),
    setOpen: (open: boolean) => write({ ...read(), open }),
  };
}
