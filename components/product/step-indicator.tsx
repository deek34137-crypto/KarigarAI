"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/context";
import { Check, Camera, Mic, Sparkles, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number; // 1 to 4
  onStepClick?: (step: number) => void;
}

export function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  const { t } = useLanguage();

  const steps = [
    { id: 1, label: t("stepPhoto"), icon: Camera },
    { id: 2, label: t("stepDetails"), icon: Mic },
    { id: 3, label: t("stepReview"), icon: Sparkles },
    { id: 4, label: t("stepPricing"), icon: DollarSign },
  ];

  return (
    <div className="w-full py-2 px-1">
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-4 h-0.5 bg-terracotta-600 -translate-y-1/2 z-0 transition-all duration-300"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center relative z-10 select-none cursor-pointer"
              onClick={() => isCompleted && onStepClick?.(step.id)}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200",
                  isCompleted && "bg-emerald-600 text-white shadow-xs",
                  isCurrent &&
                    "bg-terracotta-700 text-white ring-4 ring-orange-100 shadow-sm scale-110",
                  !isCompleted && !isCurrent && "bg-white border-2 border-slate-300 text-slate-400"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] font-bold mt-1 tracking-tight leading-none",
                  isCurrent && "text-terracotta-800 font-extrabold",
                  isCompleted && "text-slate-700",
                  !isCompleted && !isCurrent && "text-slate-400"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
