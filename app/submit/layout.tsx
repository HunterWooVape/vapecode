import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a Code",
  description: "Submit a wholesale vape discount code or source for review.",
  alternates: {
    canonical: "/submit",
  },
};

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
