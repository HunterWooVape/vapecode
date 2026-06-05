import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronDown, Search, ShieldCheck, Store, Truck } from "lucide-react";
import { NewsletterForm } from "@/components/NewsletterForm";
import { OfferTable } from "@/components/OfferTable";
import { QuoteMatchForm } from "@/components/QuoteMatchForm";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { getOffersWithMerchants, updatedAt, faqItems } from "@/lib/offers";

export const metadata: Metadata = {
  title: "Vape Wholesale USA Discount Code",
  description:
    "Find verified and reported Vape Wholesale USA discount codes, wholesale vape deals from The Vape Mall, Flawless Vape Shop, Geek Vape, and VapeSourcing. Free shipping alerts and bulk savings for adult business buyers.",
  alternates: {
    canonical: "/vape-wholesale-usa-discount-code",
  },
  keywords: [
    "vape wholesale usa discount code",
    "wholesale vape discounts",
    "vape wholesale coupon code",
    "bulk vape discount",
    "free shipping vape wholesale",
    "vape distributor coupon",
    "vape wholesale deals 2026"
  ]
};

const checklist = [
  "Confirm adult 21+ access and lawful business buyer status.",
  "Check whether the seller requires resale, tobacco, or vapor-product licenses.",
  "Review state restrictions, freight policies, return windows, and minimum order amounts.",
  "Treat reported coupon-site codes as leads until they are verified at checkout."
];

const intentCards = [
  {
    href: "/stores/vape-wholesale-usa",
    icon: <Store size={20} aria-hidden="true" />,
    title: "Vape Wholesale USA coupon code",
    description:
      "Review reported code leads, official reward signals, clearance notes, free shipping threshold, and neutral trust signals."
  },
  {
    href: "/vape-wholesale-coupon-code",
    icon: <Search size={20} aria-hidden="true" />,
    title: "Vape wholesale promo code",
    description:
      "Compare coupon and promo-code intent across wholesale-friendly merchants without treating reported codes as verified."
  },
  {
    href: "/vape-wholesale-free-shipping-code",
    icon: <Truck size={20} aria-hidden="true" />,
    title: "Vape wholesale free shipping",
    description:
      "Check published free shipping thresholds before assuming a discount is worth more than the freight cost."
  },
  {
    href: "/stores",
    icon: <ShieldCheck size={20} aria-hidden="true" />,
    title: "Store profiles and source confidence",
    description:
      "Browse tracked merchants with offer counts, confidence mix, shipping notes, and source links for adult business buyers."
  }
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer
        }
      }))
    },
    {
      "@type": "Organization",
      name: "Vape Wholesale Discount Tracker",
      url: "https://vapekeys.com",
      description:
        "Verified wholesale vape discounts, bulk deal alerts, and buying checklists for adult US business buyers.",
      sameAs: []
    }
  ]
};

export default function DiscountCodePage() {
  const offers = getOffersWithMerchants();

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="grid-pattern border-b border-ink/10">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <p className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold uppercase text-leaf shadow-sm">
              Last updated {updatedAt}
            </p>
            <h1 className="mt-5 max-w-3xl text-5xl font-bold tracking-normal text-ink md:text-6xl">
              Vape Wholesale USA Discount Code
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/72">
              Verified wholesale vape discounts, free shipping alerts, and bulk deal updates for adult, lawful US
              business buyers. We track Vape Wholesale USA, The Vape Mall, Flawless Vape Shop, Geek Vape, and
              VapeSourcing.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#newsletter"
                className="focus-ring inline-flex items-center gap-2 rounded-md bg-leaf px-5 py-3 text-sm font-bold text-white transition hover:bg-ink"
              >
                Get weekly verified discounts
                <ArrowRight size={17} aria-hidden="true" />
              </a>
              <a
                href="#codes"
                className="focus-ring inline-flex items-center gap-2 rounded-md border border-ink/15 bg-white px-5 py-3 text-sm font-bold text-ink transition hover:border-leaf hover:text-leaf"
              >
                View current codes
              </a>
            </div>
            <div className="mt-6 grid gap-3 text-sm text-ink/70 sm:grid-cols-3">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck size={17} className="text-leaf" aria-hidden="true" />
                21+ buyer focus
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={17} className="text-leaf" aria-hidden="true" />
                Verification status
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={17} className="text-leaf" aria-hidden="true" />
                Source tracking
              </span>
            </div>
          </div>
          <div id="newsletter">
            <NewsletterForm compact />
          </div>
        </div>
      </section>

      <OfferTable offers={offers} />

      <section className="border-y border-ink/10 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <p className="text-sm font-bold uppercase text-leaf">Search intent map</p>
          <h2 className="mt-2 text-3xl font-bold text-ink">
            Coupon codes, promo codes, free shipping, and trust checks
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/70">
            People search these terms in different ways, but the buying question is the same: what public discount
            signal is real enough to check before placing a wholesale order? We separate source confidence from coupon
            discovery so reported codes do not look stronger than they are.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {intentCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="focus-ring group rounded-lg border border-ink/10 bg-paper/60 p-5 transition hover:border-leaf hover:bg-white"
              >
                <div className="inline-flex items-center gap-2 text-leaf">
                  {card.icon}
                  <p className="text-sm font-bold uppercase">{card.title}</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-ink/65">{card.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-leaf group-hover:text-ink">
                  Open tracker
                  <ArrowRight size={15} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SavingsCalculator />

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-bold uppercase text-leaf">Buyer Checklist</p>
          <h2 className="mt-2 text-3xl font-bold text-ink">Check the discount before it becomes a buying decision</h2>
          <div className="mt-5 grid gap-3">
            {checklist.map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border border-ink/10 bg-white p-4">
                <CheckCircle2 className="mt-0.5 shrink-0 text-leaf" size={20} aria-hidden="true" />
                <p className="text-sm leading-6 text-ink/70">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <QuoteMatchForm />
      </section>

      <section className="border-t border-ink/10 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <p className="text-sm font-bold uppercase text-leaf">FAQ</p>
          <h2 className="mt-2 text-3xl font-bold text-ink">Common questions about vape wholesale discounts</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="group rounded-lg border border-ink/10 bg-paper/60 p-4 open:bg-white"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-ink">
                  {item.question}
                  <ChevronDown
                    size={18}
                    className="shrink-0 text-ink/50 transition group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-3 text-sm leading-6 text-ink/70">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-3">
          <div>
            <p className="font-bold text-ink">How we verify</p>
            <p className="mt-2 text-sm leading-6 text-ink/65">
              Official merchant pages and checkout checks outrank third-party coupon reports. SERP sources are used for
              discovery, then reviewed manually.
            </p>
          </div>
          <div>
            <p className="font-bold text-ink">Submit a code</p>
            <p className="mt-2 text-sm leading-6 text-ink/65">
              Found a wholesale discount? Submit the code and source URL so it can enter the review queue.
            </p>
            <Link href="/submit" className="mt-3 inline-flex text-sm font-bold text-leaf hover:text-ink">
              Submit source
            </Link>
          </div>
          <div>
            <p className="font-bold text-ink">Compliance first</p>
            <p className="mt-2 text-sm leading-6 text-ink/65">
              This site does not sell tobacco or nicotine products and does not provide legal advice. Offers may be
              subject to age, license, state, shipping, and seller rules.
            </p>
            <Link href="/compliance" className="mt-3 inline-flex text-sm font-bold text-leaf hover:text-ink">
              Read compliance notes
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-mint/30">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <p className="text-sm font-bold uppercase text-leaf">Related searches</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { href: "/vape-wholesale-coupon-code", label: "vape wholesale coupon code" },
              { href: "/bulk-vape-discount-code", label: "bulk vape discount code" },
              { href: "/wholesale-vape-supplies-coupon", label: "wholesale vape supplies coupon" },
              { href: "/vape-distributor-coupon-code", label: "vape distributor coupon code" },
              { href: "/vape-wholesale-free-shipping-code", label: "vape wholesale free shipping code" },
              { href: "/stores/flawless-vape-shop", label: "flawless vape coupon code" },
              { href: "/stores/vapesourcing", label: "vapesourcing coupon code" },
              { href: "/stores/discount-vape-pen", label: "discount vape pen coupon code" }
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="focus-ring rounded-full border border-ink/15 bg-white px-4 py-2 text-sm font-medium text-ink/80 transition hover:border-leaf hover:text-leaf"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
