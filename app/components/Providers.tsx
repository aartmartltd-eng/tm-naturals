"use client";

import { CartProvider } from "@/app/context/CartContext";
import CartDrawer from "@/app/components/CartDrawer";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
    </CartProvider>
  );
}
