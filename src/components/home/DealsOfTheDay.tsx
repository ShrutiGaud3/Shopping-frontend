import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';

export const DealsOfTheDay: React.FC = () => {
  const { products } = useShop();
  const dealProducts = products.filter((p) => p.isDeal).slice(0, 4);

  return (
    <section className="py-12 md:py-16 bg-gray-50/70 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="mb-8 text-left">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Deals of the Day
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Handpicked limited-time steals you cannot miss
          </p>
        </div>

        {/* Product Cards Grid (Matching Reference Image 1) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {dealProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200/80 rounded-sm overflow-hidden flex flex-col items-center p-3 transition-all hover:shadow-md group"
            >
              {/* Product Image */}
              <div className="w-full aspect-[3/4] overflow-hidden rounded-xs bg-gray-100 mb-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Red Emblem Brand Badge (Matching Reference Image 1) */}
              <div className="bg-[#C41E3A] text-white text-[11px] font-bold tracking-widest uppercase px-3 py-1 mb-2 rounded-xs">
                VELORA
              </div>

              {/* Tag & Subtitle */}
              <h3 className="font-serif font-bold text-sm md:text-base text-gray-900 mb-1">
                {product.dealTag || 'Best of Styles'}
              </h3>
              <p className="text-xs text-gray-500 font-medium mb-3">
                {product.name}
              </p>

              {/* Price Callout */}
              <div className="mt-auto flex items-center gap-2 mb-3">
                <span className="text-sm font-bold text-gray-900">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              </div>

              {/* Explore Button */}
              <Link
                to={`/product/${product.id}`}
                className="w-full py-1.5 px-3 border border-gray-300 text-xs font-semibold text-gray-800 text-center uppercase tracking-wider hover:bg-gray-900 hover:text-white transition-colors"
              >
                Explore
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
