"use client";

import { useSyncExternalStore } from "react";
import { sfx } from "./sound";

/** Header switch for UI sound (off by default). Animated equaliser bars show the state. */
export default function SoundToggle() {
  const on = useSyncExternalStore(sfx.subscribe, () => sfx.enabled, () => false);
  return (
    <button
      type="button"
      onClick={() => sfx.set(!on)}
      aria-pressed={on}
      aria-label={on ? "Turn interface sound off" : "Turn interface sound on"}
      title={on ? "Sound on" : "Sound off"}
      className="hidden h-10 w-10 place-items-center rounded-full border border-line transition hover:border-paper/40 sm:grid"
    >
      <span className={`flex h-3.5 items-end gap-[2px] ${on ? "sound-on" : ""}`} aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <i key={i} className="sound-bar block w-[2px] rounded-full bg-paper" style={{ "--i": i } as React.CSSProperties} />
        ))}
      </span>
    </button>
  );
}
