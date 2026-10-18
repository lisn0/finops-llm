/**
 * FinOps LLM — Interactive Blog Visualizations Engine
 * Lightweight, zero-dependency SVG chart suite built for finopsllm.com research blogs.
 * Engineered with a dedicated Non-Obstructing Telemetry Readout Deck so popups NEVER cover the graphs.
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

  function getTarget(target) {
    return typeof target === 'string' ? document.querySelector(target) : target;
  }

  // ==========================================
  // 1. GROUPED BAR CHART: Direct vs Cloud Parity
  // ==========================================
  function groupedBar(target, options = {}) {
    const container = getTarget(target);
    if (!container) return;

    const data = options.data || [
      { model: "GPT-5.4 Std", directIn: 2.50, directOut: 15.00, azureIn: 2.50, azureOut: 15.00, note: "Full Parity: Azure Global matches Direct OpenAI list exactly." },
      { model: "GPT-5.4 >272K", directIn: 3.50, directOut: 18.00, azureIn: 5.00, azureOut: 22.50, note: "Azure Long-Context Markup: +43% on input, +25% on output." },
      { model: "GPT-5.4 Pro", directIn: 25.00, directOut: 150.00, azureIn: 30.00, azureOut: 180.00, note: "Premium Tier: Azure adds 20% surcharge across input and output." },
      { model: "o3-mini Fast", directIn: 1.10, directOut: 4.40, azureIn: 1.10, azureOut: 4.40, note: "Reasoning Parity: Identical pricing across both direct and Azure endpoints." }
    ];

    const title = options.title || "Grouped Bar: Direct OpenAI vs Azure Global Rates";
    const subtitle = options.subtitle || "Input & output rates per 1M tokens comparing Direct API against Azure Global deployment.";

    container.innerHTML = `
      <div class="finops-chart-card" style="position:relative;background:${BRAND.cardBg};border:1px solid ${BRAND.border};border-radius:10px;padding:18px 20px;margin:24px 0;font-family:Inter,system-ui,sans-serif;box-shadow:0 10px 30px -10px rgba(0,0,0,0.5);">
        
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;gap:12px;">
          <div>
            <h3 style="margin:0;font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:${BRAND.textWhite};letter-spacing:-0.01em;">${title}</h3>
            <p style="margin:3px 0 0;font-size:12px;color:${BRAND.textMuted};">${subtitle}</p>
          </div>
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:${BRAND.crosshair};background:${BRAND.wellBg};padding:3px 8px;border-radius:4px;border:1px solid #2B3D5B;white-space:nowrap;">
            Hover columns
          </span>
        </div>

        <!-- Dedicated Non-Obstructing Telemetry Readout Deck (Never covers the graph) -->
        <div class="finops-readout" style="min-height:48px;background:${BRAND.wellBg};border:1px solid ${BRAND.border};border-radius:8px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;transition:all 0.15s ease;">
          <div class="readout-main" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <span class="readout-tag" style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:${BRAND.crosshair};background:${BRAND.cardBg};padding:2px 8px;border-radius:4px;border:1px solid #2B3D5B;">Summary</span>
            <span class="readout-text" style="font-size:12px;color:${BRAND.textMain};">Hover any model column below to inspect exact input/output rate parity and percentage differentials.</span>
          </div>
          <div class="readout-delta" style="font-family:'JetBrains Mono',monospace;font-size:11.5px;color:${BRAND.savingsMint};font-weight:600;">⚡ 4-Metric Comparison</div>
        </div>

        <!-- Unobstructed SVG Stage -->
        <div class="finops-stage" style="position:relative;width:100%;overflow-x:auto;"></div>

        <!-- Legend -->
        <div style="padding-top:12px;margin-top:10px;border-top:1px solid ${BRAND.border};display:flex;align-items:center;flex-wrap:wrap;gap:14px;font-size:12px;color:${BRAND.textMuted};">
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:${BRAND.tokenSky};"></span> Direct Input</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:${BRAND.tokenBlue};"></span> Azure Input</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:${BRAND.outputViolet};"></span> Direct Output</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:${BRAND.outputPurple};"></span> Azure Output</span>
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
        { label: "Direct In", val: d.directIn, color: BRAND.tokenSky },
        { label: "Azure In", val: d.azureIn, color: BRAND.tokenBlue },
        { label: "Direct Out", val: d.directOut, color: BRAND.outputViolet },
        { label: "Azure Out", val: d.azureOut, color: BRAND.outputPurple }
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
      const band = stage.querySelector(`#gb-band-${i}`);
      const lbl = stage.querySelector(`#gb-lbl-${i}`);
      const bars = [0, 1, 2, 3].map(si => stage.querySelector(`#gb-bar-${i}-${si}`));
      const d = data[i];

      hitbox.addEventListener('mouseenter', () => {
        if (band) { band.setAttribute('fill', 'rgba(122, 175, 255, 0.08)'); band.setAttribute('stroke', '#2B3D5B'); }
        if (lbl) { lbl.setAttribute('fill', BRAND.crosshair); lbl.setAttribute('font-weight', '700'); }
        bars.forEach(b => { if (b) b.style.filter = 'brightness(1.3) drop-shadow(0 2px 8px rgba(122,175,255,0.35))'; });

        const inDelta = d.azureIn - d.directIn;
        const outDelta = d.azureOut - d.directOut;
        const inBadge = inDelta === 0 ? `<span style="color:${BRAND.savingsMint};font-weight:700;">Parity (0%)</span>` : `<span style="color:${BRAND.burnOrange};font-weight:700;">+${Math.round((inDelta/d.directIn)*100)}% Azure</span>`;
        const outBadge = outDelta === 0 ? `<span style="color:${BRAND.savingsMint};font-weight:700;">Parity (0%)</span>` : `<span style="color:${BRAND.burnOrange};font-weight:700;">+${Math.round((outDelta/d.directOut)*100)}% Azure</span>`;

        readoutMain.innerHTML = `
          <span style="font-family:'JetBrains Mono',monospace;font-size:11.5px;font-weight:700;color:#FFFFFF;background:${BRAND.wellBg};padding:2px 8px;border-radius:4px;border:1px solid ${BRAND.crosshair};">${d.model}</span>
          <div style="display:flex;align-items:center;gap:12px;font-size:12px;font-family:'JetBrains Mono',monospace;">
            <span><strong style="color:${BRAND.tokenSky}">Direct In:</strong> $${d.directIn.toFixed(2)} | <strong style="color:${BRAND.tokenBlue}">Azure:</strong> $${d.azureIn.toFixed(2)} (${inBadge})</span>
            <span style="color:${BRAND.border}">|</span>
            <span><strong style="color:${BRAND.outputViolet}">Direct Out:</strong> $${d.directOut.toFixed(2)} | <strong style="color:${BRAND.outputPurple}">Azure:</strong> $${d.azureOut.toFixed(2)} (${outBadge})</span>
          </div>
        `;
        readoutDelta.innerHTML = `<span style="color:${BRAND.textMuted};font-style:italic;font-size:11px;">${d.note}</span>`;
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

    const ptuFixed = options.ptuFixed || 260;
    const onDemandRate = options.onDemandRate || 12.5;
    const ptuMarginal = options.ptuMarginal || 3.2;
    const maxX = options.maxX || 100;
    const maxY = options.maxY || 1500;

    const title = options.title || "Break-Even Curve: On-Demand vs PTU Monthly Reservation";
    const subtitle = options.subtitle || "Identifies the exact token volume threshold where provisioned reservations beat pay-as-you-go.";

    const breakEvenTokens = (ptuFixed / (onDemandRate - ptuMarginal)).toFixed(1);
    const breakEvenCost = (breakEvenTokens * onDemandRate).toFixed(0);

    container.innerHTML = `
      <div class="finops-chart-card" style="position:relative;background:${BRAND.cardBg};border:1px solid ${BRAND.border};border-radius:10px;padding:18px 20px;margin:24px 0;font-family:Inter,system-ui,sans-serif;box-shadow:0 10px 30px -10px rgba(0,0,0,0.5);">
        
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;gap:12px;">
          <div>
            <h3 style="margin:0;font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:${BRAND.textWhite};letter-spacing:-0.01em;">${title}</h3>
            <p style="margin:3px 0 0;font-size:12px;color:${BRAND.textMuted};">${subtitle}</p>
          </div>
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:${BRAND.crosshair};background:${BRAND.wellBg};padding:3px 8px;border-radius:4px;border:1px solid #2B3D5B;white-space:nowrap;">
            Continuous tracker
          </span>
        </div>

        <!-- Dedicated Non-Obstructing Telemetry Readout Deck -->
        <div class="finops-readout" style="min-height:48px;background:${BRAND.wellBg};border:1px solid ${BRAND.border};border-radius:8px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;transition:all 0.15s ease;">
          <div class="readout-main" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <span class="readout-tag" style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:${BRAND.savingsMint};background:${BRAND.cardBg};padding:2px 8px;border-radius:4px;border:1px solid ${BRAND.savingsMint};">Break-Even: ~${breakEvenTokens}M Tokens</span>
            <span class="readout-text" style="font-size:12px;color:${BRAND.textMain};">Monthly threshold where 1x PTU reservation ($260 base + $3.20/M) beats Pay-As-You-Go ($12.50/M).</span>
          </div>
          <div class="readout-delta" style="font-family:'JetBrains Mono',monospace;font-size:11.5px;color:${BRAND.crosshair};font-weight:600;">Spend: ~$${breakEvenCost}/mo identical</div>
        </div>

        <!-- Unobstructed SVG Stage -->
        <div class="finops-stage" style="position:relative;width:100%;overflow-x:auto;"></div>

        <!-- Legend -->
        <div style="padding-top:12px;margin-top:10px;border-top:1px solid ${BRAND.border};display:flex;align-items:center;flex-wrap:wrap;gap:14px;font-size:12px;color:${BRAND.textMuted};">
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:12px;height:2px;background:${BRAND.burnOrange};"></span> Pay-As-You-Go ($12.50/M)</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:12px;height:2px;background:${BRAND.tokenSky};"></span> PTU Reserved ($260 base + $3.20/M)</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:8px;height:8px;border-radius:50%;background:${BRAND.savingsMint};"></span> Break-Even Intersection (~28M)</span>
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
      <text x="${pbe.x}" y="${padding.top - 6}" fill="${BRAND.savingsMint}" font-size="11" font-family="'JetBrains Mono', monospace" font-weight="600" text-anchor="middle">Break-Even ~${breakEvenTokens}M</text>

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
        verdict = `<span style="color:${BRAND.savingsMint};font-weight:700;">🎯 Exact Break-Even: Spend ~$${breakEvenCost}/mo identical</span>`;
      } else if (isPtu) {
        const pct = Math.round((delta / pt.onDemandCost) * 100);
        verdict = `<span style="color:${BRAND.savingsMint};font-weight:700;">⚡ PTU saves $${delta.toFixed(0)}/mo (${pct}% discount)</span>`;
      } else {
        verdict = `<span style="color:${BRAND.warningAmber};font-weight:700;">⚡ PayGo is $${delta.toFixed(0)}/mo cheaper</span>`;
      }

      readoutMain.innerHTML = `
        <span style="font-family:'JetBrains Mono',monospace;font-size:11.5px;font-weight:700;color:#FFFFFF;background:${BRAND.wellBg};padding:2px 8px;border-radius:4px;border:1px solid ${BRAND.crosshair};">${tokens.toFixed(1)}M Tokens / mo</span>
        <div style="display:flex;align-items:center;gap:12px;font-size:12px;font-family:'JetBrains Mono',monospace;">
          <span><strong style="color:${BRAND.burnOrange}">Pay-As-You-Go:</strong> $${pt.onDemandCost.toFixed(0)}/mo</span>
          <span style="color:${BRAND.border}">|</span>
          <span><strong style="color:${BRAND.tokenSky}">PTU Reserved:</strong> $${pt.ptuCost.toFixed(0)}/mo</span>
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

    const data = options.data || [
      { label: "Cached System Prompts", percent: 48, cost: 24.50, tokens: "480k", color: BRAND.savingsMint, desc: "Saved 90% via prompt caching ($24.50 vs $245.00 uncached)", tip: "Prefix caching turns static instructions into negligible cost." },
      { label: "Tool Schema & Context", percent: 24, cost: 36.80, tokens: "240k", color: BRAND.tokenSky, desc: "MCP schemas & conversation history re-sent each turn", tip: "Prune unused tool schemas to recover ~15% prompt budget." },
      { label: "Reasoning / CoT Tokens", percent: 18, cost: 42.00, tokens: "180k", color: BRAND.outputViolet, desc: "Internal thinking steps (billed at high output rate)", tip: "Reasoning tokens are billed as output: cap reasoning effort in simple tasks." },
      { label: "User Output Generation", percent: 10, cost: 31.20, tokens: "100k", color: BRAND.warningAmber, desc: "Final code/response returned to the developer", tip: "Output generation is the highest per-token unit rate." }
    ];

    const title = options.title || "Donut Chart: Typical Agent Session Cost Composition";
    const subtitle = options.subtitle || "Interactive breakdown of where the bill actually goes: system prompts, cache hits, reasoning, and output.";

    container.innerHTML = `
      <div class="finops-chart-card" style="position:relative;background:${BRAND.cardBg};border:1px solid ${BRAND.border};border-radius:10px;padding:18px 20px;margin:24px 0;font-family:Inter,system-ui,sans-serif;box-shadow:0 10px 30px -10px rgba(0,0,0,0.5);">
        
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;gap:12px;">
          <div>
            <h3 style="margin:0;font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:${BRAND.textWhite};letter-spacing:-0.01em;">${title}</h3>
            <p style="margin:3px 0 0;font-size:12px;color:${BRAND.textMuted};">${subtitle}</p>
          </div>
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:${BRAND.crosshair};background:${BRAND.wellBg};padding:3px 8px;border-radius:4px;border:1px solid #2B3D5B;white-space:nowrap;">
            Bi-directional hover
          </span>
        </div>

        <!-- Dedicated Non-Obstructing Telemetry Readout Deck -->
        <div class="finops-readout" style="min-height:48px;background:${BRAND.wellBg};border:1px solid ${BRAND.border};border-radius:8px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;transition:all 0.15s ease;">
          <div class="readout-main" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <span class="readout-tag" style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:${BRAND.crosshair};background:${BRAND.cardBg};padding:2px 8px;border-radius:4px;border:1px solid #2B3D5B;">Session Spend</span>
            <span class="readout-text" style="font-size:12px;color:${BRAND.textMain};">Hover any slice or list row to isolate category cost and inspect architectural optimization levers.</span>
          </div>
          <div class="readout-delta" style="font-family:'JetBrains Mono',monospace;font-size:11.5px;color:${BRAND.savingsMint};font-weight:600;">⚡ Total: $134.50 / 1.0M Tokens</div>
        </div>

        <!-- Unobstructed Donut + Side Panel Layout -->
        <div class="finops-stage" style="position:relative;width:100%;"></div>

        <!-- Legend -->
        <div style="padding-top:12px;margin-top:10px;border-top:1px solid ${BRAND.border};display:flex;align-items:center;flex-wrap:wrap;gap:14px;font-size:12px;color:${BRAND.textMuted};">
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:8px;height:8px;border-radius:50%;background:${BRAND.savingsMint};"></span> System Cache (48%)</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:8px;height:8px;border-radius:50%;background:${BRAND.tokenSky};"></span> Tool Context (24%)</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:8px;height:8px;border-radius:50%;background:${BRAND.outputViolet};"></span> Reasoning CoT (18%)</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:8px;height:8px;border-radius:50%;background:${BRAND.warningAmber};"></span> Generation (10%)</span>
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
      listHtml += `
        <div id="d-row-${i}" style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border-radius:6px;border:1px solid transparent;transition:all 0.15s ease;cursor:pointer;" data-donut="${i}">
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="width:10px;height:10px;border-radius:50%;background:${d.color};"></span>
            <div>
              <div style="font-size:12px;color:#FFFFFF;font-weight:500;">${d.label}</div>
              <div style="font-size:10px;color:${BRAND.textMuted};font-family:'JetBrains Mono',monospace;">${d.tokens} tokens</div>
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
          <text id="d-cost" x="${cx}" y="${cy - 6}" fill="${BRAND.crosshair}" font-size="20" font-weight="700" font-family="'JetBrains Mono', monospace" text-anchor="middle">$134.50</text>
          <text id="d-sub" x="${cx}" y="${cy + 12}" fill="${BRAND.textMuted}" font-size="11" text-anchor="middle">Total Batch Spend</text>
          <text id="d-pct" x="${cx}" y="${cy + 26}" fill="${BRAND.textDim}" font-size="10" font-family="'JetBrains Mono', monospace" text-anchor="middle">100% of tokens</text>
        </svg>
        <div style="flex:1;max-width:380px;min-width:260px;background:${BRAND.wellBg};padding:12px;border-radius:8px;border:1px solid ${BRAND.border};">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;padding:0 4px;">
            <h4 style="margin:0;font-size:11px;font-weight:600;color:${BRAND.crosshair};text-transform:uppercase;letter-spacing:0.05em;">Token Distribution</h4>
            <span style="font-size:11px;font-family:'JetBrains Mono',monospace;color:${BRAND.textMuted};">4 Categories</span>
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
      const slice = stage.querySelector(`#d-slice-${idx}`);
      const row = stage.querySelector(`#d-row-${idx}`);
      const d = data[idx];

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
        if (subEl) { subEl.innerText = d.label; subEl.setAttribute('fill', '#FFFFFF'); }
        if (pctEl) { pctEl.innerText = `${d.percent}% of session spend`; pctEl.setAttribute('fill', d.color); }

        readoutMain.innerHTML = `
          <span style="font-family:'JetBrains Mono',monospace;font-size:11.5px;font-weight:700;color:#FFFFFF;background:${BRAND.wellBg};padding:2px 8px;border-radius:4px;border:1px solid ${d.color};">${d.label}</span>
          <div style="display:flex;align-items:center;gap:12px;font-size:12px;font-family:'JetBrains Mono',monospace;">
            <span><strong style="color:${d.color}">Cost:</strong> $${d.cost.toFixed(2)} (${d.percent}% share)</span>
            <span style="color:${BRAND.border}">|</span>
            <span><strong style="color:#FFFFFF">Tokens:</strong> ${d.tokens}</span>
          </div>
        `;
        readoutDelta.innerHTML = `<span style="color:${BRAND.savingsMint};font-weight:600;font-size:11px;">💡 ${d.tip}</span>`;
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
        if (costEl) { costEl.innerText = '$134.50'; costEl.setAttribute('fill', BRAND.crosshair); }
        if (subEl) { subEl.innerText = 'Total Batch Spend'; subEl.setAttribute('fill', BRAND.textMuted); }
        if (pctEl) { pctEl.innerText = '100% of tokens'; pctEl.setAttribute('fill', BRAND.textDim); }
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

    const data = options.data || [
      { deployment: "Azure Global (Standard)", delta: 0, tag: "Parity (0%)", baseline: 25.00, current: 25.00, color: BRAND.savingsMint, tier: "Standard Global", note: "Matches Direct OpenAI list exactly. No data residency guarantee." },
      { deployment: "Azure Data Zone (EU/US)", delta: 12, tag: "+12%", baseline: 25.00, current: 28.00, color: BRAND.tokenSky, tier: "Geographical Boundary", note: "Guaranteed processing boundaries within EU or US jurisdiction." },
      { deployment: "Azure Single-Region (Sweden)", delta: 18, tag: "+18%", baseline: 25.00, current: 29.50, color: BRAND.warningAmber, tier: "Pinned Physical Region", note: "Pinned physical DC for national compliance & statutory audits." },
      { deployment: "Azure FedRAMP / Gov", delta: 35, tag: "+35%", baseline: 25.00, current: 33.75, color: BRAND.burnOrange, tier: "High Sovereign Cloud", note: "Isolated sovereign government enclave with dedicated clearance." },
      { deployment: "OpenAI Direct (PayGo)", delta: 0, tag: "Baseline Ref", baseline: 25.00, current: 25.00, color: BRAND.textDim, tier: "Direct API Standard", note: "Reference standard benchmark rate (Global multi-tenant)." }
    ];

    const title = options.title || "Horizontal Delta: Regional Markup vs Direct Global Base";
    const subtitle = options.subtitle || "Data sovereignty and regional routing markups (+0% to +35%) over base list pricing.";

    container.innerHTML = `
      <div class="finops-chart-card" style="position:relative;background:${BRAND.cardBg};border:1px solid ${BRAND.border};border-radius:10px;padding:18px 20px;margin:24px 0;font-family:Inter,system-ui,sans-serif;box-shadow:0 10px 30px -10px rgba(0,0,0,0.5);">
        
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;gap:12px;">
          <div>
            <h3 style="margin:0;font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:${BRAND.textWhite};letter-spacing:-0.01em;">${title}</h3>
            <p style="margin:3px 0 0;font-size:12px;color:${BRAND.textMuted};">${subtitle}</p>
          </div>
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:${BRAND.crosshair};background:${BRAND.wellBg};padding:3px 8px;border-radius:4px;border:1px solid #2B3D5B;white-space:nowrap;">
            Hover rows
          </span>
        </div>

        <!-- Dedicated Non-Obstructing Telemetry Readout Deck -->
        <div class="finops-readout" style="min-height:48px;background:${BRAND.wellBg};border:1px solid ${BRAND.border};border-radius:8px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;transition:all 0.15s ease;">
          <div class="readout-main" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <span class="readout-tag" style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:${BRAND.crosshair};background:${BRAND.cardBg};padding:2px 8px;border-radius:4px;border:1px solid #2B3D5B;">Residency Benchmark</span>
            <span class="readout-text" style="font-size:12px;color:${BRAND.textMain};">Hover any deployment tier below to inspect data sovereignty premiums and normalized 10M token spend.</span>
          </div>
          <div class="readout-delta" style="font-family:'JetBrains Mono',monospace;font-size:11.5px;color:${BRAND.savingsMint};font-weight:600;">⚡ 0% Baseline = Direct API</div>
        </div>

        <!-- Unobstructed SVG Stage -->
        <div class="finops-stage" style="position:relative;width:100%;overflow-x:auto;"></div>

        <!-- Legend -->
        <div style="padding-top:12px;margin-top:10px;border-top:1px solid ${BRAND.border};display:flex;align-items:center;flex-wrap:wrap;gap:14px;font-size:12px;color:${BRAND.textMuted};">
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:${BRAND.savingsMint};"></span> 0% Parity</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:${BRAND.tokenSky};"></span> Data Zone (+12%)</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:${BRAND.warningAmber};"></span> Single Region (+18%)</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:${BRAND.burnOrange};"></span> Sovereign (+35%)</span>
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
      <text x="${padding.left}" y="${padding.top - 10}" fill="${BRAND.crosshair}" font-size="10" font-family="'JetBrains Mono', monospace" text-anchor="middle">0% Baseline</text>
    `;

    data.forEach((d, i) => {
      const y = padding.top + i * rowHeight + 5;
      const barLen = Math.max(4, (d.delta / 40) * chartW);

      svg += `
        <g id="delta-g-${i}">
          <rect id="delta-band-${i}" x="10" y="${y - 4}" width="${width - 20}" height="${rowHeight - 6}" rx="5" fill="transparent" style="transition:all 0.15s ease;" />
          <text id="delta-label-${i}" x="${padding.left - 14}" y="${y + 16}" fill="${BRAND.textMain}" font-size="11.5" font-weight="500" text-anchor="end" style="transition:all 0.15s ease;">${d.deployment}</text>
          <rect id="delta-bar-${i}" x="${padding.left}" y="${y}" width="${barLen}" height="22" rx="3" fill="${d.color}" style="transition:all 0.2s ease; cursor:pointer;" />
          <line id="delta-conn-${i}" x1="${padding.left}" y1="${y + 11}" x2="${padding.left + barLen}" y2="${y + 11}" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="2,2" opacity="0" style="transition:all 0.15s ease;" />
          <text x="${padding.left + barLen + 8}" y="${y + 15}" fill="${d.color}" font-size="11" font-family="'JetBrains Mono', monospace" font-weight="700">${d.tag}</text>
        </g>
        <rect x="0" y="${y - 4}" width="${width}" height="${rowHeight - 6}" fill="transparent" style="cursor:pointer;" data-delta="${i}" />
      `;
    });

    stage.innerHTML = `<svg viewBox="0 0 ${width} ${height}" style="width:100%;height:auto;overflow:visible;user-select:none;">${svg}</svg>`;

    const defaultMain = readoutMain.innerHTML;
    const defaultDelta = readoutDelta.innerHTML;

    stage.querySelectorAll('[data-delta]').forEach(el => {
      const i = parseInt(el.getAttribute('data-delta'), 10);
      const band = stage.querySelector(`#delta-band-${i}`);
      const bar = stage.querySelector(`#delta-bar-${i}`);
      const label = stage.querySelector(`#delta-label-${i}`);
      const conn = stage.querySelector(`#delta-conn-${i}`);
      const d = data[i];

      el.addEventListener('mouseenter', () => {
        if (band) { band.setAttribute('fill', 'rgba(122, 175, 255, 0.08)'); band.setAttribute('stroke', '#2B3D5B'); }
        if (bar) bar.style.filter = 'brightness(1.35) drop-shadow(0 0 10px rgba(122,175,255,0.4))';
        if (label) { label.setAttribute('fill', BRAND.crosshair); label.setAttribute('font-weight', '700'); }
        if (conn) conn.setAttribute('opacity', '0.8');

        const markup = d.current - d.baseline;
        const markupBadge = markup === 0 ? `<span style="color:${BRAND.savingsMint};font-weight:700;">Exact Parity</span>` : `<span style="color:${BRAND.burnOrange};font-weight:700;">+$${markup.toFixed(2)} (${d.tag})</span>`;

        readoutMain.innerHTML = `
          <span style="font-family:'JetBrains Mono',monospace;font-size:11.5px;font-weight:700;color:#FFFFFF;background:${BRAND.wellBg};padding:2px 8px;border-radius:4px;border:1px solid ${d.color};">${d.deployment}</span>
          <div style="display:flex;align-items:center;gap:12px;font-size:12px;font-family:'JetBrains Mono',monospace;">
            <span><strong style="color:${BRAND.textMuted}">Tier:</strong> ${d.tier}</span>
            <span style="color:${BRAND.border}">|</span>
            <span><strong style="color:${d.color}">Cost (10M):</strong> $${d.current.toFixed(2)} (${markupBadge})</span>
          </div>
        `;
        readoutDelta.innerHTML = `<span style="color:${BRAND.textMuted};font-style:italic;font-size:11px;">${d.note}</span>`;
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

    const title = options.title || "Context Accumulation Waterfall: Cost Growth Across 8 Turns";
    const subtitle = options.subtitle || "Illustrates multi-turn prompt inflation and the massive delta between raw tokens and prompt caching.";

    container.innerHTML = `
      <div class="finops-chart-card" style="position:relative;background:${BRAND.cardBg};border:1px solid ${BRAND.border};border-radius:10px;padding:18px 20px;margin:24px 0;font-family:Inter,system-ui,sans-serif;box-shadow:0 10px 30px -10px rgba(0,0,0,0.5);">
        
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;gap:12px;">
          <div>
            <h3 style="margin:0;font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:${BRAND.textWhite};letter-spacing:-0.01em;">${title}</h3>
            <p style="margin:3px 0 0;font-size:12px;color:${BRAND.textMuted};">${subtitle}</p>
          </div>
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:${BRAND.crosshair};background:${BRAND.wellBg};padding:3px 8px;border-radius:4px;border:1px solid #2B3D5B;white-space:nowrap;">
            Turn snapping
          </span>
        </div>

        <!-- Dedicated Non-Obstructing Telemetry Readout Deck -->
        <div class="finops-readout" style="min-height:48px;background:${BRAND.wellBg};border:1px solid ${BRAND.border};border-radius:8px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;transition:all 0.15s ease;">
          <div class="readout-main" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <span class="readout-tag" style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:${BRAND.savingsMint};background:${BRAND.cardBg};padding:2px 8px;border-radius:4px;border:1px solid ${BRAND.savingsMint};">Compounding Audit</span>
            <span class="readout-text" style="font-size:12px;color:${BRAND.textMain};">Glide cursor across turns T1–T8 below to compare uncached quadratic burn vs flat cached execution.</span>
          </div>
          <div class="readout-delta" style="font-family:'JetBrains Mono',monospace;font-size:11.5px;color:${BRAND.savingsMint};font-weight:600;">⚡ 85% Total Session Yield</div>
        </div>

        <!-- Unobstructed SVG Stage -->
        <div class="finops-stage" style="position:relative;width:100%;overflow-x:auto;"></div>

        <!-- Legend -->
        <div style="padding-top:12px;margin-top:10px;border-top:1px solid ${BRAND.border};display:flex;align-items:center;flex-wrap:wrap;gap:14px;font-size:12px;color:${BRAND.textMuted};">
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:12px;height:2px;background:${BRAND.burnOrange};"></span> Without Caching (Quadratic Compounding)</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:12px;height:2px;background:${BRAND.savingsMint};"></span> With Prompt Caching (Flat Incremental)</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:8px;height:8px;border-radius:50%;background:${BRAND.savingsMint};"></span> 85% Final Savings</span>
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

    turns.forEach((t, i) => {
      const x = padding.left + (i / (turns.length - 1)) * chartW;
      const yUncached = padding.top + chartH - (t.uncached / maxY) * chartH;
      const yCached = padding.top + chartH - (t.cached / maxY) * chartH;
      points.push({ x, yUncached, yCached, turn: t });

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
      const t = p.turn;

      ch.setAttribute('x1', p.x); ch.setAttribute('x2', p.x);
      dl.setAttribute('x1', p.x); dl.setAttribute('y1', p.yUncached); dl.setAttribute('x2', p.x); dl.setAttribute('y2', p.yCached);
      dUnc.setAttribute('cx', p.x); dUnc.setAttribute('cy', p.yUncached);
      hUnc.setAttribute('cx', p.x); hUnc.setAttribute('cy', p.yUncached);
      dCch.setAttribute('cx', p.x); dCch.setAttribute('cy', p.yCached);
      hCch.setAttribute('cx', p.x); hCch.setAttribute('cy', p.yCached);

      track.style.opacity = '1';

      const saved = t.uncached - t.cached;
      const disc = Math.round((saved / t.uncached) * 100);

      readoutMain.innerHTML = `
        <span style="font-family:'JetBrains Mono',monospace;font-size:11.5px;font-weight:700;color:#FFFFFF;background:${BRAND.wellBg};padding:2px 8px;border-radius:4px;border:1px solid ${BRAND.crosshair};">${t.turn}</span>
        <div style="display:flex;align-items:center;gap:12px;font-size:12px;font-family:'JetBrains Mono',monospace;">
          <span><strong style="color:${BRAND.burnOrange}">Uncached:</strong> $${t.uncached.toFixed(2)}</span>
          <span style="color:${BRAND.border}">|</span>
          <span><strong style="color:${BRAND.savingsMint}">Cached:</strong> $${t.cached.toFixed(2)}</span>
          <span style="color:${BRAND.border}">|</span>
          <span style="color:${BRAND.textMuted}">${t.tokens} in context</span>
        </div>
      `;
      readoutDelta.innerHTML = `<span style="color:${BRAND.savingsMint};font-weight:700;">⚡ Saved $${saved.toFixed(2)} (${disc}% discount)</span>`;
    });

    hitbox.addEventListener('mouseleave', () => {
      track.style.opacity = '0';
      readoutMain.innerHTML = defaultMain;
      readoutDelta.innerHTML = defaultDelta;
    });
  }

  // Auto-init for data-finops-chart attributes
  function initAll() {
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
    groupedBar,
    breakEven,
    tokenDonut,
    horizontalDelta,
    waterfall,
    initAll
  };
});
