// Single definition of a "thin" translated research page. A non-English locale
// of a JSON article whose reader-visible main content (see visibleText) is shorter than THIN_WORDS is
// served (200, linked from its hub and language switcher) but kept out of the
// index: robots "noindex, follow", no sitemap entry, no hreflang in either
// direction. Everything derives from the article data at build time, so a
// translation that is later expanded past the threshold becomes indexable on
// the next build with no list to update.
//
// Used by eleventy.config.js, src/_data/thinPages.js (templates) and
// scripts/publish-articles.mjs.
const THIN_WORDS = 300;

const decodeEntities = (s) =>
  (s || "")
    .replace(/&middot;/g, "·").replace(/&mdash;/g, "—").replace(/&ndash;/g, "–")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&rsquo;/g, "’")
    .replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

// Tags stripped (script/style bodies are not reader-visible), entities decoded.
const plainText = (s) =>
  decodeEntities(
    String(s || "")
      .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]*>/g, " ")
  ).replace(/\s+/g, " ").trim().toLowerCase();

// The FAQ entries whose question is not already in the body; article.njk
// renders exactly these in its own FAQ section.
// Malformed content (a faq or related that is not an array, or has null
// entries) is treated as absent here; scripts/publish-articles.mjs reports it
// with a readable message instead.
const asObjects = (list) => (Array.isArray(list) ? list.filter((x) => x && typeof x === "object") : []);

const faqNotInBody = (faq, body) => {
  const haystack = plainText(body);
  return asObjects(faq).filter((f) => !haystack.includes(plainText(f.question)));
};

// Kana (U+3040-30FF, which includes ー and ・) and Han (U+3400-9FFF). CJK
// punctuation and full-width forms fall outside, so they stay in the
// whitespace-split remainder like any other token.
const CJK_RE = /[぀-ヿ㐀-鿿]/g;

const countWords = (lang, text) => {
  if (lang === "ja" || lang === "zh") {
    const cjk = (text.match(CJK_RE) || []).length;
    const rest = text.replace(CJK_RE, " ").split(/\s+/).filter(Boolean).length;
    return Math.floor(cjk / 2) + rest;
  }
  return text.split(/\s+/).filter(Boolean).length;
};

const ARTICLE_UI = require("../src/_data/articleUi.js");

const formatDate = (d) =>
  d ? new Date(d + "T00:00:00Z").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }) : "";

// Everything article.njk renders inside <main> for one locale, except the
// breadcrumb and language-switcher navs and the site header/footer (chrome,
// not content): H1, the updated/published line, the agent summary, the body,
// the FAQ entries it appends, related-article labels, the closing call to
// action and the back link. The meta description is not rendered, so it is not
// counted. Mirrors the template; keep the two in step.
const visibleText = (lang, locale, article) => {
  const ui = ARTICLE_UI[lang] || ARTICLE_UI.en;
  const body = String(locale.body || "").replace(/<(nav|header|footer|svg)\b[\s\S]*?<\/\1>/gi, " ");
  const modified = locale.dateModified || article.dateModified;
  const parts = [
    locale.titleCore || locale.title,
    `${ui.updated} ${formatDate(modified)} · ${ui.published} ${formatDate(article.datePublished)}`,
  ];
  // `striptags | truncate(200)` in the template: tags stripped (entities left
  // as-is), cut at 200 characters back to the last space, plus an ellipsis.
  if (article.agentMode) {
    let summary = body.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    if (summary.length > 200) {
      let idx = summary.lastIndexOf(" ", 200);
      if (idx === -1) idx = 200;
      summary = summary.slice(0, idx) + "...";
    }
    parts.push(ui.quick + ": " + summary);
  }
  parts.push(body);
  const shown = faqNotInBody(locale.faq, body);
  if (shown.length) parts.push(ui.faq, ...shown.flatMap((f) => [f.question, f.answer]));
  const related = asObjects(locale.related);
  if (related.length) parts.push(ui.related, ...related.map((r) => r.label));
  parts.push(ui.bottomLead, ui.bottomBody, ui.auditButton + " →", ui.back);
  return parts.map((s) => plainText(s)).join(" ");
};

const visibleWords = (lang, locale, article) => countWords(lang, visibleText(lang, locale, article));

const isThin = (lang, locale, article) => lang !== "en" && !!locale && visibleWords(lang, locale, article) < THIN_WORDS;

// { "research/<slug>": ["de", ...] } for every article with a thin locale.
const thinLocalesBySlug = (articles) => {
  const out = {};
  for (const [key, article] of Object.entries(articles)) {
    const thin = Object.entries(article.languages || {})
      .filter(([lang, locale]) => isThin(lang, locale, article))
      .map(([lang]) => lang);
    if (thin.length) out[article.slug || "research/" + key] = thin;
  }
  return out;
};

// Translation length. A non-English article body far shorter than its English
// source is usually a truncated or summarised translation. Compares body text
// only (not the shared chrome that visibleText adds), with the CJK-adjusted
// word count, and returns the offenders worst first.
const TRANSLATION_MIN_RATIO = 0.5;

const bodyWords = (lang, locale) =>
  countWords(
    lang,
    plainText(String((locale && locale.body) || "").replace(/<(nav|header|footer|svg)\b[\s\S]*?<\/\1>/gi, " "))
  );

const shortTranslations = (articles, minRatio = TRANSLATION_MIN_RATIO) => {
  const out = [];
  for (const [key, article] of Object.entries(articles)) {
    const langs = (article && article.languages) || {};
    if (!langs.en) continue;
    const enWords = bodyWords("en", langs.en);
    if (!enWords) continue;
    for (const [lang, locale] of Object.entries(langs)) {
      if (lang === "en" || !locale) continue;
      const words = bodyWords(lang, locale);
      if (words < enWords * minRatio) {
        out.push({ key, slug: article.slug || "research/" + key, lang, words, enWords, ratio: words / enWords });
      }
    }
  }
  return out.sort((a, b) => a.ratio - b.ratio);
};

const formatShortTranslations = (list, limit = 10) =>
  `${list.length} translated page(s) have a body under ${TRANSLATION_MIN_RATIO * 100}% of the English word count; worst ${Math.min(limit, list.length)}:\n` +
  list.slice(0, limit).map((s) => `  ${s.lang}/${s.slug}: ${s.words} words vs ${s.enWords} en (${Math.round(s.ratio * 100)}%)`).join("\n");

module.exports = { THIN_WORDS, TRANSLATION_MIN_RATIO, isThin, visibleWords, visibleText, thinLocalesBySlug, decodeEntities, plainText, faqNotInBody, countWords, bodyWords, shortTranslations, formatShortTranslations };
