import type { Track } from "../types";

export const detectionTrack: Track = {
  id: "track-detection",
  slug: "detection",
  name: "Elastic Security for SIEM",
  tagline: "Bangun deteksi ancaman, investigasi alert, dan lakukan threat hunting.",
  description:
    "Jalur belajar mandiri ini dirancang secara komprehensif mengikuti silabus resmi ujian sertifikasi Elastic Certified Detection Engineer serta kurikulum terbaru Elastic Security for SIEM. Anda akan mempelajari arsitektur dasar Elastic Stack, konfigurasi Elastic Defend, pemetaan Elastic Common Schema (ECS), taktik pencarian KQL/Lucene, pembuatan deteksi rules, triase dan investigasi alert, analisis garis waktu (Timeline), hingga fitur mutakhir seperti Attack Discovery dan AI Assistant for Security.",
  audience: "Soc Analysts, Blue Teamers, Security Engineers, dan profesional keamanan siber yang ingin menguasai platform Elastic Security.",
  color: "rose",
  icon: "shield",
  examInfo: { questionCount: 18, durationMinutes: 180, passingScore: 70 },
  modules: [
    {
      slug: "getting-started-elastic-stack-overview",
      title: "Getting Started Elastic Stack Overview",
      level: "Dasar",
      durationMinutes: 20,
      intro: "Mempelajari arsitektur dasar dari komponen-komponen Elastic Stack yang bekerja sama untuk memusatkan, mencari, dan mengamankan telemetri log sistem.",
      sections: [
        {
          heading: "Arsitektur Elastic Stack Keamanan",
          paragraphs: [
            "Elastic Stack terdiri dari beberapa komponen utama yang memegang peranan krusial bagi analis keamanan siber. Elasticsearch bertindak sebagai repositori penyimpanan yang memproses pencarian secara sangat cepat; Kibana menyediakan portal visualisasi (SIEM console); sedangkan Beats dan Elastic Agent bertindak sebagai pengumpul (shippers) data log dari host komputer, jaringan, dan lingkungan cloud.",
            "Dalam operasional SOC (Security Operations Center), koordinasi real-time dari komponen-komponen ini memungkinkan pencatatan aktivitas mencurigakan dari ribuan endpoint dapat dikorelasikan dalam hitungan detik setelah peristiwa itu terjadi."
          ]
        },
        {
          heading: "Aliran Data Keamanan (Data Pipeline Flow)",
          paragraphs: [
            "Log mentah dari server dikirim ke Elasticsearch, bisa secara langsung melalui Elastic Agent, atau dilewatkan ke Logstash jika memerlukan penanganan transformasi rumit tingkat lanjut. Elasticsearch akan melakukan indexing dan klasifikasi data sehingga Kibana Security App dapat langsung mendeteksi kecocokan ancaman secara asinkronus."
          ],
          codeExample: {
            title: "Memeriksa Status Konektivitas Cluster Keamanan",
            lang: "json",
            code: `GET /_cluster/health?pretty`
          }
        }
      ],
      keyPoints: [
        "Elasticsearch bertindak sebagai mesin pencari dan penyimpanan data log utama.",
        "Kibana menyediakan antarmuka terpusat bagi analis untuk mengelola kueri, alert, dan investigasi.",
        "Elastic Agent/Beats bertugas mengoleksi log dari server dan melapor ke pusat.",
        "Logstash memfasilitasi normalisasi data sebelum masuk ke Elasticsearch."
      ],
      quiz: [
        {
          id: "det-m1-q1",
          prompt: "Komponen manakah di dalam Elastic Stack yang berfungsi sebagai mesin pencari dan penyimpanan log utama?",
          options: ["Kibana", "Elasticsearch", "Logstash", "Elastic Agent"],
          answerIndex: 1,
          explanation: "Elasticsearch adalah basis data terdistribusi yang menjadi mesin pencari dan penyimpanan utama untuk seluruh dokumen log yang masuk."
        },
        {
          id: "det-m1-q2",
          prompt: "Di manakah analis SOC berinteraksi secara visual untuk memantau alert, melacak ancaman, dan mengelola investigasi kasus?",
          options: ["Elasticsearch", "Logstash", "Kibana Security App", "Beats registry"],
          answerIndex: 2,
          explanation: "Kibana Security App menyediakan UI konsol SIEM terpadu bagi analis untuk memantau dan memproses seluruh data keamanan."
        },
        {
          id: "det-m1-q3",
          prompt: "Komponen manakah yang dipasang langsung pada server target (endpoint) untuk mengirimkan data log keamanan ke Elasticsearch?",
          options: ["Kibana", "Logstash", "Elastic Agent (atau Beats)", "Elasticsearch core"],
          answerIndex: 2,
          explanation: "Elastic Agent dan Beats dipasang langsung di host komputer sebagai agen ringan pengirim data (shippers)."
        },
        {
          id: "det-m1-q4",
          prompt: "Dalam kondisi apa kita sebaiknya meletakkan Logstash di dalam pipeline aliran data keamanan?",
          options: [
            "Ketika ingin menampilkan visualisasi diagram lingkaran di dasbor",
            "Ketika membutuhkan parsing, transformasi, dan routing data yang kompleks dari banyak sumber sebelum dimasukkan ke Elasticsearch",
            "Ketika ingin mengisolasi malware di endpoint",
            "Ketika ingin mempercepat refresh rate halaman browser"
          ],
          answerIndex: 1,
          explanation: "Logstash sangat andal dalam melakukan manipulasi, filter, pengubahan format, dan routing data dari beragam sumber sebelum diserahkan ke Elasticsearch."
        }
      ]
    },
    {
      slug: "elastic-defend-configuration",
      title: "Elastic Defend Configuration",
      level: "Dasar",
      durationMinutes: 20,
      intro: "Mempelajari konfigurasi Elastic Defend untuk mengamankan host/endpoint dari serangan malware, ransomware, serta mencatat telemetri aktivitas proses secara rinci.",
      sections: [
        {
          heading: "Integrasi Proteksi Endpoint (Elastic Defend)",
          paragraphs: [
            "Elastic Defend (sebelumnya Elastic Endpoint Security) adalah integrasi yang dipasang di atas Elastic Agent untuk melindung sistem operasi Windows, macOS, dan Linux.",
            "Defend bertindak sebagai solusi EDR (Endpoint Detection and Response) yang mendeteksi ancaman secara lokal (signature-based, behavior-based, heuristic) serta merekam aktivitas proses (process execution), manipulasi file, penulisan registry Windows, dan koneksi socket jaringan."
          ]
        },
        {
          heading: "Mengonfigurasi Aturan Proteksi",
          paragraphs: [
            "Analis dapat mengatur mode kerja Elastic Defend lewat Fleet Agent Policy:",
            "- **Malware Protection**: Memilih tindakan pencegahan (Prevent) atau hanya pencatatan (Detect).",
            "- **Ransomware Protection**: Mendeteksi dan memblokir aktivitas enkripsi file yang mencurigakan secara massal.",
            "- **Event Collection**: Menentukan peristiwa apa saja (proses, network, file, registry) yang ingin direkam dan dikirim ke SIEM."
          ],
          codeExample: {
            title: "Mencari Aktivitas Proses yang Direkam Elastic Defend",
            lang: "json",
            code: `GET /logs-endpoint.events.*/_search\n{\n  "query": {\n    "term": { "event.category": "process" }\n  }\n}`
          }
        }
      ],
      keyPoints: [
        "Elastic Defend adalah integrasi EDR (Endpoint Detection and Response) bawaan Elastic.",
        "Mendukung pencegahan aktif (Prevent) terhadap malware, ransomware, dan eksploitasi memori.",
        "Merekam aktivitas granular dari host (file, network, registry, dan proses).",
        "Kebijakan proteksi dikonfigurasi secara terpusat di Fleet."
      ],
      quiz: [
        {
          id: "det-m2-q1",
          prompt: "Apa kepanjangan dan kegunaan dari instrumen EDR yang disediakan oleh Elastic Defend?",
          options: [
            "Encryption Data Recovery - untuk membackup data",
            "Endpoint Detection and Response - untuk memantau, mendeteksi, dan merespons ancaman di host komputer",
            "Elastic Driver Router - untuk mengatur rute internet",
            "Event Diagnostic Repository - untuk mencatat bug Kibana"
          ],
          answerIndex: 1,
          explanation: "EDR (Endpoint Detection and Response) bertugas memantau aktivitas host secara real-time, mendeteksi kelakuan mencurigakan, dan memberikan opsi mitigasi respon isolasi."
        },
        {
          id: "det-m2-q2",
          prompt: "Manakah setelan konfigurasi di Elastic Defend yang memblokir eksekusi program berbahaya secara otomatis ketika malware terdeteksi?",
          options: [
            "Malware Protection Mode diset ke 'Prevent'",
            "Malware Protection Mode diset ke 'Detect'",
            "Mematikan Elastic Agent",
            "Menyetel CPU limit ke 0"
          ],
          answerIndex: 0,
          explanation: "Pilihan mode 'Prevent' menghentikan (block) eksekusi program berbahaya secara aktif, sedangkan mode 'Detect' hanya mencatat kejadian di log tanpa menghalangi proses."
        },
        {
          id: "det-m2-q3",
          prompt: "Selain mendeteksi malware, peristiwa sistem Windows manakah di bawah ini yang dapat direkam dan dikirim oleh Elastic Defend ke SIEM?",
          options: [
            "Perpindahan mouse pengguna",
            "Pembuatan proses, perubahan berkas file, modifikasi registry Windows, dan koneksi jaringan",
            "Suhu panas kipas prosesor",
            "Resolusi layar monitor"
          ],
          answerIndex: 1,
          explanation: "Elastic Defend merekam telemetri sistem penting seperti pembuatan proses, manipulasi file di disk, perubahan kunci registry Windows, dan aktivitas socket network."
        },
        {
          id: "det-m2-q4",
          prompt: "Di manakah lokasi konfigurasi kebijakan proteksi (policy) Elastic Defend diatur agar otomatis didistribusikan ke ribuan endpoint?",
          options: [
            "Langsung mengedit file konfigurasi di tiap laptop karyawan",
            "Di dasbor Fleet (Agent Policy) secara terpusat di Kibana",
            "Di dalam file registry Windows",
            "Di dalam bios komputer master"
          ],
          answerIndex: 1,
          explanation: "Fleet memungkinkan distribusi kebijakan proteksi agen secara instan dan terpusat melalui modifikasi Agent Policy di UI Kibana."
        }
      ]
    },
    {
      slug: "getting-started-elastic-common-schema-for-security-analysts",
      title: "Getting Started Elastic Common Schema for Security Analysts",
      level: "Dasar",
      durationMinutes: 20,
      intro: "Memahami Elastic Common Schema (ECS) dari sudut pandang analis keamanan siber untuk mempermudah pencarian korelasi multi-sumber data.",
      sections: [
        {
          heading: "Standardisasi ECS untuk SOC",
          paragraphs: [
            "Sebagai analis keamanan, Anda akan menerima data dari firewall Cisco, log Windows Event, endpoint Elastic Defend, dan proxy cloud. Masing-masing memiliki penamaan field yang berbeda.",
            "Elastic Common Schema (ECS) menyelaraskan data ini. Sebagai contoh, alamat IP asal penyerang akan selalu dipetakan ke field **`source.ip`**, dan nama program yang dieksekusi akan selalu dipetakan ke **`process.name`**."
          ]
        },
        {
          heading: "Kategori Field ECS yang Sering Digunakan",
          paragraphs: [
            "- **`event.*`**: Menyimpan status event (`event.outcome`, `event.category`, `event.action`).",
            "- **`process.*`**: Menyimpan detail proses (`process.pid`, `process.name`, `process.parent.name`, `process.args`).",
            "- **`source.*` / `destination.*`**: Menyimpan rincian jaringan (`source.ip`, `destination.port`).",
            "- **`user.*`**: Menyimpan informasi pengguna (`user.name`, `user.domain`)."
          ],
          codeExample: {
            title: "Mencari Upaya Autentikasi yang Gagal Menggunakan Field ECS",
            lang: "json",
            code: `GET /logs-*/_search\n{\n  "query": {\n    "bool": {\n      "filter": [\n        { "term": { "event.category": "authentication" } },\n        { "term": { "event.outcome": "failure" } }\n      ]\n    }\n  }\n}`
          }
        }
      ],
      keyPoints: [
        "ECS menstandardisasi skema data log demi kemudahan analisis multi-sumber.",
        "Sangat krusial untuk penulisan korelasi rule deteksi siber yang efektif.",
        "Memungkinkan analis SOC melakukan kueri yang sama untuk data dari vendor berbeda.",
        "Field dikelompokkan secara logis ke dalam objek (host, process, network, user)."
      ],
      quiz: [
        {
          id: "det-m3-q1",
          prompt: "Manakah field standar ECS yang digunakan untuk menyimpan alamat IP komputer asal yang memicu lalu lintas koneksi?",
          options: ["source_ip", "src_ip_addr", "source.ip", "ip.origin"],
          answerIndex: 2,
          explanation: "ECS menggunakan notasi titik (dot notation) dengan format standar objek 'source' diikuti variabel 'ip' (`source.ip`)."
        },
        {
          id: "det-m3-q2",
          prompt: "Mengapa standardisasi ECS sangat penting dalam penulisan Detection Rules di SIEM?",
          options: [
            "Agar data otomatis dikompresi di Elasticsearch",
            "Agar satu kueri rule deteksi dapat mendeteksi ancaman lintas data dari berbagai vendor yang berbeda secara universal",
            "Agar file log tidak bisa dihapus oleh hacker",
            "Agar kueri berjalan di memori browser"
          ],
          answerIndex: 1,
          explanation: "Dengan ECS, satu rule deteksi (misal mencari modifikasi pengguna) dapat bekerja sekaligus untuk log Windows, Linux, maupun Cloud karena semuanya menggunakan field 'user.name'."
        },
        {
          id: "det-m3-q3",
          prompt: "Di manakah nama program yang dieksekusi disimpan menurut konvensi ECS?",
          options: ["process.name", "program_name", "executable.file", "process_title"],
          answerIndex: 0,
          explanation: "Field `process.name` digunakan secara standar di ECS untuk merekam nama executable dari file biner yang berjalan."
        },
        {
          id: "det-m3-q4",
          prompt: "Apakah fungsi dari field `event.outcome` menurut spesifikasi ECS?",
          options: [
            "Menyimpan besaran byte transfer data",
            "Menyimpan hasil akhir kejadian (seperti 'success' atau 'failure')",
            "Menyimpan lokasi koordinat GPS server",
            "Menyimpan nama vendor hardware"
          ],
          answerIndex: 1,
          explanation: "Field `event.outcome` menstandardisasi hasil akhir dari suatu peristiwa, umumnya dinilai dengan 'success', 'failure', atau 'unknown'."
        }
      ]
    },
    {
      slug: "discover-getting-started-with-kibana",
      title: "Discover Getting started with Kibana",
      level: "Dasar",
      durationMinutes: 20,
      intro: "Mempelajari pemanfaatan antarmuka Discover di Kibana untuk menyortir dan melakukan triase cepat pada log-log keamanan siber.",
      sections: [
        {
          heading: "Investigasi Log di Discover",
          paragraphs: [
            "Aplikasi **Discover** di Kibana adalah alat detektif dasar bagi analis siber. Ketika menerima laporan adanya anomali aktivitas pada jam tertentu, analis dapat langsung mengarahkan rentang waktu di Discover ke jam tersebut.",
            "Gunakan visualisasi baris waktu (Histogram) untuk mendeteksi lonjakan log (spike) yang tidak biasa, yang sering kali menandakan adanya serangan Brute Force atau pemindaian port jaringan (port scanning)."
          ]
        },
        {
          heading: "Kustomisasi Kolom dan Eksplorasi JSON",
          paragraphs: [
            "Di Discover, Anda dapat memilah field penting dari daftar sebelah kiri dan menyematkannya sebagai kolom tabel. Ini sangat menolong daripada membaca satu baris log mentah yang panjang.",
            "Untuk melihat informasi teknis lengkap, analis dapat mengklik dokumen dan membuka tab JSON untuk menganalisis data asli dokumen tersebut."
          ],
          codeExample: {
            title: "Contoh Dokumen Log Event Keamanan Berformat JSON",
            lang: "json",
            code: `{\n  "@timestamp": "2026-08-07T10:15:30.000Z",\n  "event": {\n    "category": "process",\n    "action": "process_started"\n  },\n  "process": {\n    "name": "cmd.exe",\n    "parent": { "name": "explorer.exe" }\n  }\n}`
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
          id: "det-m4-q1",
          prompt: "Apakah langkah pertama yang harus dilakukan analis di Discover ketika ingin mencari log insiden yang terjadi 3 hari lalu?",
          options: [
            "Menghapus seluruh indeks",
            "Menyesuaikan rentang waktu (Time Picker) di pojok kanan atas ke periode 3 hari yang lalu",
            "Mengganti password akun Kibana",
            "Menulis skrip Python baru"
          ],
          answerIndex: 1,
          explanation: "Time Picker mengontrol jendela pencarian data di Elasticsearch. Analis harus menyetel jendela waktu yang sesuai agar log kejadian masa lalu ditampilkan."
        },
        {
          id: "det-m4-q2",
          prompt: "Bagaimana cara merampingkan tampilan daftar log di Discover agar hanya menampilkan kolom nama pengguna dan alamat IP saja?",
          options: [
            "Dengan mengedit data di database secara langsung",
            "Dengan menyematkan field 'user.name' and 'source.ip' dari daftar Available Fields ke dalam kolom tabel",
            "Dengan menonaktifkan Elasticsearch",
            "Dengan memperkecil ukuran huruf browser"
          ],
          answerIndex: 1,
          explanation: "Menambahkan field terpilih ke tabel kolom (Selected Fields) mengisolasi data tidak relevan, membiarkan analis fokus pada informasi penting."
        },
        {
          id: "det-m4-q3",
          prompt: "Apa yang diindikasikan oleh adanya lonjakan batang vertikal (spike) yang sangat tinggi secara mendadak pada histogram Discover?",
          options: [
            "Bahwa sistem database sedang mati",
            "Adanya anomali atau lonjakan volume log, yang sering kali merupakan tanda serangan siber aktif sedang berlangsung",
            "Bahwa browser sedang melambat",
            "Bahwa lisensi Kibana habis"
          ],
          answerIndex: 1,
          explanation: "Lonjakan volume log instan menunjukkan peningkatan drastis aktivitas sistem (seperti jutaan request kegagalan login atau scan port) yang patut diselidiki."
        },
        {
          id: "det-m4-q4",
          prompt: "Di Discover, tab manakah di detail dokumen yang menampilkan struktur asli log dalam bentuk objek bersarang (nested) secara lengkap?",
          options: [
            "Tab Table",
            "Tab JSON",
            "Tab Analytics",
            "Tab Alerts"
          ],
          answerIndex: 1,
          explanation: "Tab JSON menampilkan objek JSON terindeks orisinal tanpa modifikasi, membolehkan analis memeriksa detail field tersembunyi."
        }
      ]
    },
    {
      slug: "searching-with-kibana-query-language-and-lucene",
      title: "Searching with Kibana Query Language and Lucene",
      level: "Dasar",
      durationMinutes: 20,
      intro: "Menguasai pencarian log keamanan siber menggunakan KQL dan beralih ke sintaks mesin pencari Lucene untuk kueri tingkat lanjut.",
      sections: [
        {
          heading: "KQL untuk Threat Hunting",
          paragraphs: [
            "KQL (Kibana Query Language) adalah bahasa kueri default di Kibana. Kelebihannya adalah dukungan auto-complete yang mengenali nama field dan menyarankan nilai pencarian.",
            "Untuk pencarian keamanan, analis sering menggabungkan kriteria logika seperti `and`, `or`, dan `not`."
          ]
        },
        {
          heading: "Beralih ke Sintaks Lucene",
          paragraphs: [
            "KQL sangat bagus untuk kueri dasar, namun terkadang analis membutuhkan kueri regex kompleks, kueri kedekatan kata, atau kueri khusus yang hanya didukung oleh sintaks Lucene tradisional.",
            "Sintaks Lucene dapat diaktifkan dengan mengklik tombol KQL di bar pencarian dan menonaktifkan fitur KQL."
          ],
          codeExample: {
            title: "Pencarian Menggunakan Regular Expression di Lucene",
            lang: "yaml",
            code: `process.name:/powershell.*/\n# Lucene mendukung pencarian regex langsung menggunakan tanda garis miring (/)`
          }
        }
      ],
      keyPoints: [
        "KQL menawarkan pencarian log intuitif dengan fitur auto-complete cerdas.",
        "KQL menggunakan logika standard: and, or, not, dan wildcard (*).",
        "Sintaks Lucene menyediakan kemampuan kueri regex langsung di kolom pencarian.",
        "Mampu menggunakan pencarian bersarang (nested grouping) di KQL."
      ],
      quiz: [
        {
          id: "det-m5-q1",
          prompt: "Manakah kueri KQL yang digunakan untuk mencari proses svchost.exe yang dijalankan bukan oleh SYSTEM (user administrator standar Windows)?",
          options: [
            "process.name : \"svchost.exe\" or not user.name : \"SYSTEM\"",
            "process.name : \"svchost.exe\" and not user.name : \"SYSTEM\"",
            "process.name = \"svchost.exe\" && user.name != \"SYSTEM\"",
            "SELECT WHERE process.name IS \"svchost.exe\" AND user.name NOT SYSTEM"
          ],
          answerIndex: 1,
          explanation: "Kueri KQL menggabungkan kondisi kesetaraan `:` dengan logika `and` serta penolakan `not` untuk memfilter data secara presisi."
        },
        {
          id: "det-m5-q2",
          prompt: "Bagaimana cara melakukan pencarian sebagian kata (wildcard) di KQL untuk mendeteksi semua proses yang berakhiran dengan kata 'host'?",
          options: [
            "process.name : host?",
            "process.name : *host",
            "process.name : %host",
            "process.name : [host]"
          ],
          answerIndex: 1,
          explanation: "Tanda bintang (*) bertindak sebagai wildcard di KQL untuk merepresentasikan karakter acak sebelum atau setelah kata kunci pencarian."
        },
        {
          id: "det-m5-q3",
          prompt: "Fitur kenyamanan apa di bar pencarian KQL yang membantu analis melengkapi pengetikan nama field secara otomatis?",
          options: [
            "Auto-save",
            "Auto-complete (saran kueri)",
            "Auto-correct",
            "Kibana Translate"
          ],
          answerIndex: 1,
          explanation: "Auto-complete di KQL membaca mapping indeks secara real-time untuk memberikan usulan field dan nilai yang tersedia saat analis mulai mengetik."
        },
        {
          id: "det-m5-q4",
          prompt: "Manakah sintaks Lucene yang digunakan untuk mencari dokumen di mana field 'process.name' berisi kata yang mirip dengan pola ekspresi reguler tertentu?",
          options: [
            "process.name : regex(.*)",
            "process.name:/[a-z]+.exe/",
            "process.name = regex",
            "process.name == /.*.exe/"
          ],
          answerIndex: 1,
          explanation: "Sintaks Lucene mendukung ekspresi reguler langsung dengan mengapit pola di dalam tanda garis miring (/.../)."
        }
      ]
    },
    {
      slug: "aggregation-based-visualizations",
      title: "Aggregation Based Visualizations",
      level: "Menengah",
      durationMinutes: 20,
      intro: "Mempelajari perancangan visualisasi berbasis agregasi di Kibana untuk merepresentasikan metrik keamanan siber secara ringkas.",
      sections: [
        {
          heading: "Konsep Agregasi untuk Analisis Keamanan",
          paragraphs: [
            "Agregasi adalah proses merangkum sekumpulan besar data log menjadi data statistik ringkas (seperti jumlah total, rata-rata, pengelompokan terms).",
            "Dalam operasional keamanan, visualisasi berbasis agregasi sangat vital untuk menjawab pertanyaan seperti: 'IP manakah yang paling banyak melakukan koneksi ke luar jaringan?' atau 'Pukul berapa percobaan login gagal paling banyak terjadi?'."
          ]
        },
        {
          heading: "Penerapan Bucket Terms Aggregation",
          paragraphs: [
            "Bucket Aggregations seperti 'terms' membagi dokumen ke dalam ember-ember unik berdasarkan nilai field keyword (misal mengelompokkan log berdasarkan `user.name`).",
            "Setiap ember menyimpan data 'doc_count' yang merepresentasikan seberapa sering user tersebut beraktivitas. Analis SOC dapat mengidentifikasi anomali volume dengan mengurutkan data dari nilai tertinggi."
          ],
          codeExample: {
            title: "Mencari 5 Pengguna Paling Aktif Melalui Kueri Agregasi",
            lang: "json",
            code: `GET /logs-*/_search\n{\n  "size": 0,\n  "aggs": {\n    "top_users": {\n      "terms": {\n        "field": "user.name.keyword",\n        "size": 5\n      }\n    }\n  }\n}`
          }
        }
      ],
      keyPoints: [
        "Agregasi meringkas jutaan log mentah menjadi bagan statistik yang terbaca.",
        "Terms aggregation berfungsi mirip dengan 'GROUP BY' untuk mengelompokkan data berdasarkan nilai unik field.",
        "Metric aggregation (seperti sum, avg, cardinality) mengalkulasi nilai numerik di dalam bucket.",
        "Sangat menolong mendeteksi serangan pemindaian (scanning) atau brute-force."
      ],
      quiz: [
        {
          id: "det-m6-q1",
          prompt: "Agregasi jenis apakah yang digunakan untuk mengelompokkan dokumen log berdasarkan nilai unik pada field 'destination.port'?",
          options: [
            "Metric aggregation",
            "Bucket (Terms) aggregation",
            "Pipeline aggregation",
            "Matrix aggregation"
          ],
          answerIndex: 1,
          explanation: "Terms aggregation mengelompokkan dokumen ke dalam ember-ember (buckets) unik sesuai nilai eksklusif yang terdeteksi pada field."
        },
        {
          id: "det-m6-q2",
          prompt: "Bila Anda ingin menghitung jumlah server unik (unik host.name) yang aktif melapor di klaster, metrik agregasi manakah yang paling tepat?",
          options: [
            "sum",
            "avg",
            "cardinality",
            "max"
          ],
          answerIndex: 2,
          explanation: "Agregasi cardinality menghitung estimasi jumlah nilai yang berbeda secara unik (distinct values) di dalam data."
        },
        {
          id: "det-m6-q3",
          prompt: "Mengapa field bertipe 'text' (bukan 'keyword') ditolak saat diproses di dalam terms aggregation di Elasticsearch?",
          options: [
            "Karena teks otomatis dienkripsi",
            "Karena field text dipecah menjadi banyak token terpisah oleh analyzer, membuat perhitungan terms menjadi tidak akurat dan boros memori",
            "Karena file text tidak memiliki timestamp",
            "Karena aturan lisensi Kibana"
          ],
          answerIndex: 1,
          explanation: "Field bertipe text dirancang untuk pencarian teks penuh, bukan korelasi atau pengelompokan persis. Agregasi terms wajib menggunakan field bertipe keyword."
        },
        {
          id: "det-m6-q4",
          prompt: "Apakah fungsi dari parameter 'size' di dalam konfigurasi terms aggregation?",
          options: [
            "Membatasi memori RAM",
            "Membatasi jumlah ember (buckets) teratas yang dikembalikan di hasil respon",
            "Mengubah ukuran pixel diagram",
            "Menghapus dokumen lama"
          ],
          answerIndex: 1,
          explanation: "Parameter 'size' menentukan berapa banyak kelompok nilai unik teratas (berdasarkan jumlah dokumen terbanyak) yang ingin ditampilkan."
        }
      ]
    },
    {
      slug: "visualizing-data-with-elastic-for-security-analysts",
      title: "Visualizing data with Elastic for security analysts",
      level: "Menengah",
      durationMinutes: 20,
      intro: "Mempelajari cara mendesain bagan keamanan siber secara dinamis menggunakan Kibana Lens, peta (Maps), dan visualisasi deret waktu.",
      sections: [
        {
          heading: "Kompilasi Visualisasi Keamanan",
          paragraphs: [
            "Sebagai analis keamanan, memiliki kemampuan menyusun visualisasi data siber adalah nilai tambah yang besar. Di Kibana Lens, Anda cukup memilih index data siber Anda, lalu menyeret field-field penting ke layar.",
            "Tipe visualisasi siber populer:",
            "- **Line Chart**: Tren aktivitas lalu lintas data jaringan harian.",
            "- **Bar Chart**: Distribusi aktivitas alert berdasarkan rule siber.",
            "- **Donut Chart**: Porsi perbandingan status kegagalan autentikasi."
          ]
        },
        {
          heading: "Peta Geografis Keamanan (Kibana Maps)",
          paragraphs: [
            "Kibana Maps membolehkan analis melacak lokasi geografis IP penyerang secara langsung di atas peta dunia menggunakan data geo-IP yang disisipkan oleh Ingest Node.",
            "Analis dapat melihat garis rute transfer data (network logs) yang menghubungkan titik koordinat asal (source.geo.location) dan tujuan (destination.geo.location)."
          ]
        }
      ],
      keyPoints: [
        "Kibana Lens mempercepat pembuatan bagan dengan drag-and-drop.",
        "Peta Kibana Maps memetakan asal-usul serangan siber secara geografis di peta dunia.",
        "Visualisasi mempermudah tim SOC mempresentasikan kondisi keamanan perusahaan kepada manajemen.",
        "Formula matematika membantu mengalkulasi rasio metrik keamanan."
      ],
      quiz: [
        {
          id: "det-m7-q1",
          prompt: "Tipe visualisasi di Kibana Maps manakah yang menggambarkan kepadatan konsentrasi serangan siber geografis dalam bentuk warna gradasi panas?",
          options: [
            "Vector map",
            "Heat map (peta panas)",
            "Point map",
            "Line map"
          ],
          answerIndex: 1,
          explanation: "Peta panas (Heat map) memetakan area geografis dengan kepadatan aktivitas log terbanyak menjadi warna gradasi merah/kuning pekat."
        },
        {
          id: "det-m7-q2",
          prompt: "Field koordinat jenis apakah yang wajib ada di log jaringan agar lokasinya dapat dipasang di Kibana Maps?",
          options: [
            "ip",
            "geo_point",
            "text",
            "keyword"
          ],
          answerIndex: 1,
          explanation: "Kibana Maps memerlukan field bertipe geo_point (yang menyimpan lintang dan bujur secara numerik) agar titik koordinatnya dapat dirender di peta."
        },
        {
          id: "det-m7-q3",
          prompt: "Bagaimana cara kita membandingkan tren peningkatan kegagalan login minggu ini dibandingkan minggu lalu secara berdampingan di Kibana Lens?",
          options: [
            "Membuat dua klaster terpisah",
            "Menggunakan fitur 'Time shift' (pergeseran waktu) pada konfigurasi seri data di Lens",
            "Menghapus filter waktu harian",
            "Menjalankan reindex"
          ],
          answerIndex: 1,
          explanation: "Fitur 'Time shift' membolehkan perbandingan seri data saat ini dengan periode historis masa lalu pada satu bagan waktu yang sama."
        },
        {
          id: "det-m7-q4",
          prompt: "Manakah ekspresi formula di Kibana Lens yang digunakan untuk menghitung tingkat persentase kegagalan transaksi HTTP?",
          options: [
            "count() * 100",
            "kql_value(\"http.response.status_code >= 400\") / count()",
            "http.response.status_code / 100",
            "sum(http.response.status_code)"
          ],
          answerIndex: 1,
          explanation: "Formula kql_value mengisolasi jumlah dokumen spesifik (kegagalan status code) lalu dibagi total dokumen keseluruhan (`count()`) untuk menghasilkan nilai rasio kegagalan."
        }
      ]
    },
    {
      slug: "intro-to-elastic-security",
      title: "Intro to Elastic Security",
      level: "Dasar",
      durationMinutes: 20,
      intro: "Mengenal ekosistem Elastic Security (SIEM), antarmuka khususnya, serta filosofi deteksi ancaman terintegrasi.",
      sections: [
        {
          heading: "Transformasi Menuju SIEM Modern",
          paragraphs: [
            "Elastic Security menyatukan kemampuan pencegahan (Prevention), deteksi (Detection), dan respons (Response) dalam satu aplikasi tunggal di Kibana.",
            "Fitur utama Elastic Security meliputi:",
            "- **Overview Dashboard**: Tampilan global ketersediaan log, status alert, dan mitigasi ancaman.",
            "- **Detection Engine**: Mengeksekusi aturan deteksi secara berkala.",
            "- **Threat Intelligence**: Integrasi pakan intelijen siber pihak ketiga.",
            "- **Cases Management**: Penanganan insiden kolaboratif."
          ]
        },
        {
          heading: "Integrasi Keamanan Nirbatas",
          paragraphs: [
            "Berbeda dengan SIEM tradisional yang mahal dan membatasi data masuk, arsitektur Elastic Security membebaskan Anda mengumpulkan log sebanyak mungkin karena skema indexing-nya sangat efisien dan performanya stabil."
          ]
        }
      ],
      keyPoints: [
        "Elastic Security mengintegrasikan SIEM, Endpoint Security, dan Cloud Security.",
        "Dasbor Overview memfasilitasi monitoring global status keamanan klaster.",
        "Pencatatan siber dan manajemen kasus dilakukan secara terpusat.",
        "Mendukung investigasi asinkronus yang cepat."
      ],
      quiz: [
        {
          id: "det-m8-q1",
          prompt: "Manakah di bawah ini yang merupakan tiga pilar kapabilitas utama dari ekosistem Elastic Security?",
          options: [
            "Database, compiler, dan browser",
            "SIEM, Endpoint Security, dan Cloud Security",
            "Logstash, Beats, dan APM",
            "Virtualisasi, enkripsi, dan backup"
          ],
          answerIndex: 1,
          explanation: "Elastic Security modern mengintegrasikan sistem SIEM (keamanan informasi), perlindungan endpoint (antivirus/EDR), serta pemantauan postur keamanan cloud (CSPM)."
        },
        {
          id: "det-m8-q2",
          prompt: "Layar manakah di Elastic Security App yang memberikan rangkuman visual global status seluruh log yang mengalir masuk serta jumlah alert siber aktif?",
          options: [
            "Timeline App",
            "Overview Dashboard",
            "Dev Tools",
            "Stack Management"
          ],
          answerIndex: 1,
          explanation: "Halaman Overview Dashboard menyajikan infografis instan mengenai kondisi kesehatan keamanan siber klaster secara makro."
        },
        {
          id: "det-m8-q3",
          prompt: "Mengapa integrasi data threat intelligence (pakan ancaman) sangat disukai di platform SIEM?",
          options: [
            "Because it compresses file size on disk",
            "Karena menyediakan basis data reputasi IP/domain/hash malware berbahaya yang didapat dari intelijen siber global untuk mencocokkan aktivitas mencurigakan secara otomatis",
            "Karena menonaktifkan update Windows otomatis",
            "Karena mengubah warna dasbor"
          ],
          answerIndex: 1,
          explanation: "Threat Intelligence menyuntikkan daftar indikator kompromi (IoC) berbahaya yang up-to-date untuk mendeteksi apabila ada server internal yang berkomunikasi dengan IP penjahat."
        },
        {
          id: "det-m8-q4",
          prompt: "Komponen siber apakah di Elastic Security yang digunakan untuk melacak koordinasi pengerjaan investigasi insiden siber secara kolaboratif dalam tim SOC?",
          options: [
            "Beats",
            "Cases (Kasus)",
            "Ingest pipeline",
            "Drizzle"
          ],
          answerIndex: 1,
          explanation: "Kasus (Cases) adalah sistem ticketing bawaan di Elastic Security yang membantu koordinasi analis SOC untuk mencatat, menetapkan tugas, dan merangkum temuan penanganan insiden."
        }
      ]
    },
    {
      slug: "explore-hosts-network-and-users-in-elastic-security",
      title: "Explore Hosts, Network, and Users in Elastic Security",
      level: "Dasar",
      durationMinutes: 20,
      intro: "Belajar menginvestigasi aktivitas mencurigakan dengan berfokus pada analisis entitas host, jaringan, dan kelakuan pengguna di SIEM.",
      sections: [
        {
          heading: "Analisis Entitas Host dan Pengguna",
          paragraphs: [
            "Halaman **Hosts** di Elastic Security menyajikan daftar server Anda, tingkat keberhasilan login, aktivitas autentikasi janggal, serta daftar program proses unik yang dijalankan.",
            "Halaman **Users** memetakan aktivitas spesifik pengguna, memudahkan pelacakan jika ada akun administrator (SYSTEM/root) yang tiba-tiba aktif melakukan login di luar jam kerja (anomali waktu)."
          ]
        },
        {
          heading: "Analisis Aktivitas Jaringan",
          paragraphs: [
            "Halaman **Network** merekam jejak transaksi data jaringan. Analis dapat melihat statistik DNS query (misal mencari kueri subdomain acak yang menandakan teknik DNS Tunneling) serta lalu lintas koneksi IP keluar/masuk klaster."
          ],
          codeExample: {
            title: "Mencari Aktivitas Koneksi Jaringan Keluar ke Port Tidak Biasa",
            lang: "json",
            code: `GET /logs-network.*/_search\n{\n  "query": {\n    "bool": {\n      "filter": [\n        { "term": { "network.direction": "egress" } },\n        { "range": { "destination.port": { "gt": 1024 } } }\n      ]\n    }\n  }\n}`
          }
        }
      ],
      keyPoints: [
        "SIEM menyediakan modul analisis khusus berdasarkan entitas (Hosts, Network, Users).",
        "Hosts memantau aktivitas proses dan kegagalan login per mesin.",
        "Users memonitor perilaku login mencurigakan dari akun pengguna.",
        "Network merekam data DNS, HTTP request, dan lalu lintas port mencurigakan."
      ],
      quiz: [
        {
          id: "det-m9-q1",
          prompt: "Layar manakah di Elastic Security yang fokus menampilkan metrik autentikasi sukses/gagal, jumlah proses berjalan, dan daftar server aktif melapor?",
          options: [
            "Network View",
            "Hosts View",
            "Kibana Lens",
            "Fleet Server"
          ],
          answerIndex: 1,
          explanation: "Hosts View mengumpulkan seluruh telemetri operasional dan keamanan dari perspektif infrastruktur server fisik maupun virtual."
        },
        {
          id: "det-m9-q2",
          prompt: "Mengapa tim SOC perlu mencurigai aktivitas kueri DNS yang berukuran sangat panjang dengan pola subdomain acak (misal: 'a7b8c9.malicious.com')?",
          options: [
            "Karena domain tersebut gratis",
            "Karena merupakan pola umum dari teknik DNS Tunneling yang digunakan penyerang untuk menyelundupkan data (data exfiltration) melewati protokol port DNS 53",
            "Karena domain tersebut milik Microsoft",
            "Karena kueri DNS tersebut salah ketik"
          ],
          answerIndex: 1,
          explanation: "DNS Tunneling menyalahgunakan protokol DNS untuk membangun terowongan komunikasi rahasia, mengirimkan data terenkripsi dalam format subdomain DNS untuk menghindari firewall."
        },
        {
          id: "det-m9-q3",
          prompt: "Field ECS manakah yang digunakan untuk mengklasifikasikan arah lalu lintas koneksi jaringan (seperti koneksi keluar/egress atau masuk/ingress)?",
          options: [
            "network.type",
            "network.direction",
            "flow.origin",
            "egress.status"
          ],
          answerIndex: 1,
          explanation: "Field `network.direction` menstandardisasi arah aliran paket jaringan dengan nilai standar 'ingress', 'egress', 'inbound', atau 'outbound'."
        },
        {
          id: "det-m9-q4",
          prompt: "Jika ada pengguna yang gagal login sebanyak 50 kali dalam hitungan menit diikuti login sukses satu kali, serangan jenis apakah yang kemungkinan besar terjadi?",
          options: [
            "SQL Injection",
            "Brute Force Attack atau Password Spraying",
            "Cross-Site Scripting (XSS)",
            "Phishing email"
          ],
          answerIndex: 1,
          explanation: "Percobaan kegagalan login berulang-ulang yang diakhiri keberhasilan adalah indikator utama penyerangan brute-force menebak kata sandi."
        }
      ]
    },
    {
      slug: "detection-engine-basics",
      title: "Detection engine basics",
      level: "Menengah",
      durationMinutes: 20,
      intro: "Mempelajari operasional mesin deteksi (detection engine) siber serta mengonfigurasi aturan deteksi bawaan (prebuilt rules) secara terjadwal.",
      sections: [
        {
          heading: "Cara Kerja Detection Engine",
          paragraphs: [
            "**Detection Engine** di Elastic Security adalah mesin terjadwal yang mengeksekusi kueri pencarian (seperti kueri KQL, EQL, atau ML) secara asinkronus ke indeks-indeks Elasticsearch.",
            "Jika kueri mendeteksi adanya dokumen log yang cocok dengan kriteria ancaman, mesin deteksi langsung membangkitkan dokumen baru di indeks khusus internal dan menampilkannya sebagai **Alert** di layar SIEM."
          ]
        },
        {
          heading: "Pengelolaan Prebuilt Rules",
          paragraphs: [
            "Elastic menyediakan lebih dari 1000 aturan deteksi bawaan (**Prebuilt Rules**) yang dirancang oleh tim analis siber global Elastic.",
            "Aturan ini dipetakan secara presisi ke kerangka kerja **MITRE ATT&CK** (taktik, teknik, dan sub-teknik penyerang), membolehkan tim SOC memahami intensi serangan di setiap fase eksploitasi."
          ],
          codeExample: {
            title: "Melihat Pola Aturan Deteksi via EQL",
            lang: "json",
            code: `// Mencari urutan proses cmd dijalankan setelah eksploitasi pdf\nsequence by host.id\n  [process where process.name == "acrord32.exe"]\n  [process where process.name == "cmd.exe" and process.parent.name == "acrord32.exe"]`
          }
        }
      ],
      keyPoints: [
        "Detection Engine mengeksekusi kueri deteksi secara periodik di background.",
        "Kecocokan kueri siber akan ditulis sebagai dokumen Alert siber.",
        "Prebuilt Rules Elastic dipetakan langsung ke taktak teknik MITRE ATT&CK.",
        "Analis harus menyeimbangkan aktivasi rule agar sesuai dengan ketersediaan log."
      ],
      quiz: [
        {
          id: "det-m10-q1",
          prompt: "Bahasa kueri khusus di Elastic yang dirancang untuk mendeteksi korelasi rangkaian peristiwa (event sequence) yang berurutan adalah?",
          options: [
            "KQL",
            "EQL (Event Query Language)",
            "SQL",
            "ES|QL"
          ],
          answerIndex: 1,
          explanation: "EQL (Event Query Language) menyediakan operator 'sequence by' yang sangat tangguh untuk mendeteksi kejadian berurutan (misal: penulisan file biner diikuti eksekusi proses tersebut)."
        },
        {
          id: "det-m10-q2",
          prompt: "Apakah yang mendefinisikan seberapa sering (interval) sebuah Detection Rule mengevaluasi data di Elasticsearch?",
          options: [
            "Lookback time",
            "Rule Run Frequency (jadwal kueri)",
            "Severity level",
            "Risk score"
          ],
          answerIndex: 1,
          explanation: "Run Frequency menentukan jadwal rutin (misal tiap 5 menit sekali) bagi mesin deteksi untuk memicu pencarian kueri ke Elasticsearch."
        },
        {
          id: "det-m10-q3",
          prompt: "Mengapa kita disarankan untuk tidak langsung mengaktifkan seluruh 1000+ Prebuilt Rules secara membabi buta di klaster SIEM?",
          options: [
            "Karena Kibana akan menghapus akun analis",
            "Karena mengaktifkan aturan tanpa adanya sumber data log pendukung hanya akan menyia-nyiakan CPU server dan berisiko menimbulkan kebingungan alert palsu",
            "Karena database Elasticsearch akan terkompresi otomatis",
            "Karena aturan tersebut berbayar per klik"
          ],
          answerIndex: 1,
          explanation: "Setiap rule memerlukan telemetri spesifik. Jika log terkait tidak dikumpulkan, rule akan berjalan sia-sia (timeout) dan memicu kelelahan analis mendiagnosis blind-spot."
        },
        {
          id: "det-m10-q4",
          prompt: "Di manakah dokumen Alert hasil temuan Detection Engine disimpan secara fisik di Elasticsearch?",
          options: [
            "Di memori RAM master node",
            "Di dalam indeks sistem khusus berawalan '.alerts-security.alerts-'",
            "Di dalam file registry Filebeat",
            "Di cache browser Kibana"
          ],
          answerIndex: 1,
          explanation: "Alert disimpan sebagai dokumen JSON formal di dalam indeks sistem khusus yang dilindungi sistem keamanan internal Elastic."
        }
      ]
    },
    {
      slug: "alerts-and-cases",
      title: "Alerts and cases",
      level: "Menengah",
      durationMinutes: 20,
      intro: "Mempelajari siklus penanganan peringatan keamanan (alerts) serta mendokumentasikan investigasi menggunakan manajemen kasus (cases).",
      sections: [
        {
          heading: "Workflow Penanganan Alerts",
          paragraphs: [
            "Setiap alert yang muncul di SIEM memiliki status siklus kerja yang mendefinisikan tahapan respon tim SOC:",
            "1. **Open**: Alert baru terdeteksi, menunggu triase.",
            "2. **Acknowledged**: Sedang diselidiki aktif oleh analis, mencegah analis lain menduplikasi pengerjaan alert yang sama.",
            "3. **Closed**: Masalah telah diselesaikan, dianalisis sebagai false positive atau serangan teratasi."
          ]
        },
        {
          heading: "Manajemen Kasus (Cases)",
          paragraphs: [
            "Ketika sebuah alert dikonfirmasi sebagai serangan nyata, analis dapat menaikkan statusnya menjadi **Case**.",
            "Kasus bertindak sebagai berkas insiden formal tempat mengumpulkan bukti-bukti teknis (menyisipkan diagram, menyematkan logs dari Timeline, membuat deskripsi serangan, dan berkolaborasi). Elastic Cases juga mendukung integrasi pengiriman tiket otomatis ke ServiceNow atau Jira."
          ],
          codeExample: {
            title: "Kueri Mengubah Status Workflow Alert lewat API",
            lang: "json",
            code: `POST /api/detection_engine/rules/alerts/status\n{\n  "id": "alert_unique_id",\n  "status": "acknowledged"\n}`
          }
        }
      ],
      keyPoints: [
        "Workflow status menjaga keteraturan koordinasi tim SOC.",
        "Acknowledged menandai pengerjaan aktif oleh analis.",
        "Case mengkonsolidasikan temuan investigasi insiden secara terstruktur.",
        "Mendukung konektor otomatisasi eksternal ke platform eksternal seperti Jira."
      ],
      quiz: [
        {
          id: "det-m11-q1",
          prompt: "Status alert manakah yang menunjukkan bahwa suatu peringatan keamanan sedang dalam penanganan aktif oleh seorang analis?",
          options: [
            "Open",
            "Acknowledged",
            "Closed",
            "Archived"
          ],
          answerIndex: 1,
          explanation: "Status 'Acknowledged' mengindikasikan bahwa analis telah memvalidasi alert dan sedang menginvestigasi temuan tersebut secara langsung."
        },
        {
          id: "det-m11-q2",
          prompt: "Bagaimana cara analis SOC mengonsolidasikan temuan investigasi, catatan kronologi, dan diagram bukti siber ke dalam satu berkas terpusat di Elastic Security?",
          options: [
            "Menulisnya di notepad lokal",
            "Membuat dokumen Kasus (Case) baru di menu Cases",
            "Menonaktifkan deteksi siber",
            "Mengirim email ke semua admin"
          ],
          answerIndex: 1,
          explanation: "Menu Cases memfasilitasi pembuatan insiden formal terintegrasi untuk pendokumentasian bukti-bukti teknis serangan secara tim."
        },
        {
          id: "det-m11-q3",
          prompt: "Fitur apa di Cases yang membolehkan tiket insiden siber yang dibuat di Kibana otomatis terbuat juga di platform ticketing eksternal Jira?",
          options: [
            "Ingest Processor",
            "External Connectors (Konektor Eksternal)",
            "Registry Filebeat",
            "Fleet Server"
          ],
          answerIndex: 1,
          explanation: "Konektor Eksternal (Connectors) menghubungkan Elastic Cases dengan platform siber eksternal seperti ServiceNow, Jira, atau Slack untuk sinkronisasi tiket."
        },
        {
          id: "det-m11-q4",
          prompt: "Apakah fungsi dari penetapan nilai 'Severity' (keparahan) dan 'Risk Score' pada sebuah alert?",
          options: [
            "Membatasi memori RAM",
            "Membantu analis memprioritaskan alert mana yang harus ditangani terlebih dahulu berdasarkan urgensi tingkat bahayanya",
            "Menghapus log otomatis",
            "Mengunci akun pengguna"
          ],
          answerIndex: 1,
          explanation: "Severity (Low, Medium, High, Critical) and Risk Score memilah urutan penanganan instan bagi analis SOC di tengah lautan ribuan alert harian."
        }
      ]
    },
    {
      slug: "security-alert-triage",
      title: "Security alert triage",
      level: "Menengah",
      durationMinutes: 20,
      intro: "Belajar melakukan investigasi awal (triase) terhadap alert siber secara terstruktur untuk memilah ancaman nyata dari alarm palsu.",
      sections: [
        {
          heading: "Seni Melakukan Triase Alert siber",
          paragraphs: [
            "Triase adalah langkah penyaringan paling kritis di SOC. Analis dituntut menilai validitas alert secara kilat.",
            "Kriteria utama triase:",
            "1. **Prevalensi (Keunikan)**: Apakah aktivitas ini terjadi di seluruh 1000 laptop karyawan, atau hanya di 1 server sensitif? (Aktivitas yang tersebar merata biasanya adalah update software/perilaku wajar).",
            "2. **Konteks Pengguna**: Apakah program administrasi dijalankan oleh tim DevOps resmi pada waktu kerja, atau oleh akun anonim di tengah malam?"
          ]
        },
        {
          heading: "Memisahkan True Positive dari False Positive",
          paragraphs: [
            "- **True Positive (TP)**: Alert mendeteksi ancaman riil siber (misal ransomware aktif). Memerlukan penanganan darurat.",
            "- **False Positive (FP)**: Alert memicu alarm karena kesalahan rule menganggap skrip administrasi yang sah sebagai malware. Memerlukan tuning atau pengecualian (exceptions)."
          ]
        }
      ],
      keyPoints: [
        "Triase meminimalkan waktu pemrosesan ancaman siber kritis.",
        "Prevalensi dan analisis konteks merupakan instrumen utama triase.",
        "Analis SOC harus memisahkan True Positive (TP) dari False Positive (FP).",
        "False positive wajib diselesaikan dengan penyusunan exception agar tidak memicu kelelahan alarm siber."
      ],
      quiz: [
        {
          id: "det-m12-q1",
          prompt: "Istilah apakah yang menggambarkan kondisi di mana alarm siber memicu alert karena mendeteksi aktivitas administrasi internal yang sah sebagai ancaman berbahaya?",
          options: [
            "True Positive",
            "False Positive",
            "True Negative",
            "False Negative"
          ],
          answerIndex: 1,
          explanation: "False Positive terjadi ketika aktivitas normal/sah salah diidentifikasi sebagai aktivitas berbahaya oleh sistem pertahanan siber."
        },
        {
          id: "det-m12-q2",
          prompt: "Di tengah lautan ribuan alert, bagaimanakah cara analis SOC memvalidasi kejanggalan aktivitas eksekusi proses yang asing?",
          options: [
            "Dengan melihat status lisensi Windows",
            "Menganalisis prevalensi kemunculan proses tersebut lintas mesin (apakah hanya terjadi di satu node secara terisolasi)",
            "Menghapus log server",
            "Menonaktifkan database"
          ],
          answerIndex: 1,
          explanation: "Pola serangan siber umumnya bersifat terisolasi dan jarang ditemui (low prevalence). Jika suatu proses hanya berjalan di satu mesin dari ribuan host, tingkat kecurigaannya sangat tinggi."
        },
        {
          id: "det-m12-q3",
          prompt: "Kondisi manakah di bawah ini yang paling berpotensi dikonfirmasikan sebagai True Positive (ancaman siber nyata)?",
          options: [
            "Program Windows Update mengunduh berkas patch",
            "Proses 'powershell.exe' dijalankan oleh program 'winword.exe' (Microsoft Word) untuk mengunduh berkas script dari domain asing",
            "Rekan tim IT menjalankan ping jaringan",
            "Pembersihan berkas cache harian"
          ],
          answerIndex: 1,
          explanation: "Aplikasi pengolah dokumen Word (winword.exe) memicu proses shell (powershell.exe) adalah tanda serangan siber klasik (phishing macro) yang menyusup ke endpoint."
        },
        {
          id: "det-m12-q4",
          prompt: "Apakah konsekuensi buruk terbesar bagi tim SOC jika klaster SIEM dibiarkan menghasilkan ratusan False Positive harian tanpa tuning?",
          options: [
            "Elasticsearch akan berganti nama",
            "Terjadinya 'Alert Fatigue' (kelelahan penanganan alarm), memicu analis SOC mengabaikan peringatan siber kritis karena jenuh menyaring alarm palsu",
            "Lisensi antivirus akan kedaluwarsa",
            "Sistem operasi node otomatis mati"
          ],
          answerIndex: 1,
          explanation: "Alert Fatigue membuat analis SOC kehilangan fokus dan terbiasa menutup alert tanpa penyelidikan serius, membuka celah bagi serangan siber nyata untuk menyusup tanpa terdeteksi."
        }
      ]
    },
    {
      slug: "focus-and-investigate",
      title: "Focus and investigate",
      level: "Menengah",
      durationMinutes: 20,
      intro: "Menggunakan penganalisis visual pohon proses (Process Tree Analyzer) di Elastic Security untuk memetakan rantai eksekusi proses siber secara detail.",
      sections: [
        {
          heading: "Visualisasi Rantai Proses (Process Trees)",
          paragraphs: [
            "Log teks mentah kesulitan menceritakan urutan kejadian. Di sinilah **Process Tree Analyzer** di Elastic Security mengambil peran penting.",
            "Fitur ini merender grafik garis bapak-ke-anak (*parent-child relationship*) dari proses biner. Analis dapat mendeteksi jika program biner yang sah (seperti `explorer.exe`) membangkitkan proses berbahaya di bawahnya secara visual."
          ]
        },
        {
          heading: "Mendeteksi Teknik Masquerading",
          paragraphs: [
            "Penyerang sering menamai file berbahaya mereka dengan nama sistem yang sah (misal `svchost.exe` tapi diletakkan di folder temp `/var/tmp/`).",
            "Melalui penganalisis visual, analis dapat memeriksa lokasi berkas asli (*working directory*), argumen perintah lengkap, tanda tangan digital (*digital signature*), serta hash file biner tersebut untuk langsung divalidasi ke VirusTotal."
          ]
        }
      ],
      keyPoints: [
        "Process Tree memvisualisasikan garis hubungan bapak-anak eksekusi biner.",
        "Analis dapat memverifikasi argumen perintah eksekusi proses secara transparan.",
        "Mempermudah pelacakan titik awal penyusupan malware.",
        "Menyediakan integrasi instan cek reputasi hash biner siber."
      ],
      quiz: [
        {
          id: "det-m13-q1",
          prompt: "Dalam visualisasi pohon proses, apakah yang direpresentasikan oleh hubungan antara 'explorer.exe' dan 'cmd.exe' di bawahnya?",
          options: [
            "cmd.exe adalah bapak (parent) dari explorer.exe",
            "explorer.exe adalah bapak (parent) yang melahirkan/mengeksekusi proses anak (child) bernama cmd.exe",
            "Keduanya adalah program yang sama",
            "Kedua program saling mematikan"
          ],
          answerIndex: 1,
          explanation: "Pohon proses menunjukkan urutan kelahiran eksekusi. Di sini, pengguna berinteraksi di desktop Windows (explorer.exe) lalu membuka program command prompt (cmd.exe)."
        },
        {
          id: "det-m13-q2",
          prompt: "Informasi detail manakah yang paling krusial diperiksa analis SOC pada detail proses untuk mendeteksi apakah kueri siber terenkripsi menyusup di argumen PowerShell?",
          options: [
            "Resolusi icon aplikasi",
            "Command Line Arguments (argumen perintah lengkap)",
            "Ukuran pixel jendela aplikasi",
            "Warna latar belakang konsol"
          ],
          answerIndex: 1,
          explanation: "Command line arguments mencatat instruksi eksklusif (seperti parameter '-EncodedCommand' atau '-nop') yang diluncurkan bersama proses, mengungkap intensi tersembunyi skrip."
        },
        {
          id: "det-m13-q3",
          prompt: "Bagaimana cara mendeteksi teknik 'Masquerading' (penyamaran nama proses siber) menggunakan detail berkas proses?",
          options: [
            "Dengan melihat tanggal komputer",
            "Memeriksa lokasi path berkas eksekusi asli (apakah nama svchost.exe berjalan di luar folder standar 'C:\\Windows\\System32\\')",
            "Menghapus database",
            "Meminta pengguna mengunduh ulang program"
          ],
          answerIndex: 1,
          explanation: "Proses sistem penting Windows memiliki lokasi path eksklusif yang baku. Jika svchost.exe berjalan di folder unduhan sementara user, itu dipastikan merupakan samaran malware."
        },
        {
          id: "det-m13-q4",
          prompt: "Metode apa yang paling cepat digunakan analis SOC di dalam peninjauan detail proses untuk memverifikasi keabsahan file biner sistem yang tidak dikenal?",
          options: [
            "Menonaktifkan sistem operasi",
            "Membandingkan nilai hash file biner (MD5/SHA256) dengan basis data reputasi global di VirusTotal",
            "Mengganti hak akses keyboard",
            "Menginstal ulang browser"
          ],
          answerIndex: 1,
          explanation: "Nilai sidik jari berkas (hash SHA256) bersifat unik bagi setiap file biner. Mengecek kecocokannya di platform VirusTotal langsung mengonfirmasi apakah berkas tersebut berbahaya."
        }
      ]
    },
    {
      slug: "advanced-investigations-with-timelines",
      title: "Advanced investigations with Timelines",
      level: "Lanjutan",
      durationMinutes: 20,
      intro: "Mengenal lembar kerja investigasi Timeline di Elastic Security SIEM untuk melacak kronologi kejadian serangan siber lintas waktu.",
      sections: [
        {
          heading: "Timeline: Ruang Kerja Investigasi",
          paragraphs: [
            "**Timeline** adalah ruang kerja (workspace) utama yang digunakan untuk melacak jejak serangan siber lintas waktu.",
            "Analis SOC dapat menarik peristiwa log mencurigakan dari Discover ke dalam Timeline, menyematkan (*pin*) peristiwa kunci yang terbukti sebagai rangkaian serangan, menambahkan komentar investigasi di setiap baris, serta menyimpan garis waktu tersebut sebagai bukti siber terstruktur."
          ]
        },
        {
          heading: "Korelasi Data Chronological",
          paragraphs: [
            "Di Timeline, analis dapat menulis kueri multi-indeks yang menggabungkan log jaringan, log endpoint Windows, dan log audit sistem cloud secara bersamaan.",
            "Ini memberikan keleluasaan merancang rantai kejadian siber kronologis yang runtut dari detik awal masuknya penyerang hingga eksfiltrasi data siber terjadi."
          ],
          codeExample: {
            title: "Kueri Menggabungkan Log Keamanan di Timeline",
            lang: "bash",
            code: `(event.category : network and destination.port : 4444) or (event.category : process and process.name : nc.exe)`
          }
        }
      ],
      keyPoints: [
        "Timeline memfasilitasi rekonstruksi kronologis bukti siber terstruktur.",
        "Fitur Pin mengamankan log kunci agar tidak hilang saat kueri diubah.",
        "Dukungan penulisan kueri multi-indeks lintas telemetri sistem.",
        "Temuan di Timeline dapat dilampirkan langsung ke menu Kasus (Cases)."
      ],
      quiz: [
        {
          id: "det-m14-q1",
          prompt: "Apakah fungsi utama dari tombol 'Pin' (sematkan) pada setiap baris log di dalam lembar kerja Timeline?",
          options: [
            "Untuk menghapus log dari klaster secara permanen",
            "Untuk mengunci dan mengamankan log terpilih agar tetap berada di layar Timeline meskipun analis mengganti kueri pencarian berkali-kali selama investigasi",
            "Untuk mengirim email otomatis ke pengguna",
            "Untuk mempercepat loading halaman web"
          ],
          answerIndex: 1,
          explanation: "Fitur Pin mengamankan peristiwa penting (bukti siber) yang telah divalidasi analis agar tidak hilang dari lembar kerja saat analis mencoba mencari data pelengkap lain dengan kueri berbeda."
        },
        {
          id: "det-m14-q2",
          prompt: "Bagaimana cara analis SOC membagikan catatan Timeline yang berisi runtutan kronologis serangan ke analis Blue Team lainnya secara efisien?",
          options: [
            "Menyalin semua log ke berkas Excel manual",
            "Menyimpan Timeline dan membagikan tautan Timeline ID unik, atau melampirkan langsung ke dalam tiket Kasus (Case)",
            "Menghapus berkas indeks",
            "Mengganti password akun Kibana"
          ],
          answerIndex: 1,
          explanation: "Setiap Timeline memiliki pengenal unik yang tersimpan di klaster SIEM, membolehkan pembagian instan kolaboratif antar analis SOC melalui tautan atau lampiran tiket Kasus."
        },
        {
          id: "det-m14-q3",
          prompt: "Mengapa kemampuan melakukan kueri lintas indeks (multi-index search) di Timeline sangat disukai analis SOC?",
          options: [
            "Because it reduces energy consumption",
            "Karena membolehkan rekonstruksi runtutan serangan dari berbagai jenis sensor (seperti menggabungkan data firewall, log laptop, dan audit cloud) ke satu tampilan terpadu",
            "Karena menonaktifkan update Windows otomatis",
            "Karena menyembunyikan IP penyerang"
          ],
          answerIndex: 1,
          explanation: "Serangan siber modern melintasi banyak infrastruktur. Menyatukan logs dari sensor yang bervariasi ke dalam satu lini masa tunggal adalah kunci keberhasilan rekonstruksi kejahatan siber."
        },
        {
          id: "det-m14-q4",
          prompt: "Di antarmuka Timeline, di manakah analis dapat menuliskan analisis penjelasan kualitatif dari bukti log yang di-pin?",
          options: [
            "Mengubah log JSON langsung di Elasticsearch",
            "Menambahkan catatan kustom (Notes) menggunakan editor teks Markdown bawaan di baris log terkait",
            "Menulisnya di dasbor Fleet",
            "Di halaman monitoring Kubernetes"
          ],
          answerIndex: 1,
          explanation: "Fitur Notes di Timeline membolehkan analis melampirkan analisis kualitatif tertulis pada baris log penting untuk dokumentasi siber formal."
        }
      ]
    },
    {
      slug: "siem-capstones",
      title: "SIEM Capstones",
      level: "Lanjutan",
      durationMinutes: 25,
      intro: "Latihan skenario praktis dari ujung ke ujung (end-to-end) menyimulasikan investigasi serangan siber nyata di klaster SIEM.",
      sections: [
        {
          heading: "Skenario Simulasi Serangan Phishing",
          paragraphs: [
            "Dalam skenario capstone ini, Anda akan diajak merajut investigasi dari awal:",
            "1. **Entry Point**: Pengguna mengklik attachment email jahat (log terekam di email gateway).",
            "2. **Execution**: File PDF membuka eksploitasi cmd.exe (terekam di Elastic Defend).",
            "3. **Persistence**: Hacker memasang skrip startup registry agar malware aktif otomatis (terekam di registry Windows logs).",
            "4. **Exfiltration**: Terjadi koneksi keluar massal mengirimkan data rahasia (terekam di firewall network logs)."
          ]
        },
        {
          heading: "Langkah-langkah Remediasi",
          paragraphs: [
            "Analis siber dilatih mengisolasi host yang terinfeksi menggunakan menu respon cepat di Elastic Defend, mencabut izin user yang terdampak, serta menyusun detection rules baru agar serangan serupa terblokir otomatis di masa mendatang."
          ]
        }
      ],
      keyPoints: [
        "SIEM Capstones melatih pola pikir komprehensif penanganan insiden siber.",
        "Menghubungkan data log lintas platform (network, endpoint, registry).",
        "Melatih kecepatan triase dan metodologi penyelidikan.",
        "Mengasah fungsionalitas penahanan serangan (remediation response)."
      ],
      quiz: [
        {
          id: "det-m15-q1",
          prompt: "Di mana analis SOC dapat menemukan rekaman awal masuknya lampiran berbahaya dalam skenario serangan phishing berbasis email?",
          options: [
            "Log firewall jaringan internal",
            "Log Server Email Gateway (Email Security logs)",
            "Log database MySQL",
            "Log metrik CPU server"
          ],
          answerIndex: 1,
          explanation: "Pintu masuk awal (entry point) kampanye phishing email terekam secara orisinal pada infrastruktur pertahanan email perusahaan (Email Gateway logs)."
        },
        {
          id: "det-m15-q2",
          prompt: "Langkah respon darurat apakah yang disediakan oleh integrasi Elastic Defend untuk menghentikan komunikasi malware di laptop karyawan yang terinfeksi tanpa mematikan fisik laptop?",
          options: [
            "Menghapus seluruh file system32 Windows",
            "Menjalankan perintah 'Isolate Host' untuk memutus seluruh lalu lintas jaringan laptop kecuali komunikasinya ke server SIEM",
            "Mengganti background desktop pengguna",
            "Mengubah index template di Elasticsearch"
          ],
          answerIndex: 1,
          explanation: "Fitur 'Isolate Host' mengunci laptop yang terinfeksi secara logis di level jaringan, menghentikan penyebaran malware ke laptop lain (lateral movement) sambil membiarkan analis siber tetap menyelidikiinya dari jauh."
        },
        {
          id: "det-m15-q3",
          prompt: "Teknik siber apakah yang dilakukan penyerang ketika mereka mencoba mengamankan akses di server target agar malware tetap berjalan otomatis meskipun server di-restart?",
          options: [
            "Data Exfiltration",
            "Persistence (Kegigihan Akses)",
            "Brute Force",
            "Port Scanning"
          ],
          answerIndex: 1,
          explanation: "Persistence adalah taktik penyerang (seperti memasang skrip di Startup Folder atau registry Run Keys Windows) agar malware tetap aktif otomatis saat mesin dinyalakan kembali."
        },
        {
          id: "det-m15-q4",
          prompt: "Setelah insiden siber di dalam skenario Capstone berhasil diatasi, langkah apa yang harus diambil analis SOC untuk mencegah insiden yang sama terulang kembali?",
          options: [
            "Menghapus seluruh sistem monitoring SIEM",
            "Menulis aturan deteksi kustom (Custom Detection Rule) baru berbasis IoC atau taktik serangan yang baru divalidasi",
            "Mengabaikan semua alert di masa depan",
            "Merestart server Elasticsearch"
          ],
          answerIndex: 1,
          explanation: "Menyusun Custom Detection Rule berdasarkan artefak serangan yang baru saja terjadi memastikan sistem otomatis mendeteksi dan mencegah upaya eksploitasi serupa di masa depan."
        }
      ]
    },
    {
      slug: "attack-discovery",
      title: "Attack Discovery",
      level: "Siap Ujian",
      durationMinutes: 20,
      intro: "Memanfaatkan fitur Attack Discovery untuk menyatukan puluhan alert terpisah menjadi satu skenario serangan siber terintegrasi menggunakan AI.",
      sections: [
        {
          heading: "Menemukan Gambaran Besar Serangan",
          paragraphs: [
            "Dalam situasi krisis siber, tim SOC sering dibanjiri ratusan alert yang tampaknya tidak saling berhubungan. Ini memicu kebingungan kronologis.",
            "Fitur **Attack Discovery** di Elastic Security menggunakan algoritma analitik canggih untuk menyaring lautan alert tersebut secara otomatis. Ia mencari kesamaan pola entitas host, alamat IP, akun pengguna, serta rentang waktu untuk merajut alert-alert tersebut menjadi satu kesatuan cerita kampanye serangan."
          ]
        },
        {
          heading: "Integrasi dengan MITRE ATT&CK",
          paragraphs: [
            "Attack Discovery memvisualisasikan alur serangan dari langkah awal penyusupan (*initial access*) hingga eksfiltrasi data, memetakan setiap fase serangan siber langsung ke kerangka kerja MITRE ATT&CK secara transparan."
          ]
        }
      ],
      keyPoints: [
        "Attack Discovery menyatukan alert terisolasi menjadi cerita serangan tunggal.",
        "Mengurangi kebisingan (noise) operasional analis SOC secara signifikan.",
        "Menyajikan kronologi serangan dari ujung ke ujung secara intuitif.",
        "Terintegrasi erat dengan visualisasi MITRE ATT&CK."
      ],
      quiz: [
        {
          id: "det-m16-q1",
          prompt: "Apakah masalah operasional utama di SOC yang coba diselesaikan oleh fitur Attack Discovery?",
          options: [
            "Kurangnya kapasitas penyimpanan disk Elasticsearch",
            "Kesulitan analis menghubungkan puluhan alert terpisah yang sebenarnya merupakan bagian dari satu kampanye serangan terkoordinasi (alert correlation)",
            "Lisensi berbayar Kibana",
            "Kecepatan pengetikan kueri KQL"
          ],
          answerIndex: 1,
          explanation: "Attack Discovery memilah dan mengaitkan alert siber yang berserakan menjadi satu garis besar alur penyerangan sehingga analis memahami peta serangan secara holistik."
        },
        {
          id: "det-m16-q2",
          prompt: "Bagaimana Attack Discovery mengelompokkan alert-alert keamanan siber yang berserakan menjadi satu cerita serangan?",
          options: [
            "Dengan memilih log secara acak",
            "Menganalisis kesamaan variabel entitas (seperti host.id, user.name, destination.ip) dan korelasi waktu kejadian",
            "Menghapus alert yang memiliki severity rendah",
            "Meminta analis siber mengelompokkan manual"
          ],
          answerIndex: 1,
          explanation: "Algoritma di platform Elastic mengorelasikan log yang berbagi entitas sasaran (target host yang sama atau IP penyerang yang sama) pada rentang waktu yang berdekatan."
        },
        {
          id: "det-m16-q3",
          prompt: "Visualisasi standar industri keamanan siber apakah yang disematkan di dalam Attack Discovery untuk menunjukkan progres tahapan serangan?",
          options: [
            "Bagan Gantt proyek",
            "Matriks Taktik dan Teknik MITRE ATT&CK",
            "Peta topologi jaringan",
            "Diagram lingkaran donat"
          ],
          answerIndex: 1,
          explanation: "MITRE ATT&CK adalah standar global pemetaan siber. Attack Discovery menggunakannya untuk melabeli fase serangan (misal: Defense Evasion, Credential Access)."
        },
        {
          id: "det-m16-q4",
          prompt: "Bagaimanakah dampak penggunaan Attack Discovery terhadap efisiensi waktu respon tim SOC?",
          options: [
            "Membuat waktu investigasi menjadi jauh lebih lama",
            "Sangat mempercepat waktu deteksi dan resolusi insiden (MTTR) karena analis tidak perlu menganalisis ratusan alert siber satu per satu secara manual",
            "Mengharuskan tim SOC bekerja lembur",
            "Menghapus seluruh logs sistem"
          ],
          answerIndex: 1,
          explanation: "Dengan menyajikan kesimpulan kompilasi serangan terpadu secara langsung, analis dapat mengambil tindakan penahanan (containment) siber secara instan."
        }
      ]
    },
    {
      slug: "ai-assistant-for-security",
      title: "AI Assistant for Security",
      level: "Siap Ujian",
      durationMinutes: 20,
      intro: "Memanfaatkan asisten kecerdasan buatan (Elastic AI Assistant) berbasis LLM untuk menganalisis kode berbahaya, merekomendasikan remedi, dan menulis kueri siber otomatis.",
      sections: [
        {
          heading: "Kecerdasan Buatan Terintegrasi di SOC",
          paragraphs: [
            "**Elastic AI Assistant for Security** adalah rekan pintar berbasis kecerdasan buatan (Generative AI) yang disematkan langsung di dalam konsol Elastic Security.",
            "Analis dapat berinteraksi secara interaktif lewat chat bawaan untuk menyelesaikan berbagai tugas SOC yang rumit dalam hitungan detik."
          ]
        },
        {
          heading: "Fungsionalitas Kunci AI Assistant",
          paragraphs: [
            "Kemampuan utama AI Assistant meliputi:",
            "1. **Menganalisis Perintah Berbahaya**: Meminta AI menerjemahkan perintah PowerShell terenkripsi (`-enc`) atau skrip bash aneh menjadi bahasa manusia.",
            "2. **Rekomendasi Triase**: Meminta instruksi langkah penanganan siber khusus untuk alert yang baru saja berbunyi.",
            "3. **Pembuatan Kueri Otomatis**: Meminta AI menuliskan kueri ES|QL, KQL, atau EQL yang tepat hanya dengan instruksi bahasa manusia biasa."
          ],
          codeExample: {
            title: "Meminta AI Menulis Kueri ES|QL Keamanan via Chat",
            lang: "bash",
            code: `"Buatkan kueri ES|QL untuk mencari log auth gagal terbanyak per host.name"\n# AI akan merespon instan dengan baris kode kueri ES|QL yang siap dijalankan"`
          }
        }
      ],
      keyPoints: [
        "AI Assistant menyuntikkan Generative AI LLM langsung ke dalam alur kerja SOC.",
        "Mampu menerjemahkan skrip biner/eksekusi aneh secara transparan.",
        "Menghasilkan kueri ES|QL, KQL, dan EQL instan dari perintah bahasa manusia.",
        "Menyediakan panduan investigasi (Runbooks) yang relevan untuk setiap alert."
      ],
      quiz: [
        {
          id: "det-m17-q1",
          prompt: "Bagaimanakah cara kerja Elastic AI Assistant for Security di dalam konsol Kibana?",
          options: [
            "Menggantikan fungsi sistem operasi",
            "Menyediakan asisten chat pintar berbasis LLM (Generative AI) yang terintegrasi di seluruh alur kerja penyelidikan alert dan data log siber",
            "Menghapus database siber secara acak",
            "Mematikan fungsi firewall jaringan"
          ],
          answerIndex: 1,
          explanation: "AI Assistant bertindak sebagai ko-pilot analis SOC yang siap diajak berdiskusi, menganalisis, dan memformulasikan kueri secara interaktif."
        },
        {
          id: "det-m17-q2",
          prompt: "Tugas penanganan siber manakah di bawah ini yang dapat diselesaikan secara instan oleh Elastic AI Assistant?",
          options: [
            "Memperbaiki hardware kabel lan yang putus",
            "Menerjemahkan atau mendekripsi argumen skrip PowerShell berbahaya yang disamarkan, serta merekomendasikan taktik penanganan alert",
            "Membeli lisensi antivirus murah",
            "Mengurangi bandwidth"
          ],
          answerIndex: 1,
          explanation: "Generative AI sangat andal dalam menganalisis kode atau skrip berbahaya (code analysis) dan menerangkan intensi di balik skrip tersebut ke dalam bahasa manusia yang lugas."
        },
        {
          id: "det-m17-q3",
          prompt: "Bagaimana cara analis meminta Elastic AI Assistant menuliskan kueri korelasi EQL di SIEM?",
          options: [
            "Harus menulis instruksi menggunakan kode mesin biner",
            "Cukup menuliskan instruksi kebutuhan deteksi siber dalam bahasa manusia biasa (natural language request) di kolom chat asisten",
            "Mengunduh plugin Python tambahan",
            "AI Assistant tidak bisa menulis kueri"
          ],
          answerIndex: 1,
          explanation: "Elastic AI Assistant memahami instruksi bahasa manusia (seperti bahasa Indonesia atau Inggris) dan menerjemahkannya menjadi sintaks kueri formal siber (ES|QL/KQL/EQL)."
        },
        {
          id: "det-m17-q4",
          prompt: "Apakah keuntungan terbesar integrasi AI Assistant bagi analis SOC pemula yang baru terjun di bidang pertahanan siber?",
          options: [
            "Tidak perlu lagi masuk kantor",
            "Menjembatani gap keahlian teknis dengan menyediakan panduan investigasi (investigation runbooks) serta edukasi konteks ancaman secara instan di sisi alert",
            "Mengubah sistem operasi komputer menjadi macOS",
            "Mempercepat refresh browser"
          ],
          answerIndex: 1,
          explanation: "Analis pemula dapat menggunakan asisten pintar untuk mempelajari jenis-jenis serangan siber baru secara langsung tanpa perlu berpindah tab browser mencari manual dokumentasi eksternal."
        }
      ]
    }
  ],
  examQuestions: [
    {
      id: "det-ex-1",
      prompt: "Platform pertahanan siber yang bertugas mengumpulkan, merangkum, mengorelasikan, dan menganalisis log keamanan dari seluruh lingkungan perusahaan disebut…",
      options: [
        "Antivirus tradisional",
        "SIEM (Security Information and Event Management)",
        "DNS server",
        "DHCP router",
      ],
      answerIndex: 1,
      explanation:
        "SIEM adalah jantung SOC yang bertindak memusatkan seluruh telemetri log sensor, membolehkan deteksi korelasi komprehensif.",
    },
    {
      id: "det-ex-2",
      prompt: "Manakah komponen dari spesifikasi terbuka Elastic Common Schema (ECS) yang digunakan untuk menstandardisasi nama pengguna sistem?",
      options: [
        "user_name",
        "username",
        "user.name",
        "system.user"
      ],
      answerIndex: 2,
      explanation:
        "Sesuai spesifikasi formal ECS, metadata nama pengguna disimpan di dalam field terstandardisasi 'user.name'.",
    },
    {
      id: "det-ex-3",
      prompt: "Tipe rule deteksi manakah di Elastic Security SIEM yang digunakan untuk mencocokkan event lalu lintas jaringan dengan repositori data threat intelligence?",
      options: [
        "Custom query",
        "Threshold rule",
        "Indicator match",
        "Machine learning anomaly"
      ],
      answerIndex: 2,
      explanation:
        "Indicator match rule mencocokkan field IP, file hash, atau nama domain di log aktif dengan indeks indikator siber berbahaya (threat intel).",
    },
    {
      id: "det-ex-4",
      prompt: "Mengapa rule tipe EQL sangat direkomendasikan untuk mendeteksi ancaman Advanced Persistent Threat (APT)?",
      options: [
        "Karena EQL otomatis menghapus malware",
        "Karena EQL memiliki kemampuan mendeteksi korelasi urutan kejadian (sequence of events) yang berlapis lintas proses dan waktu",
        "Karena EQL tidak membutuhkan RAM",
        "Karena EQL berjalan di browser"
      ],
      answerIndex: 1,
      explanation:
        "EQL (Event Query Language) didesain khusus mendeteksi runtutan aksi (seperti unduh file → tulis registry → jalankan shell) yang merupakan ciri khas peretasan canggih.",
    },
    {
      id: "det-ex-5",
      prompt: "Status alert manakah di SIEM yang menandakan alert tersebut merupakan alarm palsu setelah diteliti oleh analis SOC?",
      options: [
        "True Positive",
        "False Positive",
        "False Negative",
        "True Negative"
      ],
      answerIndex: 1,
      explanation:
        "False Positive mengindikasikan alarm salah memicu alert pada aktivitas sistem internal yang sah.",
    },
    {
      id: "det-ex-6",
      prompt: "Mengapa kita wajib melakukan review berkala terhadap rule deteksi yang berstatus 'sunyi' (tidak pernah memicu alert)?",
      options: [
        "Agar rule tersebut dihapus otomatis",
        "Memastikan data log pendukung rule mengalir masuk dengan benar dan kueri rule tidak mengalami kesalahan logika (blind spot)",
        "Agar ukuran indeks mengecil",
        "Untuk mematikan koneksi internet"
      ],
      answerIndex: 1,
      explanation:
        "Rule yang sunyi bisa menandakan sistem aman, atau sensor logs mati sehingga kueri tidak mendeteksi apa pun. Verifikasi berkala wajib dilakukan.",
    },
    {
      id: "det-ex-7",
      prompt: "Lembar kerja visual di Elastic Security SIEM yang digunakan untuk threat hunting, menyusun kronologis bukti, dan melampirkan catatan siber adalah…",
      options: [
        "Kibana Lens",
        "Timeline",
        "Fleet Agent",
        "Discover"
      ],
      answerIndex: 1,
      explanation:
        "Timeline menyediakan ruang kerja interaktif berdedikasi bagi analis untuk menyusun runtutan log bukti serangan secara kronologis.",
    },
    {
      id: "det-ex-8",
      prompt: "Bagaimana cara terbaik melakukan tuning deteksi jika suatu aktivitas DevOps sah (seperti script deployment otomatis harian) terus-menerus memicu alert kritikal?",
      options: [
        "Mematikan rule deteksi terkait selamanya",
        "Menambahkan exception (pengecualian) yang sempit, spesifik, dan terdokumentasi pada rule terkait",
        "Menghapus data log DevOps dari Elasticsearch",
        "Mengabaikan seluruh alert harian"
      ],
      answerIndex: 1,
      explanation:
        "Exceptions mengecualikan aktivitas aman yang spesifik (misal hanya user svc-deploy di node ci-runner) tanpa mematikan rule deteksi bagi ancaman lain.",
    },
    {
      id: "det-ex-9",
      prompt: "Apakah fungsi utama dari fitur Attack Discovery di Elastic Security?",
      options: [
        "Mengunduh update antivirus otomatis",
        "Menyatukan dan mengorelasikan ratusan alert siber yang terpisah menjadi satu kesimpulan alur penyerangan tunggal berbasis AI",
        "Menonaktifkan server yang diserang",
        "Mengirim email ke semua pengguna"
      ],
      answerIndex: 1,
      explanation:
        "Attack Discovery memandukan AI untuk merelasikan alert-alert yang berserakan lintas server menjadi satu kesimpulan skenario serangan siber.",
    },
    {
      id: "det-ex-10",
      prompt: "Layanan proteksi di Elastic Agent yang bertugas melindungi endpoint Windows, macOS, dan Linux dari malware dan ransomware disebut…",
      options: [
        "Metricbeat",
        "Elastic Defend",
        "Logstash filter",
        "Kibana Lens"
      ],
      answerIndex: 1,
      explanation:
        "Elastic Defend adalah modul keamanan endpoint EDR bawaan Elastic Stack yang terhubung dengan Fleet.",
    },
    {
      id: "det-ex-11",
      prompt: "Manakah kueri KQL yang valid untuk mencari log siber di mana field 'process.name' berisi cmd.exe atau powershell.exe?",
      options: [
        "process.name : \"cmd.exe\" or process.name : \"powershell.exe\"",
        "process.name == \"cmd.exe\" || \"powershell.exe\"",
        "SELECT WHERE process.name IS cmd.exe OR powershell.exe",
        "process.name in (cmd.exe, powershell.exe)"
      ],
      answerIndex: 0,
      explanation:
        "KQL menggunakan sintaks objek `:` diikuti nilai pencarian, digabungkan dengan operator logika `or` untuk seleksi berganda.",
    },
    {
      id: "det-ex-12",
      prompt: "Tindakan darurat apa yang harus diambil analis SOC di konsol EDR saat mendeteksi malware aktif membocorkan data pada satu host?",
      options: [
        "Menyetel CPU limit ke 0",
        "Mengisolasi host tersebut dari jaringan (Isolate Host) melalui respon Elastic Defend",
        "Menghapus user manager",
        "Melakukan backup data di disk eksternal"
      ],
      answerIndex: 1,
      explanation:
        "Isolate Host memblokir seluruh koneksi jaringan host terdampak kecuali koneksinya ke Elastic SIEM, menghentikan penyebaran malware.",
    },
    {
      id: "det-ex-13",
      prompt: "Pada fase ILM manakah data log keamanan yang sudah berusia di atas 90 hari biasanya dihapus secara permanen untuk menghemat penyimpanan?",
      options: [
        "Hot Phase",
        "Warm Phase",
        "Cold Phase",
        "Delete Phase"
      ],
      answerIndex: 3,
      explanation:
        "Fase Delete adalah fase akhir yang melakukan pembersihan total data log yang telah melewati batas retensi hukum organisasi.",
    },
    {
      id: "det-ex-14",
      prompt: "Mekanisme pengumpulan data di mana Elastic Agent mendeteksi dan memantau pod-pod baru di Kubernetes secara otomatis dinamakan…",
      options: [
        "Autodiscover (Penemuan Otomatis)",
        "Manual routing",
        "Ingest pipeline",
        "Rollover"
      ],
      answerIndex: 0,
      explanation:
        "Autodiscover membolehkan Elastic Agent mendengarkan Kubernetes API Server untuk langsung memantau kontainer baru saat dijalankan.",
    },
    {
      id: "det-ex-15",
      prompt: "Di manakah asisten AI (Elastic AI Assistant) siber berada untuk membantu analis mengonfirmasi skrip mencurigakan di Kibana?",
      options: [
        "Harus diakses lewat web ChatGPT eksternal",
        "Tersedia terintegrasi langsung di menu chat panel Elastic Security",
        "Di dalam file registry Filebeat",
        "Di dalam BIOS server master"
      ],
      answerIndex: 1,
      explanation:
        "Elastic AI Assistant terintegrasi penuh di dalam konsol SIEM Kibana, membolehkan interaksi chat instan di sisi alert.",
    },
    {
      id: "det-ex-16",
      prompt: "Mengapa 'Alert Fatigue' sangat dihindari dalam operasional Security Operations Center (SOC)?",
      options: [
        "Karena membuat lisensi server habis",
        "Karena kelelahan menghadapi ratusan alarm palsu menurunkan sensitivitas analis siber, berisiko meloloskan serangan siber riil yang fatal",
        "Karena membuat server mati mendadak",
        "Karena kueri pencarian menjadi lambat"
      ],
      answerIndex: 1,
      explanation:
        "Alert Fatigue menurunkan kesiagaan tim siber, sehingga ancaman kritis bisa disalahklasifikasikan sebagai FP dan diabaikan begitu saja.",
    },
    {
      id: "det-ex-17",
      prompt: "Manakah kueri range di KQL untuk mencari lalu lintas data jaringan pada port tujuan di atas 1024?",
      options: [
        "destination.port > 1024",
        "destination.port >= 1024",
        "destination.port : > 1024",
        "port_destination gt 1024"
      ],
      answerIndex: 0,
      explanation:
        "KQL mendukung operator matematika standar seperti '>' atau '<' langsung pada field bertipe numerik.",
    },
    {
      id: "det-ex-18",
      prompt: "Sistem kolaboratif internal di Elastic Security yang berfungsi sebagai wadah koordinasi penanganan insiden serta pelacakan status penugasan tim dinamakan…",
      options: [
        "Timeline",
        "Cases (Kasus)",
        "Fleet",
        "Ingest Node"
      ],
      answerIndex: 1,
      explanation:
        "Cases menyediakan platform penanganan tiket internal yang komprehensif bagi analis siber untuk bekerja secara sinkronus.",
    },
  ],
};
