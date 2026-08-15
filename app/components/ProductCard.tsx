"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Product } from "@/data/products";
import ProductCart from "@/app/components/ProductCart";

interface ProductCardProps {
  product: Product;
  index?: number;
  featured?: boolean;
}

export default function ProductCard({
  product,
  index = 0,
  featured = false,
}: ProductCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const accentGreen = index % 2 === 0;
  const productNumber = String(index + 1).padStart(2, "0");

  useEffect(() => {
    if (!modalOpen) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [modalOpen]);

  return (
    <>
      <article className="product-showcase-card group flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(1,1,1,0.08)] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-[border-color,box-shadow] duration-300 ease-out hover:border-[rgba(1,1,1,0.14)]">
        <div className="relative h-[260px] overflow-hidden sm:h-[280px] md:h-[320px] xl:h-[350px]">
          <div
            className={`pointer-events-none absolute inset-0 ${
              accentGreen
                ? "bg-[radial-gradient(circle_at_center,rgba(143,198,66,0.08)_0%,rgba(143,198,66,0)_68%)]"
                : "bg-[radial-gradient(circle_at_center,rgba(255,163,4,0.06)_0%,rgba(255,163,4,0)_68%)]"
            }`}
          />

          <div className="absolute left-4 top-4 z-20 flex items-center gap-2">
            <span className="product-showcase-num text-xs font-medium tracking-[0.18em] text-[#010101]/35 transition-colors duration-300 ease-out">
              {productNumber}
            </span>
            <span
              aria-hidden="true"
              className="h-1 w-3 rounded-full bg-[#FFA304]"
            />
          </div>

          {featured && (
            <span className="absolute right-4 top-4 z-20 text-[10px] font-bold uppercase tracking-[0.14em] text-[#8FC642]">
              Best Seller
            </span>
          )}

          <div className="product-showcase-image relative z-10 h-full w-full transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.025]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              quality={95}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
              className="object-contain p-8 sm:p-10"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col px-5 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#686868]">
            {product.subtitle}
          </p>
          <h3 className="mt-2 line-clamp-3 text-lg font-semibold leading-snug text-[#010101] md:text-xl">
            {product.name}
          </h3>
          <p className="mt-3 text-base font-semibold text-[#010101]">
            {product.priceDisplay}
          </p>

          <div className="mt-5 mt-auto w-full">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="h-12 w-full inline-flex items-center justify-center rounded-xl bg-[#010101] px-4 text-center text-xs font-bold uppercase leading-none tracking-wide text-white transition-colors duration-300 hover:bg-[#8FC642] hover:text-[#010101]"
            >
              Select Options
            </button>
          </div>
        </div>
      </article>

      {modalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`product-modal-${product.id}`}
        >
          <button
            type="button"
            className="absolute inset-0 bg-tm-black/50 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
            aria-label="Close product options"
          />

          <div className="relative w-full sm:max-w-lg bg-tm-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-tm-white border-b border-tm-border px-6 py-4 flex items-center justify-between z-10">
              <h2
                id={`product-modal-${product.id}`}
                className="font-display text-xl text-tm-black font-bold pr-4"
              >
                {product.name}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg hover:bg-tm-light-gray transition-colors text-tm-muted"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="relative w-full aspect-square max-w-[240px] mx-auto mb-8 bg-tm-light-gray rounded-xl overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  quality={90}
                  sizes="240px"
                  className="object-contain p-6"
                />
              </div>

              <ProductCart
                product={product}
                onAdded={() => setModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
