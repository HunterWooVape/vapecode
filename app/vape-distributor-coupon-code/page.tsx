import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { OfferTable } from "@/components/OfferTable";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { getOffersWithMerchants } from "@/lib/offers";

export const metadata: Metadata = {
  title: "Vape Distributor Coupon Code",
  description:
    "Coupon codes and wholesale accounts for vape distributors. VapeRanger wholesale licensing, Geek Vape VIP program, and distributor pricing from Vape Wholesale USA and VapeSourcing.",
  alternates: {
    canonical: "/vape-distributor-coupon-code",
  },
};

export default function Page() {
  const allOffers = getOffersWithMerchants();
  const offers = allOffers.filter(
    (o) =>
      o.merchant.category.toLowerCase().includes("distributor") ||
      o.requiresLicense ||
      o.merchantId === "vaperanger" ||
      o.merchantId === "vape-wholesale-usa"
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
      <h1 className="mt-6 text-4xl font-bold text-ink">Vape Distributor Coupon Code</h1>
      <p className="mt-4 max-w-2xl text-lg leading-7 text-ink/70">
        True distributor pricing and wholesale accounts for licensed retailers. VapeRanger requires a tobacco license and
        approved business account. Geek Vape VIP unlocks extra discounts on $500+ orders. Compare distributor programs
        before committing to a supplier.
      </p>
      <OfferTable offers={offers} />
      <SavingsCalculator />
    </main>
  );
}
