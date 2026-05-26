import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, TrendingDown, Truck, Calculator, Tag, Store } from "lucide-react";
import { NewsletterForm } from "@/components/NewsletterForm";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { QuoteMatchForm } from "@/components/QuoteMatchForm";
import { getOffersWithMerchants, merchants, updatedAt } from "@/lib/offers";

export const metadata = {
  title: "Verified Wholesale Vape Discounts & Bulk Deals | VapeKeys",
  description:
    "VapeKeys tracks verified wholesale vape discount codes, free shipping thresholds, and bulk deals for adult US business buyers. Compare 8+ wholesale merchants.",
  alternates: {
    canonical: "/",
  },
};

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-bold text-ink">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase text-ink/55">{label}</p>
    </div>
  );
}

function FeatureCard({
  href,
  icon,
  title,
  description,
  color
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "leaf" | "clay" | "ink";
}) {
  const colorMap = {
    leaf: "bg-mint text-leaf hover:bg-leaf hover:text-white",
    clay: "bg-wheat text-clay hover:bg-clay hover:text-white",
    ink: "bg-ink/5 text-ink hover:bg-ink hover:text-white"
  };
  return (
    <Link
      href={href}
      className="group focus-ring grid gap-4 rounded-lg border border-ink/10 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-md"
    >
      <span className={`grid h-12 w-12 place-items-center rounded-md text-lg transition ${colorMap[color]}`}>
        {icon}
      </span>
      <div>
        <p className="text-lg font-bold text-ink group-hover:text-leaf transition">{title}</p>
        <p className="mt-2 text-sm leading-6 text-ink/65">{description}</p>
      </div>
      <span className="inline-flex items-center gap-1 text-sm font-bold text-leaf">
        Explore <ArrowRight size={14} aria-hidden="true" />
      </span>
    </Link>
  );
}

function DealPreviewRow({
  code,
  merchant,
  discount,
  confidence
}: {
  code: string | null;
  merchant: string;
  discount: string;
  confidence: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-ink/8 bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex h-6 items-center rounded px-2 text-xs font-bold ${
            confidence === "verified" || confidence === "official"
              ? "bg-mint text-leaf"
              : "bg-ink/5 text-ink/55"
          }`}
        >
          {confidence}
        </span>
        <span className="text-sm font-semibold text-ink">{merchant}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-ink/70">{discount}</span>
        {code ? (
          <span className="rounded bg-ink/5 px-2 py-1 font-mono text-xs font-bold text-ink">{code}</span>
        ) : null}
      </div>
    </div>
  );
}

export default function HomePage() {
  const allOffers = getOffersWithMerchants();
  const verifiedCount = allOffers.filter((o) => o.confidence === "verified" || o.confidence === "official").length;
  const topDeals = allOffers
    .filter((o) => o.confidence === "verified" || o.confidence === "official")
    .slice(0, 6);

  return (
    <main>
      {/* Hero */}
      <section className="grid-pattern border-b border-ink/10">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold uppercase text-leaf shadow-sm">
              Last updated {updatedAt}
            </p>
            <h1 className="mt-6 text-4xl font-bold tracking-normal text-ink md:text-6xl">
              Verified Wholesale Vape Discounts
            </h1>
            <p className="mt-6 text-lg leading-8 text-ink/70">
              We track, verify, and rank wholesale vape discount codes so you don&apos;t waste time on expired or fake
              promos. Built for adult US business buyers.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/vape-wholesale-usa-discount-code"
                className="focus-ring inline-flex items-center gap-2 rounded-md bg-leaf px-6 py-3 text-sm font-bold text-white transition hover:bg-ink"
              >
                Browse all codes <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link
                href="#newsletter"
                className="focus-ring inline-flex items-center gap-2 rounded-md border border-ink/20 bg-white px-6 py-3 text-sm font-bold text-ink transition hover:bg-ink/5"
              >
                Get weekly alerts
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-6 rounded-xl border border-ink/10 bg-white p-6 shadow-soft">
            <StatCard value={String(allOffers.length)} label="Tracked deals" />
            <StatCard value={String(verifiedCount)} label="Verified" />
            <StatCard value={String(merchants.length)} label="Merchants" />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-center text-sm font-bold uppercase text-leaf">What you can do</p>
        <h2 className="mt-2 text-center text-3xl font-bold text-ink">Three ways to save</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <FeatureCard
            href="/vape-wholesale-usa-discount-code"
            icon={<Tag size={22} aria-hidden="true" />}
            title="Browse discount codes"
            description="Compare verified wholesale codes from 8+ US vape merchants. Filter by confidence, type, and minimum order."
            color="leaf"
          />
          <FeatureCard
            href="#calculator"
            icon={<Calculator size={22} aria-hidden="true" />}
            title="Calculate real savings"
            description="Estimate checkout totals after discount, shipping, and fees. Avoid surprises before placing large orders."
            color="clay"
          />
          <FeatureCard
            href="#quote"
            icon={<Store size={22} aria-hidden="true" />}
            title="Request a quote match"
            description="Submit your buying needs and get matched with verified wholesale partners. No automatic resale."
            color="ink"
          />
        </div>
      </section>

      {/* Latest Deals */}
      <section className="border-y border-ink/10 bg-paper/60 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase text-leaf">Latest picks</p>
              <h2 className="mt-2 text-3xl font-bold text-ink">Verified deals this week</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-ink/70">
                These codes have been cross-referenced across multiple sources. Always verify at checkout before placing
                large orders.
              </p>
            </div>
            <Link
              href="/vape-wholesale-usa-discount-code"
              className="focus-ring inline-flex items-center gap-2 rounded-md bg-ink px-5 py-2.5 text-sm font-bold text-white transition hover:bg-leaf"
            >
              View all codes <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8 grid gap-2">
            {topDeals.map((offer) => (
              <DealPreviewRow
                key={offer.id}
                code={offer.code}
                merchant={offer.merchant.name}
                discount={offer.discountValue}
                confidence={offer.confidence}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator">
        <SavingsCalculator />
      </section>

      {/* Quote Match */}
      <section id="quote" className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase text-clay">Quote Match</p>
            <h2 className="mt-2 text-3xl font-bold text-ink">Can&apos;t find what you need?</h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-ink/70">
              Submit your monthly volume, target brands, and state. We&apos;ll match you with wholesale partners that fit
              your buying profile.
            </p>
            <ul className="mt-6 grid gap-3 text-sm text-ink/70">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-leaf" aria-hidden="true" /> No automatic resale or distribution
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-leaf" aria-hidden="true" /> Partners are screened for compliance
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-leaf" aria-hidden="true" /> 21+ and licensed buyers only
              </li>
            </ul>
          </div>
          <QuoteMatchForm />
        </div>
      </section>

      {/* Newsletter */}
      <section id="newsletter" className="border-y border-ink/10 bg-mint/30 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase text-leaf">Deal alerts</p>
              <h2 className="mt-2 text-3xl font-bold text-ink">Get verified discounts weekly</h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-ink/70">
                We test codes, track expiration dates, and publish only what we can verify. No spam. Unsubscribe
                anytime.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-ink/65">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck size={15} aria-hidden="true" /> Verified sources
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <TrendingDown size={15} aria-hidden="true" /> Expiration tracking
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Truck size={15} aria-hidden="true" /> Free shipping alerts
                </span>
              </div>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-center text-sm font-bold uppercase text-leaf">Common questions</p>
        <h2 className="mt-2 text-center text-3xl font-bold text-ink">Quick answers</h2>
        <div className="mx-auto mt-10 max-w-3xl divide-y divide-ink/8">
          <details className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between text-base font-bold text-ink">
              Are these discount codes verified at checkout?
              <ArrowRight
                size={16}
                aria-hidden="true"
                className="transition group-open:rotate-90"
              />
            </summary>
            <p className="mt-3 text-sm leading-6 text-ink/70">
              We use a three-tier system: <strong>official</strong> (from the merchant), <strong>verified</strong>{" "}
              (cross-referenced across multiple sources), and <strong>reported</strong> (found on coupon sites but not
              yet confirmed). We recommend verifying any code at checkout before placing large orders.
            </p>
          </details>
          <details className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between text-base font-bold text-ink">
              Do I need a license to buy wholesale vape products?
              <ArrowRight
                size={16}
                aria-hidden="true"
                className="transition group-open:rotate-90"
              />
            </summary>
            <p className="mt-3 text-sm leading-6 text-ink/70">
              Requirements vary by state and merchant. Some wholesalers require a tobacco reseller license or business
              tax ID, while others sell to verified businesses without a specific vape license. Check each
              merchant&apos;s policy and your state regulations before ordering.
            </p>
          </details>
          <details className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between text-base font-bold text-ink">
              How often are the codes updated?
              <ArrowRight
                size={16}
                aria-hidden="true"
                className="transition group-open:rotate-90"
              />
            </summary>
            <p className="mt-3 text-sm leading-6 text-ink/70">
              We review and update codes weekly. Each offer shows a &quot;last checked&quot; date so you know how fresh
              the information is. Newsletter subscribers get alerts within 24 hours when we verify a new or expiring
              code.
            </p>
          </details>
        </div>
        <p className="mt-8 text-center text-sm text-ink/55">
          More questions? View the{" "}
          <Link href="/vape-wholesale-usa-discount-code" className="font-semibold text-leaf underline">
            complete FAQ on our codes page
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
