import fs from 'fs';
import path from 'path';

const jsEngine = fs.readFileSync('src/assets/finops-charts.js', 'utf8');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>FinOps LLM — Interactive Chart Gallery & Review Demo</title>
<script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" />
<style>
  :root {
    --canvas: #0A0F1A;
    --card: #101726;
    --well: #0B1437;
    --border: #1E2A3F;
    --border-hover: #2B3D5B;
    --text-white: #FFFFFF;
    --text-main: #E6EAF2;
    --text-muted: #8C98AC;
    --text-dim: #647289;
    --mint: #4ADE80;
    --sky: #38BDF8;
    --blue: #1D4ED8;
    --violet: #818CF8;
    --orange: #EA580C;
    --amber: #F59E0B;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--canvas);
    color: var(--text-main);
    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    line-height: 1.6;
    padding-bottom: 80px;
  }
  .wrap {
    max-width: 980px;
    margin: 0 auto;
    padding: 32px 20px;
  }
  header.gallery-header {
    margin-bottom: 28px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border);
  }
  h1.gallery-title {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-size: 26px;
    font-weight: 700;
    color: var(--text-white);
    letter-spacing: -0.02em;
    margin: 0 0 8px;
  }
  p.gallery-sub {
    color: var(--text-muted);
    font-size: 13.5px;
    margin: 0 0 16px;
    max-width: 820px;
  }
  .badge-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }
  .badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    color: var(--sky);
    background: var(--well);
    border: 1px solid #2B3D5B;
    padding: 3px 10px;
    border-radius: 4px;
  }
  .badge.mint {
    color: var(--mint);
    border-color: rgba(74, 222, 128, 0.4);
  }
  .badge.amber {
    color: var(--amber);
    border-color: rgba(245, 158, 11, 0.4);
  }

  /* Language Switcher Bar */
  .lang-switcher-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px 18px;
    margin-bottom: 16px;
  }
  .lang-switcher-title {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-size: 12px;
    font-weight: 700;
    color: var(--text-white);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .lang-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .lang-btn {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 600;
    padding: 5px 11px;
    border-radius: 5px;
    border: 1px solid var(--border);
    background: var(--well);
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .lang-btn:hover {
    border-color: var(--sky);
    color: var(--text-white);
  }
  .lang-btn.active {
    background: var(--sky);
    color: #0A0F1A;
    border-color: var(--sky);
    font-weight: 700;
  }

  /* Filter Bar */
  .filter-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px 18px;
    margin-bottom: 32px;
  }
  .filter-btn {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 12px;
    font-weight: 600;
    padding: 6px 13px;
    border-radius: 5px;
    border: 1px solid var(--border);
    background: var(--well);
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .filter-btn:hover {
    border-color: var(--border-hover);
    color: var(--text-white);
  }
  .filter-btn.active {
    background: #1E2A3F;
    color: var(--text-white);
    border-color: var(--sky);
  }

  /* Section Styles */
  section.gallery-section {
    margin-top: 36px;
  }
  h2.section-heading {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-size: 19px;
    font-weight: 700;
    color: var(--text-white);
    margin: 0 0 4px;
    letter-spacing: -0.01em;
  }
  p.section-desc {
    font-size: 13px;
    color: var(--text-muted);
    margin: 0 0 20px;
  }

  /* Interactive Playground */
  .playground-box {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 24px;
  }
  .playground-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 16px;
  }
  .control-group label {
    display: block;
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-size: 11.5px;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 6px;
  }
  .control-group input[type="range"] {
    width: 100%;
    accent-color: var(--sky);
  }
  .control-val {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: var(--mint);
    margin-top: 4px;
  }

  /* Code block snippet */
  .code-snippet {
    background: #060A12;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 10px 14px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #A5B4FC;
    overflow-x: auto;
    margin-top: 8px;
  }

  .chart-card-wrapper {
    margin-bottom: 36px;
    transition: opacity 0.2s ease;
  }
</style>
</head>
<body>

<div class="wrap">
  <header class="gallery-header">
    <h1 class="gallery-title">FinOps LLM — Interactive Chart Gallery & Review Demo</h1>
    <p class="gallery-sub">
      Live review deck showcasing all 9 vector chart engines engineered for FinOps LLM technical research articles.
      Every chart features a dedicated non-obstructing telemetry readout deck, zero icons/emojis, responsive SVG vector graphics, and 100% dynamic 16-language internationalization.
    </p>
    <div class="badge-bar">
      <span class="badge mint">9 PRODUCTION CHARTS</span>
      <span class="badge">16 LANGUAGES SUPPORTED</span>
      <span class="badge">NON-OBSTRUCTING TELEMETRY</span>
      <span class="badge amber">ZERO DEPENDENCIES</span>
    </div>
  </header>

  <!-- Language Switcher Bar -->
  <div class="lang-switcher-card">
    <div class="lang-switcher-title">
      <span>Language Mirror Selector (16 Locales)</span>
      <span id="active-lang-indicator" style="font-family:'JetBrains Mono',monospace;color:var(--sky);font-size:12px;">Current: EN (English)</span>
    </div>
    <div class="lang-buttons" id="lang-btn-container"></div>
  </div>

  <!-- Filter by Chart Type Bar -->
  <div class="filter-card">
    <div class="lang-switcher-title">
      <span>Quick Chart Selector</span>
      <span id="active-filter-indicator" style="font-family:'JetBrains Mono',monospace;color:var(--mint);font-size:12px;">Showing: All 9 Charts</span>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;">
      <button class="filter-btn active" data-filter="all">All Charts (9)</button>
      <button class="filter-btn" data-filter="pareto-frontier" style="border-color:rgba(74,222,128,0.4);color:var(--mint);">New: Pareto Frontier</button>
      <button class="filter-btn" data-filter="cascade-funnel" style="border-color:rgba(56,189,248,0.4);color:var(--sky);">New: Cascade Funnel</button>
      <button class="filter-btn" data-filter="margin-erosion" style="border-color:rgba(234,88,12,0.4);color:var(--orange);">New: Margin Erosion</button>
      <button class="filter-btn" data-filter="ttl-decay" style="border-color:rgba(245,158,11,0.4);color:var(--amber);">New: TTL Decay</button>
      <button class="filter-btn" data-filter="grouped-bar">Grouped Bar</button>
      <button class="filter-btn" data-filter="break-even">Break-Even Line</button>
      <button class="filter-btn" data-filter="token-donut">Token Donut</button>
      <button class="filter-btn" data-filter="horizontal-delta">Horizontal Delta</button>
      <button class="filter-btn" data-filter="waterfall">Context Waterfall</button>
      <button class="filter-btn" data-filter="playground">Parameter Playground</button>
    </div>
  </div>

  <!-- SECTION: THE 4 NEW ARCHITECTURE DECISION CHARTS -->
  <section class="gallery-section" id="section-new-charts">
    <h2 class="section-heading">4 New Decision & Architecture Models</h2>
    <p class="section-desc">Four specialized visual models designed for model evaluation, AI gateway routing, SaaS unit margins, and prompt caching cadence.</p>

    <!-- New Chart 6: Cost-Quality Pareto Frontier -->
    <div class="chart-card-wrapper" data-chart-id="pareto-frontier">
      <div id="chart-pareto-frontier"></div>
      <div class="code-snippet">&lt;div data-finops-chart="pareto-frontier"&gt;&lt;/div&gt;</div>
    </div>

    <!-- New Chart 7: Multi-Tier Cascade Routing Funnel -->
    <div class="chart-card-wrapper" data-chart-id="cascade-funnel">
      <div id="chart-cascade-funnel"></div>
      <div class="code-snippet">&lt;div data-finops-chart="cascade-funnel"&gt;&lt;/div&gt;</div>
    </div>

    <!-- New Chart 8: SaaS Gross Margin Erosion Meter -->
    <div class="chart-card-wrapper" data-chart-id="margin-erosion">
      <div id="chart-margin-erosion"></div>
      <div class="code-snippet">&lt;div data-finops-chart="margin-erosion" data-finops-config='{"seatRevenue":40.00}'&gt;&lt;/div&gt;</div>
    </div>

    <!-- New Chart 9: Prompt Cache TTL Decay Timeline -->
    <div class="chart-card-wrapper" data-chart-id="ttl-decay">
      <div id="chart-ttl-decay"></div>
      <div class="code-snippet">&lt;div data-finops-chart="ttl-decay" data-finops-config='{"hotRate":0.30,"coldRate":3.75,"ttlMinutes":5.0}'&gt;&lt;/div&gt;</div>
    </div>
  </section>

  <!-- SECTION: 5 CORE PRODUCTION CHARTS -->
  <section class="gallery-section" id="section-core-charts">
    <h2 class="section-heading">5 Core Visualizations (Production Library)</h2>
    <p class="section-desc">The foundational interactive chart templates currently deployed across production articles on finopsllm.com.</p>

    <!-- Chart 1: Grouped Bar -->
    <div class="chart-card-wrapper" data-chart-id="grouped-bar">
      <div id="chart-grouped-bar"></div>
      <div class="code-snippet">&lt;div data-finops-chart="grouped-bar"&gt;&lt;/div&gt;</div>
    </div>

    <!-- Chart 2: Break-Even -->
    <div class="chart-card-wrapper" data-chart-id="break-even">
      <div id="chart-break-even"></div>
      <div class="code-snippet">&lt;div data-finops-chart="break-even" data-finops-config='{"ptuFixed":7440,"onDemandRate":10.00,"ptuMarginal":1.50}'&gt;&lt;/div&gt;</div>
    </div>

    <!-- Chart 3: Token Donut -->
    <div class="chart-card-wrapper" data-chart-id="token-donut">
      <div id="chart-token-donut"></div>
      <div class="code-snippet">&lt;div data-finops-chart="token-donut"&gt;&lt;/div&gt;</div>
    </div>

    <!-- Chart 4: Horizontal Delta -->
    <div class="chart-card-wrapper" data-chart-id="horizontal-delta">
      <div id="chart-horizontal-delta"></div>
      <div class="code-snippet">&lt;div data-finops-chart="horizontal-delta"&gt;&lt;/div&gt;</div>
    </div>

    <!-- Chart 5: Context Waterfall -->
    <div class="chart-card-wrapper" data-chart-id="waterfall">
      <div id="chart-waterfall"></div>
      <div class="code-snippet">&lt;div data-finops-chart="waterfall"&gt;&lt;/div&gt;</div>
    </div>
  </section>

  <!-- SECTION: INTERACTIVE PLAYGROUND -->
  <section class="gallery-section chart-card-wrapper" data-chart-id="playground">
    <h2 class="section-heading">Live Dynamic Playground</h2>
    <p class="section-desc">Adjust mathematical inputs to see the engine dynamically recalculate crossover thresholds, coordinate projections, and re-draw SVGs in real time.</p>
    
    <div class="playground-box">
      <div class="playground-grid">
        <div class="control-group">
          <label>PTU Fixed Base ($/mo)</label>
          <input type="range" id="param-fixed" min="3000" max="15000" step="500" value="7440" />
          <div class="control-val" id="val-fixed">$7,440/mo</div>
        </div>
        <div class="control-group">
          <label>PayGo On-Demand ($/1M)</label>
          <input type="range" id="param-ondemand" min="4.00" max="25.00" step="0.50" value="10.00" />
          <div class="control-val" id="val-ondemand">$10.00/M</div>
        </div>
        <div class="control-group">
          <label>PTU Marginal Fee ($/1M)</label>
          <input type="range" id="param-marginal" min="0.50" max="4.00" step="0.25" value="1.50" />
          <div class="control-val" id="val-marginal">$1.50/M</div>
        </div>
        <div class="control-group">
          <label>Volume Horizon (Tokens)</label>
          <input type="range" id="param-range" min="1000" max="4000" step="250" value="2000" />
          <div class="control-val" id="val-range">2,000M Tokens</div>
        </div>
      </div>
      <div id="playground-chart-target"></div>
    </div>
  </section>
</div>

<!-- EMBEDDED FINOPS CHARTS ENGINE -->
<script>
${jsEngine}
</script>

<!-- GALLERY PAGE CONTROLLER -->
<script>
  let currentLang = 'en';

  const langsList = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'German' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'ja', name: 'Japanese' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'it', name: 'Italian' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'nl', name: 'Dutch' },
    { code: 'ar', name: 'Arabic (RTL)' },
    { code: 'ru', name: 'Russian' },
    { code: 'tr', name: 'Turkish' },
    { code: 'pl', name: 'Polish' },
    { code: 'id', name: 'Indonesian' },
    { code: 'vi', name: 'Vietnamese' }
  ];

  // Render language switcher buttons
  const btnContainer = document.getElementById('lang-btn-container');
  langsList.forEach(l => {
    const btn = document.createElement('button');
    btn.className = 'lang-btn' + (l.code === currentLang ? ' active' : '');
    btn.innerText = l.code.toUpperCase();
    btn.title = l.name;
    btn.addEventListener('click', () => switchLanguage(l.code, l.name));
    btnContainer.appendChild(btn);
  });

  function renderAllCharts(lang) {
    // 4 New Decision & Architecture Charts
    FinOpsCharts.paretoFrontier('#chart-pareto-frontier', { lang: lang });
    FinOpsCharts.cascadeFunnel('#chart-cascade-funnel', { lang: lang });
    FinOpsCharts.marginErosion('#chart-margin-erosion', { lang: lang });
    FinOpsCharts.ttlDecay('#chart-ttl-decay', { lang: lang });

    // 5 Core Production Charts
    FinOpsCharts.groupedBar('#chart-grouped-bar', { lang: lang });
    FinOpsCharts.breakEven('#chart-break-even', { lang: lang });
    FinOpsCharts.tokenDonut('#chart-token-donut', { lang: lang });
    FinOpsCharts.horizontalDelta('#chart-horizontal-delta', { lang: lang });
    FinOpsCharts.waterfall('#chart-waterfall', { lang: lang });
  }

  function switchLanguage(code, name) {
    currentLang = code;
    document.querySelectorAll('.lang-btn').forEach(b => {
      b.classList.toggle('active', b.innerText.toLowerCase() === code);
    });
    document.getElementById('active-lang-indicator').innerText = 'Current: ' + code.toUpperCase() + ' (' + name + ')';
    renderAllCharts(code);
    renderPlayground(code);
  }

  // Filter Buttons Logic
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      const indicator = document.getElementById('active-filter-indicator');
      
      const newSection = document.getElementById('section-new-charts');
      const coreSection = document.getElementById('section-core-charts');

      if (filter === 'all') {
        indicator.innerText = 'Showing: All 9 Charts';
        if (newSection) newSection.style.display = 'block';
        if (coreSection) coreSection.style.display = 'block';
        document.querySelectorAll('.chart-card-wrapper').forEach(w => w.style.display = 'block');
      } else {
        indicator.innerText = 'Showing: ' + btn.innerText;
        document.querySelectorAll('.chart-card-wrapper').forEach(w => {
          const match = w.getAttribute('data-chart-id') === filter;
          w.style.display = match ? 'block' : 'none';
        });
        if (newSection) {
          const hasNewVisible = Array.from(newSection.querySelectorAll('.chart-card-wrapper')).some(w => w.style.display !== 'none');
          newSection.querySelector('.section-heading').style.display = hasNewVisible ? 'block' : 'none';
          newSection.querySelector('.section-desc').style.display = hasNewVisible ? 'block' : 'none';
        }
        if (coreSection) {
          const hasCoreVisible = Array.from(coreSection.querySelectorAll('.chart-card-wrapper')).some(w => w.style.display !== 'none');
          coreSection.querySelector('.section-heading').style.display = hasCoreVisible ? 'block' : 'none';
          coreSection.querySelector('.section-desc').style.display = hasCoreVisible ? 'block' : 'none';
        }
      }
    });
  });

  // Interactive Playground Logic
  const pFixed = document.getElementById('param-fixed');
  const pOnDemand = document.getElementById('param-ondemand');
  const pMarginal = document.getElementById('param-marginal');
  const pRange = document.getElementById('param-range');

  function renderPlayground(lang = currentLang) {
    const fixed = parseFloat(pFixed.value);
    const onDemand = parseFloat(pOnDemand.value);
    const marginal = parseFloat(pMarginal.value);
    const range = parseFloat(pRange.value);

    document.getElementById('val-fixed').innerText = '$' + fixed.toFixed(0) + '/mo';
    document.getElementById('val-ondemand').innerText = '$' + onDemand.toFixed(2) + '/M';
    document.getElementById('val-marginal').innerText = '$' + marginal.toFixed(2) + '/M';
    document.getElementById('val-range').innerText = range.toFixed(0) + 'M Tokens';

    FinOpsCharts.breakEven('#playground-chart-target', {
      lang: lang,
      title: "Interactive Dynamic Playground: Break-Even Simulation",
      subtitle: "Dynamically recalculates spend based on custom parameters: $" + fixed + " base, $" + onDemand.toFixed(2) + "/M on-demand, $" + marginal.toFixed(2) + "/M marginal.",
      ptuFixed: fixed,
      onDemandRate: onDemand,
      ptuMarginal: marginal,
      maxX: range,
      maxY: Math.round(range * onDemand * 1.15)
    });
  }

  [pFixed, pOnDemand, pMarginal, pRange].forEach(inp => {
    inp.addEventListener('input', () => renderPlayground(currentLang));
  });

  // Initial Boot
  document.addEventListener('DOMContentLoaded', () => {
    renderAllCharts('en');
    renderPlayground('en');
  });
</script>
</body>
</html>
`;

// Write to root workspace demo-charts.html
fs.writeFileSync('demo-charts.html', htmlContent, 'utf8');

// Also write to brain artifact directory
const artifactDir = 'C:\\\\Users\\\\yassi\\\\.gemini\\\\antigravity\\\\brain\\\\03c82da3-aa45-4c2d-93c1-ec22f04aca49';
if (fs.existsSync(artifactDir)) {
  fs.writeFileSync(path.join(artifactDir, 'charts_gallery_demo.html'), htmlContent, 'utf8');
}

console.log('Successfully updated demo-charts.html and artifact copy!');
