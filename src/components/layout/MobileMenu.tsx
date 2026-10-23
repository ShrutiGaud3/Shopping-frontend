import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Heart,
  ShoppingBag,
  User,
  ChevronRight,
  ChevronDown,
  MessageCircle,
  Sparkles,
  Package
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useSettings } from '../../context/SettingsContext';
import type { Category } from '../../types';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categoryTree?: Category[];
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, categoryTree = [] }) => {
  const { cart, wishlist } = useShop();
  const { openWhatsAppSupport } = useSettings();
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleNavClick = (path: string) => {
    navigate(path);
    onClose();
  };

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5 shrink-0">
            <img
              src="/logo.png"
              alt="Weavera Logo"
              className="h-9 w-auto object-contain rounded shrink-0"
            />
            <div className="flex flex-col shrink-0">
              <span className="font-serif text-lg font-bold tracking-widest text-[#183812] leading-none">
                WEAVERA
              </span>
              <span className="text-[8px] uppercase tracking-wider font-medium text-[#2E5424] mt-0.5">
                Weaving, Tradition , Wearing Elegance
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-black transition-colors rounded-full hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Quick Action Buttons: Shopping Bag, Wishlist & Track Orders */}
        <div className="p-2.5 bg-slate-50 border-b border-slate-100 grid grid-cols-3 gap-1.5 shrink-0">
          <button
            onClick={() => handleNavClick('/cart')}
            className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1.5 bg-[#183812] text-white text-[11px] font-bold rounded-lg shadow-xs hover:bg-[#0E250A] transition-colors cursor-pointer active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#BEDAA9]" />
            <span>Bag {totalCartCount > 0 ? `(${totalCartCount})` : ''}</span>
          </button>
          <button
            onClick={() => handleNavClick('/wishlist')}
            className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1.5 bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-bold rounded-lg shadow-xs hover:bg-rose-100 transition-colors cursor-pointer active:scale-95"
          >
            <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-500/20" />
            <span>Wishlist {wishlist.length > 0 ? `(${wishlist.length})` : ''}</span>
          </button>
          <button
            onClick={() => handleNavClick('/orders')}
            className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1.5 bg-white border border-slate-200 text-slate-800 text-[11px] font-bold rounded-lg shadow-xs hover:bg-slate-50 transition-colors cursor-pointer active:scale-95"
          >
            <Package className="w-3.5 h-3.5 text-[#183812]" />
            <span>Orders</span>
          </button>
        </div>

        {/* Categories / Navigation Links */}
        <div className="py-4 px-3 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between px-2 mb-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Ethnic Collections
            </p>
            <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              Loom Direct
            </span>
          </div>

          <div className="space-y-1">
            {[...categoryTree].sort((a, b) => {
              const getRank = (name: string, slug?: string) => {
                const text = `${name || ''} ${slug || ''}`.toLowerCase();
                if (text.includes('saree')) return 1;
                if (text.includes('suit') || text.includes('salwar')) return 2;
                if (text.includes('lehenga')) return 3;
                return 10;
              };
              const rA = getRank(a.name, a.slug);
              const rB = getRank(b.name, b.slug);
              if (rA !== rB) return rA - rB;
              return (a.order || 0) - (b.order || 0);
            }).map((cat) => {
              const hasChildren = cat.children && cat.children.length > 0;
              const isExpanded = !!expandedCategories[cat.id];

              return (
                <div key={cat.id || cat.slug} className="border-b border-slate-50 last:border-0 pb-1">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleNavClick(`/products?category=${encodeURIComponent(cat.name)}`)}
                      className="flex-1 py-2.5 px-2 text-xs font-bold text-slate-800 hover:text-rose-600 text-left uppercase tracking-wide transition-colors"
                    >
                      {cat.name}
                    </button>
                    {hasChildren && (
                      <button
                        onClick={() => toggleCategory(cat.id)}
                        className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                        aria-label={`Toggle ${cat.name} subcategories`}
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-rose-600" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Expandable Subcategories */}
                  {hasChildren && isExpanded && (
                    <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-50/70 rounded-lg mb-1">
                      {cat.children!.map((sub) => (
                        <button
                          key={sub.id || sub.slug}
                          onClick={() =>
                            handleNavClick(`/products?category=${encodeURIComponent(sub.name)}`)
                          }
                          className="w-full flex items-center justify-between py-2 px-2 text-xs text-slate-600 hover:text-rose-600 text-left transition-colors"
                        >
                          <span>{sub.name}</span>
                          <span className="text-[10px] text-slate-400">&rsaquo;</span>
                        </button>
                      ))}
                      <button
                        onClick={() =>
                          handleNavClick(`/products?category=${encodeURIComponent(cat.name)}`)
                        }
                        className="w-full text-left py-2 px-2 text-[11px] font-bold text-rose-600 hover:underline border-t border-slate-200/50 mt-1"
                      >
                        View all in {cat.name} &rarr;
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <hr className="my-4 border-slate-100" />

          {/* Quick Links */}
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('/products?sort=discount')}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50/70 rounded-lg"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-500" /> Festive Deals & Steals
              </span>
              <span className="text-[10px] bg-rose-600 text-white font-bold px-1.5 py-0.5 rounded-full">
                HOT
              </span>
            </button>

            <button
              onClick={() => handleNavClick('/contact')}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg text-left"
            >
              <span>Contact Us</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <hr className="my-4 border-slate-100" />

          <p className="px-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            My Account & Support
          </p>

          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('/wishlist')}
              className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              <span className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-rose-500" /> Saved Wishlist
              </span>
              {wishlist.length > 0 && (
                <span className="bg-rose-100 text-rose-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavClick('/cart')}
              className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              <span className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 text-slate-700" /> Shopping Bag
              </span>
              {totalCartCount > 0 && (
                <span className="bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {totalCartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavClick('/orders')}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              <User className="w-4 h-4 text-slate-500" /> Track My Orders
            </button>

            <button
              onClick={() => {
                openWhatsAppSupport();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg"
            >
              <MessageCircle className="w-4 h-4" /> Order on WhatsApp
            </button>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500">
          <p>© 2026 Weavera Ethnic Fashion. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
