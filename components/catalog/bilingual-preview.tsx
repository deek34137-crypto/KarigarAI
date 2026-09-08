"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { CatalogGenerationResult } from "@/lib/ai/schemas/catalog";
import { ProductAnalysisResult } from "@/lib/ai/schemas/product-analysis";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Button,
  Input,
} from "@/components/ui";
import { Sparkles, Languages, Check, Edit3, Tag, Layers, CheckCircle2, RotateCcw } from "lucide-react";

interface BilingualPreviewProps {
  catalog: CatalogGenerationResult;
  vision?: ProductAnalysisResult;
  onUpdate: (updated: CatalogGenerationResult) => void;
  onProceedToPricing: () => void;
  onBack: () => void;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export function BilingualPreview({
  catalog,
  vision,
  onUpdate,
  onProceedToPricing,
  onBack,
  onRegenerate,
  isRegenerating = false,
}: BilingualPreviewProps) {
  const { language, t } = useLanguage();
  const [previewLang, setPreviewLang] = useState<"hi" | "en">(language);
  const [isEditing, setIsEditing] = useState(false);

  // Sync preview language when global language changes
  useEffect(() => {
    setPreviewLang(language);
  }, [language]);

  // Editable local copies synced whenever catalog prop updates
  const [titleEn, setTitleEn] = useState(catalog.titleEnglish);
  const [titleHi, setTitleHi] = useState(catalog.titleHindi);
  const [descEn, setDescEn] = useState(catalog.descriptionEnglish);
  const [descHi, setDescHi] = useState(catalog.descriptionHindi);

  useEffect(() => {
    setTitleEn(catalog.titleEnglish);
    setTitleHi(catalog.titleHindi);
    setDescEn(catalog.descriptionEnglish);
    setDescHi(catalog.descriptionHindi);
  }, [catalog]);

  const handleSaveEdits = () => {
    onUpdate({
      ...catalog,
      titleEnglish: titleEn,
      titleHindi: titleHi,
      descriptionEnglish: descEn,
      descriptionHindi: descHi,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-4 text-left">
      {/* Header Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-terracotta-700 text-white flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block leading-tight">
              {language === "hi" ? "AI कैटलॉग तैयार है!" : "AI Catalog Generated!"}
            </span>
            <span className="text-[10px] text-terracotta-700 font-semibold">
              {language === "hi" ? "हिंदी एवं अंग्रेजी में प्रमाणित" : "Validated Bilingual Output"}
            </span>
          </div>
        </div>

        {/* View Language Switcher */}
        <div className="inline-flex p-0.5 bg-white rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setPreviewLang("hi")}
            className={`px-2 py-1 text-[11px] font-bold rounded-md transition-all ${
              previewLang === "hi"
                ? "bg-terracotta-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            हिंदी
          </button>
          <button
            type="button"
            onClick={() => setPreviewLang("en")}
            className={`px-2 py-1 text-[11px] font-bold rounded-md transition-all ${
              previewLang === "en"
                ? "bg-terracotta-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Main Review Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">
              {vision?.craftType || "Handicraft"}
            </Badge>
            <div className="flex items-center gap-2">
              {onRegenerate && (
                <button
                  type="button"
                  onClick={onRegenerate}
                  disabled={isRegenerating}
                  className="text-xs font-bold text-slate-600 hover:text-terracotta-700 flex items-center gap-1 bg-slate-100 hover:bg-orange-50 px-2 py-1 rounded-lg transition-all disabled:opacity-50"
                  title={language === "hi" ? "AI से पुनः कैटलॉग बनाएं" : "Regenerate with AI"}
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isRegenerating ? "animate-spin text-terracotta-700" : ""}`} />
                  <span>
                    {isRegenerating
                      ? language === "hi"
                        ? "बन रहा है..."
                        : "Generating..."
                      : language === "hi"
                      ? "पुनः बनाएं"
                      : "Regenerate"}
                  </span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-bold text-terracotta-700 hover:text-terracotta-800 flex items-center gap-1 px-2 py-1 rounded-lg border border-terracotta-200 hover:bg-orange-50"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? t("cancel") : t("edit")}</span>
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {!isEditing ? (
            /* Read-Only Preview Mode */
            <>
              {/* Title Display */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                  {previewLang === "hi" ? "उत्पाद का शीर्षक (हिंदी)" : "Product Title (English)"}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5 leading-snug">
                  {previewLang === "hi" ? catalog.titleHindi : catalog.titleEnglish}
                </h3>
              </div>

              {/* Description Display */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                  {previewLang === "hi" ? "विवरण (हिंदी)" : "Description (English)"}
                </span>
                <p className="text-xs text-slate-700 leading-relaxed mt-1 whitespace-pre-line">
                  {previewLang === "hi" ? catalog.descriptionHindi : catalog.descriptionEnglish}
                </p>
              </div>

              {/* Attributes Grid */}
              {catalog.keyAttributes && catalog.keyAttributes.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">
                    {previewLang === "hi" ? "उत्पाद की विशेषताएं:" : "Key Specifications:"}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {catalog.keyAttributes.map((attr, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-left"
                      >
                        <span className="text-[10px] font-bold text-slate-500 block truncate">
                          {previewLang === "hi" ? attr.attributeNameHi : attr.attributeNameEn}
                        </span>
                        <span className="text-xs font-bold text-slate-900 block truncate mt-0.5">
                          {previewLang === "hi" ? attr.attributeValueHi : attr.attributeValueEn}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags Section */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5 flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  <span>{previewLang === "hi" ? "सर्च टैग्स:" : "Search Tags:"}</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(previewLang === "hi" ? catalog.tagsHindi : catalog.tagsEnglish).map(
                    (tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-orange-50 border border-orange-200 text-[11px] font-semibold text-terracotta-800"
                      >
                        #{tag}
                      </span>
                    )
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Editing Mode */
            <div className="space-y-3 pt-1">
              <Input
                label="English Title"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
              />
              <Input
                label="हिंदी शीर्षक (Hindi Title)"
                value={titleHi}
                onChange={(e) => setTitleHi(e.target.value)}
              />
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  English Description
                </label>
                <textarea
                  rows={4}
                  value={descEn}
                  onChange={(e) => setDescEn(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-terracotta-600"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  हिंदी विवरण (Hindi Description)
                </label>
                <textarea
                  rows={4}
                  value={descHi}
                  onChange={(e) => setDescHi(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-terracotta-600"
                />
              </div>
              <Button
                type="button"
                variant="default"
                size="sm"
                fullWidth
                onClick={handleSaveEdits}
              >
                <Check className="w-4 h-4 mr-1.5" />
                <span>{t("save")}</span>
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onBack}
            className="w-1/3"
          >
            {t("back")}
          </Button>

          <Button
            type="button"
            variant="default"
            size="md"
            onClick={onProceedToPricing}
            className="flex-1 shadow-md"
          >
            <span>{t("next")}: {t("stepPricing")}</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
