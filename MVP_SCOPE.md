# KarigarAI — MVP Scope & Feature Demarcation (MVP_SCOPE.md)

## 1. Guiding Principle: Strict Scope Discipline

This project is built for **Smart India Hackathon 2026** by a **first-year solo college developer**. 
The golden rule of this MVP is:
> **"Build a rock-solid, fully functioning 3-minute core loop rather than a shallow, half-baked 20-feature marketplace."**

Every feature is categorized under one of three strict tiers:
* **Tier 1: MVP (Must Have for SIH 2026 Demo)**
* **Tier 2: Post-MVP (Fast-Follow Enhancements)**
* **Tier 3: Future Vision (National Scale & Ecosystem Integrations)**

---

## 2. Feature Breakdown by Tier

### Tier 1: MVP Scope (Current Target)

| Feature Area | In-Scope MVP Functionality | Technical Boundary |
| :--- | :--- | :--- |
| **1. Artisan Onboarding** | Single-screen minimal profile: Name, phone/WhatsApp, preferred language (Hindi/English), craft category, district/state. | Supabase Auth (Email or simple OTP / Test Auth), single `profiles` table row. |
| **2. Product Creation** | Image capture via phone camera or file upload, client-side preview, optional raw description (text or native Web Speech API voice note). | HTML5 File input with camera capture attribute (`capture="environment"`), Web Speech API. |
| **3. AI Vision Analysis** | Multimodal Gemini Vision extracts craft type, material, visual attributes, and confidence indicators. | Google Gemini 1.5 Flash / 2.5 server-side action with Zod schema validation. |
| **4. Bilingual Smart Catalog** | Generates professional English & Hindi product titles, detailed descriptions, search tags, and key product specs. | Structured JSON output from Gemini parsed into strictly typed React components. |
| **5. AI Image Studio** | Image aspect ratio normalization (1:1 e-commerce square), standardized framing, contrast/lighting cleanup, before/after preview. | Client-side HTML5 Canvas manipulation + CSS filter rendering, graceful fallback to original. |
| **6. Transparent Pricing** | Deterministic base cost calculation (Materials + Labour + Overhead) + AI market markup reasoning providing fair price range. | Pure TypeScript mathematical formula + Gemini reasoning for market markup. |
| **7. Product Management** | Artisan dashboard displaying saved products, draft/published status, and edit/delete capabilities. | Supabase PostgreSQL query with RLS. |
| **8. Public Market Linkage** | Publicly accessible, responsive product page at `/products/[slug]` with craft details, bilingual toggle, and direct "Inquire on WhatsApp" CTA. | Next.js dynamic route (`/app/products/[slug]/page.tsx`), OpenGraph tags, WhatsApp URI scheme. |
| **9. Heritage Craft Story** | Optional feature allowing artisan to add generational craft origin and process, polished into a cultural narrative. | Gemini text generation strictly grounded in artisan input (no hallucinated historical claims). |

---

### Tier 2: Post-MVP Scope (Next Iteration)

* **Voice Playback (Text-to-Speech):** Audio readback of generated Hindi descriptions so non-literate artisans can verify their listing without reading text.
* **Direct Multi-Image Gallery:** Uploading up to 4 angles of a product instead of a single primary shot.
* **PDF Printable Catalog:** Generating a downloadable 1-page PDF printable catalog flyer with QR code for village exhibition stalls.
* **Offline Draft Support:** Saving unfinished product drafts to browser IndexedDB when internet connectivity drops.
* **SMS / WhatsApp Status Updates:** Automated notification to artisan when their link is clicked or shared.

---

### Tier 3: Explicitly Out of Scope (Future Vision)

These features are **STRICTLY FORBIDDEN** from being implemented in the SIH 2026 MVP to prevent failure, excessive complexity, and presentation of non-working stubs:

* ❌ **Full E-Commerce Marketplace:** No consumer shopping carts, checkout funnels, payment gateways (Razorpay/Stripe), or order management.
* ❌ **Live Delivery & Logistics Integration:** No Shiprocket, Delhivery, or India Post API integrations.
* ❌ **Native iOS / Android Apps:** No React Native, Flutter, Kotlin, or Swift codebase (The Next.js web application is 100% mobile-first PWA responsive).
* ❌ **Government Portal Live Integrations (GeM / ONDC live nodes):** No live transaction endpoints with GeM or ONDC (documented as strategic roadmap integrations only).
* ❌ **Real-Time Web Scraping of Competitor Prices:** No fragile headless scrapers scraping Amazon or Etsy in real-time.
* ❌ **Blockchain / Smart Contracts:** No Web3, crypto wallets, or NFT provenance tokens.
* ❌ **Complex B2B Buyer Matching Engine:** No complex multi-sided enterprise recommendation algorithms.
* ❌ **Microservices / Kubernetes:** No distributed microservice mesh; KarigarAI is a clean, cost-effective monolithic Next.js architecture.

---

## 3. Scope Enforcement Rules

1. **The "Does the Artisan Need This in 3 Minutes?" Test:** If a proposed feature does not assist the artisan in creating or sharing their product catalog within the 3-minute demo flow, it is deferred.
2. **Honesty Over Pretense:** Never simulate a non-existent feature with fake loading spinners or dummy "success" toasts if the backend does not actually perform the task.
3. **Graceful Degradation:** If any AI feature fails, the application must still allow manual entry and saving of the product.
