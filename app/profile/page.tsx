"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  CardFooter,
  Badge,
  Input,
} from "@/components/ui";
import {
  User,
  ShieldCheck,
  MapPin,
  Phone,
  Sparkles,
  Edit3,
  LogOut,
  ArrowRight,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { formatLocalizedText, getLocalizedInitial } from "@/lib/utils";

export default function ProfilePage() {
  const { language, t } = useLanguage();
  const { profile, saveProfile, signInDemo, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [name, setName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone_number || "");
  const [craft, setCraft] = useState(profile?.craft_type || "");
  const [stateName, setStateName] = useState(profile?.state || "");
  const [district, setDistrict] = useState(profile?.district || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleStartEdit = () => {
    if (profile) {
      setName(profile.full_name);
      setPhone(profile.phone_number || "");
      setCraft(profile.craft_type);
      setStateName(profile.state || "");
      setDistrict(profile.district || "");
      setBio(profile.bio || "");
    }
    setIsEditing(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setIsSaving(true);

    const ok = await saveProfile({
      id: profile.id,
      full_name: name.trim(),
      phone_number: phone.trim() || null,
      preferred_language: profile.preferred_language,
      craft_type: craft.trim(),
      state: stateName.trim() || null,
      district: district.trim() || null,
      bio: bio.trim() || null,
    });

    setIsSaving(false);
    if (ok) {
      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        setIsEditing(false);
      }, 700);
    }
  };

  return (
    <MobileShell>
      <div className="p-4 space-y-4">
        {/* Profile Card Header */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50/90 to-amber-50/50 border border-orange-200/70 shadow-xs flex items-center gap-3.5 text-left">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-terracotta-700 to-orange-500 text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
            {getLocalizedInitial(profile?.full_name, language)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-base font-extrabold text-slate-900 truncate">
                {profile ? formatLocalizedText(profile.full_name, language) : t("noProfileYet")}
              </h2>
            </div>
            <div className="flex items-center gap-1 mt-1 text-emerald-700 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{t("verifiedArtisanBadge")}</span>
            </div>
          </div>
        </div>

        {profile ? (
          !isEditing ? (
            /* View Mode */
            <div className="space-y-3">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">
                      {language === "hi" ? "शिल्पकार प्रोफ़ाइल विवरण" : "Artisan Profile Details"}
                    </CardTitle>
                    <Badge variant="secondary">
                      {formatLocalizedText(profile.craft_type, language)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 text-left">
                  {/* Location */}
                  <div className="flex items-start gap-2 text-xs text-slate-700">
                    <MapPin className="w-4 h-4 text-terracotta-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">
                        {language === "hi" ? "शिल्प क्लस्टर / क्षेत्र" : "Craft Cluster & Region"}
                      </span>
                      <span>
                        {formatLocalizedText(profile.district, language) || (language === "hi" ? "गोरखपुर" : "Gorakhpur")}, {formatLocalizedText(profile.state, language) || (language === "hi" ? "उत्तर प्रदेश" : "Uttar Pradesh")}
                      </span>
                    </div>
                  </div>

                  {/* Phone / WhatsApp */}
                  <div className="flex items-start gap-2 text-xs text-slate-700">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">
                        {language === "hi" ? "व्हाट्सएप संपर्क नंबर" : "WhatsApp Inquiry Contact"}
                      </span>
                      <span>{profile.phone_number || "Not specified"}</span>
                    </div>
                  </div>

                  {/* Bio / Heritage Story */}
                  {profile.bio && (
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
                        <BookOpen className="w-3.5 h-3.5 text-terracotta-700" />
                        <span>{language === "hi" ? "पारंपरिक विरासत परिचय" : "Craft Heritage Bio"}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed bg-orange-50/50 p-2.5 rounded-xl border border-orange-100">
                        {profile.bio}
                      </p>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex flex-col gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={handleStartEdit}
                  >
                    <Edit3 className="w-4 h-4 mr-1.5" />
                    <span>{t("editProfile")}</span>
                  </Button>
                </CardFooter>
              </Card>

              {/* Demo Switcher & Reset */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-800 block">
                    {language === "hi" ? "SIH डेमो परीक्षक मोड" : "SIH Jury Evaluator Mode"}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {language === "hi"
                      ? "1-टैप में आधिकारिक डेमो कारीगर डेटा लोड करें"
                      : "Reset to Ramshwar Prajapati benchmark"}
                  </span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={signInDemo}
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-700" />
                  <span>{language === "hi" ? "रीसेट" : "Reset"}</span>
                </Button>
              </div>

              {/* Sign Out Button */}
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                onClick={signOut}
                className="text-slate-500 hover:text-rose-600"
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                <span>{t("signOut")}</span>
              </Button>
            </div>
          ) : (
            /* Edit Mode */
            <form onSubmit={handleSaveEdit} className="space-y-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{t("editProfile")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    label={t("fullNameLabel")}
                    value={name}
                    required
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    label={t("phoneLabel")}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <Input
                    label={t("craftCategoryLabel")}
                    value={craft}
                    required
                    onChange={(e) => setCraft(e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label={t("stateLabel")}
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                    />
                    <Input
                      label={t("districtLabel")}
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-700">
                      {t("bioLabel")}
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-terracotta-600"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => setIsEditing(false)}
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    type="submit"
                    variant="default"
                    size="sm"
                    fullWidth
                    isLoading={isSaving}
                  >
                    {t("save")}
                  </Button>
                </CardFooter>
              </Card>

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t("profileUpdatedSuccess")}</span>
                </div>
              )}
            </form>
          )
        ) : (
          /* Empty State when logged out */
          <Card className="text-center p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-terracotta-700 flex items-center justify-center mx-auto">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t("noProfileYet")}</h3>
              <p className="text-xs text-slate-500 mt-1">
                {language === "hi"
                  ? "कृपया अपना नाम और शिल्प दर्ज करके शुरुआत करें।"
                  : "Please register your name and craft to begin cataloging."}
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <Link href="/onboarding" className="block">
                <Button variant="default" size="md" fullWidth>
                  <span>{t("onboardingTitle")}</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Button variant="secondary" size="sm" fullWidth onClick={signInDemo}>
                <Sparkles className="w-4 h-4 mr-1.5 text-amber-700" />
                <span>{t("signInDemo")}</span>
              </Button>
            </div>
          </Card>
        )}
      </div>
    </MobileShell>
  );
}
