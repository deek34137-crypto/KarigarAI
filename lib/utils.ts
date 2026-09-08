import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes safely with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format Indian Rupees (INR) with standard comma separation (e.g. ₹1,250)
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generate a clean, URL-safe slug from a product title and random entropy suffix
 */
export function generateSlug(title: string): string {
  const sanitized = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${sanitized || "product"}-${suffix}`;
}
