import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Gift,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Truck
} from "lucide-react";
import { Badge } from "@/components/Badge";
import { getMerchantById, getOffersByMerchantId } from "@/lib/offers";
import type { OfferType, OfferWithMerchant } from "@/lib/types";

const offerTypeLabels: Record<OfferType, string> = {
  coupon_code: "Coupon code",
  automatic_discount: "Automatic discount",
  free_shipping: "Free shipping",
  reward: "Reward program",
  sale: "Sale",
  bogo: "BOGO",
  clearance: "Clearance"
};

const storeKeywords: Record<string, string> = {
  "vape-wholesale-usa": "Vape Wholesale USA discount code",
  "flawless-vape-shop": "Flawless Vape coupon code",
  vapesourcing: "VapeSourcing coupon code",
  "discount-vape-pen": "Discount Vape Pen coupon code"
};

type StoreProfilePageProps = {
  merchantId: string;
  headline: string;
  intro: string;
  trustSection?: {
    title: string;
    body: string;
    points: string[];
  };
};

function SourceSummary({ offers }: { offers: OfferWithMerchant[] }) {
  const officialCount = offers.filter((offer) => offer.confidence === "official").length;
  const reportedCount = offers.filter((offer) => offer.confidence === "reported").length;
  const verifiedCount = offers.filter((offer) => offer.confidence === "verified").length;

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
        <p className="text-2xl font-bold text-ink">{officialCount}</p>
        <p className="mt-1 text-xs font-semibold uppercase text-ink/55">Official signals</p>
      </div>
      <div className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
        <p className="text-2xl font-bold text-ink">{reportedCount}</p>
        <p className="mt-1 text-xs font-semibold uppercase text-ink/55">Reported leads</p>
      </div>
      <div className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
        <p className="text-2xl font-bold text-ink">{verifiedCount}</p>
        <p className="mt-1 text-xs font-semibold uppercase text-ink/55">Checkout verified</p>
      </div>
    </div>
  );
}

function PolicyCards({ offers }: { offers: OfferWithMerchant[] }) {
  const shipping = offers.find((offer) => offer.offerType === "free_shipping");
  const reward = offers.find((offer) => offer.offerType === "reward");
  const clearance = offers.find((offer) => offer.offerType === "clearance" || offer.offerType === "sale");

  const cards = [
    {
      title: "Free shipping",
      icon: <Truck size={18} aria-hidden="true" />,
      body: shipping
        ? `${shipping.title}. Minimum order: ${
            shipping.minimumOrderValue ? `$${shipping.minimumOrderValue.toLocaleString()}+` : "check merchant terms"
          }.`
        : "No stable free shipping threshold is currently tracked. Check the merchant source before ordering."
    },
    {
      title: "Rewards",
      icon: <Gift size={18} aria-hidden="true" />,
      body: reward
        ? `${reward.title}. ${reward.discountValue}.`
        : "No public rewards program is currently tracked for this merchant."
    },
    {
      title: "Sales and clearance",
      icon: <ShoppingBag size={18} aria-hidden="true" />,
      body: clearance
        ? `${clearance.title}. ${clearance.discountValue}.`
        : "No stable sale or clearance page is currently tracked."
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div key={card.title} className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
          <div className="inline-flex items-center gap-2 text-leaf">
            {card.icon}
            <p className="text-sm font-bold uppercase">{card.title}</p>
          </div>
          <p className="mt-3 text-sm leading-6 text-ink/65">{card.body}</p>
        </div>
      ))}
    </div>
  );
}

export function StoreProfilePage({ merchantId, headline, intro, trustSection }: StoreProfilePageProps) {
  const merchant = getMerchantById(merchantId);
  const offers = getOffersByMerchantId(merchantId);

  if (!merchant) return null;

  const primaryKeyword = storeKeywords[merchantId] ?? `${merchant.name} coupon code`;
  const latestChecked = offers[0]?.lastCheckedAt ?? "2026-06-05";

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <Link href="/stores" className="inline-flex items-center gap-2 text-sm font-bold text-leaf hover:text-ink">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to store index
      </Link>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          <p className="text-sm font-bold uppercase text-leaf">Store profile</p>
          <h1 className="mt-2 text-5xl font-bold tracking-normal text-ink">{headline}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-ink/70">{intro}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={merchant.homepageUrl}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex items-center gap-2 rounded-md bg-leaf px-4 py-3 text-sm font-bold text-white transition hover:bg-ink"
            >
              Visit merchant source
              <ExternalLink size={16} aria-hidden="true" />
            </a>
            <a
              href="#offers"
              className="focus-ring inline-flex items-center gap-2 rounded-md border border-ink/15 bg-white px-4 py-3 text-sm font-bold text-ink transition hover:border-leaf hover:text-leaf"
            >
              View tracked offers
            </a>
          </div>
          <div className="mt-6 rounded-lg border border-ink/10 bg-mint/30 p-4">
            <p className="text-sm font-bold text-ink">21+ informational tracker</p>
            <p className="mt-2 text-sm leading-6 text-ink/70">
              VapeKeys does not sell tobacco, nicotine, or vapor products. This page tracks public discount signals for
              adult US business buyers and is informational, not legal advice.
            </p>
          </div>
        </div>

        <aside className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
          <p className="font-bold text-ink">Merchant facts</p>
          <dl className="mt-4 grid gap-3 text-sm">
            <div>
              <dt className="font-semibold text-ink/55">Tracked keyword</dt>
              <dd className="mt-1 text-ink">{primaryKeyword}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink/55">Domain</dt>
              <dd className="mt-1 text-ink">{merchant.domain}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink/55">Location</dt>
              <dd className="mt-1 inline-flex items-center gap-1 text-ink">
                <MapPin size={14} className="text-ink/50" aria-hidden="true" />
                {merchant.location ?? "Not listed"}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink/55">Wholesale fit</dt>
              <dd className="mt-1 inline-flex items-center gap-1 text-ink">
                <ShieldCheck size={14} className="text-leaf" aria-hidden="true" />
                {merchant.supportsWholesale ? "Wholesale or bulk buyers supported" : "Retailer; verify bulk terms"}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink/55">License requirement</dt>
              <dd className="mt-1 text-ink">
                {merchant.requiresLicense ? "Business or tobacco license required" : "Not listed as required"}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink/55">Free shipping</dt>
              <dd className="mt-1 text-ink">
                {merchant.freeShippingThreshold
                  ? `$${merchant.freeShippingThreshold.toLocaleString()}+ orders`
                  : "Check merchant source"}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink/55">Last checked</dt>
              <dd className="mt-1 text-ink">{latestChecked}</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="mt-10">
        <SourceSummary offers={offers} />
      </section>

      <section id="offers" className="mt-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-leaf">Current status</p>
            <h2 className="mt-2 text-3xl font-bold text-ink">{merchant.name} coupon code tracker</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/70">
              Offers marked reported are coupon-source leads. Official items come from merchant pages, programs, or
              public policy pages. Checkout verification is reserved for high-priority codes.
            </p>
          </div>
          <Link
            href="/submit"
            className="focus-ring inline-flex w-fit items-center gap-2 rounded-md border border-ink/15 bg-white px-4 py-2.5 text-sm font-bold text-ink transition hover:border-leaf hover:text-leaf"
          >
            Submit a source
            <ExternalLink size={15} aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-5 grid gap-4">
          {offers.map((offer) => (
            <article key={offer.id} className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase text-ink/55">
                    <Tag size={14} aria-hidden="true" />
                    {offerTypeLabels[offer.offerType]}
                  </div>
                  <h3 className="mt-2 text-xl font-bold text-ink">{offer.title}</h3>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-ink/65">{offer.description}</p>
                </div>
                <Badge confidence={offer.confidence} />
              </div>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-4">
                <div>
                  <p className="font-semibold text-ink/55">Code</p>
                  <p className="mt-1 font-bold text-ink">{offer.code ?? "Hidden, auto, or program"}</p>
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
                  <a
                    href={offer.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring mt-1 inline-flex items-center gap-1 rounded-md text-leaf hover:text-ink"
                  >
                    Open source
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <p className="text-sm font-bold uppercase text-leaf">Shipping, rewards, and clearance</p>
        <h2 className="mt-2 text-3xl font-bold text-ink">Policy signals buyers should verify</h2>
        <div className="mt-5">
          <PolicyCards offers={offers} />
        </div>
      </section>

      {trustSection ? (
        <section className="mt-12 rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
          <p className="text-sm font-bold uppercase text-leaf">Trust notes</p>
          <h2 className="mt-2 text-3xl font-bold text-ink">{trustSection.title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/70">{trustSection.body}</p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {trustSection.points.map((point) => (
              <div key={point} className="flex gap-3 rounded-lg border border-ink/10 bg-paper/60 p-4">
                <CheckCircle2 className="mt-0.5 shrink-0 text-leaf" size={18} aria-hidden="true" />
                <p className="text-sm leading-6 text-ink/70">{point}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-12 rounded-lg border border-ink/10 bg-wheat/50 p-5">
        <p className="font-bold text-ink">Buyer reminder</p>
        <p className="mt-2 text-sm leading-6 text-ink/70">
          Discount signals can change without notice. Confirm age, license, state, shipping, and seller requirements
          before placing any order. This page is not a recommendation to purchase and does not provide legal advice.
        </p>
      </section>
    </main>
  );
}
