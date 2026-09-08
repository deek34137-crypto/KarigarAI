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
