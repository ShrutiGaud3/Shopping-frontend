import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../product/ProductCard';

export const TrendingSection: React.FC = () => {
  const { products, loadingProducts } = useShop();

  // Get products marked trending or highest rated
  const trendingProducts = products
    .filter((p) => p.isTrending || p.rating >= 4.5)
    .slice(0, 8);

  const displayList = trendingProducts.length > 0 ? trendingProducts : products.slice(0, 8);

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (House of Indya Signature Style) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4 pb-2 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4 fill-rose-600 text-rose-600" />
              <span>Trending Right Now</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-[0.15em] text-slate-900">
              TRENDING RIGHT NOW
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Celebrity drapes, bridal favorites &amp; viral festive hits flying off our Surat looms
            </p>
          </div>

          <Link
            to="/products?sort=recommended"
            className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 uppercase tracking-widest group shrink-0 transition"
          >
            <span>View All Trending</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Product Grid */}
        {loadingProducts ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-50 rounded-lg p-3 space-y-3">
                <div className="aspect-[3/4] bg-slate-200 rounded-md" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {displayList.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
