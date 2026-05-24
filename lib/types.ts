export type OfferConfidence = "verified" | "official" | "reported" | "expired";

export type OfferType =
  | "coupon_code"
  | "automatic_discount"
  | "free_shipping"
  | "reward"
  | "sale"
  | "bogo"
  | "clearance";

export type Merchant = {
  id: string;
  name: string;
  domain: string;
  homepageUrl: string;
  category: string;
  country: string;
  supportsWholesale: boolean;
  requiresLicense: boolean;
  ageGatePresent: boolean;
  notes: string;
  /** Free shipping threshold in USD, null if unknown */
  freeShippingThreshold: number | null;
  /** Minimum order for wholesale, null if unknown */
  minOrderValue: number | null;
  /** Headquarter location */
  location: string | null;
  /** Known brands carried */
  brands: string[];
};

export type Offer = {
  id: string;
  merchantId: string;
  offerType: OfferType;
  code: string | null;
  title: string;
  description: string;
  discountValue: string;
  minimumOrderValue: number | null;
  applicableProducts: string;
  sourceUrl: string;
  sourceType: "official" | "semrush_backlink" | "coupon_site" | "newsletter" | "community";
  confidence: OfferConfidence;
  lastCheckedAt: string;
  expiresAt: string | null;
  requiresAccount: boolean;
  requiresLicense: boolean;
  stackable: boolean | null;
  stateRestrictions: string | null;
  internalNotes?: string;
  /** Number of sources confirming this offer (for reported codes) */
  sourceCount?: number;
};

export type OfferWithMerchant = Offer & {
  merchant: Merchant;
};

export type FaqItem = {
  question: string;
  answer: string;
};
