import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../product/ProductCard';

export const TrendingNow: React.FC = () => {
  const { products } = useShop();
  const scrollRef = useRef<HTMLDivElement>(null);

  const trendingProducts = products.filter((p) => p.isTrending);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 md:py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Trending Now
            </h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Styles everyone is talking about
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll('left')}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Product Track */}
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 w-full"
        >
          {trendingProducts.map((product) => (
            <div
              key={product.id}
              className="w-[180px] sm:w-[220px] md:w-[260px] lg:w-[280px] shrink-0"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
