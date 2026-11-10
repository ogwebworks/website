import type { HouseStyle } from "./data";

/**
 * Generative architectural illustration (the stand-in for listing photography).
 * Deterministic by seed; "dusk" renders a twilight scene with glowing windows.
 * Uses no SVG ids, so it can render many times on one page.
 */
export default function HouseArt({ style, seed = 1, dusk = false, view = 0, className = "" }: { style: HouseStyle; seed?: number; dusk?: boolean; view?: number; className?: string }) {
  const r = (n: number) => ((seed * 9301 + n * 49297 + view * 7919) % 233280) / 233280;
  const wall = dusk ? "#16264f" : "#ffffff";
  const wall2 = dusk ? "#0f1d45" : "#e3eaf7";
  const roof = dusk ? "#071134" : "#0a1f5c";
  const lit = dusk ? "#bff4ff" : "#a1c1fa";
  const dark = dusk ? "#0a1538" : "#c9d7ef";
  const win = (i: number) => (r(i) > (dusk ? 0.35 : 0.55) ? lit : dark);
  const tree = dusk ? "#0a1f5c" : "#8fb0e8";
  const sky = dusk
    ? "linear-gradient(180deg,#071134 0%,#16307a 45%,#1d6dff 85%,#7fb3ff 100%)"
    : "linear-gradient(180deg,#cfe0fb 0%,#e9f1fd 60%,#f6f9ff 100%)";
  const zoom = view === 1 ? "scale(1.18) translate(-4%, 2%)" : view === 2 ? "scale(1.35) translate(5%, 4%)" : undefined;

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`} style={{ background: sky }} aria-hidden="true">
      {dusk && (
        <>
          <span className="absolute left-[12%] top-[14%] h-1 w-1 rounded-full bg-white/80" />
          <span className="absolute left-[68%] top-[9%] h-0.5 w-0.5 rounded-full bg-white/70" />
          <span className="absolute left-[84%] top-[20%] h-1 w-1 rounded-full bg-white/60" />
          <span className="absolute right-[14%] top-[10%] h-8 w-8 rounded-full bg-[#e9f1fd] opacity-80 shadow-[0_0_40px_10px_rgba(191,244,255,0.35)]" />
        </>
      )}
      <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" style={{ transform: zoom, transformOrigin: "center bottom" }}>
        {/* distant hills */}
        <path d="M0 200 Q80 160 160 185 T320 175 T400 185 V260 H0 Z" fill={dusk ? "#0f2668" : "#dbe6fa"} />
        {/* trees */}
        {[30, 360, 330].map((x, i) => (
          <g key={x} transform={`translate(${x + r(40 + i) * 10}, ${190 - r(50 + i) * 10})`}>
            <rect x="-2" y="10" width="4" height="26" fill={roof} />
            <circle r={16 + r(60 + i) * 8} cy="4" fill={tree} />
          </g>
        ))}
        {style === "modern" && (
          <g>
            <rect x="70" y="128" width="200" height="98" fill={wall} />
            <rect x="150" y="84" width="176" height="52" fill={wall2} />
            <rect x="140" y="80" width="196" height="6" fill={roof} />
            <rect x="60" y="124" width="220" height="6" fill={roof} />
            {[0, 1, 2, 3].map((i) => <rect key={i} x={164 + i * 40} y="96" width="30" height="30" fill={win(i)} />)}
            <rect x="86" y="146" width="90" height="62" fill={win(9)} />
            <rect x="190" y="146" width="40" height="80" fill={dusk ? "#bff4ff" : "#0a1f5c"} opacity={dusk ? 0.9 : 1} />
            <rect x="244" y="146" width="18" height="40" fill={win(7)} />
            <rect x="40" y="224" width="300" height="4" fill={roof} opacity="0.5" />
          </g>
        )}
        {style === "gable" && (
          <g>
            <rect x="262" y="70" width="18" height="40" fill={roof} />
            <polygon points="70,140 200,62 330,140" fill={roof} />
            <rect x="92" y="138" width="216" height="88" fill={wall} />
            <polygon points="170,140 200,118 230,140" fill={wall2} />
            {[0, 1].map((i) => <rect key={i} x={112 + i * 150} y="156" width="34" height="38" fill={win(i + 2)} />)}
            <rect x="186" y="170" width="28" height="56" fill={dusk ? "#bff4ff" : "#0a1f5c"} />
            <circle cx="200" cy="104" r="10" fill={win(5)} />
            <rect x="92" y="222" width="216" height="4" fill={roof} opacity="0.4" />
          </g>
        )}
        {style === "tower" && (
          <g>
            <rect x="120" y="14" width="160" height="214" fill={wall} />
            <rect x="120" y="14" width="160" height="10" fill={roof} />
            {Array.from({ length: 8 }).map((_, row) =>
              Array.from({ length: 4 }).map((__, col) => (
                <rect key={`${row}-${col}`} x={132 + col * 37} y={34 + row * 23} width="26" height="15" fill={win(row * 4 + col)} />
              )),
            )}
            <rect x="182" y="210" width="36" height="18" fill={dusk ? "#bff4ff" : "#0a1f5c"} />
            <rect x="290" y="96" width="70" height="132" fill={wall2} />
            {Array.from({ length: 5 }).map((_, row) => <rect key={row} x="300" y={110 + row * 22} width="50" height="10" fill={win(40 + row)} />)}
          </g>
        )}
        {style === "townhome" && (
          <g>
            {[0, 1, 2].map((i) => {
              const x = 70 + i * 88;
              return (
                <g key={i}>
                  <polygon points={`${x - 4},118 ${x + 42},${84 - i * 4} ${x + 88},118`} fill={roof} />
                  <rect x={x} y="116" width="84" height="110" fill={i === 1 ? wall2 : wall} />
                  <rect x={x + 14} y="132" width="22" height="28" fill={win(i * 3)} />
                  <rect x={x + 48} y="132" width="22" height="28" fill={win(i * 3 + 1)} />
                  <rect x={x + 30} y="178" width="24" height="48" fill={dusk ? "#bff4ff" : "#0a1f5c"} opacity={i === 1 ? 1 : 0.85} />
                </g>
              );
            })}
          </g>
        )}
        {/* lawn */}
        <rect x="0" y="226" width="400" height="34" fill={dusk ? "#071134" : "#d5e2f8"} />
        {dusk && <rect x="0" y="226" width="400" height="2" fill="#bff4ff" opacity="0.25" />}
      </svg>
    </div>
  );
}
