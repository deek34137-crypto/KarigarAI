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

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved === "hi" || saved === "en") {
        setLanguageState(saved);
      }
    } catch {
      // LocalStorage access may fail in private browser modes
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
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
