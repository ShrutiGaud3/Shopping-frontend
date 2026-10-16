import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { wishlistService } from '../../services/wishlistService';

interface WishlistState {
  productIds: string[];
  loading: boolean;
  error: string | null;
}

const getInitialWishlist = (): string[] => {
  try {
    const saved = localStorage.getItem('weavera_wishlist') || localStorage.getItem('wishlist');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        // filter out legacy dummy IDs
        return parsed.filter((id) => id && !['prod-1', 'prod-3', 'prod-5'].includes(id));
      }
    }
  } catch (e) {
    // fallback
  }
  return [];
};

const initialState: WishlistState = {
  productIds: getInitialWishlist(),
  loading: false,
  error: null
};

// Async Thunks for Wishlist APIs
export const fetchWishlistThunk = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const res = await wishlistService.getWishlist();
      if (res.success && res.productIds) {
        return res.productIds;
      }
      return [];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch wishlist');
    }
  }
);

export const toggleWishlistThunk = createAsyncThunk(
  'wishlist/toggleWishlist',
  async (productId: string, { rejectWithValue }) => {
    try {
      const res = await wishlistService.toggleWishlist(productId);
      if (res.success && res.productIds) {
        return res.productIds;
      }
      return rejectWithValue('Failed to toggle wishlist');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Wishlist error');
    }
  }
);

export const removeFromWishlistThunk = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId: string, { rejectWithValue }) => {
    try {
      const res = await wishlistService.removeFromWishlist(productId);
      if (res.success && res.productIds) {
        return res.productIds;
      }
      return rejectWithValue('Failed to remove from wishlist');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Wishlist error');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlistLocal: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const index = state.productIds.indexOf(productId);
      if (index > -1) {
        state.productIds.splice(index, 1);
      } else {
        state.productIds.push(productId);
      }
      try {
        localStorage.setItem('weavera_wishlist', JSON.stringify(state.productIds));
      } catch (e) {}
    },
    removeFromWishlistLocal: (state, action: PayloadAction<string>) => {
      state.productIds = state.productIds.filter((id) => id !== action.payload);
      try {
        localStorage.setItem('weavera_wishlist', JSON.stringify(state.productIds));
      } catch (e) {}
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist
      .addCase(fetchWishlistThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlistThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.productIds = action.payload;
        try {
          localStorage.setItem('weavera_wishlist', JSON.stringify(state.productIds));
        } catch (e) {}
      })
      .addCase(fetchWishlistThunk.rejected, (state) => {
        state.loading = false;
      })
      // Toggle Wishlist Thunk
      .addCase(toggleWishlistThunk.fulfilled, (state, action) => {
        state.productIds = action.payload;
        try {
          localStorage.setItem('weavera_wishlist', JSON.stringify(state.productIds));
        } catch (e) {}
      })
      // Remove Wishlist Thunk
      .addCase(removeFromWishlistThunk.fulfilled, (state, action) => {
        state.productIds = action.payload;
        try {
          localStorage.setItem('weavera_wishlist', JSON.stringify(state.productIds));
        } catch (e) {}
      });
  }
});

export const { toggleWishlistLocal, removeFromWishlistLocal } = wishlistSlice.actions;
export default wishlistSlice.reducer;
