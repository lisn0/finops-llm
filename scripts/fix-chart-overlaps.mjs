import fs from 'fs';

const jsPath = 'src/assets/finops-charts.js';
let jsContent = fs.readFileSync(jsPath, 'utf8');

// 1. REPLACEMENT FOR breakEven
const newBreakEvenCode = `  // ==========================================
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

    // Calculate clean, non-overlapping tick intervals (strictly 5 ticks)
    function calcNiceStep(max, count = 5) {
      const raw = max / count;
      const mag = Math.pow(10, Math.floor(Math.log10(raw)));
      const rel = raw / mag;
      if (rel >= 5) return mag * 5;
      if (rel >= 2) return mag * 2;
      return mag;
    }

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
  }`;

// 2. REPLACEMENT FOR paretoFrontier
const newParetoFrontierCode = `  // ==========================================
  // 6. PARETO FRONTIER: SWE-bench Accuracy vs Cost
  // ==========================================
  function paretoFrontier(target, options = {}) {
    const container = getTarget(target);
    if (!container) return;

    const lang = resolveLang(container, options);
    const dict = I18N[lang] || I18N.en;
    const isRtl = lang === 'ar';

    // Staggered non-colliding label offsets for each model point
    const defaultModels = [
      { name: "DeepSeek V3", cost: 0.85, acc: 71.4, color: BRAND.tokenSky, tierKey: "pfValueLeader", align: "start", dx: 12, dyName: 12, dyMeta: 24 },
      { name: "Claude 3.7 Haiku", cost: 1.25, acc: 73.2, color: BRAND.tokenSky, tierKey: "pfValueLeader", align: "start", dx: 12, dyName: -4, dyMeta: 8 },
      { name: "o3-mini Fast", cost: 1.80, acc: 81.2, color: BRAND.savingsMint, tierKey: "pfSweetSpot", align: "end", dx: -12, dyName: -6, dyMeta: 6 },
      { name: "Claude 3.7 Sonnet", cost: 4.50, acc: 86.8, color: BRAND.savingsMint, tierKey: "pfFrontierEff", align: "end", dx: -12, dyName: -6, dyMeta: 6 },
      { name: "GPT-5.4 Std", cost: 6.20, acc: 87.5, color: BRAND.outputViolet, tierKey: "pfFrontierEff", align: "start", dx: 12, dyName: -4, dyMeta: 8 },
      { name: "Claude 3.7 Opus", cost: 22.00, acc: 89.1, color: BRAND.burnOrange, tierKey: "pfDiminishing", align: "end", dx: -14, dyName: 2, dyMeta: 14 }
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

    // Render Points with collision-free staggered text
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
  }`;

// 3. REPLACEMENT FOR cascadeFunnel
const newCascadeFunnelCode = `  // ==========================================
  // 7. CASCADE ROUTING FUNNEL: Smart Gateway Yield
  // ==========================================
  function cascadeFunnel(target, options = {}) {
    const container = getTarget(target);
    if (!container) return;

    const lang = resolveLang(container, options);
    const dict = I18N[lang] || I18N.en;
    const isRtl = lang === 'ar';

    // Structured 3-column layout: Left Name | Center Funnel Taper | Right Rate & Subtotal
    const defaultStages = [
      { key: "cfIncoming", count: "10M Calls", sharePct: 100, rate: "$0.00 Base", spend: "$0.00", barWidth: 320, color: BRAND.crosshair, y: 18 },
      { key: "cfTier1", count: "6.8M Handled", sharePct: 68, rate: "$0.15/M", spend: "$1.02", barWidth: 220, color: BRAND.tokenSky, y: 68 },
      { key: "cfTier2", count: "2.2M Handled", sharePct: 22, rate: "$3.00/M", spend: "$6.60", barWidth: 130, color: BRAND.outputViolet, y: 118 },
      { key: "cfTier3", count: "1.0M Handled", sharePct: 10, rate: "$25.00/M", spend: "$25.00", barWidth: 70, color: BRAND.burnOrange, y: 168 }
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

    // Draw connecting polygons between center funnel stages
    for (let i = 0; i < stages.length - 1; i++) {
      const topS = stages[i];
      const btmS = stages[i + 1];
      const x1 = funnelCenterX - topS.barWidth / 2;
      const x2 = funnelCenterX + topS.barWidth / 2;
      const yTop = topS.y + 32;
      const x3 = funnelCenterX - btmS.barWidth / 2;
      const x4 = funnelCenterX + btmS.barWidth / 2;
      const yBtm = btmS.y;

      svg += \`
        <polygon points="\${x1},\${yTop} \${x2},\${yTop} \${x4},\${yBtm} \${x3},\${yBtm}" fill="rgba(255, 255, 255, 0.04)" stroke="\${BRAND.border}" stroke-width="0.75" stroke-dasharray="2,2" />
      \`;
    }

    // Render each stage in 3 distinct, non-overlapping visual zones
    stages.forEach((s, i) => {
      const barX = funnelCenterX - s.barWidth / 2;
      const stageName = t(dict, s.key);

      svg += \`
        <g class="cf-stage-group" data-index="\${i}" style="cursor:pointer;">
          <!-- Left Label Column (0 - 200px) -->
          <text x="15" y="\${s.y + 20}" fill="\${BRAND.textWhite}" font-size="12" font-family="'Space Grotesk',sans-serif" font-weight="700">\${stageName}</text>
          
          <!-- Center Funnel Bar (210 - 530px) -->
          <rect class="cf-stage-bar" x="\${barX}" y="\${s.y}" width="\${s.barWidth}" height="32" rx="5" fill="\${s.color}" fill-opacity="0.88" stroke="#1E2A3F" stroke-width="1" style="transition:all 0.15s ease;" />
          <text x="\${funnelCenterX}" y="\${s.y + 20}" fill="#0A0F1A" font-size="11" font-family="'JetBrains Mono',monospace" font-weight="700" text-anchor="middle">\${s.sharePct}%</text>

          <!-- Right Metrics Column (540 - 725px) -->
          <text x="725" y="\${s.y + 20}" fill="\${s.color}" font-size="11.5" font-family="'JetBrains Mono',monospace" font-weight="700" text-anchor="end">\${s.count} | \${s.rate}</text>
          
          <!-- Transparent full-row hover hitbox -->
          <rect x="0" y="\${s.y - 4}" width="\${width}" height="40" fill="transparent" />
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
  }`;

// 4. REPLACEMENT FOR marginErosion
const newMarginErosionCode = `  // ==========================================
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

    // Structured 3-column layout:
    // Left: Cohort title (0 - 195px)
    // Center: Proportional cost bar (205 - 530px = 325px width)
    // Right: Exact cost & margin status (545 - 725px)
    const width = 740, height = 240;
    const barStartX = 205;
    const barMaxW = 325;
    const ceilingX = barStartX + (seatRev / 100) * barMaxW;

    let svg = \`
      <!-- Ticks along the bar area -->
      \${[0, 25, 50, 75, 100].map(v => \`
        <line x1="\${barStartX + (v / 100) * barMaxW}" y1="20" x2="\${barStartX + (v / 100) * barMaxW}" y2="205" stroke="\${BRAND.border}" stroke-dasharray="2,3" opacity="0.6" />
        <text x="\${barStartX + (v / 100) * barMaxW}" y="222" fill="\${BRAND.textDim}" font-size="10" font-family="'JetBrains Mono',monospace" text-anchor="middle">$\${v}</text>
      \`).join('')}

      <!-- Revenue Ceiling Line at $40 -->
      <line x1="\${ceilingX}" y1="12" x2="\${ceilingX}" y2="205" stroke="\${BRAND.warningAmber}" stroke-width="1.5" stroke-dasharray="3,3" />
      <text x="\${ceilingX}" y="10" fill="\${BRAND.warningAmber}" font-size="10" font-family="'JetBrains Mono',monospace" text-anchor="middle" font-weight="700">$\${seatRev.toFixed(0)} Ceiling</text>
    \`;

    cohorts.forEach((c, i) => {
      const y = 28 + i * 44;
      const barW = Math.min(barMaxW, (c.cost / 100) * barMaxW);
      const cohortName = t(dict, c.key);
      const marginStr = c.isLoss ? \`\${c.pct.toFixed(1)}% Loss\` : \`+\${c.pct.toFixed(1)}% Margin\`;

      svg += \`
        <g class="me-cohort-row" data-index="\${i}" style="cursor:pointer;">
          <!-- Left Label Column (0 - 195px) -->
          <text x="195" y="\${y + 16}" fill="\${BRAND.textWhite}" font-size="11.5" font-family="'Inter',sans-serif" font-weight="600" text-anchor="end">\${cohortName}</text>
          
          <!-- Center Track & Active Bar (205 - 530px) -->
          <rect x="\${barStartX}" y="\${y}" width="\${barMaxW}" height="24" rx="4" fill="\${BRAND.wellBg}" />
          <rect class="me-bar" x="\${barStartX}" y="\${y}" width="\${barW}" height="24" rx="4" fill="\${c.color}" fill-opacity="0.88" style="transition:all 0.15s ease;" />

          <!-- Right Dedicated Text Column (545 - 725px) -->
          <text x="545" y="\${y + 16}" fill="\${c.color}" font-size="11" font-family="'JetBrains Mono',monospace" font-weight="700" text-anchor="start">$\${c.cost.toFixed(2)} (\${marginStr})</text>
          
          <!-- Transparent row hitbox -->
          <rect x="0" y="\${y - 4}" width="\${width}" height="32" fill="transparent" />
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
  }`;

// Apply replacements to finops-charts.js
function replaceFn(content, fnHeader, nextFnHeader, newFnCode) {
  const startIdx = content.indexOf(fnHeader);
  if (startIdx === -1) {
    console.error('Could not find header:', fnHeader);
    return content;
  }
  const endIdx = content.indexOf(nextFnHeader, startIdx);
  if (endIdx === -1) {
    console.error('Could not find next header:', nextFnHeader);
    return content;
  }
  return content.slice(0, startIdx) + newFnCode + '\n\n' + content.slice(endIdx);
}

jsContent = replaceFn(
  jsContent,
  "  // 2. BREAK-EVEN LINE & DUAL CROSSHAIR",
  "  // 3. TOKEN DONUT: Session Composition",
  newBreakEvenCode
);

jsContent = replaceFn(
  jsContent,
  "  // 6. PARETO FRONTIER: SWE-bench Accuracy vs Cost",
  "  // 7. CASCADE ROUTING FUNNEL: Smart Gateway Yield",
  newParetoFrontierCode
);

jsContent = replaceFn(
  jsContent,
  "  // 7. CASCADE ROUTING FUNNEL: Smart Gateway Yield",
  "  // 8. SAAS GROSS MARGIN EROSION METER",
  newCascadeFunnelCode
);

jsContent = replaceFn(
  jsContent,
  "  // 8. SAAS GROSS MARGIN EROSION METER",
  "  // 9. PROMPT CACHE TTL DECAY TIMELINE",
  newMarginErosionCode
);

fs.writeFileSync(jsPath, jsContent, 'utf8');
console.log('Successfully updated src/assets/finops-charts.js with non-colliding layout architectures!');

