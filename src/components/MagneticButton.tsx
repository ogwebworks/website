"use client";

import { useRef } from "react";
import { m, useMotionValue, useSpring } from "motion/react";

/** CTA that leans toward the cursor. */
export default function MagneticButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15, mass: 0.4 });

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.3);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.4);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const styles =
    variant === "primary"
      ? "bg-brand text-ink hover:shadow-[0_0_50px_-6px_var(--color-brand)]"
      : "border border-line bg-white/[0.04] text-paper hover:bg-white/10";

  return (
    <m.a
      ref={ref}
      href={href}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`group inline-flex w-fit shrink-0 items-center gap-3 whitespace-nowrap rounded-full px-7 py-4 text-base font-semibold transition-shadow ${styles}`}
    >
      {children}
      <span className="grid h-7 w-7 place-items-center overflow-hidden rounded-full bg-ink/10" aria-hidden="true">
        <span className="flex transition-transform duration-500 ease-out-expo group-hover:translate-x-[0.4rem]">→</span>
      </span>
    </m.a>
  );
}
