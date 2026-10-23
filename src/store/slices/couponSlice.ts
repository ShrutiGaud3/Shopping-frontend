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
    _id: 'c0',
    code: 'PREPAID10',
    type: 'percent',
    discountType: 'percentage',
    value: 10,
    discountValue: 10,
    minOrder: 0,
    minimumOrderValue: 0,
    maxDiscount: 500,
    paymentMethod: 'prepaid',
    expiryDate: '2027-12-31',
    usageLimit: 1000,
    usedCount: 30,
    isActive: true
  },
  {
    _id: 'c1',
    code: 'WEAVERAFESTIVE',
    type: 'percent',
    discountType: 'percentage',
    value: 15,
    discountValue: 15,
    minOrder: 1499,
    minimumOrderValue: 1499,
    maxDiscount: 750,
    paymentMethod: 'any',
    expiryDate: '2027-12-31',
    usageLimit: 1000,
    usedCount: 15,
    isActive: true
  },
  {
    _id: 'c2',
    code: 'WELCOME100',
    type: 'flat',
    discountType: 'fixed',
    value: 100,
    discountValue: 100,
    minOrder: 999,
    minimumOrderValue: 999,
    maxDiscount: 100,
    paymentMethod: 'any',
    expiryDate: '2027-12-31',
    usageLimit: 1000,
    usedCount: 42,
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
    { code, cartTotal, email, paymentMethod }: { code: string; cartTotal: number; email?: string; paymentMethod?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await couponService.validateCoupon(code, cartTotal, email, paymentMethod);
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
