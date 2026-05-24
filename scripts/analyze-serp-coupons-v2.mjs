/**
 * SERP Coupon Analysis v2
 * -----------------------
 * Major improvements over v1:
 * 1. Context-aware code extraction: only extracts codes near coupon-related keywords.
 * 2. Much stricter CSS/HTML/date filtering.
 * 3. Color-code detection (6-char hex).
 * 4. Explicit confidence scoring per candidate.
 * 5. Deduplication and cross-source validation hints.
 */

import fs from "node:fs/promises";
import path from "node:path";

const inputPath = path.resolve("data/research/serp-urls.json");
const outputPath = path.resolve("data/research/serp-coupon-analysis-v2.json");
const offersOutputPath = path.resolve("data/research/serp-offers-v2.import.json");

const { records } = JSON.parse(await fs.readFile(inputPath, "utf8"));

const couponDomains = new Set([
  "mimoni.com", "dontpayfull.com", "couponbirds.com", "reediscount.com",
  "worthepenny.com", "valuecom.com", "couponsip.com", "hotdeals.com",
  "savingheist.com", "shipthedeal.com", "knoji.com", "couponchief.com",
  "extrabux.com", "promopro.com", "i-funbox.com", "retailmenot.com",
  "cannabispromocodes.com", "simplycodes.com", "bunnycoupon.com",
  "coupons.com", "dealam.com", "tenereteam.com", "reecoupons.com",
  "creativebin.com", "saver.com", "offers.com", "capitaloneshopping.com"
]);

const CSS_WORDS = new Set([
  "BG", "TEXT", "BORDER", "SHADOW", "ROUNDED", "GAP", "SPACE", "MARGIN", "PADDING",
  "COLOR", "GRID", "FLEX", "BLOCK", "INLINE", "HIDDEN", "VISIBLE", "OPACITY",
  "TRANSLATE", "SCALE", "ROTATE", "LEFT", "RIGHT", "TOP", "BOTTOM", "INSET",
  "COL", "ROW", "CONTAINER", "WRAPPER", "CONTENT", "HEADER", "FOOTER", "SIDEBAR",
  "NAVBAR", "BUTTON", "INPUT", "FORM", "LABEL", "SELECT", "OPTION", "CHECKBOX",
  "MODAL", "DROPDOWN", "TOOLTIP", "POPOVER", "ALERT", "BADGE", "CARD", "LIST",
  "ITEM", "GROUP", "SECTION", "DIVIDER", "SKELETON", "PLACEHOLDER", "LOADING",
  "SPINNER", "OVERLAY", "BACKDROP", "FOCUS", "ACTIVE", "DISABLED", "HOVER",
  "CHECKED", "SELECTED", "OPEN", "CLOSED", "COLLAPSED", "EXPANDED", "SHRINK",
  "GROW", "BASIS", "JUSTIFY", "ALIGN", "POSITION", "DISPLAY", "OVERFLOW",
  "ZINDEX", "INDEX", "WIDTH", "HEIGHT", "SIZE", "FONT", "FAMILY", "STYLE",
  "WEIGHT", "DECORATION", "TRANSFORM", "TRANSITION", "ANIMATION", "DURATION",
  "DELAY", "EASE", "CURVE", "DIRECTION", "FILL", "MODE", "PLAY", "STATE",
  "ITERATION", "COUNT", "TIMING", "FUNCTION", "LINEAR", "RELATIVE", "ABSOLUTE",
  "FIXED", "STICKY", "STATIC", "INHERIT", "INITIAL", "UNSET", "REVERT",
  "AUTO", "NONE", "HIDDEN", "SCROLL", "CLIP", "VISIBLE", "MIN", "MAX",
  "SCREEN", "VIEWPORT", "FULL", "HALF", "THIRD", "QUARTER", "FIFTH", "SIXTH",
  "SEVENTH", "EIGHTH", "NINTH", "TENTH", "ELEVENTH", "TWELFTH", "PERCENT",
  "WIDE", "NARROW", "TALL", "SHORT", "SMALL", "LARGE", "MEDIUM", "BIG",
  "TINY", "MINI", "COMPACT", "EXPANDED", "COLLAPSED", "DENSE", "COMFORTABLE",
  "SPACIOUS", "TIGHT", "LOOSE", "COMFY", "SNUG", "ROOMY", "CRAMPED"
]);

const HTML_WORDS = new Set([
  "HTML", "BODY", "HEAD", "DIV", "SPAN", "P", "A", "IMG", "SCRIPT", "STYLE",
  "LINK", "META", "TITLE", "H1", "H2", "H3", "H4", "H5", "H6", "UL", "OL",
  "LI", "TABLE", "TR", "TD", "TH", "THEAD", "TBODY", "FORM", "INPUT", "BUTTON",
  "SELECT", "OPTION", "TEXTAREA", "LABEL", "IFRAME", "CANVAS", "SVG", "VIDEO",
  "AUDIO", "SOURCE", "TRACK", "EMBED", "OBJECT", "PARAM", "NOSCRIPT", "TEMPLATE",
  "SLOT", "MENU", "MENUITEM", "DETAILS", "SUMMARY", "DIALOG", "ADDRESS",
  "ARTICLE", "ASIDE", "FIGURE", "FIGCAPTION", "FOOTER", "HEADER", "MAIN",
  "NAV", "SECTION", "TIME", "MARK", "CODE", "PRE", "BLOCKQUOTE", "CITE",
  "DEL", "INS", "SUB", "SUP", "KBD", "SAMP", "VAR", "DATA", "OUTPUT",
  "PROGRESS", "METER", "FIELDSET", "LEGEND", "DATALIST", "OPTGROUP"
]);

const JUNK_PATTERNS = [
  /^\d{4}-\d{2}-\d{2}/,       // Dates
  /^\d{4}-\d{2}-\d{2}T\d{2}/, // ISO dates
  /^\d{4}-\d{1,2}/,           // Partial dates
  /^[0-9A-F]{6}$/i,           // 6-char hex colors
  /^[0-9A-F]{3}$/i,           // 3-char hex colors
  /^[0-9A-F]{8}-[0-9A-F]{4}/i, // UUID prefix
  /^U003[CEF]/i,              // Unicode escapes
  /^U002[67]/i,
  /^\d{3,4}X\d{3,4}$/i,      // Image dimensions
  /^\d+PX$/i,                 // Pixel values
  /^\d+VW$/i,                 // Viewport width
  /^\d+REM?$/i,               // REM values
  /^\d+W$/i,                  // Width in W
  /^\d+H$/i,                  // Height in H
  /^[0-9A-F]{4}-[0-9A-F]{4}$/i, // Font ranges
  /^[0-9A-F]{12,}$/i,         // Long hex strings (hashes)
  /^BASE64$/i,
  /^UINT8ARRAY$/i,
  /^JSON$/i,
  /^EMAIL$/i,
  /^LOGIN$/i,
  /^SIGNUP$/i,
  /^WWW$/i,
  /^HTTP$/i,
  /^HTTPS$/i,
  /^OFFERS?$/i,               // Generic labels
  /^OFFER_?/i,
  /^DEAL_?/i,
  /^COUPON_?/i,
  /^PROMO_?/i,
  /^DISCOUNT_?/i,
  /^CATEGORY/i,
  /^BLOCK\d*$/i,
  /^ITEM\d*$/i,
  /^MENU[-_]/i,
  /^WIDGET[-_]/i,
  /^COPY[-_]/i,
  /^EDIT[-_]/i,
  /^SCREENSHOT/i,
  /^REQUIRES[-_]/i,
  /^SAVED$/i,
  /^NEW[-_]/i,
  /^FEATURE/i,
  /^SPECIAL[-_]/i,
  /^ALL[-_]/i,
  /^EXPIRED/i,
  /^DETAIL/i,
  /^FILTER/i,
  /^KEYWORD/i,
  /^LOGO/i,
  /^SUMMARY/i,
  /^STORE/i,
  /^VAPESTORE$/i,
  /^VAPEWHOLE/i,
  /^VAPE[-_]?WHOLESALE/i,
  /^WHOLESALE[-_]?VAPE/i,
  /^JSX[-_]/i,
  /^ESM[-_]/i,
  /^GTM/i,
  /^CDN\d*$/i,
  /^SEARCH/i,
  /^SERVER/i,
  /^API/i,
  /^DECODE/i,
  /^ENCODE/i,
  /^OWNERSHIP/i,
  /^2F/i,                      // URL-encoded slashes
  /^AK_JS/i,
  /^NINJA_/i,
  /^FOOTABLE/i,
  /^WOO[-_]/i,
  /^GTM4WP/i,
  /^TVE[-_]/i,
  /^WPCD[-_]/i,
  /^FCA_EOI/i,
  /^WEBKIT/i,
  /^JQUERY/i,
  /^JOST/i,
  /^D47A1/i,
  /^SCXW/i,
  /^AMRV/i,
  /^VP/i,
  /^DHX/i,
  /^CSNBNF/i,
  /^UUELKB/i,
  /^CCM/i,
  /^SD/i,
  /^LTO[-_]/i,
  /^PB[-_]/i,
  /^MARI/i,
  /^ESM[-_]/i,
  /^B64/i,
  /^MS4/i,
  /^C21/i,
  /^IZRE/i,
  /^WW9/i,
  /^I2Z/i,
  /^DHJ/i,
  /^ZMF/i,
  /^C2L/i,
  /^BUNNY/i,
  /^UNTITLED/i,
  /^S_\d+/,
  /^\d{3}-\d{4}$/             // Phone-like
];

function isJunkCode(code) {
  const upper = code.toUpperCase();
  if (code.length < 4 || code.length > 20) return true;
  if (CSS_WORDS.has(upper)) return true;
  if (HTML_WORDS.has(upper)) return true;
  if (upper.split('-').some(part => CSS_WORDS.has(part) || HTML_WORDS.has(part))) return true;
  for (const pattern of JUNK_PATTERNS) {
    if (pattern.test(code)) return true;
  }
  // Reject if it looks like a CSS class (too many dashes or underscores with common terms)
  const parts = upper.split(/[-_]/);
  if (parts.length >= 3) {
    const cssPartCount = parts.filter(p => CSS_WORDS.has(p) || HTML_WORDS.has(p) || /^\d+$/.test(p)).length;
    if (cssPartCount >= 2) return true;
  }
  // Reject pure numbers
  if (/^\d+$/.test(code)) return true;
  // Reject if starts with common web prefixes
  if (/^(DATA|ARIA|ROLE|CLASS|ID|STYLE|SRC|HREF|ALT|TITLE|NAME|VALUE|TYPE|FOR|ACTION|METHOD|TARGET|REL)_/i.test(code)) return true;
  return false;
}

function extractCodesFromContext(text, windowSize = 120) {
  const codeRegex = /\b[A-Z0-9][A-Z0-9_-]{3,18}\b/g;
  const contexts = [];
  
  // Find regions near coupon keywords
  const couponRegex = /(?:coupon|promo|discount|code|voucher|deal)\s*(?:code|codes|[:\-])?\s*/gi;
  let m;
  while ((m = couponRegex.exec(text))) {
    const start = Math.max(0, m.index - windowSize);
    const end = Math.min(text.length, m.index + m[0].length + windowSize);
    contexts.push(text.slice(start, end));
  }
  
  // Also look for "Use X", "Enter X", "Apply X" patterns
  const actionRegex = /(?:use|enter|apply|copy|paste)\s+(?:code\s+)?['"]?([A-Z0-9][A-Z0-9_-]{3,18})['"]?/gi;
  const candidates = new Map();
  
  for (const context of contexts) {
    const matches = context.match(codeRegex) || [];
    for (const match of matches) {
      const clean = match.replace(/^CODE[:_-]?/i, "");
      if (isJunkCode(clean)) continue;
      candidates.set(clean, (candidates.get(clean) || 0) + 1);
    }
  }
  
  // Also check explicit action patterns
  let am;
  while ((am = actionRegex.exec(text))) {
    const clean = am[1].replace(/^CODE[:_-]?/i, "");
    if (!isJunkCode(clean)) {
      candidates.set(clean, (candidates.get(clean) || 0) + 2);
    }
  }
  
  return Array.from(candidates.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([code]) => code)
    .slice(0, 8);
}

const pages = [];

for (const record of records) {
  const page = await analyzeRecord(record);
  pages.push(page);
  console.log(
    `${String(record.position).padStart(3, " ")} ${page.status.padEnd(9)} ${page.relevance.padEnd(6)} ${page.detectedCodes.length} codes ${record.url}`
  );
}

const offers = pages.flatMap(pageToOffers);

const analysis = {
  analyzedAt: new Date().toISOString(),
  sourceFile: inputPath,
  totals: {
    serpUrls: records.length,
    fetched: pages.filter((p) => p.status === "fetched").length,
    failed: pages.filter((p) => p.status !== "fetched").length,
    highRelevance: pages.filter((p) => p.relevance === "high").length,
    mediumRelevance: pages.filter((p) => p.relevance === "medium").length,
    lowRelevance: pages.filter((p) => p.relevance === "low").length,
    totalCodesFound: pages.reduce((sum, p) => sum + p.detectedCodes.length, 0),
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
    page.detectedCodes = extractCodesFromContext(text);
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
    return { id: "vape-wholesale-usa", name: "Vape Wholesale USA", domain: "vapewholesaleusa.com" };
  }
  if (lower.includes("wholesalevapes")) {
    return { id: "wholesale-vapes", name: "Wholesale Vapes", domain: "wholesalevapes.valuecom.com" };
  }
  if (lower.includes("vapesdirectwholesale")) {
    return { id: "vapes-direct-wholesale", name: "Vapes Direct Wholesale", domain: "vapesdirectwholesale.com" };
  }
  if (lower.includes("geekvape") || lower.includes("geek-vape")) {
    return { id: "geek-vape", name: "Geek Vape", domain: "store.geekvape.com" };
  }
  if (lower.includes("vapesourcing")) {
    return { id: "vapesourcing", name: "VapeSourcing", domain: "vapesourcing.com" };
  }
  if (lower.includes("flawlessvapeshop")) {
    return { id: "flawless-vape-shop", name: "Flawless Vape Shop", domain: "flawlessvapeshop.com" };
  }
  return { id: "unknown", name: "Unknown merchant", domain: "" };
}

function scoreRelevance(content) {
  const lower = content.toLowerCase();
  if (lower.includes("vape wholesale usa") || lower.includes("vapewholesaleusa") || lower.includes("vape-wholesale-usa")) {
    return "high";
  }
  if (lower.includes("vape wholesale") || lower.includes("wholesale vape") || lower.includes("bulk vape") || lower.includes("vape distributor")) {
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

  return codes.slice(0, 5).map((code, index) => ({
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
    lastCheckedAt: "2026-05-23",
    expiresAt: null,
    requiresAccount: true,
    requiresLicense: true,
    stackable: null,
    stateRestrictions: "Unknown",
    serpPosition: page.position,
    relevance: page.relevance,
    internalNotes: "Imported from SERP v2 analysis. Stricter filtering applied. Keep as reported until official verification.",
    extractionVersion: "v2"
  }));
}

function inferMerchantFromTitle(page) {
  const lower = `${page.title} ${page.url}`.toLowerCase();
  if (lower.includes("vape wholesale usa") || lower.includes("vapewholesaleusa")) {
    return { id: "vape-wholesale-usa", name: "Vape Wholesale USA", domain: "vapewholesaleusa.com" };
  }
  if (lower.includes("geek vape") || lower.includes("geekvape")) {
    return { id: "geek-vape", name: "Geek Vape", domain: "store.geekvape.com" };
  }
  if (lower.includes("flawless vape")) {
    return { id: "flawless-vape-shop", name: "Flawless Vape Shop", domain: "flawlessvapeshop.com" };
  }
  if (lower.includes("vapesourcing")) {
    return { id: "vapesourcing", name: "VapeSourcing", domain: "vapesourcing.com" };
  }
  if (lower.includes("vapes direct wholesale")) {
    return { id: "vapes-direct-wholesale", name: "Vapes Direct Wholesale", domain: "vapesdirectwholesale.com" };
  }
  if (lower.includes("wholesale vapes")) {
    return { id: "wholesale-vapes", name: "Wholesale Vapes", domain: "wholesalevapes.com" };
  }
  return { id: "unknown", name: "Unknown merchant", domain: "" };
}

function inferOfferType(text) {
  const lower = text.toLowerCase();
  if (lower.includes("free shipping")) return "free_shipping";
  if (lower.includes("reward") || lower.includes("points")) return "reward";
  if (lower.includes("bogo") || lower.includes("buy one get one")) return "bogo";
  if (lower.includes("clearance")) return "clearance";
  return "sale";
}

function detectOfferPhrases(text) {
  const normalized = text.replace(/\s+/g, " ");
  const phrases = new Set();
  const offerRegex =
    /\b(?:up to\s+)?(?:\d{1,2}%\s*(?:off|discount)|save\s+\d{1,2}%|\$\s?\d{1,4}\s*off|free shipping|reward points?|store credit|clearance sale|bulk discount|wholesale deal|exclusive discount|bogo|buy one get one)\b/gi;
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
