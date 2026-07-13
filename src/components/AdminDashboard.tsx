import React, { useState } from 'react';
import { 
  ShoppingBag, Users, TrendingUp, Calendar, Plus, Edit2, Trash2, 
  X, Check, AlertCircle, Package, MapPin, Mail, Phone, DollarSign 
} from 'lucide-react';
import { Product } from '../types';

interface AdminOrder {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  deliveryService: string;
  paymentMethod: string;
  promoCode?: string;
  notes?: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  deliveryCost: number;
  discount: number;
  total: number;
  date: string;
  monthYear: string;
}

interface AdminDashboardProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: any[];
  setOrders: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function AdminDashboard({ products, setProducts, orders, setOrders }: AdminDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'laporan' | 'pesanan' | 'pelanggan' | 'produk'>('laporan');
  
  // Order list states
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'ALL' | 'BELUM_DIVERIFIKASI' | 'TERVERIFIKASI'>('ALL');
  
  // Delete product custom confirmation state
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Product Form States
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form input fields
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<Product['category']>('Cake & Tartlet');
  const [prodPrice, setProdPrice] = useState('');
  const [prodSize, setProdSize] = useState('');
  const [prodCalories, setProdCalories] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodIngredients, setProdIngredients] = useState('');
  const [prodIsPopular, setProdIsPopular] = useState(false);
  const [formError, setFormError] = useState('');

  // Currency Formatter
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  // Aggregated analytics data
  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  // Extract unique customers
  const uniqueCustomers = React.useMemo(() => {
    const customerMap: Record<string, {
      fullName: string;
      email: string;
      phone: string;
      address: string;
      totalSpend: number;
      orderCount: number;
    }> = {};

    orders.forEach(order => {
      // Normalize by email or phone to group
      const key = order.email.toLowerCase().trim() || order.phone.trim();
      if (!customerMap[key]) {
        customerMap[key] = {
          fullName: order.fullName,
          email: order.email,
          phone: order.phone,
          address: order.address,
          totalSpend: 0,
          orderCount: 0
        };
      }
      customerMap[key].totalSpend += order.total;
      customerMap[key].orderCount += 1;
    });

    return Object.values(customerMap);
  }, [orders]);

  // Monthly Reports aggregation
  const monthlyReports = React.useMemo(() => {
    const reportsMap: Record<string, {
      monthYear: string;
      orderCount: number;
      revenue: number;
      itemsSold: number;
    }> = {};

    orders.forEach(order => {
      const key = order.monthYear;
      if (!reportsMap[key]) {
        reportsMap[key] = {
          monthYear: key,
          orderCount: 0,
          revenue: 0,
          itemsSold: 0
        };
      }
      reportsMap[key].orderCount += 1;
      reportsMap[key].revenue += order.total;
      
      const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
      reportsMap[key].itemsSold += totalItems;
    });

    return Object.values(reportsMap).sort((a, b) => {
      // Simple sort by month date approximation if needed, or keep order
      return b.monthYear.localeCompare(a.monthYear);
    });
  }, [orders]);

  // Filter and search orders dynamically
  const filteredOrders = React.useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.email.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.phone.includes(orderSearch);

      const status = order.paymentStatus || 'BELUM_DIVERIFIKASI';
      const matchesStatus = orderStatusFilter === 'ALL' || status === orderStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // Open Form to Add Product
  const handleOpenAddForm = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory('Cake & Tartlet');
    setProdPrice('');
    setProdSize('Diameter 6cm');
    setProdCalories('150');
    setProdDescription('');
    setProdImage('https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400');
    setProdIngredients('Cream, Tepung, Gula Organik, Butter Premium');
    setProdIsPopular(false);
    setFormError('');
    setShowProductForm(true);
  };

  // Open Form to Edit Product
  const handleOpenEditForm = (product: Product) => {
    setEditingProduct(product);
    setProdName(product.name);
    setProdCategory(product.category);
    setProdPrice(product.price.toString());
    setProdSize(product.size);
    setProdCalories(product.calories.toString());
    setProdDescription(product.description);
    setProdImage(product.image);
    setProdIngredients(product.ingredients.join(', '));
    setProdIsPopular(!!product.isPopular);
    setFormError('');
    setShowProductForm(true);
  };

  // Delete product action (trigger state for custom inline modal to avoid iframe limitations with native confirm)
  const handleDeleteProduct = (productId: string) => {
    setProductToDelete(productId);
  };

  const confirmDeleteProduct = () => {
    if (productToDelete) {
      setProducts(prev => prev.filter(p => p.id !== productToDelete));
      setProductToDelete(null);
    }
  };

  // Payment Verification Handlers
  const handleVerifyPayment = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, paymentStatus: 'TERVERIFIKASI' };
      }
      return o;
    }));
  };

  const handleCancelVerification = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, paymentStatus: 'BELUM_DIVERIFIKASI' };
      }
      return o;
    }));
  };

  // Submit product creation or modification
  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!prodName.trim() || !prodPrice.trim() || !prodDescription.trim() || !prodImage.trim()) {
      setFormError('Harap lengkapi semua field yang berbintang (*)');
      return;
    }

    const priceNum = parseFloat(prodPrice);
    const caloriesNum = parseInt(prodCalories) || 120;

    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError('Harga produk harus berupa angka positif yang valid');
      return;
    }

    const ingredientList = prodIngredients
      .split(',')
      .map(i => i.trim())
      .filter(i => i.length > 0);

    if (editingProduct) {
      // Modify existing
      setProducts(prev => 
        prev.map(p => 
          p.id === editingProduct.id 
            ? {
                ...p,
                name: prodName,
                category: prodCategory,
                price: priceNum,
                size: prodSize,
                calories: caloriesNum,
                description: prodDescription,
                image: prodImage,
                ingredients: ingredientList,
                isPopular: prodIsPopular
              }
            : p
        )
      );
    } else {
      // Add new
      const newProduct: Product = {
        id: `custom-${Date.now()}`,
        name: prodName,
        category: prodCategory,
        price: priceNum,
        size: prodSize,
        calories: caloriesNum,
        description: prodDescription,
        longDescription: `${prodDescription} Diproduksi segar setiap hari di dapur steril MINI BITES.`,
        image: prodImage,
        rating: 4.8,
        reviewsCount: 1,
        ingredients: ingredientList.length > 0 ? ingredientList : ['Bahan Premium Organik'],
        isPopular: prodIsPopular
      };
      setProducts(prev => [newProduct, ...prev]);
    }

    setShowProductForm(false);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      
      {/* Dynamic Sub-tab Switcher for Admin features */}
      <div className="flex flex-wrap gap-2 border-b border-pink-100 pb-4">
        <button
          onClick={() => setActiveSubTab('laporan')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'laporan'
              ? 'bg-pink-600 text-white shadow-xs'
              : 'bg-pink-50/50 text-gray-600 hover:bg-pink-50 hover:text-pink-600'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Ringkasan & Laporan Bulanan
        </button>
        <button
          onClick={() => setActiveSubTab('pesanan')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'pesanan'
              ? 'bg-pink-600 text-white shadow-xs'
              : 'bg-pink-50/50 text-gray-600 hover:bg-pink-50 hover:text-pink-600'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Daftar Pesanan ({orders.length})
        </button>
        <button
          onClick={() => setActiveSubTab('pelanggan')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'pelanggan'
              ? 'bg-pink-600 text-white shadow-xs'
              : 'bg-pink-50/50 text-gray-600 hover:bg-pink-50 hover:text-pink-600'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Daftar Customer ({uniqueCustomers.length})
        </button>
        <button
          onClick={() => setActiveSubTab('produk')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'produk'
              ? 'bg-pink-600 text-white shadow-xs'
              : 'bg-pink-50/50 text-gray-600 hover:bg-pink-50 hover:text-pink-600'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          Kelola Menu Produk ({products.length})
        </button>
      </div>

      {/* SUB-TAB 1: REPORTS AND STATS */}
      {activeSubTab === 'laporan' && (
        <div className="space-y-6">
          
          {/* Dashboard Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-5 rounded-2xl text-white shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider opacity-95">Total Pesanan</span>
                <ShoppingBag className="w-5 h-5 opacity-80" />
              </div>
              <p className="text-3xl font-black">{totalOrdersCount} <span className="text-xs font-normal">Transaksi</span></p>
              <p className="text-[10px] opacity-80">Terintegrasi otomatis via Payment Gateway Sandbox</p>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-5 rounded-2xl text-white shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider opacity-95">Total Pendapatan</span>
                <DollarSign className="w-5 h-5 opacity-80" />
              </div>
              <p className="text-2xl font-black">{formatIDR(totalRevenue)}</p>
              <p className="text-[10px] opacity-80">Berdasarkan total pesanan berstatus Lunas / Paid</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-5 rounded-2xl text-white shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider opacity-95">Total Customer</span>
                <Users className="w-5 h-5 opacity-80" />
              </div>
              <p className="text-3xl font-black">{uniqueCustomers.length} <span className="text-xs font-normal">Pelanggan</span></p>
              <p className="text-[10px] opacity-80">Pelanggan aktif yang melakukan checkout sukses</p>
            </div>
          </div>

          {/* Monthly Report List */}
          <div className="bg-white rounded-2xl border border-pink-100 p-5 space-y-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-pink-600" />
              <h3 className="text-sm font-bold text-gray-900">Laporan Bulanan Toko Dessert</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-pink-100 bg-pink-50/30 text-[10px] font-bold text-pink-700 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Bulan</th>
                    <th className="py-2.5 px-3 text-center">Jumlah Transaksi</th>
                    <th className="py-2.5 px-3 text-center">Produk Terjual</th>
                    <th className="py-2.5 px-3 text-right">Total Penjualan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-50/50 text-xs">
                  {monthlyReports.length > 0 ? (
                    monthlyReports.map((report, idx) => (
                      <tr key={idx} className="hover:bg-pink-50/20 text-gray-700">
                        <td className="py-3 px-3 font-semibold">{report.monthYear}</td>
                        <td className="py-3 px-3 text-center font-medium">{report.orderCount} Pesanan</td>
                        <td className="py-3 px-3 text-center text-gray-500">{report.itemsSold} pcs dessert</td>
                        <td className="py-3 px-3 text-right font-extrabold text-pink-600">{formatIDR(report.revenue)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-gray-400">Belum ada transaksi bulan ini.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Chronological Recent Orders */}
          <div className="bg-white rounded-2xl border border-pink-100 p-5 space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Pesanan Masuk Terbaru</h3>
            <div className="space-y-3">
              {orders.map((order, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-pink-50 bg-pink-50/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{order.id}</span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">PAID / LUNAS</span>
                      <span className="text-xxs text-gray-400">{new Date(order.date).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="font-medium text-gray-700">Pelanggan: <strong className="text-gray-950">{order.fullName}</strong> ({order.phone})</p>
                    <p className="text-xxs text-gray-400 line-clamp-1">📍 Alamat: {order.address}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {order.items.map((item, iIndex) => (
                        <span key={iIndex} className="text-[9px] bg-pink-100/50 text-pink-700 px-1.5 py-0.5 rounded-md">
                          {item.productName} (x{item.quantity})
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400">Total Pembayaran</p>
                    <p className="text-sm font-black text-pink-600">{formatIDR(order.total)}</p>
                    <p className="text-[9px] text-gray-400 uppercase tracking-wider">{order.paymentMethod}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 2: CUSTOMERS LEDGER */}
      {activeSubTab === 'pelanggan' && (
        <div className="bg-white rounded-2xl border border-pink-100 p-5 space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-900">Daftar Customer Terdaftar</h3>
            <p className="text-xxs text-gray-500">Berikut adalah data pelanggan yang pernah menyelesaikan pemesanan premium dessert.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-pink-100 bg-pink-50/30 text-[10px] font-bold text-pink-700 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Nama Pelanggan</th>
                  <th className="py-2.5 px-3">WhatsApp / Telepon</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Alamat Pengiriman</th>
                  <th className="py-2.5 px-3 text-center">Jumlah Transaksi</th>
                  <th className="py-2.5 px-3 text-right">Total Pengeluaran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50/50 text-xs">
                {uniqueCustomers.length > 0 ? (
                  uniqueCustomers.map((cust, idx) => (
                    <tr key={idx} className="hover:bg-pink-50/20 text-gray-700">
                      <td className="py-3 px-3 font-semibold text-gray-900">{cust.fullName}</td>
                      <td className="py-3 px-3">
                        <a 
                          href={`https://wa.me/${cust.phone.replace(/[^0-9]/g, '')}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-pink-600 hover:underline flex items-center gap-1 font-mono font-medium"
                        >
                          <Phone className="w-3 h-3" />
                          {cust.phone}
                        </a>
                      </td>
                      <td className="py-3 px-3 text-gray-500 flex items-center gap-1 mt-1.5 md:mt-0">
                        <Mail className="w-3 h-3 text-gray-400" />
                        {cust.email}
                      </td>
                      <td className="py-3 px-3 text-gray-500 max-w-xs truncate" title={cust.address}>
                        {cust.address}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-gray-600">{cust.orderCount}x</td>
                      <td className="py-3 px-3 text-right font-black text-emerald-600">{formatIDR(cust.totalSpend)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-gray-400">Belum ada pelanggan terdaftar.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB: KELOLA PESANAN */}
      {activeSubTab === 'pesanan' && (
        <div className="space-y-4">
          {/* Header & Filter panel */}
          <div className="bg-pink-50/30 p-4 rounded-2xl border border-pink-100 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Kelola & Verifikasi Pesanan</h3>
                <p className="text-[10px] text-gray-500">
                  Pantau semua pesanan masuk, verifikasi status transfer pembayaran, dan koordinasikan pengiriman dengan customer.
                </p>
              </div>
            </div>

            {/* Filters row */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Cari ID pesanan, nama customer, atau No. WA..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full px-3 py-2 pl-9 bg-white border border-pink-100 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                />
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
              </div>

              {/* Status filter tabs/pills */}
              <div className="flex gap-1 p-1 bg-white border border-pink-100 rounded-xl">
                <button
                  onClick={() => setOrderStatusFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                    orderStatusFilter === 'ALL'
                      ? 'bg-pink-600 text-white'
                      : 'text-gray-500 hover:text-pink-600'
                  }`}
                >
                  Semua ({orders.length})
                </button>
                <button
                  onClick={() => setOrderStatusFilter('BELUM_DIVERIFIKASI')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                    orderStatusFilter === 'BELUM_DIVERIFIKASI'
                      ? 'bg-amber-500 text-white'
                      : 'text-gray-500 hover:text-amber-500'
                  }`}
                >
                  Belum Diverifikasi ({orders.filter(o => (o.paymentStatus || 'BELUM_DIVERIFIKASI') === 'BELUM_DIVERIFIKASI').length})
                </button>
                <button
                  onClick={() => setOrderStatusFilter('TERVERIFIKASI')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                    orderStatusFilter === 'TERVERIFIKASI'
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-500 hover:text-emerald-600'
                  }`}
                >
                  Terverifikasi ({orders.filter(o => o.paymentStatus === 'TERVERIFIKASI').length})
                </button>
              </div>
            </div>
          </div>

          {/* Orders list container */}
          <div className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const isVerified = order.paymentStatus === 'TERVERIFIKASI';
                return (
                  <div
                    key={order.id}
                    className={`bg-white rounded-2xl border transition-all duration-200 p-5 space-y-4 ${
                      isVerified 
                        ? 'border-emerald-100 bg-emerald-50/5/30' 
                        : 'border-pink-100/60 hover:border-pink-200/80 shadow-xs'
                    }`}
                  >
                    {/* Header: ID, Date, status badge */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-gray-100 pb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-gray-950 text-xs sm:text-sm">
                            🧾 {order.id}
                          </span>
                          <span className="text-[9px] text-gray-400 font-medium">
                            {new Date(order.date).toLocaleString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 text-[10px]">
                          <span className="bg-pink-50 text-pink-700 px-2 py-0.5 rounded-md font-semibold border border-pink-100/30">
                            🚚 {order.deliveryService}
                          </span>
                          <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md font-semibold border border-amber-100/30 uppercase">
                            💳 {order.paymentMethod}
                          </span>
                          {order.promoCode && (
                            <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-semibold border border-purple-100/30">
                              🎟️ Promo: {order.promoCode}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Payment verification status indicator */}
                      <div>
                        {isVerified ? (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xxs font-black uppercase tracking-wider">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Lunas & Terverifikasi
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xxs font-black uppercase tracking-wider">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                            </span>
                            Menunggu Verifikasi
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Customer & Address Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-gray-50/50 p-3.5 rounded-xl border border-gray-100">
                      <div className="space-y-2">
                        <p className="font-bold text-gray-900 flex items-center gap-1 text-[11px]">
                          👤 Detail Penerima:
                        </p>
                        <div className="space-y-1 pl-1 text-gray-700 font-medium">
                          <p>Nama: <strong className="text-gray-950 font-black">{order.fullName}</strong></p>
                          <p className="flex items-center gap-1">
                            Telepon/WhatsApp:{' '}
                            <a 
                              href={`https://wa.me/${order.phone.replace(/[^0-9]/g, '')}`} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-pink-600 font-bold hover:underline font-mono"
                            >
                              📞 {order.phone}
                            </a>
                          </p>
                          <p>Email: <span className="text-gray-500">{order.email}</span></p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="font-bold text-gray-900 flex items-center gap-1 text-[11px]">
                          📍 Alamat Pengiriman:
                        </p>
                        <p className="text-gray-600 pl-1 leading-relaxed font-medium">
                          {order.address}
                        </p>
                        {order.notes && (
                          <p className="text-xxs text-amber-700 pl-1 italic font-medium">
                            📝 Catatan: "{order.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Items table summary */}
                    <div className="space-y-1.5">
                      <p className="font-bold text-gray-900 text-[10px] uppercase tracking-wider pl-1">
                        📦 Detail Belanja:
                      </p>
                      <div className="border border-pink-50 rounded-xl overflow-hidden text-xs">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-pink-50/30 text-[9px] font-bold text-pink-700 uppercase tracking-wider border-b border-pink-50">
                              <th className="py-2 px-3">Nama Menu</th>
                              <th className="py-2 px-3 text-center">Harga</th>
                              <th className="py-2 px-3 text-center">Jumlah</th>
                              <th className="py-2 px-3 text-right">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-pink-50/20 font-medium text-gray-700">
                            {order.items.map((item: any, idx: number) => (
                              <tr key={idx}>
                                <td className="py-2 px-3 font-semibold text-gray-950">{item.productName}</td>
                                <td className="py-2 px-3 text-center text-gray-500">{formatIDR(item.price)}</td>
                                <td className="py-2 px-3 text-center">{item.quantity} pcs</td>
                                <td className="py-2 px-3 text-right font-bold text-gray-900">{formatIDR(item.price * item.quantity)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Footer Row: Payment Totals and verifikasi buttons */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pt-3 border-t border-gray-100">
                      {/* Price calculations breakdown */}
                      <div className="text-[11px] space-y-1 font-semibold text-gray-500">
                        <p>Subtotal: <span className="text-gray-900 font-bold">{formatIDR(order.subtotal)}</span></p>
                        <p>Ongkos Kirim: <span className="text-gray-900 font-bold">+{formatIDR(order.deliveryCost)}</span></p>
                        {order.discount > 0 && (
                          <p className="text-pink-600">Diskon Promo: <span className="font-bold">-{formatIDR(order.discount)}</span></p>
                        )}
                        <p className="text-xs font-black text-pink-600 text-[12px] pt-0.5">
                          Total Transfer: <strong className="text-pink-600 font-black">{formatIDR(order.total)}</strong>
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2">
                        {/* WhatsApp Proof validation helper */}
                        <a
                          href={`https://wa.me/${order.phone.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(
                            order.fullName
                          )},%20kami%20dari%20MINI%20BITES%20ingin%20melakukan%20konfirmasi%20pembayaran%20untuk%20ID%20Pesanan%20${
                            order.id
                          }.%20Boleh%20kirimkan%20bukti%20transfernya?%20Terima%20kasih!`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 border border-pink-100 hover:border-pink-300 text-pink-700 bg-white font-bold rounded-xl text-xxs cursor-pointer transition-all flex items-center gap-1"
                        >
                          Hubungi WA Customer
                        </a>

                        {/* Verify payment status toggles */}
                        {isVerified ? (
                          <button
                            onClick={() => handleCancelVerification(order.id)}
                            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 font-bold rounded-xl text-xxs transition-all cursor-pointer flex items-center gap-1"
                          >
                            Batalkan Verifikasi
                          </button>
                        ) : (
                          <button
                            onClick={() => handleVerifyPayment(order.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xxs transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                          >
                            Verifikasi Pembayaran
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-pink-50">
                <span className="text-2xl font-bold">📋</span>
                <p className="text-gray-400 text-xs font-bold mt-2">Tidak ada pesanan yang sesuai dengan filter.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PRODUCT CRUD MANAGEMENT */}
      {activeSubTab === 'produk' && (
        <div className="space-y-4">
          
          {/* Header Action panel */}
          <div className="flex justify-between items-center bg-pink-50/30 p-4 rounded-xl border border-pink-100">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Manajemen Katalog Menu</h3>
              <p className="text-[10px] text-gray-500">Tambah produk baru, ubah harga, atau hapus ketersediaan menu dari katalog utama.</p>
            </div>
            
            <button
              onClick={handleOpenAddForm}
              className="flex items-center gap-1 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Tambah Dessert
            </button>
          </div>

          {/* Product Items Table */}
          <div className="bg-white rounded-2xl border border-pink-100 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-pink-100 bg-pink-50/30 text-[10px] font-bold text-pink-700 uppercase tracking-wider">
                    <th className="py-3 px-4">Menu Dessert</th>
                    <th className="py-3 px-3">Kategori</th>
                    <th className="py-3 px-3">Ukuran Porsi</th>
                    <th className="py-3 px-3 text-center">Nutrisi (Kkal)</th>
                    <th className="py-3 px-3 text-right">Harga Satuan</th>
                    <th className="py-3 px-4 text-center">Aksi Operasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-50/30 text-xs text-gray-700">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-pink-50/10">
                      
                      {/* Product thumbnail & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-10 h-10 object-cover rounded-lg border border-pink-100/50"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="font-bold text-gray-950">{product.name}</span>
                              {product.isPopular && (
                                <span className="text-[8px] font-extrabold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">POPULER</span>
                              )}
                            </div>
                            <span className="text-[10px] text-gray-400 line-clamp-1">{product.description}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-50 text-pink-600 border border-pink-100/30 uppercase">
                          {product.category}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-gray-500 font-medium">{product.size}</td>
                      <td className="py-3 px-3 text-center text-gray-500">{product.calories} kkal</td>
                      <td className="py-3 px-3 text-right font-bold text-pink-600">{formatIDR(product.price)}</td>
                      
                      {/* CRUD Controls */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleOpenEditForm(product)}
                            className="p-1.5 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors cursor-pointer"
                            title="Edit Menu"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                            title="Hapus Menu"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Simple Inline Pop-up Modal Form for Add/Edit */}
          {showProductForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-pink-100 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
                
                {/* Header title */}
                <div className="flex items-center justify-between border-b border-pink-50 pb-3">
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
                    <span>🍰</span> {editingProduct ? 'Ubah Menu Dessert Mini' : 'Tambah Menu Dessert Mini Baru'}
                  </h3>
                  <button
                    onClick={() => setShowProductForm(false)}
                    className="p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Form Inputs */}
                <form onSubmit={handleSubmitProduct} className="space-y-4 text-xs">
                  
                  {formError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 flex items-center gap-1.5 font-semibold text-[10px]">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Nama Dessert *</label>
                      <input
                        type="text"
                        placeholder="Contoh: Matcha Azuki Mousse"
                        value={prodName}
                        onChange={(e) => setProdName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-pink-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Kategori Dessert *</label>
                      <select
                        value={prodCategory}
                        onChange={(e) => setProdCategory(e.target.value as Product['category'])}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-pink-400 cursor-pointer"
                      >
                        <option value="Cake & Tartlet">Cake & Tartlet</option>
                        <option value="Mousse & Pudding">Mousse & Pudding</option>
                        <option value="Macaron & Choux">Macaron & Choux</option>
                        <option value="Healthy Sweet">Healthy Sweet</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Harga Satuan (IDR) *</label>
                      <input
                        type="number"
                        placeholder="Contoh: 25000"
                        value={prodPrice}
                        onChange={(e) => setProdPrice(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-pink-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Ukuran Porsi *</label>
                      <input
                        type="text"
                        placeholder="Contoh: Diameter 5cm"
                        value={prodSize}
                        onChange={(e) => setProdSize(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-pink-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Kandungan Kalori *</label>
                      <input
                        type="number"
                        placeholder="Contoh: 140"
                        value={prodCalories}
                        onChange={(e) => setProdCalories(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-pink-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">URL Gambar Dessert *</label>
                    <input
                      type="text"
                      placeholder="Contoh: https://images.unsplash.com/..."
                      value={prodImage}
                      onChange={(e) => setProdImage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-pink-400 font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Deskripsi Ringkas *</label>
                    <textarea
                      placeholder="Masukkan deskripsi singkat produk..."
                      value={prodDescription}
                      onChange={(e) => setProdDescription(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-pink-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Bahan-Bahan (Pisahkan dengan koma)</label>
                    <input
                      type="text"
                      placeholder="Contoh: Tepung, Mentega Premium, Vanila, Gula Organik"
                      value={prodIngredients}
                      onChange={(e) => setProdIngredients(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-pink-400"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="form-popular"
                      checked={prodIsPopular}
                      onChange={(e) => setProdIsPopular(e.target.checked)}
                      className="w-4 h-4 accent-pink-600 rounded-sm cursor-pointer"
                    />
                    <label htmlFor="form-popular" className="font-semibold text-gray-700 cursor-pointer select-none">
                      Tandai sebagai menu "Populer" / Best Seller
                    </label>
                  </div>

                  {/* Submit buttons */}
                  <div className="flex gap-3 justify-end pt-4 border-t border-pink-50">
                    <button
                      type="button"
                      onClick={() => setShowProductForm(false)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl cursor-pointer transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      {editingProduct ? 'Simpan Perubahan' : 'Tambahkan Dessert'}
                    </button>
                  </div>

                </form>
              </div>
            </div>
          )}

          {/* Custom Delete Confirmation Modal */}
          {productToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
              <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-pink-100 shadow-xl space-y-4 text-center">
                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-xl">
                  ⚠️
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-gray-900">Konfirmasi Hapus Produk</h4>
                  <p className="text-xxs text-gray-500 leading-relaxed">
                    Apakah Anda yakin ingin menghapus produk dessert mini <strong>{products.find(p => p.id === productToDelete)?.name}</strong> dari katalog menu? Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>
                <div className="flex gap-3 justify-center pt-2">
                  <button
                    onClick={() => setProductToDelete(null)}
                    className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs cursor-pointer transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={confirmDeleteProduct}
                    className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors"
                  >
                    Ya, Hapus
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
