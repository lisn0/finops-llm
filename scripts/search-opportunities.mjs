import { parseArgs } from "node:util";
import { BASE, GSC_SITE, fetchSitemapUrls, googleAccessToken, googleCall, serviceAccount } from "./post-publish-search.mjs";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    end: { type: "string" },
    limit: { type: "string", default: "10" },
    locale: { type: "string" },
    help: { type: "boolean" },
  },
});

async function main() {
  if (values.help) {
    console.log("npm run report:search -- [--end YYYY-MM-DD] [--limit 1-25] [--locale en|de|…] [/research/example ...]");
    return;
  }
  const day = (date, offset) => new Date(Date.parse(date) + offset * 86400000).toISOString().slice(0, 10);
  const todayPacific = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
  const end = values.end ?? day(todayPacific, -3);
  const limit = Number(values.limit);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(end) || !Number.isFinite(Date.parse(end)) || day(end, 0) !== end || end >= todayPacific) {
    throw new Error("--end must be a past YYYY-MM-DD date in Search Console's Pacific time zone.");
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > 25 || positionals.length > 10) {
    throw new Error("Use --limit 1–25 and up to 10 explicit URLs to inspect.");
  }
  if (values.locale && !/^[a-z]{2}$/.test(values.locale)) throw new Error("--locale must be a two-letter site language.");
  const inspectedUrls = [...new Set(positionals.map((value) => {
    const url = new URL(value, BASE);
    if (url.origin !== BASE || url.username || url.password || url.search || url.hash) throw new Error("Inspection URLs must be clean FinOpsLLM URLs.");
    return url.href.replace(/\/$/, "");
  }))];
  const recent = { startDate: day(end, -27), endDate: end };
  const prior = { startDate: day(end, -55), endDate: day(end, -28) };
  const account = serviceAccount();
  if (!account) throw new Error("Set GSC_SA_KEY or GSC_SA_KEY_FILE to read Search Console.");
  const token = await googleAccessToken(account, "https://www.googleapis.com/auth/webmasters.readonly");
  const searchUrl = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE)}/searchAnalytics/query`;
  const inspectUrl = "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect";
  async function post(url, payload) {
    const { response, body } = await googleCall(token, url, {
      method: "POST", signal: AbortSignal.timeout(25000), body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Search Console HTTP ${response.status}: ${body.error?.message ?? "request failed"}`);
    return body;
  }
  async function analytics(window, dimension, page) {
    const rowLimit = 25000;
    const rows = [];
    for (let startRow = 0; startRow < 50000; startRow += rowLimit) {
      const result = await post(searchUrl, {
        ...window, type: "web", dataState: "final", dimensions: [dimension], rowLimit, startRow,
        ...(page && { dimensionFilterGroups: [{ filters: [{ dimension: "page", operator: "equals", expression: page }] }] }),
      });
      const batch = result.rows ?? [];
      rows.push(...batch);
      if (batch.length < rowLimit) return rows;
    }
    throw new Error("Search Analytics reached the report's 50,000-row limit.");
  }
  const [sitemap, latest, previous] = await Promise.all([
    fetchSitemapUrls(), analytics(recent, "page"), analytics(prior, "page"),
  ]);
  if (!latest.length || !previous.length) throw new Error("A comparison window returned no final page rows. Try an earlier --end.");
  const metrics = (row) => row ? {
    impressions: row.impressions, clicks: row.clicks, ctr: row.ctr, position: row.position,
  } : null;
  const indexedByPage = (rows) => new Map(rows.map((row) => [row.keys[0].replace(/\/$/, ""), metrics(row)]));
  const current = indexedByPage(latest);
  const comparison = indexedByPage(previous);
  const inventory = [...sitemap].filter((url) => {
    const path = new URL(url).pathname;
    const match = path.match(/^\/(?:(?<locale>[a-z]{2})\/)?research\/[^/]+$/);
    return match && (!values.locale || (match.groups.locale ?? "en") === values.locale);
  }).sort();
  const pages = inventory.map((url) => ({ url, recent: current.get(url) ?? null, prior: comparison.get(url) ?? null }));
  const missed = pages.filter(({ recent: row }) => row && row.impressions >= 100 && row.clicks <= 2 && row.position <= 20)
    .sort((a, b) => b.recent.impressions - a.recent.impressions);
  const low = pages.filter(({ recent: row }) => !row || row.impressions <= 5)
    .sort((a, b) => (b.prior?.impressions ?? 0) - (a.prior?.impressions ?? 0));
  const opportunities = [];
  for (const page of missed.slice(0, limit)) {
    const rows = await analytics(recent, "query", page.url);
    opportunities.push({
      ...page, topQueries: rows.sort((a, b) => b.impressions - a.impressions).slice(0, 5)
        .map((row) => ({ query: row.keys[0], ...metrics(row) })),
    });
  }
  const inspections = [];
  for (const url of inspectedUrls) {
    const result = await post(inspectUrl, { inspectionUrl: url, siteUrl: GSC_SITE });
    const status = result.inspectionResult?.indexStatusResult;
    if (!status) throw new Error(`URL Inspection returned no index status for ${url}.`);
    const { verdict, coverageState, lastCrawlTime, googleCanonical, userCanonical, robotsTxtState, indexingState } = status;
    inspections.push({ url, inSitemap: sitemap.has(url), verdict, coverageState, lastCrawlTime, googleCanonical, userCanonical, robotsTxtState, indexingState });
  }
  console.log(JSON.stringify({
    property: GSC_SITE, generatedAt: new Date().toISOString(), recent, prior, locale: values.locale ?? "all",
    counts: { sitemapResearchPages: inventory.length, missedClicks: missed.length, lowVisibility: low.length, unreportedBothWindows: pages.filter((page) => !page.recent && !page.prior).length },
    missedClicks: opportunities, lowVisibility: low.slice(0, limit), inspections,
    notes: [
      "Web Search, final data. Null means no returned row. Search Console may omit rows and queries.",
      "Missed-click shortlist: at least 100 impressions, at most 2 clicks, average position 20 or better.",
      "Low visibility: at most 5 impressions or no row. Confirm page age, index status and demand before editing.",
      "Shortlists are diagnostic leads. This report does not change or submit URLs.",
    ],
  }, null, 2));
}

main().catch((error) => {
  console.error(`Search opportunities: ${error.message}`);
  process.exitCode = 1;
});
