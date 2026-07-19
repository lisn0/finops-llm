# AI crawler analytics

The Worker logs every AI assistant crawler hit to Workers Analytics Engine.
This is first-party ground truth: what this server actually served, not a
sampled estimate and not a third-party's synthetic guess.

## Why not Cloudflare's bot analytics

`botScore` / Bot Management is machine learning for catching bots that **lie
about who they are**. AI crawlers do the opposite — they announce themselves in
the User-Agent and publish their IP ranges, because they want to be identified.
Detection is a lookup table. Bot Management is a paid add-on that answers a
question we don't have.

The GraphQL analytics route (`httpRequestsAdaptiveGroups`) was the alternative.
It is ABR-sampled, so counts wobble between runs, and it is unconfirmed whether
`userAgent` is even groupable there. Logging it ourselves is exact and certain.

## What gets recorded

| Slot | Value | Example |
|---|---|---|
| `blob1` / `index1` | crawler name | `ChatGPT-User` |
| `blob2` | kind | `live` / `search` / `train` |
| `blob3` | normalized path | `/research/ai-finops` |
| `blob4` | hostname | `finopsllm.com` |
| `double1` | 1 (hit count) | |

**`kind` is the commercially important field:**

- **`live`** — a human asked an assistant something and it fetched this page
  *right then*. The strongest available evidence of an actual citation.
  `ChatGPT-User`, `Claude-User`, `Perplexity-User`, `MistralAI-User`.
- **`search`** — indexing for that assistant's answer engine. Citation-eligible.
  `OAI-SearchBot`, `PerplexityBot`, `Bingbot`, `Claude-SearchBot`, others.
- **`train`** — corpus collection for model training. No citation value.
  `GPTBot`, `ClaudeBot`, `Google-Extended`, `CCBot`, `Bytespider`, others.

A page with high `train` and zero `live` is being eaten but never cited. That
distinction is the product.

## Querying

Free-tier SQL API. Needs an API token with **Account Analytics: Read**.

Credentials live in `~/projects/ai/llm-cfo/.env` (mode 600, outside any git
repo) as `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. Source it first:

```bash
set -a && . ~/projects/ai/llm-cfo/.env && set +a
```

```bash
curl -s "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/analytics_engine/sql" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -d "SELECT blob1 AS crawler, blob2 AS kind, SUM(_sample_interval) AS hits
      FROM finops_ai_crawler_hits
      WHERE timestamp > NOW() - INTERVAL '7' DAY
      GROUP BY crawler, kind
      ORDER BY hits DESC"
```

Which pages the assistants actually read:

```sql
SELECT blob3 AS path, SUM(_sample_interval) AS hits
FROM finops_ai_crawler_hits
WHERE timestamp > NOW() - INTERVAL '30' DAY AND blob2 = 'live'
GROUP BY path ORDER BY hits DESC LIMIT 20
```

Always `SUM(_sample_interval)`, never `COUNT(*)` — if volume ever crosses the
sampling threshold, `COUNT(*)` silently under-reports.

## Limits and traps

| | |
|---|---|
| Free tier | 10M writes/month, 1M reads/month |
| Sampling | only above 1M writes/min — far above this site, so counts are **exact** |
| Retention | **90 days**, then gone |
| Query | 30s timeout, ~10MB results |

**Analytics Engine fails silently on malformed data.** No exception, no error
in the response — a broken writer looks exactly like a site no assistant has
ever visited. That's why `detectAiCrawler` has a self-check:

```bash
npm test
```

Run it after touching the crawler table. `npx wrangler tail` shows live write
errors against the deployed Worker.

**90-day retention** means this is a rolling window, not history. Roll daily
aggregates into Firestore if long-term trend matters.

## Adding a crawler

Edit `AI_CRAWLERS` in `src/worker.js`, add a case to
`scripts/worker-crawlers.test.mjs`, run `npm test`.

Order matters: entries are matched by substring, first hit wins, so the more
specific token goes first. `chatgpt-user` must precede any broader OpenAI
token, and `claude-user` must precede `claudebot`. Getting this wrong
reclassifies live citation traffic as training traffic — the most valuable
signal silently becoming the least valuable one. The self-check guards it.
