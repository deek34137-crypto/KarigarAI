# KarigarAI — API Specification & Server Endpoints (API.md)

## 1. Overview & Transport Protocol

KarigarAI combines **Next.js Server Actions** for seamless form mutations with **Next.js Route Handlers (`/api/*`)** for RESTful API interoperability.

* **Base URL:** `/api/`
* **Transport:** HTTPS / JSON
* **Authentication:** Supabase Auth Bearer Tokens via HTTP cookies / Auth headers (`sb-access-token`).
* **Error Format:** RFC 7807 Problem Details Standard.

---

## 2. API Endpoints

### 2.1 Analyze Product Image (Multimodal Vision)
Runs server-side Gemini Vision analysis on an uploaded product image.

* **Route:** `POST /api/ai/analyze-image`
* **Auth:** Required (Authenticated Artisan)
* **Request Body:**
```json
{
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "mimeType": "image/jpeg",
  "craftHint": "Terracotta pottery"
}
```
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "detectedTitle": "Handcrafted Terracotta Water Pitcher",
    "category": "Kitchen & Dining",
    "craftType": "Terracotta Pottery",
    "primaryMaterial": "Natural Terracotta Clay",
    "visualAttributes": [
      "Earthy reddish-brown finish",
      "Hand-engraved floral bands",
      "Traditional flared rim"
    ],
    "suggestedTags": ["terracotta", "clay-pottery", "handmade-surahi", "eco-friendly"],
    "confidenceScores": {
      "categoryConfidence": 0.95,
      "materialConfidence": 0.92,
      "craftTypeConfidence": 0.88
    }
  }
}
```

---

### 2.2 Generate Bilingual Catalog
Generates comprehensive Hindi and English listing details from vision attributes and artisan voice/text.

* **Route:** `POST /api/ai/generate-catalog`
* **Auth:** Required
* **Request Body:**
```json
{
  "visionData": {
    "detectedTitle": "Handcrafted Terracotta Water Pitcher",
    "category": "Kitchen & Dining",
    "craftType": "Terracotta Pottery",
    "primaryMaterial": "Natural Terracotta Clay"
  },
  "artisanRawNote": "यह हमारे गोरखपुर की लाल मिट्टी की सुराही है। पानी को प्राकृतिक रूप से ठंडा रखती है।",
  "craftCluster": "Gorakhpur, Uttar Pradesh"
}
```
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "titleEnglish": "Traditional Handcrafted Terracotta Water Pitcher (Surahi)",
    "titleHindi": "पारंपरिक हस्तनिर्मित टेराकोटा जल सुराही",
    "descriptionEnglish": "Hand-thrown on a traditional potter's wheel using rich natural clay from Gorakhpur...",
    "descriptionHindi": "गोरखपुर की प्रसिद्ध लाल मिट्टी से चाक पर हस्तनिर्मित यह पारंपरिक सुराही...",
    "tagsEnglish": ["terracotta-pitcher", "natural-clay-surahi", "gorakhpur-craft", "handmade-india"],
    "tagsHindi": ["टेराकोटा-सुराही", "मिट्टी-का-बर्तन", "गोरखपुर-शिल्प", "हस्तशिल्प"],
    "keyAttributes": [
      {
        "attributeNameEn": "Material",
        "attributeNameHi": "सामग्री",
        "attributeValueEn": "Natural Kiln-Fired Clay",
        "attributeValueHi": "प्राकृतिक पक्की मिट्टी"
      }
    ]
  }
}
```

---

### 2.3 Transparent Pricing Calculation & Reasoning
Evaluates deterministic base costs and generates AI-assisted fair markup reasoning.

* **Route:** `POST /api/ai/suggest-pricing`
* **Auth:** Required
* **Request Body:**
```json
{
  "materialCost": 150.00,
  "labourHours": 4.5,
  "hourlyWage": 100.00,
  "overheadCost": 50.00,
  "craftType": "Terracotta Pottery",
  "intricacyLevel": "Detailed"
}
```
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "baseCost": 650.00,
    "suggestedMarkupPercent": 35,
    "suggestedMinPrice": 780.00,
    "suggestedMaxPrice": 950.00,
    "recommendedPrice": 880.00,
    "reasoningEnglish": "Calculated with ₹650 base production cost (₹150 materials + ₹450 labour + ₹50 overhead). A 35% markup provides sustainable livelihood margin while accounting for delicate packing.",
    "reasoningHindi": "कुल लागत ₹650 (सामग्री ₹150 + श्रम ₹450 + अन्य ₹50)। 35% लाभ कारीगर की मेहनत और सुरक्षित पैकेजिंग को सुनिश्चित करता है।",
    "basis": "cost_assisted_ai_estimate"
  }
}
```

---

### 2.4 Publish Product
Finalizes a product draft and issues a unique public URL slug.

* **Route:** `POST /api/products/publish`
* **Auth:** Required (Artisan Owner)
* **Request Body:**
```json
{
  "productId": "7b8d4f23-8c44-42b3-9ec2-a1f94532b21c"
}
```
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "productId": "7b8d4f23-8c44-42b3-9ec2-a1f94532b21c",
    "status": "published",
    "slug": "traditional-terracotta-water-pitcher-surahi-4912",
    "publicUrl": "/products/traditional-terracotta-water-pitcher-surahi-4912"
  }
}
```

---

## 3. Standard Error Response (RFC 7807)

When an error occurs, the server responds with a uniform error schema:

```json
{
  "type": "https://karigarai.org/errors/ai-validation-error",
  "title": "AI Output Schema Validation Failed",
  "status": 422,
  "detail": "The AI response did not contain required field 'titleHindi'.",
  "instance": "/api/ai/generate-catalog",
  "fallbackAvailable": true
}
```
