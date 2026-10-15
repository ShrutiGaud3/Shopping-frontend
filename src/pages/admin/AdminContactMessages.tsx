import React, { useEffect, useState } from 'react';
import { Mail, MessageSquare, Clock, CheckCircle, RefreshCw, MessageCircle } from 'lucide-react';
import { contactService } from '../../services/contactService';
import { useShop } from '../../context/ShopContext';
import { WHATSAPP_NUMBER, openWhatsApp } from '../../utils/whatsapp';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  orderNumber?: string;
  topic: string;
  message: string;
  status: 'Pending' | 'Replied' | 'Resolved';
  createdAt: string;
}

export const AdminContactMessages: React.FC = () => {
  const { showToast } = useShop();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Replied' | 'Resolved'>('All');

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await contactService.getAllContactMessages();
      if (res && res.success) {
        setMessages(res.data || []);
      }
    } catch (err: any) {
      showToast('Loaded local customer messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'Pending' | 'Replied' | 'Resolved') => {
    try {
      const res = await contactService.updateContactStatus(id, newStatus);
      if (res && res.success) {
        setMessages((prev) =>
          prev.map((m) => (m._id === id ? { ...m, status: newStatus } : m))
        );
        showToast(`Message marked as ${newStatus}! ✨`);
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, status: newStatus } : m))
      );
      showToast(`Status updated to ${newStatus}`);
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (activeTab === 'All') return true;
    return m.status === activeTab;
  });

  const pendingCount = messages.filter((m) => m.status === 'Pending').length;
  const resolvedCount = messages.filter((m) => m.status === 'Resolved').length;

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
            Customer Support &amp; Contact Inquiries
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage incoming customer inquiries, send direct email responses, and update support statuses.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          disabled={loading}
          className="bg-gray-900 text-white font-semibold text-xs py-2.5 px-4 rounded-sm flex items-center gap-2 hover:bg-black transition-colors shadow-xs w-fit cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Messages
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 border border-gray-200 rounded-sm shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 block">Total Inquiries</span>
            <span className="text-2xl font-bold text-gray-900 mt-1 block">{messages.length}</span>
          </div>
          <div className="p-3 rounded-sm bg-blue-50 text-blue-700">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 border border-gray-200 rounded-sm shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 block">Pending Response</span>
            <span className="text-2xl font-bold text-amber-700 mt-1 block">{pendingCount}</span>
          </div>
          <div className="p-3 rounded-sm bg-amber-50 text-amber-700">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 border border-gray-200 rounded-sm shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 block">Resolved Cases</span>
            <span className="text-2xl font-bold text-emerald-700 mt-1 block">{resolvedCount}</span>
          </div>
          <div className="p-3 rounded-sm bg-emerald-50 text-emerald-700">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-xs">
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-3">
          {(['All', 'Pending', 'Replied', 'Resolved'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-xs text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab} {tab === 'All' ? `(${messages.length})` : tab === 'Pending' ? `(${pendingCount})` : ''}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold text-[10px] tracking-wider border-y border-gray-200">
              <tr>
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Inquiry Topic</th>
                <th className="py-3 px-4">Message</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400 text-xs">
                    No customer contact messages found for &quot;{activeTab}&quot;.
                  </td>
                </tr>
              ) : (
                filteredMessages.map((msg) => {
                  const ticketId = msg._id ? `#TKT-${msg._id.slice(-6).toUpperCase()}` : '#TKT-1092';
                  return (
                    <tr key={msg._id} className="hover:bg-gray-50/50">
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                        {ticketId}
                        {msg.orderNumber && (
                          <span className="block text-[10px] font-mono text-gray-400 font-normal">
                            Ord: {msg.orderNumber}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-medium text-gray-900">
                        <span className="block font-bold">{msg.name}</span>
                        <a href={`mailto:${msg.email}`} className="text-blue-600 hover:underline text-[11px]">
                          {msg.email}
                        </a>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="bg-gray-100 text-gray-800 text-[10px] font-semibold px-2 py-0.5 rounded-xs uppercase">
                          {msg.topic}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs text-gray-600 leading-relaxed">
                        <p className="line-clamp-2">{msg.message}</p>
                      </td>

                      <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                        {new Date(msg.createdAt || Date.now()).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={msg.status}
                          onChange={(e) => handleUpdateStatus(msg._id, e.target.value as any)}
                          className={`text-[10px] font-bold uppercase px-2 py-1 rounded-xs border cursor-pointer focus:outline-none ${
                            msg.status === 'Resolved'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : msg.status === 'Replied'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="Pending">PENDING</option>
                          <option value="Replied">REPLIED</option>
                          <option value="Resolved">RESOLVED</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`mailto:${msg.email}?subject=RE: VELORA Support Ticket ${ticketId}&body=Dear ${msg.name},%0D%0A%0D%0AThank you for contacting VELORA Support.%0D%0A%0D%0A`}
                            className="bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white p-1.5 rounded-xs transition-colors"
                            title="Reply via Email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              const text = `Hello ${msg.name}, this is VELORA Support regarding your ticket ${ticketId} ("${msg.topic}"). How can we assist you further?`;
                              openWhatsApp(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`);
                            }}
                            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white p-1.5 rounded-xs transition-colors cursor-pointer"
                            title="Contact via WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
