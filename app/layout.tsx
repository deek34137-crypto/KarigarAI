import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/context";
import { AuthProvider } from "@/lib/auth/auth-context";

export const metadata: Metadata = {
  title: "KarigarAI — AI Market Linkage for Artisans (कारीगरAI)",
  description:
    "AI-driven smart cataloging and market linkage mobile application for traditional Indian artisans. Built for SIH 2026.",
  applicationName: "KarigarAI",
  authors: [{ name: "KarigarAI Team" }],
  keywords: [
    "KarigarAI",
    "Artisan Cataloging",
    "Handicrafts India",
    "SIH 2026",
    "Ministry of Social Justice and Empowerment",
    "Heritage and Culture",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#c2410c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" suppressHydrationWarning>
      <body className="antialiased bg-[#fbf9f5] text-slate-900 font-sans">
        <LanguageProvider>
          <AuthProvider>
            <div className="mobile-container flex flex-col min-h-screen">
              {children}
            </div>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
