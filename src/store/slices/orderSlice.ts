import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { orderService } from '../../services/orderService';
import type { Order } from '../../types';

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null
};

// Async Thunks for Order APIs
export const createOrderThunk = createAsyncThunk(
  'orders/createOrder',
  async (orderPayload: any, { rejectWithValue }) => {
    try {
      const res = await orderService.createOrder(orderPayload);
      if (res.success && res.data) {
        return res.data;
      }
      return rejectWithValue('Failed to place order');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Checkout error');
    }
  }
);

export const fetchMyOrdersThunk = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const res = await orderService.getMyOrders();
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
      return [];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch orders');
    }
  }
);

export const fetchAllOrdersAdminThunk = createAsyncThunk(
  'orders/fetchAllOrdersAdmin',
  async (_, { rejectWithValue }) => {
    try {
      const res = await orderService.getAllOrdersAdmin();
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
      return [];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch admin orders');
    }
  }
);

export const updateOrderStatusThunk = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }: { orderId: string; status: Order['status'] }, { rejectWithValue }) => {
    try {
      const res = await orderService.updateOrderStatusAdmin(orderId, status);
      if (res.success && res.data) {
        return res.data;
      }
      return rejectWithValue('Failed to update order status');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Status update error');
    }
  }
);

export const requestExchangeThunk = createAsyncThunk(
  'orders/requestExchange',
  async (
    { orderId, reason, notes }: { orderId: string; reason: string; notes?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await orderService.requestExchange(orderId, reason, notes);
      if (res.success && res.data) {
        return res.data;
      }
      return rejectWithValue(res.message || 'Failed to submit exchange request');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Exchange request error');
    }
  }
);


const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrderLocal: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
    },
    updateOrderStatusLocal: (
      state,
      action: PayloadAction<{ orderId: string; status: Order['status'] }>
    ) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(
        (o) => o.id === orderId || o._id === orderId || o.orderId === orderId
      );
      if (order) {
        order.status = status;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Customer Orders
      .addCase(fetchMyOrdersThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrdersThunk.rejected, (state) => {
        state.loading = false;
      })
      // Fetch Admin Orders
      .addCase(fetchAllOrdersAdminThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrdersAdminThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrdersAdminThunk.rejected, (state) => {
        state.loading = false;
      })
      // Create Order
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.orders.unshift(action.payload);
      })
      // Update Order Status
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        const updated = action.payload as any;
        const argOrderId = action.meta.arg.orderId;
        const argStatus = action.meta.arg.status;

        const target = state.orders.find(
          (o: any) =>
            o.id === updated.id ||
            o._id === updated._id ||
            o.orderId === updated.orderId ||
            o.id === argOrderId ||
            o._id === argOrderId ||
            o.orderId === argOrderId
        );

        if (target) {
          target.status = updated.status || argStatus;
          if (updated.orderStatus) target.status = updated.orderStatus;
        }
      })
      // Request Exchange
      .addCase(requestExchangeThunk.fulfilled, (state, action) => {
        const updated = action.payload as any;
        const target = state.orders.find(
          (o: any) =>
            o.id === updated.id ||
            o._id === updated._id ||
            o.orderId === updated.orderId
        );
        if (target) {
          target.exchangeStatus = updated.exchangeStatus || 'requested';
          target.exchangeReason = updated.exchangeReason;
          target.exchangeNotes = updated.exchangeNotes;
        }
      });
  }
});


export const { addOrderLocal, updateOrderStatusLocal } = orderSlice.actions;
export default orderSlice.reducer;
