import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Tag, Percent, X } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const AdminCoupons: React.FC = () => {
  const { availableCoupons, fetchCoupons, createCoupon, deleteCoupon } = useShop();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const initialCoupon = {
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '' as unknown as number,
    minimumOrderValue: '' as unknown as number,
    maximumDiscount: '' as unknown as number,
    usageLimit: 100,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  };

  const [newCoupon, setNewCoupon] = useState(initialCoupon);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) return;
    setIsAddModalOpen(false);

    const couponToSave = {
      ...newCoupon,
      code: newCoupon.code.trim().toUpperCase(),
      discountValue: Number(newCoupon.discountValue) || 0,
      minimumOrderValue: Number(newCoupon.minimumOrderValue) || 0,
      maximumDiscount: Number(newCoupon.maximumDiscount) || 0
    };

    await createCoupon(couponToSave);
    setNewCoupon(initialCoupon);
    fetchCoupons();
  };

  const handleDeleteCoupon = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      await deleteCoupon(id);
      fetchCoupons();
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Tag className="w-6 h-6 text-emerald-600" /> Promotional Coupons &amp; Discounts
          </h1>
          <p className="text-xs text-gray-500">
            Create and manage promotional discount codes for checkout.
          </p>
        </div>

        <button
          onClick={() => {
            setNewCoupon(initialCoupon);
            setIsAddModalOpen(true);
          }}
          className="bg-emerald-600 text-white font-semibold text-xs py-2.5 px-4 rounded-sm flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create New Coupon
        </button>
      </div>

      {/* Coupons Grid Table */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Min. Order Value</th>
                <th className="py-3 px-4">Max. Discount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {availableCoupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 text-xs">
                    No active coupons found. Click "Create New Coupon" to add one!
                  </td>
                </tr>
              ) : (
                availableCoupons.map((c) => (
                  <tr key={c._id || c.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700 text-sm">
                      {c.code}
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT OFF`}
                    </td>
                    <td className="py-3 px-4">₹{c.minimumOrderValue}</td>
                    <td className="py-3 px-4">₹{c.maximumDiscount || 'No Limit'}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 uppercase">
                        ACTIVE
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteCoupon(c._id || c.id || '')}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xs transition-colors cursor-pointer"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-sm max-w-md w-full p-6 shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <h3 className="font-serif font-bold text-lg text-gray-900 flex items-center gap-2">
                <Percent className="w-5 h-5 text-emerald-600" /> Create Coupon
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-gray-400 hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Coupon Code (Uppercase) *</label>
                <input
                  type="text"
                  required
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. FESTIVE20 or VELORA50"
                  className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3.5 py-2 font-mono uppercase text-sm font-bold text-emerald-700 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Discount Type *</label>
                  <select
                    value={newCoupon.discountType}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value as any })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2 cursor-pointer font-medium focus:outline-none focus:border-emerald-600"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={newCoupon.discountValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: e.target.value === '' ? '' as any : Number(e.target.value) })}
                    placeholder={newCoupon.discountType === 'percentage' ? "e.g. 20 (for 20%)" : "e.g. 200 (for ₹200)"}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3.5 py-2 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Min Order Value (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newCoupon.minimumOrderValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minimumOrderValue: e.target.value === '' ? '' as any : Number(e.target.value) })}
                    placeholder="e.g. 999"
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3.5 py-2 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Max Discount Cap (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newCoupon.maximumDiscount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, maximumDiscount: e.target.value === '' ? '' as any : Number(e.target.value) })}
                    placeholder="e.g. 500"
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3.5 py-2 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-sm hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-sm hover:bg-emerald-700 cursor-pointer shadow-xs"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
