"use client";

import React, { useState, useRef, useCallback } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { Badge, Button } from "@/components/ui";
import { Sparkles, Check, SlidersHorizontal, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BeforeAfterSliderProps {
  originalImage: string;
  processedImage: string;
  isBgRemoved?: boolean;
  selectedImage: "original" | "processed";
  onSelectImage: (choice: "original" | "processed") => void;
  className?: string;
}

export function BeforeAfterSlider({
  originalImage,
  processedImage,
  isBgRemoved = true,
  selectedImage,
  onSelectImage,
  className,
}: BeforeAfterSliderProps) {
  const { language } = useLanguage();
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <div className={cn("space-y-3.5 text-left", className)}>
      {/* Header Info with High-Contrast Judge Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-terracotta-100 flex items-center justify-center text-terracotta-700">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-extrabold text-slate-900">
            {language === "hi" ? "AI इमेज स्टूडियो (तुलना)" : "AI Image Studio (Comparison)"}
          </span>
        </div>
        <Badge
          variant="success"
          className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs"
        >
          {isBgRemoved
            ? language === "hi" ? "✓ बैकग्राउंड हटाया गया" : "✓ Background Removed"
            : language === "hi" ? "✓ 1:1 स्टूडियो परिमार्जित" : "✓ 1:1 Studio Standardized"}
        </Badge>
      </div>

      {/* Interactive Split-View Container */}
      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-slate-300 bg-slate-900 select-none cursor-ew-resize shadow-lg"
      >
        {/* Processed (After) Image - Full canvas base */}
        <img
          src={processedImage}
          alt="Studio Processed Craft"
          className="absolute inset-0 w-full h-full object-contain bg-[#FAFAF9]"
        />

        {/* Original (Before) Image - Clipped Overlay using CSS clipPath */}
        <img
          src={originalImage}
          alt="Original Craft Photo"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          style={{
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
            WebkitClipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
          }}
        />

        {/* Draggable Divider Handle Line */}
        <div
          className="absolute top-0 bottom-0 w-1.5 bg-white shadow-2xl cursor-ew-resize flex items-center justify-center -translate-x-1/2 z-20"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="w-10 h-10 rounded-full bg-white shadow-xl border-2 border-terracotta-700 flex items-center justify-center text-terracotta-700 active:scale-110 transition-transform">
            <SlidersHorizontal className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>

        {/* High-Contrast Floating Labels for Judges */}
        <div className="absolute bottom-3.5 left-3.5 z-10 pointer-events-none">
          <span className="px-3 py-1.5 rounded-lg bg-slate-950/90 border border-white/25 text-white text-xs font-black shadow-lg backdrop-blur-xs tracking-wide">
            {language === "hi" ? "📷 मूल फोटो (Before)" : "📷 Before (Original)"}
          </span>
        </div>
        <div className="absolute bottom-3.5 right-3.5 z-10 pointer-events-none">
          <span className="px-3 py-1.5 rounded-lg bg-terracotta-700/95 border border-orange-300/40 text-white text-xs font-black shadow-lg backdrop-blur-xs tracking-wide flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            {language === "hi" ? "✨ AI स्टूडियो (After)" : "✨ After (AI Studio 1:1)"}
          </span>
        </div>
      </div>

      {/* Prominent High-Contrast Instruction Banner for Judges */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-300 text-amber-950 text-center shadow-xs">
        <div className="text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5">
          <SlidersHorizontal className="w-4 h-4 text-terracotta-700" />
          <span>
            {language === "hi"
              ? "मूल फोटो (बाएं) vs AI स्टूडियो परिष्कृत फोटो (दाएं)"
              : "Original Photo (Left) vs AI Studio Enhanced (Right)"}
          </span>
        </div>
        <p className="text-[11px] sm:text-xs font-semibold text-amber-900 mt-1">
          {language === "hi"
            ? "सफेद स्लाइडर हैंडल को पकड़कर दाएं-बाएं खिसकाकर गुणवत्ता अंतर देखें"
            : "Drag the circular white slider left/right to compare the quality difference"}
        </p>
      </div>

      {/* Choice Selector: Use Processed or Original */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => onSelectImage("processed")}
          className={cn(
            "p-3 rounded-2xl border-2 text-xs sm:text-sm font-extrabold flex items-center justify-between transition-all",
            selectedImage === "processed"
              ? "bg-orange-50 border-terracotta-700 text-terracotta-900 ring-2 ring-terracotta-300 shadow-sm"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          )}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-terracotta-700" />
            <span>{language === "hi" ? "स्टूडियो फोटो चुनें" : "Use Studio Photo"}</span>
          </div>
          {selectedImage === "processed" && (
            <div className="w-5 h-5 rounded-full bg-terracotta-700 text-white flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelectImage("original")}
          className={cn(
            "p-3 rounded-2xl border-2 text-xs sm:text-sm font-extrabold flex items-center justify-between transition-all",
            selectedImage === "original"
              ? "bg-orange-50 border-terracotta-700 text-terracotta-900 ring-2 ring-terracotta-300 shadow-sm"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          )}
        >
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-slate-600" />
            <span>{language === "hi" ? "मूल फोटो रखें" : "Keep Original"}</span>
          </div>
          {selectedImage === "original" && (
            <div className="w-5 h-5 rounded-full bg-terracotta-700 text-white flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
