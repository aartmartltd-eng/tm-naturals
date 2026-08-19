import type { ProductFormulaSection as ProductFormulaSectionContent } from "@/data/productDetails";
import SectionHeading from "@/app/components/SectionHeading";

interface ProductFormulaSectionProps {
  section: ProductFormulaSectionContent;
}

export default function ProductFormulaSection({
  section,
}: ProductFormulaSectionProps) {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-14 xl:gap-20">
        <div className="min-w-0">
          <SectionHeading eyebrow={section.eyebrow} title={section.heading} />
          <div className="mt-4 h-1 w-16 rounded-full bg-tm-orange" />
          <p className="mt-5 text-sm leading-relaxed text-[#686868] sm:text-[15px] sm:leading-7">
            {section.paragraph}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-0 border-t border-black/10 min-[640px]:grid-cols-2 min-[640px]:border-t-0">
          {section.facts.map((fact, index) => (
            <article
              key={fact.title}
              className={`min-w-0 px-0 py-6 min-[640px]:px-5 min-[640px]:py-7 lg:px-6 ${
                index < 2 ? "min-[640px]:border-b min-[640px]:border-black/10" : ""
              } ${index % 2 === 0 ? "min-[640px]:border-r min-[640px]:border-black/10" : ""} ${
                index === 0 ? "border-b border-black/10 min-[640px]:border-b-0" : ""
              } ${index === 1 ? "border-b border-black/10 min-[640px]:border-b-0" : ""}`}
            >
              <p className="text-xs font-bold tracking-[0.14em] text-tm-orange">
                {fact.number}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-tm-black sm:text-xl">
                {fact.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#686868]">
                {fact.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
