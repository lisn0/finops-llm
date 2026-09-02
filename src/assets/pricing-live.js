/**
 * Live pricing overlay for the LLM API pricing tracker.
 *
 * The table is rendered at build time from src/_data/pricing.json, so it is
 * correct as published. This script asks the Worker (/api/pricing) whether it
 * has anything fresher and patches the cells in place if so. Every failure
 * path — network error, bad JSON, unknown model, non-numeric value — leaves
 * the baked-in table untouched. A stale-but-verified price beats a live guess.
 */
(function () {
  var rows = document.querySelectorAll('tr[data-model]');
  if (!rows.length) return;

  fetch('/api/pricing')
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      if (!data || !Array.isArray(data.anthropic)) return;
      var byId = {};
      data.anthropic.forEach(function (m) { if (m && m.id) byId[m.id] = m; });

      rows.forEach(function (row) {
        var m = byId[row.getAttribute('data-model')];
        if (!m) return;
        row.querySelectorAll('[data-f]').forEach(function (cell) {
          var v = m[cell.getAttribute('data-f')];
          if (typeof v !== 'number' || !isFinite(v) || v < 0) return;
          if (String(v) === cell.getAttribute('data-val')) return;
          cell.setAttribute('data-val', v);
          cell.textContent = cell.classList.contains('limit-cell')
            ? (v >= 1e6 ? v / 1e6 + 'M' : v / 1000 + 'K')
            : '$' + v.toFixed(2);
        });
      });

      if (data.updated) {
        document.querySelectorAll('[data-live-updated]').forEach(function (el) {
          el.textContent = data.updated;
        });
      }
    })
    .catch(function () { /* keep the published table */ });
})();
