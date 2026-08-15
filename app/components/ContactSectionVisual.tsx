"use client";

import { useEffect, useRef, useState } from "react";

export default function ContactSectionVisual() {
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

    const fallbackTimer = window.setTimeout(() => {
      setVisible(true);
    }, 700);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
          window.clearTimeout(fallbackTimer);
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallbackTimer);
    };
  }, [reducedMotion]);

  const show = visible || reducedMotion;

  const iconStyle = reducedMotion
    ? undefined
    : {
        opacity: show ? 1 : 0,
        transition: "opacity 600ms ease-out",
      };

  const accentStyle = reducedMotion
    ? undefined
    : {
        opacity: show ? 1 : 0,
        transition: "opacity 500ms ease-out 220ms",
      };

  const textStyle = (delayMs: number) =>
    reducedMotion
      ? undefined
      : {
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(6px)",
          transition: `opacity 500ms ease-out ${delayMs}ms, transform 500ms ease-out ${delayMs}ms`,
        };

  return (
    <div
      ref={visualRef}
      className="flex w-full flex-col items-center justify-center"
    >
      <div className="mx-auto w-full max-w-md rounded-2xl bg-[#010101] px-8 py-10 shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:px-10 sm:py-12">
        <div className="relative mx-auto flex max-w-sm flex-col items-center text-center">
          <div className="relative" style={iconStyle}>
            <svg
              viewBox="0 0 120 88"
              fill="none"
              aria-hidden="true"
              className="h-[140px] w-[190px] sm:h-[180px] sm:w-[240px] lg:h-[200px] lg:w-[260px]"
            >
              <rect
                x="4"
                y="4"
                width="112"
                height="80"
                rx="6"
                stroke="rgba(255,255,255,0.90)"
                strokeWidth="1.5"
              />
              <path
                d="M4 24 L60 52 L116 24"
                stroke="rgba(255,255,255,0.90)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M28 68 h64"
                stroke="rgba(255,255,255,0.70)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>

            <span
              aria-hidden="true"
              className="absolute left-[18%] top-[46%] h-2 w-2 rounded-full bg-[#8FC642]"
              style={accentStyle}
            />
            <span
              aria-hidden="true"
              className="absolute right-[22%] top-[28%] h-1.5 w-1.5 rounded-full bg-[#FFA304]"
              style={accentStyle}
            />
            <span
              aria-hidden="true"
              className="absolute bottom-[18%] left-1/2 h-px w-10 -translate-x-1/2 bg-[#8FC642]"
              style={accentStyle}
            />
          </div>

          <p
            className="mt-8 font-display text-xl font-semibold text-white sm:text-2xl"
            style={textStyle(320)}
          >
            Real questions. Real support.
          </p>
          <p
            className="mt-2 text-sm leading-relaxed text-[rgba(255,255,255,0.65)]"
            style={textStyle(420)}
          >
            We&apos;re here when you need us.
          </p>
        </div>
      </div>
    </div>
  );
}
