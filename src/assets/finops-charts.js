/**
 * FinOps LLM — Interactive Blog Visualizations Engine
 * Lightweight, zero-dependency SVG chart suite built for finopsllm.com research blogs.
 * Engineered with a dedicated Non-Obstructing Telemetry Readout Deck so popups NEVER cover the graphs.
 * Full multi-language i18n engine supporting all 16 locales with automatic language detection.
 * No icons or heavyweight dependencies: clean, data-driven typography and vector graphics.
 *
 * Authentic FinOps LLM Brand Colors:
 * - Mint Green (#4ADE80) / Emerald (#10B981) -> Prompt Cache Yield, Savings, Break-Even
 * - Electric Sky (#38BDF8) / Cerulean (#0284C7) -> Input Tokens, Direct API
 * - Royal Blue (#1D4ED8) / Ice Blue (#7AAFFF) -> Managed Cloud (Azure/Bedrock), Crosshairs
 * - Soft Violet (#818CF8) / Purple (#C084FC) -> Output & Reasoning Tokens
 * - Flame Orange (#EA580C) / Amber (#F59E0B) -> Uncached Burn, PayGo Curves, Surcharges
 * - Midnight Navy (#0B1437) / Surface (#101726) -> Backgrounds, Insets, Borders (#1E2A3F)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.FinOpsCharts = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  const BRAND = {
    canvasBg: '#0A0F1A',
    cardBg: '#101726',
    wellBg: '#0B1437',
    border: '#1E2A3F',
    borderHover: '#2B3D5B',
    crosshair: '#7AAFFF',
    textWhite: '#FFFFFF',
    textMain: '#E6EAF2',
    textMuted: '#8C98AC',
    textDim: '#647289',
    
    // Core Data Series
    savingsMint: '#4ADE80',
    savingsEmerald: '#10B981',
    tokenSky: '#38BDF8',
    tokenBlue: '#1D4ED8',
    outputViolet: '#818CF8',
    outputPurple: '#C084FC',
    burnOrange: '#EA580C',
    warningAmber: '#F59E0B'
  };

  // Full 16-language dictionary matching src/_data/langs.js
  const I18N = {
  "en": {
    "pfTitle": "Cost-Quality Pareto Frontier: Accuracy vs Task Cost",
    "pfSubtitle": "Maps model benchmark accuracy against cost per resolved task to determine optimal price-to-performance efficiency.",
    "pfSummaryTag": "SWE-bench Frontier",
    "pfSummaryDesc": "o3-mini & Sonnet 3.7 occupy the Pareto Sweet Spot: 81–87% accuracy at $1.80–$4.50/task.",
    "pfEfficiencyTag": "85% Frontier Efficiency",
    "pfCostAxis": "Cost per Resolved SWE Task ($) →",
    "pfAccAxis": "Benchmark Task Accuracy (%)",
    "pfBoundary": "Optimal Pareto Boundary →",
    "pfSweetSpot": "Pareto Sweet Spot",
    "pfFrontierEff": "Frontier Efficiency",
    "pfValueLeader": "Value Leader",
    "pfDiminishing": "Diminishing Return",
    "pfAccLabel": "Accuracy:",
    "pfCostLabel": "Cost:",
    "pfEffScore": "Pts/$:",
    "cfTitle": "Multi-Tier Cascade Routing Funnel & Yield",
    "cfSubtitle": "Simulates dynamic query tiering from ultra-cheap Flash filters to frontier reasoning models.",
    "cfSummaryTag": "Cascade Yield",
    "cfSummaryDesc": "Blended spend: $32.62 vs $250.00 if 100% routed to Frontier models.",
    "cfNetSavings": "-86.9% Net Savings",
    "cfIncoming": "Incoming Traffic (100%)",
    "cfTier1": "Tier 1: Filter & Flash (68%)",
    "cfTier2": "Tier 2: Mid Reasoning (22%)",
    "cfTier3": "Tier 3: Frontier Opus/Pro (10%)",
    "cfVolume": "Volume:",
    "cfRate": "Rate:",
    "cfSubtotal": "Subtotal:",
    "cfShare": "Share of Spend:",
    "meTitle": "SaaS AI Feature Gross Margin Erosion Meter",
    "meSubtitle": "Fixed seat subscription revenue ($40/mo) versus variable token burn across customer usage percentiles.",
    "meSummaryTag": "Unit Economics",
    "meSummaryDesc": "Flat $40/user seat revenue vs variable AI token consumption per cohort.",
    "meTopLoss": "Top 5% Erase Margins",
    "meLight": "Light User (50% of seats)",
    "meMedium": "Medium User (35% of seats)",
    "meHeavy": "Power User (10% of seats)",
    "meExtreme": "Uncapped Extreme (Top 5%)",
    "meGrossMargin": "Gross Margin",
    "meNetLoss": "Net Loss",
    "meProfit": "profit",
    "meLoss": "loss",
    "meRevenueCeiling": "$40 Seat Revenue Ceiling",
    "meTokenCost": "Token Cost:",
    "meRevenue": "Revenue:",
    "ttlTitle": "Prompt Cache Inactivity TTL Decay Timeline",
    "ttlSubtitle": "Visualizes the 5-minute inactivity boundary where cached prompt states evict to cold write pricing.",
    "ttlSummaryTag": "TTL Eviction Window",
    "ttlSummaryDesc": "5-Minute Inactivity Window: Calls within 4 min hit cache ($0.30/M); calls at 6+ min incur cold write ($3.75/M).",
    "ttlThreshold": "5-Min Boundary",
    "ttlBoundary": "5-Min Inactivity TTL Boundary",
    "ttlHotZone": "Hot Cache Zone (0–4m: 90% Hit)",
    "ttlColdZone": "Evicted Cold Zone (5m+: 0% Hit)",
    "ttlStateHit": "HIT (Hot Context)",
    "ttlStateMiss": "EVICTED (Cold Write)",
    "ttlInterval": "Interval:",
    "ttlState": "State:",
    "ttlEffRate": "Effective Rate:",
    "ttlLatency": "Latency:",
    "ttlDiscount": "92% Cache Discount",
    "ttlPenalty": "Full Cold Write Penalty",
    "gbTitle": "Direct API vs Cloud Managed Rates",
    "gbSubtitle": "Input & output rates per 1M tokens comparing Direct API against Cloud Managed providers.",
    "gbSummaryTag": "Summary",
    "gbSummaryDesc": "Hover any model column below to inspect exact input/output rate parity and percentage differentials.",
    "gbDelta": "4-Metric Comparison",
    "directIn": "Direct Input",
    "cloudIn": "Cloud Input",
    "directOut": "Direct Output",
    "cloudOut": "Cloud Output",
    "inputRate": "Input:",
    "outputRate": "Output:",
    "beTitle": "Break-Even Curve: On-Demand vs PTU Monthly Reservation",
    "beSubtitle": "Identifies the exact token volume threshold where provisioned reservations beat pay-as-you-go.",
    "beTag": "Break-Even: ~{tokens}M Tokens",
    "beDesc": "Monthly threshold where 1x PTU reservation ({base} base + {marginal}/M) beats Pay-As-You-Go ({paygo}/M).",
    "beSpendIdentical": "Spend: ~{cost}/mo identical",
    "paygoLabel": "Pay-As-You-Go",
    "ptuLabel": "PTU Reserved",
    "beIntersection": "Break-Even Intersection",
    "beExact": "Exact Break-Even: Spend ~{cost}/mo identical",
    "bePtuSaves": "PTU saves {delta}/mo ({pct}% discount)",
    "bePaygoCheaper": "PayGo is {delta}/mo cheaper",
    "tokensPerMo": "{tokens}M Tokens / mo",
    "tdTitle": "Donut Chart: Typical Agent Session Cost Composition",
    "tdSubtitle": "Interactive breakdown of where the bill actually goes: system prompts, cache hits, reasoning, and output.",
    "tdSessionSpendTag": "Session Spend",
    "tdSessionSpendDesc": "Hover any slice or list row to isolate category cost and inspect architectural optimization levers.",
    "tdTotalTokens": "Total: $134.50 / 1.0M Tokens",
    "tdSystemCache": "System Cache (48%)",
    "tdToolContext": "Tool Context (24%)",
    "tdReasoning": "Reasoning CoT (18%)",
    "tdGeneration": "Generation (10%)",
    "cost": "Cost:",
    "tokens": "Tokens:",
    "share": "share",
    "hdTitle": "Horizontal Delta: Regional Markup vs Direct Global Base",
    "hdSubtitle": "Data sovereignty and regional routing markups (+0% to +35%) over base list pricing.",
    "hdBenchmarkTag": "Residency Benchmark",
    "hdBenchmarkDesc": "Hover any deployment tier below to inspect data sovereignty premiums and normalized 10M token spend.",
    "hdBaselineRef": "0% Baseline = Direct API",
    "hdParity": "0% Parity",
    "hdDataZone": "Data Zone (+12%)",
    "hdSingleRegion": "Single Region (+18%)",
    "hdSovereign": "Sovereign (+35%)",
    "normCost": "Norm 10M:",
    "markup": "Markup",
    "wfTitle": "Multi-Turn Compounding Waterfall: Uncached vs Prompt Cached",
    "wfSubtitle": "Simulates context accumulation over 8 turns showing uncached quadratic cost vs flat cached execution.",
    "wfAuditTag": "Compounding Audit",
    "wfAuditDesc": "Glide cursor across turns T1–T8 below to compare uncached quadratic burn vs flat cached execution.",
    "wfYield": "85% Total Session Yield",
    "wfUncached": "Without Caching (Quadratic Compounding)",
    "wfCached": "With Prompt Caching (Flat Incremental)",
    "wfSavings": "85% Final Savings",
    "uncached": "Uncached:",
    "cached": "Cached:",
    "inContext": "in context",
    "savedMsg": "Saved {saved} ({pct}% discount)",
    "tier": "Tier:",
    "hdBaseline": "0% Baseline",
    "parity": "Parity (0%)",
    "exactParity": "Exact Parity",
    "totalSpend": "Total Batch Spend",
    "tokenDist": "Token Distribution",
    "catCount": "4 Categories",
    "sessionPct": "of session spend",
    "tokensAll": "100% of tokens"
  },
  "de": {
    "pfTitle": "Kosten-Qualitäts-Pareto-Grenze: Genauigkeit vs. Aufgabenkosten",
    "pfSubtitle": "Stellt die Benchmark-Genauigkeit den Kosten pro gelöster Aufgabe gegenüber, um das optimale Preis-Leistungs-Verhältnis zu ermitteln.",
    "pfSummaryTag": "SWE-bench-Grenze",
    "pfSummaryDesc": "o3-mini & Sonnet 3.7 besetzen den Pareto-Sweet-Spot: 81–87% Genauigkeit bei 1,80 $–4,50 $/Aufgabe.",
    "pfEfficiencyTag": "85% Grenzwert-Effizienz",
    "pfCostAxis": "Kosten pro gelöster SWE-Aufgabe ($) →",
    "pfAccAxis": "Benchmark-Genauigkeit (%)",
    "pfBoundary": "Optimale Pareto-Grenze →",
    "pfSweetSpot": "Pareto-Sweet-Spot",
    "pfFrontierEff": "Frontier-Effizienz",
    "pfValueLeader": "Preisführer",
    "pfDiminishing": "Abnehmender Ertrag",
    "pfAccLabel": "Genauigkeit:",
    "pfCostLabel": "Kosten:",
    "pfEffScore": "Punkte/$:",
    "cfTitle": "Mehrstufiger Kaskaden-Routing-Trichter & Ertrag",
    "cfSubtitle": "Simuliert dynamische Abfragestufen von günstigen Flash-Filtern bis hin zu Frontier-Modellen.",
    "cfSummaryTag": "Kaskaden-Ertrag",
    "cfSummaryDesc": "Mischkosten: 32,62 $ gegenüber 250,00 $, wenn 100 % über Frontier-Modelle geleitet würden.",
    "cfNetSavings": "-86,9% Netto-Ersparnis",
    "cfIncoming": "Eingehender Datenverkehr (100%)",
    "cfTier1": "Stufe 1: Filter & Flash (68%)",
    "cfTier2": "Stufe 2: Mittleres Denken (22%)",
    "cfTier3": "Stufe 3: Frontier Opus/Pro (10%)",
    "cfVolume": "Volumen:",
    "cfRate": "Tarif:",
    "cfSubtotal": "Zwischensumme:",
    "cfShare": "Kostenanteil:",
    "meTitle": "Erosionsmesser für SaaS-KI-Bruttomargen",
    "meSubtitle": "Feste Sitzungs-Abo-Einnahmen (40 $/Monat) vs. variabler Token-Verbrauch nach Nutzer-Perzentilen.",
    "meSummaryTag": "Stückkostenrechnung",
    "meSummaryDesc": "Pauschal 40 $/Nutzer Einnahmen vs. variabler KI-Token-Verbrauch je Kohorte.",
    "meTopLoss": "Top 5% vernichten Margen",
    "meLight": "Geringe Nutzung (50% d. Sitze)",
    "meMedium": "Mittlere Nutzung (35% d. Sitze)",
    "meHeavy": "Hohe Nutzung (10% d. Sitze)",
    "meExtreme": "Extremnutzung (Top 5%)",
    "meGrossMargin": "Bruttomarge",
    "meNetLoss": "Nettoverlust",
    "meProfit": "Gewinn",
    "meLoss": "Verlust",
    "meRevenueCeiling": "40 $ Einnahmenobergrenze",
    "meTokenCost": "Token-Kosten:",
    "meRevenue": "Einnahmen:",
    "ttlTitle": "Prompt-Cache-Inaktivitäts-TTL-Zerfallslinie",
    "ttlSubtitle": "Visualisiert die 5-Minuten-Grenze, ab der gecachte Prompts auf Kaltstart-Preise zurückfallen.",
    "ttlSummaryTag": "TTL-Fenster",
    "ttlSummaryDesc": "5-Minuten-Inaktivitätsfenster: Abrufe innerhalb von 4 Min. treffen Cache (0,30 $/M); ab 6 Min. Kaltstart (3,75 $/M).",
    "ttlThreshold": "5-Min-Schwelle",
    "ttlBoundary": "5-Min-Inaktivitätsgrenze",
    "ttlHotZone": "Heißer Cache-Bereich (0–4 Min.: 90% Treffer)",
    "ttlColdZone": "Kalter Bereich (ab 5 Min.: 0% Treffer)",
    "ttlStateHit": "TREFFER (Heißer Kontext)",
    "ttlStateMiss": "VERFALLEN (Kaltstart)",
    "ttlInterval": "Intervall:",
    "ttlState": "Status:",
    "ttlEffRate": "Effektiver Tarif:",
    "ttlLatency": "Latenz:",
    "ttlDiscount": "92% Cache-Rabatt",
    "ttlPenalty": "Voller Kaltstart-Aufpreis",
    "gbTitle": "Direkt-API vs. Cloud Managed Tarife",
    "gbSubtitle": "Eingabe- und Ausgaberaten pro 1 Mio. Token im Vergleich zwischen Direkt-API und Cloud-Providern.",
    "gbSummaryTag": "Übersicht",
    "gbSummaryDesc": "Bewegen Sie den Mauszeiger über eine Spalte, um Ein- und Ausgaberaten sowie prozentuale Aufschläge zu prüfen.",
    "gbDelta": "4-Metriken-Vergleich",
    "directIn": "Direkt Input",
    "cloudIn": "Cloud Input",
    "directOut": "Direkt Output",
    "cloudOut": "Cloud Output",
    "inputRate": "Eingabe:",
    "outputRate": "Ausgabe:",
    "beTitle": "Break-even-Kurve: On-Demand vs. Monatliche PTU-Reservierung",
    "beSubtitle": "Ermittelt das monatliche Tokenvolumen, ab dem reservierte PTUs günstiger sind als Pay-as-you-go.",
    "beTag": "Break-even: ~{tokens} Mio. Token",
    "beDesc": "Monatsschwelle, ab der 1x PTU-Reservierung ({base} Basis + {marginal}/M) günstiger ist als Pay-as-you-go ({paygo}/M).",
    "beSpendIdentical": "Ausgaben: ~{cost}/Monat identisch",
    "paygoLabel": "Pay-as-you-go",
    "ptuLabel": "PTU-Reservierung",
    "beIntersection": "Break-even-Schnittpunkt",
    "beExact": "Exakter Break-even: ~{cost}/Monat identisch",
    "bePtuSaves": "PTU spart {delta}/Monat ({pct}% Rabatt)",
    "bePaygoCheaper": "PayGo ist {delta}/Monat günstiger",
    "tokensPerMo": "{tokens} Mio. Token / Monat",
    "tdTitle": "Donut-Diagramm: Kostenaufteilung einer Agenten-Sitzung",
    "tdSubtitle": "Interaktive Aufschlüsselung: System-Prompts, Cache-Treffer, Denkprozesse und Ausgabe.",
    "tdSessionSpendTag": "Sitzungskosten",
    "tdSessionSpendDesc": "Mauszeiger über Segment oder Zeile bewegen, um Kostenkategorien und Optimierungshebel zu analysieren.",
    "tdTotalTokens": "Gesamt: $134.50 / 1.0 Mio. Token",
    "tdSystemCache": "System-Cache (48%)",
    "tdToolContext": "Tool-Kontext (24%)",
    "tdReasoning": "Reasoning CoT (18%)",
    "tdGeneration": "Ausgabe (10%)",
    "cost": "Kosten:",
    "tokens": "Token:",
    "share": "Anteil",
    "hdTitle": "Horizontales Delta: Regionaler Aufschlag vs. Direkt-Basispreis",
    "hdSubtitle": "Aufschläge für Datensouveränität und regionale Datenresidenz (+0 % bis +35 %) gegenüber Listenpreisen.",
    "hdBenchmarkTag": "Residenz-Benchmark",
    "hdBenchmarkDesc": "Bereitstellungsstufe überfahren, um Aufpreise für Datenhoheit und normalisierte Kosten je 10M Token zu sehen.",
    "hdBaselineRef": "0% Basis = Direkt-API",
    "hdParity": "0% Parität",
    "hdDataZone": "Datenzone (+12%)",
    "hdSingleRegion": "Einzelne Region (+18%)",
    "hdSovereign": "Souverän (+35%)",
    "normCost": "Norm 10M:",
    "markup": "Aufschlag",
    "wfTitle": "Multi-Turn-Wasserfall: Ohne Cache vs. Prompt-Caching",
    "wfSubtitle": "Simuliert Kontextaufbau über 8 Schritte: quadratisches Kostenwachstum vs. flacher Cache-Verlauf.",
    "wfAuditTag": "Audit-Verlauf",
    "wfAuditDesc": "Maus über Schritte T1–T8 bewegen, um ungecachten Verlauf mit Prompt-Caching zu vergleichen.",
    "wfYield": "85% Gesamtersparnis",
    "wfUncached": "Ohne Cache (Quadratischer Anstieg)",
    "wfCached": "Mit Prompt-Caching (Flach inkrementell)",
    "wfSavings": "85% Gesamtersparnis",
    "uncached": "Ungecacht:",
    "cached": "Gecacht:",
    "inContext": "im Kontext",
    "savedMsg": "{saved} gespart ({pct}% Rabatt)",
    "tier": "Stufe:",
    "hdBaseline": "0% Basis",
    "parity": "Parität (0%)",
    "exactParity": "Exakte Parität",
    "totalSpend": "Gesamtausgaben",
    "tokenDist": "Token-Verteilung",
    "catCount": "4 Kategorien",
    "sessionPct": "der Sitzungsausgaben",
    "tokensAll": "100 % aller Token"
  },
  "es": {
    "pfTitle": "Frontera de Pareto Coste-Calidad: Precisión vs Coste de Tarea",
    "pfSubtitle": "Mapea la precisión en benchmarks frente al coste por tarea para determinar el ratio óptimo precio-rendimiento.",
    "pfSummaryTag": "Frontera SWE-bench",
    "pfSummaryDesc": "o3-mini y Sonnet 3.7 ocupan el punto óptimo de Pareto: 81–87% de precisión a $1.80–$4.50/tarea.",
    "pfEfficiencyTag": "85% Eficiencia de Frontera",
    "pfCostAxis": "Coste por tarea resuelta ($) →",
    "pfAccAxis": "Precisión en Benchmark (%)",
    "pfBoundary": "Límite óptimo de Pareto →",
    "pfSweetSpot": "Punto óptimo de Pareto",
    "pfFrontierEff": "Eficiencia de Frontera",
    "pfValueLeader": "Líder de valor",
    "pfDiminishing": "Rendimiento decreciente",
    "pfAccLabel": "Precisión:",
    "pfCostLabel": "Coste:",
    "pfEffScore": "Pts/$:",
    "cfTitle": "Embudo de Enrutamiento en Cascada y Rendimiento",
    "cfSubtitle": "Simula niveles dinámicos desde filtros Flash ultrarrápidos hasta modelos frontera avanzados.",
    "cfSummaryTag": "Rendimiento de Cascada",
    "cfSummaryDesc": "Gasto combinado: $32.62 frente a $250.00 si el 100% fuese a modelos frontera.",
    "cfNetSavings": "-86.9% Ahorro Neto",
    "cfIncoming": "Tráfico entrante (100%)",
    "cfTier1": "Nivel 1: Filtro y Flash (68%)",
    "cfTier2": "Nivel 2: Razonamiento medio (22%)",
    "cfTier3": "Nivel 3: Frontera Opus/Pro (10%)",
    "cfVolume": "Volumen:",
    "cfRate": "Tarifa:",
    "cfSubtotal": "Subtotal:",
    "cfShare": "Cuota de gasto:",
    "meTitle": "Medidor de Erosión del Margen Bruto en SaaS con IA",
    "meSubtitle": "Ingresos fijos por suscripción ($40/mes) frente al consumo variable de tokens por percentil.",
    "meSummaryTag": "Economía Unitaria",
    "meSummaryDesc": "Tarifa fija de $40/usuario frente a consumo variable de tokens por cohorte.",
    "meTopLoss": "Top 5% elimina los márgenes",
    "meLight": "Uso ligero (50% de cuentas)",
    "meMedium": "Uso medio (35% de cuentas)",
    "meHeavy": "Uso alto (10% de cuentas)",
    "meExtreme": "Extremo sin límite (Top 5%)",
    "meGrossMargin": "Margen Bruto",
    "meNetLoss": "Pérdida Neta",
    "meProfit": "beneficio",
    "meLoss": "pérdida",
    "meRevenueCeiling": "Techo de ingresos $40",
    "meTokenCost": "Coste de tokens:",
    "meRevenue": "Ingresos:",
    "ttlTitle": "Decaimiento del TTL por Inactividad en Caché de Prompts",
    "ttlSubtitle": "Visualiza el límite de 5 minutos donde la caché expira y pasa a tarifa de escritura en frío.",
    "ttlSummaryTag": "Ventana de TTL",
    "ttlSummaryDesc": "Ventana de 5 min: peticiones en <4 min usan caché ($0.30/M); a más de 6 min sufren escritura fría ($3.75/M).",
    "ttlThreshold": "Límite 5 min",
    "ttlBoundary": "Límite de inactividad de 5 min",
    "ttlHotZone": "Zona caliente (0–4m: 90% aciertos)",
    "ttlColdZone": "Zona fría expirada (5m+: 0% aciertos)",
    "ttlStateHit": "ACIERTO (Caché activa)",
    "ttlStateMiss": "EXPIRADO (Escritura fría)",
    "ttlInterval": "Intervalo:",
    "ttlState": "Estado:",
    "ttlEffRate": "Tarifa efectiva:",
    "ttlLatency": "Latencia:",
    "ttlDiscount": "92% Descuento caché",
    "ttlPenalty": "Penalización completa de escritura",
    "gbTitle": "Tarifas API Directa vs Nube Gestionada",
    "gbSubtitle": "Costes de entrada y salida por 1M de tokens comparando API Directa frente a Nube Gestionada.",
    "gbSummaryTag": "Resumen",
    "gbSummaryDesc": "Pase el cursor sobre cualquier columna para comprobar la paridad de precios y las diferencias porcentuales.",
    "gbDelta": "Comparación de 4 métricas",
    "directIn": "Entrada Directa",
    "cloudIn": "Entrada Cloud",
    "directOut": "Salida Directa",
    "cloudOut": "Salida Cloud",
    "inputRate": "Entrada:",
    "outputRate": "Salida:",
    "beTitle": "Curva de equilibrio: Pago por uso vs. Reserva mensual de PTU",
    "beSubtitle": "Identifica el volumen mensual de tokens donde la reserva PTU supera al pago por uso.",
    "beTag": "Punto de corte: ~{tokens}M Tokens",
    "beDesc": "Umbral mensual donde 1x reserva PTU ({base} base + {marginal}/M) supera al pago por uso ({paygo}/M).",
    "beSpendIdentical": "Gasto: ~{cost}/mes idéntico",
    "paygoLabel": "Pago por uso",
    "ptuLabel": "PTU Reservado",
    "beIntersection": "Punto de equilibrio",
    "beExact": "Equilibrio exacto: Gasto ~{cost}/mes idéntico",
    "bePtuSaves": "PTU ahorra {delta}/mes ({pct}% descuento)",
    "bePaygoCheaper": "Pago por uso es {delta}/mes más barato",
    "tokensPerMo": "{tokens}M Tokens / mes",
    "tdTitle": "Gráfico circular: Composición del gasto de sesión",
    "tdSubtitle": "Desglose interactivo de costes: instrucciones del sistema, caché, razonamiento y generación.",
    "tdSessionSpendTag": "Gasto de sesión",
    "tdSessionSpendDesc": "Pase el cursor sobre un sector o fila para aislar costes y revisar palancas de optimización.",
    "tdTotalTokens": "Total: $134.50 / 1.0M Tokens",
    "tdSystemCache": "Caché de sistema (48%)",
    "tdToolContext": "Contexto de herramientas (24%)",
    "tdReasoning": "Razonamiento CoT (18%)",
    "tdGeneration": "Generación (10%)",
    "cost": "Coste:",
    "tokens": "Tokens:",
    "share": "cuota",
    "hdTitle": "Delta horizontal: Recargo regional vs Tarifa base global",
    "hdSubtitle": "Recargos por soberanía de datos y residencia regional (+0% a +35%) sobre la lista estándar.",
    "hdBenchmarkTag": "Referencia de residencia",
    "hdBenchmarkDesc": "Inspeccione los niveles de despliegue para comprobar recargos por soberanía y coste normalizado por 10M tokens.",
    "hdBaselineRef": "0% Base = API Directa",
    "hdParity": "0% Paridad",
    "hdDataZone": "Zona de datos (+12%)",
    "hdSingleRegion": "Región fija (+18%)",
    "hdSovereign": "Soberana (+35%)",
    "normCost": "Norm 10M:",
    "markup": "Recargo",
    "wfTitle": "Evolución en cascada: Sin caché vs Con caché de prompts",
    "wfSubtitle": "Simulación de acumulación de contexto en 8 turnos: coste cuadrático sin caché vs coste plano con caché.",
    "wfAuditTag": "Auditoría acumulada",
    "wfAuditDesc": "Desplace el cursor por los turnos T1–T8 para comparar el coste no cacheado con el uso de caché.",
    "wfYield": "85% Ahorro total de sesión",
    "wfUncached": "Sin caché (Crecimiento cuadrático)",
    "wfCached": "Con caché (Incremental plano)",
    "wfSavings": "85% Ahorro final",
    "uncached": "Sin caché:",
    "cached": "En caché:",
    "inContext": "en contexto",
    "savedMsg": "Ahorro de {saved} ({pct}% descuento)",
    "tier": "Nivel:",
    "hdBaseline": "0% Base",
    "parity": "Paridad (0%)",
    "exactParity": "Paridad exacta",
    "totalSpend": "Gasto total de lote",
    "tokenDist": "Distribución de tokens",
    "catCount": "4 categorías",
    "sessionPct": "del gasto de sesión",
    "tokensAll": "100% de tokens"
  },
  "fr": {
    "pfTitle": "Frontière de Pareto Coût-Qualité : Précision vs Coût par Tâche",
    "pfSubtitle": "Compare la précision sur les benchmarks au coût par tâche résolue pour identifier le ratio prix-performance optimal.",
    "pfSummaryTag": "Frontière SWE-bench",
    "pfSummaryDesc": "o3-mini & Sonnet 3.7 occupent le point optimal de Pareto : 81–87% de précision à 1,80 $–4,50 $/tâche.",
    "pfEfficiencyTag": "85% Efficacité frontière",
    "pfCostAxis": "Coût par tâche résolue ($) →",
    "pfAccAxis": "Précision benchmark (%)",
    "pfBoundary": "Frontière de Pareto optimale →",
    "pfSweetSpot": "Zone optimale de Pareto",
    "pfFrontierEff": "Efficacité frontière",
    "pfValueLeader": "Leader de valeur",
    "pfDiminishing": "Rendements décroissants",
    "pfAccLabel": "Précision :",
    "pfCostLabel": "Coût :",
    "pfEffScore": "Pts/$ :",
    "cfTitle": "Entonnoir de Routage en Cascade et Rendement",
    "cfSubtitle": "Simule l'étagement dynamique des requêtes des filtres Flash économiques aux modèles frontière.",
    "cfSummaryTag": "Rendement cascade",
    "cfSummaryDesc": "Dépense combinée : 32,62 $ contre 250,00 $ si 100 % était dirigé vers les modèles frontière.",
    "cfNetSavings": "-86,9% Économie nette",
    "cfIncoming": "Trafic entrant (100%)",
    "cfTier1": "Niveau 1 : Filtre & Flash (68%)",
    "cfTier2": "Niveau 2 : Raisonnement moyen (22%)",
    "cfTier3": "Niveau 3 : Frontière Opus/Pro (10%)",
    "cfVolume": "Volume :",
    "cfRate": "Tarif :",
    "cfSubtotal": "Sous-total :",
    "cfShare": "Part du coût :",
    "meTitle": "Indicateur d'Érosion de Marge Brute SaaS IA",
    "meSubtitle": "Revenu d'abonnement fixe (40 $/mois) contre consommation variable de tokens par percentile.",
    "meSummaryTag": "Économie unitaire",
    "meSummaryDesc": "Forfait de 40 $/utilisateur vs consommation variable de tokens par cohorte.",
    "meTopLoss": "Les 5% supérieurs détruisent la marge",
    "meLight": "Usage léger (50% des sièges)",
    "meMedium": "Usage modéré (35% des sièges)",
    "meHeavy": "Usage intensif (10% des sièges)",
    "meExtreme": "Extrême sans plafond (Top 5%)",
    "meGrossMargin": "Marge brute",
    "meNetLoss": "Perte nette",
    "meProfit": "bénéfice",
    "meLoss": "perte",
    "meRevenueCeiling": "Plafond de revenu 40 $",
    "meTokenCost": "Coût tokens :",
    "meRevenue": "Revenu :",
    "ttlTitle": "Décroissance du TTL d'Inactivité du Cache de Prompts",
    "ttlSubtitle": "Visualise la limite de 5 minutes où l'état en cache bascule vers une tarification d'écriture à froid.",
    "ttlSummaryTag": "Fenêtre TTL",
    "ttlSummaryDesc": "Fenêtre de 5 min : appels < 4 min utilisent le cache (0,30 $/M) ; appels > 6 min subissent l'écriture à froid (3,75 $/M).",
    "ttlThreshold": "Seuil 5 min",
    "ttlBoundary": "Limite d'inactivité de 5 min",
    "ttlHotZone": "Zone chaude (0–4 min : 90% succès)",
    "ttlColdZone": "Zone froide expirée (5+ min : 0% succès)",
    "ttlStateHit": "SUCCÈS (Cache actif)",
    "ttlStateMiss": "EXPIRÉ (Écriture à froid)",
    "ttlInterval": "Intervalle :",
    "ttlState": "État :",
    "ttlEffRate": "Tarif effectif :",
    "ttlLatency": "Latence :",
    "ttlDiscount": "92% Remise cache",
    "ttlPenalty": "Pénalité complète écriture froide",
    "gbTitle": "Tarifs API Directe vs Cloud Managé",
    "gbSubtitle": "Tarifs d'entrée et de sortie par million de jetons : comparatif API directe vs fournisseurs cloud.",
    "gbSummaryTag": "Synthèse",
    "gbSummaryDesc": "Survolez une colonne pour comparer la parité des tarifs d'entrée/sortie et les écarts de prix.",
    "gbDelta": "Comparatif 4 métriques",
    "directIn": "Entrée Directe",
    "cloudIn": "Entrée Cloud",
    "directOut": "Sortie Directe",
    "cloudOut": "Sortie Cloud",
    "inputRate": "Entrée :",
    "outputRate": "Sortie :",
    "beTitle": "Courbe de rentabilité : Paiement à l'usage vs Réservation PTU",
    "beSubtitle": "Identifie le seuil de volume de jetons où la réservation PTU devient plus économique que l'usage.",
    "beTag": "Rentabilité : ~{tokens}M Jetons",
    "beDesc": "Seuil mensuel où 1x PTU ({base} base + {marginal}/M) bat le paiement à l'usage ({paygo}/M).",
    "beSpendIdentical": "Dépense : ~{cost}/mois identique",
    "paygoLabel": "Paiement à l'usage",
    "ptuLabel": "PTU Réservé",
    "beIntersection": "Seuil de rentabilité",
    "beExact": "Équilibre exact : Dépense ~{cost}/mois identique",
    "bePtuSaves": "Le PTU économise {delta}/mois ({pct}% remise)",
    "bePaygoCheaper": "L'usage est {delta}/mois moins cher",
    "tokensPerMo": "{tokens}M Jetons / mois",
    "tdTitle": "Diagramme circulaire : Répartition des coûts de session",
    "tdSubtitle": "Décomposition interactive : prompts système, mémoire cache, raisonnement et génération.",
    "tdSessionSpendTag": "Coût de session",
    "tdSessionSpendDesc": "Survolez une section ou une ligne pour isoler les catégories de coût et leviers d'optimisation.",
    "tdTotalTokens": "Total : $134.50 / 1.0M Jetons",
    "tdSystemCache": "Cache système (48%)",
    "tdToolContext": "Contexte outils (24%)",
    "tdReasoning": "Raisonnement CoT (18%)",
    "tdGeneration": "Génération (10%)",
    "cost": "Coût :",
    "tokens": "Jetons :",
    "share": "part",
    "hdTitle": "Delta horizontal : Majoration régionale vs Base globale",
    "hdSubtitle": "Majorations de souveraineté et de résidence locale (+0% à +35%) par rapport au tarif catalogue.",
    "hdBenchmarkTag": "Indice de résidence",
    "hdBenchmarkDesc": "Survolez un niveau de déploiement pour examiner les surcoûts souverains et le coût normalisé pour 10M jetons.",
    "hdBaselineRef": "0% Base = API Directe",
    "hdParity": "0% Parité",
    "hdDataZone": "Zone de données (+12%)",
    "hdSingleRegion": "Région unique (+18%)",
    "hdSovereign": "Souverain (+35%)",
    "normCost": "Norm 10M :",
    "markup": "Majoration",
    "wfTitle": "Cascade multi-tours : Sans cache vs Avec prompt caching",
    "wfSubtitle": "Simulation de l'accumulation du contexte sur 8 tours : hausse quadratique vs coût marginal plat.",
    "wfAuditTag": "Audit de contexte",
    "wfAuditDesc": "Glissez sur les tours T1–T8 pour comparer la consommation sans cache avec le prompt caching.",
    "wfYield": "85% Économie globale",
    "wfUncached": "Sans cache (Croissance quadratique)",
    "wfCached": "Avec cache (Incrément plat)",
    "wfSavings": "85% Gain final",
    "uncached": "Sans cache :",
    "cached": "En cache :",
    "inContext": "en contexte",
    "savedMsg": "Économie de {saved} ({pct}% remise)",
    "tier": "Niveau :",
    "hdBaseline": "0% Base",
    "parity": "Parité (0%)",
    "exactParity": "Parité exacte",
    "totalSpend": "Dépense totale du lot",
    "tokenDist": "Répartition des jetons",
    "catCount": "4 catégories",
    "sessionPct": "des dépenses de session",
    "tokensAll": "100 % des jetons"
  },
  "ja": {
    "pfTitle": "コスト・品質パレート最適フロンティア：精度 vs タスク単価",
    "pfSubtitle": "ベンチマーク精度と解決タスク単価をマッピングし、最適なコストパフォーマンス比率を特定します。",
    "pfSummaryTag": "SWE-bench フロンティア",
    "pfSummaryDesc": "o3-mini と Sonnet 3.7 がパレート最適ポイントを占有：タスク単価 $1.80–$4.50 で 81–87% の精度。",
    "pfEfficiencyTag": "85% フロンティア効率",
    "pfCostAxis": "解決タスクあたりのコスト ($) →",
    "pfAccAxis": "ベンチマーク精度 (%)",
    "pfBoundary": "最適パレート境界 →",
    "pfSweetSpot": "パレート最適スイートスポット",
    "pfFrontierEff": "フロンティア高効率",
    "pfValueLeader": "バリューリーダー",
    "pfDiminishing": "収穫逓減ゾーン",
    "pfAccLabel": "精度:",
    "pfCostLabel": "コスト:",
    "pfEffScore": "得点/$:",
    "cfTitle": "マルチティア カスケードルーティング漏斗と経済性",
    "cfSubtitle": "超低価格な Flash フィルタから高機能フロンティア推論モデルへの動的振り分けを再現。",
    "cfSummaryTag": "カスケード収率",
    "cfSummaryDesc": "加重平均支出：全件フロンティアモデル利用時の $250.00 に対しわずか $32.62。",
    "cfNetSavings": "-86.9% 純節約",
    "cfIncoming": "流入トラフィック (100%)",
    "cfTier1": "第1層: フィルタ & Flash (68%)",
    "cfTier2": "第2層: 中間推論モデル (22%)",
    "cfTier3": "第3層: フロンティア Opus/Pro (10%)",
    "cfVolume": "処理量:",
    "cfRate": "単価:",
    "cfSubtotal": "小計:",
    "cfShare": "費用比率:",
    "meTitle": "SaaS AI機能 売上総利益率（粗利）侵食メーター",
    "meSubtitle": "月額 $40 の定額シート収益と、ユーザー層ごとのトークン原価消費の比較。",
    "meSummaryTag": "ユニットエコノミクス",
    "meSummaryDesc": "定額 $40/ユーザー収益 vs 利用コホート別の変動 AI トークン原価。",
    "meTopLoss": "上位 5% が粗利益を消失",
    "meLight": "ライト層 (50%のシート)",
    "meMedium": "標準層 (35%のシート)",
    "meHeavy": "ヘビー層 (10%のシート)",
    "meExtreme": "無制限エクストリーム (上位 5%)",
    "meGrossMargin": "粗利益率",
    "meNetLoss": "純損失",
    "meProfit": "利益",
    "meLoss": "損失",
    "meRevenueCeiling": "$40 シート売上上限",
    "meTokenCost": "トークン原価:",
    "meRevenue": "売上:",
    "ttlTitle": "プロンプトキャッシュ 無通信TTL減衰タイムライン",
    "ttlSubtitle": "キャッシュが破棄されコールドライト料金へ跳ね上がる 5 分の無通信境界を可視化。",
    "ttlSummaryTag": "TTL 破棄ウィンドウ",
    "ttlSummaryDesc": "5分間無通信境界: 4分以内の呼出はキャッシュ適用 ($0.30/M)、6分以上でコールド書込 ($3.75/M) が発生。",
    "ttlThreshold": "5分境界閾値",
    "ttlBoundary": "5分無通信 TTL 境界",
    "ttlHotZone": "ホットキャッシュ域 (0–4分: 90% ヒット)",
    "ttlColdZone": "破棄コールド域 (5分以降: 0% ヒット)",
    "ttlStateHit": "ヒット (ホット状態)",
    "ttlStateMiss": "破棄 (コールド書込)",
    "ttlInterval": "間隔:",
    "ttlState": "状態:",
    "ttlEffRate": "実効単価:",
    "ttlLatency": "レイテンシ:",
    "ttlDiscount": "92% キャッシュ割引",
    "ttlPenalty": "フルコールド書込ペナルティ",
    "gbTitle": "直接API vs マネージドクラウド料金比較",
    "gbSubtitle": "直接APIとクラウドプロバイダーにおける入力・出力100万トークンあたりの単価比較。",
    "gbSummaryTag": "概要",
    "gbSummaryDesc": "各モデルの列にカーソルを合わせると、入出力の価格同等性とプレミアム比率を確認できます。",
    "gbDelta": "4指標比較",
    "directIn": "直接入力",
    "cloudIn": "クラウド入力",
    "directOut": "直接出力",
    "cloudOut": "クラウド出力",
    "inputRate": "入力:",
    "outputRate": "出力:",
    "beTitle": "損益分岐点カーブ：従量課金 vs PTU月次予約",
    "beSubtitle": "プロビジョンド予約（PTU）が従量課金を上回る正確な月間トークン量を特定。",
    "beTag": "損益分岐点: 約{tokens}M トークン",
    "beDesc": "月間1x PTU予約（基本{base} + {marginal}/M）が従量課金（{paygo}/M）より安くなる月間境界値。",
    "beSpendIdentical": "費用：月額約{cost}で同額",
    "paygoLabel": "従量課金",
    "ptuLabel": "PTU予約",
    "beIntersection": "損益分岐交点",
    "beExact": "完全分岐点：月額約{cost}で同等",
    "bePtuSaves": "PTUで月額{delta}削減（{pct}%割引）",
    "bePaygoCheaper": "従量課金の方が月額{delta}安価",
    "tokensPerMo": "{tokens}M トークン / 月",
    "tdTitle": "ドーナツ図：標準エージェントセッションの費用構成",
    "tdSubtitle": "システムプロンプト、キャッシュ、推論思考、出力生成にかかる費用の内訳。",
    "tdSessionSpendTag": "セッション支出",
    "tdSessionSpendDesc": "スライスまたはリストにカーソルを合わせると、カテゴリ別の費用と最適化策が表示されます。",
    "tdTotalTokens": "合計: $134.50 / 100万トークン",
    "tdSystemCache": "システムキャッシュ (48%)",
    "tdToolContext": "ツールコンテキスト (24%)",
    "tdReasoning": "推論 CoT (18%)",
    "tdGeneration": "出力生成 (10%)",
    "cost": "費用:",
    "tokens": "トークン:",
    "share": "比率",
    "hdTitle": "水平デルタ：リージョン別割増 vs グローバル基準価格",
    "hdSubtitle": "直接定価に対するデータ主権・国内隔離ルーティングの割増率（+0%〜+35%）。",
    "hdBenchmarkTag": "データ所在地基準",
    "hdBenchmarkDesc": "デプロイ層にカーソルを合わせると、主権プレミアムと1000万トークン換算コストが確認できます。",
    "hdBaselineRef": "0% 基準 = 直接API",
    "hdParity": "0% 同等",
    "hdDataZone": "データゾーン (+12%)",
    "hdSingleRegion": "単一リージョン (+18%)",
    "hdSovereign": "主権クラウド (+35%)",
    "normCost": "10M換算:",
    "markup": "割増率",
    "wfTitle": "マルチターン蓄積ウォーターフォール：非キャッシュ vs キャッシュ適用",
    "wfSubtitle": "8ターンにわたるコンテキスト蓄積シミュレーション：二次関数的増加 vs 定額インクリメンタル。",
    "wfAuditTag": "累積監査",
    "wfAuditDesc": "T1〜T8にカーソルを移動させ、キャッシュなしの肥大化とプロンプトキャッシュの効果を比較。",
    "wfYield": "85% セッション総削減率",
    "wfUncached": "非キャッシュ（二次関数的増加）",
    "wfCached": "キャッシュ適用（フラット微増）",
    "wfSavings": "85% 最終節約率",
    "uncached": "非キャッシュ:",
    "cached": "キャッシュ済:",
    "inContext": "コンテキスト内",
    "savedMsg": "{saved}削減（{pct}%割引）",
    "tier": "階層:",
    "hdBaseline": "0% 基準",
    "parity": "同等 (0%)",
    "exactParity": "完全一致",
    "totalSpend": "バッチ総支出",
    "tokenDist": "トークン分布",
    "catCount": "4カテゴリ",
    "sessionPct": "セッション支出の割合",
    "tokensAll": "トークン全体の100%"
  },
  "pt": {
    "pfTitle": "Fronteira de Pareto Custo-Qualidade: Precisão vs Custo de Tarefa",
    "pfSubtitle": "Mapeia a precisão em benchmarks contra o custo por tarefa resolvida para determinar a eficiência ideal de preço-desempenho.",
    "pfSummaryTag": "Fronteira SWE-bench",
    "pfSummaryDesc": "o3-mini & Sonnet 3.7 ocupam o Ponto Ideal de Pareto: 81–87% de precisão a $1.80–$4.50/tarefa.",
    "pfEfficiencyTag": "85% Eficiência de Fronteira",
    "pfCostAxis": "Custo por tarefa resolvida ($) →",
    "pfAccAxis": "Precisão no Benchmark (%)",
    "pfBoundary": "Limite ideal de Pareto →",
    "pfSweetSpot": "Ponto Ideal de Pareto",
    "pfFrontierEff": "Eficiência de Fronteira",
    "pfValueLeader": "Líder de Valor",
    "pfDiminishing": "Retorno Decrescente",
    "pfAccLabel": "Precisão:",
    "pfCostLabel": "Custo:",
    "pfEffScore": "Pts/$:",
    "cfTitle": "Funil de Roteamento em Cascata e Rendimento",
    "cfSubtitle": "Simula o escalonamento dinâmico de consultas, desde filtros Flash ultraeconômicos até modelos de fronteira.",
    "cfSummaryTag": "Rendimento em Cascata",
    "cfSummaryDesc": "Gasto combinado: $32.62 contra $250.00 se 100% fosse direcionado a modelos de fronteira.",
    "cfNetSavings": "-86.9% Economia Líquida",
    "cfIncoming": "Tráfego de entrada (100%)",
    "cfTier1": "Nível 1: Filtro & Flash (68%)",
    "cfTier2": "Nível 2: Raciocínio Médio (22%)",
    "cfTier3": "Nível 3: Fronteira Opus/Pro (10%)",
    "cfVolume": "Volume:",
    "cfRate": "Taxa:",
    "cfSubtotal": "Subtotal:",
    "cfShare": "Parcela do Custo:",
    "meTitle": "Medidor de Erosão da Margem Bruta de Recursos SaaS IA",
    "meSubtitle": "Receita de assinatura fixa ($40/mês) versus queima variável de tokens por percentil de clientes.",
    "meSummaryTag": "Economia Unitária",
    "meSummaryDesc": "Receita fixa de $40/usuário vs consumo variável de tokens por coorte.",
    "meTopLoss": "Top 5% eliminam as margens",
    "meLight": "Uso Leve (50% das contas)",
    "meMedium": "Uso Médio (35% das contas)",
    "meHeavy": "Uso Intenso (10% das contas)",
    "meExtreme": "Extremo Sem Teto (Top 5%)",
    "meGrossMargin": "Margem Bruta",
    "meNetLoss": "Prejuízo Líquido",
    "meProfit": "lucro",
    "meLoss": "prejuízo",
    "meRevenueCeiling": "Teto de Receita de $40",
    "meTokenCost": "Custo de Tokens:",
    "meRevenue": "Receita:",
    "ttlTitle": "Linha do Tempo de Decaimento do TTL por Inatividade em Cache",
    "ttlSubtitle": "Visualiza o limite de inatividade de 5 minutos onde o cache é descartado para escrita fria.",
    "ttlSummaryTag": "Janela de TTL",
    "ttlSummaryDesc": "Janela de inatividade de 5 min: chamadas em até 4 min usam cache ($0.30/M); a mais de 6 min incorrem em escrita fria ($3.75/M).",
    "ttlThreshold": "Limite de 5 Min",
    "ttlBoundary": "Limite de Inatividade de 5 Min",
    "ttlHotZone": "Zona Quente (0–4 min: 90% acerto)",
    "ttlColdZone": "Zona Fria Expirada (5+ min: 0% acerto)",
    "ttlStateHit": "ACERTO (Contexto Quente)",
    "ttlStateMiss": "DESCARTADO (Escrita Fria)",
    "ttlInterval": "Intervalo:",
    "ttlState": "Estado:",
    "ttlEffRate": "Taxa Efetiva:",
    "ttlLatency": "Latência:",
    "ttlDiscount": "92% Desconto de Cache",
    "ttlPenalty": "Penalidade Total de Escrita Fria",
    "gbTitle": "API Direta vs Tarifas de Nuvem Gerenciada",
    "gbSubtitle": "Preços de entrada e saída por 1M de tokens comparando API Direta com nuvens gerenciadas.",
    "gbSummaryTag": "Resumo",
    "gbSummaryDesc": "Passe o cursor sobre qualquer coluna para verificar a paridade de preços e sobretaxas.",
    "gbDelta": "Comparação de 4 métricas",
    "directIn": "Entrada Direta",
    "cloudIn": "Entrada Cloud",
    "directOut": "Saída Direta",
    "cloudOut": "Saída Cloud",
    "inputRate": "Entrada:",
    "outputRate": "Saída:",
    "beTitle": "Curva de equilíbrio: Pagamento por uso vs. Reserva mensal de PTU",
    "beSubtitle": "Identifica o volume mensal de tokens em que a reserva de PTU supera o pagamento por uso.",
    "beTag": "Ponto de corte: ~{tokens}M Tokens",
    "beDesc": "Limite mensal onde 1x PTU ({base} base + {marginal}/M) supera o pagamento por uso ({paygo}/M).",
    "beSpendIdentical": "Gasto: ~{cost}/mês idêntico",
    "paygoLabel": "Pagamento por uso",
    "ptuLabel": "PTU Reservado",
    "beIntersection": "Ponto de equilíbrio",
    "beExact": "Equilíbrio exato: Gasto ~{cost}/mês idêntico",
    "bePtuSaves": "PTU economiza {delta}/mês ({pct}% desconto)",
    "bePaygoCheaper": "Pagamento por uso é {delta}/mês mais barato",
    "tokensPerMo": "{tokens}M Tokens / mês",
    "tdTitle": "Gráfico de rosca: Composição de custos da sessão",
    "tdSubtitle": "Detalhamento interativo: prompts de sistema, cache, raciocínio e geração final.",
    "tdSessionSpendTag": "Gasto da sessão",
    "tdSessionSpendDesc": "Passe o cursor sobre uma fatia ou linha para isolar custos e alavancas de otimização.",
    "tdTotalTokens": "Total: $134.50 / 1.0M Tokens",
    "tdSystemCache": "Cache do sistema (48%)",
    "tdToolContext": "Contexto de ferramentas (24%)",
    "tdReasoning": "Raciocínio CoT (18%)",
    "tdGeneration": "Geração (10%)",
    "cost": "Custo:",
    "tokens": "Tokens:",
    "share": "parcela",
    "hdTitle": "Delta horizontal: Sobretaxa regional vs Preço base global",
    "hdSubtitle": "Sobretaxas de soberania de dados e residência regional (+0% a +35%) sobre a tabela padrão.",
    "hdBenchmarkTag": "Referência de residência",
    "hdBenchmarkDesc": "Inspecione os níveis de implantação para verificar custos de soberania e gasto normalizado por 10M tokens.",
    "hdBaselineRef": "0% Base = API Direta",
    "hdParity": "0% Paridade",
    "hdDataZone": "Zona de dados (+12%)",
    "hdSingleRegion": "Região fixa (+18%)",
    "hdSovereign": "Soberano (+35%)",
    "normCost": "Norm 10M:",
    "markup": "Sobretaxa",
    "wfTitle": "Cascata multi-turnos: Sem cache vs Com prompt caching",
    "wfSubtitle": "Simulação de acúmulo de contexto em 8 turnos: custo quadrático sem cache vs custo estável com cache.",
    "wfAuditTag": "Auditoria acumulada",
    "wfAuditDesc": "Deslize o cursor pelos turnos T1–T8 para comparar o gasto descontrolado com o prompt caching.",
    "wfYield": "85% Economia total da sessão",
    "wfUncached": "Sem cache (Crescimento quadrático)",
    "wfCached": "Com cache (Acréscimo linear leve)",
    "wfSavings": "85% Economia final",
    "uncached": "Sem cache:",
    "cached": "Com cache:",
    "inContext": "no contexto",
    "savedMsg": "Economizou {saved} ({pct}% desconto)",
    "tier": "Nível:",
    "hdBaseline": "0% Base",
    "parity": "Paridade (0%)",
    "exactParity": "Paridade exata",
    "totalSpend": "Gasto total do lote",
    "tokenDist": "Distribuição de tokens",
    "catCount": "4 categorias",
    "sessionPct": "dos gastos da sessão",
    "tokensAll": "100% dos tokens"
  },
  "it": {
    "pfTitle": "Frontiera di Pareto Costo-Qualità: Accuratezza vs Costo Task",
    "pfSubtitle": "Mappa l'accuratezza nei benchmark rispetto al costo per task risolto per determinare l'efficienza ottimale prezzo-prestazioni.",
    "pfSummaryTag": "Frontiera SWE-bench",
    "pfSummaryDesc": "o3-mini & Sonnet 3.7 occupano il Punto Ottimale di Pareto: accuratezza 81–87% a $1.80–$4.50/task.",
    "pfEfficiencyTag": "85% Efficienza di Frontiera",
    "pfCostAxis": "Costo per task risolto ($) →",
    "pfAccAxis": "Accuratezza benchmark (%)",
    "pfBoundary": "Frontiera di Pareto ottimale →",
    "pfSweetSpot": "Punto ottimale di Pareto",
    "pfFrontierEff": "Efficienza di frontiera",
    "pfValueLeader": "Leader di convenienza",
    "pfDiminishing": "Rendimenti decrescenti",
    "pfAccLabel": "Accuratezza:",
    "pfCostLabel": "Costo:",
    "pfEffScore": "Pts/$:",
    "cfTitle": "Imbuto di Routing a Cascata e Resa",
    "cfSubtitle": "Simula lo smistamento dinamico da filtri Flash ultrarapidi a modelli di frontiera complessi.",
    "cfSummaryTag": "Resa a cascata",
    "cfSummaryDesc": "Spesa media combinata: $32.62 contro $250.00 se il 100% fosse inviato a modelli di frontiera.",
    "cfNetSavings": "-86.9% Risparmio netto",
    "cfIncoming": "Traffico in entrata (100%)",
    "cfTier1": "Livello 1: Filtro & Flash (68%)",
    "cfTier2": "Livello 2: Ragionamento intermedio (22%)",
    "cfTier3": "Livello 3: Frontiera Opus/Pro (10%)",
    "cfVolume": "Volume:",
    "cfRate": "Tariffa:",
    "cfSubtotal": "Subtotale:",
    "cfShare": "Quota di spesa:",
    "meTitle": "Misuratore di Erosione del Margine Lordo SaaS AI",
    "meSubtitle": "Canone fisso di abbonamento ($40/mese) rispetto al consumo variabile di token per percentile.",
    "meSummaryTag": "Economia unitaria",
    "meSummaryDesc": "Ricavo fisso di $40/utente vs consumo variabile di token per coorte.",
    "meTopLoss": "Il top 5% azzera i margini",
    "meLight": "Uso leggero (50% postazioni)",
    "meMedium": "Uso medio (35% postazioni)",
    "meHeavy": "Uso intenso (10% postazioni)",
    "meExtreme": "Estremo senza limiti (Top 5%)",
    "meGrossMargin": "Margine lordo",
    "meNetLoss": "Perdita netta",
    "meProfit": "profitto",
    "meLoss": "perdita",
    "meRevenueCeiling": "Tetto ricavi $40",
    "meTokenCost": "Costo token:",
    "meRevenue": "Ricavo:",
    "ttlTitle": "Decadimento del TTL di Inattività della Cache di Prompt",
    "ttlSubtitle": "Visualizza la soglia dei 5 minuti dove la cache scade passando a tariffa di scrittura a freddo.",
    "ttlSummaryTag": "Finestra TTL",
    "ttlSummaryDesc": "Finestra di inattività di 5 min: chiamate entro 4 min usano la cache ($0.30/M); a 6+ min subiscono scrittura a freddo ($3.75/M).",
    "ttlThreshold": "Soglia 5 min",
    "ttlBoundary": "Limite inattività 5 min",
    "ttlHotZone": "Zona calda (0–4 min: 90% successo)",
    "ttlColdZone": "Zona fredda scaduta (5+ min: 0% successo)",
    "ttlStateHit": "CENTRO (Cache attiva)",
    "ttlStateMiss": "ESPULSO (Scrittura fredda)",
    "ttlInterval": "Intervallo:",
    "ttlState": "Stato:",
    "ttlEffRate": "Tariffa effettiva:",
    "ttlLatency": "Latenza:",
    "ttlDiscount": "92% Sconto cache",
    "ttlPenalty": "Penalità completa scrittura fredda",
    "gbTitle": "Tariffe API Diretta vs Cloud Gestito",
    "gbSubtitle": "Costi di input e output per 1M di token: confronto tra API Diretta e provider cloud.",
    "gbSummaryTag": "Riepilogo",
    "gbSummaryDesc": "Passa il cursore su una colonna per verificare parità di prezzo e differenziali percentuali.",
    "gbDelta": "Confronto 4 metriche",
    "directIn": "Input Diretto",
    "cloudIn": "Input Cloud",
    "directOut": "Output Diretto",
    "cloudOut": "Output Cloud",
    "inputRate": "Input:",
    "outputRate": "Output:",
    "beTitle": "Curva di pareggio: On-Demand vs Prenotazione mensile PTU",
    "beSubtitle": "Indica la soglia esatta di token mensili in cui la prenotazione PTU batte l'on-demand.",
    "beTag": "Pareggio: ~{tokens}M Token",
    "beDesc": "Soglia mensile in cui 1x PTU ({base} base + {marginal}/M) è più conveniente dell'on-demand ({paygo}/M).",
    "beSpendIdentical": "Spesa: ~{cost}/mese identica",
    "paygoLabel": "On-Demand",
    "ptuLabel": "PTU Riservato",
    "beIntersection": "Punto di pareggio",
    "beExact": "Pareggio esatto: Spesa ~{cost}/mese identica",
    "bePtuSaves": "PTU risparmia {delta}/mese ({pct}% sconto)",
    "bePaygoCheaper": "On-Demand è più economico di {delta}/mese",
    "tokensPerMo": "{tokens}M Token / mese",
    "tdTitle": "Grafico a ciambella: Composizione dei costi di sessione",
    "tdSubtitle": "Ripartizione interattiva: prompt di sistema, cache, ragionamento e generazione finale.",
    "tdSessionSpendTag": "Spesa di sessione",
    "tdSessionSpendDesc": "Passa il mouse sulle sezioni o sulla tabella per visualizzare dettagli e leve di risparmio.",
    "tdTotalTokens": "Totale: $134.50 / 1.0M Token",
    "tdSystemCache": "Cache di sistema (48%)",
    "tdToolContext": "Contesto strumenti (24%)",
    "tdReasoning": "Ragionamento CoT (18%)",
    "tdGeneration": "Generazione (10%)",
    "cost": "Costo:",
    "tokens": "Token:",
    "share": "quota",
    "hdTitle": "Delta orizzontale: Sovrapprezzo regionale vs Prezzo base",
    "hdSubtitle": "Maggiorazioni per sovranità e residenza dei dati (+0% a +35%) rispetto al listino base.",
    "hdBenchmarkTag": "Benchmark residenza",
    "hdBenchmarkDesc": "Ispeziona i livelli di deployment per verificare i costi di sovranità e spesa normalizzata su 10M token.",
    "hdBaselineRef": "0% Base = API Diretta",
    "hdParity": "0% Parità",
    "hdDataZone": "Data Zone (+12%)",
    "hdSingleRegion": "Regione singola (+18%)",
    "hdSovereign": "Sovrano (+35%)",
    "normCost": "Norm 10M:",
    "markup": "Maggiorazione",
    "wfTitle": "Cascata multi-turno: Senza cache vs Con prompt caching",
    "wfSubtitle": "Simulazione dell'accumulo di contesto su 8 turni: crescita quadratica vs costo incrementale piatto.",
    "wfAuditTag": "Verifica accumulo",
    "wfAuditDesc": "Scorri sui turni T1–T8 per confrontare la spesa senza cache con il risparmio del prompt caching.",
    "wfYield": "85% Resa totale di sessione",
    "wfUncached": "Senza cache (Crescita quadratica)",
    "wfCached": "Con cache (Incremento piatto)",
    "wfSavings": "85% Risparmio finale",
    "uncached": "Senza cache:",
    "cached": "In cache:",
    "inContext": "nel contesto",
    "savedMsg": "Risparmio di {saved} ({pct}% sconto)",
    "tier": "Livello:",
    "hdBaseline": "0% Base",
    "parity": "Parità (0%)",
    "exactParity": "Parità esatta",
    "totalSpend": "Spesa totale batch",
    "tokenDist": "Distribuzione token",
    "catCount": "4 categorie",
    "sessionPct": "della spesa di sessione",
    "tokensAll": "100% dei token"
  },
  "ko": {
    "pfTitle": "비용-품질 파레토 프론티어: 정확도 vs 태스크 비용",
    "pfSubtitle": "벤치마크 정확도와 해결 태스크당 비용을 매핑하여 최적의 가격 대비 성능 효율을 도출합니다.",
    "pfSummaryTag": "SWE-bench 프론티어",
    "pfSummaryDesc": "o3-mini 및 Sonnet 3.7이 파레토 최적 지점 차지: 태스크당 $1.80–$4.50에 81–87% 정확도 달성.",
    "pfEfficiencyTag": "85% 프론티어 효율",
    "pfCostAxis": "해결 태스크당 비용 ($) →",
    "pfAccAxis": "벤치마크 작업 정확도 (%)",
    "pfBoundary": "최적 파레토 경계선 →",
    "pfSweetSpot": "파레토 최적 지점",
    "pfFrontierEff": "프론티어 고효율",
    "pfValueLeader": "가성비 선도",
    "pfDiminishing": "수익 체감 구간",
    "pfAccLabel": "정확도:",
    "pfCostLabel": "비용:",
    "pfEffScore": "점수/$:",
    "cfTitle": "다계층 캐스케이드 라우팅 깔때기 및 수익률",
    "cfSubtitle": "초저가 Flash 필터부터 고성능 프론티어 모델까지의 동적 트래픽 계층화를 시뮬레이션합니다.",
    "cfSummaryTag": "캐스케이드 산출",
    "cfSummaryDesc": "혼합 지출: 전체를 프론티어 모델로 보낼 경우 $250.00 대비 $32.62로 절감.",
    "cfNetSavings": "-86.9% 순비용 절감",
    "cfIncoming": "유입 트래픽 (100%)",
    "cfTier1": "1계층: 필터 및 Flash (68%)",
    "cfTier2": "2계층: 중간 추론 모델 (22%)",
    "cfTier3": "3계층: 프론티어 Opus/Pro (10%)",
    "cfVolume": "처리량:",
    "cfRate": "단가:",
    "cfSubtotal": "소계:",
    "cfShare": "비용 점유율:",
    "meTitle": "SaaS AI 기능 매출총이익률 잠식 측정기",
    "meSubtitle": "고정 시트 구독 수익($40/월) 대비 고객 사용 백분위수별 가변 토큰 소모량 비교.",
    "meSummaryTag": "단위 경제성",
    "meSummaryDesc": "유저당 $40 정액 매출 vs 집단별 가변 AI 토큰 소비액.",
    "meTopLoss": "상위 5%가 마진 전액 잠식",
    "meLight": "라이트 사용자 (시트의 50%)",
    "meMedium": "일반 사용자 (시트의 35%)",
    "meHeavy": "파워 사용자 (시트의 10%)",
    "meExtreme": "무제한 헤비 (상위 5%)",
    "meGrossMargin": "매출총이익률",
    "meNetLoss": "순손실",
    "meProfit": "이익",
    "meLoss": "손실",
    "meRevenueCeiling": "$40 시트 수익 상한선",
    "meTokenCost": "토큰 원가:",
    "meRevenue": "수익:",
    "ttlTitle": "프롬프트 캐시 비활성 TTL 감쇠 타임라인",
    "ttlSubtitle": "캐시 상태가 소멸되어 콜드 라이트 요금으로 전환되는 5분 비활성 경계선을 시각화합니다.",
    "ttlSummaryTag": "TTL 축출 구간",
    "ttlSummaryDesc": "5분 비활성 창: 4분 이내 호출은 캐시 히트($0.30/M), 6분 초과 시 콜드 쓰기($3.75/M) 발생.",
    "ttlThreshold": "5분 임계 경계",
    "ttlBoundary": "5분 비활성 TTL 경계",
    "ttlHotZone": "핫 캐시 영역 (0–4분: 90% 히트)",
    "ttlColdZone": "축출된 콜드 영역 (5분 이상: 0% 히트)",
    "ttlStateHit": "히트 (핫 컨텍스트)",
    "ttlStateMiss": "축출됨 (콜드 쓰기)",
    "ttlInterval": "경과 시간:",
    "ttlState": "상태:",
    "ttlEffRate": "유효 요율:",
    "ttlLatency": "지연 시간:",
    "ttlDiscount": "92% 캐시 할인",
    "ttlPenalty": "전액 콜드 쓰기 패널티",
    "gbTitle": "직접 API vs 클라우드 관리형 요금 비교",
    "gbSubtitle": "직접 API와 클라우드 관리형 제공업체 간 100만 토큰당 입력 및 출력 요금 비교.",
    "gbSummaryTag": "요약",
    "gbSummaryDesc": "모델 열 위에 마우스를 올려 입력/출력 요금 패리티 및 백분율 차이를 확인하세요.",
    "gbDelta": "4개 지표 비교",
    "directIn": "직접 입력",
    "cloudIn": "클라우드 입력",
    "directOut": "직접 출력",
    "cloudOut": "클라우드 출력",
    "inputRate": "입력:",
    "outputRate": "출력:",
    "beTitle": "손익분기점 곡선: 온디맨드 vs PTU 월간 예약",
    "beSubtitle": "프로비저닝 예약(PTU)이 온디맨드 종량제를 능가하는 정확한 월간 토큰 임계값을 식별합니다.",
    "beTag": "손익분기점: 약 {tokens}M 토큰",
    "beDesc": "1x PTU 예약({base} 기본료 + {marginal}/M)이 종량제({paygo}/M)보다 경제적인 월간 기준점.",
    "beSpendIdentical": "지출: 월 약 {cost} 동일",
    "paygoLabel": "온디맨드 종량제",
    "ptuLabel": "PTU 예약",
    "beIntersection": "손익분기 교차점",
    "beExact": "정확한 손익분기: 월 약 {cost} 동일",
    "bePtuSaves": "PTU로 월 {delta} 절감 ({pct}% 할인)",
    "bePaygoCheaper": "종량제가 월 {delta} 더 저렴함",
    "tokensPerMo": "{tokens}M 토큰 / 월",
    "tdTitle": "도넛 차트: 일반적인 에이전트 세션 비용 구성",
    "tdSubtitle": "시스템 프롬프트, 캐시 히트, 추론 사고 및 출력에 소비되는 비용의 대화형 내역.",
    "tdSessionSpendTag": "세션 지출",
    "tdSessionSpendDesc": "조각이나 행에 커서를 올려 카테고리별 비용 및 아키텍처 최적화 지점을 확인하세요.",
    "tdTotalTokens": "총합: $134.50 / 1.0M 토큰",
    "tdSystemCache": "시스템 캐시 (48%)",
    "tdToolContext": "도구 컨텍스트 (24%)",
    "tdReasoning": "추론 CoT (18%)",
    "tdGeneration": "출력 생성 (10%)",
    "cost": "비용:",
    "tokens": "토큰:",
    "share": "점유율",
    "hdTitle": "수평 델타: 지역별 마크업 vs 직접 글로벌 기본가",
    "hdSubtitle": "기본 정가 대비 데이터 주권 및 지역 라우팅 추가 마크업(+0% ~ +35%).",
    "hdBenchmarkTag": "데이터 상주 기준",
    "hdBenchmarkDesc": "배포 계층 위에 마우스를 올려 데이터 주권 프리미엄 및 1,000만 토큰당 정규화 비용을 검토하세요.",
    "hdBaselineRef": "0% 기준 = 직접 API",
    "hdParity": "0% 패리티",
    "hdDataZone": "데이터 존 (+12%)",
    "hdSingleRegion": "단일 리전 (+18%)",
    "hdSovereign": "주권 클라우드 (+35%)",
    "normCost": "10M 기준:",
    "markup": "마크업",
    "wfTitle": "멀티턴 누적 워터폴: 비캐시 vs 프롬프트 캐싱",
    "wfSubtitle": "8턴 동안의 컨텍스트 축적 시뮬레이션: 비캐시 2차 성장 비용 vs 플랫 캐시 실행.",
    "wfAuditTag": "누적 감사",
    "wfAuditDesc": "T1~T8 턴 위로 커서를 이동하여 비캐시 연소와 프롬프트 캐싱의 비용을 비교하세요.",
    "wfYield": "85% 총 세션 수율",
    "wfUncached": "비캐시 (2차 급증)",
    "wfCached": "프롬프트 캐싱 (완만한 증가)",
    "wfSavings": "85% 최종 절감",
    "uncached": "비캐시:",
    "cached": "캐시됨:",
    "inContext": "컨텍스트 내",
    "savedMsg": "{saved} 절약 ({pct}% 할인)",
    "tier": "계층:",
    "hdBaseline": "0% 기준",
    "parity": "패리티 (0%)",
    "exactParity": "정확한 패리티",
    "totalSpend": "총 배치 지출",
    "tokenDist": "토큰 분포",
    "catCount": "4개 범주",
    "sessionPct": "세션 지출 비율",
    "tokensAll": "전체 토큰의 100%"
  },
  "zh": {
    "pfTitle": "成本-质量帕累托前沿：基准精度与任务成本",
    "pfSubtitle": "映射模型基准准确率与解决任务单价，确定最优性价比前沿曲线。",
    "pfSummaryTag": "SWE-bench 前沿",
    "pfSummaryDesc": "o3-mini 与 Sonnet 3.7 占据帕累托甜点区：单任务 $1.80–$4.50 下达 81–87% 准确率。",
    "pfEfficiencyTag": "85% 前沿效率",
    "pfCostAxis": "每解决任务成本 ($) →",
    "pfAccAxis": "基准任务准确率 (%)",
    "pfBoundary": "最优帕累托边界 →",
    "pfSweetSpot": "帕累托甜点区",
    "pfFrontierEff": "前沿高能效",
    "pfValueLeader": "性价比标杆",
    "pfDiminishing": "收益递减区",
    "pfAccLabel": "准确率:",
    "pfCostLabel": "成本:",
    "pfEffScore": "分数/$:",
    "cfTitle": "多层级级联路由漏斗与收益率",
    "cfSubtitle": "模拟从极低成本 Flash 过滤到前沿大模型的动态查询分流体系。",
    "cfSummaryTag": "级联产出",
    "cfSummaryDesc": "综合支出：相比 100% 走前沿模型的 $250.00，级联仅需 $32.62。",
    "cfNetSavings": "-86.9% 净成本节省",
    "cfIncoming": "入站总流量 (100%)",
    "cfTier1": "第1层：快速过滤与 Flash (68%)",
    "cfTier2": "第2层：中端推理模型 (22%)",
    "cfTier3": "第3层：前沿 Opus/Pro (10%)",
    "cfVolume": "请求量:",
    "cfRate": "费率:",
    "cfSubtotal": "小计:",
    "cfShare": "成本占比:",
    "meTitle": "SaaS AI 功能毛利率侵蚀仪表",
    "meSubtitle": "固定席位订阅收入（$40/月）与不同分位客户可变 Token 消耗的对比。",
    "meSummaryTag": "单元经济学",
    "meSummaryDesc": "每用户固定 $40 席位收入 vs 各层级可变 AI Token 消耗。",
    "meTopLoss": "前 5% 吞噬全部毛利",
    "meLight": "轻度用户 (50% 席位)",
    "meMedium": "中度用户 (35% 席位)",
    "meHeavy": "重度用户 (10% 席位)",
    "meExtreme": "无限量极重度 (前 5%)",
    "meGrossMargin": "毛利率",
    "meNetLoss": "净亏损",
    "meProfit": "盈利",
    "meLoss": "亏损",
    "meRevenueCeiling": "$40 席位收入上限",
    "meTokenCost": "Token 成本:",
    "meRevenue": "收入:",
    "ttlTitle": "提示词缓存非活跃 TTL 衰减时间线",
    "ttlSubtitle": "可视化 5 分钟非活跃边界：超过此时间缓存逐出并转入冷写入费率。",
    "ttlSummaryTag": "TTL 驱逐窗口",
    "ttlSummaryDesc": "5 分钟非活跃窗口：4 分钟内调用命中缓存 ($0.30/M)；6 分钟后产生冷写入 ($3.75/M)。",
    "ttlThreshold": "5 分钟临界阈值",
    "ttlBoundary": "5 分钟非活跃 TTL 边界",
    "ttlHotZone": "热缓存区 (0–4 分钟：90% 命中)",
    "ttlColdZone": "冷驱逐区 (5 分钟以上：0% 命中)",
    "ttlStateHit": "命中 (热上下文)",
    "ttlStateMiss": "驱逐 (冷写入)",
    "ttlInterval": "时间间隔:",
    "ttlState": "状态:",
    "ttlEffRate": "有效费率:",
    "ttlLatency": "延迟:",
    "ttlDiscount": "92% 缓存折扣",
    "ttlPenalty": "全额冷写入惩罚",
    "gbTitle": "直接API vs 云托管厂商费率对比",
    "gbSubtitle": "对比直接API与云托管厂商每100万Token的输入与输出费率。",
    "gbSummaryTag": "概览",
    "gbSummaryDesc": "将鼠标悬停在模型列上，查看输入/输出费率对等性及溢价差异。",
    "gbDelta": "4项指标对比",
    "directIn": "直接输入",
    "cloudIn": "云端输入",
    "directOut": "直接输出",
    "cloudOut": "云端输出",
    "inputRate": "输入：",
    "outputRate": "输出：",
    "beTitle": "损益平衡曲线：按需计费 vs PTU月度预留",
    "beSubtitle": "精准计算预留算力（PTU）优于按量付费的月度Token消耗阈值。",
    "beTag": "损益平衡点：约 {tokens}M Tokens",
    "beDesc": "单台PTU预留（底价 {base} + {marginal}/M）优于按量付费（{paygo}/M）的月度拐点。",
    "beSpendIdentical": "支出：月均约 {cost} 完全一致",
    "paygoLabel": "按量计费",
    "ptuLabel": "PTU预留",
    "beIntersection": "损益平衡交点",
    "beExact": "精确平衡：月均约 {cost} 完全一致",
    "bePtuSaves": "PTU每月节省 {delta}（优惠 {pct}%）",
    "bePaygoCheaper": "按量付费每月节省 {delta}",
    "tokensPerMo": "{tokens}M Tokens / 月",
    "tdTitle": "环形图：典型智能体单次会话成本结构",
    "tdSubtitle": "交互式解析会话开销去向：系统提示词、缓存命中、链式推理与文本生成。",
    "tdSessionSpendTag": "会话支出",
    "tdSessionSpendDesc": "悬停在扇区或列表行，独立查看类别成本并探寻架构优化路径。",
    "tdTotalTokens": "总计：$134.50 / 100万Tokens",
    "tdSystemCache": "系统缓存 (48%)",
    "tdToolContext": "工具上下文 (24%)",
    "tdReasoning": "推理思维链 (18%)",
    "tdGeneration": "输出生成 (10%)",
    "cost": "费用：",
    "tokens": "Tokens：",
    "share": "占比",
    "hdTitle": "水平对比：合规区域加价 vs 全球基准定价",
    "hdSubtitle": "对比全球标准目录价，展示数据主权与合规区域部署的加价幅度（+0% 至 +35%）。",
    "hdBenchmarkTag": "驻留基准",
    "hdBenchmarkDesc": "悬停查看各部署环境的数据主权溢价及归一化千万Token支出。",
    "hdBaselineRef": "0% 基准 = 直接API",
    "hdParity": "0% 对等",
    "hdDataZone": "数据区 (+12%)",
    "hdSingleRegion": "单物理区域 (+18%)",
    "hdSovereign": "主权隔离云 (+35%)",
    "normCost": "千万Token成本：",
    "markup": "溢价",
    "wfTitle": "多轮上下文递增瀑布图：无缓存 vs 提示词缓存",
    "wfSubtitle": "模拟8轮交互上下文累积：无缓存下的平方级激增 vs 缓存下的线性平缓消耗。",
    "wfAuditTag": "递增审计",
    "wfAuditDesc": "在T1–T8轮次间移动鼠标，对比无缓存开销与提示词缓存节约成果。",
    "wfYield": "85% 会话总收益",
    "wfUncached": "无缓存（平方级增长）",
    "wfCached": "启用提示词缓存（平缓递增）",
    "wfSavings": "85% 最终节省",
    "uncached": "无缓存：",
    "cached": "已缓存：",
    "inContext": "上下文中",
    "savedMsg": "节省 {saved}（折让 {pct}%）",
    "tier": "层级：",
    "hdBaseline": "0% 基准",
    "parity": "对等 (0%)",
    "exactParity": "完全对等",
    "totalSpend": "批次总支出",
    "tokenDist": "Token分布",
    "catCount": "4类目",
    "sessionPct": "会话支出占比",
    "tokensAll": "100% Token总量"
  },
  "nl": {
    "pfTitle": "Kosten-Kwaliteit Pareto Frontier: Nauwkeurigheid vs Taakkosten",
    "pfSubtitle": "Zet modelnauwkeurigheid af tegen kosten per voltooide taak om de optimale prijs-prestatieverhouding te bepalen.",
    "pfSummaryTag": "SWE-bench Frontier",
    "pfSummaryDesc": "o3-mini & Sonnet 3.7 bezetten het Pareto Sweet Spot: 81–87% nauwkeurigheid bij $1.80–$4.50/taak.",
    "pfEfficiencyTag": "85% Frontier Efficiëntie",
    "pfCostAxis": "Kosten per voltooide SWE-taak ($) →",
    "pfAccAxis": "Benchmark taaknauwkeurigheid (%)",
    "pfBoundary": "Optimale Pareto-grens →",
    "pfSweetSpot": "Pareto Sweet Spot",
    "pfFrontierEff": "Frontier Efficiëntie",
    "pfValueLeader": "Waardeleider",
    "pfDiminishing": "Afnemende meeropbrengst",
    "pfAccLabel": "Nauwkeurigheid:",
    "pfCostLabel": "Kosten:",
    "pfEffScore": "Pts/$:",
    "cfTitle": "Trapsgewijze Cascade Routeringstrechter & Opbrengst",
    "cfSubtitle": "Simuleert dynamische routering van spotgoedkope Flash-filters tot frontier-redeneermodellen.",
    "cfSummaryTag": "Cascade-opbrengst",
    "cfSummaryDesc": "Gemengde uitgaven: $32.62 vergeleken met $250.00 wanneer 100% naar Frontier-modellen gaat.",
    "cfNetSavings": "-86.9% Netto besparing",
    "cfIncoming": "Binnenkomend verkeer (100%)",
    "cfTier1": "Niveau 1: Filter & Flash (68%)",
    "cfTier2": "Niveau 2: Midden redeneren (22%)",
    "cfTier3": "Niveau 3: Frontier Opus/Pro (10%)",
    "cfVolume": "Volume:",
    "cfRate": "Tarief:",
    "cfSubtotal": "Subtotaal:",
    "cfShare": "Kostenaandeel:",
    "meTitle": "SaaS AI-Functie Bruto Marge Erosiemeter",
    "meSubtitle": "Vaste abonnementsinkomsten ($40/mnd) tegenover variabel tokenverbruik over gebruikerspercentielen.",
    "meSummaryTag": "Uniteconomie",
    "meSummaryDesc": "Vast $40/gebruiker omzet vs variabel AI-tokenverbruik per cohort.",
    "meTopLoss": "Top 5% wist marges uit",
    "meLight": "Licht gebruik (50% van licenties)",
    "meMedium": "Gemiddeld gebruik (35% van licenties)",
    "meHeavy": "Zwaar gebruik (10% van licenties)",
    "meExtreme": "Onbegrensd extreem (Top 5%)",
    "meGrossMargin": "Bruto marge",
    "meNetLoss": "Netto verlies",
    "meProfit": "winst",
    "meLoss": "verlies",
    "meRevenueCeiling": "$40 Omzetplafond",
    "meTokenCost": "Tokenkosten:",
    "meRevenue": "Omzet:",
    "ttlTitle": "Prompt Cache Inactiviteit TTL Verval-tijdlijn",
    "ttlSubtitle": "Visualiseert de 5-minuten inactiviteitsgrens waar gecachte status vervalt naar koude schrijfkosten.",
    "ttlSummaryTag": "TTL-vervalvenster",
    "ttlSummaryDesc": "5-minuten venster: verzoeken binnen 4 min raken cache ($0.30/M); vanaf 6 min koude schrijfopdracht ($3.75/M).",
    "ttlThreshold": "5-Min Grens",
    "ttlBoundary": "5-Min Inactiviteit TTL Grens",
    "ttlHotZone": "Hete cache-zone (0–4m: 90% Treffer)",
    "ttlColdZone": "Koude zone (5m+: 0% Treffer)",
    "ttlStateHit": "TREFFER (Hete context)",
    "ttlStateMiss": "VERVALLEN (Koude schrijfactie)",
    "ttlInterval": "Interval:",
    "ttlState": "Status:",
    "ttlEffRate": "Effectief tarief:",
    "ttlLatency": "Latentie:",
    "ttlDiscount": "92% Cachekorting",
    "ttlPenalty": "Volledige koude schrijfkosten",
    "gbTitle": "Directe API vs Cloud Managed Tarieven",
    "gbSubtitle": "Invoer- en uitvoerkosten per 1M tokens: vergelijking tussen Directe API en Cloud Providers.",
    "gbSummaryTag": "Overzicht",
    "gbSummaryDesc": "Beweeg over een modelkolom om de tariefpariteit en procentuele verschillen te bekijken.",
    "gbDelta": "Vergelijking van 4 statistieken",
    "directIn": "Directe Input",
    "cloudIn": "Cloud Input",
    "directOut": "Directe Output",
    "cloudOut": "Cloud Output",
    "inputRate": "Invoer:",
    "outputRate": "Uitvoer:",
    "beTitle": "Break-even curve: On-Demand vs Maandelijkse PTU-reservering",
    "beSubtitle": "Bepaalt de exacte maandelijkse tokendrempel waarbij gereserveerde PTU voordeliger is dan on-demand.",
    "beTag": "Break-even: ~{tokens}M Tokens",
    "beDesc": "Maandelijkse drempel waarbij 1x PTU ({base} basis + {marginal}/M) voordeliger is dan On-Demand ({paygo}/M).",
    "beSpendIdentical": "Uitgaven: ~{cost}/mnd identiek",
    "paygoLabel": "On-Demand (PayGo)",
    "ptuLabel": "PTU Gereserveerd",
    "beIntersection": "Break-even snijpunt",
    "beExact": "Exact break-even: Uitgaven ~{cost}/mnd identiek",
    "bePtuSaves": "PTU bespaart {delta}/mnd ({pct}% korting)",
    "bePaygoCheaper": "On-demand is {delta}/mnd goedkoper",
    "tokensPerMo": "{tokens}M Tokens / mnd",
    "tdTitle": "Donutgrafiek: Kostenverdeling van een typische agentsessie",
    "tdSubtitle": "Interactieve uitsplitsing van de factuur: systeemprompts, cachehits, redeneren en output.",
    "tdSessionSpendTag": "Sessie-uitgaven",
    "tdSessionSpendDesc": "Beweeg over een segment of rij om categoriekosten te isoleren en optimalisatiekansen te zien.",
    "tdTotalTokens": "Totaal: $134.50 / 1.0M Tokens",
    "tdSystemCache": "Systeemcache (48%)",
    "tdToolContext": "Toolcontext (24%)",
    "tdReasoning": "Redeneren CoT (18%)",
    "tdGeneration": "Generatie (10%)",
    "cost": "Kosten:",
    "tokens": "Tokens:",
    "share": "aandeel",
    "hdTitle": "Horizontale delta: Regionale opslag vs Directe basisprijs",
    "hdSubtitle": "Opslagen voor datasoevereiniteit en regionale routering (+0% tot +35%) boven catalogusprijs.",
    "hdBenchmarkTag": "Residentie-benchmark",
    "hdBenchmarkDesc": "Inspecteer implementatieniveaus voor soevereiniteitsopslagen en genormaliseerde kosten per 10M tokens.",
    "hdBaselineRef": "0% Basis = Directe API",
    "hdParity": "0% Pariteit",
    "hdDataZone": "Datazone (+12%)",
    "hdSingleRegion": "Enkele regio (+18%)",
    "hdSovereign": "Soeverein (+35%)",
    "normCost": "Norm 10M:",
    "markup": "Opslag",
    "wfTitle": "Multi-turn waterval: Zonder cache vs Prompt Caching",
    "wfSubtitle": "Simuleert contextopbouw over 8 beurten: kwadratische groei vs vlakke uitvoering met cache.",
    "wfAuditTag": "Cumulatieve audit",
    "wfAuditDesc": "Beweeg over beurten T1–T8 om ongecachte verspilling te vergelijken met prompt caching.",
    "wfYield": "85% Totale sessiebesparing",
    "wfUncached": "Zonder cache (Kwadratische groei)",
    "wfCached": "Met prompt caching (Vlak incrementeel)",
    "wfSavings": "85% Uiteindelijke besparing",
    "uncached": "Zonder cache:",
    "cached": "Gecacht:",
    "inContext": "in context",
    "savedMsg": "{saved} bespaard ({pct}% korting)",
    "tier": "Niveau:",
    "hdBaseline": "0% Basis",
    "parity": "Pariteit (0%)",
    "exactParity": "Exacte pariteit",
    "totalSpend": "Totale batchuitgaven",
    "tokenDist": "Tokenverdeling",
    "catCount": "4 categorieën",
    "sessionPct": "van de sessie-uitgaven",
    "tokensAll": "100% van de tokens"
  },
  "ar": {
    "pfTitle": "حد باريتو للتكلفة والجودة: الدقة مقابل تكلفة المهمة",
    "pfSubtitle": "يرسم دقة النماذج في الاختبارات القياسية مقابل تكلفة المهمة لتحديد كفاءة السعر مقابل الأداء.",
    "pfSummaryTag": "حد SWE-bench",
    "pfSummaryDesc": "نموذجا o3-mini و Sonnet 3.7 في النطاق الذهبي لباريتو: دقة 81–87% بتكلفة 1.80$–4.50$ لكل مهمة.",
    "pfEfficiencyTag": "85% كفاءة حدية",
    "pfCostAxis": "التكلفة لكل مهمة منجزة ($) ←",
    "pfAccAxis": "دقة الاختبار القياسي (%)",
    "pfBoundary": "حد باريتو الأمثل ←",
    "pfSweetSpot": "النطاق الذهبي لباريتو",
    "pfFrontierEff": "كفاءة النماذج الرائدة",
    "pfValueLeader": "رائد القيمة الاقتصادية",
    "pfDiminishing": "عائد متناقص",
    "pfAccLabel": "الدقة:",
    "pfCostLabel": "التكلفة:",
    "pfEffScore": "النقاط/$:",
    "cfTitle": "قمع التوجيه المتسلسل ومردود التوفير",
    "cfSubtitle": "يحاكي توجيه الاستعلامات الديناميكي من فلاتر Flash الاقتصادية إلى النماذج الرائدة.",
    "cfSummaryTag": "مردود التوجيه",
    "cfSummaryDesc": "الإنفاق المدمج: 32.62$ مقابل 250.00$ في حال توجيه 100% للنماذج الرائدة.",
    "cfNetSavings": "-86.9% صافي التوفير",
    "cfIncoming": "حركة المرور الواردة (100%)",
    "cfTier1": "المستوى 1: الفلترة و Flash (68%)",
    "cfTier2": "المستوى 2: التفكير المتوسط (22%)",
    "cfTier3": "المستوى 3: النماذج الرائدة Opus/Pro (10%)",
    "cfVolume": "الحجم:",
    "cfRate": "السعر:",
    "cfSubtotal": "المجموع الفرعي:",
    "cfShare": "حصة التكلفة:",
    "meTitle": "مقياس تآكل الهامش الإجمالي لميزات الذكاء الاصطناعي في SaaS",
    "meSubtitle": "إيرادات الاشتراك الثابتة (40$/شهرياً) مقابل استهلاك التوكنات المتغير حسب فئات المستخدمين.",
    "meSummaryTag": "اقتصاديات الوحدة",
    "meSummaryDesc": "إيراد ثابت 40$/مستخدم مقابل حرق متغير للتوكنات حسب كل فئة.",
    "meTopLoss": "أعلى 5% يلتهمون كامل الهامش",
    "meLight": "استخدام خفيف (50% من الحسابات)",
    "meMedium": "استخدام متوسط (35% من الحسابات)",
    "meHeavy": "استخدام مكثف (10% من الحسابات)",
    "meExtreme": "استخدام فائق غير محدود (أعلى 5%)",
    "meGrossMargin": "الهامش الإجمالي",
    "meNetLoss": "صافي الخسارة",
    "meProfit": "ربح",
    "meLoss": "خسارة",
    "meRevenueCeiling": "سقف الإيرادات 40$",
    "meTokenCost": "تكلفة التوكنات:",
    "meRevenue": "الإيراد:",
    "ttlTitle": "المسار الزمني لتلاشي ذاكرة التخزين المؤقت (TTL) بسبب الخمول",
    "ttlSubtitle": "يوضح حد الـ 5 دقائق للخمول حيث تسقط الذاكرة المؤقتة ويبدأ احتساب الكتابة الباردة.",
    "ttlSummaryTag": "نافذة خمول الذاكرة المؤقتة",
    "ttlSummaryDesc": "نافذة خمول 5 دقائق: الطلبات خلال 4 دقائق تستفيد من الذاكرة (0.30$/مليون)؛ وبعد 6 دقائق تدفع تكلفة الكتابة الباردة (3.75$/مليون).",
    "ttlThreshold": "حد الـ 5 دقائق",
    "ttlBoundary": "حد انتهاء الذاكرة المؤقتة (5 دقائق)",
    "ttlHotZone": "منطقة الذاكرة النشطة (0–4 د: 90% إصابة)",
    "ttlColdZone": "المنطقة الباردة المنتهية (5 د+: 0% إصابة)",
    "ttlStateHit": "إصابة (سياق نشط)",
    "ttlStateMiss": "منتهية (كتابة باردة)",
    "ttlInterval": "الفاصل الزمني:",
    "ttlState": "الحالة:",
    "ttlEffRate": "السعر الفعلي:",
    "ttlLatency": "زمن الاستجابة:",
    "ttlDiscount": "خصم 92% من الذاكرة المؤقتة",
    "ttlPenalty": "تكلفة الكتابة الباردة كاملة",
    "gbTitle": "أسعار الواجهة المباشرة مقابل السحابة المدارة",
    "gbSubtitle": "أسعار الإدخال والإخراج لكل مليون رمز للمقارنة بين الواجهة المباشرة ومزودي السحابة.",
    "gbSummaryTag": "الملخص",
    "gbSummaryDesc": "مرر المؤشر فوق أي عمود لمعاينة تطابق الأسعار وفروق النسب المئوية.",
    "gbDelta": "مقارنة 4 مقاييس",
    "directIn": "إدخال مباشر",
    "cloudIn": "إدخال سحابي",
    "directOut": "إخراج مباشر",
    "cloudOut": "إخراج سحابي",
    "inputRate": "الإدخال:",
    "outputRate": "الإخراج:",
    "beTitle": "منحنى نقطة التعادل: الدفع حسب الاستخدام مقابل حجز PTU الشهري",
    "beSubtitle": "يحدد حجم الرموز الشهري الدقيق حيث يتفوق حجز PTU على الدفع حسب الاستخدام.",
    "beTag": "نقطة التعادل: ~{tokens} مليون رمز",
    "beDesc": "الحد الشهري الذي يتفوق فيه حجز 1x PTU ({base} أساسي + {marginal}/مليون) على الدفع عند الطلب ({paygo}/مليون).",
    "beSpendIdentical": "التكلفة: ~{cost}$/شهرياً متطابقة",
    "paygoLabel": "الدفع حسب الاستخدام",
    "ptuLabel": "حجز PTU",
    "beIntersection": "نقطة تقاطع التعادل",
    "beExact": "تعادل دقيق: التكلفة ~{cost}$/شهرياً متطابقة",
    "bePtuSaves": "PTU يوفر {delta}$/شهرياً (خصم {pct}%)",
    "bePaygoCheaper": "الدفع حسب الاستخدام أرخص بـ {delta}$/شهرياً",
    "tokensPerMo": "{tokens} مليون رمز / شهرياً",
    "tdTitle": "مخطط دائري: هيكل تكلفة جلسة الوكيل النموذجية",
    "tdSubtitle": "تحليل تفاعلي لمسار التكلفة: مطالبات النظام، استدعاء الذاكرة المؤقتة، التفكير، وتوليد النتائج.",
    "tdSessionSpendTag": "إنفاق الجلسة",
    "tdSessionSpendDesc": "مرر المؤشر فوق أي قطاع أو سطر لعزل تكلفة الفئة ومراجعة محاور التحسين المعماري.",
    "tdTotalTokens": "الإجمالي: $134.50 / 1.0 مليون رمز",
    "tdSystemCache": "ذاكرة النظام (48%)",
    "tdToolContext": "سياق الأدوات (24%)",
    "tdReasoning": "سلسلة التفكير (18%)",
    "tdGeneration": "توليد النتائج (10%)",
    "cost": "التكلفة:",
    "tokens": "الرموز:",
    "share": "الحصة",
    "hdTitle": "الفارق الأفقي: الهامش الإقليمي مقابل السعر العالمي المباشر",
    "hdSubtitle": "فروق أسعار سيادة البيانات والتوجيه الإقليمي (+0% إلى +35%) فوق الأسعار الأساسية.",
    "hdBenchmarkTag": "معيار استضافة البيانات",
    "hdBenchmarkDesc": "عاين مستويات النشر لفحص رسوم السيادة والتكلفة المعيارية لكل 10 ملايين رمز.",
    "hdBaselineRef": "0% الأساس = الواجهة المباشرة",
    "hdParity": "0% تطابق",
    "hdDataZone": "منطقة البيانات (+12%)",
    "hdSingleRegion": "منطقة موحدة (+18%)",
    "hdSovereign": "سحابة سيادية (+35%)",
    "normCost": "معياري 10م:",
    "markup": "الهامش",
    "wfTitle": "شلال التراكم متعدد الجولات: بدون تخزين مؤقت مقابل التخزين المؤقت",
    "wfSubtitle": "محاكاة تراكم السياق عبر 8 جولات: تكلفة تربيعية بدون تخزين مقابل مسار مستقر مع التخزين.",
    "wfAuditTag": "تدقيق التراكم",
    "wfAuditDesc": "حرك المؤشر عبر الجولات T1–T8 لمقارنة الهدر غير المخزن بالتوفير الناتج عن التخزين المؤقت.",
    "wfYield": "85% إجمالي وفورات الجلسة",
    "wfUncached": "بدون تخزين (نمو تربيعي)",
    "wfCached": "مع التخزين المؤقت (نمو مسطح طفيف)",
    "wfSavings": "85% وفر نهائي",
    "uncached": "غير مخزن:",
    "cached": "مخزن مؤقتاً:",
    "inContext": "في السياق",
    "savedMsg": "وفرت {saved}$ (خصم {pct}%)",
    "tier": "المستوى:",
    "hdBaseline": "0% خط الأساس",
    "parity": "تطابق (0%)",
    "exactParity": "تطابق تام",
    "totalSpend": "إجمالي إنفاق الدفعة",
    "tokenDist": "توزيع الرموز",
    "catCount": "4 فئات",
    "sessionPct": "من إنفاق الجلسة",
    "tokensAll": "100% من الرموز"
  },
  "ru": {
    "pfTitle": "Граница Парето Стоимость-Качество: Точность vs Стоимость задачи",
    "pfSubtitle": "Сопоставляет точность бенчмарков со стоимостью решенной задачи для выявления оптимального соотношения цена/качество.",
    "pfSummaryTag": "Граница SWE-bench",
    "pfSummaryDesc": "o3-mini и Sonnet 3.7 занимают золотую середину Парето: 81–87% точности при $1.80–$4.50 за задачу.",
    "pfEfficiencyTag": "85% Эффективность границы",
    "pfCostAxis": "Стоимость решенной задачи ($) →",
    "pfAccAxis": "Точность в бенчмарке (%)",
    "pfBoundary": "Оптимальная граница Парето →",
    "pfSweetSpot": "Оптимальная зона Парето",
    "pfFrontierEff": "Эффективность флагманов",
    "pfValueLeader": "Лидер по выгоде",
    "pfDiminishing": "Убывающая отдача",
    "pfAccLabel": "Точность:",
    "pfCostLabel": "Стоимость:",
    "pfEffScore": "Очки/$:",
    "cfTitle": "Каскадная воронка маршрутизации и экономия",
    "cfSubtitle": "Симулирует динамическое распределение запросов от сверхдешевых Flash-фильтров до флагманских моделей.",
    "cfSummaryTag": "Каскадная отдача",
    "cfSummaryDesc": "Смешанные затраты: $32.62 против $250.00 при 100% отправке во флагманские модели.",
    "cfNetSavings": "-86.9% Чистая экономия",
    "cfIncoming": "Входящий трафик (100%)",
    "cfTier1": "Уровень 1: Фильтрация и Flash (68%)",
    "cfTier2": "Уровень 2: Средние рассуждения (22%)",
    "cfTier3": "Уровень 3: Флагманы Opus/Pro (10%)",
    "cfVolume": "Объем:",
    "cfRate": "Тариф:",
    "cfSubtotal": "Подитог:",
    "cfShare": "Доля затрат:",
    "meTitle": "Счетчик эрозии валовой прибыли в SaaS с ИИ",
    "meSubtitle": "Фиксированная подписка ($40/мес) против переменных затрат на токены по процентилям клиентов.",
    "meSummaryTag": "Юнит-экономика",
    "meSummaryDesc": "Фиксированная выручка $40/пользователь vs переменный расход токенов по когортам.",
    "meTopLoss": "Топ-5% уничтожают всю маржу",
    "meLight": "Низкая активность (50% мест)",
    "meMedium": "Средняя активность (35% мест)",
    "meHeavy": "Высокая активность (10% мест)",
    "meExtreme": "Безлимитный максимум (Топ-5%)",
    "meGrossMargin": "Валовая маржа",
    "meNetLoss": "Чистый убыток",
    "meProfit": "прибыль",
    "meLoss": "убыток",
    "meRevenueCeiling": "Потолок выручки $40",
    "meTokenCost": "Затраты на токены:",
    "meRevenue": "Выручка:",
    "ttlTitle": "График угасания TTL кэша промптов при неактивности",
    "ttlSubtitle": "Показывает 5-минутный порог неактивности, после которого кэш сбрасывается на холодную запись.",
    "ttlSummaryTag": "Окно жизни TTL",
    "ttlSummaryDesc": "5-минутное окно: вызовы в пределах 4 мин используют кэш ($0.30/M); после 6 мин — холодная запись ($3.75/M).",
    "ttlThreshold": "Порог 5 минут",
    "ttlBoundary": "5-минутная граница сброса TTL",
    "ttlHotZone": "Горячая зона кэша (0–4 мин: 90% попаданий)",
    "ttlColdZone": "Холодная зона сброса (от 5 мин: 0% попаданий)",
    "ttlStateHit": "ПОПАДАНИЕ (Горячий контекст)",
    "ttlStateMiss": "СБРОШЕНО (Холодная запись)",
    "ttlInterval": "Интервал:",
    "ttlState": "Статус:",
    "ttlEffRate": "Эффективная ставка:",
    "ttlLatency": "Задержка:",
    "ttlDiscount": "Скидка кэша 92%",
    "ttlPenalty": "Полный штраф холодной записи",
    "gbTitle": "Тарифы Direct API против Управляемого облака",
    "gbSubtitle": "Тарифы на ввод и вывод за 1 млн токенов: прямое API в сравнении с облачными провайдерами.",
    "gbSummaryTag": "Сводка",
    "gbSummaryDesc": "Наведите курсор на колонку модели для проверки паритета цен и процентных наценок.",
    "gbDelta": "Сравнение 4 метрик",
    "directIn": "Прямой ввод",
    "cloudIn": "Облачный ввод",
    "directOut": "Прямой вывод",
    "cloudOut": "Облачный вывод",
    "inputRate": "Ввод:",
    "outputRate": "Вывод:",
    "beTitle": "Кривая окупаемости: On-Demand против месячной брони PTU",
    "beSubtitle": "Определяет порог объема токенов в месяц, при котором бронь PTU выгоднее тарифа On-Demand.",
    "beTag": "Окупаемость: ~{tokens}M токенов",
    "beDesc": "Месячный порог, где бронь 1x PTU ({base} база + {marginal}/M) выгоднее тарифа On-Demand ({paygo}/M).",
    "beSpendIdentical": "Затраты: ~{cost}$/мес одинаково",
    "paygoLabel": "По потреблению",
    "ptuLabel": "Бронь PTU",
    "beIntersection": "Точка окупаемости",
    "beExact": "Точная окупаемость: Затраты ~{cost}$/мес одинаковы",
    "bePtuSaves": "PTU экономит {delta}$/мес (скидка {pct}%)",
    "bePaygoCheaper": "On-Demand дешевле на {delta}$/мес",
    "tokensPerMo": "{tokens}M токенов / мес",
    "tdTitle": "Круговая диаграмма: Структура затрат сессии агента",
    "tdSubtitle": "Интерактивная разбивка: системные промпты, кэш, цепочки рассуждений и генерация.",
    "tdSessionSpendTag": "Затраты сессии",
    "tdSessionSpendDesc": "Наведите курсор на сектор или строку, чтобы изолировать категорию затрат и рычаги оптимизации.",
    "tdTotalTokens": "Итого: $134.50 / 1.0M токенов",
    "tdSystemCache": "Системный кэш (48%)",
    "tdToolContext": "Контекст инструментов (24%)",
    "tdReasoning": "Рассуждения CoT (18%)",
    "tdGeneration": "Генерация (10%)",
    "cost": "Стоимость:",
    "tokens": "Токены:",
    "share": "доля",
    "hdTitle": "Горизонтальная дельта: Региональная наценка к базовой цене",
    "hdSubtitle": "Надбавки за суверенитет данных и локальную обработку (+0% до +35%) к стандартному прайс-листу.",
    "hdBenchmarkTag": "Бенчмарк локации",
    "hdBenchmarkDesc": "Наведите курсор для проверки наценок за суверенитет и нормализованных затрат на 10 млн токенов.",
    "hdBaselineRef": "0% База = Прямое API",
    "hdParity": "0% Паритет",
    "hdDataZone": "Зона данных (+12%)",
    "hdSingleRegion": "Один регион (+18%)",
    "hdSovereign": "Суверенное облако (+35%)",
    "normCost": "Норм. 10M:",
    "markup": "Наценка",
    "wfTitle": "Каскад мульти-диалога: Без кэша против Prompt Caching",
    "wfSubtitle": "Моделирование накопления контекста за 8 шагов: квадратичный рост затрат vs плоский график с кэшем.",
    "wfAuditTag": "Аудит контекста",
    "wfAuditDesc": "Перемещайте курсор по шагам T1–T8 для сравнения некэшированного расхода с экономией от кэша.",
    "wfYield": "85% Общая экономия сессии",
    "wfUncached": "Без кэша (Квадратичный рост)",
    "wfCached": "С кэшированием (Плоский прирост)",
    "wfSavings": "85% Итоговая экономия",
    "uncached": "Без кэша:",
    "cached": "С кэшем:",
    "inContext": "в контексте",
    "savedMsg": "Экономия {saved}$ (скидка {pct}%)",
    "tier": "Уровень:",
    "hdBaseline": "0% База",
    "parity": "Паритет (0%)",
    "exactParity": "Точный паритет",
    "totalSpend": "Общие затраты пакета",
    "tokenDist": "Распределение токенов",
    "catCount": "4 категории",
    "sessionPct": "затрат сессии",
    "tokensAll": "100% токенов"
  },
  "tr": {
    "pfTitle": "Maliyet-Kalite Pareto Sınırı: Doğruluk vs Görev Maliyeti",
    "pfSubtitle": "En uygun fiyat-performans oranını belirlemek için benchmark doğruluğunu görev başına maliyetle eşleştirir.",
    "pfSummaryTag": "SWE-bench Sınırı",
    "pfSummaryDesc": "o3-mini ve Sonnet 3.7 Pareto'nun en verimli noktasında: Görev başına $1.80–$4.50 ile %81–%87 doğruluk.",
    "pfEfficiencyTag": "%85 Sınır Verimliliği",
    "pfCostAxis": "Çözülen Görev Başına Maliyet ($) →",
    "pfAccAxis": "Benchmark Doğruluğu (%)",
    "pfBoundary": "Optimum Pareto Sınırı →",
    "pfSweetSpot": "Pareto İdeal Noktası",
    "pfFrontierEff": "Öncü Model Verimliliği",
    "pfValueLeader": "Fiyat-Performans Lideri",
    "pfDiminishing": "Azalan Verim Bölgesi",
    "pfAccLabel": "Doğruluk:",
    "pfCostLabel": "Maliyet:",
    "pfEffScore": "Puan/$:",
    "cfTitle": "Kademeli Yönlendirme Hunisi ve Getirisi",
    "cfSubtitle": "Çok ucuz Flash filtrelerden üst düzey akıl yürütme modellerine dinamik sorgu yönlendirmesini simüle eder.",
    "cfSummaryTag": "Kademeli Getiri",
    "cfSummaryDesc": "Ortalama harcama: Tüm trafiğin öncü modellere gitmesi durumundaki $250.00 yerine $32.62.",
    "cfNetSavings": "-%86.9 Net Tasarruf",
    "cfIncoming": "Gelen Trafik (%100)",
    "cfTier1": "1. Seviye: Filtre ve Flash (%68)",
    "cfTier2": "2. Seviye: Orta Düzey Akıl Yürütme (%22)",
    "cfTier3": "3. Seviye: Öncü Opus/Pro (%10)",
    "cfVolume": "Hacim:",
    "cfRate": "Tarife:",
    "cfSubtotal": "Ara Toplam:",
    "cfShare": "Maliyet Payı:",
    "meTitle": "SaaS Yapay Zeka Özelliği Brüt Kâr Marjı Erime Ölçeri",
    "meSubtitle": "Sabit koltuk abonelik geliri ($40/ay) ile müşteri yüzdeliklerine göre değişken token tüketiminin karşılaştırması.",
    "meSummaryTag": "Birim Ekonomisi",
    "meSummaryDesc": "Kullanıcı başına sabit $40 gelir vs kohort bazında değişken yapay zeka token maliyeti.",
    "meTopLoss": "İlk %5 Tüm Kârı Yok Ediyor",
    "meLight": "Hafif Kullanıcı (Koltukların %50'si)",
    "meMedium": "Orta Kullanıcı (Koltukların %35'i)",
    "meHeavy": "Yoğun Kullanıcı (Koltukların %10'u)",
    "meExtreme": "Sınırsız Aşırı (İlk %5)",
    "meGrossMargin": "Brüt Kâr Marjı",
    "meNetLoss": "Net Zarar",
    "meProfit": "kâr",
    "meLoss": "zarar",
    "meRevenueCeiling": "$40 Gelir Tavanı",
    "meTokenCost": "Token Maliyeti:",
    "meRevenue": "Gelir:",
    "ttlTitle": "İstem Önbelleği Hareketsizlik TTL Bozulma Çizelgesi",
    "ttlSubtitle": "Önbelleğin silinip soğuk yazma fiyatlandırmasına geçtiği 5 dakikalık hareketsizlik sınırını gösterir.",
    "ttlSummaryTag": "TTL Bozulma Penceresi",
    "ttlSummaryDesc": "5 dakikalık hareketsizlik penceresi: 4 dk içindeki çağrılar önbelleğe ($0.30/M), 6+ dk çağrılar soğuk yazmaya ($3.75/M) düşer.",
    "ttlThreshold": "5 Dk Sınırı",
    "ttlBoundary": "5 Dk Hareketsizlik TTL Sınırı",
    "ttlHotZone": "Sıcak Önbellek Bölgesi (0–4 dk: %90 İsabet)",
    "ttlColdZone": "Boşaltılmış Soğuk Bölge (5+ dk: %0 İsabet)",
    "ttlStateHit": "İSABET (Sıcak Bağlam)",
    "ttlStateMiss": "SİLİNDİ (Soğuk Yazma)",
    "ttlInterval": "Aralık:",
    "ttlState": "Durum:",
    "ttlEffRate": "Geçerli Tarife:",
    "ttlLatency": "Gecikme:",
    "ttlDiscount": "%92 Önbellek İndirimi",
    "ttlPenalty": "Tam Soğuk Yazma Cezası",
    "gbTitle": "Doğrudan API ve Yönetilen Bulut Fiyatları",
    "gbSubtitle": "Doğrudan API ile Yönetilen Bulut sağlayıcıları arasında 1M token başına girdi/çıktı fiyat karşılaştırması.",
    "gbSummaryTag": "Özet",
    "gbSummaryDesc": "Girdi/çıktı fiyat eşitliğini ve yüzde farklarını görmek için sütunların üzerine gelin.",
    "gbDelta": "4 Metrik Karşılaştırması",
    "directIn": "Doğrudan Girdi",
    "cloudIn": "Bulut Girdi",
    "directOut": "Doğrudan Çıktı",
    "cloudOut": "Bulut Çıktı",
    "inputRate": "Girdi:",
    "outputRate": "Çıktı:",
    "beTitle": "Başabaş Eğrisi: Kullandıkça Öde ve Aylık PTU Rezervasyonu",
    "beSubtitle": "Ayrılmış PTU rezervasyonunun kullandıkça öde modelinden daha ekonomik olduğu eşiği belirler.",
    "beTag": "Başabaş: ~{tokens}M Token",
    "beDesc": "1x PTU rezervasyonunun ({base} taban + {marginal}/M) kullandıkça öde modelini ({paygo}/M) geçtiği aylık eşik.",
    "beSpendIdentical": "Harcama: ~{cost}$/ay eşit",
    "paygoLabel": "Kullandıkça Öde",
    "ptuLabel": "PTU Rezervasyonu",
    "beIntersection": "Başabaş Kesişimi",
    "beExact": "Tam Başabaş: Harcama ~{cost}$/ay eşit",
    "bePtuSaves": "PTU tasarrufu: {delta}$/ay (%{pct} indirim)",
    "bePaygoCheaper": "Kullandıkça Öde {delta}$/ay daha ucuz",
    "tokensPerMo": "{tokens}M Token / ay",
    "tdTitle": "Halka Grafik: Tipik Ajan Oturumu Maliyet Dağılımı",
    "tdSubtitle": "Sistem istemleri, önbellek isabetleri, mantık yürütme ve çıktı üretiminin etkileşimli maliyet dökümü.",
    "tdSessionSpendTag": "Oturum Harcaması",
    "tdSessionSpendDesc": "Kategori maliyetlerini ve optimizasyon fırsatlarını izole etmek için dilimlerin üzerine gelin.",
    "tdTotalTokens": "Toplam: $134.50 / 1.0M Token",
    "tdSystemCache": "Sistem Önbelleği (%48)",
    "tdToolContext": "Araç Bağlamı (%24)",
    "tdReasoning": "Akıl Yürütme CoT (%18)",
    "tdGeneration": "Çıktı Üretimi (%10)",
    "cost": "Maliyet:",
    "tokens": "Token:",
    "share": "pay",
    "hdTitle": "Yatay Fark: Bölgesel Fiyat Artışı ve Küresel Taban",
    "hdSubtitle": "Veri egemenliği ve yerel barındırma nedeniyle standart fiyat listesine eklenen primler (+%0 - +%35).",
    "hdBenchmarkTag": "Veri Konumu Ölçütü",
    "hdBenchmarkDesc": "Veri egemenliği primlerini ve 10M token için normalleştirilmiş maliyetleri görmek için katmanları inceleyin.",
    "hdBaselineRef": "%0 Taban = Doğrudan API",
    "hdParity": "%0 Eşitlik",
    "hdDataZone": "Veri Bölgesi (+%12)",
    "hdSingleRegion": "Tek Bölge (+%18)",
    "hdSovereign": "Egemen Bulut (+%35)",
    "normCost": "Norm 10M:",
    "markup": "Artış",
    "wfTitle": "Çok Turlu Birikim Şelalesi: Önbelleksiz ve Önbellekli",
    "wfSubtitle": "8 tur boyunca bağlam birikimi simülasyonu: önbelleksiz karesel artış vs düz önbellekli yürütme.",
    "wfAuditTag": "Birikim Denetimi",
    "wfAuditDesc": "Önbelleksiz tüketim ile istem önbellekleme tasarrufunu karşılaştırmak için T1–T8 turları arasında gezinin.",
    "wfYield": "%85 Toplam Oturum Verimi",
    "wfUncached": "Önbelleksiz (Karesel Büyüme)",
    "wfCached": "İstem Önbellekli (Düz Artış)",
    "wfSavings": "%85 Nihai Tasarruf",
    "uncached": "Önbelleksiz:",
    "cached": "Önbellekli:",
    "inContext": "bağlamda",
    "savedMsg": "{saved}$ tasarruf (%{pct} indirim)",
    "tier": "Katman:",
    "hdBaseline": "%0 Taban",
    "parity": "Eşitlik (%0)",
    "exactParity": "Tam Eşitlik",
    "totalSpend": "Toplam Toplu Harcama",
    "tokenDist": "Token Dağılımı",
    "catCount": "4 Kategori",
    "sessionPct": "oturum harcaması",
    "tokensAll": "Tokenların %100'ü"
  },
  "pl": {
    "pfTitle": "Granica Pareto Koszt-Jakość: Dokładność vs Koszt Zadania",
    "pfSubtitle": "Zestawia dokładność w benchmarkach z kosztem rozwiązania zadania w celu wyznaczenia optymalnego stosunku ceny do wydajności.",
    "pfSummaryTag": "Granica SWE-bench",
    "pfSummaryDesc": "o3-mini i Sonnet 3.7 zajmują optymalny punkt Pareto: 81–87% dokładności przy $1.80–$4.50 za zadanie.",
    "pfEfficiencyTag": "85% Wydajność graniczna",
    "pfCostAxis": "Koszt za rozwiązane zadanie SWE ($) →",
    "pfAccAxis": "Dokładność w benchmarku (%)",
    "pfBoundary": "Optymalna granica Pareto →",
    "pfSweetSpot": "Punkt optymalny Pareto",
    "pfFrontierEff": "Wydajność modeli wiodących",
    "pfValueLeader": "Lider opłacalności",
    "pfDiminishing": "Malejące korzyści",
    "pfAccLabel": "Dokładność:",
    "pfCostLabel": "Koszt:",
    "pfEffScore": "Pkt/$:",
    "cfTitle": "Kaskadowy Lejek Routingowy i Zyskowność",
    "cfSubtitle": "Symuluje dynamiczne stopniowanie zapytań od tanich filtrów Flash po wiodące modele wnioskujące.",
    "cfSummaryTag": "Uzysk z kaskady",
    "cfSummaryDesc": "Średni koszt: $32.62 w porównaniu z $250.00 przy 100% kierowaniu do modeli wiodących.",
    "cfNetSavings": "-86.9% Oszczędności netto",
    "cfIncoming": "Ruch przychodzący (100%)",
    "cfTier1": "Poziom 1: Filtrowanie i Flash (68%)",
    "cfTier2": "Poziom 2: Średnie wnioskowanie (22%)",
    "cfTier3": "Poziom 3: Wiodące Opus/Pro (10%)",
    "cfVolume": "Wolumen:",
    "cfRate": "Stawka:",
    "cfSubtotal": "Suma częściowa:",
    "cfShare": "Udział w kosztach:",
    "meTitle": "Miernik Erozji Marży Brutto w Usługach SaaS AI",
    "meSubtitle": "Stały przychód z subskrypcji stanowiska ($40/mies.) vs zmienne zużycie tokenów według percentyli użytkowników.",
    "meSummaryTag": "Ekonomia jednostkowa",
    "meSummaryDesc": "Stały przychód $40/użytkownika vs zmienne zużycie tokenów AI w kohortach.",
    "meTopLoss": "Górne 5% pochłania całą marżę",
    "meLight": "Lekkie użycie (50% stanowisk)",
    "meMedium": "Średnie użycie (35% stanowisk)",
    "meHeavy": "Ciężkie użycie (10% stanowisk)",
    "meExtreme": "Skrajne bez limitu (Top 5%)",
    "meGrossMargin": "Marża brutto",
    "meNetLoss": "Strata netto",
    "meProfit": "zysk",
    "meLoss": "strata",
    "meRevenueCeiling": "Pułap przychodów $40",
    "meTokenCost": "Koszt tokenów:",
    "meRevenue": "Przychód:",
    "ttlTitle": "Oś Czasu Spadku TTL Pamięci Podręcznej Promptów",
    "ttlSubtitle": "Wizualizuje 5-minutową granicę bezczynności, po której stan pamięci podręcznej wygasa do stawek zapisu na zimno.",
    "ttlSummaryTag": "Okno wygasania TTL",
    "ttlSummaryDesc": "5-minutowe okno: wywołania do 4 min trafiają do pamięci podręcznej ($0.30/M); powyżej 6 min płacą za zapis na zimno ($3.75/M).",
    "ttlThreshold": "Próg 5 min",
    "ttlBoundary": "Granica bezczynności TTL 5 min",
    "ttlHotZone": "Gorąca strefa pamięci podręcznej (0–4 min: 90% trafień)",
    "ttlColdZone": "Zimna strefa wygaszenia (5+ min: 0% trafień)",
    "ttlStateHit": "TRAFIENIE (Gorący kontekst)",
    "ttlStateMiss": "WYGASZONE (Zapis na zimno)",
    "ttlInterval": "Interwał:",
    "ttlState": "Stan:",
    "ttlEffRate": "Efektywna stawka:",
    "ttlLatency": "Opóźnienie:",
    "ttlDiscount": "92% Zniżki za pamięć",
    "ttlPenalty": "Pełny koszt zapisu na zimno",
    "gbTitle": "Stawki Direct API vs Chmura Zarządzana",
    "gbSubtitle": "Koszty wejścia i wyjścia za 1M tokenów: porównanie bezpośredniego API z dostawcami chmurowymi.",
    "gbSummaryTag": "Podsumowanie",
    "gbSummaryDesc": "Najedź kursorem na kolumnę modelu, aby sprawdzić parytet cen wejścia/wyjścia i różnice procentowe.",
    "gbDelta": "Porównanie 4 wskaźników",
    "directIn": "Wejście Bezpośrednie",
    "cloudIn": "Wejście Chmurowe",
    "directOut": "Wyjście Bezpośrednie",
    "cloudOut": "Wyjście Chmurowe",
    "inputRate": "Wejście:",
    "outputRate": "Wyjście:",
    "beTitle": "Krzywa progu rentowności: Na żądanie vs Miesięczna rezerwacja PTU",
    "beSubtitle": "Określa dokładny próg tokenów miesięcznie, przy którym rezerwacja PTU przewyższa model na żądanie.",
    "beTag": "Próg opłacalności: ~{tokens}M Tokenów",
    "beDesc": "Miesięczny próg, przy którym 1x rezerwacja PTU ({base} baza + {marginal}/M) wygrywa z modelem na żądanie ({paygo}/M).",
    "beSpendIdentical": "Wydatki: ~{cost}$/mies. identyczne",
    "paygoLabel": "Płatność za zużycie",
    "ptuLabel": "Rezerwacja PTU",
    "beIntersection": "Punkt przecięcia opłacalności",
    "beExact": "Dokładny próg: Wydatki ~{cost}$/mies. identyczne",
    "bePtuSaves": "PTU oszczędza {delta}$/mies. ({pct}% rabatu)",
    "bePaygoCheaper": "Model na żądanie jest o {delta}$/mies. tańszy",
    "tokensPerMo": "{tokens}M Tokenów / mies.",
    "tdTitle": "Wykres pierścieniowy: Struktura kosztów sesji agenta",
    "tdSubtitle": "Interaktywny podział wydatków: prompty systemowe, pamięć podręczna, rozumowanie i generowanie.",
    "tdSessionSpendTag": "Koszty sesji",
    "tdSessionSpendDesc": "Najedź na wycinek lub wiersz, aby wyizolować koszty i poznać dźwignie optymalizacji.",
    "tdTotalTokens": "Razem: $134.50 / 1.0M Tokenów",
    "tdSystemCache": "Pamięć podręczna (48%)",
    "tdToolContext": "Kontekst narzędzi (24%)",
    "tdReasoning": "Rozumowanie CoT (18%)",
    "tdGeneration": "Generowanie (10%)",
    "cost": "Koszt:",
    "tokens": "Tokeny:",
    "share": "udział",
    "hdTitle": "Delta pozioma: Narzut regionalny vs Globalna cena bazowa",
    "hdSubtitle": "Dopłaty za suwerenność danych i lokalną rezydenturę (+0% do +35%) względem cen katalogowych.",
    "hdBenchmarkTag": "Wzorzec rezydentury",
    "hdBenchmarkDesc": "Sprawdź poziomy wdrożenia, aby zbadać dopłaty za suwerenność i znormalizowany koszt 10M tokenów.",
    "hdBaselineRef": "0% Baza = Direct API",
    "hdParity": "0% Parytet",
    "hdDataZone": "Strefa danych (+12%)",
    "hdSingleRegion": "Pojedynczy region (+18%)",
    "hdSovereign": "Chmura suwerenna (+35%)",
    "normCost": "Norma 10M:",
    "markup": "Narzut",
    "wfTitle": "Kaskada wieloturowa: Bez pamięci podręcznej vs Prompt Caching",
    "wfSubtitle": "Symulacja narastania kontekstu przez 8 tur: kwadratowy wzrost kosztów vs płaski przebieg z pamięcią podręczną.",
    "wfAuditTag": "Audyt narastania",
    "wfAuditDesc": "Przesuwaj kursor po turach T1–T8, aby porównać wydatki bez cache z oszczędnościami prompt cachingu.",
    "wfYield": "85% Łączna wydajność sesji",
    "wfUncached": "Bez cache (Wzrost kwadratowy)",
    "wfCached": "Z prompt cachingiem (Płaski przyrost)",
    "wfSavings": "85% Ostateczna oszczędność",
    "uncached": "Bez cache:",
    "cached": "W pamięci podręcznej:",
    "inContext": "w kontekście",
    "savedMsg": "Oszczędzono {saved}$ ({pct}% rabatu)",
    "tier": "Poziom:",
    "hdBaseline": "0% Baza",
    "parity": "Parytet (0%)",
    "exactParity": "Dokładny parytet",
    "totalSpend": "Łączne wydatki partii",
    "tokenDist": "Dystrybucja tokenów",
    "catCount": "4 kategorie",
    "sessionPct": "wydatków sesji",
    "tokensAll": "100% tokenów"
  },
  "id": {
    "pfTitle": "Batas Pareto Biaya-Kualitas: Akurasi vs Biaya Tugas",
    "pfSubtitle": "Memetakan akurasi benchmark model terhadap biaya per tugas terselesaikan untuk menentukan efisiensi harga-kinerja optimal.",
    "pfSummaryTag": "Batas SWE-bench",
    "pfSummaryDesc": "o3-mini & Sonnet 3.7 menempati Titik Manis Pareto: akurasi 81–87% pada $1.80–$4.50/tugas.",
    "pfEfficiencyTag": "85% Efisiensi Terdepan",
    "pfCostAxis": "Biaya per Tugas Terselesaikan ($) →",
    "pfAccAxis": "Akurasi Benchmark (%)",
    "pfBoundary": "Batas Pareto Optimal →",
    "pfSweetSpot": "Titik Manis Pareto",
    "pfFrontierEff": "Efisiensi Model Terdepan",
    "pfValueLeader": "Pemimpin Nilai",
    "pfDiminishing": "Hasil Berkurang",
    "pfAccLabel": "Akurasi:",
    "pfCostLabel": "Biaya:",
    "pfEffScore": "Skor/$:",
    "cfTitle": "Corong Perutean Berjenjang & Hasil Penghematan",
    "cfSubtitle": "Mensimulasikan pembagian kueri dinamis dari filter Flash murah hingga model penalaran terdepan.",
    "cfSummaryTag": "Hasil Kaskade",
    "cfSummaryDesc": "Pengeluaran gabungan: $32.62 dibanding $250.00 jika 100% dialihkan ke model terdepan.",
    "cfNetSavings": "-86.9% Penghematan Bersih",
    "cfIncoming": "Lalu Lintas Masuk (100%)",
    "cfTier1": "Tingkat 1: Filter & Flash (68%)",
    "cfTier2": "Tingkat 2: Penalaran Menengah (22%)",
    "cfTier3": "Tingkat 3: Model Terdepan Opus/Pro (10%)",
    "cfVolume": "Volume:",
    "cfRate": "Tarif:",
    "cfSubtotal": "Subtotal:",
    "cfShare": "Pangsa Biaya:",
    "meTitle": "Pengukur Erosi Margin Kotor Fitur AI SaaS",
    "meSubtitle": "Pendapatan langganan tetap ($40/bln) dibandingkan dengan konsumsi token variabel di seluruh persentil pelanggan.",
    "meSummaryTag": "Ekonomi Unit",
    "meSummaryDesc": "Pendapatan tetap $40/pengguna vs konsumsi token AI variabel per kelompok pengguna.",
    "meTopLoss": "5% Teratas Mengikis Seluruh Margin",
    "meLight": "Pengguna Ringan (50% akun)",
    "meMedium": "Pengguna Sedang (35% akun)",
    "meHeavy": "Pengguna Berat (10% akun)",
    "meExtreme": "Ekstrem Tanpa Batas (5% Teratas)",
    "meGrossMargin": "Margin Kotor",
    "meNetLoss": "Kerugian Bersih",
    "meProfit": "keuntungan",
    "meLoss": "kerugian",
    "meRevenueCeiling": "Batas Pendapatan $40",
    "meTokenCost": "Biaya Token:",
    "meRevenue": "Pendapatan:",
    "ttlTitle": "Garis Waktu Peluruhan TTL Ketidakaktifan Cache Prompt",
    "ttlSubtitle": "Memvisualisasikan batas ketidakaktifan 5 menit di mana cache dihapus dan beralih ke tarif penulisan dingin.",
    "ttlSummaryTag": "Jendela Penghapusan TTL",
    "ttlSummaryDesc": "Jendela 5 menit: panggilan dalam 4 mnt mengenai cache ($0.30/M); panggilan di atas 6 mnt dikenai penulisan dingin ($3.75/M).",
    "ttlThreshold": "Batas 5 Mnt",
    "ttlBoundary": "Batas TTL Ketidakaktifan 5 Mnt",
    "ttlHotZone": "Zona Cache Panas (0–4 mnt: 90% Berhasil)",
    "ttlColdZone": "Zona Dingin Dihapus (5+ mnt: 0% Berhasil)",
    "ttlStateHit": "BERHASIL (Konteks Panas)",
    "ttlStateMiss": "DIHAPUS (Penulisan Dingin)",
    "ttlInterval": "Interval:",
    "ttlState": "Status:",
    "ttlEffRate": "Tarif Efektif:",
    "ttlLatency": "Latensi:",
    "ttlDiscount": "Diskon Cache 92%",
    "ttlPenalty": "Penalti Penuh Penulisan Dingin",
    "gbTitle": "Tarif API Langsung vs Cloud Terkelola",
    "gbSubtitle": "Tarif input & output per 1 juta token membandingkan API Langsung dengan penyedia Cloud.",
    "gbSummaryTag": "Ringkasan",
    "gbSummaryDesc": "Arahkan kursor ke kolom model untuk memeriksa paritas tarif input/output dan selisih persentase.",
    "gbDelta": "Perbandingan 4 Metrik",
    "directIn": "Input Langsung",
    "cloudIn": "Input Cloud",
    "directOut": "Output Langsung",
    "cloudOut": "Output Cloud",
    "inputRate": "Input:",
    "outputRate": "Output:",
    "beTitle": "Kurva Impas: Bayar Sesuai Pemakaian vs Reservasi Bulanan PTU",
    "beSubtitle": "Mengidentifikasi ambang batas volume token bulanan di mana reservasi PTU lebih hemat daripada on-demand.",
    "beTag": "Titik Impas: ~{tokens}M Token",
    "beDesc": "Ambang bulanan di mana 1x reservasi PTU ({base} basis + {marginal}/M) mengalahkan on-demand ({paygo}/M).",
    "beSpendIdentical": "Pengeluaran: ~{cost}/bln identik",
    "paygoLabel": "Bayar Sesuai Pakai",
    "ptuLabel": "Reservasi PTU",
    "beIntersection": "Titik Temu Impas",
    "beExact": "Impas Tepat: Pengeluaran ~{cost}/bln identik",
    "bePtuSaves": "PTU hemat {delta}/bln (diskon {pct}%)",
    "bePaygoCheaper": "PayGo lebih hemat {delta}/bln",
    "tokensPerMo": "{tokens}M Token / bln",
    "tdTitle": "Diagram Donat: Komposisi Biaya Sesi Agen Tipikal",
    "tdSubtitle": "Rincian interaktif pengeluaran: prompt sistem, cache, penalaran CoT, dan output.",
    "tdSessionSpendTag": "Biaya Sesi",
    "tdSessionSpendDesc": "Arahkan kursor ke potongan atau baris untuk mengisolasi biaya kategori dan opsi optimasi.",
    "tdTotalTokens": "Total: $134.50 / 1.0M Token",
    "tdSystemCache": "Cache Sistem (48%)",
    "tdToolContext": "Konteks Alat (24%)",
    "tdReasoning": "Penalaran CoT (18%)",
    "tdGeneration": "Generasi Output (10%)",
    "cost": "Biaya:",
    "tokens": "Token:",
    "share": "porsi",
    "hdTitle": "Delta Horizontal: Markup Regional vs Harga Dasar Global",
    "hdSubtitle": "Markup kedaulatan data dan residensi regional (+0% hingga +35%) di atas harga katalog.",
    "hdBenchmarkTag": "Tolok Ukur Residensi",
    "hdBenchmarkDesc": "Periksa tingkatan penerapan untuk melihat premi kedaulatan dan biaya normalisasi per 10M token.",
    "hdBaselineRef": "0% Basis = API Langsung",
    "hdParity": "0% Paritas",
    "hdDataZone": "Zona Data (+12%)",
    "hdSingleRegion": "Satu Wilayah (+18%)",
    "hdSovereign": "Cloud Berdaulat (+35%)",
    "normCost": "Norm 10M:",
    "markup": "Markup",
    "wfTitle": "Air Terjun Multi-Putaran: Tanpa Cache vs Prompt Caching",
    "wfSubtitle": "Simulasi akumulasi konteks selama 8 putaran: biaya kuadratik tanpa cache vs biaya datar dengan cache.",
    "wfAuditTag": "Audit Akumulasi",
    "wfAuditDesc": "Geser kursor di atas putaran T1–T8 untuk membandingkan pemborosan tanpa cache dengan prompt caching.",
    "wfYield": "85% Hasil Total Sesi",
    "wfUncached": "Tanpa Cache (Pertumbuhan Kuadratik)",
    "wfCached": "Dengan Prompt Caching (Inkremental Datar)",
    "wfSavings": "85% Penghematan Akhir",
    "uncached": "Tanpa Cache:",
    "cached": "Dalam Cache:",
    "inContext": "dalam konteks",
    "savedMsg": "Hemat {saved} (diskon {pct}%)",
    "tier": "Tingkat:",
    "hdBaseline": "0% Basis",
    "parity": "Paritas (0%)",
    "exactParity": "Paritas Tepat",
    "totalSpend": "Total Belanja Batch",
    "tokenDist": "Distribusi Token",
    "catCount": "4 Kategori",
    "sessionPct": "dari belanja sesi",
    "tokensAll": "100% token"
  },
  "vi": {
    "pfTitle": "Biên Pareto Chi Phí - Chất Lượng: Độ Chính Xác vs Chi Phí Tác Vụ",
    "pfSubtitle": "Đối chiếu độ chính xác benchmark với chi phí trên mỗi tác vụ để xác định hiệu quả giá/hiệu năng tối ưu.",
    "pfSummaryTag": "Biên SWE-bench",
    "pfSummaryDesc": "o3-mini & Sonnet 3.7 chiếm điểm tối ưu Pareto: độ chính xác 81–87% ở mức 1.80$–4.50$/tác vụ.",
    "pfEfficiencyTag": "85% Hiệu Quả Biên",
    "pfCostAxis": "Chi phí trên mỗi tác vụ ($) →",
    "pfAccAxis": "Độ chính xác Benchmark (%)",
    "pfBoundary": "Biên Pareto Tối Ưu →",
    "pfSweetSpot": "Điểm Tối Ưu Pareto",
    "pfFrontierEff": "Hiệu Quả Mô Hình Tiên Phong",
    "pfValueLeader": "Dẫn Đầu Giá Trị",
    "pfDiminishing": "Hiệu Suất Giảm Dần",
    "pfAccLabel": "Độ chính xác:",
    "pfCostLabel": "Chi phí:",
    "pfEffScore": "Điểm/$:",
    "cfTitle": "Phễu Định Tuyến Phân Tầng & Hiệu Suất Tiết Kiệm",
    "cfSubtitle": "Mô phỏng phân luồng truy vấn động từ bộ lọc Flash siêu rẻ đến các mô hình lập luận cao cấp.",
    "cfSummaryTag": "Hiệu Suất Phân Tầng",
    "cfSummaryDesc": "Chi phí kết hợp: 32.62$ so với 250.00$ nếu gửi 100% đến các mô hình tiên phong.",
    "cfNetSavings": "-86.9% Tiết Kiệm Ròng",
    "cfIncoming": "Lưu lượng đến (100%)",
    "cfTier1": "Tầng 1: Lọc & Flash (68%)",
    "cfTier2": "Tầng 2: Lập luận tầm trung (22%)",
    "cfTier3": "Tầng 3: Tiên phong Opus/Pro (10%)",
    "cfVolume": "Khối lượng:",
    "cfRate": "Đơn giá:",
    "cfSubtotal": "Tạm tính:",
    "cfShare": "Tỷ trọng chi phí:",
    "meTitle": "Thước Đo Xói Mòn Biên Lợi Nhuận Gộp Tính Năng AI SaaS",
    "meSubtitle": "Doanh thu thuê bao cố định (40$/tháng) so với chi phí token biến đổi theo phân vị người dùng.",
    "meSummaryTag": "Kinh Tế Đơn Vị",
    "meSummaryDesc": "Doanh thu cố định 40$/người dùng vs mức tiêu hao token AI biến đổi theo nhóm.",
    "meTopLoss": "Top 5% Xóa Sổ Toàn Bộ Biên Lợi Nhuận",
    "meLight": "Dùng ít (50% số ghế)",
    "meMedium": "Dùng trung bình (35% số ghế)",
    "meHeavy": "Dùng nhiều (10% số ghế)",
    "meExtreme": "Cực độ không giới hạn (Top 5%)",
    "meGrossMargin": "Biên Lợi Nhuận Gộp",
    "meNetLoss": "Lỗ Ròng",
    "meProfit": "lời",
    "meLoss": "lỗ",
    "meRevenueCeiling": "Trần Doanh Thu 40$",
    "meTokenCost": "Chi Phí Token:",
    "meRevenue": "Doanh Thu:",
    "ttlTitle": "Dòng Thời Gian Phân Rã TTL Không Hoạt Động Của Cache Prompt",
    "ttlSubtitle": "Mô phỏng ranh giới không hoạt động 5 phút khi trạng thái cache bị thu hồi và chuyển sang tính phí ghi nguội.",
    "ttlSummaryTag": "Cửa Sổ Thu Hồi TTL",
    "ttlSummaryDesc": "Cửa sổ 5 phút: gọi trong 4 phút trúng cache (0.30$/M); gọi sau 6 phút chịu phí ghi nguội (3.75$/M).",
    "ttlThreshold": "Ngưỡng 5 Phút",
    "ttlBoundary": "Ranh Giới TTL Không Hoạt Động 5 Phút",
    "ttlHotZone": "Vùng Cache Nóng (0–4 phút: trúng 90%)",
    "ttlColdZone": "Vùng Nguội Thu Hồi (5+ phút: trúng 0%)",
    "ttlStateHit": "TRÚNG (Ngữ cảnh nóng)",
    "ttlStateMiss": "THU HỒI (Ghi nguội)",
    "ttlInterval": "Khoảng thời gian:",
    "ttlState": "Trạng thái:",
    "ttlEffRate": "Đơn giá thực tế:",
    "ttlLatency": "Độ trễ:",
    "ttlDiscount": "Giảm giá 92% Cache",
    "ttlPenalty": "Phạt toàn bộ phí ghi nguội",
    "gbTitle": "Bảng giá API Trực tiếp vs Đám mây Quản lý",
    "gbSubtitle": "Giá đầu vào và đầu ra trên 1M token so sánh giữa API Trực tiếp và các nhà cung cấp Đám mây.",
    "gbSummaryTag": "Tóm tắt",
    "gbSummaryDesc": "Di chuột qua cột mô hình để kiểm tra tính tương đương giá đầu vào/đầu ra và phần trăm chênh lệch.",
    "gbDelta": "So sánh 4 Chỉ số",
    "directIn": "Đầu vào Trực tiếp",
    "cloudIn": "Đầu vào Đám mây",
    "directOut": "Đầu ra Trực tiếp",
    "cloudOut": "Đầu ra Đám mây",
    "inputRate": "Đầu vào:",
    "outputRate": "Đầu ra:",
    "beTitle": "Đường cong hòa vốn: Theo yêu cầu vs Đặt trước PTU hàng tháng",
    "beSubtitle": "Xác định ngưỡng khối lượng token hàng tháng mà đặt trước PTU tiết kiệm hơn trả theo mức dùng.",
    "beTag": "Điểm hòa vốn: ~{tokens}M Token",
    "beDesc": "Ngưỡng hàng tháng mà 1x PTU ({base} gốc + {marginal}/M) tiết kiệm hơn trả theo mức dùng ({paygo}/M).",
    "beSpendIdentical": "Chi phí: ~{cost}$/tháng tương đương",
    "paygoLabel": "Trả theo mức dùng",
    "ptuLabel": "Đặt trước PTU",
    "beIntersection": "Điểm giao hòa vốn",
    "beExact": "Hòa vốn chính xác: Chi phí ~{cost}$/tháng như nhau",
    "bePtuSaves": "PTU tiết kiệm {delta}$/tháng (giảm {pct}%)",
    "bePaygoCheaper": "Trả theo mức dùng rẻ hơn {delta}$/tháng",
    "tokensPerMo": "{tokens}M Token / tháng",
    "tdTitle": "Biểu đồ tròn: Cơ cấu chi phí phiên tác tử điển hình",
    "tdSubtitle": "Phân tích tương tác chi phí: câu lệnh hệ thống, bộ nhớ cache, chuỗi suy luận và kết quả đầu ra.",
    "tdSessionSpendTag": "Chi phí phiên",
    "tdSessionSpendDesc": "Di chuột qua từng phần hoặc dòng để xem chi phí từng danh mục và đòn bẩy tối ưu hóa.",
    "tdTotalTokens": "Tổng cộng: $134.50 / 1.0M Token",
    "tdSystemCache": "Cache Hệ thống (48%)",
    "tdToolContext": "Ngữ cảnh Công cụ (24%)",
    "tdReasoning": "Suy luận CoT (18%)",
    "tdGeneration": "Tạo Đầu ra (10%)",
    "cost": "Chi phí:",
    "tokens": "Token:",
    "share": "tỷ lệ",
    "hdTitle": "Độ lệch ngang: Chênh lệch vùng so với Giá cơ sở toàn cầu",
    "hdSubtitle": "Mức chênh lệch về chủ quyền dữ liệu và lưu trữ khu vực (+0% đến +35%) so với giá chuẩn.",
    "hdBenchmarkTag": "Chuẩn lưu trữ dữ liệu",
    "hdBenchmarkDesc": "Kiểm tra các cấp độ triển khai để xem mức phí chủ quyền và chi phí chuẩn hóa trên 10M token.",
    "hdBaselineRef": "0% Chuẩn = API Trực tiếp",
    "hdParity": "0% Ngang bằng",
    "hdDataZone": "Vùng dữ liệu (+12%)",
    "hdSingleRegion": "Một khu vực (+18%)",
    "hdSovereign": "Đám mây chủ quyền (+35%)",
    "normCost": "Chuẩn 10M:",
    "markup": "Chênh lệch",
    "wfTitle": "Biểu đồ bậc thang đa lượt: Không cache vs Có Prompt Caching",
    "wfSubtitle": "Mô phỏng tích lũy ngữ cảnh qua 8 lượt: tăng chi phí bậc hai khi không cache vs đường ngang khi có cache.",
    "wfAuditTag": "Kiểm toán ngữ cảnh",
    "wfAuditDesc": "Di chuyển chuột qua các lượt T1–T8 để so sánh chi phí lãng phí không cache với hiệu quả của cache.",
    "wfYield": "85% Tổng hiệu suất phiên",
    "wfUncached": "Không cache (Tăng bậc hai)",
    "wfCached": "Có Prompt Caching (Tăng nhẹ tuyến tính)",
    "wfSavings": "85% Tiết kiệm cuối cùng",
    "uncached": "Không cache:",
    "cached": "Đã lưu cache:",
    "inContext": "trong ngữ cảnh",
    "savedMsg": "Tiết kiệm {saved}$ (giảm {pct}%)",
    "tier": "Cấp độ:",
    "hdBaseline": "0% Chuẩn",
    "parity": "Ngang bằng (0%)",
    "exactParity": "Ngang bằng tuyệt đối",
    "totalSpend": "Tổng chi tiêu theo lô",
    "tokenDist": "Phân bổ token",
    "catCount": "4 danh mục",
    "sessionPct": "chi tiêu phiên",
    "tokensAll": "100% lượng token"
  }
};

  function getTarget(target) {
    return typeof target === 'string' ? document.querySelector(target) : target;
  }

  function resolveLang(target, options = {}) {
    if (options.lang && I18N[options.lang]) return options.lang;
    const el = getTarget(target);
    if (el && el.closest) {
      const elWithLang = el.closest('[lang]');
      if (elWithLang) {
        const code = (elWithLang.getAttribute('lang') || '').toLowerCase().split('-')[0];
        if (I18N[code]) return code;
      }
    }
    if (typeof document !== 'undefined' && document.documentElement && document.documentElement.lang) {
      const code = (document.documentElement.lang || '').toLowerCase().split('-')[0];
      if (I18N[code]) return code;
    }
    return 'en';
  }

  function resolveText(val, lang, fallback) {
    if (val === undefined || val === null || val === '') return fallback;
    if (typeof val === 'string') return val;
    if (typeof val === 'object') {
      return val[lang] || val['en'] || fallback;
    }
    return fallback;
  }

  function t(dict, key, params = {}) {
    let str = (dict && dict[key]) || (I18N.en && I18N.en[key]) || key;
    if (typeof str === 'string') {
      Object.keys(params).forEach(k => {
        str = str.replace(new RegExp('\\{' + k + '\\}', 'g'), params[k]);
      });
    }
    return str;
  }

  // ==========================================
    // ==========================================
    function calcNiceStep(max, targetTicks = 5) {
    const roughStep = max / targetTicks;
    const mag = Math.pow(10, Math.floor(Math.log10(roughStep)));
    const fraction = roughStep / mag;
    let niceFraction;
    if (fraction <= 1.5) niceFraction = 1;
    else if (fraction <= 3) niceFraction = 2;
    else if (fraction <= 7) niceFraction = 5;
    else niceFraction = 10;
    return niceFraction * mag;
  }

  // ==========================================
  // 1. GROUPED BAR CHART: Direct vs Cloud Parity
  // ==========================================
  function groupedBar(target, options = {}) {
    const container = getTarget(target);
    if (!container) return;

    const lang = resolveLang(container, options);
    const dict = I18N[lang] || I18N.en;
    const isRtl = lang === 'ar';

    const data = options.data || [
      { model: "GPT-5.4 Std", directIn: 2.50, directOut: 15.00, azureIn: 2.50, azureOut: 15.00, note: "Full Parity: Azure Global matches Direct OpenAI list exactly." },
      { model: "GPT-5.4 >272K", directIn: 3.50, directOut: 18.00, azureIn: 5.00, azureOut: 22.50, note: "Azure Long-Context Markup: +43% on input, +25% on output." },
      { model: "GPT-5.4 Pro", directIn: 25.00, directOut: 150.00, azureIn: 30.00, azureOut: 180.00, note: "Premium Tier: Azure adds 20% surcharge across input and output." },
      { model: "o3-mini Fast", directIn: 1.10, directOut: 4.40, azureIn: 1.10, azureOut: 4.40, note: "Reasoning Parity: Identical pricing across both direct and Azure endpoints." }
    ];

    const title = resolveText(options.title, lang, t(dict, 'gbTitle'));
    const subtitle = resolveText(options.subtitle, lang, t(dict, 'gbSubtitle'));

    container.innerHTML = `
      <div class="finops-chart-card" dir="${isRtl ? 'rtl' : 'ltr'}" style="position:relative;background:${BRAND.cardBg};border:1px solid ${BRAND.border};border-radius:10px;padding:18px 20px;margin:24px 0;font-family:Inter,system-ui,sans-serif;box-shadow:0 10px 30px -10px rgba(0,0,0,0.5);">
        
        <!-- Header -->
        <div style="margin-bottom:12px;text-align:${isRtl ? 'right' : 'left'};">
          <h3 style="margin:0;font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:${BRAND.textWhite};letter-spacing:-0.01em;">${title}</h3>
          <p style="margin:3px 0 0;font-size:12px;color:${BRAND.textMuted};">${subtitle}</p>
        </div>

        <!-- Dedicated Non-Obstructing Telemetry Readout Deck -->
        <div class="finops-readout" dir="${isRtl ? 'rtl' : 'ltr'}" style="min-height:48px;background:${BRAND.wellBg};border:1px solid ${BRAND.border};border-radius:8px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;transition:all 0.15s ease;">
          <div class="readout-main" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <span class="readout-tag" style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:${BRAND.crosshair};background:${BRAND.cardBg};padding:2px 8px;border-radius:4px;border:1px solid #2B3D5B;">${t(dict, 'gbSummaryTag')}</span>
            <span class="readout-text" style="font-size:12px;color:${BRAND.textMain};">${t(dict, 'gbSummaryDesc')}</span>
          </div>
          <div class="readout-delta" style="font-family:'JetBrains Mono',monospace;font-size:11.5px;color:${BRAND.savingsMint};font-weight:600;">${t(dict, 'gbDelta')}</div>
        </div>

        <!-- Unobstructed SVG Stage -->
        <div class="finops-stage" dir="ltr" style="position:relative;width:100%;overflow-x:auto;"></div>

        <!-- Legend -->
        <div dir="${isRtl ? 'rtl' : 'ltr'}" style="padding-top:12px;margin-top:10px;border-top:1px solid ${BRAND.border};display:flex;align-items:center;flex-wrap:wrap;gap:14px;font-size:12px;color:${BRAND.textMuted};justify-content:${isRtl ? 'flex-end' : 'flex-start'};">
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:${BRAND.tokenSky};"></span> ${t(dict, 'directIn')}</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:${BRAND.tokenBlue};"></span> ${t(dict, 'cloudIn')}</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:${BRAND.outputViolet};"></span> ${t(dict, 'directOut')}</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:${BRAND.outputPurple};"></span> ${t(dict, 'cloudOut')}</span>
        </div>
      </div>
    `;

    const card = container.querySelector('.finops-chart-card');
    const stage = card.querySelector('.finops-stage');
    const readoutMain = card.querySelector('.readout-main');
    const readoutDelta = card.querySelector('.readout-delta');

    const width = 740, height = 240;
    const padding = { top: 15, right: 25, bottom: 35, left: 55 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;
    const maxVal = options.maxVal || 200;

    const groupWidth = chartW / data.length;
    const barW = 16, gap = 4;

    const stepY = calcNiceStep(maxVal, 4);
    let svg = '';
    for (let v = 0; v <= maxVal; v += stepY) {
      const y = padding.top + chartH - (v / maxVal) * chartH;
      svg += `
        <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="${BRAND.border}" stroke-dasharray="3,3" />
        <text x="${padding.left - 8}" y="${y + 4}" fill="${BRAND.textDim}" font-size="11" font-family="'JetBrains Mono', monospace" text-anchor="end">$${v}</text>
      `;
    }

    data.forEach((d, i) => {
      const gx = padding.left + i * groupWidth + (groupWidth - (barW * 4 + gap * 3)) / 2;
      const groupLeft = padding.left + i * groupWidth;
      const series = [
        { label: t(dict, 'directIn'), val: d.directIn, color: BRAND.tokenSky },
        { label: t(dict, 'cloudIn'), val: d.azureIn, color: BRAND.tokenBlue },
        { label: t(dict, 'directOut'), val: d.directOut, color: BRAND.outputViolet },
        { label: t(dict, 'cloudOut'), val: d.azureOut, color: BRAND.outputPurple }
      ];

      svg += `
        <g id="gb-g-${i}">
          <rect id="gb-band-${i}" x="${groupLeft + 4}" y="${padding.top}" width="${groupWidth - 8}" height="${chartH}" rx="6" fill="transparent" style="transition:all 0.2s ease;" />
      `;

      series.forEach((s, si) => {
        const bx = gx + si * (barW + gap);
        const bh = (s.val / maxVal) * chartH;
        const by = padding.top + chartH - bh;
        svg += `<rect id="gb-bar-${i}-${si}" x="${bx}" y="${by}" width="${barW}" height="${bh}" rx="2" fill="${s.color}" style="transition:all 0.2s ease; cursor:pointer;" />`;
      });

      svg += `
          <text id="gb-lbl-${i}" x="${gx + (barW * 4 + gap * 3) / 2}" y="${height - 10}" fill="${BRAND.textMuted}" font-size="11.5" font-weight="600" text-anchor="middle" style="transition:all 0.15s ease;">${d.model}</text>
        </g>
        <rect x="${groupLeft}" y="${padding.top}" width="${groupWidth}" height="${chartH + 25}" fill="transparent" style="cursor:pointer;" data-gb-group="${i}" />
      `;
    });

    stage.innerHTML = `<svg viewBox="0 0 ${width} ${height}" style="width:100%;height:auto;overflow:visible;user-select:none;">${svg}</svg>`;

    const defaultMain = readoutMain.innerHTML;
    const defaultDelta = readoutDelta.innerHTML;

    stage.querySelectorAll('[data-gb-group]').forEach(hitbox => {
      const i = parseInt(hitbox.getAttribute('data-gb-group'), 10);
      const d = data[i];
      if (!d) return;
      const band = stage.querySelector('#gb-band-' + i);
      const lbl = stage.querySelector('#gb-lbl-' + i);
      const bars = [0, 1, 2, 3].map(si => stage.querySelector('#gb-bar-' + i + '-' + si));

      hitbox.addEventListener('mouseenter', () => {
        if (band) { band.setAttribute('fill', 'rgba(122, 175, 255, 0.08)'); band.setAttribute('stroke', '#2B3D5B'); }
        if (lbl) { lbl.setAttribute('fill', BRAND.crosshair); lbl.setAttribute('font-weight', '700'); }
        bars.forEach(b => { if (b) b.style.filter = 'brightness(1.3) drop-shadow(0 2px 8px rgba(122,175,255,0.35))'; });

        const inDelta = d.azureIn - d.directIn;
        const outDelta = d.azureOut - d.directOut;
        const inBadge = inDelta === 0 ? `<span style="color:${BRAND.savingsMint};font-weight:700;">${t(dict, 'parity')}</span>` : `<span style="color:${BRAND.burnOrange};font-weight:700;">+${Math.round((inDelta/d.directIn)*100)}%</span>`;
        const outBadge = outDelta === 0 ? `<span style="color:${BRAND.savingsMint};font-weight:700;">${t(dict, 'parity')}</span>` : `<span style="color:${BRAND.burnOrange};font-weight:700;">+${Math.round((outDelta/d.directOut)*100)}%</span>`;

        readoutMain.innerHTML = `
          <span style="font-family:'JetBrains Mono',monospace;font-size:11.5px;font-weight:700;color:#FFFFFF;background:${BRAND.wellBg};padding:2px 8px;border-radius:4px;border:1px solid ${BRAND.crosshair};">${d.model}</span>
          <div style="display:flex;align-items:center;gap:12px;font-size:12px;font-family:'JetBrains Mono',monospace;">
            <span><strong style="color:${BRAND.tokenSky}">${t(dict, 'directIn')}:</strong> $${d.directIn.toFixed(2)} | <strong style="color:${BRAND.tokenBlue}">${t(dict, 'cloudIn')}:</strong> $${d.azureIn.toFixed(2)} (${inBadge})</span>
            <span style="color:${BRAND.border}">|</span>
            <span><strong style="color:${BRAND.outputViolet}">${t(dict, 'directOut')}:</strong> $${d.directOut.toFixed(2)} | <strong style="color:${BRAND.outputPurple}">${t(dict, 'cloudOut')}:</strong> $${d.azureOut.toFixed(2)} (${outBadge})</span>
          </div>
        `;
        const noteText = resolveText(d.note, lang, d.note || '');
        readoutDelta.innerHTML = `<span style="color:${BRAND.textMuted};font-style:italic;font-size:11px;">${noteText}</span>`;
      });

      hitbox.addEventListener('mouseleave', () => {
        if (band) { band.setAttribute('fill', 'transparent'); band.removeAttribute('stroke'); }
        if (lbl) { lbl.setAttribute('fill', BRAND.textMuted); lbl.setAttribute('font-weight', '600'); }
        bars.forEach(b => { if (b) b.style.filter = 'none'; });
        readoutMain.innerHTML = defaultMain;
        readoutDelta.innerHTML = defaultDelta;
      });
    });
  }


  // ==========================================
  // 2. BREAK-EVEN LINE CHART: Dynamic Crossover
  // ==========================================
  function breakEven(target, options = {}) {
    const container = getTarget(target);
    if (!container) return;

    const lang = resolveLang(container, options);
    const dict = I18N[lang] || I18N.en;
    const isRtl = lang === 'ar';

    const ptuFixed = options.ptuFixed || 7440;
    const onDemandRate = options.onDemandRate || 10.0;
    const ptuMarginal = options.ptuMarginal || 1.5;

    const breakEvenTokens = (ptuFixed / (onDemandRate - ptuMarginal)).toFixed(1);
    const breakEvenCost = (breakEvenTokens * onDemandRate).toFixed(0);

    // Dynamic auto-scale to ensure crossover is always centered with clean bounds
    const defaultMaxX = Math.max(100, Math.ceil((breakEvenTokens * 1.6) / 200) * 200);
    const maxX = options.maxX || defaultMaxX;
    const maxY = options.maxY || Math.ceil((maxX * onDemandRate * 1.15) / 1000) * 1000;

    const title = resolveText(options.title, lang, t(dict, 'beTitle'));
    const subtitle = resolveText(options.subtitle, lang, t(dict, 'beSubtitle'));

    const tagText = t(dict, 'beTag', { tokens: breakEvenTokens });
    const descText = t(dict, 'beDesc', { base: '$' + ptuFixed, marginal: '$' + ptuMarginal.toFixed(2), paygo: '$' + onDemandRate.toFixed(2) });
    const spendIdenticalText = t(dict, 'beSpendIdentical', { cost: breakEvenCost });

    container.innerHTML = `
      <div class="finops-chart-card" dir="${isRtl ? 'rtl' : 'ltr'}" style="position:relative;background:${BRAND.cardBg};border:1px solid ${BRAND.border};border-radius:10px;padding:18px 20px;margin:24px 0;font-family:Inter,system-ui,sans-serif;box-shadow:0 10px 30px -10px rgba(0,0,0,0.5);">
        
        <!-- Header -->
        <div style="margin-bottom:12px;text-align:${isRtl ? 'right' : 'left'};">
          <h3 style="margin:0;font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:${BRAND.textWhite};letter-spacing:-0.01em;">${title}</h3>
          <p style="margin:3px 0 0;font-size:12px;color:${BRAND.textMuted};">${subtitle}</p>
        </div>

        <!-- Dedicated Non-Obstructing Telemetry Readout Deck -->
        <div class="finops-readout" dir="${isRtl ? 'rtl' : 'ltr'}" style="min-height:48px;background:${BRAND.wellBg};border:1px solid ${BRAND.border};border-radius:8px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;transition:all 0.15s ease;">
          <div class="readout-main" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <span class="readout-tag" style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:${BRAND.savingsMint};background:${BRAND.cardBg};padding:2px 8px;border-radius:4px;border:1px solid ${BRAND.savingsMint};">${tagText}</span>
            <span class="readout-text" style="font-size:12px;color:${BRAND.textMain};">${descText}</span>
          </div>
          <div class="readout-delta" style="font-family:'JetBrains Mono',monospace;font-size:11.5px;color:${BRAND.crosshair};font-weight:600;">${spendIdenticalText}</div>
        </div>

        <!-- Unobstructed SVG Stage -->
        <div class="finops-stage" dir="ltr" style="position:relative;width:100%;overflow-x:auto;"></div>

        <!-- Legend -->
        <div dir="${isRtl ? 'rtl' : 'ltr'}" style="padding-top:12px;margin-top:10px;border-top:1px solid ${BRAND.border};display:flex;align-items:center;flex-wrap:wrap;gap:14px;font-size:12px;color:${BRAND.textMuted};justify-content:${isRtl ? 'flex-end' : 'flex-start'};">
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:12px;height:2px;background:${BRAND.burnOrange};"></span> ${t(dict, 'paygoLabel')} ($${onDemandRate.toFixed(2)}/M)</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:12px;height:2px;background:${BRAND.tokenSky};"></span> ${t(dict, 'ptuLabel')} ($${ptuFixed} base + $${ptuMarginal.toFixed(2)}/M)</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:8px;height:8px;border-radius:50%;background:${BRAND.savingsMint};"></span> ${t(dict, 'beIntersection')} (~${Math.round(breakEvenTokens)}M)</span>
        </div>
      </div>
    `;

    const card = container.querySelector('.finops-chart-card');
    const stage = card.querySelector('.finops-stage');
    const readoutMain = card.querySelector('.readout-main');
    const readoutDelta = card.querySelector('.readout-delta');

    const width = 740, height = 240;
    const padding = { top: 22, right: 35, bottom: 38, left: 65 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const getCoord = (tokens) => {
      const x = padding.left + (tokens / maxX) * chartW;
      const onDemandCost = tokens * onDemandRate;
      const ptuCost = ptuFixed + tokens * ptuMarginal;
      const yOnDemand = padding.top + chartH - (onDemandCost / maxY) * chartH;
      const yPtu = padding.top + chartH - (ptuCost / maxY) * chartH;
      return { x, onDemandCost, ptuCost, yOnDemand, yPtu };
    };

    const stepY = calcNiceStep(maxY, 4);
    let svg = '';
    for (let yv = 0; yv <= maxY; yv += stepY) {
      const y = padding.top + chartH - (yv / maxY) * chartH;
      const labelY = yv >= 1000 ? '$' + (yv / 1000).toFixed(0) + 'k' : '$' + yv;
      svg += `
        <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="${BRAND.border}" stroke-dasharray="3,3" />
        <text x="${padding.left - 8}" y="${y + 4}" fill="${BRAND.textDim}" font-size="10.5" font-family="'JetBrains Mono', monospace" text-anchor="end">${labelY}</text>
      `;
    }

    const stepX = calcNiceStep(maxX, 5);
    for (let xv = 0; xv <= maxX; xv += stepX) {
      const x = padding.left + (xv / maxX) * chartW;
      const labelX = xv >= 1000 ? (xv / 1000).toFixed(1).replace('.0', '') + 'B' : xv + 'M';
      svg += `
        <line x1="${x}" y1="${padding.top}" x2="${x}" y2="${padding.top + chartH}" stroke="${BRAND.border}" stroke-dasharray="2,2" opacity="0.6" />
        <text x="${x}" y="${padding.top + chartH + 16}" fill="${BRAND.textDim}" font-size="10.5" font-family="'JetBrains Mono', monospace" text-anchor="middle">${labelX}</text>
      `;
    }

    const p0 = getCoord(0);
    const pMax = getCoord(maxX);
    const pbe = getCoord(breakEvenTokens);

    svg += `
      <polygon points="${pbe.x},${pbe.yOnDemand} ${pMax.x},${pMax.yOnDemand} ${pMax.x},${pMax.yPtu}" fill="rgba(74, 222, 128, 0.12)" />
      <line x1="${p0.x}" y1="${p0.yOnDemand}" x2="${pMax.x}" y2="${pMax.yOnDemand}" stroke="${BRAND.burnOrange}" stroke-width="2.5" stroke-linecap="round" />
      <line x1="${p0.x}" y1="${p0.yPtu}" x2="${pMax.x}" y2="${pMax.yPtu}" stroke="${BRAND.tokenSky}" stroke-width="2.5" stroke-linecap="round" />

      <line x1="${pbe.x}" y1="${padding.top}" x2="${pbe.x}" y2="${padding.top + chartH}" stroke="${BRAND.savingsMint}" stroke-width="1.5" stroke-dasharray="4,4" />
      <circle cx="${pbe.x}" cy="${pbe.yOnDemand}" r="5" fill="${BRAND.savingsMint}" stroke="${BRAND.canvasBg}" stroke-width="2" />
      <text x="${Math.max(padding.left + 50, Math.min(width - padding.right - 50, pbe.x))}" y="${padding.top - 8}" fill="${BRAND.savingsMint}" font-size="10.5" font-family="'JetBrains Mono', monospace" font-weight="700" text-anchor="middle" paint-order="stroke fill" stroke="#0A0F1A" stroke-width="3">${t(dict, 'beIntersection')} ~${breakEvenTokens}M</text>

      <g id="be-track" style="opacity:0; pointer-events:none; transition:opacity 0.15s ease;">
        <line id="be-ch" x1="0" y1="${padding.top}" x2="0" y2="${padding.top + chartH}" stroke="${BRAND.crosshair}" stroke-width="1" stroke-dasharray="3,3" />
        <line id="be-dl" x1="0" y1="0" x2="0" y2="0" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity="0.6" />
        <circle id="be-h-pay" cx="0" cy="0" r="9" fill="rgba(234, 88, 12, 0.25)" />
        <circle id="be-d-pay" cx="0" cy="0" r="5" fill="${BRAND.burnOrange}" stroke="#FFFFFF" stroke-width="2" />
        <circle id="be-h-ptu" cx="0" cy="0" r="9" fill="rgba(56, 189, 248, 0.25)" />
        <circle id="be-d-ptu" cx="0" cy="0" r="5" fill="${BRAND.tokenSky}" stroke="#FFFFFF" stroke-width="2" />
      </g>
      <rect id="be-hitbox" x="${padding.left}" y="${padding.top}" width="${chartW}" height="${chartH}" fill="transparent" style="cursor:crosshair;" />
    `;

    stage.innerHTML = `<svg id="be-svg" viewBox="0 0 ${width} ${height}" style="width:100%;height:auto;overflow:visible;user-select:none;">${svg}</svg>`;

    const hitbox = stage.querySelector('#be-hitbox');
    const track = stage.querySelector('#be-track');
    const ch = stage.querySelector('#be-ch');
    const dl = stage.querySelector('#be-dl');
    const dPay = stage.querySelector('#be-d-pay'), hPay = stage.querySelector('#be-h-pay');
    const dPtu = stage.querySelector('#be-d-ptu'), hPtu = stage.querySelector('#be-h-ptu');
    const svgEl = stage.querySelector('#be-svg');

    const defaultMain = readoutMain.innerHTML;
    const defaultDelta = readoutDelta.innerHTML;

    hitbox.addEventListener('mousemove', (e) => {
      const rect = svgEl.getBoundingClientRect();
      const svgX = ((e.clientX - rect.left) / rect.width) * width;
      const clampedX = Math.max(padding.left, Math.min(padding.left + chartW, svgX));
      const tokens = ((clampedX - padding.left) / chartW) * maxX;
      const c = getCoord(tokens);

      ch.setAttribute('x1', c.x); ch.setAttribute('x2', c.x);
      dl.setAttribute('x1', c.x); dl.setAttribute('y1', c.yOnDemand); dl.setAttribute('x2', c.x); dl.setAttribute('y2', c.yPtu);
      dPay.setAttribute('cx', c.x); dPay.setAttribute('cy', c.yOnDemand);
      hPay.setAttribute('cx', c.x); hPay.setAttribute('cy', c.yOnDemand);
      dPtu.setAttribute('cx', c.x); dPtu.setAttribute('cy', c.yPtu);
      hPtu.setAttribute('cx', c.x); hPtu.setAttribute('cy', c.yPtu);

      track.style.opacity = '1';

      const diff = Math.abs(c.onDemandCost - c.ptuCost);
      const isPtuCheaper = c.ptuCost < c.onDemandCost;
      const pct = Math.round((diff / c.onDemandCost) * 100);

      readoutMain.innerHTML = `
        <span style="font-family:'JetBrains Mono',monospace;font-size:11.5px;font-weight:700;color:#FFFFFF;background:${BRAND.wellBg};padding:2px 8px;border-radius:4px;border:1px solid ${BRAND.crosshair};">${t(dict, 'tokensPerMo', { tokens: tokens.toFixed(0) })}</span>
        <div style="display:flex;align-items:center;gap:12px;font-size:12px;font-family:'JetBrains Mono',monospace;">
          <span><strong style="color:${BRAND.burnOrange}">PayGo:</strong> $${Math.round(c.onDemandCost)}</span>
          <span style="color:${BRAND.border}">|</span>
          <span><strong style="color:${BRAND.tokenSky}">PTU:</strong> $${Math.round(c.ptuCost)}</span>
        </div>
      `;

      if (Math.abs(tokens - breakEvenTokens) < (maxX * 0.015)) {
        readoutDelta.innerHTML = `<span style="color:${BRAND.savingsMint};font-weight:700;">${t(dict, 'beExact', { cost: breakEvenCost })}</span>`;
      } else if (isPtuCheaper) {
        readoutDelta.innerHTML = `<span style="color:${BRAND.savingsMint};font-weight:700;">${t(dict, 'bePtuSaves', { delta: '$' + Math.round(diff), pct: pct })}</span>`;
      } else {
        readoutDelta.innerHTML = `<span style="color:${BRAND.warningAmber};font-weight:700;">${t(dict, 'bePaygoCheaper', { delta: '$' + Math.round(diff) })}</span>`;
      }
    });

    hitbox.addEventListener('mouseleave', () => {
      track.style.opacity = '0';
      readoutMain.innerHTML = defaultMain;
      readoutDelta.innerHTML = defaultDelta;
    });
  }


// 3. TOKEN DONUT: Session Composition
  // ==========================================
  function tokenDonut(target, options = {}) {
    const container = getTarget(target);
    if (!container) return;

    const lang = resolveLang(container, options);
    const dict = I18N[lang] || I18N.en;
    const isRtl = lang === 'ar';

    const data = options.data || [
      { label: t(dict, 'tdSystemCache'), percent: 48, cost: 24.50, tokens: "480k", color: BRAND.savingsMint, desc: "Saved 90% via prompt caching ($24.50 vs $245.00 uncached)", tip: "Prefix caching turns static instructions into negligible cost." },
      { label: t(dict, 'tdToolContext'), percent: 24, cost: 36.80, tokens: "240k", color: BRAND.tokenSky, desc: "MCP schemas & conversation history re-sent each turn", tip: "Prune unused tool schemas to recover ~15% prompt budget." },
      { label: t(dict, 'tdReasoning'), percent: 18, cost: 42.00, tokens: "180k", color: BRAND.outputViolet, desc: "Internal thinking steps (billed at high output rate)", tip: "Reasoning tokens are billed as output: cap reasoning effort in simple tasks." },
      { label: t(dict, 'tdGeneration'), percent: 10, cost: 31.20, tokens: "100k", color: BRAND.warningAmber, desc: "Final code/response returned to the developer", tip: "Output generation is the highest per-token unit rate." }
    ];

    const totalCost = options.totalCost !== undefined ? options.totalCost : data.reduce((acc, d) => acc + (Number(d.cost) || 0), 0);
    const totalTokensText = options.totalTokens || '1.0M Tokens';
    const totalSummaryText = 'Total: $' + totalCost.toFixed(2) + ' / ' + totalTokensText;

    const title = resolveText(options.title, lang, t(dict, 'tdTitle'));
    const subtitle = resolveText(options.subtitle, lang, t(dict, 'tdSubtitle'));

    const legendHtml = data.map(d => `<span style="display:flex;align-items:center;gap:6px;"><span style="width:8px;height:8px;border-radius:50%;background:${d.color};"></span> ${resolveText(d.label, lang, d.label)} (${d.percent}%)</span>`).join('');

    container.innerHTML = `
      <div class="finops-chart-card" dir="${isRtl ? 'rtl' : 'ltr'}" style="position:relative;background:${BRAND.cardBg};border:1px solid ${BRAND.border};border-radius:10px;padding:18px 20px;margin:24px 0;font-family:Inter,system-ui,sans-serif;box-shadow:0 10px 30px -10px rgba(0,0,0,0.5);">
        
        <!-- Header -->
        <div style="margin-bottom:12px;text-align:${isRtl ? 'right' : 'left'};">
          <h3 style="margin:0;font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:${BRAND.textWhite};letter-spacing:-0.01em;">${title}</h3>
          <p style="margin:3px 0 0;font-size:12px;color:${BRAND.textMuted};">${subtitle}</p>
        </div>

        <!-- Dedicated Non-Obstructing Telemetry Readout Deck -->
        <div class="finops-readout" dir="${isRtl ? 'rtl' : 'ltr'}" style="min-height:48px;background:${BRAND.wellBg};border:1px solid ${BRAND.border};border-radius:8px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;transition:all 0.15s ease;">
          <div class="readout-main" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <span class="readout-tag" style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:${BRAND.crosshair};background:${BRAND.cardBg};padding:2px 8px;border-radius:4px;border:1px solid #2B3D5B;">${t(dict, 'tdSessionSpendTag')}</span>
            <span class="readout-text" style="font-size:12px;color:${BRAND.textMain};">${t(dict, 'tdSessionSpendDesc')}</span>
          </div>
          <div class="readout-delta" style="font-family:'JetBrains Mono',monospace;font-size:11.5px;color:${BRAND.savingsMint};font-weight:600;">${totalSummaryText}</div>
        </div>

        <!-- Unobstructed Donut + Side Panel Layout -->
        <div class="finops-stage" dir="ltr" style="position:relative;width:100%;"></div>

        <!-- Legend -->
        <div dir="${isRtl ? 'rtl' : 'ltr'}" style="padding-top:12px;margin-top:10px;border-top:1px solid ${BRAND.border};display:flex;align-items:center;flex-wrap:wrap;gap:14px;font-size:12px;color:${BRAND.textMuted};justify-content:${isRtl ? 'flex-end' : 'flex-start'};">
          ${legendHtml}
        </div>
      </div>
    `;

    const card = container.querySelector('.finops-chart-card');
    const stage = card.querySelector('.finops-stage');
    const readoutMain = card.querySelector('.readout-main');
    const readoutDelta = card.querySelector('.readout-delta');

    const cx = 180, cy = 120, r = 90, innerR = 56;
    let startAngle = 0, slicesSvg = '';

    data.forEach((d, i) => {
      const sliceAngle = (d.percent / 100) * 360;
      const endAngle = startAngle + sliceAngle;
      const rad1 = (startAngle - 90) * Math.PI / 180;
      const rad2 = (endAngle - 90) * Math.PI / 180;
      const x1 = cx + r * Math.cos(rad1), y1 = cy + r * Math.sin(rad1);
      const x2 = cx + r * Math.cos(rad2), y2 = cy + r * Math.sin(rad2);
      const ix1 = cx + innerR * Math.cos(rad2), iy1 = cy + innerR * Math.sin(rad2);
      const ix2 = cx + innerR * Math.cos(rad1), iy2 = cy + innerR * Math.sin(rad1);
      const largeArc = sliceAngle > 180 ? 1 : 0;
      const pathData = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix2} ${iy2} Z`;

      slicesSvg += `<path id="d-slice-${i}" d="${pathData}" fill="${d.color}" stroke="${BRAND.canvasBg}" stroke-width="2.5" style="transition:all 0.2s ease; cursor:pointer;" data-donut="${i}" />`;
      startAngle = endAngle;
    });

    let listHtml = '';
    data.forEach((d, i) => {
      const labelText = resolveText(d.label, lang, d.label);
      listHtml += `
        <div id="d-row-${i}" style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border-radius:6px;border:1px solid transparent;transition:all 0.15s ease;cursor:pointer;" data-donut="${i}">
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="width:10px;height:10px;border-radius:50%;background:${d.color};"></span>
            <div>
              <div style="font-size:12px;color:#FFFFFF;font-weight:500;">${labelText}</div>
              <div style="font-size:10px;color:${BRAND.textMuted};font-family:'JetBrains Mono',monospace;">${d.tokens} ${t(dict, 'tokens')}</div>
            </div>
          </div>
          <div style="text-align:right;">
            <span style="font-size:12px;font-weight:700;font-family:'JetBrains Mono',monospace;color:#FFFFFF;">${d.percent}%</span>
            <div style="font-size:11px;font-weight:600;font-family:'JetBrains Mono',monospace;color:${BRAND.crosshair};">$${d.cost.toFixed(2)}</div>
          </div>
        </div>
      `;
    });

    stage.innerHTML = `
      <div style="width:100%;display:flex;flex-direction:row;align-items:center;justify-content:space-around;gap:24px;flex-wrap:wrap;">
        <svg viewBox="0 0 360 240" style="width:260px;height:auto;overflow:visible;user-select:none;">
          ${slicesSvg}
          <circle cx="${cx}" cy="${cy}" r="${innerR - 2}" fill="${BRAND.cardBg}" />
          <text id="d-cost" x="${cx}" y="${cy - 6}" fill="${BRAND.crosshair}" font-size="20" font-weight="700" font-family="'JetBrains Mono', monospace" text-anchor="middle">$${totalCost.toFixed(2)}</text>
          <text id="d-sub" x="${cx}" y="${cy + 12}" fill="${BRAND.textMuted}" font-size="11" text-anchor="middle">${t(dict, 'totalSpend')}</text>
          <text id="d-pct" x="${cx}" y="${cy + 26}" fill="${BRAND.textDim}" font-size="10" font-family="'JetBrains Mono', monospace" text-anchor="middle">${t(dict, 'tokensAll')}</text>
        </svg>
        <div style="flex:1;max-width:380px;min-width:260px;background:${BRAND.wellBg};padding:12px;border-radius:8px;border:1px solid ${BRAND.border};">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;padding:0 4px;">
            <h4 style="margin:0;font-size:11px;font-weight:600;color:${BRAND.crosshair};text-transform:uppercase;letter-spacing:0.05em;">${t(dict, 'tokenDist')}</h4>
            <span style="font-size:11px;font-family:'JetBrains Mono',monospace;color:${BRAND.textMuted};">${data.length} ${dict.catCount ? dict.catCount.replace(/^\d+\s*/, '') : 'Categories'}</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:4px;">${listHtml}</div>
        </div>
      </div>
    `;

    const costEl = stage.querySelector('#d-cost');
    const subEl = stage.querySelector('#d-sub');
    const pctEl = stage.querySelector('#d-pct');
    const defaultMain = readoutMain.innerHTML;
    const defaultDelta = readoutDelta.innerHTML;

    const activateSlice = (idx, active) => {
      const d = data[idx];
      if (!d) return;
      const slice = stage.querySelector('#d-slice-' + idx);
      const row = stage.querySelector('#d-row-' + idx);
      const labelText = resolveText(d.label, lang, d.label);

      if (active) {
        if (slice) {
          slice.setAttribute('stroke', '#FFFFFF');
          slice.setAttribute('stroke-width', '4');
          slice.style.filter = `brightness(1.25) drop-shadow(0 0 10px ${d.color}88)`;
        }
        if (row) {
          row.style.background = '#182337';
          row.style.borderColor = 'rgba(122, 175, 255, 0.4)';
          row.style.transform = 'translateX(4px)';
        }
        data.forEach((_, oi) => {
          if (oi !== idx) {
            const os = stage.querySelector(`#d-slice-${oi}`);
            const or = stage.querySelector(`#d-row-${oi}`);
            if (os) os.style.opacity = '0.35';
            if (or) or.style.opacity = '0.35';
          }
        });
        if (costEl) { costEl.innerText = `$${d.cost.toFixed(2)}`; costEl.setAttribute('fill', d.color); }
        if (subEl) { subEl.innerText = labelText; subEl.setAttribute('fill', '#FFFFFF'); }
        if (pctEl) { pctEl.innerText = `${d.percent}% ${t(dict, 'sessionPct')}`; pctEl.setAttribute('fill', d.color); }

        readoutMain.innerHTML = `
          <span style="font-family:'JetBrains Mono',monospace;font-size:11.5px;font-weight:700;color:#FFFFFF;background:${BRAND.wellBg};padding:2px 8px;border-radius:4px;border:1px solid ${d.color};">${labelText}</span>
          <div style="display:flex;align-items:center;gap:12px;font-size:12px;font-family:'JetBrains Mono',monospace;">
            <span><strong style="color:${d.color}">${t(dict, 'cost')}</strong> $${d.cost.toFixed(2)} (${d.percent}% ${t(dict, 'share')})</span>
            <span style="color:${BRAND.border}">|</span>
            <span><strong style="color:#FFFFFF">${t(dict, 'tokens')}</strong> ${d.tokens}</span>
          </div>
        `;
        const tipText = resolveText(d.tip, lang, d.tip || '');
        readoutDelta.innerHTML = `<span style="color:${BRAND.savingsMint};font-weight:600;font-size:11px;">${tipText}</span>`;
      } else {
        if (slice) {
          slice.setAttribute('stroke', BRAND.canvasBg);
          slice.setAttribute('stroke-width', '2.5');
          slice.style.filter = 'none';
        }
        if (row) {
          row.style.background = 'transparent';
          row.style.borderColor = 'transparent';
          row.style.transform = 'none';
        }
        data.forEach((_, oi) => {
          const os = stage.querySelector(`#d-slice-${oi}`);
          const or = stage.querySelector(`#d-row-${oi}`);
          if (os) os.style.opacity = '1';
          if (or) or.style.opacity = '1';
        });
        if (costEl) { costEl.innerText = '$' + totalCost.toFixed(2); costEl.setAttribute('fill', BRAND.crosshair); }
        if (subEl) { subEl.innerText = t(dict, 'totalSpend'); subEl.setAttribute('fill', BRAND.textMuted); }
        if (pctEl) { pctEl.innerText = t(dict, 'tokensAll'); pctEl.setAttribute('fill', BRAND.textDim); }
        readoutMain.innerHTML = defaultMain;
        readoutDelta.innerHTML = defaultDelta;
      }
    };

    stage.querySelectorAll('[data-donut]').forEach(el => {
      const idx = parseInt(el.getAttribute('data-donut'), 10);
      el.addEventListener('mouseenter', () => activateSlice(idx, true));
      el.addEventListener('mouseleave', () => activateSlice(idx, false));
    });
  }

  // ==========================================
    // ==========================================
    // ==========================================
  // 4. HORIZONTAL DELTA / MARKUP BAR
  // ==========================================
  function horizontalDelta(target, options = {}) {
    const container = getTarget(target);
    if (!container) return;

    const lang = resolveLang(container, options);
    const dict = I18N[lang] || I18N.en;
    const isRtl = lang === 'ar';

    const data = options.data || [
      { deployment: "Azure Global (Standard)", delta: 0, tag: t(dict, 'exactParity'), baseline: 25.00, current: 25.00, color: BRAND.savingsMint, tier: "Standard Global", note: "Matches Direct OpenAI list exactly. No data residency guarantee." },
      { deployment: "Azure Data Zone (EU/US)", delta: 12, tag: "+12%", baseline: 25.00, current: 28.00, color: BRAND.tokenSky, tier: "Geographical Boundary", note: "Guaranteed processing boundaries within EU or US jurisdiction." },
      { deployment: "Azure Single-Region (Sweden)", delta: 18, tag: "+18%", baseline: 25.00, current: 29.50, color: BRAND.warningAmber, tier: "Pinned Physical Region", note: "Pinned physical DC for national compliance & statutory audits." },
      { deployment: "Azure FedRAMP / Gov", delta: 35, tag: "+35%", baseline: 25.00, current: 33.75, color: BRAND.burnOrange, tier: "High Sovereign Cloud", note: "Isolated sovereign government enclave with dedicated clearance." },
      { deployment: "OpenAI Direct (PayGo)", delta: 0, tag: t(dict, 'hdBaseline'), baseline: 25.00, current: 25.00, color: BRAND.textDim, tier: "Direct API Standard", note: "Reference standard benchmark rate (Global multi-tenant)." }
    ];

    const title = resolveText(options.title, lang, t(dict, 'hdTitle'));
    const subtitle = resolveText(options.subtitle, lang, t(dict, 'hdSubtitle'));

    container.innerHTML = `
      <div class="finops-chart-card" dir="${isRtl ? 'rtl' : 'ltr'}" style="position:relative;background:${BRAND.cardBg};border:1px solid ${BRAND.border};border-radius:10px;padding:18px 20px;margin:24px 0;font-family:Inter,system-ui,sans-serif;box-shadow:0 10px 30px -10px rgba(0,0,0,0.5);">
        
        <!-- Header -->
        <div style="margin-bottom:12px;text-align:${isRtl ? 'right' : 'left'};">
          <h3 style="margin:0;font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:${BRAND.textWhite};letter-spacing:-0.01em;">${title}</h3>
          <p style="margin:3px 0 0;font-size:12px;color:${BRAND.textMuted};">${subtitle}</p>
        </div>

        <!-- Dedicated Non-Obstructing Telemetry Readout Deck -->
        <div class="finops-readout" dir="${isRtl ? 'rtl' : 'ltr'}" style="min-height:48px;background:${BRAND.wellBg};border:1px solid ${BRAND.border};border-radius:8px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;transition:all 0.15s ease;">
          <div class="readout-main" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <span class="readout-tag" style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:${BRAND.crosshair};background:${BRAND.cardBg};padding:2px 8px;border-radius:4px;border:1px solid #2B3D5B;">${t(dict, 'hdBenchmarkTag')}</span>
            <span class="readout-text" style="font-size:12px;color:${BRAND.textMain};">${t(dict, 'hdBenchmarkDesc')}</span>
          </div>
          <div class="readout-delta" style="font-family:'JetBrains Mono',monospace;font-size:11.5px;color:${BRAND.savingsMint};font-weight:600;">${t(dict, 'hdBaselineRef')}</div>
        </div>

        <!-- Unobstructed SVG Stage -->
        <div class="finops-stage" dir="ltr" style="position:relative;width:100%;overflow-x:auto;"></div>

        <!-- Legend -->
        <div dir="${isRtl ? 'rtl' : 'ltr'}" style="padding-top:12px;margin-top:10px;border-top:1px solid ${BRAND.border};display:flex;align-items:center;flex-wrap:wrap;gap:14px;font-size:12px;color:${BRAND.textMuted};justify-content:${isRtl ? 'flex-end' : 'flex-start'};">
          ${data.map(d => `<span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:${d.color};"></span> ${resolveText(d.tag, lang, d.tag)}</span>`).join('')}
        </div>
      </div>
    `;

    const card = container.querySelector('.finops-chart-card');
    const stage = card.querySelector('.finops-stage');
    const readoutMain = card.querySelector('.readout-main');
    const readoutDelta = card.querySelector('.readout-delta');

    const width = 740, height = 240;
    const padding = { top: 20, right: 80, bottom: 20, left: 235 };
    const chartW = width - padding.left - padding.right;
    const rowHeight = 40;

    let svg = `
      <line id="delta-baseline" x1="${padding.left}" y1="${padding.top - 6}" x2="${padding.left}" y2="${padding.top + data.length * rowHeight}" stroke="${BRAND.crosshair}" stroke-width="2" stroke-dasharray="4,4" />
      <text x="${padding.left}" y="${padding.top - 10}" fill="${BRAND.crosshair}" font-size="10" font-family="'JetBrains Mono', monospace" text-anchor="middle">${t(dict, 'hdBaseline')}</text>
    `;

    data.forEach((d, i) => {
      const y = padding.top + i * rowHeight + 5;
      const barLen = Math.max(4, (d.delta / 40) * chartW);
      const depName = resolveText(d.deployment, lang, d.deployment);
      const tagText = resolveText(d.tag, lang, d.tag);

      svg += `
        <g id="delta-g-${i}">
          <rect id="delta-band-${i}" x="10" y="${y - 4}" width="${width - 20}" height="${rowHeight - 6}" rx="5" fill="transparent" style="transition:all 0.15s ease;" />
          <text id="delta-label-${i}" x="${padding.left - 14}" y="${y + 16}" fill="${BRAND.textMain}" font-size="11.5" font-weight="500" text-anchor="end" style="transition:all 0.15s ease;">${depName}</text>
          <rect id="delta-bar-${i}" x="${padding.left}" y="${y}" width="${barLen}" height="22" rx="3" fill="${d.color}" style="transition:all 0.2s ease; cursor:pointer;" />
          <line id="delta-conn-${i}" x1="${padding.left}" y1="${y + 11}" x2="${padding.left + barLen}" y2="${y + 11}" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="2,2" opacity="0" style="transition:all 0.15s ease;" />
          <text x="${padding.left + barLen + 8}" y="${y + 15}" fill="${d.color}" font-size="11" font-family="'JetBrains Mono', monospace" font-weight="700">${tagText}</text>
        </g>
        <rect x="0" y="${y - 4}" width="${width}" height="${rowHeight - 6}" fill="transparent" style="cursor:pointer;" data-delta="${i}" />
      `;
    });

    stage.innerHTML = `<svg viewBox="0 0 ${width} ${height}" style="width:100%;height:auto;overflow:visible;user-select:none;">${svg}</svg>`;

    const defaultMain = readoutMain.innerHTML;
    const defaultDelta = readoutDelta.innerHTML;

    stage.querySelectorAll('[data-delta]').forEach(el => {
      const i = parseInt(el.getAttribute('data-delta'), 10);
      const d = data[i];
      if (!d) return;
      const band = stage.querySelector('#delta-band-' + i);
      const bar = stage.querySelector('#delta-bar-' + i);
      const label = stage.querySelector('#delta-label-' + i);
      const conn = stage.querySelector('#delta-conn-' + i);
      const depName = resolveText(d.deployment, lang, d.deployment);
      const tagText = resolveText(d.tag, lang, d.tag);
      const tierText = resolveText(d.tier, lang, d.tier || '');

      el.addEventListener('mouseenter', () => {
        if (band) { band.setAttribute('fill', 'rgba(122, 175, 255, 0.08)'); band.setAttribute('stroke', '#2B3D5B'); }
        if (bar) bar.style.filter = 'brightness(1.35) drop-shadow(0 0 10px rgba(122,175,255,0.4))';
        if (label) { label.setAttribute('fill', BRAND.crosshair); label.setAttribute('font-weight', '700'); }
        if (conn) conn.setAttribute('opacity', '0.8');

        const markup = d.current - d.baseline;
        const markupBadge = markup === 0 ? `<span style="color:${BRAND.savingsMint};font-weight:700;">${t(dict, 'exactParity')}</span>` : `<span style="color:${BRAND.burnOrange};font-weight:700;">+$${markup.toFixed(2)} (${tagText})</span>`;

        readoutMain.innerHTML = `
          <span style="font-family:'JetBrains Mono',monospace;font-size:11.5px;font-weight:700;color:#FFFFFF;background:${BRAND.wellBg};padding:2px 8px;border-radius:4px;border:1px solid ${d.color};">${depName}</span>
          <div style="display:flex;align-items:center;gap:12px;font-size:12px;font-family:'JetBrains Mono',monospace;">
            <span><strong style="color:${BRAND.textMuted}">${t(dict, 'tier')}</strong> ${tierText}</span>
            <span style="color:${BRAND.border}">|</span>
            <span><strong style="color:${d.color}">${t(dict, 'normCost')}</strong> $${d.current.toFixed(2)} (${markupBadge})</span>
          </div>
        `;
        const noteText = resolveText(d.note, lang, d.note || '');
        readoutDelta.innerHTML = `<span style="color:${BRAND.textMuted};font-style:italic;font-size:11px;">${noteText}</span>`;
      });

      el.addEventListener('mouseleave', () => {
        if (band) { band.setAttribute('fill', 'transparent'); band.removeAttribute('stroke'); }
        if (bar) bar.style.filter = 'none';
        if (label) { label.setAttribute('fill', BRAND.textMain); label.setAttribute('font-weight', '500'); }
        if (conn) conn.setAttribute('opacity', '0');
        readoutMain.innerHTML = defaultMain;
        readoutDelta.innerHTML = defaultDelta;
      });
    });
  }


  // ==========================================
  // 5. CUMULATIVE CONTEXT WATERFALL
  // ==========================================
  function waterfall(target, options = {}) {
    const container = getTarget(target);
    if (!container) return;

    const lang = resolveLang(container, options);
    const dict = I18N[lang] || I18N.en;
    const isRtl = lang === 'ar';

    const turns = options.turns || [
      { turn: "T1: Initial Prompt", uncached: 0.04, cached: 0.04, tokens: "4k tokens", note: "Cold prompt: Cache write turn, identical base cost." },
      { turn: "T2: File Read", uncached: 0.12, cached: 0.05, tokens: "12k tokens", note: "File loaded into context: 80% cached." },
      { turn: "T3: Code Edit", uncached: 0.22, cached: 0.07, tokens: "22k tokens", note: "Diff review: Prefix cache avoids re-billing files." },
      { turn: "T4: Test Run", uncached: 0.35, cached: 0.09, tokens: "35k tokens", note: "Test logs appended: Prompt caching saves $0.26." },
      { turn: "T5: Debug Loop", uncached: 0.52, cached: 0.11, tokens: "52k tokens", note: "Stack traces: Uncached bill escalates quadratically." },
      { turn: "T6: Refactor", uncached: 0.74, cached: 0.14, tokens: "74k tokens", note: "Multi-file edits: 81% net cumulative discount." },
      { turn: "T7: PR Diff", uncached: 1.02, cached: 0.17, tokens: "102k tokens", note: "Full git patch context: Saved $0.85 on single turn." },
      { turn: "T8: Summary", uncached: 1.35, cached: 0.20, tokens: "135k tokens", note: "PR summary: 85% total session cost reduction." }
    ];

    const title = resolveText(options.title, lang, t(dict, 'wfTitle'));
    const subtitle = resolveText(options.subtitle, lang, t(dict, 'wfSubtitle'));

    container.innerHTML = `
      <div class="finops-chart-card" dir="${isRtl ? 'rtl' : 'ltr'}" style="position:relative;background:${BRAND.cardBg};border:1px solid ${BRAND.border};border-radius:10px;padding:18px 20px;margin:24px 0;font-family:Inter,system-ui,sans-serif;box-shadow:0 10px 30px -10px rgba(0,0,0,0.5);">
        
        <!-- Header -->
        <div style="margin-bottom:12px;text-align:${isRtl ? 'right' : 'left'};">
          <h3 style="margin:0;font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:${BRAND.textWhite};letter-spacing:-0.01em;">${title}</h3>
          <p style="margin:3px 0 0;font-size:12px;color:${BRAND.textMuted};">${subtitle}</p>
        </div>

        <!-- Dedicated Non-Obstructing Telemetry Readout Deck -->
        <div class="finops-readout" dir="${isRtl ? 'rtl' : 'ltr'}" style="min-height:48px;background:${BRAND.wellBg};border:1px solid ${BRAND.border};border-radius:8px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;transition:all 0.15s ease;">
          <div class="readout-main" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <span class="readout-tag" style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:${BRAND.savingsMint};background:${BRAND.cardBg};padding:2px 8px;border-radius:4px;border:1px solid ${BRAND.savingsMint};">${t(dict, 'wfAuditTag')}</span>
            <span class="readout-text" style="font-size:12px;color:${BRAND.textMain};">${t(dict, 'wfAuditDesc')}</span>
          </div>
          <div class="readout-delta" style="font-family:'JetBrains Mono',monospace;font-size:11.5px;color:${BRAND.savingsMint};font-weight:600;">${t(dict, 'wfYield')}</div>
        </div>

        <!-- Unobstructed SVG Stage -->
        <div class="finops-stage" dir="ltr" style="position:relative;width:100%;overflow-x:auto;"></div>

        <!-- Legend -->
        <div dir="${isRtl ? 'rtl' : 'ltr'}" style="padding-top:12px;margin-top:10px;border-top:1px solid ${BRAND.border};display:flex;align-items:center;flex-wrap:wrap;gap:14px;font-size:12px;color:${BRAND.textMuted};justify-content:${isRtl ? 'flex-end' : 'flex-start'};">
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:12px;height:2px;background:${BRAND.burnOrange};"></span> ${t(dict, 'wfUncached')}</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:12px;height:2px;background:${BRAND.savingsMint};"></span> ${t(dict, 'wfCached')}</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:8px;height:8px;border-radius:50%;background:${BRAND.savingsMint};"></span> ${t(dict, 'wfSavings')}</span>
        </div>
      </div>
    `;

    const card = container.querySelector('.finops-chart-card');
    const stage = card.querySelector('.finops-stage');
    const readoutMain = card.querySelector('.readout-main');
    const readoutDelta = card.querySelector('.readout-delta');

    const width = 740, height = 240;
    const padding = { top: 15, right: 35, bottom: 40, left: 60 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;
    const maxY = options.maxY || 1.60;

    const stepY = calcNiceStep(maxY, 4);
    let svg = '';
    for (let v = 0; v <= maxY; v += stepY) {
      const y = padding.top + chartH - (v / maxY) * chartH;
      const labelY = v >= 10 ? '$' + v.toFixed(0) : '$' + v.toFixed(2);
      svg += `
        <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="${BRAND.border}" stroke-dasharray="3,3" />
        <text x="${padding.left - 8}" y="${y + 4}" fill="${BRAND.textDim}" font-size="11" font-family="'JetBrains Mono', monospace" text-anchor="end">${labelY}</text>
      `;
    }

    let dUncached = '', dCached = '';
    let aUncached = `M ${padding.left} ${padding.top + chartH} `;
    let aCached = `M ${padding.left} ${padding.top + chartH} `;
    const points = [];

    turns.forEach((tData, i) => {
      const x = padding.left + (i / (turns.length - 1)) * chartW;
      const yUncached = padding.top + chartH - (tData.uncached / maxY) * chartH;
      const yCached = padding.top + chartH - (tData.cached / maxY) * chartH;
      points.push({ x, yUncached, yCached, turn: tData });

      if (i === 0) { dUncached += `M ${x} ${yUncached}`; dCached += `M ${x} ${yCached}`; }
      else { dUncached += ` L ${x} ${yUncached}`; dCached += ` L ${x} ${yCached}`; }
      aUncached += ` L ${x} ${yUncached}`; aCached += ` L ${x} ${yCached}`;

      svg += `<text x="${x}" y="${padding.top + chartH + 18}" fill="${BRAND.textMuted}" font-size="11" font-family="'JetBrains Mono', monospace" font-weight="500" text-anchor="middle">T${i+1}</text>`;
    });

    const lastX = padding.left + chartW, groundY = padding.top + chartH;
    aUncached += ` L ${lastX} ${groundY} Z`;
    aCached += ` L ${lastX} ${groundY} Z`;

    svg += `
      <path d="${aUncached}" fill="rgba(234, 88, 12, 0.12)" />
      <path d="${aCached}" fill="rgba(74, 222, 128, 0.22)" />
      <path d="${dUncached}" fill="none" stroke="${BRAND.burnOrange}" stroke-width="3" stroke-linecap="round" />
      <path d="${dCached}" fill="none" stroke="${BRAND.savingsMint}" stroke-width="3" stroke-linecap="round" />

      ${points.map(p => `
        <circle cx="${p.x}" cy="${p.yUncached}" r="3.5" fill="${BRAND.burnOrange}" opacity="0.7" />
        <circle cx="${p.x}" cy="${p.yCached}" r="3.5" fill="${BRAND.savingsMint}" opacity="0.7" />
      `).join('')}

      <g id="wf-track" style="opacity:0; pointer-events:none; transition:opacity 0.15s ease;">
        <line id="wf-ch" x1="0" y1="${padding.top}" x2="0" y2="${padding.top + chartH}" stroke="${BRAND.crosshair}" stroke-width="1" stroke-dasharray="3,3" />
        <line id="wf-dl" x1="0" y1="0" x2="0" y2="0" stroke="#FFFFFF" stroke-width="2" opacity="0.7" />
        <circle id="wf-h-unc" cx="0" cy="0" r="9" fill="rgba(234, 88, 12, 0.25)" />
        <circle id="wf-d-unc" cx="0" cy="0" r="5" fill="${BRAND.burnOrange}" stroke="#FFFFFF" stroke-width="2" />
        <circle id="wf-h-cch" cx="0" cy="0" r="9" fill="rgba(74, 222, 128, 0.25)" />
        <circle id="wf-d-cch" cx="0" cy="0" r="5" fill="${BRAND.savingsMint}" stroke="#FFFFFF" stroke-width="2" />
      </g>
      <rect id="wf-hitbox" x="${padding.left}" y="${padding.top}" width="${chartW}" height="${chartH}" fill="transparent" style="cursor:crosshair;" />
    `;

    stage.innerHTML = `<svg id="wf-svg" viewBox="0 0 ${width} ${height}" style="width:100%;height:auto;overflow:visible;user-select:none;">${svg}</svg>`;

    const hitbox = stage.querySelector('#wf-hitbox');
    const track = stage.querySelector('#wf-track');
    const ch = stage.querySelector('#wf-ch');
    const dl = stage.querySelector('#wf-dl');
    const dUnc = stage.querySelector('#wf-d-unc'), hUnc = stage.querySelector('#wf-h-unc');
    const dCch = stage.querySelector('#wf-d-cch'), hCch = stage.querySelector('#wf-h-cch');
    const svgEl = stage.querySelector('#wf-svg');

    const defaultMain = readoutMain.innerHTML;
    const defaultDelta = readoutDelta.innerHTML;

    hitbox.addEventListener('mousemove', (e) => {
      const rect = svgEl.getBoundingClientRect();
      const svgX = ((e.clientX - rect.left) / rect.width) * width;
      const clampedX = Math.max(padding.left, Math.min(padding.left + chartW, svgX));
      const ratio = (clampedX - padding.left) / chartW;
      const cIdx = Math.max(0, Math.min(turns.length - 1, Math.round(ratio * (turns.length - 1))));
      const p = points[cIdx];
      if (!p || !p.turn) return;
      const tData = p.turn;

      ch.setAttribute('x1', p.x); ch.setAttribute('x2', p.x);
      dl.setAttribute('x1', p.x); dl.setAttribute('y1', p.yUncached); dl.setAttribute('x2', p.x); dl.setAttribute('y2', p.yCached);
      dUnc.setAttribute('cx', p.x); dUnc.setAttribute('cy', p.yUncached);
      hUnc.setAttribute('cx', p.x); hUnc.setAttribute('cy', p.yUncached);
      dCch.setAttribute('cx', p.x); dCch.setAttribute('cy', p.yCached);
      hCch.setAttribute('cx', p.x); hCch.setAttribute('cy', p.yCached);

      track.style.opacity = '1';

      const saved = tData.uncached - tData.cached;
      const disc = Math.round((saved / tData.uncached) * 100);
      const turnName = resolveText(tData.turn, lang, tData.turn);

      readoutMain.innerHTML = `
        <span style="font-family:'JetBrains Mono',monospace;font-size:11.5px;font-weight:700;color:#FFFFFF;background:${BRAND.wellBg};padding:2px 8px;border-radius:4px;border:1px solid ${BRAND.crosshair};">${turnName}</span>
        <div style="display:flex;align-items:center;gap:12px;font-size:12px;font-family:'JetBrains Mono',monospace;">
          <span><strong style="color:${BRAND.burnOrange}">${t(dict, 'uncached')}</strong> $${tData.uncached.toFixed(2)}</span>
          <span style="color:${BRAND.border}">|</span>
          <span><strong style="color:${BRAND.savingsMint}">${t(dict, 'cached')}</strong> $${tData.cached.toFixed(2)}</span>
          <span style="color:${BRAND.border}">|</span>
          <span style="color:${BRAND.textMuted}">${tData.tokens} ${t(dict, 'inContext')}</span>
        </div>
      `;
      readoutDelta.innerHTML = `<span style="color:${BRAND.savingsMint};font-weight:700;">${t(dict, 'savedMsg', { saved: '$' + saved.toFixed(2), pct: disc })}</span>`;
    });

    hitbox.addEventListener('mouseleave', () => {
      track.style.opacity = '0';
      readoutMain.innerHTML = defaultMain;
      readoutDelta.innerHTML = defaultDelta;
    });
  }


  // ==========================================
  // 6. PARETO FRONTIER: SWE-bench Accuracy vs Cost
  // ==========================================
  function paretoFrontier(target, options = {}) {
    const container = getTarget(target);
    if (!container) return;

    const lang = resolveLang(container, options);
    const dict = I18N[lang] || I18N.en;
    const isRtl = lang === 'ar';

    // Mathematically verified non-colliding staggered label positions
    const defaultModels = [
      { name: "DeepSeek V3", cost: 0.85, acc: 71.4, color: BRAND.tokenSky, tierKey: "pfValueLeader", align: "start", dx: 10, dyName: 14, dyMeta: 26 },
      { name: "Claude 3.7 Haiku", cost: 1.25, acc: 73.2, color: BRAND.tokenSky, tierKey: "pfValueLeader", align: "start", dx: 10, dyName: -14, dyMeta: -2 },
      { name: "o3-mini Fast", cost: 1.80, acc: 81.2, color: BRAND.savingsMint, tierKey: "pfSweetSpot", align: "end", dx: -12, dyName: -8, dyMeta: 4 },
      { name: "Claude 3.7 Sonnet", cost: 4.50, acc: 86.8, color: BRAND.savingsMint, tierKey: "pfFrontierEff", align: "end", dx: -12, dyName: -10, dyMeta: 2 },
      { name: "GPT-5.4 Std", cost: 6.20, acc: 87.5, color: BRAND.outputViolet, tierKey: "pfFrontierEff", align: "start", dx: 10, dyName: 14, dyMeta: 26 },
      { name: "Claude 3.7 Opus", cost: 22.00, acc: 89.1, color: BRAND.burnOrange, tierKey: "pfDiminishing", align: "end", dx: -14, dyName: -8, dyMeta: 4 }
    ];

    const models = options.models || defaultModels;
    const title = resolveText(options.title, lang, t(dict, 'pfTitle'));
    const subtitle = resolveText(options.subtitle, lang, t(dict, 'pfSubtitle'));

    container.innerHTML = `
      <div class="finops-chart-card" dir="${isRtl ? 'rtl' : 'ltr'}" style="position:relative;background:${BRAND.cardBg};border:1px solid ${BRAND.border};border-radius:10px;padding:18px 20px;margin:24px 0;font-family:Inter,system-ui,sans-serif;box-shadow:0 10px 30px -10px rgba(0,0,0,0.5);">
        
        <!-- Header -->
        <div style="margin-bottom:12px;text-align:${isRtl ? 'right' : 'left'};">
          <h3 style="margin:0;font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:${BRAND.textWhite};letter-spacing:-0.01em;">${title}</h3>
          <p style="margin:3px 0 0;font-size:12px;color:${BRAND.textMuted};">${subtitle}</p>
        </div>

        <!-- Dedicated Non-Obstructing Readout Deck -->
        <div class="finops-readout" dir="${isRtl ? 'rtl' : 'ltr'}" style="min-height:48px;background:${BRAND.wellBg};border:1px solid ${BRAND.border};border-radius:8px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;transition:all 0.15s ease;">
          <div class="readout-main" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <span class="readout-tag" style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:${BRAND.crosshair};background:${BRAND.cardBg};padding:2px 8px;border-radius:4px;border:1px solid #2B3D5B;">${t(dict, 'pfSummaryTag')}</span>
            <span class="readout-text" style="font-size:12px;color:${BRAND.textMain};">${t(dict, 'pfSummaryDesc')}</span>
          </div>
          <div class="readout-delta" style="font-family:'JetBrains Mono',monospace;font-size:11.5px;color:${BRAND.savingsMint};font-weight:600;">${t(dict, 'pfEfficiencyTag')}</div>
        </div>

        <!-- Unobstructed SVG Stage -->
        <div class="finops-stage" dir="ltr" style="position:relative;width:100%;overflow-x:auto;"></div>

        <!-- Legend -->
        <div dir="${isRtl ? 'rtl' : 'ltr'}" style="padding-top:12px;margin-top:10px;border-top:1px solid ${BRAND.border};display:flex;align-items:center;flex-wrap:wrap;gap:14px;font-size:12px;color:${BRAND.textMuted};justify-content:${isRtl ? 'flex-end' : 'flex-start'};">
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:50%;background:${BRAND.tokenSky};"></span> ${t(dict, 'pfValueLeader')}</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:50%;background:${BRAND.savingsMint};"></span> ${t(dict, 'pfSweetSpot')}</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:50%;background:${BRAND.outputViolet};"></span> ${t(dict, 'pfFrontierEff')}</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:50%;background:${BRAND.burnOrange};"></span> ${t(dict, 'pfDiminishing')}</span>
        </div>
      </div>
    `;

    const card = container.querySelector('.finops-chart-card');
    const stage = card.querySelector('.finops-stage');
    const readoutMain = card.querySelector('.readout-main');
    const readoutDelta = card.querySelector('.readout-delta');

    const width = 740, height = 300;
    const padding = { top: 32, right: 65, bottom: 45, left: 65 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const minCost = 0.5, maxCost = 28;
    const minAcc = 65, maxAcc = 95;

    function getX(c) {
      return padding.left + (Math.log10(c / minCost) / Math.log10(maxCost / minCost)) * chartW;
    }
    function getY(a) {
      return padding.top + chartH - ((a - minAcc) / (maxAcc - minAcc)) * chartH;
    }

    let svg = `
      <!-- Grid Lines -->
      <line x1="${padding.left}" y1="${getY(70)}" x2="${padding.left + chartW}" y2="${getY(70)}" stroke="${BRAND.border}" stroke-dasharray="3,3" />
      <text x="${padding.left - 8}" y="${getY(70) + 4}" fill="${BRAND.textDim}" font-size="10" font-family="'JetBrains Mono',monospace" text-anchor="end">70%</text>

      <line x1="${padding.left}" y1="${getY(80)}" x2="${padding.left + chartW}" y2="${getY(80)}" stroke="${BRAND.border}" stroke-dasharray="3,3" />
      <text x="${padding.left - 8}" y="${getY(80) + 4}" fill="${BRAND.textDim}" font-size="10" font-family="'JetBrains Mono',monospace" text-anchor="end">80%</text>

      <line x1="${padding.left}" y1="${getY(90)}" x2="${padding.left + chartW}" y2="${getY(90)}" stroke="${BRAND.border}" stroke-dasharray="3,3" />
      <text x="${padding.left - 8}" y="${getY(90) + 4}" fill="${BRAND.textDim}" font-size="10" font-family="'JetBrains Mono',monospace" text-anchor="end">90%</text>

      <!-- Cost ticks -->
      ${[1, 2, 5, 10, 20].map(v => `
        <line x1="${getX(v)}" y1="${padding.top}" x2="${getX(v)}" y2="${padding.top + chartH}" stroke="${BRAND.border}" stroke-dasharray="2,3" opacity="0.6" />
        <text x="${getX(v)}" y="${padding.top + chartH + 16}" fill="${BRAND.textDim}" font-size="10" font-family="'JetBrains Mono',monospace" text-anchor="middle">$${v}</text>
      `).join('')}

      <!-- Axes -->
      <line x1="${padding.left}" y1="${padding.top + chartH}" x2="${padding.left + chartW}" y2="${padding.top + chartH}" stroke="${BRAND.borderHover}" stroke-width="1.5" />
      <line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${padding.top + chartH}" stroke="${BRAND.borderHover}" stroke-width="1.5" />

      <!-- Axis Labels -->
      <text x="${padding.left + chartW / 2}" y="${height - 10}" fill="${BRAND.textMuted}" font-size="11" font-family="'Inter',sans-serif" text-anchor="middle">${t(dict, 'pfCostAxis')}</text>
      <text x="${padding.left + 8}" y="${padding.top - 12}" fill="${BRAND.textMuted}" font-size="11" font-family="'Inter',sans-serif">${t(dict, 'pfAccAxis')}</text>

      <!-- Optimal Pareto Boundary Curve (cleanly positioned in open quadrant) -->
      <path d="M ${getX(0.85)} ${getY(71.4)} Q ${getX(2.2)} ${getY(83.0)} ${getX(22.0)} ${getY(89.2)}" fill="none" stroke="${BRAND.savingsMint}" stroke-width="2" stroke-dasharray="4,4" opacity="0.75" />
      <text x="${padding.left + 24}" y="${padding.top + 18}" fill="${BRAND.savingsMint}" font-size="11" font-family="'JetBrains Mono',monospace" font-weight="700" paint-order="stroke fill" stroke="#0A0F1A" stroke-width="3">${t(dict, 'pfBoundary')}</text>

      <!-- Tracking Crosshair -->
      <g id="pf-crosshair" style="opacity:0; pointer-events:none; transition:opacity 0.15s ease;">
        <line id="pf-ch-x" x1="0" y1="${padding.top}" x2="0" y2="${padding.top + chartH}" stroke="${BRAND.crosshair}" stroke-width="1" stroke-dasharray="3,3" />
        <line id="pf-ch-y" x1="${padding.left}" y1="0" x2="${padding.left + chartW}" y2="0" stroke="${BRAND.crosshair}" stroke-width="1" stroke-dasharray="3,3" />
        <circle id="pf-halo" cx="0" cy="0" r="14" fill="${BRAND.savingsMint}" fill-opacity="0.25" />
      </g>
    `;

    // Render Points with verified collision-free staggered text
    models.forEach((m, i) => {
      const cx = getX(m.cost);
      const cy = getY(m.acc);
      const anchor = m.align || 'start';
      const tx = cx + (m.dx || 10);
      const tyName = cy + (m.dyName || -4);
      const tyMeta = cy + (m.dyMeta || 8);

      svg += `
        <g class="pf-node" data-index="${i}" style="cursor:pointer;">
          <circle cx="${cx}" cy="${cy}" r="6.5" fill="${m.color}" stroke="#FFFFFF" stroke-width="1.5" />
          <text x="${tx}" y="${tyName}" fill="${BRAND.textWhite}" font-size="11" font-family="'JetBrains Mono',monospace" font-weight="700" text-anchor="${anchor}" paint-order="stroke fill" stroke="#0A0F1A" stroke-width="3.5" stroke-linejoin="round">${m.name}</text>
          <text x="${tx}" y="${tyMeta}" fill="${BRAND.textMuted}" font-size="9.5" font-family="'JetBrains Mono',monospace" font-weight="600" text-anchor="${anchor}" paint-order="stroke fill" stroke="#0A0F1A" stroke-width="3.5" stroke-linejoin="round">$${m.cost.toFixed(2)} / ${m.acc}%</text>
        </g>
      `;
    });

    stage.innerHTML = `<svg id="pf-svg" viewBox="0 0 ${width} ${height}" style="width:100%;height:auto;overflow:visible;user-select:none;">${svg}</svg>`;

    const nodes = stage.querySelectorAll('.pf-node');
    const chGroup = stage.querySelector('#pf-crosshair');
    const chX = stage.querySelector('#pf-ch-x');
    const chY = stage.querySelector('#pf-ch-y');
    const halo = stage.querySelector('#pf-halo');

    const defaultMain = readoutMain.innerHTML;
    const defaultDelta = readoutDelta.innerHTML;

    nodes.forEach(node => {
      const idx = parseInt(node.getAttribute('data-index'), 10);
      const m = models[idx];

      node.addEventListener('mouseenter', () => {
        const cx = getX(m.cost);
        const cy = getY(m.acc);

        chX.setAttribute('x1', cx); chX.setAttribute('x2', cx);
        chY.setAttribute('y1', cy); chY.setAttribute('y2', cy);
        halo.setAttribute('cx', cx); halo.setAttribute('cy', cy);
        halo.setAttribute('fill', m.color);
        chGroup.style.opacity = '1';

        const tierLabel = t(dict, m.tierKey || 'pfFrontierEff');
        const ptsPerDollar = (m.acc / m.cost).toFixed(1);

        readoutMain.innerHTML = `
          <span style="font-family:'JetBrains Mono',monospace;font-size:11.5px;font-weight:700;color:#FFFFFF;background:${BRAND.wellBg};padding:2px 8px;border-radius:4px;border:1px solid ${BRAND.crosshair};">${m.name}</span>
          <div style="display:flex;align-items:center;gap:12px;font-size:12px;font-family:'JetBrains Mono',monospace;">
            <span><strong style="color:${BRAND.savingsMint}">${t(dict, 'pfAccLabel')}</strong> ${m.acc}%</span>
            <span style="color:${BRAND.border}">|</span>
            <span><strong style="color:${BRAND.burnOrange}">${t(dict, 'pfCostLabel')}</strong> $${m.cost.toFixed(2)}</span>
            <span style="color:${BRAND.border}">|</span>
            <span style="color:${BRAND.tokenSky}"><strong style="color:${BRAND.textMuted}">${t(dict, 'pfEffScore')}</strong> ${ptsPerDollar}</span>
          </div>
        `;
        readoutDelta.innerHTML = `<span style="color:${m.color};font-weight:700;">${tierLabel}</span>`;
      });

      node.addEventListener('mouseleave', () => {
        chGroup.style.opacity = '0';
        readoutMain.innerHTML = defaultMain;
        readoutDelta.innerHTML = defaultDelta;
      });
    });
  }


  // ==========================================
  // 7. CASCADE ROUTING FUNNEL: Smart Gateway Yield
  // ==========================================
  function cascadeFunnel(target, options = {}) {
    const container = getTarget(target);
    if (!container) return;

    const lang = resolveLang(container, options);
    const dict = I18N[lang] || I18N.en;
    const isRtl = lang === 'ar';

    // 2-tier stacked architecture:
    // Line 1: Header metadata (Left: Stage Name, Right: Traffic Volume & Rate)
    // Line 2: Centered tapered funnel bar with percentage badge
    const defaultStages = [
      { key: "cfIncoming", count: "10.0M Calls", sharePct: 100, rate: "$0.00 Base", spend: "$0.00", barWidth: 540, color: BRAND.crosshair, yRow: 10 },
      { key: "cfTier1", count: "6.8M Handled", sharePct: 68, rate: "$0.15/M", spend: "$1.02", barWidth: 380, color: BRAND.tokenSky, yRow: 64 },
      { key: "cfTier2", count: "2.2M Handled", sharePct: 22, rate: "$3.00/M", spend: "$6.60", barWidth: 220, color: BRAND.outputViolet, yRow: 118 },
      { key: "cfTier3", count: "1.0M Handled", sharePct: 10, rate: "$25.00/M", spend: "$25.00", barWidth: 120, color: BRAND.burnOrange, yRow: 172 }
    ];

    const stages = options.stages || defaultStages;
    const title = resolveText(options.title, lang, t(dict, 'cfTitle'));
    const subtitle = resolveText(options.subtitle, lang, t(dict, 'cfSubtitle'));

    container.innerHTML = `
      <div class="finops-chart-card" dir="${isRtl ? 'rtl' : 'ltr'}" style="position:relative;background:${BRAND.cardBg};border:1px solid ${BRAND.border};border-radius:10px;padding:18px 20px;margin:24px 0;font-family:Inter,system-ui,sans-serif;box-shadow:0 10px 30px -10px rgba(0,0,0,0.5);">
        
        <!-- Header -->
        <div style="margin-bottom:12px;text-align:${isRtl ? 'right' : 'left'};">
          <h3 style="margin:0;font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:${BRAND.textWhite};letter-spacing:-0.01em;">${title}</h3>
          <p style="margin:3px 0 0;font-size:12px;color:${BRAND.textMuted};">${subtitle}</p>
        </div>

        <!-- Dedicated Non-Obstructing Readout Deck -->
        <div class="finops-readout" dir="${isRtl ? 'rtl' : 'ltr'}" style="min-height:48px;background:${BRAND.wellBg};border:1px solid ${BRAND.border};border-radius:8px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;transition:all 0.15s ease;">
          <div class="readout-main" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <span class="readout-tag" style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:${BRAND.tokenSky};background:${BRAND.cardBg};padding:2px 8px;border-radius:4px;border:1px solid #2B3D5B;">${t(dict, 'cfSummaryTag')}</span>
            <span class="readout-text" style="font-size:12px;color:${BRAND.textMain};">${t(dict, 'cfSummaryDesc')}</span>
          </div>
          <div class="readout-delta" style="font-family:'JetBrains Mono',monospace;font-size:11.5px;color:${BRAND.savingsMint};font-weight:600;">${t(dict, 'cfNetSavings')}</div>
        </div>

        <!-- Unobstructed SVG Stage -->
        <div class="finops-stage" dir="ltr" style="position:relative;width:100%;overflow-x:auto;"></div>

        <!-- Guidance Footer -->
        <div dir="${isRtl ? 'rtl' : 'ltr'}" style="padding-top:12px;margin-top:10px;border-top:1px solid ${BRAND.border};display:flex;align-items:center;flex-wrap:wrap;gap:14px;font-size:12px;color:${BRAND.textMuted};justify-content:${isRtl ? 'flex-end' : 'flex-start'};">
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:${BRAND.textDim};">Blended Gateway Spend: $32.62 (86.9% discount vs $250.00 flat Frontier baseline)</span>
        </div>
      </div>
    `;

    const card = container.querySelector('.finops-chart-card');
    const stage = card.querySelector('.finops-stage');
    const readoutMain = card.querySelector('.readout-main');
    const readoutDelta = card.querySelector('.readout-delta');

    const width = 740, height = 230;
    const funnelCenterX = 370;
    let svg = '';

    // Draw connecting translucent trapezoids between centered funnel stages
    for (let i = 0; i < stages.length - 1; i++) {
      const topS = stages[i];
      const btmS = stages[i + 1];
      const x1 = funnelCenterX - topS.barWidth / 2;
      const x2 = funnelCenterX + topS.barWidth / 2;
      const yTop = topS.yRow + 22 + 20;
      const x3 = funnelCenterX - btmS.barWidth / 2;
      const x4 = funnelCenterX + btmS.barWidth / 2;
      const yBtm = btmS.yRow + 22;

      svg += `
        <polygon points="${x1},${yTop} ${x2},${yTop} ${x4},${yBtm} ${x3},${yBtm}" fill="rgba(255, 255, 255, 0.04)" stroke="${BRAND.border}" stroke-width="0.75" stroke-dasharray="2,2" />
      `;
    }

    // Render each stage in 2-tier stacked lines (text line + bar line) with ZERO possible overlap
    stages.forEach((s, i) => {
      const barX = funnelCenterX - s.barWidth / 2;
      const stageName = t(dict, s.key);
      const yText = s.yRow + 14;
      const yBar = s.yRow + 22;

      svg += `
        <g class="cf-stage-group" data-index="${i}" style="cursor:pointer;">
          <!-- Line 1: Left Stage Name & Right Telemetry Metrics -->
          <text x="25" y="${yText}" fill="${BRAND.textWhite}" font-size="12" font-family="'Space Grotesk',sans-serif" font-weight="700">${stageName}</text>
          <text x="715" y="${yText}" fill="${s.color}" font-size="11.5" font-family="'JetBrains Mono',monospace" font-weight="700" text-anchor="end">${s.count} | ${s.rate}</text>

          <!-- Line 2: Centered Tapered Funnel Bar with Percentage Badge -->
          <rect class="cf-stage-bar" x="${barX}" y="${yBar}" width="${s.barWidth}" height="20" rx="4" fill="${s.color}" fill-opacity="0.88" stroke="#1E2A3F" stroke-width="1" style="transition:all 0.15s ease;" />
          <text x="${funnelCenterX}" y="${yBar + 14}" fill="#0A0F1A" font-size="10.5" font-family="'JetBrains Mono',monospace" font-weight="700" text-anchor="middle">${s.sharePct}% Volume</text>

          <!-- Transparent full-row hover hitbox -->
          <rect x="10" y="${s.yRow}" width="${width - 20}" height="48" rx="6" fill="transparent" />
        </g>
      `;
    });

    stage.innerHTML = `<svg id="cf-svg" viewBox="0 0 ${width} ${height}" style="width:100%;height:auto;overflow:visible;user-select:none;">${svg}</svg>`;

    const stageGroups = stage.querySelectorAll('.cf-stage-group');
    const defaultMain = readoutMain.innerHTML;
    const defaultDelta = readoutDelta.innerHTML;

    stageGroups.forEach(grp => {
      const idx = parseInt(grp.getAttribute('data-index'), 10);
      const s = stages[idx];
      if (!s) return;
      const bar = grp.querySelector('.cf-stage-bar');
      const stageName = t(dict, s.key);

      grp.addEventListener('mouseenter', () => {
        bar.setAttribute('fill-opacity', '1.0');
        bar.setAttribute('stroke', '#FFFFFF');
        bar.setAttribute('stroke-width', '1.5');

        readoutMain.innerHTML = `
          <span style="font-family:'JetBrains Mono',monospace;font-size:11.5px;font-weight:700;color:#FFFFFF;background:${BRAND.wellBg};padding:2px 8px;border-radius:4px;border:1px solid ${s.color};">${stageName}</span>
          <div style="display:flex;align-items:center;gap:12px;font-size:12px;font-family:'JetBrains Mono',monospace;">
            <span><strong style="color:${BRAND.textMuted}">${t(dict, 'cfVolume')}</strong> ${s.count}</span>
            <span style="color:${BRAND.border}">|</span>
            <span><strong style="color:${BRAND.tokenSky}">${t(dict, 'cfRate')}</strong> ${s.rate}</span>
            <span style="color:${BRAND.border}">|</span>
            <span><strong style="color:${BRAND.savingsMint}">${t(dict, 'cfSubtotal')}</strong> ${s.spend}</span>
          </div>
        `;
        readoutDelta.innerHTML = `<span style="color:${s.color};font-weight:700;">${t(dict, 'cfShare')} ${s.sharePct}%</span>`;
      });

      grp.addEventListener('mouseleave', () => {
        bar.setAttribute('fill-opacity', '0.88');
        bar.setAttribute('stroke', '#1E2A3F');
        bar.setAttribute('stroke-width', '1');
        readoutMain.innerHTML = defaultMain;
        readoutDelta.innerHTML = defaultDelta;
      });
    });
  }


  // ==========================================
  // 8. SAAS GROSS MARGIN EROSION METER
  // ==========================================
  function marginErosion(target, options = {}) {
    const container = getTarget(target);
    if (!container) return;

    const lang = resolveLang(container, options);
    const dict = I18N[lang] || I18N.en;
    const isRtl = lang === 'ar';

    const defaultCohorts = [
      { key: "meLight", share: "50%", cost: 4.20, color: BRAND.savingsMint, pct: 89.5, profit: 35.80, isLoss: false },
      { key: "meMedium", share: "35%", cost: 18.50, color: BRAND.tokenSky, pct: 53.7, profit: 21.50, isLoss: false },
      { key: "meHeavy", share: "10%", cost: 34.00, color: BRAND.outputViolet, pct: 15.0, profit: 6.00, isLoss: false },
      { key: "meExtreme", share: "5%", cost: 88.40, color: BRAND.burnOrange, pct: -121.0, profit: -48.40, isLoss: true }
    ];

    const cohorts = options.cohorts || defaultCohorts;
    const seatRev = options.seatRevenue || 40.00;
    const title = resolveText(options.title, lang, t(dict, 'meTitle'));
    const subtitle = resolveText(options.subtitle, lang, t(dict, 'meSubtitle'));

    container.innerHTML = `
      <div class="finops-chart-card" dir="${isRtl ? 'rtl' : 'ltr'}" style="position:relative;background:${BRAND.cardBg};border:1px solid ${BRAND.border};border-radius:10px;padding:18px 20px;margin:24px 0;font-family:Inter,system-ui,sans-serif;box-shadow:0 10px 30px -10px rgba(0,0,0,0.5);">
        
        <!-- Header -->
        <div style="margin-bottom:12px;text-align:${isRtl ? 'right' : 'left'};">
          <h3 style="margin:0;font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:${BRAND.textWhite};letter-spacing:-0.01em;">${title}</h3>
          <p style="margin:3px 0 0;font-size:12px;color:${BRAND.textMuted};">${subtitle}</p>
        </div>

        <!-- Dedicated Non-Obstructing Readout Deck -->
        <div class="finops-readout" dir="${isRtl ? 'rtl' : 'ltr'}" style="min-height:48px;background:${BRAND.wellBg};border:1px solid ${BRAND.border};border-radius:8px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;transition:all 0.15s ease;">
          <div class="readout-main" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <span class="readout-tag" style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:${BRAND.burnOrange};background:${BRAND.cardBg};padding:2px 8px;border-radius:4px;border:1px solid #2B3D5B;">${t(dict, 'meSummaryTag')}</span>
            <span class="readout-text" style="font-size:12px;color:${BRAND.textMain};">${t(dict, 'meSummaryDesc')}</span>
          </div>
          <div class="readout-delta" style="font-family:'JetBrains Mono',monospace;font-size:11.5px;color:${BRAND.burnOrange};font-weight:600;">${t(dict, 'meTopLoss')}</div>
        </div>

        <!-- Unobstructed SVG Stage -->
        <div class="finops-stage" dir="ltr" style="position:relative;width:100%;overflow-x:auto;"></div>

        <!-- Guidance Footer -->
        <div dir="${isRtl ? 'rtl' : 'ltr'}" style="padding-top:12px;margin-top:10px;border-top:1px solid ${BRAND.border};display:flex;align-items:center;flex-wrap:wrap;gap:14px;font-size:12px;color:${BRAND.textMuted};justify-content:${isRtl ? 'flex-end' : 'flex-start'};">
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:${BRAND.warningAmber};">${t(dict, 'meRevenueCeiling')} ($${seatRev.toFixed(2)}/seat/mo)</span>
        </div>
      </div>
    `;

    const card = container.querySelector('.finops-chart-card');
    const stage = card.querySelector('.finops-stage');
    const readoutMain = card.querySelector('.readout-main');
    const readoutDelta = card.querySelector('.readout-delta');

    // 2-tier stacked architecture:
    // Line 1: Left: Cohort name | Right: Cost & Gross Margin impact
    // Line 2: 690px wide comparative track ($0 - $100+) with $40 revenue ceiling marker
    const width = 740, height = 245;
    const trackLeft = 25, trackW = 690;
    const ceilingX = trackLeft + (seatRev / 100) * trackW;

    let svg = `
      <!-- Revenue Ceiling Vertical Marker Line -->
      <line x1="${ceilingX}" y1="20" x2="${ceilingX}" y2="225" stroke="${BRAND.warningAmber}" stroke-width="1.5" stroke-dasharray="3,3" />
      <text x="${ceilingX}" y="14" fill="${BRAND.warningAmber}" font-size="10" font-family="'JetBrains Mono',monospace" text-anchor="middle" font-weight="700">${t(dict, 'meRevenueCeiling')} ($${seatRev.toFixed(0)})</text>
    `;

    cohorts.forEach((c, i) => {
      const yRow = 28 + i * 48;
      const yText = yRow + 12;
      const yBar = yRow + 20;
      const barW = Math.min(trackW, (c.cost / 100) * trackW);
      const cohortName = t(dict, c.key);
      const marginStr = c.isLoss ? `${c.pct.toFixed(1)}% Loss` : `+${c.pct.toFixed(1)}% Margin`;

      svg += `
        <g class="me-cohort-row" data-index="${i}" style="cursor:pointer;">
          <!-- Line 1: Left Cohort Name & Right Telemetry Status -->
          <text x="25" y="${yText}" fill="${BRAND.textWhite}" font-size="12" font-family="'Inter',sans-serif" font-weight="600">${cohortName}</text>
          <text x="715" y="${yText}" fill="${c.color}" font-size="11.5" font-family="'JetBrains Mono',monospace" font-weight="700" text-anchor="end">$${c.cost.toFixed(2)} Cost | ${marginStr}</text>

          <!-- Line 2: Background Track & Proportional Burn Bar -->
          <rect x="${trackLeft}" y="${yBar}" width="${trackW}" height="16" rx="3" fill="${BRAND.wellBg}" stroke="${BRAND.border}" stroke-width="0.75" />
          <rect class="me-bar" x="${trackLeft}" y="${yBar}" width="${barW}" height="16" rx="3" fill="${c.color}" fill-opacity="0.88" style="transition:all 0.15s ease;" />

          <!-- Transparent row hitbox -->
          <rect x="10" y="${yRow}" width="${width - 20}" height="42" fill="transparent" />
        </g>
      `;
    });

    stage.innerHTML = `<svg id="me-svg" viewBox="0 0 ${width} ${height}" style="width:100%;height:auto;overflow:visible;user-select:none;">${svg}</svg>`;

    const rows = stage.querySelectorAll('.me-cohort-row');
    const defaultMain = readoutMain.innerHTML;
    const defaultDelta = readoutDelta.innerHTML;

    rows.forEach(row => {
      const idx = parseInt(row.getAttribute('data-index'), 10);
      const c = cohorts[idx];
      if (!c) return;
      const bar = row.querySelector('.me-bar');
      const cohortName = t(dict, c.key);

      row.addEventListener('mouseenter', () => {
        bar.setAttribute('fill-opacity', '1.0');
        bar.setAttribute('stroke', '#FFFFFF');
        bar.setAttribute('stroke-width', '1.5');

        const profitStr = c.isLoss ? `-$${Math.abs(c.profit).toFixed(2)} ${t(dict, 'meLoss')}` : `+$${c.profit.toFixed(2)} ${t(dict, 'meProfit')}`;

        readoutMain.innerHTML = `
          <span style="font-family:'JetBrains Mono',monospace;font-size:11.5px;font-weight:700;color:#FFFFFF;background:${BRAND.wellBg};padding:2px 8px;border-radius:4px;border:1px solid ${c.color};">${cohortName}</span>
          <div style="display:flex;align-items:center;gap:12px;font-size:12px;font-family:'JetBrains Mono',monospace;">
            <span><strong style="color:${BRAND.textMuted}">${t(dict, 'meRevenue')}</strong> $${seatRev.toFixed(2)}/seat</span>
            <span style="color:${BRAND.border}">|</span>
            <span><strong style="color:${c.color}">${t(dict, 'meTokenCost')}</strong> $${c.cost.toFixed(2)}</span>
            <span style="color:${BRAND.border}">|</span>
            <span style="color:${c.isLoss ? BRAND.burnOrange : BRAND.savingsMint}"><strong>Net:</strong> ${profitStr}</span>
          </div>
        `;
        readoutDelta.innerHTML = `<span style="color:${c.isLoss ? BRAND.burnOrange : BRAND.savingsMint};font-weight:700;">${c.isLoss ? c.pct.toFixed(1) + '% Loss' : '+' + c.pct.toFixed(1) + '% Margin'}</span>`;
      });

      row.addEventListener('mouseleave', () => {
        bar.setAttribute('fill-opacity', '0.88');
        bar.setAttribute('stroke', 'none');
        readoutMain.innerHTML = defaultMain;
        readoutDelta.innerHTML = defaultDelta;
      });
    });
  }


// 9. PROMPT CACHE TTL DECAY TIMELINE
  // ==========================================
  function ttlDecay(target, options = {}) {
    const container = getTarget(target);
    if (!container) return;

    const lang = resolveLang(container, options);
    const dict = I18N[lang] || I18N.en;
    const isRtl = lang === 'ar';

    const hotRate = options.hotRate || 0.30;
    const coldRate = options.coldRate || 3.75;
    const ttlMin = options.ttlMinutes || 5.0;
    const maxMin = options.maxMinutes || 10.0;

    const title = resolveText(options.title, lang, t(dict, 'ttlTitle'));
    const subtitle = resolveText(options.subtitle, lang, t(dict, 'ttlSubtitle'));

    container.innerHTML = `
      <div class="finops-chart-card" dir="${isRtl ? 'rtl' : 'ltr'}" style="position:relative;background:${BRAND.cardBg};border:1px solid ${BRAND.border};border-radius:10px;padding:18px 20px;margin:24px 0;font-family:Inter,system-ui,sans-serif;box-shadow:0 10px 30px -10px rgba(0,0,0,0.5);">
        
        <!-- Header -->
        <div style="margin-bottom:12px;text-align:${isRtl ? 'right' : 'left'};">
          <h3 style="margin:0;font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:${BRAND.textWhite};letter-spacing:-0.01em;">${title}</h3>
          <p style="margin:3px 0 0;font-size:12px;color:${BRAND.textMuted};">${subtitle}</p>
        </div>

        <!-- Dedicated Non-Obstructing Readout Deck -->
        <div class="finops-readout" dir="${isRtl ? 'rtl' : 'ltr'}" style="min-height:48px;background:${BRAND.wellBg};border:1px solid ${BRAND.border};border-radius:8px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;transition:all 0.15s ease;">
          <div class="readout-main" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <span class="readout-tag" style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:${BRAND.savingsMint};background:${BRAND.cardBg};padding:2px 8px;border-radius:4px;border:1px solid #2B3D5B;">${t(dict, 'ttlSummaryTag')}</span>
            <span class="readout-text" style="font-size:12px;color:${BRAND.textMain};">${t(dict, 'ttlSummaryDesc')}</span>
          </div>
          <div class="readout-delta" style="font-family:'JetBrains Mono',monospace;font-size:11.5px;color:${BRAND.warningAmber};font-weight:600;">${t(dict, 'ttlThreshold')}</div>
        </div>

        <!-- Unobstructed SVG Stage -->
        <div class="finops-stage" dir="ltr" style="position:relative;width:100%;overflow-x:auto;"></div>

        <!-- Legend -->
        <div dir="${isRtl ? 'rtl' : 'ltr'}" style="padding-top:12px;margin-top:10px;border-top:1px solid ${BRAND.border};display:flex;align-items:center;flex-wrap:wrap;gap:14px;font-size:12px;color:${BRAND.textMuted};justify-content:${isRtl ? 'flex-end' : 'flex-start'};">
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:${BRAND.savingsMint};"></span> ${t(dict, 'ttlHotZone')}</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:${BRAND.burnOrange};"></span> ${t(dict, 'ttlColdZone')}</span>
        </div>
      </div>
    `;

    const card = container.querySelector('.finops-chart-card');
    const stage = card.querySelector('.finops-stage');
    const readoutMain = card.querySelector('.readout-main');
    const readoutDelta = card.querySelector('.readout-delta');

    const width = 740, height = 240;
    const padding = { top: 25, right: 35, bottom: 42, left: 60 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    function getX(min) {
      return padding.left + (min / maxMin) * chartW;
    }
    function getY(rate) {
      return padding.top + chartH - ((rate - 0) / 4.5) * chartH;
    }

    const boundaryX = getX(ttlMin);

    let svg = `
      <!-- Zone Backgrounds -->
      <rect x="${padding.left}" y="${padding.top}" width="${boundaryX - padding.left}" height="${chartH}" fill="rgba(74, 222, 128, 0.08)" />
      <rect x="${boundaryX}" y="${padding.top}" width="${padding.left + chartW - boundaryX}" height="${chartH}" fill="rgba(234, 88, 12, 0.08)" />

      <!-- Horizontal Rate Grid Lines -->
      ${[0.50, 1.50, 2.50, 3.75].map(r => `
        <line x1="${padding.left}" y1="${getY(r)}" x2="${padding.left + chartW}" y2="${getY(r)}" stroke="${BRAND.border}" stroke-dasharray="2,3" opacity="0.6" />
        <text x="${padding.left - 8}" y="${getY(r) + 4}" fill="${BRAND.textDim}" font-size="10" font-family="'JetBrains Mono',monospace" text-anchor="end">${r.toFixed(2)}</text>
      `).join('')}

      <!-- Time Ticks -->
      ${[0, 2, 4, 5, 6, 8, 10].map(m => `
        <line x1="${getX(m)}" y1="${padding.top + chartH}" x2="${getX(m)}" y2="${padding.top + chartH + 5}" stroke="${BRAND.borderHover}" />
        <text x="${getX(m)}" y="${padding.top + chartH + 18}" fill="${m === 5 ? BRAND.warningAmber : BRAND.textDim}" font-size="10" font-family="'JetBrains Mono',monospace" text-anchor="middle" font-weight="${m === 5 ? 700 : 400}">${m}m</text>
      `).join('')}

      <!-- 5-min TTL Boundary Line -->
      <line x1="${boundaryX}" y1="${padding.top - 8}" x2="${boundaryX}" y2="${padding.top + chartH}" stroke="${BRAND.warningAmber}" stroke-width="2" stroke-dasharray="4,4" />
      <text x="${boundaryX}" y="${padding.top - 12}" fill="${BRAND.warningAmber}" font-size="10" font-family="'JetBrains Mono',monospace" text-anchor="middle" font-weight="700">${t(dict, 'ttlBoundary')}</text>

      <!-- Sigmoidal / Step-Up Cost Decay Curve -->
      <path d="M ${getX(0)} ${getY(hotRate)} L ${getX(4.0)} ${getY(hotRate)} C ${getX(4.8)} ${getY(hotRate)}, ${getX(5.0)} ${getY(coldRate * 0.7)}, ${getX(5.5)} ${getY(coldRate)} L ${getX(10.0)} ${getY(coldRate)}" fill="none" stroke="${BRAND.savingsMint}" stroke-width="3" stroke-linecap="round" />

      <!-- Interactive Crosshair Tracker -->
      <g id="ttl-track" style="opacity:0; pointer-events:none; transition:opacity 0.15s ease;">
        <line id="ttl-ch-x" x1="0" y1="${padding.top}" x2="0" y2="${padding.top + chartH}" stroke="${BRAND.crosshair}" stroke-width="1.5" stroke-dasharray="3,3" />
        <circle id="ttl-halo" cx="0" cy="0" r="10" fill="rgba(74, 222, 128, 0.3)" />
        <circle id="ttl-dot" cx="0" cy="0" r="5" fill="${BRAND.savingsMint}" stroke="#FFFFFF" stroke-width="2" />
      </g>

      <!-- Transparent Hitbox -->
      <rect id="ttl-hitbox" x="${padding.left}" y="${padding.top}" width="${chartW}" height="${chartH}" fill="transparent" style="cursor:crosshair;" />
    `;

    stage.innerHTML = `<svg id="ttl-svg" viewBox="0 0 ${width} ${height}" style="width:100%;height:auto;overflow:visible;user-select:none;">${svg}</svg>`;

    const hitbox = stage.querySelector('#ttl-hitbox');
    const track = stage.querySelector('#ttl-track');
    const chX = stage.querySelector('#ttl-ch-x');
    const halo = stage.querySelector('#ttl-halo');
    const dot = stage.querySelector('#ttl-dot');
    const svgEl = stage.querySelector('#ttl-svg');

    const defaultMain = readoutMain.innerHTML;
    const defaultDelta = readoutDelta.innerHTML;

    function calcRateAtMin(m) {
      if (m <= 4.0) return hotRate;
      if (m >= 5.5) return coldRate;
      const t = (m - 4.0) / 1.5;
      return hotRate + t * t * (3 - 2 * t) * (coldRate - hotRate);
    }

    hitbox.addEventListener('mousemove', (e) => {
      const rect = svgEl.getBoundingClientRect();
      const svgX = ((e.clientX - rect.left) / rect.width) * width;
      const clampedX = Math.max(padding.left, Math.min(padding.left + chartW, svgX));
      const m = ((clampedX - padding.left) / chartW) * maxMin;
      const currentRate = calcRateAtMin(m);
      const currentY = getY(currentRate);

      chX.setAttribute('x1', clampedX);
      chX.setAttribute('x2', clampedX);
      dot.setAttribute('cx', clampedX);
      dot.setAttribute('cy', currentY);
      halo.setAttribute('cx', clampedX);
      halo.setAttribute('cy', currentY);

      track.style.opacity = '1';

      const isHit = m < ttlMin;
      const statusLabel = isHit ? t(dict, 'ttlStateHit') : t(dict, 'ttlStateMiss');
      const statusColor = isHit ? BRAND.savingsMint : BRAND.burnOrange;
      const latencyStr = isHit ? '280ms' : '1,420ms';

      dot.setAttribute('fill', statusColor);
      halo.setAttribute('fill', statusColor);

      readoutMain.innerHTML = `
        <span style="font-family:'JetBrains Mono',monospace;font-size:11.5px;font-weight:700;color:#FFFFFF;background:${BRAND.wellBg};padding:2px 8px;border-radius:4px;border:1px solid ${statusColor};">${t(dict, 'ttlInterval')} ${m.toFixed(1)}m</span>
        <div style="display:flex;align-items:center;gap:12px;font-size:12px;font-family:'JetBrains Mono',monospace;">
          <span><strong style="color:${statusColor}">${t(dict, 'ttlState')}</strong> ${statusLabel}</span>
          <span style="color:${BRAND.border}">|</span>
          <span><strong style="color:${BRAND.textMuted}">${t(dict, 'ttlEffRate')}</strong> ${currentRate.toFixed(2)}/M</span>
          <span style="color:${BRAND.border}">|</span>
          <span><strong style="color:${BRAND.tokenSky}">${t(dict, 'ttlLatency')}</strong> ${latencyStr}</span>
        </div>
      `;
      readoutDelta.innerHTML = `<span style="color:${statusColor};font-weight:700;">${isHit ? t(dict, 'ttlDiscount') : t(dict, 'ttlPenalty')}</span>`;
    });

    hitbox.addEventListener('mouseleave', () => {
      track.style.opacity = '0';
      readoutMain.innerHTML = defaultMain;
      readoutDelta.innerHTML = defaultDelta;
    });
  }

  // ==========================================
  // 10. GENERIC TEMPLATE HELPERS (lineCompare / barCompare)
  // All visible text comes from the config and accepts either a string or a
  // per-language object ({ en: '...', de: '...' }) resolved with resolveText().
  // ==========================================
  function fmtCompact(v) {
    const a = Math.abs(v);
    if (a >= 1e9) return +(v / 1e9).toFixed(1) + 'B';
    if (a >= 1e6) return +(v / 1e6).toFixed(1) + 'M';
    if (a >= 1e4) return +(v / 1e3).toFixed(0) + 'k';
    if (a >= 1e3) return +(v / 1e3).toFixed(1) + 'k';
    if (a >= 100) return v.toFixed(0);
    if (a >= 10) return String(+v.toFixed(1));
    return String(+v.toFixed(2));
  }

  function chartShell(isRtl, o) {
    const dir = isRtl ? 'rtl' : 'ltr';
    const tagHtml = o.tag ? `<span style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:${BRAND.crosshair};background:${BRAND.cardBg};padding:2px 8px;border-radius:4px;border:1px solid #2B3D5B;">${o.tag}</span>` : '';
    const footHtml = o.footnote ? `<span style="font-size:11px;color:${BRAND.textDim};">${o.footnote}</span>` : '';
    const legendBlock = (o.legend || o.footnote) ? `<div dir="${dir}" style="padding-top:12px;margin-top:10px;border-top:1px solid ${BRAND.border};display:flex;align-items:center;flex-wrap:wrap;gap:14px;font-size:12px;color:${BRAND.textMuted};justify-content:${isRtl ? 'flex-end' : 'flex-start'};">${o.legend || ''}${footHtml}</div>` : '';
    return `
      <div class="finops-chart-card" dir="${dir}" style="position:relative;background:${BRAND.cardBg};border:1px solid ${BRAND.border};border-radius:10px;padding:18px 20px;margin:24px 0;font-family:Inter,system-ui,sans-serif;box-shadow:0 10px 30px -10px rgba(0,0,0,0.5);">
        <div style="margin-bottom:12px;text-align:${isRtl ? 'right' : 'left'};">
          <h3 style="margin:0;font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:${BRAND.textWhite};letter-spacing:-0.01em;">${o.title || ''}</h3>
          ${o.subtitle ? `<p style="margin:3px 0 0;font-size:12px;color:${BRAND.textMuted};">${o.subtitle}</p>` : ''}
        </div>
        <div class="finops-readout" dir="${dir}" style="min-height:48px;background:${BRAND.wellBg};border:1px solid ${BRAND.border};border-radius:8px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
          <div class="readout-main" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            ${tagHtml}
            <span style="font-size:12px;color:${BRAND.textMain};">${o.text || ''}</span>
          </div>
          <div class="readout-delta" style="font-family:'JetBrains Mono',monospace;font-size:11.5px;color:${BRAND.savingsMint};font-weight:600;">${o.delta || ''}</div>
        </div>
        <div class="finops-stage" dir="ltr" style="position:relative;width:100%;overflow-x:auto;"></div>
        ${legendBlock}
      </div>`;
  }

  // ==========================================
  // 11. LINE COMPARE: generic multi-series line chart
  // options: title, subtitle, summaryTag, summaryText, summaryDelta, footnote,
  //   xLabel, yLabel, xPrefix, xSuffix, yPrefix, ySuffix, xMin, xMax, yMin, yMax, yLog,
  //   series: [{ label, color, points: [[x, y], ...] }],
  //   ratio: { num: seriesIndex, den: seriesIndex, label }
  // ==========================================
  function lineCompare(target, options = {}) {
    const container = getTarget(target);
    if (!container) return;
    const lang = resolveLang(container, options);
    const isRtl = lang === 'ar';
    const tx = (v) => resolveText(v, lang, '');
    const palette = [BRAND.burnOrange, BRAND.outputViolet, BRAND.savingsMint, BRAND.tokenSky, BRAND.warningAmber];
    const series = (options.series || []).map((s, i) => ({
      label: tx(s.label) || ('Series ' + (i + 1)),
      color: s.color || palette[i % palette.length],
      points: (s.points || []).slice().sort((a, b) => a[0] - b[0])
    })).filter(s => s.points.length >= 2);
    if (!series.length) return;

    const xPre = options.xPrefix || '', xSuf = tx(options.xSuffix) || '';
    const yPre = options.yPrefix || '', ySuf = tx(options.ySuffix) || '';
    const fx = (v) => xPre + fmtCompact(v) + xSuf;
    const fy = (v) => yPre + fmtCompact(v) + ySuf;

    const legend = series.map(s => `<span style="display:flex;align-items:center;gap:6px;"><span style="width:12px;height:3px;border-radius:2px;background:${s.color};"></span>${s.label}</span>`).join('');
    container.innerHTML = chartShell(isRtl, {
      title: tx(options.title), subtitle: tx(options.subtitle),
      tag: tx(options.summaryTag), text: tx(options.summaryText), delta: tx(options.summaryDelta),
      legend, footnote: tx(options.footnote)
    });

    const card = container.querySelector('.finops-chart-card');
    const stage = card.querySelector('.finops-stage');
    const readoutMain = card.querySelector('.readout-main');
    const readoutDelta = card.querySelector('.readout-delta');

    const width = 740, height = 270;
    const padding = { top: 30, right: 30, bottom: 48, left: 72 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const allX = series.flatMap(s => s.points.map(p => p[0]));
    const allY = series.flatMap(s => s.points.map(p => p[1]));
    const xMin = options.xMin !== undefined ? options.xMin : Math.min(...allX);
    const xMax = options.xMax !== undefined ? options.xMax : Math.max(...allX);
    const yLog = !!options.yLog;
    let yMin, yMax;
    if (yLog) {
      const posY = allY.filter(v => v > 0);
      yMin = options.yMin || Math.pow(10, Math.floor(Math.log10(Math.min(...posY))));
      yMax = options.yMax || Math.pow(10, Math.ceil(Math.log10(Math.max(...posY))));
    } else {
      yMin = options.yMin !== undefined ? options.yMin : 0;
      if (options.yMax !== undefined) {
        yMax = options.yMax;
      } else {
        const rawMax = Math.max(...allY) * 1.08;
        const st = calcNiceStep(rawMax - yMin, 4);
        yMax = yMin + Math.ceil((rawMax - yMin) / st) * st;
      }
    }

    const X = (v) => padding.left + ((v - xMin) / (xMax - xMin)) * chartW;
    const Y = (v) => {
      if (yLog) {
        const c = Math.max(v, yMin);
        return padding.top + chartH - ((Math.log10(c) - Math.log10(yMin)) / (Math.log10(yMax) - Math.log10(yMin))) * chartH;
      }
      return padding.top + chartH - ((v - yMin) / (yMax - yMin)) * chartH;
    };
    const valueAt = (s, x) => {
      const p = s.points;
      if (x <= p[0][0]) return p[0][1];
      if (x >= p[p.length - 1][0]) return p[p.length - 1][1];
      for (let i = 1; i < p.length; i++) {
        if (x <= p[i][0]) {
          const t = (x - p[i - 1][0]) / (p[i][0] - p[i - 1][0]);
          return p[i - 1][1] + t * (p[i][1] - p[i - 1][1]);
        }
      }
      return p[p.length - 1][1];
    };

    let svg = '';
    // Y grid + ticks: decades on log axes, ~5 nice steps on linear axes
    const yTicks = [];
    if (yLog) {
      for (let e = Math.round(Math.log10(yMin)); e <= Math.round(Math.log10(yMax)); e++) yTicks.push(Math.pow(10, e));
    } else {
      const st = calcNiceStep(yMax - yMin, 4);
      for (let v = yMin; v <= yMax + 1e-9; v += st) yTicks.push(v);
    }
    yTicks.forEach(v => {
      const y = Y(v);
      svg += `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="${BRAND.border}" stroke-dasharray="3,3" />
        <text x="${padding.left - 8}" y="${y + 4}" fill="${BRAND.textDim}" font-size="10.5" font-family="'JetBrains Mono',monospace" text-anchor="end">${fy(v)}</text>`;
    });
    // X ticks: ~5 nice steps
    const xs = calcNiceStep(xMax - xMin, 5);
    for (let v = Math.ceil(xMin / xs) * xs; v <= xMax + 1e-9; v += xs) {
      const x = X(v);
      svg += `<line x1="${x}" y1="${padding.top}" x2="${x}" y2="${padding.top + chartH}" stroke="${BRAND.border}" stroke-dasharray="2,3" opacity="0.6" />
        <text x="${x}" y="${padding.top + chartH + 16}" fill="${BRAND.textDim}" font-size="10.5" font-family="'JetBrains Mono',monospace" text-anchor="middle">${fx(v)}</text>`;
    }
    // Axes and horizontal axis titles (no rotated text, no overlap with tick labels)
    svg += `<line x1="${padding.left}" y1="${padding.top + chartH}" x2="${padding.left + chartW}" y2="${padding.top + chartH}" stroke="${BRAND.borderHover}" stroke-width="1.5" />
      <line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${padding.top + chartH}" stroke="${BRAND.borderHover}" stroke-width="1.5" />
      <text x="${padding.left + chartW / 2}" y="${height - 8}" fill="${BRAND.textMuted}" font-size="11" text-anchor="middle">${tx(options.xLabel)}</text>
      <text x="${padding.left}" y="${padding.top - 14}" fill="${BRAND.textMuted}" font-size="11">${tx(options.yLabel)}</text>`;

    // Series paths, sampled so curves stay correct on log axes
    const SAMPLES = 80;
    series.forEach(s => {
      let d = '';
      for (let k = 0; k <= SAMPLES; k++) {
        const xv = xMin + (k / SAMPLES) * (xMax - xMin);
        d += (k === 0 ? 'M ' : ' L ') + X(xv).toFixed(1) + ' ' + Y(valueAt(s, xv)).toFixed(1);
      }
      svg += `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />`;
    });

    svg += `<g class="lc-track" style="opacity:0;pointer-events:none;transition:opacity 0.15s ease;">
        <line class="lc-ch" x1="0" y1="${padding.top}" x2="0" y2="${padding.top + chartH}" stroke="${BRAND.crosshair}" stroke-width="1" stroke-dasharray="3,3" />
        ${series.map((s, si) => `<circle class="lc-dot" data-si="${si}" cx="0" cy="0" r="5" fill="${s.color}" stroke="#FFFFFF" stroke-width="2" />`).join('')}
      </g>
      <rect class="lc-hitbox" x="${padding.left}" y="${padding.top}" width="${chartW}" height="${chartH}" fill="transparent" style="cursor:crosshair;" />`;

    stage.innerHTML = `<svg viewBox="0 0 ${width} ${height}" style="width:100%;height:auto;overflow:visible;user-select:none;">${svg}</svg>`;

    const svgEl = stage.querySelector('svg');
    const hitbox = stage.querySelector('.lc-hitbox');
    const track = stage.querySelector('.lc-track');
    const ch = stage.querySelector('.lc-ch');
    const dots = stage.querySelectorAll('.lc-dot');
    const defaultMain = readoutMain.innerHTML;
    const defaultDelta = readoutDelta.innerHTML;
    const ratio = options.ratio;

    hitbox.addEventListener('mousemove', (e) => {
      const rect = svgEl.getBoundingClientRect();
      const sx = ((e.clientX - rect.left) / rect.width) * width;
      const cx = Math.max(padding.left, Math.min(padding.left + chartW, sx));
      const xv = xMin + ((cx - padding.left) / chartW) * (xMax - xMin);
      ch.setAttribute('x1', cx); ch.setAttribute('x2', cx);
      const vals = series.map(s => valueAt(s, xv));
      dots.forEach(dot => {
        const si = parseInt(dot.getAttribute('data-si'), 10);
        dot.setAttribute('cx', cx); dot.setAttribute('cy', Y(vals[si]));
      });
      track.style.opacity = '1';
      const sep = `<span style="color:${BRAND.border}">|</span>`;
      readoutMain.innerHTML = `
        <span style="font-family:'JetBrains Mono',monospace;font-size:11.5px;font-weight:700;color:#FFFFFF;background:${BRAND.wellBg};padding:2px 8px;border-radius:4px;border:1px solid ${BRAND.crosshair};">${fx(xv)}</span>
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;font-size:12px;font-family:'JetBrains Mono',monospace;">
          ${series.map((s, si) => `<span><strong style="color:${s.color}">${s.label}:</strong> ${fy(vals[si])}</span>`).join(sep)}
        </div>`;
      if (ratio && vals[ratio.num] !== undefined && vals[ratio.den] > 0) {
        const r = vals[ratio.num] / vals[ratio.den];
        readoutDelta.innerHTML = `<span style="color:${BRAND.savingsMint};font-weight:700;">${tx(ratio.label)} ${r >= 10 ? r.toFixed(0) : r.toFixed(1)}x</span>`;
      }
    });
    hitbox.addEventListener('mouseleave', () => {
      track.style.opacity = '0';
      readoutMain.innerHTML = defaultMain;
      readoutDelta.innerHTML = defaultDelta;
    });
  }

  // ==========================================
  // 12. BAR COMPARE: generic stacked-row horizontal bars
  // options: title, subtitle, summaryTag, summaryText, summaryDelta, footnote,
  //   valuePrefix, valueSuffix, maxValue, decimals,
  //   marker: { value, label },
  //   items: [{ label, value, color, display, note }]
  // Row layout: line 1 = label (left) + value (right); line 2 = full-width track.
  // ==========================================
  function barCompare(target, options = {}) {
    const container = getTarget(target);
    if (!container) return;
    const lang = resolveLang(container, options);
    const isRtl = lang === 'ar';
    const tx = (v) => resolveText(v, lang, '');
    const palette = [BRAND.tokenSky, BRAND.outputViolet, BRAND.savingsMint, BRAND.warningAmber, BRAND.burnOrange];
    const items = (options.items || []).map((it, i) => ({
      label: tx(it.label),
      value: Number(it.value) || 0,
      color: it.color || palette[i % palette.length],
      display: tx(it.display),
      note: tx(it.note)
    }));
    if (!items.length) return;

    const pre = options.valuePrefix || '', suf = tx(options.valueSuffix) || '';
    const dec = options.decimals !== undefined ? options.decimals : 1;
    const fv = (it) => it.display || (pre + it.value.toFixed(dec) + suf);

    container.innerHTML = chartShell(isRtl, {
      title: tx(options.title), subtitle: tx(options.subtitle),
      tag: tx(options.summaryTag), text: tx(options.summaryText), delta: tx(options.summaryDelta),
      footnote: tx(options.footnote)
    });

    const card = container.querySelector('.finops-chart-card');
    const stage = card.querySelector('.finops-stage');
    const readoutMain = card.querySelector('.readout-main');
    const readoutDelta = card.querySelector('.readout-delta');

    const marker = options.marker;
    const top = marker ? 26 : 6;
    const rowH = 46;
    const width = 740, height = top + items.length * rowH + 6;
    const trackLeft = 25, trackW = 690;
    const maxV = options.maxValue || Math.max(...items.map(i => i.value), marker ? marker.value : 0) * 1.05;
    const W = (v) => Math.max(3, Math.min(trackW, (v / maxV) * trackW));

    let svg = '';
    items.forEach((it, i) => {
      const yRow = top + i * rowH;
      svg += `<g class="bc-row" data-index="${i}" style="cursor:pointer;">
          <text x="${trackLeft}" y="${yRow + 13}" fill="${BRAND.textWhite}" font-size="12" font-weight="600">${it.label}</text>
          <text x="${trackLeft + trackW}" y="${yRow + 13}" fill="${it.color}" font-size="11.5" font-family="'JetBrains Mono',monospace" font-weight="700" text-anchor="end">${fv(it)}</text>
          <rect x="${trackLeft}" y="${yRow + 20}" width="${trackW}" height="16" rx="3" fill="${BRAND.wellBg}" stroke="${BRAND.border}" stroke-width="0.75" />
          <rect class="bc-bar" x="${trackLeft}" y="${yRow + 20}" width="${W(it.value)}" height="16" rx="3" fill="${it.color}" fill-opacity="0.88" style="transition:all 0.15s ease;" />
          <rect x="10" y="${yRow}" width="${width - 20}" height="${rowH - 4}" fill="transparent" />
        </g>`;
    });
    if (marker) {
      const mx = trackLeft + W(marker.value);
      const anchor = mx > width - 160 ? 'end' : (mx < 160 ? 'start' : 'middle');
      svg += `<line x1="${mx}" y1="${top - 6}" x2="${mx}" y2="${height - 4}" stroke="${BRAND.warningAmber}" stroke-width="1.5" stroke-dasharray="3,3" pointer-events="none" />
        <text x="${mx}" y="${top - 12}" fill="${BRAND.warningAmber}" font-size="10.5" font-family="'JetBrains Mono',monospace" font-weight="700" text-anchor="${anchor}">${tx(marker.label)}</text>`;
    }

    stage.innerHTML = `<svg viewBox="0 0 ${width} ${height}" style="width:100%;height:auto;overflow:visible;user-select:none;">${svg}</svg>`;

    const defaultMain = readoutMain.innerHTML;
    const defaultDelta = readoutDelta.innerHTML;
    stage.querySelectorAll('.bc-row').forEach(row => {
      const it = items[parseInt(row.getAttribute('data-index'), 10)];
      if (!it) return;
      const bar = row.querySelector('.bc-bar');
      row.addEventListener('mouseenter', () => {
        bar.setAttribute('fill-opacity', '1');
        bar.setAttribute('stroke', '#FFFFFF');
        bar.setAttribute('stroke-width', '1.5');
        readoutMain.innerHTML = `
          <span style="font-family:'JetBrains Mono',monospace;font-size:11.5px;font-weight:700;color:#FFFFFF;background:${BRAND.wellBg};padding:2px 8px;border-radius:4px;border:1px solid ${it.color};">${it.label}</span>
          <span style="font-size:12px;color:${BRAND.textMain};">${it.note}</span>`;
        readoutDelta.innerHTML = `<span style="color:${it.color};font-weight:700;">${fv(it)}</span>`;
      });
      row.addEventListener('mouseleave', () => {
        bar.setAttribute('fill-opacity', '0.88');
        bar.removeAttribute('stroke');
        readoutMain.innerHTML = defaultMain;
        readoutDelta.innerHTML = defaultDelta;
      });
    });
  }

  // Auto-init for data-finops-chart attributes
  function initAll() {
    if (typeof document === 'undefined') return;
    document.querySelectorAll('[data-finops-chart]').forEach(el => {
      const type = el.getAttribute('data-finops-chart');
      let config = {};
      try {
        let raw = el.getAttribute('data-finops-config');
        if (raw) {
          if (raw.includes('&quot;') || raw.includes('&#39;') || raw.includes('&amp;')) {
            const txt = document.createElement('textarea');
            txt.innerHTML = raw;
            raw = txt.value;
          }
          config = JSON.parse(raw);
        }
      } catch (err) {
        console.error('FinOpsCharts: Invalid JSON in data-finops-config', err);
      }

      if (type === 'grouped-bar' || type === 'groupedBar') groupedBar(el, config);
      else if (type === 'break-even' || type === 'breakEven') breakEven(el, config);
      else if (type === 'token-donut' || type === 'tokenDonut') tokenDonut(el, config);
      else if (type === 'horizontal-delta' || type === 'horizontalDelta') horizontalDelta(el, config);
      else if (type === 'waterfall') waterfall(el, config);
      else if (type === 'pareto-frontier' || type === 'paretoFrontier') paretoFrontier(el, config);
      else if (type === 'cascade-funnel' || type === 'cascadeFunnel') cascadeFunnel(el, config);
      else if (type === 'margin-erosion' || type === 'marginErosion') marginErosion(el, config);
      else if (type === 'ttl-decay' || type === 'ttlDecay') ttlDecay(el, config);
      else if (type === 'line-compare' || type === 'lineCompare') lineCompare(el, config);
      else if (type === 'bar-compare' || type === 'barCompare') barCompare(el, config);
    });
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAll);
    } else {
      initAll();
    }
  }

  return {
    BRAND,
    I18N,
    resolveLang,
    resolveText,
    groupedBar,
    breakEven,
    tokenDonut,
    horizontalDelta,
    waterfall,
    paretoFrontier,
    cascadeFunnel,
    marginErosion,
    ttlDecay,
    lineCompare,
    barCompare,
    initAll
  };
});
