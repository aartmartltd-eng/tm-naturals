import type { ProductIngredientSection } from "@/data/productDetails";

interface ProductDualColumnIngredientsProps {
  sections: [ProductIngredientSection, ProductIngredientSection];
}

function IngredientColumn({ section }: { section: ProductIngredientSection }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8FC642]">
        {section.title}
      </p>
      {section.subtitle && (
        <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-[#010101] sm:text-3xl">
          {section.subtitle}
        </h3>
      )}
      <div className="mt-3 h-0.5 w-10 rounded-full bg-[#FFA304]" aria-hidden="true" />
      {section.intro && (
        <p className="mt-4 text-base leading-relaxed text-tm-muted">
          {section.intro}
        </p>
      )}
      <ul
        className={`${section.intro || section.subtitle ? "mt-6" : "mt-4"} divide-y divide-black/5`}
        aria-label={`${section.title} ingredients`}
      >
        {section.items.map((item) => (
          <li
            key={item.name}
            className="border-b border-black/5 py-2 text-sm text-[#010101] last:border-b-0 sm:text-base"
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProductDualColumnIngredients({
  sections,
}: ProductDualColumnIngredientsProps) {
  const [leftSection, rightSection] = sections;

  return (
    <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="min-w-0 lg:border-r lg:border-black/10 lg:pr-16">
        <IngredientColumn section={leftSection} />
      </div>
      <div className="min-w-0">
        <IngredientColumn section={rightSection} />
      </div>
    </div>
  );
}
