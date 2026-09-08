"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { useSpeechRecognition } from "@/lib/hooks/use-speech-recognition";
import { Button, Badge } from "@/components/ui";
import { Mic, MicOff, Sparkles, RotateCcw, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceInputProps {
  value: string;
  onChange: (val: string) => void;
  craftHint?: string;
}

const SAMPLE_ORAL_DESCRIPTIONS = [
  {
    title: "टेराकोटा सुराही (Terracotta Surahi)",
    text: "यह हमारे गोरखपुर की शुद्ध लाल मिट्टी से चाक पर हस्तनिर्मित सुराही है। इस पर पारंपरिक बारीक नक्काशी की गई है। यह बिना बिजली के पानी को एकदम प्राकृतिक रूप से ठंडा और मीठा रखती है।",
  },
  {
    title: "महेश्वरी साड़ी (Maheshwari Saree)",
    text: "यह शुद्ध रेशम और सूती धागों से हथकरघे पर बुनी गई पारंपरिक महेश्वरी साड़ी है। इसमें नर्मदा नदी की लहरों जैसा जरी का बॉर्डर है और इसे प्राकृतिक रंगों से रंगा गया है।",
  },
];

export function VoiceInput({ value, onChange, craftHint }: VoiceInputProps) {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"voice" | "text">("voice");

  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    lang: language === "hi" ? "hi-IN" : "en-IN",
    continuous: true,
  });

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      if (transcript) {
        onChange(value ? `${value} ${transcript}` : transcript);
      }
    } else {
      resetTranscript();
      startListening();
    }
  };

  const handleApplyTranscript = () => {
    if (transcript) {
      onChange(value ? `${value} ${transcript}` : transcript);
      resetTranscript();
    }
  };

  return (
    <div className="space-y-3.5 text-left">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900">{t("voicePromptTitle")}</h4>
          <p className="text-xs text-slate-500 mt-0.5">{t("voicePromptSubtitle")}</p>
        </div>
        <div className="flex gap-1 p-0.5 bg-slate-100 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab("voice")}
            className={cn(
              "px-2.5 py-1 text-xs font-bold rounded-md transition-all",
              activeTab === "voice"
                ? "bg-white text-terracotta-700 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            )}
          >
            {language === "hi" ? "आवाज (Mic)" : "Voice (Mic)"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("text")}
            className={cn(
              "px-2.5 py-1 text-xs font-bold rounded-md transition-all",
              activeTab === "text"
                ? "bg-white text-terracotta-700 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            )}
          >
            {language === "hi" ? "लिखें (Text)" : "Type (Text)"}
          </button>
        </div>
      </div>

      {activeTab === "voice" ? (
        /* Voice Recording Box */
        <div className="p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-b from-slate-50 to-white text-center space-y-4">
          {/* Animated Microphone Button */}
          <div className="relative inline-block">
            {isListening && (
              <span className="absolute -inset-2 rounded-full bg-rose-500/20 animate-ping pointer-events-none" />
            )}
            <button
              type="button"
              onClick={toggleListening}
              className={cn(
                "relative z-10 w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 active:scale-95",
                isListening
                  ? "bg-rose-600 hover:bg-rose-700 ring-4 ring-rose-200 animate-pulse"
                  : "bg-terracotta-700 hover:bg-terracotta-800 ring-4 ring-orange-100"
              )}
            >
              {isListening ? (
                <MicOff className="w-8 h-8 stroke-[2.2]" />
              ) : (
                <Mic className="w-8 h-8 stroke-[2.2]" />
              )}
            </button>
          </div>

          <div>
            <span
              className={cn(
                "text-xs font-bold block",
                isListening ? "text-rose-600 animate-pulse" : "text-slate-700"
              )}
            >
              {isListening ? "सुन रहे हैं... (Listening...)" : t("voiceStart")}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {language === "hi"
                ? "माइक दबाकर अपने उत्पाद की खासियत और सामग्री बताएं"
                : "Tap microphone and speak your product details"}
            </p>
          </div>

          {/* Real-time speech transcript preview */}
          {transcript && (
            <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-left animate-in fade-in">
              <span className="text-[10px] font-bold text-terracotta-700 block uppercase">
                {language === "hi" ? "बोला गया विवरण:" : "Spoken note:"}
              </span>
              <p className="text-xs text-slate-800 font-medium mt-1 leading-relaxed">
                {transcript}
              </p>
              <div className="mt-2 flex gap-2">
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={handleApplyTranscript}
                >
                  <span>{language === "hi" ? "जोड़ें (Apply)" : "Apply"}</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={resetTranscript}
                >
                  <span>{language === "hi" ? "रद्द करें" : "Cancel"}</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Editable Text Area (Always accessible or in Text tab) */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-slate-700">
            {language === "hi" ? "उत्पाद का विवरण (समीक्षा एवं संपादन)" : "Product Description (Review & Edit)"}
          </label>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-[11px] font-semibold text-rose-600 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{language === "hi" ? "साफ करें" : "Clear"}</span>
            </button>
          )}
        </div>

        <textarea
          rows={4}
          value={value}
          placeholder={
            language === "hi"
              ? "उदा. यह शुद्ध मिट्टी की सुराही है। पानी को प्राकृतिक रूप से ठंडा रखती है..."
              : "e.g. This is a handcrafted clay surahi, keeps water naturally cool..."
          }
          onChange={(e) => onChange(e.target.value)}
          className="flex w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-600 transition-colors leading-relaxed"
        />
      </div>

      {/* 1-Tap Sample Oral Notes for Evaluation */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>{language === "hi" ? "त्वरित परीक्षण हेतु नमूना बोल:" : "Quick Test Oral Notes:"}</span>
        </span>
        <div className="grid grid-cols-1 gap-1.5">
          {SAMPLE_ORAL_DESCRIPTIONS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChange(sample.text)}
              className="text-left p-2 rounded-lg bg-white border border-slate-200/80 hover:border-orange-300 hover:bg-orange-50/50 text-[11px] text-slate-700 font-medium transition-colors"
            >
              <span className="font-bold text-terracotta-800 block">{sample.title}</span>
              <span className="line-clamp-1 text-slate-500">{sample.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
