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

/**
 * Extracts the appropriate language version from a dual-script string
 * (e.g. "रामेश्वर प्रजापति (Rameshwar Prajapati)" or "Terracotta Pottery (गोरखपुर टेराकोटा)").
 */
export function formatLocalizedText(
  text: string | null | undefined,
  lang: "hi" | "en"
): string {
  if (!text) return "";
  const trimmed = text.trim();

  // Check if string has parentheses: "Part1 (Part2)"
  const match = trimmed.match(/^(.*?)\s*\((.*?)\)$/);
  if (!match) return trimmed;

  const part1 = match[1].trim();
  const part2 = match[2].trim();

  const isDevanagari = (s: string) => /[\u0900-\u097F]/.test(s);
  const isLatin = (s: string) => /[a-zA-Z]/.test(s);

  if (lang === "en") {
    if (isLatin(part2) && !isLatin(part1)) return part2;
    if (isLatin(part1)) return part1;
    return part2 || part1;
  } else {
    // Hindi
    if (isDevanagari(part1)) return part1;
    if (isDevanagari(part2)) return part2;
    return part1 || part2;
  }
}

/**
 * Returns a clean 1-2 character initial for profile avatar circles
 */
export function getLocalizedInitial(
  name: string | null | undefined,
  lang: "hi" | "en"
): string {
  if (!name) return lang === "hi" ? "क" : "K";
  const localized = formatLocalizedText(name, lang);
  return localized.charAt(0).toUpperCase() || (lang === "hi" ? "क" : "K");
}
