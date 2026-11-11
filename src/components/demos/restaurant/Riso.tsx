/**
 * Risograph-style dish print: two ink layers (olive + tomato) slightly mis-registered,
 * a halftone layer and paper grain. Deterministic by seed; pure CSS, no images.
 */
export default function Riso({ seed = 1, className = "", label }: { seed?: number; className?: string; label?: string }) {
  const r = (n: number) => ((seed * 9301 + n * 49297) % 233280) / 233280;
  const radius = (k: number) => `${40 + r(k) * 30}% ${60 - r(k + 1) * 30}% ${45 + r(k + 2) * 25}% ${55 - r(k + 3) * 25}% / ${50 + r(k + 4) * 20}% ${45 + r(k + 5) * 20}% ${55 - r(k + 6) * 20}% ${50 - r(k + 7) * 20}%`;
  const shapes = [
    { c: "#4a5a2a", l: 14 + r(1) * 18, t: 18 + r(2) * 16, w: 52 + r(3) * 16, h: 48 + r(4) * 16, rad: radius(10), rot: r(5) * 90 },
    { c: "#d9432b", l: 34 + r(6) * 14, t: 30 + r(7) * 14, w: 40 + r(8) * 14, h: 40 + r(9) * 14, rad: radius(20), rot: r(11) * 120 },
  ];
  const variant = Math.floor(r(30) * 3);
  return (
    <div role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} className={`rs-grain relative overflow-hidden bg-rs-paper ${className}`}>
      {shapes.map((s, i) => (
        <span
          key={i}
          className="absolute mix-blend-multiply"
          style={{ left: `${s.l}%`, top: `${s.t}%`, width: `${s.w}%`, height: `${s.h}%`, borderRadius: s.rad, background: s.c, opacity: 0.92, transform: `rotate(${s.rot}deg) translate(${i ? 3 : -2}px, ${i ? -2 : 3}px)` }}
        />
      ))}
      {/* halftone accent */}
      <span
        className="rs-halftone absolute mix-blend-multiply text-rs-ink"
        style={{ left: `${10 + r(40) * 50}%`, top: `${10 + r(41) * 50}%`, width: "34%", height: "34%", borderRadius: variant === 0 ? "50%" : variant === 1 ? "0" : "50% 50% 0 0", opacity: 0.55 }}
      />
      {/* garnish dots */}
      {Array.from({ length: 6 }).map((_, i) => (
        <span key={i} className="absolute rounded-full mix-blend-multiply" style={{ left: `${15 + r(50 + i) * 70}%`, top: `${15 + r(60 + i) * 70}%`, width: `${3 + r(70 + i) * 4}%`, aspectRatio: "1", background: i % 2 ? "#4a5a2a" : "#d9432b" }} />
      ))}
      {/* stripe for variety */}
      {variant === 2 && <span className="absolute left-0 top-[78%] h-[6%] w-full bg-rs-olive/70 mix-blend-multiply" />}
    </div>
  );
}
