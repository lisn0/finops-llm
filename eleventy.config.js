// Eleventy config for finopsllm.com.
// HTML pages render from src/ while static and edge files pass through byte-for-byte.
const fs = require("fs");

const SITE_URL = "https://finopsllm.com";
const LANGS = require("./src/_data/langs.js").filter((l) => l !== "en");
// Pages that exist but must never be advertised: the error page and the A/B
// variant of the homepage (it canonicals to "/").
const SITEMAP_SKIP = new Set(["/404.html", "/index-v2.html"]);

// Collections only ever contain the first page of a paginated template, so the
// data-driven article pages (src/articles.njk) are invisible to getAll(). Read
// them from the same data file the template paginates over.
const articlePages = require("./src/_data/articlePages.js")();
const articles = require("./src/_data/articles.js")();

// Strip the .html and any trailing index so the sitemap advertises the same
// extensionless URLs the site links internally.
const cleanUrl = (url) => url.replace(/index\.html$/, "").replace(/\.html$/, "");

// Every article already carries datePublished/dateModified inside its JSON-LD.
// Read it from there rather than duplicating the date in frontmatter; fall back
// to the source file's mtime so a page can never land without a lastmod.
const lastmodOf = (item) => {
  const blob =
    JSON.stringify(item.data.head?.jsonLd || "") +
    JSON.stringify(item.data.head?.article || "") +
    JSON.stringify(item.data.article || "");
  const m = blob.match(/dateModified\W+(\d{4}-\d{2}-\d{2})/) || blob.match(/datePublished\W+(\d{4}-\d{2}-\d{2})/);
  if (m) return m[1];
  return fs.statSync(item.inputPath).mtime.toISOString().slice(0, 10);
};

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
  return index;
})();

const hreflangsFor = (url) => {
  const m = url.match(/^\/(?:([a-z]{2})\/)?research\/([^/]+?)(?:\.html)?\/?$/);
  if (!m) return [];
  const langs = localesForSlug.get(m[2]) || [];
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
const decodeEntities = (s) =>
  (s || "")
    .replace(/&middot;/g, "·").replace(/&mdash;/g, "—").replace(/&ndash;/g, "–")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&rsquo;/g, "’")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");

const generatedLd = (head, url) => {
  if (!head || !head.article) return [];
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
      image: SITE_URL + "/og.png",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: labels[0], item: `${SITE_URL}${prefix}/` },
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
  if (head.faq && head.faq.length) {
    nodes.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: head.faq.map((f) => ({
        "@type": "Question",
        name: decodeEntities(f.q),
        acceptedAnswer: { "@type": "Answer", text: decodeEntities(f.a) },
      })),
    });
  }
  return nodes.map((n) => JSON.stringify(n));
};

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("generatedLd", generatedLd);
  eleventyConfig.addFilter("hreflangsFor", hreflangsFor);

  // Utility pages (about, terms, tools…) ship no schema and no date, so an AI
  // answer engine has nothing to attribute and cites them without a link, if at
  // all. Inject a WebPage node wherever the page carries no dateModified —
  // valid alongside any existing block, and the date is the source file mtime
  // so freshness is real rather than a hardcoded build stamp.
  eleventyConfig.addTransform("webPageSchema", function (content) {
    if (!this.page.outputPath?.endsWith(".html")) return content;
    if (/dateModified/.test(content)) return content;
    const url = "https://finopsllm.com" + this.page.url;
    const node = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": url + "#webpage",
      url,
      name: (content.match(/<title>([\s\S]*?)<\/title>/i) || [])[1]?.trim(),
      description: (content.match(/<meta name="description" content="([^"]*)"/i) || [])[1],
      dateModified: require("fs").statSync(this.page.inputPath).mtime.toISOString().slice(0, 10),
      isPartOf: { "@id": "https://finopsllm.com/#website" },
      publisher: { "@id": "https://finopsllm.com/#org" },
    };
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
    const fromData = articlePages.map((p) => ({
      loc: SITE_URL + cleanUrl("/" + p.permalink),
      lastmod: articles[p.key].dateModified || articles[p.key].datePublished,
      lang: p.lang,
      priority: "0.9",
    }));
    return api
      .getAll()
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
      .concat(fromData)
      // A/B variants canonical to their control, so listing them asks crawlers to
      // index a URL that disclaims itself. They reach the sitemap from both
      // sources above, hence the filter here rather than in either one.
      .filter((u) => !/-v2$/.test(u.loc))
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
      if (item.url.includes("-v2")) continue;
      const lang = LANGS.find((l) => item.url.startsWith("/" + l + "/")) || "en";
      // head.title carries the " · FinOps LLM" suffix; the index only wants the topic.
      const title = (item.data.head?.title || item.url).split(" · ")[0];
      byLang[lang].push({ url: cleanUrl(item.url), title, slug: item.url.split("/research/")[1].replace(".html", "") });
    }
    for (const p of articlePages) {
      if (p.permalink.includes("-v2")) continue;
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
