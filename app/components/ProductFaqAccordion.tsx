"use client";

import { useState } from "react";
import type { ProductFaqItem } from "@/data/productDetails";
import SectionHeading from "@/app/components/SectionHeading";

interface ProductFaqAccordionProps {
  faqs: ProductFaqItem[];
  sectionClassName?: string;
}

export default function ProductFaqAccordion({
  faqs,
  sectionClassName = "bg-tm-off-white",
}: ProductFaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className={sectionClassName}>
      <div className="mx-auto max-w-3xl px-5 py-14 sm:py-16 lg:px-10 lg:py-24">
        <SectionHeading eyebrow="FAQ" title="Questions? Start Here." />
        <div className="mt-4 h-1 w-16 rounded-full bg-[#FFA304]" />

        <div className="mt-10 divide-y divide-[#E7E7E2] border-y border-[#E7E7E2] lg:mt-12">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `product-faq-panel-${index}`;
            const buttonId = `product-faq-button-${index}`;

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
                  <span className="min-w-0 text-base font-semibold text-tm-black sm:text-lg">
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
                  <p className="pr-8 text-sm leading-relaxed text-tm-muted sm:text-base">
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
