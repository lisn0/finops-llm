# Product Marketing — FinOps LLM

> Single source of truth for positioning, messaging, and audience. Every marketing
> skill (copywriting, cro, seo, competitors, content-strategy, ads…) should read
> this first. Derived from the live site (finopsllm.com) on 2026-05-31.
>
> **Claims discipline:** Numbers already published on the site are kept as-is.
> Any proof point NOT yet verifiable on the site is marked
> `[VERIFY — do not publish until confirmed]`. Do not promote a placeholder to a
> live claim without real data.

## One-liner

Invoice-first AI cost attribution and optimization for engineering teams running
production LLM features. See where every dollar goes, stop the surprises, reduce spend.

## ICP (Ideal Customer Profile)

- **Primary:** Series B+ engineering teams with $20K+/month LLM spend
  (OpenAI, Anthropic, Bedrock, Gemini, Azure).
- **Secondary:** Finance / FP&A / CFO at companies optimizing AI costs.
- **Tertiary:** Platform engineers at larger orgs needing multi-team chargeback and
  budget governance.

### Personas
1. **Engineering Lead** — real-time per-feature visibility, A/B-tested guardrails,
   confidence that routing/caching won't break production.
2. **Finance / FP&A** — cost-per-feature P&L, chargeback exports, budget governance,
   anomaly alerts, invoice reconciliation (audit trail).
3. **Platform Architect** — multi-team cost allocation, automated routing/caching,
   API access to cost data.

## Top value props (by buyer)

1. **Engineering:** cut AI spend 40–60% without breaking quality or slowing deploys;
   A/B test every change.
2. **Finance:** own AI cost visibility — real-time attribution, chargeback, budget
   enforcement, reconciled to the invoice.
3. **Product:** see which features are profitable; treat cost as a first-class metric.

## Differentiators

- **Invoice-first** — every dollar reconciled to raw provider invoices (not estimates);
  enables defensible chargeback and audit-ready reporting.
- **Real-time routing + caching** — optimization integrated with attribution, not just
  dashboards.
- **Feature-level attribution** — spend mapped to product features, not only models.
- **Finance alignment** — cost-per-customer / -feature / -team P&L outputs.
- **vs alternatives:** Helicone/Langfuse = request tracing, not cost attribution;
  DIY playbooks = one-off, not a platform; cloud FinOps tools = compute-general,
  not token-specific.

## Claims / proof discipline

- Published & allowed: "38–68% typical savings", "free audit, $0 upfront",
  "performance pricing / pay on results", "$1,500/mo Platform tier",
  multi-provider support (already on site).
- `[VERIFY — do not publish until confirmed]`: "20+ teams", "median 52% reduction",
  "4.2-week implementation", "96% still active at 6 months", any named/vertical
  case-study metric, logos, or testimonials. The case-studies page currently says
  "No public case studies yet" — keep it honest until real (even anonymized,
  NDA-covered) outcomes exist.

## Pricing positioning

- **Performance** — free audit, then a share of verified monthly savings vs. a locked
  baseline. (Lead tier for most customers.)
- **Platform** — flat from $1,500/mo for self-serve attribution, dashboards, alerts;
  for teams optimizing internally.
- Decision cue: hands-on help → Performance; self-serve dashboards → Platform;
  unsure → free audit first.

## Booking / GTM hook

Free audit — 30-min discovery + ~2-week read-only invoice baseline → ranked
opportunities + roadmap, $0 upfront. Booking route: site-owned `/book`
(redirects to the company booking calendar).

## Content pillars

1. **Visibility & attribution** — feature/team/customer-level cost, invoice reconciliation.
2. **Optimization levers** — routing, caching, compression, batch APIs, arbitrage,
   fallback chains (and their trade-offs).
3. **Governance & finance** — chargeback, showback, budgets, anomaly detection,
   cost-per-task, build-vs-buy.
4. **Provider economics** — comparative pricing, cache mechanics, reasoning-token costs.

> **Content gap (awareness stage):** the research hub skews advanced. Missing
> foundational explainers ("how providers charge", "what is cost attribution",
> "how to budget for AI", "why does my bill spike") — high-volume, low-competition.

## Voice

Technical, transparent, results-focused. Cite real provider pricing, acknowledge
trade-offs (routing adds latency; caching favors stable prompts). Partner tone with
engineering; CFO-grade rigor with finance. No hype. Conservative claims only (CLAUDE.md).
