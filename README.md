# 🍰 Mini Bites - Platform E-Commerce Dessert Mini Premium

Tugas Proyek UAS: **"Membangun Website E-Commerce Fungsional dengan Integrasi Strategi Bisnis Modern"**
- **Mahasiswa Utama:** Reishya Damayanti Kirani Putri (NIM: 209250230)
- **Kategori Produk:** Dessert Mini Premium (Cake, Tartlet, Mousse, Pudding, Macaron, Choux)
- **Teknologi:** React, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons, LocalStorage

---

## 📋 1. Profil Bisnis & Proposisi Nilai (Value Proposition)

### Profil Bisnis
**MiniSweet Co.** adalah bisnis kuliner (F&B) modern yang fokus memproduksi dan menjual dessert (hidangan penutup) berukuran mini berkualitas premium secara langsung ke pelanggan (Direct-to-Consumer / D2C) melalui platform e-commerce terintegrasi. 

### Proposisi Nilai (Value Proposition)
1. **Guilt-Free Mini Portion (Porsi Bebas Penyesalan):** Menyajikan dessert dalam ukuran mini (diameter 6-7 cm, berat 80-120 gram) dengan kalori terkontrol (130-220 kkal). Sangat cocok bagi gaya hidup sehat perkotaan yang ingin memanjakan hasrat manis tanpa khawatir kalori berlebih atau makanan terbuang.
2. **Premium & Organic Ingredients:** Menggunakan bahan-bahan impor bersertifikat murni, seperti mentega Prancis, cokelat Belgia Callebaut, Matcha Shizuoka Jepang, dan buah-buahan lokal organik segar tanpa pemanis buatan maupun bahan pengawet.
3. **Sterile & Hygenic Logistics:** Diproduksi di dapur steril standar HACCP dan dikirim menggunakan armada logistik dingin (*cold logistics*) serta *eco-insulated bag* kedap udara untuk menjaga kestabilan tekstur dessert hingga sampai ke tangan pelanggan.

---

## 🎯 2. Target Pasar & Segmentasi Pelanggan

Kami melakukan pendekatan segmentasi pasar berdasarkan tiga kriteria utama:
- **Demografis:** Pria & wanita usia produktif 18-40 tahun (Mahasiswa, Eksekutif Muda, Ibu Rumah Tangga Modern) kelas sosial ekonomi menengah ke atas (SES A & B) yang aktif bersosial media.
- **Psikografis:** Pecinta kuliner estetis (*foodies*) yang menghargai keindahan penyajian (*Instagramable*), peduli terhadap kadar konsumsi gula harian (ramah diet Ketogenik & penderita gluten-intolerant), serta terbiasa bertransaksi cashless secara online.
- **Geografis:** Berdomisili di wilayah Jabodetabek dengan radius jangkauan pengiriman instan maksimal 25 km dari titik dapur produksi satelit kami.

---

## 📈 3. Analisis Pasar & Pesaing (Competitors)

| Pesaing | Kelemahan Mereka | Keunggulan Kompetitif MiniSweet Co. |
| :--- | :--- | :--- |
| **Bakery & Patisserie Tradisional** | Ukuran kue besar (*whole cake*), harga relatif mahal untuk konsumsi harian, tinggi gula, dan logistik pengiriman konvensional. | Porsi mini individu, harga kompetitif per pcs, varian *healthy sweet* rendah gula, serta integrasi ojek online instan. |
| **Home-Baker Rumahan (Pre-Order)** | Waktu pemesanan lama (harus H-3), sanitasi dapur sulit diaudit, pembayaran manual via transfer bank personal. | Produk selalu siap sedia (*ready-stock*), jaminan standar higienis dapur, dan pembayaran instan otomatis (e-wallet/VA). |

---

## 🗂️ 4. Strategi Manajemen Produk & Katalog

Katalog produk diklasifikasikan secara matang untuk memfasilitasi kebutuhan emosional pelanggan yang beragam:
1. **Cake & Tartlet (Traditional Joy):** Varian manis klasik visual tinggi (contoh: *Strawberry Velvet Tartlet*, *Premium Red Velvet Dome*) untuk perayaan momen spesial.
2. **Mousse & Pudding (Luxurious Creamy):** Varian tekstur selembut sutra dengan rasa cokelat dan matcha mewah (contoh: *Belgian Triple Chocolate Mousse*, *Shizuoka Matcha Panna Cotta*).
3. **Macaron & Choux (Crunchy Treat):** Varian renyah beraroma mentega gurih (contoh: *Parisian Macarons Trio*, *Espresso Craquelin Choux*) sebagai pendamping minum kopi/teh.
4. **Healthy Sweet (Wellness Choice):** Kategori rendah gula, rendah karbohidrat, gluten-free, dan ramah keto (contoh: *Keto Avocado Choco Mousse*, *Gluten-Free Lemon Berry Tartlet*) bagi penderita diabetes dan pelaku gaya hidup bugar.

---

## 💰 5. Model Bisnis, Harga & Strategi Promo

### Aliran Pendapatan (Revenue Streams)
- **Penjualan Ritel D2C:** Penjualan langsung harian dari website e-commerce MiniSweet.
- **B2B Catering & Corporate Events:** Paket katering pencuci mulut untuk rapat kantor, pernikahan, arisan, dan pesta ulang tahun.
- **Hampers & Gift Box Musiman:** Paket bundel dekoratif pada hari raya keagamaan (Idul Fitri, Natal) dan wisuda kelulusan.

### Strategi Harga (Psychological Pricing)
Harga produk berkisar antara **Rp 17.500 - Rp 29.000** per pcs. Penetapan harga ini memicu persepsi "kemewahan terjangkau" (*affordable luxury*) di benak konsumen, di mana mereka dapat menikmati kualitas rasa patisserie bintang lima tanpa perlu mengeluarkan uang ratusan ribu rupiah untuk membeli kue utuh besar.

### Strategi Promosi Aktif
1. **Diskon Persentase (Kupon `PROMO10`):** Potongan harga 10% tanpa minimal belanja untuk mempercepat konversi pelanggan baru yang masih ragu mencoba produk.
2. **Potongan Langsung (Kupon `MANIS5K`):** Potongan Rp 5.000 dengan minimal belanja tertentu guna merangsang peningkatan nilai transaksi rata-rata (*Average Order Value*).
3. **Gimmick Logistik (Kupon `FREETAS`):** Hadiah bonus *Premium Insulated Bag* gratis untuk meningkatkan retensi pembeli yang peduli terhadap kestabilan suhu dessert saat pengantaran.

---

## 💳 6. Proses Checkout & Simulasi Payment Gateway

Website e-commerce ini mengintegrasikan **Simulasi Payment Gateway (Midtrans Sandbox)** dengan alur kerja sebagai berikut:
1. **Pemilihan Menu & Cart:** Pelanggan memilih produk dan kuantitas di katalog, data tersimpan aman di `localStorage` peramban.
2. **Form Pengisian:** Mengisi detail pengiriman, jenis kurir dingin (Instant/Same Day/Regular), dan kupon promo.
3. **Pembayaran Instan (Sandbox Gateway):** Pembeli memilih metode pembayaran QRIS (scan e-wallet otomatis) atau Virtual Account Bank (BCA/Mandiri).
4. **Validasi & Invoice Otomatis:** Menampilkan simulasi popup instruksi transfer, tombol simulasi bayar sukses, dan pencetakan invoice formal berstatus **PAID/LUNAS** dari sisi ledger simulator.

---

## 🔍 7. Rencana SEO, Keamanan & Pemeliharaan Web

### Strategi SEO (Search Engine Optimization)
- **Semantic HTML5:** Penggunaan struktur tag semantic (`<header>`, `<main>`, `<section>`, `<footerClass>`) dan atribut `alt` lengkap pada setiap gambar dessert mini.
- **Keyword Targeting:** Memprioritaskan kata kunci lokal berekor panjang (*long-tail keywords*) seperti *"dessert mini premium terdekat jakarta"*, *"mini cake sehat rendah gula"*, atau *"hampers kue sus wisuda bekasi"*.
- **Kecepatan Halaman:** Mengompresi seluruh gambar produk ke format modern `.webp` serta minifikasi kode JavaScript untuk memastikan *First Contentful Paint* di bawah 1.5 detik.

### Sistem Keamanan
- **SSL/TLS Encryption:** Seluruh data lalu lintas pembeli dienkripsi menggunakan protokol HTTPS SHA-256.
- **Tokenisasi Data:** Simulasi pembayaran tidak merekam kredensial kartu kredit atau rekening bank konsumen pada server internal, melainkan dilewatkan secara aman melalui token pihak ketiga (Sandbox Gateway).
- **Sanitasi Input:** Memvalidasi seluruh formulir checkout guna mengantisipasi ancaman injeksi database (*XSS & SQL Injection*).

### Rencana Pemeliharaan (Maintenance)
- Melakukan pemeriksaan rutin dependensi berkala (*security patch updates*).
- Melakukan backup harian database produk dan pesanan secara cloud-automated.
- Memantau keandalan hosting web untuk mengantisipasi lonjakan trafik saat kampanye iklan berjalan.

---

## 📊 8. Pemanfaatan Web Analytics untuk Pengambilan Keputusan

Kami menanamkan tag pelacakan dummy **Google Analytics 4 (GA4)** pada website dengan rencana pemantauan metrik sebagai berikut:
1. **Rasio Pantulan (Bounce Rate):** Jika tinggi, kami akan mengevaluasi keterbacaan font atau estetika gambar produk utama.
2. **Rasio Konversi (Conversion Rate):** Memantau persentase pengguna yang beralih dari keranjang ke tahap pembayaran sukses. Jika rendah, kami menguji apakah biaya kurir pengiriman terasa terlalu membebani konsumen.
3. **Rata-rata Nilai Pesanan (Average Order Value / AOV):** Mengukur efektivitas kupon promo bundel (misal: mendorong pelanggan membeli minimal 6 pcs untuk mendapatkan box gratis).

---
*Tugas ini disusun secara matang dan profesional untuk memenuhi standar kelulusan Proyek UAS E-Commerce Bisnis Modern.*
