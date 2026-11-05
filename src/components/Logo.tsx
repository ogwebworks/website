/** Placeholder wordmark until the Phase 1 brand identity is designed. */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
        <rect width="40" height="40" rx="11" fill="#c6f432" />
        <text
          x="20"
          y="26.5"
          textAnchor="middle"
          fontFamily="var(--font-space-grotesk), sans-serif"
          fontWeight="700"
          fontSize="17"
          letterSpacing="-0.5"
          fill="#06070d"
        >
          OG
        </text>
      </svg>
      <span className="font-display text-[1.15rem] font-semibold tracking-tight">
        Web<span className="text-lime">Works</span>
      </span>
    </span>
  );
}
