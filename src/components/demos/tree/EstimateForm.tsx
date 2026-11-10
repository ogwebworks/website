"use client";

import { useState } from "react";
import { services } from "./data";

const field = "w-full rounded-xl border border-tree-ink/15 bg-white px-4 py-3 text-tree-ink placeholder:text-tree-mute focus:border-tree-moss focus:outline-none focus:ring-2 focus:ring-tree-moss/20";

/** Demo estimate form: validates and shows a success state; nothing is sent. */
export default function EstimateForm() {
  const [sent, setSent] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  if (sent)
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-xl ring-1 ring-tree-ink/5 sm:p-10" role="status">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-tree-moss text-2xl text-white">✓</div>
        <h3 className="mt-5 font-tree text-3xl font-semibold text-tree-forest">Request received!</h3>
        <p className="mt-3 text-tree-mute">We&apos;ll call you within 2 business hours to book your free on-site estimate.</p>
        <p className="mt-6 rounded-xl bg-tree-sand p-4 text-sm text-tree-ink/80">
          <strong>Demo note:</strong> on your real site, this request lands in your inbox, CRM or a text message instantly.
        </p>
        <button type="button" onClick={() => setSent(false)} className="mt-6 font-semibold text-tree-moss underline underline-offset-4">
          Send another
        </button>
      </div>
    );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (e.currentTarget.checkValidity()) setSent(true);
      }}
      className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-tree-ink/5 sm:p-8"
    >
      <h3 className="font-tree text-2xl font-semibold text-tree-forest">Get your free estimate</h3>
      <p className="mt-1 text-sm text-tree-mute">Takes 60 seconds. No obligation.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Name
          <input required name="name" autoComplete="name" className={`${field} mt-1.5`} />
        </label>
        <label className="block text-sm font-medium">
          Phone
          <input required name="phone" type="tel" autoComplete="tel" className={`${field} mt-1.5`} />
        </label>
        <label className="block text-sm font-medium">
          Service needed
          <select required name="service" defaultValue="" className={`${field} mt-1.5`}>
            <option value="" disabled>Choose a service</option>
            {services.map((s) => (
              <option key={s.title}>{s.title}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          ZIP code
          <input required name="zip" inputMode="numeric" pattern="[0-9]{5}" placeholder="97201" className={`${field} mt-1.5`} />
        </label>
        <label className="block text-sm font-medium sm:col-span-2">
          Tell us about the job (optional)
          <textarea name="details" rows={3} placeholder="e.g. Large oak leaning toward the garage after last night's storm" className={`${field} mt-1.5 resize-none`} />
        </label>
        <label className="block text-sm font-medium sm:col-span-2">
          Add photos (optional)
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setPhotos(Array.from(e.target.files ?? []).slice(0, 4).map((f) => URL.createObjectURL(f)))}
            className="mt-1.5 block w-full text-sm text-tree-mute file:mr-4 file:rounded-full file:border-0 file:bg-tree-sand file:px-4 file:py-2 file:font-semibold file:text-tree-forest hover:file:brightness-95"
          />
        </label>
        {photos.length > 0 && (
          <div className="flex gap-2 sm:col-span-2">
            {photos.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element -- local preview (blob URL)
              <img key={src} src={src} alt="Uploaded preview" className="h-16 w-16 rounded-lg object-cover" />
            ))}
          </div>
        )}
      </div>
      <button type="submit" className="mt-6 w-full rounded-full bg-tree-orange py-4 text-lg font-semibold text-tree-ink transition hover:brightness-105">
        Request my free estimate
      </button>
      <p className="mt-3 text-center text-xs text-tree-mute">Demo form: nothing is sent. Licensed &amp; insured · Free quotes</p>
    </form>
  );
}
