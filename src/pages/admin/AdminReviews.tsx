import React, { useEffect, useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Star, Trash2, MessageSquare, CheckCircle2 } from 'lucide-react';

export const AdminReviews: React.FC = () => {
  const { allReviews, fetchAllReviews, deleteReview } = useShop();
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const filteredReviews = ratingFilter === 'all'
    ? allReviews
    : allReviews.filter((r) => r.rating === ratingFilter);

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            Customer Reviews &amp; Ratings
          </h1>
          <p className="text-xs text-gray-500">
            Manage product feedback, monitor client satisfaction, and moderate submitted reviews.
          </p>
        </div>

        {/* Filter by Rating */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-700">Filter by Rating:</span>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="bg-white border border-gray-300 rounded-sm px-2.5 py-1 text-xs text-gray-800 focus:outline-none cursor-pointer font-medium shadow-xs"
          >
            <option value="all">All Ratings ({allReviews.length})</option>
            <option value={5}>5 Stars ⭐⭐⭐⭐⭐</option>
            <option value={4}>4 Stars ⭐⭐⭐⭐</option>
            <option value={3}>3 Stars ⭐⭐⭐</option>
            <option value={2}>2 Stars ⭐⭐</option>
            <option value={1}>1 Star ⭐</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Reviewer</th>
                <th className="py-3 px-4">Product Title</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Review Comment</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 text-xs">
                    <MessageSquare className="w-6 h-6 mx-auto mb-2 opacity-50" />
                    No customer reviews found matching this filter.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((rev) => (
                  <tr key={rev.id || rev._id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                          alt={rev.userName}
                          className="w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-gray-900 block flex items-center gap-1">
                            {rev.userName}
                            {rev.isVerifiedPurchase && (
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            )}
                          </span>
                          <span className="text-[10px] text-gray-400">{rev.userLocation || 'India'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs font-medium text-gray-900 line-clamp-1">
                      {rev.productName || 'Fashion Apparel Item'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-md text-gray-700 leading-relaxed italic">
                      "{rev.comment}"
                    </td>
                    <td className="py-3 px-4 text-gray-400 font-mono text-[11px]">
                      {rev.date || 'Recent'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteReview(rev.id || rev._id || '')}
                        className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 p-1.5 rounded-sm transition-colors cursor-pointer"
                        title="Delete Review"
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

    </div>
  );
};
