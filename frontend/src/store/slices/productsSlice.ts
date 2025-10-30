import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../lib/axios';
import { Product } from '../../types/types';

export interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk<Product[]>('products/fetchAll', async () => {
  const res = await api.get<Product[]>('products');
  return res.data;
});

export const createProduct = createAsyncThunk<Product, Partial<Product>>('products/create', async (payload) => {
  const res = await api.post<Product>('products', payload);
  return res.data;
});

export const updateProduct = createAsyncThunk<Product, { id: string; data: Partial<Product> }>('products/update', async ({ id, data }) => {
  const res = await api.put<Product>(`products/${id}`, data);
  return res.data;
});

export const deleteProduct = createAsyncThunk<string, string>('products/delete', async (id) => {
  await api.delete(`products/${id}`);
  return id;
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetProductsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        const idx = state.items.findIndex(p => p._id === action.payload._id);
        if (idx > -1) state.items[idx] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter(p => p._id !== action.payload);
      });
  }
});

export const { resetProductsState } = productsSlice.actions;
export default productsSlice.reducer;


