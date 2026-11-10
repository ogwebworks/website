/**
 * Generative "plated dish" made of CSS gradients in the dish's colours: a stand-in for food
 * photography. Deterministic by seed so server and client render identically.
 */
export default function PlateArt({ tint, seed = 0, className = "", steam = false }: { tint: [string, string, string]; seed?: number; className?: string; steam?: boolean }) {
  const [a, b, c] = tint;
  const r = (n: number) => ((seed * 9301 + n * 49297) % 233280) / 233280;
  const blobs = [
    { x: 38 + r(1) * 10, y: 40 + r(2) * 8, w: 34, h: 26, color: a, rot: r(3) * 60 },
    { x: 52 + r(4) * 8, y: 50 + r(5) * 8, w: 26, h: 22, color: b, rot: r(6) * 90 },
    { x: 46 + r(7) * 12, y: 36 + r(8) * 10, w: 14, h: 12, color: c, rot: 0 },
  ];
  const dots = Array.from({ length: 9 }, (_, i) => ({ x: 30 + r(10 + i) * 42, y: 30 + r(20 + i) * 40, s: 1.4 + r(30 + i) * 2.4, color: i % 2 ? c : b }));
  return (
    <div className={`relative aspect-square ${className}`} aria-hidden="true">
      {/* plate */}
      <div className="absolute inset-[4%] rounded-full bg-[radial-gradient(circle_at_40%_35%,#16264f,#071134_70%)] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8),inset_0_2px_0_rgba(255,255,255,0.06)]" />
      <div className="absolute inset-[13%] rounded-full bg-[radial-gradient(circle_at_45%_40%,#0f1d45,#050c26_75%)] shadow-[inset_0_6px_18px_rgba(0,0,0,0.6)]" />
      {/* food */}
      <div className="absolute inset-[13%] overflow-hidden rounded-full">
        {blobs.map((bl, i) => (
          <span
            key={i}
            className="absolute rounded-[45%_55%_60%_40%/50%_45%_55%_50%]"
            style={{
              left: `${bl.x - bl.w / 2}%`,
              top: `${bl.y - bl.h / 2}%`,
              width: `${bl.w}%`,
              height: `${bl.h}%`,
              transform: `rotate(${bl.rot}deg)`,
              background: `radial-gradient(circle at 35% 30%, color-mix(in oklab, ${bl.color} 70%, white), ${bl.color} 55%, color-mix(in oklab, ${bl.color} 70%, black))`,
              boxShadow: "0 8px 16px -6px rgba(0,0,0,0.6)",
            }}
          />
        ))}
        {/* sauce swoosh */}
        <span className="absolute left-[20%] top-[58%] h-[9%] w-[55%] -rotate-12 rounded-full opacity-80 blur-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${b}, transparent)` }} />
        {dots.map((d, i) => (
          <span key={i} className="absolute rounded-full" style={{ left: `${d.x}%`, top: `${d.y}%`, width: `${d.s}%`, height: `${d.s}%`, background: d.color, boxShadow: "0 1px 2px rgba(0,0,0,0.5)" }} />
        ))}
      </div>
      {/* rim highlight */}
      <div className="absolute inset-[4%] rounded-full ring-1 ring-white/10" />
      {steam && (
        <>
          <span className="dm-steam left-[30%] top-[-10%]" style={{ "--d": "0s" } as React.CSSProperties} />
          <span className="dm-steam left-[48%] top-[-14%]" style={{ "--d": "2s", "--dur": "7s" } as React.CSSProperties} />
          <span className="dm-steam left-[40%] top-[-6%]" style={{ "--d": "4s" } as React.CSSProperties} />
        </>
      )}
    </div>
  );
}
