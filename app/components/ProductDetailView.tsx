import Link from "next/link";
import type { Product } from "@/data/products";
import type { ProductDetailContent } from "@/data/productDetails";
import ProductImageGallery from "@/app/components/ProductImageGallery";
import ProductPurchasePanel from "@/app/components/ProductPurchasePanel";
import ProductFormulaSection from "@/app/components/ProductFormulaSection";
import ProductDetailSections from "@/app/components/ProductDetailSections";
import ProductReviewsSection from "@/app/components/ProductReviewsSection";
import ProductRecommendations from "@/app/components/ProductRecommendations";
import { products } from "@/data/products";
import {
  getProductDetailIngredientCount,
  getProductDetailSectionBg,
  getProductDetailSectionIndices,
} from "@/app/lib/productDetailSectionBg";

interface ProductDetailViewProps {
  product: Product;
  detail: ProductDetailContent;
}

export default function ProductDetailView({
  product,
  detail,
}: ProductDetailViewProps) {
  const hasIngredientSection = getProductDetailIngredientCount(detail) > 0;
  const sectionIndices = getProductDetailSectionIndices(hasIngredientSection);

  return (
    <>
      <section className={getProductDetailSectionBg(sectionIndices.hero)}>
        <div className="mx-auto max-w-7xl px-5 py-5 lg:px-10 lg:py-6">
          <Link
            href="/#shop"
            className="inline-flex items-center text-sm font-medium text-tm-black transition-colors hover:text-tm-green"
          >
            <span aria-hidden="true" className="mr-2">
              ←
            </span>
            Back to Shop
          </Link>
        </div>
        <div className="mx-auto max-w-7xl px-5 pb-8 lg:px-10 lg:pb-14">
          <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-12 xl:gap-16">
            <div className="order-1 min-w-0 lg:sticky lg:top-28">
              <ProductImageGallery
                images={detail.images}
                displayName={detail.displayName}
              />
            </div>

            <div className="order-2 min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-tm-green">
                TM NATURALS
              </p>
              <h1 className="mt-3 break-words font-display text-3xl font-extrabold tracking-tight text-tm-black sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
                {detail.displayName}
              </h1>
              <p className="mt-3 text-lg font-medium text-tm-black sm:text-xl">
                {detail.descriptor}
              </p>

              <div className="mt-6 lg:mt-8">
                <ProductPurchasePanel product={product} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={getProductDetailSectionBg(sectionIndices.formula)}>
        <div className="mx-auto max-w-7xl px-5 py-12 sm:py-14 lg:px-10 lg:py-14">
          <ProductFormulaSection section={detail.formulaSection} />
        </div>
      </section>
      <ProductDetailSections
        detail={detail}
        sectionIndices={sectionIndices}
      />
      <ProductReviewsSection
        sectionClassName={getProductDetailSectionBg(sectionIndices.reviews)}
      />
      <ProductRecommendations
        currentProductId={product.id}
        products={products}
        sectionClassName={getProductDetailSectionBg(
          sectionIndices.recommendations,
        )}
      />
    </>
  );
}
