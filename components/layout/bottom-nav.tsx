"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/auth-context";
import { Home, Package, Plus, User, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const { t, language } = useLanguage();
  const { profile, isLoading } = useAuth();

  // While auth is resolving, don't flash artisan nav
  if (isLoading) return null;

  // ── BUYER / unauthenticated nav ──────────────────────────────────────────
  if (!profile) {
    return (
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg pb-safe"
      >
        <div className="max-w-md mx-auto flex items-center justify-around h-16 px-3">
          <Link
            href="/"
            className={cn(
              "flex flex-col items-center justify-center w-16 h-full py-1 text-[11px] font-semibold transition-colors duration-150",
              pathname === "/" ? "text-terracotta-700 font-bold" : "text-slate-500 hover:text-slate-900"
            )}
          >
            <Home className={cn("w-5 h-5", pathname === "/" && "scale-110 stroke-[2.5]")} />
            <span className="mt-1 leading-none">{t("navHome")}</span>
          </Link>

          <Link
            href="/onboarding"
            className="flex flex-col items-center justify-center w-16 h-full py-1 text-[11px] font-semibold text-slate-500 hover:text-slate-900 transition-colors duration-150"
          >
            <LogIn className="w-5 h-5" />
            <span className="mt-1 leading-none">
              {language === "hi" ? "कारीगर लॉगिन" : "Artisan Login"}
            </span>
          </Link>
        </div>
      </nav>
    );
  }

  // ── ARTISAN / authenticated nav ──────────────────────────────────────────
  const navItems = [
    {
      label: t("navHome"),
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: t("navProducts"),
      href: "/products",
      icon: Package,
      isActive: pathname.startsWith("/products") && pathname !== "/products/new",
    },
    {
      label: t("navAddProduct"),
      href: "/products/new",
      icon: Plus,
      isAction: true,
      isActive: pathname === "/products/new",
    },
    {
      label: t("navProfile"),
      href: "/profile",
      icon: User,
      isActive: pathname === "/profile" || pathname.startsWith("/onboarding"),
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg pb-safe"
    >
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center w-16 h-full py-1 text-[11px] font-semibold transition-transform duration-150 group focus:outline-none"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-terracotta-700 to-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 active:scale-95 transition-transform">
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-bold text-terracotta-700 mt-0.5 leading-none">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-full py-1 text-[11px] font-semibold transition-colors duration-150 focus:outline-none",
                item.isActive
                  ? "text-terracotta-700 font-bold"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-transform duration-150",
                  item.isActive && "scale-110 stroke-[2.5]"
                )}
              />
              <span className="mt-1 leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
