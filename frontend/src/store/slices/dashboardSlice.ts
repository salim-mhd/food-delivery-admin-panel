import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../lib/axios';
import { DashboardSummary } from '../../types/types';

export interface DashboardState {
  summary: DashboardSummary;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  summary: { totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0 },
  loading: false,
  error: null,
};

export const fetchDashboard = createAsyncThunk<DashboardSummary>('dashboard/fetch', async () => {
  const res = await api.get<DashboardSummary>('dashboard');
  return res.data;
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    resetDashboardState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action: PayloadAction<DashboardSummary>) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch dashboard';
      });
  }
});

export const { resetDashboardState } = dashboardSlice.actions;
export default dashboardSlice.reducer;


