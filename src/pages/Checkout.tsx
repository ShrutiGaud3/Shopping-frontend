import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  Smartphone,
  Banknote,
  ArrowRight,
  Tag,
  Globe,
  ShieldCheck,
  Truck,
  Sparkles,
  Scissors
} from 'lucide-react';

import { useShop } from '../context/ShopContext';
import { useSettings } from '../context/SettingsContext';

export const Checkout: React.FC = () => {
  const {
    cart,
    placeOrder,
    user,
    appliedCoupon,
    availableCoupons,
    validateCoupon,
    removeCoupon,
    shippingZones,
    showToast
  } = useShop();

  const { settings } = useSettings();
  const navigate = useNavigate();

  // Enforce customer authentication for checkout
  useEffect(() => {
    if (!user) {
      showToast('Please sign in to proceed with checkout ✨');
      navigate('/login?redirect=/checkout', { replace: true });
    }
  }, [user, navigate]);

  const [couponCode, setCouponCode] = useState('');
  const [validating, setValidating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [autoAppliedPrepaid, setAutoAppliedPrepaid] = useState(false);

  const [formData, setFormData] = useState({
    email: user?.email || '',
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
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

  // Calculations
  const itemsSubtotal = cart.reduce((acc, item) => {
    const stitchCost = item.selectedStitchOption?.price || 0;
    return acc + (item.product.price + stitchCost) * item.quantity;
  }, 0);

  const stitchingTotal = cart.reduce((acc, item) => {
    return acc + (item.selectedStitchOption?.price || 0) * item.quantity;
  }, 0);

  // Dynamic Shipping Zone based on selected country
  const currentZone = shippingZones.find(
    (z) => z.country.toLowerCase() === formData.country.toLowerCase()
  );

  let shippingFee = 0;
  let estimatedDays = '3-5 Business Days';

  if (currentZone) {
    estimatedDays = currentZone.estimatedDays || estimatedDays;
    if (currentZone.freeAbove > 0 && itemsSubtotal >= currentZone.freeAbove) {
      shippingFee = 0;
    } else {
      shippingFee = currentZone.charge;
    }
  } else {
    // Default fallback to settings
    const freeThresh = settings?.shipping?.freeShippingThreshold !== undefined ? settings.shipping.freeShippingThreshold : 999;
    const stdFee = settings?.shipping?.standardFee !== undefined ? settings.shipping.standardFee : 99;
    shippingFee = itemsSubtotal >= freeThresh ? 0 : stdFee;
  }

  // COD extra fee
  const isCod = formData.paymentMethod === 'COD';
  const codExtraFee = isCod ? (settings?.cod?.extraFee !== undefined ? settings.cod.extraFee : 50) : 0;

  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const grandTotal = Math.max(0, itemsSubtotal - couponDiscount + shippingFee + codExtraFee);

  // Handle Payment Method Switch & Auto-apply PREPAID10
  const handlePaymentMethodChange = async (method: 'COD' | 'UPI' | 'Card') => {
    setFormData((prev) => ({ ...prev, paymentMethod: method }));

    if (method === 'COD') {
      if (appliedCoupon && appliedCoupon.code.toUpperCase() === 'PREPAID10') {
        removeCoupon();
        setAutoAppliedPrepaid(false);
      }
    } else {
      // Switching to Prepaid: auto-apply PREPAID10 if no coupon is active
      if (!appliedCoupon) {
        setValidating(true);
        const res = await validateCoupon('PREPAID10', itemsSubtotal, method);
        if (res.success) {
          setAutoAppliedPrepaid(true);
        }
        setValidating(false);
      }
    }
  };

  // Initial Auto-apply PREPAID10 on mount if user chooses UPI/Card
  useEffect(() => {
    if (!appliedCoupon && formData.paymentMethod !== 'COD' && itemsSubtotal > 0) {
      validateCoupon('PREPAID10', itemsSubtotal, formData.paymentMethod).then((res) => {
        if (res.success) setAutoAppliedPrepaid(true);
      });
    }
  }, [itemsSubtotal]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Please sign in to place an order ✨');
      navigate('/login?redirect=/checkout');
      return;
    }
    if (cart.length === 0) return;

    setSubmitting(true);
    try {
      const createdOrder = await placeOrder(
        {
          fullName: formData.fullName,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          phone: formData.phone,
          country: formData.country
        },
        formData.paymentMethod
      );

      const redirectId = createdOrder.id || createdOrder.orderId || (createdOrder as any)._id;
      navigate(`/order-success/${redirectId}`);
    } catch (err) {
      console.error('Checkout submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="py-20 text-center bg-gray-50/50 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4 border border-amber-200">
          <ShieldCheck className="w-8 h-8 text-amber-700" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
        <p className="text-xs text-gray-500 max-w-sm mb-6">Please sign in to your Weavera customer account to complete checkout and place your order.</p>
        <Link
          to="/login?redirect=/checkout"
          className="bg-gray-900 text-white font-semibold text-xs px-8 py-3 uppercase tracking-widest rounded-xs hover:bg-black transition shadow-md"
        >
          Sign In to Continue &gt;
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center bg-gray-50/50 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4 border border-amber-200">
          <Tag className="w-8 h-8 text-amber-700" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-gray-500 max-w-sm mb-6">Explore our handcrafted sarees, designer lehengas, and festive ethnic wear.</p>
        <Link
          to="/products"
          className="bg-gray-900 text-white font-semibold text-xs px-8 py-3 uppercase tracking-widest rounded-xs hover:bg-black transition shadow-md"
        >
          Explore Catalog &gt;
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen py-8 md:py-12 text-left font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-gray-200 gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 tracking-wide">
              Secure Checkout
            </h1>
            <p className="text-xs text-gray-500 mt-1">Review your shipping details, select express delivery zone & payment method</p>
          </div>

          <div className="flex items-center gap-3 text-xs text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-sm border border-emerald-200 self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">256-Bit SSL Encrypted &amp; 10-Day Easy Exchange</span>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Checkout Form Column */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Section 1: Contact Information */}
            <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-xs">
              <h3 className="font-serif font-bold text-base text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                <span>1. Contact Information</span>
                <span className="text-[11px] font-sans font-normal text-gray-500">Receipt &amp; tracking updates</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Sharma"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-900 transition"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. ananya@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-900 transition"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-gray-700 mb-1">Phone Number (For Courier OTP &amp; Tracking) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-900 transition"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Shipping Destination & Zone */}
            <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                <h3 className="font-serif font-bold text-base text-gray-900 flex items-center gap-2">
                  <span>2. Delivery Destination &amp; Address</span>
                </h3>
                <span className="text-[11px] text-gray-500 flex items-center gap-1 font-sans">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" /> Est: {estimatedDays}
                </span>
              </div>

              {/* Country / Shipping Zone Selector */}
              <div className="mb-4 p-3.5 bg-amber-50/70 border border-amber-200 rounded-sm">
                <label className="block font-bold text-xs text-amber-950 mb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-amber-700" /> Select Shipping Country / International Zone
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-white border border-amber-300 rounded-sm px-3 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                  >
                    {shippingZones.length > 0 ? (
                      shippingZones.map((z) => (
                        <option key={z.country} value={z.country}>
                          {z.country} ({z.charge === 0 ? 'FREE Shipping' : `₹${z.charge}`} {z.freeAbove > 0 ? `| Free above ₹${z.freeAbove}` : ''})
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="India">India (Domestic Express)</option>
                        <option value="United States">United States (USA Zone)</option>
                        <option value="United Kingdom">United Kingdom (UK Zone)</option>
                        <option value="United Arab Emirates">United Arab Emirates (UAE)</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                      </>
                    )}
                  </select>

                  <div className="text-[11px] text-amber-900 flex items-center gap-1.5 bg-white/70 px-3 py-2 rounded-xs border border-amber-200/80">
                    <Truck className="w-4 h-4 text-amber-700 shrink-0" />
                    <div>
                      <span className="font-bold">Shipping Rate:</span> {shippingFee === 0 ? 'FREE DELIVERY' : `₹${shippingFee}`}
                      <span className="text-gray-500 block">Transit Speed: {estimatedDays}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="sm:col-span-3">
                  <label className="block font-semibold text-gray-700 mb-1">Street Address, House/Flat No, Landmark *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat 402, Royal Palms, Ring Road"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-900 transition"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-900 transition"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">State / Province *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gujarat"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-900 transition"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Postal / PIN Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 395002"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-900 transition"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Payment Method Selection */}
            <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                <h3 className="font-serif font-bold text-base text-gray-900">
                  3. Payment Method
                </h3>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Auto 10% OFF on Prepaid
                </span>
              </div>

              <div className="space-y-3">
                
                {/* UPI Option */}
                <label className={`flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-all ${formData.paymentMethod === 'UPI' ? 'border-gray-900 bg-gray-50/90 ring-1 ring-gray-900' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={formData.paymentMethod === 'UPI'}
                      onChange={() => handlePaymentMethodChange('UPI')}
                      className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-900">UPI / QR / Instant Online Payment</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-xs">
                          10% OFF applied
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-500">Google Pay, PhonePe, Paytm, BHIM, Cred UPI</span>
                    </div>
                  </div>
                  <Smartphone className="w-5 h-5 text-gray-700" />
                </label>

                {/* Card Option */}
                <label className={`flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-all ${formData.paymentMethod === 'Card' ? 'border-gray-900 bg-gray-50/90 ring-1 ring-gray-900' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={formData.paymentMethod === 'Card'}
                      onChange={() => handlePaymentMethodChange('Card')}
                      className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-900">Credit / Debit Card / Net Banking</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-xs">
                          10% OFF applied
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-500">Visa, Mastercard, RuPay, Amex, Major Banks</span>
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-gray-700" />
                </label>

                {/* COD Option */}
                <label className={`flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-all ${formData.paymentMethod === 'COD' ? 'border-gray-900 bg-gray-50/90 ring-1 ring-gray-900' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={formData.paymentMethod === 'COD'}
                      onChange={() => handlePaymentMethodChange('COD')}
                      className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-0"
                    />
                    <div>
                      <span className="font-bold text-xs text-gray-900 block">Cash on Delivery (COD)</span>
                      <span className="text-[11px] text-gray-500">
                        Pay cash upon arrival {codExtraFee > 0 ? `(Handling Fee: ₹${codExtraFee})` : ''}
                      </span>
                    </div>
                  </div>
                  <Banknote className="w-5 h-5 text-gray-700" />
                </label>

              </div>

              {/* Informational Prepaid Banner */}
              {formData.paymentMethod !== 'COD' && (
                <div className="mt-4 p-3 bg-emerald-50/70 border border-emerald-200 rounded-sm flex items-center gap-2.5 text-xs text-emerald-800">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Prepaid Advantage:</strong> By choosing Online/UPI, you get faster dispatch + instant 10% discount on order value!
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-xs sticky top-24">
              <h3 className="font-serif font-bold text-base text-gray-900 pb-3 mb-4 border-b border-gray-100 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs font-sans font-normal text-gray-500">({cart.length} items)</span>
              </h3>

              {/* Items Preview */}
              <div className="space-y-3 mb-6 max-h-56 overflow-y-auto no-scrollbar pr-1 divide-y divide-gray-100">
                {cart.map((item, i) => {
                  const stitch = item.selectedStitchOption;
                  const itemTotal = (item.product.price + (stitch?.price || 0)) * item.quantity;
                  return (
                    <div key={i} className="pt-2 first:pt-0 flex gap-3 text-xs">
                      <img src={item.product.image} alt={item.product.name} className="w-12 h-14 object-cover rounded-xs border border-gray-100 shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 line-clamp-1">{item.product.name}</p>
                        <p className="text-gray-400 text-[11px]">Qty: {item.quantity} | Size: {item.selectedSize}</p>
                        {stitch && stitch.price > 0 && (
                          <p className="text-amber-800 text-[10px] font-semibold flex items-center gap-1 mt-0.5">
                            <Scissors className="w-2.5 h-2.5 text-amber-700" /> +{stitch.type} (+₹{stitch.price})
                          </p>
                        )}
                        <p className="font-bold text-gray-900 mt-0.5">₹{itemTotal.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Promo Code & Available Coupons Widget */}
              <div className="mb-6 pt-3 border-t border-gray-100">
                {appliedCoupon ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-sm flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-emerald-900 uppercase tracking-wider font-mono">
                          {appliedCoupon.code}
                        </span>
                        {autoAppliedPrepaid && (
                          <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1 py-0.2 rounded-xs font-bold uppercase">
                            Auto Prepaid
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-emerald-700 font-medium">Saved ₹{appliedCoupon.discount}!</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        removeCoupon();
                        setAutoAppliedPrepaid(false);
                      }}
                      className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
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
                          if (!couponCode.trim()) return;
                          setValidating(true);
                          await validateCoupon(couponCode, itemsSubtotal, formData.paymentMethod);
                          setValidating(false);
                        }}
                        className="bg-gray-900 text-white px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-black disabled:opacity-50 cursor-pointer"
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
                            const discountStr = (c.type === 'percent' || c.discountType === 'percentage')
                              ? `${c.value || c.discountValue}% OFF`
                              : `₹${c.value || c.discountValue} OFF`;
                            const minOrderMsg = (c.minOrder || c.minimumOrderValue)
                              ? `Min order ₹${c.minOrder || c.minimumOrderValue}`
                              : 'No min order';

                            const isPrepaidOnly = c.paymentMethod === 'prepaid';

                            return (
                              <div key={codeStr} className="bg-white p-2 rounded-xs border border-amber-200/80 flex items-center justify-between text-xs shadow-2xs">
                                <div>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-bold text-gray-900 font-mono text-[11px] tracking-wider bg-gray-100 px-1.5 py-0.5 rounded-xs border border-gray-200">
                                      {codeStr}
                                    </span>
                                    <span className="font-bold text-emerald-700 text-[11px]">
                                      {discountStr}
                                    </span>
                                    {isPrepaidOnly && (
                                      <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1 py-0.2 rounded-xs">
                                        Prepaid Only
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-gray-500 mt-0.5">{minOrderMsg}</p>
                                </div>

                                <button
                                  type="button"
                                  onClick={async () => {
                                    setCouponCode(codeStr);
                                    setValidating(true);
                                    await validateCoupon(codeStr, itemsSubtotal, formData.paymentMethod);
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

              {/* Bill Details Breakdown */}
              <div className="space-y-2 text-xs text-gray-600 mb-6 pt-3 border-t border-gray-100">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span>₹{itemsSubtotal.toLocaleString('en-IN')}</span>
                </div>
                {stitchingTotal > 0 && (
                  <div className="flex justify-between text-amber-900">
                    <span>Custom Stitching Charges</span>
                    <span>+₹{stitchingTotal.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Savings ({appliedCoupon.code})</span>
                    <span>-₹{appliedCoupon.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee ({formData.country})</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shippingFee}`}</span>
                </div>
                {isCod && codExtraFee > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Cash on Delivery Handling Charge</span>
                    <span>+₹{codExtraFee}</span>
                  </div>
                )}
                <hr className="border-gray-100 pt-1" />
                <div className="flex justify-between text-sm font-bold text-gray-900">
                  <span>Total Payable</span>
                  <span className="text-base text-gray-950 font-serif">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gray-900 text-white font-semibold text-xs py-3.5 px-4 uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-colors rounded-sm shadow-md disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'PLACING SECURE ORDER...' : 'CONFIRM & PLACE ORDER'} <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center gap-4 text-[10px] text-gray-400">
                <span>✓ 10-Day Exchange</span>
                <span>•</span>
                <span>✓ Verified Artisan Wear</span>
                <span>•</span>
                <span>✓ Fast Dispatch</span>
              </div>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
