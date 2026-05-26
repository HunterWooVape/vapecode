import { describe, it, expect } from "vitest";
import { parseCsv, analyzeSemrushCsv } from "./csv";

describe("csv logic", () => {
  describe("parseCsv", () => {
    it("should parse simple CSV rows", () => {
      const csv = "col1,col2\nval1,val2";
      const result = parseCsv(csv);
      expect(result).toEqual([
        ["col1", "col2"],
        ["val1", "val2"]
      ]);
    });

    it("should handle quoted values with commas", () => {
      const csv = 'col1,"col2, with comma"\nval1,val2';
      const result = parseCsv(csv);
      expect(result).toEqual([
        ["col1", "col2, with comma"],
        ["val1", "val2"]
      ]);
    });

    it("should handle double quotes inside quoted values", () => {
      const csv = 'col1,"col2 with ""double quotes"""\nval1,val2';
      const result = parseCsv(csv);
      expect(result).toEqual([
        ["col1", 'col2 with "double quotes"'],
        ["val1", "val2"]
      ]);
    });
  });

  describe("analyzeSemrushCsv", () => {
    it("should identify coupon pages and score them", () => {
      const csv = [
        "Source URL,Title,Anchor,Target URL",
        "https://example.com/promo,Get 20% Discount,Buy Now,https://vapekeys.com",
        "https://other.com/page,Just a page,Click,https://vapekeys.com"
      ].join("\n");

      const result = analyzeSemrushCsv(csv);

      expect(result.length).toBe(1);
      expect(result[0].sourceUrl).toBe("https://example.com/promo");
      expect(result[0].sourceDomain).toBe("example.com");
      expect(result[0].score).toBeGreaterThan(0);
      expect(result[0].status).toBe("needs_review");
      expect(result[0].detectedCodes).toBeDefined();
    });

    it("should detect potential codes from text", () => {
      const csv = [
        "Source URL,Title,Anchor,Target URL",
        "https://site.com,Use code SAVE20 for deal,SAVE20,https://vapekeys.com"
      ].join("\n");

      const result = analyzeSemrushCsv(csv);
      expect(result[0].detectedCodes).toContain("SAVE20");
    });

    it("should return an empty array when the CSV has no data rows", () => {
      const csv = "Source URL,Title,Anchor,Target URL";

      expect(analyzeSemrushCsv(csv)).toEqual([]);
    });
  });
});
