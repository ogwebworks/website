/**
 * First-visit brand intro (CSS only, plays on first paint, ~1s): logo, a 0→100 counter and the
 * tagline, then two curtains lift. Shown once per session on tablets and desktops; skipped on phones (speed) and for reduced motion.
 * The inline script runs before paint and marks <html class="intro-seen"> on repeat visits.
 */
const script = `try{var d=document.documentElement;if(sessionStorage.getItem('og-intro')||matchMedia('(prefers-reduced-motion: reduce)').matches||!matchMedia('(min-width: 768px)').matches)d.classList.add('intro-seen');else sessionStorage.setItem('og-intro','1')}catch(e){document.documentElement.classList.add('intro-seen')}`;

export default function IntroCurtain() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: script }} />
      <div className="og-intro" aria-hidden="true">
        <div className="og-intro-panel og-intro-panel-b" />
        <div className="og-intro-panel og-intro-panel-a">
          <div className="og-intro-inner">
            {/* eslint-disable-next-line @next/next/no-img-element -- tiny static mark */}
            <img src="/logo-mark-80.png" alt="" width={78} height={48} className="og-intro-logo" />
            <p className="og-intro-words font-display">
              <span>Original.</span> <span>Digital.</span> <span>Solutions!</span>
            </p>
            <span className="og-intro-count font-display tabular-nums" />
            <span className="og-intro-bar" />
          </div>
        </div>
      </div>
    </>
  );
}
