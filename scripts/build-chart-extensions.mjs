import fs from 'fs';
import path from 'path';

const DICTS = {
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
    "ttlPenalty": "Full Cold Write Penalty"
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
    "ttlPenalty": "Voller Kaltstart-Aufpreis"
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
    "ttlPenalty": "Penalización completa de escritura"
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
    "ttlPenalty": "Pénalité complète écriture froide"
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
    "ttlPenalty": "フルコールド書込ペナルティ"
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
    "ttlPenalty": "Penalidade Total de Escrita Fria"
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
    "ttlPenalty": "Penalità completa scrittura fredda"
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
    "ttlPenalty": "전액 콜드 쓰기 패널티"
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
    "ttlPenalty": "全额冷写入惩罚"
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
    "ttlPenalty": "Volledige koude schrijfkosten"
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
    "ttlPenalty": "تكلفة الكتابة الباردة كاملة"
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
    "ttlPenalty": "Полный штраф холодной записи"
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
    "ttlPenalty": "Tam Soğuk Yazma Cezası"
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
    "ttlPenalty": "Pełny koszt zapisu na zimno"
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
    "ttlPenalty": "Penalti Penuh Penulisan Dingin"
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
    "ttlPenalty": "Phạt toàn bộ phí ghi nguội"
  }
};

console.log("DICTS ready, locales:", Object.keys(DICTS).length);

const FUNCTIONS_CODE = `
  // ==========================================
  // 6. PARETO FRONTIER: SWE-bench Accuracy vs Cost
  // ==========================================
  function paretoFrontier(target, options = {}) {
    const container = getTarget(target);
    if (!container) return;

    const lang = resolveLang(container, options);
    const dict = I18N[lang] || I18N.en;
    const isRtl = lang === 'ar';

    const defaultModels = [
      { name: "DeepSeek V3", cost: 0.85, acc: 71.4, color: BRAND.tokenSky, tierKey: "pfValueLeader" },
      { name: "Claude 3.7 Haiku", cost: 1.25, acc: 73.2, color: BRAND.tokenSky, tierKey: "pfValueLeader" },
      { name: "o3-mini Fast", cost: 1.80, acc: 81.2, color: BRAND.savingsMint, tierKey: "pfSweetSpot" },
      { name: "Claude 3.7 Sonnet", cost: 4.50, acc: 86.8, color: BRAND.savingsMint, tierKey: "pfFrontierEff" },
      { name: "GPT-5.4 Std", cost: 6.20, acc: 87.5, color: BRAND.outputViolet, tierKey: "pfFrontierEff" },
      { name: "Claude 3.7 Opus", cost: 22.00, acc: 89.1, color: BRAND.burnOrange, tierKey: "pfDiminishing" }
    ];

    const models = options.models || defaultModels;
    const title = resolveText(options.title, lang, t(dict, 'pfTitle'));
    const subtitle = resolveText(options.subtitle, lang, t(dict, 'pfSubtitle'));

    container.innerHTML = \`
      <div class="finops-chart-card" dir="\${isRtl ? 'rtl' : 'ltr'}" style="position:relative;background:\${BRAND.cardBg};border:1px solid \${BRAND.border};border-radius:10px;padding:18px 20px;margin:24px 0;font-family:Inter,system-ui,sans-serif;box-shadow:0 10px 30px -10px rgba(0,0,0,0.5);">
        
        <!-- Header -->
        <div style="margin-bottom:12px;text-align:\${isRtl ? 'right' : 'left'};">
          <h3 style="margin:0;font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:\${BRAND.textWhite};letter-spacing:-0.01em;">\${title}</h3>
          <p style="margin:3px 0 0;font-size:12px;color:\${BRAND.textMuted};">\${subtitle}</p>
        </div>

        <!-- Dedicated Non-Obstructing Readout Deck -->
        <div class="finops-readout" dir="\${isRtl ? 'rtl' : 'ltr'}" style="min-height:48px;background:\${BRAND.wellBg};border:1px solid \${BRAND.border};border-radius:8px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;transition:all 0.15s ease;">
          <div class="readout-main" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <span class="readout-tag" style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:\${BRAND.crosshair};background:\${BRAND.cardBg};padding:2px 8px;border-radius:4px;border:1px solid #2B3D5B;">\${t(dict, 'pfSummaryTag')}</span>
            <span class="readout-text" style="font-size:12px;color:\${BRAND.textMain};">\${t(dict, 'pfSummaryDesc')}</span>
          </div>
          <div class="readout-delta" style="font-family:'JetBrains Mono',monospace;font-size:11.5px;color:\${BRAND.savingsMint};font-weight:600;">\${t(dict, 'pfEfficiencyTag')}</div>
        </div>

        <!-- Unobstructed SVG Stage -->
        <div class="finops-stage" dir="ltr" style="position:relative;width:100%;overflow-x:auto;"></div>

        <!-- Legend -->
        <div dir="\${isRtl ? 'rtl' : 'ltr'}" style="padding-top:12px;margin-top:10px;border-top:1px solid \${BRAND.border};display:flex;align-items:center;flex-wrap:wrap;gap:14px;font-size:12px;color:\${BRAND.textMuted};justify-content:\${isRtl ? 'flex-end' : 'flex-start'};">
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:50%;background:\${BRAND.tokenSky};"></span> \${t(dict, 'pfValueLeader')}</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:50%;background:\${BRAND.savingsMint};"></span> \${t(dict, 'pfSweetSpot')}</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:50%;background:\${BRAND.outputViolet};"></span> \${t(dict, 'pfFrontierEff')}</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:50%;background:\${BRAND.burnOrange};"></span> \${t(dict, 'pfDiminishing')}</span>
        </div>
      </div>
    \`;

    const card = container.querySelector('.finops-chart-card');
    const stage = card.querySelector('.finops-stage');
    const readoutMain = card.querySelector('.readout-main');
    const readoutDelta = card.querySelector('.readout-delta');

    const width = 740, height = 280;
    const padding = { top: 25, right: 35, bottom: 42, left: 60 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const minCost = 0.5, maxCost = 26;
    const minAcc = 65, maxAcc = 95;

    function getX(c) {
      return padding.left + (Math.log10(c / minCost) / Math.log10(maxCost / minCost)) * chartW;
    }
    function getY(a) {
      return padding.top + chartH - ((a - minAcc) / (maxAcc - minAcc)) * chartH;
    }

    let svg = \`
      <!-- Grid Lines -->
      <line x1="\${padding.left}" y1="\${getY(70)}" x2="\${padding.left + chartW}" y2="\${getY(70)}" stroke="\${BRAND.border}" stroke-dasharray="3,3" />
      <text x="\${padding.left - 8}" y="\${getY(70) + 4}" fill="\${BRAND.textDim}" font-size="10" font-family="'JetBrains Mono',monospace" text-anchor="end">70%</text>

      <line x1="\${padding.left}" y1="\${getY(80)}" x2="\${padding.left + chartW}" y2="\${getY(80)}" stroke="\${BRAND.border}" stroke-dasharray="3,3" />
      <text x="\${padding.left - 8}" y="\${getY(80) + 4}" fill="\${BRAND.textDim}" font-size="10" font-family="'JetBrains Mono',monospace" text-anchor="end">80%</text>

      <line x1="\${padding.left}" y1="\${getY(90)}" x2="\${padding.left + chartW}" y2="\${getY(90)}" stroke="\${BRAND.border}" stroke-dasharray="3,3" />
      <text x="\${padding.left - 8}" y="\${getY(90) + 4}" fill="\${BRAND.textDim}" font-size="10" font-family="'JetBrains Mono',monospace" text-anchor="end">90%</text>

      <!-- Cost ticks -->
      \${[1, 2, 5, 10, 20].map(v => \`
        <line x1="\${getX(v)}" y1="\${padding.top}" x2="\${getX(v)}" y2="\${padding.top + chartH}" stroke="\${BRAND.border}" stroke-dasharray="2,3" opacity="0.6" />
        <text x="\${getX(v)}" y="\${padding.top + chartH + 16}" fill="\${BRAND.textDim}" font-size="10" font-family="'JetBrains Mono',monospace" text-anchor="middle">$\${v}</text>
      \`).join('')}

      <!-- Axes -->
      <line x1="\${padding.left}" y1="\${padding.top + chartH}" x2="\${padding.left + chartW}" y2="\${padding.top + chartH}" stroke="\${BRAND.borderHover}" stroke-width="1.5" />
      <line x1="\${padding.left}" y1="\${padding.top}" x2="\${padding.left}" y2="\${padding.top + chartH}" stroke="\${BRAND.borderHover}" stroke-width="1.5" />

      <!-- Axis Labels -->
      <text x="\${padding.left + chartW / 2}" y="\${height - 8}" fill="\${BRAND.textMuted}" font-size="11" font-family="'Inter',sans-serif" text-anchor="middle">\${t(dict, 'pfCostAxis')}</text>
      <text x="\${padding.left + 8}" y="\${padding.top - 10}" fill="\${BRAND.textMuted}" font-size="11" font-family="'Inter',sans-serif">\${t(dict, 'pfAccAxis')}</text>

      <!-- Optimal Pareto Boundary Curve -->
      <path d="M \${getX(0.85)} \${getY(71.4)} Q \${getX(2.2)} \${getY(83.0)} \${getX(22.0)} \${getY(89.2)}" fill="none" stroke="\${BRAND.savingsMint}" stroke-width="2" stroke-dasharray="4,4" opacity="0.75" />
      <text x="\${getX(2.0)}" y="\${getY(82.5) - 12}" fill="\${BRAND.savingsMint}" font-size="10.5" font-family="'JetBrains Mono',monospace" font-weight="600">\${t(dict, 'pfBoundary')}</text>

      <!-- Tracking Crosshair -->
      <g id="pf-crosshair" style="opacity:0; pointer-events:none; transition:opacity 0.15s ease;">
        <line id="pf-ch-x" x1="0" y1="\${padding.top}" x2="0" y2="\${padding.top + chartH}" stroke="\${BRAND.crosshair}" stroke-width="1" stroke-dasharray="3,3" />
        <line id="pf-ch-y" x1="\${padding.left}" y1="0" x2="\${padding.left + chartW}" y2="0" stroke="\${BRAND.crosshair}" stroke-width="1" stroke-dasharray="3,3" />
        <circle id="pf-halo" cx="0" cy="0" r="14" fill="\${BRAND.savingsMint}" fill-opacity="0.25" />
      </g>
    \`;

    // Render Points
    models.forEach((m, i) => {
      const cx = getX(m.cost);
      const cy = getY(m.acc);
      svg += \`
        <g class="pf-node" data-index="\${i}" style="cursor:pointer;">
          <circle cx="\${cx}" cy="\${cy}" r="6.5" fill="\${m.color}" stroke="#FFFFFF" stroke-width="1.5" />
          <text x="\${cx + 8}" y="\${cy + 4}" fill="\${BRAND.textWhite}" font-size="11" font-family="'JetBrains Mono',monospace" font-weight="600">\${m.name}</text>
          <text x="\${cx + 8}" y="\${cy + 16}" fill="\${BRAND.textMuted}" font-size="9.5" font-family="'JetBrains Mono',monospace">$\${m.cost.toFixed(2)} / \${m.acc}%</text>
        </g>
      \`;
    });

    stage.innerHTML = \`<svg id="pf-svg" viewBox="0 0 \${width} \${height}" style="width:100%;height:auto;overflow:visible;user-select:none;">\${svg}</svg>\`;

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

        readoutMain.innerHTML = \`
          <span style="font-family:'JetBrains Mono',monospace;font-size:11.5px;font-weight:700;color:#FFFFFF;background:\${BRAND.wellBg};padding:2px 8px;border-radius:4px;border:1px solid \${BRAND.crosshair};">\${m.name}</span>
          <div style="display:flex;align-items:center;gap:12px;font-size:12px;font-family:'JetBrains Mono',monospace;">
            <span><strong style="color:\${BRAND.savingsMint}">\${t(dict, 'pfAccLabel')}</strong> \${m.acc}%</span>
            <span style="color:\${BRAND.border}">|</span>
            <span><strong style="color:\${BRAND.burnOrange}">\${t(dict, 'pfCostLabel')}</strong> $\${m.cost.toFixed(2)}</span>
            <span style="color:\${BRAND.border}">|</span>
            <span style="color:\${BRAND.tokenSky}"><strong style="color:\${BRAND.textMuted}">\${t(dict, 'pfEffScore')}</strong> \${ptsPerDollar}</span>
          </div>
        \`;
        readoutDelta.innerHTML = \`<span style="color:\${m.color};font-weight:700;">\${tierLabel}</span>\`;
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

    const defaultStages = [
      { key: "cfIncoming", count: "10M Calls", sharePct: 100, rate: "$0.00 Base", spend: "$0.00", width: 680, color: BRAND.crosshair, y: 22 },
      { key: "cfTier1", count: "6.8M Handled", sharePct: 68, rate: "$0.15/M", spend: "$1.02", width: 490, color: BRAND.tokenSky, y: 68 },
      { key: "cfTier2", count: "2.2M Handled", sharePct: 22, rate: "$3.00/M", spend: "$6.60", width: 290, color: BRAND.outputViolet, y: 114 },
      { key: "cfTier3", count: "1.0M Handled", sharePct: 10, rate: "$25.00/M", spend: "$25.00", width: 160, color: BRAND.burnOrange, y: 160 }
    ];

    const stages = options.stages || defaultStages;
    const title = resolveText(options.title, lang, t(dict, 'cfTitle'));
    const subtitle = resolveText(options.subtitle, lang, t(dict, 'cfSubtitle'));

    container.innerHTML = \`
      <div class="finops-chart-card" dir="\${isRtl ? 'rtl' : 'ltr'}" style="position:relative;background:\${BRAND.cardBg};border:1px solid \${BRAND.border};border-radius:10px;padding:18px 20px;margin:24px 0;font-family:Inter,system-ui,sans-serif;box-shadow:0 10px 30px -10px rgba(0,0,0,0.5);">
        
        <!-- Header -->
        <div style="margin-bottom:12px;text-align:\${isRtl ? 'right' : 'left'};">
          <h3 style="margin:0;font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:\${BRAND.textWhite};letter-spacing:-0.01em;">\${title}</h3>
          <p style="margin:3px 0 0;font-size:12px;color:\${BRAND.textMuted};">\${subtitle}</p>
        </div>

        <!-- Dedicated Non-Obstructing Readout Deck -->
        <div class="finops-readout" dir="\${isRtl ? 'rtl' : 'ltr'}" style="min-height:48px;background:\${BRAND.wellBg};border:1px solid \${BRAND.border};border-radius:8px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;transition:all 0.15s ease;">
          <div class="readout-main" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <span class="readout-tag" style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:\${BRAND.tokenSky};background:\${BRAND.cardBg};padding:2px 8px;border-radius:4px;border:1px solid #2B3D5B;">\${t(dict, 'cfSummaryTag')}</span>
            <span class="readout-text" style="font-size:12px;color:\${BRAND.textMain};">\${t(dict, 'cfSummaryDesc')}</span>
          </div>
          <div class="readout-delta" style="font-family:'JetBrains Mono',monospace;font-size:11.5px;color:\${BRAND.savingsMint};font-weight:600;">\${t(dict, 'cfNetSavings')}</div>
        </div>

        <!-- Unobstructed SVG Stage -->
        <div class="finops-stage" dir="ltr" style="position:relative;width:100%;overflow-x:auto;"></div>

        <!-- Legend / Guidance Footer -->
        <div dir="\${isRtl ? 'rtl' : 'ltr'}" style="padding-top:12px;margin-top:10px;border-top:1px solid \${BRAND.border};display:flex;align-items:center;flex-wrap:wrap;gap:14px;font-size:12px;color:\${BRAND.textMuted};justify-content:\${isRtl ? 'flex-end' : 'flex-start'};">
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:\${BRAND.textDim};">Blended Gateway Spend: $32.62 (86.9% discount vs $250.00 flat Frontier baseline)</span>
        </div>
      </div>
    \`;

    const card = container.querySelector('.finops-chart-card');
    const stage = card.querySelector('.finops-stage');
    const readoutMain = card.querySelector('.readout-main');
    const readoutDelta = card.querySelector('.readout-delta');

    const width = 740, height = 230;
    let svg = '';

    for (let i = 0; i < stages.length - 1; i++) {
      const topS = stages[i];
      const btmS = stages[i + 1];
      const x1 = (width - topS.width) / 2;
      const x2 = x1 + topS.width;
      const yTop = topS.y + 32;
      const x3 = (width - btmS.width) / 2;
      const x4 = x3 + btmS.width;
      const yBtm = btmS.y;

      svg += \`
        <polygon points="\${x1},\${yTop} \${x2},\${yTop} \${x4},\${yBtm} \${x3},\${yBtm}" fill="rgba(255, 255, 255, 0.03)" stroke="\${BRAND.border}" stroke-width="0.5" stroke-dasharray="2,2" />
      \`;
    }

    stages.forEach((s, i) => {
      const x = (width - s.width) / 2;
      const stageName = t(dict, s.key);
      svg += \`
        <g class="cf-stage-group" data-index="\${i}" style="cursor:pointer;">
          <rect class="cf-stage-bar" x="\${x}" y="\${s.y}" width="\${s.width}" height="34" rx="5" fill="\${s.color}" fill-opacity="0.88" stroke="#1E2A3F" stroke-width="1" style="transition:all 0.15s ease;" />
          <text x="\${x + 14}" y="\${s.y + 21}" fill="#0A0F1A" font-size="12" font-family="'Space Grotesk',sans-serif" font-weight="700">\${stageName}</text>
          <text x="\${x + s.width - 14}" y="\${s.y + 21}" fill="#0A0F1A" font-size="11" font-family="'JetBrains Mono',monospace" font-weight="700" text-anchor="end">\${s.count} | \${s.rate}</text>
        </g>
      \`;
    });

    stage.innerHTML = \`<svg id="cf-svg" viewBox="0 0 \${width} \${height}" style="width:100%;height:auto;overflow:visible;user-select:none;">\${svg}</svg>\`;

    const stageGroups = stage.querySelectorAll('.cf-stage-group');
    const defaultMain = readoutMain.innerHTML;
    const defaultDelta = readoutDelta.innerHTML;

    stageGroups.forEach(grp => {
      const idx = parseInt(grp.getAttribute('data-index'), 10);
      const s = stages[idx];
      const bar = grp.querySelector('.cf-stage-bar');
      const stageName = t(dict, s.key);

      grp.addEventListener('mouseenter', () => {
        bar.setAttribute('fill-opacity', '1.0');
        bar.setAttribute('stroke', '#FFFFFF');
        bar.setAttribute('stroke-width', '1.5');

        readoutMain.innerHTML = \`
          <span style="font-family:'JetBrains Mono',monospace;font-size:11.5px;font-weight:700;color:#FFFFFF;background:\${BRAND.wellBg};padding:2px 8px;border-radius:4px;border:1px solid \${s.color};">\${stageName}</span>
          <div style="display:flex;align-items:center;gap:12px;font-size:12px;font-family:'JetBrains Mono',monospace;">
            <span><strong style="color:\${BRAND.textMuted}">\${t(dict, 'cfVolume')}</strong> \${s.count}</span>
            <span style="color:\${BRAND.border}">|</span>
            <span><strong style="color:\${BRAND.tokenSky}">\${t(dict, 'cfRate')}</strong> \${s.rate}</span>
            <span style="color:\${BRAND.border}">|</span>
            <span><strong style="color:\${BRAND.savingsMint}">\${t(dict, 'cfSubtotal')}</strong> \${s.spend}</span>
          </div>
        \`;
        readoutDelta.innerHTML = \`<span style="color:\${s.color};font-weight:700;">\${t(dict, 'cfShare')} \${s.sharePct}%</span>\`;
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

    container.innerHTML = \`
      <div class="finops-chart-card" dir="\${isRtl ? 'rtl' : 'ltr'}" style="position:relative;background:\${BRAND.cardBg};border:1px solid \${BRAND.border};border-radius:10px;padding:18px 20px;margin:24px 0;font-family:Inter,system-ui,sans-serif;box-shadow:0 10px 30px -10px rgba(0,0,0,0.5);">
        
        <!-- Header -->
        <div style="margin-bottom:12px;text-align:\${isRtl ? 'right' : 'left'};">
          <h3 style="margin:0;font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:\${BRAND.textWhite};letter-spacing:-0.01em;">\${title}</h3>
          <p style="margin:3px 0 0;font-size:12px;color:\${BRAND.textMuted};">\${subtitle}</p>
        </div>

        <!-- Dedicated Non-Obstructing Readout Deck -->
        <div class="finops-readout" dir="\${isRtl ? 'rtl' : 'ltr'}" style="min-height:48px;background:\${BRAND.wellBg};border:1px solid \${BRAND.border};border-radius:8px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;transition:all 0.15s ease;">
          <div class="readout-main" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <span class="readout-tag" style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:\${BRAND.burnOrange};background:\${BRAND.cardBg};padding:2px 8px;border-radius:4px;border:1px solid #2B3D5B;">\${t(dict, 'meSummaryTag')}</span>
            <span class="readout-text" style="font-size:12px;color:\${BRAND.textMain};">\${t(dict, 'meSummaryDesc')}</span>
          </div>
          <div class="readout-delta" style="font-family:'JetBrains Mono',monospace;font-size:11.5px;color:\${BRAND.burnOrange};font-weight:600;">\${t(dict, 'meTopLoss')}</div>
        </div>

        <!-- Unobstructed SVG Stage -->
        <div class="finops-stage" dir="ltr" style="position:relative;width:100%;overflow-x:auto;"></div>

        <!-- Legend / Guidance Footer -->
        <div dir="\${isRtl ? 'rtl' : 'ltr'}" style="padding-top:12px;margin-top:10px;border-top:1px solid \${BRAND.border};display:flex;align-items:center;flex-wrap:wrap;gap:14px;font-size:12px;color:\${BRAND.textMuted};justify-content:\${isRtl ? 'flex-end' : 'flex-start'};">
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:\${BRAND.warningAmber};">\${t(dict, 'meRevenueCeiling')} ($\${seatRev.toFixed(2)}/seat/mo)</span>
        </div>
      </div>
    \`;

    const card = container.querySelector('.finops-chart-card');
    const stage = card.querySelector('.finops-stage');
    const readoutMain = card.querySelector('.readout-main');
    const readoutDelta = card.querySelector('.readout-delta');

    const width = 740, height = 240;
    const padding = { top: 25, right: 35, bottom: 35, left: 190 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;
    const maxVal = 100.0;

    function getBarW(val) {
      return (val / maxVal) * chartW;
    }

    const ceilingX = padding.left + getBarW(seatRev);

    let svg = \`
      <!-- Grid ticks -->
      \${[0, 20, 40, 60, 80, 100].map(v => \`
        <line x1="\${padding.left + getBarW(v)}" y1="\${padding.top}" x2="\${padding.left + getBarW(v)}" y2="\${padding.top + chartH}" stroke="\${BRAND.border}" stroke-dasharray="2,3" opacity="0.6" />
        <text x="\${padding.left + getBarW(v)}" y="\${padding.top + chartH + 16}" fill="\${BRAND.textDim}" font-size="10" font-family="'JetBrains Mono',monospace" text-anchor="middle">$\${v}</text>
      \`).join('')}

      <!-- Revenue Ceiling Line at $40 -->
      <line x1="\${ceilingX}" y1="\${padding.top - 10}" x2="\${ceilingX}" y2="\${padding.top + chartH}" stroke="\${BRAND.warningAmber}" stroke-width="1.5" stroke-dasharray="3,3" />
      <text x="\${ceilingX}" y="\${padding.top - 14}" fill="\${BRAND.warningAmber}" font-size="10" font-family="'JetBrains Mono',monospace" text-anchor="middle">$\${seatRev.toFixed(0)} Seat Ceiling</text>
    \`;

    const rowH = chartH / cohorts.length;

    cohorts.forEach((c, i) => {
      const y = padding.top + i * rowH + (rowH - 24) / 2;
      const barW = getBarW(c.cost);
      const cohortName = t(dict, c.key);
      const marginStr = c.isLoss ? \`\${c.pct.toFixed(1)}% \${t(dict, 'meNetLoss')}\` : \`+\${c.pct.toFixed(1)}% \${t(dict, 'meGrossMargin')}\`;

      svg += \`
        <g class="me-cohort-row" data-index="\${i}" style="cursor:pointer;">
          <text x="\${padding.left - 12}" y="\${y + 16}" fill="\${BRAND.textWhite}" font-size="11" font-family="'Inter',sans-serif" font-weight="600" text-anchor="end">\${cohortName}</text>
          <rect x="\${padding.left}" y="\${y}" width="\${chartW}" height="24" rx="4" fill="\${BRAND.wellBg}" />
          <rect class="me-bar" x="\${padding.left}" y="\${y}" width="\${barW}" height="24" rx="4" fill="\${c.color}" fill-opacity="0.88" style="transition:all 0.15s ease;" />
          <text x="\${padding.left + barW + 8}" y="\${y + 16}" fill="\${c.color}" font-size="11" font-family="'JetBrains Mono',monospace" font-weight="700">$\${c.cost.toFixed(2)} (\${marginStr})</text>
        </g>
      \`;
    });

    stage.innerHTML = \`<svg id="me-svg" viewBox="0 0 \${width} \${height}" style="width:100%;height:auto;overflow:visible;user-select:none;">\${svg}</svg>\`;

    const rows = stage.querySelectorAll('.me-cohort-row');
    const defaultMain = readoutMain.innerHTML;
    const defaultDelta = readoutDelta.innerHTML;

    rows.forEach(row => {
      const idx = parseInt(row.getAttribute('data-index'), 10);
      const c = cohorts[idx];
      const bar = row.querySelector('.me-bar');
      const cohortName = t(dict, c.key);

      row.addEventListener('mouseenter', () => {
        bar.setAttribute('fill-opacity', '1.0');
        bar.setAttribute('stroke', '#FFFFFF');
        bar.setAttribute('stroke-width', '1.5');

        const profitStr = c.isLoss ? \`-$\${Math.abs(c.profit).toFixed(2)} \${t(dict, 'meLoss')}\` : \`+$\${c.profit.toFixed(2)} \${t(dict, 'meProfit')}\`;

        readoutMain.innerHTML = \`
          <span style="font-family:'JetBrains Mono',monospace;font-size:11.5px;font-weight:700;color:#FFFFFF;background:\${BRAND.wellBg};padding:2px 8px;border-radius:4px;border:1px solid \${c.color};">\${cohortName}</span>
          <div style="display:flex;align-items:center;gap:12px;font-size:12px;font-family:'JetBrains Mono',monospace;">
            <span><strong style="color:\${BRAND.textMuted}">\${t(dict, 'meRevenue')}</strong> $\${seatRev.toFixed(2)}/seat</span>
            <span style="color:\${BRAND.border}">|</span>
            <span><strong style="color:\${c.color}">\${t(dict, 'meTokenCost')}</strong> $\${c.cost.toFixed(2)}</span>
            <span style="color:\${BRAND.border}">|</span>
            <span style="color:\${c.isLoss ? BRAND.burnOrange : BRAND.savingsMint}"><strong>Net:</strong> \${profitStr}</span>
          </div>
        \`;
        readoutDelta.innerHTML = \`<span style="color:\${c.isLoss ? BRAND.burnOrange : BRAND.savingsMint};font-weight:700;">\${c.isLoss ? c.pct.toFixed(1) + '% Loss' : '+' + c.pct.toFixed(1) + '% Margin'}</span>\`;
      });

      row.addEventListener('mouseleave', () => {
        bar.setAttribute('fill-opacity', '0.88');
        bar.setAttribute('stroke', 'none');
        readoutMain.innerHTML = defaultMain;
        readoutDelta.innerHTML = defaultDelta;
      });
    });
  }

  // ==========================================
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

    container.innerHTML = \`
      <div class="finops-chart-card" dir="\${isRtl ? 'rtl' : 'ltr'}" style="position:relative;background:\${BRAND.cardBg};border:1px solid \${BRAND.border};border-radius:10px;padding:18px 20px;margin:24px 0;font-family:Inter,system-ui,sans-serif;box-shadow:0 10px 30px -10px rgba(0,0,0,0.5);">
        
        <!-- Header -->
        <div style="margin-bottom:12px;text-align:\${isRtl ? 'right' : 'left'};">
          <h3 style="margin:0;font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:\${BRAND.textWhite};letter-spacing:-0.01em;">\${title}</h3>
          <p style="margin:3px 0 0;font-size:12px;color:\${BRAND.textMuted};">\${subtitle}</p>
        </div>

        <!-- Dedicated Non-Obstructing Readout Deck -->
        <div class="finops-readout" dir="\${isRtl ? 'rtl' : 'ltr'}" style="min-height:48px;background:\${BRAND.wellBg};border:1px solid \${BRAND.border};border-radius:8px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;transition:all 0.15s ease;">
          <div class="readout-main" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <span class="readout-tag" style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:\${BRAND.savingsMint};background:\${BRAND.cardBg};padding:2px 8px;border-radius:4px;border:1px solid #2B3D5B;">\${t(dict, 'ttlSummaryTag')}</span>
            <span class="readout-text" style="font-size:12px;color:\${BRAND.textMain};">\${t(dict, 'ttlSummaryDesc')}</span>
          </div>
          <div class="readout-delta" style="font-family:'JetBrains Mono',monospace;font-size:11.5px;color:\${BRAND.warningAmber};font-weight:600;">\${t(dict, 'ttlThreshold')}</div>
        </div>

        <!-- Unobstructed SVG Stage -->
        <div class="finops-stage" dir="ltr" style="position:relative;width:100%;overflow-x:auto;"></div>

        <!-- Legend -->
        <div dir="\${isRtl ? 'rtl' : 'ltr'}" style="padding-top:12px;margin-top:10px;border-top:1px solid \${BRAND.border};display:flex;align-items:center;flex-wrap:wrap;gap:14px;font-size:12px;color:\${BRAND.textMuted};justify-content:\${isRtl ? 'flex-end' : 'flex-start'};">
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:\${BRAND.savingsMint};"></span> \${t(dict, 'ttlHotZone')}</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:\${BRAND.burnOrange};"></span> \${t(dict, 'ttlColdZone')}</span>
        </div>
      </div>
    \`;

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

    let svg = \`
      <!-- Zone Backgrounds -->
      <rect x="\${padding.left}" y="\${padding.top}" width="\${boundaryX - padding.left}" height="\${chartH}" fill="rgba(74, 222, 128, 0.08)" />
      <rect x="\${boundaryX}" y="\${padding.top}" width="\${padding.left + chartW - boundaryX}" height="\${chartH}" fill="rgba(234, 88, 12, 0.08)" />

      <!-- Horizontal Rate Grid Lines -->
      \${[0.50, 1.50, 2.50, 3.75].map(r => \`
        <line x1="\${padding.left}" y1="\${getY(r)}" x2="\${padding.left + chartW}" y2="\${getY(r)}" stroke="\${BRAND.border}" stroke-dasharray="2,3" opacity="0.6" />
        <text x="\${padding.left - 8}" y="\${getY(r) + 4}" fill="\${BRAND.textDim}" font-size="10" font-family="'JetBrains Mono',monospace" text-anchor="end">$\${r.toFixed(2)}</text>
      \`).join('')}

      <!-- Time Ticks -->
      \${[0, 2, 4, 5, 6, 8, 10].map(m => \`
        <line x1="\${getX(m)}" y1="\${padding.top + chartH}" x2="\${getX(m)}" y2="\${padding.top + chartH + 5}" stroke="\${BRAND.borderHover}" />
        <text x="\${getX(m)}" y="\${padding.top + chartH + 18}" fill="\${m === 5 ? BRAND.warningAmber : BRAND.textDim}" font-size="10" font-family="'JetBrains Mono',monospace" text-anchor="middle" font-weight="\${m === 5 ? 700 : 400}">\${m}m</text>
      \`).join('')}

      <!-- 5-min TTL Boundary Line -->
      <line x1="\${boundaryX}" y1="\${padding.top - 8}" x2="\${boundaryX}" y2="\${padding.top + chartH}" stroke="\${BRAND.warningAmber}" stroke-width="2" stroke-dasharray="4,4" />
      <text x="\${boundaryX}" y="\${padding.top - 12}" fill="\${BRAND.warningAmber}" font-size="10" font-family="'JetBrains Mono',monospace" text-anchor="middle" font-weight="700">\${t(dict, 'ttlBoundary')}</text>

      <!-- Sigmoidal / Step-Up Cost Decay Curve -->
      <path d="M \${getX(0)} \${getY(hotRate)} L \${getX(4.0)} \${getY(hotRate)} C \${getX(4.8)} \${getY(hotRate)}, \${getX(5.0)} \${getY(coldRate * 0.7)}, \${getX(5.5)} \${getY(coldRate)} L \${getX(10.0)} \${getY(coldRate)}" fill="none" stroke="\${BRAND.savingsMint}" stroke-width="3" stroke-linecap="round" />

      <!-- Interactive Crosshair Tracker -->
      <g id="ttl-track" style="opacity:0; pointer-events:none; transition:opacity 0.15s ease;">
        <line id="ttl-ch-x" x1="0" y1="\${padding.top}" x2="0" y2="\${padding.top + chartH}" stroke="\${BRAND.crosshair}" stroke-width="1.5" stroke-dasharray="3,3" />
        <circle id="ttl-halo" cx="0" cy="0" r="10" fill="rgba(74, 222, 128, 0.3)" />
        <circle id="ttl-dot" cx="0" cy="0" r="5" fill="\${BRAND.savingsMint}" stroke="#FFFFFF" stroke-width="2" />
      </g>

      <!-- Transparent Hitbox -->
      <rect id="ttl-hitbox" x="\${padding.left}" y="\${padding.top}" width="\${chartW}" height="\${chartH}" fill="transparent" style="cursor:crosshair;" />
    \`;

    stage.innerHTML = \`<svg id="ttl-svg" viewBox="0 0 \${width} \${height}" style="width:100%;height:auto;overflow:visible;user-select:none;">\${svg}</svg>\`;

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

      readoutMain.innerHTML = \`
        <span style="font-family:'JetBrains Mono',monospace;font-size:11.5px;font-weight:700;color:#FFFFFF;background:\${BRAND.wellBg};padding:2px 8px;border-radius:4px;border:1px solid \${statusColor};">\${t(dict, 'ttlInterval')} \${m.toFixed(1)}m</span>
        <div style="display:flex;align-items:center;gap:12px;font-size:12px;font-family:'JetBrains Mono',monospace;">
          <span><strong style="color:\${statusColor}">\${t(dict, 'ttlState')}</strong> \${statusLabel}</span>
          <span style="color:\${BRAND.border}">|</span>
          <span><strong style="color:\${BRAND.textMuted}">\${t(dict, 'ttlEffRate')}</strong> $\${currentRate.toFixed(2)}/M</span>
          <span style="color:\${BRAND.border}">|</span>
          <span><strong style="color:\${BRAND.tokenSky}">\${t(dict, 'ttlLatency')}</strong> \${latencyStr}</span>
        </div>
      \`;
      readoutDelta.innerHTML = \`<span style="color:\${statusColor};font-weight:700;">\${isHit ? t(dict, 'ttlDiscount') : t(dict, 'ttlPenalty')}</span>\`;
    });

    hitbox.addEventListener('mouseleave', () => {
      track.style.opacity = '0';
      readoutMain.innerHTML = defaultMain;
      readoutDelta.innerHTML = defaultDelta;
    });
  }
`;

// Now process src/assets/finops-charts.js
const jsPath = 'src/assets/finops-charts.js';
let jsContent = fs.readFileSync(jsPath, 'utf8');

// Inject DICTS into each language
for (const [lang, translations] of Object.entries(DICTS)) {
  const langKey = '"' + lang + '": {';
  const pos = jsContent.indexOf(langKey);
  if (pos !== -1) {
    const lines = Object.entries(translations).map(([k, v]) => '    ' + JSON.stringify(k) + ': ' + JSON.stringify(v) + ',').join('\n');
    // Insert right after "lang": {
    const insertPos = pos + langKey.length;
    jsContent = jsContent.slice(0, insertPos) + '\n' + lines + jsContent.slice(insertPos);
  }
}

// Inject functions before "  // Auto-init for data-finops-chart attributes"
const autoInitTarget = "  // Auto-init for data-finops-chart attributes";
if (jsContent.includes(autoInitTarget)) {
  jsContent = jsContent.replace(autoInitTarget, FUNCTIONS_CODE + '\n' + autoInitTarget);
}

// Update initAll()
const initWaterfall = "else if (type === 'waterfall') waterfall(el, config);";
const initNew = `else if (type === 'waterfall') waterfall(el, config);
      else if (type === 'pareto-frontier' || type === 'paretoFrontier') paretoFrontier(el, config);
      else if (type === 'cascade-funnel' || type === 'cascadeFunnel') cascadeFunnel(el, config);
      else if (type === 'margin-erosion' || type === 'marginErosion') marginErosion(el, config);
      else if (type === 'ttl-decay' || type === 'ttlDecay') ttlDecay(el, config);`;
jsContent = jsContent.replace(initWaterfall, initNew);

// Update return export
const returnWaterfall = "waterfall,\n    initAll";
const returnNew = "waterfall,\n    paretoFrontier,\n    cascadeFunnel,\n    marginErosion,\n    ttlDecay,\n    initAll";
jsContent = jsContent.replace(returnWaterfall, returnNew);

fs.writeFileSync(jsPath, jsContent, 'utf8');
console.log('Successfully updated src/assets/finops-charts.js with 4 new charts and 16 locales!');


