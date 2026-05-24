import type { MetadataRoute } from "next";

const baseUrl = "https://vapekeys.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "/vape-wholesale-usa-discount-code",
    "/vape-wholesale-coupon-code",
    "/bulk-vape-discount-code",
    "/wholesale-vape-supplies-coupon",
    "/vape-distributor-coupon-code",
    "/vape-wholesale-free-shipping-code",
    "/stores/vape-wholesale-usa",
    "/about",
    "/submit",
    "/compliance",
    "/privacy"
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date("2026-05-23"),
    changeFrequency: "weekly",
    priority: path === "/vape-wholesale-usa-discount-code" ? 1 : 0.6
  }));
}
