import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, ShoppingBag, Users, AlertTriangle, TrendingUp, RefreshCw, MessageSquare, Mail, MessageCircle } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { adminService } from '../../services/adminService';
import { contactService } from '../../services/contactService';
import { adaptBackendOrder } from '../../services/orderService';
import { WHATSAPP_NUMBER, openWhatsApp } from '../../utils/whatsapp';
import type { Order } from '../../types';

interface DashboardMetrics {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
  recentOrders: Order[];
}

export const Dashboard: React.FC = () => {
  const { products, orders, fetchAllOrdersAdmin, fetchProducts } = useShop();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAdminDashboard();
      if (res && res.success && res.data) {
        const adaptedOrders = (res.data.recentOrders || []).map(adaptBackendOrder);
        setMetrics({
          ...res.data,
          recentOrders: adaptedOrders
        });
      }
    } catch (err) {
      // Fallback
    }

    try {
      const msgRes = await contactService.getAllContactMessages();
      if (msgRes && msgRes.success) {
        setContactMessages(msgRes.data || []);
      }
    } catch (err) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    fetchAllOrdersAdmin();
    fetchProducts();
  }, []);

  // Compute live fallbacks if API metrics pending
  const revenue = metrics?.totalRevenue !== undefined
    ? metrics.totalRevenue
    : orders.reduce((acc, o) => acc + o.totalAmount, 0);

  const totalOrdersCount = metrics?.totalOrders !== undefined ? metrics.totalOrders : orders.length;
  const totalUsersCount = metrics?.totalUsers !== undefined ? metrics.totalUsers : 12;
  const pendingOrdersCount = metrics?.pendingOrders !== undefined ? metrics.pendingOrders : orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const lowStockCount = metrics?.lowStockProducts !== undefined ? metrics.lowStockProducts : products.filter(p => (p.stock || 25) <= 10).length;

  const displayOrders = metrics?.recentOrders && metrics.recentOrders.length > 0 ? metrics.recentOrders : orders;

  const stats = [
    { title: 'Total Revenue', value: `₹${revenue.toLocaleString()}`, change: 'Live Atlas DB', icon: IndianRupee, color: 'text-emerald-600 bg-emerald-50', link: '/admin/orders' },
    { title: 'Total Orders', value: totalOrdersCount.toString(), change: 'Real-time orders', icon: ShoppingBag, color: 'text-blue-600 bg-blue-50', link: '/admin/orders' },
    { title: 'Total Customers', value: totalUsersCount.toString(), change: 'Registered users', icon: Users, color: 'text-purple-600 bg-purple-50', link: '/admin/users' },
    { title: 'Support Messages', value: contactMessages.length > 0 ? `${contactMessages.length} Messages` : 'Live Inbox', change: 'Concierge inquiries', icon: MessageSquare, color: 'text-teal-600 bg-teal-50', link: '/admin/messages' },
    { title: 'Pending Pipeline', value: pendingOrdersCount.toString(), change: 'Pending orders', icon: ShoppingBag, color: 'text-amber-700 bg-amber-100', link: '/admin/orders' },
    { title: 'Low Stock Alerts', value: lowStockCount.toString(), change: 'Warehouse alerts', icon: AlertTriangle, color: 'text-rose-600 bg-rose-50', link: '/admin/inventory' }
  ];

  return (
    <div className="space-y-8 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
            Executive Dashboard Overview
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time revenue metrics, order pipelines, customer inquiries, and inventory updates for VELORA.
          </p>
        </div>

        <button
          onClick={loadDashboardData}
          disabled={loading}
          className="bg-gray-900 text-white font-semibold text-xs py-2.5 px-4 rounded-sm flex items-center gap-2 hover:bg-black transition-colors shadow-xs w-fit cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Metrics
        </button>
      </div>

      {/* 6 Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Link
              key={i}
              to={stat.link}
              className="bg-white p-4 border border-gray-200 rounded-sm shadow-xs flex flex-col justify-between hover:border-gray-900 hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-gray-500 group-hover:text-gray-900 transition-colors">{stat.title}</span>
                <div className={`p-2 rounded-xs ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900 block">{stat.value}</span>
                <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1 mt-1 group-hover:underline">
                  <TrendingUp className="w-3 h-3" /> {stat.change} &rarr;
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Grid: Customer Support Inquiries & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Customer Support Inquiries Table */}
        <div className="lg:col-span-6 bg-white border border-gray-200 rounded-sm p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div>
                <h3 className="font-serif font-bold text-lg text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-teal-600" /> Customer Support Inquiries
                </h3>
                <p className="text-xs text-gray-500">Live incoming Contact Us requests from MongoDB Atlas.</p>
              </div>
              <Link
                to="/admin/messages"
                className="text-xs font-semibold text-teal-700 hover:underline"
              >
                View All Messages ({contactMessages.length}) &gt;
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 text-gray-500 uppercase font-semibold text-[10px] tracking-wider border-y border-gray-200">
                  <tr>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Topic</th>
                    <th className="py-2.5 px-3">Message</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {contactMessages.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400 text-xs">
                        No customer messages found. Send a test message on /contact!
                      </td>
                    </tr>
                  ) : (
                    contactMessages.slice(0, 5).map((msg) => (
                      <tr key={msg._id} className="hover:bg-gray-50/50">
                        <td className="py-3 px-3">
                          <span className="font-bold text-gray-900 block">{msg.name}</span>
                          <span className="text-[10px] text-gray-500 truncate block max-w-[120px]">{msg.email}</span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="bg-gray-100 text-gray-800 text-[10px] font-bold px-1.5 py-0.5 rounded-xs uppercase">
                            {msg.topic}
                          </span>
                        </td>
                        <td className="py-3 px-3 max-w-[160px]">
                          <p className="line-clamp-2 text-gray-600">{msg.message}</p>
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={`mailto:${msg.email}?subject=RE: VELORA Support`}
                              className="p-1 rounded-xs bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors"
                              title="Reply Email"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                openWhatsApp(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello ${msg.name}, VELORA Support here regarding your inquiry.`)}`);
                              }}
                              className="p-1 rounded-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                              title="WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Recent Orders Table Section */}
        <div className="lg:col-span-6 bg-white border border-gray-200 rounded-sm p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div>
                <h3 className="font-serif font-bold text-lg text-gray-900">Recent Customer Orders</h3>
                <p className="text-xs text-gray-500">Live order stream across desktop &amp; mobile checkouts.</p>
              </div>
              <Link
                to="/admin/orders"
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                View All Orders &gt;
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 text-gray-500 uppercase font-semibold text-[10px] tracking-wider border-y border-gray-200">
                  <tr>
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayOrders.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400 text-xs">
                        No recent orders found in MongoDB Atlas.
                      </td>
                    </tr>
                  ) : (
                    displayOrders.slice(0, 5).map((order) => (
                      <tr key={order._id || order.id} className="hover:bg-gray-50/50">
                        <td className="py-3 px-3 font-mono font-bold text-gray-900">
                          {order.orderId || order.id}
                        </td>
                        <td className="py-3 px-3 font-medium text-gray-900">
                          {order.customerName}
                        </td>
                        <td className="py-3 px-3 font-bold text-gray-900">₹{order.totalAmount.toLocaleString()}</td>
                        <td className="py-3 px-3 text-right">
                          <span className={`px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase ${
                            order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
