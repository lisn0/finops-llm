# FinOps LLM

**finopsllm.com** — GEO SaaS landing site and research hub for LLM cost optimization. Eleventy static site deployed via git-push to Cloudflare Workers.

## What this site is

- **Research & education hub**: 150+ articles on LLM cost attribution, budgeting, anomaly detection, and FinOps practice.
- **Multi-language**: EN (primary, ~174 pages), plus ES, JA, DE, FR, PT at ~70 pages each. ~517 pages total.
- **AI-crawler friendly**: Markdown export via `Accept: text/markdown`, FAQPage JSON-LD for Bing AI, robots.txt AI signals.
- **Managed cost optimization service pitch**: Free audit booking at `/book`.

## Local development

Install dependencies:
```bash
npm install
```

Run the dev server:
```bash
npm run serve
```

Starts at `http://localhost:8080` with live reload.

## Build

```bash
npm run build
```

Outputs to `_site/` (gitignored). Eleventy builds ~123 pages in ~0.3s.

## Deployment

**Deployment = git push.** Do not run `wrangler deploy` manually.

The repo is connected to Cloudflare Workers git-triggered builds. Pushing to the production branch (`main`) automatically:

1. Clones the repo
2. Runs `npm run build` (per `wrangler.jsonc` build.command)
3. Deploys `_site/` as static assets

Single source of truth: the git repo. No manual CLI deployments.

## Post-deploy: IndexNow submission

New pages and content changes require manual IndexNow submission to notify Bing, Google, and other AI search engines. **Run this AFTER the deploy is live** (allow ~1–2 minutes for Cloudflare to finish):

```bash
INDEXNOW_HOST=finopsllm.com INDEXNOW_KEY=$(cat src/indexnow-key.txt) node scripts/indexnow-submit.mjs
```

The script reads the live sitemap (from the deployed domain), verifies HTTP 200 on each URL, and submits to IndexNow. The key file (`src/indexnow-key.txt`) contains the secret used in the `/?key=<key>` submission endpoint.

**Why manual?** The GitHub Action was removed because it couldn't reliably poll Cloudflare's deploy status. Until Cloudflare exposes a deploy-complete webhook or API, post-deploy notification must be run locally after confirming the site is live.

## Architecture

- **`src/`** — Eleventy templates (`.njk`), data files, and assets.
  - **`src/_data/articles/*.json`** — the current way to publish an article: one
    JSON file carries every locale, and `src/_data/articlePages.js` paginates it
    into pages. Dropping a file in here publishes it in every locale it declares
    and it appears in the research A–Z and the sitemap automatically — no stub
    `.njk`, no registration. See "Adding an article" below.
  - **`src/research/*.njk`** — older hand-written English research pages (106).
  - **`src/{es,ja,de,fr}/research/*.njk`** — older hand-written translated pages.
  - **`src/worker.js`** — Cloudflare Worker (www→apex redirect, language routing, markdown export for agents).
  - **`src/robots.txt`** — AI crawler allow-list and signals.
- **`wrangler.jsonc`** — Cloudflare Workers config (git-triggered build, asset serving).
- **`scripts/indexnow-submit.mjs`** — Post-deploy IndexNow client.

## Key files

| File | Purpose |
|------|---------|
| `eleventy.config.js` | Eleventy config (passthrough copy, i18n, sitemap + research collections) |
| `wrangler.jsonc` | Cloudflare Workers build+deploy config |
| `scripts/content-gap-analyzer.js` | Checks target topics against `src/research` **and** `src/_data/articles` |
| `src/robots.txt` | Bot allow-list + AI signals (Content-Signal, ai-train=no) |
| `src/worker.js` | Edge logic: redirects, language routing, markdown export |
| `scripts/indexnow-submit.mjs` | Post-deploy search-engine notification |

## Adding an article

Write one JSON file in `src/_data/articles/` — nothing else to register.

```jsonc
{
  "slug": "research/my-article",       // NOTE: includes the research/ prefix on this site
  "image": "https://finopsllm.com/og.png",
  "agentMode": true,
  "tags": ["…"],
  "datePublished": "2026-09-02",
  "dateModified": "2026-09-02",
  "languages": {
    "en": { "title": "…", "titleCore": "…", "description": "…", "body": "<h2>…", "faq": [], "related": [] }
  }
}
```

Gotchas, both of which the build catches:

- **`title` is what goes in `<title>`** here (`article.njk` renders
  `{{ locale.title }} · FinOps LLM`), and the linter caps it at **70 chars
  including that suffix** and HTML entities. `description` caps at 165.
  `titleCore` is the H1/og:title and may be longer.
  *On the sibling llmcfo site this is inverted — there `titleCore` is the
  `<title>`.*
- `related[].slug` must be a full path (`/research/…`) even though the
  top-level `slug` already carries the prefix.

`npm run build` fails loudly on broken internal links and prints title/description
length warnings at the end. Run it before committing — the pre-commit hook does too.

## Language routing

The Worker (`src/worker.js`) implements client-side language negotiation:

- Visitors whose `Accept-Language` preference is ES/FR/DE/JA are automatically routed to `/es/`, `/fr/`, `/de/`, `/ja/` versions (only for pages that exist in that language).
- Bots and crawlers always see the exact URL they requested (preserves hreflang indexing).
- Language selection is overridable via an on-page language switcher or `lang` cookie.

## Monitoring

### GEO metrics

- **Bing AI Performance** (via Microsoft Bing Webmaster Tools): tracks Copilot citations by page and query.
- **IndexNow** (manual submission): notifies search engines of new/updated URLs.

### SEO signals

- Canonical: `https://finopsllm.com/<path>` per domain/per language.
- hreflang: every translated page lists alternates in EN/ES/FR/DE/JA/PT, plus x-default.
- FAQPage JSON-LD: research pages with a `faq` block emit structured Q&A for AI extraction.
- Breadcrumb JSON-LD: every page includes hierarchical navigation.
- Sitemap: generated at build time from the `sitemap` collection in `eleventy.config.js` (~517 pages). It was seven hand-maintained XML files and drifted; do not reintroduce one.

## Getting help

- Eleventy docs: https://www.11ty.dev
- Cloudflare Workers: https://developers.cloudflare.com/workers
- IndexNow: https://www.indexnow.org
