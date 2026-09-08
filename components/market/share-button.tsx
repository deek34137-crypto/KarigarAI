"use client";

import React, { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

interface ShareButtonProps {
  url: string;
  title: string;
  text?: string;
  lang: "hi" | "en";
  className?: string;
  variant?: "outline" | "ghost" | "default";
  size?: "sm" | "md" | "icon";
}

export function ShareButton({
  url,
  title,
  text,
  lang,
  className = "",
  variant = "outline",
  size = "md",
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // If Web Share API is available (e.g. mobile browsers)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: text || title,
          url,
        });
        return;
      } catch (err: any) {
        // User cancelled or share failed, fallback to copy
        if (err.name === "AbortError") return;
      }
    }

    // Fallback to clipboard
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    } catch {
      // Direct prompt fallback
      window.prompt(
        lang === "hi" ? "इस लिंक को कॉपी करें:" : "Copy this link:",
        url
      );
    }
  };

  if (size === "icon") {
    return (
      <button
        type="button"
        onClick={handleShare}
        title={lang === "hi" ? "साझा करें" : "Share"}
        className={`p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all text-slate-700 ${className}`}
      >
        {copied ? (
          <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
        ) : (
          <Share2 className="w-4 h-4" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-[0.98] ${
        variant === "outline"
          ? "border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-xs"
          : variant === "default"
          ? "bg-terracotta-700 hover:bg-terracotta-800 text-white shadow-sm"
          : "hover:bg-slate-100 text-slate-700"
      } ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
          <span className="text-emerald-700">
            {lang === "hi" ? "लिंक कॉपी हो गया!" : "Link Copied!"}
          </span>
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          <span>{lang === "hi" ? "साझा करें / शेयर" : "Share Link"}</span>
        </>
      )}
    </button>
  );
}
