import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Heart, Tag, MessageCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { getWhatsAppCartUrl, openWhatsApp } from '../utils/whatsapp';

export const Cart: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    toggleWishlist,
    appliedCoupon,
    availableCoupons,
    validateCoupon,
    removeCoupon
  } = useShop();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [validating, setValidating] = useState(false);

  const subtotal = cart.reduce(
    (acc, item) => acc + (item.product.originalPrice + (item.selectedStitchOption?.price || 0)) * item.quantity,
    0
  );
  const totalSavings = cart.reduce(
    (acc, item) => acc + (item.product.originalPrice - item.product.price) * item.quantity,
    0
  );
  const cartTotal = subtotal - totalSavings;
  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const shippingFee = cartTotal > 999 || cart.length === 0 ? 0 : 99;
  const finalTotal = Math.max(0, cartTotal - couponDiscount + shippingFee);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setValidating(true);
    await validateCoupon(couponCode.trim(), cartTotal);
    setValidating(false);
    setCouponCode('');
  };

  if (cart.length === 0) {
    return (
      <div className="bg-white min-h-[60vh] flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Your Shopping Bag is empty
        </h2>
        <p className="text-xs md:text-sm text-gray-500 max-w-sm mb-6">
          Explore our new arrivals and find your next favorite fashion statement.
        </p>
        <Link
          to="/products"
          className="bg-gray-900 text-white font-semibold text-xs md:text-sm px-8 py-3 uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-sm rounded-sm"
        >
          START SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
          Shopping Bag ({cart.length} {cart.length === 1 ? 'item' : 'items'})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Cart Items List Column */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item, idx) => (
              <div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${idx}`}
                className="bg-white p-4 sm:p-5 border border-gray-200 rounded-sm flex gap-4 sm:gap-6 items-center"
              >
                {/* Thumbnail */}
                <Link to={`/product/${item.product.id}`} className="w-20 h-24 sm:w-24 sm:h-32 shrink-0 bg-gray-100 rounded-xs overflow-hidden block">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </Link>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between self-stretch text-left">
                  <div>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block">
                      {item.product.brand}
                    </span>
                    <Link to={`/product/${item.product.id}`} className="font-medium text-sm text-gray-900 hover:text-black line-clamp-1">
                      {item.product.name}
                    </Link>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                      <span>Size: <strong className="text-gray-800">{item.selectedSize}</strong></span>
                      <span>Color: <strong className="text-gray-800">{item.selectedColor}</strong></span>
                      {item.selectedStitchOption && (
                        <span className="bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded-xs text-[10px] font-semibold">
                          🧵 {item.selectedStitchOption.type} {item.selectedStitchOption.price > 0 ? `(+₹${item.selectedStitchOption.price})` : '(Included)'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls & Prices */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-gray-300 rounded-sm">
                        <button
                          onClick={() =>
                            updateCartQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)
                          }
                          className="p-1.5 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateCartQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)
                          }
                          disabled={item.quantity >= (item.product.stock !== undefined ? item.product.stock : 25)}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                          aria-label="Increase quantity"
                          title={item.quantity >= (item.product.stock !== undefined ? item.product.stock : 25) ? `Only ${item.product.stock} available in stock` : ''}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.quantity >= (item.product.stock !== undefined ? item.product.stock : 25) && (
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-xs border border-amber-200 font-semibold">
                          Max Stock Limit ({item.product.stock})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">
                        ₹{((item.product.price + (item.selectedStitchOption?.price || 0)) * item.quantity).toLocaleString()}
                      </span>
                      {item.product.originalPrice > item.product.price && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{((item.product.originalPrice + (item.selectedStitchOption?.price || 0)) * item.quantity).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Remove & Wishlist Action Column */}
                <div className="flex flex-col gap-2 border-l border-gray-100 pl-3">
                  <button
                    onClick={() => toggleWishlist(item.product.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    title="Save to Wishlist"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                    className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-xs sticky top-24 text-left">
              <h3 className="font-serif font-bold text-lg text-gray-900 pb-3 mb-4 border-b border-gray-100">
                Order Summary
              </h3>

              {/* Promo Code Input or Applied Coupon Badge */}
              {appliedCoupon ? (
                <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-sm flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-emerald-800 uppercase tracking-wider block">
                      Code: {appliedCoupon.code}
                    </span>
                    <span className="text-[11px] text-emerald-600">Saved ₹{appliedCoupon.discount}!</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="mb-6 space-y-3">
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-gray-50 border border-gray-300 rounded-sm px-3 py-2 text-xs uppercase font-medium focus:outline-none focus:border-gray-900"
                    />
                    <button
                      type="submit"
                      disabled={validating}
                      className="bg-gray-900 text-white px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
                    >
                      {validating ? '...' : 'Apply'}
                    </button>
                  </form>

                  {/* Available Promo Offers Widget */}
                  {availableCoupons && availableCoupons.length > 0 && (
                    <div className="p-3 bg-gradient-to-r from-amber-50/90 to-amber-100/40 border border-amber-200 rounded-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1 uppercase tracking-wider">
                          <Tag className="w-3.5 h-3.5 text-amber-700" /> Available Offers
                        </span>
                        <span className="text-[10px] text-amber-800 font-semibold bg-amber-200/60 px-1.5 py-0.5 rounded-xs">
                          {availableCoupons.length} Promo Codes
                        </span>
                      </div>

                      <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                        {availableCoupons.map((c) => {
                          const codeStr = c.code;
                          const discountStr = c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`;
                          const minOrderMsg = c.minimumOrderValue ? `Min order ₹${c.minimumOrderValue}` : 'No min order';

                          return (
                            <div key={codeStr} className="bg-white p-2 rounded-xs border border-amber-200/80 flex items-center justify-between text-xs shadow-2xs">
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-gray-900 font-mono text-[11px] tracking-wider bg-gray-100 px-1.5 py-0.5 rounded-xs border border-gray-200">
                                    {codeStr}
                                  </span>
                                  <span className="font-bold text-emerald-700 text-[11px]">
                                    {discountStr}
                                  </span>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-0.5">{minOrderMsg}</p>
                              </div>

                              <button
                                type="button"
                                onClick={async () => {
                                  setCouponCode(codeStr);
                                  setValidating(true);
                                  await validateCoupon(codeStr, subtotal);
                                  setValidating(false);
                                }}
                                className="bg-gray-900 hover:bg-black text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xs transition-colors cursor-pointer"
                              >
                                Apply
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Price Calculation Breakdown */}
              <div className="space-y-3 text-xs text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Total MRP</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Discount on MRP</span>
                  <span>-₹{totalSavings.toLocaleString()}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount ({appliedCoupon.code})</span>
                    <span>-₹{appliedCoupon.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-700 font-semibold">FREE</strong> : `₹${shippingFee}`}</span>
                </div>
                <hr className="border-gray-100 pt-1" />
                <div className="flex justify-between text-sm font-bold text-gray-900 pt-1">
                  <span>Total Amount</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-gray-900 text-white font-semibold text-xs py-3.5 px-4 uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-sm rounded-sm cursor-pointer"
              >
                PROCEED TO CHECKOUT <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => openWhatsApp(getWhatsAppCartUrl(cart, finalTotal))}
                className="w-full bg-emerald-600 text-white font-bold text-xs py-3 px-4 uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm rounded-sm cursor-pointer mt-2.5"
              >
                <MessageCircle className="w-4 h-4" /> ORDER BAG VIA WHATSAPP
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-gray-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Secure Checkout Guarantee</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
