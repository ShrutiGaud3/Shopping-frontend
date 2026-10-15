import API from './api';
import { adaptBackendProduct } from './productService';
import type { Product } from '../types';

export const wishlistService = {
  // Get logged-in user wishlist items
  getWishlist: async () => {
    const response = await API.get('/wishlist');
    if (response.data && Array.isArray(response.data.data)) {
      const products: Product[] = response.data.data.map(adaptBackendProduct);
      const productIds = products.map((p) => p.id);
      return {
        success: true,
        products,
        productIds
      };
    }
    return { success: false, products: [], productIds: [] };
  },

  // Toggle item in wishlist (POST /api/wishlist/:productId)
  toggleWishlist: async (productId: string) => {
    const response = await API.post(`/wishlist/${productId}`);
    if (response.data && Array.isArray(response.data.data)) {
      const products: Product[] = response.data.data.map(adaptBackendProduct);
      const productIds = products.map((p) => p.id);
      return {
        success: true,
        message: response.data.message,
        products,
        productIds
      };
    }
    return { success: false, products: [], productIds: [] };
  },

  // Remove item from wishlist (DELETE /api/wishlist/:productId)
  removeFromWishlist: async (productId: string) => {
    const response = await API.delete(`/wishlist/${productId}`);
    if (response.data && Array.isArray(response.data.data)) {
      const products: Product[] = response.data.data.map(adaptBackendProduct);
      const productIds = products.map((p) => p.id);
      return {
        success: true,
        products,
        productIds
      };
    }
    return { success: false, products: [], productIds: [] };
  },

  // Clear entire wishlist
  clearWishlist: async () => {
    const response = await API.delete('/wishlist');
    return response.data;
  }
};
