"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart, type Line } from "./cart";
import { BASE, getProduct, money } from "./data";
import ProductArt from "./ProductArt";

const steps = ["Shipping", "Delivery", "Payment"] as const;
const deliveries = [
  { id: "standard", label: "Standard", eta: "3–5 business days", price: 0 },
  { id: "express", label: "Express", eta: "Next business day", price: 18 },
];
const base = "w-full border border-mv-ink/20 px-4 py-3 placeholder:text-mv-mute focus:border-mv-ink focus:outline-none";
const field = `${base} bg-white`;
const locked = `${base} cursor-not-allowed bg-mv-sand text-mv-mute`;

type Order = { id: string; lines: Line[]; total: number; email: string; delivery: string };

export default function Checkout() {
  const cart = useCart();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [delivery, setDelivery] = useState(deliveries[0]);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [codeMsg, setCodeMsg] = useState("");
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const shipping = delivery.price || cart.shipping;
  const total = Math.max(0, cart.subtotal - discount + shipping);

  if (order) return <Confirmation order={order} />;

  if (cart.lines.length === 0)
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-mv text-5xl">Your bag is empty</h1>
        <p className="mt-3 text-mv-mute">Add a few pieces to try the checkout.</p>
        <Link href={`${BASE}/shop`} className="mt-8 inline-block bg-mv-ink px-8 py-4 text-sm uppercase tracking-[0.16em] text-mv-ivory">Shop the collection</Link>
      </div>
    );

  const next = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    if (step < 2) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setPlacing(true);
    window.setTimeout(() => {
      setOrder({ id: `MV-${Math.floor(100000 + Math.random() * 900000)}`, lines: cart.lines, total, email, delivery: delivery.label });
      cart.clear();
      window.scrollTo({ top: 0 });
    }, 1200);
  };

  const applyCode = () => {
    if (code.trim().toUpperCase() === "WELCOME10") {
      setDiscount(Math.round(cart.subtotal * 0.1));
      setCodeMsg("WELCOME10 applied: 10% off");
    } else {
      setDiscount(0);
      setCodeMsg("That code isn't valid (try WELCOME10)");
    }
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_380px]">
      <div>
        <h1 className="font-mv text-4xl sm:text-5xl">Checkout</h1>
        <ol className="mt-6 flex gap-2 text-xs uppercase tracking-[0.14em]" aria-label="Checkout steps">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              <button type="button" disabled={i > step} onClick={() => setStep(i)} aria-current={i === step ? "step" : undefined} className={i === step ? "font-semibold text-mv-ink" : i < step ? "text-mv-ink underline underline-offset-4" : "text-mv-mute"}>
                {i + 1}. {s}
              </button>
              {i < steps.length - 1 && <span className="text-mv-mute" aria-hidden="true">›</span>}
            </li>
          ))}
        </ol>

        {step === 0 && (
          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.16em] text-mv-mute">Express checkout</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {["Apple Pay", "Google Pay", "PayPal"].map((x) => (
                <button key={x} type="button" disabled title="Demo only" className="cursor-not-allowed bg-mv-ink py-3 text-sm font-medium text-mv-ivory opacity-80">{x}</button>
              ))}
            </div>
            <p className="mt-2 text-xs text-mv-mute">Express wallets are shown for design only in this demo.</p>
          </div>
        )}

        <form onSubmit={next} className="mt-8 space-y-6">
          {step === 0 && (
            <>
              <fieldset className="space-y-4">
                <legend className="mb-2 font-mv text-2xl">Contact</legend>
                <label className="block text-sm">Email<input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${field} mt-1.5`} /></label>
              </fieldset>
              <fieldset className="grid gap-4 sm:grid-cols-2">
                <legend className="mb-2 font-mv text-2xl">Shipping address</legend>
                <label className="block text-sm">First name<input required autoComplete="given-name" className={`${field} mt-1.5`} /></label>
                <label className="block text-sm">Last name<input required autoComplete="family-name" className={`${field} mt-1.5`} /></label>
                <label className="block text-sm sm:col-span-2">Address<input required autoComplete="address-line1" className={`${field} mt-1.5`} /></label>
                <label className="block text-sm">City<input required autoComplete="address-level2" className={`${field} mt-1.5`} /></label>
                <label className="block text-sm">Postal code<input required autoComplete="postal-code" className={`${field} mt-1.5`} /></label>
                <label className="block text-sm sm:col-span-2">
                  Country
                  <select required autoComplete="country-name" defaultValue="United States" className={`${field} mt-1.5`}>
                    {["United States", "United Kingdom", "Canada", "Australia", "United Arab Emirates", "Germany", "France"].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </label>
              </fieldset>
            </>
          )}

          {step === 1 && (
            <fieldset className="space-y-3">
              <legend className="mb-2 font-mv text-2xl">Delivery method</legend>
              {deliveries.map((d) => (
                <label key={d.id} className={`flex cursor-pointer items-center justify-between border px-5 py-4 transition ${delivery.id === d.id ? "border-mv-ink bg-white" : "border-mv-ink/20"}`}>
                  <span className="flex items-center gap-3">
                    <input type="radio" name="delivery" checked={delivery.id === d.id} onChange={() => setDelivery(d)} className="accent-mv-clay" />
                    <span><span className="font-medium">{d.label}</span><span className="block text-sm text-mv-mute">{d.eta}</span></span>
                  </span>
                  <span>{d.price === 0 ? (cart.shipping === 0 ? "Free" : money(cart.shipping)) : money(d.price)}</span>
                </label>
              ))}
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className="space-y-4">
              <legend className="mb-2 font-mv text-2xl">Payment</legend>
              <p className="border border-mv-clay/40 bg-mv-clay/5 px-4 py-3 text-sm">
                <strong>Demo store:</strong> no payment is taken. A test card is filled in below and can&apos;t be edited. Never enter real card details on a demo.
              </p>
              <label className="block text-sm">Card number<input readOnly value="4242 4242 4242 4242" aria-readonly="true" className={`${locked} mt-1.5 tracking-wider`} /></label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block text-sm">Expiry<input readOnly value="12 / 34" aria-readonly="true" className={`${locked} mt-1.5`} /></label>
                <label className="block text-sm">CVC<input readOnly value="123" aria-readonly="true" className={`${locked} mt-1.5`} /></label>
              </div>
              <label className="flex items-center gap-3 text-sm">
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-mv-clay" /> Billing address same as shipping
              </label>
            </fieldset>
          )}

          <button type="submit" disabled={placing} className="w-full bg-mv-ink py-4 text-sm font-medium uppercase tracking-[0.16em] text-mv-ivory transition hover:bg-mv-clay disabled:opacity-60">
            {step === 0 ? "Continue to delivery" : step === 1 ? "Continue to payment" : placing ? "Placing order…" : `Place order · ${money(total)}`}
          </button>
        </form>
      </div>

      {/* Summary */}
      <aside className="h-fit bg-white p-6 lg:sticky lg:top-28" aria-label="Order summary">
        <h2 className="font-mv text-2xl">Order summary</h2>
        <ul className="mt-5 divide-y divide-mv-ink/10">
          {cart.lines.map((l) => {
            const p = getProduct(l.slug)!;
            return (
              <li key={`${l.slug}-${l.color}-${l.size}`} className="flex gap-3 py-3">
                <div className="relative h-20 w-16 shrink-0 bg-mv-sand">
                  <ProductArt art={p.art} hex={p.colors.find((c) => c.name === l.color)?.hex ?? p.colors[0].hex} />
                  <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-mv-ink text-[11px] text-white">{l.qty}</span>
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-mv-mute">{l.color} · {l.size}</p>
                </div>
                <p className="text-sm">{money(p.price * l.qty)}</p>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex gap-2">
          <label htmlFor="mv-code" className="sr-only">Discount code</label>
          <input id="mv-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Discount code" className="min-w-0 flex-1 border border-mv-ink/20 px-3 py-2.5 text-sm uppercase focus:border-mv-ink focus:outline-none" />
          <button type="button" onClick={applyCode} className="border border-mv-ink px-4 text-sm">Apply</button>
        </div>
        {codeMsg && <p className="mt-2 text-xs text-mv-mute" role="status">{codeMsg}</p>}
        <dl className="mt-5 space-y-2 border-t border-mv-ink/10 pt-4 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(cart.subtotal)}</dd></div>
          {discount > 0 && <div className="flex justify-between text-mv-clay"><dt>Discount</dt><dd>−{money(discount)}</dd></div>}
          <div className="flex justify-between"><dt>Shipping</dt><dd>{shipping === 0 ? "Free" : money(shipping)}</dd></div>
          <div className="flex justify-between border-t border-mv-ink/10 pt-3 text-base font-medium"><dt>Total</dt><dd>{money(total)}</dd></div>
        </dl>
      </aside>
    </div>
  );
}

function Confirmation({ order }: { order: Order }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center" role="status">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-mv-ink text-2xl text-mv-ivory">✓</div>
      <p className="mt-6 text-xs uppercase tracking-[0.2em] text-mv-mute">Order {order.id}</p>
      <h1 className="mt-3 font-mv text-5xl">Thank you!</h1>
      <p className="mt-4 text-mv-mute">
        A confirmation would be sent to <strong className="text-mv-ink">{order.email}</strong>. {order.delivery} delivery · total {money(order.total)}.
      </p>
      <p className="mx-auto mt-6 max-w-md bg-mv-sand px-5 py-4 text-sm">
        <strong>Demo note:</strong> on your real store this triggers payment capture, an order email, stock updates and a notification to your team.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href={`${BASE}/shop`} className="bg-mv-ink px-8 py-4 text-sm uppercase tracking-[0.16em] text-mv-ivory">Keep shopping</Link>
        <Link href="/#contact" target="_top" className="border border-mv-ink px-8 py-4 text-sm uppercase tracking-[0.16em]">Get a store like this</Link>
      </div>
    </div>
  );
}
