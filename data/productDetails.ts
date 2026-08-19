export interface ProductIngredient {
  name: string;
  description: string;
}

export interface ProductIngredientSection {
  title: string;
  subtitle?: string;
  intro?: string;
  items: ProductIngredient[];
}

export interface ProductFormulaFact {
  number: string;
  title: string;
  description: string;
}

export interface ProductFormulaSection {
  eyebrow: string;
  heading: string;
  paragraph: string;
  facts: ProductFormulaFact[];
}

export interface ProductFaqItem {
  question: string;
  answer: string;
}

export interface HowToUseStep {
  step: string;
  title: string;
  description: string;
}

export interface ProductDetailContent {
  slug: string;
  productId: string;
  displayName: string;
  descriptor: string;
  images: string[];
  seoTitle: string;
  seoDescription: string;
  overview: string;
  overviewParagraphs?: string[];
  howToUse: string;
  howToUseSteps?: HowToUseStep[];
  formulaSection: ProductFormulaSection;
  ingredientSections?: ProductIngredientSection[];
  ingredientLayout?: "dual-column";
  ingredients?: ProductIngredient[];
  faqs: ProductFaqItem[];
}

const SLUG_TO_PRODUCT_ID: Record<string, string> = {
  "fruits-veggies": "fruits-veggies",
  "shilajit-sea-moss": "shilajit-seamoss",
  "sea-moss": "sea-moss",
  "shilajit-resin": "shilajit-resin",
  "beet-root-gummies": "beet-root-gummies",
};

const PRODUCT_ID_TO_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(SLUG_TO_PRODUCT_ID).map(([slug, id]) => [id, slug]),
);

export const productDetailSlugs = Object.keys(SLUG_TO_PRODUCT_ID);

export function getProductSlug(productId: string): string {
  return PRODUCT_ID_TO_SLUG[productId] ?? productId;
}

export function getProductIdFromSlug(slug: string): string | undefined {
  return SLUG_TO_PRODUCT_ID[slug];
}

/**
 * Build gallery paths from the main product image filename.
 * Only include additionalIndexes for files that exist in public/images/.
 *
 * Example: buildGalleryImagePaths("/images/fruits-veggies.png", [1, 2])
 * → fruits-veggies.png, fruits-veggies-1.png, fruits-veggies-2.png
 */
export function buildGalleryImagePaths(
  mainImagePath: string,
  additionalIndexes: number[] = [],
): string[] {
  const match = mainImagePath.match(/^(.+)(\.(png|jpe?g|webp))$/i);
  if (!match) return [mainImagePath];

  const base = match[1];
  const ext = match[2];

  return [
    mainImagePath,
    ...additionalIndexes.map((index) => `${base}-${index}${ext}`),
  ];
}

function ingredient(name: string, description: string): ProductIngredient {
  return { name, description };
}

export const productDetails: ProductDetailContent[] = [
  {
    slug: "fruits-veggies",
    productId: "fruits-veggies",
    displayName: "Fruits & Veggies",
    descriptor: "16 Whole Fruits + 15 Whole Vegetables",
    images: buildGalleryImagePaths("/images/fruits-veggies.png", [1, 2, 3, 4]),
    seoTitle: "Fruits & Veggies | TM NATURALS",
    seoDescription:
      "Whole-food fruit and vegetable capsules with 16 whole fruits and 15 whole vegetables. 90 capsules per bottle, 3 capsules daily.",
    overview:
      "Made with whole-food fruit and vegetable ingredients, TM NATURALS Fruits & Veggies is crafted as a convenient addition to a balanced diet — not a replacement for fresh produce.",
    overviewParagraphs: [
      "Each bottle contains 90 capsules with 30 servings based on the labeled serving size of 3 capsules daily.",
      "This vegan whole-food vitamin formula brings together fruit and vegetable-based ingredients in a simple capsule format designed for everyday consistency.",
      "Supplements can support a wellness routine, but they do not replace the fiber, water, and complete nutritional profile of eating a varied diet rich in fruits and vegetables.",
    ],
    howToUse:
      "Take 3 capsules daily per bottle, following the directions on the product label. Capsules can be taken with water as part of your everyday routine.",
    formulaSection: {
      eyebrow: "Everyday Formula",
      heading: "Whole-Food Nutrition, Made Simple.",
      paragraph:
        "Made with whole-food fruit and vegetable ingredients in a vegan capsule format, Fruits & Veggies is designed for simple, consistent everyday use. Take 3 capsules daily per bottle as directed. It is intended as a convenient addition to balanced nutrition, not as a replacement for fresh fruits and vegetables.",
      facts: [
        {
          number: "01",
          title: "Whole-Food Formula",
          description: "Fruit and vegetable ingredients in capsule form.",
        },
        {
          number: "02",
          title: "16 + 15 Blend",
          description: "16 whole fruits and 15 whole vegetables.",
        },
        {
          number: "03",
          title: "Vegan Friendly",
          description: "Vegan whole-food vitamin formula.",
        },
        {
          number: "04",
          title: "90 Capsules",
          description: "30 servings per bottle at 3 capsules daily.",
        },
      ],
    },
    ingredientLayout: "dual-column",
    ingredientSections: [
      {
        title: "Fruits",
        subtitle: "Whole-Food Fruit Blend",
        intro:
          "The fruit portion of this formula includes thoughtfully selected whole-food fruit ingredients. The complete formula includes 16 whole fruits; the ingredients listed below reflect those currently documented for TM NATURALS.",
        items: [
          ingredient("Acerola Cherry", "Included as part of the whole-food fruit blend."),
          ingredient("Aloe Vera", "Included as part of the whole-food fruit blend."),
          ingredient("Apple", "Included as part of the whole-food fruit blend."),
          ingredient("Bamboo Extract", "Included as part of the whole-food fruit blend."),
          ingredient("Banana", "Included as part of the whole-food fruit blend."),
          ingredient("Beetroot", "Included as part of the whole-food fruit blend."),
          ingredient("Bilberry", "Included as part of the whole-food fruit blend."),
          ingredient("Blueberry", "Included as part of the whole-food fruit blend."),
          ingredient("Cranberry", "Included as part of the whole-food fruit blend."),
          ingredient("Elderberry", "Included as part of the whole-food fruit blend."),
          ingredient("Grape & Seed", "Included as part of the whole-food fruit blend."),
          ingredient(
            "Additional Whole Fruits",
            "Additional whole-food fruit ingredients complete the 16-fruit portion of the formula.",
          ),
        ],
      },
      {
        title: "Veggies",
        subtitle: "Whole-Food Vegetable Blend",
        intro:
          "The vegetable portion includes thoughtfully selected whole-food vegetable ingredients. The complete formula includes 15 whole vegetables; the ingredients listed below reflect those currently documented for TM NATURALS.",
        items: [
          ingredient("Broccoli", "Included as part of the whole-food vegetable blend."),
          ingredient("Cabbage", "Included as part of the whole-food vegetable blend."),
          ingredient("Carrot", "Included as part of the whole-food vegetable blend."),
          ingredient("Cauliflower", "Included as part of the whole-food vegetable blend."),
          ingredient("Cayenne Pepper", "Included as part of the whole-food vegetable blend."),
          ingredient("Celery", "Included as part of the whole-food vegetable blend."),
          ingredient("Garlic", "Included as part of the whole-food vegetable blend."),
          ingredient("Green Onion", "Included as part of the whole-food vegetable blend."),
          ingredient("Kale", "Included as part of the whole-food vegetable blend."),
          ingredient("Parsley", "Included as part of the whole-food vegetable blend."),
          ingredient("Shiitake Mushroom", "Included as part of the whole-food vegetable blend."),
          ingredient(
            "Additional Whole Vegetables",
            "Additional whole-food vegetable ingredients complete the 15-vegetable portion of the formula.",
          ),
        ],
      },
    ],
    faqs: [
      {
        question: "Do fruit and vegetable supplements replace fresh produce?",
        answer:
          "No. Supplements can be a convenient addition to a balanced diet, but they do not replace the fiber, water and complete nutritional profile of eating a varied diet rich in fruits and vegetables.",
      },
      {
        question: "When should I take Fruits & Veggies?",
        answer:
          "Follow the directions on the product label. The current serving is 3 capsules daily per bottle.",
      },
      {
        question: "How many capsules are included?",
        answer:
          "Each bottle contains 90 capsules, providing 30 servings based on the labeled serving size.",
      },
      {
        question: "Is this designed for everyday use?",
        answer:
          "The product is designed as a convenient addition to an everyday wellness routine when used according to the label directions.",
      },
    ],
  },
  {
    slug: "shilajit-sea-moss",
    productId: "shilajit-seamoss",
    displayName: "Shilajit + Sea Moss Capsules",
    descriptor: "Premium Dual-Ingredient Daily Capsules",
    images: buildGalleryImagePaths("/images/shilajit-seamoss.png", [1, 2, 3, 4]),
    seoTitle: "Shilajit + Sea Moss Capsules | TM NATURALS",
    seoDescription:
      "A thoughtfully formulated capsule with shilajit, sea moss, and complementary botanical ingredients for everyday wellness.",
    overview:
      "TM NATURALS Shilajit + Sea Moss Capsules combine Himalayan shilajit and sea moss with a complementary blend of botanical ingredients in one convenient daily capsule format.",
    overviewParagraphs: [
      "This multi-ingredient formula is designed for practical everyday use — a straightforward way to include shilajit, sea moss, and supporting botanicals in your wellness routine.",
      "The capsule format makes it easy to stay consistent without complicated preparation.",
    ],
    howToUse:
      "Follow the directions shown on the product label. Take with water as directed for everyday use.",
    formulaSection: {
      eyebrow: "Everyday Formula",
      heading: "Two Traditions, One Simple Routine.",
      paragraph:
        "A multi-ingredient capsule formula bringing together shilajit and sea moss with complementary botanical ingredients in one convenient format. Designed for people looking for a straightforward addition to their everyday wellness routine.",
      facts: [
        {
          number: "01",
          title: "Shilajit + Sea Moss",
          description:
            "Two distinctive ingredients brought together in one formula.",
        },
        {
          number: "02",
          title: "Botanical Blend",
          description:
            "Includes complementary ingredients such as ashwagandha, rhodiola, ginseng, cordyceps, and turmeric where supported by current product data.",
        },
        {
          number: "03",
          title: "Capsule Format",
          description:
            "A convenient alternative to traditional powders and resin formats.",
        },
        {
          number: "04",
          title: "Everyday Routine",
          description:
            "Designed for consistent use according to the directions on the product label.",
        },
      ],
    },
    ingredients: [
      ingredient(
        "Shilajit",
        "Himalayan shilajit included as a core ingredient in this dual-mineral capsule formula.",
      ),
      ingredient(
        "Sea Moss",
        "Sea moss paired with shilajit in a convenient capsule format.",
      ),
      ingredient(
        "Ashwagandha",
        "A traditional botanical ingredient included in the formula blend.",
      ),
      ingredient(
        "Rhodiola Rosea",
        "Included as part of the multi-ingredient capsule composition.",
      ),
      ingredient(
        "Panax Ginseng",
        "A botanical ingredient included in this thoughtfully formulated blend.",
      ),
      ingredient(
        "Cordyceps Mushroom",
        "Included as part of the complementary ingredient profile.",
      ),
      ingredient(
        "Turmeric",
        "Included as part of the multi-ingredient daily wellness formula.",
      ),
    ],
    faqs: [
      {
        question: "What ingredients are in Shilajit + Sea Moss Capsules?",
        answer:
          "The formula includes shilajit, sea moss, ashwagandha, rhodiola rosea, panax ginseng, cordyceps mushroom, and turmeric. See the What's In The Formula section for details.",
      },
      {
        question: "How should I take this product?",
        answer:
          "Follow the directions on the product label. Take with water as directed for everyday use.",
      },
      {
        question: "Is this product a subscription?",
        answer:
          "No. TM NATURALS offers one-time pack purchases. Select your preferred pack size and add to cart when you're ready.",
      },
      {
        question: "Can I combine this with other TM NATURALS products?",
        answer:
          "Many customers build a routine with multiple TM NATURALS products. If you have questions about what fits your individual needs, follow label directions and consult your healthcare provider when appropriate.",
      },
    ],
  },
  {
    slug: "sea-moss",
    productId: "sea-moss",
    displayName: "Sea Moss Capsules",
    descriptor: "Multi-Ingredient Daily Wellness Capsules",
    images: buildGalleryImagePaths("/images/sea-moss.png", [1, 2, 3, 4]),
    seoTitle: "Sea Moss Capsules | TM NATURALS",
    seoDescription:
      "Sea moss capsules with complementary botanical and vitamin ingredients for everyday wellness.",
    overview:
      "TM NATURALS Sea Moss Capsules present sea moss alongside complementary botanical and vitamin ingredients in a straightforward daily capsule format.",
    overviewParagraphs: [
      "Rather than a single-ingredient product, this formula brings together sea moss with supporting ingredients designed for practical everyday use.",
      "The capsule format is intended for convenience and consistency as part of a daily wellness routine.",
    ],
    howToUse:
      "Follow the directions shown on the product label. If your label directs 2 capsules daily with water, use that serving as directed.",
    formulaSection: {
      eyebrow: "Everyday Formula",
      heading: "Daily Wellness, Made Simple.",
      paragraph:
        "A multi-ingredient capsule formula featuring sea moss alongside ashwagandha, black seed oil, ginger, turmeric, vitamins, and burdock root. Designed as a convenient format that fits easily into an everyday wellness routine.",
      facts: [
        {
          number: "01",
          title: "Sea Moss Core",
          description:
            "Sea moss sits at the center of this multi-ingredient formula.",
        },
        {
          number: "02",
          title: "Multi-Ingredient",
          description:
            "A thoughtful combination of botanical and vitamin ingredients.",
        },
        {
          number: "03",
          title: "Capsule Format",
          description:
            "A convenient capsule format designed for everyday use.",
        },
        {
          number: "04",
          title: "Daily Routine",
          description:
            "Simple to incorporate into a consistent routine according to the product label.",
        },
      ],
    },
    ingredients: [
      ingredient("Sea Moss", "The central sea vegetable ingredient in this formula."),
      ingredient("Ashwagandha", "A botanical ingredient included in the blend."),
      ingredient("Black Seed Oil", "Included as part of the multi-ingredient composition."),
      ingredient("Ginger", "Included as part of the daily wellness formula."),
      ingredient("Turmeric", "Included as part of the botanical ingredient profile."),
      ingredient("Vitamin C", "Included as part of the vitamin portion of the formula."),
      ingredient("Vitamin D3", "Included as part of the vitamin portion of the formula."),
      ingredient("Burdock Root", "Included as part of the botanical blend."),
    ],
    faqs: [
      {
        question: "What makes these Sea Moss Capsules different from plain sea moss?",
        answer:
          "This is a multi-ingredient formula that includes sea moss alongside complementary botanical and vitamin ingredients — not a single-ingredient sea moss product.",
      },
      {
        question: "How many capsules should I take daily?",
        answer:
          "Follow the directions on the product label. If your label directs 2 capsules daily with water, use that serving as directed.",
      },
      {
        question: "Is this designed for everyday use?",
        answer:
          "Yes. The capsule format is intended as a convenient part of an everyday wellness routine when used according to label directions.",
      },
      {
        question: "Does this product treat specific health conditions?",
        answer:
          "TM NATURALS Sea Moss Capsules are dietary supplements positioned for everyday wellness. They are not intended to diagnose, treat, cure, or prevent any disease.",
      },
    ],
  },
  {
    slug: "shilajit-resin",
    productId: "shilajit-resin",
    displayName: "Pure Himalayan Shilajit Resin",
    descriptor: "30 g Pure Himalayan Shilajit Resin",
    images: buildGalleryImagePaths("/images/shilajit-resin.png", [1, 2, 3, 4]),
    seoTitle: "Pure Himalayan Shilajit Resin | TM NATURALS",
    seoDescription:
      "Pure Himalayan shilajit resin in a traditional concentrated format. 30 g per jar, lab-tested for quality.",
    overview:
      "Pure Himalayan shilajit resin offered in its traditional concentrated form — a wellness staple designed for daily use when prepared according to the product label.",
    overviewParagraphs: [
      "Each jar contains 30 g of pure Himalayan shilajit resin. The resin format preserves shilajit in its concentrated traditional form.",
      "TM NATURALS lists this product as Grade A and lab-tested for quality, as shown in current product information.",
    ],
    howToUse:
      "Take a pea-sized amount and dissolve into warm water, tea, or milk. Follow the product label for daily use directions.",
    howToUseSteps: [
      {
        step: "01",
        title: "Take a pea-sized amount",
        description:
          "Use a small pea-sized portion of resin as directed on the product label.",
      },
      {
        step: "02",
        title: "Dissolve into warm liquid",
        description:
          "Dissolve into warm water, tea, or milk until fully incorporated.",
      },
      {
        step: "03",
        title: "Follow label directions",
        description:
          "Use according to the product label for your daily wellness routine.",
      },
    ],
    formulaSection: {
      eyebrow: "Everyday Formula",
      heading: "Traditional Resin, Made Simple.",
      paragraph:
        "Pure Himalayan Shilajit in its traditional resin format, presented in a simple 30 g jar for straightforward everyday use. A pea-sized amount can be dissolved into a warm beverage according to the directions on the product label.",
      facts: [
        {
          number: "01",
          title: "Pure Resin",
          description: "Traditional Himalayan shilajit presented in resin form.",
        },
        {
          number: "02",
          title: "30 g Jar",
          description:
            "A compact format designed for convenient storage and daily use.",
        },
        {
          number: "03",
          title: "Simple Serving",
          description:
            "Use a pea-sized amount according to the directions on the product label.",
        },
        {
          number: "04",
          title: "Easy to Prepare",
          description:
            "Dissolve into warm water, tea, or milk for a simple daily routine.",
        },
      ],
    },
    ingredients: [
      ingredient(
        "Pure Himalayan Shilajit Resin",
        "Concentrated resin sourced from the Himalayas, listed as Grade A and lab-tested in current TM NATURALS product information.",
      ),
    ],
    faqs: [
      {
        question: "How do I prepare shilajit resin?",
        answer:
          "Take a pea-sized amount and dissolve it into warm water, tea, or milk. Follow the product label for daily use directions.",
      },
      {
        question: "How much resin is in each jar?",
        answer:
          "Each jar contains 30 g of pure Himalayan shilajit resin.",
      },
      {
        question: "What does Grade A and lab-tested mean?",
        answer:
          "These are quality descriptors shown in current TM NATURALS product information. They reflect TM NATURALS quality standards and do not indicate FDA approval or certification of the supplement.",
      },
      {
        question: "Can I take this every day?",
        answer:
          "Follow the directions on the product label for daily use as part of your wellness routine.",
      },
    ],
  },
  {
    slug: "beet-root-gummies",
    productId: "beet-root-gummies",
    displayName: "Beet Root Gummies",
    descriptor: "Beet Root, Pomegranate & Wellness Nutrients",
    images: buildGalleryImagePaths("/images/beet-root-gummies.png", [1, 2, 3, 4]),
    seoTitle: "Beet Root Gummies | TM NATURALS",
    seoDescription:
      "Beet root and pomegranate gummies with CoQ10, L-Citrulline, and B12 in a convenient daily gummy format.",
    overview:
      "Delicious beet root and pomegranate gummies with CoQ10, L-Citrulline, and B12 — wellness made enjoyable in a convenient gummy format for everyday routines and active lifestyles.",
    overviewParagraphs: [
      "This formula combines beet root and pomegranate with complementary nutrients in a gummy format designed to be easy to take consistently.",
      "Positioned for daily wellness and active lifestyle routines — not as a treatment for medical conditions.",
    ],
    howToUse:
      "Follow the directions shown on the product label for daily serving size and use.",
    formulaSection: {
      eyebrow: "Everyday Formula",
      heading: "Active Ingredients, Made Enjoyable.",
      paragraph:
        "A convenient gummy formula combining beet root and pomegranate with CoQ10, L-Citrulline, L-Arginine, grape seed, and key vitamins. Designed to make a multi-ingredient formula easy to incorporate into an everyday routine.",
      facts: [
        {
          number: "01",
          title: "Beet + Pomegranate",
          description:
            "A flavorful foundation built around beet root and pomegranate.",
        },
        {
          number: "02",
          title: "Multi-Ingredient Blend",
          description:
            "Includes CoQ10, L-Citrulline, L-Arginine, grape seed, and key vitamins where confirmed by current product data.",
        },
        {
          number: "03",
          title: "Gummy Format",
          description:
            "An easy-to-take alternative to capsules and powders.",
        },
        {
          number: "04",
          title: "90 Gummies",
          description: "45-day supply at 2 gummies daily.",
        },
      ],
    },
    ingredients: [
      ingredient("Beet Root", "A core ingredient in this gummy wellness formula."),
      ingredient("Pomegranate", "Paired with beet root for a flavorful gummy experience."),
      ingredient("CoQ10", "Included as part of the current TM NATURALS formula."),
      ingredient("L-Citrulline", "Included as part of the current TM NATURALS formula."),
      ingredient(
        "Vitamin B12",
        "Included as part of the current TM NATURALS gummy formula.",
      ),
    ],
    faqs: [
      {
        question: "What ingredients are in Beet Root Gummies?",
        answer:
          "The current TM NATURALS formula includes beet root, pomegranate, CoQ10, L-Citrulline, and vitamin B12. See the What's In The Formula section for details.",
      },
      {
        question: "How many gummies should I take daily?",
        answer:
          "Follow the directions on the product label for the correct daily serving size.",
      },
      {
        question: "Are these gummies for athletes only?",
        answer:
          "No. They are positioned for everyday wellness and active lifestyle routines in a convenient gummy format.",
      },
      {
        question: "Do these gummies treat blood pressure or circulation issues?",
        answer:
          "No. TM NATURALS Beet Root Gummies are dietary supplements for everyday wellness. They are not intended to diagnose, treat, cure, or prevent any disease.",
      },
    ],
  },
];

export function getProductDetailBySlug(
  slug: string,
): ProductDetailContent | undefined {
  return productDetails.find((detail) => detail.slug === slug);
}

export function getProductDisplayName(productId: string): string {
  const detail = productDetails.find((item) => item.productId === productId);
  return detail?.displayName ?? productId;
}

export function getProductDescriptor(productId: string): string | undefined {
  const detail = productDetails.find((item) => item.productId === productId);
  return detail?.descriptor;
}

export function getProductGalleryImages(productId: string): string[] {
  const detail = productDetails.find((item) => item.productId === productId);
  return detail?.images ?? [];
}
