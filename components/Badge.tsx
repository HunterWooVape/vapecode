import type { OfferConfidence } from "@/lib/types";

const styles: Record<OfferConfidence, string> = {
  verified: "bg-leaf text-white",
  official: "bg-mint text-leaf",
  reported: "bg-wheat text-ink",
  expired: "bg-ink/10 text-ink/60"
};

const labels: Record<OfferConfidence, string> = {
  verified: "Verified",
  official: "Official",
  reported: "Reported",
  expired: "Expired"
};

export function Badge({ confidence }: { confidence: OfferConfidence }) {
  return (
    <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-bold ${styles[confidence]}`}>
      {labels[confidence]}
    </span>
  );
}
