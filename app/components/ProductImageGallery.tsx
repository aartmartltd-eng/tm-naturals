"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import CarouselNavButton from "@/app/components/CarouselNavButton";

const AUTOPLAY_MS = 4500;
const RESUME_AFTER_INTERACTION_MS = 6000;

interface ProductImageGalleryProps {
  images: string[];
  displayName: string;
}

export default function ProductImageGallery({
  images,
  displayName,
}: ProductImageGalleryProps) {
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
  }, [mounted, hasMultiple, galleryImages.length, scrollToIndex]);

  if (galleryImages.length === 0) {
    return null;
  }

  return (
    <div
      className="w-full max-w-full overflow-x-clip"
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
    >
      <div className="relative mx-auto w-full max-w-[560px]">
        {hasMultiple && (
          <>
            <CarouselNavButton
              direction="previous"
              onClick={goToPrevious}
              ariaLabel="Previous product image"
              className="left-1 sm:left-0 lg:-left-2"
            />
            <CarouselNavButton
              direction="next"
              onClick={goToNext}
              ariaLabel="Next product image"
              className="right-1 sm:right-0 lg:-right-2"
            />
          </>
        )}

        <div className="mx-10 sm:mx-14 lg:mx-16">
          <div className="relative aspect-square w-full min-h-[280px] max-h-[min(520px,70vh)] overflow-hidden rounded-2xl bg-tm-white sm:min-h-[320px]">
            <div
              ref={scrollRef}
              className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              aria-label={`${displayName} image gallery`}
              onTouchStart={handleUserInteraction}
              onPointerDown={handleUserInteraction}
              onFocusCapture={handleUserInteraction}
            >
              {galleryImages.map((src, index) => (
                <div
                  key={src}
                  className="relative h-full min-w-full w-full shrink-0 snap-start snap-always"
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={src}
                      alt={
                        index === 0
                          ? displayName
                          : `${displayName} view ${index + 1}`
                      }
                      fill
                      priority={index === 0}
                      loading={index === 0 ? undefined : "lazy"}
                      quality={95}
                      sizes="(max-width: 1024px) 92vw, 520px"
                      className="object-contain p-6 sm:p-8 lg:p-10"
                    />
                  </div>
                </div>
              ))}
            </div>
            {hasMultiple && (
              <p
                className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-black/5 bg-white/90 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-tm-black shadow-[0_2px_8px_rgba(0,0,0,0.06)] backdrop-blur-sm"
                aria-live="polite"
                aria-atomic="true"
              >
                {activeIndex + 1} / {galleryImages.length}
              </p>
            )}
          </div>
        </div>
      </div>

      {hasMultiple && (
        <>
          <div
            className="mt-5 flex justify-center gap-2"
            role="tablist"
            aria-label="Product image navigation"
          >
            {galleryImages.map((src, index) => (
              <button
                key={src}
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
                    ? "h-2 w-2 bg-tm-green"
                    : "h-2 w-2 bg-[rgba(1,1,1,0.15)]"
                }`}
              />
            ))}
          </div>

          <div
            className="mt-5 hidden justify-center gap-3 lg:flex"
            role="tablist"
            aria-label="Product image thumbnails"
          >
            {galleryImages.map((src, index) => (
              <button
                key={`thumb-${src}`}
                type="button"
                role="tab"
                aria-selected={activeIndex === index}
                aria-label={`Show image ${index + 1}`}
                onClick={() => {
                  handleUserInteraction();
                  scrollToIndex(index, true);
                }}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-tm-white transition-colors duration-200 ${
                  activeIndex === index
                    ? "border-tm-green"
                    : "border-black/10 hover:border-black/20"
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  quality={90}
                  sizes="64px"
                  loading="lazy"
                  className="object-contain p-1.5"
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
