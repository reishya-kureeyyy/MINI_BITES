import React from 'react';
import { ShoppingBag, Lock } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
}

export default function Navbar({ activeTab, setActiveTab, cartCount }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-xs py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-10">
          
          {/* Logo Brand */}
          <div className="flex items-center">
            <button 
              onClick={() => setActiveTab('katalog')} 
              className="flex items-center gap-1.5 text-lg font-bold tracking-tight text-pink-600 hover:opacity-90 cursor-pointer"
              id="navbar-logo"
            >
              <span className="text-xl">🧁</span>
              <span className="font-sans font-black bg-gradient-to-r from-pink-600 to-amber-500 bg-clip-text text-transparent tracking-wide text-base sm:text-lg">
                MINI BITES
              </span>
            </button>
          </div>

          {/* Clean Action Navigation: Cart & Admin Only */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Admin Access Button */}
            <button
              id="navbar-admin-access"
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                activeTab === 'admin'
                  ? 'bg-pink-100 text-pink-700'
                  : 'text-gray-500 hover:text-pink-600 hover:bg-pink-50/50'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              id="navbar-cart-quick"
              onClick={() => setActiveTab('keranjang')}
              className={`relative p-2 rounded-full transition-all cursor-pointer ${
                activeTab === 'keranjang'
                  ? 'bg-pink-100 text-pink-600'
                  : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
              }`}
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold leading-none text-white bg-pink-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}
