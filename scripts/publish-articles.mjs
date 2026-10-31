#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = "https://finopsllm.com";
const LANGS = ["en", "de", "es", "fr", "ja", "pt", "it", "ko", "zh", "nl", "ar", "ru", "tr", "pl", "id", "vi"];
const WAIT_SECONDS = Number(process.env.SEARCH_PUBLISH_WAIT_SECONDS || 600);
const POLL_SECONDS = Number(process.env.SEARCH_PUBLISH_POLL_SECONDS || 15);

function requireValue(value, message) {
  if (!value) throw new Error(message);
  return value;
}

function validateArticle(article, path = "article") {
  const errors = [];
  const check = (condition, message) => { if (!condition) errors.push(message); };
  check(article && typeof article === "object" && !Array.isArray(article), "must contain a JSON object");
  if (!article || typeof article !== "object" || Array.isArray(article)) throw new Error(`${path}: must contain a JSON object`);
  const slug = article.slug;
  check(typeof slug === "string" && /^research\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug), "slug must be research/<lowercase-hyphenated-slug>");
  check(/^\d{4}-\d{2}-\d{2}$/.test(article.datePublished || "") && !Number.isNaN(Date.parse(article.datePublished)), "datePublished must be YYYY-MM-DD");
  check(/^\d{4}-\d{2}-\d{2}$/.test(article.dateModified || "") && !Number.isNaN(Date.parse(article.dateModified)), "dateModified must be YYYY-MM-DD");
  const languages = article.languages;
  check(languages && typeof languages === "object" && !Array.isArray(languages), "languages must be an object");
  const urls = [];
  if (languages && typeof languages === "object" && !Array.isArray(languages)) {
    const languageKeys = Object.keys(languages);
    check(languageKeys.includes("en"), "languages must include en");
    check(languageKeys.length > 0 && languageKeys.every((lang) => LANGS.includes(lang)), "languages contains an unsupported locale");
    for (const [lang, locale] of Object.entries(languages)) {
      const label = `languages.${lang}`;
      check(locale && typeof locale === "object" && !Array.isArray(locale), `${label} must be an object`);
      if (!locale || typeof locale !== "object" || Array.isArray(locale)) continue;
      const modified = locale.dateModified ?? article.dateModified;
      check(/^\d{4}-\d{2}-\d{2}$/.test(modified || "") && !Number.isNaN(Date.parse(modified)) && new Date(modified).toISOString().slice(0, 10) === modified, `${label}.dateModified must be YYYY-MM-DD when present`);
      check(typeof locale.title === "string" && locale.title.trim().length > 0, `${label}.title is required`);
      check(typeof locale.titleCore === "string" && locale.titleCore.trim().length > 0, `${label}.titleCore is required`);
      check(typeof locale.description === "string" && locale.description.trim().length > 0 && locale.description.length <= 165, `${label}.description is required and must be at most 165 characters`);
      check(typeof locale.body === "string" && locale.body.trim().length > 0, `${label}.body is required`);
      check(Array.isArray(locale.faq) && locale.faq.every((faq) => faq && typeof faq.question === "string" && faq.question.trim() && typeof faq.answer === "string" && faq.answer.trim()), `${label}.faq must be an array of question/answer objects`);
      if (typeof locale.title === "string") check(locale.title.length + " · FinOps LLM".length <= 70, `${label}.title plus site suffix exceeds 70 characters`);
      if (typeof slug === "string" && /^research\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && typeof locale.body === "string") {
        const pathname = `${lang === "en" ? "" : `/${lang}`}/${slug}`;
        const displayDate = new Date(`${modified}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
        let expectedBody = locale.body.replace(/<p class="updated">([^·]*·\s*)[^<]*(<\/p>)/, `<p class="updated">$1${displayDate}$2`);
        if (expectedBody === locale.body) {
          expectedBody = locale.body.replace(/<p class="updated">[^<]*(<\/p>)/, `<p class="updated">${displayDate}$1`);
        }
        urls.push({ url: `${BASE}${pathname}`, title: locale.titleCore, body: expectedBody, dateModified: modified });
      }
    }
  }
  if (errors.length) throw new Error(`${path}: ${errors.join("; ")}`);
  return urls;
}

function decodeEntities(value) {
  return value.replace(/&(?:amp|lt|gt|quot|#39|apos);/g, (entity) => ({ "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&apos;": "'" })[entity] || entity);
}

function matchesPublishedArticle(html, expected) {
  if (typeof html !== "string" || !expected?.url || !expected.title || !expected.body || !expected.dateModified) return false;
  const canonical = html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["'][^>]*>/i)?.[1]
    || html.match(/<link\b[^>]*\bhref=["']([^"']+)["'][^>]*\brel=["']canonical["'][^>]*>/i)?.[1];
  if (!canonical || decodeEntities(canonical) !== expected.url) return false;
  const title = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
  if (!title || decodeEntities(title.replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim() !== decodeEntities(expected.title).replace(/\s+/g, " ").trim()) return false;
  if (!html.includes(`"dateModified": "${expected.dateModified}"`) && !html.includes(`"dateModified":"${expected.dateModified}"`)) return false;
  const normalize = (value) => value.replace(/\r\n?/g, "\n").replace(/\s+/g, " ").trim();
  return normalize(html).includes(normalize(expected.body));
}

function git(args, { allowFailure = false } = {}) {
  const result = spawnSync("git", ["-C", ROOT, ...args], { encoding: "utf8" });
  if (result.error) throw result.error;
  if (!allowFailure && result.status !== 0) throw new Error(`git ${args.join(" ")} failed: ${(result.stderr || result.stdout).trim()}`);
  return result;
}

function parseArgs(args) {
  let message = "";
  let dryRun = false;
  const files = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--dry-run") dryRun = true;
    else if (args[i] === "--message") message = requireValue(args[++i], "--message requires a commit message");
    else if (args[i].startsWith("-")) throw new Error(`Unknown option: ${args[i]}`);
    else files.push(args[i]);
  }
  requireValue(message.trim(), 'Usage: npm run publish:articles -- --message "Publish title" src/_data/articles/file.json [more.json]');
  requireValue(files.length, "Supply one or more article JSON files.");
  return { message, dryRun, files };
}

function resolveFiles(files) {
  return [...new Set(files.map((file) => {
    const absolute = resolve(ROOT, file);
    const repoPath = relative(ROOT, absolute).split("\\").join("/");
    if (isAbsolute(relative(ROOT, absolute)) || !/^src\/_data\/articles\/[a-z0-9][a-z0-9-]*\.json$/.test(repoPath)) {
      throw new Error(`Only src/_data/articles/<slug>.json files may be published: ${file}`);
    }
    return { absolute, repoPath };
  }))];
}

function readAndValidate(files) {
  const entries = files.map(({ absolute, repoPath }) => {
    const raw = readFileSync(absolute, "utf8");
    if (/[^\S\r\n]+$/m.test(raw)) throw new Error(`${repoPath}: trailing whitespace found`);
    let article;
    try { article = JSON.parse(raw); } catch (error) { throw new Error(`${repoPath}: invalid JSON: ${error.message}`); }
    return { repoPath, raw, article, pages: validateArticle(article, repoPath) };
  });
  const urls = entries.flatMap(({ pages }) => pages);
  const unique = new Set();
  for (const page of urls) {
    if (unique.has(page.url)) throw new Error(`Selected articles produce duplicate URL: ${page.url}`);
    unique.add(page.url);
  }
  return { entries, urls };
}

function checkGit(files) {
  const branch = git(["branch", "--show-current"]).stdout.trim();
  if (branch !== "main") throw new Error(`Refusing to publish from branch ${branch}; expected main.`);
  const pushUrl = git(["remote", "get-url", "--push", "origin"]).stdout.trim();
  if (pushUrl !== "git@github.com:lisn0/finops-llm.git" && pushUrl !== "https://github.com/lisn0/finops-llm.git") throw new Error(`Refusing unexpected origin push URL: ${pushUrl}`);
  const upstream = git(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"]).stdout.trim();
  if (upstream !== "origin/main") throw new Error(`Expected origin/main upstream, found ${upstream}.`);
  const selected = new Set(files.map(({ repoPath }) => repoPath));
  const staged = git(["diff", "--cached", "--name-only"]).stdout.trim().split("\n").filter(Boolean);
  const unrelatedStaged = staged.filter((file) => !selected.has(file));
  if (unrelatedStaged.length) throw new Error(`Refusing to publish with unrelated staged files:\n${unrelatedStaged.join("\n")}`);
  return { branch, pushUrl, selected };
}

async function waitForLive(urls) {
  const deadline = Date.now() + WAIT_SECONDS * 1000;
  let attempt = 0;
  while (Date.now() <= deadline) {
    attempt++;
    const pending = [];
    for (const expected of urls) {
      try {
        const response = await fetch(expected.url, { signal: AbortSignal.timeout(15000), redirect: "follow" });
        const html = response.ok ? await response.text() : "";
        if (!response.ok || !matchesPublishedArticle(html, expected)) pending.push(`${expected.url} (HTTP ${response.status}, page does not yet match source)`);
      } catch (error) { pending.push(`${expected.url} (${error.message})`); }
    }
    if (!pending.length) return;
    console.log(`Waiting for Cloudflare (check ${attempt}; ${pending.length} pending): ${pending.join("; ")}`);
    await sleep(POLL_SECONDS * 1000);
  }
  throw new Error(`Cloudflare did not serve every selected locale matching the committed source within ${WAIT_SECONDS} seconds.`);
}

async function main() {
  const { message, dryRun, files: rawFiles } = parseArgs(process.argv.slice(2));
  const files = resolveFiles(rawFiles);
  const { entries, urls } = readAndValidate(files);
  console.log(`Articles: ${entries.map(({ repoPath }) => repoPath).join(", ")}`);
  console.log(`Locale pages: ${urls.map(({ url }) => url).join("\n")}`);
  if (dryRun) { console.log(`Dry run: would publish with commit message: ${message}`); return; }

  if (!Number.isFinite(WAIT_SECONDS) || WAIT_SECONDS <= 0 || !Number.isFinite(POLL_SECONDS) || POLL_SECONDS <= 0) {
    throw new Error("SEARCH_PUBLISH_WAIT_SECONDS and SEARCH_PUBLISH_POLL_SECONDS must be finite positive numbers.");
  }

  const searchRunner = resolve(ROOT, process.env.SEARCH_PUBLISH_RUNNER || "../../../../tools/publish-search.mjs");
  if (!existsSync(searchRunner)) throw new Error(`Shared search runner is missing: ${searchRunner}`);
  const gitState = checkGit(files);
  git(["fetch", "origin", "main"]);
  const ancestor = git(["merge-base", "--is-ancestor", "origin/main", "HEAD"], { allowFailure: true });
  if (ancestor.status !== 0) throw new Error("Local main is behind or diverged from fetched origin/main; synchronize main before publishing.");
  const outgoing = git(["log", "--format=", "--name-only", "origin/main..HEAD"]).stdout.trim().split("\n").filter(Boolean);
  const outsideSelected = outgoing.filter((file) => !gitState.selected.has(file));
  if (outsideSelected.length) throw new Error(`Refusing outgoing commits that change unselected paths:\n${outsideSelected.join("\n")}`);

  const changedSelected = git(["diff", "--name-only", "HEAD", "--", ...files.map(({ repoPath }) => repoPath)]).stdout.trim().split("\n").filter(Boolean);
  const stagedSelected = git(["diff", "--cached", "--name-only", "--", ...files.map(({ repoPath }) => repoPath)]).stdout.trim().split("\n").filter(Boolean);
  const untrackedSelected = git(["ls-files", "--others", "--exclude-standard", "--", ...files.map(({ repoPath }) => repoPath)]).stdout.trim().split("\n").filter(Boolean);
  if (changedSelected.length || stagedSelected.length || untrackedSelected.length) {
    git(["add", "--", ...files.map(({ repoPath }) => repoPath)]);
    git(["diff", "--cached", "--check"]);
    const stagedFiles = git(["diff", "--cached", "--name-only"]).stdout.trim().split("\n").filter(Boolean);
    if (stagedFiles.some((file) => !gitState.selected.has(file))) throw new Error("Staging includes a path outside the selected article files.");
    const changedFromHead = git(["diff", "--cached", "--name-only", "HEAD"]).stdout.trim().split("\n").filter(Boolean);
    if (changedFromHead.length) git(["commit", "-m", message]);
  }
  const outgoingFiles = git(["log", "--format=", "--name-only", "origin/main..HEAD"]).stdout.trim().split("\n").filter(Boolean);
  if (outgoingFiles.some((file) => !gitState.selected.has(file))) throw new Error("Outgoing changes include paths outside the selected article files.");
  const actualPages = entries.flatMap(({ repoPath }) => {
    const committedArticle = JSON.parse(git(["show", `HEAD:${repoPath}`]).stdout);
    return validateArticle(committedArticle, repoPath);
  });
  if (git(["rev-parse", "origin/main"]).stdout.trim() !== git(["rev-parse", "HEAD"]).stdout.trim()) {
    git(["push", "origin", "HEAD:refs/heads/main"]);
    console.log(`Pushed selected articles to ${gitState.pushUrl}; checking live locale pages.`);
  } else {
    console.log("No unpublished selected article commits; resuming live check and search submission.");
  }
  await waitForLive(actualPages);
  const runner = spawnSync(process.execPath, [searchRunner, "--site", "finops-llm", ...actualPages.map(({ url }) => url)], { cwd: ROOT, stdio: "inherit" });
  if (runner.error) throw runner.error;
  if (runner.status !== 0) throw new Error(`Shared search submission runner failed with exit status ${runner.status}.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => { process.stderr.write(`ERROR: ${error.message}\n`); process.exitCode = 1; });
}

export { validateArticle, matchesPublishedArticle };
