import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { cartService } from '../../services/cartService';
import type { CartItem, Product } from '../../types';

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null
};

// Async Thunks for Cart APIs
export const fetchCartThunk = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const res = await cartService.getCart();
      if (res.success && res.data) {
        return res.data;
      }
      return [];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch cart');
    }
  }
);

export const addToCartThunk = createAsyncThunk(
  'cart/addToCart',
  async (
    { product, size, color, quantity = 1 }: { product: Product; size?: string; color?: string; quantity?: number },
    { rejectWithValue }
  ) => {
    try {
      const targetSize = size || product.sizes[0] || 'M';
      const targetColor = color || product.colors[0]?.name || 'Default';
      const res = await cartService.addToCart(product.id, quantity, targetSize, targetColor);
      if (res.success && res.data) {
        return res.data;
      }
      return rejectWithValue('Failed to add item to cart');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Add to cart error');
    }
  }
);

export const updateCartItemThunk = createAsyncThunk(
  'cart/updateCartItem',
  async (
    { productId, quantity, size, color }: { productId: string; quantity: number; size?: string; color?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await cartService.updateCartItem(productId, quantity, size, color);
      if (res.success && res.data) {
        return res.data;
      }
      return rejectWithValue('Failed to update cart item');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Update cart error');
    }
  }
);

export const removeFromCartThunk = createAsyncThunk(
  'cart/removeFromCart',
  async (
    { productId }: { productId: string; size?: string; color?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await cartService.removeFromCart(productId);
      if (res.success && res.data) {
        return res.data;
      }
      return rejectWithValue('Failed to remove item from cart');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Remove from cart error');
    }
  }
);

export const clearCartThunk = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await cartService.clearCart();
      return [];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Clear cart error');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCartLocal: (
      state,
      action: PayloadAction<{ product: Product; size?: string; color?: string; quantity?: number }>
    ) => {
      const { product, size, color, quantity = 1 } = action.payload;
      const targetSize = size || product.sizes[0] || 'M';
      const targetColor = color || product.colors[0]?.name || 'Default';
      const availableStock = product.stock !== undefined ? product.stock : 25;

      const existingIndex = state.items.findIndex(
        (item) =>
          (item.product.id === product.id || (item.product as any)._id === product.id) &&
          item.selectedSize === targetSize &&
          item.selectedColor === targetColor
      );

      if (existingIndex > -1) {
        const currentQty = state.items[existingIndex].quantity;
        state.items[existingIndex].quantity = Math.min(currentQty + quantity, availableStock);
      } else {
        state.items.push({
          product,
          selectedSize: targetSize,
          selectedColor: targetColor,
          quantity: Math.min(quantity, availableStock)
        });
      }
    },
    removeFromCartLocal: (
      state,
      action: PayloadAction<{ productId: string; size: string; color: string }>
    ) => {
      const { productId, size, color } = action.payload;
      state.items = state.items.filter(
        (item) =>
          !((item.product.id === productId || (item.product as any)._id === productId) && item.selectedSize === size && item.selectedColor === color)
      );
    },
    updateCartQuantityLocal: (
      state,
      action: PayloadAction<{ productId: string; size: string; color: string; quantity: number }>
    ) => {
      const { productId, size, color, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter(
          (item) =>
            !((item.product.id === productId || (item.product as any)._id === productId) && item.selectedSize === size && item.selectedColor === color)
        );
      } else {
        const item = state.items.find(
          (i) => (i.product.id === productId || (i.product as any)._id === productId) && i.selectedSize === size && i.selectedColor === color
        );
        if (item) {
          const availableStock = item.product.stock !== undefined ? item.product.stock : 25;
          item.quantity = Math.min(quantity, availableStock);
        }
      }
    },
    clearCartLocal: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCartThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCartThunk.rejected, (state) => {
        state.loading = false;
      })
      // Add to Cart Thunk
      .addCase(addToCartThunk.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Update Cart Thunk
      .addCase(updateCartItemThunk.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Remove from Cart Thunk
      .addCase(removeFromCartThunk.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Clear Cart Thunk
      .addCase(clearCartThunk.fulfilled, (state) => {
        state.items = [];
      });
  }
});

export const { addToCartLocal, removeFromCartLocal, updateCartQuantityLocal, clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;
