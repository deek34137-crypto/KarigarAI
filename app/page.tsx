"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { MobileShell } from "@/components/layout";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Slider,
  Modal,
} from "@/components/ui";
import {
  Camera,
  Languages,
  DollarSign,
  Share2,
  Sparkles,
  ArrowRight,
  Sliders,
  Eye,
  ShoppingBag,
  LogIn,
  Heart,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { formatINR, formatLocalizedText, getLocalizedInitial } from "@/lib/utils";
import { getWishlist, removeFromWishlist, type WishlistItem } from "@/lib/wishlist";

export default function HomePage() {
  const { language, t } = useLanguage();
  const { profile, isLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [demoLabourHours, setDemoLabourHours] = useState(5);
  const [demoMaterialCost, setDemoMaterialCost] = useState(300);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  const hourlyWage = 100;
  const overhead = 50;
  const demoBaseCost = demoMaterialCost + demoLabourHours * hourlyWage + overhead;
  const suggestedMin = Math.round(demoBaseCost * 1.25);
  const suggestedMax = Math.round(demoBaseCost * 1.5);

  // Load buyer wishlist from localStorage
  useEffect(() => {
    setWishlist(getWishlist());
  }, []);

  // Buyer / unauthenticated landing
  if (!isLoading && !profile) {
    return (
      <MobileShell>
        <div className="p-4 space-y-5 flex flex-col items-center text-center">
          <div className="pt-6 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 text-terracotta-700 flex items-center justify-center mx-auto shadow-sm">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 leading-snug">
              {language === "hi" ? "KarigarAI — हस्तशिल्प बाजार" : "KarigarAI — Artisan Marketplace"}
            </h1>
            <p className="text-sm text-slate-500 max-w-[280px] mx-auto leading-relaxed">
              {language === "hi"
                ? "भारतीय शिल्पकारों के सीधे उत्पाद खरीदें। कोई बिचौलिया नहीं।"
                : "Buy directly from Indian artisans. No middlemen. Authentic handcrafted goods."}
            </p>
          </div>

          <div className="w-full space-y-3 text-left">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-terracotta-700 flex items-center justify-center shrink-0">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {language === "hi" ? "सीधे कारीगर से खरीदें" : "Buy Direct from Artisan"}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === "hi"
                    ? "WhatsApp पर सीधे संपर्क करें, बिचौलिया नहीं।"
                    : "Contact artisan directly on WhatsApp — no middleman."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {language === "hi" ? "पारदर्शी उचित मूल्य" : "Fair & Transparent Pricing"}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === "hi"
                    ? "AI-समर्थित उचित मूल्य — कारीगर को पूरा लाभ।"
                    : "AI-verified fair prices — artisan keeps the full margin."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Languages className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {language === "hi" ? "हिंदी + अंग्रेजी में जानकारी" : "Hindi + English Details"}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === "hi"
                    ? "हर उत्पाद की जानकारी दोनों भाषाओं में।"
                    : "Every product described in both languages for clarity."}
                </p>
              </div>
            </div>
          </div>

          {/* ── Wishlist Section ────────────────────────────────────── */}
          {wishlist.length > 0 && (
            <div className="w-full space-y-3 text-left">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 stroke-rose-500" />
                  {language === "hi" ? "आपकी सेव्ड लिस्ट" : "Your Saved Products"}
                </h2>
                <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  {wishlist.length}
                </span>
              </div>

              <div className="space-y-2">
                {wishlist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs"
                  >
                    {/* Product thumbnail */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title_en}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                        {language === "hi" ? item.title_hi : item.title_en}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        {item.artisan_name || item.craft_type}
                      </p>
                      <p className="text-sm font-extrabold text-terracotta-700 mt-0.5">
                        Rs. {item.price.toLocaleString("en-IN")}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-center gap-1.5 shrink-0">
                      <Link href={`/p/${item.slug}`}>
                        <button
                          type="button"
                          title={language === "hi" ? "देखें" : "View"}
                          className="w-8 h-8 rounded-lg bg-orange-50 text-terracotta-700 flex items-center justify-center hover:bg-orange-100 transition-colors border border-orange-200"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                      <button
                        type="button"
                        title={language === "hi" ? "हटाएं" : "Remove"}
                        onClick={() => {
                          removeFromWishlist(item.id);
                          setWishlist(getWishlist());
                        }}
                        className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-colors border border-slate-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Artisan CTA ─────────────────────────────────────────── */}
          <div className="w-full pt-2 space-y-2">
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">
              {language === "hi" ? "क्या आप एक कारीगर हैं?" : "Are you an artisan?"}
            </p>
            <Link href="/onboarding" className="block">
              <Button variant="default" size="lg" fullWidth className="shadow-lg shadow-orange-700/20">
                <LogIn className="w-4 h-4 mr-2" />
                <span>
                  {language === "hi" ? "कारीगर के रूप में पंजीकरण करें" : "Register as Artisan"}
                </span>
              </Button>
            </Link>
            <p className="text-[10px] text-slate-400">
              {language === "hi"
                ? "3 मिनट में अपना डिजिटल स्टॉल खोलें — बिल्कुल मुफ्त।"
                : "Open your digital stall in 3 minutes — completely free."}
            </p>
          </div>
        </div>
      </MobileShell>
    );
  }

  // Artisan / authenticated dashboard
  return (
    <MobileShell>
      <div className="p-4 space-y-4">
        {profile && (
          <Link
            href="/profile"
            className="flex items-center justify-between p-3 rounded-xl bg-orange-50/80 border border-orange-200/80 shadow-xs hover:bg-orange-100/70 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-terracotta-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {getLocalizedInitial(profile.full_name, language)}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 block truncate">
                  {formatLocalizedText(profile.full_name, language)}
                </span>
                <span className="text-[10px] text-terracotta-700 font-semibold block truncate">
                  {formatLocalizedText(profile.craft_type, language)} •{" "}
                  {formatLocalizedText(profile.district, language) ||
                    (language === "hi" ? "गोरखपुर" : "Gorakhpur")}
                </span>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] shrink-0 ml-2">
              {t("navProfile")}
            </Badge>
          </Link>
        )}

        <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50/90 via-amber-50/50 to-orange-100/30 border border-orange-200/70 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-terracotta-100 text-terracotta-800">
              SIH26090
            </span>
            <span className="text-[11px] text-slate-600 font-semibold">MoSJE • Heritage & Culture</span>
          </div>
          <h2 className="text-base font-extrabold text-slate-900 leading-snug">
            {language === "hi"
              ? "पारंपरिक शिल्पकारों के लिए AI-संचालित स्मार्ट कैटलॉग"
              : "AI-Driven Smart Cataloging for Traditional Artisans"}
          </h2>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {language === "hi"
              ? "फोटो खींचें, बोलकर बताएं — AI बनाएगा हिंदी और अंग्रेजी में बाजार-तैयार डिजिटल उत्पाद।"
              : "Snap a photo, speak naturally — AI generates bilingual, market-ready catalogs in seconds."}
          </p>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-emerald-900">
              {language === "hi" ? "स्मार्ट बहुभाषी AI प्रणाली सक्रिय" : "Multimodal AI Engine Ready"}
            </span>
          </div>
          <Badge variant="success" className="text-[10px]">
            {language === "hi" ? "लाइव" : "Live"}
          </Badge>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2.5 px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {language === "hi" ? "3-मिनट की मुख्य प्रक्रिया" : "3-Minute Core Journey"}
            </h3>
            <span className="text-[10px] font-bold text-terracotta-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200/60">
              {language === "hi" ? "शून्य टाइपिंग" : "Zero Typing"}
            </span>
          </div>

          <div className="space-y-2">
            {[
              {
                icon: <Camera className="w-4 h-4" />,
                bg: "bg-orange-100 text-terracotta-700",
                title: language === "hi" ? "1. तस्वीर लें (Camera)" : "1. Capture Photo",
                desc:
                  language === "hi"
                    ? "Gemini Multimodal AI शिल्प, सामग्री और बनावट की पहचान करता है।"
                    : "Gemini Multimodal AI detects craft type, material, and visual traits.",
              },
              {
                icon: <Languages className="w-4 h-4" />,
                bg: "bg-blue-100 text-blue-700",
                title: language === "hi" ? "2. बोलकर बताएं (Voice)" : "2. Speak Naturally",
                desc:
                  language === "hi"
                    ? "हिंदी में बोलें — AI पेशेवर हिंदी और अंग्रेजी शीर्षक व विवरण बनाएगा।"
                    : "Speak in Hindi — AI crafts bilingual titles, descriptions, and SEO tags.",
              },
              {
                icon: <DollarSign className="w-4 h-4" />,
                bg: "bg-emerald-100 text-emerald-700",
                title: language === "hi" ? "3. पारदर्शी मूल्य (Fair Price)" : "3. Fair Pricing",
                desc:
                  language === "hi"
                    ? "सामग्री + श्रम का पारदर्शी हिसाब और AI समर्थित उचित लाभ सुझाव।"
                    : "Deterministic cost formula + AI market reasoning ensures no underpricing.",
              },
              {
                icon: <Share2 className="w-4 h-4" />,
                bg: "bg-purple-100 text-purple-700",
                title: language === "hi" ? "4. डिजिटल बाजार लिंकेज" : "4. Market Linkage",
                desc:
                  language === "hi"
                    ? "1-टैप में व्हाट्सएप लिंक और सार्वजनिक वेब पेज पर साझा करें।"
                    : "Shareable public web link with 1-tap WhatsApp direct buyer inquiry.",
              },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${step.bg}`}>
                  {step.icon}
                </div>
                <div className="text-left flex-1">
                  <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-1.5 text-base">
                <Sliders className="w-4 h-4 text-terracotta-700" />
                <span>{t("tryInteractiveTokens")}</span>
              </CardTitle>
              <Badge variant="secondary">Interactive</Badge>
            </div>
            <CardDescription>
              {language === "hi"
                ? "कारीगरों के लिए बड़े टच-टारगेट और सरल स्लाइडर नियंत्रण।"
                : "Large touch targets and accessible sliders designed for rural artisans."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Slider
              label={t("materialCostLabel")}
              value={demoMaterialCost}
              min={50}
              max={1500}
              step={50}
              unit="₹"
              onChange={setDemoMaterialCost}
            />
            <Slider
              label={t("labourHoursLabel")}
              value={demoLabourHours}
              min={1}
              max={24}
              step={1}
              unit="hrs: "
              onChange={setDemoLabourHours}
            />
            <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200/80 text-left">
              <div className="flex justify-between items-center text-xs text-slate-600 font-semibold mb-1">
                <span>{t("baseCostCalculated")}:</span>
                <span className="text-sm font-bold text-slate-900">{formatINR(demoBaseCost)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-terracotta-800 font-bold">
                <span>{t("suggestedRange")}:</span>
                <span className="text-sm font-extrabold text-terracotta-800">
                  {formatINR(suggestedMin)} – {formatINR(suggestedMax)}
                </span>
              </div>
            </div>
            <div className="pt-2 flex gap-2">
              <Button variant="outline" size="sm" fullWidth onClick={() => setIsModalOpen(true)}>
                <Eye className="w-4 h-4 mr-1.5" />
                {t("testModalTitle")}
              </Button>
              <Button
                variant="default"
                size="sm"
                fullWidth
                onClick={() => { setDemoMaterialCost(450); setDemoLabourHours(8); }}
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                {language === "hi" ? "नमूना भरें" : "Load Sample"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="pt-2">
          <Link href="/products/new" className="block focus:outline-none">
            <Button variant="default" size="lg" fullWidth className="shadow-lg shadow-orange-700/20">
              <span>{t("navAddProduct")}</span>
              <ArrowRight className="w-5 h-5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t("testModalTitle")}
        description={t("testModalDesc")}
      >
        <div className="space-y-4 pt-2 text-left">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-500 block uppercase">{t("sampleCraft")}</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{t("sampleCraftDesc")}</p>
            <div className="flex gap-1.5 mt-2">
              <Badge variant="default">{language === "hi" ? "मिट्टी शिल्प" : "Terracotta"}</Badge>
              <Badge variant="success">{language === "hi" ? "हस्तनिर्मित" : "Handcrafted"}</Badge>
              <Badge variant="neutral">₹850</Badge>
            </div>
          </div>
          <Button variant="default" fullWidth onClick={() => setIsModalOpen(false)}>
            {t("closeModal")}
          </Button>
        </div>
      </Modal>
    </MobileShell>
  );
}
