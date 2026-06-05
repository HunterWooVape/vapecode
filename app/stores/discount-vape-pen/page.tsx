import type { Metadata } from "next";
import { StoreProfilePage } from "@/app/stores/StoreProfilePage";

export const metadata: Metadata = {
  title: "Discount Vape Pen Coupon Code",
  description:
    "Track Discount Vape Pen coupon code signals, reported sitewide discounts, source confidence, and buyer notes for adult US shoppers and bulk buyers.",
  alternates: {
    canonical: "/stores/discount-vape-pen",
  },
};

export default function DiscountVapePenPage() {
  return (
    <StoreProfilePage
      merchantId="discount-vape-pen"
      headline="Discount Vape Pen coupon code tracker"
      intro="Discount Vape Pen is tracked as a coupon-code lead source with retail-first positioning. Bulk buyers should verify current terms, state restrictions, and shipping rules directly with the merchant before ordering."
    />
  );
}
