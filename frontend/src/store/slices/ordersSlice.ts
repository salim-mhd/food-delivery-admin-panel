import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../lib/axios';
import { Order, OrderItem } from '../../types/types';

export interface OrdersState {
  items: Order[];
  creating: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  items: [],
  creating: false,
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk<Order[]>('orders/fetchAll', async () => {
  const res = await api.get<Order[]>('orders');
  return res.data;
});

export const createOrder = createAsyncThunk<Order, { userId: string; items: OrderItem[]; totalAmount: number }>(
  'orders/create',
  async (payload) => {
    const res = await api.post<Order>('orders', payload);
    return res.data;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrdersState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      })

      .addCase(createOrder.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.creating = false;
        state.items.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.creating = false;
        state.error = action.error.message || 'Failed to create order';
      });
  }
});

export const { resetOrdersState } = ordersSlice.actions;
export default ordersSlice.reducer;


