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
      "Traditional clay water pitcher shaped on a potter's wheel using locally available clay. Features hand-etched patterns and naturally cooling earthenware properties.",
    description_hi:
      "स्थानीय मिट्टी से चाक पर तैयार की गई पारंपरिक टेराकोटा सुराही। पानी को शीतल रखने वाली एवं हाथ की बारीक नक्काशीदार कलाकृति।",
    category: "Pottery & Claycraft",
    craft_type: "Terracotta Pottery",
    material: "Locally Sourced Clay",
    visual_attributes: {
      color: "Natural Terracotta Red",
      texture: "Smooth clay finish with fine hand-incised motifs",
      dimensions: "Height: 28cm, Diameter: 18cm, Capacity: 2.2L",
      estimated_weight: "1.4 kg",
    },
    original_image_url:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
    processed_image_url:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
    base_cost: 380,
    price_min: 650,
    price_max: 950,
    suggested_price: 850,
    pricing_reasoning_en:
      "Base cost comprises ₹110 for refined clay and firing fuel, 4.5 hours of skilled wheel-throwing and hand-etching at ₹55/hr (₹247), plus overheads. Suggested price of ₹850 yields a fair 123% margin recognizing skilled artisanal effort.",
    pricing_reasoning_hi:
      "मूल लागत ₹380 है जिसमें ₹110 मिट्टी व भट्टी की लागत तथा 4.5 घंटे का कुशल पारिश्रमिक शामिल है। ₹850 का विक्रय मूल्य शिल्पकार को उचित आय प्रदान करता है।",
    status: "published",
    created_at: "2026-03-01T10:00:00.000Z",
    updated_at: "2026-03-01T10:00:00.000Z",
    artisan: DEMO_ARTISAN_TERRACOTTA,
    is_demo: true,
    craft_story: {
      artisan_story_raw: "यह सुराही हमारे गांव में उपलब्ध स्थानीय मिट्टी से बनाई जाती है। हमारे परिवार में यह हुनर दादाजी से पिताजी और फिर मुझे मिला। हम चाक पर हाथ से मिट्टी को आकार देकर लकड़ी की भट्टी में पकाते हैं।",
      story_hi: "शिल्पकार के शब्दों में: यह हुनर हमारे परिवार में तीन पीढ़ियों से चला आ रहा है। स्थानीय मिट्टी को चाक पर हाथ से आकार देकर लकड़ी की पारंपरिक भट्टी में पकाया जाता है।",
      story_en: "In the artisan's words: This craft has been practiced across three generations in their family. Handcrafted on a potter's wheel using local clay and fired in traditional wood kilns.",
      traditional_process: [
        "स्थानीय मिट्टी की छनाई व तैयारी (Clay refining & preparation)",
        "चाक पर हाथ से सुराही को आकार देना (Manual wheel-throwing & shaping)",
        "पारंपरिक लकड़ी की भट्टी में पकाना (Traditional wood-fired kiln baking)",
      ],
      generational_lineage: "तीन पीढ़ियों से सीखा गया पारिवारिक हुनर (Learned across 3 family generations)",
      story_source: "demo_data",
    },
  },
  {
    id: "demo-prod-maheshwari-saree",
    artisan_id: DEMO_ARTISAN_WEAVER.id,
    slug: "maheshwari-handloom-silk-saree",
    title_en: "Handwoven Maheshwari Silk-Cotton Saree",
    title_hi: "पारंपरिक महेश्वरी हथकरघा सिल्क-कॉटन साड़ी",
    description_en:
      "Handwoven saree from Maheshwar featuring traditional reversible zari border. Woven on traditional wooden looms using silk warp and fine cotton weft.",
    description_hi:
      "महेश्वर की पारंपरिक ज़री बॉर्डर वाली शुद्ध रेशम एवं सूती हथकरघा साड़ी। पारंपरिक लकड़ी के करघे पर हाथ से बुनी गई।",
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
    craft_story: {
      artisan_story_raw: "मैं पिछले 20 वर्षों से महेश्वर में पारंपरिक हथकरघे पर साड़ियां बुन रही हूं। यह काम मुझे मेरे परिवार के वरिष्ठ बुनकरों ने सिखाया। हम लकड़ी के करघे पर रेशमी व सूती धागों से पारंपरिक किनारी तैयार करते हैं।",
      story_hi: "शिल्पकार के शब्दों में: दो दशकों से परिवार के पारंपरिक ज्ञान के साथ हथकरघा बुनाई की जा रही है। लकड़ी के करघे पर रेशमी व सूती धागों से हाथ से बारीक किनारी बुनी जाती है।",
      story_en: "In the artisan's words: Practiced for two decades following family handloom traditions. Handwoven on traditional wooden looms combining fine silk and cotton yarns.",
      traditional_process: [
        "ताना और बाना सूत तैयार करना (Warp & weft yarn preparation)",
        "पारंपरिक लकड़ी के करघे पर हाथ से बुनाई (Handweaving on traditional pit loom)",
        "हाथ से पारंपरिक किनारी संयोजन (Manual border motif interlacing)",
      ],
      generational_lineage: "पारंपरिक बुनकर परिवार की पुश्तैनी सीख (Passed down through family weaver lineage)",
      story_source: "demo_data",
    },
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
      let client: any;
      if (typeof window === "undefined") {
        const { createAdminClient } = await import("@/lib/supabase/admin");
        client = createAdminClient();
      } else {
        const { createClient } = await import("@/lib/supabase/client");
        client = createClient();
      }

      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(key);

      let query = client
        .from("products")
        .select("*, artisan:profiles(*), craft_stories(*), product_tags(*)");

      if (isUuid) {
        query = query.or(`slug.eq.${key},id.eq.${key}`);
      } else {
        query = query.eq("slug", key);
      }

      const { data, error } = await query.maybeSingle();

      if (!error && data) {
        const raw = data as any;
        const rawStory = Array.isArray(raw.craft_stories)
          ? raw.craft_stories[0] || null
          : raw.craft_stories || null;

        let formattedStory = null;
        if (rawStory) {
          formattedStory = {
            id: rawStory.id,
            product_id: rawStory.product_id,
            artisan_story_raw: rawStory.artisan_story_raw || "",
            story_en: rawStory.story_en || "",
            story_hi: rawStory.story_hi || "",
            traditional_process: rawStory.traditional_process
              ? (typeof rawStory.traditional_process === "string"
                  ? rawStory.traditional_process.split("\n").filter(Boolean)
                  : rawStory.traditional_process)
              : null,
            generational_lineage: rawStory.generational_lineage || null,
            story_source: "artisan_provided" as const,
            created_at: rawStory.created_at,
          };
        }

        return {
          ...raw,
          craft_story: formattedStory,
          tags: raw.product_tags || [],
        } as FullProductWithDetails;
      }
    }
  } catch (err) {
    // Supabase unavailable or network offline — proceed to demo fallbacks
    console.warn("Supabase query fallback:", err);
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
  let hiddenDemos: string[] = [];

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("karigarai_saved_products");
      if (stored) {
        localProducts = JSON.parse(stored);
      }
    } catch {
      localProducts = [];
    }

    try {
      const hidden = localStorage.getItem("karigarai_hidden_demos");
      if (hidden) {
        hiddenDemos = JSON.parse(hidden);
      }
    } catch {
      hiddenDemos = [];
    }
  }

  const idMap = new Map<string, FullProductWithDetails>();
  localProducts.forEach((p) => idMap.set(p.id, p));
  BENCHMARK_DEMO_PRODUCTS.forEach((p) => {
    if (!idMap.has(p.id) && !hiddenDemos.includes(p.id)) {
      idMap.set(p.id, p);
    }
  });

  return Array.from(idMap.values());
}

/**
 * Asynchronously fetches catalog products combining Supabase cloud items,
 * local storage drafts, and benchmark demo products.
 */
export async function fetchCatalogProducts(): Promise<FullProductWithDetails[]> {
  const localItems = getCatalogProducts();
  const idMap = new Map<string, FullProductWithDetails>();
  
  // Seed with benchmark & local items
  localItems.forEach((p) => idMap.set(p.id, p));

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseAnonKey) {
      let client: any;
      if (typeof window === "undefined") {
        const { createAdminClient } = await import("@/lib/supabase/admin");
        client = createAdminClient();
      } else {
        const { createClient } = await import("@/lib/supabase/client");
        client = createClient();
      }

      const { data, error } = await client
        .from("products")
        .select("*, artisan:profiles(*), craft_stories(*), product_tags(*)")
        .order("created_at", { ascending: false });

      if (!error && data) {
        data.forEach((raw: any) => {
          const rawStory = Array.isArray(raw.craft_stories)
            ? raw.craft_stories[0] || null
            : raw.craft_stories || null;

          const item: FullProductWithDetails = {
            ...raw,
            craft_story: rawStory
              ? {
                  id: rawStory.id,
                  product_id: rawStory.product_id,
                  artisan_story_raw: rawStory.artisan_story_raw || "",
                  story_en: rawStory.story_en || "",
                  story_hi: rawStory.story_hi || "",
                  traditional_process: rawStory.traditional_process
                    ? (typeof rawStory.traditional_process === "string"
                        ? rawStory.traditional_process.split("\n").filter(Boolean)
                        : rawStory.traditional_process)
                    : null,
                  generational_lineage: rawStory.generational_lineage || null,
                  story_source: "artisan_provided" as const,
                  created_at: rawStory.created_at,
                }
              : null,
            tags: raw.product_tags || [],
          };
          idMap.set(item.id, item);
        });
      }
    }
  } catch (err) {
    console.warn("fetchCatalogProducts fallback:", err);
  }

  return Array.from(idMap.values());
}

/**
 * Fetches all PUBLISHED products for the public buyer marketplace.
 * Combines Supabase cloud products + demo benchmark products.
 * Returns only status=published items, sorted newest first.
 */
export async function fetchMarketplaceProducts(): Promise<FullProductWithDetails[]> {
  const idMap = new Map<string, FullProductWithDetails>();

  // Seed with published benchmark demo products
  BENCHMARK_DEMO_PRODUCTS.filter((p) => p.status === "published").forEach((p) =>
    idMap.set(p.id, p)
  );

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseAnonKey) {
      let client: any;
      if (typeof window === "undefined") {
        const { createAdminClient } = await import("@/lib/supabase/admin");
        client = createAdminClient();
      } else {
        const { createClient } = await import("@/lib/supabase/client");
        client = createClient();
      }

      const { data, error } = await client
        .from("products")
        .select("*, artisan:profiles(*), craft_stories(*), product_tags(*)")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(20);

      if (!error && data) {
        data.forEach((raw: any) => {
          const rawStory = Array.isArray(raw.craft_stories)
            ? raw.craft_stories[0] || null
            : raw.craft_stories || null;

          const item: FullProductWithDetails = {
            ...raw,
            craft_story: rawStory
              ? {
                  id: rawStory.id,
                  product_id: rawStory.product_id,
                  artisan_story_raw: rawStory.artisan_story_raw || "",
                  story_en: rawStory.story_en || "",
                  story_hi: rawStory.story_hi || "",
                  traditional_process: rawStory.traditional_process
                    ? typeof rawStory.traditional_process === "string"
                      ? rawStory.traditional_process.split("\n").filter(Boolean)
                      : rawStory.traditional_process
                    : null,
                  generational_lineage: rawStory.generational_lineage || null,
                  story_source: "artisan_provided" as const,
                  created_at: rawStory.created_at,
                }
              : null,
            tags: raw.product_tags || [],
          };
          idMap.set(item.id, item);
        });
      }
    }
  } catch (err) {
    console.warn("fetchMarketplaceProducts fallback:", err);
  }

  return Array.from(idMap.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
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
    message = `नमस्ते ${artisanName} जी,\n\nमैंने KarigarAI पर आपका उत्पाद देखा है:\n*${params.productTitle}*\nमूल्य: Rs. ${params.price.toLocaleString("en-IN")}\nलिंक: ${params.productUrl}\n\nक्या यह उत्पाद अभी उपलब्ध है? कृपया ऑर्डर और डिलीवरी की जानकारी दें।\nधन्यवाद!`;
  } else {
    message = `Hello ${artisanName},\n\nI found your handcrafted product on KarigarAI:\n*${params.productTitle}*\nPrice: Rs. ${params.price.toLocaleString("en-IN")}\nLink: ${params.productUrl}\n\nIs this product currently available? Please share order and delivery details.\nThank you!`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates a broadcast WhatsApp link for an artisan to share their own public link.
 * No emojis — renders correctly on all Android/iOS WhatsApp versions.
 */
export function buildArtisanBroadcastUrl(params: {
  productTitle: string;
  artisanName?: string | null;
  price: number;
  productUrl: string;
  lang: "hi" | "en";
}): string {
  const artisanName = params.artisanName || (params.lang === "hi" ? "शिल्पकार" : "Artisan");

  let message = "";
  if (params.lang === "hi") {
    message = `नमस्ते!\n\nमैंने KarigarAI पर अपना हस्तनिर्मित उत्पाद साझा किया है:\n\n*${params.productTitle}*\nमूल्य: Rs. ${params.price.toLocaleString("en-IN")}\n\nतस्वीरें और पूरी जानकारी यहाँ देखें:\n${params.productUrl}\n\nअगर पसंद आए तो खरीदारी या उपलब्धता के लिए मुझसे WhatsApp पर संपर्क करें।\n\nधन्यवाद\n-- ${artisanName}\nKarigarAI * Vocal for Local`;
  } else {
    message = `Hello!\n\nI'm sharing my handcrafted product on KarigarAI:\n\n*${params.productTitle}*\nPrice: Rs. ${params.price.toLocaleString("en-IN")}\n\nView photos and details here:\n${params.productUrl}\n\nInterested? Message me on WhatsApp for availability and purchase details.\n\nThank you\n-- ${artisanName}\nKarigarAI * Vocal for Local`;
  }

  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
