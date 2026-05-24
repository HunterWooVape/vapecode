"use client";

import { useState, useTransition } from "react";
import { submitOfferSource } from "@/app/actions";

export default function SubmitPage() {
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const res = await submitOfferSource(formData);
      setResult(
        res.success
          ? { success: true, message: res.message }
          : { success: false, message: res.error }
      );
    });
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm font-bold uppercase text-leaf">Submit Source</p>
      <h1 className="mt-2 text-5xl font-bold text-ink">Submit a wholesale coupon or deal source</h1>
      <p className="mt-4 text-sm leading-6 text-ink/70">
        Submit official pages, SEMrush backlink finds, newsletter offers, or reported codes. Our team reviews every
        submission within 3 business days.
      </p>
      <form className="mt-8 rounded-lg border border-ink/10 bg-white p-5 shadow-soft" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <input required name="merchantName" placeholder="Merchant name" className="focus-ring rounded-md border border-ink/15 px-3 py-2" />
          <input name="code" placeholder="Coupon code (if known)" className="focus-ring rounded-md border border-ink/15 px-3 py-2" />
          <input
            required
            name="sourceUrl"
            type="url"
            placeholder="Source URL"
            className="focus-ring rounded-md border border-ink/15 px-3 py-2 sm:col-span-2"
          />
          <select required name="sourceType" className="focus-ring rounded-md border border-ink/15 px-3 py-2 text-ink/70">
            <option value="">Source type</option>
            <option>Official merchant page</option>
            <option>SEMrush backlink source</option>
            <option>Coupon site</option>
            <option>Newsletter</option>
            <option>Community report</option>
          </select>
          <input name="submitterEmail" type="email" placeholder="Your email (optional)" className="focus-ring rounded-md border border-ink/15 px-3 py-2" />
        </div>
        <textarea
          required
          name="details"
          rows={5}
          placeholder="Offer details, minimum order, expiration, or verification notes"
          className="focus-ring mt-4 w-full rounded-md border border-ink/15 px-3 py-2"
        />
        <label className="mt-4 flex gap-2 text-xs leading-5 text-ink/65">
          <input required name="complianceConfirmed" type="checkbox" className="mt-1 h-4 w-4 accent-leaf" />
          I confirm this submission is intended for adult business buyers and does not promote free samples, underage
          use, or evasion of legal restrictions.
        </label>
        <button
          type="submit"
          disabled={pending}
          className="focus-ring mt-5 rounded-md bg-leaf px-5 py-3 text-sm font-bold text-white transition hover:bg-ink disabled:opacity-60"
        >
          {pending ? "Submitting..." : "Submit for review"}
        </button>
        {result ? (
          <p
            className={`mt-4 rounded-md px-3 py-2 text-sm font-bold ${
              result.success ? "bg-mint text-leaf" : "bg-red-50 text-red-600"
            }`}
          >
            {result.message}
          </p>
        ) : null}
      </form>
    </main>
  );
}
