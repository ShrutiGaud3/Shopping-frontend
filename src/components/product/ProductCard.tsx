import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, AlertCircle } from 'lucide-react';
import type { Product } from '../../types';
import { useShop } from '../../context/ShopContext';
import { Rating } from './Rating';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist, addToCart } = useShop();
  const navigate = useNavigate();
  const isSaved = isInWishlist(product.id);
  const isOutOfStock = product.stock === 0;

  return (
    <div className="group relative flex flex-col bg-white rounded-none transition-all duration-300 border border-gray-100/60 hover:border-gray-200">
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className={`h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 ${
              isOutOfStock ? 'grayscale opacity-80' : ''
            }`}
          />
        </Link>

        {/* Out of Stock Top Badge */}
        {isOutOfStock && (
          <div className="absolute top-2.5 left-2.5 z-10 bg-red-600 text-white font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-xs shadow-sm flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Out of Stock
          </div>
        )}

        {/* Floating Wishlist Heart */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label="Add to Wishlist"
          className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-xs text-gray-700 transition-all hover:bg-white hover:scale-110 shadow-sm"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'
            }`}
          />
        </button>

        {/* Quick Add Button Overlay (Desktop Card Hover) */}
        <div className="hidden sm:flex absolute inset-x-0 bottom-0 p-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-t from-black/75 via-black/40 to-transparent justify-center pointer-events-auto">
          {isOutOfStock ? (
            <button
              disabled
              className="w-full bg-gray-300 text-gray-700 font-bold text-xs py-2.5 px-4 uppercase tracking-wider flex items-center justify-center gap-2 cursor-not-allowed opacity-95 shadow-md rounded-xs"
            >
              Out of Stock
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product);
                navigate('/cart');
              }}
              className="w-full bg-[#183812] text-white hover:bg-[#0E250A] font-bold text-xs py-2.5 px-4 uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-xl cursor-pointer rounded-xs active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#BEDAA9]" />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="p-2.5 sm:p-3 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand & Rating Row */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
              {product.brand}
            </span>
            <Rating value={product.rating} count={product.reviewsCount} showCount={false} />
          </div>

          {/* Product Title */}
          <Link
            to={`/product/${product.id}`}
            className="block text-xs md:text-sm font-normal text-gray-800 hover:text-black line-clamp-1 mb-1.5 transition-colors"
          >
            {product.name}
          </Link>
        </div>

        {/* Pricing Breakdown */}
        <div>
          <div className="flex items-center gap-2 flex-wrap pt-0.5">
            <span className="text-sm font-bold text-gray-900">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
                <span className="badge-discount">
                  ({product.discountPercent}% off)
                </span>
              </>
            )}
          </div>

          {/* Mobile Quick Add Action Button (Always Accessible on Touchscreens) */}
          <div className="pt-2 sm:hidden">
            {isOutOfStock ? (
              <button
                disabled
                className="w-full bg-slate-200 text-slate-500 font-bold text-[11px] py-1.5 px-2 uppercase rounded-xs flex items-center justify-center gap-1 cursor-not-allowed"
              >
                Out of Stock
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToCart(product);
                  navigate('/cart');
                }}
                className="w-full bg-[#183812] text-white active:bg-[#0E250A] font-bold text-[11px] py-2 px-2 uppercase tracking-wider rounded-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-3 h-3 text-[#BEDAA9]" />
                <span>Add to Cart</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
