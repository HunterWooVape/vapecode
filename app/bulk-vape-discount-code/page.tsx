import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { OfferTable } from "@/components/OfferTable";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { getOffersWithMerchants } from "@/lib/offers";

export const metadata: Metadata = {
  title: "Bulk Vape Discount Code",
  description:
    "Bulk vape discount codes and volume pricing for retailers. Automatic multi-unit discounts, wholesale tiers, and loyalty rewards from Geek Vape, VapeSourcing, and Vape Wholesale USA."
};

export default function Page() {
  const allOffers = getOffersWithMerchants();
  const offers = allOffers.filter(
    (o) =>
      o.offerType === "automatic_discount" ||
      o.offerType === "bogo" ||
      o.title.toLowerCase().includes("bulk") ||
      o.title.toLowerCase().includes("multiple") ||
      o.merchantId === "geek-vape" ||
      o.merchantId === "vapesourcing"
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
      <h1 className="mt-6 text-4xl font-bold text-ink">Bulk Vape Discount Code</h1>
      <p className="mt-4 max-w-2xl text-lg leading-7 text-ink/70">
        Volume discounts and bulk pricing for vape retailers stocking multiple units. Geek Vape offers 10% off when
        buying multiples of the same SKU. VapeSourcing has tiered discounts starting at $129+. Use the calculator to
        compare real savings after shipping.
      </p>
      <OfferTable offers={offers} />
      <SavingsCalculator />
    </main>
  );
}
