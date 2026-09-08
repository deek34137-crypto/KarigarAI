"use client";

import React, { useState } from "react";
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
  CardFooter,
  Badge,
  Slider,
  Modal,
  Skeleton,
} from "@/components/ui";
import {
  Camera,
  Languages,
  DollarSign,
  Share2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Sliders,
  Eye,
  Layers,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { formatINR } from "@/lib/utils";

export default function HomePage() {
  const { language, t } = useLanguage();
  const { profile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [demoLabourHours, setDemoLabourHours] = useState(5);
  const [demoMaterialCost, setDemoMaterialCost] = useState(300);

  // Live calculation for interactive slider demo
  const hourlyWage = 100;
  const overhead = 50;
  const demoBaseCost = demoMaterialCost + demoLabourHours * hourlyWage + overhead;
  const suggestedMin = Math.round(demoBaseCost * 1.25);
  const suggestedMax = Math.round(demoBaseCost * 1.5);

  return (
    <MobileShell>
      <div className="p-4 space-y-4">
        {/* Active Artisan Identity Badge */}
        {profile ? (
          <Link
            href="/profile"
            className="flex items-center justify-between p-3 rounded-xl bg-orange-50/80 border border-orange-200/80 shadow-xs hover:bg-orange-100/70 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-terracotta-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {profile.full_name ? profile.full_name.charAt(0) : "क"}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 block truncate">
                  {profile.full_name}
                </span>
                <span className="text-[10px] text-terracotta-700 font-semibold block truncate">
                  {profile.craft_type} • {profile.district || "Gorakhpur"}
                </span>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] shrink-0 ml-2">
              {t("navProfile")}
            </Badge>
          </Link>
        ) : (
          <Link
            href="/onboarding"
            className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-left"
          >
            <div>
              <span className="text-xs font-bold text-amber-900 block">
                {language === "hi" ? "कारीगर प्रोफ़ाइल जोड़ें" : "Create Artisan Profile"}
              </span>
              <span className="text-[10px] text-amber-700">
                {language === "hi" ? "1-मिनट में पंजीकरण करें" : "Register in 1 minute"}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-800" />
          </Link>
        )}

        {/* SIH Problem Statement Hero Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50/90 via-amber-50/50 to-orange-100/30 border border-orange-200/70 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-terracotta-100 text-terracotta-800">
              SIH26090
            </span>
            <span className="text-[11px] text-slate-600 font-semibold">
              MoSJE • Heritage & Culture
            </span>
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

        {/* Phase 1 Verification Status Banner */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold text-emerald-900">
              {t("phase0CompleteBadge")}
            </span>
          </div>
          <Badge variant="success" className="text-[10px]">
            {language === "hi" ? "सक्रिय" : "Active"}
          </Badge>
        </div>

        {/* The 3-Minute User Journey */}
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
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-terracotta-700 flex items-center justify-center shrink-0">
                <Camera className="w-4 h-4" />
              </div>
              <div className="text-left flex-1">
                <h4 className="text-sm font-bold text-slate-900">
                  {language === "hi" ? "1. तस्वीर लें (Camera)" : "1. Capture Photo"}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === "hi"
                    ? "Gemini Multimodal AI शिल्प, सामग्री और बनावट की पहचान करता है।"
                    : "Gemini Multimodal AI detects craft type, material, and visual traits."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Languages className="w-4 h-4" />
              </div>
              <div className="text-left flex-1">
                <h4 className="text-sm font-bold text-slate-900">
                  {language === "hi" ? "2. बोलकर बताएं (Voice)" : "2. Speak Naturally"}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === "hi"
                    ? "हिंदी में बोलें — AI पेशेवर हिंदी और अंग्रेजी शीर्षक व विवरण बनाएगा।"
                    : "Speak in Hindi — AI crafts bilingual titles, descriptions, and SEO tags."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4" />
              </div>
              <div className="text-left flex-1">
                <h4 className="text-sm font-bold text-slate-900">
                  {language === "hi" ? "3. पारदर्शी मूल्य (Fair Price)" : "3. Fair Pricing"}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === "hi"
                    ? "सामग्री + श्रम का पारदर्शी हिसाब और AI समर्थित उचित लाभ सुझाव।"
                    : "Deterministic cost formula + AI market reasoning ensures no underpricing."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Share2 className="w-4 h-4" />
              </div>
              <div className="text-left flex-1">
                <h4 className="text-sm font-bold text-slate-900">
                  {language === "hi" ? "4. डिजिटल बाजार लिंकेज" : "4. Market Linkage"}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === "hi"
                    ? "1-टैप में व्हाट्सएप लिंक और सार्वजनिक वेब पेज पर साझा करें।"
                    : "Shareable public web link with 1-tap WhatsApp direct buyer inquiry."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Phase 1 Design System Tokens Live Demo */}
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
            {/* Interactive Pricing Sliders */}
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

            {/* Calculated Output Card */}
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

            {/* Interactive Modal Trigger */}
            <div className="pt-2 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => setIsModalOpen(true)}
              >
                <Eye className="w-4 h-4 mr-1.5" />
                {t("testModalTitle")}
              </Button>

              <Button
                variant="default"
                size="sm"
                fullWidth
                onClick={() => {
                  setDemoMaterialCost(450);
                  setDemoLabourHours(8);
                }}
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                {language === "hi" ? "नमूना भरें" : "Load Sample"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Primary CTA (Navigates to Add Product) */}
        <div className="pt-2">
          <Link href="/products/new" className="block focus:outline-none">
            <Button variant="default" size="lg" fullWidth className="shadow-lg shadow-orange-700/20">
              <span>{t("navAddProduct")}</span>
              <ArrowRight className="w-5 h-5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Accessible Modal Demo */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t("testModalTitle")}
        description={t("testModalDesc")}
      >
        <div className="space-y-4 pt-2 text-left">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-500 block uppercase">
              {t("sampleCraft")}
            </span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">
              {t("sampleCraftDesc")}
            </p>
            <div className="flex gap-1.5 mt-2">
              <Badge variant="default">मिट्टी शिल्प</Badge>
              <Badge variant="success">हस्तनिर्मित</Badge>
              <Badge variant="neutral">₹850</Badge>
            </div>
          </div>

          <Button
            variant="default"
            fullWidth
            onClick={() => setIsModalOpen(false)}
          >
            {t("closeModal")}
          </Button>
        </div>
      </Modal>
    </MobileShell>
  );
}
