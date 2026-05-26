import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Truck } from "lucide-react";
import { OfferTable } from "@/components/OfferTable";
import { getOffersWithMerchants } from "@/lib/offers";

export const metadata: Metadata = {
  title: "Vape Wholesale Free Shipping Code",
  description:
    "Free shipping thresholds and codes for vape wholesalers. Vape Wholesale USA ($3,000+), Flawless Vape Shop ($100+), Geek Vape ($99+), The Vape Mall ($65+), and VapeSourcing ($95+).",
  alternates: {
    canonical: "/vape-wholesale-free-shipping-code",
  },
};

export default function Page() {
  const allOffers = getOffersWithMerchants();
  const offers = allOffers.filter(
    (o) =>
      o.offerType === "free_shipping" ||
      o.title.toLowerCase().includes("free shipping") ||
      o.title.toLowerCase().includes("shipping")
  );

  const merchantsWithFreeShip = allOffers
    .map((o) => o.merchant)
    .filter((m, i, arr) => m.freeShippingThreshold !== null && arr.findIndex((x) => x.id === m.id) === i)
    .sort((a, b) => (a.freeShippingThreshold ?? 99999) - (b.freeShippingThreshold ?? 99999));

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <Link
        href="/vape-wholesale-usa-discount-code"
        className="inline-flex items-center gap-2 text-sm font-bold text-leaf hover:text-ink"
      >
        <ArrowLeft size={16} />
        Back to main tracker
      </Link>
      <h1 className="mt-6 text-4xl font-bold text-ink">Vape Wholesale Free Shipping Code</h1>
      <p className="mt-4 max-w-2xl text-lg leading-7 text-ink/70">
        Free shipping thresholds and promotional codes for vape wholesale orders. Compare minimum order requirements
        across major distributors to find the best fit for your order size.
      </p>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {merchantsWithFreeShip.map((m) => (
          <div key={m.id} className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
            <div className="flex items-center gap-2 text-leaf">
              <Truck size={18} />
              <span className="text-sm font-bold uppercase">Free Shipping</span>
            </div>
            <p className="mt-2 text-xl font-bold text-ink">{m.name}</p>
            <p className="mt-1 text-3xl font-bold text-ink">${m.freeShippingThreshold?.toLocaleString()}+</p>
            <p className="mt-2 text-sm text-ink/60">{m.category}</p>
            <p className="mt-3 text-xs leading-5 text-ink/50">{m.notes}</p>
          </div>
        ))}
      </section>

      <div className="mt-12">
        <OfferTable offers={offers} />
      </div>
    </main>
  );
}
