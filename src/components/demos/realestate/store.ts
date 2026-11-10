"use client";

import { useSyncExternalStore } from "react";
import type { Area, Listing } from "./data";

export type Filters = { area: Area | "Any"; type: Listing["type"] | "Any"; beds: number; maxPrice: number };
type State = { filters: Filters; open: string | null; saved: string[] };

const initial: State = { filters: { area: "Any", type: "Any", beds: 0, maxPrice: 3500000 }, open: null, saved: [] };
let state: State = initial;
const listeners = new Set<() => void>();
const set = (next: Partial<State>) => {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

/** Shared page state: hero search -> listings filters, open listing modal, saved homes. */
export function useRe() {
  const s = useSyncExternalStore(subscribe, () => state, () => initial);
  return {
    ...s,
    setFilters: (f: Partial<Filters>) => set({ filters: { ...state.filters, ...f } }),
    resetFilters: () => set({ filters: initial.filters }),
    openListing: (id: string | null) => set({ open: id }),
    toggleSave: (id: string) => set({ saved: state.saved.includes(id) ? state.saved.filter((x) => x !== id) : [...state.saved, id] }),
  };
}
