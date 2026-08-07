import type { Track } from "../types";

export const engineerTrack: Track = {
  id: "track-engineer",
  slug: "engineer",
  name: "Elastic Certified Engineer",
  tagline: "Kuasi inti Elasticsearch: indexing, query, hingga manajemen cluster.",
  description:
    "Jalur ini mempersiapkan Anda untuk ujian Elastic Certified Engineer. Anda akan belajar cara kerja Elasticsearch dari dasar, menulis dan mengelola dokumen, merancang mapping, menyusun query DSL, membuat agregasi, serta mengelola cluster dan shard.",
  audience: "Cocok untuk backend engineer, data engineer, dan administrator platform pencarian.",
  color: "teal",
  icon: "server",
  examInfo: { questionCount: 12, durationMinutes: 20, passingScore: 70 },
  modules: [
    {
      slug: "pengenalan-elasticsearch",
      title: "Pengenalan Elasticsearch",
      level: "Dasar",
      durationMinutes: 25,
      intro:
        "Modul pertama ini membangun fondasi konseptual: apa itu Elasticsearch, bagaimana data diorganisasikan, dan bagaimana berkomunikasi dengan REST API.",
      sections: [
        {
          heading: "Apa itu Elasticsearch?",
          paragraphs: [
            "Elasticsearch adalah mesin pencarian dan analitik terdistribusi yang dibangun di atas Apache Lucene. Data disimpan sebagai dokumen JSON dan dapat dicari hampir real-time, biasanya dalam hitungan detik setelah ditulis.",
            "Elasticsearch sangat populer untuk pencarian teks penuh, analitik log, observabilitas, dan keamanan. Ia dirancang untuk skala horizontal: menambah node baru berarti menambah kapasitas.",
          ],
        },
        {
          heading: "Konsep inti: indeks, dokumen, dan shard",
          paragraphs: [
            "Dokumen adalah unit data terkecil, berupa objek JSON. Kumpulan dokumen sejenis disimpan dalam indeks. Setiap indeks dipecah menjadi satu atau lebih shard (pecahan) agar bisa didistribusikan ke banyak node.",
            "Setiap shard dapat memiliki replica (salinan) untuk ketersediaan tinggi dan mempercepat pencarian paralel.",
          ],
          codeExample: {
            title: "Membuat indeks dengan 1 shard utama dan 1 replica",
            lang: "json",
            code: `PUT /produk\n{\n  "settings": {\n    "number_of_shards": 1,\n    "number_of_replicas": 1\n  }\n}`,
          },
        },
        {
          heading: "Berkomunikasi lewat REST API",
          paragraphs: [
            "Semua operasi dilakukan lewat HTTP: GET untuk membaca, PUT/POST untuk menulis, DELETE untuk menghapus. Endpoint diawali nama indeks, misalnya GET /produk/_search untuk mencari di indeks produk.",
            "Di Kibana, Dev Tools menyediakan konsol untuk menjalankan request seperti contoh di bawah tanpa perlu menulis curl.",
          ],
          codeExample: {
            title: "Memeriksa kesehatan cluster",
            lang: "bash",
            code: `curl -X GET "http://localhost:9200/_cluster/health?pretty"`,
          },
        },
      ],
      keyPoints: [
        "Elasticsearch dibangun di atas Apache Lucene dan bersifat terdistribusi.",
        "Dokumen adalah objek JSON; dokumen dikelompokkan dalam indeks.",
        "Indeks dipecah menjadi shard; replica memberikan redundansi.",
        "Interaksi utama melalui REST API (GET, PUT, POST, DELETE).",
        "Data tersedia untuk dicari hampir real-time (near real-time).",
      ],
      quiz: [
        {
          id: "eng-m1-q1",
          prompt: "Apa yang dimaksud dengan dokumen dalam Elasticsearch?",
          options: [
            "File PDF yang diunggah ke cluster",
            "Unit data terkecil berupa objek JSON",
            "Konfigurasi mapping indeks",
            "Log sistem operasi node",
          ],
          answerIndex: 1,
          explanation:
            "Dokumen adalah unit data terkecil di Elasticsearch dan selalu berbentuk objek JSON yang disimpan dalam sebuah indeks.",
        },
        {
          id: "eng-m1-q2",
          prompt: "Mengapa indeks dipecah menjadi shard?",
          options: [
            "Agar mapping lebih sederhana",
            "Agar data dapat didistribusikan ke banyak node dan diskalakan horizontal",
            "Agar query lebih lambat tapi aman",
            "Agar dokumen terenkripsi otomatis",
          ],
          answerIndex: 1,
          explanation:
            "Shard memungkinkan indeks dibagi ke beberapa node sehingga kapasitas penyimpanan dan pencarian meningkat seiring penambahan node.",
        },
        {
          id: "eng-m1-q3",
          prompt: "HTTP method apa yang digunakan untuk membaca hasil pencarian?",
          options: ["DELETE", "PUT", "GET", "PATCH"],
          answerIndex: 2,
          explanation:
            "Pencarian dilakukan dengan GET (atau POST) ke endpoint _search, misalnya GET /produk/_search.",
        },
        {
          id: "eng-m1-q4",
          prompt: "Apa fungsi replica shard?",
          options: [
            "Mempercepat penulisan mapping",
            "Menyediakan salinan shard untuk ketersediaan tinggi dan pencarian paralel",
            "Menghapus dokumen lama secara otomatis",
            "Mengubah tipe data field",
          ],
          answerIndex: 1,
          explanation:
            "Replica adalah salinan shard utama yang menjaga data tetap tersedia saat node gagal dan dapat melayani request pencarian.",
        },
      ],
    },
    {
      slug: "indexing-dan-dokumen",
      title: "Indexing & Dokumen",
      level: "Dasar",
      durationMinutes: 30,
      intro:
        "Pelajari cara menulis, membaca, memperbarui, dan menghapus dokumen, serta mengenal operasi bulk untuk penulisan massal yang efisien.",
      sections: [
        {
          heading: "Menulis dokumen",
          paragraphs: [
            "Dokumen ditulis ke indeks dengan PUT (ID ditentukan sendiri) atau POST (ID dibuat otomatis). Jika dokumen dengan ID yang sama sudah ada, PUT akan menimpanya sepenuhnya.",
            "Setiap dokumen memiliki metadata seperti _index, _id, dan _version. Nomor versi bertambah setiap kali dokumen diubah.",
          ],
          codeExample: {
            title: "Menulis dokumen dengan ID eksplisit",
            lang: "json",
            code: `PUT /produk/_doc/1\n{\n  "nama": "Laptop Pro 14",\n  "harga": 18500000,\n  "kategori": "elektronik",\n  "stok": 12\n}`,
          },
        },
        {
          heading: "Membaca, memperbarui, menghapus",
          paragraphs: [
            "GET /produk/_doc/1 membaca dokumen. Pembaruan parsial dilakukan dengan POST /_update sehingga Anda tidak perlu mengirim ulang seluruh dokumen. DELETE menghapus dokumen berdasarkan ID.",
            "Perubahan dokumen tidak langsung terlihat di pencarian sampai proses refresh terjadi (default setiap 1 detik).",
          ],
          codeExample: {
            title: "Memperbarui sebagian field",
            lang: "json",
            code: `POST /produk/_update/1\n{\n  "doc": {\n    "stok": 10\n  }\n}`,
          },
        },
        {
          heading: "Bulk API untuk penulisan massal",
          paragraphs: [
            "Bulk API memungkinkan banyak operasi (index, update, delete) dalam satu request HTTP. Ini jauh lebih efisien dibanding mengirim satu request per dokumen.",
            "Formatnya NDJSON: setiap baris aksi diikuti baris payload. Perhatikan bahwa setiap baris harus diakhiri newline.",
          ],
          codeExample: {
            title: "Menulis banyak dokumen sekaligus",
            lang: "json",
            code: `POST /produk/_bulk\n{ "index": { "_id": "2" } }\n{ "nama": "Mouse Wireless", "harga": 250000, "kategori": "aksesori" }\n{ "index": { "_id": "3" } }\n{ "nama": "Keyboard Mekanik", "harga": 950000, "kategori": "aksesori" }`,
          },
        },
      ],
      keyPoints: [
        "PUT menulis/menimpa dokumen dengan ID tertentu; POST membuat ID otomatis.",
        "POST /_update memungkinkan pembaruan parsial tanpa menimpa seluruh dokumen.",
        "Refresh default 1 detik membuat pencarian bersifat near real-time.",
        "Bulk API menggabungkan banyak operasi dalam satu request NDJSON.",
        "Nomor _version bertambah pada setiap perubahan dokumen.",
      ],
      quiz: [
        {
          id: "eng-m2-q1",
          prompt: "Perintah apa untuk memperbarui hanya field stok tanpa menimpa seluruh dokumen?",
          options: [
            "PUT /produk/_doc/1 dengan seluruh isi dokumen",
            "POST /produk/_update/1 dengan body doc",
            "DELETE lalu tulis ulang",
            "GET /produk/_doc/1",
          ],
          answerIndex: 1,
          explanation:
            "Endpoint _update menerima objek doc berisi field yang ingin diubah, sehingga field lain tetap utuh.",
        },
        {
          id: "eng-m2-q2",
          prompt: "Mengapa dokumen baru kadang belum muncul di hasil pencarian?",
          options: [
            "Dokumen gagal ditulis",
            "Indeks belum di-refresh (default setiap 1 detik)",
            "Mapping salah tipe",
            "Replica belum dibuat",
          ],
          answerIndex: 1,
          explanation:
            "Elasticsearch bersifat near real-time: dokumen baru dapat dicari setelah proses refresh, yang default-nya berjalan tiap 1 detik.",
        },
        {
          id: "eng-m2-q3",
          prompt: "Apa keunggulan utama Bulk API?",
          options: [
            "Mengenkripsi dokumen otomatis",
            "Mengurangi jumlah request HTTP untuk banyak operasi tulis",
            "Membuat mapping otomatis lebih akurat",
            "Menghapus indeks kosong",
          ],
          answerIndex: 1,
          explanation:
            "Bulk API mengemas banyak operasi index/update/delete dalam satu request, mengurangi overhead jaringan dan meningkatkan throughput.",
        },
        {
          id: "eng-m2-q4",
          prompt: "Apa yang terjadi jika PUT /produk/_doc/1 dijalankan padahal dokumen _id 1 sudah ada?",
          options: [
            "Request ditolak dengan error 409",
            "Dokumen lama ditimpa sepenuhnya oleh dokumen baru",
            "Field digabung otomatis",
            "Dokumen dipindah ke indeks lain",
          ],
          answerIndex: 1,
          explanation:
            "PUT bersifat replace: dokumen dengan _id yang sama akan ditimpa seluruhnya dan _version bertambah.",
        },
      ],
    },
    {
      slug: "mapping-dan-analisis-teks",
      title: "Mapping & Analisis Teks",
      level: "Menengah",
      durationMinutes: 35,
      intro:
        "Mapping menentukan tipe data setiap field. Modul ini membahas tipe penting, perbedaan text vs keyword, dan bagaimana analyzer memproses teks.",
      sections: [
        {
          heading: "Apa itu mapping?",
          paragraphs: [
            "Mapping adalah skema indeks: definisi tipe data tiap field seperti text, keyword, integer, date, atau boolean. Elasticsearch dapat menebak tipe secara dinamis, tetapi untuk produksi sebaiknya mapping didefinisikan eksplisit.",
            "Tipe field memengaruhi cara data diindeks dan dicari, sehingga kesalahan mapping sering menjadi sumber hasil pencarian yang aneh.",
          ],
          codeExample: {
            title: "Mapping eksplisit untuk indeks produk",
            lang: "json",
            code: `PUT /produk\n{\n  "mappings": {\n    "properties": {\n      "nama":     { "type": "text" },\n      "kategori": { "type": "keyword" },\n      "harga":    { "type": "long" },\n      "dibuat":   { "type": "date" }\n    }\n  }\n}`,
          },
        },
        {
          heading: "text vs keyword",
          paragraphs: [
            "Field text dianalisis: dipecah menjadi token, diubah ke huruf kecil, lalu diindeks untuk pencarian teks penuh (match). Field keyword disimpan utuh apa adanya, cocok untuk filter, sorting, dan agregasi (term).",
            "Kesalahan umum pemula adalah menjalankan query term pada field text atau match pada field keyword dan bingung mengapa hasilnya tidak sesuai.",
          ],
        },
        {
          heading: "Analyzer dan proses analisis",
          paragraphs: [
            "Analyzer terdiri dari character filter, tokenizer, dan token filter. Standard analyzer adalah default: memecah teks berdasarkan kata dan menurunkan huruf.",
            "API _analyze sangat berguna untuk melihat token hasil analisis sebelum Anda men-debug query.",
          ],
          codeExample: {
            title: "Menguji analyzer bawaan",
            lang: "json",
            code: `POST /_analyze\n{\n  "analyzer": "standard",\n  "text": "Laptop Gaming Murah 2024"\n}`,
          },
        },
      ],
      keyPoints: [
        "Mapping adalah skema tipe data field dalam indeks.",
        "text dianalisis untuk pencarian teks penuh; keyword disimpan utuh untuk filter dan agregasi.",
        "Query term cocok untuk keyword; query match cocok untuk text.",
        "Analyzer = character filter + tokenizer + token filter.",
        "Gunakan API _analyze untuk men-debug tokenisasi.",
      ],
      quiz: [
        {
          id: "eng-m3-q1",
          prompt: "Field mana yang tepat untuk filter dan agregasi nilai persis seperti kategori?",
          options: ["text", "keyword", "date", "binary"],
          answerIndex: 1,
          explanation:
            "keyword menyimpan nilai utuh tanpa analisis sehingga cocok untuk term query, sorting, dan agregasi terms.",
        },
        {
          id: "eng-m3-q2",
          prompt: "Apa yang dilakukan analyzer terhadap field text?",
          options: [
            "Mengenkripsi isi field",
            "Memecah teks menjadi token dan menormalisasinya (mis. huruf kecil)",
            "Mengubah tipe menjadi keyword",
            "Menghapus field kosong",
          ],
          answerIndex: 1,
          explanation:
            "Analyzer men-tokenisasi teks dan menerapkan normalisasi seperti lowercase sehingga pencarian teks penuh menjadi fleksibel.",
        },
        {
          id: "eng-m3-q3",
          prompt: "API apa yang digunakan untuk melihat hasil tokenisasi sebuah analyzer?",
          options: ["/_cluster/health", "/_cat/indices", "/_analyze", "/_search"],
          answerIndex: 2,
          explanation:
            "POST /_analyze menampilkan daftar token yang dihasilkan analyzer dari teks input, sangat berguna untuk debugging.",
        },
        {
          id: "eng-m3-q4",
          prompt: "Query term pada field text sering tidak menemukan dokumen karena…",
          options: [
            "term hanya bekerja di Kibana",
            "nilai field text sudah dipecah dan dinormalisasi menjadi token",
            "field text tidak bisa dicari",
            "term membutuhkan agregasi",
          ],
          answerIndex: 1,
          explanation:
            "term mencari kecocokan persis pada token terindeks. Karena teks sudah dianalisis (mis. di-lowercase dan dipecah), nilai asli sering tidak cocok persis.",
        },
      ],
    },
    {
      slug: "query-dsl",
      title: "Query DSL",
      level: "Menengah",
      durationMinutes: 40,
      intro:
        "Query DSL adalah bahasa utama pencarian Elasticsearch. Kuasi match, term, range, bool, dan perbedaan konteks query vs filter.",
      sections: [
        {
          heading: "Full-text search dengan match",
          paragraphs: [
            "Query match adalah andalan pencarian teks penuh. Teks input dianalisis dulu, lalu dicocokkan dengan token terindeks. Skor relevansi (_score) menentukan urutan hasil.",
            "match_phrase mencari frasa berurutan, sedangkan multi_match mencari di beberapa field sekaligus.",
          ],
          codeExample: {
            title: "Pencarian teks penuh sederhana",
            lang: "json",
            code: `GET /produk/_search\n{\n  "query": {\n    "match": {\n      "nama": "laptop gaming"\n    }\n  }\n}`,
          },
        },
        {
          heading: "Exact match dengan term dan range",
          paragraphs: [
            "term mencari kecocokan persis pada field keyword atau numerik. range menyaring nilai dalam rentang (gt, gte, lt, lte) dan sangat umum dipakai untuk harga, tanggal, atau angka.",
          ],
          codeExample: {
            title: "Filter kategori dan rentang harga",
            lang: "json",
            code: `GET /produk/_search\n{\n  "query": {\n    "bool": {\n      "filter": [\n        { "term": { "kategori": "elektronik" } },\n        { "range": { "harga": { "gte": 1000000, "lte": 20000000 } } }\n      ]\n    }\n  }\n}`,
          },
        },
        {
          heading: "bool: menggabungkan banyak klausa",
          paragraphs: [
            "Klausa must (harus cocok, memengaruhi skor), filter (harus cocok, tanpa skor, lebih cepat dan ter-cache), should (opsional, menaikkan skor), dan must_not (tidak boleh cocok).",
            "Aturan praktis: gunakan filter untuk kondisi ya/tidak seperti status atau rentang tanggal, dan must untuk pencarian teks yang perlu skor relevansi.",
          ],
          codeExample: {
            title: "Kombinasi must + filter + must_not",
            lang: "json",
            code: `GET /produk/_search\n{\n  "query": {\n    "bool": {\n      "must": [\n        { "match": { "nama": "laptop" } }\n      ],\n      "filter": [\n        { "term": { "kategori": "elektronik" } }\n      ],\n      "must_not": [\n        { "term": { "stok": 0 } }\n      ]\n    }\n  }\n}`,
          },
        },
      ],
      keyPoints: [
        "match untuk teks penuh dengan skor relevansi; term untuk kecocokan persis.",
        "range menyaring rentang nilai numerik atau tanggal.",
        "bool menggabungkan must, filter, should, dan must_not.",
        "Konteks filter tidak menghitung skor dan dapat di-cache — lebih cepat.",
        "Gunakan filter untuk kondisi biner, must untuk relevansi.",
      ],
      quiz: [
        {
          id: "eng-m4-q1",
          prompt: "Klausa bool mana yang cocok untuk menyaring tanpa memengaruhi skor relevansi?",
          options: ["must", "should", "filter", "must_not"],
          answerIndex: 2,
          explanation:
            "Klausa filter berjalan dalam konteks filter: hasilnya ya/tidak, tidak menghitung _score, dan bisa di-cache sehingga lebih cepat.",
        },
        {
          id: "eng-m4-q2",
          prompt: "Query apa yang tepat untuk mencari frasa teks yang dianalisis?",
          options: ["term", "match", "exists", "ids"],
          answerIndex: 1,
          explanation:
            "match menganalisis input seperti analyzer field, sehingga cocok untuk pencarian teks penuh pada field text.",
        },
        {
          id: "eng-m4-q3",
          prompt: "Dalam range query, arti 'gte' adalah…",
          options: [
            "greater than equal (lebih besar atau sama dengan)",
            "get the element",
            "group then exclude",
            "greater than exactly",
          ],
          answerIndex: 0,
          explanation:
            "gte = greater than or equal, lt = less than, lte = less than or equal, gt = greater than.",
        },
        {
          id: "eng-m4-q4",
          prompt: "Apa fungsi klausa should dalam bool query?",
          options: [
            "Menolak dokumen yang cocok",
            "Menambah skor dokumen yang cocok, bersifat opsional",
            "Mewajibkan semua dokumen cocok",
            "Menghapus field dari hasil",
          ],
          answerIndex: 1,
          explanation:
            "should bersifat opsional: dokumen yang cocok mendapat skor tambahan sehingga naik peringkat, tetapi tidak wajib cocok.",
        },
        {
          id: "eng-m4-q5",
          prompt: "Mengapa filter lebih cepat daripada must untuk kondisi ya/tidak?",
          options: [
            "Karena filter tidak dianalisis",
            "Karena filter tidak menghitung skor dan hasilnya dapat di-cache",
            "Karena filter berjalan di replica saja",
            "Karena filter memakai bahasa KQL",
          ],
          answerIndex: 1,
          explanation:
            "Konteks filter melewati perhitungan skor dan Elasticsearch menyimpan cache bitset-nya, sehingga query berulang jauh lebih cepat.",
        },
      ],
    },
    {
      slug: "aggregation",
      title: "Aggregation",
      level: "Lanjutan",
      durationMinutes: 40,
      intro:
        "Agregasi mengubah data mentah menjadi ringkasan analitik: statistik, pengelompokan, hingga histogram. Ini salah satu topik utama ujian Engineer.",
      sections: [
        {
          heading: "Dua keluarga besar agregasi",
          paragraphs: [
            "Metric aggregation menghitung nilai dari dokumen: avg, sum, min, max, dan stats. Bucket aggregation mengelompokkan dokumen ke dalam ember (bucket): terms, date_histogram, dan range.",
            "Agregasi dapat disarangkan: bucket di dalam bucket, atau metric di dalam bucket, untuk analisis multi-dimensi.",
          ],
          codeExample: {
            title: "Statistik harga seluruh produk",
            lang: "json",
            code: `GET /produk/_search\n{\n  "size": 0,\n  "aggs": {\n    "statistik_harga": {\n      "stats": { "field": "harga" }\n    }\n  }\n}`,
          },
        },
        {
          heading: "terms: pengelompokan paling umum",
          paragraphs: [
            "Agregasi terms mengelompokkan dokumen berdasarkan nilai unik suatu field (biasanya keyword) dan menghitung jumlah dokumen per kelompok — mirip GROUP BY di SQL.",
            "Dikombinasikan dengan metric aggregation, Anda bisa menghitung rata-rata harga per kategori, total penjualan per bulan, dan sebagainya.",
          ],
          codeExample: {
            title: "Rata-rata harga per kategori",
            lang: "json",
            code: `GET /produk/_search\n{\n  "size": 0,\n  "aggs": {\n    "per_kategori": {\n      "terms": { "field": "kategori" },\n      "aggs": {\n        "rata_harga": {\n          "avg": { "field": "harga" }\n        }\n      }\n    }\n  }\n}`,
          },
        },
        {
          heading: "date_histogram untuk deret waktu",
          paragraphs: [
            "date_histogram mengelompokkan dokumen ke interval waktu (per jam, hari, bulan) dan menjadi tulang punggung grafik deret waktu di Kibana.",
            "Gunakan calendar_interval untuk interval kalender (day, month) atau fixed_interval untuk interval tetap (30m, 12h).",
          ],
          codeExample: {
            title: "Jumlah transaksi per hari",
            lang: "json",
            code: `GET /transaksi/_search\n{\n  "size": 0,\n  "aggs": {\n    "per_hari": {\n      "date_histogram": {\n        "field": "waktu",\n        "calendar_interval": "day"\n      }\n    }\n  }\n}`,
          },
        },
      ],
      keyPoints: [
        "Metric aggregation: avg, sum, min, max, stats.",
        "Bucket aggregation: terms, range, date_histogram.",
        "Agregasi bisa disarangkan (nested) untuk analisis multi-dimensi.",
        "Set size: 0 bila hanya butuh hasil agregasi tanpa dokumen.",
        "Field untuk agregasi harus keyword/numerik, bukan text teranalisis.",
      ],
      quiz: [
        {
          id: "eng-m5-q1",
          prompt: "Agregasi apa yang setara dengan GROUP BY di SQL?",
          options: ["avg", "terms", "stats", "cardinality"],
          answerIndex: 1,
          explanation:
            "terms adalah bucket aggregation yang mengelompokkan dokumen per nilai unik field, mirip GROUP BY.",
        },
        {
          id: "eng-m5-q2",
          prompt: "Untuk menghitung rata-rata harga per kategori, strukturnya adalah…",
          options: [
            "avg di dalam terms",
            "terms di dalam avg",
            "range di dalam date_histogram",
            "match di dalam filter",
          ],
          answerIndex: 0,
          explanation:
            "Bucket terms membentuk kelompok kategori, lalu metric avg di dalamnya menghitung rata-rata harga per kelompok.",
        },
        {
          id: "eng-m5-q3",
          prompt: "Mengapa menambahkan 'size: 0' pada request agregasi?",
          options: [
            "Agar indeks tidak penuh",
            "Agar Elasticsearch tidak mengembalikan dokumen, hanya hasil agregasi",
            "Agar query lebih lambat",
            "Agar mapping diperbarui",
          ],
          answerIndex: 1,
          explanation:
            "size mengatur jumlah dokumen hit yang dikembalikan. Nilai 0 mempercepat request ketika hanya agregasi yang dibutuhkan.",
        },
        {
          id: "eng-m5-q4",
          prompt: "Agregasi apa yang tepat untuk grafik jumlah transaksi per hari?",
          options: ["terms", "date_histogram", "cardinality", "geo_distance"],
          answerIndex: 1,
          explanation:
            "date_histogram membagi dokumen ke interval waktu dan menjadi dasar visualisasi deret waktu.",
        },
      ],
    },
    {
      slug: "cluster-dan-shard",
      title: "Cluster, Shard & Manajemen Indeks",
      level: "Siap Ujian",
      durationMinutes: 35,
      intro:
        "Modul penutup jalur Engineer: kesehatan cluster, alokasi shard, pengaturan indeks, dan praktik manajemen siklus hidup data (ILM).",
      sections: [
        {
          heading: "Status kesehatan cluster",
          paragraphs: [
            "Cluster health memiliki tiga status: green (semua shard utama dan replica teralokasi), yellow (shard utama aman tetapi ada replica belum teralokasi), dan red (ada shard utama hilang — data tidak lengkap).",
            "Status yellow sering muncul di cluster satu node karena replica tidak bisa ditempatkan di node yang sama dengan shard utamanya.",
          ],
          codeExample: {
            title: "Memantau kesehatan dan alokasi shard",
            lang: "bash",
            code: `curl -X GET "localhost:9200/_cluster/health?pretty"\ncurl -X GET "localhost:9200/_cat/shards?v"\ncurl -X GET "localhost:9200/_cat/indices?v"`,
          },
        },
        {
          heading: "Strategi shard",
          paragraphs: [
            "Jumlah shard utama hanya bisa diatur saat indeks dibuat (kecuali lewat shrink/split). Terlalu banyak shard kecil membebani memori; terlalu sedikit shard besar menyulitkan distribusi.",
            "Panduan umum: jaga ukuran shard sekitar 10–50 GB dan hindari ribuan shard kecil (oversharding).",
          ],
          codeExample: {
            title: "Membuat indeks dengan pengaturan shard",
            lang: "json",
            code: `PUT /logs-2024\n{\n  "settings": {\n    "number_of_shards": 3,\n    "number_of_replicas": 1\n  }\n}`,
          },
        },
        {
          heading: "Index Lifecycle Management (ILM)",
          paragraphs: [
            "ILM mengotomasi siklus hidup indeks deret waktu: fase hot (aktif ditulis), warm (jarang diakses), cold (arsip), hingga delete (dihapus otomatis).",
            "Kebijakan ILM didefinisikan sekali lalu diterapkan ke banyak indeks melalui index template — praktik standar untuk data log dan metrik.",
          ],
          codeExample: {
            title: "Kebijakan ILM sederhana: hapus setelah 30 hari",
            lang: "json",
            code: `PUT /_ilm/policy/logs-policy\n{\n  "policy": {\n    "phases": {\n      "hot": {\n        "actions": {\n          "rollover": { "max_age": "7d", "max_size": "50gb" }\n        }\n      },\n      "delete": {\n        "min_age": "30d",\n        "actions": { "delete": {} }\n      }\n    }\n  }\n}`,
          },
        },
      ],
      keyPoints: [
        "green: sehat; yellow: replica belum teralokasi; red: ada shard utama hilang.",
        "Cluster satu node selalu yellow bila replica diset lebih dari 0.",
        "Jumlah shard utama ditetapkan saat pembuatan indeks.",
        "Hindari oversharding; targetkan ukuran shard 10–50 GB.",
        "ILM mengotomasi fase hot → warm → cold → delete.",
      ],
      quiz: [
        {
          id: "eng-m6-q1",
          prompt: "Cluster satu node dengan number_of_replicas: 1 akan berstatus…",
          options: ["green", "yellow", "red", "blue"],
          answerIndex: 1,
          explanation:
            "Replica tidak dapat ditempatkan di node yang sama dengan shard utamanya, sehingga ada replica unassigned dan status menjadi yellow.",
        },
        {
          id: "eng-m6-q2",
          prompt: "Apa arti status red pada cluster health?",
          options: [
            "Semua replica teralokasi",
            "Ada shard utama yang hilang sehingga data tidak lengkap",
            "Node kelebihan memori",
            "Indeks sedang di-rollover",
          ],
          answerIndex: 1,
          explanation:
            "Red berarti setidaknya satu shard utama tidak teralokasi — sebagian data tidak dapat diakses dan perlu investigasi segera.",
        },
        {
          id: "eng-m6-q3",
          prompt: "Kapan jumlah shard utama sebuah indeks ditentukan?",
          options: [
            "Kapan saja lewat _update",
            "Saat indeks dibuat (hanya bisa diubah lewat shrink/split)",
            "Setelah data penuh",
            "Saat cluster restart",
          ],
          answerIndex: 1,
          explanation:
            "number_of_shards bersifat tetap setelah indeks dibuat. Perubahan hanya dimungkinkan lewat API shrink atau split dengan syarat tertentu.",
        },
        {
          id: "eng-m6-q4",
          prompt: "Fase ILM apa yang otomatis menghapus indeks lama?",
          options: ["hot", "warm", "cold", "delete"],
          answerIndex: 3,
          explanation:
            "Fase delete menghapus indeks setelah melewati min_age yang ditentukan, menjaga cluster dari penumpukan data lama.",
        },
      ],
    },
  ],
  examQuestions: [
    {
      id: "eng-ex-1",
      prompt: "Perintah mana yang menulis dokumen dengan ID otomatis?",
      options: [
        "PUT /produk/_doc/1",
        "POST /produk/_doc",
        "GET /produk/_doc/1",
        "PUT /produk",
      ],
      answerIndex: 1,
      explanation:
        "POST ke _doc tanpa ID membuat Elasticsearch membangkitkan ID unik secara otomatis.",
    },
    {
      id: "eng-ex-2",
      prompt: "Field dengan tipe keyword paling tepat digunakan untuk…",
      options: [
        "Pencarian teks penuh berbahasa Indonesia",
        "Filter, sorting, dan agregasi nilai persis",
        "Menyimpan isi artikel panjang",
        "Menyimpan file biner",
      ],
      answerIndex: 1,
      explanation:
        "keyword tidak dianalisis sehingga ideal untuk operasi nilai persis: term query, sorting, dan terms aggregation.",
    },
    {
      id: "eng-ex-3",
      prompt: "Dalam bool query, klausa mana yang mengecualikan dokumen?",
      options: ["must", "filter", "should", "must_not"],
      answerIndex: 3,
      explanation:
        "must_not menolak dokumen yang cocok dengan kondisi tersebut dari hasil pencarian.",
    },
    {
      id: "eng-ex-4",
      prompt: "Apa output agregasi stats pada field numerik?",
      options: [
        "Hanya nilai maksimum",
        "count, min, max, avg, dan sum sekaligus",
        "Daftar nilai unik",
        "Histogram tanggal",
      ],
      answerIndex: 1,
      explanation:
        "stats mengembalikan lima metrik sekaligus: count, min, max, avg, dan sum.",
    },
    {
      id: "eng-ex-5",
      prompt: "Mengapa pencarian Elasticsearch disebut near real-time?",
      options: [
        "Karena memakai jaringan lambat",
        "Karena dokumen baru dapat dicari setelah proses refresh (default 1 detik)",
        "Karena hanya berjalan malam hari",
        "Karena data disimpan di cache browser",
      ],
      answerIndex: 1,
      explanation:
        "Segmen Lucene di-refresh berkala (default 1 detik). Sebelum refresh, dokumen baru belum terlihat di hasil pencarian.",
    },
    {
      id: "eng-ex-6",
      prompt: "Perintah untuk melihat daftar indeks beserta ukurannya adalah…",
      options: [
        "GET /_cat/indices?v",
        "GET /_search",
        "PUT /_template",
        "POST /_analyze",
      ],
      answerIndex: 0,
      explanation:
        "API _cat/indices menampilkan tabel ringkas semua indeks: status, jumlah dokumen, dan ukuran penyimpanan.",
    },
    {
      id: "eng-ex-7",
      prompt: "Analyzer standard melakukan…",
      options: [
        "Enkripsi dan kompresi teks",
        "Tokenisasi berdasarkan kata dan lowercase",
        "Terjemahan bahasa otomatis",
        "Penghapusan duplikat dokumen",
      ],
      answerIndex: 1,
      explanation:
        "Standard analyzer memecah teks menjadi token kata dan mengubahnya menjadi huruf kecil sebelum diindeks.",
    },
    {
      id: "eng-ex-8",
      prompt: "Query yang tepat untuk mencari produk berharga antara 1 juta dan 5 juta adalah…",
      options: ["match", "term", "range", "match_all"],
      answerIndex: 2,
      explanation:
        "range dengan gte dan lte menyaring nilai numerik dalam rentang tertentu.",
    },
    {
      id: "eng-ex-9",
      prompt: "Keuntungan menaruh kondisi pada klausa filter dibanding must?",
      options: [
        "Skor relevansi lebih tinggi",
        "Tidak menghitung skor dan hasil bisa di-cache sehingga lebih cepat",
        "Dokumen otomatis terurut",
        "Mapping menjadi dinamis",
      ],
      answerIndex: 1,
      explanation:
        "Konteks filter melewati scoring dan memanfaatkan filter cache — ideal untuk kondisi ya/tidak.",
    },
    {
      id: "eng-ex-10",
      prompt: "Apa yang dilakukan aksi rollover pada ILM?",
      options: [
        "Menghapus indeks lama",
        "Membuat indeks baru saat batas usia/ukuran tercapai dan mengalihkan penulisan ke sana",
        "Memindahkan shard ke node lain",
        "Mengubah mapping indeks",
      ],
      answerIndex: 1,
      explanation:
        "Rollover mengalihkan alias penulisan ke indeks baru ketika indeks aktif mencapai max_age atau max_size.",
    },
    {
      id: "eng-ex-11",
      prompt: "Format body yang benar untuk Bulk API adalah…",
      options: [
        "Satu objek JSON besar berisi array dokumen",
        "NDJSON: baris aksi diikuti baris payload, tiap baris diakhiri newline",
        "XML dengan namespace khusus",
        "CSV dengan header",
      ],
      answerIndex: 1,
      explanation:
        "Bulk API mewajibkan NDJSON: setiap baris adalah aksi atau payload terpisah, dan baris terakhir pun harus diakhiri newline.",
    },
    {
      id: "eng-ex-12",
      prompt: "Jika cluster berstatus yellow, langkah diagnosis pertama yang tepat adalah…",
      options: [
        "Menghapus semua indeks",
        "Memeriksa shard yang unassigned lewat _cat/shards atau _cluster/allocation/explain",
        "Menambah jumlah replica",
        "Mematikan node master",
      ],
      answerIndex: 1,
      explanation:
        "Yellow berarti ada replica unassigned. _cat/shards dan _cluster/allocation/explain menunjukkan penyebab alokasi gagal.",
    },
    {
      id: "eng-ex-13",
      prompt: "Request mana yang menghapus satu dokumen ber-ID 7 dari indeks orders?",
      options: [
        "DELETE /orders/_doc/7",
        "POST /orders/_delete/7",
        "PUT /orders/_doc/7/_delete",
        "GET /orders/_doc/7?delete=true",
      ],
      answerIndex: 0,
      explanation:
        "Delete Document API menggunakan DELETE /<index>/_doc/<id>. Endpoint lain pada opsi tidak tersedia di Elasticsearch.",
    },
    {
      id: "eng-ex-14",
      prompt: "Apa fungsi utama parameter refresh=wait_for saat menulis dokumen?",
      options: [
        "Menghapus dokumen duplikat sebelum menulis",
        "Menunggu refresh selesai agar dokumen langsung dapat dicari sebelum respons dikembalikan",
        "Mengompresi dokumen di disk",
        "Mengunci indeks dari penulisan lain",
      ],
      answerIndex: 1,
      explanation:
        "refresh=wait_for memaksa request menunggu refresh berikutnya sehingga dokumen baru langsung terlihat di pencarian — berguna pada pengujian integrasi.",
    },
    {
      id: "eng-ex-15",
      prompt: "Mapping mana yang tepat untuk field harga yang akan dipakai range query dan agregasi avg?",
      options: [
        '"harga": { "type": "text" }',
        '"harga": { "type": "keyword" }',
        '"harga": { "type": "double" }',
        '"harga": { "type": "boolean" }',
      ],
      answerIndex: 2,
      explanation:
        "Tipe numerik seperti double mendukung range query dan agregasi metrik (avg, sum). text dianalisis untuk pencarian teks; keyword hanya cocok untuk pencocokan persis.",
    },
    {
      id: "eng-ex-16",
      prompt: "Query match_phrase berbeda dari match karena…",
      options: [
        "match_phrase hanya bekerja pada field keyword",
        "match_phrase mensyaratkan token muncul berurutan sesuai posisi, bukan sekadar ada di dokumen",
        "match_phrase selalu lebih lambat dari term query",
        "match_phrase mengabaikan analyzer",
      ],
      answerIndex: 1,
      explanation:
        "match_phrase memeriksa posisi token sehingga frasa harus muncul berurutan (dengan toleransi slop). match biasa cukup mencari kemunculan token tanpa memedulikan urutan.",
    },
    {
      id: "eng-ex-17",
      prompt: "Dalam terms aggregation, parameter size menentukan…",
      options: [
        "Ukuran shard yang diproses",
        "Jumlah bucket teratas yang dikembalikan",
        "Ukuran dokumen maksimum",
        "Jumlah replica indeks",
      ],
      answerIndex: 1,
      explanation:
        "size pada terms agg membatasi berapa bucket teratas (berdasarkan doc_count) yang dikembalikan, default 10.",
    },
    {
      id: "eng-ex-18",
      prompt: "Snapshot di Elasticsearch disimpan di…",
      options: [
        "Memori heap node master",
        "Repository terdaftar seperti shared filesystem atau object storage (S3, GCS)",
        "Index tersembunyi .snapshots di cluster yang sama",
        "Cache query tiap node",
      ],
      answerIndex: 1,
      explanation:
        "Snapshot ditulis ke repository eksternal yang didaftarkan lewat _snapshot API — misalnya filesystem bersama atau object storage — sehingga aman untuk cadangan dan pemulihan.",
    },
  ],
};
