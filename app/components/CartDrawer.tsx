"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { formatPrice } from "@/data/products";
import { useCart } from "@/app/context/CartContext";

export default function CartDrawer() {
  const {
    items,
    subtotal,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
  } = useCart();

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const resetCheckoutState = useCallback(() => {
    setCheckoutLoading(false);
    setCheckoutError("");
  }, []);

  useEffect(() => {
    const onPageShow = () => {
      resetCheckoutState();
    };

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [resetCheckoutState]);

  useEffect(() => {
    if (!isDrawerOpen) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isDrawerOpen, closeDrawer]);

  const handleCheckout = async () => {
    if (items.length === 0 || checkoutLoading) return;

    setCheckoutLoading(true);
    setCheckoutError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        }),
      });

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          `Checkout server returned an invalid response (${response.status}).`,
        );
      }

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to start checkout. Please try again.",
        );
      }

      if (!data.url) {
        throw new Error("Checkout session URL was not returned.");
      }

      window.location.assign(data.url);
    } catch (error) {
      setCheckoutError(
        error instanceof Error
          ? error.message
          : "Unable to start checkout. Please try again.",
      );
      setCheckoutLoading(false);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[70] bg-tm-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isDrawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <aside
        className={`fixed top-0 right-0 z-[80] h-full w-full max-w-md bg-tm-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-tm-border bg-tm-white">
          <h2 className="font-display text-xl text-tm-black font-bold">
            Your Cart
            {items.length > 0 && (
              <span className="ml-2 text-sm font-normal text-tm-muted">
                ({items.reduce((s, i) => s + i.quantity, 0)} items)
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-tm-light-gray transition-colors text-tm-muted"
            aria-label="Close cart"
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

        <div className="flex-1 overflow-y-auto cart-scroll px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-full bg-tm-light-gray flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-tm-muted"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </div>
              <p className="text-tm-black font-bold">Your cart is empty</p>
              <p className="text-sm text-tm-muted mt-1">
                Add products to get started
              </p>
              <button
                type="button"
                onClick={closeDrawer}
                className="mt-6 py-2.5 px-6 rounded-lg bg-tm-black text-white text-xs font-bold tracking-wide uppercase hover:bg-tm-green hover:text-tm-black transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => {
                const lineSubtotal = item.unitPrice * item.quantity;
                const showUnitsPerPack = item.unitsPerPack > 1;

                return (
                  <li
                    key={item.cartLineId}
                    className="flex gap-4 p-4 rounded-xl bg-tm-white border border-tm-border"
                  >
                    <div className="relative w-20 h-20 shrink-0 bg-tm-light-gray rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        quality={85}
                        sizes="80px"
                        className="object-contain p-1"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-tm-black leading-snug">
                        {item.productName}
                      </h3>
                      <p className="text-xs font-semibold text-tm-green mt-0.5">
                        {item.variantName}
                      </p>
                      {showUnitsPerPack && (
                        <p className="text-xs text-tm-muted mt-0.5">
                          {item.unitsPerPack} units per pack
                        </p>
                      )}

                      <p className="text-sm text-tm-muted mt-2">
                        {formatPrice(item.unitPrice)} each
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.cartLineId,
                                item.quantity - 1,
                              )
                            }
                            disabled={item.quantity <= 1}
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-tm-border bg-tm-white text-xs hover:border-tm-green disabled:opacity-40 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="text-sm font-bold w-6 text-center text-tm-black">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.cartLineId,
                                item.quantity + 1,
                              )
                            }
                            disabled={item.quantity >= 10}
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-tm-border bg-tm-white text-xs hover:border-tm-green disabled:opacity-40 transition-colors"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.cartLineId)}
                          className="text-xs text-tm-muted hover:text-tm-orange font-semibold transition-colors"
                          aria-label={`Remove ${item.productName}`}
                        >
                          Remove
                        </button>
                      </div>

                      <p className="text-sm font-bold text-tm-black mt-2 pt-2 border-t border-tm-border">
                        {formatPrice(lineSubtotal)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-tm-border px-5 py-5 space-y-4 bg-tm-white">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-tm-black">
                Order Total
              </span>
              <span className="text-xl font-extrabold text-tm-black">
                {formatPrice(subtotal)}
              </span>
            </div>

            {checkoutError && (
              <p
                className="rounded-lg border border-tm-orange/40 bg-tm-orange/10 px-4 py-3 text-sm text-tm-black font-medium"
                role="alert"
              >
                {checkoutError}
              </p>
            )}

            <button
              type="button"
              className="w-full py-3.5 px-4 rounded-lg bg-tm-black text-white text-xs font-bold tracking-[0.12em] uppercase hover:bg-tm-green hover:text-tm-black transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-tm-orange focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? "Opening secure checkout..." : "Secure Checkout"}
            </button>

            <p className="text-xs text-center text-tm-muted flex items-center justify-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-3.5 h-3.5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
              Secure checkout powered by Stripe
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
