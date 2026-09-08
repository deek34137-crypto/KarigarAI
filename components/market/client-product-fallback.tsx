"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FullProductWithDetails } from "@/types/product";
import { normalizeKey } from "@/lib/data/products";
import { useLanguage } from "@/lib/i18n/context";
import { PublicProductView } from "./public-product-view";
import { Button, Card, Badge } from "@/components/ui";
import { AlertCircle, ArrowLeft, PackageOpen, Sparkles, Home } from "lucide-react";

interface ClientProductFallbackProps {
  slug: string;
}

export function ClientProductFallback({ slug }: ClientProductFallbackProps) {
  const { language } = useLanguage();
  const [product, setProduct] = useState<FullProductWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const norm = normalizeKey(slug);
    try {
      const stored = localStorage.getItem("karigarai_saved_products");
      if (stored) {
        const localList: FullProductWithDetails[] = JSON.parse(stored);
        const match = localList.find(
          (p) => normalizeKey(p.slug) === norm || normalizeKey(p.id) === norm
        );
        if (match) {
          setProduct(match);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // LocalStorage read error
    }

    setIsLoading(false);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-orange-200 border-t-terracotta-700 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">
            {language === "hi"
              ? "कारीगर कैटलॉग खोजा जा रहा है..."
              : "Finding craft listing..."}
          </p>
        </div>
      </div>
    );
  }

  if (product) {
    return <PublicProductView product={product} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-sm w-full p-6 text-center space-y-4 shadow-sm border border-slate-200">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200/60">
          <PackageOpen className="w-8 h-8 stroke-[1.8]" />
        </div>

        <div className="space-y-1">
          <Badge variant="neutral" className="text-[10px]">
            404 • Not Found
          </Badge>
          <h2 className="text-base font-black text-slate-900">
            {language === "hi" ? "उत्पाद नहीं मिला" : "Product Not Found"}
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            {language === "hi"
              ? "यह उत्पाद लिंक मान्य नहीं है या अभी प्रकाशित नहीं हुआ है। कृपया नया उत्पाद बनाएं या नमूना उत्पाद देखें।"
              : "This product link is invalid or has not been published yet. Please create a new product or check sample listings."}
          </p>
          <p className="text-[11px] font-mono text-slate-400 pt-1">
            /p/{slug}
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <Link href="/p/gorakhpur-terracotta-pitcher" className="block">
            <Button variant="default" size="md" fullWidth>
              <Sparkles className="w-4 h-4 mr-1.5" />
              <span>{language === "hi" ? "नमूना उत्पाद देखें" : "View Sample Listing"}</span>
            </Button>
          </Link>

          <Link href="/products" className="block">
            <Button variant="secondary" size="sm" fullWidth>
              <span>{language === "hi" ? "शिल्पकार कैटलॉग" : "Artisan Catalog"}</span>
            </Button>
          </Link>

          <Link href="/" className="block">
            <Button variant="outline" size="sm" fullWidth>
              <Home className="w-4 h-4 mr-1.5" />
              <span>{language === "hi" ? "मुख्य पृष्ठ" : "Home"}</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
