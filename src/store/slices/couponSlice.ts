import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { couponService } from '../../services/couponService';
import type { CouponData } from '../../services/couponService';

interface AppliedCouponInfo {
  code: string;
  discount: number;
  message: string;
}

interface CouponState {
  appliedCoupon: AppliedCouponInfo | null;
  availableCoupons: CouponData[];
  loading: boolean;
  error: string | null;
}

const DEFAULT_COUPONS: CouponData[] = [
  {
    _id: 'c1',
    code: 'VELORA20',
    discountType: 'percentage',
    discountValue: 20,
    minimumOrderValue: 1499,
    maximumDiscount: 1000,
    expiryDate: '2027-12-31',
    usageLimit: 1000,
    usedCount: 15,
    isActive: true
  },
  {
    _id: 'c2',
    code: 'WELCOME100',
    discountType: 'fixed',
    discountValue: 100,
    minimumOrderValue: 499,
    maximumDiscount: 100,
    expiryDate: '2027-12-31',
    usageLimit: 1000,
    usedCount: 42,
    isActive: true
  },
  {
    _id: 'c3',
    code: 'FESTIVE15',
    discountType: 'percentage',
    discountValue: 15,
    minimumOrderValue: 999,
    maximumDiscount: 500,
    expiryDate: '2027-12-31',
    usageLimit: 500,
    usedCount: 8,
    isActive: true
  }
];

const initialState: CouponState = {
  appliedCoupon: null,
  availableCoupons: DEFAULT_COUPONS,
  loading: false,
  error: null
};

export const validateCouponThunk = createAsyncThunk(
  'coupons/validateCoupon',
  async (
    { code, cartTotal, email }: { code: string; cartTotal: number; email?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await couponService.validateCoupon(code, cartTotal, email);
      if (res.success && res.valid) {
        return {
          code: res.code,
          discount: res.discount,
          message: res.message
        };
      }
      return rejectWithValue(res.message || 'Invalid coupon code');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to validate coupon');
    }
  }
);

export const fetchCouponsThunk = createAsyncThunk(
  'coupons/fetchCoupons',
  async () => {
    try {
      const res = await couponService.getCoupons();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
      return DEFAULT_COUPONS;
    } catch (err: any) {
      return DEFAULT_COUPONS;
    }
  }
);

export const createCouponThunk = createAsyncThunk(
  'coupons/createCoupon',
  async (couponData: Partial<CouponData>, { rejectWithValue }) => {
    try {
      const res = await couponService.createCoupon(couponData);
      if (res.success && res.data) {
        return res.data;
      }
      return rejectWithValue('Failed to create coupon');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Create coupon error');
    }
  }
);

export const deleteCouponThunk = createAsyncThunk(
  'coupons/deleteCoupon',
  async (id: string, { rejectWithValue }) => {
    try {
      await couponService.deleteCoupon(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Delete coupon error');
    }
  }
);

const couponSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    removeCoupon: (state) => {
      state.appliedCoupon = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Validate Coupon
      .addCase(validateCouponThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateCouponThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedCoupon = action.payload;
      })
      .addCase(validateCouponThunk.rejected, (state, action) => {
        state.loading = false;
        state.appliedCoupon = null;
        state.error = action.payload as string;
      })
      // Fetch Coupons
      .addCase(fetchCouponsThunk.fulfilled, (state, action) => {
        state.availableCoupons = action.payload;
      })
      // Create Coupon
      .addCase(createCouponThunk.fulfilled, (state, action) => {
        state.availableCoupons.unshift(action.payload);
      })
      // Delete Coupon
      .addCase(deleteCouponThunk.fulfilled, (state, action) => {
        state.availableCoupons = state.availableCoupons.filter((c) => (c._id || c.id) !== action.payload);
      });
  }
});

export const { removeCoupon } = couponSlice.actions;
export default couponSlice.reducer;
