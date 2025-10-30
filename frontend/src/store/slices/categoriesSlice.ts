import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../lib/axios';
import { Category } from '../../types/types';

export interface CategoriesState {
  items: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk<Category[]>('categories/fetchAll', async () => {
  const res = await api.get<Category[]>('categories');
  return res.data;
});

export const createCategory = createAsyncThunk<Category, Partial<Category>>('categories/create', async (payload) => {
  const res = await api.post<Category>('categories', payload);
  return res.data;
});

export const updateCategory = createAsyncThunk<Category, { id: string; data: Partial<Category> }>('categories/update', async ({ id, data }) => {
  const res = await api.put<Category>(`categories/${id}`, data);
  return res.data;
});

export const deleteCategory = createAsyncThunk<string, string>('categories/delete', async (id) => {
  await api.delete(`categories/${id}`);
  return id;
});

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    resetCategoriesState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      })
      .addCase(createCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        const idx = state.items.findIndex(c => c._id === action.payload._id);
        if (idx > -1) state.items[idx] = action.payload;
      })
      .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter(c => c._id !== action.payload);
      });
  }
});

export const { resetCategoriesState } = categoriesSlice.actions;
export default categoriesSlice.reducer;


