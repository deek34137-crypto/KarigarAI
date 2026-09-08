import type { FullProductWithDetails, Profile } from "@/types/product";

// Benchmark artisan profiles used ONLY for demo/seed data — explicitly labeled as demo
export const DEMO_ARTISAN_TERRACOTTA: Profile = {
  id: "00000000-0000-0000-0000-000000000001",
  full_name: "रामेश्वर प्रजापति (Rameshwar Prajapati)",
  phone_number: "+919876543210",
  preferred_language: "hi",
  craft_type: "गोरखपुर टेराकोटा (Gorakhpur Terracotta)",
  state: "Uttar Pradesh",
  district: "Gorakhpur",
  bio: "पारंपरिक टेराकोटा शिल्पकार, प्राकृतिक लाल मिट्टी से हस्तनिर्मित कलाकृतियों का निर्माण।",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

export const DEMO_ARTISAN_WEAVER: Profile = {
  id: "00000000-0000-0000-0000-000000000002",
  full_name: "कमला बाई बुनकर (Kamla Bai)",
  phone_number: "+919812345678",
  preferred_language: "hi",
  craft_type: "महेश्वरी हथकरघा (Maheshwari Handloom)",
  state: "Madhya Pradesh",
  district: "Khargone (Maheshwar)",
  bio: "पुश्तैनी हथकरघा बुनकर, पारंपरिक नर्मदा तट के रूपांकनों वाली शुद्ध रेशम व सूती साड़ियों का निर्माण।",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

// Built-in benchmark demo products — clearly marked with is_demo: true
export const BENCHMARK_DEMO_PRODUCTS: FullProductWithDetails[] = [
  {
    id: "demo-prod-terracotta-pitcher",
    artisan_id: DEMO_ARTISAN_TERRACOTTA.id,
    slug: "gorakhpur-terracotta-pitcher",
    title_en: "Handcrafted Gorakhpur Terracotta Water Pitcher",
    title_hi: "हस्तनिर्मित गोरखपुर टेराकोटा सुराही",
    description_en:
      "Traditional natural clay water pitcher handcrafted by Master Craftsman Rameshwar Prajapati using riverbed clay of Gorakhpur. Features authentic hand-etched floral patterns and naturally cooling porous earthenware properties.",
    description_hi:
      "गोरखपुर की प्राकृतिक आमी नदी की लाल मिट्टी से तैयार की गई पारंपरिक टेराकोटा सुराही। प्राकृतिक रूप से पानी को शीतल रखने वाली एवं बारीक नक्काशीदार हाथ की कलाकृति।",
    category: "Pottery & Claycraft",
    craft_type: "Terracotta Pottery",
    material: "Natural River Clay",
    visual_attributes: {
      color: "Natural Terracotta Red",
      texture: "Smooth clay finish with fine hand-incised motifs",
      dimensions: "Height: 28cm, Diameter: 18cm, Capacity: 2.2L",
      estimated_weight: "1.4 kg",
    },
    original_image_url:
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
    processed_image_url:
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
    base_cost: 380,
    price_min: 650,
    price_max: 950,
    suggested_price: 850,
    pricing_reasoning_en:
      "Base cost comprises ₹110 for refined clay and firing fuel, 4.5 hours of skilled wheel-throwing and hand-etching at ₹55/hr (₹247), plus overheads. Suggested price of ₹850 yields a fair 123% margin recognizing GI-tagged artisanal heritage.",
    pricing_reasoning_hi:
      "मूल लागत ₹380 है जिसमें ₹110 मिट्टी व भट्टी की लागत तथा 4.5 घंटे का कुशल पारिश्रमिक शामिल है। ₹850 का विक्रय मूल्य शिल्पकार को उनके पारंपरिक हुनर का सम्मानजनक मूल्य प्रदान करता है।",
    status: "published",
    created_at: "2026-03-01T10:00:00.000Z",
    updated_at: "2026-03-01T10:00:00.000Z",
    artisan: DEMO_ARTISAN_TERRACOTTA,
    is_demo: true,
  },
  {
    id: "demo-prod-maheshwari-saree",
    artisan_id: DEMO_ARTISAN_WEAVER.id,
    slug: "maheshwari-handloom-silk-saree",
    title_en: "Authentic Maheshwari Handloom Silk-Cotton Saree",
    title_hi: "पारंपरिक महेश्वरी हथकरघा सिल्क-कॉटन साड़ी",
    description_en:
      "Exquisite handwoven saree from Maheshwar featuring reversible zari border inspired by the Ahilya Fort parapets. Woven on traditional pit looms using pure mulberry silk warp and fine mercerized cotton weft.",
    description_hi:
      "महेश्वर के अहिल्या किले के कंगूरों से प्रेरित पारंपरिक ज़री बॉर्डर वाली शुद्ध रेशम एवं सूती हथकरघा साड़ी। पारंपरिक गड्ढा करघे (Pit Loom) पर हाथ से बुनी गई।",
    category: "Textiles & Handloom",
    craft_type: "Maheshwari Weaving",
    material: "Mulberry Silk & Mercerized Cotton",
    visual_attributes: {
      color: "Deep Marigold Ochre with Gold Zari Border",
      texture: "Lightweight gossamer weave with reversible bugdi border",
      dimensions: "Length: 6.3m (including blouse piece), Width: 46 inches",
      estimated_weight: "480 grams",
    },
    original_image_url:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    processed_image_url:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    base_cost: 1650,
    price_min: 2800,
    price_max: 3800,
    suggested_price: 3400,
    pricing_reasoning_en:
      "Raw materials (mulberry silk, cotton yarn, metallic zari) total ₹950. Requires 14 hours of precision loom work at ₹45/hr (₹630) plus loom setup overheads. Suggested price ₹3,400 provides sustainable artisan livelihood.",
    pricing_reasoning_hi:
      "कच्चा माल (रेशम, धागा, ज़री) ₹950 तथा 14 घंटे की सूक्ष्म हथकरघा बुनाई (₹630)। ₹3,400 का मूल्य शिल्पकार परिवार को उचित आजीविका और प्रोत्साहन देता है।",
    status: "published",
    created_at: "2026-03-02T14:30:00.000Z",
    updated_at: "2026-03-02T14:30:00.000Z",
    artisan: DEMO_ARTISAN_WEAVER,
    is_demo: true,
  },
];

export function normalizeKey(key: string): string {
  return decodeURIComponent(key).trim().toLowerCase();
}

/**
 * Retrieves a single product by slug or id.
 * 1. Checks Supabase production database first if accessible.
 * 2. Checks browser local storage (for live session-created items).
 * 3. Falls back to pre-seeded demo items (clearly marked is_demo: true).
 */
export async function getProductBySlugOrId(
  key: string
): Promise<FullProductWithDetails | null> {
  const norm = normalizeKey(key);

  // 1. Try Supabase first (Production data source)
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseAnonKey) {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*, artisan:profiles(*)")
        .or(`slug.eq.${key},id.eq.${key}`)
        .maybeSingle();

      if (!error && data) {
        return data as unknown as FullProductWithDetails;
      }
    }
  } catch {
    // Supabase unavailable or network offline — proceed to demo fallbacks
  }

  // 2. Check browser session storage (for newly published products during demo)
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("karigarai_saved_products");
      if (stored) {
        const localList: FullProductWithDetails[] = JSON.parse(stored);
        const match = localList.find(
          (p) => normalizeKey(p.slug) === norm || normalizeKey(p.id) === norm
        );
        if (match) return match;
      }
    } catch {
      // Ignore storage parse errors
    }
  }

  // 3. Fallback to clearly labeled demo benchmark items
  const demoMatch = BENCHMARK_DEMO_PRODUCTS.find(
    (p) => normalizeKey(p.slug) === norm || normalizeKey(p.id) === norm
  );
  if (demoMatch) {
    return demoMatch;
  }

  return null;
}

/**
 * Returns products for the artisan's catalog view.
 * Delineates live created items from pre-seeded demo products.
 */
export function getCatalogProducts(): FullProductWithDetails[] {
  let localProducts: FullProductWithDetails[] = [];
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("karigarai_saved_products");
      if (stored) {
        localProducts = JSON.parse(stored);
      }
    } catch {
      localProducts = [];
    }
  }

  const idMap = new Map<string, FullProductWithDetails>();
  localProducts.forEach((p) => idMap.set(p.id, p));
  BENCHMARK_DEMO_PRODUCTS.forEach((p) => {
    if (!idMap.has(p.id)) {
      idMap.set(p.id, p);
    }
  });

  return Array.from(idMap.values());
}

/**
 * Generates an inquiry WhatsApp link for a buyer to contact the artisan directly.
 * Does NOT hardcode contact info; reads directly from profile/artisan data.
 */
export function buildWhatsAppInquiryUrl(params: {
  phone?: string | null;
  productTitle: string;
  artisanName?: string | null;
  price: number;
  productUrl: string;
  lang: "hi" | "en";
}): string | null {
  if (!params.phone) {
    return null; // Signals to UI that contact number is not provided
  }

  const cleanPhone = params.phone.replace(/[^0-9]/g, "");
  if (!cleanPhone) {
    return null;
  }

  const artisanName = params.artisanName || (params.lang === "hi" ? "शिल्पकार" : "Artisan");

  let message = "";
  if (params.lang === "hi") {
    message = `नमस्ते ${artisanName} जी,\n\nमैंने कारीगरAI पर आपका उत्पाद देखा है:\n📌 *${params.productTitle}*\n💰 मूल्य: ₹${params.price.toLocaleString("en-IN")}\n🔗 लिंक: ${params.productUrl}\n\nक्या यह उत्पाद अभी उपलब्ध है? कृपया मुझे और जानकारी व डिलीवरी प्रक्रिया बताएं।\nधन्यवाद!`;
  } else {
    message = `Hello ${artisanName},\n\nI saw your handcrafted product on KarigarAI:\n📌 *${params.productTitle}*\n💰 Price: ₹${params.price.toLocaleString("en-IN")}\n🔗 Link: ${params.productUrl}\n\nIs this product currently available? Please share order and shipping details.\nThank you!`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates a broadcast WhatsApp link for an artisan to share their own public link.
 */
export function buildArtisanBroadcastUrl(params: {
  productTitle: string;
  price: number;
  productUrl: string;
  lang: "hi" | "en";
}): string {
  let message = "";
  if (params.lang === "hi") {
    message = `🙏 प्रणाम!\n\nमैंने कारीगरAI पर अपना हस्तनिर्मित उत्पाद जोड़ा है:\n✨ *${params.productTitle}*\n💰 शिल्पकार मूल्य: ₹${params.price.toLocaleString("en-IN")}\n\nकैटलॉग देखें और सीधे व्हाट्सएप पर ऑर्डर करें:\n👉 ${params.productUrl}\n\nकारीगरAI • वोकल फॉर लोकल`;
  } else {
    message = `🙏 Greetings!\n\nI have added my handcrafted product on KarigarAI:\n✨ *${params.productTitle}*\n💰 Direct Artisan Price: ₹${params.price.toLocaleString("en-IN")}\n\nView my catalog and order directly on WhatsApp:\n👉 ${params.productUrl}\n\nKarigarAI • Vocal for Local`;
  }

  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
