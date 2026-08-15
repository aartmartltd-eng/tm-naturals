"use client";

import { useEffect, useRef, useState } from "react";

const rhythmSteps = [
  { label: "MORNING", line: "Simple start" },
  { label: "MIDDAY", line: "Stay consistent" },
  { label: "EVENING", line: "Keep the routine going" },
];

export default function ApproachRhythmVisual() {
  const visualRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReducedMotion = () => {
      const prefersReduced = mediaQuery.matches;
      setReducedMotion(prefersReduced);
      if (prefersReduced) setVisible(true);
    };

    syncReducedMotion();
    mediaQuery.addEventListener("change", syncReducedMotion);
    return () => mediaQuery.removeEventListener("change", syncReducedMotion);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const node = visualRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const show = visible || reducedMotion;

  const stepStyle = (index: number) =>
    reducedMotion
      ? undefined
      : {
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(8px)",
          transition: `opacity 550ms ease-out ${index * 120}ms, transform 550ms ease-out ${index * 120}ms`,
        };

  const connectorStyle = reducedMotion
    ? undefined
    : {
        opacity: show ? 1 : 0,
        transform: show ? "scaleY(1)" : "scaleY(0)",
        transformOrigin: "top",
        transition: "opacity 500ms ease-out 80ms, transform 600ms ease-out 80ms",
      };

  const dotStyle = (index: number) =>
    reducedMotion
      ? undefined
      : {
          opacity: show ? 1 : 0,
          transition: `opacity 450ms ease-out ${180 + index * 100}ms`,
        };

  const footerStyle = reducedMotion
    ? undefined
    : {
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 500ms ease-out 480ms, transform 500ms ease-out 480ms",
      };

  return (
    <div
      ref={visualRef}
      className="flex flex-col items-center justify-center px-5 py-12 sm:px-8 lg:px-10 lg:py-28"
    >
      <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[360px] lg:mx-0 lg:max-w-[380px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[7px] top-3 bottom-10 w-px bg-[rgba(1,1,1,0.08)]"
          style={connectorStyle}
        />

        <ol className="relative space-y-9 sm:space-y-10">
          {rhythmSteps.map((step, index) => (
            <li key={step.label} className="relative pl-8" style={stepStyle(index)}>
              <span
                aria-hidden="true"
                className="absolute left-0 top-1.5 flex h-3.5 w-3.5 items-center justify-center"
                style={dotStyle(index)}
              >
                <span className="h-2 w-2 rounded-full bg-[#FFA304]" />
                <span className="absolute h-3.5 w-3.5 rounded-full border border-[#8FC642]/40" />
              </span>

              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8FC642]">
                {step.label}
              </p>
              <p className="mt-1.5 font-display text-xl font-semibold leading-snug text-[#010101] sm:text-[1.35rem]">
                {step.line}
              </p>
              <div className="mt-3 h-px w-12 bg-[#010101]/20" />

              {index < rhythmSteps.length - 1 && (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="pointer-events-none absolute -bottom-5 left-0 h-5 w-5 text-[#8FC642]/35"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  style={dotStyle(index)}
                >
                  <path
                    strokeLinecap="round"
                    d="M7 4c4 4 4 8 8 12"
                  />
                </svg>
              )}
            </li>
          ))}
        </ol>

        <p
          className="mt-10 text-xs leading-relaxed text-tm-muted-secondary sm:mt-12"
          style={footerStyle}
        >
          Built for everyday consistency.
        </p>
      </div>
    </div>
  );
}
