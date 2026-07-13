import React, { useState, useEffect } from 'react';
import { BarChart3, LineChart, TrendingUp, Users, ShoppingCart, MousePointerClick, RefreshCw, Zap, Code } from 'lucide-react';
import { motion } from 'motion/react';

export default function AnalyticsView() {
  // Analytical simulated state values
  const [visitors, setVisitors] = useState(2450);
  const [conversions, setConversions] = useState(132);
  const [bounceRate, setBounceRate] = useState(42.5);
  const [avgSession, setAvgSession] = useState(185); // in seconds
  const [isCampaignActive, setIsCampaignActive] = useState(false);
  const [trafficSurgeMsg, setTrafficSurgeMsg] = useState('');

  // Daily visitors chart mock array
  const [dailyData, setDailyData] = useState([
    { day: 'Sen', views: 240, conv: 12 },
    { day: 'Sel', views: 310, conv: 15 },
    { day: 'Rab', views: 280, conv: 11 },
    { day: 'Kam', views: 420, conv: 23 },
    { day: 'Jum', views: 390, conv: 19 },
    { day: 'Sab', views: 510, conv: 30 },
    { day: 'Min', views: 490, conv: 22 },
  ]);

  // Handle traffic campaign simulation
  const handleSimulateCampaign = () => {
    if (isCampaignActive) return;
    
    setIsCampaignActive(true);
    setTrafficSurgeMsg('🚀 Kampanye Instagram Ads sedang berjalan! Menghasilkan lonjakan klik...');
    
    // Animate surge upwards
    setTimeout(() => {
      setVisitors(prev => prev + 1240);
      setConversions(prev => prev + 89);
      setBounceRate(prev => Math.max(25, +(prev - 12.3).toFixed(1)));
      setAvgSession(prev => prev + 45);
      
      setDailyData(prev => prev.map(d => {
        if (d.day === 'Min' || d.day === 'Sab') {
          return { ...d, views: d.views + 250, conv: d.conv + 18 };
        }
        return d;
      }));

      setTrafficSurgeMsg('✓ Kampanye Sukses! Trafik meningkat +50.6% & Bounce Rate turun menjadi 30.2%.');
    }, 1500);
  };

  const handleResetAnalytics = () => {
    setIsCampaignActive(false);
    setVisitors(2450);
    setConversions(132);
    setBounceRate(42.5);
    setAvgSession(185);
    setTrafficSurgeMsg('');
    setDailyData([
      { day: 'Sen', views: 240, conv: 12 },
      { day: 'Sel', views: 310, conv: 15 },
      { day: 'Rab', views: 280, conv: 11 },
      { day: 'Kam', views: 420, conv: 23 },
      { day: 'Jum', views: 390, conv: 19 },
      { day: 'Sab', views: 510, conv: 30 },
      { day: 'Min', views: 490, conv: 22 },
    ]);
  };

  const conversionRate = ((conversions / visitors) * 100).toFixed(2);
  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}m ${secs}s`;
  };

  // Google Analytics Script tag snippet representation
  const dummyGAScript = `<!-- Google tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-DUMMY99999"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  // Inisialisasi properti ID MINI BITES dessert
  gtag('config', 'G-DUMMY99999', {
    'cookie_prefix': 'minibites_shop',
    'anonymize_ip': true,
    'custom_map': {'dimension1': 'dessert_category'}
  });
</script>`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-sans font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-pink-600" />
            Dashboard Simulasi Web Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1">Simulasi real-time pemantauan metrik kinerja Google Analytics (GA4) untuk toko Dessert Mini.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-simulate-campaign"
            onClick={handleSimulateCampaign}
            disabled={isCampaignActive}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
              isCampaignActive 
                ? 'bg-amber-100 text-amber-700 opacity-80 cursor-not-allowed'
                : 'bg-pink-600 hover:bg-pink-700 text-white'
            }`}
          >
            <Zap className="w-4 h-4 animate-bounce" />
            {isCampaignActive ? 'Ad Campaign Berjalan' : 'Jalankan Iklan Medsos'}
          </button>

          <button
            id="btn-reset-analytics"
            onClick={handleResetAnalytics}
            className="p-2.5 bg-white hover:bg-pink-50 text-gray-600 hover:text-pink-600 border border-gray-200 rounded-xl cursor-pointer transition-colors"
            title="Reset Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Traffic Surge message banner */}
      {trafficSurgeMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl text-xs font-semibold ${
            trafficSurgeMsg.startsWith('✓') ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-amber-50 text-amber-800 border border-amber-100 animate-pulse'
          }`}
        >
          {trafficSurgeMsg}
        </motion.div>
      )}

      {/* Metrik Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metrik 1: Visitors */}
        <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-xs space-y-1.5">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xxs font-bold uppercase tracking-wider">Total Pengunjung</span>
            <Users className="w-4.5 h-4.5 text-pink-500" />
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{visitors.toLocaleString('id-ID')}</p>
          <span className="text-[10px] text-emerald-600 font-bold">
            {isCampaignActive ? '↑ +50.6% minggu ini' : '↑ +12.4% minggu ini'}
          </span>
        </div>

        {/* Metrik 2: Conversions */}
        <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-xs space-y-1.5">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xxs font-bold uppercase tracking-wider">Transaksi Sukses</span>
            <ShoppingCart className="w-4.5 h-4.5 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{conversions}</p>
          <span className="text-[10px] text-emerald-600 font-bold">
            {isCampaignActive ? '↑ +67.4% konversi' : '↑ +4.2% stabil'}
          </span>
        </div>

        {/* Metrik 3: Conversion Rate */}
        <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-xs space-y-1.5">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xxs font-bold uppercase tracking-wider">Tingkat Konversi</span>
            <TrendingUp className="w-4.5 h-4.5 text-teal-500" />
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{conversionRate}%</p>
          <span className="text-[10px] text-teal-600 font-medium">Rata-rata industri F&B: 3.5%</span>
        </div>

        {/* Metrik 4: Bounce Rate */}
        <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-xs space-y-1.5">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xxs font-bold uppercase tracking-wider">Bounce Rate</span>
            <MousePointerClick className="w-4.5 h-4.5 text-purple-500" />
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{bounceRate}%</p>
          <span className="text-[10px] text-teal-600 font-bold">
            {isCampaignActive ? '↓ Lebih Rendah (Lebih Bagus)' : '✓ Stabil'}
          </span>
        </div>

      </div>

      {/* Visual Chart Section (Pure SVG for high-fidelity native React rendering) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Visitors Chart Column */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-pink-100 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
            <LineChart className="w-4.5 h-4.5 text-pink-600" /> Kunjungan Halaman Mingguan (Pageviews)
          </h3>

          {/* Simple custom responsive SVG bar chart */}
          <div className="relative pt-4">
            <div className="flex justify-between items-end h-64 border-b border-gray-100 pb-2">
              {dailyData.map((data, idx) => {
                const maxViews = Math.max(...dailyData.map(d => d.views));
                const heightPercent = (data.views / maxViews) * 100;
                return (
                  <div key={idx} className="flex flex-col items-center flex-1 group">
                    {/* Tooltip value */}
                    <span className="opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm absolute -translate-y-8 transition-opacity">
                      {data.views} views
                    </span>

                    {/* Bar strip */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.05 }}
                      className="w-8 sm:w-12 rounded-t-lg bg-linear-to-t from-pink-500 to-pink-400 group-hover:from-pink-600 group-hover:to-pink-500 transition-colors shadow-xs"
                    />

                    {/* X Axis Label */}
                    <span className="text-[10px] text-gray-500 font-bold mt-2">{data.day}</span>
                  </div>
                );
              })}
            </div>
            
            {/* Legend info */}
            <div className="flex gap-4 items-center justify-center pt-3 text-xxs text-gray-400">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-pink-500 rounded-xs" /> Pageviews (Kunjungan)
              </span>
              <span>Rata-rata Durasi Sesi: <strong>{formatSeconds(avgSession)}</strong></span>
            </div>
          </div>
        </div>

        {/* Conversion Tracker & Analytics Explanation Column */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-pink-100 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Mengapa Metrik Ini Penting?</h3>
            
            <div className="space-y-3.5 text-xxs text-gray-500">
              <div className="bg-pink-50/40 p-3 rounded-xl border border-pink-100/50">
                <p className="font-bold text-gray-800">1. Tingkat Pantulan (Bounce Rate):</p>
                <p className="mt-0.5">Persentase pengunjung satu halaman yang langsung pergi. Nilai aman toko kami ({bounceRate}%) menunjukkan desain website informatif, responsif, dan gambar dessert memicu interaksi lanjut.</p>
              </div>

              <div className="bg-pink-50/40 p-3 rounded-xl border border-pink-100/50">
                <p className="font-bold text-gray-800">2. Rasio Konversi (Conversion Rate):</p>
                <p className="mt-0.5">Rasio transaksi lunas terhadap total pengunjung. Toko kami mencapai {conversionRate}%, membuktikan kemudahan checkout dan ketertarikan tinggi pada promo kami.</p>
              </div>

              <div className="bg-pink-50/40 p-3 rounded-xl border border-pink-100/50">
                <p className="font-bold text-gray-800">3. Rata-rata Durasi Sesi:</p>
                <p className="mt-0.5">Semakin lama konsumen menjelajahi katalog produk kita (saat ini {formatSeconds(avgSession)}), semakin tinggi potensi retensi dan pengenalan nilai brand.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Embedded Google Analytics Code Block (Solves mandatory academic requirement) */}
      <div className="bg-gray-950 rounded-2xl p-6 text-white space-y-4 shadow-lg border border-gray-800">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-pink-400" />
            <div>
              <h3 className="text-sm font-bold font-mono">Pemasangan Script Google Analytics (Dummy)</h3>
              <p className="text-[10px] text-gray-400">Dimasukkan di dalam file <code>&lt;head&gt;</code> di <code>index.html</code></p>
            </div>
          </div>
          <span className="text-[9px] font-bold font-mono bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-sm uppercase">Active Integration</span>
        </div>

        <pre className="text-[10px] font-mono bg-gray-900/50 p-4 rounded-xl overflow-x-auto text-gray-300 leading-relaxed border border-gray-900">
          {dummyGAScript}
        </pre>

        <div className="text-xxs text-gray-400 leading-relaxed bg-gray-900 p-3.5 rounded-xl border border-gray-800">
          <strong>💡 Catatan Akademis:</strong> Kode pelacakan di atas menggunakan <code>G-DUMMY99999</code> sebagai ID properti Google Analytics 4 (GA4). Pada produksi riil, ID ini diganti dengan tag pengukuran resmi dari dashboard Google Analytics. Script ini mengaktifkan tracking kunjungan otomatis (page_view) dan pengiriman event custom F&B e-commerce seperti: <code>add_to_cart</code>, <code>begin_checkout</code>, dan <code>purchase</code> secara terenkripsi.
        </div>
      </div>

    </div>
  );
}
