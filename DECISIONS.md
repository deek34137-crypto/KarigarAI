# KarigarAI — Architectural Decision Records (DECISIONS.md)

## Record Index

* **ADR-001:** Adoption of Next.js 15 App Router as Monolithic Full-Stack Framework
* **ADR-002:** Selection of Supabase (PostgreSQL, Auth, Storage) as the Backend Infrastructure
* **ADR-003:** Choice of Google Gemini 1.5 Flash / 2.5 for Server-Side Multimodal Intelligence
* **ADR-004:** Strict Schema Validation with Zod for All AI Outputs
* **ADR-005:** Client-Side Canvas Normalization for AI Image Studio MVP
* **ADR-006:** Deterministic Cost Calculator + AI Market Markup vs Black-Box ML Pricing
* **ADR-007:** WhatsApp Direct Linkage as MVP Market Linkage Channel

---

### ADR-001: Adoption of Next.js 15 App Router as Monolithic Full-Stack Framework
* **Status:** Accepted
* **Context:** We are building a solo-developer MVP for SIH 2026. Managing separate front-end (React/Vite) and back-end (Express/Node) repositories introduces CORS complexity, dual deployment pipelines, and synchronization overhead.
* **Decision:** Use Next.js 15 with App Router, TypeScript, React Server Components (RSC), and Server Actions.
* **Consequences:** 
  * Positive: Unified TypeScript types across UI and server; instant Vercel deployment; server actions isolate AI keys securely without requiring standalone microservices.
  * Negative: Requires strict discipline to separate client components (`"use client"`) from server actions.

---

### ADR-002: Selection of Supabase (PostgreSQL, Auth, Storage)
* **Status:** Accepted
* **Context:** The application requires user authentication, relational data with foreign keys, object storage for product photos, and rock-solid authorization.
* **Decision:** Use Supabase Cloud (PostgreSQL 16, Supabase Auth, and Supabase Storage).
* **Consequences:**
  * Positive: Native Row Level Security (RLS) protects multi-tenant data at the database engine level; generous free tier; handles media storage without third-party S3 setup.
  * Negative: Requires configuring environment variables and running initial SQL migration.

---

### ADR-003: Choice of Google Gemini 1.5 Flash / 2.5
* **Status:** Accepted
* **Context:** The core value proposition requires multimodal image analysis (inspecting craft details, materials, and colors) and bilingual catalog generation in Hindi and English with low latency.
* **Decision:** Use Google Gemini 1.5 Flash / 2.5 through the official Google Gen AI SDK.
* **Consequences:**
  * Positive: Outstanding multimodal vision capabilities; natively understands Hindi and regional Indian craft nomenclature; fast response times (<3 seconds); cost-effective free tier.
  * Negative: Dependent on Google AI Studio API availability; requires robust fallback error handling for network drops.

---

### ADR-004: Strict Schema Validation with Zod for All AI Outputs
* **Status:** Accepted
* **Context:** Large language models can occasionally omit fields, return markdown fences, or alter JSON structure. Trusting raw AI output causes runtime crashes in React rendering.
* **Decision:** Pass every raw Gemini response through a strict Zod schema before storing or rendering.
* **Consequences:**
  * Positive: Guaranteed type safety; runtime failure detection; clear error reporting.
  * Negative: Small processing overhead (negligible, < 2ms).

---

### ADR-005: Client-Side Canvas Normalization for AI Image Studio MVP
* **Status:** Accepted
* **Context:** Professional image background removal and 1:1 aspect ratio cropping usually require dedicated cloud GPU services (e.g. Replicate, Remove.bg), which have steep API costs, rate limits, and failure modes.
* **Decision:** For the MVP, implement 1:1 aspect ratio cropping, auto-contrast, and canvas-based border cleanup directly in the browser using HTML5 Canvas, with graceful fallback to the original image.
* **Consequences:**
  * Positive: Instant user feedback; zero server compute costs; 100% offline capability on device.
  * Negative: Does not perform semantic AI segmentation (documented honestly as Tier 2 future scope).

---

### ADR-006: Deterministic Cost Calculator + AI Market Markup vs Black-Box ML Pricing
* **Status:** Accepted
* **Context:** Other hackathon teams often claim to have "trained an ML pricing model" using fake historical datasets or hallucinated market prices. This is dishonest and fragile.
* **Decision:** Compute production base cost deterministically:
  $$\text{Base Cost} = \text{Materials} + (\text{Labour Hours} \times \text{Fair Wage}) + \text{Overhead}$$
  Use Gemini exclusively to reason over fair craft markup percentages (25%–50%) and produce bilingual justifications.
* **Consequences:**
  * Positive: 100% transparent and auditable; builds genuine trust with both artisans and hackathon evaluators; zero fabricated data.
  * Negative: Requires the artisan to input rough material cost and hours worked.

---

### ADR-007: WhatsApp Direct Linkage as MVP Market Linkage Channel
* **Status:** Accepted
* **Context:** Marginalized artisans cannot handle payment gateway KYC, refund policies, and shipping APIs in an MVP. In India, 95%+ of informal artisan trade happens via WhatsApp chat and direct phone calls.
* **Decision:** Every published product generates a public URL (`/products/[slug]`) featuring a direct "Inquire on WhatsApp" CTA preloaded with the product title and link.
* **Consequences:**
  * Positive: Immediate real-world utility; zero payment liability; zero friction for both artisan and prospective buyer.
  * Negative: Does not track completed financial transactions automatically (deferred to future roadmap).

---

### ADR-008: Editorial Assistant Model for Heritage Craft Stories (Anti-Hallucination)
* **Status:** Accepted
* **Context:** Under SIH26090 (Heritage & Culture), AI systems are at risk of fabricating historical dates, false geographic indications (GI Tags), ancient mythology, or fake government awards. Unverified claims harm artisan credibility before evaluators and buyers.
* **Decision:** Treat Gemini strictly as an "editorial structuring and translation assistant", NOT a "heritage fact generator". The model structures and translates solely what the artisan states orally or in writing. Generational lineage is left `null` unless explicitly stated by the artisan. Output carries provenance metadata (`artisan_provided` vs `demo_data`) and public pages display grounded disclaimers.
* **Consequences:**
  * Positive: Zero fabricated claims; builds genuine cultural trust; defensible before SIH evaluators.
  * Negative: Requires the artisan to provide basic recollections about their learning or family history to generate rich stories.

