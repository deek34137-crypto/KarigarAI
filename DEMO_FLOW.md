# KarigarAI — SIH 2026 Live Demonstration Script (DEMO_FLOW.md)

## 1. Demonstration Parameters
* **Target Duration:** Exactly 2 minutes 30 seconds (150 seconds).
* **Audience:** SIH 2026 Grand Finale Evaluation Jury (Ministry of Social Justice & Empowerment, Industry Architects, Academic Experts).
* **Demo Device:** Mobile smartphone or laptop with mobile device emulator (390px viewport).
* **Language:** English spoken presentation; app demonstrated in Hindi with live bilingual toggle.

---

## 2. Timed Presentation Breakdown

```text
[ 0:00 - 0:25 ] Problem Context & Persona Introduction
[ 0:25 - 0:50 ] Live Photo Capture & Multimodal Vision Analysis
[ 0:50 - 1:15 ] Voice Input in Hindi ➔ Bilingual Smart Catalog
[ 1:15 - 1:35 ] Transparent Cost Calculator & AI Pricing Reasoning
[ 1:35 - 1:55 ] 1-Tap Publish & Public Shareable Page Preview
[ 1:55 - 2:15 ] WhatsApp Market Linkage & Cultural Heritage Story
[ 2:15 - 2:30 ] Architecture, Security & SIH MoSJE Alignment Summary
```

---

## 3. Minute-by-Minute Script & Action Guide

### Step 1: The Hook & Problem Setup (0:00 – 0:25)
* **Presenter Action:** Show the KarigarAI mobile interface.
* **Spoken Pitch:**
  > *"Respected Jury members, meet Rameshwar-ji, a 5th-generation terracotta potter from Gorakhpur. His hand-carved water surahis sell for ₹120 to middlemen, who resell them online for ₹1,000. Why? Because Rameshwar-ji cannot write English e-commerce listings, shoot studio photos, or navigate complex seller portals. Under SIH Problem Statement SIH26090, we present **KarigarAI** — turning any smartphone into an intelligent, bilingual digital studio in under 3 minutes."*

### Step 2: Instant Photo Capture & Gemini Vision (0:25 – 0:50)
* **Presenter Action:** Tap **"नया उत्पाद जोड़ें" (Add Product)**. Select a sample photo of a handcrafted terracotta pitcher.
* **Spoken Pitch:**
  > *"Rameshwar-ji doesn't fill out forms. He simply points his camera. In the background, Google Gemini Multimodal AI securely analyzes the image on our server. Within seconds, it identifies: 'Terracotta Pottery', 'Natural Clay', detects the hand-carved floral patterns, and extracts search tags — with 100% structured JSON validation."*

### Step 3: Voice Input ➔ Bilingual Smart Catalog (0:50 – 1:15)
* **Presenter Action:** Tap the microphone icon or play the 10-second Hindi voice note:
  *"यह हमारे गोरखपुर की लाल मिट्टी की सुराही है, पानी को प्राकृतिक रूप से ठंडा रखती है..."*
  Tap **"कैटलॉग बनाएं" (Generate Catalog)**.
* **Spoken Pitch:**
  > *"Rameshwar-ji speaks naturally in his native Hindi. KarigarAI transforms this oral description into professional e-commerce listings in both English and Hindi. Notice the titles, descriptions, and specifications: natural, culturally resonant, and ready for e-commerce."*

### Step 4: Transparent Costing & Pricing Assistant (1:15 – 1:35)
* **Presenter Action:** Navigate to the Pricing step. Show sliders: Material ₹150, Labour 4 hours × ₹100/hr, Overhead ₹50.
* **Spoken Pitch:**
  > *"Middlemen exploit artisans because pricing is opaque. We don't pretend to have a black-box ML model. We calculate exact production cost deterministically: ₹600. Then, our AI Pricing Assistant evaluates craft intricacy and suggests a fair retail range: ₹800 to ₹950, with clear, transparent reasoning in Hindi so Rameshwar-ji knows his worth."*

### Step 5: One-Tap Publish & Public Market Linkage (1:35 – 1:55)
* **Presenter Action:** Tap **"प्रकाशित करें" (Publish)**. The public URL `/products/handcrafted-terracotta-surahi-4912` loads.
* **Spoken Pitch:**
  > *"With one tap, the product is live on a public, mobile-responsive page. Notice the clean studio imagery, the bilingual toggle, and the craft heritage story highlighting Gorakhpur's terracotta tradition."*

### Step 6: Market Linkage in Action & Conclusion (1:55 – 2:30)
* **Presenter Action:** Tap **"व्हाट्सएप पर ऑर्डर करें" (Inquire on WhatsApp)**.
* **Spoken Pitch:**
  > *"A single tap on WhatsApp opens a pre-composed message with the product link directly connecting urban buyers to Rameshwar-ji. In 2 minutes, with zero English typing, a marginalized artisan has achieved direct digital market linkage. KarigarAI: Preserving Heritage, Empowering Artisans. Thank you!"*

---

## 4. Hackathon Contingency Plan (Slow WiFi / Venue Disconnects)

If the convention venue Wi-Fi throttles or drops during the jury round:
1. **Pre-Cached Local Session:** The app includes a demo mode toggle (`NEXT_PUBLIC_DEMO_MODE=true` or UI button) that pre-loads validated, real Gemini JSON responses from previous runs without making live outbound API calls.
2. **Offline Local Storage:** Image captures and form steps survive network disconnects.
3. **Zero Crash Guarantee:** All server actions contain try/catch blocks that return localized fallback objects rather than displaying uncaught error screens.
