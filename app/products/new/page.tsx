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
import { BeforeAfterSlider } from "@/components/image-studio";
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
import { processImageStudioAction } from "@/app/actions/image-studio";
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
  Wand2,
} from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const { profile } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [imageResult, setImageResult] = useState<CompressionResult | null>(null);
  const [oralDescription, setOralDescription] = useState("");

  // AI Image Studio State (Phase 5)
  const [studioProcessedBase64, setStudioProcessedBase64] = useState<string | null>(null);
  const [isProcessingStudio, setIsProcessingStudio] = useState(false);
  const [studioBgRemoved, setStudioBgRemoved] = useState(false);
  const [selectedImageChoice, setSelectedImageChoice] = useState<"original" | "processed">("original");

  // AI Catalog State (Phase 4)
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [catalogResult, setCatalogResult] = useState<CatalogGenerationResult | null>(null);
  const [visionResult, setVisionResult] = useState<ProductAnalysisResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Active image used for downstream cataloging and display
  const activeImageBase64 =
    selectedImageChoice === "processed" && studioProcessedBase64
      ? studioProcessedBase64
      : imageResult?.base64 || "";

  const handleNext = () => {
    if (currentStep === 1 && !imageResult) return;
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Run AI Image Studio: Background Removal & 1:1 Normalization
  const handleProcessImageStudio = async () => {
    if (!imageResult) return;

    setIsProcessingStudio(true);
    try {
      const res = await processImageStudioAction({
        imageBase64: imageResult.base64,
        removeBg: true,
        quality: 85,
      });

      if (res.success && res.processedBase64) {
        setStudioProcessedBase64(res.processedBase64);
        setStudioBgRemoved(res.bgRemoved);
        setSelectedImageChoice("processed");
      }
    } catch (err) {
      console.warn("Image studio processing failed:", err);
    } finally {
      setIsProcessingStudio(false);
    }
  };

  // Run Gemini Multimodal Catalog Pipeline
  const handleGenerateAiCatalog = async () => {
    if (!activeImageBase64) return;

    setIsGeneratingAi(true);
    setAiError(null);

    try {
      const res = await generateCompleteCatalogPipelineAction({
        imageBase64: activeImageBase64,
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
        {/* STEP 1: PHOTO CAPTURE & AI IMAGE STUDIO (PHASE 5) */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <PhotoCapture
              imageResult={imageResult}
              onImageCaptured={(res) => {
                setImageResult(res);
                setStudioProcessedBase64(null);
                setSelectedImageChoice("original");
                setCatalogResult(null);
                setVisionResult(null);
              }}
              onImageRemoved={() => {
                setImageResult(null);
                setStudioProcessedBase64(null);
                setSelectedImageChoice("original");
                setCatalogResult(null);
              }}
            />

            {/* AI Image Studio Trigger & Before/After Comparison */}
            {imageResult && (
              <div className="pt-1">
                {!studioProcessedBase64 ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    fullWidth
                    onClick={handleProcessImageStudio}
                    isLoading={isProcessingStudio}
                    className="border border-saffron-300 shadow-xs"
                  >
                    <Wand2 className="w-4 h-4 mr-1.5 text-amber-700" />
                    <span>
                      {language === "hi"
                        ? "AI स्टूडियो में साफ करें (बैकग्राउंड हटाएं)"
                        : "Clean in AI Studio (Remove Background & 1:1)"}
                    </span>
                  </Button>
                ) : (
                  <Card className="p-3.5 space-y-3">
                    <BeforeAfterSlider
                      originalImage={imageResult.base64}
                      processedImage={studioProcessedBase64}
                      isBgRemoved={studioBgRemoved}
                      selectedImage={selectedImageChoice}
                      onSelectImage={(choice) => setSelectedImageChoice(choice)}
                    />
                  </Card>
                )}
              </div>
            )}

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
            {/* Active Thumbnail banner */}
            {activeImageBase64 && (
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-orange-50/70 border border-orange-200/80 text-left">
                <img
                  src={activeImageBase64}
                  alt="Thumbnail"
                  className="w-12 h-12 rounded-lg object-cover border border-orange-200 shrink-0 bg-white"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-900 block truncate">
                    {selectedImageChoice === "processed"
                      ? language === "hi" ? "स्टूडियो फोटो चयनित" : "Studio Photo Selected"
                      : language === "hi" ? "मूल फोटो सुरक्षित है" : "Original Photo Selected"}
                  </span>
                  <span className="text-[10px] text-terracotta-700 font-semibold">
                    {selectedImageChoice === "processed"
                      ? "1000×1000px • 1:1 Studio Standard"
                      : `${imageResult?.sizeFormatted} • ${imageResult?.width}×${imageResult?.height}px`}
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
                    {language === "hi" ? "मूल्य निर्धारण एवं अंतिम समीक्षा" : "Pricing & Final Publishing"}
                  </CardTitle>
                  <Badge variant="success">Phase 5 Complete</Badge>
                </div>
                <CardDescription>
                  {language === "hi"
                    ? "स्टूडियो फोटो एवं द्विभाषी विवरण तैयार हैं। अगले चरण में मूल्य निर्धारण जोड़ा जाएगा।"
                    : "Studio photo & bilingual listing ready. Ready for Phase 6 pricing assistant."}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Visual Preview with Studio Badge */}
                <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-video bg-[#FAFAF9]">
                  <img
                    src={activeImageBase64}
                    alt="Product Final Preview"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-2 left-2">
                    <Badge variant={selectedImageChoice === "processed" ? "success" : "neutral"}>
                      {selectedImageChoice === "processed" ? "AI Studio Cleaned" : "Original Photo"}
                    </Badge>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200/80">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">
                    {catalogResult?.titleHindi}
                  </span>
                  <span className="text-xs font-extrabold text-slate-900 block mt-0.5">
                    {catalogResult?.titleEnglish}
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
                  <span>Phase 5 Complete — Standing by for Phase 6 Pricing</span>
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
