"use client";

import { Upload } from "lucide-react";
import { useMemo, useState } from "react";
import { analyzeSemrushCsv } from "@/lib/csv";

const exampleCsv = `Source URL,Title,Anchor,Target URL
https://coupon-example.com/vapewholesaleusa,Best Vape Wholesale USA coupon codes,SAVE10 vape wholesale promo code,https://www.vapewholesaleusa.com
https://blog-example.com/bulk-vape-deals,Wholesale vape free shipping deals,free shipping discount,https://www.vapewholesaleusa.com
https://directory-example.com/vendors,Vape wholesale distributor profile,Vape Wholesale USA,https://www.vapewholesaleusa.com`;

export function CsvImporter() {
  const [csv, setCsv] = useState(exampleCsv);
  const analyzed = useMemo(() => analyzeSemrushCsv(csv), [csv]);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setCsv(await file.text());
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-bold uppercase text-leaf">
            <Upload size={18} aria-hidden="true" />
            SEMrush CSV
          </p>
          <h1 className="mt-2 text-4xl font-bold text-ink">Import and score backlink coupon leads</h1>
          <p className="mt-3 text-sm leading-6 text-ink/70">
            Paste or upload a Backlink Analytics export. The MVP scores source pages by coupon intent keywords and
            extracts potential codes for manual review.
          </p>
          <label className="mt-5 inline-flex w-fit rounded-md bg-leaf px-4 py-3 text-sm font-bold text-white transition hover:bg-ink">
            Upload CSV
            <input
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              onChange={(event) => handleFile(event.target.files?.[0])}
            />
          </label>
        </div>
        <textarea
          value={csv}
          onChange={(event) => setCsv(event.target.value)}
          rows={12}
          className="focus-ring min-h-72 rounded-lg border border-ink/15 bg-white p-4 font-mono text-xs leading-5 shadow-soft"
          aria-label="CSV input"
        />
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-ink/10 bg-white shadow-soft">
        <div className="border-b border-ink/10 px-4 py-3">
          <p className="font-bold text-ink">{analyzed.length} coupon-intent source pages found</p>
          <p className="mt-1 text-sm text-ink/60">Rows with score 2+ should enter the manual review queue first.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[880px] w-full text-left text-sm">
            <thead className="bg-ink text-paper">
              <tr>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Title / Anchor</th>
                <th className="px-4 py-3">Detected Codes</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {analyzed.map((page) => (
                <tr key={`${page.sourceUrl}-${page.anchorText}`} className="border-t border-ink/10 align-top">
                  <td className="px-4 py-4 font-bold text-leaf">{page.score}</td>
                  <td className="max-w-xs px-4 py-4">
                    <a href={page.sourceUrl} target="_blank" rel="noreferrer" className="font-semibold text-ink">
                      {page.sourceDomain || page.sourceUrl}
                    </a>
                    <p className="mt-1 break-all text-xs text-ink/50">{page.targetUrl}</p>
                  </td>
                  <td className="max-w-sm px-4 py-4">
                    <p className="font-semibold text-ink">{page.title || "Untitled"}</p>
                    <p className="mt-1 text-xs text-ink/60">{page.anchorText || "No anchor"}</p>
                  </td>
                  <td className="px-4 py-4">
                    {page.detectedCodes.length ? page.detectedCodes.join(", ") : <span className="text-ink/45">None</span>}
                  </td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-mint px-2.5 py-1 text-xs font-bold capitalize text-leaf">
                      {page.status.replace("_", " ")}
                    </span>
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
