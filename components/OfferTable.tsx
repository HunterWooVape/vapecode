"use client";

import { Copy, ExternalLink, Tag, Store, Truck, Gift, Percent, Package, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/Badge";
import type { OfferConfidence, OfferType, OfferWithMerchant } from "@/lib/types";

const filters: Array<OfferConfidence | "all"> = ["all", "verified", "official", "reported", "expired"];

const typeIcons: Record<OfferType, React.ReactNode> = {
  coupon_code: <Tag size={14} aria-hidden="true" />,
  automatic_discount: <Percent size={14} aria-hidden="true" />,
  free_shipping: <Truck size={14} aria-hidden="true" />,
  reward: <Gift size={14} aria-hidden="true" />,
  sale: <ShoppingBag size={14} aria-hidden="true" />,
  bogo: <Package size={14} aria-hidden="true" />,
  clearance: <Store size={14} aria-hidden="true" />
};

const typeLabels: Record<OfferType, string> = {
  coupon_code: "Code",
  automatic_discount: "Auto",
  free_shipping: "Shipping",
  reward: "Rewards",
  sale: "Sale",
  bogo: "BOGO",
  clearance: "Clearance"
};

export function OfferTable({ offers }: { offers: OfferWithMerchant[] }) {
  const [filter, setFilter] = useState<OfferConfidence | "all">("all");
  const [copied, setCopied] = useState<string | null>(null);

  const visibleOffers = useMemo(() => {
    return filter === "all" ? offers : offers.filter((offer) => offer.confidence === filter);
  }, [filter, offers]);

  async function copyCode(code: string) {
    await navigator.clipboard.writeText(code);
    setCopied(code);
    window.setTimeout(() => setCopied(null), 1800);
  }

  return (
    <section id="codes" className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase text-leaf">Current Codes</p>
          <h2 className="mt-2 text-3xl font-bold tracking-normal text-ink">Wholesale discount table</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/70">
            Real offers collected from official sites, coupon partners, and SERP analysis. Codes marked
            &quot;reported&quot; are from third-party sources and should be tested at checkout.
          </p>
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Offer filters">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`focus-ring rounded-md border px-3 py-2 text-sm font-semibold capitalize transition ${
                filter === item
                  ? "border-leaf bg-leaf text-white"
                  : "border-ink/10 bg-white text-ink/70 hover:border-leaf hover:text-leaf"
              }`}
            >
              {item.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-ink/10 bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="min-w-[1020px] w-full border-collapse text-left text-sm">
            <thead className="bg-ink text-paper">
              <tr>
                <th className="px-4 py-3 font-semibold">Merchant</th>
                <th className="px-4 py-3 font-semibold">Offer</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Code</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Last checked</th>
                <th className="px-4 py-3 font-semibold">Source</th>
              </tr>
            </thead>
            <tbody>
              {visibleOffers.map((offer) => (
                <tr key={offer.id} className="border-t border-ink/10 align-top">
                  <td className="px-4 py-4">
                    <p className="font-bold text-ink">{offer.merchant.name}</p>
                    <p className="mt-1 text-xs text-ink/55">{offer.merchant.category}</p>
                    {offer.merchant.freeShippingThreshold ? (
                      <p className="mt-1 text-xs text-ink/45">
                        Free ship ${offer.merchant.freeShippingThreshold.toLocaleString()}+
                      </p>
                    ) : null}
                  </td>
                  <td className="max-w-xs px-4 py-4">
                    <p className="font-semibold text-ink">{offer.title}</p>
                    <p className="mt-1 leading-5 text-ink/65">{offer.description}</p>
                    <p className="mt-2 text-xs font-semibold text-clay">{offer.discountValue}</p>
                    {offer.minimumOrderValue ? (
                      <p className="mt-1 text-xs text-ink/50">Min order: ${offer.minimumOrderValue.toLocaleString()}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-ink/5 px-2 py-1 text-xs font-semibold text-ink/70">
                      {typeIcons[offer.offerType]}
                      {typeLabels[offer.offerType]}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {offer.code ? (
                      <button
                        type="button"
                        onClick={() => copyCode(offer.code as string)}
                        className="focus-ring inline-flex min-w-32 items-center justify-between gap-2 rounded-md border border-ink/15 bg-paper px-3 py-2 font-bold text-ink transition hover:border-leaf"
                        aria-label={`Copy ${offer.code}`}
                      >
                        {offer.code}
                        <Copy size={16} aria-hidden="true" />
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-ink/5 px-2 py-1 text-xs font-medium text-ink/50">
                        <Tag size={12} />
                        {offer.offerType === "free_shipping"
                          ? "Auto-applied"
                          : offer.offerType === "automatic_discount"
                            ? "Auto"
                            : offer.offerType === "reward"
                              ? "Program"
                              : "Hidden"}
                      </span>
                    )}
                    {copied === offer.code ? <p className="mt-2 text-xs font-bold text-leaf">Copied</p> : null}
                  </td>
                  <td className="px-4 py-4">
                    <Badge confidence={offer.confidence} />
                    <p className="mt-2 max-w-32 text-xs leading-5 text-ink/55">{offer.stateRestrictions}</p>
                    {offer.sourceCount && offer.sourceCount > 1 ? (
                      <p className="mt-1 text-xs text-ink/40">{offer.sourceCount} sources</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-4 text-ink/65">{offer.lastCheckedAt}</td>
                  <td className="px-4 py-4">
                    <a
                      href={offer.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="focus-ring inline-flex items-center gap-1 rounded-md text-sm font-bold text-leaf hover:text-ink"
                    >
                      View
                      <ExternalLink size={15} aria-hidden="true" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
