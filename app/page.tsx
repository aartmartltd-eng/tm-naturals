"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ShopSaveSection from "@/app/components/ShopSaveSection";
import ProductCart from "@/app/components/ProductCart";
import FaqSection from "@/app/components/FaqSection";
import { getProductById, products } from "@/data/products";
import HeroVideoBackground from "@/app/components/HeroVideoBackground";
import SectionHeading from "@/app/components/SectionHeading";
import WhyFeaturesList from "@/app/components/WhyFeaturesList";
import WhyIntro from "@/app/components/WhyIntro";
import AboutBrandVisual from "@/app/components/AboutBrandVisual";

const trustMetrics = [
  {
    title: "Premium Formulas",
    description: "Thoughtfully selected ingredients",
  },
  {
    title: "Multiple Wellness Options",
    description: "5 product families",
  },
  {
    title: "Secure Checkout",
    description: "Powered by Stripe",
  },
  {
    title: "U.S. Shipping",
    description: "Available nationwide",
  },
];

const formulaCategories = [
  {
    productId: "fruits-veggies",
    name: "Fruits & Veggies",
    description:
      "Whole-food vitamins crafted from a thoughtful blend of fruits and vegetables.",
  },
  {
    productId: "sea-moss",
    name: "Sea Moss",
    description:
      "Convenient sea moss capsules designed to fit easily into your daily wellness routine.",
  },
  {
    productId: "shilajit-resin",
    name: "Shilajit",
    description:
      "Pure Himalayan shilajit resin, lab-tested for quality.",
  },
  {
    productId: "beet-root-gummies",
    name: "Beet Root Gummies",
    description:
      "Pomegranate and beet root gummies with CoQ10, L-Citrulline, and B12.",
  },
];

const googleReviewsUrl =
  "https://www.google.com/search?gs_ssp=eJzj4tVP1zc0LKvIyo1PMU8yYLRSNaiwsEw2Mk1LNDM1tjRJNDE3tjKoSDM3s7AwMEkyNzAyNEi1TPXiLslVyEssKS1KzCkGAHtYE0w&q=tm+naturals&rlz=1C1JSBI_enUS1070US1070&oq=tm+na&gs_lcrp=EgZjaHJvbWUqEAgBEC4YrwEYxwEYgAQYjgUyBggAEEUYOTIQCAEQLhivARjHARiABBiOBTINCAIQLhivARjHARiABDIHCAMQABiABDIGCAQQRRg8MgYIBRBFGEEyBggGEEUYPDIGCAcQRRhB0gEIMTk0MWowajeoAgCwAgA&sourceid=chrome&source=chrome.ob&ie=UTF-8#lrd=0x89c25fa65394a473:0xf768804b70210e9e,1,,,,";

// SAMPLE REVIEWS — replace with verified customer reviews before production
const reviewPlaceholders = [
  {
    id: "review-1",
    text: "Really happy with my purchase. The product arrived well packaged and everything was exactly as described. I'll definitely order from TM NATURALS again.",
    customer: "Sarah M.",
  },
  {
    id: "review-2",
    text: "Great experience from ordering to delivery. I like the quality and presentation of the products, and the ordering process was very easy.",
    customer: "Michael R.",
  },
  {
    id: "review-3",
    text: "I've ordered from TM NATURALS more than once and have been very pleased with the experience. Good products, nice packaging, and reliable service.",
    customer: "Jennifer L.",
  },
];

const featuredProduct = products[0];

const featuredHighlights = [
  "Whole food-based formula",
  featuredProduct.subtitle,
  "Multiple pack options",
];

export default function Home() {
  const [featuredModalOpen, setFeaturedModalOpen] = useState(false);

  return (
    <>
      <Header />

      <main>
        {/* Hero — full-bleed video */}
        <section
          id="home"
          className="relative isolate overflow-hidden bg-tm-black min-h-[680px] sm:min-h-[720px] lg:min-h-[calc(100svh-7.5rem)] lg:max-h-[850px]"
        >
          <HeroVideoBackground />

          {/* Mobile — stronger readability overlay */}
          <div
            className="absolute inset-0 z-[1] pointer-events-none lg:hidden"
            style={{
              background: `
                linear-gradient(90deg, rgba(1, 1, 1, 0.92) 0%, rgba(1, 1, 1, 0.78) 42%, rgba(1, 1, 1, 0.42) 100%),
                linear-gradient(180deg, rgba(1, 1, 1, 0.55) 0%, transparent 24%, transparent 58%, rgba(1, 1, 1, 0.72) 100%)
              `,
            }}
            aria-hidden="true"
          />

          {/* Desktop — cinematic left-weighted overlay */}
          <div
            className="absolute inset-0 z-[1] pointer-events-none hidden lg:block"
            style={{
              background: `
                linear-gradient(90deg, rgba(1, 1, 1, 0.82) 0%, rgba(1, 1, 1, 0.58) 38%, rgba(1, 1, 1, 0.18) 70%, rgba(1, 1, 1, 0.08) 100%),
                linear-gradient(180deg, rgba(1, 1, 1, 0.28) 0%, transparent 26%, transparent 74%, rgba(1, 1, 1, 0.38) 100%)
              `,
            }}
            aria-hidden="true"
          />

          {/* Bottom fade into trust metrics */}
          <div
            className="absolute bottom-0 inset-x-0 h-24 sm:h-28 z-[1] pointer-events-none bg-gradient-to-t from-tm-black via-tm-black/70 to-transparent"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto flex min-h-[680px] sm:min-h-[720px] lg:min-h-[calc(100svh-7.5rem)] lg:max-h-[850px] max-w-7xl items-end px-6 pb-14 sm:px-8 sm:pb-16 lg:items-center lg:px-10 lg:pb-0 lg:py-16">
            <div className="max-w-xl w-full">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-tm-green mb-5 sm:mb-6">
                Premium Daily Wellness
              </p>
              <h1 className="font-display text-[2rem] leading-[1.1] sm:text-5xl lg:text-6xl text-white font-extrabold tracking-tight">
                Wellness,{" "}
                <span className="text-tm-green">Naturally</span>{" "}
                <span className="text-tm-orange">Better.</span>
              </h1>
              <p className="mt-5 sm:mt-6 text-base sm:text-lg text-white/70 leading-relaxed max-w-md">
                Thoughtfully made supplements designed to support simple,
                consistent everyday wellness.
              </p>
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link
                  href="#shop"
                  className="inline-flex w-full sm:w-auto items-center justify-center py-3.5 px-8 rounded-lg bg-tm-green text-tm-black text-xs font-bold tracking-[0.14em] uppercase hover:bg-tm-orange transition-colors duration-200"
                >
                  Shop All Products
                </Link>
                <Link
                  href="#best-sellers"
                  className="inline-flex w-full sm:w-auto items-center justify-center py-3.5 px-8 rounded-lg border border-white/50 bg-black/30 text-white text-xs font-bold tracking-[0.14em] uppercase backdrop-blur-[2px] hover:bg-white hover:text-tm-black transition-colors duration-200"
                >
                  Explore Best Sellers
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Metrics — White */}
        <section className="bg-tm-white border-b border-tm-border">
          <div className="mx-auto max-w-7xl px-6 lg:px-10 py-10 lg:py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-tm-border">
              {trustMetrics.map((metric) => (
                <div
                  key={metric.title}
                  className="py-6 sm:py-0 sm:px-8 first:sm:pl-0 last:sm:pr-0"
                >
                  <p className="font-display text-xl sm:text-2xl font-bold text-tm-black leading-snug">
                    {metric.title}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-tm-green">
                    {metric.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Shop & Save */}
        <section id="shop" className="scroll-mt-24 bg-tm-white">
          <div
            id="best-sellers"
            className="mx-auto max-w-7xl px-6 lg:px-10 py-20 lg:py-28 scroll-mt-24"
          >
            <div className="mb-12 lg:mb-14">
              <SectionHeading
                eyebrow="Shop & Save"
                title="Choose the products that fit you."
              />
              <div className="mt-4 h-1 w-16 bg-tm-orange rounded-full" />
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#686868]">
                Choose your product, select your preferred pack size, and build a
                routine that works for you.
              </p>
            </div>

            <ShopSaveSection products={products} />
          </div>
        </section>

        {/* Why TM NATURALS */}
        <section className="bg-tm-soft-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 lg:py-28">
            <div className="relative grid lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-16 xl:gap-24 items-start">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-[42%] top-0 bottom-0 hidden lg:block w-px bg-tm-green/20"
              />

              <WhyIntro />

              <WhyFeaturesList />
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="scroll-mt-24 bg-tm-black">
          <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 lg:py-28">
            <div className="max-w-lg">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8FC642] mb-3">
                Get In Touch
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-extrabold tracking-tight">
                Questions? We&apos;re Here to Help.
              </h2>
              <div className="mt-4 h-1 w-16 bg-tm-orange rounded-full" />
              <p className="mt-6 text-base text-white/70 leading-relaxed">
                Questions about products, orders, or your TM NATURALS experience?
                Reach out and our team will be happy to help.
              </p>
              <a
                href="mailto:contact@tm-naturals.com"
                className="mt-10 inline-block text-xl sm:text-2xl lg:text-3xl font-medium text-white underline decoration-tm-green decoration-2 underline-offset-8 transition-colors duration-200 hover:text-tm-green"
              >
                contact@tm-naturals.com
              </a>
            </div>
          </div>
        </section>

        {/* Featured Product */}
        <section className="bg-tm-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="order-1 flex justify-center lg:justify-start">
                <div className="relative aspect-square w-full max-w-[540px]">
                  <Image
                    src={featuredProduct.image}
                    alt={featuredProduct.name}
                    fill
                    quality={95}
                    sizes="(max-width: 1024px) 90vw, 540px"
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="order-2 max-w-lg mx-auto lg:mx-0 w-full">
                <SectionHeading
                  eyebrow="Featured Product"
                  title="Daily Fruits & Veggies, Made Simple."
                />
                <div className="mt-4 h-1 w-16 bg-tm-orange rounded-full" />
                <p className="mt-6 text-tm-muted leading-relaxed">
                  A convenient way to add fruit and vegetable-based nutrition to
                  your everyday wellness routine.
                </p>
                <ul className="mt-6 space-y-3">
                  {featuredHighlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-3 text-sm sm:text-base text-tm-black"
                    >
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-tm-green"
                        aria-hidden="true"
                      />
                      {highlight}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-xl font-bold text-tm-black">
                  {featuredProduct.priceDisplay}
                </p>
                <button
                  type="button"
                  onClick={() => setFeaturedModalOpen(true)}
                  className="mt-8 inline-flex items-center justify-center py-3.5 px-8 rounded-lg bg-tm-black text-white text-xs font-bold tracking-[0.14em] uppercase hover:bg-tm-green hover:text-tm-black transition-colors duration-200"
                >
                  Shop Fruits &amp; Veggies
                </button>
              </div>
            </div>
          </div>

          {featuredModalOpen && (
            <FeaturedProductModal onClose={() => setFeaturedModalOpen(false)} />
          )}
        </section>

        {/* Inside TM NATURALS — Formula Education */}
        <section id="formulas" className="scroll-mt-24 bg-tm-soft-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 lg:py-28">
            <SectionHeading
              eyebrow="Inside TM NATURALS"
              title="Simple Formulas. Clear Ingredients."
            />
            <div className="mt-4 h-1 w-16 bg-tm-orange rounded-full" />

            <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {formulaCategories.map((category) => {
                const product = getProductById(category.productId);
                if (!product) return null;

                return (
                  <article
                    key={category.productId}
                    className="flex flex-col pt-6"
                  >
                    <div className="relative aspect-square w-full max-w-[200px] mb-5">
                      <Image
                        src={product.image}
                        alt={category.name}
                        fill
                        quality={90}
                        sizes="(max-width: 640px) 45vw, 200px"
                        className="object-contain"
                      />
                    </div>
                    <h3 className="font-display text-xl font-bold text-tm-black">
                      {category.name}
                    </h3>
                    <p className="mt-3 flex-1 text-sm text-tm-muted leading-relaxed">
                      {category.description}
                    </p>
                    <Link
                      href="#shop"
                      className="mt-6 inline-flex items-center text-xs font-bold uppercase tracking-[0.14em] text-tm-black transition-colors hover:text-tm-orange"
                    >
                      Shop {category.name}
                      <span className="ml-2" aria-hidden="true">
                        →
                      </span>
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Our Approach */}
        <section id="approach" className="scroll-mt-24 bg-tm-white">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 lg:items-stretch">
              <div className="flex flex-col justify-center px-6 lg:px-10 py-20 lg:py-28 max-w-lg lg:max-w-none">
                <SectionHeading
                  eyebrow="Our Approach"
                  title="Wellness That Fits Real Life"
                />
                <div className="mt-4 h-1 w-16 bg-tm-orange rounded-full" />
                <p className="mt-6 text-tm-muted leading-relaxed">
                  TM NATURALS creates practical, thoughtfully designed supplements
                  for people who want a simpler approach to everyday wellness.
                </p>
                <Link
                  href="#about"
                  className="mt-9 inline-flex items-center justify-center py-3.5 px-8 rounded-lg bg-tm-black text-white text-xs font-bold tracking-[0.14em] uppercase hover:bg-tm-green hover:text-tm-black transition-colors duration-200"
                >
                  Learn About TM NATURALS
                </Link>
              </div>

              <div className="flex flex-col items-center justify-center bg-tm-black px-6 py-12 lg:px-10 lg:py-28">
                <p className="font-display text-3xl md:text-4xl font-semibold text-white tracking-wide text-center">
                  TM NATURALS
                </p>
                <div className="mt-4 h-[3px] w-[60px] bg-tm-green" />
                <div className="relative mt-8 lg:mt-10 aspect-square w-full max-w-[380px] lg:max-w-[430px] overflow-hidden rounded-[20px]">
                  <Image
                    src="/images/sea-moss.png"
                    alt="Sea Moss Capsules"
                    fill
                    quality={95}
                    sizes="(max-width: 1024px) 90vw, 430px"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="scroll-mt-24 bg-tm-soft-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="max-w-xl">
                <SectionHeading
                  eyebrow="About TM NATURALS"
                  title="Built Around Everyday Wellness."
                />
                <div className="mt-4 h-1 w-16 bg-tm-orange rounded-full" />
                <p className="mt-6 text-base text-tm-muted leading-relaxed">
                  TM NATURALS creates practical, thoughtfully designed supplements
                  for people who want a simpler approach to everyday wellness. We
                  focus on clear formulas, convenient formats, and products that fit
                  naturally into real routines.
                </p>
              </div>

              <AboutBrandVisual />
            </div>
          </div>
        </section>

        {/* Customer Reviews */}
        <section id="reviews" className="scroll-mt-24 bg-tm-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 lg:py-28">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <SectionHeading
                eyebrow="Customer Reviews"
                title="What Our Customers Say"
              />
              <div className="mt-4 h-1 w-16 bg-tm-orange rounded-full mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {reviewPlaceholders.map((review) => (
                <article
                  key={review.id}
                  className="flex flex-col rounded-2xl border border-[#EEEEEA] bg-tm-white p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
                >
                  <p
                    className="text-sm text-tm-orange tracking-wide"
                    aria-label="5 out of 5 stars"
                  >
                    ★★★★★
                  </p>
                  <p className="mt-4 flex-1 text-sm sm:text-base text-tm-black leading-relaxed">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="mt-6 pt-5 border-t border-[#EEEEEA]">
                    <p className="text-sm font-semibold text-tm-black">
                      {review.customer}
                    </p>
                    <p className="mt-1 text-xs text-tm-muted">Google Customer</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-14 text-center">
              <p
                className="text-sm text-tm-orange tracking-wide"
                aria-hidden="true"
              >
                ★★★★★
              </p>
              <p className="mt-2 text-sm font-semibold text-tm-black">
                Google Reviews
              </p>
              <a
                href={googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-lg bg-tm-black text-white text-xs font-bold tracking-[0.14em] uppercase hover:bg-tm-green hover:text-tm-black transition-colors duration-200"
              >
                Read All Google Reviews
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </a>
            </div>
          </div>
        </section>

        <FaqSection />
      </main>

      <Footer />
    </>
  );
}

function FeaturedProductModal({ onClose }: { onClose: () => void }) {
  const featuredProduct = products[0];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="featured-product-modal"
    >
      <button
        type="button"
        className="absolute inset-0 bg-tm-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative w-full sm:max-w-lg bg-tm-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-tm-white border-b border-tm-border px-6 py-4 flex items-center justify-between z-10">
          <h2
            id="featured-product-modal"
            className="font-display text-xl text-tm-black font-bold pr-4"
          >
            {featuredProduct.name}
          </h2>
          <button
            type="button"
            onClick={onClose}
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
              src={featuredProduct.image}
              alt={featuredProduct.name}
              fill
              quality={90}
              sizes="240px"
              className="object-contain p-6"
            />
          </div>
          <ProductCart product={featuredProduct} onAdded={onClose} />
        </div>
      </div>
    </div>
  );
}
