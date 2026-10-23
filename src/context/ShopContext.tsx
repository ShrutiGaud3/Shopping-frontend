import React, { createContext, useContext, useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import type { Product, Category, CartItem, Order, FilterState, User, StitchOption, ShippingZone } from '../types';
import {
  registerThunk,
  loginThunk,
  getMeThunk,
  updateUserProfileThunk,
  logout as logoutAction
} from '../store/slices/authSlice';
import {
  fetchProductsThunk,
  createProductThunk,
  updateProductThunk,
  deleteProductThunk
} from '../store/slices/productSlice';
import {
  fetchCategoriesThunk
} from '../store/slices/categorySlice';
import {
  fetchCartThunk,
  addToCartThunk,
  updateCartItemThunk,
  removeFromCartThunk,
  clearCartThunk,
  addToCartLocal,
  removeFromCartLocal,
  updateCartQuantityLocal,
  clearCartLocal
} from '../store/slices/cartSlice';
import {
  fetchWishlistThunk,
  toggleWishlistThunk,
  toggleWishlistLocal
} from '../store/slices/wishlistSlice';
import {
  validateCouponThunk,
  fetchCouponsThunk,
  createCouponThunk,
  deleteCouponThunk,
  removeCoupon as removeCouponAction
} from '../store/slices/couponSlice';
import type { CouponData } from '../services/couponService';
import {
  createOrderThunk,
  fetchMyOrdersThunk,
  fetchAllOrdersAdminThunk,
  updateOrderStatusThunk,
  requestExchangeThunk,
  updateOrderStatusLocal
} from '../store/slices/orderSlice';
import { shippingZoneService } from '../services/shippingZoneService';
import {
  setSearchQuery as setSearchQueryAction,
  setFilterState as setFilterStateAction,
  resetFilters as resetFiltersAction,
  showToast as showToastAction,
  clearToast as clearToastAction
} from '../store/slices/uiSlice';

import {
  fetchReviewsThunk,
  fetchAllReviewsThunk,
  createReviewThunk,
  deleteReviewThunk
} from '../store/slices/reviewSlice';
import type { Review } from '../types';

import { adminService } from '../services/adminService';

interface ShopContextType {
  user: User | null;
  token: string | null;
  products: Product[];
  categories: Category[];
  loadingProducts: boolean;
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  reviews: Review[];
  appliedCoupon: { code: string; discount: number; message: string } | null;
  availableCoupons: CouponData[];
  shippingZones: ShippingZone[];
  fetchShippingZones: () => Promise<void>;
  searchQuery: string;
  toast: string | null;
  filterState: FilterState;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  fetchProducts: () => Promise<void>;
  addToCart: (product: Product, size?: string, color?: string, quantity?: number, stitchOption?: StitchOption) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateCartQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  validateCoupon: (code: string, cartTotal: number, paymentMethod?: string) => Promise<{ success: boolean; message?: string }>;
  removeCoupon: () => void;
  fetchCoupons: () => Promise<void>;
  createCoupon: (couponData: Partial<CouponData>) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  showToast: (msg: string) => void;
  placeOrder: (
    shippingAddress: Order['shippingAddress'],
    paymentMethod: Order['paymentMethod'],
    onlinePaymentDetails?: { paymentId?: string; razorpayOrderId?: string; signature?: string }
  ) => Promise<Order>;
  requestExchange: (orderId: string, reason: string, notes?: string) => Promise<{ success: boolean; message?: string }>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updated: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  fetchAllOrdersAdmin: () => Promise<void>;
  updateStock: (productId: string, newStock: number, productName?: string) => Promise<void>;
  fetchReviews: (productId: string) => Promise<void>;
  fetchAllReviews: () => Promise<void>;
  addReview: (productId: string, rating: number, comment: string) => Promise<{ success: boolean; message?: string }>;
  deleteReview: (reviewId: string) => Promise<void>;
  allReviews: Review[];
  updateProfile: (data: { name?: string; phone?: string; password?: string; addresses?: any[] }) => Promise<{ success: boolean; message?: string }>;
  allUsers: any[];
  fetchAllUsers: () => Promise<void>;
  deleteUserAdmin: (userId: string) => Promise<void>;
}


const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();

  // Selectors from Redux Store
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { products, loading: loadingProducts } = useSelector((state: RootState) => state.products);
  const { categories } = useSelector((state: RootState) => state.categories);
  const { items: cart } = useSelector((state: RootState) => state.cart);
  const { productIds: wishlist } = useSelector((state: RootState) => state.wishlist);
  const { orders } = useSelector((state: RootState) => state.orders);
  const { searchQuery, filterState, toastMessage: toast } = useSelector((state: RootState) => state.ui);
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);

  const fetchShippingZones = useCallback(async () => {
    try {
      const res = await shippingZoneService.getShippingZones();
      if (res.success && res.data) {
        setShippingZones(res.data);
      }
    } catch (err) {
      console.error('Failed to load shipping zones', err);
    }
  }, []);

  // Auto load user session, categories, promo coupons, and shipping zones on mount
  useEffect(() => {
    dispatch(getMeThunk());
    dispatch(fetchCategoriesThunk());
    dispatch(fetchCouponsThunk());
    fetchShippingZones();
  }, [dispatch, fetchShippingZones]);

  useEffect(() => {
    if (token) {
      dispatch(fetchWishlistThunk());
      dispatch(fetchCartThunk());
    }
  }, [dispatch, token]);


  // Load products whenever filters/search changes
  useEffect(() => {
    const params: any = {};
    if (searchQuery) params.search = searchQuery;
    if (filterState.categories.length > 0) params.category = filterState.categories.join(',');
    if (filterState.genders.length > 0) params.gender = filterState.genders.join(',');
    if (filterState.sizes.length > 0) params.size = filterState.sizes.join(',');
    if (filterState.colors.length > 0) params.color = filterState.colors.join(',');
    if (filterState.brands.length > 0) params.brand = filterState.brands.join(',');
    if (filterState.minDiscount > 0) params.minDiscount = filterState.minDiscount;
    if (filterState.priceRange[0] > 0) params.minPrice = filterState.priceRange[0];
    if (filterState.priceRange[1] < 10000) params.maxPrice = filterState.priceRange[1];

    if (filterState.fabrics && filterState.fabrics.length > 0) params.fabric = filterState.fabrics.join(',');
    if (filterState.occasions && filterState.occasions.length > 0) params.occasion = filterState.occasions.join(',');

    if (filterState.sortBy === 'price-low') params.sort = 'priceLow';
    if (filterState.sortBy === 'price-high') params.sort = 'priceHigh';
    if (filterState.sortBy === 'newest') params.sort = 'newest';
    if (filterState.sortBy === 'discount') params.sort = 'discount';
    params.limit = 100;

    dispatch(fetchProductsThunk(params));
  }, [dispatch, searchQuery, JSON.stringify(filterState)]);

  const showToast = (message: string) => {
    dispatch(showToastAction(message));
    setTimeout(() => {
      dispatch(clearToastAction());
    }, 3000);
  };

  const fetchProducts = async () => {
    await dispatch(fetchProductsThunk(undefined));
  };

  // Auth Functions via Redux Thunks
  const login = async (email: string, password: string) => {
    const res = await dispatch(loginThunk({ email, password }));
    if (loginThunk.fulfilled.match(res)) {
      showToast(`Welcome back, ${res.payload.user?.name || 'User'}! ✨`);
      return { success: true };
    }
    const errorMsg = (res.payload as string) || 'Login failed';
    showToast(errorMsg);
    return { success: false, message: errorMsg };
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    const res = await dispatch(registerThunk({ name, email, phone, password }));
    if (registerThunk.fulfilled.match(res)) {
      showToast(`Account created! Welcome, ${res.payload.user?.name || 'User'}! 🎉`);
      return { success: true };
    }
    const errorMsg = (res.payload as string) || 'Registration failed';
    showToast(errorMsg);
    return { success: false, message: errorMsg };
  };

  const logout = () => {
    dispatch(logoutAction());
    showToast('Logged out successfully');
  };

  // Auto load cart, wishlist & orders on user login
  useEffect(() => {
    if (user && token && user.role !== 'admin') {
      dispatch(fetchCartThunk());
      dispatch(fetchWishlistThunk());
      dispatch(fetchMyOrdersThunk());
    }
  }, [dispatch, user, token]);

  // Cart Functions via Redux Thunks + Fallback Local Dispatching
  const addToCart = async (product: Product, size?: string, color?: string, quantity: number = 1, stitchOption?: StitchOption) => {
    const stock = product.stock !== undefined ? product.stock : 25;
    if (stock === 0) {
      showToast(`Sorry, "${product.name}" is Out of Stock ❌`);
      return;
    }

    const targetSize = size || product.sizes[0] || 'M';
    const targetColor = color || product.colors[0]?.name || 'Default';
    const targetStitch = stitchOption?.type || '';

    const existingItem = cart.find(
      (i) => (i.product.id === product.id || (i.product as any)._id === product.id) &&
             i.selectedSize === targetSize &&
             i.selectedColor === targetColor &&
             (i.selectedStitchOption?.type || '') === targetStitch
    );

    const currentInCart = existingItem ? existingItem.quantity : 0;

    if (currentInCart >= stock) {
      showToast(`Only ${stock} unit(s) available in stock! ⚠️`);
      return;
    }

    const qtyToAdd = Math.min(quantity, stock - currentInCart);

    if (user && token) {
      await dispatch(addToCartThunk({ product, size: targetSize, color: targetColor, quantity: qtyToAdd, stitchOption }));
    } else {
      dispatch(addToCartLocal({ product, size: targetSize, color: targetColor, quantity: qtyToAdd, stitchOption }));
    }
    showToast(`Added "${product.name}" to Bag! 🛍️`);
  };

  const removeFromCart = async (productId: string, size: string, color: string) => {
    if (user && token) {
      await dispatch(removeFromCartThunk({ productId, size, color }));
    } else {
      dispatch(removeFromCartLocal({ productId, size, color }));
    }
    showToast('Item removed from Bag');
  };

  const updateCartQuantity = async (productId: string, size: string, color: string, quantity: number) => {
    const item = cart.find((i) => (i.product.id === productId || (i.product as any)._id === productId) && i.selectedSize === size && i.selectedColor === color);
    const stock = item?.product?.stock !== undefined ? item.product.stock : 25;

    if (quantity > stock) {
      showToast(`Only ${stock} unit(s) in stock! ⚠️`);
    }

    const targetQty = Math.min(quantity, stock);

    if (user && token) {
      await dispatch(updateCartItemThunk({ productId, quantity: targetQty, size, color }));
    } else {
      dispatch(updateCartQuantityLocal({ productId, size, color, quantity: targetQty }));
    }
  };

  // Wishlist Functions via Redux Thunks + Fallback Local Dispatching
  const toggleWishlist = async (productId: string) => {
    const exists = wishlist.includes(productId);
    if (user && token) {
      await dispatch(toggleWishlistThunk(productId));
    } else {
      dispatch(toggleWishlistLocal(productId));
    }
    if (exists) {
      showToast('Removed from Wishlist');
    } else {
      showToast('Saved to Wishlist ❤️');
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Search & Filter Functions via Redux
  const setSearchQuery = useCallback((query: string) => {
    dispatch(setSearchQueryAction(query));
    dispatch((dispatch: any, getState: any) => {
      const current = getState().ui.filterState;
      dispatch(setFilterStateAction({ ...current, searchQuery: query }));
    });
  }, [dispatch]);

  const setFilterState = useCallback((action: React.SetStateAction<FilterState>) => {
    dispatch((dispatch: any, getState: any) => {
      const currentFilter = getState().ui.filterState;
      const nextFilters = typeof action === 'function' ? action(currentFilter) : action;
      dispatch(setFilterStateAction(nextFilters));
    });
  }, [dispatch]);

  const resetFilters = useCallback(() => {
    dispatch(resetFiltersAction());
  }, [dispatch]);

  // Orders Functions via Redux Thunks + Fallback Local Dispatching
  const placeOrder = async (
    shippingAddress: Order['shippingAddress'],
    paymentMethod: Order['paymentMethod'],
    onlinePaymentDetails?: { paymentId?: string; razorpayOrderId?: string; signature?: string }
  ): Promise<Order> => {
    const orderPayload = {
      items: cart.map((i) => ({
        product: i.product.id || (i.product as any)._id,
        id: i.product.id || (i.product as any)._id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        size: i.selectedSize,
        color: i.selectedColor,
        image: i.product.image || (i.product.images && i.product.images[0]),
        stitchOption: i.selectedStitchOption
      })),
      shippingAddress: {
        address: shippingAddress.street || shippingAddress.address,
        street: shippingAddress.street || shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state || '',
        pincode: shippingAddress.pincode,
        phone: shippingAddress.phone,
        fullName: shippingAddress.fullName,
        country: shippingAddress.country || 'India'
      },
      paymentMethod,
      couponCode: appliedCoupon?.code || '',
      paymentId: onlinePaymentDetails?.paymentId || '',
      razorpayOrderId: onlinePaymentDetails?.razorpayOrderId || '',
      paymentSignature: onlinePaymentDetails?.signature || ''
    };

    if (!user) {
      showToast('Please sign in to complete your order ✨');
      throw new Error('Authentication required: Please sign in to place an order.');
    }

    // Verify coupon single use per customer before dispatching order
    if (appliedCoupon?.code) {
      const upperCode = appliedCoupon.code.trim().toUpperCase();
      const alreadyUsed = orders.some(
        (o: any) =>
          (o.couponCode && o.couponCode.trim().toUpperCase() === upperCode) ||
          (o.coupon && o.coupon.trim().toUpperCase() === upperCode)
      );
      if (alreadyUsed) {
        const errorMsg = `You have already redeemed coupon '${upperCode}' on a previous order. Each coupon can only be used once.`;
        showToast(errorMsg);
        throw new Error(errorMsg);
      }
    }

    let createdOrder: Order | null = null;

    const res = await dispatch(createOrderThunk(orderPayload));
    if (createOrderThunk.fulfilled.match(res)) {
      createdOrder = res.payload;
      if (user && user.role === 'admin') {
        dispatch(fetchAllOrdersAdminThunk());
      } else if (user) {
        dispatch(fetchMyOrdersThunk());
      }
    } else {
      const errMsg = (res.payload as string) || 'Failed to place order. Please try again.';
      showToast(errMsg);
      throw new Error(errMsg);
    }

    if (user && token) {
      dispatch(clearCartThunk());
    } else {
      dispatch(clearCartLocal());
    }
    showToast('Order placed successfully! 🎉');
    return createdOrder;
  };

  // Customer Request Exchange (10 days from delivery)
  const requestExchange = async (orderId: string, reason: string, notes?: string) => {
    try {
      const res = await dispatch(requestExchangeThunk({ orderId, reason, notes }));
      if (requestExchangeThunk.fulfilled.match(res)) {
        showToast('Exchange request submitted successfully! 📦');
        if (user) dispatch(fetchMyOrdersThunk());
        return { success: true };
      }
      const errorMsg = (res.payload as string) || 'Failed to submit exchange request';
      showToast(errorMsg);
      return { success: false, message: errorMsg };
    } catch (err: any) {
      showToast(err.message || 'Exchange request error');
      return { success: false, message: err.message };
    }
  };

  // Admin Product Actions via Redux Thunks
  const addProduct = async (newProd: Omit<Product, 'id'>) => {
    try {
      const res = await dispatch(createProductThunk(newProd));
      if (createProductThunk.fulfilled.match(res)) {
        showToast(`Product "${res.payload.name}" created! 🎉`);
        dispatch(fetchProductsThunk(undefined));
      } else {
        showToast((res.payload as string) || 'Failed to create product');
      }
    } catch (err: any) {
      showToast(err.message || 'Product creation error');
    }
  };

  const updateProduct = async (id: string, updated: Partial<Product>) => {
    try {
      const res = await dispatch(updateProductThunk({ id, data: updated }));
      if (updateProductThunk.fulfilled.match(res)) {
        showToast('Product updated successfully! ✨');
        dispatch(fetchProductsThunk(undefined));
      } else {
        showToast('Failed to update product');
      }
    } catch (err) {
      showToast('Product update error');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await dispatch(deleteProductThunk(id));
      if (deleteProductThunk.fulfilled.match(res)) {
        showToast('Product deleted successfully!');
        dispatch(fetchProductsThunk(undefined));
      }
    } catch (err) {
      showToast('Failed to delete product');
    }
  };

  const { appliedCoupon, availableCoupons } = useSelector((state: RootState) => state.coupons);

  // Coupon Functions via Redux Thunks (Single use per user check + paymentMethod compatibility)
  const validateCoupon = async (code: string, cartTotal: number, paymentMethod?: string) => {
    const upperCode = code.toUpperCase();
    
    // Check if user already used this coupon in local past orders
    const alreadyUsed = orders.some(
      (o: any) =>
        (o.couponCode && o.couponCode.toUpperCase() === upperCode) ||
        (o.coupon && o.coupon.toUpperCase() === upperCode)
    );

    if (alreadyUsed) {
      const errorMsg = `You have already used coupon code '${upperCode}' on a previous order.`;
      showToast(errorMsg);
      return { success: false, message: errorMsg };
    }

    const res = await dispatch(validateCouponThunk({ code: upperCode, cartTotal, email: user?.email, paymentMethod }));
    if (validateCouponThunk.fulfilled.match(res)) {
      showToast(res.payload.message || `Coupon '${upperCode}' applied! 🎉`);
      return { success: true };
    }
    const errorMsg = (res.payload as string) || 'Invalid coupon code';
    showToast(errorMsg);
    return { success: false, message: errorMsg };
  };


  const removeCoupon = () => {
    dispatch(removeCouponAction());
    showToast('Coupon removed');
  };

  const fetchCoupons = async () => {
    await dispatch(fetchCouponsThunk());
  };

  const createCoupon = async (couponData: Partial<CouponData>) => {
    const res = await dispatch(createCouponThunk(couponData));
    if (createCouponThunk.fulfilled.match(res)) {
      showToast('Coupon created successfully! 🎉');
    }
  };

  const deleteCoupon = async (id: string) => {
    const res = await dispatch(deleteCouponThunk(id));
    if (deleteCouponThunk.fulfilled.match(res)) {
      showToast('Coupon deleted');
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    dispatch(updateOrderStatusLocal({ orderId, status }));
    try {
      await dispatch(updateOrderStatusThunk({ orderId, status }));
    } catch (err) {
      // Local state updated
    }
    showToast(`Order status updated to ${status}`);
  };

  const fetchAllOrdersAdmin = async () => {
    await dispatch(fetchAllOrdersAdminThunk());
  };

  const updateStock = async (productId: string, newStock: number, productName?: string) => {
    try {
      await adminService.updateInventoryStock(productId, newStock, productName);
      dispatch(fetchProductsThunk(undefined));
    } catch (err) {
      // Stock updated
    }
    showToast(`Stock updated to ${newStock} units! 📦`);
  };

  const { reviews, allReviews } = useSelector((state: RootState) => state.reviews);

  const fetchReviews = async (productId: string) => {
    await dispatch(fetchReviewsThunk(productId));
  };

  const fetchAllReviews = async () => {
    await dispatch(fetchAllReviewsThunk());
  };

  const addReview = async (productId: string, rating: number, comment: string) => {
    const res = await dispatch(createReviewThunk({ productId, rating, comment }));
    if (createReviewThunk.fulfilled.match(res)) {
      showToast('Thank you! Review submitted! ⭐');
      return { success: true };
    }
    const errorMsg = (res.payload as string) || 'Could not submit review';
    showToast(errorMsg);
    return { success: false, message: errorMsg };
  };

  const deleteReview = async (reviewId: string) => {
    const res = await dispatch(deleteReviewThunk(reviewId));
    if (deleteReviewThunk.fulfilled.match(res)) {
      showToast('Review deleted');
    }
  };

  const updateProfile = async (data: { name?: string; phone?: string; password?: string; addresses?: any[] }) => {
    const res = await dispatch(updateUserProfileThunk(data));
    if (updateUserProfileThunk.fulfilled.match(res)) {
      showToast('Profile updated successfully! ✨');
      return { success: true };
    }
    const errorMsg = (res.payload as string) || 'Failed to update profile';
    showToast(errorMsg);
    return { success: false, message: errorMsg };
  };

  const [allUsers, setAllUsers] = useState<any[]>([]);

  const fetchAllUsers = async () => {
    try {
      const res = await adminService.getAllUsers();
      if (res.success && Array.isArray(res.data)) {
        setAllUsers(res.data);
      }
    } catch (err) {
      // Ignore
    }
  };

  const deleteUserAdmin = async (userId: string) => {
    try {
      await adminService.deleteUser(userId);
      setAllUsers((prev: any[]) => prev.filter((u: any) => u._id !== userId && u.id !== userId));
      showToast('User account deleted');
    } catch (err) {
      showToast('Failed to delete user');
    }
  };

  return (
    <ShopContext.Provider
      value={{
        user,
        token,
        products,
        categories,
        loadingProducts,
        cart,
        wishlist,
        orders,
        reviews,
        allReviews,
        appliedCoupon,
        availableCoupons,
        shippingZones,
        fetchShippingZones,
        searchQuery,
        toast,
        filterState,
        login,
        register,
        logout,
        fetchProducts,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleWishlist,
        isInWishlist,
        validateCoupon,
        removeCoupon,
        fetchCoupons,
        createCoupon,
        deleteCoupon,
        setSearchQuery,
        setFilterState,
        resetFilters,
        showToast,
        placeOrder,
        requestExchange,
        addProduct,

        updateProduct,
        deleteProduct,
        updateOrderStatus,
        fetchAllOrdersAdmin,
        updateStock,
        fetchReviews,
        fetchAllReviews,
        addReview,
        deleteReview,
        updateProfile,
        allUsers,
        fetchAllUsers,
        deleteUserAdmin
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
