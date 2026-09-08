# KarigarAI — Environment Setup & Configuration Guide (ENVIRONMENT.md)

## 1. Overview

KarigarAI requires credentials for two cloud services:
1. **Google AI Studio (Gemini API):** Multimodal image inspection, bilingual catalog translation, and pricing reasoning.
2. **Supabase Cloud (PostgreSQL + Auth + Storage):** Database persistence, artisan authentication, and product photo storage.

Both services offer generous free tiers suitable for development, testing, and SIH evaluation.

---

## 2. Environment Variables Specification

| Variable Name | Required? | Exposed to Browser? | Purpose / Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | **Yes** | Yes (`NEXT_PUBLIC_`) | Supabase project API gateway URL (e.g., `https://xyz.supabase.co`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Yes** | Yes (`NEXT_PUBLIC_`) | Safe public anon key for browser client authentication. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Yes** | **NO (Server Only)** | Elevated service key for backend admin tasks and seed scripts. |
| `GEMINI_API_KEY` | **Yes** | **NO (Server Only)** | Google Gemini API key used in server actions. |
| `NEXT_PUBLIC_APP_URL` | **Yes** | Yes (`NEXT_PUBLIC_`) | Base canonical URL (e.g. `http://localhost:3000` or production domain). |
| `NODE_ENV` | Optional | Auto-set | `development`, `test`, or `production`. |

---

## 3. Step-by-Step Acquisition Guide

### 3.1 Obtaining Google Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Log in with any Google account.
3. Click **"Get API key"** in the left sidebar navigation.
4. Click **"Create API key"** (select a new or existing Google Cloud project).
5. Copy the generated key string.
6. Paste into your `.env.local` as `GEMINI_API_KEY=AIzaSy...`.

### 3.2 Setting Up Free Supabase Project
1. Visit [Supabase](https://supabase.com/) and sign in / sign up with GitHub.
2. Click **"New Project"**.
3. Name your project: `karigarai-sih`.
4. Set a strong database password and choose the nearest region (e.g. `South Asia (Mumbai)`).
5. Once provisioned (approx. 60 seconds):
   * Navigate to **Project Settings ➔ API**.
   * Copy the **Project URL** ➔ set as `NEXT_PUBLIC_SUPABASE_URL`.
   * Copy the **`anon` `public` key** ➔ set as `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   * Copy the **`service_role` `secret` key** ➔ set as `SUPABASE_SERVICE_ROLE_KEY`.
6. Navigate to **SQL Editor**:
   * Open `supabase/migrations/00001_initial_schema.sql` from this repository.
   * Paste and click **Run** to provision tables, triggers, and RLS policies.
7. Navigate to **Storage**:
   * Verify the `product-images` bucket exists with public read access enabled.

---

## 4. Local Verification Commands

After populating `.env.local`, verify configuration health:

```bash
# 1. Verify TypeScript types compile cleanly
npm run typecheck

# 2. Run local development server
npm run dev

# 3. Test production build locally
npm run build
```
