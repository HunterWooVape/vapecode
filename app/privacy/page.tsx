import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy draft for the vape wholesale discount tracker MVP.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-sm font-bold uppercase text-leaf">Privacy Draft</p>
      <h1 className="mt-2 text-5xl font-bold text-ink">Privacy and consent principles</h1>
      <div className="mt-6 space-y-5 text-sm leading-7 text-ink/70">
        <p>
          The MVP collects information only when a visitor submits a newsletter form, coupon source, or quote-match
          request. Production forms should disclose the intended use before submission and store consent timestamps.
        </p>
        <p>
          Newsletter subscribers should receive only the content they requested and must be able to unsubscribe from
          every marketing email.
        </p>
        <p>
          Quote-match submissions should not be automatically sold or distributed. Sharing with selected wholesale
          partners requires explicit consent and a clear description of how the buyer may be contacted.
        </p>
        <p>
          Before scaling, replace this draft with a jurisdiction-aware privacy policy covering analytics, email tooling,
          lead sharing, retention, deletion requests, and vendor processors.
        </p>
      </div>
    </main>
  );
}
