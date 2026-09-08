"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/context";
import { compressImage, CompressionResult } from "@/lib/image/compression";
import { Button, Badge } from "@/components/ui";
import {
  Camera,
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  Trash2,
  CheckCircle2,
  X,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

interface PhotoCaptureProps {
  imageResult: CompressionResult | null;
  onImageCaptured: (result: CompressionResult) => void;
  onImageRemoved: () => void;
}

// Built-in benchmark craft presets for instant evaluation (works even on laptops without webcams)
const SAMPLE_PRESETS = [
  {
    name: "गोरखपुर टेराकोटा सुराही (Terracotta Pitcher)",
    url: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
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
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Live Camera Viewfinder states
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [isRequestingCamera, setIsRequestingCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  // Stop camera tracks cleanly
  const stopCameraStream = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  // Close live camera modal
  const handleCloseCameraModal = () => {
    stopCameraStream();
    setIsCameraModalOpen(false);
  };

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Attach active camera stream to video element
  useEffect(() => {
    if (isCameraModalOpen && videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch((err) => {
        console.warn("Camera auto-play warning:", err);
      });
    }
  }, [isCameraModalOpen, cameraStream]);

  // Request browser camera permission and launch live viewfinder
  const handleStartCameraCapture = async (preferredFacing = facingMode) => {
    setErrorMsg(null);
    setCameraError(null);

    // If getUserMedia is not supported in current environment
    if (
      typeof window === "undefined" ||
      !navigator?.mediaDevices?.getUserMedia
    ) {
      cameraInputRef.current?.click();
      return;
    }

    setIsRequestingCamera(true);

    try {
      // Stop any existing stream
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }

      // Explicitly trigger the browser's camera permission prompt
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: preferredFacing },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setFacingMode(preferredFacing);
      setCameraStream(stream);
      setIsCameraModalOpen(true);
    } catch (err: any) {
      console.error("Camera access permission error:", err);
      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        setCameraError(t("cameraPermissionDenied"));
      } else if (
        err.name === "NotFoundError" ||
        err.name === "DevicesNotFoundError"
      ) {
        setCameraError(t("cameraNotFound"));
      } else {
        // Fallback to native OS camera/file selector
        cameraInputRef.current?.click();
      }
    } finally {
      setIsRequestingCamera(false);
    }
  };

  // Switch between front and rear camera
  const handleToggleFacingMode = async () => {
    const nextFacing = facingMode === "environment" ? "user" : "environment";
    await handleStartCameraCapture(nextFacing);
  };

  // Capture frame from video feed
  const handleCaptureSnapshot = async () => {
    if (!videoRef.current || isCapturing) return;

    setIsCapturing(true);
    try {
      const video = videoRef.current;
      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) throw new Error("Could not initialize canvas context");

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, width, height);

      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            setErrorMsg(
              language === "hi"
                ? "तस्वीर खींचने में त्रुटि हुई।"
                : "Failed to capture snapshot."
            );
            setIsCapturing(false);
            return;
          }

          const file = new File([blob], `karigar-craft-${Date.now()}.jpg`, {
            type: "image/jpeg",
          });

          // Close modal and stop stream immediately
          handleCloseCameraModal();

          // Compress and pass to parent
          setIsProcessing(true);
          try {
            const result = await compressImage(file, 1200, 1200, 0.82);
            onImageCaptured(result);
          } catch (compErr) {
            console.error("Compression error:", compErr);
            setErrorMsg(
              language === "hi"
                ? "फोटो प्रोसेस करने में त्रुटि हुई। कृपया दोबारा प्रयास करें।"
                : "Failed to process photo. Please try again."
            );
          } finally {
            setIsProcessing(false);
            setIsCapturing(false);
          }
        },
        "image/jpeg",
        0.92
      );
    } catch (err: any) {
      console.error("Snapshot error:", err);
      setIsCapturing(false);
    }
  };

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
    setCameraError(null);

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
    setCameraError(null);

    try {
      const response = await fetch(sampleUrl);
      const blob = await response.blob();
      const file = new File([blob], "sample-craft.jpg", { type: "image/jpeg" });
      const result = await compressImage(file, 1200, 1200, 0.82);
      onImageCaptured(result);
    } catch (err) {
      console.error("Failed to load sample image:", err);
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
      {/* Hidden File Inputs for Gallery/Fallback */}
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

      {/* Live In-App Camera Viewfinder Modal */}
      {isCameraModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("cameraModalTitle")}
          className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between overflow-hidden select-none"
        >
          {/* Top Controls Bar */}
          <div className="relative z-10 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-terracotta-600 flex items-center justify-center text-white shadow">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block leading-tight">
                  {t("cameraModalTitle")}
                </span>
                <span className="text-[10px] text-amber-300 flex items-center gap-1 font-medium">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  {t("cameraCaptureHint")}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCloseCameraModal}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-colors"
              aria-label="Close Camera"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Video Viewfinder Area */}
          <div className="relative flex-1 flex items-center justify-center bg-black overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-contain ${
                facingMode === "user" ? "scale-x-[-1]" : ""
              }`}
            />

            {/* Reticle / Craft Framing Overlay */}
            <div className="absolute inset-6 sm:inset-12 pointer-events-none flex items-center justify-center">
              <div className="relative w-full max-w-sm aspect-square border-2 border-white/20 rounded-3xl">
                {/* Corner Bracket Accents (Terracotta / Golden) */}
                <div className="absolute -top-1 -left-1 w-7 h-7 border-t-4 border-l-4 border-amber-400 rounded-tl-xl" />
                <div className="absolute -top-1 -right-1 w-7 h-7 border-t-4 border-r-4 border-amber-400 rounded-tr-xl" />
                <div className="absolute -bottom-1 -left-1 w-7 h-7 border-b-4 border-l-4 border-amber-400 rounded-bl-xl" />
                <div className="absolute -bottom-1 -right-1 w-7 h-7 border-b-4 border-r-4 border-amber-400 rounded-br-xl" />

                {/* Central Soft Focus Ring */}
                <div className="absolute inset-0 m-auto w-16 h-16 rounded-full border border-white/30 border-dashed animate-pulse" />
              </div>
            </div>
          </div>

          {/* Bottom Shutter & Controls Bar */}
          <div className="relative z-10 px-6 py-6 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-around">
            {/* Left: Gallery Fallback Button */}
            <button
              type="button"
              onClick={() => {
                handleCloseCameraModal();
                fileInputRef.current?.click();
              }}
              className="flex flex-col items-center gap-1 text-white/80 hover:text-white active:scale-95 transition-transform"
            >
              <div className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-[11px] font-medium tracking-wide">
                {t("uploadPhotoButton")}
              </span>
            </button>

            {/* Center: Big Shutter Button */}
            <button
              type="button"
              onClick={handleCaptureSnapshot}
              disabled={isCapturing}
              className="relative w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1 bg-white/20 hover:bg-white/30 active:scale-90 transition-all shadow-2xl focus:outline-none focus:ring-4 focus:ring-amber-400"
              aria-label={t("captureButton")}
            >
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-terracotta-700 shadow-md">
                {isCapturing ? (
                  <RefreshCw className="w-6 h-6 animate-spin text-terracotta-700" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-terracotta-700 ring-2 ring-terracotta-300" />
                )}
              </div>
            </button>

            {/* Right: Switch Front/Rear Camera Button */}
            <button
              type="button"
              onClick={handleToggleFacingMode}
              className="flex flex-col items-center gap-1 text-white/80 hover:text-white active:scale-95 transition-transform"
            >
              <div className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-white" />
              </div>
              <span className="text-[11px] font-medium tracking-wide">
                {t("switchCamera")}
              </span>
            </button>
          </div>
        </div>
      )}

      {!imageResult ? (
        /* Capture Trigger State */
        <div className="space-y-3">
          {/* Permission Denied or Device Error Notice */}
          {cameraError && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col gap-2.5">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="text-xs font-semibold leading-relaxed">
                  {cameraError}
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs bg-white border-amber-300 hover:bg-amber-100/50"
                >
                  <ImageIcon className="w-3.5 h-3.5 mr-1.5 text-amber-800" />
                  <span>{t("chooseFromGallery")}</span>
                </Button>
              </div>
            </div>
          )}

          {/* Main Shutter Card */}
          <div
            onClick={() => handleStartCameraCapture()}
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
              <span>
                {language === "hi"
                  ? "स्वतः कम्प्रेशन (< 2MB)"
                  : "Auto-Compressed (< 2MB)"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              fullWidth
              onClick={() => handleStartCameraCapture()}
              isLoading={isRequestingCamera || isProcessing}
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
              {language === "hi"
                ? "परीक्षण हेतु नमूना हस्तशिल्प:"
                : "Or Test with Sample Crafts:"}
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
              onClick={() => handleStartCameraCapture()}
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
              <span>
                {language === "hi" ? "दूसरी तस्वीर लें" : "Retake Photo"}
              </span>
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
