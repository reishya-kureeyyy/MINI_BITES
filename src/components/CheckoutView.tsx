import React, { useState } from 'react';
import { CreditCard, CheckCircle, Shield, Truck, Sparkles, QrCode, ClipboardCheck, ArrowRight, CornerDownRight, AlertTriangle } from 'lucide-react';
import { CartItem, OrderDetails, PromoCode } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface CheckoutViewProps {
  cartItems: CartItem[];
  clearCart: () => void;
  setActiveTab: (tab: string) => void;
  onOrderSuccess?: (order: any) => void;
}

const DELIVERIES = [
  { id: 'instant', name: 'Instant Delivery (GoSend/Grab)', price: 20000, desc: 'Tiba dalam 1-2 jam. Direkomendasikan agar dessert tetap beku.' },
  { id: 'sameday', name: 'Same Day Delivery', price: 15000, desc: 'Tiba dalam 6-8 jam. Dikirim menggunakan tas insulator khusus.' },
  { id: 'regular', name: 'Regular Delivery (Paxel Cold)', price: 9000, desc: 'Tiba esok hari. Menggunakan armada truk pendingin khusus makanan.' }
];

const PAYMENTS = [
  { id: 'qris', name: 'QRIS (Gopay/OVO/Dana/ShopeePay)', icon: '📱', desc: 'Bayar instan menggunakan scan QR Code' },
  { id: 'va_bca', name: 'BCA Virtual Account', icon: '🏦', desc: 'Transfer dari ATM BCA atau KlikBCA' },
  { id: 'va_mandiri', name: 'Mandiri Virtual Account', icon: '🏛️', desc: 'Transfer via Mandiri Online / ATM Mandiri' },
  { id: 'credit_card', name: 'Kartu Kredit / Debit Online', icon: '💳', desc: 'Mendukung Visa, Mastercard, dan JCB' }
];

const AVAILABLE_PROMOS: PromoCode[] = [
  { code: 'PROMO10', discountType: 'percentage', value: 10, description: 'Diskon 10% untuk semua jenis Dessert Mini' },
  { code: 'MANIS5K', discountType: 'fixed', value: 5000, description: 'Potongan langsung sebesar Rp 5.000' },
  { code: 'FREETAS', discountType: 'fixed', value: 0, description: 'Gratis Premium Insulated Bag untuk menjaga suhu dessert' }
];

export default function CheckoutView({ cartItems, clearCart, setActiveTab, onOrderSuccess }: CheckoutViewProps) {
  // Form State
  const [formData, setFormData] = useState<OrderDetails>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
    paymentMethod: 'qris',
    deliveryService: 'instant',
    promoCode: '',
    notes: ''
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof OrderDetails, string>>>({});
  
  // Promo code states
  const [promoInput, setPromoInput] = useState('');
  const [activePromo, setActivePromo] = useState<PromoCode | null>(null);
  const [promoMessage, setPromoMessage] = useState({ text: '', type: '' });

  // Payment Gateway Simulator Popup state
  const [showSimulator, setShowSimulator] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'awaiting' | 'verifying' | 'success'>('awaiting');
  const [virtualAccount, setVirtualAccount] = useState('');
  const [simulatedOrderNumber, setSimulatedOrderNumber] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Currency Formatter
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  // Calculations
  const itemsSubtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const deliveryCost = DELIVERIES.find(d => d.id === formData.deliveryService)?.price || 0;
  
  let discountAmount = 0;
  if (activePromo) {
    if (activePromo.discountType === 'percentage') {
      discountAmount = Math.round(itemsSubtotal * (activePromo.value / 100));
    } else {
      discountAmount = activePromo.value;
    }
  }

  const grandTotal = Math.max(0, itemsSubtotal + deliveryCost - discountAmount);

  // Apply promo
  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    const found = AVAILABLE_PROMOS.find(p => p.code === code);
    if (found) {
      setActivePromo(found);
      setFormData(prev => ({ ...prev, promoCode: code }));
      setPromoMessage({
        text: `Kupon berhasil diterapkan! ${found.description}`,
        type: 'success'
      });
    } else {
      setActivePromo(null);
      setPromoMessage({
        text: 'Kode kupon tidak valid. Gunakan kupon contoh: PROMO10, MANIS5K',
        type: 'error'
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof OrderDetails]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Validate fields
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof OrderDetails, string>> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Nama lengkap wajib diisi';
    if (!formData.email.trim()) {
      errors.email = 'Alamat email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Format email tidak valid';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Nomor Whatsapp wajib diisi';
    } else if (formData.phone.length < 9) {
      errors.phone = 'Nomor telepon tidak valid';
    }
    if (!formData.address.trim()) errors.address = 'Alamat lengkap wajib diisi';
    if (!formData.postalCode.trim()) errors.postalCode = 'Kode pos wajib diisi';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit and launch Midtrans simulator
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // scroll to errors
      const firstError = Object.keys(formErrors)[0];
      const el = document.getElementById(`field-${firstError}`);
      el?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Generate simulated order numbers
    const orderNo = `MS-${Math.floor(100000 + Math.random() * 900000)}`;
    setSimulatedOrderNumber(orderNo);

    // Generate virtual accounts
    if (formData.paymentMethod === 'va_bca') {
      setVirtualAccount(`12800${formData.phone.slice(-7)}`);
    } else if (formData.paymentMethod === 'va_mandiri') {
      setVirtualAccount(`88008${formData.phone.slice(-7)}`);
    }

    setPaymentStep('awaiting');
    setShowSimulator(true);
  };

  // Simulate copy virtual account
  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Simulate payment processing
  const handleSimulatePayment = () => {
    setPaymentStep('verifying');
    setTimeout(() => {
      setPaymentStep('success');
      
      // Create and trigger order model for admin
      if (onOrderSuccess) {
        const orderId = simulatedOrderNumber || `MS-${Math.floor(100000 + Math.random() * 900000)}`;
        const now = new Date();
        const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        const monthYear = `${months[now.getMonth()]} ${now.getFullYear()}`;

        const newOrder = {
          id: orderId,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          deliveryService: formData.deliveryService,
          paymentMethod: formData.paymentMethod,
          promoCode: formData.promoCode,
          notes: formData.notes,
          items: cartItems.map(item => ({
            productId: item.product.id,
            productName: item.product.name,
            price: item.product.price,
            quantity: item.quantity
          })),
          subtotal: itemsSubtotal,
          deliveryCost: deliveryCost,
          discount: discountAmount,
          total: grandTotal,
          date: now.toISOString(),
          monthYear: monthYear
        };
        onOrderSuccess(newOrder);
      }
    }, 2500);
  };

  // Complete entire order and return to catalog
  const handleFinishAndReturn = () => {
    setShowSimulator(false);
    clearCart();
    setActiveTab('katalog');
  };

  if (cartItems.length === 0 && !showSimulator) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-pink-100">
          <CreditCard className="w-10 h-10 text-pink-500" />
        </div>
        <h2 className="text-2xl font-sans font-bold text-gray-900">Formulir Checkout Kosong</h2>
        <p className="text-gray-500 mt-2 max-w-sm mx-auto">
          Anda tidak memiliki dessert di keranjang belanja Anda saat ini. Silakan tambahkan beberapa dessert lezat ke katalog kami terlebih dahulu!
        </p>
        <button
          id="checkout-empty-back-btn"
          onClick={() => setActiveTab('katalog')}
          className="mt-6 px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-full cursor-pointer transition-colors shadow-sm"
        >
          Lihat Katalog Dessert
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-sans font-bold text-gray-900 tracking-tight">Checkout Simulasi</h1>
        <p className="text-sm text-gray-500 mt-1">Selesaikan pengisian data dan lakukan simulasi integrasi payment gateway sandbox.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Form Fields */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Informasi Pelanggan */}
          <div className="bg-white rounded-2xl p-6 border border-pink-100 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b border-pink-50 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold">1</span>
              Informasi Pengiriman & Kontak
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div id="field-fullName">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Contoh: Budi Santoso"
                  className={`w-full px-4 py-2.5 rounded-xl border ${formErrors.fullName ? 'border-red-500 focus:ring-red-400' : 'border-gray-200 focus:ring-pink-400'} focus:outline-hidden focus:ring-2`}
                />
                {formErrors.fullName && <p className="text-red-500 text-xxs mt-1 font-semibold">⚠️ {formErrors.fullName}</p>}
              </div>

              <div id="field-phone">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Nomor WhatsApp (Aktif)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Contoh: 08123456789"
                  className={`w-full px-4 py-2.5 rounded-xl border ${formErrors.phone ? 'border-red-500 focus:ring-red-400' : 'border-gray-200 focus:ring-pink-400'} focus:outline-hidden focus:ring-2`}
                />
                {formErrors.phone && <p className="text-red-500 text-xxs mt-1 font-semibold">⚠️ {formErrors.phone}</p>}
              </div>
            </div>

            <div id="field-email">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Alamat Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="budi.santoso@example.com"
                className={`w-full px-4 py-2.5 rounded-xl border ${formErrors.email ? 'border-red-500 focus:ring-red-400' : 'border-gray-200 focus:ring-pink-400'} focus:outline-hidden focus:ring-2`}
              />
              {formErrors.email && <p className="text-red-500 text-xxs mt-1 font-semibold">⚠️ {formErrors.email}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div id="field-address" className="md:col-span-3">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Alamat Lengkap Rumah</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Nama jalan, nomor rumah, RT/RW, Kecamatan"
                  className={`w-full px-4 py-2.5 rounded-xl border ${formErrors.address ? 'border-red-500 focus:ring-red-400' : 'border-gray-200 focus:ring-pink-400'} focus:outline-hidden focus:ring-2`}
                />
                {formErrors.address && <p className="text-red-500 text-xxs mt-1 font-semibold">⚠️ {formErrors.address}</p>}
              </div>

              <div id="field-postalCode">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Kode Pos</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="12345"
                  className={`w-full px-4 py-2.5 rounded-xl border ${formErrors.postalCode ? 'border-red-500 focus:ring-red-400' : 'border-gray-200 focus:ring-pink-400'} focus:outline-hidden focus:ring-2`}
                />
                {formErrors.postalCode && <p className="text-red-500 text-xxs mt-1 font-semibold">⚠️ {formErrors.postalCode}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Catatan Pengiriman (Opsional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={2}
                placeholder="Contoh: Titipkan di satpam, kurir minta bel pintu merah, atau kurangi kadar gula."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>

          {/* Section 2: Jasa Pengiriman */}
          <div className="bg-white rounded-2xl p-6 border border-pink-100 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b border-pink-50 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold">2</span>
              Pilih Jasa Pengiriman Dingin (Cold Logistics)
            </h3>

            <div className="space-y-3">
              {DELIVERIES.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.deliveryService === option.id
                      ? 'bg-pink-50/50 border-pink-400'
                      : 'border-gray-100 hover:bg-gray-50/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryService"
                    value={option.id}
                    checked={formData.deliveryService === option.id}
                    onChange={handleInputChange}
                    className="mt-1 text-pink-600 focus:ring-pink-500 cursor-pointer"
                  />
                  <div className="flex-1 flex justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-pink-500" />
                        {option.name}
                      </p>
                      <p className="text-xxs text-gray-400 mt-1">{option.desc}</p>
                    </div>
                    <span className="text-sm font-bold text-pink-600 shrink-0">{formatIDR(option.price)}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Section 3: Metode Pembayaran */}
          <div className="bg-white rounded-2xl p-6 border border-pink-100 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b border-pink-50 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold">3</span>
              Pilih Simulasi Metode Pembayaran
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PAYMENTS.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    formData.paymentMethod === method.id
                      ? 'bg-pink-50/50 border-pink-400'
                      : 'border-gray-100 hover:bg-gray-50/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={formData.paymentMethod === method.id}
                    onChange={handleInputChange}
                    className="mt-1 text-pink-600 focus:ring-pink-500 cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                      <span className="text-base">{method.icon}</span>
                      {method.name}
                    </p>
                    <p className="text-xxs text-gray-400 mt-0.5">{method.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

        </form>

        {/* Right Side: Order Summary & Coupon */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Coupon Promo Container */}
          <div className="bg-white rounded-2xl p-6 border border-pink-100 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4.5 h-4.5 text-amber-500" /> Kode Promo / Kupon
            </h4>

            <div className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Contoh: PROMO10"
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-pink-400 text-sm uppercase"
              />
              <button
                type="button"
                id="apply-promo-btn"
                onClick={handleApplyPromo}
                className="px-4 py-2 bg-pink-100 hover:bg-pink-600 text-pink-700 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Gunakan
              </button>
            </div>

            {/* Hint kupon yang bisa dicoba */}
            <div className="text-xxs text-gray-400 bg-pink-50/30 p-2.5 rounded-lg border border-pink-100/50 space-y-1">
              <span className="font-semibold text-pink-600 block">💡 Kupon yang Bisa Dicoba:</span>
              <ul className="list-disc pl-3.5 space-y-1">
                <li><strong className="text-gray-700">PROMO10</strong> - Potongan harga 10%</li>
                <li><strong className="text-gray-700">MANIS5K</strong> - Potongan harga Rp 5.000</li>
                <li><strong className="text-gray-700">FREETAS</strong> - Hadiah Premium Insulated Bag</li>
              </ul>
            </div>

            {/* Promo Message */}
            {promoMessage.text && (
              <p className={`text-xxs font-semibold p-2 rounded-lg ${
                promoMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
              }`}>
                {promoMessage.text}
              </p>
            )}
          </div>

          {/* Order Summary Container */}
          <div className="bg-white rounded-2xl p-6 border border-pink-100 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Ringkasan Pesanan</h4>
            
            {/* Items Scroller List */}
            <div className="divide-y divide-pink-50/50 max-h-56 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.product.id} className="py-2.5 flex items-center gap-3 justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-10 h-10 object-cover rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">{item.product.name}</p>
                      <p className="text-xxs text-gray-400">{item.quantity} pcs x {formatIDR(item.product.price)}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-800 shrink-0">
                    {formatIDR(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Billing breakdown */}
            <div className="space-y-2.5 pt-4 border-t border-pink-50 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal Produk</span>
                <span className="font-semibold text-gray-800">{formatIDR(itemsSubtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Biaya Pengiriman</span>
                <span className="font-semibold text-gray-800">{formatIDR(deliveryCost)}</span>
              </div>
              {activePromo && (
                <div className="flex justify-between text-emerald-600 font-semibold bg-emerald-50 p-1.5 rounded-lg">
                  <span className="flex items-center gap-1">🏷️ Diskon ({activePromo.code})</span>
                  <span>-{formatIDR(discountAmount)}</span>
                </div>
              )}
              {formData.promoCode === 'FREETAS' && (
                <div className="flex items-center gap-1.5 text-pink-600 font-bold bg-pink-50 p-1.5 rounded-lg text-xxs">
                  <span>🎁 Free Premium Insulated Bag Terpasang!</span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-4 border-t border-pink-50">
              <span className="text-sm font-bold text-gray-900">Total Pembayaran</span>
              <span className="text-xl font-extrabold text-pink-600">{formatIDR(grandTotal)}</span>
            </div>

            {/* Security Note */}
            <div className="flex items-center gap-2 text-xxs text-gray-400 bg-gray-50 p-2.5 rounded-xl">
              <Shield className="w-4 h-4 text-pink-500 shrink-0" />
              <span>Semua data pembayaran dienkripsi aman menggunakan protokol simulasi SSL & sandbox gateway.</span>
            </div>

            {/* Submit button trigger */}
            <button
              id="checkout-pay-submit"
              onClick={handleSubmitOrder}
              className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-pink-500/20 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              Lanjutkan ke Pembayaran
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
          </div>

        </div>

      </div>

      {/* MIDTRANS / PAYMENTS SIMULATOR OVERLAY */}
      <AnimatePresence>
        {showSimulator && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/75 backdrop-blur-xs"
            />

            {/* Simulator Container box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border-4 border-pink-600 z-10"
            >
              {/* Midtrans top banner */}
              <div className="bg-pink-600 p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💳</span>
                  <div>
                    <h4 className="text-sm font-bold tracking-tight uppercase">Simulasi Midtrans</h4>
                    <p className="text-[10px] text-pink-100">AI Studio Sandbox Environment</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-pink-700 px-2.5 py-1 rounded-full font-bold">
                  TEST MODE
                </span>
              </div>

              {/* Sandbox Body Content */}
              <div className="p-6 space-y-5">
                
                {paymentStep === 'awaiting' && (
                  <div className="space-y-4">
                    {/* Header values */}
                    <div className="bg-gray-50 p-4 rounded-xl space-y-1">
                      <p className="text-xxs text-gray-400 font-bold tracking-wider uppercase">Order ID</p>
                      <p className="text-sm font-mono font-bold text-gray-800">{simulatedOrderNumber}</p>
                      
                      <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-200">
                        <span className="text-xxs text-gray-500">Jumlah Tagihan</span>
                        <span className="text-base font-extrabold text-pink-600">{formatIDR(grandTotal)}</span>
                      </div>
                    </div>

                    {/* QRIS Scan Screen */}
                    {formData.paymentMethod === 'qris' && (
                      <div className="text-center space-y-3">
                        <p className="text-xs text-gray-600">Scan QR Code di bawah menggunakan GoPay, OVO, ShopeePay atau LinkAja Anda:</p>
                        
                        <div className="w-44 h-44 bg-white border-2 border-gray-100 p-2.5 rounded-xl mx-auto flex items-center justify-center shadow-xs">
                          {/* Mock dynamic vector-like QR design */}
                          <div className="relative w-full h-full flex flex-col items-center justify-center bg-gray-50 rounded-lg">
                            <QrCode className="w-28 h-28 text-gray-800 animate-pulse" />
                            <span className="text-[9px] font-bold text-pink-600 font-mono mt-1">MINISWEET-QRIS</span>
                          </div>
                        </div>

                        <p className="text-[10px] text-gray-400">QR Code kedaluwarsa dalam 15:00 menit</p>
                      </div>
                    )}

                    {/* Virtual Account transfer screens */}
                    {(formData.paymentMethod === 'va_bca' || formData.paymentMethod === 'va_mandiri') && (
                      <div className="space-y-3">
                        <p className="text-xs text-gray-600">
                          Silakan transfer pembayaran ke nomor rekening Virtual Account {formData.paymentMethod === 'va_bca' ? 'BCA' : 'Mandiri'} berikut:
                        </p>

                        <div className="bg-pink-50/50 p-4 rounded-xl border border-pink-100 flex justify-between items-center">
                          <div>
                            <p className="text-[10px] text-pink-600 font-bold uppercase">Nomor Virtual Account</p>
                            <p className="text-lg font-mono font-bold text-gray-800 mt-0.5">{virtualAccount}</p>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => handleCopyCode(virtualAccount)}
                            className="p-2 bg-white hover:bg-pink-100 text-pink-600 rounded-lg border border-pink-100 shadow-xs cursor-pointer text-xs flex items-center gap-1 font-semibold"
                          >
                            <ClipboardCheck className="w-4 h-4" />
                            {isCopied ? 'Tersalin' : 'Salin'}
                          </button>
                        </div>

                        <div className="space-y-1.5 text-[11px] text-gray-500 pl-2">
                          <p className="font-semibold text-gray-700">Langkah Transfer:</p>
                          <p>1. Buka Mobile/Internet Banking Anda.</p>
                          <p>2. Pilih menu Transfer &gt; Virtual Account.</p>
                          <p>3. Masukkan nomor di atas & pastikan nominal tagihan sesuai.</p>
                        </div>
                      </div>
                    )}

                    {/* Credit Card screen */}
                    {formData.paymentMethod === 'credit_card' && (
                      <div className="space-y-3">
                        <p className="text-xs text-gray-600">Simulasi Kartu Kredit Sandbox:</p>
                        <div className="border border-gray-200 p-4 rounded-xl space-y-3">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase">Nomor Kartu Kredit</label>
                            <input
                              type="text"
                              disabled
                              value="4111 1111 1111 1111"
                              className="w-full px-3 py-1.5 bg-gray-50 text-xs font-mono font-semibold rounded-lg border border-gray-100 text-gray-500 mt-1"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase">Kedaluwarsa</label>
                              <input
                                type="text"
                                disabled
                                value="12 / 29"
                                className="w-full px-3 py-1.5 bg-gray-50 text-xs font-mono font-semibold rounded-lg border border-gray-100 text-gray-500 mt-1"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase">CVV</label>
                              <input
                                type="text"
                                disabled
                                value="123"
                                className="w-full px-3 py-1.5 bg-gray-50 text-xs font-mono font-semibold rounded-lg border border-gray-100 text-gray-500 mt-1"
                              />
                            </div>
                          </div>
                        </div>
                        <p className="text-[10px] text-amber-600 flex items-center gap-1 bg-amber-50 p-2 rounded-lg border border-amber-100">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          Gunakan kartu tester default di atas untuk simulasi aman.
                        </p>
                      </div>
                    )}

                    {/* Action simulation trigger */}
                    <button
                      type="button"
                      id="simulator-pay-now-btn"
                      onClick={handleSimulatePayment}
                      className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl transition-all shadow-md cursor-pointer text-sm flex items-center justify-center gap-2"
                    >
                      <span>Simulasikan Pembayaran Berhasil</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setShowSimulator(false)}
                      className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                    >
                      Batal / Ubah Metode
                    </button>
                  </div>
                )}

                {paymentStep === 'verifying' && (
                  <div className="py-12 text-center space-y-4">
                    {/* Pulsing Loading Spinner */}
                    <div className="w-16 h-16 border-4 border-pink-100 border-t-pink-600 rounded-full animate-spin mx-auto" />
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">Menunggu Verifikasi Gateway...</h4>
                      <p className="text-xs text-gray-500 mt-1">Sistem sedang memeriksa transfer dana di ledger bank simulator.</p>
                    </div>
                  </div>
                )}

                {paymentStep === 'success' && (
                  <div className="space-y-4 text-center">
                    
                    {/* Success icon banner */}
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                      <CheckCircle className="w-10 h-10 text-emerald-500" />
                    </div>

                    <div>
                      <h3 className="text-lg font-sans font-extrabold text-gray-900">Pembayaran Berhasil!</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Sistem Midtrans mengonfirmasi pembayaran lunas.</p>
                    </div>

                    {/* Print out formal receipt invoice */}
                    <div className="bg-gray-50 p-4 rounded-xl text-left text-xxs font-mono space-y-1.5 border border-dashed border-gray-300">
                      <p className="text-center font-bold text-gray-700 text-xs tracking-wider border-b border-gray-300 pb-2 mb-2">MINISWEET INDONESIA</p>
                      
                      <div className="flex justify-between">
                        <span>Invoice No:</span>
                        <span className="font-bold">{simulatedOrderNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pelanggan:</span>
                        <span className="font-bold uppercase">{formData.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>WhatsApp:</span>
                        <span className="font-bold">{formData.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Metode:</span>
                        <span className="font-bold uppercase">{formData.paymentMethod} (Midtrans Sandbox)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="text-emerald-600 font-extrabold">PAID / LUNAS</span>
                      </div>

                      <div className="border-t border-gray-200 pt-2 mt-2 space-y-1">
                        <p className="font-bold">ITEM DETAIL:</p>
                        {cartItems.map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>- {item.product.name} (x{item.quantity})</span>
                            <span>{formatIDR(item.product.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-gray-200 pt-2 mt-2 space-y-1">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>{formatIDR(itemsSubtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ongkir ({formData.deliveryService}):</span>
                          <span>{formatIDR(deliveryCost)}</span>
                        </div>
                        {activePromo && (
                          <div className="flex justify-between text-emerald-600">
                            <span>Diskon ({activePromo.code}):</span>
                            <span>-{formatIDR(discountAmount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-gray-800 text-xs border-t border-gray-300 pt-1.5 mt-1">
                          <span>TOTAL LUNAS:</span>
                          <span>{formatIDR(grandTotal)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-pink-50 p-3 rounded-lg text-[10px] text-pink-700 text-left border border-pink-100">
                      <span className="font-bold">🛍️ Langkah Selanjutnya:</span> Tim kami telah menerima notifikasi pembayaran lunas. Kami sedang mengemas dessert mini Anda dalam wadah thermal cold-pack, dan kurir logistik dingin akan menjemput paket dalam 15 menit. Anda akan menerima notifikasi status pengiriman via WhatsApp!
                    </div>

                    <button
                      type="button"
                      id="simulator-finish-btn"
                      onClick={handleFinishAndReturn}
                      className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl transition-all shadow-md cursor-pointer text-sm"
                    >
                      Selesai & Belanja Lagi
                    </button>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
