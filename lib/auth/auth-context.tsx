"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Profile } from "@/types/product";

interface AuthContextType {
  profile: Profile | null;
  isLoading: boolean;
  saveProfile: (data: Omit<Profile, "created_at" | "updated_at">) => Promise<boolean>;
  signInDemo: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PROFILE_STORAGE_KEY = "karigarai_artisan_profile";

export const DEMO_ARTISAN: Profile = {
  id: "00000000-0000-0000-0000-000000000001",
  full_name: "रामेश्वर प्रजापति (Rameshwar Prajapati)",
  phone_number: "+91 98765 43210",
  preferred_language: "hi",
  craft_type: "Terracotta Pottery (गोरखपुर टेराकोटा)",
  state: "Uttar Pradesh (उत्तर प्रदेश)",
  district: "Gorakhpur (गोरखपुर)",
  bio: "5वीं पीढ़ी के पारंपरिक टेराकोटा शिल्पकार। गोरखपुर की समृद्ध लाल मिट्टी से चाक पर हस्तनिर्मित जल सुराही, कलश और पारंपरिक कलाकृतियां तैयार करते हैं।",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) {
        setProfile(JSON.parse(stored));
      }
      // If no stored profile — user is a buyer/visitor. Leave profile as null.
    } catch {
      // Storage error — leave profile as null
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveProfile = async (
    data: Omit<Profile, "created_at" | "updated_at">
  ): Promise<boolean> => {
    try {
      const updated: Profile = {
        ...data,
        created_at: profile?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProfile(updated);
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch (err) {
      console.error("Failed to save profile:", err);
      return false;
    }
  };

  const signInDemo = () => {
    setProfile(DEMO_ARTISAN);
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(DEMO_ARTISAN));
    } catch {
      // Ignore storage errors
    }
  };

  const signOut = () => {
    setProfile(null);
    try {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <AuthContext.Provider
      value={{
        profile,
        isLoading,
        saveProfile,
        signInDemo,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
