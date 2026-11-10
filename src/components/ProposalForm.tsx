"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "motion/react";

const serviceOptions = [
  "Website Development",
  "Website Maintenance",
  "Brand Development",
  "SEO",
  "AEO / GEO (AI search)",
  "Ads Management",
  "Emergency Fix",
  "Free Site Check",
];
const budgets = ["< $2k", "$2k–$5k", "$5k–$15k", "$15k+", "Not sure yet"];
const timelines = ["ASAP / urgent", "This month", "1–3 months", "Just exploring"];

type Data = { services: string[]; url: string; business: string; budget: string; timeline: string; name: string; email: string; message: string; company: string };
const empty: Data = { services: [], url: "", business: "", budget: "", timeline: "", name: "", email: "", message: "", company: "" };

const stepsMeta = ["Services", "Your project", "Budget & timing", "Contact"];

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-4 py-2.5 text-sm font-medium transition ${active ? "border-brand bg-brand text-ink" : "border-line hover:border-paper/40"}`}
    >
      {children}
    </button>
  );
}

const input = "w-full rounded-xl border border-line bg-ink px-4 py-3.5 text-paper placeholder:text-mute focus:border-brand/70 focus:outline-none";

export default function ProposalForm() {
  const [step, setStep] = useState(0);
  const [d, setD] = useState<Data>(empty);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const onPrefill = (e: Event) => {
      const { url, service } = (e as CustomEvent<{ url: string; service: string }>).detail;
      setD((prev) => ({ ...prev, url: url || prev.url, services: prev.services.includes(service) ? prev.services : [...prev.services, service] }));
      setStep(url ? 1 : 0);
    };
    window.addEventListener("og:prefill", onPrefill);
    return () => window.removeEventListener("og:prefill", onPrefill);
  }, []);

  const toggle = (s: string) => setD((p) => ({ ...p, services: p.services.includes(s) ? p.services.filter((x) => x !== s) : [...p.services, s] }));

  const canNext = [d.services.length > 0, true, d.budget !== "" && d.timeline !== "", d.name.trim() !== "" && /\S+@\S+\.\S+/.test(d.email)][step];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      if (canNext) setStep(step + 1);
      return;
    }
    if (!canNext) return;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/proposal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Something went wrong");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <section id="contact" className="container-x py-24 sm:py-32">
      <div className="noise relative overflow-hidden rounded-[2rem] border border-line bg-ink-2">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand/15 blur-[100px]" aria-hidden="true" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-azure/20 blur-[100px]" aria-hidden="true" />
        <div className="relative grid gap-12 p-7 sm:p-12 lg:grid-cols-[0.9fr_1.1fr] lg:p-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Free proposal</p>
            <h2 className="mt-4 font-display text-4xl font-bold leading-[0.95] tracking-tight sm:text-6xl">
              Let&apos;s build something <span className="text-gradient">original.</span>
            </h2>
            <p className="mt-6 max-w-md text-paper/70">
              Tell us where you are and where you want to be. You&apos;ll get a tailored plan and a clear quote within one
              business day. No pressure, no jargon.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-paper/80">
              {["No long-term contracts", "You own everything we build", "Response within 1 business day"].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-brand/15 text-[10px] text-brand" aria-hidden="true">✓</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-line bg-ink/70 p-6 backdrop-blur sm:p-8">
            {status === "done" ? (
              <m.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-12 text-center" role="status">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand text-2xl text-ink">✓</div>
                <h3 className="mt-6 font-display text-3xl font-bold">Request received!</h3>
                <p className="mt-3 text-paper/70">Thanks, {d.name.split(" ")[0]}. We&apos;ll be in touch within one business day.</p>
              </m.div>
            ) : (
              <form onSubmit={submit} noValidate>
                {/* progress */}
                <div className="mb-8">
                  <div className="flex justify-between text-xs text-mute">
                    <span>
                      Step {step + 1} of 4 · <span className="text-paper">{stepsMeta[step]}</span>
                    </span>
                    {step > 0 && (
                      <button type="button" onClick={() => setStep(step - 1)} className="underline-offset-4 hover:text-paper hover:underline">
                        ← Back
                      </button>
                    )}
                  </div>
                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
                    <m.div className="h-full rounded-full bg-gradient-to-r from-brand to-azure" animate={{ width: `${((step + 1) / 4) * 100}%` }} transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.6 }} />
                  </div>
                </div>

                {/* honeypot */}
                <input type="text" name="company" tabIndex={-1} autoComplete="off" value={d.company} onChange={(e) => setD({ ...d, company: e.target.value })} className="hidden" aria-hidden="true" />

                <AnimatePresence mode="wait">
                  <m.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="min-h-[15rem]">
                    {step === 0 && (
                      <fieldset>
                        <legend className="mb-5 font-display text-2xl font-semibold">What can we help with?</legend>
                        <div className="flex flex-wrap gap-2.5">
                          {serviceOptions.map((s) => (
                            <Chip key={s} active={d.services.includes(s)} onClick={() => toggle(s)}>
                              {s}
                            </Chip>
                          ))}
                        </div>
                      </fieldset>
                    )}
                    {step === 1 && (
                      <div className="space-y-4">
                        <p className="mb-1 font-display text-2xl font-semibold">Tell us about your business</p>
                        <label className="block text-sm text-mute">
                          Website URL (if you have one)
                          <input className={`${input} mt-2`} value={d.url} onChange={(e) => setD({ ...d, url: e.target.value })} placeholder="yourwebsite.com" inputMode="url" />
                        </label>
                        <label className="block text-sm text-mute">
                          Business / industry
                          <input className={`${input} mt-2`} value={d.business} onChange={(e) => setD({ ...d, business: e.target.value })} placeholder="e.g. Dental clinic, SaaS, e-commerce" />
                        </label>
                      </div>
                    )}
                    {step === 2 && (
                      <div className="space-y-6">
                        <fieldset>
                          <legend className="mb-3 font-display text-xl font-semibold">Budget</legend>
                          <div className="flex flex-wrap gap-2.5">
                            {budgets.map((b) => (
                              <Chip key={b} active={d.budget === b} onClick={() => setD({ ...d, budget: b })}>
                                {b}
                              </Chip>
                            ))}
                          </div>
                        </fieldset>
                        <fieldset>
                          <legend className="mb-3 font-display text-xl font-semibold">Timeline</legend>
                          <div className="flex flex-wrap gap-2.5">
                            {timelines.map((t) => (
                              <Chip key={t} active={d.timeline === t} onClick={() => setD({ ...d, timeline: t })}>
                                {t}
                              </Chip>
                            ))}
                          </div>
                        </fieldset>
                      </div>
                    )}
                    {step === 3 && (
                      <div className="space-y-4">
                        <p className="mb-1 font-display text-2xl font-semibold">Where should we send your proposal?</p>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <label className="block text-sm text-mute">
                            Name *
                            <input required autoComplete="name" className={`${input} mt-2`} value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} />
                          </label>
                          <label className="block text-sm text-mute">
                            Email *
                            <input required type="email" autoComplete="email" className={`${input} mt-2`} value={d.email} onChange={(e) => setD({ ...d, email: e.target.value })} />
                          </label>
                        </div>
                        <label className="block text-sm text-mute">
                          Anything else? (optional)
                          <textarea rows={3} className={`${input} mt-2 resize-none`} value={d.message} onChange={(e) => setD({ ...d, message: e.target.value })} />
                        </label>
                      </div>
                    )}
                  </m.div>
                </AnimatePresence>

                {status === "error" && (
                  <p className="mt-4 text-sm text-coral" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!canNext || status === "sending"}
                  className="mt-6 w-full rounded-full bg-brand px-6 py-4 font-semibold text-ink transition hover:shadow-[0_0_40px_-6px_var(--color-brand)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                >
                  {step < 3 ? "Continue →" : status === "sending" ? "Sending…" : "Send my request"}
                </button>
                <p className="mt-3 text-center text-xs text-mute">We never share your details. Privacy policy coming at launch.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
