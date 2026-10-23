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

