"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "@/data/products";
import ProductCard from "@/app/components/ProductCard";

const STAGGER_MS = [0, 70, 140, 210, 280];
const ENTER_DURATION_MS = 550;

interface BestSellersGridProps {
  products: Product[];
}

function gridItemClass(index: number, total: number): string {
  const base = "min-w-0 md:col-span-1 lg:col-span-2";
  if (total !== 5) return base;

  if (index === 3) return `${base} lg:col-start-2`;
  if (index === 4) return `${base} lg:col-start-4`;
  return base;
}

export default function BestSellersGrid({ products }: BestSellersGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
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

    const node = gridRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const show = visible || reducedMotion;

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6 lg:gap-8"
    >
      {products.map((product, index) => (
        <div
          key={product.id}
          className={gridItemClass(index, products.length)}
          style={
            reducedMotion
              ? undefined
              : {
                  opacity: show ? 1 : 0,
                  transform: show ? "translateY(0)" : "translateY(16px)",
                  transitionProperty: "opacity, transform",
                  transitionDuration: `${ENTER_DURATION_MS}ms`,
                  transitionTimingFunction: "ease-out",
                  transitionDelay: `${STAGGER_MS[index] ?? index * 70}ms`,
                }
          }
        >
          <ProductCard
            product={product}
            index={index}
            featured={index === 0}
          />
        </div>
      ))}
    </div>
  );
}
