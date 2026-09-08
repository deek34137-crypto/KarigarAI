"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { PricingReasoningResult } from "@/lib/ai/schemas/pricing";
import { calculatePricingAction } from "@/app/actions/pricing";
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

  const handleConfirm = () => {
    const minP = pricingResult?.suggestedMinPrice || Math.round(currentBaseCost * 1.2);
    const maxP = pricingResult?.suggestedMaxPrice || Math.round(currentBaseCost * 1.55);
    const finalP = customPrice || pricingResult?.recommendedPrice || Math.round(currentBaseCost * 1.35);

    onPriceConfirmed({
      baseCost: currentBaseCost,
      priceMin: minP,
      priceMax: maxP,
      suggestedPrice: finalP,
      reasoningEn:
        pricingResult?.reasoningEnglish ||
        `Calculated based on ₹${currentBaseCost} production cost with 35% artisan profit margin.`,
      reasoningHi:
        pricingResult?.reasoningHindi ||
        `कुल उत्पादन लागत ₹${currentBaseCost} और कारीगर के 35% उचित लाभ पर आधारित।`,
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
              variant="default"
              size="md"
              fullWidth
              onClick={handleRunAiPricing}
              isLoading={isCalculatingAi}
              className="shadow-md"
            >
              <Sparkles className="w-4 h-4 mr-1.5 text-amber-300" />
              <span>
                {language === "hi"
                  ? "AI से उचित बाजार मूल्य सुझाव लें"
                  : "Get Fair AI Pricing Advice"}
              </span>
            </Button>
          ) : (
            /* AI Suggested Price Results Box */
            <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50/90 via-amber-50/50 to-orange-100/30 border border-orange-200/80 space-y-3.5 animate-in fade-in">
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
                <div className="p-2.5 rounded-xl bg-white border border-orange-200/70 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">
                    {language === "hi" ? "न्यूनतम उचित मूल्य" : "Minimum Safe Price"}
                  </span>
                  <span className="text-sm font-bold text-slate-800 block mt-0.5">
                    {formatINR(pricingResult.suggestedMinPrice)}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-terracotta-300 shadow-xs ring-1 ring-terracotta-600">
                  <span className="text-[10px] font-bold text-terracotta-700 uppercase block">
                    {t("recommendedPrice")}
                  </span>
                  <span className="text-base font-extrabold text-terracotta-800 block mt-0.5">
                    {formatINR(pricingResult.recommendedPrice)}
                  </span>
                </div>
              </div>

              {/* Bilingual Economic Reasoning */}
              <div className="p-3 rounded-xl bg-white/90 border border-slate-200/80 space-y-1 text-left">
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

              {/* Custom Final Price Option */}
              <div className="space-y-1 text-left pt-1">
                <label className="text-xs font-bold text-slate-700 block">
                  {language === "hi"
                    ? "अंतिम विक्रय मूल्य (कारीगर द्वारा पुष्टि):"
                    : "Final Selling Price (Artisan Approved):"}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={customPrice !== null ? customPrice : pricingResult.recommendedPrice}
                    onChange={(e) => setCustomPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-terracotta-600"
                  />
                </div>
              </div>

              {/* Mandatory Honest AI Disclaimer */}
              <div className="flex items-start gap-1.5 text-[11px] text-slate-500 bg-white/60 p-2 rounded-lg border border-slate-200/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{t("pricingDisclaimer")}</span>
              </div>
            </div>
          )}
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
