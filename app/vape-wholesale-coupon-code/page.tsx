import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { OfferTable } from "@/components/OfferTable";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { getOffersWithMerchants } from "@/lib/offers";

export const metadata: Metadata = {
  title: "Vape Wholesale Coupon Code",
  description:
    "Find vape wholesale coupon codes for US distributors. Verified and reported discounts from Vape Wholesale USA, The Vape Mall, Flawless Vape Shop, and more.",
  alternates: {
    canonical: "/vape-wholesale-coupon-code",
  },
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
        <ArrowLeft size={16} aria-hidden="true" />
        Back to main tracker
      </Link>
      <h1 className="mt-6 text-4xl font-bold text-ink">Vape Wholesale Coupon Code</h1>
      <p className="mt-4 max-w-2xl text-lg leading-7 text-ink/70">
        Coupon codes for vape wholesale distributors and retailers in the United States. We track codes from official
        sites, coupon partners, and community reports. Always verify at checkout before placing large orders.
      </p>
      <OfferTable offers={offers} />
      <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
        <p className="text-sm font-bold uppercase text-leaf">Merchant profiles</p>
        <h2 className="mt-2 text-2xl font-bold text-ink">Coupon pages with source confidence</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {[
            { href: "/stores/flawless-vape-shop", label: "Flawless Vape coupon code" },
            { href: "/stores/vapesourcing", label: "VapeSourcing coupon code" },
            { href: "/stores/discount-vape-pen", label: "Discount Vape Pen coupon code" },
            { href: "/stores/vape-wholesale-usa", label: "Vape Wholesale USA coupon code" }
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring inline-flex items-center gap-2 rounded-md border border-ink/15 bg-paper px-4 py-2.5 text-sm font-bold text-ink transition hover:border-leaf hover:text-leaf"
            >
              {link.label}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
      <SavingsCalculator />
    </main>
  );
}
