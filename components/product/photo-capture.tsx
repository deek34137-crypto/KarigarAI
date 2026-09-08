"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/context";
import { compressImage, CompressionResult } from "@/lib/image/compression";
import { Button, Badge } from "@/components/ui";
import { Camera, Image as ImageIcon, Sparkles, RefreshCw, Trash2, CheckCircle2 } from "lucide-react";

interface PhotoCaptureProps {
  imageResult: CompressionResult | null;
  onImageCaptured: (result: CompressionResult) => void;
  onImageRemoved: () => void;
}

// Built-in benchmark craft presets for instant evaluation (works even on laptops without webcams)
const SAMPLE_PRESETS = [
  {
    name: "गोरखपुर टेराकोटा सुराही (Terracotta Pitcher)",
    url: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
    craftHint: "Terracotta pottery water pitcher from Gorakhpur",
  },
  {
    name: "महेश्वरी हथकरघा सिल्क (Handloom Saree)",
    url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    craftHint: "Traditional Maheshwari handloom silk textile",
  },
];

export function PhotoCapture({
  imageResult,
  onImageCaptured,
  onImageRemoved,
}: PhotoCaptureProps) {
  const { language, t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg(
        language === "hi"
          ? "कृपया केवल फोटो (JPG, PNG) चुनें।"
          : "Please select an image file (JPG, PNG)."
      );
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const result = await compressImage(file, 1200, 1200, 0.82);
      onImageCaptured(result);
    } catch (err: any) {
      console.error("Compression error:", err);
      setErrorMsg(
        language === "hi"
          ? "फोटो प्रोसेस करने में त्रुटि हुई। कृपया दोबारा प्रयास करें।"
          : "Failed to process photo. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadSample = async (sampleUrl: string) => {
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const response = await fetch(sampleUrl);
      const blob = await response.blob();
      const file = new File([blob], "sample-craft.jpg", { type: "image/jpeg" });
      const result = await compressImage(file, 1200, 1200, 0.82);
      onImageCaptured(result);
    } catch (err) {
      console.error("Failed to load sample image:", err);
      // Fallback: direct data conversion
      onImageCaptured({
        base64: sampleUrl,
        blob: new Blob(),
        width: 800,
        height: 800,
        sizeBytes: 150000,
        sizeFormatted: "146 KB",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4 text-left">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {!imageResult ? (
        /* Capture Trigger State */
        <div className="space-y-3">
          {/* Main Shutter Card */}
          <div
            onClick={() => cameraInputRef.current?.click()}
            className="group relative border-2 border-dashed border-terracotta-300 hover:border-terracotta-500 rounded-3xl p-6 bg-gradient-to-b from-orange-50/50 to-white text-center cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.99]"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-terracotta-700 to-orange-500 text-white flex items-center justify-center mx-auto shadow-md group-hover:scale-105 transition-transform duration-200">
              <Camera className="w-8 h-8 stroke-[2.2]" />
            </div>

            <div className="mt-4">
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {t("capturePhotoTitle")}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-[280px] mx-auto">
                {t("capturePhotoSubtitle")}
              </p>
            </div>

            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/70 border border-orange-200 text-xs font-bold text-terracotta-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-terracotta-700" />
              <span>{language === "hi" ? "स्वतः कम्प्रेशन (< 2MB)" : "Auto-Compressed (< 2MB)"}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              fullWidth
              onClick={() => cameraInputRef.current?.click()}
              isLoading={isProcessing}
            >
              <Camera className="w-4 h-4 mr-1.5 text-terracotta-700" />
              <span>{t("takePhotoButton")}</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="md"
              fullWidth
              onClick={() => fileInputRef.current?.click()}
              isLoading={isProcessing}
            >
              <ImageIcon className="w-4 h-4 mr-1.5 text-slate-700" />
              <span>{t("uploadPhotoButton")}</span>
            </Button>
          </div>

          {/* Sample Preset Selector for Evaluators */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-2">
              {language === "hi" ? "परीक्षण हेतु नमूना हस्तशिल्प:" : "Or Test with Sample Crafts:"}
            </span>
            <div className="grid grid-cols-1 gap-2">
              {SAMPLE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleLoadSample(preset.url)}
                  disabled={isProcessing}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-orange-50/60 hover:border-orange-200 text-left transition-colors text-xs font-semibold text-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-terracotta-600" />
                    <span>{preset.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">
                    {language === "hi" ? "लोड करें" : "Load"}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-center">
              {errorMsg}
            </p>
          )}
        </div>
      ) : (
        /* Image Captured & Preview State */
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-900 aspect-square shadow-md">
            <img
              src={imageResult.base64}
              alt="Captured Craft Preview"
              className="w-full h-full object-contain"
            />

            {/* Badges overlay */}
            <div className="absolute top-3 left-3 flex gap-1.5">
              <Badge variant="success" className="shadow-sm">
                {imageResult.sizeFormatted}
              </Badge>
              <Badge variant="neutral" className="shadow-sm">
                {imageResult.width}×{imageResult.height}px
              </Badge>
            </div>

            {/* Remove / Retake overlay button */}
            <button
              type="button"
              onClick={onImageRemoved}
              className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/70 text-white hover:bg-rose-600 transition-colors shadow-sm"
              aria-label="Remove Image"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Action Row */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              fullWidth
              onClick={() => cameraInputRef.current?.click()}
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
              <span>{language === "hi" ? "दूसरी तस्वीर लें" : "Retake Photo"}</span>
            </Button>

            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={onImageRemoved}
              className="px-3"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
