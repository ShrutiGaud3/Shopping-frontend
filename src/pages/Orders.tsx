import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle2, Clock, Eye } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { OrderDetailsModal } from '../components/orders/OrderDetailsModal';
import type { Order } from '../types';

export const Orders: React.FC = () => {
  const { orders, addToCart } = useShop();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleOpenDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: string, exchangeStatus?: string) => {
    if (exchangeStatus === 'requested') {
      return (
        <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-xs border border-amber-300">
          <Clock className="w-3.5 h-3.5" /> Exchange Pending
        </span>
      );
    }
    if (exchangeStatus === 'approved') {
      return (
        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-xs border border-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5" /> Exchange Approved
        </span>
      );
    }
    if (exchangeStatus === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-800 text-xs font-semibold px-2.5 py-1 rounded-xs border border-rose-300">
          Exchange Rejected
        </span>
      );
    }

    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-xs border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case 'Shipped':
      case 'Out for Delivery':
        return (
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-xs border border-blue-200">
            <Truck className="w-3.5 h-3.5" /> {status}
          </span>
        );
      case 'Packed':
        return (
          <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-xs border border-indigo-200">
            <Package className="w-3.5 h-3.5" /> Packed at Warehouse
          </span>
        );
      case 'Confirmed':
      case 'Pending':
      case 'Placed':
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-xs border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Processing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-xs">
            {status}
          </span>
        );
    }
  };


  return (
    <div className="bg-gray-50/50 min-h-screen py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="border-b border-gray-200 pb-4 mb-8 text-left">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            My Orders <span className="text-sm font-sans font-normal text-gray-500">({orders.length} items)</span>
          </h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-12 text-center border border-gray-200 rounded-sm">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">No orders placed yet</h3>
            <p className="text-xs text-gray-500 mb-6">Your past purchase receipts will appear here.</p>
            <Link
              to="/products"
              className="bg-gray-900 text-white font-semibold text-xs px-8 py-3 uppercase tracking-widest rounded-sm"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => {
              const orderId = order.id || order._id || order.orderId;
              const orderStatus = order.status || order.orderStatus || 'Confirmed';

              return (
                <div
                  key={orderId}
                  className="bg-white border border-gray-200 rounded-sm p-6 shadow-xs text-left"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-gray-100 text-xs">
                    <div>
                      <span className="text-gray-400 block font-medium">Order Number:</span>
                      <strong className="text-gray-900 text-sm font-mono">#{orderId}</strong>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(orderStatus, order.exchangeStatus)}
                      <button
                        onClick={() => handleOpenDetails(order)}
                        className="text-blue-600 font-semibold hover:underline text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Tracking &amp; Exchange
                      </button>
                    </div>

                  </div>

                  {/* Items in Order */}
                  <div className="space-y-4">
                    {order.items.map((item: any, idx: number) => {
                      const prodObj = item.product || item;
                      const prodImage = prodObj.image || (prodObj.images && prodObj.images[0]);
                      const prodName = prodObj.name || item.name;
                      const prodBrand = prodObj.brand || 'Weavera';
                      const itemSize = item.selectedSize || item.size || 'M';
                      const itemColor = item.selectedColor || item.color || 'Default';

                      return (
                        <div key={idx} className="flex gap-4 items-center">
                          <img
                            src={prodImage}
                            alt={prodName}
                            className="w-16 h-20 object-cover rounded-xs border border-gray-200 shrink-0"
                          />
                          <div className="flex-1 text-xs text-gray-700">
                            <h4 className="font-bold text-sm text-gray-900 mb-0.5">{prodName}</h4>
                            <p className="text-gray-500 mb-1">Brand: {prodBrand}</p>
                            <p className="text-gray-500">Size: {itemSize} | Color: {itemColor}</p>
                            <p className="text-gray-400 text-[11px] mt-1">Order Placed on: {order.date || 'Recent'}</p>
                          </div>

                          {/* Action buttons */}
                          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                            <button
                              onClick={() => addToCart(prodObj, itemSize, itemColor, 1)}
                              className="px-4 py-2 border border-gray-800 text-gray-900 text-xs font-semibold uppercase hover:bg-gray-900 hover:text-white transition-colors rounded-xs cursor-pointer"
                            >
                              Re-order item
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order Footer Total */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                    <span>Payment Method: <strong className="text-gray-900">{order.paymentMethod}</strong></span>
                    <div className="flex items-center gap-3">
                      <span>Total Paid: <strong className="text-gray-900 text-sm">₹{order.totalAmount?.toLocaleString()}</strong></span>
                      <button
                        onClick={() => handleOpenDetails(order)}
                        className="bg-gray-900 text-white font-semibold text-[11px] px-3 py-1 rounded-xs hover:bg-black transition-colors cursor-pointer"
                      >
                        Track Order
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Order Details & Tracking Modal */}
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

      </div>
    </div>
  );
};
