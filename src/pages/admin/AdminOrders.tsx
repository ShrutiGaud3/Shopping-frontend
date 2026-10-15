import React, { useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import type { Order } from '../../types';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, fetchAllOrdersAdmin } = useShop();

  useEffect(() => {
    fetchAllOrdersAdmin();
  }, []);

  return (
    <div className="space-y-6 text-left">
      
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900">
          Order Management Pipeline
        </h1>
        <p className="text-xs text-gray-500">
          Track customer purchases, update delivery statuses, and process order flows.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items Included</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status Badge</th>
                <th className="py-3 px-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400 text-xs">
                    No customer orders found in the database.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id || o.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-gray-900">
                      {o.orderId || o.id}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-gray-900 block">{o.customerName}</span>
                      <span className="text-[10px] text-gray-400 block">{o.customerEmail}</span>
                      {o.shippingAddress?.phone && (
                        <span className="text-[10px] text-gray-500 block font-mono">{o.shippingAddress.phone}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="space-y-1.5">
                        {o.items.map((it, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <img
                              src={it.product.image}
                              alt={it.product.name}
                              className="w-7 h-8 object-cover rounded-xs border border-gray-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="line-clamp-1 font-medium text-gray-900 text-[11px]">{it.product.name}</p>
                              <p className="text-[10px] text-gray-400">
                                Qty: {it.quantity} | Size: {it.selectedSize} | Color: {it.selectedColor}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">
                      ₹{o.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-gray-500">{o.date}</td>
                    <td className="py-3 px-4 font-semibold text-gray-800">{o.paymentMethod}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-xs text-[10px] font-bold uppercase ${
                        o.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                        o.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        o.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o._id || o.id, e.target.value as Order['status'])}
                        className="bg-gray-50 border border-gray-300 rounded-sm px-2 py-1 text-xs text-gray-800 focus:outline-none cursor-pointer font-medium"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
