import API from './api';

export interface CouponData {
  _id?: string;
  id?: string;
  code: string;
  type?: 'percent' | 'flat';
  discountType?: 'percentage' | 'fixed' | 'percent' | 'flat';
  value?: number;
  discountValue?: number;
  minOrder?: number;
  minimumOrderValue?: number;
  maxDiscount?: number;
  maximumDiscount?: number;
  expiry?: string;
  expiryDate?: string;
  usageLimit?: number;
  usedCount?: number;
  paymentMethod?: 'any' | 'prepaid' | 'cod';
  isActive?: boolean;
}

export const couponService = {
  // Validate coupon code against cart total, paymentMethod & user email
  validateCoupon: async (code: string, cartTotal: number, email?: string, paymentMethod?: string) => {
    const response = await API.post('/coupons/validate', {
      code,
      cartTotal,
      email,
      paymentMethod
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

  // Admin: Update coupon
  updateCoupon: async (id: string, couponData: Partial<CouponData>) => {
    const response = await API.put(`/coupons/${id}`, couponData);
    return response.data;
  },

  // Admin: Delete coupon
  deleteCoupon: async (id: string) => {
    const response = await API.delete(`/coupons/${id}`);
    return response.data;
  }
};
