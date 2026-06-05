import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ExternalLink, ShieldCheck, Truck } from "lucide-react";
import { Badge } from "@/components/Badge";
import { getOffersByMerchantId, merchants } from "@/lib/offers";

export const metadata: Metadata = {
  title: "Tracked Vape Coupon Stores",
  description:
    "Browse VapeKeys tracked vape wholesale coupon stores, offer counts, confidence status, free shipping thresholds, and source notes for adult US business buyers.",
  alternates: {
    canonical: "/stores",
  },
};

const liveStorePaths: Record<string, string> = {
  "vape-wholesale-usa": "/stores/vape-wholesale-usa",
  "flawless-vape-shop": "/stores/flawless-vape-shop",
  vapesourcing: "/stores/vapesourcing",
  "discount-vape-pen": "/stores/discount-vape-pen"
};

export default function StoresPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <section className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase text-leaf">Store index</p>
          <h1 className="mt-2 text-5xl font-bold tracking-normal text-ink">Tracked vape coupon stores</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-ink/70">
            VapeKeys follows wholesale and bulk-friendly vape merchants for public discount signals. Store profiles show
            source confidence, free shipping thresholds, and policy notes for adult US business buyers.
          </p>
        </div>
        <div className="rounded-lg border border-ink/10 bg-mint/30 p-5">
          <p className="font-bold text-ink">21+ informational directory</p>
          <p className="mt-2 text-sm leading-6 text-ink/70">
            We do not sell tobacco, nicotine, or vapor products. This directory is informational and not legal advice.
          </p>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        {merchants.map((merchant) => {
          const offers = getOffersByMerchantId(merchant.id);
          const official = offers.filter((offer) => offer.confidence === "official").length;
          const reported = offers.filter((offer) => offer.confidence === "reported").length;
          const primaryOffer = offers[0];
          const storePath = liveStorePaths[merchant.id];

          return (
            <article key={merchant.id} className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-ink">{merchant.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-ink/65">{merchant.notes}</p>
                </div>
                {primaryOffer ? <Badge confidence={primaryOffer.confidence} /> : null}
              </div>

              <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
                <div>
                  <p className="font-semibold text-ink/55">Tracked offers</p>
                  <p className="mt-1 text-xl font-bold text-ink">{offers.length}</p>
                </div>
                <div>
                  <p className="font-semibold text-ink/55">Official</p>
                  <p className="mt-1 text-xl font-bold text-ink">{official}</p>
                </div>
                <div>
                  <p className="font-semibold text-ink/55">Reported</p>
                  <p className="mt-1 text-xl font-bold text-ink">{reported}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-2 text-sm text-ink/70">
                <span className="inline-flex items-center gap-2">
                  <Truck size={16} className="text-leaf" aria-hidden="true" />
                  {merchant.freeShippingThreshold
                    ? `Free shipping threshold: $${merchant.freeShippingThreshold.toLocaleString()}+`
                    : "Free shipping threshold: check merchant source"}
                </span>
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck size={16} className="text-leaf" aria-hidden="true" />
                  {merchant.supportsWholesale ? "Wholesale or bulk buying signal tracked" : "Retailer; bulk terms vary"}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-leaf" aria-hidden="true" />
                  Confidence order remains verified, official, reported, expired
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {storePath ? (
                  <Link
                    href={storePath}
                    className="focus-ring inline-flex items-center gap-2 rounded-md bg-leaf px-4 py-2.5 text-sm font-bold text-white transition hover:bg-ink"
                  >
                    View profile
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                ) : (
                  <Link
                    href="/vape-wholesale-usa-discount-code"
                    className="focus-ring inline-flex items-center gap-2 rounded-md border border-ink/15 bg-white px-4 py-2.5 text-sm font-bold text-ink transition hover:border-leaf hover:text-leaf"
                  >
                    View in tracker
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                )}
                <a
                  href={merchant.homepageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring inline-flex items-center gap-2 rounded-md border border-ink/15 bg-white px-4 py-2.5 text-sm font-bold text-ink transition hover:border-leaf hover:text-leaf"
                >
                  Source
                  <ExternalLink size={15} aria-hidden="true" />
                </a>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
