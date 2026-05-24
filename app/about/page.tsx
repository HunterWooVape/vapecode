import Link from "next/link";
import { ShieldCheck, CheckCircle2, Search, Mail, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About",
  description:
    "VapeKeys is an independent discount tracker for US wholesale vape buyers. Learn how we verify codes, why we started, and how to work with us."
};

export default function AboutPage() {
  return (
    <main>
      <section className="grid-pattern border-b border-ink/10">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-bold uppercase text-leaf">About VapeKeys</p>
            <h1 className="mt-4 text-4xl font-bold tracking-normal text-ink md:text-5xl">
              We track wholesale vape discounts so you don&apos;t have to
            </h1>
            <p className="mt-6 text-lg leading-8 text-ink/70">
              VapeKeys is an independent information service for adult US business buyers who purchase vape products
              at wholesale. We do not sell products, take orders, or handle payments. We verify codes, track
              expiration dates, and publish what we find.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-bold text-ink">Why we started</h2>
            <p className="mt-4 text-sm leading-7 text-ink/70">
              Most coupon sites regurgitate the same unverified codes. A wholesale buyer searching for &quot;vape
              wholesale usa discount code&quot; clicks through ten pages only to find codes that expired months ago or
              never worked at all.
            </p>
            <p className="mt-4 text-sm leading-7 text-ink/70">
              VapeKeys was built to solve that. We apply a simple standard: if we can&apos;t trace a code to at least
              one credible source, we label it as reported—not verified. When we can confirm it across multiple
              sources or at checkout, we upgrade it. Every entry shows its last checked date and source URL.
            </p>
            <p className="mt-4 text-sm leading-7 text-ink/70">
              Over time, we plan to build the most trusted dataset of wholesale vape discounts in the US: what
              works, what expired, seasonal patterns, and which merchants are most reliable for bulk buyers.
            </p>
          </div>

          <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-soft">
            <p className="text-sm font-bold uppercase text-leaf">What we are not</p>
            <ul className="mt-4 grid gap-3 text-sm text-ink/70">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                We do not sell tobacco, nicotine, or vapor products.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                We do not provide legal advice about state regulations or licensing.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                We do not guarantee that any code will work at checkout.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                We do not collect orders, payments, or personal health data.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                We are not affiliated with any merchant, brand, or manufacturer.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-paper/60 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-center text-sm font-bold uppercase text-leaf">Our process</p>
          <h2 className="mt-2 text-center text-3xl font-bold text-ink">How we verify discount codes</h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-mint text-leaf">
                <Search size={20} aria-hidden="true" />
              </span>
              <p className="mt-4 font-bold text-ink">1. Discovery</p>
              <p className="mt-2 text-sm leading-6 text-ink/65">
                We monitor merchant sites, SERPs, coupon aggregators, Reddit, and community forums to find codes
                that mention wholesale or bulk discounts.
              </p>
            </div>
            <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-wheat text-clay">
                <CheckCircle2 size={20} aria-hidden="true" />
              </span>
              <p className="mt-4 font-bold text-ink">2. Cross-reference</p>
              <p className="mt-2 text-sm leading-6 text-ink/65">
                Each code is checked against at least two independent sources. We record the source URL, claimed
                discount, and expiration date for transparency.
              </p>
            </div>
            <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-mint text-leaf">
                <ShieldCheck size={20} aria-hidden="true" />
              </span>
              <p className="mt-4 font-bold text-ink">3. Confidence grading</p>
              <p className="mt-2 text-sm leading-6 text-ink/65">
                Codes are labeled official, verified, reported, or expired. We update the database weekly and
                downgrade codes that stop working.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-ink">Work with us</h2>
            <p className="mt-4 text-sm leading-7 text-ink/70">
              We are open to affiliate partnerships, sponsored placements, and exclusive discount code arrangements
              with verified wholesale merchants. All sponsored content is clearly labeled.
            </p>
            <p className="mt-4 text-sm leading-7 text-ink/70">
              If you represent a wholesale vape distributor and want your codes verified and listed, submit them
              through our{" "}
              <Link href="/submit" className="font-semibold text-leaf underline">
                source submission page
              </Link>
              .
            </p>
            <div className="mt-6">
              <Link
                href="/submit"
                className="focus-ring inline-flex items-center gap-2 rounded-md bg-leaf px-5 py-2.5 text-sm font-bold text-white transition hover:bg-ink"
              >
                Submit a code <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-soft">
            <p className="text-sm font-bold uppercase text-leaf">Contact</p>
            <div className="mt-4 grid gap-3 text-sm text-ink/70">
              <p className="flex items-center gap-2">
                <Mail size={16} aria-hidden="true" />
                <span>For partnerships and corrections:</span>
              </p>
              <p className="pl-6 font-mono text-ink">hello@vapekeys.com</p>
              <p className="mt-2 text-xs text-ink/55">
                Response time is typically 1-2 business days. We do not offer phone support.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-ink">Compliance & disclaimers</h2>
          <div className="mt-6 grid gap-4 text-sm leading-7 text-ink/70 md:grid-cols-2">
            <p>
              <strong className="text-ink">Age restriction:</strong> This site is intended for adults 21 years of age
              or older. We do not market to minors.
            </p>
            <p>
              <strong className="text-ink">No sales:</strong> We do not sell, ship, or distribute tobacco, nicotine,
              or vapor products. All offers are informational only.
            </p>
            <p>
              <strong className="text-ink">Legal disclaimer:</strong> We do not provide legal advice. Buyers are
              responsible for confirming that their purchases comply with federal, state, and local laws.
            </p>
            <p>
              <strong className="text-ink">Health claims:</strong> We do not make health claims, smoking cessation
              claims, or safety assertions about any product.
            </p>
          </div>
          <p className="mt-6 text-xs text-ink/55">
            For full compliance details, see our{" "}
            <Link href="/compliance" className="font-semibold text-leaf underline">
              compliance page
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
