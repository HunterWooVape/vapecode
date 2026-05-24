import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink, MapPin, Phone, Truck, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/Badge";
import { getMerchantById, getOffersByMerchantId } from "@/lib/offers";

export const metadata: Metadata = {
  title: "Vape Wholesale USA Coupons and Deal History",
  description:
    "Vape Wholesale USA coupon status, reported discount codes, reward notes, free shipping policy ($3,000+), and verification history for wholesale buyers."
};

export default function StorePage() {
  const merchant = getMerchantById("vape-wholesale-usa");
  const offers = getOffersByMerchantId("vape-wholesale-usa");

  if (!merchant) return null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <Link
        href="/vape-wholesale-usa-discount-code"
        className="inline-flex items-center gap-2 text-sm font-bold text-leaf hover:text-ink"
      >
        <ArrowLeft size={16} />
        Back to main tracker
      </Link>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          <p className="text-sm font-bold uppercase text-leaf">Store profile</p>
          <h1 className="mt-2 text-5xl font-bold text-ink">{merchant.name} coupons and wholesale deal history</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-ink/70">
            {merchant.name} is a Las Vegas-based wholesale vape distributor carrying disposable vapes, e-liquids, kits,
            and accessories. This profile tracks official, reported, and expired offers connected to{" "}
            {merchant.domain}.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={merchant.homepageUrl}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex items-center gap-2 rounded-md bg-leaf px-4 py-3 text-sm font-bold text-white transition hover:bg-ink"
            >
              Visit merchant
              <ExternalLink size={16} aria-hidden="true" />
            </a>
            <a
              href="#offers"
              className="focus-ring inline-flex items-center gap-2 rounded-md border border-ink/15 bg-white px-4 py-3 text-sm font-bold text-ink transition hover:border-leaf hover:text-leaf"
            >
              View {offers.length} tracked offers
            </a>
          </div>
        </div>
        <aside className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
          <p className="font-bold text-ink">Merchant facts</p>
          <dl className="mt-4 grid gap-3 text-sm">
            <div>
              <dt className="font-semibold text-ink/55">Category</dt>
              <dd className="mt-1 text-ink">{merchant.category}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink/55">Location</dt>
              <dd className="mt-1 inline-flex items-center gap-1 text-ink">
                <MapPin size={14} className="text-ink/50" />
                {merchant.location}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink/55">Payment</dt>
              <dd className="mt-1 text-ink">Visa, MasterCard, Discover</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink/55">Wholesale</dt>
              <dd className="mt-1 inline-flex items-center gap-1 text-ink">
                <ShieldCheck size={14} className="text-leaf" />
                {merchant.supportsWholesale ? "Supported" : "Unknown"}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink/55">License requirement</dt>
              <dd className="mt-1 text-ink">{merchant.requiresLicense ? "Required" : "Not required for purchase"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink/55">Free shipping</dt>
              <dd className="mt-1 inline-flex items-center gap-1 text-ink">
                <Truck size={14} className="text-ink/50" />
                {merchant.freeShippingThreshold
                  ? `$${merchant.freeShippingThreshold.toLocaleString()}+ orders`
                  : "Contact for details"}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink/55">Phone</dt>
              <dd className="mt-1 inline-flex items-center gap-1 text-ink">
                <Phone size={14} className="text-ink/50" />
                +1 (800) 500-8486
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink/55">Brands carried</dt>
              <dd className="mt-1 flex flex-wrap gap-1">
                {merchant.brands.map((brand) => (
                  <span key={brand} className="rounded-md bg-ink/5 px-2 py-1 text-xs text-ink/70">
                    {brand}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </aside>
      </section>

      <section id="offers" className="mt-12">
        <h2 className="text-3xl font-bold text-ink">Tracked offers</h2>
        <div className="mt-5 grid gap-4">
          {offers.map((offer) => (
            <article key={offer.id} className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-xl font-bold text-ink">{offer.title}</h3>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-ink/65">{offer.description}</p>
                </div>
                <Badge confidence={offer.confidence} />
              </div>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-4">
                <div>
                  <p className="font-semibold text-ink/55">Code</p>
                  <p className="mt-1 font-bold text-ink">{offer.code ?? "No code"}</p>
                </div>
                <div>
                  <p className="font-semibold text-ink/55">Discount</p>
                  <p className="mt-1 text-ink">{offer.discountValue}</p>
                </div>
                <div>
                  <p className="font-semibold text-ink/55">Last checked</p>
                  <p className="mt-1 text-ink">{offer.lastCheckedAt}</p>
                </div>
                <div>
                  <p className="font-semibold text-ink/55">Source</p>
                  <a href={offer.sourceUrl} target="_blank" rel="noreferrer" className="mt-1 inline-flex text-leaf">
                    Open source
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
