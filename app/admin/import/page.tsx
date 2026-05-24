import type { Metadata } from "next";
import { CsvImporter } from "@/components/CsvImporter";

export const metadata: Metadata = {
  title: "SEMrush CSV Import",
  description: "Import SEMrush backlink CSV exports and score coupon-intent source pages."
};

export default function ImportPage() {
  return (
    <main>
      <CsvImporter />
    </main>
  );
}
