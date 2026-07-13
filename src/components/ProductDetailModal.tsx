import React, { useState } from 'react';
import { X, Star, ShoppingBag, Flame, Layers, ListChecks } from 'lucide-react';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function ProductDetailModal({ product, onClose, onAddToCart }: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  // Utility to format currency
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const incrementQty = () => setQuantity(prev => prev + 1);
  const decrementQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          id="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal content body */}
        <motion.div
          id={`detail-modal-${product.id}`}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-pink-100 z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Close button icon */}
          <button
            id="modal-close-btn"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-white/95 rounded-full hover:bg-pink-100 text-gray-700 hover:text-pink-600 shadow-sm transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Left Image column */}
            <div className="relative h-64 md:h-full min-h-[300px]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <span className="text-xxs font-bold uppercase tracking-wider bg-pink-600 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <h3 className="text-xl font-bold mt-1.5">{product.name}</h3>
              </div>
            </div>

            {/* Right details column */}
            <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                {/* Header info */}
                <div className="flex justify-between items-center border-b border-pink-50 pb-3">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold text-gray-800">{product.rating}</span>
                    <span className="text-xs text-gray-400">({product.reviewsCount} review pembeli)</span>
                  </div>
                  <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md">
                    ✓ Tersedia
                  </span>
                </div>

                {/* Subtitle & Long description */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-900">Deskripsi Dessert</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {product.longDescription}
                  </p>
                </div>

                {/* Product Stats */}
                <div className="grid grid-cols-2 gap-3 bg-pink-50/40 p-3 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-pink-600" />
                    <div>
                      <p className="text-xxs text-gray-400 font-medium">Kalori</p>
                      <p className="text-xs font-semibold text-gray-800">{product.calories} kkal</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-500" />
                    <div>
                      <p className="text-xxs text-gray-400 font-medium">Ukuran</p>
                      <p className="text-xs font-semibold text-gray-800">{product.size}</p>
                    </div>
                  </div>
                </div>

                {/* Ingredients */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                    <ListChecks className="w-4 h-4 text-pink-600" /> Bahan Baku Utama
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {product.ingredients.map((ing, idx) => (
                      <span key={idx} className="text-xxs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-pink-50 space-y-4">
                
                {/* Quantity select & unit price */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xxs text-gray-400 font-medium">Harga Satuan</span>
                    <span className="text-lg font-bold text-gray-900">{formatIDR(product.price)}</span>
                  </div>

                  {/* Qty count control */}
                  <div className="flex items-center border border-pink-100 rounded-xl overflow-hidden bg-white">
                    <button
                      id="modal-dec-qty"
                      onClick={decrementQty}
                      className="px-3.5 py-2 hover:bg-pink-50 text-gray-600 transition-colors font-semibold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 text-sm font-bold text-gray-800">{quantity}</span>
                    <button
                      id="modal-inc-qty"
                      onClick={incrementQty}
                      className="px-3.5 py-2 hover:bg-pink-50 text-gray-600 transition-colors font-semibold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-xxs text-gray-400 font-medium">Subtotal</span>
                    <span className="text-xl font-extrabold text-pink-600">
                      {formatIDR(product.price * quantity)}
                    </span>
                  </div>

                  <button
                    id="modal-add-to-cart-submit"
                    onClick={() => {
                      onAddToCart(product, quantity);
                      onClose();
                    }}
                    className="flex-1 py-3.5 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-bold rounded-xl shadow-md hover:shadow-pink-500/10 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4.5 h-4.5" />
                    Tambah ke Keranjang
                  </button>
                </div>

              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
