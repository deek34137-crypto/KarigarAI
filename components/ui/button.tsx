"use client";

import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "success" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      isLoading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-bold transition-all duration-200 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[0.98]";

    const variants = {
      default:
        "bg-terracotta-700 hover:bg-terracotta-800 text-white shadow-sm focus-visible:ring-terracotta-600",
      secondary:
        "bg-saffron-500 hover:bg-saffron-600 text-slate-900 shadow-sm focus-visible:ring-saffron-500",
      outline:
        "border-2 border-slate-300 hover:border-slate-400 bg-white text-slate-800 hover:bg-slate-50 focus-visible:ring-slate-400",
      ghost:
        "bg-transparent hover:bg-slate-100 text-slate-700 focus-visible:ring-slate-400",
      success:
        "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm focus-visible:ring-emerald-500",
      danger:
        "bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus-visible:ring-rose-500",
    };

    const sizes = {
      sm: "text-xs px-3.5 py-2 min-h-[40px] gap-1.5",
      md: "text-sm px-4 py-3 min-h-[48px] gap-2",
      lg: "text-base px-6 py-4 min-h-[54px] gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
