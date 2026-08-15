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

interface ProductShoppingRowProps {
  product: Product;
  index: number;
}

export default function ProductShoppingRow({
  product,
  index,
}: ProductShoppingRowProps) {
  const { addItem } = useCart();
  const rowRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const reversed = index % 2 === 1;
  const productNumber = String(index + 1).padStart(2, "0");
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

    const node = rowRef.current;
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

  const enterStyle = (delay: number) =>
    reducedMotion
      ? undefined
      : {
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(16px)",
          transitionProperty: "opacity, transform",
          transitionDuration: "600ms",
          transitionTimingFunction: "ease-out",
          transitionDelay: `${delay}ms`,
        };

  const detailsEnterStyle = (delay: number) =>
    reducedMotion
      ? undefined
      : {
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(12px)",
          transitionProperty: "opacity, transform",
          transitionDuration: "600ms",
          transitionTimingFunction: "ease-out",
          transitionDelay: `${delay}ms`,
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
    <article ref={rowRef} className="min-w-0">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12 xl:gap-16">
        <div
          className={`relative order-1 min-w-0 lg:col-span-5 ${
            reversed ? "lg:order-2" : "lg:order-1"
          }`}
          style={enterStyle(0)}
        >
          <span className="absolute left-0 top-0 z-10 text-xs font-medium tracking-[0.18em] text-[#FFA304]">
            {productNumber}
          </span>

          <div className="shop-product-image relative mx-auto aspect-square w-full max-w-[420px] transition-transform duration-[400ms] ease-out lg:max-w-none">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(143,198,66,0.05)_0%,rgba(143,198,66,0)_70%)]"
            />
            <Image
              src={product.image}
              alt={product.name}
              fill
              quality={95}
              sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 520px"
              className="relative z-10 object-contain p-6 sm:p-8 lg:p-10"
            />
          </div>
        </div>

        <div
          className={`order-2 min-w-0 lg:col-span-7 ${
            reversed ? "lg:order-1" : "lg:order-2"
          }`}
          style={detailsEnterStyle(80)}
        >
          <h3 className="text-2xl font-semibold leading-snug text-[#010101] md:text-3xl">
            {product.name}
          </h3>

          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#686868] md:text-base">
            {product.subtitle}
          </p>

          {product.description && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setDetailsOpen((open) => !open)}
                className="text-sm font-medium text-[#010101] transition-colors hover:text-[#8FC642]"
                aria-expanded={detailsOpen}
              >
                Product Details {detailsOpen ? "↑" : "→"}
              </button>
              {detailsOpen && (
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#686868]">
                  {description}
                </p>
              )}
            </div>
          )}

          <div className="mt-8">
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
                    className={`relative rounded-lg border px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide transition-colors duration-200 sm:px-4 sm:text-sm ${
                      isSelected
                        ? "border-[#010101] bg-[#010101] text-white"
                        : "border-[rgba(1,1,1,0.15)] bg-white text-[#010101] hover:border-[rgba(1,1,1,0.25)]"
                    }`}
                    aria-pressed={isSelected}
                  >
                    {isSelected && (
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-px left-3 right-3 h-0.5 bg-[#8FC642] sm:left-4 sm:right-4"
                      />
                    )}
                    <span className="flex flex-wrap items-center gap-2">
                      {variant.name}
                      {isBestValue && (
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wide ${
                            isSelected ? "text-[#8FC642]" : "text-[#8FC642]"
                          }`}
                        >
                          Best Value
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedVariant && (
              <p className="mt-3 text-sm text-[#686868]">
                Selected:{" "}
                <span className="font-medium text-[#010101]">
                  {selectedVariant.name}
                </span>
              </p>
            )}
          </div>

          {selectedVariant && (
            <p className="mt-6 text-2xl font-semibold text-[#010101] md:text-3xl">
              {formatPrice(selectedVariant.price)}
            </p>
          )}

          <div className="mt-6">
            <label
              htmlFor={`shop-quantity-${product.id}`}
              className="text-xs font-bold uppercase tracking-[0.12em] text-[#010101]"
            >
              Quantity
            </label>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[rgba(1,1,1,0.15)] bg-white text-lg text-[#010101] transition-colors hover:border-[#8FC642] disabled:cursor-not-allowed disabled:opacity-40"
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
                className="h-11 w-14 rounded-lg border border-[rgba(1,1,1,0.15)] bg-white text-center text-sm font-semibold text-[#010101] outline-none focus:border-[#8FC642] focus:ring-1 focus:ring-[#8FC642]/30"
                aria-label="Quantity of packs"
              />
              <button
                type="button"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 10}
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[rgba(1,1,1,0.15)] bg-white text-lg text-[#010101] transition-colors hover:border-[#8FC642] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {showPackUnits && selectedVariant && (
              <p className="mt-2 text-sm text-[#686868]">
                {selectedVariant.name} × {quantity} = {totalUnits} total units
              </p>
            )}
          </div>

          {selectedVariant && (
            <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-4">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#010101]">
                Total
              </span>
              <span className="text-xl font-semibold text-[#010101]">
                {formatPrice(lineSubtotal)}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!selectedVariant}
            className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center rounded-xl bg-[#010101] px-4 text-center text-xs font-bold uppercase tracking-[0.12em] leading-none text-white transition-colors duration-300 hover:bg-[#8FC642] hover:text-[#010101] disabled:opacity-50"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
