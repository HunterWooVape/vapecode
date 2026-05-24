"use client";

import { Mail } from "lucide-react";
import { useState, useTransition } from "react";
import { subscribeNewsletter } from "@/app/actions";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const res = await subscribeNewsletter(formData);
      setResult(
        res.success
          ? { success: true, message: res.message }
          : { success: false, message: res.error }
      );
    });
  }

  return (
    <form
      className={`rounded-lg border border-ink/10 bg-white p-5 shadow-soft ${compact ? "" : "max-w-xl"}`}
      onSubmit={handleSubmit}
    >
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-mint text-leaf">
          <Mail size={20} aria-hidden="true" />
        </span>
        <div>
          <p className="font-bold text-ink">Get weekly verified discounts</p>
          <p className="mt-1 text-sm leading-5 text-ink/65">
            Wholesale discount codes, free shipping alerts, and bulk deal updates.
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input
          required
          name="email"
          type="email"
          placeholder="Business email"
          className="focus-ring rounded-md border border-ink/15 px-3 py-2"
        />
        <select required name="buyerType" className="focus-ring rounded-md border border-ink/15 px-3 py-2 text-ink/70">
          <option value="">Buyer type</option>
          <option>Vape shop</option>
          <option>Smoke shop</option>
          <option>Convenience store</option>
          <option>Distributor</option>
          <option>Online reseller</option>
        </select>
        <input name="state" placeholder="State" className="focus-ring rounded-md border border-ink/15 px-3 py-2" />
        <select name="interestedCategories" className="focus-ring rounded-md border border-ink/15 px-3 py-2 text-ink/70">
          <option value="">Interested category</option>
          <option>Disposables</option>
          <option>E-liquid</option>
          <option>Pods</option>
          <option>Accessories</option>
          <option>Smoke shop supplies</option>
        </select>
      </div>
      <label className="mt-4 flex gap-2 text-xs leading-5 text-ink/65">
        <input required name="is21Plus" type="checkbox" className="mt-1 h-4 w-4 accent-leaf" />
        I am 21+ and agree to receive wholesale discount emails. I can unsubscribe at any time.
      </label>
      <button
        type="submit"
        disabled={pending}
        className="focus-ring mt-4 w-full rounded-md bg-leaf px-4 py-3 text-sm font-bold text-white transition hover:bg-ink disabled:opacity-60"
      >
        {pending ? "Subscribing..." : "Join the deal list"}
      </button>
      {result ? (
        <p
          className={`mt-3 rounded-md px-3 py-2 text-sm font-bold ${
            result.success ? "bg-mint text-leaf" : "bg-red-50 text-red-600"
          }`}
        >
          {result.message}
        </p>
      ) : null}
    </form>
  );
}
