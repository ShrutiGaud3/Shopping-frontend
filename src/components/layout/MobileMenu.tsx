import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Heart,
  ShoppingBag,
  User,
  Shield,
  ChevronRight,
  ChevronDown,
  MessageCircle,
  Sparkles
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
          <div className="flex items-center gap-1.5">
            <span className="font-serif text-2xl font-bold tracking-widest text-slate-900">
              VELORA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-black transition-colors rounded-full hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories / Navigation Links */}
        <div className="py-4 px-3 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between px-2 mb-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Ethnic Collections
            </p>
            <span className="text-[10px] text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded-full">
              Surat Direct
            </span>
          </div>

          <div className="space-y-1">
            {categoryTree.map((cat) => {
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

            <button
              onClick={() => handleNavClick('/admin')}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Shield className="w-4 h-4 text-slate-500" /> Admin Portal
            </button>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500">
          <p>© 2026 VELORA Ethnic Fashion. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
