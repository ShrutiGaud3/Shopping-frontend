import API from './api';
import type { Order } from '../types';

export const adaptBackendOrder = (item: any): Order => {
  const primaryId = item._id || item.id || item.orderId;
  const displayOrderId = item.orderId || item._id || item.id || `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    id: primaryId,
    _id: item._id || primaryId,
    orderId: displayOrderId,
    date: item.createdAt
      ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : (item.date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })),
    customerName: item.customerName || item.shippingAddress?.fullName || 'Customer',
    customerEmail: item.customerEmail || 'customer@example.com',
    customerPhone: item.customerPhone || item.shippingAddress?.phone || '',
    items: (item.items || []).map((i: any) => {
      const prodObj = typeof i.product === 'object' && i.product !== null ? i.product : null;
      const prodId = prodObj?._id || i.product || i.id || 'prod-1';
      const prodName = i.name || prodObj?.name || 'Fashion Item';
      const prodImage = i.image || prodObj?.images?.[0] || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80';

      return {
        product: {
          id: prodId,
          name: prodName,
          brand: prodObj?.brand || 'Velora Studio',
          category: prodObj?.category || 'Clothing',
          price: i.price !== undefined ? i.price : (prodObj?.price || 1299),
          originalPrice: prodObj?.originalPrice || i.price || 1999,
          discountPercent: prodObj?.discountPercent || 0,
          rating: prodObj?.rating || 4.5,
          reviewsCount: prodObj?.reviewsCount || 0,
          image: prodImage,
          images: prodObj?.images || [prodImage],
          colors: prodObj?.colors || [{ name: i.color || 'Default', hex: '#000000' }],
          sizes: prodObj?.sizes || [i.size || 'M'],
          description: prodObj?.description || ''
        },
        selectedSize: i.size || 'M',
        selectedColor: i.color || 'Default',
        quantity: i.quantity || 1
      };
    }),
    totalAmount: item.totalAmount || 0,
    discountAmount: item.discount || item.discountAmount || 0,
    shippingFee: item.shippingCharge || item.shippingFee || 0,
    status: item.orderStatus || item.status || 'Confirmed',
    paymentMethod: item.paymentMethod || 'COD',
    shippingAddress: {
      fullName: item.shippingAddress?.fullName || item.customerName || '',
      street: item.shippingAddress?.street || item.shippingAddress?.address || '',
      city: item.shippingAddress?.city || '',
      state: item.shippingAddress?.state || '',
      pincode: item.shippingAddress?.pincode || '',
      phone: item.shippingAddress?.phone || item.customerPhone || ''
    }
  };
};

export const orderService = {
  // Create customer order (Checkout)
  createOrder: async (orderPayload: any) => {
    const response = await API.post('/orders', orderPayload);
    if (response.data && response.data.data) {
      return {
        success: true,
        data: adaptBackendOrder(response.data.data)
      };
    }
    return { success: false, data: null };
  },

  // Get customer orders
  getMyOrders: async () => {
    const response = await API.get('/orders');
    if (response.data && Array.isArray(response.data.data)) {
      return {
        success: true,
        data: response.data.data.map(adaptBackendOrder)
      };
    }
    return { success: false, data: [] };
  },

  // Get single order details
  getOrderById: async (id: string) => {
    const response = await API.get(`/orders/${id}`);
    if (response.data && response.data.data) {
      return {
        success: true,
        data: adaptBackendOrder(response.data.data)
      };
    }
    return { success: false, data: null };
  },

  // Admin: Get all orders
  getAllOrdersAdmin: async () => {
    const response = await API.get('/admin/orders');
    if (response.data && Array.isArray(response.data.data)) {
      return {
        success: true,
        data: response.data.data.map(adaptBackendOrder)
      };
    }
    return { success: false, data: [] };
  },

  // Admin: Update order status
  updateOrderStatusAdmin: async (orderId: string, status: string) => {
    const response = await API.put(`/admin/orders/${orderId}/status`, { status });
    if (response.data && response.data.data) {
      return {
        success: true,
        data: adaptBackendOrder(response.data.data)
      };
    }
    return { success: false, data: null };
  }
};
