import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { OfferTable } from "@/components/OfferTable";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { getOffersWithMerchants } from "@/lib/offers";

export const metadata: Metadata = {
  title: "Vape Wholesale Coupon Code",
  description:
    "Find vape wholesale coupon codes for US distributors. Verified and reported discounts from Vape Wholesale USA, The Vape Mall, Flawless Vape Shop, and more."
};

export default function Page() {
  const allOffers = getOffersWithMerchants();
  const offers = allOffers.filter(
    (o) =>
      o.offerType === "coupon_code" ||
      o.merchantId === "vape-wholesale-usa" ||
      o.merchantId === "the-vape-mall" ||
      o.merchantId === "flawless-vape-shop"
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
      <h1 className="mt-6 text-4xl font-bold text-ink">Vape Wholesale Coupon Code</h1>
      <p className="mt-4 max-w-2xl text-lg leading-7 text-ink/70">
        Coupon codes for vape wholesale distributors and retailers in the United States. We track codes from official
        sites, coupon partners, and community reports. Always verify at checkout before placing large orders.
      </p>
      <OfferTable offers={offers} />
      <SavingsCalculator />
    </main>
  );
}
