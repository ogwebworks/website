"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type Device = "desktop" | "mobile";
const DESKTOP_W = 1440;
const PHONE = { w: 390, h: 844 };

/**
 * A browser window on the page that runs a live demo site in an iframe.
 * Desktop mode renders the demo at a real 1440px width and scales it down to fit;
 * mobile mode shows the phone layout in a device frame. Loads only on click.
 */
export default function DemoPreview({
  src,
  title,
  host,
  poster,
}: {
  src: string;
  title: string;
  host: string;
  poster: ReactNode;
}) {
  const [live, setLive] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [device, setDevice] = useState<Device>("desktop");
  const [reloadKey, setReloadKey] = useState(0);

  // Phones get the mobile layout by default (a scaled desktop would be unreadable),
  // unless the visitor has already picked a device themselves.
  const picked = useRef(false);
  const chooseDevice = (d: Device) => {
    picked.current = true;
    setDevice(d);
  };
  const start = () => {
    if (!picked.current && window.matchMedia("(max-width: 639px)").matches) setDevice("mobile");
    setLive(true);
  };

  return (
    <>
      <BrowserWindow
        host={host}
        device={device}
        setDevice={chooseDevice}
        onReload={live ? () => setReloadKey((k) => k + 1) : undefined}
        onExpand={() => {
          start();
          setExpanded(true);
        }}
        className="aspect-[16/10]"
      >
        {live && !expanded ? (
          <Viewport key={reloadKey} src={src} title={title} device={device} />
        ) : (
          <button
            type="button"
            onClick={start}
            className="group/poster relative block h-full w-full overflow-hidden text-left"
            aria-label={`Try the live demo: ${title}`}
          >
            <div className="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover/poster:scale-[1.03]">{poster}</div>
            <span className="absolute inset-0 bg-ink/30 transition group-hover/poster:bg-ink/15" aria-hidden="true" />
            <span className="absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-full bg-brand px-6 py-3.5 font-semibold text-ink shadow-[0_10px_40px_-8px_rgb(18_214_248/0.7)] transition group-hover/poster:scale-105">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-ink/15" aria-hidden="true">▶</span>
              Try the live demo
            </span>
          </button>
        )}
      </BrowserWindow>

      {expanded && (
        <Modal onClose={() => setExpanded(false)} label={title}>
          <BrowserWindow
            host={host}
            device={device}
            setDevice={chooseDevice}
            onReload={() => setReloadKey((k) => k + 1)}
            onClose={() => setExpanded(false)}
          >
            <Viewport key={`m-${reloadKey}`} src={src} title={title} device={device} />
          </BrowserWindow>
        </Modal>
      )}
    </>
  );
}

/* ---------- Browser chrome ---------- */
function BrowserWindow({
  host,
  device,
  setDevice,
  onReload,
  onExpand,
  onClose,
  className = "",
  children,
}: {
  host: string;
  device: Device;
  setDevice: (d: Device) => void;
  onReload?: () => void;
  onExpand?: () => void;
  onClose?: () => void;
  className?: string;
  children: ReactNode;
}) {
  const btn = "grid h-8 w-8 place-items-center rounded-lg text-paper/70 transition hover:bg-white/10 hover:text-paper";
  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-line bg-ink-3 shadow-2xl">
      <div className="flex min-w-0 items-center gap-1.5 border-b border-line bg-ink-3 px-2 py-2 sm:gap-2 sm:px-3">
        <div className="hidden items-center gap-1.5 pl-1 min-[400px]:flex" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-coral/80" />
          <span className="h-3 w-3 rounded-full bg-[#f5c542]" />
          <span className="h-3 w-3 rounded-full bg-[#3fcf6b]" />
        </div>
        <div className="mx-2 flex min-w-0 flex-1 items-center gap-2 rounded-full bg-ink px-3 py-1.5 text-xs text-mute">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="currentColor" aria-hidden="true">
            <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 0 1 6 0v3H9Z" />
          </svg>
          <span className="truncate">{host}</span>
        </div>
        <div className="flex items-center gap-0.5 rounded-lg bg-ink p-0.5" role="group" aria-label="Preview device">
          {(["desktop", "mobile"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDevice(d)}
              aria-pressed={device === d}
              aria-label={d === "desktop" ? "Desktop view" : "Mobile view"}
              className={`grid h-7 w-8 place-items-center rounded-md transition ${device === d ? "bg-brand text-ink" : "text-paper/60 hover:text-paper"}`}
            >
              {d === "desktop" ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="2" y="4" width="20" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="2.5" /><path d="M11 18h2" /></svg>
              )}
            </button>
          ))}
        </div>
        {onReload && (
          <button type="button" onClick={onReload} className={`${btn} hidden sm:grid`} aria-label="Reload demo">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 12a9 9 0 1 1-2.6-6.4M21 4v5h-5" /></svg>
          </button>
        )}
        {onExpand && (
          <button type="button" onClick={onExpand} className={btn} aria-label="Expand demo">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
          </button>
        )}
        {onClose && (
          <button type="button" onClick={onClose} className={btn} aria-label="Close demo">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        )}
      </div>
      <div className={`relative min-h-0 flex-1 bg-ink ${className}`}>{children}</div>
    </div>
  );
}

/* ---------- Scaled live viewport ---------- */
function Viewport({ src, title, device }: { src: string; title: string; device: Device }) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [loaded, setLoaded] = useState(false);

  const measure = useCallback(() => {
    const el = box.current;
    if (el) setSize({ w: el.clientWidth, h: el.clientHeight });
  }, []);
  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (box.current) ro.observe(box.current);
    return () => ro.disconnect();
  }, [measure]);

  let frame: React.CSSProperties = { display: "none" };
  let shell: React.CSSProperties | undefined;
  let screen: React.CSSProperties | undefined;
  if (size.w > 0) {
    if (device === "desktop") {
      const s = size.w / DESKTOP_W;
      frame = { width: DESKTOP_W, height: size.h / s, transform: `scale(${s})`, transformOrigin: "0 0" };
    } else {
      const bezel = 12;
      const s = Math.min(1, (size.h - 24) / (PHONE.h + bezel * 2), (size.w - 24) / (PHONE.w + bezel * 2));
      shell = { width: (PHONE.w + bezel * 2) * s, height: (PHONE.h + bezel * 2) * s, borderRadius: 44 * s };
      screen = { position: "absolute", left: bezel * s, top: bezel * s, width: PHONE.w * s, height: PHONE.h * s, borderRadius: 32 * s, overflow: "hidden" };
      frame = { width: PHONE.w, height: PHONE.h, transform: `scale(${s})`, transformOrigin: "0 0" };
    }
  }

  const iframe = (
    <iframe
      src={src}
      title={title}
      onLoad={() => setLoaded(true)}
      style={frame}
      className="block border-0 bg-white"
    />
  );

  return (
    <div ref={box} className="absolute inset-0 overflow-hidden" data-lenis-prevent>
      {device === "desktop" ? (
        iframe
      ) : (
        <div className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_50%_40%,rgb(29_109_255/0.25),transparent_65%)]">
          <div className="relative bg-black shadow-2xl ring-1 ring-white/15" style={shell}>
            <div style={screen}>{iframe}</div>
          </div>
        </div>
      )}
      {!loaded && (
        <div className="absolute inset-0 grid place-items-center bg-ink/80 text-sm text-mute" role="status">
          <span className="flex items-center gap-3">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand border-t-transparent" aria-hidden="true" />
            Loading live demo…
          </span>
        </div>
      )}
    </div>
  );
}

/* ---------- Full-screen overlay (same page) ---------- */
function Modal({ children, onClose, label }: { children: ReactNode; onClose: () => void; label: string }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      data-lenis-prevent
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/85 p-3 backdrop-blur-sm sm:p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="h-full w-full max-w-[1500px]">{children}</div>
    </div>,
    document.body,
  );
}
