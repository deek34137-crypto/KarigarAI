# KarigarAI (कारीगरAI) 🇮🇳
### AI-Driven Market Linkage and Smart Cataloging for Marginalized Artisans

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH-2026-orange.svg)](https://sih.gov.in/)
[![Problem Statement](https://img.shields.io/badge/Problem%20ID-SIH26090-blue.svg)](https://sih.gov.in/)
[![Theme](https://img.shields.io/badge/Theme-Heritage%20%26%20Culture-brightgreen.svg)](#)
[![Ministry](https://img.shields.io/badge/Ministry-Social%20Justice%20%26%20Empowerment-yellow.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 1. Executive Summary

**KarigarAI** is a mobile-first web application designed specifically for traditional, low-digital-literacy artisans across India. Developed for **Smart India Hackathon (SIH) 2026**, Problem Statement **SIH26090**, KarigarAI empowers rural and marginalized craftspeople (potters, handloom weavers, metalworkers, woodcarvers) to turn a simple product photo and oral description into a market-ready, bilingual (Hindi & English) digital catalog in under 3 minutes.

The platform eliminates the digital barrier: artisans do not need to speak English, master complex e-commerce seller portals, or understand SEO. With multimodal AI, transparent cost-based pricing logic, and instant shareable public web links, KarigarAI directly fosters digital inclusion, economic agency, and cultural preservation.

---

## 2. SIH 2026 Problem Statement Alignment

* **Problem Statement ID:** `SIH26090`
* **Title:** AI-Driven Market Linkage and Smart Cataloging Mobile Application for Marginalized Artisans
* **Organization:** Ministry of Social Justice and Empowerment
* **Theme:** Heritage & Culture
* **Category:** Software
* **Target Users:** Scheduled Caste (SC), Scheduled Tribe (ST), OBC, rural women, and generational craftspeople with limited formal education and digital literacy.

### Problem vs. KarigarAI Solution Matrix

| Real-World Problem Identified by Ministry | KarigarAI Architectural Solution | Implementation Status |
| :--- | :--- | :--- |
| **Cataloging Barrier:** Artisans struggle to write professional titles, descriptions, and attributes in English for online commerce. | **Multimodal AI Auto-Cataloger:** Takes a photo and artisan voice/text in Hindi/vernacular, producing structured Hindi & English listings. | ✅ MVP Core Pipeline |
| **Language Exclusion:** Most e-commerce interfaces are English-first and form-heavy. | **Bilingual Native UI & Voice Input:** Native Devanagari Hindi support, high-contrast visual cues, minimal typing. | ✅ MVP Core Pipeline |
| **Substandard Photography:** Harsh lighting, cluttered village backgrounds lower perceived product value. | **AI Image Studio:** Aspect ratio standardization, automated crop, and background normalization. | ✅ MVP Core Pipeline |
| **Unfair Exploitation & Pricing Uncertainty:** Middlemen exploit artisans who don't know fair market value. | **Transparent Pricing Assistant:** Deterministic base cost calculation (Materials + Labour + Overhead) coupled with AI market markup reasoning. | ✅ MVP Core Pipeline |
| **Lack of Digital Market Linkage:** Craft exhibitions (melas) occur only a few times a year. | **Instant Public Product Pages:** Shareable web page (`/products/[slug]`) with inquiry CTA via WhatsApp/call. | ✅ MVP Core Pipeline |
| **Loss of Cultural Lineage:** Machine products impersonate authentic handcrafted heritage. | **Craft Heritage Story Engine:** Records authentic generational lineage, techniques, and geographical craft origins. | ✅ MVP Core Pipeline |

---

## 3. Core User Journey (The 3-Minute Flow)

```text
[ 1. Open App ]
       │
       ▼
[ 2. Snap / Upload Product Photo ]
       │
       ▼
[ 3. Multimodal AI Vision Analysis ]
     (Detects craft type, material, visual attributes)
       │
       ▼
[ 4. Artisan Speaks / Types in Hindi ]
     ("यह हाथ से बनी शुद्ध मिट्टी की सुराही है...")
       │
       ▼
[ 5. Bilingual Catalog Generation ]
     (Structured JSON: English & Hindi Title, Description, Tags)
       │
       ▼
[ 6. Transparent Cost & Pricing Assistant ]
     (Material ₹200 + Labour ₹300 + Overhead ₹50 = ₹550 Base ➔ Suggested: ₹700–₹850)
       │
       ▼
[ 7. One-Tap Publish ]
       │
       ▼
[ 8. Shareable Public Market Link ]
     (/products/handcrafted-terracotta-surahi-5491)
```

---

## 4. Technology Stack

* **Frontend Framework:** Next.js 15 (App Router), React 19, TypeScript
* **Styling & Design System:** Tailwind CSS, Lucide React (Accessible iconography)
* **Backend & Database:** Supabase (PostgreSQL 16, Supabase Auth, Row Level Security, Supabase Storage)
* **AI & Multimodal Intelligence:** Google Gemini API (`gemini-1.5-flash` / `gemini-2.5`) via server-side isolated services
* **Validation & Type Safety:** Zod (Runtime JSON schema validation for all AI outputs)
* **Deployment Target:** Vercel (Frontend & Server Actions) + Supabase Cloud (Database, Storage & Auth)

---

## 5. Project Directory Structure

```text
karigarai/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes (login, onboarding)
│   ├── (dashboard)/              # Artisan protected portal (products, studio)
│   ├── (public)/                 # Public shareable listings (/products/[slug])
│   ├── api/                      # Server-side API routes & AI endpoints
│   ├── layout.tsx                # Root layout (Inter + Noto Sans Devanagari)
│   └── page.tsx                  # Landing / Mobile gateway
├── components/                   # Modular UI Component Library
│   ├── ui/                       # Primitive design tokens (Buttons, Cards, Badges)
│   ├── layout/                   # Mobile navigation, headers, language toggle
│   ├── product/                  # Product cards, photo capture, status chips
│   ├── catalog/                  # Bilingual display, tag selector, attribute list
│   ├── image-studio/             # Before/After comparison, crop preview
│   ├── pricing/                  # Cost calculator slider, fair markup indicator
│   └── language/                 # Language switcher (EN/HI)
├── lib/                          # Core business logic & integrations
│   ├── ai/                       # Isolated AI service layer
│   │   ├── gemini.ts             # Google Gemini SDK client & safe runner
│   │   ├── prompts/              # Pure system prompts (Vision, Catalog, Pricing)
│   │   └── schemas/              # Zod validation schemas for AI responses
│   ├── supabase/                 # Supabase client (browser, server, middleware)
│   └── utils.ts                  # Shared formatting, currency, and slug utilities
├── supabase/
│   └── migrations/               # PostgreSQL DDL & Row Level Security policies
├── types/                        # TypeScript domain & database type definitions
├── docs/                         # Extended architectural documentation
├── tests/                        # Unit and integration test suites
├── .env.example                  # Environment configuration template
├── README.md                     # Project master documentation
├── PRODUCT.md                    # In-depth product specification & user personas
├── ARCHITECTURE.md               # Technical architecture & data flows
├── MVP_SCOPE.md                  # Strict MVP vs Post-MVP boundary definitions
├── ROADMAP.md                    # 10-Phase execution roadmap
├── DATABASE.md                   # Complete database schema & RLS policies
├── AI_ARCHITECTURE.md            # Multimodal pipeline, guardrails & validation
├── AI_PROMPTS.md                 # Production prompt registry & system contracts
├── API.md                        # Internal REST/Server Action endpoints
├── SECURITY.md                   # Threat model, RLS & secret safety
├── UI_UX.md                      # Design tokens, accessibility & vernacular guidelines
├── DECISIONS.md                  # Architectural Decision Records (ADRs)
├── DEMO_FLOW.md                  # 2.5-minute live SIH jury demonstration script
└── ENVIRONMENT.md                # Local setup and environment variable guide
```

---

## 6. Local Development Quickstart

### Prerequisites
* Node.js `>= 18.18.0` (Recommended: Node 20 LTS or Node 24)
* npm `>= 9.0.0`
* A free [Supabase](https://supabase.com) account
* A free [Google AI Studio](https://aistudio.google.com) API Key for Gemini

### Step 1: Clone and Install
```bash
cd epic-goodall
npm install
```

### Step 2: Configure Environment Variables
Copy the template to your local environment file:
```bash
cp .env.example .env.local
```
Fill in the values in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Run Database Migrations
Run the SQL migration script located in `supabase/migrations/00001_initial_schema.sql` inside the Supabase SQL Editor.

### Step 4: Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) on your browser or mobile viewport emulator.

---

## 7. MVP Scope Demarcation & Honest Limitations

In strict adherence to engineering integrity and SIH guidelines:

1. **No Fake ML Claims:** We do not claim to have trained custom vision models from scratch; we utilize Gemini Multimodal API with custom, structured prompt engineering and deterministic Zod schemas.
2. **Transparent Pricing:** The Pricing Assistant calculates base cost deterministically (`Materials + Labour + Overhead`) and uses AI reasoning for market markup. It is explicitly labeled **"AI-Assisted Estimate"**, NOT "Verified Real-Time Market Price".
3. **No Fabricated Heritage:** The Heritage Story Engine structures and polishes only artisan-provided oral context; it never fabricates government GI certificates or historical dates.
4. **Out of MVP Scope:** Full e-commerce payment gateways, shopping carts, delivery logistics integrations, ONDC live node communication, and B2B matchmaking are documented for the future roadmap.

---

## 8. SIH 2026 Evaluation Checklist

* [x] **Problem Fit:** High-impact solution for vulnerable artisans under Ministry of Social Justice and Empowerment.
* [x] **Technical Rigor:** Strict TypeScript types, schema-validated AI outputs, Supabase PostgreSQL RLS.
* [x] **Usability:** Vernacular Hindi/English toggle, mobile-first design, low-friction photo/voice interaction.
* [x] **Demonstrability:** Frictionless 3-minute end-to-end user journey testable by hackathon jury.
