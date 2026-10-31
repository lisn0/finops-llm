// Eleventy config for finopsllm.com.
// HTML pages render from src/ while static and edge files pass through byte-for-byte.
const fs = require("fs");

const SITE_URL = "https://finopsllm.com";
const LANGS = require("./src/_data/langs.js").filter((l) => l !== "en");
// Pages that exist but must never be advertised: the error page and the A/B
// variant of the homepage (it canonicals to "/").
const SITEMAP_SKIP = new Set(["/404.html"]);

// Collections only ever contain the first page of a paginated template, so the
// data-driven article pages (src/articles.njk) are invisible to getAll(). Read
// them from the same data file the template paginates over.
const articlePages = require("./src/_data/articlePages.js")();
const articles = require("./src/_data/articles.js")();
const { decodeEntities, faqNotInBody, thinLocalesBySlug } = require("./lib/thin-pages.js");

// Thin translated pages (see lib/thin-pages.js): "research/<slug>" -> locales.
// They are noindexed, so they stay out of the sitemaps and of every hreflang
// cluster.
const thinBySlug = thinLocalesBySlug(articles);
const isThinPage = (slug, lang) => (thinBySlug["research/" + slug] || []).includes(lang);

// Strip the .html and any trailing index so the sitemap advertises the same
// extensionless URLs the site links internally.
const cleanUrl = (url) => url.replace(/index\.html$/, "").replace(/\.html$/, "");

// A utility page (about, terms, tools, locale hubs…) states its own date as a
// top-level `dateModified` in frontmatter, set to the day of its last content
// change. File mtime is not an option: every deploy checks the repo out fresh,
// so mtime re-stamped all of these pages on each release.
const frontmatterDate = (inputPath) => {
  try {
    const src = fs.readFileSync(inputPath, "utf8");
    const fm = src.match(/^---(?:json)?\r?\n([\s\S]*?)\r?\n---/);
    const m = fm && fm[1].match(/(?:^|\n)\s*"?dateModified"?\s*:\s*"?(\d{4}-\d{2}-\d{2})/);
    return m ? m[1] : undefined;
  } catch {
    return undefined;
  }
};

// Every article already carries datePublished/dateModified inside its JSON-LD.
// Read it from there rather than duplicating the date in frontmatter. A page
// with neither returns undefined and the sitemap omits its lastmod rather than
// inventing one.
const lastmodOf = (item) => {
  const blob =
    JSON.stringify(item.data.head?.jsonLd || "") +
    JSON.stringify(item.data.head?.article || "") +
    JSON.stringify(item.data.article || "");
  const m = blob.match(/dateModified\W+(\d{4}-\d{2}-\d{2})/) || blob.match(/datePublished\W+(\d{4}-\d{2}-\d{2})/);
  if (m) return m[1];
  return frontmatterDate(item.inputPath);
};

// Locales that have their own marketing home page (src/{l}/index.njk). Every
// locale has a /research hub, but the rest send "Home" to the English page.
const HOME_LANGS = ["de", "es", "fr", "ja", "pt"];

// Research pages used to carry their TechArticle/BreadcrumbList/FAQPage as
// hand-escaped JSON strings in frontmatter. They drifted: 94 pages had a
// headline that no longer matched their own <title>, 106 the same for
// description. Everything except the dates, the short breadcrumb label and the
// FAQ text is derivable from fields the page already declares, so it is derived
// here instead of copied per page.
const BREADCRUMB_LABELS = {
  en: ["Home", "Research"],
  de: ["Startseite", "Forschung"],
  es: ["Inicio", "Investigación"],
  fr: ["Accueil", "Recherche"],
  ja: ["ホーム", "リサーチ"],
  pt: ["Início", "Pesquisa"],
  it: ["Home", "Ricerca"],
  ko: ["홈", "리서치"],
  zh: ["首页", "研究"],
  nl: ["Home", "Onderzoek"],
  ar: ["الرئيسية", "أبحاث"],
  ru: ["Главная", "Исследования"],
  tr: ["Ana sayfa", "Araştırma"],
  pl: ["Strona główna", "Badania"],
  id: ["Beranda", "Riset"],
  vi: ["Trang chủ", "Nghiên cứu"],
};


// Which locales actually have a file for a given research slug. Hand-listed
// hreflang was present on only 143 of 203 pages and had no way to stay honest
// when a translation was added or removed; the filesystem always knows.
const localesForSlug = (() => {
  const index = new Map();
  for (const lang of ["en", ...LANGS]) {
    const dir = lang === "en" ? "src/research" : `src/${lang}/research`;
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir)) {
      if (!name.endsWith(".njk")) continue;
      const slug = name.slice(0, -4);
      if (!index.has(slug)) index.set(slug, []);
      index.get(slug).push(lang);
    }
  }
  // Translations that ship from _data/articles/*.json have no .njk on disk, so
  // the filesystem scan alone would let the English page stop declaring
  // alternates the moment a locale exists only in JSON.
  const jsonDir = "src/_data/articles";
  if (fs.existsSync(jsonDir)) {
    for (const name of fs.readdirSync(jsonDir)) {
      if (!name.endsWith(".json")) continue;
      const data = JSON.parse(fs.readFileSync(`${jsonDir}/${name}`, "utf8"));
      const slug = (data.slug || "").split("/").pop() || name.slice(0, -5);
      index.set(slug, [...new Set([...(index.get(slug) || []), ...Object.keys(data.languages || {})])]);
    }
  }
  return index;
})();

const hreflangsFor = (url) => {
  // The /research hubs: every locale has one, so the cluster is the full set.
  if (/^\/(?:[a-z]{2}\/)?research(?:\.html)?\/?$/.test(url)) {
    const hub = (lang) => `${SITE_URL}${lang === "en" ? "" : "/" + lang}/research`;
    return [
      ...["en", ...LANGS].map((lang) => ({ lang, href: hub(lang) })),
      { lang: "x-default", href: hub("en") },
    ];
  }
  const m = url.match(/^\/(?:([a-z]{2})\/)?research\/([^/]+?)(?:\.html)?\/?$/);
  if (!m) return [];
  // A noindexed thin locale neither declares nor receives hreflang.
  const self = m[1] || "en";
  if (isThinPage(m[2], self)) return [];
  const langs = (localesForSlug.get(m[2]) || []).filter((l) => !isThinPage(m[2], l));
  if (langs.length < 2) return [];
  const href = (lang) => `${SITE_URL}${lang === "en" ? "" : "/" + lang}/research/${m[2]}`;
  return [
    ...langs.map((lang) => ({ lang, href: href(lang) })),
    { lang: "x-default", href: href("en") },
  ];
};

// Frontmatter titles are written for HTML, so some carry entities. Script bodies
// are not entity-decoded, so copying one straight into JSON-LD publishes a
// literal "&middot;" as part of the headline.
// decodeEntities, plainText and faqNotInBody live in lib/thin-pages.js so the
// thin-page word count sees exactly the text article.njk renders.

const faqNode = (faq) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({
    "@type": "Question",
    name: decodeEntities(f.q),
    acceptedAnswer: { "@type": "Answer", text: decodeEntities(f.a) },
  })),
});

const generatedLd = (head, url) => {
  if (!head) return [];
  // A non-article page can still declare `faq` (e.g. /book) and deserves the
  // FAQPage node — only the TechArticle/BreadcrumbList pair needs `article`.
  if (!head.article) return head.faq && head.faq.length ? [JSON.stringify(faqNode(head.faq))] : [];
  const lang = (url.match(/^\/([a-z]{2})\//) || [])[1] || "en";
  const titleCore = decodeEntities(head.title).replace(/ · FinOps LLM$/, "");
  const labels = BREADCRUMB_LABELS[lang] || BREADCRUMB_LABELS.en;
  const prefix = lang === "en" ? "" : "/" + lang;
  const nodes = [
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: titleCore,
      description: decodeEntities(head.description),
      author: { "@type": "Organization", name: "FinOps LLM team" },
      publisher: { "@type": "Organization", name: "FinOps LLM", url: SITE_URL + "/" },
      datePublished: head.article.datePublished,
      dateModified: head.article.dateModified || head.article.datePublished,
      url: head.canonical,
      mainEntityOfPage: { "@type": "WebPage", "@id": head.canonical },
      inLanguage: lang,
      image: SITE_URL + "/og.png",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: labels[0], item: `${SITE_URL}${HOME_LANGS.includes(lang) ? prefix : ""}/` },
        { "@type": "ListItem", position: 2, name: labels[1], item: `${SITE_URL}${prefix}/research` },
        {
          "@type": "ListItem",
          position: 3,
          name: decodeEntities(head.article.breadcrumb) || titleCore,
          item: head.canonical,
        },
      ],
    },
  ];
  if (head.faq && head.faq.length) nodes.push(faqNode(head.faq));
  return nodes.map((n) => JSON.stringify(n));
};

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("generatedLd", generatedLd);
  eleventyConfig.addFilter("hreflangsFor", hreflangsFor);
  eleventyConfig.addFilter("decodeEntities", decodeEntities);
  eleventyConfig.addFilter("faqNotInBody", faqNotInBody);

  // Localized pages used to link to the English article even when the same
  // article exists in their own language (2,045 links on the live site), which
  // sent readers and link equity back out of the locale. Rewrite those links
  // when the translated twin exists. It runs on the built page, not on the JSON,
  // so hand-written and data-driven articles are covered by one rule, and the
  // language switcher (whose EN link must stay English) is left alone.
  eleventyConfig.addTransform("localizedBodyLinks", function (content) {
    if (!this.page.outputPath?.endsWith(".html")) return content;
    const lang = LANGS.find((l) => this.page.url.startsWith("/" + l + "/"));
    if (!lang) return content;
    const start = content.indexOf("<main");
    const end = content.lastIndexOf("</main>");
    if (start < 0 || end < 0) return content;
    const main = content.slice(start, end).replace(
      /(<nav class="langsw"[\s\S]*?<\/nav>)|href=(["'])\/research(?:\/([a-z0-9][a-z0-9-]*))?([#?][^"']*)?\2/g,
      (m, switcher, quote, slug, tail) => {
        if (switcher) return switcher;
        if (slug && !(localesForSlug.get(slug) || []).includes(lang)) return m;
        return `href=${quote}/${lang}/research${slug ? "/" + slug : ""}${tail || ""}${quote}`;
      }
    );
    return content.slice(0, start) + main + content.slice(end);
  });

  // Utility pages (about, terms, tools…) ship no schema and no date, so an AI
  // answer engine has nothing to attribute and cites them without a link, if at
  // all. Inject a WebPage node wherever the page carries no dateModified —
  // valid alongside any existing block. The date is the page's own frontmatter
  // `dateModified`; a page that states none gets the node without a date.
  eleventyConfig.addTransform("webPageSchema", function (content) {
    if (!this.page.outputPath?.endsWith(".html")) return content;
    if (/dateModified/.test(content)) return content;
    // Prefer the page's own canonical: A/B variants (index-v2) canonical to the
    // control, so keying the WebPage node off page.url made the schema claim a
    // different URL than the canonical tag one line above it.
    const url = (content.match(/<link rel="canonical" href="([^"]+)"/i) || [])[1] || "https://finopsllm.com" + this.page.url;
    const node = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": url + "#webpage",
      url,
      name: (content.match(/<title>([\s\S]*?)<\/title>/i) || [])[1]?.trim(),
      description: (content.match(/<meta name="description" content="([^"]*)"/i) || [])[1],
      dateModified: frontmatterDate(this.page.inputPath),
      isPartOf: { "@id": "https://finopsllm.com/#website" },
      publisher: { "@id": "https://finopsllm.com/#org" },
    };
    if (!node.dateModified) delete node.dateModified;
    if (!node.name) delete node.name;
    if (!node.description) delete node.description;
    const tag = `<script type="application/ld+json">${JSON.stringify(node)}</script>`;
    return content.includes("</head>") ? content.replace("</head>", tag + "</head>") : content.replace("</body>", tag + "</body>");
  });

  // The sitemap XML used to be seven hand-maintained files. Every page added
  // since drifted out of it until someone noticed, which is what orphaned
  // /research/* from search. Derive it from the build instead.
  eleventyConfig.addCollection("sitemap", (api) => {
    const seen = new Set();
    const fromData = articlePages.filter((p) => !(thinBySlug[articles[p.key].slug || "research/" + p.key] || []).includes(p.lang)).map((p) => ({
      loc: SITE_URL + cleanUrl("/" + p.permalink),
      lastmod: articles[p.key].languages[p.lang].dateModified || articles[p.key].dateModified || articles[p.key].datePublished,
      lang: p.lang,
      priority: "0.9",
    }));
    return fromData
      .concat(api.getAll()
      .filter((item) => {
        const url = item.url;
        if (!url || !(url.endsWith(".html") || url.endsWith("/"))) return false;
        if (SITEMAP_SKIP.has(url)) return false;
        if (item.data.sitemap === false) return false;
        if ((item.data.head?.robots || "").includes("noindex")) return false;
        // A page that canonicals elsewhere belongs to that URL, not its own.
        const canonical = item.data.head?.canonical;
        if (canonical && canonical !== SITE_URL + cleanUrl(url)) return false;
        return true;
      })
      .map((item) => ({
        loc: SITE_URL + cleanUrl(item.url),
        lastmod: lastmodOf(item),
        // Locale comes from the URL, not frontmatter: the `lang` values drifted
        // (pt pages say "pt-BR") and a typo there would silently empty a sitemap.
        lang: LANGS.find((l) => item.url.startsWith("/" + l + "/")) || "en",
        // The homepages get crawled most; research beats the rest of the site.
        priority: cleanUrl(item.url).replace(/\/$/, "").split("/").filter(Boolean).length === 0 ? "1.0" : item.url.includes("/research/") ? "0.9" : "0.7",
      }))
      )
      // A/B variants canonical to their control, so listing them asks crawlers to
      // index a URL that disclaims itself. They reach the sitemap from both
      // sources above, hence the filter here rather than in either one.
      .filter((u) => !/-v2$/.test(u.loc))
      // fromData is first on purpose: the first page of the paginated
      // articles.njk also shows up in getAll(), with no head data of its own, and
      // keeping that copy gave /research/adaptive-thinking-cost-forecast a
      // lastmod from the template instead of the article's dateModified.
      .filter((u) => !seen.has(u.loc) && seen.add(u.loc))
      .sort((a, b) => a.loc.localeCompare(b.loc));
  });

  // Every research article, grouped by locale, for the A–Z block on each
  // /research index. Those indexes are hand-written and drift behind the actual
  // articles, which orphans the new ones from the internal link graph.
  eleventyConfig.addCollection("research", (api) => {
    const byLang = { en: [] };
    for (const l of LANGS) byLang[l] = [];
    for (const item of api.getAll()) {
      if (!item.url || !item.url.includes("/research/")) continue;
      // Only an A/B variant ends in "-v2". A bare substring test also dropped
      // mimo-v2-6-open-weights-price-ceiling (a model name) from every hub.
      if (/-v2(?:\.html)?$/.test(item.url)) continue;
      const lang = LANGS.find((l) => item.url.startsWith("/" + l + "/")) || "en";
      // head.title carries the " · FinOps LLM" suffix; the index only wants the topic.
      // No head.title (e.g. pagination items): skip; articlePages below supplies the titleCore.
      if (!item.data.head?.title) continue;
      const title = item.data.head.title.split(" · ")[0];
      byLang[lang].push({ url: cleanUrl(item.url), title, slug: item.url.split("/research/")[1].replace(".html", "") });
    }
    for (const p of articlePages) {
      if (/-v2(?:\.html)?$/.test(p.permalink)) continue;
      const url = cleanUrl("/" + p.permalink);
      if (byLang[p.lang].some((a) => a.url === url)) continue;
      byLang[p.lang].push({ url, title: articles[p.key].languages[p.lang].titleCore, slug: p.permalink.split("research/")[1].replace(".html", "") });
    }
    // A locale index also links the English articles it has no translation of —
    // otherwise those pages are reachable from the English index only, and a
    // reader who lands in /de/ hits a dead end.
    for (const l of LANGS) {
      const translated = new Set(byLang[l].map((a) => a.slug));
      byLang[l].push(...byLang.en.filter((a) => !translated.has(a.slug)).map((a) => ({ ...a, en: true })));
    }
    for (const list of Object.values(byLang)) list.sort((a, b) => a.title.localeCompare(b.title));
    return byLang;
  });

  // Format date as "D Month YYYY" (e.g., "12 July 2026")
  eleventyConfig.addFilter("formatDate", (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00Z");
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  });

  // Return the keys of an object as an array.
  eleventyConfig.addFilter("keys", (obj) => Object.keys(obj || {}));

  // Update visible date in content: replace the date part of "<p class="updated">Label · OldDate</p>"
  // or just "<p class="updated">OldDate</p>" with dateModified. Preserves any label.
  eleventyConfig.addFilter("updateVisibleDate", (content, dateModified, datePublished) => {
    if (!content || !dateModified) return content;
    const displayDate = new Date(dateModified + "T00:00:00Z").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    // First try pattern with label and separator: "Label · OldDate"
    let result = content.replace(
      /<p class="updated">([^·]*·\s*)[^<]*(<\/p>)/,
      `<p class="updated">$1${displayDate}$2`
    );
    // If that didn't match, try just the date: "OldDate" (no label)
    if (result === content) {
      result = content.replace(
        /<p class="updated">[^<]*(<\/p>)/,
        `<p class="updated">${displayDate}$1`
      );
    }
    return result;
  });

  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/.well-known");
  eleventyConfig.addPassthroughCopy({ "src/.assetsignore": ".assetsignore" });
  eleventyConfig.addPassthroughCopy({ "src/9f7a91c496064b7e96137c3326d9b895.txt": "9f7a91c496064b7e96137c3326d9b895.txt" });
  eleventyConfig.addPassthroughCopy({ "src/README.md": "README.md" });
  eleventyConfig.addPassthroughCopy({ "src/_headers": "_headers" });
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });
  // Browsers request /favicon.ico implicitly — no <link> tag needed. Safari also
  // ignores SVG favicons entirely, so the .ico is its only icon.
  eleventyConfig.addPassthroughCopy({ "src/favicon.ico": "favicon.ico" });
  eleventyConfig.addPassthroughCopy({ "src/favicon.svg": "favicon.svg" });
  // shell.njk links this on every page; without the passthrough it 404s sitewide.
  eleventyConfig.addPassthroughCopy({ "src/apple-touch-icon.png": "apple-touch-icon.png" });
  eleventyConfig.addPassthroughCopy({ "src/openapi.json": "openapi.json" });
  eleventyConfig.addPassthroughCopy({ "src/auth.md": "auth.md" });
  eleventyConfig.addPassthroughCopy({ "src/health.json": "health.json" });
  eleventyConfig.addPassthroughCopy({ "src/og.png": "og.png" });
  eleventyConfig.addPassthroughCopy({ "src/og.svg": "og.svg" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "src/site.webmanifest": "site.webmanifest" });
  eleventyConfig.addPassthroughCopy({ "src/worker.js": "worker.js" });
  eleventyConfig.addPassthroughCopy({ "src/wrangler.jsonc": "wrangler.jsonc" });

  return {
    dir: { input: "src", includes: "_includes", output: "_site" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "html"],
  };
};
