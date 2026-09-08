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
    <div className={cn("space-y-3 text-left", className)}>
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-terracotta-700" />
          <span className="text-xs font-bold text-slate-900">
            {language === "hi" ? "AI इमेज स्टूडियो (तुलना)" : "AI Image Studio (Comparison)"}
          </span>
        </div>
        <Badge variant={isBgRemoved ? "success" : "secondary"} className="text-[10px]">
          {isBgRemoved
            ? language === "hi" ? "बैकग्राउंड हटाया गया" : "Background Removed"
            : language === "hi" ? "1:1 क्रॉप एवं परिमार्जित" : "1:1 Standardized"}
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
        className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-900 select-none cursor-ew-resize shadow-md"
      >
        {/* Processed (After) Image - Background Base */}
        <img
          src={processedImage}
          alt="Studio Processed Craft"
          className="absolute inset-0 w-full h-full object-contain bg-[#FAFAF9]"
        />

        {/* Original (Before) Image - Clipped Overlay */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={originalImage}
            alt="Original Craft Photo"
            className="absolute inset-0 w-full h-full object-contain"
            style={{
              width: containerRef.current?.clientWidth || "100%",
              maxWidth: "none",
            }}
          />
        </div>

        {/* Draggable Divider Handle Line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize flex items-center justify-center -translate-x-1/2 z-20"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-md border-2 border-terracotta-700 flex items-center justify-center text-terracotta-700 active:scale-110 transition-transform">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Labels Overlay */}
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
          <span className="px-2 py-1 rounded-md bg-slate-900/80 text-white text-[10px] font-bold backdrop-blur-xs">
            {language === "hi" ? "मूल फोटो (Before)" : "Before (Original)"}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
          <span className="px-2 py-1 rounded-md bg-terracotta-700/90 text-white text-[10px] font-bold backdrop-blur-xs">
            {language === "hi" ? "AI स्टूडियो (After)" : "After (Studio)"}
          </span>
        </div>
      </div>

      {/* Helper text */}
      <p className="text-[11px] text-slate-500 text-center">
        {language === "hi"
          ? "स्लाइडर को दाएं-बाएं खिसकाकर बदलाव देखें"
          : "Drag slider left/right to compare Before vs After"}
      </p>

      {/* Choice Selector: Use Processed or Original */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          type="button"
          onClick={() => onSelectImage("processed")}
          className={cn(
            "p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all",
            selectedImage === "processed"
              ? "bg-orange-50 border-terracotta-700 text-terracotta-800 ring-1 ring-terracotta-600 shadow-xs"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          )}
        >
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-terracotta-700" />
            <span>{language === "hi" ? "स्टूडियो फोटो चुनें" : "Use Studio Photo"}</span>
          </div>
          {selectedImage === "processed" && (
            <Check className="w-3.5 h-3.5 text-terracotta-700 shrink-0" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelectImage("original")}
          className={cn(
            "p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all",
            selectedImage === "original"
              ? "bg-orange-50 border-terracotta-700 text-terracotta-800 ring-1 ring-terracotta-600 shadow-xs"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          )}
        >
          <div className="flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-slate-600" />
            <span>{language === "hi" ? "मूल फोटो रखें" : "Keep Original"}</span>
          </div>
          {selectedImage === "original" && (
            <Check className="w-3.5 h-3.5 text-terracotta-700 shrink-0" />
          )}
        </button>
      </div>
    </div>
  );
}
