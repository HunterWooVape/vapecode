import { describe, expect, it } from "vitest";
import {
  confidenceRank,
  getMerchantById,
  getOffersByMerchantId,
  getOffersWithMerchants,
  merchants,
  offers
} from "./offers";

describe("offers logic", () => {
  describe("confidenceRank", () => {
    it("should follow the business confidence priority", () => {
      expect(confidenceRank("verified")).toBe(0);
      expect(confidenceRank("official")).toBe(1);
      expect(confidenceRank("reported")).toBe(2);
      expect(confidenceRank("expired")).toBe(3);
    });
  });

  describe("getOffersWithMerchants", () => {
    it("should attach merchant data to every offer", () => {
      const result = getOffersWithMerchants();

      expect(result).toHaveLength(offers.length);
      expect(result.every((offer) => offer.merchant?.id === offer.merchantId)).toBe(true);
    });

    it("should sort offers by confidence priority", () => {
      const result = getOffersWithMerchants();
      const ranks = result.map((offer) => confidenceRank(offer.confidence));

      expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
    });
  });

  describe("merchant selectors", () => {
    it("should return a merchant by id", () => {
      const merchant = merchants[0];

      expect(getMerchantById(merchant.id)).toEqual(merchant);
    });

    it("should only return offers for the selected merchant", () => {
      const merchant = merchants[0];
      const result = getOffersByMerchantId(merchant.id);

      expect(result.length).toBeGreaterThan(0);
      expect(result.every((offer) => offer.merchantId === merchant.id)).toBe(true);
    });
  });
});
