"use client";

import { useEffect, useRef, useState } from "react";

const whyFeatures = [
  {
    num: "01",
    title: "Thoughtfully Selected",
    description:
      "Carefully chosen ingredients for simple daily wellness.",
  },
  {
    num: "02",
    title: "Clear & Honest",
    description:
      "Straightforward formulas and transparent product information.",
  },
  {
    num: "03",
    title: "Everyday Simplicity",
    description:
      "Products designed to fit naturally into your routine.",
  },
  {
    num: "04",
    title: "Quality Focused",
    description:
      "A premium approach to wellness without unnecessary complexity.",
  },
];

const STAGGER_MS = [0, 80, 160, 240];
const ENTER_DURATION_MS = 600;

export default function WhyFeaturesList() {
  const containerRef = useRef<HTMLDivElement>(null);
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

    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const show = visible || reducedMotion;

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full min-w-0 max-w-md lg:max-w-[560px] lg:pl-6 lg:justify-self-end"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-6 left-3 top-6 hidden w-px bg-[rgba(1,1,1,0.08)] md:block"
      />

      <ol className="relative list-none">
        {whyFeatures.map((feature, index) => (
          <li
            key={feature.num}
            className="why-principle-row group py-5 md:py-6"
            style={
              reducedMotion
                ? undefined
                : {
                    opacity: show ? 1 : 0,
                    transform: show ? "translateX(0)" : "translateX(10px)",
                    transitionProperty: "opacity, transform",
                    transitionDuration: `${ENTER_DURATION_MS}ms`,
                    transitionTimingFunction: "ease-out",
                    transitionDelay: `${STAGGER_MS[index]}ms`,
                  }
            }
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="why-principle-num w-6 shrink-0 text-sm font-semibold tracking-wide text-[#FFA304] md:text-base">
                {feature.num}
              </span>
              <span
                aria-hidden="true"
                className="why-principle-connector h-px w-6 shrink-0 bg-[#8FC642] transition-all duration-300 ease-out md:w-7"
              />
              <h3 className="why-principle-title min-w-0 text-xl font-semibold text-[#010101] transition-transform duration-300 ease-out md:text-2xl">
                {feature.title}
              </h3>
            </div>
            <p className="why-principle-desc mt-3 max-w-sm pl-9 text-sm leading-relaxed text-tm-muted-secondary transition-colors duration-300 ease-out md:pl-[3.75rem] md:text-base">
              {feature.description}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
