import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlugOrId } from "@/lib/data/products";
import { PublicProductView } from "@/components/market";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugOrId(slug);

  if (!product) {
    return {
      title: "उत्पाद / Product | KarigarAI",
      description: "AI-Driven Smart Cataloging & Market Linkage for Indian Artisans",
    };
  }

  const title = `${product.title_hi} (${product.title_en}) | KarigarAI`;
  const description = `${product.craft_type} • ${product.artisan?.full_name || "शिल्पकार"} • ₹${(product.suggested_price || product.price_min || 0).toLocaleString("en-IN")}. ${product.description_en.slice(0, 150)}...`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: product.processed_image_url || product.original_image_url,
          width: 800,
          height: 800,
          alt: product.title_en,
        },
      ],
      type: "website",
      siteName: "KarigarAI (कारीगरAI)",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.processed_image_url || product.original_image_url],
    },
  };
}

export default async function PublicProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlugOrId(slug);

  if (!product) {
    notFound();
  }

  return <PublicProductView product={product} />;
}
