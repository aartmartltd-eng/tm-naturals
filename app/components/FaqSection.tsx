"use client";

import { useState } from "react";
import SectionHeading from "@/app/components/SectionHeading";

const faqItems = [
  {
    question: "How do I choose a product?",
    answer:
      "Browse the shop section to compare TM NATURALS product families — including fruits and veggies, sea moss, shilajit, and gummies. Select a product, review the details, and choose the pack size that fits your routine.",
  },
  {
    question: "What pack sizes are available?",
    answer:
      "Pack sizes vary by product. When you select a product and click Select Options, you will see the available pack choices and pricing before adding to cart.",
  },
  {
    question: "How does checkout work?",
    answer:
      "Add your chosen products to the cart, then proceed to checkout. Checkout is securely processed through Stripe.",
  },
  {
    question: "Where do you ship?",
    answer:
      "TM NATURALS ships within the United States. Free U.S. shipping is offered as shown on the site. Contact us if you have questions about your order.",
  },
  {
    question: "Can I purchase multiple products in one order?",
    answer:
      "Yes. You can add multiple products and pack sizes to your cart and complete one secure Stripe checkout for your full order.",
  },
  {
    question: "How do I contact TM NATURALS?",
    answer:
      "Email contact@tm-naturals.com for questions about products, orders, or your TM NATURALS experience.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 bg-tm-white">
      <div className="mx-auto max-w-3xl px-5 py-14 sm:py-16 lg:px-10 lg:py-28">
        <div className="text-center lg:text-left">
          <SectionHeading
            eyebrow="FAQ"
            title="Questions? Start Here."
            centerOnMobile
          />
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-tm-orange lg:mx-0" />
        </div>

        <div className="mt-10 divide-y divide-tm-border border-y border-tm-border lg:mt-12">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;

            return (
              <div key={item.question}>
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full min-h-[48px] items-center justify-between gap-4 py-4 text-left transition-colors hover:text-tm-green sm:py-5"
                >
                  <span className="text-base sm:text-lg font-semibold text-tm-black">
                    {item.question}
                  </span>
                  <span
                    className={`shrink-0 text-tm-green transition-transform duration-200 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-sm sm:text-base text-tm-muted leading-relaxed pr-8">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
