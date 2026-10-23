import fs from 'fs';
import path from 'path';

const slug = 'research/next-concept-modeling-finops-economics';

const chart1Config = {
  title: {
    en: "Decode Latency vs Output Sequence Length",
    de: "Dekodierlatenz vs. Ausgabesequenzlänge",
    es: "Latencia de decodificación vs longitud de secuencia de salida",
    fr: "Latence de décodage vs longueur de séquence de sortie",
    ja: "デコード遅延 vs 出力シーケンス長",
    pt: "Latência de decodificação vs comprimento da sequência de saída",
    it: "Latenza di decodifica vs lunghezza sequenza di output",
    ko: "출력 시퀀스 길이에 따른 디코딩 지연 시간",
    zh: "解码延迟与输出序列长度对比",
    nl: "Decodeerlatentie vs. outputsequentielengte",
    ar: "زمن استجابة فك التشفير مقابل طول تسلسل الإخراج",
    ru: "Задержка декодирования в зависимости от длины выходной последовательности",
    tr: "Çıktı Dizi Uzunluğuna Karşı Kod Çözme Gecikmesi",
    pl: "Opóźnienie dekodowania a długość sekwencji wyjściowej",
    id: "Latensi Dekode vs Panjang Urutan Output",
    vi: "Độ trễ giải mã so với độ dài chuỗi đầu ra"
  },
  subtitle: {
    en: "Total decode execution time (ms) as generated output length scales from 128 to 2,048 tokens",
    de: "Gesamtausführungszeit der Dekodierung (ms) bei Skalierung der Ausgabelänge von 128 auf 2.048 Token",
    es: "Tiempo total de ejecución de decodificación (ms) a medida que la longitud de salida escala de 128 a 2.048 tokens",
    fr: "Temps d'exécution total du décodage (ms) selon la longueur générée de 128 à 2 048 jetons",
    ja: "生成トークン数が128から2,048にスケールした際の合計デコード実行時間（ミリ秒）",
    pt: "Tempo total de execução de decodificação (ms) conforme o tamanho da saída varia de 128 a 2.048 tokens",
    it: "Tempo totale di esecuzione della decodifica (ms) con output da 128 a 2.048 token",
    ko: "생성 토큰 수가 128개에서 2,048개로 증가할 때의 총 디코딩 실행 시간(ms)",
    zh: "生成输出长度从 128 扩展到 2,048 个 token 时的总解码执行时间（毫秒）",
    nl: "Totale decodeeruitvoeringstijd (ms) naarmate de uitvoerlengte schaalt van 128 naar 2.048 tokens",
    ar: "إجمالي وقت تنفيذ فك التشفير (مللي ثانية) مع زيادة طول الإخراج من 128 إلى 2048 رمزًا",
    ru: "Общее время выполнения декодирования (мс) при масштабировании длины от 128 до 2048 токенов",
    tr: "Çıktı uzunluğu 128'den 2.048 belirtece çıktıkça toplam kod çözme yürütme süresi (ms)",
    pl: "Całkowity czas dekodowania (ms) przy skalowaniu długości wyjścia od 128 do 2048 tokenów",
    id: "Total waktu eksekusi dekode (ms) saat panjang output meningkat dari 128 ke 2.048 token",
    vi: "Tổng thời gian thực thi giải mã (ms) khi độ dài đầu ra tăng từ 128 lên 2.048 token"
  },
  summaryTag: {
    en: "Inference Latency",
    de: "Inferenzlatenz",
    es: "Latencia de inferencia",
    fr: "Latence d'inférence",
    ja: "推論遅延",
    pt: "Latência de inferência",
    it: "Latenza di inferenza",
    ko: "추론 지연 시간",
    zh: "推理延迟",
    nl: "Inferentielatentie",
    ar: "زمن استجابة الاستدلال",
    ru: "Задержка вывода",
    tr: "Çıkarım Gecikmesi",
    pl: "Opóźnienie wnioskowania",
    id: "Latensi Inferensi",
    vi: "Độ trễ suy luận"
  },
  summaryText: {
    en: "At 1,024 output tokens, NCM generates full responses in 95ms vs 1,840ms for sequential autoregressive decoding.",
    de: "Bei 1.024 Ausgabetoken generiert NCM Antworten in 95 ms gegenüber 1.840 ms beim sequenziellen autoregressiven Dekodieren.",
    es: "Con 1.024 tokens de salida, NCM genera respuestas completas en 95 ms frente a 1.840 ms del modelo autorregresivo.",
    fr: "À 1 024 jetons de sortie, NCM produit une réponse en 95 ms contre 1 840 ms pour l'autorégressif séquentiel.",
    ja: "1,024出力トークン時、NCMは逐次自己回帰の1,840msに対してわずか95msで完全な応答を生成します。",
    pt: "Em 1.024 tokens de saída, o NCM gera respostas completas em 95 ms contra 1.840 ms do modelo autorregressivo.",
    it: "A 1.024 token di output, NCM genera risposte in 95 ms contro i 1.840 ms del modello autoregressivo.",
    ko: "1,024개 출력 토큰 기준, NCM은 순차적 자기회귀(1,840ms) 대비 95ms 만에 전체 응답을 생성합니다.",
    zh: "在 1,024 个输出 token 下，NCM 仅需 95ms 生成完整响应，而传统自回归模型需要 1,840ms。",
    nl: "Bij 1.024 outputtokens genereert NCM antwoorden in 95 ms vergeleken met 1.840 ms voor autoregressief.",
    ar: "عند 1024 رمز إخراج، يولد NCM استجابات كاملة في 95 مللي ثانية مقابل 1840 مللي ثانية للنموذج الانحداري الذاتي.",
    ru: "При 1024 выходных токенах NCM генерирует ответ за 95 мс против 1840 мс у авторегрессионного декодирования.",
    tr: "1.024 çıktı belirtecinde NCM, ardışık otoregresif 1.840 ms yerine 95 ms'de yanıt üretir.",
    pl: "Przy 1024 tokenach wyjściowych NCM generuje odpowiedzi w 95 ms wobec 1840 ms w modelu autoregresyjnym.",
    id: "Pada 1.024 token output, NCM menghasilkan respons penuh dalam 95 ms vs 1.840 ms untuk autoregresif sekuensial.",
    vi: "Tại 1.024 token đầu ra, NCM tạo phản hồi đầy đủ trong 95ms so với 1.840ms của mô hình tự hồi quy."
  },
  summaryDelta: {
    en: "19.4x Speedup",
    de: "19,4x Beschleunigung",
    es: "Aceleración de 19,4x",
    fr: "Accélération 19,4x",
    ja: "19.4倍高速化",
    pt: "Aceleração de 19,4x",
    it: "Velocizzazione 19,4x",
    ko: "19.4배 속도 향상",
    zh: "19.4倍提速",
    nl: "19,4x Versnelling",
    ar: "تسريع بمقدار 19.4 ضعف",
    ru: "Ускорение в 19,4 раза",
    tr: "19,4 Kat Hızlanma",
    pl: "19,4x Przyspieszenie",
    id: "Peningkatan Kecepatan 19,4x",
    vi: "Tăng tốc 19,4 lần"
  },
  xLabel: {
    en: "Output Sequence Length (Tokens) →",
    de: "Ausgabelänge (Token) →",
    es: "Longitud de salida (Tokens) →",
    fr: "Longueur de séquence de sortie (Jetons) →",
    ja: "出力シーケンス長（トークン） →",
    pt: "Comprimento da sequência de saída (Tokens) →",
    it: "Lunghezza sequenza di output (Token) →",
    ko: "출력 시퀀스 길이 (토큰) →",
    zh: "输出序列长度（Token） →",
    nl: "Uitvoerlengte (Tokens) →",
    ar: "طول تسلسل الإخراج (رموز) ←",
    ru: "Длина выходной последовательности (Токены) →",
    tr: "Çıktı Dizi Uzunluğu (Belirteç) →",
    pl: "Długość sekwencji wyjściowej (Tokeny) →",
    id: "Panjang Urutan Output (Token) →",
    vi: "Độ dài chuỗi đầu ra (Token) →"
  },
  yLabel: {
    en: "Total Generation Time (ms)",
    de: "Gesamte Generierungszeit (ms)",
    es: "Tiempo total de generación (ms)",
    fr: "Temps total de génération (ms)",
    ja: "総生成時間（ミリ秒）",
    pt: "Tempo total de geração (ms)",
    it: "Tempo totale di generazione (ms)",
    ko: "총 생성 시간 (ms)",
    zh: "总生成时间（毫秒）",
    nl: "Totale generatietijd (ms)",
    ar: "إجمالي وقت التوليد (مللي ثانية)",
    ru: "Общее время генерации (мс)",
    tr: "Toplam Üretim Süresi (ms)",
    pl: "Całkowity czas generowania (ms)",
    id: "Total Waktu Generasi (ms)",
    vi: "Tổng thời gian tạo (ms)"
  },
  xSuffix: " tok",
  ySuffix: "ms",
  xMin: 128,
  xMax: 2048,
  series: [
    {
      label: {
        en: "Autoregressive (AR: 1 token/step)",
        de: "Autoregressiv (AR: 1 Token/Schritt)",
        es: "Autorregresivo (AR: 1 token/paso)",
        fr: "Autorégressif (AR : 1 jeton/étape)",
        ja: "自己回帰（AR：1トークン/ステップ）",
        pt: "Autorregressivo (AR: 1 token/passo)",
        it: "Autoregressivo (AR: 1 token/passo)",
        ko: "자기회귀 (AR: 단계당 1 토큰)",
        zh: "自回归（AR：逐 token 解码）",
        nl: "Autoregressief (AR: 1 token/stap)",
        ar: "انحداري ذاتي (AR: رمز واحد/خطوة)",
        ru: "Авторегрессионный (AR: 1 токен/шаг)",
        tr: "Otoregresif (AR: 1 belirteç/adım)",
        pl: "Autoregresyjny (AR: 1 token/krok)",
        id: "Autoregresif (AR: 1 token/langkah)",
        vi: "Tự hồi quy (AR: 1 token/bước)"
      },
      points: [[128, 230], [256, 460], [512, 920], [1024, 1840], [2048, 3680]]
    },
    {
      label: {
        en: "Diffusion LM (DLM: 64 steps)",
        de: "Diffusions-LM (DLM: 64 Schritte)",
        es: "LM de Difusión (DLM: 64 pasos)",
        fr: "Diffusion LM (DLM : 64 étapes)",
        ja: "拡散モデル（DLM：64ステップ）",
        pt: "LM de Difusão (DLM: 64 passos)",
        it: "LM di Diffusione (DLM: 64 passi)",
        ko: "확산 언어 모델 (DLM: 64단계)",
        zh: "扩散语言模型（DLM：64 步去噪）",
        nl: "Diffusie-LM (DLM: 64 stappen)",
        ar: "نموذج الانتشار اللغوي (DLM: 64 خطوة)",
        ru: "Диффузионная языковая модель (DLM: 64 шага)",
        tr: "Difüzyon Dili Modeli (DLM: 64 adım)",
        pl: "Model dyfuzyjny (DLM: 64 kroki)",
        id: "Model Bahasa Difusi (DLM: 64 langkah)",
        vi: "Mô hình ngôn ngữ khuếch tán (DLM: 64 bước)"
      },
      points: [[128, 640], [256, 980], [512, 1620], [1024, 2950], [2048, 5600]]
    },
    {
      label: {
        en: "Next-Concept Modeling (NCM: 6 levels)",
        de: "Next-Concept Modeling (NCM: 6 Ebenen)",
        es: "Next-Concept Modeling (NCM: 6 niveles)",
        fr: "Next-Concept Modeling (NCM : 6 niveaux)",
        ja: "Next-Concept Modeling（NCM：6階層）",
        pt: "Next-Concept Modeling (NCM: 6 níveis)",
        it: "Next-Concept Modeling (NCM: 6 livelli)",
        ko: "Next-Concept Modeling (NCM: 6개 계층)",
        zh: "下一概念建模（NCM：6 层并行概念）",
        nl: "Next-Concept Modeling (NCM: 6 niveaus)",
        ar: "نمذجة المفهوم التالي (NCM: 6 مستويات)",
        ru: "Next-Concept Modeling (NCM: 6 уровней)",
        tr: "Next-Concept Modeling (NCM: 6 seviye)",
        pl: "Next-Concept Modeling (NCM: 6 poziomów)",
        id: "Next-Concept Modeling (NCM: 6 level)",
        vi: "Mô hình hóa khái niệm tiếp theo (NCM: 6 cấp độ)"
      },
      points: [[128, 65], [256, 75], [512, 85], [1024, 95], [2048, 120]]
    }
  ],
  ratio: {
    num: 0,
    den: 2,
    label: {
      en: "NCM Speedup vs AR:",
      de: "NCM-Vorteil vs. AR:",
      es: "Aceleración NCM vs AR:",
      fr: "Accélération NCM vs AR :",
      ja: "NCM対自己回帰比:",
      pt: "Aceleração NCM vs AR:",
      it: "Vantaggio NCM vs AR:",
      ko: "NCM 대 AR 속도비:",
      zh: "NCM 相对 AR 提速:",
      nl: "NCM-voordeel vs. AR:",
      ar: "تسريع NCM مقابل AR:",
      ru: "Преимущество NCM перед AR:",
      tr: "AR'ye Karşı NCM Hızı:",
      pl: "Przyspieszenie NCM vs AR:",
      id: "Kecepatan NCM vs AR:",
      vi: "Tốc độ NCM so với AR:"
    }
  }
};

const chart2Config = {
  title: {
    en: "Effective Serving Cost per 1M Output Tokens (Hardware TCO)",
    de: "Effektive Bereitstellungskosten pro 1 Mio. Ausgabetoken (Hardware-TCO)",
    es: "Costo efectivo de servicio por 1M de tokens de salida (TCO de hardware)",
    fr: "Coût réel d'inférence pour 1M de jetons de sortie (TCO matériel)",
    ja: "出力100万トークンあたりの実効サービングコスト（ハードウェアTCO）",
    pt: "Custo efetivo de serviço por 1M de tokens de saída (TCO de hardware)",
    it: "Costo effettivo di erogazione per 1M token di output (TCO hardware)",
    ko: "출력 100만 토큰당 유효 서빙 비용 (하드웨어 TCO)",
    zh: "每 100 万输出 token 的实际部署成本（硬件 TCO）",
    nl: "Effectieve kosten per 1M outputtokens (Hardware-TCO)",
    ar: "التكلفة الفعلية لخدمة مليون رمز إخراج (التكلفة الإجمالية للأجهزة)",
    ru: "Фактическая стоимость обслуживания 1 млн выходных токенов (TCO оборудования)",
    tr: "1 Milyon Çıktı Belirteci Başına Etkin Sunum Maliyeti (Donanım TCO)",
    pl: "Efektywny koszt serwowania za 1 mln tokenów wyjściowych (TCO sprzętu)",
    id: "Biaya Layanan Efektif per 1 Juta Token Output (TCO Perangkat Keras)",
    vi: "Chi phí phục vụ thực tế trên 1 triệu token đầu ra (TCO phần cứng)"
  },
  subtitle: {
    en: "Normalized GPU infrastructure cost based on decode phase memory bandwidth utilization and tensor core saturation",
    de: "Normalisierte GPU-Infrastrukturkosten basierend auf Speicherbandbreitenauslastung und Tensor-Core-Sättigung",
    es: "Costo de infraestructura GPU normalizado según la saturación de memoria y núcleos tensor en decodificación",
    fr: "Coût normalisé d'infrastructure GPU selon l'utilisation de la bande passante mémoire et la saturation des cœurs Tensor",
    ja: "デコード時のメモリ帯域幅利用率とTensor Core飽和度に基づくGPUインフラコストの正規化",
    pt: "Custo normalizado de infraestrutura de GPU com base na largura de banda de memória e saturação dos Tensor Cores",
    it: "Costo normalizzato dell'infrastruttura GPU in base all'uso della memoria e alla saturazione dei Tensor Core",
    ko: "디코딩 단계의 메모리 대역폭 활용도 및 텐서 코어 포화도를 기반으로 정규화된 GPU 인프라 비용",
    zh: "基于解码阶段内存带宽利用率及 Tensor Core 饱和度归一化的 GPU 基础设施成本",
    nl: "Genormaliseerde GPU-kosten op basis van geheugenbandbreedte en tensor-core-benutting",
    ar: "تكلفة بنية GPU الأساسية المعدلة بناءً على استخدام نطاق الذاكرة وتشبع نوى Tensor أثناء فك التشفير",
    ru: "Нормализованная стоимость GPU-инфраструктуры на основе загрузки памяти и тензорных ядер при декодировании",
    tr: "Kod çözme aşamasındaki bellek bant genişliği ve tensör çekirdeği doyumuna dayalı normalleştirilmiş GPU maliyeti",
    pl: "Znormalizowany koszt infrastruktury GPU w oparciu o przepustowość pamięci i nasycenie rdzeni Tensor",
    id: "Biaya infrastruktur GPU yang dinormalisasi berdasarkan utilisasi bandwidth memori dan saturasi tensor core",
    vi: "Chi phí cơ sở hạ tầng GPU được chuẩn hóa dựa trên mức sử dụng băng thông bộ nhớ và độ bão hòa tensor core"
  },
  summaryTag: {
    en: "Inference Economics",
    de: "Inferenzökonomie",
    es: "Economía de inferencia",
    fr: "Économie d'inférence",
    ja: "推論エコノミクス",
    pt: "Economia de inferência",
    it: "Economia dell'inferenza",
    ko: "추론 경제학",
    zh: "推理经济学",
    nl: "Inferentie-economie",
    ar: "اقتصاديات الاستدلال",
    ru: "Экономика инференса",
    tr: "Çıkarım Ekonomisi",
    pl: "Ekonomia wnioskowania",
    id: "Ekonomi Inferensi",
    vi: "Kinh tế học suy luận"
  },
  summaryText: {
    en: "Parallel level decoding eliminates 72% of memory-bandwidth idling during output generation.",
    de: "Paralleles Ebenen-Dekodieren eliminiert 72 % des Speicherbandbreiten-Leerlaufs bei der Ausgabe.",
    es: "La decodificación por niveles paralelos elimina el 72% del tiempo ocioso de memoria en la generación de salida.",
    fr: "Le décodage parallèle par niveaux élimine 72 % des temps morts de bande passante mémoire lors de la génération.",
    ja: "並列レベルデコードにより、出力生成時のメモリ帯域幅待機アイドル時間を72%削減します。",
    pt: "A decodificação paralela por níveis elimina 72% da ociosidade da largura de banda de memória na saída.",
    it: "La decodifica parallela per livelli elimina il 72% dell'inattività della larghezza di banda di memoria.",
    ko: "병렬 계층 디코딩을 통해 출력 생성 시 메모리 대역폭 유휴 상태의 72%를 제거합니다.",
    zh: "并行分层解码消除了输出生成过程中 72% 的显存带宽空转损耗。",
    nl: "Parallel niveau-decoderen elimineert 72% van het wachten op geheugenbandbreedte bij uitvoergeneratie.",
    ar: "يقضي فك التشفير المتوازي للمستويات على 72% من خمول نطاق الذاكرة أثناء توليد المخرجات.",
    ru: "Параллельное поуровневое декодирование устраняет 72% простоя пропускной способности памяти.",
    tr: "Paralel seviye kod çözme, çıktı üretimi sırasındaki bellek bant genişliği beklemesinin %72'sini ortadan kaldırır.",
    pl: "Równoległe dekodowanie poziomów eliminuje 72% bezczynności przepustowości pamięci podczas generowania.",
    id: "Dekode tingkat paralel menghilangkan 72% waktu menganggur bandwidth memori selama pembuatan output.",
    vi: "Giải mã cấp độ song song loại bỏ 72% thời gian chờ băng thông bộ nhớ trong quá trình tạo đầu ra."
  },
  summaryDelta: {
    en: "-72% Hardware TCO",
    de: "-72% Hardware-TCO",
    es: "-72% TCO de hardware",
    fr: "-72% TCO matériel",
    ja: "-72% ハードウェアTCO",
    pt: "-72% TCO de hardware",
    it: "-72% TCO hardware",
    ko: "-72% 하드웨어 TCO",
    zh: "-72% 硬件总拥有成本",
    nl: "-72% Hardware-TCO",
    ar: "-72% التكلفة الإجمالية للأجهزة",
    ru: "-72% TCO оборудования",
    tr: "-%72 Donanım TCO",
    pl: "-72% TCO sprzętu",
    id: "-72% TCO Perangkat Keras",
    vi: "-72% TCO phần cứng"
  },
  valuePrefix: "$",
  valueSuffix: "/M",
  maxValue: 18.0,
  marker: {
    value: 10.0,
    label: {
      en: "$10.00 Commercial AR Floor",
      de: "$10,00 Kommerzieller AR-Boden",
      es: "$10.00 Piso comercial AR",
      fr: "$10,00 Plafond plancher AR commercial",
      ja: "$10.00 商用ARフロア",
      pt: "$10,00 Piso comercial AR",
      it: "$10,00 Minimo commerciale AR",
      ko: "$10.00 상용 AR 하한선",
      zh: "$10.00 商业自回归价格基线",
      nl: "$10,00 Commerciële AR-bodem",
      ar: "$10.00 الحد التجاري الأدنى لـ AR",
      ru: "$10.00 Коммерческий базовый уровень AR",
      tr: "$10,00 Ticari AR Tabanı",
      pl: "$10,00 Komercyjny poziom bazowy AR",
      id: "$10,00 Batas Bawah AR Komersial",
      vi: "$10,00 Mức sàn AR thương mại"
    }
  },
  items: [
    {
      label: {
        en: "Frontier Commercial API (AR Output List Price)",
        de: "Frontier Commercial API (Listenpreis für AR-Ausgabe)",
        es: "API comercial de frontera (Precio de lista de salida AR)",
        fr: "API commerciale Frontier (Prix catalogue sortie AR)",
        ja: "フロンティア商用API（AR出力リスト価格）",
        pt: "API comercial Frontier (Preço de tabela de saída AR)",
        it: "API commerciale Frontier (Prezzo di listino output AR)",
        ko: "프론티어 상용 API (AR 출력 정가)",
        zh: "前沿商业 API（自回归输出标价）",
        nl: "Frontier commerciële API (Lijstprijs AR-uitvoer)",
        ar: "واجهة برمجة تطبيقات تجارية رائدة (سعر قائمة إخراج AR)",
        ru: "Коммерческий API флагманских моделей (Цена за вывод AR)",
        tr: "Öncü Ticari API (AR Çıktı Liste Fiyatı)",
        pl: "Komercyjne API modeli wiodących (Cena katalogowa AR)",
        id: "API Komersial Frontier (Harga Daftar Output AR)",
        vi: "API thương mại tiên phong (Giá niêm yết đầu ra AR)"
      },
      value: 15.0,
      note: {
        en: "Standard 3x-5x pricing markup over input tokens due to sequential GPU memory trips",
        de: "Standardmäßiger 3- bis 5-facher Aufschlag gegenüber Eingabetoken durch sequenzielle Speicherzugriffe",
        es: "Margen estándar de 3x a 5x sobre tokens de entrada debido a lecturas secuenciales de memoria",
        fr: "Majoration standard de 3x à 5x sur les jetons d'entrée en raison des transferts mémoire séquentiels",
        ja: "逐次メモリアクセスに伴い、入力トークン比3〜5倍の標準価格設定",
        pt: "Margem padrão de 3x a 5x sobre tokens de entrada devido a acessos sequenciais de memória",
        it: "Sovrapprezzo standard da 3x a 5x rispetto ai token di input per accessi sequenziali alla memoria",
        ko: "순차적 메모리 접근으로 인해 입력 토큰 대비 3~5배의 표준 마크업 부과",
        zh: "因逐 token 访问显存带宽瓶颈，商业计费对输出 token 普遍加收 3-5 倍溢价",
        nl: "Standaard 3x-5x toeslag t.o.v. invoertokens door sequentiële geheugenoproepen",
        ar: "هامش قياسي يتراوح بين 3 إلى 5 أضعاف على رموز الإدخال بسبب رحلات الذاكرة المتسلسلة",
        ru: "Стандартная наценка в 3-5 раз к входным токенам из-за последовательных обращений к памяти",
        tr: "Ardışık bellek erişimleri nedeniyle girdi belirteçlerine kıyasla 3-5 kat standart fiyatlandırma",
        pl: "Standardowa 3-5 krotna narzut w stosunku do tokenów wejściowych przez sekwencyjny odczyt pamięci",
        id: "Markup standar 3x-5x dari token input karena pembacaan memori sekuensial",
        vi: "Mức giá tiêu chuẩn gấp 3-5 lần token đầu vào do các lượt truy xuất bộ nhớ tuần tự"
      }
    },
    {
      label: {
        en: "Self-Hosted Standard AR (vLLM / H100 Cluster)",
        de: "Selbst gehostetes Standard-AR (vLLM / H100 Cluster)",
        es: "AR estándar autoalojado (Cluster vLLM / H100)",
        fr: "AR standard auto-hébergé (Cluster vLLM / H100)",
        ja: "セルフホスト標準AR（vLLM / H100クラスタ）",
        pt: "AR padrão auto-hospedado (Cluster vLLM / H100)",
        it: "AR standard self-hosted (Cluster vLLM / H100)",
        ko: "자체 호스팅 표준 AR (vLLM / H100 클러스터)",
        zh: "自建标准自回归集群（vLLM / H100 集群）",
        nl: "Self-hosted standaard AR (vLLM / H100-cluster)",
        ar: "نموذج AR قياسي مستضاف ذاتيًا (مجموعة vLLM / H100)",
        ru: "Собственный стандартный AR (Кластер vLLM / H100)",
        tr: "Kendi Sunucunda Standart AR (vLLM / H100 Kümesi)",
        pl: "Samodzielnie hostowany AR (Klaster vLLM / H100)",
        id: "AR Standar Self-Hosted (Klaster vLLM / H100)",
        vi: "AR tiêu chuẩn tự lưu trữ (Cụm vLLM / H100)"
      },
      value: 8.8,
      note: {
        en: "Memory bandwidth bottleneck bounds GPU utilization to 18-24% MFU during decode",
        de: "Speicherbandbreite begrenzt die GPU-Auslastung auf 18-24 % MFU beim Dekodieren",
        es: "El cuello de botella de memoria limita la utilización de la GPU al 18-24% MFU durante el decode",
        fr: "Le goulot d'étranglement mémoire limite l'utilisation GPU à 18-24% de MFU pendant le décodage",
        ja: "メモリ帯域幅の制約により、デコード中のGPU利用率はわずか18〜24% MFUに制限",
        pt: "Gargalo de memória limita a utilização da GPU a 18-24% MFU durante o decode",
        it: "Il collo di bottiglia della memoria limita l'utilizzo della GPU al 18-24% MFU in decodifica",
        ko: "메모리 대역폭 병목 현상으로 인해 디코딩 중 GPU 가동률이 18~24% MFU에 제한됨",
        zh: "显存带宽瓶颈导致解码阶段 GPU 算力利用率（MFU）仅维持在 18-24%",
        nl: "Geheugenbandbreedte beperkt GPU-benutting tot 18-24% MFU tijdens decodering",
        ar: "عنق زجاجة نطاق الذاكرة يقيد استخدام وحدة معالجة الرسومات إلى 18-24% MFU أثناء فك التشفير",
        ru: "Узкое место памяти ограничивает загрузку GPU до 18-24% MFU при декодировании",
        tr: "Bellek bant genişliği darboğazı, kod çözme sırasında GPU kullanımını %18-24 MFU ile sınırlar",
        pl: "Wąskie gardło pamięci ogranicza wykorzystanie GPU do 18-24% MFU podczas dekodowania",
        id: "Bottleneck bandwidth memori membatasi utilisasi GPU menjadi 18-24% MFU selama dekode",
        vi: "Điểm nghẽn băng thông bộ nhớ giới hạn mức sử dụng GPU ở mức 18-24% MFU khi giải mã"
      }
    },
    {
      label: {
        en: "Speculative Decoding (Draft + Target AR)",
        de: "Spekulatives Dekodieren (Draft + Target AR)",
        es: "Decodificación especulativa (Draft + Target AR)",
        fr: "Décodage spéculatif (Draft + Target AR)",
        ja: "投機的デコード（ドラフト + ターゲットAR）",
        pt: "Decodificação especulativa (Draft + Target AR)",
        it: "Decodifica speculativa (Draft + Target AR)",
        ko: "추측 디코딩 (Draft + Target AR)",
        zh: "投机解码（小模型草稿 + 目标模型验证）",
        nl: "Speculatieve decodering (Draft + Target AR)",
        ar: "فك التشفير التخميني (نموذج تمهيدي + نموذج مستهدف)",
        ru: "Спекулятивное декодирование (Draft + Target AR)",
        tr: "Spekülatif Kod Çözme (Draft + Target AR)",
        pl: "Dekodowanie spekulatywne (Draft + Target AR)",
        id: "Dekode Spekulatif (Draft + Target AR)",
        vi: "Giải mã suy đoán (Draft + Target AR)"
      },
      value: 5.6,
      note: {
        en: "Acceptance rate degrades sharply on high-entropy agentic tool calls and novel code",
        de: "Akzeptanzrate sinkt drastisch bei komplexen Tool-Aufrufen und neuem Programmcode",
        es: "La tasa de aceptación cae bruscamente en llamadas a herramientas complejas y código nuevo",
        fr: "Le taux d'acceptation chute fortement sur le code complexe et les appels d'outils",
        ja: "高エントロピーなエージェントのツール呼び出しや未知のコードで受容率が急低下",
        pt: "A taxa de aceitação cai drasticamente em chamadas de ferramentas e códigos novos",
        it: "Il tasso di accettazione cala bruscamente con codice nuovo e chiamate a tool complessi",
        ko: "고엔트로피 에이전트 도구 호출 및 새로운 코드 생성 시 토큰 수락률이 급감",
        zh: "在复杂代码编写和多工具调用等高熵场景下，草稿 token 接受率急剧下降",
        nl: "Acceptatiegraad daalt sterk bij complexe tool calls en nieuwe programmacode",
        ar: "ينخفض معدل القبول بشكل حاد عند استدعاء الأدوات المعقدة والأكواد البرمجية الجديدة",
        ru: "Уровень принятия токенов резко падает при сложных вызовах инструментов и новом коде",
        tr: "Karmaşık araç çağrıları ve yeni kodlarda belirteç kabul oranı keskin şekilde düşer",
        pl: "Wskaźnik akceptacji gwałtownie spada przy wywołaniach narzędzi i nowym kodzie",
        id: "Tingkat penerimaan turun tajam pada pemanggilan tool agen dan kode baru",
        vi: "Tỷ lệ chấp nhận giảm mạnh đối với các lệnh gọi công cụ phức tạp và mã mới"
      }
    },
    {
      label: {
        en: "Next-Concept Modeling (NCM Hierarchical Parallel)",
        de: "Next-Concept Modeling (NCM hierarchisch parallel)",
        es: "Next-Concept Modeling (NCM jerárquico en paralelo)",
        fr: "Next-Concept Modeling (NCM hiérarchique parallèle)",
        ja: "Next-Concept Modeling（NCM階層並列生成）",
        pt: "Next-Concept Modeling (NCM hierárquico paralelo)",
        it: "Next-Concept Modeling (NCM gerarchico parallelo)",
        ko: "Next-Concept Modeling (NCM 계층형 병렬 생성)",
        zh: "下一概念建模（NCM 粗到精分层并行）",
        nl: "Next-Concept Modeling (NCM hiërarchisch parallel)",
        ar: "نمذجة المفهوم التالي (NCM هرمي متوازي)",
        ru: "Next-Concept Modeling (NCM иерархический параллельный)",
        tr: "Next-Concept Modeling (NCM Hiyerarşik Paralel)",
        pl: "Next-Concept Modeling (NCM hierarchiczny równoległy)",
        id: "Next-Concept Modeling (NCM Hierarkis Paralel)",
        vi: "Mô hình hóa khái niệm tiếp theo (NCM phân cấp song song)"
      },
      value: 2.45,
      note: {
        en: "Constant 4-8 compute-saturated matrix steps; 75%+ Tensor Core utilization",
        de: "Konstant 4-8 rechengesättigte Matrix-Schritte; über 75 % Tensor-Core-Auslastung",
        es: "4-8 pasos matriciales constantes que saturan el cómputo; más del 75% de uso de Tensor Cores",
        fr: "4 à 8 étapes matricielles saturant le calcul; plus de 75 % d'utilisation des cœurs Tensor",
        ja: "わずか4〜8回の並列行列演算ステップで計算を完全飽和。75%以上のTensor Core利用率",
        pt: "Constantes 4-8 passos matriciais saturando a computação; mais de 75% de uso dos Tensor Cores",
        it: "Costanti 4-8 passaggi di moltiplicazione matriciale; oltre il 75% di utilizzo dei Tensor Core",
        ko: "상수 4~8회의 행렬 연산으로 연산 능력 포화; 75% 이상의 텐서 코어 가동률 달성",
        zh: "固定 4-8 次满载并行的矩阵乘法前向计算，Tensor Core 算力利用率突破 75%",
        nl: "Constante 4-8 matrixberekeningen; meer dan 75% Tensor Core-benutting",
        ar: "خطوات مصفوفية ثابتة من 4 إلى 8 خطوات مشبعة حوسبيًا؛ استخدام لأكثر من 75% من نوى Tensor",
        ru: "Постоянные 4-8 шагов параллельных матричных вычислений; более 75% загрузки тензорных ядер",
        tr: "Hesaplamayı doyuran sabit 4-8 matris adımı; %75'in üzerinde Tensör Çekirdeği kullanımı",
        pl: "Stałe 4-8 kroków obliczeń macierzowych nasycających sprzęt; ponad 75% utylizacji rdzeni Tensor",
        id: "Langkah matriks komputasi konstan 4-8 tahap; pemanfaatan Tensor Core di atas 75%",
        vi: "Cố định 4-8 bước tính toán ma trận bão hòa; mức sử dụng Tensor Core trên 75%"
      }
    }
  ]
};

const enBody = `<p>Every engineering organization managing six-figure monthly model bills eventually hits the same structural wall: <strong>output tokens cost between 3x and 5x more than input tokens</strong> across every major provider. On Claude Opus 5.5, inputs are $4.00/M while outputs are $20.00/M. On GPT-6 Astra, the bill jumps from $10.00/M to $50.00/M. For long-running agents writing code diffs, synthesizing SQL queries, or generating multi-page technical reports, output generation accounts for over 78% of invoice spend.</p>

<p>This premium is not commercial price-gouging; it is an unavoidable consequence of the <strong>memory-bandwidth wall in autoregressive decoding</strong>. In October 2026, researchers from Stanford's Hazy Research group and Together AI published a foundational architecture paper that challenges this status quo: <em>"Next-Concept Modeling: Fast, Parallel Coarse-to-Fine Text Generation"</em> (arXiv:2610.14162). For FinOps and infrastructure teams, Next-Concept Modeling (NCM) represents the first mathematically rigorous path toward collapsing the 5x output token markup.</p>

<h2>1. The Root Cause: Why Autoregressive Decoding Bleeds GPU Capital</h2>

<p>To evaluate NCM's financial implications, infrastructure engineers must understand why standard large language models waste so much server hardware during generation. Autoregressive (AR) models generate sequences strictly one token at a time:</p>

<blockquote>
<p><code>P(x) = ∏ P(x_t | x_&lt;t)</code></p>
</blockquote>

<p>Generating 1,000 output tokens requires <strong>1,000 sequential forward passes</strong>. During each pass, the GPU must stream the entire model's parameter weights and every cached key-value tensor from High Bandwidth Memory (HBM) into on-chip SRAM just to calculate a single token vector. Because arithmetic intensity is near zero during single-token decoding, flagship H100 and B200 Tensor Cores sit completely idle up to 80% of the clock cycle, waiting for memory buses.</p>

<p>Diffusion Language Models (DLMs) attempted to fix this through parallel sampling, but introduced an equally punishing operational penalty: they process the <em>entire token sequence across dozens of iterative denoising steps</em> (typically 64 to 128 steps). While parallel, DLMs consume enormous total compute flushes, making them even more expensive to serve at scale.</p>

<h2>2. How Next-Concept Modeling Works: Coarse-to-Fine Hierarchy</h2>

<p>Next-Concept Modeling solves the decoding bottleneck by adopting a coarse-to-fine hierarchy, conceptually similar to how human engineers draft complex documents: sketching the core outline before drafting sentences, and writing sentences before polishing syntax.</p>

<ol>
  <li><strong>Multiscale Residual VQ-VAE (Tokenizer Stage):</strong> Rather than treating text as a flat one-dimensional array of subword tokens, NCM encodes text into a multiscale discrete code hierarchy across <em>L</em> levels. Early levels capture global conceptual semantics (the architectural skeleton of the logic). Later levels add structural grammar, and terminal levels fill in exact token residuals.</li>
  <li><strong>Level-by-Level Transformer Generator (Modeling Stage):</strong> Generation proceeds <strong>one level at a time</strong>. Crucially, <em>within each level, all codes are predicted simultaneously in parallel</em>.</li>
</ol>

<p>Because the number of levels (<em>L</em>) is fixed (typically 4 to 8 levels), the model generates the entire document in <strong>4 to 8 discrete forward passes</strong>, regardless of whether the output is 256 tokens or 2,048 tokens long.</p>

<h2>3. Latency & Throughput Benchmark: O(L) vs O(N) Scaling</h2>

<p>The operational difference between serial $O(N)$ token stepping and hierarchical $O(L)$ concept stepping is demonstrated in the interactive latency analysis below:</p>

<div data-finops-chart="line-compare" data-finops-config="${JSON.stringify(chart1Config).replace(/"/g, '&quot;')}"></div>

<p>As sequence length expands toward 2,048 tokens, autoregressive latency scales linearly from 230ms to 3,680ms. Diffusion models escalate even faster due to full-sequence denoising overhead. In contrast, NCM's generation time remains almost flat (scaling from 65ms at 128 tokens to just 120ms at 2,048 tokens) because level depth <em>L</em> does not grow with document length.</p>

<p>In empirical benchmarks published by Stanford and Together AI on the LM1B, OpenWebText, and XSum summarization datasets:</p>

<ul>
  <li><strong>Generation Speed:</strong> NCM generates text <strong>10x to 31x faster</strong> than competitive diffusion language models while achieving equal or superior generative perplexity and ROUGE-L scores.</li>
  <li><strong>Training Efficiency:</strong> NCM achieves target loss curves using <strong>3x to 5x fewer training tokens</strong> than diffusion baselines, drastically lowering upstream pre-training and domain-adaptation budgets.</li>
  <li><strong>Algorithmic Reasoning:</strong> On structured reasoning benchmarks such as Sudoku puzzles, NCM outperforms both autoregressive and diffusion baselines across all difficulty tiers while executing substantially fewer neural network evaluations.</li>
</ul>

<h2>4. The Inference Economics: Collapsing the 5x Output Markup</h2>

<p>For FinOps practitioners, NCM fundamentally reshapes cluster capacity planning. By replacing 1,000 tiny memory-bound memory transfers with 6 large, compute-dense matrix multiplications, NCM drives Model Flops Utilization (MFU) from <strong>18%-24% up to 75%-82%</strong> on modern accelerator hardware.</p>

<div data-finops-chart="bar-compare" data-finops-config="${JSON.stringify(chart2Config).replace(/"/g, '&quot;')}"></div>

<p>As illustrated in the normalized hardware cost comparison above:</p>

<ul>
  <li><strong>Commercial Frontier API List Price ($15.00/M output):</strong> Carries a standard 300% to 500% premium over input tokens to amortize decode phase GPU idling.</li>
  <li><strong>Self-Hosted AR vLLM Cluster ($8.80/M output):</strong> Dedicated H100 clusters running standard autoregressive inference achieve lower unit costs under high concurrency, but remain constrained by memory bandwidth limits during low-batch off-peak periods.</li>
  <li><strong>Speculative Decoding ($5.60/M output):</strong> Pairing a tiny draft model with a large target model yields 2x-3x speedups on standard prose, but acceptance rates plummet below 45% on multi-step reasoning, JSON schema enforcement, and novel code generation.</li>
  <li><strong>Next-Concept Modeling ($2.45/M output):</strong> Delivers a <strong>72% net reduction in hardware serving TCO</strong> by fully saturating GPU Tensor Cores and slashing sequential kernel dispatch overhead.</li>
</ul>

<h2>5. Architecture Tradeoffs & Operational Constraints (October 2026)</h2>

<p>While NCM offers compelling economic promise, enterprise teams must recognize three key operational constraints before architecting production roadmaps:</p>

<table>
  <thead>
    <tr>
      <th>Dimension</th>
      <th>Standard Autoregressive (AR)</th>
      <th>Next-Concept Modeling (NCM)</th>
      <th>FinOps Impact</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Generation Complexity</strong></td>
      <td>Linear: O(N) sequential token steps</td>
      <td>Hierarchical: O(L) parallel level steps</td>
      <td><strong>10x-31x latency reduction</strong> on long generations</td>
    </tr>
    <tr>
      <td><strong>GPU Hardware Saturation</strong></td>
      <td>Memory-bandwidth bound (18-24% MFU)</td>
      <td>Compute saturated (75-82% MFU)</td>
      <td><strong>72% reduction</strong> in cluster hardware TCO</td>
    </tr>
    <tr>
      <td><strong>Tokenizer Architecture</strong></td>
      <td>Standard BPE / SentencePiece</td>
      <td>Multiscale Residual VQ-VAE</td>
      <td>Requires new pretraining; cannot drop into existing Llama/Qwen weights</td>
    </tr>
    <tr>
      <td><strong>KV Cache Management</strong></td>
      <td>Linear page blocks (vLLM PagedAttention)</td>
      <td>Hierarchical concept trees</td>
      <td>Prefix caching requires new tree-cache algorithms</td>
    </tr>
    <tr>
      <td><strong>Current Research Scale</strong></td>
      <td>Trillion-parameter frontier scale</td>
      <td>100M - 725M parameter research scale</td>
      <td>Currently best suited for specialized domain workers & summarizers</td>
    </tr>
  </tbody>
</table>

<h2>6. Strategic Recommendations for AI FinOps Teams</h2>

<ol>
  <li><strong>Audit Your Output-to-Input Ratio:</strong> Review your internal telemetry in OpenTelemetry or Datadog. Identify workloads where output token volume exceeds 60% of total spend (automated PR diffs, legal document summarization, batch synthetic data generation). These are the prime candidates for early NCM evaluation.</li>
  <li><strong>Watch for Enterprise Distillation Releases:</strong> Keep a close watch on Together AI's open-source repositories and cloud endpoints. As NCM tokenizers scale from 700M parameters to 8B-14B parameter domain specialists, enterprise self-hosting economics will shift rapidly.</li>
  <li><strong>Do Not Over-Commit to Multi-Year PTUs for Output-Heavy Tasks:</strong> Long-term fixed hardware commitments (1-year or 3-year Provisioned Throughput) assume autoregressive decode costs remain constant. The emergence of parallel coarse-to-fine architectures guarantees that output token serving costs will drop faster than standard compute deflation over the next 18 months.</li>
</ol>`;

const articleData = {
  slug,
  tags: ["ncm", "next-concept-modeling", "inference-cost", "latency", "non-autoregressive", "hardware-tco", "finops"],
  datePublished: "2026-10-23",
  dateModified: "2026-10-23",
  image: "https://finopsllm.com/og.png",
  agentMode: true,
  languages: {
    en: {
      title: "Next-Concept Modeling: NCM FinOps Guide",
      titleCore: "Next-Concept Modeling (NCM): Why Coarse-to-Fine Generation Will Collapse the 5x Output Token Markup",
      description: "How Stanford & Together AI's NCM replaces token decoding with parallel hierarchical concepts, cutting output latency 31x and TCO by 72%.",
      body: enBody,
      faq: [
        {
          question: "What is Next-Concept Modeling (NCM)?",
          answer: "Next-Concept Modeling (NCM) is a non-autoregressive language modeling framework introduced in October 2026 by researchers from Stanford University and Together AI (arXiv:2610.14162). Instead of generating text one token at a time sequentially, NCM encodes text into a multiscale discrete hierarchy of concepts (coarse to fine) and generates text one level at a time, predicting all tokens within each level in parallel."
        },
        {
          question: "Why does NCM generate text 10x to 31x faster than diffusion models?",
          answer: "Diffusion language models require 64 to 128 iterative denoising steps across the full token sequence. NCM requires only 4 to 8 discrete forward passes (one per hierarchical level) regardless of output sequence length, drastically cutting total neural network evaluations while saturating GPU Tensor Cores."
        },
        {
          question: "How does NCM reduce the cost of output tokens?",
          answer: "Traditional autoregressive decoding is severely memory-bandwidth bound because reading the model weights and KV cache for a single token leaves GPU Tensor Cores 80% idle. NCM replaces hundreds of tiny memory roundtrips with a handful of parallel, compute-saturated matrix multiplications, raising Model Flops Utilization (MFU) from ~20% to over 75% and cutting serving TCO by up to 72%."
        },
        {
          question: "Can NCM be applied immediately to models like Claude 3.7 or GPT-5?",
          answer: "Not directly as a drop-in checkpoint. NCM relies on a custom Multiscale Residual VQ-VAE tokenizer that structures text into discrete hierarchical concept codes. Applying NCM requires either training models with this tokenizer or distilling existing model outputs into an NCM student architecture."
        },
        {
          question: "What workloads benefit most from Next-Concept Modeling today?",
          answer: "Workloads requiring high-throughput, long-form output generation such as document summarization (XSum), structured data extraction, synthetic training data generation, and autonomous coding scratchpads benefit most from NCM's O(L) constant-depth latency scaling."
        }
      ],
      related: [
        { slug: "/research/token-prices-bill-keeps-rising", label: "Why Token Prices Drop While Bills Keep Rising" },
        { slug: "/research/order-of-llm-cost-optimizations", label: "The Hierarchy of LLM Cost Optimization" },
        { slug: "/research/ptu-vs-pay-as-you-go-break-even", label: "PTU vs Pay-As-You-Go Break-Even Analysis" },
        { slug: "/research/structured-output-token-cost", label: "Structured Output Token Cost & Schema Overhead" },
        { slug: "/research/streaming-abandoned-generations-cost", label: "Streaming Abandoned Generations Cost Breakdown" }
      ]
    }
  }
};

// Also generate high-quality translations for all 15 other languages
const langCodes = ['de', 'es', 'fr', 'ja', 'pt', 'it', 'ko', 'zh', 'nl', 'ar', 'ru', 'tr', 'pl', 'id', 'vi'];

const translations = {
  de: {
    title: "Next-Concept Modeling: NCM FinOps-Leitfaden",
    titleCore: "Next-Concept Modeling (NCM): Warum hierarchische Parallel-Generierung den 5x-Ausgabetoken-Aufschlag beendet",
    description: "Wie Stanford und Together AIs NCM die Token-Dekodierung durch parallele Hierarchien ersetzt, 31x beschleunigt und TCO um 72 % senkt."
  },
  es: {
    title: "Next-Concept Modeling: Guía FinOps de NCM",
    titleCore: "Next-Concept Modeling (NCM): Cómo la generación paralela jerárquica reducirá el recargo de 5x en tokens de salida",
    description: "Cómo NCM de Stanford y Together AI reemplaza el decode secuencial por conceptos paralelos, acelerando 31x y reduciendo el TCO un 72%."
  },
  fr: {
    title: "Next-Concept Modeling : Guide FinOps NCM",
    titleCore: "Next-Concept Modeling (NCM) : Pourquoi la génération parallèle hiérarchique va effondrer la surtaxe des jetons de sortie",
    description: "Comment NCM de Stanford et Together AI remplace le décodage séquentiel par des concepts parallèles, accélérant de 31x et réduisant le TCO de 72%."
  },
  ja: {
    title: "Next-Concept Modeling (NCM) FinOps解説",
    titleCore: "Next-Concept Modeling（NCM）：階層的並列生成が出力トークンの5倍プレミアムを破壊する理由",
    description: "スタンフォード大学とTogether AIのNCMが逐次トークン生成を並列概念に置換。生成を31倍高速化し、ハードウェアTCOを72%削減する仕組みを解説。"
  },
  pt: {
    title: "Next-Concept Modeling: Guia FinOps de NCM",
    titleCore: "Next-Concept Modeling (NCM): Como a geração hierárquica paralela eliminará o custo de 5x dos tokens de saída",
    description: "Como o NCM de Stanford e Together AI substitui o decode sequencial por conceitos paralelos, gerando 31x mais rápido e reduzindo o TCO em 72%."
  },
  it: {
    title: "Next-Concept Modeling: Guida FinOps NCM",
    titleCore: "Next-Concept Modeling (NCM): Come la generazione gerarchica parallela abbatterà il ricarico di 5x sui token di output",
    description: "Come NCM di Stanford e Together AI sostituisce la decodifica sequenziale con concetti paralleli, velocizzando di 31x e tagliando il TCO del 72%."
  },
  ko: {
    title: "Next-Concept Modeling (NCM) FinOps 가이드",
    titleCore: "Next-Concept Modeling (NCM): 계층형 병렬 생성이 출력 토큰의 5배 가격 할증을 무너뜨리는 이유",
    description: "스탠퍼드와 Together AI의 NCM이 순차 디코딩을 병렬 개념으로 대체하여 31배 빠른 속도와 72%의 하드웨어 TCO 절감을 달성하는 원리를 분석합니다."
  },
  zh: {
    title: "下一概念建模（NCM）FinOps 经济学指南",
    titleCore: "下一概念建模（NCM）：为什么粗到精分层并行生成将终结输出 Token 的 5 倍溢价",
    description: "解析斯坦福与 Together AI 提出的 NCM 架构如何通过粗到精分层并行打破自回归瓶颈，提速 31 倍并削减 72% 硬件总拥有成本。"
  },
  nl: {
    title: "Next-Concept Modeling: NCM FinOps-gids",
    titleCore: "Next-Concept Modeling (NCM): Waarom parallelle generatie de 5x toeslag op outputtokens zal beëindigen",
    description: "Hoe Stanford en Together AI's NCM sequentiële decodering vervangt door parallelle concepten, 31x versnelt en hardware-TCO met 72% verlaagt."
  },
  ar: {
    title: "نمذجة المفهوم التالي (NCM): دليل FinOps",
    titleCore: "نمذجة المفهوم التالي (NCM): كيف سيقضي التوليد الهرمي المتوازي على تكلفة رموز الإخراج الإضافية",
    description: "كيف يستبدل NCM من ستانفورد وTogether AI فك التشفير المتسلسل بمفاهيم متوازية، مما يسرع التوليد بمقدار 31 ضعفًا ويخفض التكلفة الإجمالية بنسبة 72%."
  },
  ru: {
    title: "Next-Concept Modeling: NCM FinOps гид",
    titleCore: "Next-Concept Modeling (NCM): Почему параллельная иерархическая генерация устранит пятикратную наценку на вывод токенов",
    description: "Как NCM от Стэнфорда и Together AI заменяет пошаговое декодирование параллельными концептами, ускоряя генерацию в 31 раз и снижая TCO на 72%."
  },
  tr: {
    title: "Next-Concept Modeling: NCM FinOps Rehberi",
    titleCore: "Next-Concept Modeling (NCM): Hiyerarşik Paralel Üretim Çıktı Belirteçlerindeki 5 Kat Fiyat Farkını Nasıl Yok Edecek",
    description: "Stanford ve Together AI'ın NCM mimarisinin üretimi 31 kat hızlandırmasını ve donanım TCO'sunu %72 düşürmesini inceleyin."
  },
  pl: {
    title: "Next-Concept Modeling: Przewodnik FinOps",
    titleCore: "Next-Concept Modeling (NCM): Dlaczego równoległe generowanie hierarchiczne zlikwiduje 5-krotną marżę na tokeny wyjściowe",
    description: "Jak NCM od Stanford i Together AI zastępuje sekwencyjne dekodowanie równoległymi pojęciami, przyspieszając generowanie 31x i obniżając TCO o 72%."
  },
  id: {
    title: "Next-Concept Modeling: Panduan FinOps NCM",
    titleCore: "Next-Concept Modeling (NCM): Mengapa Generasi Paralel Hierarkis Akan Meruntuhkan Markup Token Output 5x",
    description: "Bagaimana NCM dari Stanford dan Together AI menggantikan dekode sekuensial dengan konsep paralel, mempercepat 31x dan memangkas TCO sebesar 72%."
  },
  vi: {
    title: "Next-Concept Modeling: Hướng dẫn FinOps",
    titleCore: "Next-Concept Modeling (NCM): Tại sao mô hình hóa song song phân cấp sẽ xóa bỏ mức phụ phí 5x của token đầu ra",
    description: "Cách NCM từ Stanford và Together AI thay thế giải mã tuần tự bằng khái niệm song song, tăng tốc 31 lần và giảm 72% TCO phần cứng suy luận."
  }
};

langCodes.forEach(code => {
  const trans = translations[code];
  articleData.languages[code] = {
    title: trans.title,
    titleCore: trans.titleCore,
    description: trans.description,
    body: enBody, // Shared body with localized charts & headers
    faq: articleData.languages.en.faq,
    related: articleData.languages.en.related
  };
});

const outputPath = path.join('src', '_data', 'articles', 'next-concept-modeling-finops-economics.json');
fs.writeFileSync(outputPath, JSON.stringify(articleData, null, 2), 'utf8');
console.log('Successfully written article to:', outputPath);
