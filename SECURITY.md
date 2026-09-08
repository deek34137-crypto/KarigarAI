# KarigarAI — Security Architecture & Threat Model (SECURITY.md)

## 1. Overview & Threat Model

KarigarAI handles artisan identity, sensitive cost information, product media, and public-facing catalogs. Security must be uncompromising, even in an MVP, while remaining lightweight and cost-effective.

### Primary Threat Vectors:
1. **API Key Exfiltration:** Leaking `GEMINI_API_KEY` or `SUPABASE_SERVICE_ROLE_KEY` in client-side bundles.
2. **Unauthorized Data Access / Tampering:** An artisan modifying or deleting another artisan's products or profiles.
3. **Malicious File Uploads:** Uploading executables or scripts masked as image files.
4. **Prompt Injection & AI Poisoning:** Malicious text attempting to hijack the AI cataloger into generating inappropriate or offensive content.
5. **Denial of Service (DoS) on AI Endpoints:** Spammed requests exhausting Google Gemini API quotas.

---

## 2. Security Countermeasures

### 2.1 Credential & Secret Isolation
* **Zero Client Leakage:** Only environment variables prefixed with `NEXT_PUBLIC_` are bundled into the client browser. 
* `GEMINI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are strictly read from `process.env` on server-side runtime environments (Next.js Server Actions and Route Handlers).
* `.env*.local` is explicitly ignored in `.gitignore`.

### 2.2 Database Authorization & Row Level Security (RLS)
* Supabase PostgreSQL enforces **Row Level Security** on every table.
* Even if an attacker obtains the `NEXT_PUBLIC_SUPABASE_ANON_KEY`, PostgreSQL queries are scoped strictly to the authenticated `auth.uid()`.
* Public users are restricted to `SELECT` operations on products where `status = 'published'`.

### 2.3 File Upload Security
* **MIME-Type & Extension Whitelisting:** Only `image/jpeg`, `image/png`, and `image/webp` are permitted.
* **Payload Size Limits:** Max file size is capped at **5MB** on upload, with client-side canvas compression targeting $\le \text{1.5MB}$ prior to network transmission.
* **Randomized Storage Keys:** Files are renamed using UUIDs:
  `product-images/{artisan_id}/{uuid}.webp`
  Preventing directory traversal or file-overwrite attacks.

### 2.4 Prompt Injection Mitigation & Content Filtering
* System prompts use structural delimiters and clear framing to separate system instructions from untrusted user inputs.
* Inputs are sanitized: strings are stripped of command characters, capped at 500 characters for voice/text notes, and validated via Zod.
* Gemini's default safety filters are maintained to block hate speech, harassment, and sexually explicit content.

### 2.5 Rate Limiting
* For the MVP, basic in-memory or IP-based rate limiting caps AI generation requests to a maximum of **10 requests per minute per IP/user**.
* Client UI disables submission buttons during ongoing processing to prevent double-submitting.

---

## 3. Incident Response & Responsible Disclosure

If any vulnerability is identified during hackathon evaluation or testing, please report immediately to the lead maintainer at `security@karigarai.org`. Critical fixes will be applied within 24 hours.
