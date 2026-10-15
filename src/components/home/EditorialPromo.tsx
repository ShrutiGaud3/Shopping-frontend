import React from 'react';
import { Link } from 'react-router-dom';

export const EditorialPromo: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Split Editorial Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gray-50 rounded-sm overflow-hidden p-6 md:p-12">
          
          {/* Image */}
          <div className="aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-sm">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80"
              alt="Editorial Collection"
              className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Editorial Content */}
          <div className="flex flex-col items-start justify-center p-4 md:p-8">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-gray-500 mb-3">
              NEW COLLECTION
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Modern Silhouettes.<br />Timeless Style.
            </h2>
            <p className="text-xs md:text-sm text-gray-600 mb-6 max-w-md leading-relaxed">
              Curated tailoring and breathable luxury fabrics engineered for effortless everyday sophistication.
            </p>
            <div className="text-xl md:text-2xl font-serif italic text-gray-900 font-semibold mb-8">
              UP TO 50% OFF
            </div>
            <Link
              to="/products"
              className="inline-block border border-gray-900 bg-gray-900 text-white px-8 py-3 text-xs md:text-sm font-semibold uppercase tracking-widest hover:bg-white hover:text-gray-900 transition-all duration-300 shadow-sm"
            >
              EXPLORE COLLECTION
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};
