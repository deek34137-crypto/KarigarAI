"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  MapPin,
  Tag,
  Clock,
  Layers,
  Info,
  QrCode,
  Share2,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Heart,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { FullProductWithDetails } from "@/types/product";
import { formatINR, formatLocalizedText, getLocalizedInitial } from "@/lib/utils";
import { WhatsAppButton } from "./whatsapp-button";
import { ShareButton } from "./share-button";
import { QrModal } from "./qr-modal";
import { Badge, Card, Button } from "@/components/ui";
import { isWishlisted, toggleWishlist } from "@/lib/wishlist";

interface PublicProductViewProps {
  product: FullProductWithDetails;
}

export function PublicProductView({ product }: PublicProductViewProps) {
  const { language, setLanguage } = useLanguage();
  const [buyerLang, setBuyerLang] = useState<"hi" | "en">(language);
  const [showOriginalImage, setShowOriginalImage] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistPop, setWishlistPop] = useState(false);

  // Sync if global language changes
  useEffect(() => {
    setBuyerLang(language);
  }, [language]);

  // Load initial wishlist state from localStorage
  useEffect(() => {
    setWishlisted(isWishlisted(product.id));
  }, [product.id]);

  const handleLangChange = (newLang: "hi" | "en") => {
    setBuyerLang(newLang);
    setLanguage(newLang);
  };

  const handleWishlist = () => {
    const added = toggleWishlist({
      id: product.id,
      slug: product.slug,
      title_en: product.title_en,
      title_hi: product.title_hi,
      artisan_name: product.artisan?.full_name || "",
      craft_type: product.craft_type || "",
      price: product.suggested_price || product.price_min || 0,
      image_url: product.processed_image_url || product.original_image_url || null,
    });
    setWishlisted(added);
    setWishlistPop(true);
    setTimeout(() => setWishlistPop(false), 600);
  };

  const title = buyerLang === "hi" ? product.title_hi : product.title_en;
  const description =
    buyerLang === "hi" ? product.description_hi : product.description_en;
  const pricingReasoning =
    buyerLang === "hi"
      ? product.pricing_reasoning_hi
      : product.pricing_reasoning_en;

  // Selected image (studio processed preferred, with original toggle)
  const activeImage =
    showOriginalImage || !product.processed_image_url
      ? product.original_image_url
      : product.processed_image_url;

  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://karigarai.app/p/${product.slug}`;

  // Safe visual attributes parsing
  const visualAttrs =
    product.visual_attributes && typeof product.visual_attributes === "object"
      ? (product.visual_attributes as Record<string, string>)
      : {};

  return (
    <div className="min-h-screen bg-slate-50 pb-28 text-slate-900">
      {/* Top Header / Navigation */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{buyerLang === "hi" ? "कारीगरAI" : "KarigarAI"}</span>
          </Link>

          {/* Buyer Language Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => handleLangChange("hi")}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                buyerLang === "hi"
                  ? "bg-white text-terracotta-800 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              हिन्दी
            </button>
            <button
              type="button"
              onClick={() => handleLangChange("en")}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                buyerLang === "en"
                  ? "bg-white text-terracotta-800 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              English
            </button>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1">
            {/* Wishlist / Save heart button */}
            <button
              type="button"
              onClick={handleWishlist}
              title={
                wishlisted
                  ? (buyerLang === "hi" ? "सहेजा गया" : "Saved to Wishlist")
                  : (buyerLang === "hi" ? "बाद के लिए सहेजें" : "Save for Later")
              }
              className={`p-2 rounded-xl transition-all duration-200 ${
                wishlistPop ? "scale-125" : "scale-100"
              } ${
                wishlisted
                  ? "text-rose-500 bg-rose-50"
                  : "text-slate-500 hover:bg-slate-100 hover:text-rose-400"
              }`}
            >
              <Heart
                className={`w-4 h-4 transition-all ${wishlisted ? "fill-rose-500 stroke-rose-500" : ""}`}
              />
            </button>
            <button
              type="button"
              onClick={() => setIsQrModalOpen(true)}
              title={buyerLang === "hi" ? "स्टॉल QR कोड" : "Stall QR Code"}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <QrCode className="w-4 h-4" />
            </button>
            <ShareButton
              url={currentUrl}
              title={title}
              lang={buyerLang}
              size="icon"
            />
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-md mx-auto px-4 pt-3 space-y-4">
        {/* Demo Indicator Banner if this is benchmark seed data */}
        {product.is_demo && (
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
              <span className="font-bold">
                {buyerLang === "hi" ? "डेमो उत्पाद (नमूना)" : "Demo Product (Sample Data)"}
              </span>
            </div>
            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">
              SIH26090
            </span>
          </div>
        )}

        {/* Product Image Stage */}
        <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-sm">
          {activeImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activeImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
              {buyerLang === "hi" ? "फोटो उपलब्ध नहीं" : "No photo available"}
            </div>
          )}

          {/* AI Studio Enhanced Badge */}
          {product.processed_image_url && !showOriginalImage && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {buyerLang === "hi" ? "AI स्टूडियो संवर्धित" : "AI Studio Enhanced"}
              </span>
            </div>
          )}

          {/* Before / Original Image Toggle */}
          {product.processed_image_url && (
            <button
              type="button"
              onClick={() => setShowOriginalImage(!showOriginalImage)}
              className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold shadow-md hover:bg-white active:scale-95 transition-all"
            >
              {showOriginalImage
                ? (buyerLang === "hi" ? "स्टूडियो रूप देखें" : "View Studio")
                : (buyerLang === "hi" ? "मूल फोटो देखें" : "View Original")}
            </button>
          )}
        </div>

        {/* Product Title & Direct Artisan Price Card */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="secondary" className="text-[10px]">
                  {product.category}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {product.craft_type}
                </Badge>
              </div>
              <h1 className="text-lg font-black text-slate-900 leading-snug">
                {title}
              </h1>
            </div>

            {/* Price Badge */}
            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">
                {buyerLang === "hi" ? "शिल्पकार मूल्य" : "Artisan Price"}
              </span>
              <span className="text-xl font-black text-terracotta-800 block">
                {formatINR(product.suggested_price || product.price_min || 0)}
              </span>
              {product.price_min && product.price_max && product.price_min !== product.price_max && (
                <span className="text-[10px] font-semibold text-slate-500 block">
                  {formatINR(product.price_min)} – {formatINR(product.price_max)}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed pt-1">
            {description}
          </p>
        </div>

        {/* Artisan Profile Card (Carefully avoiding unverified "Verified" claims) */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-orange-50/70 via-white to-amber-50/40 border border-orange-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta-800">
              {buyerLang === "hi" ? "कारीगर प्रोफ़ाइल" : "Artisan Profile"}
            </span>
            <span className="text-[10px] font-semibold text-slate-500">
              {buyerLang === "hi" ? "शिल्प विरासत" : "Craft Heritage"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-terracotta-700 to-orange-500 text-white flex items-center justify-center font-extrabold text-base shadow-sm shrink-0">
              {getLocalizedInitial(product.artisan?.full_name, buyerLang)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-slate-900 truncate">
                {formatLocalizedText(product.artisan?.full_name, buyerLang) || (buyerLang === "hi" ? "शिल्पकार" : "Artisan")}
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-slate-600 font-medium">
                <MapPin className="w-3.5 h-3.5 text-terracotta-700 shrink-0" />
                <span className="truncate">
                  {product.artisan?.district
                    ? `${formatLocalizedText(product.artisan.district, buyerLang)}, ${formatLocalizedText(product.artisan.state, buyerLang) || "India"}`
                    : "India"}
                </span>
              </div>
            </div>
          </div>

          {product.artisan?.bio && (
            <p className="text-xs text-slate-600 italic leading-relaxed border-t border-orange-100 pt-2">
              &ldquo;{product.artisan.bio}&rdquo;
            </p>
          )}
        </div>

        {/* Craft Information & Material Traits */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            {buyerLang === "hi" ? "शिल्प विवरण व सामग्री" : "Craft Information & Specifications"}
          </span>

          <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">
                {buyerLang === "hi" ? "मुख्य सामग्री" : "Primary Material"}
              </span>
              <span className="font-bold text-slate-800 block mt-0.5">
                {product.material || "Natural Handcraft"}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">
                {buyerLang === "hi" ? "शिल्प विधा" : "Craft Technique"}
              </span>
              <span className="font-bold text-slate-800 block mt-0.5 truncate">
                {product.craft_type}
              </span>
            </div>

            {visualAttrs.dimensions && (
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 col-span-2">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">
                  {buyerLang === "hi" ? "माप व आकार" : "Dimensions"}
                </span>
                <span className="font-bold text-slate-800 block mt-0.5">
                  {visualAttrs.dimensions}
                </span>
              </div>
            )}

            {visualAttrs.texture && (
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 col-span-2">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">
                  {buyerLang === "hi" ? "बनावट / फिनिश" : "Texture & Finish"}
                </span>
                <span className="font-semibold text-slate-700 block mt-0.5">
                  {visualAttrs.texture}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Heritage & Craft Story Card (Authenticity-First Layer) */}
        {product.craft_story && (
          <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-50/60 via-white to-orange-50/40 border border-amber-200/80 shadow-xs space-y-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
                Heritage & Craft Story
              </span>
              <span className="text-xs font-black text-slate-900 block">
                शिल्प विरासत और कहानी
              </span>
            </div>

            {/* Generational Lineage (ONLY if artisan supplied lineage information) */}
            {product.craft_story.generational_lineage && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-semibold">
                <span>👨‍👩‍👧</span>
                <span>{product.craft_story.generational_lineage}</span>
              </div>
            )}

            {/* Story Text */}
            <div className="p-3.5 rounded-2xl bg-white border border-amber-100 shadow-2xs">
              <p className="text-xs text-slate-700 leading-relaxed italic">
                &ldquo;
                {buyerLang === "hi"
                  ? product.craft_story.story_hi
                  : product.craft_story.story_en}
                &rdquo;
              </p>
            </div>

            {/* Traditional Process */}
            {product.craft_story.traditional_process && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  {buyerLang === "hi" ? "पारंपरिक प्रक्रिया (Traditional Process)" : "Traditional Process"}
                </span>

                <div className="space-y-1 text-xs text-slate-700">
                  {Array.isArray(product.craft_story.traditional_process) ? (
                    product.craft_story.traditional_process.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-terracotta-700 font-bold">•</span>
                        <span>{step}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-start gap-2">
                      <span className="text-terracotta-700 font-bold">•</span>
                      <span>{product.craft_story.traditional_process}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Grounded Truthfulness Disclaimer */}
            <div className="pt-2 border-t border-amber-100/80 flex items-center justify-between text-[10px] text-slate-400">
              <span>
                {buyerLang === "hi"
                  ? "शिल्पकार द्वारा दी गई जानकारी पर आधारित"
                  : "Story based on artisan provided information"}
              </span>
              <span className="font-semibold text-amber-800">
                {product.craft_story.story_source === "demo_data" ? "Demo" : "Artisan"}
              </span>
            </div>
          </div>
        )}

        {/* Transparent Pricing Card */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {buyerLang === "hi" ? "पारदर्शी मूल्य संरचना" : "Transparent Pricing Details"}
            </span>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {buyerLang === "hi" ? "उचित पारिश्रमिक" : "Fair Wage Model"}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-500 block uppercase">
                {buyerLang === "hi" ? "अनुमानित मूल निर्माण लागत" : "Estimated Base Production Cost"}
              </span>
              <span className="text-sm font-bold text-slate-700">
                {formatINR(product.base_cost || 0)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-terracotta-700 block uppercase">
                {buyerLang === "hi" ? "सीधा विक्रय मूल्य" : "Direct Artisan Price"}
              </span>
              <span className="text-base font-black text-terracotta-800">
                {formatINR(product.suggested_price || product.price_min || 0)}
              </span>
            </div>
          </div>

          {pricingReasoning && (
            <p className="text-[11px] text-slate-600 leading-relaxed bg-orange-50/50 p-2.5 rounded-xl border border-orange-100">
              {pricingReasoning}
            </p>
          )}

          <div className="flex items-start gap-1.5 text-[10px] text-slate-400 font-medium">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
            <span>
              {buyerLang === "hi"
                ? "मूल्य कच्ची सामग्री लागत और कुशल शिल्पकार के घंटों के आधार पर आकलित है। शून्य बिचौलिया कटौती।"
                : "Pricing estimated based on authentic raw materials and skilled artisanal hours. Zero middlemen cut."}
            </span>
          </div>
        </div>

        {/* Exhibition Stall Physical-to-Digital Linkage Card */}
        <div className="p-4 rounded-3xl bg-slate-900 text-white space-y-3">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold">
                {buyerLang === "hi" ? "शिल्प मेला / स्टॉल क्यूआर कोड" : "Exhibition Stall QR Code"}
              </h4>
              <p className="text-[10px] text-slate-400">
                {buyerLang === "hi"
                  ? "प्रदर्शनी में ग्राहक इसे स्कैन करके सीधे आपसे जुड़ सकते हैं"
                  : "Display at Surajkund / Dastkar fairs for year-round direct orders"}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            fullWidth
            onClick={() => setIsQrModalOpen(true)}
            className="text-xs bg-white/10 hover:bg-white/20 text-white border-white/10"
          >
            <QrCode className="w-3.5 h-3.5 mr-1.5 text-amber-300" />
            <span>
              {buyerLang === "hi" ? "स्टॉल कार्ड देखें व प्रिंट करें" : "View & Print Stall QR Card"}
            </span>
          </Button>
        </div>
      </main>

      {/* Sticky Bottom WhatsApp CTA (Mobile First) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-3 shadow-lg">
        <div className="max-w-md mx-auto">
          <WhatsAppButton
            phone={product.artisan?.phone_number}
            artisanName={product.artisan?.full_name}
            productTitle={title}
            price={product.suggested_price || product.price_min || 0}
            productUrl={currentUrl}
            lang={buyerLang}
          />
        </div>
      </div>

      {/* Exhibition QR Modal */}
      <QrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        url={currentUrl}
        productTitle={title}
        artisanName={product.artisan?.full_name}
        craftType={product.craft_type}
        price={product.suggested_price || product.price_min}
        lang={buyerLang}
      />
    </div>
  );
}
