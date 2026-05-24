import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://vapekeys.com"),
  title: {
    default: "Vape Wholesale Discount Tracker",
    template: "%s | Vape Wholesale Discount Tracker"
  },
  description:
    "Verified wholesale vape discounts, bulk deal alerts, and buying checklists for adult US business buyers.",
  robots: {
    index: true,
    follow: true
  }
};

const navItems = [
  { href: "/vape-wholesale-usa-discount-code", label: "Codes" },
  { href: "/stores/vape-wholesale-usa", label: "Store" },
  { href: "/submit", label: "Submit" },
  { href: "/compliance", label: "Compliance" }
];

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-ink/10 bg-paper/85 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/vape-wholesale-usa-discount-code"
              className="focus-ring inline-flex w-fit items-center gap-2 rounded-md text-lg font-bold"
            >
              <span className="grid h-8 w-8 place-items-center rounded-md bg-ink text-sm text-paper">
                VW
              </span>
              Discount Tracker
            </Link>
            <nav aria-label="Main navigation" className="flex flex-wrap gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="focus-ring rounded-md px-3 py-2 text-sm font-semibold text-ink/75 transition hover:bg-mint hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        {children}
        <footer className="border-t border-ink/10 bg-ink text-paper">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-[1.5fr_1fr_1fr]">
            <div>
              <p className="text-lg font-bold">Vape Wholesale Discount Tracker</p>
              <p className="mt-2 max-w-xl text-sm leading-6 text-paper/70">
                Informational discount tracking for adults 21+ and lawful business buyers. We do not sell tobacco,
                nicotine, or vapor products.
              </p>
            </div>
            <div className="text-sm">
              <p className="font-semibold">Pages</p>
              <div className="mt-3 grid gap-2 text-paper/70">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className="hover:text-paper">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="text-sm">
              <p className="font-semibold">Legal</p>
              <div className="mt-3 grid gap-2 text-paper/70">
                <Link href="/privacy" className="hover:text-paper">
                  Privacy
                </Link>
                <Link href="/compliance" className="hover:text-paper">
                  Compliance
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
