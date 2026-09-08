"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth, DEMO_ARTISAN } from "@/lib/auth/auth-context";
import { MobileShell } from "@/components/layout";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Badge,
} from "@/components/ui";
import { UserCheck, Sparkles, Check, ArrowRight } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const { profile, saveProfile } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone_number || "");
  const [craftType, setCraftType] = useState(
    profile?.craft_type || "Terracotta Pottery (गोरखपुर टेराकोटा)"
  );
  const [stateName, setStateName] = useState(profile?.state || "Uttar Pradesh");
  const [district, setDistrict] = useState(profile?.district || "Gorakhpur");
  const [bio, setBio] = useState(profile?.bio || "");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const craftOptions = [
    { id: "terracotta", label: t("craftTypeTerracotta"), value: "Terracotta Pottery" },
    { id: "handloom", label: t("craftTypeHandloom"), value: "Handloom Weaving" },
    { id: "metal", label: t("craftTypeMetal"), value: "Brass & Metal Craft" },
    { id: "wood", label: t("craftTypeWood"), value: "Woodcraft & Carving" },
    { id: "leather", label: t("craftTypeLeather"), value: "Traditional Leather Craft" },
    { id: "other", label: t("craftTypeOther"), value: "Handicraft / Other" },
  ];

  const handleFillDemo = () => {
    setFullName(DEMO_ARTISAN.full_name);
    setPhone(DEMO_ARTISAN.phone_number || "");
    setCraftType(DEMO_ARTISAN.craft_type);
    setStateName(DEMO_ARTISAN.state || "");
    setDistrict(DEMO_ARTISAN.district || "");
    setBio(DEMO_ARTISAN.bio || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    setIsSaving(true);
    const success = await saveProfile({
      id: profile?.id || "00000000-0000-0000-0000-000000000001",
      full_name: fullName.trim(),
      phone_number: phone.trim() || null,
      preferred_language: language,
      craft_type: craftType,
      state: stateName.trim() || null,
      district: district.trim() || null,
      bio: bio.trim() || null,
    });

    setIsSaving(false);
    if (success) {
      setShowSuccess(true);
      setTimeout(() => {
        router.push("/profile");
      }, 800);
    }
  };

  return (
    <MobileShell showNav={false}>
      <div className="p-4 space-y-4">
        {/* Onboarding Header */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200/80 text-left">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-terracotta-700 text-white">
              <UserCheck className="w-4 h-4" />
            </span>
            <Badge variant="default">1-Min Onboarding</Badge>
          </div>
          <h2 className="text-lg font-bold text-slate-900">{t("onboardingTitle")}</h2>
          <p className="text-xs text-slate-600 mt-0.5">{t("onboardingSubtitle")}</p>
        </div>

        {/* 1-Tap Demo Auto-Fill Button */}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          fullWidth
          onClick={handleFillDemo}
          className="border border-saffron-300 shadow-xs"
        >
          <Sparkles className="w-4 h-4 mr-1.5 text-amber-700" />
          <span>{t("fillDemoProfile")}</span>
        </Button>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                {language === "hi" ? "कारीगर का बुनियादी परिचय" : "Artisan Basic Details"}
              </CardTitle>
              <CardDescription>
                {language === "hi"
                  ? "केवल जरूरी जानकारी — कोई जटिल दस्तावेज नहीं।"
                  : "Essential information only — no complicated paperwork."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3.5">
              <Input
                label={t("fullNameLabel")}
                placeholder={t("fullNamePlaceholder")}
                value={fullName}
                required
                onChange={(e) => setFullName(e.target.value)}
              />

              <Input
                label={t("phoneLabel")}
                placeholder={t("phonePlaceholder")}
                type="tel"
                value={phone}
                helperText={
                  language === "hi"
                    ? "ग्राहक इस नंबर पर सीधे व्हाट्सएप कर सकेंगे।"
                    : "Buyers will contact you directly on this WhatsApp number."
                }
                onChange={(e) => setPhone(e.target.value)}
              />

              {/* Craft Discipline Selector */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-bold text-slate-700 tracking-wide">
                  {t("craftCategoryLabel")}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {craftOptions.map((opt) => {
                    const isSelected = craftType.includes(opt.value);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setCraftType(opt.value)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all min-h-[46px] flex items-center justify-between ${
                          isSelected
                            ? "border-terracotta-600 bg-orange-50 text-terracotta-800 ring-1 ring-terracotta-600"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="leading-snug">{opt.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-terracotta-700 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* State & District */}
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label={t("stateLabel")}
                  placeholder="Uttar Pradesh"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                />
                <Input
                  label={t("districtLabel")}
                  placeholder="Gorakhpur"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </div>

              {/* Bio / Heritage Note */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-bold text-slate-700 tracking-wide">
                  {t("bioLabel")}
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  placeholder={t("bioPlaceholder")}
                  onChange={(e) => setBio(e.target.value)}
                  className="flex w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-600 focus-visible:border-transparent transition-colors"
                />
              </div>
            </CardContent>
          </Card>

          {/* Success Banner */}
          {showSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{t("profileUpdatedSuccess")}</span>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            isLoading={isSaving}
            disabled={!fullName.trim()}
          >
            <span>{t("saveProfile")}</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </form>
      </div>
    </MobileShell>
  );
}
