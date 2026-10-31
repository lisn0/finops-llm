// Single definition of a "thin" translated research page. A non-English locale
// of a JSON article whose reader-visible text is shorter than THIN_WORDS is
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
const faqNotInBody = (faq, body) => {
  const haystack = plainText(body);
  return (faq || []).filter((f) => !haystack.includes(plainText(f.question)));
};

const CJK_RE = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu;
const WORD_LIKE_RE = /[\p{L}\p{N}]/u;

const countWords = (lang, text) => {
  if (lang === "ja" || lang === "zh") {
    const cjk = (text.match(CJK_RE) || []).length;
    const rest = text.replace(CJK_RE, " ").split(/\s+/).filter((t) => WORD_LIKE_RE.test(t)).length;
    return cjk / 2 + rest;
  }
  return text.split(/\s+/).filter(Boolean).length;
};

// Words a reader sees: the body plus the FAQ entries article.njk appends.
const visibleWords = (lang, locale) => {
  const shown = faqNotInBody(locale.faq, locale.body);
  const text = [locale.body, ...shown.flatMap((f) => [f.question, f.answer])]
    .map((s) => plainText(s))
    .join(" ");
  return countWords(lang, text);
};

const isThin = (lang, locale) => lang !== "en" && !!locale && visibleWords(lang, locale) < THIN_WORDS;

// { "research/<slug>": ["de", ...] } for every article with a thin locale.
const thinLocalesBySlug = (articles) => {
  const out = {};
  for (const [key, article] of Object.entries(articles)) {
    const thin = Object.entries(article.languages || {})
      .filter(([lang, locale]) => isThin(lang, locale))
      .map(([lang]) => lang);
    if (thin.length) out[article.slug || "research/" + key] = thin;
  }
  return out;
};

module.exports = { THIN_WORDS, isThin, visibleWords, thinLocalesBySlug, decodeEntities, plainText, faqNotInBody };
