import API from './api';
import type { Review } from '../types';

export const adaptBackendReview = (item: any): Review => {
  return {
    id: item._id || item.id,
    _id: item._id || item.id,
    user: item.user,
    userName: item.userName || 'Fashion Enthusiast',
    userAvatar: item.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    userLocation: item.userLocation || 'India',
    product: item.product,
    productName: item.productName || 'Fashion Apparel',
    rating: item.rating || 5,
    comment: item.comment || '',
    isVerifiedPurchase: item.isVerifiedPurchase !== undefined ? item.isVerifiedPurchase : true,
    createdAt: item.createdAt,
    date: item.createdAt
      ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  };
};

export const reviewService = {
  // Get product reviews
  getProductReviews: async (productId: string) => {
    const response = await API.get(`/products/${productId}/reviews`);
    if (response.data && Array.isArray(response.data.data)) {
      return {
        success: true,
        data: response.data.data.map(adaptBackendReview)
      };
    }
    return { success: false, data: [] };
  },

  // Get all customer reviews (Home & Admin)
  getAllReviews: async () => {
    const response = await API.get('/reviews');
    if (response.data && Array.isArray(response.data.data)) {
      return {
        success: true,
        data: response.data.data.map(adaptBackendReview)
      };
    }
    return { success: false, data: [] };
  },

  // Create product review
  createReview: async (productId: string, rating: number, comment: string) => {
    const response = await API.post(`/products/${productId}/reviews`, { rating, comment });
    if (response.data && response.data.data) {
      return {
        success: true,
        data: adaptBackendReview(response.data.data),
        message: response.data.message || 'Review submitted successfully'
      };
    }
    return { success: false, data: null, message: response.data?.message || 'Failed to submit review' };
  },

  // Delete review
  deleteReview: async (reviewId: string) => {
    const response = await API.delete(`/reviews/${reviewId}`);
    return response.data;
  }
};
