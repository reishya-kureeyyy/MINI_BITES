import React, { useState } from 'react';
import { Target, TrendingUp, ShieldCheck, PieChart, Tag, DollarSign, Eye, RefreshCw, Layers, Search, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

export default function BusinessOverview() {
  const [activeSection, setActiveSection] = useState<'profile' | 'market' | 'pricing' | 'tech'>('profile');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 text-center md:text-left bg-gradient-to-r from-pink-600 to-amber-500 p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 opacity-10 text-9xl font-bold">🍰</div>
        <div className="relative z-10 space-y-2">
          <span className="text-xxs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full text-white">Dokumentasi & Strategi Bisnis</span>
          <h1 className="text-3xl md:text-4xl font-sans font-bold tracking-tight">Ikhtisar Bisnis Modern</h1>
          <p className="text-sm text-pink-100 max-w-2xl">Dokumentasi komprehensif strategi bisnis MINI BITES & integrasi sistem e-commerce modern.</p>
        </div>
      </div>

      {/* Navigation tabs inside Business Overview */}
      <div className="flex flex-wrap gap-2 mb-8 pb-2 border-b border-pink-100">
        <button
          id="btn-biz-profile"
          onClick={() => setActiveSection('profile')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeSection === 'profile'
              ? 'bg-pink-600 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-100 hover:bg-pink-50'
          }`}
        >
          📋 Profil & Value Proposition
        </button>
        <button
          id="btn-biz-market"
          onClick={() => setActiveSection('market')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeSection === 'market'
              ? 'bg-pink-600 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-100 hover:bg-pink-50'
          }`}
        >
          🎯 Target Pasar & Kompetitor
        </button>
        <button
          id="btn-biz-pricing"
          onClick={() => setActiveSection('pricing')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeSection === 'pricing'
              ? 'bg-pink-600 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-100 hover:bg-pink-50'
          }`}
        >
          🏷️ Strategi Produk & Harga
        </button>
        <button
          id="btn-biz-tech"
          onClick={() => setActiveSection('tech')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeSection === 'tech'
              ? 'bg-pink-600 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-100 hover:bg-pink-50'
          }`}
        >
          🛡️ SEO, Keamanan & Analitis
        </button>
      </div>

      {/* Grid Content */}
      <div className="space-y-8">
        
        {/* SECTION 1: PROFILE & VALUE PROPOSITION */}
        {activeSection === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            {/* Value Proposition Box */}
            <div className="md:col-span-8 bg-white rounded-2xl p-6 border border-pink-100 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Target className="w-5.5 h-5.5 text-pink-600" />
                Nama Bisnis & Proposisi Nilai (Value Proposition)
              </h2>
              
              <div className="space-y-4 text-xs text-gray-600 leading-relaxed">
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Nama Brand: <span className="text-pink-600">MINI BITES</span></h4>
                  <p className="mt-1">
                    <strong>MINI BITES</strong> adalah produsen kudapan manis (dessert) premium berukuran mini yang berfokus pada cita rasa autentik Perancis dan Jepang. Kami melayani konsumen perkotaan modern yang membutuhkan asupan kudapan manis berkualitas tinggi dalam porsi personal (guilt-free portion) untuk menjaga gaya hidup sehat yang seimbang.
                  </p>
                </div>

                <div className="bg-pink-50/50 p-4 rounded-xl border border-pink-100/60">
                  <h4 className="font-bold text-pink-700 text-xs uppercase tracking-wider mb-2">Pernyataan Proposisi Nilai (Value Proposition)</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-1.5">
                      <span className="text-pink-500 font-bold shrink-0">✨</span>
                      <span><strong>Guilt-Free Mini Portion:</strong> Ukuran mini (diameter 6-7 cm, kalori terkontrol 130-220 kkal) memanjakan hasrat manis tanpa khawatir kalori berlebih atau pemborosan makanan.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-pink-500 font-bold shrink-0">✨</span>
                      <span><strong>Bahan Baku Premium & Organik:</strong> Kami menggunakan butter Prancis, cokelat Belgia murni, matcha Shizuoka, dan buah-buahan lokal organik bebas pestisida.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-pink-500 font-bold shrink-0">✨</span>
                      <span><strong>Higienitas Bersertifikat:</strong> Diproses secara steril di dapur bersertifikat standar HACCP dengan kemasan tertutup rapat kedap udara (airtight eco-cup).</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 text-xs">Model Bisnis (Business Model & Revenue Streams)</h4>
                  <p className="mt-1">
                    Kami menjalankan model bisnis <strong>Direct-to-Consumer (D2C)</strong> e-commerce, menjual langsung ke konsumen akhir untuk memangkas rantai distribusi sehingga harga tetap terjangkau dengan margin keuntungan sehat. Aliran pendapatan utama bersumber dari penjualan ritel online, pemesanan katering event (pernikahan/meeting kantor), dan program langganan bulanan "Monthly Sweet-Box".
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar Details */}
            <div className="md:col-span-4 bg-amber-50/40 rounded-2xl p-6 border border-amber-100 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900">Analisis 3 Pilar Utama</h3>
                
                <div className="space-y-3.5 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-amber-100 shadow-xxs">
                    <p className="font-bold text-pink-600">🥇 Pilar Kualitas</p>
                    <p className="text-gray-500 mt-0.5">Mempertahankan rating konsisten di atas 4.8★ melalui seleksi kontrol kualitas bahan harian.</p>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-amber-100 shadow-xxs">
                    <p className="font-bold text-amber-600">🥈 Pilar Logistik Dingin</p>
                    <p className="text-gray-500 mt-0.5">Menjamin dessert sampai dalam kondisi dingin optimal (-4°C) dengan tas insulator es gel khusus.</p>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-amber-100 shadow-xxs">
                    <p className="font-bold text-teal-600">🥉 Pilar Skalabilitas</p>
                    <p className="text-gray-500 mt-0.5">Sistem modular e-commerce terintegrasi mempermudah pengelolaan stok real-time dapur cabang.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* SECTION 2: TARGET PASAR & KOMPETITOR */}
        {activeSection === 'market' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Target Market */}
              <div className="bg-white rounded-2xl p-6 border border-pink-100 shadow-xs space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <PieChart className="w-5.5 h-5.5 text-pink-600" />
                  Target Pasar & Segmentasi Pelanggan
                </h3>

                <div className="space-y-3 text-xs text-gray-600">
                  <p>
                    Pasar sasaran MINI BITES diformulasikan berdasarkan beberapa karakteristik utama:
                  </p>

                  <div className="space-y-2">
                    <div className="border-l-3 border-pink-500 pl-3">
                      <p className="font-bold text-gray-800">1. Segmentasi Demografis</p>
                      <p className="text-gray-500">Pria & wanita usia produktif 18 - 40 tahun (Mahasiswa, Pekerja Kantoran, Ibu Rumah Tangga Modern) kelas sosial ekonomi menengah ke atas (SES A & B).</p>
                    </div>

                    <div className="border-l-3 border-pink-500 pl-3">
                      <p className="font-bold text-gray-800">2. Segmentasi Psikografis</p>
                      <p className="text-gray-500">Masyarakat perkotaan urban dengan gaya hidup padat yang menghargai estetika penyajian makanan ("Instagramable"), peduli pada kesehatan/kadar gula (mendukung diet keto/bebas gluten), dan terbiasa berbelanja online.</p>
                    </div>

                    <div className="border-l-3 border-pink-500 pl-3">
                      <p className="font-bold text-gray-800">3. Geografis</p>
                      <p className="text-gray-500">Konsumen yang berdomisili di kawasan Jabodetabek & kota-kota besar di Indonesia dengan jangkauan kurir instan ojek online maksimal 25 km.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Competitor Analysis */}
              <div className="bg-white rounded-2xl p-6 border border-pink-100 shadow-xs space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5.5 h-5.5 text-pink-600" />
                  Analisis Pasar & Pesaing (Competitors)
                </h3>

                <div className="space-y-3 text-xs text-gray-600">
                  <p>
                    Industri F&B khususnya dessert manis di Indonesia tumbuh pesat, namun memiliki tingkat kejenuhan tinggi. Berikut peta kekuatan kami:
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="border-b border-pink-100 bg-pink-50/50 text-gray-700">
                          <th className="py-2 px-1 font-bold">Kategori / Pesaing</th>
                          <th className="py-2 px-1 font-bold">Kelemahan Mereka</th>
                          <th className="py-2 px-1 font-bold">Proposisi MINI BITES</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr>
                          <td className="py-2 px-1 font-semibold text-gray-800">Toko Dessert Klasik (Bakery Besar)</td>
                          <td className="py-2 px-1 text-gray-500">Porsi terlalu besar (Whole Cake), harga mahal, kadar gula tinggi, sulit diantar instan.</td>
                          <td className="py-2 px-1 text-emerald-600 font-semibold">Portabilitas tinggi, porsi mini terkontrol kalori, pemesanan online instan.</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-1 font-semibold text-gray-800">Home-Baker Rumahan (Instagram)</td>
                          <td className="py-2 px-1 text-gray-500">Waktu produksi lambat (pre-order h-3), sanitasi dapur kurang terpantau, ongkos kirim manual.</td>
                          <td className="py-2 px-1 text-emerald-600 font-semibold">Ready-stock harian, jaminan sertifikat steril, checkout otomatis dengan tarif kurir real-time.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* SECTION 3: STRATEGI PRODUK & HARGA */}
        {activeSection === 'pricing' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            {/* Catalog Management Strategy */}
            <div className="md:col-span-7 bg-white rounded-2xl p-6 border border-pink-100 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Layers className="w-5.5 h-5.5 text-pink-600" />
                Manajemen Produk & Katalog Strategi
              </h3>

              <div className="space-y-3 text-xs text-gray-600 leading-relaxed">
                <p>
                  Katalog produk MINI BITES dikategorikan secara strategis untuk menjangkau berbagai kebutuhan emosional pelanggan:
                </p>

                <ul className="space-y-2">
                  <li>
                    <strong>🍰 Cake & Tartlet (Traditional Joy):</strong> Menyediakan variasi rasa buah segar populer seperti strawberry tartlet dan red velvet dome. Menyasar kelompok usia muda yang menyukai rasa manis tradisional dengan estetika visual tinggi.
                  </li>
                  <li>
                    <strong>🍫 Mousse & Pudding (Luxurious Creamy):</strong> Menyasar kelompok konsumen yang menyukai kelembutan krim tebal bertekstur premium seperti Belgian chocolate mousse dan matcha panna cotta.
                  </li>
                  <li>
                    <strong>🍪 Macaron & Choux (Crunchy Treat):</strong> Pilihan ringan untuk camilan santai teman minum teh/kopi sore hari seperti Parisian Macarons dan Craquelin Choux kopi Flores.
                  </li>
                  <li>
                    <strong>🥑 Healthy Sweet (Wellness Choice):</strong> Kategori eksklusif rendah kalori, gluten-free, ramah keto menggunakan alpukat organik dan pemanis stevia bagi penderita diabetes dan pelaku kebugaran.
                  </li>
                </ul>

                <p className="bg-amber-50 p-3 rounded-lg border border-amber-200/50 text-amber-800">
                  <strong>💡 Strategi Visual:</strong> Kami menggunakan foto produk bersudut pandang makro (close-up) beresolusi tinggi dengan pencahayaan natural lembut untuk memicu nafsu makan (food porn marketing).
                </p>
              </div>
            </div>

            {/* Pricing, Promo and Payment Gateway */}
            <div className="md:col-span-5 bg-white rounded-2xl p-6 border border-pink-100 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Tag className="w-5.5 h-5.5 text-pink-600" />
                Strategi Harga & Promo
              </h3>

              <div className="space-y-3.5 text-xs text-gray-600">
                <div className="bg-pink-50/40 p-3 rounded-xl border border-pink-100/50">
                  <p className="font-bold text-pink-700">Penetapan Harga (Psychological Pricing)</p>
                  <p className="mt-0.5">
                    Harga berkisar antara <strong>Rp 17.500 - Rp 29.000</strong> per pcs. Ini merupakan strategi harga psikologis, menempatkan produk sebagai kemewahan terjangkau (affordable luxury) yang terasa lebih murah dibanding membeli whole-cake seharga Rp 300.000+.
                  </p>
                </div>

                <div className="bg-pink-50/40 p-3 rounded-xl border border-pink-100/50">
                  <p className="font-bold text-pink-700">Strategi Diskon & Promosi Aktif</p>
                  <p className="mt-0.5">
                    Kami menawarkan kode promo musiman harian di e-commerce kami seperti kupon <strong>PROMO10</strong> (Diskon persentase untuk konversi cepat) dan <strong>MANIS5K</strong> (Diskon tetap meningkatkan nominal belanja minimal).
                  </p>
                </div>

                <div className="bg-pink-50/40 p-3 rounded-xl border border-pink-100/50">
                  <p className="font-bold text-pink-700">Simulasi Alur Pembayaran (Payment Gateway)</p>
                  <p className="mt-0.5">
                    Untuk menjamin kenyamanan konsumen berbelanja online, platform ini mengintegrasikan simulasi payment gateway <strong>Midtrans Sandbox</strong> yang memproses pembayaran QRIS (Gopay/OVO) dan Virtual Account bank secara real-time demi keamanan transaksi.
                  </p>
                </div>
              </div>
            </div>

          </motion.div>
        )}

        {/* SECTION 4: SEO, KEAMANAN & ANALITIS */}
        {activeSection === 'tech' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            {/* SEO & Maintenance Plan */}
            <div className="md:col-span-6 bg-white rounded-2xl p-6 border border-pink-100 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Search className="w-5.5 h-5.5 text-pink-600" />
                Rencana SEO & Pemeliharaan Web
              </h3>

              <div className="space-y-3.5 text-xs text-gray-600">
                <div className="space-y-1">
                  <p className="font-bold text-gray-800">1. Strategi SEO (Search Engine Optimization):</p>
                  <p className="text-gray-500">
                    - Penggunaan tag meta semantic HTML5 lengkap (H1, H2, descriptive alt images).<br />
                    - Menargetkan kata kunci lokal ekor panjang (long-tail local keywords) dengan volume pencarian terfokus: <em>"dessert mini premium terdekat"</em>, <em>"mini cake gluten free jakarta"</em>, <em>"hampers dessert wisuda murah"</em>.<br />
                    - Membangun halaman blog resep ramah kesehatan secara konsisten untuk meningkatkan skor backlink domain authority.
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="font-bold text-gray-800">2. Rencana Pemeliharaan (Maintenance Plan):</p>
                  <p className="text-gray-500">
                    - Backup basis data katalog produk dan riwayat transaksi secara periodik mingguan ke cloud server steril.<br />
                    - Audit kerentanan berkala pustaka JavaScript (npm audit) mencegah injeksi kode berbahaya XSS.<br />
                    - Optimalisasi kompresi cache aset gambar secara berkala menggunakan format generasi terbaru (.webp) untuk menjamin waktu muat halaman (page load speed) di bawah 1.5 detik.
                  </p>
                </div>
              </div>
            </div>

            {/* Security and Web Analytics Plan */}
            <div className="md:col-span-6 bg-white rounded-2xl p-6 border border-pink-100 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-5.5 h-5.5 text-pink-600" />
                Keamanan & Pemanfaatan Web Analytics
              </h3>

              <div className="space-y-3.5 text-xs text-gray-600">
                <div className="space-y-1">
                  <p className="font-bold text-gray-800">1. Sistem Keamanan Transaksi:</p>
                  <p className="text-gray-500">
                    - Seluruh koneksi browser dilindungi SSL/TLS SHA-256.<br />
                    - Menggunakan tokenisasi server-side untuk pemrosesan kartu kredit melalui API payment gateway sehingga kredensial sensitif pembeli tidak pernah menyentuh database internal kami.<br />
                    - Sistem verifikasi ganda (OTP / 3D Secure) di sisi perbankan simulator.
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="font-bold text-gray-800">2. Rencana Pengambilan Keputusan Berbasis Analitis (Google Analytics):</p>
                  <p className="text-gray-500">
                    Kami menanamkan script dummy Google Analytics (GA4) untuk memantau metrik perilaku pelanggan utama demi pengambilan keputusan strategis:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-gray-500">
                    <li><strong className="text-gray-700">Rasio Pantulan (Bounce Rate):</strong> Jika tinggi pada halaman katalog, kami akan merevisi visual/warna tombol atau mempercepat pemuatan aset gambar.</li>
                    <li><strong className="text-gray-700">Rasio Konversi (Conversion Rate):</strong> Mengukur persentase pengunjung yang berhasil check-out dari keranjang. Jika rasio turun, kami mengevaluasi apakah biaya kurir terlalu mahal.</li>
                    <li><strong className="text-gray-700">Rata-rata Nilai Pesanan (AOV):</strong> Digunakan untuk merancang promo diskon minimal belanja demi mendorong pembelian bundel isi banyak (hampers box).</li>
                  </ul>
                </div>
              </div>
            </div>

          </motion.div>
        )}

      </div>

      {/* Elegant compact brand message */}
      <div className="mt-12 bg-pink-50/50 p-6 rounded-2xl border border-pink-100 text-center space-y-2">
        <p className="text-xs font-bold text-pink-700 uppercase tracking-widest">
          MINI BITES • Premium Dessert E-Commerce
        </p>
        <p className="text-xs text-gray-500 max-w-xl mx-auto">
          Membangun pengalaman kuliner dessert mini kelas dunia dengan porsi personal yang ramah kesehatan dan terintegrasi sistem instan.
        </p>
      </div>

    </div>
  );
}
