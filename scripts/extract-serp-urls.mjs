import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath =
  "/Users/dezuo/Downloads/vape-wholesale-usa-discount-cod_serp_urls_us_2026-05-22_00-24-45.xlsx";
const outputDir = path.resolve("data/research");
const outputPath = path.join(outputDir, "serp-urls.json");

const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);
const overview = await workbook.inspect({
  kind: "workbook,sheet,table",
  maxChars: 6000,
  tableMaxRows: 8,
  tableMaxCols: 12,
  tableMaxCellChars: 120
});

const urls = new Map();

for (const sheet of workbook.worksheets.items) {
  const used = sheet.getUsedRange(true);
  if (!used) continue;
  const values = used.values ?? [];
  const headers = (values[0] ?? []).map((header) => String(header ?? "").trim().toLowerCase());
  const urlIndex = headers.indexOf("url");
  const domainIndex = headers.indexOf("domain");
  const positionIndex = headers.indexOf("position");
  const typeIndex = headers.indexOf("type");
  const trafficIndex = headers.indexOf("search traffic");
  const keywordIndex = headers.indexOf("url keywords");

  values.slice(1).forEach((row, rowOffset) => {
    const rawUrl = String(row[urlIndex] ?? "").trim();
    if (!rawUrl) return;
    try {
      const normalized = normalizeUrl(rawUrl);
      urls.set(normalized, {
        position: asNumber(row[positionIndex]),
        type: String(row[typeIndex] ?? ""),
        domain: String(row[domainIndex] ?? new URL(normalized).hostname.replace(/^www\./, "")),
        url: normalized,
        searchTraffic: asNumber(row[trafficIndex]),
        urlKeywords: asNumber(row[keywordIndex]),
        sheet: sheet.name,
        row: rowOffset + 2,
        col: urlIndex + 1
      });
    } catch {
      // Ignore malformed URL-like strings.
    }
  });
}

const records = Array.from(urls.values()).sort((a, b) => (a.position ?? 9999) - (b.position ?? 9999));
await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(outputPath, JSON.stringify({ extractedAt: new Date().toISOString(), records }, null, 2));

console.log(
  JSON.stringify(
    {
      inputPath,
      outputPath,
      urlCount: records.length,
      domains: Array.from(new Set(records.map((record) => record.domain))).slice(0, 30),
      overview: overview.ndjson.slice(0, 2500)
    },
    null,
    2
  )
);

function normalizeUrl(value) {
  const parsed = new URL(value);
  parsed.hash = "";
  return parsed.toString();
}

function asNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}
