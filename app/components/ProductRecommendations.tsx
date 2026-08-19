import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { formatPrice, getStartingPrice } from "@/data/products";
import { getProductSlug, getProductDisplayName, getProductDescriptor } from "@/data/productDetails";
import SectionHeading from "@/app/components/SectionHeading";

interface ProductRecommendationsProps {
  currentProductId: string;
  products: Product[];
  sectionClassName?: string;
}

export default function ProductRecommendations({
  currentProductId,
  products,
  sectionClassName = "bg-tm-off-white",
}: ProductRecommendationsProps) {
  const recommendations = products
    .filter((product) => product.id !== currentProductId)
    .slice(0, 3);

  if (recommendations.length === 0) return null;

  return (
    <section className={sectionClassName}>
      <div className="mx-auto max-w-7xl px-5 py-14 sm:py-16 lg:px-10 lg:py-24">
        <SectionHeading
          eyebrow="You Might Also Like"
          title="Explore More From TM NATURALS"
        />
        <div className="mt-4 h-1 w-16 rounded-full bg-[#FFA304]" />

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {recommendations.map((product) => (
            <article
              key={product.id}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(1,1,1,0.08)] bg-white shadow-[0_8px_28px_rgba(0,0,0,0.05)]"
            >
              <div className="relative aspect-square w-full bg-[#F8F7F3]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  quality={95}
                  sizes="(max-width: 768px) 92vw, 33vw"
                  className="object-contain p-5"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-lg font-bold text-[#010101] line-clamp-2">
                  {getProductDisplayName(product.id)}
                </h3>
                {getProductDescriptor(product.id) && (
                  <p className="mt-2 text-sm leading-relaxed text-tm-muted line-clamp-2">
                    {getProductDescriptor(product.id)}
                  </p>
                )}
                <p className="mt-3 text-lg font-semibold text-[#010101]">
                  From {formatPrice(getStartingPrice(product))}
                </p>
                <div className="mt-auto pt-5">
                <Link
                  href={`/products/${getProductSlug(product.id)}`}
                  className="group/rec inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-[#8FC642] bg-[#8FC642] px-4 text-sm font-semibold text-[#010101] transition-all duration-300 hover:border-[#8FC642] hover:bg-white focus-visible:border-[#8FC642] focus-visible:bg-white"
                >
                  View Product Details
                  <span
                    className="text-[#010101] transition-all duration-300 group-hover/rec:translate-x-[3px] group-hover/rec:text-[#8FC642] group-focus-visible/rec:translate-x-[3px] group-focus-visible/rec:text-[#8FC642]"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
