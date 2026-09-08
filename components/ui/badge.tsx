import React, { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "outline" | "neutral";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-terracotta-100 text-terracotta-800 border-terracotta-200/80",
    secondary: "bg-saffron-100 text-saffron-900 border-saffron-200",
    success: "bg-emerald-100 text-emerald-800 border-emerald-200",
    warning: "bg-amber-100 text-amber-800 border-amber-200",
    outline: "text-slate-700 border-slate-300 bg-white",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors select-none",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
