import React, { useEffect, useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Users, Search, Trash2, Shield, User as UserIcon, MapPin, RefreshCw, Mail, Phone, Calendar } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const { allUsers, fetchAllUsers, deleteUserAdmin } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const filteredUsers = allUsers.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.phone && u.phone.includes(term))
    );
  });

  const handleDeleteUser = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete account "${name}"?`)) {
      setDeletingId(id);
      await deleteUserAdmin(id);
      setDeletingId(null);
    }
  };

  const totalUsers = allUsers.length;
  const adminCount = allUsers.filter((u) => u.role === 'admin').length;
  const customerCount = totalUsers - adminCount;

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-gray-800" /> User Accounts &amp; Customers
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage registered customer accounts, view address books, and manage administrator access.
          </p>
        </div>

        <button
          onClick={() => fetchAllUsers()}
          className="bg-gray-900 text-white font-semibold text-xs py-2 px-3.5 rounded-sm flex items-center gap-2 hover:bg-black transition-colors shadow-xs w-fit cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Users List
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 border border-gray-200 rounded-sm shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Registered</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalUsers}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 border border-gray-200 rounded-sm shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Customer Accounts</p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{customerCount}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserIcon className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 border border-gray-200 rounded-sm shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Administrators</p>
            <p className="text-2xl font-bold text-purple-700 mt-1">{adminCount}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 border border-gray-200 rounded-sm shadow-xs flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-sm pl-9 pr-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
          />
        </div>
        <span className="text-xs text-gray-500 font-medium">
          Showing {filteredUsers.length} of {totalUsers} users
        </span>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">User Details</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Saved Addresses</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 text-xs">
                    No users match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const userId = u._id || u.id;
                  const initial = u.name ? u.name.charAt(0).toUpperCase() : 'U';
                  const joinedDate = u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                    : 'N/A';

                  return (
                    <tr key={userId} className="hover:bg-gray-50/50">
                      
                      {/* User Info Column */}
                      <td className="py-3 px-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-800 to-gray-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                          {initial}
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 block text-xs">{u.name || 'Anonymous User'}</span>
                          <span className="text-[10px] text-gray-400 font-mono">ID: {userId.slice(-6).toUpperCase()}</span>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <span className="flex items-center gap-1.5 text-xs text-gray-900 font-medium">
                            <Mail className="w-3 h-3 text-gray-400" /> {u.email}
                          </span>
                          {u.phone && (
                            <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
                              <Phone className="w-3 h-3 text-gray-400" /> {u.phone}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3 px-4">
                        {u.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-xs border border-purple-200">
                            <Shield className="w-3 h-3 text-purple-600" /> Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-xs border border-gray-200">
                            <UserIcon className="w-3 h-3 text-gray-500" /> Customer
                          </span>
                        )}
                      </td>

                      {/* Addresses */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" /> {u.addresses?.length || 0} address(es)
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="py-3 px-4 font-medium text-gray-600">
                        <span className="flex items-center gap-1 text-xs">
                          <Calendar className="w-3 h-3 text-gray-400" /> {joinedDate}
                        </span>
                      </td>

                      {/* Action column */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(userId, u.name)}
                          disabled={deletingId === userId || u.role === 'admin'}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                          title={u.role === 'admin' ? 'Cannot delete admin account' : 'Delete user account'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
