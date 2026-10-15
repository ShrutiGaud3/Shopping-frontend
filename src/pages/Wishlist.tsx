import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/product/ProductCard';

export const Wishlist: React.FC = () => {
  const { wishlist, products } = useShop();

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="bg-white min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="border-b border-gray-200 pb-4 mb-8">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            My Wishlist <span className="text-sm font-sans font-normal text-gray-500">({savedProducts.length} items)</span>
          </h1>
        </div>

        {savedProducts.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-xs text-gray-500 max-w-xs mx-auto mb-6">
              Save your favorite fashion pieces here to track prices or buy later.
            </p>
            <Link
              to="/products"
              className="inline-block bg-gray-900 text-white font-semibold text-xs px-8 py-3 uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              START SHOPPING
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {savedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
