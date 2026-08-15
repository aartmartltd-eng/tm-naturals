export const runtime = "nodejs";

import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getProductById } from "@/data/products";

interface CheckoutItemRequest {
  productId: string;
  variantId: string;
  quantity: number;
}

function normalizeOrigin(value: string | null | undefined): string | null {
  if (!value) return null;

  const trimmed = value.trim();

  try {
    const url = new URL(trimmed);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    return url.origin;
  } catch {
    return null;
  }
}

function getOrigin(request: Request): string {
  const envOrigin = normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL);

  if (envOrigin) {
    return envOrigin;
  }

  const requestOrigin = normalizeOrigin(request.headers.get("origin"));

  if (requestOrigin) {
    return requestOrigin;
  }

  throw new Error("A valid site URL could not be determined.");
}

function buildCheckoutUrls(request: Request): {
  successUrl: string;
  cancelUrl: string;
} {
  const origin = getOrigin(request);
  const cancelUrl = new URL("/", origin);
  cancelUrl.searchParams.set("checkout", "cancelled");

  return {
    successUrl: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: cancelUrl.toString(),
  };
}

function isValidQuantity(quantity: unknown): quantity is number {
  return (
    typeof quantity === "number" &&
    Number.isInteger(quantity) &&
    quantity >= 1 &&
    quantity <= 10
  );
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405 },
  );
}

function getStripeSecretKey(): string | null {
  const raw = process.env.STRIPE_SECRET_KEY;
  if (!raw?.trim()) {
    return null;
  }

  const secretKey = raw.trim();
  if (!/^sk_(live|test)_/.test(secretKey)) {
    return null;
  }

  return secretKey;
}

export async function POST(request: Request) {
  try {
    const secretKey = getStripeSecretKey();
    if (!secretKey) {
      console.error("Stripe Checkout error: STRIPE_SECRET_KEY is missing or invalid.");
      return NextResponse.json(
        { error: "Stripe server configuration is missing." },
        { status: 500 },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    if (!body || typeof body !== "object" || !("items" in body)) {
      return NextResponse.json(
        { error: "Request must include an items array." },
        { status: 400 },
      );
    }

    const { items } = body as { items: unknown };

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i] as CheckoutItemRequest;

      if (!item || typeof item !== "object") {
        return NextResponse.json(
          { error: `Invalid cart item at index ${i}.` },
          { status: 400 },
        );
      }

      const { productId, variantId, quantity } = item;

      if (typeof productId !== "string" || !productId.trim()) {
        return NextResponse.json(
          { error: `Invalid productId at index ${i}.` },
          { status: 400 },
        );
      }

      if (typeof variantId !== "string" || !variantId.trim()) {
        return NextResponse.json(
          { error: `Invalid variantId at index ${i}.` },
          { status: 400 },
        );
      }

      if (!isValidQuantity(quantity)) {
        return NextResponse.json(
          {
            error: `Invalid quantity for ${productId} / ${variantId}. Must be an integer between 1 and 10.`,
          },
          { status: 400 },
        );
      }

      const product = getProductById(productId);
      if (!product) {
        return NextResponse.json(
          { error: `Unknown product: ${productId}.` },
          { status: 400 },
        );
      }

      const variant = product.variants.find((v) => v.id === variantId);
      if (!variant) {
        return NextResponse.json(
          {
            error: `Unknown variant "${variantId}" for product "${productId}".`,
          },
          { status: 400 },
        );
      }

      if (!variant.stripePriceId.trim()) {
        return NextResponse.json(
          {
            error: `Variant "${variantId}" for product "${productId}" is not available for checkout.`,
          },
          { status: 400 },
        );
      }

      lineItems.push({
        price: variant.stripePriceId,
        quantity,
      });
    }

    const stripe = new Stripe(secretKey);

    let successUrl: string;
    let cancelUrl: string;

    try {
      ({ successUrl, cancelUrl } = buildCheckoutUrls(request));
    } catch {
      console.error("Invalid production site URL configuration.");
      return NextResponse.json(
        { error: "Checkout URL configuration is invalid." },
        { status: 500 },
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      allow_promotion_codes: true,
      customer_creation: "always",
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Unable to create checkout session." },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      type:
        typeof error === "object" && error !== null && "type" in error
          ? String(error.type)
          : undefined,
    });
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create Stripe Checkout session.",
      },
      { status: 500 },
    );
  }
}
