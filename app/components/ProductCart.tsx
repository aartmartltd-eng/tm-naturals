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

interface ProductCartProps {
  product: Product;
  onAdded?: () => void;
  compact?: boolean;
}

export default function ProductCart({
  product,
  onAdded,
  compact = false,
}: ProductCartProps) {
  const { addItem } = useCart();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = product.variants[selectedVariantIndex];
  const showPackUnits = hasPackUnits(product);
  const unitsPerPack = selectedVariant ? getVariantUnits(selectedVariant) : 1;
  const totalUnits = unitsPerPack * quantity;
  const lineSubtotal = selectedVariant
    ? selectedVariant.price * quantity
    : 0;

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
    onAdded?.();
  };

  return (
    <div className={compact ? "space-y-4" : "space-y-5"}>
      {!compact && (
        <p className="text-sm text-tm-muted text-center">{product.subtitle}</p>
      )}

      <fieldset>
        <legend className="text-xs font-bold uppercase tracking-[0.1em] text-tm-black mb-3">
          {showPackUnits ? "Choose Your Pack" : "Select Option"}
        </legend>
        <div className="space-y-2">
          {product.variants.map((variant, index) => {
            const isSelected = selectedVariantIndex === index;
            const isBestValue = isBestValueVariant(index, product.variants);

            return (
              <label
                key={variant.id}
                className={`relative flex items-center justify-between gap-3 p-3.5 rounded-lg border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "border-tm-green bg-tm-green/10"
                    : "border-tm-border hover:border-tm-green/50 bg-tm-white"
                }`}
              >
                <span className="flex items-center gap-3 min-w-0">
                  <input
                    type="radio"
                    name={`variant-${product.id}`}
                    value={variant.id}
                    checked={isSelected}
                    onChange={() => setSelectedVariantIndex(index)}
                    className="w-4 h-4 shrink-0 accent-tm-green"
                  />
                  <span className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
                    <span className="text-sm font-semibold text-tm-black">
                      {variant.name}
                    </span>
                    {isBestValue && (
                      <span className="inline-flex w-fit items-center rounded-md bg-tm-orange px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-tm-black">
                        Best Value
                      </span>
                    )}
                  </span>
                </span>
                <span
                  className={`text-sm font-bold shrink-0 ${
                    isSelected ? "text-tm-green" : "text-tm-black"
                  }`}
                >
                  {formatPrice(variant.price)}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div>
        <label
          htmlFor={`quantity-${product.id}`}
          className="text-xs font-bold uppercase tracking-[0.1em] text-tm-black mb-2 block"
        >
          Quantity
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-tm-border bg-tm-white text-tm-black hover:border-tm-green disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input
            id={`quantity-${product.id}`}
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
            className="w-14 h-9 text-center rounded-lg border border-tm-border bg-tm-white text-tm-black text-sm font-semibold focus:border-tm-green focus:ring-1 focus:ring-tm-green/30 outline-none"
            aria-label="Quantity of packs"
          />
          <button
            type="button"
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= 10}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-tm-border bg-tm-white text-tm-black hover:border-tm-green disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        {showPackUnits && selectedVariant && (
          <p className="mt-2 text-sm text-tm-muted">
            {selectedVariant.name} × {quantity} = {totalUnits} total units
          </p>
        )}
      </div>

      {selectedVariant && (
        <div className="rounded-lg bg-tm-light-gray px-4 py-3.5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-tm-muted">Subtotal</span>
            <span className="text-lg font-bold text-tm-black">
              {formatPrice(lineSubtotal)}
            </span>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!selectedVariant}
        className="w-full py-3 px-4 rounded-lg bg-tm-black text-white text-xs font-bold tracking-[0.12em] uppercase hover:bg-tm-green hover:text-tm-black transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-tm-orange focus-visible:ring-offset-2 disabled:opacity-50"
      >
        Add to Cart
      </button>
    </div>
  );
}
