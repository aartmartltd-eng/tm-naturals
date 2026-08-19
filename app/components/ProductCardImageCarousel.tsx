"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import CarouselNavButton from "@/app/components/CarouselNavButton";

const AUTOPLAY_MS = 4500;
const RESUME_AFTER_INTERACTION_MS = 6000;

interface ProductCardImageCarouselProps {
  images: string[];
  alt: string;
  instanceId: string;
  externalPause?: boolean;
}

export default function ProductCardImageCarousel({
  images,
  alt,
  instanceId,
  externalPause = false,
}: ProductCardImageCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoplayPausedRef = useRef(false);
  const resumeTimeoutRef = useRef<number | null>(null);
  const autoplayIntervalRef = useRef<number | null>(null);
  const activeIndexRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const isHoveredRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  const galleryImages = images.length > 0 ? images : [];
  const hasMultiple = galleryImages.length > 1;

  useEffect(() => {
    setMounted(true);
  }, []);

  const syncActiveIndexFromScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || container.clientWidth === 0) return;

    const index = Math.round(container.scrollLeft / container.clientWidth);
    const clamped = Math.max(0, Math.min(galleryImages.length - 1, index));
    activeIndexRef.current = clamped;
    setActiveIndex(clamped);
  }, [galleryImages.length]);

  const scrollToIndex = useCallback(
    (index: number, smooth = true) => {
      const container = scrollRef.current;
      if (
        !container ||
        galleryImages.length === 0 ||
        container.clientWidth === 0
      ) {
        return;
      }

      const clamped = Math.max(0, Math.min(galleryImages.length - 1, index));
      const prefersReduced = reducedMotionRef.current;

      container.scrollTo({
        left: container.clientWidth * clamped,
        behavior: smooth && !prefersReduced ? "smooth" : "auto",
      });

      activeIndexRef.current = clamped;
      setActiveIndex(clamped);
    },
    [galleryImages.length],
  );

  const pauseAutoplay = useCallback(
    (resumeAfterMs = RESUME_AFTER_INTERACTION_MS) => {
      autoplayPausedRef.current = true;

      if (resumeTimeoutRef.current !== null) {
        window.clearTimeout(resumeTimeoutRef.current);
      }

      resumeTimeoutRef.current = window.setTimeout(() => {
        autoplayPausedRef.current = false;
        resumeTimeoutRef.current = null;
      }, resumeAfterMs);
    },
    [],
  );

  const handleUserInteraction = useCallback(() => {
    pauseAutoplay();
  }, [pauseAutoplay]);

  const goToPrevious = useCallback(() => {
    if (!mounted || galleryImages.length === 0) return;
    handleUserInteraction();
    const previousIndex =
      (activeIndexRef.current - 1 + galleryImages.length) %
      galleryImages.length;
    scrollToIndex(previousIndex, true);
  }, [mounted, galleryImages.length, handleUserInteraction, scrollToIndex]);

  const goToNext = useCallback(() => {
    if (!mounted || galleryImages.length === 0) return;
    handleUserInteraction();
    const nextIndex = (activeIndexRef.current + 1) % galleryImages.length;
    scrollToIndex(nextIndex, true);
  }, [mounted, galleryImages.length, handleUserInteraction, scrollToIndex]);

  useEffect(() => {
    if (externalPause) {
      autoplayPausedRef.current = true;
    }
  }, [externalPause]);

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
    if (!mounted || !hasMultiple) return;

    const startAutoplay = () => {
      if (autoplayIntervalRef.current !== null) {
        window.clearInterval(autoplayIntervalRef.current);
      }

      if (reducedMotionRef.current) return;

      autoplayIntervalRef.current = window.setInterval(() => {
        if (
          autoplayPausedRef.current ||
          externalPause ||
          document.hidden ||
          isHoveredRef.current ||
          reducedMotionRef.current ||
          galleryImages.length <= 1
        ) {
          return;
        }

        const container = scrollRef.current;
        if (!container || container.clientWidth === 0) return;

        const nextIndex = (activeIndexRef.current + 1) % galleryImages.length;
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

    startAutoplay();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stopAutoplay();
      document.removeEventListener("visibilitychange", onVisibilityChange);

      if (resumeTimeoutRef.current !== null) {
        window.clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, [
    mounted,
    hasMultiple,
    galleryImages.length,
    scrollToIndex,
    externalPause,
  ]);

  if (galleryImages.length === 0) {
    return null;
  }

  return (
    <div
      className="relative h-full w-full"
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
    >
      {hasMultiple && (
        <>
          <CarouselNavButton
            direction="previous"
            onClick={goToPrevious}
            ariaLabel={`Previous ${alt} image`}
            compact
            className="left-1.5 sm:left-2"
          />
          <CarouselNavButton
            direction="next"
            onClick={goToNext}
            ariaLabel={`Next ${alt} image`}
            compact
            className="right-1.5 sm:right-2"
          />
        </>
      )}

      <div
        ref={scrollRef}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        aria-label={`${alt} images`}
        onTouchStart={handleUserInteraction}
        onPointerDown={handleUserInteraction}
      >
        {galleryImages.map((src, index) => (
          <div
            key={`${instanceId}-${src}`}
            className="relative h-full min-w-full w-full shrink-0 snap-start snap-always"
          >
            <div className="relative h-full w-full">
              <Image
                src={src}
                alt={index === 0 ? alt : `${alt} view ${index + 1}`}
                fill
                priority={index === 0}
                loading={index === 0 ? undefined : "lazy"}
                quality={95}
                sizes="(max-width: 768px) 86vw, (max-width: 1280px) 45vw, 30vw"
                className="object-contain p-4 md:p-5 lg:p-6"
              />
            </div>
          </div>
        ))}
      </div>

      {hasMultiple && (
        <div
          className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5"
          role="tablist"
          aria-label={`${alt} image dots`}
        >
          {galleryImages.map((src, index) => (
            <button
              key={`dot-${instanceId}-${src}`}
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              aria-label={`Go to image ${index + 1}`}
              onClick={() => {
                handleUserInteraction();
                scrollToIndex(index, true);
              }}
              className={`rounded-full transition-all duration-300 ease-out ${
                activeIndex === index
                  ? "h-1.5 w-1.5 bg-tm-green"
                  : "h-1.5 w-1.5 bg-[rgba(1,1,1,0.15)]"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
