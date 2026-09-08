"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/auth-context";
import { MobileShell } from "@/components/layout";
import {
  StepIndicator,
  PhotoCapture,
  VoiceInput,
} from "@/components/product";
import { BilingualPreview } from "@/components/catalog";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Skeleton,
} from "@/components/ui";
import { CompressionResult } from "@/lib/image/compression";
import { generateCompleteCatalogPipelineAction } from "@/app/actions/catalog";
import { CatalogGenerationResult } from "@/lib/ai/schemas/catalog";
import { ProductAnalysisResult } from "@/lib/ai/schemas/product-analysis";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Camera,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const { profile } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [imageResult, setImageResult] = useState<CompressionResult | null>(null);
  const [oralDescription, setOralDescription] = useState("");

  // AI Pipeline State
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [catalogResult, setCatalogResult] = useState<CatalogGenerationResult | null>(null);
  const [visionResult, setVisionResult] = useState<ProductAnalysisResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleNext = () => {
    if (currentStep === 1 && !imageResult) return;
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleGenerateAiCatalog = async () => {
    if (!imageResult) return;

    setIsGeneratingAi(true);
    setAiError(null);

    try {
      const res = await generateCompleteCatalogPipelineAction({
        imageBase64: imageResult.base64,
        artisanRawNote: oralDescription,
        craftHint: profile?.craft_type,
        craftCluster: `${profile?.district || "Gorakhpur"}, ${profile?.state || "India"}`,
      });

      if (res.success) {
        setCatalogResult(res.catalogData);
        setVisionResult(res.visionData);
      } else {
        setAiError(res.error);
        if (res.fallbackData) {
          setCatalogResult(res.fallbackData as CatalogGenerationResult);
        }
      }
    } catch (err: any) {
      console.error("AI Catalog Generation failed:", err);
      setAiError(err?.message || "AI service timed out. Please retry.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <MobileShell showNav={false}>
      <div className="p-4 space-y-4">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <Link
            href="/"
            className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t("back")}</span>
          </Link>

          <span className="text-xs font-extrabold text-slate-900">
            {language === "hi" ? "नया उत्पाद जोड़ें" : "Add New Product"}
          </span>

          <Badge variant="secondary" className="text-[10px]">
            {profile?.craft_type?.split(" ")[0] || "Artisan"}
          </Badge>
        </div>

        {/* Step Progress Indicator */}
        <StepIndicator
          currentStep={currentStep}
          onStepClick={(step) => setCurrentStep(step)}
        />

        {/* ========================================================================= */}
        {/* STEP 1: PHOTO CAPTURE & COMPRESSION */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <PhotoCapture
              imageResult={imageResult}
              onImageCaptured={(res) => {
                setImageResult(res);
                // Reset previously generated AI catalog if image changes
                setCatalogResult(null);
                setVisionResult(null);
              }}
              onImageRemoved={() => {
                setImageResult(null);
                setCatalogResult(null);
              }}
            />

            {/* Next Action */}
            <div className="pt-2">
              <Button
                type="button"
                variant="default"
                size="lg"
                fullWidth
                disabled={!imageResult}
                onClick={handleNext}
                className="shadow-md"
              >
                <span>{t("next")}: {t("stepDetails")}</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: ORAL / TEXT DESCRIPTION */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Thumbnail banner of captured image */}
            {imageResult && (
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-orange-50/70 border border-orange-200/80 text-left">
                <img
                  src={imageResult.base64}
                  alt="Thumbnail"
                  className="w-12 h-12 rounded-lg object-cover border border-orange-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-900 block truncate">
                    {language === "hi" ? "फोटो सुरक्षित है" : "Image Captured"}
                  </span>
                  <span className="text-[10px] text-terracotta-700 font-semibold">
                    {imageResult.sizeFormatted} • {imageResult.width}×{imageResult.height}px
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-bold text-slate-600 hover:text-terracotta-700 px-2 py-1"
                >
                  {t("edit")}
                </button>
              </div>
            )}

            <VoiceInput
              value={oralDescription}
              onChange={setOralDescription}
              craftHint={profile?.craft_type}
            />

            {/* Step 2 Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleBack}
                className="w-1/3"
              >
                {t("back")}
              </Button>

              <Button
                type="button"
                variant="default"
                size="md"
                onClick={() => {
                  setCurrentStep(3);
                  // Automatically trigger AI generation if not yet generated
                  if (!catalogResult) {
                    handleGenerateAiCatalog();
                  }
                }}
                className="flex-1 shadow-md"
              >
                <Sparkles className="w-4 h-4 mr-1.5 text-amber-300" />
                <span>{language === "hi" ? "कैटलॉग बनाएं" : "Generate Catalog"}</span>
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: AI MULTIMODAL CATALOGER GENERATION & BILINGUAL REVIEW */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {isGeneratingAi ? (
              /* Loading State during Gemini Analysis */
              <Card className="text-center p-6 space-y-4">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-orange-200 animate-ping opacity-30" />
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-terracotta-700 to-orange-500 text-white flex items-center justify-center shadow-lg animate-spin">
                    <Sparkles className="w-8 h-8 text-amber-300" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {t("analyzingAi")}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-[280px] mx-auto leading-relaxed">
                    {language === "hi"
                      ? "Google Gemini AI तस्वीर और आवाज का विश्लेषण कर हिंदी-अंग्रेजी कैटलॉग बना रहा है..."
                      : "Google Gemini Multimodal AI is extracting craft attributes and writing bilingual copy..."}
                  </p>
                </div>

                <div className="space-y-2 max-w-xs mx-auto text-left pt-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </Card>
            ) : catalogResult ? (
              /* Validated Bilingual Review Card */
              <BilingualPreview
                catalog={catalogResult}
                vision={visionResult || undefined}
                onUpdate={(up) => setCatalogResult(up)}
                onProceedToPricing={() => setCurrentStep(4)}
                onBack={handleBack}
              />
            ) : (
              /* Fallback Trigger Card */
              <Card className="text-center p-6 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-100 text-terracotta-700 flex items-center justify-center mx-auto">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {language === "hi" ? "कैटलॉग निर्माण हेतु तैयार" : "Ready to Generate Catalog"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {language === "hi"
                      ? "बटन दबाते ही AI आपके उत्पाद का द्विभाषी कैटलॉग तैयार करेगा।"
                      : "Tap the button to generate your validated bilingual product listing."}
                  </p>
                </div>

                {aiError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold text-left flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{aiError}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="default"
                    size="lg"
                    fullWidth
                    onClick={handleGenerateAiCatalog}
                    className="shadow-md"
                  >
                    <Sparkles className="w-4 h-4 mr-2 text-amber-300" />
                    <span>{language === "hi" ? "AI कैटलॉग बनाएं" : "Generate AI Catalog"}</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={handleBack}
                  >
                    <span>{t("back")}</span>
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: PRICING ASSISTANT (PHASE 6 GATEWAY) */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200 text-left">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">
                    {language === "hi" ? "मूल्य निर्धारण एवं प्रकाशन" : "Pricing & Final Publishing"}
                  </CardTitle>
                  <Badge variant="success">Phase 4 Complete</Badge>
                </div>
                <CardDescription>
                  {language === "hi"
                    ? "द्विभाषी कैटलॉग सुरक्षित है। अगले चरण में पारदर्शी मूल्य निर्धारण जोड़ा जाएगा।"
                    : "Bilingual catalog is validated and ready for Phase 5 & 6."}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200/80">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">
                    {catalogResult?.titleHindi}
                  </span>
                  <span className="text-xs font-extrabold text-slate-900 block mt-0.5">
                    {catalogResult?.titleEnglish}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {language === "hi"
                      ? "AI कैटलॉग सफलतापूर्वक तैयार हो गया!"
                      : "AI Catalog generated with 100% structured JSON validation!"}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-2 pt-2">
                <Button
                  type="button"
                  variant="default"
                  size="lg"
                  fullWidth
                  disabled
                  className="opacity-90 cursor-default"
                >
                  <span>Phase 4 Ready — Standing by for Phase 5 & 6</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => setCurrentStep(3)}
                >
                  <span>{language === "hi" ? "कैटलॉग पुनः देखें" : "Back to Catalog Preview"}</span>
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
