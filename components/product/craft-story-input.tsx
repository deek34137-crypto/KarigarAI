"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { useSpeechRecognition } from "@/lib/hooks/use-speech-recognition";
import { generateCraftStoryAction } from "@/app/actions/craft-story";
import { CraftStoryData } from "@/types/product";
import { Button, Card, Badge, Skeleton } from "@/components/ui";
import {
  Mic,
  MicOff,
  Edit3,
  Sparkles,
  CheckCircle2,
  Trash2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Layers,
  Check,
} from "lucide-react";

interface CraftStoryInputProps {
  story: CraftStoryData | null;
  onStoryChange: (story: CraftStoryData | null) => void;
  artisanName: string;
  craftType: string;
  district?: string;
  state?: string;
}

// Labeled strictly as editable example stories for testing/demo
const EXAMPLE_STORIES = [
  {
    label: "मिट्टी शिल्प उदाहरण (Pottery Example)",
    text: "हमारे परिवार में तीन पीढ़ियों से मिट्टी के बर्तन और मूर्तियां बनाई जाती हैं। यह हुनर मैंने अपने पिताजी से सीखा। हम स्थानीय मिट्टी को चाक पर हाथ से आकार देते हैं और पारंपरिक भट्टी में पकाते हैं।",
  },
  {
    label: "हथकरघा बुनाई उदाहरण (Weaving Example)",
    text: "मैं पिछले 15 वर्षों से पारंपरिक हथकरघे पर साड़ियां बुन रही हूं। यह काम मुझे मेरी सास ने सिखाया। हम लकड़ी के गड्ढा करघे पर सूती और रेशमी धागों से पारंपरिक किनारी तैयार करते हैं।",
  },
  {
    label: "काष्ठ / धातु कला उदाहरण (Woodcraft Example)",
    text: "मैं स्थानीय शीशम की लकड़ी पर पारंपरिक नक्काशी करता हूं। यह कला हमारे गांव के उस्ताद कारीगरों से सीखी है। हाथ की छेनी और हथौड़ी से नक्काशी करने में कई दिन लगते हैं।",
  },
];

export function CraftStoryInput({
  story,
  onStoryChange,
  artisanName,
  craftType,
  district,
  state,
}: CraftStoryInputProps) {
  const { language, t } = useLanguage();
  const [mode, setMode] = useState<"voice" | "text" | "example">("voice");
  const [rawText, setRawText] = useState("");
  const [isDemoExample, setIsDemoExample] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedStoryHi, setEditedStoryHi] = useState("");
  const [editedStoryEn, setEditedStoryEn] = useState("");

  // Web Speech hook
  const {
    isListening,
    transcript,
    error: speechError,
    startListening,
    stopListening,
    isSupported,
  } = useSpeechRecognition({
    lang: language === "hi" ? "hi-IN" : "en-IN",
  });

  React.useEffect(() => {
    if (transcript) {
      setRawText(transcript);
      setIsDemoExample(false);
    }
  }, [transcript]);

  const handleGenerateStory = async () => {
    const textToProcess = rawText.trim() || transcript.trim();
    if (!textToProcess) {
      setErrorMsg(
        language === "hi"
          ? "कृपया पहले अपनी शिल्प कहानी बोलें या लिखें।"
          : "Please speak or write your craft story first."
      );
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const res = await generateCraftStoryAction({
        artisanName,
        craftType,
        district,
        state,
        artisanStoryRaw: textToProcess,
        isDemoExample,
      });

      if (res.success && res.data) {
        onStoryChange(res.data);
      } else {
        setErrorMsg(res.error || "कहानी प्रोसेस करने में त्रुटि हुई।");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "AI सेवा उपलब्ध नहीं है।");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectExample = (exampleText: string) => {
    setRawText(exampleText);
    setIsDemoExample(true);
  };

  return (
    <Card className="p-4 space-y-3.5 border-orange-200/80 bg-gradient-to-br from-orange-50/40 via-white to-amber-50/20 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-100 text-terracotta-700 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">
              {language === "hi" ? "शिल्प विरासत और कहानी (वैकल्पिक)" : "Heritage & Craft Story (Optional)"}
            </h3>
            <p className="text-[10px] text-slate-500">
              {language === "hi"
                ? "आपने यह हुनर कैसे सीखा? अपनी बात बोलकर या लिखकर बताएं।"
                : "How did you learn this craft? Speak or type your recollection."}
            </p>
          </div>
        </div>

        <Badge variant="secondary" className="text-[9px]">
          {language === "hi" ? "वैकल्पिक" : "Optional"}
        </Badge>
      </div>

      {/* If a story is already generated, show the review card */}
      {story ? (
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-900">
                {language === "hi" ? "सत्यापित शिल्प कहानी" : "Recorded Craft Story"}
              </span>
            </div>

            <Badge
              variant={story.story_source === "demo_data" ? "neutral" : "success"}
              className="text-[9px]"
            >
              {story.story_source === "demo_data"
                ? (language === "hi" ? "डेमो उदाहरण" : "Demo Example")
                : (language === "hi" ? "शिल्पकार द्वारा प्रदत्त" : "Artisan Provided")}
            </Badge>
          </div>

          {/* Bilingual Preview or Edit Form */}
          {isEditing ? (
            <div className="space-y-3 pt-1">
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-terracotta-800 uppercase">
                  {language === "hi" ? "हिन्दी कहानी संपादित करें" : "Edit Hindi Story"}
                </label>
                <textarea
                  value={editedStoryHi}
                  onChange={(e) => setEditedStoryHi(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-terracotta-500"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-slate-700 uppercase">
                  {language === "hi" ? "अंग्रेजी कहानी संपादित करें" : "Edit English Story"}
                </label>
                <textarea
                  value={editedStoryEn}
                  onChange={(e) => setEditedStoryEn(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-terracotta-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  <span>{language === "hi" ? "रद्द करें" : "Cancel"}</span>
                </Button>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => {
                    onStoryChange({
                      ...story,
                      story_hi: editedStoryHi,
                      story_en: editedStoryEn,
                    });
                    setIsEditing(false);
                  }}
                >
                  <Check className="w-3.5 h-3.5 mr-1" />
                  <span>{language === "hi" ? "सुरक्षित करें" : "Save Changes"}</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-xs text-left">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-terracotta-700 block uppercase mb-0.5">
                  हिन्दी कहानी
                </span>
                <p className="text-slate-700 leading-relaxed italic">
                  &ldquo;{story.story_hi}&rdquo;
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 block uppercase mb-0.5">
                  English Story
                </span>
                <p className="text-slate-600 leading-relaxed italic">
                  &ldquo;{story.story_en}&rdquo;
                </p>
              </div>

              {story.generational_lineage && (
                <div className="flex items-center gap-1.5 text-[11px] text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80">
                  <span>👨‍👩‍👧</span>
                  <span className="font-semibold">{story.generational_lineage}</span>
                </div>
              )}

              {/* Action Row: Edit | Regenerate | Remove */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditedStoryHi(story.story_hi);
                      setEditedStoryEn(story.story_en);
                      setIsEditing(true);
                    }}
                    className="text-xs font-bold text-terracotta-700 hover:text-terracotta-800 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-orange-50 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{language === "hi" ? "संपादित करें" : "Edit"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerateStory}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{language === "hi" ? "पुनः बनाएं" : "Regenerate"}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onStoryChange(null)}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 p-1 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{language === "hi" ? "कहानी हटाएं" : "Remove"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Input Selection: Voice | Type | Example */
        <div className="space-y-3">
          {/* Mode Selector Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80 text-xs font-bold">
            <button
              type="button"
              onClick={() => setMode("voice")}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
                mode === "voice"
                  ? "bg-white text-terracotta-800 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{language === "hi" ? "बोलकर बताएं" : "Speak"}</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("text")}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
                mode === "text"
                  ? "bg-white text-terracotta-800 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{language === "hi" ? "लिखें" : "Type"}</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("example")}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
                mode === "example"
                  ? "bg-white text-terracotta-800 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === "hi" ? "उदाहरण" : "Example"}</span>
            </button>
          </div>

          {/* Voice Input Section */}
          {mode === "voice" && (
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                aria-label={
                  isListening
                    ? (language === "hi" ? "आवाज रिकॉर्डिंग बंद करें" : "Stop voice recording")
                    : (language === "hi" ? "आवाज से कहानी रिकॉर्ड करें" : "Start voice recording")
                }
                className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto transition-all shadow-md active:scale-95 ${
                  isListening
                    ? "bg-rose-500 text-white animate-pulse ring-4 ring-rose-200"
                    : "bg-gradient-to-tr from-terracotta-700 to-orange-500 text-white hover:opacity-95"
                }`}
              >
                {isListening ? (
                  <MicOff className="w-6 h-6" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </button>

              <span className="text-xs font-bold text-slate-800 block">
                {isListening
                  ? (language === "hi" ? "सुन रहे हैं... बोलिए" : "Listening... Speak now")
                  : (language === "hi" ? "माइक दबाकर कहानी बोलें" : "Tap mic to speak your story")}
              </span>

              {rawText && (
                <div className="p-2.5 rounded-xl bg-orange-50/60 border border-orange-100 text-xs text-slate-800 italic text-left">
                  &ldquo;{rawText}&rdquo;
                </div>
              )}
            </div>
          )}

          {/* Text Input Section */}
          {mode === "text" && (
            <div className="space-y-1.5">
              <textarea
                value={rawText}
                onChange={(e) => {
                  setRawText(e.target.value);
                  setIsDemoExample(false);
                }}
                rows={3}
                placeholder={
                  language === "hi"
                    ? "उदा. मैंने यह शिल्प अपने पिताजी से सीखा। हमारा परिवार पिछले 30 वर्षों से मिट्टी के दीये और मूर्तियां बनाता है..."
                    : "e.g. I learned this craft from my parents. Our family has been handcrafting traditional pottery for over 30 years..."
                }
                className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500 bg-white"
              />
            </div>
          )}

          {/* Example Stories Section (Honestly labeled: Example stories — edit before publishing) */}
          {mode === "example" && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md inline-block">
                {language === "hi"
                  ? "उदाहरण कहानियां — प्रकाशित करने से पूर्व बदलाव करें"
                  : "Example stories — edit before publishing"}
              </span>

              <div className="space-y-1.5">
                {EXAMPLE_STORIES.map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectExample(ex.text)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all ${
                      rawText === ex.text
                        ? "border-terracotta-700 bg-orange-50 font-semibold text-slate-900"
                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span className="text-[10px] font-bold text-terracotta-700 block mb-0.5">
                      {ex.label}
                    </span>
                    <p className="line-clamp-2 text-[11px] text-slate-600">
                      {ex.text}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Trigger AI Formatting */}
          {rawText && (
            <Button
              type="button"
              variant="default"
              size="sm"
              fullWidth
              onClick={handleGenerateStory}
              isLoading={isGenerating}
              className="shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-300" />
              <span>
                {language === "hi"
                  ? "AI से विरासत कहानी संरचित करें"
                  : "Structure Story with AI"}
              </span>
            </Button>
          )}

          <p className="text-[10px] text-slate-400 text-center leading-tight">
            {language === "hi"
              ? "AI केवल आपकी दी गई जानकारी को संरचित करेगा, कोई काल्पनिक कहानी नहीं जोड़ेगा।"
              : "AI only structures what you state; it will never invent mythological claims or fake awards."}
          </p>
        </div>
      )}
    </Card>
  );
}
