import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { OfferTable } from "@/components/OfferTable";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { getOffersWithMerchants } from "@/lib/offers";

export const metadata: Metadata = {
  title: "Wholesale Vape Supplies Coupon",
  description:
    "Coupons for wholesale vape supplies including coils, pods, batteries, chargers, and accessories. Deals from Vape Wholesale USA, Flawless Vape Shop, and West Coast Vape Supply."
};

export default function Page() {
  const allOffers = getOffersWithMerchants();
  const offers = allOffers.filter(
    (o) =>
      o.merchantId === "vape-wholesale-usa" ||
      o.merchantId === "flawless-vape-shop" ||
      o.merchantId === "west-coast-vape-supply" ||
      o.applicableProducts.toLowerCase().includes("coil") ||
      o.applicableProducts.toLowerCase().includes("accessory")
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <Link
        href="/vape-wholesale-usa-discount-code"
        className="inline-flex items-center gap-2 text-sm font-bold text-leaf hover:text-ink"
      >
        <ArrowLeft size={16} />
        Back to main tracker
      </Link>
      <h1 className="mt-6 text-4xl font-bold text-ink">Wholesale Vape Supplies Coupon</h1>
      <p className="mt-4 max-w-2xl text-lg leading-7 text-ink/70">
        Discounts on vape supplies and accessories for retailers. Replacement coils starting from $4.80, batteries from
        $4.25, and vape juice from $6 at Vape Wholesale USA. Flawless Vape Shop clearance goes up to 80% off
        discontinued hardware.
      </p>
      <OfferTable offers={offers} />
      <SavingsCalculator />
    </main>
  );
}
