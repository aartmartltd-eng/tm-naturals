"use client";

import type { Product } from "@/data/products";
import ProductShoppingRow from "@/app/components/ProductShoppingRow";

interface ShopSaveSectionProps {
  products: Product[];
}

export default function ShopSaveSection({ products }: ShopSaveSectionProps) {
  return (
    <div className="space-y-16 lg:space-y-20">
      {products.map((product, index) => (
        <div
          key={product.id}
          className={
            index > 0 ? "border-t border-black/10 pt-16 lg:pt-20" : undefined
          }
        >
          <ProductShoppingRow product={product} index={index} />
        </div>
      ))}
    </div>
  );
}
