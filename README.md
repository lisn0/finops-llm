# FinOps LLM

**finopsllm.com** — GEO SaaS landing site and research hub for LLM cost optimization. Eleventy static site deployed via git-push to Cloudflare Workers.

## What this site is

- **Research & education hub**: 150+ articles on LLM cost attribution, budgeting, anomaly detection, and FinOps practice.
- **Multi-language**: locale support is declared in `src/_data/langs.js` (currently 16 locales). Each article emits only its declared translations; built page totals are source-driven.
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

## Build and checks

```bash
npm run build
npm test
```

Outputs to `_site/` (gitignored). The prebuild topic-gap check and postbuild generated Markdown/link checks run as part of `npm run build`; page totals vary with source and declared translations.

Article JSON can set `languages.<locale>.dateModified` when translations are revised on different dates. The visible date, article JSON-LD, sitemap and publication verifier use that locale date, falling back to the article-wide `dateModified` for existing content. Updating one locale should not refresh another locale’s review date.

## Deployment

**Deployment = git push.** Do not run `wrangler deploy` manually.

The repo is connected to Cloudflare Workers git-triggered builds. Pushing to the production branch (`main`) automatically:

1. Clones the repo
2. Runs `npm run build` (per `wrangler.jsonc` build.command)
3. Deploys `_site/` as static assets

Single source of truth: the git repo. No manual CLI deployments.

## Post-publish search submission

Publish one or more article JSON files, including every locale declared in each
file, with one command:

```bash
npm run publish:articles -- --message "Publish article title" src/_data/articles/article-slug.json
```

Add more JSON paths to publish several articles together. `--dry-run` validates
the selected files and prints the exact locale URLs without changing Git or
contacting the network:

```bash
npm run publish:articles -- --dry-run --message "Publish article title" src/_data/articles/article-slug.json
```

The publisher checks article metadata and locale content, verifies the `main`
branch and `lisn0/finops-llm` push destination, fetches `origin/main`, then
commits and pushes only the selected article JSON files. It waits for every
declared locale URL to serve the selected title, canonical URL, modification
date, and article body before invoking the shared search submission runner.
Cloudflare builds and deploys once from the push. Set
`SEARCH_PUBLISH_WAIT_SECONDS` and `SEARCH_PUBLISH_POLL_SECONDS` to change the
bounded live check. A successful push and search submission do not guarantee
search indexing.

Use the canonical shared runner directly after committing other site changes:

```bash
node ~/projects/tools/publish-search.mjs \
  --site finops-llm https://finopsllm.com/research/example
```

The article publisher invokes this runner after its selected article commit is
pushed and the live pages match their source. It omits `--push`; the article
publisher already performed the content-only push.

The runner submits `/sitemap-index.xml` to Google Search Console, inspects each
URL, verifies the live IndexNow ownership file, and submits the URLs to Bing and
other IndexNow engines. The public key source is
`src/9f7a91c496064b7e96137c3326d9b895.txt`; the key is public by design and
must be served from the site root. Google inspection reports current index
status; neither it nor a sitemap submission guarantees indexing.

FinOps' GitHub Actions workflow also runs weekly and after article/research
content pushes. A GitHub billing lock currently prevents Actions from starting
(Frontier #3753), so use the local workspace runner for on-demand submissions.

## Architecture

- **`src/`** — Eleventy templates (`.njk`), data files, and assets.
  - **`src/_data/articles/*.json`** — the current way to publish an article: one
    JSON file carries every locale, and `src/_data/articlePages.js` paginates it
    into pages. Dropping a file in here publishes it in every locale it declares
    and it appears in the research A–Z and the sitemap automatically — no stub
    `.njk`, no registration. See "Adding an article" below.
  - **`src/research/*.njk`** and translated `src/<locale>/research/*.njk` — hand-authored legacy research pages.
  - **`src/_data/langs.js`** — supported sitemap locales; article JSON declares which locales actually have content.
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
- **IndexNow** (manual submission): notifies participating engines of new/updated URLs; Google discovery follows the sitemap and Search Console path.

### SEO signals

- Canonical: `https://finopsllm.com/<path>` per domain/per language.
- hreflang: every translated page lists alternates in EN/ES/FR/DE/JA/PT, plus x-default.
- FAQPage JSON-LD: research pages with a `faq` block emit structured Q&A for AI extraction.
- Breadcrumb JSON-LD: every page includes hierarchical navigation.
- Sitemap: generated at build time from the `sitemap` collection in `eleventy.config.js`; its page set follows the current source and available translations. Do not reintroduce hand-maintained locale sitemaps.

## Getting help

- Eleventy docs: https://www.11ty.dev
- Cloudflare Workers: https://developers.cloudflare.com/workers
- IndexNow: https://www.indexnow.org

## Regional website analytics

`/api/analytics-policy` uses Cloudflare's request country and continent; its
response is never cached and contains only the consent requirement. Europe
(including the UK, Switzerland, EEA, European territories and transcontinental
countries) and unknown locations require acceptance before GA4 loads. Elsewhere,
Cloudflare Zaraz starts automatically without an automatic banner and manages
GA4 and Microsoft Clarity through one loader.
Both wait for acceptance in Europe or unknown locations. Advertising consent
stays denied, including through the Clarity ConsentV2 API.

The footer's Cookie settings control lets visitors opt out of both tools or
accept both. Saved rejection and browser GPC/DNT prevent tracking everywhere.
Automatic Zaraz activation is not stored as acceptance, so future European visits
still ask. The regional policy also governs first-party booking attribution.
Run `node --test scripts/analytics-consent.test.mjs` for the policy and browser
state tests; the regular `npm test` command includes them.

Consent and attribution initialize once per document. Failed Zaraz bootstrap
requests can be retried through Cookie settings. Attribution also sends a
single 90% `scroll` event and outbound HTTP(S) `click` events after analytics
is permitted; outbound link values omit query strings and fragments. Booking
clicks still count when the original source is unavailable after late consent,
with `unknown` source/medium rather than invented attribution.

Zaraz must route ordinary events with conversion disabled and `book_click`
through its separate conversion action. Consent remains the collection boundary:
GA reports measured visits, not every human visitor, and missing historical
visits cannot be reconstructed. The current IP-hiding setting can affect GA
country attribution; use Cloudflare country data separately, without equating
HTTP requests or edge visits with unique people. API reporting uses property
`536095637` and timezone `Etc/GMT`; access references live in the workspace
credential inventory. Exclude `utm_source=tracking_audit` QA sessions when
reviewing release-day traffic, and allow recent daily data to finish processing.
