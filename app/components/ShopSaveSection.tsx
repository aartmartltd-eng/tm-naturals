"use client";

import type { Product } from "@/data/products";
import ProductShoppingCard from "@/app/components/ProductShoppingCard";

interface ShopSaveSectionProps {
  products: Product[];
}

function getDesktopGridClass(index: number): string {
  if (index < 3) return "xl:col-span-2";
  if (index === 3) return "xl:col-span-2 xl:col-start-2";
  return "xl:col-span-2 xl:col-start-4";
}

export default function ShopSaveSection({ products }: ShopSaveSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8 xl:grid-cols-6">
      {products.map((product, index) => (
        <div key={product.id} className={`min-w-0 ${getDesktopGridClass(index)}`}>
          <ProductShoppingCard product={product} index={index} />
        </div>
      ))}
    </div>
  );
}
