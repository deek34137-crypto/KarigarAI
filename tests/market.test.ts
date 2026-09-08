import { describe, it } from "node:test";
import assert from "node:assert";
import QRCode from "qrcode";
import {
  BENCHMARK_DEMO_PRODUCTS,
  buildWhatsAppInquiryUrl,
  buildArtisanBroadcastUrl,
  getProductBySlugOrId,
} from "../lib/data/products.ts";

describe("Phase 7: Market Linkage & Public Listings Unit Tests", () => {
  it("should return null for WhatsApp inquiry URL when phone is missing or invalid", () => {
    const urlNoPhone = buildWhatsAppInquiryUrl({
      phone: null,
      productTitle: "Terracotta Pitcher",
      price: 850,
      productUrl: "https://karigarai.app/p/test",
      lang: "en",
    });
    assert.strictEqual(urlNoPhone, null, "Should return null when phone is null");

    const urlEmptyPhone = buildWhatsAppInquiryUrl({
      phone: "   ",
      productTitle: "Terracotta Pitcher",
      price: 850,
      productUrl: "https://karigarai.app/p/test",
      lang: "en",
    });
    assert.strictEqual(urlEmptyPhone, null, "Should return null when phone is whitespace");
  });

  it("should construct valid wa.me URL with clean international phone and bilingual text", () => {
    const hindiUrl = buildWhatsAppInquiryUrl({
      phone: "+91 98765-43210",
      productTitle: "हस्तनिर्मित सुराही",
      artisanName: "रामेश्वर",
      price: 850,
      productUrl: "https://karigarai.app/p/terracotta-pitcher",
      lang: "hi",
    });

    assert.ok(hindiUrl !== null);
    assert.ok(hindiUrl.startsWith("https://wa.me/919876543210?text="));
    const decoded = decodeURIComponent(hindiUrl.replace("https://wa.me/919876543210?text=", ""));
    assert.ok(decoded.includes("रामेश्वर"));
    assert.ok(decoded.includes("हस्तनिर्मित सुराही"));
    assert.ok(decoded.includes("850"));
    assert.ok(decoded.includes("https://karigarai.app/p/terracotta-pitcher"));

    const englishUrl = buildWhatsAppInquiryUrl({
      phone: "9812345678",
      productTitle: "Maheshwari Saree",
      artisanName: "Kamla Bai",
      price: 3400,
      productUrl: "https://karigarai.app/p/maheshwari-saree",
      lang: "en",
    });

    assert.ok(englishUrl !== null);
    assert.ok(englishUrl.startsWith("https://wa.me/9812345678?text="));
    const decodedEn = decodeURIComponent(englishUrl.replace("https://wa.me/9812345678?text=", ""));
    assert.ok(decodedEn.includes("Kamla Bai"));
    assert.ok(decodedEn.includes("Maheshwari Saree"));
    assert.ok(decodedEn.includes("3,400"));
  });

  it("should generate valid artisan broadcast URL with artisan name and no emoji characters", () => {
    const broadcastUrl = buildArtisanBroadcastUrl({
      productTitle: "टेराकोटा सुराही",
      artisanName: "रामेश्वर प्रजापति",
      price: 850,
      productUrl: "https://karigarai.app/p/gorakhpur-terracotta-pitcher",
      lang: "hi",
    });

    assert.ok(broadcastUrl.startsWith("https://wa.me/?text="));
    const decoded = decodeURIComponent(broadcastUrl.replace("https://wa.me/?text=", ""));
    assert.ok(decoded.includes("टेराकोटा सुराही"), "Should include product title");
    assert.ok(decoded.includes("850"), "Should include price");
    assert.ok(decoded.includes("https://karigarai.app/p/gorakhpur-terracotta-pitcher"), "Should include product URL");
    assert.ok(decoded.includes("रामेश्वर प्रजापति"), "Should include artisan name in sign-off");
    assert.ok(!decoded.includes("🙏"), "Should not include emojis (renders as garbage on some devices)");
    assert.ok(!decoded.includes("✨"), "Should not include emojis");
    assert.ok(!decoded.includes("💰"), "Should not include emojis");

    // English version
    const enBroadcastUrl = buildArtisanBroadcastUrl({
      productTitle: "Handmade Terracotta Flower Pots",
      artisanName: "Rameshwar Prajapati",
      price: 910,
      productUrl: "https://karigar-ai90.vercel.app/p/handmade-natural-terracotta-flower-pots",
      lang: "en",
    });

    const decodedEn = decodeURIComponent(enBroadcastUrl.replace("https://wa.me/?text=", ""));
    assert.ok(decodedEn.includes("Handmade Terracotta Flower Pots"), "Should include product title");
    assert.ok(decodedEn.includes("910"), "Should include price");
    assert.ok(decodedEn.includes("Rameshwar Prajapati"), "Should include artisan name");
    assert.ok(decodedEn.includes("KarigarAI"), "Should include brand");
  });

  it("should resolve benchmark demo products and flag them with is_demo: true", async () => {
    const product = await getProductBySlugOrId("gorakhpur-terracotta-pitcher");
    assert.ok(product !== null, "Should find terracotta pitcher");
    assert.strictEqual(product?.is_demo, true, "Must have is_demo set to true");
    assert.strictEqual(product?.base_cost, 380);
    assert.strictEqual(product?.suggested_price, 850);
    assert.ok(product?.artisan !== undefined);
  });

  it("should safely handle non-UUID slugs without throwing database syntax errors", async () => {
    const slug = "terracotta-pottery-1904";
    // Must not throw 22P02 or crash on non-UUID query
    const result = await getProductBySlugOrId(slug);
    // Even if offline/no db, it should return null or product without throwing
    assert.ok(result === null || typeof result === "object");
  });

  it("should generate a QR code data URL successfully for exhibition stalls", async () => {
    const publicUrl = "https://karigar-ai90.vercel.app/p/terracotta-pottery-1904";
    const dataUrl = await QRCode.toDataURL(publicUrl, {
      width: 320,
      margin: 2,
    });
    assert.ok(dataUrl.startsWith("data:image/png;base64,"));
  });

  it("should reject delete request when neither id nor slug is provided", async () => {
    const { deleteProductAction } = await import("../app/actions/delete-product.ts");
    const res = await deleteProductAction({});
    assert.strictEqual(res.success, false);
    assert.ok(res.error?.includes("required"));
  });
});

