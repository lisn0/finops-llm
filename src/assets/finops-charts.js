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

    let svg = '';
    for (let v = 0; v <= maxVal; v += 50) {
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
  // 2. BREAK-EVEN LINE & DUAL CROSSHAIR
  // ==========================================
  function breakEven(target, options = {}) {
    const container = getTarget(target);
    if (!container) return;

    const lang = resolveLang(container, options);
    const dict = I18N[lang] || I18N.en;
    const isRtl = lang === 'ar';

    const ptuFixed = options.ptuFixed || 260;
    const onDemandRate = options.onDemandRate || 12.5;
    const ptuMarginal = options.ptuMarginal || 3.2;
    const maxX = options.maxX || 100;
    const maxY = options.maxY || 1500;

    const title = resolveText(options.title, lang, t(dict, 'beTitle'));
    const subtitle = resolveText(options.subtitle, lang, t(dict, 'beSubtitle'));

    const breakEvenTokens = (ptuFixed / (onDemandRate - ptuMarginal)).toFixed(1);
    const breakEvenCost = (breakEvenTokens * onDemandRate).toFixed(0);

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
    const padding = { top: 15, right: 35, bottom: 40, left: 60 };
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

    let svg = '';
    for (let yv = 0; yv <= maxY; yv += 300) {
      const y = padding.top + chartH - (yv / maxY) * chartH;
      svg += `
        <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="${BRAND.border}" stroke-dasharray="3,3" />
        <text x="${padding.left - 8}" y="${y + 4}" fill="${BRAND.textDim}" font-size="11" font-family="'JetBrains Mono', monospace" text-anchor="end">$${yv}</text>
      `;
    }
    for (let xv = 0; xv <= maxX; xv += 20) {
      const x = padding.left + (xv / maxX) * chartW;
      svg += `
        <line x1="${x}" y1="${padding.top}" x2="${x}" y2="${padding.top + chartH}" stroke="${BRAND.border}" stroke-dasharray="2,2" />
        <text x="${x}" y="${padding.top + chartH + 18}" fill="${BRAND.textDim}" font-size="11" font-family="'JetBrains Mono', monospace" text-anchor="middle">${xv}M</text>
      `;
    }

    const p0 = getCoord(0);
    const p100 = getCoord(maxX);
    const pbe = getCoord(breakEvenTokens);

    svg += `
      <polygon points="${pbe.x},${pbe.yOnDemand} ${p100.x},${p100.yOnDemand} ${p100.x},${p100.yPtu}" fill="rgba(74, 222, 128, 0.12)" />
      <line x1="${p0.x}" y1="${p0.yOnDemand}" x2="${p100.x}" y2="${p100.yOnDemand}" stroke="${BRAND.burnOrange}" stroke-width="3" stroke-linecap="round" />
      <line x1="${p0.x}" y1="${p0.yPtu}" x2="${p100.x}" y2="${p100.yPtu}" stroke="${BRAND.tokenSky}" stroke-width="3" stroke-linecap="round" />

      <line x1="${pbe.x}" y1="${padding.top}" x2="${pbe.x}" y2="${padding.top + chartH}" stroke="${BRAND.savingsMint}" stroke-width="1.5" stroke-dasharray="4,4" />
      <circle cx="${pbe.x}" cy="${pbe.yOnDemand}" r="5" fill="${BRAND.savingsMint}" stroke="${BRAND.canvasBg}" stroke-width="2" />
      <text x="${pbe.x}" y="${padding.top - 6}" fill="${BRAND.savingsMint}" font-size="11" font-family="'JetBrains Mono', monospace" font-weight="600" text-anchor="middle">${t(dict, 'beIntersection')} ~${breakEvenTokens}M</text>

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
      const tokenRatio = (clampedX - padding.left) / chartW;
      const tokens = Math.round(tokenRatio * maxX * 10) / 10;
      const pt = getCoord(tokens);

      ch.setAttribute('x1', pt.x); ch.setAttribute('x2', pt.x);
      dl.setAttribute('x1', pt.x); dl.setAttribute('y1', pt.yOnDemand); dl.setAttribute('x2', pt.x); dl.setAttribute('y2', pt.yPtu);
      dPay.setAttribute('cx', pt.x); dPay.setAttribute('cy', pt.yOnDemand);
      hPay.setAttribute('cx', pt.x); hPay.setAttribute('cy', pt.yOnDemand);
      dPtu.setAttribute('cx', pt.x); dPtu.setAttribute('cy', pt.yPtu);
      hPtu.setAttribute('cx', pt.x); hPtu.setAttribute('cy', pt.yPtu);

      track.style.opacity = '1';

      const delta = Math.abs(pt.onDemandCost - pt.ptuCost);
      const isPtu = pt.onDemandCost > pt.ptuCost;
      const isExact = Math.abs(tokens - breakEvenTokens) < 0.8;

      let verdict = '';
      if (isExact) {
        verdict = `<span style="color:${BRAND.savingsMint};font-weight:700;">${t(dict, 'beExact', { cost: breakEvenCost })}</span>`;
      } else if (isPtu) {
        const pct = Math.round((delta / pt.onDemandCost) * 100);
        verdict = `<span style="color:${BRAND.savingsMint};font-weight:700;">${t(dict, 'bePtuSaves', { delta: '$' + delta.toFixed(0), pct: pct })}</span>`;
      } else {
        verdict = `<span style="color:${BRAND.warningAmber};font-weight:700;">${t(dict, 'bePaygoCheaper', { delta: '$' + delta.toFixed(0) })}</span>`;
      }

      readoutMain.innerHTML = `
        <span style="font-family:'JetBrains Mono',monospace;font-size:11.5px;font-weight:700;color:#FFFFFF;background:${BRAND.wellBg};padding:2px 8px;border-radius:4px;border:1px solid ${BRAND.crosshair};">${t(dict, 'tokensPerMo', { tokens: tokens.toFixed(1) })}</span>
        <div style="display:flex;align-items:center;gap:12px;font-size:12px;font-family:'JetBrains Mono',monospace;">
          <span><strong style="color:${BRAND.burnOrange}">${t(dict, 'paygoLabel')}:</strong> $${pt.onDemandCost.toFixed(0)}/mo</span>
          <span style="color:${BRAND.border}">|</span>
          <span><strong style="color:${BRAND.tokenSky}">${t(dict, 'ptuLabel')}:</strong> $${pt.ptuCost.toFixed(0)}/mo</span>
        </div>
      `;
      readoutDelta.innerHTML = verdict;
    });

    hitbox.addEventListener('mouseleave', () => {
      track.style.opacity = '0';
      readoutMain.innerHTML = defaultMain;
      readoutDelta.innerHTML = defaultDelta;
    });
  }

  // ==========================================
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
    const padding = { top: 20, right: 80, bottom: 20, left: 210 };
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

    let svg = '';
    for (let v = 0; v <= maxY; v += 0.40) {
      const y = padding.top + chartH - (v / maxY) * chartH;
      svg += `
        <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="${BRAND.border}" stroke-dasharray="3,3" />
        <text x="${padding.left - 8}" y="${y + 4}" fill="${BRAND.textDim}" font-size="11" font-family="'JetBrains Mono', monospace" text-anchor="end">$${v.toFixed(2)}</text>
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

  // Auto-init for data-finops-chart attributes
  function initAll() {
    if (typeof document === 'undefined') return;
    document.querySelectorAll('[data-finops-chart]').forEach(el => {
      const type = el.getAttribute('data-finops-chart');
      let config = {};
      try {
        const raw = el.getAttribute('data-finops-config');
        if (raw) config = JSON.parse(raw);
      } catch (err) {
        console.error('FinOpsCharts: Invalid JSON in data-finops-config', err);
      }

      if (type === 'grouped-bar' || type === 'groupedBar') groupedBar(el, config);
      else if (type === 'break-even' || type === 'breakEven') breakEven(el, config);
      else if (type === 'token-donut' || type === 'tokenDonut') tokenDonut(el, config);
      else if (type === 'horizontal-delta' || type === 'horizontalDelta') horizontalDelta(el, config);
      else if (type === 'waterfall') waterfall(el, config);
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
    initAll
  };
});
