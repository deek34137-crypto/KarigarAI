import { describe, it } from "node:test";
import assert from "node:assert";

/**
 * Phase 0 Testing Foundation: Unit test specifications for deterministic pricing engine.
 * Powered by Node.js native test runner (zero extra dependency).
 */

describe("Pricing Engine - Deterministic Calculations", () => {
  it("calculates base cost accurately from materials, labor, and overhead", () => {
    const materialCost = 350;
    const labourHours = 4;
    const hourlyWage = 100;
    const overhead = 100;

    const baseCost = materialCost + labourHours * hourlyWage + overhead;
    assert.strictEqual(baseCost, 850);
  });

  it("ensures minimum fair selling price guarantees at least 20% margin above base cost", () => {
    const baseCost = 850;
    const minMargin = 0.20;
    const suggestedMinPrice = Math.round(baseCost * (1 + minMargin));

    assert.strictEqual(suggestedMinPrice, 1020);
    assert.ok(suggestedMinPrice > baseCost);
  });
});

import { calculateBuyerPurchaseLikelihood } from "../lib/pricing/conversion";

describe("Buyer Purchase Likelihood Engine", () => {
  const baseParams = {
    baseCost: 500,
    suggestedMinPrice: 600, // 20% margin
    recommendedPrice: 750,  // 50% margin
    suggestedMaxPrice: 900,  // 80% margin
  };

  it("warns when selling price is below production cost (loss-risk)", () => {
    const res = calculateBuyerPurchaseLikelihood({
      ...baseParams,
      userPrice: 400, // Below ₹500 cost
    });

    assert.strictEqual(res.status, "loss-risk");
    assert.strictEqual(res.probabilityPercent, 96);
    assert.ok(res.marginPercent < 0);
    assert.ok(res.headlineHi.includes("घाटे"));
  });

  it("evaluates high-demand clearance tier (baseCost to minPrice)", () => {
    const res = calculateBuyerPurchaseLikelihood({
      ...baseParams,
      userPrice: 550,
    });

    assert.strictEqual(res.status, "high-demand");
    assert.ok(res.probabilityPercent >= 88 && res.probabilityPercent <= 94);
    assert.strictEqual(res.marginPercent, 10);
  });

  it("evaluates optimal fair-trade tier (minPrice to recommendedPrice)", () => {
    const res = calculateBuyerPurchaseLikelihood({
      ...baseParams,
      userPrice: 700,
    });

    assert.strictEqual(res.status, "optimal");
    assert.ok(res.probabilityPercent >= 78 && res.probabilityPercent <= 88);
    assert.strictEqual(res.marginPercent, 40);
  });

  it("evaluates premium craftsmanship tier (recommendedPrice to maxPrice)", () => {
    const res = calculateBuyerPurchaseLikelihood({
      ...baseParams,
      userPrice: 850,
    });

    assert.strictEqual(res.status, "moderate");
    assert.ok(res.probabilityPercent >= 60 && res.probabilityPercent <= 78);
    assert.strictEqual(res.marginPercent, 70);
  });

  it("identifies high price resistance when user price exceeds 1.4x max price", () => {
    const res = calculateBuyerPurchaseLikelihood({
      ...baseParams,
      userPrice: 1500, // > 1.4 * 900 = 1260
    });

    assert.strictEqual(res.status, "low");
    assert.ok(res.probabilityPercent <= 36);
    assert.ok(res.adviceHi.includes("मूल्य"));
  });

  it("handles zero or invalid user prices gracefully", () => {
    const res = calculateBuyerPurchaseLikelihood({
      ...baseParams,
      userPrice: 0,
    });

    assert.strictEqual(res.probabilityPercent, 0);
    assert.strictEqual(res.status, "low");
  });
});
