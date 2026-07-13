import React from 'react';
import { Star, Plus, Eye } from 'lucide-react';
import { Product } from '../types';
import { motion } from 'motion/react';

interface ProductCardProps {
  key?: string;
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  // Utility to format currency
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const categoryColors: Record<Product['category'], { bg: string; text: string }> = {
    'Cake & Tartlet': { bg: 'bg-pink-100', text: 'text-pink-700' },
    'Mousse & Pudding': { bg: 'bg-amber-100', text: 'text-amber-700' },
    'Macaron & Choux': { bg: 'bg-purple-100', text: 'text-purple-700' },
    'Healthy Sweet': { bg: 'bg-emerald-100', text: 'text-emerald-700' }
  };

  const catColor = categoryColors[product.category] || { bg: 'bg-pink-100', text: 'text-pink-700' };

  return (
    <motion.div
      id={`product-card-${product.id}`}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl overflow-hidden border border-pink-100/70 shadow-xs hover:shadow-xs transition-all duration-300 flex flex-col h-full group"
    >
      {/* Product Image Panel */}
      <div className="relative aspect-square overflow-hidden bg-pink-50/10">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
        
        {/* Category Tag */}
        <span className={`absolute top-1.5 left-1.5 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${catColor.bg} ${catColor.text}`}>
          {product.category.split(' ')[0]}
        </span>

        {/* Popular Tag */}
        {product.isPopular && (
          <span className="absolute top-1.5 right-1.5 text-[8px] sm:text-[9px] font-bold uppercase bg-pink-600 text-white px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-xs">
            <Star className="w-2 h-2 fill-white" /> Populer
          </span>
        )}

        {/* Quick View Button overlay on hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-250 flex items-center justify-center">
          <button
            id={`btn-quickview-${product.id}`}
            onClick={() => onViewDetails(product)}
            className="p-2 bg-white hover:bg-pink-600 hover:text-white text-gray-800 rounded-full shadow-md transition-colors cursor-pointer transform scale-90 group-hover:scale-100 duration-200"
            title="Lihat Detail"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Text Details */}
      <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating and Reviews */}
          <div className="flex items-center gap-1 mb-1">
            <div className="flex items-center text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" />
            </div>
            <span className="text-[10px] font-bold text-gray-700">{product.rating}</span>
            <span className="text-[9px] text-gray-400">({product.reviewsCount})</span>
          </div>

          {/* Product Title */}
          <h3 className="font-sans font-bold text-gray-950 group-hover:text-pink-600 transition-colors text-xs sm:text-sm line-clamp-1">
            {product.name}
          </h3>

          {/* Product Description */}
          <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">
            {product.description}
          </p>
        </div>

        <div>
          {/* Meta Stats: Size & Calories */}
          <div className="text-[9px] text-gray-400/80 mt-2 pt-1.5 border-t border-pink-50/60 flex justify-between">
            <span>📏 {product.size}</span>
            <span>🔥 {product.calories} kkal</span>
          </div>

          {/* Price & Action Button */}
          <div className="flex items-center justify-between mt-2 pt-1">
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold text-gray-900 leading-none">
                {formatIDR(product.price)}
              </span>
            </div>

            <button
              id={`btn-add-to-cart-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="p-1 sm:px-2 sm:py-1 bg-pink-50 hover:bg-pink-600 text-pink-600 hover:text-white rounded-lg text-[10px] font-bold transition-all duration-200 cursor-pointer flex items-center gap-0.5 border border-pink-100/50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tambah</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
