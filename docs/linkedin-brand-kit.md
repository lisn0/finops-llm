# FinOps LLM — LinkedIn brand kit

Everything needed to stand up and run the `finopsllm.com` LinkedIn company page.
All claims below are the ones already published on the site — do not invent new numbers.

---

## 1. Page setup (copy-paste fields)

| Field | Value |
|---|---|
| **Name** | FinOps LLM |
| **LinkedIn URL** | `linkedin.com/company/finopsllm` |
| **Tagline** (120 char max) | `AI cost management and LLM observability. Attribution, anomaly detection, optimization — reconciled to the provider invoice.` (119) |
| **Website** | https://finopsllm.com |
| **Industry** | Software Development *(alt: IT Services and IT Consulting)* |
| **Company size** | 2–10 employees |
| **Company type** | Privately Held |
| **Founded** | 2025 |
| **Custom button** | "Learn more" → https://finopsllm.com/book |
| **Contact** | hello@finopsllm.com |

**Specialties** (LinkedIn allows 20 — these mirror the site's keyword set):
`LLM cost optimization` · `AI cost management` · `FinOps for AI` · `LLM observability` ·
`Token cost attribution` · `AI chargeback` · `AI showback` · `GenAI budget governance` ·
`Model routing` · `Semantic caching` · `Prompt compression` · `Anomaly detection` ·
`OpenAI cost attribution` · `Anthropic spend` · `AWS Bedrock` · `Azure OpenAI` ·
`Google Vertex AI` · `Cloud cost engineering` · `Invoice reconciliation` · `Unit economics`

---

## 2. About section (~1,600 chars — LinkedIn cap is 2,000)

> Most teams running production GenAI can tell you what they spent last month. Far fewer can tell you which feature, which team, or which customer cohort spent it — and almost none can tie that answer back to the invoice the provider actually sent.
>
> FinOps LLM closes that gap. We bring the FinOps Foundation framework — visibility, attribution, optimization, accountability — to token spend.
>
> **What we do**
> · Real-time spend attribution across OpenAI, Anthropic, Gemini & Vertex, AWS Bedrock, Azure OpenAI, Groq, Together, Mistral, Cohere and most OSS endpoints
> · Anomaly detection and budget governance before the invoice lands, not after
> · Chargeback and showback down to model, feature, team and customer cohort — exported to NetSuite, QuickBooks, CSV or API
> · Automated optimization: model routing, semantic caching, prompt compression
> · Monthly reconciliation against raw provider invoices
>
> **How we work**
> Read-only by default. Billing and usage data is enough for most attribution work; prompt and output data is touched only with explicit approval, for specific optimizations that need it.
>
> Every routing, caching and compression change is A/B tested against production for a minimum of seven days before promotion. Regressions auto-rollback. Quality is monitored continuously alongside cost.
>
> Attribution and dashboards go live in under a week. Optimization implementation runs 3–5 weeks; savings show up on the first full provider invoice after go-live. Typical reduction is 38–68%.
>
> **Pricing**: free audit, then 15–25% of verified monthly savings against a baseline locked before anything changes. No savings, no fee. Thirty days notice, no licence, no lock-in. Minimum engagement is $20k/month of LLM spend.
>
> Book the free audit → finopsllm.com/book

---

## 3. Visual identity

Pulled from the live site — reuse, don't redesign.

### Colours

| Token | Hex | Use |
|---|---|---|
| Ink (dark ground) | `#0A0F1A` | Cover backgrounds, dark carousels, the site's `theme-color` |
| Deep navy text | `#0A1E3C` | Headlines on light |
| Signal blue | `#1D4ED8` | Primary accent, charts, the "current" line |
| Blue soft | `#E4ECFB` | Fills, badge backgrounds |
| Light ground | `#F6F9FC` | Light-mode slides |
| Muted | `#6B7C93` | Captions, labels |
| Alert orange | `#EA580C` | Anomalies, overspend, "before" state |
| Verified green | `#0E9F6E` | Savings, "after" state, confirmations |
| Rule | `#C9D6E6` | Hairlines, table borders |

Rule of thumb: **navy ground, one blue accent, orange only for the problem, green only for the verified result.** Never more than two accents on one image.

### Type

- **Space Grotesk** — headlines, big numbers
- **Inter** — body, captions
- **IBM Plex Mono** — figures, invoice lines, dashboard chrome, the `FIG. 01` style labels

### Assets to produce

| Asset | Spec | Content |
|---|---|---|
| Logo | 300×300 PNG | The `ƒ` mark on `#0A0F1A` — matches `favicon.svg` |
| Cover image | 1128×191 PNG | `#0A0F1A` ground, faint blueprint grid, left-aligned: "AI cost control for the era of tokens" in Space Grotesk + `finopsllm.com` in mono. Keep the right third clear — the logo badge overlaps it. |
| Post template | 1200×627 | Blueprint schematic look: grid background, mono labels, one blue line, one number |
| Carousel | 1080×1350 PDF | Dark deck, mono slide numbers, one idea per slide |

### The look, in one line

**An engineering schematic, not a SaaS gradient.** Grid paper, hairline rules,
monospaced figure captions (`FIG. 01 —`), revision marks (`Schematic · Rev C`).
No stock photos, no smiling laptops, no glowing brains, no purple AI gradients.

---

## 4. Voice

**Is:** precise, invoice-first, quietly confident, engineer-to-engineer. States what
it excludes. Uses real numbers with the conditions attached.

**Is not:** hype, "revolutionary", "unlock the power of AI", emoji-bulleted posts,
"Agree?" engagement bait, thought-leader storytime openers.

Five rules:
1. **Lead with a number or a mechanism, never with a feeling.** "Cache hit-rate 38.1%" beats "AI costs are exploding."
2. **Name what you don't count.** Provider price cuts aren't savings. Saying so is the differentiator.
3. **Short sentences. No adjective stacking.**
4. **One idea per post.** If it needs two, it's two posts.
5. **Every claim traceable to the site.** 38–68% reduction · 15–25% of verified savings · $20k/month minimum · <1 week to attribution · 3–5 weeks to optimization · 7-day A/B minimum · read-only by default.

---

## 5. Content pillars

| Pillar | Share | What it is |
|---|---|---|
| **Attribution & unit economics** | 30% | Cost per feature/team/customer, chargeback, showback, why the provider dashboard isn't enough |
| **Optimization mechanics** | 25% | Routing, semantic caching, prompt compression — with the trade-off named |
| **Governance & anomalies** | 20% | Budgets, alerts, runaway agent loops, the invoice-shock post-mortem |
| **Honest pricing & method** | 15% | Baselines, what verification excludes, why the audit is free |
| **Research repost** | 10% | Drive to the 54+ article library on finopsllm.com/research |

Cadence: 3 posts/week (Tue/Wed/Thu, 8–10am buyer-local). One carousel or chart per week — the schematic images are the differentiator on a text-heavy feed.

---

## 6. Twelve posts, ready to run

**1 — Attribution**
Your provider dashboard shows spend by API key.
Your CFO asked for spend by feature.
Those are not the same question, and no amount of staring at the dashboard turns one into the other.
Attribution means a token carries its tags: model, feature, team, customer cohort. Anything less and chargeback is an estimate you defend in a meeting.

**2 — Governance**
The most expensive LLM bug is the one that doesn't throw.
An agent loop that retries silently costs nothing to run and everything to receive. It looks like healthy traffic until the invoice lands 26 days later.
Anomaly detection on token spend is not a nice-to-have — it's the only monitor that catches a failure mode with no error rate.

**3 — Pricing / honesty**
When a provider drops a list price, your bill falls.
We don't bill for that.
It's excluded from the reconciliation, because nobody on our side produced it. A fee tied to work has to be tied to the work.

**4 — Optimization**
Routing is the biggest single lever in most stacks — 30 to 50%.
Not because the flagship model is bad, but because most requests never needed it. Classification, extraction and lookup don't need reasoning; they get billed as if they do.
Classifier in front, quality bar behind. The bar is the whole design.

**5 — Method**
Every optimization we ship runs seven days of A/B against production before promotion. Regression auto-rolls back.
A cost cut that quietly degrades output isn't a saving. It's a deferred bill in a different column.

**6 — Caching**
Semantic cache hit-rate in a typical support workload: ~38%.
That's 38% of requests served at roughly $0.0001 instead of $0.03, sub-10ms.
The hard part was never the cache. It's deciding what "close enough to reuse" means for your domain — and that's a product decision, not an infra one.

**7 — Attribution / carousel**
"How much does this feature cost per user?"
Five slides on how to actually answer that: tag at the call site → attribute per request → roll up by cohort → reconcile to invoice → hand finance a number that survives audit.

**8 — Baselines**
Every savings claim needs a baseline, and every baseline needs a date.
We lock it before anything changes, against the invoice the provider sends — not against our own telemetry, and not against a projection made at signing.
If the saving stops being real, the fee stops with it.

**9 — Contrarian**
Most LLM cost problems aren't model-selection problems. They're context problems.
Teams stuff 40k tokens of context in to avoid one retrieval decision, then benchmark cheaper models to fix the bill.
The prompt is the bill. Start there.

**10 — Access / trust**
Read-only by default.
Billing and usage data is enough for most attribution work. Prompt and output content is touched only with explicit approval, only for the specific optimizations that need it.
Cost visibility shouldn't cost you a data-access review.

**11 — Timeline**
Attribution and dashboards: under a week.
Optimization implementation: 3–5 weeks.
Savings visible: first full provider invoice after go-live.
Anyone promising a cut before the next billing cycle is describing a projection, not a result.

**12 — Free audit**
The audit is free and it's a real deliverable: spend by model, workload and team, the drivers, and a ranked savings list with an effort cost on every line.
You can take that document and implement all of it in-house. Plenty of platform teams do. That's a legitimate outcome, not a failed sales cycle.

---

## 7. Hashtags

Three to five per post, max. Pull from:
`#FinOps` `#LLMOps` `#AICostManagement` `#GenAI` `#CloudCost` `#MLOps`
`#PlatformEngineering` `#AIObservability` `#TokenEconomics` `#AIGovernance`

Always include `#FinOps` — it's the one with a real practitioner community attached.

---

## 8. Founder / personal profile

Company pages get a fraction of the reach of a person. Post from the personal
profile, have the company page reshare.

- **Headline**: `Cutting LLM bills, verified against the invoice | FinOps for GenAI`
- **Featured section**: the free audit page, the cost calculator, the two strongest research articles
- **Weekly**: one build-in-public post — a real number from real work, no client names

---

## 9. Do not

- ❌ Client names or logos without written permission
- ❌ Screenshots of real customer dashboards — the site's cockpit view is labelled `DEMO DATA · customer-042` for a reason; keep that label on every image
- ❌ New savings percentages that don't appear on the site
- ❌ Anything that implies a platform licence or a product SKU — pricing is an engagement
- ❌ Engagement bait, "thoughts? 👇", broetry line breaks
- ❌ Purple AI gradients, stock photography, glowing-brain iconography

---
---

# Part 2 — more ideas

## 10. LinkedIn-native surfaces most people never set up

| Surface | Why it's worth it here |
|---|---|
| **Newsletter** ("The Reconciliation", monthly) | Subscribers get *notified*, unlike posts. The 54+ research articles are already the content — one becomes one issue. Highest-leverage thing on this list. |
| **Featured / Products tab** | Add the free audit, the cost calculator and the pricing tracker as "products" — they get review prompts and a dedicated URL. |
| **Showcase page** | `Tidal Telemetry` as a showcase page under FinOps LLM — separates the observability product from the service pitch without a second company page. |
| **Lead-gen form ad** | The free audit is a genuinely strong lead magnet: gated as a "LLM spend audit" form fill, pre-filled by LinkedIn. |
| **LinkedIn Live / audio event** | 30-min "read a real LLM invoice with me", anonymised. Cheap, and the recording becomes 6 clips. |
| **Employee advocacy** | Every person with the company in their profile reshares. Company-page reach is ~2% organic; personal is 10×. |
| **Comment strategy** | 20 min/day commenting under FinOps Foundation, Duckbill, Vantage, CloudZero and provider-pricing posts. This is where the first 500 followers actually come from — not from posting. |

## 11. Paid targeting (when there's budget)

- **Job titles**: Head of Platform, VP Engineering, FinOps Lead, Cloud Economist, CTO, Head of Infrastructure, Director of Data/ML Platform
- **Skills**: FinOps, Cloud Cost Management, MLOps, LLMOps
- **Groups**: FinOps Foundation community members
- **Company filter**: 200–5,000 employees, tech/SaaS/fintech — small enough to move fast, big enough to clear the $20k/mo minimum
- **Exclude**: agencies, consultancies, students, anyone under 50 employees (they won't hit the floor)
- Best-performing creative will be the **schematic charts**, not the copy. Budget for the images.

## 12. The llmcfo.com interlock

Two faces of one product — so LinkedIn should reflect that, not hide it:

- **FinOps LLM page** = the engineer/platform buyer. Mechanism, trade-offs, schematics.
- **LLM CFO** = if it ever gets its own page, it's the finance buyer. Board-deck framing, unit economics, forecast variance.
- **Do not cross-post the same content.** Same insight, two rewrites: "routing cuts 30–50%" on this page becomes "a 40% variance you can forecast" on the other.
- One person can run both by writing once and re-angling — that's cheaper than two content calendars.

## 13. Launch sequence (first 30 days)

| Week | Do |
|---|---|
| 0 | Page live: logo, cover, About, specialties, button. Invite every relevant connection (LinkedIn gives you a monthly credit pool — spend it all). |
| 1 | Posts 1, 2, 4 from the list. Personal profile headline updated. Start the 20-min/day comment habit. |
| 2 | Posts 3, 6, 9. First carousel (post 7). Newsletter issue #1 = the strongest research article, reformatted. |
| 3 | Posts 5, 10, 11. Reshare a FinOps Foundation piece with a real opinion attached. |
| 4 | Post 12 (free audit) — the ask lands *after* three weeks of giving. Review what got saved/shared, not what got liked. |

## 14. Eight more posts

**13 — Provider lock-in**
Multi-provider isn't a resilience story, it's a pricing story.
The teams with the largest savings surface are the ones who can move a workload between OpenAI, Anthropic and Bedrock in an afternoon. Not because they do it often — because they can.

**14 — Forecasting**
"What will we spend next quarter?"
If the answer comes from extrapolating last month's total, it's wrong in a specific way: token spend doesn't scale with users, it scales with context length × retry rate × feature mix. Three variables that all move independently.

**15 — Reframe**
Cost optimization has a bad reputation with engineers because it usually arrives as a mandate with a deadline and no data.
The version that works arrives as a ranked list where every line has an effort cost next to the saving, and engineering picks which ones are worth it.

**16 — Retries**
Look at your retry policy before you look at your model choice.
Exponential backoff on a 30k-token prompt bills you three times for one answer. Nobody reviews the retry config — it was set in week one and it's been compounding since.

**17 — Showback vs chargeback**
Showback tells a team what it spent. Chargeback puts it on their budget.
Showback changes almost nothing. Chargeback changes behaviour within one billing cycle. The difference isn't the data — it's whose number it is.

**18 — Anti-pattern**
The dashboard that gets built first is almost always total spend over time.
It's the least useful chart you can make. It tells you *that* something changed, never *what*. Build spend-by-feature first even if it's uglier.

**19 — Numbers**
$0.030 per 1K tokens on the flagship. $0.002 on the small model. $0.0001 from cache.
That's a 300× spread across three paths a request can take, decided by a classifier that costs almost nothing to run.
Most stacks send everything down the first path.

**20 — Quality**
"Won't cheaper models make it worse?"
Sometimes. That's why the seven-day A/B exists and why regressions auto-rollback.
The useful question isn't whether quality can drop — it's whether you'd notice. If you can't measure output quality, you can't safely optimize cost, and that's the first thing to fix.

## 15. Measure these, ignore the rest

Track monthly: **audit bookings from LinkedIn** (UTM the `/book` link), **newsletter
subscribers**, **saves + shares** (intent signal; likes are noise), **profile views
from target titles**.

Ignore: follower count, impressions, likes.

UTM every link: `?utm_source=linkedin&utm_medium=social&utm_campaign=<post-slug>` —
the site already ships `assets/attribution.js`, so it'll be captured.
