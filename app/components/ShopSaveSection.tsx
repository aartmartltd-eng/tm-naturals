"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "@/data/products";
import ProductShoppingCard from "@/app/components/ProductShoppingCard";

interface ShopSaveSectionProps {
  products: Product[];
}

const AUTOPLAY_MS = 5000;
const RESUME_AFTER_INTERACTION_MS = 8000;
const MOBILE_MAX_WIDTH = 767;

function getDesktopGridClass(index: number): string {
  if (index < 3) return "xl:col-span-2";
  if (index === 3) return "xl:col-span-2 xl:col-start-2";
  return "xl:col-span-2 xl:col-start-4";
}

function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches;
}

export default function ShopSaveSection({ products }: ShopSaveSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoplayPausedRef = useRef(false);
  const resumeTimeoutRef = useRef<number | null>(null);
  const autoplayIntervalRef = useRef<number | null>(null);
  const activeIndexRef = useRef(0);
  const reducedMotionRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);

  const syncActiveIndexFromScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || container.clientWidth === 0) return;

    const index = Math.round(container.scrollLeft / container.clientWidth);
    const clamped = Math.max(0, Math.min(products.length - 1, index));
    activeIndexRef.current = clamped;
    setActiveIndex(clamped);
  }, [products.length]);

  const scrollToIndex = useCallback(
    (index: number, smooth = true) => {
      const container = scrollRef.current;
      if (!container) return;

      const clamped = Math.max(0, Math.min(products.length - 1, index));
      const prefersReduced = reducedMotionRef.current;

      container.scrollTo({
        left: container.clientWidth * clamped,
        behavior: smooth && !prefersReduced ? "smooth" : "auto",
      });

      activeIndexRef.current = clamped;
      setActiveIndex(clamped);
    },
    [products.length],
  );

  const pauseAutoplay = useCallback((resumeAfterMs = RESUME_AFTER_INTERACTION_MS) => {
    autoplayPausedRef.current = true;

    if (resumeTimeoutRef.current !== null) {
      window.clearTimeout(resumeTimeoutRef.current);
    }

    resumeTimeoutRef.current = window.setTimeout(() => {
      autoplayPausedRef.current = false;
      resumeTimeoutRef.current = null;
    }, resumeAfterMs);
  }, []);

  const handleUserInteraction = useCallback(() => {
    if (!isMobileViewport()) return;
    pauseAutoplay();
  }, [pauseAutoplay]);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const syncReducedMotion = () => {
      reducedMotionRef.current = reducedMotionQuery.matches;
    };

    syncReducedMotion();
    reducedMotionQuery.addEventListener("change", syncReducedMotion);

    return () => {
      reducedMotionQuery.removeEventListener("change", syncReducedMotion);
    };
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const onScroll = () => {
      syncActiveIndexFromScroll();
    };

    syncActiveIndexFromScroll();
    container.addEventListener("scroll", onScroll, { passive: true });

    return () => container.removeEventListener("scroll", onScroll);
  }, [syncActiveIndexFromScroll]);

  useEffect(() => {
    const startAutoplay = () => {
      if (autoplayIntervalRef.current !== null) {
        window.clearInterval(autoplayIntervalRef.current);
      }

      if (!isMobileViewport() || reducedMotionRef.current) return;

      autoplayIntervalRef.current = window.setInterval(() => {
        if (
          autoplayPausedRef.current ||
          document.hidden ||
          !isMobileViewport() ||
          reducedMotionRef.current
        ) {
          return;
        }

        const nextIndex = (activeIndexRef.current + 1) % products.length;
        scrollToIndex(nextIndex, true);
      }, AUTOPLAY_MS);
    };

    const stopAutoplay = () => {
      if (autoplayIntervalRef.current !== null) {
        window.clearInterval(autoplayIntervalRef.current);
        autoplayIntervalRef.current = null;
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    };

    const mobileQuery = window.matchMedia(
      `(max-width: ${MOBILE_MAX_WIDTH}px)`,
    );
    const onViewportChange = () => {
      stopAutoplay();
      if (mobileQuery.matches && !reducedMotionRef.current) {
        startAutoplay();
      }
    };

    startAutoplay();
    document.addEventListener("visibilitychange", onVisibilityChange);
    mobileQuery.addEventListener("change", onViewportChange);

    return () => {
      stopAutoplay();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      mobileQuery.removeEventListener("change", onViewportChange);

      if (resumeTimeoutRef.current !== null) {
        window.clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, [products.length, scrollToIndex]);

  const goToPrevious = useCallback(() => {
    if (!isMobileViewport()) return;
    handleUserInteraction();
    const previousIndex =
      (activeIndexRef.current - 1 + products.length) % products.length;
    scrollToIndex(previousIndex, true);
  }, [handleUserInteraction, products.length, scrollToIndex]);

  const goToNext = useCallback(() => {
    if (!isMobileViewport()) return;
    handleUserInteraction();
    const nextIndex = (activeIndexRef.current + 1) % products.length;
    scrollToIndex(nextIndex, true);
  }, [handleUserInteraction, products.length, scrollToIndex]);

  return (
    <>
      <div className="md:hidden">
        <div className="relative">
          <CarouselNavButton
            direction="previous"
            onClick={goToPrevious}
            ariaLabel="Previous product"
          />
          <CarouselNavButton
            direction="next"
            onClick={goToNext}
            ariaLabel="Next product"
          />

          <div className="overflow-hidden ml-[60px] mr-[60px]">
            <div
              ref={scrollRef}
              className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              aria-label="Shop products carousel"
              onTouchStart={handleUserInteraction}
              onPointerDown={handleUserInteraction}
              onFocusCapture={handleUserInteraction}
            >
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="min-w-full w-full shrink-0 snap-start snap-always"
                >
                  <ProductShoppingCard product={product} index={index} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="mt-5 flex justify-center gap-2"
          role="tablist"
          aria-label="Choose product"
        >
          {products.map((product, index) => (
            <button
              key={product.id}
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              aria-label={`Go to product ${index + 1}`}
              onClick={() => {
                handleUserInteraction();
                scrollToIndex(index, true);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ease-out ${
                activeIndex === index
                  ? "w-5 bg-[#8FC642]"
                  : "w-1.5 bg-[rgba(1,1,1,0.18)]"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="hidden gap-6 md:grid md:grid-cols-2 lg:gap-8 xl:grid-cols-6">
        {products.map((product, index) => (
          <div
            key={product.id}
            className={`min-w-0 ${getDesktopGridClass(index)}`}
          >
            <ProductShoppingCard product={product} index={index} />
          </div>
        ))}
      </div>
    </>
  );
}

function CarouselNavButton({
  direction,
  onClick,
  ariaLabel,
}: {
  direction: "previous" | "next";
  onClick: () => void;
  ariaLabel: string;
}) {
  const isPrevious = direction === "previous";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`group absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(1,1,1,0.15)] bg-[rgba(255,255,255,0.88)] text-[#010101] shadow-[0_2px_14px_rgba(1,1,1,0.08)] backdrop-blur-[6px] transition-all duration-200 hover:bg-[#010101] hover:text-white active:bg-[#010101] active:text-white ${
        isPrevious ? "left-1" : "right-1"
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-[5px] rounded-full border border-transparent ${
          isPrevious
            ? "border-l-[#8FC642] border-t-[#8FC642]"
            : "border-r-[#8FC642] border-b-[#8FC642]"
        }`}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute h-2 w-0.5 rounded-full bg-[#8FC642] transition-colors duration-200 group-hover:bg-[#8FC642] ${
          isPrevious
            ? "left-2 top-1/2 -translate-y-1/2"
            : "right-2 top-1/2 -translate-y-1/2"
        }`}
      />
      {isPrevious ? (
        <ChevronLeftIcon className="relative z-[1] transition-transform duration-200 group-hover:-translate-x-0.5 group-active:-translate-x-0.5" />
      ) : (
        <ChevronRightIcon className="relative z-[1] transition-transform duration-200 group-hover:translate-x-0.5 group-active:translate-x-0.5" />
      )}
    </button>
  );
}

function ChevronLeftIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className={`h-[18px] w-[18px] ${className}`}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.5 6.5-5.5 5.5 5.5 5.5" />
    </svg>
  );
}

function ChevronRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className={`h-[18px] w-[18px] ${className}`}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m9.5 6.5 5.5 5.5-5.5 5.5" />
    </svg>
  );
}
