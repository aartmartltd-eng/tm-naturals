import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ProductDetailView from "@/app/components/ProductDetailView";
import {
  getProductDetailBySlug,
  getProductIdFromSlug,
  productDetailSlugs,
} from "@/data/productDetails";
import { getProductById } from "@/data/products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return productDetailSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = getProductDetailBySlug(slug);

  if (!detail) {
    return {};
  }

  return {
    title: detail.seoTitle,
    description: detail.seoDescription,
    alternates: {
      canonical: `/products/${slug}`,
    },
    openGraph: {
      title: detail.seoTitle,
      description: detail.seoDescription,
      url: `/products/${slug}`,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const productId = getProductIdFromSlug(slug);
  const detail = getProductDetailBySlug(slug);
  const product = productId ? getProductById(productId) : undefined;

  if (!product || !detail) {
    notFound();
  }

  return (
    <>
      <Header />
      <main>
        <ProductDetailView product={product} detail={detail} />
      </main>
      <Footer />
    </>
  );
}
