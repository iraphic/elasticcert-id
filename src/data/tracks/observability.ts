import type { Track } from "../types";

export const observabilityTrack: Track = {
  id: "track-observability",
  slug: "observability",
  name: "Elastic Certified Observability Engineer",
  tagline: "Pantau metrik, log, dan trace aplikasi dalam satu platform terpadu.",
  description:
    "Jalur belajar mandiri ini dirancang secara komprehensif mengikuti silabus resmi ujian sertifikasi Elastic Certified Observability Engineer. Anda akan mempelajari pengumpulan log, eksplorasi Kibana, monitoring Kubernetes dengan Elastic Agent, rekayasa data event (grok/dissect), manajemen retensi (ILM), pengujian sintetis, instrumentasi APM penuh, hingga pembangunan visualisasi dan dashboard interaktif di Kibana.",
  audience: "Cocok untuk SRE, DevOps engineer, backend engineer, dan tim platform yang menjaga keandalan sistem berskala besar.",
  color: "amber",
  icon: "activity",
  examInfo: { questionCount: 18, durationMinutes: 180, passingScore: 70 },
  modules: [
    {
      slug: "logs",
      title: "Logs",
      level: "Dasar",
      durationMinutes: 20,
      intro: "Mempelajari fundamental pengumpulan log, jenis-jenis log, dan pentingnya standardisasi menggunakan Elastic Common Schema (ECS).",
      sections: [
        {
          heading: "Konsep Log dan Pengumpulannya",
          paragraphs: [
            "Log adalah catatan peristiwa (events) kronologis yang dihasilkan oleh sistem operasi, aplikasi, atau infrastruktur. Log merupakan pilar detektif paling krusial ketika terjadi kendala pada sistem.",
            "Dalam ekosistem Elastic, log dikumpulkan menggunakan Filebeat atau Elastic Agent. Agen ini membaca file log secara real-time, mendeteksi baris baru, menyimpan penanda posisi baca terakhir (registry), dan mengirimkan baris tersebut sebagai event JSON ke Elasticsearch."
          ],
          codeExample: {
            title: "Konfigurasi Input File pada Filebeat",
            lang: "yaml",
            code: `filebeat.inputs:\n  - type: filestream\n    id: app-logs\n    paths:\n      - /var/log/nginx/access.log\n      - /var/log/myapp/*.log`
          }
        },
        {
          heading: "Elastic Common Schema (ECS)",
          paragraphs: [
            "Tantangan terbesar dalam analisis log adalah perbedaan format nama field (misal, satu aplikasi mencatat alamat IP sebagai 'client_ip', yang lain 'ip_address'). Ini menyulitkan korelasi pencarian.",
            "Elastic Common Schema (ECS) adalah standar spesifikasi terbuka yang mendefinisikan nama-nama field standar (seperti 'client.ip', 'http.response.status_code', 'message') untuk seluruh data observabilitas dan keamanan. ECS memastikan konsistensi pencarian di seluruh klaster."
          ]
        }
      ],
      keyPoints: [
        "Log mencatat kejadian kronologis pada server dan aplikasi.",
        "Filebeat/Elastic Agent memantau file log lokal dan mengamankan posisi baca di berkas registry.",
        "Elastic Common Schema (ECS) menstandardisasi nama field agar data dari berbagai sumber mudah dicari.",
        "Mematikan atau merestart Filebeat tidak menyebabkan kehilangan data karena adanya registry lokal."
      ],
      quiz: [
        {
          id: "obs-m1-q1",
          prompt: "Di mana Filebeat mencatat posisi baris terakhir yang telah selesai dibaca dari file log?",
          options: [
            "Di memori heap master node",
            "Di file konfigurasi filebeat.yml",
            "Di database registry lokal di sisi agen",
            "Di indeks tersembunyi .kibana"
          ],
          answerIndex: 2,
          explanation: "Filebeat menggunakan database registry lokal untuk mencatat offset file dan inode terakhir yang dibaca agar tidak ada data yang terlewat atau dikirim ganda saat agen direstart."
        },
        {
          id: "obs-m1-q2",
          prompt: "Apa tujuan utama dari Elastic Common Schema (ECS)?",
          options: [
            "Mengurangi ukuran kompresi file log di disk",
            "Menstandardisasi nama field data dari berbagai sumber agar konsisten dan mudah dikorelasikan",
            "Mengenkripsi log sebelum dikirim ke Elasticsearch",
            "Membuat dashboard Kibana otomatis"
          ],
          answerIndex: 1,
          explanation: "ECS menstandardisasi penamaan field (misal, selalu menggunakan 'client.ip' alih-alih variasi nama lain) sehingga pencarian, aturan alert, dan dashboard dapat bekerja secara universal."
        },
        {
          id: "obs-m1-q3",
          prompt: "Mengapa log dalam bentuk terstruktur (seperti JSON) lebih disukai daripada teks mentah (plain text)?",
          options: [
            "Karena JSON lebih sulit dimodifikasi oleh peretas",
            "Karena JSON otomatis memisahkan field-field tanpa perlu proses parsing regular expression yang rumit di sisi server",
            "Karena JSON otomatis diarsipkan di cold tier",
            "Karena JSON tidak membutuhkan primary shard"
          ],
          answerIndex: 1,
          explanation: "Log berformat JSON sudah terstruktur secara inheren, sehingga Elasticsearch dapat memetakan kuncinya langsung menjadi field-field tanpa memerlukan pipeline grok regex yang memakan CPU."
        },
        {
          id: "obs-m1-q4",
          prompt: "Input type apa yang direkomendasikan di Filebeat modern untuk menggantikan tipe input 'log' yang lama?",
          options: [
            "stdin",
            "filestream",
            "tcp",
            "syslog"
          ],
          answerIndex: 1,
          explanation: "Tipe input 'filestream' adalah standar modern di Filebeat yang menggantikan tipe lama 'log', menawarkan penanganan file yang lebih stabil, efisien, dan andal di sistem operasi modern."
        }
      ]
    },
    {
      slug: "introduction-to-kibana",
      title: "Introduction to Kibana",
      level: "Dasar",
      durationMinutes: 20,
      intro: "Mengenal antarmuka Kibana, navigasi Discover untuk mencari log/metrik, dan menulis filter query menggunakan Kibana Query Language (KQL).",
      sections: [
        {
          heading: "Discover: Pintu Gerbang Eksplorasi Data",
          paragraphs: [
            "Discover adalah aplikasi utama di Kibana untuk mencari, menyaring, dan memeriksa data mentah yang tersimpan di Elasticsearch.",
            "Untuk melihat data di Discover, Anda harus memilih Data View (sebelumnya bernama Index Pattern) yang sesuai. Anda dapat melihat lini masa persebaran data, memilih kolom field yang ingin ditampilkan di tabel, dan membuka detail dokumen untuk melihat seluruh representasi JSON aslinya."
          ]
        },
        {
          heading: "Kibana Query Language (KQL)",
          paragraphs: [
            "KQL adalah bahasa kueri sederhana dan intuitif yang digunakan untuk menyaring data di Kibana. Berbeda dengan Query DSL Elasticsearch yang kompleks, KQL dirancang agar mudah diketik langsung di kolom pencarian.",
            "Contoh operator KQL:",
            "- `host.name : \"server-01\"` (kesetaraan nilai)",
            "- `http.response.status_code >= 400` (perbandingan numerik)",
            "- `service.name : *` (memeriksa apakah field tersebut ada/exists)",
            "- Menggunakan logika boolean: `and`, `or`, dan `not`."
          ],
          codeExample: {
            title: "Contoh Filter KQL Kompleks",
            lang: "bash",
            code: `service.name : "auth-service" and http.response.status_code >= 500 and not url.path : "/health"`
          }
        }
      ],
      keyPoints: [
        "Discover digunakan untuk investigasi cepat, pencarian dokumen, dan analisis baris waktu.",
        "Data View memetakan nama indeks Elasticsearch agar bisa diakses di Kibana.",
        "KQL mempermudah penyaringan data langsung di bar pencarian tanpa sintaks JSON yang berat.",
        "KQL mendukung auto-complete yang cerdas berdasarkan mapping field dari indeks terkait."
      ],
      quiz: [
        {
          id: "obs-m2-q1",
          prompt: "Apa yang harus dikonfigurasi terlebih dahulu di Kibana agar kita dapat mengeksplorasi data indeks tertentu di Discover?",
          options: [
            "Ingest Pipeline",
            "Data View (Index Pattern)",
            "Enrich Policy",
            "Kibana Lens"
          ],
          answerIndex: 1,
          explanation: "Kibana membutuhkan Data View untuk mengidentifikasi indeks mana saja di Elasticsearch yang ingin dieksplorasi dan divisualisasikan oleh pengguna di layar Discover."
        },
        {
          id: "obs-m2-q2",
          prompt: "Manakah sintaks KQL yang tepat untuk mencari log dari host 'web-prod' yang mengalami error dengan status code 500 ke atas?",
          options: [
            "host.name = web-prod AND status >= 500",
            "host.name : \"web-prod\" and http.response.status_code >= 500",
            "SELECT WHERE host.name IS web-prod AND status >= 500",
            "host.name:web-prod && status_code == 500"
          ],
          answerIndex: 1,
          explanation: "KQL menggunakan operator titik dua (:) untuk pencocokan nilai, 'and' huruf kecil untuk logika dan, serta operator perbandingan standar seperti >=."
        },
        {
          id: "obs-m2-q3",
          prompt: "Bagaimana cara menyaring dokumen di KQL untuk memastikan sebuah field bernama 'user.id' benar-benar ada dan berisi nilai (bukan null)?",
          options: [
            "user.id : null",
            "not user.id : *",
            "user.id : *",
            "exists(user.id)"
          ],
          answerIndex: 2,
          explanation: "Kueri '<field_name> : *' dalam KQL berfungsi untuk memfilter dokumen yang memiliki nilai (exists) pada field tersebut."
        },
        {
          id: "obs-m2-q4",
          prompt: "Di antarmuka Discover, apa fungsi dari fitur 'Field List' di sebelah kiri layar?",
          options: [
            "Untuk menghapus field dari Elasticsearch secara permanen",
            "To view the available fields, their distribution statistics, and select fields as table columns",
            "Untuk mengubah tipe data mapping",
            "Untuk membuat alert threshold"
          ],
          answerIndex: 1,
          explanation: "Field List di Discover menampilkan seluruh field yang terdeteksi pada indeks terkait, membolehkan pengguna melihat visualisasi cepat persebaran datanya, serta menyematkannya sebagai kolom tabel."
        }
      ]
    },
    {
      slug: "monitoring-kubernetes",
      title: "Monitoring Kubernetes with Elastic Agent",
      level: "Dasar",
      durationMinutes: 25,
      intro: "Pelajari cara memasang dan mengonfigurasi Elastic Agent di klaster Kubernetes untuk mengumpulkan metrik, log pod, dan metrik sistem secara otomatis.",
      sections: [
        {
          heading: "Elastic Agent dan Fleet",
          paragraphs: [
            "Elastic Agent adalah agen tunggal terpadu yang menggantikan seluruh Beats individual (Filebeat, Metricbeat, dll). Ia dikelola secara terpusat oleh **Fleet**.",
            "Di Fleet, Anda membuat **Agent Policy** yang berisi berbagai **Integrations** (misal integrasi Kubernetes, System, Nginx). Setiap agen yang mendaftar ke Fleet Policy tersebut akan otomatis menjalankan semua modul integrasi tanpa perlu konfigurasi file YAML lokal di masing-masing mesin host."
          ],
          codeExample: {
            title: "Arsitektur DaemonSet Elastic Agent di Kubernetes (YAML)",
            lang: "yaml",
            code: `apiVersion: apps/v1\nkind: DaemonSet\nmetadata:\n  name: elastic-agent\n  namespace: kube-system\nspec:\n  # Mengamankan alokasi agen di setiap node Kubernetes untuk memantau pod`
          }
        },
        {
          heading: "Autodiscover dan Monitoring Kubernetes",
          paragraphs: [
            "Ketika Elastic Agent dipasang sebagai DaemonSet di Kubernetes, ia secara otomatis berkomunikasi dengan API Server Kubernetes (Kubelet).",
            "Melalui mekanisme autodiscover, agen dapat mendeteksi pod baru yang aktif, membaca metadata pod (namespace, pod name, label), mengambil log kontainer dari disk node, serta mengumpulkan metrik performa pod secara real-time."
          ]
        }
      ],
      keyPoints: [
        "Elastic Agent menyatukan pengumpulan log, metrik, keamanan, dan tracing dalam satu agen tunggal.",
        "Fleet bertindak sebagai konsol manajemen pusat untuk mengatur ribuan Elastic Agent.",
        "Pemasangan agen di Kubernetes biasanya menggunakan DaemonSet agar agen berjalan di setiap node fisik.",
        "Metadata Kubernetes otomatis disisipkan ke dalam log dan metrik untuk memudahkan pemecahan masalah konteks pod."
      ],
      quiz: [
        {
          id: "obs-m3-q1",
          prompt: "Apakah peran utama Fleet dalam ekosistem Elastic Agent?",
          options: [
            "Menyimpan data log mentah",
            "Menjadi konsol terpusat untuk mengelola, memperbarui, dan mendistribusikan konfigurasi kebijakan (policy) ke Elastic Agent secara massal",
            "Menggantikan database Elasticsearch",
            "Menganalisis anomali machine learning"
          ],
          answerIndex: 1,
          explanation: "Fleet adalah pusat kendali yang membolehkan administrator memantau status ribuan Elastic Agent dan mengubah integrasi mereka secara dinamis dari UI Kibana tanpa menyentuh server fisik."
        },
        {
          id: "obs-m3-q2",
          prompt: "Jenis controller Kubernetes (Workload) apa yang paling tepat digunakan untuk menyebarkan Elastic Agent ke seluruh node klaster?",
          options: [
            "Deployment",
            "StatefulSet",
            "DaemonSet",
            "Job"
          ],
          answerIndex: 2,
          explanation: "DaemonSet memastikan bahwa satu replika pod Elastic Agent berjalan di setiap node dalam klaster Kubernetes, sehingga metrik dan log dari node tersebut dan seluruh pod di dalamnya dapat dikumpulkan secara merata."
        },
        {
          id: "obs-m3-q3",
          prompt: "Bagaimana cara Elastic Agent mendapatkan informasi nama pod atau namespace dari log kontainer yang dikumpulkannya?",
          options: [
            "Pengguna harus mengetiknya manual",
            "Agen melakukan query langsung ke API Server Kubernetes secara real-time (autodiscover enrichment)",
            "Aplikasi harus menyisipkan metadata tersebut ke dalam kode log",
            "Menggunakan reverse proxy"
          ],
          answerIndex: 1,
          explanation: "Integrasi Kubernetes pada Elastic Agent secara otomatis menanyakan status metadata pod ke API Server Kubernetes lokal (Kubelet) dan menyisipkannya ke dalam event dokumen sebelum dikirim."
        },
        {
          id: "obs-m3-q4",
          prompt: "Komponen apa di dalam klaster Kubernetes yang menyediakan metrik status klaster secara keseluruhan (seperti jumlah pod yang gagal, kuota resource, dll) untuk ditarik oleh Elastic Agent?",
          options: [
            "Kubelet",
            "kube-state-metrics",
            "CoreDNS",
            "etcd"
          ],
          answerIndex: 1,
          explanation: "Layanan kube-state-metrics menghasilkan metrik tingkat klaster mengenai kesehatan objek Kubernetes yang kemudian ditarik oleh Elastic Agent untuk visualisasi dasbor."
        }
      ]
    },
    {
      slug: "extracting-and-transforming-events",
      title: "Extracting and Transforming Events",
      level: "Menengah",
      durationMinutes: 30,
      intro: "Mengenal Ingest Node Processor seperti grok, dissect, dan date untuk memproses log tidak terstruktur menjadi field terstruktur.",
      sections: [
        {
          heading: "Ingest Pipeline di Elasticsearch",
          paragraphs: [
            "Sebelum dokumen disimpan di Elasticsearch, ia dapat dilewatkan ke **Ingest Pipeline** untuk dimodifikasi secara real-time.",
            "Sebuah pipeline terdiri dari deskripsi dan kumpulan **Processors** yang dieksekusi berurutan. Ingest node di dalam klaster bertanggung jawab menjalankan logika pipeline ini."
          ]
        },
        {
          heading: "Processor Grok vs Dissect",
          paragraphs: [
            "Dua processor utama untuk mengekstrak teks log menjadi field adalah:",
            "1. **Dissect**: Digunakan jika pola log memiliki struktur pemisah yang konsisten (misal dipisahkan oleh spasi, koma, atau tanda kurung). Sangat cepat dan efisien karena tidak menggunakan regular expression.",
            "2. **Grok**: Digunakan jika pola log sangat kompleks dan tidak konsisten. Grok menggunakan pencocokan pola berbasis regular expression (regex) yang kuat untuk mengekstrak string."
          ],
          codeExample: {
            title: "Mendefinisikan Ingest Pipeline dengan Grok",
            lang: "json",
            code: `PUT /_ingest/pipeline/parsing-log-aplikasi\n{\n  "description": "Parsing log aplikasi teks mentah",\n  "processors": [\n    {\n      "grok": {\n        "field": "message",\n        "patterns": ["%{TIMESTAMP_ISO8601:timestamp_string} \\\\[%{LOGLEVEL:log.level}\\\\] %{GREEDYDATA:message_text}"]\n      }\n    },\n    {\n      "date": {\n        "field": "timestamp_string",\n        "formats": ["yyyy-MM-dd HH:mm:ss,SSS"],\n        "target_field": "@timestamp"\n      }\n    }\n  ]\n}`
          }
        }
      ],
      keyPoints: [
        "Ingest pipeline memproses dokumen secara real-time di sisi server sebelum proses indexing selesai.",
        "Dissect memecah pola log menggunakan string pembatas tetap, sangat cepat karena bebas regex.",
        "Grok sangat tangguh menggunakan pola regex bawaan untuk menangani teks log yang tidak seragam.",
        "Processor 'date' digunakan untuk mem-parsing string waktu mentah dan memetakan nilainya ke field '@timestamp' standar."
      ],
      quiz: [
        {
          id: "obs-m4-q1",
          prompt: "Kapan sebuah Ingest Pipeline dieksekusi pada siklus data di Elasticsearch?",
          options: [
            "Saat kueri pencarian (search query) dijalankan oleh user",
            "Saat dokumen diterima oleh klaster sebelum disimpan secara fisik ke dalam disk (indexing stage)",
            "Saat Kibana me-refresh dasbor",
            "Saat data dipindahkan dari cold tier ke frozen tier"
          ],
          answerIndex: 1,
          explanation: "Ingest pipeline berjalan di memori ingest node sesaat setelah dokumen diterima oleh Elasticsearch dan sebelum dokumen tersebut ditulis secara permanen ke indeks."
        },
        {
          id: "obs-m4-q2",
          prompt: "Manakah pernyataan yang tepat mengenai perbedaan performa antara processor Dissect dan Grok?",
          options: [
            "Grok jauh lebih cepat karena menggunakan kecerdasan buatan",
            "Dissect lebih cepat karena hanya menggunakan pencocokan string pembatas sederhana tanpa beban evaluasi regular expression",
            "Keduanya memiliki kecepatan yang sama persis",
            "Dissect tidak dapat memproses data teks"
          ],
          answerIndex: 1,
          explanation: "Dissect memotong string berdasarkan pembatas struktural (seperti spasi atau kurung) tanpa mengevaluasi ekspresi reguler kompleks, sehingga mengonsumsi CPU jauh lebih sedikit dibanding Grok."
        },
        {
          id: "obs-m4-q3",
          prompt: "Mengapa kita wajib menambahkan processor 'date' di dalam ingest pipeline untuk log yang memiliki timestamp internal?",
          options: [
            "Untuk mengubah format log menjadi JSON",
            "Agar Elasticsearch memahami string tanggal log sebagai objek waktu (date type) resmi dan menyelaraskannya ke field utama '@timestamp'",
            "To delete expired logs",
            "Untuk mempercepat loading Kibana"
          ],
          answerIndex: 1,
          explanation: "Tanpa processor 'date', waktu kejadian asli log akan dianggap sebagai string biasa, dan '@timestamp' dokumen akan diisi waktu saat log tersebut tiba di server Elasticsearch (bisa tidak akurat)."
        },
        {
          id: "obs-m4-q4",
          prompt: "Processor apa yang digunakan jika kita ingin membuang (drop) dokumen log tertentu agar tidak disimpan ke Elasticsearch (misal log debug yang terlalu berisik)?",
          options: [
            "remove",
            "drop",
            "ignore",
            "filter"
          ],
          answerIndex: 1,
          explanation: "Processor 'drop' menghentikan proses indexing untuk dokumen tersebut seketika dan membuangnya secara aman tanpa menghasilkan error di sisi klien."
        }
      ]
    },
    {
      slug: "ilm-observability",
      title: "Index Lifecycle Management for Observability Data",
      level: "Menengah",
      durationMinutes: 20,
      intro: "Mengotomasi siklus hidup penyimpanan data log, metrik, dan trace menggunakan ILM agar klaster tetap efisien dan stabil.",
      sections: [
        {
          heading: "Manajemen Retensi Data Time-Series",
          paragraphs: [
            "Data observabilitas (log dan metrik) bertambah sangat cepat setiap harinya, namun nilainya menurun seiring waktu (analis jarang membuka log 3 bulan lalu kecuali untuk audit).",
            "**Index Lifecycle Management (ILM)** membagi retensi data menjadi beberapa fase otomatis:",
            "- **Hot**: Fase aktif, menerima data tulis baru dan sering dicari. Dilakukan Rollover agar ukuran shard terkontrol.",
            "- **Warm**: Data tidak lagi ditulis, melainkan hanya dicari. Dioptimalkan dengan Force Merge agar segmen data menyusut.",
            "- **Cold**: Data jarang diakses, dapat dipasang sebagai Searchable Snapshot untuk menghemat disk.",
            "- **Delete**: Data dihapus permanen ketika melewati batas retensi organisasi (misal 30 hari)."
          ],
          codeExample: {
            title: "Penerapan ILM Policy pada Data Stream",
            lang: "json",
            code: `PUT /_ilm/policy/observability-logs-policy\n{\n  "policy": {\n    "phases": {\n      "hot": {\n        "actions": {\n          "rollover": {\n            "max_primary_shard_size": "50gb",\n            "max_age": "30d"\n          }\n        }\n      },\n      "delete": {\n        "min_age": "90d",\n        "actions": {\n          "delete": {}\n        }\n      }\n    }\n  }\n}`
          }
        }
      ],
      keyPoints: [
        "Data observabilitas memiliki siklus hidup: semakin tua, kegunaannya semakin menurun.",
        "ILM mengotomatiskan pemindahan data antar fase (Hot, Warm, Cold, Frozen, Delete).",
        "Rollover membatasi ukuran shard maksimal 50GB, menjaga stabilitas pencarian.",
        "Fase Delete mengosongkan kapasitas disk secara otomatis sesuai kebijakan organisasi."
      ],
      quiz: [
        {
          id: "obs-m5-q1",
          prompt: "Berapakah ukuran primary shard maksimal yang direkomendasikan pada aksi Rollover fase Hot untuk performa terbaik di Elasticsearch?",
          options: [
            "100 MB",
            "5 GB",
            "50 GB",
            "500 GB"
          ],
          answerIndex: 2,
          explanation: "Ukuran shard ideal di Elasticsearch berkisar antara 10 GB hingga 50 GB. Melebihi 50 GB per shard akan memperlambat proses recovery dan kueri pencarian."
        },
        {
          id: "obs-m5-q2",
          prompt: "Apa fungsi utama dari aksi 'Force Merge' yang sering dijalankan saat memasuki fase Warm?",
          options: [
            "Menghapus replica shard",
            "Menggabungkan segmen-segmen kecil Lucene di dalam shard menjadi satu segmen besar, menghemat penggunaan memori RAM dan mempercepat pencarian",
            "Mengubah tipe data field secara paksa",
            "Mengirim data ke klaster remote"
          ],
          answerIndex: 1,
          explanation: "Force merge merampingkan struktur internal shard (segmen Lucene), membuang dokumen bertanda terhapus, serta mengoptimalkan penggunaan RAM dan kecepatan kueri baca."
        },
        {
          id: "obs-m5-q3",
          prompt: "Dari manakah waktu 'min_age' (usia indeks) dihitung oleh sistem ILM saat memutuskan untuk memindahkan data ke fase berikutnya?",
          options: [
            "Sejak klaster Elasticsearch pertama kali diinstal",
            "Sejak proses Rollover indeks tersebut selesai dieksekusi",
            "Sejak dokumen pertama dimasukkan",
            "Berdasarkan jam lokal komputer pengguna"
          ],
          answerIndex: 1,
          explanation: "Setelah rollover terjadi, indeks lama menjadi read-only, dan sejak detik itulah penghitungan usia indeks ('min_age') untuk perpindahan fase berikutnya dimulai."
        },
        {
          id: "obs-m5-q4",
          prompt: "Fase ILM manakah yang ideal untuk menghapus data log secara permanen setelah disimpan selama 30 hari?",
          options: [
            "Warm Phase",
            "Cold Phase",
            "Frozen Phase",
            "Delete Phase"
          ],
          answerIndex: 3,
          explanation: "Fase Delete adalah fase akhir siklus hidup yang bertugas melakukan penghapusan indeks secara fisik dan permanen dari server penyimpanan klaster."
        }
      ]
    },
    {
      slug: "synthetic-monitoring",
      title: "Synthetic monitoring with Elastic",
      level: "Menengah",
      durationMinutes: 20,
      intro: "Memantau ketersediaan dan performa endpoint aplikasi Anda secara proaktif dari berbagai lokasi geografis menggunakan Heartbeat dan uji sintetis.",
      sections: [
        {
          heading: "Heartbeat dan Ketersediaan Layanan",
          paragraphs: [
            "Uji sintetis (Synthetic Monitoring) menyimulasikan interaksi pengguna asli dengan aplikasi dari luar sistem. Ini memungkinkan Anda mengetahui kegagalan situs sebelum pengguna nyata menyadarinya.",
            "Di Elastic Stack, **Heartbeat** adalah agen ringan untuk memantau ketersediaan endpoint melalui tiga protokol utama:",
            "- **ICMP**: Memeriksa ketersediaan mesin host dasar (ping).",
            "- **TCP**: Memeriksa ketersediaan port jaringan tertentu (misal port database 3306).",
            "- **HTTP/S**: Melakukan request HTTP ke situs web dan memvalidasi kode status respons (misal harus 200 OK)."
          ],
          codeExample: {
            title: "Konfigurasi HTTP Monitor sederhana pada heartbeat.yml",
            lang: "yaml",
            code: `heartbeat.monitors:\n  - type: http\n    id: api-gateway\n    name: API Gateway Monitor\n    urls: ["https://api.elasticcert.id/health"]\n    schedule: '@every 10s'\n    check.response.status: 200`
          }
        },
        {
          heading: "Uji Perjalanan Pengguna (Multi-step Journeys)",
          paragraphs: [
            "Selain pemeriksaan endpoint sederhana, Elastic Synthetics mendukung simulasi navigasi browser yang kompleks menggunakan skrip Playwright (Node.js).",
            "Anda dapat membuat skrip uji yang secara otomatis membuka browser Chrome tersembunyi, mengisi formulir login, mengklik tombol belanja, dan memeriksa apakah transaksi berhasil diselesaikan."
          ]
        }
      ],
      keyPoints: [
        "Synthetic monitoring menyimulasikan interaksi pengguna secara berkala (proaktif).",
        "Heartbeat memantau uptime sistem lewat protokol ICMP, TCP, dan HTTP.",
        "Uji multi-step (Journeys) mensimulasikan alur transaksi riil pengguna di atas browser asli.",
        "Visualisasi ketersediaan, sertifikat SSL, dan latensi dapat dilihat langsung di aplikasi Uptime Kibana."
      ],
      quiz: [
        {
          id: "obs-m6-q1",
          prompt: "Jenis monitor Heartbeat mana yang paling tepat digunakan untuk memastikan sertifikat SSL/TLS domain web Anda belum kedaluwarsa?",
          options: [
            "ICMP monitor",
            "TCP monitor",
            "HTTP/S monitor",
            "Prosesor Grok"
          ],
          answerIndex: 2,
          explanation: "Monitor HTTP/S secara otomatis memantau masa berlaku sertifikat SSL/TLS situs target saat melakukan request jabat tangan (handshake) HTTPS dan memberi peringatan di Kibana jika masa berlakunya akan habis."
        },
        {
          id: "obs-m6-q2",
          prompt: "Bagaimana cara Synthetic Monitoring mendeteksi masalah kinerja pada aplikasi web?",
          options: [
            "With server logs",
            "Dengan menyimulasikan request pengguna secara berkala dari luar jaringan dan mengukur waktu respons serta fungsionalitasnya",
            "Dengan menghentikan pod Kubernetes",
            "Dengan mengubah index template"
          ],
          answerIndex: 1,
          explanation: "Uji sintetis bertindak sebagai 'robot' pengguna yang melakukan tes berkala dari luar klaster, memberikan metrik objektif mengenai latensi jaringan, waktu muat halaman, dan kegagalan fungsional."
        },
        {
          id: "obs-m6-q3",
          prompt: "Teknologi browser automation apa yang menjadi fondasi pengerjaan skrip uji multi-step (Journeys) di Elastic Synthetics?",
          options: [
            "Selenium",
            "Playwright",
            "Puppeteer",
            "Cypress"
          ],
          answerIndex: 1,
          explanation: "Elastic Synthetics menggunakan pustaka Microsoft Playwright untuk mengontrol jalannya pengujian fungsionalitas multi-langkah di dalam browser Chromium, Firefox, atau WebKit."
        },
        {
          id: "obs-m6-q4",
          prompt: "Aplikasi Kibana mana yang menampilkan status ketersediaan, riwayat downtime, dan waktu respon dari monitor sintetis Anda?",
          options: [
            "Discover",
            "Uptime (atau Synthetics)",
            "APM",
            "Fleet"
          ],
          answerIndex: 1,
          explanation: "Aplikasi Uptime / Synthetics di Kibana dirancang khusus untuk memvisualisasikan data ketersediaan geografis, status monitor, durasi ping, dan screenshot langkah kegagalan uji browser."
        }
      ]
    },
    {
      slug: "apm-with-elastic",
      title: "APM with Elastic",
      level: "Menengah",
      durationMinutes: 20,
      intro: "Memahami Application Performance Monitoring (APM) dan Distributed Tracing untuk melacak aliran request lintas mikroservis dan mendeteksi latensi.",
      sections: [
        {
          heading: "Distributed Tracing",
          paragraphs: [
            "Dalam arsitektur mikroservis modern, satu request dari pengguna dapat melewati belasan layanan terpisah sebelum menghasilkan respon.",
            "**Distributed Tracing** melacak perjalanan request ini dengan menyisipkan pengenal unik (**`trace.id`**) ke dalam header HTTP request lintas layanan. Setiap operasi individu di dalam layanan direkam sebagai **`span`**, dan kumpulan span tersebut membentuk visualisasi **`waterfall`** tunggal yang menggambarkan total waktu eksekusi."
          ]
        },
        {
          heading: "Transactions vs Spans",
          paragraphs: [
            "Elastic APM mendefinisikan data kinerja menjadi dua entitas logis utama:",
            "1. **Transaction**: Unit pekerjaan tingkat tinggi yang diukur di dalam aplikasi Anda (misal, penanganan request HTTP di route `GET /checkout` atau eksekusi background job harian).",
            "2. **Span**: Operasi internal individual yang terjadi di dalam cakupan Transaction tersebut (misal, kueri database SQL, pemanggilan API HTTP eksternal, atau kalkulasi enkripsi)."
          ],
          codeExample: {
            title: "Mencari Transaksi dengan Latensi Terlama di API",
            lang: "json",
            code: `GET /traces-apm-*/_search\n{\n  "query": {\n    "term": { "processor.event": "transaction" }\n  },\n  "sort": [\n    { "transaction.duration.us": "desc" }\n  ]\n}`
          }
        }
      ],
      keyPoints: [
        "APM melacak kinerja kode aplikasi, mendeteksi error tak tertangkap, dan memantau distributed tracing.",
        "Transaction mengukur pintu masuk request; Span mengukur eksekusi detail di dalamnya.",
        "Trace ID merangkai perjalanan transaksi lintas mikroservis untuk analisis bottleneck.",
        "Visualisasi waterfall mempermudah identifikasi kueri database SQL lambat yang menghambat respons aplikasi."
      ],
      quiz: [
        {
          id: "obs-m7-q1",
          prompt: "Apa perbedaan mendasar antara Transaction dan Span di Elastic APM?",
          options: [
            "Transaction menyimpan data di disk sedangkan Span disimpan di RAM",
            "Transaction adalah unit aktivitas tingkat tinggi (seperti request masuk), sedangkan Span adalah operasi individu di dalamnya (seperti kueri SQL)",
            "Span adalah kumpulan dari beberapa Transaction",
            "Keduanya adalah istilah yang sama tanpa perbedaan"
          ],
          answerIndex: 1,
          explanation: "Transaction merepresentasikan titik masuk dan total waktu pemrosesan sebuah request, sedangkan Span mencatat detail durasi operasi internal di dalam request tersebut."
        },
        {
          id: "obs-m7-q2",
          prompt: "Bagaimana mekanisme Distributed Tracing menghubungkan jejak pencatatan (spans) yang terjadi di dua server mikroservis yang berbeda?",
          options: [
            "Dengan mencatat nama host server",
            "Dengan menyisipkan trace.id unik ke dalam HTTP Header request yang dikirim antar layanan (W3C Trace Context)",
            "Dengan menghentikan jalannya aplikasi sejenak",
            "Using a VPN"
          ],
          answerIndex: 1,
          explanation: "Distributed tracing mengandalkan propagasi konteks (context propagation) dengan menyematkan header HTTP khusus berisi trace.id yang sama ke setiap panggilan API antar layanan."
        },
        {
          id: "obs-m7-q3",
          prompt: "Dalam satuan waktu apakah field durasi transaksi ('transaction.duration.us') disimpan secara default di Elasticsearch?",
          options: [
            "Milidetik (milliseconds)",
            "Mikrodetik (microseconds)",
            "Detik (seconds)",
            "Menit (minutes)"
          ],
          answerIndex: 1,
          explanation: "Sesuai standar ECS, durasi performa transaksi disimpan dalam satuan mikrodetik (microseconds, dilambangkan '.us') untuk akurasi tinggi."
        },
        {
          id: "obs-m7-q4",
          prompt: "Manakah metrik di APM yang mengukur kombinasi antara tingkat kepuasan pengguna berdasarkan ambang batas toleransi latensi dan tingkat kegagalan transaksi?",
          options: [
            "CPU usage",
            "Apdex Score",
            "Memory buffer",
            "Error rate"
          ],
          answerIndex: 1,
          explanation: "Apdex (Application Performance Index) adalah standar industri untuk mengukur kepuasan pengguna aplikasi berdasarkan rasio transaksi sukses, lambat, dan gagal terhadap ambang target durasi."
        }
      ]
    },
    {
      slug: "collect-application-data",
      title: "Collect Application Data",
      level: "Menengah",
      durationMinutes: 20,
      intro: "Mempelajari cara memasang agen APM di berbagai bahasa pemrograman populer (Java, Node.js, Python, Go) untuk merekam transaksi secara otomatis.",
      sections: [
        {
          heading: "Integrasi APM Agents",
          paragraphs: [
            "Untuk mengumpulkan data APM, Anda harus memasang **Elastic APM Agent** di dalam kode aplikasi Anda.",
            "Sebagian besar bahasa pemrograman mendukung **Auto-Instrumentation**, di mana agen akan menyadap framework web populer (seperti Express.js di Node.js, Spring Boot di Java, atau Django di Python) dan kueri database secara otomatis tanpa perlu mengubah baris kode utama Anda."
          ],
          codeExample: {
            title: "Instrumentasi Otomatis pada Aplikasi Node.js",
            lang: "bash",
            code: `// Wajib diimpor di baris pertama sebelum modul lain!\nconst apm = require('elastic-apm-node').start({\n  serviceName: 'frontend-service',\n  secretToken: 'token_aman_anda',\n  serverUrl: 'https://apm-server.elasticcert.id:443'\n});`
          }
        },
        {
          heading: "Custom Instrumentation (Kustomisasi)",
          paragraphs: [
            "Jika aplikasi Anda memiliki fungsi matematika internal khusus yang berat atau proses non-web yang ingin diukur kinerjanya secara terpisah, Anda dapat menggunakan **APM Agent SDK** untuk memulai dan mengakhiri transaksi/span kustom secara manual di dalam kode."
          ]
        }
      ],
      keyPoints: [
        "APM Agent harus aktif di awal siklus hidup aplikasi agar dapat menyadap framework web dengan benar.",
        "Auto-instrumentation menangkap request masuk, query database, and request keluar secara out-of-the-box.",
        "Koneksi APM Agent membutuhkan alamat URL APM Server dan Secret Token keamanan.",
        "SDK agen membolehkan developer membuat custom transaction dan span sesuai kebutuhan bisnis."
      ],
      quiz: [
        {
          id: "obs-m8-q1",
          prompt: "Mengapa APM Agent pada aplikasi Node.js wajib diimpor dan diinisialisasi pada baris paling pertama di file entrypoint?",
          options: [
            "Agar file konfigurasi tidak hilang",
            "Agar agen dapat melakukan patching atau membungkus (hook) library bawaan sebelum modul lain di-load oleh Node.js",
            "Agar aplikasi berjalan lebih cepat",
            "Karena aturan sintaksis wajib Javascript"
          ],
          answerIndex: 1,
          explanation: "APM Agent memodifikasi modul HTTP dan database saat dimuat pertama kali. Jika ada modul lain yang di-load sebelum inisialisasi agen, interaksi modul tersebut tidak akan terekam (tidak terinstrumentasi)."
        },
        {
          id: "obs-m8-q2",
          prompt: "Parameter konfigurasi manakah di APM Agent yang digunakan untuk mengidentifikasi kelompok nama layanan aplikasi Anda di Kibana?",
          options: [
            "service_name atau serviceName",
            "app_id",
            "agent.type",
            "index.pattern"
          ],
          answerIndex: 0,
          explanation: "Parameter 'service_name' menentukan nama pengelompokan layanan aplikasi di dasbor APM Kibana agar mudah dibedakan dengan layanan mikroservis lainnya."
        },
        {
          id: "obs-m8-q3",
          prompt: "Apakah fungsi dari fitur 'Real User Monitoring' (RUM) pada Elastic APM?",
          options: [
            "Memonitor server fisik",
            "Merekam performa aplikasi langsung di sisi browser pengguna (frontend), mengukur waktu render DOM dan latensi halaman web dari sudut pandang user asli",
            "Mendeteksi akun bot otomatis",
            "Menghapus database secara berkala"
          ],
          answerIndex: 1,
          explanation: "RUM APM menginstrumentasikan kode javascript di browser pengguna untuk mengukur kinerja frontend sebenarnya, termasuk waktu muat aset gambar, CSS, dan render halaman."
        },
        {
          id: "obs-m8-q4",
          prompt: "Jika server database Anda mengalami overload, di bagian visualisasi APM manakah Anda dapat mengonfirmasi kueri SQL terlama yang berjalan?",
          options: [
            "Uptime dashboard",
            "Metrik CPU server",
            "Tampilan detail spans (span waterfall) pada transaksi terkait",
            "Kueri KQL di Discover"
          ],
          answerIndex: 2,
          explanation: "Pohon visualisasi spans (waterfall) di APM akan memisahkan kueri database sebagai span tersendiri dan menampilkan teks kueri SQL lengkap beserta durasi eksekusinya."
        }
      ]
    },
    {
      slug: "hello-dashboard",
      title: "Hello Dashboard",
      level: "Dasar",
      durationMinutes: 15,
      intro: "Memulai petualangan visualisasi Anda di Kibana dengan memahami prinsip dasar perancangan dashboard yang bersih dan fungsional.",
      sections: [
        {
          heading: "Konsep Dashboard di Kibana",
          paragraphs: [
            "Dashboard Kibana adalah kanvas interaktif yang menyatukan berbagai visualisasi data (seperti grafik garis, peta geografis, nilai tunggal, dan tabel) ke dalam satu halaman ringkasan terpadu.",
            "Dashboard mempermudah tim operasional atau eksekutif memantau kesehatan klaster secara real-time. Dengan dashboard, Anda tidak perlu lagi menulis kueri rumit berulang kali di Discover."
          ]
        },
        {
          heading: "Prinsip Perancangan Dashboard yang Efektif",
          paragraphs: [
            "Membuat dashboard yang baik membutuhkan perencanaan tata letak (layout) yang matang:",
            "1. **Fokus pada Satu Pertanyaan Utama**: Hindari mencampuradukkan metrik sistem Kubernetes dengan log transaksi keuangan di satu dashboard yang sama. Buat dashboard yang berdedikasi.",
            "2. **Pola Baca Kiri-Atas**: Pengguna membaca layar dari kiri-atas ke kanan-bawah. Letakkan panel metrik terpenting (seperti status kesehatan sistem atau tingkat error) di pojok kiri atas.",
            "3. **Gunakan Warna Secara Bijak**: Batasi penggunaan warna. Gunakan warna merah hanya untuk kegagalan kritis dan hijau untuk kondisi normal."
          ]
        }
      ],
      keyPoints: [
        "Dashboard menyatukan beragam komponen visualisasi di satu tempat.",
        "Dashboard yang baik berfokus menjawab satu tema pertanyaan spesifik.",
        "Prinsip posisi: letakkan visualisasi status kesehatan kritis di pojok kiri atas.",
        "Menghindari cluttering (terlalu banyak diagram) agar performa render dasbor tetap ringan."
      ],
      quiz: [
        {
          id: "obs-m9-q1",
          prompt: "Di posisi manakah panel visualisasi terpenting (seperti status kritis ketersediaan sistem) sebaiknya diletakkan di dasbor Kibana?",
          options: [
            "Di pojok kanan bawah",
            "Di bagian pojok kiri atas",
            "Di tengah-tengah tersembunyi",
            "Di bagian footer terbawah"
          ],
          answerIndex: 1,
          explanation: "Berdasarkan kebiasaan membaca mata manusia (Z-pattern), pojok kiri atas adalah area pertama yang mendapatkan perhatian penuh dari pemantau dasbor."
        },
        {
          id: "obs-m9-q2",
          prompt: "Mengapa mencampurkan terlalu banyak jenis diagram (misal di atas 30 diagram) di dalam satu dasbor tunggal dianggap sebagai praktik yang kurang baik?",
          options: [
            "Karena Kibana akan otomatis menghapus dasbor tersebut",
            "Karena membuat dasbor sulit dipahami (cluttered) dan memperlambat waktu pemuatan (load time) query halaman karena beban komputasi Elasticsearch yang terlalu besar sekaligus",
            "Karena warna diagram akan menjadi hitam putih",
            "Karena user akan dipaksa logout"
          ],
          answerIndex: 1,
          explanation: "Terlalu banyak komponen memicu puluhan query paralel ke Elasticsearch secara bersamaan, memperlambat rendering halaman dan menyulitkan fokus pembacaan metrik penting."
        },
        {
          id: "obs-m9-q3",
          prompt: "Bagaimana cara kita membagikan dashboard Kibana yang telah dibuat kepada rekan setim yang tidak memiliki akses langsung ke klaster Kibana?",
          options: [
            "Dengan menyalin file konfigurasi biner",
            "Melalui menu Share untuk mengekspor tautan iframe (embed) atau menghasilkan laporan PDF/PNG statis",
            "Dengan mengunggah tangkapan layar ke Git",
            "Dashboard tidak bisa dibagikan"
          ],
          answerIndex: 1,
          explanation: "Kibana menyediakan tombol Share yang memfasilitasi pembuatan link publik, kode semat iframe, atau download dokumen PDF/PNG terjadwal untuk distribusi berkala."
        },
        {
          id: "obs-m9-q4",
          prompt: "Apakah fungsi dari fitur 'Auto-refresh' di bagian pojok kanan atas dasbor Kibana?",
          options: [
            "Menghapus cache database",
            "Menginstruksikan dasbor untuk secara otomatis memicu query ulang ke Elasticsearch pada interval waktu tertentu (misal tiap 10 detik) agar data dasbor selalu teranyar",
            "Merestart server Kibana",
            "Memperbarui versi plugin Kibana"
          ],
          answerIndex: 1,
          explanation: "Auto-refresh memastikan visualisasi di dasbor terus diperbarui dengan data log/metrik terbaru yang baru masuk tanpa mengharuskan pengguna menekan tombol refresh secara manual."
        }
      ]
    },
    {
      slug: "create-visualizations",
      title: "Create Visualizations",
      level: "Dasar",
      durationMinutes: 20,
      intro: "Menguasai pembuatan grafik garis, diagram lingkaran, metrik tunggal, dan tabel kustom menggunakan editor visual serbaguna Kibana Lens.",
      sections: [
        {
          heading: "Kibana Lens: Editor Masa Depan Kibana",
          paragraphs: [
            "**Kibana Lens** adalah editor visualisasi bawaan yang sangat mudah digunakan. Mengusung konsep drag-and-drop, Lens membolehkan Anda menyeret field dari panel daftar sebelah kiri langsung ke kanvas utama.",
            "Kibana Lens secara cerdas akan menyarankan jenis grafik terbaik berdasarkan tipe data field yang Anda seret (misal menyeret field tanggal akan otomatis menghasilkan grafik tren lini masa)."
          ]
        },
        {
          heading: "Kustomisasi Agregasi di Lens",
          paragraphs: [
            "Di dalam panel konfigurasi Lens, Anda dapat mengubah parameter agregasi dengan sangat detail:",
            "- Mengubah sumbu Y untuk menghitung `Average` (rata-rata), `Sum` (total), atau `Median`.",
            "- Menggunakan **Formula** kustom untuk menghitung rasio matematika (misal persentase error: `(count(query='status:error') / count()) * 100`).",
            "- Mengatur skala grafik dan mengubah palet warna sesuai standar perusahaan."
          ],
          codeExample: {
            title: "Contoh Formula Perhitungan Persentase Error Rate di Lens",
            lang: "json",
            code: `// Menghitung persentase transaksi gagal dibanding total transaksi\nkql_value("http.response.status_code >= 500") / count()`
          }
        }
      ],
      keyPoints: [
        "Kibana Lens adalah editor visual standar utama di Kibana berbasis drag-and-drop.",
        "Lens menyarankan visualisasi secara cerdas sesuai tipe data field.",
        "Fungsi Formula di Lens memungkinkan perhitungan rasio atau kalkulasi matematis di atas hasil agregasi.",
        "Anda dapat beralih jenis diagram (dari bar ke line atau table) secara instan di dalam Lens."
      ],
      quiz: [
        {
          id: "obs-m10-q1",
          prompt: "Bagaimana cara tercepat membuat diagram garis tren rata-rata memori server berdasarkan waktu di Kibana Lens?",
          options: [
            "Menulis kode program Node.js",
            "Menyeret field '@timestamp' ke sumbu X, menyeret field 'system.memory.actual.used.pct' ke sumbu Y, lalu memilih visualisasi diagram garis (Line chart)",
            "Menjalankan SQL Query",
            "Membuat indeks baru"
          ],
          answerIndex: 1,
          explanation: "Kibana Lens memetakan sumbu visual secara visual. Menyeret field waktu ke sumbu horizontal dan field angka metrik ke sumbu vertikal langsung membentuk visualisasi tren waktu."
        },
        {
          id: "obs-m10-q2",
          prompt: "Fitur apa di Kibana Lens yang digunakan jika kita perlu menghitung rasio khusus, seperti membagi jumlah log error dengan total log keseluruhan?",
          options: [
            "Processor Ingest",
            "Formula",
            "Enrich Policy",
            "Circuit Breaker"
          ],
          answerIndex: 1,
          explanation: "Fitur Formula di Kibana Lens menyediakan ekspresi matematika untuk melakukan operasi pembagian, perkalian, atau penjumlahan dari hasil agregasi kueri."
        },
        {
          id: "obs-m10-q3",
          prompt: "Saat menggunakan visualisasi bertipe 'Metric' (metrik tunggal), informasi seperti apa yang biasanya ditampilkan di dasbor?",
          options: [
            "Peta persebaran data",
            "Satu angka statistik raksasa yang dominan (misal: jumlah transaksi aktif atau uptime saat ini)",
            "Teks log mentah paragraf panjang",
            "Struktur JSON dokumen"
          ],
          answerIndex: 1,
          explanation: "Visualisasi tipe Metric berfokus menyorot satu angka indikator utama (KPI) secara jelas dan ringkas agar langsung terbaca dari kejauhan."
        },
        {
          id: "obs-m10-q4",
          prompt: "Mengapa field bertipe data 'text' (seperti isi pesan log mentah) tidak dapat diseret ke bagian pembentuk bucket agregasi terms di Lens?",
          options: [
            "Because Kibana prevents reading texts",
            "Karena field bertipe text mengalami tokenisasi dan tidak mendukung agregasi terms secara efisien (gunakan sub-field .keyword-nya)",
            "Karena file text terlalu kecil",
            "Karena browser akan crash"
          ],
          answerIndex: 1,
          explanation: "Elasticsearch mengunci field 'text' dari operasi agregasi karena dapat menguras memori heap JVM secara masif. Operasi agregasi terms hanya diizinkan pada tipe field 'keyword' atau numerik."
        }
      ]
    },
    {
      slug: "interactive-dashboards",
      title: "Interactive Dashboards",
      level: "Siap Ujian",
      durationMinutes: 20,
      intro: "Menjadikan dashboard Anda interaktif dengan filter dinamis, kontrol dropdown, navigasi drill-down, dan tautan lintas panel.",
      sections: [
        {
          heading: "Kekuatan Interaktivitas Dasbor",
          paragraphs: [
            "Dashboard statis hanya berguna sebagai pajangan dinding. Dashboard yang sesungguhnya harus interaktif agar tim investigasi dapat menggali akar masalah secara mendalam.",
            "Di Kibana, setiap diagram di dalam dashboard secara inheren bertindak sebagai filter. Jika Anda mengklik satu batang diagram kategori 'Nginx Error', seluruh dasbor otomatis akan langsung disaring (filtered) untuk hanya menampilkan data milik kategori tersebut."
          ]
        },
        {
          heading: "Kibana Controls dan Drill-downs",
          paragraphs: [
            "1. **Input Controls (Controls Panel)**: Elemen khusus berupa dropdown pilihan atau slider rentang yang dipasang di bagian atas dashboard untuk menyaring data dengan mudah (misal memilih nama microservice atau nama negara).",
            "2. **Drill-downs (Url Navigation)**: Konfigurasi di mana mengklik bagian diagram tertentu dapat mengarahkan pengguna ke dashboard lain dengan membawa konteks filter yang sama, atau membuka tautan eksternal sistem tiket seperti Jira."
          ],
          codeExample: {
            title: "Format Kueri URL Kustom pada Drill-down Dinamis",
            lang: "bash",
            code: `https://jira.internal/secure/CreateIssue.jspa?summary=Anomali+Deteksi+pada+{{event.value}}`
          }
        }
      ],
      keyPoints: [
        "Interaktivitas dasbor memfasilitasi tim investigasi mencari korelasi anomali sistem secara dinamis.",
        "Mengklik elemen grafik di dasbor otomatis menerapkan filter global di bar penyaringan Kibana.",
        "Input Controls menyediakan dropdown dan slider seleksi data dinamis terpusat.",
        "Drill-downs menghubungkan alur kerja antar dasbor Kibana yang berbeda tanpa memutus konteks filter waktu."
      ],
      quiz: [
        {
          id: "obs-m11-q1",
          prompt: "Apa yang terjadi pada dasbor Kibana ketika Anda mengklik salah satu irisan diagram lingkaran (pie chart) yang mewakili kategori sistem operasi 'Linux'?",
          options: [
            "Diagram tersebut akan terhapus dari dasbor",
            "Seluruh panel visualisasi di dasbor tersebut otomatis langsung terfilter untuk hanya menampilkan data dari sistem operasi 'Linux'",
            "Kibana mengunduh file CSV otomatis",
            "Halaman web dimatikan"
          ],
          answerIndex: 1,
          explanation: "Kibana mengimplementasikan interaktivitas asinkronus, di mana klik visual pada diagram langsung menerjemahkan pilihan tersebut menjadi filter global dasbor."
        },
        {
          id: "obs-m11-q2",
          prompt: "Fitur dasbor apakah yang menyediakan kolom pilihan dropdown interaktif di bagian atas agar user mudah menyaring data berdasarkan satu atau lebih field?",
          options: [
            "Ingest Node",
            "Input Controls",
            "Index Lifecycle",
            "Elastic Common Schema"
          ],
          answerIndex: 1,
          explanation: "Input Controls (atau panel Controls) membolehkan pembuatan kolom seleksi dropdown (terms selection) atau rentang nilai (range slider) secara ramah pengguna di bagian atas dasbor."
        },
        {
          id: "obs-m11-q3",
          prompt: "Apakah fungsi utama dari fitur Drill-down pada visualisasi Kibana?",
          options: [
            "Untuk menghapus data indeks",
            "Untuk menghubungkan interaksi klik diagram ke dasbor lain atau URL eksternal dengan tetap membawa parameter filter aktif",
            "Untuk mengubah format waktu",
            "Untuk melakukan kompresi data"
          ],
          answerIndex: 1,
          explanation: "Drill-down menciptakan navigasi cerdas yang melompati sekat antar halaman dengan mengalirkan filter yang sedang aktif, merampingkan proses investigasi tim SRE."
        },
        {
          id: "obs-m11-q4",
          prompt: "Bagaimana cara kita menghapus filter interaktif yang sedang aktif di dasbor Kibana?",
          options: [
            "Harus membuat dasbor baru dari awal",
            "Dengan mengklik tanda silang (x) atau tempat sampah pada pil filter aktif di bilah filter atas dasbor",
            "Dengan menekan tombol F5 berkali-kali",
            "Dengan mematikan komputer"
          ],
          answerIndex: 1,
          explanation: "Filter aktif dilambangkan sebagai pil (pills) berwarna biru di bawah kolom pencarian. Mengklik tombol 'x' pada pil tersebut langsung mencabut penyaringan terkait."
        }
      ]
    }
  ],
  examQuestions: [
    {
      id: "obs-ex-1",
      prompt: "Tiga pilar utama dalam konsep Observabilitas sistem adalah…",
      options: [
        "Indeks, shard, dan replica",
        "Metrik, log, dan trace",
        "CPU, memori, dan disk",
        "Kibana, Elasticsearch, dan Logstash",
      ],
      answerIndex: 1,
      explanation:
        "Metrik mengukur kesehatan kuantitatif, log mencatat peristiwa kronologis, dan trace melacak perjalanan request transaksi.",
    },
    {
      id: "obs-ex-2",
      prompt: "Teknologi pengumpul data terpadu di Elastic yang dikelola secara terpusat oleh Fleet disebut…",
      options: ["Filebeat", "Metricbeat", "Elastic Agent", "Logstash"],
      answerIndex: 2,
      explanation:
        "Elastic Agent menyatukan seluruh fungsionalitas pengumpulan data observabilitas dan keamanan dalam satu agen tunggal terpusat.",
    },
    {
      id: "obs-ex-3",
      prompt: "Mengapa Filebeat tidak akan mengirimkan data log yang sama dua kali jika layanannya direstart?",
      options: [
        "Karena Elasticsearch otomatis menolak data duplikat",
        "Karena Filebeat menyimpan posisi penunjuk baca terakhir di file registry lokal",
        "Karena file log otomatis dihapus oleh sistem",
        "Karena Filebeat menggunakan JVM cache"
      ],
      answerIndex: 1,
      explanation:
        "Registry Filebeat mencatat offset pembacaan file secara persisten di disk lokal agen.",
    },
    {
      id: "obs-ex-4",
      prompt: "Processor ingest pipeline manakah yang paling cocok digunakan untuk mengekstrak string log tidak terstruktur menggunakan pola regular expression?",
      options: ["dissect", "grok", "date", "remove"],
      answerIndex: 1,
      explanation:
        "Grok adalah processor berbasis ekspresi reguler (regex) yang dirancang untuk mem-parsing teks tidak teratur menjadi data terstruktur.",
    },
    {
      id: "obs-ex-5",
      prompt: "Di dalam pemantauan APM, apa arti dari satu Transaction?",
      options: [
        "Satu kueri database SQL tunggal",
        "Unit aktivitas tingkat tinggi yang diukur, seperti penanganan request masuk pada route API",
        "Proses transfer file log",
        "Penskalaan horizontal klaster"
      ],
      answerIndex: 1,
      explanation:
        "Transaction mengukur pintu masuk request dan total durasi penanganannya, sedangkan detail di dalamnya diukur sebagai Spans.",
    },
    {
      id: "obs-ex-6",
      prompt: "Apakah fungsi utama dari pengenal unik 'trace.id' pada distributed tracing?",
      options: [
        "Menghitung jumlah total server",
        "Mengaitkan dan merangkai seluruh transaksi serta span yang terjadi di berbagai mikroservis berbeda untuk satu request yang sama",
        "Mengenkripsi koneksi HTTP",
        "Menentukan kebijakan rollover ILM"
      ],
      answerIndex: 1,
      explanation:
        "Trace ID melacak aliran request lintas jaringan, menyatukan korelasi span menjadi diagram waterfall tunggal di Kibana APM.",
    },
    {
      id: "obs-ex-7",
      prompt: "Fase ILM manakah yang digunakan untuk mengamankan data tetapi mengubah indeks menjadi read-only dan menjalankan optimasi Force Merge?",
      options: [
        "Hot Phase",
        "Warm Phase",
        "Cold Phase",
        "Delete Phase"
      ],
      answerIndex: 1,
      explanation:
        "Pada fase Warm, indeks dikunci dari penulisan baru (read-only) dan dioptimalkan melalui Force Merge untuk efisiensi RAM disk.",
    },
    {
      id: "obs-ex-8",
      prompt: "Dalam arsitektur data tiers, tier manakah yang murni mengandalkan Searchable Snapshots tanpa memerlukan alokasi SSD penyimpanan sekunder lokal?",
      options: [
        "Hot Tier",
        "Warm Tier",
        "Cold Tier",
        "Frozen Tier"
      ],
      answerIndex: 3,
      explanation:
        "Frozen data tier menggunakan Searchable Snapshots penuh di atas Object Storage eksternal, menghilangkan kebutuhan disk lokal untuk penghematan maksimal.",
    },
    {
      id: "obs-ex-9",
      prompt: "Manakah sintaks KQL yang benar untuk mencari log dengan status HTTP di bawah 400 (sukses) tetapi berasal dari microservice 'checkout'?",
      options: [
        "service.name : checkout and http.response.status_code < 400",
        "service.name = checkout && status < 400",
        "SELECT WHERE service is checkout AND status < 400",
        "checkout-service status_code_less_400"
      ],
      answerIndex: 0,
      explanation:
        "KQL menggunakan logika 'and' huruf kecil dan perbandingan matematika langsung untuk menyaring data secara presisi.",
    },
    {
      id: "obs-ex-10",
      prompt: "Visualisasi Kibana Lens manakah yang paling sesuai untuk membandingkan porsi persentase distribusi error log berdasarkan sistem operasi?",
      options: [
        "Line chart",
        "Pie chart (diagram lingkaran)",
        "Metric",
        "Gauge"
      ],
      answerIndex: 1,
      explanation:
        "Pie Chart (atau donut chart) ideal untuk memvisualisasikan proporsi perbandingan kontribusi kategori terhadap total keseluruhan data.",
    },
    {
      id: "obs-ex-11",
      prompt: "Apakah fungsi dari fitur 'Real User Monitoring' (RUM) di APM?",
      options: [
        "Mendeteksi performa kueri SQL",
        "Mengukur performa aplikasi langsung dari sisi browser pengguna asli (frontend page load time)",
        "Memantau ketersediaan port TCP",
        "Menganalisis file log OS"
      ],
      answerIndex: 1,
      explanation:
        "RUM melacak latensi sisi klien, memvisualisasikan waktu loading halaman web dari browser riil pengguna.",
    },
    {
      id: "obs-ex-12",
      prompt: "Bagaimanakah cara kerja monitor Heartbeat bertipe 'HTTP'?",
      options: [
        "Mengirim paket ICMP ping ke mesin host",
        "Melakukan request HTTP(S) ke URL tertentu secara berkala dan memvalidasi respons status code-nya",
        "Merekam aktivitas transaksi database",
        "Mendeteksi perubahan mapping indeks"
      ],
      answerIndex: 1,
      explanation:
        "HTTP monitor di Heartbeat memeriksa ketersediaan endpoint web API secara terjadwal untuk memantau status uptime.",
    },
    {
      id: "obs-ex-13",
      prompt: "Apakah yang dimaksud dengan SLI (Service Level Indicator) dalam praktik SRE?",
      options: [
        "Target batas toleransi legal",
        "Pengukuran kuantitatif kepatuhan kinerja layanan secara real-time (seperti tingkat keberhasilan request HTTP)",
        "Nama database Elasticsearch",
        "Visualisasi diagram radar"
      ],
      answerIndex: 1,
      explanation:
        "SLI adalah metrik kuantitatif aktual yang diukur langsung untuk menilai kesehatan layanan (misal, 99.5% request sukses).",
    },
    {
      id: "obs-ex-14",
      prompt: "Fungsi apa di Kibana Lens yang digunakan untuk menghitung matematika kustom di atas hasil agregasi seperti rasio error rate?",
      options: [
        "Formula",
        "Ingest Node",
        "Script processor",
        "Grok parser"
      ],
      answerIndex: 0,
      explanation:
        "Kibana Lens Formula membebaskan pengguna menulis kalkulasi kustom (seperti pembagian atau persentase) langsung di atas diagram.",
    },
    {
      id: "obs-ex-15",
      prompt: "Bagaimanakah cara menerapkan filter global dinamis di seluruh dashboard tanpa mengetik manual di kolom KQL?",
      options: [
        "With a Kibana restart",
        "Mengklik irisan atau elemen visual representative pada diagram yang ada di dasbor",
        "Menghapus salah satu indeks",
        "Mengubah zona waktu"
      ],
      answerIndex: 1,
      explanation:
        "Interaktivitas dasbor menterjemahkan klik elemen visual (seperti kolom chart) langsung menjadi filter global aktif.",
    },
    {
      id: "obs-ex-16",
      prompt: "Apakah keuntungan utama menggunakan Data Stream untuk data observabilitas?",
      options: [
        "Menghilangkan kebutuhan akan RAM",
        "Menyediakan satu endpoint penulisan append-only yang mengotomasi pembagian backing index di bawahnya",
        "Mengurangi kompleksitas sintaks HTML",
        "Meningkatkan resolusi layar dasbor"
      ],
      answerIndex: 1,
      explanation:
        "Data Stream mengelola siklus hidup data deret waktu yang masif secara transparan di belakang satu nama alias tunggal.",
    },
    {
      id: "obs-ex-17",
      prompt: "Layanan manakah di Kubernetes yang memfasilitasi penarikan metrik detail container oleh Elastic Agent?",
      options: [
        "kube-state-metrics",
        "Docker daemon",
        "CoreDNS",
        "etcd"
      ],
      answerIndex: 0,
      explanation:
        "kube-state-metrics mendengarkan Kubernetes API Server dan menyajikan metrik status objek Kubernetes untuk dikoleksi agen.",
    },
    {
      id: "obs-ex-18",
      prompt: "Jika query agregasi sangat besar diprediksi akan merusak memori heap JVM, Elasticsearch melindunginya menggunakan…",
      options: [
        "Index Lifecycle Management",
        "Circuit Breakers (Sirkuit Pemutus)",
        "Ingest Pipeline",
        "Beats Registry"
      ],
      answerIndex: 1,
      explanation:
        "Circuit Breakers mengintersepsi alokasi memori query sebelum dieksekusi penuh, membatalkannya jika melampaui ambang batas demi kestabilan klaster.",
    },
  ],
};
