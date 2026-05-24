import fs from "node:fs/promises";
import path from "node:path";

const inputPath = path.resolve("data/research/serp-urls.json");
const outputPath = path.resolve("data/research/serp-coupon-analysis.json");
const offersOutputPath = path.resolve("data/research/serp-offers.import.json");

const { records } = JSON.parse(await fs.readFile(inputPath, "utf8"));

const couponDomains = new Set([
  "mimoni.com",
  "dontpayfull.com",
  "couponbirds.com",
  "reediscount.com",
  "worthepenny.com",
  "valuecom.com",
  "couponsip.com",
  "hotdeals.com",
  "savingheist.com",
  "shipthedeal.com",
  "knoji.com",
  "couponchief.com",
  "extrabux.com",
  "promopro.com",
  "i-funbox.com",
  "retailmenot.com",
  "cannabispromocodes.com",
  "simplycodes.com",
  "bunnycoupon.com",
  "coupons.com"
]);

const blockedCodeWords = new Set([
  "VAPE",
  "VAPES",
  "WHOLESALE",
  "DISCOUNT",
  "COUPON",
  "COUPONS",
  "PROMO",
  "PROMOS",
  "CODE",
  "CODES",
  "SAVE",
  "SAVING",
  "DEALS",
  "HTTPS",
  "HTTP",
  "WWW",
  "HTML",
  "JSON",
  "EMAIL",
  "LOGIN",
  "SIGNUP",
  "REWARD",
  "REWARDS",
  "SHIPPING",
  "OFFICIAL",
  "VERIFY",
  "VERIFIED",
  "EXPIRED",
  "ACTIVE"
]);

const pages = [];

for (const record of records) {
  const page = await analyzeRecord(record);
  pages.push(page);
  console.log(
    `${String(record.position).padStart(3, " ")} ${page.status.padEnd(9)} ${page.relevance.padEnd(6)} ${record.url}`
  );
}

const offers = pages.flatMap(pageToOffers);

const analysis = {
  analyzedAt: new Date().toISOString(),
  sourceFile: inputPath,
  totals: {
    serpUrls: records.length,
    fetched: pages.filter((page) => page.status === "fetched").length,
    failed: pages.filter((page) => page.status !== "fetched").length,
    highRelevance: pages.filter((page) => page.relevance === "high").length,
    mediumRelevance: pages.filter((page) => page.relevance === "medium").length,
    lowRelevance: pages.filter((page) => page.relevance === "low").length,
    importableOffers: offers.length
  },
  pages,
  offers
};

await fs.writeFile(outputPath, JSON.stringify(analysis, null, 2));
await fs.writeFile(offersOutputPath, JSON.stringify(offers, null, 2));

console.log(JSON.stringify(analysis.totals, null, 2));
console.log(`Wrote ${outputPath}`);
console.log(`Wrote ${offersOutputPath}`);

async function analyzeRecord(record) {
  const page = {
    ...record,
    status: "pending",
    httpStatus: null,
    finalUrl: record.url,
    title: "",
    metaDescription: "",
    relevance: "low",
    sourceType: sourceTypeFor(record.domain),
    targetMerchant: inferMerchant(record.url),
    detectedCodes: [],
    detectedOffers: [],
    notes: []
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(record.url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9"
      }
    });
    clearTimeout(timeout);
    page.httpStatus = response.status;
    page.finalUrl = response.url;
    const contentType = response.headers.get("content-type") ?? "";
    if (!response.ok) {
      page.status = "failed";
      page.notes.push(`HTTP ${response.status}`);
      return page;
    }
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      page.status = "skipped";
      page.notes.push(`Unsupported content-type: ${contentType}`);
      return page;
    }
    const html = await response.text();
    const text = htmlToText(html);
    page.title = extractTitle(html);
    page.metaDescription = extractMetaDescription(html);
    page.relevance = scoreRelevance(`${record.url} ${page.title} ${page.metaDescription} ${text.slice(0, 5000)}`);
    page.detectedCodes = detectCodes(html, text);
    page.detectedOffers = detectOfferPhrases(text);
    page.status = "fetched";
    if (!page.detectedCodes.length && !page.detectedOffers.length) {
      page.notes.push("No coupon code or offer phrase detected from static HTML.");
    }
    return page;
  } catch (error) {
    page.status = "failed";
    page.notes.push(error instanceof Error ? error.message : String(error));
    return page;
  }
}

function sourceTypeFor(domain) {
  if (domain === "vapewholesaleusa.com") return "official";
  if (couponDomains.has(domain)) return "coupon_site";
  if (domain.includes("reddit.com")) return "community";
  return "semrush_backlink";
}

function inferMerchant(url) {
  const lower = url.toLowerCase();
  if (lower.includes("vapewholesaleusa") || lower.includes("vape-wholesale-usa")) {
    return {
      id: "vape-wholesale-usa",
      name: "Vape Wholesale USA",
      domain: "vapewholesaleusa.com"
    };
  }
  if (lower.includes("wholesalevapes")) {
    return {
      id: "wholesale-vapes",
      name: "Wholesale Vapes",
      domain: "wholesalevapes.valuecom.com"
    };
  }
  if (lower.includes("vapesdirectwholesale")) {
    return {
      id: "vapes-direct-wholesale",
      name: "Vapes Direct Wholesale",
      domain: "vapesdirectwholesale.worthepenny.com"
    };
  }
  return {
    id: "unknown",
    name: "Unknown merchant",
    domain: ""
  };
}

function scoreRelevance(content) {
  const lower = content.toLowerCase();
  if (
    lower.includes("vape wholesale usa") ||
    lower.includes("vapewholesaleusa") ||
    lower.includes("vape-wholesale-usa")
  ) {
    return "high";
  }
  if (
    lower.includes("vape wholesale") ||
    lower.includes("wholesale vape") ||
    lower.includes("bulk vape") ||
    lower.includes("vape distributor")
  ) {
    return "medium";
  }
  return "low";
}

function pageToOffers(page) {
  if (page.status !== "fetched") return [];
  if (page.relevance === "low") return [];
  if (!page.detectedCodes.length && !page.detectedOffers.length) return [];

  const merchant = page.targetMerchant.id === "unknown" ? inferMerchantFromTitle(page) : page.targetMerchant;
  const sourceType = page.sourceType;
  const confidence = sourceType === "official" ? "official" : "reported";
  const codes = page.detectedCodes.length ? page.detectedCodes : [null];

  return codes.slice(0, 8).map((code, index) => ({
    id: stableId(`${page.domain}-${page.position}-${code ?? "deal"}-${index}`),
    merchantId: merchant.id,
    merchantName: merchant.name,
    merchantDomain: merchant.domain,
    offerType: code ? "coupon_code" : inferOfferType(page.detectedOffers[0] ?? ""),
    code,
    title: code ? `${merchant.name} reported coupon code ${code}` : `${merchant.name} reported wholesale deal`,
    description: page.detectedOffers.slice(0, 3).join("; ") || "Reported coupon/deal signal detected from SERP page.",
    discountValue: page.detectedOffers[0] ?? "Reported deal",
    minimumOrderValue: null,
    applicableProducts: "Unknown",
    sourceUrl: page.url,
    sourceDomain: page.domain,
    sourceType,
    confidence,
    lastCheckedAt: "2026-05-22",
    expiresAt: null,
    requiresAccount: true,
    requiresLicense: true,
    stackable: null,
    stateRestrictions: "Unknown",
    serpPosition: page.position,
    relevance: page.relevance,
    internalNotes:
      "Imported from SERP source analysis. Keep as reported until official merchant page or checkout verification confirms it."
  }));
}

function inferMerchantFromTitle(page) {
  const lower = `${page.title} ${page.url}`.toLowerCase();
  if (lower.includes("vape wholesale usa") || lower.includes("vapewholesaleusa")) {
    return {
      id: "vape-wholesale-usa",
      name: "Vape Wholesale USA",
      domain: "vapewholesaleusa.com"
    };
  }
  if (lower.includes("vapes direct wholesale")) {
    return {
      id: "vapes-direct-wholesale",
      name: "Vapes Direct Wholesale",
      domain: "vapesdirectwholesale.com"
    };
  }
  if (lower.includes("wholesale vapes")) {
    return {
      id: "wholesale-vapes",
      name: "Wholesale Vapes",
      domain: "wholesalevapes.com"
    };
  }
  return {
    id: "unknown",
    name: "Unknown merchant",
    domain: ""
  };
}

function inferOfferType(text) {
  const lower = text.toLowerCase();
  if (lower.includes("free shipping")) return "free_shipping";
  if (lower.includes("reward") || lower.includes("points")) return "reward";
  return "sale";
}

function detectCodes(html, text) {
  const contexts = [];
  const source = `${html}\n${text}`;
  const contextRegex = /(?:coupon|promo|discount|code|voucher|deal|copy|clipboard|data-code|couponcode|coupon_code)[\s\S]{0,180}/gi;
  let match;
  while ((match = contextRegex.exec(source)) && contexts.length < 200) {
    contexts.push(match[0]);
  }
  const codeRegex = /\b[A-Z0-9][A-Z0-9_-]{4,24}\b/g;
  const candidates = new Map();
  for (const context of contexts) {
    const upper = context.toUpperCase();
    const matches = upper.match(codeRegex) ?? [];
    for (const candidate of matches) {
      const clean = candidate.replace(/^CODE[:_-]?/, "");
      if (blockedCodeWords.has(clean)) continue;
      if (/^\d+$/.test(clean)) continue;
      if (!/[0-9]/.test(clean) && !/(SAVE|OFF|SHIP|DEAL|WELCOME|NEW|FIRST|BULK|WHOLE|VAPE)/.test(clean)) continue;
      candidates.set(clean, (candidates.get(clean) ?? 0) + 1);
    }
  }
  return Array.from(candidates.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([code]) => code)
    .slice(0, 12);
}

function detectOfferPhrases(text) {
  const normalized = text.replace(/\s+/g, " ");
  const phrases = new Set();
  const offerRegex =
    /\b(?:up to\s+)?(?:\d{1,2}%\s*(?:off|discount)|save\s+\d{1,2}%|\$\s?\d{1,4}\s*off|free shipping|reward points?|store credit|clearance sale|bulk discount|wholesale deal|exclusive discount)\b/gi;
  let match;
  while ((match = offerRegex.exec(normalized)) && phrases.size < 20) {
    phrases.add(toSentenceCase(match[0]));
  }
  return Array.from(phrases);
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return cleanText(match?.[1] ?? "");
}

function extractMetaDescription(html) {
  const match = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i);
  return cleanText(match?.[1] ?? "");
}

function htmlToText(html) {
  return cleanText(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
  );
}

function cleanText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function toSentenceCase(value) {
  const text = cleanText(value);
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function stableId(value) {
  return value
    .toLowerCase()
    .replace(/https?:\/\//g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}
