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

Single static site, no build step. Hosted on Cloudflare Pages.

- `index.html`, `research.html`, `research/*.html` — pages (inline + `/assets` CSS)
- `_headers`, `_redirects`, `worker.js` — Cloudflare: security headers, `/book` redirect, edge Markdown-for-agents
- `robots.txt`, `sitemap.xml`, `llms.txt`, `.well-known/` — crawler + agent discovery
- `assets/consent.js` — Google Consent Mode v2 + cookie banner (GA4 `G-5BB5KVZCL3`)
- `assets/attribution.js` — first-party source attribution for the `/book` funnel (see below)
- `assets/lang.js` — language switcher for the `es`/`fr`/`de`/`ja` locale pages

## Booking attribution

`assets/attribution.js` records the visit's first-touch source (AI assistant /
search / social / direct) in `sessionStorage` and fires a GA4 `book_click` event
when a visitor clicks the booking CTA — only after analytics consent is granted.
To break bookings down by source, register the event params `book_source`,
`book_medium`, and `landing_page` as event-scoped custom dimensions in GA4.

## Local preview

Open `index.html` in a browser, or serve the directory with any static file
server (e.g. `python3 -m http.server`).
