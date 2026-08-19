"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import type { Product } from "@/data/products";
import {
  formatPrice,
  getVariantUnits,
  hasPackUnits,
  isBestValueVariant,
} from "@/data/products";
import { getProductGalleryImages, getProductSlug } from "@/data/productDetails";
import { useCart } from "@/app/context/CartContext";
import ProductCardImageCarousel from "@/app/components/ProductCardImageCarousel";

interface ProductShoppingCardProps {
  product: Product;
  index: number;
  instanceId?: string;
}

const PURCHASE_PAUSE_MS = 8000;

export default function ProductShoppingCard({
  product,
  instanceId = "shop",
}: ProductShoppingCardProps) {
  const { addItem } = useCart();
  const cardRef = useRef<HTMLElement>(null);
  const purchasePauseTimeoutRef = useRef<number | null>(null);
  const quantityFieldId = `shop-quantity-${product.id}-${instanceId}`;
  const quantityLabelId = `${quantityFieldId}-label`;
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [purchasePaused, setPurchasePaused] = useState(false);

  const galleryImagesRaw = getProductGalleryImages(product.id);
  const galleryImages =
    galleryImagesRaw.length > 0 ? galleryImagesRaw : [product.image];

  const selectedVariant = product.variants[selectedVariantIndex];
  const showPackUnits = hasPackUnits(product);
  const unitsPerPack = selectedVariant ? getVariantUnits(selectedVariant) : 1;
  const totalUnits = unitsPerPack * quantity;
  const lineSubtotal = selectedVariant ? selectedVariant.price * quantity : 0;
  const description = product.description ?? product.subtitle;

  const pauseForPurchase = useCallback(() => {
    setPurchasePaused(true);

    if (purchasePauseTimeoutRef.current !== null) {
      window.clearTimeout(purchasePauseTimeoutRef.current);
    }

    purchasePauseTimeoutRef.current = window.setTimeout(() => {
      setPurchasePaused(false);
      purchasePauseTimeoutRef.current = null;
    }, PURCHASE_PAUSE_MS);
  }, []);

  const handleQuantityChange = (delta: number) => {
    pauseForPurchase();
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
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[rgba(1,1,1,0.08)] bg-white shadow-[0_8px_28px_rgba(0,0,0,0.05)] transition-shadow duration-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)]"
    >
      <div className="relative h-[225px] min-h-[225px] max-h-[225px] w-full shrink-0 overflow-hidden bg-[#FAFAFA] md:h-[240px] md:min-h-[240px] md:max-h-[240px] lg:h-[260px] lg:min-h-[260px] lg:max-h-[260px]">
        <ProductCardImageCarousel
          images={galleryImages}
          alt={product.name}
          instanceId={`${product.id}-${instanceId}`}
          externalPause={purchasePaused}
        />
      </div>

      <div className="flex flex-1 flex-col p-4 md:p-5 lg:p-6">
        <h3 className="min-h-[2.75rem] text-lg font-semibold leading-snug text-[#010101] md:min-h-[3.25rem] md:text-xl line-clamp-2">
          {product.name}
        </h3>

        <p className="mt-2 min-h-[2.5rem] text-sm leading-relaxed text-[#686868] line-clamp-2 md:min-h-[2.75rem]">
          {description}
        </p>

        <Link
          href={`/products/${getProductSlug(product.id)}`}
          className="group/details mt-4 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-[#8FC642] bg-[#8FC642] px-4 text-sm font-semibold text-[#010101] transition-all duration-300 hover:border-[#8FC642] hover:bg-white focus-visible:border-[#8FC642] focus-visible:bg-white"
        >
          View Product Details
          <span
            className="text-[#010101] transition-all duration-300 group-hover/details:translate-x-[3px] group-hover/details:text-[#8FC642] group-focus-visible/details:translate-x-[3px] group-focus-visible/details:text-[#8FC642]"
            aria-hidden="true"
          >
            →
          </span>
        </Link>

        <div className="mt-4 md:mt-5">
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
                  onClick={() => {
                    pauseForPurchase();
                    setSelectedVariantIndex(variantIndex);
                  }}
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

        <div className="mt-auto pt-4 md:pt-5">
          {selectedVariant && (
            <p className="text-2xl font-semibold text-[#010101]">
              {formatPrice(selectedVariant.price)}
            </p>
          )}

          <div className="mt-4" role="group" aria-labelledby={quantityLabelId}>
            <p
              id={quantityLabelId}
              className="text-xs font-bold uppercase tracking-[0.12em] text-[#010101]"
            >
              Quantity
            </p>
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[rgba(1,1,1,0.15)] bg-white text-lg leading-none text-[#010101] transition-colors hover:border-[#8FC642] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <div
                id={quantityFieldId}
                aria-live="polite"
                aria-label="Quantity of packs"
                className="inline-flex h-11 w-12 shrink-0 items-center justify-center rounded-lg border border-[rgba(1,1,1,0.15)] bg-white text-center text-sm font-semibold leading-none text-[#010101]"
              >
                {quantity}
              </div>
              <button
                type="button"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 10}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[rgba(1,1,1,0.15)] bg-white text-lg leading-none text-[#010101] transition-colors hover:border-[#8FC642] disabled:cursor-not-allowed disabled:opacity-40"
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
