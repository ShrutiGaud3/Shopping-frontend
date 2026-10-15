import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Smartphone, Banknote, ArrowRight, Tag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Checkout: React.FC = () => {
  const { cart, placeOrder, user, appliedCoupon, availableCoupons, validateCoupon, removeCoupon } = useShop();
  const [couponCode, setCouponCode] = useState('');
  const [validating, setValidating] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: user?.email || '',
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'UPI' as 'COD' | 'UPI' | 'Card'
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || ''
      }));
    }
  }, [user]);

  const cartTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingFee = cartTotal > 999 ? 0 : 99;
  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const grandTotal = Math.max(0, cartTotal - couponDiscount + shippingFee);

  const [submitting, setSubmitting] = useState(false);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await placeOrder(
      {
        fullName: formData.fullName,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        phone: formData.phone
      },
      formData.paymentMethod
    );
    setSubmitting(false);
    navigate('/orders');
  };

  if (cart.length === 0) {
    return (
      <div className="py-16 text-center">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">No items in bag to checkout</h2>
        <Link to="/products" className="text-blue-600 font-semibold hover:underline">
          Return to store &gt;
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen py-8 md:py-12 text-left">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
          Checkout
        </h1>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Checkout Form Column */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Section 1: Contact Information */}
            <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-xs">
              <h3 className="font-serif font-bold text-lg text-gray-900 mb-4 pb-2 border-b border-gray-100">
                1. Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Simran Gaud"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. simran@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Shipping Address */}
            <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-xs">
              <h3 className="font-serif font-bold text-lg text-gray-900 mb-4 pb-2 border-b border-gray-100">
                2. Shipping Address
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="sm:col-span-3">
                  <label className="block font-semibold text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat 302, Sunrise Apartments, M.G. Road"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maharashtra"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">PIN Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 400001"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Payment Method Selection */}
            <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-xs">
              <h3 className="font-serif font-bold text-lg text-gray-900 mb-4 pb-2 border-b border-gray-100">
                3. Payment Method
              </h3>
              <div className="space-y-3">
                
                <label className={`flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-all ${formData.paymentMethod === 'UPI' ? 'border-gray-900 bg-gray-50/80 ring-1 ring-gray-900' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={formData.paymentMethod === 'UPI'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'UPI' })}
                      className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-0"
                    />
                    <div>
                      <span className="font-bold text-xs text-gray-900 block">UPI / Instant Online Payment</span>
                      <span className="text-[11px] text-gray-500">Google Pay, PhonePe, Paytm, BHIM</span>
                    </div>
                  </div>
                  <Smartphone className="w-5 h-5 text-gray-600" />
                </label>

                <label className={`flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-all ${formData.paymentMethod === 'Card' ? 'border-gray-900 bg-gray-50/80 ring-1 ring-gray-900' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={formData.paymentMethod === 'Card'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'Card' })}
                      className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-0"
                    />
                    <div>
                      <span className="font-bold text-xs text-gray-900 block">Credit / Debit Card</span>
                      <span className="text-[11px] text-gray-500">Visa, Mastercard, RuPay, Amex</span>
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-gray-600" />
                </label>

                <label className={`flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-all ${formData.paymentMethod === 'COD' ? 'border-gray-900 bg-gray-50/80 ring-1 ring-gray-900' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={formData.paymentMethod === 'COD'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                      className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-0"
                    />
                    <div>
                      <span className="font-bold text-xs text-gray-900 block">Cash on Delivery (COD)</span>
                      <span className="text-[11px] text-gray-500">Pay cash upon parcel arrival</span>
                    </div>
                  </div>
                  <Banknote className="w-5 h-5 text-gray-600" />
                </label>

              </div>
            </div>

          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-xs sticky top-24">
              <h3 className="font-serif font-bold text-lg text-gray-900 pb-3 mb-4 border-b border-gray-100">
                Order Summary ({cart.length} items)
              </h3>

              {/* Items Preview */}
              <div className="space-y-3 mb-6 max-h-48 overflow-y-auto no-scrollbar">
                {cart.map((item, i) => (
                  <div key={i} className="flex gap-3 text-xs">
                    <img src={item.product.image} alt={item.product.name} className="w-12 h-14 object-cover rounded-xs" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 line-clamp-1">{item.product.name}</p>
                      <p className="text-gray-400">Qty: {item.quantity} | Size: {item.selectedSize}</p>
                      <p className="font-bold text-gray-900 mt-0.5">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code & Available Coupons Widget */}
              <div className="mb-6 pt-3 border-t border-gray-100">
                {appliedCoupon ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-sm flex items-center justify-between">
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
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter promo code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 bg-gray-50 border border-gray-300 rounded-sm px-3 py-2 text-xs uppercase font-medium focus:outline-none focus:border-gray-900"
                      />
                      <button
                        type="button"
                        disabled={validating}
                        onClick={async () => {
                          if (!couponCode) return;
                          setValidating(true);
                          await validateCoupon(couponCode, cartTotal);
                          setValidating(false);
                        }}
                        className="bg-gray-900 text-white px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
                      >
                        {validating ? '...' : 'Apply'}
                      </button>
                    </div>

                    {/* Available Promo Offers List */}
                    {availableCoupons && availableCoupons.length > 0 && (
                      <div className="p-3 bg-gradient-to-r from-amber-50/90 to-amber-100/40 border border-amber-200 rounded-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1 uppercase tracking-wider">
                            <Tag className="w-3.5 h-3.5 text-amber-700" /> Applicable Promo Codes
                          </span>
                        </div>

                        <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
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
                                    await validateCoupon(codeStr, cartTotal);
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
              </div>

              <div className="space-y-2 text-xs text-gray-600 mb-6 pt-3 border-t border-gray-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount ({appliedCoupon.code})</span>
                    <span>-₹{appliedCoupon.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                </div>
                <hr className="border-gray-100 pt-1" />
                <div className="flex justify-between text-sm font-bold text-gray-900">
                  <span>Total Payable</span>
                  <span>₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gray-900 text-white font-semibold text-xs py-3.5 px-4 uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors rounded-sm shadow-md disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'PROCESSING ORDER...' : 'CONFIRM ORDER'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
