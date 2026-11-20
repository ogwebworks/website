"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, type MotionValue } from "motion/react";
import { afterInteraction, canUse3D } from "./support";
import type { HeroSceneHandle } from "./hero-scene";

/**
 * Mounts the WebGL hero scene on large screens once the page is idle.
 * Until it is ready (and on devices that don't get it) the CSS laptop shows instead.
 */
export default function HeroScene({ progress, onReady }: { progress: MotionValue<number>; onReady: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const handle = useRef<HeroSceneHandle | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(min-width: 1280px)").matches) return;
    let alive = true;
    const cancel = afterInteraction(async () => {
      // WebGL probe runs only after the visitor interacts (it costs a GPU context)
      if (!canUse3D(1280)) return;
      const { mountHeroScene } = await import("./hero-scene");
      if (!alive || !ref.current) return;
      try {
        handle.current = mountHeroScene(ref.current, {
          onReady: () => {
            setOn(true);
            onReady();
          },
        });
      } catch {
        /* WebGL failed: keep the CSS visual */
      }
    });
    return () => {
      alive = false;
      cancel();
      handle.current?.dispose();
      handle.current = null;
    };
  }, [onReady]);

  useMotionValueEvent(progress, "change", (v) => handle.current?.setScroll(v));

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      data-cursor="Drag"
      className={`absolute -left-[8%] -top-[18%] h-[136%] w-[106%] touch-none transition-opacity duration-1000 ${on ? "opacity-100" : "pointer-events-none opacity-0"}`}
    />
  );
}
