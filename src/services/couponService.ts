import API from './api';

export interface CouponData {
  _id?: string;
  id?: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumOrderValue: number;
  maximumDiscount: number;
  expiryDate?: string;
  usageLimit?: number;
  usedCount?: number;
  isActive?: boolean;
}

export const couponService = {
  // Validate coupon code against cart total & user email
  validateCoupon: async (code: string, cartTotal: number, email?: string) => {
    const response = await API.post('/coupons/validate', {
      code,
      cartTotal,
      email
    });
    return response.data;
  },

  // Get all active coupons
  getCoupons: async () => {
    const response = await API.get('/coupons');
    if (response.data && Array.isArray(response.data.data)) {
      return {
        success: true,
        data: response.data.data
      };
    }
    return { success: false, data: [] };
  },

  // Admin: Create new coupon
  createCoupon: async (couponData: Partial<CouponData>) => {
    const response = await API.post('/coupons', couponData);
    return response.data;
  },

  // Admin: Delete coupon
  deleteCoupon: async (id: string) => {
    const response = await API.delete(`/coupons/${id}`);
    return response.data;
  }
};
