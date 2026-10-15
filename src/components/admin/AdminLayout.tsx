import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Layers, ArrowLeft, ShieldCheck, Menu, X, Tag, Star, Users, MessageSquare } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { label: 'Inventory', path: '/admin/inventory', icon: Layers },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Coupons', path: '/admin/coupons', icon: Tag },
    { label: 'Reviews', path: '/admin/reviews', icon: Star },
    { label: 'Messages', path: '/admin/messages', icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      
      {/* Admin Top Bar */}
      <header className="bg-gray-900 text-white border-b border-gray-800 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 sticky top-0 z-40">
        
        {/* Left: Mobile Hamburger & Brand Name */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-sm transition-colors"
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link
            to="/"
            className="hidden sm:flex items-center gap-2 text-xs font-semibold text-gray-300 hover:text-white transition-colors border border-gray-700 px-2.5 py-1.5 rounded-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Storefront
          </Link>

          <div className="hidden sm:block h-4 w-[1px] bg-gray-700" />

          <span className="font-serif text-lg sm:text-xl font-bold tracking-wider text-white">
            VELORA <span className="font-sans text-[10px] sm:text-xs font-normal uppercase text-emerald-400 tracking-widest ml-1 sm:ml-2">Admin</span>
          </span>
        </div>

        {/* Right: Return to Store link on mobile + Administrator badge */}
        <div className="flex items-center gap-3 text-xs text-gray-300">
          <Link
            to="/"
            className="sm:hidden text-[11px] font-semibold text-emerald-400 underline hover:text-emerald-300"
          >
            Storefront &gt;
          </Link>
          
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-300 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Admin</span>
          </div>
        </div>

      </header>

      {/* Admin Body Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Desktop Sidebar (Fixed) */}
        <aside className="hidden lg:flex w-60 bg-gray-900 text-gray-400 p-4 border-r border-gray-800 shrink-0 flex-col justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-2">
              Management
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-sm text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-emerald-500 text-white'
                      : 'hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="p-3 bg-gray-800/80 rounded-sm text-[11px] text-gray-400">
            <p className="font-bold text-white mb-1">VELORA Engine v2.4</p>
            <p>Admin Dashboard UI</p>
          </div>
        </aside>

        {/* Mobile Side Drawer Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="relative w-64 bg-gray-900 text-gray-400 p-5 shadow-2xl flex flex-col justify-between z-10 h-full">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-800">
                  <span className="font-serif text-xl font-bold text-white">VELORA Admin</span>
                  <button onClick={() => setSidebarOpen(false)} className="p-1 text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-semibold transition-colors ${
                          isActive
                            ? 'bg-emerald-500 text-white'
                            : 'hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-gray-800 rounded-sm text-[11px] text-gray-400 mt-auto">
                <p className="font-bold text-white mb-1">VELORA Engine v2.4</p>
                <Link to="/" className="text-emerald-400 hover:underline">
                  Exit to Main Storefront &gt;
                </Link>
              </div>
            </aside>
          </div>
        )}

        {/* Admin Content Window */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto bg-gray-50 text-left min-w-0">
          <Outlet />
        </main>

      </div>

    </div>
  );
};
