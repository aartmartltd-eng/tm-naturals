import type { ProductDetailContent } from "@/data/productDetails";

export const PRODUCT_DETAIL_WHITE_BG = "bg-tm-white";
export const PRODUCT_DETAIL_NEUTRAL_BG = "bg-tm-off-white";

/** Returns bg class for a 1-based product detail section index. Odd = white, even = neutral. */
export function getProductDetailSectionBg(sectionIndex: number): string {
  return sectionIndex % 2 === 1
    ? PRODUCT_DETAIL_WHITE_BG
    : PRODUCT_DETAIL_NEUTRAL_BG;
}

export function getProductDetailIngredientCount(
  detail: ProductDetailContent,
): number {
  return (
    detail.ingredientSections?.reduce(
      (sum, section) => sum + section.items.length,
      0,
    ) ??
    detail.ingredients?.length ??
    0
  );
}

export function getProductDetailSectionIndices(hasIngredientSection: boolean) {
  return {
    hero: 1,
    formula: 2,
    overview: 3,
    ingredients: hasIngredientSection ? 4 : null,
    howToUse: hasIngredientSection ? 5 : 4,
    faq: hasIngredientSection ? 6 : 5,
    reviews: hasIngredientSection ? 7 : 6,
    recommendations: hasIngredientSection ? 8 : 7,
  } as const;
}

export type ProductDetailSectionIndices = ReturnType<
  typeof getProductDetailSectionIndices
>;
