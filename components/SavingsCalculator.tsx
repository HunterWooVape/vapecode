"use client";

import { Calculator } from "lucide-react";
import { useMemo, useState } from "react";

export function SavingsCalculator() {
  const [orderValue, setOrderValue] = useState(800);
  const [discountType, setDiscountType] = useState<"percent" | "fixed" | "shipping">("percent");
  const [discountValue, setDiscountValue] = useState(10);
  const [shipping, setShipping] = useState(45);

  const result = useMemo(() => {
    const subtotal = Math.max(orderValue, 0);
    const shippingCost = Math.max(shipping, 0);
    const rawSavings =
      discountType === "percent"
        ? subtotal * (Math.max(discountValue, 0) / 100)
        : discountType === "fixed"
          ? Math.max(discountValue, 0)
          : shippingCost;
    const savings = Math.min(rawSavings, subtotal + shippingCost);
    const estimatedTotal = Math.max(subtotal + shippingCost - savings, 0);
    return {
      savings,
      estimatedTotal
    };
  }, [discountType, discountValue, orderValue, shipping]);

  return (
    <section className="bg-mint/55 py-12">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-bold uppercase text-leaf">
            <Calculator size={18} aria-hidden="true" />
            Savings Calculator
          </p>
          <h2 className="mt-2 text-3xl font-bold text-ink">Estimate the real value of a wholesale discount</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-ink/70">
            Wholesale discounts can be offset by freight, account requirements, state restrictions, and product
            exclusions. This calculator keeps the buying decision grounded before a buyer clicks out.
          </p>
        </div>
        <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Order value
              <input
                type="number"
                min="0"
                value={orderValue}
                onChange={(event) => setOrderValue(Number(event.target.value))}
                className="focus-ring rounded-md border border-ink/15 px-3 py-2"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Estimated shipping
              <input
                type="number"
                min="0"
                value={shipping}
                onChange={(event) => setShipping(Number(event.target.value))}
                className="focus-ring rounded-md border border-ink/15 px-3 py-2"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Discount type
              <select
                value={discountType}
                onChange={(event) => setDiscountType(event.target.value as "percent" | "fixed" | "shipping")}
                className="focus-ring rounded-md border border-ink/15 px-3 py-2"
              >
                <option value="percent">Percentage</option>
                <option value="fixed">Fixed amount</option>
                <option value="shipping">Free shipping</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Discount value
              <input
                type="number"
                min="0"
                value={discountValue}
                disabled={discountType === "shipping"}
                onChange={(event) => setDiscountValue(Number(event.target.value))}
                className="focus-ring rounded-md border border-ink/15 px-3 py-2 disabled:bg-ink/5 disabled:text-ink/40"
              />
            </label>
          </div>
          <div className="mt-5 grid gap-3 rounded-md bg-paper p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase text-ink/55">Estimated savings</p>
              <p className="mt-1 text-3xl font-bold text-leaf">${result.savings.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-ink/55">Estimated checkout total</p>
              <p className="mt-1 text-3xl font-bold text-ink">${result.estimatedTotal.toFixed(2)}</p>
            </div>
          </div>
          <p className="mt-4 text-xs leading-5 text-ink/55">
            Estimates are informational. Taxes, freight, licenses, product exclusions, and state rules may change the
            final price.
          </p>
        </div>
      </div>
    </section>
  );
}
