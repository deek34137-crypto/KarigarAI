# KarigarAI — Engineering Roadmap (ROADMAP.md)

## 1. Phased Implementation Strategy

To ensure systematic progress, maximum reliability, and clear validation at every step, KarigarAI is divided into 10 structured phases:

---

### Phase 0: Planning, Architecture & Project Initialization (✅ COMPLETED)
* **Objective:** Establish the complete conceptual, architectural, and structural foundation for the SIH 2026 project.
* **Tasks:**
  1. Define product vision, user personas, and SIH problem alignment (`PRODUCT.md`).
  2. Architect system components, pipelines, and boundary rules (`ARCHITECTURE.md`).
  3. Demarcate MVP vs Out-of-Scope boundaries (`MVP_SCOPE.md`).
  4. Design PostgreSQL database schema & RLS rules (`DATABASE.md`).
  5. Specify AI service layer, prompts, and Zod output schemas (`AI_ARCHITECTURE.md`, `AI_PROMPTS.md`).
  6. Document security policies, UI/UX tokens, and 2.5-minute demo script (`SECURITY.md`, `UI_UX.md`, `DEMO_FLOW.md`).
  7. Initialize Next.js project structure, configuration files, and core types.
* **Acceptance Criteria:** All 14 foundational specification files created; project directory structure configured; Next.js foundation builds cleanly.
* **Dependencies:** None.

---

### Phase 1: App Foundation & Mobile-First Design System (✅ COMPLETED)
* **Objective:** Build the responsive mobile container, design system tokens, layout scaffolding, and bilingual context provider.
* **Tasks:**
  1. Configure Tailwind colors (terracotta, saffron, warm beige, slate) and Devanagari font typography.
  2. Implement reusable base UI components: `Button`, `Card`, `Badge`, `Input`, `Slider`, `Modal`, `Skeleton`.
  3. Build the mobile layout wrapper with sticky header, bottom navigation bar, and language toggle (Hindi/English).
  4. Set up internationalization dictionary helper for bilingual UI labels.
* **Acceptance Criteria:** Mobile shell renders flawlessly on both mobile viewport and centered desktop view; language toggle switches all UI strings instantly.
* **Dependencies:** Phase 0.

---

### Phase 2: Authentication & Artisan Profile (✅ COMPLETED)
* **Objective:** Implement streamlined, low-friction artisan onboarding and profile management backed by Supabase Auth and PostgreSQL.
* **Tasks:**
  1. Apply PostgreSQL migrations for `profiles` table with Row Level Security.
  2. Implement Supabase client & server helper utilities (`lib/supabase/`).
  3. Build minimal onboarding screen (Name, Language preference, Craft cluster, District/State, WhatsApp number).
  4. Implement profile view & edit screen in artisan dashboard.
* **Acceptance Criteria:** User can register/log in; profile row is created with correct user ID; RLS prevents cross-user access.
* **Dependencies:** Phase 1.

---

### Phase 3: Product Creation Flow & Image Ingestion (✅ COMPLETED)
* **Objective:** Create the mobile-first product capture workflow with instant camera capture and client-side compression.
* **Tasks:**
  1. Build multi-step product wizard: Step 1 (Photo Capture) ➔ Step 2 (Voice/Text Input) ➔ Step 3 (Review & Pricing).
  2. Implement camera shutter button with HTML5 file capture (`capture="environment"`).
  3. Implement client-side canvas image compression to keep payloads under 2MB.
  4. Implement optional voice recording input using the browser's native Web Speech API (with text fallback).
* **Acceptance Criteria:** Artisan can snap or pick a photo; image is compressed and previewed within 500ms; draft product state is stored in state.
* **Dependencies:** Phase 2.

---

### Phase 4: AI Multimodal Cataloger (Gemini Vision + Multilingual Output) (✅ COMPLETED)
* **Objective:** Implement the core AI pipeline that converts photo and oral notes into professional bilingual catalogs.
* **Tasks:**
  1. Implement server-side AI caller in `lib/ai/gemini.ts` using Google Gemini SDK.
  2. Write multimodal analysis prompt and catalog generation prompt.
  3. Implement Zod validation schemas for structured product outputs.
  4. Connect Step 2 of the creation wizard to the AI catalog action with animated loading skeleton.
  5. Render bilingual editable review cards (English title/description & Hindi title/description).
* **Acceptance Criteria:** Valid product photo + Hindi voice note returns validated structured JSON containing bilingual titles, descriptions, and tags in < 5 seconds; errors are caught gracefully.
* **Dependencies:** Phase 3.

---

### Phase 5: AI Image Studio (✅ COMPLETED)
* **Objective:** Provide automated product image standardization and aspect ratio normalization.
* **Tasks:**
  1. Build Python image-processing service with `rembg` background removal and Pillow fallback.
  2. Implement standard 1:1 square crop, center-alignment, and contrast/brightness normalization.
  3. Build interactive Before/After comparison slider component for the artisan to inspect improvements.
  4. Integrate studio into product creation workflow with choice to select Studio or Original photo.
* **Acceptance Criteria:** Uploaded product images can be previewed before/after; images conform to 1:1 e-commerce ratio; graceful degradation if background removal fails.
* **Dependencies:** Phase 4.

---

### Phase 6: Pricing Assistant (✅ COMPLETED)
* **Objective:** Implement the transparent pricing calculator combining deterministic costing with AI market reasoning.
* **Tasks:**
  1. Build intuitive cost input sliders: Material Cost (₹), Labour Time (Hours) × Fair Rate, Overheads (₹).
  2. Implement deterministic math engine calculating exact Base Production Cost.
  3. Implement Gemini pricing reasoning prompt to calculate suggested markup range based on craft category and intricacy.
  4. Display transparent cost breakdown card with bilingual economic justification.
* **Acceptance Criteria:** Base cost is calculated with 100% mathematical accuracy; AI markup is clearly labeled as "AI-Assisted Estimate"; pricing card explains margins clearly in Hindi & English.
* **Dependencies:** Phase 4.

---

### Phase 7: Public Listings & Market Linkage (✅ COMPLETED)
* **Objective:** Build the shareable, high-impact public product page, exhibition stall QR linkage, and artisan catalog dashboard.
* **Tasks:**
  1. Build public shareable listing at `/p/[slug]` using Next.js Server Components for maximum SEO, fast load, and dynamic OpenGraph cards for WhatsApp link previews.
  2. Implement direct "Inquire on WhatsApp" CTA (`wa.me`) with dynamic artisan phone resolution and pre-filled bilingual inquiry message.
  3. Implement Exhibition Stall QR Card generator (`QrModal`) for physical-to-digital market linkage at craft melas (Surajkund, Dastkar, SARAS Aajeevika).
  4. Build Artisan Catalog Dashboard at `/products` with status filtering (`all`, `published`, `draft`), WhatsApp broadcast share, and copy link actions.
  5. Build authenticated product management view at `/products/[id]`.
  6. Honest UI design: labeled as "Artisan Profile" / "Craft Information" without unverified claims; demo seed items labeled "Demo Product".
* **Acceptance Criteria:** Anyone can view `/p/[slug]` without logging in; clicking WhatsApp opens mobile WhatsApp with correct link; QR code generates crisp stall cards; 100% automated test pass.
* **Dependencies:** Phase 5, Phase 6.

---

### Phase 8: Heritage Craft Story & Polish
* **Objective:** Deepen the SIH Heritage & Culture theme alignment and polish the end-to-end user experience.
* **Tasks:**
  1. Build optional "Craft Story" step allowing artisan to record family lineage, craft origin, and traditional techniques.
  2. Implement Gemini prompt to format oral history into an authentic heritage badge.
  3. Add empty states, error boundaries, offline indicators, and micro-interactions.
  4. Perform UX audit on simulated budget Android screen sizes (360px–412px).
* **Acceptance Criteria:** Craft story renders on public product page with cultural respect; UI feels polished, fast, and respectful.
* **Dependencies:** Phase 7.

---

### Phase 9: Testing, Optimization, SIH Demo Readiness & Deployment
* **Objective:** Validate end-to-end reliability, verify zero regressions, configure demo accounts, and deploy to Vercel.
* **Tasks:**
  1. Write unit tests for pricing calculations and Zod validation schemas.
  2. Rehearse 2.5-minute SIH live demonstration flow (`DEMO_FLOW.md`).
  3. Prepare fallback sample datasets for offline demo scenarios.
  4. Deploy to Vercel with production environment variables and Supabase connection.
  5. Document final walk-through and presentation deck talking points.
* **Acceptance Criteria:** 100% pass on automated tests; production URL accessible; 2.5-minute demo succeeds reliably.
* **Dependencies:** Phase 8.
