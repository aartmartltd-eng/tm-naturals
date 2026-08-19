"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "@/data/products";
import CarouselNavButton from "@/app/components/CarouselNavButton";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      if (!container || products.length === 0 || container.clientWidth === 0) {
        return;
      }

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
    if (!mounted) return;

    const container = scrollRef.current;
    if (!container) return;

    const onScroll = () => {
      syncActiveIndexFromScroll();
    };

    syncActiveIndexFromScroll();
    container.addEventListener("scroll", onScroll, { passive: true });

    return () => container.removeEventListener("scroll", onScroll);
  }, [mounted, syncActiveIndexFromScroll]);

  useEffect(() => {
    if (!mounted || products.length <= 1) return;

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
          reducedMotionRef.current ||
          products.length <= 1
        ) {
          return;
        }

        const container = scrollRef.current;
        if (!container || container.clientWidth === 0) return;

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
  }, [mounted, products.length, scrollToIndex]);

  const goToPrevious = useCallback(() => {
    if (!mounted || !isMobileViewport() || products.length === 0) return;
    handleUserInteraction();
    const previousIndex =
      (activeIndexRef.current - 1 + products.length) % products.length;
    scrollToIndex(previousIndex, true);
  }, [mounted, handleUserInteraction, products.length, scrollToIndex]);

  const goToNext = useCallback(() => {
    if (!mounted || !isMobileViewport() || products.length === 0) return;
    handleUserInteraction();
    const nextIndex = (activeIndexRef.current + 1) % products.length;
    scrollToIndex(nextIndex, true);
  }, [mounted, handleUserInteraction, products.length, scrollToIndex]);

  return (
    <>
      <div className="md:hidden">
        <div className="relative">
          <CarouselNavButton
            direction="previous"
            onClick={goToPrevious}
            ariaLabel="Previous product"
            className="left-1"
          />
          <CarouselNavButton
            direction="next"
            onClick={goToNext}
            ariaLabel="Next product"
            className="right-1"
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
                  <ProductShoppingCard
                    product={product}
                    index={index}
                    instanceId="carousel"
                  />
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
            <ProductShoppingCard
              product={product}
              index={index}
              instanceId="grid"
            />
          </div>
        ))}
      </div>
    </>
  );
}

