# FinOps LLM — [finopsllm.com](https://finopsllm.com)

Static research site for **LLM FinOps**: making the cost of large-language-model
workloads visible, attributable, and controllable. Live at **https://finopsllm.com**.

## What's here

A research hub plus high-intent guides on LLM cost management, attribution, and
governance. Start points:

- [What is LLM FinOps](https://finopsllm.com/research/what-is-llm-finops)
- [GenAI cost management](https://finopsllm.com/research/genai-cost-management) — controls, analytics, and strategy
- [LLM cost attribution](https://finopsllm.com/research/what-is-llm-cost-attribution)
- [LLM cost dashboard](https://finopsllm.com/research/llm-cost-dashboard)
- [On-prem LLM FinOps](https://finopsllm.com/research/on-prem-llm-finops)
- [Full research index](https://finopsllm.com/research)

Discovery files: [sitemap.xml](https://finopsllm.com/sitemap.xml) ·
[llms.txt](https://finopsllm.com/llms.txt) ·
[robots.txt](https://finopsllm.com/robots.txt)

## Stack

Built with [Eleventy](https://www.11ty.dev/) and [Nunjucks](https://mozilla.github.io/nunjucks/), then deployed as a static site to Cloudflare Pages.

- `src/*.njk`, `src/research/*.njk`, `src/<locale>/**/*.njk` — page source
- `src/_includes/shell.njk` — data-driven layout for research/guides (inline head from JSON front matter)
- `src/_includes/home-shell.njk` — legacy-style wrapper for the 6 localized homepages
- `_headers`, `_redirects`, `worker.js` — Cloudflare: security headers, `/book` redirect, edge Markdown-for-agents
- `robots.txt`, `sitemap.xml`, `llms.txt`, `.well-known/` — crawler + agent discovery
- `assets/consent.js` — Google Consent Mode v2 + cookie banner (GA4 `G-5BB5KVZCL3`)
- `assets/attribution.js` — first-party source attribution for the `/book` funnel (see below)
- `assets/lang.js` — language switcher for the `es`/`fr`/`de`/`ja` locale pages
- `scripts/diff-site.mjs` — build diff harness against the golden snapshot

## Build

```bash
npm install
npm run build      # outputs to ./_site
npm test           # crawler + translation-sync checks
node scripts/diff-site.mjs   # verify output matches ./_site.golden
```

The golden snapshot (`_site.golden/`) is the SEO/GEO contract: if `npm run build && node scripts/diff-site.mjs` does not report `All 235 files match.`, the refactor introduced a visible regression.

## Adding a page

Research articles and guide pages use the shared `shell.njk` layout. Create a `---json` front-matter file with a `head` object and a `{% block body %}` content block:

```nunjucks
---json
{
  "permalink": "research/my-topic.html",
  "lang": "en",
  "head": {
    "title": "My topic · FinOps LLM",
    "description": "One-line summary for search and social previews.",
    "robots": "index, follow",
    "canonical": "https://finopsllm.com/research/my-topic",
    "hreflang": [
      { "lang": "en", "href": "https://finopsllm.com/research/my-topic" }
    ],
    "openGraph": [
      { "property": "og:title", "content": "My topic · FinOps LLM" },
      { "property": "og:description", "content": "One-line summary." }
    ],
    "style": "article{max-width:760px;margin:0 auto}"
  }
}
---
{% extends "shell.njk" %}{% block body %}
<h1>My topic</h1>
<p>Body content goes here.</p>
{% endblock %}
```

Supported `head` fields mirror the tags emitted by the old hand-written pages: `title`, `description`, `keywords`, `robots`, `themeColor`, `verification`, `canonical`, `hreflang`, `openGraph`, `twitter`, `links`, `fontStylesheet`, `style`, `scripts`, `jsonLd`.

The 6 localized homepages (`index.njk`, `de/index.njk`, `es/index.njk`, `fr/index.njk`, `ja/index.njk`, `pt/index.njk`) keep their original full-HTML skeleton and extend `home-shell.njk` instead, because they carry custom headers, footers, and `<main id="main">` markup.

## Booking attribution

`assets/attribution.js` records the visit's first-touch source (AI assistant /
search / social / direct) in `sessionStorage` and fires a GA4 `book_click` event
when a visitor clicks the booking CTA — only after analytics consent is granted.
To break bookings down by source, register the event params `book_source`,
`book_medium`, and `landing_page` as event-scoped custom dimensions in GA4.

## Local preview

Open `index.html` in a browser, or serve the directory with any static file
server (e.g. `python3 -m http.server`).
