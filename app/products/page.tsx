"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/auth-context";
import { MobileShell } from "@/components/layout";
import {
  Button,
  Card,
  Badge,
  Skeleton,
  Modal,
} from "@/components/ui";
import {
  Plus,
  QrCode,
  Share2,
  ExternalLink,
  Sparkles,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  Eye,
  Filter,
  Trash2,
} from "lucide-react";
import { FullProductWithDetails } from "@/types/product";
import {
  getCatalogProducts,
  fetchCatalogProducts,
  buildArtisanBroadcastUrl,
} from "@/lib/data/products";
import { formatINR, formatLocalizedText } from "@/lib/utils";
import { QrModal, ShareButton } from "@/components/market";
import { deleteProductAction } from "@/app/actions/delete-product";

export default function ArtisanProductsPage() {
  const { language, t } = useLanguage();
  const { profile } = useAuth();
  const [products, setProducts] = useState<FullProductWithDetails[]>([]);
  const [filter, setFilter] = useState<"all" | "live" | "demo" | "draft">("all");
  const [selectedQrProduct, setSelectedQrProduct] = useState<FullProductWithDetails | null>(null);
  const [productToDelete, setProductToDelete] = useState<FullProductWithDetails | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. Instantly display local storage & benchmark items
    const initial = getCatalogProducts();
    setProducts(initial);
    setIsLoaded(true);

    // 2. Fetch and merge Supabase cloud listings asynchronously
    fetchCatalogProducts()
      .then((cloudProducts) => {
        setProducts(cloudProducts);
      })
      .catch((err) => {
        console.warn("fetchCatalogProducts error:", err);
      });
  }, []);

  const liveArtisanProducts = products.filter((p) => !p.is_demo && p.status === "published");
  const demoProducts = products.filter((p) => p.is_demo);
  const draftProducts = products.filter((p) => p.status === "draft");

  const filteredProducts = products.filter((p) => {
    if (filter === "all") return true;
    if (filter === "live") return !p.is_demo && p.status === "published";
    if (filter === "demo") return p.is_demo;
    if (filter === "draft") return p.status === "draft";
    return true;
  });

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);

    try {
      // 1. Delete from Supabase cloud database
      await deleteProductAction({
        id: productToDelete.id,
        slug: productToDelete.slug,
      });

      // 2. Delete from browser localStorage
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("karigarai_saved_products");
          if (stored) {
            const list: FullProductWithDetails[] = JSON.parse(stored);
            const updated = list.filter(
              (p) => p.id !== productToDelete.id && p.slug !== productToDelete.slug
            );
            localStorage.setItem("karigarai_saved_products", JSON.stringify(updated));
          }
        } catch {}

        // If it was a demo product, record in hidden demos so it stays removed
        if (productToDelete.is_demo) {
          try {
            const hidden = JSON.parse(localStorage.getItem("karigarai_hidden_demos") || "[]");
            if (!hidden.includes(productToDelete.id)) {
              hidden.push(productToDelete.id);
              localStorage.setItem("karigarai_hidden_demos", JSON.stringify(hidden));
            }
          } catch {}
        }
      }

      // 3. Immediately update UI state
      setProducts((prev) =>
        prev.filter((p) => p.id !== productToDelete.id && p.slug !== productToDelete.slug)
      );
      setProductToDelete(null);
    } catch (err) {
      console.error("Failed to delete product:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetDemoData = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("karigarai_saved_products");
      localStorage.removeItem("karigarai_hidden_demos");
      const reloaded = getCatalogProducts();
      setProducts(reloaded);
    }
  };

  return (
    <MobileShell>
      <div className="p-4 space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <div>
            <h1 className="text-base font-black text-slate-900 leading-tight">
              {language === "hi" ? "मेरा उत्पाद कैटलॉग" : "My Product Catalog"}
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              {language === "hi"
                ? `${liveArtisanProducts.length} लाइव उत्पाद • ${demoProducts.length} डेमो नमूने`
                : `${liveArtisanProducts.length} Live Products • ${demoProducts.length} Demo Samples`}
            </p>
          </div>

          <Link href="/products/new">
            <Button variant="default" size="sm" className="shadow-xs">
              <Plus className="w-4 h-4 mr-1" />
              <span>{language === "hi" ? "नया जोड़ें" : "New"}</span>
            </Button>
          </Link>
        </div>

        {/* Missing Phone Number Warning Card */}
        {!profile?.phone_number && (
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-left space-y-1.5 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                {language === "hi"
                  ? "व्हाट्सएप नंबर नहीं जुड़ा है"
                  : "WhatsApp Number Missing"}
              </span>
            </div>
            <p className="text-[11px] text-amber-700 leading-relaxed">
              {language === "hi"
                ? "ग्राहकों से सीधे ऑर्डर प्राप्त करने के लिए अपनी प्रोफ़ाइल में व्हाट्सएप नंबर अवश्य जोड़ें।"
                : "Add your WhatsApp number in profile so customers can contact you directly from public links."}
            </p>
            <Link href="/profile" className="inline-block pt-0.5">
              <span className="text-[11px] font-bold text-terracotta-700 underline">
                {language === "hi" ? "प्रोफ़ाइल में अभी जोड़ें →" : "Add in Profile Now →"}
              </span>
            </Link>
          </div>
        )}

        {/* Exhibition Stall Hook Info Banner */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50/60 to-orange-100/30 border border-orange-200/70 text-left flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-terracotta-700 flex items-center justify-center shrink-0 mt-0.5">
            <QrCode className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-slate-900">
              {language === "hi" ? "शिल्प मेला एवं प्रदर्शनी स्टॉल" : "Exhibition & Fair Stall Linkage"}
            </h4>
            <p className="text-[10px] text-slate-600 mt-0.5 leading-relaxed">
              {language === "hi"
                ? "प्रत्येक उत्पाद का QR कोड प्रिंट करें और अपने स्टॉल पर लगाएं। ग्राहक स्कैन करके पूरे साल व्हाट्सएप पर ऑर्डर कर सकेंगे।"
                : "Print product QR cards for your exhibition stall. Visitors can scan and order year-round on WhatsApp."}
            </p>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/80 text-xs font-bold">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
              filter === "all"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {language === "hi" ? "सभी" : "All"} ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("live")}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
              filter === "live"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {language === "hi" ? "मेरे लाइव" : "Live"} ({liveArtisanProducts.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("demo")}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
              filter === "demo"
                ? "bg-white text-amber-800 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {language === "hi" ? "डेमो" : "Demo"} ({demoProducts.length})
          </button>
          {draftProducts.length > 0 && (
            <button
              type="button"
              onClick={() => setFilter("draft")}
              className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                filter === "draft"
                  ? "bg-white text-slate-800 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {language === "hi" ? "ड्राफ्ट" : "Draft"} ({draftProducts.length})
            </button>
          )}
        </div>

        {/* Products List */}
        {!isLoaded ? (
          <div className="space-y-3">
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card className="text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-terracotta-700 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {language === "hi" ? "कोई उत्पाद नहीं मिला" : "No Products Found"}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {language === "hi"
                  ? "कैमरा या आवाज़ से 3 मिनट में अपना पहला उत्पाद कैटलॉग बनाएं।"
                  : "Create your first product catalog in 3 minutes using voice or photo."}
              </p>
            </div>
            <Link href="/products/new" className="block pt-2">
              <Button variant="default" size="sm">
                <Plus className="w-4 h-4 mr-1.5" />
                <span>{language === "hi" ? "नया उत्पाद जोड़ें" : "Add First Product"}</span>
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((product) => {
              const title = language === "hi" ? product.title_hi : product.title_en;
              const publicUrl =
                typeof window !== "undefined"
                  ? `${window.location.origin}/p/${product.slug}`
                  : `https://karigarai.app/p/${product.slug}`;

              const broadcastUrl = buildArtisanBroadcastUrl({
                productTitle: title,
                price: product.suggested_price || product.price_min || 0,
                productUrl: publicUrl,
                lang: language,
              });

              return (
                <div
                  key={product.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3 text-left transition-all hover:border-slate-300"
                >
                  <div className="flex gap-3 items-start">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 relative">
                      {product.processed_image_url || product.original_image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.processed_image_url || product.original_image_url}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                          फोटो नहीं
                        </div>
                      )}

                      {/* Demo Badge */}
                      {product.is_demo && (
                        <div className="absolute top-1 left-1 bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded">
                          DEMO
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <Badge
                          variant={product.status === "published" ? "success" : "neutral"}
                          className="text-[9px] px-1.5 py-0.2"
                        >
                          {product.status === "published"
                            ? (language === "hi" ? "लाइव" : "Live")
                            : (language === "hi" ? "ड्राफ्ट" : "Draft")}
                        </Badge>

                        <span className="text-xs font-black text-terracotta-800">
                          {formatINR(product.suggested_price || product.price_min || 0)}
                        </span>
                      </div>

                      <h3 className="text-xs font-extrabold text-slate-900 line-clamp-1 leading-snug">
                        {title}
                      </h3>

                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {product.craft_type} • {product.category}
                      </p>

                      <div className="text-[10px] text-slate-400 mt-1">
                        /p/{product.slug}
                      </div>
                    </div>
                  </div>

                  {/* Action Row */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                    {/* View Public Listing */}
                    <Link
                      href={`/p/${product.slug}`}
                      className="flex-1"
                    >
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        fullWidth
                        className="text-[11px] py-1 h-8"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1 text-slate-600" />
                        <span>{language === "hi" ? "पब्लिक देखें" : "View"}</span>
                      </Button>
                    </Link>

                    {/* Exhibition QR Modal Trigger */}
                    <button
                      type="button"
                      onClick={() => setSelectedQrProduct(product)}
                      title={language === "hi" ? "स्टॉल QR कोड" : "Stall QR Code"}
                      className="p-1.5 h-8 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-colors"
                    >
                      <QrCode className="w-4 h-4 text-terracotta-700" />
                    </button>

                    {/* WhatsApp Broadcast to Buyers */}
                    <a
                      href={broadcastUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={language === "hi" ? "व्हाट्सएप पर शेयर करें" : "Share on WhatsApp"}
                      className="p-1.5 h-8 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[11px] flex items-center gap-1 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                      <span>{language === "hi" ? "व्हाट्सएप" : "Share"}</span>
                    </a>

                    {/* Copy Link / Native Share */}
                    <ShareButton
                      url={publicUrl}
                      title={title}
                      lang={language}
                      size="icon"
                      className="h-8 w-8 p-0 flex items-center justify-center"
                    />

                    {/* Delete Product */}
                    <button
                      type="button"
                      onClick={() => setProductToDelete(product)}
                      title={language === "hi" ? "उत्पाद हटाएं" : "Delete Product"}
                      className="p-1.5 h-8 w-8 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Demo Controls Section (Reset Demo Seed Data) */}
        <div className="pt-4 border-t border-slate-200/80 text-center space-y-2">
          <button
            type="button"
            onClick={handleResetDemoData}
            className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 transition-colors"
          >
            {language === "hi"
              ? "डेमो नमूना उत्पाद पुनः लोड करें (Reset Seed Data)"
              : "Reload Demo Sample Products (Reset Seed Data)"}
          </button>
        </div>
      </div>

      {/* Selected QR Modal */}
      {selectedQrProduct && (
        <QrModal
          isOpen={Boolean(selectedQrProduct)}
          onClose={() => setSelectedQrProduct(null)}
          url={
            typeof window !== "undefined"
              ? `${window.location.origin}/p/${selectedQrProduct.slug}`
              : `https://karigarai.app/p/${selectedQrProduct.slug}`
          }
          productTitle={
            language === "hi"
              ? selectedQrProduct.title_hi
              : selectedQrProduct.title_en
          }
          artisanName={formatLocalizedText(selectedQrProduct.artisan?.full_name || profile?.full_name, language)}
          craftType={formatLocalizedText(selectedQrProduct.craft_type, language)}
          price={selectedQrProduct.suggested_price || selectedQrProduct.price_min}
          lang={language}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(productToDelete)}
        onClose={() => !isDeleting && setProductToDelete(null)}
        title={language === "hi" ? "उत्पाद हटाएं?" : "Delete Product?"}
        description={
          language === "hi"
            ? `क्या आप वाकई "${productToDelete ? (language === "hi" ? productToDelete.title_hi : productToDelete.title_en) : ""}" को अपने कैटलॉग से हटाना चाहते हैं?`
            : `Are you sure you want to delete "${productToDelete?.title_en || productToDelete?.title_hi}" from your catalog?`
        }
      >
        <div className="space-y-4 pt-2 text-left">
          <p className="text-xs text-slate-500 leading-relaxed">
            {language === "hi"
              ? "यह क्रिया इस उत्पाद को आपके डिजिटल कैटलॉग एवं सार्वजनिक लिंक से पूरी तरह हटा देगी।"
              : "This action will permanently delete this product from your digital catalog and public listing."}
          </p>
          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setProductToDelete(null)}
              disabled={isDeleting}
            >
              <span>{language === "hi" ? "रद्द करें" : "Cancel"}</span>
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleConfirmDelete}
              isLoading={isDeleting}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              <span>{language === "hi" ? "हां, हटाएं" : "Yes, Delete"}</span>
            </Button>
          </div>
        </div>
      </Modal>
    </MobileShell>
  );
}
