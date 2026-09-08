import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getProductBySlugOrId } from "@/lib/data/products";
import Link from "next/link";
import { MobileShell } from "@/components/layout";
import { Button, Badge, Card } from "@/components/ui";
import { ArrowLeft, ExternalLink, QrCode, Sparkles, Eye, Share2 } from "lucide-react";
import { formatINR } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductBySlugOrId(id);

  if (!product) {
    return { title: "उत्पाद प्रबंधन | KarigarAI" };
  }

  return {
    title: `प्रबंधन: ${product.title_hi} | KarigarAI`,
  };
}

export default async function ProductManagementPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductBySlugOrId(id);

  if (!product) {
    notFound();
  }

  return (
    <MobileShell showNav={true}>
      <div className="p-4 space-y-4 text-left">
        {/* Top Bar */}
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <Link
            href="/products"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>कैटलॉग / Catalog</span>
          </Link>

          <Badge
            variant={product.status === "published" ? "success" : "neutral"}
            className="text-[10px]"
          >
            {product.status === "published" ? "लाइव / Live" : "ड्राफ्ट / Draft"}
          </Badge>
        </div>

        {/* Product Card */}
        <Card className="p-4 space-y-3">
          <div className="flex gap-3">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
              {product.processed_image_url || product.original_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.processed_image_url || product.original_image_url}
                  alt={product.title_en}
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-extrabold text-slate-900 line-clamp-2">
                {product.title_hi}
              </h2>
              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                {product.title_en}
              </p>
              <div className="text-xs font-black text-terracotta-800 mt-1">
                {formatINR(product.suggested_price || product.price_min || 0)}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="text-[11px] text-slate-500">
              सार्वजनिक लिंक: <span className="font-mono text-slate-700">/p/{product.slug}</span>
            </div>

            <Link href={`/p/${product.slug}`} className="block">
              <Button variant="default" size="sm" fullWidth>
                <Eye className="w-4 h-4 mr-1.5" />
                <span>सार्वजनिक पेज देखें (View Public Listing)</span>
              </Button>
            </Link>
          </div>
        </Card>

        {/* Pricing Summary */}
        <Card className="p-4 space-y-2 text-xs">
          <h3 className="font-bold text-slate-900">लागत व मूल्य विवरण</h3>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">मूल उत्पादन लागत (Base Cost):</span>
            <span className="font-bold">{formatINR(product.base_cost || 0)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">सुझाया गया विक्रय मूल्य:</span>
            <span className="font-black text-terracotta-800">
              {formatINR(product.suggested_price || 0)}
            </span>
          </div>
          {product.pricing_reasoning_hi && (
            <p className="text-[11px] text-slate-600 bg-orange-50 p-2 rounded-xl mt-1">
              {product.pricing_reasoning_hi}
            </p>
          )}
        </Card>
      </div>
    </MobileShell>
  );
}
