import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { User, Phone, Mail, Lock, MapPin, Plus, Trash2, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { user, updateProfile } = useShop();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  const [updating, setUpdating] = useState(false);

  // Address form modal
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleUpdatePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    const payload: { name?: string; phone?: string; password?: string } = {
      name,
      phone
    };
    if (password.trim()) {
      payload.password = password;
    }
    await updateProfile(payload);
    setPassword('');
    setUpdating(false);
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.address || !newAddr.city || !newAddr.pincode) return;

    const currentAddresses = user?.addresses ? [...user.addresses] : [];
    currentAddresses.push({
      ...newAddr,
      name: newAddr.name || user?.name || 'Home',
      phone: newAddr.phone || user?.phone || ''
    });

    setUpdating(true);
    await updateProfile({ addresses: currentAddresses });
    setNewAddr({
      name: user?.name || '',
      phone: user?.phone || '',
      address: '',
      city: '',
      state: '',
      pincode: ''
    });
    setShowAddressModal(false);
    setUpdating(false);
  };

  const handleDeleteAddress = async (indexToDelete: number) => {
    if (!user?.addresses) return;
    const updated = user.addresses.filter((_, idx) => idx !== indexToDelete);
    setUpdating(true);
    await updateProfile({ addresses: updated });
    setUpdating(false);
  };

  if (!user) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-gray-900">Please Log In</h2>
        <p className="text-xs text-gray-500">Sign in to view and update your profile settings.</p>
        <Link to="/login" className="inline-block bg-gray-900 text-white font-semibold text-xs py-2.5 px-6 rounded-sm uppercase tracking-wider">
          Log In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen py-8 md:py-12 text-left">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Profile Card */}
        <div className="bg-white border border-gray-200 rounded-sm p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-gray-900 to-gray-700 text-white font-serif font-bold text-2xl sm:text-3xl flex items-center justify-center shadow-md">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
                  {user.name}
                </h1>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-xs border border-emerald-200 uppercase tracking-widest flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> {user.role}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gray-400" /> {user.email}
              </p>
              {user.phone && (
                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gray-400" /> {user.phone}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/orders"
              className="bg-white border border-gray-300 text-gray-800 font-semibold text-xs py-2.5 px-4 rounded-sm hover:border-gray-900 transition-colors shadow-xs"
            >
              My Orders &gt;
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Personal Information & Password */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-xs">
              <h3 className="font-serif font-bold text-lg text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-700" /> Personal Account Information
              </h3>

              <form onSubmit={handleUpdatePersonal} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Email Address (Read-only)</label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full bg-gray-100 border border-gray-200 rounded-sm px-3 py-2 text-xs text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
                  />
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-gray-500" /> Change Password (Optional)
                  </label>
                  <input
                    type="password"
                    placeholder="Leave blank to keep existing password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full bg-gray-900 text-white font-semibold text-xs py-3 px-4 uppercase tracking-wider rounded-sm hover:bg-black transition-colors disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {updating ? 'Saving Profile...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Saved Shipping Addresses */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                <h3 className="font-serif font-bold text-lg text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-700" /> Delivery Addresses
                </h3>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New
                </button>
              </div>

              {/* Saved Address Cards */}
              {(!user.addresses || user.addresses.length === 0) ? (
                <p className="text-xs text-gray-400 italic py-4">
                  No saved addresses found. Add a delivery address for faster checkout.
                </p>
              ) : (
                <div className="space-y-3">
                  {user.addresses.map((addr, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-sm p-3.5 text-xs text-gray-700 relative group bg-gray-50/50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-gray-900">{addr.name || 'Saved Address'}</span>
                        <button
                          onClick={() => handleDeleteAddress(idx)}
                          className="text-rose-600 hover:text-rose-800 p-1 transition-colors cursor-pointer"
                          title="Delete address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-gray-600">{addr.address}</p>
                      <p className="text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                      {addr.phone && <p className="text-gray-400 mt-1 font-mono text-[11px]">Phone: {addr.phone}</p>}
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-sm shadow-xl text-left space-y-4">
            <h3 className="font-serif font-bold text-lg text-gray-900 border-b border-gray-100 pb-2">
              Add Delivery Address
            </h3>

            <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Contact Name</label>
                <input
                  type="text"
                  required
                  value={newAddr.name}
                  onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="Flat, House no., Building, Apartment, Street"
                  value={newAddr.address}
                  onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">PIN Code</label>
                  <input
                    type="text"
                    required
                    value={newAddr.pincode}
                    onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-gray-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-sm hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 text-xs font-semibold text-white bg-gray-900 rounded-sm hover:bg-black transition-colors"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
