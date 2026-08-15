"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const brandPillars = [
  { number: "01", label: "Quality" },
  { number: "02", label: "Transparency" },
  { number: "03", label: "Wellness" },
];

export default function AboutBrandVisual() {
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

  const fadeUp = (delayMs: number) =>
    reducedMotion
      ? undefined
      : {
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(10px)",
          transition: `opacity 600ms ease-out ${delayMs}ms, transform 600ms ease-out ${delayMs}ms`,
        };

  const lineStyle = reducedMotion
    ? undefined
    : {
        width: show ? "2.25rem" : "0px",
        transition: "width 550ms ease-out 140ms",
      };

  const orangeAccentStyle = reducedMotion
    ? undefined
    : {
        opacity: show ? 1 : 0,
        transition: "opacity 500ms ease-out 220ms",
      };

  const pillarStyle = (index: number) =>
    reducedMotion
      ? undefined
      : {
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(6px)",
          transition: `opacity 500ms ease-out ${360 + index * 80}ms, transform 500ms ease-out ${360 + index * 80}ms`,
        };

  return (
    <div
      ref={visualRef}
      className="flex min-h-[280px] w-full items-center justify-center py-8 sm:min-h-[320px] lg:min-h-[360px] lg:justify-end lg:py-0"
      aria-hidden="true"
    >
      <div className="flex w-full max-w-[380px] flex-col items-center lg:items-end">
        <div
          style={fadeUp(0)}
          className="relative w-full max-w-[240px] sm:max-w-[260px] lg:max-w-[360px] xl:max-w-[380px]"
        >
          <Image
            src="/images/tm-naturals-logo.png"
            alt=""
            width={380}
            height={127}
            className="h-auto w-full object-contain"
          />
        </div>

        <div className="mt-8 flex items-center gap-2.5 lg:mt-10">
          <div
            className="h-px bg-[#8FC642]"
            style={lineStyle}
            aria-hidden="true"
          />
          <div
            className="h-1.5 w-1.5 shrink-0 rounded-sm bg-[#FFA304]"
            style={orangeAccentStyle}
            aria-hidden="true"
          />
        </div>

        <p
          style={fadeUp(220)}
          className="mt-6 text-center text-base font-medium text-[#010101] lg:text-right"
        >
          Better Choices Start Here.
        </p>

        <p
          style={fadeUp(300)}
          className="mt-2 max-w-[20rem] text-center text-sm leading-relaxed text-tm-muted-secondary lg:text-right"
        >
          We create straightforward wellness products with carefully selected
          ingredients designed to fit naturally into your everyday routine.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-5 lg:mt-10 lg:justify-end">
          {brandPillars.map((pillar, index) => (
            <span
              key={pillar.number}
              style={pillarStyle(index)}
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#010101] sm:text-[11px]"
            >
              {index > 0 && (
                <span
                  className="hidden text-[#010101]/15 sm:inline"
                  aria-hidden="true"
                >
                  |
                </span>
              )}
              <span>
                <span className="text-[#FFA304]">{pillar.number}</span>{" "}
                {pillar.label}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
