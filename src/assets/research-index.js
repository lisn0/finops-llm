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
    ja: { all: "すべてのトピック", visibility: "コストの可視化", optimize: "最適化", models: "モデルと料金", agents: "エージェント", governance: "ガバナンス", other: "その他の研究", one: "件の記事", many: "件の記事", empty: "条件に一致する記事がありません。検索語を変えるか、条件をリセットしてください。" },
    it: { all: "Tutti gli argomenti", visibility: "Visibilità dei costi", optimize: "Ottimizzazione", models: "Modelli e prezzi", agents: "Agenti", governance: "Governance", other: "Altre ricerche", one: "articolo", many: "articoli", empty: "Nessun articolo corrisponde a questi filtri. Prova un'altra ricerca o cancella i filtri." },
    ko: { all: "모든 주제", visibility: "비용 가시성", optimize: "최적화", models: "모델 및 가격", agents: "에이전트", governance: "거버넌스", other: "기타 리서치", one: "개의 글", many: "개의 글", empty: "조건에 맞는 글이 없습니다. 다른 검색어를 입력하거나 필터를 지워 보세요." },
    zh: { all: "所有主题", visibility: "成本可见性", optimize: "优化", models: "模型与定价", agents: "智能体", governance: "治理", other: "其他研究", one: "篇文章", many: "篇文章", empty: "没有符合筛选条件的文章。请换个关键词或清除筛选。" },
    nl: { all: "Alle onderwerpen", visibility: "Kostentransparantie", optimize: "Optimalisatie", models: "Modellen en prijzen", agents: "Agents", governance: "Governance", other: "Overig onderzoek", one: "artikel", many: "artikelen", empty: "Geen artikelen komen overeen met deze filters. Probeer een andere zoekopdracht of wis de filters." },
    ar: { all: "كل المواضيع", visibility: "وضوح التكاليف", optimize: "التحسين", models: "النماذج والأسعار", agents: "الوكلاء", governance: "الحوكمة", other: "أبحاث أخرى", one: "مقال", many: "مقالات", empty: "لا توجد مقالات تطابق عوامل التصفية هذه. جرّب بحثًا آخر أو امسح عوامل التصفية." },
    ru: { all: "Все темы", visibility: "Прозрачность затрат", optimize: "Оптимизация", models: "Модели и цены", agents: "Агенты", governance: "Управление", other: "Другие исследования", one: "статья", many: "статей", empty: "Нет статей, подходящих под эти фильтры. Измените запрос или сбросьте фильтры." },
    tr: { all: "Tüm konular", visibility: "Maliyet görünürlüğü", optimize: "Optimizasyon", models: "Modeller ve fiyatlar", agents: "Ajanlar", governance: "Yönetişim", other: "Diğer araştırmalar", one: "makale", many: "makale", empty: "Bu filtrelerle eşleşen makale yok. Başka bir arama deneyin veya filtreleri temizleyin." },
    pl: { all: "Wszystkie tematy", visibility: "Widoczność kosztów", optimize: "Optymalizacja", models: "Modele i ceny", agents: "Agenci", governance: "Zarządzanie", other: "Inne badania", one: "artykuł", many: "artykułów", empty: "Żaden artykuł nie pasuje do tych filtrów. Zmień wyszukiwanie lub wyczyść filtry." },
    id: { all: "Semua topik", visibility: "Visibilitas biaya", optimize: "Optimasi", models: "Model dan harga", agents: "Agen", governance: "Tata kelola", other: "Riset lainnya", one: "artikel", many: "artikel", empty: "Tidak ada artikel yang cocok dengan filter ini. Coba pencarian lain atau hapus filter." },
    vi: { all: "Tất cả chủ đề", visibility: "Minh bạch chi phí", optimize: "Tối ưu hóa", models: "Mô hình và giá", agents: "Tác tử", governance: "Quản trị", other: "Nghiên cứu khác", one: "bài viết", many: "bài viết", empty: "Không có bài viết nào khớp với các bộ lọc này. Hãy thử tìm kiếm khác hoặc xóa bộ lọc." }
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
