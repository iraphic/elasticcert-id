import type { Track } from "../types";

export const observabilityTrack: Track = {
  id: "track-observability",
  slug: "observability",
  name: "Elastic Certified Observability Engineer",
  tagline: "Pantau metrik, log, dan trace aplikasi dalam satu platform.",
  description:
    "Jalur ini mempersiapkan Anda untuk ujian Elastic Certified Observability Engineer. Materinya mencakup pengumpulan metrik dengan Metricbeat, pengiriman log dengan Filebeat, APM dan distributed tracing, alerting, serta penyusunan dashboard Kibana.",
  audience: "Cocok untuk SRE, DevOps engineer, dan tim platform yang menjaga keandalan layanan.",
  color: "amber",
  icon: "activity",
  examInfo: { questionCount: 12, durationMinutes: 20, passingScore: 70 },
  modules: [
    {
      slug: "pengantar-observability",
      title: "Pengantar Elastic Observability",
      level: "Dasar",
      durationMinutes: 25,
      intro:
        "Pahami tiga pilar observabilitas — metrik, log, dan trace — serta bagaimana Elastic Stack menyatukannya dalam satu alur kerja.",
      sections: [
        {
          heading: "Tiga pilar observabilitas",
          paragraphs: [
            "Metrik menjawab 'seberapa sehat sistem?' lewat angka berkala seperti penggunaan CPU. Log menjawab 'apa yang terjadi?' lewat catatan peristiwa. Trace menjawab 'di mana masalahnya?' dengan melacak perjalanan satu request antar layanan.",
            "Elastic Observability menyatukan ketiganya di Elasticsearch sehingga Anda bisa melompat dari grafik metrik ke log terkait, lalu ke trace transaksi — tanpa berpindah alat.",
          ],
        },
        {
          heading: "Arsitektur pengumpulan data",
          paragraphs: [
            "Data dikumpulkan oleh agen ringan (Beats) atau Elastic Agent di setiap host, lalu dikirim ke Elasticsearch. Kibana menyediakan aplikasi Observability untuk menjelajahi metrik, log, dan APM.",
            "Elastic Agent disertai integrasi siap pakai (System, Nginx, Kubernetes, AWS) yang menggantikan konfigurasi manual banyak Beats.",
          ],
          codeExample: {
            title: "Memeriksa data metrik yang masuk",
            lang: "json",
            code: `GET /metrics-*/_search\n{\n  "size": 1,\n  "query": {\n    "match": { "metricset.name": "cpu" }\n  }\n}`,
          },
        },
      ],
      keyPoints: [
        "Tiga pilar: metrik (angka), log (peristiwa), trace (perjalanan request).",
        "Beats / Elastic Agent mengumpulkan data di sisi host.",
        "Elasticsearch menyimpan; Kibana Observability memvisualisasikan.",
        "Integrasi Elastic Agent menyederhanakan onboarding sumber data.",
      ],
      quiz: [
        {
          id: "obs-m1-q1",
          prompt: "Pilar observabilitas yang melacak perjalanan satu request antar layanan adalah…",
          options: ["Metrik", "Log", "Trace", "Alert"],
          answerIndex: 2,
          explanation:
            "Trace (distributed tracing) mencatat rangkaian span dari satu request yang melewati banyak layanan, sehingga bottleneck mudah ditemukan.",
        },
        {
          id: "obs-m1-q2",
          prompt: "Komponen apa yang berjalan di host untuk mengumpulkan data observabilitas?",
          options: ["Kibana", "Elastic Agent / Beats", "Logstash filter saja", "Browser pengguna"],
          answerIndex: 1,
          explanation:
            "Elastic Agent (atau Beats individual) dipasang di host untuk mengumpulkan metrik dan log, lalu mengirimkannya ke Elasticsearch.",
        },
        {
          id: "obs-m1-q3",
          prompt: "Keunggulan utama menyatukan metrik, log, dan trace dalam satu platform adalah…",
          options: [
            "Lisensi lebih murah",
            "Korelasi antar sinyal tanpa berpindah alat saat investigasi insiden",
            "Tidak perlu indeks",
            "Query lebih sedikit",
          ],
          answerIndex: 1,
          explanation:
            "Saat insiden, Anda bisa berpindah dari anomali metrik ke log dan trace terkait dalam satu antarmuka — memangkas waktu diagnosis.",
        },
        {
          id: "obs-m1-q4",
          prompt: "Aplikasi Kibana mana yang menjadi rumah bagi fitur observabilitas?",
          options: ["Observability", "Security", "Dev Tools saja", "Stack Management"],
          answerIndex: 0,
          explanation:
            "Aplikasi Observability di Kibana menyediakan tampilan Metrics, Logs, APM, Uptime, dan SLO dalam satu tempat.",
        },
      ],
    },
    {
      slug: "metrics-metricbeat",
      title: "Metrics dengan Metricbeat",
      level: "Dasar",
      durationMinutes: 30,
      intro:
        "Metricbeat mengumpulkan metrik sistem dan layanan secara berkala. Pelajari modul, konfigurasi, dan cara membaca data metrik di Elasticsearch.",
      sections: [
        {
          heading: "Modul dan metricset",
          paragraphs: [
            "Metricbeat diorganisasikan dalam modul (mis. system, docker, nginx). Setiap modul memiliki metricset — kumpulan metrik spesifik seperti cpu, memory, atau network.",
            "Modul system aktif secara default dan menjadi titik awal terbaik untuk memantau host.",
          ],
          codeExample: {
            title: "Konfigurasi modul system di metricbeat.yml",
            lang: "yaml",
            code: `metricbeat.modules:\n  - module: system\n    period: 10s\n    metricsets:\n      - cpu\n      - memory\n      - network\n      - diskio`,
          },
        },
        {
          heading: "Menganalisis data metrik",
          paragraphs: [
            "Metrik disimpan sebagai dokumen deret waktu dengan field seperti system.cpu.total.pct. Agregasi date_histogram + avg adalah pola umum untuk grafik penggunaan CPU dari waktu ke waktu.",
          ],
          codeExample: {
            title: "Rata-rata penggunaan CPU per menit",
            lang: "json",
            code: `GET /metricbeat-*/_search\n{\n  "size": 0,\n  "aggs": {\n    "per_menit": {\n      "date_histogram": {\n        "field": "@timestamp",\n        "fixed_interval": "1m"\n      },\n      "aggs": {\n        "cpu_rata": { "avg": { "field": "system.cpu.total.pct" } }\n      }\n    }\n  }\n}`,
          },
        },
      ],
      keyPoints: [
        "Modul = sumber layanan; metricset = kumpulan metrik di dalamnya.",
        "Modul system memantau cpu, memory, network, diskio, dan lainnya.",
        "Period menentukan interval pengambilan sampel metrik.",
        "Data metrik dianalisis dengan date_histogram + metric aggregation.",
      ],
      quiz: [
        {
          id: "obs-m2-q1",
          prompt: "Apa itu metricset dalam Metricbeat?",
          options: [
            "File konfigurasi utama",
            "Kumpulan metrik spesifik dalam sebuah modul",
            "Nama indeks di Elasticsearch",
            "Plugin Kibana",
          ],
          answerIndex: 1,
          explanation:
            "Setiap modul (mis. system) memiliki beberapa metricset seperti cpu dan memory yang masing-masing mengumpulkan kelompok metrik tertentu.",
        },
        {
          id: "obs-m2-q2",
          prompt: "Field mana yang lazim dipakai untuk mengagregasi penggunaan CPU total?",
          options: [
            "host.name",
            "system.cpu.total.pct",
            "message",
            "event.id",
          ],
          answerIndex: 1,
          explanation:
            "system.cpu.total.pct menyimpan persentase penggunaan CPU total dan umum dirata-ratakan per interval waktu.",
        },
        {
          id: "obs-m2-q3",
          prompt: "Pola agregasi yang tepat untuk grafik CPU per menit adalah…",
          options: [
            "terms saja",
            "date_histogram dengan avg di dalamnya",
            "match query",
            "cardinality",
          ],
          answerIndex: 1,
          explanation:
            "date_histogram membagi waktu ke interval, lalu metric avg menghitung rata-rata CPU pada tiap interval.",
        },
        {
          id: "obs-m2-q4",
          prompt: "Pengaturan 'period: 10s' pada modul Metricbeat berarti…",
          options: [
            "Data disimpan 10 detik",
            "Metrik diambil sampelnya setiap 10 detik",
            "Indeks di-rollover tiap 10 detik",
            "Kibana refresh tiap 10 detik",
          ],
          answerIndex: 1,
          explanation:
            "period menentukan interval pengambilan sampel; 10 detik adalah keseimbangan umum antara granularitas dan beban sistem.",
        },
      ],
    },
    {
      slug: "log-filebeat",
      title: "Log & Filebeat",
      level: "Menengah",
      durationMinutes: 35,
      intro:
        "Filebeat mengirimkan log dari file ke Elasticsearch. Modul ini membahas input, parsing log terstruktur, dan pipeline ingest.",
      sections: [
        {
          heading: "Mengumpulkan log dengan Filebeat",
          paragraphs: [
            "Filebeat membaca file log lewat input, lalu mengirim setiap baris sebagai dokumen. Modul siap pakai (nginx, system, mysql) sudah menyertakan parsing bawaan sehingga log langsung terstruktur.",
            "Filebeat menyimpan posisi baca (registry) sehingga tidak ada baris yang terkirim dua kali setelah restart.",
          ],
          codeExample: {
            title: "Input filestream sederhana di filebeat.yml",
            lang: "yaml",
            code: `filebeat.inputs:\n  - type: filestream\n    id: app-logs\n    paths:\n      - /var/log/aplikasi/*.log\n    parsers:\n      - ndjson:\n          target: ""`,
          },
        },
        {
          heading: "Parsing log dengan ingest pipeline",
          paragraphs: [
            "Ingest pipeline di Elasticsearch memproses dokumen saat ditulis: grok mengekstrak field dari teks, dissect memecah pola sederhana, dan date mengubah string waktu menjadi timestamp.",
            "Log terstruktur (JSON) jauh lebih mudah diproses — usahakan aplikasi menulis log dalam format JSON bila memungkinkan.",
          ],
          codeExample: {
            title: "Pipeline grok untuk log Apache",
            lang: "json",
            code: `PUT /_ingest/pipeline/apache-access\n{\n  "processors": [\n    {\n      "grok": {\n        "field": "message",\n        "patterns": [\n          "%{IPORHOST:client.ip} - - \\\\[%{HTTPDATE:timestamp}\\\\] \\"%{WORD:http.method} %{URIPATH:url.path} HTTP/%{NUMBER:http.version}\\" %{NUMBER:http.status_code:int}"\n        ]\n      }\n    }\n  ]\n}`,
          },
        },
      ],
      keyPoints: [
        "Filebeat membaca file log dan mengirim baris demi baris sebagai dokumen.",
        "Registry Filebeat mencegah pengiriman ulang setelah restart.",
        "Modul siap pakai menyertakan parsing bawaan untuk layanan populer.",
        "Ingest pipeline (grok/dissect/date) menstrukturkan log saat penulisan.",
        "Log JSON lebih mudah dan andal diproses daripada teks bebas.",
      ],
      quiz: [
        {
          id: "obs-m3-q1",
          prompt: "Apa fungsi registry pada Filebeat?",
          options: [
            "Menyimpan kredensial Elasticsearch",
            "Mencatat posisi baca file agar tidak ada baris terkirim dua kali",
            "Mendaftarkan plugin Kibana",
            "Menyimpan mapping indeks",
          ],
          answerIndex: 1,
          explanation:
            "Registry menyimpan offset terakhir tiap file yang dibaca sehingga pengiriman dilanjutkan dari posisi yang benar setelah restart.",
        },
        {
          id: "obs-m3-q2",
          prompt: "Processor ingest pipeline mana yang mengekstrak field dari pola teks log?",
          options: ["date", "grok", "rename", "drop"],
          answerIndex: 1,
          explanation:
            "grok mencocokkan pola (mis. IP, method HTTP, status code) dan mengekstraknya menjadi field terstruktur.",
        },
        {
          id: "obs-m3-q3",
          prompt: "Mengapa log JSON direkomendasikan?",
          options: [
            "Ukurannya lebih kecil",
            "Field sudah terstruktur sehingga tidak perlu parsing grok yang rapuh",
            "Elasticsearch hanya menerima JSON",
            "Filebeat lebih cepat membaca JSON",
          ],
          answerIndex: 1,
          explanation:
            "Dengan log JSON, field langsung tersedia tanpa pola grok yang mudah rusak ketika format log berubah.",
        },
        {
          id: "obs-m3-q4",
          prompt: "Kapan ingest pipeline dijalankan?",
          options: [
            "Saat query pencarian",
            "Saat dokumen ditulis (diindeks) ke Elasticsearch",
            "Saat Kibana dirender",
            "Saat Filebeat restart",
          ],
          answerIndex: 1,
          explanation:
            "Ingest pipeline memproses dokumen pada waktu pengindeksan, sebelum dokumen disimpan di Elasticsearch.",
        },
      ],
    },
    {
      slug: "apm-tracing",
      title: "APM & Distributed Tracing",
      level: "Menengah",
      durationMinutes: 35,
      intro:
        "Elastic APM merekam transaksi aplikasi dan span antar layanan. Pelajari konsep transaction, span, trace, dan cara menemukan bottleneck.",
      sections: [
        {
          heading: "Transaction, span, dan trace",
          paragraphs: [
            "Transaction adalah unit kerja utama sebuah layanan (mis. satu request HTTP). Span adalah operasi di dalamnya (query database, panggilan API). Trace adalah rangkaian transaction/span dari satu request yang mengalir melewati banyak layanan, dirangkai lewat trace.id.",
            "Agen APM dipasang di kode aplikasi (Java, Node.js, Python, Go, dll.) dan mengirim data ke APM Server yang meneruskannya ke Elasticsearch.",
          ],
          codeExample: {
            title: "Mencari transaksi paling lambat",
            lang: "json",
            code: `GET /traces-apm*/_search\n{\n  "size": 5,\n  "sort": [\n    { "transaction.duration.us": "desc" }\n  ],\n  "query": {\n    "term": { "service.name": "checkout-service" }\n  }\n}`,
          },
        },
        {
          heading: "Menemukan bottleneck",
          paragraphs: [
            "Waterfall trace di Kibana menunjukkan durasi tiap span sehingga operasi lambat (mis. query database 800 ms di antara total 1 detik) langsung terlihat.",
            "Karena metrik, log, dan trace berbagi platform, Anda bisa melompat dari transaksi lambat ke log layanan pada waktu yang sama.",
          ],
          codeExample: {
            title: "Latensi rata-rata per layanan",
            lang: "json",
            code: `GET /traces-apm*/_search\n{\n  "size": 0,\n  "aggs": {\n    "per_layanan": {\n      "terms": { "field": "service.name" },\n      "aggs": {\n        "latensi_rata": { "avg": { "field": "transaction.duration.us" } }\n      }\n    }\n  }\n}`,
          },
        },
      ],
      keyPoints: [
        "Transaction = unit kerja utama; span = operasi di dalamnya.",
        "trace.id merangkai transaction/span lintas layanan.",
        "Agen APM dipasang di kode aplikasi dan mengirim ke APM Server.",
        "Waterfall trace menampilkan durasi tiap span untuk diagnosis bottleneck.",
        "transaction.duration.us menyimpan durasi dalam mikrodetik.",
      ],
      quiz: [
        {
          id: "obs-m4-q1",
          prompt: "Apa yang dimaksud dengan span dalam APM?",
          options: [
            "Satu request HTTP lengkap",
            "Satu operasi di dalam transaction, mis. query database",
            "Satu indeks di Elasticsearch",
            "Satu dashboard Kibana",
          ],
          answerIndex: 1,
          explanation:
            "Span merepresentasikan satu operasi (panggilan DB, HTTP keluar) yang merupakan bagian dari sebuah transaction.",
        },
        {
          id: "obs-m4-q2",
          prompt: "Field apa yang merangkai transaction dan span lintas layanan?",
          options: ["service.name", "trace.id", "host.name", "event.category"],
          answerIndex: 1,
          explanation:
            "trace.id dibagikan ke seluruh transaction dan span milik satu request sehingga waterfall trace dapat direkonstruksi.",
        },
        {
          id: "obs-m4-q3",
          prompt: "Bagaimana cara menemukan penyebab transaksi lambat?",
          options: [
            "Menghapus indeks lama",
            "Melihat waterfall trace dan membandingkan durasi tiap span",
            "Menambah replica shard",
            "Mematikan agen APM",
          ],
          answerIndex: 1,
          explanation:
            "Waterfall menampilkan garis waktu tiap span; span dengan durasi dominan menunjukkan lokasi bottleneck.",
        },
        {
          id: "obs-m4-q4",
          prompt: "Komponen yang menerima data dari agen APM lalu meneruskannya ke Elasticsearch adalah…",
          options: ["Kibana", "APM Server / Elastic Agent APM integration", "Metricbeat", "Logstash saja"],
          answerIndex: 1,
          explanation:
            "Agen APM mengirim data performa ke APM Server (kini bagian dari Elastic Agent) yang memproses dan menyimpannya di Elasticsearch.",
        },
      ],
    },
    {
      slug: "alerting-rules",
      title: "Alerting & Rules",
      level: "Lanjutan",
      durationMinutes: 30,
      intro:
        "Alerting mengubah data observabilitas menjadi notifikasi proaktif. Pelajari cara membuat rule, threshold, dan mengirim notifikasi lewat connector.",
      sections: [
        {
          heading: "Anatomi rule",
          paragraphs: [
            "Sebuah rule terdiri dari kondisi (mis. rata-rata CPU > 90% selama 5 menit), jadwal evaluasi (check every), dan aksi (connector seperti email, Slack, atau webhook).",
            "Rule Observability siap pakai meliputi metric threshold, log threshold, APM latency/error rate, hingga SLO burn rate.",
          ],
          codeExample: {
            title: "Contoh query di balik rule metrik CPU",
            lang: "json",
            code: `GET /metrics-*/_search\n{\n  "size": 0,\n  "query": {\n    "range": { "@timestamp": { "gte": "now-5m" } }\n  },\n  "aggs": {\n    "per_host": {\n      "terms": { "field": "host.name" },\n      "aggs": {\n        "cpu": { "avg": { "field": "system.cpu.total.pct" } }\n      }\n    }\n  }\n}`,
          },
        },
        {
          heading: "Aksi dan connector",
          paragraphs: [
            "Connector menyimpan kredensial dan endpoint tujuan notifikasi (email, Slack, PagerDuty, webhook). Satu connector bisa dipakai banyak rule.",
            "Gunakan variabel konteks seperti {{context.host}} dalam pesan agar notifikasi langsung informatif bagi penerima.",
          ],
        },
      ],
      keyPoints: [
        "Rule = kondisi + jadwal evaluasi + aksi.",
        "Threshold rule memantau metrik/log melewati ambang batas.",
        "Connector menyimpan tujuan notifikasi (email, Slack, webhook).",
        "Variabel konteks memperkaya isi pesan notifikasi.",
        "Uji rule dengan data nyata sebelum mengaktifkan notifikasi ke tim.",
      ],
      quiz: [
        {
          id: "obs-m5-q1",
          prompt: "Tiga komponen utama sebuah alerting rule adalah…",
          options: [
            "Indeks, shard, replica",
            "Kondisi, jadwal evaluasi, dan aksi",
            "Mapping, analyzer, tokenizer",
            "Dashboard, lens, canvas",
          ],
          answerIndex: 1,
          explanation:
            "Rule mendefinisikan apa yang dipantau (kondisi), seberapa sering diperiksa (jadwal), dan apa yang terjadi saat terpenuhi (aksi).",
        },
        {
          id: "obs-m5-q2",
          prompt: "Apa fungsi connector dalam alerting?",
          options: [
            "Menghubungkan indeks ke shard",
            "Menyimpan konfigurasi tujuan notifikasi seperti email atau Slack",
            "Menghubungkan Kibana ke browser",
            "Mengubah format tanggal",
          ],
          answerIndex: 1,
          explanation:
            "Connector adalah konfigurasi tujuan (beserta kredensial) yang dapat dipakai ulang oleh banyak rule untuk mengirim notifikasi.",
        },
        {
          id: "obs-m5-q3",
          prompt: "Rule tipe apa yang cocok untuk memantau error rate APM?",
          options: [
            "Index threshold saja",
            "APM latency / failed transaction rate threshold",
            "Machine learning saja",
            "Tracking containment",
          ],
          answerIndex: 1,
          explanation:
            "Rule APM bawaan memantau latensi dan tingkat kegagalan transaksi langsung dari data APM tanpa query manual.",
        },
        {
          id: "obs-m5-q4",
          prompt: "Mengapa rule sebaiknya diuji dengan data nyata dulu?",
          options: [
            "Agar indeks cepat penuh",
            "Agar ambang batas realistis dan tidak membanjiri tim dengan alert palsu",
            "Agar connector terhapus",
            "Agar query lebih lambat",
          ],
          answerIndex: 1,
          explanation:
            "Ambang yang terlalu sensitif menghasilkan alert noise; pengujian dengan data historis membantu menemukan ambang yang tepat.",
        },
      ],
    },
    {
      slug: "dashboard-kibana",
      title: "Dashboard Kibana & KQL",
      level: "Siap Ujian",
      durationMinutes: 30,
      intro:
        "Modul penutup jalur Observability: menyusun dashboard efektif dengan Lens, menulis filter KQL, dan berbagi insight ke tim.",
      sections: [
        {
          heading: "KQL: bahasa query Kibana",
          paragraphs: [
            "Kibana Query Language (KQL) memfilter data langsung dari bar pencarian: host.name : \"web-01\" and system.cpu.total.pct > 0.9. KQL lebih sederhana dari Query DSL dan menjadi standar di seluruh aplikasi Kibana.",
            "Operator yang umum dipakai: : (sama/mengandung), >, <, and, or, not, serta exists untuk memeriksa keberadaan field.",
          ],
          codeExample: {
            title: "Contoh filter KQL",
            lang: "bash",
            code: `host.name : "web-01" and system.cpu.total.pct > 0.9\nhttp.response.status_code >= 500 and not url.path : "/health"\nservice.name : "checkout-service" and transaction.duration.us > 1000000`,
          },
        },
        {
          heading: "Membangun dashboard dengan Lens",
          paragraphs: [
            "Lens adalah editor visual drag-and-drop: pilih data view, seret field ke sumbu, dan Kibana memilihkan visualisasi yang cocok. Panel dashboard bisa berasal dari Lens, peta, hingga TSVB.",
            "Praktik baik: satu dashboard menjawab satu pertanyaan bisnis (mis. 'apakah layanan checkout sehat?'), dengan panel paling penting di kiri atas.",
          ],
          codeExample: {
            title: "Agregasi di balik panel error rate",
            lang: "json",
            code: `GET /logs-*/_search\n{\n  "size": 0,\n  "query": {\n    "range": { "http.response.status_code": { "gte": 500 } }\n  },\n  "aggs": {\n    "per_menit": {\n      "date_histogram": {\n        "field": "@timestamp",\n        "fixed_interval": "1m"\n      }\n    }\n  }\n}`,
          },
        },
      ],
      keyPoints: [
        "KQL memfilter data lewat bar pencarian di seluruh Kibana.",
        "Operator KQL: :, >, <, and, or, not, exists.",
        "Lens menyusun visualisasi dengan drag-and-drop field.",
        "Satu dashboard sebaiknya menjawab satu pertanyaan utama.",
        "Panel terpenting diletakkan di posisi paling terlihat (kiri atas).",
      ],
      quiz: [
        {
          id: "obs-m6-q1",
          prompt: "Filter KQL yang benar untuk host web-01 dengan CPU di atas 90% adalah…",
          options: [
            "host.name = web-01 && cpu > 90",
            "host.name : \"web-01\" and system.cpu.total.pct > 0.9",
            "SELECT * WHERE cpu > 90",
            "filter host web-01 cpu 90",
          ],
          answerIndex: 1,
          explanation:
            "KQL memakai operator : untuk kesetaraan, and untuk logika dan, serta nilai desimal untuk field persentase.",
        },
        {
          id: "obs-m6-q2",
          prompt: "Editor visualisasi drag-and-drop bawaan Kibana disebut…",
          options: ["Canvas", "Lens", "Vega", "Timelion"],
          answerIndex: 1,
          explanation:
            "Lens memungkinkan penyusunan visualisasi dengan menyeret field ke konfigurasi sumbu tanpa menulis query.",
        },
        {
          id: "obs-m6-q3",
          prompt: "Apa fungsi operator 'exists' dalam KQL?",
          options: [
            "Memeriksa field memiliki nilai (tidak kosong)",
            "Menghapus dokumen",
            "Membuat indeks baru",
            "Mengurutkan hasil",
          ],
          answerIndex: 0,
          explanation:
            "Misalnya 'client.ip : *' atau exists memfilter dokumen yang benar-benar memiliki nilai pada field tersebut.",
        },
        {
          id: "obs-m6-q4",
          prompt: "Praktik terbaik menyusun dashboard operasional adalah…",
          options: [
            "Memasukkan semua panel ke satu dashboard",
            "Satu dashboard menjawab satu pertanyaan dengan panel penting di kiri atas",
            "Menggunakan warna sebanyak mungkin",
            "Menyembunyikan label sumbu",
          ],
          answerIndex: 1,
          explanation:
            "Dashboard yang fokus mempercepat pengambilan keputusan; pola baca kiri-atas-ke-kanan-bawah membuat panel utama langsung terlihat.",
        },
      ],
    },
  ],
  examQuestions: [
    {
      id: "obs-ex-1",
      prompt: "Tiga pilar observabilitas adalah…",
      options: [
        "Indeks, shard, replica",
        "Metrik, log, dan trace",
        "CPU, memori, disk",
        "Rule, action, connector",
      ],
      answerIndex: 1,
      explanation:
        "Metrik memberi gambaran kesehatan, log mencatat peristiwa, dan trace melacak alur request — ketiganya saling melengkapi.",
    },
    {
      id: "obs-ex-2",
      prompt: "Komponen pengumpul metrik sistem di Elastic Stack adalah…",
      options: ["Filebeat", "Metricbeat", "Kibana", "APM Server"],
      answerIndex: 1,
      explanation:
        "Metricbeat (atau integrasi System pada Elastic Agent) mengumpulkan metrik CPU, memori, disk, dan jaringan secara berkala.",
    },
    {
      id: "obs-ex-3",
      prompt: "Filebeat menyimpan posisi baca terakhir di…",
      options: ["Indeks Elasticsearch", "Registry lokal", "Memori Kibana", "File konfigurasi"],
      answerIndex: 1,
      explanation:
        "Registry di disk lokal mencatat offset tiap file sehingga Filebeat dapat melanjutkan pengiriman dengan tepat setelah restart.",
    },
    {
      id: "obs-ex-4",
      prompt: "Processor ingest pipeline untuk mengekstrak field dari pola teks adalah…",
      options: ["grok", "set", "remove", "fail"],
      answerIndex: 0,
      explanation:
        "grok mencocokkan pola regex bernama (seperti %{IPORHOST}) dan mengubah teks log menjadi field terstruktur.",
    },
    {
      id: "obs-ex-5",
      prompt: "Dalam APM, unit kerja utama sebuah layanan disebut…",
      options: ["span", "transaction", "bucket", "shard"],
      answerIndex: 1,
      explanation:
        "Transaction merepresentasikan satu unit kerja (mis. request HTTP), sementara span adalah operasi di dalamnya.",
    },
    {
      id: "obs-ex-6",
      prompt: "Field yang menghubungkan seluruh bagian satu trace lintas layanan adalah…",
      options: ["event.id", "trace.id", "host.id", "user.id"],
      answerIndex: 1,
      explanation:
        "trace.id konsisten di semua transaction dan span milik satu request sehingga waterfall dapat disusun.",
    },
    {
      id: "obs-ex-7",
      prompt: "Rule alerting dievaluasi berdasarkan…",
      options: [
        "Jadwal check every yang ditentukan",
        "Hanya saat Kibana dibuka",
        "Setiap dokumen baru tanpa jadwal",
        "Sekali sehari saja",
      ],
      answerIndex: 0,
      explanation:
        "Rule memiliki jadwal evaluasi (mis. setiap 1 menit) yang menentukan seberapa sering kondisi diperiksa.",
    },
    {
      id: "obs-ex-8",
      prompt: "Connector dalam Kibana Alerting berfungsi untuk…",
      options: [
        "Menghubungkan shard ke node",
        "Mendefinisikan tujuan pengiriman notifikasi (email, Slack, webhook)",
        "Mengubah mapping field",
        "Menghubungkan browser ke internet",
      ],
      answerIndex: 1,
      explanation:
        "Connector menyimpan endpoint dan kredensial tujuan notifikasi sehingga dapat dipakai ulang oleh banyak rule.",
    },
    {
      id: "obs-ex-9",
      prompt: "Sintaks KQL yang valid untuk status HTTP 500 ke atas adalah…",
      options: [
        "http.response.status_code >= 500",
        "status = 500+",
        "WHERE status > 500",
        "http.status == 500..599",
      ],
      answerIndex: 0,
      explanation:
        "KQL mendukung operator perbandingan >= pada field numerik, ditulis langsung di bar pencarian.",
    },
    {
      id: "obs-ex-10",
      prompt: "Agregasi yang umum di balik grafik deret waktu dashboard adalah…",
      options: ["terms saja", "date_histogram", "geo_bounds", "sampler"],
      answerIndex: 1,
      explanation:
        "date_histogram membagi dokumen ke interval waktu sehingga tren per menit/jam/hari dapat digambarkan.",
    },
    {
      id: "obs-ex-11",
      prompt: "Keuntungan log terstruktur (JSON) dibanding teks bebas adalah…",
      options: [
        "Lebih sulit dibaca manusia",
        "Field langsung tersedia tanpa parsing grok yang rapuh",
        "Ukuran file selalu lebih kecil",
        "Tidak membutuhkan Filebeat",
      ],
      answerIndex: 1,
      explanation:
        "Log JSON menghilangkan kebutuhan pola parsing kompleks dan lebih tahan terhadap perubahan format.",
    },
    {
      id: "obs-ex-12",
      prompt: "Cara tercepat menemukan layanan dengan latensi tertinggi adalah…",
      options: [
        "Agregasi terms pada service.name dengan avg transaction.duration",
        "Membaca seluruh log satu per satu",
        "Menghapus indeks trace",
        "Menambah shard",
      ],
      answerIndex: 0,
      explanation:
        "Bucket terms per layanan dengan metric avg durasi langsung menunjukkan perbandingan latensi antar layanan.",
    },
    {
      id: "obs-ex-13",
      prompt: "Peran Fleet Server dalam arsitektur Elastic Agent adalah…",
      options: [
        "Menyimpan log aplikasi",
        "Menjadi titik kontrol yang mendistribusikan kebijakan ke Elastic Agent",
        "Menggantikan Elasticsearch",
        "Menjalankan dashboard Kibana",
      ],
      answerIndex: 1,
      explanation:
        "Fleet Server menerima check-in dari Elastic Agent dan mengirimkan pembaruan kebijakan (integrasi, output) secara terpusat.",
    },
    {
      id: "obs-ex-14",
      prompt: "SLI (Service Level Indicator) adalah…",
      options: [
        "Kontrak legal dengan vendor",
        "Pengukuran kuantitatif tingkat layanan, mis. persentase request sukses",
        "Nama lain dashboard",
        "Jenis shard khusus",
      ],
      answerIndex: 1,
      explanation:
        "SLI adalah metrik kualitas layanan yang diukur (ketersediaan, latensi), sedangkan SLO adalah target untuk SLI tersebut.",
    },
    {
      id: "obs-ex-15",
      prompt: "Uptime monitor tipe heartbeat yang memeriksa API lewat HTTP disebut…",
      options: [
        "ICMP monitor",
        "HTTP monitor",
        "Browser monitor",
        "TCP monitor",
      ],
      answerIndex: 1,
      explanation:
        "HTTP monitor melakukan request HTTP(S) dan memvalidasi status/body respons — pilihan tepat untuk memantau endpoint API.",
    },
    {
      id: "obs-ex-16",
      prompt: "Di Discover, cara menyaring dokumen ke satu nilai field tanpa menulis KQL adalah…",
      options: [
        "Klik ikon filter (+) pada nilai field di tabel dokumen",
        "Menghapus kolom lain",
        "Mengubah time zone browser",
        "Me-refresh halaman",
      ],
      answerIndex: 0,
      explanation:
        "Ikon plus/minus pada tiap nilai field menambahkan filter include/exclude secara langsung, yang juga tercermin di bilah filter.",
    },
    {
      id: "obs-ex-17",
      prompt: "Anomaly detection di Elastic Observability menggunakan…",
      options: [
        "Rule SQL terjadwal",
        "Machine learning job yang mempelajari pola normal data",
        "Index lifecycle policy",
        "Snapshot berkala",
      ],
      answerIndex: 1,
      explanation:
        "ML job membangun model baseline (mis. latensi atau rate log) dan menandai penyimpangan signifikan sebagai anomali.",
    },
    {
      id: "obs-ex-18",
      prompt: "Data stream cocok untuk data observabilitas karena…",
      options: [
        "Selalu lebih kecil dari indeks biasa",
        "Dirancang untuk data append-only berderet waktu dengan rollover dan ILM otomatis",
        "Tidak memerlukan mapping",
        "Hanya bisa dibaca Kibana",
      ],
      answerIndex: 1,
      explanation:
        "Data stream mengelola backing index otomatis untuk log/metrik/trace, dipadukan ILM untuk retensi — ideal untuk data time-series yang terus bertambah.",
    },
  ],
};
