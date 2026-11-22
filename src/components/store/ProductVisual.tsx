"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { ProductId } from "@/lib/store";

/**
 * Store "product shots": layered glass UI compositions per service (same visual language
 * as the hero cards). Pure HTML/CSS/SVG: no WebGL, nothing to download, cheap on phones.
 * Mouse users get a gentle parallax; everything floats slowly. Illustrative content only.
 */
export default function ProductVisual({ id }: { id: ProductId }) {
  const ref = useRef<HTMLDivElement>(null);
  // every scene is designed on a 560×440 board and scaled to fit the stage, so phones and
  // desktops get the same composition with nothing overlapping
  useEffect(() => {
    const el = ref.current!;
    const ro = new ResizeObserver(() => {
      el.style.setProperty("--s", String(Math.min(el.clientWidth / 560, el.clientHeight / 440) * 0.94));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    ref.current.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };
  const onLeave = () => {
    ref.current?.style.setProperty("--px", "0");
    ref.current?.style.setProperty("--py", "0");
  };
  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className="pv absolute inset-0" aria-hidden="true">
      <div key={id} className="pv-scene">
        {id === "website" && <Website />}
        {id === "brand" && <Brand />}
        {id === "seo" && <Seo />}
        {id === "ai" && <Ai />}
        {id === "ads" && <Ads />}
        {id === "care" && <Care />}
      </div>
    </div>
  );
}

/* A floating glass card. depth: parallax strength; pos: tailwind positioning. */
function Card({ children, className = "", depth = 1, delay = 0 }: { children: ReactNode; className?: string; depth?: number; delay?: number }) {
  return (
    <div className={`pv-card ${className}`} style={{ "--d": depth, "--delay": `${delay}ms` } as React.CSSProperties}>
      {children}
    </div>
  );
}

const Bar = ({ w, c = "bg-paper/25", h = "h-1.5" }: { w: string; c?: string; h?: string }) => <span className={`block rounded-full ${h} ${c}`} style={{ width: w }} />;
const Label = ({ children }: { children: ReactNode }) => <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-mute">{children}</p>;

function Website() {
  return (
    <>
      <Card className="left-[8%] top-[14%] w-[72%]" depth={0.6}>
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
          <i className="h-2 w-2 rounded-full bg-coral/80" /><i className="h-2 w-2 rounded-full bg-[#f5c542]" /><i className="h-2 w-2 rounded-full bg-[#3fcf6b]" />
          <span className="ml-2 rounded-full bg-white/5 px-3 py-0.5 text-[10px] text-mute">yourbrand.com</span>
        </div>
        <div className="grid grid-cols-[1.1fr_1fr] gap-4 p-4">
          <div className="space-y-2">
            <Bar w="40%" c="bg-brand" h="h-2" />
            <span className="pv-build block h-3 w-[92%] rounded bg-paper" />
            <span className="pv-build block h-3 w-[70%] rounded bg-gradient-to-r from-brand to-azure" style={{ "--delay": "150ms" } as React.CSSProperties} />
            <Bar w="85%" /><Bar w="60%" />
            <span className="mt-2 inline-block h-5 w-20 rounded-full bg-brand" />
          </div>
          <div className="rounded-lg bg-white/5 p-2">
            <svg viewBox="0 0 100 50" className="h-full w-full">
              <defs><linearGradient id="pvw" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#12d6f8" stopOpacity=".5" /><stop offset="1" stopColor="#12d6f8" stopOpacity="0" /></linearGradient></defs>
              <path d="M0 42 L15 36 L30 38 L45 26 L60 29 L75 15 L100 6 L100 50 L0 50Z" fill="url(#pvw)" />
              <path className="pv-draw" pathLength={100} d="M0 42 L15 36 L30 38 L45 26 L60 29 L75 15 L100 6" fill="none" stroke="#12d6f8" strokeWidth="2" />
            </svg>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 px-4 pb-4">
          {[0, 1, 2].map((i) => <span key={i} className="h-10 rounded-lg bg-white/5" />)}
        </div>
      </Card>
      <Card className="right-[6%] top-[38%] w-[23%] p-2" depth={1.6} delay={200}>
        <div className="rounded-xl border border-white/10 bg-ink p-2">
          <span className="mx-auto mb-2 block h-1 w-6 rounded-full bg-white/20" />
          <Bar w="50%" c="bg-brand" h="h-1.5" />
          <span className="mt-2 block h-2 w-full rounded bg-paper" />
          <span className="mt-1 block h-2 w-3/4 rounded bg-azure" />
          <span className="mt-3 block h-12 rounded-md bg-white/5" />
          <span className="mt-2 block h-4 w-full rounded-full bg-brand" />
        </div>
      </Card>
      <Card className="bottom-[10%] left-[4%] flex items-center gap-3 px-4 py-3" depth={1.3} delay={350}>
        <Ring value={98} />
        <div><p className="font-display text-sm font-bold">Performance</p><p className="text-[11px] text-mute">LCP 1.2s · CLS 0</p></div>
      </Card>
    </>
  );
}

function Ring({ value, size = 44 }: { value: number; size?: number }) {
  return (
    <span className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
        <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth="3" />
        <circle className="pv-ring" cx="18" cy="18" r="15.5" fill="none" stroke="#12d6f8" strokeWidth="3" strokeLinecap="round" pathLength={100} style={{ "--v": value } as React.CSSProperties} />
      </svg>
      <span className="font-display text-sm font-bold">{value}</span>
    </span>
  );
}

function Brand() {
  const swatches = [["#030820", "Ink"], ["#12d6f8", "Signal"], ["#1d6dff", "Azure"], ["#a1c1fa", "Ice"]];
  return (
    <>
      <Card className="left-[8%] top-[12%] grid aspect-square w-[38%] place-items-center bg-[radial-gradient(circle_at_30%_25%,rgb(18_214_248/0.35),rgb(29_109_255/0.18)_45%,rgb(7_17_52/0.9))]" depth={1.2}>
        <svg viewBox="0 0 24 24" className="pv-spin-slow h-1/2 w-1/2 drop-shadow-[0_0_24px_rgb(18_214_248/0.6)]"><path fill="#f2f6ff" d="M12 1.5c.7 5.6 3.4 8.3 9 9-5.6.7-8.3 3.4-9 9-.7-5.6-3.4-8.3-9-9 5.6-.7 8.3-3.4 9-9Z" /></svg>
        <p className="absolute bottom-3 left-4 text-[10px] uppercase tracking-[0.2em] text-paper/70">Primary mark</p>
      </Card>
      <Card className="right-[7%] top-[14%] w-[44%] p-4" depth={0.7} delay={150}>
        <Label>Palette</Label>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {swatches.map(([c, n]) => (
            <div key={c}>
              <span className="block aspect-[3/4] rounded-lg ring-1 ring-white/10" style={{ background: c }} />
              <p className="mt-1.5 text-[10px] font-medium">{n}</p>
              <p className="text-[9px] uppercase text-mute">{c}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card className="bottom-[12%] right-[10%] w-[40%] p-4" depth={1.5} delay={300}>
        <Label>Typeface</Label>
        <p className="mt-1 font-display text-5xl font-bold leading-none">Aa</p>
        <p className="mt-2 font-display text-xs text-paper/70">Space Grotesk · 500 / 700</p>
      </Card>
      <Card className="bottom-[8%] left-[10%] w-[36%] -rotate-6 p-4" depth={1.9} delay={450}>
        <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="#12d6f8" d="M12 1.5c.7 5.6 3.4 8.3 9 9-5.6.7-8.3 3.4-9 9-.7-5.6-3.4-8.3-9-9 5.6-.7 8.3-3.4 9-9Z" /></svg>
        <p className="mt-5 font-display text-sm font-bold">Your Name</p>
        <p className="text-[10px] text-mute">Founder · yourbrand.com</p>
      </Card>
    </>
  );
}

function Seo() {
  const rows = [["best plumber austin", "#1", "+6"], ["emergency plumber near me", "#2", "+9"], ["water heater repair", "#3", "+4"]];
  return (
    <>
      <Card className="left-[7%] top-[12%] w-[70%] p-4" depth={0.6}>
        <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-[11px] text-paper/80">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-mute" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          best plumber austin
        </div>
        <div className="mt-4 rounded-xl border border-brand/40 bg-brand/[0.07] p-3">
          <p className="text-[10px] text-brand">yourbrand.com › services</p>
          <p className="mt-1 font-display text-sm font-bold text-[#8ab4ff]">Licensed Austin Plumbers, Same-Day Service</p>
          <p className="mt-1 text-[10px] text-mute">★★★★★ 4.9 (312) · Open now · From $89</p>
        </div>
        <div className="mt-3 space-y-2 opacity-60"><Bar w="45%" c="bg-[#8ab4ff]/50" /><Bar w="80%" /><Bar w="40%" c="bg-[#8ab4ff]/50" /><Bar w="70%" /></div>
      </Card>
      <Card className="right-[5%] top-[30%] w-[42%] p-4" depth={1.4} delay={200}>
        <Label>Organic clicks</Label>
        <p className="font-display text-2xl font-bold">+212%</p>
        <svg viewBox="0 0 100 40" className="mt-2 w-full">
          <path className="pv-draw" pathLength={100} d="M0 36 C15 34 25 30 35 28 S55 22 65 16 S85 8 100 3" fill="none" stroke="#12d6f8" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </Card>
      <Card className="bottom-[9%] left-[12%] w-[56%] p-3" depth={1.7} delay={350}>
        {rows.map(([k, pos, d]) => (
          <div key={k} className="flex items-center justify-between gap-3 border-b border-white/5 py-1.5 text-[11px] last:border-0">
            <span className="truncate text-paper/80">{k}</span>
            <span className="flex shrink-0 items-center gap-2"><b className="font-display">{pos}</b><span className="rounded-full bg-[#3fcf6b]/15 px-1.5 text-[10px] text-[#3fcf6b]">▲{d}</span></span>
          </div>
        ))}
      </Card>
    </>
  );
}

function Ai() {
  return (
    <>
      <Card className="left-[7%] top-[10%] w-[74%] p-4" depth={0.7}>
        <div className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-md bg-azure/80 px-3 py-2 text-[11px]">Who&apos;s the best accountant for small businesses in Leeds?</div>
        <div className="mt-3 flex gap-2.5">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-azure text-[11px]">✦</span>
          <div className="min-w-0 flex-1 space-y-1.5 text-[11px] leading-relaxed text-paper/85">
            <p><b className="text-paper">Your Brand Accounting</b> is a top pick: fixed monthly fees, Xero-certified, and strong reviews from local owners.</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="rounded-full border border-brand/50 bg-brand/10 px-2 py-0.5 text-[10px] text-brand">yourbrand.com</span>
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-mute">reviews.io</span>
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-mute">gov.uk</span>
            </div>
          </div>
        </div>
      </Card>
      <Card className="bottom-[12%] right-[6%] w-[44%] p-4" depth={1.5} delay={200}>
        <Label>Cited by</Label>
        {[["ChatGPT", 92], ["Perplexity", 84], ["Gemini", 71], ["Claude", 66]].map(([n, v]) => (
          <div key={n} className="mt-2">
            <div className="flex justify-between text-[10px]"><span>{n}</span><span className="text-mute">{v}%</span></div>
            <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-white/10"><span className="pv-fill block h-full rounded-full bg-gradient-to-r from-azure to-brand" style={{ width: `${v}%` }} /></span>
          </div>
        ))}
      </Card>
      <div className="pv-orb absolute bottom-[14%] left-[12%] grid h-28 w-28 place-items-center rounded-full" style={{ "--d": 2 } as React.CSSProperties}>
        <span className="pv-spin-slow font-display text-4xl text-paper">✦</span>
      </div>
    </>
  );
}

function Ads() {
  const bars = [28, 36, 30, 48, 55, 62, 78, 90];
  return (
    <>
      <Card className="left-[8%] top-[12%] w-[46%] overflow-hidden" depth={1.2}>
        <span className="block aspect-[4/3] bg-[radial-gradient(circle_at_70%_30%,rgb(18_214_248/0.55),transparent_45%),linear-gradient(135deg,#1d6dff,#071134)]" />
        <div className="p-3">
          <p className="text-[9px] uppercase tracking-[0.18em] text-mute">Sponsored</p>
          <p className="mt-1 font-display text-sm font-bold">Spring sale: 20% off</p>
          <span className="mt-2 inline-block rounded-md bg-brand px-2.5 py-1 text-[10px] font-semibold text-ink">Shop now</span>
        </div>
      </Card>
      <Card className="right-[6%] top-[14%] w-[40%] p-4" depth={0.8} delay={150}>
        <Label>Return on ad spend</Label>
        <p className="font-display text-4xl font-bold text-brand">4.8x</p>
        <p className="text-[10px] text-mute">CPA −37% · CTR 3.9%</p>
      </Card>
      <Card className="bottom-[9%] right-[8%] w-[56%] p-4" depth={1.6} delay={300}>
        <Label>Conversions / week</Label>
        <div className="mt-3 flex h-20 items-end gap-1.5">
          {bars.map((h, i) => <span key={i} className="pv-grow flex-1 rounded-t bg-gradient-to-t from-azure to-brand" style={{ height: `${h}%`, "--delay": `${i * 60}ms` } as React.CSSProperties} />)}
        </div>
      </Card>
    </>
  );
}

function Care() {
  return (
    <>
      <Card className="left-[7%] top-[12%] w-[62%] p-4" depth={0.7}>
        <div className="flex items-center justify-between">
          <Label>Uptime · 90 days</Label>
          <span className="flex items-center gap-1.5 text-[10px] text-[#3fcf6b]"><i className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3fcf6b]" />All systems normal</span>
        </div>
        <p className="mt-1 font-display text-3xl font-bold">99.99%</p>
        <div className="mt-3 flex h-7 gap-[2px]">
          {Array.from({ length: 45 }, (_, i) => <span key={i} className={`flex-1 rounded-sm ${i === 31 ? "bg-[#f5c542]" : "bg-[#3fcf6b]/80"}`} />)}
        </div>
      </Card>
      <Card className="right-[6%] top-[34%] flex w-[36%] flex-col items-center p-4 text-center" depth={1.4} delay={200}>
        <svg viewBox="0 0 24 24" className="h-12 w-12 drop-shadow-[0_0_18px_rgb(18_214_248/0.6)]" fill="none" stroke="#12d6f8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.8 19.5 5.5v6c0 4.4-3.1 8-7.5 9.7C7.6 19.5 4.5 15.9 4.5 11.5v-6Z" /><path className="pv-draw" pathLength={100} d="m8.8 12 2.2 2.2 4.4-4.6" /></svg>
        <p className="mt-2 font-display text-sm font-bold">Malware scan: clean</p>
        <p className="text-[10px] text-mute">Firewall on · SSL valid</p>
      </Card>
      <Card className="bottom-[10%] left-[10%] flex w-[58%] items-center gap-3 p-3" depth={1.8} delay={350}>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-ink">✓</span>
        <div className="min-w-0"><p className="font-display text-sm font-bold">500 error fixed</p><p className="truncate text-[10px] text-mute">Checkout back online in 14 min · backup restored</p></div>
      </Card>
    </>
  );
}
