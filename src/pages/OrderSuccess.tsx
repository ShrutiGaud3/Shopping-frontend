import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  MessageCircle,
  Copy,
  Check,
  Loader2
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { useShop } from '../context/ShopContext';
import { useSettings } from '../context/SettingsContext';
import type { Order } from '../types';

export const OrderSuccess: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useShop();
  const { settings } = useSettings();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);



  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      // Check Redux orders first
      const found = orders.find(
        (o) => o.id === orderId || o._id === orderId || o.orderId === orderId
      );
      if (found) {
        setOrder(found);
        setLoading(false);
        return;
      }

      // Fetch from API
      try {
        const res = await orderService.getOrderById(orderId);
        if (res.success && res.data) {
          setOrder(res.data);
        }
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, orders]);

  const handleCopyOrderId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const whatsappPhone = settings?.whatsapp?.number || '919876543210';
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(`Hello VELORA! 👋 I have a question regarding my order #${orderId || ''}.`)}`;

  if (loading) {
    return (
      <div className="py-24 text-center bg-gray-50/50 min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-3" />
        <p className="text-xs text-gray-500 font-medium">Fetching order receipt details...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen py-10 md:py-16 text-left font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        
        {/* Celebration Top Card */}
        <div className="bg-white p-8 md:p-10 border border-gray-200 rounded-sm shadow-xs text-center mb-6">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200 animate-bounce-subtle">
            <CheckCircle2 className="w-9 h-9 text-emerald-600" />
          </div>

          <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-2">
            Order Confirmed &amp; Dispatched Soon
          </span>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Thank You for Shopping with VELORA!
          </h1>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Your ethnic wear order has been safely placed. We are preparing your handcrafted parcels with our signature festive packaging.
          </p>

          {/* Order ID Badge */}
          <div className="mt-6 inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xs border border-gray-200">
            <span className="text-xs text-gray-500">Order ID:</span>
            <strong className="text-sm font-mono text-gray-900 font-bold">#{orderId}</strong>
            <button
              onClick={handleCopyOrderId}
              className="p-1 text-gray-400 hover:text-gray-900 transition cursor-pointer"
              title="Copy Order ID"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Order Details Body */}
        {order && (
          <div className="bg-white border border-gray-200 rounded-sm shadow-xs overflow-hidden mb-6">
            
            <div className="p-5 bg-gray-50/80 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-gray-400 block font-medium">Order Date:</span>
                <span className="font-semibold text-gray-800">{order.date || 'Today'}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Payment Mode:</span>
                <span className="font-semibold text-gray-800">{order.paymentMethod} ({order.paymentStatus || 'Verified'})</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Delivery Destination:</span>
                <span className="font-semibold text-gray-800">{order.shippingAddress?.city}, {order.shippingAddress?.country || 'India'}</span>
              </div>
            </div>

            {/* Items List */}
            <div className="p-6 divide-y divide-gray-100">
              <h3 className="font-serif font-bold text-sm text-gray-900 pb-3 mb-3 uppercase tracking-wider flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-600" /> Purchased Outfits ({order.items.length})
              </h3>

              {order.items.map((item, idx) => {
                const prod = item.product;
                const stitch = item.selectedStitchOption;
                const lineTotal = (prod.price + (stitch?.price || 0)) * item.quantity;

                return (
                  <div key={idx} className="py-3 flex items-center gap-4 text-xs">
                    <img
                      src={prod.image || (prod.images && prod.images[0])}
                      alt={prod.name}
                      className="w-14 h-16 object-cover rounded-xs border border-gray-200 shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-xs sm:text-sm">{prod.name}</h4>
                      <p className="text-gray-500 text-[11px] mt-0.5">
                        Size: <span className="font-medium text-gray-800">{item.selectedSize}</span> | Color: <span className="font-medium text-gray-800">{item.selectedColor}</span> | Qty: {item.quantity}
                      </p>
                      {stitch && stitch.price > 0 && (
                        <p className="text-amber-800 text-[11px] font-semibold mt-0.5">
                          Tailoring: {stitch.type} (+₹{stitch.price})
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-900 text-sm">₹{lineTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Address & Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-gray-200 bg-gray-50/40">
              
              <div className="p-5 border-b sm:border-b-0 sm:border-r border-gray-200 text-xs">
                <h4 className="font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-500" /> Delivery Address
                </h4>
                <p className="font-semibold text-gray-900">{order.shippingAddress?.fullName || order.customerName}</p>
                <p className="text-gray-600 mt-1">{order.shippingAddress?.street || order.shippingAddress?.address}</p>
                <p className="text-gray-600">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                <p className="text-gray-600 font-medium mt-0.5">{order.shippingAddress?.country || 'India'}</p>
                <p className="text-gray-500 mt-1">Phone: {order.shippingAddress?.phone || order.customerPhone}</p>
              </div>

              <div className="p-5 text-xs space-y-1.5">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{(order.subtotal || order.totalAmount).toLocaleString('en-IN')}</span>
                </div>
                {order.discountAmount && order.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Savings</span>
                    <span>-₹{order.discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee</span>
                  <span>{(order.shippingFee === 0 || order.shippingCharge === 0) ? <strong className="text-emerald-700">FREE</strong> : `₹${order.shippingFee || order.shippingCharge || 0}`}</span>
                </div>
                {order.codCharge && order.codCharge > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>COD Fee</span>
                    <span>+₹{order.codCharge}</span>
                  </div>
                )}
                <hr className="border-gray-200 pt-1 mt-1" />
                <div className="flex justify-between text-sm font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span className="font-serif text-base">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/orders"
            className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white text-xs font-semibold px-6 py-3.5 uppercase tracking-widest rounded-sm transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <Truck className="w-4 h-4" /> Live Tracking &amp; Orders Stepper
          </Link>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-3 rounded-sm transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Support
            </a>

            <Link
              to="/products"
              className="flex-1 sm:flex-none border border-gray-300 hover:border-gray-900 text-gray-900 text-xs font-semibold px-4 py-3 rounded-sm transition flex items-center justify-center gap-1.5 bg-white cursor-pointer"
            >
              Continue Shopping &gt;
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
