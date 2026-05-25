"use client";

import { Send } from "lucide-react";
import { useState, useTransition } from "react";
import { submitQuoteMatch } from "@/app/actions";
import { trackEvent } from "@/lib/analytics";

export function QuoteMatchForm() {
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const monthlyPurchaseVolume = String(formData.get("monthlyPurchaseVolume") ?? "");
    const licenseStatus = String(formData.get("licenseStatus") ?? "");
    const state = String(formData.get("state") ?? "");

    startTransition(async () => {
      const res = await submitQuoteMatch(formData);

      if (res.success) {
        trackEvent("quote_request_submit", {
          form_name: "quote_match",
          monthly_purchase_volume: monthlyPurchaseVolume || "unknown",
          license_status: licenseStatus || "unknown",
          state: state || "unknown"
        });
      }

      setResult(
        res.success
          ? { success: true, message: res.message }
          : { success: false, message: res.error }
      );
    });
  }

  return (
    <form
      className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft"
      onSubmit={handleSubmit}
    >
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-wheat text-clay">
          <Send size={20} aria-hidden="true" />
        </span>
        <div>
          <p className="font-bold text-ink">Request a wholesale quote match</p>
          <p className="mt-1 text-sm leading-5 text-ink/65">
            Submit your buying needs to be matched with verified wholesale partners. No automatic resale or
            distribution.
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input required name="businessName" placeholder="Business name" className="focus-ring rounded-md border border-ink/15 px-3 py-2" />
        <input
          required
          name="businessEmail"
          type="email"
          placeholder="Business email"
          className="focus-ring rounded-md border border-ink/15 px-3 py-2"
        />
        <input required name="state" placeholder="State" className="focus-ring rounded-md border border-ink/15 px-3 py-2" />
        <select required name="monthlyPurchaseVolume" className="focus-ring rounded-md border border-ink/15 px-3 py-2 text-ink/70">
          <option value="">Monthly purchase volume</option>
          <option>$1k - $5k</option>
          <option>$5k - $20k</option>
          <option>$20k - $50k</option>
          <option>$50k+</option>
        </select>
        <select required name="licenseStatus" className="focus-ring rounded-md border border-ink/15 px-3 py-2 text-ink/70">
          <option value="">License status</option>
          <option>Have required resale/tobacco licenses</option>
          <option>Applying for licenses</option>
          <option>Not sure</option>
        </select>
        <input name="productCategories" placeholder="Product categories" className="focus-ring rounded-md border border-ink/15 px-3 py-2" />
      </div>
      <textarea
        name="notes"
        placeholder="Notes, brands, target quantities, or shipping constraints"
        rows={4}
        className="focus-ring mt-3 w-full rounded-md border border-ink/15 px-3 py-2"
      />
      <label className="mt-4 flex gap-2 text-xs leading-5 text-ink/65">
        <input required name="partnerConsent" type="checkbox" className="mt-1 h-4 w-4 accent-leaf" />
        I agree that selected wholesale partners may contact me about relevant offers.
      </label>
      <button
        type="submit"
        disabled={pending}
        className="focus-ring mt-4 w-full rounded-md bg-ink px-4 py-3 text-sm font-bold text-white transition hover:bg-leaf disabled:opacity-60"
      >
        {pending ? "Sending..." : "Send quote request"}
      </button>
      {result ? (
        <p
          className={`mt-3 rounded-md px-3 py-2 text-sm font-bold ${
            result.success ? "bg-wheat text-clay" : "bg-red-50 text-red-600"
          }`}
        >
          {result.message}
        </p>
      ) : null}
    </form>
  );
}
