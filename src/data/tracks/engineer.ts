import type { Track } from "../types";

export const engineerTrack: Track = {
  id: "track-engineer",
  slug: "engineer",
  name: "Elastic Certified Engineer",
  tagline: "Kuasi inti Elasticsearch: indexing, query, hingga manajemen cluster.",
  description:
    "Jalur belajar mandiri ini dirancang secara komprehensif mengikuti silabus resmi ujian sertifikasi Elastic Certified Engineer. Anda akan mempelajari seluruh konsep inti dari pemetaan string, query DSL, agregasi kompleks, ingest pipeline, hingga manajemen siklus hidup indeks, strategi sharding, pencarian multi-klaster, dan pemecahan masalah.",
  audience: "Cocok untuk backend engineer, data engineer, administrator cluster, dan profesional IT yang ingin menguasai Elasticsearch secara mendalam dan terstandarisasi.",
  color: "teal",
  icon: "server",
  examInfo: { questionCount: 18, durationMinutes: 180, passingScore: 70 },
  modules: [
    {
      slug: "strings-in-elasticsearch",
      title: "Strings in Elasticsearch",
      level: "Dasar",
      durationMinutes: 20,
      intro: "Pelajari perbedaan mendasar antara tipe data string (text vs keyword) di Elasticsearch, serta bagaimana proses analisis teks mengubah dokumen Anda sebelum disimpan.",
      sections: [
        {
          heading: "Perbedaan Antara Text dan Keyword",
          paragraphs: [
            "Dalam Elasticsearch, data string dapat dipetakan menjadi dua tipe utama: 'text' atau 'keyword'. Memahami perbedaan keduanya sangat krusial karena menentukan bagaimana data dapat dicari dan diagregasi.",
            "'text' digunakan untuk pencarian teks penuh (full-text search). Nilainya akan diproses oleh analyzer (dipecah menjadi kata-kata, diturunkan hurufnya, dll) sebelum disimpan ke inverted index. Sebaliknya, 'keyword' digunakan untuk pencarian nilai persis (exact match), penyaringan (filtering), pengurutan (sorting), dan agregasi. Nilai keyword disimpan utuh apa adanya."
          ],
          codeExample: {
            title: "Contoh Mapping untuk Text dan Keyword",
            lang: "json",
            code: `PUT /indeks-produk\n{\n  "mappings": {\n    "properties": {\n      "deskripsi": { "type": "text" },\n      "kategori": { "type": "keyword" }\n    }\n  }\n}`
          }
        },
        {
          heading: "Proses Analisis Teks (Text Analysis)",
          paragraphs: [
            "Ketika sebuah field bertipe 'text' diindeks, ia melewati proses analisis sebelum disimpan ke dalam inverted index. Proses ini dikelola oleh Analyzer yang terdiri dari tiga komponen berurutan: Character Filters (membersihkan karakter), Tokenizer (memotong teks menjadi token), dan Token Filters (memodifikasi token, mis. lowercase).",
            "Standard Analyzer (default) memotong teks berdasarkan batas kata (menggunakan tokenizer standar) dan mengubah semua huruf menjadi huruf kecil (lowercase)."
          ],
          codeExample: {
            title: "Menguji Analyzer Bawaan dengan API _analyze",
            lang: "json",
            code: `POST /_analyze\n{\n  "analyzer": "standard",\n  "text": "Belajar Elasticsearch sangat mudah!"\n}`
          }
        }
      ],
      keyPoints: [
        "Field 'text' digunakan untuk pencarian teks penuh dan melewati proses analisis teks.",
        "Field 'keyword' digunakan untuk pencocokan nilai persis (exact match), filter, sorting, dan agregasi.",
        "Proses analisis terdiri dari Character Filters, Tokenizer, dan Token Filters.",
        "Standard Analyzer memecah teks menjadi kata dan mengubahnya menjadi huruf kecil."
      ],
      quiz: [
        {
          id: "eng-m1-q1",
          prompt: "Tipe data string mana yang paling cocok digunakan untuk agregasi atau filtering kategori?",
          options: ["text", "keyword", "nested", "object"],
          answerIndex: 1,
          explanation: "Field bertipe keyword disimpan utuh tanpa dianalisis, menjadikannya ideal untuk operasi pencarian persis, filter, sorting, dan agregasi."
        },
        {
          id: "eng-m1-q2",
          prompt: "API apa yang digunakan untuk menguji bagaimana suatu teks diproses oleh sebuah analyzer?",
          options: ["/_search", "/_analyze", "/_cat/indices", "/_cluster/health"],
          answerIndex: 1,
          explanation: "API POST /_analyze digunakan untuk menguji analyzer dan melihat token-token yang dihasilkan dari input teks tertentu."
        }
      ]
    },
    {
      slug: "overview-of-mappings",
      title: "Overview of Mappings",
      level: "Dasar",
      durationMinutes: 20,
      intro: "Mapping adalah skema dari indeks Elasticsearch. Pelajari perbedaan antara mapping dinamis dan eksplisit serta bagaimana mendesain mapping yang optimal.",
      sections: [
        {
          heading: "Definisi dan Fungsi Mapping",
          paragraphs: [
            "Mapping adalah proses menentukan bagaimana dokumen and field di dalamnya disimpan dan diindeks. Mapping mendefinisikan tipe data untuk setiap field, serta parameter khusus yang mengontrol bagaimana field tersebut diproses oleh Lucene.",
            "Melalui mapping, Anda mengonfigurasi properti seperti tipe field (date, keyword, integer), format tanggal, dan apakah field tersebut harus diindeks atau tidak."
          ]
        },
        {
          heading: "Dynamic Mapping vs Explicit Mapping",
          paragraphs: [
            "Elasticsearch memiliki fitur Dynamic Mapping di mana ia otomatis menebak tipe data field baru saat dokumen pertama kali dimasukkan. Namun, dynamic mapping sering kali tidak optimal (misal, string ditebak sebagai text + keyword multi-field).",
            "Explicit Mapping memungkinkan Anda mendefinisikan struktur indeks secara presisi sebelum memasukkan data. Ini sangat direkomendasikan untuk lingkungan produksi agar menghemat penyimpanan dan menjaga keakuratan query."
          ],
          codeExample: {
            title: "Membuat Indeks dengan Explicit Mapping",
            lang: "json",
            code: `PUT /indeks-buku\n{\n  "mappings": {\n    "properties": {\n      "judul": { "type": "text" },\n      "stok": { "type": "integer" },\n      "terbit": { "type": "date", "format": "yyyy-MM-dd" }\n    }\n  }\n}`
          }
        }
      ],
      keyPoints: [
        "Mapping bertindak sebagai skema database untuk indeks di Elasticsearch.",
        "Dynamic mapping otomatis menebak tipe data, tetapi kurang optimal untuk produksi.",
        "Explicit mapping memberikan kontrol penuh atas struktur data dan efisiensi ruang disk.",
        "Sekali field dipetakan, tipe datanya umumnya tidak bisa diubah langsung tanpa reindex."
      ],
      quiz: [
        {
          id: "eng-m2-q1",
          prompt: "Apa kelemahan utama mengandalkan Dynamic Mapping untuk lingkungan produksi?",
          options: [
            "Elasticsearch akan menolak semua dokumen baru",
            "Tipe data yang ditebak otomatis bisa tidak optimal dan memakan ruang disk lebih besar",
            "Dynamic mapping menonaktifkan pencarian teks penuh",
            "Dynamic mapping memperlambat cluster hingga tidak responsif"
          ],
          answerIndex: 1,
          explanation: "Dynamic mapping menebak string sebagai gabungan text dan keyword, yang menggandakan beban indexing dan meningkatkan konsumsi penyimpanan disk secara signifikan."
        },
        {
          id: "eng-m2-q2",
          prompt: "Apakah Anda bisa mengubah tipe data suatu field dari integer ke keyword pada indeks yang sudah aktif secara langsung?",
          options: [
            "Bisa, langsung jalankan PUT /index/_mapping",
            "Tidak bisa, Anda harus membuat indeks baru dengan mapping baru lalu melakukan reindex",
            "Bisa, dengan merestart cluster",
            "Bisa, dengan menjalankan API _update"
          ],
          answerIndex: 1,
          explanation: "Struktur inverted index tidak dapat diubah di tempat karena data lama sudah terindeks. Perubahan tipe data mengharuskan pembuatan indeks baru dan migrasi data lewat Reindex API."
        }
      ]
    },
    {
      slug: "types-and-parameters",
      title: "Types and Parameters",
      level: "Dasar",
      durationMinutes: 25,
      intro: "Menyelami berbagai tipe data bawaan Elasticsearch serta parameter mapping penting seperti copy_to, fields, dan null_value.",
      sections: [
        {
          heading: "Tipe Data Core dan Kompleks",
          paragraphs: [
            "Elasticsearch mendukung tipe data core seperti numerik (integer, long, float), date, boolean, dan binary. Selain itu, terdapat tipe kompleks seperti object (hirarki dokumen) dan nested.",
            "Tipe 'nested' adalah varian khusus dari object yang memungkinkan setiap objek di dalam array diindeks secara independen, sehingga relasi antar field di dalam satu sub-objek tetap terjaga saat dicari."
          ]
        },
        {
          heading: "Parameter Mapping Penting",
          paragraphs: [
            "1. 'fields' (multi-fields): Memetakan satu field dengan beberapa cara. Contoh: nama sebagai 'text' untuk pencarian, sekaligus 'keyword' untuk sorting.",
            "2. 'copy_to': Menggabungkan nilai dari beberapa field ke dalam satu grup field tersembunyi untuk pencarian yang lebih mudah.",
            "3. 'null_value': Mengganti nilai null eksplisit dengan nilai pengganti standar agar data kosong tersebut dapat dicari."
          ],
          codeExample: {
            title: "Mapping Menggunakan Multi-Fields dan Copy_To",
            lang: "json",
            code: `PUT /indeks-karyawan\n{\n  "mappings": {\n    "properties": {\n      "nama_depan": {\n        "type": "text",\n        "copy_to": "nama_lengkap"\n      },\n      "nama_belakang": {\n        "type": "text",\n        "copy_to": "nama_lengkap"\n      },\n      "nama_lengkap": {\n        "type": "text"\n      },\n      "kota": {\n        "type": "text",\n        "fields": {\n          "raw": { "type": "keyword" }\n        }\n      }\n    }\n  }\n}`
          }
        }
      ],
      keyPoints: [
        "Tipe data nested mempertahankan relasi antar properti dari objek di dalam array.",
        "Multi-fields (parameter 'fields') memungkinkan pengindeksan field string sebagai text sekaligus keyword.",
        "Parameter 'copy_to' menggabungkan beberapa field ke dalam satu field tujuan tunggal.",
        "Parameter 'null_value' mendefinisikan nilai default untuk mengganti nilai null saat pencarian."
      ],
      quiz: [
        {
          id: "eng-m3-q1",
          prompt: "Kapan Anda harus menggunakan tipe data 'nested' daripada tipe 'object' biasa?",
          options: [
            "Saat Anda ingin menghemat penggunaan RAM",
            "Saat Anda perlu mempertahankan korelasi logis antar properti dari array of objects saat query dijalankan",
            "Saat Anda ingin mengindeks file PDF atau Word",
            "Saat Anda ingin melakukan agregasi tanggal"
          ],
          answerIndex: 1,
          explanation: "Pada tipe object biasa, array of objects diratakan (flattened) sehingga relasi antar properti hilang. Tipe nested mengindeks setiap sub-dokumen secara terpisah untuk mempertahankan korelasi."
        },
        {
          id: "eng-m3-q2",
          prompt: "Jika field 'kota' didefinisikan dengan multi-fields bernama 'raw', bagaimana Anda merujuk ke versi keyword-nya saat melakukan agregasi?",
          options: [
            "kota",
            "kota.raw",
            "raw.kota",
            "kota[raw]"
          ],
          answerIndex: 1,
          explanation: "Sub-field multi-fields dirujuk dengan menggunakan notasi titik (dot notation), yaitu <nama_field_utama>.<nama_sub_field>, jadi: 'kota.raw'."
        }
      ]
    },
    {
      slug: "full-text-queries",
      title: "Full Text Queries",
      level: "Dasar",
      durationMinutes: 25,
      intro: "Menguasai pencarian teks penuh menggunakan query match, match_phrase, dan multi_match untuk mencari dokumen berdasarkan relevansi linguistik.",
      sections: [
        {
          heading: "Match Query dan Relevansi Skor",
          paragraphs: [
            "Query 'match' adalah query default untuk melakukan pencarian teks penuh pada field bertipe 'text'. Teks input yang diberikan oleh pengguna akan dianalisis terlebih dahulu menggunakan analyzer yang dipasang pada field tersebut.",
            "Setelah itu, Elasticsearch mencari token yang cocok di inverted index dan menghitung skor relevansi (_score) menggunakan algoritma BM25. Dokumen dengan skor tertinggi akan dikembalikan di posisi teratas."
          ],
          codeExample: {
            title: "Query Match Sederhana",
            lang: "json",
            code: `GET /buku/_search\n{\n  "query": {\n    "match": {\n      "deskripsi": "pemrograman web react"\n    }\n  }\n}`
          }
        },
        {
          heading: "Match Phrase dan Multi Match",
          paragraphs: [
            "'match_phrase' digunakan jika Anda ingin mencari dokumen yang berisi kata-kata pencarian dalam urutan yang tepat dan saling berdekatan. Anda bisa mengatur toleransi jarak kata dengan parameter 'slop'.",
            "'multi_match' memungkinkan Anda mencari kata kunci yang sama di beberapa field sekaligus, serta menentukan bagaimana skor dari masing-masing field digabungkan."
          ],
          codeExample: {
            title: "Query Multi Match dan Match Phrase",
            lang: "json",
            code: `GET /buku/_search\n{\n  "query": {\n    "multi_match": {\n      "query": "belajar elasticsearch",\n      "fields": ["judul^3", "deskripsi"],\n      "type": "best_fields"\n    }\n  }\n}`
          }
        }
      ],
      keyPoints: [
        "Query match menganalisis teks pencarian dan mencari kecocokan token di inverted index.",
        "Skor relevansi (_score) secara default dihitung menggunakan algoritma BM25.",
        "Query match_phrase mewajibkan kata pencarian muncul dalam urutan yang persis.",
        "Query multi_match melakukan pencarian di banyak field sekaligus; tanda ^3 memberikan bobot (boosting) 3 kali lebih tinggi pada field terkait."
      ],
      quiz: [
        {
          id: "eng-m4-q1",
          prompt: "Apa fungsi dari boosting judul^3 pada query multi_match?",
          options: [
            "Membatasi hasil pencarian hanya di 3 dokumen",
            "Membagi skor relevansi field judul dengan 3",
            "Meningkatkan kontribusi skor relevansi dari field judul sebanyak 3 kali lipat",
            "Mengindeks field judul sebanyak 3 kali"
          ],
          answerIndex: 2,
          explanation: "Tanda caret (^) diikuti angka digunakan untuk boosting, yang berarti meningkatkan kontribusi atau bobot skor relevansi dari field tersebut dibandingkan field lainnya."
        },
        {
          id: "eng-m4-q2",
          prompt: "Query mana yang digunakan untuk memastikan kata pencarian berada bersebelahan dengan urutan yang tepat?",
          options: [
            "match",
            "term",
            "match_phrase",
            "exists"
          ],
          answerIndex: 2,
          explanation: "Query match_phrase mengevaluasi posisi kata (token position) dan memastikan kata-kata pencarian muncul secara berurutan dan berdekatan di dokumen."
        }
      ]
    },
    {
      slug: "term-level-queries",
      title: "Term Level Queries",
      level: "Dasar",
      durationMinutes: 20,
      intro: "Mempelajari query pencocokan persis (exact match) seperti term, range, dan exists yang bekerja langsung pada token terindeks tanpa melalui analisis.",
      sections: [
        {
          heading: "Karakteristik Term-Level Queries",
          paragraphs: [
            "Berbeda dengan full-text queries, term-level queries bekerja langsung pada data persis yang tersimpan di inverted index tanpa melalui analisis teks.",
            "Oleh karena itu, query seperti 'term' sangat cocok untuk mencari nilai pada field bertipe 'keyword', numerik, boolean, atau tanggal. Jika Anda mencari string dengan 'term' pada field 'text' yang di-lowercase, pencarian sering kali gagal jika menggunakan huruf besar."
          ],
          codeExample: {
            title: "Query Term untuk Filter Persis",
            lang: "json",
            code: `GET /buku/_search\n{\n  "query": {\n    "term": {\n      "status_terbit": {\n        "value": "published"\n      }\n    }\n  }\n}`
          }
        },
        {
          heading: "Range dan Exists Query",
          paragraphs: [
            "Query 'range' digunakan untuk menyaring data numerik atau tanggal dalam batas tertentu menggunakan operator gte (greater-than-equal), gt, lte, dan lt.",
            "Query 'exists' menyaring dokumen yang memiliki field tertentu dengan nilai tidak null atau tidak kosong."
          ],
          codeExample: {
            title: "Query Range untuk Harga dan Tanggal",
            lang: "json",
            code: `GET /buku/_search\n{\n  "query": {\n    "range": {\n      "harga": {\n        "gte": 50000,\n        "lte": 150000\n      }\n    }\n  }\n}`
          }
        }
      ],
      keyPoints: [
        "Term-level queries tidak menganalisis teks pencarian, mencari kecocokan persis.",
        "Sangat ideal digunakan untuk field bertipe keyword, numerik, boolean, atau date.",
        "Query range menggunakan gte, gt, lte, dan lt untuk menyaring rentang nilai.",
        "Query exists mengembalikan dokumen yang memiliki setidaknya satu nilai non-null pada field yang ditentukan."
      ],
      quiz: [
        {
          id: "eng-m5-q1",
          prompt: "Mengapa term query mencari 'Belajar' (B kapital) pada field text dengan standard analyzer sering kali tidak menghasilkan dokumen?",
          options: [
            "Because term query is broken",
            "Karena standard analyzer telah mengubah kata 'Belajar' di dokumen menjadi token lowercase 'belajar', sedangkan term query mencari token persis 'Belajar' yang tidak ada di indeks",
            "Karena standard analyzer menghapus kata Belajar",
            "Karena field text menolak term query"
          ],
          answerIndex: 1,
          explanation: "Standard analyzer mengubah semua token menjadi lowercase. Term-level query mencari nilai persis tanpa menganalisis query input, sehingga token 'Belajar' dengan huruf kapital tidak akan cocok dengan 'belajar' di inverted index."
        },
        {
          id: "eng-m5-q2",
          prompt: "Manakah operator range query yang merepresentasikan 'kurang dari' (less than) secara eksklusif?",
          options: [
            "lte",
            "gte",
            "lt",
            "gt"
          ],
          answerIndex: 2,
          explanation: "lt (less than) berarti kurang dari, sedangkan lte (less than or equal) berarti kurang dari atau sama dengan."
        }
      ]
    },
    {
      slug: "combining-queries",
      title: "Combining Queries",
      level: "Menengah",
      durationMinutes: 25,
      intro: "Belajar menggabungkan banyak klausa query menggunakan bool query dengan klausa must, filter, should, dan must_not untuk logika pencarian yang kompleks.",
      sections: [
        {
          heading: "Struktur Bool Query",
          paragraphs: [
            "Bool Query adalah kontainer utama di Elasticsearch untuk menggabungkan klausa-klausa pencarian lain. Terdiri dari empat klausa:",
            "1. 'must': Kondisi yang wajib dipenuhi oleh dokumen dan berkontribusi terhadap skor relevansi.",
            "2. 'filter': Kondisi yang wajib dipenuhi oleh dokumen tetapi TIDAK berkontribusi terhadap skor relevansi.",
            "3. 'should': Kondisi opsional; dokumen yang cocok akan mendapatkan kenaikan skor relevansi.",
            "4. 'must_not': Kondisi yang mengecualikan dokumen yang cocok dari hasil pencarian."
          ]
        },
        {
          heading: "Konteks Query vs Konteks Filter",
          paragraphs: [
            "Klausa di dalam 'must' dan 'should' berjalan dalam Query Context, di mana Elasticsearch menghitung seberapa baik dokumen cocok (skor _score).",
            "Klausa di dalam 'filter' dan 'must_not' berjalan dalam Filter Context. Di sini, Elasticsearch hanya mengevaluasi kondisi sebagai ya/tidak. Keuntungannya adalah tidak ada overhead perhitungan skor, dan Elasticsearch dapat menyimpan hasil filter di dalam cache memori (Filter Cache), membuat eksekusi berikutnya jauh lebih cepat."
          ],
          codeExample: {
            title: "Contoh Bool Query Kompleks",
            lang: "json",
            code: `GET /buku/_search\n{\n  "query": {\n    "bool": {\n      "must": [\n        { "match": { "judul": "elasticsearch" } }\n      ],\n      "filter": [\n        { "term": { "kategori": "teknologi" } },\n        { "range": { "harga": { "lte": 200000 } } }\n      ],\n      "must_not": [\n        { "term": { "stok": 0 } }\n      ]\n    }\n  }\n}`
          }
        }
      ],
      keyPoints: [
        "Bool query menggabungkan must, filter, should, dan must_not.",
        "Konteks query (must/should) menghitung skor relevansi dokumen.",
        "Konteks filter (filter/must_not) melewati proses scoring dan mendukung caching otomatis.",
        "Gunakan filter untuk penyaringan data statis atau biner seperti status aktif, kategori, atau rentang tanggal."
      ],
      quiz: [
        {
          id: "eng-m6-q1",
          prompt: "Mengapa query filter lebih cepat daripada query must di Elasticsearch?",
          options: [
            "Karena filter berjalan di node koordinasi saja",
            "Karena filter tidak menghitung skor relevansi dan hasilnya dapat disimpan di cache memori",
            "Karena filter memaksa dokumen langsung dihapus",
            "Karena filter hanya mencari di primary shard"
          ],
          answerIndex: 1,
          explanation: "Konteks filter mengabaikan kalkulasi skor relevansi (scoring) dan menggunakan bitset cache di RAM untuk menyimpan hasil pencocokan biner, sehingga query berulang berjalan sangat instan."
        },
        {
          id: "eng-m6-q2",
          prompt: "Klausa bool query mana yang digunakan untuk mengecualikan dokumen tertentu agar tidak muncul di hasil pencarian?",
          options: [
            "must",
            "should",
            "must_not",
            "filter"
          ],
          answerIndex: 2,
          explanation: "Klausa must_not menyaring dan membuang dokumen yang cocok dengan kondisi di dalamnya dari seluruh daftar hasil pencarian."
        }
      ]
    },
    {
      slug: "metric-and-bucket-aggregations",
      title: "Metric and Bucket Aggregations",
      level: "Menengah",
      durationMinutes: 25,
      intro: "Memahami fondasi analitik Elasticsearch dengan membagi agregasi menjadi metric (perhitungan nilai) dan bucket (pengelompokan dokumen).",
      sections: [
        {
          heading: "Metric Aggregations",
          paragraphs: [
            "Agregasi di Elasticsearch dibagi menjadi beberapa kategori utama. Metric Aggregations bertugas menghitung nilai numerik dari sekumpulan dokumen.",
            "Contoh agregasi metrik meliputi: 'avg' (rata-rata), 'sum' (total penjumlahan), 'min' (nilai terkecil), 'max' (nilai terbesar), 'cardinality' (jumlah nilai unik), dan 'stats' (mengembalikan min, max, avg, sum, dan count sekaligus)."
          ],
          codeExample: {
            title: "Agregasi Stats untuk Harga Produk",
            lang: "json",
            code: `GET /buku/_search\n{\n  "size": 0,\n  "aggs": {\n    "statistik_harga": {\n      "stats": {\n        "field": "harga"\n      }\n    }\n  }\n}`
          }
        },
        {
          heading: "Bucket Aggregations",
          paragraphs: [
            "Bucket Aggregations berfungsi mirip dengan perintah 'GROUP BY' pada SQL. Agregasi ini tidak menghitung nilai metrik secara langsung, melainkan mengelompokkan dokumen ke dalam ember-ember (buckets) berdasarkan kriteria tertentu.",
            "Contoh utama bucket aggregations adalah: 'terms' (berdasarkan nilai unik field keyword), 'range' (berdasarkan rentang nilai khusus), dan 'date_histogram' (berdasarkan interval waktu tertentu seperti harian atau bulanan)."
          ],
          codeExample: {
            title: "Agregasi Terms Berdasarkan Kategori",
            lang: "json",
            code: `GET /buku/_search\n{\n  "size": 0,\n  "aggs": {\n    "kategori_populer": {\n      "terms": {\n        "field": "kategori.keyword",\n        "size": 5\n      }\n    }\n  }\n}`
          }
        }
      ],
      keyPoints: [
        "Metric aggregations menghitung nilai statistik numerik dari dokumen.",
        "Bucket aggregations mengelompokkan dokumen ke dalam kategori/ember (seperti terms atau histogram).",
        "Menetapkan parameter 'size': 0 pada pencarian menonaktifkan pengembalian dokumen mentah, mempercepat eksekusi analitik.",
        "Agregasi terms membutuhkan field bertipe keyword atau numerik, bukan field text yang dianalisis."
      ],
      quiz: [
        {
          id: "eng-m7-q1",
          prompt: "Agregasi metrik apa yang digunakan jika Anda ingin menghitung jumlah nilai unik (unique count) dari suatu field?",
          options: [
            "sum",
            "stats",
            "cardinality",
            "terms"
          ],
          answerIndex: 2,
          explanation: "Agregasi cardinality memperkirakan jumlah nilai unik yang berbeda (distinct values) pada sebuah field menggunakan algoritma HyperLogLog++."
        },
        {
          id: "eng-m7-q2",
          prompt: "Mengapa kita sering menambahkan parameter 'size': 0 pada query pencarian yang menggunakan agregasi?",
          options: [
            "Untuk menghapus dokumen dari indeks",
            "Untuk menyembunyikan hasil agregasi",
            "Untuk menginstruksikan Elasticsearch agar hanya mengembalikan hasil analitik agregasi tanpa memuat dokumen hits",
            "Untuk membatasi ukuran heap memori"
          ],
          answerIndex: 2,
          explanation: "Size 0 menghemat bandwidth jaringan dan resource komputasi karena cluster tidak perlu memproses dan mengembalikan daftar dokumen pencarian, melainkan langsung memberikan rangkuman analitik."
        }
      ]
    },
    {
      slug: "combining-aggregations",
      title: "Combining Aggregations",
      level: "Menengah",
      durationMinutes: 25,
      intro: "Menyusun analisis data multi-dimensi dengan menyarangkan (nesting) agregasi dan menggunakan pipeline aggregations.",
      sections: [
        {
          heading: "Sub-Aggregations (Nesting)",
          paragraphs: [
            "Kekuatan utama agregasi Elasticsearch terletak pada kemampuannya untuk disarangkan (nested). Anda dapat menempatkan sub-agregasi di dalam bucket aggregation.",
            "Sebagai contoh, Anda dapat membuat bucket berdasarkan kategori produk (terms aggregation), lalu di dalam masing-masing kategori tersebut, Anda menghitung rata-rata harganya (metric avg aggregation). Anda bahkan bisa membuat bucket di dalam bucket lain (misal kategori, lalu sub-bucket tanggal)."
          ],
          codeExample: {
            title: "Menghitung Rata-rata Harga per Kategori",
            lang: "json",
            code: `GET /buku/_search\n{\n  "size": 0,\n  "aggs": {\n    "kategori_bucket": {\n      "terms": { "field": "kategori.keyword" },\n      "aggs": {\n        "rata_rata_harga": {\n          "avg": { "field": "harga" }\n        }\n      }\n    }\n  }\n}`
          }
        },
        {
          heading: "Pipeline Aggregations",
          paragraphs: [
            "Pipeline Aggregations melakukan operasi komputasi di atas hasil agregasi lain, bukan dari dokumen mentah. Ini memungkinkan Anda menghitung metrik seperti rata-rata kumulatif, nilai turunan (derivative), atau pengurutan bucket berdasarkan sub-metrik.",
            "Pipeline aggregations menggunakan parameter 'buckets_path' untuk merujuk pada metrik yang menjadi inputnya."
          ],
          codeExample: {
            title: "Mencari Kategori dengan Rata-rata Harga Termahal",
            lang: "json",
            code: `GET /buku/_search\n{\n  "size": 0,\n  "aggs": {\n    "kategori_bucket": {\n      "terms": {\n        "field": "kategori.keyword",\n        "order": { "rata_rata_harga": "desc" }\n      },\n      "aggs": {\n        "rata_rata_harga": {\n          "avg": { "field": "harga" }\n        }\n      }\n    }\n  }\n}`
          }
        }
      ],
      keyPoints: [
        "Sub-aggregations memungkinkan analisis multi-dimensi berlapis dengan menyarangkan metrik di dalam bucket.",
        "Pipeline aggregations memproses data dari output agregasi lain (menggunakan parameter buckets_path).",
        "Hasil agregasi terms dapat diurutkan (sorting) secara dinamis menggunakan hasil dari sub-agregasi di bawahnya."
      ],
      quiz: [
        {
          id: "eng-m8-q1",
          prompt: "Bagaimana cara menyusun struktur agregasi untuk mencari rata-rata rating buku untuk setiap penulis?",
          options: [
            "Menaruh agregasi 'avg' rating di dalam agregasi 'terms' penulis",
            "Menaruh agregasi 'terms' penulis di dalam agregasi 'avg' rating",
            "Menjalankan dua query terpisah",
            "Menggunakan pipeline aggregation"
          ],
          answerIndex: 0,
          explanation: "Pertama, buat bucket untuk mengelompokkan dokumen berdasarkan penulis ('terms'), lalu sarangkan (nest) agregasi metrik rata-rata ('avg') di dalam bucket penulis tersebut."
        },
        {
          id: "eng-m8-q2",
          prompt: "Parameter apa yang wajib didefinisikan pada Pipeline Aggregation untuk menunjuk ke metrik yang akan diolah?",
          options: [
            "field",
            "buckets_path",
            "source",
            "target"
          ],
          answerIndex: 1,
          explanation: "Parameter 'buckets_path' digunakan oleh pipeline aggregation untuk menunjuk ke jalur metrik keluaran dari agregasi lain yang ingin dihitung nilainya."
        }
      ]
    },
    {
      slug: "changing-data",
      title: "Changing Data",
      level: "Menengah",
      durationMinutes: 25,
      intro: "Mempelajari teknik memperbarui data secara massal menggunakan update_by_query dan melakukan migrasi schema menggunakan Reindex API.",
      sections: [
        {
          heading: "Update By Query",
          paragraphs: [
            "API '_update_by_query' memungkinkan Anda memperbarui banyak dokumen sekaligus dalam satu panggilan API berdasarkan hasil dari sebuah query.",
            "Secara internal, Elasticsearch mengambil snapshot dari indeks, mencari dokumen yang cocok, lalu menjalankannya melalui Ingest Pipeline atau skrip Painless untuk memperbarui nilai field dokumen tersebut secara massal."
          ],
          codeExample: {
            title: "Menaikkan Harga Semua Buku Kategori Tertentu",
            lang: "json",
            code: `POST /buku/_update_by_query\n{\n  "script": {\n    "source": "ctx._source.harga += params.kenaikan",\n    "params": {\n      "kenaikan": 10000\n    }\n  },\n  "query": {\n    "term": {\n      "kategori.keyword": "novel"\n    }\n  }\n}`
          }
        },
        {
          heading: "Reindex API untuk Migrasi Skema",
          paragraphs: [
            "Karena tipe data field yang sudah diindeks tidak dapat diubah di tempat, satu-satunya cara mengubah mapping adalah membuat indeks baru dengan mapping yang benar, lalu menyalin data lama ke indeks baru.",
            "API '_reindex' dirancang khusus untuk kebutuhan ini. Ia menyalin dokumen dari indeks sumber ke indeks tujuan secara efisien di sisi server."
          ],
          codeExample: {
            title: "Melakukan Reindex ke Indeks Baru",
            lang: "json",
            code: `POST /_reindex\n{\n  "source": {\n    "index": "buku-lama"\n  },\n  "dest": {\n    "index": "buku-baru"\n  }\n}`
          }
        }
      ],
      keyPoints: [
        "_update_by_query memperbarui semua dokumen yang cocok dengan kriteria query menggunakan skrip atau pipeline.",
        "Reindex API menyalin data dari indeks asal ke indeks tujuan untuk keperluan perubahan mapping/skema.",
        "Gunakan parameter 'conflicts': 'proceed' untuk mengabaikan konflik versi dokumen jika ada penulisan data simultan saat update/reindex berjalan."
      ],
      quiz: [
        {
          id: "eng-m9-q1",
          prompt: "Mengapa kita membutuhkan Reindex API untuk mengubah tipe data field yang sudah terisi data?",
          options: [
            "Karena Elasticsearch tidak mengizinkan query diubah",
            "Karena inverted index tidak bisa diubah strukturnya di tempat tanpa mengindeks ulang seluruh dokumen dari awal",
            "Karena reindex otomatis menghapus data duplikat",
            "Karena reindex mengubah cluster menjadi green"
          ],
          answerIndex: 1,
          explanation: "Struktur inverted index bersifat immutable di disk setelah ditulis. Mengubah tipe field memerlukan pembuatan indeks baru dengan mapping yang diinginkan dan pengindeksan ulang data melalui Reindex API."
        },
        {
          id: "eng-m9-q2",
          prompt: "Bagaimana cara mencegah _update_by_query berhenti di tengah jalan saat menghadapi konflik versi dokumen?",
          options: [
            "Mengatur parameter 'conflicts' ke 'proceed'",
            "Mengatur parameter 'force' ke true",
            "Menghapus replica shard terlebih dahulu",
            "Merestart node master"
          ],
          answerIndex: 0,
          explanation: "Secara default, reindex atau update_by_query akan membatalkan proses jika terjadi konflik versi dokumen. Menyetel 'conflicts': 'proceed' menginstruksikan proses untuk terus berjalan dan melewati dokumen yang berkonflik."
        }
      ]
    },
    {
      slug: "enriching-data",
      title: "Enriching Data",
      level: "Menengah",
      durationMinutes: 25,
      intro: "Mengenal Enrich Processor untuk menggabungkan data dari indeks referensi ke dalam dokumen yang sedang di-index secara real-time.",
      sections: [
        {
          heading: "Konsep Data Enrichment",
          paragraphs: [
            "Data enrichment adalah proses menambahkan data kontekstual dari satu indeks referensi ke dalam dokumen baru saat proses ingestion berlangsung.",
            "Misalnya, jika Anda mengindeks log transaksi keuangan yang hanya berisi 'user_id', Anda dapat menggunakan Enrich Processor untuk mencari data nama dan email pengguna dari indeks 'users' dan menempelkannya ke dalam log transaksi tersebut secara otomatis."
          ]
        },
        {
          heading: "Langkah Mengonfigurasi Enrich Policy",
          paragraphs: [
            "Proses pengayaan data melibatkan tiga langkah utama:",
            "1. **Buat Enrich Policy**: Tentukan indeks referensi, field pencocokan (match_field), dan field yang ingin disalin (enrich_fields).",
            "2. **Eksekusi Policy**: Jalankan POST /_enrich/policy/<nama_policy>/_execute untuk membuat indeks sistem readonly terenkripsi khusus yang digunakan untuk pencarian cepat.",
            "3. **Pasang di Ingest Pipeline**: Hubungkan Enrich Processor di dalam sebuah ingest pipeline, lalu arahkan dokumen baru ke pipeline tersebut."
          ],
          codeExample: {
            title: "Mendefinisikan dan Menjalankan Enrich Policy",
            lang: "json",
            code: `PUT /_enrich/policy/user-lookup-policy\n{\n  "match": {\n    "indices": "users",\n    "match_field": "user_id",\n    "enrich_fields": ["nama", "email"]\n  }\n}\n\nPOST /_enrich/policy/user-lookup-policy/_execute`
          }
        }
      ],
      keyPoints: [
        "Enrich processor menggabungkan data referensi ke dalam dokumen baru saat diindeks.",
        "Proses enrichment membutuhkan Enrich Policy yang mendefinisikan relasi kecocokan data.",
        "Anda harus mengeksekusi (_execute) policy setiap kali data referensi pada indeks sumber mengalami perubahan agar data enrichment tetap mutakhir.",
        "Operasi enrichment berjalan di Ingest Node sebelum data ditulis ke dalam shard."
      ],
      quiz: [
        {
          id: "eng-m10-q1",
          prompt: "Apa yang harus Anda lakukan jika data di dalam indeks referensi berubah agar enrich processor menghasilkan data terbaru?",
          options: [
            "Melakukan restart pada seluruh cluster",
            "Mengeksekusi ulang (_execute) Enrich Policy yang bersangkutan",
            "Menghapus indeks referensi",
            "Membuat ingest pipeline baru"
          ],
          answerIndex: 1,
          explanation: "Enrich processor mencari data pada indeks sistem terenkripsi hasil eksekusi policy. Jika data referensi berubah, Anda harus menjalankan API _execute kembali agar indeks sistem tersebut diperbarui."
        },
        {
          id: "eng-m10-q2",
          prompt: "Node jenis apa dalam arsitektur klaster Elasticsearch yang memproses Ingest Pipeline dan Enrich Processor?",
          options: [
            "Master Node",
            "Data Node",
            "Ingest Node",
            "Coordinating Node"
          ],
          answerIndex: 2,
          explanation: "Ingest Node bertanggung jawab mengeksekusi semua langkah pra-pemrosesan di dalam Ingest Pipeline sebelum dokumen diindeks."
        }
      ]
    },
    {
      slug: "runtime-fields",
      title: "Runtime Fields",
      level: "Lanjutan",
      durationMinutes: 25,
      intro: "Membuat field fleksibel secara dinamis tanpa meningkatkan ukuran indeks menggunakan Runtime Fields yang dievaluasi saat query dijalankan.",
      sections: [
        {
          heading: "Apa itu Runtime Fields?",
          paragraphs: [
            "Runtime Fields adalah field yang nilainya dihitung secara dinamis saat query dijalankan (on-the-fly), mirip dengan kolom kalkulasi di database SQL tradisional. Field ini tidak disimpan di dalam indeks disk fisik klaster Anda.",
            "Ini memberikan fleksibilitas luar biasa: Anda dapat memodifikasi skema data tanpa reindexing, mengoreksi kesalahan parsing, atau membuat kolom analisis baru secara instan menggunakan skrip Painless."
          ]
        },
        {
          heading: "Runtime Fields di Mapping vs Search Request",
          paragraphs: [
            "Anda dapat mendefinisikan runtime fields dengan dua cara:",
            "1. **Di Mapping Indeks**: Didefinisikan di mapping sehingga dapat digunakan oleh siapa saja yang melakukan query ke indeks tersebut.",
            "2. **Di Search Request**: Didefinisikan secara sementara di dalam body query pencarian, hanya berlaku untuk request tersebut."
          ],
          codeExample: {
            title: "Mendefinisikan Runtime Field dalam Search Request",
            lang: "json",
            code: `GET /transaksi/_search\n{\n  "runtime_mappings": {\n    "total_rupiah": {\n      "type": "long",\n      "script": {\n        "source": "emit(doc['harga_usd'].value * 15000)"\n      }\n    }\n  },\n  "fields": [\n    "total_rupiah"\n  ],\n  "query": {\n    "range": {\n      "total_rupiah": {\n        "gte": 1500000\n      }\n    }\n  }\n}`
          }
        }
      ],
      keyPoints: [
        "Runtime fields dihitung secara on-the-fly saat query dieksekusi, menghemat penyimpanan disk.",
        "Logika perhitungan ditulis menggunakan bahasa skrip Painless.",
        "Menggunakan perintah 'emit()' di dalam skrip Painless untuk mengembalikan nilai field.",
        "Memiliki performa query yang lebih lambat dibanding field terindeks biasa karena beban kalkulasi dipindah ke runtime CPU."
      ],
      quiz: [
        {
          id: "eng-m11-q1",
          prompt: "Apa fungsi dari perintah 'emit()' dalam penulisan skrip Runtime Fields?",
          options: [
            "Menghapus dokumen dari memori",
            "Mengirim nilai kalkulasi skrip agar dikembalikan sebagai nilai runtime field terkait",
            "Memicu alarm sistem",
            "Meneruskan query ke cluster lain"
          ],
          answerIndex: 1,
          explanation: "Perintah emit() wajib digunakan di dalam skrip runtime field untuk menetapkan nilai hasil perhitungan yang nantinya ditampilkan di output query."
        },
        {
          id: "eng-m11-q2",
          prompt: "Apa konsekuensi atau tradeoff terbesar menggunakan Runtime Fields dibandingkan field terindeks biasa?",
          options: [
            "Ukuran indeks menjadi jauh lebih besar di disk",
            "Keamanan data menjadi berkurang",
            "Kecepatan eksekusi query menjadi lebih lambat karena nilai dihitung setiap kali query berjalan",
            "Runtime fields tidak bisa digunakan untuk filtering"
          ],
          answerIndex: 2,
          explanation: "Karena nilainya dihitung langsung di CPU saat query dieksekusi (bukan dibaca dari disk inverted index), runtime fields membutuhkan waktu pemrosesan lebih lama saat memproses banyak dokumen."
        }
      ]
    },
    {
      slug: "understanding-shards",
      title: "Understanding Shards",
      level: "Lanjutan",
      durationMinutes: 25,
      intro: "Menyelami arsitektur internal penyimpanan Elasticsearch: bagaimana primary dan replica shard dialokasikan, dan dampaknya pada performa.",
      sections: [
        {
          heading: "Arsitektur Shard Utama dan Replika",
          paragraphs: [
            "Satu indeks di Elasticsearch secara fisik dipecah menjadi bagian-bagian lebih kecil bernama Shard. Shard adalah instans Apache Lucene yang berdiri sendiri.",
            "Terdapat dua tipe shard:",
            "1. **Primary Shard**: Shard utama tempat dokumen ditulis pertama kali. Jumlah primary shard ditentukan saat pembuatan indeks dan tidak bisa diubah langsung.",
            "2. **Replica Shard**: Salinan dari primary shard. Berguna untuk toleransi kegagalan (high availability) jika data node mati, serta membantu mempercepat pencarian dengan melayani query baca secara paralel."
          ]
        },
        {
          heading: "Manajemen Shard yang Optimal",
          paragraphs: [
            "Memiliki terlalu banyak shard kecil (oversharding) menguras memori heap JVM karena setiap shard memiliki overhead metadata tersendiri.",
            "Aturan umum praktis manajemen shard:",
            "- Usahakan ukuran fisik shard berkisar antara **10 GB hingga 50 GB**.",
            "- Jaga jumlah total shard di satu node di bawah 20 shard per GB heap memory yang dialokasikan."
          ],
          codeExample: {
            title: "Memeriksa Alokasi Shard di Klaster",
            lang: "json",
            code: `GET /_cat/shards?v=true&h=index,shard,prirep,state,unassigned.reason`
          }
        }
      ],
      keyPoints: [
        "Shard adalah unit penyimpanan fisik terkecil yang merupakan instans Apache Lucene.",
        "Primary Shard melayani operasi tulis; Replica Shard melayani redundansi dan optimasi query baca.",
        "Jumlah primary shard bersifat immutable (kecuali menggunakan Shrink atau Split API).",
        "Ukuran shard ideal untuk kinerja optimal adalah antara 10 GB hingga 50 GB."
      ],
      quiz: [
        {
          id: "eng-m12-q1",
          prompt: "Apa status cluster health jika semua primary shard sukses dialokasikan tetapi ada beberapa replica shard yang berstatus unassigned (tidak teralokasi)?",
          options: [
            "green",
            "yellow",
            "red",
            "blue"
          ],
          answerIndex: 1,
          explanation: "Status Yellow berarti semua data utama (primary shard) aman dan dapat diakses, namun ada salinan data (replica shard) yang belum aktif/teralokasi di node mana pun."
        },
        {
          id: "eng-m12-q2",
          prompt: "Mengapa disarankan untuk menghindari pembuatan ribuan shard kecil berukuran di bawah 100MB di Elasticsearch?",
          options: [
            "Karena Lucene menolak berkas kecil",
            "Because having thousands of small shards consumes JVM heap and hurts performance",
            "Karena pencarian akan dibatasi hanya 10 dokumen",
            "Karena shard kecil otomatis dihapus oleh ILM"
          ],
          answerIndex: 1,
          explanation: "Setiap shard di Elasticsearch memerlukan alokasi overhead di RAM heap memory. Ribuan shard kecil akan membuang memori klaster secara sia-sia dan menurunkan performa secara drastis."
        }
      ]
    },
    {
      slug: "scaling-elasticsearch",
      title: "Scaling Elasticsearch",
      level: "Lanjutan",
      durationMinutes: 25,
      intro: "Mempelajari strategi penskalaan klaster Elasticsearch: pembagian peran node (master, data, ingest) dan alokasi shard otomatis.",
      sections: [
        {
          heading: "Pembagian Peran Node (Node Roles)",
          paragraphs: [
            "Seiring pertumbuhan klaster, sangat penting untuk memisahkan tanggung jawab node berdasarkan peran spesifik (Node Roles) untuk menghindari bottleneck:",
            "1. **Master-eligible node**: Bertanggung jawab atas pengelolaan klaster, pembuatan skema indeks, koordinasi keanggotaan node.",
            "2. **Data node**: Menyimpan shard dan memproses query tulis, baca, serta agregasi data.",
            "3. **Ingest node**: Mengeksekusi Ingest Pipeline untuk pra-pemrosesan dokumen sebelum disimpan.",
            "4. **Coordinating node**: Node tanpa peran khusus yang bertindak sebagai load balancer menerima request dan membaginya ke data node."
          ]
        },
        {
          heading: "Penskalaan Horizontal",
          paragraphs: [
            "Elasticsearch didesain untuk diskalakan secara horizontal dengan menambah node baru ke dalam klaster.",
            "Ketika node data baru ditambahkan, Elasticsearch secara otomatis akan mendistribusikan ulang (rebalance) shard-shard yang ada ke node baru tersebut untuk menyeimbangkan kapasitas penyimpanan dan komputasi."
          ],
          codeExample: {
            title: "Memeriksa Peran Node di Klaster",
            lang: "json",
            code: `GET /_cat/nodes?v=true&h=ip,name,role,heap.percent,cpu`
          }
        }
      ],
      keyPoints: [
        "Pemisahan peran node mencegah satu node mengalami kelebihan beban kerja di klaster besar.",
        "Master node mengelola state klaster; Data node menangani penyimpanan data.",
        "Elasticsearch otomatis melakukan rebalancing shard saat node data baru bergabung atau keluar.",
        "Klaster produksi minimal membutuhkan 3 master-eligible node terdedikasi untuk menghindari split-brain."
      ],
      quiz: [
        {
          id: "eng-m13-q1",
          prompt: "Node dengan peran apa yang bertanggung jawab mengoordinasikan pembuatan indeks dan mencatat daftar node aktif di klaster?",
          options: [
            "Data node",
            "Ingest node",
            "Master-eligible node",
            "Machine learning node"
          ],
          answerIndex: 2,
          explanation: "Master node bertugas memimpin klaster, mengelola metadata tingkat klaster (cluster state), serta mengoordinasikan penambahan/penghapusan indeks."
        },
        {
          id: "eng-m13-q2",
          prompt: "Berapakah jumlah minimum master-eligible node terdedikasi yang direkomendasikan pada klaster produksi untuk mencegah kondisi split-brain?",
          options: [
            "1",
            "2",
            "3",
            "5"
          ],
          answerIndex: 2,
          explanation: "Klaster produksi memerlukan minimal 3 master-eligible node sehingga jika terjadi kegagalan jaringan, klaster tetap memiliki kuorum mayoritas (2 dari 3) untuk memilih master baru dengan aman."
        }
      ]
    },
    {
      slug: "distributed-operations",
      title: "Distributed Operations",
      level: "Lanjutan",
      durationMinutes: 25,
      intro: "Memahami bagaimana Elasticsearch menangani operasi baca dan tulis secara terdistribusi di antara beberapa node dalam cluster.",
      sections: [
        {
          heading: "Alur Operasi Tulis (Write Path)",
          paragraphs: [
            "Ketika dokumen ditulis ke Elasticsearch, koordinasi berjalan sebagai berikut:",
            "1. Request diterima oleh **Coordinating Node**.",
            "2. Node menghitung shard tujuan menggunakan rumus routing: `shard = hash(_id) % number_of_primary_shards`.",
            "3. Request diteruskan ke node yang menyimpan **Primary Shard** terkait.",
            "4. Primary Shard memvalidasi dokumen dan menulisnya secara lokal.",
            "5. Primary Shard meneruskan request secara paralel ke semua **Replica Shards**.",
            "6. Setelah replika merespons sukses, Primary Shard mengirim konfirmasi ke Coordinating Node, yang kemudian merespons pengguna."
          ]
        },
        {
          heading: "Alur Operasi Baca (Read Path)",
          paragraphs: [
            "Operasi pencarian (search) terdistribusi membutuhkan dua tahap eksekusi:",
            "1. **Query Phase (Scatter)**: Coordinating node menyebarkan query ke semua shard (baik primary maupun replica) dari indeks yang dicari. Setiap shard mengeksekusi pencarian lokal dan mengembalikan daftar ID dokumen beserta skor relevansinya ke Coordinating node.",
            "2. **Fetch Phase (Gather)**: Coordinating node menggabungkan hasil, mengurutkannya, memilih dokumen teratas sesuai 'size' yang diminta, lalu meminta isi dokumen JSON lengkap hanya dari shard asal dokumen pemenang tersebut."
          ]
        }
      ],
      keyPoints: [
        "Operasi tulis selalu diarahkan ke Primary Shard terlebih dahulu baru direplikasi ke Replica.",
        "Rumus routing menentukan distribusi dokumen secara merata di seluruh primary shard.",
        "Operasi pencarian terdistribusi dibagi menjadi dua tahap: Query (Scatter) dan Fetch (Gather).",
        "Fetch phase meminimalkan pemindahan data jaringan dengan hanya mengambil dokumen lengkap setelah pemenang peringkat ditentukan."
      ],
      quiz: [
        {
          id: "eng-m14-q1",
          prompt: "Mengapa rumus routing Elasticsearch default menggunakan jumlah primary shard sebagai pembagi matematika?",
          options: [
            "Untuk menjamin data terenkripsi",
            "Agar dokumen didistribusikan secara merata di seluruh primary shard yang tersedia",
            "Untuk mengubah tipe data dokumen",
            "Untuk menghapus data duplikat secara otomatis"
          ],
          answerIndex: 1,
          explanation: "Rumus hash modulo membagi beban penyimpanan dokumen baru secara merata dan terprediksi di seluruh primary shard indeks."
        },
        {
          id: "eng-m14-q2",
          prompt: "Apa yang dilakukan Coordinating Node pada tahap Fetch (Fetch Phase) dalam pencarian terdistribusi?",
          options: [
            "Menghapus dokumen dari indeks",
            "Meminta isi dokumen JSON lengkap berdasarkan ID dokumen pemenang peringkat yang didapatkan dari Query Phase",
            "Mengubah skema mapping",
            "Membagi indeks menjadi beberapa shard baru"
          ],
          answerIndex: 1,
          explanation: "Setelah Coordinating Node menentukan dokumen mana saja yang masuk ke peringkat atas di Query Phase, ia langsung melakukan fetch (mengambil) isi JSON asli dokumen tersebut dari shard tempat dokumen itu disimpan."
        }
      ]
    },
    {
      slug: "data-management-concepts",
      title: "Data Management Concepts",
      level: "Lanjutan",
      durationMinutes: 25,
      intro: "Menguasai konsep manajemen data: merancang arsitektur indeks untuk pertumbuhan data yang efisien dan berkelanjutan.",
      sections: [
        {
          heading: "Index Templates dan Component Templates",
          paragraphs: [
            "Pada data deret waktu seperti log atau metrik, indeks baru dibuat secara berkala (misal harian). Menulis mapping manual setiap hari tentu tidak efisien.",
            "Elasticsearch menyediakan **Index Templates** yang mendefinisikan settings dan mappings yang otomatis diterapkan ke indeks baru ketika nama indeks cocok dengan pola wildcard (misal `logs-*`).",
            "**Component Templates** adalah blok pembangun modular reusable yang dapat digabungkan bersama untuk menyusun Index Template."
          ],
          codeExample: {
            title: "Membuat Component Template dan Index Template",
            lang: "json",
            code: `PUT /_component_template/settings-kustom\n{\n  "template": {\n    "settings": {\n      "number_of_shards": 1,\n      "number_of_replicas": 1\n    }\n  }\n}\n\nPUT /_index_template/logs-template\n{\n  "index_patterns": ["logs-*"],\n  "composed_of": ["settings-kustom"]\n}`
          }
        },
        {
          heading: "Index Aliases dan Rollover",
          paragraphs: [
            "**Index Alias** adalah nama samaran (pointer) yang menunjuk ke satu atau lebih indeks aktif. Ini sangat berguna agar aplikasi backend tidak perlu mengubah kode nama indeks saat terjadi pergantian indeks fisik.",
            "Proses **Rollover** memindahkan penulisan data dari indeks lama ke indeks baru secara otomatis saat indeks lama mencapai kriteria tertentu (seperti usia 7 hari atau ukuran 50GB)."
          ]
        }
      ],
      keyPoints: [
        "Index Template mengotomatisasi konfigurasi indeks baru berdasarkan pola kecocokan nama.",
        "Component Template adalah komponen modular yang menyusun Index Template.",
        "Index Alias menyembunyikan kompleksitas nama indeks fisik di belakang satu nama pointer.",
        "Rollover mengalihkan aktivitas penulisan ke indeks baru tanpa downtime penulisan."
      ],
      quiz: [
        {
          id: "eng-m15-q1",
          prompt: "Apa fungsi utama dari fitur Index Alias di Elasticsearch?",
          options: [
            "Menghapus dokumen secara otomatis",
            "Menyediakan satu nama samaran yang menunjuk ke satu atau beberapa indeks fisik, memisahkan backend aplikasi dari perubahan indeks di bawahnya",
            "Menerjemahkan bahasa query",
            "Meningkatkan memori heap secara dinamis"
          ],
          answerIndex: 1,
          explanation: "Dengan Alias, aplikasi Anda cukup melakukan query ke nama alias (misal 'logs_write') tanpa perlu peduli jika indeks fisik di bawahnya berganti dari 'logs-000001' ke 'logs-000002'."
        },
        {
          id: "eng-m15-q2",
          prompt: "Bagaimana cara menyusun Index Template agar fleksibel dan komponennya dapat digunakan kembali (reusable) di template lain?",
          options: [
            "Menulis semua konfigurasi di satu file besar",
            "Menggunakan Component Templates dan menggabungkannya di parameter 'composed_of'",
            "Menonaktifkan dynamic mapping",
            "Menggunakan alias untuk setiap template"
          ],
          answerIndex: 1,
          explanation: "Component templates dirancang khusus sebagai bagian modular reusable yang didefinisikan terpisah, lalu diimpor ke dalam index template lewat array 'composed_of'."
        }
      ]
    },
    {
      slug: "data-streams",
      title: "Data Streams",
      level: "Siap Ujian",
      durationMinutes: 30,
      intro: "Mengenal Data Streams, cara modern dan efisien untuk mengelola data deret waktu (time-series) yang bersifat append-only seperti log dan metrik.",
      sections: [
        {
          heading: "Konsep Dasar Data Stream",
          paragraphs: [
            "Data Stream adalah abstraksi modern di Elasticsearch untuk mengelola data deret waktu yang bersifat append-only (hanya ditambahkan, tidak pernah diperbarui di tempat) seperti log, metrik, atau data keamanan.",
            "Sebuah Data Stream menyatukan beberapa indeks tersembunyi (backing indices) di belakang satu nama endpoint pencarian tunggal. Ketika Anda menulis dokumen baru, data otomatis disimpan di backing index aktif yang paling baru."
          ]
        },
        {
          heading: "Persyaratan Menggunakan Data Stream",
          paragraphs: [
            "Untuk membuat Data Stream, Anda harus memenuhi beberapa syarat wajib:",
            "1. Dokumen harus memiliki field waktu bernama **`@timestamp`** bertipe `date` atau `date_nanos`.",
            "2. Anda wajib membuat **Index Template** yang mengaktifkan properti data stream (`\"data_stream\": {}`) dan memiliki pola nama indeks yang sesuai."
          ],
          codeExample: {
            title: "Membuat Index Template untuk Data Stream",
            lang: "json",
            code: `PUT /_index_template/metrics-template\n{\n  "index_patterns": ["metrics-*"],\n  "data_stream": {},\n  "template": {\n    "mappings": {\n      "properties": {\n        "@timestamp": { "type": "date" }\n      }\n    }\n  }\n}\n\nPUT /_data_stream/metrics-server`
          }
        }
      ],
      keyPoints: [
        "Data Stream menyembunyikan manajemen backing indices untuk data deret waktu append-only.",
        "Setiap dokumen wajib menyertakan field pencatat waktu bernama '@timestamp'.",
        "Operasi penulisan langsung diarahkan ke backing index terbaru, sedangkan pencarian dilakukan di seluruh backing indices.",
        "Operasi pembaruan dokumen (update) secara langsung dengan ID dilarang di Data Stream."
      ],
      quiz: [
        {
          id: "eng-m16-q1",
          prompt: "Field manakah yang wajib ada di setiap dokumen agar dapat dimasukkan ke dalam Data Stream?",
          options: [
            "id",
            "message",
            "@timestamp",
            "hostname"
          ],
          answerIndex: 2,
          explanation: "Data Stream didesain khusus untuk data berbasis waktu, sehingga mewajibkan setiap dokumen memiliki field pencatat waktu bernama '@timestamp'."
        },
        {
          id: "eng-m16-q2",
          prompt: "Bagaimana cara melakukan update pada dokumen yang sudah terlanjur disimpan di dalam Data Stream?",
          options: [
            "Menjalankan request PUT langsung ke ID dokumen tersebut",
            "Menjalankan update_by_query dengan skrip spesifik",
            "Data Stream tidak mengizinkan perubahan data sama sekali",
            "Menghapus dan membuat ulang klaster"
          ],
          answerIndex: 1,
          explanation: "Karena Data Stream bersifat append-only, penulisan langsung (PUT) ke ID dokumen yang sudah ada akan ditolak. Pembaruan hanya diperbolehkan melalui API _update_by_query atau _delete_by_query."
        }
      ]
    },
    {
      slug: "index-lifecycle-management",
      title: "Index Lifecycle Management (ILM)",
      level: "Siap Ujian",
      durationMinutes: 30,
      intro: "Mengotomasi siklus hidup indeks menggunakan ILM, memindahkan data dari fase hot, warm, cold, frozen, hingga fase delete sesuai kebijakan organisasi.",
      sections: [
        {
          heading: "Fase Siklus Hidup ILM",
          paragraphs: [
            "Index Lifecycle Management (ILM) mengotomatiskan pengelolaan indeks seiring bertambahnya usia data melalui 5 fase utama:",
            "1. **Hot**: Indeks aktif ditulis dan dicari. Biasanya berjalan proses rollover di sini.",
            "2. **Warm**: Indeks tidak lagi ditulis tetapi masih sering dicari. Indeks diubah menjadi read-only, dan dapat di-shrink (dikurangi shard) atau di-force-merge.",
            "3. **Cold**: Indeks jarang dicari. Data dapat dipindahkan ke hardware murah atau diubah menjadi searchable snapshot.",
            "4. **Frozen**: Indeks sangat jarang dicari. Data dipasang sebagai searchable snapshot penuh untuk menghemat heap memory.",
            "5. **Delete**: Indeks dihapus secara permanen untuk mengosongkan ruang disk."
          ]
        },
        {
          heading: "Konfigurasi ILM Policy",
          paragraphs: [
            "Anda membuat kebijakan ILM sekali, lalu memasangnya ke Index Template. Setiap indeks baru yang dibuat di bawah template tersebut otomatis akan mengikuti alur siklus hidup tersebut."
          ],
          codeExample: {
            title: "Membuat Policy ILM",
            lang: "json",
            code: `PUT /_ilm/policy/logs_policy\n{\n  "policy": {\n    "phases": {\n      "hot": {\n        "actions": {\n          "rollover": {\n            "max_size": "50gb",\n            "max_age": "30d"\n          }\n        }\n      },\n      "delete": {\n        "min_age": "90d",\n        "actions": {\n          "delete": {}\n        }\n      }\n    }\n  }\n}`
          }
        }
      ],
      keyPoints: [
        "ILM mengotomatiskan perpindahan indeks antar fase penyimpanan berdasarkan usia atau ukuran data.",
        "5 Fase ILM: Hot, Warm, Cold, Frozen, dan Delete.",
        "Rollover pada fase Hot menjaga ukuran indeks agar tetap berada dalam performa terbaik.",
        "Integrasi ILM dengan Index Template memastikan otomatisasi tanpa intervensi manual berkala."
      ],
      quiz: [
        {
          id: "eng-m17-q1",
          prompt: "Fase ILM mana yang bertanggung jawab melakukan proses rollover ketika indeks aktif mencapai batas ukuran tertentu?",
          options: [
            "Hot Phase",
            "Warm Phase",
            "Cold Phase",
            "Delete Phase"
          ],
          answerIndex: 0,
          explanation: "Rollover hanya terjadi di fase Hot, di mana indeks tersebut masih aktif menerima operasi penulisan dokumen baru."
        },
        {
          id: "eng-m17-q2",
          prompt: "Apa yang terjadi pada dokumen di fase Delete?",
          options: [
            "Dokumen dikompresi saja",
            "Indeks beserta seluruh dokumen di dalamnya dihapus secara permanen dari klaster",
            "Dokumen dipindahkan ke indeks sistem",
            "Dokumen dikirim ke klaster remote"
          ],
          answerIndex: 1,
          explanation: "Fase Delete melakukan penghapusan fisik secara permanen terhadap indeks lama yang telah melewati batas retensi data minimum yang ditentukan."
        }
      ]
    },
    {
      slug: "searchable-snapshots",
      title: "Searchable Snapshots",
      level: "Siap Ujian",
      durationMinutes: 30,
      intro: "Menghemat biaya penyimpanan klaster secara drastis dengan melakukan pencarian langsung pada snapshot yang disimpan di object storage eksternal.",
      sections: [
        {
          heading: "Konsep Searchable Snapshots",
          paragraphs: [
            "Secara tradisional, snapshot hanya digunakan sebagai cadangan (backup) pasif yang harus dipulihkan (restore) sepenuhnya ke disk lokal sebelum dapat dicari kembali.",
            "**Searchable Snapshots** adalah fitur revolusioner yang memungkinkan Elasticsearch mencari data secara langsung dari snapshot yang tersimpan di penyimpanan objek eksternal (seperti AWS S3, Google Cloud Storage, atau Azure Blob) secara real-time tanpa perlu restore penuh ke server."
          ]
        },
        {
          heading: "Peran dalam Arsitektur Cold & Frozen Tiers",
          paragraphs: [
            "Searchable Snapshots adalah pilar utama dari Cold dan Frozen data tiers. Dengan fitur ini, Anda dapat memangkas kebutuhan penyimpanan disk lokal hingga **50% pada Cold Tier** (hanya memerlukan cache lokal) dan bahkan **hingga 100% pada Frozen Tier** (tidak memerlukan penyimpanan lokal sama sekali selain cache memori yang sangat kecil)."
          ],
          codeExample: {
            title: "Me-mount Snapshot sebagai Searchable Snapshot",
            lang: "json",
            code: `POST /_snapshot/repo_cadangan/snapshot_1/_mount?wait_for_completion=true\n{\n  "index": "logs-2024",\n  "renamed_index": "restored-logs-2024",\n  "storage": "shared_cache"\n}`
          }
        }
      ],
      keyPoints: [
        "Searchable Snapshots memungkinkan query dijalankan langsung di atas data snapshot eksternal.",
        "Sangat mengurangi biaya infrastruktur klaster dengan meminimalkan kebutuhan SSD lokal.",
        "Menjadi teknologi dasar untuk Cold Tier (dengan local cache) dan Frozen Tier.",
        "Penyimpanan fisik menggunakan Object Storage yang murah dan berskala masif."
      ],
      quiz: [
        {
          id: "eng-m18-q1",
          prompt: "Mengapa Searchable Snapshots dapat mengurangi biaya operasional klaster Elasticsearch secara signifikan?",
          options: [
            "Karena fitur ini mematikan replikasi otomatis",
            "Karena memungkinkan data lama disimpan di Object Storage eksternal yang murah tetapi tetap dapat dicari langsung tanpa perlu dipulihkan ke SSD lokal",
            "Karena fitur ini mempercepat proses ingest data baru",
            "Karena fitur ini menghapus log otomatis"
          ],
          answerIndex: 1,
          explanation: "Object Storage seperti AWS S3 jauh lebih murah daripada penyimpanan SSD lokal. Dengan mencari langsung dari sana, klaster dapat menyimpan data bertahun-tahun dengan biaya minimal."
        },
        {
          id: "eng-m18-q2",
          prompt: "Dalam arsitektur data tiers, tier mana yang sama sekali tidak membutuhkan penyimpanan sekunder lokal karena murni mengandalkan Searchable Snapshots?",
          options: [
            "Hot Tier",
            "Warm Tier",
            "Cold Tier",
            "Frozen Tier"
          ],
          answerIndex: 3,
          explanation: "Frozen Tier dirancang khusus agar indeks dipasang murni sebagai searchable snapshot penuh, mengeliminasi kebutuhan disk lokal dan hanya menyisakan memori cache sementara."
        }
      ]
    },
    {
      slug: "multi-cluster-operations",
      title: "Multi Cluster Operations",
      level: "Siap Ujian",
      durationMinutes: 30,
      intro: "Menghubungkan beberapa klaster Elasticsearch menggunakan Cross-Cluster Search (CCS) dan Cross-Cluster Replication (CCR) untuk skalabilitas global.",
      sections: [
        {
          heading: "Cross-Cluster Search (CCS)",
          paragraphs: [
            "Cross-Cluster Search (CCS) memungkinkan sebuah klaster bertindak sebagai federasi yang menjalankan satu query pencarian tunggal ke beberapa klaster Elasticsearch mandiri yang terpisah secara geografis.",
            "Ini sangat berguna bagi organisasi global yang memiliki klaster lokal di berbagai wilayah (misal Asia, Eropa, Amerika) agar tetap dapat mencari seluruh data dari satu konsol pusat."
          ],
          codeExample: {
            title: "Melakukan Query Pencarian Multi-Klaster",
            lang: "json",
            code: `GET /klaster_asia:logs-*,klaster_eropa:logs-*/_search\n{\n  "query": {\n    "match": {\n      "status": "error"\n    }\n  }\n}`
          }
        },
        {
          heading: "Cross-Cluster Replication (CCR)",
          paragraphs: [
            "Cross-Cluster Replication (CCR) digunakan untuk mereplikasi indeks secara aktif dan real-time dari satu klaster (Leader) ke klaster lain (Follower).",
            "CCR sangat krusial untuk strategi pemulihan bencana (Disaster Recovery / DR) serta untuk mendekatkan posisi data ke pengguna akhir demi meminimalkan latensi pencarian."
          ]
        }
      ],
      keyPoints: [
        "CCS memungkinkan pencarian federasi ke beberapa klaster dari satu query tunggal.",
        "CCS merujuk indeks klaster remote menggunakan format <nama_klaster_remote>:<nama_indeks>.",
        "CCR melakukan replikasi data aktif secara asinkronus antar klaster mandiri.",
        "Indeks follower hasil replikasi CCR di klaster tujuan bersifat read-only."
      ],
      quiz: [
        {
          id: "eng-m19-q1",
          prompt: "Bagaimana cara melakukan pencarian ke indeks 'orders' pada klaster remote bernama 'klaster_us' dari klaster lokal Anda?",
          options: [
            "GET /orders/_search?remote=klaster_us",
            "GET /klaster_us:orders/_search",
            "GET /klaster_us/orders/_search",
            "POST /_remote/klaster_us/orders"
          ],
          answerIndex: 1,
          explanation: "Pada Cross-Cluster Search (CCS), klaster remote diidentifikasi menggunakan awalan nama klaster remote diikuti tanda titik dua (colon), contoh: 'klaster_us:orders'."
        },
        {
          id: "eng-m19-q2",
          prompt: "Bagaimanakah sifat indeks Follower di klaster tujuan ketika menggunakan Cross-Cluster Replication (CCR)?",
          options: [
            "Dapat ditulis dan dibaca secara bebas (read-write)",
            "Bersifat hanya-baca (read-only)",
            "Hanya bisa ditulis tanpa bisa dibaca",
            "Otomatis terhapus setelah 24 jam"
          ],
          answerIndex: 1,
          explanation: "Indeks follower murni merupakan replika cermin asinkronus dari indeks leader, sehingga dikunci agar hanya bisa dibaca (read-only) untuk menjamin konsistensi data."
        }
      ]
    },
    {
      slug: "troubleshooting",
      title: "Troubleshooting",
      level: "Siap Ujian",
      durationMinutes: 30,
      intro: "Latihan mendiagnosis masalah klaster yang paling umum: alokasi shard gagal, kehabisan memori heap JVM, dan sirkuit pemutus (circuit breakers).",
      sections: [
        {
          heading: "Mendiagnosis Shard Unassigned",
          paragraphs: [
            "Ketika indeks berstatus Yellow atau Red, itu tandanya ada shard yang gagal dialokasikan ke node.",
            "Untuk mendiagnosis alasan tepat kegagalan alokasi tersebut, gunakan API **`_cluster/allocation/explain`**. API ini akan menganalisis keputusan alokasi klaster dan memberikan laporan tekstual yang menjelaskan mengapa shard tidak bisa ditempatkan di node mana pun (misal karena disk penuh, batasan alokasi, dll)."
          ],
          codeExample: {
            title: "Menggunakan Allocation Explain",
            lang: "json",
            code: `GET /_cluster/allocation/explain\n{\n  "index": "logs-2024",\n  "shard": 0,\n  "primary": true\n}`
          }
        },
        {
          heading: "Heap Memory dan Circuit Breakers",
          paragraphs: [
            "Masalah stabilitas klaster yang paling sering ditemui adalah kehabisan memori heap JVM (OutOfMemoryError).",
            "Elasticsearch mengantisipasi hal ini dengan menyediakan **Circuit Breakers** internal. Sirkuit pemutus ini memantau penggunaan memori secara real-time. Jika sebuah query (seperti agregasi besar atau pencarian teks penuh) diperkirakan akan melampaui batas memori aman, sirkuit akan memutus (abort) query tersebut seketika dan mengembalikan error, menjaga node agar tidak crash."
          ]
        }
      ],
      keyPoints: [
        "API _cluster/allocation/explain adalah alat utama mendiagnosis alasan shard gagal dialokasikan (unassigned).",
        "Circuit Breakers menghentikan query yang memakan memori berlebih sebelum memicu OutOfMemoryError.",
        "Mendapatkan visualisasi alokasi shard secara cepat melalui API _cat/shards.",
        "Meningkatkan kapasitas memori heap JVM (direkomendasikan maksimal 50% RAM fisik dan tidak melebihi 32GB)."
      ],
      quiz: [
        {
          id: "eng-m20-q1",
          prompt: "API manakah yang harus Anda panggil pertama kali untuk menganalisis mengapa sebuah primary shard berstatus unassigned di klaster?",
          options: [
            "GET /_cluster/health",
            "GET /_cluster/allocation/explain",
            "GET /_cat/nodes",
            "POST /_analyze"
          ],
          answerIndex: 1,
          explanation: "API _cluster/allocation/explain menganalisis state alokasi shard secara spesifik dan melaporkan alasan rinci kegagalannya secara transparan."
        },
        {
          id: "eng-m20-q2",
          prompt: "Apa yang dilakukan oleh sirkuit pemutus (Circuit Breaker) di Elasticsearch saat menerima query agregasi raksasa yang diprediksi melebihi kapasitas memori?",
          options: [
            "Membagi query menjadi sub-query otomatis",
            "Membatalkan (abort) eksekusi query tersebut seketika dan mengembalikan error untuk melindungi node agar tidak kehabisan heap memory dan crash",
            "Mematikan node secara paksa",
            "Menghapus dokumen lama di klaster"
          ],
          answerIndex: 1,
          explanation: "Circuit Breakers mendeteksi penggunaan memori sebelum query berjalan penuh. Jika diprediksi akan melebihi batas, sirkuit akan menghentikannya demi menjaga keutuhan dan stabilitas klaster."
        }
      ]
    }
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
        "Kecepatan penulisan lambat",
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
