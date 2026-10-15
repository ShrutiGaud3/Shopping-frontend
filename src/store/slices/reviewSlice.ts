import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reviewService } from '../../services/reviewService';
import type { Review } from '../../types';

interface ReviewState {
  reviews: Review[];
  allReviews: Review[];
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  allReviews: [],
  loading: false,
  error: null
};

export const fetchReviewsThunk = createAsyncThunk(
  'reviews/fetchReviews',
  async (productId: string, { rejectWithValue }) => {
    try {
      const res = await reviewService.getProductReviews(productId);
      if (res.success) {
        return res.data;
      }
      return [];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch reviews');
    }
  }
);

export const fetchAllReviewsThunk = createAsyncThunk(
  'reviews/fetchAllReviews',
  async (_, { rejectWithValue }) => {
    try {
      const res = await reviewService.getAllReviews();
      if (res.success) {
        return res.data;
      }
      return [];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch all reviews');
    }
  }
);

export const createReviewThunk = createAsyncThunk(
  'reviews/createReview',
  async ({ productId, rating, comment }: { productId: string; rating: number; comment: string }, { rejectWithValue }) => {
    try {
      const res = await reviewService.createReview(productId, rating, comment);
      if (res.success && res.data) {
        return res.data;
      }
      return rejectWithValue(res.message || 'Failed to submit review');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to submit review');
    }
  }
);

export const deleteReviewThunk = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId: string, { rejectWithValue }) => {
    try {
      await reviewService.deleteReview(reviewId);
      return reviewId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to delete review');
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    addReviewLocal: (state, action) => {
      state.reviews.unshift(action.payload);
      state.allReviews.unshift(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Product Reviews
      .addCase(fetchReviewsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviewsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch All Reviews
      .addCase(fetchAllReviewsThunk.fulfilled, (state, action) => {
        state.allReviews = action.payload;
      })
      // Create Review
      .addCase(createReviewThunk.fulfilled, (state, action) => {
        state.reviews.unshift(action.payload);
        state.allReviews.unshift(action.payload);
      })
      // Delete Review
      .addCase(deleteReviewThunk.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter((r) => r.id !== action.payload && r._id !== action.payload);
        state.allReviews = state.allReviews.filter((r) => r.id !== action.payload && r._id !== action.payload);
      });
  }
});

export const { addReviewLocal } = reviewSlice.actions;
export default reviewSlice.reducer;
