"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/data/products";
import {
  formatPrice,
  getVariantUnits,
  hasPackUnits,
  isBestValueVariant,
} from "@/data/products";
import { useCart } from "@/app/context/CartContext";

interface ProductShoppingCardProps {
  product: Product;
  index: number;
}

export default function ProductShoppingCard({
  product,
  index,
}: ProductShoppingCardProps) {
  const { addItem } = useCart();
  const cardRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = product.variants[selectedVariantIndex];
  const showPackUnits = hasPackUnits(product);
  const unitsPerPack = selectedVariant ? getVariantUnits(selectedVariant) : 1;
  const totalUnits = unitsPerPack * quantity;
  const lineSubtotal = selectedVariant ? selectedVariant.price * quantity : 0;
  const description = product.description ?? product.subtitle;

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

    const node = cardRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -4% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const show = visible || reducedMotion;

  const enterStyle = reducedMotion
    ? undefined
    : {
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(14px)",
        transitionProperty: "opacity, transform",
        transitionDuration: "550ms",
        transitionTimingFunction: "ease-out",
        transitionDelay: `${index * 70}ms`,
      };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + delta)));
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addItem({
      productId: product.id,
      productName: product.name,
      image: product.image,
      variantId: selectedVariant.id,
      variantName: selectedVariant.name,
      unitsPerPack: getVariantUnits(selectedVariant),
      stripePriceId: selectedVariant.stripePriceId,
      unitPrice: selectedVariant.price,
      quantity,
    });

    setQuantity(1);
  };

  return (
    <article
      ref={cardRef}
      style={enterStyle}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[rgba(1,1,1,0.08)] bg-white shadow-[0_8px_28px_rgba(0,0,0,0.05)] transition-shadow duration-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)]"
    >
      <div className="relative h-[240px] shrink-0 overflow-hidden bg-[#FAFAFA] md:h-[260px]">
        <div className="relative h-full w-full transition-transform duration-300 ease-out motion-safe:group-hover:-translate-y-1">
          <Image
            src={product.image}
            alt={product.name}
            fill
            quality={95}
            sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 30vw"
            className="object-contain p-5 sm:p-6"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="min-h-[3.25rem] text-lg font-semibold leading-snug text-[#010101] md:text-xl line-clamp-2">
          {product.name}
        </h3>

        <p className="mt-2 min-h-[2.75rem] text-sm leading-relaxed text-[#686868] line-clamp-2">
          {description}
        </p>

        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#010101]">
            Choose Your Pack
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.variants.map((variant, variantIndex) => {
              const isSelected = selectedVariantIndex === variantIndex;
              const isBestValue = isBestValueVariant(
                variantIndex,
                product.variants,
              );

              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedVariantIndex(variantIndex)}
                  className={`relative rounded-lg border px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide transition-colors duration-200 ${
                    isSelected
                      ? "border-[#010101] bg-[#010101] text-white"
                      : "border-[rgba(1,1,1,0.15)] bg-white text-[#010101] hover:border-[rgba(1,1,1,0.25)]"
                  }`}
                  aria-pressed={isSelected}
                >
                  {isSelected && (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-px left-3 right-3 h-0.5 bg-[#8FC642]"
                    />
                  )}
                  <span className="flex flex-wrap items-center gap-1.5">
                    {variant.name}
                    {isBestValue && (
                      <span className="text-[10px] font-bold uppercase tracking-wide text-[#8FC642]">
                        Best Value
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-auto pt-5">
          {selectedVariant && (
            <p className="text-2xl font-semibold text-[#010101]">
              {formatPrice(selectedVariant.price)}
            </p>
          )}

          <div className="mt-4">
            <label
              htmlFor={`shop-quantity-${product.id}`}
              className="text-xs font-bold uppercase tracking-[0.12em] text-[#010101]"
            >
              Quantity
            </label>
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(1,1,1,0.15)] bg-white text-lg text-[#010101] transition-colors hover:border-[#8FC642] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                id={`shop-quantity-${product.id}`}
                type="number"
                min={1}
                max={10}
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) {
                    setQuantity(Math.max(1, Math.min(10, val)));
                  }
                }}
                className="h-10 w-12 rounded-lg border border-[rgba(1,1,1,0.15)] bg-white text-center text-sm font-semibold text-[#010101] outline-none focus:border-[#8FC642] focus:ring-1 focus:ring-[#8FC642]/30"
                aria-label="Quantity of packs"
              />
              <button
                type="button"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 10}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(1,1,1,0.15)] bg-white text-lg text-[#010101] transition-colors hover:border-[#8FC642] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {showPackUnits && selectedVariant && (
              <p className="mt-2 text-xs text-[#686868]">
                {selectedVariant.name} × {quantity} = {totalUnits} total units
              </p>
            )}
          </div>

          {selectedVariant && (
            <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-3">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#010101]">
                Total
              </span>
              <span className="text-lg font-semibold text-[#010101]">
                {formatPrice(lineSubtotal)}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!selectedVariant}
            className="mt-4 inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-[#010101] px-4 text-center text-xs font-bold uppercase tracking-[0.12em] leading-none text-white transition-colors duration-300 hover:bg-[#8FC642] hover:text-[#010101] disabled:opacity-50"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
