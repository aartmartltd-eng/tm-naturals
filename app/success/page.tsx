import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed | TM NATURALS",
  description: "Your TM NATURALS order was completed successfully.",
};

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const hasSessionId =
    typeof params.session_id === "string" && params.session_id.length > 0;

  return (
    <main className="min-h-screen bg-tm-soft-white flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-tm-green/15 text-tm-green">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-8 w-8"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl text-tm-black font-extrabold">
          Order Confirmed
        </h1>

        <p className="mt-4 text-lg text-tm-muted leading-relaxed">
          Thank you for your order!
        </p>

        <p className="mt-3 text-base text-tm-muted leading-relaxed">
          Your payment was completed successfully. A payment receipt will be
          sent to the email address used during checkout.
        </p>

        {hasSessionId && (
          <p className="mt-6 text-xs text-tm-muted">
            Reference saved securely with Stripe.
          </p>
        )}

        <Link
          href="/"
          className="mt-10 inline-flex items-center justify-center rounded-lg bg-tm-black px-8 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors duration-200 hover:bg-tm-green hover:text-tm-black focus-visible:ring-2 focus-visible:ring-tm-orange focus-visible:ring-offset-2"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
