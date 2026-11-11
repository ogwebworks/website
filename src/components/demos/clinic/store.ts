"use client";

import { useSyncExternalStore } from "react";
import type { ServiceId } from "./data";

type State = { service: ServiceId | null; doctor: string | null; nonce: number };
let state: State = { service: null, doctor: null, nonce: 0 };
const init = state;
const listeners = new Set<() => void>();
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

/** Lets any "Book" button pre-fill the booking wizard and scroll to it. */
export function useBookingPrefill() {
  const s = useSyncExternalStore(subscribe, () => state, () => init);
  return {
    ...s,
    book(service: ServiceId | null, doctor: string | null = null) {
      state = { service, doctor, nonce: state.nonce + 1 };
      listeners.forEach((l) => l());
      document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
    },
  };
}
