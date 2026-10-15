import API from './api';
import { adaptBackendProduct } from './productService';
import type { CartItem } from '../types';

export const adaptBackendCartItem = (item: any): CartItem => {
  return {
    product: item.product ? adaptBackendProduct(item.product) : item.product,
    selectedSize: item.size || 'M',
    selectedColor: item.color || 'Default',
    quantity: item.quantity || 1
  };
};

export const cartService = {
  // Get logged-in user cart
  getCart: async () => {
    const response = await API.get('/cart');
    if (response.data && response.data.data && response.data.data.items) {
      const items = response.data.data.items.map(adaptBackendCartItem);
      return {
        success: true,
        data: items
      };
    }
    return { success: false, data: [] };
  },

  // Add item to cart
  addToCart: async (productId: string, quantity: number = 1, size: string = 'M', color: string = 'Default') => {
    const response = await API.post('/cart', {
      productId,
      quantity,
      size,
      color
    });
    if (response.data && response.data.data && response.data.data.items) {
      return {
        success: true,
        data: response.data.data.items.map(adaptBackendCartItem)
      };
    }
    return { success: false, data: [] };
  },

  // Update cart item quantity/options
  updateCartItem: async (itemId: string, quantity: number, size?: string, color?: string) => {
    const response = await API.put(`/cart/${itemId}`, {
      quantity,
      size,
      color
    });
    if (response.data && response.data.data && response.data.data.items) {
      return {
        success: true,
        data: response.data.data.items.map(adaptBackendCartItem)
      };
    }
    return { success: false, data: [] };
  },

  // Remove item from cart
  removeFromCart: async (itemId: string) => {
    const response = await API.delete(`/cart/${itemId}`);
    if (response.data && response.data.data && response.data.data.items) {
      return {
        success: true,
        data: response.data.data.items.map(adaptBackendCartItem)
      };
    }
    return { success: false, data: [] };
  },

  // Clear entire cart
  clearCart: async () => {
    const response = await API.delete('/cart');
    return response.data;
  }
};
