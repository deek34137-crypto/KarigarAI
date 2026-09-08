"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, TranslationKey, translations } from "./dictionary";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "karigarai_preferred_language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Default to Hindi ('hi') to prioritize the target artisan persona
  const [language, setLanguageState] = useState<Language>("hi");

  // Sync preference from localStorage on client mount
  useEffect(() => {
    const syncSavedLanguage = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
        if (saved === "hi" || saved === "en") {
          setLanguageState(saved);
          if (typeof document !== "undefined") {
            document.documentElement.lang = saved;
          }
        }
      } catch {
        // LocalStorage access may fail in private browser modes
      }
    };

    syncSavedLanguage();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === "hi" || e.newValue === "en")) {
        setLanguageState(e.newValue as Language);
        if (typeof document !== "undefined") {
          document.documentElement.lang = e.newValue;
        }
      }
    };

    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<Language>;
      if (customEvent.detail && (customEvent.detail === "hi" || customEvent.detail === "en")) {
        setLanguageState(customEvent.detail);
        if (typeof document !== "undefined") {
          document.documentElement.lang = customEvent.detail;
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("karigarai_language_change", handleCustomChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("karigarai_language_change", handleCustomChange);
    };
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      if (typeof document !== "undefined") {
        document.documentElement.lang = lang;
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("karigarai_language_change", { detail: lang })
        );
      }
    } catch {
      // Ignore storage errors
    }
  };

  const t = (key: TranslationKey): string => {
    const langDict = translations[language] || translations.hi;
    return (langDict as Record<string, string>)[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
