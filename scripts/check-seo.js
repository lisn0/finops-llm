// Postbuild SEO gate. Every guard here exists because the thing it checks has
// already regressed once in silence (see each section). It reads only the built
// _site, plus the article data for the thin-page comparison, and exits 1 with
// "<file>: <reason>" lines when anything is wrong. Translation length is a
// warning, not a failure: existing content is not blocked.
//
// HTML is read with a small tokenizer (tagAt / elements) rather than regexes over
// attribute text: a value such as content="don't" or title="a > b" is exactly
// what `[^"']*` style patterns misread.
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const site = path.join(ROOT, "_site");
const ORIGIN = "https://finopsllm.com";
const LANGS = require("../src/_data/langs.js");
const NON_EN = LANGS.filter((l) => l !== "en");
const { THIN_WORDS, isThin, visibleWords, shortTranslations, formatShortTranslations } = require("../lib/thin-pages.js");

if (!fs.existsSync(site)) {
  console.error("[check-seo] _site does not exist; run the build first.");
  process.exit(1);
}

const errors = [];
const fail = (guard, where, reason) => errors.push(`[${guard}] ${where}: ${reason}`);

// ---------------------------------------------------------------- HTML helpers

const NAMED = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", middot: "·", mdash: "—", ndash: "–", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”", hellip: "…", rarr: "→", larr: "←", times: "×", copy: "©" };
const decode = (s) =>
  String(s).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === "#") {
      const cp = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(cp) && cp > 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : m;
    }
    const v = NAMED[e.toLowerCase()];
    return v === undefined ? m : v;
  });

const isSpace = (c) => c === " " || c === "\n" || c === "\t" || c === "\r" || c === "\f";

// Parse one start tag whose name ends at `pos`. Returns { attrs, end } where end
// is the index just past the closing ">". Quoted values may contain > ' " freely.
function tagAt(html, pos) {
  const n = html.length;
  const attrs = {};
  let i = pos;
  while (i < n) {
    while (i < n && (isSpace(html[i]) || html[i] === "/")) i++;
    if (i >= n) break;
    if (html[i] === ">") return { attrs, end: i + 1 };
    const s = i;
    while (i < n && !isSpace(html[i]) && html[i] !== "=" && html[i] !== ">" && html[i] !== "/") i++;
    const name = html.slice(s, i).toLowerCase();
    if (i === s) { i++; continue; }
    while (i < n && isSpace(html[i])) i++;
    let value = "";
    if (html[i] === "=") {
      i++;
      while (i < n && isSpace(html[i])) i++;
      if (html[i] === '"' || html[i] === "'") {
        const close = html.indexOf(html[i], i + 1);
        const stop = close === -1 ? n : close;
        value = html.slice(i + 1, stop);
        i = stop + 1;
      } else {
        const v = i;
        while (i < n && !isSpace(html[i]) && html[i] !== ">") i++;
        value = html.slice(v, i);
      }
    }
    if (!(name in attrs)) attrs[name] = decode(value);
  }
  return { attrs, end: n };
}

// Start tags named `name`, in document order: { attrs, start, end }.
function elements(html, name) {
  const out = [];
  const lower = name.toLowerCase();
  let from = 0;
  for (;;) {
    const at = html.indexOf("<", from);
    if (at === -1) break;
    const after = at + 1 + lower.length;
    if (html.slice(at + 1, after).toLowerCase() === lower && (isSpace(html[after]) || html[after] === ">" || html[after] === "/")) {
      const t = tagAt(html, after);
      out.push({ attrs: t.attrs, start: at, end: t.end });
      from = t.end;
    } else {
      from = at + 1;
    }
  }
  return out;
}

// Drop comments and the bodies of raw-text elements. Their content is not page
// text, and a "<" inside a script must not be read as a tag.
const dropRaw = (html, names) =>
  html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(new RegExp(`<(${names.join("|")})(?=[\\s/>])[\\s\\S]*?<\\/\\1\\s*>`, "gi"), " ");

// Remove every tag (found by the tokenizer, so a ">" inside an attribute value
// does not end it early). Text between tags is kept.
function stripTags(html) {
  let out = "";
  let from = 0;
  const n = html.length;
  for (;;) {
    const at = html.indexOf("<", from);
    if (at === -1) { out += html.slice(from); break; }
    out += html.slice(from, at);
    const c = html[at + 1];
    if (c === "!" || c === "?") {
      const close = html.indexOf(">", at);
      from = close === -1 ? n : close + 1;
      out += " ";
    } else if (c === "/" || /[a-zA-Z]/.test(c || "")) {
      let i = at + 1;
      if (c === "/") i++;
      while (i < n && !isSpace(html[i]) && html[i] !== ">" && html[i] !== "/") i++;
      from = tagAt(html, i).end;
      out += " ";
    } else {
      out += "<";
      from = at + 1;
    }
  }
  return out;
}

// Remove whole elements (open tag to matching close) for non-nesting chrome.
const dropElements = (html, names) => html.replace(new RegExp(`<(${names.join("|")})(?=[\\s/>])[\\s\\S]*?<\\/\\1\\s*>`, "gi"), " ");

const squash = (s) => s.replace(/\s+/g, " ").trim();
const textOf = (html) => squash(decode(stripTags(html)));

// ------------------------------------------------------------------- URL helpers

const cleanPath = (p) => {
  p = p.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
  return p.length > 1 ? p.replace(/\/$/, "") : "/";
};
// Clean path for an absolute on-site URL; null for any other origin or scheme.
function pathOf(href) {
  let u;
  try { u = new URL(href, ORIGIN); } catch { return null; }
  return u.origin === ORIGIN ? cleanPath(u.pathname) : null;
}
const localeOfPath = (p) => NON_EN.find((l) => p === "/" + l || p.startsWith("/" + l + "/")) || "en";

// ------------------------------------------------------------------- read _site

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const htmlFiles = walk(site).filter((f) => f.endsWith(".html"));
const relOf = (f) => "/" + path.relative(site, f).split(path.sep).join("/");

const pages = new Map(); // clean path -> page record
let faqPages = 0;
const answerMisses = []; // FAQ answers absent from the visible text; see the baseline note in the report section

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const rel = relOf(file);
  const p = cleanPath(rel);
  const headEnd = html.search(/<\/head\s*>/i);
  const head = dropRaw(headEnd === -1 ? html.slice(0, 20000) : html.slice(0, headEnd), ["script", "style"]);

  const htmlTag = elements(head, "html")[0] || elements(html.slice(0, 2000), "html")[0];
  const titleMatch = head.match(/<title(?:\s[^>]*)?>([\s\S]*?)<\/title\s*>/i);
  let robots = "";
  for (const m of elements(head, "meta")) {
    const name = (m.attrs.name || "").toLowerCase();
    if (name === "robots" || name === "googlebot") robots += " " + (m.attrs.content || "").toLowerCase();
  }
  let canonical;
  const hreflangs = [];
  for (const l of elements(head, "link")) {
    const rels = (l.attrs.rel || "").toLowerCase().split(/\s+/);
    if (rels.includes("canonical") && canonical === undefined) canonical = l.attrs.href || "";
    if (rels.includes("alternate") && l.attrs.hreflang !== undefined) hreflangs.push({ lang: l.attrs.hreflang, href: l.attrs.href || "" });
  }

  const page = {
    file, rel, path: p, lang: localeOfPath(p),
    htmlLang: htmlTag ? htmlTag.attrs.lang : undefined,
    title: titleMatch ? squash(decode(titleMatch[1])) : undefined,
    noindex: /\bnoindex\b|\bnone\b/.test(robots),
    canonical, canonicalPath: canonical === undefined ? undefined : pathOf(canonical),
    hreflangs,
  };
  pages.set(p, page);

  // Guard 6 (FAQPage) is checked in the same pass so each file is read once.
  checkFaq(page, html);
}

// --------------------------------------------------------------- Guard 6: FAQPage
// A FAQPage whose questions are not on the page is ineligible for rich results
// and misleading to every consumer. JSON-LD is removed before the visible text
// is built, so the schema cannot vouch for itself. The existing check-links
// test only looked for the question inside the raw HTML, schema included.
function collectFaq(node, out) {
  if (Array.isArray(node)) { node.forEach((x) => collectFaq(x, out)); return; }
  if (!node || typeof node !== "object") return;
  const types = [].concat(node["@type"] || []);
  if (types.includes("FAQPage")) out.push(node);
  if (node["@graph"]) collectFaq(node["@graph"], out);
}

function checkFaq(page, html) {
  if (!html.includes("FAQPage")) return;
  const faqs = [];
  const scripts = [...html.matchAll(/<script(?=[\s>])([\s\S]*?)<\/script\s*>/gi)];
  for (const m of scripts) {
    const open = tagAt(m[0], "<script".length);
    if (!/ld\+json/i.test(open.attrs.type || "")) continue;
    let data;
    try { data = JSON.parse(m[0].slice(open.end, m[0].lastIndexOf("</"))); } catch (e) { fail("faq", page.rel, `invalid JSON-LD (${e.message})`); continue; }
    collectFaq(data, faqs);
  }
  if (!faqs.length) return;
  faqPages++;
  const bodyStart = html.search(/<\/head\s*>/i);
  const visible = textOf(dropRaw(bodyStart === -1 ? html : html.slice(bodyStart), ["script", "style", "noscript", "template"]));
  for (const faq of faqs) {
    const entities = [].concat(faq.mainEntity || []);
    if (!entities.length) fail("faq", page.rel, "FAQPage has no mainEntity questions");
    for (const q of entities) {
      const name = squash(decode(stripTags(String((q && q.name) || ""))));
      if (!name) { fail("faq", page.rel, "FAQ question has no name"); continue; }
      if (!visible.includes(name)) fail("faq", page.rel, `JSON-LD question is not in the visible text: "${name}"`);
      const answers = [].concat((q && q.acceptedAnswer) || []);
      if (!answers.length) fail("faq", page.rel, `FAQ question has no acceptedAnswer: "${name}"`);
      for (const a of answers) {
        const text = squash(decode(stripTags(String((a && a.text) || ""))));
        if (!text) fail("faq", page.rel, `FAQ answer is empty for: "${name}"`);
        else if (!visible.includes(text)) answerMisses.push({ key: `${page.rel}\t${name}`, msg: `${page.rel}: JSON-LD answer is not in the visible text for: "${name}" (answer starts "${text.slice(0, 60)}")` });
      }
    }
  }
}

// -------------------------------------------------------------- redirects, sitemaps

const redirects = new Map(); // clean path -> status, only plain path-to-path rules
const redirectFile = path.join(site, "_redirects");
if (fs.existsSync(redirectFile)) {
  for (const line of fs.readFileSync(redirectFile, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const [from, , status] = t.split(/\s+/);
    if (!from || from.includes("*") || from.includes(":")) continue;
    redirects.set(cleanPath(from), Number(status || 301));
  }
}

const sitemapFiles = fs.readdirSync(site).filter((f) => /^sitemap.*\.xml$/.test(f));
const sitemapUrls = []; // { loc, lastmod, file, path }
for (const f of sitemapFiles) {
  const xml = fs.readFileSync(path.join(site, f), "utf8");
  if (/<sitemapindex[\s>]/.test(xml)) {
    for (const m of xml.matchAll(/<loc>\s*([^<]*?)\s*<\/loc>/g)) {
      const sp = pathOf(decode(m[1]));
      if (sp === null || !fs.existsSync(path.join(site, new URL(decode(m[1])).pathname))) fail("sitemap", f, `index entry ${m[1]} does not exist in _site`);
    }
    continue;
  }
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = (m[1].match(/<loc>\s*([^<]*?)\s*<\/loc>/) || [])[1];
    const lastmod = (m[1].match(/<lastmod>\s*([^<]*?)\s*<\/lastmod>/) || [])[1];
    if (!loc) { fail("sitemap", f, "<url> without <loc>"); continue; }
    sitemapUrls.push({ loc: decode(loc), lastmod, file: f, path: pathOf(decode(loc)) });
  }
}

// ----------------------------------- Guard 1: hubs and sitemap URLs exist in _site
// A locale that ships articles but no /research hub strands every one of them
// (the hub is where crawlers and readers reach them), and a sitemap URL with no
// file is a 404 handed to a crawler.
for (const lang of LANGS) {
  const prefix = lang === "en" ? "" : "/" + lang;
  const dir = path.join(site, prefix.slice(1), "research");
  if (!fs.existsSync(dir) || !fs.readdirSync(dir).some((f) => f.endsWith(".html"))) continue;
  const hubPath = prefix + "/research";
  const hub = pages.get(hubPath);
  const where = `${hubPath}.html`;
  if (!hub) { fail("hub", where, `locale "${lang}" has article pages in ${prefix}/research/ but no hub page`); continue; }
  if (fs.statSync(hub.file).size === 0 || !hub.title) fail("hub", hub.rel, "hub file is empty or has no <title>");
  if (hub.noindex) fail("hub", hub.rel, "hub is noindex");
  if (hub.canonicalPath !== hubPath) fail("hub", hub.rel, `hub canonical is ${hub.canonical} (expected ${ORIGIN}${hubPath})`);
  if (redirects.has(hubPath) && redirects.get(hubPath) !== 200) fail("hub", "_redirects", `${hubPath} is redirected (${redirects.get(hubPath)}), so the hub is not served with 200`);
}

for (const u of sitemapUrls) {
  const where = `${u.file} ${u.loc}`;
  if (u.path === null) { fail("sitemap", where, `URL is not on ${ORIGIN}`); continue; }
  if (!pages.has(u.path)) fail("sitemap", where, "URL has no page in _site");
  if (redirects.has(u.path) && redirects.get(u.path) !== 200) fail("sitemap", where, `URL is redirected (${redirects.get(u.path)}) in _redirects`);
}

// -------------------------------------------- Guard 2: duplicate titles per locale
// Identical titles within a locale split the same query across pages. Only pages
// a crawler may index count: noindex pages and pages whose canonical points
// elsewhere (A/B "-v2" variants, thin translations) are out.
const indexable = (pg) => !pg.noindex && (pg.canonicalPath === undefined || pg.canonicalPath === pg.path);
const byTitle = new Map();
for (const pg of pages.values()) {
  if (!pg.title || !indexable(pg) || pg.path === "/404") continue;
  const key = pg.lang + "\n" + pg.title;
  if (!byTitle.has(key)) byTitle.set(key, []);
  byTitle.get(key).push(pg.rel);
}
for (const [key, files] of byTitle) {
  if (files.length > 1) fail("title", files.sort().join(", "), `${files.length} indexable ${key.split("\n")[0]} pages share the <title> "${key.slice(key.indexOf("\n") + 1)}"`);
}

// ---------------------------------------------- Guard 3: lastmod and no file mtime
// A sitemap entry without lastmod gives crawlers no reason to recrawl, and a
// lastmod taken from file mtime changes on every deploy (every checkout is
// fresh), telling Google everything changed every time.
for (const u of sitemapUrls) {
  const where = `${u.file} ${u.loc}`;
  if (!u.lastmod) fail("lastmod", where, "sitemap <url> has no <lastmod>");
  else if (!/^\d{4}-\d{2}-\d{2}(?:T[\d:.]+(?:Z|[+-]\d{2}:\d{2}))?$/.test(u.lastmod) || Number.isNaN(Date.parse(u.lastmod))) fail("lastmod", where, `<lastmod> "${u.lastmod}" is not a W3C date`);
}
{
  const configFile = path.join(ROOT, "eleventy.config.js");
  const lines = fs.readFileSync(configFile, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (/^\s*(?:\/\/|\*|\/\*)/.test(line)) return;
    if (/\.\s*(?:mtime|mtimeMs|ctime|ctimeMs|birthtime|birthtimeMs)\b|\b(?:statSync|lstatSync)\s*\(/.test(line)) fail("lastmod", `eleventy.config.js:${i + 1}`, "file timestamps must not feed the sitemap or page dates; use frontmatter dateModified");
  });
}

// -------------------------------------------- Guard 5: sitemap URL canonical is self
// A sitemap entry that canonicals elsewhere asks to index a URL that disclaims
// itself. Also: a noindex page in the sitemap contradicts itself.
for (const u of sitemapUrls) {
  const pg = u.path === null ? undefined : pages.get(u.path);
  if (!pg) continue;
  const where = `${u.file} ${u.loc}`;
  if (pg.canonical === undefined) fail("canonical", where, `${pg.rel} has no canonical link`);
  else if (pg.canonicalPath !== u.path || pg.canonical !== u.loc) fail("canonical", where, `${pg.rel} canonical is ${pg.canonical}, not the sitemap URL itself`);
  if (pg.noindex) fail("canonical", where, `${pg.rel} is noindex but listed in the sitemap`);
}

// -------------------------------------------------------------- Guard 4: hreflang
// Reciprocity, self-reference, valid codes, and no cluster member that is noindex
// or canonicals away. Self is measured by canonical: an A/B "-v2" variant
// canonicals to its control, so the control's URL is its self-reference.
const VALID_CODE = /^(?:x-default|[a-z]{2,3}(?:-[A-Z][a-z]{3})?(?:-(?:[A-Z]{2}|\d{3}))?)$/;
let clusters = 0;
for (const pg of pages.values()) {
  if (!pg.hreflangs.length) continue;
  clusters++;
  const self = pg.canonicalPath === undefined ? pg.path : pg.canonicalPath;
  const w = (r) => fail("hreflang", pg.rel, r);
  if (pg.noindex) w("page is noindex but declares hreflang");
  const seen = new Map();
  let hasSelf = false;
  for (const { lang, href } of pg.hreflangs) {
    if (!VALID_CODE.test(lang) || (lang !== "x-default" && !LANGS.includes(lang.split("-")[0]))) { w(`invalid hreflang code "${lang}"`); continue; }
    const target = pathOf(href);
    if (target === null || !href.startsWith(ORIGIN + "/")) { w(`hreflang="${lang}" href ${href} is not an absolute ${ORIGIN} URL`); continue; }
    if (seen.has(lang) && seen.get(lang) !== target) w(`hreflang="${lang}" is declared for two different URLs`);
    seen.set(lang, target);
    if (target === self) hasSelf = true;
    const tp = pages.get(target);
    if (!tp) { w(`hreflang="${lang}" target ${href} has no page in _site`); continue; }
    if (tp.noindex) w(`hreflang="${lang}" target ${href} is noindex`);
    if (tp.canonicalPath !== target) w(`hreflang="${lang}" target ${href} has canonical ${tp.canonical}`);
    if (lang !== "x-default" && tp.htmlLang && tp.htmlLang.split("-")[0].toLowerCase() !== lang.split("-")[0]) w(`hreflang="${lang}" target ${href} is <html lang="${tp.htmlLang}">`);
    if (target !== self && !tp.hreflangs.some((b) => pathOf(b.href) === self)) w(`${href} (hreflang="${lang}") does not link back to ${ORIGIN}${self === "/" ? "/" : self} (not reciprocal)`);
  }
  if (!hasSelf) w(`no hreflang entry for the page itself (${ORIGIN}${self})`);
}

// ----------------------------------------------------- Guard 7: thin-rule drift
// lib/thin-pages.js decides noindex from the article JSON. This recounts the
// words that actually reached the built page, by a separate path, and fails when
// the two disagree on thin vs not thin (or when the robots tag disagrees with the
// rule). Hand-written .njk locale pages are not under the rule and not compared.
const articles = require("../src/_data/articles.js")();
const articlePages = require("../src/_data/articlePages.js")();
const CJK = /[぀-ヿ㐀-鿿]/g;
const renderedWords = (lang, text) => {
  if (lang === "ja" || lang === "zh") {
    let cjk = 0;
    for (const ch of text) if (/[぀-ヿ㐀-鿿]/.test(ch)) cjk++;
    return Math.floor(cjk / 2) + text.replace(CJK, " ").split(/\s+/).filter(Boolean).length;
  }
  return text.split(/\s+/).filter(Boolean).length;
};
const mainText = (html) => {
  const start = html.search(/<main(?=[\s>])/i);
  const end = html.toLowerCase().lastIndexOf("</main>");
  if (start === -1 || end === -1) return null;
  const open = tagAt(html, start + "<main".length);
  let inner = dropRaw(html.slice(open.end, end), ["script", "style"]);
  inner = dropElements(inner, ["nav", "header", "footer", "svg"]);
  return textOf(inner);
};
let thinCompared = 0;
let maxDrift = 0;
for (const ap of articlePages) {
  if (ap.lang === "en") continue;
  const article = articles[ap.key];
  const locale = article && article.languages && article.languages[ap.lang];
  const pg = pages.get(cleanPath("/" + ap.permalink));
  const where = "/" + ap.permalink;
  if (!pg) { fail("thin", where, "article locale has no built page"); continue; }
  const text = mainText(fs.readFileSync(pg.file, "utf8"));
  if (text === null) { fail("thin", where, "built page has no <main>"); continue; }
  thinCompared++;
  const ruleWords = visibleWords(ap.lang, locale, article);
  const ruleThin = isThin(ap.lang, locale, article);
  const pageWords = renderedWords(ap.lang, text);
  maxDrift = Math.max(maxDrift, Math.abs(pageWords - ruleWords));
  const pageThin = pageWords < THIN_WORDS;
  if (ruleThin !== pageThin) fail("thin", where, `thin rule says ${ruleThin ? "thin" : "not thin"} (${ruleWords} words) but the built page has ${pageWords} words of main text (${pageThin ? "thin" : "not thin"}; threshold ${THIN_WORDS})`);
  if (ruleThin !== pg.noindex) fail("thin", where, `thin rule says ${ruleThin ? "thin" : "not thin"} but the page is ${pg.noindex ? "" : "not "}noindex`);
}

// -------------------------------------------------- Guard 8: translation length
// Warning only. Publish prints the same list for the articles it is given.
const short = shortTranslations(articles);

// ---------------------------------------------------------------------- report

// FAQ answers: on 2026-10-31 hundreds of translated pages already had a JSON-LD
// answer that is not on the page (the question is in the body, so article.njk
// does not render the FAQ block, and the body paraphrases the answer).
// scripts/seo-baseline.json lists those known cases so the build fails on any
// NEW one. A listed case that is fixed must be removed from the list (the entry
// would otherwise hide a later regression), which is why stale entries also fail.
// Regenerate with: node scripts/check-seo.js --update-baseline
const baselineFile = path.join(__dirname, "seo-baseline.json");
if (process.argv.includes("--update-baseline")) {
  const keys = [...new Set(answerMisses.map((m) => m.key))].sort();
  fs.writeFileSync(baselineFile, JSON.stringify({ faqAnswerNotVisible: keys }, null, 1) + "\n");
  console.log(`[check-seo] wrote ${keys.length} entries to scripts/seo-baseline.json`);
  process.exit(0);
}
const baseline = new Set(fs.existsSync(baselineFile) ? JSON.parse(fs.readFileSync(baselineFile, "utf8")).faqAnswerNotVisible || [] : []);
const missKeys = new Set(answerMisses.map((m) => m.key));
for (const m of answerMisses) if (!baseline.has(m.key)) errors.push(`[faq] ${m.msg}`);
for (const key of baseline) if (!missKeys.has(key)) errors.push(`[faq] scripts/seo-baseline.json: entry no longer needed, remove it: ${key.replace("\t", " | ")}`);

if (short.length) console.warn(`[check-seo] WARNING: ${formatShortTranslations(short)}`);
if (errors.length) {
  console.error(`\n[check-seo] ${errors.length} SEO regression(s):`);
  for (const e of [...new Set(errors)]) console.error("  " + e);
  process.exit(1);
}
console.log(`[check-seo] ok — ${pages.size} pages, ${sitemapUrls.length} sitemap URLs, ${clusters} hreflang pages, ${faqPages} FAQ pages, ${thinCompared} thin-rule comparisons (max word drift ${maxDrift}).`);
