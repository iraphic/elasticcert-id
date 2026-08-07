import type { Track } from "../types";

export const detectionTrack: Track = {
  id: "track-detection",
  slug: "detection",
  name: "Elastic Certified Detection Engineer",
  tagline: "Bangun deteksi ancaman, investigasi alert, dan lakukan threat hunting.",
  description:
    "Jalur ini mempersiapkan Anda untuk ujian Elastic Certified Detection Engineer. Materinya mencakup Elastic Security dan SIEM, sumber data keamanan, detection rule prebuilt maupun custom, triase alert, threat hunting dengan Timeline, serta tuning rule untuk menekan false positive.",
  audience: "Cocok untuk analis SOC, blue team, dan security engineer yang membangun deteksi.",
  color: "rose",
  icon: "shield",
  examInfo: { questionCount: 12, durationMinutes: 20, passingScore: 70 },
  modules: [
    {
      slug: "pengantar-elastic-security",
      title: "Pengantar Elastic Security & SIEM",
      level: "Dasar",
      durationMinutes: 25,
      intro:
        "Kenali peran Elastic Security sebagai SIEM: mengumpulkan data keamanan, mendeteksi ancaman dengan rule, dan mengelola alert hingga investigasi.",
      sections: [
        {
          heading: "Apa itu SIEM?",
          paragraphs: [
            "SIEM (Security Information and Event Management) adalah platform yang mengumpulkan log dan peristiwa keamanan dari seluruh lingkungan, mengorelasikannya, dan menghasilkan alert saat pola mencurigakan terdeteksi.",
            "Elastic Security menyediakan kemampuan SIEM di atas Elasticsearch: data keamanan disimpan sebagai event, detection rule berjalan berkala, dan hasilnya muncul sebagai alert yang dapat diinvestigasi.",
          ],
        },
        {
          heading: "Alur kerja SOC di Elastic Security",
          paragraphs: [
            "Alur tipikal: data masuk lewat integrasi → detection rule mengevaluasi event → alert dihasilkan → analis melakukan triase → investigasi mendalam di Timeline → alert ditutup atau dieskalasi menjadi kasus (case).",
            "Elastic Security juga menyediakan deteksi endpoint (Elastic Defend), manajemen kasus, dan integrasi response.",
          ],
          codeExample: {
            title: "Melihat alert yang dihasilkan rule",
            lang: "json",
            code: `GET /.alerts-security.alerts-*/_search\n{\n  "size": 5,\n  "sort": [{ "@timestamp": "desc" }],\n  "query": {\n    "term": { "kibana.alert.workflow_status": "open" }\n  }\n}`,
          },
        },
      ],
      keyPoints: [
        "SIEM mengumpulkan, mengorelasikan, dan menganalisis peristiwa keamanan.",
        "Elastic Security = SIEM + keamanan endpoint dalam satu platform.",
        "Detection rule berjalan terjadwal dan menghasilkan alert.",
        "Alur SOC: data → rule → alert → triase → investigasi → case.",
        "Timeline adalah alat investigasi utama di Elastic Security.",
      ],
      quiz: [
        {
          id: "det-m1-q1",
          prompt: "Fungsi utama sebuah SIEM adalah…",
          options: [
            "Membackup database",
            "Mengumpulkan dan mengorelasikan peristiwa keamanan lalu menghasilkan alert",
            "Mengenkripsi seluruh jaringan",
            "Mengganti firewall",
          ],
          answerIndex: 1,
          explanation:
            "SIEM memusatkan log keamanan dari banyak sumber, mengorelasikannya dengan rule, dan menghasilkan alert untuk analis.",
        },
        {
          id: "det-m1-q2",
          prompt: "Urutan alur kerja SOC yang benar di Elastic Security adalah…",
          options: [
            "Alert → data → rule → investigasi",
            "Data → rule → alert → triase → investigasi",
            "Investigasi → data → alert → rule",
            "Rule → case → data → alert",
          ],
          answerIndex: 1,
          explanation:
            "Data dikumpulkan dulu, rule mengevaluasinya, alert dihasilkan, lalu analis melakukan triase dan investigasi.",
        },
        {
          id: "det-m1-q3",
          prompt: "Alat di Elastic Security yang digunakan untuk investigasi mendalam adalah…",
          options: ["Lens", "Timeline", "Canvas", "Dev Tools saja"],
          answerIndex: 1,
          explanation:
            "Timeline memungkinkan analis menyusun kueri, menambahkan catatan, dan merekonstruksi rangkaian kejadian serangan.",
        },
        {
          id: "det-m1-q4",
          prompt: "Komponen Elastic Security yang menyediakan proteksi endpoint adalah…",
          options: ["Metricbeat", "Elastic Defend", "Lens", "ILM"],
          answerIndex: 1,
          explanation:
            "Elastic Defend adalah integrasi endpoint security yang mencegah malware dan merekam aktivitas proses di host.",
        },
      ],
    },
    {
      slug: "sumber-data-keamanan",
      title: "Sumber Data & Integrasi Keamanan",
      level: "Dasar",
      durationMinutes: 30,
      intro:
        "Deteksi hanya sebaik datanya. Pelajari sumber data keamanan utama, Elastic Common Schema (ECS), dan integrasi Elastic Agent.",
      sections: [
        {
          heading: "Sumber data keamanan utama",
          paragraphs: [
            "Kategori penting: log endpoint (proses, autentikasi, PowerShell), log jaringan (firewall, DNS, proxy), log cloud (AWS CloudTrail, Azure, GCP), dan telemetri EDR seperti Elastic Defend.",
            "Cakupan data menentukan cakupan deteksi: rule yang memantau pembuatan proses tidak berguna jika log proses tidak dikumpulkan.",
          ],
        },
        {
          heading: "Elastic Common Schema (ECS)",
          paragraphs: [
            "ECS adalah konvensi penamaan field standar (mis. process.name, source.ip, user.name) sehingga data dari sumber berbeda bisa dikueri dengan cara yang sama.",
            "Semua detection rule prebuilt menulis query berdasarkan field ECS — itulah sebabnya pemetaan data ke ECS sangat penting.",
          ],
          codeExample: {
            title: "Query lintas sumber berkat ECS",
            lang: "json",
            code: `GET /logs-*/_search\n{\n  "query": {\n    "bool": {\n      "must": [\n        { "term": { "event.category": "process" } },\n        { "term": { "process.name": "powershell.exe" } }\n      ]\n    }\n  }\n}`,
          },
        },
        {
          heading: "Integrasi Elastic Agent",
          paragraphs: [
            "Integrasi siap pakai (Windows, System, AWS, Okta, dan ratusan lainnya) mengurus pengumpulan, parsing, dan pemetaan ECS secara otomatis melalui Fleet.",
            "Cukup pasang Elastic Agent di host dan aktifkan integrasi yang dibutuhkan dari Kibana.",
          ],
        },
      ],
      keyPoints: [
        "Sumber data utama: endpoint, jaringan, cloud, dan EDR.",
        "Cakupan deteksi dibatasi cakupan data yang dikumpulkan.",
        "ECS menstandarkan nama field lintas sumber data.",
        "Rule prebuilt ditulis berdasarkan field ECS.",
        "Integrasi Elastic Agent mengotomasi parsing dan pemetaan ECS.",
      ],
      quiz: [
        {
          id: "det-m2-q1",
          prompt: "Apa itu Elastic Common Schema (ECS)?",
          options: [
            "Bahasa query baru",
            "Konvensi penamaan field standar untuk event dari berbagai sumber",
            "Plugin antivirus",
            "Format file log Windows",
          ],
          answerIndex: 1,
          explanation:
            "ECS menstandarkan nama field seperti process.name dan source.ip sehingga satu query bekerja untuk banyak sumber data.",
        },
        {
          id: "det-m2-q2",
          prompt: "Mengapa rule prebuilt bergantung pada pemetaan ECS?",
          options: [
            "Karena rule ditulis dengan query terhadap field ECS",
            "Karena ECS lebih cepat",
            "Karena ECS wajib oleh lisensi",
            "Karena ECS mengenkripsi data",
          ],
          answerIndex: 0,
          explanation:
            "Jika data tidak dipetakan ke field ECS yang dipakai rule, query rule tidak akan menemukan kecocokan dan deteksi gagal.",
        },
        {
          id: "det-m2-q3",
          prompt: "Rule yang mendeteksi proses mencurigakan membutuhkan sumber data…",
          options: [
            "Log DNS saja",
            "Log endpoint/telemetri proses",
            "Log aplikasi web saja",
            "Metrik CPU",
          ],
          answerIndex: 1,
          explanation:
            "Deteksi berbasis proses memerlukan event pembuatan proses dari endpoint, mis. lewat Elastic Defend atau integrasi Windows/Sysmon.",
        },
        {
          id: "det-m2-q4",
          prompt: "Cara termudah mengumpulkan log Windows ke Elastic Security adalah…",
          options: [
            "Menulis parser manual dari nol",
            "Mengaktifkan integrasi Windows pada Elastic Agent lewat Fleet",
            "Menyalin file log manual",
            "Menggunakan Metricbeat modul system",
          ],
          answerIndex: 1,
          explanation:
            "Integrasi Windows di Fleet sudah menyertakan pengumpulan event log, parsing, dan pemetaan ECS secara otomatis.",
        },
      ],
    },
    {
      slug: "detection-rules",
      title: "Detection Rules: Prebuilt & Custom",
      level: "Menengah",
      durationMinutes: 40,
      intro:
        "Elastic Security menyediakan ratusan rule prebuilt selaras MITRE ATT&CK. Pelajari tipe rule dan cara menulis custom rule dengan KQL.",
      sections: [
        {
          heading: "Rule prebuilt dan MITRE ATT&CK",
          paragraphs: [
            "Elastic menyediakan lebih dari seribu rule prebuilt yang dipetakan ke taktik dan teknik MITRE ATT&CK. Rule ini dikelola tim riset Elastic dan diperbarui berkala.",
            "Aktifkan rule yang relevan dengan sumber data Anda — mengaktifkan semuanya tanpa data pendukung hanya menimbulkan kebisingan.",
          ],
        },
        {
          heading: "Tipe-tipe rule",
          paragraphs: [
            "Custom query: satu query KQL, alert per kecocokan. Threshold: alert bila jumlah kejadian melewati ambang dalam jendela waktu. Event correlation (EQL): mendeteksi rangkaian kejadian berurutan. Machine learning: mendeteksi anomali perilaku.",
            "Indicator match mencocokkan event dengan threat intelligence (daftar IP/domain/hash berbahaya).",
          ],
          codeExample: {
            title: "Contoh query KQL untuk custom rule",
            lang: "bash",
            code: `event.category : "process" and process.name : "powershell.exe" and process.args : ("*-enc*" or "*-EncodedCommand*")`,
          },
        },
        {
          heading: "Menulis custom rule",
          paragraphs: [
            "Langkah umum: tentukan hipotesis ancaman → tulis dan uji query di Discover/Timeline → buat rule dengan jadwal dan lookback → tambahkan konteks MITRE dan severity → uji dengan data historis sebelum diaktifkan.",
            "Perhatikan lookback interval: rule berjalan terjadwal, jadi lookback harus lebih panjang dari interval agar tidak ada celah deteksi.",
          ],
          codeExample: {
            title: "Threshold: banyak kegagalan login dari satu IP",
            lang: "bash",
            code: `event.category : "authentication" and event.outcome : "failure"\n# Threshold rule: source.ip >= 10 kejadian dalam 5 menit`,
          },
        },
      ],
      keyPoints: [
        "Rule prebuilt dipetakan ke MITRE ATT&CK dan diperbarui Elastic.",
        "Tipe rule: custom query, threshold, EQL, ML, indicator match.",
        "KQL adalah bahasa utama custom query rule.",
        "Lookback harus ≥ interval jadwal agar tidak ada celah deteksi.",
        "Selalu uji rule dengan data historis sebelum produksi.",
      ],
      quiz: [
        {
          id: "det-m3-q1",
          prompt: "Rule tipe threshold cocok untuk mendeteksi…",
          options: [
            "Satu proses spesifik berjalan",
            "Brute force: banyak kegagalan login dari satu sumber dalam waktu singkat",
            "Perubahan mapping indeks",
            "Ukuran shard",
          ],
          answerIndex: 1,
          explanation:
            "Threshold rule menghitung agregasi (mis. jumlah kegagalan per source.ip) dan memicu alert bila melewati ambang dalam jendela waktu.",
        },
        {
          id: "det-m3-q2",
          prompt: "Bahasa query yang digunakan custom query rule adalah…",
          options: ["SQL", "KQL (atau Lucene)", "Python", "Regex saja"],
          answerIndex: 1,
          explanation:
            "Custom query rule mengevaluasi query KQL (atau Lucene) terhadap indeks event keamanan sesuai jadwal.",
        },
        {
          id: "det-m3-q3",
          prompt: "Mengapa lookback interval harus lebih panjang dari jadwal rule?",
          options: [
            "Agar query lebih cepat",
            "Agar tidak ada celah waktu di mana event terlewat deteksi",
            "Agar indeks lebih kecil",
            "Agar MITRE mapping benar",
          ],
          answerIndex: 1,
          explanation:
            "Lookback yang lebih panjang dari interval menjamin jendela evaluasi berurutan saling tumpang tindih sehingga tidak ada event yang lolos.",
        },
        {
          id: "det-m3-q4",
          prompt: "Rule tipe apa yang mencocokkan event dengan daftar indikator threat intelligence?",
          options: ["Custom query", "Indicator match", "New terms saja", "ML saja"],
          answerIndex: 1,
          explanation:
            "Indicator match membandingkan field event (mis. destination.ip) dengan indeks indikator ancaman dan memicu alert saat cocok.",
        },
        {
          id: "det-m3-q5",
          prompt: "Rule prebuilt Elastic dipetakan ke framework…",
          options: ["OWASP", "MITRE ATT&CK", "ISO 27001", "PCI DSS"],
          answerIndex: 1,
          explanation:
            "Setiap rule prebuilt ditandai taktik dan teknik MITRE ATT&CK sehingga analis memahami konteks serangan yang dideteksi.",
        },
      ],
    },
    {
      slug: "triase-investigasi-alert",
      title: "Triase & Investigasi Alert",
      level: "Menengah",
      durationMinutes: 35,
      intro:
        "Alert hanyalah titik awal. Pelajari cara menilai alert, mengubah statusnya, dan menyelidiki konteksnya secara sistematis.",
      sections: [
        {
          heading: "Triase: menilai alert dengan cepat",
          paragraphs: [
            "Triase menjawab: apakah alert ini ancaman nyata, false positive, atau perilaku yang dapat dijelaskan? Periksa severity, rule pemicu, host dan pengguna terdampak, serta prevalensi (seberapa sering pola ini terjadi).",
            "Alert memiliki status workflow: open, acknowledged (sedang ditangani), dan closed.",
          ],
        },
        {
          heading: "Menggali konteks alert",
          paragraphs: [
            "Halaman detail alert menampilkan seluruh field event. Perhatikan rantai proses (parent → child), pengguna, argumen perintah, dan koneksi jaringan terkait.",
            "Analyzer visual (session view / analyzer) menggambarkan pohon proses sehingga mudah melihat, misalnya, winword.exe yang menjalankan powershell.exe — pola klasik dokumen berbahaya.",
          ],
          codeExample: {
            title: "Mencari event terkait di sekitar waktu alert",
            lang: "json",
            code: `GET /logs-*/_search\n{\n  "query": {\n    "bool": {\n      "must": [\n        { "term": { "host.id": "a1b2c3" } },\n        { "range": { "@timestamp": {\n          "gte": "2024-06-01T10:00:00Z",\n          "lte": "2024-06-01T10:15:00Z"\n        } } }\n      ]\n    }\n  },\n  "sort": [{ "@timestamp": "asc" }]\n}`,
          },
        },
      ],
      keyPoints: [
        "Triase menentukan: ancaman nyata, false positive, atau dapat dijelaskan.",
        "Status workflow alert: open → acknowledged → closed.",
        "Detail alert menyediakan seluruh field event untuk konteks.",
        "Pohon proses (parent-child) sering mengungkap teknik serangan.",
        "Prevalensi pola membantu menilai kejanggalan sebuah alert.",
      ],
      quiz: [
        {
          id: "det-m4-q1",
          prompt: "Tujuan utama triase alert adalah…",
          options: [
            "Menghapus alert sebanyak mungkin",
            "Menentukan apakah alert ancaman nyata, false positive, atau perilaku wajar",
            "Mengubah mapping indeks",
            "Menonaktifkan semua rule",
          ],
          answerIndex: 1,
          explanation:
            "Triase adalah penilaian awal untuk memprioritaskan: mana yang perlu investigasi penuh dan mana yang dapat ditutup.",
        },
        {
          id: "det-m4-q2",
          prompt: "Urutan status workflow alert yang umum adalah…",
          options: [
            "closed → open → acknowledged",
            "open → acknowledged → closed",
            "acknowledged → closed → open",
            "open → closed → open",
          ],
          answerIndex: 1,
          explanation:
            "Alert baru berstatus open, ditandai acknowledged saat ditangani analis, dan closed setelah investigasi selesai.",
        },
        {
          id: "det-m4-q3",
          prompt: "winword.exe menjalankan powershell.exe adalah indikator…",
          options: [
            "Aktivitas normal yang selalu aman",
            "Pola klasik dokumen berbahaya (macro/exploit menjalankan shell)",
            "Masalah lisensi Office",
            "Kegagalan shard",
          ],
          answerIndex: 1,
          explanation:
            "Aplikasi produktivitas yang memunculkan shell/scripting engine adalah pola umum serangan phishing berbasis dokumen.",
        },
        {
          id: "det-m4-q4",
          prompt: "Langkah pertama saat membuka detail alert adalah…",
          options: [
            "Langsung menutup alert",
            "Memeriksa field event, host, pengguna, dan konteks rule pemicu",
            "Menghapus indeks",
            "Mematikan agent",
          ],
          answerIndex: 1,
          explanation:
            "Memahami konteks (rule, host, user, field event) adalah dasar penilaian sebelum keputusan eskalasi atau penutupan.",
        },
      ],
    },
    {
      slug: "threat-hunting",
      title: "Threat Hunting dengan Timeline & KQL",
      level: "Lanjutan",
      durationMinutes: 35,
      intro:
        "Threat hunting adalah pencarian ancaman secara proaktif berbasis hipotesis, bukan menunggu alert. Kuasi Timeline dan pola query hunting.",
      sections: [
        {
          heading: "Hunting berbasis hipotesis",
          paragraphs: [
            "Hunting dimulai dari hipotesis, misalnya: 'penyerang mungkin menyalahgunakan PowerShell terenkripsi di lingkungan kami'. Anda lalu menulis query untuk membuktikan atau membantahnya.",
            "Berbeda dengan triase (reaktif terhadap alert), hunting bersifat proaktif — mencari ancaman yang lolos dari deteksi otomatis.",
          ],
        },
        {
          heading: "Timeline untuk investigasi",
          paragraphs: [
            "Timeline adalah lembar kerja investigasi: tulis query KQL, lihat event yang cocok secara kronologis, sematkan (pin) event penting, tambahkan catatan, dan simpan sebagai bukti.",
            "Timeline yang berisi temuan dapat dilampirkan ke case untuk eskalasi ke tim response.",
          ],
          codeExample: {
            title: "Query hunting: PowerShell dengan perintah terenkripsi",
            lang: "bash",
            code: `event.category : "process" and process.name : "powershell.exe" and process.args : "*-enc*"`,
          },
        },
        {
          heading: "Pola query hunting yang umum",
          paragraphs: [
            "Beberapa pola produktif: proses langka (rare process) di seluruh host, koneksi keluar ke domain/IP jarang, akun yang login di banyak host sekaligus, dan perubahan pada run key/registry persistence.",
            "Agregasi terms membantu menemukan anomali frekuensi: nilai yang muncul sangat jarang sering menarik untuk diperiksa.",
          ],
          codeExample: {
            title: "Mencari proses langka lewat agregasi",
            lang: "json",
            code: `GET /logs-*/_search\n{\n  "size": 0,\n  "query": {\n    "term": { "event.category": "process" }\n  },\n  "aggs": {\n    "proses_langka": {\n      "terms": { "field": "process.name", "size": 20, "order": { "_count": "asc" } }\n    }\n  }\n}`,
          },
        },
      ],
      keyPoints: [
        "Hunting bersifat proaktif dan berbasis hipotesis.",
        "Timeline menyusun event kronologis, pin, dan catatan investigasi.",
        "Temuan Timeline dapat dilampirkan ke case.",
        "Pola hunting: proses langka, koneksi jarang, login tidak biasa.",
        "Agregasi terms dengan urutan count menaik menemukan nilai langka.",
      ],
      quiz: [
        {
          id: "det-m5-q1",
          prompt: "Perbedaan utama threat hunting dan triase alert adalah…",
          options: [
            "Hunting proaktif berbasis hipotesis; triase reaktif terhadap alert",
            "Hunting hanya di malam hari",
            "Triase tidak memakai data",
            "Tidak ada perbedaan",
          ],
          answerIndex: 0,
          explanation:
            "Triase merespons alert yang sudah ada; hunting aktif mencari ancaman yang belum terdeteksi rule berdasarkan hipotesis.",
        },
        {
          id: "det-m5-q2",
          prompt: "Fitur Timeline untuk menandai event penting agar tidak hilang dari perhatian adalah…",
          options: ["Delete", "Pin (sematkan)", "Refresh", "Export"],
          answerIndex: 1,
          explanation:
            "Pin menyematkan event penting di Timeline sehingga tetap terlihat saat query diubah selama investigasi.",
        },
        {
          id: "det-m5-q3",
          prompt: "Agregasi terms dengan order _count ascending berguna untuk…",
          options: [
            "Menemukan nilai paling umum",
            "Menemukan nilai paling langka yang berpotensi mencurigakan",
            "Menghapus duplikat",
            "Mengurutkan tanggal",
          ],
          answerIndex: 1,
          explanation:
            "Mengurutkan dari jumlah terkecil menampilkan proses/domain/langka yang jarang terlihat — kandidat kuat untuk diperiksa.",
        },
        {
          id: "det-m5-q4",
          prompt: "Setelah menemukan bukti di Timeline, langkah eskalasi yang tepat adalah…",
          options: [
            "Menghapus timeline",
            "Melampirkan Timeline ke case untuk ditangani tim response",
            "Mematikan rule",
            "Mengubah password sendiri",
          ],
          answerIndex: 1,
          explanation:
            "Case mengumpulkan bukti investigasi (termasuk Timeline) sehingga tim incident response dapat menindaklanjuti secara terdokumentasi.",
        },
      ],
    },
    {
      slug: "tuning-false-positive",
      title: "Tuning Rule & False Positive",
      level: "Siap Ujian",
      durationMinutes: 30,
      intro:
        "Modul penutup jalur Detection: mengukur kualitas deteksi, menekan false positive dengan exception, dan menjaga kesehatan rule secara berkala.",
      sections: [
        {
          heading: "Mengapa false positive berbahaya",
          paragraphs: [
            "False positive yang berlebihan menyebabkan alert fatigue: analis kelelahan dan mulai mengabaikan alert, sehingga ancaman nyata ikut terlewat.",
            "Tujuan tuning bukan nol alert, melainkan rasio sinyal-ke-bising yang sehat: mayoritas alert layak ditindaklanjuti.",
          ],
        },
        {
          heading: "Rule exception",
          paragraphs: [
            "Exception mengecualikan kondisi spesifik dari rule tanpa mematikan seluruh deteksi. Contoh: rule PowerShell terenkripsi tetap aktif, tetapi pengecualian dibuat untuk script deployment resmi yang sah.",
            "Exception harus sesempit mungkin (kombinasi field spesifik) dan didokumentasikan alasannya, karena exception yang terlalu luas membuka celah bagi penyerang.",
          ],
          codeExample: {
            title: "Contoh exception sempit untuk rule",
            lang: "bash",
            code: `# Rule: powershell dengan -enc\n# Exception (aktivitas sah):\nprocess.name : "powershell.exe" and user.name : "svc-deploy" and host.name : "ci-runner-01"`,
          },
        },
        {
          heading: "Menjaga kesehatan deteksi",
          paragraphs: [
            "Lakukan review berkala: rule mana yang tidak pernah berbunyi (mungkin datanya tidak ada), mana yang terlalu bising (perlu exception/threshold), dan pantau gap cakupan MITRE ATT&CK.",
            "Pantau juga performa rule: rule yang sering timeout menandakan query terlalu berat atau data terlalu besar.",
          ],
        },
      ],
      keyPoints: [
        "Alert fatigue membuat ancaman nyata ikut diabaikan.",
        "Exception mengecualikan kondisi sah tanpa mematikan rule.",
        "Exception harus sempit, spesifik, dan terdokumentasi.",
        "Review berkala: rule sunyi, rule bising, dan gap cakupan MITRE.",
        "Rule yang timeout perlu dioptimalkan query-nya.",
      ],
      quiz: [
        {
          id: "det-m6-q1",
          prompt: "Apa itu alert fatigue?",
          options: [
            "Alert yang terlalu cepat",
            "Kelelahan analis akibat banjir alert sehingga ancaman nyata terabaikan",
            "Alert tanpa severity",
            "Rule yang tidur",
          ],
          answerIndex: 1,
          explanation:
            "Volume alert berlebihan (mayoritas false positive) membuat analis mati rasa dan mulai menutup alert tanpa investigasi layak.",
        },
        {
          id: "det-m6-q2",
          prompt: "Cara yang benar menangani aktivitas sah yang memicu rule adalah…",
          options: [
            "Menonaktifkan rule sepenuhnya",
            "Menambahkan exception yang sempit dan spesifik",
            "Menghapus data sumber",
            "Menaikkan severity",
          ],
          answerIndex: 1,
          explanation:
            "Exception menjaga deteksi tetap aktif untuk semua kasus lain sambil mengecualikan pola sah yang sudah diverifikasi.",
        },
        {
          id: "det-m6-q3",
          prompt: "Mengapa exception harus dibuat sesempit mungkin?",
          options: [
            "Agar query lebih pendek",
            "Agar tidak membuka celah yang dapat disalahgunakan penyerang",
            "Agar lebih cepat diketik",
            "Agar indeks kecil",
          ],
          answerIndex: 1,
          explanation:
            "Exception luas (mis. seluruh host dikecualikan) menciptakan blind spot yang dapat dieksploitasi penyerang untuk menghindari deteksi.",
        },
        {
          id: "det-m6-q4",
          prompt: "Rule yang tidak pernah menghasilkan alert dalam waktu lama sebaiknya…",
          options: [
            "Dibiarkan saja",
            "Diperiksa apakah data sumbernya benar-benar masuk dan query-nya valid",
            "Langsung dihapus tanpa cek",
            "Digandakan",
          ],
          answerIndex: 1,
          explanation:
            "Rule sunyi bisa berarti lingkungan bersih — atau data sumber tidak mengalir/query salah. Verifikasi data adalah langkah pertama.",
        },
      ],
    },
  ],
  examQuestions: [
    {
      id: "det-ex-1",
      prompt: "SIEM berfungsi untuk…",
      options: [
        "Mengelola karyawan",
        "Memusatkan, mengorelasikan, dan menganalisis peristiwa keamanan",
        "Mengganti sistem operasi",
        "Mempercepat internet",
      ],
      answerIndex: 1,
      explanation:
        "SIEM adalah tulang punggung SOC: pengumpulan log keamanan, korelasi, deteksi, dan manajemen alert dalam satu platform.",
    },
    {
      id: "det-ex-2",
      prompt: "Elastic Common Schema (ECS) penting karena…",
      options: [
        "Membuat data lebih besar",
        "Menstandarkan nama field sehingga satu query/rule berlaku lintas sumber data",
        "Mengenkripsi log",
        "Menghapus duplikat host",
      ],
      answerIndex: 1,
      explanation:
        "Tanpa ECS, tiap sumber memakai nama field berbeda dan rule tidak dapat bekerja lintas sumber.",
    },
    {
      id: "det-ex-3",
      prompt: "Tipe rule yang mendeteksi rangkaian kejadian berurutan (mis. download lalu eksekusi) adalah…",
      options: ["Custom query", "Event correlation (EQL)", "Threshold", "New terms"],
      answerIndex: 1,
      explanation:
        "EQL (Event Query Language) mencocokkan sekuens event yang terjadi berurutan — pola yang tidak bisa ditangkap query tunggal.",
    },
    {
      id: "det-ex-4",
      prompt: "Rule threshold paling tepat untuk…",
      options: [
        "Mendeteksi satu hash malware",
        "Mendeteksi brute force: jumlah kegagalan login melewati ambang dalam jendela waktu",
        "Mendeteksi anomali ML",
        "Mendeteksi proses langka",
      ],
      answerIndex: 1,
      explanation:
        "Threshold rule mengagregasi kejadian per entitas (mis. source.ip) dan berbunyi saat jumlah melewati batas dalam periode tertentu.",
    },
    {
      id: "det-ex-5",
      prompt: "Status workflow alert yang menandakan sedang ditangani analis adalah…",
      options: ["open", "acknowledged", "closed", "deleted"],
      answerIndex: 1,
      explanation:
        "acknowledged menandai alert telah diambil dan sedang diinvestigasi, mencegah duplikasi penanganan oleh analis lain.",
    },
    {
      id: "det-ex-6",
      prompt: "winword.exe → powershell.exe pada pohon proses mengindikasikan…",
      options: [
        "Update Windows normal",
        "Potensi dokumen berbahaya yang menjalankan script",
        "Kegagalan jaringan",
        "Printer rusak",
      ],
      answerIndex: 1,
      explanation:
        "Aplikasi Office yang memunculkan shell adalah teknik umum phishing; analyzer visual membantu melihat rantai ini dengan jelas.",
    },
    {
      id: "det-ex-7",
      prompt: "Threat hunting dimulai dari…",
      options: [
        "Alert yang sudah ada",
        "Hipotesis tentang kemungkinan ancaman",
        "Penghapusan indeks",
        "Pembelian lisensi",
      ],
      answerIndex: 1,
      explanation:
        "Hunting bersifat proaktif: analis merumuskan hipotesis lalu mencari bukti di data, bukan menunggu rule berbunyi.",
    },
    {
      id: "det-ex-8",
      prompt: "Fitur Timeline yang menyimpan bukti investigasi dan dapat dieskalasi adalah…",
      options: [
        "Filter cepat",
        "Pin, catatan, dan lampiran ke case",
        "Dark mode",
        "Auto refresh",
      ],
      answerIndex: 1,
      explanation:
        "Event yang di-pin dan catatan analis terdokumentasi di Timeline, yang kemudian bisa dilampirkan ke case.",
    },
    {
      id: "det-ex-9",
      prompt: "Solusi tepat untuk false positive berulang dari aktivitas sah adalah…",
      options: [
        "Mematikan rule",
        "Membuat rule exception yang sempit dan terdokumentasi",
        "Menghapus log",
        "Mengabaikan semua alert",
      ],
      answerIndex: 1,
      explanation:
        "Exception mempertahankan cakupan deteksi sambil menekan derau dari pola sah yang sudah diverifikasi.",
    },
    {
      id: "det-ex-10",
      prompt: "Alert fatigue disebabkan oleh…",
      options: [
        "Terlalu sedikit rule",
        "Volume alert berlebihan yang mayoritas false positive",
        "Kibana terlalu cepat",
        "Indeks terlalu kecil",
      ],
      answerIndex: 1,
      explanation:
        "Banjir alert berkualitas rendah membuat analis kelelahan dan cenderung menutup alert tanpa investigasi memadai.",
    },
    {
      id: "det-ex-11",
      prompt: "Rule indicator match membutuhkan…",
      options: [
        "Indeks indikator threat intelligence (IP/domain/hash berbahaya)",
        "Dashboard Canvas",
        "File CSV di laptop analis",
        "Mapping keyword saja",
      ],
      answerIndex: 0,
      explanation:
        "Indicator match membandingkan field event dengan dokumen indikator ancaman yang tersimpan di indeks khusus.",
    },
    {
      id: "det-ex-12",
      prompt: "Alasan lookback interval rule harus melebihi jadwalnya adalah…",
      options: [
        "Agar tampilan lebih rapi",
        "Agar jendela evaluasi bertumpang tindih dan tidak ada event yang terlewat",
        "Agar severity naik",
        "Agar MITRE lengkap",
      ],
      answerIndex: 1,
      explanation:
        "Lookback yang lebih panjang dari interval eksekusi menjamin kontinuitas deteksi meski ada keterlambatan penjadwalan.",
    },
    {
      id: "det-ex-13",
      prompt: "Rule EQL paling tepat digunakan ketika…",
      options: [
        "Hanya perlu menghitung jumlah event",
        "Perlu mendeteksi urutan kejadian berkorelasi, mis. proses A diikuti koneksi jaringan dalam waktu singkat",
        "Data tidak memiliki timestamp",
        "Hanya untuk data metrik",
      ],
      answerIndex: 1,
      explanation:
        "Event Query Language mendukung sequence sehingga pola bertahap (serangan multi-langkah) dapat dideteksi sebagai satu alert.",
    },
    {
      id: "det-ex-14",
      prompt: "Di MITRE ATT&CK, perbedaan tactic dan technique adalah…",
      options: [
        "Sama saja, hanya beda ejaan",
        "Tactic adalah tujuan penyerang (mengapa), technique adalah cara mencapainya (bagaimana)",
        "Tactic hanya untuk malware",
        "Technique adalah nama produk keamanan",
      ],
      answerIndex: 1,
      explanation:
        "Tactic menggambarkan sasaran tahap serangan (mis. Persistence), sedangkan technique menjelaskan metode spesifik mencapai sasaran itu.",
    },
    {
      id: "det-ex-15",
      prompt: "Host isolation pada Elastic Defend berguna untuk…",
      options: [
        "Mempercepat pencarian",
        "Mengisolasi endpoint dari jaringan untuk menghentikan penyebaran ancaman saat respons insiden",
        "Menghapus indeks lama",
        "Mengubah severity alert",
      ],
      answerIndex: 1,
      explanation:
        "Isolasi host memutus konektivitas jaringan endpoint terinfeksi (kecuali ke Elastic) sehingga lateral movement dan eksfiltrasi terhenti.",
    },
    {
      id: "det-ex-16",
      prompt: "New terms rule mendeteksi…",
      options: [
        "Nilai field yang belum pernah terlihat sebelumnya dalam riwayat data",
        "Event tanpa field",
        "Dokumen berukuran besar",
        "Field yang dihapus mapping-nya",
      ],
      answerIndex: 0,
      explanation:
        "New terms membandingkan nilai field baru terhadap riwayat — cocok untuk mendeteksi hal ganjil seperti host atau proses yang baru pertama muncul.",
    },
    {
      id: "det-ex-17",
      prompt: "Manfaat utama menandai alert dengan workflow status (open/acknowledged/closed) adalah…",
      options: [
        "Menghapus alert lama",
        "Melacak siklus triase sehingga tidak ada alert yang terlewat atau dikerjakan dua kali",
        "Mengubah rule severity",
        "Mempercepat indexing",
      ],
      answerIndex: 1,
      explanation:
        "Status workflow mendokumentasikan progres penanganan tiap alert, penting untuk akuntabilitas tim SOC dan pengukuran waktu respons.",
    },
    {
      id: "det-ex-18",
      prompt: "Value list di Elastic Security biasa dipakai untuk…",
      options: [
        "Daftar IP/domain/hash internal yang dirujuk rule exception atau rule indicator",
        "Menyimpan password analis",
        "Konfigurasi shard",
        "Template dashboard",
      ],
      answerIndex: 0,
      explanation:
        "Value list menyimpan kumpulan nilai (allowlist/blocklist) yang dapat direferensikan banyak rule dan exception sehingga pemeliharaan terpusat.",
    },
  ],
};
