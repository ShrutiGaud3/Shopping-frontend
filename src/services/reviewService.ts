import API from './api';
import type { Review } from '../types';

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  photoReviewsCount: number;
  photoGallery: string[];
}

export interface ReviewEligibility {
  canReview: boolean;
  isVerifiedBuyer: boolean;
  hasReviewed: boolean;
  existingReview?: Review | null;
  message: string;
}

export const adaptBackendReview = (item: any): Review => {
  return {
    id: item._id || item.id,
    _id: item._id || item.id,
    user: item.user,
    userName: item.userName || 'Verified Buyer',
    userAvatar: item.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    userLocation: item.userLocation || 'India',
    product: item.product,
    productName: item.productName || '',
    rating: Number(item.rating) || 5,
    title: item.title || '',
    comment: item.comment || '',
    images: Array.isArray(item.images) ? item.images : [],
    isVerifiedBuyer: item.isVerifiedBuyer !== undefined ? item.isVerifiedBuyer : true,
    isVerifiedPurchase: item.isVerifiedPurchase !== undefined ? item.isVerifiedPurchase : true,
    status: item.status || 'approved',
    helpfulVotes: item.helpfulVotes || 0,
    createdAt: item.createdAt,
    date: item.createdAt
      ? new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  };
};

export const reviewService = {
  // Get approved product reviews + stats breakdown
  getProductReviews: async (productId: string): Promise<{ success: boolean; data: Review[]; stats?: ReviewStats }> => {
    try {
      const response = await API.get(`/products/${productId}/reviews`);
      if (response.data && Array.isArray(response.data.data)) {
        return {
          success: true,
          data: response.data.data.map(adaptBackendReview),
          stats: response.data.stats
        };
      }
      return { success: false, data: [] };
    } catch (err) {
      console.error('Failed to get product reviews', err);
      return { success: false, data: [] };
    }
  },

  // Check if logged in customer can review (Verified Buyer Check)
  checkEligibility: async (productId: string): Promise<{ success: boolean; data?: ReviewEligibility; message?: string }> => {
    try {
      const response = await API.get(`/reviews/check-eligibility/${productId}`);
      return response.data;
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Could not verify eligibility'
      };
    }
  },

  // Get all customer reviews showcase
  getAllReviews: async () => {
    try {
      const response = await API.get('/reviews');
      if (response.data && Array.isArray(response.data.data)) {
        return {
          success: true,
          data: response.data.data.map(adaptBackendReview)
        };
      }
      return { success: false, data: [] };
    } catch (err) {
      console.error('Failed to get all reviews', err);
      return { success: false, data: [] };
    }
  },

  // Create product review (Verified buyers only)
  createReview: async (
    productId: string,
    reviewData: { rating: number; title?: string; comment: string; images?: string[] } | number,
    commentFallback?: string
  ) => {
    let payload: any = {};
    if (typeof reviewData === 'number') {
      payload = { rating: reviewData, comment: commentFallback || '' };
    } else {
      payload = reviewData;
    }

    const response = await API.post(`/products/${productId}/reviews`, payload);
    if (response.data && response.data.data) {
      return {
        success: true,
        data: adaptBackendReview(response.data.data),
        message: response.data.message || 'Review submitted successfully'
      };
    }
    return {
      success: false,
      data: null,
      message: response.data?.message || 'Failed to submit review'
    };
  },

  // Delete review
  deleteReview: async (reviewId: string) => {
    const response = await API.delete(`/reviews/${reviewId}`);
    return response.data;
  }
};
