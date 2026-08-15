"use client";

function AnimatedLayer({
  delay = "0s",
  className = "",
  children,
}: {
  delay?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`hero-abstract-enter ${className}`} style={{ animationDelay: delay }}>
      {children}
    </div>
  );
}

export default function HeroProductShowcase() {
  return (
    <div
      className="hero-abstract-group relative w-full max-w-[540px] mx-auto lg:max-w-none lg:mx-0 min-h-[300px] sm:min-h-[380px] lg:min-h-[480px] overflow-hidden"
      aria-hidden="true"
    >
      {/* Layer 1 — large green organic block, cropped outside container */}
      <AnimatedLayer className="pointer-events-none absolute -top-[18%] -right-[22%] z-[1] h-[88%] w-[105%]">
        <div className="h-full w-full rounded-[42%] bg-tm-green" />
      </AnimatedLayer>

      {/* Layer 2 — orange accent, diagonal curved block */}
      <AnimatedLayer
        delay="0.08s"
        className="pointer-events-none absolute bottom-[20%] right-[-6%] z-[2] h-[26%] w-[46%]"
      >
        <div className="h-full w-full -rotate-6 rounded-[2rem_0_2rem_2rem] bg-tm-orange" />
      </AnimatedLayer>

      {/* Layer 3 — thin decorative lines / arcs */}
      <AnimatedLayer
        delay="0.14s"
        className="pointer-events-none absolute top-[10%] left-[6%] z-[4] hidden sm:block"
      >
        <svg
          className="h-20 w-20 text-white/15"
          viewBox="0 0 80 80"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M8 64 C28 20, 52 20, 72 64"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M16 72 H64"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </AnimatedLayer>

      <AnimatedLayer
        delay="0.18s"
        className="pointer-events-none absolute bottom-[32%] left-[10%] z-[4] hidden lg:block"
      >
        <svg
          className="h-16 w-16 text-white/15"
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
        </svg>
      </AnimatedLayer>

      {/* Layer 5 — premium badge */}
      <AnimatedLayer
        delay="0.2s"
        className="absolute top-[12%] left-[8%] sm:left-[10%] z-[5]"
      >
        <div className="rounded-xl bg-white px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.22)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-tm-black">
            Premium Wellness
          </p>
          <p className="mt-1 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-tm-black">
            <span className="h-1.5 w-4 shrink-0 rounded-full bg-tm-green" />
            TM NATURALS
          </p>
        </div>
      </AnimatedLayer>

      {/* Layer 6 — editorial feature line */}
      <div className="absolute bottom-[7%] left-1/2 z-[5] hidden sm:block -translate-x-1/2">
        <AnimatedLayer delay="0.24s">
          <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40 whitespace-nowrap">
            Fruits · Sea Moss · Shilajit · Gummies
          </p>
        </AnimatedLayer>
      </div>
    </div>
  );
}
