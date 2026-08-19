"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/app/context/CartContext";

const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "Shop", href: "/#shop" },
  { label: "Best Sellers", href: "/#best-sellers" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export default function Header() {
  const { itemCount, openDrawer } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <>
      <div className="bg-tm-green text-tm-black text-center text-[9px] sm:text-[11px] tracking-[0.10em] sm:tracking-[0.18em] px-3 py-2 font-bold uppercase leading-snug">
        Free U.S. Shipping • Premium Wellness • Secure Checkout
      </div>

      <header
        className={`sticky top-0 z-50 bg-tm-white border-b border-tm-border transition-shadow duration-300 ${
          scrolled ? "shadow-[0_4px_24px_rgba(0,0,0,0.06)]" : ""
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-10">
          <div className="flex h-[78px] items-center justify-between gap-3 lg:grid lg:h-[88px] lg:grid-cols-[1fr_auto_1fr] lg:gap-0">
            <Link
              href="/#home"
              className="relative flex shrink-0 items-center lg:justify-self-start"
              aria-label="TM NATURALS Home"
            >
              <Image
                src="/images/tm-naturals-logo.png"
                alt="TM NATURALS"
                width={195}
                height={65}
                className="h-auto w-[150px] shrink-0 object-contain sm:w-[165px] lg:w-[185px]"
                priority
              />
            </Link>

            <nav
              className="hidden lg:flex items-center gap-8 justify-self-center"
              aria-label="Main navigation"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative text-sm font-semibold text-tm-black tracking-wide transition-colors duration-200 hover:text-tm-orange"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-tm-orange transition-all duration-200 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 lg:justify-self-end">
              <button
                type="button"
                onClick={openDrawer}
                className="relative inline-flex items-center gap-1.5 rounded-lg bg-tm-black px-3 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-tm-black/90 focus-visible:ring-2 focus-visible:ring-tm-orange focus-visible:ring-offset-2 sm:gap-2 sm:px-3.5"
                aria-label={`Open cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
              >
                <CartIcon />
                <span className="hidden sm:inline">Cart</span>
                {itemCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-tm-orange px-1 text-[10px] font-bold text-tm-black">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setMobileOpen((prev) => !prev)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-tm-black transition-colors hover:bg-tm-light-gray lg:hidden"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>

        <div
          className={`overflow-hidden border-t border-tm-border bg-white shadow-sm transition-all duration-300 ease-in-out lg:hidden ${
            mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0 border-t-0 shadow-none"
          }`}
        >
          <nav
            className="flex flex-col px-4 py-4 sm:px-5"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="w-full border-b border-tm-border py-3.5 text-base font-semibold text-tm-black transition-colors last:border-0 hover:text-tm-orange active:text-tm-orange"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
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
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
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
  );
}
