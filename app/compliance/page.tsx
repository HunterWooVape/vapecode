import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compliance Notes",
  description: "Compliance and responsible-use notes for the vape wholesale discount tracker MVP."
};

const notes = [
  "This site is intended for adults 21+ and lawful business buyers.",
  "We do not sell tobacco, nicotine, vapor, or ENDS products.",
  "Discount information is informational and may be subject to seller verification, licensing, state restrictions, taxes, shipping rules, and availability.",
  "We do not provide legal, tax, import, shipping, or regulatory advice.",
  "We do not publish offers that promote underage use, free tobacco or ENDS samples, health claims, or evasion of restrictions."
];

export default function CompliancePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-sm font-bold uppercase text-leaf">Compliance</p>
      <h1 className="mt-2 text-5xl font-bold text-ink">Compliance notes and publishing standards</h1>
      <p className="mt-4 text-sm leading-6 text-ink/70">
        This page sets the operating boundary for the MVP. It should be reviewed by counsel before scaling lead sales,
        paid placements, affiliate campaigns, or supplier matching.
      </p>
      <div className="mt-8 grid gap-4">
        {notes.map((note) => (
          <div key={note} className="rounded-lg border border-ink/10 bg-white p-4 text-sm leading-6 text-ink/70">
            {note}
          </div>
        ))}
      </div>
    </main>
  );
}
