import type { Metadata } from "next";
import { StoreProfilePage } from "@/app/stores/StoreProfilePage";

export const metadata: Metadata = {
  title: "Vape Wholesale USA Coupons, Reviews, and Deal History",
  description:
    "Vape Wholesale USA coupon status, reported discount codes, reward notes, free shipping policy, reviews and legitimacy signals for adult wholesale buyers.",
  alternates: {
    canonical: "/stores/vape-wholesale-usa",
  },
};

export default function StorePage() {
  return (
    <StoreProfilePage
      merchantId="vape-wholesale-usa"
      headline="Vape Wholesale USA coupons, reviews, and deal history"
      intro="Vape Wholesale USA is tracked for reported coupon-code leads, official reward and clearance signals, and free shipping policy notes. This profile keeps reviews and legitimacy questions factual by separating source signals from checkout verification."
      trustSection={{
        title: "Is Vape Wholesale USA legit? Read the public signals carefully",
        body:
          "VapeKeys does not certify merchants or provide legal advice. For this profile, we separate neutral public signals from discount confidence: merchant pages, reward and clearance pages, third-party coupon reports, and buyer discussion sources can all help buyers decide what to verify before ordering.",
        points: [
          "Official merchant pages are stronger evidence than coupon-site snippets.",
          "Reported codes remain leads until checkout validation confirms the terms.",
          "Buyers should check age, license, state, shipping, and return rules directly with the seller."
        ]
      }}
    />
  );
}
