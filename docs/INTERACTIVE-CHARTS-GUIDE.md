# FinOps LLM — Interactive Blog Visualizations Guide

This guide details how to create and embed interactive FinOps data visualizations in blog articles on [finopsllm.com](https://finopsllm.com).

---

## 1. Zero-Obstruction Visual Architecture

All charts in [`src/assets/finops-charts.js`](file:///f:/FINOPSLLM/finops-llm/src/assets/finops-charts.js) use the **Non-Obstructing Telemetry Readout Deck**:
* **No Overlapping Popovers**: The live inspection readout sits in a dedicated ribbon *above* the chart canvas. Hovering over bars, curves, slices, or turns never covers or obscures the data points.
* **Clean Data-Driven Layout**: No icons or extraneous badge clutter in templates. Visualizations rely purely on typography, tabular comparisons, and responsive SVG data geometry.
* **Zero External Dependencies**: Pure responsive SVG + vanilla DOM events. No Chart.js, D3, or React required.
* **Global Script Loading**: Automatically included on every article through [`src/_includes/article.njk`](file:///f:/FINOPSLLM/finops-llm/src/_includes/article.njk).

---

## 2. Brand Color Tokens

| Semantic Role | Color Name | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| **FinOps Savings & Yield** | Mint Green | `#4ADE80` | Prompt cache savings, 0% parity, PTU discount |
| **LLM Input / Direct Tokens**| Electric Sky | `#38BDF8` | Direct API input rates, PTU reservation curve |
| **Managed Cloud Input** | Royal Blue | `#1D4ED8` | Azure & AWS Bedrock input rates |
| **Model Output Tokens** | Soft Violet | `#818CF8` | Direct API output rates, Reasoning & CoT tokens |
| **Managed Cloud Output** | Soft Purple | `#C084FC` | Azure & AWS Bedrock output rates |
| **Overspend & PayGo Burn** | Flame Orange | `#EA580C` | Uncached quadratic curve, PayGo line, surcharges |
| **Telemetry & Guides** | Ice Blue | `#7AAFFF` | Crosshair lines, active badges, guide indicators |
| **Card Surface** | Deep Charcoal| `#101726` | Card background matching article theme |
| **Data Well & Inset** | Midnight Navy| `#0B1437` | Inset data boxes, readout decks, brand base |
| **Gridline & Outlines** | Slate Navy | `#1E2A3F` | Gridlines, structural borders (hover: `#2B3D5B`) |

---

## 3. The 5 Predefined Chart Templates

Drop any of these tags beneath a comparison table in an article JSON (`src/_data/articles/*.json`) or Nunjucks template (`src/research/*.njk`).

### Template 1: Grouped Bar Chart (Rate Parity)
```html
<div data-finops-chart="grouped-bar" data-finops-config='{
  "title": "Grouped Bar: Direct OpenAI vs Azure Global Rates",
  "subtitle": "Input & output rates per 1M tokens comparing Direct API against Azure Global deployment.",
  "data": [
    { "model": "GPT-5.4 Std", "directIn": 2.50, "directOut": 15.00, "azureIn": 2.50, "azureOut": 15.00, "note": "Full Parity: Azure Global matches Direct list exactly." },
    { "model": "GPT-5.4 >272K", "directIn": 3.50, "directOut": 18.00, "azureIn": 5.00, "azureOut": 22.50, "note": "Azure Long-Context Markup: +43% on input, +25% on output." }
  ]
}'></div>
```

### Template 2: Break-Even Line Chart (PayGo vs Reserved)
```html
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

### Template 3: Token Donut (Session Anatomy)
```html
<div data-finops-chart="token-donut" data-finops-config='{
  "title": "Donut Chart: Typical Agent Session Cost Composition",
  "subtitle": "Interactive breakdown of where the bill actually goes: system prompts, cache hits, reasoning, and output.",
  "data": [
    { "label": "Cached System Prompts", "percent": 48, "cost": 24.50, "tokens": "480k", "color": "#4ADE80", "desc": "Saved 90% via prompt caching ($24.50 vs $245.00 uncached)", "tip": "Prefix caching turns static instructions into negligible cost." },
    { "label": "Tool Schema & Context", "percent": 24, "cost": 36.80, "tokens": "240k", "color": "#38BDF8", "desc": "MCP schemas & conversation history re-sent each turn", "tip": "Prune unused tool schemas to recover ~15% prompt budget." }
  ]
}'></div>
```

### Template 4: Horizontal Delta Bar (Sovereign Markups)
```html
<div data-finops-chart="horizontal-delta" data-finops-config='{
  "title": "Horizontal Delta: Regional Markup vs Direct Global Base",
  "subtitle": "Data sovereignty and regional routing markups (+0% to +35%) over base list pricing.",
  "data": [
    { "deployment": "Azure Global (Standard)", "delta": 0, "tag": "Parity (0%)", "baseline": 25.00, "current": 25.00, "color": "#4ADE80", "tier": "Standard Global", "note": "Matches Direct list exactly. No data residency guarantee." },
    { "deployment": "Azure Data Zone (EU/US)", "delta": 12, "tag": "+12%", "baseline": 25.00, "current": 28.00, "color": "#38BDF8", "tier": "Geographical Boundary", "note": "Guaranteed processing boundaries within EU or US jurisdiction." }
  ]
}'></div>
```

### Template 5: Cumulative Context Waterfall (Caching Compounding)
```html
<div data-finops-chart="waterfall" data-finops-config='{
  "title": "Context Accumulation Waterfall: Cost Growth Across 8 Turns",
  "subtitle": "Illustrates multi-turn prompt inflation and the massive delta between raw tokens and prompt caching.",
  "turns": [
    { "turn": "T1: Initial Prompt", "uncached": 0.04, "cached": 0.04, "tokens": "4k tokens", "note": "Cold prompt: Cache write turn, identical base cost." },
    { "turn": "T2: File Read", "uncached": 0.12, "cached": 0.05, "tokens": "12k tokens", "note": "File loaded into context: 80% cached." }
  ]
}'></div>
```

---

## 4. Predefined Templates in the Repository

1. **Full Article Starter JSON**:
   [`src/assets/templates/blog-article-blueprint.json`](file:///f:/FINOPSLLM/finops-llm/src/assets/templates/blog-article-blueprint.json)
   *Complete ready-to-copy article template containing metadata, tags, FAQ schema, and all 5 tables/charts.*

2. **Drop-in Snippets**:
   [`src/assets/templates/finops-charts-snippets.html`](file:///f:/FINOPSLLM/finops-llm/src/assets/templates/finops-charts-snippets.html)
   *Copy-paste tables + chart tags with full configurations.*

3. **Core Engine**:
   [`src/assets/finops-charts.js`](file:///f:/FINOPSLLM/finops-llm/src/assets/finops-charts.js)
