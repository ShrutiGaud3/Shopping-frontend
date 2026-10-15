import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../product/ProductCard';

export const NewArrivals: React.FC = () => {
  const { products } = useShop();
  const newArrivals = products.slice(0, 8);

  return (
    <section className="py-12 md:py-16 bg-gray-50/50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              New Arrivals
            </h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Fresh additions dropped this week for your seasonal wardrobe
            </p>
          </div>
          <Link
            to="/products?sort=newest"
            className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-900 hover:text-gray-600 hover:border-gray-600 transition-colors pb-0.5"
          >
            VIEW ALL
          </Link>
        </div>

        {/* 8 Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="text-center sm:hidden">
          <Link
            to="/products?sort=newest"
            className="inline-block border border-gray-900 text-gray-900 px-8 py-3 text-xs font-semibold uppercase tracking-wider"
          >
            VIEW ALL PRODUCTS
          </Link>
        </div>

      </div>
    </section>
  );
};
