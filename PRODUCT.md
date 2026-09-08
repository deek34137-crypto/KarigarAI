# KarigarAI — Product Specification (PRODUCT.md)

## 1. Problem Definition & Context

### 1.1 Context: Ministry of Social Justice and Empowerment (MoSJE)
In India, millions of traditional artisans belong to historically marginalized communities (Scheduled Castes, Scheduled Tribes, Nomadic Tribes, and Other Backward Classes). These craftspeople possess centuries of inherited wisdom in handlooms, pottery, leather craft, metal casting, block printing, and wood carving. 

Despite the explosive growth of India's e-commerce ecosystem (ONDC, Amazon Karigar, Flipkart Samarth), the vast majority of grassroots artisans remain completely excluded from direct market access. 

### 1.2 Core Bottlenecks
1. **The Cataloging Friction:** Creating an online listing requires professional photography, English copywriting, category classification, search tags, and attribute specification. A rural artisan cannot produce this without expensive intermediaries.
2. **Language Exclusion:** Traditional artisans think, speak, and negotiate in vernacular dialects (Hindi, Bundeli, Bhojpuri, Gujarati, Tamil, etc.), whereas modern commerce platforms demand English literacy.
3. **Exploitative Middlemen:** Middlemen capture 60–80% of consumer retail value because artisans lack market visibility and objective pricing models for their labor and materials.
4. **Perception Gap:** Raw smartphone photos taken in dim workshops or cluttered courtyards look amateurish compared to commercial studio product shots, depressing consumer willingness to pay.
5. **Loss of Authentic Heritage Narrative:** Mass-produced factory imitations undercut handmade crafts because buyers cannot verify the human story, traditional technique, and cultural soul behind the item.

---

## 2. Product Vision & Mission

> **Vision:** Democratize digital commerce for India's traditional craftspeople by turning any mobile phone into an intelligent, multilingual digital studio and market cataloger.

> **Mission:** Enable a low-digital-literacy artisan to create a professional, culturally grounded, bilingual product listing in under 3 minutes with zero typing.

---

## 3. Target User Personas

### Persona A: Rameshwar "Ramesh" Prajapati (Primary Persona)
* **Age:** 51 years old
* **Location:** Rural cluster near Gorakhpur, Uttar Pradesh
* **Craft:** Traditional Terracotta (GI Craft)
* **Education & Literacy:** 5th grade; fluent in Bhojpuri and Hindi; cannot read or write English.
* **Device:** Budget Android smartphone (2GB RAM, 4G connection).
* **Pain Point:** Sells exquisite water pitchers and diyas at roadside haats for ₹100–₹150. Middlemen buy in bulk and resell in Delhi or Mumbai for ₹800–₹1,200. He tried opening an online seller account once but abandoned it because the forms required English descriptions and computer uploads.
* **KarigarAI Solution:** Ramesh takes a photo of his clay surahi, speaks for 20 seconds in Hindi explaining the clay type and firing process, enters his raw costs, and gets an instant bilingual listing with a shareable WhatsApp link.

### Persona B: Sunita Devi (Secondary Persona)
* **Age:** 36 years old
* **Location:** Maheshwar cluster, Madhya Pradesh
* **Craft:** Handloom Maheshwari Sarees & Dupattas
* **Education & Literacy:** 8th grade; functional Hindi reading; uses WhatsApp voice notes daily.
* **Device:** Shared family Android phone.
* **Pain Point:** Customers across India contact her via WhatsApp asking for "photos and details", but sending raw unedited photos with no prices leads to endless haggling and abandoned inquiries.
* **KarigarAI Solution:** Sunita generates clean catalog cards with standardized backgrounds and fair price ranges to send directly to buyers on WhatsApp.

---

## 4. Product Principles

1. **Camera & Voice First:** The camera lens and microphone are the primary input devices. Typing is strictly an optional fallback.
2. **Extreme Simplicity & Progressive Disclosure:** Present only one primary decision per screen. Avoid dense e-commerce dashboards.
3. **Vernacular Parity:** Hindi is treated as a first-class language alongside English, with Devanagari typography given equal visual weight.
4. **Honest & Grounded AI:** The system never presents AI guesses as verified facts. Confidence indicators and explicit source tags distinguish between artisan statements and AI suggestions.
5. **Ultra-Low Data & Compute Footprint:** The web application must load fast on 3G/4G rural networks and function smoothly without high-end mobile hardware.

---

## 5. Detailed Feature Specifications

### 5.1 Artisan Profile & Onboarding (Minimalist)
* **Goal:** Capture only essential information in < 45 seconds.
* **Fields:** 
  * Full Name (आवेदक का नाम)
  * Preferred Language (Hindi / English toggle)
  * Primary Craft Cluster (e.g., Terracotta, Handloom, Woodcraft, Leather, Metalwork)
  * Location (District, State)
  * Phone Number (for WhatsApp buyer linkage)
* **Anti-Pattern Avoided:** No mandatory email, GSTIN, PAN, or complex business registration for the MVP.

### 5.2 Product Creation & Image Ingestion
* **Goal:** Zero-friction photo submission.
* **Capabilities:**
  * Direct device camera capture or file picker from gallery.
  * Live visual preview.
  * Client-side image compression (keeps uploads under 2MB).
  * Audio voice description or short text input in Hindi/English.

### 5.3 Multimodal AI Vision Analysis
* **Goal:** Automated visual understanding without manual tagging.
* **Pipeline:** Google Gemini multimodal analysis extracts:
  * Probable craft category and traditional technique.
  * Detected raw materials (e.g., terracotta clay, mulberry silk, brass).
  * Visual attributes (color palette, patterns, motifs, shape).
  * Suggested usage and target buyer keywords.
* **Safety Constraint:** Outputs are returned in strict JSON matching a Zod schema.

### 5.4 Bilingual Smart Cataloger
* **Goal:** Professional e-commerce copy ready for domestic and international buyers.
* **Outputs Generated:**
  * Professional English Title (e.g., "Handcrafted Terracotta Water Flask with Traditional Floral Motifs")
  * Professional Hindi Title (e.g., "पारंपरिक हस्तनिर्मित टेराकोटा जल सुराही")
  * English Description (detailed specifications, dimensions, care instructions)
  * Hindi Description (culturally resonant description accessible to local buyers)
  * 5–8 Search Tags (e.g., `#HandmadePottery`, `#VocalForLocal`, `#TerracottaCraft`)

### 5.5 AI Image Studio (MVP Tier)
* **Goal:** Clean, commercial presentation of rustic photos.
* **Capabilities:**
  * Aspect ratio standardization (1:1 square for e-commerce, 4:5 mobile portrait).
  * Background cleanup / contrast normalization.
  * Side-by-side interactive before/after slider comparison.
  * Graceful fallback to original compressed image if image-processing service is slow or unavailable.

### 5.6 Transparent Pricing Assistant
* **Goal:** Protect artisan from undervaluation while ensuring transparent, explainable economics.
* **Deterministic Calculation:**
  $$\text{Base Cost} = \text{Raw Materials Cost} + \text{Artisan Labour (Hours} \times \text{Fair Hourly Wage)} + \text{Overheads (Fuel/Tools)}$$
* **AI Market Markup Reasoning:**
  * Evaluates craft rarity, intricate detailing, and packaging overhead.
  * Suggests a fair retail price range (e.g., Min Price: ₹850, Recommended Price: ₹1,100, Max Price: ₹1,350).
  * Provides a concise explanation in Hindi & English (e.g., "Allows for 30% profit margin and covers fragile packaging").
  * **Strict Disclaimer:** Labeled as *"AI-Assisted Cost Estimate"* — never as "Real-Time Exchange Rate" or "Government Certified Rate".

### 5.7 Public Product Listing & Market Linkage
* **Goal:** Immediate utility and exposure without waiting for complex marketplace integrations.
* **Public Route:** `/products/[slug]`
* **Contents:**
  * High-resolution processed product imagery.
  * Bilingual title and description toggle.
  * Craft origin, artisan name, and cluster location badge.
  * Transparent price range.
  * Direct "Inquire via WhatsApp" (व्हाट्सएप पर संपर्क करें) button prefilled with product title and URL.
  * Native Mobile Web Share API button for 1-tap sharing to social groups.

### 5.8 Heritage & Craft Story Engine
* **Goal:** Cultural preservation aligned with the SIH "Heritage & Culture" theme.
* **Features:**
  * Captures artisan's oral family history, generational technique, and village lore.
  * Polishes the narrative into a compelling heritage story.
  * Protects against hallucination: The AI is explicitly forbidden from inventing fake historical dates, GI certificates, or royal patronage claims not provided by the artisan.

---

## 6. Success Metrics & Demonstration KPIs

| Metric | Baseline (Traditional Process) | KarigarAI Target (MVP) |
| :--- | :--- | :--- |
| Time to create digital product listing | 30–60 minutes (via middleman/operator) | **< 3 minutes** (Self-service by artisan) |
| Cost to artisan per listing | ₹150–₹500 (photographer + data entry operator) | **₹0** (Free web application) |
| Language barrier | English required | **100% Hindi voice/text native support** |
| Pricing transparency | Guesswork / Underpricing | **Transparent formula + market reasoning** |
| Time to shareable market link | Days to weeks | **Instant (1-tap publish)** |
