"use client";

import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { QrCode, Download, Printer, X, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui";

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  productTitle: string;
  artisanName?: string | null;
  craftType?: string | null;
  price?: number | null;
  lang: "hi" | "en";
}

export function QrModal({
  isOpen,
  onClose,
  url,
  productTitle,
  artisanName,
  craftType,
  price,
  lang,
}: QrModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const printAreaRef = useRef<HTMLDivElement>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && url) {
      QRCode.toDataURL(
        url,
        {
          width: 320,
          margin: 2,
          color: {
            dark: "#1e293b", // slate-800
            light: "#ffffff",
          },
        },
        (err, generatedUrl) => {
          if (!err && generatedUrl) {
            setDataUrl(generatedUrl);
          }
        }
      );
    }
  }, [isOpen, url]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.download = `karigarai-qr-${productTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-orange-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-terracotta-700 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                {lang === "hi" ? "शिल्प मेला स्टॉल क्यूआर कोड" : "Exhibition Stall QR Card"}
              </h3>
              <p className="text-[10px] text-slate-500">
                {lang === "hi" ? "प्रदर्शनी / स्टॉल हेतु प्रिंटेबल कार्ड" : "Ready to display at craft fairs"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200/60 text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Stall Display Card Area */}
        <div className="p-4 space-y-4 text-center">
          <div
            ref={printAreaRef}
            className="p-4 rounded-2xl bg-gradient-to-b from-orange-50/40 via-white to-amber-50/30 border-2 border-dashed border-orange-200 space-y-3 print:border-solid print:border-2"
          >
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-terracotta-800 bg-orange-100 px-2.5 py-0.5 rounded-full inline-block">
                कारीगरAI • KarigarAI
              </span>
              <h4 className="text-sm font-extrabold text-slate-900 mt-1 line-clamp-1">
                {productTitle}
              </h4>
              <p className="text-[11px] text-slate-600 font-medium">
                {artisanName ? `${artisanName}` : "Artisan"} • {craftType || "Handicraft"}
              </p>
            </div>

            {/* Rendered QR Code */}
            <div className="w-52 h-52 mx-auto bg-white p-2 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-center">
              {dataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={dataUrl}
                  alt={`QR Code for ${productTitle}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                  {lang === "hi" ? "QR तैयार हो रहा है..." : "Generating QR..."}
                </div>
              )}
            </div>

            {price && (
              <div className="text-xs font-bold text-slate-800">
                <span>{lang === "hi" ? "सीधा शिल्पकार मूल्य: " : "Direct Price: "}</span>
                <span className="text-sm font-extrabold text-terracotta-800">
                  ₹{price.toLocaleString("en-IN")}
                </span>
              </div>
            )}

            <p className="text-[10px] text-slate-500 max-w-[220px] mx-auto leading-tight">
              {lang === "hi"
                ? "फोन कैमरा से स्कैन करें — प्रामाणिक शिल्प विवरण देखें और व्हाट्सएप पर ऑर्डर करें"
                : "Scan with any phone camera to view authentic catalog and order directly on WhatsApp"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="text-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              <span>{lang === "hi" ? "QR डाउनलोड" : "Download PNG"}</span>
            </Button>

            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handlePrint}
              className="text-xs"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              <span>{lang === "hi" ? "कार्ड प्रिंट करें" : "Print Stall Card"}</span>
            </Button>
          </div>

          <p className="text-[10px] text-slate-400">
            {lang === "hi"
              ? "सूरजकुंड, दस्तकार अथवा स्थानीय हाट में अपने स्टॉल पर चिपकाएं"
              : "Ideal for display at Surajkund, Dastkar, or Hunar Haat stalls"}
          </p>
        </div>
      </div>
    </div>
  );
}
