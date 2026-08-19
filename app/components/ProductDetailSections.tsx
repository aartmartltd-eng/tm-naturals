import type {
  ProductDetailContent,
  ProductIngredient,
  ProductIngredientSection,
} from "@/data/productDetails";
import SectionHeading from "@/app/components/SectionHeading";
import ProductDualColumnIngredients from "@/app/components/ProductDualColumnIngredients";
import ProductFaqAccordion from "@/app/components/ProductFaqAccordion";
import {
  getProductDetailIngredientCount,
  getProductDetailSectionBg,
  type ProductDetailSectionIndices,
} from "@/app/lib/productDetailSectionBg";

interface ProductDetailSectionsProps {
  detail: ProductDetailContent;
  sectionIndices: ProductDetailSectionIndices;
}

function IngredientRow({
  ingredient,
  index,
}: {
  ingredient: ProductIngredient;
  index: number;
}) {
  return (
    <div className="grid gap-3 border-b border-[rgba(1,1,1,0.08)] py-6 last:border-b-0 sm:grid-cols-[minmax(0,240px)_1fr] sm:gap-10">
      <div className="flex items-start gap-4">
        <span className="font-display text-2xl font-extrabold leading-none text-[#FFA304] sm:text-3xl">
          {String(index + 1).padStart(2, "0")}
        </span>
        <p className="pt-1 text-sm font-semibold uppercase tracking-[0.1em] text-[#010101] sm:text-base">
          {ingredient.name}
        </p>
      </div>
      <p className="text-sm leading-relaxed text-tm-muted sm:text-[15px] sm:pt-1">
        {ingredient.description}
      </p>
    </div>
  );
}

function IngredientSectionBlock({
  section,
  startIndex,
  featured = false,
}: {
  section: ProductIngredientSection;
  startIndex: number;
  featured?: boolean;
}) {
  return (
    <article
      className={
        featured
          ? "rounded-2xl border border-black/5 bg-white p-6 sm:p-8 lg:p-10"
          : ""
      }
    >
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8FC642]">
          {section.title}
        </p>
        {section.subtitle && (
          <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-[#010101] sm:text-3xl lg:text-4xl">
            {section.subtitle}
          </h3>
        )}
        {section.intro && (
          <p className="mt-4 text-base leading-relaxed text-tm-muted">
            {section.intro}
          </p>
        )}
      </div>
      <div className={`${section.intro || section.subtitle ? "mt-8" : "mt-4"} border-t border-[rgba(1,1,1,0.08)]`}>
        {section.items.map((ingredient, index) => (
          <IngredientRow
            key={ingredient.name}
            ingredient={ingredient}
            index={startIndex + index}
          />
        ))}
      </div>
    </article>
  );
}

export default function ProductDetailSections({
  detail,
  sectionIndices,
}: ProductDetailSectionsProps) {
  const ingredientCount = getProductDetailIngredientCount(detail);

  let ingredientOffset = 0;
  const hasFeaturedSections =
    detail.ingredientLayout !== "dual-column" &&
    detail.ingredientSections &&
    detail.ingredientSections.length > 1;
  const useDualColumnIngredients =
    detail.ingredientLayout === "dual-column" &&
    detail.ingredientSections?.length === 2;

  return (
    <>
      <section
        className={getProductDetailSectionBg(sectionIndices.overview)}
      >
        <div className="mx-auto max-w-7xl px-5 py-14 sm:py-16 lg:px-10 lg:py-24">
          <SectionHeading eyebrow="Product Information" title="Product Overview" />
          <div className="mt-4 h-1 w-16 rounded-full bg-tm-orange" />
          <div className="mt-6 max-w-3xl space-y-4">
            <p className="text-base leading-relaxed text-tm-muted sm:text-lg">
              {detail.overview}
            </p>
            {detail.overviewParagraphs?.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="text-base leading-relaxed text-tm-muted"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {ingredientCount > 0 && sectionIndices.ingredients !== null && (
        <section
          className={getProductDetailSectionBg(sectionIndices.ingredients)}
        >
          <div className="mx-auto max-w-7xl px-5 py-14 sm:py-16 lg:px-10 lg:py-24">
            <SectionHeading
              eyebrow="Inside TM NATURALS"
              title="What's In The Formula"
            />
            <div className="mt-4 h-1 w-16 rounded-full bg-tm-orange" />

            {useDualColumnIngredients ? (
              <ProductDualColumnIngredients
                sections={
                  detail.ingredientSections as [
                    ProductIngredientSection,
                    ProductIngredientSection,
                  ]
                }
              />
            ) : (
              <div
                className={
                  hasFeaturedSections
                    ? "mt-10 space-y-8 lg:space-y-10"
                    : "mt-10"
                }
              >
                {detail.ingredientSections?.map((section) => {
                  const startIndex = ingredientOffset;
                  ingredientOffset += section.items.length;

                  return (
                    <IngredientSectionBlock
                      key={section.title}
                      section={section}
                      startIndex={startIndex}
                      featured={hasFeaturedSections}
                    />
                  );
                })}

                {detail.ingredients && (
                  <div className="border-t border-[rgba(1,1,1,0.08)]">
                    {detail.ingredients.map((ingredient, index) => (
                      <IngredientRow
                        key={ingredient.name}
                        ingredient={ingredient}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      <section
        className={getProductDetailSectionBg(sectionIndices.howToUse)}
      >
        <div className="mx-auto max-w-7xl px-5 py-14 sm:py-16 lg:px-10 lg:py-24">
          <SectionHeading eyebrow="Daily Use" title="How to Use" />
          <div className="mt-4 h-1 w-16 rounded-full bg-tm-orange" />
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-tm-muted sm:text-lg">
            {detail.howToUse}
          </p>

          {detail.howToUseSteps && (
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {detail.howToUseSteps.map((step) => (
                <div
                  key={step.step}
                  className="rounded-2xl border border-black/5 bg-tm-white p-6"
                >
                  <p className="font-display text-3xl font-extrabold text-tm-orange">
                    {step.step}
                  </p>
                  <h3 className="mt-4 font-display text-lg font-bold text-tm-black">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-tm-muted">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <ProductFaqAccordion
        faqs={detail.faqs}
        sectionClassName={getProductDetailSectionBg(sectionIndices.faq)}
      />
    </>
  );
}
