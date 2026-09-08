/**
 * Buyer Purchase Likelihood & Pricing Conversion Engine
 * Predicts the probability of a buyer purchasing an artisan craft
 * based on user-entered selling price vs. production cost and fair market benchmarks.
 */

export interface BuyerLikelihoodResult {
  probabilityPercent: number;
  status: "loss-risk" | "high-demand" | "optimal" | "moderate" | "low";
  headlineEn: string;
  headlineHi: string;
  adviceEn: string;
  adviceHi: string;
  marginPercent: number;
}

export function calculateBuyerPurchaseLikelihood(params: {
  userPrice: number;
  baseCost: number;
  recommendedPrice: number;
  suggestedMinPrice: number;
  suggestedMaxPrice: number;
}): BuyerLikelihoodResult {
  const { userPrice, baseCost, recommendedPrice, suggestedMinPrice, suggestedMaxPrice } = params;

  if (userPrice <= 0 || baseCost <= 0) {
    return {
      probabilityPercent: 0,
      status: "low",
      headlineEn: "Invalid Price",
      headlineHi: "अमान्य मूल्य",
      adviceEn: "Please enter a realistic selling price above ₹0.",
      adviceHi: "कृपया ₹0 से अधिक का मान्य विक्रय मूल्य दर्ज करें।",
      marginPercent: 0,
    };
  }

  const marginPercent = Math.round(((userPrice - baseCost) / baseCost) * 100);

  // 1. Below production cost (Financial loss for artisan)
  if (userPrice < baseCost) {
    return {
      probabilityPercent: 96,
      status: "loss-risk",
      headlineEn: "96% Buy Chance (Severe Loss Risk!)",
      headlineHi: "96% खरीदारी संभावना (घाटे का बड़ा जोखिम!)",
      adviceEn: `Warning: This price is below your production cost (₹${baseCost}). While buyers will purchase quickly, you will lose money on each order.`,
      adviceHi: `चेतावनी: यह मूल्य आपकी उत्पादन लागत (₹${baseCost}) से कम है। खरीदार तेज़ी से खरीदेंगे, लेकिन आपको प्रति उत्पाद नुकसान होगा।`,
      marginPercent,
    };
  }

  // 2. Ultra-competitive / Quick liquidation (baseCost to minPrice)
  if (userPrice <= suggestedMinPrice) {
    // 88% to 94%
    const progress = (userPrice - baseCost) / Math.max(1, suggestedMinPrice - baseCost);
    const probabilityPercent = Math.round(94 - progress * 6);

    return {
      probabilityPercent,
      status: "high-demand",
      headlineEn: `${probabilityPercent}% Purchase Chance (High Demand / Fast Clearance)`,
      headlineHi: `${probabilityPercent}% खरीदारी संभावना (उच्च मांग / त्वरित बिक्री)`,
      adviceEn: `Buyers will find this price very affordable. Excellent for quick sales or bulk orders, though your profit margin is modest (+${marginPercent}%).`,
      adviceHi: `खरीदार इस मूल्य को बहुत किफायती मानेंगे। त्वरित बिक्री अथवा थोक ऑर्डर के लिए उत्तम, यद्यपि लाभ मार्जिन सीमित (+${marginPercent}%) रहेगा।`,
      marginPercent,
    };
  }

  // 3. Recommended Fair-Trade Sweet Spot (minPrice to recommendedPrice)
  if (userPrice <= recommendedPrice) {
    // 78% to 88%
    const progress =
      (userPrice - suggestedMinPrice) / Math.max(1, recommendedPrice - suggestedMinPrice);
    const probabilityPercent = Math.round(88 - progress * 10);

    return {
      probabilityPercent,
      status: "optimal",
      headlineEn: `${probabilityPercent}% Purchase Chance (Optimal Fair Market Balance)`,
      headlineHi: `${probabilityPercent}% खरीदारी संभावना (सर्वोत्तम संतुलित बाजार दर)`,
      adviceEn: `Sweet spot: Fair compensation for your artisan skill (+${marginPercent}% margin) with very high customer willingness to buy.`,
      adviceHi: `सर्वोत्तम संतुलन: आपकी कारीगरी का पूरा सम्मान (+${marginPercent}% लाभ) और खरीदारों द्वारा बिना झिझक तुरंत खरीदने की उच्च संभावना।`,
      marginPercent,
    };
  }

  // 4. Premium Quality Tier (recommendedPrice to maxPrice)
  if (userPrice <= suggestedMaxPrice) {
    // 60% to 78%
    const progress =
      (userPrice - recommendedPrice) / Math.max(1, suggestedMaxPrice - recommendedPrice);
    const probabilityPercent = Math.round(78 - progress * 18);

    return {
      probabilityPercent,
      status: "moderate",
      headlineEn: `${probabilityPercent}% Purchase Chance (Premium Quality Tier)`,
      headlineHi: `${probabilityPercent}% खरीदारी संभावना (प्रीमियम शिल्प स्तर)`,
      adviceEn: `Higher margin (+${marginPercent}%). Discerning buyers valuing heritage craftsmanship will readily pay this.`,
      adviceHi: `उत्कृष्ट लाभ (+${marginPercent}%)। पारंपरिक हस्तशिल्प और कला की कद्र करने वाले ग्राहक इस मूल्य पर खुशी से खरीदेंगे।`,
      marginPercent,
    };
  }

  // 5. Collector / Luxury / Niche Segment (above maxPrice up to 1.4x maxPrice)
  const highThreshold = suggestedMaxPrice * 1.4;
  if (userPrice <= highThreshold) {
    // 38% to 59%
    const progress = (userPrice - suggestedMaxPrice) / Math.max(1, highThreshold - suggestedMaxPrice);
    const probabilityPercent = Math.round(59 - progress * 21);

    return {
      probabilityPercent,
      status: "moderate",
      headlineEn: `${probabilityPercent}% Purchase Chance (Niche Collector Segment)`,
      headlineHi: `${probabilityPercent}% खरीदारी संभावना (विशिष्ट कला संग्राहक)`,
      adviceEn: `Premium luxury price (+${marginPercent}%). Sales may take longer. Highlight master craftsmanship and GI authenticity to justify this rate.`,
      adviceHi: `उच्च प्रीमियम दर (+${marginPercent}%)। बिक्री में कुछ समय लग सकता है। खरीदारों को आकर्षित करने के लिए शिल्प कहानी और प्रमाणिकता अवश्य बताएं।`,
      marginPercent,
    };
  }

  // 6. High Price Barrier (> 1.4x maxPrice)
  const excessiveDiff = userPrice - highThreshold;
  const probabilityPercent = Math.max(12, Math.round(36 - (excessiveDiff / suggestedMaxPrice) * 25));

  return {
    probabilityPercent,
    status: "low",
    headlineEn: `${probabilityPercent}% Purchase Chance (High Price Barrier)`,
    headlineHi: `${probabilityPercent}% खरीदारी संभावना (मूल्य बाधा / कम ग्राहक)`,
    adviceEn: `Buyers will frequently compare and hesitate. To boost sales velocity, consider adjusting closer to ₹${recommendedPrice}.`,
    adviceHi: `अधिकतर ग्राहक अन्य विकल्पों से तुलना कर सकते हैं। बिक्री की गति बढ़ाने हेतु मूल्य को ₹${recommendedPrice} के समीप रखने पर विचार करें।`,
    marginPercent,
  };
}
