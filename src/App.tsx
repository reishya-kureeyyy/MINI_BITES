import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, X, RefreshCw, Trash2, ArrowRight, Star, Heart, CheckCircle, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Import Types, Data, and Components
import { Product, CartItem } from './types';
import { PRODUCTS } from './data/products';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CheckoutView from './components/CheckoutView';
import BusinessOverview from './components/BusinessOverview';
import AnalyticsView from './components/AnalyticsView';
import AdminDashboard from './components/AdminDashboard';

const DUMMY_ORDERS = [
  {
    id: 'MS-582910',
    fullName: 'Budi Santoso',
    email: 'budi.santoso@gmail.com',
    phone: '081234567890',
    address: 'Jl. Kemang Raya No. 4, Jakarta Selatan, DKI Jakarta',
    deliveryService: 'instant',
    paymentMethod: 'qris',
    promoCode: 'PROMO10',
    notes: 'Kirim setelah jam makan siang',
    items: [
      { productId: '1', productName: 'Strawberry Velvet Tartlet', price: 21500, quantity: 2 },
      { productId: '3', productName: 'Belgian Triple Chocolate Mousse', price: 24500, quantity: 1 }
    ],
    subtotal: 67500,
    deliveryCost: 20000,
    discount: 6750,
    total: 80750,
    date: '2026-07-11T14:32:00.000Z',
    monthYear: 'Juli 2026'
  },
  {
    id: 'MS-124958',
    fullName: 'Siti Aminah',
    email: 'siti.aminah@yahoo.com',
    phone: '081398765432',
    address: 'Apartemen Kebagusan City Tower A/12, Jakarta Selatan',
    deliveryService: 'sameday',
    paymentMethod: 'va_bca',
    notes: 'Kadar gula dikurangi ya',
    items: [
      { productId: '7', productName: 'Keto Avocado Choco Mousse', price: 28000, quantity: 3 }
    ],
    subtotal: 84000,
    deliveryCost: 15000,
    discount: 0,
    total: 99000,
    date: '2026-06-24T10:15:00.000Z',
    monthYear: 'Juni 2026'
  },
  {
    id: 'MS-938102',
    fullName: 'Andi Wijaya',
    email: 'andi.wijaya@outlook.com',
    phone: '085711223344',
    address: 'Perumahan Harapan Indah Blok C/15, Bekasi, Jawa Barat',
    deliveryService: 'regular',
    paymentMethod: 'va_mandiri',
    promoCode: 'MANIS5K',
    items: [
      { productId: '5', productName: 'Parisian Macarons Trio', price: 18500, quantity: 4 },
      { productId: '8', productName: 'Gluten-Free Lemon Berry Tartlet', price: 29000, quantity: 2 }
    ],
    subtotal: 132000,
    deliveryCost: 9000,
    discount: 5000,
    total: 136000,
    date: '2026-07-02T16:45:00.000Z',
    monthYear: 'Juli 2026'
  }
];

export default function App() {
  // Tab Routing ('katalog', 'keranjang', 'checkout', 'admin')
  const [activeTab, setActiveTab] = useState<string>('katalog');

  // Admin Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminSubTab, setAdminSubTab] = useState<string>('laporan');

  // Products State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('minisweet_products_v2');
      return saved ? JSON.parse(saved) : PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  // Orders State
  const [orders, setOrders] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('minisweet_orders_v2');
      return saved ? JSON.parse(saved) : DUMMY_ORDERS;
    } catch {
      return DUMMY_ORDERS;
    }
  });

  // Persist states to local storage
  useEffect(() => {
    localStorage.setItem('minisweet_products_v2', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('minisweet_orders_v2', JSON.stringify(orders));
  }, [orders]);

  // Shopping Cart state loaded from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('minisweet_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [sortBy, setSortBy] = useState<string>('default'); // 'default', 'price-low', 'price-high', 'rating'

  // Selected Product for Detail Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Status notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save cart changes to localStorage
  useEffect(() => {
    localStorage.setItem('minisweet_cart', JSON.stringify(cart));
  }, [cart]);

  // Show status toasts
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        triggerToast(`✓ Jumlah ${product.name} diubah menjadi ${existing.quantity + quantity}`);
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      triggerToast(`✓ ${product.name} berhasil ditambahkan ke keranjang!`);
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    const item = cart.find(i => i.product.id === productId);
    if (item) {
      triggerToast(`🗑️ ${item.product.name} dihapus dari keranjang.`);
    }
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
    triggerToast('🗑️ Keranjang belanja telah dikosongkan.');
  };

  // Calculation values
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // Formatting Currency
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  // Filtering products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // default order
  });

  const categories = ['Semua', 'Cake & Tartlet', 'Mousse & Pudding', 'Macaron & Choux', 'Healthy Sweet'];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-gray-800 font-sans">
      
      {/* Dynamic Toast Alerts */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -40, x: '-50%' }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-gray-900 text-white rounded-full text-xs font-semibold shadow-2xl flex items-center gap-2 border border-gray-800"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} cartCount={cartCount} />

      {/* Primary Content Router */}
      <main className="flex-1">
        
        {/* TAB 1: CATALOG DESK */}
        {activeTab === 'katalog' && (
          <div className="space-y-0">
            {/* Hero banner section */}
            <Hero 
              onExploreClick={() => {
                const el = document.getElementById('catalog-explore-head');
                el?.scrollIntoView({ behavior: 'smooth' });
              }} 
            />

            {/* Catalog list section */}
            <div id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5">
              
              {/* Category selector & search filters */}
              <div id="catalog-explore-head" className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-pink-100/60 pb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold font-sans tracking-tight text-gray-900">Katalog Dessert Mini</h2>
                  <p className="text-[11px] text-gray-500 mt-0.5">Pilih rasa favorit Anda dari menu dessert mini segar hari ini.</p>
                </div>

                {/* Search & Sort Panel */}
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  
                  {/* Search box input */}
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      id="search-input"
                      placeholder="Cari rasa atau kue..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-pink-100/80 bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3.5 top-3 p-0.5 hover:bg-gray-100 rounded-full text-gray-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Sort Selection dropdown */}
                  <div className="relative">
                    <select
                      id="sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-pink-100/80 bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-pink-400 cursor-pointer"
                    >
                      <option value="default">Urutkan: Rekomendasi</option>
                      <option value="price-low">Harga: Terendah ke Tinggi</option>
                      <option value="price-high">Harga: Tertinggi ke Rendah</option>
                      <option value="rating">Rating: Terbaik</option>
                    </select>
                  </div>

                </div>
              </div>

              {/* Category tabs pills */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    id={`cat-pill-${cat.replace(/\s+/g, '-')}`}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                      selectedCategory === cat
                        ? 'bg-pink-600 text-white shadow-sm'
                        : 'bg-white text-gray-600 border border-pink-100/50 hover:bg-pink-50'
                    }`}
                  >
                    {cat === 'Semua' ? '🍰 Semua Menu' : cat}
                  </button>
                ))}
              </div>

              {/* Products Grid display */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={(p) => handleAddToCart(p)}
                      onViewDetails={(p) => setSelectedProduct(p)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-3xl border border-pink-100/50">
                  <p className="text-gray-400 text-sm font-semibold">Tidak ada produk yang cocok dengan pencarian Anda.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Semua');
                    }}
                    className="mt-4 px-4.5 py-2 bg-pink-100 hover:bg-pink-600 hover:text-white text-pink-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Reset Filter Pencarian
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* TAB 2: SHOPPING CART SCREEN */}
        {activeTab === 'keranjang' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            
            <div className="mb-8 text-center md:text-left">
              <h1 className="text-3xl font-sans font-bold text-gray-900 tracking-tight">Keranjang Belanja Anda</h1>
              <p className="text-sm text-gray-500 mt-1">Kelola kuantitas dan lakukan pengecekan sebelum beralih ke formulir pengiriman.</p>
            </div>

            {cart.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* List items block */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-pink-100 shadow-xs divide-y divide-pink-50/50">
                  {cart.map((item) => (
                    <div key={item.product.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
                      
                      {/* Product details info card */}
                      <div className="flex items-center gap-3.5 w-full sm:w-auto">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-xl border border-pink-100"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full uppercase">
                            {item.product.category}
                          </span>
                          <h4 className="text-sm font-bold text-gray-800 mt-0.5">{item.product.name}</h4>
                          <p className="text-xxs text-gray-400 mt-0.5">📏 {item.product.size} • 🔥 {item.product.calories} kkal</p>
                          <p className="text-xs font-bold text-pink-600 mt-1">{formatIDR(item.product.price)}</p>
                        </div>
                      </div>

                      {/* Controls and quantity triggers */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-pink-50">
                        
                        {/* Qty edit count box */}
                        <div className="flex items-center border border-pink-100 rounded-xl bg-white overflow-hidden">
                          <button
                            id={`cart-dec-${item.product.id}`}
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="px-3 py-1.5 hover:bg-pink-50 text-gray-600 transition-colors font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-3 text-xs font-bold text-gray-800">{item.quantity}</span>
                          <button
                            id={`cart-inc-${item.product.id}`}
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="px-3 py-1.5 hover:bg-pink-50 text-gray-600 transition-colors font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Total sub */}
                        <div className="text-right">
                          <p className="text-xxs text-gray-400">Subtotal</p>
                          <p className="text-sm font-extrabold text-gray-800">{formatIDR(item.product.price * item.quantity)}</p>
                        </div>

                        {/* Trash icon delete */}
                        <button
                          id={`cart-remove-${item.product.id}`}
                          onClick={() => handleRemoveFromCart(item.product.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>

                    </div>
                  ))}

                  {/* Clear and catalog links */}
                  <div className="p-4 flex justify-between items-center text-xs bg-pink-50/20">
                    <button
                      id="cart-clear-all"
                      onClick={handleClearCart}
                      className="text-gray-500 hover:text-red-600 flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      🗑️ Kosongkan Keranjang
                    </button>
                    <button
                      onClick={() => setActiveTab('katalog')}
                      className="text-pink-600 hover:text-pink-700 font-bold cursor-pointer"
                    >
                      🍰 Tambah Menu Lain
                    </button>
                  </div>
                </div>

                {/* Total Summary and Order Action */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-pink-100 p-6 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-gray-900 border-b border-pink-50 pb-2">Informasi Belanja</h3>
                  
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between text-gray-500">
                      <span>Total Jumlah</span>
                      <span className="font-semibold text-gray-800">{cartCount} Pcs</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal Harga</span>
                      <span className="font-extrabold text-gray-800">{formatIDR(cartSubtotal)}</span>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-2 bg-pink-50/40 p-2.5 rounded-lg border border-pink-100/50">
                      ℹ️ Ongkos kirim logistik dingin (cold logistic ojek online) dan diskon kupon akan dihitung di halaman berikutnya.
                    </div>
                  </div>

                  <button
                    id="cart-checkout-proceed-btn"
                    onClick={() => setActiveTab('checkout')}
                    className="w-full py-3 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-bold rounded-xl shadow-md hover:shadow-pink-500/15 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    Lanjutkan ke Checkout
                    <ArrowRight className="w-4.5 h-4.5" />
                  </button>
                </div>

              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-pink-100/50">
                <p className="text-gray-400 text-sm font-semibold">Keranjang belanja Anda masih kosong.</p>
                <button
                  onClick={() => setActiveTab('katalog')}
                  className="mt-4 px-4.5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Belanja Dessert Sekarang
                </button>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: CHECKOUT GATEWAY */}
        {activeTab === 'checkout' && (
          <CheckoutView 
            cartItems={cart} 
            clearCart={handleClearCart} 
            setActiveTab={setActiveTab} 
            onOrderSuccess={(newOrder) => {
              setOrders(prev => [newOrder, ...prev]);
            }}
          />
        )}

        {/* TAB 4: UNIFIED ADMIN PANEL */}
        {activeTab === 'admin' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {!isAdminLoggedIn ? (
              /* Admin Login Screen */
              <div className="max-w-md mx-auto bg-white rounded-3xl border border-pink-100 p-8 shadow-lg space-y-6">
                <div className="text-center space-y-2">
                  <span className="text-3xl">🔑</span>
                  <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
                  <p className="text-xs text-gray-500">Silakan masuk menggunakan kredensial admin Anda.</p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (adminUsername === 'admin' && adminPassword === 'admin') {
                      setIsAdminLoggedIn(true);
                      setAdminError('');
                    } else {
                      setAdminError('Username atau password salah!');
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Username</label>
                    <input
                      type="text"
                      placeholder="Masukkan username..."
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-pink-100/80 bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Password</label>
                    <input
                      type="password"
                      placeholder="Masukkan password..."
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-pink-100/80 bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  {adminError && (
                    <p className="text-xs text-red-600 font-semibold bg-red-50 p-2.5 rounded-lg border border-red-100">{adminError}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-bold rounded-xl shadow-md hover:-translate-y-0.5 transition-all cursor-pointer text-xs uppercase tracking-wider"
                  >
                    Masuk ke Admin Panel
                  </button>
                </form>

                <div className="text-center">
                  <p className="text-[10px] text-gray-400">Petunjuk Akses: Gunakan username <strong>admin</strong> & password <strong>admin</strong></p>
                </div>
              </div>
            ) : (
              /* Logged In Admin Panel View */
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-pink-100 pb-5">
                  <div>
                    <h2 className="text-2xl font-black text-gray-950 flex items-center gap-1.5">
                      <span>⚙️</span> Panel Administrasi MINI BITES
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">Kelola pesanan, daftar pelanggan, laporan bulanan, dan katalog menu produk.</p>
                  </div>

                  <button
                    onClick={() => {
                      setIsAdminLoggedIn(false);
                      setAdminUsername('');
                      setAdminPassword('');
                    }}
                    className="px-4 py-2 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 text-xs font-bold rounded-xl transition-all cursor-pointer border border-transparent hover:border-red-100"
                  >
                    Keluar Admin (Logout)
                  </button>
                </div>

                <div className="bg-white rounded-3xl border border-pink-50/80 shadow-xs overflow-hidden">
                  <AdminDashboard 
                    products={products} 
                    setProducts={setProducts} 
                    orders={orders} 
                    setOrders={setOrders} 
                  />
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Product Detail Modal Overlay popup */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Consistent Modern Footer */}
      <footer className="bg-white border-t border-pink-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Column 1: Brand details */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧁</span>
                <span className="text-lg font-sans font-extrabold bg-gradient-to-r from-pink-600 to-amber-500 bg-clip-text text-transparent">
                  MINI BITES
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Toko online dessert mini premium berkualitas dengan porsi personal sehat dan higienis.
              </p>
              
              <div className="flex items-center gap-2 text-xxs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full w-fit font-bold border border-emerald-100">
                <CheckCircle className="w-3.5 h-3.5" /> 100% Secure Sandbox
              </div>
            </div>

            {/* Column 2: Quick navigation */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-gray-800 uppercase tracking-wider">Navigasi Halaman</h4>
              <ul className="space-y-2 text-gray-500 font-medium">
                <li><button onClick={() => { setActiveTab('katalog'); window.scrollTo(0,0); }} className="hover:text-pink-600 cursor-pointer text-left">🍰 Menu Dessert</button></li>
                <li><button onClick={() => { setActiveTab('keranjang'); window.scrollTo(0,0); }} className="hover:text-pink-600 cursor-pointer text-left">🛒 Keranjang Belanja</button></li>
                <li><button onClick={() => { setActiveTab('checkout'); window.scrollTo(0,0); }} className="hover:text-pink-600 cursor-pointer text-left">💳 Proses Checkout</button></li>
                <li><button onClick={() => { setActiveTab('admin'); window.scrollTo(0,0); }} className="hover:text-pink-600 cursor-pointer text-left">🔒 Panel Admin</button></li>
              </ul>
            </div>

            {/* Column 3: Contact & Address */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-gray-800 uppercase tracking-wider">Hubungi Kami</h4>
              <p className="text-gray-500">Dapur Pusat: Jl. Jenderal Sudirman No. 10, Jakarta Selatan, DKI Jakarta 12190</p>
              <div className="space-y-1.5 text-gray-500">
                <p>👤 Pemilik: <strong>Reishya</strong></p>
                <p>📞 WhatsApp: <a href="https://wa.me/6281310843010" target="_blank" rel="noreferrer" className="text-pink-600 hover:underline font-bold">+62 813-1084-3010</a></p>
                <p>📸 Instagram: <a href="https://instagram.com/rshyaa_d" target="_blank" rel="noreferrer" className="text-pink-600 hover:underline font-bold">@rshyaa_d</a></p>
                <p>⏰ Operasional: <strong>Setiap Hari (08:00 - 21:00 WIB)</strong></p>
              </div>
            </div>

          </div>

          
        </div>
      </footer>

    </div>
  );
}
