"use client";

import { useState } from "react";
import type { Product } from "@/data/products";
import {
  formatPrice,
  getVariantUnits,
  hasPackUnits,
  isBestValueVariant,
} from "@/data/products";
import { useCart } from "@/app/context/CartContext";

interface ProductPurchasePanelProps {
  product: Product;
  quantityFieldId?: string;
}

export default function ProductPurchasePanel({
  product,
  quantityFieldId,
}: ProductPurchasePanelProps) {
  const { addItem } = useCart();
  const fieldId = quantityFieldId ?? `product-quantity-${product.id}`;
  const quantityLabelId = `${fieldId}-label`;
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = product.variants[selectedVariantIndex];
  const showPackUnits = hasPackUnits(product);
  const unitsPerPack = selectedVariant ? getVariantUnits(selectedVariant) : 1;
  const totalUnits = unitsPerPack * quantity;
  const lineSubtotal = selectedVariant ? selectedVariant.price * quantity : 0;

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
    <div className="rounded-2xl border border-[rgba(1,1,1,0.08)] bg-white p-5 shadow-[0_8px_28px_rgba(0,0,0,0.05)] sm:p-6 lg:p-7">
      <div className="flex flex-col">
        <div className="order-2 min-w-0 lg:order-1">
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
                  className={`relative min-h-[44px] rounded-lg border px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide transition-colors duration-200 ${
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

        {selectedVariant && (
          <p className="order-1 mb-5 text-3xl font-semibold text-[#010101] sm:text-4xl lg:order-2 lg:mb-0 lg:mt-5">
            {formatPrice(selectedVariant.price)}
          </p>
        )}

        <div
          className="order-3 mt-5 min-w-0"
          role="group"
          aria-labelledby={quantityLabelId}
        >
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
              id={fieldId}
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
          <div className="order-4 mt-5 flex min-w-0 items-center justify-between gap-3 border-t border-black/10 pt-4">
            <span className="shrink-0 text-xs font-bold uppercase tracking-[0.12em] text-[#010101]">
              Subtotal
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
          className="order-5 mt-5 inline-flex min-h-[52px] w-full items-center justify-center rounded-lg bg-[#010101] px-4 text-center text-xs font-bold uppercase tracking-[0.12em] leading-none text-white transition-colors duration-300 hover:bg-[#8FC642] hover:text-[#010101] disabled:opacity-50 lg:min-h-[48px]"
        >
          Add to Cart
        </button>

        <p className="order-6 mt-4 text-center text-xs text-[#686868]">
          Secure checkout powered by Stripe
        </p>
      </div>
    </div>
  );
}
