"use client";

import { useEffect, useRef, useState, type SVGProps } from "react";

const trustItems = [
  {
    number: "01",
    title: "Premium Formulas",
    description: "Carefully selected ingredients",
    Icon: LeafIcon,
  },
  {
    number: "02",
    title: "Wellness, Your Way",
    description: "Options for every routine",
    Icon: SparkleIcon,
  },
  {
    number: "03",
    title: "Secure Checkout",
    description: "Protected payments with Stripe",
    Icon: ShieldIcon,
  },
  {
    number: "04",
    title: "U.S. Shipping",
    description: "Delivered nationwide",
    Icon: PackageIcon,
  },
];

function dividerClasses(index: number): string {
  const mobile = ["border-r border-b", "border-b", "border-r", ""][index];
  const desktop =
    index < 3 ? "lg:border-r lg:border-b-0" : "lg:border-r-0 lg:border-b-0";
  return `${mobile} ${desktop} border-black/10`;
}

export default function TrustStrip() {
  const stripRef = useRef<HTMLDivElement>(null);
  const [motionReady, setMotionReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const prefersReduced = mediaQuery.matches;
    setReducedMotion(prefersReduced);
    setMotionReady(true);

    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const node = stripRef.current;
    if (!node) return;

    setVisible(false);

    const fallbackTimer = window.setTimeout(() => {
      setVisible(true);
    }, 800);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
          window.clearTimeout(fallbackTimer);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  const show = !motionReady || visible || reducedMotion;

  const itemStyle = (index: number) => {
    if (reducedMotion || !motionReady) return undefined;
    if (!show) {
      return {
        opacity: 0,
        transform: "translateY(10px)",
      };
    }
    return {
      opacity: 1,
      transform: "translateY(0)",
      transitionProperty: "opacity, transform",
      transitionDuration: "550ms",
      transitionTimingFunction: "ease-out",
      transitionDelay: `${index * 90}ms`,
    };
  };

  return (
    <section className="bg-tm-off-white">
      <div ref={stripRef} className="mx-auto max-w-7xl px-5 py-8 lg:px-10 lg:py-10">
        <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.2em] text-[#8FC642] lg:mb-7">
          THE TM NATURALS STANDARD
        </p>

        <div className="overflow-hidden rounded-2xl border border-black/10 bg-tm-off-white">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {trustItems.map((item, index) => (
              <div
                key={item.number}
                style={itemStyle(index)}
                className={`group relative px-4 py-7 sm:px-5 sm:py-8 lg:px-6 lg:py-9 ${dividerClasses(index)}`}
              >
                <div className="flex flex-col items-center text-center">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFA304]">
                    {item.number}
                  </span>

                  <item.Icon className="mt-3 h-6 w-6 text-[#8FC642] transition-transform duration-300 ease-out motion-safe:group-hover:-translate-y-[3px]" />

                  <h3 className="mt-3 text-base font-semibold text-[#010101] transition-colors duration-300 group-hover:text-[#8FC642] sm:text-lg">
                    {item.title}
                  </h3>

                  <p className="mt-1.5 max-w-[11rem] text-sm leading-snug text-tm-muted-secondary">
                    {item.description}
                  </p>

                  <div
                    className="mx-auto mt-4 h-px w-0 bg-[#8FC642] transition-all duration-300 ease-out group-hover:w-8"
                    aria-hidden="true"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LeafIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21c-4.5-3.2-7.5-7.1-7.5-11.5C4.5 5.8 7.8 3 12 3s7.5 2.8 7.5 6.5C19.5 13.9 16.5 17.8 12 21Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21V8M9.5 11.5 12 8l2.5 3.5"
      />
    </svg>
  );
}

function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m12 4 1.2 3.6L17 9l-3.8 1.4L12 14l-1.2-3.6L7 9l3.8-1.4L12 4Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 15l.7 2.1 2.1.7-2.1.7L18 20l-.7-2.1-2.1-.7 2.1-.7L18 15Z"
      />
    </svg>
  );
}

function ShieldIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3 5 6v6c0 4.4 3 8.5 7 9 4-.5 7-4.6 7-9V6l-7-3Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m9.5 12 1.8 1.8L15.5 10"
      />
    </svg>
  );
}

function PackageIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3 3 7.5 12 12l9-4.5L12 3Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7.5V16.5L12 21l9-4.5V7.5M12 12v9"
      />
    </svg>
  );
}
