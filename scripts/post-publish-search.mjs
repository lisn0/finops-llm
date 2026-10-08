#!/usr/bin/env node
/**
 * Post-publish search handoff for FinOps LLM.
 *
 * Usage after committing content:
 *   node scripts/post-publish-search.mjs --push https://finopsllm.com/research/example
 *
 * Without --push, this waits for URLs from an already-pushed deployment.
 * It confirms each URL is live and listed in the deployed sitemap, submits the
 * sitemap index to Google, inspects URLs in Google Search Console, and notifies
 * Bing through IndexNow. Google inspection reports index state; it does not
 * request or guarantee indexing. Bing sitemap discovery is also wired through
 * robots.txt, since the site's current credentials do not include Webmaster
 * Tools API access.
 */

import { createSign } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const HOST = "finopsllm.com";
const BASE = `https://${HOST}`;
const SITEMAP_INDEX = `${BASE}/sitemap-index.xml`;
const GSC_SITE = `sc-domain:${HOST}`;
const INDEXNOW_KEY_FILE = resolve(ROOT, "src/9f7a91c496064b7e96137c3326d9b895.txt");
const WAIT_SECONDS = Number(process.env.SEARCH_PUBLISH_WAIT_SECONDS || 600);
const POLL_SECONDS = Number(process.env.SEARCH_PUBLISH_POLL_SECONDS || 15);

function log(message) {
  process.stdout.write(`${message}\n`);
}

function fail(message) {
  throw new Error(message);
}

function git(args, { allowFailure = false } = {}) {
  const result = spawnSync("git", args, { cwd: ROOT, encoding: "utf8" });
  if (result.error) throw result.error;
  if (!allowFailure && result.status !== 0) {
    fail(`git ${args.join(" ")} failed: ${(result.stderr || result.stdout).trim()}`);
  }
  return result;
}

function pushIfRequested(push, urls) {
  if (!push) return;
  const branch = git(["branch", "--show-current"]).stdout.trim();
  const pushUrl = git(["remote", "get-url", "--push", "origin"]).stdout.trim();
  if (branch !== "main") fail(`Refusing to push from branch ${branch}; expected main.`);
  if (pushUrl !== "git@github.com:lisn0/finops-llm.git") {
    fail(`Refusing unexpected push destination: ${pushUrl}`);
  }
  const upstream = git(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"])
    .stdout.trim();
  if (upstream !== "origin/main") fail(`Expected origin/main upstream, found ${upstream}.`);
  const status = git(["status", "--porcelain"]).stdout.trim();
  if (status) fail("Refusing to push with staged or working-tree changes. Commit and review the release first.");
  const outgoing = git(["log", "--format=%h %s", "origin/main..HEAD"]).stdout.trim();
  if (!outgoing) fail("There are no commits to push to origin/main.");
  log(`Push destination: ${pushUrl} (${branch})`);
  log(`Outgoing commits:\n${outgoing}`);
  const files = git(["diff", "--name-only", "origin/main..HEAD"]).stdout.trim().split("\n").filter(Boolean);
  if (!files.length) fail("The outgoing commit range contains no changed files.");
  const contentTargets = new Set();
  for (const file of files) {
    if (/^src\/_data\/articles\/.+\.json$/.test(file)) {
      const article = JSON.parse(git(["show", `HEAD:${file}`]).stdout);
      if (article.slug) contentTargets.add(article.slug.replace(/^\//, ""));
      continue;
    }
    if (/^src\/(?:[a-z]{2}\/)?research\/.+\.njk$/.test(file)) {
      const target = file.replace(/^src\//, "").replace(/\.njk$/, "")
        .replace(/^(?:de|es|fr|ja|pt|it|ko|zh|nl|ar)\//, "");
      contentTargets.add(target);
      continue;
    }
    fail(`Refusing publish push because ${file} is outside the article/research content paths.`);
  }
  for (const url of urls) {
    const path = new URL(url).pathname.replace(/^\/(?:de|es|fr|ja|pt|it|ko|zh|nl|ar)\//, "/").replace(/^\//, "");
    if (!contentTargets.has(path)) fail(`Refusing push: ${url} does not match a changed article/research source file.`);
  }
  log(`Outgoing content files:\n${files.join("\n")}`);
  git(["push", "origin", "main"]);
  log("Push complete; waiting for Cloudflare deployment.");
}

function validateUrls(rawUrls) {
  const urls = [...new Set(rawUrls.map((raw) => {
    let url;
    try { url = new URL(raw); } catch { fail(`Invalid URL: ${raw}`); }
    if (url.protocol !== "https:" || url.hostname !== HOST || url.search || url.hash) {
      fail(`Expected a canonical https://${HOST}/ page URL without query or fragment: ${raw}`);
    }
    return url.href.replace(/\/$/, "");
  }))];
  if (!urls.length) fail("Supply at least one published page URL.");
  return urls;
}

function expectedArticleTitle(url) {
  const path = new URL(url).pathname.replace(/^\/(?:de|es|fr|ja|pt|it|ko|zh|nl|ar)\//, "/");
  const slug = path.replace(/^\//, "");
  for (const name of readdirSync(resolve(ROOT, "src/_data/articles"))) {
    if (!name.endsWith(".json")) continue;
    const article = JSON.parse(readFileSync(resolve(ROOT, "src/_data/articles", name), "utf8"));
    if (article.slug === slug) {
      const lang = new URL(url).pathname.match(/^\/(de|es|fr|ja|pt|it|ko|zh|nl|ar)\//)?.[1] || "en";
      const locale = article.languages?.[lang];
      return locale?.titleCore || locale?.title || null;
    }
  }
  return null;
}

const locs = (xml) => [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);

async function fetchSitemapUrls() {
  const indexResponse = await fetch(SITEMAP_INDEX);
  if (!indexResponse.ok) fail(`GET ${SITEMAP_INDEX} -> HTTP ${indexResponse.status}`);
  const index = await indexResponse.text();
  const childMaps = locs(index);
  if (!childMaps.length) fail("Live sitemap index contains no child sitemaps.");
  const urls = new Set();
  for (const child of childMaps) {
    const response = await fetch(child);
    if (!response.ok) fail(`GET ${child} -> HTTP ${response.status}`);
    for (const loc of locs(await response.text())) urls.add(loc.replace(/\/$/, ""));
  }
  return urls;
}

async function waitForLive(urls) {
  const expected = new Map(urls.map((url) => [url, expectedArticleTitle(url)]));
  const deadline = Date.now() + WAIT_SECONDS * 1000;
  let attempt = 0;
  while (Date.now() <= deadline) {
    attempt++;
    const sitemapUrls = await fetchSitemapUrls();
    const pending = [];
    for (const url of urls) {
      try {
        const response = await fetch(url, { redirect: "follow" });
        const html = response.ok ? await response.text() : "";
        const title = expected.get(url);
        if (!response.ok || !sitemapUrls.has(url) || (title && !html.includes(title))) {
          pending.push(`${url} (HTTP ${response.status}${sitemapUrls.has(url) ? ", in sitemap" : ", absent from sitemap"}${title && !html.includes(title) ? ", expected title not live" : ""})`);
        }
      } catch (error) {
        pending.push(`${url} (${error.message})`);
      }
    }
    if (!pending.length) {
      log(`Cloudflare is live: ${urls.length} URL(s) return 2xx, appear in the sitemap, and match current article titles where available.`);
      return;
    }
    log(`Waiting for Cloudflare (check ${attempt}; pending ${pending.length}): ${pending.join("; ")}`);
    await new Promise((resolvePromise) => setTimeout(resolvePromise, POLL_SECONDS * 1000));
  }
  fail(`Cloudflare did not serve all submitted URLs within ${WAIT_SECONDS} seconds.`);
}

function localEnvValue(name) {
  const envPath = resolve(ROOT, "../../.env");
  try {
    const line = readFileSync(envPath, "utf8").split(/\r?\n/).find((entry) => entry.trim().startsWith(`${name}=`));
    return line?.split("=").slice(1).join("=").trim().replace(/^(['"])(.*)\1$/, "$2") || "";
  } catch {
    return "";
  }
}

function serviceAccount() {
  const raw = process.env.GSC_SA_KEY?.trim();
  const keyFile = process.env.GSC_SA_KEY_FILE || localEnvValue("GSC_SA_KEY_FILE");
  const json = raw || (keyFile ? readFileSync(resolve(keyFile), "utf8") : "");
  if (!json) return null;
  const account = JSON.parse(json);
  if (!account.client_email || !account.private_key) fail("Google service-account credential is missing required fields.");
  return account;
}

const b64u = (value) => Buffer.from(value).toString("base64url");

async function googleAccessToken(account) {
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${b64u(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${b64u(JSON.stringify({
    iss: account.client_email,
    scope: "https://www.googleapis.com/auth/webmasters",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }))}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(account.private_key);
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${b64u(signature)}`,
    }),
  });
  const body = await response.json();
  if (!response.ok) fail(`Google token exchange HTTP ${response.status}: ${body.error_description || body.error || "unknown error"}`);
  return body.access_token;
}

async function googleCall(token, url, options) {
  const response = await fetch(url, {
    ...options,
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json", ...(options.headers || {}) },
  });
  const text = await response.text();
  let body;
  try { body = text ? JSON.parse(text) : {}; } catch { body = { message: text }; }
  return { response, body };
}

async function submitGoogleSitemap(token) {
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE)}/sitemaps/${encodeURIComponent(SITEMAP_INDEX)}`;
  const { response, body } = await googleCall(token, endpoint, { method: "PUT" });
  if (response.ok) {
    log(`Google sitemap submission: HTTP ${response.status} accepted (${SITEMAP_INDEX}).`);
    return true;
  }
  log(`Google sitemap submission: HTTP ${response.status}: ${body.error?.message || body.message || "failed"}`);
  return false;
}

async function inspectGoogleUrls(token, urls) {
  let allInspected = true;
  for (const inspectionUrl of urls) {
    const { response, body } = await googleCall(token, "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
      method: "POST",
      body: JSON.stringify({ inspectionUrl, siteUrl: GSC_SITE, languageCode: "en-US" }),
    });
    if (!response.ok) {
      allInspected = false;
      log(`Google URL inspection ${inspectionUrl}: HTTP ${response.status}: ${body.error?.message || body.message || "failed"}`);
      continue;
    }
    const result = body.inspectionResult?.indexStatusResult || {};
    log(`Google URL inspection ${inspectionUrl}: verdict=${result.verdict || "unknown"}; coverage=${result.coverageState || "unknown"}; indexing=${result.indexingState || "unknown"}; last-crawl=${result.lastCrawlTime || "none"}.`);
  }
  return allInspected;
}

async function submitIndexNow(urls) {
  const key = readFileSync(INDEXNOW_KEY_FILE, "utf8").trim();
  if (!key) fail("IndexNow public key file is empty.");
  const keyLocation = `${BASE}/${key}.txt`;
  const verification = await fetch(keyLocation);
  if (!verification.ok || (await verification.text()).trim() !== key) {
    fail(`IndexNow ownership file is not live at ${keyLocation}.`);
  }
  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key, keyLocation, urlList: urls }),
  });
  const text = await response.text();
  if (response.status !== 200 && response.status !== 202) {
    log(`Bing IndexNow URL submission: HTTP ${response.status}${text ? `: ${text}` : ""}`);
    return false;
  }
  log(`Bing IndexNow URL submission: HTTP ${response.status}; accepted ${urls.length} URL(s).`);
  return true;
}

async function bingSitemapDiscovery() {
  const response = await fetch(`${BASE}/robots.txt`);
  if (!response.ok) {
    log(`Bing sitemap discovery: robots.txt HTTP ${response.status}; could not verify sitemap declaration.`);
    return false;
  }
  const robots = await response.text();
  const declared = robots.split(/\r?\n/).some((line) => line.trim().toLowerCase() === `sitemap: ${SITEMAP_INDEX}`.toLowerCase());
  if (declared) {
    log(`Bing sitemap discovery: ${SITEMAP_INDEX} is declared in robots.txt. IndexNow notified Bing of the changed URLs.`);
    return true;
  }
  log("Bing sitemap discovery: sitemap index is not declared in robots.txt.");
  return false;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    log("Usage: npm run post-publish-search -- [--push] https://finopsllm.com/research/slug [more-urls...]");
    log("--push verifies a clean main checkout and the GitHub production remote, pushes committed article/research files, then waits for Cloudflare.");
    log("Without --push, URLs must already be pushed. Google sitemap submission and URL inspection use GSC_SA_KEY or the local GSC_SA_KEY_FILE setting.");
    log("Bing discovery uses robots.txt plus IndexNow. HTTP submission receipts do not guarantee indexing.");
    return;
  }
  const push = args.includes("--push");
  const urls = validateUrls(args.filter((arg) => arg !== "--push"));
  pushIfRequested(push, urls);
  await waitForLive(urls);

  let googleOkay = false;
  try {
    const account = serviceAccount();
    if (!account) {
      log("Google: no local Search Console credential configured; sitemap submission skipped.");
    } else {
      const googleToken = await googleAccessToken(account);
      const submitted = await submitGoogleSitemap(googleToken);
      if (!submitted) log("Google: sitemap submission was rejected; inspecting each requested URL instead.");
      const inspected = await inspectGoogleUrls(googleToken, urls);
      googleOkay = submitted || inspected;
    }
  } catch (error) {
    log(`Google: ${error.message}; proceeding to Bing notifications.`);
  }

  const bingSitemapOkay = await bingSitemapDiscovery();
  const indexNowOkay = await submitIndexNow(urls);
  if (!googleOkay || !bingSitemapOkay || !indexNowOkay) process.exitCode = 1;
}

main().catch((error) => {
  process.stderr.write(`ERROR: ${error.message}\n`);
  process.exitCode = 1;
});
