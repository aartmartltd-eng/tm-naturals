"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface CartItem {
  cartLineId: string;
  productId: string;
  productName: string;
  image: string;
  variantId: string;
  variantName: string;
  unitsPerPack: number;
  stripePriceId: string;
  unitPrice: number;
  quantity: number;
}

interface AddToCartPayload {
  productId: string;
  productName: string;
  image: string;
  variantId: string;
  variantName: string;
  unitsPerPack: number;
  stripePriceId: string;
  unitPrice: number;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (payload: AddToCartPayload) => void;
  removeItem: (cartLineId: string) => void;
  updateQuantity: (cartLineId: string, quantity: number) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function generateCartLineId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const addItem = useCallback((payload: AddToCartPayload) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.productId === payload.productId &&
          item.variantId === payload.variantId,
      );

      if (existing) {
        return prev.map((item) =>
          item.cartLineId === existing.cartLineId
            ? {
                ...item,
                quantity: Math.min(10, item.quantity + payload.quantity),
              }
            : item,
        );
      }

      return [
        ...prev,
        {
          cartLineId: generateCartLineId(),
          ...payload,
        },
      ];
    });
    setIsDrawerOpen(true);
  }, []);

  const removeItem = useCallback((cartLineId: string) => {
    setItems((prev) => prev.filter((item) => item.cartLineId !== cartLineId));
  }, []);

  const updateQuantity = useCallback((cartLineId: string, quantity: number) => {
    const clamped = Math.max(1, Math.min(10, quantity));
    setItems((prev) =>
      prev.map((item) =>
        item.cartLineId === cartLineId ? { ...item, quantity: clamped } : item,
      ),
    );
  }, []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      addItem,
      removeItem,
      updateQuantity,
    }),
    [
      items,
      itemCount,
      subtotal,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      addItem,
      removeItem,
      updateQuantity,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
