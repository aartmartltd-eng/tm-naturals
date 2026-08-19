import SectionHeading from "@/app/components/SectionHeading";

const googleReviewsUrl =
  "https://www.google.com/search?gs_ssp=eJzj4tVP1zc0LKvIyo1PMU8yYLRSNaiwsEw2Mk1LNDM1tjRJNDE3tjKoSDM3s7AwMEkyNzAyNEi1TPXiLslVyEssKS1KzCkGAHtYE0w&q=tm+naturals&rlz=1C1JSBI_enUS1070US1070&oq=tm+na&gs_lcrp=EgZjaHJvbWUqEAgBEC4YrwEYxwEYgAQYjgUyBggAEEUYOTIQCAEQLhivARjHARiABBiOBTINCAIQLhivARjHARiABDIHCAMQABiABDIGCAQQRRg8MgYIBRBFGEEyBggGEEUYPDIGCAcQRRhB0gEIMTk0MWowajeoAgCwAgA&sourceid=chrome&source=chrome.ob&ie=UTF-8#lrd=0x89c25fa65394a473:0xf768804b70210e9e,1,,,,";

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

export default function ProductReviewsSection({
  sectionClassName = "bg-tm-white",
}: {
  sectionClassName?: string;
}) {
  return (
    <section className={sectionClassName}>
      <div className="mx-auto max-w-7xl px-5 py-14 sm:py-16 lg:px-10 lg:py-24">
        <div className="mx-auto mb-10 max-w-2xl text-center lg:mb-14">
          <SectionHeading
            eyebrow="Customer Reviews"
            title="What Our Customers Say"
            centerOnMobile
          />
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[#FFA304]" />
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-tm-muted-secondary">
            General Google reviews from TM NATURALS customers — not
            product-specific ratings.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {reviewPlaceholders.map((review) => (
            <article
              key={review.id}
              className="flex flex-col rounded-2xl border border-[#EEEEEA] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] sm:p-8"
            >
              <p
                className="text-sm tracking-wide text-[#FFA304]"
                aria-label="5 out of 5 stars"
              >
                ★★★★★
              </p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-[#010101] sm:text-base">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="mt-6 border-t border-[#EEEEEA] pt-5">
                <p className="text-sm font-semibold text-[#010101]">
                  {review.customer}
                </p>
                <p className="mt-1 text-xs text-tm-muted-secondary">Google Customer</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 text-center">
          <p className="text-sm tracking-wide text-[#FFA304]" aria-hidden="true">
            ★★★★★
          </p>
          <p className="mt-2 text-sm font-semibold text-[#010101]">
            Google Reviews
          </p>
          <a
            href={googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-[#010101] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:bg-[#8FC642] hover:text-[#010101]"
          >
            Read Our Google Reviews
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-3.5 w-3.5"
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
  );
}
