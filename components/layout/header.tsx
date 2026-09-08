"use client";

import React from "react";
import Link from "next/link";
import { LanguageToggle } from "@/components/language";
import { useLanguage } from "@/lib/i18n/context";

export function Header() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-100/80 px-4 py-3 shadow-xs">
      <div className="flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 focus:outline-none">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-terracotta-700 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            क
          </div>
          <div className="text-left">
            <span className="text-lg font-bold tracking-tight text-slate-900 block leading-none">
              Karigar<span className="text-terracotta-600">AI</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-500 mt-0.5 block leading-none">
              {t("tagline")}
            </span>
          </div>
        </Link>

        {/* Right side: Language Toggle */}
        <div className="flex items-center gap-2">
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
