"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language Selector / भाषा चयन"
      className={cn(
        "inline-flex items-center p-1 bg-slate-100 rounded-full border border-slate-200/80 select-none",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setLanguage("hi")}
        aria-pressed={language === "hi"}
        className={cn(
          "px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 min-h-[36px] flex items-center justify-center",
          language === "hi"
            ? "bg-terracotta-700 text-white shadow-sm"
            : "text-slate-600 hover:text-slate-900"
        )}
      >
        हिंदी
      </button>

      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        className={cn(
          "px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 min-h-[36px] flex items-center justify-center",
          language === "en"
            ? "bg-terracotta-700 text-white shadow-sm"
            : "text-slate-600 hover:text-slate-900"
        )}
      >
        English
      </button>
    </div>
  );
}
