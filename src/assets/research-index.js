(function () {
  var index = document.querySelector("[data-research-index]");
  if (!index) return;

  var search = index.querySelector("[data-research-search]");
  var topic = index.querySelector("[data-research-topic]");
  var reset = index.querySelector("[data-research-reset]");
  var count = index.querySelector("[data-research-count]");
  var empty = index.querySelector("[data-research-empty]");
  var items = Array.prototype.slice.call(index.querySelectorAll("[data-research-item]"));
  var locale = index.getAttribute("data-locale") || "en";
  var labels = {
    en: { all: "All topics", visibility: "Cost visibility", optimize: "Optimization", models: "Models & pricing", agents: "Agents", governance: "Governance", other: "Other research", one: "article", many: "articles", empty: "No articles match those filters. Try another search or clear your filters." },
    es: { all: "Todos los temas", visibility: "Visibilidad de costes", optimize: "Optimización", models: "Modelos y precios", agents: "Agentes", governance: "Gobernanza", other: "Otros temas", one: "artículo", many: "artículos", empty: "Ningún artículo coincide con estos filtros. Prueba otra búsqueda o borra los filtros." },
    fr: { all: "Tous les sujets", visibility: "Visibilité des coûts", optimize: "Optimisation", models: "Modèles et tarifs", agents: "Agents", governance: "Gouvernance", other: "Autres sujets", one: "article", many: "articles", empty: "Aucun article ne correspond à ces filtres. Modifiez la recherche ou effacez les filtres." },
    de: { all: "Alle Themen", visibility: "Kostentransparenz", optimize: "Optimierung", models: "Modelle und Preise", agents: "Agenten", governance: "Governance", other: "Weitere Themen", one: "Artikel", many: "Artikel", empty: "Keine Artikel entsprechen diesen Filtern. Ändere die Suche oder setze die Filter zurück." },
    pt: { all: "Todos os temas", visibility: "Visibilidade de custos", optimize: "Otimização", models: "Modelos e preços", agents: "Agentes", governance: "Governança", other: "Outros temas", one: "artigo", many: "artigos", empty: "Nenhum artigo corresponde a estes filtros. Tente outra pesquisa ou limpe os filtros." },
    ja: { all: "すべてのトピック", visibility: "コストの可視化", optimize: "最適化", models: "モデルと料金", agents: "エージェント", governance: "ガバナンス", other: "その他の研究", one: "件の記事", many: "件の記事", empty: "条件に一致する記事がありません。検索語を変えるか、条件をリセットしてください。" }
  };
  var text = labels[locale] || labels.en;
  var topicLabels = {
    visibility: text.visibility,
    optimize: text.optimize,
    models: text.models,
    agents: text.agents,
    governance: text.governance,
    other: text.other
  };
  var patterns = {
    agents: /agent|autonomous|tool.?call|multi.?agent|agentic/,
    models: /pricing|price|how.?much|model|provider|gpt|claude|gemini|deepseek|openai|anthropic|llama|token.?cost/,
    optimize: /optim|cach|rout|inference|token|latency|batch|prompt|quantiz|throughput|efficient/,
    governance: /budget|guardrail|policy|governance|compliance|security|risk|anomal|monitor|forecast|control/,
    visibility: /attribut|chargeback|showback|allocat|billing|invoice|spend|cost|finops|accounting/
  };

  function normalize(value) {
    return value.toLocaleLowerCase(locale).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  items.forEach(function (item) {
    var content = normalize(item.textContent + " " + item.getAttribute("data-search"));
    var matches = Object.keys(patterns).filter(function (key) { return patterns[key].test(content); });
    if (!matches.length) matches.push("other");
    item.setAttribute("data-topics", matches.join(" "));
  });

  var available = {};
  items.forEach(function (item) {
    item.getAttribute("data-topics").split(" ").forEach(function (key) { available[key] = true; });
  });
  Object.keys(topicLabels).forEach(function (key) {
    if (!available[key]) return;
    var option = document.createElement("option");
    option.value = key;
    option.textContent = topicLabels[key];
    topic.appendChild(option);
  });

  function update() {
    var query = normalize(search.value.trim());
    var selectedTopic = topic.value;
    var visible = 0;
    items.forEach(function (item) {
      var matchesSearch = !query || normalize(item.textContent + " " + item.getAttribute("data-search")).indexOf(query) !== -1;
      var matchesTopic = !selectedTopic || item.getAttribute("data-topics").split(" ").indexOf(selectedTopic) !== -1;
      var show = matchesSearch && matchesTopic;
      item.hidden = !show;
      if (show) visible += 1;
    });
    count.textContent = visible + " " + (visible === 1 ? text.one : text.many) + " / " + items.length;
    empty.hidden = visible !== 0;
    reset.disabled = !query && !selectedTopic;
  }

  search.addEventListener("input", update);
  topic.addEventListener("change", update);
  reset.addEventListener("click", function () {
    search.value = "";
    topic.value = "";
    update();
    search.focus();
  });
  empty.textContent = text.empty;
  topic.options[0].textContent = text.all;
  index.querySelector("[data-research-controls]").hidden = false;
  index.querySelector("[data-research-count]").hidden = false;
  update();
})();
