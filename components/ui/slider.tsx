"use client";

import React, { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      label,
      value,
      min,
      max,
      step = 1,
      unit = "",
      onChange,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("w-full space-y-2 text-left", className)}>
        <div className="flex items-center justify-between">
          {label && (
            <label className="text-xs font-bold text-slate-700 tracking-wide">
              {label}
            </label>
          )}
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-orange-50 border border-orange-200 text-xs font-bold text-terracotta-700">
            {unit}
            {value.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="relative flex items-center h-8">
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(Number(e.target.value))}
            className={cn(
              "w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-terracotta-700",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-600",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
            {...props}
          />
        </div>

        <div className="flex justify-between text-[11px] font-semibold text-slate-400 select-none">
          <span>
            {unit}
            {min.toLocaleString("en-IN")}
          </span>
          <span>
            {unit}
            {max.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    );
  }
);

Slider.displayName = "Slider";
