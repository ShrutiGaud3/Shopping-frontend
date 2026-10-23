import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  Shield,
  LogOut,
  Package,
  User,
  X,
  ChevronDown,
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { MobileMenu } from './MobileMenu';
import { categoryService } from '../../services/categoryService';
import type { Category } from '../../types';

export const Navbar: React.FC = () => {
  const { user, logout, cart, wishlist, searchQuery, setSearchQuery, products } = useShop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [categoryTree, setCategoryTree] = useState<Category[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navigate = useNavigate();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Fetch hierarchical category tree for dynamic Mega Menu
  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        const res = await categoryService.getCategoryTree();
        if (isMounted && res.success && res.data && res.data.length > 0) {
          const visibleCategories = res.data.filter((cat) => cat.showInMenu !== false);
          setCategoryTree(visibleCategories);
        }
      } catch (err) {
        console.warn('Could not load category tree for Mega Menu:', err);
      }
    };
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Live Matching Search Suggestions
  const matchingProducts = searchQuery.trim().length > 0
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      setShowMobileSearch(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSelectProduct = (productId: string) => {
    setIsSearchFocused(false);
    setShowMobileSearch(false);
    navigate(`/product/${productId}`);
  };

  // Fallback ethnic wear categories if DB is not yet populated
  const defaultCategories: Partial<Category>[] = [
    {
      id: 'sarees',
      name: 'Sarees',
      slug: 'sarees',
      children: [
        { id: 'banarasi', name: 'Banarasi Silk', slug: 'banarasi-silk', itemCount: 45, image: '' },
        { id: 'kanjivaram', name: 'Kanjivaram Silk', slug: 'kanjivaram-silk', itemCount: 30, image: '' },
        { id: 'georgette', name: 'Georgette Sarees', slug: 'georgette-sarees', itemCount: 50, image: '' },
        { id: 'organza', name: 'Organza Sarees', slug: 'organza-sarees', itemCount: 25, image: '' },
        { id: 'ready-to-wear', name: 'Ready To Wear Sarees', slug: 'ready-to-wear-sarees', itemCount: 20, image: '' }
      ]
    },
    {
      id: 'lehengas',
      name: 'Lehengas',
      slug: 'lehengas',
      children: [
        { id: 'bridal', name: 'Bridal Lehengas', slug: 'bridal-lehengas', itemCount: 35, image: '' },
        { id: 'party-wear', name: 'Party Wear Lehengas', slug: 'party-wear-lehengas', itemCount: 40, image: '' },
        { id: 'velvet', name: 'Velvet Lehengas', slug: 'velvet-lehengas', itemCount: 18, image: '' }
      ]
    },
    {
      id: 'salwar-suits',
      name: 'Salwar Suits',
      slug: 'salwar-suits',
      children: [
        { id: 'anarkali', name: 'Anarkali Suits', slug: 'anarkali-suits', itemCount: 30, image: '' },
        { id: 'straight', name: 'Straight Cut Suits', slug: 'straight-cut-suits', itemCount: 25, image: '' },
        { id: 'sharara', name: 'Sharara & Gharara', slug: 'sharara-gharara', itemCount: 22, image: '' }
      ]
    }
  ];

  // Use dynamic categories directly from database (categoryTree)
  const displayCategories: Category[] = (categoryTree && categoryTree.length > 0)
    ? categoryTree
    : (defaultCategories as Category[]);

  return (
    <>
      <div className="w-full bg-white border-b border-slate-200/90 shadow-xs">
        
        {/* Main Header Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-6">
            
            {/* Left: Mobile Toggle & Brand Logo */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-1.5 text-slate-700 hover:text-black transition-colors focus:outline-none shrink-0"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <Link
                to="/"
                className="flex items-center gap-2 sm:gap-2.5 transition-transform hover:scale-[1.02] group shrink-0"
              >
                <div className="w-9 h-9 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-[#BEDAA9]/35 border border-[#BEDAA9] shadow-xs flex items-center justify-center p-1 sm:p-1.5 transition-all group-hover:border-[#94BC7B] group-hover:bg-[#BEDAA9]/50">
                  <img
                    src="/logo.png"
                    alt="Weavera Logo"
                    className="w-full h-full object-contain rounded-lg shrink-0"
                  />
                </div>
                <div className="flex flex-col shrink-0">
                  <span className="font-serif text-lg sm:text-2xl md:text-3xl font-extrabold tracking-[0.14em] sm:tracking-[0.16em] text-[#183812] leading-none transition-colors group-hover:text-[#0E250A]">
                    WEAVERA
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.26em] font-bold text-[#3E6830] hidden sm:block mt-0.5">
                    Surat Ethnic Luxury
                  </span>
                </div>
              </Link>
            </div>

            {/* Middle: Desktop Search Bar + Auto-complete Dropdown */}
            <div className="flex-1 max-w-xs md:max-w-lg hidden sm:block mx-2 relative">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search sarees, lehengas, salwar suits..."
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-10 pr-9 text-xs md:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-all shadow-inner"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                    aria-label="Clear Search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* Real-time Search Suggestions Dropdown */}
              {isSearchFocused && searchQuery.trim().length > 0 && (
                <div
                  className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden text-left"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {matchingProducts.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      <div className="p-2.5 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Matching Products ({matchingProducts.length})
                      </div>
                      {matchingProducts.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleSelectProduct(product.id)}
                          className="p-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition-colors"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-12 object-cover rounded-sm border border-slate-100"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {product.brand} · ₹{product.price.toLocaleString()}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 text-center transition"
                      >
                        View all results for "{searchQuery}"
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-500">
                      No products found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: Action Icons (Wishlist, Cart, Profile) */}
            <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4">
              
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="sm:hidden p-1.5 text-slate-700 hover:text-black transition-colors"
                aria-label="Toggle Mobile Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist - Hidden on mobile, accessible via mobile drawer menu */}
              <Link
                to="/wishlist"
                className="hidden sm:flex relative p-2 text-slate-700 hover:text-rose-600 transition-colors rounded-full hover:bg-rose-50"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart - Hidden on mobile screen, accessible via mobile drawer menu */}
              <Link
                to="/cart"
                className="hidden sm:flex relative p-2 text-slate-700 hover:text-slate-950 transition-colors rounded-full hover:bg-slate-100"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white shadow-xs">
                    {totalCartCount}
                  </span>
                )}
              </Link>

              {/* Account / My Profile Dropdown - Visible across all screens */}
              <div className="relative">
                {user ? (
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 transition-colors text-slate-700 cursor-pointer"
                    aria-label="User Account"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-rose-600 to-amber-600 text-white flex items-center justify-center text-[10px] sm:text-xs font-bold uppercase shadow-sm">
                      {user.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
                    </div>
                    <span className="hidden md:inline-block text-xs font-semibold text-slate-800">
                      {user.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 hover:text-white hover:bg-slate-900 border border-slate-300 p-1.5 sm:px-3.5 sm:py-1.5 rounded-full transition-colors"
                    title="Sign In"
                  >
                    <User className="w-4 h-4 sm:hidden" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Link>
                )}

                {/* Dropdown Menu */}
                {user && userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl py-1.5 z-50 text-xs text-slate-700 divide-y divide-slate-100"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3.5 py-2.5 font-medium text-slate-900 text-left">
                      Signed in as
                      <span className="font-semibold text-slate-700 truncate block">{user.email}</span>
                      <span className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 uppercase">
                        {user.role}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-50 transition-colors text-left"
                      >
                        <User className="w-4 h-4 text-slate-500" /> My Profile
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-50 transition-colors text-left"
                      >
                        <Package className="w-4 h-4 text-slate-500" /> My Orders & Tracking
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-50 transition-colors text-left"
                      >
                        <Heart className="w-4 h-4 text-rose-500" /> Saved Wishlist
                      </Link>
                    </div>

                    {user.role === 'admin' && (
                      <div className="py-1">
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2 text-emerald-700 font-semibold hover:bg-emerald-50 transition-colors text-left"
                        >
                          <Shield className="w-4 h-4" /> Admin Portal
                        </Link>
                      </div>
                    )}

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Dynamic Mega Menu Navigation Strip */}
        <div className="hidden lg:block border-t border-slate-100 bg-white/95 backdrop-blur-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-between gap-4 py-0.5">
              <div className="flex items-center space-x-1 sm:space-x-3 shrink-0">
                {displayCategories.map((category) => {
                  const hasChildren = category.children && category.children.length > 0;
                  const isDropdownActive = activeDropdown === category.id;

                  return (
                    <div
                      key={category.id || category.slug}
                      className="relative group py-2"
                      onMouseEnter={() => hasChildren && setActiveDropdown(category.id)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <Link
                        to={`/products?category=${encodeURIComponent(category.name)}`}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 rounded-md whitespace-nowrap ${
                          isDropdownActive
                            ? 'text-rose-700 bg-rose-50/80'
                            : 'text-slate-800 hover:text-rose-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{category.name}</span>
                        {hasChildren && (
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              isDropdownActive ? 'rotate-180 text-rose-600' : 'text-slate-400'
                            }`}
                          />
                        )}
                      </Link>

                      {/* Mega Menu Dropdown */}
                      {hasChildren && isDropdownActive && (
                        <div
                          className="absolute top-full left-0 mt-1 w-[420px] bg-white rounded-xl shadow-2xl border border-slate-200 p-5 z-50 animate-fadeIn text-left divide-y divide-slate-100"
                        >
                          <div className="pb-3 flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-slate-900 text-sm">
                                {category.name} Collection
                              </h4>
                              <p className="text-[11px] text-slate-500">
                                Direct from Surat weavers & craftsmen
                              </p>
                            </div>
                            <Link
                              to={`/products?category=${encodeURIComponent(category.name)}`}
                              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-0.5"
                            >
                              <span>View All</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>

                          <div className="pt-3 grid grid-cols-2 gap-2">
                            {category.children!.map((sub) => (
                              <Link
                                key={sub.id || sub.slug}
                                to={`/products?category=${encodeURIComponent(sub.name)}`}
                                className="group/item flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors"
                              >
                                <div>
                                  <span className="text-xs font-medium text-slate-800 group-hover/item:text-rose-600 group-hover/item:translate-x-0.5 transition-all inline-block">
                                    {sub.name}
                                  </span>
                                  {sub.itemCount ? (
                                    <span className="block text-[10px] text-slate-400">
                                      {sub.itemCount}+ designs
                                    </span>
                                  ) : null}
                                </div>
                                <span className="text-slate-300 group-hover/item:text-rose-500 text-xs transition">
                                  &rsaquo;
                                </span>
                              </Link>
                            ))}
                          </div>

                          {/* Promotional Footer in Mega Menu */}
                          <div className="mt-3 pt-3 flex items-center justify-between text-[11px] bg-rose-50/60 -mx-5 -mb-5 px-5 py-2.5 rounded-b-xl border-t border-rose-100/60">
                            <span className="font-semibold text-rose-900 flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                              Custom Stitching Available
                            </span>
                            <span className="text-slate-500">Express Delivery Worldwide</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quick links on right side of navigation bar */}
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 shrink-0 whitespace-nowrap">
                <Link
                  to="/products?sort=discount"
                  className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 uppercase tracking-wider py-1 px-2 rounded-md hover:bg-rose-50"
                >
                  <Sparkles className="w-3 h-3 text-rose-500" />
                  <span>Steal Deals</span>
                </Link>
                <Link
                  to="/blog"
                  className="hover:text-black uppercase tracking-wider py-1 px-2 rounded-md hover:bg-slate-50 flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                  <span>Stories</span>
                </Link>
                <Link
                  to="/contact"
                  className="hover:text-black uppercase tracking-wider py-1 px-2 rounded-md hover:bg-slate-50"
                >
                  Contact Us
                </Link>
              </div>
            </nav>
          </div>
        </div>

        {/* Mobile Search Bar Expansion */}
        {showMobileSearch && (
          <div className="p-3 border-t border-slate-200 bg-slate-50 sm:hidden">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search ethnic wear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-full py-2 pl-9 pr-8 text-xs text-slate-900 focus:outline-none focus:border-slate-900 shadow-inner"
                autoFocus
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowMobileSearch(false)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                aria-label="Close Search"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu with Dynamic Categories */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        categoryTree={displayCategories}
      />
    </>
  );
};
