"use client";

import { useState } from "react";

export default function Newsletter() {
  const [done, setDone] = useState(false);
  return (
    <section className="mx-auto max-w-2xl px-4 pt-24 text-center sm:px-6">
      <h2 className="font-mv text-4xl sm:text-5xl">10% off your first order</h2>
      <p className="mt-3 text-mv-mute">Join the list for new arrivals, restocks and the occasional letter from the studio.</p>
      {done ? (
        <p className="mt-8 text-lg" role="status">Welcome! Your code is <strong className="tracking-wider">WELCOME10</strong> (demo).</p>
      ) : (
        <form
          className="mx-auto mt-8 flex max-w-md border border-mv-ink"
          onSubmit={(e) => {
            e.preventDefault();
            if (e.currentTarget.checkValidity()) setDone(true);
          }}
        >
          <label htmlFor="mv-email" className="sr-only">Email address</label>
          <input id="mv-email" type="email" required placeholder="Email address" className="min-w-0 flex-1 bg-transparent px-4 py-3.5 placeholder:text-mv-mute focus:outline-none" />
          <button type="submit" className="bg-mv-ink px-6 text-sm font-medium uppercase tracking-[0.16em] text-mv-ivory">Join</button>
        </form>
      )}
    </section>
  );
}
