import fs from 'fs';

let content = fs.readFileSync('src/assets/finops-charts.js', 'utf8');

// Helper function definition for nice ticks
const niceStepCode = `  function calcNiceStep(max, targetTicks = 5) {
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
`;

// 1. GroupedBar replacement
const newGroupedBar = `  function calcNiceStep(max, targetTicks = 5) {
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

    container.innerHTML = \`
      <div class="finops-chart-card" dir="\${isRtl ? 'rtl' : 'ltr'}" style="position:relative;background:\${BRAND.cardBg};border:1px solid \${BRAND.border};border-radius:10px;padding:18px 20px;margin:24px 0;font-family:Inter,system-ui,sans-serif;box-shadow:0 10px 30px -10px rgba(0,0,0,0.5);">
        
        <!-- Header -->
        <div style="margin-bottom:12px;text-align:\${isRtl ? 'right' : 'left'};">
          <h3 style="margin:0;font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:\${BRAND.textWhite};letter-spacing:-0.01em;">\${title}</h3>
          <p style="margin:3px 0 0;font-size:12px;color:\${BRAND.textMuted};">\${subtitle}</p>
        </div>

        <!-- Dedicated Non-Obstructing Telemetry Readout Deck -->
        <div class="finops-readout" dir="\${isRtl ? 'rtl' : 'ltr'}" style="min-height:48px;background:\${BRAND.wellBg};border:1px solid \${BRAND.border};border-radius:8px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;transition:all 0.15s ease;">
          <div class="readout-main" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <span class="readout-tag" style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:\${BRAND.crosshair};background:\${BRAND.cardBg};padding:2px 8px;border-radius:4px;border:1px solid #2B3D5B;">\${t(dict, 'gbSummaryTag')}</span>
            <span class="readout-text" style="font-size:12px;color:\${BRAND.textMain};">\${t(dict, 'gbSummaryDesc')}</span>
          </div>
          <div class="readout-delta" style="font-family:'JetBrains Mono',monospace;font-size:11.5px;color:\${BRAND.savingsMint};font-weight:600;">\${t(dict, 'gbDelta')}</div>
        </div>

        <!-- Unobstructed SVG Stage -->
        <div class="finops-stage" dir="ltr" style="position:relative;width:100%;overflow-x:auto;"></div>

        <!-- Legend -->
        <div dir="\${isRtl ? 'rtl' : 'ltr'}" style="padding-top:12px;margin-top:10px;border-top:1px solid \${BRAND.border};display:flex;align-items:center;flex-wrap:wrap;gap:14px;font-size:12px;color:\${BRAND.textMuted};justify-content:\${isRtl ? 'flex-end' : 'flex-start'};">
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:\${BRAND.tokenSky};"></span> \${t(dict, 'directIn')}</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:\${BRAND.tokenBlue};"></span> \${t(dict, 'cloudIn')}</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:\${BRAND.outputViolet};"></span> \${t(dict, 'directOut')}</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:\${BRAND.outputPurple};"></span> \${t(dict, 'cloudOut')}</span>
        </div>
      </div>
    \`;

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
      svg += \`
        <line x1="\${padding.left}" y1="\${y}" x2="\${width - padding.right}" y2="\${y}" stroke="\${BRAND.border}" stroke-dasharray="3,3" />
        <text x="\${padding.left - 8}" y="\${y + 4}" fill="\${BRAND.textDim}" font-size="11" font-family="'JetBrains Mono', monospace" text-anchor="end">$\${v}</text>
      \`;
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

      svg += \`
        <g id="gb-g-\${i}">
          <rect id="gb-band-\${i}" x="\${groupLeft + 4}" y="\${padding.top}" width="\${groupWidth - 8}" height="\${chartH}" rx="6" fill="transparent" style="transition:all 0.2s ease;" />
      \`;

      series.forEach((s, si) => {
        const bx = gx + si * (barW + gap);
        const bh = (s.val / maxVal) * chartH;
        const by = padding.top + chartH - bh;
        svg += \`<rect id="gb-bar-\${i}-\${si}" x="\${bx}" y="\${by}" width="\${barW}" height="\${bh}" rx="2" fill="\${s.color}" style="transition:all 0.2s ease; cursor:pointer;" />\`;
      });

      svg += \`
          <text id="gb-lbl-\${i}" x="\${gx + (barW * 4 + gap * 3) / 2}" y="\${height - 10}" fill="\${BRAND.textMuted}" font-size="11.5" font-weight="600" text-anchor="middle" style="transition:all 0.15s ease;">\${d.model}</text>
        </g>
        <rect x="\${groupLeft}" y="\${padding.top}" width="\${groupWidth}" height="\${chartH + 25}" fill="transparent" style="cursor:pointer;" data-gb-group="\${i}" />
      \`;
    });

    stage.innerHTML = \`<svg viewBox="0 0 \${width} \${height}" style="width:100%;height:auto;overflow:visible;user-select:none;">\${svg}</svg>\`;

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
        const inBadge = inDelta === 0 ? \`<span style="color:\${BRAND.savingsMint};font-weight:700;">\${t(dict, 'parity')}</span>\` : \`<span style="color:\${BRAND.burnOrange};font-weight:700;">+\${Math.round((inDelta/d.directIn)*100)}%</span>\`;
        const outBadge = outDelta === 0 ? \`<span style="color:\${BRAND.savingsMint};font-weight:700;">\${t(dict, 'parity')}</span>\` : \`<span style="color:\${BRAND.burnOrange};font-weight:700;">+\${Math.round((outDelta/d.directOut)*100)}%</span>\`;

        readoutMain.innerHTML = \`
          <span style="font-family:'JetBrains Mono',monospace;font-size:11.5px;font-weight:700;color:#FFFFFF;background:\${BRAND.wellBg};padding:2px 8px;border-radius:4px;border:1px solid \${BRAND.crosshair};">\${d.model}</span>
          <div style="display:flex;align-items:center;gap:12px;font-size:12px;font-family:'JetBrains Mono',monospace;">
            <span><strong style="color:\${BRAND.tokenSky}">\${t(dict, 'directIn')}:</strong> $\${d.directIn.toFixed(2)} | <strong style="color:\${BRAND.tokenBlue}">\${t(dict, 'cloudIn')}:</strong> $\${d.azureIn.toFixed(2)} (\${inBadge})</span>
            <span style="color:\${BRAND.border}">|</span>
            <span><strong style="color:\${BRAND.outputViolet}">\${t(dict, 'directOut')}:</strong> $\${d.directOut.toFixed(2)} | <strong style="color:\${BRAND.outputPurple}">\${t(dict, 'cloudOut')}:</strong> $\${d.azureOut.toFixed(2)} (\${outBadge})</span>
          </div>
        \`;
        const noteText = resolveText(d.note, lang, d.note || '');
        readoutDelta.innerHTML = \`<span style="color:\${BRAND.textMuted};font-style:italic;font-size:11px;">\${noteText}</span>\`;
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
`;

// 2. BreakEven replacement
const newBreakEven = `  // ==========================================
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

    container.innerHTML = \`
      <div class="finops-chart-card" dir="\${isRtl ? 'rtl' : 'ltr'}" style="position:relative;background:\${BRAND.cardBg};border:1px solid \${BRAND.border};border-radius:10px;padding:18px 20px;margin:24px 0;font-family:Inter,system-ui,sans-serif;box-shadow:0 10px 30px -10px rgba(0,0,0,0.5);">
        
        <!-- Header -->
        <div style="margin-bottom:12px;text-align:\${isRtl ? 'right' : 'left'};">
          <h3 style="margin:0;font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:\${BRAND.textWhite};letter-spacing:-0.01em;">\${title}</h3>
          <p style="margin:3px 0 0;font-size:12px;color:\${BRAND.textMuted};">\${subtitle}</p>
        </div>

        <!-- Dedicated Non-Obstructing Telemetry Readout Deck -->
        <div class="finops-readout" dir="\${isRtl ? 'rtl' : 'ltr'}" style="min-height:48px;background:\${BRAND.wellBg};border:1px solid \${BRAND.border};border-radius:8px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;transition:all 0.15s ease;">
          <div class="readout-main" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <span class="readout-tag" style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:\${BRAND.savingsMint};background:\${BRAND.cardBg};padding:2px 8px;border-radius:4px;border:1px solid \${BRAND.savingsMint};">\${tagText}</span>
            <span class="readout-text" style="font-size:12px;color:\${BRAND.textMain};">\${descText}</span>
          </div>
          <div class="readout-delta" style="font-family:'JetBrains Mono',monospace;font-size:11.5px;color:\${BRAND.crosshair};font-weight:600;">\${spendIdenticalText}</div>
        </div>

        <!-- Unobstructed SVG Stage -->
        <div class="finops-stage" dir="ltr" style="position:relative;width:100%;overflow-x:auto;"></div>

        <!-- Legend -->
        <div dir="\${isRtl ? 'rtl' : 'ltr'}" style="padding-top:12px;margin-top:10px;border-top:1px solid \${BRAND.border};display:flex;align-items:center;flex-wrap:wrap;gap:14px;font-size:12px;color:\${BRAND.textMuted};justify-content:\${isRtl ? 'flex-end' : 'flex-start'};">
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:12px;height:2px;background:\${BRAND.burnOrange};"></span> \${t(dict, 'paygoLabel')} ($\${onDemandRate.toFixed(2)}/M)</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:12px;height:2px;background:\${BRAND.tokenSky};"></span> \${t(dict, 'ptuLabel')} ($\${ptuFixed} base + $\${ptuMarginal.toFixed(2)}/M)</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:8px;height:8px;border-radius:50%;background:\${BRAND.savingsMint};"></span> \${t(dict, 'beIntersection')} (~\${Math.round(breakEvenTokens)}M)</span>
        </div>
      </div>
    \`;

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
      svg += \`
        <line x1="\${padding.left}" y1="\${y}" x2="\${width - padding.right}" y2="\${y}" stroke="\${BRAND.border}" stroke-dasharray="3,3" />
        <text x="\${padding.left - 8}" y="\${y + 4}" fill="\${BRAND.textDim}" font-size="10.5" font-family="'JetBrains Mono', monospace" text-anchor="end">\${labelY}</text>
      \`;
    }

    const stepX = calcNiceStep(maxX, 5);
    for (let xv = 0; xv <= maxX; xv += stepX) {
      const x = padding.left + (xv / maxX) * chartW;
      const labelX = xv >= 1000 ? (xv / 1000).toFixed(1).replace('.0', '') + 'B' : xv + 'M';
      svg += \`
        <line x1="\${x}" y1="\${padding.top}" x2="\${x}" y2="\${padding.top + chartH}" stroke="\${BRAND.border}" stroke-dasharray="2,2" opacity="0.6" />
        <text x="\${x}" y="\${padding.top + chartH + 16}" fill="\${BRAND.textDim}" font-size="10.5" font-family="'JetBrains Mono', monospace" text-anchor="middle">\${labelX}</text>
      \`;
    }

    const p0 = getCoord(0);
    const pMax = getCoord(maxX);
    const pbe = getCoord(breakEvenTokens);

    svg += \`
      <polygon points="\${pbe.x},\${pbe.yOnDemand} \${pMax.x},\${pMax.yOnDemand} \${pMax.x},\${pMax.yPtu}" fill="rgba(74, 222, 128, 0.12)" />
      <line x1="\${p0.x}" y1="\${p0.yOnDemand}" x2="\${pMax.x}" y2="\${pMax.yOnDemand}" stroke="\${BRAND.burnOrange}" stroke-width="2.5" stroke-linecap="round" />
      <line x1="\${p0.x}" y1="\${p0.yPtu}" x2="\${pMax.x}" y2="\${pMax.yPtu}" stroke="\${BRAND.tokenSky}" stroke-width="2.5" stroke-linecap="round" />

      <line x1="\${pbe.x}" y1="\${padding.top}" x2="\${pbe.x}" y2="\${padding.top + chartH}" stroke="\${BRAND.savingsMint}" stroke-width="1.5" stroke-dasharray="4,4" />
      <circle cx="\${pbe.x}" cy="\${pbe.yOnDemand}" r="5" fill="\${BRAND.savingsMint}" stroke="\${BRAND.canvasBg}" stroke-width="2" />
      <text x="\${Math.max(padding.left + 50, Math.min(width - padding.right - 50, pbe.x))}" y="\${padding.top - 8}" fill="\${BRAND.savingsMint}" font-size="10.5" font-family="'JetBrains Mono', monospace" font-weight="700" text-anchor="middle" paint-order="stroke fill" stroke="#0A0F1A" stroke-width="3">\${t(dict, 'beIntersection')} ~\${breakEvenTokens}M</text>

      <g id="be-track" style="opacity:0; pointer-events:none; transition:opacity 0.15s ease;">
        <line id="be-ch" x1="0" y1="\${padding.top}" x2="0" y2="\${padding.top + chartH}" stroke="\${BRAND.crosshair}" stroke-width="1" stroke-dasharray="3,3" />
        <line id="be-dl" x1="0" y1="0" x2="0" y2="0" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity="0.6" />
        <circle id="be-h-pay" cx="0" cy="0" r="9" fill="rgba(234, 88, 12, 0.25)" />
        <circle id="be-d-pay" cx="0" cy="0" r="5" fill="\${BRAND.burnOrange}" stroke="#FFFFFF" stroke-width="2" />
        <circle id="be-h-ptu" cx="0" cy="0" r="9" fill="rgba(56, 189, 248, 0.25)" />
        <circle id="be-d-ptu" cx="0" cy="0" r="5" fill="\${BRAND.tokenSky}" stroke="#FFFFFF" stroke-width="2" />
      </g>
      <rect id="be-hitbox" x="\${padding.left}" y="\${padding.top}" width="\${chartW}" height="\${chartH}" fill="transparent" style="cursor:crosshair;" />
    \`;

    stage.innerHTML = \`<svg id="be-svg" viewBox="0 0 \${width} \${height}" style="width:100%;height:auto;overflow:visible;user-select:none;">\${svg}</svg>\`;

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

      readoutMain.innerHTML = \`
        <span style="font-family:'JetBrains Mono',monospace;font-size:11.5px;font-weight:700;color:#FFFFFF;background:\${BRAND.wellBg};padding:2px 8px;border-radius:4px;border:1px solid \${BRAND.crosshair};">\${t(dict, 'tokensPerMo', { tokens: tokens.toFixed(0) })}</span>
        <div style="display:flex;align-items:center;gap:12px;font-size:12px;font-family:'JetBrains Mono',monospace;">
          <span><strong style="color:\${BRAND.burnOrange}">PayGo:</strong> $\${Math.round(c.onDemandCost)}</span>
          <span style="color:\${BRAND.border}">|</span>
          <span><strong style="color:\${BRAND.tokenSky}">PTU:</strong> $\${Math.round(c.ptuCost)}</span>
        </div>
      \`;

      if (Math.abs(tokens - breakEvenTokens) < (maxX * 0.015)) {
        readoutDelta.innerHTML = \`<span style="color:\${BRAND.savingsMint};font-weight:700;">\${t(dict, 'beExact', { cost: breakEvenCost })}</span>\`;
      } else if (isPtuCheaper) {
        readoutDelta.innerHTML = \`<span style="color:\${BRAND.savingsMint};font-weight:700;">\${t(dict, 'bePtuSaves', { delta: '$' + Math.round(diff), pct: pct })}</span>\`;
      } else {
        readoutDelta.innerHTML = \`<span style="color:\${BRAND.warningAmber};font-weight:700;">\${t(dict, 'bePaygoCheaper', { delta: '$' + Math.round(diff) })}</span>\`;
      }
    });

    hitbox.addEventListener('mouseleave', () => {
      track.style.opacity = '0';
      readoutMain.innerHTML = defaultMain;
      readoutDelta.innerHTML = defaultDelta;
    });
  }
`;

// 3. HorizontalDelta replacement
const newHorizontalDelta = `  // ==========================================
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

    container.innerHTML = \`
      <div class="finops-chart-card" dir="\${isRtl ? 'rtl' : 'ltr'}" style="position:relative;background:\${BRAND.cardBg};border:1px solid \${BRAND.border};border-radius:10px;padding:18px 20px;margin:24px 0;font-family:Inter,system-ui,sans-serif;box-shadow:0 10px 30px -10px rgba(0,0,0,0.5);">
        
        <!-- Header -->
        <div style="margin-bottom:12px;text-align:\${isRtl ? 'right' : 'left'};">
          <h3 style="margin:0;font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:\${BRAND.textWhite};letter-spacing:-0.01em;">\${title}</h3>
          <p style="margin:3px 0 0;font-size:12px;color:\${BRAND.textMuted};">\${subtitle}</p>
        </div>

        <!-- Dedicated Non-Obstructing Telemetry Readout Deck -->
        <div class="finops-readout" dir="\${isRtl ? 'rtl' : 'ltr'}" style="min-height:48px;background:\${BRAND.wellBg};border:1px solid \${BRAND.border};border-radius:8px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;transition:all 0.15s ease;">
          <div class="readout-main" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <span class="readout-tag" style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:\${BRAND.crosshair};background:\${BRAND.cardBg};padding:2px 8px;border-radius:4px;border:1px solid #2B3D5B;">\${t(dict, 'hdBenchmarkTag')}</span>
            <span class="readout-text" style="font-size:12px;color:\${BRAND.textMain};">\${t(dict, 'hdBenchmarkDesc')}</span>
          </div>
          <div class="readout-delta" style="font-family:'JetBrains Mono',monospace;font-size:11.5px;color:\${BRAND.savingsMint};font-weight:600;">\${t(dict, 'hdBaselineRef')}</div>
        </div>

        <!-- Unobstructed SVG Stage -->
        <div class="finops-stage" dir="ltr" style="position:relative;width:100%;overflow-x:auto;"></div>

        <!-- Legend -->
        <div dir="\${isRtl ? 'rtl' : 'ltr'}" style="padding-top:12px;margin-top:10px;border-top:1px solid \${BRAND.border};display:flex;align-items:center;flex-wrap:wrap;gap:14px;font-size:12px;color:\${BRAND.textMuted};justify-content:\${isRtl ? 'flex-end' : 'flex-start'};">
          \${data.map(d => \`<span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:\${d.color};"></span> \${resolveText(d.tag, lang, d.tag)}</span>\`).join('')}
        </div>
      </div>
    \`;

    const card = container.querySelector('.finops-chart-card');
    const stage = card.querySelector('.finops-stage');
    const readoutMain = card.querySelector('.readout-main');
    const readoutDelta = card.querySelector('.readout-delta');

    const width = 740, height = 240;
    const padding = { top: 20, right: 80, bottom: 20, left: 235 };
    const chartW = width - padding.left - padding.right;
    const rowHeight = 40;

    let svg = \`
      <line id="delta-baseline" x1="\${padding.left}" y1="\${padding.top - 6}" x2="\${padding.left}" y2="\${padding.top + data.length * rowHeight}" stroke="\${BRAND.crosshair}" stroke-width="2" stroke-dasharray="4,4" />
      <text x="\${padding.left}" y="\${padding.top - 10}" fill="\${BRAND.crosshair}" font-size="10" font-family="'JetBrains Mono', monospace" text-anchor="middle">\${t(dict, 'hdBaseline')}</text>
    \`;

    data.forEach((d, i) => {
      const y = padding.top + i * rowHeight + 5;
      const barLen = Math.max(4, (d.delta / 40) * chartW);
      const depName = resolveText(d.deployment, lang, d.deployment);
      const tagText = resolveText(d.tag, lang, d.tag);

      svg += \`
        <g id="delta-g-\${i}">
          <rect id="delta-band-\${i}" x="10" y="\${y - 4}" width="\${width - 20}" height="\${rowHeight - 6}" rx="5" fill="transparent" style="transition:all 0.15s ease;" />
          <text id="delta-label-\${i}" x="\${padding.left - 14}" y="\${y + 16}" fill="\${BRAND.textMain}" font-size="11.5" font-weight="500" text-anchor="end" style="transition:all 0.15s ease;">\${depName}</text>
          <rect id="delta-bar-\${i}" x="\${padding.left}" y="\${y}" width="\${barLen}" height="22" rx="3" fill="\${d.color}" style="transition:all 0.2s ease; cursor:pointer;" />
          <line id="delta-conn-\${i}" x1="\${padding.left}" y1="\${y + 11}" x2="\${padding.left + barLen}" y2="\${y + 11}" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="2,2" opacity="0" style="transition:all 0.15s ease;" />
          <text x="\${padding.left + barLen + 8}" y="\${y + 15}" fill="\${d.color}" font-size="11" font-family="'JetBrains Mono', monospace" font-weight="700">\${tagText}</text>
        </g>
        <rect x="0" y="\${y - 4}" width="\${width}" height="\${rowHeight - 6}" fill="transparent" style="cursor:pointer;" data-delta="\${i}" />
      \`;
    });

    stage.innerHTML = \`<svg viewBox="0 0 \${width} \${height}" style="width:100%;height:auto;overflow:visible;user-select:none;">\${svg}</svg>\`;

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
        const markupBadge = markup === 0 ? \`<span style="color:\${BRAND.savingsMint};font-weight:700;">\${t(dict, 'exactParity')}</span>\` : \`<span style="color:\${BRAND.burnOrange};font-weight:700;">+$\${markup.toFixed(2)} (\${tagText})</span>\`;

        readoutMain.innerHTML = \`
          <span style="font-family:'JetBrains Mono',monospace;font-size:11.5px;font-weight:700;color:#FFFFFF;background:\${BRAND.wellBg};padding:2px 8px;border-radius:4px;border:1px solid \${d.color};">\${depName}</span>
          <div style="display:flex;align-items:center;gap:12px;font-size:12px;font-family:'JetBrains Mono',monospace;">
            <span><strong style="color:\${BRAND.textMuted}">\${t(dict, 'tier')}</strong> \${tierText}</span>
            <span style="color:\${BRAND.border}">|</span>
            <span><strong style="color:\${d.color}">\${t(dict, 'normCost')}</strong> $\${d.current.toFixed(2)} (\${markupBadge})</span>
          </div>
        \`;
        const noteText = resolveText(d.note, lang, d.note || '');
        readoutDelta.innerHTML = \`<span style="color:\${BRAND.textMuted};font-style:italic;font-size:11px;">\${noteText}</span>\`;
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
`;

// 4. Waterfall replacement
const newWaterfall = `  // ==========================================
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

    container.innerHTML = \`
      <div class="finops-chart-card" dir="\${isRtl ? 'rtl' : 'ltr'}" style="position:relative;background:\${BRAND.cardBg};border:1px solid \${BRAND.border};border-radius:10px;padding:18px 20px;margin:24px 0;font-family:Inter,system-ui,sans-serif;box-shadow:0 10px 30px -10px rgba(0,0,0,0.5);">
        
        <!-- Header -->
        <div style="margin-bottom:12px;text-align:\${isRtl ? 'right' : 'left'};">
          <h3 style="margin:0;font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:\${BRAND.textWhite};letter-spacing:-0.01em;">\${title}</h3>
          <p style="margin:3px 0 0;font-size:12px;color:\${BRAND.textMuted};">\${subtitle}</p>
        </div>

        <!-- Dedicated Non-Obstructing Telemetry Readout Deck -->
        <div class="finops-readout" dir="\${isRtl ? 'rtl' : 'ltr'}" style="min-height:48px;background:\${BRAND.wellBg};border:1px solid \${BRAND.border};border-radius:8px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;transition:all 0.15s ease;">
          <div class="readout-main" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <span class="readout-tag" style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:\${BRAND.savingsMint};background:\${BRAND.cardBg};padding:2px 8px;border-radius:4px;border:1px solid \${BRAND.savingsMint};">\${t(dict, 'wfAuditTag')}</span>
            <span class="readout-text" style="font-size:12px;color:\${BRAND.textMain};">\${t(dict, 'wfAuditDesc')}</span>
          </div>
          <div class="readout-delta" style="font-family:'JetBrains Mono',monospace;font-size:11.5px;color:\${BRAND.savingsMint};font-weight:600;">\${t(dict, 'wfYield')}</div>
        </div>

        <!-- Unobstructed SVG Stage -->
        <div class="finops-stage" dir="ltr" style="position:relative;width:100%;overflow-x:auto;"></div>

        <!-- Legend -->
        <div dir="\${isRtl ? 'rtl' : 'ltr'}" style="padding-top:12px;margin-top:10px;border-top:1px solid \${BRAND.border};display:flex;align-items:center;flex-wrap:wrap;gap:14px;font-size:12px;color:\${BRAND.textMuted};justify-content:\${isRtl ? 'flex-end' : 'flex-start'};">
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:12px;height:2px;background:\${BRAND.burnOrange};"></span> \${t(dict, 'wfUncached')}</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:12px;height:2px;background:\${BRAND.savingsMint};"></span> \${t(dict, 'wfCached')}</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:8px;height:8px;border-radius:50%;background:\${BRAND.savingsMint};"></span> \${t(dict, 'wfSavings')}</span>
        </div>
      </div>
    \`;

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
      svg += \`
        <line x1="\${padding.left}" y1="\${y}" x2="\${width - padding.right}" y2="\${y}" stroke="\${BRAND.border}" stroke-dasharray="3,3" />
        <text x="\${padding.left - 8}" y="\${y + 4}" fill="\${BRAND.textDim}" font-size="11" font-family="'JetBrains Mono', monospace" text-anchor="end">\${labelY}</text>
      \`;
    }

    let dUncached = '', dCached = '';
    let aUncached = \`M \${padding.left} \${padding.top + chartH} \`;
    let aCached = \`M \${padding.left} \${padding.top + chartH} \`;
    const points = [];

    turns.forEach((tData, i) => {
      const x = padding.left + (i / (turns.length - 1)) * chartW;
      const yUncached = padding.top + chartH - (tData.uncached / maxY) * chartH;
      const yCached = padding.top + chartH - (tData.cached / maxY) * chartH;
      points.push({ x, yUncached, yCached, turn: tData });

      if (i === 0) { dUncached += \`M \${x} \${yUncached}\`; dCached += \`M \${x} \${yCached}\`; }
      else { dUncached += \` L \${x} \${yUncached}\`; dCached += \` L \${x} \${yCached}\`; }
      aUncached += \` L \${x} \${yUncached}\`; aCached += \` L \${x} \${yCached}\`;

      svg += \`<text x="\${x}" y="\${padding.top + chartH + 18}" fill="\${BRAND.textMuted}" font-size="11" font-family="'JetBrains Mono', monospace" font-weight="500" text-anchor="middle">T\${i+1}</text>\`;
    });

    const lastX = padding.left + chartW, groundY = padding.top + chartH;
    aUncached += \` L \${lastX} \${groundY} Z\`;
    aCached += \` L \${lastX} \${groundY} Z\`;

    svg += \`
      <path d="\${aUncached}" fill="rgba(234, 88, 12, 0.12)" />
      <path d="\${aCached}" fill="rgba(74, 222, 128, 0.22)" />
      <path d="\${dUncached}" fill="none" stroke="\${BRAND.burnOrange}" stroke-width="3" stroke-linecap="round" />
      <path d="\${dCached}" fill="none" stroke="\${BRAND.savingsMint}" stroke-width="3" stroke-linecap="round" />

      \${points.map(p => \`
        <circle cx="\${p.x}" cy="\${p.yUncached}" r="3.5" fill="\${BRAND.burnOrange}" opacity="0.7" />
        <circle cx="\${p.x}" cy="\${p.yCached}" r="3.5" fill="\${BRAND.savingsMint}" opacity="0.7" />
      \`).join('')}

      <g id="wf-track" style="opacity:0; pointer-events:none; transition:opacity 0.15s ease;">
        <line id="wf-ch" x1="0" y1="\${padding.top}" x2="0" y2="\${padding.top + chartH}" stroke="\${BRAND.crosshair}" stroke-width="1" stroke-dasharray="3,3" />
        <line id="wf-dl" x1="0" y1="0" x2="0" y2="0" stroke="#FFFFFF" stroke-width="2" opacity="0.7" />
        <circle id="wf-h-unc" cx="0" cy="0" r="9" fill="rgba(234, 88, 12, 0.25)" />
        <circle id="wf-d-unc" cx="0" cy="0" r="5" fill="\${BRAND.burnOrange}" stroke="#FFFFFF" stroke-width="2" />
        <circle id="wf-h-cch" cx="0" cy="0" r="9" fill="rgba(74, 222, 128, 0.25)" />
        <circle id="wf-d-cch" cx="0" cy="0" r="5" fill="\${BRAND.savingsMint}" stroke="#FFFFFF" stroke-width="2" />
      </g>
      <rect id="wf-hitbox" x="\${padding.left}" y="\${padding.top}" width="\${chartW}" height="\${chartH}" fill="transparent" style="cursor:crosshair;" />
    \`;

    stage.innerHTML = \`<svg id="wf-svg" viewBox="0 0 \${width} \${height}" style="width:100%;height:auto;overflow:visible;user-select:none;">\${svg}</svg>\`;

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

      readoutMain.innerHTML = \`
        <span style="font-family:'JetBrains Mono',monospace;font-size:11.5px;font-weight:700;color:#FFFFFF;background:\${BRAND.wellBg};padding:2px 8px;border-radius:4px;border:1px solid \${BRAND.crosshair};">\${turnName}</span>
        <div style="display:flex;align-items:center;gap:12px;font-size:12px;font-family:'JetBrains Mono',monospace;">
          <span><strong style="color:\${BRAND.burnOrange}">\${t(dict, 'uncached')}</strong> $\${tData.uncached.toFixed(2)}</span>
          <span style="color:\${BRAND.border}">|</span>
          <span><strong style="color:\${BRAND.savingsMint}">\${t(dict, 'cached')}</strong> $\${tData.cached.toFixed(2)}</span>
          <span style="color:\${BRAND.border}">|</span>
          <span style="color:\${BRAND.textMuted}">\${tData.tokens} \${t(dict, 'inContext')}</span>
        </div>
      \`;
      readoutDelta.innerHTML = \`<span style="color:\${BRAND.savingsMint};font-weight:700;">\${t(dict, 'savedMsg', { saved: '$' + saved.toFixed(2), pct: disc })}</span>\`;
    });

    hitbox.addEventListener('mouseleave', () => {
      track.style.opacity = '0';
      readoutMain.innerHTML = defaultMain;
      readoutDelta.innerHTML = defaultDelta;
    });
  }
`;

// 5. ParetoFrontier replacement (mathematically collision-free)
const newParetoFrontier = `  // ==========================================
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
      <text x="\${padding.left + chartW / 2}" y="\${height - 10}" fill="\${BRAND.textMuted}" font-size="11" font-family="'Inter',sans-serif" text-anchor="middle">\${t(dict, 'pfCostAxis')}</text>
      <text x="\${padding.left + 8}" y="\${padding.top - 12}" fill="\${BRAND.textMuted}" font-size="11" font-family="'Inter',sans-serif">\${t(dict, 'pfAccAxis')}</text>

      <!-- Optimal Pareto Boundary Curve (cleanly positioned in open quadrant) -->
      <path d="M \${getX(0.85)} \${getY(71.4)} Q \${getX(2.2)} \${getY(83.0)} \${getX(22.0)} \${getY(89.2)}" fill="none" stroke="\${BRAND.savingsMint}" stroke-width="2" stroke-dasharray="4,4" opacity="0.75" />
      <text x="\${padding.left + 24}" y="\${padding.top + 18}" fill="\${BRAND.savingsMint}" font-size="11" font-family="'JetBrains Mono',monospace" font-weight="700" paint-order="stroke fill" stroke="#0A0F1A" stroke-width="3">\${t(dict, 'pfBoundary')}</text>

      <!-- Tracking Crosshair -->
      <g id="pf-crosshair" style="opacity:0; pointer-events:none; transition:opacity 0.15s ease;">
        <line id="pf-ch-x" x1="0" y1="\${padding.top}" x2="0" y2="\${padding.top + chartH}" stroke="\${BRAND.crosshair}" stroke-width="1" stroke-dasharray="3,3" />
        <line id="pf-ch-y" x1="\${padding.left}" y1="0" x2="\${padding.left + chartW}" y2="0" stroke="\${BRAND.crosshair}" stroke-width="1" stroke-dasharray="3,3" />
        <circle id="pf-halo" cx="0" cy="0" r="14" fill="\${BRAND.savingsMint}" fill-opacity="0.25" />
      </g>
    \`;

    // Render Points with verified collision-free staggered text
    models.forEach((m, i) => {
      const cx = getX(m.cost);
      const cy = getY(m.acc);
      const anchor = m.align || 'start';
      const tx = cx + (m.dx || 10);
      const tyName = cy + (m.dyName || -4);
      const tyMeta = cy + (m.dyMeta || 8);

      svg += \`
        <g class="pf-node" data-index="\${i}" style="cursor:pointer;">
          <circle cx="\${cx}" cy="\${cy}" r="6.5" fill="\${m.color}" stroke="#FFFFFF" stroke-width="1.5" />
          <text x="\${tx}" y="\${tyName}" fill="\${BRAND.textWhite}" font-size="11" font-family="'JetBrains Mono',monospace" font-weight="700" text-anchor="\${anchor}" paint-order="stroke fill" stroke="#0A0F1A" stroke-width="3.5" stroke-linejoin="round">\${m.name}</text>
          <text x="\${tx}" y="\${tyMeta}" fill="\${BRAND.textMuted}" font-size="9.5" font-family="'JetBrains Mono',monospace" font-weight="600" text-anchor="\${anchor}" paint-order="stroke fill" stroke="#0A0F1A" stroke-width="3.5" stroke-linejoin="round">$\${m.cost.toFixed(2)} / \${m.acc}%</text>
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
`;

// 6. CascadeFunnel replacement (2-tier stacked non-colliding layout)
const newCascadeFunnel = `  // ==========================================
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

        <!-- Guidance Footer -->
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

      svg += \`
        <polygon points="\${x1},\${yTop} \${x2},\${yTop} \${x4},\${yBtm} \${x3},\${yBtm}" fill="rgba(255, 255, 255, 0.04)" stroke="\${BRAND.border}" stroke-width="0.75" stroke-dasharray="2,2" />
      \`;
    }

    // Render each stage in 2-tier stacked lines (text line + bar line) with ZERO possible overlap
    stages.forEach((s, i) => {
      const barX = funnelCenterX - s.barWidth / 2;
      const stageName = t(dict, s.key);
      const yText = s.yRow + 14;
      const yBar = s.yRow + 22;

      svg += \`
        <g class="cf-stage-group" data-index="\${i}" style="cursor:pointer;">
          <!-- Line 1: Left Stage Name & Right Telemetry Metrics -->
          <text x="25" y="\${yText}" fill="\${BRAND.textWhite}" font-size="12" font-family="'Space Grotesk',sans-serif" font-weight="700">\${stageName}</text>
          <text x="715" y="\${yText}" fill="\${s.color}" font-size="11.5" font-family="'JetBrains Mono',monospace" font-weight="700" text-anchor="end">\${s.count} | \${s.rate}</text>

          <!-- Line 2: Centered Tapered Funnel Bar with Percentage Badge -->
          <rect class="cf-stage-bar" x="\${barX}" y="\${yBar}" width="\${s.barWidth}" height="20" rx="4" fill="\${s.color}" fill-opacity="0.88" stroke="#1E2A3F" stroke-width="1" style="transition:all 0.15s ease;" />
          <text x="\${funnelCenterX}" y="\${yBar + 14}" fill="#0A0F1A" font-size="10.5" font-family="'JetBrains Mono',monospace" font-weight="700" text-anchor="middle">\${s.sharePct}% Volume</text>

          <!-- Transparent full-row hover hitbox -->
          <rect x="10" y="\${s.yRow}" width="\${width - 20}" height="48" rx="6" fill="transparent" />
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
      if (!s) return;
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
`;

// 7. MarginErosion replacement (2-tier stacked non-colliding layout)
const newMarginErosion = `  // ==========================================
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

        <!-- Guidance Footer -->
        <div dir="\${isRtl ? 'rtl' : 'ltr'}" style="padding-top:12px;margin-top:10px;border-top:1px solid \${BRAND.border};display:flex;align-items:center;flex-wrap:wrap;gap:14px;font-size:12px;color:\${BRAND.textMuted};justify-content:\${isRtl ? 'flex-end' : 'flex-start'};">
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:\${BRAND.warningAmber};">\${t(dict, 'meRevenueCeiling')} ($\${seatRev.toFixed(2)}/seat/mo)</span>
        </div>
      </div>
    \`;

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

    let svg = \`
      <!-- Revenue Ceiling Vertical Marker Line -->
      <line x1="\${ceilingX}" y1="20" x2="\${ceilingX}" y2="225" stroke="\${BRAND.warningAmber}" stroke-width="1.5" stroke-dasharray="3,3" />
      <text x="\${ceilingX}" y="14" fill="\${BRAND.warningAmber}" font-size="10" font-family="'JetBrains Mono',monospace" text-anchor="middle" font-weight="700">\${t(dict, 'meRevenueCeiling')} ($\${seatRev.toFixed(0)})</text>
    \`;

    cohorts.forEach((c, i) => {
      const yRow = 28 + i * 48;
      const yText = yRow + 12;
      const yBar = yRow + 20;
      const barW = Math.min(trackW, (c.cost / 100) * trackW);
      const cohortName = t(dict, c.key);
      const marginStr = c.isLoss ? \`\${c.pct.toFixed(1)}% Loss\` : \`+\${c.pct.toFixed(1)}% Margin\`;

      svg += \`
        <g class="me-cohort-row" data-index="\${i}" style="cursor:pointer;">
          <!-- Line 1: Left Cohort Name & Right Telemetry Status -->
          <text x="25" y="\${yText}" fill="\${BRAND.textWhite}" font-size="12" font-family="'Inter',sans-serif" font-weight="600">\${cohortName}</text>
          <text x="715" y="\${yText}" fill="\${c.color}" font-size="11.5" font-family="'JetBrains Mono',monospace" font-weight="700" text-anchor="end">$\${c.cost.toFixed(2)} Cost | \${marginStr}</text>

          <!-- Line 2: Background Track & Proportional Burn Bar -->
          <rect x="\${trackLeft}" y="\${yBar}" width="\${trackW}" height="16" rx="3" fill="\${BRAND.wellBg}" stroke="\${BRAND.border}" stroke-width="0.75" />
          <rect class="me-bar" x="\${trackLeft}" y="\${yBar}" width="\${barW}" height="16" rx="3" fill="\${c.color}" fill-opacity="0.88" style="transition:all 0.15s ease;" />

          <!-- Transparent row hitbox -->
          <rect x="10" y="\${yRow}" width="\${width - 20}" height="42" fill="transparent" />
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
      if (!c) return;
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
`;

// Now apply each replacement cleanly:
// First, insert calcNiceStep after I18N helper functions if not present
if (!content.includes('function calcNiceStep(')) {
  const insertMarker = 'function interpolate(str, params) {';
  const insertIdx = content.indexOf(insertMarker);
  if (insertIdx !== -1) {
    const endOfInterpolate = content.indexOf('return str;\n  }', insertIdx);
    if (endOfInterpolate !== -1) {
      const pos = endOfInterpolate + 'return str;\n  }'.length;
      content = content.slice(0, pos) + '\n\n' + niceStepCode + content.slice(pos);
    }
  }
}

// Function to replace a whole function block from startComment to nextComment
function replaceBlock(startMarker, nextMarker, newCode) {
  const sIdx = content.indexOf(startMarker);
  if (sIdx === -1) {
    console.error('Could not find start marker:', startMarker);
    return false;
  }
  const nIdx = content.indexOf(nextMarker, sIdx + startMarker.length);
  if (nIdx === -1) {
    console.error('Could not find next marker:', nextMarker);
    return false;
  }
  content = content.slice(0, sIdx) + newCode + '\n\n' + content.slice(nIdx);
  return true;
}

replaceBlock('// 1. GROUPED BAR CHART', '// 2. BREAK-EVEN LINE CHART', newGroupedBar);
replaceBlock('// 2. BREAK-EVEN LINE CHART', '// 3. TOKEN DONUT', newBreakEven);
replaceBlock('// 4. HORIZONTAL DELTA', '// 5. CUMULATIVE CONTEXT WATERFALL', newHorizontalDelta);
replaceBlock('// 5. CUMULATIVE CONTEXT WATERFALL', '// 6. PARETO FRONTIER', newWaterfall);
replaceBlock('// 6. PARETO FRONTIER', '// 7. CASCADE ROUTING FUNNEL', newParetoFrontier);
replaceBlock('// 7. CASCADE ROUTING FUNNEL', '// 8. SAAS GROSS MARGIN EROSION METER', newCascadeFunnel);
replaceBlock('// 8. SAAS GROSS MARGIN EROSION METER', '// 9. PROMPT CACHE TTL DECAY TIMELINE', newMarginErosion);

fs.writeFileSync('src/assets/finops-charts.js', content, 'utf8');
console.log('Successfully applied all refined non-colliding layouts to src/assets/finops-charts.js!');
