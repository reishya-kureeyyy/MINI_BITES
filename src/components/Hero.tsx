import React from 'react';
import { ShoppingBag, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onExploreClick: () => void;
}

export default function Hero({ onExploreClick }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-radial from-pink-50/50 via-white to-amber-50/20 py-10 md:py-16 border-b border-pink-50">
      {/* Visual background blobs */}
      <div className="absolute top-0 left-1/4 w-48 h-48 bg-pink-100/30 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-100/20 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
          
          {/* Text Info */}
          <div className="space-y-4 text-center md:text-left max-w-md">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-100/80 text-pink-700 text-[10px] font-bold uppercase tracking-wider"
            >
              🧁 MINI BITES • Dessert Premium 100% Halal
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-sans font-black text-gray-950 tracking-tight leading-tight"
            >
              MOMEN MANIS,<br />
              <span className="bg-gradient-to-r from-pink-600 to-amber-500 bg-clip-text text-transparent uppercase">
                UKURAN MINI.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xs sm:text-sm text-gray-600 leading-relaxed"
            >
              Yuk cobain dessetnya Reishya
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pt-2"
            >
              <button
                id="hero-cta-explore"
                onClick={onExploreClick}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-bold rounded-xl shadow-md hover:shadow-pink-500/15 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 text-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                Pesan Sekarang
              </button>
            </motion.div>
          </div>

          {/* Compact visual image */}
          <div className="relative w-full max-w-[280px] sm:max-w-[320px] shrink-0">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative bg-white p-2 rounded-2xl shadow-lg border border-pink-50 overflow-hidden"
            >
              <img 
                src="https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=400" 
                alt="Premium Dessert" 
                className="w-full h-48 object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
              
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2 py-1 rounded-md shadow-xs flex items-center gap-0.5 border border-pink-100">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="text-[10px] font-bold text-gray-800">Best Seller</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
