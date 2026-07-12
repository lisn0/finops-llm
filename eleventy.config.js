// Eleventy config for finopsllm.com.
// HTML pages render from src/ while static and edge files pass through byte-for-byte.
module.exports = function (eleventyConfig) {
  // Format date as "D Month YYYY" (e.g., "12 July 2026")
  eleventyConfig.addFilter("formatDate", (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00Z");
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  });

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
  eleventyConfig.addPassthroughCopy({ "src/favicon.svg": "favicon.svg" });
  eleventyConfig.addPassthroughCopy({ "src/llms.txt": "llms.txt" });
  eleventyConfig.addPassthroughCopy({ "src/og.png": "og.png" });
  eleventyConfig.addPassthroughCopy({ "src/og.svg": "og.svg" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "src/site.webmanifest": "site.webmanifest" });
  eleventyConfig.addPassthroughCopy({ "src/sitemap-de.xml": "sitemap-de.xml" });
  eleventyConfig.addPassthroughCopy({ "src/sitemap-es.xml": "sitemap-es.xml" });
  eleventyConfig.addPassthroughCopy({ "src/sitemap-fr.xml": "sitemap-fr.xml" });
  eleventyConfig.addPassthroughCopy({ "src/sitemap-index.xml": "sitemap-index.xml" });
  eleventyConfig.addPassthroughCopy({ "src/sitemap-ja.xml": "sitemap-ja.xml" });
  eleventyConfig.addPassthroughCopy({ "src/sitemap.xml": "sitemap.xml" });
  eleventyConfig.addPassthroughCopy({ "src/worker.js": "worker.js" });
  eleventyConfig.addPassthroughCopy({ "src/wrangler.jsonc": "wrangler.jsonc" });

  return {
    dir: { input: "src", includes: "_includes", output: "_site" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "html"],
  };
};
