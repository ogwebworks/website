/**
 * GPU-cheap "3D" hero visual built with CSS transforms only (no JavaScript, no WebGL).
 * Used on phones/tablets/low-power devices and as the placeholder while WebGL loads.
 * All animations are transform/opacity, so they run on the compositor and never block input.
 */
export default function OrbCss() {
  return (
    <div className="orb-scene" aria-hidden="true">
      <div className="orb-glow" />
      <div className="orb-core">
        <div className="orb-skin" />
        <div className="orb-shine" />
      </div>
      <div className="orb-ring" style={{ "--rx": "72deg", "--ry": "12deg", "--c": "var(--color-lime)", "--s": "1.55", "--d": "16s" } as React.CSSProperties}>
        <span />
      </div>
      <div className="orb-ring" style={{ "--rx": "64deg", "--ry": "-34deg", "--c": "var(--color-violet)", "--s": "1.8", "--d": "22s" } as React.CSSProperties}>
        <span />
      </div>
      <div className="orb-ring orb-ring-rev" style={{ "--rx": "80deg", "--ry": "38deg", "--c": "var(--color-coral)", "--s": "2.05", "--d": "28s" } as React.CSSProperties}>
        <span />
      </div>
      <i className="orb-shard" style={{ "--x": "-1.15", "--y": "-0.95", "--c": "var(--color-lime)", "--t": "7s" } as React.CSSProperties} />
      <i className="orb-shard" style={{ "--x": "1.2", "--y": "0.85", "--c": "var(--color-violet)", "--t": "9s" } as React.CSSProperties} />
      <i className="orb-shard" style={{ "--x": "0.95", "--y": "-1.15", "--c": "var(--color-coral)", "--t": "8s" } as React.CSSProperties} />
    </div>
  );
}
