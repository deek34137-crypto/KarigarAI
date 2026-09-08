import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlugOrId } from "@/lib/data/products";
import { PublicProductView, ClientProductFallback } from "@/components/market";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugOrId(slug);

  const baseUrl = "https://karigar-ai90.vercel.app";

  if (!product) {
    return {
      title: "उत्पाद / Product | KarigarAI",
      description: "AI-Driven Smart Cataloging & Market Linkage for Indian Artisans",
      openGraph: {
        title: "KarigarAI — Artisan Marketplace",
        description: "Buy directly from Indian artisans. No middlemen.",
        url: `${baseUrl}/p/${slug}`,
        siteName: "KarigarAI",
        type: "website",
      },
    };
  }

  const artisanName = product.artisan?.full_name?.split("(")[0]?.trim() || "Artisan";
  const price = product.suggested_price || product.price_min || 0;
  const imageUrl =
    product.processed_image_url ||
    product.original_image_url ||
    `${baseUrl}/og-default.png`;

  const title = `${product.title_en} | KarigarAI`;
  const titleFull = `${product.title_hi} • ${product.title_en} | KarigarAI`;
  const description =
    `${product.craft_type} by ${artisanName} • Rs. ${price.toLocaleString("en-IN")} • ` +
    `${(product.description_en || "").slice(0, 120)}`;

  return {
    title: titleFull,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/p/${slug}`,
      siteName: "KarigarAI — Vocal for Local",
      type: "website",
      locale: "en_IN",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: `${product.title_en} — handcrafted by ${artisanName}`,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    other: {
      // WhatsApp scraper reads these directly
      "og:image:width": "800",
      "og:image:height": "800",
      "og:price:amount": String(price),
      "og:price:currency": "INR",
    },
  };
}

export default async function PublicProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlugOrId(slug);

  if (!product) {
    return <ClientProductFallback slug={slug} />;
  }

  return <PublicProductView product={product} />;
}
