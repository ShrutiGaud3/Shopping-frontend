import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../product/ProductCard';

export const NewArrivalsSection: React.FC = () => {
  const { products, loadingProducts } = useShop();
  const [activeTab, setActiveTab] = useState<'All' | 'Sarees' | 'Lehengas' | 'Salwar Suits'>('All');

  // Filter products for New Arrivals (prioritize isNew, or fallback to latest)
  const categoryFiltered = products.filter((p) => {
    if (activeTab === 'All') return true;
    return p.category?.toLowerCase() === activeTab.toLowerCase();
  });

  const newArrivals = categoryFiltered
    .filter((p) => p.isNew)
    .concat(categoryFiltered.filter((p) => !p.isNew))
    .slice(0, 8);

  return (
    <section className="py-12 sm:py-16 bg-slate-50/70 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2.5 border border-rose-200">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Fresh Off The Looms</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-[0.15em] text-slate-900">
            NEW ARRIVALS
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-lg tracking-wide">
            Explore the latest festive silhouettes &amp; bridal drops straight from master Surat artisans
          </p>

          {/* Category Filter Tabs */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-6 p-1 bg-white border border-slate-200 rounded-full shadow-xs">
            {(['All', 'Sarees', 'Lehengas', 'Salwar Suits'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                  activeTab === tab
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-black hover:bg-slate-100'
                }`}
              >
                {tab === 'All' ? 'All Collections' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loadingProducts ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-slate-200 p-3 space-y-3">
                <div className="aspect-[3/4] bg-slate-200 rounded-md" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {newArrivals.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 text-xs">
            No new products found in {activeTab}.
          </div>
        )}

        {/* Bottom Call to Action */}
        <div className="text-center mt-10 sm:mt-12">
          <Link
            to={activeTab === 'All' ? '/products?sort=newest' : `/products?category=${encodeURIComponent(activeTab)}`}
            className="inline-flex items-center gap-2 border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-xs transition-all duration-300 shadow-xs hover:shadow-md"
          >
            <span>VIEW ALL {activeTab.toUpperCase()} NEW ARRIVALS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
