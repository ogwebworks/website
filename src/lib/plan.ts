"use client";

import { useSyncExternalStore } from "react";
import type { ProductId } from "./store";

/** The visitor's "plan" (cart) of services, kept in localStorage. Nothing is sent until they request a proposal. */
export type PlanItem = { id: ProductId; tier: number };

const KEY = "og-plan";
let items: PlanItem[] = [];
let loaded = false;
const subs = new Set<() => void>();
const EMPTY: PlanItem[] = [];

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    if (Array.isArray(raw)) items = raw.filter((x) => x && typeof x.id === "string" && typeof x.tier === "number");
  } catch {
    /* storage blocked: plan lives in memory */
  }
}
function save(next: PlanItem[]) {
  items = next;
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* ignore */ }
  subs.forEach((f) => f());
}

export const plan = {
  add(id: ProductId, tier: number) {
    load();
    save([...items.filter((x) => x.id !== id), { id, tier }]);
    window.dispatchEvent(new CustomEvent("og:plan-added", { detail: { id } }));
  },
  remove(id: ProductId) { load(); save(items.filter((x) => x.id !== id)); },
  clear() { save([]); },
  open() { window.dispatchEvent(new Event("og:plan-open")); },
};

export function usePlan() {
  return useSyncExternalStore(
    (f) => { subs.add(f); return () => subs.delete(f); },
    () => { load(); return items; },
    () => EMPTY,
  );
}
