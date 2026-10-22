---
title: "Are AI Overviews Taking Your Search Traffic?"
description: "Evidence on search clicks, what AI Overview studies can and cannot prove, and a practical method for diagnosing your own traffic."
datePublished: "2026-10-19"
dateModified: "2026-10-19"
status: "draft"
---

# Are AI Overviews Taking Your Search Traffic?

Yes, AI Overviews can reduce clicks from some search-result pages, but the evidence does not show that they caused every site's recent traffic drop. Pew observed fewer traditional-result clicks when an AI summary appeared; Ahrefs estimated a lower position-one click-through rate for AI Overview queries. Neither result diagnoses an individual site's October 2026 decline.

## What evidence and visuals are included?

The companion article JSON uses two source-derived visuals. The first shows Pew's 8% versus 15% traditional-result click rates, with the 1% click rate on cited summary links called out separately. The second shows Ahrefs' observed 1.6% position-one CTR beside its 3.7% modeled counterfactual and labels the 58% as a relative CTR gap, never total traffic lost. Both figures include expandable method notes and textual SVG descriptions.

The repository's `data-finops-chart` engine on `origin/main` exposes cost-specific chart types. Its grouped bar formats dollar-per-million-token series, horizontal delta computes currency markups, and break-even assumes token volume and monthly dollars. None supports generic search percentages. The companion article therefore uses accessible inline SVG plus native `<details>` disclosures, styled to the existing dark chart cards, rather than forcing click rates into a cost chart or changing the engine.

## What does the evidence support?

Pew's July 2025 analysis covers browser activity from 900 U.S. adults during March 2025 and reconstructed result pages for 68,879 searches collected in April. It found a traditional result click on 8% of visits when an AI summary appeared and 15% without one. A cited summary link was clicked on 1% of summary-page visits. This is observational and limited to Google summaries in the sampled period; it is not a randomized estimate, current universal rate, or AI Mode study.

Ahrefs' February 2026 update compares aggregated desktop Search Console CTR for 150,000 December 2025 AI Overview keywords with a separate sample of 150,000 informational keywords without AI Overviews. Its modeled counterfactual estimates 3.7% position-one CTR absent AI Overviews against 1.6% observed, a relative gap of about 58%. It is not a measured 58% loss of total site traffic. The estimate is not randomized and may reflect other differences or changes.

These results support click displacement as a plausible mechanism. They do not establish the cause of the October 15–19, 2026 volatility reports or a loss rate for any one site. Google ended the September spam rollout October 8 and listed no October 15–19 ranking incident in the status dashboard. The October 16–19 volatility account is community reporting, not confirmation of a new rollout. Google's October 15 announcement of more prominent inline links and expanded article carousels is a separate interface update; the announcement does not tie it to the traffic chatter.

## How should a team diagnose its traffic?

Clicks depend on both impressions and click-through rate. Compare matched query-page groups and inspect impressions, CTR, average position, analytics sessions, and qualified outcomes as separate measures. Search Console includes AI-feature links in overall web performance, so the available reports do not provide a complete causal counterfactual. Treat citations as exposure, not visits or revenue. Reallocate content or AI marketing spend only after the affected query set and business outcomes support the decision.

## Which sources support this analysis?

- [Pew Research Center, July 22, 2025](https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/)
- [Ahrefs, February 4, 2026](https://ahrefs.com/blog/ai-overviews-reduce-clicks-update/)
- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google Search Status Dashboard: September spam rollout](https://status.search.google.com/incidents/XhUDXP7A67iHCD2kmbVu)
- [Google, October 15, 2026 Search interface announcement](https://blog.google/products-and-platforms/products/search/updates-ai-mode-overviews-explore-web/)
- [Search Engine Roundtable, October 16, updated October 19](https://www.seroundtable.com/google-search-ranking-volatility-chatter-42317.html)

Sources checked October 19, 2026. Public sources only; no private analytics or site-specific screenshot metrics are included.
