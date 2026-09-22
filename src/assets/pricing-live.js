/**
 * Live pricing overlay for the LLM API pricing tracker.
 *
 * The table is baked into the page at build time, so it is correct as
 * published. This script asks the Worker (/api/pricing) whether it has
 * anything fresher: known rows are patched in place, and models the Worker
 * discovered that the page does not list yet are appended after that
 * provider's rows. Every failure path — network error, bad JSON, non-numeric
 * value — leaves the baked-in table untouched. A stale-but-verified price
 * beats a live guess.
 */
(function () {
  var rows = document.querySelectorAll('tr[data-model]');
  if (!rows.length) return;

  var PROVIDER_NAMES = { anthropic: 'Anthropic', openai: 'OpenAI' };
  var FIELDS = ['input', 'output', 'cacheRead', 'cacheWrite5m', 'context'];

  function ok(v) { return typeof v === 'number' && isFinite(v) && v >= 0; }
  function fmt(field, v) {
    if (field === 'context') return v >= 1e6 ? +(v / 1e6).toFixed(2) + 'M' : v / 1000 + 'K';
    return '$' + (Math.round(v * 100) === v * 100 ? v.toFixed(2) : String(v));
  }
  function row(id) { return document.querySelector('tr[data-model="' + id + '"]'); }

  fetch('/api/pricing')
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      if (!data) return;
      Object.keys(PROVIDER_NAMES).forEach(function (key) {
        if (!Array.isArray(data[key])) return;
        var last = null;
        data[key].forEach(function (m) {
          if (!m || !m.id || !/^[a-z0-9-]+$/.test(m.id)) return;
          var tr = row(m.id);
          if (!tr) {
            if (!FIELDS.slice(0, 4).every(function (f) { return ok(m[f]); })) return;
            // Insert after the previous model of this provider, or its last baked row.
            var anchor = last || Array.prototype.filter.call(document.querySelectorAll('tr[data-model]'), function (r) {
              var p = r.querySelector('.provider-cell');
              return p && p.textContent.trim() === PROVIDER_NAMES[key];
            }).pop();
            if (!anchor) return;
            tr = document.createElement('tr');
            tr.setAttribute('data-model', m.id);
            var name = document.createElement('td');
            name.textContent = m.model;
            tr.innerHTML = '<td class="provider-cell"><strong>' + PROVIDER_NAMES[key] + '</strong></td>';
            tr.appendChild(name);
            FIELDS.forEach(function (f) {
              var td = document.createElement('td');
              td.className = (f === 'context' ? 'limit-cell' : 'price-cell') + ' official';
              td.setAttribute('data-f', f);
              td.textContent = '—';
              tr.appendChild(td);
            });
            tr.insertAdjacentHTML('beforeend', '<td>50%</td>');
            anchor.parentNode.insertBefore(tr, anchor.nextSibling);
          }
          last = tr;
          tr.querySelectorAll('[data-f]').forEach(function (cell) {
            var f = cell.getAttribute('data-f');
            var v = m[f];
            if (!ok(v) || String(v) === cell.getAttribute('data-val')) return;
            cell.setAttribute('data-val', v);
            cell.textContent = fmt(f, v);
          });
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
