import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/app/components/Providers";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "TM NATURALS | Premium Natural Wellness Supplements",
  description:
    "Premium supplements thoughtfully created to support your everyday wellness routine. Shop fruits & veggies, sea moss, shilajit, and more.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-tm-white text-tm-black">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
