// One entry per (article, language) that actually has translated content.
// Adding a language to an article's JSON in _data/articles/ is all it takes to
// publish it — no per-locale .njk stub to write and no risk of a stub existing
// for a translation that was never written (which silently served English text
// under <html lang="de">).
const articles = require("./articles.js")();

module.exports = function () {
  return Object.entries(articles).flatMap(([key, article]) =>
    Object.keys(article.languages || {}).map((lang) => ({
      key,
      lang,
      permalink: (lang === "en" ? "" : lang + "/") + (article.slug || "research/" + key) + ".html",
    }))
  );
};
