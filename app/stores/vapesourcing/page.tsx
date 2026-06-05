import type { Metadata } from "next";
import { StoreProfilePage } from "@/app/stores/StoreProfilePage";

export const metadata: Metadata = {
  title: "VapeSourcing Coupon Code",
  description:
    "Track VapeSourcing coupon code signals, first-order newsletter discounts, free shipping over $95, referral offers, and source confidence for adult buyers.",
  alternates: {
    canonical: "/stores/vapesourcing",
  },
};

export default function VapeSourcingPage() {
  return (
    <StoreProfilePage
      merchantId="vapesourcing"
      headline="VapeSourcing coupon code and wholesale deal tracker"
      intro="VapeSourcing is tracked for first-order codes, free shipping thresholds, referral offers, and reported percentage-off coupon leads. Official program signals outrank third-party coupon reports."
    />
  );
}
