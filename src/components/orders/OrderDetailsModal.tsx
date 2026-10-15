import React from 'react';
import { X, CheckCircle2, Clock, Truck, Package, MapPin, CreditCard, Download, ShieldCheck } from 'lucide-react';
import type { Order } from '../../types';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const rawOrder = order as any;
  const orderIdStr = order.id || rawOrder._id || rawOrder.orderId || 'ORD-1001';
  const orderStatus = order.status || rawOrder.orderStatus || 'Confirmed';

  // Tracking Steps Progress Setup
  const steps = [
    { label: 'Order Confirmed', desc: 'Order details verified & processing', icon: Clock, key: 'Pending' },
    { label: 'Packed at Warehouse', desc: 'Items packed in VELORA signature box', icon: Package, key: 'Confirmed' },
    { label: 'Out for Shipment', desc: 'Handed to Express Courier partner', icon: Truck, key: 'Shipped' },
    { label: 'Delivered', desc: 'Package delivered to recipient', icon: CheckCircle2, key: 'Delivered' }
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'Pending':
      case 'Confirmed':
        return 1;
      case 'Shipped':
        return 2;
      case 'Delivered':
        return 3;
      default:
        return 1;
    }
  };

  const activeStep = getStepIndex(orderStatus);

  const handlePrintReceipt = () => {
    window.print();
  };

  const shippingAddr = order.shippingAddress as any;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-left border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Modal Header */}
        <div className="bg-gray-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold">Order Details &amp; Tracking</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs border border-emerald-500/30">
                #{orderIdStr}
              </span>
            </div>
            <p className="text-[11px] text-gray-300 mt-0.5">
              Placed on {order.date || 'Today'} | Payment: {order.paymentMethod}
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
          <div className="bg-gray-50/80 p-4 rounded-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-gray-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600" /> Live Parcel Tracking Status
              </h3>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                Status: {orderStatus}
              </span>
            </div>

            {/* Stepper Timeline UI */}
            <div className="relative flex items-center justify-between px-2 sm:px-6">
              
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
            
            <p className="text-[11px] text-gray-500 text-center mt-4 pt-3 border-t border-gray-200/60">
              🚚 Courier Tracking ID: <span className="font-mono font-bold text-gray-800">VD-IN-9482049</span> (Express Air Delivery)
            </p>
          </div>

          {/* Shipping Address & Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-white p-4 border border-gray-200 rounded-sm">
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 mb-2 flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-500" /> Delivery Address
              </h4>
              <p className="font-bold text-xs text-gray-900">{shippingAddr?.fullName || rawOrder.customerName || 'Valued Customer'}</p>
              <p className="text-xs text-gray-600 mt-1">{shippingAddr?.street || shippingAddr?.address}</p>
              <p className="text-xs text-gray-600">{shippingAddr?.city}, {shippingAddr?.state} - {shippingAddr?.pincode}</p>
              <p className="text-xs text-gray-500 mt-1 font-semibold">📞 Phone: {shippingAddr?.phone || rawOrder.customerPhone || 'N/A'}</p>
            </div>

            <div className="bg-white p-4 border border-gray-200 rounded-sm">
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 mb-2 flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
                <CreditCard className="w-3.5 h-3.5 text-gray-500" /> Payment &amp; Invoice
              </h4>
              <p className="text-xs text-gray-600">Method: <strong className="text-gray-900">{order.paymentMethod}</strong></p>
              <p className="text-xs text-gray-600 mt-0.5">Status: <strong className="text-emerald-700 capitalize">Verified</strong></p>
              <p className="text-xs text-gray-600 mt-0.5">Email: <strong className="text-gray-900">{rawOrder.customerEmail || 'customer@velora.com'}</strong></p>

              <button
                onClick={handlePrintReceipt}
                className="mt-3 w-full bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-semibold py-1.5 px-3 rounded-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download Tax Invoice
              </button>
            </div>

          </div>

          {/* Ordered Items Table */}
          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 p-3 bg-gray-50 border-b border-gray-200">
              Ordered Products ({order.items.length})
            </h4>
            <div className="divide-y divide-gray-100">
              {order.items.map((item: any, idx: number) => (
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
                    <p className="text-gray-400 text-[10px]">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-xs">
                      ₹{((item.product?.price || item.price) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Summary */}
            <div className="bg-gray-50 p-3 border-t border-gray-200 text-xs space-y-1 text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{rawOrder.subtotal ? rawOrder.subtotal.toLocaleString() : order.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping &amp; Delivery:</span>
                <span className="text-emerald-700 font-semibold">{rawOrder.shippingCharge === 0 ? 'FREE' : `₹${rawOrder.shippingCharge || 0}`}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-gray-900 pt-1 border-t border-gray-200">
                <span>Total Amount Paid:</span>
                <span>₹{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between">
          <span className="text-[11px] text-gray-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Buyer Protection &amp; Easy Returns
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
