"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { PricingReasoningResult } from "@/lib/ai/schemas/pricing";
import { calculatePricingAction } from "@/app/actions/pricing";
import {
  calculateBuyerPurchaseLikelihood,
  BuyerLikelihoodResult,
} from "@/lib/pricing/conversion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Button,
  Slider,
  Input,
} from "@/components/ui";
import {
  DollarSign,
  Sparkles,
  Calculator,
  Check,
  ShieldCheck,
  Info,
  TrendingUp,
  RotateCcw,
  Percent,
  AlertTriangle,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

interface PricingCalculatorProps {
  craftType?: string;
  material?: string;
  initialBaseCost?: number;
  onPriceConfirmed: (pricingData: {
    baseCost: number;
    priceMin: number;
    priceMax: number;
    suggestedPrice: number;
    reasoningEn: string;
    reasoningHi: string;
  }) => void;
  onBack: () => void;
}

export function PricingCalculator({
  craftType = "Terracotta Pottery",
  material = "Natural Clay",
  initialBaseCost,
  onPriceConfirmed,
  onBack,
}: PricingCalculatorProps) {
  const { language, t } = useLanguage();

  // Cost inputs state
  const [materialCost, setMaterialCost] = useState(200);
  const [labourHours, setLabourHours] = useState(4);
  const [hourlyWage, setHourlyWage] = useState(100);
  const [overheadCost, setOverheadCost] = useState(50);
  const [intricacyLevel, setIntricacyLevel] = useState<"Standard" | "Detailed" | "Masterpiece">("Detailed");

  // AI Reasoning Result State
  const [isCalculatingAi, setIsCalculatingAi] = useState(false);
  const [pricingResult, setPricingResult] = useState<PricingReasoningResult | null>(null);
  const [customPrice, setCustomPrice] = useState<number | null>(null);
  const [reasoningLang, setReasoningLang] = useState<"hi" | "en">(language);

  // Sync reasoning language when global language preference changes
  useEffect(() => {
    setReasoningLang(language);
  }, [language]);

  // Deterministic Base Cost Calculation
  const totalLabourCost = labourHours * hourlyWage;
  const currentBaseCost = materialCost + totalLabourCost + overheadCost;

  const handleRunAiPricing = async () => {
    setIsCalculatingAi(true);
    try {
      const res = await calculatePricingAction({
        materialCost,
        labourHours,
        hourlyWage,
        overheadCost,
        craftType,
        material,
        intricacyLevel,
      });

      if (res.success) {
        setPricingResult(res.data);
        setCustomPrice(res.data.recommendedPrice);
      }
    } catch (err) {
      console.error("AI Pricing calculation failed:", err);
    } finally {
      setIsCalculatingAi(false);
    }
  };

  // Benchmark and Active Selling Price Calculations
  const activeMinPrice =
    pricingResult?.suggestedMinPrice || Math.round(currentBaseCost * 1.2);
  const activeRecommendedPrice =
    pricingResult?.recommendedPrice ||
    Math.round(
      currentBaseCost *
        (intricacyLevel === "Masterpiece" ? 1.5 : intricacyLevel === "Detailed" ? 1.35 : 1.25)
    );
  const activeMaxPrice =
    pricingResult?.suggestedMaxPrice ||
    Math.round(
      currentBaseCost *
        (intricacyLevel === "Masterpiece" ? 1.7 : intricacyLevel === "Detailed" ? 1.55 : 1.4)
    );

  const activeSellingPrice = customPrice !== null ? customPrice : activeRecommendedPrice;

  const likelihood: BuyerLikelihoodResult = calculateBuyerPurchaseLikelihood({
    userPrice: activeSellingPrice,
    baseCost: currentBaseCost,
    recommendedPrice: activeRecommendedPrice,
    suggestedMinPrice: activeMinPrice,
    suggestedMaxPrice: activeMaxPrice,
  });

  const handleConfirm = () => {
    onPriceConfirmed({
      baseCost: currentBaseCost,
      priceMin: activeMinPrice,
      priceMax: activeMaxPrice,
      suggestedPrice: activeSellingPrice,
      reasoningEn:
        pricingResult?.reasoningEnglish ||
        `Calculated based on ₹${currentBaseCost} production cost with ${likelihood.marginPercent}% artisan profit margin (${likelihood.probabilityPercent}% buyer purchase likelihood).`,
      reasoningHi:
        pricingResult?.reasoningHindi ||
        `कुल उत्पादन लागत ₹${currentBaseCost} और कारीगर के ${likelihood.marginPercent}% लाभ पर आधारित (${likelihood.probabilityPercent}% खरीदार संभावना)।`,
    });
  };

  return (
    <div className="space-y-4 text-left">
      {/* Pricing Header Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block leading-tight">
              {t("pricingTitle")}
            </span>
            <span className="text-[10px] text-emerald-800 font-semibold">
              {language === "hi" ? "पारदर्शी लागत + AI मूल्य तर्क" : "Deterministic Cost + AI Reasoning"}
            </span>
          </div>
        </div>

        <Badge variant="success" className="text-[10px]">
          100% Transparent
        </Badge>
      </div>

      {/* Main Cost Inputs Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-terracotta-700" />
              <span>{language === "hi" ? "उत्पादन लागत इनपुट" : "Production Cost Inputs"}</span>
            </CardTitle>
            <Badge variant="secondary">{craftType}</Badge>
          </div>
          <CardDescription>
            {language === "hi"
              ? "स्लाइडर द्वारा वास्तविक खर्च दर्ज करें। AI आपके समय और मेहनत का उचित मूल्य निकालेगा।"
              : "Adjust sliders for true costs. AI calculates fair margins to prevent undervaluation."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Slider 1: Material Cost */}
          <Slider
            label={t("materialCostLabel")}
            value={materialCost}
            min={50}
            max={2000}
            step={50}
            unit="₹"
            onChange={setMaterialCost}
          />

          {/* Slider 2: Labour Hours */}
          <Slider
            label={t("labourHoursLabel")}
            value={labourHours}
            min={1}
            max={30}
            step={1}
            unit="hrs: "
            onChange={setLabourHours}
          />

          {/* Slider 3: Hourly Wage Rate */}
          <Slider
            label={t("hourlyRateLabel")}
            value={hourlyWage}
            min={50}
            max={300}
            step={25}
            unit="₹/hr: "
            onChange={setHourlyWage}
          />

          {/* Slider 4: Overhead Costs */}
          <Slider
            label={t("overheadLabel")}
            value={overheadCost}
            min={10}
            max={500}
            step={10}
            unit="₹"
            onChange={setOverheadCost}
          />

          {/* Intricacy Level Selector */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-slate-700 block">
              {language === "hi" ? "कारीगरी का स्तर (Craft Intricacy)" : "Craftsmanship Level"}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["Standard", "Detailed", "Masterpiece"] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setIntricacyLevel(lvl)}
                  className={`p-2 rounded-xl border text-center text-xs font-bold transition-all ${
                    intricacyLevel === lvl
                      ? "bg-orange-50 border-terracotta-700 text-terracotta-800 ring-1 ring-terracotta-600 shadow-xs"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {lvl === "Standard"
                    ? language === "hi" ? "सरल (Standard)" : "Standard"
                    : lvl === "Detailed"
                    ? language === "hi" ? "बारीक (Detailed)" : "Detailed"
                    : language === "hi" ? "उत्कृष्ट (Master)" : "Masterpiece"}
                </button>
              ))}
            </div>
          </div>

          {/* Deterministic Production Cost Breakdown Box */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600 font-medium">
              <span>सामग्री (Material):</span>
              <span className="font-bold text-slate-800">{formatINR(materialCost)}</span>
            </div>
            <div className="flex justify-between text-slate-600 font-medium">
              <span>कारीगर श्रम ({labourHours} hrs × ₹{hourlyWage}/hr):</span>
              <span className="font-bold text-slate-800">{formatINR(totalLabourCost)}</span>
            </div>
            <div className="flex justify-between text-slate-600 font-medium">
              <span>ईंधन व पैकिंग (Overhead):</span>
              <span className="font-bold text-slate-800">{formatINR(overheadCost)}</span>
            </div>

            <div className="pt-2 border-t border-slate-300 flex justify-between items-center text-sm font-extrabold text-slate-900">
              <span>{t("baseCostCalculated")}:</span>
              <span className="text-base text-terracotta-800">{formatINR(currentBaseCost)}</span>
            </div>
          </div>

          {/* Action Trigger for Gemini AI Pricing Reasoning */}
          {!pricingResult ? (
            <Button
              type="button"
              variant="outline"
              size="md"
              fullWidth
              onClick={handleRunAiPricing}
              isLoading={isCalculatingAi}
              className="border-terracotta-300 text-terracotta-800 hover:bg-orange-50/60 shadow-xs"
            >
              <Sparkles className="w-4 h-4 mr-1.5 text-terracotta-600" />
              <span>
                {language === "hi"
                  ? "AI से बाजार मूल्य व मांग विश्लेषण लें"
                  : "Get AI Market & Demand Analysis"}
              </span>
            </Button>
          ) : (
            /* AI Suggested Price Results Box */
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-orange-50/90 via-amber-50/50 to-orange-100/30 border border-orange-200/80 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-terracotta-700" />
                  <span className="text-xs font-bold text-slate-900">
                    {language === "hi" ? "AI उचित मूल्य विश्लेषण" : "AI Pricing Recommendation"}
                  </span>
                </div>
                <Badge variant="success" className="text-[10px]">
                  +{pricingResult.suggestedMarkupPercent}% Markup
                </Badge>
              </div>

              {/* Price Highlights Grid */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded-xl bg-white border border-orange-200/70 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">
                    {language === "hi" ? "न्यूनतम सुरक्षित मूल्य" : "Minimum Safe Price"}
                  </span>
                  <span className="text-sm font-bold text-slate-800 block mt-0.5">
                    {formatINR(pricingResult.suggestedMinPrice)}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-white border border-terracotta-300 shadow-xs ring-1 ring-terracotta-600">
                  <span className="text-[10px] font-bold text-terracotta-700 uppercase block">
                    {t("recommendedPrice")}
                  </span>
                  <span className="text-sm font-extrabold text-terracotta-800 block mt-0.5">
                    {formatINR(pricingResult.recommendedPrice)}
                  </span>
                </div>
              </div>

              {/* Bilingual Economic Reasoning */}
              <div className="p-2.5 rounded-xl bg-white/90 border border-slate-200/80 space-y-1 text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Info className="w-3 h-3 text-terracotta-700" />
                    <span>{language === "hi" ? "आर्थिक तर्क (Reasoning):" : "Economic Logic:"}</span>
                  </span>

                  {/* Toggle explanation language */}
                  <div className="flex gap-1 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setReasoningLang("hi")}
                      className={`px-1.5 py-0.5 rounded ${
                        reasoningLang === "hi" ? "bg-terracotta-700 text-white" : "text-slate-500"
                      }`}
                    >
                      हिंदी
                    </button>
                    <button
                      type="button"
                      onClick={() => setReasoningLang("en")}
                      className={`px-1.5 py-0.5 rounded ${
                        reasoningLang === "en" ? "bg-terracotta-700 text-white" : "text-slate-500"
                      }`}
                    >
                      EN
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {reasoningLang === "hi"
                    ? pricingResult.reasoningHindi
                    : pricingResult.reasoningEnglish}
                </p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CUSTOM SELLING PRICE & BUYER PURCHASE LIKELIHOOD GAUGE */}
          {/* ========================================================================= */}
          <div className="p-4 rounded-2xl bg-white border-2 border-terracotta-200 shadow-xs space-y-3.5 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-orange-100 text-terracotta-700 flex items-center justify-center font-bold">
                  <Percent className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    {language === "hi"
                      ? "आपका विक्रय मूल्य एवं खरीदार मांग"
                      : "Your Selling Price & Buyer Demand"}
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    {language === "hi"
                      ? "मूल्य दर्ज करें — AI तुरंत बताएगा कितने % ग्राहक खरीदेंगे"
                      : "Enter price — AI instantly predicts buyer purchase chances"}
                  </p>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  likelihood.status === "optimal"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                    : likelihood.status === "high-demand"
                    ? "bg-blue-50 text-blue-700 border-blue-300"
                    : likelihood.status === "loss-risk"
                    ? "bg-red-50 text-red-700 border-red-300"
                    : likelihood.status === "moderate"
                    ? "bg-amber-50 text-amber-700 border-amber-300"
                    : "bg-rose-50 text-rose-700 border-rose-300"
                }`}
              >
                {likelihood.probabilityPercent}% {language === "hi" ? "खरीदारी संभावना" : "Buy Chance"}
              </span>
            </div>

            {/* Price Input with +/- 50 Adjustment Buttons */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  {language === "hi" ? "अंतिम विक्रय मूल्य तय करें:" : "Set Selling Price:"}
                </label>
                <span className="text-[11px] font-semibold text-slate-500">
                  {language === "hi" ? "लागत" : "Cost"}: {formatINR(currentBaseCost)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCustomPrice(Math.max(50, activeSellingPrice - 50))}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all border border-slate-300 active:scale-95"
                >
                  -₹50
                </button>

                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-extrabold text-slate-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={activeSellingPrice}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCustomPrice(isNaN(val) ? 0 : val);
                    }}
                    className="w-full pl-8 pr-4 py-2 rounded-xl border-2 border-terracotta-400 font-black text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-terracotta-600 bg-orange-50/20"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setCustomPrice(activeSellingPrice + 50)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all border border-slate-300 active:scale-95"
                >
                  +₹50
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {language === "hi" ? "1-टैप उचित विकल्प (Presets):" : "1-Tap Presets:"}
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setCustomPrice(activeMinPrice)}
                  className={`p-1.5 rounded-xl border text-center transition-all ${
                    activeSellingPrice === activeMinPrice
                      ? "bg-blue-50 border-blue-500 text-blue-800 ring-1 ring-blue-500 font-bold"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 text-[11px]"
                  }`}
                >
                  <span className="block text-[9px] uppercase font-semibold text-slate-500">
                    {language === "hi" ? "त्वरित बिक्री" : "Quick Sell"}
                  </span>
                  <span className="block font-extrabold text-xs text-blue-700">₹{activeMinPrice}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCustomPrice(activeRecommendedPrice)}
                  className={`p-1.5 rounded-xl border text-center transition-all ${
                    activeSellingPrice === activeRecommendedPrice
                      ? "bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500 font-bold"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 text-[11px]"
                  }`}
                >
                  <span className="block text-[9px] uppercase font-semibold text-slate-500">
                    {language === "hi" ? "AI संतुलित" : "AI Optimal"}
                  </span>
                  <span className="block font-extrabold text-xs text-emerald-700">
                    ₹{activeRecommendedPrice}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setCustomPrice(activeMaxPrice)}
                  className={`p-1.5 rounded-xl border text-center transition-all ${
                    activeSellingPrice === activeMaxPrice
                      ? "bg-amber-50 border-amber-500 text-amber-800 ring-1 ring-amber-500 font-bold"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 text-[11px]"
                  }`}
                >
                  <span className="block text-[9px] uppercase font-semibold text-slate-500">
                    {language === "hi" ? "प्रीमियम शिल्प" : "Premium Tier"}
                  </span>
                  <span className="block font-extrabold text-xs text-amber-700">₹{activeMaxPrice}</span>
                </button>
              </div>
            </div>

            {/* Buyer Likelihood Meter Box */}
            <div
              className={`p-3 rounded-xl border space-y-2 ${
                likelihood.status === "optimal"
                  ? "bg-emerald-50/70 border-emerald-200"
                  : likelihood.status === "high-demand"
                  ? "bg-blue-50/70 border-blue-200"
                  : likelihood.status === "loss-risk"
                  ? "bg-red-50/70 border-red-200"
                  : likelihood.status === "moderate"
                  ? "bg-amber-50/70 border-amber-200"
                  : "bg-rose-50/70 border-rose-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <TrendingUp
                    className={`w-4 h-4 ${
                      likelihood.status === "optimal"
                        ? "text-emerald-600"
                        : likelihood.status === "high-demand"
                        ? "text-blue-600"
                        : likelihood.status === "loss-risk"
                        ? "text-red-600"
                        : likelihood.status === "moderate"
                        ? "text-amber-600"
                        : "text-rose-600"
                    }`}
                  />
                  <span className="text-xs font-black text-slate-800">
                    {language === "hi" ? likelihood.headlineHi : likelihood.headlineEn}
                  </span>
                </div>

                {/* Profit Margin Badge */}
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    likelihood.marginPercent >= 0
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {likelihood.marginPercent >= 0
                    ? `+${likelihood.marginPercent}% लाभ (₹${activeSellingPrice - currentBaseCost})`
                    : `${likelihood.marginPercent}% घाटा (-₹${currentBaseCost - activeSellingPrice})`}
                </span>
              </div>

              {/* Color-Coded Animated Progress Bar */}
              <div className="w-full bg-slate-200/80 h-3 rounded-full overflow-hidden p-0.5 border border-slate-300/80">
                <div
                  className={`h-full rounded-full transition-all duration-300 ease-out ${
                    likelihood.status === "optimal"
                      ? "bg-gradient-to-r from-teal-500 to-emerald-500"
                      : likelihood.status === "high-demand"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                      : likelihood.status === "loss-risk"
                      ? "bg-red-500"
                      : likelihood.status === "moderate"
                      ? "bg-gradient-to-r from-amber-400 to-orange-500"
                      : "bg-rose-500"
                  }`}
                  style={{
                    width: `${Math.min(100, Math.max(8, likelihood.probabilityPercent))}%`,
                  }}
                />
              </div>

              {/* Bilingual Economic Advice */}
              <p className="text-[11px] text-slate-700 leading-relaxed pt-0.5">
                {language === "hi" ? likelihood.adviceHi : likelihood.adviceEn}
              </p>
            </div>

            {/* Mandatory Honest AI Disclaimer */}
            <div className="flex items-start gap-1.5 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{t("pricingDisclaimer")}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onBack}
            className="w-1/3"
          >
            {t("back")}
          </Button>

          <Button
            type="button"
            variant="default"
            size="md"
            onClick={handleConfirm}
            className="flex-1 shadow-md"
          >
            <Check className="w-4 h-4 mr-1.5" />
            <span>{language === "hi" ? "मूल्य सुरक्षित करें" : "Confirm Price"}</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
