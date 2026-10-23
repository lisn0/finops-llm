# FinOps LLM — Reusable Chart Snippets & Table Templates

Drop any of these blocks directly into article HTML (`src/_data/articles/*.json` or `src/research/*.njk`).
`finops-charts.js` is loaded automatically and initializes all `[data-finops-chart]` blocks on page load.

> **Full 16-Language Support (Zero-Config):**
> Every chart automatically detects the active page language (`document.documentElement.lang`) and translates all headers, telemetry decks, axis metrics, legends, and hover tooltips into the viewer's language:
> `en` (English), `de` (German), `es` (Spanish), `fr` (French), `ja` (Japanese), `pt` (Portuguese), `it` (Italian), `ko` (Korean), `zh` (Chinese), `nl` (Dutch), `ar` (Arabic, RTL), `ru` (Russian), `tr` (Turkish), `pl` (Polish), `id` (Indonesian), `vi` (Vietnamese).
>
> **Style Guardrails:**
> - Strictly NO emoji glyphs or icons (no ⚡, 🎯, 💡) in templates or chart readouts.
> - No `100% Graph Visibility` badge.
> - Telemetry decks sit in a dedicated top container so popups NEVER obscure data curves.

---

## Template 1: Grouped Bar (Direct vs Cloud Rate Parity)

```html
<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>Model Deployment</th>
        <th>Direct In / 1M</th>
        <th>Azure In / 1M</th>
        <th>Direct Out / 1M</th>
        <th>Azure Out / 1M</th>
        <th>Delta Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>GPT-5.4 Standard</strong></td>
        <td>$2.50</td>
        <td>$2.50</td>
        <td>$15.00</td>
        <td>$15.00</td>
        <td>0% Parity</td>
      </tr>
      <tr>
        <td><strong>GPT-5.4 >272K Window</strong></td>
        <td>$3.50</td>
        <td>$5.00</td>
        <td>$18.00</td>
        <td>$22.50</td>
        <td>+43% In / +25% Out</td>
      </tr>
      <tr>
        <td><strong>GPT-5.4 Pro Tier</strong></td>
        <td>$25.00</td>
        <td>$30.00</td>
        <td>$150.00</td>
        <td>$180.00</td>
        <td>+20% Surcharge</td>
      </tr>
      <tr>
        <td><strong>o3-mini Fast Reasoning</strong></td>
        <td>$1.10</td>
        <td>$1.10</td>
        <td>$4.40</td>
        <td>$4.40</td>
        <td>0% Parity</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- Chart: Default data or customized via data-finops-config -->
<div data-finops-chart="grouped-bar" data-finops-config='{
  "title": "Grouped Bar: Direct OpenAI vs Azure Global Rates",
  "subtitle": "Input & output rates per 1M tokens comparing Direct API against Azure Global deployment.",
  "data": [
    { "model": "GPT-5.4 Std", "directIn": 2.50, "directOut": 15.00, "azureIn": 2.50, "azureOut": 15.00, "note": "Full Parity: Azure Global matches Direct list exactly." },
    { "model": "GPT-5.4 >272K", "directIn": 3.50, "directOut": 18.00, "azureIn": 5.00, "azureOut": 22.50, "note": "Azure Long-Context Markup: +43% on input, +25% on output." },
    { "model": "GPT-5.4 Pro", "directIn": 25.00, "directOut": 150.00, "azureIn": 30.00, "azureOut": 180.00, "note": "Premium Tier: Azure adds 20% surcharge across input and output." },
    { "model": "o3-mini Fast", "directIn": 1.10, "directOut": 4.40, "azureIn": 1.10, "azureOut": 4.40, "note": "Reasoning Parity: Identical pricing across both direct and Azure endpoints." }
  ]
}'></div>
```

---

## Template 2: Break-Even Line (Pay-As-You-Go vs Reserved Capacity)

```html
<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>Commitment Model</th>
        <th>Fixed Base / Mo</th>
        <th>Marginal Rate / 1M</th>
        <th>Spend @ 20M</th>
        <th>Spend @ 60M</th>
        <th>Optimal Volume</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Pay-As-You-Go (PayGo)</strong></td>
        <td>$0</td>
        <td>$12.50</td>
        <td>$250</td>
        <td>$750</td>
        <td>&lt; 28M tokens/mo</td>
      </tr>
      <tr>
        <td><strong>1x Monthly PTU Block</strong></td>
        <td>$260</td>
        <td>$3.20</td>
        <td>$324</td>
        <td>$452</td>
        <td>&ge; 28M tokens/mo</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- Chart: Break-Even Line with Continuous Dual Lock Crosshair -->
<div data-finops-chart="break-even" data-finops-config='{
  "title": "Break-Even Curve: On-Demand vs PTU Monthly Reservation",
  "subtitle": "Identifies the exact token volume threshold where provisioned reservations beat pay-as-you-go.",
  "ptuFixed": 260,
  "onDemandRate": 12.5,
  "ptuMarginal": 3.2,
  "maxX": 100,
  "maxY": 1500
}'></div>
```

---

## Template 3: Token Donut (Session Anatomy Breakdown)

```html
<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>Token Category</th>
        <th>Volume</th>
        <th>Share %</th>
        <th>Incurred Cost</th>
        <th>FinOps Optimization Lever</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Cached System Prompts</strong></td>
        <td>480,000</td>
        <td>48%</td>
        <td>$24.50</td>
        <td>90% Cache Yield</td>
      </tr>
      <tr>
        <td><strong>Tool Schemas & Context</strong></td>
        <td>240,000</td>
        <td>24%</td>
        <td>$36.80</td>
        <td>Dynamic Pruning</td>
      </tr>
      <tr>
        <td><strong>Reasoning (CoT Thinking)</strong></td>
        <td>180,000</td>
        <td>18%</td>
        <td>$42.00</td>
        <td>Effort Level Capping</td>
      </tr>
      <tr>
        <td><strong>User Output Generation</strong></td>
        <td>100,000</td>
        <td>10%</td>
        <td>$31.20</td>
        <td>Top-p / Max Tokens Guard</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- Chart: Donut with Bi-Directional Hover Highlighting -->
<div data-finops-chart="token-donut" data-finops-config='{
  "title": "Donut Chart: Typical Agent Session Cost Composition",
  "subtitle": "Interactive breakdown of where the bill actually goes: system prompts, cache hits, reasoning, and output.",
  "data": [
    { "label": "Cached System Prompts", "percent": 48, "cost": 24.50, "tokens": "480k", "color": "#4ADE80", "desc": "Saved 90% via prompt caching ($24.50 vs $245.00 uncached)", "tip": "Prefix caching turns static instructions into negligible cost." },
    { "label": "Tool Schema & Context", "percent": 24, "cost": 36.80, "tokens": "240k", "color": "#38BDF8", "desc": "MCP schemas & conversation history re-sent each turn", "tip": "Prune unused tool schemas to recover ~15% prompt budget." },
    { "label": "Reasoning / CoT Tokens", "percent": 18, "cost": 42.00, "tokens": "180k", "color": "#818CF8", "desc": "Internal thinking steps (billed at high output rate)", "tip": "Reasoning tokens are billed as output: cap reasoning effort in simple tasks." },
    { "label": "User Output Generation", "percent": 10, "cost": 31.20, "tokens": "100k", "color": "#F59E0B", "desc": "Final code/response returned to the developer", "tip": "Output generation is the highest per-token unit rate." }
  ]
}'></div>
```

---

## Template 4: Horizontal Delta Bar (Data Sovereignty Surcharges)

```html
<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>Deployment Tier</th>
        <th>Residency Guarantee</th>
        <th>Normalized Cost (10M)</th>
        <th>Markup %</th>
        <th>Compliance Target</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>OpenAI Direct Global</strong></td>
        <td>Multi-tenant global routing</td>
        <td>$25.00</td>
        <td>0%</td>
        <td>Global Baseline</td>
      </tr>
      <tr>
        <td><strong>Azure Data Zone (EU/US)</strong></td>
        <td>Continental boundary</td>
        <td>$28.00</td>
        <td>+12%</td>
        <td>GDPR Standard</td>
      </tr>
      <tr>
        <td><strong>Azure Single-Region (Sweden)</strong></td>
        <td>Single physical DC</td>
        <td>$29.50</td>
        <td>+18%</td>
        <td>National Audits</td>
      </tr>
      <tr>
        <td><strong>Azure Sovereign FedRAMP</strong></td>
        <td>US Gov Cleared DC</td>
        <td>$33.75</td>
        <td>+35%</td>
        <td>DoD Secret</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- Chart: Horizontal Delta Bar with Animated 0% Baseline Guide -->
<div data-finops-chart="horizontal-delta" data-finops-config='{
  "title": "Horizontal Delta: Regional Markup vs Direct Global Base",
  "subtitle": "Data sovereignty and regional routing markups (+0% to +35%) over base list pricing.",
  "data": [
    { "deployment": "Azure Global (Standard)", "delta": 0, "tag": "Parity (0%)", "baseline": 25.00, "current": 25.00, "color": "#4ADE80", "tier": "Standard Global", "note": "Matches Direct list exactly. No data residency guarantee." },
    { "deployment": "Azure Data Zone (EU/US)", "delta": 12, "tag": "+12%", "baseline": 25.00, "current": 28.00, "color": "#38BDF8", "tier": "Geographical Boundary", "note": "Guaranteed processing boundaries within EU or US jurisdiction." },
    { "deployment": "Azure Single-Region (Sweden)", "delta": 18, "tag": "+18%", "baseline": 25.00, "current": 29.50, "color": "#F59E0B", "tier": "Pinned Physical Region", "note": "Pinned physical DC for national compliance & statutory audits." },
    { "deployment": "Azure FedRAMP / Gov", "delta": 35, "tag": "+35%", "baseline": 25.00, "current": 33.75, "color": "#EA580C", "tier": "High Sovereign Cloud", "note": "Isolated sovereign government enclave with dedicated clearance." },
    { "deployment": "OpenAI Direct (PayGo)", "delta": 0, "tag": "Baseline Ref", "baseline": 25.00, "current": 25.00, "color": "#647289", "tier": "Direct API Standard", "note": "Reference standard benchmark rate (Global multi-tenant)." }
  ]
}'></div>
```

---

## Template 5: Cumulative Context Waterfall (Prompt Caching Yield)

```html
<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>Turn Sequence</th>
        <th>Session Action</th>
        <th>Tokens in Context</th>
        <th>Uncached Burn</th>
        <th>Prompt Cached</th>
        <th>Turn Savings</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Turn 1</strong></td>
        <td>Cold prompt init</td>
        <td>4,000</td>
        <td>$0.04</td>
        <td>$0.04</td>
        <td>0% (Write)</td>
      </tr>
      <tr>
        <td><strong>Turn 3</strong></td>
        <td>Code diff review</td>
        <td>22,000</td>
        <td>$0.22</td>
        <td>$0.07</td>
        <td>68% Savings</td>
      </tr>
      <tr>
        <td><strong>Turn 5</strong></td>
        <td>Test logs & trace loops</td>
        <td>52,000</td>
        <td>$0.52</td>
        <td>$0.11</td>
        <td>79% Savings</td>
      </tr>
      <tr>
        <td><strong>Turn 8</strong></td>
        <td>PR Generation & Summary</td>
        <td>135,000</td>
        <td>$1.35</td>
        <td>$0.20</td>
        <td>85% Total Savings</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- Chart: Cumulative Waterfall with Snapping Turn Crosshair -->
<div data-finops-chart="waterfall" data-finops-config='{
  "title": "Context Accumulation Waterfall: Cost Growth Across 8 Turns",
  "subtitle": "Illustrates multi-turn prompt inflation and the massive delta between raw tokens and prompt caching.",
  "turns": [
    { "turn": "T1: Initial Prompt", "uncached": 0.04, "cached": 0.04, "tokens": "4k tokens", "note": "Cold prompt: Cache write turn, identical base cost." },
    { "turn": "T2: File Read", "uncached": 0.12, "cached": 0.05, "tokens": "12k tokens", "note": "File loaded into context: 80% cached." },
    { "turn": "T3: Code Edit", "uncached": 0.22, "cached": 0.07, "tokens": "22k tokens", "note": "Diff review: Prefix cache avoids re-billing files." },
    { "turn": "T4: Test Run", "uncached": 0.35, "cached": 0.09, "tokens": "35k tokens", "note": "Test logs appended: Prompt caching saves $0.26." },
    { "turn": "T5: Debug Loop", "uncached": 0.52, "cached": 0.11, "tokens": "52k tokens", "note": "Stack traces: Uncached bill escalates quadratically." },
    { "turn": "T6: Refactor", "uncached": 0.74, "cached": 0.14, "tokens": "74k tokens", "note": "Multi-file edits: 81% net cumulative discount." },
    { "turn": "T7: PR Diff", "uncached": 1.02, "cached": 0.17, "tokens": "102k tokens", "note": "Full git patch context: Saved $0.85 on single turn." },
    { "turn": "T8: Summary", "uncached": 1.35, "cached": 0.20, "tokens": "135k tokens", "note": "PR summary: 85% total session cost reduction." }
  ]
}'></div>
```

---

## Template 6: Cost-Quality Pareto Frontier (SWE-bench Accuracy vs Unit Cost)

```html
<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>Model</th>
        <th>Benchmark Accuracy</th>
        <th>Cost per Task</th>
        <th>Efficiency Score</th>
        <th>Frontier Tier</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>DeepSeek V3</strong></td>
        <td>71.4%</td>
        <td>$0.85</td>
        <td>84.0 pts/$</td>
        <td>Value Leader</td>
      </tr>
      <tr>
        <td><strong>Claude 3.7 Haiku</strong></td>
        <td>73.2%</td>
        <td>$1.25</td>
        <td>58.6 pts/$</td>
        <td>Value Leader</td>
      </tr>
      <tr>
        <td><strong>o3-mini Fast</strong></td>
        <td>81.2%</td>
        <td>$1.80</td>
        <td>45.1 pts/$</td>
        <td>Pareto Sweet Spot</td>
      </tr>
      <tr>
        <td><strong>Claude 3.7 Sonnet</strong></td>
        <td>86.8%</td>
        <td>$4.50</td>
        <td>19.3 pts/$</td>
        <td>Frontier Efficiency</td>
      </tr>
      <tr>
        <td><strong>GPT-5.4 Standard</strong></td>
        <td>87.5%</td>
        <td>$6.20</td>
        <td>14.1 pts/$</td>
        <td>Frontier Benchmark</td>
      </tr>
      <tr>
        <td><strong>Claude 3.7 Opus</strong></td>
        <td>89.1%</td>
        <td>$22.00</td>
        <td>4.1 pts/$</td>
        <td>Diminishing Returns</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- Chart: Pareto Frontier Scatter Plot with Optimal Boundary -->
<div data-finops-chart="pareto-frontier"></div>
```

---

## Template 7: Multi-Tier Cascade Routing Funnel (AI Gateway Yield)

```html
<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>Routing Tier</th>
        <th>Queries Handled</th>
        <th>Traffic Share</th>
        <th>Unit Rate / 1M</th>
        <th>Subtotal Spend</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Incoming Gateway Traffic</strong></td>
        <td>10.0M</td>
        <td>100%</td>
        <td>$0.00 Base</td>
        <td>$0.00</td>
      </tr>
      <tr>
        <td><strong>Tier 1: Filter & Flash</strong></td>
        <td>6.8M</td>
        <td>68%</td>
        <td>$0.15/M</td>
        <td>$1.02</td>
      </tr>
      <tr>
        <td><strong>Tier 2: Mid Reasoning</strong></td>
        <td>2.2M</td>
        <td>22%</td>
        <td>$3.00/M</td>
        <td>$6.60</td>
      </tr>
      <tr>
        <td><strong>Tier 3: Frontier Opus/Pro</strong></td>
        <td>1.0M</td>
        <td>10%</td>
        <td>$25.00/M</td>
        <td>$25.00</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- Chart: Multi-Tier Cascade Funnel with -86.9% Net Savings -->
<div data-finops-chart="cascade-funnel"></div>
```

---

## Template 8: SaaS AI Feature Gross Margin Erosion Meter

```html
<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>Customer Usage Tier</th>
        <th>Seat Revenue</th>
        <th>Token Burn Cost</th>
        <th>Gross Profit / Loss</th>
        <th>Unit Margin</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Light User (50% of seats)</strong></td>
        <td>$40.00</td>
        <td>$4.20</td>
        <td>+$35.80 profit</td>
        <td>+89.5% Gross Margin</td>
      </tr>
      <tr>
        <td><strong>Medium User (35% of seats)</strong></td>
        <td>$40.00</td>
        <td>$18.50</td>
        <td>+$21.50 profit</td>
        <td>+53.7% Gross Margin</td>
      </tr>
      <tr>
        <td><strong>Heavy User (10% of seats)</strong></td>
        <td>$40.00</td>
        <td>$34.00</td>
        <td>+$6.00 profit</td>
        <td>+15.0% Gross Margin</td>
      </tr>
      <tr>
        <td><strong>Uncapped Extreme (Top 5%)</strong></td>
        <td>$40.00</td>
        <td>$88.40</td>
        <td>-$48.40 loss</td>
        <td>-121.0% Net Loss</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- Chart: Gross Margin Erosion Meter with Revenue Ceiling -->
<div data-finops-chart="margin-erosion" data-finops-config='{
  "seatRevenue": 40.00
}'></div>
```

---

## Template 9: Prompt Cache Inactivity TTL Decay Timeline

```html
<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>Inactivity Window</th>
        <th>Cache Status</th>
        <th>Effective Token Rate</th>
        <th>Latency</th>
        <th>Financial Impact</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>0 to 4 Minutes</strong></td>
        <td>Hot Cache (90% Hit)</td>
        <td>$0.30 / 1M</td>
        <td>~280ms</td>
        <td>92% Cache Discount</td>
      </tr>
      <tr>
        <td><strong>5-Minute Boundary</strong></td>
        <td>Eviction Threshold</td>
        <td>Transition Phase</td>
        <td>Ramping</td>
        <td>TTL Eviction Boundary</td>
      </tr>
      <tr>
        <td><strong>6 to 10+ Minutes</strong></td>
        <td>Evicted Cold Write (0% Hit)</td>
        <td>$3.75 / 1M</td>
        <td>~1,420ms</td>
        <td>Full Cold Write Penalty</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- Chart: TTL Decay Timeline with Snapping Time Crosshair -->
<div data-finops-chart="ttl-decay" data-finops-config='{
  "hotRate": 0.30,
  "coldRate": 3.75,
  "ttlMinutes": 5.0,
  "maxMinutes": 10.0
}'></div>
```

