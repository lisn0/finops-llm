# FinOps LLM: find, write and publish new articles

Run this workflow when the user requests new content or uncovered opportunities.
Carry the requested batch through publication without asking for approval at
individual stages. Do not run it on a timer or create a recurring automation.
Target finopsllm.com; preserve other sessions' changes and the existing stack.

## Find a useful uncovered question

Use available current Search Console/Bing reports and the user's supplied query
opportunities, supplemented by current primary-source provider announcements,
pricing changes and practical questions relevant to FinOps/platform buyers.
Use configured access without exposing credentials. If a fresh report is
unavailable, continue with dated evidence and current research, stating the
limitation. Never invent query volume, traffic, rankings or citations. Crawler
requests are not evidence of citations.

Inventory both `src/research/*.njk` and `src/_data/articles/*.json`. Read the
bodies of possible matches and deduplicate by reader intent and answer, not just
slug or title. The existing gap script has a fixed topic list and filename
matching; it is not a complete coverage audit. Prioritize relevance to cost
control, observability, budgeting and governance, evidence of demand, reliable
sources and a distinct practical contribution. Skip already answered questions
and weak ideas rather than forcing a batch. Refreshes are not the default.

## Research and write

Use current official provider documentation and other primary sources. For
OpenAI topics, use official OpenAI documentation. Answer the query in the first
40–60 words, then develop the explanation with clear headings, practical examples,
source links near factual claims and useful FAQ answers. Date volatile pricing
and access claims. Show calculation inputs and assumptions; distinguish API
prices, subscription entitlements and hosting/provider routes. Do not invent
benchmarks, savings, customer results or shipped product capabilities.

Create new JSON files in `src/_data/articles/` using the existing schema:
`research/` slug, actual publication/modification dates, image, `languages.en`,
`title`, `titleCore`, `description`, HTML `body`, FAQ question/answer pairs and
related full-path links to existing pages. Keep title plus site suffix within
70 characters and description within 165. Add translations only when requested;
never create fake translated pages or alter crawler policy through `agentMode`.
Follow the current README and these instructions over stale skill directions
about Nunjucks stubs, worker allowlists or separate pre-publication builds.

Check source facts, arithmetic, coverage distinctions and internal destinations.
Use the existing publication ledger at
`/Users/bilelUser/.codex/finopsllm-content-state.json` to retain candidate evidence,
coverage decisions, draft paths and publication outcomes. Verify source and Git
history rather than treating the ledger as proof of publication.

## Publish the requested batch

From the owning repository, run one command with explicit selected paths:

```sh
npm run publish:articles -- --message "Publish new FinOps LLM research" src/_data/articles/article-slug.json
```

Add the other article JSON paths to the same command for a batch. The publisher
checks source, commits selected content, verifies the personal GitHub destination,
pushes directly to main, waits for committed content to match live, and submits
Google/Bing/IndexNow discovery. Cloudflare builds once after the push. Do not run
another local/remote site build or full test suite, create a release branch, or
repeat its live checks for ordinary article-only changes. Tooling/runtime changes
still need the relevant tests. Preserve unrelated staged and working-tree edits.

If a run fails after push, recover its incomplete stage before starting new work.
Resume rather than recreating articles or duplicating commits. Separate live
publication from discovery receipts and indexing. For Bing `ThrottleHost`, retain
successful Google/Bing URL/IndexNow receipts and avoid immediately repeating the
whole sitemap batch; the existing issue is Frontier #4260. Record other concrete
blockers in the canonical tracker after searching for an existing issue.

Finish with published article links, the actual publication/submission outcome,
and any material unresolved issue. Publication does not guarantee indexing.
