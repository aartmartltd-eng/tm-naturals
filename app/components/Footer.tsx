import Image from "next/image";
import Link from "next/link";

const shopLinks = [
  { label: "All Products", href: "#shop" },
  { label: "Best Sellers", href: "#best-sellers" },
  { label: "Fruits & Veggies", href: "#shop" },
  { label: "Sea Moss", href: "#shop" },
  { label: "Gummies", href: "#shop" },
];

const companyLinks = [
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
  { label: "Our Approach", href: "#approach" },
  { label: "Customer Reviews", href: "#reviews" },
  { label: "Shipping & Returns", href: "#contact" },
];

const supportLinks = [
  { label: "FAQ", href: "#faq" },
  { label: "Privacy Policy", href: "#contact" },
  { label: "Terms of Service", href: "#contact" },
  { label: "Secure Checkout", href: "#shop" },
  { label: "Email Support", href: "mailto:contact@tm-naturals.com" },
];

export default function Footer() {
  return (
    <footer className="bg-tm-dark text-white scroll-mt-24">
      <div className="mx-auto max-w-7xl px-5 pt-12 lg:px-10 lg:pt-20">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 xl:gap-20">
          {/* Left column — brand identity */}
          <div className="min-w-0 text-center lg:text-left">
            <Link
              href="#home"
              aria-label="TM NATURALS Home"
              className="inline-block max-w-full"
            >
              <span className="inline-block max-w-full bg-white px-2 py-1">
                <Image
                  src="/images/tm-naturals-logo.png"
                  alt="TM NATURALS"
                  width={280}
                  height={90}
                  className="h-auto w-[180px] max-w-full object-contain sm:w-[210px] lg:w-[260px]"
                />
              </span>
            </Link>
            <p className="mx-auto mt-5 max-w-[320px] text-sm leading-relaxed text-white/78 md:text-base lg:mx-0">
              Premium supplements for everyday wellness.
            </p>
          </div>

          {/* Right column — navigation */}
          <nav
            className="grid w-full min-w-0 grid-cols-1 items-start gap-10 lg:grid-cols-3 lg:gap-8"
            aria-label="Footer navigation"
          >
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8FC642] mb-5">
                Shop
              </h3>
              <ul className="space-y-3">
                {shopLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white transition-colors duration-200 hover:text-[#FFA304]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8FC642] mb-5">
                Company
              </h3>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white transition-colors duration-200 hover:text-[#FFA304]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8FC642] mb-5">
                Support
              </h3>
              <ul className="space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white transition-colors duration-200 hover:text-[#FFA304]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 pt-4 pb-5 text-center text-xs text-white/60 sm:text-sm lg:mt-14 lg:flex-row lg:items-center lg:justify-between lg:text-left">
          <p>
            © 2026 <span className="text-[#8FC642] font-medium">TM NATURALS</span>. All
            rights reserved.
          </p>
          <p>
            Secure checkout powered by <span className="text-[#8FC642] font-medium">Stripe</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
