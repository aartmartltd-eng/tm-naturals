export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stripePriceId: string;
  units?: number;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  priceDisplay: string;
  variants: ProductVariant[];
  description?: string;
}

export const products: Product[] = [
  {
    id: "fruits-veggies",
    name: "Fruits and Veggies Supplements",
    subtitle: "Vegan Whole Food Vitamins",
    image: "/images/fruits-veggies.png",
    priceDisplay: "$29.99 – $68.99",
    description:
      "Whole-food vitamins crafted from a thoughtful blend of fruits and vegetables — a simple way to support your daily nutrition routine.",
    variants: [
      {
        id: "pack-2",
        name: "Pack of 2",
        units: 2,
        price: 29.99,
        stripePriceId: "price_1U4mtxPka9kMnd6CMyZPP6Zj",
      },
      {
        id: "pack-4",
        name: "Pack of 4",
        units: 4,
        price: 48.99,
        stripePriceId: "price_1U4n06Pka9kMnd6CyKLuW4CX",
      },
      {
        id: "pack-6",
        name: "Pack of 6",
        units: 6,
        price: 68.99,
        stripePriceId: "price_1U4n1oPka9kMnd6CPnPluQ8L",
      },
    ],
  },
  {
    id: "shilajit-seamoss",
    name: "Shilajit and Sea Moss Capsules",
    subtitle: "Premium Dual-Mineral Blend",
    image: "/images/shilajit-seamoss.png",
    priceDisplay: "$19.99 – $50.99",
    description:
      "A premium capsule combining Himalayan shilajit and sea moss — thoughtfully formulated for everyday wellness support.",
    variants: [
      {
        id: "pack-2",
        name: "Pack of 2",
        units: 2,
        price: 19.99,
        stripePriceId: "price_1U465kPka9kMnd6C0KbiAtlw",
      },
      {
        id: "pack-4",
        name: "Pack of 4",
        units: 4,
        price: 31.99,
        stripePriceId: "price_1U465kPka9kMnd6C5LnEZnX4",
      },
      {
        id: "pack-6",
        name: "Pack of 6",
        units: 6,
        price: 50.99,
        stripePriceId: "price_1U465kPka9kMnd6C2IE7BSX0",
      },
    ],
  },
  {
    id: "sea-moss",
    name: "Sea Moss Capsules",
    subtitle: "Daily Wellness",
    image: "/images/sea-moss.png",
    priceDisplay: "$10.99 – $29.99",
    description:
      "Convenient sea moss capsules designed to fit easily into your daily wellness routine.",
    variants: [
      {
        id: "pack-1",
        name: "Pack of 1",
        units: 1,
        price: 10.99,
        stripePriceId: "price_1U468UPka9kMnd6CI5OPptAF",
      },
      {
        id: "pack-2",
        name: "Pack of 2",
        units: 2,
        price: 17.99,
        stripePriceId: "price_1U468UPka9kMnd6CE4OkMiUX",
      },
      {
        id: "pack-3",
        name: "Pack of 3",
        units: 3,
        price: 29.99,
        stripePriceId: "price_1U468UPka9kMnd6CJ41LiJAZ",
      },
    ],
  },
  {
    id: "shilajit-resin",
    name: "Pure Himalayan Shilajit Resin",
    subtitle: "30 g · Grade A · Lab-Tested",
    image: "/images/shilajit-resin.png",
    priceDisplay: "$11.99 – $26.99",
    description:
      "Pure Himalayan shilajit resin, lab-tested for quality — a concentrated wellness staple for your daily routine.",
    variants: [
      {
        id: "pack-1",
        name: "Pack of 1",
        units: 1,
        price: 11.99,
        stripePriceId: "price_1U46BmPka9kMnd6CAI8sYtLY",
      },
      {
        id: "pack-2",
        name: "Pack of 2",
        units: 2,
        price: 26.99,
        stripePriceId: "price_1U46BmPka9kMnd6COTVebmy3",
      },
    ],
  },
  {
    id: "beet-root-gummies",
    name: "Pomegranate and Beet Root Gummies, CoQ10, L-Citrulline & B12 – Nitric Oxide Support for Circulation, Energy & Blood Flow",
    subtitle: "With CoQ10, L-Citrulline & B12",
    image: "/images/beet-root-gummies.png",
    priceDisplay: "$14.99 – $36.99",
    description:
      "Delicious pomegranate and beet root gummies with CoQ10, L-Citrulline, and B12 — wellness made enjoyable.",
    variants: [
      {
        id: "pack-1",
        name: "Pack of 1",
        units: 1,
        price: 14.99,
        stripePriceId: "price_1U46FQPka9kMnd6CKLzM5hSz",
      },
      {
        id: "pack-2",
        name: "Pack of 2",
        units: 2,
        price: 24.99,
        stripePriceId: "price_1U46FQPka9kMnd6CSE2KTiMo",
      },
      {
        id: "pack-3",
        name: "Pack of 3",
        units: 3,
        price: 36.99,
        stripePriceId: "price_1U46FQPka9kMnd6CLTirBrLZ",
      },
    ],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getStartingPrice(product: Product): number {
  return Math.min(...product.variants.map((variant) => variant.price));
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function getVariantUnits(variant: ProductVariant): number {
  return variant.units ?? 1;
}

export function hasPackUnits(product: Product): boolean {
  return product.variants.some((v) => v.units !== undefined);
}

export function isBestValueVariant(
  variantIndex: number,
  variants: ProductVariant[],
): boolean {
  if (variants.length === 3) {
    return variantIndex === variants.length - 1;
  }
  if (variants.length === 2) {
    return variantIndex === 1;
  }
  return false;
}
