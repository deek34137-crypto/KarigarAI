# KarigarAI — UI/UX Design System & Accessibility Guidelines (UI_UX.md)

## 1. Design Philosophy: "Indian Craft Meets Modern Utility"

KarigarAI is built for artisans whose hands shape clay, weave silk, and carve wood — not users accustomed to complex digital dashboards. The user interface must feel intuitive, respectful, tactile, and effortless.

### Core Principles:
1. **Camera & Voice as the Primary Keyboard:** Minimize text fields. Photos provide 70% of product context; voice notes provide the remaining 30%.
2. **One Decision at a Time:** Every screen presents one prominent primary action (e.g., "Take Photo", "Record Description", "Approve Listing").
3. **Bilingual Parity:** English and Hindi are treated with equal visual elegance. Hindi text rendered in Noto Sans Devanagari is balanced with English typography.
4. **Physicality & Tactile Cues:** Large touch targets ($\ge 48\text{px}$), subtle haptics, clear states, and warm earthy tones honoring Indian craft traditions.
5. **Human Error Tolerance:** No technical error codes. Clear, empathetic explanations in the artisan's preferred language.

---

## 2. Color Palette & Visual Tokens

The color scheme blends the raw earthy authenticity of Indian handicraft clusters with crisp modern legibility:

| Token | Hex Value | Semantic Purpose |
| :--- | :--- | :--- |
| **`terracotta-600`** | `#C2410C` | Primary Brand Color: action buttons, active navigation indicators, key highlights. |
| **`terracotta-700`** | `#9A3412` | Pressed button states, high-contrast text accents. |
| **`terracotta-50`** | `#FFF7ED` | Warm background tint for cards, input containers. |
| **`saffron-500`** | `#F59E0B` | Secondary accent: cultural heritage badges, pricing highlights, ratings. |
| **`forest-600`** | `#16A34A` | Success states: verified attributes, published status badges, WhatsApp action button. |
| **`slate-900`** | `#0F172A` | Primary text: ultra-high contrast for bright outdoor sunlight conditions. |
| **`slate-500`** | `#64748B` | Secondary helper labels, timestamps, metadata. |
| **`slate-100`** | `#F1F5F9` | Neutral card backgrounds, borders, skeleton loaders. |

---

## 3. Typography System

* **English Typeface:** `Inter` (crisp, clean modern sans-serif).
* **Hindi Typeface:** `Noto Sans Devanagari` (optimized for clear conjuncts, vowel matras, and legibility at small sizes).
* **Hierarchy:**
  * **H1 / Screen Title:** 24px / 1.3 / Bold (`text-2xl font-bold`)
  * **H2 / Section Header:** 18px / 1.4 / SemiBold (`text-lg font-semibold`)
  * **Body / Description:** 15px / 1.5 / Regular (`text-base leading-relaxed`)
  * **Action CTA Labels:** 16px / 1.2 / Bold (`text-base font-bold tracking-wide`)
  * **Microcopy / Helper:** 13px / 1.4 / Medium (`text-xs text-slate-500`)

---

## 4. Component Patterns

### 4.1 Touch Targets & Buttons
* Minimum touch target: **$48 \times 48$ pixels** across all interactive elements.
* Primary buttons feature full width on mobile (`w-full py-3.5 rounded-xl text-lg font-semibold shadow-md`).
* Loading states display animated pulsing spinners with clear progress text ("AI विश्लेषण कर रहा है..." / "Analyzing craft details...").

### 4.2 Language Switcher (भाषा चयन)
* Always accessible in the top app header: a compact, high-contrast segmented pill toggle: `[ हिंदी | English ]`.
* State persists across browser sessions using local storage and cookie sync.

### 4.3 Voice Input Component
* Dedicated large microphone pill button.
* Animated soundwave pulsation when listening.
* Instant visual transcript preview with a clear "Clear / पुनः बोलें" tap button.

### 4.4 Before / After Image Comparison
* Standardized split-view slider allowing the artisan to drag and visually verify studio background normalization and crop centering.

---

## 5. Accessibility & Mobile Emulation Standards

* **Tested Screen Viewports:** 360px (entry-level Android like Redmi Go), 390px (iPhone standard), 412px (Samsung Galaxy).
* **Contrast Ratio:** WCAG 2.1 AAA compliance for all text against backgrounds ($> 7:1$ for body copy).
* **Network Throttling Tolerance:** Visual skeleton loaders display immediately during data fetching.
