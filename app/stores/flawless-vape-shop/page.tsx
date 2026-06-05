import type { Metadata } from "next";
import { StoreProfilePage } from "@/app/stores/StoreProfilePage";

export const metadata: Metadata = {
  title: "Flawless Vape Coupon Code",
  description:
    "Track Flawless Vape coupon code signals, newsletter discounts, free shipping over $100, rewards, and clearance notes for adult US business buyers.",
  alternates: {
    canonical: "/stores/flawless-vape-shop",
  },
};

export default function FlawlessVapeShopPage() {
  return (
    <StoreProfilePage
      merchantId="flawless-vape-shop"
      headline="Flawless Vape coupon code and wholesale deal tracker"
      intro="Flawless Vape Shop is tracked for coupon-code leads, newsletter offers, loyalty rewards, clearance deals, and free shipping policy signals. Reported coupon codes remain leads until they are verified at checkout."
    />
  );
}
