export type ImportedSourcePage = {
  sourceUrl: string;
  sourceDomain: string;
  title: string;
  anchorText: string;
  targetUrl: string;
  detectedCodes: string[];
  score: number;
  status: "new" | "needs_review";
};

const couponKeywords = [
  "coupon",
  "promo",
  "discount",
  "deal",
  "code",
  "free shipping",
  "sale",
  "reward",
  "affiliate"
];

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let current = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(current.trim());
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }
      row.push(current.trim());
      if (row.some(Boolean)) {
        rows.push(row);
      }
      current = "";
      row = [];
      continue;
    }

    current += char;
  }

  row.push(current.trim());
  if (row.some(Boolean)) {
    rows.push(row);
  }

  return rows;
}

export function analyzeSemrushCsv(text: string): ImportedSourcePage[] {
  const rows = parseCsv(text);
  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map((header) => header.toLowerCase());
  const indexFor = (...names: string[]) =>
    headers.findIndex((header) => names.some((name) => header.includes(name)));

  const sourceUrlIndex = indexFor("source url", "referring page", "page url", "url");
  const titleIndex = indexFor("title");
  const anchorIndex = indexFor("anchor");
  const targetIndex = indexFor("target url", "target");

  return rows
    .slice(1)
    .map((row) => {
      const sourceUrl = read(row, sourceUrlIndex);
      const title = read(row, titleIndex);
      const anchorText = read(row, anchorIndex);
      const targetUrl = read(row, targetIndex);
      const combined = `${sourceUrl} ${title} ${anchorText}`.toLowerCase();
      const score = couponKeywords.reduce((total, keyword) => {
        return total + (combined.includes(keyword) ? 1 : 0);
      }, 0);

      return {
        sourceUrl,
        sourceDomain: getDomain(sourceUrl),
        title,
        anchorText,
        targetUrl,
        detectedCodes: detectCodes(`${title} ${anchorText} ${sourceUrl}`),
        score,
        status: score >= 2 ? "needs_review" : "new"
      } satisfies ImportedSourcePage;
    })
    .filter((page) => page.sourceUrl && page.score > 0)
    .sort((a, b) => b.score - a.score);
}

function detectCodes(text: string): string[] {
  const matches = text.match(/\b[A-Z0-9][A-Z0-9_-]{4,18}\b/gi) ?? [];
  const blocked = new Set(["HTTPS", "HTTP", "WWW", "COUPON", "DISCOUNT", "PROMO", "VAPES", "WHOLESALE"]);
  return Array.from(
    new Set(
      matches
        .map((match) => match.toUpperCase())
        .filter((match) => !blocked.has(match) && /[0-9]/.test(match))
    )
  ).slice(0, 5);
}

function read(row: string[], index: number) {
  return index >= 0 ? row[index] ?? "" : "";
}

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
