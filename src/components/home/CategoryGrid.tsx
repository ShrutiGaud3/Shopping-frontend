import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { ArrowRight } from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  const { categories } = useShop();

  const getCategoryLink = (cat: any) => {
    const catName = cat.name ? String(cat.name).trim() : '';
    return `/products?category=${encodeURIComponent(catName)}`;
  };

  return (
    <section className="py-12 md:py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-8 text-left">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Shop by Categories
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Explore curated styles categorized for seamless shopping
          </p>
        </div>

        {/* Masonry-Style Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={getCategoryLink(category)}
              className="group relative aspect-[4/5] rounded-sm overflow-hidden bg-gray-100 block shadow-xs border border-gray-200"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
              
              <div className="absolute inset-x-0 bottom-0 p-5 text-white flex items-end justify-between">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold mb-1 tracking-tight">
                    {category.name}
                  </h3>
                  <span className="text-xs text-gray-300 font-light">
                    {category.itemCount || 150}+ Items
                  </span>
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-white group-hover:translate-x-1 transition-transform">
                  Explore <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
