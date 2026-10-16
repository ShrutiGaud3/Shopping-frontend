import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  MapPin,
  CreditCard,
  Download,
  ShieldCheck,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

import { useShop } from '../../context/ShopContext';
import type { Order } from '../../types';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, isOpen, onClose }) => {
  const { requestExchange } = useShop();

  // Exchange Form State
  const [showExchangeForm, setShowExchangeForm] = useState(false);
  const [exchangeReason, setExchangeReason] = useState('Size / Fit issue');
  const [exchangeNotes, setExchangeNotes] = useState('');
  const [submittingExchange, setSubmittingExchange] = useState(false);

  if (!isOpen || !order) return null;

  const rawOrder = order as any;
  const orderIdStr = order.id || rawOrder._id || rawOrder.orderId || 'ORD-1001';
  const orderStatus = order.status || rawOrder.orderStatus || 'Confirmed';

  // Tracking Steps Progress Setup
  const steps = [
    { label: 'Placed', desc: 'Order verified', icon: Clock, key: 'Pending' },
    { label: 'Packed', desc: 'Signature parcel box', icon: Package, key: 'Packed' },
    { label: 'Shipped', desc: 'In express transit', icon: Truck, key: 'Shipped' },
    { label: 'Delivered', desc: 'Delivered to address', icon: CheckCircle2, key: 'Delivered' }
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'Pending':
      case 'Confirmed':
      case 'Placed':
        return 0;
      case 'Packed':
        return 1;
      case 'Shipped':
      case 'Out for Delivery':
        return 2;
      case 'Delivered':
        return 3;
      default:
        return 1;
    }
  };

  const activeStep = getStepIndex(orderStatus);

  // Exchange 10-day window calculation
  const deliveryDate = rawOrder.deliveredAt ? new Date(rawOrder.deliveredAt) : (order.date ? new Date(order.date) : new Date());
  const diffDays = Math.floor((Date.now() - deliveryDate.getTime()) / (1000 * 60 * 60 * 24));
  const remainingExchangeDays = Math.max(0, 10 - diffDays);
  const isExchangeEligible = orderStatus === 'Delivered' && diffDays <= 10;

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleSubmitExchange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exchangeReason) return;

    setSubmittingExchange(true);
    const res = await requestExchange(orderIdStr, exchangeReason, exchangeNotes);
    setSubmittingExchange(false);
    if (res.success) {
      setShowExchangeForm(false);
    }
  };

  const shippingAddr = order.shippingAddress as any;
  const carrier = rawOrder.carrierName || 'Delhivery Express';
  const trackingNumber = rawOrder.trackingNumber || `VD-IN-${orderIdStr.slice(-6)}`;
  const trackingUrl = rawOrder.trackingUrl || `https://www.delhivery.com/track/package/${trackingNumber}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-sans">
      <div
        className="bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-left border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Modal Header */}
        <div className="bg-gray-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold">Order Details &amp; Live Tracking</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs border border-emerald-500/30">
                #{orderIdStr}
              </span>
            </div>
            <p className="text-[11px] text-gray-300 mt-0.5">
              Placed on {order.date || 'Recent'} | Payment: {order.paymentMethod} ({rawOrder.paymentStatus || 'Verified'})
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Tracking Timeline Section */}
          <div className="bg-gray-50/90 p-4 sm:p-5 rounded-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-gray-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600" /> Live Parcel Tracking
              </h3>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-xs border border-emerald-300">
                Current Status: {orderStatus}
              </span>
            </div>

            {/* Stepper Timeline UI */}
            <div className="relative flex items-center justify-between px-3 sm:px-6 my-2">
              {/* Progress Line */}
              <div className="absolute left-6 right-6 top-4 h-1 bg-gray-200 z-0">
                <div
                  className="h-full bg-emerald-600 transition-all duration-500"
                  style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
                />
              </div>

              {/* Step Circles */}
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx <= activeStep;
                return (
                  <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                        isCompleted
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                          : 'bg-white border-2 border-gray-300 text-gray-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[11px] font-semibold mt-2 max-w-[80px] leading-tight ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Courier Info Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-5 pt-3 border-t border-gray-200/80 text-[11px]">
              <div>
                <span className="text-gray-500">Carrier:</span> <strong className="text-gray-900">{carrier}</strong>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-gray-500">Tracking AWB:</span> <span className="font-mono font-bold text-gray-900">{trackingNumber}</span>
              </div>

              <a
                href={trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                Track on Carrier Site <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* 10-Day Exchange Banner & Action Card */}
          {orderStatus === 'Delivered' && (
            <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-amber-700" />
                    <h4 className="font-bold text-xs uppercase tracking-wider text-amber-950">
                      10-Day Easy Exchange &amp; Return Window
                    </h4>
                  </div>
                  <p className="text-xs text-amber-900 mt-1">
                    {diffDays <= 10 ? (
                      <span>You have <strong>{remainingExchangeDays} days remaining</strong> to request a size exchange or return.</span>
                    ) : (
                      <span>The 10-day exchange window has expired for this order.</span>
                    )}
                  </p>
                </div>

                {/* Exchange Status or Trigger Button */}
                <div>
                  {rawOrder.exchangeStatus === 'requested' && (
                    <span className="bg-amber-100 text-amber-900 font-bold text-xs px-3 py-1.5 rounded-xs border border-amber-300 inline-block">
                      Exchange Pending Review
                    </span>
                  )}
                  {rawOrder.exchangeStatus === 'approved' && (
                    <span className="bg-emerald-100 text-emerald-900 font-bold text-xs px-3 py-1.5 rounded-xs border border-emerald-300 inline-block">
                      ✓ Exchange Approved (Pickup Scheduled)
                    </span>
                  )}
                  {rawOrder.exchangeStatus === 'rejected' && (
                    <span className="bg-rose-100 text-rose-900 font-bold text-xs px-3 py-1.5 rounded-xs border border-rose-300 inline-block">
                      Exchange Rejected
                    </span>
                  )}
                  {(!rawOrder.exchangeStatus || rawOrder.exchangeStatus === 'none') && isExchangeEligible && (
                    <button
                      type="button"
                      onClick={() => setShowExchangeForm(!showExchangeForm)}
                      className="bg-amber-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-xs transition cursor-pointer"
                    >
                      {showExchangeForm ? 'Cancel Form' : 'Request Exchange'}
                    </button>
                  )}
                </div>
              </div>

              {/* Collapsible Exchange Request Form */}
              {showExchangeForm && (
                <form onSubmit={handleSubmitExchange} className="mt-4 pt-4 border-t border-amber-200/80 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-amber-950 mb-1">Reason for Exchange *</label>
                    <select
                      value={exchangeReason}
                      onChange={(e) => setExchangeReason(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded-xs px-3 py-1.5 text-xs text-gray-900 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="Size / Fit issue">Size / Fit issue (Need larger/smaller)</option>
                      <option value="Defective or Damaged">Defective or Damaged outfit received</option>
                      <option value="Fabric quality differs from website">Fabric quality differs from pictures</option>
                      <option value="Color shade difference">Color shade difference</option>
                      <option value="Wrong product received">Wrong product received</option>
                      <option value="Other">Other Reason</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-950 mb-1">Feedback &amp; Preferred Exchange Size/Notes</label>
                    <textarea
                      rows={2}
                      placeholder="Please mention your replacement size or describe the issue..."
                      value={exchangeNotes}
                      onChange={(e) => setExchangeNotes(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded-xs p-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingExchange}
                    className="bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xs transition cursor-pointer disabled:opacity-50"
                  >
                    {submittingExchange ? 'Submitting Request...' : 'Submit Exchange Request'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Shipping Address & Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-white p-4 border border-gray-200 rounded-sm">
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 mb-2 flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-500" /> Delivery Address
              </h4>
              <p className="font-bold text-xs text-gray-900">{shippingAddr?.fullName || rawOrder.customerName || 'Valued Customer'}</p>
              <p className="text-xs text-gray-600 mt-1">{shippingAddr?.street || shippingAddr?.address}</p>
              <p className="text-xs text-gray-600">{shippingAddr?.city}, {shippingAddr?.state} - {shippingAddr?.pincode}</p>
              <p className="text-xs text-gray-700 font-semibold">{shippingAddr?.country || 'India'}</p>
              <p className="text-xs text-gray-500 mt-1 font-semibold">📞 Phone: {shippingAddr?.phone || rawOrder.customerPhone || 'N/A'}</p>
            </div>

            <div className="bg-white p-4 border border-gray-200 rounded-sm">
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 mb-2 flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
                <CreditCard className="w-3.5 h-3.5 text-gray-500" /> Payment &amp; Invoice
              </h4>
              <p className="text-xs text-gray-600">Method: <strong className="text-gray-900">{order.paymentMethod}</strong></p>
              <p className="text-xs text-gray-600 mt-0.5">Status: <strong className="text-emerald-700 capitalize">{rawOrder.paymentStatus || 'Verified'}</strong></p>
              <p className="text-xs text-gray-600 mt-0.5">Email: <strong className="text-gray-900">{rawOrder.customerEmail || 'customer@velora.com'}</strong></p>

              <button
                onClick={handlePrintReceipt}
                className="mt-3 w-full bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-semibold py-1.5 px-3 rounded-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Print Tax Invoice
              </button>
            </div>

          </div>

          {/* Ordered Items Table */}
          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 p-3 bg-gray-50 border-b border-gray-200">
              Ordered Products ({order.items.length})
            </h4>
            <div className="divide-y divide-gray-100">
              {order.items.map((item: any, idx: number) => {
                const stitch = item.selectedStitchOption;
                const unitPrice = item.product?.price || item.price || 0;
                const stitchPrice = stitch?.price || 0;
                const lineTotal = (unitPrice + stitchPrice) * item.quantity;

                return (
                  <div key={idx} className="p-3 flex items-center gap-3 text-xs">
                    <img
                      src={item.product?.image || item.image || (item.product?.images && item.product.images[0])}
                      alt={item.product?.name || item.name}
                      className="w-12 h-14 object-cover rounded-xs border border-gray-200 shrink-0"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{item.product?.name || item.name}</p>
                      <p className="text-gray-500 text-[11px]">
                        Size: <span className="font-semibold text-gray-800">{item.selectedSize || item.size}</span> | Color: <span className="font-semibold text-gray-800">{item.selectedColor || item.color}</span>
                      </p>
                      {stitch && stitch.price > 0 && (
                        <p className="text-amber-800 text-[10px] font-semibold mt-0.5">
                          Tailoring: {stitch.type} (+₹{stitch.price})
                        </p>
                      )}
                      <p className="text-gray-400 text-[10px]">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-xs">
                        ₹{lineTotal.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Summary */}
            <div className="bg-gray-50 p-3 border-t border-gray-200 text-xs space-y-1 text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{(rawOrder.subtotal || order.totalAmount).toLocaleString('en-IN')}</span>
              </div>
              {rawOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Savings ({rawOrder.couponCode || 'PROMO'}):</span>
                  <span>-₹{rawOrder.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping &amp; Delivery:</span>
                <span className="text-emerald-700 font-semibold">
                  {(rawOrder.shippingCharge === 0 || rawOrder.shippingFee === 0) ? 'FREE' : `₹${rawOrder.shippingCharge || rawOrder.shippingFee || 0}`}
                </span>
              </div>
              {rawOrder.codCharge > 0 && (
                <div className="flex justify-between">
                  <span>COD Handling Charge:</span>
                  <span>+₹{rawOrder.codCharge}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-gray-900 pt-1 border-t border-gray-200">
                <span>Total Amount:</span>
                <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between">
          <span className="text-[11px] text-gray-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Genuine Handcrafted Surat Couture
          </span>
          <button
            onClick={onClose}
            className="bg-gray-900 text-white font-bold text-xs px-4 py-1.5 rounded-sm hover:bg-black transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
};
