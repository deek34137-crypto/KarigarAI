"use client";

import React from "react";
import Link from "next/link";
import { MessageCircle, AlertCircle } from "lucide-react";
import { buildWhatsAppInquiryUrl } from "@/lib/data/products";

interface WhatsAppButtonProps {
  phone?: string | null;
  productTitle: string;
  artisanName?: string | null;
  price: number;
  productUrl: string;
  lang: "hi" | "en";
  className?: string;
  variant?: "primary" | "compact";
  isArtisanOwner?: boolean;
}

export function WhatsAppButton({
  phone,
  productTitle,
  artisanName,
  price,
  productUrl,
  lang,
  className = "",
  variant = "primary",
  isArtisanOwner = false,
}: WhatsAppButtonProps) {
  const whatsappUrl = buildWhatsAppInquiryUrl({
    phone,
    productTitle,
    artisanName,
    price,
    productUrl,
    lang,
  });

  // If no phone number was registered for this artisan
  if (!whatsappUrl || !phone) {
    if (variant === "compact") {
      return (
        <button
          type="button"
          disabled
          className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-400 font-semibold text-xs cursor-not-allowed ${className}`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>{lang === "hi" ? "नंबर अनुपलब्ध" : "No Phone"}</span>
        </button>
      );
    }

    return (
      <div className={`p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-left space-y-2 ${className}`}>
        <div className="flex items-start gap-2 text-xs text-amber-900 font-semibold">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="block font-bold">
              {lang === "hi"
                ? "व्हाट्सएप संपर्क नंबर उपलब्ध नहीं है"
                : "WhatsApp Contact Not Available"}
            </span>
            <span className="text-[11px] text-amber-700 font-normal mt-0.5 block">
              {isArtisanOwner
                ? (lang === "hi"
                    ? "ग्राहकों से सीधे ऑर्डर प्राप्त करने के लिए अपनी प्रोफ़ाइल में व्हाट्सएप नंबर जोड़ें।"
                    : "Add your WhatsApp number in your profile so buyers can contact you directly.")
                : (lang === "hi"
                    ? "इस शिल्पकार ने अभी तक कोई सार्वजनिक संपर्क नंबर नहीं जोड़ा है।"
                    : "This artisan has not listed a contact phone number yet.")}
            </span>
          </div>
        </div>

        {isArtisanOwner && (
          <Link href="/profile" className="block">
            <button
              type="button"
              className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors"
            >
              {lang === "hi" ? "प्रोफ़ाइल में नंबर जोड़ें" : "Add Number in Profile"}
            </button>
          </Link>
        )}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${className}`}
      >
        <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
        <span>{lang === "hi" ? "व्हाट्सएप संपर्क" : "WhatsApp"}</span>
      </a>
    );
  }

  return (
    <div className={`space-y-1.5 ${className}`}>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 transition-all duration-150 active:scale-[0.98] focus:outline-none focus:ring-3 focus:ring-emerald-400"
      >
        <div className="w-6 h-6 rounded-full bg-white text-[#25D366] flex items-center justify-center shrink-0">
          <MessageCircle className="w-4 h-4 fill-current text-[#25D366]" />
        </div>
        <div className="text-left">
          <span className="block leading-tight text-slate-900 font-black">
            {lang === "hi"
              ? "सीधे व्हाट्सएप पर पूछताछ व ऑर्डर करें"
              : "Inquire & Order on WhatsApp"}
          </span>
          <span className="block text-[11px] font-semibold text-emerald-950/80 leading-none mt-0.5">
            {lang === "hi"
              ? `${artisanName || "शिल्पकार"} से सीधा संवाद`
              : `Direct chat with ${artisanName || "Artisan"}`}
          </span>
        </div>
      </a>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium pt-0.5">
        <span>
          {lang === "hi"
            ? "सीधा शिल्पकार से संपर्क • कोई मध्यस्थ शुल्क नहीं"
            : "Direct communication with artisan • No intermediary cut"}
        </span>
      </div>
    </div>
  );
}
