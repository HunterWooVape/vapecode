import type { MetadataRoute } from "next";
import { updatedAt } from "@/lib/offers";

const baseUrl = "https://vapekeys.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/vape-wholesale-usa-discount-code",
    "/vape-wholesale-coupon-code",
    "/bulk-vape-discount-code",
    "/wholesale-vape-supplies-coupon",
    "/vape-distributor-coupon-code",
    "/vape-wholesale-free-shipping-code",
    "/stores",
    "/stores/vape-wholesale-usa",
    "/stores/flawless-vape-shop",
    "/stores/vapesourcing",
    "/stores/discount-vape-pen",
    "/about",
    "/submit",
    "/compliance",
    "/privacy"
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(updatedAt),
    changeFrequency: "weekly",
    priority: path === "" || path === "/vape-wholesale-usa-discount-code" ? 1 : 0.6
  }));
}
